#!/usr/bin/env python3
import csv

# Parse CSV and create mapping
sqm_map = {}

# CSV data inline
csv_data = """Код BSU,Артикул,Артикул цифровой,Наименование,Наименование для сайта,Версия,Тип элемента,Штрихкод штука,Штрихкод коробка,Штрихкод паллет,Бренд,Коллекция,Стиль коллекции,Базовая единица измерения,Формат плиты номинальный,Формат плиты округленный,Формат коллекции округленный,Ширина плитки (см),Длина плитки (см),Толщина плитки (см),Вес одной плитки (кг),Количество слоев в паллете,Количество коробов в слое паллеты,Количество коробов на паллете,Количество изделий в коробке,Количество плиток в коробке,М2 в одной коробке
LS4O096,A-LS4O096\J,10075,"Ступень Lofthouse серый 29,7x59,8","Ступень Cersanit Lofthouse  серый  29,7x59,8 LS4O096",,Ступень,4690311079954,4690311079947,,Cersanit,Lofthouse,Современный,шт.,"29,7x59,8",30x60,30x60,"29,7","59,8","0,75","3,41",,,,6,6,,0.500
LS4O526,A-LS4O526\J,10077,"Ступень Lofthouse светло-серый 29,7x59,8","Ступень Cersanit Lofthouse  светло-серый  29,7x59,8 LS4O526",,Ступень,4690311079992,4690311079985,,Cersanit,Lofthouse,Современный,шт.,"29,7x59,8",30x60,30x60,"29,7","59,8","0,75","3,47",,,,6,6,,0.500
LS5A096,A-LS5A096\J,10078,"Плинтус Lofthouse серый 7x59,8","Плинтус Cersanit Lofthouse  серый  7x59,8 LS5A096",,Плинтус,4690311078940,4690311078933,,Cersanit,Lofthouse,Современный,шт.,"7x59,8",7x60,30x60,7,"59,8",1,"0,85",,,,18,18,,0.500"""

reader = csv.DictReader(csv_data.strip().split('\n'))
for row in reader:
    product_code = row.get('Артикул', '').strip()
    sqm_value_str = row.get('М2 в одной коробке', '').strip()
    
    if product_code and sqm_value_str:
        try:
            sqm_value = float(sqm_value_str.replace(',', '.'))
            sqm_map[product_code] = sqm_value
            print(f'  {product_code}: {sqm_value}')
        except:
            pass

print(f"\nTotal: {len(sqm_map)}")

# Read products-data.ts
with open('/vercel/share/v0-project/lib/products-data.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Update sqm_per_box values
updates = 0
for product_code, sqm_value in sqm_map.items():
    # Find pattern: id: "XXXXX" ... sqm_per_box: XXX
    old_pattern = f'id: "{product_code}"'
    if old_pattern in content:
        # Replace undefined with correct value
        old_val = f'sqm_per_box: undefined,'
        new_val = f'sqm_per_box: {sqm_value},'
        if old_val in content and product_code in content:
            # More precise replacement
            import re
            pattern = f'(id: "{product_code}".*?)sqm_per_box: undefined,'
            replacement = f'\\1sqm_per_box: {sqm_value},'
            new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)
            if new_content != content:
                updates += 1
                content = new_content
                print(f"Updated {product_code}")

# Write back
with open('/vercel/share/v0-project/lib/products-data.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print(f"\nTotal updated: {updates}")
