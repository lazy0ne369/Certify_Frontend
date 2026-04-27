/**
 * StatCard.jsx — FSAD-PS34
 * Animated stat card with counter, icon, trend text, hover lift.
 */

import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { cardVariants, cardHover } from '../../animations/variants';

function AnimatedNumber({ value }) {
    const count = useMotionValue(0);
    const rounded = useTransform(count, (v) => Math.round(v));
    const ref = useRef(null);

    useEffect(() => {
        const controls = animate(count, value, { duration: 1, ease: 'easeOut' });
        return controls.stop;
    }, [value, count]);

    return <motion.span ref={ref}>{rounded}</motion.span>;
}

export default function StatCard({ title, value, icon: Icon, color = 'indigo', trend }) {
    const colorMap = {
        indigo: { bg: 'bg-[#efe2d3] dark:bg-[#33231f]', icon: 'text-[#861c1c] dark:text-[#f4b34f]' },
        emerald: { bg: 'bg-[#e6efe3] dark:bg-[#203026]', icon: 'text-[#4d7a4f] dark:text-[#8ed08d]' },
        amber: { bg: 'bg-[#f8ebcb] dark:bg-[#3a2b17]', icon: 'text-[#c06f30] dark:text-[#f4b34f]' },
        red: { bg: 'bg-[#f4ddda] dark:bg-[#3a2020]', icon: 'text-[#9b2c2c] dark:text-[#f4a29b]' },
        sky: { bg: 'bg-[#e5ecef] dark:bg-[#1f2d33]', icon: 'text-[#5b7683] dark:text-[#9cc0d0]' },
    };

    const c = colorMap[color] ?? colorMap.indigo;

    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            {...cardHover}
            className="dashboard-surface rounded-[1.4rem] p-5 flex items-start gap-4 cursor-default"
        >
            {/* Icon circle */}
            <div className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${c.bg}`}>
                {Icon && <Icon className={`w-5 h-5 ${c.icon}`} />}
            </div>

            {/* Text */}
            <div className="min-w-0">
                <p className="text-sm font-medium dashboard-panel-text truncate">{title}</p>
                <p className="mt-0.5 text-2xl font-bold dashboard-panel-title leading-tight">
                    <AnimatedNumber value={Number(value) || 0} />
                </p>
                {trend && (
                    <p className="mt-0.5 text-xs dashboard-panel-text">{trend}</p>
                )}
            </div>
        </motion.div>
    );
}
