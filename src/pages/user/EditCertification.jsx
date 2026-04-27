import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Pencil } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCertStore } from '../../store/certStore';
import PageWrapper from '../../components/layout/PageWrapper';
import CertForm from '../../components/ui/CertForm';
import { listItemVariants } from '../../animations/variants';

export default function EditCertification() {
    const { id } = useParams();
    const navigate = useNavigate();
    const cert = useCertStore((state) => state.getCertById(id));
    const fetchCertificateById = useCertStore((state) => state.fetchCertificateById);
    const saveCertificate = useCertStore((state) => state.updateCertificate);
    const isLoading = useCertStore((state) => state.isLoading);
    const [loading, setLoading] = useState(false);
    const [loadError, setLoadError] = useState('');

    useEffect(() => {
        if (cert) {
            return;
        }

        fetchCertificateById(id).catch((error) => {
            setLoadError(error.message);
        });
    }, [cert, fetchCertificateById, id]);

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
                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Certification not found.</p>
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

    const defaultValues = {
        title: cert.title ?? '',
        organization: cert.organization ?? '',
        issueDate: cert.issueDate ?? '',
        expiryDate: cert.expiryDate ?? '',
        category: cert.category ?? '',
        credentialId: cert.credentialId ?? '',
        description: cert.description ?? '',
    };

    const handleSubmit = async (data) => {
        setLoading(true);

        try {
            await saveCertificate(id, {
                ...data,
                badgeUrl: cert.badgeUrl ?? '',
                certificateUrl: cert.certificateUrl ?? '',
            });
            toast.success('Certification updated successfully!');
            navigate('/user/certifications');
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
                        <Pencil className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </span>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Edit Certification</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">{cert.title}</p>
                    </div>
                </div>
            </motion.div>

            <CertForm
                defaultValues={defaultValues}
                onSubmit={handleSubmit}
                onCancel={() => navigate('/user/certifications')}
                loading={loading}
                submitLabel="Save Changes"
            />
        </PageWrapper>
    );
}
