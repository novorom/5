#!/usr/bin/env python3
import csv
import re

# Use absolute paths
csv_file = '/vercel/share/v0-project/scripts/full_products_update.csv'
products_data_file = '/vercel/share/v0-project/lib/products-data.ts'

sqm_map = {}

print(f"[v0] Reading CSV from: {csv_file}")
print(f"[v0] Updating: {products_data_file}")

with open(csv_file, 'r', encoding='utf-8') as f:
    reader = csv.reader(f)
    header = next(reader)  # Skip header
    
    for row in reader:
        if len(row) >= 27:
            product_code = row[1].strip()  # Column 2: Артикул
            sqm_value_str = row[26].strip()  # Column 27: М2 в одной коробке
            
            if product_code and sqm_value_str:
                try:
                    sqm_value = float(sqm_value_str.replace(',', '.'))
                    sqm_map[product_code] = sqm_value
                    print(f'  {product_code}: {sqm_value}')
                except:
                    sqm_map[product_code] = 1.5
                    print(f'  {product_code}: 1.5 (conversion error)')

print(f"\n[v0] Total products mapped: {len(sqm_map)}\n")

# Now read products-data.ts and update sqm_per_box values
with open(products_data_file, 'r', encoding='utf-8') as f:
    content = f.read()

# For each product in our map, update its sqm_per_box value
updates = 0
for product_code, sqm_value in sqm_map.items():
    # Pattern to find products and update their sqm_per_box
    pattern = f'id: "{product_code}",(.*?)sqm_per_box: [0-9.]+'
    replacement = f'id: "{product_code}",\\1sqm_per_box: {sqm_value}'
    
    new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)
    if new_content != content:
        updates += 1
        content = new_content
    else:
        # If product doesn't have sqm_per_box, add it after pieces_per_box
        pattern = f'id: "{product_code}",(.*?)pieces_per_box: ([0-9]+),'
        match = re.search(pattern, content, flags=re.DOTALL)
        if match:
            # Add sqm_per_box after pieces_per_box
            insert_pattern = f'id: "{product_code}",\\1pieces_per_box: \\2,\n    sqm_per_box: {sqm_value},'
            new_content = re.sub(pattern, insert_pattern, content, flags=re.DOTALL)
            if new_content != content:
                updates += 1
                content = new_content

# Write updated content
with open(products_data_file, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"[v0] Updated {updates} products with correct sqm_per_box values")
