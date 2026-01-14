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
                                path.onmousemove = function(e) { Counties.showCountyTooltip(e, f); };
                                path.onmouseleave = function() { 
                                    var tooltip = document.getElementById('map-tooltip');
                                    if (tooltip) tooltip.style.display = 'none';
                                };
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
        if (!this.currentState) return;
        
        var stateFips = this.getStateFipsPrefix(this.currentState);
        
        for (var fips in this.countyData) {
            if (fips.substring(0, 2) === stateFips) {
                var county = this.countyData[fips];
                var path = document.getElementById(fips);
                
                if (path && county.v) {
                    // Calculate margin based on votes with correct turnout
                    var demTurnout = gameData.selectedParty === 'D' ? ((county.turnout && county.turnout.player) || 1.0) : ((county.turnout && county.turnout.demOpponent) || 1.0);
                    var repTurnout = gameData.selectedParty === 'R' ? ((county.turnout && county.turnout.player) || 1.0) : ((county.turnout && county.turnout.repOpponent) || 1.0);
                    
                    var demVotes = (county.v.D || 0) * demTurnout;
                    var repVotes = (county.v.R || 0) * repTurnout;
                    var total = demVotes + repVotes;
                    
                    if (total > 0) {
                        var demPct = (demVotes / total) * 100;
                        var repPct = (repVotes / total) * 100;
                        var margin = demPct - repPct;
                        
                        // Use the same color function as state map
                        if (typeof Utils !== 'undefined' && Utils.getMarginColor) {
                            path.style.fill = Utils.getMarginColor(margin);
                        } else {
                            // Fallback coloring
                            if (Math.abs(margin) < 2) {
                                path.style.fill = '#808080';
                            } else if (margin > 0) {
                                path.style.fill = margin > 10 ? '#0066CC' : '#4d94ff';
                            } else {
                                path.style.fill = margin < -10 ? '#CC0000' : '#ff4d4d';
                            }
                        }
                    }
                }
            }
        }
    },
    
    // Select a county
    selectCounty: function(fips) {
        var county = this.countyData[fips];
        if (!county) return;
        
        // Store selected county
        gameData.selectedCounty = fips;
        
        // Show county info in sidebar
        document.getElementById('sp-name').innerText = county.n || 'County';
        
        // Mark that we're in county view mode
        gameData.inCountyView = true;
        
        // Add county-specific action buttons
        var actionGrid = document.querySelector('.action-grid');
        if (actionGrid) {
            // Clear existing buttons and add county actions
            actionGrid.innerHTML = 
                '<button class="act-btn" onclick="app.countyRally()"><span>🎤</span><span>RALLY</span></button>' +
                '<button class="act-btn" onclick="app.countySpeech()"><span>🎙️</span><span>SPEECH</span></button>' +
                '<button class="act-btn" onclick="app.closeCountyView()"><span>🗺️</span><span>BACK TO MAP</span></button>';
        }
    },
    
    // Rally in a specific county
    rallyInCounty: function(fips) {
        if (!fips || !this.countyData[fips]) return;
        
        if (gameData.energy < 1) {
            Utils.showToast("Not enough energy!");
            return;
        }
        if (gameData.funds < 0.5) {
            Utils.showToast("Need $0.5M for county rally!");
            return;
        }
        
        Campaign.saveState();
        
        var county = this.countyData[fips];
        
        // Apply turnout boost to this county
        var turnoutBoost = 0.1 + Math.random() * 0.1; // 10-20% boost
        
        if (!county.turnout) county.turnout = { player: 1.0, demOpponent: 1.0, repOpponent: 1.0, thirdParty: 0.7 };
        
        if (gameData.selectedParty === 'D' || gameData.selectedParty === 'R') {
            county.turnout.player = (county.turnout.player || 1.0) + turnoutBoost;
        } else {
            county.turnout.thirdParty = (county.turnout.thirdParty || 0.7) + (turnoutBoost * 0.5);
        }
        
        // Cap turnout at 1.5 (150%)
        county.turnout.player = Math.min(1.5, county.turnout.player || 1.0);
        county.turnout.thirdParty = Math.min(1.5, county.turnout.thirdParty || 0.7);
        
        // Apply smaller boost to adjacent counties
        var adjacentBoost = turnoutBoost * 0.3;
        // For simplicity, boost nearby counties (would need proper adjacency data)
        
        gameData.energy -= 1;
        gameData.funds -= 0.5;
        
        // Update state-level margin based on county votes
        this.updateStateFromCounties(this.currentState);
        
        var message = 'County rally in ' + (county.n || 'County') + '! Turnout boost: +' + (turnoutBoost * 100).toFixed(0) + '%';
        Utils.addLog(message);
        Campaign.updateHUD();
        Campaign.colorMap();
        Utils.showToast(message);
    },
    
    // Update state-level margin from county data
    updateStateFromCounties: function(stateCode) {
        var stateFips = this.getStateFipsPrefix(stateCode);
        var totalDemVotes = 0;
        var totalRepVotes = 0;
        
        for (var fips in this.countyData) {
            if (fips.substring(0, 2) === stateFips) {
                var county = this.countyData[fips];
                if (county.v && county.turnout) {
                    // Use correct turnout for each party
                    var demTurnout = gameData.selectedParty === 'D' ? (county.turnout.player || 1.0) : (county.turnout.demOpponent || 1.0);
                    var repTurnout = gameData.selectedParty === 'R' ? (county.turnout.player || 1.0) : (county.turnout.repOpponent || 1.0);
                    
                    var demVotes = (county.v.D || 0) * demTurnout;
                    var repVotes = (county.v.R || 0) * repTurnout;
                    totalDemVotes += demVotes;
                    totalRepVotes += repVotes;
                }
            }
        }
        
        // Calculate new margin
        var totalVotes = totalDemVotes + totalRepVotes;
        if (totalVotes > 0) {
            var demPct = (totalDemVotes / totalVotes) * 100;
            var repPct = (totalRepVotes / totalVotes) * 100;
            var newMargin = demPct - repPct;
            
            // Update state margin
            if (gameData.states[stateCode]) {
                gameData.states[stateCode].margin = newMargin;
            }
        }
    },
    
    // Show county tooltip
    showCountyTooltip: function(e, fips) {
        var county = this.countyData[fips];
        if (!county) return;
        
        var tooltip = document.getElementById('map-tooltip');
        if (!tooltip) return;
        
        // Use correct turnout for each party
        var demTurnout = gameData.selectedParty === 'D' ? ((county.turnout && county.turnout.player) || 1.0) : ((county.turnout && county.turnout.demOpponent) || 1.0);
        var repTurnout = gameData.selectedParty === 'R' ? ((county.turnout && county.turnout.player) || 1.0) : ((county.turnout && county.turnout.repOpponent) || 1.0);
        
        var demVotes = (county.v.D || 0) * demTurnout;
        var repVotes = (county.v.R || 0) * repTurnout;
        var total = demVotes + repVotes;
        
        var marginText = 'N/A';
        var color = '#888';
        
        if (total > 0) {
            var demPct = (demVotes / total) * 100;
            var repPct = (repVotes / total) * 100;
            var margin = demPct - repPct;
            
            if (Math.abs(margin) < 2) {
                marginText = 'TOSS-UP';
            } else {
                marginText = (margin > 0 ? 'D+' : 'R+') + Math.abs(margin).toFixed(1);
            }
            color = margin > 0 ? '#00AEF3' : '#E81B23';
        }
        
        tooltip.innerHTML = 
            '<span class="tooltip-title">' + (county.n || 'County') + '</span>' +
            '<div class="tooltip-divider"></div>' +
            '<span class="tooltip-leader" style="color: ' + color + '">' + marginText + '</span>';
        tooltip.style.display = 'block';
        tooltip.style.left = (e.clientX + 15) + 'px';
        tooltip.style.top = (e.clientY + 15) + 'px';
    },
    
    // Get state FIPS prefix from state code
    getStateFipsPrefix: function(stateCode) {
        // Use FIPS codes from STATES config
        if (typeof STATES !== 'undefined' && STATES[stateCode] && STATES[stateCode].fips) {
            return STATES[stateCode].fips;
        }
        return '00';
    },
    
    // Close county view
    closeCountyView: function() {
        document.getElementById('county-view-wrapper').classList.add('hidden');
        document.getElementById('us-map-wrapper').classList.remove('hidden');
        this.currentState = null;
        gameData.inCountyView = false;
        gameData.selectedCounty = null;
        
        // Restore state action buttons
        var actionGrid = document.querySelector('.action-grid');
        if (actionGrid) {
            actionGrid.innerHTML = 
                '<button class="act-btn" onclick="app.handleAction(\'fundraise\')"><span>💰</span><span>FUNDRAISE</span></button>' +
                '<button class="act-btn" onclick="app.handleAction(\'ad\')"><span>📺</span><span>AD BLITZ</span></button>' +
                '<button class="act-btn" onclick="app.openStateBio()"><span>📖</span><span>INTEL</span></button>' +
                '<button class="act-btn" onclick="app.openCountyView()"><span>🗺️</span><span>BREAKDOWN</span></button>' +
                '<button class="act-btn" onclick="app.openIssuesPanel()"><span>📊</span><span>ISSUES</span></button>';
        }
    },
    
    // Get adjacent counties (simplified)
    getAdjacentCounties: function(fips) {
        // Would need adjacency data - returning empty for now
        return [];
    }
};
