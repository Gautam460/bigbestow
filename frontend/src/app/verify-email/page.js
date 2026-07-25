'use client';

import React, { useState } from 'react';
import { Head } from '@/lib/inertia-compat';
import { useApp } from '@/context/AppContext';
import api from '@/lib/api';
import { MailCheck, Loader2 } from 'lucide-react';

export default function VerifyEmailPage() {
    const { logout } = useApp();
    const [status, setStatus] = useState('');
    const [processing, setProcessing] = useState(false);

    const resendVerification = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setStatus('');
        try {
            await api.post('/email/verification-notification');
            setStatus('verification-link-sent');
        } catch (err) {
            console.error(err);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFDFD] flex flex-col items-center justify-center p-6 font-sans">
            <Head title="Verify Email | Bigbestow" />
            <div className="w-full max-w-md bg-white border border-gray-100 p-8 rounded-3xl shadow-xl text-center">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <MailCheck className="w-6 h-6" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">Verify Your Email</h1>
                <p className="text-xs text-gray-500 mt-2 mb-6">
                    Thanks for signing up! Before getting started, could you verify your email address by clicking on the link we just emailed to you?
                </p>

                {status === 'verification-link-sent' && (
                    <div className="mb-6 p-4 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold border border-emerald-100">
                        A new verification link has been sent to the email address you provided during registration.
                    </div>
                )}

                <form onSubmit={resendVerification} className="space-y-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                    >
                        {processing && <Loader2 className="w-4 h-4 animate-spin" />}
                        Resend Verification Email
                    </button>
                </form>

                <button
                    onClick={() => logout()}
                    className="mt-6 text-xs text-gray-500 hover:text-gray-700 font-bold underline block mx-auto"
                >
                    Log Out
                </button>
            </div>
        </div>
    );
}
