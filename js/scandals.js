/* ============================================
   DECISION 2028 - SCANDAL & OPPO RESEARCH (v2)
   ============================================ */

var Scandals = {
    activeScandals: [],
    pendingReveals: [],

    GENERIC_SCANDAL_POOL: [
        'Financial irregularity uncovered',
        'Staff misconduct allegations',
        'Policy flip-flop exposed',
        'Campaign finance irregularity',
        'Past statement controversy surfaces',
        'Donor relationship questions',
        'Travel expense scrutiny',
        'Leaked internal memo'
    ],

    rollOppoResearch: function(opponentParty) {
        // Check cooldown
        if (!this.canTargetOpponent(opponentParty)) {
            Utils.showToast('Cannot target ' + PARTIES[opponentParty].shortName + ' this week (cooldown)');
            return false;
        }

        var opponent = this.getOpponentCandidate(opponentParty);
        if (!opponent) {
            Utils.showToast('No opponent found');
            return false;
        }

        // Check stack cap
        var activeCount = 0;
        for (var i = 0; i < this.activeScandals.length; i++) {
            if (this.activeScandals[i].targetParty === opponentParty) activeCount++;
        }
        if (activeCount >= 2) {
            Utils.showToast('Target already has max scandals (2)');
            Utils.addLog('Oppo research failed — ' + opponent.name + ' already has 2 active scandals');
            return false;
        }

        var resistance = opponent.scandalResistance || 0.3;
        var threshold = 55 - (resistance * 20);
        var roll = Math.floor(Math.random() * 100) + 1;

        Utils.addLog('🔍 Oppo research vs ' + opponent.name + ': rolled ' + roll + ' (need ≤' + threshold.toFixed(0) + ')');

        // Set cooldown
        gameData.oppoResearchCooldown[opponentParty] = true;

        if (roll <= threshold) {
            // Success — queue scandal for next week
            var tier = this.getRandomTier();
            var description = this.getRandomScandalDescription();

            this.pendingReveals.push({
                targetParty: opponentParty,
                targetName: opponent.name,
                tier: tier,
                description: description
            });

            Utils.addLog('✅ Oppo research SUCCESS — scandal queued for reveal next week');
            Utils.showToast('🔍 Oppo research succeeded!');
            return true;
        } else {
            // Failure
            Utils.addLog('❌ Oppo research failed — no dirt found');
            Utils.showToast('🔍 Oppo research failed');

            // 10% chance leak damages player
            if (Math.random() < 0.10) {
                Campaign.adjustFavorability(-0.01, 'Failed oppo research attempt leaked');
                Utils.addLog('⚠️ Failed oppo attempt leaked to press! Favorability -1%');
            }
            return false;
        }
    },

    revealPendingScandals: function() {
        while (this.pendingReveals.length > 0) {
            var pending = this.pendingReveals.shift();
            this.revealScandal(pending.targetParty, pending.tier, pending.description, pending.targetName);
        }
    },

    revealScandal: function(targetParty, tier, description, targetName) {
        var opponent = this.getOpponentCandidate(targetParty);
        var resistance = opponent ? (opponent.scandalResistance || 0.3) : 0.3;
        var name = targetName || (opponent ? opponent.name : PARTIES[targetParty].shortName);

        var effects = this.getScandalEffects(tier, resistance);

        var scandal = {
            targetParty: targetParty,
            targetName: name,
            tier: tier,
            description: description,
            weeksRemaining: effects.duration,
            favPenalty: effects.favPenalty,
            groupEffects: effects.groupEffects,
            leakageDouble: effects.leakageDouble
        };

        this.activeScandals.push(scandal);
        this.applyScandalEffects(scandal);

        Utils.addLog('💣 SCANDAL (Tier ' + tier + '): ' + name + ' — ' + description);
        Utils.showToast('💣 Scandal hits ' + name + '!');
    },

    getScandalEffects: function(tier, resistance) {
        var highResistance = resistance >= 0.7;

        if (tier === 1) {
            return {
                favPenalty: highResistance ? -0.01 : -0.02,
                duration: highResistance ? 0 : 1,
                groupEffects: [],
                leakageDouble: false
            };
        } else if (tier === 2) {
            var groupPool = ['centrists', 'suburban_women', 'college', 'urban', 'union'];
            var affectedGroup = groupPool[Math.floor(Math.random() * groupPool.length)];
            var scale = highResistance ? 0.60 : 1.0;
            return {
                favPenalty: -0.04 * scale,
                duration: 2,
                groupEffects: [{ group: affectedGroup, loyaltyDrop: -0.08 * scale }],
                leakageDouble: false
            };
        } else { // Tier 3
            var groups = ['college', 'suburban_women', 'centrists', 'union', 'urban', 'women'];
            var shuffled = Utils.shuffleArray(groups.slice());
            var scale3 = highResistance ? 0.80 : 1.0;
            return {
                favPenalty: -0.07 * scale3,
                duration: 2,
                groupEffects: [
                    { group: shuffled[0], loyaltyDrop: -0.08 * scale3 },
                    { group: shuffled[1], loyaltyDrop: -0.06 * scale3 }
                ],
                leakageDouble: true
            };
        }
    },

    applyScandalEffects: function(scandal) {
        // Note: scandals affect opponents, not the player
        // We don't have a direct opponent favorability system, so we convert to player benefit
        // The scandal hurts the opponent → effectively helps the player
        var playerBenefit = Math.abs(scandal.favPenalty) * 0.5;
        Campaign.adjustFavorability(playerBenefit, 'Opponent scandal: ' + scandal.description);

        // Apply group loyalty effects
        if (scandal.groupEffects && typeof applyCampaignGroupSwing === 'function') {
            for (var i = 0; i < scandal.groupEffects.length; i++) {
                var ge = scandal.groupEffects[i];
                // Opponent loses group support → player gains some
                applyCampaignGroupSwing(ge.group, Math.abs(ge.loyaltyDrop) * 0.5);
            }
        }

        // Tier 3: apply national poll shift
        if (scandal.tier === 3 && typeof Counties !== 'undefined' && Counties.countyData) {
            var shift = 0.015; // 1.5% national shift
            for (var fips in Counties.countyData) {
                var county = Counties.countyData[fips];
                if (!county || !county.v) continue;

                if (scandal.targetParty === 'D') {
                    county.v.D = Math.max(1, county.v.D - shift);
                    county.v.R = Math.min(100, county.v.R + shift * 0.7);
                } else if (scandal.targetParty === 'R') {
                    county.v.R = Math.max(1, county.v.R - shift);
                    county.v.D = Math.min(100, county.v.D + shift * 0.7);
                }
            }
            for (var code in gameData.states) {
                Counties.updateStateFromCounties(code);
            }
        }
    },

    processActiveScandals: function() {
        // Reveal any pending scandals from last week's oppo research
        this.revealPendingScandals();

        // Clear oppo research cooldowns for next week
        gameData.oppoResearchCooldown = {};

        // Decrement durations and remove expired
        var updated = [];
        for (var i = 0; i < this.activeScandals.length; i++) {
            var scandal = this.activeScandals[i];
            scandal.weeksRemaining--;
            if (scandal.weeksRemaining > 0) {
                updated.push(scandal);
            } else {
                Utils.addLog('📰 Scandal fades: ' + scandal.description);
            }
        }
        this.activeScandals = updated;
    },

    getOpponentCandidate: function(party) {
        if (party === 'D' && gameData.demTicket) return gameData.demTicket.pres;
        if (party === 'R' && gameData.repTicket) return gameData.repTicket.pres;
        if (gameData.thirdTickets && gameData.thirdTickets[party]) return gameData.thirdTickets[party].pres;
        return null;
    },

    canTargetOpponent: function(party) {
        // Check cooldown
        if (gameData.oppoResearchCooldown && gameData.oppoResearchCooldown[party]) {
            return false;
        }
        // Check stack cap
        var activeCount = 0;
        for (var i = 0; i < this.activeScandals.length; i++) {
            if (this.activeScandals[i].targetParty === party) activeCount++;
        }
        return activeCount < 2;
    },

    getRandomScandalDescription: function() {
        return this.GENERIC_SCANDAL_POOL[Math.floor(Math.random() * this.GENERIC_SCANDAL_POOL.length)];
    },

    getRandomTier: function() {
        var roll = Math.random();
        if (roll < 0.50) return 1;       // 50% Tier 1
        if (roll < 0.85) return 2;       // 35% Tier 2
        return 3;                         // 15% Tier 3
    }
};
