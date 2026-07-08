import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useAuth from '@/hooks/use-auth';
import { showDialog } from '@/providers/dialog-provider';
import { visit } from '@laravext/react';
import axios from 'axios';
import { Check, Copy, TriangleAlert } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const CONFIRM_HOLD_SECONDS = 10;

export default function () {
    const { user, refreshUser } = useAuth();
    const hasTwoFactorEnabled = !!user?.two_factor_confirmed_at;
    const { t } = useTranslation();

    // Two-Factor Authentication Flow States
    const [isEnabling, setIsEnabling] = useState(false);
    const [qrCode, setQrCode] = useState(null);
    const [setupKey, setSetupKey] = useState(null);
    const [recoveryCodes, setRecoveryCodes] = useState([]);
    const [confirmationCode, setConfirmationCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Modal & Acknowledgment States
    const [showRecoveryModal, setShowRecoveryModal] = useState(false);
    const [copiedAll, setCopiedAll] = useState(false);
    const [ackStoredSafely, setAckStoredSafely] = useState(false);
    const [ackNeverShared, setAckNeverShared] = useState(false);
    const [secondsRemaining, setSecondsRemaining] = useState(CONFIRM_HOLD_SECONDS);
    const [barActive, setBarActive] = useState(false);
    const countdownRef = useRef(null);

    const bothAcknowledged = ackStoredSafely && ackNeverShared;
    const canContinue = bothAcknowledged && secondsRemaining === 0;

    // Timer Effect for the Modal
    useEffect(() => {
        if (!bothAcknowledged || !showRecoveryModal) {
            setSecondsRemaining(CONFIRM_HOLD_SECONDS);
            if (countdownRef.current) clearInterval(countdownRef.current);
            return;
        }

        countdownRef.current = setInterval(() => {
            setSecondsRemaining((current) => (current <= 1 ? 0 : current - 1));
        }, 1000);

        const doneTimeout = setTimeout(() => setSecondsRemaining(0), CONFIRM_HOLD_SECONDS * 1000);

        return () => {
            if (countdownRef.current) clearInterval(countdownRef.current);
            clearTimeout(doneTimeout);
        };
    }, [bothAcknowledged, showRecoveryModal]);

    // Progress Bar Animation Effect
    useEffect(() => {
        if (!bothAcknowledged || !showRecoveryModal) {
            setBarActive(false);
            return;
        }
        const raf = requestAnimationFrame(() => setBarActive(true));
        return () => cancelAnimationFrame(raf);
    }, [bothAcknowledged, showRecoveryModal]);

    const handleCopyAll = async () => {
        try {
            await navigator.clipboard.writeText(recoveryCodes.join('\n'));
            setCopiedAll(true);
            setTimeout(() => setCopiedAll(false), 2000);
        } catch (err) {
            console.error('Copy failed', err);
        }
    };

    // 1. Initiate Two-Factor Authentication
    const enableTwoFactor = async () => {
        setLoading(true);
        try {
            await axios.post('/api/auth/two-factor-authentication/enable');
            const response = await axios.get('/api/auth/two-factor-authentication/setup-data');

            setQrCode(response.data.svg);
            setSetupKey(response.data.secretKey);
            setIsEnabling(true);
        } catch (err) {
            console.error('Failed to initiate Two-Factor Authentication', err);
        } finally {
            setLoading(false);
        }
    };

    // 2. Confirm the 6-digit code
    const confirmTwoFactor = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('/api/auth/two-factor-authentication/confirm', {
                code: confirmationCode,
            });

            setRecoveryCodes(response.data.recovery_codes);
            setIsEnabling(false);

            // Pop the modal!
            setShowRecoveryModal(true);
            refreshUser();

            visit('/settings/two-factor-authentication', {
                preserveScroll: true,
                preserveState: true,
            });
        } catch (err) {
            setError(err.response?.data?.errors?.code?.[0] || t('Invalid code. Please try again.'));
        } finally {
            setLoading(false);
        }
    };

    // 3. Disable Two-Factor Authentication
    const disableTwoFactor = async () => {
        showDialog({
            title: t('Are you sure?'),
            cancelText: t('Cancel'),
            actionText: t('Confirm'),
            description: t('This action cannot be undone.'),
            onAction: async () => {
                setLoading(true);
                try {
                    await axios.post('/api/auth/two-factor-authentication/disable');
                    refreshUser();
                    // Hard visit to clear everything out
                    visit('/settings/two-factor-authentication');
                } catch (err) {
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            },
        });
    };

    return (
        <>
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-medium">{t('Two-Factor Authentication')}</h3>
                    <p className="text-muted-foreground text-sm">{t('Add additional security to your account using two-factor authentication.')}</p>
                </div>

                {/* STATE 1: Currently Disabled & Not Enabling */}
                {!hasTwoFactorEnabled && !isEnabling && (
                    <div>
                        <Button onClick={enableTwoFactor} disabled={loading}>
                            {t('Enable Two-Factor Authentication')}
                        </Button>
                    </div>
                )}

                {/* STATE 2: Confirming (Showing QR Code) */}
                {isEnabling && (
                    <div className="space-y-4 rounded-md border p-4">
                        <p className="text-sm font-medium">
                            {t(
                                "To finish enabling two-factor authentication, scan the following QR code using your phone's authenticator application or enter the setup key and provide the generated OTP code.",
                            )}
                        </p>

                        {qrCode && <div className="inline-block rounded-md bg-white p-2" dangerouslySetInnerHTML={{ __html: qrCode }} />}

                        {setupKey && (
                            <p className="text-sm">
                                <span className="font-semibold">{t('Setup Key')}:</span>{' '}
                                <code className="bg-muted rounded px-1 py-0.5">{setupKey}</code>
                            </p>
                        )}

                        <form onSubmit={confirmTwoFactor} className="mt-4 max-w-sm space-y-3">
                            <div className="space-y-2">
                                <Label htmlFor="code">{t('Code')}</Label>
                                <Input
                                    id="code"
                                    type="text"
                                    inputMode="numeric"
                                    autoFocus
                                    value={confirmationCode}
                                    onChange={(e) => setConfirmationCode(e.target.value)}
                                    placeholder="123456"
                                />
                                <InputError message={error} />
                            </div>
                            <Button type="submit" disabled={loading || confirmationCode.length < 6}>
                                {t('Confirm')}
                            </Button>
                        </form>
                    </div>
                )}

                {/* STATE 3: Fully Enabled (Background UI after closing Modal) */}
                {hasTwoFactorEnabled && (
                    <div className="space-y-6">
                        <div className="rounded-md bg-green-50 p-4 text-green-800 dark:bg-green-950 dark:text-green-300">
                            {t('Two-factor authentication is enabled.')}
                        </div>

                        {/* Renders in the background only after setup, just in case they closed the modal too fast */}
                        {!showRecoveryModal && recoveryCodes.length > 0 && (
                            <div className="space-y-4 rounded-md border p-4">
                                <div className="flex items-start gap-2 text-amber-600 dark:text-amber-500">
                                    <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0" />
                                    <p className="text-sm font-medium">
                                        {t(
                                            'These are your recovery codes. They are also here in case you forgot to save them from the dialog. Once you refresh or leave this page, they will be gone forever.',
                                        )}
                                    </p>
                                </div>
                                <div className="bg-muted grid grid-cols-2 gap-2 rounded-md p-4 text-center font-mono text-sm">
                                    {recoveryCodes.map((code) => (
                                        <div key={code}>{code}</div>
                                    ))}
                                </div>

                                <Button type="button" variant="outline" className="w-full" onClick={handleCopyAll}>
                                    {copiedAll ? (
                                        <>
                                            <Check className="mr-2 h-4 w-4 text-green-600" />
                                            {t('Copied all codes')}
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="mr-2 h-4 w-4" />
                                            {t('Copy all codes')}
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}
                        <div className="flex justify-end">
                        <Button variant="destructive" onClick={disableTwoFactor} disabled={loading}>
                            {t('Disable Two-Factor Authentication')}
                        </Button>

                        </div>
                    </div>
                )}
            </div>

            {/* THE STRICT RECOVERY MODAL */}
            <Dialog
                open={showRecoveryModal}
                onOpenChange={(open) => {
                    if (!open && canContinue) setShowRecoveryModal(false);
                }}
            >
                <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
                    <DialogHeader>
                        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500">
                            <TriangleAlert className="h-5 w-5" />
                            <DialogTitle>{t('Save these codes')}</DialogTitle>
                        </div>
                        <DialogDescription>
                            {t(
                                'Two-factor authentication is now active. If you lose your device, you will need one of these codes to recover your account.',
                            )}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        <div className="bg-muted/40 space-y-2 rounded-md border p-4 text-center font-mono text-sm">
                            {recoveryCodes.map((code) => (
                                <div key={code}>{code}</div>
                            ))}
                        </div>

                        <Button type="button" variant="outline" className="w-full" onClick={handleCopyAll}>
                            {copiedAll ? (
                                <>
                                    <Check className="mr-2 h-4 w-4 text-green-600" />
                                    {t('Copied all codes')}
                                </>
                            ) : (
                                <>
                                    <Copy className="mr-2 h-4 w-4" />
                                    {t('Copy all codes')}
                                </>
                            )}
                        </Button>

                        <div className="bg-muted/30 space-y-3 rounded-md border px-3 py-3">
                            <div className="flex items-start gap-2">
                                <Checkbox
                                    id="ack-stored-safely"
                                    checked={ackStoredSafely}
                                    onCheckedChange={(checked) => setAckStoredSafely(checked === true)}
                                    className="mt-0.5"
                                />
                                <Label htmlFor="ack-stored-safely" className="cursor-pointer text-sm leading-snug font-normal">
                                    {t('I understand I must store these codes as safely as a password, and I will never share them with anyone.')}
                                </Label>
                            </div>

                            <div className="flex items-start gap-2">
                                <Checkbox
                                    id="ack-never-shared"
                                    checked={ackNeverShared}
                                    onCheckedChange={(checked) => setAckNeverShared(checked === true)}
                                    className="mt-0.5"
                                />
                                <Label htmlFor="ack-never-shared" className="cursor-pointer text-sm leading-snug font-normal">
                                    {t('I understand that no one will ever legitimately ask me for any of these codes.')}
                                </Label>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            className="relative w-full overflow-hidden disabled:opacity-100"
                            style={!canContinue ? { backgroundColor: 'var(--neutral-600, #4b5563)' } : undefined}
                            disabled={!canContinue}
                            onClick={() => setShowRecoveryModal(false)}
                        >
                            {bothAcknowledged && (
                                <span
                                    aria-hidden="true"
                                    className="absolute inset-y-0 left-0 bg-white/20 transition-[width] ease-linear dark:bg-black/20"
                                    style={{ width: barActive ? '100%' : '0%', transitionDuration: `${CONFIRM_HOLD_SECONDS}s` }}
                                />
                            )}
                            <span className="relative z-10">
                                {bothAcknowledged && secondsRemaining > 0
                                    ? t('I have saved these codes securely ({{seconds}}s)', { seconds: secondsRemaining })
                                    : t('I have saved these codes securely')}
                            </span>
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
