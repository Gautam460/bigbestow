import React from 'react';
import EcommerceLayout from '../layouts/EcommerceLayout';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Star, TrendingUp, Truck, Shield, Clock, ShoppingBag, Trophy } from 'lucide-react';

const FEATURED_PRODUCTS = [
    { id: 1, name: "SS Master English Willow Bat", category: "English Willow", price: 299, rating: 4.8, image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=800&q=80" },
    { id: 2, name: "MRF Genius Grand Edition", category: "English Willow", price: 349, rating: 4.9, image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=800&q=80" },
    { id: 3, name: "SG Scorer Kashmir Willow", category: "Kashmir Willow", price: 85, rating: 4.7, image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=800&q=80" },
    { id: 4, name: "DSC Intense English Willow", category: "English Willow", price: 279, rating: 4.6, image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=800&q=80" },
];

const CATEGORIES = [
    { name: "English Willow", image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=600&q=80", link: "/products?category=english-willow" },
    { name: "Kashmir Willow", image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=600&q=80", link: "/products?category=kashmir-willow" },
    { name: "Cricket Gear", image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=600&q=80", link: "/products?category=cricket-gear" },
];

export default function Home() {
    return (
        <EcommerceLayout>
            <Head title="Premium Cricket Bats & Equipment - BigBestow" />
            
            {/* 1. Stunning Hero Section */}
            <div className="relative bg-gray-900 text-white overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=1920&q=80" 
                        alt="Cricket field background" 
                        className="w-full h-full object-cover opacity-30 scale-105 transform transition-transform duration-[10s]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/70 to-transparent"></div>
                </div>
                
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-48 flex flex-col items-start justify-center min-h-[85vh]">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 font-semibold text-sm mb-6 backdrop-blur-sm">
                        🏏 Official Equipment for Champions
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6 max-w-3xl">
                        Power. Precision. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">BigBestow Performance.</span>
                    </h1>
                    <p className="text-xl text-gray-300 mb-10 max-w-xl leading-relaxed">
                        Hand-selected English and Kashmir Willow bats crafted for the modern cricketer. Elevate your game with professional-grade gear.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link href="/products" className="group flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-indigo-700 transition-all duration-300 shadow-xl shadow-indigo-600/30">
                            Shop Cricket Bats
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link href="/about" className="px-8 py-4 rounded-full font-bold text-lg text-white border border-white/30 hover:bg-white/10 backdrop-blur-sm transition-all duration-300">
                            Our Willow Selection
                        </Link>
                    </div>
                </div>
            </div>

            {/* 2. Trust Badges */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gray-100">
                        <div className="flex flex-col items-center justify-center pt-4 md:pt-0 group">
                            <div className="bg-indigo-50 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300 group-hover:bg-indigo-100">
                                <Trophy className="w-8 h-8 text-indigo-600" />
                            </div>
                            <h3 className="font-bold text-gray-900 text-lg">Pro Grade Quality</h3>
                            <p className="text-gray-500 text-sm mt-1">Tested by professional players</p>
                        </div>
                        <div className="flex flex-col items-center justify-center pt-8 md:pt-0 group">
                            <div className="bg-indigo-50 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300 group-hover:bg-indigo-100">
                                <Shield className="w-8 h-8 text-indigo-600" />
                            </div>
                            <h3 className="font-bold text-gray-900 text-lg">100% Genuine Willow</h3>
                            <p className="text-gray-500 text-sm mt-1">Authenticity guaranteed</p>
                        </div>
                        <div className="flex flex-col items-center justify-center pt-8 md:pt-0 group">
                            <div className="bg-indigo-50 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300 group-hover:bg-indigo-100">
                                <Truck className="w-8 h-8 text-indigo-600" />
                            </div>
                            <h3 className="font-bold text-gray-900 text-lg">Worldwide Shipping</h3>
                            <p className="text-gray-500 text-sm mt-1">Delivered to your doorstep</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Interactive Categories */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">Shop by Category</h2>
                        <p className="text-gray-500">The finest willows for every level of play</p>
                    </div>
                    <Link href="/products" className="hidden md:flex items-center gap-2 font-bold text-indigo-600 hover:text-indigo-800 transition-colors group">
                        View All Gear <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {CATEGORIES.map((category, idx) => (
                        <Link key={idx} href={category.link} className="relative h-[400px] rounded-2xl overflow-hidden group cursor-pointer shadow-lg block">
                            <img 
                                src={category.image} 
                                alt={category.name} 
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                            <div className="absolute bottom-0 left-0 p-8 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                <h3 className="text-2xl font-bold text-white mb-2">{category.name}</h3>
                                <div className="flex items-center gap-2 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                    <span className="font-medium">Explore Range</span>
                                    <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* 4. Featured Products Grid */}
            <div className="bg-gray-50 py-24 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm mb-4">
                            <TrendingUp className="w-4 h-4" /> Most Popular
                        </div>
                        <h2 className="text-4xl font-black text-gray-900">Featured Cricket Bats</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {FEATURED_PRODUCTS.map(product => (
                            <div key={product.id} className="bg-white rounded-2xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-shadow duration-300 group cursor-pointer relative overflow-hidden">
                                <div className="relative h-64 rounded-xl overflow-hidden mb-4 bg-gray-100">
                                    <img 
                                        src={product.image} 
                                        alt={product.name} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out bg-gradient-to-t from-black/60 to-transparent">
                                        <button className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-colors shadow-lg flex items-center justify-center gap-2">
                                            <ShoppingBag className="w-4 h-4" /> Quick Add
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="text-xs font-bold text-indigo-500 uppercase tracking-wider">{product.category}</div>
                                        <div className="flex items-center gap-1 bg-yellow-100/50 px-2 py-0.5 rounded text-xs font-bold text-yellow-700">
                                            <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" /> {product.rating}
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-gray-900 mb-1 text-lg leading-tight line-clamp-1">{product.name}</h3>
                                    <div className="text-xl font-black text-gray-900">${product.price}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            {/* 5. Promotional Newsletter Banner */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl overflow-hidden shadow-2xl relative">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 blur-[100px] rounded-full"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-500/10 blur-[100px] rounded-full"></div>
                    
                    <div className="relative z-10 px-6 py-16 md:py-24 text-center max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-4">Join The BigBestow Team</h2>
                        <p className="text-indigo-200 text-lg mb-8">Sign up for exclusive offers, pro-tips, and first access to our new bat collections.</p>
                        
                        <form className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
                            <input 
                                type="email" 
                                placeholder="Enter your email" 
                                className="flex-grow px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 backdrop-blur-md"
                            />
                            <button type="button" className="px-8 py-4 bg-white text-indigo-900 font-bold rounded-full hover:bg-indigo-50 transition-colors shadow-lg whitespace-nowrap">
                                Join Now
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </EcommerceLayout>
    );
}
