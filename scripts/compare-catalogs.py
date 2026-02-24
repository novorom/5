import csv
import json
import os

# Read CSV file
csv_path = 'user_read_only_context/text_attachments/ИМ_2D_заливочный_файл_Cersanit_22_09_2025_2---Лист1-rg5pN.csv'
products_path = 'lib/products-data.ts'

# Parse CSV
csv_products = {}
with open(csv_path, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        if row and row.get('ID'):
            csv_products[row['ID'].strip()] = row

print(f"[v0] CSV file contains {len(csv_products)} products")

# Parse products-data.ts to extract existing IDs
existing_ids = set()
with open(products_path, 'r', encoding='utf-8') as f:
    content = f.read()
    import re
    matches = re.findall(r'id:\s*"([^"]+)"', content)
    existing_ids = set(matches)

print(f"[v0] Products-data.ts contains {len(existing_ids)} products")

# Find missing products
missing_ids = set(csv_products.keys()) - existing_ids
print(f"[v0] Missing products: {len(missing_ids)}")

if missing_ids:
    print("\n[v0] Missing product IDs:")
    for pid in sorted(missing_ids)[:20]:
        print(f"  - {pid}: {csv_products[pid].get('Название', 'N/A')}")
    if len(missing_ids) > 20:
        print(f"  ... and {len(missing_ids) - 20} more")
