import csv

csv_file = 'scripts/full_products.csv'
output_file = '/tmp/sqm_mapping.json'

# Parse CSV and create mapping
sqm_map = {}

try:
    with open(csv_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f, delimiter=',')
        for row in reader:
            if row:
                product_code = row.get('Артикул', '').strip()
                sqm_value = row.get('М2 в одной коробке', '').strip()
                
                if product_code and sqm_value and sqm_value != '':
                    try:
                        sqm_float = float(sqm_value.replace(',', '.'))
                        sqm_map[product_code] = sqm_float
                        print(f'"{product_code}": {sqm_float},')
                    except ValueError:
                        pass
                        
    print(f'\n// Total products: {len(sqm_map)}')
except Exception as e:
    print(f'Error: {e}')
