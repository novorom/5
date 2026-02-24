import xlsx from 'xlsx';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

// --- Parse the xlsx ---
const xlsxPath = path.join(root, 'ИМ_2D_заливочный_файл_Cersanit_22_09_2025_2.xlsx');
const workbook = xlsx.readFile(xlsxPath);
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const rows = xlsx.utils.sheet_to_json(sheet, { defval: '' });

console.log(`\n=== XLSX ===`);
console.log(`Sheet: "${sheetName}"`);
console.log(`Total rows: ${rows.length}`);

// Print column headers
if (rows.length > 0) {
  console.log(`\nColumns: ${Object.keys(rows[0]).join(' | ')}`);
  console.log(`\nFirst row sample:`);
  console.log(rows[0]);
}

// Try to identify the ID/SKU column
const firstRow = rows[0] || {};
const keys = Object.keys(firstRow);
console.log(`\n--- All column names ---`);
keys.forEach((k, i) => console.log(`  [${i}] "${k}"`));

// Look for columns that might be the product ID
const idCandidates = keys.filter(k =>
  /артикул|sku|код|id|article/i.test(k)
);
console.log(`\nID candidate columns: ${idCandidates.join(', ')}`);

// Print first 5 rows for these columns
console.log(`\nSample values for ID candidates:`);
rows.slice(0, 5).forEach((row, i) => {
  const vals = idCandidates.map(k => `${k}: "${row[k]}"`).join(' | ');
  console.log(`  Row ${i + 1}: ${vals}`);
});

// --- Parse products-data.ts IDs ---
const tsFile = readFileSync(path.join(root, 'lib/products-data.ts'), 'utf8');
const tsIdMatches = [...tsFile.matchAll(/^\s+id:\s+"([^"]+)"/gm)];
const tsIds = tsIdMatches.map(m => m[1]);
console.log(`\n=== products-data.ts ===`);
console.log(`Total products in TS file: ${tsIds.length}`);
console.log(`Unique IDs: ${new Set(tsIds).size}`);

// Find duplicates in TS file
const tsDupes = tsIds.filter((id, i) => tsIds.indexOf(id) !== i);
if (tsDupes.length > 0) {
  console.log(`\nDuplicate IDs in TS file: ${tsDupes.join(', ')}`);
} else {
  console.log(`No duplicates in TS file.`);
}
