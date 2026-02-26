#!/usr/bin/env python3
import csv
import json
import os

# Read CSV file 
csv_file = 'scripts/full_products.csv'
sqm_map = {}

print("[v0] Reading CSV file from:", csv_file)

with open(csv_file, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for idx, row in enumerate(reader, 1):
        if row:
            product_code = row.get('Артикул', '').strip()
            sqm_value_str = row.get('М2 в одной коробке', '').strip()
            
            if product_code:
                try:
                    sqm_value = float(sqm_value_str.replace(',', '.')) if sqm_value_str else 1.5
                    sqm_map[product_code] = sqm_value
                    if idx <= 20 or idx % 50 == 0:
                        print(f'  {product_code}: {sqm_value}')
                except:
                    sqm_map[product_code] = 1.5

print(f"\n[v0] Total products mapped: {len(sqm_map)}")
print("\nExample exports:")
for code, sqm in sorted(list(sqm_map.items())[:10]):
    print(f'  "{code}": {sqm},')
