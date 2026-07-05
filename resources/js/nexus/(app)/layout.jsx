// layout.jsx
import React from 'react';
import { useLayout } from '@/hooks/use-layout';
import AppLayout from '@/layouts/app-layout';

export default function CustomLayout({ children }) {
    // Automatically updates whenever a page changes the breadcrumbs
    const breadcrumbs = useLayout((state) => state.breadcrumbs);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <main>{children}</main>
        </AppLayout>
    );
};