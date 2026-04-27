import axios from 'axios';
import { clearStoredToken, getStoredToken } from './tokenService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api';

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use((config) => {
    const token = getStoredToken();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export function getApiErrorMessage(error, fallbackMessage = 'Something went wrong. Please try again.') {
    const message =
        error?.response?.data?.message
        ?? error?.response?.data?.error
        ?? error?.message;

    if (typeof message === 'string' && message.trim()) {
        return message;
    }

    return fallbackMessage;
}

export function getApiValidationErrors(error) {
    return error?.response?.data?.validationErrors ?? {};
}

export function isUnauthorizedError(error) {
    return error?.response?.status === 401;
}

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (isUnauthorizedError(error)) {
            clearStoredToken();
            window.dispatchEvent(new Event('fsad-auth-expired'));
        }

        return Promise.reject(error);
    }
);
