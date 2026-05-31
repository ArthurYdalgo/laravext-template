import { FormField, FormRow, FormSection } from '@/components/form-layout';
import MomentDate from '@/components/moment-date';
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
                    href: route('users'),
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
            <Head title="Users" />
            <div className="space-y-8 p-6">
                <FormSection title="Informações Pessoais" titleWidth="md:w-48">
                    <FormRow cols={12}>
                        <FormField span={8} label="Name">
                            {user.name}
                        </FormField>

                        <FormField span={8} label="Email">
                            {user.email}
                        </FormField>
                        <FormField span={4} label="Data de Nascimento">
                            <MomentDate date={user.birthday} format="DD/MM/YYYY" />
                        </FormField>
                    </FormRow>
                </FormSection>

                <FormSection title="Endereço" titleWidth="md:w-48">
                    <FormRow cols={12}>
                        <FormField span={12} label="Logradouro">
                            {user.address?.street ?? '--'}
                        </FormField>

                        <FormField span={4} label="Número">
                            {user.address?.number ?? '--'}
                        </FormField>
                        <FormField span={4} label="Complemento">
                            {user.address?.complement ?? '--'}
                        </FormField>
                        <FormField span={4} label="Bairro">
                            {user.address?.district ?? '--'}
                        </FormField>

                        <FormField span={4} label="CEP">
                            {user.address?.zip_code ?? '--'}
                        </FormField>
                        <FormField span={4} label="Cidade">
                            {user.address?.city ?? '--'}
                        </FormField>
                        <FormField span={4} label="UF">
                            {user.address?.state ?? '--'}
                        </FormField>
                    </FormRow>
                </FormSection>
            </div>
        </AppLayout>
    );
};
