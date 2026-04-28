import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight, CircleUserRound, Mail } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const MotionSection = motion.section;

export default function ForgotPassword() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            email: '',
        },
    });

    const onSubmit = ({ email }) => {
        toast.success(`Reset instructions will be sent to ${email} once this route is wired to the backend flow.`);
    };

    return (
        <div className="min-h-screen bg-[linear-gradient(180deg,#F8FAFC_0%,#EFF6FF_100%)] px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl items-center justify-center">
                <MotionSection
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                    className="w-full max-w-xl rounded-[28px] bg-white px-6 py-10 shadow-[0_28px_80px_rgba(15,23,42,0.16)] sm:px-10"
                >
                    <div className="mx-auto max-w-md">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#DBEAFE]">
                            <CircleUserRound className="h-9 w-9 text-[#2563EB]" />
                        </div>

                        <h1 className="mt-6 text-center text-3xl font-bold tracking-tight text-[#2563EB] sm:text-4xl">
                            Forgot Password
                        </h1>
                        <p className="mt-3 text-center text-sm font-light leading-7 text-[#6B7280]">
                            Enter your email address and we&apos;ll prepare password reset instructions for your account.
                        </p>

                        <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-8" noValidate>
                            <Input
                                label="Email"
                                type="email"
                                placeholder="Enter your email"
                                icon={Mail}
                                error={errors.email?.message}
                                {...register('email', { required: 'Email is required' })}
                            />

                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <Link
                                    to="/login"
                                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#2563EB] transition-colors hover:text-[#1D4ED8]"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    Back to Login
                                </Link>

                                <Button type="submit" size="lg" className="min-w-[170px]">
                                    Submit
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </form>
                    </div>
                </MotionSection>
            </div>
        </div>
    );
}
