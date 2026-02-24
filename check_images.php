<?php
require 'vendor/autoload.php';

$db = new SQLite3('database/database.sqlite');

// Count products with images
$count = $db->querySingle("SELECT COUNT(*) FROM products WHERE main_image IS NOT NULL AND main_image != ''");
echo "Products with images: $count\n\n";

// Show first 3 products with images
$result = $db->query("SELECT sku, name, main_image FROM products WHERE main_image IS NOT NULL AND main_image != '' LIMIT 3");
while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
    echo "SKU: {$row['sku']}\n";
    echo "Name: {$row['name']}\n";
    echo "Image: {$row['main_image']}\n\n";
}