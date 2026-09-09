import csv
import json

with open('counties/county_data.json', 'r', encoding='utf-8') as f:
    county_data = json.load(f)

fips_to_state = {k.zfill(5): v['s'] for k, v in county_data.items()}
state_fips_to_code = {
    '01': 'AL', '02': 'AK', '04': 'AZ', '05': 'AR', '06': 'CA', '08': 'CO', '09': 'CT',
    '10': 'DE', '11': 'DC', '12': 'FL', '13': 'GA', '15': 'HI', '16': 'ID', '17': 'IL',
    '18': 'IN', '19': 'IA', '20': 'KS', '21': 'KY', '22': 'LA', '23': 'ME', '24': 'MD',
    '25': 'MA', '26': 'MI', '27': 'MN', '28': 'MS', '29': 'MO', '30': 'MT', '31': 'NE',
    '32': 'NV', '33': 'NH', '34': 'NJ', '35': 'NM', '36': 'NY', '37': 'NC', '38': 'ND',
    '39': 'OH', '40': 'OK', '41': 'OR', '42': 'PA', '44': 'RI', '45': 'SC', '46': 'SD',
    '47': 'TN', '48': 'TX', '49': 'UT', '50': 'VT', '51': 'VA', '53': 'WA', '54': 'WV',
    '55': 'WI', '56': 'WY'
}

data_by_year = {y: {} for y in [2000, 2004, 2008, 2012, 2016, 2020, 2024]}
raw_by_year = {y: {} for y in [2000, 2004, 2008, 2012, 2016, 2020]}

with open('counties/2000-2020-countypres.csv', 'r', encoding='utf-8', errors='ignore') as f:
    r = csv.reader(f)
    next(r)
    for row in r:
        if len(row) < 10:
            continue
        try:
            year = int(row[0])
            if year not in raw_by_year:
                continue
            raw_fips = str(row[4]).strip().replace('"', '')
            state_po = row[2].strip().replace('"', '').upper()
            county_name = row[3].strip().replace('"', '').upper()
            party = row[7].strip().replace('"', '').upper()
            votes = float(row[8]) if row[8] and row[8] != 'NA' else 0.0
            tot = float(row[9]) if row[9] and row[9] != 'NA' else 0.0
        except Exception:
            continue
        
        key = (state_po, raw_fips, county_name)
        if key not in raw_by_year[year]:
            raw_by_year[year][key] = {'d': 0.0, 'r': 0.0, 'total': tot}
        if party == 'DEMOCRAT':
            raw_by_year[year][key]['d'] += votes
        elif party == 'REPUBLICAN':
            raw_by_year[year][key]['r'] += votes
        raw_by_year[year][key]['total'] = max(raw_by_year[year][key]['total'], tot)

for yr in [2000, 2004, 2008, 2012, 2016, 2020]:
    for (state_po, raw_fips, county_name), rec in raw_by_year[yr].items():
        fips = raw_fips.zfill(5)
        if state_po == 'MO' and (fips == '36000' or fips == '29380' or county_name == 'KANSAS CITY'):
            fips = '29095'
        elif state_po == 'SD' and fips == '46113':
            fips = '46102'
        elif state_po == 'VA' and fips == '51515':
            fips = '51019'
        elif state_po == 'DC' and (fips == '000NA' or raw_fips == 'NA'):
            fips = '11001'
        elif state_po == 'AK' and fips == '02270':
            fips = '02158'

        if fips not in data_by_year[yr]:
            data_by_year[yr][fips] = {'d': 0.0, 'r': 0.0, 'total': 0.0, 'state': state_po}
        data_by_year[yr][fips]['d'] += rec['d']
        data_by_year[yr][fips]['r'] += rec['r']
        data_by_year[yr][fips]['total'] += rec['total']

# Parse 2024
with open('counties/2024_US_County_Level_Presidential_Results.csv', 'r', encoding='utf-8', errors='ignore') as f:
    r = csv.reader(f)
    next(r)
    for row in r:
        if len(row) < 6:
            continue
        fips = str(row[1]).strip().zfill(5)
        votes_gop = float(row[3])
        votes_dem = float(row[4])
        total_votes = float(row[5])
        st_code = fips_to_state.get(fips, state_fips_to_code.get(fips[:2], ''))
        data_by_year[2024][fips] = {
            'd': votes_dem,
            'r': votes_gop,
            'total': total_votes,
            'state': st_code
        }

print('=== Jackson County MO (29095) Historical Summary ===')
for yr in [2000, 2004, 2008, 2012, 2016, 2020, 2024]:
    rec = data_by_year[yr].get('29095', {})
    d = rec.get('d', 0)
    r = rec.get('r', 0)
    tot = rec.get('total', 0)
    if tot > 0:
        pctD = (d / tot) * 100
        pctR = (r / tot) * 100
        margin = pctD - pctR
        print(f'{yr}: Dem={d:,.0f} ({pctD:.2f}%), Rep={r:,.0f} ({pctR:.2f}%), Total={tot:,.0f}, Margin=D+{margin:.2f}%')
