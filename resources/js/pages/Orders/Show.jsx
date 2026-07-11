import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Package, Clock, CheckCircle, Truck, XCircle, ArrowLeft, MapPin, CreditCard, Tag, ShieldCheck, AlertTriangle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function OrdersShow({ order }) {
    if (!order) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 font-bold">Order details not found.</p>
                <Link href="/orders" className="text-indigo-600 font-bold mt-4 inline-block">Back to My Orders</Link>
            </div>
        );
    }

    const handleCancelOrder = () => {
        if (confirm(`Are you sure you want to cancel Order #ORD-${order.id}?`)) {
            router.post(`/orders/${order.id}/cancel`, {}, {
                onSuccess: () => {
                    toast.success(`Order #ORD-${order.id} has been cancelled.`);
                },
                onError: () => {
                    toast.error('Failed to cancel order. Please try again.');
                }
            });
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending':
                return <span className="px-3.5 py-1.5 bg-yellow-100 text-yellow-800 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5"><Clock className="w-4 h-4" /> Pending Approval</span>;
            case 'processing':
                return <span className="px-3.5 py-1.5 bg-blue-100 text-blue-800 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5"><RefreshCw className="w-4 h-4 animate-spin" /> Processing & Approved</span>;
            case 'shipped':
                return <span className="px-3.5 py-1.5 bg-purple-100 text-purple-800 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5"><Truck className="w-4 h-4" /> Shipped</span>;
            case 'delivered':
                return <span className="px-3.5 py-1.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5"><CheckCircle className="w-4 h-4" /> Delivered</span>;
            case 'cancelled':
                return <span className="px-3.5 py-1.5 bg-rose-100 text-rose-800 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5"><XCircle className="w-4 h-4" /> Cancelled</span>;
            default:
                return <span className="px-3.5 py-1.5 bg-gray-100 text-gray-800 rounded-full text-xs font-black uppercase tracking-wider">{status}</span>;
        }
    };

    const getTrackingStep = (status) => {
        if (status === 'cancelled') return 0;
        if (status === 'pending') return 1;
        if (status === 'processing') return 2;
        if (status === 'shipped') return 3;
        if (status === 'delivered') return 4;
        return 1;
    };

    const step = getTrackingStep(order.status);
    const canCancel = order.status === 'pending' || order.status === 'processing';

    return (
        <div className="space-y-6">
            <Head title={`Order #ORD-${order.id} Live Tracking | Bigbestow`} />

            <div className="flex items-center justify-between gap-4">
                <Link href="/orders" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gray-500 hover:text-indigo-600 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to All Orders
                </Link>
                {canCancel && (
                    <button
                        type="button"
                        onClick={handleCancelOrder}
                        className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-rose-600/20"
                    >
                        Cancel Order #ORD-{order.id}
                    </button>
                )}
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm space-y-8">
                {/* Header Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
                    <div>
                        <span className="text-xs font-black text-indigo-600 uppercase tracking-widest block mb-1">Live Shipment Breakdown</span>
                        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Order #ORD-{order.id}</h1>
                        <p className="text-sm font-semibold text-gray-500 mt-1">
                            Placed on {new Date(order.created_at).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                    <div>
                        {getStatusBadge(order.status)}
                    </div>
                </div>

                {/* Live Tracking Progress */}
                {order.status === 'cancelled' ? (
                    <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 flex items-start gap-4 text-rose-900">
                        <AlertTriangle className="w-6 h-6 text-rose-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="text-base font-black">Shipment Cancelled</h3>
                            <p className="text-sm text-rose-700 mt-1">
                                This order has been cancelled and stopped from dispatch. If you made an online payment, refund has been initiated to your original payment method.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-200/60">
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-6">Live Order Progress & Tracking</h3>
                        <div className="relative flex items-center justify-between max-w-3xl mx-auto px-4 my-6">
                            {/* Progress Line Background */}
                            <div className="absolute left-8 right-8 top-5 h-1.5 bg-gray-200 -z-0 rounded-full"></div>
                            {/* Progress Line Active */}
                            <div 
                                className="absolute left-8 top-5 h-1.5 bg-indigo-600 transition-all duration-700 -z-0 rounded-full"
                                style={{ width: `${((step - 1) / 3) * 100}%` }}
                            ></div>

                            {/* Step 1 */}
                            <div className="flex flex-col items-center relative z-10">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm border-2 transition-all ${
                                    step >= 1 ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-110' : 'bg-white border-gray-300 text-gray-400'
                                }`}>
                                    1
                                </div>
                                <span className="text-xs font-black mt-2 text-gray-900">Order Placed</span>
                                <span className="text-[10px] font-semibold text-gray-400">Verified</span>
                            </div>

                            {/* Step 2 */}
                            <div className="flex flex-col items-center relative z-10">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm border-2 transition-all ${
                                    step >= 2 ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-110' : 'bg-white border-gray-300 text-gray-400'
                                }`}>
                                    2
                                </div>
                                <span className="text-xs font-black mt-2 text-gray-900">Approved</span>
                                <span className="text-[10px] font-semibold text-gray-400">Processing</span>
                            </div>

                            {/* Step 3 */}
                            <div className="flex flex-col items-center relative z-10">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm border-2 transition-all ${
                                    step >= 3 ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-110' : 'bg-white border-gray-300 text-gray-400'
                                }`}>
                                    3
                                </div>
                                <span className="text-xs font-black mt-2 text-gray-900">Shipped</span>
                                <span className="text-[10px] font-semibold text-gray-400">In Transit</span>
                            </div>

                            {/* Step 4 */}
                            <div className="flex flex-col items-center relative z-10">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm border-2 transition-all ${
                                    step >= 4 ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-110' : 'bg-white border-gray-300 text-gray-400'
                                }`}>
                                    <CheckCircle className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-black mt-2 text-gray-900">Delivered</span>
                                <span className="text-[10px] font-semibold text-gray-400">Destination</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Grid: Items Breakdown & Delivery Info */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Items List (2 cols) */}
                    <div className="lg:col-span-2 space-y-4">
                        <h3 className="text-base font-black text-gray-900 tracking-tight">Shipment Itemization ({order.items?.length || 0} items)</h3>
                        <div className="divide-y divide-gray-100 border border-gray-200 rounded-2xl overflow-hidden">
                            {order.items?.map((item) => (
                                <div key={item.id} className="p-4 bg-white flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-indigo-600 font-black text-sm border">
                                            {item.quantity}x
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-sm">{item.product_name}</h4>
                                            <p className="text-xs text-gray-500 font-semibold">Unit Price: ₹{Number(item.price).toFixed(2)}</p>
                                        </div>
                                    </div>
                                    <div className="font-black text-gray-900 text-base">
                                        ₹{Number(item.subtotal || (item.price * item.quantity)).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Delivery & Payment Summary (1 col) */}
                    <div className="space-y-6">
                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200/60 space-y-4">
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-indigo-600" /> Shipping Destination
                            </h3>
                            <div className="text-xs text-gray-700 space-y-1">
                                <p className="font-black text-gray-900 text-sm">{order.customer_name}</p>
                                <p className="font-semibold">{order.customer_phone}</p>
                                <p className="text-gray-500">{order.customer_email}</p>
                                <p className="pt-2 text-gray-700 font-medium leading-relaxed">{order.shipping_address}</p>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200/60 space-y-3">
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-indigo-600" /> Payment & Billing
                            </h3>
                            <div className="space-y-2 text-xs">
                                <div className="flex justify-between text-gray-600">
                                    <span>Payment Method</span>
                                    <span className="font-bold text-gray-900 uppercase">{order.payment_method === 'online' ? 'Online Paid' : 'Cash on Delivery'}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span className="font-bold text-gray-900">₹{(Number(order.total_amount) + Number(order.discount_amount || 0)).toFixed(2)}</span>
                                </div>
                                {order.discount_amount > 0 && (
                                    <div className="flex justify-between text-emerald-600 font-bold">
                                        <span className="flex items-center gap-1"><Tag className="w-3.5 h-3.5" /> Promo Discount</span>
                                        <span>-₹{Number(order.discount_amount).toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span className="font-bold text-emerald-600">FREE</span>
                                </div>
                                <div className="flex justify-between pt-3 border-t border-gray-200 text-sm">
                                    <span className="font-black text-gray-900">Total Paid / Payable</span>
                                    <span className="font-black text-indigo-600 text-base">₹{Number(order.total_amount).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
