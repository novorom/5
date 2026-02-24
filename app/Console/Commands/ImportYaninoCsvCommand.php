<?php

namespace App\Console\Commands;

use App\Models\Product;
use Illuminate\Console\Command;

class ImportYaninoCsvCommand extends Command
{
    protected $signature = 'import:yanino-csv {file}';
    protected $description = 'Импорт остатков Янино строго из CSV';

    public function handle()
    {
        $filePath = $this->argument('file');

        if (!file_exists($filePath)) {
            $this->error("❌ Файл не найден: {$filePath}");
            return 1;
        }

        $this->info("📦 Читаем остатки Янино из CSV: {$filePath}");

        Product::query()->update(['stock_yanino' => 0]);
        $this->info("♻️ Старые остатки обнулены.");

        $handle = fopen($filePath, "r");
        $updatedCount = 0;

        while (($data = fgetcsv($handle, 10000, ",")) !== FALSE) {
            // Убеждаемся, что в строке есть 11 колонок
            if (count($data) >= 11) {
                $sku = trim($data[0]);
                
                // Пропускаем шапку и пустые строки
                if (empty($sku) || mb_strtolower($sku) === 'артикул') {
                    continue;
                }

                // 11-я колонка (индекс 10) - это свободный остаток "Доступно"
                $rawStock = $data[10];
                $stock = (float) str_replace([' ', ','], ['', '.'], $rawStock);

                if ($stock > 0) {
                    // Ищем товар по артикулу
                    $updated = Product::where('sku', $sku)->update(['stock_yanino' => $stock]);
                    if ($updated) {
                        $updatedCount++;
                    }
                }
            }
        }
        fclose($handle);

        $this->newLine();
        $this->info("✅ Готово! Обновлены остатки Янино для {$updatedCount} товаров.");
        return 0;
    }
}
