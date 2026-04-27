/**
 * Button.jsx — FSAD-PS34
 * Reusable button with variants, loading state, dark mode.
 */

import { Loader2 } from 'lucide-react';

const VARIANTS = {
    primary: 'bg-[var(--accent)] hover:bg-[var(--accent-strong)] active:bg-[var(--accent-strong)] text-white shadow-[0_18px_40px_rgba(23,107,104,0.18)]',
    secondary: 'bg-[var(--surface-muted)] hover:bg-[#e2ddd3] dark:bg-[#1d2328] dark:hover:bg-[#232b31] text-[var(--text)]',
    danger: 'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow-sm',
    ghost: 'hover:bg-white/70 dark:hover:bg-white/6 text-[var(--muted)] dark:text-[var(--muted)]',
    outline: 'border border-[var(--line-strong)] bg-white/52 dark:bg-white/[0.03] hover:bg-white/84 dark:hover:bg-white/[0.06] text-[var(--text)]',
};

const SIZES = {
    sm: 'h-9 px-3.5 text-xs',
    md: 'h-11 px-4.5 text-sm',
    lg: 'h-12 px-6 text-sm',
};

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    fullWidth = false,
    className = '',
    disabled,
    ...props
}) {
    const isDisabled = disabled || loading;

    return (
        <button
            disabled={isDisabled}
            className={[
                'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-transparent',
                'disabled:opacity-60 disabled:cursor-not-allowed',
                VARIANTS[variant] ?? VARIANTS.primary,
                SIZES[size] ?? SIZES.md,
                fullWidth ? 'w-full' : '',
                className,
            ].join(' ')}
            {...props}
        >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {children}
        </button>
    );
}
