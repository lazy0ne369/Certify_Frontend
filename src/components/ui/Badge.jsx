import { motion } from 'framer-motion';

const VARIANTS = {
    active: {
        label: 'Active',
        className: 'border-emerald-200 bg-emerald-50 text-emerald-600',
        dot: 'bg-emerald-500',
    },
    expiring: {
        label: 'Expiring',
        className: 'border-amber-200 bg-amber-50 text-amber-600',
        dot: 'bg-amber-500',
    },
    expired: {
        label: 'Expired',
        className: 'border-rose-200 bg-rose-50 text-rose-600',
        dot: 'bg-rose-500',
    },
    pending: {
        label: 'Pending',
        className: 'border-slate-200 bg-slate-100 text-slate-500',
        dot: 'bg-slate-400',
    },
};

export default function Badge({ variant = 'pending', children, className = '' }) {
    const config = VARIANTS[variant] ?? VARIANTS.pending;
    const pulse = variant === 'expiring';

    return (
        <motion.span
            animate={pulse ? { opacity: [1, 0.6, 1] } : undefined}
            transition={pulse ? { duration: 1.8, repeat: Infinity, ease: 'easeInOut' } : undefined}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${config.className} ${className}`}
        >
            <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
            {children ?? config.label}
        </motion.span>
    );
}
