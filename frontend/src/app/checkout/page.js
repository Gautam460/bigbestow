'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import EcommerceLayout from '@/layouts/EcommerceLayout';
import Link from 'next/link';
import { usePage, Head } from '@/lib/inertia-compat';
import { useApp } from '@/context/AppContext';
import api from '@/lib/api';
import { ShieldCheck, CreditCard, Banknote, Truck, CheckCircle2, ArrowLeft, Lock, AlertCircle, Tag, ArrowRight } from 'lucide-react';
import { getCart, clearCart } from '@/utils/cart';
import { toast } from 'sonner';

export default function CheckoutPage() {
    const router = useRouter();
    const { user } = useApp();
    const { props } = usePage();
    const auth = { user: user || props.auth?.user };
    const [errors, setErrors] = useState(props.errors || {});

    const [cartItems, setCartItems] = useState([]);
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [isApplying, setIsApplying] = useState(false);

    const [formData, setFormData] = useState({
        customer_name: auth.user ? auth.user.name : '',
        customer_email: auth.user ? auth.user.email : '',
        customer_phone: '',
        shipping_address: '',
        payment_method: 'cod',
        notes: '',
    });

    useEffect(() => {
        if (auth.user) {
            setFormData(prev => ({
                ...prev,
                customer_name: prev.customer_name || auth.user.name || '',
                customer_email: prev.customer_email || auth.user.email || ''
            }));
        }
    }, [auth.user]);

    useEffect(() => {
        const items = getCart();
        if (items.length === 0) {
            toast.error('Your cart is empty. Please add items before checking out.');
            router.push('/products');
        } else {
            setCartItems(items);
        }

        const savedCoupon = localStorage.getItem('bigbestow_coupon');
        if (savedCoupon) {
            try {
                setAppliedCoupon(JSON.parse(savedCoupon));
            } catch (e) {}
        }
    }, [router]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Enforce Login Check for COD & Online Delivery
        if (!auth.user) {
            toast.error('Please login or register to place an order with Cash on Delivery or Online Payment.');
            router.push('/login');
            return;
        }

        setIsSubmitting(true);
        setErrors({});

        try {
            const res = await api.post('/api/checkout/order', {
                ...formData,
                items: cartItems,
                coupon_code: appliedCoupon?.code || null,
                discount_amount: discountAmount || 0,
            });

            if (res && res.success) {
                clearCart();
                localStorage.removeItem('bigbestow_coupon');
                toast.success(res.message || 'Order placed successfully!');
                router.push(`/order-success?id=${res.order_id || res.order?.id}`);
            } else {
                toast.error((res && res.message) || 'Failed to place order.');
            }
        } catch (err) {
            if (err?.response?.status === 422) {
                const responseErrors = err.response.data.errors || {};
                setErrors(responseErrors);
                
                // Check if the error is related to invalid product IDs
                const hasInvalidProduct = Object.keys(responseErrors).some(key => key.match(/items\.\d+\.id/));
                if (hasInvalidProduct) {
                    toast.error('Some items in your cart are no longer available in our store. We have cleared your cart.');
                    clearCart();
                    setTimeout(() => {
                        router.push('/products');
                    }, 2000);
                } else {
                    toast.error('Please check the form for errors and try again.');
                }
            } else {
                toast.error(err?.response?.data?.message || 'Something went wrong while placing your order.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleApplyCoupon = async (e) => {
        e.preventDefault();
        if (!couponCode.trim()) return;

        setIsApplying(true);
        try {
            const data = await api.post('/coupons/apply', { code: couponCode, subtotal });
            if (data && data.success) {
                setAppliedCoupon(data.coupon);
                localStorage.setItem('bigbestow_coupon', JSON.stringify(data.coupon));
                toast.success(data.message || 'Promo code applied successfully!');
                setCouponCode('');
            } else {
                toast.error((data && data.message) || 'Invalid promo code.');
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Failed to apply promo code. Please try again.');
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
            <Head title="Secure Checkout - Bigbestow Cricket" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400 mb-8">
                    <Link href="/cart" className="hover:text-indigo-600 font-bold flex items-center gap-1">
                        <ArrowLeft className="w-4 h-4" /> Back to Cart
                    </Link>
                    <span>/</span>
                    <span className="text-gray-900 dark:text-white font-bold">Secure Checkout</span>
                </div>

                <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-8">Complete Your Order</h1>

                {/* Login Enforcement Banner */}
                {!auth.user && (
                    <div className="mb-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-amber-500 text-white rounded-2xl flex items-center justify-center font-black flex-shrink-0 shadow-md">
                                <Lock className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-amber-950">Login Required to Place Order</h3>
                                <p className="text-sm text-amber-800 font-medium mt-0.5">
                                    You must be logged in to choose <strong>Cash on Delivery (COD)</strong> or <strong>Online Delivery</strong> and finalize your order.
                                </p>
                            </div>
                        </div>
                        <Link 
                            href="/login" 
                            className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-yellow-400 font-black rounded-xl text-sm transition-all shadow-md whitespace-nowrap flex items-center gap-2"
                        >
                            Login / Register Now <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Left: Customer & Shipping Details (7 cols) */}
                    <div className="lg:col-span-7 space-y-8">
                        {/* Contact Information */}
                        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-slate-700 shadow-sm">
                            <h2 className="text-xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-indigo-600 text-white text-sm flex items-center justify-center font-bold">1</span>
                                Contact Information
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-black uppercase tracking-wider text-gray-700 dark:text-slate-300 mb-2">Full Name *</label>
                                    <input 
                                        type="text" 
                                        name="customer_name"
                                        required
                                        value={formData.customer_name} 
                                        onChange={handleChange} 
                                        placeholder="e.g. Virat Kohli"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-indigo-600 focus:border-transparent font-medium"
                                    />
                                    {errors.customer_name && <p className="text-rose-500 text-xs mt-1 font-semibold">{errors.customer_name}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-black uppercase tracking-wider text-gray-700 dark:text-slate-300 mb-2">Email Address *</label>
                                    <input 
                                        type="email" 
                                        name="customer_email"
                                        required
                                        value={formData.customer_email} 
                                        onChange={handleChange} 
                                        placeholder="e.g. virat@example.com"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-indigo-600 focus:border-transparent font-medium"
                                    />
                                    {errors.customer_email && <p className="text-rose-500 text-xs mt-1 font-semibold">{errors.customer_email}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-black uppercase tracking-wider text-gray-700 dark:text-slate-300 mb-2">Phone Number *</label>
                                    <input 
                                        type="tel" 
                                        name="customer_phone"
                                        required
                                        value={formData.customer_phone} 
                                        onChange={handleChange} 
                                        placeholder="e.g. +91 98765 43210"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-indigo-600 focus:border-transparent font-medium"
                                    />
                                    {errors.customer_phone && <p className="text-rose-500 text-xs mt-1 font-semibold">{errors.customer_phone}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-slate-700 shadow-sm">
                            <h2 className="text-xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-indigo-600 text-white text-sm flex items-center justify-center font-bold">2</span>
                                Shipping Address
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-wider text-gray-700 dark:text-slate-300 mb-2">Complete Street Address & PIN Code *</label>
                                    <textarea 
                                        name="shipping_address"
                                        required
                                        rows={4}
                                        value={formData.shipping_address} 
                                        onChange={handleChange} 
                                        placeholder="Enter house/flat number, street name, landmark, city, state and postal code..."
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-indigo-600 focus:border-transparent font-medium"
                                    />
                                    {errors.shipping_address && <p className="text-rose-500 text-xs mt-1 font-semibold">{errors.shipping_address}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-black uppercase tracking-wider text-gray-700 dark:text-slate-300 mb-2">Order Notes / Delivery Instructions (Optional)</label>
                                    <input 
                                        type="text" 
                                        name="notes"
                                        value={formData.notes} 
                                        onChange={handleChange} 
                                        placeholder="e.g. Please call before arriving or deliver to security guard."
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-indigo-600 focus:border-transparent font-medium text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Payment Method Selector */}
                        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-slate-700 shadow-sm">
                            <h2 className="text-xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-indigo-600 text-white text-sm flex items-center justify-center font-bold">3</span>
                                Choose Payment Method
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* COD */}
                                <label className={`border-2 rounded-2xl p-5 cursor-pointer transition-all flex items-start gap-4 ${
                                    formData.payment_method === 'cod' 
                                        ? 'border-indigo-600 bg-indigo-50/50 shadow-md' 
                                        : 'border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                                }`}>
                                    <input 
                                        type="radio" 
                                        name="payment_method" 
                                        value="cod"
                                        checked={formData.payment_method === 'cod'} 
                                        onChange={handleChange}
                                        className="mt-1 text-indigo-600 focus:ring-indigo-500" 
                                    />
                                    <div>
                                        <div className="flex items-center gap-2 font-black text-gray-900 dark:text-white text-base">
                                            <Banknote className="w-5 h-5 text-emerald-600" /> Cash on Delivery
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Pay with cash or UPI directly to the delivery executive when your gear arrives.</p>
                                    </div>
                                </label>

                                {/* Online Payment */}
                                <label className={`border-2 rounded-2xl p-5 cursor-pointer transition-all flex items-start gap-4 ${
                                    formData.payment_method === 'online' 
                                        ? 'border-indigo-600 bg-indigo-50/50 shadow-md' 
                                        : 'border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                                }`}>
                                    <input 
                                        type="radio" 
                                        name="payment_method" 
                                        value="online"
                                        checked={formData.payment_method === 'online'} 
                                        onChange={handleChange}
                                        className="mt-1 text-indigo-600 focus:ring-indigo-500" 
                                    />
                                    <div>
                                        <div className="flex items-center gap-2 font-black text-gray-900 dark:text-white text-base">
                                            <CreditCard className="w-5 h-5 text-indigo-600" /> Online Payment
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Instant payment simulation via Cards, UPI (GPay/PhonePe/Paytm), or Netbanking.</p>
                                        {formData.payment_method === 'online' && (
                                            <div className="mt-3 p-2 bg-indigo-100/70 rounded-lg text-[11px] font-bold text-indigo-800 flex items-center gap-1">
                                                <CheckCircle2 className="w-3.5 h-3.5" /> Instant verification active
                                            </div>
                                        )}
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Right: Order Summary Sidebar (5 cols) */}
                    <div className="lg:col-span-5">
                        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-slate-700 shadow-sm sticky top-32">
                            <h2 className="text-xl font-black text-gray-900 dark:text-white mb-6 pb-4 border-b border-gray-100 dark:border-slate-700">Order Summary</h2>

                            {/* Cart Items List */}
                            <div className="space-y-4 max-h-72 overflow-y-auto mb-6 pr-2 scrollbar-thin">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex gap-4 items-center">
                                        <div className="w-14 h-14 rounded-xl bg-gray-100 dark:bg-slate-800 overflow-hidden flex-shrink-0 border">
                                            <img src={item.image || 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=400&q=80'} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate">{item.name}</h4>
                                            <p className="text-xs text-gray-400 font-semibold">Qty: {item.quantity} | {item.attributes?.size || 'Standard'}</p>
                                        </div>
                                        <div className="font-black text-gray-900 dark:text-white text-sm">₹{(item.price * item.quantity).toFixed(2)}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Promo Code Input Section */}
                            <div className="mb-6 pb-6 border-b border-gray-100 dark:border-slate-700">
                                {appliedCoupon ? (
                                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-emerald-500 text-white rounded-xl">
                                                <Tag className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <div className="font-black text-emerald-900 text-sm tracking-wide">{appliedCoupon.code}</div>
                                                <div className="text-xs text-emerald-700 font-medium">
                                                    Saving ₹{discountAmount.toFixed(2)} ({appliedCoupon.discount_type === 'percent' ? `${appliedCoupon.discount_value}% OFF` : `₹${appliedCoupon.discount_value} OFF`})
                                                </div>
                                            </div>
                                        </div>
                                        <button 
                                            type="button"
                                            onClick={handleRemoveCoupon}
                                            className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline px-2 py-1"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <Tag className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                            <input 
                                                type="text" 
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value)}
                                                placeholder="Enter promo code (e.g. WELCOME10)" 
                                                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-xl text-xs font-bold uppercase tracking-wider focus:bg-white dark:bg-slate-800 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all"
                                                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleApplyCoupon(e); } }}
                                            />
                                        </div>
                                        <button 
                                            type="button"
                                            onClick={handleApplyCoupon}
                                            disabled={isApplying || !couponCode.trim()}
                                            className="px-5 py-3 bg-gray-900 hover:bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all disabled:opacity-50 shadow-sm"
                                        >
                                            {isApplying ? 'Applying...' : 'Apply'}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Cost Breakdown */}
                            <div className="space-y-3 py-4 border-t border-b border-gray-100 dark:border-slate-700 text-sm mb-6">
                                <div className="flex justify-between text-gray-600 dark:text-slate-400">
                                    <span>Subtotal</span>
                                    <span className="font-bold text-gray-900 dark:text-white">₹{subtotal.toFixed(2)}</span>
                                </div>
                                {appliedCoupon && (
                                    <div className="flex justify-between text-emerald-600 font-bold">
                                        <span className="flex items-center gap-1"><Tag className="w-3.5 h-3.5" /> Promo ({appliedCoupon.code})</span>
                                        <span>-₹{discountAmount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-gray-600 dark:text-slate-400">
                                    <span>Shipping</span>
                                    <span className="text-emerald-600 font-black">Free</span>
                                </div>
                                <div className="flex justify-between text-gray-600 dark:text-slate-400">
                                    <span>Estimated Tax (5%)</span>
                                    <span className="font-bold text-gray-900 dark:text-white">₹{tax.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-baseline mb-8">
                                <span className="font-black text-gray-900 dark:text-white text-lg">Total Payable</span>
                                <span className="font-black text-3xl text-indigo-600">₹{total.toFixed(2)}</span>
                            </div>

                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className={`w-full font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg text-base ${
                                    auth.user 
                                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/30' 
                                        : 'bg-amber-500 hover:bg-amber-600 text-amber-950 shadow-amber-500/30'
                                } disabled:opacity-50`}
                            >
                                {isSubmitting ? (
                                    <span className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
                                ) : auth.user ? (
                                    <>
                                        <Lock className="w-5 h-5" /> Place Order Now (₹{total.toFixed(2)})
                                    </>
                                ) : (
                                    <>
                                        <Lock className="w-5 h-5" /> Login Required to Place Order
                                    </>
                                )}
                            </button>

                            <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1.5 font-medium">
                                <ShieldCheck className="w-4 h-4 text-emerald-600" /> By placing order, you agree to our Terms & Privacy.
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </EcommerceLayout>
    );
}
