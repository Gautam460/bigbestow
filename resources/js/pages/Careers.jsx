import React from 'react';
import GenericPage from '../components/GenericPage';

export default function Careers() {
    return (
        <GenericPage title="Careers at Bigbestow">
            <p className="text-lg text-gray-700 mb-6 font-medium">Join our mission to redefine modern shopping and lifestyle experiences.</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Open Positions</h3>
            <ul className="list-disc pl-6 space-y-3 mb-8 text-black">
                <li className="text-black"><strong className="font-semibold text-indigo-600">Senior Frontend Engineer</strong> (React/Laravel) - Remote</li>
                <li className="text-black"><strong className="font-semibold text-indigo-600">E-Commerce Category Manager</strong> - New Delhi, IN</li>
                <li className="text-black"><strong className="font-semibold text-indigo-600">Customer Experience Specialist</strong> - Remote</li>
            </ul>
            <p className="text-gray-800 mt-6">Don't see a role that fits? Send your resume to <a href="mailto:careers@bigbestow.com" className="text-indigo-600 font-bold underline hover:text-indigo-800">careers@bigbestow.com</a> and we'll keep you in mind for future opportunities.</p>
        </GenericPage>
    );
}
