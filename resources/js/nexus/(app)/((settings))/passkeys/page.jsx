import MomentDateTime from '@/components/moment-date-time';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { showDialog } from '@/providers/dialog-provider';
import { Passkeys } from '@laravel/passkeys';
import { nexusProps, visit } from '@laravext/react';
import axios from 'axios';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function PasskeysSettings() {
    const { passkeys } = nexusProps();
    const { t } = useTranslation();

    // State management
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [deviceName, setDeviceName] = useState('');
    const [deletingId, setDeletingId] = useState(null);

    const handleRegister = async () => {
        if (!deviceName.trim()) return;

        const finalPasskeyName = `${deviceName.trim()}`;

        setLoading(true);
        try {
            await Passkeys.register({ name: finalPasskeyName });

            setIsOpen(false);
            setDeviceName('');
            visit('/settings/passkeys');
        } catch (error) {
            let statusCode = error.response?.status;
            if (statusCode === 423) {
                showDialog({
                    title: t(
                        "It's been too long since you last confirmed your password, so you'll be prompted again before you can register a new passkey.",
                    ),
                    confirmText: t('OK'),
                    onAction: () => {
                        visit('/confirm-password?redirectTo=/settings/passkeys');
                    },
                });
            }

            console.error(t('Failed to register passkey'), error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (id) => {
        showDialog({
            title: t('Are you sure?'),
            description: t('This action cannot be undone.'),
            confirmText: t('Delete'),
            cancelText: t('Cancel'),
            onAction: async () => {
                setDeletingId(id);
                try {
                    await axios.delete(`/api/auth/passkeys/${id}`);
                    visit('/settings/passkeys', { preserveScroll: true });
                } catch (error) {
                    let statusCode = error.response?.status;
                    if (statusCode === 423) {
                        showDialog({
                            title: t("Attention"),
                            description: t(
                                "It's been too long since you last confirmed your password, so you'll be prompted again before you can remove a passkey.",
                            ),
                            confirmText: t('OK'),
                            onAction: () => {
                                visit('/confirm-password?redirectTo=/settings/passkeys');
                            },
                        });
                    }

                    console.error(t('Failed to remove passkey'), error);
                } finally {
                    setDeletingId(null);
                }
            },
        });
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">{t('Passkeys')}</h3>
                <p className="text-muted-foreground text-sm">{t('Authenticate securely with your fingerprint, face, or device PIN.')}</p>
            </div>

            {passkeys && passkeys.length > 0 ? (
                <ul className="space-y-3">
                    {passkeys.map((key) => (
                        <li key={key.id} className="flex items-center justify-between rounded-md border p-4">
                            <div className="flex flex-col">
                                <span className="font-medium">{key.name}</span>
                                <span className="text-muted-foreground text-sm">
                                    <MomentDateTime date={key.created_at} />
                                </span>
                            </div>
                            <Button variant="destructive" size="sm" disabled={deletingId === key.id} onClick={() => handleRemove(key.id)}>
                                {deletingId === key.id ? t('Deleting...') : t('Delete')}
                            </Button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-muted-foreground text-sm italic">{t('No passkeys registered yet.')}</p>
            )}

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button variant="default">{t('Register New Passkey')}</Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{t('Name your passkey')}</DialogTitle>
                        <DialogDescription>{t('Enter a recognizable name for this device.')}</DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                        <Input
                            id="deviceName"
                            placeholder={t('e.g., My Work MacBook')}
                            value={deviceName}
                            onChange={(e) => setDeviceName(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleRegister();
                            }}
                            autoFocus
                        />
                    </div>

                    <DialogFooter className="gap-2 sm:justify-end">
                        <Button type="button" variant="secondary" onClick={() => setIsOpen(false)} disabled={loading}>
                            {t('Cancel')}
                        </Button>
                        <Button type="button" onClick={handleRegister} disabled={loading || !deviceName.trim()}>
                            {loading ? t('Registering...') : t('Save Passkey')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
