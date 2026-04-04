/* ============================================
   DECISION 2028 - CONFIGURATION & DATA
   ============================================ */

const PARTIES = {
    D: { name: "Democratic Party", shortName: "Democrat", color: "#00AEF3", desc: "The Democratic Party stands as the center-left pillar of American politics. Rooted in the New Deal tradition and evolved through the Civil Rights era, today's Democrats champion expanded healthcare access, climate action, social equity, and robust worker protections. The party draws strength from a diverse coalition of urban professionals, minority communities, labor unions, and younger voters who believe government can be a force for positive change." },
    R: { name: "Republican Party", shortName: "Republican", color: "#E81B23", desc: "The Republican Party, shaped by Reaganism and the MAGA movement, stands as the voice of conservative America. Republicans champion free markets, lower taxes, strong national defense, traditional values, and border security. The party's base spans rural communities, evangelical Christians, small business owners, and working-class voters who distrust big government and embrace American exceptionalism." },
    G: { name: "Green Party", shortName: "Green", color: "#198754", desc: "The Green Party stands at the radical intersection of environmentalism and social justice. Greens advocate for a Green New Deal, universal healthcare, criminal justice reform, and a complete overhaul of America's fossil fuel economy. While operating on the political margins, the Greens serve as the conscience of the left, pushing the envelope on climate policy and corporate accountability." },
    L: { name: "Libertarian Party", shortName: "Libertarian", color: "#fd7e14", desc: "The Libertarian Party is America's third-largest political party, committed to maximizing individual liberty and minimizing government interference. Libertarians support free markets, civil liberties, non-interventionism abroad, and personal freedom on all social issues. Their philosophy of 'fiscally conservative, socially liberal' draws supporters disenchanted with both major parties' appetite for government power." },
    I: { name: "Independent", shortName: "Independent", color: "#9B59B6", desc: "Running as an Independent represents the ultimate political outsider campaign. Unbound by party orthodoxy, an Independent candidate must build a coalition from scratch, appealing across traditional party lines. Independents face enormous structural barriers—ballot access, debate exclusion, media skepticism—but in a polarized era, a credible Independent can reshape the national conversation and, in rare circumstances, win it all." },
    PSL: { name: "Party for Socialism and Liberation", shortName: "PSL", color: "#CC0000", desc: "The Party for Socialism and Liberation is a revolutionary socialist organization fighting for a future free from exploitation, oppression, and war. The PSL champions a working-class government, an end to racism and all forms of discrimination, and a socialist reorganization of the economy. Drawing on the Marxist-Leninist tradition, the PSL organizes communities of color, labor, and the poor to challenge corporate power and U.S. imperialism." }
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

const STATES = {
    "AL": { name: "Alabama", ev: 9, lean: -20, fips: "01" },
    "AK": { name: "Alaska", ev: 3, lean: -15, fips: "02" },
    "AZ": { name: "Arizona", ev: 11, lean: 0, fips: "04" },
    "AR": { name:  "Arkansas", ev:  6, lean: -25, fips: "05" },
    "CA": { name:  "California", ev:  54, lean: 25, fips: "06" },
    "CO": { name:  "Colorado", ev:  10, lean: 8, fips: "08" },
    "CT": { name:  "Connecticut", ev:  7, lean: 12, fips: "09" },
    "DE": { name:  "Delaware", ev:  3, lean:  15, fips: "10" },
    "DC": { name: "District of Columbia", ev: 3, lean: 80, fips: "11" },
    "FL": { name:  "Florida", ev:  30, lean: -3, fips: "12" },
    "GA": { name:  "Georgia", ev:  16, lean: 0, fips: "13" },
    "HI": { name: "Hawaii", ev: 4, lean: 25, fips: "15" },
    "ID": { name:  "Idaho", ev:  4, lean: -30, fips: "16" },
    "IL": { name:  "Illinois", ev:  19, lean: 15, fips: "17" },
    "IN": { name:  "Indiana", ev:  11, lean: -15, fips: "18" },
    "IA": { name: "Iowa", ev: 6, lean: -8, fips: "19" },
    "KS": { name: "Kansas", ev: 6, lean: -18, fips: "20" },
    "KY": { name: "Kentucky", ev: 8, lean: -25, fips: "21" },
    "LA": { name:  "Louisiana", ev:  8, lean:  -20, fips: "22" },
    "ME": { name:  "Maine", ev:  4, lean: 8, fips: "23" },
    "MD": { name:  "Maryland", ev:  10, lean: 25, fips: "24" },
    "MA": { name:  "Massachusetts", ev:  11, lean: 25, fips: "25" },
    "MI": { name:  "Michigan", ev:  15, lean: 1, fips: "26" },
    "MN": { name: "Minnesota", ev: 10, lean: 3, fips: "27" },
    "MS": { name:  "Mississippi", ev:  6, lean:  -18, fips: "28" },
    "MO": { name: "Missouri", ev: 10, lean: -15, fips: "29" },
    "MT": { name:  "Montana", ev:  4, lean: -15, fips: "30" },
    "NE": { name: "Nebraska", ev: 5, lean: -18, fips: "31" },
    "NV": { name: "Nevada", ev: 6, lean: 1, fips: "32" },
    "NH": { name:  "New Hampshire", ev: 4, lean: 5, fips: "33" },
    "NJ": { name: "New Jersey", ev: 14, lean: 12, fips: "34" },
    "NM": { name: "New Mexico", ev: 5, lean: 8, fips: "35" },
    "NY": { name: "New York", ev:  28, lean: 20, fips: "36" },
    "NC": { name:  "North Carolina", ev: 16, lean: -1, fips: "37" },
    "ND": { name: "North Dakota", ev: 3, lean: -30, fips: "38" },
    "OH": { name:  "Ohio", ev:  17, lean: -8, fips: "39" },
    "OK": { name:  "Oklahoma", ev:  7, lean: -35, fips: "40" },
    "OR": { name:  "Oregon", ev:  8, lean: 12, fips: "41" },
    "PA": { name:  "Pennsylvania", ev:  19, lean:  0, fips: "42" },
    "RI": { name: "Rhode Island", ev: 4, lean: 18, fips: "44" },
    "SC": { name:  "South Carolina", ev: 9, lean: -12, fips: "45" },
    "SD": { name:  "South Dakota", ev: 3, lean: -25, fips: "46" },
    "TN": { name: "Tennessee", ev: 11, lean: -25, fips: "47" },
    "TX": { name:  "Texas", ev:  40, lean: -5, fips: "48" },
    "UT": { name: "Utah", ev: 6, lean: -18, fips: "49" },
    "VT": { name: "Vermont", ev: 3, lean: 25, fips: "50" },
    "VA": { name:  "Virginia", ev:  13, lean:  5, fips: "51" },
    "WA": { name: "Washington", ev: 12, lean: 15, fips: "53" },
    "WV": { name: "West Virginia", ev: 4, lean: -35, fips: "54" },
    "WI": { name: "Wisconsin", ev: 10, lean: 0, fips: "55" },
    "WY": { name: "Wyoming", ev: 3, lean: -40, fips: "56" }
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
    thirdTickets: {},  // Keyed by party code (G, L, I, PSL)
    funds: 50,
    energy: 8,
    maxEnergy: 8,
    states: {},
    selectedState: null,
    historyStack: [],
    logs: [],
    pacEndorsements: [],
    lockedIssues: {},
    currentPacOffer: null,
    thirdPartiesEnabled: true,  // Toggle for including third parties in election calculations
    // Interest group support tracking
    interestGroupSupport: {},  // Will store support % for each candidate per group
    interestGroupChanges: {},   // Will store last turn's changes for display
    interestGroupTurnout: {},   // Per-group turnout propensity (1.0 = baseline 100%)
    // Pending campaign actions queue (applied on turn submission)
    pendingActions: [],  // Array of {type, state, countyId, issueId, intensity, cost}
    turnPressure: {},     // Track cumulative pressure per state+issue for diminishing returns
    // Per-turn polling cache: { stateCode: { D: 48.5, R: 44.2, ... }, county: { fips: {...} } }
    pollCache: {}
};

// ==== CAMPAIGN PERSUASION TUNING CONSTANTS ====
// All balanceable parameters in one place
var PERSUASION_CONSTANTS = {
    // Base persuasion strength per intensity level
    BASE_PERSUASION_AD: 0.02,           // Base margin shift per ad intensity point
    BASE_PERSUASION_SPEECH: 0.015,      // Base margin shift per speech intensity point
    BASE_PERSUASION_RALLY: 0.01,        // Base margin shift per rally (kept for compatibility)
    
    // Speech localized multiplier (county where speech occurs)
    SPEECH_LOCAL_MULTIPLIER: 2.5,       // 2.5x effect in the specific county
    
    // Diminishing returns
    PRESSURE_SCALAR: 0.15,              // Higher = faster diminishing returns
    
    // Interest group relationship (if implemented)
    RELATIONSHIP_SCALE: 0.05,           // How much each action affects group relationship
    RELATIONSHIP_DIVISOR: 20,           // Relationship score impact on effectiveness
    
    // Turnout effects (preserved from existing system)
    AD_TURNOUT_BOOST: 0.005,            // Small turnout boost per ad
    SPEECH_TURNOUT_BOOST: 0.01,         // Moderate turnout boost per speech
    RALLY_TURNOUT_BOOST: 0.05,          // Large turnout boost per rally
    
    // Cost structure
    AD_BASE_COST: 3.0,                  // Base cost in millions
    SPEECH_BASE_COST: 0.5,              // Base cost in millions
    RALLY_COST: 1.0,                    // Rally cost
    
    // Energy costs
    AD_ENERGY_COST: 0,                  // Ads don't require candidate presence
    SPEECH_ENERGY_COST: 1,              // Speeches require candidate
    RALLY_ENERGY_COST: 2                // Rallies require significant energy
};
