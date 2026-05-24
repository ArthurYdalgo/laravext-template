import { cn } from '@/lib/utils';
import { NumberFormatBase } from 'react-number-format';

const CurrencyInput = ({ currentValue = 0, className = '', onChangeInput, name = '', required = false }) => {
    // Format by the end
    const formatCurrencyByEnd = (value) => {
        const amount = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
        }).format(parseFloat(value) / 100);

        return `${amount}`;
    };

    return (
        <NumberFormatBase
            className={cn(
                'border-input bg-background ring-offset-background file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
                className,
            )}
            format={formatCurrencyByEnd}
            
            
            required={required}
            inputMode="numeric"
            displayType="input"
            value={!currentValue || !Number(currentValue) ? Number(0) * 100 : Number(currentValue) * 100}
            name={name}
            isAllowed={(values) => {
                const { formattedValue, floatValue } = values;
                return formattedValue === '' || floatValue / 100 <= 100000000000;
            }}
            onValueChange={(values) => {
                if (onChangeInput) {
                    onChangeInput(parseFloat((parseFloat(values.value) / 100).toFixed(2)));
                }
            }}
        />
    );
};

export default CurrencyInput;
