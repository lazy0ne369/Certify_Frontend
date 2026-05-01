import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    ArrowRight,
    BellRing,
    CheckCircle2,
    Layers3,
    ShieldCheck,
    TimerReset,
    Users,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import PublicLayout from '../components/layout/PublicLayout';
import Button from '../components/ui/Button';

const BENEFITS = [
    {
        title: 'Track every credential',
        text: 'Store certificate details, issue dates, expiry dates, and proof links in one organized workspace.',
        icon: Layers3,
    },
    {
        title: 'Stay ahead of renewals',
        text: 'Catch upcoming expiries early and give users enough time to renew without last-minute scrambling.',
        icon: TimerReset,
    },
    {
        title: 'Give admins a clear picture',
        text: 'Users manage personal records while admins monitor compliance trends across teams and departments.',
        icon: Users,
    },
];

const HIGHLIGHTS = [
    { label: 'Compliant users', value: '84%', tone: 'bg-[var(--success-soft)] text-[var(--success)]' },
    { label: 'Pending review', value: '12', tone: 'bg-[var(--warning-soft)] text-[var(--warning)]' },
    { label: 'Expiring this month', value: '29', tone: 'bg-[var(--danger-soft)] text-[var(--danger)]' },
];

const STEPS = [
    'Add each certification with issuer, credential ID, issue date, and expiry date.',
    'Track what is active, expiring soon, expired, or waiting for review from one dashboard.',
    'Use admin views to spot department risk, follow renewals, and stay audit-ready.',
];

export default function Home() {
    const navigate = useNavigate();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    return (
        <PublicLayout>
            <div className="relative pb-10 pt-8 sm:pb-14 sm:pt-12">
                <section className="grid items-center gap-8 lg:grid-cols-[1.02fr_0.98fr]">
                    <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <div className="public-pill inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] shadow-sm">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            Certification management
                        </div>

                        <h1 className="mt-6 max-w-3xl font-display text-5xl leading-[0.98] tracking-tight text-[var(--text)] sm:text-6xl lg:text-[5.2rem]">
                            Keep certification records accurate, visible, and renewal-ready.
                        </h1>

                        <p className="mt-6 max-w-2xl text-base leading-8 public-muted sm:text-lg">
                            Certify gives users one place to maintain credentials and gives admins a clean view of
                            renewals, expiries, and compliance status without spreadsheet chasing.
                        </p>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <Button
                                size="lg"
                                onClick={() => navigate(isAuthenticated ? '/redirect' : '/login')}
                            >
                                {isAuthenticated ? 'Open dashboard' : 'Sign in'}
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                onClick={() => navigate('/register')}
                            >
                                Create account
                            </Button>
                        </div>

                        <div className="mt-10 grid gap-3 sm:grid-cols-3">
                            {BENEFITS.map(({ title, text, icon: Icon }) => (
                                <div key={title} className="public-surface rounded-[24px] p-4">
                                    <div className="public-gradient-soft flex h-11 w-11 items-center justify-center rounded-2xl">
                                        <Icon className="h-5 w-5 text-[var(--accent)]" />
                                    </div>
                                    <h3 className="mt-4 text-base font-semibold text-[var(--text)]">{title}</h3>
                                    <p className="mt-2 text-sm leading-6 public-muted">{text}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, delay: 0.08 }}
                        className="relative"
                    >
                        <div className="public-surface-strong overflow-hidden rounded-[36px] p-4 shadow-[0_36px_90px_rgba(15,23,42,0.12)] sm:p-5">
                            <div className="rounded-[30px] border border-[var(--line)] bg-[var(--public-card-strong)] p-5">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Admin overview</p>
                                        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--text)]">Compliance snapshot</h2>
                                    </div>
                                    <div className="dashboard-chip text-xs font-semibold">
                                        <BellRing className="h-3.5 w-3.5" />
                                        Renewal alerts
                                    </div>
                                </div>

                                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                                    {HIGHLIGHTS.map((item) => (
                                        <div key={item.label} className="metric-card p-4">
                                            <p className="text-xs font-semibold uppercase tracking-[0.14em] public-muted">{item.label}</p>
                                            <p className="mt-3 text-3xl font-semibold tracking-tight text-[var(--text)]">{item.value}</p>
                                            <div className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${item.tone}`}>
                                                Current
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-5 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
                                    <div className="table-shell">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Department</th>
                                                    <th>Coverage</th>
                                                    <th>Risk</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {[
                                                    ['Engineering', '91%', 'Low'],
                                                    ['Analytics', '76%', 'Medium'],
                                                    ['Infrastructure', '69%', 'High'],
                                                ].map(([department, coverage, risk]) => (
                                                    <tr key={department}>
                                                        <td className="font-medium text-[var(--text)]">{department}</td>
                                                        <td className="text-sm public-muted">{coverage}</td>
                                                        <td>
                                                            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                                                risk === 'Low'
                                                                    ? 'bg-[var(--success-soft)] text-[var(--success)]'
                                                                    : risk === 'Medium'
                                                                        ? 'bg-[var(--warning-soft)] text-[var(--warning)]'
                                                                        : 'bg-[var(--danger-soft)] text-[var(--danger)]'
                                                            }`}>
                                                                {risk}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="shell-card p-5">
                                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">What admins watch</p>
                                        <div className="mt-5 space-y-4">
                                            {[
                                                { title: 'Pending verification', count: '08', tone: 'var(--warning)' },
                                                { title: 'Renewal in progress', count: '14', tone: 'var(--accent)' },
                                                { title: 'Critical expiries', count: '05', tone: 'var(--danger)' },
                                            ].map((item) => (
                                                <div key={item.title} className="flex items-center justify-between rounded-[20px] border border-[var(--line)] px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <span className="status-dot" style={{ backgroundColor: item.tone }} />
                                                        <span className="text-sm font-medium text-[var(--text)]">{item.title}</span>
                                                    </div>
                                                    <span className="text-lg font-semibold text-[var(--text)]">{item.count}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </section>

                <section className="mt-12 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                    <div className="public-surface rounded-[30px] p-6 sm:p-7">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Why teams use it</p>
                        <h2 className="mt-4 font-display text-4xl leading-tight tracking-tight text-[var(--text)]">
                            A single system for individual records and team oversight.
                        </h2>
                        <p className="mt-4 text-sm leading-7 public-muted sm:text-base">
                            Keep ownership clear, make renewals visible, and reduce the risk of missed deadlines by
                            centralizing certification data in one workflow.
                        </p>
                    </div>

                    <div className="public-surface-strong rounded-[30px] p-6 sm:p-7">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">How it works</p>
                        <div className="mt-5 grid gap-3">
                            {STEPS.map((item, index) => (
                                <div
                                    key={item}
                                    className="public-step-card flex items-start gap-4 rounded-[22px] border border-[var(--line)] px-4 py-4"
                                >
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-sm font-semibold text-[var(--accent)]">
                                        {index + 1}
                                    </div>
                                    <p className="text-sm leading-7 text-[var(--text)] dark:text-white/88">{item}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="mt-12">
                    <div
                        className="overflow-hidden rounded-[34px] border px-6 py-10 sm:px-8 sm:py-12"
                        style={{
                            borderColor: 'var(--public-cta-border)',
                            background: 'var(--public-cta-bg)',
                            boxShadow: '0 32px 80px rgba(31, 94, 255, 0.12)',
                        }}
                    >
                        <div className="max-w-3xl">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)] dark:text-white/72">Get started</p>
                            <h2 className="mt-4 font-display text-4xl leading-tight tracking-tight text-[var(--text)] dark:text-white sm:text-5xl">
                                Start with a workspace built for certification tracking and renewal follow-up.
                            </h2>
                            <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--muted)] dark:text-white/72 sm:text-base">
                                Sign in if you already use Certify, or register to begin organizing credentials,
                                tracking deadlines, and improving compliance visibility.
                            </p>
                            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                                <Button
                                    size="lg"
                                    onClick={() => navigate('/login')}
                                    className="border border-[rgba(31,94,255,0.16)] bg-white text-[#0f172a] hover:bg-[#f7faff] dark:border-none dark:bg-white dark:!text-[#0f172a] dark:hover:bg-[#eef4ff]"
                                >
                                    Sign in
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    onClick={() => navigate('/register')}
                                    className="border-[rgba(31,94,255,0.16)] bg-[rgba(255,255,255,0.62)] text-[var(--text)] hover:bg-[rgba(255,255,255,0.85)] dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/16"
                                >
                                    Register
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </PublicLayout>
    );
}
