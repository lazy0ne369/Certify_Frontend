import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function DashboardLayout({ children }) {
    const location = useLocation();

    return (
        <div className="dashboard-app-shell">
            <div className="dashboard-frame flex flex-col">
                <Navbar />

                <div className="flex min-h-0 flex-1 overflow-hidden">
                    <Sidebar />
                    <main className="min-w-0 flex-1 overflow-y-auto">
                        <AnimatePresence mode="wait" initial={false}>
                            <div key={location.pathname} className="min-h-full">
                                {children}
                            </div>
                        </AnimatePresence>
                    </main>
                </div>
            </div>
        </div>
    );
}
