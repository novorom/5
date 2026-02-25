import { Suspense } from "react"
import dynamic from "next/dynamic"
import { categories, collections } from "@/lib/mock-data"

const HomeContent = dynamic(() => import("@/components/home-content").then(mod => ({ default: mod.HomeContent })), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-background" />
})

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Suspense fallback={<div className="min-h-screen bg-background" />}>
        <HomeContent />
      </Suspense>
    </div>
  )
}
