/**
 * ProtectedRoute.jsx — FSAD-PS34
 * Role-based route guard using Zustand authStore.
 */

import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

/**
 * @param {React.ReactNode} children   — page to render if access granted
 * @param {'user'|'admin'} allowedRole — optional role restriction
 */
export default function ProtectedRoute({ children, allowedRole }) {
    const { isAuthenticated, user, isHydrating } = useAuthStore();

    if (isHydrating) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950">
                <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // Not logged in → go to login
    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace />;
    }

    // Role mismatch → go to /unauthorized
    if (allowedRole && user.role?.toUpperCase() !== allowedRole.toUpperCase()) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
}
