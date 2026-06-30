<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Product;

class InventoryController extends Controller
{
    public function index()
    {
        $products = Product::with('category')->latest()->get();
        return Inertia::render('Admin/Inventory/Index', [
            'products' => $products
        ]);
    }
}
