import csv
import json
import re
import glob
import os

# Find full_products.csv using glob
csv_file = None
for pattern in ['full_products.csv', '*/full_products.csv', '../*/full_products.csv']:
    matches = glob.glob(pattern)
    if matches:
        csv_file = matches[0]
        break

if not csv_file:
    print(f"[v0] ERROR: Cannot find full_products.csv")
    print(f"[v0] Current dir: {os.getcwd()}")
    exit(1)

print(f"[v0] Using CSV: {csv_file}")

# Find products-data.ts
products_file = None
for pattern in ['products-data.ts', '../lib/products-data.ts', '../../lib/products-data.ts', '*/lib/products-data.ts']:
    if os.path.exists(pattern):
        products_file = pattern
        break

if not products_file:
    print(f"[v0] ERROR: Cannot find products-data.ts")
    exit(1)

print(f"[v0] Using products file: {products_file}")

# Read full_products.csv
csv_products = {}
try:
    with open(csv_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f, delimiter='\t')
        for row in reader:
            article = row.get('Артикул', '').strip()
            if article:
                csv_products[article] = row
except Exception as e:
    print(f"[v0] Error reading CSV: {e}")
    exit(1)

# Read products-data.ts and extract all existing IDs
catalog_ids = set()
try:
    with open(products_file, 'r', encoding='utf-8') as f:
        content = f.read()
        matches = re.findall(r'id: "([^"]+)"', content)
        catalog_ids = set(matches)
except Exception as e:
    print(f"[v0] Error reading products-data.ts: {e}")
    exit(1)

# Find missing articles
missing = sorted(set(csv_products.keys()) - catalog_ids)

print(f"[v0] Total products in CSV: {len(csv_products)}")
print(f"[v0] Products in catalog: {len(catalog_ids)}")
print(f"[v0] Missing products: {len(missing)}")

# Generate TypeScript for missing products
ts_output = []
for article in missing:
    row = csv_products[article]
    name = row.get('Наименование для сайта', '').strip()
    collection = row.get('Коллекция', 'Other').strip()
    color = row.get('Цвет плитки', '').strip()
    image = row.get('Фото плиты', '').strip()
    
    slug = name.lower().replace(' ', '-').replace('/', '-').replace(',', '')[:60]
    
    ts_obj = f'''  {{
    id: "{article}",
    sku: "{article}",
    name: "{name}",
    slug: "{slug}",
    collection: "{collection}",
    category: "Tiles",
    price_retail: 0,
    color: "{color}",
    main_image: "{image}",
    images: ["{image}"],
    description: "{name}",
  }},'''
    ts_output.append(ts_obj)

# Save to file
output_file = 'missing_products.ts'
with open(output_file, 'w', encoding='utf-8') as f:
    f.write(',\n'.join(ts_output))

print(f"[v0] Generated TypeScript snippets for {len(missing)} products")
print(f"[v0] Saved to {output_file}")

# Also save missing articles list
print("\n[v0] Missing articles:")
for i, article in enumerate(missing, 1):
    print(f"{i}. {article}")
