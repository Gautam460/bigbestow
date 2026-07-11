import React from 'react';
import GenericPage from '../components/GenericPage';

export default function Terms() {
    return (
        <GenericPage title="Terms of Service">
            <p className="text-sm text-gray-500 mb-6">Last updated: January 1, 2026</p>
            <h3 className="text-xl font-bold text-gray-900 mt-6 mb-2">1. Introduction</h3>
            <p className="mb-4 text-black">Welcome to Bigbestow. By accessing our website, you agree to these Terms of Service. Please read them carefully.</p>
            <h3 className="text-xl font-bold text-gray-900 mt-6 mb-2">2. Use of Our Service</h3>
            <p className="mb-4 text-black">You may use our service only as permitted by law. We may suspend or stop providing our service to you if you do not comply with our terms or policies.</p>
            <h3 className="text-xl font-bold text-gray-900 mt-6 mb-2">3. Purchases</h3>
            <p className="mb-4 text-black">If you wish to purchase any product made available through the service, you may be asked to supply certain information relevant to your purchase.</p>
        </GenericPage>
    );
}
