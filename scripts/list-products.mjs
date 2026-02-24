import fs from 'fs'
import path from 'path'

// Extract all product IDs from products-data.ts
const productsDataPath = path.join(process.cwd(), 'lib/products-data.ts')
const content = fs.readFileSync(productsDataPath, 'utf-8')

const idMatches = content.match(/id: "([^"]+)"/g) || []
const currentIds = idMatches.map(m => m.match(/"([^"]+)"/)[1])

console.log('Current product count:', currentIds.length)
console.log('Current product IDs:')
currentIds.forEach(id => console.log(id))
