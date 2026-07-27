'use client';

import React, { useState, useEffect } from 'react';
import { Head } from '@/lib/inertia-compat';
import { FileText, Plus, Edit2, Trash2, Search, X, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';

const CKEditor = dynamic(() => import('@/components/CKEditorWrapper'), { ssr: false });

export default function AdminPagesPage() {
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPage, setEditingPage] = useState(null);
    const [processing, setProcessing] = useState(false);
    
    // Form fields
    const [slug, setSlug] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [status, setStatus] = useState(true);

    const fetchPages = async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/admin/pages').catch(() => []);
            setPages(Array.isArray(res) ? res : (res?.data || []));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPages();
    }, []);

    const openAddModal = () => {
        setSlug('');
        setTitle('');
        setContent('');
        setStatus(true);
        setEditingPage(null);
        setIsModalOpen(true);
    };

    const openEditModal = (page) => {
        setEditingPage(page);
        setSlug(page.slug || '');
        setTitle(page.title || '');
        setContent(page.content || '');
        setStatus(page.status !== false);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        try {
            const payload = {
                slug,
                title,
                content,
                status: status ? 1 : 0
            };

            if (editingPage) {
                await api.put(`/api/admin/pages/${editingPage.id}`, payload);
                toast.success('Page updated successfully.');
            } else {
                await api.post('/api/admin/pages', payload);
                toast.success('Page created successfully.');
            }
            setIsModalOpen(false);
            fetchPages();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save page.');
        } finally {
            setProcessing(false);
        }
    };

    const handleDelete = async (id, pageTitle) => {
        if (window.confirm(`Are you sure you want to delete page "${pageTitle}"?`)) {
            try {
                await api.delete(`/api/admin/pages/${id}`);
                toast.success('Page deleted successfully.');
                fetchPages();
            } catch (err) {
                toast.error('Failed to delete page.');
            }
        }
    };

    const filtered = pages.filter(p => p.title?.toLowerCase().includes(searchTerm.toLowerCase()) || p.slug?.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="space-y-8 p-6 text-slate-900 dark:text-slate-100">
            <Head title="Manage Pages | Admin Portal" />
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="p-6 sm:p-8 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800/50">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                            <FileText className="text-emerald-400 w-6 h-6" /> CMS <span className="text-emerald-400">Pages</span>
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Manage dynamic content for static pages like About, Contact, etc.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-slate-400" />
                            <input 
                                type="text"
                                placeholder="Search pages..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                            />
                        </div>
                        <button onClick={openAddModal} className="shrink-0 flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-slate-950 font-bold rounded-xl hover:bg-emerald-400 text-sm">
                            <Plus className="w-5 h-5" /> Add Page
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-emerald-400" /></div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                                    <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Title</th>
                                    <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Slug</th>
                                    <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</th>
                                    <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {filtered.length > 0 ? filtered.map(p => (
                                    <tr key={p.id} className="hover:bg-slate-100 dark:hover:bg-slate-700/50">
                                        <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{p.title}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300 font-mono">/{p.slug}</td>
                                        <td className="px-6 py-4">
                                            {p.status ? (
                                                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 text-xs font-bold rounded-full">Active</span>
                                            ) : (
                                                <span className="px-2 py-1 bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400 text-xs font-bold rounded-full">Inactive</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => openEditModal(p)} className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-xl"><Edit2 className="w-4 h-4" /></button>
                                                <button onClick={() => handleDelete(p.id, p.title)} className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-xl"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-slate-500 dark:text-slate-400 text-sm">
                                            No pages found. Create one like 'about' or 'contact'.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto overflow-x-hidden border border-slate-200 dark:border-slate-700 relative flex flex-col">
                        <div className="sticky top-0 bg-white dark:bg-slate-800 p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center z-10">
                            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                {editingPage ? 'Edit Page' : 'Add New Page'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 bg-slate-100 dark:bg-slate-700 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-6 flex-grow">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Page Title *</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                        placeholder="e.g. About Us"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">URL Slug *</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={slug}
                                        onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono text-sm"
                                        placeholder="e.g. about"
                                    />
                                    <p className="text-xs text-slate-400 mt-1">This will be the URL (e.g. /about, /contact)</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Content (HTML allowed)</label>
                                <CKEditor
                                    value={content}
                                    onChange={(data) => setContent(data)}
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="status"
                                    checked={status}
                                    onChange={(e) => setStatus(e.target.checked)}
                                    className="w-4 h-4 text-emerald-500 bg-slate-100 border-slate-300 rounded focus:ring-emerald-500 dark:focus:ring-emerald-600 dark:ring-offset-slate-800 dark:bg-slate-700 dark:border-slate-600"
                                />
                                <label htmlFor="status" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Publish immediately
                                </label>
                            </div>

                            <div className="pt-4 flex justify-end gap-3 sticky bottom-0 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 pb-2">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" disabled={processing} className="px-6 py-3 font-bold text-slate-950 bg-emerald-500 hover:bg-emerald-400 rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2">
                                    {processing && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {editingPage ? 'Update Page' : 'Save Page'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
