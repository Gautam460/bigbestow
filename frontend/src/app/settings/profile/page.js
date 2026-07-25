'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Head } from '@/lib/inertia-compat';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SettingsLayout from '@/layouts/settings/layout';
import { useApp } from '@/context/AppContext';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Loader2, AlertTriangle } from 'lucide-react';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

export default function ProfilePage() {
    const { user, refreshUser, logout } = useApp() || {};
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    // Delete account state
    const [deletePassword, setDeletePassword] = useState('');
    const [deleteProcessing, setDeleteProcessing] = useState(false);
    const [deleteError, setDeleteError] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
        }
    }, [user]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});
        try {
            await api.put('/api/user/profile-information', { name, email });
            toast.success('Profile updated successfully!');
            if (refreshUser) refreshUser();
        } catch (err) {
            if (err?.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else {
                toast.error('Failed to update profile.');
            }
        } finally {
            setProcessing(false);
        }
    };

    const handleDeleteAccount = async (e) => {
        e.preventDefault();
        setDeleteProcessing(true);
        setDeleteError('');
        try {
            await api.delete('/api/user', { data: { password: deletePassword } });
            toast.success('Your account has been deleted.');
            if (logout) logout();
        } catch (err) {
            if (err?.response?.data?.errors?.password) {
                setDeleteError(err.response.data.errors.password[0] || 'Incorrect password.');
            } else if (err?.response?.data?.message) {
                setDeleteError(err.response.data.message);
            } else {
                setDeleteError('Failed to delete account. Ensure your password is correct.');
            }
        } finally {
            setDeleteProcessing(false);
        }
    };

    return (
        <SettingsLayout>
            <div className="space-y-10">
                <Head title="Profile settings | Bigbestow" />
                <h1 className="sr-only">Profile settings</h1>

                <div className="space-y-6">
                    <Heading
                        variant="small"
                        title="Profile information"
                        description="Update your account's name and email address"
                    />

                    <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-xl">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                placeholder="Full name"
                                className="mt-1 block w-full bg-white dark:bg-slate-800/80 border-gray-200 dark:border-slate-700 text-slate-900 dark:text-white"
                            />
                            {errors.name && <p className="text-xs text-rose-500 font-bold mt-1">{errors.name}</p>}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Email address</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="Email address"
                                className="mt-1 block w-full bg-white dark:bg-slate-800/80 border-gray-200 dark:border-slate-700 text-slate-900 dark:text-white"
                            />
                            {errors.email && <p className="text-xs text-rose-500 font-bold mt-1">{errors.email}</p>}
                        </div>

                        <div className="flex items-center gap-4">
                            <Button type="submit" disabled={processing} className="bg-slate-900 hover:bg-slate-800 text-white dark:bg-indigo-600 dark:hover:bg-indigo-500 font-bold px-6">
                                {processing && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </div>

                <div className="border-t border-gray-100 pt-8 space-y-6">
                    <Heading
                        variant="small"
                        title="Delete account"
                        description="Permanently delete your account and all of its resources"
                    />
                    <div className="space-y-4 rounded-2xl border border-rose-100 bg-rose-50/50 p-6 max-w-xl">
                        <div className="flex items-start gap-3 text-rose-600">
                            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-bold text-sm">Warning</p>
                                <p className="text-xs text-rose-700 mt-0.5">
                                    Please proceed with caution, this cannot be undone. All orders, wishlist items, and personal data will be permanently wiped.
                                </p>
                            </div>
                        </div>

                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="destructive" className="font-bold text-xs mt-2 bg-rose-600 hover:bg-rose-700">
                                    Delete Account
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogTitle>Are you sure you want to delete your account?</DialogTitle>
                                <DialogDescription>
                                    Once your account is deleted, all of its resources and data will be permanently deleted. Please enter your password to confirm.
                                </DialogDescription>

                                <form onSubmit={handleDeleteAccount} className="space-y-6 mt-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="delete-password">Password</Label>
                                        <Input
                                            id="delete-password"
                                            type="password"
                                            value={deletePassword}
                                            onChange={(e) => setDeletePassword(e.target.value)}
                                            placeholder="Enter your current password"
                                            required
                                        />
                                        {deleteError && <p className="text-xs text-rose-500 font-bold mt-1">{deleteError}</p>}
                                    </div>

                                    <DialogFooter className="gap-2 sm:gap-0">
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            onClick={() => {
                                                setDialogOpen(false);
                                                setDeletePassword('');
                                                setDeleteError('');
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button type="submit" variant="destructive" disabled={deleteProcessing} className="bg-rose-600 hover:bg-rose-700 font-bold">
                                            {deleteProcessing && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                                            Confirm Deletion
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>
        </SettingsLayout>
    );
}
