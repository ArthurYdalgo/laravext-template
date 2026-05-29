import ColorPicker from '@/components/color-picker';
import Filter from '@/components/filter';
import MomentDateTime from '@/components/moment-date-time';
import Table from '@/components/pagination/table';
import TableSortableField from '@/components/pagination/table-sortable-field';
import { TableBanner } from '@/components/table-header';
import MobileDataCard from '@/components/mobile-data-card'; // <-- Import new component
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox'; // <-- Assuming shadcn UI checkbox
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useFilter } from '@/hooks/use-filter';
import { useNonInitialEffect } from '@/hooks/use-non-initial-effect';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@laravext/react';
import { useState } from 'react';
import { Eye, Copy, Trash, Edit } from 'lucide-react'; // <-- Import Lucide Icons for the card

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
            <div className="flex h-full flex-col gap-4 rounded-xl p-4 md:p-6 bg-gray-50/50">
                
                {/* Responsive Table Banner Check */}
                <TableBanner
                    enableResponsiveMode={true} // <-- Set this to true to stack on mobile!
                    filterComponents={
                        <>
                            <Filter label={'Search User'}>
                                <Input 
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
                    
                    // Enable Responsive Modifiers
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
                                            {/* Actions */}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        );
                    }}
                    
                    // Render Mobile Data Cards instead on small screens
                    responsiveTableBody={(pagination) => (
                        <div className="flex flex-col">
                            {pagination.data.map((user) => (
                                <MobileDataCard
                                    key={user.id}
                                    title={user.name}
                                    checkbox={<Checkbox />}
                                    actions={
                                        <>
                                            <Eye className="w-4 h-4 cursor-pointer hover:text-blue-500" />
                                            <Copy className="w-4 h-4 cursor-pointer hover:text-blue-500" />
                                            <Trash className="w-4 h-4 cursor-pointer hover:text-red-500" />
                                            <Edit className="w-4 h-4 cursor-pointer hover:text-blue-500" />
                                        </>
                                    }
                                    mainProps={[
                                        { label: 'User ID', value: user.id },
                                        { label: 'Email Address', value: user.email },
                                        { label: 'Status', value: <span className="flex items-center text-green-600 before:content-[''] before:w-2 before:h-2 before:bg-green-500 before:rounded-full before:mr-2 border border-green-200 px-2 py-0.5 rounded-full text-xs">Active</span> }
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