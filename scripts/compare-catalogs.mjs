import fs from 'fs'
import path from 'path'
import csv from 'csv-parse/sync'

async function loadAndCompareCatalogs() {
  try {
    // Read CSV file
    const csvPath = path.join(process.cwd(), 'user_read_only_context/text_attachments/ИМ_2D_заливочный_файл_Cersanit_22_09_2025_2---Лист1-rg5pN.csv')
    const csvContent = fs.readFileSync(csvPath, 'utf-8')
    
    const records = csv.parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      encoding: 'utf-8'
    })

    console.log(`[v0] CSV file has ${records.length} products`)

    // Read current products-data.ts
    const productsPath = path.join(process.cwd(), 'lib/products-data.ts')
    const productsContent = fs.readFileSync(productsPath, 'utf-8')

    // Extract all IDs from products-data.ts
    const idMatches = productsContent.match(/id:\s*"([^"]+)"/g) || []
    const currentIds = new Set(idMatches.map(m => m.match(/"([^"]+)"/)[1]))

    console.log(`[v0] Catalog currently has ${currentIds.size} unique product IDs`)

    // Find missing products
    const missingProducts = records.filter(row => {
      const sku = row['Артикул'] || ''
      return sku && !currentIds.has(sku)
    })

    console.log(`[v0] Missing products: ${missingProducts.length}`)
    console.log('\n[v0] Missing product SKUs:')
    missingProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product['Артикул']} - ${product['Наименование для сайта']}`)
    })

    console.log(`\n[v0] Recommendation: ${missingProducts.length > 0 ? `Need to add ${missingProducts.length} products` : 'All products are loaded'}`)

  } catch (error) {
    console.error('[v0] Error:', error.message)
  }
}

loadAndCompareCatalogs()
