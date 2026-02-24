#!/usr/bin/env python3
import csv
import re
import json

# Read CSV file
csv_products = {}
with open('/vercel/share/v0-project/scripts/products.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        csv_products[row['Артикул']] = row

# Read existing products-data.ts
with open('/vercel/share/v0-project/lib/products-data.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract existing IDs
existing_ids = re.findall(r'id:\s*"([^"]+)"', content)
print(f"[v0] Existing products in catalog: {len(existing_ids)}")
print(f"[v0] Products in CSV: {len(csv_products)}")

# Find missing IDs
missing_ids = [id for id in csv_products.keys() if id not in existing_ids]
print(f"[v0] Missing products: {len(missing_ids)}")
print(f"[v0] Missing IDs: {missing_ids[:10]}...")  # Show first 10
