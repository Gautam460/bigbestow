import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import EcommerceLayout from '../layouts/EcommerceLayout';
import { Filter, Heart, Search, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { addToCart } from '../utils/cart';
import { toggleWishlist, getWishlist } from '../utils/wishlist';

export default function Products({ products = [], categories = [], filters = {} }) {
    const [activeCategorySlug, setActiveCategorySlug] = useState(filters.category || 'all');
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [wishlistIds, setWishlistIds] = useState([]);

    useEffect(() => {
        const updateWishlist = () => {
            setWishlistIds(getWishlist().map(item => item.id));
        };
        updateWishlist();
        window.addEventListener('wishlist-updated', updateWishlist);
        return () => window.removeEventListener('wishlist-updated', updateWishlist);
    }, []);

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
            <Head title="Explore Cricket Bats & Gear - Bigbestow" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumbs */}
                <div className="text-sm text-gray-500 mb-6">
                    <Link href="/" className="hover:text-indigo-600">Home</Link> / <span className="text-gray-900 font-medium">Products Catalog</span>
                </div>

                {/* Category Banner if a category is selected */}
                {(() => {
                    const selectedCat = categories.find(c => c.slug === activeCategorySlug || String(c.id) === String(activeCategorySlug));
                    if (selectedCat) {
                        return (
                            <div className="relative rounded-3xl overflow-hidden mb-8 shadow-xl bg-gray-900 h-48 md:h-60 flex items-center">
                                {selectedCat.image && (
                                    <img 
                                        src={selectedCat.image} 
                                        alt={selectedCat.name} 
                                        className="absolute inset-0 w-full h-full object-cover opacity-40"
                                    />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
                                <div className="relative z-10 px-8 md:px-12 max-w-2xl text-white">
                                    <span className="inline-block px-3 py-1 bg-yellow-500 text-slate-900 text-xs font-black uppercase tracking-wider rounded-full mb-3 shadow-md">
                                        Active Category
                                    </span>
                                    <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">{selectedCat.name}</h1>
                                    <p className="text-white/80 text-sm md:text-base">Showing all gear and products listed under {selectedCat.name}.</p>
                                </div>
                            </div>
                        );
                    }
                    return null;
                })()}

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
                                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeCategorySlug === cat.slug ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                                {cat.image && <img src={cat.image} alt="" className="w-5 h-5 rounded-full object-cover border border-white/20" />}
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
                            <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group relative hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
                                <div>
                                    <div className="relative h-64 overflow-hidden bg-gray-100">
                                        <Link href={`/products/${product.slug || product.id}`}>
                                            <img 
                                                src={product.image || 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=800&q=80'} 
                                                alt={product.name} 
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </Link>
                                        <button 
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                const res = toggleWishlist(product);
                                                if (res.isAdded) {
                                                    toast.success(`${product.name} added to wishlist!`);
                                                } else {
                                                    toast.info(`${product.name} removed from wishlist`);
                                                }
                                            }}
                                            className="absolute top-3 right-3 bg-white p-2.5 rounded-full shadow-md hover:scale-110 transition-all z-10"
                                            title={wishlistIds.includes(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                                        >
                                            <Heart className={`w-5 h-5 transition-colors ${wishlistIds.includes(product.id) ? 'fill-rose-500 text-rose-500' : 'text-gray-400 hover:text-rose-500'}`} />
                                        </button>
                                        {product.stock <= 5 && product.stock > 0 && (
                                            <div className="absolute bottom-2 left-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded pointer-events-none">
                                                Only {product.stock} left!
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <div className="text-xs font-bold tracking-wide text-indigo-600 mb-1 uppercase">
                                            {product.category?.name || 'Equipment'}
                                        </div>
                                        <Link href={`/products/${product.slug || product.id}`}>
                                            <h3 className="font-bold text-gray-800 mb-1 truncate text-lg hover:text-indigo-600 transition-colors">{product.name}</h3>
                                        </Link>
                                        <p className="text-xs text-gray-500 line-clamp-2 mb-3">{product.description}</p>
                                    </div>
                                </div>
                                <div className="p-4 pt-0">
                                    <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                                        <span className="text-xl font-black text-gray-900">₹{product.price}</span>
                                        <button 
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                addToCart(product);
                                                toast.success(`${product.name} added to cart!`);
                                            }}
                                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
                                        >
                                            <ShoppingBag className="w-4 h-4" /> Add
                                        </button>
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
