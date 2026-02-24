<?php

namespace App\Console\Commands;

use App\Models\Product;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImportCersanitWithStockCommand extends Command
{
    protected $signature = 'import:cersanit-full {--fresh : Очистить таблицу перед импортом}';
    protected $description = 'Полный импорт Cersanit: товары + остатки завода';

    public function handle()
    {
        $this->info('🚀 Импорт товаров Cersanit с остатками завода...');
        
        // 1. Читаем товары из прайса
        if (!Storage::exists('cersanit_products.json')) {
            $this->error('❌ Файл cersanit_products.json не найден!');
            return 1;
        }

        $products = json_decode(Storage::get('cersanit_products.json'), true);
        $this->info("📦 Товаров в прайсе: " . count($products));

        // 2. Читаем остатки завода
        $factoryStock = [];
        if (Storage::exists('factory_stock.json')) {
            $factoryStock = json_decode(Storage::get('factory_stock.json'), true);
            $this->info("🏭 Остатков завода: " . count($factoryStock));
        } else {
            $this->warn('⚠️  Файл factory_stock.json не найден. Остатки завода будут = 0');
        }

        // Очистка если нужно
        if ($this->option('fresh')) {
            $this->warn('⚠️  Очищаем таблицу products...');
            Product::truncate();
        }

        $bar = $this->output->createProgressBar(count($products));
        $bar->start();

        $imported = 0;
        $updated = 0;
        $errors = 0;

        foreach ($products as $data) {
            try {
                // Генерируем slug
                $slug = Str::slug($data['collection'] . ' ' . $data['size'] . ' ' . $data['sku']);
                
                // Извлекаем цвет
                $color = $this->extractColor($data['name']);
                
                // Извлекаем поверхность
                $surface = $this->extractSurface($data['name']);
                
                // Тип
                $materialType = str_contains(mb_strtolower($data['type']), 'керамогранит') 
                    ? 'керамогранит' 
                    : 'плитка';

                // ОСТАТОК ЗАВОДА (по BSU = SKU)
                $stockFactory = 0;
                if (isset($factoryStock[$data['sku']])) {
                    $stockFactory = $factoryStock[$data['sku']]['stock_factory'];
                }

                $product = Product::where('sku', $data['sku'])->first();

                $productData = [
                    'sku' => $data['sku'],
                    'name' => $this->cleanName($data['name']),
                    'slug' => $slug,
                    'brand' => 'Cersanit',
                    'collection' => $data['collection'],
                    'format' => $data['size'],
                    'surface' => $surface,
                    'color' => $color,
                    'material_type' => $materialType,
                    'application' => 'Универсальный',
                    'price_official' => $data['price_retail'],
                    'price_retail' => $data['price_our'],
                    'price_wholesale' => $data['price_our'] * 0.95,
                    'discount_percent' => 20,
                    'discount_amount' => $data['discount'],
                    
                    // ОСТАТКИ
                    'stock_yanino' => 0, // Будете обновлять вручную в админке
                    'stock_factory' => $stockFactory,
                    
                    // SEO
                    'seo_title' => $this->generateTitle($data),
                    'seo_description' => $this->generateDescription($data, $stockFactory),
                    'seo_keywords' => $this->generateKeywords($data),
                    
                    'description' => $this->generateProductDescription($data, $stockFactory),
                    
                    'technical_specs' => json_encode([
                        'Размер' => $data['size'] . ' см',
                        'Коллекция' => $data['collection'],
                        'Тип' => $materialType,
                        'Поверхность' => $surface,
                        'Цвет' => $color,
                        'Единица измерения' => $data['unit'],
                        'Бренд' => 'Cersanit',
                        'Страна' => 'Польша/Россия',
                        'Остаток Янино' => 'Уточняйте',
                        'Остаток Завод' => $stockFactory > 0 ? number_format($stockFactory, 2) . ' м²' : 'Под заказ',
                    ], JSON_UNESCAPED_UNICODE),
                    
                    'faq' => json_encode([
                        [
                            'question' => 'Есть ли товар в наличии?',
                            'answer' => $stockFactory > 0 
                                ? "Да! На заводе в наличии " . number_format($stockFactory, 2) . " м². Доставка 7 дней. Остатки на складе Янино уточняйте по телефону."
                                : "Товар можно заказать с завода (срок 7-14 дней). Остатки на складе Янино уточняйте по телефону."
                        ],
                        [
                            'question' => 'Какая цена?',
                            'answer' => "Наша цена {$data['price_our']}₽/м² (официальная {$data['price_retail']}₽). Экономия {$data['discount']}₽!"
                        ],
                        [
                            'question' => 'Как быстро доставите?',
                            'answer' => 'Самовывоз из Янино - сегодня (если есть на складе). Доставка по СПб - на следующий день. С завода - 7 дней.'
                        ],
                        [
                            'question' => 'Можно ли посмотреть образцы?',
                            'answer' => 'Конечно! Приезжайте на наш склад в Янино-1. Покажем образцы, поможем с выбором.'
                        ],
                    ], JSON_UNESCAPED_UNICODE),
                    
                    'is_active' => true,
                    'is_new' => false,
                    'is_bestseller' => $stockFactory > 5000, // Если много на заводе = популярный
                    'is_discount' => true,
                    'parsed_at' => now(),
                ];

                if ($product) {
                    $product->update($productData);
                    $updated++;
                } else {
                    Product::create($productData);
                    $imported++;
                }

            } catch (\Exception $e) {
                $errors++;
                $this->newLine();
                $this->error("❌ {$data['sku']}: " . $e->getMessage());
            }

            $bar->advance();
        }

        $bar->finish();
        $this->newLine(2);

        $this->info("✅ Импорт завершен!");
        $this->table(
            ['Статус', 'Количество'],
            [
                ['Создано', $imported],
                ['Обновлено', $updated],
                ['Ошибок', $errors],
                ['Всего', $imported + $updated],
            ]
        );

        // Статистика по остаткам
        $withStock = Product::where('stock_factory', '>', 0)->count();
        $this->info("\n📊 Остатки завода:");
        $this->info("  С остатками: {$withStock} товаров");
        $this->info("  Без остатков: " . (Product::count() - $withStock) . " товаров");

        return 0;
    }

    private function cleanName($name)
    {
        return trim(preg_replace('/^(Глаз\.|Керамогранит|Плитка)\s*/ui', '', $name));
    }

    private function extractColor($name)
    {
        $colors = [
            'светло-бежевый' => 'светло-бежевый',
            'темно-бежевый' => 'темно-бежевый',
            'бежевый' => 'бежевый',
            'светло-серый' => 'светло-серый',
            'темно-серый' => 'темно-серый',
            'серый' => 'серый',
            'белый' => 'белый',
            'черный' => 'черный',
            'коричневый' => 'коричневый',
            'многоцветный' => 'многоцветный',
        ];

        foreach ($colors as $pattern => $color) {
            if (mb_stripos($name, $pattern) !== false) {
                return $color;
            }
        }

        return 'натуральный';
    }

    private function extractSurface($name)
    {
        if (mb_stripos($name, 'рельеф') !== false) return 'рельефная';
        if (mb_stripos($name, 'глаз') !== false) return 'глазурованная';
        if (mb_stripos($name, 'мат') !== false) return 'матовая';
        if (mb_stripos($name, 'полиров') !== false) return 'полированная';
        return 'матовая';
    }

    private function generateTitle($data)
    {
        return sprintf(
            '%s %s %s купить в СПб - %s₽ (-20%%) | Cersanit Янино',
            ucfirst($data['type']),
            $data['collection'],
            $data['size'],
            number_format($data['price_our'], 0, '.', ' ')
        );
    }

    private function generateDescription($data, $stockFactory)
    {
        $availability = $stockFactory > 0 
            ? "В наличии на заводе: " . number_format($stockFactory, 0) . " м². " 
            : "";
        
        return sprintf(
            '%s %s %s см от официального дилера Cersanit в СПб. %sЦена %s₽ вместо %s₽. Склад Янино, доставка 7 дней. Артикул: %s',
            ucfirst($data['type']),
            $data['collection'],
            $data['size'],
            $availability,
            number_format($data['price_our'], 0, '.', ' '),
            number_format($data['price_retail'], 0, '.', ' '),
            $data['sku']
        );
    }

    private function generateKeywords($data)
    {
        return implode(', ', [
            'cersanit',
            mb_strtolower($data['collection']),
            $data['type'],
            $data['size'],
            'янино',
            'спб',
            'купить',
            'цена',
            'дилер',
        ]);
    }

    private function generateProductDescription($data, $stockFactory)
    {
        $color = $this->extractColor($data['name']);
        $surface = $this->extractSurface($data['name']);
        
        $availability = $stockFactory > 0 
            ? "\n**На заводе в наличии:** " . number_format($stockFactory, 2) . " м² (доставка 7 дней)" 
            : "\n**На складе в Янино:** уточняйте актуальные остатки";
        
        return <<<DESC
Коллекция {$data['collection']} от Cersanit – это воплощение современного дизайна и качества. 
{$availability}

**Характеристики:**
- Размер: {$data['size']} см
- Цвет: {$color}
- Поверхность: {$surface}
- Производство: Польша/Россия

**Почему выгодно у нас:**
- ✅ Цена {$data['price_our']}₽ вместо {$data['price_retail']}₽
- ✅ Экономия {$data['discount']}₽ на каждом м²
- ✅ Официальный дилер Cersanit
- ✅ Склад в Янино (самовывоз сегодня)
- ✅ Доставка по СПБ от 500₽
- ✅ С завода за 7 дней

**Применение:**
Идеально для пола и стен в ванной, кухне, прихожей, коммерческих помещениях.

**Гарантия:**
Вся продукция сертифицирована, гарантия производителя.
DESC;
    }
}
