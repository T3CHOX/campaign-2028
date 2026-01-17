# CSV Data Import Instructions

This document explains how to import demographic data from the CSV file into the game's county_data.json.

## Prerequisites

- Python 3.x installed
- The CSV file `analytic_data2025_v3.csv` placed in the repository root directory

## CSV Format Requirements

The CSV file must contain the following columns with **exact** header names:

1. `5-digit FIPS Code` - The county FIPS code (can have leading zeros like "01001")
2. `Name` - County name
3. `Population raw value` - Total population count
4. `% Rural raw value` - Rural percentage as a float (0.0-1.0)
5. `% Female raw value` - Female percentage as a float (0.0-1.0)
6. `High School Completion raw value` - High school completion rate (0.0-1.0)
7. `Some College raw value` - Some college education rate (0.0-1.0)

## Running the Import Script

1. Place your `analytic_data2025_v3.csv` file in the repository root:
   ```bash
   # The file should be at: campaign-2028/analytic_data2025_v3.csv
   ```

2. Run the transformation script:
   ```bash
   python3 transform_csv_to_json.py
   ```

3. The script will:
   - Load the existing `counties/county_data.json`
   - Read the CSV data
   - Strip leading zeros from FIPS codes (e.g., "01001" becomes "1001")
   - Calculate county type based on rural percentage:
     - Rural: > 50% rural
     - Urban: < 10% rural
     - Suburb: Between 10-50% rural
   - Add/update demographic data for each county
   - Preserve existing vote data (`v`) and other properties
   - Write the updated data back to `counties/county_data.json`

## Output Format

After running the script, each county in `county_data.json` will have the following structure:

```json
"1001": {
    "n": "Autauga",
    "t": "Suburb",
    "p": 59759,
    "demographics": {
        "female": 0.514,
        "college": 0.613,
        "hs_grad": 0.895
    },
    "v": { "D": 26.66, "R": 71.93, "G": 0.0, "L": 0.11, "O": 1.29 },
    "undecided": 15.0
}
```

## FIPS Code Handling

The script automatically strips leading zeros from FIPS codes to ensure consistency:
- CSV: "01001" → JSON: "1001" (Alabama counties)
- CSV: "04013" → JSON: "4013" (Arizona counties)
- CSV: "06037" → JSON: "6037" (California counties)

This ensures that early alphabetical states (like Alabama, Arizona, Alaska) have consistent FIPS codes throughout the game.

## Verification

After running the script, verify the changes:

```bash
# Check a specific county
python3 -c "import json; data=json.load(open('counties/county_data.json')); print(json.dumps(data.get('4013'), indent=2))"

# Count counties with demographics
python3 -c "import json; data=json.load(open('counties/county_data.json')); print(f'Counties with demographics: {sum(1 for c in data.values() if \"demographics\" in c)}')"
```

## Troubleshooting

### CSV File Not Found
- Ensure the file is named exactly `analytic_data2025_v3.csv`
- Place it in the repository root directory (same level as this README)

### Missing Columns Error
- Verify your CSV has all required column headers with exact names (case-sensitive)
- Check for extra spaces in column names

### Invalid Value Errors
- Ensure numeric columns contain valid numbers
- Rural, female, and education percentages should be between 0.0 and 1.0
- Population should be a positive integer

## Testing

A sample CSV file (`analytic_data2025_v3_sample.csv`) is provided for testing:

```bash
# Test with sample data
python3 -c "
from transform_csv_to_json import transform_csv_to_json
from pathlib import Path
transform_csv_to_json(
    Path('analytic_data2025_v3_sample.csv'),
    Path('counties/county_data.json'),
    Path('counties/county_data_test.json')
)
"
```
