import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeft, Save, Loader2, Layers } from 'lucide-react';

export default function Edit({ subcategory, categories = [] }) {
    const { data, setData, put, processing, errors } = useForm({
        name: subcategory.name || '',
        category_id: subcategory.category_id || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(`/admin/subcategories/${subcategory.id}`);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <Head title="Edit Subcategory" />

            <div className="flex items-center gap-4 mb-8">
                <Link 
                    href="/admin/subcategories" 
                    className="p-2 bg-white border border-gray-200 rounded-xl text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-all shadow-sm"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tight">Edit <span className="text-yellow-500">Subcategory</span></h2>
                    <p className="text-slate-500 text-sm">Update subcategory details and parent classification.</p>
                </div>
            </div>

            <form onSubmit={submit} className="space-y-8">
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-6">
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight pb-4 border-b border-gray-100 flex items-center gap-2">
                        <Layers className="w-5 h-5 text-yellow-500" /> Subcategory Details
                    </h3>
                    
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Parent Category *</label>
                            <select
                                value={data.category_id}
                                onChange={(e) => setData('category_id', e.target.value)}
                                className="w-full bg-slate-50 border border-gray-200 rounded-2xl py-4 px-6 text-slate-900 focus:outline-none focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 transition-all font-bold cursor-pointer"
                                required
                            >
                                <option value="" disabled>Select a parent category...</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            {errors.category_id && <p className="text-xs font-bold text-rose-500 mt-1 ml-1">{errors.category_id}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subcategory Name *</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full bg-slate-50 border border-gray-200 rounded-2xl py-4 px-6 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 transition-all font-bold"
                                placeholder="e.g. Grade 1 English Willow, Batting Gloves, Helmets"
                                required
                            />
                            {errors.name && <p className="text-xs font-bold text-rose-500 mt-1 ml-1">{errors.name}</p>}
                        </div>
                    </div>
                </div>

                <div className="pt-4 flex items-center gap-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-black py-4 rounded-2xl shadow-lg shadow-yellow-500/20 transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {processing ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> UPDATE SUBCATEGORY</>}
                    </button>
                    <Link
                        href="/admin/subcategories"
                        className="px-8 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all text-center"
                    >
                        CANCEL
                    </Link>
                </div>
            </form>
        </div>
    );
}
