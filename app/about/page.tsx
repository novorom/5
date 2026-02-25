import Link from 'next/link'
import { ExternalLink, Award, MapPin, Package } from 'lucide-react'

export const metadata = {
  title: 'О компании Дом Плитки -- магазин Cersanit в СПб с 2011 года',
  description: 'Более 13 лет на рынке керамической плитки в Санкт-Петербурге. Склад и шоурум в Янино. 10+ производителей-партнёров. Отзывы на Avito. Доставка по СПб и ЛО.',
  openGraph: {
    title: 'О компании Дом Плитки -- магазин Cersanit в СПб',
    description: 'Более 13 лет на рынке керамической плитки в Санкт-Петербурге. Склад и шоурум в Янино.',
  },
}

export default function AboutPage() {
  const manufacturers = [
    { name: 'Cersanit', country: 'Польша' },
    { name: 'Шахтинская плитка (GraciaCeramica)', country: 'Россия' },
    { name: 'Нефрит-керамика', country: 'Россия' },
    { name: 'Квадро-Декор', country: 'Россия' },
    { name: 'Керама-Марацци', country: 'Россия' },
    { name: 'Азори (Керабуд)', country: 'Россия' },
    { name: 'Уральский гранит (Idalgo)', country: 'Россия' },
    { name: 'Керамика Будущего', country: 'Россия' },
    { name: 'Granitea (Гранитея)', country: 'Россия' },
    { name: 'Daco', country: 'Дагестан' },
  ]

  return (
    <main className="min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-background border-b border-border">
        <div className="container max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Главная</Link>
            <span>/</span>
            <span className="text-foreground">О компании</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-12 lg:py-20">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              О нашей компании
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Более 13 лет на рынке керамической плитки и керамогранита. Мы помогаем тысячам клиентов найти идеальное решение для их проектов.
            </p>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="py-16 lg:py-24">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                Наша история
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                С 2011 года мы занимаемся розничной продажей высококачественной керамической плитки и керамогранита от ведущих производителей. За эти годы мы завоевали доверие тысяч клиентов благодаря профессионализму, качеству товара и отличному сервису.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Наша миссия — сделать процесс выбора плитки простым и приятным, предоставляя широкий ассортимент продукции, справедливые цены и компетентную консультацию.
              </p>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8 lg:p-12 border border-primary/20">
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <Award className="w-8 h-8 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">13+ лет опыта</h3>
                    <p className="text-sm text-muted-foreground">На рынке керамической плитки и керамогранита</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Package className="w-8 h-8 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Множество производителей</h3>
                    <p className="text-sm text-muted-foreground">Партнерство с 10+ ведущими заводами</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-12">
            Отзывы наших клиентов
          </h2>
          <div className="bg-white rounded-2xl p-8 lg:p-12 border border-border shadow-sm">
            <p className="text-lg text-muted-foreground mb-6">
              Посмотрите отзывы о нашей компании на Avito. Они помогут вам узнать о качестве нашего сервиса и товара от реальных клиентов.
            </p>
            <Link
              href="https://www.avito.ru/brands/i1860592?src=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Смотреть отзывы на Avito
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Manufacturers Section */}
      <section className="py-16 lg:py-24">
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
            Наши партнеры
          </h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-3xl">
            Мы работаем с ведущими производителями керамической плитки и керамогранита, предоставляя вам широкий выбор качественных товаров по справедливым ценам.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {manufacturers.map((manufacturer, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-foreground mb-2">
                  {manufacturer.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {manufacturer.country}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-8">
                Склад и шоурум в Янино
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <MapPin className="w-6 h-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Местоположение</h3>
                    <p className="text-muted-foreground">
                      Большой склад и просторный шоурум находятся в Янино, что позволяет нам предложить вам удобный самовывоз и быструю доставку.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Package className="w-6 h-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Услуги доставки</h3>
                    <p className="text-muted-foreground">
                      Мы предлагаем удобные варианты доставки и самовывоза. При самовывозе со склада в Янино наша команда загружает плитку своими силами в ваш транспорт.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8 lg:p-12 border border-primary/20 h-full min-h-96 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-primary mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">Карта местоположения</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-primary text-primary-foreground">
        <div className="container max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Готовы найти идеальную плитку?
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Посетите наш каталог, выберите понравившиеся товары и свяжитесь с нами для подробной консультации.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/catalog"
              className="px-8 py-3 bg-primary-foreground text-primary rounded-lg font-medium hover:bg-primary-foreground/90 transition-colors"
            >
              Перейти в каталог
            </Link>
            <Link
              href="/delivery"
              className="px-8 py-3 border-2 border-primary-foreground text-primary-foreground rounded-lg font-medium hover:bg-primary-foreground/10 transition-colors"
            >
              Информация о доставке
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
