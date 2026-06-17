/* ============================================
   DECISION 2028 - GROUND OPERATIONS SYSTEM
   ============================================ */

var GroundOps = {
    // Core state
    initGroundOps: function() {
        gameData.groundOps = {
            offices: {},        // { stateCode: { count, quality, weekOpened } }
            staffLevels: {},    // { stateCode: number (0-60) }
            volunteerPools: {}, // { stateCode: number (0-500) }
            voterFiles: {},     // { stateCode: { quality: 0-1.0, coverage: 0-1.0 } }
            contactHistory: {}, // { stateCode: { cumulativeContacts: 0 } }
            gotv: {}            // { stateCode: { activated: bool, weekActivated: int } }
        };
        
        // Initialize for all states
        for (var code in STATES) {
            gameData.groundOps.offices[code] = { count: 0, quality: 0, weekOpened: [] };
            gameData.groundOps.staffLevels[code] = 0;
            gameData.groundOps.volunteerPools[code] = 0;
            gameData.groundOps.voterFiles[code] = { quality: 0.2, coverage: 0.1 }; // Base minimal files
            gameData.groundOps.contactHistory[code] = { cumulativeContacts: 0 };
            gameData.groundOps.gotv[code] = { activated: false, weekActivated: 0 };
        }
    },

    // 2A. OPEN OFFICE
    openFieldOffice: function(stateCode, countyFips) {
        var cost = 1.8; // $1.8M
        var energyCost = 1;
        
        if (gameData.funds < cost) return false;
        if (gameData.energy < energyCost) return false;
        
        // Deduct cost
        gameData.funds -= cost;
        gameData.energy -= energyCost;
        
        var stateOps = gameData.groundOps.offices[stateCode];
        stateOps.count += 1;
        stateOps.weekOpened.push(gameData.currentWeek || 1);
        
        // Determine quality
        var qualityBump = 0.5;
        if ((gameData.currentWeek || 1) <= 5) qualityBump += 0.2;
        
        // If state margin is close (within 8%), it's a competitive office
        var stateMargin = 0;
        if (gameData.states && gameData.states[stateCode]) {
            stateMargin = Math.abs(gameData.states[stateCode].margin || 0);
        }
        if (stateMargin <= 8) qualityBump += 0.1;
        
        stateOps.quality = Math.min(1.0, stateOps.quality + qualityBump);
        
        Utils.addLog("Opened Field Office in " + STATES[stateCode].name + ". (-$" + cost + "M, -1 Energy)");
        return true;
    },

    // 2B. HIRE STAFF
    hireFieldStaff: function(stateCode, intensity) {
        var cost = 0.9 * intensity;
        
        if (gameData.funds < cost) return false;
        gameData.funds -= cost;
        
        var addedStaff = 0;
        if (intensity === 1) addedStaff = 10;
        else if (intensity === 2) addedStaff = 18;
        else if (intensity >= 3) addedStaff = 24;
        
        var currentStaff = gameData.groundOps.staffLevels[stateCode] || 0;
        gameData.groundOps.staffLevels[stateCode] = Math.min(60, currentStaff + addedStaff);
        
        Utils.addLog("Hired Field Staff in " + STATES[stateCode].name + " (Level " + intensity + "). (-$" + cost + "M)");
        return true;
    },

    getStaffMultiplier: function(stateCode) {
        var staffLevel = gameData.groundOps.staffLevels[stateCode] || 0;
        return 0.75 + ((staffLevel / 60) * 0.50);
    },

    // 2C. CANVASS
    deployCanvassers: function(stateCode, intensity) {
        var cost = 0.6 * intensity;
        var energyCost = 1;
        
        if (gameData.funds < cost) return false;
        if (gameData.energy < energyCost) return false;
        
        var offices = gameData.groundOps.offices[stateCode].count;
        var staffLevel = gameData.groundOps.staffLevels[stateCode];
        
        if (offices < 1) {
            Utils.showToast("Requires at least 1 Field Office in the state.");
            return false;
        }
        if (staffLevel < 10) {
            Utils.showToast("Requires at least 10 Field Staff in the state.");
            return false;
        }
        
        gameData.funds -= cost;
        gameData.energy -= energyCost;
        
        var staffMult = this.getStaffMultiplier(stateCode);
        var volPool = gameData.groundOps.volunteerPools[stateCode] || 0;
        var voterFileMult = 0.75 + (gameData.groundOps.voterFiles[stateCode].quality * 0.50);
        
        var contacts = (intensity * 15000) * staffMult * voterFileMult * Math.pow(Math.max(1, volPool) / 100, 0.4);
        contacts = Math.min(80000, contacts);
        
        // Log contacts
        gameData.groundOps.contactHistory[stateCode].cumulativeContacts += contacts;
        
        // Voter File Update
        var statePop = STATES[stateCode].population || 5000000; 
        var registeredVoters = statePop * 0.7; // Estimate
        var coverageDelta = (contacts / registeredVoters) * 0.6;
        gameData.groundOps.voterFiles[stateCode].coverage = Math.min(1.0, gameData.groundOps.voterFiles[stateCode].coverage + coverageDelta);
        
        // Margin shift (Persuadable)
        var persuadableContacts = contacts * 0.15;
        var canvassPersuasionRate = 0.055;
        // Approximation: shift state margin directly based on persuadable contacts vs registered voters
        var marginShift = (persuadableContacts / registeredVoters) * canvassPersuasionRate * 100; // in percentage points
        
        // Apply shift to counties
        var sign = gameData.selectedParty === 'D' ? 1 : (gameData.selectedParty === 'R' ? -1 : 0);
        if (sign !== 0 && typeof Counties !== 'undefined') {
            for (var fips in Counties.countyData) {
                var county = Counties.countyData[fips];
                if (county.s === stateCode && county.v) {
                    var shift = marginShift * sign; // Points to shift towards player
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
            if (gameData.states[stateCode]) {
                Counties.updateStateFromCounties(stateCode);
            }
        }
        
        Utils.addLog("Deployed Canvassers in " + STATES[stateCode].name + ". Made ~" + Math.round(contacts).toLocaleString() + " contacts. (-$" + cost + "M, -1 Energy)");
        return true;
    },

    // 2D. INVEST VOTER FILE
    investVoterFile: function(stateCode) {
        var cost = 1.2;
        if (gameData.funds < cost) return false;
        
        // Check cap
        var currentQuality = gameData.groundOps.voterFiles[stateCode].quality;
        if (currentQuality >= 1.0) {
            Utils.showToast("Voter file is already fully optimized.");
            return false;
        }
        
        gameData.funds -= cost;
        gameData.groundOps.voterFiles[stateCode].quality = Math.min(1.0, currentQuality + 0.20);
        gameData.groundOps.voterFiles[stateCode].coverage = Math.min(1.0, gameData.groundOps.voterFiles[stateCode].coverage + 0.10);
        
        Utils.addLog("Invested in Voter File data for " + STATES[stateCode].name + ". (-$1.2M)");
        return true;
    },

    // 2E. ACTIVATE GOTV
    activateGOTV: function(stateCode) {
        var baseCost = 2.5;
        var energyCost = 2;
        
        if (gameData.currentWeek < 14) {
            Utils.showToast("GOTV can only be activated in the final 4 weeks (Weeks 14-17).");
            return false;
        }
        
        if (gameData.groundOps.gotv[stateCode].activated) {
            Utils.showToast("GOTV already activated in this state.");
            return false;
        }
        
        // Volunteer cost reduction
        var volPool = gameData.groundOps.volunteerPools[stateCode] || 0;
        var costReduction = Math.min(0.5, (volPool / 500) * 0.5);
        var finalCost = baseCost - costReduction;
        
        if (gameData.funds < finalCost) return false;
        if (gameData.energy < energyCost) return false;
        
        gameData.funds -= finalCost;
        gameData.energy -= energyCost;
        
        gameData.groundOps.gotv[stateCode].activated = true;
        gameData.groundOps.gotv[stateCode].weekActivated = gameData.currentWeek;
        
        Utils.addLog("Activated GOTV Push in " + STATES[stateCode].name + "! (-$" + finalCost.toFixed(1) + "M, -2 Energy)");
        return true;
    },

    // Calculate GOTV lift (called during election / turnout calculation)
    getGOTVLift: function(stateCode) {
        if (!gameData.groundOps || !gameData.groundOps.gotv[stateCode] || !gameData.groundOps.gotv[stateCode].activated) return 0;
        
        var gotvBase = 0.045; // 4.5%
        
        var offices = gameData.groundOps.offices[stateCode].count;
        var staffLevel = gameData.groundOps.staffLevels[stateCode];
        var volPool = gameData.groundOps.volunteerPools[stateCode];
        var coverage = gameData.groundOps.voterFiles[stateCode].coverage;
        var cumContacts = gameData.groundOps.contactHistory[stateCode].cumulativeContacts;
        
        var infraMult = 0.5 + (Math.min(4, offices) / 4 * 0.25) + (staffLevel / 60 * 0.25) + (volPool / 500 * 0.25);
        var vfMult = 0.60 + (coverage * 0.80);
        var contactBonus = 1.0 + Math.min(0.40, (cumContacts / 200000) * 0.40);
        
        var turnoutLift = gotvBase * infraMult * vfMult * contactBonus;
        
        return Math.min(0.12, turnoutLift); // Cap at 12%
    },

    // Calculate Passive Turnout Bonus from Offices
    getPassiveOfficeBonus: function(stateCode) {
        if (!gameData.groundOps) return 0;
        var offices = gameData.groundOps.offices[stateCode].count;
        if (offices === 0) return 0;
        
        var baseBonus = 0;
        if (offices === 1) baseBonus = 0.008;
        else if (offices === 2) baseBonus = 0.014;
        else if (offices === 3) baseBonus = 0.018;
        else baseBonus = 0.021;
        
        // Late game multiplier for early offices
        if (gameData.currentWeek >= 13) {
            var earlyOffices = 0;
            for (var i = 0; i < gameData.groundOps.offices[stateCode].weekOpened.length; i++) {
                if (gameData.groundOps.offices[stateCode].weekOpened[i] <= 5) {
                    earlyOffices++;
                }
            }
            if (earlyOffices > 0) {
                baseBonus *= 1.35;
            }
        }
        
        return baseBonus;
    },

    // WEEKLY PROCESSING
    processWeekly: function() {
        if (!gameData.groundOps) return;
        
        var momentum = gameData.campaignMomentum || 0; // -1.0 to 1.0
        
        for (var code in STATES) {
            // 1. Staff Decay (5% natural, 10% if broke)
            var staffLevel = gameData.groundOps.staffLevels[code];
            if (staffLevel > 0) {
                var retentionCost = 0.3;
                if (gameData.funds >= retentionCost) {
                    gameData.funds -= retentionCost;
                    gameData.groundOps.staffLevels[code] = Math.max(0, staffLevel * 0.95);
                } else {
                    gameData.groundOps.staffLevels[code] = Math.max(0, staffLevel * 0.90);
                }
            }
            
            // 2. Volunteer Recruitment
            var offices = gameData.groundOps.offices[code].count;
            if (offices > 0) {
                var baseRecruit = 0;
                if (offices === 1) baseRecruit = 8;
                else if (offices === 2) baseRecruit = 14;
                else if (offices === 3) baseRecruit = 18;
                else baseRecruit = 20;
                
                var staffMult = this.getStaffMultiplier(code);
                var newVols = baseRecruit * (1 + (0.5 * momentum)) * staffMult;
                
                gameData.groundOps.volunteerPools[code] = Math.min(500, gameData.groundOps.volunteerPools[code] + newVols);
            }
            
            // 3. Volunteer Attrition (-3%)
            var volPool = gameData.groundOps.volunteerPools[code];
            if (volPool > 0) {
                gameData.groundOps.volunteerPools[code] = Math.max(0, volPool * 0.97);
            }
        }
    }
};
