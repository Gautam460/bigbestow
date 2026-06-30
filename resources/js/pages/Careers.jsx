import React from 'react';
import GenericPage from '../components/GenericPage';

export default function Careers() {
    return (
        <GenericPage title="Careers at ShopStyle">
            <p className="lead">Join our mission to redefine modern fashion.</p>
            <h3>Open Positions</h3>
            <ul>
                <li><strong>Senior Frontend Engineer</strong> (React/Laravel) - Remote</li>
                <li><strong>Fashion Merchandise Planner</strong> - New York, NY</li>
                <li><strong>Customer Experience Specialist</strong> - Remote</li>
            </ul>
            <p>Don't see a role that fits? Send your resume to careers@shopstyle.com and we'll keep you in mind for future opportunities.</p>
        </GenericPage>
    );
}
