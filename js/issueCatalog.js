/* Policy positions are scenario definitions, not claims about current law or
   verified positions of real candidates. Numeric values are compatibility data
   for legacy PAC/coalition thresholds; the public model uses seven named IDs. */
var IssueModel = {
    positions: ['Far Left','Left','Center Left','Center','Center Right','Right','Far Right'].map(function(label,index) {
        return { id:label.toLowerCase().replace(/ /g,'_'), label:label, value:[-9,-6,-3,0,3,6,9][index], index:index };
    }),
    aliases: {jobs:'economy',environment:'climate',inequality:'taxation',freedom:'privacy',civil_rights:'civilrights',bipartisanship:'executive',pragmatism:'govspend',nationalism:'foreign',border:'immigration'},
    canonical: function(id) { return this.aliases[id] || id; },
    getIssue: function(id) { return this.registry?this.registry[this.canonical(id)]:CORE_ISSUES.find(function(i){return i.id===IssueModel.canonical(id);}); },
    candidate: function(candidate) {
        var id=candidate&&typeof candidate==='object'?candidate.id:candidate;
        if(typeof Utils!=='undefined'&&typeof gameData!=='undefined'&&gameData.candidate){var active=Utils.getActiveCandidates().find(function(c){return c.cand.id===id;});if(active)return active.cand;}
        if (candidate && typeof candidate==='object') return candidate;
        if (typeof _buildCandidateByIdMap==='function') return _buildCandidateByIdMap()[id] || null;
        return null;
    },
    index: function(value) {
        if (typeof value==='string') { var p=this.positions.find(function(x){return x.id===value;}); if(p) return p.index; }
        if (!Number.isFinite(Number(value))) return 3;
        var n=Number(value), best=0;
        this.positions.forEach(function(p,i){if(Math.abs(p.value-n)<Math.abs(IssueModel.positions[best].value-n))best=i;});
        return best;
    },
    getPosition: function(candidate,issueId) {
        var c=this.candidate(candidate), issue=this.getIssue(issueId);
        if(!issue) return null;
        var values=c && c.issuePositions || {}, value=values[issue.id];
        if(value===undefined) value=values[issue.legacyId];
        if(value===undefined && c && typeof CANDIDATE_POSITIONS!=='undefined') value=(CANDIDATE_POSITIONS[c.id]||{})[issue.legacyId];
        // Missing scenario positions are distinguished in metadata even when a
        // centrist placeholder is needed by old consumers.
        return Object.assign({},issue.positions[this.index(value)],{modeled:true,unknown:value===undefined});
    },
    initialize: function(candidate) {
        if(!candidate) return;
        var initial=Object.assign({},(typeof CANDIDATE_POSITIONS!=='undefined' && CANDIDATE_POSITIONS[candidate.id])||{},candidate.issuePositions||{});
        candidate.issuePositions={}; candidate.stances={}; candidate.positionProvenance={};
        CORE_ISSUES.forEach(function(issue){
            var source=initial[issue.id]!==undefined?initial[issue.id]:initial[issue.legacyId];
            var p=IssueModel.positions[IssueModel.index(source)];
            candidate.issuePositions[issue.id]=p.value; candidate.stances[issue.id]=p.id;
            candidate.positionProvenance[issue.id]=source===undefined?'Modeled centrist scenario default; position not documented':'Scenario mapping from legacy '+issue.legacyId+'; not a verified real-world candidate stance';
        });
        candidate.initialStances=Object.assign({},candidate.issuePositions);
    },
    setPosition: function(candidate,issueId,positionId,options) {
        var c=this.candidate(candidate), issue=this.getIssue(issueId), p=this.positions.find(function(x){return x.id===positionId;});
        if(!c||!issue||!p) return {ok:false,error:'Choose a valid candidate, issue and position.'};
        if(options && options.playerAction && gameData.lockedIssues && gameData.lockedIssues[issue.id])return {ok:false,error:'This position is locked by an active PAC agreement.'};
        var old=this.getPosition(c,issue.id);
        if(old.id===p.id)return {ok:true};
        if(options&&options.playerAction&&typeof SimulationState!=='undefined')Campaign.saveState();
        c.issuePositions=c.issuePositions||{};c.stances=c.stances||{};
        c.issuePositions[issue.id]=p.value;c.stances[issue.id]=p.id;
        if(options && options.playerAction){
            var penalty=Math.abs(p.index-old.index)*0.018;
            if(typeof Campaign!=='undefined'&&Campaign.adjustFavorability)Campaign.adjustFavorability(-penalty,'position change');
            c.issueCredibility=c.issueCredibility||{};c.issueCredibility[issue.id]=Math.max(0.1,(c.issueCredibility[issue.id]===undefined?0.6:c.issueCredibility[issue.id])-Math.abs(p.index-old.index)*0.04);
            if(typeof Utils!=='undefined')Utils.addLog('Platform: '+issue.name+' → '+p.label+'. Large reversals reduce credibility.');
        }
        if(typeof Electorate!=='undefined')Electorate.invalidate();
        if(typeof updateCoalitionLoyalty==='function')updateCoalitionLoyalty();
        if(typeof recomputeInterestGroupSupport==='function')recomputeInterestGroupSupport();
        return {ok:true};
    },
    agreement: function(issueId,a,b) {
        var issue=this.getIssue(issueId); if(!issue)return 0;
        var av=issue.coordinates[this.index(a)],bv=issue.coordinates[this.index(b)];
        return Math.max(-1,1-Math.abs(av-bv));
    }
};

(function(){
    var catalog=[];
    function add(id,name,category,legacy,description,stances,coordinates){
        catalog.push({id:id,name:name,category:category,legacyId:legacy,description:description,
            coordinates:coordinates||[-1,-2/3,-1/3,0,1/3,2/3,1],
            positions:IssueModel.positions.map(function(p,i){return Object.assign({},p,{description:stances[i]});})});
    }
    add('economy','Inflation & cost of living','Economy & Work','economy','How the federal government should respond to rising household costs, weak purchasing power and economic slowdowns.',[
        'Use public ownership of essential services, price ceilings and universal income supports to protect households; accept extensive intervention in market allocation.',
        'Regulate excessive pricing and expand public provision of necessities, funding substantial household relief through progressive revenue.',
        'Pair targeted cost-of-living assistance with competition enforcement and supply investment, while retaining an independent central bank.',
        'Combine temporary targeted relief with supply measures and monetary restraint; avoid permanent broad subsidies or sweeping price controls.',
        'Prioritize faster permitting, business investment and restrained federal spending, with limited assistance for the most vulnerable households.',
        'Reduce taxes and regulation broadly and cut federal spending, relying mainly on private production and monetary discipline to restrain prices.',
        'Sharply reduce federal economic management and subsidies, allowing market prices and private contracting to allocate essential goods with minimal federal intervention.'
    ]);
    add('taxation','Taxes & wealth','Economy & Work','taxation','The distribution of federal taxes between households, investors and businesses, and the scale of redistribution.',[
        'Impose steep wealth, inheritance and high-income taxes to redistribute economic power and fund extensive universal public services.',
        'Increase progressive income, capital-gains and corporate taxes substantially, using the proceeds for universal benefits and public investment.',
        'Raise taxes on high earners and close corporate loopholes while expanding credits for lower- and middle-income households.',
        'Broaden the tax base, simplify deductions and maintain roughly stable overall revenue, balancing distributional and investment concerns.',
        'Lower business and middle-income rates modestly while limiting deductions and preserving a progressive income-tax structure.',
        'Substantially reduce income and corporate taxes, favor investment incentives and limit the revenue available for expanded federal programs.',
        'Replace most federal income taxation with consumption-based or other limited levies and sharply shrink the federal fiscal footprint.'
    ]);
    add('trade','Trade & tariffs','Economy & Work','trade','Tariffs, trade agreements and protections for domestic producers. Similar restrictions can reflect different labor or nationalist motives.',[
        'Reject investor-centered trade agreements and impose strong import restrictions to protect worker control, labor standards and domestic production.',
        'Renegotiate trade deals around enforceable labor and environmental standards, using selective tariffs to protect vulnerable domestic industries.',
        'Support international trade with binding labor standards, adjustment assistance and narrow remedies against dumping or unfair subsidies.',
        'Favor open trade and predictable multilateral rules, reserving tariffs for clearly documented unfair practices and security exceptions.',
        'Expand market access through reciprocal agreements while safeguarding strategic supply chains and enforcing intellectual-property protections.',
        'Use substantial targeted tariffs and domestic-content requirements to reduce dependence on geopolitical rivals and encourage reshoring.',
        'Use broad protective tariffs and extensive import restrictions to prioritize national self-sufficiency, accepting higher costs for imported goods.'
    ],[1,0.6,-0.2,-1,-0.6,0.5,1]);
    add('industrial','Industrial policy','Economy & Work','economy','Whether government should direct investment into domestic manufacturing and strategically important technologies.',[
        'Place major strategic industries under public or worker ownership and direct investment through national production plans.',
        'Establish large public investment programs with ownership stakes, strong union conditions and long-term national industrial planning.',
        'Use targeted grants and tax credits for strategic industries with labor, competition and environmental safeguards.',
        'Support a limited set of strategic investments with competitive awards, measurable milestones and sunset provisions.',
        'Prefer broad investment incentives and faster permitting, reserving direct subsidies for exceptional national-security needs.',
        'Rely chiefly on private capital and deregulation, opposing most sector-specific subsidies and government ownership stakes.',
        'Eliminate federal industrial subsidies and public investment planning, leaving production and research financing almost entirely to private markets.'
    ]);
    add('minwage','Minimum wage','Economy & Work','minwage','Federal wage floors and the balance between worker income, local living costs and employer flexibility.',[
        'Set a high national living wage tied to household needs, combine it with sector-wide bargaining and publicly guarantee access to paid work.',
        'Substantially increase the federal minimum wage, index it to living costs and eliminate lower tipped-worker wage rules.',
        'Phase in a higher federal wage floor with automatic inflation adjustments and transitional assistance for small employers.',
        'Adopt a moderate phased increase with regional flexibility, monitoring hiring and prices before further adjustments.',
        'Keep a modest national floor and leave most increases to states, using earned-income credits to supplement low wages.',
        'Oppose federal minimum-wage increases and let states or individual employers determine most wage arrangements.',
        'Repeal the federal wage floor and rely on voluntary wage contracts, with no federal requirement to raise low hourly pay.'
    ]);
    add('labor','Unions & bargaining','Economy & Work','labor','Rules for organizing unions, collective bargaining, strikes and worker participation in business decisions.',[
        'Give workers controlling ownership or governance rights and establish compulsory sector-wide bargaining over pay and production conditions.',
        'Expand sectoral bargaining, protect broad strike rights and make union recognition substantially easier across private and public workplaces.',
        'Strengthen organizing protections, penalize employer retaliation and simplify certification while retaining enterprise-level bargaining.',
        'Protect organizing and bargaining with balanced election rules, mediation and limits on disruptive or coercive practices by either side.',
        'Maintain voluntary workplace unions while strengthening individual opt-outs and employer flexibility in workplace agreements.',
        'Expand right-to-work rules and limit compulsory fees, secondary strikes and public-sector bargaining powers.',
        'Remove most federal collective-bargaining mandates and treat employment and representation largely as individual private contracts.'
    ]);
    add('antitrust','Corporate concentration','Economy & Work','taxation','Merger enforcement, market power and the treatment of dominant firms in consumer and labor markets.',[
        'Break up dominant firms and move essential monopolies into public or cooperative ownership to disperse private economic power.',
        'Aggressively block concentration, separate integrated platforms and expand antitrust standards to worker and supplier power.',
        'Strengthen merger review and enforcement against exclusionary conduct, including measurable harms to workers and small businesses.',
        'Apply case-by-case competition rules based on demonstrated market power, entry barriers and consumer or worker harm.',
        'Retain antitrust enforcement but emphasize efficiency, entry and clear evidence rather than firm size alone.',
        'Narrow intervention to clear collusion or exclusion, permitting most mergers and rejecting broad structural breakups.',
        'Minimize federal antitrust restrictions and accept large private firms unless they obtain privileges directly through government coercion.'
    ]);
    add('business','Small-business regulation','Economy & Work','economy','Licensing, compliance costs, access to finance and the obligations of smaller employers.',[
        'Favor public and cooperative finance over private ownership, with strong universal labor and environmental requirements for businesses of every size.',
        'Offer public credit and grants to small firms while applying strong wage, workplace and environmental standards without broad exemptions.',
        'Simplify paperwork and expand access to credit while preserving core worker, consumer and environmental protections.',
        'Streamline duplicative requirements and provide compliance assistance, retaining rules with demonstrated public benefits.',
        'Expand small-business exemptions, simplify taxes and speed licenses while retaining basic fraud and safety rules.',
        'Remove many federal licensing, labor and environmental compliance obligations and sharply limit new regulations on smaller employers.',
        'Dismantle most federal business regulation and public lending, leaving market entry and operating standards primarily to private agreement.'
    ]);
    add('housing','Housing supply & zoning','Housing & Infrastructure','govspend','Construction, land-use incentives and the federal role in increasing access to housing.',[
        'Build housing primarily through public and community ownership, restrict speculative landholding and guarantee housing access as a public service.',
        'Fund a large social-housing program and condition federal grants on inclusive zoning and permanently affordable development.',
        'Expand affordable construction and reward local zoning reform, pairing denser development with tenant and anti-displacement protections.',
        'Encourage a mix of private and subsidized construction with local planning flexibility and targeted infrastructure grants.',
        'Reduce construction rules and fees through incentives, prioritizing private supply and limiting ongoing federal operating subsidies.',
        'Remove federal development restrictions and favor private building while leaving most land-use decisions to local governments.',
        'Withdraw most federal housing programs and land-use conditions, relying on private property rights and locally determined construction rules.'
    ]);
    add('rent','Rent & housing assistance','Housing & Infrastructure','govspend','Tenant protections, rent stabilization and assistance with rent or homeownership costs.',[
        'Guarantee housing through public provision, impose strong rent ceilings and sharply constrain evictions and speculative rental ownership.',
        'Expand rent stabilization and universal housing assistance, giving tenants strong protections against eviction and displacement.',
        'Increase vouchers, targeted tenant protections and first-time buyer assistance while supporting construction to limit price pressure.',
        'Target assistance to severe housing need and use limited tenant protections that preserve maintenance and new construction incentives.',
        'Use time-limited targeted vouchers and ownership incentives, opposing broad rent controls that may reduce rental supply.',
        'Reduce federal housing subsidies and tenant regulation, relying on private supply, local charities and market rents.',
        'End most federal rent assistance and rent regulation, treating housing support primarily as a private or local responsibility.'
    ]);
    add('infrastructure','Transport & infrastructure','Housing & Infrastructure','govspend','Public investment in roads, transit, rail, water systems and the way projects are funded.',[
        'Nationalize major transport systems, provide fare-free public transit and prioritize public planning over private road or rail investment.',
        'Greatly expand public transit, rail and water investment with strong labor standards and progressive federal financing.',
        'Increase repair and transit funding with transparent procurement, climate resilience and access for underserved communities.',
        'Prioritize maintenance and high-benefit projects through a mix of grants, user fees and public-private partnerships.',
        'Favor roads, ports and essential repairs, using private investment, user fees and streamlined permitting where practical.',
        'Reduce federal project selection and shift financing toward states, tolls and private infrastructure operators.',
        'Privatize most commercially viable infrastructure and sharply limit federal ownership, subsidies and long-term capital planning.'
    ]);
    add('broadband','Broadband & digital access','Housing & Infrastructure','economy','Connecting underserved households and rural communities, and regulating access to communications networks.',[
        'Treat broadband as a universal public utility with publicly owned networks, low or zero user charges and strong open-access rules.',
        'Build extensive municipal or cooperative broadband and guarantee affordable access through federal investment and network neutrality.',
        'Subsidize underserved areas, permit community networks and enforce affordability and open-internet obligations on funded providers.',
        'Use competitive grants and targeted affordability support, with provider-neutral technology rules and measurable coverage commitments.',
        'Encourage private and satellite deployment through lighter permitting and narrow subsidies for genuinely uneconomic locations.',
        'Limit federal subsidies and network regulation, relying primarily on competition and private investment to extend service.',
        'End federal broadband subsidy programs and utility-style rules, leaving access, pricing and network management to private contracts.'
    ]);
    add('healthcare','Health insurance & coverage','Health & Retirement','healthcare','How care is financed, who is covered and the roles of public insurance and private markets.',[
        'Create a publicly owned healthcare service with universal coverage and largely replace private insurance and profit-driven provision.',
        'Establish comprehensive single-payer coverage financed by taxes, replacing most duplicative private insurance while allowing independent providers.',
        'Offer a public insurance option and expand subsidies and public eligibility while retaining regulated private plans.',
        'Maintain mixed public-private coverage with targeted affordability reforms and protections for people with high medical needs.',
        'Expand private plan choice and competition with targeted assistance, limiting new federal coverage entitlements.',
        'Reduce federal insurance mandates and expand private accounts, state flexibility and market pricing in coverage.',
        'Shift most healthcare financing to private purchase, charities and local arrangements while substantially reducing federal insurance programs.'
    ]);
    add('drugpricing','Prescription drug prices','Health & Retirement','drugpricing','Negotiation, patents, competition and public intervention in medicine prices and development.',[
        'Place essential drug production and research in public ownership and supply necessary medicines at minimal or no patient cost.',
        'Use broad mandatory price negotiation, patent interventions and public manufacturing to sharply reduce medicine costs.',
        'Expand negotiation and competition, cap selected patient costs and penalize unjustified price increases.',
        'Target affordability problems through generics, transparency and limited negotiation while preserving incentives for research.',
        'Speed generic approvals and increase market competition, preferring targeted assistance to broad government price-setting.',
        'Oppose most federal price negotiation and caps, emphasizing patent incentives, private bargaining and faster regulatory approvals.',
        'Remove most federal medicine price controls and subsidy programs, leaving research financing and pricing to voluntary private markets.'
    ]);
    add('socialsecurity','Social Security','Health & Retirement','govspend','Retirement benefits, eligibility, payroll-tax financing and the long-run balance of the federal retirement system.',[
        'Guarantee a substantially larger universal public pension, lower retirement eligibility and finance it through broad progressive taxation.',
        'Expand benefits and protect retirement ages by substantially increasing contributions from high earners and other progressive revenue.',
        'Protect scheduled benefits and improve low-income retirement support, raising the taxable wage cap to strengthen financing.',
        'Negotiate a mix of additional revenue and gradual benefit adjustments while protecting current retirees and low-income workers.',
        'Preserve a basic public benefit while gradually adjusting retirement ages or formulas and encouraging supplemental private savings.',
        'Introduce partial private accounts and reduce future benefit growth to limit the program’s long-term tax requirements.',
        'Replace most public retirement provision for future workers with individual savings, while establishing a transition for existing commitments.'
    ]);
    add('medicare','Medicare & elder care','Health & Retirement','healthcare','Older adults’ insurance, long-term care and the division of costs between patients, families and government.',[
        'Provide comprehensive public health and long-term care for every older adult without premiums, replacing most private elder-care financing.',
        'Greatly expand Medicare benefits and publicly financed home or residential care, funded by progressive taxation.',
        'Add selected benefits, reduce out-of-pocket costs and expand support for home care and family caregivers.',
        'Protect essential benefits while testing payment reforms and targeted caregiver support to control costs.',
        'Expand competing plan choices and targeted assistance, emphasizing care coordination and restrained growth in federal commitments.',
        'Move toward capped federal contributions and greater private-plan responsibility for retirement health coverage.',
        'Shift future elder-care financing mainly to private insurance and savings, sharply limiting open-ended federal benefit guarantees.'
    ]);
    add('mentalhealth','Mental health & addiction','Health & Retirement','healthcare','Access to treatment, prevention, harm reduction and the response to substance dependence and psychiatric crisis.',[
        'Guarantee publicly provided mental healthcare and harm-reduction services, decriminalizing drug possession and minimizing coercive treatment.',
        'Fund universal community treatment, housing and harm reduction, prioritizing voluntary care over criminal penalties.',
        'Expand insurance coverage, crisis teams and evidence-based addiction treatment with targeted overdose prevention programs.',
        'Combine treatment, prevention and crisis intervention with supervised court referrals when public safety or severe impairment requires action.',
        'Support targeted treatment and recovery programs alongside firmer enforcement against public disorder and illicit drug distribution.',
        'Prioritize abstinence-based recovery, compulsory treatment in defined cases and stronger penalties for drug supply and public disorder.',
        'Emphasize punitive drug enforcement and broad compulsory intervention, with limited federal support for harm-reduction or universal treatment programs.'
    ]);
    add('immigration','Border security','Immigration','immigration','Ports of entry, border staffing, physical barriers and the treatment of unauthorized border crossings.',[
        'Replace restrictive border enforcement with broadly free movement and humanitarian processing, ending most detention and physical exclusion infrastructure.',
        'Greatly reduce detention and barrier construction and prioritize humanitarian processing, legal access and independent oversight.',
        'Improve lawful processing, staffing and targeted security technology while limiting detention and protecting access to asylum.',
        'Balance enforceable border rules with orderly asylum processing, adequate staffing and accountability for enforcement conduct.',
        'Increase staffing, surveillance and targeted barriers while narrowing release exceptions and preserving limited humanitarian processing.',
        'Expand barriers, detention and restrictive entry rules, prioritizing deterrence and rapid return of unauthorized arrivals.',
        'Use maximal physical restrictions and extensive emergency enforcement to sharply curtail unauthorized entry, accepting substantial limits on humanitarian access.'
    ]);
    add('asylum','Asylum & refugees','Immigration','immigration','Protection for people fleeing persecution, refugee admissions and the procedures used to assess claims.',[
        'Provide broad sanctuary and expansive protection eligibility, ending detention and numerical refugee limits wherever administratively possible.',
        'Greatly expand admissions and legal assistance, interpreting protection grounds broadly and using community-based case management.',
        'Increase timely hearings, legal access and refugee capacity while preserving individualized screening and anti-fraud safeguards.',
        'Maintain a meaningful protection system with faster decisions, clear eligibility rules and removal after final denial.',
        'Narrow eligibility and strengthen screening, requiring more claims to be processed outside the country or through designated routes.',
        'Reduce refugee admissions substantially and impose restrictive asylum access, detention and external-processing arrangements.',
        'Suspend most refugee admissions and sharply restrict asylum availability, prioritizing exclusion over expanded humanitarian protection.'
    ]);
    add('deportation','Deportation & enforcement','Immigration','immigration','Interior immigration enforcement, removal priorities, detention and cooperation with local authorities.',[
        'End most immigration detention and deportations, replacing removal enforcement with broad regularization and protections against status-based policing.',
        'Limit deportation to exceptional serious cases, end large detention contracts and restrict local participation in immigration enforcement.',
        'Prioritize serious public-safety cases, provide due process and protect established families from indiscriminate enforcement.',
        'Enforce final removal decisions with defined priorities, judicial safeguards and proportional use of detention.',
        'Broaden interior enforcement and local cooperation while retaining targeted humanitarian exceptions and ordinary legal review.',
        'Expand detention, workplace checks and removals across most unauthorized residents, with limited exemptions.',
        'Pursue comprehensive removal of unauthorized residents through intensive nationwide enforcement and broad detention capacity.'
    ]);
    add('citizenship','Legal status & citizenship','Immigration','immigration','Whether and how long-term unauthorized residents may receive lawful status and eventually citizenship.',[
        'Provide immediate broad legal status and a short, accessible route to citizenship with minimal income, employment or residence barriers.',
        'Offer broad regularization and an accessible citizenship pathway while reducing fees and punitive eligibility exclusions.',
        'Create earned pathways for long-term residents and people brought as children, with clear screening and processing requirements.',
        'Pair limited earned legalization with enforcement and administration reforms, distinguishing residency from eventual citizenship.',
        'Consider narrow protections for selected long-term residents while opposing a broad new citizenship pathway.',
        'Oppose broad legalization and require most unauthorized residents to leave before seeking lawful admission.',
        'Reject regularization programs and sharply restrict access to citizenship for people who entered or remained without authorization.'
    ]);
    add('legalimmigration','Legal immigration levels','Immigration','immigration','The number and mix of family, employment and humanitarian immigration places.',[
        'Remove most numerical limits and income barriers, prioritizing free movement, family unity and equal access to lawful residence.',
        'Substantially expand family and humanitarian admissions and clear backlogs with fewer numerical and financial restrictions.',
        'Increase admissions in high-need categories, reduce family backlogs and make processing more predictable.',
        'Maintain moderate admissions with periodic adjustments for family needs, labor demand and administrative capacity.',
        'Favor skills and employment-based selection while limiting expansion of family categories and overall admissions.',
        'Reduce overall admissions and tighten eligibility, prioritizing selected skills and nuclear-family reunification.',
        'Impose a steep reduction or broad moratorium on new admissions, allowing only narrow exceptions for essential national needs.'
    ]);
    add('h1b','H-1B skilled-work visas','Immigration','immigration','Skilled temporary employment visas, wage safeguards, employer dependence and opportunities for US and foreign workers.',[
        'Replace employer-tied temporary visas with portable residence and equal labor rights, preventing employers from using dependent status to weaken bargaining.',
        'Require strong wage floors, worker portability and union consultation before expanding skilled migration programs.',
        'Expand skilled-worker access where justified while strengthening wages, portability and enforcement against displacement or abuse.',
        'Adjust visa capacity to demonstrated needs with credible wage rules, transparent selection and timely administration.',
        'Increase access for high-skill employers and graduates while preserving targeted wage and fraud protections.',
        'Restrict visas in occupations with available domestic workers and require higher wages and stronger recruitment tests.',
        'Severely curtail the program to prioritize domestic hiring, permitting only narrowly defined exceptional skills.'
    ],[-0.4,0.3,-0.3,0,-0.7,0.7,1]);
    add('seasonalvisas','Farm & seasonal-work visas','Immigration','immigration','Temporary agricultural and seasonal migration, labor supply and protections for migrant workers.',[
        'Replace tied seasonal visas with full worker mobility, permanent-status options and strong collective bargaining protections.',
        'Require strong pay, housing and safety guarantees and portable status before expanding seasonal labor admissions.',
        'Expand reliable access for seasonal employers while improving enforcement, portability and paths for established workers.',
        'Match admissions to demonstrated seasonal demand with enforceable wage, housing and recruitment standards.',
        'Streamline applications and increase flexibility for employers while preserving basic safety and anti-fraud checks.',
        'Limit admissions to verified shortages and tighten employer and worker compliance to prioritize domestic labor.',
        'Sharply restrict seasonal migration and require industries to rely primarily on domestic recruitment and mechanization.'
    ]);
    add('foreign','Overseas military intervention','Foreign Policy & Defense','foreign','When the United States should use force abroad. Anti-intervention positions can arise from very different ideological commitments.',[
        'Close most overseas bases and reject military intervention as a tool of economic or political domination, emphasizing diplomacy and international solidarity.',
        'Avoid discretionary wars, reduce deployments and require stringent democratic authorization for exceptional uses of force.',
        'Use force only as a last resort with allied support, a defined objective and enforceable congressional oversight.',
        'Retain selective intervention for clear security or humanitarian objectives, balancing deterrence, diplomacy and long-term costs.',
        'Maintain a strong forward presence and willingness to use force to deter adversaries and defend allied security.',
        'Use decisive force for narrowly defined national interests while resisting prolonged nation-building or open-ended peacekeeping.',
        'Withdraw from most foreign conflicts and commitments to concentrate military power on territorial defense and national autonomy.'
    ],[-1,-0.7,-0.25,0.25,1,0.5,-0.85]);
    add('israel','Israel & Palestine','Foreign Policy & Defense','israel','US diplomatic, military and humanitarian policy toward Israel and Palestinians; this scenario scale describes policy packages rather than people’s identities.',[
        'End military support and impose broad sanctions until equal political rights are secured, backing a rights-based settlement without privileging one state structure.',
        'Suspend offensive military assistance and use strong diplomatic and economic pressure for Palestinian self-determination and civilian protection.',
        'Condition military assistance on civilian protections and international obligations while supporting negotiated statehood and humanitarian access.',
        'Balance Israeli security assistance with Palestinian humanitarian support and sustained diplomacy toward a negotiated political settlement.',
        'Prioritize Israeli security cooperation while encouraging negotiations and limited conditions aimed at preventing civilian harm.',
        'Provide broad security and diplomatic backing to Israel with few public conditions, opposing unilateral recognition of Palestinian statehood.',
        'Support maximal Israeli territorial and security claims and oppose US pressure for Palestinian statehood or significant restrictions on military assistance.'
    ]);
    add('venezuela','Venezuela policy','Foreign Policy & Defense','foreign','Sanctions, recognition, migration consequences and diplomatic engagement with Venezuela in the fictional campaign scenario.',[
        'End broad sanctions and oppose outside efforts to determine Venezuela’s government, prioritizing sovereignty and unrestricted economic relations.',
        'Lift broad economic sanctions and emphasize dialogue, civilian relief and opposition to military coercion.',
        'Offer phased sanctions relief linked to verifiable political openings, maintaining targeted accountability measures and humanitarian exemptions.',
        'Combine conditional engagement with targeted sanctions and international monitoring of political and humanitarian commitments.',
        'Maintain substantial pressure and offer limited relief only after measurable institutional and electoral concessions.',
        'Expand sanctions and diplomatic isolation to force political change, with narrow humanitarian exemptions.',
        'Use maximum economic and security pressure, including willingness to consider force, to compel a change in governing authority.'
    ]);
    add('ukraine','Ukraine & Russia','Foreign Policy & Defense','foreign','Military assistance, sanctions, escalation risk and diplomatic efforts surrounding the Russia–Ukraine conflict.',[
        'End arms transfers and emphasize immediate negotiations and reduced military blocs, prioritizing de-escalation over continued military assistance.',
        'Limit military assistance and press for negotiations while providing humanitarian relief and opposing attacks on civilians.',
        'Sustain defensive support and targeted sanctions with oversight, alongside active diplomacy and escalation safeguards.',
        'Continue conditional military and economic aid with burden-sharing, defined objectives and periodic congressional review.',
        'Provide stronger military support and sanctions to deter further aggression, requiring greater allied contributions.',
        'Limit open-ended US funding and demand a rapid settlement while retaining selected leverage against Russia.',
        'End most US security commitments to Ukraine and prioritize domestic spending and direct national defense over the conflict.'
    ],[-0.8,-0.4,0.4,0.6,1,-0.3,-1]);
    add('china','China & Taiwan','Foreign Policy & Defense','foreign','Competition, economic links, military deterrence and diplomacy in relations with China and across the Taiwan Strait.',[
        'Oppose military containment and economic decoupling, emphasizing negotiated coexistence and reduced US regional military presence.',
        'Favor diplomatic engagement and narrowly targeted restrictions, avoiding a broad arms buildup or economic separation.',
        'Combine allied diplomacy, targeted technology safeguards and defensive deterrence while preserving civilian trade and crisis communication.',
        'Balance competition and cooperation, maintain deterrence and use selective restrictions without committing to broad decoupling.',
        'Strengthen regional alliances and Taiwan’s defenses while restricting sensitive technologies and strategic dependencies.',
        'Expand economic restrictions and military deterrence, accelerating separation in strategically important supply chains.',
        'Pursue extensive decoupling, severe trade restrictions and a confrontational security posture to sharply reduce Chinese influence.'
    ]);
    add('nato','Alliances & NATO','Foreign Policy & Defense','foreign','Defense commitments, allied burden-sharing and the role of multilateral security institutions.',[
        'Replace military blocs with broader collective-security and disarmament arrangements, withdrawing from alliance commitments that sustain overseas military dominance.',
        'Reduce alliance militarization and deployments while emphasizing diplomacy and a more limited defensive mandate.',
        'Maintain alliances with strong democratic oversight, diplomacy and shared responsibility for defense and conflict prevention.',
        'Preserve mutual-defense commitments and seek predictable allied contributions and coordinated crisis management.',
        'Strengthen alliances and forward deterrence while pressing partners to contribute more defense resources.',
        'Make commitments more conditional on allied spending and direct US interests, reserving greater freedom of unilateral action.',
        'Withdraw from or fundamentally limit binding alliances, prioritizing national autonomy over standing mutual-defense obligations.'
    ]);
    add('military','Defense spending','Foreign Policy & Defense','military','The size and priorities of the defense budget, procurement and resources devoted to military readiness.',[
        'Cut defense spending deeply, close most overseas bases and redirect resources toward civilian services and economic conversion.',
        'Reduce the defense budget substantially, cancel costly programs and prioritize diplomacy and narrower defensive capabilities.',
        'Restrain budget growth and eliminate waste while protecting readiness, personnel support and selected modern capabilities.',
        'Maintain a balanced force with audited procurement and spending tied to assessed security needs.',
        'Increase readiness and modernization funding, using procurement reforms to improve the value of additional spending.',
        'Substantially expand defense investment, weapons production and military capacity to maintain global superiority.',
        'Commit very large resources to military strength and national defense, accepting cuts elsewhere or higher fiscal costs to accelerate expansion.'
    ]);
    add('foreignaid','Foreign aid','Foreign Policy & Defense','foreign','Humanitarian relief, development assistance and the conditions attached to civilian aid abroad.',[
        'Greatly expand unconditional development assistance, debt relief and climate reparations under recipient-led priorities.',
        'Increase humanitarian and development aid substantially, with strong poverty, rights and climate goals rather than commercial conditions.',
        'Expand effective health, food and development programs with transparent delivery and protections against diversion.',
        'Maintain targeted assistance with measurable outcomes, humanitarian exceptions and regular program evaluation.',
        'Concentrate aid on strategic partners and effective emergency relief while reducing poorly performing programs.',
        'Cut most development assistance and condition remaining funds tightly on US security and economic interests.',
        'End nearly all routine foreign assistance, retaining only exceptional emergency actions tied directly to national interests.'
    ]);
    add('climate','Climate & emissions','Energy & Environment','climate','The pace of emissions reductions, industrial obligations and the allocation of transition costs.',[
        'Use public planning and strict production limits to rapidly phase out high-emission activity, guaranteeing jobs and income through the transition.',
        'Mandate rapid economy-wide emissions cuts with large public investment and strong support for affected workers and communities.',
        'Set ambitious enforceable emissions targets using clean investment, standards and assistance for households and workers.',
        'Pursue gradual emissions reductions through mixed standards, incentives and international cooperation with attention to affordability.',
        'Favor innovation, adaptation and market incentives over broad emissions mandates, limiting costs imposed on households and firms.',
        'Roll back many federal emissions rules and prioritize energy affordability and voluntary technological change.',
        'Remove most federal climate restrictions and international emissions commitments, leaving adaptation and technology choices largely to markets and states.'
    ]);
    add('energy','Oil, gas & fossil fuels','Energy & Environment','energy','Leasing, drilling, pipelines and the future role of fossil-fuel production in the energy system.',[
        'Bring fossil-fuel production under public control and rapidly phase it down, replacing extraction jobs with guaranteed transition employment.',
        'End new major fossil-fuel development and sharply reduce production over time with public support for affected communities.',
        'Restrict high-impact projects and strengthen methane and pollution rules while managing a gradual transition from fossil fuels.',
        'Permit selected development with enforceable environmental safeguards while diversifying the energy supply.',
        'Expand responsible domestic production and pipeline capacity with streamlined reviews and targeted pollution controls.',
        'Greatly expand leasing and drilling and reduce permitting and environmental restrictions on fossil-fuel development.',
        'Prioritize unrestricted domestic fossil-fuel expansion and remove most federal constraints that limit extraction, transport or use.'
    ]);
    add('nuclear','Nuclear energy','Energy & Environment','energy','Construction and operation of nuclear plants, safety review, waste and public support for advanced reactors.',[
        'Phase out private nuclear generation and prioritize publicly owned renewables, accepting nuclear research only under stringent public and ecological oversight.',
        'Oppose major nuclear expansion and prioritize renewables, storage and conservation while carefully managing existing plant retirements.',
        'Keep safe existing plants operating and support limited advanced-reactor research alongside renewables and strong waste safeguards.',
        'Treat nuclear power as one low-carbon option, approving projects that meet transparent cost, safety and waste requirements.',
        'Expand nuclear construction through licensing reform and investment incentives while preserving independent safety oversight.',
        'Accelerate reactor licensing and substantial nuclear investment, reducing regulatory delays and supporting domestic fuel supply.',
        'Make rapid nuclear expansion a central national energy priority with sweeping exemptions from ordinary permitting and extensive strategic support.'
    ]);
    add('renewables','Renewables & the power grid','Energy & Environment','climate','Wind, solar, storage, transmission and the way clean electricity is financed and deployed.',[
        'Build a publicly owned renewable grid with rapid fossil replacement, universal affordable power and planning that overrides private utility profits.',
        'Use large public investment and binding clean-power mandates to rapidly deploy renewables, storage and transmission.',
        'Expand clean-energy incentives and grid construction with labor standards, environmental review and community benefits.',
        'Support a diverse grid and competitive clean-power investment while managing reliability, siting and household costs.',
        'Favor technology-neutral competition and selective grid upgrades, phasing down renewable-specific subsidies and mandates.',
        'End most renewable mandates and subsidies and let utilities choose generation based primarily on cost and reliability.',
        'Remove federal clean-power targets and most renewable support, prioritizing local control and unrestricted competition from conventional generation.'
    ]);
    add('water','Water & conservation','Energy & Environment','climate','Drinking-water investment, habitat, public land and the balance between conservation and resource development.',[
        'Treat water and major ecosystems as public commons, prohibit damaging extraction and guarantee essential water services outside profit-driven markets.',
        'Expand protected lands and strict water-quality rules with major public restoration and affordable-water investment.',
        'Strengthen water infrastructure and habitat protections while funding practical conservation and assistance for affected communities.',
        'Balance reliable water, habitat and economic use through targeted regulation, restoration and negotiated management.',
        'Use incentives and state-led management to conserve resources while easing federal restrictions on agriculture and development.',
        'Reduce federal land and water restrictions and expand state or private management and access for productive use.',
        'Transfer much federal resource management to states or private owners and sharply curtail federal environmental limits on development.'
    ]);
    add('abortion','Abortion & reproductive care','Rights & Education','abortion','Access to abortion, public funding, gestational rules and the federal/state division of authority.',[
        'Guarantee broadly accessible publicly funded abortion, leaving clinical decisions primarily to patients and clinicians and opposing criminal penalties for care.',
        'Establish strong nationwide abortion protections with public funding and few state barriers to access, particularly for medical needs.',
        'Protect nationwide access before viability and later care for serious medical circumstances while limiting burdensome state restrictions.',
        'Protect early access with later gestational restrictions and clear medical exceptions, seeking a federal compromise on basic protections.',
        'Permit tighter gestational limits and broader state discretion while preserving defined exceptions and access in early pregnancy.',
        'Prohibit most abortions with specified exceptions, restrict public funding and support substantial state or federal enforcement.',
        'Prohibit abortion from conception with very narrow exceptions and strong enforcement against providers, prioritizing fetal legal protection.'
    ]);
    add('guns','Firearms policy','Rights & Education','guns','Firearm access, licensing, public safety obligations and the interpretation of gun ownership rights.',[
        'Require comprehensive public licensing and sharply restrict private ownership of high-lethality firearms, emphasizing collective safety over unrestricted access.',
        'Adopt strict licensing, assault-weapon restrictions, safe-storage mandates and extensive background checks with public buyback programs.',
        'Expand background checks and risk-based removal orders and limit selected high-risk weapons while preserving ordinary lawful ownership.',
        'Protect lawful gun ownership while strengthening background checks, safe storage and targeted enforcement against dangerous misuse.',
        'Favor ownership and carry rights with focused checks for prohibited buyers and enforcement against violent offenders.',
        'Expand permitless carry and resist most weapon, magazine and licensing restrictions on lawful owners.',
        'Treat firearm ownership and carrying as nearly unrestricted rights and repeal most federal limits beyond punishment for harmful misuse.'
    ]);
    add('lgbtq','LGBTQ+ rights','Rights & Education','lgbtq','Nondiscrimination, recognition of relationships and gender identity, and access to related public services.',[
        'Require expansive recognition and public support for diverse gender and family forms, with comprehensive nondiscrimination duties and few institutional exemptions.',
        'Expand nationwide equality protections and access to affirming services, sharply limiting exemptions that deny equal treatment.',
        'Protect marriage equality and nondiscrimination and support access to appropriate services with professional and procedural safeguards.',
        'Maintain core equal-treatment protections while negotiating defined rules for schools, sports and conflicts with religious institutions.',
        'Preserve selected equality protections while expanding religious exemptions and state discretion over gender-related rules.',
        'Restrict gender-identity policies in schools and public programs and favor traditional family definitions with broad religious exemptions.',
        'Roll back broad federal gender-identity and relationship-recognition protections and impose restrictive traditional sex and family rules in public institutions.'
    ]);
    add('criminal','Policing & public safety','Rights & Education','criminal','Police authority, accountability, prevention and alternatives for responding to nonviolent crises.',[
        'Replace much conventional policing with community-led safety and social services, sharply limiting armed enforcement and coercive state powers.',
        'Shift substantial police funding to prevention and civilian crisis response and impose strong external accountability and liability.',
        'Invest in community safety and accountable policing with civilian crisis teams, transparent oversight and restrictions on abusive tactics.',
        'Combine effective police staffing with oversight, training and targeted prevention based on local needs.',
        'Increase police capacity and enforcement while retaining clear misconduct procedures and targeted community programs.',
        'Expand police powers and funding, strengthen enforcement against disorder and limit rules seen as constraining officers.',
        'Use intensive enforcement and broad police discretion to restore order, accepting substantial reductions in procedural and oversight constraints.'
    ]);
    add('sentencing','Sentencing & incarceration','Rights & Education','criminal','Prison terms, mandatory penalties, rehabilitation, reentry and the use of detention.',[
        'Dramatically reduce incarceration and replace many custodial penalties with restorative justice, reparative support and community supervision.',
        'End most mandatory minimums, shorten sentences substantially and invest heavily in alternatives, rehabilitation and reentry.',
        'Reduce excessive sentences for nonviolent offenses and expand rehabilitation and evidence-based alternatives while preserving serious-crime penalties.',
        'Balance proportional punishment, rehabilitation and public safety through selective sentencing reform and reliable supervision.',
        'Preserve firm sentences for serious offenses while supporting limited reentry and carefully screened alternatives.',
        'Increase penalties for repeat and violent offenses and limit early release and judicial departures from mandatory sentences.',
        'Impose very severe sentences and extensive mandatory incarceration, prioritizing deterrence and incapacitation over rehabilitation or early release.'
    ]);
    add('cannabis','Cannabis policy','Rights & Education','criminal','Federal prohibition, commercial legalization, expungement and regulation of cannabis.',[
        'Fully decriminalize possession and production, expunge past offenses and favor community or cooperative markets over punitive enforcement.',
        'Legalize and regulate adult use nationally, expunge records and reinvest revenues in communities affected by past enforcement.',
        'End federal prohibition for adult use and establish health, product-safety and youth-access safeguards.',
        'Allow state legalization with federal banking, research and safety rules, retaining restrictions on youth sales and impaired driving.',
        'Permit medical use and state discretion while opposing a broad federal endorsement of commercial adult-use markets.',
        'Maintain federal restrictions on recreational use and limit exceptions to tightly controlled medical access.',
        'Restore strict prohibition and stronger enforcement against production, distribution and possession, allowing few medical exceptions.'
    ]);
    add('religious_freedom','Religion & public institutions','Rights & Education','lgbtq','Religious exercise, nondiscrimination exemptions and the separation of religious institutions from government.',[
        'Enforce strict secular public institutions and eliminate most religious exemptions from generally applicable civil-rights and service obligations.',
        'Strengthen church-state separation and tightly limit exemptions that restrict equal access to employment, education or public services.',
        'Protect private religious exercise while maintaining secular public administration and clear nondiscrimination duties.',
        'Balance religious accommodations with equal treatment and institutional neutrality through narrowly tailored exemptions.',
        'Expand protections for religious organizations and individual conscience while retaining basic public-service obligations.',
        'Provide broad religious exemptions and increase space for religious expression and institutions in publicly supported programs.',
        'Give traditional religious values a central role in public policy and expand exemptions even when they limit uniform civil-rights requirements.'
    ]);
    add('education','K–12 education','Rights & Education','govspend','Public-school funding, school choice, curriculum authority and the federal role in education.',[
        'Guarantee extensively funded public education under democratic community control, ending private-school subsidies and reducing competitive market allocation.',
        'Greatly expand federal public-school funding, oppose vouchers and strengthen teacher bargaining and equity requirements.',
        'Increase targeted school funding and teacher support while maintaining accountability and a primary commitment to public schools.',
        'Balance adequate public funding, local flexibility and measured accountability, permitting carefully regulated alternatives.',
        'Expand charter and parental-choice options while simplifying federal requirements and retaining a public-school safety net.',
        'Expand vouchers and education savings accounts and return most curriculum and accountability authority to states and families.',
        'Withdraw most federal education oversight and funding conditions and shift substantial control and resources toward family-directed private education.'
    ]);
    add('studentdebt','College & student debt','Rights & Education','govspend','Tuition support, vocational pathways, student lending and relief for existing borrowers.',[
        'Make public higher education free, cancel broad student debt and replace loan-financed access with universal publicly funded study and training.',
        'Provide tuition-free public college and large-scale debt cancellation, financed through progressive federal revenue.',
        'Expand grants and affordable public pathways and provide targeted debt relief and income-based repayment protections.',
        'Target aid and repayment relief to financial need while strengthening institutional accountability and vocational alternatives.',
        'Emphasize vocational options, simpler loans and institutional cost discipline, limiting broad taxpayer-funded debt cancellation.',
        'Reduce federal lending and subsidies and oppose broad cancellation, relying more on private finance and employer-sponsored training.',
        'End most federal student lending and tuition support, leaving higher-education finance to students, institutions and private agreements.'
    ]);
    add('civilrights','Civil rights & equal treatment','Rights & Education','criminal','Federal enforcement of equal protection and discrimination rules in employment, housing and public services.',[
        'Use extensive federal redistribution and affirmative remedies to address structural inequality, imposing strong equal-outcome obligations on major institutions.',
        'Expand proactive civil-rights enforcement and affirmative remedies, with strong federal oversight of discriminatory institutions.',
        'Strengthen equal-access enforcement and targeted remedies for documented discrimination in housing, employment and public services.',
        'Maintain enforceable nondiscrimination rules and case-specific remedies while balancing due process and local implementation.',
        'Emphasize individual equal treatment and narrow remedies, limiting group-based preferences and expansive federal mandates.',
        'Restrict affirmative preferences and disparate-impact rules and return much enforcement discretion to states or private litigation.',
        'Sharply narrow federal civil-rights intervention beyond explicit legal discrimination and reject most group-conscious remedies and institutional mandates.'
    ]);
    add('govspend','Federal spending & debt','Government & Technology','govspend','The size of federal programs, budget deficits and the balance between borrowing, taxes and spending restraint.',[
        'Greatly expand universal public services and investment, using progressive taxation and public credit while subordinating deficit targets to social goals.',
        'Expand social and infrastructure spending with higher progressive revenue, accepting deficits when needed for employment and investment.',
        'Protect and selectively expand public services while combining progressive revenue and efficiency measures for sustainable finances.',
        'Balance core services and investment with gradual deficit reduction using both revenue and spending adjustments.',
        'Restrain program growth and reduce deficits primarily through spending discipline while protecting a limited safety net.',
        'Cut federal programs substantially and impose firm spending limits, prioritizing lower taxes and smaller government.',
        'Dismantle many federal domestic programs and require strict limits on borrowing and spending, transferring responsibilities to private or local institutions.'
    ]);
    add('electionreform','Voting & election administration','Government & Technology','electionreform','Registration, ballot access, voting methods and administration of elections.',[
        'Guarantee universal automatic access with expansive early and mail voting, restore voting rights broadly and minimize administrative barriers.',
        'Expand automatic and same-day registration, federal access standards and broad rights restoration with strong protection against suppression.',
        'Protect early and mail voting and simplify registration while funding secure administration and transparent audits.',
        'Balance accessible voting with consistent verification, professional administration and transparent post-election checks.',
        'Require stronger identification and verification while retaining practical access options and locally managed administration.',
        'Restrict mail and late registration options, strengthen identification rules and emphasize tighter eligibility checks.',
        'Impose very strict eligibility verification and narrow voting procedures, prioritizing restrictive access controls over expanded convenience.'
    ]);
    add('campaignfinance','Money in politics','Government & Technology','electionreform','Campaign donations, independent spending, transparency and public election financing.',[
        'Replace private campaign finance with comprehensive public funding and strictly limit corporate and wealthy-donor influence over political spending.',
        'Expand public financing and impose strong limits on large donations and independent expenditures through statutory or constitutional change.',
        'Require donor transparency and stronger anti-coordination rules and offer small-donor matching or public-financing options.',
        'Improve disclosure and enforcement while preserving mixed public-private funding and constitutional protections for political speech.',
        'Favor prompt disclosure and anti-corruption rules while allowing relatively broad private donations and independent advocacy.',
        'Relax contribution and expenditure restrictions and treat most privately financed political advocacy as protected expression.',
        'Remove most campaign-finance limits and much compulsory donor disclosure, prioritizing private political association and unrestricted spending.'
    ]);
    add('executive','Executive power & oversight','Government & Technology','govspend','Presidential authority, legislative oversight, agency independence and limits on emergency powers.',[
        'Disperse executive authority through strong legislative and participatory controls, sharply limiting emergency powers and coercive federal institutions.',
        'Reduce unilateral presidential powers and strengthen legislative, inspector-general and judicial checks on executive action.',
        'Enforce strong ethics, independent oversight and clear limits on emergencies while preserving ordinary administrative capacity.',
        'Maintain a workable separation of powers with transparent emergency rules, professional administration and regular oversight.',
        'Give elected executives more control over agencies while retaining statutory limits, courts and legislative accountability.',
        'Expand presidential direction of agencies and emergency action, reducing independent administrative constraints.',
        'Concentrate extensive authority in the presidency and sharply weaken independent institutional checks in pursuit of decisive executive control.'
    ]);
    add('scotus','Supreme Court & judiciary','Government & Technology','scotus','Court structure, judicial ethics, appointment rules and constitutional interpretation.',[
        'Fundamentally restructure the judiciary to reduce lifetime elite control, including major membership changes and stronger democratic checks on constitutional decisions.',
        'Adopt term limits, strong ethics enforcement and structural changes where necessary to rebalance judicial power.',
        'Support enforceable ethics and prospective tenure reforms while appointing judges who protect broad civil and social rights.',
        'Protect judicial independence with clear ethics rules and cautious institutional reform rather than partisan structural escalation.',
        'Favor restrained interpretation and judicial independence, opposing expansion while considering limited ethics or appointment-process reforms.',
        'Appoint strongly originalist judges and resist structural reforms that reduce existing judicial tenure or constitutional authority.',
        'Use appointments and jurisdictional changes aggressively to entrench a deeply conservative constitutional order and constrain opposing policy agendas.'
    ]);
    add('privacy','Privacy & surveillance','Government & Technology','criminal','Government surveillance, personal data and limits on collection or use of communications and digital information.',[
        'Abolish broad surveillance systems and impose strict warrants and public control over data collection to prevent state or corporate monitoring.',
        'End bulk collection and strengthen warrants, data minimization and legal remedies against both government and commercial surveillance.',
        'Create strong privacy rights and independent oversight while permitting targeted surveillance under meaningful judicial authorization.',
        'Balance privacy rights and targeted security investigations with transparent safeguards and limited retention of sensitive data.',
        'Retain broader investigative powers with oversight and favor flexible commercial data rules rather than sweeping mandates.',
        'Restrict federal monitoring of lawful citizens and emphasize individual privacy while allowing targeted investigations of specific threats.',
        'Dismantle most federal domestic-surveillance powers and reject centralized data registries on grounds of individual sovereignty and distrust of government.'
    ],[-1,-0.7,-0.3,0,0.5,-0.4,-0.95]);
    add('airegulation','AI & emerging technology','Government & Technology','economy','Rules governing automated decisions, frontier AI systems, labor displacement and technology competition.',[
        'Place powerful AI infrastructure under public or worker control and require democratic approval before deployments that displace labor or expand surveillance.',
        'Impose strong licensing, worker protections and public-interest obligations on major AI developers and high-risk deployments.',
        'Require risk testing, accountability for automated discrimination and targeted labor-transition support while permitting beneficial innovation.',
        'Use risk-based standards, transparency and liability for demonstrated harms with room for research and small-company innovation.',
        'Favor industry standards and targeted rules for concrete harms, avoiding broad licensing that could limit competition.',
        'Minimize new AI regulation and accelerate domestic development, using existing laws to address specific unlawful conduct.',
        'Reject most federal controls on AI development or deployment, allowing rapid private experimentation and market-driven responses to disruption.'
    ]);
    CORE_ISSUES.splice.apply(CORE_ISSUES,[0,CORE_ISSUES.length].concat(catalog));
    IssueModel.registry={};catalog.forEach(function(issue){IssueModel.registry[issue.id]=issue;});
    catalog.forEach(function(issue){
        POSITION_DESCRIPTORS[issue.id]={}; issue.positions.forEach(function(p){POSITION_DESCRIPTORS[issue.id][p.value]=p.description;});
        Object.keys(STATE_ISSUE_POSITIONS).forEach(function(state){if(STATE_ISSUE_POSITIONS[state][issue.id]===undefined)STATE_ISSUE_POSITIONS[state][issue.id]=STATE_ISSUE_POSITIONS[state][issue.legacyId]||0;});
    });
})();
