import Filter from '@/components/filter';
import If from '@/components/if';
import MomentDate from '@/components/moment-date';
import Money from '@/components/money';
import Table from '@/components/pagination/table';
import TableSortableField from '@/components/pagination/table-sortable-field';
import { TableBanner } from '@/components/table-header';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingButton } from '@/components/ui/loading-button';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useFilter } from '@/hooks/use-filter';
import { useNonInitialEffect } from '@/hooks/use-non-initial-effect';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@laravext/react';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs = [
    {
        title: 'Reservas',
        href: '/reservas',
    },
];

export default () => {
    const { filters, setFilter } = useFilter({});
    const [processing, setProcessing] = useState(null);

    const [params, setParams] = useState({
        include: 'vehicle,customer',
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

    const handleCancelOrRestore = (rental) => {
        setProcessing(rental.id);

        axios
            .put(`/api/rentals/${rental.id}`, {
                canceled_at: rental.canceled_at ? null : new Date().toISOString(),
            })
            .then((response) => {
                toast.success(`Reserva ${rental.canceled_at ? 'restaurada' : 'cancelada'} com sucesso!`);
                refresh();
            })
            .catch((error) => {
                let response = error.response.data;
                let message = response?.message ?? `Erro ao ${rental.canceled_at ? 'restaurar' : 'cancelar'} a reserva.`;

                toast.error(message);
            })
            .finally(() => {
                setProcessing(null);
            });
    };

    return (
        <AppLayout
            breadcrumbs={breadcrumbs}
            actions={
                <div className="ml-auto flex items-center gap-2">
                    <Button size="xs" asChild>
                        <Link href={route('reservas.cadastrar')}>Cadastrar</Link>
                    </Button>
                </div>
            }
        >
            <Head title="Reservas" />

            <div className="flex h-full flex-col gap-4 rounded-xl p-4">
                <TableBanner
                    filterComponents={
                        <>
                            <Filter label={'Filtros'}>
                                <Input placeholder="Buscar" value={filters.search} onChange={(e) => setFilter('search', e.target.value)} />
                            </Filter>
                        </>
                    }
                ></TableBanner>
                <Table
                    endpoint={'/api/rentals'}
                    resetPageWhenParamsChange={['filter']}
                    params={params}
                    tableHead={({ sortBy, handleClick }) => (
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Cliente</TableHead>
                                <TableHead>Veículo</TableHead>
                                <TableHead>
                                    <TableSortableField handleClick={handleClick} sortBy={sortBy} field={'start_date'}>
                                        Data de Início
                                    </TableSortableField>
                                </TableHead>
                                <TableHead>
                                    <TableSortableField handleClick={handleClick} sortBy={sortBy} field={'end_date'}>
                                        Data de Encerramento
                                    </TableSortableField>
                                </TableHead>
                                <TableHead>
                                    <TableSortableField handleClick={handleClick} sortBy={sortBy} field={'price'}>
                                        Total
                                    </TableSortableField>
                                </TableHead>
                                <TableHead>
                                    <TableSortableField handleClick={handleClick} sortBy={sortBy} field={'created_at'}>
                                        Criado em
                                    </TableSortableField>
                                </TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                    )}
                    tableBody={(pagination) => {
                        return (
                            <TableBody>
                                {pagination.data.map((rental) => (
                                    <TableRow key={rental.id}>
                                        <TableCell>{rental.id}</TableCell>
                                        <TableCell>
                                            <TextLink href={route('clientes.customer', { customer: rental.customer.id })}>
                                                {rental.customer.first_name}
                                            </TextLink>
                                        </TableCell>
                                        <TableCell>
                                            <TextLink
                                                href={route('veiculos.vehicle', { vehicle: rental.vehicle.id })}
                                                className="flex items-center gap-2"
                                            >
                                                {rental.vehicle.name} ({rental.vehicle.brand.name}) {rental.vehicle.license_plate}{' '}
                                                <div
                                                    className="h-3 w-3 rounded"
                                                    style={{ backgroundColor: rental.vehicle.color.hex, border: '1px solid #aaaaaa44' }}
                                                ></div>
                                            </TextLink>
                                        </TableCell>

                                        <TableCell>
                                            <MomentDate date={rental.start_date} />
                                        </TableCell>
                                        <TableCell>
                                            <MomentDate date={rental.end_date} />
                                        </TableCell>

                                        <TableCell>
                                            <Money amount={rental.price} />
                                        </TableCell>

                                        <TableCell>
                                            <MomentDate date={rental.created_at} />
                                        </TableCell>
                                        <TableCell className="flex gap-2">
                                            <Button asChild variant="default" size="xs">
                                                <Link href={`/reservas/${rental.id}`}>Ver</Link>
                                            </Button>
                                            <Button asChild variant="secondary" size="xs">
                                                <Link href={`/reservas/${rental.id}/editar`}>Editar</Link>
                                            </Button>
                                            <If condition={!rental.canceled_at}>
                                                <LoadingButton
                                                    onClick={() => handleCancelOrRestore(rental)}
                                                    loading={rental.id == processing}
                                                    variant="destructive"
                                                    includeChildrenWhenLoading={false}
                                                    className="min-w-20"
                                                    size="xs"
                                                >
                                                    Cancelar
                                                </LoadingButton>
                                            </If>

                                            <If condition={rental.canceled_at}>
                                                <LoadingButton
                                                    onClick={() => handleCancelOrRestore(rental)}
                                                    loading={rental.id == processing}
                                                    variant="orange"
                                                    includeChildrenWhenLoading={false}
                                                    className="min-w-20"
                                                    size="xs"
                                                >
                                                    Restaurar
                                                </LoadingButton>
                                            </If>
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
};
