'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../context/AppContext';
import api from './api';

export function usePage() {
    const context = useApp();
    if (!context) {
        return {
            props: {
                auth: { user: null },
                flash: {},
                navCategories: [],
                appName: 'Bigbestow',
            },
        };
    }
    return {
        props: {
            auth: context.auth,
            flash: context.flash,
            navCategories: context.navCategories,
            appName: context.appName,
        },
    };
}

export function useForm(initialData = {}) {
    const [data, setDataState] = useState(initialData);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});
    const router = useRouter();
    const { setFlash, checkAuth } = useApp() || {};

    const setData = useCallback((keyOrData, value) => {
        if (typeof keyOrData === 'string') {
            setDataState((prev) => ({ ...prev, [keyOrData]: value }));
        } else if (typeof keyOrData === 'function') {
            setDataState(keyOrData);
        } else {
            setDataState((prev) => ({ ...prev, ...keyOrData }));
        }
    }, []);

    const reset = useCallback((...keys) => {
        if (keys.length === 0) {
            setDataState(initialData);
        } else {
            setDataState((prev) => {
                const next = { ...prev };
                keys.forEach((key) => {
                    if (key in initialData) next[key] = initialData[key];
                });
                return next;
            });
        }
    }, [initialData]);

    const clearErrors = useCallback((...keys) => {
        if (keys.length === 0) {
            setErrors({});
        } else {
            setErrors((prev) => {
                const next = { ...prev };
                keys.forEach((key) => delete next[key]);
                return next;
            });
        }
    }, []);

    const submitRequest = async (method, url, requestData, options = {}) => {
        setProcessing(true);
        setErrors({});
        try {
            let res;
            // Map common login/register URL paths directly to api endpoints if needed
            let targetUrl = url;
            if (targetUrl === '/login') targetUrl = '/api/login';
            if (targetUrl === '/admin/login') targetUrl = '/api/admin/login';
            if (targetUrl === '/logout') targetUrl = '/api/logout';
            if (targetUrl === '/register') targetUrl = '/api/register';

            if (method === 'post') res = await api.post(targetUrl, requestData);
            else if (method === 'put') res = await api.put(targetUrl, requestData);
            else if (method === 'delete') res = await api.delete(targetUrl);
            else res = await api.get(targetUrl, { params: requestData });

            if (checkAuth) await checkAuth();

            if (res && res.message && setFlash) {
                setFlash({ success: res.message });
            }

            if (options.onSuccess) {
                options.onSuccess(res);
            }

            if (targetUrl === '/api/login' || url === '/login') {
                window.location.href = '/dashboard';
            } else if (targetUrl === '/api/admin/login' || url === '/admin/login') {
                window.location.href = '/admin/dashboard';
            } else if (targetUrl === '/api/logout' || url === '/logout') {
                window.location.href = '/login';
            } else if (res && res.redirect) {
                router.push(res.redirect);
            }
            return res;
        } catch (err) {
            const errData = err.response?.data;
            if (errData && errData.errors) {
                const parsedErrors = {};
                Object.keys(errData.errors).forEach((k) => {
                    parsedErrors[k] = Array.isArray(errData.errors[k]) ? errData.errors[k][0] : errData.errors[k];
                });
                setErrors(parsedErrors);
            } else if (errData && errData.message) {
                setErrors({ email: errData.message, general: errData.message });
            }
            if (options.onError) {
                options.onError(errors);
            }
        } finally {
            setProcessing(false);
            if (options.onFinish) {
                options.onFinish();
            }
        }
    };

    return {
        data,
        setData,
        post: (url, options) => submitRequest('post', url, data, options),
        put: (url, options) => submitRequest('put', url, data, options),
        delete: (url, options) => submitRequest('delete', url, null, options),
        get: (url, options) => submitRequest('get', url, data, options),
        processing,
        errors,
        reset,
        clearErrors,
    };
}

export const router = {
    visit: (url) => {
        if (typeof window !== 'undefined') window.location.href = url;
    },
    get: (url) => {
        if (typeof window !== 'undefined') window.location.href = url;
    },
    post: async (url, data = {}) => {
        await api.post(url, data);
        if (typeof window !== 'undefined') window.location.reload();
    },
    delete: async (url) => {
        await api.delete(url);
        if (typeof window !== 'undefined') window.location.reload();
    },
};

export function Head({ title }) {
    useEffect(() => {
        if (title && typeof document !== 'undefined') {
            document.title = title;
        }
    }, [title]);
    return null;
}
