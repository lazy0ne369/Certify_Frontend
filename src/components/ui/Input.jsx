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
        <div className="relative w-full mb-[28px] group">
            {label && (
                <label className="mb-1.5 block text-sm font-medium text-[var(--text)]">
                    {label}
                </label>
            )}
            
            <div className="relative w-full">
                {Icon && (
                    <Icon className="pointer-events-none absolute left-0 top-1/2 h-[16px] w-[16px] -translate-y-1/2 text-[var(--muted)] transition-colors duration-200 group-focus-within:text-[var(--accent)]" />
                )}
                
                <input
                    ref={ref}
                    type={inputType}
                    className={[
                        'w-full bg-transparent border-0 border-b-2 transition-colors duration-200 ease',
                        'py-[8px] pl-[28px] pr-[32px]',
                        'text-[14px] text-[var(--text)]',
                        'placeholder:text-[var(--muted)] placeholder:text-[13px]',
                        'focus:outline-none focus:border-[var(--accent)]',
                        error ? 'border-red-400 dark:border-red-500' : 'border-slate-300/80 dark:border-white/18',
                        className,
                    ].join(' ')}
                    {...props}
                />

                {isPassword && (
                    <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShow((v) => !v)}
                        className="absolute right-0 top-1/2 -translate-y-1/2 cursor-pointer text-[var(--muted)]"
                    >
                        {show ? <EyeOff className="h-[16px] w-[16px]" /> : <Eye className="h-[16px] w-[16px]" />}
                    </button>
                )}
            </div>

            <div className="mb-[4px] mt-2 block h-[1px] w-full bg-slate-200/90 dark:bg-white/10" />

            {error && (
                <p className="absolute -bottom-[20px] left-0 text-xs text-red-500 dark:text-red-400">
                    {error}
                </p>
            )}
        </div>
    );
});

export default Input;
