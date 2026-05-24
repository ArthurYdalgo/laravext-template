import Number from "./number";

const Money = ({ amount, locale = 'pt-br', currency = 'BRL', nullFallback = 'R$ --,--', className = '',
    prefix = null,
    prefix_if_negative = null, prefix_if_positive = null,
    sufix = null,
    sufix_if_negative = null, sufix_if_positive = null,
    class_if_positive = null, class_if_negative = null, ...props }) => {
    return <Number className={className} value={amount}
        locale={locale} currency={currency} maximumFractionDigits={4} minimumFractionDigits={2} style="currency"
        nullFallback={nullFallback}
        prefix={prefix}
        sufix={sufix}
        class_if_positive={class_if_positive} class_if_negative={class_if_negative}
        prefix_if_negative={prefix_if_negative} prefix_if_positive={prefix_if_positive}
        sufix_if_negative={sufix_if_negative} sufix_if_positive={sufix_if_positive}
        {...props}
    />
}

export default Money;