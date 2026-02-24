"use client"

import { useState, useRef } from "react"
import { AlertCircle, Upload, Check, X, Download } from "lucide-react"
import type { Product } from "@/lib/products-data"
import { products as initialProducts } from "@/lib/products-data"
import {
  processYaninoFile,
  processZavodFile,
  processPriceFile,
  type ExcelProcessResult,
} from "@/lib/excel-processor"
import { verifyAdminAccess } from "@/lib/admin-auth"

interface ProcessingResult {
  fileType: string
  result: ExcelProcessResult
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [passcode, setPasscode] = useState("")
  const [authError, setAuthError] = useState("")
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [processingResults, setProcessingResults] = useState<ProcessingResult[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  const yaninoFileRef = useRef<HTMLInputElement>(null)
  const zavodFileRef = useRef<HTMLInputElement>(null)
  const priceFileRef = useRef<HTMLInputElement>(null)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError("")

    if (verifyAdminAccess(passcode)) {
      setIsAuthenticated(true)
      setPasscode("")
    } else {
      setAuthError("Неверный пароль")
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setPasscode("")
    setProcessingResults([])
    setProducts(initialProducts)
    setSuccessMessage("")
  }

  const handleFileUpload = async (
    file: File,
    fileType: "yanino" | "zavod" | "price"
  ) => {
    if (!file) return

    setIsProcessing(true)
    setSuccessMessage("")

    try {
      const buffer = await file.arrayBuffer()
      let result: ExcelProcessResult

      if (fileType === "yanino") {
        result = processYaninoFile(buffer, products)
      } else if (fileType === "zavod") {
        result = processZavodFile(buffer, products)
      } else {
        result = processPriceFile(buffer, products)
      }

      setProducts(result.updatedProducts)
      setProcessingResults([
        ...processingResults,
        {
          fileType,
          result,
        },
      ])

      setSuccessMessage(
        `✓ ${fileType === "yanino" ? "Янино" : fileType === "zavod" ? "Завод" : "Прайс"} обработан. Обновлено: ${result.matchedCount}`
      )

      // Reset file input
      if (fileType === "yanino") yaninoFileRef.current!.value = ""
      if (fileType === "zavod") zavodFileRef.current!.value = ""
      if (fileType === "price") priceFileRef.current!.value = ""
    } catch (error) {
      setSuccessMessage(
        `✗ Ошибка при обработке файла: ${error instanceof Error ? error.message : "Неизвестная ошибка"}`
      )
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSaveUpdates = () => {
    // Save to localStorage for session persistence
    localStorage.setItem("admin-products", JSON.stringify(products))
    setSuccessMessage("✓ Данные сохранены в браузер (для сеанса)")
  }

  const handleExportData = () => {
    const dataStr = JSON.stringify(products, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `products-updated-${new Date().toISOString().split("T")[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleResetData = () => {
    if (confirm("Вы уверены? Все изменения будут отменены.")) {
      setProducts(initialProducts)
      setProcessingResults([])
      localStorage.removeItem("admin-products")
      setSuccessMessage("✓ Данные сброшены")
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-card border border-border rounded-xl shadow-lg p-6 sm:p-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">Админ-панель</h1>
            <p className="text-muted-foreground text-sm mb-6">
              Введите пароль для доступа к управлению товарами
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Пароль
                </label>
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Введите пароль"
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-all"
                  autoFocus
                />
              </div>

              {authError && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
                  <span className="text-sm text-destructive">{authError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
              >
                Войти
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                Для доступа к админ-панели требуется пароль. Если вы его не знаете, свяжитесь с администратором.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-8 px-4">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Админ-панель</h1>
            <p className="text-muted-foreground mt-1">Управление товарами и остатками</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-muted text-foreground hover:bg-muted/80 transition-colors text-sm font-medium"
          >
            Выйти
          </button>
        </div>

        {/* Status Message */}
        {successMessage && (
          <div className="mb-6 p-4 rounded-lg border border-border bg-card flex items-start gap-3">
            {successMessage.startsWith("✓") ? (
              <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
            ) : (
              <X className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            )}
            <p className="text-sm text-foreground">{successMessage}</p>
          </div>
        )}

        {/* Upload Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Yanino Upload */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-semibold text-foreground mb-4">Остатки Янино</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Загрузите файл с остатками по Янино (м.кв.)
            </p>
            <label className="block cursor-pointer">
              <input
                ref={yaninoFileRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleFileUpload(e.target.files[0], "yanino")
                  }
                }}
                disabled={isProcessing}
                className="hidden"
              />
              <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all cursor-pointer">
                <Upload className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  {isProcessing ? "Загрузка..." : "Выберите файл"}
                </span>
              </div>
            </label>
          </div>

          {/* Zavod Upload */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-semibold text-foreground mb-4">Остатки Завода</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Загрузите файл с остатками по Заводу
            </p>
            <label className="block cursor-pointer">
              <input
                ref={zavodFileRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleFileUpload(e.target.files[0], "zavod")
                  }
                }}
                disabled={isProcessing}
                className="hidden"
              />
              <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all cursor-pointer">
                <Upload className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  {isProcessing ? "Загрузка..." : "Выберите файл"}
                </span>
              </div>
            </label>
          </div>

          {/* Price Upload */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-semibold text-foreground mb-4">Прайс Церсанит</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Загрузите прайс (будет применена скидка 20%)
            </p>
            <label className="block cursor-pointer">
              <input
                ref={priceFileRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleFileUpload(e.target.files[0], "price")
                  }
                }}
                disabled={isProcessing}
                className="hidden"
              />
              <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all cursor-pointer">
                <Upload className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  {isProcessing ? "Загрузка..." : "Выберите файл"}
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Processing Results */}
        {processingResults.length > 0 && (
          <div className="bg-card border border-border rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-foreground mb-4">История обработки</h3>
            <div className="space-y-3">
              {processingResults.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex-1">
                    <p className="font-medium text-foreground">
                      {item.fileType === "yanino"
                        ? "Янино"
                        : item.fileType === "zavod"
                          ? "Завод"
                          : "Прайс"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Обновлено: {item.result.matchedCount} |{" "}
                      {item.result.unmatched.length > 0 && (
                        <>
                          Не найдено: {item.result.unmatched.length}
                          <button
                            onClick={() => {
                              const list = item.result.unmatched.join(", ")
                              alert(`Не найденные артикулы:\n\n${list}`)
                            }}
                            className="ml-1 text-primary hover:underline text-xs"
                          >
                            (посмотреть)
                          </button>
                        </>
                      )}
                    </p>
                  </div>
                  <Check className="h-4 w-4 text-green-600 mt-1 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleSaveUpdates}
            className="flex-1 px-4 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
          >
            Сохранить обновления
          </button>
          <button
            onClick={handleExportData}
            className="flex-1 px-4 py-3 rounded-lg bg-secondary text-secondary-foreground font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <Download className="h-4 w-4" />
            Экспортировать JSON
          </button>
          <button
            onClick={handleResetData}
            className="flex-1 px-4 py-3 rounded-lg bg-destructive/10 text-destructive font-medium hover:bg-destructive/20 transition-colors border border-destructive/20"
          >
            Сбросить данные
          </button>
        </div>

        {/* Stats */}
        <div className="mt-8 pt-8 border-t border-border">
          <h3 className="font-semibold text-foreground mb-4">Статистика</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-1">Всего товаров</p>
              <p className="text-2xl font-bold text-foreground">{products.length}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-1">Обновлено файлов</p>
              <p className="text-2xl font-bold text-foreground">
                {processingResults.length}
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-1">Всего обновлено</p>
              <p className="text-2xl font-bold text-foreground">
                {processingResults.reduce((sum, item) => sum + item.result.matchedCount, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
