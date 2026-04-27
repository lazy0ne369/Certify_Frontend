/**
 * ActivityFeed.jsx — FSAD-PS34
 * Staggered list of recent user activities (hardcoded proxy data).
 * < 200 lines
 */

import { motion } from 'framer-motion';
import { PlusCircle, AlertCircle, Pencil, Download, Share2 } from 'lucide-react';
import { staggerContainer, listItemVariants } from '../../animations/variants';

const DOT_COLORS = {
    add: 'bg-emerald-500',
    expired: 'bg-red-500',
    updated: 'bg-indigo-500',
    download: 'bg-sky-500',
    share: 'bg-violet-500',
};

const ICONS = {
    add: PlusCircle,
    expired: AlertCircle,
    updated: Pencil,
    download: Download,
    share: Share2,
};

// Proxy activities — keyed by userId (all users share the same feed for now)
const ACTIVITIES = [
    { id: 1, type: 'add', text: 'Added AWS Certification', time: '2 days ago' },
    { id: 2, type: 'expired', text: 'Certificate Expired: Google Cloud', time: '5 days ago' },
    { id: 3, type: 'updated', text: 'Updated React Developer Cert', time: '1 week ago' },
    { id: 4, type: 'download', text: 'Downloaded IBM Data Science Certificate', time: '2 weeks ago' },
    { id: 5, type: 'share', text: 'Shared Kubernetes Certificate', time: '3 weeks ago' },
];

export default function ActivityFeed({ userId: _userId }) {
    return (
        <div className="dashboard-surface overflow-hidden rounded-[1.5rem]">
            <div className="border-b border-[rgba(120,85,57,0.12)] px-5 py-4 dark:border-[rgba(236,203,182,0.08)]">
                <h3 className="text-sm font-semibold dashboard-panel-title">Recent Activity</h3>
            </div>

            <motion.ul
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="divide-y divide-[rgba(120,85,57,0.08)] dark:divide-[rgba(236,203,182,0.06)]"
            >
                {ACTIVITIES.map((item) => {
                    const Icon = ICONS[item.type];
                    const dot = DOT_COLORS[item.type];
                    return (
                        <motion.li
                            key={item.id}
                            variants={listItemVariants}
                            className="flex items-start gap-3 px-5 py-3.5 hover:bg-[#f7eee5] dark:hover:bg-white/4 transition-colors"
                        >
                            {/* Colored dot */}
                            <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${dot}`} />

                            {/* Icon + text */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <Icon className="w-3.5 h-3.5 dashboard-panel-text shrink-0" />
                                    <p className="text-sm dashboard-panel-title truncate">{item.text}</p>
                                </div>
                                <p className="mt-0.5 text-xs dashboard-panel-text">{item.time}</p>
                            </div>
                        </motion.li>
                    );
                })}
            </motion.ul>
        </div>
    );
}
