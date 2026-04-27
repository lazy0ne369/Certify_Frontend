/**
 * Hook that simulates an 800ms loading delay then resolves.
 * Returns: { loading } 
 */

import { useState, useEffect } from 'react';

export function usePageLoader(ms = 800) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), ms);
        return () => clearTimeout(timer);
    }, [ms]);

    return { loading };
}
