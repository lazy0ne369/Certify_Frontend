import { apiClient, getApiErrorMessage } from './apiClient';

export async function getCurrentUser() {
    try {
        const { data } = await apiClient.get('/users/me');
        return data;
    } catch (error) {
        throw new Error(getApiErrorMessage(error, 'Unable to load your profile.'));
    }
}

export async function updateCurrentUser(payload) {
    try {
        const { data } = await apiClient.put('/users/me', payload);
        return data;
    } catch (error) {
        throw new Error(getApiErrorMessage(error, 'Unable to update your profile.'));
    }
}

export async function deleteCurrentUser() {
    try {
        await apiClient.delete('/users/me');
    } catch (error) {
        throw new Error(getApiErrorMessage(error, 'Unable to delete your account.'));
    }
}
