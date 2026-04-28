import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { ArrowRight, Briefcase, Building2, Lock, Mail, ShieldCheck, User, UserCircle2 } from 'lucide-react';
import { registerUser } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';
import AuthVisualPanel from '../../components/auth/AuthVisualPanel';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const schema = z
    .object({
        name: z.string().min(2, 'Name must be at least 2 characters'),
        email: z.string().email('Enter a valid email address'),
        password: z.string().min(6, 'Password must be at least 6 characters'),
        confirmPassword: z.string().min(6, 'Confirm your password'),
        designation: z.string().min(2, 'Designation is required'),
        department: z.string().min(1, 'Department is required'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ['confirmPassword'],
        message: 'Passwords must match',
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
        defaultValues: {
            department: '',
            confirmPassword: '',
        },
    });

    const onSubmit = async (values) => {
        setLoading(true);
        const { confirmPassword, ...formData } = values;
        void confirmPassword;

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
        <div className="min-h-screen bg-white">
            <div className="flex min-h-screen w-full items-center justify-center">
                <section className="w-full min-h-screen overflow-hidden bg-white">
                    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[42vw_58vw]">
                        <AuthVisualPanel mode="REGISTER" />

                        <div className="flex h-[100vh] w-full lg:w-[58vw] items-center justify-center overflow-y-auto bg-[#FFFFFF]">
                            <div className="w-full max-w-[460px] px-[40px] py-[48px]">
                                <div>
                                    <div className="mx-auto mb-[16px] flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#ECFDF5]">
                                        <UserCircle2 className="h-[36px] w-[36px] text-[#0F9D8A]" />
                                    </div>

                                    <h1 className="mb-[6px] text-center text-[28px] font-[800] tracking-[2px] text-[#0F9D8A]">
                                        REGISTER
                                    </h1>
                                    <p className="mx-auto mb-[36px] max-w-[360px] text-center text-[13px] text-[#6B7280]">
                                        Create your profile and keep every certification, renewal, and achievement organized.
                                    </p>

                                    <form onSubmit={handleSubmit(onSubmit)} className="grid w-full grid-cols-2 gap-x-[32px] gap-y-0" noValidate>
                                        <Input
                                            type="text"
                                            placeholder="Enter your full name"
                                            icon={User}
                                            error={errors.name?.message}
                                            {...register('name')}
                                        />
                                        <Input
                                            type="email"
                                            placeholder="Enter your email"
                                            icon={Mail}
                                            error={errors.email?.message}
                                            {...register('email')}
                                        />
                                        <Input
                                            type="password"
                                            placeholder="Create a password"
                                            icon={Lock}
                                            error={errors.password?.message}
                                            {...register('password')}
                                        />
                                        <Input
                                            type="password"
                                            placeholder="Confirm your password"
                                            icon={ShieldCheck}
                                            error={errors.confirmPassword?.message}
                                            {...register('confirmPassword')}
                                        />
                                        <Input
                                            type="text"
                                            placeholder="Your role"
                                            icon={Briefcase}
                                            error={errors.designation?.message}
                                            {...register('designation')}
                                        />
                                        <Input
                                            type="text"
                                            placeholder="Organization"
                                            icon={Building2}
                                            error={errors.department?.message}
                                            {...register('department')}
                                        />

                                        <div className="col-span-2 mt-[24px] flex items-center justify-between">
                                            <div className="text-[13px]">
                                                <span className="text-[#6B7280]">Already have an account? </span>
                                                <Link to="/login" className="font-semibold text-[#0F9D8A]">
                                                    Login
                                                </Link>
                                            </div>

                                            <Button
                                                type="submit"
                                                size="lg"
                                                loading={loading}
                                                className="min-w-[190px] bg-[#0F9D8A] hover:bg-[#0B7E6F] hover:shadow-[0_8px_20px_rgba(15,157,138,0.35)] focus:ring-[#0F9D8A]"
                                            >
                                                {loading ? 'Creating...' : 'Create Account'}
                                                {!loading && <ArrowRight className="h-4 w-4" />}
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
