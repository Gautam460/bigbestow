'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Head } from '@/lib/inertia-compat';
import { ImageIcon, Plus, Trash2, Pencil, Search, X, Loader2, UploadCloud, Link as LinkIcon, CheckCircle2, Eye } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

const getImgSrc = (image) => {
    if (!image) return '/images/placeholder.png';
    if (image.startsWith('http')) return image;
    return `/storage/${image.replace(/^\/storage\//, '')}`;
};

export default function AdminBannersPage() {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState(null); // null = add, object = edit
    const [processing, setProcessing] = useState(false);
    const [uploadMode, setUploadMode] = useState('file'); // 'file' | 'url'
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [dragOver, setDragOver] = useState(false);
    const [formData, setFormData] = useState({ title: '', image: '', link: '' });
    const fileInputRef = useRef(null);

    const fetchBanners = async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/admin/banners').catch(() => ([]));
            setBanners(Array.isArray(res) ? res : (res?.data || []));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBanners(); }, []);

    /* ── Open Add modal ── */
    const openAddModal = () => {
        setEditingBanner(null);
        setFormData({ title: '', image: '', link: '' });
        setImageFile(null);
        setImagePreview(null);
        setUploadMode('file');
        setIsModalOpen(true);
    };

    /* ── Open Edit modal ── */
    const openEditModal = (banner) => {
        setEditingBanner(banner);
        setFormData({ title: banner.title || '', image: banner.image || '', link: banner.link || '' });
        setImageFile(null);
        // Show current image as preview
        setImagePreview(getImgSrc(banner.image));
        // If existing image is a URL → switch to URL mode, else keep file (user can re-upload)
        setUploadMode(banner.image?.startsWith('http') ? 'url' : 'file');
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingBanner(null);
        setImageFile(null);
        setImagePreview(null);
    };

    /* ── File pick / drag-drop ── */
    const handleFileChange = (file) => {
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file (JPG, PNG, WEBP, GIF).');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image must be smaller than 5 MB.');
            return;
        }
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFileChange(file);
    };

    /* ── Submit (create or update) ── */
    const handleSubmit = async (e) => {
        e.preventDefault();

        const isEdit = Boolean(editingBanner);

        // For edit: image is optional (keep existing if not changed)
        if (!isEdit) {
            if (uploadMode === 'file' && !imageFile) {
                toast.error('Please select an image to upload.');
                return;
            }
            if (uploadMode === 'url' && !formData.image.trim()) {
                toast.error('Please enter an image URL.');
                return;
            }
        }

        setProcessing(true);
        try {
            const payload = new FormData();
            payload.append('title', formData.title || '');
            payload.append('link', formData.link || '');

            if (uploadMode === 'file' && imageFile) {
                payload.append('image', imageFile);
            } else if (uploadMode === 'url' && formData.image.trim()) {
                payload.append('image', formData.image.trim());
            }
            // If editing and no new image provided → don't append image (keep existing)

            const token = localStorage.getItem('auth_token');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            let res;
            if (isEdit) {
                payload.append('_method', 'PUT');
                res = await fetch(`/api/admin/banners/${editingBanner.id}`, {
                    method: 'POST', // Laravel _method spoofing
                    headers,
                    body: payload,
                });
            } else {
                res = await fetch('/api/admin/banners', {
                    method: 'POST',
                    headers,
                    body: payload,
                });
            }

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err?.message || (isEdit ? 'Update failed' : 'Upload failed'));
            }

            toast.success(isEdit ? 'Banner updated successfully!' : 'Banner created successfully!');
            closeModal();
            fetchBanners();
        } catch (err) {
            toast.error(err?.message || 'Failed to save banner.');
        } finally {
            setProcessing(false);
        }
    };

    /* ── Delete ── */
    const handleDelete = async (id, title) => {
        if (window.confirm(`Delete banner "${title || 'Untitled'}"?`)) {
            try {
                await api.delete(`/api/admin/banners/${id}`);
                toast.success('Banner deleted.');
                fetchBanners();
            } catch {
                toast.error('Failed to delete banner.');
            }
        }
    };

    const filtered = banners.filter(b => b.title?.toLowerCase().includes(searchTerm.toLowerCase()));
    const isEdit = Boolean(editingBanner);

    return (
        <div className="space-y-8 p-6 text-slate-900 dark:text-slate-100">
            <Head title="Banners & Offers | Admin Portal" />

            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="p-6 sm:p-8 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800/50">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                            <ImageIcon className="text-orange-400 w-6 h-6" /> Banners & <span className="text-orange-400">Offers</span>
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Showcase store promotions and hero banners on the homepage.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search banners..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                            />
                        </div>
                        <button onClick={openAddModal} className="shrink-0 flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-slate-950 font-bold rounded-xl hover:bg-orange-400 text-sm transition-colors">
                            <Plus className="w-5 h-5" /> Add Banner
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-orange-400" /></div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                                    <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Preview</th>
                                    <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Banner Title</th>
                                    <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Target URL</th>
                                    <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {filtered.length > 0 ? filtered.map(b => (
                                    <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="relative w-28 h-14 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900">
                                                <img
                                                    src={getImgSrc(b.image)}
                                                    alt={b.title}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => { e.target.src = 'https://placehold.co/300x120?text=Banner'; }}
                                                />
                                                {/* hover overlay */}
                                                <a href={getImgSrc(b.image)} target="_blank" rel="noopener noreferrer"
                                                    className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <Eye className="w-4 h-4 text-white" />
                                                </a>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-slate-900 dark:text-white">{b.title || 'Promotional Banner'}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs text-orange-400 font-mono truncate max-w-[200px] block">{b.link || '—'}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                {/* Edit button */}
                                                <button
                                                    onClick={() => openEditModal(b)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 rounded-lg transition-colors"
                                                    title="Edit Banner"
                                                >
                                                    <Pencil className="w-3.5 h-3.5" /> Edit
                                                </button>
                                                {/* Delete button */}
                                                <button
                                                    onClick={() => handleDelete(b.id, b.title)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-500 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 rounded-lg transition-colors"
                                                    title="Delete Banner"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" /> Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-16 text-center">
                                            <div className="flex flex-col items-center gap-3 text-slate-400 dark:text-slate-500">
                                                <ImageIcon className="w-10 h-10 opacity-30" />
                                                <p className="font-medium">No promotional banners found.</p>
                                                <button onClick={openAddModal} className="mt-1 text-orange-500 font-bold text-sm hover:underline">+ Add your first banner</button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* ── Add / Edit Modal ── */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">

                        {/* Modal Header */}
                        <div className={`p-6 flex items-center justify-between border-b border-slate-200 dark:border-slate-700 ${isEdit ? 'bg-indigo-50 dark:bg-indigo-500/10' : 'bg-slate-50 dark:bg-slate-900'}`}>
                            <h3 className="font-black text-lg uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                                {isEdit
                                    ? <><Pencil className="w-5 h-5 text-indigo-500" /> Edit Banner</>
                                    : <><ImageIcon className="w-5 h-5 text-orange-400" /> Add Promotional Banner</>
                                }
                            </h3>
                            <button onClick={closeModal} className="text-slate-400 hover:text-slate-900 dark:hover:text-white p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">

                            {/* Banner Title */}
                            <div>
                                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Banner Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g. Mega Summer Sale up to 50% OFF"
                                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                                />
                            </div>

                            {/* Banner Image */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                        Banner Image {isEdit && <span className="font-normal normal-case text-slate-400">(leave blank to keep current)</span>}
                                    </label>
                                    <div className="flex bg-slate-100 dark:bg-slate-900 rounded-lg p-0.5 gap-0.5">
                                        <button type="button"
                                            onClick={() => { setUploadMode('file'); setImageFile(null); setImagePreview(isEdit ? getImgSrc(editingBanner?.image) : null); }}
                                            className={`px-3 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1 ${uploadMode === 'file' ? 'bg-white dark:bg-slate-700 text-orange-500 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}>
                                            <UploadCloud className="w-3.5 h-3.5" /> Upload
                                        </button>
                                        <button type="button"
                                            onClick={() => { setUploadMode('url'); setImageFile(null); setImagePreview(formData.image || null); }}
                                            className={`px-3 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1 ${uploadMode === 'url' ? 'bg-white dark:bg-slate-700 text-orange-500 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}>
                                            <LinkIcon className="w-3.5 h-3.5" /> URL
                                        </button>
                                    </div>
                                </div>

                                {uploadMode === 'file' ? (
                                    <div>
                                        <div
                                            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                            onDragLeave={() => setDragOver(false)}
                                            onDrop={handleDrop}
                                            onClick={() => fileInputRef.current?.click()}
                                            className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 ${dragOver ? 'border-orange-400 bg-orange-50 dark:bg-orange-500/10' : 'border-slate-300 dark:border-slate-600 hover:border-orange-400 hover:bg-orange-50/50 dark:hover:bg-orange-500/5'}`}
                                        >
                                            {imagePreview ? (
                                                <div className="relative">
                                                    <img src={imagePreview} alt="Preview" className="w-full h-36 object-cover rounded-xl" />
                                                    <div className={`absolute top-2 right-2 rounded-full p-1 ${imageFile ? 'bg-emerald-500' : 'bg-slate-500'}`}>
                                                        <CheckCircle2 className="w-4 h-4 text-white" />
                                                    </div>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                                                        {imageFile ? imageFile.name : 'Current image — click or drop to replace'}
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center gap-2 py-4">
                                                    <div className="p-3 bg-orange-100 dark:bg-orange-500/10 rounded-2xl">
                                                        <UploadCloud className="w-8 h-8 text-orange-500" />
                                                    </div>
                                                    <p className="font-bold text-slate-700 dark:text-slate-200 text-sm">Drop image here or <span className="text-orange-500">browse</span></p>
                                                    <p className="text-xs text-slate-400 dark:text-slate-500">JPG, PNG, WEBP, GIF — max 5 MB</p>
                                                </div>
                                            )}
                                        </div>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => handleFileChange(e.target.files?.[0])}
                                        />
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <input
                                            type="url"
                                            value={formData.image}
                                            onChange={(e) => {
                                                setFormData({ ...formData, image: e.target.value });
                                                setImagePreview(e.target.value);
                                            }}
                                            placeholder="https://example.com/banner.jpg"
                                            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                                        />
                                        {imagePreview && (
                                            <img src={imagePreview} alt="URL Preview" className="w-full h-28 object-cover rounded-xl border border-slate-200 dark:border-slate-700" onError={(e) => e.target.style.display = 'none'} />
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Target Link */}
                            <div>
                                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                                    Target Link URL <span className="text-slate-400 font-normal normal-case">(optional)</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.link}
                                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                    placeholder="/shop or https://..."
                                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-200 dark:border-slate-700">
                                <button type="button" onClick={closeModal} className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className={`px-6 py-2.5 disabled:opacity-60 font-black rounded-xl text-sm flex items-center gap-2 shadow-lg transition-all ${isEdit
                                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20'
                                        : 'bg-orange-500 hover:bg-orange-400 text-slate-950 shadow-orange-500/20'
                                    }`}
                                >
                                    {processing
                                        ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                                        : isEdit
                                            ? <><Pencil className="w-4 h-4" /> Update Banner</>
                                            : <><UploadCloud className="w-4 h-4" /> Create Banner</>
                                    }
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
