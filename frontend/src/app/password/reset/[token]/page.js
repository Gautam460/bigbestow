'use client';

import React, { useState, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Head } from '@/lib/inertia-compat';
import api from '@/lib/api';
import { Lock, ArrowRight, Loader2, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';

export default function ResetPasswordTokenPage({ params }) {
    const unwrappedParams = use(params);
    const token = unwrappedParams?.token || '';
    const searchParams = useSearchParams();
    const router = useRouter();

    const [data, setData] = useState({
        token: token,
        email: searchParams?.get('email') || '',
        password: '',
        password_confirmation: '',
    });
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});
        try {
            await api.post('/api/reset-password', data);
            toast.success('Password reset successfully!');
            router.push('/login');
        } catch (err) {
            if (err?.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else if (err?.response?.data?.message) {
                setErrors({ password: err.response.data.message });
            } else {
                setErrors({ password: 'Failed to reset password. Token may have expired.' });
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFDFD] flex flex-col items-center justify-center p-6 font-sans">
            <Head title="Reset Password | Bigbestow" />
            <div className="w-full max-w-md bg-white border border-gray-100 p-8 rounded-3xl shadow-xl">
                <div className="text-center mb-6">
                    <Link href="/" className="inline-flex items-center gap-2 font-black text-2xl tracking-tighter uppercase italic mb-2">
                        <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/20">
                            <ShoppingBag className="w-5 h-5 text-white" />
                        </div>
                        Big<span className="text-yellow-500">Bestow</span>
                    </Link>
                    <h1 className="text-xl font-bold text-gray-900">Set New Password</h1>
                    <p className="text-xs text-gray-500 mt-1">Please enter your new password below</p>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Email</label>
                        <input
                            type="email"
                            readOnly
                            value={data.email}
                            className="w-full bg-gray-100 border border-gray-200 rounded-xl py-3 px-4 text-sm font-medium text-gray-600 focus:outline-none"
                        />
                        {errors.email && <p className="text-xs font-bold text-rose-500 mt-1">{errors.email}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-2">New Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="password"
                                required
                                value={data.password}
                                onChange={(e) => setData(prev => ({ ...prev, password: e.target.value }))}
                                placeholder="••••••••"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:bg-white"
                            />
                        </div>
                        {errors.password && <p className="text-xs font-bold text-rose-500 mt-1">{errors.password}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Confirm New Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="password"
                                required
                                value={data.password_confirmation}
                                onChange={(e) => setData(prev => ({ ...prev, password_confirmation: e.target.value }))}
                                placeholder="••••••••"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:bg-white"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                    >
                        {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Reset Password <ArrowRight className="w-4 h-4" /></>}
                    </button>
                </form>
            </div>
        </div>
    );
}
