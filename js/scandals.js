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
        // Process weekly Oppo Research resource allocations
        this.processWeeklyAllocations();

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

    RESEARCH_CATEGORIES: {
        financial: {
            id: 'financial',
            title: 'Financial & Tax Audit',
            icon: 'fa-solid fa-file-invoice-dollar',
            desc: 'Investigate business holdings, tax disclosures, offshore accounts, and corporate donors.',
            levels: [
                { level: 0, name: 'Inactive', costFunds: 0, costEnergy: 0, baseChance: 0 },
                { level: 1, name: 'Low ($1M/wk, 1 En)', costFunds: 1.0, costEnergy: 1, baseChance: 30 },
                { level: 2, name: 'Med ($2.5M/wk, 1 En)', costFunds: 2.5, costEnergy: 1, baseChance: 55 },
                { level: 3, name: 'High ($4.0M/wk, 2 En)', costFunds: 4.0, costEnergy: 2, baseChance: 80 }
            ],
            targetTiers: [1, 2, 3],
            pool: [
                'Financial irregularity uncovered in tax filings',
                'Conflict of interest with offshore holdings revealed',
                'Unreported real estate transaction questioned by press',
                'Questionable campaign donor relationship surfaced'
            ]
        },
        policy: {
            id: 'policy',
            title: 'Voting Record & Policy Flip-Flops',
            icon: 'fa-solid fa-scroll',
            desc: 'Archive floor votes, legislative amendments, and past interviews for policy contradictions.',
            levels: [
                { level: 0, name: 'Inactive', costFunds: 0, costEnergy: 0, baseChance: 0 },
                { level: 1, name: 'Low ($0.5M/wk, 1 En)', costFunds: 0.5, costEnergy: 1, baseChance: 35 },
                { level: 2, name: 'Med ($1.5M/wk, 1 En)', costFunds: 1.5, costEnergy: 1, baseChance: 60 },
                { level: 3, name: 'High ($3.0M/wk, 2 En)', costFunds: 3.0, costEnergy: 2, baseChance: 85 }
            ],
            targetTiers: [1, 2],
            pool: [
                'Blatant policy flip-flop audio unearthed',
                'Contradictory vote on economic regulation exposed',
                'Archived interview undermines candidate core promise',
                'Secret lobbyist meeting notes leaked to media'
            ]
        },
        personal: {
            id: 'personal',
            title: 'Personal History & Vetting',
            icon: 'fa-solid fa-user-shield',
            desc: 'Deep background check into past employment, unvetted audio/video, and character controversies.',
            levels: [
                { level: 0, name: 'Inactive', costFunds: 0, costEnergy: 0, baseChance: 0 },
                { level: 1, name: 'Low ($1.0M/wk, 1 En)', costFunds: 1.0, costEnergy: 1, baseChance: 25 },
                { level: 2, name: 'Med ($2.0M/wk, 2 En)', costFunds: 2.0, costEnergy: 2, baseChance: 50 },
                { level: 3, name: 'High ($3.5M/wk, 2 En)', costFunds: 3.5, costEnergy: 2, baseChance: 75 }
            ],
            targetTiers: [2, 3],
            pool: [
                'Explosive personal conduct controversy surfaces',
                'Past unvetted statement causes major media backlash',
                'Off-the-record audio leaks creating national headline',
                'Severe character dispute triggers debate scrutiny'
            ]
        },
        campaign: {
            id: 'campaign',
            title: 'Campaign Finance & Super PACs',
            icon: 'fa-solid fa-building-columns',
            desc: 'Audit Super PAC coordination, dark money donors, and campaign staff compliance.',
            levels: [
                { level: 0, name: 'Inactive', costFunds: 0, costEnergy: 0, baseChance: 0 },
                { level: 1, name: 'Low ($0.5M/wk, 1 En)', costFunds: 0.5, costEnergy: 1, baseChance: 35 },
                { level: 2, name: 'Med ($1.0M/wk, 1 En)', costFunds: 1.0, costEnergy: 1, baseChance: 60 },
                { level: 3, name: 'High ($2.5M/wk, 2 En)', costFunds: 2.5, costEnergy: 2, baseChance: 80 }
            ],
            targetTiers: [1, 2],
            pool: [
                'Leaked internal campaign strategy memo',
                'Staff dispute over dark money Super PAC coordination',
                'Campaign finance compliance warning issued',
                'Internal field operation numbers leak revealing weakness'
            ]
        }
    },

    processWeeklyAllocations: function() {
        if (!gameData.oppoResearchAllocations) return;
        var targetParty = gameData.oppoResearchAllocations.targetParty || (gameData.selectedParty === 'D' ? 'R' : 'D');
        var levels = gameData.oppoResearchAllocations.levels || {};

        var totalFunds = 0;
        var totalEnergy = 0;
        var activeCats = [];

        for (var catId in levels) {
            var lvl = levels[catId] || 0;
            if (lvl > 0 && this.RESEARCH_CATEGORIES[catId]) {
                var cat = this.RESEARCH_CATEGORIES[catId];
                var lvlInfo = cat.levels[lvl] || cat.levels[0];
                totalFunds += lvlInfo.costFunds;
                totalEnergy += lvlInfo.costEnergy;
                activeCats.push({ cat: cat, lvlInfo: lvlInfo, lvl: lvl });
            }
        }

        if (activeCats.length === 0) return;

        // Check resources
        if (gameData.funds < totalFunds || gameData.energy < totalEnergy) {
            Utils.addLog('⚠️ Insufficient campaign resources ($' + totalFunds.toFixed(1) + 'M / ' + totalEnergy + ' En required) for Oppo Research weekly operations.');
            Utils.showToast('⚠️ Oppo Research paused due to low funds/energy');
            return;
        }

        // Deduct resources
        gameData.funds = Math.max(0, gameData.funds - totalFunds);
        gameData.energy = Math.max(0, gameData.energy - totalEnergy);
        if (typeof Campaign !== 'undefined' && Campaign.updateHUD) Campaign.updateHUD();

        var opponent = this.getOpponentCandidate(targetParty);
        var opponentName = opponent ? opponent.name : (typeof PARTIES !== 'undefined' && PARTIES[targetParty] ? PARTIES[targetParty].shortName : targetParty);
        var resistance = opponent ? (opponent.scandalResistance || 0.3) : 0.3;

        Utils.addLog('🔍 Executing weekly Oppo Research against ' + opponentName + ' ($' + totalFunds.toFixed(1) + 'M, ' + totalEnergy + ' En spent)');

        var successCount = 0;

        for (var i = 0; i < activeCats.length; i++) {
            var item = activeCats[i];
            var baseChance = item.lvlInfo.baseChance;
            var netChance = Math.max(10, Math.min(95, baseChance - (resistance * 15)));
            var roll = Math.floor(Math.random() * 100) + 1;

            if (roll <= netChance) {
                successCount++;
                var tiers = item.cat.targetTiers;
                var tier = tiers[Math.floor(Math.random() * tiers.length)];
                var pool = item.cat.pool;
                var desc = pool[Math.floor(Math.random() * pool.length)];

                this.pendingReveals.push({
                    targetParty: targetParty,
                    targetName: opponentName,
                    tier: tier,
                    description: desc
                });

                Utils.addLog('✅ Oppo Research [' + item.cat.title + '] SUCCESS vs ' + opponentName + '! Dirt uncovered.');
                Utils.showToast('🔍 Dirt found in ' + item.cat.title + '!');
            } else {
                if (Math.random() < 0.05) {
                    if (typeof Campaign !== 'undefined' && Campaign.adjustFavorability) {
                        Campaign.adjustFavorability(-0.01, 'Failed oppo research attempt in ' + item.cat.title + ' leaked');
                    }
                    Utils.addLog('⚠️ Oppo Research attempt in ' + item.cat.title + ' leaked to press! Favorability -1%');
                }
            }
        }

        if (successCount === 0) {
            Utils.addLog('🔍 Weekly Oppo Research yielded no new dirt this turn.');
        }
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

var OppoResearchUI = {
    tempTargetParty: null,
    tempLevels: {},

    openModal: function() {
        var modal = document.getElementById('oppo-modal');
        if (!modal) return;

        if (!gameData.oppoResearchAllocations) {
            gameData.oppoResearchAllocations = {
                targetParty: gameData.selectedParty === 'D' ? 'R' : 'D',
                levels: { financial: 0, policy: 0, personal: 0, campaign: 0 }
            };
        }

        this.tempTargetParty = gameData.oppoResearchAllocations.targetParty || (gameData.selectedParty === 'D' ? 'R' : 'D');
        this.tempLevels = Object.assign({}, gameData.oppoResearchAllocations.levels || {});

        this.render();
        modal.classList.remove('hidden');
    },

    closeModal: function() {
        var modal = document.getElementById('oppo-modal');
        if (modal) modal.classList.add('hidden');
    },

    setCategoryLevel: function(catId, lvl) {
        this.tempLevels[catId] = lvl;
        this.render();
    },

    setTargetParty: function(party) {
        this.tempTargetParty = party;
        this.render();
    },

    resetAllocations: function() {
        for (var k in this.tempLevels) {
            this.tempLevels[k] = 0;
        }
        this.render();
        Utils.showToast('Allocations reset to inactive');
    },

    saveAllocations: function() {
        if (!gameData.oppoResearchAllocations) gameData.oppoResearchAllocations = {};
        gameData.oppoResearchAllocations.targetParty = this.tempTargetParty;
        gameData.oppoResearchAllocations.levels = Object.assign({}, this.tempLevels);

        var totalFunds = 0;
        var totalEnergy = 0;
        for (var catId in this.tempLevels) {
            var lvl = this.tempLevels[catId] || 0;
            if (lvl > 0 && Scandals.RESEARCH_CATEGORIES[catId]) {
                var info = Scandals.RESEARCH_CATEGORIES[catId].levels[lvl];
                totalFunds += info.costFunds;
                totalEnergy += info.costEnergy;
            }
        }

        this.closeModal();
        var partyName = typeof PARTIES !== 'undefined' && PARTIES[this.tempTargetParty] ? PARTIES[this.tempTargetParty].shortName : this.tempTargetParty;
        if (totalFunds > 0 || totalEnergy > 0) {
            Utils.showToast('Oppo Research saved: $' + totalFunds.toFixed(1) + 'M & ' + totalEnergy + ' En / wk');
            Utils.addLog('Set weekly Oppo Research allocation vs ' + partyName + ': $' + totalFunds.toFixed(1) + 'M / wk, ' + totalEnergy + ' En / wk');
        } else {
            Utils.showToast('Oppo Research paused');
            Utils.addLog('Oppo Research operations paused');
        }
    },

    executeInstantDeepDive: function() {
        if (gameData.funds < 3) {
            return Utils.showToast('Need $3M for instant deep dive!');
        }
        if (gameData.energy < 2) {
            return Utils.showToast('Need 2 energy for instant deep dive!');
        }

        gameData.funds -= 3;
        gameData.energy -= 2;
        if (typeof Campaign !== 'undefined' && Campaign.updateHUD) Campaign.updateHUD();

        var party = this.tempTargetParty;
        var partyName = typeof PARTIES !== 'undefined' && PARTIES[party] ? PARTIES[party].shortName : party;
        Utils.showToast('Executing instant deep dive vs ' + partyName + '...');
        
        if (typeof Scandals !== 'undefined' && Scandals.rollOppoResearch) {
            Scandals.rollOppoResearch(party);
        }

        this.render();
    },

    render: function() {
        var targetSec = document.getElementById('oppo-target-section');
        var catsContainer = document.getElementById('oppo-categories-container');
        var costText = document.getElementById('oppo-weekly-cost-text');
        var chanceText = document.getElementById('oppo-total-chance-text');

        if (!targetSec || !catsContainer) return;

        var opponent = Scandals.getOpponentCandidate(this.tempTargetParty);
        var opponentName = opponent ? opponent.name : (typeof PARTIES !== 'undefined' && PARTIES[this.tempTargetParty] ? PARTIES[this.tempTargetParty].name : 'Opponent');
        var opponentImg = (opponent && opponent.img) ? opponent.img : 'images/public-speaker.svg';
        var resistance = opponent ? (opponent.scandalResistance || 0.3) : 0.3;

        // Render target header
        var activeScandalsCount = 0;
        if (Scandals.activeScandals) {
            for (var i = 0; i < Scandals.activeScandals.length; i++) {
                if (Scandals.activeScandals[i].targetParty === this.tempTargetParty) {
                    activeScandalsCount++;
                }
            }
        }

        var partyNameShort = typeof PARTIES !== 'undefined' && PARTIES[this.tempTargetParty] ? PARTIES[this.tempTargetParty].shortName : this.tempTargetParty;
        var partyColor = this.tempTargetParty === 'D' ? '#00AEF3' : (this.tempTargetParty === 'R' ? '#E81B23' : '#ffaa00');

        var targetHtml = '<div style="display: flex; align-items: center; gap: 12px;">' +
            '<img src="' + opponentImg + '" style="width: 46px; height: 46px; border-radius: 50%; object-fit: cover; border: 2px solid ' + partyColor + ';" onError="this.src=\'images/public-speaker.svg\'">' +
            '<div>' +
            '<div style="font-size: 0.72rem; color: #888; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">Target Opponent</div>' +
            '<div style="font-size: 1.05rem; font-weight: 800; color: #fff;">' + opponentName + ' <span style="font-size: 0.8rem; color: ' + partyColor + ';">(' + partyNameShort + ')</span></div>' +
            '<div style="font-size: 0.75rem; color: #aaa; margin-top: 1px;">Vetting Resistance: <span style="color: #ffaa00; font-weight: 700;">' + Math.round((1 - resistance) * 100) + '% Vulnerable</span></div>' +
            '</div></div>';

        targetHtml += '<div style="text-align: right;">' +
            '<div style="font-size: 0.72rem; color: #888; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">Active Scandals</div>' +
            '<div style="font-size: 0.95rem; font-weight: 800; color: ' + (activeScandalsCount > 0 ? '#ff4444' : '#00ffaa') + ';">' +
            (activeScandalsCount > 0 ? activeScandalsCount + ' Active Scandal' + (activeScandalsCount > 1 ? 's' : '') : 'Clean Record') + '</div>' +
            '</div>';

        targetSec.innerHTML = targetHtml;

        // Render categories
        var catsHtml = '';
        var totalCostFunds = 0;
        var totalCostEnergy = 0;
        var failProd = 1.0;

        for (var catId in Scandals.RESEARCH_CATEGORIES) {
            var cat = Scandals.RESEARCH_CATEGORIES[catId];
            var currentLvl = this.tempLevels[catId] || 0;
            var currentLvlInfo = cat.levels[currentLvl] || cat.levels[0];

            totalCostFunds += currentLvlInfo.costFunds;
            totalCostEnergy += currentLvlInfo.costEnergy;

            var baseChance = currentLvlInfo.baseChance;
            var netChance = currentLvl > 0 ? Math.max(10, Math.min(95, baseChance - (resistance * 15))) : 0;

            if (currentLvl > 0) {
                failProd *= (1 - (netChance / 100));
            }

            var isActive = currentLvl > 0;

            catsHtml += '<div class="oppo-cat-card ' + (isActive ? 'active-card' : '') + '">' +
                '<div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;">' +
                '<div style="display: flex; align-items: center; gap: 10px;">' +
                '<span style="font-size: 1.15rem; color: ' + (isActive ? '#ffaa00' : '#888') + ';"><i class="' + cat.icon + '"></i></span>' +
                '<div>' +
                '<div style="font-size: 0.92rem; font-weight: 700; color: #fff;">' + cat.title + '</div>' +
                '<div style="font-size: 0.74rem; color: #aaa; margin-top: 1px; line-height: 1.25;">' + cat.desc + '</div>' +
                '</div>' +
                '</div>' +
                '<div style="text-align: right; flex-shrink: 0;">' +
                '<span style="font-size: 0.82rem; font-weight: 800; color: ' + (isActive ? '#00ffaa' : '#666') + ';">' +
                (isActive ? netChance + '% Hit Chance' : 'Inactive') + '</span>' +
                '</div>' +
                '</div>';

            // Level Buttons
            catsHtml += '<div class="oppo-level-btn-group">';
            for (var l = 0; l < cat.levels.length; l++) {
                var lvlInfo = cat.levels[l];
                var isSelected = currentLvl === l;
                catsHtml += '<button class="oppo-level-btn ' + (isSelected ? 'selected' : '') + '" onclick="OppoResearchUI.setCategoryLevel(\'' + catId + '\', ' + l + ')">' +
                    lvlInfo.name + '</button>';
            }
            catsHtml += '</div></div>';
        }

        catsContainer.innerHTML = catsHtml;

        // Overall chance calculation
        var overallChance = Math.round((1 - failProd) * 100);

        if (costText) {
            costText.innerText = '$' + totalCostFunds.toFixed(1) + 'M / week  &  ' + totalCostEnergy + ' Energy / turn';
        }
        if (chanceText) {
            chanceText.innerText = (totalCostFunds > 0 || totalCostEnergy > 0) ? overallChance + '% Chance / Turn' : '0% Chance / Turn';
            chanceText.style.color = (totalCostFunds > 0 || totalCostEnergy > 0) ? '#00ffaa' : '#888';
        }
    }
};
