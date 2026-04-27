import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { format, parseISO, subMonths } from 'date-fns';

function buildActivityData(certificates = []) {
    const months = Array.from({ length: 6 }, (_, index) => {
        const current = subMonths(new Date(), 5 - index);
        const key = format(current, 'yyyy-MM');

        return {
            key,
            month: format(current, 'MMM yy'),
            certs: 0,
        };
    });

    const counts = new Map(months.map((month) => [month.key, month]));

    certificates.forEach((certificate) => {
        if (!certificate?.createdAt) {
            return;
        }

        const key = format(parseISO(certificate.createdAt), 'yyyy-MM');
        const month = counts.get(key);

        if (month) {
            month.certs += 1;
        }
    });

    return months;
}

function CustomTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;

    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl shadow-lg px-3 py-2 text-xs">
            <p className="font-semibold text-gray-700 dark:text-gray-200">{label}</p>
            <p className="text-indigo-600 dark:text-indigo-400">
                {payload[0].value} cert{payload[0].value !== 1 ? 's' : ''} added
            </p>
        </div>
    );
}

function CustomDot({ cx, cy }) {
    if (!cx || !cy) return null;

    return (
        <g>
            <circle cx={cx} cy={cy} r={5} fill="#4f46e5" stroke="#fff" strokeWidth={2} />
        </g>
    );
}

export default function ActivityChart({ certificates = [] }) {
    const data = buildActivityData(certificates);

    return (
        <div className="rounded-xl shadow-md bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-5">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-4">
                Certification Activity (Last 6 Months)
            </h3>
            <ResponsiveContainer width="100%" height={200}>
                <LineChart data={data} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
                    <defs>
                        <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#818cf8" />
                            <stop offset="100%" stopColor="#4f46e5" />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis
                        dataKey="month"
                        tick={{ fontSize: 11, fill: '#9ca3af' }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        allowDecimals={false}
                        tick={{ fontSize: 11, fill: '#9ca3af' }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '4 2' }}
                    />
                    <Line
                        type="monotone"
                        dataKey="certs"
                        stroke="url(#lineGrad)"
                        strokeWidth={2.5}
                        dot={<CustomDot />}
                        activeDot={{ r: 6, fill: '#4f46e5', stroke: '#fff', strokeWidth: 2 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
