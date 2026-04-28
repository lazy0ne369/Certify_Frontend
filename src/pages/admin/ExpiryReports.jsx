import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import {
    BellRing,
    Download,
    FileDown,
    FileBarChart,
    Filter,
} from 'lucide-react';
import { getAllCertificates } from '../../services/adminService';
import { getDaysRemaining } from '../../utils/certHelpers';
import PageWrapper from '../../components/layout/PageWrapper';
import EmptyState from '../../components/shared/EmptyState';
import { listItemVariants, staggerContainer } from '../../animations/variants';

const MotionSection = motion.section;

function SummaryCard({ label, value, tone }) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-md">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{label}</p>
            <p className={`mt-3 text-3xl font-bold ${tone}`}>{value}</p>
        </div>
    );
}

export default function ExpiryReports() {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [department, setDepartment] = useState('');
    const [status, setStatus] = useState('');

    useEffect(() => {
        let isMounted = true;

        getAllCertificates()
            .then((data) => {
                if (isMounted) setCertificates(data);
            })
            .catch((error) => {
                if (isMounted) toast.error(error.message);
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    const departmentOptions = useMemo(
        () => [...new Set(certificates.map((certificate) => certificate.owner?.department).filter(Boolean))].sort(),
        [certificates]
    );

    const filtered = useMemo(() => {
        return [...certificates]
            .filter((certificate) => {
                const expiry = certificate.expiryDate ? parseISO(certificate.expiryDate) : null;
                const matchesStart = !startDate || (expiry && expiry >= parseISO(startDate));
                const matchesEnd = !endDate || (expiry && expiry <= parseISO(endDate));
                const matchesDepartment = !department || certificate.owner?.department === department;
                const matchesStatus = !status || certificate.status === status;
                return matchesStart && matchesEnd && matchesDepartment && matchesStatus;
            })
            .sort((left, right) => new Date(left.expiryDate) - new Date(right.expiryDate));
    }, [certificates, department, endDate, startDate, status]);

    const summary = useMemo(() => ({
        total: filtered.length,
        expiring: filtered.filter((certificate) => certificate.status === 'expiring_soon').length,
        expired: filtered.filter((certificate) => certificate.status === 'expired').length,
        critical: filtered.filter((certificate) => {
            const days = getDaysRemaining(certificate.expiryDate);
            return days !== null && days >= 0 && days <= 14;
        }).length,
    }), [filtered]);

    const handleExcelExport = () => {
        const rows = filtered.map((certificate) => ({
            User: certificate.owner?.name ?? '-',
            Department: certificate.owner?.department ?? '-',
            Certificate: certificate.title,
            Organization: certificate.organization,
            'Expiry Date': certificate.expiryDate ? format(parseISO(certificate.expiryDate), 'dd MMM yyyy') : '-',
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
                <td>${certificate.owner?.department ?? '-'}</td>
                <td>${certificate.title}</td>
                <td>${certificate.organization}</td>
                <td>${certificate.expiryDate ? format(parseISO(certificate.expiryDate), 'dd MMM yyyy') : '-'}</td>
                <td>${getDaysRemaining(certificate.expiryDate)} days</td>
                <td>${certificate.status}</td>
            </tr>
        `).join('');

        const html = `<!DOCTYPE html><html><head><title>Expiry Report</title>
            <style>
                body { font-family: sans-serif; padding: 24px; font-size: 12px; }
                h2 { color: #2563EB; }
                table { border-collapse: collapse; width: 100%; }
                th, td { border: 1px solid #e5e7eb; padding: 8px; text-align: left; }
                th { background: #f3f4f6; font-weight: 600; }
            </style></head><body>
            <h2>Certify - Expiry Report</h2>
            <p>Generated: ${format(new Date(), 'dd MMM yyyy')}</p>
            <table>
                <thead><tr><th>User</th><th>Department</th><th>Certificate</th><th>Organization</th><th>Expiry</th><th>Days Left</th><th>Status</th></tr></thead>
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
            <PageWrapper className="py-8">
                <div className="space-y-6">
                    <div className="h-10 w-72 animate-pulse rounded-xl bg-slate-200" />
                    <div className="h-24 animate-pulse rounded-xl bg-slate-200" />
                    <div className="h-[520px] animate-pulse rounded-xl bg-slate-200" />
                </div>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper className="py-8">
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
                <MotionSection variants={listItemVariants} className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="section-label">Expiry Reports</p>
                        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                            <span>Renewal and </span>
                            <span className="text-[#2563EB]">expiry tracking</span>
                        </h1>
                        <p className="mt-2 text-sm font-light leading-7 text-slate-500">
                            Filter expiring or expired certifications by range, department, and status, then export the results.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={handleExcelExport}
                            className="inline-flex items-center gap-2 rounded-full border border-emerald-200 px-4 py-3 text-sm font-semibold text-emerald-600 transition-colors hover:bg-emerald-50"
                        >
                            <Download className="h-4 w-4" />
                            Export CSV
                        </button>
                        <button
                            onClick={handlePDFExport}
                            className="inline-flex items-center gap-2 rounded-full border border-rose-200 px-4 py-3 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50"
                        >
                            <FileDown className="h-4 w-4" />
                            Export PDF
                        </button>
                    </div>
                </MotionSection>

                <motion.div variants={staggerContainer} className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <SummaryCard label="In Report" value={summary.total} tone="text-slate-900" />
                    <SummaryCard label="Expiring Soon" value={summary.expiring} tone="text-amber-600" />
                    <SummaryCard label="Expired" value={summary.expired} tone="text-rose-600" />
                    <SummaryCard label="Critical 14d" value={summary.critical} tone="text-blue-600" />
                </motion.div>

                <MotionSection variants={listItemVariants} className="rounded-xl border border-slate-200 bg-white p-4 shadow-md">
                    <div className="grid gap-3 lg:grid-cols-4">
                        <div className="relative">
                            <Filter className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="date"
                                value={startDate}
                                onChange={(event) => setStartDate(event.target.value)}
                                className="h-12 w-full border-0 border-b-2 border-slate-200 bg-transparent pl-7 pr-4 text-sm text-slate-800 focus:border-[#2563EB] focus:outline-none"
                            />
                        </div>
                        <div className="relative">
                            <Filter className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="date"
                                value={endDate}
                                onChange={(event) => setEndDate(event.target.value)}
                                className="h-12 w-full border-0 border-b-2 border-slate-200 bg-transparent pl-7 pr-4 text-sm text-slate-800 focus:border-[#2563EB] focus:outline-none"
                            />
                        </div>
                        <div className="relative">
                            <Filter className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <select
                                value={department}
                                onChange={(event) => setDepartment(event.target.value)}
                                className="h-12 w-full border-0 border-b-2 border-slate-200 bg-transparent pl-7 pr-4 text-sm text-slate-800 focus:border-[#2563EB] focus:outline-none"
                            >
                                <option value="">All Departments</option>
                                {departmentOptions.map((option) => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                        <div className="relative">
                            <Filter className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <select
                                value={status}
                                onChange={(event) => setStatus(event.target.value)}
                                className="h-12 w-full border-0 border-b-2 border-slate-200 bg-transparent pl-7 pr-4 text-sm text-slate-800 focus:border-[#2563EB] focus:outline-none"
                            >
                                <option value="">All Statuses</option>
                                <option value="active">Active</option>
                                <option value="expiring_soon">Expiring Soon</option>
                                <option value="expired">Expired</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500">
                        <span className="rounded-full bg-slate-100 px-3 py-1">{filtered.length} records</span>
                        <span className="rounded-full bg-slate-100 px-3 py-1">Date-formatted with `date-fns`</span>
                    </div>
                </MotionSection>

                {filtered.length === 0 ? (
                    <EmptyState title="No certifications match" message="Try a different combination of filters." />
                ) : (
                    <MotionSection variants={listItemVariants} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md">
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left">
                                <thead className="border-b border-slate-200 bg-slate-50">
                                    <tr>
                                        {['User', 'Department', 'Certificate', 'Issuer', 'Expiry', 'Status', 'Days Left', 'Action'].map((header) => (
                                            <th key={header} className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filtered.map((certificate) => {
                                        const daysLeft = getDaysRemaining(certificate.expiryDate);
                                        return (
                                            <tr key={certificate.id} className="hover:bg-slate-50/80">
                                                <td className="px-4 py-4 text-sm font-semibold text-slate-900">{certificate.owner?.name ?? '-'}</td>
                                                <td className="px-4 py-4 text-sm text-slate-600">{certificate.owner?.department ?? '-'}</td>
                                                <td className="px-4 py-4">
                                                    <p className="text-sm font-semibold text-slate-900">{certificate.title}</p>
                                                </td>
                                                <td className="px-4 py-4 text-sm text-slate-600">{certificate.organization}</td>
                                                <td className="px-4 py-4 text-sm text-slate-600">
                                                    {certificate.expiryDate ? format(parseISO(certificate.expiryDate), 'dd MMM yyyy') : '-'}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${
                                                        certificate.status === 'expired'
                                                            ? 'bg-rose-50 text-rose-600'
                                                            : certificate.status === 'expiring_soon'
                                                                ? 'bg-amber-50 text-amber-600'
                                                                : 'bg-emerald-50 text-emerald-600'
                                                    }`}>
                                                        {certificate.status.replace('_', ' ')}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 text-sm text-slate-600">{daysLeft}</td>
                                                <td className="px-4 py-4">
                                                    <button
                                                        onClick={() => toast.success(`Renewal reminder triggered for ${certificate.owner?.name ?? 'user'}!`)}
                                                        className="inline-flex items-center gap-2 rounded-full bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1D4ED8]"
                                                    >
                                                        <BellRing className="h-3.5 w-3.5" />
                                                        Trigger Renewal
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </MotionSection>
                )}

                <MotionSection variants={listItemVariants} className="rounded-xl border border-slate-200 bg-white p-5 shadow-md">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <FileBarChart className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="section-label">Reporting Notes</p>
                            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                                <span>Focused report </span>
                                <span className="text-[#2563EB]">snapshots</span>
                            </h2>
                        </div>
                    </div>

                    <p className="mt-4 text-sm font-light leading-7 text-slate-500">
                        Use the filters above to narrow expiring certifications by window, department, or status before exporting or triggering renewal outreach.
                    </p>
                </MotionSection>
            </motion.div>
        </PageWrapper>
    );
}
