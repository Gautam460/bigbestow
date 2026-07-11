import React, { useState } from 'react';
import EcommerceLayout from '../layouts/EcommerceLayout';
import { Head } from '@inertiajs/react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Clock, MessageCircle } from 'lucide-react';

export default function Contact() {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <EcommerceLayout>
            <Head title="Contact Us - Bigbestow" />
            
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 py-16 text-white text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
                <div className="relative z-10 max-w-3xl mx-auto px-4">
                    <span className="bg-yellow-400 text-slate-950 text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full mb-4 inline-block">
                        We're Here To Help
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tight">
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
                            <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tight">Get in Touch</h2>
                            <p className="text-slate-600 mt-2 text-sm leading-relaxed">
                                Whether you're a professional cricketer or club player looking for custom willow profiles, or need assistance with your existing shipment, contact our support line directly.
                            </p>
                        </div>
                        
                        <div className="space-y-6">
                            <div className="flex items-start gap-4 p-5 rounded-2xl bg-indigo-50/70 border border-indigo-100/80 hover:shadow-md transition-all">
                                <div className="w-12 h-12 bg-indigo-600 text-white flex items-center justify-center rounded-xl shrink-0 shadow-lg shadow-indigo-600/20">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-900 uppercase text-xs tracking-wider">Contact Number</h4>
                                    <a href="tel:+919760132047" className="text-slate-900 font-extrabold text-lg mt-0.5 hover:text-indigo-600 transition-colors block">+91 97601 32047</a>
                                    <p className="text-slate-500 text-xs mt-0.5">Helpline (Mon - Sat, 9:00 AM - 8:00 PM)</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-5 rounded-2xl bg-green-50/70 border border-green-100/80 hover:shadow-md transition-all">
                                <div className="w-12 h-12 bg-green-500 text-white flex items-center justify-center rounded-xl shrink-0 shadow-lg shadow-green-500/20">
                                    <MessageCircle className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-900 uppercase text-xs tracking-wider">WhatsApp</h4>
                                    <a href="https://wa.me/919058160110" target="_blank" rel="noopener noreferrer" className="text-slate-900 font-extrabold text-lg mt-0.5 hover:text-green-600 transition-colors block">+91 90581 60110</a>
                                    <p className="text-slate-500 text-xs mt-0.5">Chat with us directly on WhatsApp</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:shadow-md transition-all">
                                <div className="w-12 h-12 bg-slate-900 text-white flex items-center justify-center rounded-xl shrink-0">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-900 uppercase text-xs tracking-wider">Official Email</h4>
                                    <a href="mailto:Bigbestow1999official@gmail.com" className="text-slate-900 font-bold text-sm mt-0.5 hover:text-indigo-600 transition-colors block break-all">Bigbestow1999official@gmail.com</a>
                                    <p className="text-slate-500 text-xs mt-0.5">24/7 Priority Support Response</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:shadow-md transition-all">
                                <div className="w-12 h-12 bg-yellow-500 text-slate-950 flex items-center justify-center rounded-xl shrink-0">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-900 uppercase text-xs tracking-wider">Registered Address</h4>
                                    <p className="text-slate-900 font-bold text-sm mt-0.5">Today Sports</p>
                                    <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">House No. 9, Madina Colony,<br />Char Khamba Ke Pas, Meerut,<br />Uttar Pradesh — 250002</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200/60 flex items-center gap-3.5">
                            <Clock className="w-6 h-6 text-amber-600 shrink-0" />
                            <p className="text-xs font-semibold text-amber-900 leading-snug">
                                <strong className="font-black uppercase block text-amber-950">Fast Turnaround</strong>
                                All inquiries and comments receive a direct reply from our equipment specialists within 2-4 business hours.
                            </p>
                        </div>
                    </div>

                    {/* Right Form Column */}
                    <div className="lg:col-span-7 bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-slate-200/80 relative">
                        {submitted ? (
                            <div className="py-12 text-center space-y-4 animate-in fade-in zoom-in duration-300">
                                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                                    <CheckCircle2 className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 uppercase italic">Comment Sent Successfully!</h3>
                                <p className="text-slate-600 max-w-md mx-auto text-sm">
                                    Thank you for contacting Bigbestow. We have received your comment and our support team will reach out to you shortly.
                                </p>
                                <button 
                                    onClick={() => setSubmitted(false)} 
                                    className="mt-4 px-6 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors uppercase tracking-wider"
                                >
                                    Send Another Comment
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="border-b border-slate-100 pb-4">
                                    <h3 className="text-xl font-black text-slate-900 uppercase italic">Send Us A Comment</h3>
                                    <p className="text-slate-500 text-xs mt-1">Fill out the form below with your inquiry or feedback.</p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">Your Full Name <span className="text-rose-500">*</span></label>
                                        <input 
                                            required
                                            type="text" 
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all" 
                                            placeholder="John Doe" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">Your Email Address <span className="text-rose-500">*</span></label>
                                        <input 
                                            required
                                            type="email" 
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all" 
                                            placeholder="john@example.com" 
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">Phone Number</label>
                                        <input 
                                            type="tel" 
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all" 
                                            placeholder="+91 / +1 ..." 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">Subject</label>
                                        <input 
                                            type="text" 
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all" 
                                            placeholder="Order Status / Custom Willow Inquiry" 
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">Comment <span className="text-rose-500">*</span></label>
                                    <textarea 
                                        required
                                        rows="5" 
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all resize-none" 
                                        placeholder="Write your comment, query, or customized equipment specification here..."
                                    ></textarea>
                                </div>

                                <button 
                                    type="submit" 
                                    className="w-full bg-indigo-600 text-white font-black py-4 rounded-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/25 flex items-center justify-center gap-2.5 text-sm uppercase tracking-wider"
                                >
                                    <Send className="w-4 h-4" /> Send Comment
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </EcommerceLayout>
    );
}
