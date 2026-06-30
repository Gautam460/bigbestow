import React from 'react';
import EcommerceLayout from '../layouts/EcommerceLayout';
import { Head } from '@inertiajs/react';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Contact() {
    return (
        <EcommerceLayout>
            <Head title="Contact Us - ShopStyle" />
            <div className="max-w-5xl mx-auto px-4 py-20">
                <h1 className="text-4xl font-black text-center text-gray-900 mb-12">Contact Us</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-8">
                        <h2 className="text-2xl font-bold text-gray-900">Get in touch</h2>
                        <p className="text-gray-600">Have a question? Our team is here to help. Fill out the form or reach out via our contact channels.</p>
                        
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 text-gray-700">
                                <div className="w-12 h-12 bg-indigo-50 flex items-center justify-center rounded-full text-indigo-600"><Phone className="w-5 h-5"/></div>
                                <div><div className="font-bold">Phone</div><div>1-800-123-4567</div></div>
                            </div>
                            <div className="flex items-center gap-4 text-gray-700">
                                <div className="w-12 h-12 bg-indigo-50 flex items-center justify-center rounded-full text-indigo-600"><Mail className="w-5 h-5"/></div>
                                <div><div className="font-bold">Email</div><div>support@shopstyle.com</div></div>
                            </div>
                            <div className="flex items-center gap-4 text-gray-700">
                                <div className="w-12 h-12 bg-indigo-50 flex items-center justify-center rounded-full text-indigo-600"><MapPin className="w-5 h-5"/></div>
                                <div><div className="font-bold">Headquarters</div><div>123 Fashion Ave, NY 10001</div></div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Name</label>
                                <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="John Doe" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                                <input type="email" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="john@example.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Message</label>
                                <textarea rows="4" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="How can we help you?"></textarea>
                            </div>
                            <button className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-colors">
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </EcommerceLayout>
    );
}
