import { differenceInDays, parseISO } from 'date-fns';

export const getCertsByUser = (certificates = [], userId) =>
    certificates.filter((certificate) => String(certificate.userId) === String(userId));

export const getCertById = (certificates = [], id) =>
    certificates.find((certificate) => String(certificate.id) === String(id)) ?? null;

export const getDaysRemaining = (expiryDate) => {
    if (!expiryDate) return null;
    return differenceInDays(parseISO(expiryDate), new Date());
};

export const getStatus = (expiryDate) => {
    const days = getDaysRemaining(expiryDate);
    if (days === null) return 'active';
    if (days < 0) return 'expired';
    if (days <= 90) return 'expiring_soon';
    return 'active';
};

export const getStatusColor = (status) => {
    switch (status) {
        case 'active':
            return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300';
        case 'expiring_soon':
            return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300';
        case 'expired':
            return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300';
        default:
            return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300';
    }
};

export const getCertStats = (certificates = [], userId = null) => {
    const filteredCertificates = userId == null
        ? certificates
        : getCertsByUser(certificates, userId);

    return filteredCertificates.reduce(
        (accumulator, certificate) => {
            accumulator.total += 1;

            if (certificate.status === 'active') accumulator.active += 1;
            if (certificate.status === 'expiring_soon') accumulator.expiringSoon += 1;
            if (certificate.status === 'expired') accumulator.expired += 1;

            return accumulator;
        },
        { total: 0, active: 0, expiringSoon: 0, expired: 0 }
    );
};

export const getAllCertsGroupedByUser = (users = [], certificates = []) =>
    users.map((user) => ({
        user,
        certs: getCertsByUser(certificates, user.id),
        stats: getCertStats(certificates, user.id),
    }));
