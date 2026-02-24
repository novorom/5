@extends('layout')

@section('title', 'Рекомендации по уходу - 2D')
@section('meta_description', 'Рекомендации по уходу, укладке и очистке керамической плитки и керамогранита.')

@php
    $recommendations = app(App\Services\ReportParserService::class)->getCareRecommendations();
@endphp

@section('content')
    <div class="container mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold mb-8">Рекомендации по уходу (2D)</h1>

        <div class="bg-white shadow-md rounded my-6">
            <table class="min-w-full table-auto">
                <thead class="bg-gray-200">
                    <tr>
                        <th class="py-3 px-6 text-left">Описание</th>
                        <th class="py-3 px-6 text-left">Тип</th>
                        <th class="py-3 px-6 text-left">Дата</th>
                        <th class="py-3 px-6 text-center">Скачать</th>
                    </tr>
                </thead>
                <tbody class="text-gray-600 text-sm">
                    @forelse($recommendations as $rec)
                        <tr class="border-b border-gray-200 hover:bg-gray-100">
                            <td class="py-3 px-6">{{ $rec->description }}</td>
                            <td class="py-3 px-6">{{ $rec->type }}</td>
                            <td class="py-3 px-6">{{ $rec->date }}</td>
                            <td class="py-3 px-6 text-center">
                                <a href="{{ $rec->downloadUrl }}" class="text-blue-500 hover:text-blue-700" target="_blank" rel="noopener noreferrer">
                                    Скачать ({{ $rec->fileType }}, {{ $rec->fileSize }})
                                </a>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="4" class="text-center py-4">Данные не найдены. Убедитесь, что файл 'otch/care.xls' существует и содержит данные.</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
@endsection
