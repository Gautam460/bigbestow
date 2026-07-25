'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Head } from '@/lib/inertia-compat';
import api from '@/lib/api';
import { Lock, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ConfirmPasswordPage() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    const submit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});
        try {
            await api.post('/api/user/confirm-password', { password });
            toast.success('Password confirmed!');
            router.push('/dashboard');
        } catch (err) {
            if (err?.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else {
                setErrors({ password: 'Incorrect password.' });
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFDFD] flex flex-col items-center justify-center p-6 font-sans">
            <Head title="Confirm Password | Bigbestow" />
            <div className="w-full max-w-md bg-white border border-gray-100 p-8 rounded-3xl shadow-xl">
                <div className="text-center mb-6">
                    <h1 className="text-xl font-bold text-gray-900">Confirm Your Password</h1>
                    <p className="text-xs text-gray-500 mt-1">This is a secure area of the application. Please confirm your password before continuing.</p>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:bg-white"
                            />
                        </div>
                        {errors.password && <p className="text-xs font-bold text-rose-500 mt-1">{errors.password}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                    >
                        {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Confirm Password <ArrowRight className="w-4 h-4" /></>}
                    </button>
                </form>
            </div>
        </div>
    );
}
