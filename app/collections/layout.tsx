import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Коллекции плитки Cersanit -- Calacatta, Wood Concept и другие | СПб",
  description:
    "Все коллекции керамической плитки и керамогранита Cersanit: Calacatta, Wood Concept Natural, Deco, Lofthouse и 80+ коллекций. Склад в Янино, доставка по Санкт-Петербургу и ЛО.",
  openGraph: {
    title: "Коллекции плитки Cersanit в СПб",
    description:
      "Все дизайнерские коллекции Cersanit в наличии на складе Янино. Доставка по СПб от 1 дня.",
  },
}

export default function CollectionsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
