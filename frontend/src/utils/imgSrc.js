/**
 * getImgSrc — Universal image URL resolver
 *
 * Rules (in priority order):
 * 1. null/empty          → fallback image
 * 2. /storage/...        → relative path (proxied to Laravel)
 * 3. https://...         → external CDN/Unsplash → returned as-is
 * 4. http://host/storage/... → strip host → /storage/...
 * 5. http://...          → leave as-is (unusual but safe)
 * 6. /some/path          → returned as-is (relative non-storage path)
 * 7. plain-filename      → prepend /storage/
 *
 * Usage:  <img src={getImgSrc(product.image)} />
 *         <img src={getImgSrc(banner.image_url)} />
 */

const DEFAULT_FALLBACK = '/storage/products/zpFivxzYc24CTUi18ZGbUdRWvIJ4gFzgX9quy4SQ.webp';

export function getImgSrc(image, fallback = null) {
    if (!image) return fallback || DEFAULT_FALLBACK;

    // 1. Already a clean relative /storage/ path
    if (image.startsWith('/storage/')) return image;

    // 2. External https:// URL (Unsplash, CDN, etc.) — use as-is
    if (image.startsWith('https://')) return image;

    // 3. http://host/storage/file.jpg → /storage/file.jpg
    const storageMatch = image.match(/^https?:\/\/[^/]+(\/storage\/.+)$/);
    if (storageMatch) return storageMatch[1];

    // 4. Any other http:// URL — use as-is
    if (image.startsWith('http://')) return image;

    // 5. Any other absolute path (starts with /) — return as-is
    if (image.startsWith('/')) return image;

    // 6. Plain filename or relative path — prepend /storage/
    return `/storage/${image}`;
}

export default getImgSrc;
