import { Head, useForm, Link } from '@inertiajs/react';
import { UserPlus, ArrowRight, Loader2, Mail, Lock, User, ShoppingBag } from 'lucide-react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/register', {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row-reverse">
            <Head title="Register | Bigbestow" />
            
            {/* Left Side: Branding/Image */}
            <div className="hidden md:flex md:w-1/2 bg-yellow-500 items-center justify-center p-12 relative overflow-hidden">
                <div className="absolute top-0 left-0 -ml-20 -mt-20 w-64 h-64 bg-yellow-400 rounded-full opacity-50 blur-3xl"></div>
                <div className="absolute bottom-0 right-0 -mr-20 -mb-20 w-80 h-80 bg-yellow-600 rounded-full opacity-30 blur-3xl"></div>
                
                <div className="relative z-10 text-center max-w-md">
                    <div className="bg-white p-4 rounded-3xl shadow-2xl inline-block mb-8 -rotate-3">
                        <UserPlus className="w-16 h-16 text-yellow-500" />
                    </div>
                    <h2 className="text-5xl font-black text-slate-900 leading-tight mb-6 italic tracking-tighter">
                        START YOUR <br/> <span className="text-white drop-shadow-md">CRICKET JOURNEY</span>
                    </h2>
                    <p className="text-slate-800 font-bold text-lg leading-relaxed">
                        Create an account to track orders and save your favorite gear.
                    </p>
                </div>
            </div>

            {/* Right Side: Register Form */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-white">
                <div className="w-full max-w-sm space-y-10">
                    <div className="text-center md:text-left">
                        <Link href="/" className="inline-flex items-center gap-2 font-black text-3xl tracking-tighter uppercase italic md:hidden mb-8">
                            <div className="w-10 h-10 bg-yellow-500 rounded-2xl flex items-center justify-center shadow-xl shadow-yellow-500/20">
                                <ShoppingBag className="w-6 h-6 text-white" />
                            </div>
                            Big<span className="text-yellow-500">bestow</span>
                        </Link>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Create Account</h1>
                        <p className="text-slate-400 font-bold text-sm mt-2">Enter your details to join Bigbestow</p>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-yellow-500 transition-colors">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full bg-slate-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-slate-900 placeholder-slate-300 focus:outline-none focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 transition-all font-bold"
                                        placeholder="Gautam Singh"
                                        required
                                    />
                                </div>
                                {errors.name && <p className="text-xs font-bold text-rose-500 mt-1 ml-1">{errors.name}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-yellow-500 transition-colors">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="w-full bg-slate-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-slate-900 placeholder-slate-300 focus:outline-none focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 transition-all font-bold"
                                        placeholder="your@email.com"
                                        required
                                    />
                                </div>
                                {errors.email && <p className="text-xs font-bold text-rose-500 mt-1 ml-1">{errors.email}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                                    <input
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="w-full bg-slate-50 border border-gray-100 rounded-2xl py-4 px-4 text-slate-900 placeholder-slate-300 focus:outline-none focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 transition-all font-bold"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm</label>
                                    <input
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        className="w-full bg-slate-50 border border-gray-100 rounded-2xl py-4 px-4 text-slate-900 placeholder-slate-300 focus:outline-none focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 transition-all font-bold"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>
                            {errors.password && <p className="text-xs font-bold text-rose-500 mt-1 ml-1">{errors.password}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-4 rounded-2xl shadow-xl shadow-slate-200 transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {processing ? <Loader2 className="w-5 h-5 animate-spin" /> : <><ArrowRight className="w-5 h-5" /> CREATE ACCOUNT</>}
                        </button>
                    </form>

                    <div className="text-center pt-4">
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                            Already a member?{' '}
                            <Link href="/login" className="text-yellow-600 hover:text-yellow-700 ml-1">
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

Register.layout = (page) => page;
