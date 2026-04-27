import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Users } from 'lucide-react';
import { getAllCertificates, getAllUsers } from '../../services/adminService';
import { getCertsByUser } from '../../utils/certHelpers';
import { staggerContainer, listItemVariants } from '../../animations/variants';
import PageWrapper from '../../components/layout/PageWrapper';
import EmptyState from '../../components/shared/EmptyState';
import UserCard from './UserCard';

export default function UserManagement() {
    const [query, setQuery] = useState('');
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

    const filtered = useMemo(() => {
        const normalizedQuery = query.toLowerCase().trim();

        if (!normalizedQuery) {
            return users;
        }

        return users.filter((user) =>
            user.name.toLowerCase().includes(normalizedQuery)
            || user.department?.toLowerCase().includes(normalizedQuery)
            || user.email.toLowerCase().includes(normalizedQuery)
        );
    }, [query, users]);

    if (loading) {
        return (
            <PageWrapper>
                <div className="space-y-5">
                    <div className="h-8 w-56 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    <div className="h-10 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    <div className="space-y-3">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div key={index} className="h-28 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
                        ))}
                    </div>
                </div>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper>
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-5">
                <motion.div variants={listItemVariants}>
                    <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-900/40">
                            <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </span>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">User Management</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {users.length} registered users
                            </p>
                        </div>
                    </div>
                </motion.div>

                <motion.div variants={listItemVariants}>
                    <input
                        type="text"
                        placeholder="Search by name, email, or department..."
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        className="w-full h-10 pl-4 pr-3 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                    />
                </motion.div>

                <motion.p variants={listItemVariants} className="text-xs text-gray-400 dark:text-gray-500">
                    Showing <span className="font-semibold text-gray-600 dark:text-gray-300">{filtered.length}</span> of{' '}
                    <span className="font-semibold text-gray-600 dark:text-gray-300">{users.length}</span> users
                </motion.p>

                {filtered.length === 0 ? (
                    <EmptyState title="No users found" message="Try adjusting your search." />
                ) : (
                    <motion.div variants={staggerContainer} className="space-y-3">
                        {filtered.map((user) => (
                            <UserCard
                                key={user.id}
                                user={user}
                                certs={getCertsByUser(certificates, user.id)}
                            />
                        ))}
                    </motion.div>
                )}
            </motion.div>
        </PageWrapper>
    );
}
