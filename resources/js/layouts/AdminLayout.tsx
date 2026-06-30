import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
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
    ChevronDown,
    Search,
    Bell,
    X
} from 'lucide-react';

export default function AdminLayout({ children }) {
    const { url } = usePage();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navigation = [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: 'Categories', href: '/admin/categories', icon: Tags },
        { name: 'Subcategories', href: '/admin/subcategories', icon: Layers },
        { name: 'Products', href: '/admin/products', icon: PackageSearch },
        { name: 'Inventory', href: '/admin/inventory', icon: Boxes },
        { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
        { name: 'Coupons', href: '/admin/coupons', icon: Gift },
        { name: 'Users', href: '/admin/users', icon: Users },
        { name: 'Banners & Offers', href: '/admin/banners', icon: ImageIcon },
    ];

    const isActive = (href) => {
        if (href === '/admin') return url === '/admin';
        return url.startsWith(href);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex w-72 bg-slate-900 text-white flex-col fixed inset-y-0 left-0 z-50 shadow-2xl">
                <div className="h-20 flex items-center px-8 bg-slate-950/50 border-b border-slate-800">
                    <Trophy className="w-8 h-8 mr-3 text-yellow-500 animate-pulse" />
                    <span className="text-2xl font-black tracking-tighter uppercase italic">
                        Big<span className="text-yellow-500">Bestow</span>
                    </span>
                </div>
                
                <div className="flex-1 overflow-y-auto py-8 scrollbar-hide">
                    <div className="px-4 mb-4">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] px-4 mb-4">Core Management</p>
                        <nav className="space-y-1">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center px-4 py-3.5 rounded-xl font-bold transition-all duration-200 group ${
                                        isActive(item.href) 
                                        ? 'bg-yellow-500 text-slate-900 shadow-lg shadow-yellow-500/20 scale-[1.02]' 
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                    }`}
                                >
                                    <item.icon className={`w-5 h-5 mr-4 transition-colors ${
                                        isActive(item.href) ? 'text-slate-900' : 'text-slate-500 group-hover:text-yellow-500'
                                    }`} />
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>
                
                <div className="p-6 border-t border-slate-800 bg-slate-950/20">
                    <Link 
                        href="/logout" 
                        method="post" 
                        as="button" 
                        className="flex items-center w-full px-4 py-3.5 rounded-xl text-slate-400 hover:bg-rose-500 hover:text-white font-bold transition-all duration-200 group"
                    >
                        <LogOut className="w-5 h-5 mr-4 text-slate-500 group-hover:text-white" />
                        Sign Out
                    </Link>
                </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 z-[100]">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
                    <div className="absolute inset-y-0 left-0 w-72 bg-slate-900 shadow-2xl flex flex-col transform transition-transform duration-300">
                        <div className="h-20 flex items-center justify-between px-8 bg-slate-950/50 border-b border-slate-800">
                            <div className="flex items-center">
                                <Trophy className="w-6 h-6 mr-2 text-yellow-500" />
                                <span className="text-xl font-black italic">BigBestow</span>
                            </div>
                            <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 hover:text-white"><X className="w-6 h-6" /></button>
                        </div>
                        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center px-4 py-3.5 rounded-xl font-bold transition-all ${
                                        isActive(item.href) ? 'bg-yellow-500 text-slate-900' : 'text-slate-400 hover:bg-slate-800'
                                    }`}
                                >
                                    <item.icon className="w-5 h-5 mr-4" />
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <main className="flex-1 lg:ml-72 min-h-screen flex flex-col">
                {/* Header */}
                <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                            <Menu className="w-6 h-6" />
                        </button>
                        <div>
                            <h1 className="text-lg font-black text-slate-900 uppercase tracking-tight">Admin Dashboard</h1>
                            <p className="text-xs text-slate-500 font-medium">Welcome back, Super Admin</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center bg-slate-100 px-4 py-2 rounded-xl border border-slate-200 focus-within:ring-2 ring-yellow-500/20 transition-all">
                            <Search className="w-4 h-4 text-slate-400 mr-2" />
                            <input type="text" placeholder="Search anything..." className="bg-transparent border-none text-sm outline-none w-48" />
                        </div>
                        <button className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                            <Bell className="w-6 h-6" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                        </button>
                        <Link href="/" className="hidden sm:flex items-center px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
                            Visit Store
                        </Link>
                    </div>
                </header>

                {/* Content */}
                <div className="p-6 lg:p-10 flex-1">
                    {children}
                </div>
            </main>
        </div>
    );
}
