<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * सामान्य यूज़र (Customer/User) के लिए लॉगिन
     */
    public function userLogin(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($request->only('email', 'password'))) {
            if ($request->hasSession()) {
                $request->session()->regenerate();
            }

            $user = Auth::user();
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'message' => 'User logged in successfully',
                'user' => $user,
                'token' => $token,
                'roles' => $user->getRoleNames(),
            ]);
        }

        throw ValidationException::withMessages([
            'email' => ['Invalid email or password! Please enter correct credentials.'],
        ]);
    }

    /**
     * Superadmin और Admin के लिए अलग लॉगिन
     */
    public function adminLogin(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($request->only('email', 'password'))) {
            $user = Auth::user();

            // चेक करें कि यूज़र के पास superadmin या admin रोल है या नहीं
            if (! $user->hasRole(['superadmin', 'admin', 'Super Admin', 'Admin'])) {
                if (Auth::guard('web')->check()) {
                    Auth::guard('web')->logout();
                }
                if ($request->hasSession()) {
                    $request->session()->invalidate();
                    $request->session()->regenerateToken();
                }

                throw ValidationException::withMessages([
                    'email' => ['Access Denied: You do not have Superadmin or Admin permissions!'],
                ]);
            }

            if ($request->hasSession()) {
                $request->session()->regenerate();
            }

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'message' => 'Admin logged in successfully',
                'user' => $user,
                'token' => $token,
                'roles' => $user->getRoleNames(),
            ]);
        }

        throw ValidationException::withMessages([
            'email' => ['Invalid email or password! Please enter correct credentials.'],
        ]);
    }

    /**
     * लॉगआउट (Logout)
     */
    public function logout(Request $request)
    {
        if (Auth::guard('web')->check()) {
            Auth::guard('web')->logout();
        }
        if ($request->hasSession()) {
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }
        if ($request->user() && method_exists($request->user(), 'currentAccessToken') && $request->user()->currentAccessToken()) {
            $request->user()->currentAccessToken()->delete();
        }

        return response()->json(['message' => 'Logged out successfully']);
    }
}
