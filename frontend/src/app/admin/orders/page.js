'use client';

import React, { useState, useEffect } from 'react';
import { Head } from '@/lib/inertia-compat';
import { ShoppingCart, Search, Eye, CheckCircle2, Clock, AlertCircle, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [updatingId, setUpdatingId] = useState(null);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/admin/orders').catch(() => ([]));
            setOrders(Array.isArray(res) ? res : (res?.data || []));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const updateStatus = async (id, newStatus) => {
        setUpdatingId(id);
        try {
            await api.put(`/api/admin/orders/${id}`, { status: newStatus });
            toast.success(`Order status changed to ${newStatus}.`);
            fetchOrders();
        } catch (err) {
            toast.error('Failed to update order status.');
        } finally {
            setUpdatingId(null);
        }
    };

    const filtered = orders.filter(o => {
        const matchSearch = String(o.id).includes(searchTerm) ||
            o.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            o.customer_email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = statusFilter === 'all' || o.status === statusFilter;
        return matchSearch && matchStatus;
    });

    return (
        <div className="space-y-8 p-6 text-slate-900 dark:text-slate-100">
            <Head title="Orders Management | Admin Portal" />
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="p-6 sm:p-8 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800/50">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                            <ShoppingCart className="text-indigo-400 w-6 h-6" /> Customer <span className="text-indigo-400">Orders</span>
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Track and update fulfillment status for all incoming store orders.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <select 
                            value={statusFilter} 
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white font-medium focus:outline-none"
                        >
                            <option value="all">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-slate-400" />
                            <input 
                                type="text"
                                placeholder="Search order ID or customer..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                            />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-400" /></div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                                    <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Order ID</th>
                                    <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Customer</th>
                                    <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Amount</th>
                                    <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</th>
                                    <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">Update Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {filtered.length > 0 ? filtered.map(o => (
                                    <tr key={o.id} className="hover:bg-slate-100 dark:hover:bg-slate-700/50">
                                        <td className="px-6 py-4 font-black text-indigo-400">#{o.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-900 dark:text-white">{o.customer_name || o.user?.name || 'Guest Customer'}</div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400">{o.customer_email || o.user?.email || 'N/A'}</div>
                                        </td>
                                        <td className="px-6 py-4 font-extrabold text-slate-900 dark:text-white">₹{parseFloat(o.total_amount || o.total || 0).toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider border ${
                                                o.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                o.status === 'cancelled' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                                                'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                                            }`}>
                                                {o.status || 'pending'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <select 
                                                disabled={updatingId === o.id}
                                                value={o.status || 'pending'}
                                                onChange={(e) => updateStatus(o.id, e.target.value)}
                                                className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-200 focus:outline-none focus:border-indigo-500"
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="processing">Processing</option>
                                                <option value="shipped">Shipped</option>
                                                <option value="delivered">Delivered</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">No orders matching your criteria.</td></tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
