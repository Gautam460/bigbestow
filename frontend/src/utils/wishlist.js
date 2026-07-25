const WISHLIST_KEY = 'bigbestow_wishlist_items';

export function getWishlist() {
    if (typeof window === 'undefined') return [];
    try {
        const items = localStorage.getItem(WISHLIST_KEY);
        return items ? JSON.parse(items) : [];
    } catch (e) {
        console.error('Error reading wishlist from localStorage', e);
        return [];
    }
}

export function saveWishlist(items) {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
        window.dispatchEvent(new CustomEvent('wishlist-updated', { detail: items }));
    } catch (e) {
        console.error('Error saving wishlist to localStorage', e);
    }
}

export function toggleWishlist(product) {
    const wishlist = getWishlist();
    const existingIndex = wishlist.findIndex(item => item.id === product.id);

    let isAdded = false;
    if (existingIndex > -1) {
        wishlist.splice(existingIndex, 1);
        isAdded = false;
    } else {
        wishlist.push({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            category: typeof product.category === 'string' ? product.category : (product.category?.name || 'Equipment'),
            slug: product.slug || product.id,
        });
        isAdded = true;
    }

    saveWishlist(wishlist);
    return { wishlist, isAdded };
}

export function isInWishlist(productId) {
    const wishlist = getWishlist();
    return wishlist.some(item => item.id === productId);
}

export function removeFromWishlist(productId) {
    const wishlist = getWishlist().filter(item => item.id !== productId);
    saveWishlist(wishlist);
    return wishlist;
}
