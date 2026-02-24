@extends('layout')

@section('title', 'Трейд-маркетинг - 2D')
@section('meta_description', 'Материалы по трейд-маркетингу для керамической плитки и керамогранита.')

@php
    $materials = app(App\Services\ReportParserService::class)->getTradeMarketingMaterials();
@endphp

@section('content')
    <div class="container mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold mb-8">Трейд-маркетинг (2D)</h1>

        <div class="bg-white shadow-md rounded my-6">
            <table class="min-w-full table-auto">
                <thead class="bg-gray-200">
                    <tr>
                        <th class="py-3 px-6 text-left">Описание</th>
                        <th class="py-3 px-6 text-left">Бренд</th>
                        <th class="py-3 px-6 text-left">Тип</th>
                        <th class="py-3 px-6 text-center">Скачать</th>
                    </tr>
                </thead>
                <tbody class="text-gray-600 text-sm">
                    @forelse($materials as $item)
                        <tr class="border-b border-gray-200 hover:bg-gray-100">
                            <td class="py-3 px-6">{{ $item->description }}</td>
                            <td class="py-3 px-6">{{ $item->brand }}</td>
                            <td class="py-3 px-6">{{ $item->type }}</td>
                            <td class="py-3 px-6 text-center">
                                <a href="{{ $item->downloadUrl }}" class="text-blue-500 hover:text-blue-700" target="_blank" rel="noopener noreferrer">
                                    Скачать ({{ $item->fileType }}, {{ $item->fileSize }})
                                </a>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="4" class="text-center py-4">Данные не найдены. Убедитесь, что файл 'otch/trade.xls' существует и содержит данные.</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
@endsection
