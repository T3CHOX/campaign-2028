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
            }
        }
        
        // Update all state margins from county data
        for (var code in gameData.states) {
            if (typeof Counties !== 'undefined') {
                Counties.updateStateFromCounties(code);
            }
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
    },
    
    // Apply a SPEECH action (county-specific with statewide effect)
    applySpeechAction: function(action) {
        var stateCode = action.state;
        var countyId = action.countyId;
        var issueId = action.issueId;
        var intensity = action.intensity || 1;
        
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
    },
    
    // Apply a RALLY action (preserved for compatibility)
    applyRallyAction: function(action) {
        var stateCode = action.state;
        var stateFips = STATES[stateCode] ? STATES[stateCode].fips : null;
        if (!stateFips || !Counties || !Counties.countyData) return;
        
        // Rallies don't use issue-based persuasion, just turnout
        for (var fips in Counties.countyData) {
            var paddedFips = fips.padStart(5, '0');
            if (paddedFips.substring(0, 2) === stateFips) {
                var county = Counties.countyData[fips];
                this.applyTurnoutBoost(county, PERSUASION_CONSTANTS.RALLY_TURNOUT_BOOST);
            }
        }
    },
    
    // Calculate persuasion delta for a single county based on interest group composition
    calculateCountyPersuasion: function(county, issueId, intensity, baseStrength, saturation, isLocal) {
        var candidateId = gameData.candidate ? gameData.candidate.id : null;
        if (!candidateId) return 0;
        
        var totalDelta = 0;
        
        // Get county group shares (from demographics or default)
        var countyDemographics = this.getCountyDemographics(county);
        
        // Iterate through all interest groups
        for (var groupId in INTEREST_GROUPS) {
            var groupShare = countyDemographics[groupId] || 0;
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
        
        // Apply localized multiplier if this is a speech in this county
        if (isLocal) {
            totalDelta *= PERSUASION_CONSTANTS.SPEECH_LOCAL_MULTIPLIER;
        }
        
        return totalDelta;
    },
    
    // Get county demographics (group shares)
    getCountyDemographics: function(county) {
        // In a real implementation, this would come from county data
        // For now, use state demographics as approximation
        var stateCode = this.getStateCodeFromFips(county.fips);
        
        if (STATE_DEMOGRAPHICS[stateCode]) {
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
            // Third party campaigns have minimal persuasion effect
            // They mainly build their own support rather than shifting D-R
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
    
    // Get display info for pending actions
    getPendingActionsSummary: function() {
        if (!gameData.pendingActions || gameData.pendingActions.length === 0) {
            return "No actions queued";
        }
        
        var ads = 0, speeches = 0, rallies = 0;
        
        for (var i = 0; i < gameData.pendingActions.length; i++) {
            var action = gameData.pendingActions[i];
            if (action.type === 'AD') ads++;
            else if (action.type === 'SPEECH') speeches++;
            else if (action.type === 'RALLY') rallies++;
        }
        
        var parts = [];
        if (ads > 0) parts.push(ads + ' ad' + (ads > 1 ? 's' : ''));
        if (speeches > 0) parts.push(speeches + ' speech' + (speeches > 1 ? 'es' : ''));
        if (rallies > 0) parts.push(rallies + ' rall' + (rallies > 1 ? 'ies' : 'y'));
        
        return parts.join(', ') + ' queued';
    }
};
