<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->timestamps();
        });

        // Seed default values
        $defaults = [
            ['key' => 'store_name',               'value' => 'Big bestow'],
            ['key' => 'support_email',             'value' => 'support@bigbestow.com'],
            ['key' => 'support_phone',             'value' => '+91 9876543210'],
            ['key' => 'currency',                  'value' => 'INR (₹)'],
            ['key' => 'tax_rate',                  'value' => '18%'],
            ['key' => 'free_shipping_threshold',   'value' => '1000'],
            ['key' => 'footer_trade_name',         'value' => 'Today Sports'],
            ['key' => 'footer_proprietor',         'value' => 'Danish'],
            ['key' => 'footer_gstin',              'value' => '09CPZPD0890P1ZV'],
            ['key' => 'footer_address',            'value' => 'House No. 1053, Madina Colony, Char Khamba Ke Pas, Meerut, UP — 250002'],
            ['key' => 'footer_description',        'value' => 'Premium Cricket Equipment for Professional Players. Top-quality bats, gear, and accessories delivered right to your doorstep.'],
            ['key' => 'footer_twitter',            'value' => ''],
            ['key' => 'footer_instagram',          'value' => ''],
            ['key' => 'footer_facebook',           'value' => ''],
            ['key' => 'footer_linkedin',           'value' => ''],
        ];

        foreach ($defaults as $setting) {
            DB::table('settings')->insert(array_merge($setting, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
