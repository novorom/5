<?php

namespace App\Console\Commands;

use App\Models\Product;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class ParseCersanitImages extends Command
{
    protected $signature = 'parse:cersanit-images {--limit=10}';
    protected $description = 'Парсинг фото товаров с cersanit.ru';

    public function handle()
    {
        $limit = $this->option('limit');
        
        $products = Product::whereNull('images')
            ->orWhereJsonLength('images', 0)
            ->limit($limit)
            ->get();

        if ($products->isEmpty()) {
            $this->info('✅ У всех товаров есть фото!');
            return 0;
        }

        $this->info("🚀 Парсим фото для {$products->count()} товаров...\n");

        $bar = $this->output->createProgressBar($products->count());
        $bar->start();

        $success = 0;
        $failed = 0;

        foreach ($products as $product) {
            try {
                // Формируем URL поиска
                $searchQuery = urlencode($product->sku);
                $searchUrl = "https://cersanit.ru/search/?q={$searchQuery}";
cat > resources/views/catalog/product-card.blade.php << 'ENDOFFILE'
<div class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
    <a href="{{ route('catalog.show', $product->slug) }}" class="block">
        <div class="relative bg-gray-100 aspect-square overflow-hidden">
            @if($product->images && count($product->images) > 0)
                <img src="{{ $product->images[0] }}" 
                     alt="{{ $product->name }}" 
                     class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                     loading="lazy">
            @else
                @php
                    $colors = ['bg-blue-100 text-blue-600', 'bg-green-100 text-green-600', 'bg-purple-100 text-purple-600'];
                    $colorClass = $colors[ord($product->collection[0] ?? 'A') % 3];
                @endphp
                <div class="w-full h-full flex flex-col items-center justify-center {{ $colorClass }}">
                    <div class="text-6xl font-bold">{{ substr($product->collection, 0, 1) }}</div>
                    <div class="text-sm mt-2">{{ $product->collection }}</div>
                </div>
            @endif
            
            @if($product->stock_yanino > 0)
                <div class="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Склад Янино
                </div>
            @elseif($product->stock_factory > 0)
                <div class="absolute top-3 left-3 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Завод (7 дней)
                </div>
            @endif
        </div>
        
        <div class="p-4">
            <div class="text-sm text-gray-500 mb-1">{{ $product->collection }}</div>
            
            <h3 class="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                {{ $product->name }}
            </h3>
            
            <div class="text-sm text-gray-600 mb-3">{{ $product->format }}</div>
            
            <div class="space-y-1 mb-3">
                <div class="flex items-baseline gap-2">
                    <span class="text-2xl font-bold text-gray-900">{{ number_format($product->price_retail, 0, ',', ' ') }} ₽</span>
                    <span class="text-sm text-gray-500">/м²</span>
                </div>
                @if($product->price_rrp > $product->price_retail)
                    <div class="flex items-center gap-2">
                        <span class="text-sm text-gray-400 line-through">{{ number_format($product->price_rrp, 0, ',', ' ') }} ₽</span>
                        <span class="text-sm font-medium text-green-600">-{{ number_format((($product->price_rrp - $product->price_retail) / $product->price_rrp) * 100, 0) }}%</span>
                    </div>
                @endif
            </div>
            
            <div class="text-sm space-y-1 mb-4">
                @if($product->stock_yanino > 0)
                    <div class="text-green-600 font-medium">✓ Янино: {{ $product->stock_yanino }} м²</div>
                @endif
                @if($product->stock_factory > 0)
                    <div class="text-blue-600">Завод: {{ $product->stock_factory }} м²</div>
                @endif
            </div>
            
            <button class="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2.5 rounded-lg transition-colors">
                Подробнее
            </button>
        </div>
    </a>
</div>
