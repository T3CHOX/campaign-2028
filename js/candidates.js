/* ============================================
   DECISION 2028 - CANDIDATES & RUNNING MATES
   ============================================ */

const CANDIDATES = [
    { id: "harris", name: "Kamala Harris", party: "D", homeState: "CA", funds: 60, img: "images/harris.jpg", stamina: 8, desc: "The incumbent Vice President.", buff: "Incumbency", groupBoosts: { black: 15, women: 10, urban: 8, college: 5, asian: 5 }, groupDebuffs: { rural: -4, evangelical: -8 } },
    { id: "newsom", name: "Gavin Newsom", party: "D", homeState: "CA", funds: 75, img: "images/newsom.jpg", stamina: 9, desc: "California Governor.", buff: "War Chest", groupBoosts: { college: 8, urban: 6, tech: 10, secular: 6 }, groupDebuffs: { rural: -6, evangelical: -10, bluecollar: -4 } },
    { id: "whitmer", name: "Gretchen Whitmer", party: "D", homeState: "MI", funds: 55, img: "images/whitmer.jpg", stamina: 8, desc: "Michigan Governor.", buff: "Midwest Appeal", groupBoosts: { women: 8, suburban: 6, union: 8, noncollege: 4 }, groupDebuffs: { evangelical: -5, rural: -3 } },
    { id: "buttigieg", name: "Pete Buttigieg", party: "D", homeState: "IN", funds: 50, img: "images/buttigieg.jpg", stamina: 8, desc: "Transportation Secretary.", buff: "Media Savvy", groupBoosts: { lgbtq_community: 12, college: 6, urban: 5, youth: 5 }, groupDebuffs: { evangelical: -10, rural: -5 } },
    { id: "aoc", name: "Alexandria Ocasio-Cortez", party: "D", homeState: "NY", funds: 45, img: "images/aoc.jpg", stamina: 10, desc: "Progressive firebrand.", buff: "Youth Vote", groupBoosts: { youth: 15, hispanic: 10, urban: 8, women: 6 }, groupDebuffs: { suburban: -8, rural: -12, seniors: -6 } },
    { id: "desantis", name: "Ron DeSantis", party: "R", homeState: "FL", funds: 65, img: "images/desantis.jpg", stamina: 9, desc: "Florida Governor.", buff: "Base Turnout", groupBoosts: { evangelical: 12, rural: 8, seniors: 6, noncollege: 5 }, groupDebuffs: { lgbtq_community: -15, urban: -8, black: -6 } },
    { id: "vance", name: "JD Vance", party: "R", homeState: "OH", funds: 50, img: "images/vance.jpg", stamina: 8, desc: "Ohio Senator.", buff: "Populism", groupBoosts: { rural: 10, noncollege: 8, bluecollar: 8, evangelical: 5 }, groupDebuffs: { college: -6, urban: -7 } },
    { id: "ramaswamy", name: "Vivek Ramaswamy", party: "R", homeState: "OH", funds: 70, img: "images/ramaswamy.jpg", stamina: 10, desc: "Biotech entrepreneur.", buff: "Outsider Energy", groupBoosts: { asian: 10, suburban: 5, tech: 8 }, groupDebuffs: { college: -5, union: -6 } },
    { id: "haley", name: "Nikki Haley", party: "R", homeState: "SC", funds: 55, img: "images/haley.jpg", stamina: 8, desc: "Former UN Ambassador.", buff: "Suburban Appeal", groupBoosts: { women: 8, suburban: 8, college: 6, military: 5 }, groupDebuffs: { rural: -3 } },
    { id: "yang", name: "Andrew Yang", party: "F", homeState: "NY", funds: 35, img: "images/yang.jpg", stamina: 8, desc: "Forward Party founder.", buff: "UBI Movement", debuff: "Third Party Penalty", groupBoosts: { tech: 12, asian: 10, youth: 8, college: 6 }, groupDebuffs: { rural: -8, evangelical: -5 } },
    { id: "stein", name: "Jill Stein", party: "G", homeState: "MA", funds: 8, img: "images/scenario.jpg", stamina: 6, desc: "Green Party candidate.", buff: "Environmental Base", debuff: "Severe Third Party Penalty", groupBoosts: { secular: 12, youth: 8, urban: 6 }, groupDebuffs: { bluecollar: -5, rural: -10 } },
    { id: "oliver", name: "Chase Oliver", party: "L", homeState: "GA", funds: 10, img: "images/scenario.jpg", stamina: 7, desc: "Libertarian activist.", buff: "Liberty Movement", debuff: "Severe Third Party Penalty", groupBoosts: { smallbusiness: 10, college: 5, tech: 6 }, groupDebuffs: { union: -10, black: -5 } },
    { id: "manchin", name: "Joe Manchin", party: "O", homeState: "WV", funds: 30, img: "images/scenario.jpg", stamina: 7, desc: "Former West Virginia Senator. Centrist Democrat turned Independent.", buff: "Bipartisan Appeal", debuff: "Outsider Penalty", groupBoosts: { bluecollar: 8, rural: 6, catholic: 5 }, groupDebuffs: { urban: -5, youth: -4 } },
    { id: "kennedy_rfk", name: "Robert F. Kennedy Jr.", party: "O", homeState: "NY", funds: 25, img: "images/scenario.jpg", stamina: 6, desc: "Independent candidate and political dynasty scion.", buff: "Name Recognition", debuff: "Outsider Penalty", groupBoosts: { youth: 5, rural: 4 }, groupDebuffs: { mainstream: -6, college: -4 } },
    { id: "bloomberg", name: "Michael Bloomberg", party: "O", homeState: "NY", funds: 200, img: "images/scenario.jpg", stamina: 7, desc: "Former New York City Mayor and billionaire businessman.", buff: "Unlimited Funds", debuff: "Outsider Penalty", groupBoosts: { whitecollar: 10, urban: 8, college: 7 }, groupDebuffs: { rural: -8, bluecollar: -6 } }
];

const VPS = [
    { id: "shapiro", name: "Josh Shapiro", party: "D", state: "PA", img: "images/shapiro.jpg", desc: "Governor of Pennsylvania." },
    { id: "kelly", name: "Mark Kelly", party: "D", state: "AZ", img: "images/kelly.jpg", desc: "Senator from Arizona." },
    { id: "warnock", name: "Raphael Warnock", party: "D", state: "GA", img: "images/warnock.jpg", desc: "Senator from Georgia." },
    { id: "pritzker", name: "JB Pritzker", party: "D", state: "IL", img: "images/pritzker.jpg", desc: "Governor of Illinois." },
    { id: "rubio", name: "Marco Rubio", party: "R", state: "FL", img: "images/rubio.jpg", desc: "Senator from Florida." },
    { id: "scott_tim", name: "Tim Scott", party: "R", state: "SC", img: "images/scott.jpg", desc: "Senator from South Carolina." },
    { id: "stefanik", name:  "Elise Stefanik", party: "R", state: "NY", img: "images/stefanik.jpg", desc: "Congresswoman from New York." },
    { id: "noem", name: "Kristi Noem", party: "R", state: "SD", img: "images/noem.jpg", desc: "Governor of South Dakota." },
    { id: "whitman", name: "Christine Todd Whitman", party: "F", state: "NJ", img: "images/scenario.jpg", desc: "Former NJ Governor." },
    { id: "gabbard", name: "Tulsi Gabbard", party: "F", state: "HI", img: "images/scenario.jpg", desc: "Former Congresswoman." },
    { id: "ware", name: "Butch Ware", party: "G", state: "CA", img: "images/scenario.jpg", desc: "Academic and activist." },
    { id: "kinzinger", name: "Adam Kinzinger", party: "O", state: "IL", img: "images/scenario.jpg", desc: "Former Republican Congressman, anti-Trump conservative." },
    { id: "west_cornel", name: "Cornel West", party: "O", state: "MA", img: "images/scenario.jpg", desc: "Academic, activist, and political philosopher." }
];

// Candidate issue positions (-10 = far left, +10 = far right)
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
    desantis: {
        guns: 7, abortion: 7, healthcare: 6, immigration: 7, climate: 5,
        taxation: 6, trade: 3, minwage: 5, labor: 4, lgbtq: 5,
        criminal: 6, drugpricing: 2, energy: 6, foreign: 3, military: 5,
        israel: 4, govspend: 6, electionreform: 2, scotus: 6, economy: 4
    },
    vance: {
        guns: 6, abortion: 7, healthcare: 5, immigration: 7, climate: 4,
        taxation: 5, trade: 4, minwage: 4, labor: 3, lgbtq: 4,
        criminal: 5, drugpricing: 1, energy: 5, foreign: 3, military: 4,
        israel: 4, govspend: 5, electionreform: 1, scotus: 6, economy: 4
    },
    ramaswamy: {
        guns: 5, abortion: 6, healthcare: 6, immigration: 6, climate: 4,
        taxation: 7, trade: 3, minwage: 5, labor: 3, lgbtq: 3,
        criminal: 5, drugpricing: 3, energy: 5, foreign: 2, military: 3,
        israel: 3, govspend: 6, electionreform: 2, scotus: 5, economy: 5
    },
    haley: {
        guns: 4, abortion: 5, healthcare: 4, immigration: 5, climate: 2,
        taxation: 5, trade: 2, minwage: 3, labor: 2, lgbtq: 2,
        criminal: 4, drugpricing: 1, energy: 3, foreign: 3, military: 5,
        israel: 5, govspend: 4, electionreform: 1, scotus: 4, economy: 3
    },
    yang: {
        guns: -2, abortion: -3, healthcare: -4, immigration: -2, climate: -4,
        taxation: -2, trade: -1, minwage: -3, labor: -2, lgbtq: -4,
        criminal: -2, drugpricing: -4, energy: -3, foreign: -1, military: -1,
        israel: 0, govspend: -1, electionreform: -5, scotus: -2, economy: -2
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
    }
};

// Candidate/VP group modifiers (% adjustment to group support)
const CANDIDATE_GROUP_MODIFIERS = {
    harris: {
        black: 15, women: 10, urban: 8, college: 5, asian: 5
    },
    newsom: {
        college: 8, urban: 6, tech: 10, secular: 6
    },
    whitmer: {
        women: 8, suburban: 6, union: 8, noncollege: 4
    },
    buttigieg: {
        lgbtq_community: 12, college: 6, urban: 5, youth: 5
    },
    aoc: {
        youth: 15, hispanic: 10, urban: 8, women: 6
    },
    desantis: {
        evangelical: 12, rural: 8, seniors: 6, noncollege: 5
    },
    vance: {
        rural: 10, noncollege: 8, bluecollar: 8, evangelical: 5
    },
    ramaswamy: {
        asian: 10, college: -5, suburban: 5, tech: 8
    },
    haley: {
        women: 8, suburban: 8, college: 6, military: 5
    },
    yang: {
        tech: 12, asian: 10, youth: 8, college: 6
    }
};
