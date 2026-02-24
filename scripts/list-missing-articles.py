import csv
import re

# Try to find files in current directory
try:
    # Read CSV file
    csv_articles = set()
    with open('products.csv', 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f, delimiter='\t')
        for row in reader:
            article = row.get('Артикул', '').strip()
            if article:
                csv_articles.add(article)

    print(f"[v0] CSV contains {len(csv_articles)} unique articles")

    # Read products-data.ts and extract all IDs
    catalog_ids = set()
    with open('../lib/products-data.ts', 'r', encoding='utf-8') as f:
        content = f.read()
        # Find all id: "XXXXX" patterns
        matches = re.findall(r'id: "([^"]+)"', content)
        catalog_ids = set(matches)

    print(f"[v0] Catalog contains {len(catalog_ids)} products")

    # Find missing articles
    missing = csv_articles - catalog_ids
    print(f"\n[v0] Missing articles: {len(missing)}")
    print("\n=== MISSING PRODUCTS ===")
    for i, article in enumerate(sorted(missing), 1):
        print(f"{i}. {article}")

    print(f"\n[v0] Total missing: {len(missing)}")
    
except FileNotFoundError as e:
    print(f"[v0] ERROR: {e}")
    print(f"[v0] Please check file paths")
