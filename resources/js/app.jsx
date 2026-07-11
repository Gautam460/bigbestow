import '../css/app.css';
import '../css/custom.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import EcommerceLayout from '@/layouts/EcommerceLayout';
import AdminLayout from '@/layouts/AdminLayout';
import SettingsLayout from '@/layouts/settings/layout';

const appName = import.meta.env.VITE_APP_NAME || 'Bigbestow';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: async (name) => {
        const pages = import.meta.glob('./pages/**/*.{jsx,tsx}');
        const page = pages[`./pages/${name}.jsx`] || pages[`./pages/${name}.tsx`];
        if (!page) {
            throw new Error(`Page component "${name}" could not be found.`);
        }
        const resolved = await page();
        
        // Ensure proper layout wrapping for Admin and Customer pages
        if (resolved.default) {
            if (name.startsWith('Admin/')) {
                if (name !== 'Admin/Auth/Login') {
                    resolved.default.layout = (pageContent) => <AdminLayout>{pageContent}</AdminLayout>;
                }
            } else if (
                name.startsWith('settings/') ||
                name.startsWith('Orders/') ||
                name === 'dashboard' || 
                name === 'orders' || 
                name === 'wishlist'
            ) {
                resolved.default.layout = (pageContent) => <SettingsLayout>{pageContent}</SettingsLayout>;
            } else if (name.startsWith('auth/')) {
                if (name !== 'auth/login' && name !== 'auth/register') {
                    resolved.default.layout = (pageContent) => (
                        <div className="min-h-screen bg-[#FDFDFD] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
                            <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-yellow-500/10 blur-[120px] rounded-full -mr-32 -mt-32"></div>
                            <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-yellow-500/5 blur-[100px] rounded-full -ml-20 -mb-20"></div>
                            <div className="w-full max-w-[480px] relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700 bg-white p-8 rounded-3xl shadow-2xl border border-gray-100">
                                {pageContent}
                            </div>
                        </div>
                    );
                }
            }
        }
        return resolved;
    },
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <TooltipProvider delayDuration={0}>
                <App {...props} />
                <Toaster position="top-right" richColors />
            </TooltipProvider>
        );
    },
    progress: {
        color: '#EAB308',
    },
});

initializeTheme();
