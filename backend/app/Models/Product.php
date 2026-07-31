<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $guarded = [];

    protected $casts = [
        'gallery' => 'array',
        'sizes' => 'array',
        'status'  => 'boolean',
        'is_sale' => 'boolean',
    ];

    protected $appends = ['image_url'];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function subcategory()
    {
        return $this->belongsTo(Subcategory::class);
    }

    /**
     * Always return a clean relative /storage/... path.
     * External URLs (Unsplash, CDN) are returned as-is.
     */
    public function getImageUrlAttribute(): ?string
    {
        if (!$this->image) return null;

        $image = $this->image;

        // Full URL with /storage/ in it (e.g. http://127.0.0.1:8000/storage/products/file.jpg)
        // → strip host, keep /storage/... relative path
        if (preg_match('#^https?://[^/]+(/storage/.+)$#', $image, $m)) {
            return $m[1];
        }

        // Any other full URL (Unsplash, CDN, external) — return as-is
        if (preg_match('#^https?://#', $image)) {
            return $image;
        }

        // Already a clean /storage/... relative path
        if (str_starts_with($image, '/storage/')) {
            return $image;
        }

        // Plain relative path — prepend /storage/
        return '/storage/' . ltrim($image, '/');
    }
}
