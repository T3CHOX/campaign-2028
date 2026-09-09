# Official voter-registration inputs

North Carolina is absent from `counties/national_active_inactive_by_county.csv`, so the county turnout-baseline builder uses the North Carolina State Board of Elections' election-day voter-statistics archives instead:

- `nc-voter-stats-2020.zip`: <https://s3.amazonaws.com/dl.ncsbe.gov/ENRS/2020_11_03/voter_stats_20201103.zip>
- `nc-voter-stats-2024.zip`: <https://s3.amazonaws.com/dl.ncsbe.gov/ENRS/2024_11_05/voter_stats_20241105.zip>

The source page describes these files as election-time voter-registration statistics, including active and inactive registrants by county: <https://www.ncsbe.gov/results-data/voter-registration-data>

`scripts/build-county-turnout-baselines.py` averages each county's 2020 and 2024 registration totals before calculating its baseline turnout.
