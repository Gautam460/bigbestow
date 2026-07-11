<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function showLoginForm()
    {
        return Inertia::render('Admin/Auth/Login');
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if (Auth::guard('admin')->attempt($request->only('email', 'password'), $request->boolean('remember'))) {
            $user = Auth::guard('admin')->user();

            // Check if user has admin privileges
            if ($user->hasRole(['superadmin', 'admin', 'Super Admin', 'Admin'])) {
                $request->session()->regenerate();

                return redirect()->intended('/admin/dashboard');
            }

            // If not admin, log out and throw error
            Auth::guard('admin')->logout();
            throw ValidationException::withMessages([
                'email' => 'These credentials do not have administrative access.',
            ]);
        }

        throw ValidationException::withMessages([
            'email' => trans('auth.failed'),
        ]);
    }

    public function logout(Request $request)
    {
        Auth::guard('admin')->logout();
        $request->session()->regenerateToken();

        return redirect('/admin/login');
    }
}
