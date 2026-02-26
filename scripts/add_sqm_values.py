#!/usr/bin/env python3
# This script directly updates products-data.ts with sqm_per_box values

sqm_values = {
    "LS4O096": 0.500,
    "LS4O526": 0.500,
    "LS5A096": 0.760,
    "LS5A526": 0.760,
    "LS6O096": 0.690,
    "LS6O526": 0.690,
    "RS2L451": 0.170,
    "WS4O116": 0.500,
    "WS4O156": 0.500,
    "WS4O526": 0.500,
    "WS5A116": 0.760,
    "WS5A156": 0.760,
    "WS5A526": 0.760,
    "WS6O116": 0.900,
    "NW4M012": 0.990,
    "DE2L381": 1.080,
    "DEL232": 1.250,
    "KT2L051": 1.080,
    "KTL051": 1.250,
    "KTL052": 1.250,
}

import re

file_path = '/vercel/share/v0-project/lib/products-data.ts'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

updates = 0
for product_id, sqm_value in sqm_values.items():
    # Pattern to find and update sqm_per_box if it exists
    pattern = f'(id: "{product_id}",[^}}]*?)(sqm_per_box: )([0-9.]+)(,)'
    replacement = f'\\1\\2{sqm_value}\\4'
    new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)
    
    if new_content != content:
        print(f"Updated {product_id}: {sqm_value}")
        updates += 1
        content = new_content
    else:
        # If sqm_per_box doesn't exist, add it after pieces_per_box
        pattern = f'(id: "{product_id}",[^}}]*?pieces_per_box: )([0-9]+)(,)'
        match = re.search(pattern, content, flags=re.DOTALL)
        if match:
            replacement = f'\\1\\2,\n    sqm_per_box: {sqm_value}\\3'
            new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)
            if new_content != content:
                print(f"Added {product_id}: {sqm_value}")
                updates += 1
                content = new_content

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"\n[v0] Updated {updates} products with sqm_per_box values")
