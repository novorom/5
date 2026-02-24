import csv
import json
import re

# Read full_products.csv
csv_products = {}
with open('full_products.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        article = row.get('Артикул', '').strip()
        if article:
            csv_products[article] = row

# Read products-data.ts and extract all existing IDs
catalog_ids = set()
with open('../lib/products-data.ts', 'r', encoding='utf-8') as f:
    content = f.read()
    matches = re.findall(r'id: "([^"]+)"', content)
    catalog_ids = set(matches)

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
with open('missing_products.ts', 'w', encoding='utf-8') as f:
    f.write(',\n'.join(ts_output))

print(f"[v0] Generated TypeScript snippets for {len(missing)} products")
print("[v0] Saved to missing_products.ts")

# Also save missing articles list
print("\n[v0] Missing articles:")
for i, article in enumerate(missing, 1):
    print(f"{i}. {article}")
