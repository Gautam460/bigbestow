'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Head } from '@/lib/inertia-compat';
import api from '@/lib/api';
import { Mail, ArrowRight, Loader2, ShoppingBag } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('');
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});
        setStatus('');
        try {
            const res = await api.post('/api/forgot-password', { email });
            setStatus(res.status || 'We have emailed your password reset link.');
        } catch (err) {
            if (err?.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else if (err?.response?.data?.message) {
                setErrors({ email: err.response.data.message });
            } else {
                setErrors({ email: 'Failed to send password reset link.' });
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFDFD] flex flex-col items-center justify-center p-6 font-sans">
            <Head title="Forgot Password | Bigbestow" />
            <div className="w-full max-w-md bg-white border border-gray-100 p-8 rounded-3xl shadow-xl">
                <div className="text-center mb-6">
                    <Link href="/" className="inline-flex items-center gap-2 font-black text-2xl tracking-tighter uppercase italic mb-2">
                        <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/20">
                            <ShoppingBag className="w-5 h-5 text-white" />
                        </div>
                        Big<span className="text-yellow-500">Bestow</span>
                    </Link>
                    <h1 className="text-xl font-bold text-gray-900">Forgot Password?</h1>
                    <p className="text-xs text-gray-500 mt-1">Enter your email and we&apos;ll send you a recovery link</p>
                </div>

                {status && (
                    <div className="mb-6 p-4 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold border border-emerald-100">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="email@example.com"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:bg-white"
                            />
                        </div>
                        {errors.email && <p className="text-xs font-bold text-rose-500 mt-1">{errors.email}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                    >
                        {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Send Recovery Link <ArrowRight className="w-4 h-4" /></>}
                    </button>
                </form>

                <div className="mt-6 text-center text-xs text-gray-500">
                    Remembered your password?{' '}
                    <Link href="/login" className="font-bold text-yellow-600 hover:text-yellow-700">
                        Log in
                    </Link>
                </div>
            </div>
        </div>
    );
}
