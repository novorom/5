import csv
import json
import os

# The script runs from a certain directory, find the CSV using relative paths
# Try to find the CSV file
possible_paths = [
    "scripts/products.csv",
    "../scripts/products.csv",
    "./scripts/products.csv",
    "/home/user/scripts/products.csv",
    "/vercel/share/v0-project/scripts/products.csv",
]

csv_file = None
for path in possible_paths:
    if os.path.exists(path):
        csv_file = path
        break

if not csv_file:
    print(f"[v0] ERROR: Could not find CSV file. Tried: {possible_paths}")
    print(f"[v0] Current directory: {os.getcwd()}")
    print(f"[v0] Files in current directory: {os.listdir('.')[:10]}")
    exit(1)

print(f"[v0] Using CSV file: {csv_file}")

products = []

with open(csv_file, 'r', encoding='utf-8') as f:
    # Use tab separator
    reader = csv.DictReader(f, delimiter='\t')
    row_count = 0
    for i, row in enumerate(reader):
        row_count += 1
        try:
            article = row.get('Артикул', '').strip()
            sku = row.get('Артикул цифровой', '').strip() or article
            name = row.get('Наименование для сайта', '').strip() or row.get('Наименование', '').strip()
            collection = row.get('Коллекция', 'Other').strip()
            color = row.get('Цвет плитки', '').strip()
            format_size = row.get('Формат плитки номинальный', '').strip()
            photo = row.get('Фото плиты', '').strip()
            
            product = {
                'id': article,
                'sku': sku,
                'name': name,
                'slug': name.lower().replace(' ', '-').replace('/', '-').replace(',', '') if name else f"product-{article}",
                'price_retail': 0,
                'price_wholesale': 0,
                'collection': collection,
                'category': 'Tiles',
                'type': row.get('Тип элемента', '').strip(),
                'color': color,
                'format': format_size,
                'main_image': photo,
                'images': [photo] if photo else [],
                'description': name,
            }
            products.append(product)
        except Exception as e:
            print(f"[v0] Error processing row {i}: {e}")

print(f"[v0] CSV rows processed: {row_count}")
print(f"[v0] Total products imported: {len(products)}")
if products:
    print(f"[v0] First 3 products:")
    for p in products[:3]:
        print(f"  - {p['id']}: {p['name']}")

unique_articles = set(p['id'] for p in products)
print(f"[v0] Unique articles: {len(unique_articles)}")

# Save to JSON
output_file = "imported_products.json"
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(products, f, ensure_ascii=False, indent=2)

print(f"[v0] Saved {len(products)} products to {output_file}")
