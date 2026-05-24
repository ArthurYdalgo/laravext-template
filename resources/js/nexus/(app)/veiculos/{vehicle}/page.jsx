import { FormField, FormRow } from '@/components/form-layout';
import Money from '@/components/money';
import Number from '@/components/number';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, nexusProps } from '@laravext/react';
import { useState } from 'react';

export default () => {
    const [vehicle, setVehicle] = useState(nexusProps().vehicle);

    return (
        <AppLayout
            breadcrumbs={[
                {
                    title: 'Veículos',
                    href: route('veiculos'),
                },
                {
                    title: `#${vehicle.id} ${vehicle.name}`,
                    href: route('veiculos.vehicle', { vehicle: vehicle.id }),
                },
            ]}
            actions={
                <div className="ml-auto flex items-center gap-2">
                    <Button size="xs" asChild>
                        <Link href={route('veiculos.vehicle.editar', { vehicle: vehicle.id })}>Editar</Link>
                    </Button>
                </div>
            }
        >
            <Head title="Veículos" />
            <div className="space-y-8 p-6">
                <FormRow cols={12}>
                    <FormField span={4} label="Nome" htmlFor="name">
                        {vehicle.name}
                    </FormField>
                    <FormField span={4} label="Tipo" htmlFor="type">
                        {vehicle.type_name}
                    </FormField>
                    <FormField span={4} label="Placa" htmlFor="license_plate">
                        {vehicle.license_plate}
                    </FormField>
                </FormRow>
                <FormRow cols={12}>
                    <FormField span={4} label="Marca" htmlFor="vehicle.brand_id">
                        {vehicle.brand.name}
                    </FormField>

                    <FormField span={4} label="Cor" htmlFor="color_id">
                        <div className="flex items-center gap-2">
                            {vehicle.color.name}{' '}
                            <div className="h-3 w-3 rounded" style={{ backgroundColor: vehicle.color.hex, border: '1px solid #aaaaaa44' }}></div>
                        </div>
                    </FormField>
                    <FormField span={4} label="Ano" htmlFor="year">
                        {vehicle.year}
                    </FormField>
                </FormRow>
                <FormRow cols={12}>
                    <FormField span={4} label="Lugares" htmlFor="seats">
                        {vehicle.seats}
                    </FormField>
                    <FormField span={4} label="Capacidade do Porta-Malas" htmlFor="trunk_capacity">
                        <Number value={vehicle.trunk_capacity} maximumFractionDigits={0} minimumFractionDigits={0} sufix={'L'} />
                    </FormField>
                    <FormField span={4} label="Preço por Dia" htmlFor="price">
                        <Money amount={vehicle.price_per_day} />
                    </FormField>
                </FormRow>
            </div>
        </AppLayout>
    );
};
