# Official presidential results sources

These source workbooks were published by the Federal Election Commission and compile results certified by state election offices. `scripts/build-official-statewide.py` converts them into `counties/historical_statewide.json`; the browser loads that compact file and does not parse or aggregate these workbooks at runtime.

- `2000presge.xls`: https://www.fec.gov/documents/1612/2000presge.xls
- `2004pres.xls`: https://www.fec.gov/documents/1628/2004pres.xls
- `2008pres.xls`: https://www.fec.gov/documents/1661/2008pres.xls
- `2012pres.xls`: https://www.fec.gov/documents/1684/2012pres.xls
- `federalelections2016.xlsx`: https://www.fec.gov/documents/1890/federalelections2016.xlsx
- `federalelections2020.xlsx`: https://www.fec.gov/documents/4228/federalelections2020.xlsx
- `2024presgeresults.xlsx`: https://www.fec.gov/documents/5645/2024presgeresults.xlsx

Historical Maine and Nebraska congressional-district comparisons apply the simulator's current county and split-county assignments, then reconcile every candidate grouping to the official statewide total. They are therefore consistent current-boundary estimates rather than the districts that existed in each historical election.
