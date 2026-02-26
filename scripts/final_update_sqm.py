#!/usr/bin/env python3
import csv

# Read CSV from read-only location and create mapping
csv_file = 'user_read_only_context/text_attachments/full_products-ApEFP.csv'

sqm_map = {}

with open(csv_file, 'r', encoding='utf-8') as f:
    reader = csv.reader(f)
    header = next(reader)
    
    for row in reader:
        if len(row) >= 27:
            product_code = row[1].strip()
            sqm_value_str = row[26].strip()
            
            if product_code:
                try:
                    sqm_value = float(sqm_value_str) if sqm_value_str else 0.5
                except:
                    sqm_value = 0.5
                sqm_map[product_code] = sqm_value

# Read products-data.ts
products_data_file = '/vercel/share/v0-project/lib/products-data.ts'

with open(products_data_file, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Update lines
updated_lines = []
i = 0
while i < len(lines):
    line = lines[i]
    
    # Check if this line has an id
    if 'id: "' in line:
        # Extract product code
        start = line.find('id: "') + 5
        end = line.find('"', start)
        if start > 4 and end > start:
            product_code = line[start:end]
            
            if product_code in sqm_map:
                sqm_value = sqm_map[product_code]
                
                # Look ahead for sqm_per_box line
                found_sqm = False
                for j in range(i+1, min(i+20, len(lines))):
                    if 'sqm_per_box:' in lines[j]:
                        # Update this line
                        updated_lines.append(line)
                        i += 1
                        while i < j:
                            updated_lines.append(lines[i])
                            i += 1
                        # Update sqm line
                        indent = lines[j][:lines[j].find('sqm_per_box:')]
                        updated_lines.append(f'{indent}sqm_per_box: {sqm_value},\n')
                        i += 1
                        found_sqm = True
                        break
                    elif 'pieces_per_box:' in lines[j]:
                        # Will add sqm_per_box after this
                        break
                
                if not found_sqm:
                    # Look for pieces_per_box and add sqm_per_box after it
                    for j in range(i+1, min(i+20, len(lines))):
                        if 'pieces_per_box:' in lines[j]:
                            updated_lines.append(line)
                            i += 1
                            while i <= j:
                                updated_lines.append(lines[i])
                                if i == j:
                                    indent = lines[j][:lines[j].find('pieces_per_box:')]
                                    updated_lines.append(f'{indent}sqm_per_box: {sqm_value},\n')
                                i += 1
                            found_sqm = True
                            break
                    
                    if not found_sqm:
                        updated_lines.append(line)
                        i += 1
            else:
                updated_lines.append(line)
                i += 1
        else:
            updated_lines.append(line)
            i += 1
    else:
        updated_lines.append(line)
        i += 1

# Write updated content
with open(products_data_file, 'w', encoding='utf-8') as f:
    f.writelines(updated_lines)

print(f"[v0] Updated products with sqm_per_box values from CSV")
print(f"[v0] Total products: {len(sqm_map)}")
