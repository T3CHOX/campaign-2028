/* ============================================
   DECISION 2028 - CAMPAIGN GAMEPLAY
   Map, actions, turns, undo system
   ============================================ */

const Campaign = {
    // Initialize the campaign map
    initMap: async function() {
        const wrapper = document.getElementById('us-map-wrapper');
        wrapper.innerHTML = '<div class="loading-map">Loading map...</div>';
        
        try {
            const response = await fetch('map.svg');
            const svgText = await response.text();
            const parser = new DOMParser();
            const svgDoc = parser. parseFromString(svgText, 'image/svg+xml');
            const svg = svgDoc.querySelector('svg');
            
            if (svg) {
                svg.id = 'us-map-svg';
                svg.querySelectorAll('path').forEach(path => {
                    let code = path.id;
                    if (code && gameData.states[code]) {
                        path.style.cursor = 'pointer';
                        path. onclick = () => Campaign.clickState(code);
                        path.onmousemove = (e) => Campaign.showTooltip(e, gameData.states[code]);
                        path.onmouseleave = () => document.getElementById('map-tooltip').style.display = 'none';
                    }
                });
                wrapper.innerHTML = '';
                wrapper.appendChild(svg);
                this.colorMap();
            }
        } catch (e) {
            console.error("Failed to load map:", e);
            wrapper.innerHTML = '<div class="error-map">Failed to load map.  Make sure map.svg exists.</div>';
        }
    },

    // Show state tooltip
    showTooltip: function(e, state) {
        const tooltip = document.getElementById('map-tooltip');
        let marginText = Math.abs(state.margin).toFixed(1);
        let leaning = state.margin > 0 ? 'D+' : 'R+';
        if (Math.abs(state. margin) < 1) {
            leaning = 'TOSS-UP';
        } else {
            leaning = leaning + marginText;
        }
        
        tooltip.innerHTML = 
            '<span class="tooltip-title">' + state. name + '</span>' +
            '<div class="tooltip-divider"></div>' +
            '<span class="tooltip-leader" style="color: ' + (state.margin > 0 ? '#00AEF3' : '#E81B23') + '">' + leaning + '</span>' +
            '<span class="tooltip-stats">' + state. ev + ' Electoral Votes</span>';
        tooltip.style.display = 'block';
        tooltip.style. left = (e.clientX + 15) + 'px';
        tooltip. style.top = (e.clientY + 15) + 'px';
    },

    // Click a state
    clickState: function(code) {
        gameData.selectedState = code;
        document.querySelectorAll('#us-map-svg path').forEach(p => p.classList.remove('selected'));
        const path = document.getElementById(code);
        if (path) path.classList.add('selected');
        
        document.getElementById('empty-msg').classList.add('hidden');
        document.getElementById('state-panel').classList.remove('hidden');
        
        let s = gameData.states[code];
        document.getElementById('sp-name').innerText = s.name;
        document. getElementById('sp-ev').innerText = s.ev + ' EV';
        
        let demPct = 50 + s.margin / 2;
        let repPct = 50 - s.margin / 2;
        demPct = Math.max(0, Math.min(100, demPct));
        repPct = Math.max(0, Math.min(100, repPct));
        
        document.getElementById('poll-bar-wrap').innerHTML = 
            '<div style="width: ' + demPct + '%; background:  #00AEF3;"></div>' +
            '<div style="width: ' + repPct + '%; background: #E81B23;"></div>';
        document.getElementById('poll-dem-val').innerText = demPct. toFixed(1) + '%';
        document.getElementById('poll-rep-val').innerText = repPct.toFixed(1) + '%';
        
        let issuesList = document.getElementById('sp-issues-list');
        issuesList.innerHTML = '';
        Utils.shuffleArray(ISSUES).slice(0, 3).forEach(i => {
            issuesList.innerHTML += '<span class="issue-tag">' + i. name + '</span>';
        });
    },

    // Color the map based on margins
    colorMap:  function() {
        for (let code in gameData.states) {
            let s = gameData. states[code];
            let path = document.getElementById(code);
            if (path) {
                path.style.fill = Utils.getMarginColor(s.margin);
            }
        }
        this.updateScore();
    },

    // Update electoral vote score
    updateScore:  function() {
        let demEV = 0, repEV = 0;
        for (let code in gameData.states) {
            let s = gameData.states[code];
            if (s.margin > 0) demEV += s. ev;
            else repEV += s.ev;
        }
        document.getElementById('score-dem').innerText = demEV;
        document.getElementById('score-rep').innerText = repEV;
        
        let demPct = (demEV / 538) * 100;
        document.getElementById('ev-bar').style.background = 'linear-gradient(to right, #00AEF3 ' + demPct + '%, #E81B23 ' + demPct + '%)';
    },

    // Update HUD
    updateHUD: function() {
        document.getElementById('hud-img').src = gameData.candidate.img;
        document.getElementById('hud-cand-name').innerText = gameData. candidate.name;
        document.getElementById('hud-party-name').innerText = PARTIES[gameData. selectedParty].name. toUpperCase();
        document.getElementById('hud-funds').innerText = '$' + gameData. funds. toFixed(1) + 'M';
        document.getElementById('hud-date').innerText = Utils.formatDate(gameData.currentDate);
        
        let energyHtml = '';
        for (let i = 0; i < gameData.maxEnergy; i++) {
            energyHtml += '<div class="energy-pip ' + (i < gameData.energy ? 'active' : '') + '"></div>';
        }
        document. getElementById('hud-energy').innerHTML = energyHtml;
    },

    // Handle campaign action
    handleAction:  function(action) {
        if (! gameData.selectedState) {
            return Utils.showToast("Select a state first!");
        }
        
        let s = gameData.states[gameData.selectedState];
        let cost = { energy: 1, funds: 0 };
        let effect = 0;
        let message = '';
        
        switch (action) {
            case 'fundraise':
                if (gameData.energy < 1) return Utils.showToast("Not enough energy!");
                let raised = 2 + Math.random() * 3;
                gameData.funds += raised;
                message = 'Raised $' + raised. toFixed(1) + 'M in ' + s.name;
                cost.energy = 1;
                break;
            case 'rally':
                if (gameData.energy < 2) return Utils.showToast("Need 2 energy for rally!");
                if (gameData.funds < 1) return Utils.showToast("Need $1M for rally!");
                effect = 1 + Math.random() * 2;
                cost.energy = 2;
                cost. funds = 1;
                s.rallies++;
                s.visited = true;
                message = 'Rally in ' + s. name + '! +' + effect.toFixed(1) + ' points';
                break;
            case 'ad':
                if (gameData.funds < 3) return Utils.showToast("Need $3M for ad blitz!");
                effect = 0.5 + Math.random() * 1.5;
                cost.funds = 3;
                cost.energy = 0;
                s.adSpent += 3;
                message = 'Ad blitz in ' + s. name + '! +' + effect.toFixed(1) + ' points';
                break;
        }
        
        this.saveState();
        gameData.energy -= cost.energy;
        gameData. funds -= cost.funds;
        
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
        this.clickState(gameData. selectedState);
        Utils.showToast(message);
    },

    // Open state intel report
    openStateBio: function() {
        if (!gameData.selectedState) return;
        let s = gameData. states[gameData. selectedState];
        
        let marginText = Math.abs(s.margin).toFixed(1);
        let leaning = s.margin > 0 ? 'D+' + marginText : 'R+' + marginText;
        if (Math.abs(s.margin) < 2) leaning = 'TOSS-UP';
        
        document.getElementById('bio-title').innerText = s.name + ' - Intelligence Report';
        document.getElementById('bio-content').innerHTML = 
            '<div class="bio-stat"><strong>Electoral Votes:</strong> ' + s.ev + '</div>' +
            '<div class="bio-stat"><strong>Current Polling:</strong> <span style="color: ' + (s.margin > 0 ?  '#00AEF3' : '#E81B23') + '">' + leaning + '</span></div>' +
            '<div class="bio-stat"><strong>Campaign Visits:</strong> ' + (s.visited ? 'Yes' : 'Not yet') + '</div>' +
            '<div class="bio-stat"><strong>Ad Spending:</strong> $' + s.adSpent.toFixed(1) + 'M</div>' +
            '<div class="bio-stat"><strong>Rallies Held:</strong> ' + s.rallies + '</div>';
        document.getElementById('bio-modal').classList.remove('hidden');
    },

    // Advance to next week
    nextWeek: function() {
        this.saveState();
        gameData.currentDate. setDate(gameData.currentDate.getDate() + 7);
        gameData.energy = gameData.maxEnergy;
        
        this.opponentTurn();
        
        if (gameData.currentDate >= gameData.electionDay) {
            Utils.addLog("Election Day has arrived!");
            Screens.goTo('election-screen');
            Election.start();
            return;
        }
        
        this.updateHUD();
        Utils.addLog("Week advanced - " + gameData. currentDate.toLocaleDateString());
        Utils.showToast("Week advanced!");
    },

    // AI opponent turn
    opponentTurn: function() {
        const states = Object.keys(gameData.states);
        const numActions = 3 + Math.floor(Math.random() * 3);
        
        for (let i = 0; i < numActions; i++) {
            const randomState = states[Math.floor(Math. random() * states.length)];
            const s = gameData.states[randomState];
            const effect = 0.5 + Math.random() * 1.5;
            
            if (gameData.selectedParty === 'D') {
                s. margin -= effect;
            } else if (gameData.selectedParty === 'R') {
                s.margin += effect;
            } else {
                if (Math.random() > 0.5) {
                    s.margin += effect * 0.5;
                } else {
                    s.margin -= effect * 0.5;
                }
            }
        }
        
        this.colorMap();
    },

    // Save state for undo
    saveState: function() {
        const snapshot = {
            funds: gameData.funds,
            energy:  gameData.energy,
            date: gameData.currentDate.getTime(),
            states: {}
        };
        
        for (let code in gameData.states) {
            snapshot.states[code] = {
                margin: gameData.states[code].margin,
                visited: gameData.states[code].visited,
                adSpent: gameData.states[code]. adSpent,
                rallies:  gameData.states[code].rallies
            };
        }
        
        gameData.historyStack.push(snapshot);
        if (gameData.historyStack.length > 20) gameData.historyStack.shift();
    },

    // Undo last action
    undoLastAction: function() {
        if (gameData.historyStack.length === 0) {
            return Utils.showToast("Nothing to undo!");
        }
        
        const prev = gameData.historyStack.pop();
        gameData. funds = prev.funds;
        gameData.energy = prev. energy;
        gameData.currentDate = new Date(prev. date);
        
        for (let code in prev.states) {
            gameData.states[code].margin = prev.states[code].margin;
            gameData.states[code].visited = prev.states[code]. visited;
            gameData.states[code].adSpent = prev.states[code].adSpent;
            gameData. states[code].rallies = prev.states[code].rallies;
        }
        
        this. updateHUD();
        this.colorMap();
        if (gameData.selectedState) this.clickState(gameData.selectedState);
        Utils.showToast("Action undone!");
    },

    // Close county view
    closeCountyView: function() {
        document.getElementById('county-view-wrapper').classList.add('hidden');
        document.getElementById('us-map-wrapper').classList.remove('hidden');
    }
};
