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
                    <Icon className="pointer-events-none absolute left-0 top-1/2 h-[16px] w-[16px] -translate-y-1/2 text-[#94A3B8] transition-colors duration-200 group-focus-within:text-[#2563EB]" />
                )}
                
                <input
                    ref={ref}
                    type={inputType}
                    className={[
                        'w-full bg-transparent border-0 border-b-2 transition-colors duration-200 ease',
                        'py-[8px] pl-[28px] pr-[32px]',
                        'text-[14px] text-[#111827]',
                        'placeholder:text-[#94A3B8] placeholder:text-[13px]',
                        'focus:outline-none focus:border-[#2563EB]',
                        error ? 'border-red-400 dark:border-red-500' : 'border-[#CBD5E1]',
                        className,
                    ].join(' ')}
                    {...props}
                />

                {isPassword && (
                    <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShow((v) => !v)}
                        className="absolute right-0 top-1/2 -translate-y-1/2 cursor-pointer text-[#94A3B8]"
                    >
                        {show ? <EyeOff className="h-[16px] w-[16px]" /> : <Eye className="h-[16px] w-[16px]" />}
                    </button>
                )}
            </div>

            <div className="block w-full h-[1px] bg-[#E2E8F0] mb-[4px] mt-2" />

            {error && (
                <p className="absolute -bottom-[20px] left-0 text-xs text-red-500 dark:text-red-400">
                    {error}
                </p>
            )}
        </div>
    );
});

export default Input;
