import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { differenceInDays, format, parseISO } from 'date-fns';
import { toast } from 'sonner';
import {
    Eye,
    Filter,
    GripVertical,
    Pencil,
    PlusCircle,
    Search,
    Trash2,
} from 'lucide-react';
import { useCertStore } from '../../store/certStore';
import PageWrapper from '../../components/layout/PageWrapper';
import ConfirmModal from '../../components/shared/ConfirmModal';
import EmptyState from '../../components/shared/EmptyState';
import Button from '../../components/ui/Button';
import { cardVariants, listItemVariants, staggerContainer } from '../../animations/variants';

const MotionDiv = motion.div;
const MotionSection = motion.section;

const CATEGORY_OPTIONS = ['', 'Cloud', 'DevOps', 'Data', 'Frontend'];
const STATUS_OPTIONS = ['', 'active', 'expiring_soon', 'expired'];

function SkeletonGrid() {
    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-72 animate-pulse rounded-xl bg-slate-200" />
            ))}
        </div>
    );
}

function StatusPill({ status }) {
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

export default function MyCertifications() {
    const navigate = useNavigate();
    const certs = useCertStore((state) => state.certificates);
    const fetchCertificates = useCertStore((state) => state.fetchCertificates);
    const removeCertificate = useCertStore((state) => state.deleteCertificate);
    const isLoading = useCertStore((state) => state.isLoading);
    const hasLoaded = useCertStore((state) => state.hasLoaded);

    const [query, setQuery] = useState('');
    const [status, setStatus] = useState('');
    const [category, setCategory] = useState('');
    const [toDelete, setToDelete] = useState(null);
    const [manualOrder, setManualOrder] = useState([]);
    const [draggingId, setDraggingId] = useState(null);

    useEffect(() => {
        fetchCertificates().catch((error) => {
            toast.error(error.message);
        });
    }, [fetchCertificates]);

    const orderedIds = useMemo(() => {
        const nextIds = certs.map((certificate) => String(certificate.id));
        const preserved = manualOrder.filter((id) => nextIds.includes(id));
        const missing = nextIds.filter((id) => !preserved.includes(id));
        return [...preserved, ...missing];
    }, [certs, manualOrder]);

    const filtered = useMemo(() => {
        const normalizedQuery = query.toLowerCase();
        const base = certs.filter((certificate) => {
            const matchesQuery =
                !normalizedQuery
                || certificate.title.toLowerCase().includes(normalizedQuery)
                || certificate.organization.toLowerCase().includes(normalizedQuery);
            const matchesStatus = !status || certificate.status === status;
            const matchesCategory = !category || certificate.category === category;
            return matchesQuery && matchesStatus && matchesCategory;
        });

        const byId = new Map(base.map((certificate) => [String(certificate.id), certificate]));
        const ordered = orderedIds.map((id) => byId.get(id)).filter(Boolean);
        const remainder = base.filter((certificate) => !orderedIds.includes(String(certificate.id)));
        return [...ordered, ...remainder];
    }, [category, certs, orderedIds, query, status]);

    const handleDelete = () => {
        if (!toDelete) return;

        removeCertificate(toDelete.id)
            .then(() => {
                toast.success(`"${toDelete.title}" removed successfully`);
                setToDelete(null);
            })
            .catch((error) => {
                toast.error(error.message);
            });
    };

    const handleDrop = (targetId) => {
        if (!draggingId || draggingId === targetId) return;

        setManualOrder((previous) => {
            const current = [...previous];
            const fullOrder = [
                ...current.filter((id) => certs.some((certificate) => String(certificate.id) === id)),
                ...certs.map((certificate) => String(certificate.id)).filter((id) => !current.includes(id)),
            ];
            const fromIndex = fullOrder.indexOf(String(draggingId));
            const toIndex = fullOrder.indexOf(String(targetId));

            if (fromIndex === -1 || toIndex === -1) {
                return previous;
            }

            const [moved] = fullOrder.splice(fromIndex, 1);
            fullOrder.splice(toIndex, 0, moved);
            return fullOrder;
        });
        setDraggingId(null);
    };

    if (isLoading && !hasLoaded) {
        return (
            <PageWrapper className="py-8">
                <div className="space-y-6">
                    <div className="h-10 w-60 animate-pulse rounded-xl bg-slate-200" />
                    <div className="h-24 animate-pulse rounded-xl bg-slate-200" />
                    <SkeletonGrid />
                </div>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper className="py-8">
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
                <MotionSection variants={listItemVariants} className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="section-label">Certification Library</p>
                        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                            <span>My </span>
                            <span className="text-[#2563EB]">certifications</span>
                        </h1>
                        <p className="mt-2 text-sm font-light leading-7 text-slate-500">
                            Search, filter, reorder, and open each certification from one organized grid.
                        </p>
                    </div>

                    <Button variant="primary" size="lg" onClick={() => navigate('/user/certifications/add')}>
                        <PlusCircle className="h-4 w-4" />
                        Add Certification
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
                                placeholder="Search by certification or issuer"
                                className="h-12 w-full border-0 border-b-2 border-slate-200 bg-transparent pl-7 pr-4 text-sm text-slate-800 transition-colors focus:border-[#2563EB] focus:outline-none"
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
                                    <option key={option} value={option}>
                                        {option.replace('_', ' ')}
                                    </option>
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
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500">
                        <span className="rounded-full bg-slate-100 px-3 py-1">{filtered.length} shown</span>
                        <span className="rounded-full bg-slate-100 px-3 py-1">{certs.length} total</span>
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-600">Drag cards by the handle to reorder locally</span>
                    </div>
                </MotionSection>

                {filtered.length === 0 ? (
                    <EmptyState
                        title="No certifications found"
                        message="Try adjusting your search or filters, or add a new certification."
                        actionLabel="Add Certification"
                        onAction={() => navigate('/user/certifications/add')}
                    />
                ) : (
                    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {filtered.map((cert) => {
                            const daysRemaining = differenceInDays(parseISO(cert.expiryDate), new Date());
                            const dragActive = draggingId === String(cert.id);

                            return (
                                <MotionDiv
                                    key={cert.id}
                                    variants={cardVariants}
                                    draggable
                                    onDragStart={() => setDraggingId(String(cert.id))}
                                    onDragEnd={() => setDraggingId(null)}
                                    onDragOver={(event) => event.preventDefault()}
                                    onDrop={() => handleDrop(String(cert.id))}
                                    className={`rounded-xl border border-slate-200 bg-white p-5 shadow-md transition-all duration-200 hover:scale-[1.02] ${
                                        dragActive ? 'opacity-65 ring-2 ring-blue-300' : ''
                                    }`}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="min-w-0">
                                            <p className="text-lg font-bold tracking-tight text-slate-900 line-clamp-2">{cert.title}</p>
                                            <p className="mt-2 text-sm font-light text-slate-500">{cert.organization}</p>
                                        </div>

                                        <button
                                            type="button"
                                            aria-label="Reorder certification"
                                            className="flex h-10 w-10 shrink-0 cursor-grab items-center justify-center rounded-full border border-slate-200 text-slate-400 transition-colors hover:border-blue-200 hover:text-blue-600 active:cursor-grabbing"
                                        >
                                            <GripVertical className="h-4 w-4" />
                                        </button>
                                    </div>

                                    <div className="mt-5 flex items-center justify-between gap-3">
                                        <StatusPill status={cert.status} />
                                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                                            {cert.category}
                                        </span>
                                    </div>

                                    <div className="mt-5 rounded-xl bg-slate-50 p-4">
                                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Expiry Date</p>
                                        <p className="mt-2 text-sm font-semibold text-slate-900">
                                            {format(parseISO(cert.expiryDate), 'dd MMM yyyy')}
                                        </p>
                                        <p className="mt-1 text-xs font-light text-slate-500">
                                            {daysRemaining < 0 ? `${Math.abs(daysRemaining)} days overdue` : `${daysRemaining} days remaining`}
                                        </p>
                                    </div>

                                    <div className="mt-5 grid grid-cols-3 gap-2">
                                        <button
                                            type="button"
                                            onClick={() => navigate(`/user/certifications/${cert.id}`)}
                                            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2563EB] px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1D4ED8]"
                                        >
                                            <Eye className="h-3.5 w-3.5" />
                                            View
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => navigate(`/user/certifications/edit/${cert.id}`)}
                                            className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:border-blue-200 hover:text-blue-600"
                                        >
                                            <Pencil className="h-3.5 w-3.5" />
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setToDelete(cert)}
                                            className="inline-flex items-center justify-center gap-2 rounded-full border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                            Delete
                                        </button>
                                    </div>
                                </MotionDiv>
                            );
                        })}
                    </motion.div>
                )}

                <ConfirmModal
                    isOpen={!!toDelete}
                    onClose={() => setToDelete(null)}
                    onConfirm={handleDelete}
                    title="Delete Certification"
                    description={`Are you sure you want to delete "${toDelete?.title}"? This cannot be undone.`}
                    confirmLabel="Delete"
                />
            </motion.div>
        </PageWrapper>
    );
}
