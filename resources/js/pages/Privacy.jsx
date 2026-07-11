import React from 'react';
import GenericPage from '../components/GenericPage';

export default function Privacy() {
    return (
        <GenericPage title="Privacy Policy">
            <p className="text-sm text-gray-500 mb-6">Last updated: January 1, 2026</p>
            <h3 className="text-xl font-bold text-gray-900 mt-6 mb-2">1. Information We Collect</h3>
            <p className="mb-4 text-black">We collect information to provide better services to our users. This includes basic details like your IP address, to more personalized details like which products you browse most often.</p>
            <h3 className="text-xl font-bold text-gray-900 mt-6 mb-2">2. How We Use Information</h3>
            <p className="mb-4 text-black">We use the information we collect to provide, maintain, protect and improve our services, to develop new ones, and to protect Bigbestow and our customers.</p>
            <h3 className="text-xl font-bold text-gray-900 mt-6 mb-2">3. Information Sharing</h3>
            <p className="mb-4 text-black">We do not share personal information with companies, organizations and individuals outside of Bigbestow unless one of the following circumstances applies: with your explicit consent, for legal compliance, or for secure payment fulfillment.</p>
        </GenericPage>
    );
}
