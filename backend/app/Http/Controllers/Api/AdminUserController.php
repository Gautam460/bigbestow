<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;

class AdminUserController extends Controller
{
    public function index()
    {
        return response()->json(User::with('roles')->latest()->get());
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'role' => 'required|string',
        ]);

        if (Role::where('name', $validated['role'])->exists()) {
            $user->syncRoles([$validated['role']]);
        }

        return response()->json($user->load('roles'));
    }

    public function destroy(User $user)
    {
        if ($user->id === auth()->id()) {
            return response()->json(['message' => 'Cannot delete your own account.'], 403);
        }
        $user->delete();

        return response()->json(null, 204);
    }
}
