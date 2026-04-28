import { useState, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { QRCodeCanvas } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    ChevronLeft,
    ChevronRight,
    FileWarning,
    Loader2,
    Download,
    Minus,
    Plus,
    QrCode,
} from 'lucide-react';
import { backdropVariants, modalVariants } from '../../animations/variants';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

const MotionDiv = motion.div;

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

function PDFControls({ page, numPages, onPrev, onNext, scale, onZoomIn, onZoomOut, onDownload }) {
    return (
        <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-2">
                <button
                    onClick={onPrev}
                    disabled={page <= 1}
                    className="rounded-full p-2 text-slate-600 transition-colors hover:bg-slate-200 disabled:opacity-30"
                >
                    <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="min-w-[90px] text-center text-xs font-semibold text-slate-500">
                    Page {page} of {numPages ?? '...'}
                </span>
                <button
                    onClick={onNext}
                    disabled={!numPages || page >= numPages}
                    className="rounded-full p-2 text-slate-600 transition-colors hover:bg-slate-200 disabled:opacity-30"
                >
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
                <button
                    onClick={onZoomOut}
                    className="rounded-full border border-slate-200 bg-white p-2 text-slate-600 transition-colors hover:border-blue-200 hover:text-blue-600"
                >
                    <Minus className="h-4 w-4" />
                </button>
                <span className="min-w-[72px] text-center text-xs font-semibold text-slate-500">
                    {Math.round(scale * 100)}%
                </span>
                <button
                    onClick={onZoomIn}
                    className="rounded-full border border-slate-200 bg-white p-2 text-slate-600 transition-colors hover:border-blue-200 hover:text-blue-600"
                >
                    <Plus className="h-4 w-4" />
                </button>
                <button
                    onClick={onDownload}
                    className="inline-flex items-center gap-2 rounded-full bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1D4ED8]"
                >
                    <Download className="h-3.5 w-3.5" />
                    Download
                </button>
            </div>
        </div>
    );
}

export default function PDFViewer({ fileUrl, fileName, isOpen, onClose, verifyValue }) {
    const [numPages, setNumPages] = useState(null);
    const [pageNum, setPageNum] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [scale, setScale] = useState(1);
    const qrValue = verifyValue ?? fileUrl ?? '';

    const onDocLoad = useCallback(({ numPages: pageCount }) => {
        setNumPages(pageCount);
        setLoading(false);
        setError(false);
    }, []);

    const onDocError = useCallback(() => {
        setLoading(false);
        setError(true);
    }, []);

    const reset = () => {
        setNumPages(null);
        setPageNum(1);
        setLoading(true);
        setError(false);
        setScale(1);
        onClose();
    };

    const handleDownload = () => {
        if (!fileUrl) return;
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = fileName ?? 'certificate.pdf';
        link.target = '_blank';
        link.click();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <MotionDiv
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                        onClick={reset}
                    />

                    <MotionDiv
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="fixed inset-4 z-50 flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:inset-auto sm:left-1/2 sm:top-1/2 sm:max-h-[90vh] sm:w-[min(1100px,92vw)] sm:-translate-x-1/2 sm:-translate-y-1/2"
                    >
                        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                            <p className="max-w-[80%] truncate text-sm font-semibold text-slate-800">
                                {fileName ?? 'Certificate PDF'}
                            </p>
                            <button onClick={reset} className="rounded-full p-2 transition-colors hover:bg-slate-100">
                                <X className="h-4 w-4 text-slate-500" />
                            </button>
                        </div>

                        <div className="grid flex-1 gap-0 overflow-hidden lg:grid-cols-[1fr_280px]">
                            <div className="relative flex min-h-[320px] items-center justify-center overflow-auto bg-slate-100 p-4">
                                {error ? (
                                    <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
                                        <FileWarning className="h-12 w-12 text-red-400" />
                                        <p className="text-sm text-slate-500">Failed to load PDF.<br />Check the file URL and try again.</p>
                                    </div>
                                ) : (
                                    <>
                                        {loading && (
                                            <div className="absolute flex items-center gap-2 text-sm text-slate-400">
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                                Loading PDF...
                                            </div>
                                        )}
                                        <Document
                                            file={fileUrl}
                                            onLoadSuccess={onDocLoad}
                                            onLoadError={onDocError}
                                            loading={null}
                                        >
                                            <Page
                                                pageNumber={pageNum}
                                                width={560}
                                                scale={scale}
                                                renderTextLayer
                                                renderAnnotationLayer
                                            />
                                        </Document>
                                    </>
                                )}
                            </div>

                            <div className="border-t border-slate-200 bg-white p-5 lg:border-l lg:border-t-0">
                                <div className="flex items-center gap-2">
                                    <QrCode className="h-4 w-4 text-[#2563EB]" />
                                    <h3 className="text-sm font-semibold text-slate-800">Quick Verification</h3>
                                </div>
                                <p className="mt-2 text-sm font-light leading-7 text-slate-500">
                                    Scan the QR code to open the certificate verification link alongside the in-app viewer.
                                </p>

                                <div className="mt-5 flex justify-center rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <QRCodeCanvas
                                        value={qrValue}
                                        size={170}
                                        bgColor="#ffffff"
                                        fgColor="#1D4ED8"
                                        level="H"
                                        includeMargin={false}
                                    />
                                </div>

                                <div className="mt-5 rounded-xl bg-slate-50 p-4">
                                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Verification Link</p>
                                    <p className="mt-2 break-all text-xs text-slate-600">{qrValue || 'No verification link available.'}</p>
                                </div>

                                <button
                                    onClick={handleDownload}
                                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#2563EB] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1D4ED8]"
                                >
                                    <Download className="h-4 w-4" />
                                    Download Certificate
                                </button>
                            </div>
                        </div>

                        {!error && (
                            <PDFControls
                                page={pageNum}
                                numPages={numPages}
                                onPrev={() => setPageNum((current) => Math.max(1, current - 1))}
                                onNext={() => setPageNum((current) => Math.min(numPages, current + 1))}
                                scale={scale}
                                onZoomIn={() => setScale((current) => Math.min(2, Number((current + 0.1).toFixed(2))))}
                                onZoomOut={() => setScale((current) => Math.max(0.7, Number((current - 0.1).toFixed(2))))}
                                onDownload={handleDownload}
                            />
                        )}
                    </MotionDiv>
                </>
            )}
        </AnimatePresence>
    );
}
