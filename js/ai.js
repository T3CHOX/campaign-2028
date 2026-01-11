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
        
        var effect = 0.5 + Math.random() * 1.5;
        
        if (action.type === 'rally') {
            // Rally effect
            if (party === 'D') {
                s.margin += effect;
            } else if (party === 'R') {
                s.margin -= effect;
            } else {
                // Third party effect is minimal
                effect *= 0.15;
                if (Math.random() < 0.5) s.margin += effect;
                else s.margin -= effect;
            }
            
            // Log the action
            var ticketPres = party === 'D' ? gameData.demTicket.pres : gameData.repTicket.pres;
            if (ticketPres) {
                Utils.addLog('OPPONENT UPDATE: ' + ticketPres.name + ' held rally in ' + s.name);
            }
        } else if (action.type === 'ad') {
            // Ad blitz effect
            if (party === 'D') {
                s.margin += effect;
            } else if (party === 'R') {
                s.margin -= effect;
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
