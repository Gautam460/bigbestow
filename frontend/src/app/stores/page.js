'use client';

import React, { useState, useEffect } from 'react';
import GenericPage from '@/components/GenericPage';
import api from '@/lib/api';
import { Loader2 } from 'lucide-react';

export default function StoresPage() {
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPage = async () => {
            try {
                const res = await api.get('/api/pages/stores');
                setPageData(res.data);
            } catch (err) {
                console.error('Failed to fetch stores page', err);
            } finally {
                setLoading(false);
            }
        };
        fetchPage();
    }, []);

    if (loading) {
        return (
            <GenericPage title="Store Locator">
                <div className="flex justify-center items-center h-32">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                </div>
            </GenericPage>
        );
    }

    return (
        <GenericPage title={pageData?.title || "Store Locator"}>
            {pageData?.content ? (
                <div dangerouslySetInnerHTML={{ __html: pageData.content }} />
            ) : (
                <p>Content is being updated. Please check back later.</p>
            )}
        </GenericPage>
    );
}
