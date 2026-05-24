import { useForm } from '@/hooks/use-form';
import AppLayout from '@/layouts/app-layout';
import { Head, visit } from '@laravext/react';

import { dateToDateString, dateToForm } from '@/lib/utils';
import axios from 'axios';
import { toast } from 'sonner';
import RentalForm from '../form';

export default () => {
    const { data, setData, errors, setErrors, reset, processing, setProcessing } = useForm({
        payment_methods: [
            { id: '', amount: 0 },
        ],
        paid_amount: 0,
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        let body = { ...data, birthday: dateToDateString(data.birthday) };

        setProcessing(true);

        axios
            .post(`/api/rentals`, body)
            .then((response) => {
                toast.success('Reserva criada com sucesso!');
                // visit(route('reservas.rental', { rental: response.data.data.id }));
                visit(route('reservas'));
            })
            .catch((error) => {
                let response = error.response.data;
                console.log(response);
                let message = response?.message ?? 'Erro ao cadastrar reserva.';

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
                    title: `Cadastrar`,
                    href: route('reservas.cadastrar'),
                },
            ]}
        >
            <Head title="Reservas" />
            <RentalForm formHook={{ data, setData, errors, reset, processing, setProcessing }} onSubmit={handleSubmit} />
        </AppLayout>
    );
};
