import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Menu, Moon, ShieldCheck, Sun, X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';

const NAV_LINKS = [
    { label: 'Home', to: '/' },
    { label: 'Contact', to: '/contact' },
    { label: 'Policy', to: '/policy' },
];

function NavLinkItem({ to, label, onNavigate }) {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link
            to={to}
            onClick={onNavigate}
            className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                isActive
                    ? 'text-[var(--accent)]'
                    : 'text-[var(--muted)] hover:text-[var(--text)]'
            }`}
        >
            {label}
            {isActive && (
                <motion.span
                    layoutId="public-nav-active"
                    className="absolute inset-x-3 -bottom-0.5 h-[2px] rounded-full bg-[var(--accent)]"
                    transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                />
            )}
        </Link>
    );
}

export default function PublicNavbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { isDark, toggleTheme } = useThemeStore();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const user = useAuthStore((state) => state.user);
    const [mobileOpen, setMobileOpen] = useState(false);

    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
    const dashboardLabel = user?.role === 'admin' ? 'Admin Dashboard' : 'My Dashboard';

    return (
        <header className="relative z-20 px-4 pt-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-[1380px]">
                <div className="flex h-[78px] items-center justify-between rounded-[28px] border border-slate-200 bg-white px-4 shadow-md sm:px-5">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2563EB] shadow-[0_18px_36px_rgba(37,99,235,0.2)]">
                            <ShieldCheck className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <p className="text-base font-semibold tracking-tight text-[#111827]">Certify</p>
                            <p className="text-xs text-[#6B7280]">Credential visibility, refined</p>
                        </div>
                    </Link>

                    <nav className="hidden items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-1 md:flex">
                        {NAV_LINKS.map((link) => (
                            <NavLinkItem key={link.to} {...link} />
                        ))}
                    </nav>

                    <div className="hidden items-center gap-3 md:flex">
                        <button
                            type="button"
                            onClick={toggleTheme}
                            aria-label="Toggle theme"
                            className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-[#6B7280] transition-colors hover:bg-slate-50 hover:text-[#111827]"
                        >
                            {isDark ? <Sun className="h-4.5 w-4.5 text-[#2563EB]" /> : <Moon className="h-4.5 w-4.5" />}
                        </button>

                        {isAuthenticated ? (
                            <button
                                type="button"
                                onClick={() => navigate('/redirect')}
                                className="inline-flex items-center gap-2 rounded-full bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 hover:bg-[#1D4ED8]"
                            >
                                {dashboardLabel}
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        ) : isAuthPage ? (
                            <button
                                type="button"
                                onClick={() => navigate(location.pathname === '/login' ? '/register' : '/login')}
                                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-[#111827] transition-colors hover:bg-slate-50"
                            >
                                {location.pathname === '/login' ? 'Create account' : 'Sign in'}
                            </button>
                        ) : (
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => navigate('/login')}
                                    className="rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-[#111827] transition-colors hover:bg-slate-50"
                                >
                                    Login
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate('/register')}
                                    className="inline-flex items-center gap-2 rounded-full bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(37,99,235,0.18)] transition-transform hover:-translate-y-0.5 hover:bg-[#1D4ED8]"
                                >
                                    Get started
                                    <ArrowRight className="h-4 w-4" />
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2 md:hidden">
                        <button
                            type="button"
                            onClick={toggleTheme}
                            aria-label="Toggle theme"
                            className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-[#6B7280]"
                        >
                            {isDark ? <Sun className="h-4.5 w-4.5 text-[#2563EB]" /> : <Moon className="h-4.5 w-4.5" />}
                        </button>
                        <button
                            type="button"
                            onClick={() => setMobileOpen((current) => !current)}
                            aria-label="Toggle navigation"
                            className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-[#111827]"
                        >
                            {mobileOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
                        </button>
                    </div>
                </div>

                <AnimatePresence>
                    {mobileOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="mt-3 rounded-[28px] border border-slate-200 bg-white p-3 shadow-md md:hidden"
                        >
                            <div className="flex flex-col gap-1">
                                {NAV_LINKS.map((link) => (
                                    <NavLinkItem
                                        key={link.to}
                                        {...link}
                                        onNavigate={() => setMobileOpen(false)}
                                    />
                                ))}
                            </div>
                            <div className="mt-4 flex flex-col gap-2">
                                {isAuthenticated ? (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setMobileOpen(false);
                                            navigate('/redirect');
                                        }}
                                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white"
                                    >
                                        {dashboardLabel}
                                        <ArrowRight className="h-4 w-4" />
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setMobileOpen(false);
                                                navigate('/login');
                                            }}
                                            className="rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-[#111827]"
                                        >
                                            Login
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setMobileOpen(false);
                                                navigate('/register');
                                            }}
                                            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white"
                                        >
                                            Get started
                                            <ArrowRight className="h-4 w-4" />
                                        </button>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </header>
    );
}
