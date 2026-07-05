import { useLayout } from '@/hooks/use-layout';
import AppLayout from '@/layouts/app-layout';

export default ({ children }) => {
    const breadcrumbs = useLayout((state) => state.breadcrumbs);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <main>{children}</main>
        </AppLayout>
    );
};