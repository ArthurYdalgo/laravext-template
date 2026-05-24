import { useForm } from '@/hooks/use-form';
import AppLayout from '@/layouts/app-layout';
import { dateToDateString, dateToForm } from '@/lib/utils';
import { Head, nexusProps, visit } from '@laravext/react';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'sonner';
import RentalForm from '../../form';

export default () => {
    const [rental, setRental] = useState(nexusProps().rental);

    const { data, setData, errors, setErrors, reset, processing, setProcessing } = useForm({
        ...nexusProps().rental,
        payment_methods: (nexusProps().rental.payment_methods ?? []).map((method) => ({
            id: `${method.id}`,
            amount: parseFloat(method.amount).toFixed(2),
        })),
        paid_amount: parseFloat(nexusProps().rental.payment_methods?.reduce((sum, method) => sum + parseFloat(method.amount), 0) ?? 0).toFixed(2),
        paid_at: dateToForm(nexusProps().rental.paid_at),
        start_date: dateToForm(nexusProps().rental.start_date),
        end_date: dateToForm(nexusProps().rental.end_date),
    });

    console.log(data);

    const handleSubmit = (e) => {
        e.preventDefault();

        let body = {
            ...data,
            start_date: dateToDateString(data.start_date),
            end_date: dateToDateString(data.end_date),
            paid_at: dateToDateString(data.paid_at),
        };

        setProcessing(true);

        axios
            .put(`/api/rentals/${rental.id}`, body)
            .then((response) => {
                toast.success('Reserva atualizada com sucesso!');
                visit(route('reservas.rental', { rental: rental.id }));
            })
            .catch((error) => {
                let response = error.response.data;
                let message = response?.message ?? 'Erro ao atualizar reserva.';

                toast.error(message);
                setErrors(response?.errors);
            })
            .finally(() => {
                setProcessing(false);
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
                {
                    title: `Editar`,
                    href: route('reservas.rental.editar', { rental: rental.id }),
                },
            ]}
        >
            <Head title="Veículos" />
            <RentalForm
                formHook={{ data, setData, errors, reset, processing, setProcessing }}
                onSubmit={handleSubmit}
                disableCustomersComboBox={true}
                disableVehiclesComboBox={true}
                prefetchedVehicle={rental.vehicle}
                prefetchedVehicles={[rental.vehicle]}
                prefetchedCustomer={rental.customer}
                prefetchedCustomers={[rental.customer]}
            />
        </AppLayout>
    );
};
