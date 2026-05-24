import { useForm } from '@/hooks/use-form';
import AppLayout from '@/layouts/app-layout';
import { Head, nexus, nexusProps, routeParams, visit } from '@laravext/react';
import { useState } from 'react';
import Form from '../../form';
import CustomerForm from '../../form';
import { dateToDateString, dateToForm } from '@/lib/utils';
import axios from 'axios';
import { toast } from "sonner";

export default () => {
    const [customer, setCustomer] = useState(nexusProps().customer);

    const { data, setData, errors, setErrors, reset, processing, setProcessing } = useForm({
        ...nexusProps().customer,
        birthday: dateToForm(nexusProps().customer.birthday),
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        let body = {...data, birthday: dateToDateString(data.birthday)};

        setProcessing(true);

        axios.put(`/api/customers/${customer.id}`, body)
        .then((response) => {
            toast.success("Cliente atualizado com sucesso!");
            visit(route("clientes.customer", {customer: customer.id}));
        })
        .catch((error) => {
            let response = error.response.data;
            console.log(response);
            let message = response?.message ?? "Erro ao atualizar cliente.";

            toast.error(message);
            setErrors(response?.errors);
        })
        .finally(() => {
            setProcessing(false);
        });
    }

    return (
        <AppLayout
            breadcrumbs={[
                {
                    title: 'Clientes',
                    href: route('clientes'),
                },
                {
                    title: `#${customer.id} ${customer.first_name}`,
                    href: route('clientes.customer', { customer: customer.id }),
                },
                {
                    title: `Editar`,
                    href: route('clientes.customer.editar', { customer: customer.id }),
                },
            ]}
        >
            <Head title="Veículos" />
            <CustomerForm formHook={{data, setData, errors, reset, processing, setProcessing}} onSubmit={handleSubmit} />
        </AppLayout>
    );
};
