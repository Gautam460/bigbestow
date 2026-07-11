import React from 'react';
import EcommerceLayout from '../layouts/EcommerceLayout';
import { Head, Link } from '@inertiajs/react';
import { CheckCircle2, Package, Truck, Calendar, MapPin, ArrowRight, ShoppingBag, ShieldCheck, Banknote, CreditCard, Tag } from 'lucide-react';

export default function OrderSuccess({ order }) {
    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Calculate estimated delivery (5 days from creation)
    const getEstDelivery = (dateStr) => {
        const date = new Date(dateStr || Date.now());
        date.setDate(date.getDate() + 5);
        return formatDate(date);
    };

    const baseAmount = Number(order.total_amount) + Number(order.discount_amount || 0);

    return (
        <EcommerceLayout>
            <Head title={`Order Confirmed #ORD-${order.id} - Bigbestow Cricket`} />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Celebratory Banner */}
                <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-8 sm:p-12 text-white text-center shadow-xl relative overflow-hidden mb-10">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <CheckCircle2 className="w-12 h-12 text-white animate-bounce" />
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-black mb-3">Order Confirmed!</h1>
                    <p className="text-emerald-100 text-base sm:text-lg max-w-lg mx-auto">
                        Thank you for shopping with Bigbestow! Your order has been saved to our database and is being readied for dispatch.
                    </p>
                    <div className="mt-8 inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-2.5 rounded-full border border-white/20 text-sm font-bold">
                        <span>Order Number:</span>
                        <span className="text-amber-300 font-black text-base">#ORD-{order.id}</span>
                    </div>
                </div>

                {/* Order Status & Delivery Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 font-bold">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Order Date</span>
                            <span className="font-black text-gray-900 text-sm">{formatDate(order.created_at)}</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 font-bold">
                            <Truck className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Est. Delivery</span>
                            <span className="font-black text-gray-900 text-sm">{getEstDelivery(order.created_at)}</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0 font-bold">
                            {order.payment_method === 'online' ? <CreditCard className="w-6 h-6" /> : <Banknote className="w-6 h-6" />}
                        </div>
                        <div>
                            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Payment Method</span>
                            <span className="font-black text-gray-900 text-sm uppercase">{order.payment_method} ({order.payment_status})</span>
                        </div>
                    </div>
                </div>

                {/* Order Details Breakdown */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm mb-10 space-y-8">
                    <div>
                        <h3 className="text-xl font-black text-gray-900 mb-6 pb-4 border-b border-gray-100 flex items-center gap-2">
                            <Package className="w-6 h-6 text-indigo-600" /> Items in Your Order
                        </h3>

                        <div className="space-y-6">
                            {order.items && order.items.map((item) => (
                                <div key={item.id} className="flex justify-between items-center pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-base">{item.product_name}</h4>
                                        <p className="text-xs text-gray-500 font-semibold mt-0.5">
                                            Quantity: {item.quantity} | {item.attributes?.size || 'Standard SH'} | Price: ₹{item.price}
                                        </p>
                                    </div>
                                    <div className="font-black text-gray-900 text-base">₹{Number(item.subtotal).toFixed(2)}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="pt-6 border-t border-gray-100">
                        <h4 className="text-sm font-black uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-indigo-600" /> Shipping & Customer Address
                        </h4>
                        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 text-sm">
                            <p className="font-black text-gray-900">{order.customer_name}</p>
                            <p className="text-gray-600 mt-1">{order.shipping_address}</p>
                            <p className="text-gray-500 text-xs mt-2 font-semibold">Phone: {order.customer_phone} | Email: {order.customer_email}</p>
                            {order.notes && <p className="text-amber-800 bg-amber-50 p-2 rounded-lg mt-2 text-xs font-semibold">Note: {order.notes}</p>}
                        </div>
                    </div>

                    {/* Total Summary */}
                    <div className="pt-6 border-t border-gray-100 space-y-3">
                        <div className="flex justify-between text-gray-600 text-sm">
                            <span>Subtotal / Base Amount</span>
                            <span className="font-bold text-gray-900">₹{baseAmount.toFixed(2)}</span>
                        </div>
                        {order.coupon_code && (
                            <div className="flex justify-between text-emerald-600 font-bold text-sm bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                                <span className="flex items-center gap-1.5"><Tag className="w-4 h-4" /> Promo Code Applied ({order.coupon_code})</span>
                                <span>-₹{Number(order.discount_amount).toFixed(2)}</span>
                            </div>
                        )}
                        <div className="pt-3 border-t border-gray-100 flex justify-between items-baseline">
                            <span className="font-black text-gray-900 text-xl">Total Paid / Payable</span>
                            <span className="font-black text-3xl text-indigo-600">₹{Number(order.total_amount).toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link 
                        href="/products" 
                        className="bg-indigo-600 text-white font-bold px-8 py-4 rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
                    >
                        <ShoppingBag className="w-5 h-5" /> Continue Shopping
                    </Link>
                    <Link 
                        href="/" 
                        className="bg-gray-100 text-gray-800 font-bold px-8 py-4 rounded-2xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                    >
                        Return to Homepage <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        </EcommerceLayout>
    );
}
