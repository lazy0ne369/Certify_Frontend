import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import canvasConfetti from 'canvas-confetti';
import { useCertStore } from '../../store/certStore';
import PageWrapper from '../../components/layout/PageWrapper';
import CertForm from '../../components/ui/CertForm';
import { listItemVariants } from '../../animations/variants';

function fireConfetti() {
    const burst = (angle, spread) =>
        canvasConfetti({
            particleCount: 60,
            angle,
            spread,
            origin: { x: 0.5, y: 0.3 },
            colors: ['#4f46e5', '#818cf8', '#fbbf24', '#ffffff', '#34d399'],
            scalar: 1.1,
            zIndex: 9999,
        });

    burst(60, 70);
    setTimeout(() => burst(120, 70), 150);
}

export default function AddCertification() {
    const navigate = useNavigate();
    const addCertificate = useCertStore((state) => state.addCertificate);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (data) => {
        setLoading(true);

        try {
            await addCertificate({
                ...data,
                badgeUrl: '',
                certificateUrl: '',
            });

            fireConfetti();
            toast.success('Certification added successfully!');
            setTimeout(() => navigate('/user/certifications'), 1200);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageWrapper>
            <motion.div variants={listItemVariants} initial="hidden" animate="visible" className="mb-6">
                <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-900/40">
                        <PlusCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </span>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Add Certification</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Fill in the details and save them to MySQL.</p>
                    </div>
                </div>
            </motion.div>

            <CertForm
                onSubmit={handleSubmit}
                onCancel={() => navigate('/user/certifications')}
                loading={loading}
                submitLabel="Add Certification"
            />
        </PageWrapper>
    );
}
