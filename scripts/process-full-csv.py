import csv
import re
import sys

# Read the CSV from file
csv_content = """Артикул	Артикул цифровой	Наименование	Наименование для сайта	Коллекция	Цвет плитки	Формат плитки номинальный	Тип элемента	Фото плиты
"""

# Read the full_products.csv file
with open('full_products.csv', 'r', encoding='utf-8') as f:
    csv_content = f.read()

# Parse CSV
lines = csv_content.strip().split('\n')
products_from_csv = {}

# Parse header
header = lines[0].split('\t')
article_idx = header.index('Артикул') if 'Артикул' in header else 0

# Parse products
for line in lines[1:]:
    if not line.strip():
        continue
    parts = line.split('\t')
    if len(parts) > article_idx:
        article = parts[article_idx].strip()
        if article:
            products_from_csv[article] = line

print(f"[v0] CSV products: {len(products_from_csv)}")

# Read current products-data.ts
with open('../lib/products-data.ts', 'r', encoding='utf-8') as f:
    products_ts = f.read()

# Extract all current product IDs
current_ids = set(re.findall(r'id: "([^"]+)"', products_ts))
print(f"[v0] Current catalog: {len(current_ids)}")

# Find missing
missing_ids = set(products_from_csv.keys()) - current_ids
print(f"[v0] Missing: {len(missing_ids)}")

# Output missing products info
print("\n=== MISSING PRODUCTS ===")
for i, article_id in enumerate(sorted(missing_ids), 1):
    print(f"{i}. {article_id}")

# Save to file for verification
with open('missing_articles.txt', 'w', encoding='utf-8') as f:
    for article_id in sorted(missing_ids):
        f.write(f"{article_id}\n")

print(f"\n[v0] Saved {len(missing_ids)} missing articles to missing_articles.txt")
