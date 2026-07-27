'use client';

import React, { useState, useEffect } from 'react';
import EcommerceLayout from '@/layouts/EcommerceLayout';
import { Head } from '@/lib/inertia-compat';
import api from '@/lib/api';
import { Loader2 } from 'lucide-react';

export default function AboutPage() {
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPage = async () => {
            try {
                const res = await api.get('/api/pages/about');
                setPageData(res.data);
            } catch (err) {
                console.error('Failed to fetch about page content', err);
            } finally {
                setLoading(false);
            }
        };
        fetchPage();
    }, []);

    return (
        <EcommerceLayout>
            <Head title={pageData?.meta_title || "About Us - Bigbestow"} />
            
            {loading ? (
                <div className="flex justify-center items-center h-48 py-24">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                </div>
            ) : pageData && pageData.content ? (
                <div 
                    dangerouslySetInnerHTML={{ __html: pageData.content }}
                />
            ) : (
                <div className="text-center text-slate-500 py-24">
                    <h1 className="text-3xl font-bold mb-4">{pageData?.title || 'About Us'}</h1>
                    <p>Content is being updated. Please check back later.</p>
                </div>
            )}
        </EcommerceLayout>
    );
}
