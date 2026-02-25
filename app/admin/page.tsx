"use client"

import { Suspense } from "react"
import dynamicImport from "next/dynamic"

// Lazy load the admin content to defer context usage until client-side
const AdminContentLazy = dynamicImport(() => import("./admin-content"), {
  loading: () => (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <p className="text-lg text-foreground/60">Загрузка админ-панели...</p>
      </div>
    </div>
  ),
})

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-foreground/60">Загрузка...</p>
          </div>
        </div>
      }
    >
      <AdminContentLazy />
    </Suspense>
  )
}
