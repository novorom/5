{{-- Виджет мессенджеров - плавающий справа --}}
<div x-data="{ open: false }" class="fixed right-4 bottom-4 z-50">
    {{-- Кнопка раскрытия --}}
    <button @click="open = !open" 
            class="bg-gradient-to-r from-green-500 to-green-600 text-white w-16 h-16 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center">
        <span x-show="!open" class="text-2xl">💬</span>
        <span x-show="open" class="text-2xl">✕</span>
    </button>

    {{-- Меню мессенджеров --}}
    <div x-show="open" 
         x-transition:enter="transition ease-out duration-200"
         x-transition:enter-start="opacity-0 scale-90"
         x-transition:enter-end="opacity-100 scale-100"
         x-transition:leave="transition ease-in duration-150"
         x-transition:leave-start="opacity-100 scale-100"
         x-transition:leave-end="opacity-0 scale-90"
         class="absolute bottom-20 right-0 bg-white rounded-lg shadow-2xl overflow-hidden"
         style="display: none;">
        
        <div class="p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <div class="font-bold text-lg">Напишите нам!</div>
            <div class="text-sm opacity-90">Ответим за 5 минут</div>
        </div>

        <div class="p-2">
            {{-- WhatsApp --}}
            <a href="https://wa.me/{{ env('CONTACT_WHATSAPP') }}?text=Здравствуйте! Интересует плитка Cersanit." 
               target="_blank"
               class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition group">
                <div class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition">
                    📱
                </div>
                <div>
                    <div class="font-semibold text-gray-900">WhatsApp</div>
                    <div class="text-sm text-gray-500">Быстрый ответ</div>
                </div>
            </a>

            {{-- Telegram --}}
            <a href="https://t.me/{{ env('CONTACT_TELEGRAM') }}" 
               target="_blank"
               class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition group">
                <div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition">
                    ✈️
                </div>
                <div>
                    <div class="font-semibold text-gray-900">Telegram</div>
                    <div class="text-sm text-gray-500">Консультация</div>
                </div>
            </a>

            {{-- VK (если есть) --}}
            @if(env('CONTACT_VK'))
            <a href="https://vk.me/{{ env('CONTACT_VK') }}" 
               target="_blank"
               class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition group">
                <div class="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition">
                    💙
                </div>
                <div>
                    <div class="font-semibold text-gray-900">ВКонтакте</div>
                    <div class="text-sm text-gray-500">Сообщения</div>
                </div>
            </a>
            @endif

            {{-- Позвонить --}}
            <a href="tel:{{ env('CONTACT_PHONE') }}" 
               class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition group">
                <div class="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition">
                    📞
                </div>
                <div>
                    <div class="font-semibold text-gray-900">Позвонить</div>
                    <div class="text-sm text-gray-500">{{ env('CONTACT_PHONE') }}</div>
                </div>
            </a>
        </div>

        <div class="p-4 bg-gray-50 border-t text-center text-sm text-gray-600">
            ⏰ Обычно отвечаем за 5 минут
        </div>
    </div>
</div>

{{-- Мини-версия для мобильных --}}
<div class="fixed bottom-4 left-4 z-40 md:hidden">
    <a href="https://wa.me/{{ env('CONTACT_WHATSAPP') }}" 
       class="block w-14 h-14 bg-green-500 text-white rounded-full shadow-lg flex items-center justify-center text-2xl animate-pulse">
        📱
    </a>
</div>
