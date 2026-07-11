import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeft, Save, Loader2, Upload, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';

export default function Create({ categories = [], subcategories = [] }) {
    const [imageType, setImageType] = useState('url'); // 'url' or 'file'
    const [previewUrl, setPreviewUrl] = useState('');

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        category_id: '',
        subcategory_id: '',
        price: '',
        stock: '10',
        description: '',
        image: null,
        status: true,
    });

    const handleUrlChange = (e) => {
        const val = e.target.value;
        setData('image', val);
        setPreviewUrl(val);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('image', file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const filteredSubcategories = subcategories.filter(
        sub => !data.category_id || String(sub.category_id) === String(data.category_id)
    );

    const submit = (e) => {
        e.preventDefault();
        post('/admin/products', {
            forceFormData: true
        });
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <Head title="Create Product" />

            <div className="flex items-center gap-4 mb-8">
                <Link 
                    href="/admin/products" 
                    className="p-2 bg-white border border-gray-200 rounded-xl text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-all shadow-sm"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tight">Add <span className="text-yellow-500">New Product</span></h2>
                    <p className="text-slate-500 text-sm">Add equipment or gear to your store catalog.</p>
                </div>
            </div>

            <form onSubmit={submit} className="space-y-8">
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-6">
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight pb-4 border-b border-gray-100">Basic Details</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Product Name *</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full bg-slate-50 border border-gray-200 rounded-2xl py-4 px-6 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 transition-all font-bold"
                                placeholder="e.g. SS Master 9900 English Willow Bat"
                                required
                            />
                            {errors.name && <p className="text-xs font-bold text-rose-500 mt-1 ml-1">{errors.name}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category *</label>
                            <select
                                value={data.category_id}
                                onChange={(e) => {
                                    setData('category_id', e.target.value);
                                    setData('subcategory_id', '');
                                }}
                                className="w-full bg-slate-50 border border-gray-200 rounded-2xl py-4 px-6 text-slate-900 focus:outline-none focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 transition-all font-bold"
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                            {errors.category_id && <p className="text-xs font-bold text-rose-500 mt-1 ml-1">{errors.category_id}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subcategory</label>
                            <select
                                value={data.subcategory_id}
                                onChange={(e) => setData('subcategory_id', e.target.value)}
                                className="w-full bg-slate-50 border border-gray-200 rounded-2xl py-4 px-6 text-slate-900 focus:outline-none focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 transition-all font-bold"
                            >
                                <option value="">Optional Subcategory</option>
                                {filteredSubcategories.map((sub) => (
                                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                                ))}
                            </select>
                            {errors.subcategory_id && <p className="text-xs font-bold text-rose-500 mt-1 ml-1">{errors.subcategory_id}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Price (₹) *</label>
                            <input
                                type="number"
                                step="0.01"
                                value={data.price}
                                onChange={(e) => setData('price', e.target.value)}
                                className="w-full bg-slate-50 border border-gray-200 rounded-2xl py-4 px-6 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 transition-all font-bold"
                                placeholder="2499.00"
                                required
                            />
                            {errors.price && <p className="text-xs font-bold text-rose-500 mt-1 ml-1">{errors.price}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Stock Quantity *</label>
                            <input
                                type="number"
                                value={data.stock}
                                onChange={(e) => setData('stock', e.target.value)}
                                className="w-full bg-slate-50 border border-gray-200 rounded-2xl py-4 px-6 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 transition-all font-bold"
                                placeholder="25"
                                required
                            />
                            {errors.stock && <p className="text-xs font-bold text-rose-500 mt-1 ml-1">{errors.stock}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                        <textarea
                            rows="4"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="w-full bg-slate-50 border border-gray-200 rounded-2xl py-4 px-6 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 transition-all font-medium"
                            placeholder="Full product specifications and details..."
                        ></textarea>
                        {errors.description && <p className="text-xs font-bold text-rose-500 mt-1 ml-1">{errors.description}</p>}
                    </div>
                </div>

                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Product Image</h3>
                        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                            <button
                                type="button"
                                onClick={() => { setImageType('url'); setData('image', ''); setPreviewUrl(''); }}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${imageType === 'url' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                            >
                                <LinkIcon className="w-3.5 h-3.5" /> Image URL
                            </button>
                            <button
                                type="button"
                                onClick={() => { setImageType('file'); setData('image', null); setPreviewUrl(''); }}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${imageType === 'file' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                            >
                                <Upload className="w-3.5 h-3.5" /> Upload File
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                        <div className="md:col-span-2 space-y-2">
                            {imageType === 'url' ? (
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Direct Image URL</label>
                                    <input
                                        type="url"
                                        value={typeof data.image === 'string' ? data.image : ''}
                                        onChange={handleUrlChange}
                                        className="w-full mt-1 bg-slate-50 border border-gray-200 rounded-2xl py-4 px-6 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 transition-all font-medium text-sm"
                                        placeholder="https://images.unsplash.com/photo-..."
                                    />
                                </div>
                            ) : (
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Upload Image File</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="w-full mt-1 bg-slate-50 border border-gray-200 rounded-2xl py-3 px-6 text-slate-900 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-yellow-500 file:text-slate-900 hover:file:bg-yellow-400 cursor-pointer"
                                    />
                                </div>
                            )}
                            {errors.image && <p className="text-xs font-bold text-rose-500 mt-1 ml-1">{errors.image}</p>}
                        </div>

                        <div className="flex justify-center border-2 border-dashed border-gray-200 rounded-2xl p-4 bg-slate-50 min-h-[140px] items-center">
                            {previewUrl ? (
                                <img src={previewUrl} alt="Preview" className="max-h-32 rounded-xl object-contain shadow-md" />
                            ) : (
                                <div className="text-center text-slate-400">
                                    <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-50" />
                                    <span className="text-xs font-bold">No Image Preview</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="pt-4 flex items-center gap-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-black py-4 rounded-2xl shadow-lg shadow-yellow-500/20 transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {processing ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> CREATE PRODUCT</>}
                    </button>
                    <Link
                        href="/admin/products"
                        className="px-8 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all text-center"
                    >
                        CANCEL
                    </Link>
                </div>
            </form>
        </div>
    );
}
