import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Package, Clock, CheckCircle, Truck, XCircle, Eye, ArrowRight, ShieldCheck, AlertTriangle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function OrdersIndex({ orders = [] }) {
    const handleCancelOrder = (orderId) => {
        if (confirm(`Are you sure you want to cancel Order #ORD-${orderId}?`)) {
            router.post(`/orders/${orderId}/cancel`, {}, {
                onSuccess: () => {
                    toast.success(`Order #ORD-${orderId} has been cancelled.`);
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
                return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Pending Approval</span>;
            case 'processing':
                return <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5"><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Processing & Approved</span>;
            case 'shipped':
                return <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5"><Truck className="w-3.5 h-3.5" /> Shipped</span>;
            case 'delivered':
                return <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5" /> Delivered</span>;
            case 'cancelled':
                return <span className="px-3 py-1 bg-rose-100 text-rose-800 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5"><XCircle className="w-3.5 h-3.5" /> Cancelled</span>;
            default:
                return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-black uppercase tracking-wider">{status}</span>;
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

    return (
        <div className="space-y-6">
            <Head title="My Orders & Live Tracking | Bigbestow" />

            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-100">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
                            <Package className="w-7 h-7 text-indigo-600" /> My Orders & Live Tracking
                        </h2>
                        <p className="text-sm font-semibold text-gray-500 mt-1">
                            Track your package shipment status, review items, or cancel pending orders.
                        </p>
                    </div>
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-sm self-start sm:self-auto"
                    >
                        Explore New Drops <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {orders.length === 0 ? (
                    <div className="text-center py-16 bg-gray-50/60 rounded-2xl border-2 border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Package className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-black text-gray-900 mb-1">No orders placed yet</h3>
                        <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
                            When you purchase premium English willow bats or cricket gear, your live order tracking will appear here.
                        </p>
                        <Link
                            href="/products"
                            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-indigo-600/20"
                        >
                            Start Shopping Now
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => {
                            const step = getTrackingStep(order.status);
                            const canCancel = order.status === 'pending' || order.status === 'processing';

                            return (
                                <div key={order.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden">
                                    {/* Order Header */}
                                    <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
                                        <div className="flex flex-wrap items-center gap-6">
                                            <div>
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Order Number</span>
                                                <span className="text-base font-black text-gray-900">#ORD-{order.id}</span>
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Date Placed</span>
                                                <span className="text-sm font-bold text-gray-700">
                                                    {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Total Amount</span>
                                                <span className="text-base font-black text-indigo-600">₹{Number(order.total_amount).toFixed(2)}</span>
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Payment</span>
                                                <span className="text-xs font-bold text-gray-700 uppercase bg-gray-200/70 px-2 py-0.5 rounded">
                                                    {order.payment_method === 'online' ? 'Online Paid' : 'Cash on Delivery'}
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            {getStatusBadge(order.status)}
                                        </div>
                                    </div>

                                    {/* Order Body & Live Tracking Bar */}
                                    <div className="p-6">
                                        {order.status === 'cancelled' ? (
                                            <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 mb-6 flex items-center gap-3 text-rose-800">
                                                <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-600" />
                                                <div>
                                                    <h4 className="text-sm font-black">Order Cancelled</h4>
                                                    <p className="text-xs text-rose-700">This order was cancelled and will not be shipped. If payment was made online, refund processing initiates automatically.</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="mb-8">
                                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Live Shipment Tracking Status</p>
                                                <div className="relative flex items-center justify-between max-w-2xl mx-auto px-4">
                                                    {/* Progress Line Background */}
                                                    <div className="absolute left-8 right-8 top-4 h-1 bg-gray-200 -z-0"></div>
                                                    {/* Progress Line Active */}
                                                    <div 
                                                        className="absolute left-8 top-4 h-1 bg-indigo-600 transition-all duration-500 -z-0"
                                                        style={{ width: `${((step - 1) / 3) * 100}%` }}
                                                    ></div>

                                                    {/* Step 1 */}
                                                    <div className="flex flex-col items-center relative z-10">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs border-2 ${
                                                            step >= 1 ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'bg-white border-gray-300 text-gray-400'
                                                        }`}>
                                                            1
                                                        </div>
                                                        <span className="text-[11px] font-bold mt-2 text-gray-700">Order Placed</span>
                                                    </div>

                                                    {/* Step 2 */}
                                                    <div className="flex flex-col items-center relative z-10">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs border-2 ${
                                                            step >= 2 ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'bg-white border-gray-300 text-gray-400'
                                                        }`}>
                                                            2
                                                        </div>
                                                        <span className="text-[11px] font-bold mt-2 text-gray-700">Approved</span>
                                                    </div>

                                                    {/* Step 3 */}
                                                    <div className="flex flex-col items-center relative z-10">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs border-2 ${
                                                            step >= 3 ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'bg-white border-gray-300 text-gray-400'
                                                        }`}>
                                                            3
                                                        </div>
                                                        <span className="text-[11px] font-bold mt-2 text-gray-700">Shipped</span>
                                                    </div>

                                                    {/* Step 4 */}
                                                    <div className="flex flex-col items-center relative z-10">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs border-2 ${
                                                            step >= 4 ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'bg-white border-gray-300 text-gray-400'
                                                        }`}>
                                                            <CheckCircle className="w-4 h-4" />
                                                        </div>
                                                        <span className="text-[11px] font-bold mt-2 text-gray-700">Delivered</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Items Preview */}
                                        <div className="bg-gray-50/50 rounded-xl p-4 mb-6 border border-gray-100">
                                            <p className="text-xs font-black text-gray-600 uppercase mb-3">Items in this shipment ({order.items?.length || 0})</p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                                {order.items?.slice(0, 3).map((item) => (
                                                    <div key={item.id} className="flex items-center gap-3 bg-white p-2.5 rounded-lg border border-gray-200/60 shadow-xs">
                                                        <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0 text-indigo-600 font-bold text-xs">
                                                            {item.quantity}x
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <h5 className="font-bold text-xs text-gray-900 truncate">{item.product_name}</h5>
                                                            <span className="text-[11px] text-gray-500 font-semibold">₹{Number(item.price).toFixed(2)} each</span>
                                                        </div>
                                                    </div>
                                                ))}
                                                {(order.items?.length > 3) && (
                                                    <div className="flex items-center justify-center bg-white p-2.5 rounded-lg border border-gray-200/60 text-xs font-bold text-indigo-600">
                                                        +{order.items.length - 3} more items...
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-gray-100">
                                            <div className="text-xs text-gray-500 font-medium">
                                                Shipping to: <span className="text-gray-900 font-bold">{order.shipping_address || 'Registered Address'}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {canCancel && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleCancelOrder(order.id)}
                                                        className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-xs"
                                                    >
                                                        Cancel Order
                                                    </button>
                                                )}
                                                <Link
                                                    href={`/orders/${order.id}`}
                                                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
                                                >
                                                    <Eye className="w-3.5 h-3.5" /> View Details & Track
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
