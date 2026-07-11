import { Head, useForm, Link } from '@inertiajs/react';
import { ShoppingBag, ArrowRight, Loader2, Mail, Lock, AlertCircle } from 'lucide-react';

export default function Login({ status, canResetPassword, canRegister }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post('/login', {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen bg-[#FDFDFD] flex flex-col items-center pt-[5vh] lg:pt-0 lg:flex-row lg:items-center justify-center p-6 relative overflow-hidden font-sans">
            <Head title="Login | Bigbestow" />
            
            {/* Artistic Background */}
            <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-yellow-500/10 blur-[120px] rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-yellow-500/5 blur-[100px] rounded-full -ml-20 -mb-20"></div>

            <div className="w-full max-w-[460px] relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="text-center mb-10">
                    <Link href="/" className="inline-flex items-center gap-2 font-black text-3xl tracking-tighter uppercase italic mb-4">
                        <div className="w-12 h-12 bg-yellow-500 rounded-2xl flex items-center justify-center shadow-xl shadow-yellow-500/20">
                            <ShoppingBag className="w-7 h-7 text-white" />
                        </div>
                        Big<span className="text-yellow-500">Bestow</span>
                    </Link>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Login to your account</h1>
                    <p className="text-slate-400 font-bold text-sm mt-1 uppercase tracking-widest text-[10px]">Premium Cricket Equipment Store</p>
                </div>

                {/* Floating Card Design (Popup Style) */}
                <div className="bg-white border border-gray-100 p-10 rounded-[48px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] relative overflow-hidden">
                    
                    {status && (
                        <div className="mb-6 p-4 bg-emerald-50 text-emerald-600 rounded-2xl text-xs font-bold border border-emerald-100 animate-in fade-in duration-300">
                            {status}
                        </div>
                    )}

                    {Object.keys(errors).length > 0 && (
                        <div className="mb-6 p-4 bg-rose-50 text-rose-600 rounded-2xl text-xs font-bold border border-rose-100 flex items-center gap-2 animate-in shake duration-500">
                            <AlertCircle className="w-4 h-4" />
                            <span>Invalid login details. Please try again.</span>
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
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="w-full bg-gray-50/50 border border-gray-100 rounded-[24px] py-5 pl-14 pr-4 text-slate-900 placeholder-slate-300 focus:outline-none focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 transition-all font-bold"
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between px-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
                                    {canResetPassword && (
                                        <Link href="/password/reset" className="text-[10px] font-black text-yellow-600 hover:text-yellow-700 uppercase tracking-widest">
                                            Forgot?
                                        </Link>
                                    )}
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-yellow-500 transition-colors" />
                                    <input
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
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
                    </form>

                    {canRegister && (
                        <div className="mt-8 text-center">
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                New to Bigbestow?{' '}
                                <Link href="/register" className="text-yellow-600 hover:text-yellow-700 ml-1">
                                    Create Free Account
                                </Link>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

Login.layout = (page) => page;
