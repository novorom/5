#!/usr/bin/env python3
import csv
import json
import re
from pathlib import Path

# Read the CSV file
csv_file = Path(__file__).parent / 'products.csv'
print(f"[v0] Reading CSV from: {csv_file}")

csv_data = []
with open(csv_file, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f, delimiter=';')
    csv_data = list(reader)

print(f"[v0] Found {len(csv_data)} products in CSV")

# Read current products
products_file = Path(__file__).parent.parent / 'lib' / 'products-data.ts'
with open(products_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Extract all existing IDs
existing_ids = re.findall(r'id:\s*"([^"]+)"', content)
existing_ids_set = set(existing_ids)
print(f"[v0] Found {len(existing_ids_set)} unique product IDs in catalog")

# Find missing products
missing_products = []
for row in csv_data:
    product_id = row.get('Код', '').strip()
    if product_id and product_id not in existing_ids_set:
        missing_products.append(row)

print(f"[v0] Found {len(missing_products)} missing products")
print("\nMissing product IDs:")
for prod in missing_products[:10]:
    print(f"  - {prod.get('Код', 'N/A')}: {prod.get('Наименование', 'N/A')}")
if len(missing_products) > 10:
    print(f"  ... and {len(missing_products) - 10} more")
