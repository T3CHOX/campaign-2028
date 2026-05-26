/* ============================================
   DECISION 2028 - CAMPAIGN GAMEPLAY
   ============================================ */

// Game balance constants
var GAME_CONSTANTS = {
    PAC_OFFER_CHANCE: 0.2,
    PAC_OFFER_DELAY: 1000,
    FAVORABILITY_PENALTY_MULTIPLIER: 0.012
};

var Campaign = {
    mapMode: 'margin',
    getStateActionGridHTML: function() {
        return '' +
            '<button class="act-btn" onclick="app.handleAction(\'fundraise\')"><span><i class="fa-solid fa-sack-dollar"></i></span><span>FUNDRAISE</span></button>' +
            '<button class="act-btn" onclick="app.handleAction(\'rally\')"><span><i class="fa-solid fa-bullhorn"></i></span><span>RALLY</span></button>' +
            '<button class="act-btn" onclick="app.handleAction(\'field\')"><span><i class="fa-solid fa-people-group"></i></span><span>FIELD OPS</span></button>' +
            '<button class="act-btn" onclick="app.handleAction(\'digital\')"><span><i class="fa-solid fa-laptop"></i></span><span>DIGITAL</span></button>' +
            '<button class="act-btn" onclick="app.openStateBio()"><span><i class="fa-solid fa-book-open"></i></span><span>INTEL</span></button>' +
            '<button class="act-btn" onclick="app.openCountyView()"><span><i class="fa-solid fa-map"></i></span><span>BREAKDOWN</span></button>' +
            '<button class="act-btn" onclick="app.openIssuesPanel()"><span><i class="fa-solid fa-chart-line"></i></span><span>ISSUES</span></button>' +
            '<button class="act-btn" onclick="app.handleAction(\'speech\')"><span><i class="fa-solid fa-microphone"></i></span><span>SPEECH</span></button>';
    },

    restoreStateActionGrid: function() {
        var actionGrid = document.querySelector('.action-grid');
        if (actionGrid) actionGrid.innerHTML = this.getStateActionGridHTML();
        var adTile = document.querySelector('.ad-campaign-tile');
        if (adTile) adTile.classList.remove('hidden');
    },

    initMap: function() {
        var wrapper = document.getElementById('us-map-wrapper');
        wrapper.innerHTML = '<div class="loading-map">Loading map...</div>';
        
        // Add double-click handler for national overview
        wrapper.ondblclick = function(e) {
            if (e.target === wrapper || e.target.id === 'us-map-svg') {
                app.openNationalOverview();
            }
        };
        
        // Load county data first
        Counties.loadCountyData(function() {
            console.log('County data loaded');
            
            // Apply candidate/VP buffs now that county data is available
            applyCandidateBuffs();
            
            // Compute live interest group support from county data
            recomputeInterestGroupSupport();
            
            // Update map colors after county data initializes state margins
            Campaign.colorMap();
        });
        
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'map.svg', true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var parser = new DOMParser();
                var svgDoc = parser.parseFromString(xhr.responseText, 'image/svg+xml');
                var svg = svgDoc.querySelector('svg');
                
                if (svg) {
                    svg.id = 'us-map-svg';
                    var paths = svg.querySelectorAll('path');
                    for (var i = 0; i < paths.length; i++) {
                        var path = paths[i];
                        var code = path.id;
                        if (code && gameData.states[code]) {
                            path.style.cursor = 'pointer';
                            (function(c) {
                                path.onclick = function() { Campaign.clickState(c); };
                                path.ondblclick = function(e) {
                                    e.stopPropagation();
                                    // Double-click to open county view
                                    if (typeof Counties !== 'undefined') {
                                        Counties.openCountyView(c);
                                    }
                                };
                                path.onmousemove = function(e) { Campaign.showTooltip(e, gameData.states[c]); };
                                path.onmouseleave = function() { document.getElementById('map-tooltip').style.display = 'none'; };
                            })(code);
                        }
                    }
                    wrapper.innerHTML = '';
                    wrapper.appendChild(svg);
                    Campaign.colorMap();
                }
            } else if (xhr.readyState === 4) {
                wrapper.innerHTML = '<div class="error-map">Failed to load map. Make sure map.svg exists.</div>';
            }
        };
        xhr.send();
    },

    showTooltip: function(e, state) {
        var tooltip = document.getElementById('map-tooltip');
        var marginText = Math.abs(state.margin).toFixed(1);
        // Always show exact margin, no "TOSS-UP" label
        var leaning = (state.margin > 0 ? 'D+' : 'R+') + marginText;
        
        tooltip.innerHTML = 
            '<span class="tooltip-title">' + state.name + '</span>' +
            '<div class="tooltip-divider"></div>' +
            '<span class="tooltip-leader" style="color: ' + (state.margin > 0 ? '#00AEF3' : '#E81B23') + '">' + leaning + '</span>' +
            '<span class="tooltip-stats">' + state.ev + ' Electoral Votes</span>';
        tooltip.style.display = 'block';
        tooltip.style.left = (e.clientX + 15) + 'px';
        tooltip.style.top = (e.clientY + 15) + 'px';
    },

    clickState: function(code) {
        gameData.selectedState = code;
        var paths = document.querySelectorAll('#us-map-svg path');
        for (var i = 0; i < paths.length; i++) {
            paths[i].classList.remove('selected');
        }
        var path = document.getElementById(code);
        if (path) path.classList.add('selected');
        
        document.getElementById('empty-msg').classList.add('hidden');
        document.getElementById('state-panel').classList.remove('hidden');
        
        var s = gameData.states[code];
        document.getElementById('sp-name').innerText = s.name;
        var evLabel = s.ev + ' EV';
        if ((code === 'NE' || code === 'ME') && typeof Counties !== 'undefined' && Counties.calculateStateElectoralAllocation) {
            var split = Counties.calculateStateElectoralAllocation(code, { useReportedVotes: false });
            if (split && split.isSplitState) {
                evLabel = s.ev + ' EV (' + split.statewideWinner + '+' + split.statewideEV + ' statewide)';
            }
        }
        document.getElementById('sp-ev').innerText = evLabel;
        
        // Build ranked candidate list for the state
        var pollByParty = Utils.getStatePollingByParty(code);
        var prevPollByParty = (gameData.pollCache && gameData.pollCache[code]) || null;
        var pollVis = document.getElementById('poll-vis');
        if (pollVis) {
            pollVis.innerHTML = Utils.buildCandidateRankedListHTML(pollByParty, prevPollByParty);
        }
        
        // Calculate and display turnout if available
        var turnoutText = 'Normal';
        var turnoutBoosts = s.turnoutBoosts || {};
        var totalBoost = 0;
        for (var issue in turnoutBoosts) {
            totalBoost += turnoutBoosts[issue];
        }
        if (s.rallies) totalBoost += s.rallies * 0.05;
        
        if (totalBoost > 0.15) turnoutText = 'Strong';
        else if (totalBoost > 0.08) turnoutText = 'Good';
        else if (totalBoost > 0.03) turnoutText = 'Moderate';
        
        var issuesList = document.getElementById('sp-issues-list');
        issuesList.innerHTML = '';
        issuesList.innerHTML += '<div style="background: #2a2a2a; padding: 8px; margin-bottom: 10px; border-radius: 4px;"><strong>Turnout:</strong> <span style="color: ' + (totalBoost > 0.1 ? '#198754' : '#ccc') + '">' + turnoutText + '</span></div>';
        
        // Use CORE_ISSUES if available, otherwise fallback to old ISSUES
        var issueSource = (typeof CORE_ISSUES !== 'undefined') ? CORE_ISSUES : ISSUES;
        var shuffled = Utils.shuffleArray(issueSource).slice(0, 3);
        for (var j = 0; j < shuffled.length; j++) {
            issuesList.innerHTML += '<span class="issue-tag">' + shuffled[j].name + '</span>';
        }
        
        // Initialize ad issue dropdown
        if (typeof app !== 'undefined' && app.initAdIssueDropdown) {
            app.initAdIssueDropdown();
        }
        
        // Update queued ads display
        if (typeof app !== 'undefined' && app.updateQueuedAdsDisplay) {
            app.updateQueuedAdsDisplay();
        }
    },

    colorMap: function() {
        for (var code in gameData.states) {
            var s = gameData.states[code];
            var path = document.getElementById(code);
            if (path) {
                path.style.fill = this.getStateMapColor(code, s);
            }
        }
        this.updateScore();
    },

    setMapMode: function(mode) {
        this.mapMode = mode || 'margin';
        var buttons = document.querySelectorAll('.campaign-map-mode-toggle .mode-btn');
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].classList.remove('active');
        }
        var active = document.getElementById('campaign-mode-' + this.mapMode);
        if (active) active.classList.add('active');
        this.colorMap();
        if (typeof Counties !== 'undefined' && gameData.inCountyView && Counties.colorCountyMap) {
            Counties.colorCountyMap();
        }
    },

    getStateMapColor: function(code, state) {
        var mode = this.mapMode || 'margin';
        if (mode === 'margin') return Utils.getMarginColor(state.margin);
        if (mode === 'ev') return this.getGoldScaleColor((state.ev || 0) / 54);
        if (mode === 'density') return this.getGoldScaleColor(this.getStatePopulationDensityIndex(code));
        if (mode === 'turnout') return this.getGoldScaleColor(this.getStateTurnoutIndex(code, 'all'));
        if (mode === 'playerTurnout') return this.getGoldScaleColor(this.getStateTurnoutIndex(code, 'player'));
        if (mode === 'opponentTurnout') return this.getGoldScaleColor(this.getStateTurnoutIndex(code, 'opponent'));
        if (mode === 'favorability') return this.getFavorabilityColor(this.getFavorability());
        return Utils.getMarginColor(state.margin);
    },

    getGoldScaleColor: function(index) {
        var v = Math.max(0, Math.min(1, index || 0));
        var colors = ['#2b2114', '#5a3516', '#8f541d', '#c98720', '#f4c15d'];
        return colors[Math.min(colors.length - 1, Math.floor(v * colors.length))];
    },

    getFavorabilityColor: function(value) {
        var v = Math.max(0, Math.min(1, value || 0.5));
        if (v < 0.35) return '#7a0509';
        if (v < 0.45) return '#d71920';
        if (v < 0.55) return '#f4c15d';
        if (v < 0.65) return '#7fbf6e';
        return '#198754';
    },

    getStatePopulationDensityIndex: function(code) {
        if (!STATES[code] || !Counties || !Counties.countyData) return 0;
        var stateFips = STATES[code].fips;
        var pop = 0;
        var countyCount = 0;
        for (var fips in Counties.countyData) {
            var padded = fips.padStart(5, '0');
            if (padded.substring(0, 2) !== stateFips) continue;
            pop += Counties.countyData[fips].p || 0;
            countyCount++;
        }
        return Math.min(1, pop / Math.max(1, countyCount) / 900000);
    },

    getStateTurnoutIndex: function(code, type) {
        if (!STATES[code] || !Counties || !Counties.countyData) return 0;
        var stateFips = STATES[code].fips;
        var total = 0;
        var weight = 0;
        for (var fips in Counties.countyData) {
            var padded = fips.padStart(5, '0');
            if (padded.substring(0, 2) !== stateFips) continue;
            var county = Counties.countyData[fips];
            var pop = county.p || 0;
            var turnout = county.turnout || {};
            var val = 1;
            if (type === 'player') val = turnout.player || 1;
            else if (type === 'opponent') {
                val = gameData.selectedParty === 'D' ? (turnout.repOpponent || 1) : (turnout.demOpponent || 1);
            } else {
                val = Math.max(turnout.player || 1, turnout.demOpponent || 1, turnout.repOpponent || 1, turnout.thirdParty || 0.7);
            }
            total += pop * val;
            weight += pop;
        }
        if (weight <= 0) return 0;
        return Math.max(0, Math.min(1, ((total / weight) - 0.7) / 0.6));
    },

    updateScore: function() {
        var demEV = 0;
        var repEV = 0;
        for (var code in gameData.states) {
            var s = gameData.states[code];
            if (typeof Counties !== 'undefined' && Counties.calculateStateElectoralAllocation) {
                var projected = Counties.calculateStateElectoralAllocation(code, { useReportedVotes: false });
                if (projected && projected.allocation) {
                    demEV += projected.allocation.D || 0;
                    repEV += projected.allocation.R || 0;
                    continue;
                }
            }
            if (s.margin > 0) {
                demEV += s.ev;
            } else {
                repEV += s.ev;
            }
        }
        document.getElementById('score-dem').innerText = demEV;
        document.getElementById('score-rep').innerText = repEV;
        
        var demPct = (demEV / 538) * 100;
        document.getElementById('ev-bar').style.background = 'linear-gradient(to right, #00AEF3 ' + demPct + '%, #E81B23 ' + demPct + '%)';
    },

    updateHUD: function() {
        document.getElementById('hud-img').src = gameData.candidate.img;
        document.getElementById('hud-cand-name').innerText = gameData.candidate.name;
        document.getElementById('hud-party-name').innerText = PARTIES[gameData.selectedParty].name.toUpperCase();
        document.getElementById('hud-funds').innerText = '$' + gameData.funds.toFixed(1) + 'M';
        document.getElementById('hud-date').innerText = Utils.formatDate(gameData.currentDate);
        var fav = document.getElementById('hud-favorability') || document.getElementById('hud-credibility');
        if (fav) {
            fav.innerText = Math.round(this.getFavorability() * 100) + '%';
        }
        
        var energyHtml = '';
        for (var i = 0; i < gameData.maxEnergy; i++) {
            energyHtml += '<div class="energy-pip ' + (i < gameData.energy ? 'active' : '') + '"></div>';
        }
        document.getElementById('hud-energy').innerHTML = energyHtml;
    },

    getFavorability: function() {
        if (typeof gameData.favorability !== 'number') {
            gameData.favorability = typeof gameData.credibility === 'number'
                ? Math.max(0, Math.min(1, (gameData.credibility - 0.7) / 0.45))
                : FAVORABILITY_CONSTANTS.BASE;
        }
        return Math.max(FAVORABILITY_CONSTANTS.MIN, Math.min(FAVORABILITY_CONSTANTS.MAX, gameData.favorability));
    },

    adjustFavorability: function(delta, reason) {
        gameData.favorability = Math.max(FAVORABILITY_CONSTANTS.MIN,
            Math.min(FAVORABILITY_CONSTANTS.MAX, this.getFavorability() + delta));
        gameData.credibility = 0.7 + (gameData.favorability * 0.45);
        if (reason && typeof Utils !== 'undefined') {
            Utils.addLog('Favorability ' + (delta >= 0 ? '+' : '') + Math.round(delta * 100) + ': ' + reason);
        }
        this.updateHUD();
    },

    handleAction: function(action) {
        if (! gameData.selectedState) {
            return Utils.showToast("Select a state first!");
        }
        
        var s = gameData.states[gameData.selectedState];
        
        if (action === 'fundraise') {
            if (typeof app !== 'undefined' && app.openFundraiseModal) {
                app.openFundraiseModal();
            }
            return;
        } else if (action === 'rally') {
            // Queue rally action
            if (gameData.energy < PERSUASION_CONSTANTS.RALLY_ENERGY_COST) {
                return Utils.showToast("Need " + PERSUASION_CONSTANTS.RALLY_ENERGY_COST + " energy for rally!");
            }
            if (gameData.funds < PERSUASION_CONSTANTS.RALLY_COST) {
                return Utils.showToast("Need $" + PERSUASION_CONSTANTS.RALLY_COST + "M for rally!");
            }
            
            var rallyAction = {
                type: 'RALLY',
                state: gameData.selectedState,
                cost: {
                    funds: PERSUASION_CONSTANTS.RALLY_COST,
                    energy: PERSUASION_CONSTANTS.RALLY_ENERGY_COST
                }
            };
            
            if (typeof Persuasion !== 'undefined' && Persuasion.queueAction(rallyAction)) {
                s.rallies = (s.rallies || 0) + 1;
                s.visited = true;
                s.lastCampaignDate = new Date(gameData.currentDate);
                s.campaignActionsCount = (s.campaignActionsCount || 0) + 1;
                
                Utils.showToast("Rally queued in " + s.name);
                Utils.addLog("Queued rally in " + s.name);
                
                this.updateHUD();
                this.clickState(gameData.selectedState);
                
                if (typeof app !== 'undefined' && app.updateQueuedAdsDisplay) {
                    app.updateQueuedAdsDisplay();
                }
            }
            
        } else if (action === 'speech') {
            // Open speech modal to select issue
            app.openSpeechModal();
            return;
        } else if (action === 'field') {
            app.openFieldModal();
            return;
        } else if (action === 'digital') {
            app.openDigitalModal();
            return;
        }
    },

    handleSpeech: function(issueId, intensity) {
        if (!gameData.selectedState) return;
        
        var s = gameData.states[gameData.selectedState];
        
        // Default intensity to 1 if not provided
        if (!intensity) intensity = 1;
        
        var cost = intensity * PERSUASION_CONSTANTS.SPEECH_BASE_COST;
        var energyCost = PERSUASION_CONSTANTS.SPEECH_ENERGY_COST;
        
        if (gameData.energy < energyCost) {
            Utils.showToast("Not enough energy!");
            return;
        }
        if (gameData.funds < cost) {
            Utils.showToast("Need $" + cost.toFixed(1) + "M for campaign speech!");
            return;
        }
        
        // Queue the speech action (statewide, no specific county)
        var speechAction = {
            type: 'SPEECH',
            state: gameData.selectedState,
            countyId: null,  // Statewide speech from modal
            issueId: issueId,
            intensity: intensity,
            cost: {
                funds: cost,
                energy: energyCost
            }
        };
        
        if (typeof Persuasion !== 'undefined' && Persuasion.queueAction(speechAction)) {
            s.lastCampaignDate = new Date(gameData.currentDate);
            s.campaignActionsCount = (s.campaignActionsCount || 0) + 1;
            
            var issue = CORE_ISSUES.find(function(i) { return i.id === issueId; });
            var issueName = issue ? issue.name : issueId;
            
            Utils.showToast("Speech queued: " + issueName);
            Utils.addLog("Queued speech on " + issueName + " in " + s.name);
            
            this.updateHUD();
            this.clickState(gameData.selectedState);
            
            if (typeof app !== 'undefined' && app.updateQueuedAdsDisplay) {
                app.updateQueuedAdsDisplay();
            }
        }
        
        app.closeSpeechModal();
        
        // Update interest group turnout propensity for aligned groups
        if (typeof updateGroupTurnoutFromIssue !== 'undefined') {
            updateGroupTurnoutFromIssue(issueId, gameData.selectedParty, intensity);
        }
    },

    openStateBio: function() {
        if (! gameData.selectedState) return;
        var s = gameData.states[gameData.selectedState];
        
        var marginText = Math.abs(s.margin).toFixed(1);
        var leaning;
        if (Math.abs(s.margin) < 2) {
            leaning = 'TOSS-UP';
        } else {
            leaning = (s.margin > 0 ? 'D+' :  'R+') + marginText;
        }
        
        // Format last campaign date
        var lastCampaignText = 'Never';
        if (s.lastCampaignDate) {
            var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];
            var date = new Date(s.lastCampaignDate);
            var monthStr = months[date.getMonth()];
            var dayStr = date.getDate();
            var count = s.campaignActionsCount || 0;
            lastCampaignText = monthStr + ' ' + dayStr + ' (<u>' + count + '</u>)';
        }
        
        document.getElementById('bio-title').innerText = s.name + ' - Intelligence Report';
        document.getElementById('bio-content').innerHTML = 
            '<div class="bio-stat"><strong>Electoral Votes:</strong> ' + s.ev + '</div>' +
            '<div class="bio-stat"><strong>Current Polling:</strong> <span style="color: ' + (s.margin > 0 ?  '#00AEF3' : '#E81B23') + '">' + leaning + '</span></div>' +
            '<div class="bio-stat"><strong>Last Campaigned:</strong> ' + lastCampaignText + '</div>' +
            '<div class="bio-stat"><strong>Ad Spending:</strong> $' + (s.adSpent || 0).toFixed(1) + 'M</div>' +
            this.getInterestGroupBreakdown(gameData.selectedState);
        document.getElementById('bio-modal').classList.remove('hidden');
    },
    
    getInterestGroupBreakdown: function(stateCode) {
        if (typeof STATE_DEMOGRAPHICS === 'undefined' || !STATE_DEMOGRAPHICS[stateCode]) {
            return '';
        }
        
        var demographics = STATE_DEMOGRAPHICS[stateCode];
        var html = '<div style="margin-top: 20px; padding-top: 15px; border-top: 2px solid #444;"><strong>Interest Group Demographics:</strong></div>';
        
        // Show top demographic groups
        var groups = [];
        for (var group in demographics) {
            if (demographics[group] > 10) {
                groups.push({ name: group, pct: demographics[group] });
            }
        }
        
        // Sort by percentage
        groups.sort(function(a, b) { return b.pct - a.pct; });
        
        for (var i = 0; i < Math.min(6, groups.length); i++) {
            var g = groups[i];
            var displayName = g.name.charAt(0).toUpperCase() + g.name.slice(1).replace('_', ' ');
            html += '<div class="bio-stat" style="font-size: 0.9rem;">' + displayName + ': ' + g.pct + '%</div>';
        }
        
        return html;
    },

    nextWeek: function() {
        this.saveState();
        
        // Save current poll values so next-turn delta can be shown
        if (typeof Utils !== 'undefined' && Utils.getStatePollingByParty) {
            if (!gameData.pollCache) gameData.pollCache = {};
            if (!gameData.pollCache.county) gameData.pollCache.county = {};
            for (var cacheCode in gameData.states) {
                var sp = Utils.getStatePollingByParty(cacheCode);
                if (sp) gameData.pollCache[cacheCode] = sp;
            }
            // Cache county-level polls for currently-loaded county data
            if (typeof Counties !== 'undefined' && Counties.countyData) {
                for (var cfips in Counties.countyData) {
                    var cp = Utils.getCountyPollingByParty(Counties.countyData[cfips]);
                    if (cp) gameData.pollCache.county[cfips] = cp;
                }
            }
        }

        // Apply all queued campaign actions BEFORE advancing the turn
        if (typeof Persuasion !== 'undefined') {
            Persuasion.applyQueuedActions();
        }
        
        gameData.currentDate.setDate(gameData.currentDate.getDate() + 7);
        gameData.energy = gameData.maxEnergy;
        
        // Process undecided voters
        this.processUndecidedVoters();
        
        if (typeof updateCoalitionLoyalty === 'function') {
            updateCoalitionLoyalty();
        }
        if (typeof this.processMediaVulnerabilities === 'function') {
            this.processMediaVulnerabilities();
        }

        // Recompute live interest group support after all changes
        if (typeof recomputeInterestGroupSupport !== 'undefined') {
            recomputeInterestGroupSupport();
        }
        
        // Random chance for PAC offer
        if (Math.random() < GAME_CONSTANTS.PAC_OFFER_CHANCE && typeof app.triggerPacOffer !== 'undefined') {
            setTimeout(function() {
                app.triggerPacOffer();
            }, GAME_CONSTANTS.PAC_OFFER_DELAY);
        }
        
        this.opponentTurn();

        if (gameData.playerPressure) {
            gameData.playerPressure = {};
        }
        
        if (gameData.currentDate >= gameData.electionDay) {
            Utils.addLog("Election Day has arrived!");
            Screens.goTo('election-screen');
            Election.start();
            return;
        }
        
        this.updateHUD();
        
        // Update queued ads display to show the queue is cleared
        if (typeof app !== 'undefined' && app.updateQueuedAdsDisplay) {
            app.updateQueuedAdsDisplay();
        }
        
        Utils.addLog("Week advanced - " + gameData.currentDate.toLocaleDateString());
        Utils.showToast("Week advanced!");
    },
    
    processUndecidedVoters: function() {
        if (typeof Counties === 'undefined' || !Counties.countyData) return;
        
        var isElectionDay = gameData.currentDate >= gameData.electionDay;
        
        for (var fips in Counties.countyData) {
            var county = Counties.countyData[fips];
            
            if (!county.undecided || county.undecided <= 0) continue;
            
            var undecidedPool = county.undecided;
            var reductionRate;
            
            if (isElectionDay) {
                // On Election Day, distribute ALL remaining undecided 50/50
                reductionRate = 1.0;
            } else {
                // Each week: reduce by 10-15%
                reductionRate = 0.10 + Math.random() * 0.05;
            }
            
            var decidingVoters = undecidedPool * reductionRate;
            
            if (isElectionDay) {
                // Split 50/50 between D and R on Election Day
                var demShare = decidingVoters * 0.5;
                var repShare = decidingVoters * 0.5;
                
                county.v.D = (county.v.D || 0) + demShare;
                county.v.R = (county.v.R || 0) + repShare;
            } else {
                // Get state code from FIPS prefix
                var normalizedFips = Counties.normalizeFips(fips);
                var stateFips = normalizedFips.substring(0, 2);
                var stateCode = null;
                
                for (var code in STATES) {
                    if (STATES[code].fips === stateFips) {
                        stateCode = code;
                        break;
                    }
                }
                
                if (stateCode && gameData.states[stateCode]) {
                    var stateMargin = gameData.states[stateCode].margin;
                    
                    // Add random variance (+/- 5 percentage points)
                    var variance = (Math.random() - 0.5) * 10;
                    var adjustedMargin = stateMargin + variance;
                    
                    // Convert margin to percentage splits
                    // Margin is D% - R%, we need to distribute based on this
                    var demPct = 50 + (adjustedMargin / 2);
                    var repPct = 50 - (adjustedMargin / 2);
                    
                    // Ensure valid percentages
                    demPct = Math.max(0, Math.min(100, demPct));
                    repPct = Math.max(0, Math.min(100, repPct));
                    
                    // If clamping changed the values, normalize to sum to 100
                    var total = demPct + repPct;
                    if (total !== 100) {
                        demPct = (demPct / total) * 100;
                        repPct = (repPct / total) * 100;
                    }
                    
                    // Distribute deciding voters
                    var demShare = decidingVoters * (demPct / 100);
                    var repShare = decidingVoters * (repPct / 100);
                    
                    county.v.D = (county.v.D || 0) + demShare;
                    county.v.R = (county.v.R || 0) + repShare;
                }
            }
            
            // Reduce undecided pool
            county.undecided = Math.max(0, undecidedPool - decidingVoters);
        }
        
        // Update all state margins after processing undecided voters
        for (var code in gameData.states) {
            Counties.updateStateFromCounties(code);
        }
    },

    processMediaVulnerabilities: function() {
        if (!gameData.mediaVulnerabilities || !gameData.mediaVulnerabilities.length) return;
        if (typeof Utils === 'undefined') return;

        var updated = [];
        var triggeredAny = false;

        for (var i = 0; i < gameData.mediaVulnerabilities.length; i++) {
            var vuln = gameData.mediaVulnerabilities[i];
            if (!vuln || vuln.risk === undefined) {
                updated.push(vuln);
                continue;
            }
            if (vuln.triggered) {
                updated.push(vuln);
                continue;
            }
            if (Math.random() < vuln.risk) {
                triggeredAny = true;
                vuln.triggered = true;
                if (typeof FAVORABILITY_CONSTANTS !== 'undefined' && vuln.favorability) {
                    this.adjustFavorability(vuln.favorability, vuln.label);
                }
                if (vuln.turnoutHits && typeof initInterestGroupTurnout === 'function') {
                    initInterestGroupTurnout();
                    for (var groupId in vuln.turnoutHits) {
                        var hit = vuln.turnoutHits[groupId];
                        gameData.issueTurnout[groupId] = Math.max(BUFF_CONSTANTS.MIN_GROUP_TURNOUT,
                            Math.min(BUFF_CONSTANTS.MAX_GROUP_TURNOUT, (gameData.issueTurnout[groupId] || 1.0) + hit));
                    }
                    if (typeof recomputeCoalitionTurnout === 'function') {
                        recomputeCoalitionTurnout();
                    }
                    if (typeof Counties !== 'undefined' && Counties.updateStateFromCounties) {
                        for (var sc in gameData.states) {
                            Counties.updateStateFromCounties(sc);
                        }
                    }
                }
                Utils.addLog('MEDIA HIT: ' + (vuln.story || vuln.label));
                Utils.showToast('Media hit: ' + (vuln.label || 'Breaking story'));
            }
            updated.push(vuln);
        }

        if (triggeredAny && typeof Campaign !== 'undefined') {
            Campaign.updateHUD();
            Campaign.colorMap();
        }
        gameData.mediaVulnerabilities = updated;
    },

    opponentTurn: function() {
        // Execute AI turns for opponents
        if (gameData.selectedParty === 'D' && gameData.repTicket.pres) {
            OpponentAI.executeTurn('R', gameData.repTicket.pres.stamina || 8);
        } else if (gameData.selectedParty === 'R' && gameData.demTicket.pres) {
            OpponentAI.executeTurn('D', gameData.demTicket.pres.stamina || 8);
        } else if (Utils.isThirdParty(gameData.selectedParty)) {
            // Both major party opponents act
            if (gameData.demTicket.pres) {
                OpponentAI.executeTurn('D', gameData.demTicket.pres.stamina || 8);
            }
            if (gameData.repTicket.pres) {
                OpponentAI.executeTurn('R', gameData.repTicket.pres.stamina || 8);
            }
        }
        
        this.colorMap();
    },

    saveState: function() {
        var snapshot = {
            funds: gameData.funds,
            energy:  gameData.energy,
            date: gameData.currentDate.getTime(),
            states: {}
        };
        
        for (var code in gameData.states) {
            snapshot.states[code] = {
                margin: gameData.states[code].margin,
                visited: gameData.states[code].visited,
                adSpent: gameData.states[code].adSpent || 0,
                rallies:  gameData.states[code].rallies || 0
            };
        }
        
        gameData.historyStack.push(snapshot);
        if (gameData.historyStack.length > 20) gameData.historyStack.shift();
    },

    undoLastAction: function() {
        if (gameData.historyStack.length === 0) {
            return Utils.showToast("Nothing to undo!");
        }
        
        var prev = gameData.historyStack.pop();
        gameData.funds = prev.funds;
        gameData.energy = prev.energy;
        gameData.currentDate = new Date(prev.date);
        
        for (var code in prev.states) {
            gameData.states[code].margin = prev.states[code].margin;
            gameData.states[code].visited = prev.states[code].visited;
            gameData.states[code].adSpent = prev.states[code].adSpent;
            gameData.states[code].rallies = prev.states[code].rallies;
        }
        
        this.updateHUD();
        this.colorMap();
        if (gameData.selectedState) this.clickState(gameData.selectedState);
        Utils.showToast("Action undone!");
    },

    closeCountyView: function() {
        if (typeof Counties !== 'undefined') {
            Counties.closeCountyView();
        } else {
            document.getElementById('county-view-wrapper').classList.add('hidden');
            document.getElementById('us-map-wrapper').classList.remove('hidden');
        }
    }
};
