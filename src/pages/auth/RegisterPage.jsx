import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Briefcase, Building2, Lock, Mail, ShieldCheck, User } from 'lucide-react';
import { registerUser } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';
import PublicLayout from '../../components/layout/PublicLayout';
import AuthShowcasePanel from '../../components/auth/AuthShowcasePanel';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const DEPARTMENTS = ['Engineering', 'Analytics', 'Infrastructure', 'Management'];

const schema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    designation: z.string().min(2, 'Designation is required'),
    department: z.string().min(1, 'Department is required'),
});

export default function RegisterPage() {
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: { department: '' },
    });

    const onSubmit = async (formData) => {
        setLoading(true);

        try {
            const result = await registerUser({ ...formData, avatar: '' });
            login(result.user, result.token);
            toast.success(`Welcome, ${result.user.name}.`);
            navigate('/user/dashboard', { replace: true });
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
                            eyebrow="New workspace"
                            title="Create a profile that feels structured from day one."
                            copy="The registration flow now matches the same visual discipline as the product itself, with stronger grouping and better spatial rhythm."
                            metricLabel="Workflow focus"
                            metricValue="4 steps"
                            metricHint="Profile, department, credential ownership, then dashboard."
                            highlights={[
                                'Departments tie into admin compliance views',
                                'User profiles stay lightweight and clear',
                                'A cleaner start leads to cleaner data',
                            ]}
                        />

                        <div className="rounded-[30px] bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,255,255,0.92))] px-5 py-6 dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.04))] sm:px-8 sm:py-8">
                            <div className="mx-auto max-w-[560px]">
                                <div className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white/70 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)] dark:bg-white/[0.03]">
                                    <ShieldCheck className="h-3.5 w-3.5" />
                                    New account
                                </div>

                                <div className="mt-6">
                                    <h1 className="font-display text-4xl leading-tight tracking-tight text-[var(--text)] sm:text-5xl">
                                        Create your account
                                    </h1>
                                    <p className="mt-3 max-w-lg text-sm leading-7 public-muted sm:text-base">
                                        Register once, land in a clearer dashboard, and start managing certifications
                                        with stronger structure from the beginning.
                                    </p>
                                </div>

                                <div className="mt-8 flex items-center gap-2 rounded-full border border-[var(--line)] bg-white/60 p-1.5 dark:bg-white/[0.03]">
                                    <Link
                                        to="/login"
                                        className="flex-1 rounded-full px-4 py-2.5 text-center text-sm font-semibold text-[var(--muted)] transition-colors hover:text-[var(--text)]"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="flex-1 rounded-full bg-[var(--text)] px-4 py-2.5 text-center text-sm font-semibold text-white"
                                    >
                                        Register
                                    </Link>
                                </div>

                                <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2" noValidate>
                                    <Input
                                        label="Full Name"
                                        type="text"
                                        placeholder="Ashish Dohare"
                                        icon={User}
                                        error={errors.name?.message}
                                        {...register('name')}
                                    />
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
                                        placeholder="Create a password"
                                        icon={Lock}
                                        error={errors.password?.message}
                                        {...register('password')}
                                    />
                                    <Input
                                        label="Designation"
                                        type="text"
                                        placeholder="Software Engineer"
                                        icon={Briefcase}
                                        error={errors.designation?.message}
                                        {...register('designation')}
                                    />

                                    <div className="md:col-span-2">
                                        <label className="mb-1.5 block text-sm font-medium text-[var(--text)]">
                                            Department
                                        </label>
                                        <div className="relative">
                                            <Building2 className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
                                            <select
                                                {...register('department')}
                                                className="h-12 w-full rounded-2xl border border-[var(--line-strong)] bg-white/74 pl-11 pr-4 text-sm text-[var(--text)] transition-all duration-200 focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] dark:bg-white/[0.03]"
                                            >
                                                <option value="" disabled>Select department</option>
                                                {DEPARTMENTS.map((department) => (
                                                    <option key={department} value={department}>
                                                        {department}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        {errors.department?.message && (
                                            <p className="mt-1 text-xs text-red-500">{errors.department.message}</p>
                                        )}
                                    </div>

                                    <div className="md:col-span-2 pt-2">
                                        <Button type="submit" size="lg" fullWidth loading={loading}>
                                            {loading ? 'Creating account...' : 'Create account'}
                                        </Button>
                                    </div>
                                </form>

                                <p className="mt-6 text-sm public-muted">
                                    Already have an account?{' '}
                                    <Link to="/login" className="font-semibold text-[var(--accent)] transition-colors hover:text-[var(--accent-strong)]">
                                        Sign in
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
