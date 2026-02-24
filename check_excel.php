<?php
require 'vendor/autoload.php';
use PhpOffice\PhpSpreadsheet\IOFactory;

$file = 'otch/products_full.xlsx';
$spreadsheet = IOFactory::load($file);
$sheet = $spreadsheet->getActiveSheet();
$rows = $sheet->toArray();

$header = $rows[0];

echo "All columns:\n";
foreach ($header as $index => $colName) {
    echo "$index: $colName\n";
}

echo "\n\nLooking for image columns:\n";
foreach ($header as $index => $colName) {
    if (stripos($colName, 'URL') !== false || stripos($colName, 'фото') !== false || stripos($colName, 'изображение') !== false || stripos($colName, 'ссылка') !== false) {
        echo "Found image column at index $index: $colName\n";
        echo "Value in row 1: " . $rows[1][$index] . "\n\n";
    }
}