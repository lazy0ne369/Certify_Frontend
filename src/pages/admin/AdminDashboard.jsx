import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Users, Award, AlertTriangle, XCircle } from 'lucide-react';
import { getAllCertificates, getAllUsers } from '../../services/adminService';
import { staggerContainer, listItemVariants } from '../../animations/variants';
import PageWrapper from '../../components/layout/PageWrapper';
import StatCard from '../../components/shared/StatCard';
import CertDonutChart from '../../components/charts/CertDonutChart';
import ExpiryBarChart from '../../components/charts/ExpiryBarChart';
import DepartmentChart from '../../components/charts/DepartmentChart';
import TopCertsChart from '../../components/charts/TopCertsChart';
import ActivityChart from '../../components/charts/ActivityChart';
import { StatRowSkeleton } from '../../components/shared/SkeletonCard';

const STAT_DEFS = [
    { key: 'totalUsers', label: 'Total Users', icon: Users, color: 'sky', trend: 'registered' },
    { key: 'totalCerts', label: 'Total Certifications', icon: Award, color: 'indigo', trend: 'org-wide' },
    { key: 'expiringSoon', label: 'Expiring Soon', icon: AlertTriangle, color: 'amber', trend: 'need action' },
    { key: 'expired', label: 'Expired', icon: XCircle, color: 'red', trend: 'overdue' },
];

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
                if (isMounted) {
                    setLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, []);

    const stats = useMemo(() => ({
        totalUsers: users.length,
        totalCerts: certificates.length,
        active: certificates.filter((certificate) => certificate.status === 'active').length,
        expiringSoon: certificates.filter((certificate) => certificate.status === 'expiring_soon').length,
        expired: certificates.filter((certificate) => certificate.status === 'expired').length,
    }), [certificates, users.length]);

    if (loading) {
        return (
            <PageWrapper>
                <div className="space-y-6">
                    <div className="h-8 w-56 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    <StatRowSkeleton count={4} />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="h-64 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
                        <div className="h-64 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    </div>
                </div>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper>
            <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-6"
            >
                <motion.div variants={listItemVariants}>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Organization-wide certification overview
                    </p>
                </motion.div>

                <motion.div
                    variants={staggerContainer}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-4"
                >
                    {STAT_DEFS.map(({ key, label, icon, color, trend }) => (
                        <motion.div key={key} variants={listItemVariants}>
                            <StatCard
                                title={label}
                                value={stats[key] ?? 0}
                                icon={icon}
                                color={color}
                                trend={trend}
                            />
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div variants={listItemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <CertDonutChart stats={{
                        total: stats.totalCerts,
                        active: stats.active,
                        expiringSoon: stats.expiringSoon,
                        expired: stats.expired,
                    }} />
                    <ExpiryBarChart certificates={certificates} />
                </motion.div>

                <motion.div variants={listItemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <DepartmentChart users={users} certificates={certificates} />
                    <TopCertsChart certificates={certificates} />
                </motion.div>

                <motion.div variants={listItemVariants}>
                    <ActivityChart certificates={certificates} />
                </motion.div>
            </motion.div>
        </PageWrapper>
    );
}
