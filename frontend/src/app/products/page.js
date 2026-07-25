'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import EcommerceLayout from '@/layouts/EcommerceLayout';
import { Head } from '@/lib/inertia-compat';
import api from '@/lib/api';
import { Filter, Heart, Search, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { addToCart } from '@/utils/cart';
import { toggleWishlist, getWishlist } from '@/utils/wishlist';
import { getImgSrc } from '@/utils/imgSrc';

function ProductsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const categoryParam = searchParams?.get('category') || 'all';
    const subcategoryParam = searchParams?.get('subcategory') || 'all';
    const searchParam = searchParams?.get('search') || '';

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeCategorySlug, setActiveCategorySlug] = useState(categoryParam);
    const [activeSubcategorySlug, setActiveSubcategorySlug] = useState(subcategoryParam);
    const [searchTerm, setSearchTerm] = useState(searchParam);
    const [wishlistIds, setWishlistIds] = useState([]);

    useEffect(() => {
        setActiveCategorySlug(categoryParam);
        setActiveSubcategorySlug(subcategoryParam);
        setSearchTerm(searchParam);
    }, [categoryParam, subcategoryParam, searchParam]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const params = {};
                if (categoryParam && categoryParam !== 'all') params.category = categoryParam;
                if (subcategoryParam && subcategoryParam !== 'all') params.subcategory = subcategoryParam;
                if (searchParam) params.search = searchParam;

                const res = await api.get('/api/products', { params });
                if (res) {
                    if (res.products) setProducts(res.products);
                    else if (Array.isArray(res)) setProducts(res);
                    if (res.categories) setCategories(res.categories);
                }
            } catch (e) {
                console.error('Error fetching products:', e);
            }
        };
        fetchProducts();
    }, [categoryParam, subcategoryParam, searchParam]);

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
        const params = new URLSearchParams();
        if (slug !== 'all') params.set('category', slug);
        if (searchTerm) params.set('search', searchTerm);
        const queryString = params.toString();
        router.push(`/products${queryString ? `?${queryString}` : ''}`);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (activeCategorySlug !== 'all') params.set('category', activeCategorySlug);
        if (searchTerm) params.set('search', searchTerm);
        const queryString = params.toString();
        router.push(`/products${queryString ? `?${queryString}` : ''}`);
    };

    const selectedCat = categories.find(c => c.slug === activeCategorySlug || String(c.id) === String(activeCategorySlug));

    return (
        <EcommerceLayout>
            <Head title="Explore Cricket Bats & Gear - Bigbestow" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumbs */}
                <div className="text-sm text-gray-500 dark:text-slate-400 mb-6">
                    <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">Home</Link>
                    {' / '}
                    <span className="text-gray-900 dark:text-white font-medium">Products Catalog</span>
                </div>

                {/* Category Banner */}
                {selectedCat && (
                    <div className="relative rounded-3xl overflow-hidden mb-8 shadow-xl bg-gray-900 h-48 md:h-60 flex items-center">
                        {selectedCat.image && (
                            <img
                                src={getImgSrc(selectedCat.image)}
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
                )}

                {/* Filter and Search Bar */}
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 mb-8 flex flex-col lg:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0">
                        <span className="font-bold flex items-center gap-1.5 text-gray-700 dark:text-slate-300 whitespace-nowrap">
                            <Filter className="w-4 h-4 text-indigo-600 dark:text-indigo-400"/>Categories:
                        </span>
                        <button
                            onClick={() => handleCategoryFilter('all')}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeCategorySlug === 'all' ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600'}`}
                        >
                            All Gear ({products.length})
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => handleCategoryFilter(cat.slug)}
                                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeCategorySlug === cat.slug ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600'}`}
                            >
                                {cat.image && <img src={getImgSrc(cat.image)} alt="" className="w-5 h-5 rounded-full object-cover border border-white/20" />}
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
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-slate-600 rounded-full text-sm bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <Search className="w-4 h-4 text-gray-400 dark:text-slate-500 absolute left-3.5 top-3" />
                    </form>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products && products.length > 0 ? (
                        products.map(product => (
                            <div key={product.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden group relative hover:shadow-xl dark:hover:shadow-slate-900/50 transition-all duration-300 flex flex-col justify-between">
                                <div>
                                    <div className="relative h-64 overflow-hidden bg-gray-100 dark:bg-slate-900">
                                        <Link href={`/products/${product.slug || product.id}`}>
                                            <img
                                                src={getImgSrc(product.image_url || product.image, 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=800&q=80')}
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
                                            className="absolute top-3 right-3 bg-white dark:bg-slate-800 p-2.5 rounded-full shadow-md hover:scale-110 transition-all z-10"
                                            title={wishlistIds.includes(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                                        >
                                            <Heart className={`w-5 h-5 transition-colors ${wishlistIds.includes(product.id) ? 'fill-rose-500 text-rose-500' : 'text-gray-400 dark:text-slate-400 hover:text-rose-500'}`} />
                                        </button>
                                        {product.stock <= 5 && product.stock > 0 && (
                                            <div className="absolute bottom-2 left-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded pointer-events-none">
                                                Only {product.stock} left!
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <div className="text-xs font-bold tracking-wide text-indigo-600 dark:text-indigo-400 mb-1 uppercase">
                                            {product.category?.name || 'Equipment'}
                                        </div>
                                        <Link href={`/products/${product.slug || product.id}`}>
                                            <h3 className="font-bold text-gray-800 dark:text-white mb-1 truncate text-lg hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{product.name}</h3>
                                        </Link>
                                        <p className="text-xs text-gray-500 dark:text-slate-400 line-clamp-2 mb-3">{product.description}</p>
                                    </div>
                                </div>
                                <div className="p-4 pt-0">
                                    <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-slate-700">
                                        <span className="text-xl font-black text-gray-900 dark:text-white">₹{product.price}</span>
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
                        <div className="col-span-4 text-center py-20 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 mt-4">
                            <h3 className="text-xl font-bold text-gray-600 dark:text-slate-300 mb-2">No cricket gear found matching your criteria.</h3>
                            <p className="text-gray-400 dark:text-slate-500 text-sm">Try selecting a different category or clearing your search query.</p>
                            <button
                                onClick={() => { setActiveCategorySlug('all'); setSearchTerm(''); router.push('/products'); }}
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

export default function ProductsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center font-bold text-gray-500 dark:text-slate-400">Loading Products...</div>}>
            <ProductsContent />
        </Suspense>
    );
}
