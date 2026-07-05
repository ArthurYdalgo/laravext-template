import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';

import LanguageTabs from '@/components/language-tabs';
import { Head } from '@laravext/react';
import PageMeta from '@/components/page-meta';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Language settings',
        href: '/settings/language',
    },
];

export default function Language() {
    return (
        <>
            <Head title="Language settings" />
            <PageMeta breadcrumbs={breadcrumbs} />

            <HeadingSmall title="Language settings" description="Update your account's language settings" />
            <LanguageTabs />
        </>
    );
}
