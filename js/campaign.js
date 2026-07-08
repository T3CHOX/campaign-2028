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
    populationCacheReady: false,
    statePopulationCache: null,
    maxStatePopulation: 0,
    maxCountyPopulation: 0,
    goldScaleColors: ['#2b2114', '#4b2d12', '#6b3f16', '#8c531b', '#b36f24', '#d6943e', '#f4c15d', '#fde7a1'],
    populationLogOffset: 1,
    mapPolarityGamma: 0.65,
    mapPolarityContrast: 1.25,
    TURNOUT_RATE_MIN: 0.45,
    TURNOUT_RATE_MAX: 0.8,
    getStateActionGridHTML: function() {
        return '' +
            '<button class="act-btn" onclick="app.handleAction(\'fundraise\')"><span><i class="fa-solid fa-sack-dollar"></i></span><span>FUNDRAISE</span></button>' +
            '<button class="act-btn" onclick="app.handleAction(\'rally\')"><span><i class="fa-solid fa-bullhorn"></i></span><span>RALLY</span></button>' +
            '<button class="act-btn" onclick="app.handleAction(\'field\')"><span><i class="fa-solid fa-people-group"></i></span><span>FIELD OPS</span></button>' +
            '<button class="act-btn" onclick="app.handleAction(\'digital\')"><span><i class="fa-solid fa-laptop"></i></span><span>DIGITAL</span></button>' +
            '<button class="act-btn" onclick="app.openStateBio()"><span><i class="fa-solid fa-book-open"></i></span><span>INTEL</span></button>' +
            '<button class="act-btn" onclick="app.openCountyView()"><span><i class="fa-solid fa-map"></i></span><span>BREAKDOWN</span></button>' +
            '<button class="act-btn" onclick="app.openIssuesPanel()"><span><i class="fa-solid fa-chart-line"></i></span><span>ISSUES</span></button>' +
            '<button class="act-btn" onclick="app.openEndorsersModal()"><span><i class="fa-solid fa-handshake"></i></span><span>ENDORSERS</span></button>' +
            '<button class="act-btn" onclick="app.handleAction(\'speech\')"><span><i class="fa-solid fa-microphone"></i></span><span>SPEECH</span></button>' +
            '<button class="act-btn v2-btn" onclick="app.handleAction(\'surrogate\')"><span><i class="fa-solid fa-user-group"></i></span><span>SURROGATE</span></button>' +
            '<button class="act-btn v2-btn" onclick="app.handleAction(\'debate_prep\')"><span><i class="fa-solid fa-book"></i></span><span>DEBATE PREP</span></button>' +
            '<button class="act-btn v2-btn" onclick="app.handleAction(\'oppo_research\')"><span><i class="fa-solid fa-magnifying-glass"></i></span><span>OPPO RESEARCH</span></button>' +
            '<button class="act-btn v2-btn" onclick="Campaign.handleGrassrootsFundraise()"><span><i class="fa-solid fa-hand-holding-dollar"></i></span><span>GRASSROOTS</span></button>';
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
            Campaign.resetPopulationCaches();
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
                                path.onmousemove = function(e) { Campaign.showTooltip(e, c); };
                                path.onmouseleave = function() { document.getElementById('map-tooltip').style.display = 'none'; };
                            })(code);
                        }
                    }
                    var titleElements = svg.querySelectorAll('title');
                    for (var j = 0; j < titleElements.length; j++) {
                        if (titleElements[j].parentNode) {
                            titleElements[j].parentNode.removeChild(titleElements[j]);
                        }
                    }

                    // Click outside states for national overview
                    svg.onclick = function(e) {
                        if (e.target.tagName === 'svg') {
                            Campaign.clickNational();
                        }
                    };

                    wrapper.innerHTML = '';
                    wrapper.appendChild(svg);
                    Campaign.stateSvg = svg;
                    Campaign.colorMap();
                }
            } else if (xhr.readyState === 4) {
                wrapper.innerHTML = '<div class="error-map">Failed to load map. Make sure map.svg exists.</div>';
            }
        };
        xhr.send();
    },

    showTooltip: function(e, code) {
        var state = gameData.states[code];
        if (!state) return;
        var tooltip = document.getElementById('map-tooltip');
        var mode = this.mapMode || 'margin';
        var detailLine = '';
        var subLine = '';

        if (mode === 'margin') {
            var marginText = Math.abs(state.margin).toFixed(1);
            var leaning = (state.margin > 0 ? 'D+' : 'R+') + marginText;
            detailLine = '<span class="tooltip-leader" style="color: ' + (state.margin > 0 ? '#00AEF3' : '#E81B23') + '">' + leaning + '</span>';
            subLine = '<span class="tooltip-stats">' + state.ev + ' Electoral Votes</span>';
        } else if (mode === 'ev') {
            detailLine = '<span class="tooltip-leader">' + state.ev + ' Electoral Votes</span>';
            subLine = '<span class="tooltip-stats">Electoral votes</span>';
        } else if (mode === 'population') {
            var pop = this.getStatePopulationTotal(code);
            detailLine = '<span class="tooltip-leader">' + pop.toLocaleString() + ' Population</span>';
            subLine = '<span class="tooltip-stats">Population total</span>';
        } else if (mode === 'turnout' || mode === 'playerTurnout' || mode === 'opponentTurnout') {
            var avg = this.getStateTurnoutAverage(code, mode === 'turnout' ? 'all' : (mode === 'playerTurnout' ? 'player' : 'opponent'));
            var label = mode === 'turnout' ? 'Turnout' : (mode === 'playerTurnout' ? 'Player Turnout' : 'Opponent Turnout');
            var rateLabel = avg ? (avg * 100).toFixed(1) + '%' : '—';
            detailLine = '<span class="tooltip-leader">' + label + ': ' + rateLabel + '</span>';
            subLine = '<span class="tooltip-stats">Expected turnout of registered voters</span>';
        } else if (mode === 'favorability') {
            var fav = Math.round(this.getFavorability() * 100);
            detailLine = '<span class="tooltip-leader">Favorability: ' + fav + '%</span>';
            subLine = '<span class="tooltip-stats">National standing</span>';
        }

        tooltip.innerHTML =
            '<span class="tooltip-title">' + state.name + '</span>' +
            '<div class="tooltip-divider"></div>' +
            detailLine +
            (subLine ? subLine : '');
        tooltip.style.display = 'block';
        tooltip.style.left = (e.clientX + 15) + 'px';
        tooltip.style.top = (e.clientY + 15) + 'px';
    },

    clickNational: function() {
        gameData.selectedState = null;
        gameData.selectedDistrict = null;
        var paths = document.querySelectorAll('#us-map-svg path');
        for (var i = 0; i < paths.length; i++) {
            paths[i].classList.remove('selected');
        }
        
        document.getElementById('empty-msg').classList.add('hidden');
        document.getElementById('state-panel').classList.remove('hidden');
        
        document.getElementById('sp-name').innerText = "United States of America";
        document.getElementById('sp-ev').innerText = "";
        
        var spDistricts = document.getElementById('sp-districts');
        if (spDistricts) {
            spDistricts.innerHTML = '';
            spDistricts.classList.add('hidden');
        }
        
        var pollByParty = Utils.getNationalPollingByParty();
        var prevPollByParty = (gameData.pollCache && gameData.pollCache['USA']) || null;
        var pollVis = document.getElementById('poll-vis');
        if (pollVis) {
            pollVis.innerHTML = Utils.buildCandidateRankedListHTML(pollByParty, prevPollByParty);
        }
        
        var issuesList = document.getElementById('sp-issues-list');
        issuesList.innerHTML = '';
        
        if (typeof Counties !== 'undefined') {
            document.getElementById('cv-districts').classList.add('hidden');
        }
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
        
        var spDistricts = document.getElementById('sp-districts');
        if (spDistricts) {
            spDistricts.innerHTML = '';
            spDistricts.classList.add('hidden');
        }

        if ((code === 'NE' || code === 'ME') && typeof Counties !== 'undefined' && Counties.calculateStateElectoralAllocation) {
            var split = Counties.calculateStateElectoralAllocation(code, { useReportedVotes: false });
            if (split && split.isSplitState) {
                
                
                if (spDistricts) {
                    spDistricts.classList.remove('hidden');
                    var dhtml = '';
                    for (var i = 0; i < split.districtResults.length; i++) {
                        var dres = split.districtResults[i];
                        var marginColor = '#444';
                        if (typeof Utils !== 'undefined' && Utils.getMarginColor) {
                            var totalDistVotes = 0;
                            for (var p in dres.votes) totalDistVotes += dres.votes[p];
                            var demVotes = dres.votes['D'] || 0;
                            var repVotes = dres.votes['R'] || 0;
                            var marginPct = totalDistVotes > 0 ? ((demVotes - repVotes) / totalDistVotes) * 100 : 0;
                            marginColor = Utils.getMarginColor(marginPct);
                        }
                        dhtml += '<div class="district-box" style="background-color: ' + marginColor + ';" onclick="Campaign.clickDistrict(\'' + code + '\', \'' + dres.district + '\')">' + dres.district + '</div>';
                    }
                    spDistricts.innerHTML = dhtml;
                }
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
        issuesList.innerHTML += '<div style="background: rgba(0,0,0,0.2); padding: 8px; margin-bottom: 10px; border-radius: 4px;"><strong>Turnout:</strong> <span style="color: ' + (totalBoost > 0.1 ? '#198754' : '#ccc') + '">' + turnoutText + '</span></div>';
        
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

    clickDistrict: function(stateCode, districtId) {
        if (!gameData.states[stateCode]) return;
        document.getElementById('sp-name').innerText = districtId;
        document.getElementById('sp-ev').innerText = '1 EV';
        
        var boxes = document.querySelectorAll('#sp-districts .district-box');
        for (var i = 0; i < boxes.length; i++) {
            if (boxes[i].innerText === districtId) boxes[i].classList.add('active');
            else boxes[i].classList.remove('active');
        }
        
        if (typeof Counties !== 'undefined' && Counties.calculateStateElectoralAllocation) {
            var split = Counties.calculateStateElectoralAllocation(stateCode, { useReportedVotes: false });
            if (split && split.districtResults) {
                var dres = null;
                for (var j = 0; j < split.districtResults.length; j++) {
                    if (split.districtResults[j].district === districtId) {
                        dres = split.districtResults[j];
                        break;
                    }
                }
                if (dres) {
                    var totalVotes = 0;
                    for (var p in dres.votes) totalVotes += dres.votes[p];
                    var distPoll = {};
                    if (totalVotes > 0) {
                        for (var p in dres.votes) {
                            distPoll[p] = (dres.votes[p] / totalVotes) * 100;
                        }
                    }
                    var pollVis = document.getElementById('poll-vis');
                    if (pollVis && typeof Utils !== 'undefined' && Utils.buildCandidateRankedListHTML) {
                        pollVis.innerHTML = Utils.buildCandidateRankedListHTML(distPoll, null);
                    }
                }
            }
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
        var select = document.getElementById('campaign-mode-select');
        if (select && select.value !== this.mapMode) {
            select.value = this.mapMode;
        }
        
        var wrapper = document.getElementById('us-map-wrapper');
        if (this.mapMode === 'mediaMarkets') {
            if (Campaign.nationalCountySvg) {
                if (wrapper) {
                    wrapper.innerHTML = '';
                    wrapper.appendChild(Campaign.nationalCountySvg);
                }
                Campaign.colorNationalCountyMap();
            } else {
                if (wrapper) {
                    wrapper.innerHTML = '<div class="loading-map">Loading national county map...</div>';
                }
                var xhr = new XMLHttpRequest();
                xhr.open('GET', 'counties/uscountymap.svg', true);
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            var parser = new DOMParser();
                            var svgDoc = parser.parseFromString(xhr.responseText, 'image/svg+xml');
                            var svg = svgDoc.querySelector('svg');
                            if (svg) {
                                svg.id = 'us-national-county-map-svg';
                                Campaign.setupNationalCountyMapEvents(svg);
                                Campaign.nationalCountySvg = svg;
                                if (wrapper) {
                                    wrapper.innerHTML = '';
                                    wrapper.appendChild(svg);
                                }
                                Campaign.colorNationalCountyMap();
                            }
                        } else {
                            if (wrapper) {
                                wrapper.innerHTML = '<div class="error-map">Failed to load national county map.</div>';
                            }
                        }
                    }
                };
                xhr.send();
            }
        } else {
            if (Campaign.stateSvg && wrapper && wrapper.firstChild !== Campaign.stateSvg) {
                wrapper.innerHTML = '';
                wrapper.appendChild(Campaign.stateSvg);
            }
            this.colorMap();
        }

        if (typeof Counties !== 'undefined' && gameData.inCountyView && Counties.colorCountyMap) {
            Counties.colorCountyMap();
        }
    },

    setupNationalCountyMapEvents: function(svg) {
        var paths = svg.querySelectorAll('path');
        for (var i = 0; i < paths.length; i++) {
            var path = paths[i];
            var pathId = path.id;
            if (pathId && pathId.length >= 3 && pathId.charAt(0) === 'c') {
                var fips = pathId.substring(1);
                path.style.cursor = 'pointer';
                path.style.stroke = '#ffffff';
                path.style.strokeWidth = '0.1';
                
                (function(f, p) {
                    p.onclick = function() {
                        if (typeof Counties !== 'undefined') {
                            Counties.selectCounty(f);
                        }
                    };
                    p.ondblclick = function(e) {
                        e.stopPropagation();
                        if (typeof Counties !== 'undefined') {
                            var stateFips = f.substring(0, 2);
                            var stateCode = Counties.getStateCodeFromFips(stateFips);
                            if (stateCode) {
                                Counties.openCountyView(stateCode);
                            }
                        }
                    };
                    p.onmouseenter = function(e) {
                        if (typeof MEDIA_MARKETS !== 'undefined') {
                            var county = Counties.countyData[f];
                            if (county && county.mediaMarket && MEDIA_MARKETS[county.mediaMarket]) {
                                var market = MEDIA_MARKETS[county.mediaMarket];
                                for (var ci = 0; ci < market.counties.length; ci++) {
                                    var fipsId = 'c' + market.counties[ci];
                                    var otherPath = svg.getElementById(fipsId);
                                    if (otherPath) {
                                        otherPath.style.filter = 'brightness(1.3)';
                                        otherPath.style.stroke = '#ffd700';
                                        otherPath.style.strokeWidth = '0.4px';
                                    }
                                }
                            } else {
                                p.style.filter = 'brightness(1.3)';
                                p.style.stroke = '#ffd700';
                                p.style.strokeWidth = '0.4px';
                            }
                        }
                    };
                    p.onmousemove = function(e) {
                        Campaign.showNationalCountyTooltip(e, f);
                    };
                    p.onmouseleave = function() {
                        var tooltip = document.getElementById('map-tooltip');
                        if (tooltip) tooltip.style.display = 'none';
                        
                        if (typeof MEDIA_MARKETS !== 'undefined') {
                            var county = Counties.countyData[f];
                            if (county && county.mediaMarket && MEDIA_MARKETS[county.mediaMarket]) {
                                var market = MEDIA_MARKETS[county.mediaMarket];
                                for (var ci = 0; ci < market.counties.length; ci++) {
                                    var fipsId = 'c' + market.counties[ci];
                                    var otherPath = svg.getElementById(fipsId);
                                    if (otherPath) {
                                        otherPath.style.filter = '';
                                        otherPath.style.stroke = '#ffffff';
                                        otherPath.style.strokeWidth = '0.1px';
                                    }
                                }
                            } else {
                                p.style.filter = '';
                                p.style.stroke = '#ffffff';
                                p.style.strokeWidth = '0.1px';
                            }
                        }
                    };
                })(fips, path);
            }
        }
    },

    showNationalCountyTooltip: function(e, fips) {
        if (typeof Counties === 'undefined') return;
        var county = Counties.countyData[fips];
        if (!county) return;
        
        var tooltip = document.getElementById('map-tooltip');
        if (!tooltip) return;
        
        var stateFips = fips.substring(0, 2);
        var stateCode = Counties.getStateCodeFromFips(stateFips);
        var stateName = (typeof STATES !== 'undefined' && STATES[stateCode] && STATES[stateCode].name) || stateCode;
        
        var countyName = county.n || 'County';
        var marketText = 'None';
        var costText = 'N/A';
        var reachText = 'N/A';
        
        if (county.mediaMarket && typeof MEDIA_MARKETS !== 'undefined' && MEDIA_MARKETS[county.mediaMarket]) {
            var market = MEDIA_MARKETS[county.mediaMarket];
            marketText = market.label;
            reachText = market.reach.toLocaleString() + ' households';
            costText = '$' + market.cpmBase.toFixed(2) + ' CPM';
        }
        
        var html = '<div class="tooltip-title">' + countyName + ', ' + stateName + '</div>';
        html += '<div class="tooltip-detail"><strong>Media Market:</strong> ' + marketText + '</div>';
        html += '<div class="tooltip-detail"><strong>Reach:</strong> ' + reachText + '</div>';
        html += '<div class="tooltip-detail"><strong>CPM:</strong> ' + costText + '</div>';
        
        if (county.v) {
            var dPct = county.v.D || 0;
            var rPct = county.v.R || 0;
            var margin = dPct - rPct;
            var leadText = margin > 0 ? 'D +' + margin.toFixed(1) : (margin < 0 ? 'R +' + Math.abs(margin).toFixed(1) : 'Even');
            html += '<div class="tooltip-sub"><strong>Dominating:</strong> ' + leadText + '</div>';
        }
        
        tooltip.innerHTML = html;
        tooltip.style.display = 'block';
        tooltip.style.left = (e.pageX + 15) + 'px';
        tooltip.style.top = (e.pageY + 15) + 'px';
    },

    colorNationalCountyMap: function() {
        var svg = document.getElementById('us-national-county-map-svg');
        if (!svg || typeof Counties === 'undefined') return;
        
        var paths = svg.querySelectorAll('path');
        for (var i = 0; i < paths.length; i++) {
            var path = paths[i];
            var pathId = path.id;
            if (pathId && pathId.length >= 3 && pathId.charAt(0) === 'c') {
                var fips = pathId.substring(1);
                var county = Counties.countyData[fips];
                if (county) {
                    path.style.fill = Counties.getCountyMapModeColor(county);
                    path.style.display = 'block';
                }
            }
        }
    },

    getStateMapColor: function(code, state) {
        var mode = this.mapMode || 'margin';
        if (mode === 'margin') return Utils.getMarginColor(state.margin);
        if (mode === 'ev') return this.getGoldScaleColor((state.ev || 0) / 54);
        if (mode === 'population') return this.getGoldScaleColor(this.getStatePopulationIndex(code));
        if (mode === 'turnout') return this.getGoldScaleColor(this.getStateTurnoutIndex(code, 'all'));
        if (mode === 'playerTurnout') return this.getGoldScaleColor(this.getStateTurnoutIndex(code, 'player'));
        if (mode === 'opponentTurnout') return this.getGoldScaleColor(this.getStateTurnoutIndex(code, 'opponent'));
        if (mode === 'favorability') return this.getFavorabilityColor(this.getFavorability());
        return Utils.getMarginColor(state.margin);
    },

    getGoldScaleColor: function(index) {
        var v = this.applyMapPolarity(index);
        var colors = this.goldScaleColors || [];
        var scaled = v * (colors.length - 1);
        var low = Math.floor(scaled);
        var high = Math.min(colors.length - 1, low + 1);
        var t = scaled - low;
        return this.blendHexColors(colors[low], colors[high], t);
    },

    getFavorabilityColor: function(value) {
        var v = this.applyMapPolarity(value || 0.5);
        if (v < 0.35) return '#7a0509';
        if (v < 0.45) return '#d71920';
        if (v < 0.55) return '#f4c15d';
        if (v < 0.65) return '#7fbf6e';
        return '#198754';
    },

    resetPopulationCaches: function() {
        this.populationCacheReady = false;
        this.statePopulationCache = null;
        this.maxStatePopulation = 0;
        this.maxCountyPopulation = 0;
    },

    ensurePopulationCaches: function() {
        if (this.populationCacheReady) return;
        if (!Counties || !Counties.countyData) {
            this.populationCacheReady = true;
            return;
        }
        var stateByFips = {};
        for (var code in STATES) {
            if (STATES[code] && STATES[code].fips) {
                stateByFips[STATES[code].fips] = code;
            }
        }
        this.statePopulationCache = {};
        this.maxStatePopulation = 0;
        this.maxCountyPopulation = 0;
        for (var fips in Counties.countyData) {
            var county = Counties.countyData[fips];
            var pop = county && county.p ? county.p : 0;
            if (pop > this.maxCountyPopulation) this.maxCountyPopulation = pop;
            var padded = fips.padStart(5, '0');
            var stateCode = stateByFips[padded.substring(0, 2)];
            if (!stateCode) continue;
            this.statePopulationCache[stateCode] = (this.statePopulationCache[stateCode] || 0) + pop;
            if (this.statePopulationCache[stateCode] > this.maxStatePopulation) {
                this.maxStatePopulation = this.statePopulationCache[stateCode];
            }
        }
        this.populationCacheReady = true;
    },

    getPopulationIndex: function(population, maxPopulation) {
        if (!maxPopulation || maxPopulation <= 0) return 0;
        // Polarize the scale: tiny-population areas should read clearly
        // dark and only the densest hot spots (NYC, LA County, California,
        // Texas) should glow brightly. The previous logarithmic scale
        // compressed everything toward the top end, making low-population
        // states like Wyoming look almost identical to California.
        var pop = Math.max(0, population || 0);
        var ratio = pop / maxPopulation;
        // Aggressive gamma curve - emphasises the spread between low and
        // high population while keeping the result inside [0, 1].
        var polarized = Math.pow(ratio, 0.32);
        // Lift the floor slightly so empty/tiny counties aren't pitch
        // black, then keep a healthy ceiling so the brightest spots
        // remain visibly distinct from the merely large.
        var floor = 0.04;
        var ceiling = 1.0;
        return Math.max(0, Math.min(1, floor + polarized * (ceiling - floor)));
    },

    getStatePopulationTotal: function(code) {
        this.ensurePopulationCaches();
        if (!this.statePopulationCache) return 0;
        return this.statePopulationCache[code] || 0;
    },

    getStatePopulationIndex: function(code) {
        this.ensurePopulationCaches();
        return this.getPopulationIndex(this.getStatePopulationTotal(code), this.maxStatePopulation);
    },

    getCountyPopulationIndex: function(population) {
        this.ensurePopulationCaches();
        return this.getPopulationIndex(population, this.maxCountyPopulation);
    },

    getStateTurnoutAverage: function(code, type) {
        if (!STATES[code] || !Counties || !Counties.countyData) return 0;
        var stateFips = STATES[code].fips;
        var total = 0;
        var weight = 0;
        var playerParty = gameData.selectedParty || 'D';
        var opponentParty = gameData.selectedParty === 'D' ? 'R' : 'D';
        for (var fips in Counties.countyData) {
            var padded = fips.padStart(5, '0');
            if (padded.substring(0, 2) !== stateFips) continue;
            var county = Counties.countyData[fips];
            var registered = (typeof Election !== 'undefined' && typeof Election.getCountyRegisteredVoters === 'function')
                ? Election.getCountyRegisteredVoters(county)
                : (county.regVoters || county.p || 0);
            var rate = 0;
            if (type === 'player' && typeof Election !== 'undefined' && typeof Election.getCountyTurnoutRateForParty === 'function') {
                rate = Election.getCountyTurnoutRateForParty(county, playerParty);
            } else if (type === 'opponent' && typeof Election !== 'undefined' && typeof Election.getCountyTurnoutRateForParty === 'function') {
                rate = Election.getCountyTurnoutRateForParty(county, opponentParty);
            } else if (typeof Election !== 'undefined' && typeof Election.getCountyTurnoutRate === 'function') {
                rate = Election.getCountyTurnoutRate(county);
            } else if (typeof Counties !== 'undefined' && typeof Counties.getBaseTurnoutRate === 'function') {
                rate = Counties.getBaseTurnoutRate(county);
            }
            total += registered * rate;
            weight += registered;
        }
        if (weight <= 0) return 0;
        return total / weight;
    },

    getStateTurnoutIndex: function(code, type) {
        var avg = this.getStateTurnoutAverage(code, type);
        return this.getTurnoutRateIndex(avg);
    },

    getTurnoutRateIndex: function(rate) {
        if (!rate || !isFinite(rate)) return 0;
        var min = this.TURNOUT_RATE_MIN;
        var max = this.TURNOUT_RATE_MAX;
        if (max <= min) return 0;
        return Math.max(0, Math.min(1, (rate - min) / (max - min)));
    },

    applyMapPolarity: function(value) {
        var v = Math.max(0, Math.min(1, value || 0));
        var boosted = Math.pow(v, this.mapPolarityGamma || 0.65);
        var contrasted = 0.5 + (boosted - 0.5) * (this.mapPolarityContrast || 1.25);
        return Math.max(0, Math.min(1, contrasted));
    },

    blendHexColors: function(a, b, t) {
        var hexToRgb = function(hex) {
            var cleaned = hex.replace('#', '');
            var num = parseInt(cleaned, 16);
            return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
        };
        var rgbToHex = function(rgb) {
            var toHex = function(n) {
                var h = n.toString(16);
                return h.length === 1 ? '0' + h : h;
            };
            return '#' + toHex(rgb.r) + toHex(rgb.g) + toHex(rgb.b);
        };
        var c1 = hexToRgb(a || '#000000');
        var c2 = hexToRgb(b || '#000000');
        var mix = {
            r: Math.round(c1.r + (c2.r - c1.r) * t),
            g: Math.round(c1.g + (c2.g - c1.g) * t),
            b: Math.round(c1.b + (c2.b - c1.b) * t)
        };
        return rgbToHex(mix);
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

        // v2: Momentum display
        var momEl = document.getElementById('hud-momentum');
        if (momEl) {
            var mom = gameData.campaignMomentum || 0;
            momEl.innerText = (mom >= 0 ? '+' : '') + mom.toFixed(2);
            momEl.style.color = mom > 0.1 ? '#4ade80' : (mom < -0.1 ? '#f87171' : '#ccc');
        }

        // v2: Approval display
        var approvalEl = document.getElementById('hud-approval');
        if (approvalEl) {
            approvalEl.innerText = Math.round((gameData.approvalRating || 0.5) * 100) + '%';
        }
        
        // v2: National Poll display
        var natPollEl = document.getElementById('hud-national-poll');
        if (natPollEl && gameData.nationalPolls && gameData.nationalPolls.length > 0) {
            var avgPoll = {};
            for (var pIdx = 0; pIdx < gameData.nationalPolls.length; pIdx++) {
                for (var pKey in gameData.nationalPolls[pIdx]) {
                    avgPoll[pKey] = (avgPoll[pKey] || 0) + gameData.nationalPolls[pIdx][pKey];
                }
            }
            var playerShare = (avgPoll[gameData.selectedParty] || 0) / gameData.nationalPolls.length;
            var oppParty = gameData.selectedParty === 'D' ? 'R' : 'D';
            var oppShare = (avgPoll[oppParty] || 0) / gameData.nationalPolls.length;
            
            var diff = (playerShare - oppShare) * 100;
            var text = 'Tie';
            if (diff > 0.5) text = '+' + diff.toFixed(1);
            else if (diff < -0.5) text = diff.toFixed(1);
            natPollEl.innerText = text;
            natPollEl.style.color = diff > 0.5 ? 'var(--green-success)' : (diff < -0.5 ? 'var(--rep-red)' : '#ccc');
        } else if (natPollEl) {
            natPollEl.innerText = 'Tie';
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
        } else if (action === 'surrogate') {
            // v2: Surrogate action — reuses speech modal-style issue selection
            if (gameData.energy < 1) {
                return Utils.showToast("Need 1 energy for surrogate!");
            }
            if (gameData.funds < 2) {
                return Utils.showToast("Need $2M for surrogate!");
            }
            // Check if state was physically visited
            if (gameData.visitedStatesThisTurn && gameData.visitedStatesThisTurn.indexOf(gameData.selectedState) !== -1) {
                return Utils.showToast("Can't send surrogate to a state you visited this turn");
            }

            var surrogateAction = {
                type: 'SURROGATE',
                state: gameData.selectedState,
                issueId: null,  // Could be enhanced with issue selection
                intensity: 1,
                cost: { funds: 2, energy: 1 }
            };

            if (typeof Persuasion !== 'undefined' && Persuasion.queueAction(surrogateAction)) {
                Utils.showToast("Surrogate queued in " + s.name);
                Utils.addLog("Queued surrogate in " + s.name);
                this.updateHUD();
                this.clickState(gameData.selectedState);
            }
        } else if (action === 'debate_prep') {
            // v2: Debate prep — global action, not state-specific
            if (gameData.energy < 2) {
                return Utils.showToast("Need 2 energy for debate prep!");
            }
            if (gameData.debatePrepBuff) {
                return Utils.showToast("Already prepared for debate!");
            }

            var debatePrepAction = {
                type: 'DEBATE_PREP',
                state: gameData.selectedState,
                cost: { funds: 0, energy: 2 }
            };

            if (typeof Persuasion !== 'undefined' && Persuasion.queueAction(debatePrepAction)) {
                Utils.showToast("Debate prep queued");
                this.updateHUD();
            }
        } else if (action === 'oppo_research') {
            // v2: Opposition research — targets leading opponent
            if (gameData.energy < 2) {
                return Utils.showToast("Need 2 energy for oppo research!");
            }
            if (gameData.funds < 3) {
                return Utils.showToast("Need $3M for oppo research!");
            }

            var oppoTarget = gameData.selectedParty === 'D' ? 'R' : 'D';
            var oppoAction = {
                type: 'OPPO_RESEARCH',
                state: gameData.selectedState,
                targetParty: oppoTarget,
                cost: { funds: 3, energy: 2 }
            };

            if (typeof Persuasion !== 'undefined' && Persuasion.queueAction(oppoAction)) {
                Utils.showToast("Oppo research queued vs " + PARTIES[oppoTarget].shortName);
                Utils.addLog("Queued oppo research vs " + PARTIES[oppoTarget].shortName);
                this.updateHUD();
            }
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
        
        // Process new deep systems
        if (typeof GroundOps !== 'undefined') GroundOps.processWeekly();
        if (typeof DigitalAds !== 'undefined') DigitalAds.processWeekly();
        
        gameData.currentDate.setDate(gameData.currentDate.getDate() + 7);
        gameData.energy = gameData.maxEnergy;

        // v2: Reset turn budget tracking
        gameData.turnStatesUsed = [];
        gameData.turnActionCounts = {};
        gameData.visitedStatesThisTurn = [];
        gameData.grassrootsUsedThisWeek = 0;
        
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

        // v2: Process scandals (reveal pending, decrement active)
        if (typeof Scandals !== 'undefined' && Scandals.processActiveScandals) {
            Scandals.processActiveScandals();
        }

        // v2: News & Events Engine
        if (typeof News !== 'undefined' && News.processWeeklyEvent) {
            News.processWeeklyEvent();
        }

        // v2: Check for scheduled debates
        if (typeof Debates !== 'undefined' && Debates.checkDebateWeek) {
            Debates.checkDebateWeek();
        }

        // v2: Process active endorsements (decrement durations)
        if (typeof Endorsements !== 'undefined' && Endorsements.processActiveEndorsements) {
            Endorsements.processActiveEndorsements();
        }

        // v2: Update campaign momentum
        if (typeof this.updateCampaignMomentum === 'function') {
            this.updateCampaignMomentum();
        }

        // v2: Update approval rating
        if (typeof this.updateApprovalRating === 'function') {
            this.updateApprovalRating();
        }

        // v2: Calculate national polls
        if (typeof this.calculateNationalPoll === 'function') {
            this.calculateNationalPoll();
        }

        // v2: Spoiler effect — when third-party share >8%, opposing major party gets +0.5%/week in battlegrounds
        if (gameData.thirdPartiesEnabled && typeof Debates !== 'undefined' && Debates.getThirdPartyNationalPoll) {
            for (var tpCode in gameData.thirdTickets) {
                var tpShare = Debates.getThirdPartyNationalPoll(tpCode);
                if (tpShare > 8) {
                    this._applySpoilerEffect(tpCode, tpShare);
                }
            }
        }

        // v2: Generate weather modifier in final campaign week
        var msUntilElection = gameData.electionDay.getTime() - gameData.currentDate.getTime();
        var weeksLeft = msUntilElection / (7 * 24 * 60 * 60 * 1000);
        if (weeksLeft <= 1 && weeksLeft > 0 && !gameData.weatherModifier) {
            gameData.weatherModifier = (Math.random() - 0.5) * 2; // -1 to +1
            var weatherDesc = gameData.weatherModifier > 0.3 ? 'clear skies expected' : 
                             (gameData.weatherModifier < -0.3 ? 'storms forecast' : 'mixed conditions');
            Utils.addLog('🌤️ Election Day weather forecast: ' + weatherDesc);
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
    },

    // === v2 NEW METHODS ===

    // v2: Update campaign momentum based on weekly net polling change
    updateCampaignMomentum: function() {
        if (typeof MOMENTUM_CONSTANTS === 'undefined') return;

        if (typeof DigitalAds !== 'undefined') DigitalAds.processWeekly();
        if (typeof Persuasion !== 'undefined' && typeof Persuasion.processWeeklyDecay === 'function') {
            Persuasion.processWeeklyDecay();
        }
        
        // Decay momentum toward 0
        gameData.campaignMomentum *= MOMENTUM_CONSTANTS.DECAY;

        // Calculate net polling direction (simplified: are we winning or losing states?)
        var statesWinning = 0;
        var statesLosing = 0;
        for (var code in gameData.states) {
            var s = gameData.states[code];
            var playerMargin = gameData.selectedParty === 'D' ? s.margin : -s.margin;
            if (playerMargin > 0) statesWinning++;
            else statesLosing++;
        }

        var netDirection = statesWinning > statesLosing ? 1 : (statesWinning < statesLosing ? -1 : 0);
        if (netDirection > 0) {
            gameData.campaignMomentum = Math.min(1, gameData.campaignMomentum + MOMENTUM_CONSTANTS.WEEKLY_GAIN);
        } else if (netDirection < 0) {
            gameData.campaignMomentum = Math.max(-1, gameData.campaignMomentum - MOMENTUM_CONSTANTS.WEEKLY_LOSS);
        }

        // Clamp
        gameData.campaignMomentum = Math.max(-1, Math.min(1, gameData.campaignMomentum));
    },

    // v2: Update approval rating
    updateApprovalRating: function() {
        var fav = typeof this.getFavorability === 'function' ? this.getFavorability() : 0.5;
        var approval = 0.5 + (fav - 0.5) * 0.6; // Scale favorability contribution

        // Issue position modifier (simplified)
        if (gameData.lockedIssues && CORE_ISSUES) {
            var positionScore = 0;
            var positionCount = 0;
            for (var issueId in gameData.lockedIssues) {
                positionCount++;
            }
            if (positionCount > 3) positionScore += 0.02; // More positions = more defined = slightly more approval
            approval += positionScore;
        }

        // Coalition loyalty modifier
        if (gameData.coalitionStatus) {
            var loyaltySum = 0;
            var loyaltyCount = 0;
            for (var cid in gameData.coalitionStatus) {
                loyaltySum += gameData.coalitionStatus[cid].loyalty || 1.0;
                loyaltyCount++;
            }
            if (loyaltyCount > 0) {
                var avgLoyalty = loyaltySum / loyaltyCount;
                approval += (avgLoyalty - 0.85) * 0.3;
            }
        }

        // Momentum influence
        approval += gameData.campaignMomentum * 0.05;

        // Clamp to [0.30, 0.80]
        gameData.approvalRating = Math.max(0.30, Math.min(0.80, approval));
    },

    // v2: Calculate national polls with variance
    calculateNationalPoll: function() {
        if (typeof Counties === 'undefined' || !Counties.countyData) return;

        var partyTotals = {};
        var totalPop = 0;

        for (var fips in Counties.countyData) {
            var county = Counties.countyData[fips];
            if (!county || !county.v) continue;
            var pop = county.p || 0;
            totalPop += pop;
            for (var party in county.v) {
                if (!partyTotals[party]) partyTotals[party] = 0;
                partyTotals[party] += pop * county.v[party];
            }
        }

        // Generate 2-4 polls with Gaussian noise (using POLLING_NOISE_STDEV if available, fallback to 0.02)
        var numPolls = 2 + Math.floor(Math.random() * 3);
        var noiseStdev = (typeof MOMENTUM_CONSTANTS !== 'undefined' && MOMENTUM_CONSTANTS.POLLING_NOISE_STDEV) ? MOMENTUM_CONSTANTS.POLLING_NOISE_STDEV : 0.02;
        gameData.nationalPolls = [];
        for (var i = 0; i < numPolls; i++) {
            var poll = {};
            var basePolls = {};
            var total = 0;
            for (var party in partyTotals) {
                basePolls[party] = totalPop > 0 ? partyTotals[party] / totalPop : 0;
            }
            for (var party in basePolls) {
                // Apply noise
                var u1 = Math.random();
                var u2 = Math.random();
                var z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
                var noise = z0 * noiseStdev * 100; // Convert to percentage points
                poll[party] = Math.max(0, basePolls[party] + noise);
                total += poll[party];
            }
            // Normalize
            for (var party in poll) poll[party] /= (total > 0 ? total / 100 : 1);
            gameData.nationalPolls.push(poll);
        }
    },

    // v2: Spoiler effect — third party >8% helps opposing major party in battlegrounds
    _applySpoilerEffect: function(thirdPartyCode, nationalShare) {
        if (typeof Counties === 'undefined' || !Counties.countyData) return;
        var spoilerBoost = 0.005; // +0.5% per week

        for (var code in gameData.states) {
            var s = gameData.states[code];
            if (Math.abs(s.margin) > 8) continue; // Only battlegrounds

            var stateFips = STATES[code] ? STATES[code].fips : null;
            if (!stateFips) continue;

            for (var fips in Counties.countyData) {
                var paddedFips = fips.padStart(5, '0');
                if (paddedFips.substring(0, 2) !== stateFips) continue;
                var county = Counties.countyData[fips];
                if (!county || !county.v) continue;

                // Third party likely spoils the ideologically closer major party
                // Green/PSL spoil D, Libertarian spoils R
                if (thirdPartyCode === 'G' || thirdPartyCode === 'PSL') {
                    county.v.R = Math.min(100, county.v.R + spoilerBoost);
                } else if (thirdPartyCode === 'L') {
                    county.v.D = Math.min(100, county.v.D + spoilerBoost);
                }
            }
            Counties.updateStateFromCounties(code);
        }
    },

    // v2: Grassroots fundraising — no issue lock, no media vulnerability
    handleGrassrootsFundraise: function() {
        if (gameData.grassrootsUsedThisWeek >= 2) {
            Utils.showToast('Max 2 grassroots fundraises per week!');
            return;
        }
        if (gameData.energy < 1) {
            Utils.showToast('Not enough energy!');
            return;
        }

        gameData.energy -= 1;
        gameData.grassrootsUsedThisWeek++;

        var momentum = gameData.campaignMomentum || 0;
        var variance = 0.8 + Math.random() * 0.4; // 0.8-1.2
        var yield_ = (2.0 + momentum * 1.5) * variance;

        // Apply approval rating modifier (±15%)
        if (gameData.approvalRating) {
            yield_ *= (0.85 + gameData.approvalRating * 0.30);
        }

        // Apply endorsement fundraising bonus
        if (typeof Endorsements !== 'undefined' && Endorsements.getActiveEffectMultiplier) {
            yield_ *= Endorsements.getActiveEffectMultiplier('fundraising');
        }

        yield_ = Math.max(0.5, yield_);
        gameData.funds += yield_;

        // Small momentum boost
        gameData.campaignMomentum = Math.min(1, (gameData.campaignMomentum || 0) + 0.02);

        Utils.addLog('💰 Grassroots fundraise: $' + yield_.toFixed(1) + 'M raised');
        Utils.showToast('💰 $' + yield_.toFixed(1) + 'M raised from grassroots!');
        this.updateHUD();
    }
};
