import { Metadata } from "next"
import Link from "next/link"
import { Star, MapPin, Calendar, ExternalLink } from "lucide-react"

export const metadata: Metadata = {
  title: "Отзывы о нас | Дом Плитки CERSANIT",
  description:
    "Читайте отзывы наших клиентов о керамической плитке и керамограните. Более 5 лет успешных розничных продаж в Санкт-Петербурге. Смотрите отзывы на Авито.",
  alternates: {
    canonical: "/reviews",
  },
}

export default function ReviewsPage() {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Отзывы наших клиентов</h1>
          <p className="text-lg text-foreground/70">
            Более 5 лет мы успешно занимаемся розничными продажами керамической плитки и керамогранита в Санкт-Петербурге. 
            Вот что говорят о нас наши покупатели:
          </p>
        </div>

        {/* Avito Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12 border-2 border-foreground/10">
          <div className="flex items-start gap-4 mb-6">
            <img 
              src="/images/avito-logo.png" 
              alt="Avito" 
              className="h-12 w-12 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground mb-1">Отзывы на Avito</h2>
              <p className="text-foreground/60">Профиль нашего магазина на крупнейшей платформе объявлений в России</p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-2 text-sm text-foreground/70">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">Высокий рейтинг от множества покупателей</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-foreground/70">
              <MapPin className="h-4 w-4" />
              <span>Наш магазин работает в Санкт-Петербурге с 2019 года</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-foreground/70">
              <Calendar className="h-4 w-4" />
              <span>Ежедневные доставки и самовывоз из шоурума в Янино-1</span>
            </div>
          </div>

          <p className="text-foreground/70 mb-6">
            На Avito вы найдёте подробные отзывы о качестве нашей керамической плитки, керамогранита и обслуживании. 
            Посмотрите оценки, прочитайте комментарии реальных покупателей и убедитесь в надёжности нашего магазина.
          </p>

          <a
            href="https://www.avito.ru/brands/i1860592/all/remont_i_stroitelstvo?src=sharing&sellerId=1175db1d93c4ba564bc712e7e695d5b5"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-lg font-semibold hover:bg-foreground/90 transition-colors"
          >
            Посмотреть наш профиль на Avito
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        {/* Why Choose Us */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-foreground/5 rounded-lg p-6 border border-foreground/10">
            <h3 className="text-lg font-bold text-foreground mb-3">Почему нас выбирают</h3>
            <ul className="space-y-2 text-sm text-foreground/70">
              <li className="flex items-start gap-2">
                <span className="text-foreground font-bold">✓</span>
                <span>Более 750 позиций в наличии на складе</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-foreground font-bold">✓</span>
                <span>Доставка по СПб и ЛО от 1 дня</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-foreground font-bold">✓</span>
                <span>Бесплатный самовывоз из шоурума</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-foreground font-bold">✓</span>
                <span>Честные цены и качество товара</span>
              </li>
            </ul>
          </div>

          <div className="bg-foreground/5 rounded-lg p-6 border border-foreground/10">
            <h3 className="text-lg font-bold text-foreground mb-3">Наш опыт</h3>
            <ul className="space-y-2 text-sm text-foreground/70">
              <li className="flex items-start gap-2">
                <span className="text-foreground font-bold">✓</span>
                <span>5+ лет на рынке розничной торговли</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-foreground font-bold">✓</span>
                <span>Тысячи довольных клиентов</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-foreground font-bold">✓</span>
                <span>Профессиональная консультация</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-foreground font-bold">✓</span>
                <span>Гарантия на всю продукцию</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <p className="text-foreground/70 mb-4">
            Готовы найти идеальную плитку для вашего проекта?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/catalog"
              className="inline-flex items-center justify-center bg-foreground text-background px-6 py-3 rounded-lg font-semibold hover:bg-foreground/90 transition-colors"
            >
              Перейти в каталог
            </Link>
            <Link
              href="/contacts"
              className="inline-flex items-center justify-center border-2 border-foreground text-foreground px-6 py-3 rounded-lg font-semibold hover:bg-foreground/5 transition-colors"
            >
              Связаться с нами
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
