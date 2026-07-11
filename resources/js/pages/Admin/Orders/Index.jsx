import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Search, Eye, Trash2, Package, Truck, CheckCircle2, Clock, XCircle, CreditCard, Banknote, Filter, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function Index({ orders = { data: [], links: [] }, filters = {} }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [paymentFilter, setPaymentFilter] = useState(filters.payment_method || 'all');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/orders', {
            search: searchTerm,
            status: statusFilter !== 'all' ? statusFilter : undefined,
            payment_method: paymentFilter !== 'all' ? paymentFilter : undefined,
        }, { preserveState: true });
    };

    const handleFilterChange = (type, value) => {
        if (type === 'status') {
            setStatusFilter(value);
            router.get('/admin/orders', {
                search: searchTerm || undefined,
                status: value !== 'all' ? value : undefined,
                payment_method: paymentFilter !== 'all' ? paymentFilter : undefined,
            }, { preserveState: true });
        } else if (type === 'payment') {
            setPaymentFilter(value);
            router.get('/admin/orders', {
                search: searchTerm || undefined,
                status: statusFilter !== 'all' ? statusFilter : undefined,
                payment_method: value !== 'all' ? value : undefined,
            }, { preserveState: true });
        }
    };

    const handleStatusUpdate = (orderId, newStatus) => {
        router.put(`/admin/orders/${orderId}`, { status: newStatus }, {
            preserveScroll: true,
            onSuccess: () => toast.success(`Order #ORD-${orderId} status updated to ${newStatus.toUpperCase()}`),
            onError: () => toast.error('Failed to update status'),
        });
    };

    const handleDelete = (orderId) => {
        if (confirm(`Are you sure you want to delete Order #ORD-${orderId}? This action cannot be undone.`)) {
            router.delete(`/admin/orders/${orderId}`, {
                onSuccess: () => toast.success('Order deleted successfully'),
            });
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
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
                return <span className="px-3 py-1 bg-gray-50 text-gray-700 border border-gray-200 rounded-full text-xs font-black uppercase">{status}</span>;
        }
    };

    const getPaymentBadge = (method, status) => {
        const isOnline = method === 'online';
        return (
            <div className="flex flex-col gap-1">
                <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-black uppercase tracking-wider flex items-center gap-1 w-fit ${
                    isOnline ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}>
                    {isOnline ? <CreditCard className="w-3 h-3" /> : <Banknote className="w-3 h-3" />}
                    {isOnline ? 'Online Delivery' : 'Cash on Delivery'}
                </span>
                <span className={`text-[10px] font-bold uppercase tracking-wider pl-1 ${
                    status === 'paid' ? 'text-emerald-600' : status === 'failed' ? 'text-rose-600' : 'text-amber-600'
                }`}>
                    Status: {status}
                </span>
            </div>
        );
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <Head title="Manage Orders - Admin" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tight">Customer <span className="text-yellow-500">Orders</span></h2>
                    <p className="text-slate-500 text-sm">Track shipments, manage Cash on Delivery (COD) and Online Payments.</p>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                <form onSubmit={handleSearch} className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Search Order ID, Name, Phone, Email..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-gray-200 rounded-2xl text-sm font-bold focus:outline-none focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 transition-all"
                    />
                </form>

                <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                    {/* Status Filter */}
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-slate-400" />
                        <select 
                            value={statusFilter}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            className="bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-black uppercase text-slate-700 focus:outline-none focus:border-yellow-500 cursor-pointer"
                        >
                            <option value="all">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>

                    {/* Payment Method Filter */}
                    <select 
                        value={paymentFilter}
                        onChange={(e) => handleFilterChange('payment', e.target.value)}
                        className="bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-black uppercase text-slate-700 focus:outline-none focus:border-yellow-500 cursor-pointer"
                    >
                        <option value="all">All Payment Methods</option>
                        <option value="cod">Cash on Delivery (COD)</option>
                        <option value="online">Online Delivery</option>
                    </select>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                {orders.data && orders.data.length === 0 ? (
                    <div className="p-16 text-center">
                        <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4 font-black">
                            <Package className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-black text-slate-900">No Orders Found</h3>
                        <p className="text-slate-500 text-sm mt-1">There are currently no orders matching your selected filters.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/70 border-b border-gray-100">
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order ID & Date</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer Details</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Items</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Payment Facility</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Amount</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order Status</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {orders.data && orders.data.map((order) => (
                                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 font-medium">
                                            <span className="font-black text-slate-900 block text-base">#ORD-{order.id}</span>
                                            <span className="text-xs text-slate-400 font-bold block mt-0.5">
                                                {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="font-black text-slate-900">{order.customer_name}</div>
                                            <div className="text-xs text-slate-500 font-semibold mt-0.5">{order.customer_phone}</div>
                                            <div className="text-[11px] text-slate-400 truncate max-w-[180px]">{order.customer_email}</div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="font-black text-slate-800">
                                                {order.items && order.items.length > 0 ? (
                                                    <>
                                                        <span>{order.items[0].product_name}</span>
                                                        {order.items.length > 1 && (
                                                            <span className="text-xs text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-md ml-1 font-bold block mt-1 w-fit">
                                                                + {order.items.length - 1} more item(s)
                                                            </span>
                                                        )}
                                                    </>
                                                ) : (
                                                    <span className="text-slate-400">No items</span>
                                                )}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            {getPaymentBadge(order.payment_method, order.payment_status)}
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="font-black text-slate-900 text-base">₹{Number(order.total_amount).toLocaleString()}</div>
                                            {order.coupon_code && (
                                                <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded mt-0.5 w-fit">
                                                    Promo: {order.coupon_code} (-₹{order.discount_amount})
                                                </div>
                                            )}
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-2">
                                                {getStatusBadge(order.status)}
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                                    className="bg-white border border-gray-200 rounded-lg text-[11px] font-bold px-2 py-1 text-slate-700 focus:border-yellow-500 cursor-pointer shadow-sm w-fit"
                                                >
                                                    <option value="pending">Mark Pending</option>
                                                    <option value="processing">Mark Processing</option>
                                                    <option value="shipped">Mark Shipped</option>
                                                    <option value="delivered">Mark Delivered</option>
                                                    <option value="cancelled">Mark Cancelled</option>
                                                </select>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <Link
                                                    href={`/admin/orders/${order.id}`}
                                                    className="p-2 bg-slate-100 hover:bg-yellow-500 hover:text-slate-900 text-slate-600 rounded-xl transition-all shadow-sm"
                                                    title="View Full Order Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(order.id)}
                                                    className="p-2 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white rounded-xl transition-all shadow-sm"
                                                    title="Delete Order"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {orders.links && orders.links.length > 3 && (
                    <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-slate-50/50">
                        <div className="text-xs text-slate-500 font-bold">
                            Showing page <span className="text-slate-900">{orders.current_page}</span> of <span className="text-slate-900">{orders.last_page}</span>
                        </div>
                        <div className="flex gap-1">
                            {orders.links.map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.url || '#'}
                                    disabled={!link.url}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                        link.active 
                                            ? 'bg-yellow-500 text-slate-900 shadow-sm' 
                                            : link.url 
                                                ? 'bg-white border border-gray-200 text-slate-700 hover:bg-slate-100' 
                                                : 'text-slate-300 pointer-events-none'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
