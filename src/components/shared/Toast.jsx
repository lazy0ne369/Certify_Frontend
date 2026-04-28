export const toastTheme = {
    style: {
        border: '1px solid rgba(37, 99, 235, 0.12)',
        background: '#FFFFFF',
        color: '#111827',
        boxShadow: '0 10px 30px rgba(15, 23, 42, 0.10)',
        borderRadius: '16px',
        fontFamily: 'Manrope, ui-sans-serif, system-ui, sans-serif',
    },
    classNames: {
        toast: 'rounded-2xl border border-slate-200 bg-white shadow-lg',
        title: 'text-sm font-semibold text-[#111827]',
        description: 'text-sm text-[#6B7280]',
        actionButton: 'rounded-full bg-[#2563EB] text-white',
        cancelButton: 'rounded-full bg-slate-100 text-[#111827]',
    },
};

export default toastTheme;
