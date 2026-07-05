// layout.jsx
import { useLayout } from '@/hooks/use-layout';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

export default ({ children }) => {
    // Automatically updates whenever a page changes the breadcrumbs
    const breadcrumbs = useLayout((state) => state.breadcrumbs);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <SettingsLayout>
                <div className="space-y-6">
                    <main>{children}</main>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
};
