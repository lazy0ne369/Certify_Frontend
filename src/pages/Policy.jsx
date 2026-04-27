import PublicLayout from '../components/layout/PublicLayout';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Policy() {
    const navigate = useNavigate();

    return (
        <PublicLayout>
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="mx-auto mt-8 max-w-screen-md rounded-[2rem] bg-white/95 p-10 shadow-[0_24px_60px_rgba(43,29,28,0.16)] dark:bg-slate-950/95"
            >
                <h1 className="text-4xl font-semibold text-[var(--public-text)]">Privacy Policy</h1>
                <p className="mt-4 text-base leading-7 public-muted">
                    We care about your data. This policy outlines how Certify handles personal information, authentication details, and certificate records.
                </p>
                <div className="mt-8 space-y-5 rounded-3xl border border-[var(--public-border)] bg-[var(--public-surface)] p-6">
                    <div>
                        <h2 className="text-lg font-semibold text-[var(--public-text)]">Data use</h2>
                        <p className="mt-3 text-sm public-muted">We only use your profile and certificate data to power the application and keep your account in sync.</p>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-[var(--public-text)]">Security</h2>
                        <p className="mt-3 text-sm public-muted">Credentials are sent to the backend for authentication and are never exposed in client-side logs.</p>
                    </div>
                </div>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                    <Button onClick={() => navigate('/')} variant="outline" size="md">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to home
                    </Button>
                </div>
            </motion.div>
        </PublicLayout>
    );
}
