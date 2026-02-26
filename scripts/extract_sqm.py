import csv

# Read CSV and create a map of sqm_per_box values by article
csv_data = {}
with open('/vercel/share/v0-project/scripts/full_products.csv', 'r', encoding='utf-8') as f:
    lines = f.readlines()
    header = lines[0].strip().split(',')
    
    # Find column indices
    article_idx = None
    sqm_idx = None
    for i, col in enumerate(header):
        if 'Артикул' in col and article_idx is None:
            article_idx = i
        if 'М2 в одной' in col:
            sqm_idx = i
    
    print(f"[v0] Article index: {article_idx}, SQM index: {sqm_idx}")
    print(f"[v0] Headers count: {len(header)}")
    
    # Parse remaining lines
    for line_num, line in enumerate(lines[1:], 2):
        parts = line.strip().split(',')
        if len(parts) > max(article_idx, sqm_idx) if article_idx and sqm_idx else False:
            article = parts[article_idx].strip() if article_idx else None
            sqm = parts[sqm_idx].strip() if sqm_idx else None
            
            if article and sqm and sqm != '':
                try:
                    sqm_float = float(sqm.replace(',', '.'))
                    csv_data[article] = sqm_float
                    print(f"{article}: {sqm_float} м²")
                except:
                    pass

print(f"\nTotal entries: {len(csv_data)}")
