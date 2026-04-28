import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

const VARIANTS = {
    primary: 'bg-[#2563EB] text-white hover:bg-[#1D4ED8] hover:scale-[1.02] hover:shadow-[0_8px_20px_rgba(37,99,235,0.35)] active:scale-[0.98] border-none',
    secondary: 'bg-transparent text-[#2563EB] underline underline-offset-4 hover:text-[#1D4ED8]',
    danger: 'bg-[#DC2626] text-white shadow-md hover:bg-[#B91C1C] active:bg-[#991B1B]',
    ghost: 'bg-transparent text-[#6B7280] hover:bg-slate-100 hover:text-[#111827]',
    outline: 'border border-slate-200 bg-white text-[#111827] hover:bg-slate-50',
};

const SIZES = {
    sm: 'h-9 px-3.5 text-xs',
    md: 'h-11 px-4.5 text-sm',
    lg: 'py-[11px] px-[28px] text-[14px]',
};

const Button = forwardRef(function Button({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    fullWidth = false,
    className = '',
    disabled,
    ...props
}, ref) {
    const isDisabled = disabled || loading;

    return (
        <button
            ref={ref}
            disabled={isDisabled}
            className={[
                'inline-flex items-center justify-center gap-[8px] rounded-full font-[700] transition-all duration-200 ease',
                'focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2 focus:ring-offset-transparent',
                'disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100 disabled:hover:shadow-none',
                VARIANTS[variant] ?? VARIANTS.primary,
                SIZES[size] ?? SIZES.md,
                fullWidth ? 'w-full' : '',
                className,
            ].join(' ')}
            {...props}
        >
            {loading && <Loader2 className="h-[16px] w-[16px] animate-spin" />}
            {children}
        </button>
    );
});

export default Button;
