 @extends('layout')

  @php $parsed = $product->getParsedDescription(); @endphp

  @section('title', $product->name . ' | Купить в Санкт-Петербурге')

  @section('content')
  <div class="container mx-auto px-4 py-6">
      {{-- Хлебные крошки --}}
      <nav class="text-sm text-gray-500 mb-6">
          <a href="/" class="hover:text-blue-600">Главная</a>
          <span class="mx-2">/</span>
          <a href="/catalog" class="hover:text-blue-600">Каталог</a>
          <span class="mx-2">/</span>
          <span class="text-gray-700">{{ $product->name }}</span>
      </nav>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {{-- Фото --}}
          <div>
              <div class="bg-white rounded-2xl shadow-sm border p-4">
                  @if($product->main_image)
                      <img src="{{ $product->main_image }}" alt="{{ $product->name }}" class="w-full rounded-xl">
                  @else
                      <div class="w-full aspect-square bg-gray-100 rounded-xl flex items-center justify-center">
                          <svg class="w-24 h-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4
  16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0
  00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                          </svg>
                      </div>
                  @endif
              </div>

              {{-- Дополнительно фото из parsed --}}
              @if($parsed['collection_image'] || count($parsed['technical_images']) > 0)
                  <div class="flex gap-3 mt-4 overflow-x-auto">
                      @if($parsed['collection_image'])
                          <img src="{{ $parsed['collection_image'] }}" class="w-20 h-20 object-cover rounded-lg border
  cursor-pointer hover:scale-105 transition"
  onclick="this.parentElement.previousElementSibling.querySelector('img').src=this.src">
                      @endif
                      @foreach($parsed['technical_images'] as $img)
                          <img src="{{ $img }}" class="w-20 h-20 object-cover rounded-lg border cursor-pointer
  hover:scale-105 transition" onclick="this.parentElement.previousElementSibling.querySelector('img').src=this.src">
                      @endforeach
                  </div>
              @endif
          </div>

          {{-- Инфо --}}
          <div>
              <h1 class="text-2xl font-bold mb-2">{{ $product->name }}</h1>
              <div class="text-gray-500 mb-4">
                  Артикул: <span class="text-gray-800 font-medium">{{ $product->sku }}</span>
              </div>

              {{-- Цена --}}
              @if($product->price_retail)
                  @php $price = round($product->price_retail * 0.8); @endphp
                  <div class="text-3xl font-bold text-gray-900 mb-4">
                      {{ number_format($price, 0, '.', ' ') }} ₽
                      @if($product->price_retail > $price)
                          <span class="text-sm text-gray-400 line-through ml-2">
                              {{ number_format($product->price_retail, 0, '.', ' ') }} ₽
                          </span>
                      @endif
                  </div>
              @endif

              {{-- Остатки --}}
              <div class="space-y-2 mb-6 text-sm">
                  @if($product->stock_factory)
                      <div class="text-green-600">
                          ● В наличии на заводе: {{ $product->stock_factory }} м²
                          <span class="text-gray-500">— доставка в СПб ~ 7 дней</span>
                      </div>
                  @endif
                  @if($product->stock_yanino)
                      <div class="text-blue-600">
                          ● В наличии в Янино: {{ $product->stock_yanino }} м²
                          <span class="text-gray-500">— самовывоз / доставка на следующий раб. день</span>
                      </div>
                  @endif
              </div>

              {{-- Кнопки --}}
              <div class="flex gap-3 mb-8">
                  <a href="https://wa.me/79052050900?text=Здравствуйте, интересует {{ $product->name }} (арт: {{
  $product->sku }})" target="_blank" class="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-medium
  transition">
                      Купить в WhatsApp
                  </a>
                  <a href="tel:+79052050900" class="border hover:bg-gray-50 px-6 py-3 rounded-xl font-medium transition">
                      Позвонить
                  </a>
              </div>

              {{-- Характеристики --}}
              <div class="bg-white rounded-2xl shadow-sm border p-5 space-y-2 text-sm">
                  @if($product->collection)
                      <div><b>Коллекция:</b> {{ $product->collection }}</div>
                  @endif
                  @if($product->format)
                      <div><b>Формат:</b> {{ $product->format }}</div>
                  @endif
                  @if($product->color)
                      <div><b>Цвет:</b> {{ $product->color }}</div>
                  @endif
                  @if($product->surface)
                      <div><b>Поверхность:</b> {{ $product->surface }}</div>
                  @endif
                  @if($product->material_type)
                      <div><b>Материал:</b> {{ $product->material_type }}</div>
                  @endif
              </div>
          </div>
      </div>

      {{-- Описание --}}
      @if(count($parsed['text_lines']) > 0)
          <div class="mt-10 bg-white rounded-2xl shadow-sm border p-6">
              <h2 class="text-lg font-semibold mb-3">Описание</h2>
              <div class="prose max-w-none text-sm text-gray-700">
                  @foreach($parsed['text_lines'] as $line)
                      <p class="mb-2">{{ $line }}</p>
                  @endforeach
              </div>
          </div>
      @endif
  </div>
  @endsection

  Исправления в product-card.blade.php (если используется):

  <div class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
      <a href="{{ route('product.show', ['sku' => $product->sku]) }}" class="block">
          <div class="relative bg-gray-100 aspect-square overflow-hidden">
              @php
              $hasImage = !empty($product->main_image);
              $imageSrc = $hasImage ? $product->main_image : '';
              @endphp

              @if($hasImage)
                  <img src="{{ $imageSrc }}" alt="{{ $product->name }}"
                      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
  loading="lazy">
              @else
                  <div class="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-50
  to-gray-100">
                      <svg class="w-16 h-16 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2
  2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2
  2v12a2 2 0 002 2z"></path>
                      </svg>
                      <div class="text-lg font-bold text-gray-400 tracking-wider">{{ $product->collection }}</div>
                      <div class="text-xs text-gray-300 mt-1">{{ $product->format }}</div>
                  </div>
              @endif

              {{-- Бейджи наличия --}}
              @if($product->stock_yanino > 0)
                  <div class="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium
  shadow-lg">
                      Склад Янино
                  </div>
              @elseif($product->stock_factory > 0)
                  <div class="absolute top-3 left-3 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium
  shadow-lg">
                      Завод (7 дней)
                  </div>
              @endif

              {{-- Бейдж скидки если есть --}}
              @if($product->price_wholesale && $product->price_wholesale > $product->price_retail)
                  <div class="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold
  shadow-lg">
                      -{{ number_format((($product->price_wholesale - $product->price_retail) /
  $product->price_wholesale) * 100, 0) }}%
                  </div>
              @endif
          </div>

          <div class="p-4">
              <div class="text-sm text-gray-500 mb-1">{{ $product->collection }}</div>
              <h3 class="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {{ $product->name }}
              </h3>
              <div class="text-sm text-gray-600 mb-3">{{ $product->format }}</div>
              <div class="space-y-1 mb-3">
                  <div class="flex items-baseline gap-2">
                      <span class="text-2xl font-bold text-gray-900">{{ number_format($product->price_retail, 0, ',', '
  ') }} ₽</span>
                      <span class="text-sm text-gray-500">/м²</span>
                  </div>
                  @if($product->price_wholesale && $product->price_wholesale > $product->price_retail)
                      <div class="flex items-center gap-2">
                          <span class="text-sm text-gray-400 line-through">{{ number_format($product->price_wholesale, 0,
   ',', ' ') }} ₽</span>
                          <span class="text-sm font-medium text-green-600">
                              Выгода {{ number_format($product->price_wholesale - $product->price_retail, 0, ',', ' ') }}
   ₽
                          </span>
                      </div>
                  @endif
              </div>
              <div class="text-sm space-y-1 mb-4">
                  @if($product->stock_yanino > 0)
                      <div class="text-green-600 font-medium">✓ Янино: {{ $product->stock_yanino }} м²</div>
                  @endif
                  @if($product->stock_factory > 0)
                      <div class="text-blue-600">Завод: {{ $product->stock_factory }} м²</div>
                  @endif
              </div>
              <button class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg
  transition-colors">
                  Подробнее
              </button>
          </div>
      </a>
  </div>

