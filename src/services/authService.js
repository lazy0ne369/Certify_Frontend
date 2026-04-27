import { apiClient, getApiErrorMessage } from './apiClient';

export async function loginUser(email, password) {
    try {
        const { data } = await apiClient.post('/auth/login', { email, password });
        return data;
    } catch (error) {
        throw new Error(getApiErrorMessage(error, 'Login failed. Please check your credentials.'));
    }
}

export async function registerUser(payload) {
    try {
        const { data } = await apiClient.post('/auth/register', payload);
        return data;
    } catch (error) {
        throw new Error(getApiErrorMessage(error, 'Registration failed. Please try again.'));
    }
}
