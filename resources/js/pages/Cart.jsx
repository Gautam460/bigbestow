import React from 'react';
import EcommerceLayout from '../layouts/EcommerceLayout';
import { Head, Link } from '@inertiajs/react';
import { Trash2, ArrowRight, ShieldCheck, CreditCard } from 'lucide-react';

export default function Cart() {
    const cartItems = [
        { id: 1, name: "Premium Leather Backpack", price: 129, quantity: 1, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=400&q=80" },
        { id: 2, name: "Oversized Cotton Hoodie", price: 65, quantity: 2, image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=400&q=80" },
    ];

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const tax = subtotal * 0.05;
    const total = subtotal + tax;

    return (
        <EcommerceLayout>
            <Head title="Shopping Cart - ShopStyle" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-black text-gray-900 mb-8">Your Cart (3 items)</h1>
                
                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Cart Items */}
                    <div className="w-full lg:w-2/3">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex gap-6 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-gray-900 text-lg">{item.name}</h3>
                                                <p className="text-gray-500 text-sm mt-1">Size: M | Color: Black</p>
                                            </div>
                                            <div className="text-xl font-black text-gray-900">${item.price}</div>
                                        </div>
                                        <div className="flex justify-between items-center mt-4">
                                            <div className="flex items-center border border-gray-200 rounded-lg">
                                                <button className="px-3 py-1 text-gray-500 hover:bg-gray-100 rounded-l-lg">-</button>
                                                <span className="px-3 font-semibold">{item.quantity}</span>
                                                <button className="px-3 py-1 text-gray-500 hover:bg-gray-100 rounded-r-lg">+</button>
                                            </div>
                                            <button className="text-rose-500 hover:text-rose-600 flex items-center gap-1 text-sm font-medium transition-colors">
                                                <Trash2 className="w-4 h-4" /> Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="w-full lg:w-1/3">
                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 sticky top-32">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                            
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span className="text-green-600 font-bold">Free</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Estimated Tax</span>
                                    <span className="font-semibold text-gray-900">${tax.toFixed(2)}</span>
                                </div>
                            </div>
                            
                            <div className="border-t border-gray-200 pt-4 mb-6">
                                <div className="flex justify-between items-end">
                                    <span className="font-bold text-gray-900 text-lg">Total</span>
                                    <span className="font-black text-3xl text-indigo-600">${total.toFixed(2)}</span>
                                </div>
                            </div>

                            <button className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 mb-4">
                                Proceed to Checkout <ArrowRight className="w-5 h-5" />
                            </button>

                            <div className="flex items-center justify-center gap-4 text-gray-400 mt-6">
                                <ShieldCheck className="w-6 h-6" />
                                <CreditCard className="w-6 h-6" />
                                <span className="text-xs font-semibold uppercase tracking-wider">Secure Checkout</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </EcommerceLayout>
    );
}
