# Candidate effect inventory

This inventory records the simulator's current mechanics. It does not treat designer-set values as measured effects of real people. For the provenance of demographic and election inputs, see [DATA_PROVENANCE_AUDIT.md](DATA_PROVENANCE_AUDIT.md).

## Active paths

| Input or mechanism | Where it acts | Interaction to account for |
|---|---|---|
| Candidate and running-mate `groupEffects`, plus legacy `groupBoosts` and `groupDebuffs` | `js/candidates.js` normalizes legacy entries into support and turnout. `js/main.js` applies group-weighted effects, while `js/election.js` also reads group turnout. | A legacy entry changes support and turnout together. A structured `groupEffects` entry can state them separately. Aliases and parent-child groups can cause one entry to reach several audiences. |
| `CANDIDATE_POSITIONS`, live issue positions, issue credibility, and campaign priorities | `js/issueCatalog.js`, `js/electorate.js`, `js/campaignPriorities.js`, and advertising or campaign actions | The same candidate can be affected by issue alignment, issue attention, message credibility, and priority-driven activity. These effects are not interchangeable. |
| Trump/Harris reference residuals | `js/candidateEraEffects.js` inside `Electorate.response()` | The county baseline already represents the reference election. The era layer changes preference and participation for successor tickets relative to that baseline. Its parameters are designer assumptions, not causal estimates. |
| Candidate `funds`, `stamina`, `charisma`, `debateSkill`, and `scandalResistance` | `js/ai.js`, `js/campaign.js`, `js/debates.js`, and `js/scandals.js` | These affect campaign resources, actions, or events and can indirectly change the electorate. They are separate from baseline vote preference. |
| `regionalSpillover`, named buffs, `localBoosts`, and third-party `siphonFromMajorParties` | `applyCandidateBuffs()` in `js/main.js` | Regional spillover and the named Midwest effect still apply flat geographic shifts. `localBoosts` targets named counties. These paths must be examined alongside group effects to avoid overlapping shifts. |
| Ground operations, ads, debates, endorsements, policies, scandals, and coalition loyalty | Their respective modules, with county and group results recomputed downstream | Campaign events can affect attention, preference, participation, or candidate resources after the initial candidate setup. |

## Home-state rule

The automatic presidential and running-mate home-state vote shifts have been removed from `applyCandidateBuffs()`. Obsolete `homeStateBoost` definitions have been removed. `homeState` and `state` remain for display and existing event geography. In particular, `js/debates.js` still confines vice-presidential debate effects to the running mate's state and listed spillover states. The remaining flat regional and local scenario effects are separate rules and remain active.

## Evidence boundary

Pew's validated-voter analysis describes 2024 vote choice and turnout differences, but those observations do not isolate a separate causal effect for every hypothetical 2028 candidate or for each campaign mechanic. The [Pew 2024 voting analysis](https://www.pewresearch.org/politics/2025/06/26/voting-patterns-in-the-2024-election/) and [methodology](https://www.pewresearch.org/politics/2025/06/26/validated-voters-2024-methodology/) provide the reference and its limits. Research on [presidential versus vice-presidential home-state effects](https://ecommons.udayton.edu/pol_fac_pub/97/) finds different patterns for the two offices, with the vice-presidential effect conditional on candidate and state characteristics.
