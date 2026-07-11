import React from 'react';
import GenericPage from '../components/GenericPage';

export default function Shipping() {
    return (
        <GenericPage title="Shipping Information">
            <h3>Standard Shipping</h3>
            <p>We offer free standard shipping on all orders over ₹5,000. For orders under ₹5,000, a flat rate of ₹250 applies. Standard shipping takes 5-7 business days.</p>
            <h3>Express Shipping</h3>
            <p>Need it faster? Select Express Shipping at checkout for ₹500. Your order will arrive in 2-3 business days.</p>
            <h3>International Shipping</h3>
            <p>We ship to over 50 countries globally. International shipping rates are calculated at checkout based on destination and package weight.</p>
        </GenericPage>
    );
}
