import csv
import re

# Read CSV file
csv_artickles = set()
with open('/vercel/share/v0-project/scripts/products.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        if row.get('Артикул'):
            csv_artickles.add(row['Артикул'].strip())

print(f"Товаров в CSV: {len(csv_artickles)}")
print(f"Первые 10 артикулов: {sorted(list(csv_artickles))[:10]}")

# Read products-data.ts
catalog_ids = set()
with open('/vercel/share/v0-project/lib/products-data.ts', 'r', encoding='utf-8') as f:
    content = f.read()
    # Find all id: "..." patterns
    matches = re.findall(r'id: "([^"]+)"', content)
    catalog_ids = set(matches)

print(f"\nТоваров в каталоге: {len(catalog_ids)}")
print(f"Первые 10 ID: {sorted(list(catalog_ids))[:10]}")

# Find missing
missing_from_catalog = csv_artickles - catalog_ids
print(f"\nНе хватает в каталоге: {len(missing_from_catalog)}")
print(f"Недостающие артикулы: {sorted(list(missing_from_catalog))}")

# Check duplicates in CSV
from collections import Counter
csv_data = []
with open('/vercel/share/v0-project/scripts/products.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        if row.get('Артикул'):
            csv_data.append(row['Артикул'].strip())

duplicates = [item for item, count in Counter(csv_data).items() if count > 1]
print(f"\nДубли в CSV: {len(duplicates)}")
if duplicates:
    print(f"Дублирующиеся артикулы: {duplicates}")
