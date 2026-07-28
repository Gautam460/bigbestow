'use client';

import React, { useState, useEffect } from 'react';
import EcommerceLayout from '@/layouts/EcommerceLayout';
import { Head } from '@/lib/inertia-compat';
import api from '@/lib/api';
import { Loader2 } from 'lucide-react';

export default function FAQPage() {
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPage = async () => {
            try {
                const res = await api.get('/api/pages/faq');
                setPageData(res);
            } catch (err) {
                console.error('Failed to fetch faq page', err);
            } finally {
                setLoading(false);
            }
        };
        fetchPage();
    }, []);

    return (
        <EcommerceLayout>
            <Head title={pageData?.meta_title || "FAQ - Bigbestow"} />
            <div className="max-w-3xl mx-auto px-4 py-20 min-h-[60vh]">
                {loading ? (
                    <div className="flex justify-center items-center h-48">
                        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                    </div>
                ) : pageData?.content ? (
                    <div className="prose prose-indigo max-w-none dark:prose-invert p-6 sm:p-10 mx-auto"
                    dangerouslySetInnerHTML={{ __html: pageData.content }} />
                ) : (
                    <div className="text-center">
                        <p>Content is being updated. Please check back later.</p>
                    </div>
                )}
            </div>
        </EcommerceLayout>
    );
}
