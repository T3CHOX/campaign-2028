/* ============================================
   DECISION 2028 - COUNTY SYSTEM
   ============================================ */

var Counties = {
    currentState: null,
    countyData: {},
    
    // Load county data from JSON
    loadCountyData: function(callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'counties/county_data.json', true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                Counties.countyData = JSON.parse(xhr.responseText);
                // Reduce base votes slightly for early-game lower turnout
                for (var fips in Counties.countyData) {
                    var c = Counties.countyData[fips];
                    if (c.v && c.v.D) c.v.D *= 0.9;
                    if (c.v && c.v.R) c.v.R *= 0.9;
                    // Initialize turnout
                    c.turnout = { player: 1.0, demOpponent: 1.0, repOpponent: 1.0, thirdParty: 0.7 };
                }
                if (callback) callback();
            }
        };
        xhr.send();
    },
    
    // Open county view for a state
    openCountyView: function(stateCode) {
        this.currentState = stateCode;
        var stateName = gameData.states[stateCode].name;
        
        document.getElementById('us-map-wrapper').classList.add('hidden');
        document.getElementById('county-view-wrapper').classList.remove('hidden');
        document.getElementById('cv-title').innerText = stateName;
        
        this.loadCountyMap(stateCode);
    },
    
    // Load county SVG map
    loadCountyMap: function(stateCode) {
        var wrapper = document.getElementById('county-map-container');
        wrapper.innerHTML = '<div class="loading-map">Loading county map...</div>';
        
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'counties/uscountymap.svg', true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var parser = new DOMParser();
                var svgDoc = parser.parseFromString(xhr.responseText, 'image/svg+xml');
                var svg = svgDoc.querySelector('svg');
                
                if (svg) {
                    svg.id = 'county-map-svg';
                    // Filter to show only counties for this state
                    var paths = svg.querySelectorAll('path');
                    for (var i = 0; i < paths.length; i++) {
                        var path = paths[i];
                        var fips = path.id;
                        
                        if (fips && fips.substring(0, 2) === stateCode.substring(0, 2)) {
                            // This county belongs to the state
                            path.style.cursor = 'pointer';
                            path.style.display = 'block';
                            (function(f) {
                                path.onclick = function() { Counties.selectCounty(f); };
                            })(fips);
                        } else {
                            path.style.display = 'none';
                        }
                    }
                    wrapper.innerHTML = '';
                    wrapper.appendChild(svg);
                    Counties.colorCountyMap();
                }
            } else if (xhr.readyState === 4) {
                wrapper.innerHTML = '<div class="error-map">Failed to load county map.</div>';
            }
        };
        xhr.send();
    },
    
    // Color county map based on margins
    colorCountyMap: function() {
        // Placeholder for coloring counties
    },
    
    // Select a county
    selectCounty: function(fips) {
        var county = this.countyData[fips];
        if (!county) return;
        
        // Show county info in sidebar
        document.getElementById('sp-name').innerText = county.n || 'County';
        // Update actions to be county-specific
    },
    
    // Close county view
    closeCountyView: function() {
        document.getElementById('county-view-wrapper').classList.add('hidden');
        document.getElementById('us-map-wrapper').classList.remove('hidden');
        this.currentState = null;
    },
    
    // Get adjacent counties (simplified)
    getAdjacentCounties: function(fips) {
        // Would need adjacency data - returning empty for now
        return [];
    }
};
