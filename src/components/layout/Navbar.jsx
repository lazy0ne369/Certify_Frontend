import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, ChevronDown, LayoutPanelLeft, LogOut, Moon, ShieldCheck, Sun, User } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { useUIStore } from '../../store/uiStore';
import { getInitials, avatarColor } from '../../utils/helpers';
import NotificationPanel from '../shared/NotificationPanel';

export default function Navbar() {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const { isDark, toggleTheme } = useThemeStore();
    const { toggleSidebar } = useUIStore();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    const profilePath = user?.role === 'admin' ? '/admin/dashboard' : '/user/profile';
    const initials = getInitials(user?.name ?? 'U');
    const bgColor = avatarColor(user?.name ?? '');
    const roleLabel = user?.role === 'admin' ? 'Admin workspace' : 'User workspace';
    const navLinks = user?.role === 'admin'
        ? [
            { to: '/admin/dashboard', label: 'Overview' },
            { to: '/admin/certifications', label: 'Certificates' },
            { to: '/admin/users', label: 'Users' },
            { to: '/admin/reports', label: 'Reports' },
        ]
        : [
            { to: '/user/dashboard', label: 'Overview' },
            { to: '/user/certifications', label: 'Certificates' },
            { to: '/user/certifications/add', label: 'Add New' },
            { to: '/user/profile', label: 'Profile' },
        ];

    return (
        <>
            <header className="dashboard-topbar px-4 py-4 sm:px-5">
                <div className="flex w-full flex-wrap items-center justify-between gap-4 xl:flex-nowrap">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={toggleSidebar}
                        aria-label="Toggle navigation"
                        className="dashboard-toolbar-button flex h-11 w-11 items-center justify-center lg:hidden"
                    >
                        <LayoutPanelLeft className="h-4.5 w-4.5" />
                    </button>

                    <Link to="/redirect" className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2563EB] shadow-[0_18px_36px_rgba(37,99,235,0.25)]">
                            <ShieldCheck className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <p className="dashboard-text text-base font-semibold tracking-tight">Certify</p>
                            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                                <span className="rounded-full bg-[#EFF6FF] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#2563EB]">
                                    {roleLabel}
                                </span>
                                <span className="dashboard-muted hidden sm:inline">{format(new Date(), 'EEEE, dd MMM yyyy')}</span>
                            </div>
                        </div>
                    </Link>
                </div>

                <div className="hidden flex-1 items-center justify-center lg:flex">
                    <nav className="dashboard-topnav">
                        {navLinks.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                end={item.to.endsWith('dashboard') || item.to.endsWith('profile')}
                                className={({ isActive }) =>
                                    `dashboard-topnav-link ${isActive ? 'is-active' : ''}`
                                }
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>
                </div>

                <div className="ml-auto flex items-center gap-2 sm:gap-3">
                    <button
                        type="button"
                        onClick={() => setNotificationsOpen(true)}
                        aria-label="Open notifications"
                        className="dashboard-toolbar-button relative flex h-11 w-11 items-center justify-center"
                    >
                        <Bell className="h-4.5 w-4.5" />
                        <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-[#2563EB]" />
                    </button>
                    <button
                        type="button"
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                        className="dashboard-toolbar-button flex h-11 w-11 items-center justify-center"
                    >
                        {isDark ? <Sun className="h-4.5 w-4.5 text-[#2563EB]" /> : <Moon className="h-4.5 w-4.5" />}
                    </button>

                    <div className="relative" ref={dropdownRef}>
                        <button
                            type="button"
                            onClick={() => setDropdownOpen((value) => !value)}
                            className="dashboard-toolbar-button flex items-center gap-3 px-2 py-1.5 text-left shadow-sm"
                        >
                            {user?.avatar ? (
                                <img src={user.avatar} alt={user.name} className="h-10 w-10 rounded-full object-cover" />
                            ) : (
                                <span className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white ${bgColor}`}>
                                    {initials}
                                </span>
                            )}
                            <div className="hidden min-w-0 sm:block">
                                <p className="dashboard-text truncate text-sm font-semibold">{user?.name}</p>
                                <p className="dashboard-muted truncate text-xs">{user?.designation}</p>
                            </div>
                            <ChevronDown className={`dashboard-muted h-4 w-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {dropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 8 }}
                                    transition={{ duration: 0.2, ease: 'easeOut' }}
                                    className="dashboard-card absolute right-0 mt-3 w-64 overflow-hidden rounded-[24px] shadow-[0_20px_48px_rgba(15,23,42,0.12)]"
                                >
                                    <div className="border-b border-[var(--line)] px-5 py-4">
                                        <p className="dashboard-text truncate text-sm font-semibold">{user?.name}</p>
                                        <p className="dashboard-muted mt-1 truncate text-xs">{user?.email}</p>
                                    </div>
                                    <Link
                                        to={profilePath}
                                        onClick={() => setDropdownOpen(false)}
                                        className="dashboard-text flex items-center gap-3 px-5 py-3.5 text-sm font-medium transition-colors hover:bg-[var(--bg-soft)]"
                                    >
                                        <User className="h-4 w-4 text-[#2563EB]" />
                                        Profile
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="flex w-full items-center gap-3 px-5 py-3.5 text-sm font-medium text-[#DC2626] transition-colors hover:bg-rose-50/80 dark:hover:bg-rose-950/30"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Logout
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
                </div>
            </header>
            <NotificationPanel isOpen={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
        </>
    );
}
