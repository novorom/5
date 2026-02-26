import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CartProvider } from "@/lib/cart-context"
import { ProductsProvider } from "@/lib/products-context"

const inter = Inter({ subsets: ["latin", "cyrillic"] })

const SITE_URL = "https://cersanit-spb.ru"

export const metadata: Metadata = {
  title: {
    default: "Купить плитку Cersanit в СПб -- доставка со склада Янино | Дом Плитки",
    template: "%s | Дом Плитки CERSANIT",
  },
  description:
    "Магазин плитки Cersanit в Санкт-Петербурге. Более 750 наименований керамической плитки, керамогранита и мозаики в наличии на складе в Янино. Доставка по СПб и ЛО от 1 дня. Самовывоз бесплатно.",
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    title: "Купить плитку Cersanit в СПб -- доставка со склада Янино",
    description:
      "Магазин плитки Cersanit в Санкт-Петербурге. 750+ позиций на складе Янино. Доставка по СПб и ЛО.",
    url: SITE_URL,
    siteName: "Дом Плитки CERSANIT",
    locale: "ru_RU",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  other: {
    "geo.region": "RU-SPE",
    "geo.placename": "Санкт-Петербург",
  },
}

export const viewport: Viewport = {
  themeColor: "#1e3a5f",
  width: "device-width",
  initialScale: 1,
}

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Дом Плитки CERSANIT",
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo-cersanit.png`,
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+7-905-205-09-00",
    contactType: "sales",
    areaServed: ["RU-SPE", "RU-LEN"],
    availableLanguage: "Russian",
  },
  sameAs: [
    "https://vk.com/tilebox",
    "https://www.avito.ru/brands/i1860592",
    "https://www.instagram.com/keraplit/",
    "https://www.facebook.com/groups/1371104416315103",
    "https://t.me/flyroman",
  ],
}

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}/#localbusiness`,
  name: "Дом Плитки CERSANIT",
  description:
    "Магазин керамической плитки и керамогранита Cersanit в Санкт-Петербурге. Склад и шоурум в Янино. Более 750 позиций в наличии.",
  url: SITE_URL,
  telephone: "+7-905-205-09-00",
  email: "novorom@mail.ru",
  image: `${SITE_URL}/images/logo-cersanit.png`,
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Янино-1",
    addressRegion: "Ленинградская область",
    addressCountry: "RU",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "59.8954",
    longitude: "30.5193",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "10:00",
      closes: "16:45",
    },
  ],
  areaServed: [
    { "@type": "City", name: "Санкт-Петербург" },
    { "@type": "State", name: "Ленинградская область" },
  ],
}

const webSiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Дом Плитки CERSANIT",
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/catalog?search={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(webSiteJsonLd),
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ProductsProvider>
          <CartProvider>
            <SiteHeader />
            <main className="min-h-screen">{children}</main>
            <SiteFooter />
          </CartProvider>
        </ProductsProvider>
      </body>
    </html>
  )
}
