/**
 * AppRouter.jsx — FSAD-PS34
 * Full React Router v6 routing with role-based protection + DashboardLayout.
 */

import { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { pageVariants, pageTransition } from '../animations/pageTransitions';
const Home = lazy(() => import('../pages/Home'));
import { Toaster } from 'sonner';
import { useAuthStore } from '../store/authStore';
import ProtectedRoute from './ProtectedRoute';
import DashboardLayout from '../components/layout/DashboardLayout';

// ── Auth Pages ────────────────────────────────────────────────────────────────
const Login = lazy(() => import('../pages/auth/Login'));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'));
const Contact = lazy(() => import('../pages/Contact'));
const Policy = lazy(() => import('../pages/Policy'));

// ── User Pages ────────────────────────────────────────────────────────────────
const UserDashboard = lazy(() => import('../pages/user/UserDashboard'));
const MyCertifications = lazy(() => import('../pages/user/MyCertifications'));
const AddCertification = lazy(() => import('../pages/user/AddCertification'));
const EditCertification = lazy(() => import('../pages/user/EditCertification'));
const CertificateDetail = lazy(() => import('../pages/user/CertificateDetail'));
const Profile = lazy(() => import('../pages/user/Profile'));

// ── Admin Pages ───────────────────────────────────────────────────────────────
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const AllCertifications = lazy(() => import('../pages/admin/AllCertifications'));
const UserManagement = lazy(() => import('../pages/admin/UserManagement'));
const UserCertDetail = lazy(() => import('../pages/admin/UserCertDetail'));
const ExpiryReports = lazy(() => import('../pages/admin/ExpiryReports'));

// ── Special Pages ─────────────────────────────────────────────────────────────
const Unauthorized = lazy(() => import('../pages/Unauthorized'));
const NotFound = lazy(() => import('../pages/NotFound'));

// ── Spinner fallback ──────────────────────────────────────────────────────────
function PageLoader() {
    return (
        <div className="flex min-h-screen items-center justify-center public-app-shell">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#861c1c] border-t-transparent dark:border-[#f4b34f] dark:border-t-transparent" />
        </div>
    );
}

function getDashboardPath(user) {
    return user?.role?.toUpperCase() === 'ADMIN' ? '/admin/dashboard' : '/user/dashboard';
}

// ── Smart root redirect ───────────────────────────────────────────────────────
function RootRedirect() {
    const { isAuthenticated, user, isHydrating } = useAuthStore();
    if (isHydrating) return <PageLoader />;
    if (!isAuthenticated) return <Navigate to="/" replace />;
    return <Navigate to={getDashboardPath(user)} replace />;
}

function GuestOnly({ children }) {
    const { isAuthenticated, isHydrating, user } = useAuthStore();

    if (isHydrating) return <PageLoader />;
    if (isAuthenticated) return <Navigate to={getDashboardPath(user)} replace />;

    return children;
}

// ── Helper: protected page wrapped in DashboardLayout ────────────────────────
function Protected({ role, children }) {
    return (
        <ProtectedRoute allowedRole={role}>
            <DashboardLayout>{children}</DashboardLayout>
        </ProtectedRoute>
    );
}

function AnimatedRoutes() {
    const location = useLocation();
    return (
        <>
            <Toaster
                position="top-right"
                richColors
                toastOptions={{ style: { fontFamily: 'Plus Jakarta Sans, sans-serif' } }}
            />
            <AnimatePresence mode="wait">
                <Suspense fallback={<PageLoader />}>
                    <motion.div
                        key={location.pathname}
                        variants={pageVariants}
                        initial="initial"
                        animate="in"
                        exit="out"
                        transition={pageTransition}
                        className="min-h-screen"
                    >
                        <Routes location={location}>
                            {/* Home page */}
                            <Route path="/" element={<GuestOnly><Home /></GuestOnly>} />
                            {/* Smart redirect for legacy or direct links */}
                            <Route path="/redirect" element={<RootRedirect />} />

                            {/* Public */}
                            <Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />
                            <Route path="/register" element={<GuestOnly><RegisterPage /></GuestOnly>} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="/policy" element={<Policy />} />
                            <Route path="/unauthorized" element={<Unauthorized />} />

                            {/* ── User routes ─────────────────────────────────── */}
                            <Route path="/user/dashboard" element={<Protected role="user"><UserDashboard /></Protected>} />
                            <Route path="/user/certifications" element={<Protected role="user"><MyCertifications /></Protected>} />
                            <Route path="/user/certifications/add" element={<Protected role="user"><AddCertification /></Protected>} />
                            <Route path="/user/certifications/edit/:id" element={<Protected role="user"><EditCertification /></Protected>} />
                            <Route path="/user/certifications/:id" element={<Protected role="user"><CertificateDetail /></Protected>} />
                            <Route path="/user/profile" element={<Protected role="user"><Profile /></Protected>} />

                            {/* ── Admin routes ────────────────────────────────── */}
                            <Route path="/admin/dashboard" element={<Protected role="admin"><AdminDashboard /></Protected>} />
                            <Route path="/admin/certifications" element={<Protected role="admin"><AllCertifications /></Protected>} />
                            <Route path="/admin/users" element={<Protected role="admin"><UserManagement /></Protected>} />
                            <Route path="/admin/users/:userId/certifications" element={<Protected role="admin"><UserCertDetail /></Protected>} />
                            <Route path="/admin/reports" element={<Protected role="admin"><ExpiryReports /></Protected>} />

                            {/* 404 */}
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </motion.div>
                </Suspense>
            </AnimatePresence>
        </>
    );
}

// ── Router ────────────────────────────────────────────────────────────────────
export default function AppRouter() {
    return (
        <HashRouter>
            <AnimatedRoutes />
        </HashRouter>
    );
}
