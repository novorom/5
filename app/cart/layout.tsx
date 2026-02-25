import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Корзина -- Дом Плитки CERSANIT",
  description: "Ваша корзина покупок. Оформите заказ на керамическую плитку и керамогранит Cersanit с доставкой по СПб и ЛО.",
  robots: { index: false, follow: true },
}

export default function CartLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
