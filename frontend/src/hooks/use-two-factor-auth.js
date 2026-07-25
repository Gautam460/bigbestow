'use client';

import { useCallback, useState } from 'react';
import api from '@/lib/api';

export const OTP_MAX_LENGTH = 6;

export const useTwoFactorAuth = () => {
    const [qrCodeSvg, setQrCodeSvg] = useState(null);
    const [manualSetupKey, setManualSetupKey] = useState(null);
    const [recoveryCodesList, setRecoveryCodesList] = useState([]);
    const [errors, setErrors] = useState([]);

    const hasSetupData = qrCodeSvg !== null && manualSetupKey !== null;

    const clearErrors = useCallback(() => {
        setErrors([]);
    }, []);

    const clearSetupData = useCallback(() => {
        setManualSetupKey(null);
        setQrCodeSvg(null);
        setErrors([]);
    }, []);

    const clearTwoFactorAuthData = useCallback(() => {
        setManualSetupKey(null);
        setQrCodeSvg(null);
        setErrors([]);
        setRecoveryCodesList([]);
    }, []);

    const fetchQrCode = useCallback(async () => {
        try {
            const res = await api.get('/api/user/two-factor-qr-code');
            setQrCodeSvg(res.svg || res.data?.svg);
        } catch {
            setErrors((prev) => [...prev, 'Failed to fetch QR code']);
            setQrCodeSvg(null);
        }
    }, []);

    const fetchSetupKey = useCallback(async () => {
        try {
            const res = await api.get('/api/user/two-factor-secret-key');
            setManualSetupKey(res.secretKey || res.data?.secretKey);
        } catch {
            setErrors((prev) => [...prev, 'Failed to fetch a setup key']);
            setManualSetupKey(null);
        }
    }, []);

    const fetchRecoveryCodes = useCallback(async () => {
        try {
            setErrors([]);
            const res = await api.get('/api/user/two-factor-recovery-codes');
            setRecoveryCodesList(Array.isArray(res) ? res : (res.data || []));
        } catch {
            setErrors((prev) => [...prev, 'Failed to fetch recovery codes']);
            setRecoveryCodesList([]);
        }
    }, []);

    const fetchSetupData = useCallback(async () => {
        try {
            setErrors([]);
            await Promise.all([fetchQrCode(), fetchSetupKey()]);
        } catch {
            setQrCodeSvg(null);
            setManualSetupKey(null);
        }
    }, [fetchQrCode, fetchSetupKey]);

    return {
        qrCodeSvg,
        manualSetupKey,
        recoveryCodesList,
        hasSetupData,
        errors,
        clearErrors,
        clearSetupData,
        clearTwoFactorAuthData,
        fetchQrCode,
        fetchSetupKey,
        fetchSetupData,
        fetchRecoveryCodes,
    };
};
