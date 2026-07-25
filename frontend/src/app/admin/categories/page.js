'use client';

import React, { useState, useEffect } from 'react';
import { Head } from '@/lib/inertia-compat';
import { Tags, Plus, Edit2, Trash2, Search, X, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [existingImage, setExistingImage] = useState(null);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/admin/categories').catch(() => []);
            setCategories(Array.isArray(res) ? res : (res?.data || []));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const openAddModal = () => {
        setName('');
        setDescription('');
        setImage(null);
        setExistingImage(null);
        setEditingCategory(null);
        setIsModalOpen(true);
    };

    const openEditModal = (cat) => {
        setEditingCategory(cat);
        setName(cat.name || '');
        setDescription(cat.description || '');
        setImage(null);
        setExistingImage(cat.image || null);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        try {
            const formData = new FormData();
            formData.append('name', name);
            if (description) formData.append('description', description);
            if (image) formData.append('image', image);

            const config = { headers: { 'Content-Type': 'multipart/form-data', 'Accept': 'application/json' } };

            if (editingCategory) {
                formData.append('_method', 'PUT');
                await api.post(`/api/admin/categories/${editingCategory.id}`, formData, config);
                toast.success('Category updated.');
            } else {
                await api.post('/api/admin/categories', formData, config);
                toast.success('Category added.');
            }
            setIsModalOpen(false);
            fetchCategories();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save category.');
        } finally {
            setProcessing(false);
        }
    };

    const handleDelete = async (id, catName) => {
        if (window.confirm(`Are you sure you want to delete category "${catName}"?`)) {
            try {
                await api.delete(`/api/admin/categories/${id}`);
                toast.success('Category deleted.');
                fetchCategories();
            } catch (err) {
                toast.error('Failed to delete category.');
            }
        }
    };

    const filtered = categories.filter(c => c.name?.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="space-y-8 p-6 text-slate-900 dark:text-slate-100">
            <Head title="Manage Categories | Admin Portal" />
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="p-6 sm:p-8 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800/50">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                            <Tags className="text-emerald-400 w-6 h-6" /> Product <span className="text-emerald-400">Categories</span>
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Organize your store hierarchy and navigation.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-slate-400" />
                            <input 
                                type="text"
                                placeholder="Search categories..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                            />
                        </div>
                        <button onClick={openAddModal} className="shrink-0 flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-slate-950 font-bold rounded-xl hover:bg-emerald-400 text-sm">
                            <Plus className="w-5 h-5" /> Add Category
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-emerald-400" /></div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                                    <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 w-16">Image</th>
                                    <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Category Name</th>
                                    <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Description</th>
                                    <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {filtered.length > 0 ? filtered.map(c => (
                                    <tr key={c.id} className="hover:bg-slate-100 dark:hover:bg-slate-700/50">
                                        <td className="px-6 py-4">
                                            {c.image ? <img src={`http://127.0.0.1:8000${c.image}`} alt={c.name} className="w-10 h-10 rounded-lg object-cover bg-slate-200" /> : <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] text-slate-400 font-bold">N/A</div>}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{c.name}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{c.description || 'No description provided.'}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => openEditModal(c)} className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-xl"><Edit2 className="w-4 h-4" /></button>
                                                <button onClick={() => handleDelete(c.id, c.name)} className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-xl"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="3" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">No categories found.</td></tr>
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
                            <h3 className="font-black text-lg uppercase tracking-wider">{editingCategory ? 'Edit Category' : 'Add New Category'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white"><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Category Name</label>
                                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Description</label>
                                <textarea rows="3" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-sm"></textarea>
                            </div>
                            <div>
                                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Category Image</label>
                                <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-sm" />
                                {existingImage && !image && (
                                    <div className="mt-3 flex items-center gap-3">
                                        <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">Current Image:</span>
                                        <img src={`http://127.0.0.1:8000${existingImage}`} alt="Current" className="h-12 w-12 rounded-lg object-cover bg-white" />
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-sm">Cancel</button>
                                <button type="submit" disabled={processing} className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-sm flex items-center gap-2">
                                    {processing && <Loader2 className="w-4 h-4 animate-spin" />}
                                    Save Category
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
