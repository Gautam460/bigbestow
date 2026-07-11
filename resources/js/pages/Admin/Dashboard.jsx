import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
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
    CheckCircle, 
    LogOut 
} from 'lucide-react';

export default function AdminDashboard({ products = [], categories = [], stats = {} }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    // Form for Adding / Editing product
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        category_id: categories.length > 0 ? categories[0].id : '',
        price: '',
        stock: '',
        description: '',
    });

    const openAddModal = () => {
        reset();
        if (categories.length > 0) {
            setData('category_id', categories[0].id);
        }
        setEditingProduct(null);
        setIsAddModalOpen(true);
    };

    const openEditModal = (prod) => {
        setEditingProduct(prod);
        setData({
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
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingProduct) {
            put(`/admin/products/${editingProduct.id}`, {
                onSuccess: () => closeModal(),
            });
        } else {
            post('/admin/products', {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (id, name) => {
        if (window.confirm(`Are you sure you want to delete product "${name}"?`)) {
            router.delete(`/admin/products/${id}`);
        }
    };

    const handleLogout = () => {
        router.post('/admin/logout');
    };

    const filteredProducts = products.filter((p) => 
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <Head title="Super Admin Dashboard | Bigbestow" />
                {/* Stats Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">Total Products</p>
                            <p className="text-3xl font-black text-slate-900 mt-1">{stats.totalProducts || products.length || 0}</p>
                        </div>
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                            <Package className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">Categories</p>
                            <p className="text-3xl font-black text-slate-900 mt-1">{stats.totalCategories || categories.length || 0}</p>
                        </div>
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                            <Layers className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">Total Orders</p>
                            <p className="text-3xl font-black text-slate-900 mt-1">{stats.totalOrders || 0}</p>
                        </div>
                        <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                            <ShoppingCart className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">Registered Users</p>
                            <p className="text-3xl font-black text-slate-900 mt-1">{stats.totalUsers || 0}</p>
                        </div>
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
                            <Users className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                {/* Products Management Section */}
                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
                    <div className="p-6 sm:p-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
                        <div>
                            <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">
                                Manage <span className="text-yellow-500">Products</span>
                            </h2>
                            <p className="text-slate-500 text-sm mt-0.5">Add, edit, or remove products instantly.</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input 
                                    type="text"
                                    placeholder="Search product..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/30 focus:border-yellow-500"
                                />
                            </div>
                            <button 
                                onClick={openAddModal}
                                className="shrink-0 flex items-center gap-2 px-5 py-2.5 bg-yellow-500 text-slate-950 font-bold rounded-xl hover:bg-yellow-400 transition-all shadow-md shadow-yellow-500/20"
                            >
                                <Plus className="w-5 h-5" /> Add Product
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                    <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Product Name</th>
                                    <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Category</th>
                                    <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Price</th>
                                    <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Stock</th>
                                    <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredProducts && filteredProducts.length > 0 ? (
                                    filteredProducts.map((p) => (
                                        <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                                            <td className="px-6 py-4 font-bold text-slate-900">
                                                {p.name}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600">
                                                <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg text-xs font-bold uppercase">
                                                    {p.category?.name || 'Uncategorized'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-black text-slate-900">
                                                ₹{p.price}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                                                    p.stock > 10 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                                                }`}>
                                                    {p.stock} in stock
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button 
                                                        onClick={() => openEditModal(p)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                                                        title="Edit Product"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(p.id, p.name)}
                                                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
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
                    </div>
                </div>

            {/* Modal for Adding / Editing Product */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
                            <h3 className="font-black text-lg uppercase tracking-wider">
                                {editingProduct ? 'Edit Product' : 'Add New Product'}
                            </h3>
                            <button onClick={closeModal} className="text-slate-400 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                                    Product Name
                                </label>
                                <input 
                                    type="text"
                                    required
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g. SS Master English Willow Bat"
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-yellow-500/30 focus:border-yellow-500 font-medium text-sm"
                                />
                                {errors.name && <p className="text-rose-500 text-xs font-bold mt-1">{errors.name}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                                        Price (₹)
                                    </label>
                                    <input 
                                        type="number"
                                        step="0.01"
                                        required
                                        value={data.price}
                                        onChange={(e) => setData('price', e.target.value)}
                                        placeholder="2499"
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-yellow-500/30 focus:border-yellow-500 font-medium text-sm"
                                    />
                                    {errors.price && <p className="text-rose-500 text-xs font-bold mt-1">{errors.price}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                                        Stock Quantity
                                    </label>
                                    <input 
                                        type="number"
                                        required
                                        value={data.stock}
                                        onChange={(e) => setData('stock', e.target.value)}
                                        placeholder="50"
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-yellow-500/30 focus:border-yellow-500 font-medium text-sm"
                                    />
                                    {errors.stock && <p className="text-rose-500 text-xs font-bold mt-1">{errors.stock}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                                    Category
                                </label>
                                <select
                                    required
                                    value={data.category_id}
                                    onChange={(e) => setData('category_id', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-yellow-500/30 focus:border-yellow-500 font-medium text-sm bg-white"
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.category_id && <p className="text-rose-500 text-xs font-bold mt-1">{errors.category_id}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                                    Description
                                </label>
                                <textarea
                                    rows="3"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Enter product details..."
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-yellow-500/30 focus:border-yellow-500 font-medium text-sm"
                                ></textarea>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black rounded-xl text-sm transition-all shadow-md shadow-yellow-500/20 disabled:opacity-50"
                                >
                                    {processing ? 'Saving...' : (editingProduct ? 'Update Product' : 'Create Product')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
