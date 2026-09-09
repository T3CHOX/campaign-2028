"""Build the simulator's versioned demographics from cached official ACS tables.

Usage: python scripts/build-demographics.py --hispanic-csv PATH
The supplied B03001 export is authoritative for direct county matches. Census
subdivision counts reconstruct Connecticut's eight historical map counties.
"""
import argparse
import copy
import csv
import hashlib
import gzip
import json
import math
import pathlib
import re
import openpyxl

ROOT = pathlib.Path(__file__).resolve().parents[1]
CACHE = ROOT / 'data/census/2023'
CT = ROOT / 'data/census/ct_cou_to_cousub_crosswalk.txt'
OUT = ROOT / 'counties'
MEDIANS = {'B01002', 'B19013', 'B25064', 'B25077'}

def number(value):
    try:
        result = float(value)
        return result if math.isfinite(result) and result >= 0 else None
    except (TypeError, ValueError):
        return None

def load_tables():
    cross = [r for r in csv.DictReader(CT.open(encoding='utf-8-sig'), delimiter='|') if r.get('OLD_COUSUB_GEOID') and r.get('NEW_COUSUB_GEOID')]
    town_to_old = {r['NEW_COUSUB_GEOID']: r['OLD_COUSUB_GEOID'][:5] for r in cross if r['COUSUBFP'] != '00000'}
    towns = {r['OLD_COUSUB_GEOID'][:5]: [] for r in cross}
    for r in cross:
        if r['COUSUBFP'] != '00000':
            towns[r['OLD_COUSUB_GEOID'][:5]].append(r['COUSUB_NAMELSAD'].removesuffix(' town'))
    tables = {}
    for path in sorted(CACHE.glob('*.csv')):
        if path.stem.endswith('-supplied'):
            continue
        table = path.stem
        rows = list(csv.DictReader(path.open(encoding='utf-8')))
        bygeo = {r['GEO_ID'][9:]: {k: number(v) for k, v in r.items() if k != 'GEO_ID'} for r in rows}
        result = {geo: row for geo, row in bygeo.items() if len(geo) == 5 and not geo.startswith('09')}
        # Count estimates add. MOEs use the ACS approximate square-sum method;
        # covariance is unavailable. Medians cannot be summed or averaged.
        for old in towns:
            pieces = [bygeo[g] for g, target in town_to_old.items() if target == old and g in bygeo]
            keys = pieces[0].keys() if pieces else []
            result[old] = {}
            for key in keys:
                vals = [piece.get(key) for piece in pieces]
                result[old][key] = (None if table in MEDIANS or any(v is None for v in vals)
                    else math.sqrt(sum(v*v for v in vals)) if '_M' in key else sum(vals))
        tables[table] = result
    return tables, towns

def build(supplied):
    tables, towns = load_tables()
    source = list(csv.DictReader(pathlib.Path(supplied).open(encoding='utf-8-sig')))
    verified = 0
    verified_values = 0
    for row in source:
        geo = row['GEO_ID']
        if not geo.startswith('0500000US') or len(geo) != 14 or geo[9:11] == '72':
            continue
        fips = geo[9:]
        if fips.startswith('09'):
            continue
        cached = tables['B03001'].get(fips)
        converted = {re.sub(r'_(\d+)([EM])$', lambda m: '_' + m[2] + m[1], key): number(value)
                     for key, value in row.items() if key and key.startswith('B03001_')}
        assert cached is not None and converted['B03001_E001'] == cached['B03001_E001'], fips
        assert converted['B03001_E003'] == cached['B03001_E003'], fips
        for column, value in converted.items():
            if column in cached:
                assert value == cached[column], (fips, column, value, cached[column])
                verified_values += 1
        tables['B03001'][fips] = converted
        verified += 1
    assert verified > 3000, 'Expected a nationwide county export'
    # Preserve the supplied export in the reproducible source directory.
    (CACHE / 'B03001-supplied.csv').write_bytes(pathlib.Path(supplied).read_bytes())

    def val(table, fips, idx, default=None, kind='E'):
        value = tables.get(table, {}).get(fips, {}).get(f'{table}_{kind}{idx:03d}')
        return default if value is None else value

    def total(table, fips, indices):
        values = [val(table, fips, index) for index in indices]
        return sum(values) if all(value is not None for value in values) else None

    def ratio(n, d):
        return round(100*n/d, 5) if n is not None and d else None

    raw = json.loads((OUT / 'county_data.json').read_text(encoding='utf-8'))
    workbook = openpyxl.load_workbook(OUT / 'us_county_data.xlsx', read_only=True, data_only=True)
    legacy = {str(int(r[3])).zfill(5): r for r in list(workbook.active.values)[1:] if r[3] is not None}
    workbook.close()
    names = {str(r['GEO_ID'])[9:]: r['NAME'] for r in source if str(r.get('GEO_ID', '')).startswith('0500000US')}
    for fips, row in legacy.items():
        names.setdefault(fips, row[2] + ', ' + row[0])
    # The map contains Chugach/Copper River as well as historic Valdez-Cordova.
    # Use current 2023 Census equivalents and remove obsolete duplicate records.
    data = {}
    missing = []
    for fips in tables['B03002']:
        if fips in raw and not fips.startswith(('02', '09')):
            county = copy.deepcopy(raw[fips])
        elif fips in legacy:
            row = legacy[fips]
            votes = row[7] or 1
            county = {'n': row[2], 's': row[1], 'p': row[8], 'v': {'D': 100*row[4]/votes, 'R': 100*row[5]/votes, 'G': 50*row[6]/votes, 'L': 50*row[6]/votes, 'O': 0, 'F': 0}, 'ig': {'rural': (row[9] or 0)*100}, 't': 'Suburban/Mixed'}
            county['baselineVoteTotals'] = {'total': votes, 'D': row[4], 'R': row[5], 'source': 'Legacy county workbook; historical cycle average, not a verified 2024 county result'}
        elif fips.startswith('02'):
            # New census areas have no matching county election record. Use only
            # an explicitly labeled statewide scenario prior, not district votes.
            county = {'n': names.get(fips, fips).split(',')[0], 's': 'AK', 'v': {'D': 43, 'R': 54, 'G': 1.5, 'L': 1.5, 'O': 0, 'F': 0}, 'ig': {'rural': 80}, 't': 'Rural/Small Town', 'baselineNote': 'Modeled statewide prior; borough election baseline unavailable'}
            missing.append({'fips': fips, 'field': 'countyElectionBaseline', 'fallback': 'modeled Alaska prior'})
        else:
            state_rows = [r for key,r in raw.items() if key[:2] == fips[:2]]
            assert state_rows and fips in names, fips
            state_pop = sum(r['p'] for r in state_rows)
            prior = {party:sum(r['p']*r['v'].get(party,0) for r in state_rows)/state_pop for party in ['D','R','G','L','O','F']}
            county = {'n':names[fips].split(',')[0],'s':state_rows[0]['s'],'v':prior,'ig':{'rural':50},'t':'Suburban/Mixed','baselineNote':'Modeled statewide prior; county electoral baseline unavailable'}
            missing.append({'fips':fips,'field':'countyElectionBaseline','fallback':'modeled statewide prior'})
        pop = val('B03002', fips, 1, 0)
        county['p'] = int(pop)
        county['n'] = names.get(fips, county['n']).split(',')[0]
        county['fips'] = fips
        county['geographyVersion'] = 2
        county['ig'] = county.get('ig', {})
        # All these fields use a mutually exclusive non-Hispanic race definition.
        for key, index in {'white': 3, 'black': 4, 'native': 5, 'asian': 6, 'pacific': 7, 'other_race': 8, 'multiracial': 9, 'hispanic': 12}.items():
            county['ig'][key] = ratio(val('B03002', fips, index, 0), pop) or 0
        row = legacy.get(fips)
        if row:
            for key, index in {'progressive': 16, 'maga': 17, 'libertarian': 18, 'centrist': 19, 'evangelical': 20, 'protestant': 21, 'catholic': 22, 'christian': 23, 'jewish': 24, 'muslim': 25, 'other_religion': 26, 'secular': 27, 'union': 28}.items():
                county['ig'][key] = round((row[index] or 0)*100, 5)
        adults = total('B01001', fips, list(range(7,26))+list(range(31,50)))
        # Exclude female subtotal (26) and include male 18+ cells 7..25.
        county['ig']['youth'] = ratio(total('B01001', fips, [7,8,9,10,31,32,33,34]), adults) or 0
        county['ig']['age25_44'] = ratio(total('B01001', fips, list(range(11,15))+list(range(35,39))), adults) or 0
        county['ig']['age45_64'] = ratio(total('B01001', fips, list(range(15,20))+list(range(39,44))), adults) or 0
        county['ig']['seniors'] = ratio(total('B01001', fips, list(range(20,26))+list(range(44,50))), adults) or 0
        county['ig']['women'] = ratio(total('B01001', fips, list(range(31,50))), adults) or 0
        college = ratio(total('B15003', fips, [22,23,24,25]), val('B15003', fips, 1))
        county['ig']['college'] = college or 0
        county['ig']['noncollege'] = 100-(college or 0)
        cvap = total('B05003', fips, [9,11,20,22])
        cvap_h = total('B05003I', fips, [9,11,20,22])
        cvap_w = total('B05003H', fips, [9,11,20,22])
        demo = {'vintage': '2019–2023 ACS 5-year', 'population': pop, 'cvap': cvap, 'cvapHispanic': cvap_h,
                'cvapWhiteNonHispanic': cvap_w, 'origins': {}, 'originMoE': {},
                'method': 'Resident origin counts are observed. Subgroup citizen voting-age shares are modeled proportionally within measured parent totals. Registration is a separate calibrated game pool.',
                'legacyMemberships': 'Religion, political affiliation and union memberships are legacy scenario estimates with unverified source provenance; not Census measurements.',
                'geography': '2023 counties; Connecticut counts reconstructed from constituent towns' if fips.startswith('09') else '2023 Census county-equivalent'}
        # Hispanic leaves exclude aggregate subtotal rows 8, 16, 27.
        hleaves = [4,5,6,7]+list(range(9,16))+list(range(17,27))+list(range(28,32))
        for table, parent, indices in [('B03001','hispanic',hleaves), ('B02015','asian',list(range(2,35))), ('B02016','pacific',list(range(2,18)))]:
            meta = json.loads((CACHE / (table + '.metadata.json')).read_text())
            indices = [i for i in indices if f'{table}_{i:03d}E' in meta['variables']]
            parent_count = val(table, fips, 3 if table == 'B03001' else 1, 0)
            leaves = {f'{parent}_{i:03d}': val(table, fips, i, 0) for i in indices}
            # Assert published leaves partition their source universe.
            if abs(sum(leaves.values())-parent_count) > 2:
                raise ValueError((fips,table,'unreconciled leaves',sum(leaves.values()),parent_count))
            for gid, count in leaves.items():
                demo['origins'][gid] = count
                demo['originMoE'][gid] = val(table,fips,int(gid[-3:]),kind='M')
                county['ig'][gid] = round(count/parent_count*county['ig'][parent], 7) if parent_count else 0
            if parent != 'hispanic':
                demo['method'] += f' {parent.title()} origins are scaled from the race-alone table into the non-Hispanic parent, assuming the same within-parent mix.'
        county['demographics'] = demo
        industries = {'farming, forestry and fishing': [4,31], 'mining and extraction': [5,32], 'construction': [6,33], 'manufacturing': [7,34], 'retail': [9,36], 'transportation and utilities': [10,37], 'information': [13,40], 'finance and real estate': [14,41], 'professional and administrative services': [17,44], 'education and healthcare': [21,48], 'arts, hospitality and food services': [24,51], 'public administration': [28,55]}
        employed = val('C24030',fips,1,0)
        sector_shares = {k: ratio(total('C24030',fips,ix),employed) or 0 for k,ix in industries.items()}
        leaders = sorted(sector_shares, key=sector_shares.get, reverse=True)[:3]
        poverty = ratio(val('B17001',fips,2),val('B17001',fips,1))
        unemployment = ratio(val('B23025',fips,5),val('B23025',fips,3))
        income = val('B19013',fips,1)
        age = val('B01002',fips,1)
        county['context'] = {'medianIncome':income,'povertyPct':poverty,'unemploymentPct':unemployment,'medianAge':age,'collegePct':college,'medianRent':val('B25064',fips,1),'medianHomeValue':val('B25077',fips,1),'industryShares':sector_shares}
        for key, value in {'farmers':sector_shares['farming, forestry and fishing'],'tech':sector_shares['information'],'bluecollar':sum(sector_shares[k] for k in ['construction','manufacturing','transportation and utilities','mining and extraction'])}.items():
            county['ig'][key] = value
        rural = county['ig'].get('rural',0)
        county['t'] = 'Highly Urban' if rural < 10 else 'Urban/Dense Suburban' if rural < 25 else 'Suburban/Mixed' if rural < 55 else 'Rural/Small Town' if rural < 85 else 'Very Rural'
        place = county['n']+', '+county['s']
        summary = f"{place} is a {county['t'].lower()} area whose employed residents work prominently in {leaders[0]} and {leaders[1]}."
        sentences = [summary, f"The 2019–2023 ACS estimates {pop:,.0f} residents" + (f" and {cvap:,.0f} citizens aged 18 or older." if cvap is not None else '.')]
        if fips in towns:
            sentences.append('Communities include '+', '.join(towns[fips][:5])+'. Counts are reconstructed from towns; county medians are omitted because town medians cannot be added.')
        sentences.append('The three largest listed employment sectors account for '+', '.join(f'{sector_shares[k]:.1f}% in {k}' for k in leaders)+'. These measure residents’ industries, not the location of their workplace.')
        if income is not None:
            sentences.append(f'Median household income is ${income:,.0f} in 2023 inflation-adjusted dollars.')
        if poverty is not None and college is not None:
            sentences.append(f'An estimated {poverty:.1f}% of the poverty-status universe is below the poverty line, while {college:.1f}% of adults 25 and older hold at least a bachelor’s degree.')
        if age is not None:
            sentences.append(f'The median resident age is {age:g}.')
        margin = county['v']['R']-county['v']['D']
        lean = 'closely divided' if abs(margin)<5 else ('Republican-leaning' if margin>0 else 'Democratic-leaning')
        sentences.append(f'The imported electoral scenario baseline is {lean}. This is a party-support summary, not a measurement of every resident’s ideology; economic and social preferences can differ within the county.')
        county['profile'] = {'summary':summary,'text':' '.join(sentences),'status':'Generated from validated structured Census facts; electoral interpretation is a modeled scenario baseline.',
            'sources':[{'title':'ACS 2019–2023 county tables and methodology','url':'https://www.census.gov/programs-surveys/acs/data/summary-file.html'}, {'title':'Resident employment by industry (C24030)','url':'https://api.census.gov/data/2023/acs/acs5/groups/C24030.html'}]}
        data[fips] = county
    # Derive origin labels from the actual versioned table metadata.
    groups = []
    for table,parent,ids in [('B03001','hispanic',[4,5,6,7]+list(range(9,16))+list(range(17,27))+list(range(28,32))),('B02015','asian',range(2,35)),('B02016','pacific',range(2,18))]:
        meta=json.loads((CACHE/(table+'.metadata.json')).read_text())
        for i in ids:
            label=meta['variables'].get(f'{table}_{i:03d}E')
            if label:
                groups.append({'id':f'{parent}_{i:03d}','parentId':parent,'name':label.split('!!')[-1].rstrip(':'),'sourceTable':table,'sourceVariable':f'{table}_{i:03d}E'})
    payload={'schemaVersion':2,'sourceVintage':'2019–2023 ACS five-year','groups':groups,'counties':data}
    encoded=json.dumps(payload,separators=(',',':'),ensure_ascii=False).encode('utf-8')
    (OUT/'demographics.v2.json').write_bytes(encoded)
    (OUT/'demographics.v2.json.gz').write_bytes(gzip.compress(encoded,mtime=0))
    report={'counties':len(data),'subgroups':len(groups),'suppliedRowsVerified':verified,'suppliedValuesVerified':verified_values,'suppliedSHA256':hashlib.sha256(pathlib.Path(supplied).read_bytes()).hexdigest(),
            'connecticutCounties':len([k for k in data if k.startswith('09')]),'connecticutPopulation':sum(c['p'] for k,c in data.items() if k.startswith('09')),
            'totalPopulation':sum(c['p'] for c in data.values()),'missing':missing,
            'limits':['ACS estimates are 2019–2023, not a 2028 population forecast.','Detailed-origin CVAP, registration and issue opinions are modeled, not observed.','Legacy religion, union and political group estimates have unverified provenance.','Connecticut medians omitted; count MOEs use square-sum approximation.','Alaska borough electoral priors use the historical workbook where available; district-coded 2024 rows are not borough results.']}
    (ROOT/'data/census/import-report.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
    print(json.dumps(report,indent=2))

if __name__=='__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('--hispanic-csv',default=str(CACHE/'B03001-supplied.csv'))
    build(parser.parse_args().hispanic_csv)
