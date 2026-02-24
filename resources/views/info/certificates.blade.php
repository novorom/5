@extends('layout')

@section('title', 'Сертификаты и отказные письма - 2D')
@section('meta_description', 'Сертификаты и отказные письма для керамической плитки и керамогранита.')

@php
    $documents = app(App\Services\ReportParserService::class)->getCertificates();
@endphp

@section('content')
    <div class="container mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold mb-8">Сертификаты и отказные письма (2D)</h1>

        <div class="bg-white shadow-md rounded my-6">
            <table class="min-w-full table-auto">
                <thead class="bg-gray-200">
                    <tr>
                        <th class="py-3 px-6 text-left">Описание</th>
                        <th class="py-3 px-6 text-left">Тип</th>
                        <th class="py-3 px-6 text-left">Срок окончания</th>
                        <th class="py-3 px-6 text-left">Размер</th>
                        <th class="py-3 px-6 text-center">Скачать</th>
                    </tr>
                </thead>
                <tbody class="text-gray-600 text-sm">
                    @forelse($documents as $doc)
                        <tr class="border-b border-gray-200 hover:bg-gray-100">
                            <td class="py-3 px-6">{{ $doc->description }}</td>
                            <td class="py-3 px-6">{{ $doc->type }}</td>
                            <td class="py-3 px-6">{{ $doc->endDate ?: 'N/A' }}</td>
                            <td class="py-3 px-6">{{ $doc->fileSize }}</td>
                            <td class="py-3 px-6 text-center">
                                <a href="{{ $doc->downloadUrl }}" class="text-blue-500 hover:text-blue-700" target="_blank" rel="noopener noreferrer">
                                    Скачать ({{ $doc->fileType }})
                                </a>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="5" class="text-center py-4">Данные не найдены. Убедитесь, что файл 'otch/certificates.xls' существует и содержит данные.</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
@endsection
