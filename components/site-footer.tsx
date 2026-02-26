"use client"

import Link from "next/link"
import Image from "next/image"
import { Phone, Mail, MapPin, Clock } from "lucide-react"
import { Logo } from "./logo"

const footerLinks = {
  catalog: [
    { label: "Керамическая плитка", href: "/catalog?product_type=Керамическая плитка" },
    { label: "Керамогранит", href: "/catalog?product_type=Керамогранит" },
    { label: "Мозаика", href: "/catalog?product_type=Мозаика" },
    { label: "Ступени", href: "/catalog?product_type=Ступени" },
  ],
  info: [
    { label: "О компании", href: "/about" },
    { label: "Доставка", href: "/delivery" },
    { label: "Контакты", href: "/contacts" },
    { label: "Коллекции", href: "/collections" },
  ],
  help: [
    { label: "Каталог", href: "/catalog" },
    { label: "Плитка в СПб", href: "/spb" },
    { label: "Керамическая плитка СПб", href: "/keramicheskaya-plitka-spb" },
    { label: "Керамогранит СПб", href: "/keramogranit-spb" },
    { label: "Плитка для ванной СПб", href: "/plitka-dlya-vannoj-spb" },
    { label: "Мозаика СПб", href: "/mozaika-spb" },
  ],
}

const socialLinks = [
  {
    name: 'Avito',
    url: 'https://www.avito.ru/brands/i1860592?src=sharing',
    logo: '/images/avito-logo.png',
  },
  {
    name: 'VK',
    url: 'https://vk.com/tilebox',
    logo: '/images/vk-logo.svg',
  },
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/groups/1371104416315103',
    logo: '/images/facebook-logo.svg',
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/keraplit/',
    logo: '/images/instagram-logo.png',
  },
  {
    name: 'YouTube',
    url: 'https://www.youtube.com/@novorom',
    logo: '/images/youtube-logo.svg',
  },
]

export function SiteFooter() {
  return (
    <footer className="bg-foreground text-background" suppressHydrationWarning>
      <div className="mx-auto max-w-7xl px-4 py-12" suppressHydrationWarning>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12" suppressHydrationWarning>
          {/* Brand - wider column */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <Link href="/" className="w-fit">
              <Logo className="h-16 w-auto" />
            </Link>
            <div className="flex flex-col gap-2 text-sm">
              <a href="tel:+79052050900" className="flex items-center gap-2 text-background/70 hover:text-background transition-colors">
                <Phone className="h-4 w-4 shrink-0" />
                +7 (905) 205-09-00
              </a>
              <a href="mailto:novorom@mail.ru" className="flex items-center gap-2 text-background/70 hover:text-background transition-colors">
                <Mail className="h-4 w-4 shrink-0" />
                novorom@mail.ru
              </a>
              <a href="https://t.me/flyroman" className="flex items-center gap-2 text-background/70 hover:text-background transition-colors" title="Telegram" aria-label="Telegram @flyroman">
                <Image 
                  src="/images/telegram-logo.svg" 
                  alt="Telegram" 
                  width={32} 
                  height={32}
                  className="h-8 w-8 shrink-0"
                />
              </a>
              
              <span className="flex items-center gap-2 text-background/70 mt-3 pt-2 border-t border-background/10">
                <MapPin className="h-4 w-4 shrink-0" />
                СПб, Янино-1, участок 37
              </span>
              <span className="flex items-center gap-2 text-background/70">
                <Clock className="h-4 w-4 shrink-0" />
                Ежедневно 10:00 - 17:00
              </span>
            </div>
          </div>

          {/* Catalog links */}
          <div>
            <h3 className="text-sm font-semibold text-background mb-4 uppercase tracking-widest">Каталог</h3>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.catalog.map((link) => (
                <li key={link.label} suppressHydrationWarning>
                  <Link
                    href={link.href}
                    className="text-sm text-background/70 hover:text-background transition-colors"
                    suppressHydrationWarning
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info links */}
          <div>
            <h3 className="text-sm font-semibold text-background mb-4 uppercase tracking-widest">Информация</h3>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.info.map((link) => (
                <li key={link.label} suppressHydrationWarning>
                  <Link
                    href={link.href}
                    className="text-sm text-background/70 hover:text-background transition-colors"
                    suppressHydrationWarning
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help links */}
          <div>
            <h3 className="text-sm font-semibold text-background mb-4 uppercase tracking-widest">Покупателям</h3>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.help.map((link) => (
                <li key={link.label} suppressHydrationWarning>
                  <Link
                    href={link.href}
                    className="text-sm text-background/70 hover:text-background transition-colors"
                    suppressHydrationWarning
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media - rightmost column */}
          <div>
            <h3 className="text-sm font-semibold text-background mb-4 uppercase tracking-widest">Найдите нас</h3>
            <div className="flex items-center gap-4 flex-wrap">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={social.name}
                  aria-label={social.name}
                  className="hover:opacity-80 transition-opacity"
                >
                  <Image
                    src={social.logo}
                    alt={social.name}
                    width={24}
                    height={24}
                    className="h-6 w-6"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-background/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-background/40">
            {"2024-2026 Дом Плитки CERSANIT. Все права защищены."}
          </p>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-xs text-background/40 hover:text-background/60 transition-colors">
              Политика конфиденциальности
            </Link>
            <Link href="#" className="text-xs text-background/40 hover:text-background/60 transition-colors">
              Пользовательское соглашение
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
