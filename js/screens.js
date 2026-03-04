/* ============================================
   DECISION 2028 - SCREEN MANAGEMENT (OVERHAULED)
   ============================================ */

var Screens = {
    // Selection flow state
    selectionFlow: [],        // Ordered list of party codes to select for
    selectionFlowIdx: 0,      // Current index in the flow
    selectionPhase: 'pres',   // 'pres' or 'vp'
    currentPartyForPage: null,// Which party's page is being shown

    goTo: function(screenId) {
        var screens = document.querySelectorAll('.screen');
        for (var i = 0; i < screens.length; i++) {
            screens[i].classList.remove('active');
        }
        document.getElementById(screenId).classList.add('active');
    },

    selectParty: function(partyCode) {
        gameData.selectedParty = partyCode;
        // Build the selection flow:
        // Player's party first, then Dem, Rep, then (if thirdPartiesEnabled) F, G, L, O
        // But skip the player's party in the opponent slots
        var flow = [partyCode];
        var opponents = ['D', 'R'];
        if (gameData.thirdPartiesEnabled) {
            opponents = opponents.concat(['F', 'G', 'L', 'O']);
        }
        for (var i = 0; i < opponents.length; i++) {
            if (opponents[i] !== partyCode) {
                // Check if any candidates exist for this party
                var hasCandidates = false;
                for (var j = 0; j < CANDIDATES.length; j++) {
                    if (CANDIDATES[j].party === opponents[i]) {
                        hasCandidates = true;
                        break;
                    }
                }
                if (hasCandidates) {
                    flow.push(opponents[i]);
                }
            }
        }
        this.selectionFlow = flow;
        this.selectionFlowIdx = 0;
        this.selectionPhase = 'pres';
        this.showPartyPage(flow[0], 'pres');
    },

    showPartyPage: function(partyCode, phase) {
        this.currentPartyForPage = partyCode;
        this.selectionPhase = phase;
        var party = PARTIES[partyCode];
        if (!party) return;

        var color = party.color;
        var body = document.getElementById('party-page-body');
        var headerInfo = document.getElementById('pp-header-info');

        // Determine step info
        var flowIdx = this.selectionFlow.indexOf(partyCode);
        var totalParties = this.selectionFlow.length;
        var isPlayerParty = partyCode === gameData.selectedParty;
        var phaseLabel = phase === 'pres' ? 'Presidential Nominee' : 'Vice Presidential Nominee';
        var stepNum = (flowIdx * 2) + (phase === 'vp' ? 2 : 1);
        var totalSteps = totalParties * 2;
        headerInfo.innerText = 'Step ' + stepNum + ' of ' + totalSteps;

        // Build banner HTML
        var logoName = 'party-' + partyCode.toLowerCase() + '.png';
        if (partyCode === 'O') logoName = 'party-oth.png';
        var bannerHTML =
            '<div class="party-page-banner" style="background: linear-gradient(135deg, rgba(' + this._hexToRgb(color) + ',0.15) 0%, rgba(0,0,0,0.6) 100%); --party-banner-color: ' + color + ';">' +
                '<div class="party-banner-left" style="background: rgba(' + this._hexToRgb(color) + ',0.08);">' +
                    '<img class="party-banner-logo" src="images/' + logoName + '" onerror="this.style.display=\'none\'" alt="' + party.name + '" style="--party-banner-color:' + color + ';">' +
                '</div>' +
                '<div class="party-banner-right">' +
                    '<div class="party-banner-name" style="color:' + color + ';">' + party.name + '</div>' +
                    '<p class="party-banner-desc">' + (party.desc || '') + '</p>' +
                '</div>' +
            '</div>';

        // Build candidate/vp tiles
        var roleLabel = isPlayerParty ?
            (phase === 'pres' ? 'Choose Your Presidential Nominee' : 'Choose Your Running Mate') :
            (phase === 'pres' ? 'Select ' + party.name + ' Nominee' : 'Select ' + party.name + ' VP');

        var tilesHTML = '<div class="candidate-tiles-row" id="pp-tiles-row">';

        if (phase === 'pres') {
            var partyCands = CANDIDATES.filter(function(c) { return c.party === partyCode; });
            for (var i = 0; i < partyCands.length; i++) {
                tilesHTML += this._buildCandidateTile(partyCands[i], color, false);
            }
        } else {
            // VP phase
            var selectedPresId = this._getSelectedPresForParty(partyCode);
            var partyVPs = VPS.filter(function(v) { return v.party === partyCode && v.id !== selectedPresId; });
            for (var j = 0; j < partyVPs.length; j++) {
                tilesHTML += this._buildVpTile(partyVPs[j], color);
            }
        }
        tilesHTML += '</div>';

        var footerHTML =
            '<div class="party-page-footer">' +
                '<button class="pp-back-btn" onclick="Screens.goPartyPageBack()">&larr; BACK</button>' +
                '<span class="pp-step-indicator">' + party.name.toUpperCase() + ' &bull; ' + phaseLabel.toUpperCase() + '</span>' +
                '<button class="pp-continue-btn" id="pp-continue-btn" style="--pp-btn-color:' + color + '; color:' + color + ';" disabled onclick="Screens.advancePartyPage()">' +
                    (phase === 'pres' ? 'CONTINUE TO VP SELECTION &rarr;' : 'CONFIRM &rarr;') +
                '</button>' +
            '</div>';

        body.innerHTML = bannerHTML +
            '<div class="party-page-selection">' +
                '<div class="party-page-selection-title" style="color:' + color + ';">' + roleLabel + '</div>' +
                tilesHTML +
            '</div>' +
            footerHTML;

        // For non-player parties, auto-select first candidate
        if (!isPlayerParty) {
            this._autoSelectFirstTile(partyCode, phase);
        }

        this.goTo('party-page-screen');
    },

    _getSelectedPresForParty: function(partyCode) {
        if (partyCode === 'D' && gameData.demTicket && gameData.demTicket.pres) return gameData.demTicket.pres.id;
        if (partyCode === 'R' && gameData.repTicket && gameData.repTicket.pres) return gameData.repTicket.pres.id;
        if (partyCode === gameData.selectedParty && gameData.candidate) return gameData.candidate.id;
        if (gameData.thirdTickets && gameData.thirdTickets[partyCode] && gameData.thirdTickets[partyCode].pres) {
            return gameData.thirdTickets[partyCode].pres.id;
        }
        return null;
    },

    _autoSelectFirstTile: function(partyCode, phase) {
        var self = this;
        setTimeout(function() {
            var firstTile = document.querySelector('.candidate-tile');
            if (firstTile) {
                firstTile.click();
                // Auto advance after brief pause
                setTimeout(function() {
                    var continueBtn = document.getElementById('pp-continue-btn');
                    if (continueBtn && !continueBtn.disabled) {
                        self.advancePartyPage();
                    }
                }, 300);
            }
        }, 100);
    },

    _buildCandidateTile: function(c, color, selected) {
        var staminaPips = '';
        for (var s = 0; s < 10; s++) {
            staminaPips += '<div class="stamina-pip' + (s < (c.stamina || 7) ? ' filled' : '') + '"></div>';
        }
        var groupBoostsText = '';
        if (c.groupBoosts) {
            var boostKeys = Object.keys(c.groupBoosts).slice(0, 3);
            if (boostKeys.length > 0) {
                groupBoostsText = '<div class="tile-groups">👥 ' + boostKeys.map(function(k) { return k + ' +' + c.groupBoosts[k]; }).join(', ') + '</div>';
            }
        }
        var groupDebuffsText = '';
        if (c.groupDebuffs) {
            var debuffKeys = Object.keys(c.groupDebuffs).slice(0, 2);
            if (debuffKeys.length > 0) {
                groupDebuffsText = '<div class="tile-groups" style="color:#f44336;">⚠ ' + debuffKeys.map(function(k) { return k + ' ' + c.groupDebuffs[k]; }).join(', ') + '</div>';
            }
        }
        return '<div class="candidate-tile' + (selected ? ' selected' : '') + '" data-id="' + c.id + '" data-type="pres" style="--tile-party-color:' + color + ';" onclick="Screens.selectTile(this, \'' + c.party + '\', \'pres\')">' +
            '<img class="candidate-tile-img" src="' + c.img + '" onerror="this.src=\'images/scenario.jpg\'" alt="' + c.name + '">' +
            '<div class="candidate-tile-body">' +
                '<div class="candidate-tile-name">' + c.name + '</div>' +
                '<div class="candidate-tile-state">🏠 ' + (c.homeState || c.party) + '</div>' +
                '<div class="candidate-tile-desc">' + (c.desc || '') + '</div>' +
                '<div class="candidate-tile-stats">' +
                    '<div class="tile-stat-row"><span class="tile-stat-label">Funds:</span><span class="tile-stat-val">$' + (c.funds || 0) + 'M</span></div>' +
                    '<div class="tile-stat-row"><span class="tile-stat-label">Stamina:</span><div class="stamina-pips">' + staminaPips + '</div></div>' +
                    (c.buff ? '<div class="tile-buff">✦ ' + c.buff + '</div>' : '') +
                    (c.debuff ? '<div class="tile-debuff">⚠ ' + c.debuff + '</div>' : '') +
                '</div>' +
                groupBoostsText +
                groupDebuffsText +
            '</div>' +
        '</div>';
    },

    _buildVpTile: function(v, color) {
        return '<div class="candidate-tile" data-id="' + v.id + '" data-type="vp" style="--tile-party-color:' + color + ';" onclick="Screens.selectTile(this, \'' + v.party + '\', \'vp\')">' +
            '<img class="candidate-tile-img" src="' + v.img + '" onerror="this.src=\'images/scenario.jpg\'" alt="' + v.name + '">' +
            '<div class="candidate-tile-body">' +
                '<div class="candidate-tile-name">' + v.name + '</div>' +
                '<div class="candidate-tile-state">🏠 ' + v.state + '</div>' +
                '<div class="candidate-tile-desc">' + (v.desc || '') + '</div>' +
            '</div>' +
        '</div>';
    },

    _hexToRgb: function(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (!result) return '128,128,128';
        return parseInt(result[1], 16) + ',' + parseInt(result[2], 16) + ',' + parseInt(result[3], 16);
    },

    selectTile: function(tileEl, partyCode, type) {
        // Deselect all tiles
        var allTiles = document.querySelectorAll('.candidate-tile');
        for (var i = 0; i < allTiles.length; i++) {
            allTiles[i].classList.remove('selected');
        }
        tileEl.classList.add('selected');

        var id = tileEl.getAttribute('data-id');
        var currentPhase = this.selectionPhase;
        var currentParty = this.currentPartyForPage;

        if (currentPhase === 'pres') {
            for (var j = 0; j < CANDIDATES.length; j++) {
                if (CANDIDATES[j].id === id) {
                    var cand = CANDIDATES[j];
                    if (typeof CANDIDATE_POSITIONS !== 'undefined' && CANDIDATE_POSITIONS[id]) {
                        cand = Object.assign({}, cand, { issuePositions: CANDIDATE_POSITIONS[id] });
                    }
                    this._storeTicketPres(currentParty, cand);
                    break;
                }
            }
        } else {
            // VP selection - check VPS first, then CANDIDATES
            var found = false;
            for (var k = 0; k < VPS.length; k++) {
                if (VPS[k].id === id) {
                    this._storeTicketVP(currentParty, VPS[k]);
                    found = true;
                    break;
                }
            }
            if (!found) {
                for (var m = 0; m < CANDIDATES.length; m++) {
                    if (CANDIDATES[m].id === id) {
                        this._storeTicketVP(currentParty, CANDIDATES[m]);
                        break;
                    }
                }
            }
        }

        // Enable continue button
        var btn = document.getElementById('pp-continue-btn');
        if (btn) {
            btn.disabled = false;
        }
    },

    _storeTicketPres: function(partyCode, cand) {
        if (partyCode === gameData.selectedParty) {
            gameData.candidate = cand;
            gameData.maxEnergy = cand.stamina || 8;
            gameData.energy = gameData.maxEnergy;
            gameData.funds = cand.funds || 50;
        }
        if (partyCode === 'D') {
            if (!gameData.demTicket) gameData.demTicket = {};
            gameData.demTicket.pres = cand;
        } else if (partyCode === 'R') {
            if (!gameData.repTicket) gameData.repTicket = {};
            gameData.repTicket.pres = cand;
        } else {
            if (!gameData.thirdTickets) gameData.thirdTickets = {};
            if (!gameData.thirdTickets[partyCode]) gameData.thirdTickets[partyCode] = {};
            gameData.thirdTickets[partyCode].pres = cand;
        }
    },

    _storeTicketVP: function(partyCode, vp) {
        if (partyCode === gameData.selectedParty) {
            gameData.vp = vp;
        }
        if (partyCode === 'D') {
            if (!gameData.demTicket) gameData.demTicket = {};
            gameData.demTicket.vp = vp;
        } else if (partyCode === 'R') {
            if (!gameData.repTicket) gameData.repTicket = {};
            gameData.repTicket.vp = vp;
        } else {
            if (!gameData.thirdTickets) gameData.thirdTickets = {};
            if (!gameData.thirdTickets[partyCode]) gameData.thirdTickets[partyCode] = {};
            gameData.thirdTickets[partyCode].vp = vp;
        }
    },

    advancePartyPage: function() {
        var partyCode = this.currentPartyForPage;
        var phase = this.selectionPhase;

        if (phase === 'pres') {
            // Advance to VP for this party
            this.showPartyPage(partyCode, 'vp');
        } else {
            // Pres + VP selected for this party. Advance to next party in flow.
            this.selectionFlowIdx++;
            if (this.selectionFlowIdx < this.selectionFlow.length) {
                var nextParty = this.selectionFlow[this.selectionFlowIdx];
                this.showPartyPage(nextParty, 'pres');
            } else {
                // All parties done - start the game
                app.startGame();
            }
        }
    },

    goPartyPageBack: function() {
        var phase = this.selectionPhase;
        var idx = this.selectionFlowIdx;

        if (phase === 'vp') {
            // Go back to pres selection for current party
            this.showPartyPage(this.currentPartyForPage, 'pres');
        } else if (idx === 0) {
            // Back to party selection
            this.goTo('party-screen');
        } else {
            // Go back to previous party's VP selection
            this.selectionFlowIdx--;
            this.showPartyPage(this.selectionFlow[this.selectionFlowIdx], 'vp');
        }
    },

    // Legacy stubs for compatibility
    renderCandidates: function(partyCode) {},
    renderVPs: function(partyCode) {},
    selectCandidate: function(id) {},
    selectVP: function(id) {},
    renderOpponentScreen: function() {},
    renderTicketCards: function() {},
    updateStartButton: function() {}
};
