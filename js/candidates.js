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
const CANDIDATES = [

    /* ===== DEMOCRATIC PARTY ===== */
    {
        id: "harris", name: "Kamala Harris", party: "D", homeState: "CA",
        funds: 60, img: "images/harris.jpg", stamina: 8,
        desc: "Former VP & 2024 nominee. Lost to Trump but says she is 'not done.'",
        buff: "Name Recognition", debuff: null,
        groupBoosts: { black: 15, women: 10, urban: 8, college: 5, asian: 5 },
        groupDebuffs: { rural: -4, evangelical: -8 }
    },
    {
        id: "newsom", name: "Gavin Newsom", party: "D", homeState: "CA",
        funds: 75, img: "images/newsom.jpg", stamina: 9,
        desc: "California Governor widely seen as a national frontrunner for 2028.",
        buff: "War Chest", debuff: null,
        groupBoosts: { college: 8, urban: 6, tech: 10, secular: 6 },
        groupDebuffs: { rural: -6, evangelical: -10, bluecollar: -4 }
    },
    {
        id: "whitmer", name: "Gretchen Whitmer", party: "D", homeState: "MI",
        funds: 55, img: "images/whitmer.jpg", stamina: 8,
        desc: "Michigan Governor. Midwestern moderate with strong union ties.",
        buff: "Midwest Appeal", debuff: null,
        groupBoosts: { women: 8, suburban: 6, union: 8, noncollege: 4 },
        groupDebuffs: { evangelical: -5, rural: -3 }
    },
    {
        id: "buttigieg", name: "Pete Buttigieg", party: "D", homeState: "IN",
        funds: 50, img: "images/buttigieg.jpg", stamina: 8,
        desc: "Former Transportation Secretary (2021–2025). Leads early polls in New Hampshire.",
        buff: "Media Savvy", debuff: null,
        groupBoosts: { lgbtq_community: 12, college: 6, urban: 5, youth: 5 },
        groupDebuffs: { evangelical: -10, rural: -5 }
    },
    {
        id: "aoc", name: "Alexandria Ocasio-Cortez", party: "D", homeState: "NY",
        funds: 45, img: "images/aoc.jpg", stamina: 10,
        desc: "Progressive congresswoman and youth movement icon.",
        buff: "Youth Vote", debuff: null,
        groupBoosts: { youth: 15, hispanic: 10, urban: 8, women: 6 },
        groupDebuffs: { suburban: -8, rural: -12, seniors: -6 }
    },
    {
        id: "kelly", name: "Mark Kelly", party: "D", homeState: "AZ",
        funds: 45, img: "images/kelly.jpg", stamina: 8,
        desc: "Arizona Senator and former NASA astronaut. Confirmed considering a 2028 run.",
        buff: "Military Credibility", debuff: null,
        groupBoosts: { military: 10, suburban: 6, college: 5, independent: 5 },
        groupDebuffs: { progressive: -4, youth: -3 }
    },
    {
        id: "khanna", name: "Ro Khanna", party: "D", homeState: "CA",
        funds: 40, img: "images/scenario.jpg", stamina: 9,
        desc: "Progressive Silicon Valley Congressman. Bernie Sanders wing of the party.",
        buff: "Tech Progressive", debuff: null,
        groupBoosts: { youth: 10, tech: 12, asian: 8, progressive: 10 },
        groupDebuffs: { bluecollar: -5, rural: -8, seniors: -4 }
    },
    {
        id: "emanuel", name: "Rahm Emanuel", party: "D", homeState: "IL",
        funds: 50, img: "images/scenario.jpg", stamina: 7,
        desc: "Former Chicago Mayor and Ambassador to Japan. Centrist 'renewal wing' Democrat.",
        buff: "Establishment Network", debuff: null,
        groupBoosts: { jewish: 8, urban: 6, college: 5, suburban: 5 },
        groupDebuffs: { progressive: -8, youth: -6, black: -5 }
    },
    {
        id: "stewart", name: "Jon Stewart", party: "D", homeState: "NY",
        funds: 35, img: "images/scenario.jpg", stamina: 8,
        desc: "Comedian, activist, and political commentator. Anti-establishment outsider appeal.",
        buff: "Cultural Phenomenon", debuff: null,
        groupBoosts: { youth: 12, college: 8, secular: 10, independent: 8 },
        groupDebuffs: { seniors: -5, rural: -6, evangelical: -8 }
    },
    {
        id: "beshear", name: "Andy Beshear", party: "D", homeState: "KY",
        funds: 45, img: "images/scenario.jpg", stamina: 8,
        desc: "Kentucky Governor. Won 3 straight statewide races in a Trump+30 state — most electable Dem.",
        buff: "Red State Crossover", debuff: null,
        groupBoosts: { rural: 6, noncollege: 5, suburban: 7, independent: 8, catholic: 5 },
        groupDebuffs: { progressive: -6, youth: -3 }
    },
    {
        id: "booker", name: "Cory Booker", party: "D", homeState: "NJ",
        funds: 40, img: "images/scenario.jpg", stamina: 9,
        desc: "New Jersey Senator. Set a record-length Senate floor speech in protest of Trump in 2025.",
        buff: "National Spotlight", debuff: null,
        groupBoosts: { black: 12, urban: 8, youth: 6, college: 5 },
        groupDebuffs: { rural: -5, noncollege: -4, evangelical: -4 }
    },
    {
        id: "shapiro", name: "Josh Shapiro", party: "D", homeState: "PA",
        funds: 55, img: "images/shapiro.jpg", stamina: 8,
        desc: "Pennsylvania Governor. Won by 15 points in a Trump state — viewed as a top 2028 contender.",
        buff: "Battleground Governor", debuff: null,
        groupBoosts: { jewish: 8, suburban: 7, college: 6, independent: 6 },
        groupDebuffs: { progressive: -5, youth: -3 }
    },

    /* ===== REPUBLICAN PARTY ===== */
    {
        id: "trump", name: "Donald Trump", party: "R", homeState: "FL",
        funds: 80, img: "images/scenario.jpg", stamina: 6,
        desc: "45th & 47th President. Pushing an unconstitutional 3rd term — electrifies the base.",
        buff: "MAGA Kingmaker", debuff: "22nd Amendment Crisis",
        groupBoosts: { evangelical: 14, rural: 12, noncollege: 10, bluecollar: 8 },
        groupDebuffs: { college: -8, urban: -10, women: -6, independent: -12 }
    },
    {
        id: "vance", name: "JD Vance", party: "R", homeState: "OH",
        funds: 55, img: "images/vance.jpg", stamina: 8,
        desc: "Sitting Vice President (2025–present). Widely seen as Trump's natural successor.",
        buff: "VP Incumbency", debuff: null,
        groupBoosts: { rural: 10, noncollege: 8, bluecollar: 8, evangelical: 5 },
        groupDebuffs: { college: -6, urban: -7 }
    },
    {
        id: "desantis", name: "Ron DeSantis", party: "R", homeState: "FL",
        funds: 65, img: "images/desantis.jpg", stamina: 9,
        desc: "Florida Governor. Term-limited in 2026 and openly considering a 2028 run.",
        buff: "Culture Warrior", debuff: null,
        groupBoosts: { evangelical: 12, rural: 8, seniors: 6, noncollege: 5 },
        groupDebuffs: { lgbtq_community: -15, urban: -8, black: -6 }
    },
    {
        id: "cruz", name: "Ted Cruz", party: "R", homeState: "TX",
        funds: 50, img: "images/scenario.jpg", stamina: 8,
        desc: "Texas Senator since 2013. Longtime presidential aspirant with a loyal conservative base.",
        buff: "Constitutional Conservative", debuff: null,
        groupBoosts: { evangelical: 10, college: 5, military: 5, rural: 6 },
        groupDebuffs: { urban: -8, independent: -7, moderate: -6 }
    },
    {
        id: "paul", name: "Rand Paul", party: "R", homeState: "KY",
        funds: 40, img: "images/scenario.jpg", stamina: 7,
        desc: "Kentucky Senator. Libertarian-leaning Republican — will not run if Vance runs.",
        buff: "Liberty Conservative", debuff: null,
        groupBoosts: { libertarian: 12, youth: 6, college: 5, smallbusiness: 8 },
        groupDebuffs: { military: -8, neocon: -10, evangelical: -4 }
    },
    {
        id: "haley", name: "Nikki Haley", party: "R", homeState: "SC",
        funds: 55, img: "images/haley.jpg", stamina: 8,
        desc: "Former UN Ambassador. Moderate suburban Republican with crossover appeal.",
        buff: "Suburban Appeal", debuff: null,
        groupBoosts: { women: 8, suburban: 8, college: 6, military: 5 },
        groupDebuffs: { rural: -3, maga: -5 }
    },
    {
        id: "ramaswamy", name: "Vivek Ramaswamy", party: "R", homeState: "OH",
        funds: 70, img: "images/ramaswamy.jpg", stamina: 10,
        desc: "Biotech entrepreneur. High energy outsider who thrives on controversy.",
        buff: "Outsider Energy", debuff: null,
        groupBoosts: { asian: 10, suburban: 5, tech: 8, youth: 6 },
        groupDebuffs: { college: -5, union: -6 }
    },
    {
        id: "bannon", name: "Steve Bannon", party: "R", homeState: "VA",
        funds: 20, img: "images/scenario.jpg", stamina: 6,
        desc: "Former White House Chief Strategist. MAGA populist firebrand with rabid base loyalty.",
        buff: "MAGA Base Mobilizer", debuff: "Controversialist",
        groupBoosts: { noncollege: 12, rural: 10, evangelical: 8, bluecollar: 10 },
        groupDebuffs: { college: -12, urban: -14, suburban: -10, independent: -15 }
    },
    {
        id: "hawley", name: "Josh Hawley", party: "R", homeState: "MO",
        funds: 35, img: "images/scenario.jpg", stamina: 7,
        desc: "Missouri Senator. Working-class populist with a national profile.",
        buff: "Populist Firebrand", debuff: null,
        groupBoosts: { bluecollar: 10, rural: 8, noncollege: 7, evangelical: 6 },
        groupDebuffs: { college: -6, urban: -7, corporate: -8 }
    },
    {
        id: "carlson", name: "Tucker Carlson", party: "R", homeState: "FL",
        funds: 30, img: "images/scenario.jpg", stamina: 7,
        desc: "Conservative media personality. Speculation about a 2028 run is high.",
        buff: "Media Platform", debuff: "Untested Candidate",
        groupBoosts: { rural: 10, noncollege: 8, maga: 10, evangelical: 5 },
        groupDebuffs: { college: -8, urban: -10, independent: -8, suburban: -6 }
    },
    {
        id: "rubio", name: "Marco Rubio", party: "R", homeState: "FL",
        funds: 65, img: "images/rubio.jpg", stamina: 8,
        desc: "Secretary of State (2025–present). After a prominent role in the 2026 Iran crisis, speculation he will run surged.",
        buff: "Foreign Policy Record", debuff: null,
        groupBoosts: { hispanic: 14, cuban: 20, catholic: 8, suburban: 5, florida: 10 },
        groupDebuffs: { maga: -4, rural: -2 }
    },

    /* ===== GREEN PARTY ===== */
    {
        id: "stein", name: "Jill Stein", party: "G", homeState: "MA",
        funds: 8, img: "images/stein.jpg", stamina: 6,
        desc: "Green Party perennial candidate — environmental and social justice platform.",
        buff: "Environmental Base", debuff: "Severe Third Party Penalty",
        groupBoosts: { secular: 12, youth: 8, urban: 6 },
        groupDebuffs: { bluecollar: -5, rural: -10 }
    },

    /* ===== LIBERTARIAN PARTY ===== */
    {
        id: "oliver", name: "Chase Oliver", party: "L", homeState: "GA",
        funds: 10, img: "images/oliver.jpg", stamina: 7,
        desc: "Libertarian activist. Maximum freedom, minimal government.",
        buff: "Liberty Movement", debuff: "Severe Third Party Penalty",
        groupBoosts: { smallbusiness: 10, college: 5, tech: 6 },
        groupDebuffs: { union: -10, black: -5 }
    },

    /* ===== INDEPENDENT ===== */
    {
        id: "yang", name: "Andrew Yang", party: "I", homeState: "NY",
        funds: 20, img: "images/yang.jpg", stamina: 8,
        desc: "Forward Party founder. His book hints 'the odds of my running again are high.'",
        buff: "UBI Movement", debuff: "Outsider Penalty",
        groupBoosts: { tech: 12, asian: 10, youth: 8, college: 6 },
        groupDebuffs: { rural: -8, evangelical: -5 }
    },
    {
        id: "manchin", name: "Joe Manchin", party: "I", homeState: "WV",
        funds: 30, img: "images/manchin.jpg", stamina: 7,
        desc: "Former West Virginia Senator. Centrist outsider with rural blue-collar appeal.",
        buff: "Bipartisan Appeal", debuff: "Outsider Penalty",
        groupBoosts: { bluecollar: 8, rural: 6, catholic: 5 },
        groupDebuffs: { urban: -5, youth: -4 }
    },
    {
        id: "kennedy_rfk", name: "Robert F. Kennedy Jr.", party: "I", homeState: "CA",
        funds: 25, img: "images/kennedy_rfk.jpg", stamina: 6,
        desc: "Former HHS Secretary & 2024 independent candidate. Speculation of another run.",
        buff: "Name Recognition", debuff: "Outsider Penalty",
        groupBoosts: { youth: 5, rural: 4, independent: 6 },
        groupDebuffs: { mainstream: -6, college: -4 }
    },
    {
        id: "bloomberg", name: "Michael Bloomberg", party: "I", homeState: "NY",
        funds: 200, img: "images/bloomberg.jpg", stamina: 7,
        desc: "Former NYC Mayor and billionaire businessman. Self-financed mega-campaign.",
        buff: "Unlimited Funds", debuff: "Outsider Penalty",
        groupBoosts: { whitecollar: 10, urban: 8, college: 7 },
        groupDebuffs: { rural: -8, bluecollar: -6 }
    },

    /* ===== PARTY FOR SOCIALISM AND LIBERATION (PSL) ===== */
    {
        id: "delacruz", name: "Claudia De la Cruz", party: "PSL", homeState: "NY",
        funds: 5, img: "images/scenario.jpg", stamina: 9,
        desc: "PSL presidential candidate. Activist, organizer, and Bronx-born community leader.",
        buff: "Working Class Champion", debuff: "Severe Third Party Penalty",
        groupBoosts: { hispanic: 12, youth: 10, urban: 8, union: 8 },
        groupDebuffs: { suburban: -10, rural: -15, smallbusiness: -6 }
    },
    {
        id: "lariva", name: "Gloria La Riva", party: "PSL", homeState: "CA",
        funds: 5, img: "images/lariva.jpg", stamina: 7,
        desc: "PSL General Secretary and longtime socialist organizer.",
        buff: "Working Class Appeal", debuff: "Severe Third Party Penalty",
        groupBoosts: { union: 10, youth: 8, urban: 6, hispanic: 8 },
        groupDebuffs: { suburban: -8, rural: -12, smallbusiness: -6 }
    }
];

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
    yang: { tech: 12, asian: 10, youth: 8, college: 6 },
    lariva: { union: 10, youth: 8, urban: 6, hispanic: 8, black: 5 },
    delacruz: { hispanic: 12, youth: 10, urban: 8, union: 8 },
    rubio: { hispanic: 14, cuban: 20, catholic: 8 },
    shapiro: { jewish: 8, suburban: 6, college: 5 },
    warnock: { black: 12, protestant: 8 },
    kelly_vp: { military: 10, suburban: 5 }
};
