<?php

namespace App\Console\Commands;

use App\Models\Product;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class ImportProductPhotosFixed extends Command
{
    protected $signature = 'import:photos-fixed {--source=/tmp/product_photos}';
    protected $description = 'Импортирует фото товаров (исправленная версия с поддержкой _left, _right)';

    public function handle()
    {
        $sourceDir = $this->option('source');
        
        $this->info('📸 ИМПОРТ ФОТО ТОВАРОВ (ИСПРАВЛЕННАЯ ВЕРСИЯ)');
        $this->info('=' . str_repeat('=', 59) . "\n");

        // Проверяем что папка существует
        if (!is_dir($sourceDir)) {
            $this->error("❌ Папка не найдена: {$sourceDir}");
            return 1;
        }

        // Создаем папку для хранения в Laravel
        $storageDir = storage_path('app/public/products');
        if (!is_dir($storageDir)) {
            mkdir($storageDir, 0755, true);
        }

        // Получаем все JPG файлы
        $photos = glob($sourceDir . '/*.jpg');
        
        if (empty($photos)) {
            $this->error("❌ Не найдено JPG файлов в {$sourceDir}");
            return 1;
        }

        $this->info("📁 Найдено фото: " . count($photos) . "\n");

        $bar = $this->output->createProgressBar(count($photos));
        $bar->start();

        $imported = 0;
        $skipped = 0;
        $notFound = 0;

        foreach ($photos as $photoPath) {
            $filename = basename($photoPath);
            
            // Убираем расширение
            $nameWithoutExt = pathinfo($filename, PATHINFO_FILENAME);
            
            // Убираем суффиксы _left, _right, _1, _2 и т.д.
            $sku = preg_replace('/(_(left|right|[0-9]+))$/', '', $nameWithoutExt);

            // Ищем товар в базе
            $product = Product::where('sku', $sku)->first();

            if (!$product) {
                $notFound++;
                $bar->advance();
                continue;
            }

            // Копируем фото в storage
            $newPath = $storageDir . '/' . $filename;
            copy($photoPath, $newPath);

            // Получаем текущие фото или создаём пустой массив
            $currentImages = $product->images ?? [];
            
            // Добавляем новое фото к существующим
            $imageUrl = 'storage/products/' . $filename;
            if (!in_array($imageUrl, $currentImages)) {
                $currentImages[] = $imageUrl;
            }
            
            // Обновляем товар
            $product->update(['images' => $currentImages]);

            $imported++;
            $bar->advance();
        }

        $bar->finish();
        $this->newLine(2);

        // Итоги
        $this->info('=' . str_repeat('=', 59));
        $this->info("✅ Импортировано: {$imported}");
        $this->warn("⚠️  Товар не найден в БД: {$notFound}");
        $this->info('=' . str_repeat('=', 59));

        if ($imported > 0) {
            $this->newLine();
            $this->info('🌐 Откройте сайт и проверьте фото!');
            $this->info('   http://127.0.0.1:8001/catalog');
        }

        return 0;
    }
}