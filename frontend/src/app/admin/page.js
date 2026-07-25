'use client';

import React, { useState, useEffect } from 'react';
import { Head } from '@/lib/inertia-compat';
import { 
    Package, 
    ShoppingCart, 
    Users, 
    Layers, 
    Plus, 
    Edit2, 
    Trash2, 
    Search, 
    X, 
    Loader2
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function AdminDashboardPage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [processing, setProcessing] = useState(false);

    // Form data for Add/Edit
    const [formData, setFormData] = useState({
        name: '',
        category_id: '',
        price: '',
        stock: '',
        description: '',
    });
    const [errors, setErrors] = useState({});

    const fetchData = async () => {
        setLoading(true);
        try {
            const [prodRes, catRes, ordRes] = await Promise.all([
                api.get('/api/admin/products').catch(() => []),
                api.get('/api/admin/categories').catch(() => []),
                api.get('/api/admin/orders').catch(() => [])
            ]);

            const prods = Array.isArray(prodRes) ? prodRes : (prodRes?.data || []);
            const cats = Array.isArray(catRes) ? catRes : (catRes?.data || []);
            const ords = Array.isArray(ordRes) ? ordRes : (ordRes?.data || []);

            setProducts(prods);
            setCategories(cats);
            setOrders(ords);

            if (cats.length > 0 && !formData.category_id) {
                setFormData(prev => ({ ...prev, category_id: cats[0].id }));
            }
        } catch (err) {
            console.error('Error fetching admin dashboard data:', err);
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
            price: '',
            stock: '',
            description: '',
        });
        setEditingProduct(null);
        setIsAddModalOpen(true);
    };

    const openEditModal = (prod) => {
        setErrors({});
        setEditingProduct(prod);
        setFormData({
            name: prod.name || '',
            category_id: prod.category_id || (categories.length > 0 ? categories[0].id : ''),
            price: prod.price || '',
            stock: prod.stock || '',
            description: prod.description || '',
        });
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
        try {
            if (editingProduct) {
                await api.put(`/api/admin/products/${editingProduct.id}`, formData);
                toast.success('Product updated successfully.');
            } else {
                await api.post('/api/admin/products', formData);
                toast.success('Product created successfully.');
            }
            closeModal();
            fetchData();
        } catch (err) {
            if (err?.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else {
                toast.error('Failed to save product.');
            }
        } finally {
            setProcessing(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete product "${name}"?`)) {
            try {
                await api.delete(`/api/products/${id}`);
                toast.success('Product deleted.');
                fetchData();
            } catch (err) {
                toast.error('Failed to delete product.');
            }
        }
    };

    const filteredProducts = products.filter((p) => 
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 p-6 text-slate-900 dark:text-slate-100 transition-colors duration-300">
            <Head title="Super Admin Dashboard | Bigbestow" />
            
            {/* Stats Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between transition-colors duration-300">
                    <div>
                        <p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">Total Products</p>
                        <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">{products.length || 0}</p>
                    </div>
                    <div className="p-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl">
                        <Package className="w-6 h-6" />
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between transition-colors duration-300">
                    <div>
                        <p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">Categories</p>
                        <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">{categories.length || 0}</p>
                    </div>
                    <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl">
                        <Layers className="w-6 h-6" />
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between transition-colors duration-300">
                    <div>
                        <p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">Total Orders</p>
                        <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">{orders.length || 0}</p>
                    </div>
                    <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-2xl">
                        <ShoppingCart className="w-6 h-6" />
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between transition-colors duration-300">
                    <div>
                        <p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">Active System</p>
                        <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">Online</p>
                    </div>
                    <div className="p-3 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-2xl">
                        <Users className="w-6 h-6" />
                    </div>
                </div>
            </div>

            {/* Products Management Section */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-colors duration-300">
                <div className="p-6 sm:p-8 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 dark:bg-slate-800/50 transition-colors duration-300">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                            Manage <span className="text-yellow-600 dark:text-yellow-500">Products</span>
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Add, edit, or remove products instantly.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input 
                                type="text"
                                placeholder="Search product..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/30 focus:border-yellow-500 transition-colors duration-300"
                            />
                        </div>
                        <button 
                            onClick={openAddModal}
                            className="shrink-0 flex items-center gap-2 px-5 py-2.5 bg-yellow-500 text-slate-950 font-bold rounded-xl hover:bg-yellow-400 transition-all shadow-md shadow-yellow-500/20 text-sm"
                        >
                            <Plus className="w-5 h-5" /> Add Product
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-12 flex justify-center items-center">
                            <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 transition-colors duration-300">
                                    <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Product Name</th>
                                    <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Category</th>
                                    <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Price</th>
                                    <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Stock</th>
                                    <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700 transition-colors duration-300">
                                {filteredProducts && filteredProducts.length > 0 ? (
                                    filteredProducts.map((p) => (
                                        <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                            <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                                                {p.name}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                                                <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-lg text-xs font-bold uppercase transition-colors">
                                                    {p.category?.name || 'Uncategorized'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-black text-slate-900 dark:text-white">
                                                ₹{p.price}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                                                    p.stock > 10 ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                                                }`}>
                                                    {p.stock} in stock
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button 
                                                        onClick={() => openEditModal(p)}
                                                        className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-xl transition-colors"
                                                        title="Edit Product"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(p.id, p.name)}
                                                        className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                                                        title="Delete Product"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-slate-400 font-medium">
                                            No products found. Click "+ Add Product" to get started!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Modal for Adding / Editing Product */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 transition-colors duration-300">
                        <div className="p-6 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white flex items-center justify-between border-b border-slate-100 dark:border-slate-800 transition-colors duration-300">
                            <h3 className="font-black text-lg uppercase tracking-wider">
                                {editingProduct ? 'Edit Product' : 'Add New Product'}
                            </h3>
                            <button onClick={closeModal} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                                    Product Name
                                </label>
                                <input 
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. SS Master English Willow Bat"
                                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/30 focus:border-yellow-500 font-medium text-sm transition-colors"
                                />
                                {errors.name && <p className="text-rose-500 dark:text-rose-400 text-xs font-bold mt-1">{errors.name[0] || errors.name}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                                        Price (₹)
                                    </label>
                                    <input 
                                        type="number"
                                        step="0.01"
                                        required
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        placeholder="2499"
                                        className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/30 focus:border-yellow-500 font-medium text-sm transition-colors"
                                    />
                                    {errors.price && <p className="text-rose-500 dark:text-rose-400 text-xs font-bold mt-1">{errors.price[0] || errors.price}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                                        Stock Quantity
                                    </label>
                                    <input 
                                        type="number"
                                        required
                                        value={formData.stock}
                                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                        placeholder="50"
                                        className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/30 focus:border-yellow-500 font-medium text-sm transition-colors"
                                    />
                                    {errors.stock && <p className="text-rose-500 dark:text-rose-400 text-xs font-bold mt-1">{errors.stock[0] || errors.stock}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                                    Category
                                </label>
                                <select
                                    required
                                    value={formData.category_id}
                                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/30 focus:border-yellow-500 font-medium text-sm transition-colors"
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.category_id && <p className="text-rose-500 dark:text-rose-400 text-xs font-bold mt-1">{errors.category_id[0] || errors.category_id}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                                    Description
                                </label>
                                <textarea
                                    rows="3"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Enter product details..."
                                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/30 focus:border-yellow-500 font-medium text-sm transition-colors"
                                ></textarea>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700 transition-colors">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black rounded-xl text-sm transition-all shadow-md shadow-yellow-500/20 disabled:opacity-50 flex items-center gap-2"
                                >
                                    {processing && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {editingProduct ? 'Update Product' : 'Create Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
