import { nexusProps } from '@laravext/react';
import { ComboBox } from './ui/combo-box';

export default function ColorPicker({ value, onChange, placeholder = 'Selecione a cor', disabled, id, name, buttonClassName }) {
    const { colors } = nexusProps(); // Get color options from nexusProps

    // Map colors into the required format for the Combobox
    const colorItems = colors.map((color) => ({
        value: `${color.id}`, // Color ID as value
        label: (
            <div className="flex items-center gap-2">
                {color.name}
                <div className="h-3 w-3 rounded" style={{ backgroundColor: color.hex, border: '1px solid #aaaaaa44' }} />
            </div>
        ),
        keywords: [color.name],
    }));

    return (
        <ComboBox
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            buttonClassName={buttonClassName}
            items={colorItems} // Pass color items to the Combobox
        />
    );
}
