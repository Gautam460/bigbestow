const CART_KEY = 'bigbestow_cart_items';

export function getCart() {
    if (typeof window === 'undefined') return [];
    try {
        const items = localStorage.getItem(CART_KEY);
        return items ? JSON.parse(items) : [];
    } catch (e) {
        console.error('Error reading cart from localStorage', e);
        return [];
    }
}

export function saveCart(items) {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(CART_KEY, JSON.stringify(items));
        window.dispatchEvent(new CustomEvent('cart-updated', { detail: items }));
    } catch (e) {
        console.error('Error saving cart to localStorage', e);
    }
}

export function addToCart(product, quantity = 1, attributes = null) {
    const cart = getCart();
    const existingIndex = cart.findIndex(item => item.id === product.id);

    if (existingIndex > -1) {
        cart[existingIndex].quantity += quantity;
        if (attributes) {
            cart[existingIndex].attributes = attributes;
        }
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            image: product.image,
            quantity: quantity,
            attributes: attributes || { size: 'Standard', color: 'Default' },
        });
    }

    saveCart(cart);
    return cart;
}

export function updateQuantity(productId, quantity) {
    let cart = getCart();
    if (quantity <= 0) {
        cart = cart.filter(item => item.id !== productId);
    } else {
        const item = cart.find(item => item.id === productId);
        if (item) {
            item.quantity = quantity;
        }
    }
    saveCart(cart);
    return cart;
}

export function removeFromCart(productId) {
    const cart = getCart().filter(item => item.id !== productId);
    saveCart(cart);
    return cart;
}

export function clearCart() {
    saveCart([]);
}

export function getCartSummary() {
    const cart = getCart();
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const tax = subtotal * 0.05;
    const total = subtotal + tax;
    const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    return {
        items: cart,
        subtotal,
        tax,
        total,
        itemCount,
    };
}
