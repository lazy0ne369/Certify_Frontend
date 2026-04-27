import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Save, Lock, Trash2, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useCertStore } from '../../store/certStore';
import { deleteCurrentUser, updateCurrentUser } from '../../services/userService';
import { getCertStats } from '../../utils/certHelpers';
import { staggerContainer, listItemVariants } from '../../animations/variants';
import PageWrapper from '../../components/layout/PageWrapper';
import ProfileCard from './ProfileCard';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import ConfirmModal from '../../components/shared/ConfirmModal';

const DEPARTMENTS = ['Engineering', 'Analytics', 'Infrastructure', 'Management'];

const profileSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    designation: z.string().min(2, 'Designation is required'),
    department: z.string().min(1, 'Department is required'),
});

const cls = 'w-full h-10 px-3 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors';

export default function Profile() {
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const updateUser = useAuthStore((state) => state.updateUser);
    const certificates = useCertStore((state) => state.certificates);
    const fetchCertificates = useCertStore((state) => state.fetchCertificates);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    useEffect(() => {
        fetchCertificates().catch(() => {
            // Profile still works without certificate stats, so we keep this silent.
        });
    }, [fetchCertificates]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(profileSchema),
        values: {
            name: user?.name ?? '',
            designation: user?.designation ?? '',
            department: user?.department ?? '',
        },
    });

    const onSave = async (data) => {
        setSaving(true);

        try {
            const updatedUser = await updateCurrentUser({
                ...data,
                avatar: user?.avatar ?? '',
            });
            updateUser(updatedUser);
            toast.success('Profile updated successfully!');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        setDeleting(true);

        try {
            await deleteCurrentUser();
            logout();
            toast.success('Your account has been deleted.');
            navigate('/login', { replace: true });
        } catch (error) {
            toast.error(error.message);
        } finally {
            setDeleting(false);
            setDeleteModalOpen(false);
        }
    };

    const Lbl = ({ children }) => (
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{children}</label>
    );
    const Err = ({ msg }) => (msg ? <p className="text-xs text-red-500 mt-0.5">{msg}</p> : null);

    return (
        <PageWrapper>
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
                <motion.div variants={listItemVariants}>
                    <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-900/40">
                            <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </span>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">My Profile</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Manage your personal information</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div variants={listItemVariants} className="grid grid-cols-1 lg:grid-cols-[minmax(320px,360px)_1fr] gap-6">
                    <div>
                        <ProfileCard user={user} stats={getCertStats(certificates)} />
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-xl shadow-md bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6">
                            <h2 className="text-sm font-semibold text-gray-800 dark:text-white mb-4">Edit Profile</h2>
                            <form onSubmit={handleSubmit(onSave)} className="space-y-4" noValidate>
                                <div>
                                    <Lbl>Full Name *</Lbl>
                                    <input {...register('name')} placeholder="Your full name" className={cls} />
                                    <Err msg={errors.name?.message} />
                                </div>
                                <div>
                                    <Lbl>Designation *</Lbl>
                                    <input {...register('designation')} placeholder="e.g. Software Engineer" className={cls} />
                                    <Err msg={errors.designation?.message} />
                                </div>
                                <div>
                                    <Lbl>Department *</Lbl>
                                    <select {...register('department')} className={cls}>
                                        <option value="" disabled>Select department</option>
                                        {DEPARTMENTS.map((department) => (
                                            <option key={department} value={department}>
                                                {department}
                                            </option>
                                        ))}
                                    </select>
                                    <Err msg={errors.department?.message} />
                                </div>
                                <div>
                                    <Lbl>Email (cannot be changed)</Lbl>
                                    <input
                                        value={user?.email ?? ''}
                                        disabled
                                        className={`${cls} opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-800`}
                                    />
                                </div>
                                <Button type="submit" variant="primary" size="md" loading={saving}>
                                    <Save className="w-4 h-4" />
                                    Save Changes
                                </Button>
                            </form>
                        </div>

                        <div className="rounded-xl shadow-md bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Lock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                <h2 className="text-sm font-semibold text-gray-800 dark:text-white">Change Password</h2>
                            </div>
                            <div className="space-y-3">
                                <Input label="Current Password" type="password" placeholder="Enter current password" />
                                <Input label="New Password" type="password" placeholder="Enter new password" />
                                <Input label="Confirm Password" type="password" placeholder="Confirm new password" />
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="md"
                                    onClick={() => toast.info('Password change is not part of the current backend API.')}
                                >
                                    Update Password
                                </Button>
                            </div>
                        </div>

                        <div className="rounded-xl shadow-md bg-white dark:bg-gray-900 border border-red-100 dark:border-red-900/40 p-6">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="text-sm font-semibold text-gray-800 dark:text-white">Delete Account</h2>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        Permanently remove your profile and certificates from the platform.
                                    </p>
                                </div>
                                <Button type="button" variant="danger" size="md" onClick={() => setDeleteModalOpen(true)}>
                                    <Trash2 className="w-4 h-4" />
                                    Delete Account
                                </Button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            <ConfirmModal
                isOpen={deleteModalOpen}
                onClose={() => !deleting && setDeleteModalOpen(false)}
                onConfirm={handleDeleteAccount}
                title="Delete your account?"
                description="This will permanently remove your profile and certificates. You will be logged out immediately."
                confirmLabel="Delete Account"
                loading={deleting}
            />
        </PageWrapper>
    );
}
