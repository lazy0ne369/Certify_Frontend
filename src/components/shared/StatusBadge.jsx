import Badge from '../ui/Badge';

export default function StatusBadge({ status }) {
    const variantMap = {
        active: 'active',
        expiring_soon: 'expiring',
        expired: 'expired',
        pending: 'pending',
    };

    return (
        <Badge variant={variantMap[status] ?? 'pending'}>
            {status === 'expiring_soon' ? 'Expiring Soon' : status ?? 'Pending'}
        </Badge>
    );
}
