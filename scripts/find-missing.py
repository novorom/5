import csv
import re
import os

# Find CSV file with flexible path detection
csv_paths = [
    "scripts/products.csv",
    "../scripts/products.csv", 
    "./scripts/products.csv",
]

csv_file = None
for path in csv_paths:
    if os.path.exists(path):
        csv_file = path
        break

if not csv_file:
    print("[v0] ERROR: Cannot find CSV file")
    exit(1)

print(f"[v0] Reading CSV from: {csv_file}")

# Read all SKUs from CSV
csv_skus = set()
with open(csv_file, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f, delimiter='\t')
    for row in reader:
        sku = row.get('Артикул', '').strip()
        if sku:
            csv_skus.add(sku)

print(f"[v0] Total SKUs in CSV: {len(csv_skus)}")
print(f"[v0] First 5 CSV SKUs: {list(csv_skus)[:5]}")

# Read all IDs from products-data.ts
catalog_ids = set()
with open("../lib/products-data.ts", 'r', encoding='utf-8') as f:
    content = f.read()
    # Find all id: "..." patterns
    matches = re.findall(r'id:\s*"([^"]+)"', content)
    catalog_ids.update(matches)

print(f"[v0] Total IDs in catalog: {len(catalog_ids)}")
print(f"[v0] First 5 catalog IDs: {list(catalog_ids)[:5]}")

# Find missing SKUs
missing_skus = csv_skus - catalog_ids
print(f"\n[v0] MISSING PRODUCTS: {len(missing_skus)}")
print(f"[v0] Missing SKUs:")
for sku in sorted(missing_skus):
    print(f"  - {sku}")

# Find duplicates in catalog (if any)
all_ids = re.findall(r'id:\s*"([^"]+)"', content)
duplicates = [id for id in set(all_ids) if all_ids.count(id) > 1]
if duplicates:
    print(f"\n[v0] DUPLICATES in catalog: {len(duplicates)}")
    for dup in duplicates:
        print(f"  - {dup} (appears {all_ids.count(dup)} times)")
else:
    print(f"\n[v0] No duplicates found in catalog")

# Summary
print(f"\n[v0] SUMMARY:")
print(f"  CSV products: {len(csv_skus)}")
print(f"  Catalog products: {len(catalog_ids)}")
print(f"  Missing: {len(missing_skus)}")
print(f"  Difference: {len(csv_skus) - len(catalog_ids)}")
