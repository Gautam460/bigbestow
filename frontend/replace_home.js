const fs = require('fs');
const file = 'src/app/page.js';
let content = fs.readFileSync(file, 'utf8');

const stateAddition = `    const [currentSlide, setCurrentSlide] = useState(0);
    const [wishlistIds, setWishlistIds] = useState([]);
    const [activeCategoryTab, setActiveCategoryTab] = useState('all');`;
content = content.replace(/    const \[currentSlide, setCurrentSlide\] = useState\(0\);\n    const \[wishlistIds, setWishlistIds\] = useState\(\[\]\);/, stateAddition);

const startMarker = "            {/* 3. Dynamic Categories from DB */}\n";
const endMarker = "            {/* 5. Promotional Newsletter Banner */}\n";

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
    const newSection = `            {/* 3 & 4. Products by Category Section */}
            <div className="bg-gray-50 dark:bg-slate-900 py-24 border-t border-gray-100 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10">
                        <h2 className="text-4xl font-black text-gray-900 dark:text-white">Our Collection</h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">Explore our premium range of cricket gear</p>
                    </div>

                    {/* Category Tabs */}
                    <div className="flex flex-wrap justify-center gap-4 mb-12">
                        <button
                            onClick={() => setActiveCategoryTab('all')}
                            className={\`px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 \${
                                activeCategoryTab === 'all' 
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                                    : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                            }\`}
                        >
                            All Products
                        </button>
                        {categories && categories.length > 0 && categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setActiveCategoryTab(category.id)}
                                className={\`px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 \${
                                    activeCategoryTab === category.id 
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                                        : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                                }\`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
                                    <div className="col-span-4 text-center py-16 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                                        <p className="text-gray-500 dark:text-gray-400 text-lg">No products available in this category right now.</p>
                                    </div>
                                );
                            }

                            return displayProducts.map(product => (
                                <div key={product.id} className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 group relative overflow-hidden border border-gray-100 dark:border-slate-700 flex flex-col justify-between">
                                    <div>
                                        <div className="relative h-64 rounded-xl overflow-hidden mb-4 bg-gray-100 dark:bg-slate-900">
                                            <Link href={\`/products/\${product.slug || product.id}\`}>
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
                                                        toast.success(\`\${product.name} added to wishlist!\`);
                                                    } else {
                                                        toast.info(\`\${product.name} removed from wishlist\`);
                                                    }
                                                }}
                                                className="absolute top-3 right-3 bg-white dark:bg-slate-800 p-2.5 rounded-full shadow-md hover:scale-110 transition-all z-10"
                                                title={wishlistIds.includes(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                                            >
                                                <Heart className={\`w-5 h-5 transition-colors \${wishlistIds.includes(product.id) ? 'fill-rose-500 text-rose-500' : 'text-gray-400 hover:text-rose-500'}\`} />
                                            </button>
                                            <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out bg-gradient-to-t from-black/70 to-transparent">
                                                <button 
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        addToCart(product);
                                                        toast.success(\`\${product.name} added to cart!\`);
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
                                        <Link href={\`/products/\${product.slug || product.id}\`}>
                                            <h3 className="font-bold text-gray-900 dark:text-white mb-1 text-lg leading-tight line-clamp-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{product.name}</h3>
                                        </Link>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-3">{product.description}</p>
                                        {product.sizes && Array.isArray(product.sizes) && product.sizes.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mb-2">
                                                {product.sizes.map((size) => (
                                                    <span key={size} className="text-[10px] px-2 py-0.5 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 rounded border border-gray-200 dark:border-slate-700">
                                                        {size}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-2 pt-2 border-t border-gray-100 dark:border-slate-700 flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-2xl font-black text-gray-900 dark:text-white">₹{product.price}</span>
                                        </div>
                                        <Link href={\`/products/\${product.slug || product.id}\`} className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">View details</Link>
                                    </div>
                                </div>
                            ));
                        })()}
                    </div>
                    
                    <div className="mt-12 text-center">
                        <Link href="/products" className="inline-flex items-center gap-2 px-8 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 font-bold rounded-full hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
                            View All Products <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* 5. Promotional Newsletter Banner */}\n`;

    content = content.substring(0, startIndex) + newSection + content.substring(endIndex + endMarker.length);
    fs.writeFileSync(file, content);
    console.log("File updated successfully.");
} else {
    console.log("Could not find markers.", startIndex, endIndex);
}
