import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { FileBarChart, Download, FileDown } from 'lucide-react';
import { getAllCertificates } from '../../services/adminService';
import { getDaysRemaining } from '../../utils/certHelpers';
import { formatDate } from '../../utils/dateUtils';
import { staggerContainer, listItemVariants } from '../../animations/variants';
import PageWrapper from '../../components/layout/PageWrapper';
import ExpiryTable from './ExpiryTable';
import RenewalCalendar from '../../components/calendar/RenewalCalendar';

const TABS = [
    { label: 'All', days: null },
    { label: 'Next 30 Days', days: 30 },
    { label: 'Next 60 Days', days: 60 },
    { label: 'Next 90 Days', days: 90 },
];

export default function ExpiryReports() {
    const [activeTab, setActiveTab] = useState(0);
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        getAllCertificates()
            .then((data) => {
                if (isMounted) {
                    setCertificates(data);
                }
            })
            .catch((error) => {
                if (isMounted) {
                    toast.error(error.message);
                }
            })
            .finally(() => {
                if (isMounted) {
                    setLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, []);

    const filtered = useMemo(() => {
        const daysWindow = TABS[activeTab].days;
        const sortedCertificates = [...certificates].sort((left, right) => new Date(left.expiryDate) - new Date(right.expiryDate));

        if (!daysWindow) {
            return sortedCertificates;
        }

        return sortedCertificates.filter((certificate) => {
            const days = getDaysRemaining(certificate.expiryDate);
            return days >= 0 && days <= daysWindow;
        });
    }, [activeTab, certificates]);

    const handleExcelExport = () => {
        const rows = filtered.map((certificate) => ({
            User: certificate.owner?.name ?? '-',
            Certificate: certificate.title,
            Organization: certificate.organization,
            'Expiry Date': formatDate(certificate.expiryDate),
            'Days Left': getDaysRemaining(certificate.expiryDate),
            Status: certificate.status,
        }));
        const worksheet = XLSX.utils.json_to_sheet(rows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Expiry Report');
        XLSX.writeFile(workbook, 'certtrack_expiry_report.xlsx');
        toast.success('Excel report downloaded!');
    };

    const handlePDFExport = () => {
        const rows = filtered.map((certificate) => `
            <tr>
                <td>${certificate.owner?.name ?? '-'}</td>
                <td>${certificate.title}</td>
                <td>${certificate.organization}</td>
                <td>${formatDate(certificate.expiryDate)}</td>
                <td>${getDaysRemaining(certificate.expiryDate)} days</td>
                <td>${certificate.status}</td>
            </tr>
        `).join('');

        const html = `<!DOCTYPE html><html><head><title>Expiry Report</title>
            <style>
                body { font-family: sans-serif; padding: 24px; font-size: 12px; }
                h2 { color: #4338ca; }
                table { border-collapse: collapse; width: 100%; }
                th, td { border: 1px solid #e5e7eb; padding: 8px; text-align: left; }
                th { background: #f3f4f6; font-weight: 600; }
                @media print { body { -webkit-print-color-adjust: exact; } }
            </style></head><body>
            <h2>CertTrack - Expiry Report</h2>
            <p>Filter: ${TABS[activeTab].label} | Generated: ${new Date().toLocaleDateString()}</p>
            <table>
                <thead><tr><th>User</th><th>Certificate</th><th>Organization</th><th>Expiry</th><th>Days Left</th><th>Status</th></tr></thead>
                <tbody>${rows}</tbody>
            </table></body></html>`;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.print();
        toast.success('PDF export opened!');
    };

    if (loading) {
        return (
            <PageWrapper>
                <div className="space-y-6">
                    <div className="h-8 w-56 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    <div className="h-10 w-80 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    <div className="h-72 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
                </div>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper>
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
                <motion.div variants={listItemVariants}>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-900/40">
                                <FileBarChart className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            </span>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Expiry Reports</h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {filtered.length} cert{filtered.length !== 1 ? 's' : ''} in view
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleExcelExport}
                                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                            >
                                <Download className="w-3.5 h-3.5" /> Excel
                            </button>
                            <button
                                onClick={handlePDFExport}
                                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                            >
                                <FileDown className="w-3.5 h-3.5" /> PDF
                            </button>
                        </div>
                    </div>
                </motion.div>

                <motion.div variants={listItemVariants} className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl w-fit">
                    {TABS.map((tab, index) => (
                        <button
                            key={tab.label}
                            onClick={() => setActiveTab(index)}
                            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                                index === activeTab
                                    ? 'bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </motion.div>

                <motion.div variants={listItemVariants}>
                    <ExpiryTable certs={filtered} />
                </motion.div>

                <motion.div variants={listItemVariants}>
                    <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Expiry Calendar</h2>
                    <RenewalCalendar certificates={certificates} />
                </motion.div>
            </motion.div>
        </PageWrapper>
    );
}
