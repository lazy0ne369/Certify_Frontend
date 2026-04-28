import { useEffect, useRef } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import Button from '../ui/Button';
import Modal from '../ui/Modal';

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title = 'Are you sure?',
    description = 'This action cannot be undone.',
    confirmLabel = 'Delete',
    loading = false,
}) {
    const cancelRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => cancelRef.current?.focus(), 50);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;
        const handler = (event) => {
            if (event.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [isOpen, onClose]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} panelClassName="overflow-hidden border border-slate-200 p-6 sm:p-7">
            <div role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-desc">
                <div className="mb-5 flex items-start gap-3">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-50">
                        <AlertTriangle className="h-5 w-5 text-amber-500" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Confirm action</p>
                        <h3 id="confirm-title" className="mt-2 text-lg font-bold text-slate-900">{title}</h3>
                        <p id="confirm-desc" className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
                    </div>
                    <button
                        onClick={onClose}
                        aria-label="Close dialog"
                        className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100"
                    >
                        <X className="h-4 w-4" aria-hidden="true" />
                    </button>
                </div>

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <Button ref={cancelRef} variant="ghost" size="md" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button variant="danger" size="md" onClick={onConfirm} loading={loading}>
                        {confirmLabel}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
