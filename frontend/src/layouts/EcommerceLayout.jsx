'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePage } from '@/lib/inertia-compat';
import { useApp } from '@/context/AppContext';
import ThemeToggle from '@/components/ThemeToggle';
import { ShoppingCart, User, Search, Menu, Package, Heart, X, ChevronRight, ChevronDown, Mail, LogOut, LayoutDashboard, Settings, ArrowRight, Layers } from 'lucide-react';
import { toast } from 'sonner';
import { getCart } from '../utils/cart';
import { getWishlist } from '../utils/wishlist';
import api from '@/lib/api';

// Inline SVG social icons
const YoutubeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
);
const InstaIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
);
const FbIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
);
const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
    </svg>
);

const FOOTER_DEFAULTS = {
    footer_trade_name: 'Today Sports',
    footer_proprietor: 'Danish',
    footer_gstin: '09CPZPD0890P1ZV',
    footer_address: 'House No. 1053, Madina Colony, Char Khamba Ke Pas, Meerut, UP — 250002',
    footer_description: 'Premium Cricket Equipment for Professional Players. Top-quality bats, gear, and accessories delivered right to your doorstep.',
    footer_twitter: '',
    footer_instagram: '',
    footer_facebook: '',
    footer_linkedin: '',
};

export default function EcommerceLayout({ children }) {
    const { auth, flash = {}, navCategories = [] } = usePage().props;
    const { logout } = useApp() || {};
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
    const [hoveredCategory, setHoveredCategory] = useState(null);
    const [expandedMobileCategory, setExpandedMobileCategory] = useState(null);
    const [cartCount, setCartCount] = useState(0);
    const [wishlistCount, setWishlistCount] = useState(0);
    const [footerSettings, setFooterSettings] = useState(FOOTER_DEFAULTS);

    useEffect(() => {
        const updateCount = () => {
            const items = getCart();
            const count = items.reduce((acc, item) => acc + item.quantity, 0);
            setCartCount(count);
        };
        updateCount();
        window.addEventListener('cart-updated', updateCount);
        return () => window.removeEventListener('cart-updated', updateCount);
    }, []);

    useEffect(() => {
        const updateWishlistCount = () => {
            setWishlistCount(getWishlist().length);
        };
        updateWishlistCount();
        window.addEventListener('wishlist-updated', updateWishlistCount);
        return () => window.removeEventListener('wishlist-updated', updateWishlistCount);
    }, []);

    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        } else if (flash.error) {
            toast.error(flash.error);
        }
    }, [flash.success, flash.error]);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
    }, [isMobileMenuOpen]);

    useEffect(() => {
        if (isCategoryMenuOpen && navCategories.length > 0 && !hoveredCategory) {
            setHoveredCategory(navCategories[0]);
        }
    }, [isCategoryMenuOpen, navCategories, hoveredCategory]);

    // Fetch footer settings dynamically
    useEffect(() => {
        api.get('/api/settings')
            .then(data => {
                if (data && typeof data === 'object') {
                    setFooterSettings(prev => ({ ...prev, ...data }));
                }
            })
            .catch(() => { /* use defaults silently */ });
    }, []);

    const allSocials = [
        { key: 'footer_youtube',   icon: <YoutubeIcon />, label: 'YouTube' },
        { key: 'footer_instagram', icon: <InstaIcon />,   label: 'Instagram' },
        { key: 'footer_facebook',  icon: <FbIcon />,      label: 'Facebook' },
        { key: 'footer_google',    icon: <GoogleIcon />,  label: 'Google' },
    ];

    const activeSocials = allSocials.filter(s => footerSettings[s.key]?.trim());
    const displaySocials = activeSocials.length > 0 ? activeSocials : allSocials.slice(0, 3);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">

            {/* ── Navbar ── */}
            <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg shadow-md dark:border-b dark:border-slate-800' : 'bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-24">

                        {/* Mobile: Hamburger */}
                        <div className="flex items-center md:hidden w-1/3">
                            <button onClick={() => setIsMobileMenuOpen(true)} className="text-gray-900 dark:text-white p-2 -ml-2 hover:text-indigo-600 transition-colors">
                                <Menu className="w-6 h-6" />
                            </button>
                            <Link href="/products" className="text-gray-900 dark:text-white p-2 ml-1 hover:text-indigo-600 transition-colors">
                                <Search className="w-5 h-5" />
                            </Link>
                        </div>

                        {/* Logo */}
                        <div className="flex-1 flex justify-center md:justify-start w-1/3 md:w-auto">
                            <Link href="/" className="flex items-center group">
                                <img src="/images/logo.png" alt="Big bestow" className="object-contain group-hover:scale-105 transition-transform duration-300 dark:brightness-0 dark:invert" style={{ width: '227px', height: 'auto' }} />
                            </Link>
                        </div>

                        {/* Desktop Nav */}
                        <nav className="hidden md:flex space-x-8 lg:space-x-10 items-center">
                            <Link href="/products" className="text-sm font-bold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors relative group py-2">
                                All Products<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
                            </Link>

                            {/* Categories Mega Menu */}
                            <div className="relative group/menu" onMouseEnter={() => setIsCategoryMenuOpen(true)} onMouseLeave={() => setIsCategoryMenuOpen(false)}>
                                <button className="flex items-center gap-1 text-sm font-bold text-gray-900 dark:text-white group-hover/menu:text-indigo-600 dark:group-hover/menu:text-indigo-400 transition-colors py-2">
                                    Categories <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isCategoryMenuOpen ? 'rotate-180 text-indigo-600' : ''}`} />
                                </button>
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover/menu:w-full"></span>

                                {isCategoryMenuOpen && (
                                    <div className="absolute top-full left-1/2 -translate-x-1/3 mt-0 w-[580px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden z-50 flex">
                                        <div className="w-1/2 bg-gray-50/90 dark:bg-slate-800/90 border-r border-gray-100 dark:border-slate-800 py-3">
                                            <div className="px-5 py-2 text-[10px] font-black text-gray-400 dark:text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800 mb-1">All Categories</div>
                                            {navCategories.length > 0 ? navCategories.map((cat, idx) => {
                                                const isSelected = hoveredCategory?.id === cat.id || (!hoveredCategory && idx === 0);
                                                return (
                                                    <div key={cat.id} onMouseEnter={() => setHoveredCategory(cat)} onClick={() => setIsCategoryMenuOpen(false)}
                                                        className={`px-5 py-3.5 flex items-center justify-between cursor-pointer transition-all ${isSelected ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 font-black shadow-sm border-l-4 border-indigo-600 pl-4' : 'text-gray-700 dark:text-slate-300 font-bold hover:bg-gray-100/70 dark:hover:bg-slate-700/70'}`}>
                                                        <div className="flex items-center gap-3">
                                                            {cat.image ? (
                                                                <img src={cat.image} alt={cat.name} className="w-8 h-8 rounded-full object-cover shadow-sm bg-white border border-gray-100 dark:border-slate-700" />
                                                            ) : (
                                                                <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-slate-800 flex items-center justify-center text-indigo-500 border border-indigo-100 dark:border-slate-700 shadow-sm">
                                                                    <Layers className="w-3.5 h-3.5" />
                                                                </div>
                                                            )}
                                                            <Link href={`/products?category=${cat.slug}`} className="text-sm truncate hover:underline">{cat.name}</Link>
                                                        </div>
                                                        <ChevronRight className={`w-4 h-4 shrink-0 ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-slate-500'}`} />
                                                    </div>
                                                );
                                            }) : <div className="p-5 text-xs text-gray-400 dark:text-slate-500 font-medium">No categories available</div>}
                                        </div>

                                        <div className="w-1/2 p-6 bg-white dark:bg-slate-900 flex flex-col justify-between">
                                            {(() => {
                                                const activeCat = hoveredCategory || navCategories[0];
                                                if (!activeCat) return null;
                                                return (
                                                    <div>
                                                        <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-3 mb-4">
                                                            <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">{activeCat.name}</span>
                                                            <Link href={`/products?category=${activeCat.slug}`} onClick={() => setIsCategoryMenuOpen(false)} className="text-[11px] font-bold text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 group/link">
                                                                View All <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
                                                            </Link>
                                                        </div>
                                                        <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                                                            {activeCat.subcategories && activeCat.subcategories.length > 0 ? (
                                                                activeCat.subcategories.map(sub => (
                                                                    <Link key={sub.id} href={`/products?category=${activeCat.slug}&subcategory=${sub.slug}`} onClick={() => setIsCategoryMenuOpen(false)}
                                                                        className="block text-sm font-medium text-gray-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50/60 dark:hover:bg-slate-800/80 px-3 py-2 rounded-xl transition-all flex items-center justify-between group/sub">
                                                                        <div className="flex items-center gap-2">
                                                                            {sub.image && <img src={sub.image} alt={sub.name} className="w-6 h-6 rounded-md object-cover shadow-sm bg-white" />}
                                                                            <span>{sub.name}</span>
                                                                        </div>
                                                                        <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover/sub:opacity-100 text-indigo-500 transition-opacity" />
                                                                    </Link>
                                                                ))
                                                            ) : (
                                                                <div className="text-center py-8 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
                                                                    <Layers className="w-6 h-6 text-gray-300 dark:text-slate-600 mx-auto mb-1" />
                                                                    <p className="text-xs text-gray-400 dark:text-slate-500 italic">No subcategories listed</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })()}
                                            <div className="mt-6 pt-3 border-t border-gray-100 dark:border-slate-800 text-center">
                                                <Link href="/products" onClick={() => setIsCategoryMenuOpen(false)} className="text-xs font-bold text-gray-400 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                                    Explore Complete Store Catalog →
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Link href="/about" className="text-sm font-bold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors relative group py-2">
                                About Us<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                            <Link href="/contact" className="text-sm font-bold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors relative group py-2">
                                Contact Us<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                            {/* <Link href="/products?category=sale" className="text-sm font-bold text-rose-500 hover:text-rose-600 transition-colors relative group py-2">
                                Sale<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-rose-500 transition-all duration-300 group-hover:w-full"></span>
                            </Link> */}
                        </nav>

                        {/* Right Icons */}
                        <div className="flex items-center justify-end space-x-3 md:space-x-5 w-1/3 md:w-auto">
                            <ThemeToggle />

                            <div className="hidden lg:flex relative group items-center">
                                <input type="text" placeholder="Search products..." className="w-0 opacity-0 group-hover:w-48 group-hover:opacity-100 group-hover:px-4 bg-gray-100 dark:bg-slate-800 dark:text-white dark:placeholder-slate-400 rounded-full py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all duration-300 absolute right-8 pointer-events-none group-hover:pointer-events-auto" />
                                <button className="text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 z-10 bg-white dark:bg-slate-800 dark:border dark:border-slate-700 shadow-sm">
                                    <Search className="w-5 h-5" />
                                </button>
                            </div>

                            {auth?.user ? (
                                <div className="relative group hidden md:block">
                                    <Link href="/dashboard" className="flex items-center gap-2 text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 font-bold text-xs">
                                        <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                        <span className="max-w-[100px] truncate">{auth.user.name}</span>
                                    </Link>
                                    <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-800 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                        <div className="px-4 py-2 border-b border-gray-100 dark:border-slate-800 mb-1">
                                            <p className="text-xs font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider">Account</p>
                                            <p className="text-sm font-black text-gray-900 dark:text-white truncate">{auth.user.email}</p>
                                        </div>
                                        <Link href="/dashboard" className="flex items-center px-4 py-2 text-xs font-bold text-gray-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                            <LayoutDashboard className="w-4 h-4 mr-2" /> My Dashboard
                                        </Link>
                                        <Link href="/settings/profile" className="flex items-center px-4 py-2 text-xs font-bold text-gray-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                            <Settings className="w-4 h-4 mr-2" /> Profile & Settings
                                        </Link>
                                        <button onClick={() => logout && logout()} className="flex items-center w-full px-4 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors border-t border-gray-100 dark:border-slate-800 mt-1 pt-2">
                                            <LogOut className="w-4 h-4 mr-2" /> Sign Out
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <Link href="/login" className="hidden md:flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-xs font-black rounded-full hover:bg-indigo-700 transition-all shadow-md">
                                    <User className="w-4 h-4" /> Sign In
                                </Link>
                            )}

                            <Link href="/wishlist" className="text-gray-900 dark:text-white hover:text-rose-500 transition-colors hidden sm:block p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 relative">
                                <Heart className="w-5 h-5" />
                                {wishlistCount > 0 && (
                                    <span className="absolute top-0 right-0 bg-rose-500 text-white text-[10px] font-bold rounded-full min-w-[20px] h-[20px] flex items-center justify-center border-2 border-white px-1 shadow-sm">{wishlistCount}</span>
                                )}
                            </Link>

                            <Link href="/cart" className="text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors relative flex items-center p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800">
                                <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
                                {cartCount > 0 && (
                                    <span className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold rounded-full min-w-[20px] h-[20px] flex items-center justify-center border-2 border-white px-1 shadow-sm">{cartCount}</span>
                                )}
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* ── Mobile Sidebar ── */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-[100] md:hidden">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsMobileMenuOpen(false)}></div>
                    <div className="absolute inset-y-0 left-0 w-[85%] max-w-sm bg-white dark:bg-slate-900 dark:text-white shadow-2xl flex flex-col">
                        <div className="px-6 py-5 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
                            <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                                <img src="/images/logo.png" alt="Big bestow" style={{ height: '80px', width: 'auto' }} className="object-contain dark:brightness-0 dark:invert" />
                            </Link>
                            <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white p-2 bg-white dark:bg-slate-800 rounded-full shadow-sm border border-gray-100 dark:border-slate-700">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto py-6">
                            <nav className="flex flex-col px-4 space-y-2">
                                <Link href="/products" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between py-3.5 px-4 rounded-xl hover:bg-indigo-50 dark:hover:bg-slate-800 font-bold text-gray-900 dark:text-white transition-colors group">
                                    All Products <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                                </Link>

                                <div className="border border-gray-100 dark:border-slate-800 rounded-2xl overflow-hidden my-2 bg-gray-50/50 dark:bg-slate-800/50">
                                    <div className="px-4 py-3 bg-gray-100/60 dark:bg-slate-800 font-black text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wider">Shop By Category</div>
                                    <div className="divide-y divide-gray-100 dark:divide-slate-800">
                                        {navCategories.length > 0 ? navCategories.map(cat => (
                                            <div key={cat.id} className="bg-white dark:bg-slate-900">
                                                <div onClick={() => setExpandedMobileCategory(expandedMobileCategory === cat.id ? null : cat.id)} className="flex items-center justify-between py-3 px-4 font-bold text-gray-800 dark:text-slate-200 cursor-pointer hover:text-indigo-600">
                                                    <div className="flex items-center gap-3 flex-1 overflow-hidden pr-2">
                                                        {cat.image && <img src={cat.image} alt={cat.name} className="w-6 h-6 rounded-full object-cover shadow-sm shrink-0" />}
                                                        <Link href={`/products?category=${cat.slug}`} onClick={e => { e.stopPropagation(); setIsMobileMenuOpen(false); }} className="hover:underline truncate">{cat.name}</Link>
                                                    </div>
                                                    {cat.subcategories?.length > 0 && <ChevronDown className={`w-4 h-4 transition-transform ${expandedMobileCategory === cat.id ? 'rotate-180 text-indigo-600' : ''}`} />}
                                                </div>
                                                {expandedMobileCategory === cat.id && cat.subcategories?.length > 0 && (
                                                    <div className="bg-indigo-50/30 px-6 py-2 space-y-1.5 border-t border-gray-50">
                                                        {cat.subcategories.map(sub => (
                                                            <Link key={sub.id} href={`/products?category=${cat.slug}&subcategory=${sub.slug}`} onClick={() => setIsMobileMenuOpen(false)} className="block py-1.5 text-sm font-medium text-gray-600 hover:text-indigo-600 flex items-center gap-2">
                                                                {sub.image ? (
                                                                    <img src={sub.image} alt={sub.name} className="w-5 h-5 rounded object-cover shadow-sm" />
                                                                ) : (
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                                                                )}
                                                                {sub.name}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )) : <div className="p-4 text-xs text-gray-400 italic">No categories listed</div>}
                                    </div>
                                </div>

                                <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between py-3.5 px-4 rounded-xl hover:bg-indigo-50 dark:hover:bg-slate-800 font-bold text-gray-900 dark:text-white transition-colors group">
                                    About Us <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                                </Link>
                                <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between py-3.5 px-4 rounded-xl hover:bg-indigo-50 dark:hover:bg-slate-800 font-bold text-gray-900 dark:text-white transition-colors group">
                                    Contact Us <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                                </Link>
                                {/* <Link href="/products?category=sale" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between py-3.5 px-4 rounded-xl bg-rose-50 dark:bg-slate-800 font-bold text-rose-600 dark:text-rose-400 transition-colors mt-2">
                                    Sale - Up to 50% Off <ChevronRight className="w-5 h-5 text-rose-400" />
                                </Link> */}
                            </nav>

                            <div className="mt-10 px-8">
                                <h4 className="text-xs font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider mb-4">My Account</h4>
                                <div className="space-y-4">
                                    <Link href="/settings/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-gray-700 dark:text-slate-300 font-medium hover:text-indigo-600 transition-colors">
                                        <div className="p-2 bg-gray-100 dark:bg-slate-800 rounded-lg"><User className="w-4 h-4" /></div> Profile & Settings
                                    </Link>
                                    <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-gray-700 dark:text-slate-300 font-medium hover:text-indigo-600 transition-colors">
                                        <div className="p-2 bg-gray-100 dark:bg-slate-800 rounded-lg"><Package className="w-4 h-4" /></div> Order History
                                    </Link>
                                    <Link href="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between text-gray-700 dark:text-slate-300 font-medium hover:text-rose-500 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-rose-50 dark:bg-slate-800 text-rose-500 rounded-lg"><Heart className="w-4 h-4" /></div> Saved Items
                                        </div>
                                        {wishlistCount > 0 && <span className="bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{wishlistCount}</span>}
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 space-y-3">
                            {auth?.user ? (
                                <>
                                    <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 transition-colors shadow-md flex justify-center items-center gap-2 text-sm">
                                        <LayoutDashboard className="w-5 h-5" /> My Account ({auth.user.name})
                                    </Link>
                                    <button onClick={() => { setIsMobileMenuOpen(false); if (logout) logout(); }} className="w-full bg-gray-100 dark:bg-slate-800 text-rose-600 dark:text-rose-400 font-bold py-3 rounded-xl hover:bg-rose-50 transition-colors flex justify-center items-center gap-2 text-sm">
                                        <LogOut className="w-4 h-4" /> Sign Out
                                    </button>
                                </>
                            ) : (
                                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full bg-gray-900 dark:bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-600 transition-colors shadow-lg flex justify-center items-center gap-2">
                                    <User className="w-5 h-5" /> Sign In / Register
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ── Main Content ── */}
            <main className="flex-grow">{children}</main>

            {/* ── Dynamic Footer ── */}
            <footer className="bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 py-16 px-4 md:px-8 mt-auto">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 items-start">

                    {/* Brand + Business Info */}
                    <div className="lg:col-span-2 flex flex-col">
                        <Link href="/" className="inline-block mb-4">
                            <div style={{ width: '240px', height: '80px', overflow: 'hidden', position: 'relative' }}>
                                <img src="/images/logo.png" alt="Big bestow"
                                    style={{ width: '340px', height: 'auto', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                                    className="object-contain dark:brightness-0 dark:invert"
                                />
                            </div>
                        </Link>

                        {footerSettings.footer_description && (
                            <p className="text-gray-500 dark:text-slate-400 text-sm leading-relaxed max-w-sm mb-4">
                                {footerSettings.footer_description}
                            </p>
                        )}

                        <div className="text-xs text-gray-400 dark:text-slate-400 space-y-1 mb-5">
                            {footerSettings.footer_trade_name && <p><span className="font-semibold text-gray-500 dark:text-slate-300">Trade Name:</span> {footerSettings.footer_trade_name}</p>}
                            {footerSettings.footer_proprietor && <p><span className="font-semibold text-gray-500 dark:text-slate-300">Proprietor:</span> {footerSettings.footer_proprietor}</p>}
                            {footerSettings.footer_gstin && <p><span className="font-semibold text-gray-500 dark:text-slate-300">GSTIN:</span> {footerSettings.footer_gstin}</p>}
                            {footerSettings.footer_address && <p><span className="font-semibold text-gray-500 dark:text-slate-300">Address:</span> {footerSettings.footer_address}</p>}
                        </div>

                        {/* Social Links */}
                        <div className="flex gap-3">
                            {displaySocials.map((s, i) => {
                                const url = footerSettings[s.key];
                                const inner = (
                                    <span className="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-gray-600 dark:text-slate-300 hover:bg-indigo-600 dark:hover:bg-indigo-600 hover:text-white transition-colors cursor-pointer" aria-label={s.label}>
                                        {s.icon}
                                    </span>
                                );
                                return url ? (
                                    <a key={i} href={url} target="_blank" rel="noopener noreferrer">{inner}</a>
                                ) : (
                                    <div key={i}>{inner}</div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Shop */}
                    <div className="flex flex-col">
                        <h4 className="text-gray-900 dark:text-white font-bold mb-6">Shop</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/products" className="text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">All Products</Link></li>
                            {navCategories?.slice(0, 4).map(cat => (
                                <li key={cat.id}><Link href={`/products?category=${cat.slug}`} className="text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{cat.name}</Link></li>
                            ))}
                            {/* <li><Link href="/products?category=sale" className="text-rose-500 font-medium hover:text-rose-600 transition-colors">Sale</Link></li> */}
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="flex flex-col">
                        <h4 className="text-gray-900 dark:text-white font-bold mb-6">Support</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/faq" className="text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Help Center & FAQ</Link></li>
                            <li><Link href="/returns" className="text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Returns & Exchanges</Link></li>
                            <li><Link href="/shipping" className="text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Shipping Information</Link></li>
                            <li><Link href="/track" className="text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Track Your Order</Link></li>
                            <li><Link href="/contact" className="text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div className="flex flex-col">
                        <h4 className="text-gray-900 dark:text-white font-bold mb-6">Company</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/about" className="text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">About Us</Link></li>
                            <li><Link href="/careers" className="text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Careers</Link></li>
                            <li><Link href="/stores" className="text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Store Locator</Link></li>
                            <li><Link href="/terms" className="text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Terms of Service</Link></li>
                            <li><Link href="/privacy" className="text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-gray-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-gray-400 dark:text-slate-500">
                        © {new Date().getFullYear()} {footerSettings.footer_trade_name || 'Big bestow'}. All rights reserved.
                    </p>
                    <div className="flex gap-4 text-xs text-gray-400 dark:text-slate-500">
                        <Link href="/privacy" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
