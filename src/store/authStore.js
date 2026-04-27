import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getCurrentUser } from '../services/userService';
import { clearStoredToken, getStoredToken, setStoredToken } from '../services/tokenService';

const initialToken = getStoredToken();

export const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: Boolean(initialToken),
            token: initialToken,
            isHydrating: Boolean(initialToken),

            login: (userData, token) => {
                setStoredToken(token);
                set({
                    user: userData,
                    token,
                    isAuthenticated: true,
                    isHydrating: false,
                });
            },

            logout: () => {
                clearStoredToken();
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    isHydrating: false,
                });
            },

            updateUser: (updates) =>
                set((state) => ({
                    user: state.user ? { ...state.user, ...updates } : state.user,
                })),

            hydrateUser: async () => {
                const token = getStoredToken();

                if (!token) {
                    set({
                        user: null,
                        token: null,
                        isAuthenticated: false,
                        isHydrating: false,
                    });
                    return null;
                }

                set({ isHydrating: true, token, isAuthenticated: true });

                try {
                    const user = await getCurrentUser();
                    set({
                        user,
                        token,
                        isAuthenticated: true,
                        isHydrating: false,
                    });
                    return user;
                } catch (_error) {
                    clearStoredToken();
                    set({
                        user: null,
                        token: null,
                        isAuthenticated: false,
                        isHydrating: false,
                    });
                    return null;
                }
            },
        }),
        {
            name: 'fsad-auth',
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
                token: state.token,
            }),
        }
    )
);
