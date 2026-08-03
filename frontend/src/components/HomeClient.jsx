'use client';

import React, { useState, useEffect, useRef } from 'react';
import EcommerceLayout from '@/layouts/EcommerceLayout';
import Link from 'next/link';
import { Head } from '@/lib/inertia-compat';
import api from '@/lib/api';
import { ArrowRight, Star, TrendingUp, Truck, Shield, Trophy, ShoppingBag, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { addToCart } from '@/utils/cart';
import { toggleWishlist, getWishlist } from '@/utils/wishlist';
import { getImgSrc } from '@/utils/imgSrc';

export default function HomeClient({ initialProps = {} }) {
    const [featuredProducts, setFeaturedProducts] = useState(initialProps.featuredProducts || []);
    const [categories, setCategories] = useState(initialProps.categories || []);
    const [banners, setBanners] = useState(initialProps.banners || []);
    const [subscribeEmail, setSubscribeEmail] = useState('');

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                const res = await api.get('/api/home');
                if (res) {
                    if (res.featuredProducts) setFeaturedProducts(res.featuredProducts);
                    if (res.categories) setCategories(res.categories);
                    if (res.banners) setBanners(res.banners);
                }
            } catch (e) {
                console.error('Error fetching home data:', e);
            }
        };
        if (!initialProps.featuredProducts || initialProps.featuredProducts.length === 0) {
            fetchHomeData();
        }
    }, []);

    const displayBanners = banners || [];
    const [currentSlide, setCurrentSlide] = useState(0);
    const [wishlistIds, setWishlistIds] = useState([]);
    const [activeCategoryTab, setActiveCategoryTab] = useState('all');
    const categoryScrollRef = useRef(null);

    useEffect(() => {
        const updateWishlist = () => {
            setWishlistIds(getWishlist().map(item => item.id));
        };
        updateWishlist();
        window.addEventListener('wishlist-updated', updateWishlist);
        return () => window.removeEventListener('wishlist-updated', updateWishlist);
    }, []);

    // Auto-play slider
    useEffect(() => {
        if (displayBanners.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % displayBanners.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [displayBanners.length]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % displayBanners.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + displayBanners.length) % displayBanners.length);
    };

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!subscribeEmail) return;
        try {
            await api.post('/api/subscribe', { email: subscribeEmail });
            toast.success("Successfully subscribed to the Bigbestow Club!");
            setSubscribeEmail('');
        } catch (error) {
            toast.error("Failed to subscribe. Please try again.");
        }
    };

    return (
        <EcommerceLayout>
            <Head title="Premium Cricket Bats & Equipment - Bigbestow" />
            
            {/* 1. Clean & Bright Dynamic Hero Section (Slider) */}
            {displayBanners.length > 0 && (
                <div className="relative bg-gray-100 text-white overflow-hidden min-h-[75vh] md:min-h-[82vh] flex items-center group">
                    {/* Slides */}
                    {displayBanners.map((banner, index) => {
                        const hasText = !!banner.title;
                        
                        const slideContent = (
                            <>
                                <div className="absolute inset-0 z-0">
                                    <img 
                                        src={getImgSrc(banner.image_url || banner.image, 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=1920&q=80')} 
                                        alt={banner.title || 'Cricket equipment'} 
                                        className="w-full h-full object-cover object-center opacity-100 transition-transform duration-1000 ease-out"
                                    />
                                    {/* Soft, clean gradient ONLY on the left side for text legibility, leaving the rest of the image 100% bright and clear */}
                                    {hasText && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-gray-950/85 via-gray-900/40 to-transparent w-full md:w-3/4 lg:w-3/5"></div>
                                    )}
                                </div>
                                
                                {hasText && (
                                    <div className="relative z-10 max-w-[1600px] xl:px-12 mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36 flex flex-col items-start justify-center min-h-[75vh] md:min-h-[82vh] pointer-events-none">
                                        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black leading-tight mb-6 max-w-2xl text-white drop-shadow-md pointer-events-auto">
                                            <span>{banner.title}</span>
                                        </h1>
                                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pointer-events-auto">
                                            {banner.link && (
                                                <Link 
                                                    href={banner.link} 
                                                    className="group/btn flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-full font-bold text-base md:text-lg hover:bg-indigo-700 transition-all duration-300 shadow-xl shadow-indigo-600/20 hover:scale-105 active:scale-95"
                                                >
                                                    Shop Collection
                                                    <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </>
                        );

                        return (
                            <div 
                                key={banner.id || index}
                                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                                    currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                                }`}
                            >
                                {!hasText && banner.link ? (
                                    <Link href={banner.link} className="block w-full h-full relative z-10">
                                        {slideContent}
                                    </Link>
                                ) : (
                                    slideContent
                                )}
                            </div>
                        );
                    })}

                    {/* Clean White Slider Arrows (Only show if multiple slides) */}
                    {displayBanners.length > 1 && (
                        <>
                            <button
                                onClick={prevSlide}
                                className="absolute left-4 md:left-8 z-20 p-3 rounded-full bg-white dark:bg-gray-800/80 hover:bg-white dark:bg-gray-800 text-gray-900 shadow-xl border border-gray-200 dark:border-gray-600 transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
                                aria-label="Previous slide"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="absolute right-4 md:right-8 z-20 p-3 rounded-full bg-white dark:bg-gray-800/80 hover:bg-white dark:bg-gray-800 text-gray-900 shadow-xl border border-gray-200 dark:border-gray-600 transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
                                aria-label="Next slide"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </>
                    )}

                    {/* Clean Slider Dots */}
                    {displayBanners.length > 1 && (
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5 bg-white dark:bg-gray-800/80 px-4 py-2 rounded-full shadow-lg border border-gray-200 dark:border-gray-600/50 backdrop-blur-md">
                            {displayBanners.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    className={`h-2.5 rounded-full transition-all duration-500 ${
                                        index === currentSlide ? 'w-8 bg-indigo-600' : 'w-2.5 bg-gray-300 hover:bg-gray-400'
                                    }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* 2. Trust Badges */}
            <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
                <div className="max-w-[1600px] xl:px-12 mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-gray-800">
                        <div className="flex flex-col items-center justify-center pt-4 md:pt-0 group">
                            <div className="bg-indigo-50 dark:bg-indigo-500/10 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/20">
                                <Trophy className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <h3 className="font-bold text-gray-900 dark:text-white text-lg">Pro Grade Quality</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Tested by professional players</p>
                        </div>
                        <div className="flex flex-col items-center justify-center pt-8 md:pt-0 group">
                            <div className="bg-indigo-50 dark:bg-indigo-500/10 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/20">
                                <Shield className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <h3 className="font-bold text-gray-900 dark:text-white text-lg">100% Genuine Willow</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Authenticity guaranteed</p>
                        </div>
                        <div className="flex flex-col items-center justify-center pt-8 md:pt-0 group">
                            <div className="bg-indigo-50 dark:bg-indigo-500/10 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/20">
                                <Truck className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <h3 className="font-bold text-gray-900 dark:text-white text-lg">Worldwide Shipping</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Delivered to your doorstep</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3 & 4. Products by Category Section */}
            <div className="bg-transparent dark:bg-gray-900 py-24 border-t border-gray-100 dark:border-gray-800">
                <div className="max-w-[1600px] xl:px-12 mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header & Category Tabs Inline */}
                    <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-12 mb-10">
                        <div className="shrink-0">
                            <h2 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white">Spotlight Categories</h2>
                        </div>

                        {/* Category Tabs */}
                        <div className="relative group flex-1 min-w-0 flex items-center">
                            <button 
                                onClick={() => {
                                    if (categoryScrollRef.current) {
                                        categoryScrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
                                    }
                                }}
                                className="absolute -left-4 lg:left-0 top-1/2 -translate-y-1/2 z-10 p-2 lg:p-3 rounded-full bg-black/80 hover:bg-black text-white shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110 hidden md:flex items-center justify-center backdrop-blur-sm"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>

                            <div 
                                ref={categoryScrollRef}
                                className="flex overflow-x-auto gap-3 lg:gap-4 no-scrollbar scroll-smooth snap-x pb-2 pt-1 w-full mask-edges px-2 lg:px-8" 
                                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                            >
                                <style dangerouslySetInnerHTML={{__html: `
                                    .no-scrollbar::-webkit-scrollbar { display: none; }
                                    .mask-edges {
                                        -webkit-mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
                                        mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
                                    }
                                `}} />
                                <button
                                    onClick={() => setActiveCategoryTab('all')}
                                    className={`flex-shrink-0 snap-start px-6 lg:px-8 py-3 rounded-full font-bold text-sm transition-all duration-300 ${
                                        activeCategoryTab === 'all' 
                                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-2 ring-indigo-600 ring-offset-2 dark:ring-offset-gray-900' 
                                            : 'bg-black text-white dark:bg-gray-800 dark:text-gray-100 hover:bg-gray-900 dark:hover:bg-gray-700 hover:scale-105'
                                    }`}
                                >
                                    All Products
                                </button>
                                {categories && categories.length > 0 && categories.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => setActiveCategoryTab(category.id)}
                                        className={`flex-shrink-0 snap-start px-6 lg:px-8 py-3 rounded-full font-bold text-sm transition-all duration-300 ${
                                            activeCategoryTab === category.id 
                                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-2 ring-indigo-600 ring-offset-2 dark:ring-offset-gray-900' 
                                                : 'bg-black text-white dark:bg-gray-800 dark:text-gray-100 hover:bg-gray-900 dark:hover:bg-gray-700 hover:scale-105'
                                        }`}
                                    >
                                        {category.name}
                                    </button>
                                ))}
                            </div>

                            <button 
                                onClick={() => {
                                    if (categoryScrollRef.current) {
                                        categoryScrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
                                    }
                                }}
                                className="absolute -right-4 lg:right-0 top-1/2 -translate-y-1/2 z-10 p-2 lg:p-3 rounded-full bg-black/80 hover:bg-black text-white shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110 hidden md:flex items-center justify-center backdrop-blur-sm"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                        {(() => {
                            let displayProducts = [];
                            if (activeCategoryTab === 'all') {
                                displayProducts = featuredProducts;
                            } else {
                                const selectedCat = categories.find(c => c.id === activeCategoryTab);
                                displayProducts = selectedCat?.products || [];
                            }

                            if (!displayProducts || displayProducts.length === 0) {
                                return (
                                    <div className="col-span-4 text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                                        <p className="text-gray-500 dark:text-gray-400 text-lg">No products available in this category right now.</p>
                                    </div>
                                );
                            }

                            return displayProducts.map(product => (
                                <div key={product.id} className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 group relative overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col justify-between">
                                    <div>
                                        <div className="relative h-64 rounded-xl overflow-hidden mb-4 bg-gray-100 dark:bg-gray-900">
                                            <Link href={`/products/${product.slug || product.id}`}>
                                                <img 
                                                    src={getImgSrc(product.image_url || product.image) || 'https://placehold.co/800x800/f8fafc/64748b?text=Image+Not+Found'} 
                                                    alt={product.name} 
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/800x800/f8fafc/64748b?text=Product+Image'; }}
                                                />
                                            </Link>
                                            <div className="absolute top-3 left-3 bg-indigo-600 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow pointer-events-none">
                                                In Stock ({product.stock})
                                            </div>
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
                                                className="absolute top-3 right-3 bg-white dark:bg-gray-800 p-2.5 rounded-full shadow-md hover:scale-110 transition-all z-10"
                                                title={wishlistIds.includes(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                                            >
                                                <Heart className={`w-5 h-5 transition-colors ${wishlistIds.includes(product.id) ? 'fill-rose-500 text-rose-500' : 'text-gray-400 hover:text-rose-500'}`} />
                                            </button>
                                            <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out bg-gradient-to-t from-black/70 to-transparent">
                                                <button 
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        addToCart(product);
                                                        toast.success(`${product.name} added to cart!`);
                                                    }}
                                                    className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-colors shadow-lg flex items-center justify-center gap-2"
                                                >
                                                    <ShoppingBag className="w-4 h-4" /> Add to Cart
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-start mb-2">
                                            <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                                {product.category?.name || 'Cricket Gear'}
                                            </div>
                                            <div className="flex items-center gap-1 bg-yellow-100/60 dark:bg-yellow-500/20 px-2 py-0.5 rounded text-xs font-bold text-yellow-700 dark:text-yellow-500">
                                                <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" /> 4.9
                                            </div>
                                        </div>
                                        <Link href={`/products/${product.slug || product.id}`}>
                                            <h3 className="font-bold text-gray-900 dark:text-white mb-1 text-lg leading-tight line-clamp-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{product.name}</h3>
                                        </Link>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-3">
                                            {product.description ? product.description.replace(/<[^>]*>?/gm, '') : ''}
                                        </p>
                                        {product.sizes && Array.isArray(product.sizes) && product.sizes.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mb-2">
                                                {product.sizes.map((size) => (
                                                    <span key={size} className="text-[10px] px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded border border-gray-200 dark:border-gray-700">
                                                        {size}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-2xl font-black text-gray-900 dark:text-white">₹{product.price}</span>
                                        </div>
                                        <Link href={`/products/${product.slug || product.id}`} className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">View details</Link>
                                    </div>
                                </div>
                            ));
                        })()}
                    </div>
                    
                    <div className="mt-12 text-center">
                        <Link href="/products" className="inline-flex items-center gap-2 px-8 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-indigo-600 dark:text-indigo-400 font-bold rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm">
                            View All Products <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Massive Split-Screen Promo Banner */}
            <div className="bg-gray-900 py-0 overflow-hidden relative">
                <div className="flex flex-col lg:flex-row min-h-[60vh]">
                    {/* Image Side */}
                    <div className="w-full lg:w-1/2 relative min-h-[40vh] lg:min-h-full">
                        <img 
                            src="https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=1200" 
                            alt="Pro Cricket Equipment" 
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-gray-900 via-gray-900/40 lg:via-gray-900/60 to-transparent"></div>
                    </div>
                    {/* Content Side */}
                    <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 relative">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full"></div>
                        <div className="relative z-10 max-w-lg mt-[-100px] lg:mt-0">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 font-bold text-sm mb-6 uppercase tracking-wider border border-rose-500/20">
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                                </span>
                                Flash Sale Live
                            </div>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
                                The Master's <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Reserve</span>
                            </h2>
                            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                                Unleash your true potential with our limited edition English Willow series. Hand-selected for ultimate balance, massive edges, and explosive power. Available for a limited time only.
                            </p>
                            
                            {/* Countdown Timer Dummy */}
                            <div className="flex gap-4 mb-10">
                                {[{label: 'Days', val: '02'}, {label: 'Hours', val: '14'}, {label: 'Mins', val: '45'}, {label: 'Secs', val: '22'}].map((time, idx) => (
                                    <div key={idx} className="flex flex-col items-center justify-center bg-gray-800/80 backdrop-blur-sm border border-gray-700 w-16 h-16 md:w-20 md:h-20 rounded-xl shadow-inner">
                                        <span className="text-xl md:text-3xl font-black text-white">{time.val}</span>
                                        <span className="text-[10px] md:text-xs text-gray-400 uppercase font-bold tracking-wider">{time.label}</span>
                                    </div>
                                ))}
                            </div>

                            <Link href="/products" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 font-bold rounded-full hover:bg-indigo-50 transition-all hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/20 group">
                                Claim Offer <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            
            {/* 4.5. New Section: Top Brands Marquee */}
            <div className="bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800 py-12 overflow-hidden relative">
                <style dangerouslySetInnerHTML={{__html: `
                    @keyframes marquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-100%); } }
                    .animate-marquee { display: flex; animation: marquee 30s linear infinite; }
                    .animate-marquee-container:hover .animate-marquee { animation-play-state: paused; }
                `}} />
                <div className="max-w-[1600px] xl:px-12 mx-auto px-4 mb-8 text-center">
                    <p className="text-sm font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em]">Premium Brands We Carry</p>
                </div>
                <div className="relative flex overflow-x-hidden animate-marquee-container mask-edges-wide">
                    <style dangerouslySetInnerHTML={{__html: `
                        .mask-edges-wide {
                            -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
                            mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
                        }
                    `}} />
                    <div className="animate-marquee items-center shrink-0 min-w-full justify-around gap-16 px-8">
                        {['SG CRICKET', 'SS TON', 'MRF', 'GRAY-NICOLLS', 'KOOKABURRA', 'SPARTAN', 'GUNN & MOORE', 'DSC', 'NEW BALANCE', 'MASURI'].map((brand, i) => (
                            <span key={i} className="text-3xl md:text-5xl font-black text-gray-200 dark:text-gray-800/80 tracking-tighter hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer shrink-0 whitespace-nowrap">{brand}</span>
                        ))}
                    </div>
                    <div className="animate-marquee items-center shrink-0 min-w-full justify-around gap-16 px-8 absolute top-0 left-full">
                        {['SG CRICKET', 'SS TON', 'MRF', 'GRAY-NICOLLS', 'KOOKABURRA', 'SPARTAN', 'GUNN & MOORE', 'DSC', 'NEW BALANCE', 'MASURI'].map((brand, i) => (
                            <span key={'dup-'+i} className="text-3xl md:text-5xl font-black text-gray-200 dark:text-gray-800/80 tracking-tighter hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer shrink-0 whitespace-nowrap">{brand}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* 4.6. New Section: High-End Categories Grid */}
            <div className="bg-[#F5F7FA] dark:bg-gray-950 py-24">
                <div className="max-w-[1600px] xl:px-12 mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                        <div>
                            <h2 className="text-3xl lg:text-5xl font-black text-gray-900 dark:text-white">Curated For You</h2>
                            <p className="text-gray-500 mt-3 text-lg">Shop by our most popular premium categories</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
                        {/* Big left tile */}
                        <div className="md:col-span-2 group relative rounded-[2rem] overflow-hidden shadow-md hover:shadow-2xl transition-all h-full">
                            <img src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=1200" alt="English Willow" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 w-full p-10">
                                <h3 className="text-4xl font-black text-white mb-3 drop-shadow-md">Premium English Willow</h3>
                                <p className="text-gray-300 text-lg mb-6 max-w-md">Grade 1 reserve willow bats handcrafted for extreme power and balance.</p>
                                <Link href="/products?category=english-willow-bats" className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-full font-bold hover:bg-indigo-50 transition-colors">
                                    Shop Bats <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                        {/* Two stacked right tiles */}
                        <div className="flex flex-col gap-6 h-full">
                            <div className="group relative rounded-[2rem] overflow-hidden shadow-md hover:shadow-2xl transition-all h-1/2">
                                <img src="https://images.unsplash.com/photo-1593787406536-3676a152d9bc?auto=format&fit=crop&q=80&w=600" alt="Pro Gear" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 w-full p-8">
                                    <h3 className="text-2xl font-black text-white mb-4">Pro Protective Gear</h3>
                                    <Link href="/products?category=pads" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-full font-bold hover:bg-indigo-700 transition-colors text-sm">
                                        Shop Gear <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                            <div className="group relative rounded-[2rem] overflow-hidden shadow-md hover:shadow-2xl transition-all h-1/2">
                                <img src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600" alt="Accessories" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 w-full p-8">
                                    <h3 className="text-2xl font-black text-white mb-4">Kit Bags & Accs</h3>
                                    <Link href="/products?category=kit-bags" className="inline-flex items-center gap-2 bg-white text-gray-900 px-5 py-2.5 rounded-full font-bold hover:bg-gray-100 transition-colors text-sm">
                                        Shop Bags <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4.7. New Section: Player Testimonials */}
            <div className="py-24 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
                <div className="max-w-[1600px] xl:px-12 mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl lg:text-5xl font-black text-gray-900 dark:text-white mb-4">Trusted by Champions</h2>
                    <p className="text-gray-500 mb-16 text-lg">Join thousands of players who rely on Bigbestow for their match-day performance.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                        {[
                            { name: "Virat K.", role: "Pro Batsman", text: "The willow quality is simply unmatched. It pings right off the middle every time. Best bat I've used this season." },
                            { name: "Steve S.", role: "Club Cricketer", text: "Incredible customer service and genuine English willow bats. The balance and pick-up are absolutely perfect." },
                            { name: "Ben S.", role: "All-rounder", text: "My entire kit bag was delivered the next day. The premium gear selection is insane and the quality is top notch." }
                        ].map((t, i) => (
                            <div key={i} className="bg-gray-50 dark:bg-gray-800 p-8 lg:p-10 rounded-[2rem] relative border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow">
                                <div className="flex gap-1 mb-6">
                                    {[1,2,3,4,5].map(s => <Star key={s} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 italic mb-8 text-lg leading-relaxed">"{t.text}"</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black text-xl">
                                        {t.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white text-lg">{t.name}</h4>
                                        <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider">{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
\n            {/* 5. Promotional Newsletter Banner */}
            <div className="max-w-[1600px] xl:px-12 mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="bg-gradient-to-br from-indigo-900 to-gray-900 rounded-3xl overflow-hidden shadow-2xl relative">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 blur-[100px] rounded-full"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-500/10 blur-[100px] rounded-full"></div>
                    
                    <div className="relative z-10 px-6 py-16 md:py-24 text-center max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-4">Join The Bigbestow Club</h2>
                        <p className="text-indigo-200 text-lg mb-8">Sign up for exclusive offers, pro-tips, and first access to our new bat collections.</p>
                        
                        <form className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto" onSubmit={handleSubscribe}>
                            <input 
                                type="email" 
                                placeholder="Enter your email address" 
                                value={subscribeEmail}
                                onChange={(e) => setSubscribeEmail(e.target.value)}
                                required
                                className="flex-grow px-6 py-4 rounded-full bg-white/10 dark:bg-gray-800/30 border border-white/20 text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 backdrop-blur-md focus:bg-white/20 transition-all"
                            />
                            <button type="submit" className="px-8 py-4 bg-white dark:bg-gray-800 text-indigo-900 font-bold rounded-full hover:bg-indigo-50 transition-colors shadow-lg whitespace-nowrap">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </EcommerceLayout>
    );
}
