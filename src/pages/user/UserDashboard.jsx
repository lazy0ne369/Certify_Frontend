import { createElement, useEffect, useMemo } from 'react';
import { motion, animate, useMotionValue, useTransform } from 'framer-motion';
import { differenceInDays, format, parseISO } from 'date-fns';
import { toast } from 'sonner';
import {
    AlertTriangle,
    Award,
    CalendarClock,
    CheckCircle2,
    ChevronRight,
    ShieldAlert,
    ShieldCheck,
    XCircle,
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import PageWrapper from '../../components/layout/PageWrapper';
import { useAuthStore } from '../../store/authStore';
import { useCertStore } from '../../store/certStore';
import { getCertStats } from '../../utils/certHelpers';
import { listItemVariants, staggerContainer } from '../../animations/variants';

const MotionDiv = motion.div;
const MotionSection = motion.section;

const STATUS_COLORS = {
    active: '#16A34A',
    expiring_soon: '#D97706',
    expired: '#DC2626',
};

const STAT_CONFIG = [
    { key: 'total', label: 'Total Certs', icon: Award, tone: 'bg-blue-50 text-blue-600' },
    { key: 'active', label: 'Active', icon: CheckCircle2, tone: 'bg-emerald-50 text-emerald-600' },
    { key: 'expiringSoon', label: 'Expiring Soon', icon: AlertTriangle, tone: 'bg-amber-50 text-amber-600' },
    { key: 'expired', label: 'Expired', icon: XCircle, tone: 'bg-rose-50 text-rose-600' },
];

function AnimatedNumber({ value }) {
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => Math.round(latest));

    useEffect(() => {
        const controls = animate(count, value, { duration: 0.9, ease: 'easeOut' });
        return controls.stop;
    }, [count, value]);

    return <motion.span>{rounded}</motion.span>;
}

function StatTile({ icon, label, value, tone }) {
    return (
        <MotionDiv
            variants={listItemVariants}
            className="dashboard-card p-5 transition-transform duration-200 hover:scale-[1.02]"
        >
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="dashboard-muted text-sm font-medium">{label}</p>
                    <p className="dashboard-text mt-3 text-3xl font-bold tracking-tight">
                        <AnimatedNumber value={value} />
                    </p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${tone}`}>
                    {icon ? createElement(icon, { className: 'h-5 w-5' }) : null}
                </div>
            </div>
        </MotionDiv>
    );
}

function HealthRing({ score }) {
    const circumference = 2 * Math.PI * 44;
    const progress = circumference - (Math.min(score, 100) / 100) * circumference;

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="relative h-32 w-32">
                <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                    <circle cx="60" cy="60" r="44" fill="none" stroke="#DBEAFE" strokeWidth="12" />
                    <motion.circle
                        cx="60"
                        cy="60"
                        r="44"
                        fill="none"
                        stroke="#2563EB"
                        strokeWidth="12"
                        strokeLinecap="round"
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: progress }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        strokeDasharray={circumference}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="dashboard-text text-3xl font-bold">{score}%</span>
                    <span className="dashboard-muted text-xs font-semibold uppercase tracking-[0.2em]">Health</span>
                </div>
            </div>
        </div>
    );
}

function CountdownBadge({ cert }) {
    const days = differenceInDays(parseISO(cert.expiryDate), new Date());
    const tone =
        days < 0
            ? 'border-red-200 bg-red-50 text-red-600'
            : days <= 30
                ? 'border-amber-200 bg-amber-50 text-amber-600'
                : 'border-emerald-200 bg-emerald-50 text-emerald-600';

    const label = days < 0 ? `${Math.abs(days)} days overdue` : `${days} days left`;

    return (
        <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold ${tone}`}>
            <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-35" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-current" />
            </span>
            {label}
        </div>
    );
}

function DashboardSkeleton() {
    return (
        <PageWrapper>
            <div className="space-y-6">
                <div className="h-10 w-72 animate-pulse rounded-xl bg-slate-200" />
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="h-32 animate-pulse rounded-xl bg-slate-200" />
                    ))}
                </div>
                <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
                    <div className="h-80 animate-pulse rounded-xl bg-slate-200" />
                    <div className="h-80 animate-pulse rounded-xl bg-slate-200" />
                </div>
            </div>
        </PageWrapper>
    );
}

export default function UserDashboard() {
    const user = useAuthStore((state) => state.user);
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
    const chartData = useMemo(
        () => [
            { name: 'Active', value: stats.active, color: STATUS_COLORS.active },
            { name: 'Expiring Soon', value: stats.expiringSoon, color: STATUS_COLORS.expiring_soon },
            { name: 'Expired', value: stats.expired, color: STATUS_COLORS.expired },
        ].filter((entry) => entry.value > 0),
        [stats]
    );

    const healthScore = useMemo(() => {
        if (!stats.total) return 0;
        return Math.round(((stats.active + stats.expiringSoon * 0.5) / stats.total) * 100);
    }, [stats]);

    const renewalCandidates = useMemo(
        () =>
            [...certificates]
                .filter((certificate) => certificate.expiryDate)
                .sort((left, right) => left.expiryDate.localeCompare(right.expiryDate))
                .slice(0, 6),
        [certificates]
    );

    const maxDays = 120;
    const timelineData = useMemo(
        () =>
            renewalCandidates.map((certificate) => {
                const start = Math.max(0, differenceInDays(parseISO(certificate.issueDate), new Date()) + 60);
                const end = Math.max(1, Math.min(maxDays, differenceInDays(parseISO(certificate.expiryDate), new Date()) + 60));
                const width = Math.max(12, ((end - Math.max(0, start)) / maxDays) * 100);
                const left = (Math.max(0, Math.min(start, maxDays)) / maxDays) * 100;
                const countdown = differenceInDays(parseISO(certificate.expiryDate), new Date());

                return {
                    ...certificate,
                    width,
                    left,
                    countdown,
                };
            }),
        [renewalCandidates]
    );

    if (isLoading && !hasLoaded) {
        return <DashboardSkeleton />;
    }

    return (
        <PageWrapper className="py-8">
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
                <MotionSection variants={listItemVariants} className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="section-label">Dashboard</p>
                        <h1 className="dashboard-text mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                            Welcome back, {user?.name} <span aria-hidden="true">👋</span>
                        </h1>
                        <p className="dashboard-muted mt-2 max-w-2xl text-sm font-light leading-7 sm:text-base">
                            Your certifications, renewals, and validity outlook are all visible from one place.
                        </p>
                    </div>

                    <div className="dashboard-card-soft px-4 py-3 text-sm text-[var(--accent)] shadow-sm">
                        <span className="font-semibold">{stats.active}</span> active credentials are currently keeping your profile strong.
                    </div>
                </MotionSection>

                <motion.div variants={staggerContainer} className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {STAT_CONFIG.map((item) => (
                        <StatTile
                            key={item.key}
                            icon={item.icon}
                            label={item.label}
                            value={stats[item.key] ?? 0}
                            tone={item.tone}
                        />
                    ))}
                </motion.div>

                <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
                    <MotionSection variants={listItemVariants} className="dashboard-card p-5">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <p className="section-label">Status Breakdown</p>
                                <h2 className="dashboard-text mt-2 text-2xl font-bold tracking-tight">
                                    <span>Certification </span>
                                    <span className="text-[#2563EB]">overview</span>
                                </h2>
                                <p className="dashboard-muted mt-2 text-sm font-light leading-7">
                                    A quick glance at how your portfolio is distributed across active, expiring, and expired credentials.
                                </p>
                            </div>
                            <HealthRing score={healthScore} />
                        </div>

                        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_220px]">
                            <div className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={chartData.length ? chartData : [{ name: 'No data', value: 1, color: '#DBEAFE' }]}
                                            dataKey="value"
                                            nameKey="name"
                                            innerRadius={68}
                                            outerRadius={102}
                                            paddingAngle={4}
                                        >
                                            {(chartData.length ? chartData : [{ color: '#DBEAFE' }]).map((entry) => (
                                                <Cell key={entry.color} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="space-y-3">
                                {(chartData.length ? chartData : [{ name: 'No certifications yet', value: 0, color: '#DBEAFE' }]).map((item) => (
                                    <div key={item.name} className="dashboard-card-soft p-4">
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                                                <span className="dashboard-text text-sm font-semibold">{item.name}</span>
                                            </div>
                                            <span className="dashboard-text text-lg font-bold">{item.value}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </MotionSection>

                    <MotionSection variants={listItemVariants} className="dashboard-card p-5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <CalendarClock className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="section-label">Renewal Alerts</p>
                                <h2 className="dashboard-text mt-1 text-2xl font-bold tracking-tight">
                                    <span>Expiry </span>
                                    <span className="text-[#2563EB]">countdowns</span>
                                </h2>
                            </div>
                        </div>

                        <div className="mt-6 space-y-3">
                            {renewalCandidates.length > 0 ? (
                                renewalCandidates.slice(0, 4).map((certificate) => {
                                    const days = differenceInDays(parseISO(certificate.expiryDate), new Date());
                                    return (
                                        <div key={certificate.id} className="dashboard-card-soft p-4">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <p className="dashboard-text text-sm font-semibold line-clamp-1">{certificate.title}</p>
                                                    <p className="dashboard-muted mt-1 text-xs font-light">
                                                        {certificate.organization} • expires {format(parseISO(certificate.expiryDate), 'dd MMM yyyy')}
                                                    </p>
                                                </div>
                                                <CountdownBadge cert={certificate} />
                                            </div>
                                            <div className="dashboard-muted mt-3 flex items-center gap-2 text-xs">
                                                {days < 0 ? <ShieldAlert className="h-3.5 w-3.5 text-red-500" /> : <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />}
                                                {days < 0 ? 'Renew immediately to restore validity' : 'Reminder windows are aligned to your renewal timeline'}
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="dashboard-card-soft border-dashed p-6 text-sm font-light dashboard-muted">
                                    Add certifications to see upcoming renewal countdowns here.
                                </div>
                            )}
                        </div>
                    </MotionSection>
                </div>

                <MotionSection variants={listItemVariants} className="dashboard-card p-5">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="section-label">Renewal Timeline</p>
                            <h2 className="dashboard-text mt-2 text-2xl font-bold tracking-tight">
                                <span>Upcoming </span>
                                <span className="text-[#2563EB]">renewals</span>
                            </h2>
                            <p className="dashboard-muted mt-2 text-sm font-light leading-7">
                                A horizontal view of your next renewal windows over the coming 120 days.
                            </p>
                        </div>
                        <div className="dashboard-muted flex flex-wrap gap-3 text-xs font-semibold">
                            {[0, 30, 60, 90, 120].map((marker) => (
                                <span key={marker} className="dashboard-card-soft px-3 py-1">
                                    Day {marker}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="mt-6 overflow-x-auto">
                        <div className="min-w-[720px] space-y-4">
                            <div className="dashboard-card-soft relative h-8 rounded-full">
                                {[0, 25, 50, 75, 100].map((position) => (
                                    <div
                                        key={position}
                                        className="absolute top-0 h-full border-r border-[var(--line)]"
                                        style={{ left: `${position}%` }}
                                    />
                                ))}
                            </div>

                            {timelineData.length > 0 ? (
                                timelineData.map((certificate) => (
                                    <div key={certificate.id} className="grid grid-cols-[240px_1fr] items-center gap-4">
                                        <div className="min-w-0">
                                            <p className="dashboard-text text-sm font-semibold line-clamp-1">{certificate.title}</p>
                                            <p className="dashboard-muted mt-1 text-xs font-light">
                                                {certificate.organization} • {format(parseISO(certificate.expiryDate), 'dd MMM yyyy')}
                                            </p>
                                        </div>
                                        <div className="dashboard-card-soft relative h-12 rounded-full">
                                            {[0, 25, 50, 75, 100].map((position) => (
                                                <div
                                                    key={position}
                                                    className="absolute top-0 h-full border-r border-[var(--line)]"
                                                    style={{ left: `${position}%` }}
                                                />
                                            ))}
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${certificate.width}%` }}
                                                transition={{ duration: 0.7, ease: 'easeOut' }}
                                                className="absolute top-2 h-8 rounded-full px-3"
                                                style={{
                                                    left: `${certificate.left}%`,
                                                    backgroundColor: STATUS_COLORS[certificate.status] ?? '#2563EB',
                                                }}
                                            >
                                                <div className="flex h-full items-center gap-2 text-xs font-semibold text-white">
                                                    <ChevronRight className="h-3.5 w-3.5" />
                                                    {certificate.countdown < 0 ? 'Expired' : `${certificate.countdown} days`}
                                                </div>
                                            </motion.div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="dashboard-card-soft border-dashed p-8 text-center text-sm font-light dashboard-muted">
                                    No renewal windows to display yet.
                                </div>
                            )}
                        </div>
                    </div>
                </MotionSection>
            </motion.div>
        </PageWrapper>
    );
}
