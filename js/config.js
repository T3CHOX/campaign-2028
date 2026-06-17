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

const REGIONS = {
    midwest: ["WI", "MI", "PA", "OH", "MN", "IA", "IN", "IL", "MO"],
    northeast: ["ME", "NH", "VT", "MA", "RI", "CT", "NY", "NJ", "PA", "DE", "MD", "DC"],
    south: ["VA", "WV", "KY", "TN", "NC", "SC", "GA", "FL", "AL", "MS", "AR", "LA", "TX", "OK"],
    west: ["AZ", "NM", "CO", "UT", "NV", "CA", "OR", "WA", "ID", "MT", "WY", "AK", "HI"],
    sunbelt: ["AZ", "NV", "NM", "TX", "FL", "GA", "NC", "SC"]
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

const COUNTY_POLL_CLOSE_OVERRIDES = {
    '12005': 20,
    '12013': 20,
    '12033': 20,
    '12045': 20,
    '12059': 20,
    '12063': 20,
    '12091': 20,
    '12113': 20,
    '12131': 20,
    '12133': 20,
    '16001': 22,
    '16003': 22,
    '16005': 22,
    '16007': 22,
    '16011': 22,
    '16013': 22,
    '16015': 22,
    '16019': 22,
    '16023': 22,
    '16025': 22,
    '16027': 22,
    '16029': 22,
    '16031': 22,
    '16033': 22,
    '16037': 22,
    '16039': 22,
    '16041': 22,
    '16043': 22,
    '16045': 22,
    '16047': 22,
    '16051': 22,
    '16053': 22,
    '16059': 22,
    '16063': 22,
    '16065': 22,
    '16067': 22,
    '16071': 22,
    '16073': 22,
    '16075': 22,
    '16077': 22,
    '16081': 22,
    '16083': 22,
    '16085': 22,
    '16087': 22,
    '18051': 19,
    '18073': 19,
    '18089': 19,
    '18091': 19,
    '18111': 19,
    '18125': 19,
    '18127': 19,
    '18129': 19,
    '18147': 19,
    '18163': 19,
    '18173': 19,
    '20071': 22,
    '20075': 22,
    '20181': 22,
    '20199': 22,
    '21001': 19,
    '21003': 19,
    '21007': 19,
    '21009': 19,
    '21027': 19,
    '21031': 19,
    '21033': 19,
    '21035': 19,
    '21039': 19,
    '21047': 19,
    '21053': 19,
    '21055': 19,
    '21057': 19,
    '21059': 19,
    '21061': 19,
    '21075': 19,
    '21083': 19,
    '21085': 19,
    '21087': 19,
    '21091': 19,
    '21099': 19,
    '21101': 19,
    '21105': 19,
    '21107': 19,
    '21139': 19,
    '21141': 19,
    '21143': 19,
    '21145': 19,
    '21149': 19,
    '21157': 19,
    '21169': 19,
    '21171': 19,
    '21177': 19,
    '21183': 19,
    '21207': 19,
    '21213': 19,
    '21219': 19,
    '21221': 19,
    '21225': 19,
    '21227': 19,
    '21231': 19,
    '21233': 19,
    '26043': 21,
    '26053': 21,
    '26071': 21,
    '26109': 21,
    '38001': 22,
    '38007': 22,
    '38011': 22,
    '38025': 22,
    '38033': 22,
    '38037': 22,
    '38041': 22,
    '38053': 22,
    '38057': 22,
    '38059': 22,
    '38065': 22,
    '38087': 22,
    '38089': 22,
    '41045': 22,
    '46007': 22,
    '46019': 22,
    '46031': 22,
    '46033': 22,
    '46041': 22,
    '46047': 22,
    '46055': 22,
    '46063': 22,
    '46071': 22,
    '46081': 22,
    '46093': 22,
    '46102': 22,
    '46103': 22,
    '46105': 22,
    '46117': 22,
    '46137': 22,
    '48141': 21,
    '48229': 21
};

// Split-county shares and baseline D/R values mirror the product requirements
// for ME/NE district simulation and are used as district-level anchor PVIs.
const SPLIT_ELECTORAL_RULES = {
    NE: {
        statewideEV: 2,
        defaultDistrict: 'NE-3',
        countyDistrictMap: {
            '31055': 'NE-1', // Douglas
            '31025': 'NE-1', // Cass
            '31053': 'NE-1', // Dodge
            '31155': 'NE-1', // Saunders
            '31177': 'NE-1', // Washington
            '31109': 'NE-2', // Lancaster
            '31001': 'NE-2', // Adams
            '31019': 'NE-2', // Buffalo
            '31079': 'NE-2', // Hall
            '31181': 'NE-2'  // Webster
        },
        splitCounties: {
            '31173': [ // Thurston
                { district: 'NE-3', share: 0.963, baseline: { D: 47.59, R: 52.41 } },
                { district: 'NE-1', share: 0.037, baseline: { D: 27.73, R: 72.27 } }
            ],
            '31153': [ // Sarpy
                { district: 'NE-1', share: 0.389, baseline: { D: 44.26, R: 55.74 } },
                { district: 'NE-2', share: 0.611, baseline: { D: 40.45, R: 55.74 } }
            ]
        }
    },
    ME: {
        statewideEV: 2,
        defaultDistrict: 'ME-2',
        countyDistrictMap: {
            '23031': 'ME-1', // York
            '23005': 'ME-1', // Cumberland
            '23023': 'ME-1', // Sagadahoc
            '23015': 'ME-1', // Lincoln
            '23013': 'ME-1'  // Knox
        },
        splitCounties: {
            '23011': [ // Kennebec
                { district: 'ME-1', share: 0.62, baseline: { D: 52.7, R: 47.3 } },
                { district: 'ME-2', share: 0.38, baseline: { D: 44.34, R: 55.66 } }
            ]
        }
    }
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
    interestGroupBaseSupport: {}, // Baseline support before issue modifiers
    campaignGroupMomentum: {},  // Campaign-action relationship deltas by group/candidate
    interestGroupTurnout: {},   // Per-group turnout rate (0-1 baseline before multipliers)
    issueTurnout: {},           // Issue-driven turnout rate (before coalition multipliers)
    coalitionStatus: {},        // Per-group loyalty tracking
    coalitionAlerts: [],        // Active coalition warnings
    favorability: 0.5,          // Voter favorability, 0.0-1.0
    credibility: 1.0,           // Legacy alias for older save/UI paths
    messageStreak: 0,
    lastMessageIssue: null,
    mediaVulnerabilities: [],   // Active media vulnerabilities from fundraising
    currentFundraiseMeeting: null,
    playerPressure: {},         // Player action pressure per state
    // Pending campaign actions queue (applied on turn submission)
    pendingActions: [],  // Array of {type, state, countyId, issueId, intensity, cost}
    turnPressure: {},     // Track cumulative pressure per state+issue for diminishing returns
    // Per-turn polling cache: { stateCode: { D: 48.5, R: 44.2, ... }, county: { fips: {...} } }
    pollCache: {},
    // === v2 NEW FIELDS ===
    campaignMomentum: 0,        // Range: -1.0 to +1.0; tracks winning/losing streak
    issueFatigueMap: {},         // {stateCode: {issueId: consecutiveWeeks}}
    debatePrepBuff: false,       // True if player queued DEBATE PREP this cycle
    oppoResearchCooldown: {},    // {partyCode: true} prevents consecutive targeting
    approvalRating: 0.5,         // Player approval rating (0.30-0.80)
    nationalPolls: [],           // Array of {D: %, R: %, ...} with variance
    activeScandals: [],          // Scandals affecting any candidate
    endorsements: [],            // Active endorsement effects
    freeMediaUsed: false,        // Prevents double free media per momentum peak
    grassrootsUsedThisWeek: 0,   // Grassroots fundraise count this week (max 2)
    weatherModifier: null,       // Weather event for election week
    ballotAccess: {},            // {partyCode: [accessible state codes]}
    turnStatesUsed: [],          // States targeted this turn (max 3)
    turnActionCounts: {},        // {stateCode_actionType: count} for 2-per-state cap
    visitedStatesThisTurn: []    // States physically visited (Speech/Rally) this turn
};

// ==== CAMPAIGN PERSUASION TUNING CONSTANTS ====
// All balanceable parameters in one place
var PERSUASION_CONSTANTS = {
    // Base persuasion strength per intensity level
    BASE_PERSUASION_AD: 0.02,           // Base margin shift per ad intensity point
    BASE_PERSUASION_SPEECH: 0.015,      // Base margin shift per speech intensity point
    BASE_PERSUASION_RALLY: 0.01,        // Base margin shift per rally (kept for compatibility)
    BASE_PERSUASION_DIGITAL: 0.012,     // Base margin shift per digital intensity point
    
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
    FIELD_TURNOUT_BOOST: 0.08,          // Strong turnout boost per field action
    DIGITAL_TURNOUT_BOOST: 0.03,        // Digital turnout boost per action
    
    // Cost structure
    AD_BASE_COST: 3.0,                  // Base cost in millions
    SPEECH_BASE_COST: 0.5,              // Base cost in millions
    RALLY_COST: 1.0,                    // Rally cost
    FIELD_BASE_COST: 2.5,               // Field operations cost
    DIGITAL_BASE_COST: 1.5,             // Digital campaign cost
    
    // Energy costs
    AD_ENERGY_COST: 0,                  // Ads don't require candidate presence
    SPEECH_ENERGY_COST: 1,              // Speeches require candidate
    RALLY_ENERGY_COST: 2,               // Rallies require significant energy
    FIELD_ENERGY_COST: 1,               // Field ops require staff energy
    DIGITAL_ENERGY_COST: 0,             // Digital campaigns are staff-driven
    
    // v2 New action costs
    SURROGATE_BASE_COST: 1.0,           // Surrogate action base cost
    SURROGATE_SCALE: 0.6,               // 60% of AD persuasion effect
    SURROGATE_ENERGY_COST: 0,           // Surrogates don't require candidate
    DEBATE_PREP_COST: 0.75,             // Debate prep cost
    DEBATE_PREP_ENERGY_COST: 1,         // Debate prep energy
    OPPO_RESEARCH_COST: 2.0,            // Oppo research cost
    OPPO_RESEARCH_ENERGY_COST: 1,       // Oppo research energy
    SURROGATE_TURNOUT_BOOST: 0.003,     // 60% of AD turnout boost
    
    // v2 Turnout cap
    TURNOUT_BOOST_CAP: 0.18,            // Max cumulative turnout boost above turnoutBase per state
    
    // v2 Intensity scaling multipliers
    INTENSITY_MULTIPLIERS: { 1: 1.0, 2: 1.7, 3: 2.2 }
};

// Credibility + fundraising tuning
var FAVORABILITY_CONSTANTS = {
    MIN: 0.25,
    MAX: 0.75,
    BASE: 0.5,
    STREAK_BONUS: 0.015,
    SWAP_PENALTY: 0.02,
    SHIFT_PENALTY: 0.03
};
var CREDIBILITY_CONSTANTS = FAVORABILITY_CONSTANTS;

var FUNDRAISE_CONSTANTS = {
    BUNDLER_CHANCE: 0.3,
    MAX_OPTIONS: 3,
    MEETING_ENERGY_COST: 1,
    MEETING_BASE_VARIANCE: 0.2,
    BUNDLER_CREDIBILITY_PENALTY: 0.06,
    BUNDLER_TURNOUT_PENALTY: -0.05
};

var COALITION_CONSTANTS = {
    RECOVERY_RATE: 0.04,
    DECAY_BASE: 0.05,
    DECAY_ESCALATION: 0.02,
    AT_RISK_LOYALTY: 0.82,
    COLLAPSE_LOYALTY: 0.65
};

const TARGETABLE_GROUPS = [
    'white', 'black', 'hispanic', 'asian', 'native',
    'urban', 'suburban', 'rural',
    'union', 'college', 'noncollege',
    'bluecollar', 'whitecollar', 'smallbusiness',
    'tech', 'farmers', 'military',
    'evangelical', 'catholic', 'jewish', 'muslim', 'secular',
    'progressives', 'libertarians', 'maga', 'centrists',
    'youth', 'seniors', 'women', 'lgbtq_community',
    'genz', 'suburban_women'  // v2 new groups
];

// === v2 NEW CONSTANTS ===

var MOMENTUM_CONSTANTS = {
    DECAY: 0.85,            // Weekly decay toward 0
    WEEKLY_GAIN: 0.07,      // Gain per week of net positive polling
    WEEKLY_LOSS: 0.07,      // Loss per week of net negative polling
    EFFECT_SCALE: 0.15,     // Multiplier on action deltas: (1 + EFFECT_SCALE * momentum)
    FREE_MEDIA_THRESHOLD: 0.5,  // Momentum needed for free media
    FREE_MEDIA_RESET: 0.3      // Momentum drops below this to reset free media flag
};

var DEBATE_SCHEDULE = [
    { week: 3, type: 'presidential', label: 'Presidential Debate #1' },
    { week: 7, type: 'vp', label: 'Vice Presidential Debate' },
    { week: 11, type: 'presidential', label: 'Presidential Debate #2' },
    { week: 15, type: 'presidential', label: 'Presidential Debate #3' }
];

var BALLOT_ACCESS_COSTS = {
    L: { cost: 2.0, initialStates: 51 },   // All 50 + DC
    G: { cost: 3.5, initialStates: 40 },
    PSL: { cost: 4.0, initialStates: 25 },
    I: { cost: 5.0, initialStates: 30 }
};

var TURN_BUDGET = {
    MAX_STATES_PER_TURN: 3,
    MAX_SAME_ACTION_PER_STATE: 2
};
