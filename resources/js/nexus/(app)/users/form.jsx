// app/example-form.jsx
import { Input } from '@/components/ui/input';

import { Button } from '@/components/ui/button';

import CpfInput from '@/components/cpf-input';
import DatePicker from '@/components/date-picker';
import { FormActions, FormField, FormRow, FormSection } from '@/components/form-layout';
import StatePicker from '@/components/state-picker';
import ZipInput from '@/components/zip-input';
import axios from 'axios';
import { useState } from 'react';

export default function CustomerForm({ formHook, onSubmit = (e) => {}, ...props }) {
    const [searchingZipCode, setSearchingZipCode] = useState(false);

    const handleSearchZipCode = async (e) => {
        setSearchingZipCode(true);

        axios
            .get('/api/tools/search-zip-code', { params: { zip_code: e.target.value } })
            .then((response) => {
                let address_data = response.data.data;

                formHook.setData({
                    ...formHook.data,
                    address: {
                        ...formHook.data.address,
                        street: address_data.street,
                        district: address_data.district,
                        state: address_data.uf,
                        city: address_data.city,
                    },
                });
            })
            .catch((error) => {
                console.error('Error fetching zip code data:', error);
            })
            .finally(() => {
                setSearchingZipCode(false);
            });
    };

    return (
        <form onSubmit={onSubmit} className="space-y-8 p-6">
            {/* Section 1: Basic info (title on the RIGHT per your spec) */}
            <FormSection title="Informações Pessoais" titleWidth="md:w-48">
                <FormRow cols={12}>
                    <FormField span={8} error={formHook.errors.name} label="Nome" htmlFor="name" required>
                        <Input
                            id="name"
                            name="name"
                            placeholder="João"
                            required
                            value={formHook.data.name ?? ''}
                            onChange={(e) => formHook.setData('name', e.target.value)}
                        />
                    </FormField>

                    <FormField span={8} error={formHook.errors.email} label="Email" htmlFor="email" required>
                        <Input
                            id="email"
                            type="email"
                            placeholder="joao@gmail.com"
                            value={formHook.data.email ?? ''}
                            onChange={(e) => formHook.setData('email', e.target.value)}
                        />
                    </FormField>
                    <FormField span={4} error={formHook.errors.birthday} label="Data de Nascimento" htmlFor="birthday" required>
                        <DatePicker
                            innerDivClassName="w-full"
                            id="birthday"
                            name="birthday"
                            label={null}
                            required
                            date={formHook.data.birthday ?? ''}
                            onChangeDate={(date) => formHook.setData('birthday', date)}
                            onClear={() => formHook.setData('birthday', null)}
                        />
                    </FormField>
                </FormRow>
            </FormSection>


            <FormSection title="Endereço" titleWidth="md:w-48">
                <FormRow cols={12}>
                    <FormField span={12} error={formHook.errors['address.street']} label="Street" htmlFor="address.street" required>
                        <Input
                            id="address.street"
                            name="address.street"
                            placeholder="Baker Street"
                            required
                            value={formHook.data.address?.street ?? ''}
                            onChange={(e) => formHook.setData('address', { ...formHook.data.address, street: e.target.value })}
                        />
                    </FormField>

                    <FormField span={4} error={formHook.errors['address.number']} label="Number" htmlFor="address.number" required>
                        <Input
                            id="address.number"
                            name="address.number"
                            placeholder="441B"
                            required
                            value={formHook.data.address?.number ?? ''}
                            onChange={(e) => formHook.setData('address', { ...formHook.data.address, number: e.target.value })}
                        />
                    </FormField>
                    <FormField span={4} error={formHook.errors['address.complement']} label="Complement" htmlFor="address.complement">
                        <Input
                            id="address.complement"
                            name="address.complement"
                            placeholder="Second floor"
                            value={formHook.data.address?.complement ?? ''}
                            onChange={(e) => formHook.setData('address', { ...formHook.data.address, complement: e.target.value })}
                        />
                    </FormField>
                    <FormField span={4} error={formHook.errors['address.district']} label="Bairro" htmlFor="address.district" required>
                        <Input
                            id="address.district"
                            name="address.district"
                            placeholder="Vila Becker"
                            required
                            value={formHook.data.address?.district ?? ''}
                            onChange={(e) => formHook.setData('address', { ...formHook.data.address, district: e.target.value })}
                        />
                    </FormField>

                    <FormField span={4} error={formHook.errors['address.zip_code']} label="CEP" htmlFor="address.zip_code" required>
                        <ZipInput
                            id="address.zip_code"
                            name="address.zip_code"
                            placeholder="85902-490"
                            required
                            onBlur={handleSearchZipCode}
                            loading={searchingZipCode}
                            value={formHook.data.address?.zip_code ?? ''}
                            onChange={(e) => formHook.setData('address', { ...formHook.data.address, zip_code: e.target.value })}
                        />
                    </FormField>
                    <FormField span={4} error={formHook.errors['address.city']} label="Cidade" htmlFor="address.city" required>
                        <Input
                            id="address.city"
                            name="address.city"
                            placeholder="São Paulo"
                            required
                            value={formHook.data.address?.city ?? ''}
                            onChange={(e) => formHook.setData('address', { ...formHook.data.address, city: e.target.value })}
                        />
                    </FormField>
                    <FormField span={4} error={formHook.errors['address.state']} label="UF" htmlFor="address.state" required>
                        <StatePicker
                            id="address.state"
                            name="address.state"
                            required
                            value={formHook.data.address?.state ?? ''}
                            onChange={(value) => formHook.setData('address', { ...formHook.data.address, state: value })}
                        />
                    </FormField>
                </FormRow>
            </FormSection>

            <FormActions>
                <Button type="submit">Salvar</Button>
            </FormActions>
        </form>
    );
}
