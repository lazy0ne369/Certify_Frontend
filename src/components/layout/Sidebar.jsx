/**
 * Sidebar.jsx — FSAD-PS34
 * Role-based navigation sidebar with mobile collapse, sidebarVariants animation.
 */

import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, Award, PlusCircle, User,
    Users, FileBarChart, X, ChevronRight,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import { sidebarVariants } from '../../animations/variants';

const USER_LINKS = [
    { to: '/user/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/user/certifications', label: 'My Certifications', icon: Award },
    { to: '/user/certifications/add', label: 'Add Certification', icon: PlusCircle },
    { to: '/user/profile', label: 'Profile', icon: User },
];

const ADMIN_LINKS = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/certifications', label: 'All Certifications', icon: Award },
    { to: '/admin/users', label: 'User Management', icon: Users },
    { to: '/admin/reports', label: 'Expiry Reports', icon: FileBarChart },
];

function SidebarContent({ onClose }) {
    const { user } = useAuthStore();
    const links = user?.role === 'admin' ? ADMIN_LINKS : USER_LINKS;

    return (
        <div className="dashboard-sidebar flex h-full flex-col text-white">
            {onClose && (
                <div className="flex items-center justify-between px-4 pt-4 pb-2 lg:hidden">
                    <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">Menu</span>
                    <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white">
                        <X className="h-5 w-5" />
                    </button>
                </div>
            )}

            <div className="border-b border-white/10 px-4 pt-5 pb-4">
                <span className="mb-4 inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#93C5FD]">
                    <ChevronRight className="h-3 w-3" />
                    {user?.role === 'admin' ? 'Admin Panel' : 'My Account'}
                </span>
                <p className="text-lg font-semibold text-white">Certify Workspace</p>
                <p className="mt-1 text-sm text-slate-400">Track credentials, deadlines, and team progress.</p>
            </div>

            <nav className="flex-1 space-y-1 px-3 py-4">
                {links.map(({ to, label, icon: Icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={to.endsWith('dashboard')}
                        onClick={onClose ?? undefined}
                        className={({ isActive }) =>
                            [
                                'dashboard-sidebar-link text-sm font-medium',
                                isActive ? 'is-active' : '',
                            ].join(' ')
                        }
                    >
                        {({ isActive }) => (
                            <>
                                {isActive && (
                                    <motion.div
                                        layoutId="sidebar-active"
                                        className="absolute inset-0 rounded-[18px] bg-[linear-gradient(135deg,#2563EB_0%,#1D4ED8_100%)]"
                                        transition={{ type: 'spring', stiffness: 380, damping: 35 }}
                                    />
                                )}
                                <Icon className="relative h-4 w-4 shrink-0" />
                                <span className="relative">{label}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className="border-t border-white/10 p-4">
                <p className="truncate text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Signed in as</p>
                <p className="mt-2 truncate text-sm font-semibold text-white">{user?.name}</p>
                <p className="truncate text-xs text-slate-400">{user?.designation}</p>
            </div>
        </div>
    );
}

export default function Sidebar() {
    const { sidebarOpen, setSidebarOpen } = useUIStore();

    return (
        <>
            <aside className="dashboard-sidebar sticky top-16 hidden h-[calc(100vh-4rem)] w-72 shrink-0 flex-col border-r border-white/8 shadow-[24px_0_48px_rgba(15,23,42,0.18)] lg:flex">
                <SidebarContent />
            </aside>

            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
                            onClick={() => setSidebarOpen(false)}
                        />

                        <motion.aside
                            variants={sidebarVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="dashboard-sidebar fixed top-0 left-0 z-40 h-full w-72 border-r border-white/8 shadow-2xl lg:hidden"
                        >
                            <SidebarContent onClose={() => setSidebarOpen(false)} />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
