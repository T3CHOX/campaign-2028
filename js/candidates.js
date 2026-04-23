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
    groupBoosts: {},
    groupDebuffs: {},
    regionalSpillover: [],
    regionalSpilloverBoost: 0
};

const CANDIDATES = [
    {
        id: "harris",
        name: "Kamala Harris",
        party: "D",
        homeState: "CA",
        homeStateBoost: 2.3,
        funds: 86,
        img: "images/harris.jpg",
        stamina: 7,
        desc: "Harris enters the 2028 cycle with national name ID, a large donor network, and the burden of having already lost a presidential race. Her lane is still the same: maximize turnout in blue metros, hold suburban college-educated women, and avoid a collapse with noncollege voters in the Midwest. She is a proven fundraising magnet, but the party will not treat her as inevitable if the polling shows repeated ceiling problems in the Great Lakes and Sun Belt exurbs.",
        buff: "Donor Magnet",
        debuff: "General-Election Ceiling",
        groupBoosts: { black: 9, asian: 7, suburban_college: 7 },
        groupDebuffs: { noncollege: -4, rural: -5 },
        regionalSpillover: [ "NV", "AZ" ],
        regionalSpilloverBoost: 1,
    },
    {
        id: "newsom",
        name: "Gavin Newsom",
        party: "D",
        homeState: "CA",
        homeStateBoost: 2,
        funds: 84,
        img: "images/newsom.jpg",
        stamina: 8,
        desc: "Newsom is the clearest elite-alternative Democrat: fluent on camera, aggressive on Trump, and backed by the kind of money that wants a confident national fighter. His problem is that the same profile that plays in California and coastal donor circles can harden resistance in the industrial Midwest and the exurbs. If he can translate California-style organizing into a broader anti-Trump coalition, he becomes dangerous; if not, he remains a regionalized national brand.",
        buff: "Media Combatant",
        debuff: "Heartland Liability",
        groupBoosts: { urban: 8, tech: 8, lgbtq: 7 },
        groupDebuffs: { rural: -6, evangelical: -5 },
        regionalSpillover: [ "NV", "OR" ],
        regionalSpilloverBoost: 0.9,
    },
    {
        id: "whitmer",
        name: "Gretchen Whitmer",
        party: "D",
        homeState: "MI",
        homeStateBoost: 3.1,
        funds: 77,
        img: "images/whitmer.jpg",
        stamina: 8,
        desc: "Whitmer is built for the kind of map Democrats need: she can talk to union households, suburban women, and persuadable Midwestern voters without sounding like she came off a cable panel. Her value is not ideological purity; it is that she can defend Michigan and force Republicans to spend money where they want to win cheaply. If the race is about preventing Trump-era margins from widening in the Blue Wall, she is one of the few candidates who can credibly do it.",
        buff: "Blue Wall Anchor",
        debuff: "Low-Voltage Base",
        groupBoosts: { union: 8, suburban_women: 8, midwest_noncollege: 6 },
        groupDebuffs: { progressive_left: -3, rural: -4 },
        regionalSpillover: [ "WI", "PA" ],
        regionalSpilloverBoost: 1.5,
    },
    {
        id: "buttigieg",
        name: "Pete Buttigieg",
        party: "D",
        homeState: "IN",
        homeStateBoost: 1.4,
        funds: 73,
        img: "images/buttigieg.jpg",
        stamina: 8,
        desc: "Buttigieg has discipline, message control, and the kind of fundraising network that keeps him in the top tier. He is strongest with highly educated voters, especially suburban and professional classes, and his weakness is obvious: he has to overperform in exactly the places where Democrats have been slipping with working-class voters. His best case is a clean, technocratic contrast to Republican chaos; his worst case is looking like an overqualified consultant in a fight that rewards raw coalition energy.",
        buff: "Suburban Precision",
        debuff: "Working-Class Gap",
        groupBoosts: { suburban_college: 8, lgbtq: 9, urban: 7 },
        groupDebuffs: { rural: -6, noncollege: -4 },
        regionalSpillover: [ "MI", "OH" ],
        regionalSpilloverBoost: 0.8,
    },
    {
        id: "aoc",
        name: "Alexandria Ocasio-Cortez",
        party: "D",
        homeState: "NY",
        homeStateBoost: 1.6,
        funds: 70,
        img: "images/aoc.jpg",
        stamina: 9,
        desc: "Ocasio-Cortez is the purest turnout candidate in the field: unmatched social reach, strong youth intensity, and the ability to generate free media every time she opens her mouth. She can build a large small-dollar machine fast, but she also triggers the sharpest right-wing response and gives moderates an easy socialist frame. If Democrats want maximal enthusiasm in deep-blue metros and among younger voters, she is elite; if they want a low-drama general-election nominee, she is a problem.",
        buff: "Youth Engine",
        debuff: "Swing Voter Repellent",
        groupBoosts: { youth: 10, hispanic: 9, progressive_left: 9 },
        groupDebuffs: { noncollege: -6, evangelical: -7 },
        regionalSpillover: [ "NJ", "CT" ],
        regionalSpilloverBoost: 0.8,
    },
    {
        id: "kelly",
        name: "Mark Kelly",
        party: "D",
        homeState: "AZ",
        homeStateBoost: 2.8,
        funds: 67,
        img: "images/kelly.jpg",
        stamina: 7,
        desc: "Kelly has one of the cleanest resumes for a swing-state Democrat: veteran, astronaut, senator, and winner in Arizona. His pitch is competence, restraint, and a calm contrast with Trump-style politics, which plays well with suburban moderates and national-security voters. He does not electrify the left, but he can hold enough of the center to make Arizona the foundation of a viable Sun Belt path.",
        buff: "Sun Belt Credibility",
        debuff: "Muted Fire",
        groupBoosts: { veterans: 8, suburban_moderates: 7, latino: 6 },
        groupDebuffs: { progressive_left: -3, evangelical: -4 },
        regionalSpillover: [ "NV", "CO" ],
        regionalSpilloverBoost: 1.2,
    },
    {
        id: "khanna",
        name: "Ro Khanna",
        party: "D",
        homeState: "CA",
        homeStateBoost: 1.4,
        funds: 61,
        img: "images/scenario.jpg",
        stamina: 8,
        desc: "Khanna is the policy-heavy candidate trying to fuse progressive economics with Silicon Valley credibility. He can raise money from tech and online networks, but he has to prove he is more than a west-coast theory candidate if he wants to matter in the Great Lakes. His upside is an argument that sounds economically sharper than the average Democrat; his downside is that many voters will still file him under coastal technocrat.",
        buff: "Tech-Left Blend",
        debuff: "Rust Belt Doubt",
        groupBoosts: { tech: 9, asian: 7, progressive_left: 8 },
        groupDebuffs: { rural: -5, noncollege: -4 },
        regionalSpillover: [ "NV", "WA" ],
        regionalSpilloverBoost: 0.7,
    },
    {
        id: "emanuel",
        name: "Rahm Emanuel",
        party: "D",
        homeState: "IL",
        homeStateBoost: 1.7,
        funds: 64,
        img: "images/scenario.jpg",
        stamina: 6,
        desc: "Emanuel is the hard-knuckle institutionalist in the field: experienced, intimidating, and deeply connected to money and power. He would have no trouble attracting business donors and establishment support, but his own style is a tax on enthusiasm, especially among younger activists and progressive organizers. If the race rewards competence and toughness over inspiration, he becomes relevant; if not, he is a machine candidate in an anti-machine era.",
        buff: "Institutional Muscle",
        debuff: "Base Friction",
        groupBoosts: { suburban_moderates: 7, business_community: 8, jewish: 6 },
        groupDebuffs: { progressive_left: -7, youth: -4 },
        regionalSpillover: [ "WI", "MI" ],
        regionalSpilloverBoost: 1,
    },
    {
        id: "stewart",
        name: "Jon Stewart",
        party: "D",
        homeState: "NJ",
        homeStateBoost: 1.4,
        funds: 48,
        img: "images/scenario.jpg",
        stamina: 6,
        desc: "Stewart would enter politics as a high-recognition outsider with enormous media leverage and almost no governing track record. That makes him useful as a vehicle for anti-establishment energy, but risky for donors who want someone who can survive a 17-state campaign without turning every week into a comedy bit. He can excite disaffected younger and online voters, yet the absence of executive experience would be his first and last attack line.",
        buff: "Media Reach",
        debuff: "No Governing Record",
        groupBoosts: { youth: 8, media_consumers: 9, progressive_left: 6 },
        groupDebuffs: { institutional_dems: -4, high_info_swing: -3 },
        regionalSpillover: [ "NY", "PA" ],
        regionalSpilloverBoost: 1,
    },
    {
        id: "beshear",
        name: "Andy Beshear",
        party: "D",
        homeState: "KY",
        homeStateBoost: 2.4,
        funds: 56,
        img: "images/scenario.jpg",
        stamina: 8,
        desc: "Beshear is the moderate Democrat who can still speak to red-state voters without sounding like he is begging for permission. That matters because Democrats need some evidence they can win back voters outside the coasts, not just maximize margins in metro areas. He has a real story in Kentucky, but his national ceiling depends on whether voters believe his style can travel beyond one unusually favorable personal brand.",
        buff: "Red-State Crossover",
        debuff: "National Ceiling",
        groupBoosts: { rural_whites: 7, union: 6, moderate_dems: 8 },
        groupDebuffs: { progressive_left: -4, youth: -3 },
        regionalSpillover: [ "OH", "WV" ],
        regionalSpilloverBoost: 1.1,
    },
    {
        id: "booker",
        name: "Cory Booker",
        party: "D",
        homeState: "NJ",
        homeStateBoost: 1.9,
        funds: 60,
        img: "images/scenario.jpg",
        stamina: 7,
        desc: "Booker has the biography, the rhetorical range, and the ability to speak fluently to urban Black voters, suburban professionals, and moralistic liberals. The challenge is that he has often read as more inspirational than operational, and campaign cycles punish that distinction when the floor starts dropping in working-class counties. He can build a broad coalition, but he still has to prove that coalition can survive contact with the Midwest map.",
        buff: "Urban Coalition",
        debuff: "Execution Questions",
        groupBoosts: { black: 8, urban: 8, suburban_moderates: 6 },
        groupDebuffs: { noncollege: -3, progressive_left: -3 },
        regionalSpillover: [ "NY", "PA" ],
        regionalSpilloverBoost: 1,
    },
    {
        id: "shapiro",
        name: "Josh Shapiro",
        party: "D",
        homeState: "PA",
        homeStateBoost: 3.4,
        funds: 69,
        img: "images/shapiro.jpg",
        stamina: 8,
        desc: "Shapiro is the most straightforward Blue Wall candidate in the field because Pennsylvania is both his home base and his proof of concept. He has the executive profile, the state-level governing record, and the kind of moderate tone that can hold suburban voters without fully alienating the left. If Democrats want a candidate who starts with the map instead of the brand, he is one of the strongest options.",
        buff: "Keystone Anchor",
        debuff: "Soft National Brand",
        groupBoosts: { suburban_college: 8, jewish: 7, moderate_dems: 7 },
        groupDebuffs: { youth: -3, progressive_left: -3 },
        regionalSpillover: [ "MI", "WI" ],
        regionalSpilloverBoost: 1.5,
    },
    {
        id: "trump",
        name: "Donald Trump",
        party: "R",
        homeState: "FL",
        homeStateBoost: 1.8,
        funds: 90,
        img: "images/scenario.jpg",
        stamina: 6,
        desc: "Trump is the sitting political gravity well: he dominates the party, sets the tone, and still forces every other Republican to define themselves against him. By the 2028 cycle, the issue is less persuasion than maintenance—protect the margins with noncollege whites, keep rural enthusiasm high, and avoid erosion in suburban counties that have already moved against him. He has the strongest base machine in the field, but age, fatigue, and saturation mean the operation depends on turnout more than expansion.",
        buff: "Base Dominance",
        debuff: "Fatigue Ceiling",
        groupBoosts: { noncollege: 10, evangelical: 10, rural: 10 },
        groupDebuffs: { suburban_college: -7, youth: -6 },
        regionalSpillover: [ "PA", "OH" ],
        regionalSpilloverBoost: 1.5,
    },
    {
        id: "vance",
        name: "JD Vance",
        party: "R",
        homeState: "OH",
        homeStateBoost: 2.4,
        funds: 78,
        img: "images/vance.jpg",
        stamina: 8,
        desc: "Vance is the heir apparent type: younger than the rest, fluent in the grievance politics of the post-2016 GOP, and positioned to inherit Trump’s coalition if the transition is managed cleanly. His challenge is that being the logical successor is not the same as being universally liked, especially with donors and suburban voters who want the Trump coalition without the chaos. If he can keep the Rust Belt edge while not collapsing in Sun Belt suburbs, he becomes a very serious 2028 front-runner.",
        buff: "Succession Candidate",
        debuff: "Trust Deficit",
        groupBoosts: { noncollege: 9, evangelical: 8, rural: 9 },
        groupDebuffs: { suburban_college: -5, youth: -4 },
        regionalSpillover: [ "PA", "MI" ],
        regionalSpilloverBoost: 1.3,
    },
    {
        id: "desantis",
        name: "Ron DeSantis",
        party: "R",
        homeState: "FL",
        homeStateBoost: 2.6,
        funds: 72,
        img: "images/desantis.jpg",
        stamina: 8,
        desc: "DeSantis remains the most obvious anti-Trump Republican with a governing record and a national donor address book. His problem is that he never fully solved the Trump authenticity test, and every cycle since his peak has reinforced the sense that he is more methodical than magnetic. He can raise real money and appeal to hard-line culture voters, but he has to stop bleeding credibility with rank-and-file Republicans before he can be treated as a true top-tier contender.",
        buff: "Culture Warrior",
        debuff: "Momentum Loss",
        groupBoosts: { evangelical: 8, suburban_conservative: 7, noncollege: 7 },
        groupDebuffs: { youth: -5, college_liberals: -6 },
        regionalSpillover: [ "GA", "NC" ],
        regionalSpilloverBoost: 1,
    },
    {
        id: "cruz",
        name: "Ted Cruz",
        party: "R",
        homeState: "TX",
        homeStateBoost: 2.2,
        funds: 70,
        img: "images/scenario.jpg",
        stamina: 7,
        desc: "Cruz is a high-end ideological operator with real fundraising ability and a hard-core conservative base. He is excellent at alienating people who already dislike him, but in the modern GOP that can still be a feature if the primary electorate wants combat over comfort. His ceiling in a general election is clear: suburban voters, moderates, and many independents see him as pure conflict with no off-ramp.",
        buff: "Primary Knife Fighter",
        debuff: "General-Election Baggage",
        groupBoosts: { evangelical: 9, noncollege: 8, donor_conservative: 8 },
        groupDebuffs: { suburban_college: -7, latino: -3 },
        regionalSpillover: [ "OK", "LA" ],
        regionalSpilloverBoost: 0.9,
    },
    {
        id: "paul",
        name: "Rand Paul",
        party: "R",
        homeState: "KY",
        homeStateBoost: 2,
        funds: 55,
        img: "images/scenario.jpg",
        stamina: 7,
        desc: "Paul is the libertarian lane inside the GOP: anti-war, anti-spending, anti-establishment, and deeply appealing to a slice of donors and online conservatives who want less culture-war machinery. That niche is real, but it is too narrow to dominate a presidential primary unless the field fractures. He can survive by being the dissenting voice, not by building the broadest coalition.",
        buff: "Libertarian Lane",
        debuff: "Narrow Coalition",
        groupBoosts: { libertarian: 9, tech_conservative: 6, donor_antiestablishment: 7 },
        groupDebuffs: { evangelical: -4, national_security_hawks: -5 },
        regionalSpillover: [ "TN", "IN" ],
        regionalSpilloverBoost: 0.7,
    },
    {
        id: "haley",
        name: "Nikki Haley",
        party: "R",
        homeState: "SC",
        homeStateBoost: 2.4,
        funds: 76,
        img: "images/haley.jpg",
        stamina: 8,
        desc: "Haley is the most credible Republican answer to voters who want the party without the baggage. She can speak to donors, suburban moderates, and voters uneasy about Trump’s style, but she pays a heavy price with the MAGA base whenever she sounds insufficiently loyal. If the GOP wants to broaden its coalition, she is the natural vehicle; if it wants to remain fully Trump-defined, she is an intraparty problem.",
        buff: "Suburban Alternative",
        debuff: "MAGA Suspicion",
        groupBoosts: { suburban_college: 8, donor_class: 8, women: 7 },
        groupDebuffs: { evangelical: -4, noncollege: -3 },
        regionalSpillover: [ "NC", "GA" ],
        regionalSpilloverBoost: 1.2,
    },
    {
        id: "ramaswamy",
        name: "Vivek Ramaswamy",
        party: "R",
        homeState: "OH",
        homeStateBoost: 1.8,
        funds: 68,
        img: "images/ramaswamy.jpg",
        stamina: 9,
        desc: "Ramaswamy is the pure disruption candidate: young, fluent on media, and built for attention economics. He can raise money from anti-establishment donors and generate volume online, but he still has to prove that he can survive a real primary electorate rather than just dominate clips. His upside is obvious as a fresh face; his downside is that many Republicans may eventually decide he sounds more like a pitch deck than a president.",
        buff: "Disruption Machine",
        debuff: "Experience Gap",
        groupBoosts: { youth: 8, tech: 8, antiestablishment: 9 },
        groupDebuffs: { evangelical: -3, suburban_college: -4 },
        regionalSpillover: [ "MI", "PA" ],
        regionalSpilloverBoost: 1,
    },
    {
        id: "bannon",
        name: "Steve Bannon",
        party: "R",
        homeState: "NY",
        homeStateBoost: 1.2,
        funds: 40,
        img: "images/scenario.jpg",
        stamina: 6,
        desc: "Bannon is less a normal candidate than a force multiplier for insurgent nationalism. He can shape rhetoric, elevate grievances, and help define the hard-right lane, but his personal electoral appeal outside the activist ecosystem is limited. If the race becomes a purity contest, he matters; if it becomes a general-election contest, he becomes mostly a message threat to everyone else.",
        buff: "Insurgent Ideologue",
        debuff: "Electoral Toxicity",
        groupBoosts: { hardcore_right: 9, antiestablishment: 8, online_militant: 8 },
        groupDebuffs: { suburban_college: -8, women: -6 },
        regionalSpillover: [ "AZ", "WI" ],
        regionalSpilloverBoost: 0.9,
    },
    {
        id: "hawley",
        name: "Josh Hawley",
        party: "R",
        homeState: "MO",
        homeStateBoost: 1.9,
        funds: 62,
        img: "images/scenario.jpg",
        stamina: 8,
        desc: "Hawley combines populist economics with culture-war aggression, which gives him a sharper identity than the average Senate Republican. He can speak to anti-elite voters who want the GOP to sound economically combative rather than merely business-friendly, but he will be under constant pressure to prove he can govern rather than just denounce. His real strength is in a primary where resentment and nationalism matter more than reassurance.",
        buff: "Populist Fire",
        debuff: "Trust Issues",
        groupBoosts: { noncollege: 8, evangelical: 8, blue_collar: 7 },
        groupDebuffs: { suburban_college: -6, donor_class: -4 },
        regionalSpillover: [ "IA", "OH" ],
        regionalSpilloverBoost: 1,
    },
    {
        id: "carlson",
        name: "Tucker Carlson",
        party: "R",
        homeState: "FL",
        homeStateBoost: 1.4,
        funds: 66,
        img: "images/scenario.jpg",
        stamina: 7,
        desc: "Carlson brings a ready-made media platform, a loyal audience, and the ability to dominate the conversation without spending much to do it. He can pull in donors who like the fact that he changes the incentives of the race, but plenty of Republicans would worry that he turns a campaign into an endless grievance broadcast. His ceiling is as much about whether the party wants a commentator as a nominee as it is about any specific policy position.",
        buff: "Media Star Power",
        debuff: "Candidate Question",
        groupBoosts: { online_right: 9, noncollege: 7, antiestablishment: 8 },
        groupDebuffs: { suburban_college: -7, women: -5 },
        regionalSpillover: [ "MN", "WI" ],
        regionalSpilloverBoost: 1,
    },
    {
        id: "rubio",
        name: "Marco Rubio",
        party: "R",
        homeState: "FL",
        homeStateBoost: 2.7,
        funds: 75,
        img: "images/rubio.jpg",
        stamina: 8,
        desc: "Rubio is the most polished Republican diplomat-politician in the field, with a résumé that bridges the Senate, national security, and the post-Trump establishment. He can speak to donors, moderates, and Hispanic voters more naturally than most of the party, but he still has to outrun the shadow of having once been tagged as the 'establishment' option. If the GOP wants a nominee who can talk like a president and not just a movement figure, Rubio is a serious contender.",
        buff: "Diplomatic Polish",
        debuff: "Base Skepticism",
        groupBoosts: { hispanic: 7, suburban_college: 7, donor_class: 8 },
        groupDebuffs: { hard_right: -4, antiestablishment: -3 },
        regionalSpillover: [ "NV", "AZ" ],
        regionalSpilloverBoost: 1.1,
    },
    {
        id: "stein",
        name: "Jill Stein",
        party: "G",
        homeState: "MA",
        homeStateBoost: 1,
        funds: 20,
        img: "images/stein.jpg",
        stamina: 5,
        desc: "Stein remains the left-green protest option, strongest as a pressure valve for voters who want to punish Democrats from the left. Her campaign can influence margins more than it can win states, and that is the whole story: she matters if the race is close in Michigan, Wisconsin, or Pennsylvania. She is not building a national majority coalition; she is trying to maximize protest oxygen.",
        buff: "Protest Vehicle",
        debuff: "Ballot-Box Ceiling",
        groupBoosts: { progressive_left: 7, antiwar_left: 8, environmentalists: 8 },
        groupDebuffs: { suburban_moderates: -6, institutional_dems: -7 },
        regionalSpillover: [ "MI", "WI" ],
        regionalSpilloverBoost: 0.8,
    },
    {
        id: "oliver",
        name: "Chase Oliver",
        party: "L",
        homeState: "GA",
        homeStateBoost: 1.2,
        funds: 18,
        img: "images/oliver.jpg",
        stamina: 7,
        desc: "Oliver is the libertarian ballot-line candidate: small-government, civil-liberties centered, and mostly relevant where the major parties are too polarized for some voters to tolerate. He can appeal to a tiny but real slice of independents and anti-regulation voters, but he is not going to break into the high-single digits nationally without a broader anti-duopoly mood. His value is mostly in regions where a few thousand votes can matter.",
        buff: "Libertarian Purist",
        debuff: "Low Visibility",
        groupBoosts: { libertarian: 9, small_business: 6, antiwar_independents: 6 },
        groupDebuffs: { evangelical: -5, union: -4 },
        regionalSpillover: [ "NC", "FL" ],
        regionalSpilloverBoost: 0.7,
    },
    {
        id: "yang",
        name: "Andrew Yang",
        party: "I",
        homeState: "NY",
        homeStateBoost: 1.3,
        funds: 45,
        img: "images/yang.jpg",
        stamina: 7,
        desc: "Yang is the founder-friendly outsider who can still talk to tech, younger independents, and disaffected moderates in a language that sounds less tribal than either major party. His challenge is that his coalition is real but diffuse, and third-party campaigns are punished by the electoral system unless they land in a very specific moment. He can make noise, raise enough money to stay relevant, and pull on the 'system is broken' electorate, but he needs a chaos environment to matter.",
        buff: "Independent Brand",
        debuff: "Coalition Drift",
        groupBoosts: { tech: 8, youth: 7, independents: 8 },
        groupDebuffs: { union: -4, party_loyalists: -6 },
        regionalSpillover: [ "CA", "NY" ],
        regionalSpilloverBoost: 0.6,
    },
    {
        id: "manchin",
        name: "Joe Manchin",
        party: "I",
        homeState: "WV",
        homeStateBoost: 3,
        funds: 52,
        img: "images/scenario.jpg",
        stamina: 5,
        desc: "Manchin is the old-school Appalachian dealmaker, strongest in places where Democrats have already been written off and Republicans still need to prove they can speak to cultural moderates. He can sell himself as the last independent-minded adult in the room, but the national electorate has moved far enough that his brand is more plausible as a spoiler than a winner. He is useful if the map gets weird; otherwise, he is a nostalgia candidate for an era of split-ticket politics that has mostly vanished.",
        buff: "Appalachian Rogue",
        debuff: "Era Mismatch",
        groupBoosts: { rural_whites: 8, union: 6, moderates: 7 },
        groupDebuffs: { progressive_left: -6, youth: -5 },
        regionalSpillover: [ "OH", "PA" ],
        regionalSpilloverBoost: 1.1,
    },
    {
        id: "kennedy_rfk",
        name: "Robert F. Kennedy Jr.",
        party: "I",
        homeState: "NY",
        homeStateBoost: 1.2,
        funds: 58,
        img: "images/scenario.jpg",
        stamina: 6,
        desc: "Kennedy remains a highly unusual independent presence: strong name ID, strong anti-establishment signaling, and a brand that can briefly cut across partisan lines before collapsing under scrutiny. He can pull dissatisfied voters who want to punish both parties, but his coalition is unstable and often more emotional than durable. If the race is close enough for protest votes to matter, he is dangerous; if not, he is mostly a spoiler with an oversized microphone.",
        buff: "Anti-Establishment Pull",
        debuff: "Message Volatility",
        groupBoosts: { antiestablishment: 8, independents: 7, alternative_media: 7 },
        groupDebuffs: { institutional_dems: -7, public_health_professionals: -8 },
        regionalSpillover: [ "AZ", "NH" ],
        regionalSpilloverBoost: 0.8,
    },
    {
        id: "bloomberg",
        name: "Michael Bloomberg",
        party: "I",
        homeState: "NY",
        homeStateBoost: 1,
        funds: 100,
        img: "images/scenario.jpg",
        stamina: 5,
        desc: "Bloomberg is the pure money candidate: unmatched resources, serious managerial credentials, and the ability to bankroll a professional operation at a scale no outsider can match. The catch is that money buys structure, not affection, and his profile remains deeply polarizing with both populists and activists. He can shape the field, dominate issue spending, and function as the emergency asset for anxious moderates, but he is not naturally built for mass enthusiasm.",
        buff: "Unlimited War Chest",
        debuff: "Mass-appeal Problem",
        groupBoosts: { suburban_moderates: 8, donor_class: 10, business_community: 10 },
        groupDebuffs: { black: -3, progressive_left: -8 },
        regionalSpillover: [ "NY", "NJ" ],
        regionalSpilloverBoost: 0.9,
    },
    {
        id: "delacruz",
        name: "Claudia De la Cruz",
        party: "PSL",
        homeState: "NY",
        homeStateBoost: 1,
        funds: 12,
        img: "images/scenario.jpg",
        stamina: 7,
        desc: "De la Cruz is a hard-left organizing candidate whose purpose is not to win the presidency in the conventional sense, but to turn out anti-capitalist and anti-war voters who feel abandoned by Democrats. She can speak to activists, young radicals, and portions of the Latino left with authenticity, but the electoral system gives her almost no path to institutional power. Her campaign matters if protest energy is the commodity being measured.",
        buff: "Hard-Left Organizing",
        debuff: "Electoral Margin",
        groupBoosts: { progressive_left: 8, youth: 7, latino_left: 7 },
        groupDebuffs: { suburban_moderates: -8, institutional_dems: -9 },
        regionalSpillover: [ "NY", "CA" ],
        regionalSpilloverBoost: 0.5,
    },
    {
        id: "lariva",
        name: "Gloria La Riva",
        party: "PSL",
        homeState: "CA",
        homeStateBoost: 1,
        funds: 10,
        img: "images/scenario.jpg",
        stamina: 5,
        desc: "La Riva is the veteran socialist protest candidate with deep left activist credibility and very limited national reach. She can energize niche anti-imperialist and labor-left circles, but her ceiling is tiny in a presidential system that rewards broad coalitions and punishes fragmentation. She is a message candidate first and a vote-getter second, which is why her influence comes from issue pressure rather than electoral viability.",
        buff: "Leftist Credentials",
        debuff: "Tiny Ceiling",
        groupBoosts: { antiwar_left: 8, progressive_left: 6, labor_left: 6 },
        groupDebuffs: { suburban_moderates: -7, donor_class: -9 },
        regionalSpillover: [ "CA", "NY" ],
        regionalSpilloverBoost: 0.5,
    }
].map(function(candidate) {
    // Ensure every candidate object has the core fields expected by game logic and UI,
    // while safely defaulting missing values from CANDIDATE_DEFAULTS.
    var normalized = Object.assign({}, CANDIDATE_DEFAULTS, candidate || {});
    normalized.groupBoosts = Object.assign({}, CANDIDATE_DEFAULTS.groupBoosts, normalized.groupBoosts || {});
    normalized.groupDebuffs = Object.assign({}, CANDIDATE_DEFAULTS.groupDebuffs, normalized.groupDebuffs || {});
    normalized.regionalSpillover = Array.isArray(normalized.regionalSpillover) ? normalized.regionalSpillover.slice() : [];
    normalized.homeStateBoost = Number(normalized.homeStateBoost);
    normalized.funds = Number(normalized.funds);
    normalized.stamina = Number(normalized.stamina);
    if (!normalized.img) normalized.img = CANDIDATE_DEFAULTS.img;
    if (!normalized.id) normalized.id = "unknown";
    if (!normalized.party) normalized.party = "I";
    if (!normalized.homeState) normalized.homeState = "DC";
    return normalized;
});

/* ---- RUNNING MATES ----
   Structured identically to CANDIDATES for flexibility.
   `state` is used by applyCandidateBuffs for home-state VP advantage.
   `homeState` added as alias for cross-compatibility with candidate rendering. */
const VPS = [

    /* ===== DEMOCRATIC VPs ===== */
    {
        id: "shapiro", name: "Josh Shapiro", party: "D", state: "PA", homeState: "PA",
        funds: 0, img: "images/shapiro.jpg", stamina: 8,
        desc: "Governor of Pennsylvania. Centrist Dem with strong crossover appeal.",
        groupBoosts: { jewish: 8, suburban: 6, college: 5 }, groupDebuffs: {}
    },
    {
        id: "kelly_vp", name: "Mark Kelly", party: "D", state: "AZ", homeState: "AZ",
        funds: 0, img: "images/kelly.jpg", stamina: 8,
        desc: "Arizona Senator and former NASA astronaut. Military credibility.",
        groupBoosts: { military: 10, suburban: 5, independent: 5, college: 4 }, groupDebuffs: {}
    },
    {
        id: "warnock", name: "Raphael Warnock", party: "D", state: "GA", homeState: "GA",
        funds: 0, img: "images/warnock.jpg", stamina: 8,
        desc: "Georgia Senator. Black church leader with strong Southern base.",
        groupBoosts: { black: 12, protestant: 8, urban: 6 }, groupDebuffs: { rural: -3 }
    },
    {
        id: "pritzker", name: "JB Pritzker", party: "D", state: "IL", homeState: "IL",
        funds: 0, img: "images/pritzker.jpg", stamina: 7,
        desc: "Illinois Governor. Deep-pocketed Midwest establishment Democrat.",
        groupBoosts: { jewish: 6, urban: 5, college: 4 }, groupDebuffs: {}
    },
    {
        id: "whitmer_vp", name: "Gretchen Whitmer", party: "D", state: "MI", homeState: "MI",
        funds: 0, img: "images/whitmer.jpg", stamina: 8,
        desc: "Michigan Governor. Anchors the ticket in a critical battleground state.",
        groupBoosts: { women: 8, suburban: 5, union: 6, noncollege: 3 }, groupDebuffs: {}
    },
    {
        id: "khanna_vp", name: "Ro Khanna", party: "D", state: "CA", homeState: "CA",
        funds: 0, img: "images/scenario.jpg", stamina: 9,
        desc: "Silicon Valley progressive Congressman. Energizes the youth and tech vote.",
        groupBoosts: { youth: 10, tech: 10, asian: 8, progressive: 8 }, groupDebuffs: {}
    },

    /* ===== REPUBLICAN VPs ===== */
    {
        id: "rubio", name: "Marco Rubio", party: "R", state: "FL", homeState: "FL",
        funds: 0, img: "images/rubio.jpg", stamina: 8,
        desc: "Secretary of State (2025–present). Won't run for pres if Vance runs — could be VP.",
        groupBoosts: { hispanic: 14, cuban: 20, catholic: 8, florida: 10 }, groupDebuffs: { black: -3 }
    },
    {
        id: "scott_tim", name: "Tim Scott", party: "R", state: "SC", homeState: "SC",
        funds: 0, img: "images/scott.jpg", stamina: 7,
        desc: "South Carolina Senator. Enthusiastic Trump supporter with evangelical roots.",
        groupBoosts: { black: 5, evangelical: 8, suburban: 4 }, groupDebuffs: {}
    },
    {
        id: "stefanik", name: "Elise Stefanik", party: "R", state: "NY", homeState: "NY",
        funds: 0, img: "images/stefanik.jpg", stamina: 7,
        desc: "Congresswoman from New York. MAGA-aligned with suburban appeal.",
        groupBoosts: { women: 6, suburban: 5, college: 3 }, groupDebuffs: {}
    },
    {
        id: "noem", name: "Kristi Noem", party: "R", state: "SD", homeState: "SD",
        funds: 0, img: "images/noem.jpg", stamina: 7,
        desc: "South Dakota Governor. Energizes the rural evangelical base.",
        groupBoosts: { rural: 8, evangelical: 6, women: 4 }, groupDebuffs: { urban: -4 }
    },
    {
        id: "cruz_vp", name: "Ted Cruz", party: "R", state: "TX", homeState: "TX",
        funds: 0, img: "images/scenario.jpg", stamina: 8,
        desc: "Texas Senator. If not running for pres, brings Texas base + constitutional conservatives.",
        groupBoosts: { evangelical: 10, college: 4, military: 5, rural: 6 }, groupDebuffs: {}
    },
    {
        id: "hawley_vp", name: "Josh Hawley", party: "R", state: "MO", homeState: "MO",
        funds: 0, img: "images/scenario.jpg", stamina: 7,
        desc: "Missouri Senator. Populist working-class appeal in the Heartland.",
        groupBoosts: { bluecollar: 10, rural: 7, noncollege: 6 }, groupDebuffs: {}
    },

    /* ===== GREEN VP ===== */
    {
        id: "ware", name: "Butch Ware", party: "G", state: "CA", homeState: "CA",
        funds: 0, img: "images/scenario.jpg", stamina: 7,
        desc: "Academic, scholar, and activist.",
        groupBoosts: { secular: 6, youth: 5, urban: 4 }, groupDebuffs: {}
    },

    /* ===== LIBERTARIAN VP ===== */
    {
        id: "termaat", name: "Mike ter Maat", party: "L", state: "FL", homeState: "FL",
        funds: 0, img: "images/scenario.jpg", stamina: 7,
        desc: "Economist and Libertarian activist.",
        groupBoosts: { smallbusiness: 6, college: 4, tech: 5 }, groupDebuffs: {}
    },

    /* ===== INDEPENDENT VPs ===== */
    {
        id: "kinzinger", name: "Adam Kinzinger", party: "I", state: "IL", homeState: "IL",
        funds: 0, img: "images/scenario.jpg", stamina: 7,
        desc: "Former Republican Congressman. Anti-Trump conservative with military background.",
        groupBoosts: { military: 6, suburban: 5, independent: 6 }, groupDebuffs: {}
    },
    {
        id: "west_cornel", name: "Cornel West", party: "I", state: "MA", homeState: "MA",
        funds: 0, img: "images/scenario.jpg", stamina: 6,
        desc: "Academic, activist, and political philosopher. Black progressive intellectual.",
        groupBoosts: { black: 8, youth: 6, progressive: 7 }, groupDebuffs: { suburban: -4 }
    },

    /* ===== PSL VPs ===== */
    {
        id: "freeman", name: "Sunil Freeman", party: "PSL", state: "PA", homeState: "PA",
        funds: 0, img: "images/scenario.jpg", stamina: 7,
        desc: "PSL activist and labor organizer from Pennsylvania.",
        groupBoosts: { union: 8, urban: 5, youth: 6 }, groupDebuffs: {}
    },
    {
        id: "lariva_vp", name: "Gloria La Riva", party: "PSL", state: "CA", homeState: "CA",
        funds: 0, img: "images/lariva.jpg", stamina: 7,
        desc: "PSL General Secretary. If De la Cruz is nominee, La Riva anchors the ticket.",
        groupBoosts: { hispanic: 8, union: 10, urban: 6 }, groupDebuffs: {}
    }
];

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
    manchin: {
        guns: 3, abortion: 1, healthcare: -2, immigration: 2, climate: -1,
        taxation: 2, trade: 1, minwage: 1, labor: 1, lgbtq: -1,
        criminal: 2, drugpricing: -2, energy: 3, foreign: 1, military: 2,
        israel: 2, govspend: 1, electionreform: 1, scotus: 0, economy: 1
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
    }
};

/* ---- CANDIDATE GROUP MODIFIERS ---- */
const CANDIDATE_GROUP_MODIFIERS = {
    harris: { black: 15, women: 10, urban: 8, college: 5, asian: 5 },
    newsom: { college: 8, urban: 6, tech: 10, secular: 6 },
    whitmer: { women: 8, suburban: 6, union: 8, noncollege: 4 },
    buttigieg: { lgbtq_community: 12, college: 6, urban: 5, youth: 5 },
    aoc: { youth: 15, hispanic: 10, urban: 8, women: 6 },
    kelly: { military: 10, suburban: 5, independent: 5 },
    khanna: { youth: 10, tech: 12, asian: 8, progressive: 10 },
    emanuel: { jewish: 8, urban: 6, college: 5, suburban: 5 },
    stewart: { youth: 12, college: 8, secular: 10, independent: 8 },
    beshear: { rural: 6, noncollege: 5, suburban: 7, independent: 8, catholic: 5 },
    booker: { black: 12, urban: 8, youth: 6, college: 5 },
    shapiro: { jewish: 8, suburban: 7, college: 6, independent: 6 },
    trump: { evangelical: 14, rural: 12, noncollege: 10, bluecollar: 8 },
    vance: { rural: 10, noncollege: 8, bluecollar: 8, evangelical: 5 },
    desantis: { evangelical: 12, rural: 8, seniors: 6, noncollege: 5 },
    cruz: { evangelical: 10, college: 5, military: 5, rural: 6 },
    paul: { libertarian: 12, youth: 6, college: 5, smallbusiness: 8 },
    haley: { women: 8, suburban: 8, college: 6, military: 5 },
    ramaswamy: { asian: 10, college: -5, suburban: 5, tech: 8 },
    bannon: { noncollege: 12, rural: 10, evangelical: 8, bluecollar: 10 },
    hawley: { bluecollar: 10, rural: 8, noncollege: 7, evangelical: 6 },
    carlson: { rural: 10, noncollege: 8, evangelical: 5 },
    rubio: { hispanic: 14, cuban: 20, catholic: 8, suburban: 5 },
    stein: { secular: 12, youth: 8, urban: 6, progressive: 10 },
    oliver: { smallbusiness: 10, college: 5, tech: 6, libertarian: 8 },
    yang: { tech: 12, asian: 10, youth: 8, college: 6 },
    manchin: { bluecollar: 8, rural: 6, catholic: 5, independent: 7 },
    kennedy_rfk: { youth: 5, rural: 4, independent: 6, health: 8 },
    bloomberg: { whitecollar: 10, urban: 8, college: 7, jewish: 6 },
    lariva: { union: 10, youth: 8, urban: 6, hispanic: 8, black: 5 },
    delacruz: { hispanic: 12, youth: 10, urban: 8, union: 8 },
    rubio: { hispanic: 14, cuban: 20, catholic: 8, suburban: 5 },
    warnock: { black: 12, protestant: 8 },
    kelly_vp: { military: 10, suburban: 5 }
};
