# Decision 2028 — Master Implementation Spec (v3)
### Full Design Document for Development

> **Purpose**: This document is the single source of truth for implementing all new and revised systems. It is written to be handed directly to a developer. Every mechanic is fully defined with data schemas, math, UI instructions, and integration notes. Where a system was partially defined in v2, this document supersedes it.

---

## Table of Contents

1. [Faction System](#1-faction-system)
2. [Candidate & VP Selection UI Overhaul](#2-candidate--vp-selection-ui-overhaul)
3. [Endorser System](#3-endorser-system)
4. [Television Ads — Media Market System](#4-television-ads--media-market-system)
5. [Digital Ads — Surgical Targeting System](#5-digital-ads--surgical-targeting-system)
6. [Rally System — County-Level with Centroid Spillover](#6-rally-system--county-level-with-centroid-spillover)
7. [Undecided Voter Model](#7-undecided-voter-model)
8. [Action System Integration & UI](#8-action-system-integration--ui)
9. [Data Schemas Reference](#9-data-schemas-reference)

---

## 1. Faction System

### 1.1 Overview

Every candidate (presidential and VP) belongs to a **Faction** — a political identity that is more granular and meaningful than party label. Factions determine:
- Which endorsers will/won't support them
- Which demographic groups they get bonuses or penalties with
- How digital ads behave (compatibility check)
- Which PAC money they can accept without penalty
- Their narrative flavor in news events

Factions are **permanent** — they cannot be changed during gameplay. The player's faction is set when they pick their candidate.

---

### 1.2 Faction Definitions

Nine factions exist across the political spectrum. Each has a unique emblem (uploaded by you, see Section 2).

```javascript
// factions.js
const FACTIONS = {

  // ── DEMOCRATIC PARTY ──────────────────────────────────────────

  activist_left: {
    id: 'activist_left',
    label: 'The Activist Left',
    party: 'D',
    emblemFile: 'faction_activist_left.png',
    description: 'Progressive movement politics. Prioritizes systemic change over electoral pragmatism.',
    ideologicalPosition: -8,           // -10 to +10 scale; far-left
    groupBonuses: {                    // multiplier on group persuasion/turnout effects
      progressive: 1.5,
      gen_z: 1.4,
      african_american: 1.2,
      muslim: 1.3,
      union_worker: 1.1,
    },
    groupPenalties: {
      centrist: 0.5,
      suburban_women: 0.7,
      small_business: 0.4,
      catholic: 0.7,
    },
    pacCompatibility: ['progressive_pac', 'climate_pac', 'labor_pac'],
    pacIncompatibility: ['wall_street_pac', 'defense_pac', 'business_pac'],
    endorserCompatibility: ['labor_unions', 'progressive_orgs', 'environmental_groups'],
    endorserIncompatibility: ['chamber_of_commerce', 'nra', 'aipac'],
    rallyDemographicBonus: ['progressive', 'gen_z', 'african_american'],
    digitalBackfireRisk: 0.10,         // base chance ad backfires if targeting incompatible group
  },

  mainstream_liberal: {
    id: 'mainstream_liberal',
    label: 'Mainstream Liberal',
    party: 'D',
    emblemFile: 'faction_mainstream_liberal.png',
    description: 'The institutional center-left. Wins primaries, governs from the middle-left.',
    ideologicalPosition: -4,
    groupBonuses: {
      college_educated: 1.3,
      suburban_women: 1.3,
      african_american: 1.2,
      jewish: 1.2,
      union_worker: 1.1,
    },
    groupPenalties: {
      progressive: 0.75,
      maga: 0.1,
      rural: 0.6,
      evangelical: 0.5,
    },
    pacCompatibility: ['progressive_pac', 'labor_pac', 'wall_street_pac', 'environmental_pac'],
    pacIncompatibility: ['nra', 'religious_right_pac'],
    endorserCompatibility: ['democratic_governors', 'mainstream_unions', 'newspapers', 'aipac'],
    endorserIncompatibility: ['nra', 'heritage_foundation'],
    rallyDemographicBonus: ['college_educated', 'suburban_women', 'african_american'],
    digitalBackfireRisk: 0.06,
  },

  pragmatic_moderate: {
    id: 'pragmatic_moderate',
    label: 'Pragmatic Moderate',
    party: 'D',
    emblemFile: 'faction_pragmatic_moderate.png',
    description: 'A deal-maker who appeals across the aisle. Sacrifices base enthusiasm for crossover votes.',
    ideologicalPosition: -1,
    groupBonuses: {
      centrist: 1.5,
      suburban_women: 1.3,
      moderate_republican: 1.4,
      small_business: 1.1,
      senior: 1.2,
    },
    groupPenalties: {
      progressive: 0.5,
      activist_left_voters: 0.4,
      gen_z: 0.75,
    },
    pacCompatibility: ['wall_street_pac', 'business_pac', 'labor_pac', 'bipartisan_pac'],
    pacIncompatibility: ['progressive_pac', 'religious_right_pac', 'nra'],
    endorserCompatibility: ['moderate_democratic_senators', 'business_council', 'newspapers', 'republican_crossovers'],
    endorserIncompatibility: ['progressive_orgs', 'nra', 'maga_media'],
    rallyDemographicBonus: ['centrist', 'suburban_women', 'moderate_republican'],
    digitalBackfireRisk: 0.08,
  },

  outsider_leftist: {
    id: 'outsider_leftist',
    label: 'Outsider Leftist',
    party: 'D',        // can also run as I or G
    emblemFile: 'faction_outsider_leftist.png',
    description: 'Anti-establishment populist from the left. Energizes the disengaged but alienates the party machinery.',
    ideologicalPosition: -7,
    groupBonuses: {
      progressive: 1.6,
      gen_z: 1.5,
      union_worker: 1.4,
      non_college_dem: 1.2,
      muslim: 1.2,
    },
    groupPenalties: {
      centrist: 0.4,
      college_educated: 0.8,       // splits educated voters
      suburban_women: 0.65,
      mainstream_liberal_voters: 0.6,
    },
    // This faction generates the highest inactive voter pool activation
    inactiveVoterBoost: 0.08,       // added to populist boost in turnout engine
    pacCompatibility: ['labor_pac', 'progressive_pac'],
    pacIncompatibility: ['wall_street_pac', 'defense_pac', 'business_pac', 'aipac'],
    endorserCompatibility: ['progressive_orgs', 'labor_unions', 'alt_media'],
    endorserIncompatibility: ['chamber_of_commerce', 'aipac', 'democratic_establishment'],
    rallyDemographicBonus: ['progressive', 'gen_z', 'union_worker'],
    digitalBackfireRisk: 0.12,
  },

  // ── INDEPENDENT ────────────────────────────────────────────────

  unaligned_center: {
    id: 'unaligned_center',
    label: 'Unaligned Center',
    party: 'I',
    emblemFile: 'faction_unaligned_center.png',
    description: 'No party allegiance. Appeals broadly but carries no party infrastructure.',
    ideologicalPosition: 0,
    groupBonuses: {
      centrist: 1.6,
      moderate_republican: 1.3,
      suburban_women: 1.2,
      non_college_dem: 1.1,
    },
    groupPenalties: {
      progressive: 0.6,
      maga: 0.4,
      evangelical: 0.5,
    },
    // Third-party structural rules apply (ballot access, debate threshold)
    pacCompatibility: ['bipartisan_pac', 'business_pac'],
    pacIncompatibility: ['progressive_pac', 'religious_right_pac', 'nra'],
    endorserCompatibility: ['independent_media', 'business_council', 'republican_crossovers', 'moderate_democratic_senators'],
    endorserIncompatibility: ['progressive_orgs', 'nra', 'labor_unions'],
    rallyDemographicBonus: ['centrist', 'moderate_republican', 'suburban_women'],
    digitalBackfireRisk: 0.07,
  },

  // ── REPUBLICAN PARTY ───────────────────────────────────────────

  compassionate_conservative: {
    id: 'compassionate_conservative',
    label: 'Compassionate Conservative',
    party: 'R',
    emblemFile: 'faction_compassionate_conservative.png',
    description: 'The pre-2016 Republican: faith-driven, fiscally conservative, internationally engaged.',
    ideologicalPosition: +4,
    groupBonuses: {
      evangelical: 1.3,
      suburban_women: 1.2,
      catholic: 1.3,
      small_business: 1.2,
      moderate_republican: 1.3,
    },
    groupPenalties: {
      maga: 0.6,
      populist_right_voters: 0.65,
      progressive: 0.2,
    },
    pacCompatibility: ['business_pac', 'defense_pac', 'religious_right_pac', 'wall_street_pac'],
    pacIncompatibility: ['nra', 'maga_pac', 'progressive_pac'],
    endorserCompatibility: ['republican_governors', 'chamber_of_commerce', 'mainstream_conservative_media', 'aipac'],
    endorserIncompatibility: ['maga_media', 'progressive_orgs', 'labor_unions'],
    rallyDemographicBonus: ['evangelical', 'suburban_women', 'catholic'],
    digitalBackfireRisk: 0.07,
  },

  religious_right: {
    id: 'religious_right',
    label: 'The Religious Right',
    party: 'R',
    emblemFile: 'faction_religious_right.png',
    description: 'Social conservatism as the core identity. Mobilizes evangelicals but loses suburbs.',
    ideologicalPosition: +7,
    groupBonuses: {
      evangelical: 1.7,
      catholic: 1.4,
      rural: 1.2,
      senior: 1.2,
    },
    groupPenalties: {
      suburban_women: 0.55,
      gen_z: 0.35,
      college_educated: 0.6,
      lgbtq_allies: 0.2,
    },
    pacCompatibility: ['religious_right_pac', 'defense_pac', 'nra'],
    pacIncompatibility: ['wall_street_pac', 'progressive_pac', 'business_pac'],
    endorserCompatibility: ['evangelical_leaders', 'catholic_bishops_political', 'nra', 'heritage_foundation'],
    endorserIncompatibility: ['labor_unions', 'mainstream_newspapers', 'lgbtq_orgs'],
    rallyDemographicBonus: ['evangelical', 'catholic', 'rural'],
    digitalBackfireRisk: 0.10,
  },

  populist_right: {
    id: 'populist_right',
    label: 'The Populist Right',
    party: 'R',
    emblemFile: 'faction_populist_right.png',
    description: 'Economic nationalism, anti-globalism, immigration restriction. Wins the Rust Belt.',
    ideologicalPosition: +6,
    groupBonuses: {
      non_college: 1.5,
      rural: 1.4,
      union_worker: 1.2,     // cross-pressure with D union voters
      maga: 1.2,
      senior: 1.1,
    },
    groupPenalties: {
      college_educated: 0.65,
      suburban_women: 0.7,
      african_american: 0.4,
      hispanic: 0.7,
    },
    inactiveVoterBoost: 0.06,
    pacCompatibility: ['nra', 'populist_pac', 'energy_pac'],
    pacIncompatibility: ['wall_street_pac', 'progressive_pac', 'chamber_of_commerce'],
    endorserCompatibility: ['populist_media', 'nra', 'trade_unions_rust_belt'],
    endorserIncompatibility: ['chamber_of_commerce', 'mainstream_newspapers', 'progressive_orgs'],
    rallyDemographicBonus: ['non_college', 'rural', 'union_worker'],
    digitalBackfireRisk: 0.09,
  },

  maga_core: {
    id: 'maga_core',
    label: "'MAGA' Core",
    party: 'R',
    emblemFile: 'faction_maga_core.png',
    description: 'The movement. Maximum base activation, maximum polarization. Win big or lose big.',
    ideologicalPosition: +9,
    groupBonuses: {
      maga: 2.0,
      non_college: 1.6,
      rural: 1.5,
      evangelical: 1.4,
    },
    groupPenalties: {
      college_educated: 0.5,
      suburban_women: 0.45,
      african_american: 0.3,
      moderate_republican: 0.5,
      centrist: 0.35,
    },
    inactiveVoterBoost: 0.10,
    pacCompatibility: ['maga_pac', 'nra', 'populist_pac'],
    pacIncompatibility: ['wall_street_pac', 'chamber_of_commerce', 'progressive_pac'],
    endorserCompatibility: ['maga_media', 'nra', 'populist_governors'],
    endorserIncompatibility: ['mainstream_newspapers', 'chamber_of_commerce', 'aipac', 'labor_unions'],
    rallyDemographicBonus: ['maga', 'non_college', 'rural'],
    digitalBackfireRisk: 0.14,         // highest risk — very polarizing targeting
  },
};
```

---

### 1.3 Faction Compatibility Check (Used Everywhere)

A central utility function `getFactionCompatibility(factionId, targetGroupId)` returns one of three values used by ads, endorsers, and rallies:

```javascript
function getFactionCompatibility(factionId, targetGroupId) {
  const faction = FACTIONS[factionId];
  if (faction.groupBonuses[targetGroupId])  return 'compatible';
  if (faction.groupPenalties[targetGroupId]) return 'incompatible';
  return 'neutral';
}
```

This is called during:
- Digital ad targeting (Section 5) — determines backfire risk
- Endorser lobbying (Section 3) — determines who will/won't endorse
- Rally outcome calculation (Section 6) — determines which groups show up strongly
- PAC fundraising — determines issue lock severity

---

### 1.4 VP Faction Cross-Pressures

When a VP is selected, their faction interacts with the presidential candidate's faction. Applied once at `startGame()`:

| Condition | Effect |
| :--- | :--- |
| P and VP factions are in the same party AND ideologicalPosition within 3 points | +0.05 coalition loyalty across both factions' primary groups |
| P and VP factions are in the same party but ideologicalPosition > 5 points apart | The faction with fewer primary group bonuses loses 10% of its bonus effect (ticket tension) |
| VP faction has `endorserCompatibility` overlapping P's `endorserIncompatibility` | That endorser category is **blocked** for the ticket — they will not endorse regardless of lobbying |
| VP faction `groupBonuses` covers a group where P faction has `groupPenalties` | The penalty for that group is reduced by 50% (VP offsets the presidential drag) |

---

## 2. Candidate & VP Selection UI Overhaul

### 2.1 Replace Party Logo with Faction Emblem

**Current behavior**: Party logo (D/R/etc.) displayed on candidate card and VP card.  
**New behavior**: Faction emblem image displayed instead.

**Implementation**:
- Each candidate object in `candidates.js` gets a `factionId` field (string key into `FACTIONS`).
- At render time, look up `FACTIONS[candidate.factionId].emblemFile` and use that as the `<img src>` on the card.
- Emblem images are stored in `/assets/factions/` directory.
- The party label (D/R/I/G/L) still appears as a small text badge below the emblem — don't remove it entirely, just demote it visually.

**Card Layout** (updated):
```
┌─────────────────────────┐
│  [FACTION EMBLEM IMG]   │  ← 80×80px image, centered
│  Candidate Name         │
│  ● [Party Badge]        │  ← small, bottom-left of name
│  Faction: "MAGA Core"   │  ← faction label in italic
│  Home State | Stamina   │
│  Charisma | Debate Skill│
└─────────────────────────┘
```

**Faction Tooltip**: Hovering the faction emblem shows a tooltip with the faction `description` and a mini list of top `groupBonuses` and top `groupPenalties`. This gives the player information without cluttering the card.

### 2.2 Faction Filter on Selection Screen

Add a **filter bar** above the candidate grid:
- Buttons: `All` | `Activist Left` | `Mainstream Liberal` | `Pragmatic Moderate` | `Outsider Leftist` | `Unaligned Center` | `Compassionate Conservative` | `Religious Right` | `Populist Right` | `MAGA Core`
- Clicking a faction button filters the visible candidates to only that faction.
- Party tab (D / R / I / G / PSL) still exists as the primary filter level; faction filter is secondary within a party.

### 2.3 VP Faction Synergy Preview

When a VP is selected (or hovered), display a **Faction Synergy Panel** showing:
- VP's faction emblem + label
- Ticket ideological spread (P position vs VP position on the -10 to +10 scale, shown as a simple bar)
- Any active cross-pressures from Section 1.4, listed as green (bonus) or red (penalty) pills
- Blocked endorser categories (if any)

This is purely informational — the player can still pick any VP regardless of synergy. It just makes the tradeoffs visible.

---

## 3. Endorser System

### 3.1 Overview

Endorsers are named entities — political figures, organizations, and media institutions — who can publicly back a candidate. Each endorser has:
- A **default endorsement state** at game start (who they back automatically, if anyone)
- A **set of effects** (turnout, group loyalty, funds) they bring when endorsing
- **Faction compatibility rules** that determine who can win them
- A **lobbying cost** to actively pursue them

### 3.2 Endorser Data Schema

```javascript
// endorsers.js
{
  id: 'gov_michigan',
  name: 'Michigan Governor',
  type: 'governor',           // governor | senator | union | media | celebrity | org | religious | military
  state: 'MI',                // null if national
  defaultEndorsement: 'D',    // party that gets them at game start; null if open
  // Effects when actively endorsing a candidate:
  effects: {
    turnoutBoost: { state: 'MI', value: 0.025 },     // statewide turnout lift
    groupLoyalty: { group: 'union_worker', value: 0.06 },
    fundsUnlock: 0,            // one-time funds generated on endorsement
    surrogateActions: 1,       // free surrogate actions in their state per week while endorsed
  },
  lobbyingCost: 1,             // action points to lobby (always 1 for now)
  lobbyingFundsCost: 0.5,      // millions spent lobbying (on top of AP)
  factionRequired: null,       // if set, only this faction can ever get this endorsement
  factionBlocked: ['maga_core', 'outsider_leftist'],  // factions that can NEVER get this endorsement
  retractConditions: {
    // If the endorsed candidate takes these positions, the endorser walks
    issueThresholds: { immigration: 8 },   // issue id: position value that triggers retraction
    factionIncompatibleWith: ['maga_core'],
  },
  openAfterRetraction: true,   // can opponent or 3rd party then poach this endorser?
  poachableby: ['D', 'G', 'PSL'],  // which parties can poach after retraction
}
```

### 3.3 Endorser Categories & National Roster

Define the following endorser categories, each with multiple named entries:

**Governors** (`type: 'governor'`)
- One per state where it's politically meaningful (swing states + key blue/red states)
- Default: endorses their own party's candidate at game start
- Effects: Statewide turnout boost (0.015–0.030) + free surrogate slot in state

**U.S. Senators** (`type: 'senator'`)
- Selected senators in swing states and key ideological figures
- Default: endorses their party's candidate
- Effects: State-level group loyalty boost relevant to their known constituency

**Labor Unions** (`type: 'union'`) — national or regional
- AFL-CIO, UAW, SEIU, Teamsters, Teachers Unions
- Default: D-leaning at game start
- Effects: Union Worker group loyalty +0.08–0.12; GOTV bonus for union households in relevant states
- Retract condition: If D candidate's labor issue position drifts above -2 (toward anti-labor)

**Media Outlets** (`type: 'media'`)
- Major newspapers (NYT, WaPo, WSJ editorial board, regional papers)
- Effect: Favorability +0.02–0.04 nationally or in the paper's market; media vulnerability reduced by 1
- Default: Most are open (not pre-endorsed); NYT/WaPo lean D unless candidate is extreme
- Note: Media endorsements cannot be "lobbied" — they are earned by maintaining favorable issue positions and polling above 35% nationally

**Religious Organizations** (`type: 'religious'`)
- Evangelical leaders, USCCB-adjacent political orgs, Muslim advocacy orgs
- Default: Evangelical → R; Muslim orgs → potentially open or D-leaning
- Effects: Group loyalty boost for their community + turnout multiplier

**Progressive Organizations** (`type: 'org'`)
- Sunrise Movement, NARAL, NAACP, Human Rights Campaign
- Default: D-leaning
- Retract condition: If D candidate's position on their core issue moves outside acceptable range
- Post-retraction: Can be poached by G or PSL

**Business / Chamber** (`type: 'org'`)
- Chamber of Commerce, Business Roundtable
- Default: R-leaning
- Effects: PAC funds unlock +$3–5M; Small Business group loyalty boost
- Retract: If R candidate position on trade/taxation moves too far populist

**Military / Veterans** (`type: 'military'`)
- VFW, various veterans' advocacy groups
- Default: Lean R but gettable by moderate D or compassionate conservative
- Effects: Foreign policy issue persuasion +0.3× nationally; turnout boost among veteran-dense counties

**Celebrity / Entertainment** (`type: 'celebrity'`)
- Unnamed generic celebrities (pop, sports, film)
- Default: Open — must be lobbied
- Effects: Gen Z turnout +0.03 in targeted states; campaign momentum +0.05
- Note: Only available after Week 3 (campaigns ramp up before celebrities engage)

### 3.4 Default Endorsement Application at Game Start

When `startGame()` runs, `applyDefaultEndorsements()` fires:

1. Loop all endorsers.
2. If `endorser.defaultEndorsement === player.party`: Apply endorser effects to player immediately.
3. Check if player's faction is in `endorser.factionBlocked`. If yes, **skip** — the endorser defaults to neutral ("no impact") even though it's the player's party.
4. Store all active endorsements in `gameData.activeEndorsements[candidateId][]`.

**Example**: If the player is `mainstream_liberal` running as D, they automatically get most D-default governors and unions. If the player is `outsider_leftist` running as D, they are blocked from Chamber of Commerce and some moderate Democratic senator endorsers — those start as `neutral` rather than pre-endorsed.

### 3.5 Lobbying Action

**Action**: `LOBBY_ENDORSER`  
**Cost**: 1 Action Point + endorser's `lobbyingFundsCost`  
**Energy**: 1  
**Target**: A specific endorser (the player selects from a list filtered to endorsers who are currently `neutral` or `poachable`)

**Resolution**:

```
1. Check factionBlocked — if player's faction is blocked, action fails immediately, AP and funds refunded.
2. Roll compatibility:
   - factionCompatible = getFactionCompatibility(player.factionId, endorser.affiliatedGroup)
   - If 'compatible': baseSuccessChance = 0.80
   - If 'neutral': baseSuccessChance = 0.50
   - If 'incompatible': baseSuccessChance = 0.20
3. Apply modifiers to baseSuccessChance:
   - Player national polling > 45%: +0.10
   - Player leads in endorser's state by > 5%: +0.10
   - Player has previously accepted a PAC incompatible with this endorser: -0.20
   - Opponent has already lobbied this endorser this week: -0.15 (contested)
4. Roll d100. If roll ≤ (baseSuccessChance × 100): SUCCESS. Else: FAIL.
5. On SUCCESS: Add endorser to player's activeEndorsements; apply effects immediately.
6. On FAIL: Endorser remains neutral. Player may retry in 2 weeks (cooldown).
```

### 3.6 Endorser Retraction

Each week during `processRetractConditions()`:

1. For each active endorsement on any candidate, check `retractConditions`:
   - `issueThresholds`: Compare candidate's current issue position to threshold. If crossed → retraction check.
   - `factionIncompatibleWith`: If candidate's VP has a faction in this list → retraction check.
2. **Retraction Check**: Roll d100 against `retractProbability = 0.65` (65% chance per week the condition triggers actual retraction, giving a grace window).
3. **On Retraction**:
   a. Remove endorser from candidate's `activeEndorsements`.
   b. **Reverse the endorser's effects** — subtract exactly what was added when the endorsement was granted.
   c. If `openAfterRetraction === true`: Endorser status becomes `poachable`. Opponent or eligible third parties may now lobby this endorser.
   d. News event fires: `"[Endorser] withdraws support from [Candidate]"` with appropriate favorability penalties.
4. **Retraction Magnitude by Type**:
   - Governor retraction: Statewide turnout boost reversed + -0.02 player favorability (news coverage)
   - Union retraction: Group loyalty reversed + union GOTV bonus removed + -0.03 favorability
   - Media retraction: Favorability reversed + editorial attacks begin (media vulnerability added)
   - Progressive org retraction: Group loyalty reversed; if PSL/Green active, they may receive the group's loyalty boost instead

### 3.7 Endorser Poaching (Cross-Party Flow)

When an endorser becomes `poachable` (after retraction from a major party candidate):

- Third-party or opposing candidates can lobby them using the same `LOBBY_ENDORSER` action.
- `baseSuccessChance` is recalculated with the poaching candidate's faction.
- **The net effect is a swing**: The original candidate loses the effect; the poaching candidate gains it.
- This models the real dynamic (e.g., a pro-Palestine progressive org retracting from the Democrat and endorsing the Green Party candidate).

**Flow Example**:
```
D candidate (outsider_leftist) takes strong pro-Israel position on Israel/Palestine issue.
→ Muslim Voters advocacy org retraction check fires (Week 5).
→ Retraction confirmed. D loses: Muslim group loyalty +0.10, MI/MN turnout boost.
→ Endorser becomes poachable.
→ PSL candidate lobbies next week. PSL faction is compatible with Muslim org.
→ Roll: 0.80 base × modifiers = 72% success. PSL wins the endorsement.
→ PSL gains Muslim group loyalty +0.10, MI/MN turnout boost.
→ D has now lost these benefits and they flow to the PSL.
```

### 3.8 Endorser UI

**Endorser Panel**: Accessible from the main campaign map via an "Endorsers" button in the sidebar.

Layout:
- **Tabs**: National | [State] (one tab per state with ≥1 endorser)
- **Each endorser card shows**:
  - Endorser name + type icon
  - Current status: `[✓ Endorsing You]` / `[✗ Endorsing Opponent]` / `[○ Neutral]` / `[⚠ Poachable]`
  - Effects summary (what they grant)
  - Lobbying cost
  - Compatibility indicator (green/yellow/red dot based on faction check)
  - "Lobby" button (disabled if blocked, on cooldown, or already endorsing)
- **Filter**: By type (Governor / Union / Media / etc.) and by status
- **At-Risk Indicator**: If an active endorsement has a retraction condition currently triggered, show a pulsing warning icon on that endorser card

---

## 4. Television Ads — Media Market System

### 4.1 Overview

The existing AD action is **deleted**. Television advertising is rebuilt from scratch around real media markets (DMAs — Designated Market Areas). A TV buy covers all counties within a media market simultaneously, not a state.

### 4.2 Media Market Data

Each county is assigned a `mediaMarket` field (string ID, e.g. `'philadelphia'`, `'green_bay'`, `'new_york'`).

**Implementation requirement**: Build a `MEDIA_MARKETS` lookup object:

```javascript
// mediaMarkets.js
const MEDIA_MARKETS = {
  philadelphia: {
    id: 'philadelphia',
    label: 'Philadelphia DMA',
    counties: ['42091', '42045', '42029', '34015', '34033', ...],  // FIPS codes
    states: ['PA', 'NJ', 'DE'],   // states this market spans
    cpmBase: 28,                   // cost per thousand impressions ($)
    reach: 4200000,                // total TV households
  },
  green_bay: {
    id: 'green_bay',
    label: 'Green Bay–Appleton DMA',
    counties: ['55009', '55087', '55117', ...],
    states: ['WI'],
    cpmBase: 8,
    reach: 480000,
  },
  // ... all ~210 DMAs that contain competitive counties
};
```

**County assignment**: Each county in the county data file gets `county.mediaMarket = 'dma_id'`. This is static data set once and never changes.

### 4.3 Media Market Map Mode

A new **map mode** is added alongside the existing vote share / turnout modes.

**Toggle**: A button group in the corner of the SVG map viewbox:
```
[Vote Share] [Turnout] [Media Markets] [Ground Ops]
```

**Media Markets mode behavior**:
- Every county is colored by its media market using a distinct color palette (20–30 colors cycling, enough to differentiate adjacent markets visually).
- Counties in the same media market share the same color.
- **Hover**: Shows a tooltip with `Media Market: [Name]` + market reach + estimated CPM.
- **Click**: Selecting any county in the market selects the entire market for a TV ad buy.
- State borders still drawn as thicker lines for orientation.

### 4.4 TV Ad Action (`buyTVAd`)

**Access**: The main "Ads" button in the action panel opens a combined Ads modal. TV Ads is the first tab.

**Action Cost**:
$$\text{Total Cost} = \text{CPM}_{\text{market}} \times \frac{\text{Reach}_{\text{market}}}{1000} \times \text{WeeksRunning} \times \text{IntensityMultiplier}$$

- Player chooses how many **weeks to run** the buy (1–4 weeks; longer buys get a 10% discount per additional week).
- **IntensityMultiplier**: 
  - Light (1×): Baseline CPM
  - Moderate (1.5×): 1.5× cost, 1.35× effect
  - Heavy (2.5×): 2.5× cost, 1.9× effect (saturation kicks in harder)
- **Energy**: 0 (media buys are staff work, not candidate time)
- **AP cost**: 1 per market per buy (selecting multiple markets costs 1 AP each)

**Ad Types** — player selects one per buy:

| Type | Code | Effect |
| :--- | :--- | :--- |
| **Positive** | `positive` | Increases YOUR turnout across all counties in the market |
| **Negative / Attack** | `attack` | Decreases TARGET opponent's turnout across all counties in the market |
| **Issue Ad** | `issue` | Player prompted to select one issue; shifts vote share in counties where that issue is salient |

**Positive Ad Math**:
$$\Delta \text{Turnout (county)} = \text{BASE\_TV\_TURNOUT} \times \text{IntensityMultiplier} \times \text{SaturationFactor} \times \text{FactionGroupBonus}$$
- `BASE_TV_TURNOUT = 0.008` per county per week
- `FactionGroupBonus`: If the county's top demographic group is in the player's `groupBonuses`, multiply by 1.2.

**Attack Ad Math**:
$$\Delta \text{Opponent Turnout (county)} = -\text{BASE\_TV\_ATTACK} \times \text{IntensityMultiplier} \times \text{SaturationFactor}$$
- `BASE_TV_ATTACK = 0.006`
- **Blowback Risk**: 15% chance per week the attack ad generates negative coverage → player favorability -0.01. Risk increases to 25% if player favorability is already below 0.45.
- **Target Selector**: Player must specify which opponent to target (in a multi-candidate race).

**Issue Ad Math**:
- Player selects one issue from their current issue position list.
- For each county in the market:
$$\Delta \text{Vote Share} = \text{calculateCountyPersuasion}(\text{county}, \text{issue}, \text{intensity}, \text{BASE\_TV\_PERSUASION}=0.015, \text{saturation})$$
- Issue ads respect the existing **Issue Fatigue** system (Section 5 of v2 main guide).
- Issue ads respect the **Messaging Consistency streak** system.

### 4.5 Multi-State Market Handling

Some DMAs cross state lines (Philadelphia spans PA, NJ, DE; NYC spans NY, NJ, CT). 

**Rule**: Effects apply to all counties in the market regardless of state. A Philadelphia TV buy will affect South Jersey and Delaware counties simultaneously. This is a feature, not a bug — it models real campaign media strategy.

**Cost**: The same buy covers all counties in all states of the market. No additional cost for multi-state reach.

### 4.6 TV Ad Saturation

TV markets accumulate saturation separately from the existing PRESSURE_SCALAR system:

```javascript
gameData.tvSaturation[marketId][candidateId] = 0.0  // 0.0 to 1.0
```

Each week a buy runs in a market:
$$\text{Saturation}_{t+1} = \text{Saturation}_t + (0.06 \times \text{IntensityMultiplier}) \times (1 - \text{Saturation}_t)$$

**SaturationFactor** applied to all TV effects:
$$\text{SaturationFactor} = 1 - (0.65 \times \text{Saturation})$$

Natural decay: −6% per week when no buy is running in that market.

---

## 5. Digital Ads — Surgical Targeting System

### 5.1 Overview

Digital advertising replaces the existing DIGITAL action. It is **surgical** — it targets specific demographic/faction groups in specific geographies. It does not move broad opinion; it moves turnout propensity and factional loyalty within defined slices of the electorate.

**Combined Ads Button**: Both TV and Digital ads are accessed from a single **"ADS"** button placed in the corner of the map SVG viewbox (exact position: top-right corner, inside the viewbox border). This opens a modal with two tabs: **Television** and **Digital**.

### 5.2 Digital Ad Configuration

Each digital ad campaign is configured along three axes:

**Axis 1 — Target Faction/Demographic** (who sees it):
The player selects one target from the interest group / faction list. Available targets depend on platform:

| Target Group | Typical Platform | Notes |
| :--- | :--- | :--- |
| Young Progressive Voters | TikTok, YouTube, Instagram | Gen Z + Progressive overlap |
| Rural Working Class | Facebook | Non-college, rural, older |
| Suburban Women | Facebook, Instagram | Targetable by gender + geo |
| Union Households | Facebook, Streaming Audio | Targetable by zip code overlap with union-dense areas |
| Latino Voters | Facebook, YouTube (Spanish) | Language + geo targeting |
| African American Voters | Facebook, YouTube | Interest + geo targeting |
| Evangelical Voters | Facebook | Interest + affinity targeting |
| Seniors | Facebook, Display, CTV | Older demos, less TikTok |
| MAGA Core | Facebook, Alternative Video | Interest-graph cluster |
| College-Educated Suburbanites | Google Search, LinkedIn | Intent + professional targeting |

**Axis 2 — Geographic Scope** (where):
- **Statewide**: Applies to all counties in a state proportionally.
- **County-Group**: Player selects up to 3 specific counties. Effect concentrated in those counties.

**Axis 3 — Ad Type** (what it does):

| Type | Code | Primary Effect | Risk |
| :--- | :--- | :--- | :--- |
| **Mobilization (GOTV)** | `mobilize` | Increases Turnout Propensity of target group | Low |
| **Dog-Whistle / Wedge** | `wedge` | Highlights niche issue to make a group cross lines or stay home | High — see backfire below |

### 5.3 Digital Ad Math

**Base Cost**: $0.8M per campaign (statewide) / $0.4M per campaign (county-group, per county)  
**Energy**: 0  
**AP**: 1 per digital campaign queued

**Mobilization Effect**:
$$\Delta \text{Turnout (group, in county)} = \text{DIGITAL\_MOBILIZE\_BASE} \times \text{GroupShare} \times \text{FactionCompatibilityMultiplier} \times \text{SaturationFactor}$$

Where:
- `DIGITAL_MOBILIZE_BASE = 0.04`
- `GroupShare` = the group's share of that county's population (0.0–1.0)
- `FactionCompatibilityMultiplier`:

| getFactionCompatibility result | Multiplier |
| :--- | :---: |
| `compatible` | 1.4 |
| `neutral` | 1.0 |
| `incompatible` | **BACKFIRE CHECK INSTEAD** |

**Wedge Effect**:
$$\Delta \text{Target Group Loyalty (to their candidate)} = -\text{WEDGE\_BASE} \times \text{GroupShare} \times \text{IssueRelevance}$$
- `WEDGE_BASE = 0.06`
- `IssueRelevance` = how important the wedge issue is to this group (uses the existing issue importance priority multipliers from v2 Section 5)
- Effective loyalty reduction causes the group's turnout propensity to drop (they stay home rather than crossing lines)
- Alternatively, if `IssueRelevance > 1.2`: Some portion (20%) of affected group voters may actually shift vote share rather than just staying home.

### 5.4 Faction Compatibility Backfire System

When a player targets a group where `getFactionCompatibility` returns `incompatible`:

**Backfire Roll**:
$$\text{BackfireChance} = \text{faction.digitalBackfireRisk} + (0.05 \times \text{GroupIncompatibilityDepth})$$

- `GroupIncompatibilityDepth`: How deep the incompatibility is (if the group is in the faction's `groupPenalties` with a penalty < 0.5, depth = 2; if 0.5–0.7, depth = 1).

**On Backfire** (roll succeeds):
- The mobilization effect **reverses**: The target group's turnout propensity DECREASES by the same amount it would have increased.
- A news event fires: `"[Candidate]'s digital outreach to [Group] backfires — activists call it tone-deaf"`.
- Player favorability -0.01.
- `campaignMomentum` -0.05.

**On No Backfire** (roll fails; player "got away with it"):
- The mobilization effect is still **reduced to 30%** of normal (the ad isn't optimized for this audience, it just lands flat).
- No news event.

**Player Warning**: Before queuing a digital ad targeting an incompatible group, the UI shows a **"⚠ HIGH BACKFIRE RISK"** warning in red on the configuration panel, with the exact backfire percentage displayed. The player must click "Run Anyway" to confirm.

### 5.5 Digital Ad Saturation

```javascript
gameData.digitalSaturation[stateCode][targetGroupId] = 0.0
```

Saturation accumulates per group per geography:
$$\text{Saturation}_{t+1} = \text{Saturation}_t + 0.12 \times (1 - \text{Saturation}_t)$$

$$\text{SaturationFactor} = 1 - (0.70 \times \text{Saturation})$$

Natural decay: −10% per week (digital audiences refresh faster than TV).

**Saturation Indicator**: In the digital ad modal, each targetable group in each state shows a color-coded saturation meter (green / yellow / red) so the player can see where their targeting is burning out.

### 5.6 Digital Ad Faction Compatibility UI Indicators

In the Digital Ad configuration panel:
- Each targetable group shows a **compatibility dot** next to its name (green = compatible, grey = neutral, red = incompatible).
- Hovering the dot shows: `"[Faction Name] has [bonus/penalty] with [Group Name]. Backfire risk: [X]%"`.
- This gives the player full information to make strategic decisions.

---

## 6. Rally System — County-Level with Centroid Spillover

### 6.1 Overview

The existing rally system used a 120-mile radius and a generic turnout boost. This replaces it with:
- 50-mile radius (corrected per your spec)
- True **centroid-to-centroid distance** calculation
- **Faction-influenced attendance composition** — which groups show up and how strongly depends on candidate faction

### 6.2 Rally Action

**Cost**: $1.0M  
**Energy**: 2  
**Scope**: Player selects a **specific county** (not a state)

**Centroid Distance Calculation**:

Each county has `county.centroidLat` and `county.centroidLng` already in the data (or must be added). The rally county's centroid is the epicenter.

For every other county:
$$d = \text{haversine}(\text{rallyCentroid}, \text{targetCentroid}) \quad \text{(in miles)}$$

**Falloff function**:
$$\text{SpilloverFactor}(d) = \begin{cases} 1.0 & d = 0 \text{ (rally county)} \\ 1 - \frac{d}{50} & 0 < d \leq 50 \\ 0 & d > 50 \end{cases}$$

### 6.3 Attendance Model — Faction + Candidate Bonuses

Rally effectiveness is not a flat number. It is drawn **randomly** within a range shaped by candidate charisma and faction bonuses with the groups present in that county.

**Step 1 — Determine Attending Groups**:
For the rally county (and spillover counties weighted by SpilloverFactor), identify the top 3 demographic groups by population share.

**Step 2 — Faction Bonus Check**:
For each attending group, check `getFactionCompatibility`:
- `compatible`: That group shows up in **higher-than-expected numbers** → group's population share in the attendance model is multiplied by 1.3.
- `neutral`: Normal attendance.
- `incompatible`: That group shows up in **lower numbers** → population share multiplied by 0.6.

**Step 3 — Charisma Roll**:
$$\text{RallySuccessRoll} = \text{candidate.charisma} \times \mathcal{U}(0.7, 1.3)$$
- Range: if `charisma = 1.0`, roll is between 0.70–1.30.
- If `charisma = 2.0`, roll is between 1.40–2.60.
- If `charisma = 0.5`, roll is between 0.35–0.65.

**Step 4 — Compute Effects**:

**Turnout Effect (rally county)**:
$$\Delta \text{Turnout} = \text{RALLY\_BASE\_TURNOUT} \times \text{RallySuccessRoll} \times \left(\sum_{\text{attending groups}} \text{GroupShare} \times \text{FactionBonus}\right)$$
- `RALLY_BASE_TURNOUT = 0.05`

**Margin Shift (rally county)**:
$$\Delta \text{Vote Share} = \text{RALLY\_BASE\_MARGIN} \times \text{RallySuccessRoll} \times \left(\sum_{\text{attending groups}} \text{GroupShare} \times \text{FactionBonus}\right)$$
- `RALLY_BASE_MARGIN = 0.012`

**Spillover Counties** (d ≤ 50 miles):
$$\Delta \text{Turnout}_{\text{spillover}} = \Delta\text{Turnout}_{\text{rally}} \times \text{SpilloverFactor}(d)$$
$$\Delta \text{Vote Share}_{\text{spillover}} = \Delta\text{Vote Share}_{\text{rally}} \times \text{SpilloverFactor}(d) \times 0.5$$
(Vote share spillover is halved — the rally's persuasion effect is mostly local; turnout spillover is more geographic)

### 6.4 Rally Outcome Display

After a rally processes, the UI shows a **Rally Report** popup:
- `"[County Name] Rally — [Outcome: Massive Success / Strong Showing / Mixed Results / Disappointing Turnout]"`
- Which groups showed up (and how strongly)
- Turnout shift (county + spillover counties listed)
- Vote share shift
- Whether any faction bonus/penalty groups were in the rally county (and the effect they had)

Outcome label thresholds (based on `RallySuccessRoll × peak FactionBonus`):
- ≥ 1.5: "Massive Success"
- 1.1–1.49: "Strong Showing"
- 0.85–1.09: "Mixed Results"
- < 0.85: "Disappointing Turnout"

### 6.5 Rally Attendance Cap

If the computed total raw turnout exceeds **65,000** (existing cap):
$$\text{Scale Factor} = \frac{65{,}000}{\text{Raw Turnout}}$$
All turnout deltas for the rally county are multiplied by this cap.

Spillover counties are NOT subject to the 65,000 cap (they're not at the rally venue).

---

## 7. Undecided Voter Model

### 7.1 Overview

During the simulation, polls do not sum to 100%. A portion of the electorate is **undecided**, and this pool shrinks as Election Day approaches. On Election Day, undecided voters are distributed probabilistically — they are not fully random, but they carry meaningful variance that makes close states genuinely uncertain.

### 7.2 Undecided Pool Initialization

At game start, each county is assigned an `undecidedShare`:

$$\text{undecidedShare} = \text{UNDECIDED\_BASE} + \mathcal{U}(-0.03, +0.03)$$

- `UNDECIDED_BASE = 0.12` (12% undecided nationally at the start of the campaign in July 2028)
- County variance: ±3% based on county-level competitiveness (swing counties start with more undecideds; safe counties fewer)

```javascript
// Per-county in county data:
county.undecidedShare = 0.12;  // initialized, then modified weekly
```

### 7.3 Undecided Decay Schedule

Each week, the undecided pool shrinks as voters make up their minds:

$$\text{undecidedShare}_{t+1} = \text{undecidedShare}_t \times \text{WeeklyDecayFactor}(t)$$

| Weeks to Election | Weekly Decay Factor |
| :---: | :---: |
| 17–13 (early campaign) | 0.96 (−4%/week) |
| 12–8 (mid campaign) | 0.92 (−8%/week) |
| 7–4 (late campaign) | 0.88 (−12%/week) |
| 3–1 (final stretch) | 0.80 (−20%/week) |
| Election Eve | Forced to 0 — all undecideds decide |

**By Election Day, undecidedShare must equal 0.** The final distribution of undecideds occurs at election night resolution.

### 7.4 How Undecideds Affect Displayed Polls

When the simulation displays state-level or national polling numbers:
$$\text{Displayed Poll (Player)} = V_{\text{Player}} \times (1 - \text{stateUndecided})$$
$$\text{Displayed Poll (Opponent)} = V_{\text{Opponent}} \times (1 - \text{stateUndecided})$$

These numbers will not add to 100% — the remainder is shown as `"Undecided: X%"` in the poll display. This is intentional and realistic.

**Example**: True underlying vote shares PA: Player 52%, Opponent 48%. State undecided pool = 8%.  
Displayed: Player 47.8%, Opponent 44.2%, Undecided 8%. Margin appears close even though player actually leads.

### 7.5 Undecided Resolution on Election Night

On Election Night, for each county, `resolveUndecidedVoters(county)` fires **before** the first vote batch is reported:

**Step 1 — County Lean Factor**:
$$\text{LeanFactor} = \frac{V_{\text{Player}} - V_{\text{Opponent}}}{V_{\text{Player}} + V_{\text{Opponent}}}$$
Range: -1.0 (pure opponent county) to +1.0 (pure player county).

**Step 2 — Undecided Distribution**:
Undecideds don't simply split proportionally — late-deciding voters skew toward specific patterns:

$$\text{Player Share of Undecideds} = 0.50 + (\text{LeanFactor} \times 0.20) + \mathcal{N}(0, 0.08)$$

- Base: 50/50 split.
- Lean adjustment: Counties leaning toward the player send slightly more undecideds their way — but not a lot (undecideds are genuinely uncertain).
- **Random variance term**: `σ = 0.08` — this is the "danger." A close state can swing ±3–4 points from undecided resolution alone, which is realistic.
- In a multi-candidate race, third parties receive a small slice:
  $$\text{Third Party Share of Undecideds} = \max(0, 0.05 + \mathcal{N}(0, 0.02))$$
  The remainder (after third party allocation) splits between D and R proportionally.

**Step 3 — Apply to Vote Counts**:
$$V_{\text{Player (final)}} = V_{\text{Player}} + \text{undecidedShare} \times \text{Player Share of Undecideds}$$
$$V_{\text{Opponent (final)}} = V_{\text{Opponent}} + \text{undecidedShare} \times \text{Opponent Share of Undecideds}$$
Renormalize to 100%.

### 7.6 UI — Displaying Undecideds

**State Tooltip**: When hovering a state on the map, the popup now shows:
```
Pennsylvania
Player: 47.8%    Opponent: 44.2%    Undecided: 8.0%
Margin (among decided): Player +4.2
```

**National Poll Widget**: The national numbers strip at the top of the screen always shows the undecided percentage:
```
[Player Name] 43.1% | [Opponent] 40.7% | Undecided 9.4% | Others 6.8%
```

**Warning System**: If a state's undecided share is > 6% AND the current margin is < 4%, that state gets a **⚠ VOLATILE** badge on the map and in the state list. These are states where the undecided resolution alone could flip the result.

---

## 8. Action System Integration & UI

### 8.1 What Changes in the Action Panel

The unified action panel (however it is currently structured) is reorganized as follows. **Old AD and DIGITAL buttons are removed.** Everything now flows through:

| Action Slot | What It Is | AP Cost | Energy | Funds |
| :--- | :--- | :---: | :---: | :--- |
| **Ads** (button) | Opens Ads modal → TV tab + Digital tab | 1 per buy | 0 | Varies |
| **Rally** | County picker → centroid spillover | 1 | 2 | $1.0M |
| **Speech** | Existing (unchanged) | 1 | 1 | $0.5M × Int |
| **Ground Ops** (button) | Opens Ground Ops modal (from prior spec) | Varies | Varies | Varies |
| **Lobby Endorser** | Endorser panel → select → lobby | 1 | 1 | Varies |
| **Fundraise** | Existing PAC/Grassroots (unchanged from v2) | 1 | 1 | — |
| **Debate Prep** | Unchanged from v2 | 1 | 1 | $0.75M |
| **Oppo Research** | Unchanged from v2 | 1 | 1 | $2.0M |
| **Surrogate** | Unchanged from v2 | 1 | 0 | $1.0M × Int |

### 8.2 Ads Button — Combined Modal

The **ADS** button is placed in the **top-right corner of the map SVG viewbox**, visually embedded in the map interface (not in the sidebar). It is always visible regardless of which map mode is active.

Clicking it opens a modal with two tabs:

**Tab 1: Television**
- Market picker (defaults to showing the currently selected/hovered market, or a dropdown list)
- Ad type selector: Positive / Attack / Issue
- Intensity: Light / Moderate / Heavy
- Duration: 1 / 2 / 3 / 4 weeks
- Live cost estimate
- Saturation meter for the selected market
- "Buy Ad" confirm button

**Tab 2: Digital**
- Target group selector (with compatibility dots)
- Geographic scope: Statewide (state dropdown) / County-Group (county multi-picker, max 3)
- Ad type: Mobilization / Wedge
- Backfire risk warning (if incompatible)
- Saturation meter for target group in selected geography
- Live cost estimate
- "Run Campaign" confirm button

### 8.3 Map Mode Toggle

The map now has **4 modes**, toggled by a button group embedded in the SVG viewbox (bottom-left corner, or wherever it fits cleanly):

```
[Vote Share ▼] [Turnout] [Media Markets] [Ground Ops]
```

- **Vote Share**: Current default behavior (counties colored by leading candidate and margin).
- **Turnout**: Counties colored by current turnout multiplier (heat map; blue = low, red = high).
- **Media Markets**: Counties colored by DMA, as described in Section 4.3.
- **Ground Ops**: Counties colored by the player's ground operations coverage (green intensity = more infrastructure; useful for identifying gaps).

---

## 9. Data Schemas Reference

### 9.1 Updated `candidates.js` Fields

Every candidate object must now include:

```javascript
{
  id: 'candidate_id',
  name: 'Full Name',
  party: 'D',            // D | R | G | L | PSL | I
  factionId: 'mainstream_liberal',   // key into FACTIONS
  homeState: 'PA',
  homeStateBoost: 2.2,
  funds: 85,             // starting funds in millions
  stamina: 8,            // max weekly energy
  charisma: 1.2,         // 0.5–2.0
  debateSkill: 7,        // 1–10
  scandalResistance: 0.4, // 0.0–1.0
  groupEffects: { ... }, // existing field
  regionalSpillover: ['OH', 'NJ'],
  regionalSpilloverBoost: 1.8,
  // NEW:
  factionId: 'mainstream_liberal',   // required
  // Asset:
  portraitFile: 'candidate_name.png',
}
```

### 9.2 Updated `gameData` Structure

```javascript
gameData = {
  // existing fields...
  
  // NEW:
  activeEndorsements: {
    [candidateId]: [endorserId, ...]
  },
  endorserStatus: {
    [endorserId]: 'endorsing_player' | 'endorsing_opponent_[id]' | 'neutral' | 'poachable'
  },
  endorserCooldowns: {
    [endorserId]: weekNumber   // can retry after this week
  },
  tvSaturation: {
    [marketId]: { [candidateId]: 0.0 }
  },
  digitalSaturation: {
    [stateCode]: { [groupId]: 0.0 }
  },
  undecidedShares: {
    [fips]: 0.12   // per county, initialized at start, decays weekly
  },
  activeTVBuys: [
    {
      marketId: 'philadelphia',
      candidateId: 'player',
      adType: 'positive',
      intensity: 'moderate',
      weeksRemaining: 3,
      weekPurchased: 4
    }
  ]
}
```

### 9.3 New Files Required

| File | Purpose |
| :--- | :--- |
| `factions.js` | All faction definitions (Section 1.2) |
| `endorsers.js` | All endorser definitions (Section 3.3) |
| `mediaMarkets.js` | DMA definitions and county mappings (Section 4.2) |
| `endorserLogic.js` | `processRetractConditions()`, `lobbyEndorser()`, `applyDefaultEndorsements()` |
| `tvAds.js` | `buyTVAd()`, `applyTVAdEffects()`, `processTVSaturation()` |
| `digitalAds.js` | `runDigitalCampaign()`, `checkBackfire()`, `processDigitalSaturation()` |
| `rallyEngine.js` | `applyRallyAction()` (replaces existing), `computeSpillover()`, `getRallyAttendanceGroups()` |
| `undecidedModel.js` | `initUndecidedShares()`, `decayUndecidedPool()`, `resolveUndecidedVoters()` |
| `/assets/factions/` | Directory for faction emblem images (you upload these) |

### 9.4 Weekly Tick Integration

The weekly `nextWeek()` function must call these new functions in order:

```
nextWeek() {
  1. applyQueuedActions()          // existing — now includes TV + Digital + new Rally
  2. processActiveTVBuys()         // apply ongoing multi-week TV buys
  3. processRetractConditions()    // check endorser retraction triggers
  4. decayUndecidedPool()          // shrink undecided share per schedule
  5. processTVSaturation()         // decay + accumulate TV market saturation
  6. processDigitalSaturation()    // decay + accumulate digital saturation
  7. runOpponentAI()               // existing AI with new action types added
  8. processWeeklyNews()           // existing news engine
  9. recomputeInterestGroupSupport() // existing
  10. updateNationalPolling()       // existing
  11. checkCoalitionLoyalty()       // existing
  12. advanceWeek()                 // increment date
}
```

---

*End of Decision 2028 Master Spec v3*  
*Covers: Faction System, Candidate/VP UI, Endorser System, TV Ads (Media Markets), Digital Ads (Surgical Targeting), Rally (Centroid Spillover), Undecided Voter Model, Action System Integration, Data Schemas*
