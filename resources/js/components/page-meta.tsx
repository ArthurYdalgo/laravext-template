// @/components/page-meta.jsx
import { useLayout } from '@/hooks/use-layout';
import { useEffect } from 'react';
import { type BreadcrumbItem } from '@/types';

export default ({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItem[] }) => {
    const setBreadcrumbs = useLayout((state) => state.setBreadcrumbs);

    useEffect(() => {
        // Set the layout state when this page mounts
        if (breadcrumbs.length > 0) setBreadcrumbs(breadcrumbs);

        // Reset the layout state when leaving the page (unmounting)
        return () => {
            setBreadcrumbs([]);
        };
    }, [breadcrumbs, setBreadcrumbs]);

    // This component renders absolutely nothing visually
    return null;
}
