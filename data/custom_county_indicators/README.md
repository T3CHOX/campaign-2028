# Custom County Indicators

Drop any custom CSV or JSON files into this directory to automatically enhance county-level issue weighting and simulation dynamics.

## Supported Formats

### 1. CSV Format (`custom_indicators.csv`)
Columns should include:
- `fips` (5-digit County FIPS code, e.g., `01001` or `1001`)
- Any numeric indicator column(s), for example:
  - `income_inequality` (Gini index 0.0 - 1.0)
  - `union_density` (Percent of workforce in labor unions 0.0 - 1.0)
  - `evangelical_share` (Estimated religious adherence 0.0 - 1.0)
  - `fossil_fuel_jobs` (Share of mining/oil/gas employment 0.0 - 1.0)
  - `cost_of_living_index` (Base 100 = national average)
  - `uninsured_rate` (Share of population without health coverage 0.0 - 1.0)

Example `custom_indicators_template.csv`:
```csv
fips,income_inequality,union_density,fossil_fuel_jobs,uninsured_rate
01001,0.442,0.082,0.012,0.098
01003,0.468,0.065,0.005,0.114
```

### 2. JSON Format (`custom_indicators.json`)
```json
{
  "01001": {
    "income_inequality": 0.442,
    "union_density": 0.082
  }
}
```

The game automatically checks and integrates data placed here into the county economic and issue evaluation engines!
