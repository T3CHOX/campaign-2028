/* ============================================
   DECISION 2028 - OPPONENT AI SYSTEM
   ============================================ */

var OpponentAI = {
    // AI strategy priorities
    STRATEGY_DEFEND: 'defend',
    STRATEGY_SWING: 'swing',
    STRATEGY_EXPAND: 'expand',
    STRATEGY_FUNDRAISE: 'fundraise',
    
    // Determine AI strategy based on game state
    determineStrategy: function(isThirdParty) {
        if (isThirdParty) {
            return this.STRATEGY_EXPAND; // Third parties try to hit 5%
        }
        
        // Check funds
        if (Math.random() < 0.2) { // 20% chance to fundraise
            return this.STRATEGY_FUNDRAISE;
        }
        
        // Otherwise, focus on swing states or defense
        return Math.random() < 0.6 ? this.STRATEGY_SWING : this.STRATEGY_DEFEND;
    },
    
    // Execute AI turn for an opponent
    executeTurn: function(opponentParty, stamina) {
        var actions = [];
        var strategy = this.determineStrategy(Utils.isThirdParty(opponentParty));
        
        // AI gets actions based on stamina
        var numActions = Math.floor(stamina * 0.75); // AI gets slightly fewer actions
        
        for (var i = 0; i < numActions; i++) {
            var action = this.chooseAction(strategy, opponentParty);
            actions.push(action);
            this.executeAction(action, opponentParty);
        }
        
        return actions;
    },
    
    // Choose an action based on strategy
    chooseAction: function(strategy, party) {
        var stateCodes = Object.keys(gameData.states);
        var targetState = null;
        
        if (strategy === this.STRATEGY_FUNDRAISE) {
            // Pick high-value fundraising state
            targetState = this.pickFundraisingState(party);
            return { type: 'fundraise', state: targetState };
        }
        
        if (strategy === this.STRATEGY_SWING) {
            // Pick swing state
            targetState = this.pickSwingState(party);
        } else {
            // Pick random state to campaign in
            targetState = stateCodes[Math.floor(Math.random() * stateCodes.length)];
        }
        
        // Randomly choose between rally and ad
        var actionType = Math.random() < 0.6 ? 'rally' : 'ad';
        return { type: actionType, state: targetState };
    },
    
    // Pick a swing state (within ±5 margin)
    pickSwingState: function(party) {
        var swingStates = [];
        for (var code in gameData.states) {
            var s = gameData.states[code];
            if (Math.abs(s.margin) <= 5) {
                swingStates.push(code);
            }
        }
        
        if (swingStates.length === 0) {
            var allCodes = Object.keys(gameData.states);
            return allCodes[Math.floor(Math.random() * allCodes.length)];
        }
        
        return swingStates[Math.floor(Math.random() * swingStates.length)];
    },
    
    // Pick a high-value fundraising state
    pickFundraisingState: function(party) {
        var highValueStates = ['CA', 'NY', 'TX', 'FL', 'IL'];
        return highValueStates[Math.floor(Math.random() * highValueStates.length)];
    },
    
    // Execute an AI action
    executeAction: function(action, party) {
        var s = gameData.states[action.state];
        if (!s) return;
        
        if (action.type === 'rally') {
            // Rally effect - apply to all counties in the state
            if (typeof Counties !== 'undefined' && Counties.countyData) {
                var stateFips = STATES[action.state] ? STATES[action.state].fips : null;
                if (stateFips) {
                    for (var fips in Counties.countyData) {
                        var paddedFips = fips.padStart(5, '0');
                        if (paddedFips.substring(0, 2) === stateFips) {
                            var county = Counties.countyData[fips];
                            if (!county.turnout) county.turnout = { player: 1.0, demOpponent: 1.0, repOpponent: 1.0, thirdParty: 0.7 };
                            
                            // AI rally gives 3-8% turnout boost per county
                            var countyRallyBoost = 0.03 + Math.random() * 0.05;
                            
                            if (party === 'D') {
                                county.turnout.demOpponent = Math.min(1.3, (county.turnout.demOpponent || 1.0) + countyRallyBoost);
                            } else if (party === 'R') {
                                county.turnout.repOpponent = Math.min(1.3, (county.turnout.repOpponent || 1.0) + countyRallyBoost);
                            } else {
                                // Third party effect is minimal
                                county.turnout.thirdParty = Math.min(1.3, (county.turnout.thirdParty || 0.7) + (countyRallyBoost * 0.15));
                            }
                        }
                    }
                    
                    // Update state margin from county data
                    Counties.updateStateFromCounties(action.state);
                }
            }
            
            // Log the action
            var ticketPres = party === 'D' ? gameData.demTicket.pres : gameData.repTicket.pres;
            if (ticketPres) {
                Utils.addLog('OPPONENT UPDATE: ' + ticketPres.name + ' held rally in ' + s.name);
            }
        } else if (action.type === 'ad') {
            // Ad blitz effect - apply to all counties in the state
            if (typeof Counties !== 'undefined' && Counties.countyData) {
                var stateFips = STATES[action.state] ? STATES[action.state].fips : null;
                if (stateFips) {
                    for (var fips in Counties.countyData) {
                        var paddedFips = fips.padStart(5, '0');
                        if (paddedFips.substring(0, 2) === stateFips) {
                            var county = Counties.countyData[fips];
                            if (!county.turnout) county.turnout = { player: 1.0, demOpponent: 1.0, repOpponent: 1.0, thirdParty: 0.7 };
                            
                            // AI ad blitz gives 0.5-1% turnout boost per county
                            var countyAdBoost = 0.005 + Math.random() * 0.005;
                            
                            if (party === 'D') {
                                county.turnout.demOpponent = Math.min(1.3, (county.turnout.demOpponent || 1.0) + countyAdBoost);
                            } else if (party === 'R') {
                                county.turnout.repOpponent = Math.min(1.3, (county.turnout.repOpponent || 1.0) + countyAdBoost);
                            }
                        }
                    }
                    
                    // Update state margin from county data
                    Counties.updateStateFromCounties(action.state);
                }
            }
            
            var ticketPres = party === 'D' ? gameData.demTicket.pres : gameData.repTicket.pres;
            if (ticketPres) {
                Utils.addLog('OPPONENT UPDATE: ' + ticketPres.name + ' ran ad blitz in ' + s.name);
            }
        } else if (action.type === 'fundraise') {
            // Fundraising doesn't affect margins but noted in log
            var ticketPres = party === 'D' ? gameData.demTicket.pres : gameData.repTicket.pres;
            if (ticketPres) {
                Utils.addLog('OPPONENT UPDATE: ' + ticketPres.name + ' fundraised in ' + s.name);
            }
        }
    }
};
