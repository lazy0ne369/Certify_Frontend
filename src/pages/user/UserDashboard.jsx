/**
 * UserDashboard.jsx — FSAD-PS34
 * User's personal certification overview dashboard.
 * Split across two logical sections to stay under 200 lines per component rule.
 */

import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Award, CheckCircle, AlertTriangle, XCircle, ArrowRight } from 'lucide-react';

import { useAuthStore } from '../../store/authStore';
import { useCertStore } from '../../store/certStore';
import { getCertStats } from '../../utils/certHelpers';
import { staggerContainer, listItemVariants } from '../../animations/variants';

import PageWrapper from '../../components/layout/PageWrapper';
import StatCard from '../../components/shared/StatCard';
import CertCard from '../../components/shared/CertCard';
import ActivityFeed from '../../components/shared/ActivityFeed';
import CertDonutChart from '../../components/charts/CertDonutChart';
import RenewalTimeline from '../../components/calendar/RenewalTimeline';
import { StatRowSkeleton } from '../../components/shared/SkeletonCard';

// ── Stat row config ───────────────────────────────────────────────────────────
const STAT_DEFS = [
    { key: 'total', label: 'Total Certifications', icon: Award, color: 'indigo' },
    { key: 'active', label: 'Active', icon: CheckCircle, color: 'emerald' },
    { key: 'expiringSoon', label: 'Expiring Soon', icon: AlertTriangle, color: 'amber' },
    { key: 'expired', label: 'Expired', icon: XCircle, color: 'red' },
];

const TREND_MAP = {
    total: '+1 this month',
    active: 'fully valid',
    expiringSoon: 'renew soon',
    expired: 'action needed',
};

export default function UserDashboard() {
    const navigate = useNavigate();
    const user = useAuthStore((s) => s.user);
    const certificates = useCertStore((state) => state.certificates);
    const fetchCertificates = useCertStore((state) => state.fetchCertificates);
    const isLoading = useCertStore((state) => state.isLoading);
    const hasLoaded = useCertStore((state) => state.hasLoaded);

    useEffect(() => {
        fetchCertificates().catch((error) => {
            toast.error(error.message);
        });
    }, [fetchCertificates]);

    const stats = useMemo(() => getCertStats(certificates), [certificates]);
    const recentCerts = useMemo(
        () => [...certificates]
            .sort((left, right) => (right.createdAt ?? '').localeCompare(left.createdAt ?? ''))
            .slice(0, 3),
        [certificates]
    );

    if (isLoading && !hasLoaded) {
        return (
            <PageWrapper>
                <div className="space-y-6">
                    <div className="h-8 w-48 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    <StatRowSkeleton count={4} />
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                        <div className="lg:col-span-3 h-64 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
                        <div className="lg:col-span-2 h-64 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    </div>
                </div>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper>
            <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-6"
            >
                {/* ── Page header ── */}
                <motion.div variants={listItemVariants}>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Welcome back, {user?.name} 👋
                    </h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Here's your certification overview
                    </p>
                </motion.div>

                {/* ── Row 1: Stat Cards ── */}
                <motion.div
                    variants={staggerContainer}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-4"
                >
                    {STAT_DEFS.map(({ key, label, icon, color }) => (
                        <motion.div key={key} variants={listItemVariants}>
                            <StatCard
                                title={label}
                                value={stats[key] ?? 0}
                                icon={icon}
                                color={color}
                                trend={TREND_MAP[key]}
                            />
                        </motion.div>
                    ))}
                </motion.div>

                {/* ── Row 2: Donut + Timeline ── */}
                <motion.div variants={listItemVariants} className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                        <div className="lg:col-span-3">
                            <CertDonutChart stats={stats} />
                        </div>
                        <div className="lg:col-span-2">
                            <RenewalTimeline certificates={certificates} />
                        </div>
                    </motion.div>

                {/* ── Row 3: Recent Certs + Activity ── */}
                <motion.div variants={listItemVariants} className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                    {/* Recent Certs */}
                    <div className="lg:col-span-3 rounded-xl shadow-md bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-gray-800 dark:text-white">Recent Certifications</h3>
                            <button
                                onClick={() => navigate('/user/certifications')}
                                className="flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                            >
                                View All <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                        </div>
                        {recentCerts.length > 0 ? (
                            <motion.div
                                variants={staggerContainer}
                                initial="hidden"
                                animate="visible"
                                className="grid grid-cols-1 sm:grid-cols-3 gap-3"
                            >
                                {recentCerts.map((cert) => (
                                    <CertCard key={cert.id} cert={cert} />
                                ))}
                            </motion.div>
                        ) : (
                            <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-8">
                                No certifications yet.
                            </p>
                        )}
                    </div>

                    {/* Activity Feed */}
                    <div className="lg:col-span-2">
                        <ActivityFeed userId={user?.id} />
                    </div>
                </motion.div>

            </motion.div>
        </PageWrapper>
    );
}
