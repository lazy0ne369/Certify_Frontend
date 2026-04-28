import { motion } from 'framer-motion';
import { ArrowRight, FileSearch, Sparkles } from 'lucide-react';
import { fadeInScale } from '../../animations/variants';
import Button from '../ui/Button';
import Card from '../ui/Card';

export default function EmptyState({
    title = 'Nothing here yet',
    message = 'No items found.',
    actionLabel,
    onAction,
}) {
    return (
        <motion.div variants={fadeInScale} initial="hidden" animate="visible">
            <Card className="px-6 py-16 text-center">
                <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[radial-gradient(circle_at_top,#DBEAFE,#EFF6FF)]">
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
                        <FileSearch className="h-8 w-8 text-[#2563EB]" />
                        <Sparkles className="absolute -right-1 -top-1 h-4 w-4 text-[#60A5FA]" />
                    </div>
                </div>

                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">// Empty state</p>
                <h3 className="mb-2 text-xl font-bold text-slate-900">{title}</h3>
                <p className="mx-auto max-w-md text-sm leading-7 text-slate-500">{message}</p>

                {actionLabel && onAction && (
                    <Button onClick={onAction} className="mt-6">
                        {actionLabel}
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                )}
            </Card>
        </motion.div>
    );
}
