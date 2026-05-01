import PublicNavbar from './PublicNavbar';
import PublicFooter from './PublicFooter';

export default function PublicLayout({ children, className = '' }) {
    return (
        <div className={`min-h-screen public-app-shell ${className}`}>
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="public-grid absolute inset-0 opacity-60 dark:opacity-30" />
                <div className="absolute left-[-10%] top-0 h-72 w-72 rounded-full bg-[rgba(31,94,255,0.12)] blur-3xl dark:bg-[rgba(116,178,255,0.10)]" />
                <div className="absolute right-[-4%] top-[12%] h-80 w-80 rounded-full bg-[rgba(77,167,255,0.16)] blur-3xl dark:bg-[rgba(116,178,255,0.14)]" />
            </div>
            <PublicNavbar />
            <main className="relative z-10 mx-auto w-full max-w-[1380px] px-4 sm:px-6 lg:px-8">
                {children}
            </main>
            <PublicFooter />
        </div>
    );
}
