<?php

namespace App\Http\Livewire;

use App\Models\Product;
use Livewire\Component;
use Livewire\WithPagination;

class ProductFilters extends Component
{
    use WithPagination;

    public $collections = [];
    public $colors = [];
    public $formats = [];
    public $surfaces = [];

    public $selectedCollections = [];
    public $selectedColors = [];
    public $selectedFormats = [];
    public $selectedSurfaces = [];
    public $priceMin = null;
    public $priceMax = null;
    public $search = '';

    protected $queryString = [
        'selectedCollections' => ['except' => ''],
        'selectedColors' => ['except' => ''],
        'selectedFormats' => ['except' => ''],
        'selectedSurfaces' => ['except' => ''],
        'priceMin' => ['except' => ''],
        'priceMax' => ['except' => ''],
        'search' => ['except' => ''],
        'page' => ['except' => 1],
    ];

    public function mount()
    {
        $this->collections = Product::whereNotNull('collection')->where('is_active', true)->distinct()->pluck('collection')->sort()->toArray();
        $this->colors = Product::whereNotNull('color')->where('is_active', true)->distinct()->pluck('color')->sort()->toArray();
        $this->formats = Product::whereNotNull('format')->where('is_active', true)->distinct()->pluck('format')->sort()->toArray();
        $this->surfaces = Product::whereNotNull('surface')->where('is_active', true)->distinct()->pluck('surface')->sort()->toArray();
    }

    public function render()
    {
        $query = Product::where('is_active', true);

        if (!empty($this->selectedCollections)) {
            $query->whereIn('collection', $this->selectedCollections);
        }

        if (!empty($this->selectedColors)) {
            $query->whereIn('color', $this->selectedColors);
        }

        if (!empty($this->selectedFormats)) {
            $query->whereIn('format', $this->selectedFormats);
        }

        if (!empty($this->selectedSurfaces)) {
            $query->whereIn('surface', $this->selectedSurfaces);
        }

        if ($this->priceMin !== null && $this->priceMin !== '') {
            $query->where('price_retail', '>=', floatval($this->priceMin));
        }

        if ($this->priceMax !== null && $this->priceMax !== '') {
            $query->where('price_retail', '<=', floatval($this->priceMax));
        }

        if (!empty($this->search)) {
            $query->where(function ($q) {
                $q->where('name', 'like', '%' . $this->search . '%')
                  ->orWhere('sku', 'like', '%' . $this->search . '%')
                  ->orWhere('description', 'like', '%' . $this->search . '%');
            });
        }

        $products = $query->orderBy('name')->paginate(12);

        return view('livewire.product-filters', [
            'products' => $products,
        ]);
    }

    public function resetFilters()
    {
        $this->selectedCollections = [];
        $this->selectedColors = [];
        $this->selectedFormats = [];
        $this->selectedSurfaces = [];
        $this->priceMin = null;
        $this->priceMax = null;
        $this->search = '';
        $this->resetPage();
    }
}