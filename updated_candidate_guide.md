# Decision 2028 - Candidate & Running Mate (VP) Impact Guide

This guide details all attributes, traits, demographic group effects, home state advantages, and faction synergies for all **Presidential Candidates** and **Vice Presidential Running Mates (VPs)** in Decision 2028. 

You can use this reference to review game balance and edit any values in [`js/candidates.js`](file:///c:/Users/quavo/Downloads/campaign-2028-main/campaign-2028-main/js/candidates.js).

---

## 1. Candidate Attribute & Mechanics System

### Presidential Candidate Attributes
- **Charisma (`0.5` to `2.0`)**: Multiplies campaign rally effects, media exposure, and grassroots fundraising output.
- **Debate Skill (`1` to `10`)**: Determines performance in presidential debates, zinger success rates, and opponent counter-attacks.
- **Scandal Resistance (`0.0` to `1.0`)**: Mitigates opposition research attacks and negative media event damage (`1.0` = Teflon resistance).
- **Home State Boost (`+1.0%` to `+2.5%`)**: Flat vote margin advantage in the candidate's home state.
- **Regional Spillover**: List of neighboring states that receive a secondary margin boost (`regionalSpilloverBoost`, e.g. `+0.5%` to `+1.0%`).
- **Starting Funds (`$M`)**: Initial campaign treasury at launch.
- **Stamina (`1` to `10`)**: Weekly energy capacity for campaign actions.
- **Group Effects**: Targeted support (`support`) and turnout (`turnout`) percentage modifiers for specific voter demographics.

### Running Mate (VP) Mechanics
- **VP Home State Advantage**: Selecting a VP adds a `+1.5%` to `+2.2%` vote margin boost in the VP's home state (e.g. Shapiro adds PA, Whitmer adds MI, Vance adds OH, Rubio adds FL).
- **VP Demographic Group Effects**: Stack on top of the Presidential Candidate's group effects to broaden or consolidate turnout.
- **VP Stat Share**: 30% of the VP's Charisma, Debate Skill, and Scandal Resistance are added to the campaign ticket performance and apply directly during VP debate events.
- **Faction Synergy Modifier**:
  - **Balanced Ticket (Complementary Factions)**: `+1.5%` to `+2.5%` national harmony & crossover boost.
  - **Unified Ticket (Same Faction)**: `+2.0%` base turnout enthusiasm boost.
  - **Fractured Ticket (Clashing Factions)**: `-1.5%` to `-3.0%` base demoralization penalty.

---

## 2. Democratic Candidates & VPs

### Kamala Harris
- **Role**: Presidential Candidate
- **Faction**: Mainstream Liberal (`mainstream_liberal`) | **Home State**: CA (`+0`)
- **Stats**: Charisma: `1.2` | Debate Skill: `7` | Scandal Resistance: `0.5` | Funds: `$86M` | Stamina: `7`
- **Traits**: `Buff`: Donor Magnet | `Debuff`: General-Election Ceiling
- **Regional Spillover**: None
- **Group Boosts**: Black (`+5%`), Asian (`+2%`), Suburban College (`+5%`)
- **Group Debuffs**: Non-College (`-4%`), Rural (`-4%`), Hispanic (-4%), Youth (-3%), Progressive Left (`-3%`)
- **VP Impact (If Running Mate)**: Increases Black Turnout, boosts suburban college women, provides strong donor network connections.

---

### Gavin Newsom
- **Role**: Presidential Candidate
- **Faction**: Mainstream Liberal (`mainstream_liberal`) | **Home State**: CA (`+3.0% in Urban CA counties, -4.0% in Rural CA Counties)
- **Stats**: Charisma: `1.6` | Debate Skill: `8` | Scandal Resistance: `0.3` | Funds: `$84M` | Stamina: `8`
- **Traits**: `Buff`: Media Combatant | `Debuff`: Heartland Liability
- **Group Boosts**: Urban (`+3%`), Suburban (+4%), Tech (`+8%`), LGBTQ+ (`+7%`)
- **Group Debuffs**: Rural (`-6%`), Evangelical (`-5%`), Black (-1%)

---

### Gretchen Whitmer
- **Role**: Presidential Candidate & VP
- **Faction**: Mainstream Liberal (`pragmatic_moderate`) | **Home State**: MI (`+4.0%` Pres / `+2.5%` VP)
- **Stats**: Charisma: `1.3` | Debate Skill: `6` | Scandal Resistance: `0.6` | Funds: `$75M` | Stamina: `8`
- **Traits**: `Buff`: Blue Wall Anchor | `Debuff`: Progressive Friction
- **Group Boosts (As Pres)**: Suburban (`+8%`), Midwest Non-College (`+6%`), Union (`+5%`)
- **Group Boosts (As VP)**: Suburban (`+4%`), Midwest Non-College (`+3%`), Union (`+2%`)
- **Group Debuffs**: Rural (`-3%`), Urban (-2%), Progressive Left (`-1%`)
- **Impact Summary**: Essential Blue Wall candidate. Prevents rust-belt erosion and locks down Michigan.

---

### Josh Shapiro
- **Role**: Presidential Candidate & VP
- **Faction**: Pragmatic Moderate (`pragmatic_moderate`) | **Home State**: PA (`+5.0%` Pres / `+3.0%` VP)
- **Stats**: Charisma: `1.3` | Debate Skill: `7` | Scandal Resistance: `0.6` | Funds: `$80M` | Stamina: `8`
- **Traits**: `Buff`: Keystone Keystone | `Debuff`: Progressive Left Friction
- **Group Boosts (As Pres)**: Suburban Moderates (`+7%`), Jewish (`+8%`), Moderate Dems (`+6%`)
- **Group Boosts (As VP)**: Suburban Moderates (`+3%`), Jewish (`+4%`), Moderate Dems (`+2%`)
- **Group Debuffs**: Progressive Left (`-5%`), Youth (`-3%`), Urban (-3%)
- **Impact Summary**: Elite Pennsylvania anchor. Maximizes moderate swing voters across the industrial Midwest.

---

### Pete Buttigieg
- **Role**: Presidential Candidate
- **Faction**: Mainstream Liberal (`mainstream_liberal`) | **Home State**: IN (+0)
- **Stats**: Charisma: `1.4` | Debate Skill: `9` | Scandal Resistance: `0.5` | Funds: `$72M` | Stamina: `8`
- **Traits**: `Buff`: Cable News Prodigy | `Debuff`: Non-College Blindspot
- **Group Boosts**: Suburban College (`+7%`), High-Info Swing (`+6%`), LGBTQ+ (`+6%`)
- **Group Debuffs**: Black (`-5%`), Non-College (`-5%`), Hispanic (-3%)

---

### Alexandria Ocasio-Cortez (AOC)
- **Role**: Presidential Candidate
- **Faction**: Activist Left (`activist_left`) | **Home State**: NY (`+3%`)
- **Stats**: Charisma: `1.8` | Debate Skill: `7` | Scandal Resistance: `0.2` | Funds: `$65M` | Stamina: `9`
- **Traits**: `Buff`: Grassroots Surge | `Debuff`: Suburban Moderates Repellent
- **Regional Spillover**: California (CA), Vermont (VT), Rhode Island (RI), Oregon (OR), WA  Massachusetts (MA) (+2% in Progressive Areas)
- **Group Boosts**: Youth (`+10%`), Progressive Left (`+10%`), Hispanic (`+8%`), Urban (+3%)
- **Group Debuffs**: Suburban Moderates (`-8%`), Rural (`-8%`), Donor Class (`-6%`), 

---

### Mark Kelly
- **Role**: Presidential Candidate & VP
- **Faction**: Mainstream Liberal (`mainstream_liberal`) | **Home State**: AZ (`+3%` Pres / `+2%` VP)
- **Stats**: Charisma: `0.9` | Debate Skill: `5` | Scandal Resistance: `0.8` | Funds: `$68M` | Stamina: `8`
- **Traits**: `Buff`: Sun Belt Defender | `Debuff`: Low Media Flash
- **Group Boosts (As Pres)**: Veterans (`+5%`), Suburban Moderates (`+5%`), Independents (`+4%`)
- **Group Boosts (As VP)**: Veterans (`+3%`), Suburban Moderates (`+2%`), Independents (`+2%`)
- **Group Debuffs**: Progressive Left (`-3%`), Youth (-2%)

---

### Tim Walz
- **Role**: Presidential Candidate & VP
- **Faction**: Mainstream Liberal (`mainstream_liberal`) | **Home State**: MN (`+2.2%` Pres / `+1.8%` VP)
- **Stats**: Charisma: `1.3` | Debate Skill: `7` | Scandal Resistance: `0.8` | Funds: `$65M` | Stamina: `7`
- **Traits**: `Buff`: Midwest Dad Energy | `Debuff`: Progressive Liability
- **Group Boosts (As Pres)**: Union (`+5%`), Rural (`+3%`), Suburban Moderates (`+4%`)
- **Group Boosts (As VP)**: Union (`+3%`), Rural (`+2%`), Suburban Moderates (`+2%`)

---

### Andy Beshear
- **Role**: Presidential Candidate
- **Faction**: Pragmatic Moderate (`pragmatic_moderate`) | **Home State**: KY (`+2.5%`)
- **Stats**: Charisma: `1.2` | Debate Skill: `6` | Scandal Resistance: `0.7` | Funds: `$55M` | Stamina: `7`
- **Traits**: `Buff`: Rural Crossover | `Debuff`: Low National Profile
- **Group Boosts**: Rural (`+6%`), Independents (`+6%`), Non-College (`+4%`)
- **Group Debuffs**: Activist Left (`-4%`)

---

### Jasmine Crockett
- **Role**: Presidential Candidate
- **Faction**: Activist Left (`activist_left`) | **Home State**: TX (`+1.3%`)
- **Stats**: Charisma: `1.5` | Debate Skill: `8` | Scandal Resistance: `0.5` | Funds: `$55M` | Stamina: `9`
- **Traits**: `Buff`: Viral Combatant | `Debuff`: Swing Voter Repellent
- **Group Boosts**: Black (`+5%`), Youth (`+6%`)
- **Group Debuffs**: Suburban Moderates (`-4%`), Rural (`-5%`)

---

### Jon Ossoff
- **Role**: Presidential Candidate
- **Faction**: Mainstream Liberal (`mainstream_liberal`) | **Home State**: GA (`+1.9%`)
- **Stats**: Charisma: `1.4` | Debate Skill: `7` | Scandal Resistance: `0.9` | Funds: `$80M` | Stamina: `8`
- **Traits**: `Buff`: Sun Belt Appeal | `Debuff`: Soft Base Enthusiasm
- **Group Boosts**: Suburban College (`+6%`), Youth (`+3%`)
- **Group Debuffs**: Non-College (`-3%`)

---

### Ruben Gallego
- **Role**: Presidential Candidate
- **Faction**: Mainstream Liberal (`mainstream_liberal`) | **Home State**: AZ (`+2.1%`)
- **Stats**: Charisma: `1.3` | Debate Skill: `7` | Scandal Resistance: `0.6` | Funds: `$60M` | Stamina: `8`
- **Traits**: `Buff`: Working-Class Brawler | `Debuff`: Progressive Friction
- **Group Boosts**: Hispanic (`+6%`), Veterans (`+5%`), Union (`+4%`)
- **Group Debuffs**: Progressive Left (`-4%`)

---

### Wes Moore
- **Role**: Presidential Candidate
- **Faction**: Mainstream Liberal (`mainstream_liberal`) | **Home State**: MD (`+2.3%`)
- **Stats**: Charisma: `1.6` | Debate Skill: `8` | Scandal Resistance: `0.7` | Funds: `$75M` | Stamina: `9`
- **Traits**: `Buff`: Generational Charisma | `Debuff`: Light Governing Record
- **Group Boosts**: Black (`+5%`), Suburban College (`+5%`), Independents (`+3%`)

---

### Mark Cuban
- **Role**: Presidential Candidate
- **Faction**: Pragmatic Moderate (`pragmatic_moderate`) | **Home State**: TX (`+1.5%`)
- **Stats**: Charisma: `1.6` | Debate Skill: `8` | Scandal Resistance: `0.4` | Funds: `$100M` | Stamina: `7`
- **Traits**: `Buff`: Business Maverick | `Debuff`: Base Distrust
- **Group Boosts**: Independents (`+8%`), Suburban Moderates (`+6%`)
- **Group Debuffs**: Progressive Left (`-8%`)

---

### James Talarico
- **Role**: Presidential Candidate
- **Faction**: Activist Left (`activist_left`) | **Home State**: TX (`+1.4%`)
- **Stats**: Charisma: `1.5` | Debate Skill: `9` | Scandal Resistance: `0.8` | Funds: `$45M` | Stamina: `8`
- **Traits**: `Buff`: Moral Articulator | `Debuff`: National Anonymity
- **Group Boosts**: Youth (`+7%`), Progressive Left (`+6%`), Secular (`+4%`)

---

### Raphael Warnock
- **Role**: VP Running Mate
- **Faction**: Mainstream Liberal (`mainstream_liberal`) | **Home State**: GA (`+2.0%` VP)
- **Stats**: Charisma: `1.4` | Debate Skill: `7` | Scandal Resistance: `0.5`
- **Group Boosts (As VP)**: Black (`+4%`), Urban (`+2%`)
- **Group Debuffs**: Rural Whites (`-1%`)

---

### JB Pritzker
- **Role**: VP Running Mate
- **Faction**: Mainstream Liberal (`mainstream_liberal`) | **Home State**: IL (`+1.5%` VP)
- **Stats**: Charisma: `0.8` | Debate Skill: `5` | Scandal Resistance: `0.4` | Funds Boost: `+$25M`
- **Group Boosts (As VP)**: Union (`+2%`), Suburban College (`+2%`)
- **Group Debuffs**: Rural (`-1%`)

---

## 3. Republican Candidates & VPs

### Donald Trump
- **Role**: Presidential Candidate
- **Faction**: America First Conservative (`america_first_conservative`) | **Home State**: FL (`+2.5%`)
- **Stats**: Charisma: `2.0` | Debate Skill: `6` | Scandal Resistance: `0.9` | Funds: `$95M` | Stamina: `7`
- **Traits**: `Buff`: MAGA Movement Leader | `Debuff`: Immovable General Ceiling
- **Regional Spillover**: Georgia (GA), North Carolina (NC) (`+1.0%`)
- **Group Boosts**: MAGA Base (`+15%`), Non-College (`+10%`), Rural (`+10%`), Evangelical (`+8%`)
- **Group Debuffs**: Suburban Women (`-8%`), Suburban College (`-8%`), Youth (`-7%`)

---

### JD Vance
- **Role**: Presidential Candidate & VP
- **Faction**: Populist Right (`populist_right`) | **Home State**: OH (`+2.2%` Pres / `+1.8%` VP)
- **Stats**: Charisma: `1.3` | Debate Skill: `7` | Scandal Resistance: `0.3` | Funds: `$75M` | Stamina: `8`
- **Traits**: `Buff`: Populist Heir | `Debuff`: Media Vulnerability
- **Group Boosts (As Pres)**: Blue Collar (`+8%`), Rust Belt Non-College (`+8%`), MAGA Base (`+7%`)
- **Group Boosts (As VP)**: Blue Collar (`+3%`), Non-College (`+2%`)
- **Group Debuffs**: Suburban College (`-5%`), Donor Class (`-4%`)

---

### Ron DeSantis
- **Role**: Presidential Candidate
- **Faction**: America First Conservative (`america_first_conservative`) | **Home State**: FL (`+2.2%`)
- **Stats**: Charisma: `0.8` | Debate Skill: `5` | Scandal Resistance: `0.5` | Funds: `$80M` | Stamina: `8`
- **Traits**: `Buff`: Executive Competence | `Debuff`: Retail Charisma Deficit
- **Group Boosts**: Evangelical (`+7%`), Suburban Conservative (`+6%`), Non-College (`+5%`)
- **Group Debuffs**: Independents (`-5%`), Suburban Moderates (`-6%`)

---

### Ted Cruz
- **Role**: Presidential Candidate & VP
- **Faction**: Religious Right (`religious_right`) | **Home State**: TX (`+2.1%` Pres / `+1.8%` VP)
- **Stats**: Charisma: `0.7` | Debate Skill: `9` | Scandal Resistance: `0.3` | Funds: `$70M` | Stamina: `8`
- **Traits**: `Buff`: Debate Master | `Debuff`: Likability Ceiling
- **Group Boosts (As Pres)**: Donor Conservative (`+6%`), Evangelical (`+7%`)
- **Group Boosts (As VP)**: Donor Conservative (`+3%`), Evangelical (`+3%`)
- **Group Debuffs**: Independents (`-5%`)

---

### Nikki Haley
- **Role**: Presidential Candidate
- **Faction**: Compassionate Conservative (`compassionate_conservative`) | **Home State**: SC (`+2.0%`)
- **Stats**: Charisma: `1.3` | Debate Skill: `7` | Scandal Resistance: `0.7` | Funds: `$75M` | Stamina: `8`
- **Traits**: `Buff`: Suburban Crossover | `Debuff`: MAGA Base Distrust
- **Group Boosts**: Suburban College (`+8%`), Independents (`+7%`), Suburban Women (`+6%`)
- **Group Debuffs**: MAGA Base (`-8%`), Non-College (`-5%`)

---

### Vivek Ramaswamy
- **Role**: Presidential Candidate
- **Faction**: America First Conservative (`america_first_conservative`) | **Home State**: OH (`+1.5%`)
- **Stats**: Charisma: `1.5` | Debate Skill: `8` | Scandal Resistance: `0.2` | Funds: `$65M` | Stamina: `9`
- **Traits**: `Buff`: Energy Engine | `Debuff`: Superficial Rhetoric
- **Group Boosts**: Youth Right (`+8%`), Tech Right (`+7%`), MAGA Base (`+5%`)
- **Group Debuffs**: Seniors (`-5%`), Institutional Conservative (`-4%`)

---

### Greg Bovino
- **Role**: Presidential Candidate
- **Faction**: America First Conservative (`america_first_conservative`) | **Home State**: CA (`+1.1%`)
- **Stats**: Charisma: `1.2` | Debate Skill: `5` | Scandal Resistance: `0.8` | Funds: `$70M` | Stamina: `8`
- **Traits**: `Buff`: Deportation Architect | `Debuff`: Electoral Toxicity
- **Group Boosts**: Non-College (`+5%`), Rural (`+4%`)
- **Group Debuffs**: Hispanic (`-8%`), Suburban College (`-9%`)

---

### Glenn Youngkin
- **Role**: Presidential Candidate
- **Faction**: Compassionate Conservative (`compassionate_conservative`) | **Home State**: VA (`+2.1%`)
- **Stats**: Charisma: `1.3` | Debate Skill: `7` | Scandal Resistance: `0.7` | Funds: `$85M` | Stamina: `7`
- **Traits**: `Buff`: Suburban Restoration | `Debuff`: MAGA Skepticism
- **Group Boosts**: Suburban Conservative (`+7%`), Suburban Moderates (`+6%`)
- **Group Debuffs**: Non-College (`-5%`)

---

### Chris Sununu
- **Role**: Presidential Candidate
- **Faction**: Compassionate Conservative (`compassionate_conservative`) | **Home State**: NH (`+2.0%`)
- **Stats**: Charisma: `1.4` | Debate Skill: `8` | Scandal Resistance: `0.8` | Funds: `$55M` | Stamina: `8`
- **Traits**: `Buff`: New England Pragmatist | `Debuff`: Base Alienation
- **Group Boosts**: Independents (`+7%`), Suburban Moderates (`+7%`)
- **Group Debuffs**: Evangelical (`-7%`), Populist Right (`-6%`)

---

### Don Trump Jr.
- **Role**: Presidential Candidate
- **Faction**: Populist Right (`populist_right`) | **Home State**: FL (`+1.5%`)
- **Stats**: Charisma: `1.4` | Debate Skill: `6` | Scandal Resistance: `0.5` | Funds: `$90M` | Stamina: `7`
- **Traits**: `Buff`: MAGA Heir | `Debuff`: General-Election Ceiling
- **Group Boosts**: Non-College (`+2%`), Rural (`+2%`)
- **Group Debuffs**: Suburban College (`-7%`), Suburban Women (`-6%`)

---

### Tulsi Gabbard
- **Role**: Presidential Candidate
- **Faction**: America First Conservative (`america_first_conservative`) | **Home State**: HI (`+1.4%`)
- **Stats**: Charisma: `1.5` | Debate Skill: `8` | Scandal Resistance: `0.6` | Funds: `$65M` | Stamina: `8`
- **Traits**: `Buff`: Anti-Establishment Magnet | `Debuff`: Partisan Mismatch
- **Group Boosts**: Independents (`+6%`), Veterans (`+5%`)
- **Group Debuffs**: Evangelical (`-5%`), Donor Conservative (`-4%`)

---

### Brian Kemp
- **Role**: Presidential Candidate
- **Faction**: Compassionate Conservative (`compassionate_conservative`) | **Home State**: GA (`+2.4%`)
- **Stats**: Charisma: `1.2` | Debate Skill: `7` | Scandal Resistance: `0.8` | Funds: `$80M` | Stamina: `8`
- **Traits**: `Buff`: Sun Belt Executor | `Debuff`: Trump Loyalist Grudge
- **Group Boosts**: Suburban Conservative (`+6%`), Rural (`+3%`)
- **Group Debuffs**: Populist Right (`-5%`)

---

### Nancy Mace
- **Role**: Presidential Candidate
- **Faction**: Compassionate Conservative (`compassionate_conservative`) | **Home State**: SC (`+1.5%`)
- **Stats**: Charisma: `1.3` | Debate Skill: `7` | Scandal Resistance: `0.4` | Funds: `$60M` | Stamina: `8`
- **Traits**: `Buff`: Media Combatant | `Debuff`: Ideological Whiplash
- **Group Boosts**: Suburban Women (`+4%`), Suburban Moderates (`+4%`)
- **Group Debuffs**: Evangelical (`-4%`)

---

### Liz Cheney
- **Role**: Presidential Candidate
- **Faction**: Compassionate Conservative (`compassionate_conservative`) | **Home State**: WY (`+1.2%`)
- **Stats**: Charisma: `1.2` | Debate Skill: `8` | Scandal Resistance: `0.8` | Funds: `$85M` | Stamina: `8`
- **Traits**: `Buff`: Institutional Martyr | `Debuff`: MAGA Excommunication
- **Group Boosts**: Suburban College (`+9%`), Independents (`+5%`)
- **Group Debuffs**: Non-College (`-10%`), Rural (`-9%`)

---

### Marco Rubio
- **Role**: Presidential Candidate & VP
- **Faction**: America First Conservative (`america_first_conservative`) | **Home State**: FL (`+2.0%` Pres / `+1.8%` VP)
- **Stats**: Charisma: `1.0` | Debate Skill: `6` | Scandal Resistance: `0.5` | Funds: `$75M` | Stamina: `8`
- **Group Boosts (As Pres)**: Hispanic (`+8%`), Suburban College (`+5%`), Donor Class (`+6%`)
- **Group Boosts (As VP)**: Hispanic (`+4%`), Suburban College (`+2%`), Donor Class (`+3%`)

---

### Tim Scott
- **Role**: VP Running Mate
- **Faction**: Religious Right (`religious_right`) | **Home State**: SC (`+1.8%` VP)
- **Stats**: Charisma: `1.3` | Debate Skill: `6` | Scandal Resistance: `0.6`
- **Group Boosts (As VP)**: Evangelical (`+3%`), Suburban Conservative (`+2%`)

---

### Elise Stefanik
- **Role**: VP Running Mate
- **Faction**: America First Conservative (`america_first_conservative`) | **Home State**: NY (`+1.3%` VP)
- **Stats**: Charisma: `1.1` | Debate Skill: `6` | Scandal Resistance: `0.3`
- **Group Boosts (As VP)**: Online Militant (`+2%`), Non-College (`+2%`)
- **Group Debuffs**: Suburban College (`-2%`)

---

### Kristi Noem
- **Role**: VP Running Mate
- **Faction**: America First Conservative (`america_first_conservative`) | **Home State**: SD (`+1.5%` VP)
- **Stats**: Charisma: `1.0` | Debate Skill: `5` | Scandal Resistance: `0.3`
- **Group Boosts (As VP)**: Rural (`+3%`), Evangelical (`+2%`)
- **Group Debuffs**: Suburban Moderates (`-2%`)

---

## 4. Third-Party & Independent Candidates & VPs

### Jill Stein
- **Party**: Green Party (`G`) | **Faction**: Outsider Leftist (`outsider_leftist`)
- **Home State**: MA (`+1.2%`) | **Stats**: Charisma: `0.8` | Debate Skill: `6` | Scandal Resistance: `0.4`
- **Siphon Rates**: Peels `5%` from Democrats, `1%` from Republicans.
- **Group Boosts**: Progressive Left (`+8%`), Anti-War Left (`+8%`)

---

### Chase Oliver
- **Party**: Libertarian Party (`L`) | **Faction**: Unaligned Center (`unaligned_center`)
- **Home State**: GA (`+1.2%`) | **Stats**: Charisma: `0.9` | Debate Skill: `5` | Scandal Resistance: `0.6`
- **Siphon Rates**: Peels `4%` from Republicans, `3%` from Democrats.
- **Group Boosts**: Libertarian (`+7%`), Youth Right (`+5%`)

---

### Robert F. Kennedy Jr. (RFK Jr.)
- **Party**: Independent (`I`) | **Faction**: Unaligned Center (`unaligned_center`)
- **Home State**: CA (`+1.5%`) | **Stats**: Charisma: `1.5` | Debate Skill: `7` | Scandal Resistance: `0.2`
- **Siphon Rates**: Peels `5%` from Republicans, `4%` from Democrats.
- **Group Boosts**: Anti-Establishment (`+9%`), Alternative Health (`+8%`)

---

### Claudia De la Cruz
- **Party**: PSL (`PSL`) | **Faction**: Outsider Leftist (`outsider_leftist`)
- **Home State**: NY (`+1.2%`) | **Stats**: Charisma: `1.1` | Debate Skill: `6` | Scandal Resistance: `0.5`
- **Siphon Rates**: Peels `1%` from Democrats.
- **Group Boosts**: Labor Left (`+5%`), Urban Youth (`+5%`)

---

## 5. Faction Synergy Matrix

When selecting a VP running mate, the candidate's faction and VP's faction combine to create ticket synergy:

| Presidential Faction | Compatible VP Faction (Bonus) | Incompatible VP Faction (Penalty) |
|---|---|---|
| **Mainstream Liberal** | Activist Left (`+0.8`), Pragmatic Moderate (`+0.6`) | Populist Right (`-0.6`), America First (`-0.6`) |
| **Activist Left** | Outsider Left (`+0.5`), Mainstream Liberal (`+0.8`) | Pragmatic Moderate (`-0.3`), Compassionate Cons (`-0.5`) |
| **Pragmatic Moderate** | Mainstream Liberal (`+0.6`), Unaligned Center (`+0.6`) | Activist Left (`-0.3`), America First (`-0.6`) |
| **America First Conservative** | Populist Right (`+0.8`), Religious Right (`+0.8`) | Unaligned Center (`-0.6`), Pragmatic Moderate (`-0.6`) |
| **Populist Right** | America First (`+0.8`), Religious Right (`+0.6`) | Compassionate Cons (`+0.2`), Mainstream Liberal (`-0.6`) |
| **Compassionate Conservative** | Unaligned Center (`+0.6`), Religious Right (`+0.4`) | Populist Right (`-0.4`), America First (`-0.4`) |

---

## How to Edit Candidates in the Game Code

If you wish to edit candidate stats, group boosts, home state advantages, or traits directly:
1. Open [`js/candidates.js`](file:///c:/Users/quavo/Downloads/campaign-2028-main/campaign-2028-main/js/candidates.js).
2. Locate the candidate or VP object in `CANDIDATES` or `VPS` array.
3. Modify stats (e.g. `charisma`, `debateSkill`, `homeStateBoost`, `funds`, `groupBoosts`).
4. Save the file and reload the game!
