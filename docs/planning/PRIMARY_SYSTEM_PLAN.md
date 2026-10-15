# Primary Election system: design and implementation plan

Planning baseline: October 13, 2026. Repository inspected: Decision 2028, in `campaign-2028-main/`. This document specifies the proposed work; gameplay implementation has not started.

## Product direction

Add a separate Primary Election entry mode that uses the existing campaign systems and continues into the general election on one continuous calendar. Keep the current General Election setup available for a shorter campaign, starting July 4, 2028.

The player has confirmed a September 2027 primary campaign buildup. Recommended exact scenario start: September 6, 2027. This is a game design choice, not an official political calendar date.

The central design is **a campaign for each candidate, a nomination contest for each party, and a shared world clock**. Several candidates in the same party need distinct support, money, organization, relationships, and delegates. Different parties can be at different nomination stages on the same date.

The requested baseline includes the campaign chooser; familiar party and candidate styling; player candidate selection before opponent selection; independently toggled primary opponents; one roster page for each other enabled party; removable third parties; simultaneous nomination campaigns; realistic contest formats, eligibility, and delegates; withdrawals and endorsements; negotiations; conventions; late VP selection; and a continuous general election.

Pending preference: what happens when the player's candidate loses the nomination. Recommended default is a result screen offering **continue as the party's actual nominee** or **end this campaign**. Continuing changes the controlled candidate and uses that nominee's own resources. An independent run is a later, separate feature with ballot-access requirements.

## What the repository already provides

| Existing system | Primary adaptation |
| --- | --- |
| Party-colored cards, candidate portraits, faction filters, and selection tiles | Reuse the presentation for the campaign chooser and primary roster pages. |
| County demographic cells and issue preference distributions | Construct the electorate eligible to participate in each party contest; calculate choices within that field. |
| Candidate platforms, issue salience, policy credibility, and candidate-era effects | Differentiate candidates within a party, with party-specific issue priorities. |
| Candidate-ID favorability | Track awareness, approval, and intention to vote separately for every contender. |
| Candidate-ID advertising with TV markets, digital delivery, targeting, saturation, and continuing buys | Let all contenders sponsor ads and target same-party rivals; restrict delivery to relevant eligible audiences. |
| Travel, rallies, queued actions, stamina, and geographic spillover | Preserve action limits and make early-state visits, town halls, and caucus organizing meaningful. |
| Offices, staff, volunteers, canvassing, voter files, and GOTV | Give each contender their own organization and tie GOTV to each upcoming contest. |
| Grassroots fundraising, donor meetings, PAC demands, and platform locks | Add donor competition, burn rates, momentum-driven contributions, and consolidation after withdrawals. |
| Endorser relationships and surrogate rallies | Extend competition to all candidates and introduce endorsements by departing contenders. |
| Debates, scandals, news, and momentum | Make scheduling and targeting depend on candidate IDs, party field, and date. |
| Weekly action processing and undo snapshots | Introduce a common calendar coordinator and durable campaign storage. |
| County general-election results, electoral votes, and Maine/Nebraska districts | Preserve the general election result service; use a separate delegate service for nominations. |

Important implementation facts: current voter results are aggregated by party; the active roster generally contains one presidential candidate per party; AI primarily operates the major-party general nominees; current debates and GOTV use general-election week assumptions. There is no primary, convention, withdrawal, candidate negotiation, or durable save/load interface. Existing snapshot serialization supports undo. Some older enthusiasm and candidate group-bonus paths are bypassed by the current authoritative electorate model, so adaptation must follow the live model rather than old descriptions.

## 1. Setup and visual experience

### Choose your Campaign

Place the new page before Choose your Party. Use the current typography, dark backgrounds, card borders, spacing, illustration treatment, and hover effects.

- **Primary Election:** Build your campaign from September 2027, compete for the nomination, unite your party, and continue into November.
- **General Election:** Choose your party and ticket, then enter the current campaign on July 4, 2028.

Route General Election through the current party, presidential candidate, VP, and opponent-ticket flow. Share the new mode selection with both existing new-game entry points.

### Primary setup sequence

1. Choose your Campaign.
2. Choose your Party, using the existing page and third-party controls.
3. Choose your Candidate: a single player candidate.
4. Choose your Primary Opponents: the remaining candidates from that party.
5. Choose the Democratic, Republican, and enabled minor-party fields, excluding the player's party: **one multi-select roster page per other party**, with no president/VP substeps.
6. Review the fields and start the campaign.

The player's primary-opponent page uses the same candidate-card language as the present VP page, but lists presidential contenders. The player candidate is shown as a fixed roster member and cannot be selected as their own opponent. Clicking any opponent independently selects it with a party-colored border/highlight and checkmark; clicking again clears both. **Next commits the roster.** Back preserves the draft. Filters must not erase hidden selections.

The player may select no opponents for an uncontested race. Other required parties need at least one entrant. Enabled minor parties can be skipped explicitly. A removed party has no nomination events or general-election ticket. Prevent disabling the player's own party underneath an active setup; if the selected player party becomes unavailable, return to the party choice with a clear explanation.

Use keyboard activation, visible focus, selected-state semantics, and a selected-count summary. Review displays candidate portraits, every participating field, the start date, and a concise calendar-data status. Expose research/projection details in an optional rules view rather than burdening normal setup.

No VP is chosen for a major-party contender at primary startup. VP negotiation can create a conditional commitment; actual selection or ratification occurs near the appropriate party convention.

### Minor parties and independents

Keep the familiar party screen, but use appropriate nomination routes behind it. An Independent is not a political party with a national primary: choosing that option in the longer campaign leads to ballot-access and independent campaign preparation. PSL receives a party nomination/organizing process, with scenario assumptions labeled, rather than invented public primaries in every state. Green and Libertarian fields use their own affiliate/convention procedures. Explain the relevant route immediately after party selection.

## 2. Researched 2028 calendar baseline

The DNC approved the following early-state slate on August 15, 2026. These are **national-party approved dates**; implementation must separately track whether the relevant state/party has finalized its actual contest. [DNC announcement](https://democrats.org/dnc-votes-to-officially-select-early-states-for-2028-democratic-presidential-nominating-calendar/).

| Democratic early contest | Nationally approved date |
| --- | --- |
| South Carolina | January 22, 2028 |
| Nevada | February 1, 2028 |
| New Hampshire | February 8, 2028 |
| New Mexico | February 15, 2028 |
| Michigan | February 22, 2028 |
| Virginia | February 29, 2028 |

State sources also currently identify **March 7, 2028** presidential primaries in [Minnesota](https://sos.mn.gov/elections-voting/how-elections-work/presidential-primary/), [Texas](https://www.sos.state.tx.us/elections/candidates/guide/2026/president.shtml), and [California](https://www.sos.ca.gov/elections/political-parties/political-party-qualification). Use this Super Tuesday anchor for the scenario; source each additional jurisdiction separately.

The Democratic convention is scheduled for **August 7–10, 2028**. [DNC convention announcement](https://democrats.org/news/dnc-announces-2028-convention-date-and-host-city-frontrunners/).

The currently hosted Republican national rules reserve the early window for Iowa, New Hampshire, South Carolina, and Nevada and contain allocation and binding constraints. Exact party contest dates, full 2028 delegation counts, state plans, and Republican convention dates were not comprehensively verified in this research. Populate unresolved values as projections, with their provenance, rather than describing a complete historical-calendar copy as official 2028 data. [RNC rules](https://prod-static.gop.com/media/Rules_Of_The_Republican_Party.pdf).

New Hampshire requires special treatment: its statute directs the secretary of state to schedule its presidential primary before another similar election. That can conflict with the DNC's approved date. Store national approval, state scheduling, and sanction status separately. Default to the sanctioned scenario and clearly label any assumed resolution; a calendar dispute can later be an optional scenario event. [New Hampshire statute, RSA 653:9](https://www.gc.nh.gov/rsa/html/LXIII/653/653-mrg.htm).

The DNC has announced stronger 2028 penalties for unsanctioned early contests, including loss of all state delegates, automatic delegates included, and candidate restrictions. Implement any dispute using the adopted applicable rules rather than borrowing the 2024 reconciliation outcome. [DNC enforcement announcement](https://democrats.org/dnc-rules-and-bylaws-committee-votes-to-strengthen-penalties-for-violations-of-early-window-of-presidential-nominating-calendar/).

Correct the shared general Election Day from the repository's November 3 to **November 7, 2028**. Preserve the requested July 4 standalone general start. [FEC election-cycle reference](https://www.fec.gov/help-candidates-and-committees/filing-reports/election-cycle-aggregation/).

### Calendar data policy

Publish a playable, pinned 2028 scenario bundle. Each field needs a source URL, source cycle, checked date, and status: nationally approved, state scheduled/statutory, projected, historical fallback, or scenario-only. A state's date may be confirmed while its delegate count is projected. Dates and rules can have different sources.

Use an actual 2028 announcement or applicable statute first. Where absent, use the last verified state-party plan and an explicit 2028 calendar projection consistent with national rules. Do not simply add four years to a 2024 date. Freeze a bundle for each campaign; data updates affect new campaigns unless the player deliberately changes scenarios.

The [FEC's 2024 calendar](https://www.fec.gov/resources/cms-content/documents/2024pdates.pdf) is a useful historical coverage checklist and demonstrates party-specific and mixed procedures. It is not a confirmed 2028 calendar.

## 3. Contest rules and geographic coverage

### A rule record for every party and jurisdiction

Store rules at **party × jurisdiction × event × delegate pool**, rather than a single primary/caucus property on a state. A state can use different formats and dates for different parties, or multiple events within one party.

Each record specifies:

- Stable event ID, jurisdiction, party, actual date, and reporting window.
- Format: state-run primary, party-run primary, mail preference vote, caucus, convention, or mixed process.
- Who can participate: registration, affiliation, unaffiliated eligibility, switching deadlines, same-day procedures, and any participation exclusivity.
- Ballot filing/withdrawal deadlines, early voting, mail ballots, uncommitted/NOTA choices where applicable.
- Whether the event allocates delegates, selects delegate people, binds delegates, or is advisory only.
- Allocation pools: district, at-large, pledged party leaders/elected officials, automatic, and other state-specific categories.
- Pool vote basis, delegate quantity or vote weight, qualifying threshold, majority sweep, rounding, tie rule, and fallback when no candidate qualifies.
- Selection/certification dates; withdrawal/reallocation rules; binding and release conditions by ballot.
- Applicable sanction, waiver, source status, and bundle version.

The interface should explain these in simple language: “Closed caucus,” “15% required in this district,” “Statewide delegates divided proportionally,” or “These delegates become free after the second ballot.”

### Democratic allocation baseline

Use proportional allocation with the qualifying threshold applied independently to district and statewide pools. Keep district, at-large, pledged PLEO, and automatic delegates separate. Verify the final 2028 national text and each state plan before labeling the implemented details official.

The 2024 North Carolina plan illustrates 15% qualification, a fallback threshold equal to half the leading share if nobody reaches 15%, and reallocation of at-large allocations when a candidate leaves before those delegates are selected. These are useful reference cases, not a declaration that every 2028 state has identical timing. [NCDP plan, Rules 14 and 11 references](https://www.ncdp.org/wp-content/uploads/2024/03/NCDP-Delegate-Selection-Plan-9.27.2023-Revised.pdf).

Compute vote-based delegate awards by pool with the prescribed rounding and tie treatment. Keep election-night projections distinct from allocation, selection, and certification. Do not give automatic delegates to the state winner or confuse pledged PLEOs with superdelegates.

Illustrative math, not an actual state's rule: in a 10-delegate proportional pool with a 15% threshold, shares of 40%, 30%, 20%, and 10% leave the last candidate ineligible. The qualifying shares renormalize to 44.44%, 33.33%, and 22.22%; a largest-remainder strategy awards 5, 3, and 2. An actual jurisdiction must use its own documented rounding strategy.

### Republican allocation baseline

Support proportional allocation, separate district/statewide pools, winner-take-all, winner-take-most, and explicit majority-triggered sweeps. Apply current national timing and threshold constraints when validating projected state rules. Three RNC members per jurisdiction are automatic by position but are not a second DNC-style superdelegate pool added after the primaries; their applicable binding rules must be respected. Delegation sizes include national formulas and bonuses, so do not copy old totals or hard-code a national majority. [RNC rules](https://prod-static.gop.com/media/Rules_Of_The_Republican_Party.pdf).

A state with only one candidate exceeding a threshold must follow its applicable fallback; that situation does not automatically authorize a full sweep. Candidate withdrawal and a candidate's endorsement are different events; neither can bypass binding rules.

### Researched examples that the rule engine must handle

| Reference case | Required engine capability |
| --- | --- |
| North Carolina Democratic 2024 plan | Distinct district/statewide pools, threshold fallback, later selection/reallocation. |
| Nevada Republican 2024 | Distinguish an advisory public primary from the delegate-bearing party caucus; never award the same pool twice. [Party explanation](https://nevadagop.org/wp-content/uploads/2024/01/2024-Nevada-First-in-the-West-Caucus-v31.16.24.pdf). |
| California Republican 2024 | Conditional statewide majority sweep versus proportional allocation; this historical rule needs 2028 validation. [Party announcement](https://cagop.org/cagop-statement-on-the-passage-of-a-presidential-delegates-rules-change/). |
| Florida Republican 2024 | Winner-take-all allocation and delegate selection following the primary. [Party delegate guide](https://florida.gop/delegates/). |
| Minnesota presidential ballots | A withdrawn candidate can remain on a printed ballot; campaign-active status and ballot status differ. [Secretary of State](https://sos.mn.gov/elections-voting/how-elections-work/presidential-primary/). |
| Libertarian current national rules | Convention majority, repeated ballots with elimination, independent VP voting, and NOTA. [2026 bylaws and convention rules](https://lp.org/wp-content/uploads/2026-Indexed-LP-Bylaws-and-Convention-Rules-w-2026-JC-Rules-1.pdf). |
| Green current convention rules | State instructions by ballot, majority voting, elimination procedures, and NOTA/No Nominee. [GPUS rules](https://gpus.org/convention-rules/). |

These references establish capability requirements. They do not substitute for a fully verified state-by-state 2028 rules package.

### Full coverage requirement

Before the complete basic mode ships, every enabled major-party jurisdiction must have a usable, sourced or explicitly projected record. Coverage includes all 50 states and DC; American Samoa, Guam, the Northern Mariana Islands, Puerto Rico, and the U.S. Virgin Islands; and Democrats Abroad for Democrats. Minor-party coverage follows actual applicable affiliate and caucus structures.

The data audit must report **missing records and missing fields**, not only count rows. A historical fallback must visibly identify its source cycle. Territory contests appear as inset/list entries on the primary map; they must not invent general-election EVs.

District allocation needs district electorates. Counties crossing congressional districts require precinct/tract population and election-weighted crosswalks, with reconciliation to county and state totals. Never assign an entire split county by its centroid. If using estimated district shares, label that modeling assumption and test its sensitivity. The first public rules-based release needs complete district-pool coverage, even if some inputs are explicitly modeled estimates.

Represent fractional voting weights in exact units where required, and calculate majority from **eligible vote weight on that ballot**. Alternates replace eligible delegates rather than adding extra votes.

## 4. Primary and caucus voter simulation

Maintain separate general-election and nomination preference dimensions. General-election party vote shares do not identify who is eligible for a primary and must not be copied to every contender.

Build participation from available registration data, eligibility rules, historical party primary/caucus turnout, demographic cells, competition, and campaign mobilization. Where data is missing, use calibrated participation estimates with a quality flag. In open contests, model the unaffiliated participation choice; prevent the same simulated voters from being counted in multiple incompatible party primaries.

Within that electorate, calculate candidate utility from issue alignment, issue priorities, faction affinity, favorability, name recognition, home-region appeal, credible messages, organization, endorsements, electability perception, and momentum. Party label mainly defines the contest; it cannot be the sole source of preference among candidates in that same party.

Separate name recognition from approval and approval from voting intention. An unknown candidate can grow through organizing and debates; an unpopular but well-known candidate should not get an automatic recognition advantage that cannot be overcome.

Primary polls include candidate shares and undecided voters within the eligible field. Report polling uncertainty, roster, date, and likely-voter assumptions. Store each historical poll with its original roster; withdrawals must not rewrite history. Forecast delegates separately from statewide poll rank.

### Different contest formats

- **Primary:** broader participation, early/mail voting where applicable, eligibility deadlines, ballot-based choice, and contest-specific turnout. A late endorsement cannot alter ballots already cast.
- **Caucus:** higher organizing importance and participation burden, local captains, volunteer turnout, attendance uncertainty, and weather or schedule effects.
- **Realignment caucus:** run viability and supporter second choices at the applicable precinct/local level, including delegates per precinct where thresholds depend on that size. Redistribute only the voters permitted to move. Use this procedure only where the actual rules call for it.
- **Single-ballot caucus:** use the documented ballot/counting method. Do not automatically apply historic Democratic standing-group realignment to Republican caucuses.
- **Ranked preference process:** respect the party/jurisdiction's current rules about which counting round allocates delegates.
- **Convention/affiliate process:** campaign among the eligible delegate electorate rather than simulating a statewide public vote that does not exist.

Contest format influences participation and campaigning; delegate allocation is a separate rule. A caucus is not intrinsically winner-take-all.

## 5. A shared calendar and fair turn processing

Keep normal weekly campaign planning. Display the next contests, debates, filing deadlines, early-voting openings, and convention milestones. Process every dated event crossed by the turn in chronological order.

For each shared voting date:

1. Commit all relevant player and AI plans and costs.
2. Apply campaign exposure up to the event cutoff and preserve previously cast ballots.
3. Freeze the electorates and candidate ballot eligibility for every contest on that date.
4. Resolve all those contests from the frozen state.
5. Allocate/project delegates and record results.
6. Publish results, momentum changes, dropout decisions, and endorsements.
7. Apply those changes only to later events and refresh polls.

No party or candidate receives a same-day advantage from being processed first. A withdrawal after one date can affect a later date in the same week, but not contests already completed. Campaign agendas need date-stamped actions/exposure when a week crosses multiple contest dates. Short event steps or convention rounds draw from the existing time/resource budget; they must not create extra weekly energy or fundraising opportunities.

Give events stable IDs, use deterministic scenario randomness with a saved state, and commit results exactly once. Reloading or undoing must not duplicate delegates, reroll a result, or repeat money transfers. Historical results are immutable; any later formal correction is a separately logged event.

## 6. Translating the campaign mechanics

### Organization, travel, and advertising

Keep the existing travel and action constraints. Smaller early-state town halls favor charisma and local credibility. Campaign choices should distinguish winning statewide publicity from targeting a district to clear a delegate threshold.

Offices improve long-term local knowledge, volunteer recruitment, and turnout. Add caucus captains and attendance preparation as format-specific uses of field organization. Use upcoming contest dates for GOTV availability, not a fixed general-election week number. Once a state's nomination vote closes, persuasion there can support fundraising, delegate relationships, and general-election preparation; it cannot change closed votes.

Use the existing ad engine's sponsor/target identities and audience filters. Show candidate-comparison, issue, electability, biography, and attack messages. Spending competes for limited audiences; overlapping markets and saturation create diminishing returns. Cancel or explicitly retarget campaigns when a target stops being relevant, with costs handled consistently. Never silently convert an attack into a different target.

### Money and donors

Give every candidate starting money calibrated for the longer season, staffing costs, debt limits, fundraising cadence, and donor networks. Avoid adding months of free general-election income. Early spending can buy momentum at the expense of Super Tuesday readiness.

Donor support responds to results relative to expectations, credible nomination paths, candidate trust, and platform demands. Model small-dollar enthusiasm separately from large-donor pressure. A departed rival's donors and volunteers may follow an endorsement partially; their remaining treasury and staff do not automatically become the endorsed candidate's property.

### Debates, news, policies, and scandals

Use party-specific debate dates and qualification conditions as scenario data until official 2028 rules are confirmed. Model polling/donor qualification, several candidates on stage, attacks, coalition signals, preparation, and recovery. Excluded candidates can organize outside the debate and campaign for a later threshold.

Tie primary events to the relevant party and candidate identities. Results-driven news can cover expectations, coalition endorsements, donor exits, fundraising surges, or convention arithmetic. Avoid applying one scandal to every candidate in a party.

Retain policy positions, issue credibility, PAC locks, and message history. A policy compromise can attract a rival's faction while angering existing supporters. The general-election pivot should cost time and credibility when it contradicts the primary record. Do not erase the record at nomination.

### Endorsers, factions, and unity

Let candidates compete for existing state and national endorsers. Distinguish an endorsement, surrogate help, donor access, and a convention vote. A public endorsement by an official who is an automatic delegate may matter politically while their first-ballot vote is still restricted.

Track party unity by faction and supporter cohort, rather than one universal forgiveness bonus. Negative primary campaigns can create resentment that persists after nomination; reconciliation requires actions, policy agreement, or credible representation.

## 7. Opponent strategy, withdrawals, and support movement

Every selected contender runs a real campaign in their party. AI uses the same money, action, travel, targeting, eligibility, and information limits as the player. Difficulty changes competence and uncertainty, not secretly unlimited resources or altered delegate arithmetic.

Strategy considers expected delegates per dollar, chances of crossing a threshold or taking a district, upcoming calendar, home-state strength, organization, fundraising, electability, faction competition, and convention leverage. Different candidates can pursue national leadership, early-state breakout, regional survival, or delegate bargaining.

Withdrawal decisions weigh a credible route to nomination, recent results against expectations, cash runway, organization, remaining favorable states, relationships, and bargaining value. One early loss is not an automatic elimination. Candidate traits influence risk tolerance and willingness to endorse. Distinguish suspension, formal withdrawal, and ballot removal.

After withdrawal, an endorsement modifies supporter choice according to ideological proximity, trust in the endorser, enthusiasm, local organization, the rivals' relationship, and any policy concession. Some supporters follow, some prefer other contenders, some remain undecided, and some stop participating. A “good fraction” can follow a compatible and trusted endorsement, but the fraction must be earned and bounded.

Example design scenario: a departing contender has 20% support. If 60% of those supporters follow the endorsement, that is a potential 12-point pool for the ally before geographic eligibility, early ballots, and subsequent competition. It is not an automatic 20-point gain everywhere.

Apply this transition once, conserving the supporter cohort. Avoid counting the same shift again as a full endorsement bonus, general momentum bonus, and automatic donor transfer. Already cast ballots and past results remain unchanged. Delegates move only through their applicable selection, withdrawal, binding, or convention rules.

## 8. Negotiation system

Add a candidate conversation panel with relationship information, perceived priorities, proposals, replies, and a commitments ledger. Initial actions can be simple structured offers; richer counteroffers and negotiation sequences can be added without changing the contract format.

| Offer | Terms to represent | Acceptance considerations | Consequences |
| --- | --- | --- | --- |
| Endorsement | Timing, public/private support, withdrawal condition, surrogate activity | Trust, platform proximity, likely winner, supporter reaction | Partial supporter movement; donor access; faction unity. |
| Nonaggression pact | Covered candidates, prohibited actions, scope, expiry | Shared interests, hostility, relative strength | Stops covered attacks; breaches damage credibility and relationships. |
| Policy agreement | Exact issue/position, priority, announcement, coalition action | Issue importance, PAC commitments, sincerity | Platform changes, issue credibility, gains and backlash. |
| VP offer | Conditional nomination, candidate consent, timing, party ratification | Ambition, compatibility, confidence in victory | Reserves one slot; affects coalition support and later VP selection. |
| Cabinet offer | A specific prospective nomination, conditional on winning | Role suitability, credibility, competing promises | Coalition effects and a tracked future commitment. |
| Campaign assistance | Surrogate visits, volunteer cooperation, permitted organization help | Capacity, relationship, value to the joint goal | Concrete costs and limited assistance; no unlimited resource transfer. |
| Convention cooperation | Requests to eligible delegates, platform terms, voting rounds | Binding freedom, delegate preferences, legitimacy | Influences available votes; does not transfer ownership of bound delegates. |

Acceptance weighs opinion, trust, ideological distance, personal ambition, electability, available nomination paths, reservation demands, and competing offers. Explain the main reasons: “wants a stronger climate commitment,” “expects to win their home state,” or “does not trust your VP promise.” Do not expose private AI information as exact certainty.

Use durable offer/contract IDs and states: proposed, countered, accepted, rejected, expired, fulfilled, or breached. Store conditions, reserved roles, policy terms, costs, obligations, and publicity. Reserve only one VP slot and one intended nominee per specific cabinet role; prevent incompatible promises. A candidate may refuse even a valuable offer because it contradicts a nonnegotiable priority.

Cabinet terms are prospective nomination promises, conditional on election victory and applicable confirmation. In a game ending on election night, report their status in the campaign summary; do not invent a government simulation just to fulfill them.

Deals can be public or private. Public commitments reassure supporters but are harder to abandon. A leaked private agreement or a breach can worsen scandal exposure, trust, and unity. Breaking a pact is a player choice with consequences, not an invisible prohibition. AI-to-AI deals follow the same rules and appear in news when public.

## 9. Conventions and superdelegates

Track the road to nomination with separate columns for projected delegates, allocated/selected delegates, bound or pledged votes, released/unbound votes, automatic delegates, and current ballot eligibility. Show a rules-aware majority target and the remaining path.

For Democrats, the published 2024 convention rules restrict automatic delegates from deciding a contested first ballot and include them on subsequent ballots. Use that as an explicitly dated baseline until the applicable 2028 call/rules are fully verified. Do not award them as an after-primary bonus that can overturn a pledged majority. [DNC 2024 convention rules summary](https://democrats.org/dncc-rules-committee-passes-permanent-rules-for-2024-presidential-nomination/).

A convention resolves on its scheduled date even when a presumptive nominee has emerged earlier. A straightforward nomination can have a concise roll call and unity choices. A contested convention becomes an interactive series of ballots and negotiation windows:

1. Establish credentials, eligible candidates, eligible vote weight, and first-ballot obligations.
2. Cast votes according to binding/pledge rules and delegates' allowed preferences.
3. If nobody meets the applicable majority, announce the deficit and open bargaining.
4. Release/reconsider only votes that become available under the party/state rules.
5. Resolve endorsements, platform concessions, and VP commitments, then hold the next ballot.
6. Certify the nominee and complete the relevant VP procedure.

An endorsement encourages delegates where they have discretion; it cannot command every delegate. Democratic pledge obligations should be modeled according to their applicable good-conscience rules rather than assumed identical to Republican legal binding. The delegate engine needs explicit party-specific strategies.

For Libertarians and Greens, use their own elimination and voting procedures. Do not apply those elimination rules to major-party conventions merely to force a winner. For rare extended deadlocks, compress later rule-compliant rounds with visible results and increasing settlement pressure; never fabricate an arbitrary delegate majority. No-nominee outcomes are handled explicitly where the party rules allow them.

Offer the VP page at the appropriate point with eligible candidates, faction balance, compatibility, vetting, and accepted commitments. Ratification or independent delegate voting must match the party procedure. A VP promise creates obligations; it does not grant primary-phase VP buffs before the candidate joins the ticket.

## 10. Continuous general-election transition

Party stages are independent: active primary, presumptive nominee, convention pending, certified ticket. When the player becomes the presumptive nominee, unlock general-election preparation and outreach. Other parties keep holding contests on their own calendars. General polling can initially show matchup scenarios and replace them with actual nominees as nominations settle.

Continue the calendar without resetting to July 4 or waiting for every party's convention. The current July 4 date is only the standalone General Election starting point.

Carry forward funds and debt, offices and staff, volunteers and voter-file quality, awareness and favorability, policies and credibility, ad exposure/history, scandals, endorsements, relationships, faction grievances, promises, and the campaign record. A rival's personnel or money joins only through an explicit permitted campaign transition; nothing transfers simply because they endorsed.

Recompute general-election intention using the full general electorate, party affiliation, actual nominee identities, retained public record, and coalition unity. Never convert primary vote shares directly into general-election vote shares. Preserve imported county reference baselines and existing general-election result reconciliation.

Populate `demTicket`, `repTicket`, and enabled `thirdTickets` through an adapter as each final ticket becomes available. Audit stale ad targets, repeated candidate buffs, repeated third-party penalties, duplicated starting grants, and general systems that demand all VPs immediately. Opponent nominee AI can operate while another party's primary remains contested.

If the player loses and continues as the nominee, retain world history and switch to the winning candidate's own treasury, staff, policy record, and obligations. The defeated candidate may then endorse, with their supporters reacting normally.

## 11. Additional ideas worth including

These additions use the same model rather than creating unrelated minigames:

- **Expectations and momentum:** a strong second place can earn more publicity than a narrow favorite's win, while the delegate ledger remains unchanged.
- **Delegate-path advisor:** show where the next affordable delegates are, threshold danger, available district wins, and the share of remaining delegates needed.
- **Split-lane pressure:** compatible candidates divide a faction; departures, endorsement talks, and nonaggression deals can consolidate it.
- **Regional comeback strategies:** a weak national candidate can survive by winning home-region delegates and bargaining at the convention.
- **Caucus preparation:** captains, local endorsements, attendance practice, and second-choice relationships compete with spending on broadcast publicity.
- **Candidate awareness and breakout:** debates and local work can make a little-known candidate credible without granting instant national support.
- **Uncommitted or protest choices:** where rules permit, alienated voters can support an uncommitted preference and influence the convention/platform.
- **Unity tour:** after nomination, spend time rebuilding relationships and mobilizing disappointed supporters instead of receiving instant perfect unity.
- **Policy record and pivot:** rivals in November can attack commitments made during the primary; an honest compromise has different consequences from a contradiction.
- **Realistic rival VPs:** AI balances faction, geography, compatibility, promises, and party procedure when selecting a ticket.
- **Campaign pacing:** show the next meaningful milestones, allow safe acceleration between events, and offer autosave/resume for the longer season.
- **Final campaign history:** include vote and delegate performance, endorsements, accepted/broken deals, convention ballots, and the impact of the primary on November.

Defer independent defections, extensive ballot-access litigation, an unlimited cabinet/governing simulation, and elaborate procedural challenges until the core nomination-to-general loop is stable. They are future depth, not prerequisites for the requested basic campaign.

## 12. Implementation architecture

Use the repository's current JavaScript/global script conventions. A framework rewrite is outside this feature.

Introduce focused services with explicit contracts:

| Proposed module | Responsibility |
| --- | --- |
| `js/campaignSession.js` | Mode, shared dates, candidate actor registry, active player, party stages, compatibility adapters. |
| `js/electionCalendar.js` | Dated events, weekly intervals, same-day batches, action cutoffs, event idempotency. |
| `js/nominationRules.js` | Validate pinned jurisdiction rules and expose allocation/binding/eligibility strategies. |
| `js/primaryElectorate.js` | Party eligibility, primary preferences, candidate support, participation, caucus behavior. |
| `js/delegateAllocation.js` | Pool allocation, rounding, ties, fallback thresholds, selection/certification and audit trail. |
| `js/primaryAI.js` | All-contender plans, campaign economics, delegates strategy, withdrawal decisions. |
| `js/negotiations.js` | Relationships, offers, reserved roles, accepted commitments, fulfillment and breaches. |
| `js/conventions.js` | Ballot eligibility, delegate choice/binding, negotiations, nomination and VP procedures. |
| `js/primaryUI.js` | Calendar, candidate polls, delegate map, results, negotiation and convention views. |
| `js/campaignStorage.js` | Durable autosave, manual save/export/import, schema migration and deterministic restoration. |
| `data/primaries/2028/` | Versioned calendar/rules/participation/district inputs and provenance. |

Per-candidate actor state owns resources, organization, agenda, policies, favorability, endorsements, relationships, and commitments. Definitions remain immutable; mutable campaign state is not stored by editing shared candidate templates. Party nomination state owns rosters, calendar, results, delegate records, nominee status, and convention history.

Provide a campaign context that answers: who is acting, who are the valid opponents, which race is being influenced, which voters can participate, which date applies, and who owns the resources. General mode adapters preserve existing party result keys; nomination preference/results use stable candidate IDs.

Split startup into fresh-world initialization, mode initialization, and idempotent activation of a nominee. The nomination transition must not call the current reset-heavy `startGame()`.

Storage contains simulation/schema version, candidate/world state, immutable rules-bundle identity and required data, randomness state, history, pending actions/offers, and processed event IDs. Existing undo snapshots need all newly mutable fields. For legacy general snapshots, migrate only supported data and never fabricate completed primaries. Validate imports before committing restored state.

### Critical existing integration points

Paths below are relative to the application folder `campaign-2028-main/`:

- `index.html:24,38,258,350`: new-game links and setup screens.
- `style.css:3192,3416,3594`: party layout, candidate cards, selected party-color treatment.
- `js/screens.js:22,46,78,387,480`: setup state, flow construction, rendering, single-select behavior, navigation.
- `js/config.js:264,297`: electoral district rules and game mode/date state.
- `js/main.js:39,907,930,1400,1752`: startup/reset, third parties, roster, authoritative model routing.
- `js/campaign.js:1343,1588,1772`: turn processing, calendar advance, AI dispatch.
- `js/utils.js:201` and `js/electorate.js:200,275,304,390`: roster and party-based electorate aggregation.
- `js/polling.js`, `js/groupPolling.js`: polling contexts and historical roster snapshots.
- `js/adEngine.js`, `js/favorability.js`: candidate-ID foundations to reuse.
- `js/groundOps.js`, `js/persuasion.js`, `js/ai.js`: resource ownership, action limits, date-aware targeting, contender AI.
- `js/endorsements.js`, `js/endorsers.js`, `js/debates.js`, `js/news.js`, `js/scandals.js`: relationships, targets, scheduling, and primary events.
- `js/overhaulIntegration.js:96`: snapshot serialize/restore and undo.
- `js/counties.js` and `js/election.js`: preserve general-election reconciliation/EV allocation; add separate primary views.
- `scripts/test-overhaul.mjs` and `scripts/check-syntax.mjs`: existing meaningful verification seams.

The working tree already contains substantial existing changes. Implementation must build on them and avoid resetting or replacing unrelated work.

## 13. Delivery sequence and completion gates

### Stage 1 — Campaign chooser, setup, and state foundation

Add mode selection, the primary setup wizard, candidate actor records, party nomination state, a rules schema, calendar foundations, and fresh/transition initialization boundaries. Preserve General Election's current setup and July 4 start. Correct Election Day.

Gate: both setup paths work; multi-select/Back/Next/third-party handling behave correctly; General still passes existing checks. Until Stage 2 is complete, guard the unfinished primary start with an honest development state rather than launching it into the general simulator or presenting it as playable.

### Stage 2 — First complete playable primary-to-November campaign

Populate all enabled jurisdiction/process records with official or labeled projected data. Deliver primary electorate preferences, field actions, candidate polls, independent party AI, date-driven simultaneous contests, delegate pools, basic strategic withdrawals/endorsements, basic relationship-based offers for the requested deal types, a rules-compliant convention, VP selection, and continuous handoff. Include durable saving from this first long playable release.

This is a complete vertical slice: it must reach nomination and the November general election. It must handle an uncontested field, a normal winner, and a contested convention. Every enabled party needs a finishable nomination route. Core district allocation, binding, and automatic-delegate eligibility belong here, not in a later cosmetic realism patch.

Gate: deterministic full campaigns can go from September 2027 through nomination and November with two parties and with enabled minor parties; no incomplete party or deadlock strands the campaign.

### Stage 3 — State procedure and electorate depth

Improve district inputs and calibration, registration/switching deadlines, early/mail ballots, caucus captains and local realignment, multi-event delegate selection/certification, party-specific withdrawal rules, special jurisdictions, and calendar dispute scenarios. Replace fallback inputs as 2028 sources become available.

Gate: reference fixtures verify the unusual rules as well as ordinary allocation. Data coverage and provenance are inspectable.

### Stage 4 — Rich strategic bargaining and conventions

Expand candidate priorities, AI-to-AI negotiations, counteroffers, contingent packages, public/private commitments, leaks, nonaggression breaches, donor/volunteer reactions, faction unity, and interactive convention settlement. Build on the basic offers delivered in Stage 2.

Gate: offers change behavior and produce persistent consequences; endorsements never override delegate obligations; incompatible office promises cannot be accepted.

### Stage 5 — Debate depth, presentation, and balance

Add multi-candidate debate qualification and stage dynamics, delegate forecasts, explanations, nomination news, faction reconciliation, primary-versus-general policy tradeoffs, richer result nights, pacing controls, and campaign histories. Balance recognition, costs, momentum, support transfer, AI survival, and campaign length.

Gate: complete playthroughs remain understandable, competitive, and stable across candidate strengths and roster sizes. Existing General Election remains a functioning shorter route.

## 14. Verification

Use deterministic fixtures and the repository's VM-style assertions for the underlying engine. Required tests must exercise outcomes and invariants:

- Several same-party candidates normalize within their own field; undecided and nonparticipating voters are accounted for; other parties do not contaminate that denominator.
- Registration and open-primary participation cannot double-count incompatible voters.
- District/state pools conserve delegates and exact voting weight under thresholds, rounding, ties, majority sweeps, and all-below-threshold fallback.
- Votes already cast remain unchanged after withdrawal/endorsement; ballot status and campaign-active status can differ.
- Advisory events award no delegates; multi-stage events cannot allocate one pool twice.
- Caucus realignment conserves attendees and uses applicable local thresholds.
- Withdrawals preserve historical polls/results, while applicable unselected/released delegate changes follow rules.
- Endorsement support transfers happen once and do not force all voters or bound delegates to follow.
- Same-day party contests resolve once and give identical outcomes when party/candidate iteration order changes.
- Calendar advancement crosses leap day, multiple events, selection deadlines, conventions, and the correct November 7 boundary without skipping or replaying events.
- Convention ballots use the correct electorate, majority denominator, automatic delegate eligibility, and binding/release behavior.
- Every supported party process handles split fields and any applicable NOTA/no-nominee outcome.
- Accepted contracts reserve valid roles, obey conditions, expire/fulfill/breach correctly, and survive saving.
- Early nominees can campaign for November while other nominations remain active.
- Handoff preserves resources and history without repeating grants, candidate effects, or penalties.
- Save/load/undo retain RNG state, event IDs, results, pending plans, deals, and rules versions.
- Existing general-election vote reconciliation, third-party exclusion, and Maine/Nebraska EV checks continue to pass.

Browser walkthroughs should cover both campaign routes, player candidate selection, repeated opponent toggles, filters, Back/Next persistence, required-field validation, minor-party removal, the calendar, primary result explanations, negotiation acceptance/refusal, multi-ballot conventions, VP selection, nomination defeat, and general-election continuation. Verify at normal desktop and narrow layouts. Use short seeded scenarios to reach late phases; do not rely only on playing a year manually.

No builds or tests were run during this planning pass, because gameplay code was not changed.
