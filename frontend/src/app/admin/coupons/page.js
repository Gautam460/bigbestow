'use client';

import React, { useState, useEffect } from 'react';
import { Head } from '@/lib/inertia-compat';
import { Gift, Plus, Edit2, Trash2, Search, X, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function AdminCouponsPage() {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        discount_type: 'percent',
        discount_value: '',
        min_order_amount: '',
        max_uses: '',
    });

    const fetchCoupons = async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/admin/coupons').catch(() => ([]));
            setCoupons(Array.isArray(res) ? res : (res?.data || []));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const openAddModal = () => {
        setFormData({ code: '', discount_type: 'percent', discount_value: '', min_order_amount: '', max_uses: '' });
        setEditingCoupon(null);
        setIsModalOpen(true);
    };

    const openEditModal = (c) => {
        setEditingCoupon(c);
        setFormData({
            code: c.code || '',
            discount_type: c.discount_type || 'percent',
            discount_value: c.discount_value || '',
            min_order_amount: c.min_order_amount || '',
            max_uses: c.max_uses || '',
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        try {
            if (editingCoupon) {
                await api.put(`/api/admin/coupons/${editingCoupon.id}`, formData);
                toast.success('Coupon updated successfully.');
            } else {
                await api.post('/api/admin/coupons', formData);
                toast.success('Coupon added successfully.');
            }
            setIsModalOpen(false);
            fetchCoupons();
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Failed to save coupon.');
        } finally {
            setProcessing(false);
        }
    };

    const handleDelete = async (id, code) => {
        if (window.confirm(`Delete coupon code "${code}"?`)) {
            try {
                await api.delete(`/api/admin/coupons/${id}`);
                toast.success('Coupon deleted.');
                fetchCoupons();
            } catch (err) {
                toast.error('Failed to delete coupon.');
            }
        }
    };

    const filtered = coupons.filter(c => c.code?.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="space-y-8 p-6 text-slate-900 dark:text-slate-100">
            <Head title="Coupons & Deals | Admin Portal" />
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="p-6 sm:p-8 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800/50">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                            <Gift className="text-pink-400 w-6 h-6" /> Coupons & <span className="text-pink-400">Deals</span>
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Create discount codes and special promotional offers.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-slate-400" />
                            <input 
                                type="text"
                                placeholder="Search promo codes..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500/30"
                            />
                        </div>
                        <button onClick={openAddModal} className="shrink-0 flex items-center gap-2 px-5 py-2.5 bg-pink-500 text-slate-950 font-bold rounded-xl hover:bg-pink-400 text-sm">
                            <Plus className="w-5 h-5" /> Add Coupon
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-pink-400" /></div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                                    <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Promo Code</th>
                                    <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Discount</th>
                                    <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Min Order</th>
                                    <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {filtered.length > 0 ? filtered.map(c => (
                                    <tr key={c.id} className="hover:bg-slate-100 dark:hover:bg-slate-700/50">
                                        <td className="px-6 py-4 font-black text-pink-400 tracking-wide">{c.code}</td>
                                        <td className="px-6 py-4 font-extrabold text-slate-900 dark:text-white">
                                            {c.discount_type === 'percent' ? `${c.discount_value}% OFF` : `₹${c.discount_value} OFF`}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">₹{c.min_order_amount || 0}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => openEditModal(c)} className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-xl"><Edit2 className="w-4 h-4" /></button>
                                                <button onClick={() => handleDelete(c.id, c.code)} className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-xl"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="4" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">No promo codes found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white flex items-center justify-between">
                            <h3 className="font-black text-lg uppercase tracking-wider">{editingCoupon ? 'Edit Promo Code' : 'Create Promo Code'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white"><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Coupon Code</label>
                                <input type="text" required uppercase="true" value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})} placeholder="e.g. SUMMER20" className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-sm" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Discount Type</label>
                                    <select value={formData.discount_type} onChange={(e) => setFormData({...formData, discount_type: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-sm focus:outline-none">
                                        <option value="percent">Percentage (%)</option>
                                        <option value="fixed">Fixed Amount (₹)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Discount Value</label>
                                    <input type="number" required value={formData.discount_value} onChange={(e) => setFormData({...formData, discount_value: e.target.value})} placeholder="20" className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-sm" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Minimum Order Amount (₹)</label>
                                <input type="number" value={formData.min_order_amount} onChange={(e) => setFormData({...formData, min_order_amount: e.target.value})} placeholder="500" className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-sm" />
                            </div>
                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-sm">Cancel</button>
                                <button type="submit" disabled={processing} className="px-6 py-2.5 bg-pink-500 hover:bg-pink-400 text-slate-950 font-black rounded-xl text-sm flex items-center gap-2">
                                    {processing && <Loader2 className="w-4 h-4 animate-spin" />}
                                    Save Coupon
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
