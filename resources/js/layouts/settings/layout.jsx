import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { User, ShieldCheck, Palette, ShoppingBag, Heart, LogOut, ChevronRight, Package } from 'lucide-react';
import EcommerceLayout from '@/layouts/EcommerceLayout';

export default function SettingsLayout({ children }) {
    const page = usePage();
    const url = page.url || '';
    const auth = page.props?.auth || {};

    const navItems = [
        { title: 'My Dashboard', href: '/dashboard', icon: ShoppingBag },
        { title: 'My Orders & Tracking', href: '/orders', icon: Package },
        { title: 'Profile Information', href: '/settings/profile', icon: User },
        { title: 'Password & Security', href: '/settings/security', icon: ShieldCheck },
        { title: 'Theme & Appearance', href: '/settings/appearance', icon: Palette },
        { title: 'My Wishlist', href: '/wishlist', icon: Heart },
    ];

    const isActive = (href) => url.startsWith(href);

    return (
        <EcommerceLayout>
            <div className="bg-gray-50/50 min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans">
                <div className="max-w-6xl mx-auto">
                    {/* Header Banner */}
                    <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 rounded-3xl p-8 mb-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 text-2xl font-black text-yellow-400">
                                {auth?.user?.name ? auth.user.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{auth?.user?.name || 'My Account'}</h1>
                                <p className="text-indigo-200 text-sm mt-1">{auth?.user?.email} • Customer Member</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link href="/logout" method="post" as="button" className="px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2">
                                <LogOut className="w-4 h-4" /> Sign Out
                            </Link>
                        </div>
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Sidebar Navigation */}
                        <aside className="lg:col-span-1">
                            <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-sm space-y-1">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3 py-2">Account Navigation</p>
                                {navItems.map((item) => {
                                    const active = isActive(item.href);
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                                                active
                                                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                                                    : 'text-gray-700 hover:bg-gray-100 hover:text-indigo-600'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <item.icon className={`w-5 h-5 ${active ? 'text-yellow-300' : 'text-gray-400'}`} />
                                                <span>{item.title}</span>
                                            </div>
                                            <ChevronRight className={`w-4 h-4 ${active ? 'opacity-100' : 'opacity-0'}`} />
                                        </Link>
                                    );
                                })}
                            </div>
                        </aside>

                        {/* Main Settings Form Card */}
                        <div className="lg:col-span-3">
                            <div className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-8 shadow-sm">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </EcommerceLayout>
    );
}
