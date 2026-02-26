#!/usr/bin/env python3
import re

# Read the products file
with open('/vercel/share/v0-project/lib/products-data.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Find all products that don't have sqm_per_box and add it with default value 1.5
# Pattern: Find "thickness: "..." followed by price_retail without sqm_per_box in between

pattern = r'(thickness: "[^"]+",)\n(\s+)(price_retail:)'
replacement = r'\1\n\2pieces_per_box: 8,\n\2sqm_per_box: 1.5,\n\2\3'

content = re.sub(pattern, replacement, content)

# Write the updated content back
with open('/vercel/share/v0-project/lib/products-data.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("[v0] Updated all products with default sqm_per_box: 1.5")
