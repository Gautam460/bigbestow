import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import EcommerceLayout from '../layouts/EcommerceLayout';
import { Filter, Heart, Search, ShoppingBag } from 'lucide-react';

export default function Products({ products = [], categories = [], filters = {} }) {
    const [activeCategorySlug, setActiveCategorySlug] = useState(filters.category || 'all');
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    const handleCategoryFilter = (slug) => {
        setActiveCategorySlug(slug);
        if (slug === 'all') {
            router.get('/products', { search: searchTerm }, { preserveState: true, replace: true });
        } else {
            router.get('/products', { category: slug, search: searchTerm }, { preserveState: true, replace: true });
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const query = {};
        if (activeCategorySlug !== 'all') query.category = activeCategorySlug;
        if (searchTerm) query.search = searchTerm;
        router.get('/products', query, { preserveState: true });
    };

    return (
        <EcommerceLayout>
            <Head title="Explore Cricket Bats & Gear - BigBestow" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumbs */}
                <div className="text-sm text-gray-500 mb-6">
                    <Link href="/" className="hover:text-indigo-600">Home</Link> / <span className="text-gray-900 font-medium">Products Catalog</span>
                </div>

                {/* Filter and Search Bar */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 flex flex-col lg:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0">
                        <span className="font-bold flex items-center gap-1.5 text-gray-700 whitespace-nowrap">
                            <Filter className="w-4 h-4 text-indigo-600"/> Categories:
                        </span>
                        <button 
                            onClick={() => handleCategoryFilter('all')}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeCategorySlug === 'all' ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            All Gear ({products.length})
                        </button>
                        {categories.map(cat => (
                            <button 
                                key={cat.id}
                                onClick={() => handleCategoryFilter(cat.slug)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeCategorySlug === cat.slug ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                                {cat.name} {cat.products_count !== undefined ? `(${cat.products_count})` : ''}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSearch} className="relative w-full lg:w-72">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                    </form>
                </div>

                {/* Dynamic Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products && products.length > 0 ? (
                        products.map(product => (
                            <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
                                <div>
                                    <div className="relative h-64 overflow-hidden bg-gray-100">
                                        <img 
                                            src={product.image || 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=800&q=80'} 
                                            alt={product.name} 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-sm hover:text-rose-500 transition-colors">
                                            <Heart className="w-4 h-4" />
                                        </div>
                                        {product.stock <= 5 && product.stock > 0 && (
                                            <div className="absolute bottom-2 left-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                                                Only {product.stock} left!
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <div className="text-xs font-bold tracking-wide text-indigo-600 mb-1 uppercase">
                                            {product.category?.name || 'Equipment'}
                                        </div>
                                        <h3 className="font-bold text-gray-800 mb-1 truncate text-lg">{product.name}</h3>
                                        <p className="text-xs text-gray-500 line-clamp-2 mb-3">{product.description}</p>
                                    </div>
                                </div>
                                <div className="p-4 pt-0">
                                    <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                                        <span className="text-xl font-black text-gray-900">${product.price}</span>
                                        <Link href="/cart" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors flex items-center gap-1.5 shadow-md shadow-indigo-600/20">
                                            <ShoppingBag className="w-4 h-4" /> Add
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-4 text-center py-20 bg-white rounded-xl border mt-4">
                            <h3 className="text-xl font-bold text-gray-600 mb-2">No cricket gear found matching your criteria.</h3>
                            <p className="text-gray-400 text-sm">Try selecting a different category or clearing your search query.</p>
                            <button 
                                onClick={() => { setActiveCategorySlug('all'); setSearchTerm(''); router.get('/products'); }} 
                                className="mt-4 px-6 py-2 bg-indigo-600 text-white font-bold rounded-full text-sm hover:bg-indigo-700 transition-colors"
                            >
                                Reset Filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </EcommerceLayout>
    );
}
