/* ============================================
   DECISION 2028 - EXPANDED STATE DATA
   ============================================ */

// State fundraising potential (in millions)
const STATE_FUNDRAISING_POTENTIAL = {
    'CA': 10.0, 'NY': 9.0, 'TX': 8.0, 'FL': 6.0, 'IL': 5.0,
    'PA': 4.0, 'OH': 3.0, 'NJ': 4.5, 'MA': 4.0, 'VA': 3.5,
    'WA': 3.5, 'CO': 3.0, 'AZ': 2.5, 'GA': 3.0, 'NC': 2.5,
    'MI': 2.5, 'MN': 2.0, 'WI': 2.0, 'MD': 3.0, 'CT': 3.0,
    'WY': 0.5, 'VT': 0.5, 'ND': 0.5, 'SD': 0.5, 'AK': 0.6,
    'MT': 0.7, 'DE': 1.0, 'RI': 1.0, 'NH': 1.2, 'ME': 1.2,
    'HI': 1.5, 'NM': 1.3, 'NV': 2.0, 'OR': 2.0, 'SC': 2.0,
    'AL': 1.8, 'AR': 1.2, 'IA': 1.5, 'ID': 1.0, 'IN': 1.8,
    'KS': 1.5, 'KY': 1.5, 'LA': 1.8, 'MO': 2.0, 'MS': 1.0,
    'NE': 1.2, 'OK': 1.5, 'TN': 2.0, 'UT': 1.5, 'WV': 0.8,
    'DC': 2.0
};

// County assignments per state (simplified - full data would come from county_data.json)
const STATE_COUNTIES = {
    'TX': ['48201', '48113', '48029'], // Harris, Dallas, Bexar (samples)
    'CA': ['6037', '6073', '6075'], // LA, San Diego, San Francisco
    'FL': ['12086', '12011', '12095'], // Miami-Dade, Broward, Palm Beach
    // Would be populated from county_data.json
};

// Extend state data with additional properties
function enhanceStateData() {
    for (var code in gameData.states) {
        var s = gameData.states[code];
        s.fundraisingPotential = STATE_FUNDRAISING_POTENTIAL[code] || 1.0;
        s.fundraisingVisits = 0;
        s.counties = []; // Will be populated from county data
    }
}
