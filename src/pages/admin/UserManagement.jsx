import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
    Mail,
    Pencil,
    Plus,
    Search,
    Shield,
    Trash2,
    UserCog,
    UserMinus,
    Users,
} from 'lucide-react';
import { getAllCertificates, getAllUsers } from '../../services/adminService';
import PageWrapper from '../../components/layout/PageWrapper';
import EmptyState from '../../components/shared/EmptyState';
import ConfirmModal from '../../components/shared/ConfirmModal';
import { getInitials, avatarColor } from '../../utils/helpers';
import { backdropVariants, listItemVariants, modalVariants, staggerContainer } from '../../animations/variants';
import { motion as framerMotion, AnimatePresence } from 'framer-motion';

const MotionSection = motion.section;
const MotionDiv = framerMotion.div;

function UserModal({ isOpen, onClose, onSave, draft, setDraft, title }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <MotionDiv
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    <MotionDiv
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="fixed left-1/2 top-1/2 z-50 w-[min(520px,92vw)] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-2xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-slate-900">{title}</h2>
                            <button type="button" onClick={onClose} className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100">
                                <UserCog className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="mt-6 grid gap-4 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <label className="text-sm font-medium text-slate-700">Name</label>
                                <input
                                    value={draft.name}
                                    onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
                                    className="mt-2 h-12 w-full border-0 border-b-2 border-slate-200 bg-transparent px-0 text-sm text-slate-800 focus:border-[#2563EB] focus:outline-none"
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label className="text-sm font-medium text-slate-700">Email</label>
                                <input
                                    value={draft.email}
                                    onChange={(event) => setDraft((current) => ({ ...current, email: event.target.value }))}
                                    className="mt-2 h-12 w-full border-0 border-b-2 border-slate-200 bg-transparent px-0 text-sm text-slate-800 focus:border-[#2563EB] focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-700">Role</label>
                                <select
                                    value={draft.role}
                                    onChange={(event) => setDraft((current) => ({ ...current, role: event.target.value }))}
                                    className="mt-2 h-12 w-full border-0 border-b-2 border-slate-200 bg-transparent px-0 text-sm text-slate-800 focus:border-[#2563EB] focus:outline-none"
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-700">Status</label>
                                <select
                                    value={draft.active ? 'active' : 'inactive'}
                                    onChange={(event) => setDraft((current) => ({ ...current, active: event.target.value === 'active' }))}
                                    className="mt-2 h-12 w-full border-0 border-b-2 border-slate-200 bg-transparent px-0 text-sm text-slate-800 focus:border-[#2563EB] focus:outline-none"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button type="button" onClick={onClose} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50">
                                Cancel
                            </button>
                            <button type="button" onClick={onSave} className="rounded-full bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1D4ED8]">
                                Save
                            </button>
                        </div>
                    </MotionDiv>
                </>
            )}
        </AnimatePresence>
    );
}

export default function UserManagement() {
    const [query, setQuery] = useState('');
    const [users, setUsers] = useState([]);
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [pendingAction, setPendingAction] = useState(null);
    const [draft, setDraft] = useState({
        id: null,
        name: '',
        email: '',
        role: 'user',
        active: true,
    });

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
                if (isMounted) setLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    const filtered = useMemo(() => {
        const normalizedQuery = query.toLowerCase().trim();
        if (!normalizedQuery) return users;

        return users.filter((user) =>
            user.name.toLowerCase().includes(normalizedQuery)
            || user.department?.toLowerCase().includes(normalizedQuery)
            || user.email.toLowerCase().includes(normalizedQuery)
        );
    }, [query, users]);

    const statsByUser = useMemo(() => {
        const map = new Map();
        certificates.forEach((certificate) => {
            const key = certificate.owner?.id ?? certificate.userId;
            if (!key) return;
            const current = map.get(key) ?? { total: 0, active: 0 };
            current.total += 1;
            if (certificate.status === 'active') current.active += 1;
            map.set(key, current);
        });
        return map;
    }, [certificates]);

    const openAddModal = () => {
        setEditingUser(null);
        setDraft({ id: null, name: '', email: '', role: 'user', active: true });
        setModalOpen(true);
    };

    const openEditModal = (user) => {
        setEditingUser(user);
        setDraft({
            id: user.id,
            name: user.name ?? '',
            email: user.email ?? '',
            role: user.role ?? 'user',
            active: user.active ?? true,
        });
        setModalOpen(true);
    };

    const saveDraft = () => {
        if (!draft.name.trim() || !draft.email.trim()) {
            toast.error('Name and email are required.');
            return;
        }

        if (editingUser) {
            setUsers((previous) => previous.map((user) => (
                user.id === editingUser.id ? { ...user, ...draft } : user
            )));
            toast.success(`Updated ${draft.name}.`);
        } else {
            setUsers((previous) => [
                {
                    ...draft,
                    id: `temp-${Date.now()}`,
                    designation: 'New User',
                    department: 'Unassigned',
                },
                ...previous,
            ]);
            toast.success(`Added ${draft.name}.`);
        }

        setModalOpen(false);
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
                        <p className="section-label">User Management</p>
                        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                            <span>People and </span>
                            <span className="text-[#2563EB]">roles</span>
                        </h1>
                        <p className="mt-2 text-sm font-light leading-7 text-slate-500">
                            Manage user access, visibility, and admin privileges from a single responsive table.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={openAddModal}
                        className="inline-flex items-center gap-2 rounded-full bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1D4ED8]"
                    >
                        <Plus className="h-4 w-4" />
                        Add User
                    </button>
                </MotionSection>

                <MotionSection variants={listItemVariants} className="rounded-xl border border-slate-200 bg-white p-4 shadow-md">
                    <div className="relative">
                        <Search className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by name, email, or department"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            className="h-12 w-full border-0 border-b-2 border-slate-200 bg-transparent pl-7 pr-4 text-sm text-slate-800 focus:border-[#2563EB] focus:outline-none"
                        />
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold text-slate-500">
                        <span className="rounded-full bg-slate-100 px-3 py-1">{filtered.length} shown</span>
                        <span className="rounded-full bg-slate-100 px-3 py-1">{users.length} total users</span>
                    </div>
                </MotionSection>

                {filtered.length === 0 ? (
                    <EmptyState title="No users found" message="Try adjusting your search." />
                ) : (
                    <MotionSection variants={listItemVariants} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md">
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left">
                                <thead className="border-b border-slate-200 bg-slate-50">
                                    <tr>
                                        {['Avatar', 'Name', 'Email', 'Role', 'Status', 'Actions'].map((header) => (
                                            <th key={header} className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filtered.map((user) => {
                                        const initials = getInitials(user.name);
                                        const bgColor = avatarColor(user.name);
                                        const stats = statsByUser.get(user.id) ?? { total: 0, active: 0 };

                                        return (
                                            <tr key={user.id} className="hover:bg-slate-50/80">
                                                <td className="px-4 py-4">
                                                    {user.avatar ? (
                                                        <img src={user.avatar} alt={user.name} className="h-10 w-10 rounded-full object-cover" />
                                                    ) : (
                                                        <span className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white ${bgColor}`}>
                                                            {initials}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                                                    <p className="mt-1 text-xs text-slate-500">{stats.total} certs • {stats.active} active</p>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                                        <Mail className="h-3.5 w-3.5 text-slate-400" />
                                                        {user.email}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${
                                                        user.role === 'admin' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'
                                                    }`}>
                                                        {user.role === 'admin' ? 'Admin' : 'User'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${
                                                        user.active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                                                    }`}>
                                                        {user.active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex flex-wrap gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => openEditModal(user)}
                                                            className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:border-blue-200 hover:text-blue-600"
                                                        >
                                                            <Pencil className="h-3.5 w-3.5" />
                                                            Edit
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setPendingAction({ type: 'disable', user })}
                                                            className="inline-flex items-center gap-1 rounded-full border border-amber-200 px-3 py-2 text-xs font-semibold text-amber-600 transition-colors hover:bg-amber-50"
                                                        >
                                                            <UserMinus className="h-3.5 w-3.5" />
                                                            Disable
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setPendingAction({ type: 'delete', user })}
                                                            className="inline-flex items-center gap-1 rounded-full border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </MotionSection>
                )}

                <UserModal
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    onSave={saveDraft}
                    draft={draft}
                    setDraft={setDraft}
                    title={editingUser ? 'Edit User' : 'Add User'}
                />

                <ConfirmModal
                    isOpen={!!pendingAction}
                    onClose={() => setPendingAction(null)}
                    onConfirm={() => {
                        if (!pendingAction) return;
                        if (pendingAction.type === 'disable') {
                            setUsers((previous) => previous.map((user) => (
                                user.id === pendingAction.user.id ? { ...user, active: false } : user
                            )));
                            toast.success(`${pendingAction.user.name} disabled.`);
                        }
                        if (pendingAction.type === 'delete') {
                            setUsers((previous) => previous.filter((user) => user.id !== pendingAction.user.id));
                            toast.success(`${pendingAction.user.name} deleted from the list.`);
                        }
                        setPendingAction(null);
                    }}
                    title={pendingAction?.type === 'disable' ? 'Disable User' : 'Delete User'}
                    description={pendingAction ? `Confirm ${pendingAction.type} for ${pendingAction.user.name}?` : ''}
                    confirmLabel={pendingAction?.type === 'disable' ? 'Disable' : 'Delete'}
                />
            </motion.div>
        </PageWrapper>
    );
}
