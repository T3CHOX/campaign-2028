"""Cache official ACS table definitions and county rows from the public summary files.

Only public downloads are used. County-subdivision rows for Connecticut permit
aggregation back to the map's historical counties without cloning populations.
Run with the bundled Python runtime or Python 3.10+; no third-party dependency.
"""
import argparse
import csv
import io
import json
import pathlib
import re
import urllib.request
from concurrent.futures import ThreadPoolExecutor

ROOT = pathlib.Path(__file__).resolve().parents[1]
CACHE = ROOT / 'data' / 'census' / '2023'
TABLES = ['B03002', 'B02015', 'B02016', 'B05003', 'B05003H', 'B05003I',
          'B01001', 'B01002', 'B15003', 'B19013', 'B17001', 'B23025', 'C24030', 'B25064', 'B25077', 'B03001']

def fetch(table):
    target = CACHE / (table + '.csv')
    meta_path = CACHE / (table + '.metadata.json')
    if target.exists() and meta_path.exists():
        return table + ': cached'
    metadata_url = f'https://api.census.gov/data/2023/acs/acs5/groups/{table}.json'
    with urllib.request.urlopen(metadata_url, timeout=60) as response:
        meta = json.load(response)
    assert any(k.startswith(table + '_') for k in meta.get('variables', {})), table
    data_url = f'https://www2.census.gov/programs-surveys/acs/summary_file/2023/table-based-SF/data/5YRData/acsdt5y2023-{table.lower()}.dat'
    rows = []
    with urllib.request.urlopen(data_url, timeout=90) as response:
        reader = csv.reader(io.TextIOWrapper(response, encoding='utf-8-sig'), delimiter='|')
        header = next(reader)
        assert header[0] == 'GEO_ID' and table + '_E001' in header, header[:4]
        for row in reader:
            if not row:
                continue
            geo = row[0]
            # Files are ordered by summary level. End after subdivisions, avoiding
            # the far larger tract/block-group section of the nationwide file.
            if geo[:3].isdigit() and int(geo[:3]) > 60:
                break
            if geo.startswith('0500000US') and not geo[9:].startswith('72') or geo.startswith('0600000US09'):
                rows.append(row[:len(header)])
    counties = sum(row[0].startswith('050') for row in rows)
    assert counties > 3100, (table, counties)
    with target.open('w', newline='', encoding='utf-8') as out:
        writer = csv.writer(out)
        writer.writerow(header)
        writer.writerows(rows)
    meta_path.write_text(json.dumps({'table': table, 'vintage': '2019-2023 ACS five-year',
        'dataUrl': data_url, 'metadataUrl': metadata_url, 'countyCount': counties,
        'variables': {k: v['label'] for k, v in meta['variables'].items() if re.match(table + r'_\d+[EM]$', k)}}, indent=2), encoding='utf-8')
    return f'{table}: {counties} counties, {len(rows)-counties} Connecticut subdivisions'

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--tables', nargs='*', default=TABLES)
    args = parser.parse_args()
    CACHE.mkdir(parents=True, exist_ok=True)
    with ThreadPoolExecutor(max_workers=3) as pool:
        for result in pool.map(fetch, args.tables):
            print(result, flush=True)
