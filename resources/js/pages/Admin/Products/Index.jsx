import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Edit2, Trash2, Search, Package } from 'lucide-react';

export default function Index({ products }) {
    const [searchTerm, setSearchTerm] = useState('');

    const deleteProduct = (id) => {
        if (confirm('Are you sure you want to delete this product?')) {
            router.delete(`/admin/products/${id}`);
        }
    };

    return (
        <div className="p-6">
            <Head title="Manage Products" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tight">Products <span className="text-yellow-500">Inventory</span></h2>
                    <p className="text-slate-500 text-sm">Manage your premium cricket gear and stock levels.</p>
                </div>
                <Link 
                    href="/admin/products/create" 
                    className="inline-flex items-center px-6 py-3 bg-yellow-500 text-slate-900 font-bold rounded-xl hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-500/20"
                >
                    <Plus className="w-5 h-5 mr-2" /> Add Product
                </Link>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search products..." 
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Product</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Price</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Stock</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {products && products.length > 0 ? products.map((product) => (
                                <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-xl shadow-inner">🏏</div>
                                            <div className="font-bold text-slate-900 group-hover:text-yellow-600 transition-colors">{product.name}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                                        <span className="px-2 py-1 bg-slate-50 rounded-md border border-slate-100">{product.category?.name || 'N/A'}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-black text-slate-900">
                                        ${product.price}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-[10px] font-black px-2 py-1 rounded-full ${product.stock > 10 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                                            {product.stock} IN STOCK
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <Link 
                                                href={`/admin/products/${product.id}/edit`}
                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </Link>
                                            <button 
                                                onClick={() => deleteProduct(product.id)}
                                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-slate-400 font-medium italic">
                                        No products found in warehouse.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
