import React, { useState, useEffect } from 'react';
import EcommerceLayout from '../layouts/EcommerceLayout';
import { Head, Link } from '@inertiajs/react';
import { Heart, HeartOff, ShoppingCart, Trash2 } from 'lucide-react';
import { getWishlist, removeFromWishlist } from '../utils/wishlist';
import { addToCart } from '../utils/cart';
import { toast } from 'sonner';

export default function Wishlist() {
    const [wishlistItems, setWishlistItems] = useState([]);

    const loadWishlist = () => {
        setWishlistItems(getWishlist());
    };

    useEffect(() => {
        loadWishlist();
        window.addEventListener('wishlist-updated', loadWishlist);
        return () => window.removeEventListener('wishlist-updated', loadWishlist);
    }, []);

    const handleRemove = (id, name) => {
        removeFromWishlist(id);
        toast.info(`${name} removed from wishlist`);
    };

    const handleMoveToCart = (item) => {
        addToCart(item);
        removeFromWishlist(item.id);
        toast.success(`${item.name} moved to cart!`);
    };

    return (
        <EcommerceLayout>
            <Head title="My Wishlist - Bigbestow" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[60vh]">
                <h1 className="text-3xl font-black text-gray-900 mb-8">My Wishlist <span className="text-gray-400 font-normal text-xl">({wishlistItems.length} items)</span></h1>
                
                {wishlistItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {wishlistItems.map((item) => (
                            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
                                <div>
                                    <div className="relative h-60 overflow-hidden bg-gray-100">
                                        <Link href={`/products/${item.slug || item.id}`}>
                                            <img src={item.image || 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=400&q=80'} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        </Link>
                                        <button 
                                            type="button"
                                            onClick={() => handleRemove(item.id, item.name)}
                                            title="Remove from wishlist"
                                            className="absolute top-3 right-3 bg-white p-2.5 rounded-full shadow-md text-rose-500 hover:scale-110 transition-all z-10"
                                        >
                                            <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
                                        </button>
                                    </div>
                                    <div className="p-4">
                                        <div className="text-xs font-semibold tracking-wide text-indigo-500 mb-1 uppercase">{typeof item.category === 'string' ? item.category : (item.category?.name || 'Equipment')}</div>
                                        <Link href={`/products/${item.slug || item.id}`}>
                                            <h3 className="font-bold text-gray-800 mb-2 truncate text-lg hover:text-indigo-600 transition-colors">{item.name}</h3>
                                        </Link>
                                        <div className="text-xl font-black text-gray-900 mb-4">₹{item.price}</div>
                                    </div>
                                </div>
                                <div className="p-4 pt-0">
                                    <button 
                                        type="button"
                                        onClick={() => handleMoveToCart(item)}
                                        className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-bold flex justify-center items-center gap-2 hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-600/20"
                                    >
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
