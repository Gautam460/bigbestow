import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import EcommerceLayout from '../layouts/EcommerceLayout';
import { Filter, ChevronDown, Heart } from 'lucide-react';

const DUMMY_PRODUCTS = [
    { id: 1, name: "Classic White T-Shirt", category: "Men's Fashion", price: 25, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=500&q=80" },
    { id: 2, name: "Denim Jeans", category: "Men's Fashion", price: 60, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=500&q=80" },
    { id: 3, name: "Running Sneakers", category: "Sports", price: 120, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80" },
    { id: 4, name: "Leather Jacket", category: "Men's Fashion", price: 199, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=500&q=80" },
    { id: 5, name: "Summer Floral Dress", category: "Women's Fashion", price: 45, image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=500&q=80" },
    { id: 6, name: "Wireless Headphones", category: "Electronics", price: 150, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80" },
    { id: 7, name: "Winter Coat", category: "Women's Fashion", price: 180, image: "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?auto=format&fit=crop&w=500&q=80" },
    { id: 8, name: "Discounted Watch", category: "Sale", price: 99, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80" },
];

export default function Products() {
    const [activeCategory, setActiveCategory] = useState("All");

    useEffect(() => {
        // Read URL parameter to set initial category
        const params = new URLSearchParams(window.location.search);
        const catParam = params.get('category');
        
        if (catParam) {
            if (catParam === 'men') setActiveCategory("Men's Fashion");
            else if (catParam === 'women') setActiveCategory("Women's Fashion");
            else if (catParam === 'electronics') setActiveCategory("Electronics");
            else if (catParam === 'sale') setActiveCategory("Sale");
            else if (catParam === 'sports') setActiveCategory("Sports");
        }
    }, []);

    const categories = ["All", "Men's Fashion", "Women's Fashion", "Electronics", "Sports", "Sale"];

    const filteredProducts = activeCategory === "All" 
        ? DUMMY_PRODUCTS 
        : DUMMY_PRODUCTS.filter(p => p.category === activeCategory);

    return (
        <EcommerceLayout>
            <Head title="Products - ShopStyle" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumbs */}
                <div className="text-sm text-gray-500 mb-6">
                    Home / <span className="text-gray-900 font-medium">Products</span>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto hide-scrollbar">
                        <span className="font-bold flex items-center gap-2"><Filter className="w-5 h-5"/> Filters:</span>
                        {categories.map(cat => (
                            <button 
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeCategory === cat ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                    
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <span className="text-sm text-gray-500 whitespace-nowrap">{filteredProducts.length} items found</span>
                        <select className="border rounded-md px-3 py-1.5 text-sm bg-white outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-auto">
                            <option>Sort by: Featured</option>
                            <option>Price: Low to High</option>
                            <option>Price: High to Low</option>
                            <option>Newest Arrivals</option>
                        </select>
                    </div>
                </div>

                {/* Product Grid - Full Width */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredProducts.map(product => (
                        <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group cursor-pointer hover:shadow-lg transition-all duration-300">
                            <div className="relative h-64 overflow-hidden bg-gray-100">
                                <img 
                                    src={product.image} 
                                    alt={product.name} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-sm hover:text-rose-500 transition-colors">
                                    <Heart className="w-4 h-4" />
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="text-xs font-semibold tracking-wide text-indigo-500 mb-1 uppercase">{product.category}</div>
                                <h3 className="font-bold text-gray-800 mb-2 truncate text-lg">{product.name}</h3>
                                <div className="flex justify-between items-center mt-3">
                                    <span className="text-xl font-black text-gray-900">${product.price}</span>
                                    <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-600 transition-colors">
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                {filteredProducts.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-xl border mt-8">
                        <h3 className="text-xl font-bold text-gray-500">No products found in this category.</h3>
                    </div>
                )}
            </div>
        </EcommerceLayout>
    );
}
