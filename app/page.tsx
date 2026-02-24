import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Truck, ShieldCheck, Award, ChevronRight } from "lucide-react"
import { categories, collections } from "@/lib/mock-data"
import { ProductCard } from "@/components/product-card"
import { HomeContent } from "@/components/home-content"

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HomeContent />
    </div>
  )
}
