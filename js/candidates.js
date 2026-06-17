/* ============================================
   DECISION 2028 - CANDIDATES & RUNNING MATES
   ============================================
   Timeline context:
   - Donald Trump won the 2024 election against Kamala Harris
   - JD Vance became VP (2025–present)
   - Marco Rubio is Secretary of State (2025–present)
   - Robert F. Kennedy Jr. is Secretary of Health and Human Services (2025–present)
   - Pete Buttigieg served as Transportation Secretary (2021–2025)
   ============================================ */

/* ---- PRESIDENTIAL CANDIDATES ---- */
const CANDIDATE_DEFAULTS = {
    homeStateBoost: 1.5,
    funds: 40,
    img: "images/scenario.jpg",
    stamina: 7,
    desc: "",
    buff: null,
    debuff: null,
    groupEffects: {},
    groupBoosts: {},
    groupDebuffs: {},
    regionalSpillover: [],
    regionalSpilloverBoost: 0,
    // v2 new attributes
    charisma: 1.0,              // 0.5 (boring) to 2.0 (electrifying)
    debateSkill: 5,             // 1-10 scale
    scandalResistance: 0.3      // 0.0 (vulnerable) to 1.0 (teflon)
};

function _normalizeCandidateGroupEffects(candidate) {
    var normalizedEffects = {};
    var sourceEffects = candidate && candidate.groupEffects ? candidate.groupEffects : {};

    for (var groupId in sourceEffects) {
        if (!sourceEffects.hasOwnProperty(groupId)) continue;
        var sourceEffect = sourceEffects[groupId] || {};
        normalizedEffects[groupId] = {
            support: Number(sourceEffect.support) || 0,
            turnout: Number(sourceEffect.turnout) || 0
        };
    }

    function mergeLegacyEffects(sourceMap) {
        if (!sourceMap) return;
        for (var legacyGroupId in sourceMap) {
            if (!sourceMap.hasOwnProperty(legacyGroupId)) continue;
            var legacyValue = Number(sourceMap[legacyGroupId]);
            if (!isFinite(legacyValue) || legacyValue === 0) continue;
            if (!normalizedEffects[legacyGroupId]) {
                normalizedEffects[legacyGroupId] = { support: 0, turnout: 0 };
            }
            normalizedEffects[legacyGroupId].support += legacyValue;
            normalizedEffects[legacyGroupId].turnout += legacyValue;
        }
    }

    mergeLegacyEffects(candidate && candidate.groupBoosts);
    mergeLegacyEffects(candidate && candidate.groupDebuffs);

    return normalizedEffects;
}

const CANDIDATES = [
    {
        id: "harris",
        name: "Kamala Harris",
        party: "D",
        homeState: "CA",
        position: "Former Vice President of the United States (2021-2025)",
        homeStateBoost: 2.3,
        funds: 86,
        img: "images/harris.jpg",
        stamina: 7,
        desc: "Harris enters the 2028 cycle with national name ID, a large donor network, and the burden of having already lost a presidential race. Her lane is still the same: maximize turnout in blue metros, hold suburban college-educated women, and avoid a collapse with noncollege voters in the Midwest. She is a proven fundraising magnet, but the party will not treat her as inevitable if the polling shows repeated ceiling problems in the Great Lakes and Sun Belt exurbs.",
        buff: "Donor Magnet",
        debuff: "General-Election Ceiling",
        groupBoosts: { black: 9, asian: 7, suburban_college: 7 },
        groupDebuffs: { noncollege: -4, rural: -5 },
        regionalSpillover: ["NV", "AZ"],
        regionalSpilloverBoost: 1,
    },
    {
        id: "newsom",
        name: "Gavin Newsom",
        party: "D",
        homeState: "CA",
        position: "Governor of California (2019-)",
        homeStateBoost: 2,
        funds: 84,
        img: "images/newsom.jpg",
        stamina: 8,
        desc: "Newsom is the clearest elite-alternative Democrat: fluent on camera, aggressive on Trump, and backed by the kind of money that wants a confident national fighter. His problem is that the same profile that plays in California and coastal donor circles can harden resistance in the industrial Midwest and the exurbs. If he can translate California-style organizing into a broader anti-Trump coalition, he becomes dangerous; if not, he remains a regionalized national brand.",
        buff: "Media Combatant",
        debuff: "Heartland Liability",
        groupBoosts: { urban: 8, tech: 8, lgbtq: 7 },
        groupDebuffs: { rural: -6, evangelical: -5 },
        regionalSpillover: ["NV", "OR"],
        regionalSpilloverBoost: 0.9,
    },
    {
        id: "whitmer",
        name: "Gretchen Whitmer",
        party: "D",
        homeState: "MI",
        position: "Governor of Michigan (2019-)",
        homeStateBoost: 3.1,
        funds: 77,
        img: "images/whitmer.jpg",
        stamina: 8,
        desc: "Whitmer is built for the kind of map Democrats need: she can talk to union households, suburban women, and persuadable Midwestern voters without sounding like she came off a cable panel. Her value is not ideological purity; it is that she can defend Michigan and force Republicans to spend money where they want to win cheaply. If the race is about preventing Trump-era margins from widening in the Blue Wall, she is one of the few candidates who can credibly do it.",
        buff: "Blue Wall Anchor",
        debuff: "Low-Voltage Base",
        groupBoosts: { union: 8, suburban_women: 8, midwest_noncollege: 6 },
        groupDebuffs: { progressive_left: -3, rural: -4 },
        regionalSpillover: ["WI", "PA", "IN", "OH", "MN"],
        regionalSpilloverBoost: 1.5,
    },
    {
        id: "buttigieg",
        name: "Pete Buttigieg",
        party: "D",
        homeState: "IN",
        position: "Former Transportation Secretary (2021-2025)",
        homeStateBoost: 1.4,
        funds: 73,
        img: "images/buttigieg.jpg",
        stamina: 8,
        desc: "Buttigieg has discipline, message control, and the kind of fundraising network that keeps him in the top tier. He is strongest with highly educated voters, especially suburban and professional classes, and his weakness is obvious: he has to overperform in exactly the places where Democrats have been slipping with working-class voters. His best case is a clean, technocratic contrast to Republican chaos; his worst case is looking like an overqualified consultant in a fight that rewards raw coalition energy.",
        buff: "Suburban Precision",
        debuff: "Working-Class Gap",
        groupBoosts: { suburban_college: 8, lgbtq: 9, urban: 7 },
        groupDebuffs: { rural: -6, noncollege: -4 },
        regionalSpillover: ["MI", "OH"],
        regionalSpilloverBoost: 0.8,
    },
    {
        id: "aoc",
        name: "Alexandria Ocasio-Cortez",
        party: "D",
        homeState: "NY",
        position: "U.S. Representative from New York (2019-)",
        homeStateBoost: 1.6,
        funds: 70,
        img: "images/aoc.jpg",
        stamina: 9,
        desc: "Ocasio-Cortez is the purest turnout candidate in the field: unmatched social reach, strong youth intensity, and the ability to generate free media every time she opens her mouth. She can build a large small-dollar machine fast, but she also triggers the sharpest right-wing response and gives moderates an easy socialist frame. If Democrats want maximal enthusiasm in deep-blue metros and among younger voters, she is elite; if they want a low-drama general-election nominee, she is a problem.",
        buff: "Youth Engine",
        debuff: "Swing Voter Repellent",
        groupBoosts: { youth: 10, hispanic: 9, progressive_left: 9 },
        groupDebuffs: { noncollege: -6, evangelical: -7 },
        regionalSpillover: ["NJ", "CT"],
        regionalSpilloverBoost: 0.8,
    },
    {
        id: "kelly",
        name: "Mark Kelly",
        party: "D",
        homeState: "AZ",
        position: "U.S. Senator from Arizona (2020-)",
        homeStateBoost: 2.8,
        funds: 67,
        img: "images/kelly.jpg",
        stamina: 7,
        desc: "Kelly has one of the cleanest resumes for a swing-state Democrat: veteran, astronaut, senator, and winner in Arizona. His pitch is competence, restraint, and a calm contrast with Trump-style politics, which plays well with suburban moderates and national-security voters. He does not electrify the left, but he can hold enough of the center to make Arizona the foundation of a viable Sun Belt path.",
        buff: "Sun Belt Credibility",
        debuff: "Muted Fire",
        groupBoosts: { veterans: 8, suburban_moderates: 7, latino: 6 },
        groupDebuffs: { progressive_left: -3, evangelical: -4 },
        regionalSpillover: ["NV", "CO"],
        regionalSpilloverBoost: 1.2,
    },
    {
        id: "khanna",
        name: "Ro Khanna",
        party: "D",
        homeState: "CA",
        position: "U.S. Representative from California (2017-)",
        homeStateBoost: 1.4,
        funds: 61,
        img: "images/khanna.jpg",
        stamina: 8,
        desc: "Khanna is the policy-heavy candidate trying to fuse progressive economics with Silicon Valley credibility. He can raise money from tech and online networks, but he has to prove he is more than a west-coast theory candidate if he wants to matter in the Great Lakes. His upside is an argument that sounds economically sharper than the average Democrat; his downside is that many voters will still file him under coastal technocrat.",
        buff: "Tech-Left Blend",
        debuff: "Rust Belt Doubt",
        groupBoosts: { tech: 9, asian: 7, progressive_left: 8 },
        groupDebuffs: { rural: -5, noncollege: -4 },
        regionalSpillover: ["NV", "WA"],
        regionalSpilloverBoost: 0.7,
    },
    {
        id: "emanuel",
        name: "Rahm Emanuel",
        party: "D",
        homeState: "IL",
        position: "U.S. Ambassador to Japan (2021-2025)",
        homeStateBoost: 1.7,
        funds: 64,
        img: "images/emanuel.jpg",
        stamina: 6,
        desc: "Emanuel is the hard-knuckle institutionalist in the field: experienced, intimidating, and deeply connected to money and power. He would have no trouble attracting business donors and establishment support, but his own style is a tax on enthusiasm, especially among younger activists and progressive organizers. If the race rewards competence and toughness over inspiration, he becomes relevant; if not, he is a machine candidate in an anti-machine era.",
        buff: "Institutional Muscle",
        debuff: "Base Friction",
        groupBoosts: { suburban_moderates: 7, business_community: 8, jewish: 6 },
        groupDebuffs: { progressive_left: -7, youth: -4 },
        regionalSpillover: ["WI", "MI"],
        regionalSpilloverBoost: 1,
    },
    {
        id: "stewart",
        name: "Jon Stewart",
        party: "D",
        homeState: "NJ",
        position: "Media Personality & Activist",
        homeStateBoost: 1.4,
        funds: 48,
        img: "images/stewart.jpg",
        stamina: 6,
        desc: "Stewart would enter politics as a high-recognition outsider with enormous media leverage and almost no governing track record. That makes him useful as a vehicle for anti-establishment energy, but risky for donors who want someone who can survive a 17-state campaign without turning every week into a comedy bit. He can excite disaffected younger and online voters, yet the absence of executive experience would be his first and last attack line.",
        buff: "Media Reach",
        debuff: "No Governing Record",
        groupBoosts: { youth: 8, media_consumers: 9, progressive_left: 6 },
        groupDebuffs: { institutional_dems: -4, high_info_swing: -3 },
        regionalSpillover: ["NY", "PA"],
        regionalSpilloverBoost: 1,
    },
    {
        id: "beshear",
        name: "Andy Beshear",
        party: "D",
        homeState: "KY",
        position: "Governor of Kentucky (2019-)",
        homeStateBoost: 2.4,
        funds: 56,
        img: "images/beshear.jpg",
        stamina: 8,
        desc: "Beshear is the moderate Democrat who can still speak to red-state voters without sounding like he is begging for permission. That matters because Democrats need some evidence they can win back voters outside the coasts, not just maximize margins in metro areas. He has a real story in Kentucky, but his national ceiling depends on whether voters believe his style can travel beyond one unusually favorable personal brand.",
        buff: "Red-State Crossover",
        debuff: "National Ceiling",
        groupBoosts: { rural_whites: 7, union: 6, moderate_dems: 8 },
        groupDebuffs: { progressive_left: -4, youth: -3 },
        regionalSpillover: ["OH", "WV"],
        regionalSpilloverBoost: 1.1,
    },
    {
        id: "booker",
        name: "Cory Booker",
        party: "D",
        homeState: "NJ",
        position: "U.S. Senator from New Jersey (2013-)",
        homeStateBoost: 1.9,
        funds: 60,
        img: "images/booker.jpg",
        stamina: 7,
        desc: "Booker has the biography, the rhetorical range, and the ability to speak fluently to urban Black voters, suburban professionals, and moralistic liberals. The challenge is that he has often read as more inspirational than operational, and campaign cycles punish that distinction when the floor starts dropping in working-class counties. He can build a broad coalition, but he still has to prove that coalition can survive contact with the Midwest map.",
        buff: "Urban Coalition",
        debuff: "Execution Questions",
        groupBoosts: { black: 8, urban: 8, suburban_moderates: 6 },
        groupDebuffs: { noncollege: -3, progressive_left: -3 },
        regionalSpillover: ["NY", "PA"],
        regionalSpilloverBoost: 1,
    },
    {
        id: "shapiro",
        name: "Josh Shapiro",
        party: "D",
        homeState: "PA",
        position: "Governor of Pennsylvania (2023-)",
        homeStateBoost: 3.4,
        funds: 69,
        img: "images/shapiro.jpg",
        stamina: 8,
        desc: "Shapiro is the most straightforward Blue Wall candidate in the field because Pennsylvania is both his home base and his proof of concept. He has the executive profile, the state-level governing record, and the kind of moderate tone that can hold suburban voters without fully alienating the left. If Democrats want a candidate who starts with the map instead of the brand, he is one of the strongest options.",
        buff: "Keystone Anchor",
        debuff: "Soft National Brand",
        groupBoosts: { suburban_college: 8, jewish: 7, moderate_dems: 7 },
        groupDebuffs: { youth: -3, progressive_left: -3 },
        regionalSpillover: ["MI", "WI"],
        regionalSpilloverBoost: 1.5,
    },
    {
        id: "trump",
        name: "Donald Trump",
        party: "R",
        homeState: "FL",
        position: "45th President of the United States (2017-2021)",
        homeStateBoost: 1.8,
        funds: 90,
        img: "images/trump.jpg",
        stamina: 6,
        desc: "Trump is the sitting political gravity well: he dominates the party, sets the tone, and still forces every other Republican to define themselves against him. By the 2028 cycle, the issue is less persuasion than maintenance—protect the margins with noncollege whites, keep rural enthusiasm high, and avoid erosion in suburban counties that have already moved against him. He has the strongest base machine in the field, but age, fatigue, and saturation mean the operation depends on turnout more than expansion.",
        buff: "Base Dominance",
        debuff: "Fatigue Ceiling",
        groupBoosts: { noncollege: 10, evangelical: 10, rural: 10 },
        groupDebuffs: { suburban_college: -7, youth: -6 },
        regionalSpillover: ["PA", "OH"],
        regionalSpilloverBoost: 1.5,
    },
    {
        id: "vance",
        name: "JD Vance",
        party: "R",
        homeState: "OH",
        position: "U.S. Vice President (2025-)",
        homeStateBoost: 2.4,
        funds: 78,
        img: "images/vance.jpg",
        stamina: 8,
        desc: "Vance is the heir apparent type: younger than the rest, fluent in the grievance politics of the post-2016 GOP, and positioned to inherit Trump’s coalition if the transition is managed cleanly. His challenge is that being the logical successor is not the same as being universally liked, especially with donors and suburban voters who want the Trump coalition without the chaos. If he can keep the Rust Belt edge while not collapsing in Sun Belt suburbs, he becomes a very serious 2028 front-runner.",
        buff: "Succession Candidate",
        debuff: "Trust Deficit",
        groupBoosts: { noncollege: 9, evangelical: 8, rural: 9 },
        groupDebuffs: { suburban_college: -5, youth: -4 },
        regionalSpillover: ["PA", "MI"],
        regionalSpilloverBoost: 1.3,
    },
    {
        id: "desantis",
        name: "Ron DeSantis",
        party: "R",
        homeState: "FL",
        position: "Governor of Florida (2019-)",
        homeStateBoost: 2.6,
        funds: 72,
        img: "images/desantis.jpg",
        stamina: 8,
        desc: "DeSantis remains the most obvious anti-Trump Republican with a governing record and a national donor address book. His problem is that he never fully solved the Trump authenticity test, and every cycle since his peak has reinforced the sense that he is more methodical than magnetic. He can raise real money and appeal to hard-line culture voters, but he has to stop bleeding credibility with rank-and-file Republicans before he can be treated as a true top-tier contender.",
        buff: "Culture Warrior",
        debuff: "Momentum Loss",
        groupBoosts: { evangelical: 8, suburban_conservative: 7, noncollege: 7 },
        groupDebuffs: { youth: -5, college_liberals: -6 },
        regionalSpillover: ["GA", "NC"],
        regionalSpilloverBoost: 1,
    },
    {
        id: "cruz",
        name: "Ted Cruz",
        party: "R",
        homeState: "TX",
        position: "U.S. Senator from Texas (2013-)",
        homeStateBoost: 2.2,
        funds: 70,
        img: "images/cruz.jpg",
        stamina: 7,
        desc: "Cruz is a high-end ideological operator with real fundraising ability and a hard-core conservative base. He is excellent at alienating people who already dislike him, but in the modern GOP that can still be a feature if the primary electorate wants combat over comfort. His ceiling in a general election is clear: suburban voters, moderates, and many independents see him as pure conflict with no off-ramp.",
        buff: "Primary Knife Fighter",
        debuff: "General-Election Baggage",
        groupBoosts: { evangelical: 9, noncollege: 8, donor_conservative: 8 },
        groupDebuffs: { suburban_college: -7, latino: -3 },
        regionalSpillover: ["OK", "LA"],
        regionalSpilloverBoost: 0.9,
    },
    {
        id: "paul",
        name: "Rand Paul",
        party: "R",
        homeState: "KY",
        position: "U.S. Senator from Kentucky (2011-)",
        homeStateBoost: 2,
        funds: 55,
        img: "images/paul.jpg",
        stamina: 7,
        desc: "Paul is the libertarian lane inside the GOP: anti-war, anti-spending, anti-establishment, and deeply appealing to a slice of donors and online conservatives who want less culture-war machinery. That niche is real, but it is too narrow to dominate a presidential primary unless the field fractures. He can survive by being the dissenting voice, not by building the broadest coalition.",
        buff: "Libertarian Lane",
        debuff: "Narrow Coalition",
        groupBoosts: { libertarian: 9, tech_conservative: 6, donor_antiestablishment: 7 },
        groupDebuffs: { evangelical: -4, national_security_hawks: -5 },
        regionalSpillover: ["TN", "IN"],
        regionalSpilloverBoost: 0.7,
    },
    {
        id: "haley",
        name: "Nikki Haley",
        party: "R",
        homeState: "SC",
        position: "Former Governor of South Carolina (2011-2017)",
        homeStateBoost: 2.4,
        funds: 76,
        img: "images/haley.jpg",
        stamina: 8,
        desc: "Haley is the most credible Republican answer to voters who want the party without the baggage. She can speak to donors, suburban moderates, and voters uneasy about Trump’s style, but she pays a heavy price with the MAGA base whenever she sounds insufficiently loyal. If the GOP wants to broaden its coalition, she is the natural vehicle; if it wants to remain fully Trump-defined, she is an intraparty problem.",
        buff: "Suburban Alternative",
        debuff: "MAGA Suspicion",
        groupBoosts: { suburban_college: 8, donor_class: 8, women: 7 },
        groupDebuffs: { evangelical: -4, noncollege: -3 },
        regionalSpillover: ["NC", "GA"],
        regionalSpilloverBoost: 1.2,
    },
    {
        id: "ramaswamy",
        name: "Vivek Ramaswamy",
        party: "R",
        homeState: "OH",
        position: "Biotech CEO & Political Activist",
        homeStateBoost: 1.8,
        funds: 68,
        img: "images/ramaswamy.jpg",
        stamina: 9,
        desc: "Ramaswamy is the pure disruption candidate: young, fluent on media, and built for attention economics. He can raise money from anti-establishment donors and generate volume online, but he still has to prove that he can survive a real primary electorate rather than just dominate clips. His upside is obvious as a fresh face; his downside is that many Republicans may eventually decide he sounds more like a pitch deck than a president.",
        buff: "Disruption Machine",
        debuff: "Experience Gap",
        groupBoosts: { youth: 8, tech: 8, antiestablishment: 9 },
        groupDebuffs: { evangelical: -3, suburban_college: -4 },
        regionalSpillover: ["MI", "PA"],
        regionalSpilloverBoost: 1,
    },
    {
        id: "bannon",
        name: "Steve Bannon",
        party: "R",
        homeState: "NY",
        position: "Former Chief Strategist to President Trump",
        homeStateBoost: 1.2,
        funds: 40,
        img: "images/bannon.jpg",
        stamina: 6,
        desc: "Bannon is less a normal candidate than a force multiplier for insurgent nationalism. He can shape rhetoric, elevate grievances, and help define the hard-right lane, but his personal electoral appeal outside the activist ecosystem is limited. If the race becomes a purity contest, he matters; if it becomes a general-election contest, he becomes mostly a message threat to everyone else.",
        buff: "Insurgent Ideologue",
        debuff: "Electoral Toxicity",
        groupBoosts: { hardcore_right: 9, antiestablishment: 8, online_militant: 8 },
        groupDebuffs: { suburban_college: -8, women: -6 },
        regionalSpillover: ["AZ", "WI"],
        regionalSpilloverBoost: 0.9,
    },
    {
        id: "hawley",
        name: "Josh Hawley",
        party: "R",
        homeState: "MO",
        position: "U.S. Senator from Missouri (2019-)",
        homeStateBoost: 1.9,
        funds: 62,
        img: "images/hawley.jpg",
        stamina: 8,
        desc: "Hawley combines populist economics with culture-war aggression, which gives him a sharper identity than the average Senate Republican. He can speak to anti-elite voters who want the GOP to sound economically combative rather than merely business-friendly, but he will be under constant pressure to prove he can govern rather than just denounce. His real strength is in a primary where resentment and nationalism matter more than reassurance.",
        buff: "Populist Fire",
        debuff: "Trust Issues",
        groupBoosts: { noncollege: 8, evangelical: 8, blue_collar: 7 },
        groupDebuffs: { suburban_college: -6, donor_class: -4 },
        regionalSpillover: ["IA", "OH"],
        regionalSpilloverBoost: 1,
    },
    {
        id: "carlson",
        name: "Tucker Carlson",
        party: "R",
        homeState: "FL",
        position: "Media Personality & Political Commentator",
        homeStateBoost: 1.4,
        funds: 66,
        img: "images/carlson.jpg",
        stamina: 7,
        desc: "Carlson brings a ready-made media platform, a loyal audience, and the ability to dominate the conversation without spending much to do it. He can pull in donors who like the fact that he changes the incentives of the race, but plenty of Republicans would worry that he turns a campaign into an endless grievance broadcast. His ceiling is as much about whether the party wants a commentator as a nominee as it is about any specific policy position.",
        buff: "Media Star Power",
        debuff: "Candidate Question",
        groupBoosts: { online_right: 9, noncollege: 7, antiestablishment: 8 },
        groupDebuffs: { suburban_college: -7, women: -5 },
        regionalSpillover: ["MN", "WI"],
        regionalSpilloverBoost: 1,
    },
    {
        id: "rubio",
        name: "Marco Rubio",
        party: "R",
        homeState: "FL",
        position: "Secretary of State (2025-)",
        homeStateBoost: 2.7,
        funds: 75,
        img: "images/rubio.jpg",
        stamina: 8,
        desc: "Rubio is the most polished Republican diplomat-politician in the field, with a résumé that bridges the Senate, national security, and the post-Trump establishment. He can speak to donors, moderates, and Hispanic voters more naturally than most of the party, but he still has to outrun the shadow of having once been tagged as the 'establishment' option. If the GOP wants a nominee who can talk like a president and not just a movement figure, Rubio is a serious contender.",
        buff: "Diplomatic Polish",
        debuff: "Base Skepticism",
        groupBoosts: { hispanic: 7, suburban_college: 7, donor_class: 8 },
        groupDebuffs: { hard_right: -4, antiestablishment: -3 },
        regionalSpillover: ["NV", "AZ"],
        regionalSpilloverBoost: 1.1,
    },
    {
        id: "stein",
        name: "Jill Stein",
        party: "G",
        homeState: "MA",
        position: "Green Party Activist & Physician",
        homeStateBoost: 1,
        funds: 20,
        img: "images/stein.jpg",
        stamina: 5,
        desc: "Stein remains the left-green protest option, strongest as a pressure valve for voters who want to punish Democrats from the left. Her campaign can influence margins more than it can win states, and that is the whole story: she matters if the race is close in Michigan, Wisconsin, or Pennsylvania. She is not building a national majority coalition; she is trying to maximize protest oxygen.",
        buff: "Protest Vehicle",
        debuff: "Ballot-Box Ceiling",
        groupBoosts: { progressive_left: 7, antiwar_left: 8, environmentalists: 8 },
        groupDebuffs: { suburban_moderates: -6, institutional_dems: -7 },
        regionalSpillover: ["MI", "WI"],
        regionalSpilloverBoost: 0.8,
    },
    {
        id: "oliver",
        name: "Chase Oliver",
        party: "L",
        homeState: "GA",
        position: "Libertarian Activist & Entrepreneur",
        homeStateBoost: 1.2,
        funds: 18,
        img: "images/oliver.jpg",
        stamina: 7,
        desc: "Oliver is the libertarian ballot-line candidate: small-government, civil-liberties centered, and mostly relevant where the major parties are too polarized for some voters to tolerate. He can appeal to a tiny but real slice of independents and anti-regulation voters, but he is not going to break into the high-single digits nationally without a broader anti-duopoly mood. His value is mostly in regions where a few thousand votes can matter.",
        buff: "Libertarian Purist",
        debuff: "Low Visibility",
        groupBoosts: { libertarian: 9, small_business: 6, antiwar_independents: 6 },
        groupDebuffs: { evangelical: -5, union: -4 },
        regionalSpillover: ["NC", "FL"],
        regionalSpilloverBoost: 0.7,
    },
    {
        id: "yang",
        name: "Andrew Yang",
        party: "I",
        homeState: "NY",
        position: "Entrepreneur & Political Activist",
        homeStateBoost: 1.3,
        funds: 45,
        img: "images/yang.jpg",
        stamina: 7,
        desc: "Yang is the founder-friendly outsider who can still talk to tech, younger independents, and disaffected moderates in a language that sounds less tribal than either major party. His challenge is that his coalition is real but diffuse, and third-party campaigns are punished by the electoral system unless they land in a very specific moment. He can make noise, raise enough money to stay relevant, and pull on the 'system is broken' electorate, but he needs a chaos environment to matter.",
        buff: "Independent Brand",
        debuff: "Coalition Drift",
        groupBoosts: { tech: 8, youth: 7, independents: 8 },
        groupDebuffs: { union: -4, party_loyalists: -6 },
        regionalSpillover: ["CA", "NY"],
        regionalSpilloverBoost: 0.6,
    },
    {
        id: "massie",
        name: "Thomas Massie",
        party: "I",
        homeState: "KY",
        position: "U.S. Representative from Kentucky (2012-)",
        homeStateBoost: 2.8,
        funds: 44,
        img: "images/massie.jpg",
        stamina: 6,
        desc: "Massie runs as a constitutional-libertarian spoiler with high credibility among anti-establishment conservatives and civil-libertarian voters. His lane is narrow but potent in close states: he can pull meaningful vote share from Republicans while also peeling a smaller bloc from anti-system Democrats. He is less a coalition builder than a disruptor who alters turnout and margins where ideological voters are already skeptical of both major-party tickets.",
        buff: "Constitutionalist Spoiler",
        debuff: "Narrow Coalition",
        groupBoosts: { libertarian: 9, rural_whites: 6, antiestablishment: 6 },
        groupDebuffs: { institutional_dems: -8, progressive_left: -4 },
        // Target behavior request: Massie siphons ~10% of GOP share and ~3% of Democratic share.
        siphonFromMajorParties: { R: 0.10, D: 0.03 },
        regionalSpillover: ["OH", "IN", "TN"],
        regionalSpilloverBoost: 1.0,
    },
    {
        id: "kennedy_rfk",
        name: "Robert F. Kennedy Jr.",
        party: "I",
        homeState: "NY",
        position: "Kennedy Family Member & Public Health Activist",
        homeStateBoost: 1.2,
        funds: 58,
        img: "images/rfkjr.jpg",
        stamina: 6,
        desc: "Kennedy remains a highly unusual independent presence: strong name ID, strong anti-establishment signaling, and a brand that can briefly cut across partisan lines before collapsing under scrutiny. He can pull dissatisfied voters who want to punish both parties, but his coalition is unstable and often more emotional than durable. If the race is close enough for protest votes to matter, he is dangerous; if not, he is mostly a spoiler with an oversized microphone.",
        buff: "Anti-Establishment Pull",
        debuff: "Message Volatility",
        groupBoosts: { antiestablishment: 8, independents: 7, alternative_media: 7 },
        groupDebuffs: { institutional_dems: -7, public_health_professionals: -8 },
        regionalSpillover: ["AZ", "NH"],
        regionalSpilloverBoost: 0.8,
    },
    {
        id: "bloomberg",
        name: "Michael Bloomberg",
        party: "I",
        homeState: "NY",
        position: "Former Mayor of New York City (2002-2013)",
        homeStateBoost: 1,
        funds: 100,
        img: "images/bloomberg.jpg",
        stamina: 5,
        desc: "Bloomberg is the pure money candidate: unmatched resources, serious managerial credentials, and the ability to bankroll a professional operation at a scale no outsider can match. The catch is that money buys structure, not affection, and his profile remains deeply polarizing with both populists and activists. He can shape the field, dominate issue spending, and function as the emergency asset for anxious moderates, but he is not naturally built for mass enthusiasm.",
        buff: "Unlimited War Chest",
        debuff: "Mass-appeal Problem",
        groupBoosts: { suburban_moderates: 8, donor_class: 10, business_community: 10 },
        groupDebuffs: { black: -3, progressive_left: -8 },
        regionalSpillover: ["NY", "NJ"],
        regionalSpilloverBoost: 0.9,
    },
    {
        id: "delacruz",
        name: "Claudia De la Cruz",
        party: "PSL",
        homeState: "NY",
        homeStateBoost: 1,
        funds: 12,
        img: "images/delacruz.jpg",
        stamina: 7,
        desc: "De la Cruz is a hard-left organizing candidate whose purpose is not to win the presidency in the conventional sense, but to turn out anti-capitalist and anti-war voters who feel abandoned by Democrats. She can speak to activists, young radicals, and portions of the Latino left with authenticity, but the electoral system gives her almost no path to institutional power. Her campaign matters if protest energy is the commodity being measured.",
        buff: "Hard-Left Organizing",
        debuff: "Electoral Margin",
        groupBoosts: { progressive_left: 8, youth: 7, latino_left: 7 },
        groupDebuffs: { suburban_moderates: -8, institutional_dems: -9 },
        regionalSpillover: ["NY", "CA"],
        regionalSpilloverBoost: 0.5,
    },
    {
        id: "lariva",
        name: "Gloria La Riva",
        party: "PSL",
        homeState: "CA",
        homeStateBoost: 1,
        funds: 10,
        img: "images/lariva.jpg",
        stamina: 5,
        desc: "La Riva is the veteran socialist protest candidate with deep left activist credibility and very limited national reach. She can energize niche anti-imperialist and labor-left circles, but her ceiling is tiny in a presidential system that rewards broad coalitions and punishes fragmentation. She is a message candidate first and a vote-getter second, which is why her influence comes from issue pressure rather than electoral viability.",
        buff: "Leftist Credentials",
        debuff: "Tiny Ceiling",
        groupBoosts: { antiwar_left: 8, progressive_left: 6, labor_left: 6 },
        groupDebuffs: { suburban_moderates: -7, donor_class: -9 },
        regionalSpillover: ["CA", "NY"],
        regionalSpilloverBoost: 0.5,
    },
    // --- DEMOCRATS ---
    {
        id: "walz", name: "Tim Walz", party: "D", homeState: "MN", position: "Governor of Minnesota",
        homeStateBoost: 2.2, funds: 65, img: "images/walz.jpg", stamina: 7, charisma: 1.3, debateSkill: 7, scandalResistance: 0.8,
        desc: "A pragmatic Midwestern governor known for translating progressive wins through folksy communication. He holds the Blue Wall but lacks national flash.",
        buff: "Midwest Dad Energy", debuff: "Progressive Liability",
        groupEffects: { union: { support: 5, turnout: 3 }, rural: { support: 3, turnout: 1 }, suburban_moderates: { support: 4, turnout: 1 } }
    },
    {
        id: "crockett", name: "Jasmine Crockett", party: "D", homeState: "TX", position: "Former U.S. Representative",
        homeStateBoost: 1.3, funds: 55, img: "images/crockett.jpg", stamina: 9, charisma: 1.5, debateSkill: 8, scandalResistance: 0.5,
        desc: "A viral, highly aggressive progressive combatant who maxes out youth and minority turnout, but her hyper-partisan style acts as a lightning rod for the right.",
        buff: "Viral Combatant", debuff: "Swing Voter Repellent",
        groupEffects: { black: { support: 5, turnout: 6 }, youth: { support: 6, turnout: 7 }, suburban_moderates: { support: -4, turnout: -3 }, rural: { support: -5, turnout: 5 } }
    },
    {
        id: "ossoff", name: "Jon Ossoff", party: "D", homeState: "GA", position: "U.S. Senator",
        homeStateBoost: 1.9, funds: 80, img: "images/ossoff.jpg", stamina: 8, charisma: 1.4, debateSkill: 7, scandalResistance: 0.9,
        desc: "The quintessential Sun Belt suburban Democrat. He dominates high-income moderate areas but struggles to drive raw, unpolished base enthusiasm.",
        buff: "Sun Belt Appeal", debuff: "Soft Base Enthusiasm",
        groupEffects: { suburban_college: { support: 6, turnout: 3 }, youth: { support: 3, turnout: 1 }, noncollege: { support: -3, turnout: -2 } }
    },
    {
        id: "gallego", name: "Ruben Gallego", party: "D", homeState: "AZ", position: "U.S. Senator",
        homeStateBoost: 2.1, funds: 60, img: "images/gallego.jpg", stamina: 8, charisma: 1.3, debateSkill: 7, scandalResistance: 0.6,
        desc: "A Marine veteran who connects deeply with working-class voters and Hispanics, though the activist left views him with deep suspicion.",
        buff: "Working-Class Brawler", debuff: "Progressive Friction",
        groupEffects: { hispanic: { support: 6, turnout: 4 }, veterans: { support: 5, turnout: 2 }, union: { support: 4, turnout: 3 }, progressive_left: { support: -4, turnout: -3 } }
    },
    {
        id: "moore", name: "Wes Moore", party: "D", homeState: "MD", position: "Governor of Maryland",
        homeStateBoost: 2.3, funds: 75, img: "images/moore.jpg", stamina: 9, charisma: 1.6, debateSkill: 8, scandalResistance: 0.7,
        desc: "A highly charismatic rising star with massive upside, though he remains relatively untested on the grueling national stage.",
        buff: "Generational Charisma", debuff: "Light Governing Record",
        groupEffects: { black: { support: 5, turnout: 4 }, suburban_college: { support: 5, turnout: 2 }, independents: { support: 3, turnout: 1 } }
    },
    {
        id: "cuban", name: "Mark Cuban", party: "D", homeState: "TX", position: "Businessman & Investor",
        homeStateBoost: 1.5, funds: 100, img: "images/cuban.jpg", stamina: 7, charisma: 1.6, debateSkill: 8, scandalResistance: 0.4,
        desc: "A billionaire outsider with incredible crossover appeal. He pulls huge numbers of independents, but the progressive base openly revolts against him.",
        buff: "Business Maverick", debuff: "Base Distrust",
        groupEffects: { independents: { support: 8, turnout: 4 }, suburban_moderates: { support: 6, turnout: 3 }, progressive_left: { support: -8, turnout: -7 } }
    },
    {
        id: "talarico", name: "James Talarico", party: "D", homeState: "TX", position: "Texas Politician",
        homeStateBoost: 1.4, funds: 45, img: "images/talarico.jpg", stamina: 8, charisma: 1.5, debateSkill: 9, scandalResistance: 0.8,
        desc: "A progressive who uniquely articulates left-wing policy through a moral and religious lens. Extremely popular with the youth, but unknown nationally.",
        buff: "Moral Articulator", debuff: "National Anonymity",
        groupEffects: { youth: { support: 7, turnout: 6 }, secular: { support: 4, turnout: 3 }, progressive_left: { support: 6, turnout: 4 }, high_info_swing: { support: -2, turnout: 0 } }
    },

    // --- REPUBLICANS ---
    {
        id: "bovino", name: "Greg Bovino", party: "R", homeState: "CA", position: "Fmr. Commander-at-Large of the Border Patrol",
        homeStateBoost: 1.1, funds: 70, img: "images/bovino.jpg", stamina: 8, charisma: 1.2, debateSkill: 5, scandalResistance: 0.8,
        desc: "The hyper-polarizing face of the 2025/2026 mass deportation crackdowns. He maximizes the MAGA and working-class base but triggers historic, catastrophic opposition turnout.",
        buff: "Deportation Architect", debuff: "Electoral Toxicity",
        groupEffects: { noncollege: { support: 5, turnout: 9 }, rural: { support: 4, turnout: 7 }, hispanic: { support: -8, turnout: 9 }, suburban_college: { support: -9, turnout: 10 } }
    },
    {
        id: "youngkin", name: "Glenn Youngkin", party: "R", homeState: "VA", position: "Governor of Virginia",
        homeStateBoost: 2.1, funds: 85, img: "images/youngkin.jpg", stamina: 7, charisma: 1.3, debateSkill: 7, scandalResistance: 0.7,
        desc: "Projects a fleece-vest moderation that completely disarms suburban panic, but leaves the populist MAGA base utterly uninspired.",
        buff: "Suburban Restoration", debuff: "MAGA Skepticism",
        groupEffects: { suburban_conservative: { support: 7, turnout: 4 }, suburban_moderates: { support: 6, turnout: 2 }, noncollege: { support: -5, turnout: -6 } }
    },
    {
        id: "sununu", name: "Chris Sununu", party: "R", homeState: "NH", position: "Former Governor of New Hampshire",
        homeStateBoost: 2.0, funds: 55, img: "images/sununu.jpg", stamina: 8, charisma: 1.4, debateSkill: 8, scandalResistance: 0.8,
        desc: "A highly effective centrist communicator. Swing voters love him, but the religious and populist right will actively stay home.",
        buff: "New England Pragmatist", debuff: "Base Alienation",
        groupEffects: { independents: { support: 7, turnout: 2 }, suburban_moderates: { support: 7, turnout: 2 }, evangelical: { support: -7, turnout: -8 }, populist_right: { support: -6, turnout: -7 } }
    },
    {
        id: "trumpjr", name: "Don Trump Jr.", party: "R", homeState: "FL", position: "Businessman & Media Figure",
        homeStateBoost: 1.5, funds: 90, img: "images/trumpjr.jpg", stamina: 7, charisma: 1.4, debateSkill: 6, scandalResistance: 0.5,
        desc: "The ideological heir to the MAGA movement. He commands the populist base effortlessly but suffers from an immovable general-election ceiling.",
        buff: "MAGA Heir", debuff: "General-Election Ceiling",
        groupEffects: { noncollege: { support: 2, turnout: 5 }, rural: { support: 2, turnout: 4 }, suburban_college: { support: -7, turnout: 7 }, suburban_women: { support: -6, turnout: 6 } }
    },
    {
        id: "gabbard", name: "Tulsi Gabbard", party: "R", homeState: "HI", position: "Former U.S. Representative",
        homeStateBoost: 1.4, funds: 65, img: "images/gabbard.jpg", stamina: 8, charisma: 1.5, debateSkill: 8, scandalResistance: 0.6,
        desc: "A true wild-card candidate. Pulls in anti-establishment independents and veterans, but lacks trust from the traditional conservative institutional framework.",
        buff: "Anti-Establishment Magnet", debuff: "Partisan Mismatch",
        groupEffects: { independents: { support: 6, turnout: 4 }, veterans: { support: 5, turnout: 3 }, evangelical: { support: -5, turnout: -4 }, donor_conservative: { support: -4, turnout: -3 } }
    },
    {
        id: "kemp", name: "Brian Kemp", party: "R", homeState: "GA", position: "Governor of Georgia",
        homeStateBoost: 2.4, funds: 80, img: "images/kemp.jpg", stamina: 8, charisma: 1.2, debateSkill: 7, scandalResistance: 0.8,
        desc: "A highly competent Sun Belt executive. Shored up the conservative suburbs but continues to face lingering resentment from the hardest core of Trump loyalists.",
        buff: "Sun Belt Executor", debuff: "Trump Loyalist Grudge",
        groupEffects: { suburban_conservative: { support: 6, turnout: 3 }, rural: { support: 3, turnout: 0 }, populist_right: { support: -5, turnout: -4 } }
    },
    {
        id: "mace", name: "Nancy Mace", party: "R", homeState: "SC", position: "Former U.S. Representative",
        homeStateBoost: 1.5, funds: 60, img: "images/mace.jpg", stamina: 8, charisma: 1.3, debateSkill: 7, scandalResistance: 0.4,
        desc: "Highly visible in the media and capable of moderating on social issues, but her shifting alliances have created deep ideological whiplash.",
        buff: "Media Combatant", debuff: "Ideological Whiplash",
        groupEffects: { suburban_women: { support: 4, turnout: 2 }, suburban_moderates: { support: 4, turnout: 1 }, evangelical: { support: -4, turnout: -4 } }
    },
    {
        id: "cheney", name: "Liz Cheney", party: "R", homeState: "WY", position: "Former U.S. Representative",
        homeStateBoost: 1.2, funds: 85, img: "images/cheney.jpg", stamina: 8, charisma: 1.2, debateSkill: 8, scandalResistance: 0.8,
        desc: "The ultimate Never-Trump avatar. She flips the high-income suburbs entirely, but effectively destroys the Republican party by collapsing working-class turnout.",
        buff: "Institutional Martyr", debuff: "MAGA Excommunication",
        groupEffects: { suburban_college: { support: 9, turnout: 5 }, independents: { support: 5, turnout: 2 }, noncollege: { support: -10, turnout: -10 }, rural: { support: -9, turnout: -9 } }
    },

    // --- THIRD PARTIES (With Siphon Rates) ---
    {
        id: "walker", name: "Angela Nicole Walker", party: "G", homeState: "WI", position: "Activist",
        homeStateBoost: 1.1, funds: 5, img: "images/walker.jpg", stamina: 7, charisma: 1.1, debateSkill: 6, scandalResistance: 0.8,
        desc: "A prominent labor organizer who peels away disgruntled union and working-class Democrats.",
        buff: "Labor Groundgame", debuff: "Third-Party Ceiling",
        siphonFromMajorParties: { D: 0.05, R: 0.01 },
        groupEffects: { union: { support: 4, turnout: 2 }, black: { support: 3, turnout: 1 } }
    },
    {
        id: "ware", name: "Butch Ware", party: "G", homeState: "CA", position: "Academic & Activist",
        homeStateBoost: 1.1, funds: 6, img: "images/ware.jpg", stamina: 8, charisma: 1.3, debateSkill: 8, scandalResistance: 0.7,
        desc: "Highly effective communicator with younger, urban voters who feel abandoned by the mainstream Democratic establishment.",
        buff: "Academic Rhetoric", debuff: "Limited Resources",
        siphonFromMajorParties: { D: 0.06, R: 0.01 },
        groupEffects: { youth: { support: 5, turnout: 3 }, black: { support: 4, turnout: 2 } }
    },
    {
        id: "laduke", name: "Winona LaDuke", party: "G", homeState: "MN", position: "Environmentalist",
        homeStateBoost: 1.2, funds: 8, img: "images/laduke.jpg", stamina: 7, charisma: 1.2, debateSkill: 6, scandalResistance: 0.9,
        desc: "A renowned environmentalist. Acts as a significant spoiler for Democrats relying on the deep-green activist core.",
        buff: "Environmental Anchor", debuff: "Narrow Coalition",
        siphonFromMajorParties: { D: 0.05, R: 0.02 },
        groupEffects: { progressive_left: { support: 5, turnout: 3 }, rural: { support: 2, turnout: 1 } }
    },
    {
        id: "hoh", name: "Matthew Hoh", party: "G", homeState: "NC", position: "Anti-War Activist",
        homeStateBoost: 1.1, funds: 5, img: "images/hoh.jpg", stamina: 7, charisma: 1.1, debateSkill: 7, scandalResistance: 0.8,
        desc: "A veteran turned anti-war activist. Uniquely pulls disillusioned military members and anti-interventionists from both sides.",
        buff: "Anti-War Credibility", debuff: "Low Name ID",
        siphonFromMajorParties: { D: 0.04, R: 0.02 },
        groupEffects: { veterans: { support: 4, turnout: 2 }, progressive_left: { support: 3, turnout: 1 } }
    },
    {
        id: "hill", name: "Marc Lamont Hill", party: "G", homeState: "PA", position: "Academic & Media Personality",
        homeStateBoost: 1.2, funds: 10, img: "images/hill.jpg", stamina: 8, charisma: 1.5, debateSkill: 9, scandalResistance: 0.5,
        desc: "A brilliant media combatant who heavily threatens the Democratic baseline in critical urban centers.",
        buff: "Media Visibility", debuff: "Polarizing Rhetoric",
        siphonFromMajorParties: { D: 0.07, R: 0.01 },
        groupEffects: { black: { support: 5, turnout: 4 }, youth: { support: 6, turnout: 3 }, urban: { support: 4, turnout: 2 } }
    },
    {
        id: "amash", name: "Justin Amash", party: "L", homeState: "MI", position: "Former U.S. Representative",
        homeStateBoost: 1.2, funds: 15, img: "images/amash.jpg", stamina: 7, charisma: 1.2, debateSkill: 8, scandalResistance: 0.9,
        desc: "A highly principled constitutional conservative. Serves as a major release valve for Republicans who despise MAGA populism.",
        buff: "Principled Consistency", debuff: "Libertarian Ceiling",
        siphonFromMajorParties: { R: 0.06, D: 0.03 },
        groupEffects: { independents: { support: 6, turnout: 3 }, suburban_moderates: { support: 4, turnout: 2 } }
    }
].map(function (candidate) {
    // Ensure every candidate object has the core fields expected by game logic and UI,
    // while safely defaulting missing values from CANDIDATE_DEFAULTS.
    var normalized = Object.assign({}, CANDIDATE_DEFAULTS, candidate || {});
    normalized.groupEffects = _normalizeCandidateGroupEffects(normalized);
    normalized.groupBoosts = Object.assign({}, CANDIDATE_DEFAULTS.groupBoosts, normalized.groupBoosts || {});
    normalized.groupDebuffs = Object.assign({}, CANDIDATE_DEFAULTS.groupDebuffs, normalized.groupDebuffs || {});
    normalized.regionalSpillover = Array.isArray(normalized.regionalSpillover) ? normalized.regionalSpillover.slice() : [];
    normalized.homeStateBoost = Number(normalized.homeStateBoost);
    normalized.funds = Number(normalized.funds);
    normalized.stamina = Number(normalized.stamina);
    if (!normalized.img) normalized.img = CANDIDATE_DEFAULTS.img;
    if (!normalized.id) {
        console.warn('[Candidates] Missing id for candidate profile; applying fallback id "unknown".', candidate);
        normalized.id = "unknown";
    }
    if (!normalized.party) {
        console.warn('[Candidates] Missing party for candidate ' + normalized.id + '; defaulting to Independent.');
        normalized.party = "I";
    }
    if (!normalized.homeState) {
        console.warn('[Candidates] Missing homeState for candidate ' + normalized.id + '; defaulting to DC.');
        normalized.homeState = "DC";
    }
    return normalized;
});

// v2: Apply candidate-specific charisma, debateSkill, and scandalResistance
var CANDIDATE_V2_ATTRIBUTES = {
    harris: { charisma: 1.2, debateSkill: 7, scandalResistance: 0.5 },
    newsom: { charisma: 1.6, debateSkill: 8, scandalResistance: 0.3 },
    whitmer: { charisma: 1.3, debateSkill: 6, scandalResistance: 0.6 },
    buttigieg: { charisma: 1.4, debateSkill: 9, scandalResistance: 0.5 },
    aoc: { charisma: 1.8, debateSkill: 7, scandalResistance: 0.2 },
    kelly: { charisma: 0.9, debateSkill: 5, scandalResistance: 0.8 },
    khanna: { charisma: 1.0, debateSkill: 7, scandalResistance: 0.4 },
    emanuel: { charisma: 1.1, debateSkill: 7, scandalResistance: 0.2 },
    stewart: { charisma: 1.5, debateSkill: 8, scandalResistance: 0.4 },
    beshear: { charisma: 1.2, debateSkill: 6, scandalResistance: 0.7 },
    booker: { charisma: 1.5, debateSkill: 8, scandalResistance: 0.3 },
    trump: { charisma: 2.0, debateSkill: 6, scandalResistance: 0.9 },
    vance: { charisma: 1.3, debateSkill: 7, scandalResistance: 0.3 },
    desantis: { charisma: 0.8, debateSkill: 5, scandalResistance: 0.5 },
    cruz: { charisma: 0.7, debateSkill: 9, scandalResistance: 0.3 },
    paul: { charisma: 1.0, debateSkill: 8, scandalResistance: 0.6 },
    haley: { charisma: 1.3, debateSkill: 7, scandalResistance: 0.7 },
    ramaswamy: { charisma: 1.5, debateSkill: 8, scandalResistance: 0.2 },
    bannon: { charisma: 1.0, debateSkill: 5, scandalResistance: 0.1 },
    hawley: { charisma: 1.1, debateSkill: 7, scandalResistance: 0.4 },
    carlson: { charisma: 1.6, debateSkill: 7, scandalResistance: 0.2 },
    rubio: { charisma: 1.0, debateSkill: 6, scandalResistance: 0.5 },
    stein: { charisma: 0.8, debateSkill: 6, scandalResistance: 0.4 },
    oliver: { charisma: 0.9, debateSkill: 5, scandalResistance: 0.6 },
    massie: { charisma: 0.7, debateSkill: 5, scandalResistance: 0.5 },
    kennedy_rfk: { charisma: 1.5, debateSkill: 7, scandalResistance: 0.2 },
    bloomberg: { charisma: 0.6, debateSkill: 4, scandalResistance: 0.7 },
    delacruz: { charisma: 1.1, debateSkill: 6, scandalResistance: 0.5 },
    lariva: { charisma: 0.9, debateSkill: 5, scandalResistance: 0.5 },
    yang: { charisma: 1.3, debateSkill: 6, scandalResistance: 0.4 }
};
for (var ci = 0; ci < CANDIDATES.length; ci++) {
    var attrs = CANDIDATE_V2_ATTRIBUTES[CANDIDATES[ci].id];
    if (attrs) {
        if (attrs.charisma !== undefined) CANDIDATES[ci].charisma = attrs.charisma;
        if (attrs.debateSkill !== undefined) CANDIDATES[ci].debateSkill = attrs.debateSkill;
        if (attrs.scandalResistance !== undefined) CANDIDATES[ci].scandalResistance = attrs.scandalResistance;
    }
}

/* ---- RUNNING MATES ----
   Structured identically to CANDIDATES for flexibility.
   `state` is used by applyCandidateBuffs for home-state VP advantage.
   `homeState` added as alias for cross-compatibility. */
const VPS = [
    /* ===== DEMOCRATIC VPs ===== */
    {
        id: "shapiro", name: "Josh Shapiro", party: "D", state: "PA", homeState: "PA",
        funds: 15, img: "images/shapiro.jpg", stamina: 8,
        desc: "Governor of Pennsylvania. Brings critical Blue Wall structural advantages and moderate credibility.",
        groupBoosts: { suburban_moderates: 3, jewish: 4, moderate_dems: 2 },
        groupDebuffs: { progressive_left: -2, youth: -1 }
    },
    {
        id: "kelly_vp", name: "Mark Kelly", party: "D", state: "AZ", homeState: "AZ",
        position: "U.S. Senator from Arizona (2020-)",
        funds: 10, img: "images/kelly.jpg", stamina: 8,
        desc: "Arizona Senator. Offers border-state defensive capability and high floor with independents.",
        groupBoosts: { veterans: 4, suburban_moderates: 2, independents: 2 },
        groupDebuffs: { progressive_left: -1 }
    },
    {
        id: "warnock", name: "Raphael Warnock", party: "D", state: "GA", homeState: "GA",
        position: "U.S. Senator from Georgia (2021-)",
        funds: 12, img: "images/warnock.jpg", stamina: 8,
        desc: "Georgia Senator. Elite surrogate for turning out the Black church network in the Sun Belt.",
        groupBoosts: { black: 4, urban: 2 },
        groupDebuffs: { rural_whites: -1 }
    },
    {
        id: "pritzker", name: "JB Pritzker", party: "D", state: "IL", homeState: "IL",
        position: "Governor of Illinois (2019-)",
        funds: 25, img: "images/pritzker.jpg", stamina: 7,
        desc: "Illinois Governor. Provides a massive self-funded financial floor for the campaign.",
        groupBoosts: { union: 2, suburban_college: 2 },
        groupDebuffs: { rural: -1 }
    },
    {
        id: "whitmer_vp", name: "Gretchen Whitmer", party: "D", state: "MI", homeState: "MI",
        position: "Governor of Michigan (2019-)",
        funds: 15, img: "images/whitmer.jpg", stamina: 8,
        desc: "Michigan Governor. Locks down the Midwest and appeals strongly to suburban women.",
        groupBoosts: { suburban_women: 4, midwest_noncollege: 2, union: 2 },
        groupDebuffs: { rural: -1 }
    },
    {
        id: "khanna_vp", name: "Ro Khanna", party: "D", state: "CA", homeState: "CA",
        position: "U.S. Representative from California (2017-)",
        funds: 10, img: "images/khanna.jpg", stamina: 9,
        desc: "Silicon Valley progressive. Bridges the gap between tech donors and the online left.",
        groupBoosts: { tech: 4, youth: 3, progressive_left: 3 },
        groupDebuffs: { noncollege: -2 }
    },

    /* ===== REPUBLICAN VPs ===== */
    {
        id: "rubio", name: "Marco Rubio", party: "R", state: "FL", homeState: "FL",
        funds: 15, img: "images/rubio.jpg", stamina: 8,
        desc: "Secretary of State. Softens the ticket's edges with Hispanics and suburban moderates.",
        groupBoosts: { hispanic: 4, suburban_college: 2, donor_class: 3 },
        groupDebuffs: { hardcore_right: -1 }
    },
    {
        id: "scott_tim", name: "Tim Scott", party: "R", state: "SC", homeState: "SC",
        position: "U.S. Senator from South Carolina (2013-)",
        funds: 12, img: "images/scott.jpg", stamina: 7,
        desc: "South Carolina Senator. A high-energy, optimistic surrogate with deep evangelical ties.",
        groupBoosts: { evangelical: 3, suburban_conservative: 2 },
        groupDebuffs: {}
    },
    {
        id: "stefanik", name: "Elise Stefanik", party: "R", state: "NY", homeState: "NY",
        position: "U.S. Representative from New York (2015-)",
        funds: 10, img: "images/stefanik.jpg", stamina: 7,
        desc: "New York Congresswoman. A ruthless MAGA loyalist who plays well on cable news.",
        groupBoosts: { online_militant: 2, noncollege: 2 },
        groupDebuffs: { suburban_college: -2 }
    },
    {
        id: "noem", name: "Kristi Noem", party: "R", state: "SD", homeState: "SD",
        position: "Secretary of Homeland Security (2025-)",
        funds: 8, img: "images/noem.jpg", stamina: 7,
        desc: "South Dakota Governor. A base-play to energize the rural and evangelical wings.",
        groupBoosts: { rural: 3, evangelical: 2 },
        groupDebuffs: { suburban_moderates: -2 }
    },
    {
        id: "cruz_vp", name: "Ted Cruz", party: "R", state: "TX", homeState: "TX",
        position: "U.S. Senator from Texas (2013-)",
        funds: 15, img: "images/cruz.jpg", stamina: 8,
        desc: "Texas Senator. Unifies the constitutional conservative and evangelical flanks.",
        groupBoosts: { donor_conservative: 3, evangelical: 3 },
        groupDebuffs: { independents: -2 }
    },
    {
        id: "hawley_vp", name: "Josh Hawley", party: "R", state: "MO", homeState: "MO",
        position: "U.S. Senator from Missouri (2019-)",
        funds: 10, img: "images/hawley.jpg", stamina: 7,
        desc: "Missouri Senator. Reinforces the populist, working-class narrative of the ticket.",
        groupBoosts: { blue_collar: 3, noncollege: 2 },
        groupDebuffs: { donor_class: -2 }
    },

    /* ===== GREEN & LIBERTARIAN VPs ===== */
    {
        id: "ware", name: "Butch Ware", party: "G", state: "CA", homeState: "CA",
        position: "Environmental Activist & Academic",
        funds: 0, img: "images/ware.jpg", stamina: 7,
        desc: "Academic and activist. Secures the anti-war progressive flank.",
        groupBoosts: { antiwar_left: 3, progressive_left: 2 },
        groupDebuffs: {}
    },
    {
        id: "termaat", name: "Mike ter Maat", party: "L", state: "FL", homeState: "FL",
        position: "Libertarian Economist",
        funds: 0, img: "images/maat.jpg", stamina: 7,
        desc: "Economist. Appeals to fiscal conservatives and small business owners.",
        groupBoosts: { small_business: 2, libertarian: 2 },
        groupDebuffs: {}
    },

    /* ===== INDEPENDENT VPs ===== */
    {
        id: "kinzinger", name: "Adam Kinzinger", party: "I", state: "IL", homeState: "IL",
        position: "Former U.S. Representative from Illinois (2011-2023)",
        funds: 5, img: "images/kinzinger.jpg", stamina: 7,
        desc: "Former Republican Congressman. Pulls disaffected anti-Trump conservatives.",
        groupBoosts: { suburban_moderates: 2, veterans: 2, antiestablishment: 1 },
        groupDebuffs: { hardcore_right: -3 }
    },
    {
        id: "west_cornel", name: "Cornel West", party: "I", state: "MA", homeState: "MA",
        position: "Philosopher & Political Activist",
        funds: 5, img: "images/west.jpg", stamina: 6,
        desc: "Philosopher and activist. Gives an independent ticket deep progressive credibility.",
        groupBoosts: { black: 2, progressive_left: 3 },
        groupDebuffs: { suburban_moderates: -2 }
    },

    /* ===== PSL VPs ===== */
    {
        id: "freeman", name: "Sunil Freeman", party: "PSL", state: "PA", homeState: "PA",
        position: "Labor Organizer & PSL Activist",
        funds: 0, img: "images/freeman.jpg", stamina: 7,
        desc: "Activist and labor organizer.",
        groupBoosts: { labor_left: 2, urban: 1 },
        groupDebuffs: {}
    },
    {
        id: "lariva_vp", name: "Gloria La Riva", party: "PSL", state: "CA", homeState: "CA",
        position: "PSL General Secretary",
        funds: 0, img: "images/lariva.jpg", stamina: 7,
        desc: "PSL General Secretary. Anchors the ticket with institutional socialist credibility.",
        groupBoosts: { labor_left: 2, antiwar_left: 2 },
        groupDebuffs: {}
    }
].map(function (vp) {
    var normalized = Object.assign({}, CANDIDATE_DEFAULTS, vp || {});
    normalized.groupEffects = _normalizeCandidateGroupEffects(normalized);
    normalized.groupBoosts = Object.assign({}, normalized.groupBoosts || {});
    normalized.groupDebuffs = Object.assign({}, normalized.groupDebuffs || {});
    normalized.regionalSpillover = Array.isArray(normalized.regionalSpillover) ? normalized.regionalSpillover.slice() : [];
    normalized.homeStateBoost = Number(normalized.homeStateBoost);
    normalized.funds = Number(normalized.funds);
    normalized.stamina = Number(normalized.stamina);
    return normalized;
});

// v2: Apply VP-specific charisma, debateSkill, and scandalResistance
var VP_V2_ATTRIBUTES = {
    shapiro: { charisma: 1.3, debateSkill: 7, scandalResistance: 0.6 },
    kelly_vp: { charisma: 0.9, debateSkill: 5, scandalResistance: 0.8 },
    warnock: { charisma: 1.4, debateSkill: 7, scandalResistance: 0.5 },
    pritzker: { charisma: 0.8, debateSkill: 5, scandalResistance: 0.4 },
    whitmer_vp: { charisma: 1.3, debateSkill: 6, scandalResistance: 0.6 },
    khanna_vp: { charisma: 1.0, debateSkill: 7, scandalResistance: 0.4 },
    rubio: { charisma: 1.0, debateSkill: 6, scandalResistance: 0.5 },
    scott_tim: { charisma: 1.3, debateSkill: 6, scandalResistance: 0.6 },
    stefanik: { charisma: 1.1, debateSkill: 6, scandalResistance: 0.3 },
    noem: { charisma: 1.0, debateSkill: 5, scandalResistance: 0.3 },
    cruz_vp: { charisma: 0.7, debateSkill: 9, scandalResistance: 0.3 },
    hawley_vp: { charisma: 1.1, debateSkill: 7, scandalResistance: 0.4 },
    ware: { charisma: 0.8, debateSkill: 5, scandalResistance: 0.5 },
    termaat: { charisma: 0.7, debateSkill: 4, scandalResistance: 0.5 },
    kinzinger: { charisma: 1.1, debateSkill: 6, scandalResistance: 0.6 },
    west_cornel: { charisma: 1.4, debateSkill: 7, scandalResistance: 0.2 },
    freeman: { charisma: 0.9, debateSkill: 5, scandalResistance: 0.5 },
    lariva_vp: { charisma: 0.9, debateSkill: 5, scandalResistance: 0.5 }
};
for (var vi = 0; vi < VPS.length; vi++) {
    var vpAttrs = VP_V2_ATTRIBUTES[VPS[vi].id];
    if (vpAttrs) {
        if (vpAttrs.charisma !== undefined) VPS[vi].charisma = vpAttrs.charisma;
        if (vpAttrs.debateSkill !== undefined) VPS[vi].debateSkill = vpAttrs.debateSkill;
        if (vpAttrs.scandalResistance !== undefined) VPS[vi].scandalResistance = vpAttrs.scandalResistance;
    }
}
/* ---- CANDIDATE ISSUE POSITIONS (-10 = far left, +10 = far right) ---- */
const CANDIDATE_POSITIONS = {
    harris: {
        guns: -6, abortion: -7, healthcare: -5, immigration: -4, climate: -6,
        taxation: -4, trade: -2, minwage: -5, labor: -5, lgbtq: -7,
        criminal: -4, drugpricing: -6, energy: -5, foreign: -2, military: 0,
        israel: -1, govspend: -3, electionreform: -4, scotus: -5, economy: -3
    },
    newsom: {
        guns: -7, abortion: -7, healthcare: -6, immigration: -5, climate: -7,
        taxation: -5, trade: -2, minwage: -6, labor: -5, lgbtq: -7,
        criminal: -5, drugpricing: -6, energy: -6, foreign: -2, military: -1,
        israel: -2, govspend: -4, electionreform: -5, scotus: -6, economy: -4
    },
    whitmer: {
        guns: -4, abortion: -5, healthcare: -4, immigration: -3, climate: -4,
        taxation: -3, trade: -1, minwage: -4, labor: -4, lgbtq: -5,
        criminal: -3, drugpricing: -5, energy: -3, foreign: -1, military: 0,
        israel: -1, govspend: -2, electionreform: -3, scotus: -4, economy: -2
    },
    buttigieg: {
        guns: -5, abortion: -5, healthcare: -5, immigration: -4, climate: -5,
        taxation: -4, trade: -1, minwage: -4, labor: -4, lgbtq: -6,
        criminal: -4, drugpricing: -5, energy: -4, foreign: -2, military: 0,
        israel: -1, govspend: -3, electionreform: -4, scotus: -5, economy: -3
    },
    aoc: {
        guns: -7, abortion: -8, healthcare: -8, immigration: -6, climate: -9,
        taxation: -7, trade: -3, minwage: -7, labor: -7, lgbtq: -8,
        criminal: -6, drugpricing: -8, energy: -8, foreign: -3, military: -2,
        israel: -3, govspend: -6, electionreform: -6, scotus: -7, economy: -5
    },
    kelly: {
        guns: -3, abortion: -4, healthcare: -4, immigration: -2, climate: -3,
        taxation: -2, trade: -1, minwage: -3, labor: -3, lgbtq: -4,
        criminal: -2, drugpricing: -4, energy: -2, foreign: 0, military: 2,
        israel: 1, govspend: -2, electionreform: -3, scotus: -3, economy: -2
    },
    khanna: {
        guns: -6, abortion: -6, healthcare: -7, immigration: -5, climate: -8,
        taxation: -6, trade: -3, minwage: -6, labor: -7, lgbtq: -7,
        criminal: -5, drugpricing: -7, energy: -7, foreign: -3, military: -2,
        israel: -3, govspend: -5, electionreform: -5, scotus: -6, economy: -5
    },
    emanuel: {
        guns: -3, abortion: -4, healthcare: -3, immigration: -2, climate: -3,
        taxation: -2, trade: 0, minwage: -3, labor: -2, lgbtq: -3,
        criminal: -2, drugpricing: -3, energy: -2, foreign: -1, military: 1,
        israel: 2, govspend: -2, electionreform: -2, scotus: -3, economy: -1
    },
    stewart: {
        guns: -5, abortion: -5, healthcare: -6, immigration: -3, climate: -6,
        taxation: -4, trade: -2, minwage: -5, labor: -4, lgbtq: -6,
        criminal: -4, drugpricing: -6, energy: -5, foreign: -2, military: -1,
        israel: -2, govspend: -4, electionreform: -5, scotus: -5, economy: -3
    },
    beshear: {
        guns: -2, abortion: -3, healthcare: -3, immigration: -2, climate: -3,
        taxation: -2, trade: 0, minwage: -3, labor: -3, lgbtq: -3,
        criminal: -2, drugpricing: -3, energy: -2, foreign: -1, military: 1,
        israel: 0, govspend: -2, electionreform: -2, scotus: -3, economy: -1
    },
    booker: {
        guns: -5, abortion: -6, healthcare: -5, immigration: -4, climate: -5,
        taxation: -4, trade: -1, minwage: -5, labor: -5, lgbtq: -6,
        criminal: -5, drugpricing: -5, energy: -4, foreign: -2, military: 0,
        israel: -1, govspend: -3, electionreform: -5, scotus: -5, economy: -3
    },
    shapiro: {
        guns: -3, abortion: -4, healthcare: -4, immigration: -2, climate: -4,
        taxation: -3, trade: -1, minwage: -3, labor: -3, lgbtq: -4,
        criminal: -2, drugpricing: -4, energy: -3, foreign: -1, military: 1,
        israel: 2, govspend: -2, electionreform: -3, scotus: -4, economy: -2
    },
    trump: {
        guns: 7, abortion: 6, healthcare: 6, immigration: 9, climate: 5,
        taxation: 7, trade: 6, minwage: 4, labor: 3, lgbtq: 5,
        criminal: 7, drugpricing: 2, energy: 8, foreign: 4, military: 6,
        israel: 7, govspend: 5, electionreform: 3, scotus: 8, economy: 5
    },
    vance: {
        guns: 6, abortion: 7, healthcare: 5, immigration: 7, climate: 4,
        taxation: 5, trade: 4, minwage: 4, labor: 3, lgbtq: 4,
        criminal: 5, drugpricing: 1, energy: 5, foreign: 3, military: 4,
        israel: 4, govspend: 5, electionreform: 1, scotus: 6, economy: 4
    },
    desantis: {
        guns: 7, abortion: 7, healthcare: 6, immigration: 7, climate: 5,
        taxation: 6, trade: 3, minwage: 5, labor: 4, lgbtq: 5,
        criminal: 6, drugpricing: 2, energy: 6, foreign: 3, military: 5,
        israel: 4, govspend: 6, electionreform: 2, scotus: 6, economy: 4
    },
    cruz: {
        guns: 8, abortion: 8, healthcare: 7, immigration: 8, climate: 5,
        taxation: 7, trade: 4, minwage: 5, labor: 3, lgbtq: 5,
        criminal: 6, drugpricing: 2, energy: 7, foreign: 4, military: 6,
        israel: 6, govspend: 7, electionreform: 1, scotus: 7, economy: 5
    },
    paul: {
        guns: 6, abortion: 4, healthcare: 8, immigration: 5, climate: 3,
        taxation: 9, trade: 3, minwage: 8, labor: 5, lgbtq: 2,
        criminal: 3, drugpricing: 6, energy: 5, foreign: -3, military: -4,
        israel: 2, govspend: 9, electionreform: -2, scotus: 4, economy: 7
    },
    haley: {
        guns: 4, abortion: 5, healthcare: 4, immigration: 5, climate: 2,
        taxation: 5, trade: 2, minwage: 3, labor: 2, lgbtq: 2,
        criminal: 4, drugpricing: 1, energy: 3, foreign: 3, military: 5,
        israel: 5, govspend: 4, electionreform: 1, scotus: 4, economy: 3
    },
    ramaswamy: {
        guns: 5, abortion: 6, healthcare: 6, immigration: 6, climate: 4,
        taxation: 7, trade: 3, minwage: 5, labor: 3, lgbtq: 3,
        criminal: 5, drugpricing: 3, energy: 5, foreign: 2, military: 3,
        israel: 3, govspend: 6, electionreform: 2, scotus: 5, economy: 5
    },
    bannon: {
        guns: 8, abortion: 7, healthcare: 4, immigration: 9, climate: 5,
        taxation: 5, trade: 7, minwage: 3, labor: 4, lgbtq: 6,
        criminal: 7, drugpricing: 2, energy: 7, foreign: 5, military: 6,
        israel: 5, govspend: 4, electionreform: 2, scotus: 7, economy: 4
    },
    hawley: {
        guns: 7, abortion: 7, healthcare: 5, immigration: 7, climate: 4,
        taxation: 5, trade: 5, minwage: 3, labor: 4, lgbtq: 5,
        criminal: 6, drugpricing: 2, energy: 6, foreign: 3, military: 5,
        israel: 4, govspend: 5, electionreform: 1, scotus: 6, economy: 4
    },
    carlson: {
        guns: 7, abortion: 6, healthcare: 4, immigration: 8, climate: 4,
        taxation: 5, trade: 6, minwage: 3, labor: 4, lgbtq: 6,
        criminal: 7, drugpricing: 2, energy: 7, foreign: 4, military: 4,
        israel: 3, govspend: 4, electionreform: 2, scotus: 6, economy: 4
    },
    rubio: {
        guns: 5, abortion: 6, healthcare: 5, immigration: 6, climate: 2,
        taxation: 6, trade: 3, minwage: 3, labor: 2, lgbtq: 3,
        criminal: 4, drugpricing: 1, energy: 4, foreign: 6, military: 7,
        israel: 7, govspend: 4, electionreform: 1, scotus: 5, economy: 4
    },
    stein: {
        guns: -6, abortion: -7, healthcare: -8, immigration: -5, climate: -10,
        taxation: -6, trade: -4, minwage: -7, labor: -7, lgbtq: -7,
        criminal: -6, drugpricing: -8, energy: -9, foreign: -4, military: -5,
        israel: -4, govspend: -5, electionreform: -6, scotus: -6, economy: -5
    },
    oliver: {
        guns: 8, abortion: -2, healthcare: 7, immigration: 3, climate: 3,
        taxation: 9, trade: 6, minwage: 6, labor: 5, lgbtq: -3,
        criminal: 4, drugpricing: 5, energy: 4, foreign: -2, military: -3,
        israel: 0, govspend: 8, electionreform: -4, scotus: -1, economy: 6
    },
    yang: {
        guns: -2, abortion: -3, healthcare: -4, immigration: -2, climate: -4,
        taxation: -2, trade: -1, minwage: -3, labor: -2, lgbtq: -4,
        criminal: -2, drugpricing: -4, energy: -3, foreign: -1, military: -1,
        israel: 0, govspend: -1, electionreform: -5, scotus: -2, economy: -2
    },
    massie: {
        guns: 8, abortion: 3, healthcare: 6, immigration: 5, climate: 5,
        taxation: 8, trade: 4, minwage: 4, labor: 5, lgbtq: 1,
        criminal: 5, drugpricing: 3, energy: 6, foreign: -1, military: 1,
        israel: 0, govspend: 8, electionreform: -2, scotus: 4, economy: 5
    },
    kennedy_rfk: {
        guns: -1, abortion: -2, healthcare: -5, immigration: 1, climate: -5,
        taxation: -1, trade: -1, minwage: -2, labor: -1, lgbtq: -2,
        criminal: -1, drugpricing: -7, energy: -3, foreign: -1, military: -2,
        israel: 0, govspend: -2, electionreform: -3, scotus: -1, economy: -1
    },
    bloomberg: {
        guns: -4, abortion: -4, healthcare: -3, immigration: -2, climate: -4,
        taxation: -1, trade: 0, minwage: -2, labor: -1, lgbtq: -3,
        criminal: 2, drugpricing: -3, energy: -2, foreign: 0, military: 1,
        israel: 2, govspend: -2, electionreform: -3, scotus: -2, economy: 1
    },
    delacruz: {
        guns: -7, abortion: -9, healthcare: -10, immigration: -8, climate: -10,
        taxation: -9, trade: -6, minwage: -9, labor: -9, lgbtq: -9,
        criminal: -8, drugpricing: -10, energy: -10, foreign: -7, military: -9,
        israel: -8, govspend: -8, electionreform: -7, scotus: -8, economy: -7
    },
    lariva: {
        guns: -7, abortion: -9, healthcare: -10, immigration: -8, climate: -10,
        taxation: -9, trade: -6, minwage: -9, labor: -9, lgbtq: -9,
        criminal: -8, drugpricing: -10, energy: -10, foreign: -7, military: -9,
        israel: -8, govspend: -8, electionreform: -7, scotus: -8, economy: -7
    },
    walz: { guns: -4, abortion: -7, healthcare: -6, immigration: -3, climate: -5, taxation: -4, trade: -2, minwage: -6, labor: -8, lgbtq: -6, criminal: -3, drugpricing: -7, energy: -4, foreign: -2, military: 0, israel: 2, govspend: -4, electionreform: -5, scotus: -5, economy: -3 },
    crockett: { guns: -8, abortion: -9, healthcare: -8, immigration: -6, climate: -7, taxation: -7, trade: -3, minwage: -8, labor: -7, lgbtq: -8, criminal: -7, drugpricing: -8, energy: -6, foreign: -4, military: -3, israel: -5, govspend: -6, electionreform: -8, scotus: -8, economy: -6 },
    ossoff: { guns: -5, abortion: -6, healthcare: -5, immigration: -2, climate: -6, taxation: -3, trade: 1, minwage: -4, labor: -4, lgbtq: -5, criminal: -2, drugpricing: -6, energy: -3, foreign: -1, military: 1, israel: 4, govspend: -3, electionreform: -6, scotus: -4, economy: -2 },
    gallego: { guns: -6, abortion: -7, healthcare: -6, immigration: -3, climate: -5, taxation: -4, trade: -1, minwage: -6, labor: -7, lgbtq: -6, criminal: -3, drugpricing: -7, energy: -4, foreign: -1, military: 3, israel: 3, govspend: -4, electionreform: -5, scotus: -5, economy: -4 },
    moore: { guns: -6, abortion: -7, healthcare: -5, immigration: -3, climate: -6, taxation: -4, trade: 0, minwage: -5, labor: -5, lgbtq: -6, criminal: -4, drugpricing: -6, energy: -4, foreign: 0, military: 2, israel: 2, govspend: -3, electionreform: -5, scotus: -5, economy: -3 },
    cuban: { guns: -2, abortion: -4, healthcare: -2, immigration: 0, climate: -3, taxation: 1, trade: 4, minwage: -1, labor: -1, lgbtq: -4, criminal: -1, drugpricing: -8, energy: 0, foreign: 1, military: 2, israel: 3, govspend: -1, electionreform: -2, scotus: -2, economy: 2 },
    talarico: { guns: -7, abortion: -8, healthcare: -8, immigration: -5, climate: -8, taxation: -6, trade: -2, minwage: -8, labor: -7, lgbtq: -8, criminal: -6, drugpricing: -8, energy: -7, foreign: -3, military: -2, israel: -4, govspend: -5, electionreform: -7, scotus: -6, economy: -5 },
    bovino: { guns: 8, abortion: 7, healthcare: 5, immigration: 10, climate: 6, taxation: 4, trade: 6, minwage: 4, labor: 5, lgbtq: 6, criminal: 9, drugpricing: 2, energy: 7, foreign: 5, military: 8, israel: 6, govspend: 5, electionreform: 7, scotus: 8, economy: 5 },
    youngkin: { guns: 5, abortion: 4, healthcare: 4, immigration: 3, climate: 2, taxation: 6, trade: 4, minwage: 3, labor: 4, lgbtq: 3, criminal: 5, drugpricing: 1, energy: 3, foreign: 4, military: 5, israel: 6, govspend: 6, electionreform: 4, scotus: 5, economy: 6 },
    sununu: { guns: 4, abortion: 1, healthcare: 3, immigration: 2, climate: 1, taxation: 5, trade: 3, minwage: 2, labor: 2, lgbtq: 0, criminal: 3, drugpricing: 1, energy: 2, foreign: 3, military: 4, israel: 5, govspend: 5, electionreform: 2, scotus: 3, economy: 5 },
    trumpjr: { guns: 9, abortion: 8, healthcare: 6, immigration: 9, climate: 8, taxation: 6, trade: 8, minwage: 5, labor: 4, lgbtq: 7, criminal: 8, drugpricing: 3, energy: 9, foreign: 7, military: 7, israel: 7, govspend: 6, electionreform: 9, scotus: 8, economy: 6 },
    gabbard: { guns: 3, abortion: -1, healthcare: -2, immigration: 6, climate: 1, taxation: 2, trade: 4, minwage: -2, labor: -1, lgbtq: 4, criminal: 3, drugpricing: -4, energy: 3, foreign: -8, military: 4, israel: -2, govspend: 2, electionreform: -3, scotus: 2, economy: 1 },
    kemp: { guns: 7, abortion: 7, healthcare: 6, immigration: 6, climate: 4, taxation: 7, trade: 3, minwage: 5, labor: 6, lgbtq: 5, criminal: 7, drugpricing: 2, energy: 5, foreign: 5, military: 6, israel: 7, govspend: 6, electionreform: 8, scotus: 7, economy: 7 },
    mace: { guns: 5, abortion: 1, healthcare: 3, immigration: 4, climate: 2, taxation: 5, trade: 3, minwage: 2, labor: 3, lgbtq: 2, criminal: 4, drugpricing: 1, energy: 3, foreign: 4, military: 5, israel: 6, govspend: 5, electionreform: 3, scotus: 4, economy: 5 },
    cheney: { guns: 7, abortion: 6, healthcare: 5, immigration: 4, climate: 3, taxation: 7, trade: 1, minwage: 4, labor: 5, lgbtq: 2, criminal: 6, drugpricing: 2, energy: 6, foreign: 9, military: 9, israel: 9, govspend: 6, electionreform: -6, scotus: 7, economy: 6 },
    walker: { guns: -6, abortion: -9, healthcare: -10, immigration: -8, climate: -9, taxation: -9, trade: -6, minwage: -10, labor: -10, lgbtq: -9, criminal: -8, drugpricing: -10, energy: -9, foreign: -7, military: -8, israel: -9, govspend: -8, electionreform: -9, scotus: -8, economy: -8 },
    ware: { guns: -7, abortion: -9, healthcare: -10, immigration: -8, climate: -9, taxation: -8, trade: -5, minwage: -9, labor: -9, lgbtq: -9, criminal: -9, drugpricing: -9, energy: -8, foreign: -8, military: -8, israel: -10, govspend: -7, electionreform: -9, scotus: -8, economy: -8 },
    laduke: { guns: -5, abortion: -8, healthcare: -9, immigration: -6, climate: -10, taxation: -7, trade: -4, minwage: -8, labor: -8, lgbtq: -8, criminal: -6, drugpricing: -8, energy: -10, foreign: -6, military: -7, israel: -7, govspend: -6, electionreform: -8, scotus: -7, economy: -7 },
    hoh: { guns: -4, abortion: -7, healthcare: -8, immigration: -5, climate: -7, taxation: -6, trade: -2, minwage: -7, labor: -6, lgbtq: -7, criminal: -5, drugpricing: -7, energy: -6, foreign: -10, military: -10, israel: -9, govspend: -8, electionreform: -7, scotus: -6, economy: -6 },
    hill: { guns: -8, abortion: -9, healthcare: -10, immigration: -8, climate: -8, taxation: -8, trade: -6, minwage: -9, labor: -9, lgbtq: -9, criminal: -9, drugpricing: -9, energy: -7, foreign: -8, military: -7, israel: -10, govspend: -7, electionreform: -8, scotus: -8, economy: -8 },
    amash: { guns: 9, abortion: 4, healthcare: 7, immigration: 1, climate: 6, taxation: 9, trade: -8, minwage: 8, labor: 7, lgbtq: 0, criminal: 0, drugpricing: 6, energy: 7, foreign: -9, military: -6, israel: -4, govspend: 10, electionreform: 0, scotus: 6, economy: 8 }
};
