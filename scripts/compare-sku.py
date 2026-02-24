import csv
import re

# Read CSV and extract all product SKUs
csv_file = '/vercel/share/v0-project/scripts/products.csv'
csv_skus = set()

with open(csv_file, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        if row and row.get('Артикул'):
            sku = row['Артикул'].strip()
            csv_skus.add(sku)

# Read products-data.ts and extract all product IDs
products_file = '/vercel/share/v0-project/lib/products-data.ts'
catalog_ids = set()

with open(products_file, 'r', encoding='utf-8') as f:
    content = f.read()
    # Find all id: "XXXX" patterns
    matches = re.findall(r'id: "([^"]+)"', content)
    catalog_ids = set(matches)

print(f"CSV артикулы: {len(csv_skus)}")
print(f"Каталог товары: {len(catalog_ids)}")
print()

# Find differences
missing_in_catalog = csv_skus - catalog_ids
extra_in_catalog = catalog_ids - csv_skus

print(f"Отсутствует в каталоге: {len(missing_in_catalog)}")
if missing_in_catalog:
    print("Недостающие артикулы:")
    for sku in sorted(missing_in_catalog):
        print(f"  - {sku}")

print()
print(f"Лишние в каталоге: {len(extra_in_catalog)}")
if extra_in_catalog:
    print("Лишние артикулы:")
    for sku in sorted(extra_in_catalog):
        print(f"  - {sku}")
