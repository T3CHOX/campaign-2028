# Decision 2028 Simulator — Complete Guide

## Overview
Decision 2028 is a vanilla JavaScript campaign simulator that models U.S. presidential elections at the state and county level. Players pick a party and ticket, allocate actions (ads, rallies, speeches, field ops, digital), and try to reach 270 EV while managing funds, energy, turnout, and coalition dynamics. The UI is a multi-screen single-page app powered by static assets (SVG maps, CSV/JSON data, images).

## Runtime Flow (High Level)
1. **index.html** loads CSS and JS in dependency order.
2. **config.js** defines constants and the global `gameData` state.
3. **candidates.js**, **issues.js**, **interestGroups.js**, **states.js** load static data used by gameplay.
4. **counties.js** loads `counties/county_data.json` and initializes county/state margins.
5. **main.js** runs `initGameData()` on `DOMContentLoaded` and exposes the `app` UI API.
6. **screens.js** handles party/candidate/VP selection screens.
7. **campaign.js** drives the campaign map, HUD, actions, and weekly progression.
8. **persuasion.js** queues and applies campaign actions to county vote shares and turnout.
9. **ai.js** runs opponent actions each week.
10. **election.js** simulates election night (reporting, calls, results, analysis mode).

---

## File-by-File Reference

### .github/copilot-instructions.md
Contributor guidance for the Copilot agent (stack, architecture, naming, FIPS handling, testing expectations).

### 2028wiki
Long-form background/reference text (Wikipedia-style) describing the fictional 2028 election context, parties, and candidates. Not used by runtime code.

### LOOKHERE
Standalone candidate list draft (JavaScript array format) with detailed candidate profiles. Appears to be a reference/alternate dataset, not used by runtime code.

### IMAGE_SIZES.md
Recommended image dimensions, formats, and naming conventions for candidate/VP photos and party logos.

### IMPLEMENTATION_SUMMARY.md
Historical implementation notes for prior fixes (FIPS padding, interest group additions, Maricopa adjustment) and manual test verification checklist.

### index.html
Single-page HTML shell defining all screens and modals:
- **Intro screen** (start button)
- **Party selection screen** (major/minor party panels + third-party toggle)
- **Party page screen** (candidate/VP selection; rendered by `screens.js`)
- **Game screen** (map, sidebar, HUD, action menu, modals)
- **Election screen** (election night map, EV bars, results panels)
- **Modals/drawers**: issues panel, national overview, speech/field/digital modals, fundraising, PAC offer, interest groups, county view overlays.
- **Script load order** ensures data modules load before logic modules.

### style.css
Primary stylesheet (≈4k lines) covering layout, typography, color tokens, screen transitions, map styling, tooltips, HUD, action buttons, modals, election-night UI, analysis center, interest groups panel, and responsive breakpoints.

### map.svg
Interactive U.S. state SVG map used for campaign and election screens. Each state path uses its two-letter code as the SVG id.

### MapChart_Map.svg
Alternate/legacy U.S. SVG map asset (not directly referenced in runtime code).

### just_the_centroids.json
County centroid reference data (likely used for offline preprocessing; runtime uses centroids embedded in `county_data.json`).

### counties/2000-2020-countypres.csv
Historical county presidential results (2000–2020) used for election-night shift analysis.

### counties/2024_US_County_Level_Presidential_Results.csv
2024 county results used for shift map mode and 2024 baseline comparisons.

### counties/county_data.json
Primary county dataset used by the simulator (population, vote shares, interest-group composition, centroids, type tiers, etc.).

### counties/us_county_data.xlsx
Source spreadsheet for county data (offline reference; not used at runtime).

### counties/uscountymap.svg
County-level SVG map for drilldown views in campaign and election screens.

### counties_rural%.csv
County rural-percentage dataset used by the merge script to assign rural tiers.

### images/
All image assets used in the UI (candidate portraits and party logos):
- **Candidate portraits (JPG):** aoc, bannon, beshear, booker, buttigieg, carlson, cruz, delacruz, desantis, emanuel, haley, harris, hawley, kelly, khanna, newsom, noem, oliver, paul, pritzker, ramaswamy, rubio, scott, shapiro, stefanik, stein, stewart, trump, vance, ware, warnock, whitmer.
- **Party logos (PNG):** party-dem, party-grn, party-ind, party-lib, party-psl, party-rep.

### scripts/merge-county-rural-data.js
Node.js utility to merge rural-percentage CSV data into `counties/county_data.json` and assign county tier labels.

**Functions:**
- `parseCsvLine(line)`: CSV parser with quote handling.
- `toTier(ruralPct)`: Maps rural % to tier labels (Highly Urban → Deep Rural).
- `main()`: Loads CSV + JSON, merges rural %, writes updated JSON (or prints to stdout), logs stats.

---

## JavaScript Modules (Detailed)

### js/config.js
**Purpose:** Core configuration, constants, and initial global state.

**Key Data:**
- `PARTIES`: Party definitions (name, shortName, color, description).
- `ISSUES`: Legacy issue list (10 items).
- `STATES`: State metadata (name, EVs, baseline lean, FIPS).
- `REGIONS`: Regional groupings for spillover logic.
- `POLL_CLOSE_TIMES` / `COUNTY_POLL_CLOSE_OVERRIDES`: Poll closing schedules for election night.
- `SPLIT_ELECTORAL_RULES`: ME/NE split-EC district rules.
- `gameData`: Global runtime state (tickets, funds, energy, states, logs, PACs, turnout, queued actions, etc.).
- `PERSUASION_CONSTANTS`, `CREDIBILITY_CONSTANTS`, `FUNDRAISE_CONSTANTS`, `COALITION_CONSTANTS`: Tuning parameters.
- `TARGETABLE_GROUPS`: Allowed groups for field/digital targeting.

### js/candidates.js
**Purpose:** Candidate and VP datasets plus issue positions.

**Key Data:**
- `CANDIDATE_DEFAULTS`: Default values for candidate objects.
- `CANDIDATES`: Full list of presidential candidates with buffs/debuffs and regional spillover.
- `VPS`: Vice-presidential options (same schema as candidates).
- `CANDIDATE_POSITIONS`: Issue positions (-10 to +10) for each candidate.
- Candidate list is normalized via `.map()` to apply defaults and ensure required fields.

### js/issues.js
**Purpose:** Issue definitions, state positions, and issue-to-group effects.

**Key Data:**
- `CORE_ISSUES`: Canonical issues list with categories.
- `POSITION_DESCRIPTORS`: Text descriptors for issue scales.
- `STATE_ISSUE_POSITIONS`: Average voter positions per state.
- `ISSUE_SALIENCE`: Issue importance per state.
- `ISSUE_GROUP_BASELINE_EFFECTS`: Baseline group response to issue positions.
- `ISSUE_SYNERGY_EFFECTS`: Bonus effects for combined positions.
- `ISSUE_COALITION_CONFLICTS`: Warnings for conflicting issue stances.

### js/interestGroups.js
**Purpose:** Interest group definitions, PACs, and coalition constraints.

**Key Data:**
- `INTEREST_GROUPS`: Group baselines, priorities, and explicit support percentages.
- `PACS`: Fundraising PAC definitions, priorities, vulnerability risks.
- `COALITION_BREAKPOINTS`: Loyalty and leakage rules for specific coalitions.
- `COALITION_CROSS_PRESSURES`: Additional penalties for conflicting signals.
- `STATE_DEMOGRAPHICS`: Per-state demographic composition.
- `DEFAULT_DEMOGRAPHICS`: Fallback composition.

### js/states.js
**Purpose:** State-level extensions and county linking.

**Key Data:**
- `STATE_FUNDRAISING_POTENTIAL`: Fundraising potential by state.
- `STATE_COUNTIES`: Sample county list mapping (placeholder).

**Functions:**
- `enhanceStateData()`: Adds fundraising metadata and populates county lists for each state from `Counties.countyData`.

### js/turnout.js
**Purpose:** Shared turnout helper utilities.

**Functions (Turnout object):**
- `calculateCountyTurnout(county, candidate)`: Returns turnout multiplier (capped at 1.5).
- `applyModifier(county, candidate, amount)`: Adjusts a candidate’s turnout multiplier in a county.
- `getTurnoutDescription(turnout)`: Maps turnout multiplier to text (“Strong”, etc.).
- `getStateTurnout(stateCode, candidate)`: Placeholder for statewide aggregate turnout.
- `applyRallyEffect(county, adjacentCounties, candidate)`: Turnout boost in a county and adjacent ones.
- `applyIssueCampaignEffect(county, alignment, candidate, opponentCandidate)`: Turnout change from issue alignment.
- `calculateFinalVotes(baseVotes, turnout)`: Applies turnout to base votes.

### js/utils.js
**Purpose:** Cross-cutting UI and data helpers.

**Functions (Utils object):**
- `showToast(msg)`: Shows temporary toast message.
- `addLog(message)`: Adds message to campaign log feed.
- `getMarginColor(margin)`: Converts margin to map color.
- `formatDate(date)`: Formats date as “MON DD”.
- `formatTime(timeValue)`: Formats floating-hour values to AM/PM time.
- `isThirdParty(partyCode)`: Returns true for non-D/R parties.
- `shuffleArray(array)`: Randomly shuffles and returns a new array.
- `getActiveCandidates()`: Returns active presidential candidates in current game.
- `getStatePollingByParty(stateCode)`: Aggregates per-party polling from county data.
- `getCountyPollingByParty(county)`: Returns per-party polling for a county.
- `_getRankedCandidates(pcts, prevPcts)`: Internal ranked list with deltas.
- `_formatCandName(cand, party)`: Formats “Name (P-ST)” strings.
- `buildCandidateRankedListHTML(pcts, prevPcts)`: HTML list for campaign polling panel.
- `buildElectionRankedListHTML(reportedVotes, reportedPct, ev, projStatus)`: HTML list for election results panel.
- `getShiftColor(shift)`: Color for historical shift map mode.

### js/screens.js
**Purpose:** Party/candidate/VP selection flow and screen navigation.

**Functions (Screens object):**
- `goTo(screenId)`: Switch active screen.
- `selectParty(partyCode)`: Initializes selection flow and shows party page.
- `skipParty(partyCode)`: Removes a third party from the election.
- `showPartyPage(partyCode, phase)`: Renders candidate/VP selection UI.
- `_getSelectedPresForParty(partyCode)`: Resolves selected pres ID for party.
- `_buildCandidateTile(c, color, selected)`: Builds candidate selection tile HTML.
- `_buildVpTile(v, color)`: Builds VP selection tile HTML.
- `_hexToRgb(hex)`: Converts hex color to RGB string.
- `selectTile(tileEl, partyCode, type)`: Stores selection and enables continue.
- `_storeTicketPres(partyCode, cand)`: Stores presidential pick in `gameData`.
- `_storeTicketVP(partyCode, vp)`: Stores VP pick in `gameData`.
- `advancePartyPage()`: Advances to VP phase or next party.
- `goPartyPageBack()`: Navigates backward in selection flow.
- `renderCandidates()`, `renderVPs()`, `selectCandidate()`, `selectVP()`, `renderOpponentScreen()`, `renderTicketCards()`, `updateStartButton()`: Legacy stubs for compatibility.

### js/ai.js
**Purpose:** Opponent AI strategy selection and action execution.

**Key Data:**
- `AI_PERSONALITIES`: Strategy weights and biases.
- `AI_CANDIDATE_PERSONALITIES`: Candidate → personality mapping.

**Functions (OpponentAI object):**
- `getTicket(party)`: Returns ticket for a party.
- `getPersonality(party)`: Returns personality based on candidate ID.
- `determineStrategy(party, personality)`: Chooses swing/defend/expand/fundraise.
- `executeTurn(opponentParty, stamina)`: Runs a full AI turn and actions.
- `chooseAction(strategy, party, personality, focusState)`: Returns action object.
- `pickStateByStrategy(strategy, party)`: Delegates to state-picking helpers.
- `pickReactiveState(party)`: Targets player-pressured states.
- `pickSwingState(party)`: Chooses close-margin states.
- `pickDefendState(party)`: Chooses states narrowly led by AI party.
- `pickExpandState(party)`: Chooses mildly trailing states.
- `pickHopelessState(party)`: Chooses deeply trailing states (mistake behavior).
- `pickFundraisingState(party)`: Chooses fundraising hubs.
- `pickPriorityCounty(stateCode, party)`: Finds high-population swing county.
- `applyVpPressure(party)`: Shifts candidate positions toward VP positions.
- `executeAction(action, party)`: Applies turnout adjustments and logs.

### js/campaign.js
**Purpose:** Core campaign UI, map interactions, weekly progression.

**Key Data:**
- `GAME_CONSTANTS`: PAC offer chance, delays, credibility penalties.

**Functions (Campaign object):**
- `initMap()`: Loads county data and map SVG, sets event handlers.
  - Inline handlers: `wrapper.ondblclick`, `xhr.onreadystatechange`, `path.onclick`, `path.ondblclick`, `path.onmousemove`, `path.onmouseleave`.
- `showTooltip(e, state)`: Shows state hover tooltip.
- `clickState(code)`: Selects state and updates sidebar UI.
- `colorMap()`: Colors state map by current margins.
- `updateScore()`: Computes EV projection and updates EV bar.
- `updateHUD()`: Updates top HUD (candidate, funds, energy, credibility, date).
- `handleAction(action)`: Routes user action to fundraise/rally/speech/field/digital.
- `handleSpeech(issueId, intensity)`: Queues speech action and updates UI.
- `openStateBio()`: Opens intelligence report modal.
- `getInterestGroupBreakdown(stateCode)`: Returns HTML snippet for demographics.
- `nextWeek()`: Applies queued actions, advances time, processes AI and events.
- `processUndecidedVoters()`: Gradually resolves undecided voters by state margin.
- `processMediaVulnerabilities()`: Applies PAC/media risk penalties.
- `opponentTurn()`: Executes opponent AI actions.
- `saveState()`: Pushes undo snapshot to history stack.
- `undoLastAction()`: Restores previous snapshot.
- `closeCountyView()`: Exits county view UI.

### js/persuasion.js
**Purpose:** Action queueing, persuasion math, and turnout effects.

**Functions (Persuasion object):**
- `getGroupIssueImportance(groupId, issueId)`: Returns weight based on group priorities.
- `calculateAlignment(candidateId, groupId, issueId)`: Issue alignment score (-1 to +1).
- `calculateSaturationFactor(pressure)`: Diminishing returns for repeated actions.
- `queueAction(action)`: Validates, charges costs, and queues action.
- `applyQueuedActions()`: Applies all queued actions and updates state margins.
- `applyAdAction(action)`: Statewide ad effect (persuasion + turnout).
- `applySpeechAction(action)`: Speech effect (localized + statewide).
- `applyRallyAction(action)`: Rally turnout boost.
- `applyFieldAction(action)`: Demographic-targeted turnout boost.
- `applyDigitalAction(action)`: Targeted persuasion + turnout.
- `calculateCountyPersuasion(...)`: Core persuasion delta calculation per county.
- `getCountyDemographics(county)`: Returns ig data or state fallback.
- `getStateCodeFromFips(fips)`: Converts FIPS to state code.
- `applyMarginShift(county, delta)`: Adjusts D/R vote shares based on player party.
- `applyTurnoutBoost(county, boostAmount)`: Applies turnout multipliers by party.
- `getPendingActionsSummary()`: Human-readable queue summary.

### js/counties.js
**Purpose:** County data management, county map UI, county-to-state aggregation.

**Functions (Counties object):**
- `normalizeFips(fips)` (first): Pads to 5 digits for consistent keys.
- `loadCountyData(callback)`: Loads `county_data.json`, initializes county state.
  - Inline handler: `xhr.onreadystatechange` to parse JSON and initialize counties.
- `getCountyCentroid(fips)`: Returns centroid coordinates.
- `getPixelDistance(pointA, pointB)`: Euclidean distance between points.
- `calculateRallyDistanceRatios()`: Calculates miles-per-pixel calibration.
- `initializeRallyDistanceRatios()`: Initializes rally distance ratios once.
- `getMilesPerPixelRatio(stateFips)`: Returns ratio for lower-48/Alaska.
- `hasRallyDistanceRatios()`: Validates distance ratios.
- `getStateCodeFromFips(stateFips)`: Maps FIPS prefix to state code.
- `getBaseTurnoutRate(county)`: Delegates to Election turnout model.
- `getPartyTurnoutMultipliers(county)`: Returns turnout multipliers for all parties.
- `getCountyGroupShare(county, groupId)`: Returns group share for a county.
- `getCountyDemographicWeights(county)`: Builds weighted demographic list.
- `getGroupSupportByParty(groupId, county)`: Returns party support for group.
- `calculateCountyVoteTotals(county, options)`: Computes vote totals with turnout.
- `applyRallySpillover(targetCountyID)`: Applies regional rally turnout spillover.
- `applyOpponentRallySpillover(targetCountyID, party)`: Spillover for AI rallies.
- `applyThirdPartyToggle(county)`: Redistributes votes if 3rd parties off.
- `getPartyVoteKeys()`: Returns party vote keys list.
- `getCountyVotesForAllocation(county, useReportedVotes)`: Returns vote totals for allocation.
- `getLeadingPartyFromVotes(votes)`: Returns plurality winner.
- `normalizeVoteShareMap(voteShares)`: Normalizes shares to 100%.
- `buildSplitSegmentShares(county, countyVotes, segmentBaseline)`: Applies district split logic.
- `calculateStateElectoralAllocation(stateCode, options)`: Computes split EV allocation.
- `openCountyView(stateCode)`: Opens county map for a state.
- `loadCountyMap(stateCode)`: Loads SVG county map and sets handlers.
  - Inline handlers: `xhr.onreadystatechange`, `path.onclick`, `path.onmousemove`, `path.onmouseleave`.
- `focusOnStateCounties(svg, stateFips)`: Sets viewBox to the selected state.
- `normalizeFips(fips)` (second): Alternate pad implementation (overrides earlier).
- `colorCountyMap()`: Colors counties by margin.
- `selectCounty(fips)`: Updates sidebar for selected county.
- `rallyInCounty(fips)`: Runs county rally, applies spillover.
- `updateStateFromCounties(stateCode)`: Recalculates state margins from counties.
- `showCountyTooltip(e, fips)`: County hover tooltip.
- `getStateFipsPrefix(stateCode)`: Returns state FIPS prefix.
- `closeCountyView()`: Exits county view UI and restores actions.
- `getAdjacentCounties(fips)`: Placeholder adjacency lookup.
- `openCountySpeechModal(fips)`: Opens issue-selection modal for county speech.
- `handleCountySpeech(fips, issueId)`: Applies county speech effects.
- `propagateInterestGroupChange(groupId, candId, supportChange)`: Spreads group support change to counties.

### js/election.js
**Purpose:** Election-night simulation, reporting, results, and analysis tools.

**Key Data:**
- `RESULTS_2024`: Baseline state winners for flip visualization.
- `TURNOUT_MODEL` and turnout constants.
- Thresholds for victory narrative.

**Functions (Election object):**
- `start()`: Initializes election state and reporting schedules.
- `tick()`: Advances time, processes county reporting, calls states.
- `updateDisplay()`: Updates EV counters, bars, and third-party display.
- `getCountyTurnoutRate(county)`: Returns turnout rate from county type.
- `getCountyVoterPool(county, reportingFactor, decidedMultiplier, errorFactor)`: Expected voters.
- `calculateCountyReportedVotes(county, reportingFactor, decidedMultiplier, errorFactor)`: Vote totals with error.
- `aggregateCountyVotes(stateCode)`: Rolls up county totals into state totals.
- `updateNationalPopularVote()`: Aggregates national popular votes.
- `updateNationalPopularVoteDisplay()`: Updates popular vote ticker.
- `getStateWinner(state)`: Returns plurality winner from reported votes.
- `awardEV(state, allocation)`: Updates EV totals.
- `applyInterestGroupAdjustments(county)`: Modifies vote shares by interest groups.
- `getPartyLabel(partyCode)`: Friendly party name.
- `getPartyColor(partyCode)`: Party color lookup.
- `getStateCodeFromFips(stateFips)`: Maps FIPS prefix to state code.
- `getCountyPollCloseTime(fips, stateCode)`: Returns poll close time.
- `getReportingProfile(county)`: Returns report schedule profile by size.
- `buildCountyReportingSchedule(county, pollCloseTime)`: Creates report batches.
- `getCountyExpectedVotes(county)`: Calculates expected total votes.
- `pulseState(stateCode)`: Flash animation on poll close.
- `canCallStateMathematically(stateCode, state)`: Determines if a state can be called.
- `formatSplitCallMessage(stateCode, calledFor, allocationResult)`: Message for split EV calls.
- `updatePollClosingsNext()`: Updates next poll closing panel.
- `toggleThirdPartyTracker()`: Shows/hides third-party tracker.
- `updateThirdPartyTracker()`: Updates third-party tracker content.
- `loadElectionMap()`: Loads SVG map and sets handlers.
  - Inline handlers: `xhr.onreadystatechange`, `path.onclick`, `path.ondblclick`, `path.onmousemove`, `path.onmouseleave`.
- `colorElectionMap()`: Colors map by mode (leader/projected/shift).
- `selectState(code)`: Populates state info panel.
- `addFeedItem(text)`: Adds a feed update entry.
- `addRaceCall(code, party)`: Adds a race call chip.
- `showWinner()`: Shows projected winner overlay.
- `buildVictoryNarrative(tickets, winnerEV, loserEV)`: Narrative text for results.
- `buildCoalitionBreakdownHTML()`: Builds coalition summary HTML.
- `buildDistrictAnalysisHTML()`: Builds ME/NE split analysis.
- `buildSpoilerAnalysisHTML()`: Calculates 3rd-party split estimates.
- `showFinalResults()`: Builds final results overlay.
- `toggleResultsView()`: Toggles final results overlay.
- `closeWinnerOverlay()`: Closes winner overlay.
- `togglePause()`: Pause/unpause election night.
- `setSpeed(speed)`: Changes tick speed.
- `setMapMode(mode)`: Switches map mode (leader/projected/shift).
- `resetAnalysisUI()`: Resets analysis UI state.
- `enterAnalysisMode()`: Switches to analysis center mode.
- `exitAnalysisMode()`: Returns to election night mode.
- `setAnalysisYear(yearValue)`: Sets historical comparison year.
- `skipToEnd()`: Completes reporting immediately.
- `showMapTooltip(e, code)`: State tooltip for election map.
- `showCountyMapTooltip(e, fips)`: County tooltip in election map.
- `hideMapTooltip()`: Hides tooltip.
- `parseCsvLine(line)`: CSV parser for historical data.
- `normalizeFipsCode(rawFips)`: Cleans/pads FIPS codes.
- `addHistoricalYear(year)`: Tracks available historical years.
- `populateAnalysisYearSelect()`: Populates analysis year dropdown.
- `getActiveShiftYear()`: Returns active shift year.
- `isShiftMapMode()`: True if shift map mode is active.
- `getHistoricalMargin(year, fips)`: Gets historical county margin.
- `getCandidateNameForParty(party)`: Returns candidate name for party.
- `getShiftLabelHtml(shift)`: Formats shift label.
- `loadHistoricalData()`: Loads 2000–2020 county results.
  - Inline handler: `xhr.onreadystatechange`.
- `load2024Data()`: Loads 2024 county results.
  - Inline handler: `xhr.onreadystatechange`.
- `computeCountyShift(fips)`: Computes 2024 shift for county.
- `computeStateShift(stateCode)`: Computes 2024 shift for state.
- `computeCountyShiftForYear(fips, year)`: Computes shift vs historical year.
- `computeStateShiftForYear(stateCode, year)`: Computes shift vs historical year.
- `openCountyView(stateCode)`: Opens election county view.
- `closeCountyView()`: Exits county view.
- `updateCountyViewTitle(stateCode)`: Updates county view title.
- `loadCountyElectionMap(stateCode)`: Loads county SVG map for election view.
  - Inline handlers: `xhr.onreadystatechange`, `path.onclick`, `path.onmousemove`, `path.onmouseleave`.
- `colorCountyPath(path, fips, stateCode)`: Colors county in election view.
- `updateCountyElectionColors()`: Recolors county map.
- `focusOnStateCounties(svg, stateFips, stateCountyPaths)`: Sets viewBox for county map.
- `showCountyDetail(fips)`: Shows county detail panel.
- `closeCountyDetail()`: Closes county detail panel.

### js/main.js
**Purpose:** Main entry point, core simulation glue, and app UI API.

**Functions (global):**
- `initGameData()`: Initializes state objects in `gameData`.
- `startGame()`: Validates ticket selection, applies penalties, starts campaign.
- `applyCandidateBuffs()`: Applies candidate/VP/group/regional boosts to county votes.
- `_applyCountyBoost(fips5, voteKey, boostPoints)`: Applies a per-county vote shift.
- `_applyCountySpecificBoosts(candidate, voteKey)`: Applies candidate-specific local boosts.
- `_applyRegionalSpillover(pres, voteKey)`: Applies regional spillover boosts.
- `_applyStateBoostToCounties(stateCode, voteKey, boostPoints)`: Applies state-wide boosts.
- `_normalizeGroupTag(groupId)`: Canonicalizes group tags.
- `_mapGroupToIgKey(groupId)`: Maps group tags to county ig keys.
- `_getCountyIgValue(county, key)`: Returns county ig value (0–1).
- `_getCountyUrbanIndex(county)`, `_getCountySuburbanIndex(county)`, `_getCountyRuralIndex(county)`: Tier-derived indices.
- `_getCountyTierGroupWeight(county, groupType)`: Returns tier-based weight.
- `_countyInRegion(county, regionName)`: True if county is in region.
- `calculateCompositeTag(tag, value, county)`: Handles composite demographic tags.
- `_applyGroupModsToCounties(groupMods, voteKey, scale)`: Applies group modifiers to counties.
- `_normalizeAllCountyVotes()`: Renormalizes county vote shares to 100%.
- `toggleThirdParties(enabled)`: Enables/disables 3rd parties and recalculates margins.
- `_buildActiveCandidatesList()`: Builds list of active candidates.
- `_buildCandidateByIdMap()`: Map of candidate IDs to objects.
- `_computeIssueGroupModifiers(candidate)`: Converts issue positions to group modifiers.
- `initInterestGroupTurnout()`: Initializes turnout multipliers.
- `updateGroupTurnoutFromIssue(issueId, partyCode, intensity)`: Adjusts turnout by issue.
- `initCoalitionStatus()`: Initializes coalition tracking.
- `_coalitionAppliesToParty(groupId, partyCode)`: Checks coalition applicability.
- `updateCoalitionLoyalty()`: Updates coalition status and alerts.
- `recomputeCoalitionTurnout()`: Applies coalition turnout multipliers.
- `updateMessagingConsistency(issueId, intensity)`: Adjusts credibility based on consistency.
- `recordPlayerPressure(stateCode, actionType, intensity)`: Tracks player pressure by state.
- `initializeInterestGroupSupport()`: Initializes interest group support structures.
- `recomputeInterestGroupSupport()`: Recalculates support from county data.
- `_pickRandomPacByIssue(issueId, used)`: Picks PAC by issue.
- `buildFundraiseMeeting(stateCode)`: Builds fundraising choices.
- `calculateFundraisePayout(pac, stateCode)`: Calculates raised funds.
- `addMediaVulnerability(pac)`: Adds media risk entry.
- `applyPacCommitment(pacId)`: Applies PAC endorsement and issue lock.

**`app` UI API:**
- `goToScreen(id)`: Wrapper for Screens.goTo.
- `selParty(code)`, `selCandidate(id)`, `selVP(id)`: Selection helpers.
- `setThirdParties(enabled)`: Toggle UI for third parties.
- `startGame()`: Starts the campaign.
- `handleAction(action)`: Delegates to Campaign.handleAction.
- **Fundraising:** `openFundraiseModal()`, `renderFundraiseModal()`, `acceptFundraiseOption()`, `acceptBundlerDeal()`, `declineFundraise()`, `finalizeFundraise()`, `closeFundraiseModal()`.
- **Campaign navigation:** `openStateBio()`, `nextWeek()`, `undoLastAction()`, `openCountyView()`, `closeCountyView()`.
- **Issues panel:** `openIssuesPanel()`, `closeIssuesPanel()`, `renderIssuesPanel()`.
- **National overview:** `openNationalOverview()`, `closeNationalOverview()`, `renderNationalOverview()`.
- **Speech/field/digital:** `openSpeechModal()`, `openFieldModal()`, `closeFieldModal()`, `openDigitalModal()`, `closeDigitalModal()`, `handleSpeechWithIntensity()`, `queueFieldOperation()`, `queueDigitalCampaign()`, `closeSpeechModal()`.
- **Dropdowns/ads:** `initTargetGroupDropdown(selectId)`, `queueAd()`, `updateQueuedAdsDisplay()`, `initAdIssueDropdown()`.
- **PAC offers:** `triggerPacOffer()`, `showPacOffer(pacId)`, `acceptPacEndorsement()`, `declinePacEndorsement()`, `closePacModal()`.
- **Issue shifting:** `shiftIssuePosition(issueId)`.
- **Interest groups:** `openInterestGroups()`, `closeInterestGroups()`, `filterInterestGroups(category)`, `renderInterestGroups(category)`, `renderCandidateSupport(groupId)`.
- **Candidate info helpers:** `getCandidateInfo(candId)`, `getPartyColor(party)`.
- **County actions:** `countyRally()`, `countySpeech()`.
- **Election wrappers:** `app.election.togglePause()`, `setSpeed(s)`, `setMapMode(m)`, `skipToEnd()`, `closeWinnerOverlay()`, `enterAnalysisMode()`, `exitAnalysisMode()`, `setAnalysisYear(y)`.

**Other:**
- `document.addEventListener('DOMContentLoaded', ...)` calls `initGameData()` on page load.

### js/interestGroups.js
(See **Interest Groups** section above for data. This file contains data-only definitions, no functions.)

### js/issues.js
(See **Issues** section above for data. This file contains data-only definitions, no functions.)

---

## Notes on Data + Assets
- **SVG maps** are the core interactive surfaces; state and county IDs must match FIPS/state codes for tooltips and clicks to work.
- **County data** (`county_data.json`) is the runtime truth for margins, turnout, and interest-group weights.
- **Historical CSVs** power the election-night shift analysis and historical comparison views.
- **Images** are referenced by candidate IDs and party codes; keep names consistent with `CANDIDATES`/`VPS`.

