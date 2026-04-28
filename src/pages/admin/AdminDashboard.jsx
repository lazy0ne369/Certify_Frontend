import { useEffect, useMemo, useState } from 'react';
import { motion, animate, useMotionValue, useTransform } from 'framer-motion';
import { format, parseISO, isSameMonth } from 'date-fns';
import { toast } from 'sonner';
import {
    Activity,
    AlertTriangle,
    Award,
    Building2,
    CircleAlert,
    Users,
    XCircle,
} from 'lucide-react';
import { BarChart, Bar, CartesianGrid, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { getAllCertificates, getAllUsers } from '../../services/adminService';
import PageWrapper from '../../components/layout/PageWrapper';
import { listItemVariants, staggerContainer } from '../../animations/variants';

const MotionDiv = motion.div;
const MotionSection = motion.section;

const STATUS_COLORS = {
    active: '#16A34A',
    expiring_soon: '#D97706',
    expired: '#DC2626',
};

const STAT_CONFIG = [
    { key: 'totalUsers', label: 'Total Users', icon: Users, tone: 'bg-blue-50 text-blue-600' },
    { key: 'totalCerts', label: 'Total Certs', icon: Award, tone: 'bg-sky-50 text-sky-600' },
    { key: 'expiringThisMonth', label: 'Expiring This Month', icon: AlertTriangle, tone: 'bg-amber-50 text-amber-600' },
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
    const Icon = icon;
    return (
        <MotionDiv
            variants={listItemVariants}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-md transition-transform duration-200 hover:scale-[1.02]"
        >
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-medium text-slate-500">{label}</p>
                    <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                        <AnimatedNumber value={value} />
                    </p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${tone}`}>
                    <Icon className="h-5 w-5" />
                </div>
            </div>
        </MotionDiv>
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
                <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
                    <div className="h-80 animate-pulse rounded-xl bg-slate-200" />
                    <div className="h-80 animate-pulse rounded-xl bg-slate-200" />
                </div>
                <div className="h-96 animate-pulse rounded-xl bg-slate-200" />
            </div>
        </PageWrapper>
    );
}

export default function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        Promise.all([getAllUsers(), getAllCertificates()])
            .then(([usersData, certificatesData]) => {
                if (!isMounted) return;
                setUsers(usersData);
                setCertificates(certificatesData);
            })
            .catch((error) => {
                if (!isMounted) return;
                toast.error(error.message);
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    const stats = useMemo(() => {
        const expiringThisMonth = certificates.filter((certificate) => {
            if (!certificate.expiryDate) return false;
            return isSameMonth(parseISO(certificate.expiryDate), new Date());
        }).length;

        return {
            totalUsers: users.length,
            totalCerts: certificates.length,
            active: certificates.filter((certificate) => certificate.status === 'active').length,
            expiringSoon: certificates.filter((certificate) => certificate.status === 'expiring_soon').length,
            expiringThisMonth,
            expired: certificates.filter((certificate) => certificate.status === 'expired').length,
        };
    }, [certificates, users.length]);

    const statusData = useMemo(
        () => [
            { name: 'Active', value: stats.active, color: STATUS_COLORS.active },
            { name: 'Expiring Soon', value: stats.expiringSoon, color: STATUS_COLORS.expiring_soon },
            { name: 'Expired', value: stats.expired, color: STATUS_COLORS.expired },
        ].filter((item) => item.value > 0),
        [stats]
    );

    const departmentData = useMemo(() => {
        const map = new Map();
        certificates.forEach((certificate) => {
            const department = certificate.owner?.department ?? 'Unassigned';
            map.set(department, (map.get(department) ?? 0) + 1);
        });

        return [...map.entries()]
            .map(([department, total]) => ({ department, total }))
            .sort((left, right) => right.total - left.total)
            .slice(0, 6);
    }, [certificates]);

    const activityData = useMemo(
        () =>
            [...certificates]
                .sort((left, right) => (right.createdAt ?? right.issueDate ?? '').localeCompare(left.createdAt ?? left.issueDate ?? ''))
                .slice(0, 6),
        [certificates]
    );

    if (loading) {
        return <DashboardSkeleton />;
    }

    return (
        <PageWrapper className="py-8">
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
                <MotionSection variants={listItemVariants} className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="section-label">Admin Overview</p>
                        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                            <span>Organization </span>
                            <span className="text-[#2563EB]">dashboard</span>
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm font-light leading-7 text-slate-500 sm:text-base">
                            Monitor certification coverage, department distribution, and the latest org-wide activity from one control center.
                        </p>
                    </div>

                    <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700 shadow-sm">
                        <span className="font-semibold">{stats.expiringThisMonth}</span> certifications expire this month across the organization.
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

                <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
                    <MotionSection variants={listItemVariants} className="rounded-xl border border-slate-200 bg-white p-5 shadow-md">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <Building2 className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="section-label">Department Coverage</p>
                                <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                                    <span>Certifications by </span>
                                    <span className="text-[#2563EB]">department</span>
                                </h2>
                            </div>
                        </div>

                        <div className="mt-6 h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={departmentData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                                    <XAxis dataKey="department" tick={{ fill: '#64748B', fontSize: 12 }} />
                                    <YAxis tick={{ fill: '#64748B', fontSize: 12 }} />
                                    <Tooltip />
                                    <Bar dataKey="total" radius={[8, 8, 0, 0]} fill="#2563EB" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </MotionSection>

                    <MotionSection variants={listItemVariants} className="rounded-xl border border-slate-200 bg-white p-5 shadow-md">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <CircleAlert className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="section-label">Status Health</p>
                                <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                                    <span>Status </span>
                                    <span className="text-[#2563EB]">breakdown</span>
                                </h2>
                            </div>
                        </div>

                        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_180px]">
                            <div className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={statusData.length ? statusData : [{ name: 'No data', value: 1, color: '#DBEAFE' }]}
                                            dataKey="value"
                                            nameKey="name"
                                            innerRadius={60}
                                            outerRadius={96}
                                            paddingAngle={4}
                                        >
                                            {(statusData.length ? statusData : [{ color: '#DBEAFE' }]).map((entry) => (
                                                <Cell key={entry.color} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="space-y-3">
                                {(statusData.length ? statusData : [{ name: 'No certifications yet', value: 0, color: '#DBEAFE' }]).map((item) => (
                                    <div key={item.name} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                                                <span className="text-sm font-semibold text-slate-700">{item.name}</span>
                                            </div>
                                            <span className="text-lg font-bold text-slate-900">{item.value}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </MotionSection>
                </div>

                <div className="grid gap-4 xl:grid-cols-[1.12fr_0.88fr]">
                    <MotionSection variants={listItemVariants} className="rounded-xl border border-slate-200 bg-white p-5 shadow-md">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <Award className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="section-label">Coverage Notes</p>
                                <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                                    <span>Where the org </span>
                                    <span className="text-[#2563EB]">stands today</span>
                                </h2>
                            </div>
                        </div>

                        <div className="mt-6 grid gap-4 md:grid-cols-3">
                            <div className="rounded-xl bg-slate-50 p-4">
                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Active Coverage</p>
                                <p className="mt-2 text-2xl font-bold text-slate-900">{stats.active}</p>
                                <p className="mt-2 text-sm font-light text-slate-500">Credentials currently valid across all users.</p>
                            </div>
                            <div className="rounded-xl bg-slate-50 p-4">
                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Attention Needed</p>
                                <p className="mt-2 text-2xl font-bold text-slate-900">{stats.expiringSoon + stats.expired}</p>
                                <p className="mt-2 text-sm font-light text-slate-500">Credentials that should be reviewed or renewed soon.</p>
                            </div>
                            <div className="rounded-xl bg-slate-50 p-4">
                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">User Reach</p>
                                <p className="mt-2 text-2xl font-bold text-slate-900">{stats.totalUsers}</p>
                                <p className="mt-2 text-sm font-light text-slate-500">Registered team members being tracked in Certify.</p>
                            </div>
                        </div>
                    </MotionSection>

                    <MotionSection variants={listItemVariants} className="rounded-xl border border-slate-200 bg-white p-5 shadow-md">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <Activity className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="section-label">Recent Activity</p>
                                <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                                    <span>Latest </span>
                                    <span className="text-[#2563EB]">updates</span>
                                </h2>
                            </div>
                        </div>

                        <div className="mt-6 space-y-3">
                            {activityData.length > 0 ? (
                                activityData.map((certificate) => (
                                    <div key={certificate.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                        <div className="flex items-start gap-3">
                                            <div className={`mt-1 h-2.5 w-2.5 rounded-full ${
                                                certificate.status === 'active'
                                                    ? 'bg-emerald-500'
                                                    : certificate.status === 'expiring_soon'
                                                        ? 'bg-amber-500'
                                                        : 'bg-rose-500'
                                            }`} />
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-slate-900 line-clamp-1">
                                                    {certificate.owner?.name ?? 'Unknown user'} updated {certificate.title}
                                                </p>
                                                <p className="mt-1 text-xs font-light text-slate-500">
                                                    {certificate.organization} • {certificate.issueDate ? format(parseISO(certificate.issueDate), 'dd MMM yyyy') : 'No issue date'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm font-light text-slate-500">
                                    No recent certification activity to display.
                                </div>
                            )}
                        </div>
                    </MotionSection>
                </div>
            </motion.div>
        </PageWrapper>
    );
}
