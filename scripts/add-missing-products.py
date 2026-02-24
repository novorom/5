#!/usr/bin/env python3
import csv
import re

# Read CSV file
csv_data = []
with open('scripts/products.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    csv_data = list(reader)

print(f"Total products in CSV: {len(csv_data)}")

# Read products-data.ts
with open('lib/products-data.ts', 'r', encoding='utf-8') as f:
    products_content = f.read()

# Extract all existing IDs
existing_ids = set(re.findall(r'id:\s*"([^"]+)"', products_content))
print(f"Current products in catalog: {len(existing_ids)}")

# Find missing products
missing_products = []
for product in csv_data:
    sku = product.get('Артикул', '').strip()
    if sku and sku not in existing_ids:
        missing_products.append(product)

print(f"Missing products: {len(missing_products)}")
print("\nMissing product SKUs:")
for product in missing_products:
    print(f"  - {product.get('Артикул', 'N/A')}: {product.get('Наименование для сайта', 'N/A')[:50]}")
