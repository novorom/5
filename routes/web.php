<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CollectionController;
use App\Services\ReportParserService;
use Illuminate\Http\Request;
use App\Console\Commands\ImportProducts;
use Illuminate\Support\Facades\Log;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function (ReportParserService $reportParserService) {
    $allProducts = collect($reportParserService->getProducts());

    // Фильтруем товары, чтобы в хитах были только полноценные карточки с артикулом и изображением
    $validProducts = $allProducts->filter(function ($product) {
        return !empty($product->sku) && !empty($product->main_image);
    });

    $bestsellers = $validProducts->shuffle()->take(6);

    return view('homepage', [
        'bestsellers' => $bestsellers
    ]);
})->name('home');

// Collection routes - visual display
Route::get('/collections', [CollectionController::class, 'index'])->name('collections.index');
Route::get('/collections/{collection}', [CollectionController::class, 'show'])->name('collection.show');

// Catalog and product routes
Route::get('/catalog', [ProductController::class, 'index'])->name('catalog.index');
Route::get('/product/{sku}', [ProductController::class, 'show'])->name('product.show');

// File upload for automatic parsing (to be implemented)
Route::middleware(['auth'])->group(function () {
    // These routes would handle automatic parsing when new files are uploaded
    // For now, they return a placeholder response

    Route::get('/admin/uploads', function () {
        return view('uploads.index');
    })->name('uploads.index');

    Route::post('/admin/uploads/parse', function (Request $request) {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv|max:10240',
        ]);

        // Placeholder for automatic parsing logic
        // In production, this would:
        // 1. Store the file
        // 2. Queue a job to parse it
        // 3. Return a success message

        return back()->with('success', 'File uploaded successfully. Parsing will begin shortly.');
    })->name('uploads.parse');
});
