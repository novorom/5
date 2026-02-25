import { read, utils } from "xlsx"
import type { Product } from "./products-data"

export interface ExcelProcessResult {
  updatedProducts: Product[]
  unmatched: string[]
  matchedCount: number
}

export interface YaninoRow {
  артикул?: string
  article?: string
  "свободный остаток м.кв."?: number | string
  "free m2"?: number | string
}

export interface ZavodRow {
  артикул?: string
  article?: string
  "свободный остаток"?: number | string
  "free stock"?: number | string
}

export interface PriceRow {
  артикул?: string
  article?: string
  "розничная цена"?: number | string
  "retail price"?: number | string
}

function normalizeArticle(article: string | number | undefined): string {
  if (!article) return ""
  return String(article)
    .trim()
    .toUpperCase()
    .replace(/[\\\/]/g, "")
}

function parseNumber(value: string | number | undefined): number {
  if (value === undefined || value === null || value === "") return 0
  const num = typeof value === "string" ? parseFloat(value) : value
  return isNaN(num) ? 0 : num
}

export function processYaninoFile(
  buffer: ArrayBuffer,
  products: Product[]
): ExcelProcessResult {
  const workbook = read(new Uint8Array(buffer))
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  
  // First try by column names
  let rows = utils.sheet_to_json<YaninoRow>(sheet)
  
  // If no data found by column names, try by column indices (A=0, K=10)
  if (rows.length === 0) {
    const arrayData = utils.sheet_to_json<any[]>(sheet, { header: 1 })
    rows = arrayData
      .map((row: any[]) => ({
        артикул: row[0],  // Column A (index 0) = SKU
        "свободный остаток м.кв.": row[10], // Column K (index 10) = Free stock m²
      }))
      .filter((row) => row.артикул) // Filter out empty rows
  }

  console.log(`[v0] Янино: Найдено строк в файле: ${rows.length}`)
  
  const updatedProducts = [...products]
  const unmatched: string[] = []
  let matchedCount = 0

  rows.forEach((row) => {
    const article = row.артикул || row.article
    const stock = parseNumber(row["свободный остаток м.кв."] || row["free m2"])

    if (!article) return

    const normalizedArticle = normalizeArticle(article)
    const productIndex = updatedProducts.findIndex(
      (p) => normalizeArticle(p.id) === normalizedArticle
    )

    if (productIndex !== -1) {
      updatedProducts[productIndex].stock_yanino = stock
      matchedCount++
      console.log(`[v0] Совпадение: ${normalizedArticle} -> stock: ${stock}`)
    } else {
      unmatched.push(String(article))
    }
  })

  console.log(`[v0] Янино: Совпадено ${matchedCount} из ${rows.length} товаров`)
  console.log(`[v0] Янино: Не найдено: ${unmatched.length} товаров`)
  
  return { updatedProducts, unmatched, matchedCount }
}

export function processZavodFile(
  buffer: ArrayBuffer,
  products: Product[]
): ExcelProcessResult {
  const workbook = read(new Uint8Array(buffer))
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  const rows = utils.sheet_to_json<ZavodRow>(sheet)

  const updatedProducts = [...products]
  const unmatched: string[] = []
  let matchedCount = 0

  rows.forEach((row) => {
    const article = row.артикул || row.article
    const stock = parseNumber(row["свободный остаток"] || row["free stock"])

    if (!article) return

    const normalizedArticle = normalizeArticle(article)
    const productIndex = updatedProducts.findIndex(
      (p) => normalizeArticle(p.id) === normalizedArticle
    )

    if (productIndex !== -1) {
      updatedProducts[productIndex].stock_factory = stock
      matchedCount++
    } else {
      unmatched.push(String(article))
    }
  })

  return { updatedProducts, unmatched, matchedCount }
}

export function processPriceFile(
  buffer: ArrayBuffer,
  products: Product[]
): ExcelProcessResult {
  const workbook = read(new Uint8Array(buffer))
  
  // Find the Церсанит sheet - look for sheet name containing Церсанит, Cersanit, or use first sheet
  let sheet = workbook.Sheets[workbook.SheetNames[0]]
  
  const cersanitSheetName = workbook.SheetNames.find(
    (name) => name.toLowerCase().includes("церсанит") || 
              name.toLowerCase().includes("cersanit") ||
              name.toLowerCase().includes("cersanite")
  )
  
  if (cersanitSheetName) {
    sheet = workbook.Sheets[cersanitSheetName]
  }

  const rows = utils.sheet_to_json<PriceRow>(sheet)

  const updatedProducts = [...products]
  const unmatched: string[] = []
  let matchedCount = 0

  rows.forEach((row) => {
    const article = row.артикул || row.article
    const retailPrice = parseNumber(row["розничная цена"] || row["retail price"])

    if (!article || !retailPrice) return

    const normalizedArticle = normalizeArticle(article)
    const productIndex = updatedProducts.findIndex(
      (p) => normalizeArticle(p.id) === normalizedArticle
    )

    if (productIndex !== -1) {
      // Apply 20% discount (multiply by 0.8)
      updatedProducts[productIndex].price_retail = Math.round(retailPrice * 0.8)
      matchedCount++
    } else {
      unmatched.push(String(article))
    }
  })

  return { updatedProducts, unmatched, matchedCount }
}
