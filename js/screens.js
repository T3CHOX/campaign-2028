/* ============================================
   DECISION 2028 - SCREEN MANAGEMENT (OVERHAULED)
   ============================================ */

const GROUP_ICONS = {
    white: '👨🏻', black: '👨🏿', hispanic: '👨🏽', asian: '👨🏻‍💻', native: '🪶',
    evangelical: '✝️', catholic: '⛪', jewish: '🕍', muslim: '☪️', secular: '⚛️',
    bluecollar: '👷', whitecollar: '👔', smallbusiness: '🏪', union: '⚙️', tech: '💻', farmers: '🚜', military: '🪖',
    college: '🎓', noncollege: '🛠️', suburban: '🏡', urban: '🏙️', rural: '🌾',
    youth: '📱', seniors: '👴', progressives: '🌹', libertarians: '🗽', maga: '🧢', centrists: '⚖️',
    lgbtq_community: '🏳️‍🌈', women: '👩'
};

function formatEffect(isBuff, text, logo) {
    // Use game-themed gray icons: green for buff (+), red for debuff (-)
    var icon = isBuff ? '<span style="color: #4CAF50; font-weight: bold; font-size: 1.2em;">+</span>' : '<span style="color: #DC3545; font-weight: bold; font-size: 1.2em;">−</span>';
    var groupLogo = logo ? '<span style="margin-left: auto; margin-right: 4px;">' + logo + '</span>' : '<span style="margin-left: auto;"></span>';
    return '<div style="display: flex; align-items: center; justify-content: flex-start; width: 100%; gap: 6px; margin-bottom: 4px; font-size: 0.75rem; color: #ccc;">' +
           icon + '<span style="flex: 1;">' + text + '</span>' + groupLogo + '</div>';
}

var Screens = {
    // Selection flow state
    selectionFlow: [],        // Ordered list of party codes to select for
    selectionFlowIdx: 0,      // Current index in the flow
    selectionPhase: 'pres',   // 'pres' or 'vp'
    currentPartyForPage: null,// Which party's page is being shown
    skippedParties: [],       // Parties removed from this election by the player

    goTo: function(screenId) {
        var screens = document.querySelectorAll('.screen');
        for (var i = 0; i < screens.length; i++) {
            screens[i].classList.remove('active');
        }
        document.getElementById(screenId).classList.add('active');
    },

    selectParty: function(partyCode) {
        gameData.selectedParty = partyCode;
        this.skippedParties = [];
        // Build the selection flow:
        // Player's party first, then Dem, Rep, then (if thirdPartiesEnabled) L, G, I, PSL
        // But skip the player's party in the opponent slots
        var flow = [partyCode];
        var opponents = ['D', 'R'];
        if (gameData.thirdPartiesEnabled) {
            opponents = opponents.concat(['L', 'G', 'I', 'PSL']);
        }
        for (var i = 0; i < opponents.length; i++) {
            if (opponents[i] !== partyCode) {
                // Always include all parties — placeholders ensure progress is possible
                flow.push(opponents[i]);
            }
        }
        this.selectionFlow = flow;
        this.selectionFlowIdx = 0;
        this.selectionPhase = 'pres';
        this.showPartyPage(flow[0], 'pres');
    },

    // Skip a third-party — remove them from election entirely
    skipParty: function(partyCode) {
        this.skippedParties.push(partyCode);
        // Clear any previously set ticket for this party
        if (gameData.thirdTickets) {
            delete gameData.thirdTickets[partyCode];
        }
        // Advance to next party in flow
        this.selectionFlowIdx++;
        if (this.selectionFlowIdx < this.selectionFlow.length) {
            this.showPartyPage(this.selectionFlow[this.selectionFlowIdx], 'pres');
        } else {
            app.startGame();
        }
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
        var isThirdParty = partyCode !== 'D' && partyCode !== 'R';
        var phaseLabel = phase === 'pres' ? 'Presidential Nominee' : 'Vice Presidential Nominee';
        var stepNum = (flowIdx * 2) + (phase === 'vp' ? 2 : 1);
        var totalSteps = totalParties * 2;
        headerInfo.innerText = '';

        // Build banner HTML
        var logoName = this._getPartyLogoFile(partyCode);
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
            if (partyCands.length === 0) {
                tilesHTML += '<div class="no-candidates-msg">No candidates registered for this party.</div>';
            }
            for (var i = 0; i < partyCands.length; i++) {
                tilesHTML += this._buildCandidateTile(partyCands[i], color, false);
            }
        } else {
            // VP phase — show dedicated VPs plus same-party candidates as flexible running-mate options
            var selectedPresId = this._getSelectedPresForParty(partyCode);
            var partyVPs = VPS.filter(function(v) { return v.party === partyCode && v.id !== selectedPresId; });
            // Also allow same-party presidential candidates (who weren't selected as pres) to be VP options
            var extraVPCands = CANDIDATES.filter(function(c) {
                return c.party === partyCode &&
                       c.id !== selectedPresId &&
                       !partyVPs.some(function(v) { return v.id === c.id; });
            });
            // Deduplicate by name: VPS entries take priority over same-name CANDIDATES entries
            var seenVPNames = {};
            for (var pi = 0; pi < partyVPs.length; pi++) { seenVPNames[partyVPs[pi].name] = true; }
            var dedupedExtras = extraVPCands.filter(function(c) { return !seenVPNames[c.name]; });
            var allVPOptions = partyVPs.concat(dedupedExtras);
            if (allVPOptions.length === 0) {
                tilesHTML += '<div class="no-candidates-msg">No running mate options registered for this party.</div>';
            }
            for (var j = 0; j < allVPOptions.length; j++) {
                tilesHTML += this._buildVpTile(allVPOptions[j], color);
            }
        }
        tilesHTML += '</div>';

        // Skip button — only for third parties that are not the player's party
        var skipBtnHTML = '';
        if (isThirdParty && !isPlayerParty && phase === 'pres') {
            skipBtnHTML =
                '<div class="pp-skip-bar">' +
                    '<button class="pp-skip-btn" onclick="Screens.skipParty(\'' + partyCode + '\')" style="--skip-color:' + color + ';">' +
                        '✕ Remove ' + party.name + ' from this Election' +
                    '</button>' +
                '</div>';
        }

        var continueLabel = phase === 'pres' ? 'CONTINUE TO VP SELECTION &rarr;' : 'CONFIRM &rarr;';
        var footerHTML =
            '<div class="party-page-footer">' +
                '<button class="pp-back-btn" onclick="Screens.goPartyPageBack()">&larr; BACK</button>' +
                '<span class="pp-step-indicator">' + party.name.toUpperCase() + ' &bull; ' + phaseLabel.toUpperCase() + '</span>' +
                '<button class="pp-continue-btn" id="pp-continue-btn" style="--pp-btn-color:' + color + '; color:' + color + ';" disabled onclick="Screens.advancePartyPage()">' +
                    continueLabel +
                '</button>' +
            '</div>';

        body.innerHTML = bannerHTML +
            '<div class="party-page-selection">' +
                '<div class="party-page-selection-title" style="color:' + color + ';">' + roleLabel + '</div>' +
                tilesHTML +
            '</div>' +
            skipBtnHTML +
            footerHTML;

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

    _buildCandidateTile: function(c, color, selected) {
        var staminaPips = '';
        for (var s = 0; s < 10; s++) {
            staminaPips += '<div class="stamina-pip' + (s < (c.stamina || 7) ? ' filled' : '') + '"></div>';
        }

        var effectsHTML = '<div class="candidate-effects-list" style="margin-top: 6px; display: flex; flex-direction: column; width: 100%;">';
        if (c.buff) effectsHTML += formatEffect(true, c.buff, '✦');
        if (c.debuff) effectsHTML += formatEffect(false, c.debuff, '⚠');
        var groupEffects = c.groupEffects || {};
        var groupEffectKeys = Object.keys(groupEffects).slice(0, 5);
        for (var e = 0; e < groupEffectKeys.length; e++) {
            var effectKey = groupEffectKeys[e];
            var effect = groupEffects[effectKey] || {};
            var effectParts = [];
            if (effect.support !== undefined && effect.support !== 0) {
                effectParts.push((effect.support > 0 ? '+' : '') + effect.support + ' support');
            }
            if (effect.turnout !== undefined && effect.turnout !== 0) {
                effectParts.push((effect.turnout > 0 ? '+' : '') + effect.turnout + ' turnout');
            }
            if (!effectParts.length) continue;
            var groupName = (typeof INTEREST_GROUPS !== 'undefined' && INTEREST_GROUPS[effectKey]) ? INTEREST_GROUPS[effectKey].name : effectKey;
            var isPositive = (effect.support || 0) >= 0 && (effect.turnout || 0) >= 0;
            effectsHTML += formatEffect(isPositive, groupName + ' (' + effectParts.join(', ') + ')', GROUP_ICONS[effectKey] || '👥');
            }
        effectsHTML += '</div>';

        var logoName = this._getPartyLogoFile(c.party);
        return '<div class="candidate-tile' + (selected ? ' selected' : '') + '" data-id="' + c.id + '" data-type="pres" style="--tile-party-color:' + color + ';" onclick="Screens.selectTile(this, \'' + c.party + '\', \'pres\')">' +
            '<img class="candidate-tile-party-logo" src="images/' + logoName + '" onerror="this.style.display=\'none\'" alt="' + c.party + ' logo">' +
            '<img class="candidate-tile-img" src="' + c.img + '" onerror="this.src=\'images/scenario.jpg\'" alt="' + c.name + '">' +
            '<div class="candidate-tile-body">' +
                '<div class="candidate-tile-meta">' +
                    '<div class="candidate-tile-header-row" style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 2px;">' +
                        '<div class="candidate-tile-name" style="flex: 1;">' + c.name + '</div>' +
                        '<div class="candidate-tile-state" style="margin-bottom: 0; white-space: nowrap; margin-left: 4px;">🏠 ' + (c.homeState || '') + '</div>' +
                    '</div>' +
                    '<div class="candidate-tile-position">' + (c.position || '') + '</div>' +
                    '<div class="candidate-tile-stats">' +
                        '<div class="tile-stat-row"><span class="tile-stat-label">Funds:</span><span class="tile-stat-val">$' + (c.funds || 0) + 'M</span></div>' +
                        '<div class="tile-stat-row"><span class="tile-stat-label">Stamina:</span><div class="stamina-pips">' + staminaPips + '</div></div>' +
                        '<div class="tile-stat-row"><span class="tile-stat-label">Charisma:</span><span class="tile-stat-val">' + (c.charisma ? c.charisma.toFixed(1) : '1.0') + 'x</span></div>' +
                        '<div class="tile-stat-row"><span class="tile-stat-label">Debate Skill:</span><span class="tile-stat-val">' + (c.debateSkill !== undefined ? c.debateSkill : 5) + '/10</span></div>' +
                        '<div class="tile-stat-row"><span class="tile-stat-label">Scandal Res.:</span><span class="tile-stat-val">' + (c.scandalResistance ? c.scandalResistance.toFixed(1) : '1.0') + 'x</span></div>' +
                        (c.siphonFromMajorParties ? '<div class="tile-stat-row"><span class="tile-stat-label">Siphons:</span><span class="tile-stat-val">D -' + Math.round((c.siphonFromMajorParties.D || 0) * 100) + '%, R -' + Math.round((c.siphonFromMajorParties.R || 0) * 100) + '%</span></div>' : '') +
                    '</div>' +
                    effectsHTML +
                '</div>' +
                '<div class="candidate-tile-desc-wrapper">' +
                    '<p class="candidate-tile-desc">' + (c.desc || '') + '</p>' +
                '</div>' +
            '</div>' +
        '</div>';
    },

    _buildVpTile: function(v, color) {
        var effectsHTML = '<div class="candidate-effects-list" style="margin-top: 6px; display: flex; flex-direction: column; width: 100%;">';
        if (v.buff) effectsHTML += formatEffect(true, v.buff, '✦');
        if (v.debuff) effectsHTML += formatEffect(false, v.debuff, '⚠');
        var vpGroupEffects = v.groupEffects || {};
        var vpEffectKeys = Object.keys(vpGroupEffects).slice(0, 5);
        for (var e = 0; e < vpEffectKeys.length; e++) {
            var effectKey = vpEffectKeys[e];
            var effect = vpGroupEffects[effectKey] || {};
            var effectParts = [];
            if (effect.support !== undefined && effect.support !== 0) {
                effectParts.push((effect.support > 0 ? '+' : '') + effect.support + ' support');
            }
            if (effect.turnout !== undefined && effect.turnout !== 0) {
                effectParts.push((effect.turnout > 0 ? '+' : '') + effect.turnout + ' turnout');
            }
            if (!effectParts.length) continue;
            var groupName = (typeof INTEREST_GROUPS !== 'undefined' && INTEREST_GROUPS[effectKey]) ? INTEREST_GROUPS[effectKey].name : effectKey;
            var isPositive = (effect.support || 0) >= 0 && (effect.turnout || 0) >= 0;
            effectsHTML += formatEffect(isPositive, groupName + ' (' + effectParts.join(', ') + ')', GROUP_ICONS[effectKey] || '👥');
        }
        effectsHTML += '</div>';

        var logoName = this._getPartyLogoFile(v.party);
        return '<div class="candidate-tile" data-id="' + v.id + '" data-type="vp" style="--tile-party-color:' + color + ';" onclick="Screens.selectTile(this, \'' + v.party + '\', \'vp\')">' +
            '<img class="candidate-tile-party-logo" src="images/' + logoName + '" onerror="this.style.display=\'none\'" alt="' + v.party + ' logo">' +
            '<img class="candidate-tile-img" src="' + (v.img || 'images/scenario.jpg') + '" onerror="this.src=\'images/scenario.jpg\'" alt="' + v.name + '">' +
            '<div class="candidate-tile-body">' +
                '<div class="candidate-tile-meta">' +
                    '<div class="candidate-tile-header-row" style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 2px;">' +
                        '<div class="candidate-tile-name" style="flex: 1;">' + v.name + '</div>' +
                        '<div class="candidate-tile-state" style="margin-bottom: 0; white-space: nowrap; margin-left: 4px;">🏠 ' + (v.state || v.homeState || '') + '</div>' +
                    '</div>' +
                    '<div class="candidate-tile-position">' + (v.position || '') + '</div>' +
                    effectsHTML +
                '</div>' +
                '<div class="candidate-tile-desc-wrapper">' +
                    '<p class="candidate-tile-desc">' + (v.desc || '') + '</p>' +
                '</div>' +
            '</div>' +
        '</div>';
    },

    _getPartyLogoFile: function(partyCode) {
        var logoMap = {
            D: 'party-dem.png',
            R: 'party-rep.png',
            G: 'party-grn.png',
            L: 'party-lib.png',
            I: 'party-ind.png',
            PSL: 'party-psl.png'
        };
        return logoMap[partyCode] || ('party-' + String(partyCode || '').toLowerCase() + '.png');
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
            // Skip over any parties that were skipped (go back to previous active party)
            while (this.selectionFlowIdx > 0 && this.skippedParties.indexOf(this.selectionFlow[this.selectionFlowIdx]) !== -1) {
                this.selectionFlowIdx--;
            }
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
