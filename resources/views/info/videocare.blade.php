@extends('layout')

@section('title', 'Видеорекомендации по уходу - 2D')
@section('meta_description', 'Видеорекомендации по уходу за керамической плиткой и керамогранитом.')

@php
    $videos = app(App\Services\ReportParserService::class)->getVideoCareRecommendations();
@endphp

@section('content')
    <div class="container mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold mb-8">Видеорекомендации по уходу (2D)</h1>

        @if(empty($videos))
            <p class="text-center py-4">Данные не найдены. Убедитесь, что файл 'otch/videocare.xls' существует и содержит данные.</p>
        @else
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                @foreach($videos as $video)
                    <div class="bg-white rounded-lg shadow-md overflow-hidden">
                        <div class="p-6">
                            <h2 class="font-bold text-xl mb-2">{{ $video->title }}</h2>
                            <div class="flex space-x-4 mt-4">
                                <a href="{{ $video->watchUrl }}" class="text-blue-500 hover:text-blue-700" target="_blank" rel="noopener noreferrer">Смотреть</a>
                                <a href="{{ $video->downloadUrl }}" class="text-gray-500 hover:text-gray-700" target="_blank" rel="noopener noreferrer">Скачать</a>
                            </div>
                        </div>
                    </div>
                @endforeach
            </div>
        @endif
    </div>
@endsection
