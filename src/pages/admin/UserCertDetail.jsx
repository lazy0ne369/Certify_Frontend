import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { ArrowLeft, Award, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { getUserById, getUserCertificates } from '../../services/adminService';
import { deleteCertificate, updateCertificate } from '../../services/certificateService';
import { staggerContainer, listItemVariants, cardVariants } from '../../animations/variants';
import { getInitials, avatarColor } from '../../utils/helpers';
import PageWrapper from '../../components/layout/PageWrapper';
import CertCard from '../../components/shared/CertCard';
import EmptyState from '../../components/shared/EmptyState';
import ConfirmModal from '../../components/shared/ConfirmModal';
import AdminEditModal from './AdminEditModal';

function StatChip({ icon: Icon, label, value, color }) {
    const colors = {
        indigo: 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
        emerald: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
        amber: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
        red: 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    };

    return (
        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold ${colors[color]}`}>
            <Icon className="w-3.5 h-3.5" />
            <span>{value} {label}</span>
        </div>
    );
}

export default function UserCertDetail() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [certs, setCerts] = useState([]);
    const [editing, setEditing] = useState(null);
    const [toDelete, setToDelete] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        let isMounted = true;

        Promise.all([getUserById(userId), getUserCertificates(userId)])
            .then(([userData, certificatesData]) => {
                if (!isMounted) return;
                setUser(userData);
                setCerts(certificatesData);
            })
            .catch((error) => {
                if (!isMounted) return;
                toast.error(error.message);
            })
            .finally(() => {
                if (isMounted) {
                    setLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [userId]);

    const stats = useMemo(() => ({
        total: certs.length,
        active: certs.filter((certificate) => certificate.status === 'active').length,
        expiringSoon: certs.filter((certificate) => certificate.status === 'expiring_soon').length,
        expired: certs.filter((certificate) => certificate.status === 'expired').length,
    }), [certs]);

    const handleSaveEdit = async (data) => {
        if (!editing) return;

        // Optimistic UI update
        const optimisticUpdated = { ...editing, ...data };
        setCerts((previous) => previous.map((certificate) =>
            certificate.id === editing.id ? optimisticUpdated : certificate
        ));

        setSaving(true);

        try {
            const updated = await updateCertificate(editing.id, {
                ...data,
                badgeUrl: editing.badgeUrl ?? '',
                certificateUrl: editing.certificateUrl ?? '',
            });
            setCerts((previous) => previous.map((certificate) =>
                certificate.id === updated.id ? updated : certificate
            ));
            toast.success('Certificate updated!');
            setEditing(null);
        } catch (error) {
            // Revert on failure
            setCerts((previous) => previous.map((certificate) =>
                certificate.id === editing.id ? editing : certificate
            ));
            toast.error(error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!toDelete) return;

        setSaving(true);

        try {
            await deleteCertificate(toDelete.id);
            setCerts((previous) => previous.filter((certificate) => certificate.id !== toDelete.id));
            toast.success(`"${toDelete.title}" deleted.`);
            setToDelete(null);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <PageWrapper>
                <div className="space-y-6">
                    <div className="h-6 w-40 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    <div className="h-36 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <div key={index} className="h-80 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
                        ))}
                    </div>
                </div>
            </PageWrapper>
        );
    }

    if (!user) {
        return (
            <PageWrapper>
                <p className="text-gray-500 dark:text-gray-400 text-center py-24">User not found.</p>
            </PageWrapper>
        );
    }

    const initials = getInitials(user.name);
    const bgColor = avatarColor(user.name);

    return (
        <PageWrapper>
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
                <motion.button
                    variants={listItemVariants}
                    onClick={() => navigate('/admin/users')}
                    className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to User Management
                </motion.button>

                <motion.div
                    variants={listItemVariants}
                    className="rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-md p-5"
                >
                    <div className="flex flex-wrap items-center gap-4">
                        {user.avatar ? (
                            <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-14 h-14 rounded-full object-cover ring-2 ring-indigo-100 dark:ring-indigo-900"
                            />
                        ) : (
                            <span className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg ${bgColor}`}>
                                {initials}
                            </span>
                        )}
                        <div className="flex-1 min-w-0">
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{user.designation} · {user.department}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500">{user.email}</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                        <StatChip icon={Award} label="Total" value={stats.total} color="indigo" />
                        <StatChip icon={CheckCircle} label="Active" value={stats.active} color="emerald" />
                        <StatChip icon={AlertTriangle} label="Expiring Soon" value={stats.expiringSoon} color="amber" />
                        <StatChip icon={XCircle} label="Expired" value={stats.expired} color="red" />
                    </div>
                </motion.div>

                {certs.length === 0 ? (
                    <EmptyState title="No certifications" message="This user has no certifications yet." />
                ) : (
                    <motion.div variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {certs.map((cert) => (
                            <motion.div key={cert.id} variants={cardVariants} className="flex flex-col">
                                <CertCard cert={cert} showViewButton={false} />
                                <div className="flex gap-2 mt-2">
                                    <button
                                        onClick={() => setEditing(cert)}
                                        className="flex-1 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => setToDelete(cert)}
                                        className="flex-1 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </motion.div>

            {editing && (
                <AdminEditModal
                    cert={editing}
                    onClose={() => setEditing(null)}
                    onSave={handleSaveEdit}
                    loading={saving}
                />
            )}

            <ConfirmModal
                isOpen={!!toDelete}
                onClose={() => setToDelete(null)}
                onConfirm={handleDelete}
                title="Delete Certification"
                description={`Delete "${toDelete?.title}"? This cannot be undone.`}
            />
        </PageWrapper>
    );
}
