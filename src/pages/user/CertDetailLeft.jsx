import { createElement, useState } from 'react';
import { toast } from 'sonner';
import {
    Award,
    Briefcase,
    Building2,
    Calendar,
    Download,
    FileText,
    Hash,
    Share2,
} from 'lucide-react';
import StatusBadge from '../../components/shared/StatusBadge';
import CountdownTimer from '../../components/shared/CountdownTimer';
import PDFViewer from '../../components/shared/PDFViewer';
import { formatDate } from '../../utils/dateUtils';

const CAT_COLORS = {
    Cloud: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
    DevOps: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
    Data: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
    Frontend: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
};

const BORDER_COLOR = {
    active: 'border-t-emerald-500',
    expiring_soon: 'border-t-amber-500',
    expired: 'border-t-red-500',
};

function DetailRow({ icon, label, value }) {
    if (!value) return null;

    return (
        <div className="flex flex-col gap-0.5">
            <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">{label}</p>
            <p className="flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300">
                {icon ? createElement(icon, { className: 'h-3.5 w-3.5 shrink-0 text-gray-400' }) : null}
                {value}
            </p>
        </div>
    );
}

export default function CertDetailLeft({ cert }) {
    const [pdfOpen, setPdfOpen] = useState(false);
    const borderTop = BORDER_COLOR[cert.status] ?? 'border-t-gray-300';
    const catColor = CAT_COLORS[cert.category] ?? 'bg-gray-100 text-gray-600';
    const verifyUrl = `https://certtrack.app/verify/${cert.id}`;

    const handleShare = () => {
        navigator.clipboard.writeText(verifyUrl).then(() => {
            toast.success('Link copied to clipboard!');
        });
    };

    const handleDownload = () => {
        if (cert.certificateUrl) {
            const link = document.createElement('a');
            link.href = cert.certificateUrl;
            link.download = `${cert.title.replace(/\s+/g, '_')}_certificate`;
            link.target = '_blank';
            link.click();
        } else {
            toast.error('No certificate file available to download.');
        }
    };

    return (
        <div className={`overflow-hidden rounded-xl border border-gray-100 border-t-4 ${borderTop} bg-white shadow-md dark:border-gray-800 dark:bg-gray-900`}>
            <div className="flex h-44 items-center justify-center bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-gray-800 dark:to-gray-700">
                {cert.badgeUrl ? (
                    <img
                        src={cert.badgeUrl}
                        alt={cert.title}
                        className="h-32 w-32 rounded-xl object-contain drop-shadow-lg"
                        onError={(event) => {
                            event.currentTarget.style.display = 'none';
                        }}
                    />
                ) : (
                    <Award className="h-24 w-24 text-indigo-300 dark:text-indigo-600" />
                )}
            </div>

            <div className="space-y-5 p-6">
                <div>
                    <h1 className="text-2xl font-bold leading-tight text-gray-900 dark:text-white">{cert.title}</h1>
                    <p className="mt-1.5 flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                        <Building2 className="h-4 w-4 shrink-0" />
                        {cert.organization}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={cert.status} />
                    <CountdownTimer expiryDate={cert.expiryDate} />
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${catColor}`}>
                        {cert.category}
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-4 border-b border-t border-gray-100 py-4 dark:border-gray-800">
                    <DetailRow icon={Hash} label="Credential ID" value={cert.credentialId} />
                    <DetailRow icon={Briefcase} label="Department" value={cert.department} />
                    <DetailRow icon={Calendar} label="Issue Date" value={formatDate(cert.issueDate)} />
                    <DetailRow icon={Calendar} label="Expiry Date" value={formatDate(cert.expiryDate)} />
                </div>

                {cert.description && (
                    <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">{cert.description}</p>
                )}

                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setPdfOpen(true)}
                        className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
                    >
                        <FileText className="h-4 w-4" />
                        View Certificate
                    </button>
                    <button
                        onClick={handleDownload}
                        className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                    >
                        <Download className="h-4 w-4" />
                        Download
                    </button>
                    <button
                        onClick={handleShare}
                        className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                    >
                        <Share2 className="h-4 w-4" />
                        Share
                    </button>
                </div>
            </div>

            <PDFViewer
                isOpen={pdfOpen}
                onClose={() => setPdfOpen(false)}
                fileUrl={cert.certificateUrl}
                fileName={`${cert.title} - Certificate`}
                verifyValue={verifyUrl}
            />
        </div>
    );
}
