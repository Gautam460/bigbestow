import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeft, Save, Loader2, Tag } from 'lucide-react';

export default function Edit({ coupon }) {
    const { data, setData, put, processing, errors } = useForm({
        code: coupon?.code || '',
        discount_type: coupon?.discount_type || 'percent',
        discount_value: coupon?.discount_value || '',
        min_order_amount: coupon?.min_order_amount || '',
        max_uses: coupon?.max_uses || '',
        expiry_date: coupon?.expiry_date ? coupon.expiry_date.split('T')[0] : '',
        status: coupon?.status ?? true,
    });

    const submit = (e) => {
        e.preventDefault();
        put(`/admin/coupons/${coupon.id}`);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <Head title={`Edit Coupon - ${coupon?.code}`} />

            <div className="flex items-center gap-4 mb-8">
                <Link 
                    href="/admin/coupons" 
                    className="p-2 bg-white border border-gray-200 rounded-xl text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-all shadow-sm"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tight">Edit <span className="text-yellow-500">Promo Code</span></h2>
                    <p className="text-slate-500 text-sm">Update settings for coupon code <strong className="text-slate-900">{coupon?.code}</strong>.</p>
                </div>
            </div>

            <form onSubmit={submit} className="space-y-8">
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-6">
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight pb-4 border-b border-gray-100 flex items-center gap-2">
                        <Tag className="w-5 h-5 text-yellow-500" /> Coupon Settings
                    </h3>
                    
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Promo Code *</label>
                            <input
                                type="text"
                                value={data.code}
                                onChange={(e) => setData('code', e.target.value.toUpperCase())}
                                className="w-full bg-slate-50 border border-gray-200 rounded-2xl py-4 px-6 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 transition-all font-black uppercase tracking-wider text-lg"
                                required
                            />
                            {errors.code && <p className="text-xs font-bold text-rose-500 mt-1 ml-1">{errors.code}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Discount Type *</label>
                                <select
                                    value={data.discount_type}
                                    onChange={(e) => setData('discount_type', e.target.value)}
                                    className="w-full bg-slate-50 border border-gray-200 rounded-2xl py-4 px-6 text-slate-900 focus:outline-none focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 transition-all font-bold cursor-pointer"
                                >
                                    <option value="percent">Percentage (%)</option>
                                    <option value="fixed">Fixed Rupee Amount (₹)</option>
                                </select>
                                {errors.discount_type && <p className="text-xs font-bold text-rose-500 mt-1 ml-1">{errors.discount_type}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                    Discount Value * ({data.discount_type === 'percent' ? '%' : '₹'})
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={data.discount_value}
                                    onChange={(e) => setData('discount_value', e.target.value)}
                                    className="w-full bg-slate-50 border border-gray-200 rounded-2xl py-4 px-6 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 transition-all font-bold"
                                    required
                                />
                                {errors.discount_value && <p className="text-xs font-bold text-rose-500 mt-1 ml-1">{errors.discount_value}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Minimum Order Amount (₹)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={data.min_order_amount}
                                    onChange={(e) => setData('min_order_amount', e.target.value)}
                                    className="w-full bg-slate-50 border border-gray-200 rounded-2xl py-4 px-6 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 transition-all font-bold"
                                />
                                {errors.min_order_amount && <p className="text-xs font-bold text-rose-500 mt-1 ml-1">{errors.min_order_amount}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Maximum Usage Limit</label>
                                <input
                                    type="number"
                                    value={data.max_uses}
                                    onChange={(e) => setData('max_uses', e.target.value)}
                                    className="w-full bg-slate-50 border border-gray-200 rounded-2xl py-4 px-6 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 transition-all font-bold"
                                    placeholder="Leave blank for unlimited"
                                />
                                {errors.max_uses && <p className="text-xs font-bold text-rose-500 mt-1 ml-1">{errors.max_uses}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Expiration Date (Optional)</label>
                                <input
                                    type="date"
                                    value={data.expiry_date}
                                    onChange={(e) => setData('expiry_date', e.target.value)}
                                    className="w-full bg-slate-50 border border-gray-200 rounded-2xl py-4 px-6 text-slate-900 focus:outline-none focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 transition-all font-bold"
                                />
                                {errors.expiry_date && <p className="text-xs font-bold text-rose-500 mt-1 ml-1">{errors.expiry_date}</p>}
                            </div>

                            <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-gray-200 mt-6 md:mt-0">
                                <div>
                                    <span className="text-sm font-black text-slate-900 block">Status Active</span>
                                    <span className="text-xs text-slate-500">Enable or disable this promo code immediately</span>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={data.status} 
                                        onChange={(e) => setData('status', e.target.checked)} 
                                        className="sr-only peer" 
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-4 flex items-center gap-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-black py-4 rounded-2xl shadow-lg shadow-yellow-500/20 transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {processing ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> UPDATE COUPON</>}
                    </button>
                    <Link
                        href="/admin/coupons"
                        className="px-8 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all text-center"
                    >
                        CANCEL
                    </Link>
                </div>
            </form>
        </div>
    );
}
