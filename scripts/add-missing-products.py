import csv
import re
import json

# Read CSV file
csv_articles = {}
with open('products.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f, delimiter='\t')
    for row in reader:
        article = row.get('Артикул', '').strip()
        if article:
            csv_articles[article] = row

print(f"[v0] CSV contains {len(csv_articles)} unique articles")

# Read products-data.ts and extract all IDs
catalog_ids = set()
with open('../lib/products-data.ts', 'r', encoding='utf-8') as f:
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
