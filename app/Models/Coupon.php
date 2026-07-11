<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
    protected $fillable = [
        'code',
        'discount_type',
        'discount_value',
        'min_order_amount',
        'max_uses',
        'used_count',
        'expiry_date',
        'status',
    ];

    protected $casts = [
        'discount_value' => 'decimal:2',
        'min_order_amount' => 'decimal:2',
        'max_uses' => 'integer',
        'used_count' => 'integer',
        'expiry_date' => 'date',
        'status' => 'boolean',
    ];

    public function isValid($subtotal = 0)
    {
        if (! $this->status) {
            return [false, 'This coupon code is inactive or disabled.'];
        }

        if ($this->expiry_date && now()->isAfter($this->expiry_date->endOfDay())) {
            return [false, 'This coupon code has expired.'];
        }

        if ($this->min_order_amount > 0 && $subtotal < $this->min_order_amount) {
            return [false, 'Minimum order amount of ₹'.number_format($this->min_order_amount, 2).' is required for this promo code.'];
        }

        if ($this->max_uses !== null && $this->used_count >= $this->max_uses) {
            return [false, 'This coupon code has reached its maximum usage limit.'];
        }

        return [true, 'Coupon applied successfully!'];
    }

    public function calculateDiscount($subtotal)
    {
        if ($this->discount_type === 'percent') {
            $discount = round(($subtotal * $this->discount_value) / 100, 2);

            return min($discount, $subtotal);
        }

        return min($this->discount_value, $subtotal);
    }
}
