import { motion } from 'framer-motion';
import { Award, CheckCircle, Briefcase, Calendar } from 'lucide-react';
import { cardVariants } from '../../animations/variants';
import { formatDate } from '../../utils/dateUtils';
import { getInitials, avatarColor } from '../../utils/helpers';

function StatPill({ icon: Icon, label, value, color }) {
    const colorMap = {
        indigo: 'bg-indigo-50 dark:bg-indigo-900/25 text-indigo-600 dark:text-indigo-300',
        emerald: 'bg-emerald-50 dark:bg-emerald-900/25 text-emerald-600 dark:text-emerald-300',
    };

    return (
        <div className={`flex flex-col items-center gap-1 px-4 py-3 rounded-xl ${colorMap[color]}`}>
            <Icon className="w-4 h-4" />
            <span className="text-lg font-bold">{value}</span>
            <span className="text-[11px] font-medium opacity-80">{label}</span>
        </div>
    );
}

export default function ProfileCard({ user, stats }) {
    const initials = getInitials(user?.name ?? 'U');
    const bgColor = avatarColor(user?.name ?? '');
    const memberSince = user?.createdAt ? formatDate(user.createdAt) : 'Recently';

    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="rounded-[1.75rem] shadow-2xl bg-white dark:bg-slate-950 border border-gray-100 dark:border-gray-800 overflow-hidden"
        >
            <div className="h-24 bg-gradient-to-r from-[#861c1c] via-[#c06f30] to-[#f4b34f]" />

            <div className="px-6 pb-6 -mt-12 flex flex-col items-center text-center">
                {user?.avatar ? (
                    <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-20 h-20 rounded-full ring-4 ring-white dark:ring-gray-900 object-cover shadow-md"
                    />
                ) : (
                    <span className={`w-20 h-20 rounded-full ring-4 ring-white dark:ring-gray-900 flex items-center justify-center text-white text-2xl font-bold shadow-md ${bgColor}`}>
                        {initials}
                    </span>
                )}

                <h2 className="mt-3 text-xl font-bold text-gray-900 dark:text-white">{user?.name}</h2>
                <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">{user?.designation}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                    <Briefcase className="w-3 h-3" /> {user?.department}
                </p>

                <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 mt-2">
                    <Calendar className="w-3 h-3" />
                    Member since {memberSince}
                </div>

                <div className="grid grid-cols-2 gap-3 mt-5 w-full">
                    <StatPill icon={Award} label="Total Certs" value={stats?.total ?? 0} color="indigo" />
                    <StatPill icon={CheckCircle} label="Active" value={stats?.active ?? 0} color="emerald" />
                </div>
            </div>
        </motion.div>
    );
}
