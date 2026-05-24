import { useForm } from '@/hooks/use-form';
import AppLayout from '@/layouts/app-layout';
import { Head, nexus, nexusProps, routeParams, visit } from '@laravext/react';
import { useState } from 'react';
import Form from '../../form';
import VehicleForm from '../../form';
import { dateToDateString, dateToForm } from '@/lib/utils';
import axios from 'axios';
import { toast } from "sonner";

export default () => {
    const [vehicle, setVehicle] = useState(nexusProps().vehicle);

    const { data, setData, errors, setErrors, reset, processing, setProcessing } = useForm({
        ...nexusProps().vehicle,
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        let body = {...data, birthday: dateToDateString(data.birthday)};

        setProcessing(true);

        axios.put(`/api/vehicles/${vehicle.id}`, body)
        .then((response) => {
            toast.success("Cliente atualizado com sucesso!");
            visit(route("veiculos.vehicle", {vehicle: vehicle.id}));
        })
        .catch((error) => {
            let response = error.response.data;
            console.log(response);
            let message = response?.message ?? "Erro ao atualizar veículo.";

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
                    title: 'Veiculos',
                    href: route('veiculos'),
                },
                {
                    title: `#${vehicle.id} ${vehicle.name}`,
                    href: route('veiculos.vehicle', { vehicle: vehicle.id }),
                },
                {
                    title: `Editar`,
                    href: route('veiculos.vehicle.editar', { vehicle: vehicle.id }),
                },
            ]}
        >
            <Head title="Veículos" />
            <VehicleForm formHook={{data, setData, errors, reset, processing, setProcessing}} onSubmit={handleSubmit} />
        </AppLayout>
    );
};
