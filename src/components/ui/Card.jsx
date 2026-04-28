export default function Card({ children, className = '' }) {
    return (
        <div className={`rounded-xl bg-white shadow-md transition-transform duration-200 hover:-translate-y-1 ${className}`}>
            {children}
        </div>
    );
}
