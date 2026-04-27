import { apiClient, getApiErrorMessage } from './apiClient';

function toCertificateRequest(payload = {}) {
    return {
        title: payload.title ?? '',
        organization: payload.organization ?? '',
        issueDate: payload.issueDate ?? '',
        expiryDate: payload.expiryDate ?? '',
        credentialId: payload.credentialId ?? '',
        category: payload.category ?? '',
        description: payload.description ?? '',
        badgeUrl: payload.badgeUrl ?? '',
        certificateUrl: payload.certificateUrl ?? '',
    };
}

export async function getCertificates() {
    const { data } = await apiClient.get('/certificates');
    return data;
}

export async function getCertificate(id) {
    const { data } = await apiClient.get(`/certificates/${id}`);
    return data;
}

export async function createCertificate(payload) {
    try {
        const { data } = await apiClient.post('/certificates', toCertificateRequest(payload));
        return data;
    } catch (error) {
        throw new Error(getApiErrorMessage(error, 'Unable to create certificate.'));
    }
}

export async function updateCertificate(id, payload) {
    try {
        const { data } = await apiClient.put(`/certificates/${id}`, toCertificateRequest(payload));
        return data;
    } catch (error) {
        throw new Error(getApiErrorMessage(error, 'Unable to update certificate.'));
    }
}

export async function deleteCertificate(id) {
    try {
        await apiClient.delete(`/certificates/${id}`);
    } catch (error) {
        throw new Error(getApiErrorMessage(error, 'Unable to delete certificate.'));
    }
}
