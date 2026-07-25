'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Head } from '@/lib/inertia-compat';
import api from '@/lib/api';
import { ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export default function TwoFactorChallengePage() {
    const router = useRouter();
    const [showRecoveryInput, setShowRecoveryInput] = useState(false);
    const [code, setCode] = useState('');
    const [recoveryCode, setRecoveryCode] = useState('');
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    const submit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});
        try {
            const payload = showRecoveryInput ? { recovery_code: recoveryCode } : { code };
            await api.post('/api/two-factor-challenge', payload);
            toast.success('Authenticated successfully!');
            router.push('/dashboard');
        } catch (err) {
            if (err?.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else {
                setErrors({ code: 'Invalid authentication code or recovery code.' });
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFDFD] flex flex-col items-center justify-center p-6 font-sans">
            <Head title="Two-Factor Authentication | Bigbestow" />
            <div className="w-full max-w-md bg-white border border-gray-100 p-8 rounded-3xl shadow-xl text-center">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <ShieldCheck className="w-6 h-6" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">
                    {showRecoveryInput ? 'Recovery Code' : 'Two-Factor Authentication'}
                </h1>
                <p className="text-xs text-gray-500 mt-1 mb-6">
                    {showRecoveryInput 
                        ? 'Please confirm access to your account by entering one of your emergency recovery codes.'
                        : 'Enter the authentication code provided by your authenticator application.'}
                </p>

                <form onSubmit={submit} className="space-y-4 text-left">
                    {showRecoveryInput ? (
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Recovery Code</label>
                            <input
                                type="text"
                                required
                                value={recoveryCode}
                                onChange={(e) => setRecoveryCode(e.target.value)}
                                placeholder="Enter recovery code"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            {errors.recovery_code && <p className="text-xs font-bold text-rose-500 mt-1">{errors.recovery_code}</p>}
                        </div>
                    ) : (
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Authentication Code</label>
                            <input
                                type="text"
                                required
                                maxLength="6"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="123456"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-center tracking-widest text-lg font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            {errors.code && <p className="text-xs font-bold text-rose-500 mt-1">{errors.code}</p>}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                    >
                        {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Login <ArrowRight className="w-4 h-4" /></>}
                    </button>
                </form>

                <button
                    type="button"
                    onClick={() => {
                        setShowRecoveryInput(!showRecoveryInput);
                        setErrors({});
                        setCode('');
                        setRecoveryCode('');
                    }}
                    className="mt-6 text-xs text-indigo-600 hover:text-indigo-700 font-bold underline"
                >
                    {showRecoveryInput ? 'Login using an authentication code' : 'Login using a recovery code'}
                </button>
            </div>
        </div>
    );
}
