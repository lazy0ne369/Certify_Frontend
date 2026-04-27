import PublicLayout from '../components/layout/PublicLayout';
import Button from '../components/ui/Button';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Contact() {
    const navigate = useNavigate();

    return (
        <PublicLayout>
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="mx-auto mt-8 max-w-screen-md rounded-[2rem] bg-white/95 p-10 shadow-[0_24px_60px_rgba(43,29,28,0.16)] dark:bg-slate-950/95"
            >
                <h1 className="text-4xl font-semibold text-[var(--public-text)]">Contact Us</h1>
                <p className="mt-4 text-base leading-7 public-muted">
                    If you have a question or need help with your certifications, reach out to our support team. We’ll respond as soon as possible.
                </p>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-3xl border border-[var(--public-border)] bg-[var(--public-surface)] p-6">
                        <p className="text-sm font-semibold text-[var(--public-text)]">Email</p>
                        <p className="mt-3 text-sm public-muted">support@certify.app</p>
                    </div>
                    <div className="rounded-3xl border border-[var(--public-border)] bg-[var(--public-surface)] p-6">
                        <p className="text-sm font-semibold text-[var(--public-text)]">Phone</p>
                        <p className="mt-3 text-sm public-muted">+1 (555) 123-4567</p>
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
