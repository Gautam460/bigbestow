'use client';

import React, { useState, useEffect } from 'react';
import { Head } from '@/lib/inertia-compat';
import { Users, Search, ShieldAlert, Trash2, ShieldCheck, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/admin/users').catch(() => ([]));
            setUsers(Array.isArray(res) ? res : (res?.data || []));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const changeRole = async (userId, newRole) => {
        try {
            await api.put(`/api/admin/users/${userId}`, { role: newRole });
            toast.success(`User role assigned as ${newRole}.`);
            fetchUsers();
        } catch (err) {
            toast.error('Failed to change user role.');
        }
    };

    const deleteUser = async (userId, name) => {
        if (window.confirm(`Delete user "${name}"?`)) {
            try {
                await api.delete(`/api/admin/users/${userId}`);
                toast.success('User account removed.');
                fetchUsers();
            } catch (err) {
                toast.error(err?.response?.data?.message || 'Failed to delete user.');
            }
        }
    };

    const filtered = users.filter(u => 
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 p-6 text-slate-900 dark:text-slate-100">
            <Head title="Customers & Users Management | Admin Portal" />
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="p-6 sm:p-8 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800/50">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                            <Users className="text-violet-400 w-6 h-6" /> Customers & <span className="text-violet-400">Users</span>
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Manage user accounts and assign administrative roles.</p>
                    </div>
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-slate-400" />
                        <input 
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-violet-400" /></div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                                    <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">User Details</th>
                                    <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Current Role</th>
                                    <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {filtered.length > 0 ? filtered.map(u => {
                                    const roleName = u.roles?.[0]?.name || 'customer';
                                    return (
                                        <tr key={u.id} className="hover:bg-slate-100 dark:hover:bg-slate-700/50">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                                    {u.name}
                                                    {roleName !== 'customer' && <ShieldCheck className="w-4 h-4 text-violet-400" />}
                                                </div>
                                                <div className="text-xs text-slate-500 dark:text-slate-400">{u.email}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <select 
                                                    value={roleName}
                                                    onChange={(e) => changeRole(u.id, e.target.value)}
                                                    className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-extrabold uppercase tracking-wider text-violet-300 focus:outline-none"
                                                >
                                                    <option value="customer">Customer</option>
                                                    <option value="admin">Admin</option>
                                                    <option value="superadmin">Super Admin</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button onClick={() => deleteUser(u.id, u.name)} className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-xl" title="Delete User">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                }) : (
                                    <tr><td colSpan="3" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">No users found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
