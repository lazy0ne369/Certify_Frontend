import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import {
    CheckCircle2,
    Download,
    Eye,
    FileCheck2,
    Filter,
    Pencil,
    Search,
    Trash2,
} from 'lucide-react';
import { getAllCertificates } from '../../services/adminService';
import { deleteCertificate, updateCertificate } from '../../services/certificateService';
import PageWrapper from '../../components/layout/PageWrapper';
import EmptyState from '../../components/shared/EmptyState';
import ConfirmModal from '../../components/shared/ConfirmModal';
import Button from '../../components/ui/Button';
import AdminEditModal from './AdminEditModal';
import { listItemVariants, staggerContainer } from '../../animations/variants';

const MotionSection = motion.section;

const STATUS_OPTIONS = ['', 'active', 'expiring_soon', 'expired'];
const CATEGORY_OPTIONS = ['', 'Cloud', 'DevOps', 'Data', 'Frontend'];

function StatusBadge({ status }) {
    const map = {
        active: 'bg-emerald-50 text-emerald-600',
        expiring_soon: 'bg-amber-50 text-amber-600',
        expired: 'bg-rose-50 text-rose-600',
    };

    return (
        <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${map[status] ?? 'bg-slate-100 text-slate-500'}`}>
            {status.replace('_', ' ')}
        </span>
    );
}

export default function AllCertifications() {
    const [certs, setCerts] = useState([]);
    const [query, setQuery] = useState('');
    const [status, setStatus] = useState('');
    const [category, setCategory] = useState('');
    const [editing, setEditing] = useState(null);
    const [toDelete, setToDelete] = useState(null);
    const [verifyTarget, setVerifyTarget] = useState(null);
    const [selectedIds, setSelectedIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        let isMounted = true;

        getAllCertificates()
            .then((data) => {
                if (isMounted) setCerts(data);
            })
            .catch((error) => {
                if (isMounted) toast.error(error.message);
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    const filtered = useMemo(() => {
        const normalizedQuery = query.toLowerCase();

        return certs.filter((certificate) => {
            const ownerName = certificate.owner?.name ?? '';
            const matchesQuery =
                !normalizedQuery
                || [certificate.title, certificate.organization, ownerName]
                    .some((value) => value.toLowerCase().includes(normalizedQuery));
            const matchesStatus = !status || certificate.status === status;
            const matchesCategory = !category || certificate.category === category;

            return matchesQuery && matchesStatus && matchesCategory;
        });
    }, [certs, query, status, category]);

    const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

    const handleSaveEdit = async (data) => {
        if (!editing) return;

        // Optimistic UI update
        const optimisticUpdated = { ...editing, ...data };
        setCerts((previous) => previous.map((certificate) => (
            certificate.id === editing.id ? optimisticUpdated : certificate
        )));

        setSaving(true);
        try {
            const updated = await updateCertificate(editing.id, {
                ...data,
                badgeUrl: editing.badgeUrl ?? '',
                certificateUrl: editing.certificateUrl ?? '',
            });

            setCerts((previous) => previous.map((certificate) => (
                certificate.id === updated.id ? updated : certificate
            )));
            toast.success('Certificate updated!');
            setEditing(null);
        } catch (error) {
            // Revert on failure
            setCerts((previous) => previous.map((certificate) => (
                certificate.id === editing.id ? editing : certificate
            )));
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
            setSelectedIds((previous) => previous.filter((id) => id !== toDelete.id));
            toast.success(`"${toDelete.title}" deleted.`);
            setToDelete(null);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) return;

        setSaving(true);
        try {
            await Promise.all(selectedIds.map((id) => deleteCertificate(id)));
            setCerts((previous) => previous.filter((certificate) => !selectedSet.has(certificate.id)));
            setSelectedIds([]);
            toast.success('Selected certifications deleted.');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleExport = (rows = certs, fileName = 'certtrack_certifications.xlsx') => {
        const exportRows = rows.map((certificate) => ({
            User: certificate.owner?.name ?? '',
            Title: certificate.title,
            Organization: certificate.organization,
            Category: certificate.category,
            Status: certificate.status,
            'Issue Date': certificate.issueDate,
            'Expiry Date': certificate.expiryDate,
            'Credential ID': certificate.credentialId ?? '',
            Email: certificate.owner?.email ?? '',
        }));
        const worksheet = XLSX.utils.json_to_sheet(exportRows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Certifications');
        XLSX.writeFile(workbook, fileName);
        toast.success('Excel file downloaded!');
    };

    const toggleSelected = (id) => {
        setSelectedIds((previous) => (
            previous.includes(id)
                ? previous.filter((entry) => entry !== id)
                : [...previous, id]
        ));
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === filtered.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filtered.map((certificate) => certificate.id));
        }
    };

    if (loading) {
        return (
            <PageWrapper className="py-8">
                <div className="space-y-6">
                    <div className="h-10 w-72 animate-pulse rounded-xl bg-slate-200" />
                    <div className="h-24 animate-pulse rounded-xl bg-slate-200" />
                    <div className="h-[520px] animate-pulse rounded-xl bg-slate-200" />
                </div>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper className="py-8">
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
                <MotionSection variants={listItemVariants} className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="section-label">Manage Certifications</p>
                        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                            <span>Certification </span>
                            <span className="text-[#2563EB]">registry</span>
                        </h1>
                        <p className="mt-2 text-sm font-light leading-7 text-slate-500">
                            Search, filter, verify, edit, and bulk-manage certifications across the organization.
                        </p>
                    </div>

                    <Button variant="outline" size="lg" onClick={() => handleExport(filtered)}>
                        <Download className="h-4 w-4" />
                        Export Excel
                    </Button>
                </MotionSection>

                <MotionSection variants={listItemVariants} className="rounded-xl border border-slate-200 bg-white p-4 shadow-md">
                    <div className="grid gap-3 lg:grid-cols-[1.3fr_0.7fr_0.7fr]">
                        <div className="relative">
                            <Search className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder="Search by user, certificate, or issuer"
                                className="h-12 w-full border-0 border-b-2 border-slate-200 bg-transparent pl-7 pr-4 text-sm text-slate-800 focus:border-[#2563EB] focus:outline-none"
                            />
                        </div>

                        <div className="relative">
                            <Filter className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <select
                                value={status}
                                onChange={(event) => setStatus(event.target.value)}
                                className="h-12 w-full border-0 border-b-2 border-slate-200 bg-transparent pl-7 pr-4 text-sm text-slate-800 focus:border-[#2563EB] focus:outline-none"
                            >
                                <option value="">All Statuses</option>
                                {STATUS_OPTIONS.filter(Boolean).map((option) => (
                                    <option key={option} value={option}>{option.replace('_', ' ')}</option>
                                ))}
                            </select>
                        </div>

                        <div className="relative">
                            <Filter className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <select
                                value={category}
                                onChange={(event) => setCategory(event.target.value)}
                                className="h-12 w-full border-0 border-b-2 border-slate-200 bg-transparent pl-7 pr-4 text-sm text-slate-800 focus:border-[#2563EB] focus:outline-none"
                            >
                                <option value="">All Categories</option>
                                {CATEGORY_OPTIONS.filter(Boolean).map((option) => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500">
                        <span className="rounded-full bg-slate-100 px-3 py-1">{filtered.length} shown</span>
                        <span className="rounded-full bg-slate-100 px-3 py-1">{selectedIds.length} selected</span>
                    </div>
                </MotionSection>

                {selectedIds.length > 0 && (
                    <MotionSection variants={listItemVariants} className="flex flex-col gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
                        <p className="text-sm font-semibold text-blue-700">{selectedIds.length} certifications selected for bulk actions.</p>
                        <div className="flex flex-wrap gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleExport(certs.filter((certificate) => selectedSet.has(certificate.id)), 'certtrack_selected_certifications.xlsx')}>
                                <Download className="h-4 w-4" />
                                Export Selected
                            </Button>
                            <Button variant="danger" size="sm" onClick={handleBulkDelete} loading={saving}>
                                <Trash2 className="h-4 w-4" />
                                Bulk Delete
                            </Button>
                        </div>
                    </MotionSection>
                )}

                {filtered.length === 0 ? (
                    <EmptyState title="No certifications found" message="Try adjusting your search or filters." />
                ) : (
                    <MotionSection variants={listItemVariants} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md">
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left">
                                <thead className="border-b border-slate-200 bg-slate-50">
                                    <tr>
                                        <th className="px-4 py-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.length === filtered.length && filtered.length > 0}
                                                onChange={toggleSelectAll}
                                            />
                                        </th>
                                        {['User', 'Cert Name', 'Issuer', 'Expiry', 'Status', 'Actions'].map((header) => (
                                            <th key={header} className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filtered.map((certificate) => (
                                        <tr key={certificate.id} className="hover:bg-slate-50/80">
                                            <td className="px-4 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedSet.has(certificate.id)}
                                                    onChange={() => toggleSelected(certificate.id)}
                                                />
                                            </td>
                                            <td className="px-4 py-4 text-sm font-semibold text-slate-900">{certificate.owner?.name ?? '-'}</td>
                                            <td className="px-4 py-4">
                                                <p className="text-sm font-semibold text-slate-900">{certificate.title}</p>
                                                <p className="mt-1 text-xs text-slate-500">{certificate.category}</p>
                                            </td>
                                            <td className="px-4 py-4 text-sm text-slate-600">{certificate.organization}</td>
                                            <td className="px-4 py-4 text-sm text-slate-600">
                                                {certificate.expiryDate ? format(parseISO(certificate.expiryDate), 'dd MMM yyyy') : '-'}
                                            </td>
                                            <td className="px-4 py-4">
                                                <StatusBadge status={certificate.status} />
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex flex-wrap gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => toast.info(`View details for ${certificate.title}`)}
                                                        className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:border-blue-200 hover:text-blue-600"
                                                    >
                                                        <Eye className="h-3.5 w-3.5" />
                                                        View
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setEditing(certificate)}
                                                        className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:border-blue-200 hover:text-blue-600"
                                                    >
                                                        <Pencil className="h-3.5 w-3.5" />
                                                        Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setToDelete(certificate)}
                                                        className="inline-flex items-center gap-1 rounded-full border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                        Delete
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setVerifyTarget(certificate)}
                                                        className="inline-flex items-center gap-1 rounded-full border border-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-600 transition-colors hover:bg-emerald-50"
                                                    >
                                                        <FileCheck2 className="h-3.5 w-3.5" />
                                                        Verify
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </MotionSection>
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

                <ConfirmModal
                    isOpen={!!verifyTarget}
                    onClose={() => setVerifyTarget(null)}
                    onConfirm={async () => {
                        if (!verifyTarget) return;
                        const target = verifyTarget;
                        setVerifyTarget(null);

                        // Optimistic UI update
                        const optimisticUpdated = { ...target, status: 'active' };
                        setCerts((prev) => prev.map(c => c.id === target.id ? optimisticUpdated : c));
                        toast.success(`Verification initiated for "${target.title}".`);

                        try {
                            const updated = await updateCertificate(target.id, { ...target, status: 'active' });
                            setCerts((prev) => prev.map(c => c.id === updated.id ? updated : c));
                        } catch (err) {
                            // Revert on failure
                            setCerts((prev) => prev.map(c => c.id === target.id ? target : c));
                            toast.error("Failed to verify certification.");
                        }
                    }}
                    title="Verify Certification"
                    description={`Confirm verification for "${verifyTarget?.title}"?`}
                    confirmLabel="Verify"
                />
            </motion.div>
        </PageWrapper>
    );
}
