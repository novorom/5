<?php

namespace App\Console\Commands;

use App\Models\Product;
use Illuminate\Console\Command;
use PhpOffice\PhpSpreadsheet\IOFactory;

class ImportYaninoXlsCommand extends Command
{
    protected $signature = 'import:yanino-xls {file}';
    protected $description = 'Импорт остатков Янино напрямую из оригинального XLS файла';

    public function handle()
    {
        $filePath = $this->argument('file');

        if (!file_exists($filePath)) {
            $this->error("❌ Файл не найден: {$filePath}");
            return 1;
        }

        $this->info("📦 Читаем оригинальный файл Excel: {$filePath}");

        try {
            // Библиотека сама распаковывает XLS файл
            $spreadsheet = IOFactory::load($filePath);
            $worksheet = $spreadsheet->getActiveSheet();
            $rows = $worksheet->toArray();
        } catch (\Exception $e) {
            $this->error("❌ Ошибка чтения файла Excel: " . $e->getMessage());
            return 1;
        }

        Product::query()->update(['stock_yanino' => 0]);
        $this->info("♻️ Старые остатки обнулены.");

        $bar = $this->output->createProgressBar(count($rows));
        $bar->start();

        $updatedCount = 0;

        foreach ($rows as $row) {
            if (empty($row) || !isset($row[0])) {
                $bar->advance();
                continue;
            }

            $sku = trim((string) $row[0]);
            
            // Пропускаем шапку и системный мусор
            if (empty($sku) || mb_strtolower($sku) === 'артикул' || mb_strlen($sku) < 3) {
                $bar->advance();
                continue;
            }

            // Берем 11-ю колонку (индекс 10)
            if (isset($row[10])) {
                $rawStock = (string) $row[10];
                // Убираем пробелы и меняем запятую на точку для корректной работы с дробями
                $stock = (float) str_replace([' ', ','], ['', '.'], $rawStock);

                if ($stock > 0) {
                    $updated = Product::where('sku', $sku)->update(['stock_yanino' => $stock]);
                    if ($updated) {
                        $updatedCount++;
                    }
                }
            }
            $bar->advance();
        }

        $bar->finish();
        $this->newLine(2);
        $this->info("✅ Готово! Обновлены остатки Янино для {$updatedCount} товаров.");
        return 0;
    }
}
