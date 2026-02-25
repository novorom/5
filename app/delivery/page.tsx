'use client'

import Link from 'next/link'
import { Clock, MapPin, Truck, ChevronRight, Phone } from 'lucide-react'

// Metadata is defined in layout below

export default function DeliveryPage() {
  return (
    <main className="min-h-screen bg-background pt-8 pb-16">
      <div className="mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Доставка и самовывоз
          </h1>
          <p className="text-lg text-muted-foreground">
            Удобные варианты доставки плитки по России с гарантией качества
          </p>
        </div>

        {/* Two main options */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Self-pickup */}
          <div className="bg-card border border-border rounded-xl p-8 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-primary/10 rounded-lg">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground">Самовывоз</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Режим работы
                </h3>
                <div className="ml-7 space-y-1 text-muted-foreground">
                  <p><span className="font-medium">Пн-Пт:</span> 10:00 — 16:45</p>
                  <p><span className="font-medium text-foreground">Сб-Вс:</span> <span className="text-muted-foreground">выходной</span></p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Где забрать</h3>
                <p className="text-muted-foreground ml-0">Наш склад в Янино, Санкт-Петербург</p>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Удобство для вас:</span> мы сами загружаем плитку в ваш транспорт, чтобы вам не пришлось беспокоиться о погрузке.
                </p>
              </div>
            </div>
          </div>

          {/* Delivery */}
          <div className="bg-card border border-border rounded-xl p-8 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground">Доставка</h2>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Режим работы
                </h3>
                <div className="ml-7 space-y-1 text-muted-foreground">
                  <p><span className="font-medium">Пн-Пт:</span> по договоренности</p>
                  <p><span className="font-medium text-foreground">Сб-Вс:</span> <span className="text-muted-foreground">выходной</span></p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Варианты доставки</h3>
                <ul className="ml-0 space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>До подъезда вашего дома</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>С заносом в квартиру или дом</span>
                  </li>
                </ul>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Расчет стоимости:</span> определяется индивидуально для каждого заказа в зависимости от объема и удаленности.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional info */}
        <div className="bg-accent/5 border border-accent/20 rounded-xl p-8 mb-12">
          <h3 className="text-xl font-semibold text-foreground mb-4">Как заказать доставку?</h3>
          <p className="text-muted-foreground mb-4">
            После оформления заказа в каталоге наш менеджер свяжется с вами, чтобы согласовать удобный для вас способ доставки и рассчитать стоимость. Мы работаем быстро и надежно, чтобы ваша плитка прибыла в идеальном состоянии.
          </p>
          <div className="flex items-center gap-2 text-primary font-medium">
            <Phone className="h-5 w-5" />
            <span>Свяжитесь с нами: +7 (905) 205-09-00</span>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Перейти в каталог плитки
            <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </main>
  )
}
