import { Head, useForm, Link } from '@inertiajs/react';
import { ShieldCheck, Lock, Mail, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import { useEffect } from 'react';

export default function Login({ status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post('/admin/login', {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center pt-[8vh] p-4 selection:bg-indigo-500/30 font-sans">
            <Head title="Secure Admin Access | BigBestow" />
            
            {/* Background Decorative Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
            </div>

            <div className="w-full max-w-[420px] relative z-10 animate-in fade-in zoom-in duration-500">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-blue-600 p-[1px] mb-6 shadow-2xl shadow-indigo-500/20">
                        <div className="w-full h-full rounded-[23px] bg-[#0A0A0A] flex items-center justify-center">
                            <ShieldCheck className="w-10 h-10 text-indigo-500" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tight uppercase">
                        Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-500">Portal</span>
                    </h1>
                </div>

                {/* Floating Card Design */}
                <div className="bg-[#0D0D0D] border border-white/5 p-8 rounded-[40px] shadow-2xl backdrop-blur-xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {status && (
                        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 text-xs font-bold text-center animate-in slide-in-from-top duration-300">
                            {status}
                        </div>
                    )}

                    {Object.keys(errors).length > 0 && (
                        <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top duration-300">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>Invalid authentication credentials.</span>
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-6 relative z-10">
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] ml-1">Identity</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-600" />
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="w-full bg-[#151515] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-neutral-700 focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all font-medium"
                                        placeholder="admin@bigbestow.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] ml-1">Access Key</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-600" />
                                    <input
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="w-full bg-[#151515] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-neutral-700 focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all font-medium"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full group bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-500/20 transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {processing ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                <>
                                    <span>AUTHORIZE LOGIN</span>
                                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="mt-8 text-center">
                    <Link href="/" className="text-[10px] font-black text-neutral-600 hover:text-indigo-400 uppercase tracking-[0.2em] transition-colors">
                        Return to Public Terminal
                    </Link>
                </div>
            </div>
        </div>
    );
}
