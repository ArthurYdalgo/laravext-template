// app/example-form.jsx

import { Button } from '@/components/ui/button';

import CurrencyInput from '@/components/currency-input';
import DatePicker from '@/components/date-picker';
import { FormActions, FormField, FormRow, FormSection } from '@/components/form-layout';
import If from '@/components/if';
import Money from '@/components/money';
import PaymentMethodPicker from '@/components/payment-method-picker';
import { ComboBox } from '@/components/ui/combo-box';
import { useNonInitialEffect } from '@/hooks/use-non-initial-effect';
import { MinusIcon, PlusIcon } from '@heroicons/react/20/solid';
import { nexusProps } from '@laravext/react';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'sonner';

export default function RentalForm({ formHook, onSubmit = (e) => {}, disableCustomersComboBox = false, disableVehiclesComboBox = false, prefetchedVehicle = null, prefetchedCustomers = null, prefetchedVehicles = null, ...props }) {
    const [vehicle, setVehicle] = useState(prefetchedVehicle);
    const { payment_methods } = nexusProps();

    const updateVehicle = (vehicleId) => {
        if (!vehicleId) {
            setVehicle(null);
            formHook.setData({ ...formHook.data, vehicle_id: null, vehicle_price_per_day: null, price: null });
            return;
        }

        axios
            .get(`/api/vehicles/${vehicleId}`)
            .then((response) => {
                setVehicle(response.data.data);
            })
            .catch((error) => {
                toast.error('Erro ao obter dados do veículo.');
            });
    };

    useNonInitialEffect(() => {
        if (!vehicle || !formHook.data.start_date || !formHook.data.end_date) {
            formHook.setData('price', null);
            return;
        }

        let startDate = new Date(formHook.data.start_date);
        let endDate = new Date(formHook.data.end_date);

        if (endDate < startDate) {
            formHook.setData('price', null);
            return;
        }

        // calculate difference in days
        let diffTime = Math.abs(endDate - startDate);
        let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include the start day

        let totalPrice = diffDays * vehicle.price_per_day;

        formHook.setData({ ...formHook.data, price: parseFloat(totalPrice).toFixed(2), vehicle_price_per_day: vehicle.price_per_day });
    }, [formHook.data.start_date, formHook.data.end_date, vehicle]);

    return (
        <form onSubmit={onSubmit} className="space-y-8 p-6">
            <FormSection title="Cliente" titleWidth="md:w-48">
                <FormRow cols={12}>
                    <FormField span={4} error={formHook.errors.customer_id} htmlFor="customer_id" required>
                        <ComboBox
                            id="customer_id"
                            name="customer_id"
                            popoverContentClassName="w-[350px]"
                            disabled={disableCustomersComboBox ?? false}
                            prefetchedOptions={prefetchedCustomers ?? null}
                            buttonClassName="w-full"
                            value={formHook.data.customer_id ? `${formHook.data.customer_id}` : ''}
                            onChange={(value) => formHook.setData('customer_id', value)}
                            parseItem={(customer) => ({
                                value: `${customer.id}`,
                                label: (
                                    <span>
                                        {customer.name} <span className="text-xs">({customer.cpf})</span>
                                    </span>
                                ),
                                keywords: [customer.cpf, customer.name],
                            })}
                            searchEndpoint={'/api/customers'}
                        />
                    </FormField>
                </FormRow>
            </FormSection>

            <FormSection title="Veículo" titleWidth="md:w-48">
                <FormRow cols={12}>
                    <FormField
                        span={4}
                        error={formHook.errors.vehicle_id}
                        description={
                            <span>
                                Preço por dia: <Money amount={vehicle?.price_per_day} />
                            </span>
                        }
                        htmlFor="vehicle_id"
                        required
                    >
                        <ComboBox
                            id="vehicle_id"
                            name="vehicle_id"
                            disabled={disableVehiclesComboBox ?? false}
                            prefetchedOptions={prefetchedVehicles ?? null}
                            buttonClassName="w-full"
                            value={formHook.data.vehicle_id ? `${formHook.data.vehicle_id}` : ''}
                            popoverContentClassName="w-[350px]"
                            onChange={(value) => {
                                updateVehicle(value);
                                formHook.setData('vehicle_id', value);
                            }}
                            parseItem={(vehicle) => ({
                                value: `${vehicle.id}`,
                                label: (
                                    <div className="flex items-center gap-2">
                                        {vehicle.name} <span className="text-xs">({vehicle.license_plate})</span>
                                        <div
                                            className="h-3 w-3 rounded"
                                            style={{ backgroundColor: vehicle.color.hex, border: '1px solid #aaaaaa44' }}
                                        ></div>
                                    </div>
                                ),
                                keywords: [vehicle.name, vehicle.license_plate],
                            })}
                            searchEndpoint={'/api/vehicles'}
                            extraParams={{ include: 'color' }}
                        />
                    </FormField>
                </FormRow>
            </FormSection>

            <FormSection title="Datas" titleWidth="md:w-48">
                <FormRow cols={12}>
                    <FormField span={3} error={formHook.errors.name} label="Início" htmlFor="start_date" required>
                        <DatePicker label="" date={formHook.data.start_date} onChangeDate={(date) => formHook.setData('start_date', date)} />
                    </FormField>
                    <FormField span={3} error={formHook.errors.name} label="Termino" htmlFor="end_date" required>
                        <DatePicker label="" date={formHook.data.end_date} onChangeDate={(date) => formHook.setData('end_date', date)} />
                    </FormField>
                </FormRow>
                <FormRow className={'mt-2'} cols={12}>
                    <FormField span={3} error={formHook.errors.name} label="Pago em" htmlFor="´paid_at" required>
                        <DatePicker label="" date={formHook.data.paid_at} onChangeDate={(date) => formHook.setData('paid_at', date)} />
                    </FormField>
                </FormRow>
            </FormSection>

            <FormSection
                title="Pagamento"
                subtitle={
                    <div className="mt-2 flex flex-col gap-2">
                        <span className="text-sm">
                            Total: <Money amount={formHook.data.price} />
                        </span>
                        <If condition={vehicle && formHook.data.price && formHook.data.paid_amount < formHook.data.price}>
                            <span className="text-sm">
                                A pagar: <Money amount={formHook.data.price - formHook.data.paid_amount} />
                            </span>
                        </If>

                        <If condition={vehicle && formHook.data.paid_amount > formHook.data.price}>
                            <span className="text-sm text-red-500">O valor pago não pode ser maior que o total da reserva.</span>
                        </If>
                    </div>
                }
                titleWidth="md:w-48"
            >
                {formHook.data.payment_methods.map((payment_method, index) => (
                    <FormRow cols={12} key={`payment-method-row-${payment_method.id}-${index}`}>
                        <FormField
                            span={2}
                            error={formHook.errors.name}
                            label={index == 0 ? 'Método de Pagamento' : ''}
                            insertEmptyLabel={true}
                            htmlFor="vehicle_id"
                            required
                        >
                            <PaymentMethodPicker
                                exclude={formHook.data.payment_methods.map((pm) => pm.id).filter((id, i) => i !== index)}
                                onChange={(value) => {
                                    let updatedMethods = [...(formHook.data.payment_methods ?? [])];

                                    updatedMethods[index] = { ...updatedMethods[index], id: value };

                                    formHook.setData('payment_methods', updatedMethods);
                                }}
                                value={payment_method.id}
                            />
                        </FormField>

                        <FormField
                            span={2}
                            error={formHook.errors.name}
                            label={index == 0 ? 'Valor' : ''}
                            insertEmptyLabel={true}
                            htmlFor="vehicle_id"
                            required
                        >
                            <div className="flex items-center gap-2">
                                <CurrencyInput
                                    className={formHook.data.paid_amount > formHook.data.price ? 'border border-red-500' : ''}
                                    currentValue={payment_method.amount}
                                    onChangeInput={(value) => {
                                        let updatedMethods = [...(formHook.data.payment_methods ?? [])];
                                        updatedMethods[index] = { ...updatedMethods[index], amount: value };

                                        let totalAmount = parseFloat(parseFloat(updatedMethods.reduce((acc, pm) => acc + (parseFloat(pm.amount) || 0), 0)).toFixed(2));

                                        formHook.setData({ ...formHook.data, paid_amount: totalAmount, payment_methods: updatedMethods });
                                    }}
                                />
                            </div>

                            {/* <PaymentMethodPicker /> */}
                        </FormField>
                        <FormField span={3} error={formHook.errors.name} insertEmptyLabel={true} htmlFor="vehicle_id" required>
                            <div className="flex h-full items-center gap-2">
                                <If
                                    condition={
                                        // this will never show up if there's only one payment method
                                        (formHook.data.payment_methods ?? []).length > 1
                                    }
                                >
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => {
                                            let updatedMethods = [...(formHook.data.payment_methods ?? [])];

                                            // remove the item at index
                                            delete updatedMethods[index];

                                            // reset indexes
                                            updatedMethods = updatedMethods.filter((item) => item);

                                            // sum the amount of all payment methods
                                            let totalAmount = parseFloat(parseFloat(updatedMethods.reduce((acc, pm) => acc + (parseFloat(pm.amount) || 0), 0)).toFixed(2));

                                            formHook.setData({ ...formHook.data, paid_amount: totalAmount, payment_methods: updatedMethods });
                                        }}
                                    >
                                        <MinusIcon />
                                    </Button>
                                </If>
                                <If
                                    condition={
                                        (((formHook.data.payment_methods ?? []).length <= 1 && index == 0) ||
                                            index == (formHook.data.payment_methods ?? []).length - 1) &&
                                        formHook.data.payment_methods.length < payment_methods.length
                                    }
                                >
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="green"
                                        onClick={() => {
                                            let updatedMethods = [...(formHook.data.payment_methods ?? [])];

                                            if (updatedMethods.length == 0) {
                                                updatedMethods = [{ id: '', amount: 0 }];
                                            }

                                            updatedMethods.push({ id: '', amount: 0 });

                                            formHook.setData('payment_methods', updatedMethods);
                                        }}
                                    >
                                        <PlusIcon />
                                    </Button>
                                </If>
                            </div>

                            {/* <PaymentMethodPicker /> */}
                        </FormField>
                    </FormRow>
                ))}
            </FormSection>

            <FormActions>
                <Button disabled={formHook.data.paid_amount > formHook.data.price} type="submit">
                    Salvar
                </Button>
            </FormActions>
        </form>
    );
}
