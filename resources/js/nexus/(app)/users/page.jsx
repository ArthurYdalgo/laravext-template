import ColorPicker from '@/components/color-picker';
import Filter from '@/components/filter';
import MomentDateTime from '@/components/moment-date-time';
import Table from '@/components/pagination/table';
import TableSortableField from '@/components/pagination/table-sortable-field';
import { TableBanner } from '@/components/table-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useFilter } from '@/hooks/use-filter';
import { useNonInitialEffect } from '@/hooks/use-non-initial-effect';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@laravext/react';
import { useState } from 'react';

const breadcrumbs = [
    {
        title: 'Users',
        href: '/users',
    },
];

export default function Dashboard() {
    const { filters, setFilter } = useFilter({});

    const [params, setParams] = useState({
        include: 'phone',
        filter: filters,
    });

    const refresh = () => {
        setParams({
            ...params,
            filter: filters,
        });
    };

    useNonInitialEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            refresh();
        }, 1000);

        return () => clearTimeout(delayDebounceFn);
    }, [filters]);

    return (
        <AppLayout
            breadcrumbs={breadcrumbs}
        >
            <Head title="Users" />
            <div className="flex h-full flex-col gap-4 rounded-xl p-4">
                <TableBanner
                    filterComponents={
                        <>
                            <Filter label={'Filters'}>
                                <Input placeholder="Search" value={filters.search} onChange={(e) => setFilter('search', e.target.value)} />
                            </Filter>
                        </>
                    }
                ></TableBanner>
                <Table
                    endpoint={'/api/users'}
                    params={params}
                    tableHead={({ sortBy, handleClick }) => (
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Created at</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                    )}
                    tableBody={(pagination) => {
                        return (
                            <TableBody>
                                {pagination.data.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>{user.id}</TableCell>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.phone?.number ?? '--'}</TableCell>
                                        <TableCell>
                                            <MomentDateTime date={user.created_at} />
                                        </TableCell>
                                        <TableCell className="flex gap-2">
                                            {/* <Button asChild variant="default" size="xs">
                                                <Link href={route('users.user', { user: user.id })}>Ver</Link>
                                            </Button> */}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        );
                    }}
                />
            </div>
        </AppLayout>
    );
}
