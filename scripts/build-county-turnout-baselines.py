"""Build county turnout baselines from 2020/2024 presidential votes and registration.

Most county registration figures come from national_active_inactive_by_county.csv.
North Carolina is absent from that file, so its election-day 2020 and 2024
registration statistics come directly from the NCSBE source archives.
"""
from __future__ import annotations

import csv
import io
import json
import zipfile
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ROLL_SOURCE = ROOT / "counties" / "national_active_inactive_by_county.csv"
HISTORY_SOURCE = ROOT / "counties" / "historical_elections.json"
DEMOGRAPHICS_SOURCE = ROOT / "counties" / "demographics.v2.json"
NC_SOURCES = {
    2020: ROOT / "data" / "official-voter-registration" / "nc-voter-stats-2020.zip",
    2024: ROOT / "data" / "official-voter-registration" / "nc-voter-stats-2024.zip",
}
OUTPUT = ROOT / "counties" / "county_turnout_baselines.json"

STATE_FIPS = {
    "AL":"01","AK":"02","AZ":"04","AR":"05","CA":"06","CO":"08","CT":"09","DE":"10","DC":"11",
    "FL":"12","GA":"13","HI":"15","ID":"16","IL":"17","IN":"18","IA":"19","KS":"20","KY":"21",
    "LA":"22","ME":"23","MD":"24","MA":"25","MI":"26","MN":"27","MS":"28","MO":"29","MT":"30",
    "NE":"31","NV":"32","NH":"33","NJ":"34","NM":"35","NY":"36","NC":"37","ND":"38","OH":"39",
    "OK":"40","OR":"41","PA":"42","RI":"44","SC":"45","SD":"46","TN":"47","TX":"48","UT":"49",
    "VT":"50","VA":"51","WA":"53","WV":"54","WI":"55","WY":"56",
}


def normalized_county_name(value: str) -> str:
    name = (value or "").upper().strip()
    for suffix in (" COUNTY", " PARISH", " BOROUGH", " CENSUS AREA", " MUNICIPALITY"):
        if name.endswith(suffix):
            name = name[:-len(suffix)]
    return " ".join(name.replace(".", "").split())


def load_national_registration():
    records = {}
    with ROLL_SOURCE.open(encoding="utf-8-sig", newline="") as handle:
        for row in csv.DictReader(handle):
            state_fips = STATE_FIPS.get((row.get("state") or "").upper())
            if not state_fips:
                continue
            try:
                fips = state_fips + str(int(row["countyfp"])).zfill(3)
                records[fips] = {
                    "registered": int(row["total_reg_count"]),
                    "active": int(row["active_reg_count"]),
                    "inactive": int(row["inactive_reg_count"]),
                    "registrationSource": ROLL_SOURCE.name,
                }
            except (KeyError, TypeError, ValueError):
                continue
    return records


def load_nc_registration(demographics):
    county_by_name = {
        normalized_county_name(county.get("n", "")): fips
        for fips, county in demographics.items() if fips.startswith("37")
    }
    totals_by_year = {}
    for year, source in NC_SOURCES.items():
        county_totals = defaultdict(int)
        with zipfile.ZipFile(source) as archive:
            filename = archive.namelist()[0]
            with archive.open(filename) as raw:
                reader = csv.DictReader(io.TextIOWrapper(raw, encoding="utf-8"), delimiter="\t")
                for row in reader:
                    county_totals[normalized_county_name(row.get("county_desc", ""))] += int(row.get("total_voters") or 0)
        totals_by_year[year] = county_totals

    records = {}
    for name, fips in county_by_name.items():
        values = [totals_by_year[year].get(name, 0) for year in sorted(totals_by_year)]
        values = [value for value in values if value > 0]
        if values:
            registered = round(sum(values) / len(values))
            records[fips] = {
                "registered": registered,
                "active": registered,
                "inactive": 0,
                "registrationSource": "NCSBE election-day voter statistics (2020/2024 average)",
            }
    if len(records) != 100:
        raise ValueError(f"Expected 100 North Carolina counties, found {len(records)}")
    return records


def average_county_ballots(history, fips):
    values = []
    for year in ("2020", "2024"):
        record = history.get(year, {}).get("counties", {}).get(fips)
        if record and record.get("tot", 0) > 0:
            values.append(record["tot"])
    return (sum(values) / len(values), len(values)) if values else (0, 0)


def average_state_ballots(history, state):
    values = []
    for year in ("2020", "2024"):
        record = history.get(year, {}).get("states", {}).get(state)
        if record and record.get("tot", 0) > 0:
            values.append(record["tot"])
    return sum(values) / len(values) if values else 0


def main():
    with DEMOGRAPHICS_SOURCE.open(encoding="utf-8") as handle:
        demographics = json.load(handle)["counties"]
    with HISTORY_SOURCE.open(encoding="utf-8") as handle:
        history = json.load(handle)["data"]

    registration = load_national_registration()
    registration.update(load_nc_registration(demographics))
    output = {}

    # Alaska's source returns are not county based. Apply its exact statewide
    # baseline rate to each borough so the borough totals partition the state.
    state_rate_fallbacks = {}
    for state in ("AK", "CT"):
        state_fips = STATE_FIPS[state]
        registered = sum(rec["registered"] for fips, rec in registration.items() if fips.startswith(state_fips))
        ballots = average_state_ballots(history, state)
        state_rate_fallbacks[state] = ballots / registered if registered else 0

    for fips, county in demographics.items():
        rec = registration.get(fips)
        ballots, years_used = average_county_ballots(history, fips)
        state = county.get("s") or ""
        if rec and ballots > 0:
            turnout = ballots / rec["registered"]
            source = "County presidential vote and registration averages, 2020/2024"
        elif rec and state in state_rate_fallbacks:
            turnout = state_rate_fallbacks[state]
            ballots = rec["registered"] * turnout
            years_used = 2
            source = "State presidential vote rate applied to county registration, 2020/2024"
        elif fips == "15005":
            # Kalawao is included in Maui's election reporting unit.
            output[fips] = {"registered": 1, "turnout": 0, "baselineVotes": 0, "yearsUsed": 2, "source": "Included in Maui County returns"}
            continue
        else:
            continue
        if not 0 <= turnout <= 1:
            raise ValueError(f"Invalid turnout rate {turnout:.4f} for {fips}")
        output[fips] = {
            "registered": rec["registered"],
            "turnout": round(turnout, 8),
            "baselineVotes": round(ballots, 2),
            "yearsUsed": years_used,
            "source": source,
        }

    missing = sorted(set(demographics) - set(output))
    if missing:
        raise ValueError(f"Missing turnout baselines for {len(missing)} county units: {missing[:20]}")

    payload = {
        "schemaVersion": 1,
        "method": "Average 2020/2024 presidential votes divided by average registered voters",
        "counties": output,
    }
    with OUTPUT.open("w", encoding="utf-8") as handle:
        json.dump(payload, handle, separators=(",", ":"))
    print(f"Built {OUTPUT.name} for {len(output)} county units")


if __name__ == "__main__":
    main()
