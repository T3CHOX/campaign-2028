# Data provenance audit

This audit distinguishes observed inputs from derived values and scenario assumptions. A filename, comment, or AI-generated description is not treated as evidence that a number is factual.

## Source-backed inputs

| Area | Current source | Status and limits |
| --- | --- | --- |
| Presidential election returns | `data/official-election-results/2000presge.xls`, `2004pres.xls`, `2008pres.xls`, `2012pres.xls`, `federalelections2016.xlsx`, `federalelections2020.xlsx`, `2024presgeresults.xlsx` | Imported election-return workbooks. These are the appropriate anchor for county/state historical margins; geography changes still need explicit crosswalks. The 2024 federal result can be checked against the FEC's official report. |
| Census demographics | `data/census/2023/*.csv` and matching `*.metadata.json` | 2019–2023 ACS five-year tables with table metadata and source URLs. These support population, age, race/ethnicity, education, income, housing, employment and selected Asian-origin variables. They are estimates, not election behavior or forecasts. |
| Connecticut geography | `data/census/ct_cou_to_cousub_crosswalk.txt` | A geography crosswalk for Connecticut county-equivalent/town handling. It should be used whenever a historical election geography does not line up with current planning regions. |
| Voter registration | `data/official-voter-registration/nc-voter-stats-2020.zip` and `nc-voter-stats-2024.zip` | Official state-specific North Carolina files only; they are not national turnout or preference data. |
| 2024 voter-group validation | `REFERENCE_2024_RACE_VOTE_CHOICE` in `js/interestGroups.js` | White, Black, Hispanic and Asian anchors use Pew Research Center’s validated-voter estimates. The Native anchor uses the 2024 American Electorate Voter Poll’s Native oversample, rather than the conventional national exit-poll estimate that its source identifies as unrepresentative. The model preserves county return totals while raking exclusive racial/ethnic cells to these national reference shares. |

The Census Bureau documents the ACS API and its estimates at [census.gov](https://www.census.gov/programs-surveys/acs/data/data-via-api.html). The FEC's official 2024 presidential report is available [here](https://www.fec.gov/resources/cms-content/documents/2024presgeresults.pdf).

## Derived or partially documented inputs

| Area | File/code | Status |
| --- | --- | --- |
| County population and demographic profiles | `counties/demographics.v2.json` (runtime), `counties/county_data.json` and `counties/us_county_data.xlsx` (build/source inputs) | Derived from Census tables and transformations. The raw Census tables are source-backed; the final modeled cells, overlap weights and county profiles are derived and should not be mistaken for directly observed voter groups. The runtime file now carries a versioned `compositionSchema` describing units and universes. |
| County turnout baselines | `counties/county_turnout_baselines.json` | Derived output. It needs a documented source chain to each election year before it can be treated as a factual turnout series. |
| CPS turnout file | `data/CPS_Demographic_Turnout_Rates_v2.1.csv` | Provenance incomplete in this repository: the file has no accompanying source/methodology manifest identifying the exact CPS tables, extraction query, vintage, universe and transformations. Treat as provisional until that manifest is supplied. |
| Alaska borough/CDP history | `data/official-election-results/alaska-historical-borough-margins.csv` | Imported historical margins, but borough/CDP consolidation and changing census-equivalent geography require a source-level crosswalk and validation against each election's reporting geography. |

## Scenario assumptions or simulations

These are not factual datasets unless a source and reproducible extraction method are added:

- `js/interestGroups.js`: group baselines, elasticities, issue priorities and most group-support shares are scenario inputs. The explicitly labelled 2024 national vote-choice anchors are reference calibration inputs, not county-level measurements.
- `js/electorate.js`: issue distributions, group importance, turnout priors, ideological profiles and overlap behavior are modeled assumptions. They are not directly observed county vote-choice measurements.
- Legacy workbook fields: religion, union and political-orientation values remain legacy scenario inputs unless separately documented. `union` is explicitly a percentage of residents in this simulator's workbook definition; it is not a BLS worker-union-membership rate. The runtime exposes a faction-aligned semantic mapping (`progressive` → `activist_left`, `maga` → `america_first_conservative`, `libertarian` → `unaligned_center`, `centrist` → `pragmatic_moderate`) while retaining legacy aliases so existing policy/UI code and saved scenarios continue to read the same numbers.
- `js/policies.js` and `processAIPolicies`: policy effects and dynamically generated policy effects are simulated scenario mechanics.
- `js/issueCatalog.js`: candidate policy positions are explicitly scenario mappings and should not be presented as verified real-world stances.
- `js/candidates.js`: `groupBoosts`, `groupDebuffs`, `groupEffects`, candidate-era profiles and the Harris/Trump reference residuals are designer-set calibration inputs.
- `js/polling.js`: polls are simulated from the in-app pollster configuration, random sampling, house effects and error. They are not a historical public-poll archive. A carry-forward weekly average is a transparent estimate, not a new poll.

Validated-voter research is useful for checking broad coalition and turnout patterns, but it does not identify a causal policy/personality split for every county or interest group. Pew's 2024 vote-choice analysis is [here](https://www.pewresearch.org/politics/2025/06/26/voting-patterns-in-the-2024-election/), its turnout methodology is [here](https://www.pewresearch.org/politics/2025/06/26/validated-voters-2024-methodology/), and the Native American voter-poll methodology is summarized [here](https://www.brookings.edu/articles/the-native-american-vote-in-the-2024-presidential-election/).

## Data still needed for a fully factual mode

To replace the remaining assumptions, supply the source files plus documentation for:

1. county/borough/CDP-level vote returns for every target election year, including geography crosswalks;
2. demographic turnout and vote choice by race, age, education, religion, union status, urbanicity and ideology;
3. county-level registration and turnout denominators for each state/year;
4. actual weekly public polls, including field dates, sample, likely-voter screen, mode, geography, candidate shares and undecided share; and
5. the exact definitions and vintages behind any religion, union and ideology fields.

Until those materials are uploaded, the simulator now labels and isolates the assumption-driven pieces instead of implying that they are grounded in observed numbers. The generated schema also records that the union value uses the resident-population universe supplied by the workbook. No numerical demographic value is recalculated by this cleanup.
