<?php
require 'vendor/autoload.php';
$product = new \App\Models\Product();
$products = $product::whereNotNull('collection')->get();
echo "Products with collection: " . $products->count() . "\n\n";
foreach($products->take(5) as $p) {
    echo "SKU: {$p->sku}\n";
    echo "Name: {$p->name}\n";
    echo "Collection: {$p->collection}\n";
    echo "Color: {$p->color}\n";
    echo "Format: {$p->format}\n";
    echo "Surface: {$p->surface}\n\n";
}
