<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home');
})->name('home');

Route::get('/products', function () {
    return Inertia::render('Products');
})->name('products');

Route::get('/about', function () {
    return Inertia::render('About');
})->name('about');

Route::get('/contact', function () {
    return Inertia::render('Contact');
})->name('contact');

Route::get('/cart', function () {
    return Inertia::render('Cart');
})->name('cart');

Route::get('/wishlist', function () {
    return Inertia::render('Wishlist');
})->name('wishlist');

Route::get('/faq', function () {
    return Inertia::render('FAQ');
})->name('faq');

Route::get('/careers', function () {
    return Inertia::render('Careers');
})->name('careers');

Route::get('/privacy', function () {
    return Inertia::render('Privacy');
})->name('privacy');

Route::get('/returns', function () {
    return Inertia::render('Returns');
})->name('returns');

Route::get('/shipping', function () {
    return Inertia::render('Shipping');
})->name('shipping');

Route::get('/stores', function () {
    return Inertia::render('Stores');
})->name('stores');

Route::get('/terms', function () {
    return Inertia::render('Terms');
})->name('terms');

Route::get('/track', function () {
    return Inertia::render('Track');
})->name('track');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
