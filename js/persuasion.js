/* ============================================
   DECISION 2028 - CAMPAIGN PERSUASION SYSTEM
   ============================================ */

var Persuasion = {
    
    // Calculate issue importance for a group (converts priority array to weight)
    getGroupIssueImportance: function(groupId, issueId) {
        if (!INTEREST_GROUPS[groupId] || !INTEREST_GROUPS[groupId].priorities) {
            return 0;
        }
        
        var priorities = INTEREST_GROUPS[groupId].priorities;
        var index = priorities.indexOf(issueId);
        
        if (index === -1) {
            return 0.2;  // Low importance for non-priority issues
        }
        
        // Convert priority rank to importance weight (0 to 1.5)
        // First priority: 1.5, Second: 1.2, Third: 0.9
        if (index === 0) return 1.5;
        if (index === 1) return 1.2;
        if (index === 2) return 0.9;
        return 0.5;  // Lower priorities
    },
    
    // Calculate alignment between candidate and group on an issue
    // Returns value in [-1, +1] where +1 is perfect alignment, -1 is opposite
    calculateAlignment: function(candidateId, groupId, issueId) {
        // Get candidate position on issue (-10 to +10)
        var candidatePos = (CANDIDATE_POSITIONS[candidateId] && CANDIDATE_POSITIONS[candidateId][issueId]) || 0;
        
        // Estimate group position from their baseline lean
        // Groups with negative baseline (D-leaning) prefer negative positions
        // Groups with positive baseline (R-leaning) prefer positive positions
        var groupBaseline = INTEREST_GROUPS[groupId] ? INTEREST_GROUPS[groupId].baseline : 0;
        
        // Scale group baseline to issue position range
        var groupPos = groupBaseline * 1.2;  // Approximate group position
        
        // Calculate difference
        var diff = Math.abs(candidatePos - groupPos);
        var range = 20;  // Position range is -10 to +10
        
        // Convert to alignment: 1 = perfect match, 0 = neutral, -1 = opposite
        var alignment = 1 - (diff / range);
        
        // Clamp to [-1, 1]
        return Math.max(-1, Math.min(1, alignment));
    },
    
    // Calculate saturation factor for diminishing returns
    // pressure: cumulative intensity from all actions this turn on same state+issue
    calculateSaturationFactor: function(pressure) {
        return 1 / (1 + pressure * PERSUASION_CONSTANTS.PRESSURE_SCALAR);
    },
    
    // Queue a campaign action (doesn't apply immediately)
    queueAction: function(action) {
        // Validate action structure
        if (!action.type || !action.state) {
            console.error('Invalid action structure:', action);
            return false;
        }
        
        // Check if we have resources
        if (action.cost && action.cost.funds) {
            if (gameData.funds < action.cost.funds) {
                Utils.showToast("Not enough funds!");
                return false;
            }
        }
        
        if (action.cost && action.cost.energy) {
            if (gameData.energy < action.cost.energy) {
                Utils.showToast("Not enough energy!");
                return false;
            }
        }
        
        // Deduct resources immediately (but don't apply persuasion effects)
        if (action.cost) {
            if (action.cost.funds) gameData.funds -= action.cost.funds;
            if (action.cost.energy) gameData.energy -= action.cost.energy;
        }
        
        // Add to queue
        gameData.pendingActions.push(action);
        
        // Update UI
        Campaign.updateHUD();
        
        return true;
    },
    
    // Apply all queued actions to county margins
    applyQueuedActions: function() {
        if (!gameData.pendingActions || gameData.pendingActions.length === 0) {
            return;
        }
        
        console.log('Applying ' + gameData.pendingActions.length + ' queued campaign actions...');
        
        // Reset turn pressure tracking
        gameData.turnPressure = {};
        
        // Process each action
        for (var i = 0; i < gameData.pendingActions.length; i++) {
            var action = gameData.pendingActions[i];
            
            if (action.type === 'AD') {
                this.applyAdAction(action);
            } else if (action.type === 'SPEECH') {
                this.applySpeechAction(action);
            } else if (action.type === 'RALLY') {
                this.applyRallyAction(action);
            } else if (action.type === 'FIELD') {
                this.applyFieldAction(action);
            } else if (action.type === 'DIGITAL') {
                this.applyDigitalAction(action);
            }
        }
        
        // Update all state margins from county data
        for (var code in gameData.states) {
            if (typeof Counties !== 'undefined') {
                Counties.updateStateFromCounties(code);
            }
        }

        if (typeof recomputeInterestGroupSupport === 'function') {
            recomputeInterestGroupSupport();
        }
        
        // Clear queue
        gameData.pendingActions = [];
        
        // Update map colors
        if (typeof Campaign !== 'undefined') {
            Campaign.colorMap();
        }
        
        console.log('✓ Queued actions applied');
    },
    
    // Apply an AD action (statewide effect)
    applyAdAction: function(action) {
        var stateCode = action.state;
        var issueId = action.issueId;
        var intensity = action.intensity || 1;

        if (typeof updateMessagingConsistency === 'function') {
            updateMessagingConsistency(issueId, intensity);
        }
        if (typeof recordPlayerPressure === 'function') {
            recordPlayerPressure(stateCode, 'AD', intensity);
        }
        
        // Get state FIPS for county iteration
        var stateFips = STATES[stateCode] ? STATES[stateCode].fips : null;
        if (!stateFips || !Counties || !Counties.countyData) return;
        
        // Track pressure for this state+issue
        var pressureKey = stateCode + '_' + issueId;
        gameData.turnPressure[pressureKey] = (gameData.turnPressure[pressureKey] || 0) + intensity;
        var saturation = this.calculateSaturationFactor(gameData.turnPressure[pressureKey]);
        
        // Apply to all counties in the state
        for (var fips in Counties.countyData) {
            var paddedFips = fips.padStart(5, '0');
            if (paddedFips.substring(0, 2) === stateFips) {
                var county = Counties.countyData[fips];
                
                // Calculate persuasion delta for this county
                var delta = this.calculateCountyPersuasion(
                    county, issueId, intensity, 
                    PERSUASION_CONSTANTS.BASE_PERSUASION_AD,
                    saturation, false  // not localized
                );
                
                // Apply margin shift
                this.applyMarginShift(county, delta);
                
                // Small turnout boost
                this.applyTurnoutBoost(county, PERSUASION_CONSTANTS.AD_TURNOUT_BOOST);
            }
        }
        
        // Update interest group turnout propensity for aligned groups
        if (typeof updateGroupTurnoutFromIssue !== 'undefined') {
            updateGroupTurnoutFromIssue(issueId, gameData.selectedParty, intensity);
        }
        this.applyIssueGroupMomentum(issueId, intensity, 0.18);
        this.recordAppliedActionMetric(action, {
            issueId: issueId,
            turnoutKey: issueId,
            turnoutDelta: PERSUASION_CONSTANTS.AD_TURNOUT_BOOST * intensity,
            spend: action.cost && action.cost.funds ? action.cost.funds : 0
        });
    },
    
    // Apply a SPEECH action (county-specific with statewide effect)
    applySpeechAction: function(action) {
        var stateCode = action.state;
        var countyId = action.countyId;
        var issueId = action.issueId;
        var intensity = action.intensity || 1;

        if (typeof updateMessagingConsistency === 'function') {
            updateMessagingConsistency(issueId, intensity);
        }
        if (typeof recordPlayerPressure === 'function') {
            recordPlayerPressure(stateCode, 'SPEECH', intensity);
        }
        
        // Get state FIPS
        var stateFips = STATES[stateCode] ? STATES[stateCode].fips : null;
        if (!stateFips || !Counties || !Counties.countyData) return;
        
        // Track pressure
        var pressureKey = stateCode + '_' + issueId;
        gameData.turnPressure[pressureKey] = (gameData.turnPressure[pressureKey] || 0) + (intensity * 0.7);  // Speech has 70% pressure of ads
        var saturation = this.calculateSaturationFactor(gameData.turnPressure[pressureKey]);
        
        // Apply to all counties in the state
        for (var fips in Counties.countyData) {
            var paddedFips = fips.padStart(5, '0');
            if (paddedFips.substring(0, 2) === stateFips) {
                var county = Counties.countyData[fips];
                var isLocalCounty = (paddedFips === countyId);
                
                // Calculate persuasion delta
                var delta = this.calculateCountyPersuasion(
                    county, issueId, intensity,
                    PERSUASION_CONSTANTS.BASE_PERSUASION_SPEECH,
                    saturation, isLocalCounty
                );
                
                // Apply margin shift
                this.applyMarginShift(county, delta);
                
                // Turnout boost (larger in local county)
                var turnoutBoost = isLocalCounty ? 
                    PERSUASION_CONSTANTS.SPEECH_TURNOUT_BOOST * 2 : 
                    PERSUASION_CONSTANTS.SPEECH_TURNOUT_BOOST;
                this.applyTurnoutBoost(county, turnoutBoost);
            }
        }
        
        // Update interest group turnout propensity for aligned groups
        if (typeof updateGroupTurnoutFromIssue !== 'undefined') {
            updateGroupTurnoutFromIssue(issueId, gameData.selectedParty, intensity);
        }
        this.applyIssueGroupMomentum(issueId, intensity, 0.28);
        this.recordAppliedActionMetric(action, {
            issueId: issueId,
            turnoutKey: issueId,
            turnoutDelta: PERSUASION_CONSTANTS.SPEECH_TURNOUT_BOOST * intensity
        });
    },
    applyRallyAction: function(action) {
        var stateCode = action.state;
        var stateFips = STATES[stateCode] ? STATES[stateCode].fips : null;
        if (!stateFips || !Counties || !Counties.countyData) return;

        if (typeof recordPlayerPressure === 'function') {
            recordPlayerPressure(stateCode, 'RALLY', 1);
        }
        
        var rallyDelta = PERSUASION_CONSTANTS.BASE_PERSUASION_RALLY;
        for (var fips in Counties.countyData) {
            var paddedFips = fips.padStart(5, '0');
            if (paddedFips.substring(0, 2) === stateFips) {
                var county = Counties.countyData[fips];
                this.applyTurnoutBoost(county, PERSUASION_CONSTANTS.RALLY_TURNOUT_BOOST);
                this.applyMarginShift(county, rallyDelta);
            }
        }
        this.applyRallyGroupMomentum(stateCode);
        this.recordAppliedActionMetric(action, {
            turnoutKey: 'rally',
            turnoutDelta: PERSUASION_CONSTANTS.RALLY_TURNOUT_BOOST
        });
    },

    // Apply a FIELD action (targeted turnout boost by demographic group)
    applyFieldAction: function(action) {
        var stateCode = action.state;
        var groupId = action.groupId;
        var intensity = action.intensity || 1;

        var stateFips = STATES[stateCode] ? STATES[stateCode].fips : null;
        if (!stateFips || !Counties || !Counties.countyData) return;

        for (var fips in Counties.countyData) {
            var paddedFips = fips.padStart(5, '0');
            if (paddedFips.substring(0, 2) === stateFips) {
                var county = Counties.countyData[fips];
                var groupShare = Counties.getCountyGroupShare ? Counties.getCountyGroupShare(county, groupId) : 0;
                if (groupShare <= 0) continue;
                var turnoutBoost = PERSUASION_CONSTANTS.FIELD_TURNOUT_BOOST * intensity * groupShare;
                this.applyTurnoutBoost(county, turnoutBoost);
            }
        }
        this.applyTargetGroupMomentum(groupId, intensity * 0.65);
        this.boostGroupTurnout(groupId, BUFF_CONSTANTS.GROUP_TURNOUT_RATE * intensity * 2.5);
        this.recordAppliedActionMetric(action, {
            groupId: groupId,
            turnoutKey: groupId,
            turnoutDelta: PERSUASION_CONSTANTS.FIELD_TURNOUT_BOOST * intensity
        });
    },

    // Apply a DIGITAL action (targeted persuasion + turnout)
    applyDigitalAction: function(action) {
        var stateCode = action.state;
        var groupId = action.groupId;
        var intensity = action.intensity || 1;

        var stateFips = STATES[stateCode] ? STATES[stateCode].fips : null;
        if (!stateFips || !Counties || !Counties.countyData) return;

        for (var fips in Counties.countyData) {
            var paddedFips = fips.padStart(5, '0');
            if (paddedFips.substring(0, 2) === stateFips) {
                var county = Counties.countyData[fips];
                var groupShare = Counties.getCountyGroupShare ? Counties.getCountyGroupShare(county, groupId) : 0;
                if (groupShare <= 0) continue;

                var delta = PERSUASION_CONSTANTS.BASE_PERSUASION_DIGITAL * intensity * groupShare;
                this.applyMarginShift(county, delta);
                this.applyTurnoutBoost(county, PERSUASION_CONSTANTS.DIGITAL_TURNOUT_BOOST * intensity * groupShare);
            }
        }
        this.applyTargetGroupMomentum(groupId, intensity * 0.45);
        this.boostGroupTurnout(groupId, BUFF_CONSTANTS.GROUP_TURNOUT_RATE * intensity * 1.5);
        this.recordAppliedActionMetric(action, {
            groupId: groupId,
            turnoutKey: groupId,
            turnoutDelta: PERSUASION_CONSTANTS.DIGITAL_TURNOUT_BOOST * intensity
        });
    },
    
    // Calculate persuasion delta for a single county based on interest group composition
    calculateCountyPersuasion: function(county, issueId, intensity, baseStrength, saturation, isLocal) {
        var candidateId = gameData.candidate ? gameData.candidate.id : null;
        if (!candidateId) return 0;
        
        var totalDelta = 0;
        
        // Use county ig data directly (authoritative, populated for all counties)
        var countyIg = (county && county.ig) ? county.ig : null;
        
        // Iterate through all interest groups
        for (var groupId in INTEREST_GROUPS) {
            // Map INTEREST_GROUPS key → county ig key
            var igKey = (typeof _mapGroupToIgKey !== 'undefined') ? _mapGroupToIgKey(groupId) : groupId;
            
            var groupShare = 0;
            if (countyIg && igKey && countyIg[igKey] !== undefined) {
                groupShare = countyIg[igKey]; // Already a percentage (0-100)
            } else if (countyIg && igKey === null) {
                // Special fallbacks for unmapped groups
                if (groupId === 'rural') groupShare = (county.t === 'Rural') ? 85 : (county.t === 'Mixed' ? 35 : 5);
                else if (groupId === 'urban') groupShare = (county.t === 'Urban') ? 80 : (county.t === 'Mixed' ? 30 : 5);
                else if (groupId === 'suburban') groupShare = (county.t === 'Mixed') ? 60 : (county.t === 'Urban' ? 25 : 10);
                else if (groupId === 'noncollege' && countyIg.college !== undefined) groupShare = 100 - countyIg.college;
            } else if (!countyIg) {
                // Fallback: use state demographics
                var stateDemographics = this.getCountyDemographics(county);
                groupShare = stateDemographics[groupId] || 0;
            }
            
            if (groupShare <= 0) continue;
            
            // Get issue importance for this group
            var importance = this.getGroupIssueImportance(groupId, issueId);
            
            // Get alignment between candidate and group on this issue
            var alignment = this.calculateAlignment(candidateId, groupId, issueId);
            
            // Calculate delta for this group
            var groupDelta = (groupShare / 100) * importance * alignment * baseStrength * intensity;
            
            totalDelta += groupDelta;
        }
        
        // Apply saturation
        totalDelta *= saturation;

        // Apply credibility multiplier
        if (typeof gameData !== 'undefined' && typeof gameData.credibility === 'number') {
            totalDelta *= gameData.credibility;
        }
        
        // Apply localized multiplier if this is a speech in this county
        if (isLocal) {
            totalDelta *= PERSUASION_CONSTANTS.SPEECH_LOCAL_MULTIPLIER;
        }
        
        return totalDelta;
    },
    
    // Get county demographics — uses county's own ig data directly (populated for all 3142 counties)
    getCountyDemographics: function(county) {
        // County ig data is the authoritative source; fall back to state-level if not present
        if (county && county.ig) {
            return county.ig;
        }
        // Fallback: use state-level demographics
        var stateCode = this.getStateCodeFromFips(county ? county.fips : null);
        if (stateCode && STATE_DEMOGRAPHICS[stateCode]) {
            return STATE_DEMOGRAPHICS[stateCode];
        }
        return DEFAULT_DEMOGRAPHICS;
    },
    
    // Extract state code from FIPS
    getStateCodeFromFips: function(fips) {
        var paddedFips = String(fips).padStart(5, '0');
        var stateFips = paddedFips.substring(0, 2);
        
        for (var code in STATES) {
            if (STATES[code].fips === stateFips) {
                return code;
            }
        }
        return null;
    },
    
    // Apply margin shift to county
    applyMarginShift: function(county, delta) {
        if (!county.v) return;
        
        // Delta is D-R margin shift
        // Positive delta = help D, hurt R
        // Negative delta = help R, hurt D
        
        var playerParty = gameData.selectedParty;
        
        if (playerParty === 'D') {
            county.v.D = Math.min(100, Math.max(0, county.v.D + delta));
            county.v.R = Math.min(100, Math.max(0, county.v.R - delta));
        } else if (playerParty === 'R') {
            county.v.R = Math.min(100, Math.max(0, county.v.R + delta));
            county.v.D = Math.min(100, Math.max(0, county.v.D - delta));
        }
        // Third parties: apply smaller effect
        else {
            var thirdDelta = delta * 0.55;
            if (county.v[playerParty] !== undefined) {
                county.v[playerParty] = Math.min(35, Math.max(0, county.v[playerParty] + thirdDelta));
                county.v.D = Math.max(1, (county.v.D || 0) - thirdDelta * 0.45);
                county.v.R = Math.max(1, (county.v.R || 0) - thirdDelta * 0.45);
            }
        }
    },
    
    // Apply turnout boost to county
    applyTurnoutBoost: function(county, boostAmount) {
        if (!county.turnout) {
            county.turnout = { player: 1.0, demOpponent: 1.0, repOpponent: 1.0, thirdParty: 0.7 };
        }
        
        var playerParty = gameData.selectedParty;
        
        if (playerParty === 'D' || playerParty === 'R') {
            county.turnout.player = Math.min(1.3, (county.turnout.player || 1.0) + boostAmount);
        } else {
            county.turnout.thirdParty = Math.min(1.3, (county.turnout.thirdParty || 0.7) + (boostAmount * 0.5));
        }
    },

    recordAppliedActionMetric: function(action, details) {
        if (!action || !action.state || !gameData.states[action.state]) return;
        var state = gameData.states[action.state];
        if (!state.actionMetrics) {
            state.actionMetrics = { AD: 0, SPEECH: 0, RALLY: 0, FIELD: 0, DIGITAL: 0 };
        }
        state.actionMetrics[action.type] = (state.actionMetrics[action.type] || 0) + 1;
        if (!state.turnoutBoosts) state.turnoutBoosts = {};
        var turnoutKey = (details && details.turnoutKey) || action.groupId || action.issueId || action.type.toLowerCase();
        var turnoutDelta = (details && details.turnoutDelta) || 0;
        if (turnoutKey && turnoutDelta) {
            state.turnoutBoosts[turnoutKey] = (state.turnoutBoosts[turnoutKey] || 0) + turnoutDelta;
        }
        if (details && details.spend) {
            state.adSpent = (state.adSpent || 0) + details.spend;
        }
    },

    applyIssueGroupMomentum: function(issueId, intensity, scale) {
        if (typeof applyCampaignGroupSwing !== 'function' || !gameData.candidate) return;
        if (typeof INTEREST_GROUPS === 'undefined') return;
        for (var groupId in INTEREST_GROUPS) {
            var importance = this.getGroupIssueImportance(groupId, issueId);
            if (importance <= 0.2) continue;
            var alignment = this.calculateAlignment(gameData.candidate.id, groupId, issueId);
            var delta = (alignment - 0.45) * importance * (intensity || 1) * (scale || 0.2);
            applyCampaignGroupSwing(groupId, delta);
        }
    },

    applyTargetGroupMomentum: function(groupId, delta) {
        if (typeof applyCampaignGroupSwing !== 'function' || !groupId) return;
        applyCampaignGroupSwing(groupId, delta);
    },

    boostGroupTurnout: function(groupId, delta) {
        if (!groupId || !isFinite(delta)) return;
        if (!gameData.issueTurnout && typeof initInterestGroupTurnout === 'function') {
            initInterestGroupTurnout();
        }
        if (!gameData.issueTurnout) return;
        gameData.issueTurnout[groupId] = Math.max(BUFF_CONSTANTS.MIN_GROUP_TURNOUT,
            Math.min(BUFF_CONSTANTS.MAX_GROUP_TURNOUT, (gameData.issueTurnout[groupId] || 1.0) + delta));
        if (typeof recomputeCoalitionTurnout === 'function') {
            recomputeCoalitionTurnout();
        }
    },

    applyRallyGroupMomentum: function(stateCode) {
        if (typeof applyCampaignGroupSwing !== 'function') return;
        var topGroups = this.getStateTopTargetGroups(stateCode, 3);
        for (var i = 0; i < topGroups.length; i++) {
            applyCampaignGroupSwing(topGroups[i].id, 0.22 * (1 - (i * 0.18)));
        }
    },

    getStateTopTargetGroups: function(stateCode, limit) {
        var groups = (typeof TARGETABLE_GROUPS !== 'undefined') ? TARGETABLE_GROUPS : [];
        var scored = [];
        for (var i = 0; i < groups.length; i++) {
            var groupId = groups[i];
            var share = this.getStateGroupShare(stateCode, groupId);
            if (share > 0) scored.push({ id: groupId, share: share });
        }
        scored.sort(function(a, b) { return b.share - a.share; });
        return scored.slice(0, limit || 3);
    },

    getStateGroupShare: function(stateCode, groupId) {
        if (!STATES[stateCode] || !Counties || !Counties.countyData || !Counties.getCountyGroupShare) return 0;
        var stateFips = STATES[stateCode].fips;
        var weightedShare = 0;
        var totalPop = 0;
        for (var fips in Counties.countyData) {
            var paddedFips = fips.padStart(5, '0');
            if (paddedFips.substring(0, 2) !== stateFips) continue;
            var county = Counties.countyData[fips];
            var pop = county.p || 0;
            weightedShare += pop * Counties.getCountyGroupShare(county, groupId);
            totalPop += pop;
        }
        return totalPop > 0 ? weightedShare / totalPop : 0;
    },
    
    // Get display info for pending actions
    getPendingActionsSummary: function() {
        if (!gameData.pendingActions || gameData.pendingActions.length === 0) {
            return "No actions queued";
        }
        
        var ads = 0, speeches = 0, rallies = 0, fields = 0, digitals = 0;
        
        for (var i = 0; i < gameData.pendingActions.length; i++) {
            var action = gameData.pendingActions[i];
            if (action.type === 'AD') ads++;
            else if (action.type === 'SPEECH') speeches++;
            else if (action.type === 'RALLY') rallies++;
            else if (action.type === 'FIELD') fields++;
            else if (action.type === 'DIGITAL') digitals++;
        }
        
        var parts = [];
        if (ads > 0) parts.push(ads + ' ad' + (ads > 1 ? 's' : ''));
        if (speeches > 0) parts.push(speeches + ' speech' + (speeches > 1 ? 'es' : ''));
        if (rallies > 0) parts.push(rallies + ' rall' + (rallies > 1 ? 'ies' : 'y'));
        if (fields > 0) parts.push(fields + ' field op' + (fields > 1 ? 's' : ''));
        if (digitals > 0) parts.push(digitals + ' digital');
        
        return parts.join(', ') + ' queued';
    }
};
