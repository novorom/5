@extends('layout')

@section('content')
    {{-- Hero Section --}}
    <section class="bg-gray-200 py-20">
        <div class="container mx-auto px-4 text-center">
            <h1 class="text-5xl font-bold text-gray-800 mb-4">Cersanit в Санкт-Петербурге</h1>
            <p class="text-xl text-gray-600 mb-8">Официальный дилер. Керамическая плитка и керамогранит со скидкой 20% от розницы.</p>
            <a href="{{ route('catalog.index') }}" class="bg-blue-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-600 transition">Перейти в каталог</a>
        </div>
    </section>

    {{-- Bestsellers Section --}}
    @if($bestsellers->isNotEmpty())
    <section class="py-16">
        <div class="container mx-auto px-4">
            <h2 class="text-4xl font-bold text-center mb-12">🔥 Хиты продаж</h2>
            
            <div class="grid md:grid-cols-3 gap-8">
                @foreach($bestsellers as $product)
                    {{-- Добавлена проверка на наличие SKU, чтобы избежать ошибок роутинга --}}
                    @if(!empty($product->sku) && !empty($product->name))
                    <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition group">
                        <a href="{{ route('product.show', ['sku' => $product->sku]) }}" class="block">
                            <div class="relative">
                                @if($product->main_image)
                                <img src="{{ $product->main_image }}" alt="{{ $product->name }}" class="w-full h-64 object-cover">
                                @else
                                <div class="w-full h-64 bg-gray-200 flex items-center justify-center">
                                    <span class="text-gray-400 text-6xl">🏺</span>
                                </div>
                                @endif
                                
                                <div class="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg font-bold">
                                    Хит
                                </div>
                            </div>
                            <div class="p-6">
                                <h3 class="text-xl font-semibold text-gray-800 truncate group-hover:text-blue-500 transition" title="{{ $product->name }}">{{ $product->name }}</h3>
                                <p class="text-gray-600 mt-2">Артикул: {{ $product->sku }}</p>
                            </div>
                        </a>
                    </div>
                    @endif
                @endforeach
            </div>
        </div>
    </section>
    @endif

    {{-- About Section --}}
    <section class="bg-white py-16">
        <div class="container mx-auto px-4 text-center">
            <h2 class="text-3xl font-bold mb-4">О нас</h2>
            <p class="max-w-3xl mx-auto text-gray-600">
                Мы являемся официальным дилером Cersanit в Санкт-Петербурге и Ленинградской области. Предлагаем полный ассортимент продукции: от настенной и напольной плитки до керамогранита и сантехники. Наш склад находится в Янино, что позволяет нам оперативно доставлять заказы по всему региону.
            </p>
        </div>
    </section>
@endsection
