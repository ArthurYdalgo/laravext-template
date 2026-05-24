import { useNonInitialEffect } from '@/hooks/use-non-initial-effect';
import { cn } from '@/lib/utils';
import { InputMask } from '@react-input/mask';
import { forwardRef, useRef } from 'react';
import { Input } from './ui/input';

export default forwardRef(function CPFInput(
    {
        type = 'text',
        className = '',
        required = false,
        disabled = false,
        showMask = true,
        mask = '___.___.___-__',
        replacement = { _: /\d/ },
        addGrayBackgroundIfDisabled = true,
        isFocused = false,
        ...props
    },
    ref,
) {
    const input = ref ? ref : useRef();

    useNonInitialEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, []);

    return (
        <div>
            {mask || replacement ? (
                <InputMask
                    mask={mask}
                    replacement={replacement}
                    {...props}
                    showMask={showMask}
                    className={cn(
                        'border-input bg-background ring-offset-background file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
                        className,
                    )}
                    type={type}
                    required={required}
                    disabled={disabled}
                    ref={input}
                />
            ) : (
                <Input
                    {...props}
                    className={cn(
                        'border-input bg-background ring-offset-background file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
                        className,
                    )}
                    type={type}
                    required={required}
                    disabled={disabled}
                    ref={input}
                />
            )}
        </div>
    );
});
