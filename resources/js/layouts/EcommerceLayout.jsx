import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { ShoppingCart, User, Search, Menu, Package, Heart, X, ChevronRight, Mail } from 'lucide-react';

export default function EcommerceLayout({ children }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

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

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            {/* Top Promo Bar (Hides on scroll) */}
            <div className={`bg-gray-900 text-white text-xs text-center py-2 px-4 transition-all duration-300 ${isScrolled ? 'h-0 py-0 opacity-0 overflow-hidden' : 'h-8 opacity-100'}`}>
                Free global shipping on all orders over $150! Use code <strong className="text-yellow-300">FREESHIP</strong>
            </div>

            {/* Main Premium Navbar */}
            <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-lg shadow-sm py-3' : 'bg-white py-5 border-b border-gray-100'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        
                        {/* Mobile: Hamburger & Search */}
                        <div className="flex items-center md:hidden w-1/3">
                            <button onClick={() => setIsMobileMenuOpen(true)} className="text-gray-900 p-2 -ml-2 hover:text-indigo-600 transition-colors">
                                <Menu className="w-6 h-6" />
                            </button>
                            <button className="text-gray-900 p-2 ml-1 hover:text-indigo-600 transition-colors">
                                <Search className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Center/Left: Logo */}
                        <div className="flex-1 flex justify-center md:justify-start w-1/3 md:w-auto">
                            <Link href="/" className="text-2xl md:text-3xl font-black tracking-tighter text-indigo-600 flex items-center gap-2 group">
                                <Package className="w-7 h-7 md:w-8 md:h-8 group-hover:rotate-12 transition-transform duration-300" />
                                BigBestow.
                            </Link>
                        </div>

                        {/* Desktop: Centered Navigation */}
                        <nav className="hidden md:flex space-x-8 lg:space-x-12 absolute left-1/2 transform -translate-x-1/2">
                            <Link href="/products" className="text-sm font-bold text-gray-900 hover:text-indigo-600 transition-colors relative group">
                                New Arrivals
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                            <Link href="/products?category=english-willow" className="text-sm font-bold text-gray-900 hover:text-indigo-600 transition-colors relative group">
                                English Willow
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                            <Link href="/products?category=kashmir-willow" className="text-sm font-bold text-gray-900 hover:text-indigo-600 transition-colors relative group">
                                Kashmir Willow
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                            <Link href="/products?category=sale" className="text-sm font-bold text-rose-500 hover:text-rose-600 transition-colors relative group">
                                Sale
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-rose-500 transition-all duration-300 group-hover:w-full"></span>
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
                            
                            <Link href="/settings/profile" className="hidden md:block text-gray-900 hover:text-indigo-600 transition-colors p-2 rounded-full hover:bg-gray-100">
                                <User className="w-5 h-5" />
                            </Link>
                            
                            <Link href="/wishlist" className="text-gray-900 hover:text-rose-500 transition-colors hidden sm:block p-2 rounded-full hover:bg-gray-100">
                                <Heart className="w-5 h-5" />
                            </Link>

                            <Link href="/cart" className="text-gray-900 hover:text-indigo-600 transition-colors relative flex items-center p-2 rounded-full hover:bg-gray-100">
                                <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
                                <span className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold rounded-full min-w-[20px] h-[20px] flex items-center justify-center border-2 border-white px-1 shadow-sm">
                                    3
                                </span>
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
                        
                        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-black text-indigo-600 flex items-center gap-2">
                                <Package className="w-7 h-7" />
                                BigBestow.
                            </Link>
                            <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400 hover:text-gray-900 p-2 bg-white rounded-full shadow-sm border border-gray-100">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto py-6">
                            <nav className="flex flex-col px-4 space-y-2">
                                <Link href="/products" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between py-3.5 px-4 rounded-xl hover:bg-indigo-50 font-bold text-gray-900 transition-colors group">
                                    New Arrivals <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                                </Link>
                                <Link href="/products?category=english-willow" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between py-3.5 px-4 rounded-xl hover:bg-indigo-50 font-bold text-gray-900 transition-colors group">
                                    English Willow <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                                </Link>
                                <Link href="/products?category=kashmir-willow" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between py-3.5 px-4 rounded-xl hover:bg-indigo-50 font-bold text-gray-900 transition-colors group">
                                    Kashmir Willow <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                                </Link>
                                <Link href="/products?category=sale" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between py-3.5 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 font-bold text-rose-600 transition-colors mt-4">
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
                                    <Link href="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-gray-700 font-medium hover:text-rose-500 transition-colors">
                                        <div className="p-2 bg-rose-50 text-rose-500 rounded-lg"><Heart className="w-4 h-4" /></div> Saved Items
                                    </Link>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-6 bg-white border-t border-gray-100 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
                            <Link href="/login" className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-indigo-600 transition-colors shadow-lg flex justify-center items-center gap-2">
                                <User className="w-5 h-5" /> Sign In / Register
                            </Link>
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
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-12">
                    <div className="lg:col-span-2">
                        <Link href="/" className="text-2xl font-black tracking-tighter text-indigo-600 flex items-center gap-2 mb-6">
                            <Package className="w-8 h-8" />
                            BigBestow.
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-sm mb-6">
                            Premium Cricket Equipment for Professional Players. Top-quality bats, gear, and accessories delivered right to your doorstep.
                        </p>
                        <div className="flex gap-4">
                            {/* Social Icons Placeholders */}
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-indigo-600 hover:text-white transition-colors cursor-pointer">X</div>
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-indigo-600 hover:text-white transition-colors cursor-pointer">In</div>
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-indigo-600 hover:text-white transition-colors cursor-pointer">Fb</div>
                        </div>
                    </div>
                    
                    <div>
                        <h4 className="text-gray-900 font-bold mb-6">Shop</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/products?category=english-willow" className="text-gray-500 hover:text-indigo-600 transition-colors">English Willow Bats</Link></li>
                            <li><Link href="/products?category=kashmir-willow" className="text-gray-500 hover:text-indigo-600 transition-colors">Kashmir Willow Bats</Link></li>
                            <li><Link href="/products?category=cricket-gear" className="text-gray-500 hover:text-indigo-600 transition-colors">Cricket Gear</Link></li>
                            <li><Link href="/products?category=accessories" className="text-gray-500 hover:text-indigo-600 transition-colors">Accessories</Link></li>
                            <li><Link href="/products?category=sale" className="text-rose-500 font-medium hover:text-rose-600 transition-colors">Sale</Link></li>
                        </ul>
                    </div>
                    
                    <div>
                        <h4 className="text-gray-900 font-bold mb-6">Support</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/faq" className="text-gray-500 hover:text-indigo-600 transition-colors">Help Center & FAQ</Link></li>
                            <li><Link href="/returns" className="text-gray-500 hover:text-indigo-600 transition-colors">Returns & Exchanges</Link></li>
                            <li><Link href="/shipping" className="text-gray-500 hover:text-indigo-600 transition-colors">Shipping Information</Link></li>
                            <li><Link href="/track" className="text-gray-500 hover:text-indigo-600 transition-colors">Track Your Order</Link></li>
                            <li><Link href="/contact" className="text-gray-500 hover:text-indigo-600 transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>
                    
                    <div>
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
                    <p>&copy; {new Date().getFullYear()} BigBestow.com. All rights reserved.</p>
                    <div className="flex gap-4">
                        <span className="cursor-pointer hover:text-gray-600">Region: United States (USD $)</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
