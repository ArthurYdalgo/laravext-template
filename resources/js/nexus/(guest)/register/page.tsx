import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { Head, visit } from '@laravext/react';
import { useForm } from '@/hooks/use-form';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { isEnvLocal } from '@/lib/utils';

interface RegisterForm {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export default function Register() {
    const { data, setData, processing, errors, setErrors, reset, clearErrors } = useForm({
        name: isEnvLocal() ? 'User' : '',
        email: isEnvLocal () ? 'test@email.com' : '',
        password: isEnvLocal() ? 'password' : '',
        password_confirmation: isEnvLocal() ? 'password' : '',
    });

    const { t } = useTranslation();

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        clearErrors();

        axios.post('/api/register', data).then(() => {
            visit(route('dashboard'));
        }).catch((error) => {
            setErrors(error.response.data.errors);
        });
    };

    // OAuth redirects must happen at the browser level
    const loginWithGoogle = () => {
        window.location.href = '/auth/google/redirect';
    };

    return (
        <AuthLayout title={t("Create an account")} description={t("Enter your details below to create your account")}>
            <Head title={t("Register")} />
            
            <div className="grid gap-6">
                <form className="flex flex-col gap-6" onSubmit={submit}>
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">{t("Name")}</Label>
                            <Input
                                id="name"
                                type="text"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                disabled={processing}
                                placeholder={t("Full name")}
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">{t("Email address")}</Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                tabIndex={2}
                                autoComplete="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                disabled={processing}
                                placeholder={t("email@example.com")}
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">{t("Password")}</Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                tabIndex={3}
                                autoComplete="new-password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                disabled={processing}
                                placeholder={t("Password")}
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation">{t("Confirm password")}</Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                required
                                tabIndex={4}
                                autoComplete="new-password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                disabled={processing}
                                placeholder={t("Confirm password")}
                            />
                            <InputError message={errors.password_confirmation} />
                        </div>

                        <Button type="submit" className="mt-2 w-full" tabIndex={5} disabled={processing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                            {t("Create account")}
                        </Button>
                    </div>
                </form>

                {/* --- Divider --- */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                            {t("Or continue with")}
                        </span>
                    </div>
                </div>

                {/* --- Google Auth Button --- */}
                <Button 
                    variant="outline" 
                    type="button" 
                    disabled={processing}
                    onClick={loginWithGoogle}
                >
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
                    {t("Google")}
                </Button>

                <div className="text-muted-foreground text-center text-sm">
                    {t("Already have an account?")}{' '}
                    <TextLink href={route('login')} tabIndex={6}>
                        {t("Log in")}
                    </TextLink>
                </div>
            </div>
        </AuthLayout>
    );
}