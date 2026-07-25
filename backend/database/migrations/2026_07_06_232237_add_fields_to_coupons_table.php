<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('coupons', function (Blueprint $table) {
            $table->decimal('min_order_amount', 10, 2)->default(0)->after('discount_value');
            $table->integer('max_uses')->nullable()->after('min_order_amount');
            $table->integer('used_count')->default(0)->after('max_uses');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('coupons', function (Blueprint $table) {
            $table->dropColumn(['min_order_amount', 'max_uses', 'used_count']);
        });
    }
};
