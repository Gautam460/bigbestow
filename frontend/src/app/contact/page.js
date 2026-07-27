'use client';

import React, { useState } from 'react';
import EcommerceLayout from '@/layouts/EcommerceLayout';
import { Head } from '@/lib/inertia-compat';
import { Mail, Phone, MapPin, Send, CheckCircle2, Clock, MessageCircle, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        comment: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/api/contact', formData);
            setSubmitted(true);
            setFormData({ name: '', email: '', phone: '', subject: '', comment: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send comment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <EcommerceLayout>
            <Head title="Contact Us - Bigbestow" />

            {/* Header Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 py-16 text-white text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
                <div className="relative z-10 max-w-3xl mx-auto px-4">
                    <span className="bg-yellow-400 text-slate-950 text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full mb-4 inline-block">
                        We&apos;re Here To Help
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black italic tracking-tight">
                        Contact <span className="text-yellow-400">Bigbestow</span>
                    </h1>
                    <p className="text-slate-300 mt-4 text-base md:text-lg">
                        Have questions about our professional English & Kashmir willow cricket equipment or order status? Reach out to our dedicated expert support team.
                    </p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                    {/* Left Info Column */}
                    <div className="lg:col-span-5 space-y-8">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic tracking-tight">Get in Touch</h2>
                            <p className="text-slate-600 dark:text-slate-300 mt-2 text-sm leading-relaxed">
                                Whether you're a professional cricketer or club player looking for custom willow profiles, or need assistance with your existing shipment, contact our support line directly.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-white dark:bg-slate-800/5 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white dark:bg-slate-800/10 transition-all">
                                <div className="w-12 h-12 bg-indigo-600 text-white flex items-center justify-center rounded-xl shrink-0 shadow-lg shadow-indigo-600/20">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-900 dark:text-slate-300 uppercase text-xs tracking-wider">Contact Number</h4>
                                    <a href="tel:+919760132047" className="text-slate-900 dark:text-white font-extrabold text-lg mt-0.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors block">+91 97601 32047</a>
                                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Helpline (Mon - Sat, 9:00 AM - 8:00 PM)</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-white dark:bg-slate-800/5 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white dark:bg-slate-800/10 transition-all">
                                <div className="w-12 h-12 bg-green-500 text-white flex items-center justify-center rounded-xl shrink-0 shadow-lg shadow-green-500/20">
                                    <MessageCircle className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-900 dark:text-slate-300 uppercase text-xs tracking-wider">WhatsApp</h4>
                                    <a href="https://wa.me/919058160110" target="_blank" rel="noopener noreferrer" className="text-slate-900 dark:text-white font-extrabold text-lg mt-0.5 hover:text-green-600 dark:hover:text-green-400 transition-colors block">+91 90581 60110</a>
                                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Chat with us directly on WhatsApp</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-white dark:bg-slate-800/5 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white dark:bg-slate-800/10 transition-all">
                                <div className="w-12 h-12 bg-slate-900 dark:bg-slate-700 text-white flex items-center justify-center rounded-xl shrink-0">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-900 dark:text-slate-300 uppercase text-xs tracking-wider">Official Email</h4>
                                    <a href="mailto:Bigbestow1999official@gmail.com" className="text-slate-900 dark:text-white font-bold text-sm mt-0.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors block break-all">Bigbestow1999official@gmail.com</a>
                                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">24/7 Priority Support Response</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-white dark:bg-slate-800/5 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white dark:bg-slate-800/10 transition-all">
                                <div className="w-12 h-12 bg-yellow-500 text-slate-950 flex items-center justify-center rounded-xl shrink-0">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-900 dark:text-slate-300 uppercase text-xs tracking-wider">Registered Address</h4>
                                    <p className="text-slate-900 dark:text-white font-bold text-sm mt-0.5">Today Sports</p>
                                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5 leading-relaxed">House No. 1053, Madina Colony,<br />Char Khamba Ke Pas, Meerut,<br />Uttar Pradesh — 250002</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 flex items-center gap-3.5">
                            <Clock className="w-6 h-6 text-amber-600 dark:text-amber-500 shrink-0" />
                            <p className="text-xs font-semibold text-amber-900 dark:text-amber-100 leading-snug">
                                <strong className="font-black uppercase block text-amber-950 dark:text-amber-400">Fast Turnaround</strong>
                                All inquiries and comments receive a direct reply from our equipment specialists within 2-4 business hours.
                            </p>
                        </div>
                    </div>

                    {/* Right Form Column */}
                    <div className="lg:col-span-7 bg-white dark:bg-slate-800/80 p-8 md:p-10 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 relative">
                        {submitted ? (
                            <div className="py-12 text-center space-y-4 animate-in fade-in zoom-in duration-300">
                                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                                    <CheckCircle2 className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic">Comment Sent Successfully!</h3>
                                <p className="text-slate-600 dark:text-slate-300 max-w-md mx-auto text-sm">
                                    Thank you for contacting Bigbestow. We have received your comment and our support team will reach out to you shortly.
                                </p>
                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="mt-4 px-6 py-2.5 bg-slate-900 dark:bg-slate-700 text-white font-bold text-xs rounded-xl hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors uppercase tracking-wider"
                                >
                                    Send Another Comment
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="border-b border-slate-100 dark:border-slate-700 pb-4">
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase italic">Send Us A Comment</h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Fill out the form below with your inquiry or feedback.</p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Your Full Name <span className="text-rose-500">*</span></label>
                                        <input
                                            required
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder-slate-400 dark:placeholder-slate-500"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Your Email Address <span className="text-rose-500">*</span></label>
                                        <input
                                            required
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder-slate-400 dark:placeholder-slate-500"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Phone Number</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder-slate-400 dark:placeholder-slate-500"
                                            placeholder="+91 / +1 ..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Subject</label>
                                        <input
                                            type="text"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder-slate-400 dark:placeholder-slate-500"
                                            placeholder="Order Status / Custom Willow Inquiry"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Comment <span className="text-rose-500">*</span></label>
                                    <textarea
                                        required
                                        rows="5"
                                        name="comment"
                                        value={formData.comment}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none placeholder-slate-400 dark:placeholder-slate-500"
                                        placeholder="Write your comment, query, or customized equipment specification here..."
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-indigo-600 text-white font-black py-4 rounded-xl hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/25 flex items-center justify-center gap-2.5 text-sm uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                    {loading ? 'Sending...' : 'Send Comment'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </EcommerceLayout>
    );
}
