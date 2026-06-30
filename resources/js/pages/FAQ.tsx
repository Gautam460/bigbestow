import React from 'react';
import EcommerceLayout from '../layouts/EcommerceLayout';
import { Head } from '@inertiajs/react';
import { HelpCircle, ChevronDown } from 'lucide-react';

export default function FAQ() {
    const faqs = [
        { q: "What is your return policy?", a: "You can return any unworn, unwashed, or defective merchandise within 30 days of the order delivery date for a full refund." },
        { q: "Do you ship internationally?", a: "Yes, we ship to over 50 countries worldwide. Shipping costs will apply, and will be added at checkout." },
        { q: "How long will it take to get my order?", a: "It depends on where you are. Orders processed here will take 5-7 business days to arrive. Overseas deliveries can take anywhere from 7-16 days." },
        { q: "Can I cancel my order?", a: "Yes, if your order hasn't been shipped yet, please contact our customer service team immediately to cancel or modify your order." },
    ];

    return (
        <EcommerceLayout>
            <Head title="FAQ - ShopStyle" />
            <div className="max-w-3xl mx-auto px-4 py-20 min-h-[60vh]">
                <div className="text-center mb-12">
                    <HelpCircle className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                    <h1 className="text-4xl font-black text-gray-900">Frequently Asked Questions</h1>
                </div>
                <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <div key={idx} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 mb-2 flex justify-between items-center">
                                {faq.q}
                            </h3>
                            <p className="text-gray-600">{faq.a}</p>
                        </div>
                    ))}
                </div>
            </div>
        </EcommerceLayout>
    );
}
