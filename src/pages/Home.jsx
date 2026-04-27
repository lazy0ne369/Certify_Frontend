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

const PRINCIPLES = [
    {
        title: 'Measured structure',
        text: 'Tighter spacing, fewer visual jumps, and a more disciplined grid.',
        icon: Layers3,
    },
    {
        title: 'Renewal-first thinking',
        text: 'Expiry, reminders, and review states surface earlier and more clearly.',
        icon: TimerReset,
    },
    {
        title: 'Shared visibility',
        text: 'Users stay focused on their portfolio while admins see organizational risk.',
        icon: Users,
    },
];

const STACK_PREVIEW = [
    { label: 'Compliant users', value: '84%', tone: 'bg-[rgba(47,143,99,0.14)] text-[var(--success)]' },
    { label: 'Pending review', value: '12', tone: 'bg-[rgba(208,139,49,0.14)] text-[var(--warning)]' },
    { label: 'Expiring this month', value: '29', tone: 'bg-[rgba(198,90,84,0.14)] text-[var(--danger)]' },
];

const FLOW = [
    'Public landing and auth pages feel part of the same system.',
    'User dashboards prioritize what is active, expiring, and under review.',
    'Admin dashboards focus on compliance, queue management, and reminders.',
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
                            Minimal, quieter, sharper
                        </div>

                        <h1 className="mt-6 max-w-3xl font-display text-5xl leading-[0.98] tracking-tight text-[var(--text)] sm:text-6xl lg:text-[5.2rem]">
                            Certification operations with a cleaner visual backbone.
                        </h1>

                        <p className="mt-6 max-w-2xl text-base leading-8 public-muted sm:text-lg">
                            Certify is being reshaped into a calmer product surface: stronger layout discipline,
                            better spacing, and dashboards that look intentional instead of generated.
                        </p>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <Button
                                size="lg"
                                onClick={() => navigate(isAuthenticated ? '/redirect' : '/login')}
                            >
                                {isAuthenticated ? 'Open dashboard' : 'Enter workspace'}
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
                            {PRINCIPLES.map(({ title, text, icon: Icon }) => (
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
                        <div className="public-surface-strong overflow-hidden rounded-[36px] p-4 shadow-[0_36px_90px_rgba(17,24,28,0.14)] sm:p-5">
                            <div className="rounded-[30px] border border-[var(--line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(245,243,238,0.96))] p-5 dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.04))]">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Admin control center</p>
                                        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--text)]">Operational snapshot</h2>
                                    </div>
                                    <div className="dashboard-chip text-xs font-semibold">
                                        <BellRing className="h-3.5 w-3.5" />
                                        Live reminders
                                    </div>
                                </div>

                                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                                    {STACK_PREVIEW.map((item) => (
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
                                                                    ? 'bg-[rgba(47,143,99,0.14)] text-[var(--success)]'
                                                                    : risk === 'Medium'
                                                                        ? 'bg-[rgba(208,139,49,0.14)] text-[var(--warning)]'
                                                                        : 'bg-[rgba(198,90,84,0.14)] text-[var(--danger)]'
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
                                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Queue focus</p>
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
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Experience direction</p>
                        <h2 className="mt-4 font-display text-4xl leading-tight tracking-tight text-[var(--text)]">
                            Less noise. Better measurements. More trust.
                        </h2>
                        <p className="mt-4 text-sm leading-7 public-muted sm:text-base">
                            The redesign leans on a restrained palette, softer elevation, and a more reliable spacing
                            rhythm so every page reads as one product instead of separate generated sections.
                        </p>
                    </div>

                    <div className="public-surface-strong rounded-[30px] p-6 sm:p-7">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Flow preview</p>
                        <div className="mt-5 grid gap-3">
                            {FLOW.map((item, index) => (
                                <div key={item} className="flex items-start gap-4 rounded-[22px] border border-[var(--line)] bg-white/56 px-4 py-4 dark:bg-white/[0.03]">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-sm font-semibold text-[var(--accent)]">
                                        {index + 1}
                                    </div>
                                    <p className="text-sm leading-7 text-[var(--text)]">{item}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="mt-12">
                    <div className="overflow-hidden rounded-[34px] border border-[var(--line)] bg-[linear-gradient(135deg,#111719_0%,#183234_48%,#2f5f60_100%)] px-6 py-10 shadow-[0_32px_80px_rgba(17,24,28,0.22)] sm:px-8 sm:py-12">
                        <div className="max-w-3xl">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/64">Ready to move</p>
                            <h2 className="mt-4 font-display text-4xl leading-tight tracking-tight text-white sm:text-5xl">
                                Start from a stronger front door and land in a dashboard that feels built, not assembled.
                            </h2>
                            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                                <Button size="lg" onClick={() => navigate('/login')} className="border-none bg-white !text-[#13181b] hover:bg-[#f1f4f2]">
                                    Sign in
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    onClick={() => navigate('/register')}
                                    className="border-white/22 bg-white/6 text-white hover:bg-white/12"
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
