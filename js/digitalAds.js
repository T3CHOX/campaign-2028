/* ============================================
   DECISION 2028 - DIGITAL ADVERTISING SYSTEM
   ============================================ */

var DigitalAds = {
    // Platform configurations
    PLATFORMS: {
        'ctv':     { cpm: 32, frequency: 4.2, decay: 0.09 },
        'meta':    { cpm: 14, frequency: 6.8, decay: 0.16 },
        'search':  { cpm: 8,  frequency: 1.5, decay: 0.05 },
        'youtube': { cpm: 11, frequency: 3.1, decay: 0.12 },
        'audio':   { cpm: 7,  frequency: 5.0, decay: 0.10 },
        'tiktok':  { cpm: 6,  frequency: 9.0, decay: 0.22 },
        'display': { cpm: 4,  frequency: 12.0, decay: 0.18 }
    },

    // Mismatch matrix [ctv, meta, search, youtube, audio, tiktok, display]
    MISMATCH: {
        'gen_z':          { ctv: 0.5, meta: 0.7, search: 0.8, youtube: 0.9, audio: 0.7, tiktok: 1.4, display: 0.6 },
        'youth':          { ctv: 0.5, meta: 0.7, search: 0.8, youtube: 0.9, audio: 0.7, tiktok: 1.4, display: 0.6 },
        'senior':         { ctv: 1.3, meta: 0.9, search: 0.8, youtube: 0.7, audio: 1.2, tiktok: 0.3, display: 0.8 },
        'seniors':        { ctv: 1.3, meta: 0.9, search: 0.8, youtube: 0.7, audio: 1.2, tiktok: 0.3, display: 0.8 },
        'suburban_women': { ctv: 1.2, meta: 1.3, search: 0.9, youtube: 1.0, audio: 0.9, tiktok: 0.8, display: 0.9 },
        'women':          { ctv: 1.2, meta: 1.3, search: 0.9, youtube: 1.0, audio: 0.9, tiktok: 0.8, display: 0.9 },
        'non_college':    { ctv: 1.1, meta: 0.9, search: 0.7, youtube: 0.8, audio: 1.1, tiktok: 0.5, display: 0.7 },
        'noncollege':     { ctv: 1.1, meta: 0.9, search: 0.7, youtube: 0.8, audio: 1.1, tiktok: 0.5, display: 0.7 },
        'rural':          { ctv: 1.1, meta: 0.9, search: 0.7, youtube: 0.8, audio: 1.1, tiktok: 0.5, display: 0.7 },
        'persuadable':    { ctv: 1.0, meta: 1.2, search: 1.3, youtube: 1.0, audio: 0.9, tiktok: 0.9, display: 1.0 },
        'progressive':    { ctv: 0.7, meta: 1.0, search: 1.0, youtube: 1.2, audio: 0.9, tiktok: 1.2, display: 1.0 },
        'progressives':   { ctv: 0.7, meta: 1.0, search: 1.0, youtube: 1.2, audio: 0.9, tiktok: 1.2, display: 1.0 },
        'default':        { ctv: 1.0, meta: 1.0, search: 1.0, youtube: 1.0, audio: 1.0, tiktok: 0.8, display: 1.0 }
    },

    CREATIVES: {
        'issue':       { p: 1.0, t: 1.0, cd: 0 },
        'contrast':    { p: 0.7, t: 0.5, cd: 2 },
        'mobilize':    { p: 0.4, t: 3.5, cd: 0 },
        'testimonial': { p: 1.4, t: 1.0, cd: 3 },
        'amplify':     { p: 0.6, t: 1.0, cd: 1 },
        'data_collect':{ p: 0.0, t: 0.0, cd: 0 }
    },

    initDigitalAds: function() {
        gameData.digitalAds = {
            weeklyBudgets: {},
            platformSaturation: {},
            creativeCooldowns: {}
        };
        for (var code in STATES) {
            gameData.digitalAds.platformSaturation[code] = {
                ctv: 0, meta: 0, search: 0, youtube: 0, audio: 0, tiktok: 0, display: 0
            };
            gameData.digitalAds.creativeCooldowns[code] = {};
        }
    },

    // Get mismatch mult
    getMismatch: function(segment, platform) {
        var base = this.MISMATCH[segment] || this.MISMATCH['default'];
        return base[platform] || 1.0;
    },

    executeDigitalCampaign: function(stateCode, config) {
        // config = { totalBudget: 2.0, allocations: { meta: 0.5, youtube: 0.5 }, segment: 'youth', creative: 'issue' }
        if (gameData.funds < config.totalBudget) return false;
        gameData.funds -= config.totalBudget;

        var creativeData = this.CREATIVES[config.creative];
        
        // Cooldown check
        var cdObj = gameData.digitalAds.creativeCooldowns[stateCode];
        if (cdObj[config.creative] && cdObj[config.creative] > gameData.currentWeek) {
            Utils.showToast("Creative type is on cooldown!");
            // Refund handled theoretically before calling this
            return false;
        }

        if (creativeData.cd > 0) {
            cdObj[config.creative] = gameData.currentWeek + creativeData.cd;
        }

        var statePop = STATES[stateCode].population || 5000000;
        var voterFile = (gameData.groundOps && gameData.groundOps.voterFiles[stateCode]) ? gameData.groundOps.voterFiles[stateCode].quality : 0;
        
        var totalPersuasion = 0;
        var totalTurnout = 0;
        var contacts = 0;

        for (var platform in config.allocations) {
            var share = config.allocations[platform];
            if (share <= 0) continue;
            var spend = config.totalBudget * share * 1000000; // in dollars
            
            var pData = this.PLATFORMS[platform];
            var impressions = (spend / pData.cpm) * 1000;
            
            // Search is CPC so we treat impressions specially
            if (platform === 'search') {
                impressions = spend / 8; // $8 CPC
            }

            var mismatch = this.getMismatch(config.segment, platform);
            
            // Reachability modifier based on voter file
            var vfMult = 0.80 + (voterFile * 0.40);
            
            var uniqueReaches = (impressions / pData.frequency) * mismatch * vfMult;
            contacts += uniqueReaches;

            // Saturation Factor
            var sat = gameData.digitalAds.platformSaturation[stateCode][platform] || 0;
            var satFactor = 1 - (0.70 * sat);

            // Persuasion
            var DIGITAL_PERSUASION_RATE = 0.00008;
            var momentumMult = 1.0 + 0.12 * (gameData.campaignMomentum || 0);
            var pVal = uniqueReaches * DIGITAL_PERSUASION_RATE * creativeData.p * satFactor * momentumMult;

            // Turnout
            var DIGITAL_TURNOUT_RATE = 0.00003;
            var tVal = uniqueReaches * DIGITAL_TURNOUT_RATE * creativeData.t;

            // Saturation Increase
            var satGain = (impressions / 50000000) * pData.decay;
            gameData.digitalAds.platformSaturation[stateCode][platform] = Math.min(1.0, sat + satGain * (1 - sat));

            totalPersuasion += pVal;
            totalTurnout += tVal;
        }

        // Apply Data Collect
        if (config.creative === 'data_collect' && gameData.groundOps) {
            gameData.groundOps.voterFiles[stateCode].quality = Math.min(1.0, gameData.groundOps.voterFiles[stateCode].quality + 0.05);
            gameData.groundOps.volunteerPools[stateCode] = Math.min(500, gameData.groundOps.volunteerPools[stateCode] + 8);
        }

        // Apply contrast debuff
        if (config.creative === 'contrast') {
            // Very simplified: subtract small amount from opponent state margin globally
            // But we'll apply persuasion as a direct margin shift
        }

        // Direct Margin / Turnout Application
        if (gameData.states[stateCode]) {
            var state = gameData.states[stateCode];
            var sign = gameData.selectedParty === 'D' ? 1 : (gameData.selectedParty === 'R' ? -1 : 0);
            
            // Apply to state margin (in percentage points) via county votes
            var marginShift = totalPersuasion * 100;
            if (sign !== 0 && typeof Counties !== 'undefined') {
                for (var fips in Counties.countyData) {
                    var county = Counties.countyData[fips];
                    if (county.s === stateCode && county.v) {
                        var shift = marginShift * sign;
                        var oppKey = gameData.selectedParty === 'D' ? 'R' : 'D';
                        var playerKey = gameData.selectedParty;
                        
                        if (shift > 0) {
                            var amount = Math.min(shift, county.v[oppKey] || 0);
                            county.v[oppKey] = Math.max(0, county.v[oppKey] - amount);
                            county.v[playerKey] = (county.v[playerKey] || 0) + amount;
                        } else if (shift < 0) {
                            var amount = Math.min(-shift, county.v[playerKey] || 0);
                            county.v[playerKey] = Math.max(0, county.v[playerKey] - amount);
                            county.v[oppKey] = (county.v[oppKey] || 0) + amount;
                        }
                    }
                }
                Counties.updateStateFromCounties(stateCode);
            }

            // Apply base turnout (statewide approx)
            state.digitalTurnoutBonus = (state.digitalTurnoutBonus || 0) + totalTurnout;
        }

        Utils.addLog("Ran Digital Campaign in " + STATES[stateCode].name + " (" + config.creative + " to " + config.segment + "). (-$" + config.totalBudget + "M)");
        return true;
    },

    refreshCreative: function(stateCode, platform) {
        var cost = 0.5;
        if (gameData.funds < cost) return false;
        gameData.funds -= cost;
        
        var sat = gameData.digitalAds.platformSaturation[stateCode][platform] || 0;
        gameData.digitalAds.platformSaturation[stateCode][platform] = Math.max(0, sat - 0.25);
        
        Utils.addLog("Refreshed digital creative for " + platform.toUpperCase() + " in " + STATES[stateCode].name + ". (-$0.5M)");
        return true;
    },

    processWeekly: function() {
        if (!gameData.digitalAds) return;
        
        for (var code in STATES) {
            var sats = gameData.digitalAds.platformSaturation[code];
            for (var p in sats) {
                if (sats[p] > 0) {
                    sats[p] = Math.max(0, sats[p] - (0.08 * sats[p])); // 8% decay
                }
            }
        }
    }
};
