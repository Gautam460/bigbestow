import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Plus, Edit2, Trash2, Upload, Link as LinkIcon, Image as ImageIcon, X, Save, Loader2, CheckCircle2, XCircle, ExternalLink } from 'lucide-react';

export default function Index({ banners = [] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState(null);
    const [imageType, setImageType] = useState('url');
    const [previewUrl, setPreviewUrl] = useState('');
    const [processing, setProcessing] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        image: null,
        link: '',
        status: true,
    });

    const openCreateModal = () => {
        setEditingBanner(null);
        setFormData({ title: '', image: '', link: '', status: true });
        setImageType('url');
        setPreviewUrl('');
        setIsModalOpen(true);
    };

    const openEditModal = (banner) => {
        setEditingBanner(banner);
        setFormData({
            title: banner.title || '',
            image: banner.image || '',
            link: banner.link || '',
            status: Boolean(banner.status),
        });
        setImageType('url');
        setPreviewUrl(banner.image || '');
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingBanner(null);
        setPreviewUrl('');
    };

    const handleUrlChange = (e) => {
        const val = e.target.value;
        setFormData({ ...formData, image: val });
        setPreviewUrl(val);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);

        const dataToSend = {
            title: formData.title,
            image: formData.image,
            link: formData.link,
            status: formData.status ? 1 : 0,
        };

        if (editingBanner) {
            router.post(`/admin/banners/${editingBanner.id}`, {
                _method: 'PUT',
                ...dataToSend,
            }, {
                forceFormData: true,
                onSuccess: () => {
                    setProcessing(false);
                    closeModal();
                },
                onError: () => setProcessing(false),
            });
        } else {
            router.post('/admin/banners', dataToSend, {
                forceFormData: true,
                onSuccess: () => {
                    setProcessing(false);
                    closeModal();
                },
                onError: () => setProcessing(false),
            });
        }
    };

    const deleteBanner = (id) => {
        if (confirm('Are you sure you want to delete this banner image?')) {
            router.delete(`/admin/banners/${id}`);
        }
    };

    const toggleStatus = (banner) => {
        router.post(`/admin/banners/${banner.id}`, {
            _method: 'PUT',
            title: banner.title,
            image: banner.image,
            link: banner.link,
            status: !banner.status ? 1 : 0,
        }, { forceFormData: true });
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <Head title="Manage Banners & Sliders" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tight">Homepage <span className="text-yellow-500">Sliders</span></h2>
                    <p className="text-slate-500 text-sm">Manage dynamic promotional banner images on the storefront hero slider.</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="inline-flex items-center px-6 py-3 bg-yellow-500 text-slate-900 font-bold rounded-xl hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-500/20"
                >
                    <Plus className="w-5 h-5 mr-2" /> Add New Banner
                </button>
            </div>

            {/* Banners Grid/Table */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Banner Preview</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Title & Link</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {banners.length > 0 ? banners.map((banner) => (
                                <tr key={banner.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4 w-64">
                                        <div className="relative h-24 w-48 rounded-xl overflow-hidden bg-slate-100 border border-gray-200 shadow-sm">
                                            <img src={banner.image} alt={banner.title || 'Banner'} className="w-full h-full object-cover" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-slate-900 text-base mb-1">{banner.title || <span className="text-slate-400 italic">Untitled Banner</span>}</div>
                                        {banner.link ? (
                                            <a href={banner.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline font-medium">
                                                {banner.link} <ExternalLink className="w-3 h-3" />
                                            </a>
                                        ) : (
                                            <span className="text-xs text-slate-400">No redirect link</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => toggleStatus(banner)}
                                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${banner.status ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100' : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'}`}
                                        >
                                            {banner.status ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <XCircle className="w-3.5 h-3.5 text-slate-400" />}
                                            {banner.status ? 'Active' : 'Inactive'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => openEditModal(banner)}
                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                title="Edit Banner"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => deleteBanner(banner.id)}
                                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                                title="Delete Banner"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-16 text-center text-slate-400 font-medium italic">
                                        No banners added yet. Click "Add New Banner" to create your first slider!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal for Create/Edit */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center pb-6 border-b border-gray-100 mb-6">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tight">
                                    {editingBanner ? 'Edit' : 'Add New'} <span className="text-yellow-500">Banner</span>
                                </h3>
                                <p className="text-xs text-slate-500 mt-0.5">Configure image and link for the homepage slider.</p>
                            </div>
                            <button onClick={closeModal} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Banner Title (Optional)</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full mt-1 bg-slate-50 border border-gray-200 rounded-2xl py-3 px-5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 font-bold text-sm"
                                    placeholder="e.g. Summer Sale - Up to 50% Off"
                                />
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Banner Image *</label>
                                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                                        <button
                                            type="button"
                                            onClick={() => { setImageType('url'); setFormData({ ...formData, image: '' }); setPreviewUrl(''); }}
                                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${imageType === 'url' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                                        >
                                            <LinkIcon className="w-3 h-3" /> URL
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => { setImageType('file'); setFormData({ ...formData, image: null }); setPreviewUrl(''); }}
                                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${imageType === 'file' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                                        >
                                            <Upload className="w-3 h-3" /> File Upload
                                        </button>
                                    </div>
                                </div>

                                {imageType === 'url' ? (
                                    <input
                                        type="url"
                                        value={typeof formData.image === 'string' ? formData.image : ''}
                                        onChange={handleUrlChange}
                                        className="w-full bg-slate-50 border border-gray-200 rounded-2xl py-3 px-5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 font-medium text-sm"
                                        placeholder="https://images.unsplash.com/photo-..."
                                        required={!editingBanner && imageType === 'url'}
                                    />
                                ) : (
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="w-full bg-slate-50 border border-gray-200 rounded-2xl py-2.5 px-5 text-slate-900 text-sm file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-yellow-500 file:text-slate-900 hover:file:bg-yellow-400 cursor-pointer"
                                        required={!editingBanner && imageType === 'file'}
                                    />
                                )}

                                {previewUrl && (
                                    <div className="mt-3 relative h-36 w-full rounded-2xl overflow-hidden border border-gray-200 bg-slate-900 flex items-center justify-center">
                                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Destination Link / URL (Optional)</label>
                                <input
                                    type="text"
                                    value={formData.link}
                                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                    className="w-full mt-1 bg-slate-50 border border-gray-200 rounded-2xl py-3 px-5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 font-medium text-sm"
                                    placeholder="e.g. /products?category=english-willow"
                                />
                            </div>

                            <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-gray-200">
                                <input
                                    type="checkbox"
                                    id="status"
                                    checked={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
                                    className="w-5 h-5 rounded text-yellow-500 focus:ring-yellow-500 border-gray-300 cursor-pointer"
                                />
                                <label htmlFor="status" className="text-sm font-bold text-slate-900 cursor-pointer select-none">
                                    Active (Display this banner on homepage slider)
                                </label>
                            </div>

                            <div className="pt-4 flex items-center gap-3 border-t border-gray-100">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-black py-4 rounded-2xl shadow-lg shadow-yellow-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {processing ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> {editingBanner ? 'UPDATE BANNER' : 'PUBLISH BANNER'}</>}
                                </button>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-6 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all"
                                >
                                    CANCEL
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
