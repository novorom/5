"use client"

import Link from "next/link"
import {
  ChevronRight,
  MapPin,
  Truck,
  ShieldCheck,
  Phone,
  Award,
  Package,
  Calculator,
  Clock,
} from "lucide-react"
import type { SeoPageData } from "@/lib/seo-data"
import { PHONE, PHONE_RAW } from "@/lib/seo-data"

const iconMap: Record<string, typeof MapPin> = {
  "Склад в Янино": MapPin,
  "Быстрая доставка": Truck,
  "Официальный дилер": ShieldCheck,
  "Бесплатный самовывоз": Package,
  "От 410 руб/м2": Award,
  "Все размеры в наличии": Package,
  "Расчёт количества": Calculator,
  "Образцы на складе": MapPin,
  "От 890 руб/м2": Award,
  "100+ позиций": Package,
  "Износостойкость PEI IV-V": ShieldCheck,
  "Доставка от 1 дня": Truck,
  "Полные коллекции": Package,
  "Расчёт бесплатно": Calculator,
  "Влагостойкость": ShieldCheck,
  "Самовывоз сегодня": Clock,
  "На сетке": Package,
  "3 коллекции": Award,
  "Комбинируется": Package,
  "Универсальная": ShieldCheck,
  "Бесплатный самовывоз": Package,
  "По всей России": Truck,
  "С заносом": Truck,
  "С 2011 года": Award,
  "750+ позиций": Package,
  "Шоурум в Янино": MapPin,
  "Отзывы на Avito": ShieldCheck,
}

function getIcon(title: string) {
  return iconMap[title] || Award
}

export function SeoLandingPage({ data }: { data: SeoPageData }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumbs */}
      <div className="bg-muted/50 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <nav
            className="flex items-center gap-1.5 text-sm text-muted-foreground"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="hover:text-primary transition-colors">
              Главная
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground font-medium">
              {data.breadcrumbLabel}
            </span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-balance">
            {data.h1}
          </h1>
          <p className="mt-4 text-primary-foreground/80 text-lg leading-relaxed max-w-3xl">
            {data.intro}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={data.catalogLink}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-background text-foreground font-medium text-sm hover:bg-background/90 transition-colors"
            >
              {data.catalogLinkLabel}
              <ChevronRight className="h-4 w-4" />
            </Link>
            <a
              href={`tel:${PHONE_RAW}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-primary-foreground/30 text-primary-foreground font-medium text-sm hover:bg-primary-foreground/10 transition-colors"
            >
              <Phone className="h-4 w-4" />
              {PHONE}
            </a>
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section className="py-12 lg:py-16 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-8">
            Наши преимущества
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {data.advantages.map((adv) => {
              const Icon = getIcon(adv.title)
              return (
                <div
                  key={adv.title}
                  className="flex flex-col gap-3 p-6 rounded-xl border border-border bg-card"
                >
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {adv.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {adv.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="max-w-4xl flex flex-col gap-10">
            {data.sections.map((section) => (
              <div key={section.heading}>
                <h2 className="text-xl lg:text-2xl font-bold text-foreground mb-4">
                  {section.heading}
                </h2>
                <p className="text-foreground/80 leading-relaxed">
                  {section.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 lg:py-16 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-8">
            Часто задаваемые вопросы
          </h2>
          <div className="max-w-3xl flex flex-col gap-5">
            {data.faq.map((item, i) => (
              <details
                key={i}
                className="group rounded-xl border border-border bg-card overflow-hidden"
              >
                <summary className="flex items-center justify-between cursor-pointer px-6 py-4 text-foreground font-medium hover:bg-muted/50 transition-colors">
                  <span className="pr-4">{item.question}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 transition-transform group-open:rotate-90" />
                </summary>
                <div className="px-6 pb-4">
                  <p className="text-foreground/80 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 lg:py-16 bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4 text-balance">
            Нужна помощь в выборе плитки?
          </h2>
          <p className="text-primary-foreground/70 mb-8 max-w-lg mx-auto">
            Наши специалисты бесплатно подберут плитку для вашего проекта и
            рассчитают необходимое количество.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={`tel:${PHONE_RAW}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-background text-foreground font-medium text-sm hover:bg-background/90 transition-colors"
            >
              <Phone className="h-4 w-4" />
              Позвонить
            </a>
            <Link
              href={data.catalogLink}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-primary-foreground/30 text-primary-foreground font-medium text-sm hover:bg-primary-foreground/10 transition-colors"
            >
              {data.catalogLinkLabel}
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
