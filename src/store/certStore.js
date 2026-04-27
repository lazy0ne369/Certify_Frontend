import { create } from 'zustand';
import {
    createCertificate,
    deleteCertificate,
    getCertificate,
    getCertificates,
    updateCertificate,
} from '../services/certificateService';

function sortCertificates(certificates = []) {
    return [...certificates].sort((left, right) => {
        if (!left?.expiryDate || !right?.expiryDate) {
            return 0;
        }

        return left.expiryDate.localeCompare(right.expiryDate);
    });
}

function updateCertificateInList(certificates, updatedCertificate) {
    return certificates.map((certificate) =>
        String(certificate.id) === String(updatedCertificate.id) ? updatedCertificate : certificate
    );
}

export const useCertStore = create((set, get) => ({
    certificates: [],
    isLoading: false,
    isSaving: false,
    hasLoaded: false,
    error: null,

    clearCertificates: () =>
        set({
            certificates: [],
            isLoading: false,
            isSaving: false,
            hasLoaded: false,
            error: null,
        }),

    getCertById: (id) =>
        get().certificates.find((certificate) => String(certificate.id) === String(id)) ?? null,

    fetchCertificates: async (force = false) => {
        if (get().hasLoaded && !force) {
            return get().certificates;
        }

        set({ isLoading: true, error: null });

        try {
            const certificates = sortCertificates(await getCertificates());
            set({
                certificates,
                isLoading: false,
                hasLoaded: true,
            });
            return certificates;
        } catch (error) {
            set({
                error: error.message,
                isLoading: false,
            });
            throw error;
        }
    },

    fetchCertificateById: async (id) => {
        set({ isLoading: true, error: null });

        try {
            const certificate = await getCertificate(id);
            set((state) => ({
                certificates: sortCertificates([
                    ...state.certificates.filter((item) => String(item.id) !== String(certificate.id)),
                    certificate,
                ]),
                isLoading: false,
                hasLoaded: true,
            }));
            return certificate;
        } catch (error) {
            set({
                error: error.message,
                isLoading: false,
            });
            throw error;
        }
    },

    addCertificate: async (payload) => {
        set({ isSaving: true, error: null });

        try {
            const certificate = await createCertificate(payload);
            set((state) => ({
                certificates: sortCertificates([...state.certificates, certificate]),
                isSaving: false,
                hasLoaded: true,
            }));
            return certificate;
        } catch (error) {
            set({
                error: error.message,
                isSaving: false,
            });
            throw error;
        }
    },

    updateCertificate: async (id, payload) => {
        set({ isSaving: true, error: null });

        try {
            const certificate = await updateCertificate(id, payload);
            set((state) => ({
                certificates: sortCertificates(updateCertificateInList(state.certificates, certificate)),
                isSaving: false,
                hasLoaded: true,
            }));
            return certificate;
        } catch (error) {
            set({
                error: error.message,
                isSaving: false,
            });
            throw error;
        }
    },

    deleteCertificate: async (id) => {
        set({ isSaving: true, error: null });

        try {
            await deleteCertificate(id);
            set((state) => ({
                certificates: state.certificates.filter((certificate) => String(certificate.id) !== String(id)),
                isSaving: false,
                hasLoaded: true,
            }));
        } catch (error) {
            set({
                error: error.message,
                isSaving: false,
            });
            throw error;
        }
    },
}));
