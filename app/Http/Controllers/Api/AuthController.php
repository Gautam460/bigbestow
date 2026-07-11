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
            $request->session()->regenerate();

            return response()->json([
                'message' => 'User logged in successfully',
                'user' => Auth::user(),
                'roles' => Auth::user()->getRoleNames(),
            ]);
        }

        throw ValidationException::withMessages([
            'email' => ['गलत ईमेल या पासवर्ड! कृपया सही क्रेडेंशियल्स दर्ज करें।'],
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
                Auth::guard('web')->logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();

                throw ValidationException::withMessages([
                    'email' => ['Access Denied: आपके पास Superadmin या Admin की अनुमति (Permission) नहीं है!'],
                ]);
            }

            $request->session()->regenerate();

            return response()->json([
                'message' => 'Admin logged in successfully',
                'user' => $user,
                'roles' => $user->getRoleNames(),
            ]);
        }

        throw ValidationException::withMessages([
            'email' => ['गलत ईमेल या पासवर्ड! कृपया सही क्रेडेंशियल्स दर्ज करें।'],
        ]);
    }

    /**
     * लॉगआउट (Logout)
     */
    public function logout(Request $request)
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Logged out successfully']);
    }
}
