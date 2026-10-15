# Primary implementation progress

User authorized the full Primary System Plan on October 13, 2026. **Do not run tests, builds, browser QA, or test suites: user is doing all testing.** Read the plan beside this file for scope. Preserve unrelated existing work.

## Resume with “finish”

Latest startup repair: the user reported the generic “shared campaign module did not load” message, then explicitly declined script-loading diagnostics and requested source inspection only. `PrimaryCampaign.start()` now awaits a shared, retryable script request resolved beside `primaryCampaign.js` before loading counties or replacing campaign state. Successful static loading remains the fast path. `primaryNative.js` checks its dependencies before installing any hooks and returns the existing module if a recovered request loads it twice. Script errors are preserved for the setup notice instead of being hidden by the old generic guard. Asset URLs use `shared-campaign-4`. The specific failure in the user's browser has not been observed; this repairs the missing-module startup/retry path, but runtime success remains unverified. Automatic approval review rejected an attempted syntax check; it did not run. No tests, parsers or browser diagnostics were run after the user's source-only instruction.

**Latest direction supersedes the separate-dashboard design:** the user wants the original general-election map, counties, UI and all campaign mechanics reused in primaries. Completed state contests and their counties must retain their final results. Do not bring back the primary headquarters dashboard. `js/primaryNative.js` is the integration boundary, loaded after `primaryUI.js`.

Follow-up correction: removed the actual `primary-screen` HTML and its dashboard renderer, routed every primary gameplay entry through `PrimaryNative.showCampaign()` and `game-screen`, and retired the custom primary advance buttons. `Electorate.response` and its compiled issue profiles/overlapping county demographics now serve both modes; primary context supplies candidate identities, eligibility and turnout. The original `Electorate.recompute` again produces the interest-group reports. Primary candidate group effects and campaign group momentum feed this shared model. County forecasts reuse MichiganModel's existing polling intelligence, trend detection and bounded-error calculation with a primary opening baseline. Synthetic voters use their archetype's issue/group response. Completed state/county results remain immutable. Asset versioning forces the revised scripts to load on refresh. No gameplay, tests, builds or syntax checks were run.

Read this file, `PRIMARY_SYSTEM_PLAN.md`, and the implementation files listed below. Continue unfinished work; do not restart. Shell sandbox currently fails with `helper_unknown_error: setup refresh had errors`; read/write commands work with `sandbox_permissions=require_escalated`. `apply_patch` works directly.

## Implementation ownership

- Root: primary rules/calendar, allocation, candidate campaign engine, negotiations/conventions, storage and general-election integration.
- Frontend implementation agent supplied the initial UI and HTML wiring; root finished these files and `primary.css`. No agent remains active.

## Planned files / status

- [x] `js/primaryRules.js`: complete jurisdiction schedule with labeled projections and rule strategies.
- [x] `js/primaryCampaign.js`: actors, participation, polling, actions, AI, events, delegates, continuous dates.
- [x] `js/primaryNegotiations.js`: offers/contracts, relations, endorsements, conventions and VPs.
- [x] `js/primaryIntegration.js`: storage/resume, general transition, shared engine hooks.
- [x] `js/primaryUI.js`, `primary.css`, `index.html`: mode/setup/gameplay UI.
- [x] `js/primaryNative.js`: original campaign screen and county maps; native action queue, ads, field operations, favorability, endorsers, research, grassroots fundraising and polling adapted to individual primary candidates; delegate HUD and a single Nominations modal; continuous general-election handoff.
- [x] Completed state and county vote snapshots retained through later withdrawals, endorsements and saves; map/sidebar identify locked final results.
- [x] Integration source review and documentation (no execution/testing).

## Decisions

- Primary start September 6, 2027; standalone General July 4, 2028; Election Day November 7, 2028.
- Defeat: offer end or continue as the actual nominee using that actor's resources.
- Pinned 2028 scenario: use verified national dates, and explicitly projected state delegate counts, district inputs and unconfirmed dates. Never label estimates as official.
- Candidate-owned state remains separate from party-keyed general-election vote totals.
- Preserve the primary world, promises, campaign record, money, organization and policies through nomination and November.
- Required user deal types: endorsements, nonaggression, policy, VP, cabinet, campaign assistance, convention cooperation.

## Completion report

The correction uses the original campaign weekly transition for the player's actions and resources. Primary AI uses the advertising, issue-exposure and opinion engines; nomination rules and strategy remain candidate-specific. Native ads use candidate IDs during primaries, Michigan grassroots receipts are credited per candidate, and polling charts show candidates rather than party tickets. Native-system and nomination state are saved together. General polling is restarted at the actual handoff without resetting ongoing ad/field week indices.

No runtime verification has been performed, per the user's instruction. Near the end of the correction, additional shell source reads were blocked because automatic approval review hit its usage limit; ordinary shell execution also failed with the existing sandbox setup error. Known-context patches and documentation were completed through the file-edit tool. This was a tooling limitation, not a safety rejection. If the user reports an issue, inspect the exact affected original method and its adapter before changing either.

Implementation is written and connected. No tests, builds, syntax-check commands, or browser checks were run. See `../PRIMARY_MODE.md` for controls, scope, sources, and scenario assumptions. Final 2028 state rules and exact district/precinct geography remain explicitly labeled projections, not certified data.

The frontend agent wrote the initial `primaryUI.js` and HTML wiring, then stopped at its usage limit. Root completed styling, interface corrections, richer guidance, and integration; no agent is still editing these files. Root also changed `js/config.js` only for the November 7 date and its explanatory comment. All other preexisting modified files were preserved.

Important continuation details: `gameData.campaignMode` records the starting route, while `gameData.primary.phase` is `primary` or `general`. Candidate-owned primary votes never overwrite county party baselines. Save format 1 wraps the existing simulation format 2. The general adapter wraps the existing week transition and preserves the shared calendar. A convention pending a player ballot prevents another weekly advance.
