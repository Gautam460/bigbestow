<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\SubcategoryController;
use App\Http\Controllers\Api\InventoryController;
use App\Http\Controllers\Api\AdminOrderController;
use App\Http\Controllers\Api\AdminCouponController;
use App\Http\Controllers\Api\AdminUserController;
use App\Http\Controllers\Api\AdminBannerController;
use App\Http\Controllers\Api\AdminPermissionController;
use App\Http\Controllers\Api\AdminSettingsController;
use App\Http\Controllers\Api\FrontendApiController;
use App\Http\Controllers\Api\AdminSubscriberController;
use App\Http\Controllers\Api\AdminContactQueryController;

/*
|--------------------------------------------------------------------------
| Public APIs
|--------------------------------------------------------------------------
*/

Route::get('/home', [FrontendApiController::class, 'home']);
Route::get('/products', [FrontendApiController::class, 'products']);
Route::get('/products/{slug}', [FrontendApiController::class, 'show']);
Route::post('/coupons/apply', [FrontendApiController::class, 'applyCoupon']);
Route::post('/checkout/order', [FrontendApiController::class, 'placeOrder']);
Route::get('/orders/success/{id}', [FrontendApiController::class, 'orderSuccess']);
Route::get('/settings', [AdminSettingsController::class, 'public']);
Route::get('/pages/{slug}', [\App\Http\Controllers\Api\PageController::class, 'show']);
Route::post('/subscribe', function (Request $request) {
    $request->validate(['email' => 'required|email']);
    \App\Models\Subscriber::firstOrCreate(['email' => $request->email]);
    return response()->json(['message' => 'Subscribed successfully']);
});
Route::post('/contact', function (Request $request) {
    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|max:255',
        'phone' => 'nullable|string|max:255',
        'subject' => 'nullable|string|max:255',
        'comment' => 'required|string',
    ]);
    \App\Models\ContactQuery::create($request->only(['name', 'email', 'phone', 'subject', 'comment']));
    return response()->json(['message' => 'Query submitted successfully']);
});

/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
*/

Route::prefix('user')->group(function () {
    Route::post('/login', [AuthController::class, 'userLogin']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

Route::prefix('admin')->group(function () {
    Route::post('/login', [AuthController::class, 'adminLogin']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

/*
|--------------------------------------------------------------------------
| User Protected APIs
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->prefix('user')->group(function () {

    Route::get('/', function (Request $request) {
        return $request->user();
    });

    Route::get('/profile', function (Request $request) {
        return $request->user();
    });

    Route::get('/orders', [FrontendApiController::class, 'myOrders']);
    Route::get('/orders/{id}', [FrontendApiController::class, 'showOrder']);
    Route::post('/orders/{id}/cancel', [FrontendApiController::class, 'cancelOrder']);
});

/*
|--------------------------------------------------------------------------
| Admin Protected APIs
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->prefix('admin')->group(function () {

    Route::apiResource('products', ProductController::class);

    Route::apiResource('orders', AdminOrderController::class);

    Route::apiResource('coupons', AdminCouponController::class);

    Route::apiResource('users', AdminUserController::class);

    Route::apiResource('banners', AdminBannerController::class);

    Route::apiResource('categories', CategoryController::class);

    Route::apiResource('subcategories', SubcategoryController::class);

    Route::apiResource('subscribers', AdminSubscriberController::class)->only(['index', 'destroy']);

    Route::apiResource('contact-queries', AdminContactQueryController::class)->only(['index', 'destroy']);

    Route::apiResource('pages', App\Http\Controllers\Api\AdminPageController::class);

    Route::get('/inventory', [InventoryController::class, 'index']);
    Route::put('/inventory/{product}', [InventoryController::class, 'update']);

    Route::get('/permissions', [AdminPermissionController::class, 'index']);
    Route::post('/permissions/roles', [AdminPermissionController::class, 'storeRole']);
    Route::put('/permissions/roles/{role}', [AdminPermissionController::class, 'updateRole']);
    Route::delete('/permissions/roles/{role}', [AdminPermissionController::class, 'destroyRole']);

    Route::get('/settings', [AdminSettingsController::class, 'index']);
    Route::put('/settings', [AdminSettingsController::class, 'update']);
});