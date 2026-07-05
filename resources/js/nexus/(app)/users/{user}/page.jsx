import { FormField, FormRow, FormSection } from '@/components/form-layout';
import MomentDate from '@/components/moment-date';
import PageMeta from '@/components/page-meta';
import { Head, nexusProps } from '@laravext/react';
import { useState } from 'react';

export default () => {
    const [user, setUser] = useState(nexusProps().user);

    return (
        <>
            <PageMeta
                breadcrumbs={[
                    {
                        title: 'Users',
                        href: route('users'),
                    },
                    {
                        title: `#${user.id} ${user.first_name}`,
                        href: route('users.user', { user: user.id }),
                    }
                ]}
            />
            <Head title="Users" />
            <div className="space-y-8 p-6">
                <FormSection title="Personal Information" titleWidth="md:w-48">
                    <FormRow cols={12}>
                        <FormField span={8} label="Name">
                            {user.name}
                        </FormField>

                        <FormField span={8} label="Email">
                            {user.email}
                        </FormField>
                        <FormField span={4} label="Birthday">
                            <MomentDate date={user.birthday} format="DD/MM/YYYY" />
                        </FormField>
                    </FormRow>
                </FormSection>

                <FormSection title="Address" titleWidth="md:w-48">
                    <FormRow cols={12}>
                        <FormField span={12} label="Street">
                            {user.address?.street ?? '--'}
                        </FormField>

                        <FormField span={4} label="Number">
                            {user.address?.number ?? '--'}
                        </FormField>
                        <FormField span={4} label="Complement">
                            {user.address?.complement ?? '--'}
                        </FormField>
                        <FormField span={4} label="District">
                            {user.address?.district ?? '--'}
                        </FormField>

                        <FormField span={4} label="Zip Code">
                            {user.address?.zip_code ?? '--'}
                        </FormField>
                        <FormField span={4} label="City">
                            {user.address?.city ?? '--'}
                        </FormField>
                        <FormField span={4} label="State">
                            {user.address?.state ?? '--'}
                        </FormField>
                    </FormRow>
                </FormSection>
            </div>
        </>
    );
};
