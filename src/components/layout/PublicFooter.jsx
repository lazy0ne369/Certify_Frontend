import { Link } from 'react-router-dom';
import { ArrowUpRight, ShieldCheck } from 'lucide-react';

const FOOTER_LINKS = [
    { label: 'Home', to: '/' },
    { label: 'Contact', to: '/contact' },
    { label: 'Policy', to: '/policy' },
    { label: 'Login', to: '/login' },
];

export default function PublicFooter() {
    return (
        <footer className="relative mx-auto mt-10 w-full max-w-[1380px] px-4 pb-8 sm:px-6 lg:px-8">
            <div className="overflow-hidden rounded-[32px] bg-[#0F172A] px-6 py-8 text-white shadow-[0_28px_60px_rgba(15,23,42,0.24)] sm:px-8">
                <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2563EB] shadow-[0_18px_36px_rgba(37,99,235,0.28)]">
                                <ShieldCheck className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <p className="text-lg font-semibold tracking-tight text-white">Certify</p>
                                <p className="text-sm text-slate-400">Credential operations with a cleaner, calmer interface.</p>
                            </div>
                        </div>
                        <p className="mt-5 max-w-xl text-sm leading-7 text-slate-400">
                            Built for people who need visibility, renewal awareness, and clearer admin oversight
                            without the usual cluttered enterprise feel.
                        </p>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#60A5FA]">Explore</p>
                            <div className="mt-4 flex flex-col gap-3">
                                {FOOTER_LINKS.map((link) => (
                                    <Link
                                        key={link.to}
                                        to={link.to}
                                        className="inline-flex items-center gap-2 text-sm font-medium text-white transition-colors hover:text-[#93C5FD]"
                                    >
                                        {link.label}
                                        <ArrowUpRight className="h-3.5 w-3.5" />
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#60A5FA]">System Notes</p>
                            <div className="mt-4 space-y-3 text-sm text-slate-400">
                                <p>Backend: Spring Boot + MySQL</p>
                                <p>Frontend: React + Vite</p>
                                <p>Roles: User and Admin</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-5 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
                    <p>Designed around measured spacing, clearer hierarchy, and softer surfaces.</p>
                    <p>FSAD Certify</p>
                </div>
            </div>
        </footer>
    );
}
