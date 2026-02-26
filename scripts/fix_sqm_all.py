#!/usr/bin/env python3
import csv
import re

# Используем CSV данные, которые пользователь загрузил
# Читаем данные напрямую из текстового файла
csv_data = """Артикул,Артикул 2,Артикул 3,Название по каталогу,Описание,Площадь упаковки,Группа товара,Подгруппа,Код EAN,Код EAN коробки,Бренд,Коллекция,Стиль,Единица продажи,Формат плитки,Формат плитки эквивалент,Формат плитки 2,Ширина см,Длина см,Толщина см,Вес кв метра,Слои (сторон),Вес упак кг,Объем упак м3,Вес шт кг,Кол-во плиток в коробке,Кол-во плиток в коробке,М2 в одной коробке,Площадь плитки м2,Полн площадь м2,Остаток площадь м2,Площадь упакованая,Общая площадь,Кол-во упак в слое,Кол-во слоев,Высота упак,Длина упак,Код ставки НДС,Розница RUB,Опт RUB,Скидка к опту,Остаток,Примечание,Страна,Цвет,Дизайн,Тип,Вид поверхности,Тип глазури,Фактура,Диапазон цветов
A17942,17942,17942,Глаз. керамогранит Bonsai Tree бежевый рельеф ректификат 21,8x89,8,Керамогранит Cersanit Bonsai Tree  бежевый ректификат  рельеф  21,8x89,8 A17942,,Керамогранит,,4690311150103,14690311150100,Cersanit,Bonsai Tree,Современный,м2,21,8x89,8,22x90,22x90,21,8,89,8,0,8,3,53,3,20,60,6,6,1,174,0,23,0,91,0,06,21,36,21,180134,70,44,1,1,2,0,97,1317,1270,80804,0,185,35,0.500,РОССИЯ,бежевый,Дерево,Керамогранит,матовая,глазурированная,рельефная,Тёплые тона"""

# Парсим CSV данные
sqm_map = {}
lines = csv_data.strip().split('\n')

for line in lines[1:]:  # Skip header
    parts = [p.strip() for p in line.split(',')]
    if len(parts) >= 27:
        product_code = parts[0]  # Column 1: Артикул
        sqm_value_str = parts[26]  # Column 27: М2 в одной коробке (0-indexed is 26)
        pieces_str = parts[24]  # Column 25: Кол-во плиток в коробке
        
        if product_code and sqm_value_str:
            try:
                sqm_value = float(sqm_value_str.replace(',', '.'))
                pieces = int(pieces_str) if pieces_str else 6
                sqm_map[product_code] = {'sqm': sqm_value, 'pieces': pieces}
                print(f'[v0] {product_code}: sqm_per_box={sqm_value}, pieces_per_box={pieces}')
            except Exception as e:
                print(f'[v0] Error parsing {product_code}: {e}')

print(f'\n[v0] Total products in CSV: {len(sqm_map)}')

# Читаем products-data.ts
products_file = '/vercel/share/v0-project/lib/products-data.ts'
with open(products_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Обновляем каждый товар
updates = 0
for product_code, data in sqm_map.items():
    sqm = data['sqm']
    pieces = data['pieces']
    
    # Паттерн для поиска товара и добавления sqm_per_box после thickness
    pattern = f'id: "{product_code}",(.*?)thickness: "[^"]*",'
    
    def replace_func(match):
        before = match.group(1)
        thickness_line = match.group(0)
        
        # Проверяем, есть ли уже pieces_per_box и sqm_per_box
        if 'pieces_per_box:' in before:
            # Заменяем существующие значения
            new_before = re.sub(r'pieces_per_box: \d+,', f'pieces_per_box: {pieces},', before)
            new_before = re.sub(r'sqm_per_box: [\d.]+,', f'sqm_per_box: {sqm},', new_before)
            return f'id: "{product_code}",{new_before}thickness: "' + match.group(0).split('thickness: "')[1]
        else:
            # Добавляем новые поля после thickness
            return thickness_line + f'\n    pieces_per_box: {pieces},\n    sqm_per_box: {sqm},'
    
    new_content = re.sub(pattern, replace_func, content, flags=re.DOTALL)
    if new_content != content:
        updates += 1
        content = new_content
        print(f'[v0] Updated {product_code}')

# Сохраняем обновленный файл
with open(products_file, 'w', encoding='utf-8') as f:
    f.write(content)

print(f'[v0] Total updates made: {updates}')
