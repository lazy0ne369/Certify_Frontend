/**
 * CertCard.jsx — FSAD-PS34
 * Certificate card with status border, badge image, dates, StatusBadge,
 * CountdownTimer, category chip, and "View Details" button.
 */

import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, Calendar, ArrowRight, Building2 } from 'lucide-react';
import { cardVariants, cardHover } from '../../animations/variants';
import StatusBadge from './StatusBadge';
import CountdownTimer from './CountdownTimer';
import { formatDate } from '../../utils/dateUtils';

const BORDER_COLOR = {
    active: 'border-l-emerald-500',
    expiring_soon: 'border-l-amber-500',
    expired: 'border-l-red-500',
};

const CATEGORY_COLORS = {
    Cloud: 'bg-[#e6ecef] text-[#5b7683] dark:bg-[#1f2d33] dark:text-[#9cc0d0]',
    DevOps: 'bg-[#ece4eb] text-[#7a5c78] dark:bg-[#302330] dark:text-[#c7a7c3]',
    Data: 'bg-[#e2ece4] text-[#55745c] dark:bg-[#213026] dark:text-[#9bc1a4]',
    Frontend: 'bg-[#f2e1de] text-[#975e61] dark:bg-[#382224] dark:text-[#e0a8aa]',
};

export default function CertCard({ cert, detailPath, showViewButton = true }) {
    const navigate = useNavigate();
    const borderColor = BORDER_COLOR[cert.status] ?? 'border-l-gray-300';
    const catColor = CATEGORY_COLORS[cert.category] ?? 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300';
    const resolvedDetailPath = detailPath ?? `/user/certifications/${cert.id}`;

    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            {...cardHover}
            className={`dashboard-surface rounded-[1.35rem] border-l-4 ${borderColor} overflow-hidden flex flex-col`}
        >
            {/* Badge image / placeholder */}
            <div className="relative h-28 bg-[linear-gradient(135deg,rgba(236,203,182,0.28),rgba(244,179,79,0.22))] dark:bg-[linear-gradient(135deg,rgba(134,28,28,0.18),rgba(244,179,79,0.08))] flex items-center justify-center overflow-hidden">
                {cert.badgeUrl ? (
                    <img
                        src={cert.badgeUrl}
                        alt={cert.title}
                        className="h-20 w-20 object-contain drop-shadow"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                ) : (
                    <Award className="w-14 h-14 text-[#c06f30] dark:text-[#f4b34f]" />
                )}
                {/* Category chip — top-right */}
                <span className={`absolute top-2 right-2 text-[10px] font-semibold px-2 py-0.5 rounded-full ${catColor}`}>
                    {cert.category}
                </span>
            </div>

            {/* Body */}
            <div className="flex flex-col flex-1 p-4 gap-3">
                {/* Title + org */}
                <div className="min-w-0">
                    <h3 className="text-sm font-semibold dashboard-panel-title leading-snug line-clamp-2">
                        {cert.title}
                    </h3>
                    <p className="mt-0.5 flex items-center gap-1 text-xs dashboard-panel-text truncate">
                        <Building2 className="w-3 h-3 shrink-0" />
                        {cert.organization}
                    </p>
                </div>

                {/* Dates */}
                <div className="flex items-center gap-1.5 text-xs dashboard-panel-text">
                    <Calendar className="w-3 h-3 shrink-0" />
                    <span>{formatDate(cert.issueDate)}</span>
                    <span>→</span>
                    <span>{formatDate(cert.expiryDate)}</span>
                </div>

                {/* Status + countdown */}
                <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={cert.status} />
                    <CountdownTimer expiryDate={cert.expiryDate} />
                </div>

                {showViewButton && (
                    <button
                        onClick={() => navigate(resolvedDetailPath)}
                        className="mt-auto flex items-center justify-center gap-1.5 w-full py-2 rounded-lg text-xs font-semibold text-[#861c1c] dark:text-[#f4b34f] border border-[rgba(120,85,57,0.16)] dark:border-[rgba(236,203,182,0.12)] hover:bg-[#f7eee5] dark:hover:bg-white/4 transition-colors"
                    >
                        View Details
                        <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                )}
            </div>
        </motion.div>
    );
}
