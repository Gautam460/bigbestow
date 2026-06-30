import React from 'react';
import GenericPage from '../components/GenericPage';

export default function Stores() {
    return (
        <GenericPage title="Store Locator">
            <p>Visit us in person to try on our latest collections.</p>
            <h3>New York Flagship</h3>
            <p>123 Fashion Ave<br/>New York, NY 10001<br/>Mon-Sat: 10AM - 8PM<br/>Sun: 11AM - 6PM</p>
            
            <h3>London Boutique</h3>
            <p>45 Oxford Street<br/>London, UK W1D 2DZ<br/>Mon-Sat: 9AM - 7PM<br/>Sun: 12PM - 6PM</p>
        </GenericPage>
    );
}
