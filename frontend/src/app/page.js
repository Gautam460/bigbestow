'use client';

import React, { useState, useEffect } from 'react';
import EcommerceLayout from '@/layouts/EcommerceLayout';
import Link from 'next/link';
import { Head } from '@/lib/inertia-compat';
import api from '@/lib/api';
import { ArrowRight, Star, TrendingUp, Truck, Shield, Trophy, ShoppingBag, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { addToCart } from '@/utils/cart';
import { toggleWishlist, getWishlist } from '@/utils/wishlist';
import { getImgSrc } from '@/utils/imgSrc';

export default function Home(initialProps = {}) {
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
        fetchHomeData();
    }, []);

    // Default fallback banner if DB has no active banners yet
    const defaultBanners = [
        {
            id: 'default-1',
            title: 'Power. Precision. Bigbestow Performance.',
            image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=1920&q=80',
            link: '/products',
            subtitle: 'Hand-selected English and Kashmir Willow bats crafted for the modern cricketer. Elevate your game with professional-grade gear.'
        },
        {
            id: 'default-2',
            title: 'Master The Crease With Pro Grade Willow',
            image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1920&q=80',
            link: '/products?category=english-willow',
            subtitle: 'Engineered for massive sweet spots and feather-light pickup. Tested by championship athletes worldwide.'
        }
    ];

    const displayBanners = (banners && banners.length > 0) ? banners : defaultBanners;
    const [currentSlide, setCurrentSlide] = useState(0);
    const [wishlistIds, setWishlistIds] = useState([]);

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
            <div className="relative bg-slate-100 text-white overflow-hidden min-h-[75vh] md:min-h-[82vh] flex items-center group">
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
                                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/40 to-transparent w-full md:w-3/4 lg:w-3/5"></div>
                                )}
                            </div>
                            
                            {hasText && (
                                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36 flex flex-col items-start justify-center min-h-[75vh] md:min-h-[82vh] pointer-events-none">
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
                            className="absolute left-4 md:left-8 z-20 p-3 rounded-full bg-white dark:bg-slate-800/80 hover:bg-white dark:bg-slate-800 text-slate-900 shadow-xl border border-gray-200 dark:border-slate-600 transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
                            aria-label="Previous slide"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="absolute right-4 md:right-8 z-20 p-3 rounded-full bg-white dark:bg-slate-800/80 hover:bg-white dark:bg-slate-800 text-slate-900 shadow-xl border border-gray-200 dark:border-slate-600 transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
                            aria-label="Next slide"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </>
                )}

                {/* Clean Slider Dots */}
                {displayBanners.length > 1 && (
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5 bg-white dark:bg-slate-800/80 px-4 py-2 rounded-full shadow-lg border border-gray-200 dark:border-slate-600/50 backdrop-blur-md">
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

            {/* 2. Trust Badges */}
            <div className="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-slate-800">
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

            {/* 3. Dynamic Categories from DB */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-2">Shop by Category</h2>
                        <p className="text-gray-500 dark:text-gray-400">The finest willows for every level of play</p>
                    </div>
                    <Link href="/products" className="hidden md:flex items-center gap-2 font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors group">
                        View All Gear <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {categories && categories.length > 0 ? (
                        categories.map((category) => (
                            <Link key={category.id} href={`/products?category=${category.slug}`} className="relative h-[380px] rounded-2xl overflow-hidden group cursor-pointer shadow-lg block bg-gray-900">
                                {category.image ? (
                                    <img 
                                        src={getImgSrc(category.image)} 
                                        alt={category.name} 
                                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out opacity-80"
                                    />
                                ) : (
                                    <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-indigo-900 to-slate-800 group-hover:scale-110 transition-transform duration-700 ease-out opacity-90 flex items-center justify-center">
                                        <span className="text-9xl font-black text-white/10 uppercase tracking-tighter mix-blend-overlay">{category.name.substring(0, 2)}</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 p-8 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                    <span className="inline-block px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full mb-2">
                                        {category.products_count !== undefined ? `${category.products_count} Items` : 'Collection'}
                                    </span>
                                    <h3 className="text-2xl font-bold text-white mb-2">{category.name}</h3>
                                    <div className="flex items-center gap-2 text-white/80 group-hover:text-white transition-colors">
                                        <span className="font-medium text-sm">Explore Range</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="col-span-3 text-center py-12 bg-gray-50 dark:bg-slate-900 rounded-xl">
                            <p className="text-gray-500 dark:text-slate-400">No categories found in database.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* 4. Dynamic Featured Products Grid from DB */}
            <div className="bg-gray-50 dark:bg-slate-900 py-24 border-t border-gray-100 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-bold text-sm mb-4">
                            <TrendingUp className="w-4 h-4" /> Most Popular
                        </div>
                        <h2 className="text-4xl font-black text-gray-900 dark:text-white">Featured Cricket Gear</h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">Latest arrivals straight from our database</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {featuredProducts && featuredProducts.length > 0 ? (
                            featuredProducts.map(product => (
                                <div key={product.id} className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 group relative overflow-hidden border border-gray-100 dark:border-slate-700 flex flex-col justify-between">
                                    <div>
                                        <div className="relative h-64 rounded-xl overflow-hidden mb-4 bg-gray-100 dark:bg-slate-900">
                                            <Link href={`/products/${product.slug || product.id}`}>
                                                {(product.image_url || product.image) ? (
                                                    <img 
                                                        src={getImgSrc(product.image_url || product.image)} 
                                                        alt={product.name} 
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                                                        <span className="text-gray-400 dark:text-gray-500 text-6xl font-black">{product.name.substring(0, 1).toUpperCase()}</span>
                                                    </div>
                                                )}
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
                                                className="absolute top-3 right-3 bg-white dark:bg-slate-800 p-2.5 rounded-full shadow-md hover:scale-110 transition-all z-10"
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
                                        <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-3">{product.description}</p>
                                    </div>
                                    <div className="text-2xl font-black text-gray-900 dark:text-white mt-2 pt-2 border-t border-gray-100 dark:border-slate-700 flex items-center justify-between">
                                        <span>₹{product.price}</span>
                                        <Link href={`/products/${product.slug || product.id}`} className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">View details</Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-4 text-center py-16 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                                <p className="text-gray-500 dark:text-gray-400 text-lg">No products available in the database right now.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            {/* 5. Promotional Newsletter Banner */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl overflow-hidden shadow-2xl relative">
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
                                className="flex-grow px-6 py-4 rounded-full bg-white/10 dark:bg-slate-800/30 border border-white/20 text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 backdrop-blur-md focus:bg-white/20 transition-all"
                            />
                            <button type="submit" className="px-8 py-4 bg-white dark:bg-slate-800 text-indigo-900 font-bold rounded-full hover:bg-indigo-50 transition-colors shadow-lg whitespace-nowrap">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </EcommerceLayout>
    );
}
