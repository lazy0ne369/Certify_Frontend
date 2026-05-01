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
            <div
                className="overflow-hidden rounded-[32px] border px-6 py-8 text-[var(--text)] sm:px-8"
                style={{
                    borderColor: 'var(--public-cta-border)',
                    background: 'var(--public-footer-bg)',
                    boxShadow: 'var(--public-footer-shadow)',
                }}
            >
                <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent)] shadow-[0_18px_36px_rgba(31,94,255,0.28)]">
                                <ShieldCheck className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <p className="text-lg font-semibold tracking-tight text-[var(--text)] dark:text-white">Certify</p>
                                <p className="text-sm text-[var(--muted)] dark:text-slate-300">A calmer way to manage credentials, renewals, and compliance.</p>
                            </div>
                        </div>
                        <p className="mt-5 max-w-xl text-sm leading-7 text-[var(--muted)] dark:text-slate-300">
                            Built for teams that need one reliable place to manage certification evidence, expiry
                            timelines, and visibility across the organization.
                        </p>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)] dark:text-[#bfdbfe]">Explore</p>
                            <div className="mt-4 flex flex-col gap-3">
                                {FOOTER_LINKS.map((link) => (
                                    <Link
                                        key={link.to}
                                        to={link.to}
                                        className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text)] transition-colors hover:text-[var(--accent)] dark:text-white dark:hover:text-[#dbeafe]"
                                    >
                                        {link.label}
                                        <ArrowUpRight className="h-3.5 w-3.5" />
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)] dark:text-[#bfdbfe]">Core Use</p>
                            <div className="mt-4 space-y-3 text-sm text-[var(--muted)] dark:text-slate-300">
                                <p>Credential records with ownership</p>
                                <p>Expiry tracking and reminders</p>
                                <p>Compliance visibility for admins</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex flex-col gap-3 border-t border-[rgba(15,23,42,0.08)] pt-5 text-xs text-[var(--muted)] dark:border-white/10 dark:text-slate-300 sm:flex-row sm:items-center sm:justify-between">
                    <p>Built to keep certification status visible and actionable.</p>
                    <p>FSAD Certify</p>
                </div>
            </div>
        </footer>
    );
}
