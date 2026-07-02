// /components/StatePicker.tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { nexusProps } from '@laravext/react';

export default function PaymentMethodPicker({ value, onChange, placeholder = 'Selecione', disabled, id, name, exclude = [] }) {
    const paymentMethods = nexusProps().payment_methods || [];

    return (
        <Select value={value} onValueChange={onChange} disabled={disabled} name={name}>
            <SelectTrigger id={id}>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                {paymentMethods
                .filter((pm => !exclude.includes(`${pm.id}`)))
                .map((paymentMethod) => (
                    <SelectItem key={`payment-method-picker-${paymentMethod.id}`} value={`${paymentMethod.id}`}>
                        <div className="flex items-center ">
                            <img src={`/images/payment-methods/${paymentMethod.tag}.svg`} alt={paymentMethod.name} className="mr-2 inline h-6" />
                            <span className='whitespace-nowrap'>{paymentMethod.name}</span>
                        </div>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
