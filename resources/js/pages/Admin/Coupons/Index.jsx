import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Edit2, Trash2, Search, Tag, Calendar, CheckCircle2, XCircle } from 'lucide-react';

export default function Index({ coupons = [] }) {
    const [searchTerm, setSearchTerm] = useState('');

    const deleteCoupon = (id) => {
        if (confirm('Are you sure you want to delete this coupon?')) {
            router.delete(`/admin/coupons/${id}`);
        }
    };

    const filteredCoupons = coupons.filter(c => 
        c.code?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6">
            <Head title="Manage Coupons" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tight">Promo <span className="text-yellow-500">Coupons</span></h2>
                    <p className="text-slate-500 text-sm">Create and manage discount codes for your storefront.</p>
                </div>
                <Link 
                    href="/admin/coupons/create" 
                    className="inline-flex items-center px-6 py-3 bg-yellow-500 text-slate-900 font-bold rounded-xl hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-500/20"
                >
                    <Plus className="w-5 h-5 mr-2" /> Add Coupon Code
                </Link>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search coupon codes..." 
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 outline-none transition-all font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Promo Code</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Discount</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Min Order</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Usage Stats</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Expiry Date</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredCoupons && filteredCoupons.length > 0 ? filteredCoupons.map((coupon) => (
                                <tr key={coupon.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-yellow-400 font-black rounded-lg text-sm tracking-wider">
                                            <Tag className="w-3.5 h-3.5" />
                                            {coupon.code}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-extrabold text-slate-900">
                                            {coupon.discount_type === 'percent' 
                                                ? `${coupon.discount_value}% OFF` 
                                                : `₹${Number(coupon.discount_value).toLocaleString()} OFF`
                                            }
                                        </div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase">
                                            {coupon.discount_type === 'percent' ? 'Percentage' : 'Fixed Rupee'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 font-bold">
                                        {Number(coupon.min_order_amount) > 0 
                                            ? `₹${Number(coupon.min_order_amount).toLocaleString()}` 
                                            : <span className="text-slate-400 font-normal">None</span>
                                        }
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 font-bold">
                                        <span className="text-slate-900">{coupon.used_count || 0}</span>
                                        <span className="text-slate-400"> / {coupon.max_uses ? coupon.max_uses : '∞'}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                                        {coupon.expiry_date ? (
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                <span>{new Date(coupon.expiry_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                            </div>
                                        ) : (
                                            <span className="text-slate-400">No Expiration</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {coupon.status ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-full border border-emerald-100">
                                                <CheckCircle2 className="w-3.5 h-3.5" /> Active
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-50 text-rose-700 font-bold text-xs rounded-full border border-rose-100">
                                                <XCircle className="w-3.5 h-3.5" /> Disabled
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <Link 
                                                href={`/admin/coupons/${coupon.id}/edit`}
                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                title="Edit Coupon"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </Link>
                                            <button 
                                                onClick={() => deleteCoupon(coupon.id)}
                                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                                title="Delete Coupon"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="7" className="px-6 py-16 text-center text-slate-400 font-medium">
                                        <Tag className="w-10 h-10 mx-auto mb-3 text-slate-300 stroke-1" />
                                        No discount coupons found. Click "Add Coupon Code" above to create one.
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
