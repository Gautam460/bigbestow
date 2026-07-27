'use client';

import React, { useState, useEffect } from 'react';
import EcommerceLayout from '@/layouts/EcommerceLayout';
import { Head } from '@/lib/inertia-compat';
import { Search, Loader2 } from 'lucide-react';
import api from '@/lib/api';

export default function TrackPage() {
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPage = async () => {
            try {
                const res = await api.get('/api/pages/track');
                setPageData(res.data);
            } catch (err) {
                console.error('Failed to fetch track page', err);
            } finally {
                setLoading(false);
            }
        };
        fetchPage();
    }, []);

    return (
        <EcommerceLayout>
            <Head title={pageData?.meta_title || "Track Order - Bigbestow"} />
            <div className="max-w-2xl mx-auto px-4 py-32 min-h-[60vh] text-center">
                {loading ? (
                    <div className="flex justify-center items-center h-24 mb-6">
                        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                    </div>
                ) : pageData?.content ? (
                    <div dangerouslySetInnerHTML={{ __html: pageData.content }} />
                ) : (
                    <>
                        <h1 className="text-4xl font-black text-gray-900 mb-6">Track Your Order</h1>
                        <p className="text-gray-600 mb-8">Enter your order number and email address below to see the current status of your shipment.</p>
                    </>
                )}
                
                <form className="space-y-4 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Order Number (e.g. ORD-12345)" />
                    <input type="email" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Email Address" />
                    <button type="button" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 flex justify-center items-center gap-2">
                        <Search className="w-5 h-5"/> Track Order
                    </button>
                </form>
            </div>
        </EcommerceLayout>
    );
}
