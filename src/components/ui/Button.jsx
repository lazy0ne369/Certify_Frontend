import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

const VARIANTS = {
    primary: 'bg-[var(--accent)] text-white hover:bg-[var(--accent-strong)] hover:scale-[1.02] hover:shadow-[0_8px_20px_var(--accent-glow)] active:scale-[0.98] border-none',
    secondary: 'bg-transparent text-[var(--accent)] underline underline-offset-4 hover:text-[var(--accent-strong)]',
    danger: 'bg-[var(--danger)] text-white shadow-md hover:brightness-95 active:brightness-90',
    ghost: 'bg-transparent text-[var(--muted)] hover:bg-[var(--bg-soft)] hover:text-[var(--text)]',
    outline: 'border border-[var(--line)] bg-[var(--surface)] text-[var(--text)] hover:bg-[var(--bg-soft)]',
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
                'focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-transparent',
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
