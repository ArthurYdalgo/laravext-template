import { FormField, FormRow, FormSection } from '@/components/form-layout';
import If from '@/components/if';
import MomentDate from '@/components/moment-date';
import Money from '@/components/money';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { LoadingButton } from '@/components/ui/loading-button';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, nexusProps } from '@laravext/react';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'sonner';

export default () => {
    const [rental, setRental] = useState(nexusProps().rental);
    const [processing, setProcessing] = useState(null);

    const refreshRental = () => {
        axios.get(`/api/rentals/${rental.id}`, { params: { include: 'vehicle,color,brand,customer,payment_methods' } }).then((response) => {
            setRental(response.data.data);
        });
    };

    const handleCancelOrRestore = (rental) => {
        setProcessing(rental.id);

        axios
            .put(`/api/rentals/${rental.id}`, {
                canceled_at: rental.canceled_at ? null : new Date().toISOString(),
            })
            .then((response) => {
                toast.success(`Reserva ${rental.canceled_at ? 'restaurada' : 'cancelada'} com sucesso!`);
                refreshRental();
            })
            .catch((error) => {
                toast.error(`Erro ao ${rental.canceled_at ? 'restaurar' : 'cancelar'} a reserva.`);
            })
            .finally(() => {
                setProcessing(null);
            });
    };

    return (
        <AppLayout
            breadcrumbs={[
                {
                    title: 'Reservas',
                    href: route('reservas'),
                },
                {
                    title: `#${rental.id} - ${rental.customer.first_name} - ${rental.vehicle.name} (${rental.vehicle.license_plate})`,
                    href: route('reservas.rental', { rental: rental.id }),
                },
            ]}
            actions={
                <div className="ml-auto flex items-center gap-2">
                    <Button size="xs" asChild>
                        <Link href={route('reservas.rental.editar', { rental: rental.id })}>Editar</Link>
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
                </div>
            }
        >
            <Head title="Veículos" />
            <div className="space-y-8 p-6">
                <FormSection title="Cliente" titleWidth="md:w-48">
                    <FormRow cols={12}>
                        <FormField span={4} htmlFor="customer_id" required>
                            <TextLink href={route('clientes.customer', { customer: rental.customer.id })}>{rental.customer.name}</TextLink>
                        </FormField>
                    </FormRow>
                </FormSection>

                <FormSection title="Veículo" titleWidth="md:w-48">
                    <FormRow cols={12}>
                        <FormField
                            span={4}
                            description={
                                <span>
                                    Preço por dia: <Money amount={rental.vehicle_price_per_day} />
                                </span>
                            }
                            htmlFor="vehicle_id"
                            required
                        >
                            <TextLink href={route('veiculos.vehicle', { vehicle: rental.vehicle.id })} className="flex items-center gap-2">
                                {rental.vehicle.name} ({rental.vehicle.brand.name}) {rental.vehicle.license_plate}{' '}
                                <div
                                    className="h-3 w-3 rounded"
                                    style={{ backgroundColor: rental.vehicle.color.hex, border: '1px solid #aaaaaa44' }}
                                ></div>
                            </TextLink>
                        </FormField>
                    </FormRow>
                </FormSection>

                <FormSection title="Datas" titleWidth="md:w-48">
                    <FormRow cols={12}>
                        <FormField span={3} label="Início" htmlFor="start_date" required>
                            <MomentDate date={rental.start_date} />
                        </FormField>
                        <FormField span={3} label="Termino" htmlFor="end_date" required>
                            <MomentDate date={rental.end_date} />
                        </FormField>
                    </FormRow>
                    <FormRow className={'mt-2'} cols={12}>
                        <FormField span={3} label="Pago em" htmlFor="paid_at" required>
                            <MomentDate date={rental.paid_at} />
                        </FormField>
                    </FormRow>
                </FormSection>

                <FormSection
                    title="Pagamento"
                    subtitle={
                        <div className="mt-2 flex flex-col gap-2">
                            <span className="text-sm">
                                Total: <Money amount={rental.price} />
                            </span>
                            <If condition={rental.vehicle && rental.price && rental.paid_amount < rental.price}>
                                <span className="text-sm">
                                    A pagar: <Money amount={rental.price - rental.paid_amount} />
                                </span>
                            </If>

                            <If condition={rental.vehicle && rental.paid_amount > rental.price}>
                                <span className="text-sm text-red-500">O valor pago não pode ser maior que o total da reserva.</span>
                            </If>
                        </div>
                    }
                    titleWidth="md:w-48"
                >
                    {rental.payment_methods.map((payment_method, index) => (
                        <FormRow cols={4} key={`payment-method-row-${payment_method.id}-${index}`}>
                            <FormField span={2} label={index == 0 ? 'Método de Pagamento' : ''} insertEmptyLabel={true} htmlFor="vehicle_id" required>
                                {payment_method.name}
                            </FormField>

                            <FormField span={2} label={index == 0 ? 'Valor' : ''} insertEmptyLabel={true} htmlFor="vehicle_id" required>
                                <div className="flex items-center gap-2">
                                    <Money amount={payment_method.amount} />
                                </div>
                            </FormField>
                        </FormRow>
                    ))}
                </FormSection>
            </div>
        </AppLayout>
    );
};
