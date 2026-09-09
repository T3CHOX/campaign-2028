# Demographics, issues, polling and advertising overhaul

Implemented September 1, 2026. Start a new campaign to use simulation schema 2.

## Delivered behavior

- 54 issues in seven sections, each with seven named positions and a substantive description of every position. Coverage includes Venezuela, Israel, Ukraine, H-1B, other immigration programs, economic policy, housing, health, energy, rights and government/technology.
- 71 detailed origin groups: 25 Hispanic/Latino, 33 Asian and 13 Native Hawaiian/Pacific Islander categories. Their parent groups start collapsed. The original age, education, occupation, religion and political groups remain available.
- Every group has a description and an issue profile with a distribution, mean, importance and modeling explanation. Broad profiles have separate policy-domain centers and issue-specific overrides; children inherit documented defaults unless an override exists. These are tunable scenario assumptions, not measured ethnic voting preferences.
- Every one of the 3,143 playable counties has a factual profile covering available population, resident employment sectors, household conditions and an explicitly identified electoral scenario baseline. County profiles avoid unsupported claims about named employers, landmarks or residents' beliefs.
- National subgroup polls are published at baseline and after each completed week. Opening a panel never generates a new sample or reveals the live model. The default dedicated subgroup sample is 1,068 effective interviews, giving approximately ±3 percentage points at 95% confidence. Sample allocation, weighting design effects and limited recruitment can change that interval. History preserves candidate names/parties, undecided share, dates and methodology.
- TV, digital, county shortcuts, queued issue ads and opponent ad actions use the new issue/advertising mechanisms. Policy attacks select a particular active opponent, including a third-party candidate, and show color portraits and current positions. A purchased attack records its targeted stance. If that stance changes, stale attacks lose accuracy and can backfire.
- Advertising raises local issue attention with diminishing returns, a finite attention budget and weekly decay. Importance and policy agreement affect vote choice and participation. Mobilization targets the sponsor's supporters. Duration includes the immediate delivery; funds are charged once and each later delivery happens once.
- Policy announcements, stance edits, VP pressure, debates and endorsements read the live candidate platform. Old numeric values remain only as compatibility data for legacy thresholds; public controls use the seven named positions.
- Versioned snapshots restore funds, candidate positions, county effects, polls and policy state together. Old simulation snapshots are rejected with a new-campaign message.

## Data provenance and geography

The supplied `ACSDT5Y2023.B03001-Data.csv` is preserved under `data/census/2023/B03001-supplied.csv`. The import verified **194,370 estimate/MOE values across 3,135 direct county matches** against the official Census bulk file. Its SHA-256 and reconciliation results appear in `data/census/import-report.json`.

Additional inputs are the **2019–2023 ACS five-year** releases downloaded directly from the Census Bureau. Each cached table has its own metadata file containing the exact data URL, metadata URL, vintage and variable labels:

| Tables | Use |
|---|---|
| B03001 | Detailed Hispanic/Latino origin |
| B03002 | Mutually exclusive Hispanic origin / non-Hispanic race partition |
| B02015, B02016 | Detailed Asian-alone and Pacific Islander-alone origins |
| B05003, B05003H, B05003I | Citizens aged 18+, including White non-Hispanic and Hispanic totals |
| B01001, B01002 | Adult age/sex shares and median age |
| B15003 | Educational attainment |
| B19013, B17001, B23025 | Income, poverty and employment status |
| C24030 | Resident employment by industry |
| B25064, B25077 | Rent and owner-occupied home value |

Primary references: [ACS summary files](https://www.census.gov/programs-surveys/acs/data/summary-file.html), [2023 table definitions](https://api.census.gov/data/2023/acs/acs5/groups.html), [Census Connecticut county-to-town crosswalk](https://www2.census.gov/geo/docs/reference/ct_change/ct_cou_to_cousub_crosswalk.txt).

Connecticut's new planning-region totals are not copied into historical counties. Census town counts are summed into the map's eight historical counties. Count MOEs use the approximate square-sum method; medians are omitted because averaging town medians would be incorrect. Alaska uses 30 actual county equivalents, avoiding legislative-district codes that collide with borough FIPS. All **3,143 map FIPS match the new data exactly**. The combined resident count is **332,387,540**, including **3,598,348** in Connecticut.

## What is measured and what is modeled

Resident counts are not voter counts. County citizen-adult totals constrain the electorate. Hispanic and White non-Hispanic citizen-adult shares use the dedicated tables. Remaining racial groups and detailed origins require proportional allocation because this release does not give the complete origin-by-citizenship-by-age joint distribution. Asian/Pacific detailed counts are proportionally reconciled to their non-Hispanic parent totals. Source estimates and MOEs remain available separately.

Race/origin cells form one exclusive electorate; age, religion, education and occupation contribute a normalized mixture of influences instead of extra voters. Conditional estimates for these overlapping groups use modeled memberships. Their group sizes must not be added together. Poll observations never feed back into the true county electorate.

Registration is a calibrated total pool capped by citizen-adult population. Inactive registrants are split out of that pool, not added again. County, state and national results use the same expected ballots. Zero registration, zero eligible population or zero reporting produces zero votes.

The existing election scenario and legacy candidate traits are retained. Alaska electoral priors use the historical county workbook, not mislabeled 2024 district returns. Kalawao County has a clearly marked statewide electoral prior because the source lacks its separate electoral baseline. Religion, union membership and political-orientation shares are legacy assumptions with unverified provenance. Candidate policy mappings and group opinions are scenario content, not verified statements of real politicians' current positions or empirical forecasts for 2028.

Parent and child polls are separate simulated dedicated surveys, so observed parent results need not equal the weighted average of sampled child results. Sampling MOEs are distinct from ACS population-estimate MOEs and exclude nonsampling error. Small-community sample adjustments use population availability, not a blanket ethnicity penalty.

## Run and rebuild

From the application directory:

```text
npm install
npm start
```

Open `http://localhost:3000`. No Census API key or live data request is needed during play.

```text
python scripts/fetch-census.py
python scripts/build-demographics.py --hispanic-csv "PATH_TO_B03001_EXPORT.csv"
npm run lint
npm test
```

Python requires `openpyxl` for the pre-existing county workbook. After the first import, omit `--hispanic-csv` to rebuild from the preserved export. The fetcher is resumable and reuses cached official tables. The builder creates both JSON and a deterministic gzip copy; the included server serves gzip to supporting browsers. Static hosting that does not configure gzip still works with the JSON file.

Important implementation files: `js/issueCatalog.js`, `js/electorate.js`, `js/groupPolling.js`, `js/adEngine.js`, `js/overhaulIntegration.js`, `js/overhaulUI.js`, `overhaul.css`, plus integrations in the existing startup, campaign and candidate modules.

## Validation and practical limits

All browser scripts and the server pass syntax checks. **26 model checks pass**, covering descriptions, normalized profiles, geography, population accounting, bounded votes, ballot access, pure recomputation, poll persistence, simulated 95% interval coverage, live candidate edits, nonlinear policy agreement, invalid purchases, third-party attacks, spending/delivery idempotency, locality, attention decay, save/restore, issue-reference integrity, salience response, mobilization, election totals, national weighting and two-party mode.

Browser checks covered campaign startup and weekly progression, group hierarchy/search/history, stance changes, a two-week attack purchase, TV county shortcuts, county profiles, keyboard dismissal/focus containment, and layouts at desktop, tablet and 375px width. Third-party targeting and six-candidate totals were tested in the model suite; the interactive UI review used a two-party campaign.

The new county payload is 23,743,554 bytes uncompressed and 2,599,700 bytes compressed (about 89% smaller). A six-candidate model initialization took about 5.4 seconds in the isolated Node test environment; a complete two-party browser week took about 1.7 seconds in the observed check. These are local observations, not a hardware-independent benchmark. No reliable pre-change performance baseline was available because the original persuasion module had a syntax error; that error is repaired.

No further Census export is required for this implementation. Future empirical calibration would benefit from reliable county religion/union data, subgroup opinion surveys and authoritative borough-level election baselines. The current model explicitly labels those assumptions instead of inventing Census opinion data.
