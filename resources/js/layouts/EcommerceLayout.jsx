import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { ShoppingCart, User, Search, Menu, Package, Heart, X, ChevronRight, ChevronDown, Mail, LogOut, LayoutDashboard, Settings, ArrowRight, Layers } from 'lucide-react';
import { toast } from 'sonner';
import { getCart } from '../utils/cart';
import { getWishlist } from '../utils/wishlist';

export default function EcommerceLayout({ children }) {
    const { auth, flash = {}, navCategories = [] } = usePage().props;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
    const [hoveredCategory, setHoveredCategory] = useState(null);
    const [expandedMobileCategory, setExpandedMobileCategory] = useState(null);
    const [cartCount, setCartCount] = useState(0);
    const [wishlistCount, setWishlistCount] = useState(0);

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

    // Handle scroll effect for sticky header
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isMobileMenuOpen]);

    // Set default hovered category when menu opens
    useEffect(() => {
        if (isCategoryMenuOpen && navCategories.length > 0 && !hoveredCategory) {
            setHoveredCategory(navCategories[0]);
        }
    }, [isCategoryMenuOpen, navCategories, hoveredCategory]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            {/* Top Promo Bar (Hides on scroll) */}
            <div className={`bg-gray-900 text-white text-xs text-center py-2 px-4 transition-all duration-300 ${isScrolled ? 'h-0 py-0 opacity-0 overflow-hidden' : 'h-8 opacity-100'}`}>
                Free global shipping on all orders over ₹5,000! Use code <strong className="text-yellow-300">FREESHIP</strong>
            </div>

            {/* Main Premium Navbar */}
            <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-lg shadow-md' : 'bg-white border-b border-gray-100'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-24">
                        
                        {/* Mobile: Hamburger & Search */}
                        <div className="flex items-center md:hidden w-1/3">
                            <button onClick={() => setIsMobileMenuOpen(true)} className="text-gray-900 p-2 -ml-2 hover:text-indigo-600 transition-colors">
                                <Menu className="w-6 h-6" />
                            </button>
                            <Link href="/products" className="text-gray-900 p-2 ml-1 hover:text-indigo-600 transition-colors">
                                <Search className="w-5 h-5" />
                            </Link>
                        </div>

                        {/* Center/Left: Logo */}
                        <div className="flex-1 flex justify-center md:justify-start w-1/3 md:w-auto">
                            <Link href="/" className="flex items-center group">
                                <img
                                    src="/images/logo.png"
                                    alt="Big bestow"
                                    className="object-contain group-hover:scale-105 transition-transform duration-300"
                                    style={{ width: '227px', height: 'auto' }}
                                />
                            </Link>
                        </div>

                        {/* Desktop: Centered Navigation with Flipkart-Style Mega Menu */}
                        <nav className="hidden md:flex space-x-8 lg:space-x-10 items-center">
                            <Link href="/products" className="text-sm font-bold text-gray-900 hover:text-indigo-600 transition-colors relative group py-2">
                                All Products
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
                            </Link>

                            {/* Flipkart-Style Mega Menu for Categories */}
                            <div 
                                className="relative group/menu"
                                onMouseEnter={() => setIsCategoryMenuOpen(true)}
                                onMouseLeave={() => setIsCategoryMenuOpen(false)}
                            >
                                <button className="flex items-center gap-1 text-sm font-bold text-gray-900 group-hover/menu:text-indigo-600 transition-colors py-2">
                                    Categories <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isCategoryMenuOpen ? 'rotate-180 text-indigo-600' : ''}`} />
                                </button>
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover/menu:w-full"></span>

                                {/* Dual-Pane Mega Menu Popup */}
                                {isCategoryMenuOpen && (
                                    <div className="absolute top-full left-1/2 -translate-x-1/3 mt-0 w-[580px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 flex transition-all animate-fade-in">
                                        {/* Left Side: Categories List */}
                                        <div className="w-1/2 bg-gray-50/90 border-r border-gray-100 py-3">
                                            <div className="px-5 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 mb-1">
                                                All Categories
                                            </div>
                                            {navCategories.length > 0 ? navCategories.map((cat, idx) => {
                                                const isSelected = hoveredCategory?.id === cat.id || (!hoveredCategory && idx === 0);
                                                return (
                                                    <div
                                                        key={cat.id}
                                                        onMouseEnter={() => setHoveredCategory(cat)}
                                                        onClick={() => { setIsCategoryMenuOpen(false); }}
                                                        className={`px-5 py-3.5 flex items-center justify-between cursor-pointer transition-all ${
                                                            isSelected
                                                                ? 'bg-white text-indigo-600 font-black shadow-sm border-l-4 border-indigo-600 pl-4'
                                                                : 'text-gray-700 font-bold hover:bg-gray-100/70'
                                                        }`}
                                                    >
                                                        <Link href={`/products?category=${cat.slug}`} className="text-sm truncate pr-2 hover:underline">
                                                            {cat.name}
                                                        </Link>
                                                        <ChevronRight className={`w-4 h-4 shrink-0 ${isSelected ? 'text-indigo-600' : 'text-gray-400'}`} />
                                                    </div>
                                                );
                                            }) : (
                                                <div className="p-5 text-xs text-gray-400 font-medium">No categories available</div>
                                            )}
                                        </div>

                                        {/* Right Side: Subcategories List */}
                                        <div className="w-1/2 p-6 bg-white flex flex-col justify-between">
                                            {(() => {
                                                const activeCat = hoveredCategory || navCategories[0];
                                                if (!activeCat) return null;
                                                return (
                                                    <div>
                                                        <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                                                            <span className="text-xs font-black text-indigo-600 uppercase tracking-wider">
                                                                {activeCat.name}
                                                            </span>
                                                            <Link 
                                                                href={`/products?category=${activeCat.slug}`}
                                                                onClick={() => setIsCategoryMenuOpen(false)}
                                                                className="text-[11px] font-bold text-gray-500 hover:text-indigo-600 flex items-center gap-1 group/link"
                                                            >
                                                                View All <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
                                                            </Link>
                                                        </div>

                                                        <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                                                            {activeCat.subcategories && activeCat.subcategories.length > 0 ? (
                                                                activeCat.subcategories.map((sub) => (
                                                                    <Link
                                                                        key={sub.id}
                                                                        href={`/products?category=${activeCat.slug}&subcategory=${sub.slug}`}
                                                                        onClick={() => setIsCategoryMenuOpen(false)}
                                                                        className="block text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50/60 px-3 py-2 rounded-xl transition-all flex items-center justify-between group/sub"
                                                                    >
                                                                        <span>{sub.name}</span>
                                                                        <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover/sub:opacity-100 text-indigo-500 transition-opacity" />
                                                                    </Link>
                                                                ))
                                                            ) : (
                                                                <div className="text-center py-8 bg-gray-50 rounded-xl">
                                                                    <Layers className="w-6 h-6 text-gray-300 mx-auto mb-1" />
                                                                    <p className="text-xs text-gray-400 italic">No subcategories listed</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })()}

                                            <div className="mt-6 pt-3 border-t border-gray-100 text-center">
                                                <Link
                                                    href="/products"
                                                    onClick={() => setIsCategoryMenuOpen(false)}
                                                    className="text-xs font-bold text-gray-400 hover:text-indigo-600 transition-colors"
                                                >
                                                    Explore Complete Store Catalog →
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Link href="/about" className="text-sm font-bold text-gray-900 hover:text-indigo-600 transition-colors relative group py-2">
                                About Us
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                            <Link href="/contact" className="text-sm font-bold text-gray-900 hover:text-indigo-600 transition-colors relative group py-2">
                                Contact Us
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                            <Link href="/products?category=sale" className="text-sm font-bold text-rose-500 hover:text-rose-600 transition-colors relative group py-2">
                                Sale
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-rose-500 transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                        </nav>

                        {/* Right: Icons */}
                        <div className="flex items-center justify-end space-x-3 md:space-x-5 w-1/3 md:w-auto">
                            
                            {/* Desktop Search */}
                            <div className="hidden lg:flex relative group items-center">
                                <input 
                                    type="text" 
                                    placeholder="Search products..." 
                                    className="w-0 opacity-0 group-hover:w-48 group-hover:opacity-100 group-hover:px-4 bg-gray-100 rounded-full py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all duration-300 absolute right-8 pointer-events-none group-hover:pointer-events-auto" 
                                />
                                <button className="text-gray-900 hover:text-indigo-600 transition-colors p-2 rounded-full hover:bg-gray-100 z-10 bg-white">
                                    <Search className="w-5 h-5" />
                                </button>
                            </div>
                            
                            {auth?.user ? (
                                <div className="relative group hidden md:block">
                                    <Link href="/dashboard" className="flex items-center gap-2 text-gray-900 hover:text-indigo-600 transition-colors p-2 rounded-full hover:bg-gray-100 font-bold text-xs">
                                        <User className="w-5 h-5 text-indigo-600" />
                                        <span className="max-w-[100px] truncate">{auth.user.name}</span>
                                    </Link>
                                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                        <div className="px-4 py-2 border-b border-gray-100 mb-1">
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Account</p>
                                            <p className="text-sm font-black text-gray-900 truncate">{auth.user.email}</p>
                                        </div>
                                        <Link href="/dashboard" className="flex items-center px-4 py-2 text-xs font-bold text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                                            <LayoutDashboard className="w-4 h-4 mr-2" /> My Dashboard
                                        </Link>
                                        <Link href="/settings/profile" className="flex items-center px-4 py-2 text-xs font-bold text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                                            <Settings className="w-4 h-4 mr-2" /> Profile & Settings
                                        </Link>
                                        <Link href="/logout" method="post" as="button" className="flex items-center w-full px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors border-t border-gray-100 mt-1 pt-2">
                                            <LogOut className="w-4 h-4 mr-2" /> Sign Out
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <Link href="/login" className="hidden md:flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-xs font-black rounded-full hover:bg-indigo-700 transition-all shadow-md">
                                    <User className="w-4 h-4" /> Sign In
                                </Link>
                            )}
                            
                            <Link href="/wishlist" className="text-gray-900 hover:text-rose-500 transition-colors hidden sm:block p-2 rounded-full hover:bg-gray-100 relative">
                                <Heart className="w-5 h-5" />
                                {wishlistCount > 0 && (
                                    <span className="absolute top-0 right-0 bg-rose-500 text-white text-[10px] font-bold rounded-full min-w-[20px] h-[20px] flex items-center justify-center border-2 border-white px-1 shadow-sm">
                                        {wishlistCount}
                                    </span>
                                )}
                            </Link>

                            <Link href="/cart" className="text-gray-900 hover:text-indigo-600 transition-colors relative flex items-center p-2 rounded-full hover:bg-gray-100">
                                <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
                                {cartCount > 0 && (
                                    <span className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold rounded-full min-w-[20px] h-[20px] flex items-center justify-center border-2 border-white px-1 shadow-sm">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Sidebar Navigation Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-[100] md:hidden">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" 
                        onClick={() => setIsMobileMenuOpen(false)}
                    ></div>
                    
                    {/* Sidebar Panel */}
                    <div className="absolute inset-y-0 left-0 w-[85%] max-w-sm bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">
                        
                        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
                            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center">
                                <img
                                    src="/images/logo.png"
                                    alt="Big bestow"
                                    style={{ height: '80px', width: 'auto' }}
                                    className="object-contain"
                                />
                            </Link>
                            <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400 hover:text-gray-900 p-2 bg-white rounded-full shadow-sm border border-gray-100">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto py-6">
                            <nav className="flex flex-col px-4 space-y-2">
                                <Link href="/products" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between py-3.5 px-4 rounded-xl hover:bg-indigo-50 font-bold text-gray-900 transition-colors group">
                                    All Products <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                                </Link>

                                {/* Mobile Categories Accordion */}
                                <div className="border border-gray-100 rounded-2xl overflow-hidden my-2 bg-gray-50/50">
                                    <div className="px-4 py-3 bg-gray-100/60 font-black text-xs text-gray-500 uppercase tracking-wider">
                                        Shop By Category
                                    </div>
                                    <div className="divide-y divide-gray-100">
                                        {navCategories.length > 0 ? navCategories.map((cat) => (
                                            <div key={cat.id} className="bg-white">
                                                <div 
                                                    onClick={() => setExpandedMobileCategory(expandedMobileCategory === cat.id ? null : cat.id)}
                                                    className="flex items-center justify-between py-3 px-4 font-bold text-gray-800 cursor-pointer hover:text-indigo-600"
                                                >
                                                    <Link 
                                                        href={`/products?category=${cat.slug}`} 
                                                        onClick={(e) => { e.stopPropagation(); setIsMobileMenuOpen(false); }}
                                                        className="hover:underline flex-1"
                                                    >
                                                        {cat.name}
                                                    </Link>
                                                    {cat.subcategories && cat.subcategories.length > 0 && (
                                                        <button className="p-1 text-gray-400">
                                                            <ChevronDown className={`w-4 h-4 transition-transform ${expandedMobileCategory === cat.id ? 'rotate-180 text-indigo-600' : ''}`} />
                                                        </button>
                                                    )}
                                                </div>

                                                {/* Mobile Subcategories */}
                                                {expandedMobileCategory === cat.id && cat.subcategories && cat.subcategories.length > 0 && (
                                                    <div className="bg-indigo-50/30 px-6 py-2 space-y-1.5 border-t border-gray-50">
                                                        {cat.subcategories.map((sub) => (
                                                            <Link
                                                                key={sub.id}
                                                                href={`/products?category=${cat.slug}&subcategory=${sub.slug}`}
                                                                onClick={() => setIsMobileMenuOpen(false)}
                                                                className="block py-1.5 text-sm font-medium text-gray-600 hover:text-indigo-600 flex items-center gap-1.5"
                                                            >
                                                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                                                                {sub.name}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )) : (
                                            <div className="p-4 text-xs text-gray-400 italic">No categories listed</div>
                                        )}
                                    </div>
                                </div>

                                <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between py-3.5 px-4 rounded-xl hover:bg-indigo-50 font-bold text-gray-900 transition-colors group">
                                    About Us <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                                </Link>
                                <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between py-3.5 px-4 rounded-xl hover:bg-indigo-50 font-bold text-gray-900 transition-colors group">
                                    Contact Us <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                                </Link>
                                <Link href="/products?category=sale" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between py-3.5 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 font-bold text-rose-600 transition-colors mt-2">
                                    Sale - Up to 50% Off <ChevronRight className="w-5 h-5 text-rose-400" />
                                </Link>
                            </nav>

                            <div className="mt-10 px-8">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">My Account</h4>
                                <div className="space-y-4">
                                    <Link href="/settings/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-gray-700 font-medium hover:text-indigo-600 transition-colors">
                                        <div className="p-2 bg-gray-100 rounded-lg"><User className="w-4 h-4" /></div> Profile & Settings
                                    </Link>
                                    <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-gray-700 font-medium hover:text-indigo-600 transition-colors">
                                        <div className="p-2 bg-gray-100 rounded-lg"><Package className="w-4 h-4" /></div> Order History
                                    </Link>
                                    <Link href="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between text-gray-700 font-medium hover:text-rose-500 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-rose-50 text-rose-500 rounded-lg"><Heart className="w-4 h-4" /></div> Saved Items
                                        </div>
                                        {wishlistCount > 0 && (
                                            <span className="bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                                {wishlistCount}
                                            </span>
                                        )}
                                    </Link>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-6 bg-white border-t border-gray-100 shadow-[0_-10px_20px_rgba(0,0,0,0.02)] space-y-3">
                            {auth?.user ? (
                                <>
                                    <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 transition-colors shadow-md flex justify-center items-center gap-2 text-sm">
                                        <LayoutDashboard className="w-5 h-5" /> My Account ({auth.user.name})
                                    </Link>
                                    <Link href="/logout" method="post" as="button" className="w-full bg-gray-100 text-rose-600 font-bold py-3 rounded-xl hover:bg-rose-50 transition-colors flex justify-center items-center gap-2 text-sm">
                                        <LogOut className="w-4 h-4" /> Sign Out
                                    </Link>
                                </>
                            ) : (
                                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-indigo-600 transition-colors shadow-lg flex justify-center items-center gap-2">
                                    <User className="w-5 h-5" /> Sign In / Register
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-grow">
                {children}
            </main>

            {/* Premium Footer */}
            <footer className="bg-white border-t border-gray-200 py-16 px-4 md:px-8 mt-auto">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-12 items-start">
                    <div className="lg:col-span-2 flex flex-col">
                        <Link href="/" className="inline-block mb-4">
                            <div style={{ width: '240px', height: '80px', overflow: 'hidden', position: 'relative' }}>
                                <img
                                    src="/images/logo.png"
                                    alt="Big bestow"
                                    style={{
                                        width: '340px',
                                        height: 'auto',
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)'
                                    }}
                                    className="object-contain"
                                />
                            </div>
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-sm mb-4">
                            Premium Cricket Equipment for Professional Players. Top-quality bats, gear, and accessories delivered right to your doorstep.
                        </p>
                        <div className="text-xs text-gray-400 space-y-1 mb-5">
                            <p><span className="font-semibold text-gray-500">Trade Name:</span> Today Sports</p>
                            <p><span className="font-semibold text-gray-500">Proprietor:</span> Danish</p>
                            <p><span className="font-semibold text-gray-500">GSTIN:</span> 09CPZPD0890P1ZV</p>
                            <p><span className="font-semibold text-gray-500">Address:</span> House No. 9, Madina Colony, Char Khamba Ke Pas, Meerut, UP — 250002</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-indigo-600 hover:text-white transition-colors cursor-pointer font-bold">X</div>
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-indigo-600 hover:text-white transition-colors cursor-pointer font-bold">In</div>
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-indigo-600 hover:text-white transition-colors cursor-pointer font-bold">Fb</div>
                        </div>
                    </div>
                    
                    <div className="flex flex-col">
                        <h4 className="text-gray-900 font-bold mb-6">Shop</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/products" className="text-gray-500 hover:text-indigo-600 transition-colors">All Products</Link></li>
                            {navCategories && navCategories.slice(0, 4).map(cat => (
                                <li key={cat.id}><Link href={`/products?category=${cat.slug}`} className="text-gray-500 hover:text-indigo-600 transition-colors">{cat.name}</Link></li>
                            ))}
                            <li><Link href="/products?category=sale" className="text-rose-500 font-medium hover:text-rose-600 transition-colors">Sale</Link></li>
                        </ul>
                    </div>
                    
                    <div className="flex flex-col">
                        <h4 className="text-gray-900 font-bold mb-6">Support</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/faq" className="text-gray-500 hover:text-indigo-600 transition-colors">Help Center & FAQ</Link></li>
                            <li><Link href="/returns" className="text-gray-500 hover:text-indigo-600 transition-colors">Returns & Exchanges</Link></li>
                            <li><Link href="/shipping" className="text-gray-500 hover:text-indigo-600 transition-colors">Shipping Information</Link></li>
                            <li><Link href="/track" className="text-gray-500 hover:text-indigo-600 transition-colors">Track Your Order</Link></li>
                            <li><Link href="/contact" className="text-gray-500 hover:text-indigo-600 transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>
                    
                    <div className="flex flex-col">
                        <h4 className="text-gray-900 font-bold mb-6">Company</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/about" className="text-gray-500 hover:text-indigo-600 transition-colors">About Us</Link></li>
                            <li><Link href="/careers" className="text-gray-500 hover:text-indigo-600 transition-colors">Careers</Link></li>
                            <li><Link href="/stores" className="text-gray-500 hover:text-indigo-600 transition-colors">Store Locator</Link></li>
                            <li><Link href="/terms" className="text-gray-500 hover:text-indigo-600 transition-colors">Terms of Service</Link></li>
                            <li><Link href="/privacy" className="text-gray-500 hover:text-indigo-600 transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>
                </div>
                
                <div className="max-w-7xl mx-auto border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
                    <p>&copy; {new Date().getFullYear()} Bigbestow.com — Today Sports. All rights reserved.</p>
                    <div className="flex gap-4 flex-wrap justify-center">
                        <span className="hover:text-gray-600">Region: India (INR ₹)</span>
                        <span className="text-gray-300">|</span>
                        <span className="hover:text-gray-600">GSTIN: 09CPZPD0890P1ZV</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
