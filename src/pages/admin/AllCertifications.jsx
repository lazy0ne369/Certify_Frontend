import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { Download } from 'lucide-react';
import { getAllCertificates } from '../../services/adminService';
import { deleteCertificate, updateCertificate } from '../../services/certificateService';
import { staggerContainer } from '../../animations/variants';
import PageWrapper from '../../components/layout/PageWrapper';
import SearchBar from '../../components/shared/SearchBar';
import EmptyState from '../../components/shared/EmptyState';
import ConfirmModal from '../../components/shared/ConfirmModal';
import Button from '../../components/ui/Button';
import AdminCertCard from './AdminCertCard';
import AdminEditModal from './AdminEditModal';

export default function AllCertifications() {
    const [certs, setCerts] = useState([]);
    const [query, setQuery] = useState('');
    const [status, setStatus] = useState('');
    const [category, setCategory] = useState('');
    const [editing, setEditing] = useState(null);
    const [toDelete, setToDelete] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        let isMounted = true;

        getAllCertificates()
            .then((data) => {
                if (isMounted) {
                    setCerts(data);
                }
            })
            .catch((error) => {
                if (isMounted) {
                    toast.error(error.message);
                }
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
        const normalizedQuery = query.toLowerCase();

        return certs.filter((certificate) => {
            const ownerName = certificate.owner?.name ?? '';
            const matchText = !normalizedQuery || [certificate.title, certificate.organization, ownerName]
                .some((value) => value.toLowerCase().includes(normalizedQuery));
            const matchStatus = !status || certificate.status === status;
            const matchCategory = !category || certificate.category === category;

            return matchText && matchStatus && matchCategory;
        });
    }, [certs, query, status, category]);

    const handleSaveEdit = async (data) => {
        if (!editing) return;

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

    const handleExport = () => {
        const rows = certs.map((certificate) => ({
            Title: certificate.title,
            Organization: certificate.organization,
            Category: certificate.category,
            Status: certificate.status,
            'Issue Date': certificate.issueDate,
            'Expiry Date': certificate.expiryDate,
            'Credential ID': certificate.credentialId ?? '',
            Owner: certificate.owner?.name ?? '',
            Email: certificate.owner?.email ?? '',
        }));
        const worksheet = XLSX.utils.json_to_sheet(rows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Certifications');
        XLSX.writeFile(workbook, 'certtrack_certifications.xlsx');
        toast.success('Excel file downloaded!');
    };

    if (loading) {
        return (
            <PageWrapper>
                <div className="space-y-4">
                    <div className="h-8 w-56 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    <div className="h-10 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div key={index} className="h-80 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
                        ))}
                    </div>
                </div>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                <div className="flex items-center gap-3">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">All Certifications</h1>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300">
                        {certs.length}
                    </span>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={handleExport}>
                        <Download className="w-4 h-4" /> Export Excel
                    </Button>
                </div>
            </div>

            <div className="mb-3">
                <SearchBar onSearch={setQuery} onFilterStatus={setStatus} onFilterCategory={setCategory} />
            </div>

            <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
                Showing <span className="font-semibold text-gray-600 dark:text-gray-300">{filtered.length}</span> of{' '}
                <span className="font-semibold text-gray-600 dark:text-gray-300">{certs.length}</span> certifications
            </p>

            {filtered.length === 0 ? (
                <EmptyState title="No certifications found" message="Try adjusting your search or filters." />
            ) : (
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                    {filtered.map((cert) => (
                        <AdminCertCard
                            key={cert.id}
                            cert={cert}
                            ownerUser={cert.owner}
                            onEdit={setEditing}
                            onDelete={setToDelete}
                        />
                    ))}
                </motion.div>
            )}

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
                description={`Are you sure you want to delete "${toDelete?.title}"? This cannot be undone.`}
            />
        </PageWrapper>
    );
}
