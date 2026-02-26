import csv

# Read CSV and extract sqm_per_box data
products_map = {}

# Use absolute path
csv_path = '/vercel/share/v0-project/scripts/full_products.csv'

with open(csv_path, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f, delimiter=',')
    for row in reader:
        if row:
            # Get product code and sqm value
            product_code = row.get('Артикул', '').strip()
            sqm_value = row.get('М2 в одной коробке', '').strip()
            
            if product_code and sqm_value and sqm_value != '':
                try:
                    sqm_float = float(sqm_value.replace(',', '.'))
                    products_map[product_code] = sqm_float
                    print(f"{product_code}: {sqm_float}")
                except ValueError as e:
                    print(f"Skipping {product_code} - invalid value: {sqm_value} ({e})")

print(f"\nTotal products parsed: {len(products_map)}")
