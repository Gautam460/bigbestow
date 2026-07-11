import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Package, Truck, CheckCircle2, Clock, XCircle, CreditCard, Banknote, User, MapPin, Phone, Mail, Calendar, Tag, ShieldCheck, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function Show({ order }) {
    const [status, setStatus] = useState(order.status || 'pending');
    const [paymentStatus, setPaymentStatus] = useState(order.payment_status || 'pending');

    const handleSaveStatus = (e) => {
        e.preventDefault();
        router.put(`/admin/orders/${order.id}`, {
            status,
            payment_status: paymentStatus,
        }, {
            preserveScroll: true,
            onSuccess: () => toast.success(`Order #ORD-${order.id} updated successfully!`),
            onError: () => toast.error('Failed to update order status'),
        });
    };

    const getStatusBadge = (s) => {
        switch (s) {
            case 'pending':
                return <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 w-fit"><Clock className="w-3.5 h-3.5" /> Pending</span>;
            case 'processing':
                return <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 w-fit"><Package className="w-3.5 h-3.5" /> Processing</span>;
            case 'shipped':
                return <span className="px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 w-fit"><Truck className="w-3.5 h-3.5" /> Shipped</span>;
            case 'delivered':
                return <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 w-fit"><CheckCircle2 className="w-3.5 h-3.5" /> Delivered</span>;
            case 'cancelled':
                return <span className="px-3 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 w-fit"><XCircle className="w-3.5 h-3.5" /> Cancelled</span>;
            default:
                return <span className="px-3 py-1 bg-gray-50 text-gray-700 border border-gray-200 rounded-full text-xs font-black uppercase">{s}</span>;
        }
    };

    const isOnline = order.payment_method === 'online';

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-8">
            <Head title={`Order #ORD-${order.id} - Admin`} />

            {/* Back Link & Title */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/orders"
                        className="p-2.5 bg-white border border-gray-200 rounded-2xl hover:bg-slate-50 transition-all shadow-sm"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-700" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tight">
                                Order <span className="text-yellow-500">#ORD-{order.id}</span>
                            </h2>
                            {getStatusBadge(order.status)}
                        </div>
                        <p className="text-slate-500 text-xs mt-1 flex items-center gap-2 font-semibold">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            Placed on {new Date(order.created_at).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Items & Customer Details */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Purchased Items */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-6 space-y-6">
                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-2 border-b border-gray-100 pb-4">
                            <Package className="w-5 h-5 text-yellow-500" /> Order Items ({order.items?.length || 0})
                        </h3>

                        <div className="divide-y divide-gray-100">
                            {order.items && order.items.map((item) => (
                                <div key={item.id} className="py-4 flex items-center justify-between gap-4">
                                    <div>
                                        <h4 className="font-black text-slate-900 text-base">{item.product_name}</h4>
                                        <p className="text-xs text-slate-500 font-bold mt-0.5">
                                            Price: ₹{Number(item.price).toLocaleString()} &times; {item.quantity}
                                        </p>
                                    </div>
                                    <div className="text-right font-black text-slate-900 text-lg">
                                        ₹{Number(item.subtotal).toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Financial Breakdown */}
                        <div className="bg-slate-50/80 rounded-2xl p-6 space-y-3 border border-gray-100/80">
                            <div className="flex justify-between text-sm text-slate-600 font-bold">
                                <span>Subtotal</span>
                                <span>₹{(Number(order.total_amount) + Number(order.discount_amount || 0)).toLocaleString()}</span>
                            </div>
                            {order.coupon_code && (
                                <div className="flex justify-between text-sm text-emerald-600 font-bold">
                                    <span className="flex items-center gap-1.5">
                                        <Tag className="w-4 h-4" /> Promo Discount ({order.coupon_code})
                                    </span>
                                    <span>-₹{Number(order.discount_amount).toLocaleString()}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-sm text-slate-600 font-bold">
                                <span>Shipping Facility</span>
                                <span className="text-emerald-600">FREE</span>
                            </div>
                            <div className="border-t border-gray-200/80 pt-3 flex justify-between text-lg font-black text-slate-900">
                                <span>Total Paid / Payable</span>
                                <span className="text-yellow-600">₹{Number(order.total_amount).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Customer & Shipping Information */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6">
                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-2 border-b border-gray-100 pb-4">
                            <User className="w-5 h-5 text-yellow-500" /> Customer & Shipping Address
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <div className="text-xs font-black text-slate-400 uppercase tracking-wider">Contact Info</div>
                                <div className="font-black text-slate-900 text-base">{order.customer_name}</div>
                                <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                                    <Mail className="w-4 h-4 text-slate-400" /> {order.customer_email}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                                    <Phone className="w-4 h-4 text-slate-400" /> {order.customer_phone}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="text-xs font-black text-slate-400 uppercase tracking-wider">Delivery Address</div>
                                <div className="flex items-start gap-2 text-sm text-slate-700 font-bold bg-slate-50 p-4 rounded-2xl border border-gray-100">
                                    <MapPin className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                                    <span>{order.shipping_address}</span>
                                </div>
                            </div>
                        </div>

                        {order.notes && (
                            <div className="bg-amber-50/60 border border-amber-200/60 rounded-2xl p-4 text-sm text-amber-900 font-medium">
                                <span className="font-black block text-amber-800 text-xs uppercase mb-1">Customer Notes / Instructions:</span>
                                {order.notes}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Status & Payment Facility Management */}
                <div className="space-y-8">
                    {/* Payment Facility Card */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6">
                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-2 border-b border-gray-100 pb-4">
                            <CreditCard className="w-5 h-5 text-yellow-500" /> Payment Facility
                        </h3>

                        <div className={`p-5 rounded-2xl border flex items-center gap-4 ${
                            isOnline ? 'bg-indigo-50/80 border-indigo-200/80 text-indigo-900' : 'bg-emerald-50/80 border-emerald-200/80 text-emerald-900'
                        }`}>
                            <div className={`p-3 rounded-xl ${isOnline ? 'bg-indigo-500 text-white' : 'bg-emerald-500 text-white'}`}>
                                {isOnline ? <CreditCard className="w-6 h-6" /> : <Banknote className="w-6 h-6" />}
                            </div>
                            <div>
                                <div className="text-xs font-black uppercase tracking-wider opacity-75">Selected Method</div>
                                <div className="text-lg font-black">{isOnline ? 'Online Delivery (Paid)' : 'Cash on Delivery (COD)'}</div>
                            </div>
                        </div>

                        <form onSubmit={handleSaveStatus} className="space-y-6 pt-2">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                                    Update Payment Status
                                </label>
                                <select
                                    value={paymentStatus}
                                    onChange={(e) => setPaymentStatus(e.target.value)}
                                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-black uppercase text-slate-800 focus:outline-none focus:border-yellow-500"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="paid">Paid</option>
                                    <option value="failed">Failed</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                                    Update Order Status
                                </label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-black uppercase text-slate-800 focus:outline-none focus:border-yellow-500"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3.5 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-black rounded-xl shadow-lg shadow-yellow-500/20 transition-all uppercase tracking-wider text-sm flex items-center justify-center gap-2"
                            >
                                <ShieldCheck className="w-5 h-5" /> Save Changes
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
