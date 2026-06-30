import React from 'react';
import EcommerceLayout from '../layouts/EcommerceLayout';
import { Head } from '@inertiajs/react';

export default function GenericPage({ title, children }) {
    return (
        <EcommerceLayout>
            <Head title={`${title} - ShopStyle`} />
            <div className="max-w-4xl mx-auto px-4 py-20 min-h-[60vh]">
                <h1 className="text-4xl font-black text-gray-900 mb-10 text-center">{title}</h1>
                <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 prose prose-indigo max-w-none">
                    {children}
                </div>
            </div>
        </EcommerceLayout>
    );
}
