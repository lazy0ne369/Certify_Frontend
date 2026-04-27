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
        <div className="flex h-full flex-col">
            {onClose && (
                <div className="flex items-center justify-between px-4 pt-4 pb-2 lg:hidden">
                    <span className="text-xs font-semibold uppercase tracking-widest dashboard-panel-text">Menu</span>
                    <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-white/60 dark:hover:bg-white/6">
                        <X className="h-5 w-5 dashboard-panel-text" />
                    </button>
                </div>
            )}

            <div className="px-4 pt-4 pb-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-[#efe2d3] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#861c1c] dark:bg-[#2c201c] dark:text-[#f4b34f]">
                    <ChevronRight className="h-3 w-3" />
                    {user?.role === 'admin' ? 'Admin Panel' : 'My Account'}
                </span>
            </div>

            <nav className="flex-1 space-y-1 px-3 py-2">
                {links.map(({ to, label, icon: Icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={to.endsWith('dashboard')}
                        onClick={onClose ?? undefined}
                        className={({ isActive }) =>
                            [
                                'relative flex items-center gap-3 overflow-hidden rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-150',
                                isActive
                                    ? 'text-[#861c1c] dark:text-[#f4b34f]'
                                    : 'dashboard-panel-text hover:bg-white/60 dark:hover:bg-white/6 hover:text-[var(--public-text)] dark:hover:text-white',
                            ].join(' ')
                        }
                    >
                        {({ isActive }) => (
                            <>
                                {isActive && (
                                    <motion.div
                                        layoutId="sidebar-active"
                                        className="absolute inset-0 rounded-xl bg-[#f0dfd0] dark:bg-[#30221e]"
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

            <div className="border-t border-[rgba(120,85,57,0.12)] p-4 dark:border-[rgba(236,203,182,0.08)]">
                <p className="truncate text-xs font-semibold dashboard-panel-title">{user?.name}</p>
                <p className="truncate text-xs dashboard-panel-text">{user?.designation}</p>
            </div>
        </div>
    );
}

export default function Sidebar() {
    const { sidebarOpen, setSidebarOpen } = useUIStore();

    return (
        <>
            <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 flex-col border-r border-[rgba(120,85,57,0.12)] bg-[rgba(255,249,241,0.78)] backdrop-blur-md dark:border-[rgba(236,203,182,0.08)] dark:bg-[rgba(24,18,17,0.88)] lg:flex">
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
                            className="fixed top-0 left-0 z-40 h-full w-72 border-r border-[rgba(120,85,57,0.12)] bg-[rgba(255,249,241,0.96)] shadow-2xl dark:border-[rgba(236,203,182,0.08)] dark:bg-[rgba(24,18,17,0.96)] lg:hidden"
                        >
                            <SidebarContent onClose={() => setSidebarOpen(false)} />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
