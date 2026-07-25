'use client';

import React, { useState, useEffect } from 'react';
import { Head } from '@/lib/inertia-compat';
import { PackageSearch, Plus, Edit2, Trash2, Search, X, Loader2, Image as ImageIcon } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { getImgSrc } from '@/utils/imgSrc';

export default function AdminProductsPage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        name: '',
        category_id: '',
        subcategory_id: '',
        price: '',
        stock: '',
        images: ['https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=800'],
        description: '',
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [prodRes, catRes, subRes] = await Promise.all([
                api.get('/api/admin/products').catch(() => []),
                api.get('/api/admin/categories').catch(() => []),
                api.get('/api/admin/subcategories').catch(() => [])
            ]);
            const prods = Array.isArray(prodRes) ? prodRes : (prodRes?.data || prodRes?.products || []);
            const cats = Array.isArray(catRes) ? catRes : (catRes?.data || []);
            const subs = Array.isArray(subRes) ? subRes : (subRes?.data || []);
            setProducts(prods);
            setCategories(cats);
            setSubcategories(subs);
            if (cats.length > 0 && !formData.category_id) {
                setFormData(prev => ({ ...prev, category_id: cats[0].id }));
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const openAddModal = () => {
        setErrors({});
        setFormData({
            name: '',
            category_id: categories.length > 0 ? categories[0].id : '',
            subcategory_id: '',
            price: '',
            stock: '',
            images: ['https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=800'],
            description: '',
        });
        setEditingProduct(null);
        setIsAddModalOpen(true);
    };

    const openEditModal = (p) => {
        setErrors({});
        setFormData({
            name: p.name || '',
            category_id: p.category_id || (categories.length > 0 ? categories[0].id : ''),
            subcategory_id: p.subcategory_id || '',
            price: p.price || '',
            stock: p.stock || '',
            images: p.gallery?.length ? p.gallery : (p.image ? [p.image] : ['https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=800']),
            description: p.description || '',
        });
        setEditingProduct(p);
        setIsAddModalOpen(true);
    };

    const closeModal = () => {
        setIsAddModalOpen(false);
        setEditingProduct(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});
        
        const payload = new FormData();
        payload.append('name', formData.name);
        payload.append('category_id', formData.category_id);
        if (formData.subcategory_id) {
            payload.append('subcategory_id', formData.subcategory_id);
        }
        payload.append('price', formData.price);
        payload.append('stock', formData.stock);
        if (formData.description) {
            payload.append('description', formData.description);
        }
        
        const existing = formData.images.filter(img => typeof img === 'string');
        const newFiles = formData.images.filter(img => img instanceof File);

        existing.forEach((img) => payload.append(`existing_images[]`, img));
        newFiles.forEach((file) => payload.append(`images[]`, file));

        try {
            const token = localStorage.getItem('auth_token');

            if (editingProduct) {
                payload.append('_method', 'PUT');
                const res = await fetch(`/api/admin/products/${editingProduct.id}`, {
                    method: 'POST',
                    headers: token ? { 
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json'
                    } : { Accept: 'application/json' },
                    body: payload,
                });
                if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.message || 'Update failed'); }
                toast.success('Product updated successfully.');
            } else {
                const res = await fetch(`/api/admin/products`, {
                    method: 'POST',
                    headers: token ? { 
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json'
                    } : { Accept: 'application/json' },
                    body: payload,
                });
                if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.message || 'Create failed'); }
                toast.success('Product created successfully.');
            }
            closeModal();
            fetchData();
        } catch (err) {
            if (err?.response?.data?.errors) setErrors(err.response.data.errors);
            else toast.error(err?.message || 'Failed to save product.');
        } finally {
            setProcessing(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
            try {
                await api.delete(`/api/admin/products/${id}`);
                toast.success('Product deleted.');
                fetchData();
            } catch (err) {
                toast.error('Failed to delete product.');
            }
        }
    };

    const filtered = products.filter(p => p.name?.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="space-y-8 p-6 text-slate-900 dark:text-slate-100">
            <Head title="Manage Products | Admin Portal" />
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="p-6 sm:p-8 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800/50">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                            <PackageSearch className="text-yellow-500 w-6 h-6" /> Products <span className="text-yellow-500">Catalog</span>
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Manage stock, prices, images, and product listings.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-slate-400" />
                            <input 
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/30"
                            />
                        </div>
                        <button onClick={openAddModal} className="shrink-0 flex items-center gap-2 px-5 py-2.5 bg-yellow-500 text-slate-950 font-bold rounded-xl hover:bg-yellow-400 text-sm">
                            <Plus className="w-5 h-5" /> Add Product
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-yellow-500" /></div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                                    <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Image</th>
                                    <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Name</th>
                                    <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Category</th>
                                    <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Price</th>
                                    <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Stock</th>
                                    <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {filtered.length > 0 ? filtered.map(p => (
                                    <tr key={p.id} className="hover:bg-slate-100 dark:hover:bg-slate-700/50">
                                        <td className="px-6 py-4">
                                            <img 
                                                src={getImgSrc(p.image_url || p.image, 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=800')} 
                                                alt={p.name} 
                                                className="w-14 h-14 object-cover rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 shrink-0 shadow-sm"
                                                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=800'; }}
                                            />
                                        </td>
                                        <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{p.name}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                                            <div className="flex flex-col gap-1">
                                                <span className="bg-slate-100 dark:bg-slate-700 px-2.5 py-1 rounded-lg text-xs font-bold uppercase w-fit">{p.category?.name || 'General'}</span>
                                                {p.subcategory && (
                                                    <span className="text-[10px] text-yellow-400 font-medium pl-1">↳ {p.subcategory.name}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-black text-slate-900 dark:text-white">₹{p.price}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${p.stock > 10 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                                {p.stock} units
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => openEditModal(p)} className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-xl" title="Edit"><Edit2 className="w-4 h-4" /></button>
                                                <button onClick={() => handleDelete(p.id, p.name)} className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-xl" title="Delete"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="6" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">No products found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-lg my-8 overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white flex items-center justify-between border-b border-slate-200 dark:border-slate-700">
                            <h3 className="font-black text-lg uppercase tracking-wider flex items-center gap-2">
                                <ImageIcon className="w-5 h-5 text-yellow-500" />
                                {editingProduct ? 'Edit Product' : 'Add New Product'}
                            </h3>
                            <button onClick={closeModal} className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white"><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                            <div>
                                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Product Name</label>
                                <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-sm" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Price (₹)</label>
                                    <input type="number" step="0.01" required value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Stock</label>
                                    <input type="number" required value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-sm" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Category</label>
                                    <select required value={formData.category_id} onChange={(e) => setFormData({ ...formData, category_id: e.target.value, subcategory_id: '' })} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-sm">
                                        <option value="">Select Category</option>
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Subcategory</label>
                                    <select value={formData.subcategory_id || ''} onChange={(e) => setFormData({ ...formData, subcategory_id: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-sm">
                                        <option value="">None / Optional</option>
                                        {subcategories.filter(s => !formData.category_id || String(s.category_id) === String(formData.category_id)).map(s => (
                                            <option key={s.id} value={s.id}>{s.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Product Images</label>
                                <div className="flex flex-col gap-3">
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        multiple
                                        onChange={(e) => {
                                            if (e.target.files) {
                                                const newFiles = Array.from(e.target.files);
                                                setFormData({ ...formData, images: [...formData.images, ...newFiles] });
                                                e.target.value = '';
                                            }
                                        }}
                                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100" 
                                    />
                                    {formData.images.length > 0 && (
                                        <div className="flex gap-2 overflow-x-auto pb-2">
                                            {formData.images.map((img, idx) => (
                                                <div key={idx} className="relative group shrink-0">
                                                    <img 
                                                        src={img instanceof File ? URL.createObjectURL(img) : getImgSrc(img, 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=800')} 
                                                        alt="Preview" 
                                                        className="w-16 h-16 object-cover rounded-xl border border-yellow-500/50 bg-slate-50 dark:bg-slate-900 shadow" 
                                                        onError={(e) => { e.target.style.display = 'none'; }}
                                                    />
                                                    <button type="button" onClick={() => setFormData({...formData, images: formData.images.filter((_, i) => i !== idx)})} className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
                                    <button type="button" onClick={() => setFormData({...formData, images: [...formData.images, 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=800']})} className="text-[11px] bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-lg shrink-0 font-medium">🏏 Bat Image</button>
                                    <button type="button" onClick={() => setFormData({...formData, images: [...formData.images, 'https://images.unsplash.com/photo-1593341646782-e0b495cff86d?auto=format&fit=crop&q=80&w=800']})} className="text-[11px] bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-lg shrink-0 font-medium">🧤 Gloves Image</button>
                                    <button type="button" onClick={() => setFormData({...formData, images: [...formData.images, 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800']})} className="text-[11px] bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-lg shrink-0 font-medium">🔴 Ball Image</button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Description</label>
                                <textarea rows="3" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-sm"></textarea>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                                <button type="button" onClick={closeModal} className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-sm">Cancel</button>
                                <button type="submit" disabled={processing} className="px-6 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-yellow-500/20">
                                    {processing && <Loader2 className="w-4 h-4 animate-spin" />}
                                    Save Product
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
