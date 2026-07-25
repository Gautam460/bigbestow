'use client';

import React, { useState, useEffect } from 'react';
import { Head } from '@/lib/inertia-compat';
import { Layers, Plus, Edit2, Trash2, Search, X, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function AdminSubcategoriesPage() {
    const [subcategories, setSubcategories] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSubcategory, setEditingSubcategory] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [name, setName] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [image, setImage] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [subRes, catRes] = await Promise.all([
                api.get('/api/admin/subcategories').catch(() => []),
                api.get('/api/admin/categories').catch(() => [])
            ]);
            setSubcategories(Array.isArray(subRes) ? subRes : (subRes?.data || []));
            const cats = Array.isArray(catRes) ? catRes : (catRes?.data || []);
            setCategories(cats);
            if (cats.length > 0 && !categoryId) {
                setCategoryId(cats[0].id);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const openAddModal = () => {
        setName('');
        if (categories.length > 0) {
            setCategoryId(categories[0].id);
        } else {
            setCategoryId('');
        }
        setImage(null);
        setEditingSubcategory(null);
        setIsModalOpen(true);
    };

    const openEditModal = (sub) => {
        setEditingSubcategory(sub);
        setName(sub.name || '');
        setCategoryId(sub.category_id || (categories[0]?.id || ''));
        setImage(null);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('category_id', categoryId);
            if (image) {
                formData.append('image', image);
            }

            if (editingSubcategory) {
                formData.append('_method', 'PUT');
                await api.post(`/api/admin/subcategories/${editingSubcategory.id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success('Subcategory updated.');
            } else {
                await api.post('/api/admin/subcategories', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success('Subcategory added.');
            }
            setIsModalOpen(false);
            fetchData();
        } catch (err) {
            const msg = err?.response?.data?.message || 'Failed to save subcategory.';
            toast.error(msg);
        } finally {
            setProcessing(false);
        }
    };

    const handleDelete = async (id, subName) => {
        if (window.confirm(`Are you sure you want to delete subcategory "${subName}"?`)) {
            try {
                await api.delete(`/api/admin/subcategories/${id}`);
                toast.success('Subcategory deleted.');
                fetchData();
            } catch (err) {
                toast.error('Failed to delete subcategory.');
            }
        }
    };

    const filtered = subcategories.filter(s => 
        s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 p-6 text-slate-900 dark:text-slate-100">
            <Head title="Manage Subcategories | Admin Portal" />
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="p-6 sm:p-8 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800/50">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                            <Layers className="text-amber-400 w-6 h-6" /> Product <span className="text-amber-400">Subcategories</span>
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Manage subcategories and map them to primary categories.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-slate-400" />
                            <input 
                                type="text"
                                placeholder="Search subcategories..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                            />
                        </div>
                        <button onClick={openAddModal} className="shrink-0 flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-slate-950 font-bold rounded-xl hover:bg-amber-400 text-sm">
                            <Plus className="w-5 h-5" /> Add Subcategory
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-amber-400" /></div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                                    <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 w-16">Image</th>
                                    <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Subcategory Name</th>
                                    <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Parent Category</th>
                                    <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {filtered.length > 0 ? filtered.map(s => (
                                    <tr key={s.id} className="hover:bg-slate-100 dark:hover:bg-slate-700/50">
                                        <td className="px-6 py-4">
                                            {s.image ? (
                                                <img src={s.image} alt={s.name} className="w-10 h-10 rounded-lg object-cover bg-slate-200 dark:bg-slate-700" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 text-slate-400">
                                                    <Layers className="w-4 h-4" />
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{s.name}</td>
                                        <td className="px-6 py-4 text-sm text-amber-300 font-semibold">{s.category?.name || 'Unassigned'}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => openEditModal(s)} className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-xl"><Edit2 className="w-4 h-4" /></button>
                                                <button onClick={() => handleDelete(s.id, s.name)} className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-xl"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="3" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">No subcategories found.</td></tr>
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
                            <h3 className="font-black text-lg uppercase tracking-wider">{editingSubcategory ? 'Edit Subcategory' : 'Add New Subcategory'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white"><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Parent Category</label>
                                <select 
                                    required 
                                    value={categoryId} 
                                    onChange={(e) => setCategoryId(e.target.value)} 
                                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                                >
                                    <option value="">-- Select Category --</option>
                                    {categories.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Subcategory Name</label>
                                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Men's Shoes" className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30" />
                            </div>
                            <div>
                                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Subcategory Image</label>
                                <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-amber-50 dark:file:bg-amber-500/10 file:text-amber-600 dark:file:text-amber-400 hover:file:bg-amber-100 dark:hover:file:bg-amber-500/20" />
                                {editingSubcategory?.image && (
                                    <div className="mt-2 text-xs text-slate-500 flex items-center gap-2">
                                        <img src={editingSubcategory.image} alt="Current" className="w-8 h-8 rounded object-cover" />
                                        Current Image
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-sm">Cancel</button>
                                <button type="submit" disabled={processing} className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-sm flex items-center gap-2">
                                    {processing && <Loader2 className="w-4 h-4 animate-spin" />}
                                    Save Subcategory
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
