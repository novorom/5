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
        Schema::table('products', function (Blueprint $table) {
            // Тип продукции (для структуры каталога как на cersanit.ru)
            $table->string('product_type')->nullable()->after('collection')->index();
            // ceramic-granite, ceramic-tile, mosaic, border, step, etc.

            // Назначение (помещения)
            $table->json('rooms')->nullable()->after('application'); // ['vanna', 'kuhnya', 'guestinaya']

            // Дизайн (паттерн)
            $table->string('design')->nullable()->after('surface'); // beton, derevo, kamen, mramor, monocolor

            // Для сортировки
            $table->integer('sort_order')->default(0)->after('is_active');
            $table->boolean('is_exclusive')->default(false)->after('is_discount'); // Эксклюзив

            // Индексы для фильтров
            $table->index(['product_type', 'is_active']);
            $table->index(['design', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex(['product_type', 'is_active']);
            $table->dropIndex(['design', 'is_active']);
            $table->dropColumn(['product_type', 'rooms', 'design', 'sort_order', 'is_exclusive']);
        });
    }
};
