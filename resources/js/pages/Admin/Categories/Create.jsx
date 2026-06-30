import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/admin/categories');
    };

    return (
        <div className="p-6">
            <Head title="Create Category" />

            <div className="flex items-center gap-4 mb-8">
                <Link 
                    href="/admin/categories" 
                    className="p-2 bg-white border border-gray-200 rounded-xl text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-all"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tight">Add <span className="text-yellow-500">New Category</span></h2>
                    <p className="text-slate-500 text-sm">Expand your product range with a new segment.</p>
                </div>
            </div>

            <div className="max-w-2xl bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-8">
                <form onSubmit={submit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category Name</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full bg-slate-50 border border-gray-200 rounded-2xl py-4 px-6 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 transition-all font-bold"
                            placeholder="e.g. English Willow Bats"
                            required
                        />
                        {errors.name && <p className="text-xs font-bold text-rose-500 mt-1 ml-1">{errors.name}</p>}
                    </div>

                    <div className="pt-4 flex items-center gap-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-black py-4 rounded-2xl shadow-lg shadow-yellow-500/20 transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {processing ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> PUBLISH CATEGORY</>}
                        </button>
                        <Link
                            href="/admin/categories"
                            className="px-8 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all"
                        >
                            CANCEL
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
