#!/usr/bin/env python3
import csv
import re

# Читаем CSV файл, который пользователь загрузил
csv_content = """Артикул,Артикул 2,Артикул 3,Наименование,Наименование для сайта,Версия,Тип элемента,Штрихкод штука,Штрихкод коробка,Штрихкод паллет,Бренд,Коллекция,Стиль коллекции,Базовая единица измерения,Формат плиты номинальный,Формат плиты округленный,Формат коллекции округленный,Ширина плитки (см),Длина плитки (см),Толщина плитки (см),Вес одной плитки (кг),Количество слоев в паллете,Количество коробов в слое паллеты,Количество коробов на паллете,Количество изделий в коробке,Количество плиток в коробке,М2 в одной коробке,Ширина коробки (м),Длина коробки (м),Высота коробки (м),Вес коробки брутто (кг),Вес коробки нетто (кг),м2/шт на паллете,Ширина паллеты (м),Длина паллеты (м),Высота паллеты (м),Вес паллеты брутто (кг),Вес паллеты нетто (кг),Короб пустой брутто (кг),Поддон пустой брутто (кг),Вес полиэтилена (кг),Страна происхождения,Цвет плитки,Дизайн,Материал,Вид поверхности,Поверхность,Фактура поверхности,Ректификат,Рельеф,Водопоглащение,Морозостойкость,Класс износостойкости,Класс устойчивости к скольжению,Количество фрагментов рисунка,Назначение,Применение,Помещения,Фото плиты,Фото Коллекции,Кол-во доп фото коллекции,Доп фото коллекции,Видео 360,
A17942,17942,17942,Глаз. керамогранит Bonsai Tree бежевый рельеф ректификат 21,8x89,8,Керамогранит Cersanit Bonsai Tree бежевый ректификат рельеф 21,8x89,8 A17942,,Керамогранит,,4690311150103,14690311150100,Cersanit,Bonsai Tree,Современный,м2,21,8x89,8,22x90,22x90,21,8,89,8,0,8,3,53,3,20,60,6,6,1,174,0,23,0,91,0,06,21,36,21,180134,70,44,1,1,2,0,97,1317,1270,80804,0,185,35,0.500,РОССИЯ,бежевый,Дерево,Керамогранит,матовая,глазурированная,рельефная,,,"E<0,5%",Да,,R11,5,Пол,Для внутренней и внешней отделки,Внутренняя отделка;,https://pvi.cersanit.ru/upload/uf/b47/k5vcxzgjn1j9nzf22zuw6icj150cfm9s/17942_1.jpg,,,,"""

sqm_map = {}

# Parse CSV
lines = csv_content.strip().split('\n')
for line in lines[1:]:  # Skip header
    if line.strip():
        parts = [p.strip() for p in line.split(',')]
        if len(parts) >= 27:
            art = parts[0]
            sqm_str = parts[26]
            pieces_str = parts[25]
            
            if art and sqm_str:
                try:
                    sqm = float(sqm_str.replace(',', '.'))
                    pieces = int(pieces_str) if pieces_str and pieces_str.isdigit() else 6
                    sqm_map[art] = {'sqm': sqm, 'pieces': pieces}
                    print(f'[v0] {art}: sqm={sqm}, pieces={pieces}')
                except:
                    pass

print(f'[v0] Total: {len(sqm_map)} products\n')

# Update products-data.ts
pf = '/vercel/share/v0-project/lib/products-data.ts'
with open(pf, 'r', encoding='utf-8') as f:
    content = f.read()

updated = 0

for art, data in sqm_map.items():
    sqm = data['sqm']
    pieces = data['pieces']
    
    # Update existing sqm_per_box
    if f'id: "{art}"' in content:
        old_pattern = f'(id: "{art}".*?)sqm_per_box: [\d.]+'
        new_content = re.sub(old_pattern, f'\\1sqm_per_box: {sqm}', content, count=1, flags=re.DOTALL)
        
        if new_content == content:
            # Add new sqm_per_box if not exists
            pattern = f'(id: "{art}".*?pieces_per_box: \d+,)'
            new_content = re.sub(pattern, f'\\1\n    sqm_per_box: {sqm},', content, count=1, flags=re.DOTALL)
        
        if new_content != content:
            content = new_content
            updated += 1
            print(f'[v0] Updated {art}')

with open(pf, 'w', encoding='utf-8') as f:
    f.write(content)

print(f'[v0] Done: {updated} products updated')
