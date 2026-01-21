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
        priorities: ['economy', 'taxation', 'immigration']
    },
    black: {
        name: 'African American',
        category: 'Racial/Ethnic',
        baseline: -7, // Strong D lean
        priorities: ['criminal', 'healthcare', 'economy'],
        support: { R: 17, D: 81, L: 1, G: 1 }
    },
    hispanic: {
        name: 'Hispanic/Latino',
        category: 'Racial/Ethnic',
        baseline: -3, // Moderate D lean
        priorities: ['immigration', 'economy', 'healthcare'],
        support: { R: 48, D: 50, L: 1, G: 1 }
    },
    asian: {
        name: 'Asian American',
        category: 'Racial/Ethnic',
        baseline: -2, // Slight D lean
        priorities: ['economy', 'healthcare', 'immigration'],
        support: { R: 40, D: 58, L: 1, G: 1 }
    },
    native: {
        name: 'Native American',
        category: 'Racial/Ethnic',
        baseline: -4, // Moderate D lean
        priorities: ['healthcare', 'environment', 'economy'],
        support: { R: 40, D: 57, L: 2, G: 1 }
    },
    
    // Religious
    evangelical: {
        name: 'Evangelical',
        category: 'Religious',
        baseline: 6, // Strong R lean
        priorities: ['abortion', 'lgbtq', 'religious_freedom'],
        support: { R: 81, D: 17, L: 1, G: 1 }
    },
    catholic: {
        name: 'Catholic',
        category: 'Religious',
        baseline: 1, // Slight R lean
        priorities: ['abortion', 'immigration', 'healthcare'],
        support: { R: 53, D: 45, L: 1, G: 1 }
    },
    jewish: {
        name: 'Jewish',
        category: 'Religious',
        baseline: -3, // Moderate D lean
        priorities: ['israel', 'criminal', 'healthcare'],
        support: { R: 29, D: 68, L: 1, G: 2 }
    },
    muslim: {
        name: 'Muslim',
        category: 'Religious',
        baseline: -5, // Strong D lean
        priorities: ['foreign', 'immigration', 'civil_rights'],
        support: { R: 32, D: 58, L: 2, G: 8 }
    },
    secular: {
        name: 'Secular/None',
        category: 'Religious',
        baseline: -4, // Moderate D lean
        priorities: ['climate', 'healthcare', 'lgbtq']
    },
    
    // Occupational
    bluecollar: {
        name: 'Blue Collar Workers',
        category: 'Occupational',
        baseline: 1, // Slight R lean
        priorities: ['economy', 'trade', 'labor']
    },
    whitecollar: {
        name: 'White Collar Professionals',
        category: 'Occupational',
        baseline: -1, // Slight D lean
        priorities: ['economy', 'taxation', 'healthcare']
    },
    smallbusiness: {
        name: 'Small Business Owners',
        category: 'Occupational',
        baseline: 3, // Moderate R lean
        priorities: ['taxation', 'economy', 'govspend']
    },
    union: {
        name: 'Union Workers',
        category: 'Occupational',
        baseline: -4, // Moderate D lean
        priorities: ['labor', 'economy', 'healthcare'],
        support: { R: 50, D: 49, L: 1, G: 0 }
    },
    tech: {
        name: 'Tech Workers',
        category: 'Occupational',
        baseline: -2, // Slight D lean
        priorities: ['economy', 'immigration', 'climate']
    },
    farmers: {
        name: 'Farmers',
        category: 'Occupational',
        baseline: 4, // Moderate R lean
        priorities: ['trade', 'economy', 'govspend']
    },
    military: {
        name: 'Military/Veterans',
        category: 'Occupational',
        baseline: 3, // Moderate R lean
        priorities: ['military', 'foreign', 'economy']
    },
    
    // Demographic
    college: {
        name: 'College Educated',
        category: 'Demographic',
        baseline: -2, // Slight D lean
        priorities: ['economy', 'climate', 'healthcare'],
        support: { R: 42, D: 56, L: 1, G: 1 }
    },
    noncollege: {
        name: 'Non-College',
        category: 'Demographic',
        baseline: 2, // Slight R lean
        priorities: ['economy', 'jobs', 'immigration']
    },
    suburban: {
        name: 'Suburban Voters',
        category: 'Demographic',
        baseline: 0, // Neutral
        priorities: ['economy', 'healthcare', 'education']
    },
    urban: {
        name: 'Urban',
        category: 'Demographic',
        baseline: -5, // Strong D lean
        priorities: ['climate', 'healthcare', 'criminal'],
        support: { R: 33, D: 63, L: 1, G: 3 }
    },
    rural: {
        name: 'Rural',
        category: 'Demographic',
        baseline: 5, // Strong R lean
        priorities: ['economy', 'guns', 'trade'],
        support: { R: 70, D: 28, L: 2, G: 0 }
    },
    youth: {
        name: 'Youth (18-29)',
        category: 'Demographic',
        baseline: -4, // Moderate D lean
        priorities: ['climate', 'economy', 'healthcare']
    },
    seniors: {
        name: 'Seniors (65+)',
        category: 'Demographic',
        baseline: 2, // Slight R lean
        priorities: ['healthcare', 'social_security', 'economy']
    },
    
    // Political Orientation
    progressives: {
        name: 'Progressives',
        category: 'Political',
        baseline: -8, // Very Strong D lean
        priorities: ['climate', 'healthcare', 'inequality'],
        support: { R: 4, D: 86, L: 0, G: 10 }
    },
    libertarians: {
        name: 'Libertarians',
        category: 'Political',
        baseline: 5, // Moderate R lean
        priorities: ['freedom', 'taxation', 'govspend'],
        support: { R: 70, D: 8, L: 22, G: 0 }
    },
    maga: {
        name: 'MAGA',
        category: 'Political',
        baseline: 9, // Extreme R lean
        priorities: ['immigration', 'trade', 'nationalism'],
        support: { R: 99, D: 0, L: 1, G: 0 }
    },
    centrists: {
        name: 'Centrists',
        category: 'Political',
        baseline: 0, // Neutral
        priorities: ['economy', 'bipartisanship', 'pragmatism'],
        support: { R: 50, D: 47, L: 2, G: 1 }
    },
    
    // Gender/Orientation
    lgbtq_community: {
        name: 'LGBTQ+ Community',
        category: 'Gender/Orientation',
        baseline: -6, // Strong D lean
        priorities: ['lgbtq', 'healthcare', 'civil_rights']
    },
    
    women: {
        name: 'Women Voters',
        category: 'Gender/Orientation',
        baseline: -2, // Slight D lean
        priorities: ['healthcare', 'abortion', 'economy']
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

// PAC definitions
const PACS = {
    bigoil: {
        name: 'Big Oil & Gas',
        priority_issue: 'energy',
        desired_position: 7, // Pro-fossil fuels
        contribution: 25, // $25M
        description: 'Opposes climate regulations, supports fossil fuel expansion'
    },
    unions: {
        name: 'AFL-CIO (Labor Unions)',
        priority_issue: 'labor',
        desired_position: -6, // Pro-labor
        contribution: 20,
        description: 'Supports workers\' rights, union protections, higher wages'
    },
    nra: {
        name: 'NRA (Gun Rights)',
        priority_issue: 'guns',
        desired_position: 8, // Pro-gun rights
        contribution: 18,
        description: 'Opposes all gun control measures, protects Second Amendment'
    },
    plannedparenthood: {
        name: 'Planned Parenthood',
        priority_issue: 'abortion',
        desired_position: -7, // Pro-choice
        contribution: 15,
        description: 'Protects reproductive rights and access to abortion'
    },
    techindustry: {
        name: 'Tech Industry PAC',
        priority_issue: 'immigration',
        desired_position: -4, // Pro-immigration
        contribution: 30,
        description: 'Supports H1B visas and skilled immigration'
    },
    wallstreet: {
        name: 'Wall Street PAC',
        priority_issue: 'taxation',
        desired_position: 6, // Low taxes
        contribution: 35,
        description: 'Opposes wealth taxes and capital gains increases'
    },
    environmental: {
        name: 'Environmental Defense Fund',
        priority_issue: 'climate',
        desired_position: -8, // Pro-environment
        contribution: 12,
        description: 'Supports aggressive climate action and clean energy'
    }
};

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
