<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            
            // === ОСНОВНЫЕ ДАННЫЕ ===
            $table->string('sku')->unique()->index(); // Артикул
            $table->string('name'); // Название товара
            $table->string('slug')->unique()->index(); // ЧПУ URL
            $table->string('brand')->default('Cersanit')->index();
            $table->string('collection')->nullable()->index(); // Коллекция
            
            // === ХАРАКТЕРИСТИКИ ===
            $table->string('format')->nullable(); // Размер (60x60, 30x90)
            $table->string('surface')->nullable(); // Глянцевая/матовая
            $table->string('color')->nullable()->index(); // Цвет
            $table->string('material_type')->nullable(); // Керамогранит/Плитка
            $table->string('application')->nullable(); // Стена/Пол
            $table->decimal('thickness', 8, 2)->nullable(); // Толщина мм
            $table->decimal('pieces_per_box', 8, 2)->nullable(); // Шт в упаковке
            $table->decimal('sqm_per_box', 8, 3)->nullable(); // м² в упаковке
            $table->string('country')->default('Польша');
            
            // === ЦЕНЫ ===
            $table->decimal('price_official', 10, 2)->nullable(); // Офиц. цена
            $table->decimal('price_retail', 10, 2)->nullable(); // Наша цена (розница)
            $table->decimal('price_wholesale', 10, 2)->nullable(); // Опт
            $table->string('currency')->default('RUB');
            
            // === ОСТАТКИ ===
            $table->decimal('stock_yanino', 10, 2)->default(0); // Янино склад
            $table->decimal('stock_factory', 10, 2)->default(0); // Завод
            $table->integer('stock_qty')->virtualAs('stock_yanino + stock_factory'); // Общий остаток
            $table->boolean('in_stock')->virtualAs('(stock_yanino + stock_factory) > 0');
            
            // === SEO & КОНТЕНТ ===
            $table->text('description')->nullable(); // Описание (парсим с сайта)
            $table->text('seo_title')->nullable(); // SEO заголовок
            $table->text('seo_description')->nullable(); // META description
            $table->text('seo_keywords')->nullable(); // Ключевые слова
            $table->json('images')->nullable(); // JSON массив картинок
            $table->string('main_image')->nullable(); // Главное фото
            
            // === ДОПОЛНИТЕЛЬНО ===
            $table->json('technical_specs')->nullable(); // Тех. характеристики JSON
            $table->json('faq')->nullable(); // Вопросы-ответы (парсим)
            $table->json('related_products')->nullable(); // Похожие товары
            $table->text('installation_guide')->nullable(); // Инструкция по укладке
            
            // === СТАТИСТИКА ===
            $table->integer('views_count')->default(0); // Просмотры
            $table->integer('sales_count')->default(0); // Продажи
            $table->decimal('rating', 3, 2)->default(0); // Рейтинг
            $table->integer('reviews_count')->default(0); // Отзывы
            
            // === СТАТУСЫ ===
            $table->boolean('is_active')->default(true)->index();
            $table->boolean('is_new')->default(false)->index(); // Новинка
            $table->boolean('is_bestseller')->default(false)->index(); // Хит продаж
            $table->boolean('is_discount')->default(false)->index(); // Акция
            $table->timestamp('parsed_at')->nullable(); // Когда спарсили
            
            $table->timestamps();
            $table->softDeletes();
            
            // === ИНДЕКСЫ ДЛЯ ПРОИЗВОДИТЕЛЬНОСТИ ===
            $table->index(['is_active', 'in_stock']);
            $table->index(['collection', 'is_active']);
            $table->index(['price_retail', 'is_active']);

            // Fulltext index for MySQL/PostgreSQL
            if (DB::getDriverName() !== 'sqlite') {
                $table->fullText(['name', 'description', 'seo_keywords']);
            }
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
