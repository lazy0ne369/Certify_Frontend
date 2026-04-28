function ShimmerBlock({ className = '' }) {
    return <div className={`animate-pulse rounded-lg bg-slate-200 ${className}`} />;
}

export function CertCardSkeleton() {
    return (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md">
            <ShimmerBlock className="h-36 w-full rounded-none" />
            <div className="space-y-2.5 p-4">
                <ShimmerBlock className="h-4 w-3/4" />
                <ShimmerBlock className="h-3 w-1/2" />
                <ShimmerBlock className="h-3 w-2/3" />
                <div className="mt-3 flex gap-2">
                    <ShimmerBlock className="h-5 w-16 rounded-full" />
                    <ShimmerBlock className="h-5 w-20 rounded-full" />
                </div>
                <ShimmerBlock className="mt-2 h-9 w-full" />
            </div>
        </div>
    );
}

export function StatCardSkeleton() {
    return (
        <div className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-md">
            <ShimmerBlock className="h-12 w-12 shrink-0 rounded-xl" />
            <div className="flex-1 space-y-2">
                <ShimmerBlock className="h-3 w-24" />
                <ShimmerBlock className="h-7 w-12" />
                <ShimmerBlock className="h-3 w-20" />
            </div>
        </div>
    );
}

export function TableRowSkeleton({ cols = 6 }) {
    return (
        <tr>
            {Array.from({ length: cols }).map((_, index) => (
                <td key={index} className="px-4 py-3">
                    <ShimmerBlock className="h-4 w-full" />
                </td>
            ))}
        </tr>
    );
}

export function CertGridSkeleton({ count = 6 }) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: count }).map((_, index) => (
                <CertCardSkeleton key={index} />
            ))}
        </div>
    );
}

export function StatRowSkeleton({ count = 4 }) {
    return (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {Array.from({ length: count }).map((_, index) => (
                <StatCardSkeleton key={index} />
            ))}
        </div>
    );
}
