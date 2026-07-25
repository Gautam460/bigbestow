'use client';

import React, { useState, useEffect } from 'react';
import { Head } from '@/lib/inertia-compat';
import { MessageSquare, Trash2, Search, Loader2, Eye, X } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function AdminQueriesPage() {
    const [queries, setQueries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewQuery, setViewQuery] = useState(null);

    const fetchQueries = async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/admin/contact-queries').catch(() => []);
            setQueries(res?.queries || res?.data?.queries || []);
        } catch (error) {
            toast.error('Failed to load contact queries.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQueries();
    }, []);

    const handleDelete = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete query from "${name}"?`)) {
            try {
                await api.delete(`/api/admin/contact-queries/${id}`);
                toast.success('Query deleted.');
                fetchQueries();
            } catch (err) {
                toast.error('Failed to delete query.');
            }
        }
    };

    const filtered = queries.filter(q => 
        q.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        q.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.subject?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 p-6 text-slate-900 dark:text-slate-100">
            <Head title="Contact Queries | Admin Portal" />
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="p-6 sm:p-8 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800/50">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                            <MessageSquare className="text-pink-400 w-6 h-6" /> Contact <span className="text-pink-400">Queries</span>
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Manage messages and inquiries from customers.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-slate-400" />
                            <input 
                                type="text"
                                placeholder="Search queries..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500/30"
                            />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-pink-400" /></div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                                    <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Customer</th>
                                    <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Subject</th>
                                    <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Date</th>
                                    <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {filtered.length > 0 ? filtered.map(q => (
                                    <tr key={q.id} className="hover:bg-slate-100 dark:hover:bg-slate-700/50">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-900 dark:text-white">{q.name}</div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400">{q.email}</div>
                                            {q.phone && <div className="text-xs text-slate-500 dark:text-slate-400">{q.phone}</div>}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-slate-700 dark:text-slate-300 font-semibold">{q.subject || 'No Subject'}</div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[250px]">{q.comment}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                                            {new Date(q.created_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => setViewQuery(q)} className="p-2 text-indigo-400 hover:bg-indigo-500/10 rounded-xl"><Eye className="w-4 h-4" /></button>
                                                <button onClick={() => handleDelete(q.id, q.name)} className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-xl"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="4" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">No contact queries found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* View Modal */}
            {viewQuery && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white flex items-center justify-between border-b border-slate-200 dark:border-slate-700">
                            <h3 className="font-black text-lg uppercase tracking-wider flex items-center gap-2"><MessageSquare className="w-5 h-5 text-pink-500"/> Query Details</h3>
                            <button onClick={() => setViewQuery(null)} className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Name</p>
                                    <p className="font-bold text-slate-900 dark:text-white">{viewQuery.name}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Email</p>
                                    <a href={`mailto:${viewQuery.email}`} className="font-bold text-indigo-500 hover:underline">{viewQuery.email}</a>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Phone</p>
                                    <p className="font-bold text-slate-900 dark:text-white">{viewQuery.phone || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Date</p>
                                    <p className="font-bold text-slate-900 dark:text-white">
                                        {new Date(viewQuery.created_at).toLocaleString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="border-t border-slate-100 dark:border-slate-700 pt-6">
                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Subject</p>
                                <p className="font-bold text-slate-900 dark:text-white text-lg">{viewQuery.subject || 'No Subject Provided'}</p>
                            </div>
                            
                            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">Comment / Message</p>
                                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{viewQuery.comment}</p>
                            </div>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 flex justify-end">
                            <button onClick={() => setViewQuery(null)} className="px-6 py-2.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-bold text-sm rounded-xl transition-colors">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
