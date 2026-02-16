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
    thirdPartiesEnabled: false,  // Toggle for including third parties in election calculations
    // Interest group support tracking
    interestGroupSupport: {},  // Will store support % for each candidate per group
    interestGroupChanges: {},   // Will store last turn's changes for display
    // Pending campaign actions queue (applied on turn submission)
    pendingActions: [],  // Array of {type, state, countyId, issueId, intensity, cost}
    turnPressure: {}     // Track cumulative pressure per state+issue for diminishing returns
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
