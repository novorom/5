import csv
import re

# Read full_products.csv
csv_articles = {}
try:
    with open('full_products.csv', 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f, delimiter=',')
        for row in reader:
            if row:
                # Column name is "Артикул"
                article = row.get('Артикул', '').strip()
                name = row.get('Наименование для сайта', '').strip()
                if article:
                    csv_articles[article] = name
except Exception as e:
    print(f"Error reading CSV: {e}")
    exit(1)

print(f"[v0] CSV contains {len(csv_articles)} unique articles")

# Read products-data.ts
catalog_ids = {}
try:
    with open('../lib/products-data.ts', 'r', encoding='utf-8') as f:
        content = f.read()
        # Find all id: "XXXXX" with corresponding name
        id_pattern = r'id: "([^"]+)"'
        matches = re.findall(id_pattern, content)
        for match in matches:
            catalog_ids[match] = True
except Exception as e:
    print(f"Error reading products-data.ts: {e}")
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
