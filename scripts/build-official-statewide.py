"""Build precomputed official state and current-border ME/NE district returns.

State results come from the Federal Election Commission workbooks in
data/official-election-results. District results use the simulator's current
county/split-county assignments and are reconciled candidate-by-candidate so
they partition the official statewide result exactly.
"""
from __future__ import annotations

import json
import math
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts" / "_vendor"))

import pandas as pd

SOURCE_DIR = ROOT / "data" / "official-election-results"
COUNTY_HISTORY = ROOT / "counties" / "historical_elections.json"
OUTPUT = ROOT / "counties" / "historical_statewide.json"
STATE_CODES = {
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID",
    "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO",
    "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA",
    "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
}

FEATURED = {
    2000: (
        ("gore", "official-2000-gore", "Al Gore", "D", "TN", "images/historical/gore.jpg"),
        ("bush", "official-2000-bush", "George W. Bush", "R", "TX", "images/historical/bush.jpg"),
        ("nader", "official-2000-nader", "Ralph Nader", "G", "CT", "images/historical/nader.jpg"),
    ),
    2004: (
        ("bush", "official-2004-bush", "George W. Bush", "R", "TX", "images/historical/bush.jpg"),
        ("kerry", "official-2004-kerry", "John Kerry", "D", "MA", "images/historical/kerry.jpg"),
        ("nader", "official-2004-nader", "Ralph Nader", "I", "CT", "images/historical/nader.jpg"),
    ),
    2008: (
        ("obama", "official-2008-obama", "Barack Obama", "D", "IL", "images/historical/obama.jpg"),
        ("mccain", "official-2008-mccain", "John McCain", "R", "AZ", "images/historical/mccain.jpg"),
        ("nader", "official-2008-nader", "Ralph Nader", "I", "CT", "images/historical/nader.jpg"),
    ),
    2012: (
        ("obama", "official-2012-obama", "Barack Obama", "D", "IL", "images/historical/obama.jpg"),
        ("romney", "official-2012-romney", "Mitt Romney", "R", "MA", "images/historical/romney.jpg"),
    ),
    2016: (
        ("clinton", "official-2016-clinton", "Hillary Clinton", "D", "NY", "images/historical/clinton.jpg"),
        ("trump", "official-2016-trump", "Donald Trump", "R", "NY", "images/trump.jpg"),
    ),
    2020: (
        ("biden", "official-2020-biden", "Joe Biden", "D", "DE", "images/historical/biden.jpg"),
        ("trump", "official-2020-trump", "Donald Trump", "R", "FL", "images/trump.jpg"),
        ("jorgensen", "official-2020-jorgensen", "Jo Jorgensen", "L", "SC", "images/historical/jorgensen.jpg"),
    ),
    2024: (
        ("harris", "official-2024-harris", "Kamala Harris", "D", "CA", "images/harris.jpg"),
        ("trump", "official-2024-trump", "Donald Trump", "R", "FL", "images/trump.jpg"),
        ("oliver", "official-2024-oliver", "Chase Oliver", "L", "GA", "images/historical/oliver.jpg"),
    ),
}

WORKBOOKS = {
    2000: ("2000presge.xls", "Master By State"),
    2004: ("2004pres.xls", "2004 PRES GENERAL RESULTS"),
    2008: ("2008pres.xls", "2008 PRES GENERAL RESULTS"),
    2012: ("2012pres.xls", "2012 Pres General Results"),
    2016: ("federalelections2016.xlsx", "2016 Pres General Results"),
    2020: ("federalelections2020.xlsx", "9. 2020 Pres General Results"),
}

PARTY_LABELS = {"D": "Democratic", "R": "Republican", "G": "Green", "L": "Libertarian", "I": "Independent / Other"}


def as_int(value) -> int:
    try:
        if pd.isna(value):
            return 0
        return max(0, int(round(float(value))))
    except (TypeError, ValueError):
        return 0


def feature_for_name(year: int, name: str):
    normalized = str(name or "").lower().replace(".", " ")
    for feature in FEATURED[year]:
        if feature[0] in normalized:
            return feature
    return None


def candidate_registry():
    registry = {}
    for year, features in FEATURED.items():
        for _, candidate_id, name, party, home, image in features:
            registry[candidate_id] = {
                "name": name, "party": party, "partyLabel": PARTY_LABELS[party],
                "homeState": home, "img": image,
            }
        registry[f"official-{year}-other"] = {
            "name": "Other Candidates", "party": "I", "partyLabel": PARTY_LABELS["I"],
            "homeState": "", "img": "images/scenario.jpg",
        }
    return registry


def record_from_candidate_votes(year: int, candidate_votes: dict[str, int], total: int | None = None):
    total = as_int(total if total is not None else sum(candidate_votes.values()))
    candidate_sum = sum(candidate_votes.values())
    if candidate_sum != total:
        candidate_votes[f"official-{year}-other"] = candidate_votes.get(f"official-{year}-other", 0) + total - candidate_sum
    registry = candidate_registry()
    party_votes = defaultdict(int)
    rows = []
    for candidate_id, votes in candidate_votes.items():
        votes = as_int(votes)
        if votes <= 0:
            continue
        party = registry[candidate_id]["party"]
        party_votes[party] += votes
        rows.append([candidate_id, votes])
    rows.sort(key=lambda item: (-item[1], item[0]))
    d_votes, r_votes = party_votes["D"], party_votes["R"]
    pd_pct = round(d_votes / total * 100, 2) if total else 0
    pr_pct = round(r_votes / total * 100, 2) if total else 0
    votes = {party: party_votes[party] for party in ("D", "R", "G", "L", "I", "PSL")}
    return {
        "d": d_votes, "r": r_votes, "tot": total, "pd": pd_pct, "pr": pr_pct,
        "m": round(pd_pct - pr_pct, 2), "votes": votes, "c": rows,
    }


def parse_long_workbook(year: int, filename: str, sheet: str):
    frame = pd.read_excel(SOURCE_DIR / filename, sheet_name=sheet)
    state_column = "STATE" if year == 2000 else "STATE ABBREVIATION"
    name_column = "CANDIDATE" if year == 2000 else "LAST NAME,  FIRST"
    vote_column = "# OF VOTES" if year == 2000 else "GENERAL RESULTS"
    total_column = None if year == 2000 else "TOTAL VOTES #"
    states = {}
    for state in sorted(STATE_CODES):
        state_rows = frame[frame[state_column].astype(str).str.strip().eq(state)]
        featured_votes = defaultdict(int)
        all_votes = 0
        official_total = 0
        for _, row in state_rows.iterrows():
            if "combined" in str(row.get("PARTY") or "").lower():
                continue
            votes = as_int(row.get(vote_column))
            name = str(row.get(name_column) or "")
            if votes:
                all_votes += votes
                feature = feature_for_name(year, name)
                if feature:
                    featured_votes[feature[1]] += votes
            if total_column:
                official_total = max(official_total, as_int(row.get(total_column)))
        total = official_total or all_votes
        if not total:
            raise ValueError(f"No official {year} presidential total found for {state}")
        featured_votes[f"official-{year}-other"] = total - sum(featured_votes.values())
        if featured_votes[f"official-{year}-other"] < 0:
            raise ValueError(f"Featured candidate votes exceed the official total for {state} {year}")
        states[state] = record_from_candidate_votes(year, dict(featured_votes), total)
    return states


def parse_2024_workbook():
    frame = pd.read_excel(SOURCE_DIR / "2024presgeresults.xlsx", sheet_name="OFFICIAL 2024 PRES GE RESULTS")
    states = {}
    source_columns = {"harris": "HARRIS", "trump": "TRUMP", "oliver": "OLIVER"}
    for _, row in frame.iterrows():
        state = str(row.get("STATE") or "").strip()
        if state not in STATE_CODES:
            continue
        candidate_votes = {}
        for feature in FEATURED[2024]:
            candidate_votes[feature[1]] = as_int(row.get(source_columns[feature[0]]))
        total = as_int(row.get("TOTAL VOTES"))
        candidate_votes["official-2024-other"] = total - sum(candidate_votes.values())
        if candidate_votes["official-2024-other"] < 0:
            raise ValueError(f"Featured candidate votes exceed the official total for {state} 2024")
        states[state] = record_from_candidate_votes(2024, candidate_votes, total)
    missing = STATE_CODES - states.keys()
    if missing:
        raise ValueError(f"Missing 2024 state results: {sorted(missing)}")
    return states


def allocate_integer(total: int, weights: list[int | float], names: list[str]):
    if not weights or total <= 0:
        return [0 for _ in weights]
    weight_sum = sum(max(0, weight) for weight in weights)
    if not weight_sum:
        weights = [1 for _ in weights]
        weight_sum = len(weights)
    raw = [total * max(0, weight) / weight_sum for weight in weights]
    values = [math.floor(value) for value in raw]
    order = sorted(range(len(values)), key=lambda i: (-(raw[i] - values[i]), names[i]))
    for index in order[: total - sum(values)]:
        values[index] += 1
    return values


def collapse_district_record(year: int, record: dict, old_registry: dict):
    collapsed = defaultdict(int)
    for candidate_id, votes in record.get("c", []):
        meta = old_registry.get(candidate_id, {})
        feature = feature_for_name(year, meta.get("name", candidate_id))
        target_id = feature[1] if feature else f"official-{year}-other"
        collapsed[target_id] += as_int(votes)
    return collapsed


def build_districts(year: int, state_records: dict, county_history: dict, old_registry: dict):
    source = county_history[str(year)].get("districts", {})
    output = {}
    for state, district_names in (("ME", ["ME-1", "ME-2"]), ("NE", ["NE-1", "NE-2", "NE-3"])):
        collapsed = {name: collapse_district_record(year, source.get(name, {}), old_registry) for name in district_names}
        district_totals = [source.get(name, {}).get("tot", 0) for name in district_names]
        allocated = {name: defaultdict(int) for name in district_names}
        for candidate_id, statewide_votes in state_records[state]["c"]:
            weights = [collapsed[name].get(candidate_id, 0) for name in district_names]
            if not sum(weights):
                weights = district_totals
            shares = allocate_integer(statewide_votes, weights, district_names)
            for index, name in enumerate(district_names):
                allocated[name][candidate_id] = shares[index]
        for name in district_names:
            output[name] = record_from_candidate_votes(year, dict(allocated[name]))
        if sum(output[name]["tot"] for name in district_names) != state_records[state]["tot"]:
            raise AssertionError(f"{state} districts do not partition the official {year} result")
    return output


def build_national(year: int, state_records: dict):
    candidate_votes = defaultdict(int)
    for record in state_records.values():
        for candidate_id, votes in record["c"]:
            candidate_votes[candidate_id] += votes
    return record_from_candidate_votes(year, dict(candidate_votes))


def main():
    with COUNTY_HISTORY.open(encoding="utf-8") as handle:
        county_payload = json.load(handle)
    state_data = {}
    for year, (filename, sheet) in WORKBOOKS.items():
        state_data[year] = parse_long_workbook(year, filename, sheet)
    state_data[2024] = parse_2024_workbook()
    payload = {
        "schemaVersion": 1,
        "source": "Federal Election Commission official state election workbooks",
        "years": sorted(state_data),
        "candidates": candidate_registry(),
        "data": {},
    }
    for year, states in state_data.items():
        payload["data"][str(year)] = {
            "national": build_national(year, states),
            "states": states,
            "districts": build_districts(year, states, county_payload["data"], county_payload["candidates"]),
        }
    with OUTPUT.open("w", encoding="utf-8") as handle:
        json.dump(payload, handle, separators=(",", ":"))
    print(f"Built {OUTPUT.name} with official statewide totals for {len(state_data)} cycles")


if __name__ == "__main__":
    main()
