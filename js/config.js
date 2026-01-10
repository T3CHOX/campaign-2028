/* ============================================
   DECISION 2028 - CONFIGURATION & DATA
   ============================================ */

const PARTIES = {
    D: { name: "Democratic Party", shortName: "Democrat", color: "#00AEF3" },
    R:  { name: "Republican Party", shortName:  "Republican", color:  "#E81B23" },
    F: { name: "Forward Party", shortName: "Forward", color: "#F2C75C" },
    G: { name: "Green Party", shortName:  "Green", color:  "#198754" },
    L: { name: "Libertarian Party", shortName: "Libertarian", color:  "#fd7e14" }
};

const ISSUES = [
    { id: 'econ', name: 'Economy' },
    { id: 'jobs', name: 'Jobs' },
    { id: 'tax', name: 'Tax Policy' },
    { id: 'health', name: 'Healthcare' },
    { id: 'immig', name: 'Immigration' },
    { id: 'clim', name: 'Climate' },
    { id: 'gun', name: 'Gun Control' },
    { id: 'abort', name: 'Abortion' },
    { id: 'foreign', name: 'Foreign Policy' },
    { id: 'crime', name: 'Crime' }
];

const CANDIDATES = [
    { id: "harris", name: "Kamala Harris", party: "D", funds: 60, img: "images/harris.jpg", stamina: 8, desc: "The incumbent Vice President.", buff: "Incumbency" },
    { id: "newsom", name: "Gavin Newsom", party: "D", funds: 75, img: "images/newsom.jpg", stamina: 9, desc: "California Governor.", buff: "War Chest" },
    { id: "whitmer", name: "Gretchen Whitmer", party: "D", funds: 55, img: "images/whitmer.jpg", stamina: 8, desc: "Michigan Governor.", buff: "Midwest Appeal" },
    { id: "buttigieg", name: "Pete Buttigieg", party: "D", funds: 50, img: "images/buttigieg.jpg", stamina: 8, desc: "Transportation Secretary.", buff: "Media Savvy" },
    { id: "aoc", name: "Alexandria Ocasio-Cortez", party:  "D", funds:  45, img: "images/aoc.jpg", stamina: 10, desc: "Progressive firebrand.", buff: "Youth Vote" },
    { id: "desantis", name: "Ron DeSantis", party: "R", funds: 65, img: "images/desantis.jpg", stamina: 9, desc: "Florida Governor.", buff: "Base Turnout" },
    { id: "vance", name: "JD Vance", party: "R", funds: 50, img: "images/vance.jpg", stamina: 8, desc: "Ohio Senator.", buff: "Populism" },
    { id: "ramaswamy", name:  "Vivek Ramaswamy", party: "R", funds: 70, img: "images/ramaswamy.jpg", stamina: 10, desc: "Biotech entrepreneur.", buff: "Outsider Energy" },
    { id: "haley", name: "Nikki Haley", party: "R", funds: 55, img: "images/haley.jpg", stamina: 8, desc: "Former UN Ambassador.", buff: "Suburban Appeal" },
    { id: "yang", name: "Andrew Yang", party: "F", funds: 35, img: "images/yang.jpg", stamina: 8, desc: "Forward Party founder.", buff: "UBI Movement", debuff: "Third Party Penalty" },
    { id: "stein", name: "Jill Stein", party: "G", funds: 8, img: "images/scenario.jpg", stamina: 6, desc: "Green Party candidate.", buff: "Environmental Base", debuff: "Severe Third Party Penalty" },
    { id: "oliver", name: "Chase Oliver", party: "L", funds: 10, img: "images/scenario.jpg", stamina: 7, desc: "Libertarian activist.", buff: "Liberty Movement", debuff: "Severe Third Party Penalty" }
];

const VPS = [
    { id: "shapiro", name: "Josh Shapiro", party: "D", state: "PA", img: "images/shapiro.jpg", desc: "Governor of Pennsylvania." },
    { id: "kelly", name: "Mark Kelly", party: "D", state: "AZ", img: "images/kelly.jpg", desc: "Senator from Arizona." },
    { id: "warnock", name: "Raphael Warnock", party: "D", state: "GA", img: "images/scenario.jpg", desc: "Senator from Georgia." },
    { id: "pritzker", name: "JB Pritzker", party: "D", state: "IL", img: "images/scenario.jpg", desc: "Governor of Illinois." },
    { id: "rubio", name: "Marco Rubio", party: "R", state: "FL", img: "images/scenario.jpg", desc: "Senator from Florida." },
    { id: "scott_tim", name: "Tim Scott", party: "R", state: "SC", img: "images/scenario.jpg", desc: "Senator from South Carolina." },
    { id: "stefanik", name:  "Elise Stefanik", party: "R", state: "NY", img: "images/scenario.jpg", desc: "Congresswoman from New York." },
    { id: "noem", name: "Kristi Noem", party: "R", state: "SD", img: "images/scenario.jpg", desc: "Governor of South Dakota." },
    { id: "whitman", name: "Christine Todd Whitman", party: "F", state: "NJ", img: "images/scenario.jpg", desc: "Former NJ Governor." },
    { id: "gabbard", name: "Tulsi Gabbard", party: "F", state: "HI", img: "images/scenario.jpg", desc: "Former Congresswoman." },
    { id: "ware", name: "Butch Ware", party: "G", state: "CA", img: "images/scenario.jpg", desc: "Academic and activist." },
    { id: "termaat", name: "Mike ter Maat", party: "L", state: "FL", img: "images/scenario.jpg", desc: "Libertarian economist." }
];

const STATES = {
    "AL": { name: "Alabama", ev: 9, lean: -20 },
    "AK": { name: "Alaska", ev: 3, lean: -15 },
    "AZ": { name: "Arizona", ev: 11, lean: 0 },
    "AR": { name:  "Arkansas", ev:  6, lean: -25 },
    "CA": { name:  "California", ev:  54, lean: 25 },
    "CO": { name:  "Colorado", ev:  10, lean: 8 },
    "CT": { name:  "Connecticut", ev:  7, lean: 12 },
    "DE": { name:  "Delaware", ev:  3, lean:  15 },
    "DC": { name: "District of Columbia", ev: 3, lean: 80 },
    "FL": { name:  "Florida", ev:  30, lean: -3 },
    "GA": { name:  "Georgia", ev:  16, lean: 0 },
    "HI": { name: "Hawaii", ev: 4, lean: 25 },
    "ID": { name:  "Idaho", ev:  4, lean: -30 },
    "IL": { name:  "Illinois", ev:  19, lean: 15 },
    "IN": { name:  "Indiana", ev:  11, lean: -15 },
    "IA": { name: "Iowa", ev: 6, lean: -8 },
    "KS": { name: "Kansas", ev: 6, lean: -18 },
    "KY": { name: "Kentucky", ev: 8, lean: -25 },
    "LA": { name:  "Louisiana", ev:  8, lean:  -20 },
    "ME": { name:  "Maine", ev:  4, lean: 8 },
    "MD": { name:  "Maryland", ev:  10, lean: 25 },
    "MA": { name:  "Massachusetts", ev:  11, lean: 25 },
    "MI": { name:  "Michigan", ev:  15, lean: 1 },
    "MN": { name: "Minnesota", ev: 10, lean: 3 },
    "MS": { name:  "Mississippi", ev:  6, lean:  -18 },
    "MO": { name: "Missouri", ev: 10, lean: -15 },
    "MT": { name:  "Montana", ev:  4, lean: -15 },
    "NE": { name: "Nebraska", ev: 5, lean: -18 },
    "NV": { name: "Nevada", ev: 6, lean: 1 },
    "NH": { name:  "New Hampshire", ev: 4, lean: 5 },
    "NJ": { name: "New Jersey", ev: 14, lean: 12 },
    "NM": { name: "New Mexico", ev: 5, lean: 8 },
    "NY": { name: "New York", ev:  28, lean: 20 },
    "NC": { name:  "North Carolina", ev: 16, lean: -1 },
    "ND": { name: "North Dakota", ev: 3, lean: -30 },
    "OH": { name:  "Ohio", ev:  17, lean: -8 },
    "OK": { name:  "Oklahoma", ev:  7, lean: -35 },
    "OR": { name:  "Oregon", ev:  8, lean: 12 },
    "PA": { name:  "Pennsylvania", ev:  19, lean:  0 },
    "RI": { name: "Rhode Island", ev: 4, lean: 18 },
    "SC": { name:  "South Carolina", ev: 9, lean: -12 },
    "SD": { name:  "South Dakota", ev: 3, lean: -25 },
    "TN": { name: "Tennessee", ev: 11, lean: -25 },
    "TX": { name:  "Texas", ev:  40, lean: -5 },
    "UT": { name: "Utah", ev: 6, lean: -18 },
    "VT": { name: "Vermont", ev: 3, lean: 25 },
    "VA": { name:  "Virginia", ev:  13, lean:  5 },
    "WA": { name: "Washington", ev: 12, lean: 15 },
    "WV": { name: "West Virginia", ev: 4, lean: -35 },
    "WI": { name: "Wisconsin", ev: 10, lean: 0 },
    "WY": { name: "Wyoming", ev: 3, lean: -40 }
};

const POLL_CLOSE_TIMES = {
    "IN": 18, "KY": 18, "GA": 19, "SC": 19, "VT": 19, "VA": 19, "FL": 19, "NH": 19,
    "NC": 19.5, "OH": 19.5, "WV": 19.5, "AL": 20, "CT": 20, "DE": 20, "DC": 20,
    "IL": 20, "ME": 20, "MD": 20, "MA": 20, "MI": 20, "MS": 20, "MO": 20, "NJ": 20,
    "OK": 20, "PA": 20, "RI": 20, "TN": 20, "TX": 20, "AR": 20.5, "AZ": 21, "CO": 21,
    "KS": 21, "LA": 21, "MN": 21, "NE": 21, "NM": 21, "NY": 21, "ND": 21, "SD": 21,
    "WI": 21, "WY": 21, "IA": 22, "MT": 22, "NV": 22, "UT": 22, "CA": 23, "HI": 24,
    "ID": 23, "OR": 23, "WA": 23, "AK": 25
};

var gameData = {
    currentDate: new Date("2028-07-04"),
    electionDay: new Date("2028-11-03"),
    selectedParty: null,
    candidate: null,
    vp: null,
    demTicket: { pres: null, vp: null },
    repTicket: { pres:  null, vp:  null },
    funds: 50,
    energy: 8,
    maxEnergy: 8,
    states: {},
    selectedState: null,
    historyStack: [],
    logs: []
};
