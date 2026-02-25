"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"

const HomeContent = dynamic(() => import("@/components/home-content").then(mod => ({ default: mod.HomeContent })), {
  loading: () => <div className="min-h-screen bg-background" />
})

const homeFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Вы официальный дилер Cersanit?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Да, мы являемся официальным дилером Cersanit в России. Все товары поставляются напрямую с заводов, имеют сертификаты качества и гарантию производителя. Работаем на рынке керамической плитки с 2011 года.",
      },
    },
    {
      "@type": "Question",
      name: "Где находится ваш склад?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Наш склад расположен в п. Янино-1, Ленинградская область (15-20 минут от КАД). Здесь хранится весь ассортимент -- более 750 наименований. Режим работы: Пн-Пт 10:00-16:45.",
      },
    },
    {
      "@type": "Question",
      name: "Как быстро доставляете по Санкт-Петербургу?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Доставка по СПб и Ленинградской области -- от 1-2 рабочих дней. Самовывоз со склада Янино бесплатный в день оплаты.",
      },
    },
    {
      "@type": "Question",
      name: "Помогаете рассчитать количество плитки?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Да, мы бесплатно рассчитаем нужное количество плитки по размерам вашего помещения. Свяжитесь с нами по телефону +7 (905) 205-09-00 или в Telegram @flyroman.",
      },
    },
    {
      "@type": "Question",
      name: "Работаете с юридическими лицами?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Да, работаем с юридическими лицами и строительными компаниями. Предоставляем все документы: сертификаты качества, счета-фактуры, товарные накладные. Оплата по безналичному расчёту с НДС.",
      },
    },
  ],
}

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeFaqJsonLd) }}
      />
      <Suspense fallback={<div className="min-h-screen bg-background" />}>
        <HomeContent />
      </Suspense>
    </div>
  )
}
