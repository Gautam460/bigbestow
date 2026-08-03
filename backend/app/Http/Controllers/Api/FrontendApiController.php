<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use App\Models\Category;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FrontendApiController extends Controller
{
    public function home()
    {
        $featuredProducts = Product::with('category')
            ->where('status', true)
            ->latest()
            ->take(8)
            ->get();

        $categories = Category::with(['subcategories', 'products' => function($q) {
            $q->where('status', true)->latest()->take(8);
        }])
            ->withCount('products')
            ->where('status', true)
            ->get();

        $banners = Banner::where('status', true)->latest()->get();

        return response()->json([
            'success' => true,
            'featuredProducts' => $featuredProducts,
            'categories' => $categories,
            'banners' => $banners,
        ]);
    }

    public function products(Request $request)
    {
        $query = Product::with(['category', 'subcategory'])->where('status', true);

        if ($request->filled('category') && $request->category !== 'all') {
            $catSlug = $request->category;
            if ($catSlug === 'sale') {
                $query->where('is_sale', true);
            } else {
                $query->whereHas('category', function ($q) use ($catSlug) {
                    $q->where('slug', $catSlug)
                        ->orWhere('id', $catSlug)
                        ->orWhere('name', 'like', "%{$catSlug}%");
                });
            }
        }

        if ($request->filled('subcategory') && $request->subcategory !== 'all') {
            $subSlug = $request->subcategory;
            $query->whereHas('subcategory', function ($q) use ($subSlug) {
                $q->where('slug', $subSlug)
                    ->orWhere('id', $subSlug)
                    ->orWhere('name', 'like', "%{$subSlug}%");
            });
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $products = $query->latest()->get();
        $categories = Category::with('subcategories')->withCount('products')->where('status', true)->get();

        return response()->json([
            'success' => true,
            'products' => $products,
            'categories' => $categories,
            'filters' => $request->only(['category', 'subcategory', 'search']),
        ]);
    }

    public function show($slug)
    {
        $product = Product::with(['category', 'subcategory'])
            ->where('status', true)
            ->where(function ($query) use ($slug) {
                $query->where('slug', $slug)
                    ->orWhere('id', $slug);
            })
            ->first();

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found',
            ], 404);
        }

        $relatedProducts = Product::with('category')
            ->where('status', true)
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->take(4)
            ->get();

        return response()->json([
            'success' => true,
            'product' => $product,
            'relatedProducts' => $relatedProducts,
        ]);
    }

    public function applyCoupon(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
            'subtotal' => 'required|numeric|min:0',
        ]);

        $coupon = Coupon::where('code', strtoupper(trim($request->code)))->first();

        if (!$coupon) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid promo code. Please check and try again.',
            ], 400);
        }

        [$isValid, $message] = $coupon->isValid($request->subtotal);

        if (!$isValid) {
            return response()->json([
                'success' => false,
                'message' => $message,
            ], 400);
        }

        $discountAmount = $coupon->calculateDiscount($request->subtotal);

        return response()->json([
            'success' => true,
            'message' => $message,
            'coupon' => [
                'code' => $coupon->code,
                'discount_type' => $coupon->discount_type,
                'discount_value' => $coupon->discount_value,
                'discount_amount' => $discountAmount,
                'min_order_amount' => $coupon->min_order_amount,
            ],
        ]);
    }

    public function placeOrder(Request $request)
    {
        \Log::info('Checkout items received before validation: ', $request->input('items') ?? []);
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'required|string|max:20',
            'shipping_address' => 'required|string|max:500',
            'payment_method' => 'required|in:cod,online',
            'notes' => 'nullable|string|max:500',
            'coupon_code' => 'nullable|string|max:50',
            'discount_amount' => 'nullable|numeric|min:0',
            'items' => 'required|array|min:1',
            'items.*.id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
            'items.*.name' => 'required|string',
        ]);

        \Log::info('Checkout items received: ', $request->input('items'));

        return DB::transaction(function () use ($validated) {
            $totalAmount = 0;
            foreach ($validated['items'] as $item) {
                $totalAmount += ($item['price'] * $item['quantity']);
            }

            $discountAmount = 0;
            $couponCode = null;

            if (!empty($validated['coupon_code'])) {
                $coupon = Coupon::where('code', strtoupper(trim($validated['coupon_code'])))->first();
                if ($coupon) {
                    [$isValid] = $coupon->isValid($totalAmount);
                    if ($isValid) {
                        $discountAmount = $coupon->calculateDiscount($totalAmount);
                        $couponCode = $coupon->code;
                        $coupon->increment('used_count');
                    }
                }
            }

            $discountedAmount = max(0, $totalAmount - $discountAmount);
            $tax = round($discountedAmount * 0.05, 2);
            $finalTotal = round($discountedAmount + $tax, 2);

            $order = Order::create([
                'user_id' => auth('sanctum')->id() ?? null,
                'customer_name' => $validated['customer_name'],
                'customer_email' => $validated['customer_email'],
                'customer_phone' => $validated['customer_phone'],
                'total_amount' => $finalTotal,
                'coupon_code' => $couponCode,
                'discount_amount' => $discountAmount,
                'status' => 'pending',
                'payment_status' => $validated['payment_method'] === 'online' ? 'paid' : 'pending',
                'payment_method' => $validated['payment_method'],
                'shipping_address' => $validated['shipping_address'],
                'notes' => $validated['notes'] ?? null,
            ]);

            foreach ($validated['items'] as $item) {
                $subtotal = $item['price'] * $item['quantity'];
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['id'],
                    'product_name' => $item['name'],
                    'price' => $item['price'],
                    'quantity' => $item['quantity'],
                    'subtotal' => $subtotal,
                    'attributes' => $item['attributes'] ?? null,
                ]);

                Product::where('id', $item['id'])->decrement('stock', $item['quantity']);
            }

            return response()->json([
                'success' => true,
                'message' => 'Order placed successfully!',
                'order_id' => $order->id,
                'order' => $order->load('items'),
            ]);
        });
    }

    public function orderSuccess($id)
    {
        $order = Order::with('items')->find($id);

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'order' => $order,
        ]);
    }

    public function myOrders(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        $orders = Order::with('items')
            ->where('user_id', $user->id)
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'orders' => $orders,
        ]);
    }

    public function showOrder(Request $request, $id)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        $order = Order::with('items')
            ->where('user_id', $user->id)
            ->find($id);

        if (!$order) {
            return response()->json(['success' => false, 'message' => 'Order not found'], 404);
        }

        return response()->json([
            'success' => true,
            'order' => $order,
        ]);
    }

    public function cancelOrder(Request $request, $id)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        $order = Order::where('user_id', $user->id)->find($id);

        if (!$order) {
            return response()->json(['success' => false, 'message' => 'Order not found'], 404);
        }

        if (in_array($order->status, ['pending', 'processing'])) {
            $order->update(['status' => 'cancelled']);

            return response()->json([
                'success' => true,
                'message' => 'Order #' . $order->id . ' has been cancelled successfully.',
                'order' => $order,
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'This order cannot be cancelled as it is already ' . $order->status . '.',
        ], 400);
    }
}
