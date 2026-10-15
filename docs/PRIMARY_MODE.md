# Primary Election mode

Implementation added October 13, 2026. No tests, builds, syntax-check commands, or browser checks were run, at the user's request.

## Playing the campaign

Begin Campaign opens **Choose your campaign**. General Election retains the existing party/ticket selection and July 4, 2028 start. Primary Election starts September 6, 2027.

Primary setup selects the player's party and presidential candidate, then toggles same-party opponents. Next confirms the entire selected field. Each other enabled party receives one field-selection screen. Major parties require a contender; third parties can be removed. Independents select one candidate and pursue ballot access rather than an invented independent primary. Running mates are selected after nomination, with commitments respected.

Primaries use the original **campaign screen**, including its state map, county maps and views, HUD, campaign action panels, advertising composer, fundraising, field operations, platform, favorability, endorsers, opposition research, and weekly advance. Player actions use the original queue, prices, and weekly processing. Candidate-specific persuasion, advertisements, opinion and turnout feed the primary electorate instead of treating every entrant as the same party ticket.

The map and polling lists show primary candidates. The electoral-vote display becomes a delegate display. Each state shows its contest date, primary/caucus type, and delegate count. Once the contest closes, its state and county results are frozen: later campaign actions, dropouts and endorsements cannot rewrite the vote. County results are the recorded first-preference estimates; caucus realignment and delegate allocation remain state nomination rules. Other map modes and county campaign controls retain the original interface.

One **Nominations** control in the existing HUD opens a standard campaign modal with four sections:

- **Delegates:** standings and nomination progress, with a party selector for simultaneous primaries.
- **Calendar:** each party's schedule and the rules and provenance of its contests.
- **Agreements:** endorsements, nonaggression, policy concessions, VP/cabinet promises, assistance, convention cooperation, counteroffers, withdrawals, trust and the commitment ledger.
- **Convention:** ballots, binding/release rules, automatic delegates, nomination and running-mate selection.

Nomination events also appear in the existing campaign log. Saves and exports are available in the nomination modal. The separate primary headquarters and action dashboard are no longer the gameplay entry point.

After a pledged majority, the player may choose a VP and enter the general campaign before the party convention. The scheduled convention still requires ratification. Other party primaries continue on the same calendar. Funds, advertising, field offices, positions, favorability, endorsers, scandals, and agreements carry forward through the existing campaign systems. General polling starts at the actual handoff date while the week index remains continuous for ongoing campaigns. Primary vote shares do not become general-election shares. The Nominations control remains available. Losing players may take control of their party's actual nominee and that nominee's resources.

Election Day is November 7, 2028. Final results include a nomination-history link and conditional commitment outcomes. Cabinet promises are prospective nominations following a victory, not confirmed appointments or a governing simulation.

## Rules and scenario assumptions

The rules snapshot is `2028-primary-1`, dated October 13, 2026. Each contest exposes its provenance. Final state plans, apportionment, registration deadlines, and district boundaries are not represented as fully certified 2028 data.

- Democratic early dates follow the [DNC's approved 2028 national window](https://democrats.org/dnc-votes-to-officially-select-early-states-for-2028-democratic-presidential-nominating-calendar/): SC January 22, NV February 1, NH February 8, NM February 15, MI February 22, VA February 29. New Hampshire's state-law conflict is identified in the interface. The [Democratic convention announcement](https://democrats.org/news/dnc-announces-2028-convention-date-and-host-city-frontrunners/) anchors August 7.
- Other state dates project the [2024 FEC calendar](https://www.fec.gov/resources/cms-content/documents/2024pdates.pdf) into 2028. Republican and minor-party convention dates are labeled projections. PSL conferences and independent petition timing are game scenarios.
- Democratic pledged counts use a 2024-sized baseline. District, at-large, and pledged PLEO pools are distinct; pool sizes and district splits are estimates. Fifteen-percent qualification and all-below-threshold handling derive from a [2024 delegate-selection plan](https://www.ncdp.org/wp-content/uploads/2024/03/NCDP-Delegate-Selection-Plan-9.27.2023-Revised.pdf). Later at-large/PLEO selection can reassign allocations following suspension without changing the recorded popular vote.
- Republican counts estimate the base/district/member/bonus structure of [RNC Rules 14–16](https://prod-static.gop.com/media/Rules_Of_The_Republican_Party.pdf). Final bonuses are not claimed. Strategies include proportional pools, thresholds, conditional majority sweeps, statewide winner-take-all, district allocation, and state binding differences. California, Florida, Iowa, South Carolina, and Nevada have separate paths; other state strategy parameters are explicitly projected, not a complete transcription of certified state rules.
- Democratic automatic delegates are separate from pledged PLEOs. First-ballot eligibility follows the [2024 national convention baseline](https://democrats.org/dncc-rules-committee-passes-permanent-rules-for-2024-presidential-nomination/); later ballots include eligible automatic voting weight. Democrats Abroad's automatic members are represented by voting weight. Republican RNC members are included in their state delegation, not added afterward.
- Libertarian and Green conventions use distinct [Libertarian](https://lp.org/wp-content/uploads/2026-Indexed-LP-Bylaws-and-Convention-Rules-w-2026-JC-Rules-1.pdf) and [Green](https://gpus.org/convention-rules/) baselines. Member organization drives modeled state delegation preferences. Repeated ballots, applicable elimination, and no-nominee outcomes are supported. Major-party candidates are not eliminated by a minor-party rule.
- Congressional-district geography uses fractional, population-balanced county partitions. These are **modeled districts**, not official boundary crosswalks. Democratic caucus realignment uses local county assemblies as representative precinct rooms; Republican caucuses retain initial preferences. Exact precinct procedures and 2028 delegate slates remain scenario abstractions.
- Eligibility partitions the potential electorate between enabled parties, then applies closed/open/member participation factors. It does not invent measured registration data. Early ballots freeze progressively and cannot be redirected by a subsequent withdrawal. Endorsement cohorts transfer a bounded fraction according to compatibility, with some attrition; organization or treasury ownership does not automatically transfer with an endorsement.
- Uncommitted preferences are scenario options in selected Democratic contests. Weather, opinion profiles, donor behavior, turnout, candidate traits, and polling uncertainty are game inputs, not factual forecasts.

## Files and persistence

The original global-JavaScript structure is retained. `primaryRules.js` defines versioned rules and allocation; `primaryCampaign.js` owns candidates and contests; `primaryNegotiations.js` owns commitments and conventions; `primaryIntegration.js` bridges persistence and the calendar. `primaryNative.js`, loaded last, connects nominations to the existing campaign screen, action systems, candidate polling, county views and results locks. `primaryUI.js` supplies setup and nomination detail panels; `primary.css` styles those panels to match the campaign. The election date adjustment is in `config.js`.

Autosaves and manual saves use IndexedDB under `decision-2028-campaigns`. Exported JSON includes the rules version, deterministic nomination RNG, roster, queues, results, early ballots, negotiation ledger, convention history, and the existing simulation snapshot. Import validates the save format before replacing the current campaign. The original demographic assets are not duplicated into save files. Same-browser resume and downloadable export are available for either starting mode.

## Continuation

See `planning/PRIMARY_IMPLEMENTATION_PROGRESS.md` for ownership and completion state. Preserve other uncommitted work. If the user reports an issue or says “finish,” inspect the current implementation and their latest instructions before making further changes. Testing remains with the user unless they change that instruction.
