/* ============================================
   DECISION 2028 - MEDIA MARKETS
   ============================================ */

var MEDIA_MARKETS = {};

var MediaMarkets = {
    load: function(callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'counties/mediamarkets.csv', true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    MediaMarkets.parseCsv(xhr.responseText);
                    console.log('✓ Media markets loaded');
                } else {
                    console.warn('Could not load media markets data');
                }
                if (callback) callback();
            }
        };
        xhr.send();
    },

    parseCsv: function(csvText) {
        var lines = csvText.split(/\r?\n/);
        
        var stateMap = {
            'ALABAMA': 'AL', 'ALASKA': 'AK', 'ARIZONA': 'AZ', 'ARKANSAS': 'AR',
            'CALIFORNIA': 'CA', 'COLORADO': 'CO', 'CONNECTICUT': 'CT', 'DELAWARE': 'DE',
            'FLORIDA': 'FL', 'GEORGIA': 'GA', 'HAWAII': 'HI', 'IDAHO': 'ID',
            'ILLINOIS': 'IL', 'INDIANA': 'IN', 'IOWA': 'IA', 'KANSAS': 'KS',
            'KENTUCKY': 'KY', 'LOUISIANA': 'LA', 'MAINE': 'ME', 'MARYLAND': 'MD',
            'MASSACHUSETTS': 'MA', 'MICHIGAN': 'MI', 'MINNESOTA': 'MN', 'MISSISSIPPI': 'MS',
            'MISSOURI': 'MO', 'MONTANA': 'MT', 'NEBRASKA': 'NE', 'NEVADA': 'NV',
            'NEW HAMPSHIRE': 'NH', 'NEW JERSEY': 'NJ', 'NEW MEXICO': 'NM', 'NEW YORK': 'NY',
            'NORTH CAROLINA': 'NC', 'NORTH DAKOTA': 'ND', 'OHIO': 'OH', 'OKLAHOMA': 'OK',
            'OREGON': 'OR', 'PENNSYLVANIA': 'PA', 'RHODE ISLAND': 'RI', 'SOUTH CAROLINA': 'SC',
            'SOUTH DAKOTA': 'SD', 'TENNESSEE': 'TN', 'TEXAS': 'TX', 'UTAH': 'UT',
            'VERMONT': 'VT', 'VIRGINIA': 'VA', 'WASHINGTON': 'WA', 'WEST VIRGINIA': 'WV',
            'WISCONSIN': 'WI', 'WYOMING': 'WY', 'DISTRICT OF COLUMBIA': 'DC'
        };

        var stateFipsMap = {
            'AL': '01', 'AK': '02', 'AZ': '04', 'AR': '05', 'CA': '06', 'CO': '08',
            'CT': '09', 'DE': '10', 'DC': '11', 'FL': '12', 'GA': '13', 'HI': '15',
            'ID': '16', 'IL': '17', 'IN': '18', 'IA': '19', 'KS': '20', 'KY': '21',
            'LA': '22', 'ME': '23', 'MD': '24', 'MA': '25', 'MI': '26', 'MN': '27',
            'MS': '28', 'MO': '29', 'MT': '30', 'NE': '31', 'NV': '32', 'NH': '33',
            'NJ': '34', 'NM': '35', 'NY': '36', 'NC': '37', 'ND': '38', 'OH': '39',
            'OK': '40', 'OR': '41', 'PA': '42', 'RI': '44', 'SC': '45', 'SD': '46',
            'TN': '47', 'TX': '48', 'UT': '49', 'VT': '50', 'VA': '51', 'WA': '53',
            'WV': '54', 'WI': '55', 'WY': '56'
        };
        
        // Build reverse lookup for county names -> fips for each state
        var nameToFips = {};
        for (var fips in Counties.countyData) {
            var c = Counties.countyData[fips];
            var cName = c ? (c.n || c.name) : null;
            if (!c || !cName) continue;
            var name = cName.toUpperCase().replace(/ COUNTY$/, '').replace(/ PARISH$/, '');
            var stateFips = fips.substring(0, 2);
            if (!nameToFips[stateFips]) nameToFips[stateFips] = {};
            nameToFips[stateFips][name] = fips;
        }

        for (var i = 1; i < lines.length; i++) {
            var line = lines[i].trim();
            if (!line) continue;
            
            var parts = Counties.parseCsvLine(line);
            if (parts.length < 3) continue;
            
            var countyName = (parts[0] || '').trim().toUpperCase();
            var stateName = (parts[1] || '').trim().toUpperCase();
            var dmaName = (parts[2] || '').trim();
            
            if (countyName === 'COUNTY' && stateName === 'STATE') continue;
            
            var stateAbbr = stateMap[stateName];
            if (!stateAbbr) continue;
            var stateFips = stateFipsMap[stateAbbr];
            if (!stateFips) continue;
            
            var lookupName = countyName.replace(/ C\.A\. \d+$/, '').replace(/ BOR\. \d+$/, '').replace(/ \d+$/, '');
            lookupName = lookupName.replace(/ COUNTY$/, '');
            
            var fipsMatch = null;
            if (nameToFips[stateFips] && nameToFips[stateFips][lookupName]) {
                fipsMatch = nameToFips[stateFips][lookupName];
            } else if (nameToFips[stateFips]) {
                // Try partial match
                for (var k in nameToFips[stateFips]) {
                    if (k.indexOf(lookupName) !== -1 || lookupName.indexOf(k) !== -1) {
                        fipsMatch = nameToFips[stateFips][k];
                        break;
                    }
                }
            }
            
            if (!fipsMatch) continue;
            
            var marketId = dmaName.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
            if (!MEDIA_MARKETS[marketId]) {
                MEDIA_MARKETS[marketId] = {
                    id: marketId,
                    label: dmaName,
                    counties: [],
                    states: [],
                    cpmBase: Math.floor(Math.random() * 15) + 10, // Default baseline, updated below
                    reach: 0
                };
            }
            
            if (MEDIA_MARKETS[marketId].counties.indexOf(fipsMatch) === -1) {
                MEDIA_MARKETS[marketId].counties.push(fipsMatch);
            }
            if (MEDIA_MARKETS[marketId].states.indexOf(stateAbbr) === -1) {
                MEDIA_MARKETS[marketId].states.push(stateAbbr);
            }
            
            // Assign county to media market
            if (Counties.countyData[fipsMatch]) {
                Counties.countyData[fipsMatch].mediaMarket = marketId;
                
                // Add to reach
                var pop = Counties.getCountyRegisteredVoters(Counties.countyData[fipsMatch]);
                MEDIA_MARKETS[marketId].reach += pop;
            }
        }
        
        // Scale CPM based on reach (rough approximation for gameplay)
        // E.g., $5 CPM for small markets, $40 for NYC
        for (var mId in MEDIA_MARKETS) {
            var market = MEDIA_MARKETS[mId];
            var reachMillions = market.reach / 1000000;
            market.cpmBase = Math.max(5, Math.min(45, 5 + (reachMillions * 4)));
        }
    }
};
