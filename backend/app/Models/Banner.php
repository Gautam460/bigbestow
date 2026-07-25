<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Banner extends Model
{
    protected $fillable = [
        'title',
        'image',
        'link',
        'status',
    ];

    protected $casts = [
        'status' => 'boolean',
    ];

    protected $appends = ['image_url'];

    /**
     * Always return a clean relative /storage/... path
     * regardless of what was stored in the DB.
     * External URLs (Unsplash, CDN) are returned as-is.
     */
    public function getImageUrlAttribute(): ?string
    {
        if (!$this->image) return null;

        $image = $this->image;

        // Full URL with /storage/ in it (e.g. http://127.0.0.1:8000/storage/products/file.jpg)
        // → strip the host, keep /storage/... relative path
        if (preg_match('#^https?://[^/]+(/storage/.+)$#', $image, $m)) {
            return $m[1];
        }

        // Any other full URL (Unsplash, CDN, external) — return as-is
        if (preg_match('#^https?://#', $image)) {
            return $image;
        }

        // Already a clean relative /storage/... path
        if (str_starts_with($image, '/storage/')) {
            return $image;
        }

        // Plain relative path (no leading /storage/) — prepend it
        return '/storage/' . ltrim($image, '/');
    }
}
