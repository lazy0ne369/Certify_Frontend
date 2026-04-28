export default function Loader({ className = '' }) {
    return (
        <div className={`flex items-center justify-center ${className}`} aria-label="Loading" role="status">
            <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-[#BFDBFE] border-t-[#2563EB]" />
        </div>
    );
}
