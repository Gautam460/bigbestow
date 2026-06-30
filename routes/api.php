<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\AuthController;

// Auth Routes
Route::get('/login', function() { return response()->json(['message' => 'Please use POST to login.'], 405); });
Route::get('/admin/login', function() { return response()->json(['message' => 'Please use POST to login.'], 405); });
Route::post('/login', [AuthController::class, 'userLogin']);
Route::post('/admin/login', [AuthController::class, 'adminLogin']);
Route::post('/logout', [AuthController::class, 'logout']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::apiResource('categories', CategoryController::class);
