<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\View\View;
use Illuminate\Support\Facades\DB;

class CollectionController extends Controller
{
    /**
     * Display a visual collections grid
     */
    public function index(Request $request): View
    {
        $query = Product::where('is_active', true);

        // Фильтр по категориям (типу продукции) - множественный выбор
        $selectedCategories = $request->get('categories', []);
        if (!empty($selectedCategories)) {
            $query->where(function($q) use ($selectedCategories) {
                foreach ($selectedCategories as $category) {
                    if ($category === 'ceramic-tile') {
                        $q->orWhere(function($subQ) {
                            $subQ->whereRaw('material_type LIKE ? OR material_type LIKE ?', ['%Плитк%', '%плитк%'])
                                ->orWhereRaw('name LIKE ? OR name LIKE ?', ['%Плитк%', '%плитк%']);
                        });
                    } elseif ($category === 'ceramic-granite') {
                        $q->orWhere(function($subQ) {
                            $subQ->whereRaw('material_type LIKE ? OR material_type LIKE ?', ['%Керамогранит%', '%керамогранит%'])
                                ->orWhereRaw('name LIKE ? OR name LIKE ?', ['%Керамогранит%', '%керамогранит%']);
                        });
                    } elseif ($category === 'mosaic') {
                        $q->orWhere(function($subQ) {
                            $subQ->whereRaw('material_type LIKE ? OR material_type LIKE ?', ['%Мозаик%', '%мозаик%'])
                                ->orWhereRaw('name LIKE ? OR name LIKE ?', ['%Мозаик%', '%мозаик%']);
                        });
                    } elseif ($category === 'mosaic-mesh') {
                        $q->orWhere(function($subQ) {
                            $subQ->whereRaw('material_type LIKE ? OR material_type LIKE ?', ['%Мозаика на сетк%', '%мозаика на сетк%'])
                                ->orWhereRaw('name LIKE ? OR name LIKE ?', ['%Мозаика на сетк%', '%мозаика на сетк%']);
                        });
                    } elseif ($category === 'wall-tile') {
                        $q->orWhere(function($subQ) {
                            $subQ->whereRaw('material_type LIKE ? OR material_type LIKE ?', ['%Настенн%', '%настенн%'])
                                ->orWhereRaw('application LIKE ? OR application LIKE ?', ['%Стена%', '%стена%']);
                        });
                    } elseif ($category === 'wall-insert') {
                        $q->orWhere(function($subQ) {
                            $subQ->whereRaw('name LIKE ? OR name LIKE ?', ['%Вставк%', '%вставк%'])
                                ->orWhereRaw('material_type LIKE ? OR material_type LIKE ?', ['%Вставк%', '%вставк%']);
                        });
                    } elseif ($category === 'step') {
                        $q->orWhere(function($subQ) {
                            $subQ->whereRaw('name LIKE ? OR name LIKE ?', ['%Ступен%', '%ступен%'])
                                ->orWhereRaw('name LIKE ? OR name LIKE ?', ['%Ступень%', '%ступень%']);
                        });
                    } elseif ($category === 'border') {
                        $q->orWhere(function($subQ) {
                            $subQ->whereRaw('name LIKE ? OR name LIKE ?', ['%Бордюр%', '%бордюр%'])
                                ->orWhereRaw('name LIKE ? OR name LIKE ?', ['%Плинтус%', '%плинтус%']);
                        });
                    } elseif ($category === 'glass-special') {
                        $q->orWhere(function($subQ) {
                            $subQ->whereRaw('material_type LIKE ? OR material_type LIKE ?', ['%Стеклянн%', '%стеклянн%'])
                                ->orWhereRaw('name LIKE ? OR name LIKE ?', ['%Стеклянн%', '%стеклянн%']);
                        });
                    }
                }
            });
        }

        // Фильтр по коллекциям
        $selectedCollections = $request->get('collections', []);
        if (!empty($selectedCollections)) {
            $query->whereIn('collection', $selectedCollections);
        }

        // Фильтр по цветам
        $selectedColors = $request->get('colors', []);
        if (!empty($selectedColors)) {
            $query->whereIn('color', $selectedColors);
        }

        // Фильтр по форматам
        $selectedFormats = $request->get('formats', []);
        if (!empty($selectedFormats)) {
            $query->whereIn('format', $selectedFormats);
        }

        // Фильтр по поверхности
        $selectedSurfaces = $request->get('surfaces', []);
        if (!empty($selectedSurfaces)) {
            $query->whereIn('surface', $selectedSurfaces);
        }

        // Поиск
        $search = $request->get('search', '');
        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                    ->orWhere('sku', 'like', '%' . $search . '%')
                    ->orWhere('collection', 'like', '%' . $search . '%');
            });
        }

        // Фильтр по цене
        $priceMin = $request->get('priceMin', '');
        $priceMax = $request->get('priceMax', '');
        if ($priceMin !== '' && $priceMin !== null) {
            $query->where('price_retail', '>=', floatval($priceMin));
        }
        if ($priceMax !== '' && $priceMax !== null) {
            $query->where('price_retail', '<=', floatval($priceMax));
        }

        // Данные для фильтров
        $collectionsData = Product::select('collection', DB::raw('COUNT(*) as count'))
            ->whereNotNull('collection')->where('is_active', true)->groupBy('collection')->orderBy('collection')->get();
        $colorsData = Product::select('color', DB::raw('COUNT(*) as count'))
            ->whereNotNull('color')->where('is_active', true)->groupBy('color')->orderBy('color')->get();
        $formatsData = Product::select('format', DB::raw('COUNT(*) as count'))
            ->whereNotNull('format')->where('is_active', true)->groupBy('format')->orderBy('format')->get();
        $surfacesData = Product::select('surface', DB::raw('COUNT(*) as count'))
            ->whereNotNull('surface')->where('is_active', true)->groupBy('surface')->orderBy('surface')->get();

        $priceRange = Product::where('is_active', true)->whereNotNull('price_retail')
            ->selectRaw('MIN(price_retail) as min, MAX(price_retail) as max')->first();

        $collections = $query->whereNotNull('collection')
            ->where('is_active', true)
            ->select('collection', DB::raw('COUNT(*) as products_count'))
            ->groupBy('collection')
            ->orderBy('collection')
            ->get();

        // For each collection, get preview images
        $collectionData = $collections->map(function ($collection) {
            $collectionProducts = Product::where('collection', $collection->collection)
                ->where('is_active', true)
                ->whereNotNull('main_image')
                ->orderBy('sku')
                ->get();

            // Primary preview image (first product)
            $previewImage = $collectionProducts->first()?->main_image;

            // Get 4-5 thumbnails (excluding the first if possible)
            $thumbnails = $collectionProducts->skip(1)->take(4)->pluck('main_image')->toArray();

            // If we don't have enough thumbnails, add from the beginning
            if (count($thumbnails) < 4) {
                $additional = $collectionProducts->take(4 - count($thumbnails))->pluck('main_image')->toArray();
                $thumbnails = array_merge($thumbnails, $additional);
            }

            return [
                'name' => $collection->collection,
                'product_count' => $collection->products_count,
                'preview_image' => $previewImage,
                'thumbnails' => array_filter(array_unique($thumbnails)),
                'url' => route('collection.show', ['collection' => urlencode($collection->collection)]),
            ];
        })->filter(function ($collection) {
            return $collection['preview_image'] !== null;
        });

        return view('collections.index', [
            'collections' => $collectionData,
            'collectionsData' => $collectionsData,
            'colorsData' => $colorsData,
            'formatsData' => $formatsData,
            'surfacesData' => $surfacesData,
            'priceRange' => $priceRange,
            'selectedColors' => (array) $selectedColors,
            'selectedFormats' => (array) $selectedFormats,
            'selectedSurfaces' => (array) $selectedSurfaces,
            'priceMin' => $priceMin,
            'priceMax' => $priceMax,
        ]);
    }

    /**
     * Show products from a specific collection
     */
    public function show(string $collection): View
    {
        // Decode URL-encoded collection name
        $collection = urldecode($collection);

        $products = Product::where('collection', $collection)
            ->where('is_active', true)
            ->orderBy('name')
            ->paginate(20);

        return view('collections.show', [
            'collection' => $collection,
            'products' => $products,
        ]);
    }
}
