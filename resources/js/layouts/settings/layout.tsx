import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn, currentRouteIs } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link, path } from '@laravext/react';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Profile',
        url: '/settings/profile',
        routeName: 'settings.profile',
        icon: null,
    },
    {
        title: 'Password',
        url: '/settings/password',
        routeName: 'settings.password',
        icon: null,
    },
    {
        title: 'Appearance',
        url: '/settings/appearance',
        routeName: 'settings.appearance',
        icon: null,
    },
    {
        title: 'Language',
        url: '/settings/language',
        routeName: 'settings.language',
        icon: null,
    },
    {
        title: 'Two-Factor Authentication',
        url: '/settings/two-factor-authentication',
        routeName: 'settings.two-factor-authentication',
        icon: null,
    },
    {
        title: 'Passkeys',
        url: '/settings/passkeys',
        routeName: 'settings.passkeys',
        icon: null,
    }
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="px-4 py-6">
            <Heading title="Settings" description="Manage your profile and account settings" />

            <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
                <aside className="w-full max-w-xl lg:w-52">
                    <nav className="flex flex-col space-y-1 space-x-0">
                        {sidebarNavItems.map((item) => (
                            <Button
                                key={item.routeName ? route(item.routeName) : item.url}
                                size="sm"
                                variant="ghost"
                                asChild
                                className={cn('w-full justify-start', {
                                    'bg-muted': item.routeName ? currentRouteIs(item.routeName) : path() === item.url,
                                })}
                            >
                                <Link href={item.routeName ? route(item.routeName) : item.url}>{item.title}</Link>
                            </Button>
                        ))}
                    </nav>
                </aside>

                <Separator className="my-6 md:hidden" />

                <div className="flex-1 md:max-w-2xl">
                    <section className="max-w-xl space-y-12">{children}</section>
                </div>
            </div>
        </div>
    );
}
