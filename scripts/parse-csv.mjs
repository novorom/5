import fs from 'fs';
import path from 'path';
import csv from 'csv-parse/sync';

const csvFile = path.join(process.cwd(), 'scripts/full_products.csv');
const csvContent = fs.readFileSync(csvFile, 'utf-8');

// Parse CSV with headers
const records = csv.parse(csvContent, {
  columns: true,
  delimiter: ',',
  quote: '"',
  escape: '"',
});

// Extract required data
const products = records.map((record) => {
  const m2PerBox = parseFloat(record['М2 в одной коробке']) || 1.5;
  const piecesPerBox = parseInt(record['Количество плиток в коробке']) || 1;
  const articleNumber = record['Артикул цифровой'];
  const name = record['Наименование для сайта'];

  return {
    articleNumber,
    name,
    m2PerBox,
    piecesPerBox,
  };
});

// Generate TypeScript code
console.log('// Auto-generated from CSV');
products.forEach((p) => {
  console.log(`// ${p.articleNumber} - ${p.name}: ${p.m2PerBox} м² в коробке`);
});

console.log('\n// Update commands for products-data.ts:');
products.forEach((p) => {
  console.log(`// sqm_per_box: ${p.m2PerBox}, pieces_per_box: ${p.piecesPerBox}`);
});
