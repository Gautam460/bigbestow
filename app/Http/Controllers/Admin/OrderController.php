<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        // Placeholder for now, will connect to Order model later
        return Inertia::render('Admin/Orders/Index', [
            'orders' => []
        ]);
    }

    public function show($id)
    {
        return Inertia::render('Admin/Orders/Show', [
            'orderId' => $id
        ]);
    }
}
