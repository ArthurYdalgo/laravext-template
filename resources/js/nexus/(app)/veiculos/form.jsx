// app/example-form.jsx
import { Input } from '@/components/ui/input';

import { Button } from '@/components/ui/button';

import BrandPicker from '@/components/brand-picker';
import ColorPicker from '@/components/color-picker';
import { FormActions, FormField, FormRow } from '@/components/form-layout';
import VehicleTypePicker from '@/components/vehicle-type-picker';
import CurrencyInput from '@/components/currency-input';

export default function CustomerForm({ formHook, onSubmit = (e) => {}, ...props }) {
    return (
        <form onSubmit={onSubmit} className="space-y-8 p-6">
            <FormRow cols={12}>
                <FormField span={4} error={formHook.errors.name} label="Nome" htmlFor="name" required>
                    <Input
                        id="name"
                        name="name"
                        placeholder="João"
                        required
                        value={formHook.data.name ?? ''}
                        onChange={(e) => formHook.setData('name', e.target.value)}
                    />
                </FormField>
                <FormField span={4} error={formHook.errors.type} label="Tipo" htmlFor="type" required>
                    <VehicleTypePicker
                        id="type"
                        name="type"
                        required
                        value={formHook.data.type ?? ''}
                        onChange={(value) => formHook.setData('type', value)}
                    />
                </FormField>
                <FormField span={4} error={formHook.errors.license_plate} label="Placa" htmlFor="license_plate" required>
                    <Input
                        id="license_plate"
                        name="license_plate"
                        placeholder="João"
                        required
                        value={formHook.data.license_plate ?? ''}
                        onChange={(e) => formHook.setData('license_plate', e.target.value)}
                    />
                </FormField>
            </FormRow>
            <FormRow cols={12}>
                <FormField span={4} error={formHook.errors.brand_id} label="Marca" htmlFor="vehicle.brand_id" required>
                    <BrandPicker
                        id="brand_id"
                        name="brand_id"
                        buttonClassName="w-full"
                        required
                        value={formHook.data.brand_id ? `${formHook.data.brand_id}` : ''}
                        onChange={(value) => formHook.setData('brand_id', value)}
                    />
                </FormField>

                <FormField span={4} error={formHook.errors.color_id} label="Cor" htmlFor="color_id" required>
                    <ColorPicker
                        id="color_id"
                        name="color_id"
                        buttonClassName="w-full"
                        required
                        value={formHook.data.color_id ? `${formHook.data.color_id}` : ''}
                        onChange={(value) => {
                            console.log('color_id changed to', value);
                            formHook.setData('color_id', `${value}`);
                        }}
                    />
                </FormField>
                <FormField span={4} error={formHook.errors.year} label="Ano" htmlFor="year" required>
                    <Input
                        id="year"
                        name="year"
                        type="number"
                        required
                        value={formHook.data.year ?? ''}
                        onChange={(e) => formHook.setData('year', e.target.value)}
                    />
                </FormField>
            </FormRow>
            <FormRow cols={12}>
                <FormField span={4} error={formHook.errors.seats} label="Lugares" htmlFor="seats" required>
                    <Input
                        id="seats"
                        name="seats"
                        type="number"
                        required
                        value={formHook.data.seats ?? ''}
                        onChange={(e) => formHook.setData('seats', e.target.value)}
                    />
                </FormField>
                <FormField span={4} error={formHook.errors.trunk_capacity} label="Capacidade do Porta-Malas" htmlFor="trunk_capacity" required>
                    <Input
                        id="trunk_capacity"
                        step={1}
                        name="trunk_capacity"
                        type="number"
                        required
                        value={formHook.data.trunk_capacity ?? ''}
                        onChange={(e) => formHook.setData('trunk_capacity', e.target.value)}
                    />
                </FormField>
                <FormField span={4} error={formHook.errors.trunk_capacity} label="Preço por dia" htmlFor="price" required>
                    <CurrencyInput
                        required
                        onChangeInput={(value) => {
                            formHook.setData("price_per_day", value);
                        }}
                        currentValue={formHook.data.price_per_day || ""}
                    />
                </FormField>
            </FormRow>

            <FormActions>
                <Button type="submit">Salvar</Button>
            </FormActions>
        </form>
    );
}
