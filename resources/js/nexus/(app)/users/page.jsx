import Filter from '@/components/filter';
import MomentDateTime from '@/components/moment-date-time';
import Table from '@/components/pagination/table';
import TableSortableField from '@/components/pagination/table-sortable-field';
import { TableBanner } from '@/components/table-header';
import MobileDataCard from '@/components/mobile-data-card'; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox'; 
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useFilter } from '@/hooks/use-filter';
import { useNonInitialEffect } from '@/hooks/use-non-initial-effect';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, visit } from '@laravext/react';
import { useState } from 'react';
import { Eye, Copy, Trash, Edit } from 'lucide-react'; 
import { LoadingButton } from '@/components/ui/loading-button';
import { showDialog } from '@/providers/dialog-provider';
import { toast } from "sonner"

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

    const handleDelete = (user) => {
        showDialog({
            title: 'Confirm Deletion',
            description: `Are you sure you want to delete user "${user.name}"? This action cannot be undone.`,
            typeToConfirmContent: user.name,
            onAction: () => {
                toast.success('This would be an API call...');
            }
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            {/* overflow-x-clip is an absolute safeguard against child element bleeding */}
            <div className="flex w-full min-w-0 max-w-full flex-col gap-4 rounded-xl p-4 md:p-6 bg-gray-50/50 dark:bg-transparent box-border overflow-x-clip">
                
                <TableBanner
                    filterComponents={
                        <>
                            <Filter label={'Search User'}>
                                <Input 
                                    className="w-full min-w-0 bg-white dark:bg-zinc-950 dark:border-zinc-800 dark:text-gray-100"
                                    placeholder="Type to search..." 
                                    value={filters.search} 
                                    onChange={(e) => setFilter('search', e.target.value)} 
                                />
                            </Filter>
                        </>
                    }
                />
                
                <Table
                    endpoint={'/api/users'}
                    params={params}
                    hideTableHeadOnMobile={true}
                    hideTableBodyOnMobile={true}
                    
                    tableHead={({ sortBy, handleClick }) => (
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Created at</TableHead>
                                <TableHead>Actions</TableHead>
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
                                            <Button size="xs">
                                                <Link href={route('users.user', { user: user.id })}>
                                                    Open
                                                </Link>
                                            </Button>
                                            {/* <Button variant='secondary' size="xs">
                                                <Link href={route('users.user.edit', { user: user.id })}>
                                                    Edit
                                                </Link>
                                            </Button> */}
                                            <LoadingButton 
                                                variant='destructive' 
                                                size="xs"
                                                onClick={() => handleDelete(user)}
                                                includeChildrenWhenLoading={false}
                                            >
                                                Delete
                                            </LoadingButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        );
                    }}
                    
                    responsiveTableBody={(pagination) => (
                        <div className="flex flex-col w-full min-w-0">
                            {pagination.data.map((user) => (
                                <MobileDataCard
                                    key={user.id}
                                    titleTruncatePosition="middle"
                                    title={user.name}
                                    checkbox={<Checkbox />}
                                    actions={
                                        <div className="flex items-center gap-1 sm:gap-2">
                                            {/* Fixed explicit w/h instead of negative margins for large touch targets! */}
                                            <Button>
                                                <Link href={route('users.user', { user: user.id })}>
                                                    <Eye size={20} />
                                                </Link>
                                            </Button>
                                            {/* <Button variant='secondary'>
                                                <Link href={route('users.user.edit', { user: user.id })}>
                                                    <Edit size={24} />
                                                </Link>
                                            </Button> */}
                                            <Button variant='destructive' onClick={() => handleDelete(user)} includeChildrenWhenLoading={false}>
                                                <Trash size={20} />
                                            </Button>
                                        </div>
                                    }
                                    mainProps={[
                                        { label: 'Email Address', value: user.email },
                                        { label: 'Status', value: <span className="inline-flex w-max items-center text-green-600 dark:text-green-400 before:content-[''] before:w-2 before:h-2 before:bg-green-500 dark:before:bg-green-400 before:rounded-full before:mr-2 border border-green-200 dark:border-green-900 px-2 py-0.5 rounded-full text-xs whitespace-nowrap">Active</span> }
                                    ]}
                                    minorProps={[
                                        { label: 'Phone Number', value: user.phone?.number ?? 'N/A' },
                                        { label: 'Date Added', value: <MomentDateTime date={user.created_at} /> }
                                    ]}
                                />
                            ))}
                        </div>
                    )}
                />
            </div>
        </AppLayout>
    );
}