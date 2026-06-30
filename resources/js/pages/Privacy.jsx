import React from 'react';
import GenericPage from '../components/GenericPage';

export default function Privacy() {
    return (
        <GenericPage title="Privacy Policy">
            <p>Last updated: January 1, 2026</p>
            <h3>1. Information We Collect</h3>
            <p>We collect information to provide better services to our users. This includes basic stuff like your IP address, to more complex things like which products you browse most often.</p>
            <h3>2. How We Use Information</h3>
            <p>We use the information we collect to provide, maintain, protect and improve our services, to develop new ones, and to protect ShopStyle and our users.</p>
            <h3>3. Information Sharing</h3>
            <p>We do not share personal information with companies, organizations and individuals outside of ShopStyle unless one of the following circumstances applies: with your consent, for legal reasons, or with domain administrators.</p>
        </GenericPage>
    );
}
