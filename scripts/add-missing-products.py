import csv
import re
import json
import glob
import os

# Find CSV file - search in current dir and subdirs
csv_file = None
for pattern in ['products.csv', '*/products.csv', '../scripts/products.csv']:
    matches = glob.glob(pattern)
    if matches:
        csv_file = matches[0]
        break

if not csv_file:
    print("[v0] ERROR: Cannot find products.csv")
    print(f"[v0] Current directory: {os.getcwd()}")
    print(f"[v0] Files: {os.listdir('.')[:10]}")
    exit(1)

print(f"[v0] Found CSV at: {csv_file}")

# Read CSV file
csv_articles = {}
with open(csv_file, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f, delimiter='\t')
    for row in reader:
        article = row.get('Артикул', '').strip()
        if article:
            csv_articles[article] = row

print(f"[v0] CSV contains {len(csv_articles)} unique articles")

# Find products-data.ts
products_file = None
for pattern in ['../lib/products-data.ts', '../../lib/products-data.ts', 'lib/products-data.ts']:
    if os.path.exists(pattern):
        products_file = pattern
        break

if not products_file:
    print("[v0] ERROR: Cannot find products-data.ts")
    exit(1)

# Read products-data.ts and extract all IDs
catalog_ids = set()
with open(products_file, 'r', encoding='utf-8') as f:
    content = f.read()
    matches = re.findall(r'id: "([^"]+)"', content)
    catalog_ids = set(matches)

print(f"[v0] Catalog contains {len(catalog_ids)} products")

# Find missing articles
missing_articles = set(csv_articles.keys()) - catalog_ids
print(f"[v0] Missing articles: {len(missing_articles)}")

# Generate TypeScript objects for missing products
missing_products = []
for article in sorted(missing_articles):
    row = csv_articles[article]
    
    # Generate product name
    name = row.get('Наименование для сайта', '').strip() or row.get('Наименование', '').strip()
    collection = row.get('Коллекция', 'Other').strip()
    color = row.get('Цвет плитки', '').strip()
    format_size = row.get('Формат плитки номинальный', '').strip()
    
    # Create slug from name
    slug = name.lower().replace(' ', '-').replace('/', '-').replace(',', '').replace('–', '-')[:60]
    
    product_obj = {
        'id': article,
        'sku': article,
        'name': name,
        'slug': slug,
        'collection': collection,
        'category': 'Tiles',
        'price_retail': 0,
        'image': row.get('Фото плиты', '').strip(),
    }
    missing_products.append(product_obj)

# Output as JSON for verification
with open('missing_products.json', 'w', encoding='utf-8') as f:
    json.dump(missing_products, f, ensure_ascii=False, indent=2)

print(f"[v0] Generated {len(missing_products)} missing products")
print("\n=== MISSING PRODUCTS ===")
for i, p in enumerate(missing_products, 1):
    print(f"{i}. {p['id']} - {p['name'][:50]}")

print(f"\n[v0] Saved to missing_products.json")
