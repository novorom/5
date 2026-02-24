"use client"

import Link from "next/link"
import { Phone, Mail, MapPin, MessageCircle, Clock } from "lucide-react"
import { Logo } from "./logo"

const footerLinks = {
  catalog: [
    { label: "Керамическая плитка", href: "/catalog?type=keramicheskaya-plitka" },
    { label: "Керамогранит", href: "/catalog?type=keramogranit" },
    { label: "Мозаика", href: "/catalog?type=mozaika" },
    { label: "Ступени", href: "/catalog?type=stupeni" },
  ],
  info: [
    { label: "О компании", href: "#" },
    { label: "Доставка и оплата", href: "#" },
    { label: "Гарантия", href: "#" },
    { label: "Контакты", href: "#" },
  ],
  help: [
    { label: "Как выбрать плитку", href: "#" },
    { label: "Уход за плиткой", href: "#" },
    { label: "Сертификаты", href: "#" },
    { label: "Видеообзоры", href: "#" },
  ],
}

const socialLinks = [
  {
    icon: '🏪',
    name: 'Avito',
    url: 'https://www.avito.ru/brands/i1860592?src=sharing',
  },
  {
    icon: '📱',
    name: 'VK',
    url: 'https://vk.com/tilebox',
  },
  {
    icon: '👥',
    name: 'Facebook',
    url: 'https://www.facebook.com/groups/1371104416315103',
  },
  {
    icon: '📷',
    name: 'Instagram',
    url: 'https://www.instagram.com/keraplit/',
  },
]

export function SiteFooter() {
  return (
    <footer className="bg-foreground text-background" suppressHydrationWarning>
      <div className="mx-auto max-w-7xl px-4 py-12" suppressHydrationWarning>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8" suppressHydrationWarning>
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="w-fit">
              <Logo className="h-16 w-auto" />
            </Link>
            <p className="text-sm text-background/60 leading-relaxed">
              Официальный дилер керамической плитки Cersanit в России. Более 750 наименований в наличии.
            </p>
            <div className="flex flex-col gap-2 text-sm">
              <a href="tel:+79052050900" className="flex items-center gap-2 text-background/70 hover:text-background transition-colors">
                <Phone className="h-4 w-4 shrink-0" />
                +7 (905) 205-09-00
              </a>
              <a href="mailto:novorom@mail.ru" className="flex items-center gap-2 text-background/70 hover:text-background transition-colors">
                <Mail className="h-4 w-4 shrink-0" />
                novorom@mail.ru
              </a>
              <a href="https://t.me/flyroman" className="flex items-center gap-2 text-background/70 hover:text-background transition-colors">
                <MessageCircle className="h-4 w-4 shrink-0" />
                @flyroman
              </a>
              
              {/* Social Media Links */}
              <div className="mt-2 pt-2 border-t border-background/10">
                <p className="text-xs text-background/50 uppercase tracking-widest mb-2">Найдите нас</p>
                <div className="flex items-center gap-2 flex-wrap">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={social.name}
                      className="text-lg text-background/70 hover:text-background transition-colors"
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
              
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
            <h3 className="text-sm font-semibold text-background mb-4">Каталог</h3>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.catalog.map((link) => (
                <li key={link.label} suppressHydrationWarning>
                  <Link
                    href={link.href}
                    className="text-sm text-background/60 hover:text-background transition-colors"
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
            <h3 className="text-sm font-semibold text-background mb-4">Информация</h3>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.info.map((link) => (
                <li key={link.label} suppressHydrationWarning>
                  <Link
                    href={link.href}
                    className="text-sm text-background/60 hover:text-background transition-colors"
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
            <h3 className="text-sm font-semibold text-background mb-4">Покупателям</h3>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.help.map((link) => (
                <li key={link.label} suppressHydrationWarning>
                  <Link
                    href={link.href}
                    className="text-sm text-background/60 hover:text-background transition-colors"
                    suppressHydrationWarning
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-background/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-background/40">
            {"2024-2025 Дом Плитки CERSANIT. Все права защищены."}
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
