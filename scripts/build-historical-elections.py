"""Build unified 2000-2024 analysis returns without double-counting modes."""
import csv, json
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "counties" / "countypres_2000-2024.csv"
CT_LEGACY_SOURCE = ROOT / "counties" / "2000-2020-countypres.csv"
CT_MODERN_SOURCE = ROOT / "counties" / "countypres_2012-2024.csv"
ALASKA_MARGIN_SOURCE = ROOT / "data" / "official-election-results" / "alaska-historical-borough-margins.csv"
OUTPUT = ROOT / "counties" / "historical_elections.json"
YEARS = (2000, 2004, 2008, 2012, 2016, 2020, 2024)
PARTY_CODES = {"DEMOCRAT":"D","REPUBLICAN":"R","GREEN":"G","LIBERTARIAN":"L","OTHER":"I","":"I"}
PARTY_LABELS = {"D":"Democratic","R":"Republican","G":"Green","L":"Libertarian","I":"Independent / Other","PSL":"PSL"}
EXCLUDED = {"TOTAL VOTES CAST","UNDERVOTES","OVERVOTES","SPOILED"}
CANDIDATE_META = {
 "AL GORE":("Al Gore","TN","images/historical/gore.jpg"),
 "GEORGE W. BUSH":("George W. Bush","TX","images/historical/bush.jpg"),
 "RALPH NADER":("Ralph Nader","CT","images/historical/nader.jpg"),
 "JOHN KERRY":("John Kerry","MA","images/historical/kerry.jpg"),
 "BARACK OBAMA":("Barack Obama","IL","images/historical/obama.jpg"),
 "JOHN MCCAIN":("John McCain","AZ","images/historical/mccain.jpg"),
 "MITT ROMNEY":("Mitt Romney","MA","images/historical/romney.jpg"),
 "HILLARY CLINTON":("Hillary Clinton","NY","images/historical/clinton.jpg"),
 "DONALD TRUMP":("Donald Trump","NY","images/trump.jpg"),
 "DONALD J TRUMP":("Donald Trump","FL","images/trump.jpg"),
 "JOSEPH R BIDEN JR":("Joe Biden","DE","images/historical/biden.jpg"),
 "JO JORGENSEN":("Jo Jorgensen","SC","images/historical/jorgensen.jpg"),
 "KAMALA D HARRIS":("Kamala Harris","CA","images/harris.jpg"),
 "CHASE OLIVER":("Chase Oliver","GA","images/historical/oliver.jpg"),
 "OTHER":("Other candidates","Various","images/scenario.jpg")
}
CANDIDATE_REGISTRY = {}
SPLIT_RULES = {
 "NE":{"default":"NE-3","map":{"31023":"NE-1","31025":"NE-1","31037":"NE-1","31039":"NE-1","31053":"NE-1","31109":"NE-1","31119":"NE-1","31141":"NE-1","31159":"NE-1","31167":"NE-1","31055":"NE-2","31155":"NE-2"},"split":{"31153":[("NE-2",.389),("NE-1",.611)],"31143":[("NE-1",.49455715),("NE-3",.50544285)]}},
 "ME":{"default":"ME-2","map":{"23031":"ME-1","23005":"ME-1","23023":"ME-1","23015":"ME-1","23013":"ME-1"},"split":{"23011":[("ME-1",.62),("ME-2",.38)]}}
}
ALASKA_FIPS = {
 "Aleutians East":"02013", "Aleutians West":"02016", "Anchorage":"02020", "Bethel":"02050",
 "Bristol Bay":"02060", "Chugach":"02063", "Copper River":"02066", "Denali":"02068",
 "Dillingham":"02070", "Fairbanks North Star":"02090", "Haines":"02100", "Hoonah-Angoon":"02105",
 "Juneau":"02110", "Kenai Peninsula":"02122", "Ketchikan Gateway":"02130", "Kodiak Island":"02150",
 "Kusilvak":"02158", "Lake and Peninsula":"02164", "Matanuska-Susitna":"02170", "Nome":"02180",
 "North Slope":"02185", "Northwest Arctic":"02188", "Petersburg":"02195", "Prince of Wales-Hyder":"02198",
 "Sitka":"02220", "Skagway":"02230", "Southeast Fairbanks":"02240", "Wrangell":"02275",
 "Yakutat":"02282", "Yukon-Koyukuk":"02290"
}

def number(value):
 try:return float(value)
 except (TypeError,ValueError):return 0.0

def new_acc(): return {"total":0.0,"candidates":defaultdict(float)}

def add_result(acc,total,candidates,scale=1.0):
 acc["total"] += total*scale
 for key,votes in candidates.items(): acc["candidates"][key] += votes*scale

def allocate_integer(value,assignments):
 raw=[value*share for _,share in assignments]; floors=[int(v) for v in raw]
 order=sorted(range(len(raw)),key=lambda i:(-(raw[i]-floors[i]),assignments[i][0]))
 for i in range(round(value)-sum(floors)):floors[order[i%len(order)]]+=1
 return floors

def allocate_candidate_matrix(candidate_map,assignments,row_targets):
 matrix={key:allocate_integer(votes,assignments) for key,votes in candidate_map.items()}
 row_sums=[sum(values[i] for values in matrix.values()) for i in range(len(assignments))]
 differences=[row_targets[i]-row_sums[i] for i in range(len(assignments))]
 while any(value for value in differences):
  under=max(range(len(differences)),key=lambda i:differences[i])
  over=min(range(len(differences)),key=lambda i:differences[i])
  if differences[under]<=0 or differences[over]>=0:break
  movable=next((key for key,values in matrix.items() if values[over]>0),None)
  if movable is None:break
  matrix[movable][over]-=1; matrix[movable][under]+=1
  differences[over]+=1; differences[under]-=1
 return matrix

def candidate_metadata(raw):
 raw=(raw or "OTHER").strip().upper()
 return CANDIDATE_META.get(raw,(raw.title() or "Other candidates","","images/scenario.jpg"))

def candidate_id(raw,party):
 key=raw+"|"+party
 if key not in CANDIDATE_REGISTRY:
  display,home,image=candidate_metadata(raw)
  if raw=="OTHER" and party=="G":display="Green candidates"
  CANDIDATE_REGISTRY[key]={"name":display,"party":party,"partyLabel":PARTY_LABELS.get(party,"Other"),"homeState":home,"img":image}
 return key

def finalize(acc):
 party_votes={key:0.0 for key in ("D","R","G","L","I","PSL")}; rows=[]; candidate_sum=0.0
 for (raw,party),votes in acc["candidates"].items():
  if votes<=0:continue
  candidate_sum+=votes; party_votes[party]=party_votes.get(party,0)+votes
  rows.append({"id":candidate_id(raw,party),"rawName":raw,"party":party,"votes":round(votes)})
 total=max(round(acc["total"]),round(candidate_sum)); residual=max(0,total-sum(r["votes"] for r in rows))
 if residual:
  other=next((r for r in rows if r["rawName"]=="OTHER" and r["party"]=="I"),None)
  if other:other["votes"]+=residual
  else:rows.append({"id":candidate_id("OTHER","I"),"rawName":"OTHER","party":"I","votes":residual})
  party_votes["I"]+=residual
 rows.sort(key=lambda r:(-r["votes"],r["id"]))
 votes={party:round(value) for party,value in party_votes.items()}; d,r=votes["D"],votes["R"]
 pd=round(d/total*100,2) if total else 0; pr=round(r/total*100,2) if total else 0
 return {"d":d,"r":r,"tot":total,"pd":pd,"pr":pr,"m":round(pd-pr,2),"votes":votes,"c":[[row["id"],row["votes"]] for row in rows]}

def canonical_fips(state,raw_fips,name,valid):
 state=(state or "").upper(); name=(name or "").strip().upper(); raw=(raw_fips or "").strip()
 # Kansas City's separate Missouri return belongs in Jackson County. Checking
 # the state first prevents its old numeric code from becoming a New York FIPS.
 if state=="MO" and name=="KANSAS CITY":return "29095"
 if state=="DC" and (not raw or raw.upper()=="NA"):return "11001"
 try:fips=str(int(float(raw))).zfill(5)
 except (TypeError,ValueError):return None
 if state=="SD" and fips=="46113":fips="46102"
 elif state=="VA" and fips=="51515":fips="51019"
 elif state=="AK":return None # Alaska source rows are legislative districts.
 return fips if fips in valid else None

def source_rows(path):
 with path.open(encoding="utf-8-sig",newline="") as handle:
  first=handle.readline()
  # The 2012-2024 supplemental file has a one-line dataset label before its header.
  if "state" not in first.lower() or "year" not in first.lower():
   first=handle.readline()
  reader=csv.DictReader([first]+list(handle))
  yield from reader

def parse_margin(value):
 try:return round(float(value),1)
 except (TypeError,ValueError):return None

def load_alaska_margins(valid):
 margins={year:{} for year in YEARS}
 with ALASKA_MARGIN_SOURCE.open(encoding="utf-8-sig",newline="") as handle:
  for row in csv.DictReader(handle):
   area=(row.get("area") or "").strip()
   fips=ALASKA_FIPS.get(area)
   if not fips or fips not in valid:raise ValueError(f"Unmapped Alaska county equivalent: {area} ({fips})")
   for year in YEARS:
    margin=parse_margin(row.get(str(year)))
    if margin is None:raise ValueError(f"Missing Alaska margin: {area} {year}")
    margins[year][fips]={"m":margin,"estimated":True,
                         "source":ALASKA_MARGIN_SOURCE.name,
                         "sourceNote":"Margin from the supplied Alaska historical borough/census-area chart; Alaska certifies presidential returns at precinct/House-district level rather than these county-equivalent boundaries."}
 return margins

def main():
 with (ROOT/"counties"/"demographics.v2.json").open(encoding="utf-8") as handle:county_data=json.load(handle)["counties"]
 valid={str(key).zfill(5) for key in county_data}; grouped=defaultdict(list)
 alaska_margins=load_alaska_margins(valid)
 sources=((SOURCE,None,None),(CT_LEGACY_SOURCE,"CT",2020),(CT_MODERN_SOURCE,"CT",2024))
 for path,state_filter,max_year in sources:
  source_grouped=defaultdict(list)
  for row in source_rows(path):
   state=(row.get("state_po") or "").upper()
   try:year=int(row.get("year",0))
   except (TypeError,ValueError):continue
   if state_filter and state != state_filter:continue
   if max_year and year > max_year:continue
   if path == CT_MODERN_SOURCE and year < 2012:continue
   if year not in YEARS or "PRESIDENT" not in (row.get("office") or "").upper():continue
   raw_fips=row.get("county_fips") or ""
   normalized_fips=canonical_fips(state,raw_fips,row.get("county_name") or "",valid) or raw_fips
   key=(year,state,normalized_fips,row.get("county_name") or "")
   source_grouped[key].append(row)
  for key,rows in source_grouped.items():
   # Supplemental CT sources are loaded after the base source and replace any
   # partial record for the same geography/year with their complete return.
   grouped[key]=rows if state_filter else grouped[key]+rows
 national={y:new_acc() for y in YEARS}; states={y:defaultdict(new_acc) for y in YEARS}; counties={y:defaultdict(new_acc) for y in YEARS}
 for (year,state,raw_fips,name),rows in grouped.items():
  selected=[r for r in rows if (r.get("mode") or "").strip().upper()=="TOTAL"] or rows
  candidates=defaultdict(float); total=0.0
  for row in selected:
   raw=(row.get("candidate") or "").strip().upper()
   if not raw or raw in EXCLUDED:continue
   votes=number(row.get("candidatevotes"))
   if votes<0:continue
   party=PARTY_CODES.get((row.get("party") or "").strip().upper(),"I")
   candidates[(raw,party)]+=votes; total=max(total,number(row.get("totalvotes")))
  if not candidates:continue
  total=max(total,sum(candidates.values())); add_result(national[year],total,candidates); add_result(states[year][state],total,candidates)
  fips=canonical_fips(state,raw_fips,name,valid)
  if fips:add_result(counties[year][fips],total,candidates)
 output={"schemaVersion":2,"years":list(YEARS),"source":SOURCE.name,
         "supplementalSources":[CT_LEGACY_SOURCE.name,CT_MODERN_SOURCE.name,ALASKA_MARGIN_SOURCE.name],
         "candidates":CANDIDATE_REGISTRY,"data":{}}
 for year in YEARS:
  year_counties={fips:finalize(acc) for fips,acc in counties[year].items()}
  year_counties.update(alaska_margins[year])
  districts={name:new_acc() for name in ("NE-1","NE-2","NE-3","ME-1","ME-2")}
  for fips,rec in year_counties.items():
   source_rec=county_data.get(fips) or county_data.get(str(int(fips))) or {}; state=source_rec.get("s","")
   if state not in SPLIT_RULES:continue
   candidate_map=defaultdict(float)
   for candidate_key,votes in rec["c"]:
    raw,party=candidate_key.rsplit("|",1); candidate_map[(raw,party)]+=votes
   rule=SPLIT_RULES[state]; assignments=rule["split"].get(fips) or [(rule["map"].get(fips,rule["default"]),1.0)]
   district_totals=allocate_integer(rec["tot"],assignments)
   candidate_allocations=allocate_candidate_matrix(candidate_map,assignments,district_totals)
   for index,(district,share) in enumerate(assignments):
    districts[district]["total"]+=district_totals[index]
    for key,values in candidate_allocations.items():districts[district]["candidates"][key]+=values[index]
  state_records={st:finalize(acc) for st,acc in states[year].items()}
  # Maine reported military/overseas (UOCAVA) votes outside counties in 2012
  # and 2016. Distribute any such state-only remainder proportionally so the
  # district view remains an exact partition of the certified statewide total.
  for state in ("ME","NE"):
   names=[name for name in districts if name.startswith(state+"-")]; state_rec=state_records[state]
   delta_total=state_rec["tot"]-sum(round(districts[name]["total"]) for name in names)
   district_candidate_totals=defaultdict(int)
   for name in names:
    for (raw,party),votes in districts[name]["candidates"].items():district_candidate_totals[raw+"|"+party]+=round(votes)
   delta_candidates=defaultdict(float)
   for key,votes in state_rec["c"]:
    raw,party=key.rsplit("|",1); delta=max(0,votes-district_candidate_totals[key])
    if delta:delta_candidates[(raw,party)]=delta
   if delta_total>0:
    existing=[max(0,districts[name]["total"]) for name in names]; existing_total=sum(existing) or len(names)
    assignments=[(name,(existing[i]/existing_total if sum(existing) else 1/len(names))) for i,name in enumerate(names)]
    row_targets=allocate_integer(delta_total,assignments); matrix=allocate_candidate_matrix(delta_candidates,assignments,row_targets)
    for i,name in enumerate(names):
     districts[name]["total"]+=row_targets[i]
     for key,values in matrix.items():districts[name]["candidates"][key]+=values[i]
  output["data"][str(year)]={"national":finalize(national[year]),"states":state_records,"districts":{d:finalize(acc) for d,acc in districts.items()},"counties":year_counties}
 output["candidates"]=CANDIDATE_REGISTRY
 with OUTPUT.open("w",encoding="utf-8") as handle:json.dump(output,handle,separators=(",",":"))
 print(f"Built {OUTPUT.name} from {SOURCE.name}")

if __name__=="__main__":main()
