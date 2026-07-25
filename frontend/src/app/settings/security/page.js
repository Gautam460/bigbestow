'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Head } from '@/lib/inertia-compat';
import { ShieldCheck, Loader2 } from 'lucide-react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TwoFactorRecoveryCodes from '@/components/two-factor-recovery-codes';
import TwoFactorSetupModal from '@/components/two-factor-setup-modal';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useTwoFactorAuth } from '@/hooks/use-two-factor-auth';
import SettingsLayout from '@/layouts/settings/layout';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function SecurityPage({
    canManageTwoFactor = true,
    requiresConfirmation = true,
    passwordRules = [],
}) {
    const passwordInput = useRef(null);
    const currentPasswordInput = useRef(null);

    // Password State
    const [currentPassword, setCurrentPassword] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [processing, setProcessing] = useState(false);
    const [pwdErrors, setPwdErrors] = useState({});

    // 2FA State
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [twoFactorProcessing, setTwoFactorProcessing] = useState(false);

    const {
        qrCodeSvg,
        hasSetupData,
        manualSetupKey,
        clearSetupData,
        clearTwoFactorAuthData,
        fetchSetupData,
        recoveryCodesList,
        fetchRecoveryCodes,
        errors: tfaErrors,
    } = useTwoFactorAuth();

    const [showSetupModal, setShowSetupModal] = useState(false);

    // Check if 2FA is currently enabled on mount
    useEffect(() => {
        api.get('/api/user').then(res => {
            if (res && res.two_factor_secret) {
                setTwoFactorEnabled(true);
            } else if (res && res.data && res.data.two_factor_secret) {
                setTwoFactorEnabled(true);
            }
        }).catch(() => {});
    }, []);

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setPwdErrors({});
        try {
            await api.put('/api/user/password', {
                current_password: currentPassword,
                password: password,
                password_confirmation: passwordConfirmation,
            });
            toast.success('Password updated successfully!');
            setCurrentPassword('');
            setPassword('');
            setPasswordConfirmation('');
        } catch (err) {
            if (err?.response?.data?.errors) {
                setPwdErrors(err.response.data.errors);
                if (err.response.data.errors.password) passwordInput.current?.focus();
                else if (err.response.data.errors.current_password) currentPasswordInput.current?.focus();
            } else {
                toast.error('Failed to update password.');
            }
        } finally {
            setProcessing(false);
        }
    };

    const handleEnable2FA = async (e) => {
        if (e) e.preventDefault();
        setTwoFactorProcessing(true);
        try {
            await api.post('/api/user/two-factor-authentication');
            await fetchSetupData();
            setShowSetupModal(true);
        } catch (err) {
            toast.error('Failed to enable Two-Factor Authentication.');
        } finally {
            setTwoFactorProcessing(false);
        }
    };

    const handleDisable2FA = async (e) => {
        if (e) e.preventDefault();
        setTwoFactorProcessing(true);
        try {
            await api.delete('/api/user/two-factor-authentication');
            setTwoFactorEnabled(false);
            clearTwoFactorAuthData();
            toast.success('Two-Factor Authentication disabled.');
        } catch (err) {
            toast.error('Failed to disable Two-Factor Authentication.');
        } finally {
            setTwoFactorProcessing(false);
        }
    };

    return (
        <SettingsLayout>
            <div className="space-y-10">
                <Head title="Security settings | Bigbestow" />
                <h1 className="sr-only">Security settings</h1>

                <div className="space-y-6">
                    <Heading
                        variant="small"
                        title="Update password"
                        description="Ensure your account is using a long, random password to stay secure"
                    />

                    <form onSubmit={handleUpdatePassword} className="space-y-6 max-w-xl">
                        <div className="grid gap-2">
                            <Label htmlFor="current_password">Current password</Label>
                            <PasswordInput
                                id="current_password"
                                ref={currentPasswordInput}
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="mt-1 block w-full bg-white dark:bg-slate-800/80 border-gray-200 dark:border-slate-700 text-slate-900 dark:text-white"
                                autoComplete="current-password"
                                placeholder="Current password"
                                required
                            />
                            {pwdErrors.current_password && <InputError message={pwdErrors.current_password[0]} />}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">New password</Label>
                            <PasswordInput
                                id="password"
                                ref={passwordInput}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full bg-white dark:bg-slate-800/80 border-gray-200 dark:border-slate-700 text-slate-900 dark:text-white"
                                autoComplete="new-password"
                                placeholder="New password"
                                passwordrules={passwordRules}
                                required
                            />
                            {pwdErrors.password && <InputError message={pwdErrors.password[0]} />}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation">Confirm password</Label>
                            <PasswordInput
                                id="password_confirmation"
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                className="mt-1 block w-full bg-white dark:bg-slate-800/80 border-gray-200 dark:border-slate-700 text-slate-900 dark:text-white"
                                autoComplete="new-password"
                                placeholder="Confirm password"
                                passwordrules={passwordRules}
                                required
                            />
                            {pwdErrors.password_confirmation && <InputError message={pwdErrors.password_confirmation[0]} />}
                        </div>

                        <div className="flex items-center gap-4">
                            <Button type="submit" disabled={processing} className="bg-slate-900 hover:bg-slate-800 text-white dark:bg-indigo-600 dark:hover:bg-indigo-500 font-bold px-6">
                                {processing && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                                Save Password
                            </Button>
                        </div>
                    </form>
                </div>

                {canManageTwoFactor && (
                    <div className="border-t border-gray-100 pt-8 space-y-6 max-w-xl">
                        <Heading
                            variant="small"
                            title="Two-factor authentication"
                            description="Manage your two-factor authentication settings"
                        />
                        {twoFactorEnabled ? (
                            <div className="flex flex-col items-start justify-start space-y-4">
                                <p className="text-sm text-muted-foreground">
                                    You will be prompted for a secure, random pin during login, which you can retrieve from the TOTP-supported application on your phone.
                                </p>

                                <div className="relative inline">
                                    <Button
                                        variant="destructive"
                                        onClick={handleDisable2FA}
                                        disabled={twoFactorProcessing}
                                        className="font-bold bg-rose-600 hover:bg-rose-700 text-white"
                                    >
                                        {twoFactorProcessing && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                                        Disable 2FA
                                    </Button>
                                </div>

                                <div className="w-full">
                                    <TwoFactorRecoveryCodes
                                        recoveryCodesList={recoveryCodesList}
                                        fetchRecoveryCodes={fetchRecoveryCodes}
                                        errors={tfaErrors}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-start justify-start space-y-4">
                                <p className="text-sm text-muted-foreground">
                                    When you enable two-factor authentication, you will be prompted for a secure pin during login. This pin can be retrieved from a TOTP-supported application on your phone.
                                </p>

                                <div>
                                    {hasSetupData ? (
                                        <Button
                                            onClick={() => setShowSetupModal(true)}
                                            className="bg-indigo-600 hover:bg-indigo-700 font-bold text-white flex items-center gap-2"
                                        >
                                            <ShieldCheck className="w-4 h-4" />
                                            Continue setup
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={handleEnable2FA}
                                            disabled={twoFactorProcessing}
                                            className="bg-slate-900 hover:bg-slate-800 font-bold text-white flex items-center gap-2"
                                        >
                                            {twoFactorProcessing && <Loader2 className="w-4 h-4 animate-spin" />}
                                            <ShieldCheck className="w-4 h-4" />
                                            Enable 2FA
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}

                        <TwoFactorSetupModal
                            isOpen={showSetupModal}
                            onClose={() => {
                                setShowSetupModal(false);
                                setTwoFactorEnabled(true);
                            }}
                            requiresConfirmation={requiresConfirmation}
                            twoFactorEnabled={twoFactorEnabled}
                            qrCodeSvg={qrCodeSvg}
                            manualSetupKey={manualSetupKey}
                            clearSetupData={clearSetupData}
                            fetchSetupData={fetchSetupData}
                            errors={tfaErrors}
                        />
                    </div>
                )}
            </div>
        </SettingsLayout>
    );
}
