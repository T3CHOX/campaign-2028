# Copilot Instructions for Decision 2028

## Project Overview
Decision 2028 is an interactive political campaign simulator built with vanilla JavaScript, HTML, and CSS. Players select a political party and candidate, then manage their campaign to win the 2028 U.S. Presidential election through strategic state visits, ad spending, and rallying support.

## Technology Stack
- **Frontend**: Vanilla JavaScript (ES5/ES6), HTML5, CSS3
- **No frameworks**: Pure JavaScript without React, Vue, or Angular
- **Data**: CSV files for demographic and electoral data
- **SVG**: Interactive U.S. map for state/county visualization

## Architecture and File Organization

### Core JavaScript Modules (in `/js/`)
- `main.js` - Main entry point, game initialization and flow control
- `config.js` - Constants for parties, candidates, VPs, issues, and game settings
- `campaign.js` - Campaign actions (rallies, ads, visits) and resource management
- `election.js` - Vote calculation, electoral college, and election night simulation
- `states.js` - State-level data and electoral vote management
- `counties.js` - County-level data, FIPS code handling, and detailed demographics
- `ai.js` - AI opponent behavior and decision-making
- `turnout.js` - Voter turnout calculations and modeling
- `interestGroups.js` - Interest group support and influence
- `issues.js` - Issue position management
- `screens.js` - Screen navigation and UI state management
- `utils.js` - Utility functions and helper methods

### Data Files
- `analytic_data2025_v3.csv` - County-level electoral and demographic data
- `cc-est2024-agesex-all.csv` - Census population estimates
- `national_active_inactive_by_county.csv` - Voter registration data
- `counties/*.csv` - Individual state county data files

### Key HTML/CSS Files
- `index.html` - Main application structure with multiple screen sections
- `style.css` - All styling including responsive design and theming
- `map.svg` - Interactive U.S. map with state and county paths

## Important Concepts and Data Structures

### FIPS Codes
FIPS codes are **critical** for county identification. Always handle them correctly:
- State FIPS: 2 digits (e.g., "01" for Alabama, "06" for California)
- County FIPS: 5 digits (state + county, e.g., "01001" for Autauga County, AL)
- **Always pad FIPS codes** to proper length: `fips.padStart(5, '0')`
- Extract state FIPS: `fips.padStart(5, '0').substring(0, 2)`

### Party Codes
- `D` - Democratic Party (blue, #00AEF3)
- `R` - Republican Party (red, #E81B23)
- `F` - Forward Party (yellow, #F2C75C) - Third party with penalties
- `G` - Green Party (green, #198754) - Third party with severe penalties
- `L` - Libertarian Party (orange, #fd7e14) - Third party with severe penalties

### Game State
The global `gameData` object contains:
- `selectedParty` - Player's chosen party
- `playerTicket` - Player's presidential and VP candidates
- `demTicket`, `repTicket` - Opponent tickets
- `states` - State-level game data (margins, visits, ad spending, etc.)
- `currentWeek` - Game timeline (52 weeks total)
- `funds` - Available campaign funds
- `stamina` - Candidate energy for activities

### Electoral Mechanics
- **270 electoral votes needed to win**
- State margins calculated from county-level data
- County vote share determines state winner
- Interest group support affects turnout and margins
- Campaign actions (rallies, ads, visits) shift state margins

## Coding Conventions

### Naming
- Use camelCase for variables and functions: `gameData`, `calculateElectoralVotes()`
- Use SCREAMING_SNAKE_CASE for constants: `PARTIES`, `STATES`, `CANDIDATES`
- Prefix global/shared objects clearly: `gameData`, `STATES`, `Utils`

### Structure
- Keep functions focused and single-purpose
- Use descriptive variable names, especially for FIPS codes and state codes
- Group related functionality in appropriate module files
- Maintain separation between game logic, UI, and data

### Comments
- Use banner comments for major sections: `/* ==== SECTION ==== */`
- Comment complex algorithms, especially vote calculations
- Explain FIPS code manipulations clearly
- Document assumptions about data formats

### Data Handling
- Validate FIPS codes before use
- Check for null/undefined values in CSV data
- Handle missing or malformed data gracefully
- Log important data operations for debugging

## Common Patterns

### Screen Navigation
```javascript
app.goToScreen('screen-id'); // Managed by screens.js
```

### State Updates
```javascript
gameData.states[stateCode].visited = true;
gameData.states[stateCode].margin += 2;
Election.recalculateElectoralMap();
```

### County Operations
```javascript
var fips = countyFips.padStart(5, '0');
var stateFips = fips.substring(0, 2);
var county = gameData.counties[fips];
```

### Toast Notifications
```javascript
Utils.showToast("Message text", durationMs);
```

## Testing and Validation

### Manual Testing
- Test all campaign actions (rally, ads, visits) in multiple states
- Verify county interactions work in all states (especially AL-DE with FIPS < 10)
- Check electoral map updates correctly after actions
- Test all party selections and candidate combinations
- Validate election night progression and results

### Data Validation
- Verify FIPS codes are correctly formatted and padded
- Check state margins are calculated from county data
- Ensure interest group percentages sum correctly
- Validate CSV data loads without errors

### Browser Compatibility
- Test in modern browsers (Chrome, Firefox, Safari, Edge)
- Check responsive design on different screen sizes
- Verify SVG map interactions work consistently

## Known Issues and Gotchas

### FIPS Code Handling
The most common bug source is improper FIPS code handling. States with FIPS < 10 (AL, AK, AZ, AR, CA, CO, CT, DE) require special attention. Always pad before manipulating.

### Third Party Challenges
Third party campaigns (Forward, Green, Libertarian) have intentional difficulty modifiers. This is by design to simulate real-world third party challenges.

### State vs. County Margins
State margins should be calculated from county-level data, not stored independently. If updating county data, recalculate state margins.

### CSV Data Dependencies
The game depends on properly formatted CSV files. If adding or modifying data, maintain the expected column structure and data types.

## Best Practices for Contributors

1. **Always test FIPS code changes** across multiple states, especially those with FIPS < 10
2. **Preserve existing game balance** when modifying campaign mechanics
3. **Keep the UI responsive** - test on different screen sizes
4. **Maintain data integrity** - validate CSV changes don't break calculations
5. **Use existing utility functions** from `utils.js` rather than duplicating code
6. **Comment complex electoral calculations** - they're hard to debug later
7. **Test the full campaign flow** from party selection through election night
8. **Keep the codebase vanilla** - no external JavaScript frameworks

## Resources

- Electoral data sourced from census.gov and electoral databases
- FIPS codes follow U.S. Census Bureau standards
- State electoral votes reflect current allocations (as of 2020 Census)
- Interest group support percentages based on polling data and historical trends
