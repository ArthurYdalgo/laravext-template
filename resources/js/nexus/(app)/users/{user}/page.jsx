import { FormField, FormRow, FormSection } from '@/components/form-layout';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, nexusProps } from '@laravext/react';
import moment from 'moment';
import { useState } from 'react';

export default () => {
    const [user, setUser] = useState(nexusProps().user);

    return (
        <AppLayout
            breadcrumbs={[
                {
                    title: 'Users',
                    href: '/users',
                },
                {
                    title: `#${user.id} ${user.first_name}`,
                    href: route('users.user', { user: user.id }),
                },
            ]}
            actions={
                <div className="ml-auto flex items-center gap-2">
                    <Button size="xs" asChild>
                        <Link href={route('users.user.edit', { user: user.id })}>Edit</Link>
                    </Button>
                </div>
            }
        >
            <Head title="Veículos" />
            <div className="space-y-8 p-6">
                <FormSection title="Informações Pessoais" titleWidth="md:w-48">
                    <FormRow cols={12}>
                        <FormField span={8} label="Nome">
                            {customer.name}
                        </FormField>
                        <FormField span={4} label="CPF">
                            {customer.cpf}
                        </FormField>

                        <FormField span={8} label="Email">
                            {customer.email}
                        </FormField>
                        <FormField span={4} label="Data de Nascimento">
                            {moment(customer.birthday).format('DD/MM/YYYY')}
                        </FormField>
                    </FormRow>
                </FormSection>

                <FormSection title="Documentação" titleWidth="md:w-48">
                    <FormRow cols={12}>
                        <FormField span={8} label="CNH">
                            {customer.license_number}
                        </FormField>
                        <FormField span={4} label="UF emissora da CNH">
                            {customer.license_issuing_state}
                        </FormField>
                    </FormRow>
                </FormSection>

                <FormSection title="Endereço" titleWidth="md:w-48">
                    <FormRow cols={12}>
                        <FormField span={12} label="Logradouro">
                            {customer.address.street}
                        </FormField>

                        <FormField span={4} label="Número">
                            {customer.address.number}
                        </FormField>
                        <FormField span={4} label="Complemento">
                            {customer.address.complement ?? '--'}
                        </FormField>
                        <FormField span={4} label="Bairro">
                            {customer.address.district}
                        </FormField>

                        <FormField span={4} label="CEP">
                            {customer.address.zip_code}
                        </FormField>
                        <FormField span={4} label="Cidade">
                            {customer.address.city}
                        </FormField>
                        <FormField span={4} label="UF">
                            {customer.address.state}
                        </FormField>
                    </FormRow>
                </FormSection>
            </div>
        </AppLayout>
    );
};
