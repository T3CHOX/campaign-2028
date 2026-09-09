# Simulator overhaul progress

Owner confirmed implementation in this workspace, roughly 50 comprehensive issues, H-1B, and supplied 2019–2023 ACS B03001 county CSV.

## Completed
- Imported and reconciled the supplied Hispanic export and 15 complementary official ACS tables; verified 194,370 supplied values.
- Created 54 issues with seven described positions each and 71 detailed origin groups.
- Integrated issue profiles, bounded electorate accounting, attention/turnout effects and persistent national subgroup polls.
- Unified advertising and named opponent targets, including third parties.
- Added 3,143 county profiles and responsive, keyboard-accessible interfaces.
- Passed 26 model checks, syntax checks, reproducible data rebuild and browser review.

See `docs/SIMULATOR_OVERHAUL.md` for behavior, source provenance, validation, performance and modeling limitations.

## Confirmed constraints
- Preserve existing working tree changes.
- Resident counts are not eligible voters. Detailed voting-population allocations require labeled modeling assumptions.
- Polling uncertainty is separate from source ACS margins of error.
- County narratives distinguish factual indicators from modeled politics.
- The installed browser automation CLI is absent; use available in-app browser tools.

## Delegated interface work
Frontend-design skill requires an implementation agent. Its scope is js/overhaulUI.js and overhaul.css; engine/data/integration work remains with the root agent.
