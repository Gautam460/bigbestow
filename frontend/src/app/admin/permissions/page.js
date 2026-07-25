'use client';

import React, { useState, useEffect } from 'react';
import { Head } from '@/lib/inertia-compat';
import { ShieldCheck, Plus, Trash2, Key, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function AdminPermissionsPage() {
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newRoleName, setNewRoleName] = useState('');
    const [processing, setProcessing] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/admin/permissions').catch(() => ({ roles: [], permissions: [] }));
            const data = res?.data || res || {};
            setRoles(Array.isArray(data.roles) ? data.roles : []);
            setPermissions(Array.isArray(data.permissions) ? data.permissions : []);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateRole = async (e) => {
        e.preventDefault();
        if (!newRoleName.trim()) return;
        setProcessing(true);
        try {
            await api.post('/api/admin/permissions/roles', { name: newRoleName.trim() });
            toast.success('Role created successfully.');
            setNewRoleName('');
            fetchData();
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Failed to create role.');
        } finally {
            setProcessing(false);
        }
    };

    const handleDeleteRole = async (roleId, name) => {
        if (window.confirm(`Delete administrative role "${name}"?`)) {
            try {
                await api.delete(`/api/admin/permissions/roles/${roleId}`);
                toast.success('Role removed.');
                fetchData();
            } catch (err) {
                toast.error(err?.response?.data?.message || 'Cannot remove protected role.');
            }
        }
    };

    return (
        <div className="space-y-8 p-6 text-slate-900 dark:text-slate-100">
            <Head title="Roles & Permissions | Admin Portal" />
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="p-6 sm:p-8 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800/50">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                            <ShieldCheck className="text-teal-400 w-6 h-6" /> Roles & <span className="text-teal-400">Permissions</span>
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Define access control tiers and system privileges for staff members.</p>
                    </div>
                    <form onSubmit={handleCreateRole} className="flex items-center gap-2">
                        <input 
                            type="text" 
                            placeholder="New role name..." 
                            value={newRoleName} 
                            onChange={(e) => setNewRoleName(e.target.value)} 
                            className="px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                        />
                        <button type="submit" disabled={processing} className="px-5 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-sm flex items-center gap-1.5">
                            <Plus className="w-4 h-4" /> Add Role
                        </button>
                    </form>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-teal-400" /></div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                                    <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Role Name</th>
                                    <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Assigned Permissions</th>
                                    <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {roles.length > 0 ? roles.map(r => (
                                    <tr key={r.id} className="hover:bg-slate-100 dark:hover:bg-slate-700/50">
                                        <td className="px-6 py-4 font-extrabold text-slate-900 dark:text-white capitalize flex items-center gap-2">
                                            <Key className="w-4 h-4 text-teal-400" />
                                            {r.name}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1.5">
                                                {(r.permissions && r.permissions.length > 0) ? r.permissions.map(p => (
                                                    <span key={p.id} className="px-2 py-0.5 rounded-md text-[10px] font-black bg-teal-500/10 text-teal-300 border border-teal-500/20">
                                                        {p.name}
                                                    </span>
                                                )) : (
                                                    <span className="text-xs text-slate-500 dark:text-slate-400">All / Default Store Privileges</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {!['superadmin', 'admin', 'customer'].includes(r.name) && (
                                                <button onClick={() => handleDeleteRole(r.id, r.name)} className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-xl" title="Remove Role">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="3" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">No custom roles established yet.</td></tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
