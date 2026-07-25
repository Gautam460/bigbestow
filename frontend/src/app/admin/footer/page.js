'use client';

import React, { useState, useEffect } from 'react';
import { Head } from '@/lib/inertia-compat';
import { Settings, Save, Store, Mail, Phone, DollarSign, Truck, Loader2, MapPin, User, FileText, Hash, Instagram, Facebook, Globe, Video } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

const InputField = ({ label, icon: Icon, type = 'text', value, onChange, placeholder }) => (
    <div>
        <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
            {Icon && <Icon className="w-4 h-4 text-emerald-400" />} {label}
        </label>
        <input
            type={type}
            value={value || ''}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 placeholder-slate-400 dark:placeholder-slate-600"
        />
    </div>
);

const TextAreaField = ({ label, icon: Icon, value, onChange, placeholder, rows = 3 }) => (
    <div>
        <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
            {Icon && <Icon className="w-4 h-4 text-emerald-400" />} {label}
        </label>
        <textarea
            rows={rows}
            value={value || ''}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 placeholder-slate-400 dark:placeholder-slate-600 resize-none"
        />
    </div>
);

const SectionHeader = ({ icon: Icon, title, subtitle, color = 'text-emerald-400' }) => (
    <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-700 mb-6">
        <div className="p-2.5 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-xl">
            <Icon className={`w-5 h-5 ${color}`} />
        </div>
        <div>
            <h3 className="font-black text-slate-900 dark:text-white text-base uppercase tracking-tight">{title}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">{subtitle}</p>
        </div>
    </div>
);

export default function AdminFooterPage() {
    const [settings, setSettings] = useState({
        store_name: '',
        support_email: '',
        support_phone: '',
        currency: '',
        tax_rate: '',
        free_shipping_threshold: '',
        footer_trade_name: '',
        footer_proprietor: '',
        footer_gstin: '',
        footer_address: '',
        footer_description: '',
        footer_youtube: '',
        footer_instagram: '',
        footer_facebook: '',
        footer_google: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const set = (key) => (e) => setSettings(prev => ({ ...prev, [key]: e.target.value }));

    useEffect(() => {
        const loadSettings = async () => {
            setLoading(true);
            try {
                const res = await api.get('/api/admin/settings').catch(() => null);
                if (res && typeof res === 'object') {
                    setSettings(prev => ({ ...prev, ...(res.data || res) }));
                }
            } finally {
                setLoading(false);
            }
        };
        loadSettings();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.put('/api/admin/settings', settings);
            toast.success('Settings saved successfully!');
        } catch (err) {
            toast.error('Failed to save settings.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="p-16 flex justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
            </div>
        );
    }

    return (
        <div className="space-y-8 p-6 text-slate-900 dark:text-slate-100 max-w-4xl mx-auto">
            <Head title="Footer & Branding | Admin Portal" />

            <form onSubmit={handleSave} className="space-y-8">


                <div id="footer" className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden scroll-mt-24">
                    <div className="p-6 sm:p-8 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50">
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                            <Globe className="text-indigo-400 w-6 h-6" /> Footer <span className="text-indigo-400">Content</span>
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">This info appears in the website footer — Trade Name, GSTIN, Address & Social Links.</p>
                    </div>

                    <div className="p-6 sm:p-8 space-y-8">

                        {/* Business Details */}
                        <div>
                            <SectionHeader icon={FileText} title="Business Details" subtitle="Legal business information displayed in the footer" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <InputField label="Trade Name" icon={Store} value={settings.footer_trade_name} onChange={set('footer_trade_name')} placeholder="Today Sports" />
                                <InputField label="Proprietor Name" icon={User} value={settings.footer_proprietor} onChange={set('footer_proprietor')} placeholder="Danish" />
                                <InputField label="GSTIN" icon={Hash} value={settings.footer_gstin} onChange={set('footer_gstin')} placeholder="09CPZPD0890P1ZV" />
                            </div>
                            <div className="mt-6">
                                <TextAreaField
                                    label="Business Address"
                                    icon={MapPin}
                                    value={settings.footer_address}
                                    onChange={set('footer_address')}
                                    placeholder="House No. 1053, Madina Colony, Char Khamba Ke Pas, Meerut, UP — 250002"
                                    rows={2}
                                />
                            </div>
                            <div className="mt-6">
                                <TextAreaField
                                    label="Footer Description"
                                    icon={FileText}
                                    value={settings.footer_description}
                                    onChange={set('footer_description')}
                                    placeholder="A short tagline or description for the footer..."
                                    rows={3}
                                />
                            </div>
                        </div>

                        {/* Social Media */}
                        <div>
                            <SectionHeader icon={Globe} title="Social Media Links" subtitle="Full URLs for your social media profiles" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <InputField label="YouTube URL" icon={Video} value={settings.footer_youtube} onChange={set('footer_youtube')} placeholder="https://youtube.com/@yourstore" />
                                <InputField label="Instagram URL" icon={Instagram} value={settings.footer_instagram} onChange={set('footer_instagram')} placeholder="https://instagram.com/yourstore" />
                                <InputField label="Facebook URL" icon={Facebook} value={settings.footer_facebook} onChange={set('footer_facebook')} placeholder="https://facebook.com/yourstore" />
                                <InputField label="Google URL" icon={Globe} value={settings.footer_google} onChange={set('footer_google')} placeholder="https://g.page/yourstore" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-10 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl text-sm flex items-center gap-2.5 shadow-lg shadow-emerald-500/20 transition-all"
                    >
                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        Save All Settings
                    </button>
                </div>
            </form>
        </div>
    );
}
