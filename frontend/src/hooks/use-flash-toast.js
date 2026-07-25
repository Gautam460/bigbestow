'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

export function useFlashToast() {
    useEffect(() => {
        const handleFlash = (event) => {
            const data = event.detail;
            if (!data || !toast[data.type]) {
                return;
            }
            toast[data.type](data.message);
        };

        window.addEventListener('flash-toast', handleFlash);
        return () => window.removeEventListener('flash-toast', handleFlash);
    }, []);
}
