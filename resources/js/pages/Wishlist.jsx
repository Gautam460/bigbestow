import React from 'react';
import EcommerceLayout from '../layouts/EcommerceLayout';
import { Head, Link } from '@inertiajs/react';
import { HeartOff, ShoppingCart } from 'lucide-react';

export default function Wishlist() {
    const wishlistItems = [
        { id: 3, name: "Minimalist Chronograph Watch", category: "Watches", price: 199, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80" },
    ];

    return (
        <EcommerceLayout>
            <Head title="My Wishlist - ShopStyle" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[60vh]">
                <h1 className="text-3xl font-black text-gray-900 mb-8">My Wishlist <span className="text-gray-400 font-normal text-xl">({wishlistItems.length} items)</span></h1>
                
                {wishlistItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {wishlistItems.map((item) => (
                            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group">
                                <div className="relative h-60 overflow-hidden bg-gray-100">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-sm text-rose-500 hover:bg-rose-50 transition-colors">
                                        <HeartOff className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="p-4">
                                    <div className="text-xs font-semibold tracking-wide text-indigo-500 mb-1 uppercase">{item.category}</div>
                                    <h3 className="font-bold text-gray-800 mb-2 truncate text-lg">{item.name}</h3>
                                    <div className="text-xl font-black text-gray-900 mb-4">${item.price}</div>
                                    <button className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-bold flex justify-center items-center gap-2 hover:bg-indigo-700 transition-colors">
                                        <ShoppingCart className="w-4 h-4" /> Move to Cart
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <HeartOff className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
                        <p className="text-gray-500 mb-6">Save items you love here to buy them later.</p>
                        <Link href="/products" className="inline-block bg-indigo-600 text-white font-bold py-3 px-8 rounded-full hover:bg-indigo-700 transition-colors">
                            Explore Products
                        </Link>
                    </div>
                )}
            </div>
        </EcommerceLayout>
    );
}
