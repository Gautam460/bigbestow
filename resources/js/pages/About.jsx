import React from 'react';
import EcommerceLayout from '../layouts/EcommerceLayout';
import { Head } from '@inertiajs/react';
import { Target, Users, Zap, Globe, CheckCircle2 } from 'lucide-react';

export default function About() {
    return (
        <EcommerceLayout>
            <Head title="About Us - Bigbestow" />
            
            {/* Hero Section */}
            <div className="relative bg-black text-white py-24 lg:py-32 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1920&q=80" 
                        alt="Team working" 
                        className="w-full h-full object-cover opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                </div>
                
                <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-6xl font-black mb-6">Redefining Shopping for the Modern World.</h1>
                    <p className="text-xl text-gray-300 leading-relaxed">
                        At Bigbestow, we believe that premium quality products should be accessible to everyone. We blend cutting-edge design with customer satisfaction to curate collections that inspire.
                    </p>
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-indigo-600 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-indigo-500">
                        <div>
                            <div className="text-4xl font-black mb-2">1M+</div>
                            <div className="text-indigo-200 font-medium uppercase tracking-wider text-sm">Happy Customers</div>
                        </div>
                        <div>
                            <div className="text-4xl font-black mb-2">50+</div>
                            <div className="text-indigo-200 font-medium uppercase tracking-wider text-sm">Cities & Regions</div>
                        </div>
                        <div>
                            <div className="text-4xl font-black mb-2">99%</div>
                            <div className="text-indigo-200 font-medium uppercase tracking-wider text-sm">Positive Feedback</div>
                        </div>
                        <div>
                            <div className="text-4xl font-black mb-2">24/7</div>
                            <div className="text-indigo-200 font-medium uppercase tracking-wider text-sm">Customer Support</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Our Values */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-black text-gray-900 mb-4">Our Core Values</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto">Everything we do is guided by these four principles.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
                        <div className="bg-white w-14 h-14 rounded-xl flex items-center justify-center shadow-sm mb-6">
                            <Target className="w-7 h-7 text-indigo-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Uncompromising Quality</h3>
                        <p className="text-gray-600">We source the finest materials and brands to ensure every product stands the test of time.</p>
                    </div>

                    <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
                        <div className="bg-white w-14 h-14 rounded-xl flex items-center justify-center shadow-sm mb-6">
                            <Users className="w-7 h-7 text-indigo-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Community First</h3>
                        <p className="text-gray-600">We listen to our customers. Your feedback directly shapes our catalog and deals.</p>
                    </div>

                    <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
                        <div className="bg-white w-14 h-14 rounded-xl flex items-center justify-center shadow-sm mb-6">
                            <Globe className="w-7 h-7 text-indigo-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Trust & Reliability</h3>
                        <p className="text-gray-600">We are committed to secure transactions, fast delivery, and honest customer policies.</p>
                    </div>

                    <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
                        <div className="bg-white w-14 h-14 rounded-xl flex items-center justify-center shadow-sm mb-6">
                            <Zap className="w-7 h-7 text-indigo-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Fast Innovation</h3>
                        <p className="text-gray-600">Shopping trends move fast, and so do we. We constantly update our store to match global styles.</p>
                    </div>
                </div>
            </div>

            {/* Story Section */}
            <div className="bg-white border-t border-gray-100 py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-16">
                    <div className="w-full md:w-1/2">
                        <img 
                            src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80" 
                            alt="Our story" 
                            className="rounded-3xl shadow-2xl"
                        />
                    </div>
                    <div className="w-full md:w-1/2 space-y-6">
                        <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 font-bold text-sm">Our Story</div>
                        <h2 className="text-4xl font-black text-gray-900">How it all started.</h2>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            Founded with a passion for excellence, Bigbestow began with a simple mission: to create the ultimate destination for top-notch lifestyle gear and everyday essentials. Since then, we've grown into a trusted e-commerce leader.
                        </p>
                        <ul className="space-y-4 mt-6">
                            <li className="flex items-center gap-3 text-gray-700 font-medium">
                                <CheckCircle2 className="w-5 h-5 text-indigo-600" /> Ethical sourcing from day one.
                            </li>
                            <li className="flex items-center gap-3 text-gray-700 font-medium">
                                <CheckCircle2 className="w-5 h-5 text-indigo-600" /> 100% Carbon neutral shipping.
                            </li>
                            <li className="flex items-center gap-3 text-gray-700 font-medium">
                                <CheckCircle2 className="w-5 h-5 text-indigo-600" /> Award-winning customer service.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </EcommerceLayout>
    );
}
