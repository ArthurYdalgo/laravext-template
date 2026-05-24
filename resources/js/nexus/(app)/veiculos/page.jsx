import BrandPicker from '@/components/brand-picker';
import ColorPicker from '@/components/color-picker';
import DatePicker from '@/components/date-picker';
import Filter from '@/components/filter';
import Money from '@/components/money';
import Number from '@/components/number';
import Table from '@/components/pagination/table';
import TableSortableField from '@/components/pagination/table-sortable-field';
import { TableBanner } from '@/components/table-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useFilter } from '@/hooks/use-filter';
import { useNonInitialEffect } from '@/hooks/use-non-initial-effect';
import AppLayout from '@/layouts/app-layout';
import { cn, dateToDateString } from '@/lib/utils';
import { Head, Link } from '@laravext/react';
import { useState } from 'react';

const breadcrumbs = [
    {
        title: 'Veículos',
        href: '/veiculos',
    },
];

export default () => {
    const { filters, setFilter, reset } = useFilter({
    });

    const [params, setParams] = useState({
        include: 'color,brand',
    });

    const refresh = () => {
        setParams({
            ...params,
            filter: {
                brand_id: filters.brand_id ?? '',
                color_id: filters.color_id ?? '',
                search: filters.search ?? '',
                available_between:
                    filters.available_after && filters.available_before
                        ? `${dateToDateString(filters.available_after)},${dateToDateString(filters.available_before)}`
                        : '',
            },
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
            actions={
                <div className="ml-auto flex items-center gap-2">
                    <Button size="xs" asChild>
                        <Link href={route('veiculos.cadastrar')}>Cadastrar</Link>
                    </Button>
                </div>
            }
        >
            <Head title="Veículos" />
            <div className="flex h-full flex-col gap-4 rounded-xl p-4">
                <TableBanner
                    filterComponents={
                        <>
                            <Filter label={'Filtros'}>
                                <Input placeholder="Buscar" value={filters.search} onChange={(e) => setFilter('search', e.target.value)} />
                            </Filter>
                            <Filter>
                                <ColorPicker
                                    triggerClassName={'w-40'}
                                    value={filters.color_id ?? ''}
                                    onChange={(value) => setFilter('color_id', value)}
                                />
                            </Filter>
                            <Filter>
                                <BrandPicker
                                    triggerClassName={'w-48'}
                                    value={filters.brand_id ?? ''}
                                    onChange={(value) => setFilter('brand_id', value)}
                                />
                            </Filter>
                            <Separator orientation="vertical" />
                            <Filter label={'Disponível entre'}>
                                <DatePicker
                                    buttonClassName={filters.available_before && !filters.available_after ? 'border-red-500' : ''}
                                    label=""
                                    onClear={() => reset('available_after')}
                                    date={filters.available_after}
                                    onChangeDate={(date) => setFilter('available_after', date)}
                                />
                            </Filter>
                            <Filter label={'e'}>
                                <DatePicker
                                    buttonClassName={filters.available_after && !filters.available_before ? 'border-red-500' : ''}
                                    label=""
                                    onClear={() => reset('available_before')}
                                    date={filters.available_before}
                                    onChangeDate={(date) => setFilter('available_before', date)}
                                />
                            </Filter>
                        </>
                    }
                ></TableBanner>
                <Table
                    endpoint={'/api/vehicles'}
                    params={params}
                    tableHead={({ sortBy, handleClick }) => (
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Nome</TableHead>
                                <TableHead>Marca</TableHead>
                                <TableHead>Placa</TableHead>
                                <TableHead>Cor</TableHead>
                                <TableHead>
                                    <TableSortableField handleClick={handleClick} sortBy={sortBy} field={'year'}>
                                        Ano
                                    </TableSortableField>
                                </TableHead>

                                <TableHead>
                                    <TableSortableField handleClick={handleClick} sortBy={sortBy} field={'seats'}>
                                        Lugares
                                    </TableSortableField>
                                </TableHead>
                                <TableHead>
                                    <TableSortableField handleClick={handleClick} sortBy={sortBy} field={'trunk_capacity'}>
                                        Volume do porta-malas
                                    </TableSortableField>
                                </TableHead>
                                <TableHead>
                                    <TableSortableField handleClick={handleClick} sortBy={sortBy} field={'price_per_day'}>
                                        Preço por dia
                                    </TableSortableField>
                                </TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                    )}
                    tableBody={(pagination) => {
                        return (
                            <TableBody>
                                {pagination.data.map((vehicle) => (
                                    <TableRow key={vehicle.id}>
                                        <TableCell>{vehicle.id}</TableCell>
                                        <TableCell>{vehicle.name}</TableCell>
                                        <TableCell>{vehicle.brand.name}</TableCell>
                                        <TableCell>{vehicle.license_plate}</TableCell>
                                        <TableCell className="flex items-center gap-2">
                                            {vehicle.color.name}{' '}
                                            <div
                                                className="h-3 w-3 rounded"
                                                style={{ backgroundColor: vehicle.color.hex, border: '1px solid #aaaaaa44' }}
                                            ></div>
                                        </TableCell>
                                        <TableCell>{vehicle.year}</TableCell>
                                        <TableCell>{vehicle.seats}</TableCell>
                                        <TableCell>
                                            <Number value={vehicle.trunk_capacity} maximumFractionDigits={0} minimumFractionDigits={0} sufix={'L'} />
                                        </TableCell>
                                        <TableCell>
                                            <Money amount={vehicle.price_per_day} />
                                        </TableCell>
                                        <TableCell className="flex gap-2">
                                            <Button asChild variant="default" size="xs">
                                                <Link href={route('veiculos.vehicle', { vehicle: vehicle.id })}>Ver</Link>
                                            </Button>
                                            <Button asChild variant="secondary" size="xs">
                                                <Link href={route('veiculos.vehicle.editar', { vehicle: vehicle.id })}>Editar</Link>
                                            </Button>
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
