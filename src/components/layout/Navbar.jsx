import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, LayoutPanelLeft, LogOut, Moon, ShieldCheck, Sun, User } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { useUIStore } from '../../store/uiStore';
import { getInitials, avatarColor } from '../../utils/helpers';

export default function Navbar() {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const { isDark, toggleTheme } = useThemeStore();
    const { toggleSidebar } = useUIStore();
    const [dropdownOpen, setDropdownOpen] = useState(false);
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

    return (
        <header className="border-b border-[var(--line)] bg-white/44 px-4 py-4 backdrop-blur-xl dark:bg-white/[0.02] sm:px-5">
            <div className="mx-auto flex max-w-[1460px] items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={toggleSidebar}
                        aria-label="Toggle navigation"
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--line)] bg-white/56 text-[var(--text)] transition-colors hover:bg-white/80 dark:bg-white/[0.03] dark:hover:bg-white/[0.06] lg:hidden"
                    >
                        <LayoutPanelLeft className="h-4.5 w-4.5" />
                    </button>

                    <Link to="/redirect" className="flex items-center gap-3">
                        <div className="public-gradient flex h-12 w-12 items-center justify-center rounded-2xl shadow-[0_18px_36px_rgba(23,107,104,0.22)]">
                            <ShieldCheck className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <p className="text-base font-semibold tracking-tight text-[var(--text)]">Certify</p>
                            <div className="mt-1 flex items-center gap-2 text-xs">
                                <span className="dashboard-chip px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]">
                                    {roleLabel}
                                </span>
                                <span className="hidden public-muted sm:inline">{format(new Date(), 'EEEE, dd MMM yyyy')}</span>
                            </div>
                        </div>
                    </Link>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                    <button
                        type="button"
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--line)] bg-white/56 text-[var(--muted)] transition-colors hover:text-[var(--text)] dark:bg-white/[0.03]"
                    >
                        {isDark ? <Sun className="h-4.5 w-4.5 text-[var(--accent)]" /> : <Moon className="h-4.5 w-4.5" />}
                    </button>

                    <div className="relative" ref={dropdownRef}>
                        <button
                            type="button"
                            onClick={() => setDropdownOpen((value) => !value)}
                            className="flex items-center gap-3 rounded-full border border-[var(--line)] bg-white/58 px-2 py-1.5 text-left shadow-[0_12px_24px_rgba(17,24,28,0.05)] transition-colors hover:bg-white/84 dark:bg-white/[0.03] dark:hover:bg-white/[0.06]"
                        >
                            {user?.avatar ? (
                                <img src={user.avatar} alt={user.name} className="h-10 w-10 rounded-full object-cover" />
                            ) : (
                                <span className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white ${bgColor}`}>
                                    {initials}
                                </span>
                            )}
                            <div className="hidden min-w-0 sm:block">
                                <p className="truncate text-sm font-semibold text-[var(--text)]">{user?.name}</p>
                                <p className="truncate text-xs public-muted">{user?.designation}</p>
                            </div>
                            <ChevronDown className={`h-4 w-4 text-[var(--muted)] transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {dropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 8 }}
                                    transition={{ duration: 0.18 }}
                                    className="public-surface-strong absolute right-0 mt-3 w-60 overflow-hidden rounded-[24px]"
                                >
                                    <div className="border-b border-[var(--line)] px-5 py-4">
                                        <p className="truncate text-sm font-semibold text-[var(--text)]">{user?.name}</p>
                                        <p className="mt-1 truncate text-xs public-muted">{user?.email}</p>
                                    </div>
                                    <Link
                                        to={profilePath}
                                        onClick={() => setDropdownOpen(false)}
                                        className="flex items-center gap-3 px-5 py-3.5 text-sm font-medium text-[var(--text)] transition-colors hover:bg-white/68 dark:hover:bg-white/[0.04]"
                                    >
                                        <User className="h-4 w-4 text-[var(--accent)]" />
                                        Profile
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="flex w-full items-center gap-3 px-5 py-3.5 text-sm font-medium text-[var(--danger)] transition-colors hover:bg-[rgba(198,90,84,0.08)]"
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
    );
}
