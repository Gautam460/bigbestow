<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminSettingsController extends Controller
{
    private function allSettings(): array
    {
        return DB::table('settings')->pluck('value', 'key')->toArray();
    }

    public function index()
    {
        return response()->json($this->allSettings());
    }

    public function update(Request $request)
    {
        $allowed = [
            'store_name', 'support_email', 'support_phone', 'currency',
            'tax_rate', 'free_shipping_threshold',
            'footer_trade_name', 'footer_proprietor', 'footer_gstin',
            'footer_address', 'footer_description',
            'footer_youtube', 'footer_instagram', 'footer_facebook', 'footer_google',
        ];

        $data = $request->only($allowed);

        foreach ($data as $key => $value) {
            DB::table('settings')->updateOrInsert(
                ['key' => $key],
                ['value' => $value, 'updated_at' => now(), 'created_at' => now()]
            );
        }

        return response()->json([
            'message'  => 'Settings updated successfully.',
            'settings' => $this->allSettings(),
        ]);
    }

    /** Public endpoint - only footer & store keys */
    public function public()
    {
        $keys = [
            'store_name', 'footer_trade_name', 'footer_proprietor',
            'footer_gstin', 'footer_address', 'footer_description',
            'footer_youtube', 'footer_instagram', 'footer_facebook', 'footer_google',
        ];

        $settings = DB::table('settings')
            ->whereIn('key', $keys)
            ->pluck('value', 'key')
            ->toArray();

        return response()->json($settings);
    }
}
