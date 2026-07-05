import { useForm } from '@/hooks/use-form';
import AppLayout from '@/layouts/app-layout';
import { Head, nexus, nexusProps, routeParams, visit } from '@laravext/react';
import { useState } from 'react';
import UserForm from '../../form';
import { dateToDateString, dateToForm } from '@/lib/utils';
import axios from 'axios';
import { toast } from "sonner";
import PageMeta from '@/components/page-meta';

export default () => {
    const [user, setUser] = useState(nexusProps().user);

    const { data, setData, errors, setErrors, reset, processing, setProcessing } = useForm({
        ...nexusProps().user,
        birthday: dateToForm(nexusProps().user.birthday),
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        let body = {...data, birthday: dateToDateString(data.birthday)};

        setProcessing(true);

        axios.put(`/api/users/${user.id}`, body)
        .then((response) => {
            toast.success("User update");
            visit(route("users.user", {user: user.id}));
        })
        .catch((error) => {
            let response = error.response.data;
            console.log(response);
            let message = response?.message ?? "Error updating user";

            toast.error(message);
            setErrors(response?.errors);
        })
        .finally(() => {
            setProcessing(false);
        });
    }

    return (
        <>
            <PageMeta breadcrumbs={[
                {
                    title: 'Users',
                    href: route('users'),
                },
                {
                    title: `#${user.id} ${user.first_name}`,
                    href: route('users.user', { user: user.id }),
                },
                {
                    title: `Edit`,
                    href: route('users.user.edit', { user: user.id }),
                },
            ]}
        >
            <Head title="Users" />
            <UserForm formHook={{data, setData, errors, reset, processing, setProcessing}} onSubmit={handleSubmit} />
        </>
        // </AppLayout>
    );
};
