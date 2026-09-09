# Decision 2028: comprehensive simulator overhaul

Copy this entire document into Gemini, or attach it together with the current repository and ask Gemini to implement it. The paths below are relative to the application folder containing `package.json`, `index.html`, and `server.js`; in the reviewed checkout that folder is nested inside another `campaign-2028-main` folder.

## Your assignment

Act as the implementation engineer for Decision 2028, the existing browser-based US presidential campaign simulator. Thoroughly implement the demographic, interest-group polling, county profile, issue, advertising, and turnout changes specified below. Start by inspecting the actual current code and data, then carry the work through implementation and verification. Deliver working integrated features and complete content, rather than stopping at a proposal, scaffolding, or a few examples.

Maintain a progress document with completed work, remaining work, assumptions, data gaps, and verification results so this project can continue across context limits. Complete phases in dependency order, keeping the application runnable. Ask concise questions when the answer changes the architecture or content scope; proceed with the documented defaults for nonblocking choices.

This is game simulation work. Keep factual demographic and historical inputs distinguishable from fictional scenario assumptions and game-balance parameters. Descriptions should be neutral and concrete. Do not represent a demographic identity as determining an individual's beliefs, or describe speculative 2028 developments as established facts.

## Scope and provisional defaults

The requested changes are:

1. Break broad racial/ethnic interest groups into detailed origin/ancestry subgroups, including Cuban American and Mexican American voters. Add substantive descriptions to all interest groups. Collapse subgroup lists under their broad parent groups by default.
2. Replace exact support displayed in interest-group screens with national weekly polls of each particular group. Default reported margin of error: **±3 percentage points**, with justified modifiers.
3. Add a substantive, fact-grounded profile to every playable county or county-equivalent, describing its communities, economy, circumstances, electoral history, and modeled ideological characteristics.
4. Expand broad issues into individual issues organized by topic, with seven named candidate positions: **Far Left, Left, Center Left, Center, Center Right, Right, Far Right**. Each issue and each position needs a detailed description.
5. Give each interest group its own detailed issue preferences and importance levels, including internal disagreement and examples where ideologically distant positions share policy outcomes.
6. Make issue advertising increase attention to that issue, with geographic reach, persistence, saturation, decay, and consequences for candidate preference and turnout.
7. Let players run attacks on a selected opponent's specific policy position, including each active third-party opponent. Show the selected opponent's current name, full-color portrait, party color, and relevant position.

Pending owner clarification, use these defaults: approximately 50 individual issues; a hierarchy that supports all major racial/ethnic categories, with detailed groups activated where the source data support them; H-1B for the ambiguous note “H1-B1”; and compatibility adapters for existing candidate/configuration data. H-1B1 is a separate visa category: ask if that was intended. Do not invent a full saved-game feature solely for this overhaul; if a persistence system exists in the supplied revision, migrate it safely. Make the new state serializable and versioned either way.

## Verified starting points: recheck before editing

These findings come from a read-only audit of the supplied checkout on September 1, 2026. The implementation you receive may have changed. Preserve existing uncommitted and untracked work, including the polling, spatial, and backtesting files. Older Markdown notes are historical context, not reliable evidence of current behavior.

| Area | Current implementation and implications |
| --- | --- |
| Application | Plain browser JavaScript with global objects and script ordering in `index.html`; a small Express static server in `server.js`, port 3000. Preserve this architecture unless a specific change requires otherwise. |
| County inputs | `counties/county_data.json` has 3,160 raw records. Every raw `ig` object currently contains only `rural`. Do not assume the broad demographic fields described in `CLAUDE_CONTEXT.md` are already loaded. |
| Existing workbook | `counties/us_county_data.xlsx`, `Sheet1`, has 3,142 data rows and 29 columns, including broad ethnicity, education, religion, political-group, and union columns. The first data row stores demographic fractions, while runtime `county.ig` expects percentages. Audit definitions, provenance, and coverage before conversion; workbook column names alone do not establish scientific validity. |
| Geography | `Counties.loadCountyData()` calls `applyFipsCrosswalk()` in `js/counties.js`, loads election baselines, voter rolls and turnout, and attaches economy data. Its Connecticut cloning and Alaska allocation logic need reconciliation before merging contemporary Census data. Raw record count is not a verified count of unique playable counties. |
| Groups | `js/interestGroups.js` defines group baselines, three-item priority lists, PACs, coalition breakpoints, and state demographic defaults. In `js/main.js`, `_mapGroupToIgKey()` currently aliases `cuban` to all Hispanic voters; `_getCountyIgValue()` returns zero for many missing fields. |
| Group support | `recomputeInterestGroupSupport()` in `js/main.js` weights county party support by group resident population, then applies other modifiers. This is a modeled estimate, not observed subgroup voting behavior. |
| Group UI | `renderInterestGroups()`, `renderInterestGroupDetail()`, and `renderCandidateSupport()` in `js/main.js` display `gameData.interestGroupSupport` and immediate support changes. They need a separate polling read path. |
| Polling | `js/polling.js` already has `Polling`, weekly state/national polls, averages, and history. `js/utils.js` separates some true and displayed polling getters. Extend the existing structure coherently. |
| Issues | `js/issues.js` has 20 core issues, legacy numeric positions, descriptions for only some issues, state positions, salience, credibility, polarization, synergies, and dealbreakers. Some group priorities reference IDs absent from `CORE_ISSUES`. |
| Candidate positions | Position consumers use several competing sources: static `CANDIDATE_POSITIONS`, live `candidate.issuePositions`, and the TV preview's `issueScores`. AI, debates, news, endorsers, PACs, and coalition checks also consume positions or numeric thresholds. |
| Alignment | `Persuasion.calculateAlignment()` derives group positions from general partisan baseline and reads static candidate positions. Its arithmetic does not match its advertised full negative-to-positive alignment range. Replace through a documented common interface. |
| Policies and importance | `js/policies.js` separately tracks policy importance and demographic buffs; state salience lives elsewhere. Distinguish policy visibility, credibility, and voter issue importance so they do not become duplicate boosts. Its generic third-party tracker also needs attention when keeping opponents independent. |
| Ads | Both `app.runTvAd()` in `js/main.js` and `DigitalAds`/`js/adsUI.js` implement ads; additional digital presets and county issue actions exist. Some paths assume the opponent is D or R. TV buys have immediate and ongoing processing, so verify the number of charged and delivered weeks. |
| Turnout | Actual vote totals involve `js/election.js`, `Counties.calculateCountyVoteTotals()`, group turnout in `js/main.js`, and persuasion/ground operations. `js/turnout.js` alone is not the whole engine. The county calculation normalizes group allocations within a voter pool: changing group turnout can redistribute votes without necessarily changing total votes cast. |
| Verification | `npm run build` and `npm run lint` only syntax-check `server.js`. `test-ads.js` uses CommonJS `require` despite module package configuration, references undeclared Puppeteer, and targets port 8000. These are insufficient verification of this overhaul. |

Inspect the remaining integration points in `js/config.js`, `js/screens.js`, `js/ai.js`, `js/debates.js`, `js/news.js`, `js/endorsers.js`, `js/endorsements.js`, `js/groundOps.js`, `js/mediaMarkets.js`, `js/backtesting.js`, `index.html`, and `style.css`. Search the entire repository for issue IDs, aliases, position arithmetic, support reads, and ad entry points rather than treating this list as exhaustive.

## Phase 1: establish data and geography contracts

Create a data inventory before changing simulation behavior. Document each field's source, reference period, unit, universe, geographic vintage, missingness, and whether it is measured, derived, or modeled. Check the existing workbook before deciding which broad inputs need to be obtained again. Never silently import its old population or vote columns over the current election baseline.

Use reproducible import scripts and checked-in, compact runtime assets. Do not download Census data or generate county narratives during a player's turn. Cache raw downloads outside publicly served runtime assets where practical; record source versions and transformation steps. Respect the static server's public directory when handling any credentials. No API key should be embedded in browser code.

Verified starting sources:

- [2020–2024 ACS B03001: Hispanic or Latino origin by specific origin](https://api.census.gov/data/2024/acs/acs5/groups/B03001.html). It supplies estimates and corresponding uncertainty fields for origins such as Mexican, Puerto Rican, Cuban, Dominican, and detailed Central/South American origins. Use the five-year product and confirm county geography support and variable definitions.
- [2024 ACS B02015: Asian alone by selected groups](https://api.census.gov/data/2024/acs/acs5/groups/B02015.html). Check the exact definitions and distinction from “alone or in any combination” tables before selecting categories. Preserve multiple-origin and residual categories as needed.
- [2020 Census Detailed DHC-A release and coverage](https://www.census.gov/newsroom/press-releases/2024/summary-file-2020-census-detailed-dhc-a.html). A possible source for additional detailed race, ethnicity, and tribal categories. Availability depends on population thresholds; unavailable is not zero.
- [2020–2024 Citizen Voting Age Population special tabulation](https://www.census.gov/programs-surveys/decennial-census/about/voting-rights/cvap.html). Use its documented demographic and geographic coverage to constrain eligible population estimates; do not assume every detailed origin has a directly observed county CVAP estimate.
- [Census county and county-equivalent changes](https://www.census.gov/programs-surveys/geography/technical-documentation/county-changes.html). In particular, reconcile Connecticut planning regions with the map's county geography and historical election data.
- [Census QuickFacts](https://www.census.gov/quickfacts/), [BEA county GDP](https://www.bea.gov/data/gdp/gdp-by-county), and [USDA county typology](https://www.ers.usda.gov/data-products/county-typology-codes) are starting points for sourced county context. Check reference years and definitions.

Select and pin a coherent source vintage. Later sources may be used after verification, but explain any mixed-year projection or harmonization. These datasets do not supply detailed political opinions for every county subgroup; those need separate evidence or explicitly labeled simulation assumptions.

Use five-character FIPS strings and explicit geographic mappings. Choose a canonical simulation geography and map display shapes to it, or use documented weighted crosswalks. Do not clone entire planning-region populations into several old counties, allocate Alaska uniformly without labeling the approximation, or retain source and destination records in the same voting totals. When converting geographic units, aggregate counts before recomputing percentages; quantify unmatched coverage and conservation error.

Keep these universes distinct: total residents, adults, citizen voting-age population, eligible voters, registered voters, and likely voters. CVAP is not identical to legal voting eligibility or registration. Any conversion of detailed resident origins into voting-population estimates must state assumptions, apply appropriate parent constraints, and preserve a missing-data/uncertainty flag. Never count children and noncitizens as presidential voters merely because they appear in a resident table.

Validate fractions versus percentages, missing/suppressed/sentinel values, duplicates, denominators, parent totals, and count conservation. Preserve measured zero. Avoid residual formulas such as `white = 1 - black - Hispanic - Asian - ...` unless the inputs are explicitly mutually exclusive and exhaustive under the same definition.

## Phase 2: interest-group hierarchy and coherent voter accounting

Define stable group IDs with parent IDs, category, population definition, description, data references, model assumptions, and applicable behavioral parameters. Separate exclusive demographic partitions from overlapping memberships such as religion, education, age, occupation, and political affiliation.

Support detailed Hispanic origins available in the chosen source, including Mexican, Puerto Rican, Cuban, Dominican, Salvadoran, Guatemalan, Colombian, Venezuelan, and appropriate remaining origins and residuals. Support source-backed detail in Asian and other major racial/ethnic categories. Do not force multi-ancestry categories into an exclusive partition or invent county counts for unavailable groups. Clearly document how any subgroup taxonomy maps to source definitions.

For each group, write a substantive description covering its definition, geographic distribution, internal diversity, economic/social context, and modeled issue profile. Use sourced descriptive facts and label opinion estimates as survey-based or modeled. Include all existing religious, occupational, age, demographic, and political groups in the description pass, not only newly added origin groups. Do not give every member identical positions.

Fix `cuban -> hispanic` and other overbroad aliases. Parent membership may inform inherited defaults, but a parent and child must not both add a full copy of the same people or the same candidate bonus. Parenthood is not an extra electorate. A purely administrative split with identical child behavior must preserve parent support, population, and total votes.

Choose and document one coherent accounting method before expanding the model. Possibilities include weighted voter cells with overlapping attributes, or a bounded approximation using one exclusive population partition and normalized modifiers for other attributes. Avoid creating a huge full Cartesian product of county × every group × every issue × every candidate. Clearly mark synthetic intersections; marginal Census tables do not establish their joint distribution.

Maintain a one-way dependency from immutable population/baseline inputs to local modeled preferences and turnout, then county/state/national aggregates, then polls. National group summaries must not repeatedly feed back into the same county truth as fresh evidence. Recomputing or opening a panel must not progressively amplify a modifier.

UI requirements: broad parent groups visible initially; children collapsed by default; accessible expand/collapse controls; search that can reveal matching children; separate details and expansion actions; meaningful parent summaries; mobile-friendly layout; and clear population-versus-electorate labeling. Keep expansion state during a session. Category filtering must include relevant existing categories, including age.

## Phase 3: detailed issues and seven named positions

Create one issue registry used by every consumer. Organize approximately 50 substantive leaf issues into sections. Suggested coverage to develop and reconcile with the existing game:

- Economy and work: inflation/cost of living, taxation, trade/tariffs, industrial policy, minimum wage, collective bargaining, competition/antitrust, and small-business regulation.
- Housing and infrastructure: housing supply/zoning, housing affordability assistance, transportation/infrastructure, and rural broadband.
- Healthcare and retirement: coverage/insurance, prescription prices, Social Security, Medicare, and mental health/addiction.
- Immigration: border security, asylum, deportation/enforcement, legal status/citizenship, legal immigration levels, H-1B skilled-work visas, and agricultural/seasonal visas.
- Foreign policy and defense: Israel/Palestine, Venezuela, Ukraine/Russia, China/Taiwan, alliances/NATO, overseas military intervention, defense spending, and foreign aid.
- Energy and environment: emissions policy, fossil-fuel development, nuclear power, renewable deployment, and water/conservation.
- Rights, justice, and education: abortion, gun policy, LGBTQ+ rights, policing, sentencing/incarceration, cannabis, religious liberty, K–12 education, and higher education/student debt.
- Governance and technology: election administration, campaign finance, executive power, judicial institutions, privacy/surveillance, and AI regulation.

Finalize a counted catalog around the agreed size without padding with duplicate mechanics. The examples are topic coverage, not an assertion that a particular ideological side holds a particular position. Keep category/grouping IDs separate from playable leaf issue IDs; broad legacy `foreign` or `immigration` references need explicit mappings.

For every issue provide its definition and scope, category, seven position records, and relevant policy dimensions or compatibility rules. Each of the seven positions must have an issue-specific description, ideally two to four concrete sentences describing preferred actions and tradeoffs. Avoid generic “supports more/less government” filler, partisan caricatures, or assumptions that Center is inherently correct. Distinguish documented real-world positions from fictional scenario placements, with sources and dates where claims concern real candidates.

Use stable position IDs such as `far_left`, `left`, `center_left`, `center`, `center_right`, `right`, `far_right`. Ordinal coordinates may support ordering and summaries, but **ideological label distance must not be the universal policy-agreement formula**. Some positions far apart on the labels can share substantive proposals. Represent this using documented issue-specific policy vectors, compatibility matrices, or another explicit model. Agreement on an outcome need not mean agreement on motives, methods, or other issues. Do not assume that all extremes agree or that all issues follow a horseshoe pattern.

Provide at least three researched or explicitly fictionalized simulation examples of cross-ideological agreement and an automated fixture proving that mechanically similar policy outcomes can produce agreement despite distant labels. Use a synthetic issue/candidate fixture when testing model behavior so the test is not an unsupported claim about real people.

Centralize live candidate stance access. Updating a stance must update player and opponent comparisons, persuasion, ads, debates, events, endorsements, PACs, coalition checks, and policy adoption consistently. Static candidate data must not override a stance changed during the campaign. Clone defaults per campaign to avoid contaminating subsequent games. Distinguish missing/unknown from Center.

Document migration from old numeric positions, thresholds, and broad issue IDs. Numeric bucketing is suitable only as a reviewed initialization for comparable issues; it does not establish every new subissue stance. Use explicitly tagged scenario defaults where detailed candidate evidence is absent. Update AI position changes to valid steps and maintain existing costs, credibility consequences, and faction rules where applicable.

## Phase 4: group preferences, importance, advertising, and turnout

For every supported group and every leaf issue, resolve a complete preference profile: a distribution across positions or policy attributes, summarized mean/mode, dispersion, baseline importance, current effective importance, relevant rigidity/dealbreakers, and provenance/confidence. Sparse storage and inherited defaults are fine if an inspector shows the resolved values and all inheritance. Audit coverage; do not silently give every new issue equal weight.

The mean is a summary, not a substitute for distribution. Two groups with the same mean can react differently when one is concentrated near the middle and the other has two distinct peaks. Group partisan baseline must not dictate every issue position. Use national group defaults plus documented local adjustments where evidence supports them; uncertainty should remain visible for modeled local differences.

Choose one documented scale for importance and distinguish it from policy visibility, credibility, support, and turnout. Maintain a bounded attention budget or normalized relative weights so campaigning cannot make every issue maximally dominant. Category summaries should aggregate leaf issues without being counted again as additional issues.

All issue speeches and advertising paths must call the same attention/effect service. Effects should depend on actual modeled reach, exposure, repetition, saturation, issue relevance, and location. Media markets crossing state boundaries must affect all included counties appropriately. Preserve measured zeroes and initialize missing entries instead of silently skipping states absent from the salience defaults.

Implement bounded increases, diminishing returns, fatigue, and return toward baseline over weeks. Separate the ad's attention effect from immediate persuasion and durable stance changes. Increased attention is shared awareness of an issue: it can help any candidate whose stance appeals to the affected voters. Buying an issue ad must not guarantee a net benefit to its sponsor.

Compute support choice separately from participation probability. Explain the update order and equations, with tunable constants and units. A suitable accounting contract is expected votes = eligible/registered modeled population × participation probability × conditional candidate preference, with each person represented once. Adapt it to the game's registration and inactive-voter model without adding the same voter twice.

Higher salience can strengthen participation among voters who see a meaningful stake, change preference among candidates, or create disengagement when available choices are unacceptable. Model these as bounded, documented gameplay assumptions, including possible opponent mobilization. Integrate existing ground operations, enthusiasm, coalition, and inactive-voter effects once each. Keep participation probabilities within [0,1], candidate preferences normalized, and vote totals inside the appropriate voter pool.

Specifically fix the possibility that turnout changes are canceled by renormalizing a fixed county voter pool. When all otherwise identical modeled voter cells become more likely to participate, expected ballots cast must increase. When only preferences change, people must not be created. Distinguish turnout rates from turnout multipliers in storage and UI.

## Phase 5: opponent-specific policy attacks

Create a shared ad payload with sponsor candidate ID, target candidate ID for attacks, issue ID, attacked stance snapshot, message/ad type, geography, channel, budget, intensity, duration, and delivery bookkeeping. Use runtime candidate IDs and resolve party/vote storage through a common adapter. Do not collapse Green, Libertarian, Independent, and PSL opponents into one target.

Use the live active-candidate registry to populate an opponent selector. Exclude the sponsor and unavailable candidates; honor the game's third-party settings and relevant ballot-access rules. Show the selected opponent's name, full-color image, party label/color, and current stance description beside the sponsor's stance. Provide an image fallback and labels accessible without color. Update the preview immediately when either opponent or issue changes.

Use a grouped, searchable issue selector. Require a valid issue and target before spending resources. Show cost, reach, duration, and qualitative uncertainty/backlash information; do not reveal exact hidden vote changes or subgroup truth as a preview.

Apply attacks through the same substantive agreement and attention model as other issue communication. The targeted stance may become less attractive to some voters and more attractive to others; displaced support may reach another candidate, undecided status, or nonparticipation. Model credibility, contrast, saturation, and backlash without awarding an automatic sponsor bonus. Keep candidate popularity/favorability conceptually distinct from policy alignment.

Route the map TV buttons, TV-buy modal, digital planner, presets, ongoing delivery, and AI buying through the shared implementation. Test that every purchased week is delivered exactly once. Failed validation spends no funds or energy. Document what happens if a target withdraws, becomes unavailable, or changes stance during a buy. Preserve a historical stance snapshot for the purchased message while resolving the target's current identity correctly.

Log which candidate and issue were targeted, and make those visible in active-ad history. Existing biographical and mobilization advertising must remain functional. AI should use the same valid targets, stance registry, budgets, and effect rules.

## Phase 6: national weekly interest-group polling

Keep latent support used for elections separate from published polls. Group polls describe the nationwide electorate belonging to that group, not a county's results, group population share, or the group's percentage of the entire electorate. Weight local subgroup preferences by the selected likely-voter/registered-voter universe and state that universe in the UI.

Extend `Polling` with a namespaced group history or a companion module under the same lifecycle. Produce a baseline observation, then one defined weekly published observation for each eligible group. Store campaign/seed ID, group ID, week/date, candidate roster, estimates, undecided share when applicable, effective sample size, confidence level, reported margin, and adjustment metadata. Retain historical rosters when candidates change.

Default headline margin: **±3.0 percentage points at 95% confidence**. Treat this as an explicit simulated group polling product with its own effective sample, rather than pretending every small subgroup in a generic national survey naturally has that precision. The standard maximum-margin planning relationship is `m = 1.96 * sqrt(0.25 / n_eff)`, with `m` expressed as a fraction; `m = 0.03` gives approximately 1,068 effective respondents. Document the interval method actually used and show smaller candidate-specific intervals only if implemented consistently.

Use a coherent candidate-share sampling model with nonnegative results, normalized totals, and appropriately related errors. Do not independently add uniform ±3 noise to each candidate, renormalize it, and call that a calibrated 95% interval. Test empirical coverage over many deterministic simulation draws. A reported interval is uncertainty around an estimate, not a hard limit on the difference from truth.

Allow configurable, explained modifiers through effective sample size, sampling/weighting design, or an explicitly separate nonsampling error component. For example, subgroup sample availability, oversampling, or sampling design can change precision. Opinion volatility, nonresponse, coverage, and systematic pollster bias are different concepts; do not silently bundle all of them into a statistical sampling margin. Avoid arbitrary ethnicity-based “reliability” penalties. Use [AAPOR's sampling-error explanation](https://aapor.org/wp-content/uploads/2023/01/Margin-of-Sampling-Error-508.pdf) and [subgroup polling guidance](https://aapor.org/wp-content/uploads/2022/12/Measuring-Sub-Group-Preferences-508.pdf) to verify the statistical choices.

Publish and store the draw once. Reopening a modal, filtering groups, changing map selection, redrawing, or serializing/restoring the same campaign state must not generate a fresh poll. Isolate polling randomness from gameplay randomness so changing poll settings cannot change an election outcome. Use the completed weekly simulation state, including relevant events and ads, then publish polls in a documented order.

Replace exact support and instantaneous deltas in both group cards and detail screens with the latest published estimate and change from the previous published week. Include candidate names/colors, polling week, sample information, ± margin, and a history table/chart. Missing polls should display unavailable or stale status, never silently fall back to truth. Keep developer diagnostics clearly separate from player-facing information.

Parent latent support must equal its properly weighted children where they form an exhaustive partition. For parent and child polls, choose and document whether estimates come from a shared stratified sample or separate polling products. Separate observations need not sum perfectly; a shared product requires coherent covariance and uncertainty. Do not average child margins of error or fabricate group history from current truth.

## Phase 7: county profiles and content completeness

Create a versioned county-profile asset keyed to canonical simulation geography, loaded on demand or in efficient batches. Provide a short tooltip summary and a longer profile of roughly 100–180 useful words per playable county, plus structured tags and sources. Avoid padding small counties with invented detail.

Each profile should cover verified settlement/community context, major economic sectors or institutions, relevant local conditions, historical electoral patterns, and a clearly identified modeled political summary. Electoral party vote share is not direct measurement of residents' policy beliefs. Keep historical facts immutable while current campaign effects and polls appear in separate dynamic fields.

Build an offline generation pipeline: collect structured facts and source references, generate prose from that fact packet, validate references and numeric claims, and track review status. Use official county/municipal or institutional sources for named landmarks, universities, bases, or employers when the bulk datasets do not establish those facts. Omit unsupported specifics.

Generate in resumable batches with coverage reports. A factual template fallback may cover a data-poor county, but mark the fallback in the content audit and make its wording specific to known facts. Do not call the content pass complete after writing only a few showcase counties. Check urban, suburban, rural, low-population, tribal-area, independent-city, parish, Alaska, and Connecticut examples. Every playable geography must resolve to a correct profile or an explicit documented gap.

## Verification and definition of done

Add focused, runnable tests and data validators for this substantive model change. Use synthetic fixtures for controlled behavior and representative real county records for data integration. Repair or replace the broken test assumptions only as needed; syntax-checking the server alone is not acceptance.

Required checks:

1. Every enabled issue has seven unique valid position IDs and seven substantive descriptions. Every supported group resolves all issue profiles. No dangling priority, policy, event, PAC, or endorsement issue IDs remain.
2. Changing a live stance is reflected consistently in all consumers. Starting a second campaign does not inherit mutated candidate defaults.
3. Identical-behavior child groups reproduce their parent and preserve totals. Parent/child overlap and overlapping demographic attributes do not manufacture voters or duplicate buffs.
4. County imports preserve leading-zero IDs, units, true zeroes, source universes, and population/vote conservation. Connecticut/Alaska mappings do not clone electorate totals. Missing data is reported.
5. Repeated read/recompute operations leave simulation state unchanged. No national-to-county feedback compounds support modifiers without a new action.
6. Polls are stable within a week, change only on publication, include all valid candidates, and keep normalized shares. Noise-only changes cannot alter latent support or election results. Default uncertainty and sample metadata agree; seeded distribution tests verify the claimed interval behavior.
7. UI reveals published group estimates and prior-week deltas, including at baseline and with missing data. Parent/child polling behavior matches the chosen sampling design.
8. Synthetic policy examples verify both ordinary disagreement and cross-ideological agreement. A bimodal group can react differently from a centrist group with the same mean.
9. Issue exposure affects the intended geography, raises attention with diminishing returns, decays toward baseline, and can benefit an opponent. Cross-state media markets and previously absent salience entries work.
10. Mobilization changes total expected ballots when appropriate; pure preference shifts conserve the population. Rates stay within bounds and no voter enters both active and inactive pools twice.
11. Attack ads can independently target D, R, G, L, I, and PSL candidates when active, including when the player is a third party. Preview name, portrait, color, issue, and stance match the actual target. Invalid actions cost nothing. Multiweek delivery has no extra first/final tick.
12. Existing biographical ads, ground operations, debates, endorsement/PAC consequences, election night, ballot access, and state/national polling still work.
13. Every canonical playable county has a profile with sources/review status. Every group has a complete description. Report exact content counts and any unresolved gaps.
14. Browser smoke tests cover start, group expansion/search, weekly poll history, stance changes, policy adoption, TV and digital issue attacks, weekly progression, and election results. Check keyboard use, narrow screens, missing images, and console errors.
15. Measure startup size and weekly-turn time against the pre-change baseline. Cache reusable calculations and load county prose efficiently; publish the measurements and explain material regressions.

Use a small end-to-end slice early to validate the contracts—one subgroup hierarchy, several issues, one ad path, one weekly poll, and turnout accounting—then complete the full specified coverage. Keep the baseline fixture stable and explain intentional balance changes rather than forcing every old outcome to remain identical.

At delivery, summarize implemented behavior, changed files, data sources and vintages, measured versus modeled inputs, migration decisions, completed content counts, tests actually run, performance results, and remaining limitations. Provide exact instructions for running the app and rebuilding data. If source access blocks part of the work, identify the specific missing table/file and affected feature, finish independent work, and never substitute invented data or claim that blocked work is complete.
