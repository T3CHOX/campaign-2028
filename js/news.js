/* ============================================
   DECISION 2028 - NEWS & EVENTS ENGINE (v2)
   ============================================ */

var News = {
    EVENT_WEIGHTS: {
        neutral: 35,
        opponentGaffe: 15,
        playerGaffe: 15,
        nationalCrisis: 8,
        economicReport: 10,
        thirdPartySurge: 5,
        internationalEvent: 7,
        endorsementDrop: 10
    },

    lingeringEffects: [],

    CRISIS_TYPES: [
        { id: 'recession', label: 'Economic Recession Report', issue: 'economy', direction: 'incumbent_hurt' },
        { id: 'military', label: 'Foreign Military Escalation', issue: 'foreign', direction: 'hawk_gain' },
        { id: 'environment', label: 'Environmental Disaster', issue: 'climate', direction: 'left_gain' },
        { id: 'shooting', label: 'Mass Shooting', issue: 'guns', direction: 'left_gain' },
        { id: 'inflation', label: 'Inflation Spike', issue: 'economy', direction: 'incumbent_hurt' },
        { id: 'border', label: 'Border Crisis', issue: 'immigration', direction: 'right_gain' }
    ],

    processWeeklyEvent: function() {
        // Process lingering effects from previous weeks
        this.processLingeringEffects();

        // Draw and resolve a new event
        var eventType = this.drawEvent();
        console.log('News cycle: ' + eventType);

        switch (eventType) {
            case 'neutral': this.resolveNeutralWeek(); break;
            case 'opponentGaffe': this.resolveOpponentGaffe(); break;
            case 'playerGaffe': this.resolvePlayerGaffe(); break;
            case 'nationalCrisis': this.resolveNationalCrisis(); break;
            case 'economicReport': this.resolveEconomicReport(); break;
            case 'thirdPartySurge': this.resolveThirdPartySurge(); break;
            case 'internationalEvent': this.resolveInternationalEvent(); break;
            case 'endorsementDrop': this.resolveEndorsementDrop(); break;
        }

        // Check free media momentum bonus
        this.checkFreeMediaBonus();
    },

    drawEvent: function() {
        var weights = this.EVENT_WEIGHTS;
        var entries = [];
        for (var key in weights) {
            entries.push({ type: key, weight: weights[key] });
        }
        var totalWeight = 0;
        for (var i = 0; i < entries.length; i++) totalWeight += entries[i].weight;

        var roll = Math.random() * totalWeight;
        var cumulative = 0;
        for (var j = 0; j < entries.length; j++) {
            cumulative += entries[j].weight;
            if (roll < cumulative) return entries[j].type;
        }
        return 'neutral';
    },

    resolveNeutralWeek: function() {
        Utils.addLog('📰 Quiet news week — no major events.');
    },

    resolveOpponentGaffe: function() {
        this.resolveGaffe(false);
    },

    resolvePlayerGaffe: function() {
        this.resolveGaffe(true);
    },

    resolveGaffe: function(isPlayer) {
        var target;
        var targetName;
        if (isPlayer) {
            target = gameData.candidate;
            targetName = target ? target.name : 'Player';
        } else {
            // Pick a random opponent
            var opponents = [];
            if (gameData.selectedParty !== 'D' && gameData.demTicket && gameData.demTicket.pres) {
                opponents.push({ cand: gameData.demTicket.pres, party: 'D' });
            }
            if (gameData.selectedParty !== 'R' && gameData.repTicket && gameData.repTicket.pres) {
                opponents.push({ cand: gameData.repTicket.pres, party: 'R' });
            }
            if (opponents.length === 0) return;
            var pick = opponents[Math.floor(Math.random() * opponents.length)];
            target = pick.cand;
            targetName = target ? target.name : PARTIES[pick.party].shortName;
        }

        // Select a random issue
        var issueSource = (typeof CORE_ISSUES !== 'undefined') ? CORE_ISSUES : ISSUES;
        var lockedKeys = Object.keys(gameData.lockedIssues || {});
        var issuePool = lockedKeys.length > 0 ? lockedKeys : issueSource.map(function(i) { return i.id; });
        var issueId = issuePool[Math.floor(Math.random() * issuePool.length)];
        var issue = issueSource.find(function(i) { return i.id === issueId; });
        var issueName = issue ? issue.name : issueId;

        // Calculate favorability hit
        var favHit = -(0.02 + Math.random() * 0.03);

        // Apply scandal resistance
        var resistance = target ? (target.scandalResistance || 0) : 0;
        if (resistance > 0.5) {
            favHit *= 0.5;
        }

        if (isPlayer) {
            Campaign.adjustFavorability(favHit, 'Gaffe on ' + issueName);
            gameData.campaignMomentum = Math.max(-1, gameData.campaignMomentum - 0.03);
            Utils.showToast('📰 Campaign gaffe on ' + issueName + '!');
            Utils.addLog('📰 GAFFE: ' + targetName + ' stumbles on ' + issueName + ' (Favorability ' + Math.round(favHit * 100) + '%)');
        } else {
            // Opponent gaffe benefits player
            gameData.campaignMomentum = Math.min(1, gameData.campaignMomentum + 0.03);
            Utils.showToast('📰 Opponent gaffe: ' + targetName + ' on ' + issueName);
            Utils.addLog('📰 OPPONENT GAFFE: ' + targetName + ' stumbles on ' + issueName + ' — momentum boost!');
        }

        // Add lingering effect (-0.01 next week)
        this.lingeringEffects.push({
            type: 'gaffe_linger',
            target: isPlayer ? 'player' : 'opponent',
            effect: -0.01,
            weeksRemaining: 1,
            label: issueName + ' gaffe aftermath'
        });
    },

    resolveNationalCrisis: function() {
        var crisis = this.CRISIS_TYPES[Math.floor(Math.random() * this.CRISIS_TYPES.length)];
        var magnitude = 0.005 + Math.random() * 0.01; // 0.5% to 1.5%

        Utils.addLog('🚨 NATIONAL CRISIS: ' + crisis.label);
        Utils.showToast('🚨 ' + crisis.label + ' — national impact!');

        // Apply county-level effects based on crisis direction
        if (typeof Counties !== 'undefined' && Counties.countyData) {
            for (var fips in Counties.countyData) {
                var county = Counties.countyData[fips];
                if (!county || !county.v) continue;

                var shift = magnitude;
                if (crisis.direction === 'left_gain') {
                    county.v.D = Math.min(100, county.v.D + shift);
                    county.v.R = Math.max(0, county.v.R - shift);
                } else if (crisis.direction === 'right_gain') {
                    county.v.R = Math.min(100, county.v.R + shift);
                    county.v.D = Math.max(0, county.v.D - shift);
                } else if (crisis.direction === 'incumbent_hurt') {
                    // Challenger (player or opponent) gains; incumbent party suffers
                    county.v.D = Math.max(0, county.v.D - shift * 0.5);
                    county.v.R = Math.max(0, county.v.R - shift * 0.5);
                } else if (crisis.direction === 'hawk_gain') {
                    // Candidates with high foreign policy score benefit
                    var playerPos = 0;
                    if (gameData.candidate && CANDIDATE_POSITIONS[gameData.candidate.id]) {
                        playerPos = CANDIDATE_POSITIONS[gameData.candidate.id].foreign || 0;
                    }
                    if (playerPos > 3) {
                        county.v[gameData.selectedParty] = Math.min(100, (county.v[gameData.selectedParty] || 0) + shift * 0.5);
                    }
                }
            }
            // Update state margins
            for (var code in gameData.states) {
                Counties.updateStateFromCounties(code);
            }
        }

        // Adjust all candidates' favorability
        Campaign.adjustFavorability(
            (crisis.direction === 'left_gain' && gameData.selectedParty === 'D') ? 0.03 :
            (crisis.direction === 'right_gain' && gameData.selectedParty === 'R') ? 0.03 : -0.03,
            crisis.label
        );
    },

    resolveEconomicReport: function() {
        var positive = Math.random() > 0.5;
        var label = positive ? 'Positive Economic Report' : 'Negative Economic Report';
        var playerIsIncumbent = gameData.selectedParty === 'D'; // Simplification: D as incumbent

        var favDelta = positive ? 0.02 : -0.02;
        if (!playerIsIncumbent) favDelta *= -1; // Challenger benefits from bad economy

        Campaign.adjustFavorability(favDelta, label);
        Utils.addLog('📊 ' + label + ' — ' + (favDelta > 0 ? 'boost' : 'drag') + ' for campaign');
        Utils.showToast('📊 ' + label);
    },

    resolveThirdPartySurge: function() {
        if (!gameData.thirdPartiesEnabled) {
            this.resolveNeutralWeek();
            return;
        }

        Utils.addLog('📰 Third-party polling surge detected!');
        Utils.showToast('📰 Third-party surge in polls!');

        // Apply +1.5% nationally to third parties, leaking from D and R
        if (typeof Counties !== 'undefined' && Counties.countyData) {
            for (var fips in Counties.countyData) {
                var county = Counties.countyData[fips];
                if (!county || !county.v) continue;
                var thirdPartyShift = 0.015;
                county.v.D = Math.max(1, county.v.D - thirdPartyShift * 0.5);
                county.v.R = Math.max(1, county.v.R - thirdPartyShift * 0.5);
                // Distribute to active third parties
                for (var tp in gameData.thirdTickets) {
                    if (county.v[tp] !== undefined) {
                        county.v[tp] = Math.min(35, county.v[tp] + thirdPartyShift * 0.3);
                    }
                }
            }
            for (var code in gameData.states) {
                Counties.updateStateFromCounties(code);
            }
        }
    },

    resolveInternationalEvent: function() {
        Utils.addLog('🌍 International event shifts foreign policy salience');
        Utils.showToast('🌍 International event impacts campaign');

        // Candidate with strongest foreign policy position gains
        var playerPos = 0;
        if (gameData.candidate && CANDIDATE_POSITIONS[gameData.candidate.id]) {
            playerPos = Math.abs(CANDIDATE_POSITIONS[gameData.candidate.id].foreign || 0);
        }
        var favBoost = playerPos > 5 ? 0.02 : (playerPos > 3 ? 0.01 : -0.01);
        Campaign.adjustFavorability(favBoost, 'International event response');
    },

    resolveEndorsementDrop: function() {
        if (typeof Endorsements !== 'undefined' && Endorsements.processEndorsementDrop) {
            Endorsements.processEndorsementDrop();
        } else {
            // Fallback: simple favorability boost
            Campaign.adjustFavorability(0.02, 'Endorsement received');
            Utils.addLog('📰 Campaign receives a key endorsement!');
            Utils.showToast('📰 New endorsement boosts campaign!');
        }
    },

    checkFreeMediaBonus: function() {
        if (typeof MOMENTUM_CONSTANTS === 'undefined') return;
        if (gameData.campaignMomentum > MOMENTUM_CONSTANTS.FREE_MEDIA_THRESHOLD && !gameData.freeMediaUsed) {
            gameData.freeMediaUsed = true;

            // Find top swing state
            var bestState = null;
            var bestEV = 0;
            for (var code in gameData.states) {
                var s = gameData.states[code];
                if (Math.abs(s.margin) < 6 && s.ev > bestEV) {
                    bestEV = s.ev;
                    bestState = code;
                }
            }

            if (bestState && typeof Counties !== 'undefined' && Counties.countyData) {
                var stateFips = STATES[bestState].fips;
                for (var fips in Counties.countyData) {
                    var paddedFips = fips.padStart(5, '0');
                    if (paddedFips.substring(0, 2) === stateFips) {
                        var county = Counties.countyData[fips];
                        if (!county || !county.v) continue;
                        // 50% of normal AD effect
                        var delta = PERSUASION_CONSTANTS.BASE_PERSUASION_AD * 0.5;
                        if (gameData.selectedParty === 'D') {
                            county.v.D = Math.min(100, county.v.D + delta);
                            county.v.R = Math.max(0, county.v.R - delta);
                        } else if (gameData.selectedParty === 'R') {
                            county.v.R = Math.min(100, county.v.R + delta);
                            county.v.D = Math.max(0, county.v.D - delta);
                        }
                    }
                }
                Counties.updateStateFromCounties(bestState);
                Utils.addLog('📺 FREE MEDIA: Momentum earns free ad coverage in ' + gameData.states[bestState].name);
                Utils.showToast('📺 Free media boost in ' + gameData.states[bestState].name + '!');
            }
        }

        // Reset free media flag when momentum drops
        if (gameData.campaignMomentum < MOMENTUM_CONSTANTS.FREE_MEDIA_RESET) {
            gameData.freeMediaUsed = false;
        }
    },

    processLingeringEffects: function() {
        var updated = [];
        for (var i = 0; i < this.lingeringEffects.length; i++) {
            var effect = this.lingeringEffects[i];
            if (effect.weeksRemaining > 0) {
                // Apply the lingering effect
                if (effect.target === 'player' && effect.effect) {
                    Campaign.adjustFavorability(effect.effect, effect.label + ' (lingering)');
                }
                effect.weeksRemaining--;
                if (effect.weeksRemaining > 0) {
                    updated.push(effect);
                }
            }
        }
        this.lingeringEffects = updated;
    },

    getEventDescription: function(eventType) {
        var descriptions = {
            neutral: 'Quiet news week',
            opponentGaffe: 'Opponent gaffe dominates news cycle',
            playerGaffe: 'Campaign gaffe makes headlines',
            nationalCrisis: 'National crisis reshapes race',
            economicReport: 'Economic data shifts narrative',
            thirdPartySurge: 'Third-party polling surge',
            internationalEvent: 'International event impacts campaign',
            endorsementDrop: 'Major endorsement announcement'
        };
        return descriptions[eventType] || 'News event';
    }
};
