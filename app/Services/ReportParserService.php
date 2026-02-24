<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use PhpOffice\PhpSpreadsheet\IOFactory;

class ReportParserService
{
    /**
     * @var int Длительность кэширования в секундах (24 часа).
     */
    private int $cacheDuration = 86400;

    /**
     * Общий метод для парсинга XLS/XLSX файлов.
     * @param string $filename Путь к файлу от корня проекта.
     * @param array $columnMap Карта [ 'Заголовок в файле' => 'имя_свойства_объекта' ].
     * @return array Массив объектов stdClass.
     */
    private function parseXls(string $filename, array $columnMap): array
    {
        $fullPath = base_path($filename);
        if (!file_exists($fullPath)) {
            Log::warning("Report file not found: {$fullPath}");
            return [];
        }

        try {
            $spreadsheet = IOFactory::load($fullPath);
            $sheet = $spreadsheet->getActiveSheet();
            $rows = $sheet->toArray();

            if (count($rows) < 2) {
                return []; // Нет данных или только заголовок
            }

            $header = array_shift($rows);
            $headerIndexMap = array_flip($header); // 'Имя колонки' => индекс

            $data = [];
            foreach ($rows as $row) {
                if (empty(array_filter($row))) { // Пропускать пустые строки
                    continue;
                }
                $item = new \stdClass();
                foreach ($columnMap as $fileHeader => $objectProperty) {
                    if (isset($headerIndexMap[$fileHeader])) {
                        $columnIndex = $headerIndexMap[$fileHeader];
                        $item->{$objectProperty} = $row[$columnIndex] ?? null;
                    } else {
                        $item->{$objectProperty} = null;
                    }
                }
                $data[] = $item;
            }

            return $data;
        } catch (\Exception $e) {
            Log::error("Failed to parse XLS file '{$filename}'. Error: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Обобщенный метод для получения, кэширования и фильтрации данных отчета.
     *
     * @param string $cacheKey Ключ для кэширования.
     * @param string $filename Имя файла отчета.
     * @param array $columnMap Карта колонок.
     * @param callable|null $filter Функция для фильтрации результатов.
     * @return array
     */
    private function getReportData(string $cacheKey, string $filename, array $columnMap, ?callable $filter = null): array
    {
        return Cache::remember($cacheKey, $this->cacheDuration, function () use ($filename, $columnMap, $filter) {
            $allItems = $this->parseXls($filename, $columnMap);

            if ($filter) {
                $filteredItems = array_filter($allItems, $filter);
                return array_values($filteredItems); // Re-index array keys
            }

            return $allItems;
        });
    }

    /**
     * Получает данные по сертификатам, отфильтрованные для 2D.
     * @return array
     */
    public function getCertificates(): array
    {
        $map = [
            'Описание' => 'description',
            'Тип' => 'type',
            'Срок окончания' => 'endDate',
            'Размер файла' => 'fileSize',
            'Тип файла' => 'fileType',
            'Скачать' => 'downloadUrl',
            'Подгруппа' => 'subgroup',
        ];

        $filter = function($item) {
            return isset($item->subgroup) && str_contains($item->subgroup, '2D:');
        };

        return $this->getReportData('report.certificates', 'otch/certificates.xls', $map, $filter);
    }

    /**
     * Получает данные по видео, отфильтрованные для 2D.
     * @return array
     */
    public function getVideos(): array
    {
        $map = [
            'Описание' => 'title',
            'Тип видео' => 'type',
            'Смотреть' => 'watchUrl',
            'Скачать' => 'downloadUrl',
            'Категория' => 'category',
        ];

        $filter = function($item) {
            return isset($item->category) && str_contains($item->category, '2D:');
        };

        return $this->getReportData('report.videos', 'otch/videos.xls', $map, $filter);
    }

    /**
     * Получает данные по рекомендациям по уходу, отфильтрованные для 2D.
     * @return array
     */
    public function getCareRecommendations(): array
    {
        $map = [
            'Дата' => 'date',
            'Тип' => 'type',
            'Описание' => 'description',
            'Тип файла' => 'fileType',
            'Размер файла' => 'fileSize',
            'Скачать' => 'downloadUrl',
            'Категория' => 'category',
        ];

        $filter = function($item) {
            return isset($item->category) && str_contains($item->category, '2D:');
        };

        return $this->getReportData('report.care', 'otch/care.xls', $map, $filter);
    }

    /**
     * Получает данные по видео-рекомендациям по уходу.
     * @return array
     */
    public function getVideoCareRecommendations(): array
    {
        $map = [
            'Описание' => 'title',
            'Смотреть' => 'watchUrl',
            'Скачать' => 'downloadUrl',
        ];
        return $this->getReportData('report.videocare', 'otch/videocare.xls', $map);
    }

    /**
     * Получает данные по рекламным материалам, отфильтрованные для 2D.
     * @return array
     */
    public function getPromotionalMaterials(): array
    {
        $map = [
            'Дата' => 'date',
            'Бренд' => 'brand',
            'Тип' => 'type',
            'Описание' => 'description',
            'Тип файла' => 'fileType',
            'Размер файла' => 'fileSize',
            'Скачать' => 'downloadUrl',
            'Категория' => 'category',
        ];

        $filter = function($item) {
            return isset($item->category) && str_contains($item->category, '2D:');
        };

        return $this->getReportData('report.promotional', 'otch/promotional.xls', $map, $filter);
    }

    /**
     * Получает данные по трейд-маркетингу, отфильтрованные для 2D.
     * @return array
     */
    public function getTradeMarketingMaterials(): array
    {
        $map = [
            'Дата' => 'date',
            'Бренд' => 'brand',
            'Тип' => 'type',
            'Описание' => 'description',
            'Тип файла' => 'fileType',
            'Размер файла' => 'fileSize',
            'Скачать' => 'downloadUrl',
            'Категория' => 'category',
        ];

        $filter = function($item) {
            return isset($item->category) && str_contains($item->category, '2D:');
        };

        return $this->getReportData('report.trade', 'otch/trade.xls', $map, $filter);
    }

    /**
     * Получает данные по спецификациям, отфильтрованные для 2D.
     * @return array
     */
    public function getSpecifications(): array
    {
        $map = [
            'Дата' => 'date',
            'Описание' => 'description',
            'Тип файла' => 'fileType',
            'Размер файла' => 'fileSize',
            'Скачать' => 'downloadUrl',
            'Категория' => 'category',
        ];

        $filter = function($item) {
            return isset($item->category) && str_contains($item->category, '2D:');
        };

        return $this->getReportData('report.specifications', 'otch/specifications.xls', $map, $filter);
    }

    /**
     * Получает данные по всем продуктам из основной выгрузки.
     * @return array
     */
    public function getProducts(): array
    {
        $cacheKey = 'report.products';
        $filename = 'otch/products_full.xlsx';

        return Cache::remember($cacheKey, $this->cacheDuration, function () use ($filename) {
            $fullPath = base_path($filename);
            if (!file_exists($fullPath)) {
                Log::warning("Report file not found: {$fullPath}");
                return [];
            }

            try {
                $spreadsheet = IOFactory::load($fullPath);
                $sheet = $spreadsheet->getActiveSheet();
                $rows = $sheet->toArray();

                if (count($rows) < 2) {
                    return []; // Нет данных или только заголовок
                }

                $header = array_shift($rows);

                // Найти индексы ключевых столбцов по их именам
                $nameMap = [
                    'sku' => 'код bsu',
                    'name' => 'наименование для сайта',
                    'main_image' => 'URL изображения',
                    'desc_sku' => 'Артикул',
                    'desc_sku_digital' => 'Артикул цифровой',
                    'desc_name' => 'наименование',
                ];

                $indexMap = [];
                foreach ($nameMap as $prop => $colName) {
                    $searchResult = array_search($colName, $header);
                    $indexMap[$prop] = $searchResult !== false ? $searchResult : -1;
                }

                // Определить индексы всех столбцов, которые должны войти в описание
                $description_indices = [
                    $indexMap['desc_sku'],
                    $indexMap['desc_sku_digital'],
                    $indexMap['desc_name'],
                    5,  // столбец 6
                    6,  // столбец 7
                    9,  // столбец 10
                    10, // столбец 11
                    11, // столбец 12
                    12, // столбец 13
                ];
                // Добавить диапазон столбцов с 14 по 63 (индексы с 13 по 62)
                $description_indices = array_merge($description_indices, range(13, 62));
                // Отфильтровать ненайденные (-1) и дублирующиеся индексы
                $description_indices = array_unique(array_filter($description_indices, function ($i) {
                    return $i >= 0;
                }));
                sort($description_indices);

                $data = [];
                foreach ($rows as $row) {
                    if (empty(array_filter($row))) { // Пропускать пустые строки
                        continue;
                    }

                    $item = new \stdClass();

                    // Присвоить основные поля
                    $item->sku = ($indexMap['sku'] != -1 && isset($row[$indexMap['sku']])) ? $row[$indexMap['sku']] : null;
                    $item->name = ($indexMap['name'] != -1 && isset($row[$indexMap['name']])) ? $row[$indexMap['name']] : null;
                    $item->main_image = ($indexMap['main_image'] != -1 && isset($row[$indexMap['main_image']])) ? $row[$indexMap['main_image']] : null;

                    // Собрать описание из всех указанных частей
                    $description_parts = [];
                    foreach ($description_indices as $idx) {
                        if (isset($header[$idx]) && isset($row[$idx]) && $row[$idx] !== '' && $row[$idx] !== null) {
                            $description_parts[] = trim($header[$idx]) . ': ' . trim($row[$idx]);
                        }
                    }
                    $item->description = implode("\n", $description_parts);

                    $data[] = $item;
                }

                return $data;

            } catch (\Exception $e) {
                Log::error("Failed to parse XLS file '{$filename}'. Error: " . $e->getMessage());
                return [];
            }
        });
    }
}
