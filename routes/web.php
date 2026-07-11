<?php

use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\BannerController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\CouponController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\InventoryController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\SubcategoryController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\FrontendController;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [FrontendController::class, 'home'])->name('home');
Route::get('/products', [FrontendController::class, 'products'])->name('products');
Route::get('/products/{slug}', [FrontendController::class, 'show'])->name('products.show');

Route::get('/checkout', [FrontendController::class, 'checkout'])->name('checkout');
Route::post('/checkout/order', [FrontendController::class, 'placeOrder'])->name('checkout.order');
Route::get('/orders/success/{id}', [FrontendController::class, 'orderSuccess'])->name('orders.success');
Route::post('/coupons/apply', [FrontendController::class, 'applyCoupon'])->name('coupons.apply');

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
        $orders = Order::with('items')->where('user_id', auth()->id())->latest()->take(5)->get();
        $recommendedProducts = Product::with('category')->inRandomOrder()->take(4)->get();

        return Inertia::render('dashboard', [
            'orders' => $orders,
            'recommendedProducts' => $recommendedProducts,
        ]);
    })->name('dashboard');

    Route::get('/orders', [FrontendController::class, 'myOrders'])->name('orders.index');
    Route::get('/orders/{id}', [FrontendController::class, 'showOrder'])->name('orders.show');
    Route::post('/orders/{id}/cancel', [FrontendController::class, 'cancelOrder'])->name('orders.cancel');
});

// =========================================================================
// 👑 SUPER ADMIN & STORE ADMIN WEB PORTAL ROUTES
// =========================================================================
Route::get('/admin/login', [AuthController::class, 'showLoginForm'])->name('admin.login');
Route::post('/admin/login', [AuthController::class, 'login']);
Route::post('/admin/logout', [AuthController::class, 'logout'])->name('admin.logout');

Route::middleware(['admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/dashboard', [DashboardController::class, 'index']);

    Route::resource('products', ProductController::class);
    Route::resource('categories', CategoryController::class);
    Route::resource('subcategories', SubcategoryController::class);
    Route::resource('orders', OrderController::class);
    Route::resource('users', UserController::class);
    Route::resource('coupons', CouponController::class);
    Route::resource('banners', BannerController::class);
    Route::resource('inventory', InventoryController::class);
});

// =========================================================================
// 🛠️ TEMPORARY ROUTE TO FIX STORAGE SYMLINK ON SERVER (WITHOUT SSH)
// =========================================================================
Route::get('/fix-storage', function () {
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);

    $output = [];
    $publicStoragePath = public_path('storage');

    $output[] = '<b>PHP Version:</b> '.PHP_VERSION;
    $output[] = '<b>Public Path:</b> '.$publicStoragePath;
    $output[] = '<b>Storage Path:</b> '.storage_path('app/public');

    // 1. Remove old broken symlink or directory if exists
    if (file_exists($publicStoragePath) || is_link($publicStoragePath)) {
        try {
            if (is_link($publicStoragePath)) {
                unlink($publicStoragePath);
            } else {
                File::deleteDirectory($publicStoragePath);
            }
            $output[] = '✅ Old storage link/directory removed successfully.';
        } catch (Throwable $e) {
            $output[] = '⚠️ Warning removing old link: '.$e->getMessage().' in '.$e->getFile().':'.$e->getLine();
        }
    }

    // 2. Run php artisan storage:link
    try {
        Artisan::call('storage:link');
        $output[] = '✅ Artisan storage:link output: '.Artisan::output();
    } catch (Throwable $e) {
        $output[] = '❌ Artisan storage:link failed: '.$e->getMessage().' in '.$e->getFile().':'.$e->getLine();

        // Manual fallback using PHP symlink function
        try {
            $target = storage_path('app/public');
            if (symlink($target, $publicStoragePath)) {
                $output[] = '✅ Manual PHP symlink created successfully!';
            } else {
                $output[] = '❌ symlink() returned false.';
            }
        } catch (Throwable $ex) {
            $output[] = '❌ Manual symlink failed: '.$ex->getMessage().' in '.$ex->getFile().':'.$ex->getLine();
        }
    }

    return implode('<br><br>', $output);
});

require __DIR__.'/settings.php';
