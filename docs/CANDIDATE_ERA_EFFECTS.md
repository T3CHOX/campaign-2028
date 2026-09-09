# Candidate-era coalition effects

This model represents a designed plausibility layer for the 2028 scenario. It is not a causal decomposition of the 2016, 2020 or 2024 elections. The group weights and effect sizes in `js/candidateEraEffects.js` are designer-set assumptions and must not be read as estimated constants.

## Model contract

The simulator keeps four things separate:

1. The existing issue-position model determines ordinary candidate preference.
2. The era layer transfers a modeled historical coalition residual into the existing preference logits.
3. The era layer changes Republican and Democratic participation rates separately.
4. The repudiation term is a separate cross-pressure effect; it is not a negative version of movement alignment.

The era layer runs inside `Electorate.response()`. It does not mutate `INTEREST_GROUPS`, `liveGroups`, `interestGroupSupport`, or the county population. Because `Electorate.countyResult()` multiplies each group rate by registered voters, turnout effects can change total expected ballots rather than merely reallocating a fixed ballot pool.

The ordinary county baseline already reflects the 2016, 2020, and 2024 Republican performance encoded by the simulator. Trump is therefore the zero-delta reference. A successor does not receive a new Trump bonus: it inherits a bounded residual and loses the rest of the baseline effect. This prevents the era mechanic from stacking a second, overpowered advantage on top of Trump-era data.

## Qualitative candidate profiles

Profiles are scenario classes, not candidate ratings:

- `personalistic`: the candidate-specific effect is allowed to reach the highest transfer ceiling.
- `movement_aligned`: some movement-era activation transfers, but the personalistic component is sharply capped.
- `party_standard`: the ordinary party coalition remains available, with little movement-specific transfer.
- `repudiating`: movement transfer is absent and the independent repudiation channel is available.

The transfer caps and structural-persistence constant are designer-set calibration controls, not empirical candidate ratings. They encode the intended asymmetry: movement alignment preserves some residual, conventional Republicanism preserves less, and repudiation starts from the baseline-loss case before receiving its separate crossover term.

The initial ID and faction mappings are explicit assumptions for the simulator’s fictional 2028 scenario. They can be overridden with `candidate.eraProfile` without changing the underlying issue positions.

## Evidence boundary

Validated-voter research finds measurable changes in coalition composition and turnout across 2016, 2020 and 2024, including a more diverse Republican coalition in 2024. It does not identify how much of each change was caused by policy, personality, party structure, or campaign context. Candidate-trait research supports testing candidate-specific turnout effects, while experimental evidence on anti-Trump or anti-endorsement effects is mixed. Those findings motivate the structure but do not determine the constants in this file.

Sources:

- Pew Research Center, “Detailed demographic profiles of Trump and Harris voters in 2024”: https://www.pewresearch.org/politics/2025/06/26/demographic-profiles-of-trump-and-harris-voters-in-2024/
- Pew Research Center, “Voter turnout in the 2020 and 2024 elections”: https://www.pewresearch.org/politics/2025/06/26/voter-turnout-2020-2024/
- Political Behavior, “The Personalization of Electoral Participation?”: https://link.springer.com/article/10.1007/s11109-024-09949-3
- PS: Political Science & Politics, “The Causal Effects of a Trump Endorsement on Voter Preferences in a General Election Scenario”: https://www.cambridge.org/core/journals/ps-political-science-and-politics/article/causal-effects-of-a-trump-endorsement-on-voter-preferences-in-a-general-election-scenario/2F6A370176BD854C2EA52736E98F2E1D
