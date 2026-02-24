import csv
import json
from pathlib import Path

# Read CSV file
csv_file = Path(__file__).parent / "products.csv"
products = []

with open(csv_file, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for i, row in enumerate(reader):
        # Generate product ID from SKU or row number
        sku = row.get('SKU', '').strip()
        product_id = sku if sku else f"PROD{i+1:03d}"
        
        product = {
            'id': product_id,
            'sku': sku,
            'name': row.get('Назва товару', '').strip(),
            'slug': row.get('Назва товару', '').lower().replace(' ', '-').replace('/', '-'),
            'price_retail': float(row.get('Ціна роздрібна', 0) or 0),
            'price_wholesale': float(row.get('Ціна гуртова', 0) or 0),
            'collection': row.get('Колекція', 'Other').strip(),
            'category': row.get('Категорія', 'Tiles').strip(),
            'type': row.get('Тип', '').strip(),
            'main_image': row.get('Зображення', '').strip(),
            'images': [row.get('Зображення', '').strip()] if row.get('Зображення', '').strip() else [],
            'description': row.get('Опис', '').strip(),
            'stock_yanino': int(row.get('Склад Янино', 0) or 0),
            'stock_factory': int(row.get('Склад завод', 0) or 0),
            'rooms': row.get('Кімнати', '').split(',') if row.get('Кімнати', '') else [],
            'dimensions': row.get('Розміри', '').strip(),
        }
        products.append(product)

print(f"[v0] Total products imported: {len(products)}")
print(f"[v0] Sample product: {products[0] if products else 'No products'}")

# Save to JSON for verification
with open(Path(__file__).parent / 'imported_products.json', 'w', encoding='utf-8') as f:
    json.dump(products, f, ensure_ascii=False, indent=2)

print(f"[v0] Saved {len(products)} products to imported_products.json")
