import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { sharedProps } from '@laravext/react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { locales } from '@/lib/locale';

export default function LanguageToggleDropdown({ className = '', ...props }) {
    const { t, i18n } = useTranslation();
    const { user } = sharedProps().auth;

    useEffect(() => {
        if (user) {
            i18n.changeLanguage(user.locale);
        }
    }, [user]);

    const handleLocaleChange = (locale) => {
        i18n.changeLanguage(locale);

        Cookies.set('locale', locale);

        if (user) {
            axios.post('/api/auth/user', {
                locale,
            });
        }
    };

    const getLanguageIcon = (locale) => {
        return <img src={locales[locale]?.flag} alt={locales[locale]?.locale} className="h-5 w-5" />;
    };

    return (
        <div className={className} {...props}>
            <DropdownMenu>
                <DropdownMenuTrigger className='cursor-pointer' asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-md">
                        {getLanguageIcon(i18n.language)}
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {Object.values(locales).map((locale) => (
                        <DropdownMenuItem className='cursor-pointer' key={locale.locale} onClick={() => handleLocaleChange(locale.locale)}>
                            <span className="flex items-center space-x-2">
                                {getLanguageIcon(locale.locale)}
                                <span>{locale.name}</span>
                            </span>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
