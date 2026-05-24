// /components/StatePicker.tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { nexusProps } from '@laravext/react';


export default function VehicleTypePicker({ value, onChange, placeholder = 'Selecione o tipo', disabled, id, name }) {
    const vehicleTypes = nexusProps().vehicle_types || [];

    return (
        <Select value={value} onValueChange={onChange} disabled={disabled} name={name}>
            <SelectTrigger id={id}>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                {vehicleTypes.map((vehicleType) => (
                    <SelectItem key={`vehicle-type-picker-${vehicleType.value}`} value={vehicleType.value}>
                        {vehicleType.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
