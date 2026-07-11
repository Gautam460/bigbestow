import React, { useState, useEffect } from 'react';
import EcommerceLayout from '../layouts/EcommerceLayout';
import { Head, Link } from '@inertiajs/react';
import { Trash2, ArrowRight, ShieldCheck, CreditCard, ShoppingBag, ArrowLeft, Tag, X, Loader2 } from 'lucide-react';
import { getCart, updateQuantity, removeFromCart, clearCart } from '../utils/cart';
import { toast } from 'sonner';

export default function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [isApplying, setIsApplying] = useState(false);

    const loadCart = () => {
        setCartItems(getCart());
    };

    useEffect(() => {
        loadCart();
        const savedCoupon = localStorage.getItem('bigbestow_coupon');
        if (savedCoupon) {
            try {
                setAppliedCoupon(JSON.parse(savedCoupon));
            } catch (e) {}
        }
        window.addEventListener('cart-updated', loadCart);
        return () => window.removeEventListener('cart-updated', loadCart);
    }, []);

    const handleQuantityChange = (id, newQty) => {
        updateQuantity(id, newQty);
    };

    const handleRemove = (id, name) => {
        removeFromCart(id);
        toast.info(`${name} removed from cart.`);
    };

    const handleClear = () => {
        clearCart();
        setAppliedCoupon(null);
        localStorage.removeItem('bigbestow_coupon');
        toast.info('Cart cleared.');
    };

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    
    let discountAmount = 0;
    if (appliedCoupon) {
        if (appliedCoupon.discount_type === 'percent') {
            discountAmount = Math.min(subtotal, Math.round((subtotal * appliedCoupon.discount_value) / 100));
        } else {
            discountAmount = Math.min(subtotal, Number(appliedCoupon.discount_value));
        }
    }
    
    const discountedSubtotal = Math.max(0, subtotal - discountAmount);
    const tax = Math.round(discountedSubtotal * 0.05 * 100) / 100;
    const total = Math.round((discountedSubtotal + tax) * 100) / 100;

    const handleApplyCoupon = async (e) => {
        e.preventDefault();
        if (!couponCode.trim()) return;

        setIsApplying(true);
        try {
            const match = document.cookie.split('; ').find(row => row.startsWith('XSRF-TOKEN='));
            const xsrfToken = match ? decodeURIComponent(match.split('=')[1]) : '';

            const res = await fetch('/coupons/apply', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-XSRF-TOKEN': xsrfToken,
                },
                credentials: 'include',
                body: JSON.stringify({ code: couponCode, subtotal }),
            });

            const data = await res.json();
            if (data.success) {
                setAppliedCoupon(data.coupon);
                localStorage.setItem('bigbestow_coupon', JSON.stringify(data.coupon));
                toast.success(data.message || 'Promo code applied successfully!');
                setCouponCode('');
            } else {
                toast.error(data.message || 'Invalid promo code.');
            }
        } catch (err) {
            toast.error('Failed to apply promo code. Please try again.');
        } finally {
            setIsApplying(false);
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        localStorage.removeItem('bigbestow_coupon');
        toast.info('Promo code removed.');
    };

    return (
        <EcommerceLayout>
            <Head title="Shopping Cart - Bigbestow Cricket" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900">Your Shopping Cart</h1>
                        <p className="text-gray-500 text-sm mt-1">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your bag</p>
                    </div>
                    {cartItems.length > 0 && (
                        <button 
                            onClick={handleClear}
                            className="text-sm font-bold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1.5"
                        >
                            <Trash2 className="w-4 h-4" /> Empty Cart
                        </button>
                    )}
                </div>
                
                {cartItems.length === 0 ? (
                    <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-gray-100 max-w-2xl mx-auto">
                        <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag className="w-10 h-10" />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 mb-2">Your cart is empty</h2>
                        <p className="text-gray-500 mb-8">Looks like you haven't added any professional cricket gear to your cart yet.</p>
                        <Link 
                            href="/products" 
                            className="inline-flex items-center gap-2 bg-indigo-600 text-white font-bold px-8 py-4 rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/30"
                        >
                            <ArrowLeft className="w-5 h-5" /> Explore Cricket Gear
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-10">
                        {/* Cart Items */}
                        <div className="w-full lg:w-2/3">
                            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-6">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex flex-col sm:flex-row gap-6 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                                        <Link href={`/products/${item.id}`} className="w-full sm:w-32 h-32 rounded-2xl bg-gray-100 overflow-hidden flex-shrink-0">
                                            <img 
                                                src={item.image || 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=400&q=80'} 
                                                alt={item.name} 
                                                className="w-full h-full object-cover hover:scale-105 transition-transform" 
                                            />
                                        </Link>
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <Link href={`/products/${item.id}`}>
                                                        <h3 className="font-bold text-gray-900 text-lg hover:text-indigo-600 transition-colors">{item.name}</h3>
                                                    </Link>
                                                    <p className="text-gray-500 text-xs font-semibold mt-1 bg-gray-100 inline-block px-2.5 py-1 rounded">
                                                        Handle: {item.attributes?.size || 'Standard SH'}
                                                    </p>
                                                </div>
                                                <div className="text-xl font-black text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</div>
                                            </div>
                                            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-50 sm:border-0 sm:pt-0">
                                                <div className="flex items-center border-2 border-gray-200 rounded-xl bg-white">
                                                    <button 
                                                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                        className="px-3.5 py-1 text-gray-600 hover:bg-gray-100 font-black text-base rounded-l-lg transition-colors"
                                                    >-</button>
                                                    <span className="px-4 font-black text-gray-900 text-sm">{item.quantity}</span>
                                                    <button 
                                                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                        className="px-3.5 py-1 text-gray-600 hover:bg-gray-100 font-black text-base rounded-r-lg transition-colors"
                                                    >+</button>
                                                </div>
                                                <button 
                                                    onClick={() => handleRemove(item.id, item.name)}
                                                    className="text-rose-500 hover:text-rose-600 flex items-center gap-1.5 text-xs font-bold transition-colors p-2 rounded-lg hover:bg-rose-50"
                                                >
                                                    <Trash2 className="w-4 h-4" /> Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Summary & Coupon Box */}
                        <div className="w-full lg:w-1/3 space-y-6">
                            {/* Promo Code Box */}
                            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                                <h3 className="text-base font-black text-gray-900 mb-3 flex items-center gap-2">
                                    <Tag className="w-4 h-4 text-indigo-600" /> Have a Promo Code?
                                </h3>
                                
                                {appliedCoupon ? (
                                    <div className="flex items-center justify-between p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black text-xs">
                                                ✓
                                            </div>
                                            <div>
                                                <div className="text-xs font-black text-emerald-950 uppercase tracking-wider">{appliedCoupon.code}</div>
                                                <div className="text-[11px] font-bold text-emerald-700">
                                                    Saving ₹{discountAmount.toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={handleRemoveCoupon}
                                            className="p-1.5 text-emerald-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                            title="Remove promo code"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                                        <input 
                                            type="text" 
                                            placeholder="Enter coupon code..."
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold placeholder-gray-400 focus:outline-none focus:border-indigo-600 uppercase tracking-wider"
                                        />
                                        <button 
                                            type="submit"
                                            disabled={isApplying || !couponCode.trim()}
                                            className="px-5 py-3 bg-gray-900 hover:bg-indigo-600 text-white font-bold text-sm rounded-xl transition-all disabled:opacity-50 flex items-center justify-center"
                                        >
                                            {isApplying ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                                        </button>
                                    </form>
                                )}
                            </div>

                            {/* Summary Card */}
                            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm sticky top-32">
                                <h2 className="text-xl font-black text-gray-900 mb-6 pb-4 border-b border-gray-100">Order Summary</h2>
                                
                                <div className="space-y-4 mb-6 text-sm">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal ({cartItems.reduce((acc, i) => acc + i.quantity, 0)} items)</span>
                                        <span className="font-bold text-gray-900">₹{subtotal.toFixed(2)}</span>
                                    </div>
                                    {appliedCoupon && (
                                        <div className="flex justify-between text-emerald-600 font-bold">
                                            <span className="flex items-center gap-1"><Tag className="w-3.5 h-3.5" /> Discount ({appliedCoupon.code})</span>
                                            <span>-₹{discountAmount.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-gray-600">
                                        <span>Express Shipping</span>
                                        <span className="text-emerald-600 font-black">Free</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Estimated Tax (5%)</span>
                                        <span className="font-bold text-gray-900">₹{tax.toFixed(2)}</span>
                                    </div>
                                </div>
                                
                                <div className="border-t border-gray-100 pt-4 mb-8">
                                    <div className="flex justify-between items-baseline">
                                        <span className="font-black text-gray-900 text-lg">Total Amount</span>
                                        <span className="font-black text-3xl text-indigo-600">₹{total.toFixed(2)}</span>
                                    </div>
                                    <p className="text-[11px] text-gray-400 mt-1">Inclusive of all taxes and shipping fees</p>
                                </div>

                                <Link 
                                    href="/checkout" 
                                    className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 mb-4"
                                >
                                    Proceed to Checkout <ArrowRight className="w-5 h-5" />
                                </Link>

                                <div className="flex items-center justify-center gap-4 text-gray-400 mt-6 pt-6 border-t border-gray-100">
                                    <ShieldCheck className="w-5 h-5 text-indigo-600" />
                                    <CreditCard className="w-5 h-5 text-indigo-600" />
                                    <span className="text-xs font-bold uppercase tracking-wider text-gray-600">100% Secure Checkout</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </EcommerceLayout>
    );
}
