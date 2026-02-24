<?php

namespace App\Console\Commands;

use App\Models\Product;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class GenerateSitemap extends Command
{
    protected $signature = 'sitemap:generate';
    protected $description = 'Generate XML sitemap for the website';

    public function handle()
    {
        $this->info('Generating sitemap...');

        $baseUrl = config('app.url', 'http://localhost:8000');
        $sitemapPath = public_path('sitemap.xml');

        // Start XML
        $xml = '<?xml version="1.0" encoding="UTF-8"?>';
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

        // Add homepage
        $xml .= '<url>';
        $xml .= '<loc>' . $baseUrl . '</loc>';
        $xml .= '<lastmod>' . now()->toDateString() . '</lastmod>';
        $xml .= '<changefreq>daily</changefreq>';
        $xml .= '<priority>1.0</priority>';
        $xml .= '</url>';

        // Add catalog page
        $xml .= '<url>';
        $xml .= '<loc>' . $baseUrl . '/catalog</loc>';
        $xml .= '<lastmod>' . now()->toDateString() . '</lastmod>';
        $xml .= '<changefreq>hourly</changefreq>';
        $xml .= '<priority>0.9</priority>';
        $xml .= '</url>';

        // Add all products
        $products = Product::where('is_active', true)->get();
        $this->info("Adding {$products->count()} products to sitemap...");

        foreach ($products as $product) {
            $xml .= '<url>';
            $xml .= '<loc>' . $baseUrl . '/product/' . urlencode($product->sku) . '</loc>';
            $xml .= '<lastmod>' . $product->updated_at->toDateString() . '</lastmod>';
            $xml .= '<changefreq>weekly</changefreq>';
            $xml .= '<priority>0.8</priority>';
            $xml .= '</url>';
        }

        $xml .= '</urlset>';

        // Write to file
        File::put($sitemapPath, $xml);

        $this->info("Sitemap generated successfully with " . ($products->count() + 2) . " URLs");
        $this->info("Location: " . $sitemapPath);

        return 0;
    }
}