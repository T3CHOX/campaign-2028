/* ============================================
   DECISION 2028 - ISSUES SYSTEM
   ============================================ */

// 20 Core Issues with ID, name, and category
const CORE_ISSUES = [
    // Economic
    { id: 'economy', name: 'Economy/Jobs', category: 'Economic' },
    { id: 'taxation', name: 'Taxation', category: 'Economic' },
    { id: 'trade', name: 'Trade Policy', category: 'Economic' },
    { id: 'minwage', name: 'Minimum Wage', category: 'Economic' },
    { id: 'labor', name: 'Labor Rights', category: 'Economic' },
    // Social
    { id: 'abortion', name: 'Abortion', category: 'Social' },
    { id: 'lgbtq', name: 'LGBTQ+ Rights', category: 'Social' },
    { id: 'guns', name: 'Gun Control', category: 'Social' },
    { id: 'immigration', name: 'Immigration', category: 'Social' },
    { id: 'criminal', name: 'Criminal Justice', category: 'Social' },
    // Healthcare
    { id: 'healthcare', name: 'Healthcare System', category: 'Healthcare' },
    { id: 'drugpricing', name: 'Drug Pricing', category: 'Healthcare' },
    // Environment
    { id: 'climate', name: 'Climate Change', category: 'Environment' },
    { id: 'energy', name: 'Energy Policy', category: 'Environment' },
    // Foreign
    { id: 'foreign', name: 'Foreign Policy', category: 'Foreign' },
    { id: 'military', name: 'Military Spending', category: 'Foreign' },
    { id: 'israel', name: 'Israel/Palestine', category: 'Foreign' },
    // Governance
    { id: 'govspend', name: 'Government Spending', category: 'Governance' },
    { id: 'electionreform', name: 'Election Reform', category: 'Governance' },
    { id: 'scotus', name: 'Supreme Court', category: 'Governance' }
];

// Position scale descriptors (-10 to +10)
const POSITION_DESCRIPTORS = {
    guns: {
        '-10': 'Mandatory gun confiscation and ban on all firearms',
        '-7': 'Assault weapons ban, universal background checks, gun buybacks',
        '-4': 'Stricter background checks, red flag laws, waiting periods',
        '-1': 'Modest gun regulations, close loopholes',
        '0': 'Moderate position, balance rights and safety',
        '1': 'Protect Second Amendment with minimal restrictions',
        '4': 'Oppose most gun control, support concealed carry',
        '7': 'Oppose all gun restrictions, support constitutional carry',
        '10': 'Absolute Second Amendment rights, no restrictions whatsoever'
    },
    abortion: {
        '-10': 'Taxpayer-funded abortion on demand until birth',
        '-7': 'Full reproductive rights, expand access to abortion',
        '-4': 'Pro-choice, protect Roe v. Wade standards',
        '-1': 'Generally pro-choice with some restrictions',
        '0': 'Allow early-term with restrictions',
        '1': 'Generally pro-life with exceptions',
        '4': 'Restrict abortion except for rape, incest, mother\'s life',
        '7': 'Ban abortion except to save mother\'s life',
        '10': 'Complete abortion ban, no exceptions'
    },
    healthcare: {
        '-10': 'Single-payer Medicare for All, eliminate private insurance',
        '-7': 'Government-run universal healthcare system',
        '-4': 'Public option alongside private insurance',
        '-1': 'Expand ACA, increase subsidies',
        '0': 'Mixed public-private system',
        '1': 'Private insurance with modest reforms',
        '4': 'Free market healthcare, reduce regulations',
        '7': 'Fully privatized healthcare system',
        '10': 'Eliminate all government healthcare programs'
    },
    immigration: {
        '-10': 'Open borders, abolish ICE, citizenship for all',
        '-7': 'Broad amnesty, reduce deportations, sanctuary cities',
        '-4': 'Path to citizenship for dreamers, reform immigration system',
        '-1': 'Modest immigration reform, some protections',
        '0': 'Balance enforcement with reform',
        '1': 'Secure border with limited legal immigration',
        '4': 'Strict border security, reduce legal immigration',
        '7': 'Build wall, mass deportations, strict enforcement',
        '10': 'Immigration moratorium, deport all illegal immigrants'
    },
    climate: {
        '-10': 'Green New Deal, eliminate fossil fuels immediately',
        '-7': 'Aggressive climate action, net-zero by 2030',
        '-4': 'Strong climate regulations, clean energy transition',
        '-1': 'Support Paris Agreement, modest climate action',
        '0': 'Balanced approach to climate and economy',
        '1': 'Market-based climate solutions, limited regulations',
        '4': 'Minimal climate regulations, energy independence',
        '7': 'Oppose climate regulations, expand fossil fuels',
        '10': 'Deny climate change, eliminate EPA'
    },
    taxation: {
        '-10': 'Wealth tax, 70%+ top rates, massive redistribution',
        '-7': 'Progressive taxation, raise taxes on wealthy',
        '-4': 'Increase top marginal tax rates',
        '-1': 'Modest tax increases on high earners',
        '0': 'Keep current tax structure',
        '1': 'Minor tax cuts, simplify code',
        '4': 'Significant tax cuts, lower corporate rates',
        '7': 'Flat tax, major tax cuts',
        '10': 'Eliminate income tax, minimal government'
    }
};

// State issue positions (average voter position on -10 to +10 scale)
const STATE_ISSUE_POSITIONS = {
    'CA': {
        guns: -6, abortion: -5, healthcare: -6, immigration: -6, climate: -7,
        taxation: -5, trade: -2, minwage: -6, labor: -6, lgbtq: -7,
        criminal: -5, drugpricing: -6, energy: -6, foreign: -3, military: 0,
        israel: -2, govspend: -4, electionreform: -5, scotus: -5, economy: -3
    },
    'TX': {
        guns: 6, abortion: 4, healthcare: 4, immigration: 5, climate: 3,
        taxation: 5, trade: 2, minwage: 3, labor: 2, lgbtq: 2,
        criminal: 4, drugpricing: 0, energy: 4, foreign: 2, military: 4,
        israel: 3, govspend: 4, electionreform: 0, scotus: 3, economy: 2
    },
    'FL': {
        guns: 4, abortion: 2, healthcare: 2, immigration: 4, climate: 1,
        taxation: 4, trade: 1, minwage: 1, labor: 1, lgbtq: 1,
        criminal: 3, drugpricing: -1, energy: 2, foreign: 1, military: 3,
        israel: 2, govspend: 3, electionreform: -1, scotus: 2, economy: 1
    },
    'NY': {
        guns: -6, abortion: -6, healthcare: -5, immigration: -5, climate: -6,
        taxation: -4, trade: -2, minwage: -5, labor: -5, lgbtq: -6,
        criminal: -4, drugpricing: -5, energy: -5, foreign: -2, military: -1,
        israel: -1, govspend: -3, electionreform: -4, scotus: -4, economy: -2
    },
    'PA': {
        guns: 1, abortion: 0, healthcare: -1, immigration: 1, climate: -1,
        taxation: 0, trade: 0, minwage: -1, labor: 0, lgbtq: 0,
        criminal: 1, drugpricing: -2, energy: 0, foreign: 0, military: 1,
        israel: 0, govspend: 0, electionreform: -1, scotus: 0, economy: 0
    },
    'OH': {
        guns: 3, abortion: 2, healthcare: 1, immigration: 3, climate: 2,
        taxation: 2, trade: 1, minwage: 0, labor: 0, lgbtq: 1,
        criminal: 2, drugpricing: -1, energy: 2, foreign: 1, military: 2,
        israel: 1, govspend: 2, electionreform: 0, scotus: 1, economy: 1
    },
    'MI': {
        guns: 1, abortion: 0, healthcare: -1, immigration: 1, climate: 0,
        taxation: 0, trade: -1, minwage: -1, labor: -1, lgbtq: 0,
        criminal: 1, drugpricing: -2, energy: 0, foreign: 0, military: 1,
        israel: 0, govspend: 0, electionreform: -1, scotus: 0, economy: -1
    },
    'GA': {
        guns: 4, abortion: 3, healthcare: 2, immigration: 3, climate: 2,
        taxation: 3, trade: 1, minwage: 2, labor: 1, lgbtq: 1,
        criminal: 3, drugpricing: 0, energy: 2, foreign: 1, military: 3,
        israel: 2, govspend: 3, electionreform: 0, scotus: 2, economy: 1
    },
    'NC': {
        guns: 3, abortion: 2, healthcare: 1, immigration: 2, climate: 1,
        taxation: 2, trade: 1, minwage: 1, labor: 1, lgbtq: 1,
        criminal: 2, drugpricing: -1, energy: 1, foreign: 1, military: 2,
        israel: 1, govspend: 2, electionreform: 0, scotus: 1, economy: 1
    },
    'AZ': {
        guns: 2, abortion: 1, healthcare: 1, immigration: 3, climate: 1,
        taxation: 2, trade: 1, minwage: 0, labor: 0, lgbtq: 0,
        criminal: 2, drugpricing: -1, energy: 1, foreign: 1, military: 2,
        israel: 1, govspend: 1, electionreform: 0, scotus: 1, economy: 1
    },
    'WI': {
        guns: 1, abortion: 0, healthcare: -1, immigration: 1, climate: 0,
        taxation: 0, trade: 0, minwage: -1, labor: 0, lgbtq: 0,
        criminal: 1, drugpricing: -2, energy: 0, foreign: 0, military: 1,
        israel: 0, govspend: 0, electionreform: -1, scotus: 0, economy: 0
    },
    'NV': {
        guns: 0, abortion: -1, healthcare: -1, immigration: 0, climate: -1,
        taxation: 0, trade: 0, minwage: -1, labor: -1, lgbtq: -1,
        criminal: 0, drugpricing: -2, energy: 0, foreign: 0, military: 1,
        israel: 0, govspend: 0, electionreform: -1, scotus: 0, economy: 0
    }
};

// Fill in remaining states with regional defaults
['AL', 'AK', 'AR', 'ID', 'IN', 'IA', 'KS', 'KY', 'LA', 'MS', 'MO', 'MT', 'NE', 'ND', 'OK', 'SC', 'SD', 'TN', 'UT', 'WV', 'WY'].forEach(function(state) {
    STATE_ISSUE_POSITIONS[state] = {
        guns: 6, abortion: 5, healthcare: 4, immigration: 5, climate: 3,
        taxation: 5, trade: 2, minwage: 4, labor: 3, lgbtq: 3,
        criminal: 4, drugpricing: 1, energy: 4, foreign: 2, military: 4,
        israel: 3, govspend: 5, electionreform: 1, scotus: 4, economy: 3
    };
});

['CO', 'CT', 'DE', 'HI', 'IL', 'ME', 'MD', 'MA', 'MN', 'NH', 'NJ', 'NM', 'OR', 'RI', 'VT', 'VA', 'WA', 'DC'].forEach(function(state) {
    STATE_ISSUE_POSITIONS[state] = {
        guns: -4, abortion: -4, healthcare: -4, immigration: -4, climate: -5,
        taxation: -3, trade: -1, minwage: -4, labor: -4, lgbtq: -5,
        criminal: -3, drugpricing: -4, energy: -4, foreign: -1, military: 0,
        israel: -1, govspend: -2, electionreform: -3, scotus: -3, economy: -2
    };
});

// Issue salience per state (0-10 scale: how important is this issue?)
const ISSUE_SALIENCE = {
    'AZ': { immigration: 9, climate: 6, economy: 8 },
    'FL': { immigration: 7, climate: 7, economy: 8, healthcare: 7 },
    'TX': { immigration: 8, economy: 9, energy: 7 },
    'CA': { climate: 9, housing: 8, immigration: 7 },
    'default': { economy: 8, healthcare: 7, immigration: 5, climate: 5 }
};

// Issue-to-demographic baseline modifiers (progressive positions boost positive values)
const ISSUE_GROUP_BASELINE_EFFECTS = {
    labor: { union: 3.0, urban: 1.5, college: 1.0, bluecollar: 1.2, smallbusiness: -2.0 },
    taxation: { smallbusiness: 4.0, suburban: 2.0, college: 1.0, union: -3.0, progressives: -2.0, centrists: 1.0 },
    climate: { progressives: 4.0, urban: 2.0, college: 1.0, rural: -2.0, farmers: -2.0 },
    energy: { rural: 2.0, smallbusiness: 1.5, union: 1.0, urban: -1.5, progressives: -2.0 },
    economy: { noncollege: 1.5, suburban: 1.0, rural: 1.0, union: 1.0, smallbusiness: 1.0, college: 0.5 },
    immigration: { hispanic: 3.0, asian: 1.5, urban: 1.0, rural: -2.0, evangelical: -1.0 },
    healthcare: { seniors: 2.0, women: 1.5, urban: 1.0, rural: 1.0, smallbusiness: -1.0 },
    guns: { rural: 2.0, evangelical: 1.5, urban: -1.5, suburban: -1.0 },
    abortion: { women: 2.5, secular: 2.0, evangelical: -2.5, rural: -1.0 },
    criminal: { black: 2.0, urban: 1.5, rural: -1.0, suburban: -0.5 },
    lgbtq: { lgbtq_community: 2.5, urban: 1.0, suburban: 0.5, evangelical: -2.0 },
    govspend: { rural: 3.5, noncollege: 2.0, smallbusiness: 2.0, suburban: 1.0 }
};

const ISSUE_SYNERGY_EFFECTS = [
    {
        issues: ['climate', 'labor'],
        threshold: -4,
        effects: { union: 1.5, progressives: 1.5, urban: 1.0 }
    },
    {
        issues: ['taxation', 'economy'],
        threshold: 4,
        effects: { smallbusiness: 1.5, suburban: 1.0, whitecollar: 0.8 }
    },
    {
        issues: ['immigration', 'economy'],
        threshold: -3,
        effects: { hispanic: 1.0, asian: 0.8, urban: 0.6 }
    }
];

const ISSUE_COALITION_CONFLICTS = [
    {
        label: 'Union vs. Business Coalition Tension',
        issues: [{ id: 'labor', max: -4 }, { id: 'taxation', min: 4 }]
    },
    {
        label: 'Climate vs. Energy Coalition Tension',
        issues: [{ id: 'climate', max: -4 }, { id: 'energy', min: 4 }]
    },
    {
        label: 'Social Liberties vs. Religious Base Tension',
        issues: [{ id: 'abortion', max: -4 }, { id: 'guns', max: -3 }]
    }
];

// Candidate issue positions are defined in candidates.js (CANDIDATE_POSITIONS)

// --- NEW V2 ISSUES CONSTANTS ---

// Dealbreaker thresholds by demographic group
const DEALBREAKER_THRESHOLDS = {
    'evangelical': {
        'abortion': { min: -1 }, // If you are -2 or lower (pro-choice), dealbreaker
        'guns': { min: -2 }
    },
    'union': {
        'labor': { max: 2 }, // If you are 3 or higher (anti-union), dealbreaker
        'minwage': { max: 3 }
    },
    'progressives': {
        'climate': { max: 1 },
        'healthcare': { max: 2 }
    },
    'black': {
        'criminal': { max: 2 }
    },
    'hispanic': {
        'immigration': { max: 4 }
    }
};

// Polarization profile for each issue. 
// "high" means highly clustered bases. "low" means a flat distribution where moderation works best.
const ISSUE_POLARIZATION = {
    'abortion': 'high',
    'guns': 'high',
    'immigration': 'high',
    'climate': 'high',
    'healthcare': 'medium',
    'economy': 'low',
    'taxation': 'medium',
    'trade': 'low',
    'minwage': 'low',
    'labor': 'medium',
    'lgbtq': 'high',
    'criminal': 'medium',
    'drugpricing': 'low',
    'energy': 'medium',
    'foreign': 'low',
    'military': 'low',
    'israel': 'medium',
    'govspend': 'low',
    'electionreform': 'low',
    'scotus': 'medium'
};

// Base credibility assigned when a candidate of this party is initialized.
const BASE_ISSUE_CREDIBILITY = {
    'D': {
        'healthcare': 0.8, 'climate': 0.8, 'abortion': 0.8, 'labor': 0.8, 'lgbtq': 0.8, 'minwage': 0.8,
        'economy': 0.5, 'taxation': 0.5, 'trade': 0.5, 'guns': 0.5, 'immigration': 0.5, 'criminal': 0.6,
        'drugpricing': 0.7, 'energy': 0.6, 'foreign': 0.5, 'military': 0.4, 'israel': 0.5, 'govspend': 0.4,
        'electionreform': 0.7, 'scotus': 0.6
    },
    'R': {
        'economy': 0.8, 'taxation': 0.8, 'immigration': 0.8, 'guns': 0.8, 'military': 0.8, 'govspend': 0.8,
        'healthcare': 0.5, 'climate': 0.4, 'abortion': 0.8, 'labor': 0.4, 'lgbtq': 0.4, 'minwage': 0.4,
        'trade': 0.6, 'criminal': 0.7, 'drugpricing': 0.5, 'energy': 0.8, 'foreign': 0.7, 'israel': 0.8,
        'electionreform': 0.4, 'scotus': 0.8
    }
};
