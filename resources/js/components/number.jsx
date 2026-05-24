
const Number = ({ value, locale = 'pt-br', nullFallback = '--',
    minimumFractionDigits = 2, maximumFractionDigits = 4,
    class_if_negative = null, class_if_positive = null,
    prefix = null,
    prefix_if_negative = null, prefix_if_positive = null,
    sufix = null,
    sufix_if_negative = null, sufix_if_positive = null,
    className = '', ...props }) => {

    const is_negative = value < 0;
    const is_positive = value > 0;

    const formatter = new Intl.NumberFormat(locale, {
        ...props,
        minimumFractionDigits: minimumFractionDigits,
        maximumFractionDigits: maximumFractionDigits,
    });

    if (class_if_negative != null && is_negative) {
        className = `${class_if_negative} ${className}`;
    }

    if (class_if_positive != null && is_positive) {
        className = `${class_if_positive} ${className}`;
    }

    return <span className={className}>{prefix}{prefix_if_positive && is_positive ? prefix_if_positive : ''}{prefix_if_negative && is_negative ? prefix_if_negative : ''}{value == null ? nullFallback : formatter.format(value)}{sufix}{sufix_if_positive && is_positive ? sufix_if_positive : ''}{sufix_if_negative && is_negative ? sufix_if_negative : ''}</span>;
}

export default Number;