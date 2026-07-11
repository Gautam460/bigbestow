import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ShoppingBag, Heart, MapPin, Package, Clock, CheckCircle, Star, ArrowRight } from 'lucide-react';
import SettingsLayout from '@/layouts/settings/layout';
import { toggleWishlist, getWishlist } from '@/utils/wishlist';
import { toast } from 'sonner';

export default function Dashboard({ orders = [], recommendedProducts = [] }) {
    const displayOrders = orders.length > 0 ? orders : [
        { id: '#BB-4921', date: 'Oct 12, 2026', status: 'Delivered', price: '₹24,999.00', color: 'emerald' },
        { id: '#BB-4810', date: 'Sep 28, 2026', status: 'In Transit', price: '₹3,499.00', color: 'amber' },
    ];

    const fallbackProducts = [
        { id: 1, name: 'English Willow Cricket Bat Grade 1', price: '28999.00', image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=500&auto=format&fit=crop&q=80', category: { name: 'Cricket Bats' } },
        { id: 2, name: 'Pro Leather Cricket Balls (Pack of 6)', price: '3499.00', image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=500&auto=format&fit=crop&q=80', category: { name: 'Cricket Balls' } },
        { id: 3, name: 'Elite Batting Gloves & Pad Combo', price: '5999.00', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&auto=format&fit=crop&q=80', category: { name: 'Protection' } },
        { id: 4, name: 'Tournament Kit Bag with Wheels', price: '6999.00', image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=500&auto=format&fit=crop&q=80', category: { name: 'Kit Bags' } },
    ];

    const displayProducts = recommendedProducts && recommendedProducts.length > 0 ? recommendedProducts : fallbackProducts;
    const [wishlistIds, setWishlistIds] = useState([]);

    useEffect(() => {
        const updateWishlist = () => {
            setWishlistIds(getWishlist().map(item => item.id));
        };
        updateWishlist();
        window.addEventListener('wishlist-updated', updateWishlist);
        return () => window.removeEventListener('wishlist-updated', updateWishlist);
    }, []);

    return (
        <div className="space-y-8">
            <Head title="My Account Dashboard" />

            {/* Header Section */}
            <div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Account Overview</h2>
                <p className="text-gray-500 text-sm">Welcome back! Manage your profile, orders, and personalized shopping recommendations.</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm flex items-center gap-4">
                    <div className="p-3.5 bg-indigo-50 rounded-xl text-indigo-600">
                        <ShoppingBag className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-2xl font-black text-gray-900">{displayOrders.length}</div>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Orders</div>
                    </div>
                </div>
                <Link href="/wishlist" className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition-all flex items-center gap-4">
                    <div className="p-3.5 bg-rose-50 rounded-xl text-rose-600">
                        <Heart className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-2xl font-black text-gray-900">{wishlistIds.length}</div>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Wishlist Items</div>
                    </div>
                </Link>
                <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm flex items-center gap-4">
                    <div className="p-3.5 bg-amber-50 rounded-xl text-amber-600">
                        <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-2xl font-black text-gray-900">02</div>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Saved Addresses</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Orders */}
                <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-black text-gray-900 tracking-tight">Recent Orders</h3>
                            <Link href="/orders" className="text-xs font-bold text-indigo-600 hover:underline">View All Orders</Link>
                        </div>
                        
                        <div className="space-y-4">
                            {displayOrders.map((order, i) => (
                                <Link key={i} href={order.id ? `/orders/${order.id}` : '/orders'} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all cursor-pointer group bg-white">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2.5 bg-gray-50 rounded-xl text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                            <Package className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900 text-sm group-hover:text-indigo-600 transition-colors">
                                                {order.id ? `#ORD-${order.id}` : (order.order_number || `#ORD-${100 + i}`)}
                                            </div>
                                            <div className="text-[10px] text-gray-400 font-bold uppercase">
                                                {order.created_at ? new Date(order.created_at).toLocaleDateString() : (order.date || 'Recent')}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-black text-gray-900 text-sm">
                                            {order.total_amount ? `₹${Number(order.total_amount).toFixed(2)}` : (typeof order.price === 'string' ? order.price : '₹14999.00')}
                                        </div>
                                        <div className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-lg uppercase inline-block mt-0.5">
                                            {order.status || 'Processing'} • Track &rarr;
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Account Tracking Summary */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6">
                        <h3 className="text-lg font-black text-gray-900 tracking-tight mb-6">Security & Profile Tracking</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
                                <div className="flex items-center gap-3">
                                    <Clock className="w-5 h-5 text-indigo-600" />
                                    <span className="text-sm font-bold text-gray-700">Account Security</span>
                                </div>
                                <span className="text-xs font-bold text-indigo-600">Active & Verified</span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                                    <span className="text-sm font-bold text-gray-700">Customer Profile</span>
                                </div>
                                <span className="text-xs font-bold text-emerald-600">100% Complete</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden border border-indigo-500/20">
                        <div className="relative z-10">
                            <span className="bg-yellow-400 text-gray-950 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full mb-3 inline-block">Prime Member Benefit</span>
                            <h4 className="text-xl font-black mb-2 italic tracking-tight">Bigbestow VIP Club</h4>
                            <p className="text-gray-300 text-xs mb-5 leading-relaxed">Enjoy free global express shipping, priority support, and early access to tournament cricket willow drops.</p>
                            <Link href="/products" className="inline-flex items-center gap-2 px-5 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-gray-950 rounded-xl text-xs font-black uppercase tracking-widest transition-all">
                                Explore VIP Catalog <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Amazon-Style Recommended Products Section */}
            <div className="pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-xl font-black text-gray-900 tracking-tight">Recommended For You</h3>
                        <p className="text-xs font-bold text-gray-500 mt-0.5">Inspired by your shopping trends & browsing history</p>
                    </div>
                    <Link href="/products" className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
                        View All Catalog <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {displayProducts.map((product) => (
                        <div key={product.id} className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-sm hover:shadow-lg transition-all group flex flex-col justify-between">
                            <div>
                                <div className="h-48 bg-gray-100 relative overflow-hidden">
                                    <img 
                                        src={product.image || product.image_url || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=500&auto=format&fit=crop&q=80'} 
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                    />
                                    <div className="absolute top-3 left-3 bg-gray-900/80 backdrop-blur-md text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-lg">
                                        {product.category?.name || 'Top Pick'}
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            const res = toggleWishlist(product);
                                            if (res.isAdded) {
                                                toast.success(`${product.name} added to wishlist!`);
                                            } else {
                                                toast.info(`${product.name} removed from wishlist`);
                                            }
                                        }}
                                        className="absolute top-3 right-3 bg-white p-2.5 rounded-full shadow-md hover:scale-110 transition-all z-10"
                                        title={wishlistIds.includes(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                                    >
                                        <Heart className={`w-5 h-5 transition-colors ${wishlistIds.includes(product.id) ? 'fill-rose-500 text-rose-500' : 'text-gray-400 hover:text-rose-500'}`} />
                                    </button>
                                </div>
                                <div className="p-4">
                                    <div className="flex items-center gap-1 text-yellow-400 mb-1.5">
                                        {[...Array(5)].map((_, idx) => (
                                            <Star key={idx} className="w-3.5 h-3.5 fill-current" />
                                        ))}
                                        <span className="text-xs font-bold text-gray-500 ml-1">(4.9)</span>
                                    </div>
                                    <h4 className="font-black text-gray-900 text-sm line-clamp-2 group-hover:text-indigo-600 transition-colors">
                                        {product.name}
                                    </h4>
                                </div>
                            </div>
                            <div className="p-4 pt-0 flex items-center justify-between border-t border-gray-100 mt-4">
                                <span className="text-lg font-black text-gray-900">₹{product.price || '9999.00'}</span>
                                <Link
                                    href={`/products`}
                                    className="px-3.5 py-2 bg-gray-900 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                                >
                                    View Product
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

Dashboard.layout = (page) => <SettingsLayout>{page}</SettingsLayout>;

