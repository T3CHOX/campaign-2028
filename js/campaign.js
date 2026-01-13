/* ============================================
   DECISION 2028 - CAMPAIGN GAMEPLAY
   ============================================ */

var Campaign = {
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
        var leaning;
        if (Math.abs(state.margin) < 1) {
            leaning = 'TOSS-UP';
        } else {
            leaning = (state.margin > 0 ? 'D+' : 'R+') + marginText;
        }
        
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
        document.getElementById('sp-ev').innerText = s.ev + ' EV';
        
        var demPct = 50 + s.margin / 2;
        var repPct = 50 - s.margin / 2;
        demPct = Math.max(0, Math.min(100, demPct));
        repPct = Math.max(0, Math.min(100, repPct));
        
        document.getElementById('poll-bar-wrap').innerHTML = 
            '<div style="width: ' + demPct + '%; background: #00AEF3;"></div>' +
            '<div style="width: ' + repPct + '%; background: #E81B23;"></div>';
        document.getElementById('poll-dem-val').innerText = demPct.toFixed(1) + '%';
        document.getElementById('poll-rep-val').innerText = repPct.toFixed(1) + '%';
        
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
    },

    colorMap: function() {
        for (var code in gameData.states) {
            var s = gameData.states[code];
            var path = document.getElementById(code);
            if (path) {
                path.style.fill = Utils.getMarginColor(s.margin);
            }
        }
        this.updateScore();
    },

    updateScore: function() {
        var demEV = 0;
        var repEV = 0;
        for (var code in gameData.states) {
            var s = gameData.states[code];
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
        
        var energyHtml = '';
        for (var i = 0; i < gameData.maxEnergy; i++) {
            energyHtml += '<div class="energy-pip ' + (i < gameData.energy ? 'active' : '') + '"></div>';
        }
        document.getElementById('hud-energy').innerHTML = energyHtml;
    },

    handleAction: function(action) {
        if (! gameData.selectedState) {
            return Utils.showToast("Select a state first!");
        }
        
        var s = gameData.states[gameData.selectedState];
        var cost = { energy: 1, funds: 0 };
        var effect = 0;
        var message = '';
        
        if (action === 'fundraise') {
            if (gameData.energy < 1) return Utils.showToast("Not enough energy!");
            
            // Advanced fundraising formula
            var baseAmount = STATE_FUNDRAISING_POTENTIAL[gameData.selectedState] || 2.0;
            
            // Party alignment bonus
            var alignmentBonus = 1.0;
            if ((gameData.selectedParty === 'D' && s.margin > 0) || 
                (gameData.selectedParty === 'R' && s.margin < 0)) {
                alignmentBonus = 1.3; // Fundraising in friendly state
            } else if ((gameData.selectedParty === 'D' && s.margin < -10) ||
                       (gameData.selectedParty === 'R' && s.margin > 10)) {
                alignmentBonus = 0.7; // Fundraising in hostile state
            }
            
            // Candidate charisma modifier
            var charismaModifier = gameData.candidate.funds ? (gameData.candidate.funds / 60) : 1.0;
            
            // Fatigue penalty
            var fatiguePenalty = Math.max(0.5, 1.0 - ((s.fundraisingVisits || 0) * 0.1));
            
            // Calculate final amount with randomness
            var raised = baseAmount * alignmentBonus * charismaModifier * fatiguePenalty;
            raised *= (0.8 + Math.random() * 0.4); // ±20% variance
            
            gameData.funds += raised;
            s.fundraisingVisits = (s.fundraisingVisits || 0) + 1;
            message = 'Raised $' + raised.toFixed(1) + 'M in ' + s.name;
            cost.energy = 1;
        } else if (action === 'rally') {
            // Check if we're in county view
            if (gameData.inCountyView && gameData.selectedCounty) {
                Counties.rallyInCounty(gameData.selectedCounty);
                return;
            }
            
            // State-level rally
            if (gameData.energy < 2) return Utils.showToast("Need 2 energy for rally!");
            if (gameData.funds < 1) return Utils.showToast("Need $1M for rally!");
            effect = 1 + Math.random() * 2;
            cost.energy = 2;
            cost.funds = 1;
            s.rallies = (s.rallies || 0) + 1;
            s.visited = true;
            message = 'Rally in ' + s.name + '! +' + effect.toFixed(1) + ' points';
        } else if (action === 'ad') {
            if (gameData.funds < 3) return Utils.showToast("Need $3M for ad blitz!");
            effect = 0.5 + Math.random() * 1.5;
            cost.funds = 3;
            cost.energy = 0;
            s.adSpent = (s.adSpent || 0) + 3;
            message = 'Ad blitz in ' + s.name + '! +' + effect.toFixed(1) + ' points';
        } else if (action === 'speech') {
            // Open speech modal to select issue
            app.openSpeechModal();
            return;
        }
        
        this.saveState();
        gameData.energy -= cost.energy;
        gameData.funds -= cost.funds;
        
        if (gameData.selectedParty === 'D') {
            s.margin += effect;
        } else if (gameData.selectedParty === 'R') {
            s.margin -= effect;
        } else {
            s.margin += effect * 0.3;
        }
        
        Utils.addLog(message);
        this.updateHUD();
        this.colorMap();
        this.clickState(gameData.selectedState);
        Utils.showToast(message);
    },

    handleSpeech: function(issueId) {
        if (!gameData.selectedState) return;
        
        var s = gameData.states[gameData.selectedState];
        if (gameData.energy < 1) {
            Utils.showToast("Not enough energy!");
            return;
        }
        if (gameData.funds < 0.5) {
            Utils.showToast("Need $0.5M for campaign speech!");
            return;
        }
        
        this.saveState();
        
        // Get positions
        var statePos = (STATE_ISSUE_POSITIONS[gameData.selectedState] && STATE_ISSUE_POSITIONS[gameData.selectedState][issueId]) || 0;
        var candidatePos = (gameData.candidate.issuePositions && gameData.candidate.issuePositions[issueId]) || 0;
        
        // Calculate alignment (how close candidate is to state position)
        var alignment = 1 - (Math.abs(statePos - candidatePos) / 20); // 0 to 1
        
        // Base effect modified by alignment
        var baseEffect = 0.5 + Math.random() * 1.0;
        var effect = baseEffect * (0.5 + alignment); // 0.5x to 1.5x multiplier
        
        // Apply turnout boost (stored for turnout calculations)
        if (!s.turnoutBoosts) s.turnoutBoosts = {};
        s.turnoutBoosts[issueId] = (s.turnoutBoosts[issueId] || 0) + (alignment * 0.1);
        
        gameData.energy -= 1;
        gameData.funds -= 0.5;
        
        var issueName = CORE_ISSUES.find(function(i) { return i.id === issueId; }).name;
        
        if (gameData.selectedParty === 'D') {
            s.margin += effect;
        } else if (gameData.selectedParty === 'R') {
            s.margin -= effect;
        } else {
            s.margin += effect * 0.3;
        }
        
        var alignmentText = alignment > 0.7 ? 'Great' : (alignment > 0.4 ? 'Good' : 'Modest');
        var message = 'Speech on ' + issueName + ' in ' + s.name + '! ' + alignmentText + ' alignment. +' + effect.toFixed(1);
        
        Utils.addLog(message);
        this.updateHUD();
        this.colorMap();
        this.clickState(gameData.selectedState);
        Utils.showToast(message);
        
        app.closeSpeechModal();
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
        
        document.getElementById('bio-title').innerText = s.name + ' - Intelligence Report';
        document.getElementById('bio-content').innerHTML = 
            '<div class="bio-stat"><strong>Electoral Votes:</strong> ' + s.ev + '</div>' +
            '<div class="bio-stat"><strong>Current Polling:</strong> <span style="color: ' + (s.margin > 0 ?  '#00AEF3' : '#E81B23') + '">' + leaning + '</span></div>' +
            '<div class="bio-stat"><strong>Campaign Visits:</strong> ' + (s.visited ? 'Yes' : 'Not yet') + '</div>' +
            '<div class="bio-stat"><strong>Ad Spending:</strong> $' + (s.adSpent || 0).toFixed(1) + 'M</div>' +
            '<div class="bio-stat"><strong>Rallies Held:</strong> ' + (s.rallies || 0) + '</div>';
        document.getElementById('bio-modal').classList.remove('hidden');
    },

    nextWeek: function() {
        this.saveState();
        gameData.currentDate.setDate(gameData.currentDate.getDate() + 7);
        gameData.energy = gameData.maxEnergy;
        
        // Random chance for PAC offer (20% per week)
        if (Math.random() < 0.2 && typeof app.triggerPacOffer !== 'undefined') {
            setTimeout(function() {
                app.triggerPacOffer();
            }, 1000);
        }
        
        this.opponentTurn();
        
        if (gameData.currentDate >= gameData.electionDay) {
            Utils.addLog("Election Day has arrived!");
            Screens.goTo('election-screen');
            Election.start();
            return;
        }
        
        this.updateHUD();
        Utils.addLog("Week advanced - " + gameData.currentDate.toLocaleDateString());
        Utils.showToast("Week advanced!");
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
