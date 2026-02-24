<?php

namespace App\Console\Commands;

use App\Models\Product;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class ImportProductPhotos extends Command
{
    protected $signature = 'import:photos {--source=/tmp/product_photos}';
    protected $description = 'Импортирует фото товаров из папки и привязывает к товарам в БД';

    public function handle()
    {
        $sourceDir = $this->option('source');
        
        $this->info('📸 ИМПОРТ ФОТО ТОВАРОВ');
        $this->info('=' . str_repeat('=', 59) . "\n");

        // Проверяем что папка существует
        if (!is_dir($sourceDir)) {
            $this->error("❌ Папка не найдена: {$sourceDir}");
            $this->info("\n💡 Распакуйте архив cersanit_photos_106_FINAL.tar.gz:");
            $this->info("   mkdir -p /tmp/product_photos");
            $this->info("   tar -xzf ~/Downloads/cersanit_photos_106_FINAL.tar.gz -C /tmp/product_photos");
            return 1;
        }

        // Создаем папку для хранения в Laravel
        $storageDir = storage_path('app/public/products');
        if (!is_dir($storageDir)) {
            mkdir($storageDir, 0755, true);
            $this->info("✅ Создана папка: storage/app/public/products");
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
            // Получаем артикул из имени файла (A17697.jpg -> A17697)
            $filename = basename($photoPath);
            $sku = pathinfo($filename, PATHINFO_FILENAME);

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

            // Обновляем товар
            $imageUrl = 'storage/products/' . $filename;
            $product->update(['images' => [$imageUrl]]);

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
            $this->info('💡 Теперь создайте символическую ссылку:');
            $this->info('   php artisan storage:link');
            $this->newLine();
            $this->info('🌐 Откройте сайт и проверьте фото!');
            $this->info('   http://127.0.0.1:8001/catalog');
        }

        return 0;
    }
}
