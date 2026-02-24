<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index()
    {
        $bestsellers = Product::where('is_active', true)
            ->whereIn('collection', ['Pamir', 'Pacific', 'Asher', 'Ultra', 'Sherbrooke'])
            ->inRandomOrder()
            ->limit(6)
            ->get();

        $stats = [
            'total_products' => Product::where('is_active', true)->count(),
            'collections' => Product::where('is_active', true)->distinct('collection')->count('collection'),
            'avg_discount' => 20,
        ];

        return view('homepage', compact('bestsellers', 'stats'));
    }
}
