'use client';

import React, { useEffect } from 'react';
import { AppProvider } from '../context/AppContext';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';

export default function ClientProviders({ children }) {
    useEffect(() => {
        initializeTheme();
    }, []);

    return (
        <AppProvider>
            <TooltipProvider delayDuration={0}>
                {children}
                <Toaster position="top-right" richColors />
            </TooltipProvider>
        </AppProvider>
    );
}
