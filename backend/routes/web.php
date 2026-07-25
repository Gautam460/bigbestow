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

// Redirect public web routes to Next.js frontend or return JSON API response
Route::get('/', [FrontendController::class, 'home'])->name('home');
// Route::get('/products', [FrontendController::class, 'products'])->name('products');
// Route::get('/products/{slug}', [FrontendController::class, 'show'])->name('products.show');

Route::get('/checkout', [FrontendController::class, 'checkout'])->name('checkout');
Route::post('/checkout/order', [FrontendController::class, 'placeOrder'])->name('checkout.order');
Route::get('/orders/success/{id}', [FrontendController::class, 'orderSuccess'])->name('orders.success');
Route::post('/coupons/apply', [FrontendController::class, 'applyCoupon'])->name('coupons.apply');

Route::get('/about', fn() => response()->json(['page' => 'About', 'frontend' => "/about"]))->name('about');
Route::get('/contact', fn() => response()->json(['page' => 'Contact', 'frontend' => "/contact"]))->name('contact');
Route::get('/cart', fn() => response()->json(['page' => 'Cart', 'frontend' => "/cart"]))->name('cart');
Route::get('/wishlist', fn() => response()->json(['page' => 'Wishlist', 'frontend' => "/wishlist"]))->name('wishlist');
Route::get('/faq', fn() => response()->json(['page' => 'FAQ', 'frontend' => "/faq"]))->name('faq');
Route::get('/careers', fn() => response()->json(['page' => 'Careers', 'frontend' => "/careers"]))->name('careers');
Route::get('/privacy', fn() => response()->json(['page' => 'Privacy', 'frontend' => "/privacy"]))->name('privacy');
Route::get('/returns', fn() => response()->json(['page' => 'Returns', 'frontend' => "/returns"]))->name('returns');
Route::get('/shipping', fn() => response()->json(['page' => 'Shipping', 'frontend' => "/shipping"]))->name('shipping');
Route::get('/stores', fn() => response()->json(['page' => 'Stores', 'frontend' => "/stores"]))->name('stores');
Route::get('/terms', fn() => response()->json(['page' => 'Terms', 'frontend' => "/terms"]))->name('terms');
Route::get('/track', fn() => response()->json(['page' => 'Track', 'frontend' => "/track"]))->name('track');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $orders = Order::with('items')->where('user_id', auth()->id())->latest()->take(5)->get();
        $recommendedProducts = Product::with('category')->inRandomOrder()->take(4)->get();

        return response()->json([
            'success' => true,
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
// NOTE: Login/Logout is now handled via API routes (routes/api.php)
// =========================================================================
// Route::get('/admin/login', [AuthController::class, 'showLoginForm'])->name('admin.login');
// Route::post('/admin/login', [AuthController::class, 'login']); // REMOVED - method doesn't exist
// Route::post('/admin/logout', [AuthController::class, 'logout'])->name('admin.logout');

// Route::middleware(['admin'])->prefix('admin')->name('admin.')->group(function () {
//     Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
//     Route::get('/dashboard', [DashboardController::class, 'index']);

//     Route::resource('products', ProductController::class);
//     Route::resource('categories', CategoryController::class);
//     Route::resource('subcategories', SubcategoryController::class);
//     Route::resource('orders', OrderController::class);
//     Route::resource('users', UserController::class);
//     Route::resource('coupons', CouponController::class);
//     Route::resource('banners', BannerController::class);
//     Route::resource('inventory', InventoryController::class);
// });

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

    try {
        Artisan::call('storage:link');
        $output[] = '✅ Artisan storage:link output: '.Artisan::output();
    } catch (Throwable $e) {
        $output[] = '❌ Artisan storage:link failed: '.$e->getMessage().' in '.$e->getFile().':'.$e->getLine();

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
