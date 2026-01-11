/* ============================================
   DECISION 2028 - TURNOUT SYSTEM
   ============================================ */

var Turnout = {
    // Calculate turnout for a county
    calculateCountyTurnout: function(county, candidate) {
        var turnout = county.turnout[candidate] || 1.0;
        // Cap at 1.5
        return Math.min(1.5, turnout);
    },
    
    // Apply turnout modifier to a county
    applyModifier: function(county, candidate, amount) {
        if (!county.turnout) {
            county.turnout = { player: 1.0, demOpponent: 1.0, repOpponent: 1.0, thirdParty: 0.7 };
        }
        county.turnout[candidate] = Math.min(1.5, (county.turnout[candidate] || 1.0) + amount);
    },
    
    // Get descriptive text for turnout level
    getTurnoutDescription: function(turnout) {
        if (turnout >= 1.3) return 'Strong';
        if (turnout >= 1.1) return 'Good';
        if (turnout >= 0.9) return 'Moderate';
        if (turnout >= 0.7) return 'Weak';
        return 'Very Weak';
    },
    
    // Calculate state-wide aggregate turnout
    getStateTurnout: function(stateCode, candidate) {
        // Placeholder - would aggregate county turnouts
        return 1.0;
    },
    
    // Apply rally modifier to county and adjacent counties
    applyRallyEffect: function(county, adjacentCounties, candidate) {
        var mainBoost = 0.02 + Math.random() * 0.03; // 0.02 to 0.05
        this.applyModifier(county, candidate, mainBoost);
        
        // Apply +0.01 to adjacent counties
        for (var i = 0; i < adjacentCounties.length; i++) {
            this.applyModifier(adjacentCounties[i], candidate, 0.01);
        }
    },
    
    // Apply issue campaign effect
    applyIssueCampaignEffect: function(county, alignment, candidate, opponentCandidate) {
        if (alignment < 3) {
            // Good match
            var boost = 0.02 + Math.random() * 0.02;
            this.applyModifier(county, candidate, boost);
        } else if (alignment > 5) {
            // Bad match
            var hurt = -(0.01 + Math.random() * 0.02);
            this.applyModifier(county, candidate, hurt);
            var opponentBoost = 0.02 + Math.random() * 0.02;
            this.applyModifier(county, opponentCandidate, opponentBoost);
        } else {
            // Neutral - minimal effect
            this.applyModifier(county, candidate, 0.01);
        }
    },
    
    // Calculate final vote count with turnout
    calculateFinalVotes: function(baseVotes, turnout) {
        return Math.floor(baseVotes * turnout);
    }
};
