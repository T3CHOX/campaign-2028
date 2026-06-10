# Decision 2028: Comprehensive Candidate Guide

## Overview
This guide provides detailed instructions for adding new candidates, managing their effects, and understanding the candidate system in Decision 2028.

## Table of Contents
1. [Adding New Candidates](#adding-new-candidates)
2. [Candidate Object Structure](#candidate-object-structure)
3. [Effect System](#effect-system)
4. [Buff/Debuff Effects](#buffdebuff-effects)
5. [Interest Group Mechanics](#interest-group-mechanics)
6. [Regional Spillover](#regional-spillover)
7. [Effect Value Guidelines](#effect-value-guidelines)
8. [Current Candidate Effects Reference](#current-candidate-effects-reference)

---

## Adding New Candidates

### Step 1: Define the Candidate Object
Add a new object to the `CANDIDATES` array in `js/candidates.js`:

```javascript
{
    id: "unique_id",
    name: "Full Name",
    party: "D",  // D, R, G, L, PSL, or I
    homeState: "CA",
    position: "Political Title and Years (if applicable)",
    homeStateBoost: 2.0,
    funds: 75,
    img: "images/candidate.jpg",
    stamina: 8,
    desc: "Detailed candidate description...",
    buff: "Primary Strength Name",
    debuff: "Primary Weakness Name",
    groupBoosts: { group_id: 5, group_id2: 3 },
    groupDebuffs: { group_id3: -4, group_id4: -3 },
    regionalSpillover: ["STATE", "STATE"],
    regionalSpilloverBoost: 1.2,
}
```

### Step 2: Add Issue Positions
Add issue positions to `CANDIDATE_POSITIONS` object at the end of `candidates.js`:

```javascript
your_candidate_id: {
    guns: -3, abortion: -5, healthcare: -4, immigration: -2, climate: -4,
    taxation: -2, trade: 0, minwage: -3, labor: -3, lgbtq: -4,
    criminal: -2, drugpricing: -4, energy: -3, foreign: -1, military: 0,
    israel: 0, govspend: -2, electionreform: -3, scotus: -3, economy: -2
}
```

**Scale**: -10 (far left) to +10 (far right)

### Step 3: Add Running Mate (VP) if applicable
Add to the `VPS` array in `candidates.js`:

```javascript
{
    id: "vp_unique_id",
    name: "Running Mate Name",
    party: "D",
    state: "CA",
    homeState: "CA",
    position: "Current Position Title",
    funds: 12,
    img: "images/vp.jpg",
    stamina: 7,
    desc: "VP-specific description...",
    buff: "VP Strength",
    debuff: "VP Weakness",
    groupBoosts: { group_id: 2, group_id2: 3 },
    groupDebuffs: { group_id3: -2 }
}
```

---

## Candidate Object Structure

### Required Fields

| Field | Type | Range | Description |
|-------|------|-------|-------------|
| `id` | string | - | Unique identifier (lowercase, no spaces) |
| `name` | string | - | Full name of candidate |
| `party` | string | D/R/G/L/PSL/I | Political party affiliation |
| `homeState` | string | 2-letter code | Home state for bonus |
| `position` | string | - | Current/former political title |
| `homeStateBoost` | number | 1.0-3.5 | Multiplier for home state margins |
| `funds` | number | 0-100+ | Starting campaign funds in millions |
| `img` | string | path | Image path for candidate photo |
| `stamina` | number | 1-10 | Candidate energy/endurance for activities |
| `desc` | string | - | Extended candidate description |
| `buff` | string | - | Primary candidate strength/advantage |
| `debuff` | string | - | Primary candidate weakness/disadvantage |

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `groupBoosts` | object | Interest groups candidate appeals to |
| `groupDebuffs` | object | Interest groups candidate struggles with |
| `regionalSpillover` | array | States that receive spillover effects |
| `regionalSpilloverBoost` | number | Strength of spillover effect (1.0-1.5 typical) |

---

## Effect System

### The Four Effect Types

1. **Buff**: Primary candidate strength (e.g., "Donor Magnet")
2. **Debuff**: Primary candidate weakness (e.g., "General-Election Ceiling")
3. **Group Boosts**: Positive effects on specific interest groups
4. **Group Debuffs**: Negative effects on specific interest groups

### How Effects Work

- **Buffs/Debuffs**: Thematic labels that appear on candidate cards; primarily used for narrative/gameplay context
- **Group Effects**: Directly modify voting behavior and margins:
  - Positive values increase that group's margin/enthusiasm for the candidate
  - Negative values decrease the group's support
  - Values range from -10 (severe disadvantage) to +10 (exceptional advantage)

---

## Buff/Debuff Effects

These are narrative strengths and weaknesses that reflect the candidate's unique political position.

### Buff Examples

- "Donor Magnet": Excellent fundraising appeal
- "Blue Wall Anchor": Strong in Midwest industrial states
- "Media Combatant": Aggressive, effective media performer
- "Youth Engine": Exceptional appeal to younger voters
- "Sun Belt Credibility": Strong appeal in Sun Belt swing states
- "Tech-Left Blend": Appeals to progressive tech community
- "Institutional Muscle": Strong establishment/party support
- "Media Reach": Celebrity/media prominence
- "Red-State Crossover": Can win votes in Republican areas
- "Urban Coalition": Builds broad urban/metropolitan support
- "Keystone Anchor": Strong Pennsylvania base

### Debuff Examples

- "General-Election Ceiling": Limited appeal beyond base
- "Heartland Liability": Weak in Midwest/rural areas
- "Low-Voltage Base": Doesn't energize party base
- "Working-Class Gap": Struggles with non-college voters
- "Swing Voter Repellent": Alienates persuadable voters
- "Rust Belt Doubt": Regional credibility issues
- "Base Friction": Party base enthusiasm problems
- "No Governing Record": Lacks executive/legislative experience
- "National Ceiling": Limited national appeal
- "Execution Questions": Operational/competence concerns
- "Soft National Brand": Less recognized nationally
- "Fatigue Ceiling": Voter fatigue/saturation
- "Trust Deficit": Personal credibility issues
- "Momentum Loss": Lost political momentum
- "Muted Fire": Lacks emotional/energizing appeal

---

## Interest Group Mechanics

### Available Interest Groups

Democratic-leaning groups:
- `black` - Black voters
- `hispanic` - Hispanic/Latino voters
- `asian` - Asian American voters
- `youth` - Voters aged 18-34
- `suburban_college` - Suburban college-educated voters
- `urban` - Urban/metropolitan voters
- `progressive_left` - Progressive/progressive left wing
- `lgbtq` - LGBTQ+ community
- `union` - Labor union members
- `suburban_women` - Suburban women voters
- `jewish` - Jewish voters
- `secular` - Secular/non-religious voters

Republican-leaning groups:
- `evangelical` - Evangelical Christian voters
- `noncollege` - Non-college educated voters
- `rural` - Rural voters
- `suburban_conservative` - Suburban conservative voters
- `donor_conservative` - Conservative donor class
- `catholic` - Catholic voters
- `veterans` - Military veterans
- `bluecollar` - Blue-collar/working-class voters

Swing/Independent groups:
- `suburban_moderates` - Suburban moderate voters
- `independents` - Independent/swing voters
- `high_info_swing` - High-information swing voters

### Effect Value Scale

For each interest group's boost/debuff value:

- **+10**: Exceptional appeal - among best in field
- **+8-9**: Strong appeal - clear advantage
- **+6-7**: Moderate appeal - noticeable positive effect
- **+3-5**: Mild appeal - small positive effect
- **+1-2**: Minimal appeal - barely noticeable
- **0**: Neutral - no effect
- **-1-2**: Mild disadvantage - barely noticeable
- **-3-5**: Moderate disadvantage - noticeable negative effect
- **-6-7**: Strong disadvantage - clear problem
- **-8-10**: Severe disadvantage - major liability

### Example: Harris

```javascript
groupBoosts: { black: 9, asian: 7, suburban_college: 7 },
groupDebuffs: { noncollege: -4, rural: -5 }
```

**Interpretation**:
- +9 with Black voters: Exceptional appeal to Black Americans
- +7 with Asian Americans: Strong appeal
- +7 with suburban college-educated: Strong appeal to educated suburbs
- -4 with non-college voters: Moderate weakness among working-class
- -5 with rural voters: Strong weakness in rural America

---

## Regional Spillover

### Purpose
Candidates with strong bases in specific regions can gain bonus effects in neighboring or culturally similar states.

### How It Works

```javascript
regionalSpillover: ["NV", "AZ"],
regionalSpilloverBoost: 1.2,
```

- Candidate gains `regionalSpilloverBoost` multiplier in spillover states
- Typical boost values: 0.7 to 1.5
- Should reflect geographic/political proximity

### Examples

- **California candidate** → spillover to NV, OR, HI (west coast)
- **Texas candidate** → spillover to OK, LA (south/southwest)
- **Michigan candidate** → spillover to WI, PA, OH (Great Lakes/Midwest)
- **Florida candidate** → spillover to GA, NC (southeast)

---

## Effect Value Guidelines

### Home State Boost

The home state bonus represents how much that state favors a hometown candidate:

- **1.2-1.4**: Minimal home-state advantage (candidate is less locally known)
- **1.5-1.8**: Standard home-state advantage
- **1.9-2.4**: Strong home-state advantage (well-established governor/senator)
- **2.5-3.5**: Exceptional home-state advantage (beloved governor or strong political machine)

**Baseline**: Generic D vs. R candidate = 1.0 (no home-state bonus)

### Interest Group Effect Baseline

**Baseline**: Generic D vs. R candidate
- Democratic candidates: slight negative with evangelical (-1), rural (-2), noncollege (-1)
- Republican candidates: slight negative with black (-1), youth (-1), progressive_left (-2)
- All candidates: slight positive with co-partisan groups

### What +5 with [Group] Actually Means

The effect values represent **vote share swings**, not absolute percentages:

- **+5 with Latino voters**: In a county with 30% Latino population, expect ~2-2.5 percentage point swing toward candidate
- **-4 with rural voters**: In a county with 40% rural population, expect ~1.6 percentage point swing away from candidate

These effects compound with turnout multipliers and issue alignment bonuses.

---

## Current Candidate Effects Reference

### Democratic Candidates Summary

| Name | Home State | Boost | Debuff | Top Boosts | Top Debuffs |
|------|-----------|-------|--------|-----------|-----------|
| Kamala Harris | CA | 2.3 | General-Election Ceiling | black(+9), asian(+7), suburban_college(+7) | rural(-5), noncollege(-4) |
| Gavin Newsom | CA | 2.0 | Heartland Liability | urban(+8), tech(+8), lgbtq(+7) | rural(-6), evangelical(-5) |
| Gretchen Whitmer | MI | 3.1 | Low-Voltage Base | union(+8), suburban_women(+8), midwest_noncollege(+6) | progressive_left(-3), rural(-4) |
| Pete Buttigieg | IN | 1.4 | Working-Class Gap | suburban_college(+8), lgbtq(+9), urban(+7) | rural(-6), noncollege(-4) |
| AOC | NY | 1.6 | Swing Voter Repellent | youth(+10), hispanic(+9), progressive_left(+9) | evangelical(-7), noncollege(-6) |
| Mark Kelly | AZ | 2.8 | Muted Fire | veterans(+8), suburban_moderates(+7), latino(+6) | progressive_left(-3), evangelical(-4) |
| Ro Khanna | CA | 1.4 | Rust Belt Doubt | tech(+9), asian(+7), progressive_left(+8) | rural(-5), noncollege(-4) |
| Rahm Emanuel | IL | 1.7 | Base Friction | suburban_moderates(+7), business_community(+8), jewish(+6) | progressive_left(-7), youth(-4) |
| Josh Shapiro | PA | 3.4 | Soft National Brand | suburban_college(+8), jewish(+7), moderate_dems(+7) | youth(-3), progressive_left(-3) |
| Andy Beshear | KY | 2.4 | National Ceiling | rural_whites(+7), moderate_dems(+8), union(+6) | progressive_left(-4), youth(-3) |
| Cory Booker | NJ | 1.9 | Execution Questions | black(+8), urban(+8), suburban_moderates(+6) | noncollege(-3), progressive_left(-3) |

### Republican Candidates Summary

| Name | Home State | Boost | Debuff | Top Boosts | Top Debuffs |
|------|-----------|-------|--------|-----------|-----------|
| Donald Trump | FL | 1.8 | Fatigue Ceiling | noncollege(+10), evangelical(+10), rural(+10) | suburban_college(-7), youth(-6) |
| JD Vance | OH | 2.4 | Trust Deficit | noncollege(+9), rural(+9), evangelical(+8) | suburban_college(-5), youth(-4) |
| Ron DeSantis | FL | 2.6 | Momentum Loss | evangelical(+8), suburban_conservative(+7), noncollege(+7) | youth(-5), college_liberals(-6) |
| Ted Cruz | TX | 2.2 | General-Election Baggage | evangelical(+9), noncollege(+8), donor_conservative(+8) | suburban_college(-7), latino(-3) |
| Rand Paul | KY | 1.9 | Republican Base Skepticism | libertarian(+8), donors(+7), noncollege(+6) | evangelical(-5), rural(-4) |
| Nikki Haley | SC | 1.6 | Base Doubt | suburban_college(+5), suburban_moderates(+6), asian(+3) | evangelical(-4), noncollege(-5) |
| Vivek Ramaswamy | OH | 1.7 | Establishment Skepticism | youth(+6), asian(+7), noncollege(+5) | evangelical(-3), rural(-4) |
| Josh Hawley | MO | 2.1 | Moderate Distance | noncollege(+7), rural(+6), bluecollar(+7) | suburban_moderates(-4), donors(-3) |
| Marco Rubio | FL | 2.2 | Conservative Skepticism | hispanic(+7), evangelical(+5), donor_conservative(+6) | noncollege(-4), populist_right(-3) |

---

## Effect Value Philosophy

### Baseline Candidates

To maintain game balance, define your "baseline" candidates:
- **Democrats**: Generic center-left candidate (no major boosts/debuffs)
- **Republicans**: Generic center-right candidate (no major boosts/debuffs)

All other candidates are positioned relative to this baseline.

### Balance Principles

1. **No Perfect Candidates**: Every candidate should have at least one meaningful debuff
2. **Trade-offs**: Strong boosts in one area typically mean moderate debuffs elsewhere
3. **Coalition Building**: Different candidates appeal to different coalitions
4. **Realism**: Effect values should reflect actual political dynamics
5. **Distinctiveness**: Each candidate should have a unique political profile

### Validation

When adding/modifying candidates:
- [ ] Verify total boosts don't exceed 30 points across all groups
- [ ] Verify total debuffs don't exceed -20 points across all groups
- [ ] Ensure at least 3-4 strong support groups per candidate
- [ ] Ensure at least 2-3 weak support groups per candidate
- [ ] Test with game mechanics to ensure playable/believable

---

## Technical Notes

### File Locations
- Presidential candidates: `js/candidates.js` - `CANDIDATES` array
- VP candidates: `js/candidates.js` - `VPS` array
- Issue positions: `js/candidates.js` - `CANDIDATE_POSITIONS` object
- Screen rendering: `js/screens.js` - `_buildCandidateTile()` method
- Election calculations: `js/election.js`, `js/counties.js`

### Data Flow
1. Candidate selected on `party-page-screen`
2. Game state updated in `gameData`
3. Election calculations use candidate's effects
4. County votes calculated with `groupBoosts`/`groupDebuffs` multipliers
5. Final vote totals displayed on election night

---

## Quick Reference: Adding a New Candidate

1. Add object to `CANDIDATES` or `VPS` array
2. Add issue positions to `CANDIDATE_POSITIONS` 
3. Validate syntax: `node --check js/candidates.js`
4. Test in game (party selection → candidate selection)
5. Verify effects appear and vote calculations work

---

## Questions & Troubleshooting

**Q: Why is my candidate not appearing in the election?**
- Ensure candidate ID is in `CANDIDATES` array
- Verify party code is valid (D, R, G, L, PSL, I)
- Check for JavaScript syntax errors: `node --check js/candidates.js`

**Q: How do I test my new candidate?**
- Start game, select the candidate's party
- Choose the candidate as presidential nominee
- Run a campaign and check election results
- Verify interest group effects are working correctly

**Q: Why are vote percentages not matching expectations?**
- Verify `groupBoosts`/`groupDebuffs` values are reasonable
- Check that issue positions are on correct -10 to +10 scale
- Ensure home state boost matches candidate's local strength
- Verify turnout modifiers are properly applied

---

## References

- Interest group definitions: See `js/interestGroups.js`
- Election logic: See `js/election.js` and `js/counties.js`
- Vote calculations: See `Counties.getCountyVoteTotals()`
- Turnout system: See `js/turnout.js`
