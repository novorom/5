import csv

# Read CSV
csv_skus = set()
with open('/vercel/share/v0-project/scripts/products.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        sku = row['Артикул'].strip()
        if sku:
            csv_skus.add(sku)

# Read products-data.ts
import re
catalog_ids = set()
with open('/vercel/share/v0-project/lib/products-data.ts', 'r', encoding='utf-8') as f:
    content = f.read()
    ids = re.findall(r'id: "([^"]+)"', content)
    catalog_ids.update(ids)

print(f"CSV products: {len(csv_skus)}")
print(f"Catalog products: {len(catalog_ids)}")
print(f"\nMissing products: {len(csv_skus - catalog_ids)}")
print(f"Duplicates in catalog: {len(catalog_ids) - len(csv_skus)}")

# Show missing SKUs
missing = sorted(csv_skus - catalog_ids)
if missing:
    print(f"\nMissing SKUs ({len(missing)}):")
    for sku in missing:
        print(f"  - {sku}")

# Show extra SKUs
extra = sorted(catalog_ids - csv_skus)
if extra:
    print(f"\nExtra SKUs in catalog ({len(extra)}):")
    for sku in extra:
        print(f"  - {sku}")
