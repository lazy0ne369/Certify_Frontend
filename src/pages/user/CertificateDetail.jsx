import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShieldCheck, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { useCertStore } from '../../store/certStore';
import { staggerContainer, listItemVariants, cardVariants } from '../../animations/variants';
import PageWrapper from '../../components/layout/PageWrapper';
import QRCodeCard from '../../components/shared/QRCodeCard';
import CertDetailLeft from './CertDetailLeft';

export default function CertificateDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const cert = useCertStore((state) => state.getCertById(id));
    const fetchCertificateById = useCertStore((state) => state.fetchCertificateById);
    const isLoading = useCertStore((state) => state.isLoading);
    const [loadError, setLoadError] = useState('');

    useEffect(() => {
        if (cert) {
            return;
        }

        fetchCertificateById(id).catch((error) => {
            setLoadError(error.message);
        });
    }, [cert, fetchCertificateById, id]);

    const verifyUrl = `https://certtrack.app/verify/${id}`;

    if (!cert && isLoading) {
        return (
            <PageWrapper>
                <div className="flex items-center justify-center py-24">
                    <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                </div>
            </PageWrapper>
        );
    }

    if (!cert && loadError) {
        return (
            <PageWrapper>
                <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Certificate not found.</p>
                    <button
                        onClick={() => navigate('/user/certifications')}
                        className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                        Back to My Certifications
                    </button>
                </div>
            </PageWrapper>
        );
    }

    if (!cert) {
        return null;
    }

    return (
        <PageWrapper>
            <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-6"
            >
                <motion.button
                    variants={listItemVariants}
                    onClick={() => navigate('/user/certifications')}
                    className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to My Certifications
                </motion.button>

                <motion.div
                    variants={listItemVariants}
                    className="grid grid-cols-1 lg:grid-cols-5 gap-6"
                >
                    <div className="lg:col-span-3">
                        <CertDetailLeft cert={cert} />
                    </div>

                    <div className="lg:col-span-2 space-y-4">
                        <motion.div variants={cardVariants}>
                            <QRCodeCard certId={cert.id} certTitle={cert.title} />
                        </motion.div>

                        <motion.div
                            variants={cardVariants}
                            className="rounded-xl shadow-md bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-5 space-y-3"
                        >
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                <h3 className="text-sm font-semibold text-gray-800 dark:text-white">Verify Certificate</h3>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                                Scan the QR code or use the link below to verify the authenticity of this certificate.
                            </p>

                            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                                <p className="text-xs text-indigo-600 dark:text-indigo-400 break-all flex-1 select-all font-mono">
                                    {verifyUrl}
                                </p>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(verifyUrl);
                                        toast.success('Link copied!');
                                    }}
                                    className="shrink-0 p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                    title="Copy link"
                                >
                                    <Copy className="w-3.5 h-3.5 text-gray-400" />
                                </button>
                            </div>

                            <div className="flex items-center gap-2 text-xs">
                                <span className={`w-2 h-2 rounded-full ${
                                    cert.status === 'active'
                                        ? 'bg-emerald-500'
                                        : cert.status === 'expiring_soon'
                                            ? 'bg-amber-500'
                                            : 'bg-red-500'
                                }`} />
                                <span className="text-gray-500 dark:text-gray-400">
                                    {cert.status === 'active'
                                        ? 'Certificate is valid and active'
                                        : cert.status === 'expiring_soon'
                                            ? 'Certificate is expiring soon'
                                            : 'Certificate has expired'}
                                </span>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </motion.div>
        </PageWrapper>
    );
}
