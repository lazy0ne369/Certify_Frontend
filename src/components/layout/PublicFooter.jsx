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
            <div className="overflow-hidden rounded-[32px] bg-[linear-gradient(135deg,#0f172a_0%,#152a52_55%,#1f5eff_100%)] px-6 py-8 text-white shadow-[0_28px_60px_rgba(15,23,42,0.24)] sm:px-8">
                <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent)] shadow-[0_18px_36px_rgba(31,94,255,0.28)]">
                                <ShieldCheck className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <p className="text-lg font-semibold tracking-tight text-white">Certify</p>
                                <p className="text-sm text-slate-300">Certification tracking for users and compliance teams.</p>
                            </div>
                        </div>
                        <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300">
                            Keep credentials organized, spot renewals before deadlines, and give admins a simple view
                            of coverage across departments.
                        </p>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#bfdbfe]">Explore</p>
                            <div className="mt-4 flex flex-col gap-3">
                                {FOOTER_LINKS.map((link) => (
                                    <Link
                                        key={link.to}
                                        to={link.to}
                                        className="inline-flex items-center gap-2 text-sm font-medium text-white transition-colors hover:text-[#dbeafe]"
                                    >
                                        {link.label}
                                        <ArrowUpRight className="h-3.5 w-3.5" />
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#bfdbfe]">Core Use</p>
                            <div className="mt-4 space-y-3 text-sm text-slate-300">
                                <p>User profile and certification records</p>
                                <p>Renewal tracking and alerts</p>
                                <p>Admin monitoring and compliance review</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-5 text-xs text-slate-300 sm:flex-row sm:items-center sm:justify-between">
                    <p>Built to keep certification status visible and actionable.</p>
                    <p>FSAD Certify</p>
                </div>
            </div>
        </footer>
    );
}
