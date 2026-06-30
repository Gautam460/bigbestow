import React from 'react';
import EcommerceLayout from '../layouts/EcommerceLayout';
import { Head } from '@inertiajs/react';
import { RefreshCcw } from 'lucide-react';

export default function Returns() {
    return (
        <EcommerceLayout>
            <Head title="Returns & Exchanges - ShopStyle" />
            <div className="max-w-3xl mx-auto px-4 py-20 min-h-[60vh]">
                <div className="text-center mb-12">
                    <RefreshCcw className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                    <h1 className="text-4xl font-black text-gray-900">Returns & Exchanges</h1>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 prose prose-indigo">
                    <h3>30-Day Return Policy</h3>
                    <p>We want you to love what you ordered. If you're not completely satisfied, you can return most items within 30 days of receipt for a refund or exchange.</p>
                    
                    <h3>How to Return an Item</h3>
                    <ol className="space-y-2 mt-4 text-gray-600">
                        <li>Log into your account and navigate to Order History.</li>
                        <li>Select the item(s) you wish to return and state the reason.</li>
                        <li>Print the prepaid return shipping label.</li>
                        <li>Pack your items securely and attach the label.</li>
                        <li>Drop off the package at any authorized shipping center.</li>
                    </ol>
                </div>
            </div>
        </EcommerceLayout>
    );
}
