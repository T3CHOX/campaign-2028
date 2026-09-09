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
            '<button class="act-btn" onclick="app.handleAction(\'field\')"><span><i class="fa-solid fa-people-group"></i></span><span>FIELD OPS</span></button>' +
            '<button class="act-btn" onclick="app.handleAction(\'digital\')"><span><i class="fa-solid fa-laptop"></i></span><span>DIGITAL</span></button>' +
            '<button class="act-btn" onclick="app.openStateBio()"><span><i class="fa-solid fa-book-open"></i></span><span>INTEL</span></button>' +
            '<button class="act-btn" onclick="app.openCountyView()"><span><i class="fa-solid fa-map"></i></span><span>BREAKDOWN</span></button>' +
            '<button class="act-btn" onclick="app.openIssuesPanel()"><span><i class="fa-solid fa-chart-line"></i></span><span>ISSUES</span></button>' +
            '<button class="act-btn" onclick="app.openPolicyModal()"><span><i class="fa-solid fa-bullseye"></i></span><span>PLATFORM</span></button>' +
            '<button class="act-btn" onclick="app.openEndorsersModal()"><span><i class="fa-solid fa-handshake"></i></span><span>ENDORSERS</span></button>' +
            '<button class="act-btn" onclick="app.handleAction(\'speech\')"><span><i class="fa-solid fa-microphone"></i></span><span>SPEECH</span></button>' +
            '<button class="act-btn" onclick="app.handleAction(\'debate_prep\')"><span><i class="fa-solid fa-book"></i></span><span>DEBATE PREP</span></button>' +
            '<button class="act-btn" onclick="app.handleAction(\'oppo_research\')"><span><i class="fa-solid fa-magnifying-glass"></i></span><span>OPPO RESEARCH</span></button>' +
            '<button class="act-btn" onclick="Campaign.handleGrassrootsFundraise()"><span><i class="fa-solid fa-hand-holding-dollar"></i></span><span>GRASSROOTS</span></button>';
    },

    restoreStateActionGrid: function() {
        var actionGrid = document.querySelector('.action-grid');
        if (actionGrid) {
            actionGrid.style.gridTemplateColumns = '';
            actionGrid.innerHTML = this.getStateActionGridHTML();
        }
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
            
            Electorate.initialize();
            Object.keys(gameData.states).forEach(function(s) { Counties.updateStateFromCounties(s); });
            GroupPolling.publish(gameData.currentWeek || 0);
            if (typeof OverhaulUI !== 'undefined') OverhaulUI.refresh();
            // Compute live interest group support from county data
            recomputeInterestGroupSupport();
            
            // Initialize polling system baseline
            if (typeof Polling !== 'undefined') Polling.init(true);
            
            // Capture initial frozen snapshot for week-0 display
            Campaign.captureFrozenSnapshot();
            
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
            // Use frozen margin for consistent mid-turn tooltip display
            var displayMarginVal = (gameData.frozenStateMargins && gameData.frozenStateMargins[code])
                ? gameData.frozenStateMargins[code].margin
                : state.margin;
            var marginText = Math.abs(displayMarginVal).toFixed(1);
            var leaning = (displayMarginVal > 0 ? 'D+' : 'R+') + marginText;
            detailLine = '<span class="tooltip-leader" style="color: ' + (displayMarginVal > 0 ? '#00AEF3' : '#E81B23') + '">' + leaning + '</span>';
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

    showDistrictTooltip: function(e, stateCode, districtName) {
        var state = gameData.states[stateCode];
        if (!state) return;
        var tooltip = document.getElementById('map-tooltip');
        if (!tooltip) return;

        var distFullName = districtName;
        if (districtName.startsWith('NE-')) {
            distFullName = 'Nebraska - ' + districtName.replace('NE-', '') + (districtName === 'NE-1' ? 'st' : (districtName === 'NE-2' ? 'nd' : 'rd')) + ' District';
        } else if (districtName.startsWith('ME-')) {
            distFullName = 'Maine - ' + districtName.replace('ME-', '') + (districtName === 'ME-1' ? 'st' : 'nd') + ' District';
        }

        var detailLine = '';
        var subLine = '<span class="tooltip-stats">1 Electoral Vote</span>';

        if (typeof Counties !== 'undefined' && Counties.calculateStateElectoralAllocation) {
            var split = Counties.calculateStateElectoralAllocation(stateCode, { useReportedVotes: false });
            if (split && split.districtResults) {
                for (var i = 0; i < split.districtResults.length; i++) {
                    var dr = split.districtResults[i];
                    if (dr.district === districtName) {
                        var totalDistVotes = 0;
                        for (var p in dr.votes) totalDistVotes += dr.votes[p];
                        var sortedParties = Object.keys(dr.votes).sort(function(a, b) { return dr.votes[b] - dr.votes[a]; });
                        var p1 = sortedParties[0] || 'D';
                        var p2 = sortedParties[1];
                        var marginPct = totalDistVotes > 0 ? ((dr.votes[p1] - (dr.votes[p2] || 0)) / totalDistVotes) * 100 : 0;
                        var partyColor = (PARTIES[p1] && PARTIES[p1].color) || (p1 === 'D' ? '#00AEF3' : '#E81B23');
                        var marginText = (p1 === 'D' ? 'D+' : (p1 === 'R' ? 'R+' : p1 + '+')) + marginPct.toFixed(1);
                        detailLine = '<span class="tooltip-leader" style="color: ' + partyColor + '">' + marginText + '</span>';
                        break;
                    }
                }
            }
        }

        if (!detailLine) {
            detailLine = '<span class="tooltip-leader">' + districtName + '</span>';
        }

        tooltip.innerHTML =
            '<span class="tooltip-title">' + distFullName + '</span>' +
            '<div class="tooltip-divider"></div>' +
            detailLine +
            subLine;
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
        
        var pollByParty = (gameData.frozenPollSnapshot && gameData.frozenPollSnapshot['USA'])
            ? gameData.frozenPollSnapshot['USA']
            : Utils.getNationalPollingByParty();
        var prevPollByParty = (gameData.pollCache && gameData.pollCache['USA']) || null;
        var pollVis = document.getElementById('poll-vis');
        if (pollVis) {
            pollVis.innerHTML = Utils.buildCandidateRankedListHTML(pollByParty, prevPollByParty, 'USA');
        }
        
        var issuesList = document.getElementById('sp-issues-list');
        issuesList.innerHTML = '';
        
    },

    clickState: function(code) {
        gameData.selectedState = code;
        gameData.selectedDistrict = null;
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
                    var dresList = split.districtResults.slice();
                    dresList.sort(function (a, b) { return a.district.localeCompare(b.district); });
                    var dhtml = '';
                    for (var i = 0; i < dresList.length; i++) {
                        var dres = dresList[i];
                        var distName = dres.district;
                        var marginColor = '#444';
                        if (typeof Utils !== 'undefined' && Utils.getMarginColor) {
                            var totalDistVotes = 0;
                            for (var p in dres.votes) totalDistVotes += dres.votes[p];
                            var sortedParties = Object.keys(dres.votes).sort(function(a, b) { return dres.votes[b] - dres.votes[a]; });
                            var p1 = sortedParties[0] || 'D';
                            var p2 = sortedParties[1];
                            var marginPct = totalDistVotes > 0 ? ((dres.votes[p1] - (dres.votes[p2] || 0)) / totalDistVotes) * 100 : 0;
                            marginColor = Utils.getMarginColor(marginPct, p1);
                        }
                        var activeClass = (gameData.selectedDistrict === distName) ? ' active' : '';
                        dhtml += `<div class="district-box${activeClass}" data-district="${distName}" style="background-color: ${marginColor};" onclick="Campaign.clickDistrict('${code}', '${distName}')" onmousemove="Campaign.showDistrictTooltip(event, '${code}', '${distName}')" onmouseleave="document.getElementById('map-tooltip').style.display='none'">${distName}</div>`;
                    }
                    spDistricts.innerHTML = dhtml;
                }
            }
        }
        document.getElementById('sp-ev').innerText = evLabel;
        
        // Build ranked candidate list for the state.
        // Use frozen snapshot so mid-turn player actions don't alter the displayed poll percentages.
        // The snapshot is refreshed at the start of each new week in nextWeek().
        var pollByParty = (gameData.frozenPollSnapshot && gameData.frozenPollSnapshot[code])
            ? gameData.frozenPollSnapshot[code]
            : Utils.getStatePollingByParty(code);
        var prevPollByParty = (gameData.pollCache && gameData.pollCache[code]) || null;
        var pollVis = document.getElementById('poll-vis');
        if (pollVis) {
            pollVis.innerHTML = Utils.buildCandidateRankedListHTML(pollByParty, prevPollByParty, code);
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

        // Toggle check: if already selected, deselect and return to statewide
        if (gameData.selectedDistrict === districtId) {
            gameData.selectedDistrict = null;
            var allBoxes = document.querySelectorAll('.district-box');
            for (var b = 0; b < allBoxes.length; b++) {
                allBoxes[b].classList.remove('active');
            }
            this.clickState(stateCode);
            if (typeof Counties !== 'undefined') {
                Counties.resetDistrictHighlighting();
            }
            return;
        }

        // Select new district
        gameData.selectedDistrict = districtId;

        var distFullName = districtId;
        if (districtId.startsWith('NE-')) {
            distFullName = 'Nebraska - ' + districtId.replace('NE-', '') + (districtId === 'NE-1' ? 'st' : (districtId === 'NE-2' ? 'nd' : 'rd')) + ' District';
        } else if (districtId.startsWith('ME-')) {
            distFullName = 'Maine - ' + districtId.replace('ME-', '') + (districtId === 'ME-1' ? 'st' : 'nd') + ' District';
        }

        document.getElementById('sp-name').innerText = distFullName;
        document.getElementById('sp-ev').innerText = '1 EV';
        
        var boxes = document.querySelectorAll('.district-box');
        for (var i = 0; i < boxes.length; i++) {
            var bDist = boxes[i].getAttribute('data-district') || boxes[i].innerText;
            if (bDist === districtId) boxes[i].classList.add('active');
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
                        pollVis.innerHTML = Utils.buildCandidateRankedListHTML(distPoll, null, stateCode);
                    }
                }
            }
        }

        // If looking at county map, highlight district counties
        if (typeof Counties !== 'undefined') {
            Counties.highlightDistrictCounties(stateCode, districtId);
        }
    },

    colorMap: function() {
        for (var code in gameData.states) {
            var s = gameData.states[code];
            var path = document.getElementById(code);
            if (path) {
                // Use frozen margins for the state map so mid-turn actions don't change colors
                var displayMargin = s.margin;
                var displayParty = s.marginParty || (displayMargin >= 0 ? 'D' : 'R');
                if (gameData.frozenStateMargins && gameData.frozenStateMargins[code] && this.mapMode === 'margin') {
                    displayMargin = gameData.frozenStateMargins[code].margin;
                    displayParty = gameData.frozenStateMargins[code].marginParty;
                }
                var displayState = Object.assign({}, s, { margin: displayMargin, marginParty: displayParty });
                path.style.fill = this.getStateMapColor(code, displayState);
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
            var cVotes = { D: county.v.D||0, R: county.v.R||0, G: county.v.G||0, L: county.v.L||0, I: county.v.I||0, PSL: county.v.PSL||0 };
            var sorted = Object.keys(cVotes).sort(function(a, b) { return cVotes[b] - cVotes[a]; });
            var p1 = sorted[0], p2 = sorted[1];
            var decidedMultiplier = (100 - (county.undecided || 0)) / 100;
            var margin = (cVotes[p1] - cVotes[p2]) * decidedMultiplier;
            
            var leadText = margin > 0 ? p1 + '+' + margin.toFixed(1) : 'Even';
            var color = (typeof Utils !== 'undefined' && Utils.getPartyColor) ? Utils.getPartyColor(p1) : (p1 === 'D' ? '#00AEF3' : '#E81B23');
            html += '<div class="tooltip-sub"><strong>Dominating:</strong> <span style="color: ' + color + '">' + leadText + '</span></div>';
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
        if (mode === 'margin') return Utils.getMarginColor(state.margin, state.marginParty);
        if (mode === 'ev') return this.getGoldScaleColor((state.ev || 0) / 54);
        if (mode === 'population') return this.getGoldScaleColor(this.getStatePopulationIndex(code));
        if (mode === 'turnout') return this.getGoldScaleColor(this.getStateTurnoutIndex(code, 'all'));
        if (mode === 'playerTurnout') return this.getGoldScaleColor(this.getStateTurnoutIndex(code, 'player'));
        if (mode === 'opponentTurnout') return this.getGoldScaleColor(this.getStateTurnoutIndex(code, 'opponent'));
        if (mode === 'favorability') return this.getFavorabilityColor(this.getFavorability());
        return Utils.getMarginColor(state.margin, state.marginParty);
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
            // Use frozen margins so EV tally doesn't change mid-turn
            var frozenMargin = (gameData.frozenStateMargins && gameData.frozenStateMargins[code])
                ? gameData.frozenStateMargins[code].margin
                : s.margin;
            if (typeof Counties !== 'undefined' && Counties.calculateStateElectoralAllocation) {
                var projected = Counties.calculateStateElectoralAllocation(code, { useReportedVotes: false });
                if (projected && projected.allocation) {
                    demEV += projected.allocation.D || 0;
                    repEV += projected.allocation.R || 0;
                    continue;
                }
            }
            if (frozenMargin > 0) {
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
        // Recolor map using frozen snapshot (does NOT recompute live margins)
        if (typeof this.colorMap === 'function') {
            this.colorMap();
        }

        var hudImg = document.getElementById('hud-img');
        if (hudImg) hudImg.src = gameData.candidate.img;
        var hudCandName = document.getElementById('hud-cand-name');
        if (hudCandName) hudCandName.innerText = gameData.candidate.name;
        var hudPartyName = document.getElementById('hud-party-name');
        if (hudPartyName) hudPartyName.innerText = PARTIES[gameData.selectedParty].name.toUpperCase();
        document.getElementById('hud-funds').innerText = '$' + gameData.funds.toFixed(1) + 'M';
        document.getElementById('hud-date').innerText = Utils.formatDate(gameData.currentDate);
        var fav = document.getElementById('hud-favorability') || document.getElementById('hud-credibility');
        if (fav) {
            fav.innerText = Math.round(this.getFavorability() * 100) + '%';
        }

        // Update Democratic & Republican ticket images/names on the EV bar
        var demPres = gameData.selectedParty === 'D' ? gameData.candidate : (gameData.demTicket ? gameData.demTicket.pres : null);
        var demVP = gameData.selectedParty === 'D' ? gameData.vp : (gameData.demTicket ? gameData.demTicket.vp : null);
        var repPres = gameData.selectedParty === 'R' ? gameData.candidate : (gameData.repTicket ? gameData.repTicket.pres : null);
        var repVP = gameData.selectedParty === 'R' ? gameData.vp : (gameData.repTicket ? gameData.repTicket.vp : null);

        if (demPres) {
            var demPresImg = document.getElementById('hud-dem-pres-img');
            if (demPresImg) demPresImg.src = demPres.img || 'images/scenario.jpg';
            var demPresName = document.getElementById('hud-dem-pres-name');
            if (demPresName) demPresName.innerText = demPres.name;
        }
        if (demVP) {
            var demVpImg = document.getElementById('hud-dem-vp-img');
            if (demVpImg) demVpImg.src = demVP.img || 'images/scenario.jpg';
            var demVpName = document.getElementById('hud-dem-vp-name');
            if (demVpName) demVpName.innerText = demVP.name;
        }

        if (repPres) {
            var repPresImg = document.getElementById('hud-rep-pres-img');
            if (repPresImg) repPresImg.src = repPres.img || 'images/scenario.jpg';
            var repPresName = document.getElementById('hud-rep-pres-name');
            if (repPresName) repPresName.innerText = repPres.name;
        }
        if (repVP) {
            var repVpImg = document.getElementById('hud-rep-vp-img');
            if (repVpImg) repVpImg.src = repVP.img || 'images/scenario.jpg';
            var repVpName = document.getElementById('hud-rep-vp-name');
            if (repVpName) repVpName.innerText = repVP.name;
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
        if (action === 'fundraise') {
            if (typeof app !== 'undefined' && app.openFundraiseModal) {
                app.openFundraiseModal();
            }
            return;
        } else if (action === 'oppo_research') {
            if (typeof app !== 'undefined' && app.openOppoResearchModal) {
                app.openOppoResearchModal();
            } else if (typeof OppoResearchUI !== 'undefined') {
                OppoResearchUI.openModal();
            }
            return;
        }

        if (!gameData.selectedState) {
            return Utils.showToast("Select a state first!");
        }
        
        var s = gameData.states[gameData.selectedState];
        
        if (action === 'rally') {
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
            if (typeof app !== 'undefined' && app.openOppoResearchModal) {
                app.openOppoResearchModal();
            } else if (typeof OppoResearchUI !== 'undefined') {
                OppoResearchUI.openModal();
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
        
        // Use frozen margin so the intel modal reflects week-start standings
        var displayMargin = (gameData.frozenStateMargins && gameData.frozenStateMargins[gameData.selectedState])
            ? gameData.frozenStateMargins[gameData.selectedState].margin
            : s.margin;
        
        var marginText = Math.abs(displayMargin).toFixed(1);
        var leaning;
        if (Math.abs(displayMargin) < 2) {
            leaning = 'TOSS-UP';
        } else {
            leaning = (displayMargin > 0 ? 'D+' : 'R+') + marginText;
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

    // ─── Frozen Snapshot ─────────────────────────────────────────────────────────
    // Captures the current poll averages and state margins into a frozen snapshot.
    // The sidebar and state map colors read from this snapshot mid-turn so that
    // player actions don't change the displayed standings until the next week begins.
    captureFrozenSnapshot: function() {
        gameData.frozenPollSnapshot = {};
        gameData.frozenStateMargins = {};
        
        // National
        gameData.frozenPollSnapshot['USA'] = Utils.getNationalPollingByParty();
        
        // States
        for (var code in gameData.states) {
            var sp = Utils.getStatePollingByParty(code);
            if (sp) gameData.frozenPollSnapshot[code] = sp;
            
            var s = gameData.states[code];
            var pcts = sp || {};
            var dPct = pcts['D'] || 0;
            var rPct = pcts['R'] || 0;
            var signedMargin = dPct - rPct;
            var pMarginParty = signedMargin >= 0 ? 'D' : 'R';
            
            // Fallback to true margin only if no polls exist
            if (dPct === 0 && rPct === 0) {
                signedMargin = s.margin || 0;
                pMarginParty = s.marginParty || (signedMargin >= 0 ? 'D' : 'R');
            }
            
            gameData.frozenStateMargins[code] = {
                margin: signedMargin,
                marginParty: pMarginParty
            };
        }
        gameData.frozenPollSnapshot.county = {};
        if (typeof Counties !== 'undefined' && Counties.countyData) {
            for (var fips in Counties.countyData) {
                var countyPoll = Utils.getCountyPollingByParty(Counties.countyData[fips]);
                if (countyPoll) gameData.frozenPollSnapshot.county[String(fips).padStart(5, '0')] = countyPoll;
            }
        }
    },

    nextWeek: function() {
        if (gameData.currentDate >= gameData.electionDay) {
            Utils.addLog("Election Day has arrived!");
            Screens.goTo('election-screen');
            Election.start();
            return;
        }

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
        gameData.currentWeek = (gameData.currentWeek || 0) + 1;
        gameData.energy = gameData.maxEnergy;

        // v2: Reset turn budget tracking
        gameData.turnStatesUsed = [];
        gameData.turnActionCounts = {};
        gameData.visitedStatesThisTurn = [];
        gameData.grassrootsUsedThisWeek = 0;
        
        // v1 Spec Ticket 8: Update retrospective economic approval trajectory & state fundamentals
        updateApprovalTrajectory(gameData, gameData.activeShockEvents);
        gameData.activeShockEvents = [];
        
        if (typeof updateStateFundamentals === 'function') {
            updateStateFundamentals();
        } else {
            var approvalOffset = ((gameData.approvalTrajectory !== undefined ? gameData.approvalTrajectory : 0.50) - 0.50);
            for (var stCode in gameData.states) {
                var stObj = gameData.states[stCode];
                if (!stObj) continue;
                if (!stObj.fundamentals) {
                    stObj.fundamentals = { thetaFundamentals: 0.5, tauPrior: (typeof FUNDAMENTALS_CONFIG !== 'undefined' ? FUNDAMENTALS_CONFIG.TAU_PRIOR_INITIAL : 8.0) };
                }
                var trueData = (typeof Utils !== 'undefined' && Utils.getTrueStatePollingByParty) ? Utils.getTrueStatePollingByParty(stCode) : null;
                if (trueData && ((trueData.D || 0) + (trueData.R || 0)) > 0) {
                    var totalDR = (trueData.D || 0) + (trueData.R || 0);
                    stObj.fundamentals.thetaFundamentals = clamp((trueData.D / totalDR) + approvalOffset, 0.05, 0.95);
                } else {
                    var pLean = (stObj.lean !== undefined ? stObj.lean : (typeof STATES !== 'undefined' && STATES[stCode] ? STATES[stCode].lean : 0)) / 100.0;
                    stObj.fundamentals.thetaFundamentals = clamp(0.50 + pLean + approvalOffset, 0.05, 0.95);
                }
            }
        }

        // --- V2 ISSUE UPGRADES + Ticket 11: Dynamic Agenda-Setting Salience Decay ---
        if (gameData.issueSalience && typeof ISSUE_SALIENCE !== 'undefined') {
            for (var stateKey in gameData.issueSalience) {
                var defaultSalience = ISSUE_SALIENCE[stateKey] || ISSUE_SALIENCE['default'] || {};
                for (var issueId in gameData.issueSalience[stateKey]) {
                    var current = gameData.issueSalience[stateKey][issueId];
                    var origBase = defaultSalience[issueId] || (ISSUE_SALIENCE['default'] ? ISSUE_SALIENCE['default'][issueId] : 5) || 5;
                    var base = computeSalienceBaseline(issueId, origBase, gameData.currentWeek, gameData.activeAgendaEvents);
                    
                    if (current > base) {
                        // Decay by 10% of the difference, or minimum 0.2
                        var decay = Math.max(0.2, (current - base) * 0.1);
                        gameData.issueSalience[stateKey][issueId] = Math.max(base, current - decay);
                    } else if (current < base) {
                        // Slowly rise back to dynamic baseline
                        var growth = Math.max(0.1, (base - current) * 0.05);
                        gameData.issueSalience[stateKey][issueId] = Math.min(base, current + growth);
                    }
                }
            }
            
            // Garbage-collect decayed agenda events
            if (gameData.activeAgendaEvents && gameData.activeAgendaEvents.length > 0) {
                gameData.activeAgendaEvents = gameData.activeAgendaEvents.filter(function(ev) {
                    var w = gameData.currentWeek - (ev.startWeek || 0);
                    return ((ev.magnitude || 0.5) * Math.exp(-0.35 * w)) >= 0.01;
                });
            }
        }
        
        // --- V2 Policy System Decay ---
        if (typeof PolicyManager !== 'undefined') {
            PolicyManager.processWeeklyPolicyDecay();
            PolicyManager.processAIPolicies();
        }
        
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

        // Publish polls only after the AI and all weekly simulation effects.

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

        Electorate.invalidate();
        Electorate.recompute();
        Object.keys(gameData.states).forEach(function(s) { Counties.updateStateFromCounties(s); });
        if (typeof Polling !== 'undefined') Polling.generateWeeklyPolls();
        GroupPolling.publish(gameData.currentWeek);
        if (typeof OverhaulUI !== 'undefined') OverhaulUI.refresh();

        if (gameData.playerPressure) {
            gameData.playerPressure = {};
        }
        
        if (gameData.currentDate >= gameData.electionDay) {
            Utils.addLog("Election Day has arrived!");
            Screens.goTo('election-screen');
            Election.start();
            return;
        }
        
        // Restrict undo to current turn
        gameData.historyStack = [];
        
        // Refresh frozen snapshot for the new week
        this.captureFrozenSnapshot();
        
        this.updateHUD();
        
        // Update queued ads display to show the queue is cleared
        if (typeof app !== 'undefined' && app.updateQueuedAdsDisplay) {
            app.updateQueuedAdsDisplay();
        }
        
        // REFRESH MAPS AND VIEWS
        this.colorMap();
        if (gameData.selectedState) {
            this.clickState(gameData.selectedState);
            // Always refresh county map colors at new week start
            if (typeof Counties !== 'undefined' && Counties.colorCountyMap) {
                Counties.colorCountyMap();
            }
            var cvw = document.getElementById('county-view-wrapper');
            if (cvw && !cvw.classList.contains('hidden') && typeof Counties !== 'undefined') {
                if (gameData.selectedCounty && Counties.selectCounty) {
                    Counties.selectCounty(gameData.selectedCounty);
                }
            }
        } else {
            this.clickNational();
        }
        
        Utils.addLog("Week advanced - " + gameData.currentDate.toLocaleDateString());
        Utils.showToast("Week advanced!");
    },
    
    processUndecidedVoters: function() {
        if (typeof Counties === 'undefined' || !Counties.countyData) return;
        
        var isElectionDay = gameData.currentDate >= gameData.electionDay;
        
        for (var fips in Counties.countyData) {
            var county = Counties.countyData[fips];
            
            // Extract state code
            var stateFips = fips.padStart(5, '0').substring(0, 2);
            var stateCode = null;
            for (var code in STATES) {
                if (STATES[code].fips === stateFips) {
                    stateCode = code;
                    break;
                }
            }
            
            // Calculate base enthusiasm from momentum and ground ops
            var dEnthusiasm = 1.0;
            var rEnthusiasm = 1.0;
            
            if (gameData.playerParty === 'D') dEnthusiasm += (gameData.momentum || 0) * 0.05;
            if (gameData.playerParty === 'R') rEnthusiasm += (gameData.momentum || 0) * 0.05;
            
            if (stateCode && gameData.states[stateCode]) {
                var s = gameData.states[stateCode];
                if (s.groundOffices && s.groundOffices.D) dEnthusiasm += 0.02 * s.groundOffices.D;
                if (s.groundOffices && s.groundOffices.R) rEnthusiasm += 0.02 * s.groundOffices.R;
                if (s.voterFileQuality && s.voterFileQuality.D > 1) dEnthusiasm += 0.05;
                if (s.voterFileQuality && s.voterFileQuality.R > 1) rEnthusiasm += 0.05;
            }
            
            var undecidedPool = county.undecided || 0;
            
            // 1. Base Leakage (Disaffected Voters)
            // If candidate enthusiasm is low and they haven't appealed to the base, decided voters leak to undecided
            if (dEnthusiasm < 0.95 && county.v && county.v.D > 0) {
                var leak = county.v.D * (Math.random() * 0.015); // up to 1.5% leak
                county.v.D -= leak;
                undecidedPool += leak;
            }
            if (rEnthusiasm < 0.95 && county.v && county.v.R > 0) {
                var leak = county.v.R * (Math.random() * 0.015);
                county.v.R -= leak;
                undecidedPool += leak;
            }
            
            if (undecidedPool <= 0) {
                county.undecided = 0;
                continue;
            }
            
            // 2. Undecided Resolution (Voters making up their minds)
            var reductionRate;
            if (isElectionDay) {
                // On election day itself, remaining undecideds break or stay home
                reductionRate = 0.50 + Math.random() * 0.20; 
            } else {
                // Smooth weekly decay: ~3.5% - 4.5% per week of remaining undecided pool.
                // Starts at ~10% baseline and gradually decays to ~4% on Election Eve without sudden drops.
                reductionRate = 0.035 + Math.random() * 0.01;
                
                // Extra lock-in if campaigns are highly active in this state
                if (dEnthusiasm > 1.05 || rEnthusiasm > 1.05) reductionRate += 0.005;
            }
            
            var decidingVoters = undecidedPool * reductionRate;
            
            var decidedMultiplier = (100 - undecidedPool) / 100;
            var currentTotals = Counties.calculateCountyVoteTotals(county, { 
                reportingFactor: 1, 
                decidedMultiplier: decidedMultiplier, 
                errorFactor: 1 
            });
            
            var totalDecided = (currentTotals.D || 0) + (currentTotals.R || 0) + (currentTotals.G || 0) + 
                               (currentTotals.L || 0) + (currentTotals.I || 0) + (currentTotals.PSL || 0);
            
            if (totalDecided > 0) {
                // Distribute proportionally, but enthusiasm modulates the breaks!
                var dShare = ((currentTotals.D || 0) / totalDecided) * dEnthusiasm;
                var rShare = ((currentTotals.R || 0) / totalDecided) * rEnthusiasm;
                var tpShare = ((totalDecided - (currentTotals.D||0) - (currentTotals.R||0)) / totalDecided);
                
                // Normalize shares
                var sumShares = dShare + rShare + tpShare;
                if (sumShares > 0) {
                    dShare /= sumShares;
                    rShare /= sumShares;
                    tpShare /= sumShares;
                }
                
                county.v.D = (county.v.D || 0) + (decidingVoters * dShare);
                county.v.R = (county.v.R || 0) + (decidingVoters * rShare);
                
                // Third parties get a proportional cut of the tpShare
                var tpTotal = (currentTotals.G||0) + (currentTotals.L||0) + (currentTotals.I||0) + (currentTotals.PSL||0);
                if (tpTotal > 0 && tpShare > 0) {
                    county.v.G = (county.v.G || 0) + (decidingVoters * tpShare * ((currentTotals.G||0)/tpTotal));
                    county.v.L = (county.v.L || 0) + (decidingVoters * tpShare * ((currentTotals.L||0)/tpTotal));
                    county.v.I = (county.v.I || 0) + (decidingVoters * tpShare * ((currentTotals.I||0)/tpTotal));
                    county.v.PSL = (county.v.PSL || 0) + (decidingVoters * tpShare * ((currentTotals.PSL||0)/tpTotal));
                }
            } else {
                county.v.D = (county.v.D || 0) + (decidingVoters * 0.5);
                county.v.R = (county.v.R || 0) + (decidingVoters * 0.5);
            }
            
            county.undecided = Math.max(0, undecidedPool - decidingVoters);
        }
        
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

// v1 Spec Ticket 8: Retrospective / Economic Voting Layer
function updateApprovalTrajectory(campaign, activeShockEvents) {
    var c = campaign || (typeof gameData !== 'undefined' ? gameData : null);
    var e = (c && c.economy) ? c.economy : { realIncomeGrowth: 0.0, unemployment: 5.0, inflation: 2.5 };
    var base0 = (typeof RETRO_CONFIG !== 'undefined') ? RETRO_CONFIG.BETA_0 : 0.50;
    var bIncome = (typeof RETRO_CONFIG !== 'undefined') ? RETRO_CONFIG.BETA_INCOME : 0.015;
    var bUnemp = (typeof RETRO_CONFIG !== 'undefined') ? RETRO_CONFIG.BETA_UNEMPLOYMENT : -0.02;
    var bInf = (typeof RETRO_CONFIG !== 'undefined') ? RETRO_CONFIG.BETA_INFLATION : -0.015;
    var shockK = (typeof RETRO_CONFIG !== 'undefined') ? RETRO_CONFIG.SHOCK_KAPPA : 0.03;
    var noiseS = (typeof RETRO_CONFIG !== 'undefined') ? RETRO_CONFIG.NOISE_SIGMA : 0.01;

    var approval = base0 +
        bIncome * (e.realIncomeGrowth || 0) +
        bUnemp * ((e.unemployment !== undefined ? e.unemployment : 5.0) - 5.0) +
        bInf * ((e.inflation !== undefined ? e.inflation : 2.5) - 2.5) +
        gaussianNoise(0, noiseS);

    var events = activeShockEvents || (c && c.activeShockEvents) || [];
    for (var i = 0; i < events.length; i++) {
        var ev = events[i];
        if (ev.valence === 'negative') {
            approval -= shockK * (ev.salience !== undefined ? ev.salience : 1);
        } else {
            approval += shockK * (ev.salience !== undefined ? ev.salience : 1) * 0.5;
        }
    }

    var finalApproval = clamp(approval, 0, 1);
    if (c) c.approvalTrajectory = finalApproval;
    return finalApproval;
}

// v1 Spec Ticket 11: Endogenous Agenda-Setting
function computeSalienceBaseline(issueId, baselineDefault, currentWeek, activeAgendaEvents) {
    var boost = 0;
    var lambda = (typeof AGENDA_CONFIG !== 'undefined' && AGENDA_CONFIG.NEWS_DECAY_LAMBDA !== undefined)
        ? AGENDA_CONFIG.NEWS_DECAY_LAMBDA : 0.35;
    var curW = (currentWeek !== undefined) ? currentWeek : ((typeof gameData !== 'undefined' && gameData.currentWeek) ? gameData.currentWeek : 0);
    var events = activeAgendaEvents || (typeof gameData !== 'undefined' && gameData.activeAgendaEvents) || [];

    for (var i = 0; i < events.length; i++) {
        var ev = events[i];
        if (ev.issueId !== issueId) continue;
        var weeksSince = curW - (ev.startWeek !== undefined ? ev.startWeek : 0);
        if (weeksSince < 0) continue;
        var scale = (baselineDefault > 1) ? 3.5 : 0.35;
        boost += (ev.magnitude !== undefined ? ev.magnitude : 0.5) * scale * Math.exp(-lambda * weeksSince);
    }
    var maxVal = (baselineDefault > 1) ? 10 : 1;
    return clamp(baselineDefault + boost, 0, maxVal);
}
