<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->string('desc_sku')->nullable()->after('description');
            $table->string('desc_sku_digital')->nullable()->after('desc_sku');
            $table->string('desc_name')->nullable()->after('desc_sku_digital');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['desc_sku', 'desc_sku_digital', 'desc_name']);
        });
    }
};