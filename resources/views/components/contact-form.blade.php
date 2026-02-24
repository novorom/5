{{-- Форма связи --}}
<section class="py-16 bg-white" id="contact-form">
    <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
            <h2 class="text-4xl font-bold text-center mb-4">💬 Нужна помощь?</h2>
            <p class="text-center text-gray-600 mb-12">
                Задайте вопрос, запросите расчет или попросите подобрать аналоги.<br>
                Ответим в течение 30 минут!
            </p>

            <div class="grid md:grid-cols-2 gap-8">
                {{-- ФОРМА --}}
                <div class="bg-gray-50 rounded-xl p-8">
                    <form action="/send-question" method="POST" x-data="contactForm()" @submit.prevent="submitForm">
                        @csrf
                        
                        <div class="mb-4">
                            <label class="block text-sm font-medium mb-2">Ваше имя</label>
                            <input type="text" 
                                   name="name" 
                                   x-model="form.name"
                                   required
                                   class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                   placeholder="Как к вам обращаться?">
                        </div>

                        <div class="mb-4">
                            <label class="block text-sm font-medium mb-2">Телефон или Email</label>
                            <input type="text" 
                                   name="contact" 
                                   x-model="form.contact"
                                   required
                                   class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                   placeholder="+7 (999) 123-45-67 или email@example.com">
                        </div>

                        <div class="mb-4">
                            <label class="block text-sm font-medium mb-2">Тип обращения</label>
                            <select name="type" 
                                    x-model="form.type"
                                    class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500">
                                <option value="question">Вопрос о товаре</option>
                                <option value="calculation">Расчет количества</option>
                                <option value="analog">Подобрать аналог</option>
                                <option value="order">Оформить заказ</option>
                                <option value="other">Другое</option>
                            </select>
                        </div>

                        <div class="mb-4">
                            <label class="block text-sm font-medium mb-2">Артикул товара (если есть)</label>
                            <input type="text" 
                                   name="sku" 
                                   x-model="form.sku"
                                   class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                   placeholder="Например: A17697">
                        </div>

                        <div class="mb-6">
                            <label class="block text-sm font-medium mb-2">Ваш вопрос</label>
                            <textarea name="message" 
                                      x-model="form.message"
                                      required
                                      rows="4"
                                      class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                      placeholder="Опишите ваш вопрос или задачу..."></textarea>
                        </div>

                        <button type="submit" 
                                :disabled="loading"
                                class="w-full bg-blue-600 text-white px-6 py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition disabled:opacity-50"
                                x-text="loading ? 'Отправляем...' : '📧 Отправить'">
                        </button>

                        <div x-show="success" 
                             x-transition
                             class="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded"
                             style="display: none;">
                            ✅ Спасибо! Ваше сообщение отправлено. Ответим в течение 30 минут.
                        </div>

                        <div x-show="error" 
                             x-transition
                             class="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
                             style="display: none;"
                             x-text="errorMessage">
                        </div>
                    </form>
                </div>

                {{-- ПРЕИМУЩЕСТВА --}}
                <div class="space-y-6">
                    <div class="flex gap-4">
                        <div class="text-4xl">⏰</div>
                        <div>
                            <h3 class="font-bold text-lg mb-2">Быстрый ответ</h3>
                            <p class="text-gray-600">Отвечаем на вопросы в течение 30 минут в рабочее время.</p>
                        </div>
                    </div>

                    <div class="flex gap-4">
                        <div class="text-4xl">🧮</div>
                        <div>
                            <h3 class="font-bold text-lg mb-2">Бесплатный расчет</h3>
                            <p class="text-gray-600">Рассчитаем точное количество плитки для вашего помещения с учетом запаса.</p>
                        </div>
                    </div>

                    <div class="flex gap-4">
                        <div class="text-4xl">🔄</div>
                        <div>
                            <h3 class="font-bold text-lg mb-2">Подбор аналогов</h3>
                            <p class="text-gray-600">Нет нужной позиции? Подберем похожую по цвету, размеру и цене.</p>
                        </div>
                    </div>

                    <div class="flex gap-4">
                        <div class="text-4xl">💰</div>
                        <div>
                            <h3 class="font-bold text-lg mb-2">Честная цена</h3>
                            <p class="text-gray-600">Цена на сайте = цена при заказе. Без скрытых доплат.</p>
                        </div>
                    </div>

                    <div class="bg-blue-50 rounded-lg p-6 mt-8">
                        <div class="font-bold mb-2">📧 Почта для заказов:</div>
                        <a href="mailto:novorom@mail.ru" class="text-blue-600 text-lg">novorom@mail.ru</a>
                        
                        <div class="font-bold mt-4 mb-2">📞 Телефон:</div>
                        <a href="tel:{{ env('CONTACT_PHONE') }}" class="text-blue-600 text-lg">{{ env('CONTACT_PHONE') }}</a>
                        
                        <div class="font-bold mt-4 mb-2">💬 Мессенджеры:</div>
                        <div class="flex gap-2">
                            <a href="https://wa.me/{{ env('CONTACT_WHATSAPP') }}" 
                               target="_blank"
                               class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition">
                                WhatsApp
                            </a>
                            <a href="https://t.me/{{ env('CONTACT_TELEGRAM') }}" 
                               target="_blank"
                               class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
                                Telegram
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

@push('scripts')
<script>
function contactForm() {
    return {
        form: {
            name: '',
            contact: '',
            type: 'question',
            sku: '',
            message: ''
        },
        loading: false,
        success: false,
        error: false,
        errorMessage: '',

        async submitForm() {
            this.loading = true;
            this.success = false;
            this.error = false;

            try {
                const response = await fetch('/send-question', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                    },
                    body: JSON.stringify(this.form)
                });

                const data = await response.json();

                if (response.ok) {
                    this.success = true;
                    this.form = {
                        name: '',
                        contact: '',
                        type: 'question',
                        sku: '',
                        message: ''
                    };
                } else {
                    throw new Error(data.message || 'Ошибка отправки');
                }
            } catch (err) {
                this.error = true;
                this.errorMessage = err.message;
            } finally {
                this.loading = false;
            }
        }
    }
}
</script>
@endpush
