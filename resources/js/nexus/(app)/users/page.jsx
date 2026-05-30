import ColorPicker from '@/components/color-picker';
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
import { Head, Link } from '@laravext/react';
import { useState } from 'react';
import { Eye, Copy, Trash, Edit } from 'lucide-react'; 

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
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            {/* overflow-x-clip is an absolute safeguard against child element bleeding */}
            <div className="flex w-full min-w-0 max-w-full flex-col gap-4 rounded-xl p-4 md:p-6 bg-gray-50/50 dark:bg-transparent box-border overflow-x-clip">
                
                <TableBanner
                    enableResponsiveMode={true} 
                    filterComponents={
                        <div className="w-full min-w-0">
                            <Filter label={'Search User'}>
                                <Input 
                                    className="w-full min-w-0 bg-white dark:bg-zinc-950 dark:border-zinc-800 dark:text-gray-100"
                                    placeholder="Type to search..." 
                                    value={filters.search} 
                                    onChange={(e) => setFilter('search', e.target.value)} 
                                />
                            </Filter>
                        </div>
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
                                            {/* Desktop Actions */}
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
                                            <button type="button" className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                                                <Eye size={20} />
                                            </button>
                                            <button type="button" className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                                                <Copy size={20} />
                                            </button>
                                            <button type="button" className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-red-500/50 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                                                <Trash size={20} />
                                            </button>
                                            <button type="button" className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                                                <Edit size={20} />
                                            </button>
                                        </div>
                                    }
                                    mainProps={[
                                        { label: 'User ID', value: user.id },
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