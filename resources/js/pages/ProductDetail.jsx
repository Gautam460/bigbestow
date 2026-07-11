import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import EcommerceLayout from '../layouts/EcommerceLayout';
import { Star, ShieldCheck, Truck, RotateCcw, Heart, Share2, ShoppingBag, ArrowRight, ZoomIn, Check, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { addToCart } from '../utils/cart';
import { toggleWishlist, getWishlist } from '../utils/wishlist';

export default function ProductDetail({ product, relatedProducts = [] }) {
    // Generate gallery images (primary image + gallery array, or high-res fallbacks)
    const fallbackImages = [
        product.image || 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&w=1200&q=80',
    ];

    const gallery = (product.gallery && Array.isArray(product.gallery) && product.gallery.length > 0)
        ? [product.image, ...product.gallery].filter(Boolean)
        : fallbackImages;

    const [selectedImage, setSelectedImage] = useState(gallery[0]);
    const [quantity, setQuantity] = useState(1);
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
    const [selectedSize, setSelectedSize] = useState('SH (Short Handle)');
    const [wishlistIds, setWishlistIds] = useState([]);

    useEffect(() => {
        const updateWishlist = () => {
            setWishlistIds(getWishlist().map(item => item.id));
        };
        updateWishlist();
        window.addEventListener('wishlist-updated', updateWishlist);
        return () => window.removeEventListener('wishlist-updated', updateWishlist);
    }, []);

    const handleMouseMove = (e) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setZoomPos({ x, y });
    };

    const handleAddToCart = () => {
        addToCart(product, quantity, { size: selectedSize });
        toast.success(`${quantity}x ${product.name} added to your cart!`);
    };

    const handleBuyNow = () => {
        addToCart(product, quantity, { size: selectedSize });
        router.visit('/checkout');
    };

    return (
        <EcommerceLayout>
            <Head title={`${product.name} - Bigbestow Cricket`} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
                    <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
                    <span>/</span>
                    <Link href="/products" className="hover:text-indigo-600 transition-colors">Products</Link>
                    <span>/</span>
                    {product.category && (
                        <>
                            <Link href={`/products?category=${product.category.slug || product.category.id}`} className="hover:text-indigo-600 transition-colors">
                                {product.category.name}
                            </Link>
                            <span>/</span>
                        </>
                    )}
                    <span className="text-gray-900 font-semibold truncate max-w-xs">{product.name}</span>
                </nav>

                {/* Main Product Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left: Gallery & Zoom (7 cols) */}
                    <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
                        {/* Thumbnails */}
                        <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto sm:max-h-[550px] pb-2 sm:pb-0 scrollbar-none">
                            {gallery.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImage(img)}
                                    className={`w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 bg-gray-100 ${
                                        selectedImage === img ? 'border-indigo-600 shadow-md scale-95' : 'border-transparent opacity-70 hover:opacity-100'
                                    }`}
                                >
                                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>

                        {/* Main Image with Zoom */}
                        <div 
                            className="flex-1 relative h-[400px] sm:h-[550px] bg-gray-100 rounded-3xl overflow-hidden border border-gray-200 shadow-lg cursor-crosshair group"
                            onMouseEnter={() => setIsZoomed(true)}
                            onMouseLeave={() => setIsZoomed(false)}
                            onMouseMove={handleMouseMove}
                        >
                            <img
                                src={selectedImage}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-200 ease-out"
                                style={{
                                    transform: isZoomed ? 'scale(2.2)' : 'scale(1)',
                                    transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`
                                }}
                            />

                            {/* Zoom Badge / Indicator */}
                            <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 pointer-events-none transition-opacity group-hover:opacity-0">
                                <ZoomIn className="w-3.5 h-3.5" /> Hover to zoom willow grain
                            </div>

                            {/* Stock Badge */}
                            <div className="absolute top-4 left-4 bg-indigo-600 text-white font-black text-xs px-3 py-1.5 rounded-lg shadow-md pointer-events-none uppercase tracking-wider">
                                {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                            </div>

                            {/* Wishlist Button */}
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
                                className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-full shadow-lg hover:scale-110 transition-all z-10 group/btn"
                                title={wishlistIds.includes(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                            >
                                <Heart className={`w-5 h-5 transition-colors ${wishlistIds.includes(product.id) ? 'fill-rose-500 text-rose-500' : 'text-gray-600 group-hover/btn:text-rose-500'}`} />
                            </button>
                        </div>
                    </div>

                    {/* Right: Product Details & Buying Actions (5 cols) */}
                    <div className="lg:col-span-5 flex flex-col justify-between">
                        <div>
                            {/* Category & Rating */}
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                                    {product.category?.name || 'Cricket Equipment'}
                                </span>
                                <div className="flex items-center gap-1 bg-yellow-100 px-2.5 py-1 rounded-lg text-xs font-bold text-yellow-800">
                                    <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                                    <span>4.9 (128 Reviews)</span>
                                </div>
                            </div>

                            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight mb-4">
                                {product.name}
                            </h1>

                            {/* Price */}
                            <div className="flex items-baseline gap-4 mb-6 pb-6 border-b border-gray-100">
                                <span className="text-4xl font-black text-gray-900">₹{product.price}</span>
                                <span className="text-lg text-gray-400 line-through font-semibold">₹{(Number(product.price) * 1.25).toFixed(2)}</span>
                                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-md">20% OFF</span>
                            </div>

                            {/* Description */}
                            <p className="text-gray-600 text-base leading-relaxed mb-6">
                                {product.description || 'Engineered with professional-grade English Willow, delivering superior punch, optimal balance, and massive sweet spot for explosive shot-making across the ground.'}
                            </p>

                            {/* Size / Handle Selector */}
                            <div className="mb-6">
                                <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2">
                                    Select Handle Size
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {['SH (Short Handle)', 'LH (Long Handle)', 'Harrow (Youth)'].map(size => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`py-2.5 px-3 rounded-xl font-bold text-xs border-2 transition-all ${
                                                selectedSize === size
                                                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm'
                                                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                                            }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Willow Specifications Box */}
                            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 mb-8 space-y-2.5">
                                <div className="flex items-center gap-2 text-xs font-black text-gray-800 uppercase tracking-wider mb-1">
                                    <Sparkles className="w-4 h-4 text-indigo-600" /> Pro Specifications
                                </div>
                                <div className="grid grid-cols-2 gap-y-2 text-xs">
                                    <div><span className="text-gray-400">Willow Grade:</span> <span className="font-semibold text-gray-800">Grade 1 English</span></div>
                                    <div><span className="text-gray-400">Sweet Spot:</span> <span className="font-semibold text-gray-800">Mid-to-Low Profile</span></div>
                                    <div><span className="text-gray-400">Handle:</span> <span className="font-semibold text-gray-800">9-Piece Sarawak Cane</span></div>
                                    <div><span className="text-gray-400">Weight:</span> <span className="font-semibold text-gray-800">1140g - 1180g</span></div>
                                </div>
                            </div>
                        </div>

                        {/* Quantity & Buy Buttons */}
                        <div className="space-y-4 pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-4">
                                <span className="text-xs font-black text-gray-700 uppercase tracking-wider">Quantity:</span>
                                <div className="flex items-center border-2 border-gray-200 rounded-xl bg-white">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 font-black text-lg transition-colors rounded-l-lg"
                                    >-</button>
                                    <span className="px-5 font-black text-gray-900 text-base">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 font-black text-lg transition-colors rounded-r-lg"
                                    >+</button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={product.stock <= 0}
                                    className="w-full bg-indigo-50 border-2 border-indigo-600 text-indigo-700 font-bold py-4 rounded-2xl hover:bg-indigo-100 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                                >
                                    <ShoppingBag className="w-5 h-5" /> Add to Cart
                                </button>
                                <button
                                    onClick={handleBuyNow}
                                    disabled={product.stock <= 0}
                                    className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    Buy Now <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Trust Badges */}
                            <div className="grid grid-cols-3 gap-2 pt-4">
                                <div className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-xl">
                                    <Truck className="w-5 h-5 text-indigo-600 mb-1" />
                                    <span className="text-[11px] font-bold text-gray-800">Free Express Delivery</span>
                                </div>
                                <div className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-xl">
                                    <ShieldCheck className="w-5 h-5 text-indigo-600 mb-1" />
                                    <span className="text-[11px] font-bold text-gray-800">100% Genuine Willow</span>
                                </div>
                                <div className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-xl">
                                    <RotateCcw className="w-5 h-5 text-indigo-600 mb-1" />
                                    <span className="text-[11px] font-bold text-gray-800">7-Day Easy Replacement</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products Section */}
                {relatedProducts && relatedProducts.length > 0 && (
                    <div className="mt-24 pt-16 border-t border-gray-200">
                        <div className="flex justify-between items-end mb-8">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900">Similar Cricket Gear</h2>
                                <p className="text-gray-500 text-sm mt-1">Recommended gear from {product.category?.name || 'our collection'}</p>
                            </div>
                            <Link href="/products" className="text-indigo-600 font-bold text-sm hover:underline flex items-center gap-1">
                                View All <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map(rel => (
                                <div key={rel.id} className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100 flex flex-col justify-between">
                                    <div>
                                        <div className="relative h-56 rounded-xl overflow-hidden mb-4 bg-gray-100">
                                            <Link href={`/products/${rel.slug || rel.id}`}>
                                                <img 
                                                    src={rel.image || 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=800&q=80'} 
                                                    alt={rel.name} 
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </Link>
                                            <div className="absolute top-3 left-3 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow pointer-events-none">
                                                ₹{rel.price}
                                            </div>
                                            <button 
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    const res = toggleWishlist(rel);
                                                    if (res.isAdded) {
                                                        toast.success(`${rel.name} added to wishlist!`);
                                                    } else {
                                                        toast.info(`${rel.name} removed from wishlist`);
                                                    }
                                                }}
                                                className="absolute top-3 right-3 bg-white p-2.5 rounded-full shadow-md hover:scale-110 transition-all z-10"
                                                title={wishlistIds.includes(rel.id) ? "Remove from wishlist" : "Add to wishlist"}
                                            >
                                                <Heart className={`w-5 h-5 transition-colors ${wishlistIds.includes(rel.id) ? 'fill-rose-500 text-rose-500' : 'text-gray-400 hover:text-rose-500'}`} />
                                            </button>
                                        </div>
                                        <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
                                            {rel.category?.name || 'Equipment'}
                                        </div>
                                        <Link href={`/products/${rel.slug || rel.id}`}>
                                            <h3 className="font-bold text-gray-900 mb-1 text-base leading-tight line-clamp-2 hover:text-indigo-600 transition-colors">{rel.name}</h3>
                                        </Link>
                                    </div>
                                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                                        <span className="text-lg font-black text-gray-900">₹{rel.price}</span>
                                        <button 
                                            onClick={() => {
                                                addToCart(rel);
                                                toast.success(`${rel.name} added to cart!`);
                                            }}
                                            className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors flex items-center gap-1 shadow"
                                        >
                                            <ShoppingBag className="w-3.5 h-3.5" /> Add
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </EcommerceLayout>
    );
}
