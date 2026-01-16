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
                
                // Initialize state margins from county data to ensure consistency
                // This prevents the bug where first campaign action causes large margin shifts
                // Defensive checks ensure globals are loaded (this runs in async callback)
                if (typeof gameData !== 'undefined' && gameData.states && typeof STATES !== 'undefined') {
                    for (var code in gameData.states) {
                        Counties.updateStateFromCounties(code);
                    }
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
        
        var stateFips = STATES[stateCode] ? STATES[stateCode].fips : null;
        if (!stateFips) {
            wrapper.innerHTML = '<div class="error-map">State FIPS code not found.</div>';
            return;
        }
        
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
                    var countyCount = 0;
                    
                    for (var i = 0; i < paths.length; i++) {
                        var path = paths[i];
                        var pathId = path.id;
                        
                        // County IDs in SVG are like "c01001" where 01 is state FIPS
                        if (pathId && pathId.length >= 3 && pathId.charAt(0) === 'c') {
                            var countyStateFips = pathId.substring(1, 3);
                            var fips = pathId.substring(1); // Remove the 'c' prefix
                            
                            if (countyStateFips === stateFips) {
                                // This county belongs to the state
                                countyCount++;
                                path.style.cursor = 'pointer';
                                path.style.display = 'block';
                                path.style.stroke = '#ffffff';
                                path.style.strokeWidth = '0.3';
                                
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
                        } else if (pathId && pathId !== 'counties' && pathId !== stateCode) {
                            // Hide non-county paths
                            path.style.display = 'none';
                        }
                    }
                    
                    wrapper.innerHTML = '';
                    wrapper.appendChild(svg);
                    
                    if (countyCount === 0) {
                        wrapper.innerHTML = '<div class="error-map">No counties found for this state.</div>';
                    } else {
                        Counties.colorCountyMap();
                        // Center and scale the state's counties
                        Counties.focusOnStateCounties(svg, stateFips);
                    }
                }
            } else if (xhr.readyState === 4) {
                wrapper.innerHTML = '<div class="error-map">Failed to load county map.</div>';
            }
        };
        xhr.send();
    },
    
    // Focus on state counties by setting viewBox
    focusOnStateCounties: function(svg, stateFips) {
        // Get all county paths that belong to this state
        var stateCountyPaths = [];
        var paths = svg.querySelectorAll('path');
        
        for (var i = 0; i < paths.length; i++) {
            var path = paths[i];
            var pathId = path.id;
            
            // County IDs in SVG are like "c01001" where 01 is state FIPS
            if (pathId && pathId.length >= 3 && pathId.charAt(0) === 'c') {
                var countyStateFips = pathId.substring(1, 3);
                if (countyStateFips === stateFips && path.style.display !== 'none') {
                    stateCountyPaths.push(path);
                }
            }
        }
        
        if (stateCountyPaths.length === 0) return;
        
        // Calculate union bounding box
        var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        for (var j = 0; j < stateCountyPaths.length; j++) {
            var path = stateCountyPaths[j];
            try {
                var bb = path.getBBox();
                minX = Math.min(minX, bb.x);
                minY = Math.min(minY, bb.y);
                maxX = Math.max(maxX, bb.x + bb.width);
                maxY = Math.max(maxY, bb.y + bb.height);
            } catch (e) {
                // getBBox might fail on some paths, skip them
                continue;
            }
        }
        
        // Check if we got valid bounds
        if (minX === Infinity || minY === Infinity || maxX === -Infinity || maxY === -Infinity) {
            return;
        }
        
        // Add padding (5% of bbox)
        var padX = (maxX - minX) * 0.05;
        var padY = (maxY - minY) * 0.05;
        minX -= padX;
        minY -= padY;
        maxX += padX;
        maxY += padY;
        
        // Set viewBox to focus on selected state
        svg.setAttribute('viewBox', minX + ' ' + minY + ' ' + (maxX - minX) + ' ' + (maxY - minY));
    },
    
    // Normalize FIPS code to 5 digits with leading zeros
    normalizeFips: function(fips) {
        // Pad with leading zeros to make 5 digits
        return ('00000' + fips).slice(-5);
    },
    
    // Color county map based on margins
    colorCountyMap: function() {
        if (!this.currentState) return;
        
        var stateFips = STATES[this.currentState] ? STATES[this.currentState].fips : null;
        if (!stateFips) return;
        
        for (var fips in this.countyData) {
            // Normalize FIPS to compare state prefix (pad to 5 digits)
            var normalizedFips = this.normalizeFips(fips);
            if (normalizedFips.substring(0, 2) === stateFips) {
                var county = this.countyData[fips];
                var path = document.getElementById('c' + normalizedFips); // Add 'c' prefix for SVG ID
                
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
        
        // Show population instead of EV
        var populationDiv = document.getElementById('sp-ev');
        if (populationDiv) {
            populationDiv.innerText = 'Pop: ' + (county.p || 0).toLocaleString();
        }
        
        // Calculate and display vote percentages with bar
        var demTurnout = gameData.selectedParty === 'D' ? ((county.turnout && county.turnout.player) || 1.0) : ((county.turnout && county.turnout.demOpponent) || 1.0);
        var repTurnout = gameData.selectedParty === 'R' ? ((county.turnout && county.turnout.player) || 1.0) : ((county.turnout && county.turnout.repOpponent) || 1.0);
        
        var demVotes = (county.v.D || 0) * demTurnout;
        var repVotes = (county.v.R || 0) * repTurnout;
        var total = demVotes + repVotes;
        
        if (total > 0) {
            var demPct = (demVotes / total) * 100;
            var repPct = (repVotes / total) * 100;
            
            demPct = Math.max(0, Math.min(100, demPct));
            repPct = Math.max(0, Math.min(100, repPct));
            
            document.getElementById('poll-bar-wrap').innerHTML = 
                '<div style="width: ' + demPct + '%; background: #00AEF3;"></div>' +
                '<div style="width: ' + repPct + '%; background: #E81B23;"></div>';
            document.getElementById('poll-dem-val').innerText = demPct.toFixed(1) + '%';
            document.getElementById('poll-rep-val').innerText = repPct.toFixed(1) + '%';
        }
        
        // Show turnout info
        var issuesList = document.getElementById('sp-issues-list');
        if (issuesList) {
            var turnoutBoost = 0;
            if (county.turnout) {
                if (gameData.selectedParty === 'D' || gameData.selectedParty === 'R') {
                    turnoutBoost = (county.turnout.player || 1.0) - 1.0;
                } else {
                    turnoutBoost = (county.turnout.thirdParty || 0.7) - 0.7;
                }
            }
            
            var turnoutText = 'Normal';
            if (turnoutBoost > 0.15) turnoutText = 'Strong';
            else if (turnoutBoost > 0.08) turnoutText = 'Good';
            else if (turnoutBoost > 0.03) turnoutText = 'Moderate';
            
            issuesList.innerHTML = '<div style="background: #2a2a2a; padding: 8px; margin-bottom: 10px; border-radius: 4px;"><strong>Turnout:</strong> <span style="color: ' + (turnoutBoost > 0.1 ? '#198754' : '#ccc') + '">' + turnoutText + '</span></div>';
            issuesList.innerHTML += '<div style="background: #2a2a2a; padding: 8px; border-radius: 4px;"><strong>Type:</strong> ' + (county.t || 'Unknown') + '</div>';
        }
        
        // Mark that we're in county view mode
        gameData.inCountyView = true;
        
        // Add county-specific action buttons
        var actionGrid = document.querySelector('.action-grid');
        if (actionGrid) {
            // Clear existing buttons and add county actions
            // Top row: Back to Map and Rally
            // Bottom row: Speech (full width)
            actionGrid.innerHTML = 
                '<button class="act-btn" onclick="app.closeCountyView()"><span>🗺️</span><span>BACK TO MAP</span></button>' +
                '<button class="act-btn" onclick="app.countyRally()"><span>🎤</span><span>RALLY</span></button>' +
                '<button class="act-btn" onclick="app.countySpeech()" style="grid-column: 1 / -1;"><span>🎙️</span><span>SPEECH</span></button>';
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
        
        // Apply turnout boost to this county - more realistic values (3-8% boost)
        var turnoutBoost = 0.03 + Math.random() * 0.05; // 3-8% boost
        
        if (!county.turnout) county.turnout = { player: 1.0, demOpponent: 1.0, repOpponent: 1.0, thirdParty: 0.7 };
        
        if (gameData.selectedParty === 'D' || gameData.selectedParty === 'R') {
            county.turnout.player = (county.turnout.player || 1.0) + turnoutBoost;
        } else {
            county.turnout.thirdParty = (county.turnout.thirdParty || 0.7) + (turnoutBoost * 0.5);
        }
        
        // Cap turnout at 1.3 (130% - more realistic)
        county.turnout.player = Math.min(1.3, county.turnout.player || 1.0);
        county.turnout.thirdParty = Math.min(1.3, county.turnout.thirdParty || 0.7);
        
        // Apply smaller boost to adjacent counties
        var adjacentBoost = turnoutBoost * 0.3;
        // For simplicity, boost nearby counties (would need proper adjacency data)
        
        gameData.energy -= 1;
        gameData.funds -= 0.5;
        
        // Update state-level margin based on county votes
        this.updateStateFromCounties(this.currentState);
        
        var message = 'County rally in ' + (county.n || 'County') + '! Turnout boost: +' + (turnoutBoost * 100).toFixed(1) + '%';
        Utils.addLog(message);
        Campaign.updateHUD();
        Campaign.colorMap();
        this.colorCountyMap();
        Utils.showToast(message);
    },
    
    // Update state-level margin from county data
    // Calculates state's total Democratic, Republican, and Third Party votes
    // by summing votes from EVERY county assigned to that state (using FIPS code prefix)
    updateStateFromCounties: function(stateCode) {
        var stateFips = STATES[stateCode] ? STATES[stateCode].fips : null;
        if (!stateFips) return;
        
        var totalDemVotes = 0;
        var totalRepVotes = 0;
        var totalThirdPartyVotes = 0;
        
        // Sum ALL votes from every county in this state
        for (var fips in this.countyData) {
            // Normalize FIPS for comparison
            var normalizedFips = this.normalizeFips(fips);
            if (normalizedFips.substring(0, 2) === stateFips) {
                var county = this.countyData[fips];
                if (county.v && county.p) {
                    // Initialize turnout if not present
                    if (!county.turnout) {
                        county.turnout = { player: 1.0, demOpponent: 1.0, repOpponent: 1.0, thirdParty: 0.7 };
                    }
                    
                    // Use correct turnout for each party
                    var demTurnout = gameData.selectedParty === 'D' ? (county.turnout.player || 1.0) : (county.turnout.demOpponent || 1.0);
                    var repTurnout = gameData.selectedParty === 'R' ? (county.turnout.player || 1.0) : (county.turnout.repOpponent || 1.0);
                    var thirdPartyTurnout = county.turnout.thirdParty || 0.7;
                    
                    // FIX: county.v contains PERCENTAGES, not vote counts!
                    // Must multiply by population to get actual vote counts
                    var demVotes = (county.v.D || 0) * county.p / 100 * demTurnout;
                    var repVotes = (county.v.R || 0) * county.p / 100 * repTurnout;
                    
                    // Include Third Party votes (G, L, and O - Other)
                    var thirdVotes = ((county.v.G || 0) + (county.v.L || 0) + (county.v.O || 0)) * county.p / 100 * thirdPartyTurnout;
                    
                    totalDemVotes += demVotes;
                    totalRepVotes += repVotes;
                    totalThirdPartyVotes += thirdVotes;
                }
            }
        }
        
        // Calculate new margin derived directly from this sum
        var totalVotes = totalDemVotes + totalRepVotes + totalThirdPartyVotes;
        if (totalVotes > 0) {
            var demPct = (totalDemVotes / totalVotes) * 100;
            var repPct = (totalRepVotes / totalVotes) * 100;
            var thirdPct = (totalThirdPartyVotes / totalVotes) * 100;
            var newMargin = demPct - repPct;
            
            // Update state data
            if (gameData.states[stateCode]) {
                gameData.states[stateCode].margin = newMargin;
                gameData.states[stateCode].demPct = demPct;
                gameData.states[stateCode].repPct = repPct;
                gameData.states[stateCode].thirdPct = thirdPct;
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
            
            // Always show exact margin, no "TOSS-UP" label
            marginText = (margin > 0 ? 'D+' : 'R+') + Math.abs(margin).toFixed(1);
            color = margin > 0 ? '#00AEF3' : '#E81B23';
        }
        
        // Determine proper suffix based on state
        var countyName = county.n || 'County';
        var suffix = 'County';
        var normalizedFips = this.normalizeFips(fips);
        var stateFips = normalizedFips.substring(0, 2);
        
        // Alaska uses "Borough", Louisiana uses "Parish"
        if (stateFips === '02') {  // Alaska FIPS code
            suffix = 'Borough';
        } else if (stateFips === '22') {  // Louisiana FIPS code
            suffix = 'Parish';
        }
        
        // Only add suffix if the name doesn't already contain it
        if (!countyName.includes(suffix) && !countyName.includes('County') && 
            !countyName.includes('Borough') && !countyName.includes('Parish')) {
            countyName = countyName + ' ' + suffix;
        }
        
        tooltip.innerHTML = 
            '<span class="tooltip-title">' + countyName + '</span>' +
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
    },
    
    // Open county speech modal
    openCountySpeechModal: function(fips) {
        var county = this.countyData[fips];
        if (!county) return;
        
        // Check energy
        if (gameData.energy < 1) {
            Utils.showToast("Not enough energy!");
            return;
        }
        
        // Check if CORE_ISSUES is defined
        if (typeof CORE_ISSUES === 'undefined') {
            Utils.showToast("Issue data not loaded!");
            return;
        }
        
        // Build speech modal content
        var modal = document.getElementById('speech-modal');
        if (!modal) return;
        
        var countyName = county.n || 'County';
        document.getElementById('speech-modal').querySelector('h2').innerText = 'Campaign Speech - ' + countyName;
        
        var issuesHtml = '';
        for (var i = 0; i < CORE_ISSUES.length; i++) {
            var issue = CORE_ISSUES[i];
            
            issuesHtml += '<button class="speech-issue-btn" onclick="Counties.handleCountySpeech(\'' + fips + '\', \'' + issue.id + '\')">';
            issuesHtml += issue.name;
            issuesHtml += '<span class="issue-alignment">Will affect interest groups based on your position</span>';
            issuesHtml += '</button>';
        }
        
        document.getElementById('speech-issues-list').innerHTML = issuesHtml;
        modal.classList.remove('hidden');
    },
    
    // Handle county speech on an issue
    handleCountySpeech: function(fips, issueId) {
        var county = this.countyData[fips];
        if (!county || gameData.energy < 1) return;
        
        Campaign.saveState();
        
        // Close modal
        document.getElementById('speech-modal').classList.add('hidden');
        
        // Consume energy
        gameData.energy -= 1;
        
        // Get candidate's position on this issue
        var candidatePos = (gameData.candidate.issuePositions && gameData.candidate.issuePositions[issueId]) || 0;
        
        // Small voter count increase in this county (2-5%)
        var voterBoost = 0.02 + Math.random() * 0.03;
        
        if (!county.turnout) county.turnout = { player: 1.0, demOpponent: 1.0, repOpponent: 1.0, thirdParty: 0.7 };
        
        if (gameData.selectedParty === 'D' || gameData.selectedParty === 'R') {
            county.turnout.player = Math.min(1.3, (county.turnout.player || 1.0) + voterBoost);
        } else {
            county.turnout.thirdParty = Math.min(1.3, (county.turnout.thirdParty || 0.7) + (voterBoost * 0.5));
        }
        
        // Now affect interest groups based on issue alignment
        if (typeof INTEREST_GROUPS === 'undefined') {
            // Interest groups not defined, skip this part
            Utils.addLog(message);
            return;
        }
        
        for (var groupId in INTEREST_GROUPS) {
            var group = INTEREST_GROUPS[groupId];
            
            // Check if this issue is a priority for this group
            var isPriority = group.priorities && group.priorities.includes(issueId);
            
            if (isPriority) {
                // Calculate alignment based on position overlap
                var groupPreferredPos = group.issue_positions ? (group.issue_positions[issueId] || 0) : 0;
                var positionDiff = Math.abs(candidatePos - groupPreferredPos);
                
                var supportChange = 0;
                
                if (positionDiff === 0) {
                    // Perfect overlap
                    supportChange = 0.5;
                } else if (positionDiff < 5) {
                    // Partial overlap - linear decay
                    supportChange = 0.5 * (1 - positionDiff / 5);
                } else if (positionDiff >= 5) {
                    // Nullified or negative
                    supportChange = -0.5 * ((positionDiff - 5) / 10);
                    supportChange = Math.max(supportChange, -0.5);
                }
                
                // Apply the change to candidate's support in this group
                if (gameData.interestGroupSupport && gameData.interestGroupSupport[groupId]) {
                    var candId = gameData.candidate.id;
                    var currentSupport = gameData.interestGroupSupport[groupId][candId] || 0;
                    var newSupport = currentSupport + supportChange;
                    
                    // Ensure valid range
                    newSupport = Math.max(0, Math.min(100, newSupport));
                    
                    // Store change for display
                    if (!gameData.interestGroupChanges[groupId]) {
                        gameData.interestGroupChanges[groupId] = {};
                    }
                    gameData.interestGroupChanges[groupId][candId] = (gameData.interestGroupChanges[groupId][candId] || 0) + supportChange;
                    
                    // Apply change
                    gameData.interestGroupSupport[groupId][candId] = newSupport;
                    
                    // Propagate this change to ALL counties based on group population percentage
                    this.propagateInterestGroupChange(groupId, candId, supportChange);
                }
            }
        }
        
        // Update display
        this.updateStateFromCounties(this.currentState);
        Campaign.updateHUD();
        Campaign.colorMap();
        this.colorCountyMap();
        
        var message = 'Campaign speech on ' + issueId + ' in ' + (county.n || 'County') + '!';
        Utils.addLog(message);
        Utils.showToast(message);
    },
    
    // Propagate interest group support change to all counties
    propagateInterestGroupChange: function(groupId, candId, supportChange) {
        // Get the group's population percentage in each county (from STATE_DEMOGRAPHICS if available)
        // For now, use a simplified approach based on state demographics
        
        if (typeof STATE_DEMOGRAPHICS === 'undefined') {
            // Demographics not defined, skip propagation
            return;
        }
        
        for (var fips in this.countyData) {
            var county = this.countyData[fips];
            // Normalize FIPS for comparison
            var normalizedFips = this.normalizeFips(fips);
            var stateFips = normalizedFips.substring(0, 2);
            
            // Find which state this belongs to
            var stateCode = null;
            for (var code in STATES) {
                if (STATES[code].fips === stateFips) {
                    stateCode = code;
                    break;
                }
            }
            
            if (!stateCode || !STATE_DEMOGRAPHICS[stateCode]) continue;
            
            // Get group percentage in this state (approximate for county)
            var groupPct = STATE_DEMOGRAPHICS[stateCode][groupId] || 0;
            
            // Calculate vote shift: CHANGE × Interest Group %
            var voteShift = supportChange * (groupPct / 100);
            
            // Apply to county votes
            if (!county.turnout) county.turnout = { player: 1.0, demOpponent: 1.0, repOpponent: 1.0, thirdParty: 0.7 };
            
            // Determine which party benefits
            if (candId === gameData.candidate.id) {
                if (gameData.selectedParty === 'D') {
                    // Player is Democrat - adjust turnout
                    county.turnout.player = Math.min(1.5, Math.max(0.5, (county.turnout.player || 1.0) + (voteShift / 100)));
                } else if (gameData.selectedParty === 'R') {
                    // Player is Republican - adjust turnout
                    county.turnout.player = Math.min(1.5, Math.max(0.5, (county.turnout.player || 1.0) + (voteShift / 100)));
                }
            }
        }
    }
};
