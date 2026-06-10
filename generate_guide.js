const fs = require('fs');

const content = fs.readFileSync('js/candidates.js', 'utf8');

// Extract using regex
let md = `# Candidate Guide

## How to Add New Candidates
To add a new candidate, add an object to the \`CANDIDATES\` or \`RUNNING_MATES\` array in \`js/candidates.js\`.

### Required Fields:
- **id**: Unique string identifier
- **name**: Display name
- **party**: Party code ("D", "R", "G", "L", "I", "PSL")
- **homeState**: 2-letter state code (e.g. "CA", "OH")
- **position**: (Optional) String representing their title or position
- **homeStateBoost**: Multiplier for home state advantage (usually ~1.5 - 2.5)
- **funds**: Starting funds in millions (Presidential candidates only)
- **img**: Path to image (e.g., "images/harris.jpg")
- **stamina**: Starting stamina out of 10 (Presidential candidates only)
- **desc**: Brief bio/description

### Effects and Mechanics:
- **buff**: String name of the candidate's primary positive trait.
- **debuff**: String name of the candidate's primary negative trait.
- **groupBoosts**: Object mapping interest group IDs to positive percentage boosts.
- **groupDebuffs**: Object mapping interest group IDs to negative percentage drops.
- **regionalSpillover**: Array of state codes where the candidate has extra influence.
- **regionalSpilloverBoost**: Multiplier applied to regional spillover states.

---
## Current Candidates and Effects
Baseline is generic Democrat vs. generic Republican with no specific impacts.

`;

fs.writeFileSync('CANDIDATE_GUIDE.md', md + content);
console.log('Done');
