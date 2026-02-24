import { products } from '../lib/products-data.ts'

const uniqueCollections = [...new Set(products.map(p => p.collection))].sort()

console.log(`Found ${uniqueCollections.length} unique collections:`)
uniqueCollections.forEach(collection => {
  const count = products.filter(p => p.collection === collection).length
  console.log(`  "${collection}": ${count} products`)
})

console.log('\nCollections array for filter-options.ts:')
console.log(JSON.stringify(uniqueCollections, null, 2))
