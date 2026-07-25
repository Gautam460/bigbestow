'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api, { resetCsrf } from '../lib/api';
import { toast } from 'sonner';

const AppContext = createContext();

export function AppProvider({ children }) {
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [navCategories, setNavCategories] = useState([]);
    const [flash, setFlash] = useState({});

    const fetchCategories = useCallback(async () => {
        try {
            const res = await api.get('/api/home');
            if (res && res.categories) {
                setNavCategories(res.categories);
            }
        } catch (e) {
            console.error('Failed to fetch categories:', e);
        }
    }, []);

    const checkAuth = useCallback(async () => {
        try {
            const hasToken = typeof window !== 'undefined' && localStorage.getItem('auth_token');
            const isLoggedIn = typeof window !== 'undefined' && localStorage.getItem('is_logged_in') === 'true';
            if (!hasToken && !isLoggedIn) {
                setUser(null);
                setAuthLoading(false);
                return;
            }
            const res = await api.get('/api/user', { validateStatus: status => status < 500 });
            if (!res || res.status === 401 || res.message === 'Unauthenticated.' || res.error === 'Unauthenticated.') {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('is_logged_in');
                }
                resetCsrf();
                setUser(null);
                return;
            }
            if (res && res.id) {
                setUser(res);
            } else if (res && res.user) {
                setUser(res.user);
            } else {
                setUser(null);
            }
        } catch (e) {
            setUser(null);
        } finally {
            setAuthLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
        checkAuth();
    }, [fetchCategories, checkAuth]);

    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
            setFlash({});
        } else if (flash.error) {
            toast.error(flash.error);
            setFlash({});
        }
    }, [flash]);

    const login = async (email, password, remember = false) => {
        resetCsrf();
        const res = await api.post('/api/user/login', { email, password, remember });
        resetCsrf();
        if (res.token && typeof window !== 'undefined') {
            localStorage.setItem('auth_token', res.token);
            localStorage.setItem('is_logged_in', 'true');
        } else if (res.user && typeof window !== 'undefined') {
            localStorage.setItem('is_logged_in', 'true');
        }
        if (res.user) {
            setUser(res.user);
        }
        return res;
    };

    const adminLogin = async (email, password, remember = false) => {
        resetCsrf();
        const res = await api.post('/api/admin/login', { email, password, remember });
        resetCsrf();
        if (res.token && typeof window !== 'undefined') {
            localStorage.setItem('auth_token', res.token);
            localStorage.setItem('is_logged_in', 'true');
        } else if (res.user && typeof window !== 'undefined') {
            localStorage.setItem('is_logged_in', 'true');
        }
        if (res.user) {
            setUser(res.user);
        }
        return res;
    };

    const logout = async () => {
        try {
            await api.post('/api/user/logout');
        } catch (e) {
            console.error(e);
        } finally {
            resetCsrf();
            setUser(null);
            if (typeof window !== 'undefined') {
                localStorage.removeItem('auth_token');
                localStorage.removeItem('is_logged_in');
                window.location.href = '/login';
            }
        }
    };

    const adminLogout = async () => {
        try {
            await api.post('/api/admin/logout');
        } catch (e) {
            console.error(e);
        } finally {
            resetCsrf();
            setUser(null);
            if (typeof window !== 'undefined') {
                localStorage.removeItem('auth_token');
                localStorage.removeItem('is_logged_in');
                window.location.href = '/admin/login';
            }
        }
    };

    const value = {
        auth: {
            user,
            loading: authLoading,
        },
        user,
        authLoading,
        checkAuth,
        login,
        adminLogin,
        logout,
        adminLogout,
        navCategories,
        flash,
        setFlash,
        appName: 'Bigbestow',
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    return useContext(AppContext);
}
