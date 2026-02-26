import csv
import json

# Read CSV and extract product data
products_map = {}

with open('/vercel/share/v0-project/scripts/full_products.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f, delimiter=',')
    for row in reader:
        if row:
            # Get product code and sqm value
            product_code = row.get('Артикул', '').strip()
            sqm_value = row.get('М2 в одной коробке', '').strip()
            
            if product_code and sqm_value:
                try:
                    sqm_float = float(sqm_value.replace(',', '.'))
                    products_map[product_code] = sqm_float
                except ValueError:
                    products_map[product_code] = None

# Output the mapping
print(json.dumps(products_map, indent=2, ensure_ascii=False))
