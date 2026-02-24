<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class CatalogController extends Controller
{
    public function index(Request $request)
    {
        // Начинаем запрос: только активные и те, что есть в наличии
        $query = Product::active()
            ->whereRaw('(stock_yanino + stock_factory) > 0');

        // Применяем фильтры
        if ($request->filled('collection')) {
            $query->whereIn('collection', (array) $request->collection);
        }
        if ($request->filled('format')) {
            $query->whereIn('format', (array) $request->format);
        }
        if ($request->filled('color')) {
            $query->whereIn('color', (array) $request->color);
        }
        if ($request->filled('surface')) {
            $query->whereIn('surface', (array) $request->surface);
        }
        if ($request->filled('application')) {
            $query->whereIn('application', (array) $request->application);
        }

        // Фильтр по цене
        if ($request->filled('price_min')) {
            $query->where('price_retail', '>=', $request->price_min);
        }
        if ($request->filled('price_max')) {
            $query->where('price_retail', '<=', $request->price_max);
        }

        // Сортировка
        $sort = $request->get('sort', 'popular');
        match ($sort) {
            'price_asc' => $query->orderBy('price_retail', 'asc'),
            'price_desc' => $query->orderBy('price_retail', 'desc'),
            'name' => $query->orderBy('name', 'asc'),
            default => $query->orderByDesc('views_count'),
        };

        // Пагинация
        $products = $query->paginate(24)->withQueryString();

        // Данные для левого меню фильтров (кэшируем для скорости)
        $filterOptions = Cache::remember('catalog_filters', 3600, function () {
            return [
                'collections' => Product::active()->distinct()->pluck('collection')->filter()->sort()->values(),
                'formats' => Product::active()->distinct()->pluck('format')->filter()->sort()->values(),
                'colors' => Product::active()->distinct()->pluck('color')->filter()->sort()->values(),
                'surfaces' => Product::active()->distinct()->pluck('surface')->filter()->sort()->values(),
                'applications' => Product::active()->distinct()->pluck('application')->filter()->sort()->values(),
                'price_range' => [
                    'min' => Product::active()->min('price_retail') ?? 0,
                    'max' => Product::active()->max('price_retail') ?? 10000,
                ],
            ];
        });

        return view('catalog.index', compact('products', 'filterOptions'));
    }

    public function show($slug)
    {
        // Ищем товар
        $product = Product::active()->where('slug', $slug)->firstOrFail();

        // Увеличиваем просмотры
        $product->increment('views_count');

        // Похожие товары
        $relatedProducts = Product::active()
            ->whereRaw('(stock_yanino + stock_factory) > 0')
            ->where('collection', $product->collection)
            ->where('id', '!=', $product->id)
            ->limit(4)
            ->get();

        return view('catalog.show', compact('product', 'relatedProducts'));
    }

    public function collection($collection)
    {
        return redirect()->route('catalog.index', ['collection' => $collection]);
    }
}
