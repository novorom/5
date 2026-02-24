<?php

namespace App\Console\Commands;

use App\Models\Product;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class ParseProductImages extends Command
{
    protected $signature = 'parse:images {--limit=10 : Количество товаров для парсинга}';
    protected $description = 'Парсинг фото товаров с cersanit.ru';

    public function handle()
    {
        $limit = $this->option('limit');
        
        $products = Product::whereNull('images')
            ->orWhereJsonLength('images', 0)
            ->limit($limit)
            ->get();

        if ($products->isEmpty()) {
            $this->info('✅ У всех товаров уже есть фото!');
            return 0;
        }

        $this->info("🚀 Парсим фото для {$products->count()} товаров...\n");

        $bar = $this->output->createProgressBar($products->count());
        $bar->start();

        $success = 0;
        $failed = 0;

        foreach ($products as $product) {
            try {
                $images = $this->parseImages($product);
                
                if (!empty($images)) {
                    $product->update(['images' => $images]);
                    $success++;
                } else {
                    $failed++;
                }
                
            } catch (\Exception $e) {
                $this->newLine();
                $this->error("❌ {$product->sku}: {$e->getMessage()}");
                $failed++;
            }
            
            $bar->advance();
            sleep(1); // Пауза между запросами
        }

        $bar->finish();
        $this->newLine(2);
        
        $this->info("✅ Успешно: {$success}");
        $this->warn("❌ Ошибок: {$failed}");

        return 0;
    }

    private function parseImages(Product $product): array
    {
        // Пытаемся найти товар на cersanit.ru по артикулу
        $searchUrl = "https://cersanit.ru/search/?q={$product->sku}";
        
        try {
            $response = Http::timeout(10)->get($searchUrl);
            
            if (!$response->successful()) {
                return [];
            }

            $html = $response->body();
            
            // Ищем ссылку на товар
            preg_match('/href="(\/catalog\/[^"]+)"/', $html, $matches);
            
            if (empty($matches[1])) {
                return [];
            }

            $productUrl = "https://cersanit.ru" . $matches[1];
            
            // Получаем страницу товара
            $productResponse = Http::timeout(10)->get($productUrl);
            
            if (!$productResponse->successful()) {
                return [];
            }

            $productHtml = $productResponse->body();
            
            // Ищем изображения
            preg_match_all('/https:\/\/cersanit\.ru\/upload\/[^"\']+\.(jpg|jpeg|png|webp)/i', $productHtml, $imageMatches);
            
            if (empty($imageMatches[0])) {
                return [];
            }

            $images = [];
            $imageMatches[0] = array_unique($imageMatches[0]);
            
            foreach (array_slice($imageMatches[0], 0, 5) as $imageUrl) {
                // Скачиваем и сохраняем изображение
                $savedPath = $this->downloadImage($imageUrl, $product->sku);
                
                if ($savedPath) {
                    $images[] = $savedPath;
                }
            }

            return $images;
            
        } catch (\Exception $e) {
            throw $e;
        }
    }

    private function downloadImage(string $url, string $sku): ?string
    {
        try {
            $response = Http::timeout(15)->get($url);
            
            if (!$response->successful()) {
                return null;
            }

            $extension = pathinfo(parse_url($url, PHP_URL_PATH), PATHINFO_EXTENSION);
            $filename = $sku . '_' . uniqid() . '.' . $extension;
            $path = 'products/' . $filename;

            Storage::disk('public')->put($path, $response->body());

            return '/storage/' . $path;
            
        } catch (\Exception $e) {
            return null;
        }
    }
}
