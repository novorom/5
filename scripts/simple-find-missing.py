import csv
import re
import glob
import os

# Find full_products.csv
csv_file = None
for pattern in ['full_products.csv', '*/full_products.csv', '../*/full_products.csv']:
    matches = glob.glob(pattern)
    if matches:
        csv_file = matches[0]
        print(f"[v0] Found CSV at: {csv_file}")
        break

if not csv_file:
    print(f"[v0] ERROR: Could not find full_products.csv")
    print(f"[v0] Current dir: {os.getcwd()}")
    print(f"[v0] Contents: {os.listdir('.')[:10]}")
    exit(1)

# Find products-data.ts
products_file = None
for pattern in ['products-data.ts', '../lib/products-data.ts', '../../lib/products-data.ts', '*/lib/products-data.ts']:
    matches = glob.glob(pattern)
    if matches:
        products_file = matches[0]
        print(f"[v0] Found products-data at: {products_file}")
        break

if not products_file:
    print(f"[v0] ERROR: Could not find products-data.ts")
    exit(1)

# Read full_products.csv
csv_articles = {}
try:
    with open(csv_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f, delimiter=',')
        for row in reader:
            if row:
                article = row.get('Артикул', '').strip()
                name = row.get('Наименование для сайта', '').strip()
                if article:
                    csv_articles[article] = name
except Exception as e:
    print(f"[v0] Error reading CSV: {e}")
    exit(1)

print(f"[v0] CSV contains {len(csv_articles)} unique articles")

# Read products-data.ts
catalog_ids = {}
try:
    with open(products_file, 'r', encoding='utf-8') as f:
        content = f.read()
        id_pattern = r'id: "([^"]+)"'
        matches = re.findall(id_pattern, content)
        for match in matches:
            catalog_ids[match] = True
except Exception as e:
    print(f"[v0] Error reading products-data.ts: {e}")
    exit(1)

print(f"[v0] Catalog contains {len(catalog_ids)} products")

# Find missing articles
missing = set(csv_articles.keys()) - set(catalog_ids.keys())
print(f"[v0] Missing articles: {len(missing)}")

if missing:
    print("\n=== MISSING PRODUCTS ===")
    for i, article in enumerate(sorted(missing), 1):
        print(f"{i}. {article}: {csv_articles[article][:50]}")
else:
    print("[v0] All products are in catalog!")
