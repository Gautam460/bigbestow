'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AdminLayout from '@/layouts/AdminLayout';
import { useApp } from '@/context/AppContext';

export default function AppAdminLayout({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const { auth, authLoading } = useApp() || {};
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted || authLoading) return;
        
        const isAuth = auth && auth.user;
        
        // If not logged in and not on the login page, redirect to login
        if (!isAuth && pathname !== '/admin/login') {
            router.push('/admin/login');
        }
        
        // If logged in and on the login page, redirect to dashboard
        if (isAuth && pathname === '/admin/login') {
            router.push('/admin');
        }
    }, [auth, authLoading, pathname, router, mounted]);

    if (!mounted || authLoading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }
    
    const isAuth = auth && auth.user;
    
    if (!isAuth && pathname !== '/admin/login') {
         return null; 
    }

    if (pathname === '/admin/login') {
        return <>{children}</>;
    }
    
    return <AdminLayout>{children}</AdminLayout>;
}
