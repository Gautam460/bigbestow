'use client';

import React, { useState, useEffect } from 'react';
import { Head } from '@/lib/inertia-compat';
import { Mail, Trash2, Search, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function AdminSubscribersPage() {
    const [subscribers, setSubscribers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchSubscribers = async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/admin/subscribers').catch(() => []);
            setSubscribers(res?.subscribers || res?.data?.subscribers || []);
        } catch (error) {
            toast.error('Failed to load subscribers.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscribers();
    }, []);

    const handleDelete = async (id, email) => {
        if (window.confirm(`Are you sure you want to delete subscriber "${email}"?`)) {
            try {
                await api.delete(`/api/admin/subscribers/${id}`);
                toast.success('Subscriber deleted.');
                fetchSubscribers();
            } catch (err) {
                toast.error('Failed to delete subscriber.');
            }
        }
    };

    const filtered = subscribers.filter(s => s.email?.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="space-y-8 p-6 text-slate-900 dark:text-slate-100">
            <Head title="Manage Subscribers | Admin Portal" />
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="p-6 sm:p-8 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800/50">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                            <Mail className="text-indigo-400 w-6 h-6" /> Newsletter <span className="text-indigo-400">Subscribers</span>
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Manage users who subscribed to the Bigbestow Club.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-slate-400" />
                            <input 
                                type="text"
                                placeholder="Search subscribers..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                            />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-400" /></div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                                    <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Email Address</th>
                                    <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Subscribed Date</th>
                                    <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {filtered.length > 0 ? filtered.map(s => (
                                    <tr key={s.id} className="hover:bg-slate-100 dark:hover:bg-slate-700/50">
                                        <td className="px-6 py-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-xs uppercase">
                                                {s.email.charAt(0)}
                                            </div>
                                            {s.email}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                                            {new Date(s.created_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => handleDelete(s.id, s.email)} className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-xl"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="3" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">No subscribers found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
