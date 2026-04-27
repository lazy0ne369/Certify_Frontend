/**
 * Input.jsx — FSAD-PS34
 * Reusable form input with label, error message, dark mode.
 */

import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = forwardRef(function Input(
    { label, error, type = 'text', icon: Icon, className = '', ...props },
    ref
) {
    const [show, setShow] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (show ? 'text' : 'password') : type;

    return (
        <div className="flex flex-col gap-1.5">
            {label && (
                <label className="text-sm font-medium text-[var(--text)]">
                    {label}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <Icon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
                )}
                <input
                    ref={ref}
                    type={inputType}
                    className={[
                        'w-full h-12 rounded-2xl border bg-white/74 text-sm transition-all duration-200 dark:bg-white/[0.03]',
                        'text-[var(--text)] placeholder:text-[var(--muted)]',
                        'focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)]',
                        Icon ? 'pl-11' : 'pl-4',
                        isPassword ? 'pr-11' : 'pr-4',
                        error
                            ? 'border-red-400 dark:border-red-500'
                            : 'border-[var(--line-strong)]',
                        className,
                    ].join(' ')}
                    {...props}
                />
                {isPassword && (
                    <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShow((v) => !v)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--text)]"
                    >
                        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                )}
            </div>
            {error && (
                <p className="text-xs text-red-500 dark:text-red-400">{error}</p>
            )}
        </div>
    );
});

export default Input;
