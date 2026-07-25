import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

const axiosInstance = axios.create({
    baseURL: typeof window !== 'undefined' ? '' : API_URL,
    withCredentials: true,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
    },
});

// Ensure CSRF cookie before mutating requests
// If CSRF cookie fails (e.g. 500 on server), don't block the actual request
// Login will still work via token-based auth
let csrfCookiePromise = null;
const ensureCsrf = async () => {
    if (typeof window === 'undefined') return;
    if (!csrfCookiePromise) {
        csrfCookiePromise = axiosInstance.get('/sanctum/csrf-cookie').catch((err) => {
            csrfCookiePromise = null;
            console.warn('CSRF cookie fetch failed, proceeding without it:', err?.message);
            // Don't throw - let the actual request proceed
        });
    }
    return csrfCookiePromise;
};

export const resetCsrf = () => {
    csrfCookiePromise = null;
};

axiosInstance.interceptors.request.use(async (config) => {
    if (typeof window !== 'undefined' && ['post', 'put', 'delete', 'patch'].includes(config.method?.toLowerCase())) {
        await ensureCsrf();
    }
    // Also attach token from localStorage if present as fallback
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
    }
    return config;
});

axiosInstance.interceptors.response.use(
    (response) => {
        if (response.status === 419 || response.status === 401) {
            resetCsrf();
        }
        // If this is an Inertia response from Laravel backend, return the props directly
        if (response.data && response.data.component && response.data.props) {
            return response.data.props;
        }
        return response.data;
    },
    (error) => {
        if (error.response && (error.response.status === 419 || error.response.status === 401)) {
            resetCsrf();
        }
        return Promise.reject(error);
    }
);

export const api = {
    get: (url, config = {}) => axiosInstance.get(url, config),
    post: (url, data = {}, config = {}) => axiosInstance.post(url, data, config),
    put: (url, data = {}, config = {}) => axiosInstance.put(url, data, config),
    delete: (url, config = {}) => axiosInstance.delete(url, config),
    patch: (url, data = {}, config = {}) => axiosInstance.patch(url, data, config),
    instance: axiosInstance,
    resetCsrf,
};

export default api;
