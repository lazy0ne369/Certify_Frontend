import { apiClient, getApiErrorMessage } from './apiClient';

export async function getAllUsers() {
    try {
        const { data } = await apiClient.get('/admin/users');
        return data;
    } catch (error) {
        throw new Error(getApiErrorMessage(error, 'Unable to load users.'));
    }
}

export async function getUserById(userId) {
    try {
        const { data } = await apiClient.get(`/admin/users/${userId}`);
        return data;
    } catch (error) {
        throw new Error(getApiErrorMessage(error, 'Unable to load user details.'));
    }
}

export async function getUserCertificates(userId) {
    try {
        const { data } = await apiClient.get(`/admin/users/${userId}/certificates`);
        return data;
    } catch (error) {
        throw new Error(getApiErrorMessage(error, 'Unable to load user certificates.'));
    }
}

export async function getAllCertificates() {
    try {
        const { data } = await apiClient.get('/admin/certificates');
        return data;
    } catch (error) {
        throw new Error(getApiErrorMessage(error, 'Unable to load certifications.'));
    }
}
