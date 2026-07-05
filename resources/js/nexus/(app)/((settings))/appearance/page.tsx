import AppearanceTabs from '@/components/appearance-tabs';
import HeadingSmall from '@/components/heading-small';
import PageMeta from '@/components/page-meta';
import { type BreadcrumbItem } from '@/types';

import { Head } from '@laravext/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Appearance settings',
        href: '/settings/appearance',
    },
];

export default function Appearance() {
    return (
        <>
            <Head title="Appearance settings" />
            <PageMeta breadcrumbs={breadcrumbs} />

            <HeadingSmall title="Appearance settings" description="Update your account's appearance settings" />
            <AppearanceTabs />
        </>
    );
}
