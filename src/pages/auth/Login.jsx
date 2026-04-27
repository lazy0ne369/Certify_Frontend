import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Info, Lock, Mail, ShieldCheck } from 'lucide-react';
import { loginUser } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';
import PublicLayout from '../../components/layout/PublicLayout';
import AuthShowcasePanel from '../../components/auth/AuthShowcasePanel';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const schema = z.object({
    email: z.string().email('Enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

const DEMO_CREDENTIALS = [
    { label: 'User', email: 'ashish@gmail.com', password: 'user123' },
    { label: 'Admin', email: 'admin@gmail.com', password: 'admin123' },
];

function CredChip({ label, email, password, onFill }) {
    return (
        <button
            type="button"
            onClick={() => onFill(email, password)}
            className="flex w-full flex-col items-start rounded-[22px] border border-[var(--line)] bg-white/66 px-4 py-3 text-left shadow-[0_14px_28px_rgba(17,24,28,0.05)] transition-transform hover:-translate-y-0.5 dark:bg-white/[0.03]"
        >
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">{label}</span>
            <span className="mt-2 font-mono text-xs text-[var(--text)]">{email}</span>
            <span className="mt-1 font-mono text-xs public-muted">pw: {password}</span>
        </button>
    );
}

export default function Login() {
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
    });

    const fillCredentials = (email, password) => {
        setValue('email', email, { shouldValidate: true });
        setValue('password', password, { shouldValidate: true });
    };

    const onSubmit = async ({ email, password }) => {
        setLoading(true);

        try {
            const result = await loginUser(email, password);
            login(result.user, result.token);
            toast.success(`Welcome back, ${result.user.name}.`);
            navigate(result.user.role?.toUpperCase() === 'ADMIN' ? '/admin/dashboard' : '/user/dashboard', { replace: true });
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <PublicLayout>
            <section className="flex min-h-[calc(100vh-190px)] items-center py-8 sm:py-10">
                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="public-surface-strong w-full overflow-hidden rounded-[34px] p-3 shadow-[0_30px_80px_rgba(17,24,28,0.12)]"
                >
                    <div className="grid gap-3 lg:grid-cols-[0.94fr_1.06fr]">
                        <AuthShowcasePanel
                            eyebrow="Secure entry"
                            title="Log in to a calmer workspace."
                            copy="A tighter grid, clearer hierarchy, and sharper spacing make the experience feel more deliberate from the first screen."
                            metricLabel="Credential health"
                            metricValue="87%"
                            metricHint="Average active coverage across recent team snapshots."
                            highlights={[
                                'Renewal signals surface earlier',
                                'Admin and user views stay distinct',
                                'Less clutter, stronger visual rhythm',
                            ]}
                        />

                        <div className="rounded-[30px] bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,255,255,0.92))] px-5 py-6 dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.04))] sm:px-8 sm:py-8">
                            <div className="mx-auto max-w-[520px]">
                                <div className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white/70 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)] dark:bg-white/[0.03]">
                                    <ShieldCheck className="h-3.5 w-3.5" />
                                    Sign in
                                </div>

                                <div className="mt-6">
                                    <h1 className="font-display text-4xl leading-tight tracking-tight text-[var(--text)] sm:text-5xl">
                                        Welcome back
                                    </h1>
                                    <p className="mt-3 max-w-md text-sm leading-7 public-muted sm:text-base">
                                        Continue into your certification workspace with a simpler, quieter interface
                                        that keeps the important actions up front.
                                    </p>
                                </div>

                                <div className="mt-8 flex items-center gap-2 rounded-full border border-[var(--line)] bg-white/60 p-1.5 dark:bg-white/[0.03]">
                                    <Link
                                        to="/login"
                                        className="flex-1 rounded-full bg-[var(--text)] px-4 py-2.5 text-center text-sm font-semibold text-white"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="flex-1 rounded-full px-4 py-2.5 text-center text-sm font-semibold text-[var(--muted)] transition-colors hover:text-[var(--text)]"
                                    >
                                        Register
                                    </Link>
                                </div>

                                <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4" noValidate>
                                    <Input
                                        label="Email"
                                        type="email"
                                        placeholder="you@example.com"
                                        icon={Mail}
                                        error={errors.email?.message}
                                        {...register('email')}
                                    />
                                    <Input
                                        label="Password"
                                        type="password"
                                        placeholder="Enter your password"
                                        icon={Lock}
                                        error={errors.password?.message}
                                        {...register('password')}
                                    />

                                    <Button type="submit" size="lg" fullWidth loading={loading}>
                                        {loading ? 'Signing in...' : 'Enter workspace'}
                                    </Button>
                                </form>

                                <div className="mt-6 rounded-[26px] border border-[var(--line)] bg-white/58 p-4 dark:bg-white/[0.03]">
                                    <div className="flex items-center gap-2">
                                        <Info className="h-4 w-4 text-[var(--accent)]" />
                                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                                            Demo credentials
                                        </p>
                                    </div>
                                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                        {DEMO_CREDENTIALS.map((credential) => (
                                            <CredChip key={credential.label} {...credential} onFill={fillCredentials} />
                                        ))}
                                    </div>
                                </div>

                                <p className="mt-6 text-sm public-muted">
                                    New here?{' '}
                                    <Link to="/register" className="font-semibold text-[var(--accent)] transition-colors hover:text-[var(--accent-strong)]">
                                        Create an account
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>
        </PublicLayout>
    );
}
