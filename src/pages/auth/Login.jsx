import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { ArrowRight, Facebook, Globe, Lock, Mail, UserCircle2 } from 'lucide-react';
import { loginUser } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';
import AuthVisualPanel from '../../components/auth/AuthVisualPanel';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const schema = z.object({
    email: z.string().email('Enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

const DEMO_LOGIN_OPTIONS = [
    {
        id: 'user',
        label: 'User',
        description: 'ashish@gmail.com',
        email: 'ashish@gmail.com',
        password: 'user123',
    },
    {
        id: 'admin',
        label: 'Admin',
        description: 'admin@gmail.com',
        email: 'admin@gmail.com',
        password: 'admin123',
    },
];

function SocialButton({ icon, label }) {
    return (
        <button
            type="button"
            className="flex items-center gap-[8px] rounded-full border border-[#E5E7EB] bg-white px-[20px] py-[8px] text-[13px] text-[#374151] hover:bg-[#F9FAFB]"
        >
            {icon}
            {label}
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

    const fillDemoCredentials = ({ email, password, label }) => {
        setValue('email', email, { shouldValidate: true, shouldDirty: true });
        setValue('password', password, { shouldValidate: true, shouldDirty: true });
        toast.success(`${label} login details added to the form.`);
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
        <div className="min-h-screen bg-white">
            <div className="flex min-h-screen w-full items-center justify-center">
                <section className="w-full min-h-screen overflow-hidden bg-white">
                    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[42vw_58vw]">
                        <AuthVisualPanel mode="LOGIN" />

                        <div className="flex h-[100vh] w-full lg:w-[58vw] items-center justify-center overflow-y-auto bg-[#FFFFFF]">
                            <div className="w-full max-w-[460px] px-[40px] py-[48px]">
                                <div>
                                    <div className="mx-auto mb-[16px] flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#EFF6FF]">
                                        <UserCircle2 className="h-[36px] w-[36px] text-[#2563EB]" />
                                    </div>

                                    <h1 className="mb-[6px] text-center text-[28px] font-[800] tracking-[2px] text-[#2563EB]">
                                        LOGIN
                                    </h1>
                                    <p className="mx-auto mb-[36px] max-w-[360px] text-center text-[13px] text-[#6B7280]">
                                        Access your certification workspace and pick up where your progress left off.
                                    </p>

                                    <div className="mb-[28px] rounded-[24px] border border-[#E5E7EB] bg-[#F8FAFC] p-[14px]">
                                        <p className="mb-[12px] text-[12px] font-[700] uppercase tracking-[1.4px] text-[#475569]">
                                            Quick Demo Access
                                        </p>
                                        <div className="grid grid-cols-1 gap-[10px] sm:grid-cols-2">
                                            {DEMO_LOGIN_OPTIONS.map((option) => (
                                                <button
                                                    key={option.id}
                                                    type="button"
                                                    onClick={() => fillDemoCredentials(option)}
                                                    className="rounded-[18px] border border-[#CBD5E1] bg-white px-[14px] py-[12px] text-left transition-all duration-200 hover:border-[#2563EB] hover:bg-[#EFF6FF]"
                                                >
                                                    <span className="block text-[14px] font-[700] text-[#0F172A]">
                                                        {option.label}
                                                    </span>
                                                    <span className="mt-[2px] block text-[12px] text-[#64748B]">
                                                        {option.description}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <form onSubmit={handleSubmit(onSubmit)} className="w-full" noValidate>
                                        <Input
                                            type="email"
                                            placeholder="Enter your email"
                                            icon={Mail}
                                            error={errors.email?.message}
                                            {...register('email')}
                                        />
                                        <Input
                                            type="password"
                                            placeholder="Enter your password"
                                            icon={Lock}
                                            error={errors.password?.message}
                                            {...register('password')}
                                        />

                                        <div className="mt-[8px] flex items-center justify-between">
                                            <button
                                                type="button"
                                                onClick={() => toast.info('Forgot password screen is ready to wire when a route is added.')}
                                                className="text-[13px] text-[#2563EB]"
                                            >
                                                Forgot Password?
                                            </button>

                                            <Button type="submit" size="lg" loading={loading} className="min-w-[140px]">
                                                {loading ? 'Logging in...' : 'Login'}
                                                {!loading && <ArrowRight className="h-4 w-4" />}
                                            </Button>
                                        </div>
                                    </form>

                                    <div className="my-[24px] flex items-center">
                                        <div className="h-[1px] flex-1 bg-[#E5E7EB]" />
                                        <span className="px-[12px] text-[12px] text-[#9CA3AF]">
                                            Or Login With
                                        </span>
                                        <div className="h-[1px] flex-1 bg-[#E5E7EB]" />
                                    </div>

                                    <div className="flex justify-center gap-[12px]">
                                        <SocialButton icon={<Globe className="h-4 w-4" />} label="Google" />
                                        <SocialButton icon={<Facebook className="h-4 w-4" />} label="Facebook" />
                                    </div>

                                    <div className="mt-[20px] text-center text-[13px]">
                                        <span className="text-[#6B7280]">Don't have an account? </span>
                                        <Link to="/register" className="cursor-pointer font-semibold text-[#2563EB]">
                                            Register
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
