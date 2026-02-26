import fs from 'fs';
import path from 'path';

// Read CSV file
const csvFile = path.join(process.cwd(), 'scripts/full_products.csv');
const csvContent = fs.readFileSync(csvFile, 'utf-8');
const lines = csvContent.split('\n');

// Parse header
const header = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
const m2Index = header.indexOf('М2 в одной коробке');
const piecesIndex = header.indexOf('Количество плиток в коробке');
const nameIndex = header.indexOf('Артикул');

console.log('[v0] Parsing CSV file...');
console.log(`[v0] M2 column index: ${m2Index}`);
console.log(`[v0] Pieces column index: ${piecesIndex}`);

const csvData = new Map();

// Parse data rows
for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;

  // Simple CSV parsing (handle quotes)
  const parts = [];
  let current = '';
  let inQuotes = false;
  
  for (let j = 0; j < line.length; j++) {
    const char = line[j];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      parts.push(current.trim().replace(/"/g, ''));
      current = '';
    } else {
      current += char;
    }
  }
  parts.push(current.trim().replace(/"/g, ''));

  if (parts.length > nameIndex && parts.length > m2Index) {
    const name = parts[nameIndex];
    const m2 = parts[m2Index] ? parseFloat(parts[m2Index]) : 1.5;
    const pieces = parts[piecesIndex] ? parseInt(parts[piecesIndex]) : 1;

    csvData.set(name, { m2, pieces });
  }
}

console.log(`[v0] Loaded ${csvData.size} products from CSV`);

// Log mappings
const sortedData = Array.from(csvData.entries()).slice(0, 10);
sortedData.forEach(([name, data]) => {
  console.log(`[v0] ${name}: ${data.m2} m² (${data.pieces} шт)`);
});
