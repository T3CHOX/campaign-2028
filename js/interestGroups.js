/* ============================================
   DECISION 2028 - INTEREST GROUPS & DEMOGRAPHICS
   ============================================ */

// Interest Groups with priorities and baseline leans
const INTEREST_GROUPS = {
    // Racial/Ethnic
    white: {
        name: 'White Voters',
        category: 'Racial/Ethnic',
        baseline: 2, // Slight R lean
        priorities: ['economy', 'taxation', 'immigration'],
        support: { D: 42, R: 55, I: 3, G: 0, L: 0, PSL: 0 }
    },
    black: {
        name: 'African American',
        category: 'Racial/Ethnic',
        baseline: -7, // Strong D lean
        priorities: ['criminal', 'healthcare', 'economy'],
        support: { D: 81, R: 17, I: 2, G: 0, L: 0, PSL: 0 }
    },
    hispanic: {
        name: 'Hispanic/Latino',
        category: 'Racial/Ethnic',
        baseline: -3, // Moderate D lean
        priorities: ['immigration', 'economy', 'healthcare'],
        support: { D: 50, R: 48, I: 2, G: 0, L: 0, PSL: 0 }
    },
    asian: {
        name: 'Asian American',
        category: 'Racial/Ethnic',
        baseline: -2, // Slight D lean
        priorities: ['economy', 'healthcare', 'immigration'],
        support: { D: 58, R: 40, I: 2, G: 0, L: 0, PSL: 0 }
    },
    native: {
        name: 'Native American',
        category: 'Racial/Ethnic',
        baseline: -4, // Moderate D lean
        priorities: ['healthcare', 'environment', 'economy'],
        support: { D: 57, R: 40, I: 3, G: 0, L: 0, PSL: 0 }
    },
    
    // Religious
    evangelical: {
        name: 'Evangelical',
        category: 'Religious',
        baseline: 6, // Strong R lean
        priorities: ['abortion', 'lgbtq', 'religious_freedom'],
        support: { D: 17, R: 81, I: 2, G: 0, L: 0, PSL: 0 }
    },
    catholic: {
        name: 'Catholic',
        category: 'Religious',
        baseline: 1, // Slight R lean
        priorities: ['abortion', 'immigration', 'healthcare'],
        support: { D: 45, R: 53, I: 2, G: 0, L: 0, PSL: 0 }
    },
    jewish: {
        name: 'Jewish',
        category: 'Religious',
        baseline: -3, // Moderate D lean
        priorities: ['israel', 'criminal', 'healthcare'],
        support: { D: 68, R: 29, I: 3, G: 0, L: 0, PSL: 0 }
    },
    muslim: {
        name: 'Muslim',
        category: 'Religious',
        baseline: -5, // Strong D lean
        priorities: ['foreign', 'immigration', 'civil_rights'],
        support: { D: 58, R: 32, I: 10, G: 0, L: 0, PSL: 0 }
    },
    secular: {
        name: 'Secular/None',
        category: 'Religious',
        baseline: -4, // Moderate D lean
        priorities: ['climate', 'healthcare', 'lgbtq'],
        support: { D: 67, R: 29, I: 4, G: 0, L: 0, PSL: 0 }
    },
    
    // Occupational
    bluecollar: {
        name: 'Blue Collar Workers',
        category: 'Occupational',
        baseline: 1, // Slight R lean
        priorities: ['economy', 'trade', 'labor'],
        support: { D: 39, R: 58, I: 3, G: 0, L: 0, PSL: 0 }
    },
    whitecollar: {
        name: 'White Collar Professionals',
        category: 'Occupational',
        baseline: -1, // Slight D lean
        priorities: ['economy', 'taxation', 'healthcare'],
        support: { D: 52, R: 45, I: 3, G: 0, L: 0, PSL: 0 }
    },
    smallbusiness: {
        name: 'Small Business Owners',
        category: 'Occupational',
        baseline: 3, // Moderate R lean
        priorities: ['taxation', 'economy', 'govspend'],
        support: { D: 37, R: 60, I: 3, G: 0, L: 0, PSL: 0 }
    },
    union: {
        name: 'Union Workers',
        category: 'Occupational',
        baseline: -4, // Moderate D lean
        priorities: ['labor', 'economy', 'healthcare'],
        support: { D: 49, R: 50, I: 1, G: 0, L: 0, PSL: 0 }
    },
    tech: {
        name: 'Tech Workers',
        category: 'Occupational',
        baseline: -2, // Slight D lean
        priorities: ['economy', 'immigration', 'climate'],
        support: { D: 62, R: 35, I: 3, G: 0, L: 0, PSL: 0 }
    },
    farmers: {
        name: 'Farmers',
        category: 'Occupational',
        baseline: 4, // Moderate R lean
        priorities: ['trade', 'economy', 'govspend'],
        support: { D: 24, R: 73, I: 3, G: 0, L: 0, PSL: 0 }
    },
    military: {
        name: 'Military/Veterans',
        category: 'Occupational',
        baseline: 3, // Moderate R lean
        priorities: ['military', 'foreign', 'economy'],
        support: { D: 36, R: 61, I: 3, G: 0, L: 0, PSL: 0 }
    },
    
    // Demographic
    college: {
        name: 'College Educated',
        category: 'Demographic',
        baseline: -2, // Slight D lean
        priorities: ['economy', 'climate', 'healthcare'],
        support: { D: 56, R: 42, I: 2, G: 0, L: 0, PSL: 0 }
    },
    noncollege: {
        name: 'Non-College',
        category: 'Demographic',
        baseline: 2, // Slight R lean
        priorities: ['economy', 'jobs', 'immigration'],
        support: { D: 41, R: 56, I: 3, G: 0, L: 0, PSL: 0 }
    },
    suburban: {
        name: 'Suburban Voters',
        category: 'Demographic',
        baseline: 0, // Neutral
        priorities: ['economy', 'healthcare', 'education'],
        support: { D: 49, R: 49, I: 2, G: 0, L: 0, PSL: 0 }
    },
    urban: {
        name: 'Urban',
        category: 'Demographic',
        baseline: -5, // Strong D lean
        priorities: ['climate', 'healthcare', 'criminal'],
        support: { D: 63, R: 33, I: 4, G: 0, L: 0, PSL: 0 }
    },
    rural: {
        name: 'Rural',
        category: 'Demographic',
        baseline: 5, // Strong R lean
        priorities: ['economy', 'guns', 'trade'],
        support: { D: 28, R: 70, I: 2, G: 0, L: 0, PSL: 0 }
    },
    youth: {
        name: 'Youth (18-29)',
        category: 'Demographic',
        baseline: -4, // Moderate D lean
        priorities: ['climate', 'economy', 'healthcare'],
        support: { D: 57, R: 38, I: 5, G: 0, L: 0, PSL: 0 }
    },
    seniors: {
        name: 'Seniors (65+)',
        category: 'Demographic',
        baseline: 2, // Slight R lean
        priorities: ['healthcare', 'social_security', 'economy'],
        support: { D: 47, R: 51, I: 2, G: 0, L: 0, PSL: 0 }
    },
    
    // Political Orientation
    progressives: {
        name: 'Progressives',
        category: 'Political',
        baseline: -8, // Very Strong D lean
        priorities: ['climate', 'healthcare', 'inequality'],
        support: { D: 86, R: 4, I: 10, G: 0, L: 0, PSL: 0 }
    },
    libertarians: {
        name: 'Libertarians',
        category: 'Political',
        baseline: 5, // Moderate R lean
        priorities: ['freedom', 'taxation', 'govspend'],
        support: { D: 8, R: 70, I: 22, G: 0, L: 0, PSL: 0 }
    },
    maga: {
        name: 'MAGA',
        category: 'Political',
        baseline: 9, // Extreme R lean
        priorities: ['immigration', 'trade', 'nationalism'],
        support: { D: 0, R: 99, I: 1, G: 0, L: 0, PSL: 0 }
    },
    centrists: {
        name: 'Centrists',
        category: 'Political',
        baseline: 0, // Neutral
        priorities: ['economy', 'bipartisanship', 'pragmatism'],
        support: { D: 47, R: 50, I: 3, G: 0, L: 0, PSL: 0 }
    },
    
    // Gender/Orientation
    lgbtq_community: {
        name: 'LGBTQ+ Community',
        category: 'Gender/Orientation',
        baseline: -6, // Strong D lean
        priorities: ['lgbtq', 'healthcare', 'civil_rights'],
        support: { D: 78, R: 18, I: 4, G: 0, L: 0, PSL: 0 }
    },
    
    women: {
        name: 'Women Voters',
        category: 'Gender/Orientation',
        baseline: -2, // Slight D lean
        priorities: ['healthcare', 'abortion', 'economy'],
        support: { D: 53, R: 44, I: 3, G: 0, L: 0, PSL: 0 }
    }
};

// Baseline turnout rates (share of voting-eligible citizens who vote)
var BASE_TURNOUT_RATES = {
    white: 0.71,
    black: 0.62,
    hispanic: 0.54,
    asian: 0.59,
    native: 0.52,
    evangelical: 0.80,
    catholic: 0.66,
    jewish: 0.76,
    muslim: 0.61,
    secular: 0.68,
    bluecollar: 0.56,
    whitecollar: 0.74,
    smallbusiness: 0.76,
    union: 0.68,
    tech: 0.73,
    farmers: 0.75,
    military: 0.70,
    college: 0.80,
    noncollege: 0.56,
    suburban: 0.69,
    urban: 0.61,
    rural: 0.66,
    youth: 0.50,
    seniors: 0.74,
    progressives: 0.78,
    libertarians: 0.67,
    maga: 0.82,
    centrists: 0.63,
    lgbtq_community: 0.71,
    women: 0.66
};

// Candidate/VP group modifiers are embedded directly in CANDIDATES and VPS entries as groupBoosts/groupDebuffs.

// PAC definitions
const PACS = {
    bigoil: {
        name: 'Big Oil & Gas',
        category: 'Industry',
        priority_issue: 'energy',
        desired_position: 7, // Pro-fossil fuels
        contribution: 25, // $25M
        description: 'Opposes climate regulations, supports fossil fuel expansion',
        vulnerability: {
            id: 'oil-money',
            label: 'Oil money attack',
            risk: 0.18,
            favorability: -0.05,
            turnoutHits: { progressives: -0.06, urban: -0.03 },
            story: 'Opposition media highlights fossil fuel money ties.'
        }
    },
    unions: {
        name: 'AFL-CIO (Labor Unions)',
        category: 'Labor',
        priority_issue: 'labor',
        desired_position: -6, // Pro-labor
        contribution: 20,
        description: 'Supports workers\' rights, union protections, higher wages',
        vulnerability: {
            id: 'labor-boss',
            label: 'Union boss backlash',
            risk: 0.12,
            favorability: -0.03,
            turnoutHits: { smallbusiness: -0.04, suburban: -0.02 },
            story: 'Opponents frame the campaign as captured by union bosses.'
        }
    },
    nra: {
        name: 'NRA (Gun Rights)',
        category: 'Grassroots',
        priority_issue: 'guns',
        desired_position: 8, // Pro-gun rights
        contribution: 18,
        description: 'Opposes all gun control measures, protects Second Amendment',
        vulnerability: {
            id: 'gun-lobby',
            label: 'Gun lobby headline',
            risk: 0.16,
            favorability: -0.04,
            turnoutHits: { suburban: -0.05, women: -0.04 },
            story: 'Gun lobby donations trigger suburban backlash.'
        }
    },
    plannedparenthood: {
        name: 'Planned Parenthood',
        category: 'Grassroots',
        priority_issue: 'abortion',
        desired_position: -7, // Pro-choice
        contribution: 15,
        description: 'Protects reproductive rights and access to abortion',
        vulnerability: {
            id: 'abortion-rights',
            label: 'Abortion rights controversy',
            risk: 0.14,
            favorability: -0.03,
            turnoutHits: { evangelical: -0.06, rural: -0.03 },
            story: 'Social conservatives attack the campaign over abortion funding.'
        }
    },
    techindustry: {
        name: 'Tech Industry PAC',
        category: 'Industry',
        priority_issue: 'immigration',
        desired_position: -4, // Pro-immigration
        contribution: 30,
        description: 'Supports H1B visas and skilled immigration',
        vulnerability: {
            id: 'tech-money',
            label: 'Tech billionaire ties',
            risk: 0.12,
            favorability: -0.02,
            turnoutHits: { bluecollar: -0.03 },
            story: 'Opponents tie the campaign to Silicon Valley elites.'
        }
    },
    wallstreet: {
        name: 'Wall Street PAC',
        category: 'Wall Street',
        priority_issue: 'taxation',
        desired_position: 6, // Low taxes
        contribution: 35,
        description: 'Opposes wealth taxes and capital gains increases',
        vulnerability: {
            id: 'wall-street',
            label: 'Wall Street capture',
            risk: 0.18,
            favorability: -0.05,
            turnoutHits: { progressives: -0.05, union: -0.04 },
            story: 'Wall Street donor coverage undermines populist appeal.'
        }
    },
    environmental: {
        name: 'Environmental Defense Fund',
        category: 'Grassroots',
        priority_issue: 'climate',
        desired_position: -8, // Pro-environment
        contribution: 12,
        description: 'Supports aggressive climate action and clean energy',
        vulnerability: {
            id: 'green-agenda',
            label: 'Green agenda backlash',
            risk: 0.1,
            favorability: -0.02,
            turnoutHits: { farmers: -0.03, rural: -0.03 },
            story: 'Opponents warn climate donors threaten rural jobs.'
        }
    }
};

// Coalition breakpoints for loyalty/turnout collapse
const COALITION_BREAKPOINTS = {
    progressives: {
        label: 'Progressives',
        parties: ['D', 'G', 'PSL'],
        requirements: [
            { issue: 'climate', max: -6, label: '65%+ climate investment' },
            { issue: 'healthcare', max: -4, label: 'Public option or better' }
        ],
        warningWeeks: 2,
        collapseWeeks: 4,
        riskLeak: 0.08,
        collapseLeak: 0.22,
        leakTo: { G: 0.6, PSL: 0.4 }
    },
    union: {
        label: 'Union Workers',
        parties: ['D'],
        requirements: [
            { issue: 'labor', max: -3, label: 'Union-first labor policy' }
        ],
        warningWeeks: 2,
        collapseWeeks: 4,
        riskLeak: 0.06,
        collapseLeak: 0.18,
        leakTo: { G: 0.4, PSL: 0.3, R: 0.3 }
    },
    evangelical: {
        label: 'Evangelicals',
        parties: ['R'],
        requirements: [
            { issue: 'abortion', min: 4, label: 'Abortion restrictions' },
            { issue: 'lgbtq', min: 2, label: 'Religious carve-outs' }
        ],
        warningWeeks: 2,
        collapseWeeks: 3,
        riskLeak: 0.06,
        collapseLeak: 0.18,
        leakTo: { L: 0.6, I: 0.4 }
    },
    smallbusiness: {
        label: 'Small Business',
        parties: ['R'],
        requirements: [
            { issue: 'taxation', min: 4, label: 'Pro-growth tax cuts' }
        ],
        warningWeeks: 2,
        collapseWeeks: 4,
        riskLeak: 0.05,
        collapseLeak: 0.16,
        leakTo: { L: 0.5, I: 0.5 }
    },
    muslim: {
        label: 'Muslim Voters',
        parties: ['D', 'G', 'PSL'],
        requirements: [
            { issue: 'israel', max: -3, label: 'Ceasefire-forward stance' }
        ],
        warningWeeks: 2,
        collapseWeeks: 3,
        riskLeak: 0.07,
        collapseLeak: 0.2,
        leakTo: { G: 0.5, PSL: 0.5 }
    }
};

// Cross-pressure penalties when courting opposing coalitions
const COALITION_CROSS_PRESSURES = [
    {
        id: 'secular-backlash',
        label: 'Evangelical backlash to secular messaging',
        triggerIssue: 'lgbtq',
        triggerMax: -6,
        targetGroup: 'evangelical',
        penalty: 0.06
    }
];

// State demographic compositions (% of each group)
const STATE_DEMOGRAPHICS = {
    'CA': {
        white: 38, black: 6, hispanic: 39, asian: 15, native: 2,
        evangelical: 12, catholic: 28, jewish: 3, muslim: 2, secular: 35,
        bluecollar: 20, whitecollar: 35, union: 16, tech: 12,
        college: 42, suburban: 45, urban: 48, rural: 7, youth: 22, seniors: 18,
        lgbtq_community: 6, women: 51
    },
    'TX': {
        white: 42, black: 12, hispanic: 39, asian: 5, native: 2,
        evangelical: 31, catholic: 23, jewish: 1, muslim: 2, secular: 20,
        bluecollar: 28, whitecollar: 30, union: 5, farmers: 3,
        college: 32, suburban: 35, urban: 40, rural: 25, youth: 24, seniors: 16,
        lgbtq_community: 4, women: 51
    },
    'FL': {
        white: 54, black: 16, hispanic: 26, asian: 3, native: 1,
        evangelical: 24, catholic: 21, jewish: 3, muslim: 1, secular: 24,
        bluecollar: 24, whitecollar: 32, military: 8,
        college: 35, suburban: 45, urban: 35, rural: 20, youth: 20, seniors: 28,
        lgbtq_community: 5, women: 51
    },
    'NY': {
        white: 56, black: 15, hispanic: 19, asian: 9, native: 1,
        evangelical: 8, catholic: 31, jewish: 9, muslim: 3, secular: 30,
        bluecollar: 18, whitecollar: 40, union: 24,
        college: 45, suburban: 35, urban: 60, rural: 5, youth: 21, seniors: 19,
        lgbtq_community: 6, women: 52
    },
    'PA': {
        white: 77, black: 11, hispanic: 8, asian: 4, native: 0,
        evangelical: 15, catholic: 24, jewish: 3, muslim: 1, secular: 28,
        bluecollar: 32, whitecollar: 30, union: 14,
        college: 35, suburban: 45, urban: 30, rural: 25, youth: 19, seniors: 22,
        lgbtq_community: 4, women: 51
    }
};

// Default demographics for states not specified
var DEFAULT_DEMOGRAPHICS = {
    white: 70, black: 10, hispanic: 12, asian: 5, native: 3,
    evangelical: 20, catholic: 20, jewish: 2, muslim: 1, secular: 25,
    bluecollar: 25, whitecollar: 30, smallbusiness: 8, union: 10,
    college: 35, suburban: 40, urban: 30, rural: 30, youth: 20, seniors: 20,
    lgbtq_community: 4, women: 51
};
