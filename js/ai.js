/* ============================================
   DECISION 2028 - OPPONENT AI SYSTEM
   ============================================ */

var AI_PERSONALITIES = {
    aggressive: {
        swingWeight: 0.55,
        defendWeight: 0.18,
        expandWeight: 0.17,
        fundraiseWeight: 0.1,
        rallyBias: 0.65,
        countyRallyBias: 0.6,
        mistakeChance: 0.12,
        vpPressureChance: 0.25
    },
    defensive: {
        swingWeight: 0.4,
        defendWeight: 0.38,
        expandWeight: 0.12,
        fundraiseWeight: 0.1,
        rallyBias: 0.45,
        countyRallyBias: 0.35,
        mistakeChance: 0.08,
        vpPressureChance: 0.2
    },
    expansion: {
        swingWeight: 0.35,
        defendWeight: 0.15,
        expandWeight: 0.4,
        fundraiseWeight: 0.1,
        rallyBias: 0.55,
        countyRallyBias: 0.7,
        mistakeChance: 0.15,
        vpPressureChance: 0.22
    },
    balanced: {
        swingWeight: 0.45,
        defendWeight: 0.25,
        expandWeight: 0.2,
        fundraiseWeight: 0.1,
        rallyBias: 0.55,
        countyRallyBias: 0.45,
        mistakeChance: 0.1,
        vpPressureChance: 0.2
    }
};

var AI_CANDIDATE_PERSONALITIES = {
    harris: 'defensive',
    newsom: 'aggressive',
    whitmer: 'defensive',
    buttigieg: 'balanced',
    aoc: 'aggressive',
    trump: 'aggressive',
    vance: 'aggressive',
    desantis: 'aggressive',
    haley: 'defensive',
    paul: 'expansion',
    stein: 'expansion',
    oliver: 'expansion',
    kennedy_rfk: 'expansion'
};

var OpponentAI = {
    STRATEGY_DEFEND: 'defend',
    STRATEGY_SWING: 'swing',
    STRATEGY_EXPAND: 'expand',
    STRATEGY_FUNDRAISE: 'fundraise',

    getTicket: function(party) {
        if (party === 'D') return gameData.demTicket;
        if (party === 'R') return gameData.repTicket;
        if (gameData.thirdTickets && gameData.thirdTickets[party]) return gameData.thirdTickets[party];
        return null;
    },

    getPersonality: function(party) {
        var ticket = this.getTicket(party);
        var candidateId = ticket && ticket.pres ? ticket.pres.id : null;
        var personalityKey = AI_CANDIDATE_PERSONALITIES[candidateId] || 'balanced';
        return AI_PERSONALITIES[personalityKey] || AI_PERSONALITIES.balanced;
    },

    determineStrategy: function(party, personality) {
        if (Utils.isThirdParty(party)) {
            return this.STRATEGY_EXPAND;
        }

        var weights = {
            swing: personality.swingWeight,
            defend: personality.defendWeight,
            expand: personality.expandWeight,
            fundraise: personality.fundraiseWeight
        };

        if (gameData.funds < 15) {
            weights.fundraise += 0.1;
        }
        if (gameData.playerPressure && Object.keys(gameData.playerPressure).length) {
            weights.swing += 0.1;
        }

        var roll = Math.random();
        var total = weights.swing + weights.defend + weights.expand + weights.fundraise;
        var swingCut = weights.swing / total;
        var defendCut = swingCut + (weights.defend / total);
        var expandCut = defendCut + (weights.expand / total);

        if (roll < swingCut) return this.STRATEGY_SWING;
        if (roll < defendCut) return this.STRATEGY_DEFEND;
        if (roll < expandCut) return this.STRATEGY_EXPAND;
        return this.STRATEGY_FUNDRAISE;
    },

    executeTurn: function(opponentParty, stamina) {
        var actions = [];
        var personality = this.getPersonality(opponentParty);
        var strategy = this.determineStrategy(opponentParty, personality);
        var numActions = Math.max(1, Math.min(3, Math.floor(stamina * 0.35)));

        if (Math.random() < personality.vpPressureChance) {
            this.applyVpPressure(opponentParty);
        }

        var focusState = this.pickReactiveState(opponentParty) || this.pickStateByStrategy(strategy, opponentParty);
        var overcommitState = Math.random() < personality.mistakeChance ? this.pickHopelessState(opponentParty) : null;

        for (var i = 0; i < numActions; i++) {
            var targetState = overcommitState || (i === 0 ? focusState : this.pickStateByStrategy(strategy, opponentParty));
            var action = this.chooseAction(strategy, opponentParty, personality, targetState);
            actions.push(action);
            this.executeAction(action, opponentParty);
        }

        return actions;
    },

    chooseAction: function(strategy, party, personality, focusState) {
        var targetState = focusState || this.pickStateByStrategy(strategy, party);
        if (strategy === this.STRATEGY_FUNDRAISE) {
            return { type: 'fundraise', state: this.pickFundraisingState(party) };
        }

        var rallyBias = personality.rallyBias || 0.5;
        var actionType = Math.random() < rallyBias ? 'rally' : 'ad';

        if (typeof Counties !== 'undefined' && Counties.countyData) {
            return {
                type: actionType === 'rally' ? 'county_rally' : 'county_ad',
                state: targetState,
                county: this.pickPriorityCounty(targetState, party)
            };
        }

        return { type: actionType, state: targetState };
    },

    pickStateByStrategy: function(strategy, party) {
        if (strategy === this.STRATEGY_SWING) {
            return this.pickSwingState(party);
        }
        if (strategy === this.STRATEGY_DEFEND) {
            return this.pickDefendState(party);
        }
        if (strategy === this.STRATEGY_EXPAND) {
            return this.pickExpandState(party);
        }
        return this.pickSwingState(party);
    },

    pickReactiveState: function(party) {
        if (!gameData.playerPressure) return null;
        var bestState = null;
        var bestScore = 0;
        for (var stateCode in gameData.playerPressure) {
            var pressure = gameData.playerPressure[stateCode];
            var state = gameData.states[stateCode];
            if (!state) continue;
            var aiMargin = party === 'D' ? state.margin : -state.margin;
            var swingScore = 1 - Math.min(1, Math.abs(aiMargin) / 10);
            var score = pressure * (0.5 + swingScore);
            if (score > bestScore) {
                bestScore = score;
                bestState = stateCode;
            }
        }
        return bestState;
    },

    pickSwingState: function(party) {
        var swingStates = [];
        for (var code in gameData.states) {
            var s = gameData.states[code];
            var aiMargin = party === 'D' ? s.margin : -s.margin;
            if (Math.abs(aiMargin) <= 6) {
                swingStates.push(code);
            }
        }
        if (!swingStates.length) {
            var allCodes = Object.keys(gameData.states);
            return allCodes[Math.floor(Math.random() * allCodes.length)];
        }
        return swingStates[Math.floor(Math.random() * swingStates.length)];
    },

    pickDefendState: function(party) {
        var defendStates = [];
        for (var code in gameData.states) {
            var s = gameData.states[code];
            var aiMargin = party === 'D' ? s.margin : -s.margin;
            if (aiMargin > 0 && aiMargin < 6) {
                defendStates.push(code);
            }
        }
        if (!defendStates.length) return this.pickSwingState(party);
        return defendStates[Math.floor(Math.random() * defendStates.length)];
    },

    pickExpandState: function(party) {
        var expandStates = [];
        for (var code in gameData.states) {
            var s = gameData.states[code];
            var aiMargin = party === 'D' ? s.margin : -s.margin;
            if (aiMargin < 0 && aiMargin > -9) {
                expandStates.push(code);
            }
        }
        if (!expandStates.length) return this.pickSwingState(party);
        return expandStates[Math.floor(Math.random() * expandStates.length)];
    },

    pickHopelessState: function(party) {
        var hopelessStates = [];
        for (var code in gameData.states) {
            var s = gameData.states[code];
            var aiMargin = party === 'D' ? s.margin : -s.margin;
            if (aiMargin < -12) {
                hopelessStates.push(code);
            }
        }
        if (!hopelessStates.length) return this.pickExpandState(party);
        return hopelessStates[Math.floor(Math.random() * hopelessStates.length)];
    },

    pickFundraisingState: function(party) {
        var highValueStates = ['CA', 'NY', 'TX', 'FL', 'IL'];
        return highValueStates[Math.floor(Math.random() * highValueStates.length)];
    },

    pickPriorityCounty: function(stateCode, party) {
        var stateFips = STATES[stateCode] ? STATES[stateCode].fips : null;
        if (!stateFips || !Counties || !Counties.countyData) return null;
        var bestCounty = null;
        var bestScore = -1;

        for (var fips in Counties.countyData) {
            var paddedFips = fips.padStart(5, '0');
            if (paddedFips.substring(0, 2) !== stateFips) continue;
            var county = Counties.countyData[fips];
            if (!county || !county.p) continue;
            var totals = Counties.calculateCountyVoteTotals(county, { reportingFactor: 1, decidedMultiplier: 1, errorFactor: 1 });
            var demVotes = totals.D || 0;
            var repVotes = totals.R || 0;
            var total = demVotes + repVotes;
            if (total <= 0) continue;
            var demPct = (demVotes / total) * 100;
            var repPct = (repVotes / total) * 100;
            var margin = demPct - repPct;
            var aiMargin = party === 'D' ? margin : -margin;
            var swingFactor = 1 - Math.min(1, Math.abs(aiMargin) / 12);
            var score = (county.p || 0) * (0.4 + swingFactor);
            if (score > bestScore) {
                bestScore = score;
                bestCounty = paddedFips;
            }
        }

        return bestCounty;
    },

    applyVpPressure: function(party) {
        var ticket = this.getTicket(party);
        if (!ticket || !ticket.pres || !ticket.vp) return;
        if (!ticket.pres.issuePositions) ticket.pres.issuePositions = {};

        var vpPositions = (typeof CANDIDATE_POSITIONS !== 'undefined') ? CANDIDATE_POSITIONS[ticket.vp.id] : null;
        if (!vpPositions) return;

        var issues = [];
        for (var issueId in vpPositions) {
            var vpPos = vpPositions[issueId];
            var current = ticket.pres.issuePositions[issueId] || 0;
            if (Math.abs(vpPos - current) >= 3) {
                issues.push(issueId);
            }
        }
        if (!issues.length) return;
        var issue = issues[Math.floor(Math.random() * issues.length)];
        var vpTarget = vpPositions[issue] || 0;
        var currentPos = ticket.pres.issuePositions[issue] || 0;
        var shift = vpTarget > currentPos ? 1 : -1;
        ticket.pres.issuePositions[issue] = Math.max(-10, Math.min(10, currentPos + shift));

        if (typeof Utils !== 'undefined') {
            Utils.addLog('OPPONENT UPDATE: ' + ticket.vp.name + ' pressured a shift on ' + issue);
        }
    },

    executeAction: function(action, party) {
        var s = gameData.states[action.state];
        if (!s) return;

        if (action.type === 'county_rally') {
            if (typeof Counties !== 'undefined' && Counties.applyOpponentRallySpillover && action.county) {
                var spill = Counties.applyOpponentRallySpillover(action.county, party);
                if (spill && spill.affectedStates) {
                    for (var stateCode in spill.affectedStates) {
                        Counties.updateStateFromCounties(stateCode);
                    }
                }
            }
            var ticketPres = party === 'D' ? gameData.demTicket.pres : gameData.repTicket.pres;
            if (ticketPres) {
                Utils.addLog('OPPONENT UPDATE: ' + ticketPres.name + ' held a regional rally in ' + s.name);
            }
            return;
        }

        if (action.type === 'county_ad') {
            if (typeof Counties !== 'undefined' && Counties.applyOpponentAdSpillover && action.county) {
                var adSpill = Counties.applyOpponentAdSpillover(action.county, party);
                if (adSpill && adSpill.affectedStates) {
                    for (var adStateCode in adSpill.affectedStates) {
                        Counties.updateStateFromCounties(adStateCode);
                    }
                }
            }
            var adTicketPres = party === 'D' ? gameData.demTicket.pres : gameData.repTicket.pres;
            if (adTicketPres) {
                Utils.addLog('OPPONENT UPDATE: ' + adTicketPres.name + ' ran a targeted media buy in ' + s.name);
            }
            return;
        }

        if (action.type === 'rally') {
            var fallbackCounty = this.pickPriorityCounty(action.state, party);
            if (fallbackCounty && typeof Counties !== 'undefined' && Counties.applyOpponentRallySpillover) {
                var fallbackSpill = Counties.applyOpponentRallySpillover(fallbackCounty, party);
                if (fallbackSpill && fallbackSpill.affectedStates) {
                    for (var fallbackStateCode in fallbackSpill.affectedStates) {
                        Counties.updateStateFromCounties(fallbackStateCode);
                    }
                }
            }
            var rallyPres = party === 'D' ? gameData.demTicket.pres : gameData.repTicket.pres;
            if (rallyPres) {
                Utils.addLog('OPPONENT UPDATE: ' + rallyPres.name + ' held a regional rally in ' + s.name);
            }
            return;
        }

        if (action.type === 'ad') {
            var fallbackAdCounty = this.pickPriorityCounty(action.state, party);
            if (fallbackAdCounty && typeof Counties !== 'undefined' && Counties.applyOpponentAdSpillover) {
                var fallbackAdSpill = Counties.applyOpponentAdSpillover(fallbackAdCounty, party);
                if (fallbackAdSpill && fallbackAdSpill.affectedStates) {
                    for (var fallbackAdStateCode in fallbackAdSpill.affectedStates) {
                        Counties.updateStateFromCounties(fallbackAdStateCode);
                    }
                }
            }
            var adPres = party === 'D' ? gameData.demTicket.pres : gameData.repTicket.pres;
            if (adPres) {
                Utils.addLog('OPPONENT UPDATE: ' + adPres.name + ' ran a targeted media buy in ' + s.name);
            }
            return;
        }

        if (action.type === 'fundraise') {
            var fundPres = party === 'D' ? gameData.demTicket.pres : gameData.repTicket.pres;
            if (fundPres) {
                Utils.addLog('OPPONENT UPDATE: ' + fundPres.name + ' fundraised in ' + s.name);
            }
        }
    }
};
