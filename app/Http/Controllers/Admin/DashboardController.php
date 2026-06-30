<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use Inertia\Inertia;

use App\Models\Product;
use App\Models\Category;
use App\Models\Order;
use App\Models\User;

class DashboardController extends Controller
{
    public function index()
    {
        $products = Product::with('category')->latest()->get();
        $totalProducts = Product::count();
        $totalCategories = Category::count();
        $totalOrders = Order::count();
        $totalUsers = User::count();

        $categories = Category::all();

        return Inertia::render('Admin/Dashboard', [
            'products' => $products,
            'categories' => $categories,
            'stats' => [
                'totalProducts' => $totalProducts,
                'totalCategories' => $totalCategories,
                'totalOrders' => $totalOrders,
                'totalUsers' => $totalUsers,
            ]
        ]);
    }
}
