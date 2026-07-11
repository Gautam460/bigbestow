import React, { useState, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { toast } from 'sonner';
import { 
    LayoutDashboard, 
    ShoppingCart, 
    Tags, 
    Users, 
    Gift, 
    PackageSearch, 
    Image as ImageIcon,
    LogOut,
    Menu,
    Trophy,
    Layers,
    Boxes,
    Search,
    Bell,
    X,
    ShieldCheck,
    Settings,
    ExternalLink,
    CheckCircle,
    AlertCircle
} from 'lucide-react';

export default function AdminLayout({ children }) {
    const page = usePage();
    const url = page.url || '';
    const auth = page.props?.auth || {};
    const flash = page.props?.flash || {};
    const errors = page.props?.errors || {};
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState(null);

    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
            setAlertMessage({ type: 'success', text: flash.success });
        } else if (flash.error) {
            toast.error(flash.error);
            setAlertMessage({ type: 'error', text: flash.error });
        } else if (Object.keys(errors).length > 0) {
            const firstError = Object.values(errors)[0];
            toast.error('Validation Error: ' + firstError);
            setAlertMessage({ type: 'error', text: 'Validation failed. Please check the highlighted fields.' });
        } else {
            setAlertMessage(null);
        }
    }, [flash.success, flash.error, JSON.stringify(errors)]);

    const navigation = [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, category: 'Main' },
        { name: 'Products', href: '/admin/products', icon: PackageSearch, category: 'Catalog' },
        { name: 'Categories', href: '/admin/categories', icon: Tags, category: 'Catalog' },
        { name: 'Subcategories', href: '/admin/subcategories', icon: Layers, category: 'Catalog' },
        { name: 'Inventory & Stock', href: '/admin/inventory', icon: Boxes, category: 'Catalog' },
        { name: 'Orders', href: '/admin/orders', icon: ShoppingCart, category: 'Sales' },
        { name: 'Coupons & Deals', href: '/admin/coupons', icon: Gift, category: 'Sales' },
        { name: 'Customers & Users', href: '/admin/users', icon: Users, category: 'Users' },
        { name: 'Banners & Offers', href: '/admin/banners', icon: ImageIcon, category: 'Marketing' },
        { name: 'Roles & Permissions', href: '/admin/permissions', icon: ShieldCheck, category: 'System' },
        { name: 'Store Settings', href: '/admin/settings', icon: Settings, category: 'System' },
    ];

    const isActive = (href) => {
        if (href === '/admin') return url === '/admin' || url === '/admin/dashboard';
        return url.startsWith(href);
    };

    const groupedNav = navigation.reduce((acc, item) => {
        acc[item.category] = acc[item.category] || [];
        acc[item.category].push(item);
        return acc;
    }, {});

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex font-sans">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex w-72 bg-slate-950 border-r border-slate-800 flex-col fixed inset-y-0 left-0 z-50 shadow-2xl">
                <div className="flex items-center gap-4 px-6 bg-slate-950 border-b border-slate-800" style={{ height: '120px' }}>
                    <Link href="/admin" className="flex items-center gap-3">
                        <img
                            src="/images/logo.png"
                            alt="Big bestow"
                            className="w-auto object-contain brightness-0 invert"
                            style={{ height: '100px', width: 'auto' }}
                        />
                    </Link>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Admin Panel v2.0</span>
                </div>
                
                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
                    {Object.entries(groupedNav).map(([category, items]) => (
                        <div key={category}>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-3 mb-2.5">{category}</p>
                            <nav className="space-y-1">
                                {items.map((item) => {
                                    const active = isActive(item.href);
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={`flex items-center px-3.5 py-3 rounded-xl text-sm font-bold transition-all duration-200 group ${
                                                active 
                                                ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-950 shadow-lg shadow-yellow-500/20 scale-[1.02]' 
                                                : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                                            }`}
                                        >
                                            <item.icon className={`w-5 h-5 mr-3.5 transition-colors ${
                                                active ? 'text-slate-950' : 'text-slate-500 group-hover:text-yellow-400'
                                            }`} />
                                            {item.name}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                    ))}
                </div>
                
                <div className="p-4 border-t border-slate-800 bg-slate-950/80">
                    <Link 
                        href="/admin/logout" 
                        method="post" 
                        as="button" 
                        className="flex items-center w-full px-4 py-3 rounded-xl text-slate-400 hover:bg-rose-600 hover:text-white font-bold transition-all duration-200 group text-sm"
                    >
                        <LogOut className="w-5 h-5 mr-3.5 text-slate-500 group-hover:text-white" />
                        Sign Out Admin
                    </Link>
                </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 z-[100]">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
                    <div className="absolute inset-y-0 left-0 w-72 bg-slate-950 border-r border-slate-800 shadow-2xl flex flex-col transform transition-transform duration-300">
                        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800">
                            <div className="flex items-center gap-2">
                                <img
                                    src="/images/logo.png"
                                    alt="Big bestow"
                                    className="h-8 w-auto object-contain brightness-0 invert"
                                />
                            </div>
                            <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 hover:text-white p-2"><X className="w-6 h-6" /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-6">
                            {Object.entries(groupedNav).map(([category, items]) => (
                                <div key={category}>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-3 mb-2">{category}</p>
                                    <nav className="space-y-1">
                                        {items.map((item) => (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className={`flex items-center px-3.5 py-3 rounded-xl text-sm font-bold transition-all ${
                                                    isActive(item.href) ? 'bg-yellow-500 text-slate-950' : 'text-slate-400 hover:bg-slate-900'
                                                }`}
                                            >
                                                <item.icon className="w-5 h-5 mr-3.5" />
                                                {item.name}
                                            </Link>
                                        ))}
                                    </nav>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <main className="flex-1 lg:ml-72 min-h-screen flex flex-col bg-slate-900 text-slate-100">
                {/* Header */}
                <header className="h-20 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 text-slate-400 hover:bg-slate-800 rounded-lg">
                            <Menu className="w-6 h-6" />
                        </button>
                        <div>
                            <h1 className="text-lg font-black text-white uppercase tracking-tight">Admin Management Portal</h1>
                            <p className="text-xs text-yellow-500 font-bold flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block"></span>
                                Super Admin Status: Online
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-6">
                        <div className="hidden md:flex items-center bg-slate-900 px-4 py-2 rounded-xl border border-slate-800 focus-within:border-yellow-500/50 transition-all">
                            <Search className="w-4 h-4 text-slate-400 mr-2" />
                            <input type="text" placeholder="Search catalog, orders..." className="bg-transparent border-none text-sm text-white placeholder-slate-500 outline-none w-52" />
                        </div>
                        
                        <Link 
                            href="/" 
                            target="_blank" 
                            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-yellow-400 border border-slate-700 rounded-xl text-xs font-black uppercase tracking-wider transition-all"
                        >
                            <ExternalLink className="w-4 h-4" /> View Live Store
                        </Link>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-6 lg:p-10 flex-1">
                    {alertMessage && (
                        <div className={`mb-6 p-4 rounded-2xl border flex items-center justify-between shadow-lg transition-all animate-in fade-in slide-in-from-top-2 ${
                            alertMessage.type === 'success' 
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                        }`}>
                            <div className="flex items-center gap-3">
                                {alertMessage.type === 'success' ? (
                                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                                ) : (
                                    <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                                )}
                                <span className="font-bold text-sm tracking-wide">{alertMessage.text}</span>
                            </div>
                            <button 
                                onClick={() => setAlertMessage(null)} 
                                className="p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                    {children}
                </div>
            </main>
        </div>
    );
}
