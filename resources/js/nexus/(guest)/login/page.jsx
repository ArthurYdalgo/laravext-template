import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useAuth from '@/hooks/use-auth';
import { useForm } from '@/hooks/use-form';
import AuthLayout from '@/layouts/auth-layout';
import { isEnvLocal } from '@/lib/utils';
import { Passkeys } from '@laravel/passkeys';
import { Head, Link, nexusProps, visit } from '@laravext/react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

export default function Login() {
    const { canResetPassword } = nexusProps();
    const { t } = useTranslation();
    const { refreshUser } = useAuth();

    // 2FA Flow States
    const [requiresTwoFactor, setRequiresTwoFactor] = useState(false);
    const [totpCode, setTotpCode] = useState('');
    const [totpError, setTotpError] = useState('');

    const { data, setData, errors, setErrors, processing, setProcessing } = useForm({
        email: isEnvLocal() ? 'test@email.com' : '',
        password: isEnvLocal() ? 'password' : '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        setProcessing(true);

        axios
            .post('/api/login', data)
            .then((response) => {
                if (response.data.two_factor_required) {
                    // Pause login, show 2FA input
                    setRequiresTwoFactor(true);
                    setProcessing(false);
                } else {
                    // Logged in successfully
                    refreshUser();
                    visit('/users', {
                        redirectToUrlIntended: true,
                    });
                }
            })
            .catch((error) => {
                setErrors(error.response?.data?.errors || {});
                setProcessing(false);
            });
    };

    const submitChallenge = (e) => {
        e.preventDefault();
        setProcessing(true);
        setTotpError('');

        axios
            .post('/api/login/challenge', { code: totpCode })
            .then(() => {
                refreshUser();
                visit('/users', {
                    redirectToUrlIntended: true,
                });
            })
            .catch((error) => {
                setTotpError(error.response?.data?.errors?.code?.[0] || t('Invalid code.'));
                setProcessing(false);
            });
    };

    const loginWithPasskey = async () => {
        setProcessing(true);
        try {
            await Passkeys.verify();
            refreshUser();
            visit('/users', {
                redirectToUrlIntended: true,
            });
        } catch (error) {
            console.error('Passkey verification failed:', error);
        } finally {
            setProcessing(false);
        }
    };

    const loginWithGoogle = () => {
        window.location.href = '/auth/google/redirect';
    };

    return (
        <AuthLayout title={t('Log in to your account')} description={t('Enter your email and password below to log in')}>
            <Head title={t('Log in')} />

            <div className="grid gap-6">
                {!requiresTwoFactor ? (
                    <form className="flex flex-col gap-6" onSubmit={submit}>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">{t('Email Address')}</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder={t('email@example.com')}
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">{t('Password')}</Label>
                                    {canResetPassword && (
                                        <TextLink href={route('forgot-password')} className="ml-auto text-sm" tabIndex={5}>
                                            {t('Forgot Your Password?')}
                                        </TextLink>
                                    )}
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder={t('Password')}
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                    checked={data.remember}
                                    onCheckedChange={(checked) => setData('remember', checked)}
                                />
                                <Label htmlFor="remember">{t('Remember me')}</Label>
                            </div>

                            <Button type="submit" className="mt-4 w-full" tabIndex={4} disabled={processing}>
                                {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                {t('Log in')}
                            </Button>
                        </div>
                    </form>
                ) : (
                    <form className="flex flex-col gap-6" onSubmit={submitChallenge}>
                        <div className="grid gap-2">
                            <Label htmlFor="totpCode">{t('Authentication Code')}</Label>
                            <Input
                                id="totpCode"
                                type="text"
                                inputMode="numeric"
                                required
                                autoFocus
                                value={totpCode}
                                onChange={(e) => setTotpCode(e.target.value)}
                                placeholder="123456"
                            />
                            <InputError message={totpError} />
                        </div>
                        <Button type="submit" className="mt-4 w-full" disabled={processing || totpCode.length < 6}>
                            {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                            {t('Verify Code')}
                        </Button>
                    </form>
                )}

                {/* Hide OAuth/Passkeys if they are currently entering a 2FA code */}
                {!requiresTwoFactor && (
                    <>
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background text-muted-foreground px-2">{t('Or continue with')}</span>
                            </div>
                        </div>

                        <Button variant="outline" type="button" disabled={processing} onClick={loginWithGoogle}>
                            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            {t('Google')}
                        </Button>

                        <Button variant="outline" type="button" disabled={processing} onClick={loginWithPasskey}>
                            <svg
                                className="mr-2 h-4 w-4"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M12 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
                                <path d="M7 22v-3a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v3" />
                                <path d="M21 13v-3a9 9 0 0 0-18 0v3" />
                            </svg>
                            {t('Use a Passkey')}
                        </Button>

                        <div className="text-muted-foreground text-center text-sm">
                            <Link href="/register" className="text-sm underline">
                                {t("Don't have an account?")}
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </AuthLayout>
    );
}
