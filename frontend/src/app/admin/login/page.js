'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Head } from '@/lib/inertia-compat';
import { ShieldCheck, Lock, Mail, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import api from '@/lib/api';
import { useApp } from '@/context/AppContext';
import { toast } from 'sonner';

export default function AdminLoginPage() {
    const router = useRouter();
    const { adminLogin } = useApp() || {};
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');

    const submit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setError('');
        try {
            if (adminLogin) {
                await adminLogin(email, password);
            } else {
                const res = await api.post('/api/admin/login', { email, password });
                if (res && res.token && typeof window !== 'undefined') {
                    localStorage.setItem('auth_token', res.token);
                }
            }
            toast.success('Admin authorized successfully!');
            router.push('/admin');
        } catch (err) {
            let errorMsg = 'Invalid admin credentials or unauthorized access.';
            if (err?.response?.status === 422 && err.response?.data?.errors) {
                errorMsg = Object.values(err.response.data.errors).flat().join(' ');
            } else if (err?.response?.data?.message) {
                errorMsg = err.response.data.message;
            }
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setProcessing(false);
        }
    };

    const fillCredentials = (demoEmail, demoPass) => {
        setEmail(demoEmail);
        setPassword(demoPass);
        toast.info(`Filled credentials for ${demoEmail}`);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#050505] flex flex-col items-center justify-center p-4 selection:bg-indigo-500/30 font-sans transition-colors duration-300">
            <Head title="Secure Admin Access | Bigbestow" />
            
            {/* Background Decorative Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
            </div>

            <div className="w-full max-w-[420px] relative z-10 animate-in fade-in zoom-in duration-500">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-blue-600 p-[1px] mb-6 shadow-2xl shadow-indigo-500/20">
                        <div className="w-full h-full rounded-[23px] bg-white dark:bg-[#0A0A0A] flex items-center justify-center transition-colors duration-300">
                            <ShieldCheck className="w-10 h-10 text-indigo-500" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase transition-colors duration-300">
                        Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-500">Portal</span>
                    </h1>
                </div>

                {/* Floating Card Design */}
                <div className="bg-white dark:bg-[#0D0D0D] border border-slate-200 dark:border-white/5 p-8 rounded-[40px] shadow-2xl backdrop-blur-xl relative overflow-hidden group transition-colors duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {error && (
                        <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top duration-300">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-6 relative z-10">
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 dark:text-neutral-500 uppercase tracking-[0.2em] ml-1">Identity</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-neutral-600" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-[#151515] border border-slate-200 dark:border-white/5 rounded-2xl py-4 pl-12 pr-4 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-700 focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all font-medium text-sm"
                                        placeholder="admin@bigbestow.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 dark:text-neutral-500 uppercase tracking-[0.2em] ml-1">Access Key</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-neutral-600" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-[#151515] border border-slate-200 dark:border-white/5 rounded-2xl py-4 pl-12 pr-4 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-700 focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all font-medium text-sm"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full group bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-500/20 transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
                        >
                            {processing ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                <>
                                    <span>AUTHORIZE LOGIN</span>
                                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>

                        <div className="pt-4 border-t border-slate-200 dark:border-white/5 flex flex-col gap-2 transition-colors duration-300">
                            <span className="text-[10px] font-bold text-slate-500 dark:text-neutral-500 uppercase tracking-wider text-center">Quick Test Credentials</span>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => fillCredentials('superadmin@bigbestow.com', 'password123')}
                                    className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5 rounded-xl text-[11px] font-bold text-indigo-600 dark:text-indigo-400 transition-all text-center"
                                >
                                    Super Admin Fill
                                </button>
                                <button
                                    type="button"
                                    onClick={() => fillCredentials('admin@bigbestow.com', 'password123')}
                                    className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5 rounded-xl text-[11px] font-bold text-blue-600 dark:text-blue-400 transition-all text-center"
                                >
                                    Store Admin Fill
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
