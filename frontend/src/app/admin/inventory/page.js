'use client';

import React, { useState, useEffect } from 'react';
import { Head } from '@/lib/inertia-compat';
import { Boxes, Search, AlertTriangle, Edit2, Check, X, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function AdminInventoryPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [newStock, setNewStock] = useState('');
    const [processing, setProcessing] = useState(false);

    const fetchInventory = async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/admin/inventory').catch(() => []);
            setProducts(Array.isArray(res) ? res : (res?.data || []));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    const startEditing = (prod) => {
        setEditingId(prod.id);
        setNewStock(prod.stock || 0);
    };

    const saveStock = async (prodId) => {
        setProcessing(true);
        try {
            await api.put(`/api/admin/inventory/${prodId}`, { stock: parseInt(newStock, 10) || 0 });
            toast.success('Stock updated successfully.');
            setEditingId(null);
            fetchInventory();
        } catch (err) {
            toast.error('Failed to update stock level.');
        } finally {
            setProcessing(false);
        }
    };

    const filtered = products.filter(p => 
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 p-6 text-slate-900 dark:text-slate-100">
            <Head title="Inventory & Stock Management | Admin Portal" />
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="p-6 sm:p-8 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800/50">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                            <Boxes className="text-cyan-400 w-6 h-6" /> Inventory & <span className="text-cyan-400">Stock Levels</span>
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Monitor stock counts and quickly update quantities across all products.</p>
                    </div>
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-slate-400" />
                        <input 
                            type="text"
                            placeholder="Search product or category..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-cyan-400" /></div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                                    <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Product Name</th>
                                    <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Category</th>
                                    <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</th>
                                    <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Current Stock</th>
                                    <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">Adjust Stock</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {filtered.length > 0 ? filtered.map(p => {
                                    const stock = p.stock || 0;
                                    const isLow = stock <= 5;
                                    const isOut = stock === 0;

                                    return (
                                        <tr key={p.id} className="hover:bg-slate-100 dark:hover:bg-slate-700/50">
                                            <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{p.name}</td>
                                            <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{p.category?.name || 'Unassigned'}</td>
                                            <td className="px-6 py-4">
                                                {isOut ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-black bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                                        Out of Stock
                                                    </span>
                                                ) : isLow ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-black bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                                        <AlertTriangle className="w-3.5 h-3.5" /> Low Stock ({stock})
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                        In Stock
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 font-extrabold text-slate-900 dark:text-white text-base">
                                                {editingId === p.id ? (
                                                    <input 
                                                        type="number" 
                                                        value={newStock} 
                                                        onChange={(e) => setNewStock(e.target.value)} 
                                                        className="w-24 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-cyan-500 text-slate-900 dark:text-white font-bold text-sm focus:outline-none"
                                                        min="0"
                                                    />
                                                ) : (
                                                    <span>{stock} units</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {editingId === p.id ? (
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button onClick={() => saveStock(p.id)} disabled={processing} className="p-2 text-emerald-400 hover:bg-emerald-500/10 rounded-xl" title="Save">
                                                            <Check className="w-5 h-5" />
                                                        </button>
                                                        <button onClick={() => setEditingId(null)} className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-500/10 rounded-xl" title="Cancel">
                                                            <X className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button onClick={() => startEditing(p)} className="px-4 py-2 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:bg-slate-700 text-cyan-400 font-bold rounded-xl text-xs flex items-center gap-1.5 ml-auto border border-slate-200 dark:border-slate-700">
                                                        <Edit2 className="w-3.5 h-3.5" /> Quick Adjust
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                }) : (
                                    <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">No products found for inventory management.</td></tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
