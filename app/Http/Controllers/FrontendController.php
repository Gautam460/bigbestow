<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\Banner;
use Inertia\Inertia;
use Illuminate\Http\Request;

class FrontendController extends Controller
{
    public function home()
    {
        $featuredProducts = Product::with('category')
            ->where('status', true)
            ->latest()
            ->take(8)
            ->get();

        $categories = Category::withCount('products')
            ->where('status', true)
            ->get();

        return Inertia::render('Home', [
            'featuredProducts' => $featuredProducts,
            'categories' => $categories,
        ]);
    }

    public function products(Request $request)
    {
        $query = Product::with('category')->where('status', true);

        if ($request->filled('category')) {
            $catSlug = $request->category;
            $query->whereHas('category', function ($q) use ($catSlug) {
                $q->where('slug', $catSlug)
                  ->orWhere('name', 'like', "%{$catSlug}%");
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
        $categories = Category::withCount('products')->where('status', true)->get();

        return Inertia::render('Products', [
            'products' => $products,
            'categories' => $categories,
            'filters' => $request->only(['category', 'search']),
        ]);
    }
}
