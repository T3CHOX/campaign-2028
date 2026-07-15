# Context for Claude: Campaign 2028 Election Simulator

## Project Overview
You are acting as an expert game designer and data architect for "Campaign 2028," a highly detailed, browser-based US Presidential Election simulator. The game allows players to run political campaigns across the United States, managing funds, stamina, messaging, and ad buys at the county level. 

## Current Game Architecture
The game relies heavily on a static JSON file (`county_data.json`) that stores data for all 3,142 US counties. 
A typical county entry currently looks like this:
```json
"01001": {
  "n": "Autauga County",
  "s": "AL",
  "p": 60342,
  "t": "Mixed",
  "v": {"D": 26.7, "R": 72.06, "G": 0.84, "L": 0.4, "O": 0},
  "ig": {
    "rural": 40.68, "college": 61.38, "hispanic": 3.85, "black": 20.99, 
    "asian": 1.31, "pacific": 0.14, "native": 0.5, "progressive": 14.73, 
    "maga": 33.71, "libertarian": 7.01, "centrist": 44.54, 
    "evangelical": 40.82, "protestant": 7.6, "catholic": 1.63, 
    "christian": 1.33, "jewish": 0, "muslim": 0, "other_religion": 0.06, 
    "secular": 48.56, "union": 7.8
  },
  "centroidX": 703.32,
  "centroidY": 430.04,
  "regVoters": 43695,
  "turnoutBase": 0.647511
}
```
The game's engine (`js/persuasion.js`) uses the demographics inside the `"ig"` (interest groups) object to calculate how susceptible a county is to different campaign actions, ad themes, and candidate baseline buffs/debuffs.

## The New Data (The Task)
We have recently acquired a massive trove of new county-level data from the BEA and StatsAmerica, stored in a `temp/` directory. This includes:
1. **BEA Employment data** (Job growth, unemployment, industry mix)
2. **BEA Personal Income / Per Capita Income**
3. **Metrics for Development** (Violent crime rates, Poverty rates, Health insurance coverage, Manufacturing vs. Tech industry share)
4. **Population by Age and Sex** (Exact populations for 18-24, 25-44, 45-64, 65+)
5. **Social Context** (Indices for "Hopefulness", volunteerism, social capital)

## Proposed Implementation Plan
We want to use this data to make the game's mechanics—specifically **Issue Saliency** (how effective an ad about a specific issue is in a specific county) and a future **Primaries System**—incredibly deep and realistic.

Here is our current working proposal for how to map this data into the game:

1. **Population by Age & Sex:** 
   - Tie "Social Security" issue ads directly to the `% Population 65+`. 
   - Tie "Student Debt" issue ads to the `% Population 18-24`.
2. **Income & Employment:** 
   - Create an "Economic Anxiety" modifier. Counties with low per-capita income and high unemployment become highly elastic for populist/change candidates.
   - High-income counties favor establishment candidates and status-quo economic policies.
3. **Metrics for Development:** 
   - "Tough on Crime" ads scale in effectiveness based on the county's actual violent crime rate.
   - "Healthcare" ads scale based on the county's uninsured rate.
   - "Bring back factories" ads scale based on the local manufacturing employment share.
4. **Social Context:** 
   - Use "Hopefulness" and social capital to determine baseline turnout elasticity. High social capital = high, inelastic turnout (wealthy suburbs). Low hopefulness = low baseline turnout, but highly susceptible to populist turnout spikes.

## Your Goal
Please review the proposed implementation plan above. 
1. **Refine and Expand:** Do you see better ways to utilize this data? Are there specific gameplay mechanics, formulas, or issue mappings you would add to make the simulation more immersive?
2. **Primaries Application:** How would you specifically use this data to differentiate candidate lanes in a primary election (e.g., distinguishing an establishment moderate from a populist insurgent)?
3. **Data Pipeline:** We plan to write a Node.js script to compile this raw CSV data down into lightweight modifiers that get appended directly into the `county_data.json` file. Let us know if you foresee any issues with this approach or have recommendations for data normalization.
