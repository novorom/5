import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Каталог плитки Cersanit -- купить в СПб со склада Янино",
  description:
    "Полный каталог керамической плитки, керамогранита и мозаики Cersanit. Более 750 позиций в наличии на складе в Янино (СПб). Фильтры по типу, цвету, размеру. Доставка по СПб и ЛО от 1 дня.",
  openGraph: {
    title: "Каталог плитки Cersanit -- купить в СПб",
    description:
      "Более 750 наименований плитки Cersanit в наличии. Керамическая плитка, керамогранит, мозаика. Доставка по СПб со склада Янино.",
  },
}

export default function CatalogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
