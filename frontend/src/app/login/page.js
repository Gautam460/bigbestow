'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Head } from '@/lib/inertia-compat';
import { useApp } from '@/context/AppContext';
import { ShoppingBag, ArrowRight, Loader2, Mail, Lock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
    const router = useRouter();
    const { login } = useApp();
    const [data, setData] = useState({
        email: '',
        password: '',
        remember: false,
    });
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState('');

    const submit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});
        try {
            const res = await login(data.email, data.password, data.remember);
            toast.success(res?.message || 'Logged in successfully!');
            router.push('/dashboard');
        } catch (err) {
            let errorMsg = 'Invalid login details. Please try again.';
            if (err?.response?.status === 422 && err.response.data.errors) {
                errorMsg = Object.values(err.response.data.errors).flat().join(' ');
                setErrors(err.response.data.errors);
            } else if (err?.response?.data?.message) {
                errorMsg = err.response.data.message;
                setErrors({ email: errorMsg });
            } else {
                setErrors({ email: errorMsg });
            }
            toast.error(errorMsg);
        } finally {
            setProcessing(false);
        }
    };

    const fillCredentials = (demoEmail, demoPass) => {
        setData(prev => ({ ...prev, email: demoEmail, password: demoPass }));
        toast.info(`Filled credentials for ${demoEmail}`);
    };

    return (
        <div className="min-h-screen bg-[#FDFDFD] flex flex-col items-center pt-[5vh] lg:pt-0 lg:flex-row lg:items-center justify-center p-6 relative overflow-hidden font-sans">
            <Head title="Login | Bigbestow" />
            
            {/* Artistic Background */}
            <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-yellow-500/10 blur-[120px] rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-yellow-500/5 blur-[100px] rounded-full -ml-20 -mb-20"></div>

            <div className="w-full max-w-[440px] relative z-10 animate-in fade-in zoom-in duration-500">
                {/* Brand Header */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block mb-4">
                        <div className="w-16 h-16 rounded-[24px] bg-slate-900 flex items-center justify-center text-yellow-500 font-black text-2xl shadow-xl shadow-slate-200">
                            B
                        </div>
                    </Link>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Welcome Back</h1>
                    <p className="text-slate-400 font-bold text-xs mt-1 uppercase tracking-widest">Sign in to your account</p>
                </div>

                <div className="bg-white p-8 md:p-10 rounded-[36px] shadow-2xl shadow-slate-200 border border-gray-100 relative overflow-hidden">
                    
                    {status && (
                        <div className="mb-6 p-4 bg-emerald-50 text-emerald-600 rounded-2xl text-xs font-bold border border-emerald-100 animate-in fade-in duration-300">
                            {status}
                        </div>
                    )}

                    {Object.keys(errors).length > 0 && (
                        <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-[20px] text-rose-600 text-xs font-bold flex items-center gap-3 animate-in slide-in-from-top duration-300">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{Object.values(errors)[0] || 'Invalid login details. Please try again.'}</span>
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-yellow-500 transition-colors" />
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData(prev => ({ ...prev, email: e.target.value }))}
                                        className="w-full bg-gray-50/50 border border-gray-100 rounded-[24px] py-5 pl-14 pr-4 text-slate-900 placeholder-slate-300 focus:outline-none focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 transition-all font-bold"
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between px-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
                                    <Link href="/password/reset" className="text-[10px] font-black text-yellow-600 hover:text-yellow-700 uppercase tracking-widest">
                                        Forgot?
                                    </Link>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-yellow-500 transition-colors" />
                                    <input
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData(prev => ({ ...prev, password: e.target.value }))}
                                        className="w-full bg-gray-50/50 border border-gray-100 rounded-[24px] py-5 pl-14 pr-4 text-slate-900 placeholder-slate-300 focus:outline-none focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 transition-all font-bold"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-5 rounded-[24px] shadow-2xl shadow-slate-200 transform hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {processing ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                <>
                                    <span>LOGIN TO ACCOUNT</span>
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>

                        <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Quick Test Credentials</span>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => fillCredentials('user@bigbestow.com', 'password123')}
                                    className="flex-1 py-2 px-3 bg-gray-50 hover:bg-yellow-50 border border-gray-100 rounded-xl text-[11px] font-bold text-slate-700 hover:text-yellow-700 transition-all text-center"
                                >
                                    Customer Fill
                                </button>
                                <button
                                    type="button"
                                    onClick={() => fillCredentials('gautam@gmail.com', 'password123')}
                                    className="flex-1 py-2 px-3 bg-gray-50 hover:bg-yellow-50 border border-gray-100 rounded-xl text-[11px] font-bold text-slate-700 hover:text-yellow-700 transition-all text-center"
                                >
                                    Gautam Fill
                                </button>
                            </div>
                        </div>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                            New to Bigbestow?{' '}
                            <Link href="/register" className="text-yellow-600 hover:text-yellow-700 ml-1">
                                Create Free Account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
