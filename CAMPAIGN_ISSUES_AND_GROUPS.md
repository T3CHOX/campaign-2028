# Campaign Issues, Groups & Factions

> Human-readable reference generated from the current simulator definitions. Edit this file directly for notes or planning; regenerate it with `node scripts/generate-campaign-reference.mjs` when the source definitions change.

**Current snapshot:** 55 issues · 34 voter/constituency groups · 9 factions · 7 PACs · 8 coalition breakpoints

## How to read the issue positions

Every issue uses the same seven-position ideological scale. The labels are scenario positions, not claims about real candidates or current law.

| Position | Model value | Meaning in the catalog |
|---|---:|---|
| Far Left | -9 | Most interventionist or expansive position on this issue |
| Left | -6 | Strong interventionist or progressive position |
| Center Left | -3 | Moderately progressive position |
| Center | 0 | Mixed, incremental, or balancing position |
| Center Right | 3 | Moderately market-oriented or restrictive position |
| Right | 6 | Strong market-oriented or restrictive position |
| Far Right | 9 | Least federal intervention or most restrictive position, depending on the issue |

## 1. Issues and positions

### Economy & Work

#### 1. Inflation & cost of living

- ID: `economy`
- Issue description: Prices and household budgets are under pressure, raising questions about relief, supply, regulation, and the role of the Federal Reserve.

| Position / ideology | Value | Position description |
|---|---:|---|
| Far Left | -9 | Use public ownership of essential services, price ceilings and universal income supports to protect households; accept extensive intervention in market allocation. |
| Left | -6 | Regulate excessive pricing and expand public provision of necessities, funding substantial household relief through progressive revenue. |
| Center Left | -3 | Pair targeted cost-of-living assistance with competition enforcement and supply investment, while retaining an independent central bank. |
| Center | 0 | Combine temporary targeted relief with supply measures and monetary restraint; avoid permanent broad subsidies or sweeping price controls. |
| Center Right | 3 | Prioritize faster permitting, business investment and restrained federal spending, with limited assistance for the most vulnerable households. |
| Right | 6 | Reduce taxes and regulation broadly and cut federal spending, relying mainly on private production and monetary discipline to restrain prices. |
| Far Right | 9 | Sharply reduce federal economic management and subsidies, allowing market prices and private contracting to allocate essential goods with minimal federal intervention. |

#### 2. Taxes & wealth

- ID: `taxation`
- Issue description: The central choice is who pays, how much, and whether tax policy should prioritize redistribution, growth, or simpler revenue collection.

| Position / ideology | Value | Position description |
|---|---:|---|
| Far Left | -9 | Impose steep wealth, inheritance and high-income taxes to redistribute economic power and fund extensive universal public services. |
| Left | -6 | Increase progressive income, capital-gains and corporate taxes substantially, using the proceeds for universal benefits and public investment. |
| Center Left | -3 | Raise taxes on high earners and close corporate loopholes while expanding credits for lower- and middle-income households. |
| Center | 0 | Broaden the tax base, simplify deductions and maintain roughly stable overall revenue, balancing distributional and investment concerns. |
| Center Right | 3 | Lower business and middle-income rates modestly while limiting deductions and preserving a progressive income-tax structure. |
| Right | 6 | Substantially reduce income and corporate taxes, favor investment incentives and limit the revenue available for expanded federal programs. |
| Far Right | 9 | Replace most federal income taxation with consumption-based or other limited levies and sharply shrink the federal fiscal footprint. |

#### 3. Trade & tariffs

- ID: `trade`
- Issue description: The country must balance lower-cost global trade against domestic jobs, supply-chain security, labor standards, and protection for vulnerable industries.

| Position / ideology | Value | Position description |
|---|---:|---|
| Far Left | -9 | Reject investor-centered trade agreements and impose strong import restrictions to protect worker control, labor standards and domestic production. |
| Left | -6 | Renegotiate trade deals around enforceable labor and environmental standards, using selective tariffs to protect vulnerable domestic industries. |
| Center Left | -3 | Support international trade with binding labor standards, adjustment assistance and narrow remedies against dumping or unfair subsidies. |
| Center | 0 | Favor open trade and predictable multilateral rules, reserving tariffs for clearly documented unfair practices and security exceptions. |
| Center Right | 3 | Expand market access through reciprocal agreements while safeguarding strategic supply chains and enforcing intellectual-property protections. |
| Right | 6 | Use substantial targeted tariffs and domestic-content requirements to reduce dependence on geopolitical rivals and encourage reshoring. |
| Far Right | 9 | Use broad protective tariffs and extensive import restrictions to prioritize national self-sufficiency, accepting higher costs for imported goods. |

#### 4. Industrial policy

- ID: `industrial`
- Legacy ID: `economy`
- Issue description: The debate is over whether government should actively build strategic industries or leave investment decisions mainly to private markets.

| Position / ideology | Value | Position description |
|---|---:|---|
| Far Left | -9 | Place major strategic industries under public or worker ownership and direct investment through national production plans. |
| Left | -6 | Establish large public investment programs with ownership stakes, strong union conditions and long-term national industrial planning. |
| Center Left | -3 | Use targeted grants and tax credits for strategic industries with labor, competition and environmental safeguards. |
| Center | 0 | Support a limited set of strategic investments with competitive awards, measurable milestones and sunset provisions. |
| Center Right | 3 | Prefer broad investment incentives and faster permitting, reserving direct subsidies for exceptional national-security needs. |
| Right | 6 | Rely chiefly on private capital and deregulation, opposing most sector-specific subsidies and government ownership stakes. |
| Far Right | 9 | Eliminate federal industrial subsidies and public investment planning, leaving production and research financing almost entirely to private markets. |

#### 5. Minimum wage

- ID: `minwage`
- Issue description: Policymakers must weigh higher pay and living costs against concerns about hiring, prices, and flexibility for employers.

| Position / ideology | Value | Position description |
|---|---:|---|
| Far Left | -9 | Set a high national living wage tied to household needs, combine it with sector-wide bargaining and publicly guarantee access to paid work. |
| Left | -6 | Substantially increase the federal minimum wage, index it to living costs and eliminate lower tipped-worker wage rules. |
| Center Left | -3 | Phase in a higher federal wage floor with automatic inflation adjustments and transitional assistance for small employers. |
| Center | 0 | Adopt a moderate phased increase with regional flexibility, monitoring hiring and prices before further adjustments. |
| Center Right | 3 | Keep a modest national floor and leave most increases to states, using earned-income credits to supplement low wages. |
| Right | 6 | Oppose federal minimum-wage increases and let states or individual employers determine most wage arrangements. |
| Far Right | 9 | Repeal the federal wage floor and rely on voluntary wage contracts, with no federal requirement to raise low hourly pay. |

#### 6. Unions & bargaining

- ID: `labor`
- Issue description: This issue sets the rules for organizing, bargaining, striking, and the balance of power between workers and employers.

| Position / ideology | Value | Position description |
|---|---:|---|
| Far Left | -9 | Give workers controlling ownership or governance rights and establish compulsory sector-wide bargaining over pay and production conditions. |
| Left | -6 | Expand sectoral bargaining, protect broad strike rights and make union recognition substantially easier across private and public workplaces. |
| Center Left | -3 | Strengthen organizing protections, penalize employer retaliation and simplify certification while retaining enterprise-level bargaining. |
| Center | 0 | Protect organizing and bargaining with balanced election rules, mediation and limits on disruptive or coercive practices by either side. |
| Center Right | 3 | Maintain voluntary workplace unions while strengthening individual opt-outs and employer flexibility in workplace agreements. |
| Right | 6 | Expand right-to-work rules and limit compulsory fees, secondary strikes and public-sector bargaining powers. |
| Far Right | 9 | Remove most federal collective-bargaining mandates and treat employment and representation largely as individual private contracts. |

#### 7. Corporate concentration

- ID: `antitrust`
- Legacy ID: `taxation`
- Issue description: The question is how aggressively to challenge large firms, mergers, and market power that may affect consumers, workers, or competitors.

| Position / ideology | Value | Position description |
|---|---:|---|
| Far Left | -9 | Break up dominant firms and move essential monopolies into public or cooperative ownership to disperse private economic power. |
| Left | -6 | Aggressively block concentration, separate integrated platforms and expand antitrust standards to worker and supplier power. |
| Center Left | -3 | Strengthen merger review and enforcement against exclusionary conduct, including measurable harms to workers and small businesses. |
| Center | 0 | Apply case-by-case competition rules based on demonstrated market power, entry barriers and consumer or worker harm. |
| Center Right | 3 | Retain antitrust enforcement but emphasize efficiency, entry and clear evidence rather than firm size alone. |
| Right | 6 | Narrow intervention to clear collusion or exclusion, permitting most mergers and rejecting broad structural breakups. |
| Far Right | 9 | Minimize federal antitrust restrictions and accept large private firms unless they obtain privileges directly through government coercion. |

#### 8. Small-business regulation

- ID: `business`
- Legacy ID: `economy`
- Issue description: Small businesses face a tradeoff between easier entry and lower costs versus rules protecting workers, consumers, and communities.

| Position / ideology | Value | Position description |
|---|---:|---|
| Far Left | -9 | Favor public and cooperative finance over private ownership, with strong universal labor and environmental requirements for businesses of every size. |
| Left | -6 | Offer public credit and grants to small firms while applying strong wage, workplace and environmental standards without broad exemptions. |
| Center Left | -3 | Simplify paperwork and expand access to credit while preserving core worker, consumer and environmental protections. |
| Center | 0 | Streamline duplicative requirements and provide compliance assistance, retaining rules with demonstrated public benefits. |
| Center Right | 3 | Expand small-business exemptions, simplify taxes and speed licenses while retaining basic fraud and safety rules. |
| Right | 6 | Remove many federal licensing, labor and environmental compliance obligations and sharply limit new regulations on smaller employers. |
| Far Right | 9 | Dismantle most federal business regulation and public lending, leaving market entry and operating standards primarily to private agreement. |

### Housing & Infrastructure

#### 9. Housing supply & zoning

- ID: `housing`
- Legacy ID: `govspend`
- Issue description: Housing costs are shaped by construction, zoning, land use, and the extent to which federal policy should encourage more supply.

| Position / ideology | Value | Position description |
|---|---:|---|
| Far Left | -9 | Build housing primarily through public and community ownership, restrict speculative landholding and guarantee housing access as a public service. |
| Left | -6 | Fund a large social-housing program and condition federal grants on inclusive zoning and permanently affordable development. |
| Center Left | -3 | Expand affordable construction and reward local zoning reform, pairing denser development with tenant and anti-displacement protections. |
| Center | 0 | Encourage a mix of private and subsidized construction with local planning flexibility and targeted infrastructure grants. |
| Center Right | 3 | Reduce construction rules and fees through incentives, prioritizing private supply and limiting ongoing federal operating subsidies. |
| Right | 6 | Remove federal development restrictions and favor private building while leaving most land-use decisions to local governments. |
| Far Right | 9 | Withdraw most federal housing programs and land-use conditions, relying on private property rights and locally determined construction rules. |

#### 10. Rent & housing assistance

- ID: `rent`
- Legacy ID: `govspend`
- Issue description: The debate weighs rent relief and tenant protections against the need to preserve incentives for building and maintaining housing.

| Position / ideology | Value | Position description |
|---|---:|---|
| Far Left | -9 | Guarantee housing through public provision, impose strong rent ceilings and sharply constrain evictions and speculative rental ownership. |
| Left | -6 | Expand rent stabilization and universal housing assistance, giving tenants strong protections against eviction and displacement. |
| Center Left | -3 | Increase vouchers, targeted tenant protections and first-time buyer assistance while supporting construction to limit price pressure. |
| Center | 0 | Target assistance to severe housing need and use limited tenant protections that preserve maintenance and new construction incentives. |
| Center Right | 3 | Use time-limited targeted vouchers and ownership incentives, opposing broad rent controls that may reduce rental supply. |
| Right | 6 | Reduce federal housing subsidies and tenant regulation, relying on private supply, local charities and market rents. |
| Far Right | 9 | End most federal rent assistance and rent regulation, treating housing support primarily as a private or local responsibility. |

#### 11. Transport & infrastructure

- ID: `infrastructure`
- Legacy ID: `govspend`
- Issue description: The country must decide which infrastructure to prioritize and how much should be funded through taxes, user fees, or private investment.

| Position / ideology | Value | Position description |
|---|---:|---|
| Far Left | -9 | Nationalize major transport systems, provide fare-free public transit and prioritize public planning over private road or rail investment. |
| Left | -6 | Greatly expand public transit, rail and water investment with strong labor standards and progressive federal financing. |
| Center Left | -3 | Increase repair and transit funding with transparent procurement, climate resilience and access for underserved communities. |
| Center | 0 | Prioritize maintenance and high-benefit projects through a mix of grants, user fees and public-private partnerships. |
| Center Right | 3 | Favor roads, ports and essential repairs, using private investment, user fees and streamlined permitting where practical. |
| Right | 6 | Reduce federal project selection and shift financing toward states, tolls and private infrastructure operators. |
| Far Right | 9 | Privatize most commercially viable infrastructure and sharply limit federal ownership, subsidies and long-term capital planning. |

#### 12. Broadband & digital access

- ID: `broadband`
- Legacy ID: `economy`
- Issue description: The goal is wider, more affordable internet access while deciding how much government should fund or regulate communications networks.

| Position / ideology | Value | Position description |
|---|---:|---|
| Far Left | -9 | Treat broadband as a universal public utility with publicly owned networks, low or zero user charges and strong open-access rules. |
| Left | -6 | Build extensive municipal or cooperative broadband and guarantee affordable access through federal investment and network neutrality. |
| Center Left | -3 | Subsidize underserved areas, permit community networks and enforce affordability and open-internet obligations on funded providers. |
| Center | 0 | Use competitive grants and targeted affordability support, with provider-neutral technology rules and measurable coverage commitments. |
| Center Right | 3 | Encourage private and satellite deployment through lighter permitting and narrow subsidies for genuinely uneconomic locations. |
| Right | 6 | Limit federal subsidies and network regulation, relying primarily on competition and private investment to extend service. |
| Far Right | 9 | End federal broadband subsidy programs and utility-style rules, leaving access, pricing and network management to private contracts. |

### Health & Retirement

#### 13. Health insurance & coverage

- ID: `healthcare`
- Issue description: The main choices concern coverage, affordability, and how responsibility should be divided between public programs, employers, insurers, and patients.

| Position / ideology | Value | Position description |
|---|---:|---|
| Far Left | -9 | Create a publicly owned healthcare service with universal coverage and largely replace private insurance and profit-driven provision. |
| Left | -6 | Establish comprehensive single-payer coverage financed by taxes, replacing most duplicative private insurance while allowing independent providers. |
| Center Left | -3 | Offer a public insurance option and expand subsidies and public eligibility while retaining regulated private plans. |
| Center | 0 | Maintain mixed public-private coverage with targeted affordability reforms and protections for people with high medical needs. |
| Center Right | 3 | Expand private plan choice and competition with targeted assistance, limiting new federal coverage entitlements. |
| Right | 6 | Reduce federal insurance mandates and expand private accounts, state flexibility and market pricing in coverage. |
| Far Right | 9 | Shift most healthcare financing to private purchase, charities and local arrangements while substantially reducing federal insurance programs. |

#### 14. Prescription drug prices

- ID: `drugpricing`
- Issue description: Policymakers are balancing lower prescription costs and access to medicine against competition, research incentives, and patent protections.

| Position / ideology | Value | Position description |
|---|---:|---|
| Far Left | -9 | Place essential drug production and research in public ownership and supply necessary medicines at minimal or no patient cost. |
| Left | -6 | Use broad mandatory price negotiation, patent interventions and public manufacturing to sharply reduce medicine costs. |
| Center Left | -3 | Expand negotiation and competition, cap selected patient costs and penalize unjustified price increases. |
| Center | 0 | Target affordability problems through generics, transparency and limited negotiation while preserving incentives for research. |
| Center Right | 3 | Speed generic approvals and increase market competition, preferring targeted assistance to broad government price-setting. |
| Right | 6 | Oppose most federal price negotiation and caps, emphasizing patent incentives, private bargaining and faster regulatory approvals. |
| Far Right | 9 | Remove most federal medicine price controls and subsidy programs, leaving research financing and pricing to voluntary private markets. |

#### 15. Social Security

- ID: `socialsecurity`
- Legacy ID: `govspend`
- Issue description: Social Security must balance reliable retirement benefits with eligibility rules, payroll taxes, and the program’s long-term finances.

| Position / ideology | Value | Position description |
|---|---:|---|
| Far Left | -9 | Guarantee a substantially larger universal public pension, lower retirement eligibility and finance it through broad progressive taxation. |
| Left | -6 | Expand benefits and protect retirement ages by substantially increasing contributions from high earners and other progressive revenue. |
| Center Left | -3 | Protect scheduled benefits and improve low-income retirement support, raising the taxable wage cap to strengthen financing. |
| Center | 0 | Negotiate a mix of additional revenue and gradual benefit adjustments while protecting current retirees and low-income workers. |
| Center Right | 3 | Preserve a basic public benefit while gradually adjusting retirement ages or formulas and encouraging supplemental private savings. |
| Right | 6 | Introduce partial private accounts and reduce future benefit growth to limit the program’s long-term tax requirements. |
| Far Right | 9 | Replace most public retirement provision for future workers with individual savings, while establishing a transition for existing commitments. |

#### 16. Medicare & elder care

- ID: `medicare`
- Legacy ID: `healthcare`
- Issue description: The issue covers Medicare coverage and the growing cost of long-term care, including how much should be paid by families or government.

| Position / ideology | Value | Position description |
|---|---:|---|
| Far Left | -9 | Provide comprehensive public health and long-term care for every older adult without premiums, replacing most private elder-care financing. |
| Left | -6 | Greatly expand Medicare benefits and publicly financed home or residential care, funded by progressive taxation. |
| Center Left | -3 | Add selected benefits, reduce out-of-pocket costs and expand support for home care and family caregivers. |
| Center | 0 | Protect essential benefits while testing payment reforms and targeted caregiver support to control costs. |
| Center Right | 3 | Expand competing plan choices and targeted assistance, emphasizing care coordination and restrained growth in federal commitments. |
| Right | 6 | Move toward capped federal contributions and greater private-plan responsibility for retirement health coverage. |
| Far Right | 9 | Shift future elder-care financing mainly to private insurance and savings, sharply limiting open-ended federal benefit guarantees. |

#### 17. Mental health & addiction

- ID: `mentalhealth`
- Legacy ID: `healthcare`
- Issue description: Communities are deciding how to expand mental-health care and address addiction through treatment, prevention, harm reduction, and crisis response.

| Position / ideology | Value | Position description |
|---|---:|---|
| Far Left | -9 | Guarantee publicly provided mental healthcare and harm-reduction services, decriminalizing drug possession and minimizing coercive treatment. |
| Left | -6 | Fund universal community treatment, housing and harm reduction, prioritizing voluntary care over criminal penalties. |
| Center Left | -3 | Expand insurance coverage, crisis teams and evidence-based addiction treatment with targeted overdose prevention programs. |
| Center | 0 | Combine treatment, prevention and crisis intervention with supervised court referrals when public safety or severe impairment requires action. |
| Center Right | 3 | Support targeted treatment and recovery programs alongside firmer enforcement against public disorder and illicit drug distribution. |
| Right | 6 | Prioritize abstinence-based recovery, compulsory treatment in defined cases and stronger penalties for drug supply and public disorder. |
| Far Right | 9 | Emphasize punitive drug enforcement and broad compulsory intervention, with limited federal support for harm-reduction or universal treatment programs. |

### Immigration

#### 18. Border security

- ID: `immigration`
- Issue description: Border policy combines staffing and technology with decisions about barriers, enforcement, legal entry, and the treatment of unauthorized crossings.

| Position / ideology | Value | Position description |
|---|---:|---|
| Far Left | -9 | Replace restrictive border enforcement with broadly free movement and humanitarian processing, ending most detention and physical exclusion infrastructure. |
| Left | -6 | Greatly reduce detention and barrier construction and prioritize humanitarian processing, legal access and independent oversight. |
| Center Left | -3 | Improve lawful processing, staffing and targeted security technology while limiting detention and protecting access to asylum. |
| Center | 0 | Balance enforceable border rules with orderly asylum processing, adequate staffing and accountability for enforcement conduct. |
| Center Right | 3 | Increase staffing, surveillance and targeted barriers while narrowing release exceptions and preserving limited humanitarian processing. |
| Right | 6 | Expand barriers, detention and restrictive entry rules, prioritizing deterrence and rapid return of unauthorized arrivals. |
| Far Right | 9 | Use maximal physical restrictions and extensive emergency enforcement to sharply curtail unauthorized entry, accepting substantial limits on humanitarian access. |

#### 19. Asylum & refugees

- ID: `asylum`
- Legacy ID: `immigration`
- Issue description: The system must balance protection for people fleeing persecution with orderly processing, admission limits, and border capacity.

| Position / ideology | Value | Position description |
|---|---:|---|
| Far Left | -9 | Provide broad sanctuary and expansive protection eligibility, ending detention and numerical refugee limits wherever administratively possible. |
| Left | -6 | Greatly expand admissions and legal assistance, interpreting protection grounds broadly and using community-based case management. |
| Center Left | -3 | Increase timely hearings, legal access and refugee capacity while preserving individualized screening and anti-fraud safeguards. |
| Center | 0 | Maintain a meaningful protection system with faster decisions, clear eligibility rules and removal after final denial. |
| Center Right | 3 | Narrow eligibility and strengthen screening, requiring more claims to be processed outside the country or through designated routes. |
| Right | 6 | Reduce refugee admissions substantially and impose restrictive asylum access, detention and external-processing arrangements. |
| Far Right | 9 | Suspend most refugee admissions and sharply restrict asylum availability, prioritizing exclusion over expanded humanitarian protection. |

#### 20. Deportation & enforcement

- ID: `deportation`
- Legacy ID: `immigration`
- Issue description: Policymakers must set enforcement priorities and decide how detention, removals, and cooperation with state and local authorities should work.

| Position / ideology | Value | Position description |
|---|---:|---|
| Far Left | -9 | End most immigration detention and deportations, replacing removal enforcement with broad regularization and protections against status-based policing. |
| Left | -6 | Limit deportation to exceptional serious cases, end large detention contracts and restrict local participation in immigration enforcement. |
| Center Left | -3 | Prioritize serious public-safety cases, provide due process and protect established families from indiscriminate enforcement. |
| Center | 0 | Enforce final removal decisions with defined priorities, judicial safeguards and proportional use of detention. |
| Center Right | 3 | Broaden interior enforcement and local cooperation while retaining targeted humanitarian exceptions and ordinary legal review. |
| Right | 6 | Expand detention, workplace checks and removals across most unauthorized residents, with limited exemptions. |
| Far Right | 9 | Pursue comprehensive removal of unauthorized residents through intensive nationwide enforcement and broad detention capacity. |

#### 21. Legal status & citizenship

- ID: `citizenship`
- Legacy ID: `immigration`
- Issue description: The debate asks whether long-term undocumented residents should receive legal status, a path to citizenship, or neither.

| Position / ideology | Value | Position description |
|---|---:|---|
| Far Left | -9 | Provide immediate broad legal status and a short, accessible route to citizenship with minimal income, employment or residence barriers. |
| Left | -6 | Offer broad regularization and an accessible citizenship pathway while reducing fees and punitive eligibility exclusions. |
| Center Left | -3 | Create earned pathways for long-term residents and people brought as children, with clear screening and processing requirements. |
| Center | 0 | Pair limited earned legalization with enforcement and administration reforms, distinguishing residency from eventual citizenship. |
| Center Right | 3 | Consider narrow protections for selected long-term residents while opposing a broad new citizenship pathway. |
| Right | 6 | Oppose broad legalization and require most unauthorized residents to leave before seeking lawful admission. |
| Far Right | 9 | Reject regularization programs and sharply restrict access to citizenship for people who entered or remained without authorization. |

#### 22. Legal immigration levels

- ID: `legalimmigration`
- Legacy ID: `immigration`
- Issue description: This issue sets the overall level and mix of family, employment, and humanitarian immigration accepted each year.

| Position / ideology | Value | Position description |
|---|---:|---|
| Far Left | -9 | Remove most numerical limits and income barriers, prioritizing free movement, family unity and equal access to lawful residence. |
| Left | -6 | Substantially expand family and humanitarian admissions and clear backlogs with fewer numerical and financial restrictions. |
| Center Left | -3 | Increase admissions in high-need categories, reduce family backlogs and make processing more predictable. |
| Center | 0 | Maintain moderate admissions with periodic adjustments for family needs, labor demand and administrative capacity. |
| Center Right | 3 | Favor skills and employment-based selection while limiting expansion of family categories and overall admissions. |
| Right | 6 | Reduce overall admissions and tighten eligibility, prioritizing selected skills and nuclear-family reunification. |
| Far Right | 9 | Impose a steep reduction or broad moratorium on new admissions, allowing only narrow exceptions for essential national needs. |

#### 23. H-1B skilled-work visas

- ID: `h1b`
- Legacy ID: `immigration`
- Issue description: H-1B policy must balance employers’ need for specialized workers with wage protections and opportunities for workers already in the United States.

| Position / ideology | Value | Position description |
|---|---:|---|
| Far Left | -9 | Replace employer-tied temporary visas with portable residence and equal labor rights, preventing employers from using dependent status to weaken bargaining. |
| Left | -6 | Require strong wage floors, worker portability and union consultation before expanding skilled migration programs. |
| Center Left | -3 | Expand skilled-worker access where justified while strengthening wages, portability and enforcement against displacement or abuse. |
| Center | 0 | Adjust visa capacity to demonstrated needs with credible wage rules, transparent selection and timely administration. |
| Center Right | 3 | Increase access for high-skill employers and graduates while preserving targeted wage and fraud protections. |
| Right | 6 | Restrict visas in occupations with available domestic workers and require higher wages and stronger recruitment tests. |
| Far Right | 9 | Severely curtail the program to prioritize domestic hiring, permitting only narrowly defined exceptional skills. |

#### 24. Farm & seasonal-work visas

- ID: `seasonalvisas`
- Legacy ID: `immigration`
- Issue description: Farm and seasonal visas affect food production, labor supply, employers, and protections for temporary migrant workers.

| Position / ideology | Value | Position description |
|---|---:|---|
| Far Left | -9 | Replace tied seasonal visas with full worker mobility, permanent-status options and strong collective bargaining protections. |
| Left | -6 | Require strong pay, housing and safety guarantees and portable status before expanding seasonal labor admissions. |
| Center Left | -3 | Expand reliable access for seasonal employers while improving enforcement, portability and paths for established workers. |
| Center | 0 | Match admissions to demonstrated seasonal demand with enforceable wage, housing and recruitment standards. |
| Center Right | 3 | Streamline applications and increase flexibility for employers while preserving basic safety and anti-fraud checks. |
| Right | 6 | Limit admissions to verified shortages and tighten employer and worker compliance to prioritize domestic labor. |
| Far Right | 9 | Sharply restrict seasonal migration and require industries to rely primarily on domestic recruitment and mechanization. |

### Foreign Policy & Defense

#### 25. Overseas military intervention

- ID: `foreign`
- Issue description: The United States must decide when military force abroad is necessary, justified, and worth the risks of escalation and cost.

| Position / ideology | Value | Position description |
|---|---:|---|
| Far Left | -9 | Close most overseas bases and reject military intervention as a tool of economic or political domination, emphasizing diplomacy and international solidarity. |
| Left | -6 | Avoid discretionary wars, reduce deployments and require stringent democratic authorization for exceptional uses of force. |
| Center Left | -3 | Use force only as a last resort with allied support, a defined objective and enforceable congressional oversight. |
| Center | 0 | Retain selective intervention for clear security or humanitarian objectives, balancing deterrence, diplomacy and long-term costs. |
| Center Right | 3 | Maintain a strong forward presence and willingness to use force to deter adversaries and defend allied security. |
| Right | 6 | Use decisive force for narrowly defined national interests while resisting prolonged nation-building or open-ended peacekeeping. |
| Far Right | 9 | Withdraw from most foreign conflicts and commitments to concentrate military power on territorial defense and national autonomy. |

#### 26. Israel & Palestine

- ID: `israel`
- Issue description: Policy choices include military support, diplomacy, humanitarian aid, civilian protection, and the conditions attached to U.S. involvement.

| Position / ideology | Value | Position description |
|---|---:|---|
| Far Left | -9 | End military support and impose broad sanctions until equal political rights are secured, backing a rights-based settlement without privileging one state structure. |
| Left | -6 | Suspend offensive military assistance and use strong diplomatic and economic pressure for Palestinian self-determination and civilian protection. |
| Center Left | -3 | Condition military assistance on civilian protections and international obligations while supporting negotiated statehood and humanitarian access. |
| Center | 0 | Balance Israeli security assistance with Palestinian humanitarian support and sustained diplomacy toward a negotiated political settlement. |
| Center Right | 3 | Prioritize Israeli security cooperation while encouraging negotiations and limited conditions aimed at preventing civilian harm. |
| Right | 6 | Provide broad security and diplomatic backing to Israel with few public conditions, opposing unilateral recognition of Palestinian statehood. |
| Far Right | 9 | Support maximal Israeli territorial and security claims and oppose US pressure for Palestinian statehood or significant restrictions on military assistance. |

#### 27. Venezuela policy

- ID: `venezuela`
- Legacy ID: `foreign`
- Issue description: The campaign must weigh sanctions and diplomatic pressure against engagement, recognition, and the effects of policy on migration and Venezuelan civilians.

| Position / ideology | Value | Position description |
|---|---:|---|
| Far Left | -9 | End broad sanctions and oppose outside efforts to determine Venezuela’s government, prioritizing sovereignty and unrestricted economic relations. |
| Left | -6 | Lift broad economic sanctions and emphasize dialogue, civilian relief and opposition to military coercion. |
| Center Left | -3 | Offer phased sanctions relief linked to verifiable political openings, maintaining targeted accountability measures and humanitarian exemptions. |
| Center | 0 | Combine conditional engagement with targeted sanctions and international monitoring of political and humanitarian commitments. |
| Center Right | 3 | Maintain substantial pressure and offer limited relief only after measurable institutional and electoral concessions. |
| Right | 6 | Expand sanctions and diplomatic isolation to force political change, with narrow humanitarian exemptions. |
| Far Right | 9 | Use maximum economic and security pressure, including willingness to consider force, to compel a change in governing authority. |

#### 28. Cuba policy

- ID: `cuba`
- Legacy ID: `foreign`
- Issue description: US policy toward Cuba balances pressure on the government with humanitarian support, family connections, migration, and regional diplomacy.

| Position / ideology | Value | Position description |
|---|---:|---|
| Far Left | -9 | End the embargo and most sanctions, normalize relations and expand travel, remittances, humanitarian assistance and economic engagement without coercive regime-change measures. |
| Left | -6 | Substantially ease broad sanctions and the embargo while supporting humanitarian aid, family ties and diplomacy; use narrow measures against specific abuses. |
| Center Left | -3 | Pair engagement and humanitarian trade with targeted sanctions for documented abuses, expanding family connections and conditioning further relief on rights improvements. |
| Center | 0 | Maintain targeted pressure and clear humanitarian exemptions, preserve family travel and remittances, and adjust engagement as conditions and rights protections change. |
| Center Right | 3 | Maintain core sanctions and conditional engagement, limit benefits to the government and expand support for independent media, civil society and humanitarian channels. |
| Right | 6 | Strengthen sanctions, restrict government-linked trade and travel and increase diplomatic pressure for political reform while protecting direct humanitarian assistance. |
| Far Right | 9 | Pursue maximum economic and diplomatic isolation of the Cuban government, broadly restrict engagement and make normalization contingent on sweeping political change. |

#### 29. Ukraine & Russia

- ID: `ukraine`
- Legacy ID: `foreign`
- Issue description: The central choices are how much support to provide Ukraine, how to pressure Russia, and how to manage escalation and diplomacy.

| Position / ideology | Value | Position description |
|---|---:|---|
| Far Left | -9 | End arms transfers and emphasize immediate negotiations and reduced military blocs, prioritizing de-escalation over continued military assistance. |
| Left | -6 | Limit military assistance and press for negotiations while providing humanitarian relief and opposing attacks on civilians. |
| Center Left | -3 | Sustain defensive support and targeted sanctions with oversight, alongside active diplomacy and escalation safeguards. |
| Center | 0 | Continue conditional military and economic aid with burden-sharing, defined objectives and periodic congressional review. |
| Center Right | 3 | Provide stronger military support and sanctions to deter further aggression, requiring greater allied contributions. |
| Right | 6 | Limit open-ended US funding and demand a rapid settlement while retaining selected leverage against Russia. |
| Far Right | 9 | End most US security commitments to Ukraine and prioritize domestic spending and direct national defense over the conflict. |

#### 30. China & Taiwan

- ID: `china`
- Legacy ID: `foreign`
- Issue description: U.S. policy must balance competition and trade with China against deterrence, Taiwan’s security, and the risk of military conflict.

| Position / ideology | Value | Position description |
|---|---:|---|
| Far Left | -9 | Oppose military containment and economic decoupling, emphasizing negotiated coexistence and reduced US regional military presence. |
| Left | -6 | Favor diplomatic engagement and narrowly targeted restrictions, avoiding a broad arms buildup or economic separation. |
| Center Left | -3 | Combine allied diplomacy, targeted technology safeguards and defensive deterrence while preserving civilian trade and crisis communication. |
| Center | 0 | Balance competition and cooperation, maintain deterrence and use selective restrictions without committing to broad decoupling. |
| Center Right | 3 | Strengthen regional alliances and Taiwan’s defenses while restricting sensitive technologies and strategic dependencies. |
| Right | 6 | Expand economic restrictions and military deterrence, accelerating separation in strategically important supply chains. |
| Far Right | 9 | Pursue extensive decoupling, severe trade restrictions and a confrontational security posture to sharply reduce Chinese influence. |

#### 31. Alliances & NATO

- ID: `nato`
- Legacy ID: `foreign`
- Issue description: The issue concerns the value of alliances, how allies share defense responsibilities, and how much authority to give joint institutions.

| Position / ideology | Value | Position description |
|---|---:|---|
| Far Left | -9 | Replace military blocs with broader collective-security and disarmament arrangements, withdrawing from alliance commitments that sustain overseas military dominance. |
| Left | -6 | Reduce alliance militarization and deployments while emphasizing diplomacy and a more limited defensive mandate. |
| Center Left | -3 | Maintain alliances with strong democratic oversight, diplomacy and shared responsibility for defense and conflict prevention. |
| Center | 0 | Preserve mutual-defense commitments and seek predictable allied contributions and coordinated crisis management. |
| Center Right | 3 | Strengthen alliances and forward deterrence while pressing partners to contribute more defense resources. |
| Right | 6 | Make commitments more conditional on allied spending and direct US interests, reserving greater freedom of unilateral action. |
| Far Right | 9 | Withdraw from or fundamentally limit binding alliances, prioritizing national autonomy over standing mutual-defense obligations. |

#### 32. Defense spending

- ID: `military`
- Issue description: Defense policy sets the level of military spending and the balance between readiness, personnel, weapons, technology, and other national needs.

| Position / ideology | Value | Position description |
|---|---:|---|
| Far Left | -9 | Cut defense spending deeply, close most overseas bases and redirect resources toward civilian services and economic conversion. |
| Left | -6 | Reduce the defense budget substantially, cancel costly programs and prioritize diplomacy and narrower defensive capabilities. |
| Center Left | -3 | Restrain budget growth and eliminate waste while protecting readiness, personnel support and selected modern capabilities. |
| Center | 0 | Maintain a balanced force with audited procurement and spending tied to assessed security needs. |
| Center Right | 3 | Increase readiness and modernization funding, using procurement reforms to improve the value of additional spending. |
| Right | 6 | Substantially expand defense investment, weapons production and military capacity to maintain global superiority. |
| Far Right | 9 | Commit very large resources to military strength and national defense, accepting cuts elsewhere or higher fiscal costs to accelerate expansion. |

#### 33. Foreign aid

- ID: `foreignaid`
- Legacy ID: `foreign`
- Issue description: Foreign-aid policy weighs humanitarian and development goals against costs, oversight, strategic interests, and conditions on recipients.

| Position / ideology | Value | Position description |
|---|---:|---|
| Far Left | -9 | Greatly expand unconditional development assistance, debt relief and climate reparations under recipient-led priorities. |
| Left | -6 | Increase humanitarian and development aid substantially, with strong poverty, rights and climate goals rather than commercial conditions. |
| Center Left | -3 | Expand effective health, food and development programs with transparent delivery and protections against diversion. |
| Center | 0 | Maintain targeted assistance with measurable outcomes, humanitarian exceptions and regular program evaluation. |
| Center Right | 3 | Concentrate aid on strategic partners and effective emergency relief while reducing poorly performing programs. |
| Right | 6 | Cut most development assistance and condition remaining funds tightly on US security and economic interests. |
| Far Right | 9 | End nearly all routine foreign assistance, retaining only exceptional emergency actions tied directly to national interests. |

### Energy & Environment

#### 34. Climate & emissions

- ID: `climate`
- Issue description: Climate policy sets how quickly emissions should fall, which industries must change, and who should bear the transition costs.

| Position / ideology | Value | Position description |
|---|---:|---|
| Far Left | -9 | Use public planning and strict production limits to rapidly phase out high-emission activity, guaranteeing jobs and income through the transition. |
| Left | -6 | Mandate rapid economy-wide emissions cuts with large public investment and strong support for affected workers and communities. |
| Center Left | -3 | Set ambitious enforceable emissions targets using clean investment, standards and assistance for households and workers. |
| Center | 0 | Pursue gradual emissions reductions through mixed standards, incentives and international cooperation with attention to affordability. |
| Center Right | 3 | Favor innovation, adaptation and market incentives over broad emissions mandates, limiting costs imposed on households and firms. |
| Right | 6 | Roll back many federal emissions rules and prioritize energy affordability and voluntary technological change. |
| Far Right | 9 | Remove most federal climate restrictions and international emissions commitments, leaving adaptation and technology choices largely to markets and states. |

#### 35. Oil, gas & fossil fuels

- ID: `energy`
- Issue description: The debate concerns continued fossil-fuel production, energy prices and reliability, environmental risks, and the pace of transition.

| Position / ideology | Value | Position description |
|---|---:|---|
| Far Left | -9 | Bring fossil-fuel production under public control and rapidly phase it down, replacing extraction jobs with guaranteed transition employment. |
| Left | -6 | End new major fossil-fuel development and sharply reduce production over time with public support for affected communities. |
| Center Left | -3 | Restrict high-impact projects and strengthen methane and pollution rules while managing a gradual transition from fossil fuels. |
| Center | 0 | Permit selected development with enforceable environmental safeguards while diversifying the energy supply. |
| Center Right | 3 | Expand responsible domestic production and pipeline capacity with streamlined reviews and targeted pollution controls. |
| Right | 6 | Greatly expand leasing and drilling and reduce permitting and environmental restrictions on fossil-fuel development. |
| Far Right | 9 | Prioritize unrestricted domestic fossil-fuel expansion and remove most federal constraints that limit extraction, transport or use. |

#### 36. Nuclear energy

- ID: `nuclear`
- Legacy ID: `energy`
- Issue description: Nuclear policy weighs low-carbon power and reliability against construction costs, safety, waste storage, and public confidence.

| Position / ideology | Value | Position description |
|---|---:|---|
| Far Left | -9 | Phase out private nuclear generation and prioritize publicly owned renewables, accepting nuclear research only under stringent public and ecological oversight. |
| Left | -6 | Oppose major nuclear expansion and prioritize renewables, storage and conservation while carefully managing existing plant retirements. |
| Center Left | -3 | Keep safe existing plants operating and support limited advanced-reactor research alongside renewables and strong waste safeguards. |
| Center | 0 | Treat nuclear power as one low-carbon option, approving projects that meet transparent cost, safety and waste requirements. |
| Center Right | 3 | Expand nuclear construction through licensing reform and investment incentives while preserving independent safety oversight. |
| Right | 6 | Accelerate reactor licensing and substantial nuclear investment, reducing regulatory delays and supporting domestic fuel supply. |
| Far Right | 9 | Make rapid nuclear expansion a central national energy priority with sweeping exemptions from ordinary permitting and extensive strategic support. |

#### 37. Renewables & the power grid

- ID: `renewables`
- Legacy ID: `climate`
- Issue description: The country must decide how quickly to expand clean power and who should pay for generation, storage, and transmission.

| Position / ideology | Value | Position description |
|---|---:|---|
| Far Left | -9 | Build a publicly owned renewable grid with rapid fossil replacement, universal affordable power and planning that overrides private utility profits. |
| Left | -6 | Use large public investment and binding clean-power mandates to rapidly deploy renewables, storage and transmission. |
| Center Left | -3 | Expand clean-energy incentives and grid construction with labor standards, environmental review and community benefits. |
| Center | 0 | Support a diverse grid and competitive clean-power investment while managing reliability, siting and household costs. |
| Center Right | 3 | Favor technology-neutral competition and selective grid upgrades, phasing down renewable-specific subsidies and mandates. |
| Right | 6 | End most renewable mandates and subsidies and let utilities choose generation based primarily on cost and reliability. |
| Far Right | 9 | Remove federal clean-power targets and most renewable support, prioritizing local control and unrestricted competition from conventional generation. |

#### 38. Water & conservation

- ID: `water`
- Legacy ID: `climate`
- Issue description: Water policy balances reliable drinking water and economic development with habitat protection, conservation, and public-land priorities.

| Position / ideology | Value | Position description |
|---|---:|---|
| Far Left | -9 | Treat water and major ecosystems as public commons, prohibit damaging extraction and guarantee essential water services outside profit-driven markets. |
| Left | -6 | Expand protected lands and strict water-quality rules with major public restoration and affordable-water investment. |
| Center Left | -3 | Strengthen water infrastructure and habitat protections while funding practical conservation and assistance for affected communities. |
| Center | 0 | Balance reliable water, habitat and economic use through targeted regulation, restoration and negotiated management. |
| Center Right | 3 | Use incentives and state-led management to conserve resources while easing federal restrictions on agriculture and development. |
| Right | 6 | Reduce federal land and water restrictions and expand state or private management and access for productive use. |
| Far Right | 9 | Transfer much federal resource management to states or private owners and sharply curtail federal environmental limits on development. |

### Rights & Education

#### 39. Abortion & reproductive care

- ID: `abortion`
- Issue description: The issue covers access to abortion, public funding, gestational limits, and whether decisions should be made federally or by states.

| Position / ideology | Value | Position description |
|---|---:|---|
| Far Left | -9 | Guarantee broadly accessible publicly funded abortion, leaving clinical decisions primarily to patients and clinicians and opposing criminal penalties for care. |
| Left | -6 | Establish strong nationwide abortion protections with public funding and few state barriers to access, particularly for medical needs. |
| Center Left | -3 | Protect nationwide access before viability and later care for serious medical circumstances while limiting burdensome state restrictions. |
| Center | 0 | Protect early access with later gestational restrictions and clear medical exceptions, seeking a federal compromise on basic protections. |
| Center Right | 3 | Permit tighter gestational limits and broader state discretion while preserving defined exceptions and access in early pregnancy. |
| Right | 6 | Prohibit most abortions with specified exceptions, restrict public funding and support substantial state or federal enforcement. |
| Far Right | 9 | Prohibit abortion from conception with very narrow exceptions and strong enforcement against providers, prioritizing fetal legal protection. |

#### 40. Firearms policy

- ID: `guns`
- Issue description: Firearms policy weighs individual gun rights against licensing, safety requirements, violence prevention, and restrictions on access.

| Position / ideology | Value | Position description |
|---|---:|---|
| Far Left | -9 | Require comprehensive public licensing and sharply restrict private ownership of high-lethality firearms, emphasizing collective safety over unrestricted access. |
| Left | -6 | Adopt strict licensing, assault-weapon restrictions, safe-storage mandates and extensive background checks with public buyback programs. |
| Center Left | -3 | Expand background checks and risk-based removal orders and limit selected high-risk weapons while preserving ordinary lawful ownership. |
| Center | 0 | Protect lawful gun ownership while strengthening background checks, safe storage and targeted enforcement against dangerous misuse. |
| Center Right | 3 | Favor ownership and carry rights with focused checks for prohibited buyers and enforcement against violent offenders. |
| Right | 6 | Expand permitless carry and resist most weapon, magazine and licensing restrictions on lawful owners. |
| Far Right | 9 | Treat firearm ownership and carrying as nearly unrestricted rights and repeal most federal limits beyond punishment for harmful misuse. |

#### 41. LGBTQ+ rights

- ID: `lgbtq`
- Issue description: The debate concerns protections from discrimination, recognition of relationships and gender identity, and access to public services.

| Position / ideology | Value | Position description |
|---|---:|---|
| Far Left | -9 | Require expansive recognition and public support for diverse gender and family forms, with comprehensive nondiscrimination duties and few institutional exemptions. |
| Left | -6 | Expand nationwide equality protections and access to affirming services, sharply limiting exemptions that deny equal treatment. |
| Center Left | -3 | Protect marriage equality and nondiscrimination and support access to appropriate services with professional and procedural safeguards. |
| Center | 0 | Maintain core equal-treatment protections while negotiating defined rules for schools, sports and conflicts with religious institutions. |
| Center Right | 3 | Preserve selected equality protections while expanding religious exemptions and state discretion over gender-related rules. |
| Right | 6 | Restrict gender-identity policies in schools and public programs and favor traditional family definitions with broad religious exemptions. |
| Far Right | 9 | Roll back broad federal gender-identity and relationship-recognition protections and impose restrictive traditional sex and family rules in public institutions. |

#### 42. Policing & public safety

- ID: `criminal`
- Issue description: Public-safety policy balances police authority and accountability with prevention, community investment, and alternatives for nonviolent crises.

| Position / ideology | Value | Position description |
|---|---:|---|
| Far Left | -9 | Replace much conventional policing with community-led safety and social services, sharply limiting armed enforcement and coercive state powers. |
| Left | -6 | Shift substantial police funding to prevention and civilian crisis response and impose strong external accountability and liability. |
| Center Left | -3 | Invest in community safety and accountable policing with civilian crisis teams, transparent oversight and restrictions on abusive tactics. |
| Center | 0 | Combine effective police staffing with oversight, training and targeted prevention based on local needs. |
| Center Right | 3 | Increase police capacity and enforcement while retaining clear misconduct procedures and targeted community programs. |
| Right | 6 | Expand police powers and funding, strengthen enforcement against disorder and limit rules seen as constraining officers. |
| Far Right | 9 | Use intensive enforcement and broad police discretion to restore order, accepting substantial reductions in procedural and oversight constraints. |

#### 43. Sentencing & incarceration

- ID: `sentencing`
- Legacy ID: `criminal`
- Issue description: Sentencing policy determines how punishment, rehabilitation, reentry, mandatory penalties, and detention should be balanced.

| Position / ideology | Value | Position description |
|---|---:|---|
| Far Left | -9 | Dramatically reduce incarceration and replace many custodial penalties with restorative justice, reparative support and community supervision. |
| Left | -6 | End most mandatory minimums, shorten sentences substantially and invest heavily in alternatives, rehabilitation and reentry. |
| Center Left | -3 | Reduce excessive sentences for nonviolent offenses and expand rehabilitation and evidence-based alternatives while preserving serious-crime penalties. |
| Center | 0 | Balance proportional punishment, rehabilitation and public safety through selective sentencing reform and reliable supervision. |
| Center Right | 3 | Preserve firm sentences for serious offenses while supporting limited reentry and carefully screened alternatives. |
| Right | 6 | Increase penalties for repeat and violent offenses and limit early release and judicial departures from mandatory sentences. |
| Far Right | 9 | Impose very severe sentences and extensive mandatory incarceration, prioritizing deterrence and incapacitation over rehabilitation or early release. |

#### 44. Cannabis policy

- ID: `cannabis`
- Legacy ID: `criminal`
- Issue description: Cannabis policy covers legalization, federal enforcement, expungement, licensing, and rules for a commercial market.

| Position / ideology | Value | Position description |
|---|---:|---|
| Far Left | -9 | Fully decriminalize possession and production, expunge past offenses and favor community or cooperative markets over punitive enforcement. |
| Left | -6 | Legalize and regulate adult use nationally, expunge records and reinvest revenues in communities affected by past enforcement. |
| Center Left | -3 | End federal prohibition for adult use and establish health, product-safety and youth-access safeguards. |
| Center | 0 | Allow state legalization with federal banking, research and safety rules, retaining restrictions on youth sales and impaired driving. |
| Center Right | 3 | Permit medical use and state discretion while opposing a broad federal endorsement of commercial adult-use markets. |
| Right | 6 | Maintain federal restrictions on recreational use and limit exceptions to tightly controlled medical access. |
| Far Right | 9 | Restore strict prohibition and stronger enforcement against production, distribution and possession, allowing few medical exceptions. |

#### 45. Religion & public institutions

- ID: `religious_freedom`
- Legacy ID: `lgbtq`
- Issue description: The issue balances religious exercise and institutional autonomy against nondiscrimination rules and the separation of religion from government.

| Position / ideology | Value | Position description |
|---|---:|---|
| Far Left | -9 | Enforce strict secular public institutions and eliminate most religious exemptions from generally applicable civil-rights and service obligations. |
| Left | -6 | Strengthen church-state separation and tightly limit exemptions that restrict equal access to employment, education or public services. |
| Center Left | -3 | Protect private religious exercise while maintaining secular public administration and clear nondiscrimination duties. |
| Center | 0 | Balance religious accommodations with equal treatment and institutional neutrality through narrowly tailored exemptions. |
| Center Right | 3 | Expand protections for religious organizations and individual conscience while retaining basic public-service obligations. |
| Right | 6 | Provide broad religious exemptions and increase space for religious expression and institutions in publicly supported programs. |
| Far Right | 9 | Give traditional religious values a central role in public policy and expand exemptions even when they limit uniform civil-rights requirements. |

#### 46. K–12 education

- ID: `education`
- Legacy ID: `govspend`
- Issue description: K–12 policy addresses school funding, choice, curriculum, local control, and the appropriate federal role in public education.

| Position / ideology | Value | Position description |
|---|---:|---|
| Far Left | -9 | Guarantee extensively funded public education under democratic community control, ending private-school subsidies and reducing competitive market allocation. |
| Left | -6 | Greatly expand federal public-school funding, oppose vouchers and strengthen teacher bargaining and equity requirements. |
| Center Left | -3 | Increase targeted school funding and teacher support while maintaining accountability and a primary commitment to public schools. |
| Center | 0 | Balance adequate public funding, local flexibility and measured accountability, permitting carefully regulated alternatives. |
| Center Right | 3 | Expand charter and parental-choice options while simplifying federal requirements and retaining a public-school safety net. |
| Right | 6 | Expand vouchers and education savings accounts and return most curriculum and accountability authority to states and families. |
| Far Right | 9 | Withdraw most federal education oversight and funding conditions and shift substantial control and resources toward family-directed private education. |

#### 47. College & student debt

- ID: `studentdebt`
- Legacy ID: `govspend`
- Issue description: The debate concerns college affordability, vocational options, student loans, and whether existing borrowers should receive relief.

| Position / ideology | Value | Position description |
|---|---:|---|
| Far Left | -9 | Make public higher education free, cancel broad student debt and replace loan-financed access with universal publicly funded study and training. |
| Left | -6 | Provide tuition-free public college and large-scale debt cancellation, financed through progressive federal revenue. |
| Center Left | -3 | Expand grants and affordable public pathways and provide targeted debt relief and income-based repayment protections. |
| Center | 0 | Target aid and repayment relief to financial need while strengthening institutional accountability and vocational alternatives. |
| Center Right | 3 | Emphasize vocational options, simpler loans and institutional cost discipline, limiting broad taxpayer-funded debt cancellation. |
| Right | 6 | Reduce federal lending and subsidies and oppose broad cancellation, relying more on private finance and employer-sponsored training. |
| Far Right | 9 | End most federal student lending and tuition support, leaving higher-education finance to students, institutions and private agreements. |

#### 48. Civil rights & equal treatment

- ID: `civilrights`
- Legacy ID: `criminal`
- Issue description: Civil-rights policy sets how the federal government should prevent discrimination and remedy unequal treatment in major areas of public life.

| Position / ideology | Value | Position description |
|---|---:|---|
| Far Left | -9 | Use extensive federal redistribution and affirmative remedies to address structural inequality, imposing strong equal-outcome obligations on major institutions. |
| Left | -6 | Expand proactive civil-rights enforcement and affirmative remedies, with strong federal oversight of discriminatory institutions. |
| Center Left | -3 | Strengthen equal-access enforcement and targeted remedies for documented discrimination in housing, employment and public services. |
| Center | 0 | Maintain enforceable nondiscrimination rules and case-specific remedies while balancing due process and local implementation. |
| Center Right | 3 | Emphasize individual equal treatment and narrow remedies, limiting group-based preferences and expansive federal mandates. |
| Right | 6 | Restrict affirmative preferences and disparate-impact rules and return much enforcement discretion to states or private litigation. |
| Far Right | 9 | Sharply narrow federal civil-rights intervention beyond explicit legal discrimination and reject most group-conscious remedies and institutional mandates. |

### Government & Technology

#### 49. Federal spending & debt

- ID: `govspend`
- Issue description: Budget policy weighs public services and investment against taxes, borrowing, deficits, and pressure to restrain federal spending.

| Position / ideology | Value | Position description |
|---|---:|---|
| Far Left | -9 | Greatly expand universal public services and investment, using progressive taxation and public credit while subordinating deficit targets to social goals. |
| Left | -6 | Expand social and infrastructure spending with higher progressive revenue, accepting deficits when needed for employment and investment. |
| Center Left | -3 | Protect and selectively expand public services while combining progressive revenue and efficiency measures for sustainable finances. |
| Center | 0 | Balance core services and investment with gradual deficit reduction using both revenue and spending adjustments. |
| Center Right | 3 | Restrain program growth and reduce deficits primarily through spending discipline while protecting a limited safety net. |
| Right | 6 | Cut federal programs substantially and impose firm spending limits, prioritizing lower taxes and smaller government. |
| Far Right | 9 | Dismantle many federal domestic programs and require strict limits on borrowing and spending, transferring responsibilities to private or local institutions. |

#### 50. Voting & election administration

- ID: `electionreform`
- Issue description: Election policy covers who can register, how people vote, how eligibility is verified, and how elections are administered.

| Position / ideology | Value | Position description |
|---|---:|---|
| Far Left | -9 | Guarantee universal automatic access with expansive early and mail voting, restore voting rights broadly and minimize administrative barriers. |
| Left | -6 | Expand automatic and same-day registration, federal access standards and broad rights restoration with strong protection against suppression. |
| Center Left | -3 | Protect early and mail voting and simplify registration while funding secure administration and transparent audits. |
| Center | 0 | Balance accessible voting with consistent verification, professional administration and transparent post-election checks. |
| Center Right | 3 | Require stronger identification and verification while retaining practical access options and locally managed administration. |
| Right | 6 | Restrict mail and late registration options, strengthen identification rules and emphasize tighter eligibility checks. |
| Far Right | 9 | Impose very strict eligibility verification and narrow voting procedures, prioritizing restrictive access controls over expanded convenience. |

#### 51. Money in politics

- ID: `campaignfinance`
- Legacy ID: `electionreform`
- Issue description: The issue asks how to limit corruption and hidden influence while protecting political speech and campaign competition.

| Position / ideology | Value | Position description |
|---|---:|---|
| Far Left | -9 | Replace private campaign finance with comprehensive public funding and strictly limit corporate and wealthy-donor influence over political spending. |
| Left | -6 | Expand public financing and impose strong limits on large donations and independent expenditures through statutory or constitutional change. |
| Center Left | -3 | Require donor transparency and stronger anti-coordination rules and offer small-donor matching or public-financing options. |
| Center | 0 | Improve disclosure and enforcement while preserving mixed public-private funding and constitutional protections for political speech. |
| Center Right | 3 | Favor prompt disclosure and anti-corruption rules while allowing relatively broad private donations and independent advocacy. |
| Right | 6 | Relax contribution and expenditure restrictions and treat most privately financed political advocacy as protected expression. |
| Far Right | 9 | Remove most campaign-finance limits and much compulsory donor disclosure, prioritizing private political association and unrestricted spending. |

#### 52. Executive power & oversight

- ID: `executive`
- Legacy ID: `govspend`
- Issue description: The balance is between an effective presidency and checks from Congress, courts, inspectors general, agencies, and emergency-law limits.

| Position / ideology | Value | Position description |
|---|---:|---|
| Far Left | -9 | Disperse executive authority through strong legislative and participatory controls, sharply limiting emergency powers and coercive federal institutions. |
| Left | -6 | Reduce unilateral presidential powers and strengthen legislative, inspector-general and judicial checks on executive action. |
| Center Left | -3 | Enforce strong ethics, independent oversight and clear limits on emergencies while preserving ordinary administrative capacity. |
| Center | 0 | Maintain a workable separation of powers with transparent emergency rules, professional administration and regular oversight. |
| Center Right | 3 | Give elected executives more control over agencies while retaining statutory limits, courts and legislative accountability. |
| Right | 6 | Expand presidential direction of agencies and emergency action, reducing independent administrative constraints. |
| Far Right | 9 | Concentrate extensive authority in the presidency and sharply weaken independent institutional checks in pursuit of decisive executive control. |

#### 53. Supreme Court & judiciary

- ID: `scotus`
- Issue description: Judiciary policy concerns court structure, ethics, appointments, tenure, and the approaches judges use to interpret the Constitution.

| Position / ideology | Value | Position description |
|---|---:|---|
| Far Left | -9 | Fundamentally restructure the judiciary to reduce lifetime elite control, including major membership changes and stronger democratic checks on constitutional decisions. |
| Left | -6 | Adopt term limits, strong ethics enforcement and structural changes where necessary to rebalance judicial power. |
| Center Left | -3 | Support enforceable ethics and prospective tenure reforms while appointing judges who protect broad civil and social rights. |
| Center | 0 | Protect judicial independence with clear ethics rules and cautious institutional reform rather than partisan structural escalation. |
| Center Right | 3 | Favor restrained interpretation and judicial independence, opposing expansion while considering limited ethics or appointment-process reforms. |
| Right | 6 | Appoint strongly originalist judges and resist structural reforms that reduce existing judicial tenure or constitutional authority. |
| Far Right | 9 | Use appointments and jurisdictional changes aggressively to entrench a deeply conservative constitutional order and constrain opposing policy agendas. |

#### 54. Privacy & surveillance

- ID: `privacy`
- Legacy ID: `criminal`
- Issue description: Privacy policy balances security investigations with limits on government and commercial collection, retention, and use of personal data.

| Position / ideology | Value | Position description |
|---|---:|---|
| Far Left | -9 | Abolish broad surveillance systems and impose strict warrants and public control over data collection to prevent state or corporate monitoring. |
| Left | -6 | End bulk collection and strengthen warrants, data minimization and legal remedies against both government and commercial surveillance. |
| Center Left | -3 | Create strong privacy rights and independent oversight while permitting targeted surveillance under meaningful judicial authorization. |
| Center | 0 | Balance privacy rights and targeted security investigations with transparent safeguards and limited retention of sensitive data. |
| Center Right | 3 | Retain broader investigative powers with oversight and favor flexible commercial data rules rather than sweeping mandates. |
| Right | 6 | Restrict federal monitoring of lawful citizens and emphasize individual privacy while allowing targeted investigations of specific threats. |
| Far Right | 9 | Dismantle most federal domestic-surveillance powers and reject centralized data registries on grounds of individual sovereignty and distrust of government. |

#### 55. AI & emerging technology

- ID: `airegulation`
- Legacy ID: `economy`
- Issue description: AI policy weighs innovation and competition against safety, accountability, privacy, labor disruption, and oversight of high-risk systems.

| Position / ideology | Value | Position description |
|---|---:|---|
| Far Left | -9 | Place powerful AI infrastructure under public or worker control and require democratic approval before deployments that displace labor or expand surveillance. |
| Left | -6 | Impose strong licensing, worker protections and public-interest obligations on major AI developers and high-risk deployments. |
| Center Left | -3 | Require risk testing, accountability for automated discrimination and targeted labor-transition support while permitting beneficial innovation. |
| Center | 0 | Use risk-based standards, transparency and liability for demonstrated harms with room for research and small-company innovation. |
| Center Right | 3 | Favor industry standards and targeted rules for concrete harms, avoiding broad licensing that could limit competition. |
| Right | 6 | Minimize new AI regulation and accelerate domestic development, using existing laws to address specific unlawful conduct. |
| Far Right | 9 | Reject most federal controls on AI development or deployment, allowing rapid private experimentation and market-driven responses to disruption. |

## 2. Voter, demographic, and constituency groups

These are the 34 entries in `INTEREST_GROUPS`. Priorities use the issue IDs or legacy aliases used by the simulator. Baseline is the group's modeled partisan lean, where negative is Democratic-leaning and positive is Republican-leaning.

### Racial/Ethnic

| ID | Group | Baseline lean | Top priorities | Player-facing description |
|---|---|---:|---|---|
| `white` | White Voters | +2 | economy, taxation, immigration | White voters include people with European, Middle Eastern, and North African roots, as well as many multigenerational American families. This is the country’s largest and most internally diverse racial category, spanning rural, suburban, and urban communities with large differences in religion, education, class, region, and partisan identity. Campaigns often compete over the economy, immigration, public safety, cultural issues, and the perceived direction of the country. |
| `black` | African American | -7 | criminal, healthcare, economy | Black voters include descendants of U.S. slavery, newer African and Caribbean immigrants, and communities shaped by distinct regional and religious traditions. Black political life has been strongly influenced by the civil-rights movement, voting-rights enforcement, economic inequality, criminal-justice policy, and the continuing importance of churches and civic organizations. The group is not politically uniform, but candidates are commonly judged on economic opportunity, health care, voting access, public safety, and protection from discrimination. |
| `hispanic` | Hispanic/Latino | -3 | immigration, economy, healthcare | Hispanic and Latino voters include people with roots across Mexico, Puerto Rico, Cuba, Central America, South America, Spain, and many other Spanish-speaking communities; Hispanic origin can occur alongside any race. The electorate is young, geographically dispersed, and politically varied, with family history, immigration experience, religion, class, generation, and local economic conditions shaping priorities. Campaigns commonly compete over wages and prices, immigration, health care, education, public safety, and foreign policy toward Latin America. |
| `asian` | Asian American | -2 | economy, healthcare, immigration | Asian American voters include communities with roots in East Asia, Southeast Asia, and South Asia, each with different migration histories, languages, religions, and economic profiles. Some communities are long-established while others include newer immigrants, refugees, and second-generation families; educational attainment and household income also vary substantially. Candidates may encounter concerns about small-business conditions, education, housing costs, immigration and visas, hate crimes, health care, and U.S. policy in the Indo-Pacific. |
| `native` | Native American | -4 | healthcare, environment, economy | Native American voters include citizens of federally and state-recognized tribes, Alaska Native communities, and other Native people with ties to sovereign tribal nations and Indigenous communities. Tribal sovereignty, treaty responsibilities, land and water rights, health-care access, infrastructure, and underinvestment in rural and reservation communities are central political contexts. Native voters live in many different regions and also bring varied partisan, religious, and economic perspectives. |

### Religious

| ID | Group | Baseline lean | Top priorities | Player-facing description |
|---|---|---:|---|---|
| `evangelical` | Evangelical | +6 | abortion, lgbtq, religious_freedom | Evangelical voters are a cross-denominational religious constituency organized around the authority of the Bible, personal conversion, active faith communities, and public moral concerns. The group includes white, Black, Latino, Asian, and other congregations whose racial and regional experiences can produce different political priorities. Campaigns often encounter strong interest in abortion, religious liberty, family policy, education, immigration, Israel, and the role of religion in public life. |
| `catholic` | Catholic | +1 | abortion, immigration, healthcare | Catholic voters include parish communities with wide differences in race, ethnicity, immigration history, income, and theology. Catholic social teaching combines protection of human life and family with concern for poverty, workers, immigrants, health care, and the common good, while individual voters weigh these principles differently. The group can be competitive in elections because it contains both socially conservative and economically progressive traditions. |
| `jewish` | Jewish | -3 | israel, criminal, healthcare | Jewish voters include Orthodox, Conservative, Reform, secular, and other communities with varied religious practice and political outlooks. American Jewish political life is shaped by concerns about antisemitism, civil rights, democratic institutions, religious freedom, and the security of Israel, but views on foreign policy and domestic issues are far from unanimous. Education, urban and suburban life, and family migration histories also contribute to internal diversity. |
| `muslim` | Muslim | -5 | foreign, immigration, civil_rights | Muslim voters include Arab, Black, South Asian, African, Southeast Asian, convert, and other communities with different languages, immigration histories, and levels of religious observance. They often connect domestic questions about civil rights, discrimination, education, health care, and economic opportunity with U.S. policy in the Middle East and other Muslim-majority regions. The community contains a range of ideological and partisan views, and local leadership and foreign-policy events can be especially influential. |
| `secular` | Secular/None | -4 | climate, healthcare, lgbtq | Secular or religiously unaffiliated voters include atheists, agnostics, humanists, people who rarely attend services, and people who simply do not identify with a formal tradition. They are not a single philosophy, but many place emphasis on church–state separation, scientific institutions, personal autonomy, climate policy, health care, and equal treatment regardless of belief. Age, education, family background, and partisan identity produce substantial variation within the group. |

### Occupational

| ID | Group | Baseline lean | Top priorities | Player-facing description |
|---|---|---:|---|---|
| `bluecollar` | Blue Collar Workers | +1 | economy, trade, labor | Blue-collar workers include people in production, construction, transportation, maintenance, extraction, logistics, and other hands-on or industrial jobs. Their circumstances differ by union coverage, industry, region, job security, exposure to automation, and whether work is tied to manufacturing, energy, building, or services. Campaigns often compete over wages, trade, domestic production, workplace safety, taxes, energy prices, and whether government policy respects working people. |
| `whitecollar` | White Collar Professionals | -1 | economy, taxation, healthcare | White-collar professionals include managers, administrators, analysts, educators, engineers, health professionals, lawyers, and other workers whose jobs are primarily office-based or specialized. They range from highly paid executives to public-sector and service professionals facing student debt, housing costs, and insecure employment. Their political priorities often combine economic stability, education, health care, taxes, institutional competence, and professional regulation. |
| `smallbusiness` | Small Business Owners | +3 | taxation, economy, govspend | Small-business owners run local shops, farms, contractors, restaurants, professional practices, and other firms that depend on customers, employees, credit, and predictable rules. They may be employers and workers at the same time, making labor costs, taxes, health coverage, permitting, inflation, and access to capital immediate concerns. Their political views vary by industry and size, but campaigns often appeal to independence, local control, and protection from burdensome regulation. |
| `union` | Union Workers | -4 | labor, economy, healthcare | Union workers are employees represented by organized labor through collective bargaining in both private and public workplaces. Their political experience is shaped by wages, benefits, job security, workplace safety, pensions, strikes, right-to-work laws, and the strength of local labor institutions. Union households are racially and regionally diverse, and members may prioritize economic issues while holding a range of views on social and cultural questions. |
| `tech` | Tech Workers | -2 | economy, immigration, climate | Tech workers include software and data specialists, engineers, product and design staff, researchers, information-security professionals, and other employees in technology-intensive industries. The sector is concentrated in several metropolitan regions but supports jobs nationwide, including in smaller firms and public institutions. Voters in this group may weigh immigration and skilled visas, innovation, privacy, artificial intelligence, labor disruption, antitrust enforcement, climate policy, and the high cost of living in tech hubs. |
| `farmers` | Farmers | +4 | trade, economy, govspend | Farmers and agricultural workers operate or work on farms, ranches, orchards, dairies, and other production systems that depend on land, water, labor, weather, credit, and transportation. Family farms, large commercial operations, specialty growers, and livestock producers face different market pressures, while rural communities often depend on agriculture beyond the farm gate. Campaign issues include trade and export markets, farm programs, input costs, immigration and seasonal labor, conservation, rural infrastructure, and land and water policy. |
| `military` | Military/Veterans | +3 | military, foreign, economy | Military and veteran voters include active-duty personnel, reservists, National Guard members, retirees, and veterans from different service eras and branches, along with families whose lives are shaped by military service. Their priorities can include readiness, defense spending, veterans’ health care, disability benefits, housing, military family support, and the use of force abroad. The group is patriotic but politically diverse, and service experience does not dictate one view on every foreign or domestic issue. |

### Demographic

| ID | Group | Baseline lean | Top priorities | Player-facing description |
|---|---|---:|---|---|
| `college` | College Educated | -2 | economy, climate, healthcare | College-educated voters include adults with a bachelor’s degree or advanced credential, from recent graduates to older professionals and retirees. Education intersects with occupation, income, geography, race, and age, so the group contains both highly progressive urban professionals and conservative suburban or rural constituencies. Campaigns often compete for this bloc through messages about economic opportunity, schools, climate, health care, democratic institutions, and competence in government. |
| `noncollege` | Non-College | +2 | economy, jobs, immigration | Non-college voters include adults without a four-year degree, including people with vocational training, community-college experience, certificates, apprenticeships, military training, or no postsecondary credential. This broad group includes workers and retirees across every region and income level, not only manual laborers. Campaigns commonly address wages, prices, health care, immigration, public safety, education and training, manufacturing, and respect for communities outside professional and university networks. |
| `suburban` | Suburban Voters | 0 | economy, healthcare, education | Suburban voters live in communities between dense urban centers and rural areas, from inner-ring neighborhoods to exurban subdivisions. Suburbs vary widely in race, density, housing cost, transit access, employment, school systems, and political culture, so they are often an important but heterogeneous battleground. Their concerns may include schools, property taxes, housing supply, commuting, public safety, reproductive rights, health care, and the tone and stability of national politics. |
| `urban` | Urban | -5 | climate, healthcare, criminal | Urban voters live in dense cities and metropolitan neighborhoods where housing, transit, public services, and diverse populations are concentrated. Urban communities include affluent professionals, working-class neighborhoods, immigrants, students, and long-standing communities facing displacement or disinvestment. Campaigns often compete over housing affordability, public safety, transit, jobs, climate resilience, health care, education, and the balance between local authority and federal investment. |
| `rural` | Rural | +5 | economy, guns, trade | Rural voters live in small towns, open-country areas, farming regions, resource communities, and remote places that can be far from major services and media centers. Rural America is not economically uniform: agriculture, manufacturing, energy, tourism, commuting, tribal communities, and retirees all shape different local realities. Common campaign concerns include health-care access, broadband, roads, schools, jobs, land and water, public safety, gun rights, and skepticism toward distant institutions. |
| `genz` | Gen Z | -4 | climate, economy, healthcare | Generation Z is the cohort coming of age in an era of smartphones, social media, climate anxiety, political polarization, school disruption, and high housing and education costs. Its members are racially diverse and include students, workers, young parents, military personnel, and people outside college settings. Their participation is shaped by digital communication, peer networks, distrust of institutions, and whether campaigns offer credible plans for economic security and personal rights. |

### Age

| ID | Group | Baseline lean | Top priorities | Player-facing description |
|---|---|---:|---|---|
| `youth` | Youth (18-24) | -5 | climate, abortion, economy | Young voters ages 18–24 are entering the electorate while navigating school, first jobs, military service, family formation, and high housing and education costs. They are more likely than older voters to be renters, students, or financially dependent, and their political participation can be strongly affected by registration rules, campus networks, peer influence, and whether campaigns speak to their future. Climate, abortion, education debt, wages, housing, civil rights, and the risk of conflict can all be salient. |
| `age25_44` | Adults (25-44) | -2 | economy, healthcare, taxation | Voters ages 25–44 are often balancing careers, caregiving, marriage or partnership, young children, and the cost of housing and child care. They include a wide range of education, income, race, religion, and employment experiences, from new professionals to long-time workers and small-business owners. Campaigns commonly compete over wages, family policy, health insurance, housing, taxes, education, immigration, and the economic prospects of the next decade. |
| `age45_64` | Middle Age (45-64) | +2 | taxation, economy, immigration | Voters ages 45–64 often occupy a middle stage of life marked by peak work and caregiving responsibilities, retirement planning, health concerns, and support for both children and older relatives. Some are approaching retirement while others face layoffs, retraining, or the need to keep working longer. Their priorities may include taxes, Social Security and Medicare, health costs, public safety, economic stability, immigration, and the condition of local communities. |
| `seniors` | Seniors (65+) | +4 | healthcare, taxation, criminal | Senior voters are adults 65 and older, including long-retired people, older workers, caregivers, and residents of every region and income level. Health care, prescription costs, Social Security, Medicare, housing, long-term care, and public safety often carry particular weight, but seniors also respond to taxes, foreign policy, cultural issues, and the welfare of younger generations. Older voters tend to participate at high rates, making them a closely watched constituency. |

### Political

| ID | Group | Baseline lean | Top priorities | Player-facing description |
|---|---|---:|---|---|
| `progressives` | Progressives | -8 | climate, healthcare, inequality | Progressives are an ideological coalition that seeks large-scale changes to reduce inequality, expand public provision, strengthen labor, protect civil rights, and accelerate climate action. The coalition includes activists, younger voters, organized labor allies, and policy-focused voters who may disagree on tactics but generally distrust incrementalism. They can be highly motivated by movement issues and highly sensitive to compromises they see as abandoning marginalized communities. |
| `libertarians` | Libertarians | +5 | freedom, taxation, govspend | Libertarians prioritize individual liberty, limited government, private choice, free expression, and skepticism toward concentrated state power. The coalition can include fiscal conservatives, civil-liberties advocates, antiwar voters, entrepreneurs, and people who are socially permissive but economically market-oriented. They may support lower taxes and spending while opposing surveillance, censorship, unnecessary regulation, and restrictions on personal conduct. |
| `maga` | MAGA | +9 | immigration, trade, nationalism | MAGA is a populist-nationalist movement built around the belief that established political, media, corporate, and bureaucratic institutions have failed ordinary Americans. Its supporters commonly emphasize border enforcement, national sovereignty, cultural traditionalism, trade protection, law and order, and loyalty to a confrontational style of leadership. The movement includes rural, exurban, working-class, evangelical, and online constituencies with different economic interests but a shared distrust of the political establishment. |
| `centrists` | Centrists | 0 | economy, bipartisanship, pragmatism | Centrists are voters who prefer practical, incremental, or cross-party solutions and are often uncomfortable with ideological extremes. They can include moderate Democrats, moderate Republicans, independents, and voters who make different choices issue by issue rather than identifying strongly with a party. Candidates compete for them through messages about competence, affordability, stability, public safety, fiscal responsibility, and reducing political conflict. |

### Gender/Orientation

| ID | Group | Baseline lean | Top priorities | Player-facing description |
|---|---|---:|---|---|
| `lgbtq_community` | LGBTQ+ Community | -6 | lgbtq, healthcare, civil_rights | LGBTQ+ voters include lesbian, gay, bisexual, transgender, queer, and other sexual- and gender-minority people across every race, religion, age, class, and region. Their political context includes civil-rights protections, employment and housing discrimination, health care, family recognition, youth policy, public safety, and debates over gender identity. The community is diverse, but candidates’ language and record on equal treatment can strongly affect trust and turnout. |
| `women` | Women Voters | -2 | healthcare, abortion, economy | Women voters are a cross-cutting constituency spanning every race, age, religion, occupation, and partisan identity. They often experience public policy through health care, pregnancy and abortion access, caregiving, wages, education, housing, safety, and family finances, while also responding to national security and cultural issues. The group is not politically uniform, but candidates’ positions on reproductive autonomy and the practical costs of family life can be especially consequential. |
| `suburban_women` | Suburban Women | -3 | healthcare, abortion, economy | Suburban women combine the concerns of suburban households with the policy experiences of women as workers, caregivers, parents, homeowners, renters, and patients. This is a politically mixed constituency: some prioritize abortion rights and public schools, others emphasize taxes, crime, immigration, or religious values, and many are sensitive to candidates’ temperament. Campaigns often compete here through messages about family finances, safety, education, health care, housing, and governing stability. |

### Group support anchors and modeling notes

| ID | Elasticity | Third-party path | Age skew | 2024 support anchor (D / R / I / G / L / PSL) |
|---|---:|---|---|---|
| `white` | 0.8 | I | — | D 43% / R 55% / I 2% / G 0% / L 0% / PSL 0% |
| `black` | 0.2 | I | — | D 83% / R 15% / I 2% / G 0% / L 0% / PSL 0% |
| `hispanic` | 0.8 | I | — | D 51% / R 48% / I 1% / G 0% / L 0% / PSL 0% |
| `asian` | 0.8 | I | — | D 57% / R 40% / I 3% / G 0% / L 0% / PSL 0% |
| `native` | 0.8 | I | — | D 57% / R 39% / I 4% / G 0% / L 0% / PSL 0% |
| `evangelical` | 0.2 | L | old | D 17% / R 81% / I 2% / G 0% / L 0% / PSL 0% |
| `catholic` | 0.8 | I | — | D 43% / R 55% / I 2% / G 0% / L 0% / PSL 0% |
| `jewish` | 0.8 | I | — | D 68% / R 29% / I 3% / G 0% / L 0% / PSL 0% |
| `muslim` | 0.2 | G | — | D 58% / R 32% / I 10% / G 0% / L 0% / PSL 0% |
| `secular` | 0.8 | G | — | D 70% / R 28% / I 2% / G 0% / L 0% / PSL 0% |
| `bluecollar` | 0.8 | I | — | D 39% / R 58% / I 3% / G 0% / L 0% / PSL 0% |
| `whitecollar` | 0.8 | I | — | D 52% / R 45% / I 3% / G 0% / L 0% / PSL 0% |
| `smallbusiness` | 0.8 | I | — | D 37% / R 60% / I 3% / G 0% / L 0% / PSL 0% |
| `union` | 0.2 | I | — | D 51% / R 48% / I 1% / G 0% / L 0% / PSL 0% |
| `tech` | 0.8 | I | — | D 62% / R 35% / I 3% / G 0% / L 0% / PSL 0% |
| `farmers` | 0.8 | I | — | D 24% / R 73% / I 3% / G 0% / L 0% / PSL 0% |
| `military` | 0.8 | I | — | D 36% / R 61% / I 3% / G 0% / L 0% / PSL 0% |
| `college` | 0.8 | I | young | D 58% / R 42% / I 0% / G 0% / L 0% / PSL 0% |
| `noncollege` | 0.8 | I | — | D 43% / R 57% / I 0% / G 0% / L 0% / PSL 0% |
| `suburban` | 0.8 | I | — | D 52% / R 48% / I 0% / G 0% / L 0% / PSL 0% |
| `urban` | 0.8 | I | young | D 65% / R 33% / I 2% / G 0% / L 0% / PSL 0% |
| `rural` | 0.8 | I | old | D 29% / R 69% / I 2% / G 0% / L 0% / PSL 0% |
| `youth` | 0.2 | G | — | D 60% / R 35% / I 3% / G 2% / L 0% / PSL 0% |
| `age25_44` | 0.8 | I | — | D 52% / R 44% / I 2% / G 1% / L 1% / PSL 0% |
| `age45_64` | 0.8 | I | — | D 45% / R 52% / I 2% / G 0% / L 1% / PSL 0% |
| `seniors` | 0.8 | I | — | D 44% / R 54% / I 2% / G 0% / L 0% / PSL 0% |
| `progressives` | 0.2 | G | — | D 86% / R 4% / I 10% / G 0% / L 0% / PSL 0% |
| `libertarians` | 0.8 | I | — | D 8% / R 70% / I 22% / G 0% / L 0% / PSL 0% |
| `maga` | 0.2 | I | — | D 0% / R 99% / I 1% / G 0% / L 0% / PSL 0% |
| `centrists` | 0.8 | I | — | D 49% / R 48% / I 2% / G 0% / L 0% / PSL 1% |
| `lgbtq_community` | 0.2 | I | — | D 78% / R 18% / I 4% / G 0% / L 0% / PSL 0% |
| `women` | 0.8 | I | — | D 53% / R 44% / I 3% / G 0% / L 0% / PSL 0% |
| `genz` | 0.8 | I | young | D 60% / R 34% / I 3% / G 3% / L 0% / PSL 0% |
| `suburban_women` | 0.8 | I | — | D 59% / R 38% / I 2% / G 0% / L 0% / PSL 1% |

## 3. Factions

Faction party codes: D = Democratic, R = Republican, I = Independent/unaligned, G = Green, PSL = Party for Socialism and Liberation, and L = Libertarian.

| ID | Faction | Party | Core groups | Base turnout bonus | Description |
|---|---|---|---|---:|---|
| `outsider_leftist` | Outsider Leftist | G | progressives, youth, secular | 10% | Eco-socialist, anti-capitalist, and fiercely independent. This wing of the left focuses heavily on bold environmental action and structural dismantling of corporate power, standing firmly outside the traditional establishment. |
| `activist_left` | The Activist Left | D | progressives, youth, lgbtq_community | 15% | A highly ideological, aggressive, and vocal base. They demand uncompromising, bold action on climate change, systemic inequalities, and social justice issues, pushing the boundaries of the mainstream platform. |
| `mainstream_liberal` | Mainstream Liberal | D | progressives, urban, union | 10% | The sturdy backbone of the traditional Democratic establishment. They focus on structural economic reform, protecting institutional safety nets like healthcare, and empowering labor unions through steady progress. |
| `pragmatic_moderate` | Pragmatic Moderate | D | black, women, college, whitecollar | 5% | The institutionalist and pragmatic wing that prioritizes stability, broad electability, and bipartisan appeal. They act as a steadying force against radical changes and focus on winning the crucial middle. |
| `unaligned_center` | Unaligned Center | I | suburban, suburban_women, centrists | 5% | The ultimate swing constituency that floats between the two major parties. They are highly sensitive to extreme rhetoric and deeply value pragmatic, sensible governance over ideological crusades. |
| `compassionate_conservative` | ‘Compassionate’ Conservative | R | whitecollar, smallbusiness, seniors | 5% | The traditional conservative wing focused on free-market principles, tax cuts, deregulation, and steady leadership. They prioritize institutional stability and strong national defense while projecting a softer, more inclusive edge. |
| `religious_right` | The Religious Right | R | evangelical, rural, maga | 10% | A deeply ideological conservative base grounded in traditional moral values and faith. They focus intensely on cultural and social issues, fighting vigorously to defend traditional family structures and institutions. |
| `populist_right` | The Populist Right | R | maga, bluecollar, noncollege, rural | 12% | An economic nationalist base that strongly appeals to the working class and rural communities. They prioritize bringing manufacturing back to the homeland and fiercely oppose the political establishment. |
| `america_first_conservative` | America First Conservative | R | maga, rural, evangelical | 15% | An aggressive, highly motivated nationalist and populist movement. They act as a fierce disruptive force against institutional norms, prioritizing American sovereignty and uncompromising homeland defense. |

## 4. Other modeled organized interests

These are PACs in `PACS`, distinct from voter/constituency groups.

| ID | Organization | Category | Priority issue | Desired position | Contribution | Description |
|---|---|---|---|---:|---:|---|
| `bigoil` | Big Oil & Gas | Industry | `energy` | 7 | $25M | Represents oil, natural-gas, and related energy companies whose business depends on continued production, infrastructure investment, and access to domestic and international markets. It generally favors permitting, pipeline and export approvals, predictable tax rules, and a slower or more market-led transition away from fossil fuels, while arguing that energy security and affordable fuel require continued conventional production. |
| `unions` | AFL-CIO (Labor Unions) | Labor | `labor` | -6 | $20M | Represents a federation of unions across construction, manufacturing, transportation, public services, health care, education, and other industries. It advocates collective bargaining, higher wages, workplace safety, pensions, paid leave, and labor standards, and typically supports policies that make organizing easier and attach strong job and wage requirements to public investment. |
| `nra` | NRA (Gun Rights) | Grassroots | `guns` | 8 | $18M | Represents gun owners, firearms instructors, sport shooters, hunters, and Second Amendment advocates. It generally opposes bans and broad licensing or registration requirements, emphasizes self-defense and constitutional protections, and supports enforcement against violent offenders while arguing that lawful ownership should not be burdened by restrictions aimed at criminal misuse. |
| `plannedparenthood` | Planned Parenthood | Grassroots | `abortion` | -7 | $15M | Represents a reproductive-health provider and advocacy network focused on contraception, abortion access, pregnancy care, cancer screening, and sex education. Its political agenda generally supports legal abortion access, public funding for reproductive care, protection for providers and patients, and opposition to policies that allow states or government officials to override a patient’s medical decision. |
| `techindustry` | Tech Industry PAC | Industry | `immigration` | -4 | $30M | Represents technology companies and the wider innovation economy, including employers that recruit engineers, researchers, and other specialized workers globally. It generally favors skilled-immigration pathways, research investment, digital infrastructure, competition, and rules that allow firms to scale, while also seeking predictable regulation of artificial intelligence, privacy, and online markets. |
| `wallstreet` | Wall Street PAC | Wall Street | `taxation` | 6 | $35M | Represents banks, investment firms, asset managers, and other financial institutions whose business depends on capital formation and functioning securities markets. It generally favors lower and more predictable taxes on investment, stable financial regulation, and policies that encourage growth, while opponents argue that the sector has outsized influence and should contribute more to public revenue. |
| `environmental` | Environmental Defense Fund | Grassroots | `climate` | -8 | $12M | Represents environmental advocates, scientists, conservation partners, and communities seeking faster reductions in greenhouse-gas emissions. It generally supports clean-energy deployment, pollution controls, climate investment, conservation, and stronger accountability for major emitters, while emphasizing public health, climate resilience, and a transition that protects workers and vulnerable communities. |

## 5. Coalition breakpoints

These are modeled loyalty/turnout thresholds, not additional demographic groups.

| ID | Coalition | Parties | Requirements | Warning / collapse | Leak destinations |
|---|---|---|---|---|---|
| `progressives` | Progressives | D, G, PSL | climate ≤ -6 (65%+ climate investment); healthcare ≤ -4 (Public option or better) | 2 / 4 weeks | G 60%, PSL 40% |
| `union` | Union Workers | D | labor ≤ -3 (Union-first labor policy) | 2 / 4 weeks | _opponent 50%, _undecided 50% |
| `evangelical` | Evangelicals | R | abortion ≥ 4 (Abortion restrictions); lgbtq ≥ 2 (Religious carve-outs) | 2 / 3 weeks | _undecided 70%, L 30% |
| `smallbusiness` | Small Business | R | taxation ≥ 4 (Pro-growth tax cuts) | 2 / 4 weeks | L 60%, _undecided 40% |
| `muslim` | Muslim Voters | D, G, PSL | israel ≤ -3 (Ceasefire-forward stance) | 2 / 3 weeks | G 50%, _undecided 50% |
| `genz_bloc` | Gen Z Bloc | D, G, PSL | climate ≤ -4 (Aggressive climate action); economy ≤ -3 (Student debt relief) | 2 / 3 weeks | G 40%, _undecided 40%, PSL 20% |
| `maga_core` | MAGA Core | R | immigration ≥ 5 (Hardline immigration stance); trade ≥ 3 (America First trade policy) | 2 / 3 weeks | _undecided 80%, _opponent 20% |
| `moderate_republicans` | Moderate Republicans | R | abortion ≤ 0 (Moderate abortion stance); lgbtq ≤ 0 (Tolerant LGBTQ+ stance) | 2 / 4 weeks | _undecided 60%, D 40% |

## Source files

- [Issue catalog](js/issueCatalog.js)
- [Voter and demographic groups, PACs, and coalition rules](js/interestGroups.js)
- [Factions](js/factions.js)

