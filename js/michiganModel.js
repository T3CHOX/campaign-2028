/* ==========================================================================
   DECISION 2028 - MICHIGAN MODEL OF VOTING & PREDICTIVE COUNTY SIMULATION
   ==========================================================================
   Based on The American Voter (Campbell et al.) & Markus (1982).
   
   Causal Structure (Figure 6.1):
     [Group Memberships]  \
                           --> [Party Identification] ---> [Attitudes to Candidates]    \
     [Family Influence]   /                          ---> [Attitudes to Policies]      ---> [Vote / Abstain]
                                                     ---> [Attitudes to Group Benefits]/
                                                     ---------------------------------> (Direct PID link)

   Key Systems:
   1. Partisanship & Party Registration Data (ICPSR 38506 NaNDA Historical Dataset)
   2. Individual Voter Choice & Turnout vs. Abstention
   3. Campaign "Predictive Model" with Ground Ops & Polling Ability Error Calibration
   4. Background Automatic County & State Grassroots Fundraising by Enthusiasm
   5. Dynamic Synthetic Micro-Voter Cohort Generation
   ========================================================================== */

var MichiganModel = {
    partisanshipData: {},
    predictionsCache: {},
    stateIntelligence: {}, // { [stateCode]: { pollingAbility: 0.50, internalPollsCount: 0 } }
    grassrootsTotals: {
        byCounty: {}, // { [fips]: { [party]: number } }
        byState: {},  // { [stateCode]: { [party]: number } }
        national: {}  // { [party]: number }
    },
    activeGrassrootsViewCandidate: 'player', // 'player', 'D', 'R', etc.
    isInitialized: false,

    // ─── STATUTORY VOTER REGISTRATION DEADLINES PER STATE ────────────────────
    VOTER_REGISTRATION_DEADLINES: {
        AL: { daysBefore: 15, sameDay: false, statute: "AL ST § 17-3-50", note: "15 days before election" },
        AK: { daysBefore: 30, sameDay: false, statute: "AK ST § 15.07.070(c)", note: "30 days before election" },
        AS: { daysBefore: 29, sameDay: false, statute: "U.S. Vote Foundation", note: "29 days before election" },
        AZ: { daysBefore: 29, sameDay: false, statute: "AZ ST § 16-120", note: "29 days before election" },
        AR: { daysBefore: 30, sameDay: false, statute: "AR CONST Amend. 51, § 9", note: "30 days before election" },
        CA: { daysBefore: 15, sameDay: true, statute: "CA ELEC § 2170", note: "15 days; same-day permitted 14 days before & on Election Day" },
        CO: { daysBefore: 8, sameDay: true, statute: "C.R.S.A. § 1-2-201", note: "8 days; same-day permitted on Election Day" },
        CT: { daysBefore: 7, sameDay: true, statute: "C.G.S.A. § 9-23g", note: "7 days; same-day permitted on Election Day" },
        DE: { daysBefore: 24, sameDay: false, statute: "DE ST TI 15 § 2036", note: "24 days before election" },
        DC: { daysBefore: 21, sameDay: true, statute: "DC ST § 1-1001.07", note: "21 days; same-day permitted on Election Day" },
        FL: { daysBefore: 29, sameDay: false, statute: "FL ST § 97.055", note: "29 days before election" },
        GA: { daysBefore: 29, sameDay: false, statute: "GA ST § 21-2-224", note: "29 days before election" },
        GU: { daysBefore: 15, sameDay: false, statute: "Guam Code Ann. tit. 3, § 3105", note: "15 days before election" },
        HI: { daysBefore: 10, sameDay: true, statute: "HI ST § 11-24", note: "10 days; same-day permitted on Election Day" },
        ID: { daysBefore: 11, sameDay: true, statute: "Idaho Code § 34-408", note: "11 days; same-day permitted on Election Day" },
        IL: { daysBefore: 28, sameDay: true, statute: "10 ILCS 5/4-6", note: "28 days (16 online); same-day permitted on Election Day" },
        IN: { daysBefore: 29, sameDay: false, statute: "IN ST § 3-7-13-10", note: "29 days before election" },
        IA: { daysBefore: 15, sameDay: true, statute: "IA ST § 48A.9", note: "15 days; same-day permitted on Election Day" },
        KS: { daysBefore: 21, sameDay: false, statute: "KS ST § 25-2311", note: "21 days before election" },
        KY: { daysBefore: 29, sameDay: false, statute: "KY ST § 116.045", note: "29 days before election" },
        LA: { daysBefore: 20, sameDay: false, statute: "LA R.S. 18:135", note: "30 days (20 online) before election" },
        ME: { daysBefore: 21, sameDay: true, statute: "ME ST T. 21-A § 121-A", note: "21 days; same-day permitted on Election Day" },
        MD: { daysBefore: 21, sameDay: true, statute: "MD ELEC LAW § 3-302", note: "21 days; same-day permitted on Election Day" },
        MA: { daysBefore: 10, sameDay: false, statute: "M.G.L.A. 51 § 26", note: "10 days before election" },
        MI: { daysBefore: 15, sameDay: true, statute: "M.C.L.A. 168.497", note: "15 days; same-day permitted on Election Day" },
        MN: { daysBefore: 21, sameDay: true, statute: "MN ST § 201.054", note: "21 days; same-day permitted on Election Day" },
        MS: { daysBefore: 30, sameDay: false, statute: "MS ST § 23-15-37", note: "30 days before election" },
        MO: { daysBefore: 27, sameDay: false, statute: "MO ST § 115.135", note: "27 days before election" },
        MT: { daysBefore: 1, sameDay: true, statute: "MT ST § 13-2-301", note: "Late registration ends noon day before Election Day" },
        NE: { daysBefore: 11, sameDay: false, statute: "NE ST § 32-302", note: "11 days in person (18 online/mail)" },
        NV: { daysBefore: 28, sameDay: true, statute: "NV ST § 293.560", note: "28 days; same-day permitted on Election Day" },
        NH: { daysBefore: 13, sameDay: true, statute: "NH ST § 654:7", note: "6-13 days; same-day permitted on Election Day" },
        NJ: { daysBefore: 21, sameDay: false, statute: "N.J.S.A. 19:31-6", note: "21 days before election" },
        NM: { daysBefore: 28, sameDay: true, statute: "NM ST § 1-4-8", note: "28 days; same-day permitted through Election Day" },
        NY: { daysBefore: 10, sameDay: false, statute: "NY ELEC § 5-210", note: "10 days before election" },
        NC: { daysBefore: 25, sameDay: true, statute: "NC ST § 163-82.6", note: "25 days; same-day permitted during early voting" },
        ND: { daysBefore: 0, sameDay: true, statute: "N/A", note: "No voter registration required" },
        MP: { daysBefore: 60, sameDay: false, statute: "C.N.M.I. Code Ann. tit. 1, § 6205", note: "60 days before election" },
        OH: { daysBefore: 30, sameDay: false, statute: "OH ST § 3503.19", note: "30 days before election" },
        OK: { daysBefore: 25, sameDay: false, statute: "OK ST T. 26 § 4-110.1", note: "25 days before election" },
        OR: { daysBefore: 21, sameDay: false, statute: "OR ST § 247.017", note: "21 days before election" },
        PA: { daysBefore: 15, sameDay: false, statute: "25 P.S. § 3071", note: "15 days before election" },
        PR: { daysBefore: 50, sameDay: false, statute: "16 L.P.R.A. § 4571", note: "50 days before election" },
        RI: { daysBefore: 30, sameDay: false, statute: "RI ST § 17-9.1-3", note: "30 days before election" },
        SC: { daysBefore: 30, sameDay: false, statute: "SC ST § 7-5-150", note: "30 days before election" },
        SD: { daysBefore: 15, sameDay: false, statute: "SD ST § 12-4-5", note: "15 days before election" },
        TN: { daysBefore: 30, sameDay: false, statute: "TN ST § 2-2-109", note: "30 days before election" },
        TX: { daysBefore: 30, sameDay: false, statute: "TX ELECTION § 13.143", note: "30 days before election" },
        UT: { daysBefore: 11, sameDay: true, statute: "UT ST § 20A-2-102.5", note: "11 days; same-day permitted on Election Day" },
        VT: { daysBefore: 0, sameDay: true, statute: "VT ST T. 17 § 2144", note: "Same-day registration through Election Day" },
        VA: { daysBefore: 11, sameDay: true, statute: "Va. Code § 24.2-416", note: "11 days; same-day permitted on Election Day" },
        VI: { daysBefore: 30, sameDay: false, statute: "VI ST T. 18 § 94", note: "30 days before election" },
        WA: { daysBefore: 8, sameDay: true, statute: "WA ST 29A.08.140", note: "8 days mail/online; in-person through Election Day" },
        WV: { daysBefore: 21, sameDay: false, statute: "WV ST § 3-2-6", note: "21 days before election" },
        WI: { daysBefore: 20, sameDay: true, statute: "WI ST § 6.28", note: "20 days; same-day permitted on Election Day" },
        WY: { daysBefore: 14, sameDay: true, statute: "WY ST § 22-3-102", note: "14 days; same-day permitted on Election Day" }
    },

    /**
     * Calculates the exact number of days remaining until Election Day.
     */
    getDaysUntilElection: function() {
        if (typeof gameData === 'undefined') return 120;
        if (gameData.currentDate && gameData.electionDay) {
            var msPerDay = 1000 * 60 * 60 * 24;
            var cur = gameData.currentDate instanceof Date ? gameData.currentDate : new Date(gameData.currentDate);
            var elec = gameData.electionDay instanceof Date ? gameData.electionDay : new Date(gameData.electionDay);
            var days = Math.round((elec.getTime() - cur.getTime()) / msPerDay);
            return Math.max(0, days);
        }
        var curWeek = (gameData && gameData.currentWeek) || 0;
        return Math.max(0, (18 - curWeek) * 7);
    },

    /**
     * Checks if voter registration is still open for a state based on its legal deadline.
     */
    isRegistrationOpen: function(stateCode) {
        if (!stateCode) return true;
        var code = stateCode.toUpperCase();
        var info = this.VOTER_REGISTRATION_DEADLINES[code];
        if (!info) return true;
        var daysLeft = this.getDaysUntilElection();
        if (info.sameDay) {
            return daysLeft >= 0; // Same-day registration permits registering through Election Day
        }
        return daysLeft > info.daysBefore;
    },

    /**
     * Returns full registration deadline details for a state.
     */
    getStateRegistrationInfo: function(stateCode) {
        if (!stateCode) return null;
        var code = stateCode.toUpperCase();
        var info = this.VOTER_REGISTRATION_DEADLINES[code];
        if (!info) return null;
        var daysLeft = this.getDaysUntilElection();
        var isOpen = info.sameDay ? (daysLeft >= 0) : (daysLeft > info.daysBefore);
        var daysToDeadline = info.sameDay ? daysLeft : Math.max(0, daysLeft - info.daysBefore);
        return {
            stateCode: code,
            daysBefore: info.daysBefore,
            sameDay: info.sameDay,
            statute: info.statute,
            note: info.note,
            isOpen: isOpen,
            daysUntilElection: daysLeft,
            daysToDeadline: daysToDeadline
        };
    },

    // ─── 1. DATA INITIALIZATION ──────────────────────────────────────────────
    init: function(callback) {
        var self = this;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'counties/county_partisanship_registration.json', true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    try {
                        self.partisanshipData = JSON.parse(xhr.responseText);
                        console.log('✓ Michigan Model: Loaded partisanship & registration for ' +
                            Object.keys(self.partisanshipData).length + ' counties');
                        self._mergeIntoCountyData();
                    } catch (e) {
                        console.error('Failed to parse county_partisanship_registration.json', e);
                    }
                } else {
                    console.warn('Could not load county_partisanship_registration.json, using procedural fallback.');
                }
                self.initStateIntelligence();
                self.initGrassrootsTotals();
                self.isInitialized = true;
                if (typeof callback === 'function') callback();
            }
        };
        xhr.send();
    },

    /**
     * Retrieves or calibrates the county's fluid party registration and partisanship data.
     * Guarantees regDem + regRep + regUnaff strictly equals regVoters in 100% of counties.
     */
    getCountyPartisanship: function(county) {
        if (!county) return null;
        if (county.partisanship && county.partisanship.regVoters > 0 && county.partisanship.regDem !== undefined) {
            return county.partisanship;
        }
        var fips = county.fips || (typeof Counties !== 'undefined' ? Counties.normalizeFips(county.fips) : String(county.fips));
        var normFips = typeof Counties !== 'undefined' ? Counties.normalizeFips(fips) : String(fips);
        var part = this.partisanshipData ? this.partisanshipData[normFips] : null;
        this._calibrateCountyPartisanship(county, part, normFips);
        return county.partisanship;
    },

    /**
     * Calibrates county party registration into a fluid, robust baseline:
     * - Uses past election registration numbers when valid and reasonable.
     * - Fixes missing/zero or nonpartisan open-primary records using CVAP and 2020/2024 vote lean.
     * - Guarantees regDem + regRep + regUnaff strictly equals regVoters in 100% of counties.
     */
    _calibrateCountyPartisanship: function(county, part, normFips) {
        var pop = Number(county.p) || 10000;
        var cvap = (county.demographics && county.demographics.cvap)
            ? Number(county.demographics.cvap)
            : Math.round(pop * 0.76);

        // 1. Fluid Baseline Registered Voters
        var regBaseline = 0;
        if (part && typeof part.regVoters === 'number' && part.regVoters > 100 &&
            part.regVoters >= (pop * 0.25) && part.regVoters <= (pop * 1.15)) {
            // Anchor to historical registered voter count
            regBaseline = part.regVoters;
        } else if (county.regVoters && county.regVoters > 100 &&
                   county.regVoters >= (pop * 0.25) && county.regVoters <= (pop * 1.15)) {
            regBaseline = county.regVoters;
        } else {
            // Fluid baseline calculated from CVAP (~76% - 80% voter registration rate)
            regBaseline = Math.round(cvap * 0.78);
            if (regBaseline < 50) regBaseline = Math.round(pop * 0.60);
        }

        county.regVoters = regBaseline;

        // 2. Determine party registration shares
        var v = county.originalV || county.simulationBaseV || county.v || { D: 50, R: 50 };
        var vD = Number(v.D) || 50;
        var vR = Number(v.R) || 50;
        var vTotal = vD + vR || 100;
        var dVoteLean = vD / vTotal;
        var rVoteLean = 1.0 - dVoteLean;

        var dPct = 0, rPct = 0, uPct = 0.24;

        if (part && typeof part.regDem === 'number' && typeof part.regRep === 'number' &&
            part.regDem > 0 && part.regRep > 0 && part.regVoters > 0) {
            var rawD = part.regDem / part.regVoters;
            var rawR = part.regRep / part.regVoters;
            uPct = Math.max(0.10, Math.min(0.38, Number(part.regUnaffPct) || (1.0 - (rawD + rawR))));
            var rawSum = rawD + rawR || 1;
            dPct = (rawD / rawSum) * (1.0 - uPct);
            rPct = (rawR / rawSum) * (1.0 - uPct);
        } else {
            // Open / nonpartisan primary states or missing ICPSR records:
            // Smoothly align with county's 2020/2024 historical partisan vote lean
            uPct = 0.24;
            dPct = (1.0 - uPct) * dVoteLean;
            rPct = (1.0 - uPct) * rVoteLean;
        }

        // Integer registration counts that sum to EXACTLY regBaseline
        var rDem = Math.round(regBaseline * dPct);
        var rRep = Math.round(regBaseline * rPct);
        var rUnaff = Math.max(0, regBaseline - (rDem + rRep));

        county.partisanship = {
            fips: normFips,
            regVoters: regBaseline,
            regDem: rDem,
            regRep: rRep,
            regUnaff: rUnaff,
            regDemPct: regBaseline > 0 ? (rDem / regBaseline) : dPct,
            regRepPct: regBaseline > 0 ? (rRep / regBaseline) : rPct,
            regUnaffPct: regBaseline > 0 ? (rUnaff / regBaseline) : uPct,
            partisanIndexDem: dVoteLean,
            partisanIndexRep: rVoteLean,
            turnoutPct: county.turnoutBase || (part && part.turnoutPct) || 0.66,
            newVotersDem: 0,
            newVotersRep: 0,
            newVotersUnaff: 0,
            newVotersTotal: 0
        };

        county.regDem = rDem;
        county.regRep = rRep;
        county.regUnaff = rUnaff;

        if (!county.turnoutBase && part && part.turnoutPct > 0) {
            county.turnoutBase = part.turnoutPct;
        }
    },

    _mergeIntoCountyData: function() {
        if (typeof Counties === 'undefined' || !Counties.countyData) return;
        for (var fips in Counties.countyData) {
            var normFips = Counties.normalizeFips(fips);
            var part = this.partisanshipData[normFips];
            var county = Counties.countyData[fips];
            if (!county) continue;

            this._calibrateCountyPartisanship(county, part, normFips);
        }
    },

    initStateIntelligence: function() {
        this.stateIntelligence = {};
        if (typeof STATES !== 'undefined') {
            for (var stateCode in STATES) {
                // Battleground states start with slightly more preexisting polling intelligence
                var tier = (typeof Polling !== 'undefined' && Polling.stateTiers && Polling.stateTiers[stateCode]) || 3;
                var baseIntel = tier === 1 ? 0.50 : (tier === 2 ? 0.42 : 0.35);
                this.stateIntelligence[stateCode] = {
                    pollingAbility: baseIntel,
                    internalPollsCount: 0,
                    lastPolledWeek: 0,
                    confidence: 0.55
                };
            }
        }
    },

    initGrassrootsTotals: function() {
        this.grassrootsTotals = {
            byCounty: {},
            byState: {},
            national: {}
        };
        var parties = ['D', 'R', 'G', 'L', 'I', 'PSL'];
        for (var p = 0; p < parties.length; p++) {
            this.grassrootsTotals.national[parties[p]] = 0;
        }
        if (typeof STATES !== 'undefined') {
            for (var code in STATES) {
                this.grassrootsTotals.byState[code] = {};
                for (var pi = 0; pi < parties.length; pi++) {
                    this.grassrootsTotals.byState[code][parties[pi]] = 0;
                }
            }
        }
    },

    // ─── 2. GROUND OPERATIONS & POLLING ABILITY CALIBRATION ───────────────────
    
    /**
     * Calculates the campaign's Ground Operations strength in a state [0.0 - 1.0].
     * Combines offices, staff, volunteer pool, voter file quality, and canvass contacts.
     */
    getGroundOpsStrength: function(stateCode) {
        if (typeof gameData === 'undefined' || !gameData.groundOps) return 0.2;
        var go = gameData.groundOps;
        var offices = (go.offices[stateCode] && go.offices[stateCode].count) || 0;
        var staff = go.staffLevels[stateCode] || 0;
        var vols = go.volunteerPools[stateCode] || 0;
        var vf = (go.voterFiles[stateCode] && go.voterFiles[stateCode].quality) || 0.2;
        var coverage = (go.voterFiles[stateCode] && go.voterFiles[stateCode].coverage) || 0.1;
        var contacts = (go.contactHistory[stateCode] && go.contactHistory[stateCode].cumulativeContacts) || 0;

        var officeScore = Math.min(1.0, offices / 4);
        var staffScore = Math.min(1.0, staff / 40);
        var volScore = Math.min(1.0, vols / 300);
        var vfScore = (vf * 0.6) + (coverage * 0.4);
        var contactScore = Math.min(1.0, contacts / 60000);

        return (officeScore * 0.25) + (staffScore * 0.25) + (volScore * 0.15) + (vfScore * 0.20) + (contactScore * 0.15);
    },

    /**
     * Gets the campaign's Polling Ability in a state [0.0 - 1.0].
     * Candidates start with a preexisting baseline polling infrastructure across each state.
     */
    getPollingAbility: function(stateCode) {
        if (!this.stateIntelligence[stateCode]) {
            return 0.40; // Preexisting baseline polling ability across each state (40%)
        }
        return this.stateIntelligence[stateCode].pollingAbility !== undefined
            ? this.stateIntelligence[stateCode].pollingAbility
            : 0.40;
    },

    /**
     * Calculates the campaign's Trend Sensitivity in a state [0.18 - 0.95].
     * Represents the model's ability to pick up on county-level shifts vs relying on historical baseline.
     * Without good polling ability, the model focuses heavily on historical 2020/2024 information.
     * Higher polling ability and ground ops allow the campaign to sharply detect live shifts.
     */
    getTrendSensitivity: function(stateCode) {
        var polling = this.getPollingAbility(stateCode);
        var groundOps = this.getGroundOpsStrength(stateCode);
        // Polling ability dominates trend detection (72%), ground intelligence supplies 28%
        var composite = (polling * 0.72) + (groundOps * 0.28);
        return Math.min(0.95, Math.max(0.18, composite));
    },

    /**
     * Calculates the overall Intelligence / Accuracy factor in a state [0.55 - 0.95].
     * Higher ground ops and state polling ability make the predictive model significantly sharper,
     * but NEVER exactly 100% accurate (capped at 0.95).
     */
    getStatePredictiveAccuracy: function(stateCode) {
        var groundOps = this.getGroundOpsStrength(stateCode);
        var polling = this.getPollingAbility(stateCode);

        // Preexisting baseline gives a minimum of 70% (0.70) accuracy.
        // Expanding ground ops adds up to +0.14, internal polling adds up to +0.14, reaching up to 98%.
        var composite = 0.70 + (groundOps * 0.14) + (polling * 0.14);
        return Math.min(0.98, Math.max(0.70, composite));
    },

    /**
     * Player action: Commission Internal Poll / State Polling Intelligence.
     * Costs funds and energy, increases polling ability and sharpens county predictive models.
     */
    commissionInternalPoll: function(stateCode) {
        var cost = 0.8; // $0.8M
        var energyCost = 1;

        if (gameData.funds < cost) {
            Utils.showToast("Need $" + cost + "M to commission internal polling intelligence!");
            return false;
        }
        if (gameData.energy < energyCost) {
            Utils.showToast("Need " + energyCost + " energy to conduct internal polling!");
            return false;
        }

        gameData.funds -= cost;
        gameData.energy -= energyCost;

        if (!this.stateIntelligence[stateCode]) {
            this.stateIntelligence[stateCode] = { pollingAbility: 0.50, internalPollsCount: 0, lastPolledWeek: 0 };
        }

        var intel = this.stateIntelligence[stateCode];
        intel.internalPollsCount++;
        intel.lastPolledWeek = gameData.currentWeek || 0;
        // Successive internal polls push polling ability from baseline 0.50 up toward 0.95+
        var currentAbility = (intel.pollingAbility !== undefined) ? intel.pollingAbility : 0.50;
        var bump = 0.22 * Math.pow(0.75, Math.max(0, intel.internalPollsCount - 1));
        intel.pollingAbility = Math.min(0.98, currentAbility + bump);
        intel.confidence = this.getStatePredictiveAccuracy(stateCode);

        // Invalidate predictions cache for this state to immediately reflect clearer forecast
        this.clearPredictionCacheForState(stateCode);

        var stateName = (typeof STATES !== 'undefined' && STATES[stateCode]) ? STATES[stateCode].name : stateCode;
        Utils.addLog("📊 Commissioned Internal Polling Operation in " + stateName +
            ". Predictive model accuracy increased to " + Math.round(intel.confidence * 100) + "%. (-$" + cost + "M, -1 Energy)");
        Utils.showToast("📊 Internal Poll in " + stateName + " complete! County predictive accuracy is now " + Math.round(intel.confidence * 100) + "%.");

        if (typeof Campaign !== 'undefined') {
            if (typeof Campaign.updateHUD === 'function') Campaign.updateHUD();
            if (typeof Campaign.colorMap === 'function') Campaign.colorMap();
        }
        if (typeof Counties !== 'undefined') {
            if (typeof Counties.colorCountyMap === 'function') Counties.colorCountyMap();
            if (gameData.selectedCounty && Counties.countyData && Counties.countyData[gameData.selectedCounty] && typeof Counties.selectCounty === 'function') {
                Counties.selectCounty(gameData.selectedCounty);
            }
        }
        return true;
    },

    clearPredictionCacheForState: function(stateCode) {
        for (var fips in this.predictionsCache) {
            if (this.predictionsCache[fips] && this.predictionsCache[fips].stateCode === stateCode) {
                delete this.predictionsCache[fips];
            }
        }
    },

    // ─── 3. THE MICHIGAN MODEL OF VOTING (CORE SIMULATION) ────────────────────

    /**
     * Evaluates a county's true voter preferences and turnout under the Michigan Model.
     * Anchors on the simulation engine's active county election calculation at that exact moment,
     * modulates candidate standing via Michigan Model attitudes (Candidate, Policy, Group, Party ID),
     * and strictly enforces ballot access per state (off-ballot candidates receive 0 votes and 0 share).
     */
    evaluateCountyTrueState: function(county) {
        if (!county) return null;
        var fips = county.fips || (typeof Counties !== 'undefined' ? Counties.normalizeFips(county.fips) : String(county.fips));
        var stateCode = county.s || (county.fips && typeof Counties !== 'undefined' ? Counties.getStateCodeFromFips(county.fips.substring(0, 2)) : 'PA');
        var activeCandidates = (typeof Utils !== 'undefined' && Utils.getActiveCandidates) ? Utils.getActiveCandidates() : [];
        if (!activeCandidates || activeCandidates.length === 0) return null;

        var part = county.partisanship || (this.partisanshipData && this.partisanshipData[fips]) || {};
        var regVoters = (part.regVoters && part.regVoters > 0) ? part.regVoters : (county.regVoters || Math.round((county.p || 10000) * 0.72));

        // Ballot access map for candidates in this state
        var onBallotMap = {};
        for (var i = 0; i < activeCandidates.length; i++) {
            var p = activeCandidates[i].party;
            onBallotMap[p] = (typeof Utils !== 'undefined' && Utils.isPartyOnBallot)
                ? Utils.isPartyOnBallot(p, stateCode)
                : (p === 'D' || p === 'R');
        }

        // Get live election vote totals from engine at this exact moment
        var engineTotals = null;
        if (typeof Counties !== 'undefined' && typeof Counties.calculateCountyVoteTotals === 'function') {
            engineTotals = Counties.calculateCountyVoteTotals(county, { reportingFactor: 1, decidedMultiplier: 1, errorFactor: 1 });
        }
        if (!engineTotals && county.v) {
            engineTotals = Object.assign({}, county.v);
        }

        // Filter valid votes: off-ballot candidates receive 0 votes and 0 share
        var validVotes = {};
        var totalValidVotes = 0;
        for (var i = 0; i < activeCandidates.length; i++) {
            var p = activeCandidates[i].party;
            if (onBallotMap[p]) {
                var v = (engineTotals && engineTotals[p] !== undefined) ? Math.max(0, engineTotals[p]) : 0;
                validVotes[p] = v;
                totalValidVotes += v;
            } else {
                validVotes[p] = 0;
            }
        }

        // Fallback for edge cases where all totals were 0
        if (totalValidVotes <= 0) {
            var pD = (part.partisanIndexDem !== undefined) ? part.partisanIndexDem : 0.5;
            var pR = (part.partisanIndexRep !== undefined) ? part.partisanIndexRep : 0.5;
            validVotes['D'] = pD * 1000;
            validVotes['R'] = pR * 1000;
            totalValidVotes = validVotes['D'] + validVotes['R'];
        }

        // Base calibrated vote shares across on-ballot candidates
        var baseShares = {};
        for (var i = 0; i < activeCandidates.length; i++) {
            var p = activeCandidates[i].party;
            baseShares[p] = totalValidVotes > 0 ? (validVotes[p] / totalValidVotes) : 0.0;
        }

        // Evaluate Michigan Model attitude forces and candidate enthusiasm
        var candAttitudes = {};
        var candEnthusiasm = {};
        var playerParty = (typeof gameData !== 'undefined' && gameData.selectedParty) ? gameData.selectedParty : 'D';

        for (var i = 0; i < activeCandidates.length; i++) {
            var entry = activeCandidates[i];
            var cand = entry.cand;
            var party = entry.party;

            if (!onBallotMap[party]) {
                candAttitudes[party] = -999;
                candEnthusiasm[party] = 0;
                continue;
            }

            // 1. Candidate Personal Attitude Force (Charisma, Net Favorability, Rallies, TV Ads)
            var charisma = (cand && cand.charisma) || 1.0;
            var favorabilityNet = 0;
            if (typeof Favorability !== 'undefined') {
                var favObj = Favorability.get(cand.id, county);
                favorabilityNet = (favObj.favorable - favObj.unfavorable) / 100; // -1.0 to 1.0
            }
            var tvBonus = 0;
            if (county.mediaMarket && gameData.ads && gameData.ads.tvSaturation) {
                tvBonus = Math.min(0.12, ((gameData.ads.tvSaturation[county.mediaMarket] || 0) / 100) * 0.12);
            }
            var visitBonus = (county.visited ? 0.05 : 0) + ((county.rallies || 0) * 0.03);
            var aCandidate = (charisma - 1.0) * 0.35 + (favorabilityNet * 0.40) + tvBonus + visitBonus;

            // 2. Policy Alignment Force
            var aPolicy = 0;
            if (typeof Electorate !== 'undefined' && Electorate.ready && Electorate.countyResult) {
                var eRes = Electorate.countyResult(county);
                if (eRes && eRes.byParty && eRes.total > 0) {
                    var eShare = (eRes.byParty[party] || 0) / eRes.total;
                    aPolicy = (eShare - 0.5) * 0.8;
                }
            }

            // 3. Group Benefits Force
            var aGroup = 0;
            if (cand && cand.groupBoosts && county.ig) {
                for (var gId in cand.groupBoosts) {
                    var share = (county.ig[gId] || 0) / 100;
                    aGroup += share * (cand.groupBoosts[gId] || 0) * 0.015;
                }
            }

            // 4. Party ID Force
            var aParty = 0;
            if (party === 'D') aParty = ((part.partisanIndexDem || 0.5) - 0.5) * 1.5;
            else if (party === 'R') aParty = ((part.partisanIndexRep || 0.5) - 0.5) * 1.5;
            else aParty = -0.5;

            var utility = (aParty * 0.35) + (aCandidate * 0.30) + (aPolicy * 0.20) + (aGroup * 0.15);
            candAttitudes[party] = utility;

            // Voter Enthusiasm (Drives Turnout vs. Abstention)
            var enthusiasm = 0.55 + (aCandidate * 0.30) + (aGroup * 0.20) +
                (((gameData && gameData.campaignMomentum) || 0) * 0.15 * (party === playerParty ? 1 : -0.5));
            candEnthusiasm[party] = Math.max(0.15, Math.min(0.95, enthusiasm));
        }

        // Apply Michigan Model local campaign shifts to baseline shares
        var adjustedShares = {};
        var sumAdj = 0;
        for (var i = 0; i < activeCandidates.length; i++) {
            var p = activeCandidates[i].party;
            if (!onBallotMap[p]) {
                adjustedShares[p] = 0.0;
                continue;
            }
            var att = candAttitudes[p] || 0;
            var attMult = Math.max(0.70, Math.min(1.30, 1.0 + (att * 0.15)));
            var adj = baseShares[p] * attMult;
            adjustedShares[p] = adj;
            sumAdj += adj;
        }

        // True county undecided percentage
        var countyUndecided = (county && county.undecided !== undefined) ? Number(county.undecided) : 8.0;
        var trueUndecidedPct = Math.max(1.0, Math.min(25.0, countyUndecided));
        var decidedPoolFraction = (100.0 - trueUndecidedPct) / 100.0;

        // Choice shares among the entire electorate including undecided
        // (Sum of on-ballot candidate shares + trueUndecidedPct/100 = 1.0)
        var candidateChoiceShares = {};
        for (var i = 0; i < activeCandidates.length; i++) {
            var p = activeCandidates[i].party;
            candidateChoiceShares[p] = (onBallotMap[p] && sumAdj > 0) ? ((adjustedShares[p] / sumAdj) * decidedPoolFraction) : 0.0;
        }

        // Turnout vs. Abstention
        var baseTurnoutRate = part.turnoutPct || county.turnoutBase || 0.65;
        var avgEnthusiasm = 0;
        for (var ep in candEnthusiasm) {
            if (candidateChoiceShares[ep] > 0) {
                avgEnthusiasm += candEnthusiasm[ep] * (candidateChoiceShares[ep] / (decidedPoolFraction || 1));
            }
        }
        var gotvLift = 0;
        if (typeof GroundOps !== 'undefined' && GroundOps.getGOTVLift) {
            gotvLift = GroundOps.getGOTVLift(stateCode) * (playerParty === 'D' ? 0.6 : 0.6);
        }

        var effectiveTurnoutRate = Math.max(0.35, Math.min(0.88,
            baseTurnoutRate * (0.85 + avgEnthusiasm * 0.30) + gotvLift));

        var ballotsCast = Math.round(regVoters * effectiveTurnoutRate);
        var abstainCount = Math.max(0, regVoters - ballotsCast);

        var trueVotes = {};
        for (var vp in candidateChoiceShares) {
            trueVotes[vp] = Math.round(ballotsCast * candidateChoiceShares[vp]);
        }
        trueVotes['Undecided'] = Math.round(ballotsCast * (trueUndecidedPct / 100.0));

        return {
            fips: fips,
            stateCode: stateCode,
            regVoters: regVoters,
            ballotsCast: ballotsCast,
            abstainCount: abstainCount,
            turnoutRate: effectiveTurnoutRate,
            candidateChoiceShares: candidateChoiceShares,
            undecidedPct: trueUndecidedPct,
            candEnthusiasm: candEnthusiasm,
            candAttitudes: candAttitudes,
            trueVotes: trueVotes
        };
    },

    // ─── 4. THE PREDICTIVE MODEL (WHAT CAMPAIGNS SEE) ─────────────────────────

    /**
     * Generates the "Predictive Model" for a county.
     * Estimates the vote share if the election were to occur at that exact moment.
     * Guarantees:
     * 1. Predicted candidate shares PLUS Undecided sum to EXACTLY 100.0%.
     * 2. Candidates without ballot access in the state receive 0 votes and 0.0% share.
     * 3. Maximum predictive error in each county is STRICTLY bounded to at most 15.0%.
     * 4. As ground operations and polling intelligence improve, accuracy sharpens (down to ±2.5%).
     */
    getCountyPrediction: function(county) {
        if (!county) return null;
        var fips = county.fips || (typeof Counties !== 'undefined' ? Counties.normalizeFips(county.fips) : String(county.fips));
        var currentWeek = (typeof gameData !== 'undefined' && gameData.currentWeek) || 0;
        var cacheKey = fips + '_' + currentWeek;

        if (this.predictionsCache[cacheKey]) {
            return this.predictionsCache[cacheKey];
        }

        var trueState = this.evaluateCountyTrueState(county);
        if (!trueState) return null;

        var stateCode = trueState.stateCode;
        var accuracy = this.getStatePredictiveAccuracy(stateCode); // e.g. 0.55 - 0.95
        var trendSensitivity = this.getTrendSensitivity(stateCode); // e.g. 0.18 - 0.95

        // Deterministic pseudo-random seed based on county FIPS and week
        var fipsNum = parseInt(fips.replace(/\D/g, ''), 10) || 12345;
        var seed = (fipsNum * 9301 + (currentWeek + 1) * 49297) % 233280;
        var pseudoRand1 = ((seed / 233280) - 0.5) * 2; // -1.0 to +1.0
        var pseudoRand2 = ((((seed * 7) % 233280) / 233280) - 0.5) * 2; // -1.0 to +1.0

        // Maximum error is STRICTLY bounded to at most 15.0% (0.15)
        var maxError = 0.025 + (1.0 - accuracy) * 0.22;
        maxError = Math.min(0.15, maxError); // Absolute hard cap at 15.0%

        // Filter on-ballot parties in this state
        var onBallotParties = [];
        var allParties = trueState.isPrimary ? Object.keys(trueState.candidateChoiceShares) : ['D', 'R', 'G', 'L', 'I', 'PSL'];
        for (var p in trueState.candidateChoiceShares) {
            var onBallot = trueState.isPrimary || ((typeof Utils !== 'undefined' && Utils.isPartyOnBallot)
                ? Utils.isPartyOnBallot(p, stateCode)
                : (p === 'D' || p === 'R'));
            if (onBallot) {
                onBallotParties.push(p);
            }
        }

        // 1. Historical Baseline Decided Shares (Average of 2020 & 2024 elections from county.originalV)
        var histVotes = trueState.isPrimary ? trueState.baselineShares : county.originalV || county.simulationBaseV || county.v || { D: 50, R: 50 };
        var sumHistOnBallot = 0;
        for (var i = 0; i < onBallotParties.length; i++) {
            var p = onBallotParties[i];
            sumHistOnBallot += (histVotes[p] !== undefined ? Math.max(0, Number(histVotes[p])) : 0);
        }
        if (sumHistOnBallot <= 0) {
            sumHistOnBallot = (Number(histVotes.D) || 50) + (Number(histVotes.R) || 50);
        }
        var histDecidedShares = {};
        for (var i = 0; i < onBallotParties.length; i++) {
            var p = onBallotParties[i];
            var hv = (histVotes[p] !== undefined ? Math.max(0, Number(histVotes[p])) : (p === 'D' ? 50 : (p === 'R' ? 50 : 0)));
            histDecidedShares[p] = hv / (sumHistOnBallot || 1);
        }

        // 2. Live True Choice Share among Decided Voters at this exact moment
        var sumTrueDecided = 0;
        for (var i = 0; i < onBallotParties.length; i++) {
            sumTrueDecided += (trueState.candidateChoiceShares[onBallotParties[i]] || 0);
        }
        var liveDecidedShares = {};
        for (var i = 0; i < onBallotParties.length; i++) {
            var p = onBallotParties[i];
            liveDecidedShares[p] = sumTrueDecided > 0 ? ((trueState.candidateChoiceShares[p] || 0) / sumTrueDecided) : histDecidedShares[p];
        }

        // 3. Trend Blending:
        // Candidates with low polling ability have low trend sensitivity, meaning their model
        // is heavily anchored to the 2020/2024 historical baseline and misses live campaign swings.
        // Internal polls and ground ops sharpen trend sensitivity up to 90%+.
        var blendedDecidedShares = {};
        for (var i = 0; i < onBallotParties.length; i++) {
            var p = onBallotParties[i];
            blendedDecidedShares[p] = (1.0 - trendSensitivity) * histDecidedShares[p] + trendSensitivity * liveDecidedShares[p];
        }

        // 4. Undecided Noise & Decided Pool Target
        var baseUndecided = trueState.undecidedPct || 8.0;
        var undecidedNoise = pseudoRand2 * (maxError * 0.35) * 100.0;
        var noisyUndecided = Math.max(1.0, Math.min(25.0, baseUndecided + undecidedNoise));
        var decidedPoolTarget = 100.0 - noisyUndecided;

        // 5. Polling Noise and 15% Error Cap
        var rawPredicted = {};
        var totalRawPred = 0;
        for (var i = 0; i < onBallotParties.length; i++) {
            var p = onBallotParties[i];
            var noise = 0;
            if (trueState.isPrimary) noise = (PrimaryCampaign.stable(fips+':prediction:'+currentWeek+':'+p)*2-1)*(maxError*0.85);
            else if (p === 'D') noise = pseudoRand1 * (maxError * 0.85);
            else if (p === 'R') noise = -pseudoRand1 * (maxError * 0.85);
            else noise = pseudoRand2 * (maxError * 0.35);

            var noisyShare = Math.max(0.001, blendedDecidedShares[p] + noise);
            // Strict check: error relative to live true standing cannot exceed 15.0%
            if (Math.abs(noisyShare - liveDecidedShares[p]) > 0.15) {
                noisyShare = liveDecidedShares[p] + Math.sign(noisyShare - liveDecidedShares[p]) * 0.149;
            }
            noisyShare = Math.max(0.001, noisyShare);
            rawPredicted[p] = noisyShare;
            totalRawPred += noisyShare;
        }

        // 6. Normalize Decided Candidates across decidedPoolTarget
        var predictedShares = {};
        for (var api = 0; api < allParties.length; api++) {
            predictedShares[allParties[api]] = 0.0;
        }

        var sumDecided = 0;
        for (var i = 0; i < onBallotParties.length; i++) {
            var p = onBallotParties[i];
            var pct = (rawPredicted[p] / (totalRawPred || 1)) * decidedPoolTarget;
            pct = Math.round(pct * 10) / 10;
            predictedShares[p] = pct;
            sumDecided += pct;
        }

        // 7. Undecided share so sum (candidates + undecided) is EXACTLY 100.0%
        var finalUndecided = Math.round((100.0 - sumDecided) * 10) / 10;
        predictedShares['Undecided'] = finalUndecided;

        var totalSumCheck = sumDecided + finalUndecided;
        if (Math.abs(totalSumCheck - 100.0) > 0.0001 && onBallotParties.length > 0) {
            var diff = Math.round((100.0 - totalSumCheck) * 10) / 10;
            predictedShares[onBallotParties[0]] = Math.round((predictedShares[onBallotParties[0]] + diff) * 10) / 10;
        }

        // Turnout and ballots
        var turnoutNoise = (pseudoRand2 * 0.5) * maxError;
        var predictedTurnoutRate = Math.max(trueState.isPrimary?0.01:0.35, Math.min(0.88, trueState.turnoutRate + turnoutNoise));
        var predictedBallotsCast = Math.round(trueState.regVoters * predictedTurnoutRate);

        var predictedVotes = {};
        for (var api = 0; api < allParties.length; api++) {
            var p = allParties[api];
            if (predictedShares[p] > 0) {
                predictedVotes[p] = Math.round(predictedBallotsCast * (predictedShares[p] / 100.0));
            } else {
                predictedVotes[p] = 0;
            }
        }
        predictedVotes['Undecided'] = Math.round(predictedBallotsCast * (predictedShares['Undecided'] / 100.0));

        var sortedParties = onBallotParties.slice().sort(function(a, b) {
            return (predictedShares[b] || 0) - (predictedShares[a] || 0);
        });
        var leader = sortedParties[0] || 'D';
        var runnerUp = sortedParties[1] || sortedParties[0];
        var margin = (predictedShares[leader] || 0) - (predictedShares[runnerUp] || 0);
        var maxMarginErrorPct = Math.round(maxError * 1000) / 10;

        var prediction = {
            fips: fips,
            stateCode: stateCode,
            isPredictiveModel: true,
            accuracy: accuracy,
            accuracyLabel: Math.round(accuracy * 100) + '%',
            trendSensitivity: trendSensitivity,
            trendSensitivityLabel: Math.round(trendSensitivity * 100) + '%',
            maxErrorPct: maxMarginErrorPct,
            confidenceTier: accuracy >= 0.8 ? 'High' : (accuracy >= 0.65 ? 'Moderate' : 'Low'),
            regVoters: trueState.regVoters,
            predictedBallotsCast: predictedBallotsCast,
            predictedTurnoutRate: predictedTurnoutRate,
            predictedShares: predictedShares,
            undecidedPct: predictedShares['Undecided'],
            predictedVotes: predictedVotes,
            leader: leader,
            margin: margin,
            enthusiasm: trueState.candEnthusiasm,
            trueState: trueState
        };

        this.predictionsCache[cacheKey] = prediction;
        return prediction;
    },

    // ─── 5. VOTER REGISTRATION ENGINE & DEADLINES (WEEKLY PROCESS) ─────────────

    /**
     * Automatic weekly voter registration simulation.
     * Voters register over time driven by candidate enthusiasm, campaign activity,
     * and ground operations up until the state's legal registration deadline.
     * Once a state's deadline passes, rolls are locked and zero new voters may be added.
     */
    processWeeklyVoterRegistration: function() {
        if (typeof Counties === 'undefined' || !Counties.countyData) return;
        var activeCandidates = (typeof Utils !== 'undefined' && Utils.getActiveCandidates) ? Utils.getActiveCandidates() : [];
        if (!activeCandidates || activeCandidates.length === 0) return;

        var playerParty = (typeof gameData !== 'undefined' && gameData.selectedParty) ? gameData.selectedParty : 'D';
        var totalNewNationwide = 0;

        for (var fips in Counties.countyData) {
            var county = Counties.countyData[fips];
            if (!county) continue;
            var stateCode = county.s || (county.fips && typeof Counties !== 'undefined' ? Counties.getStateCodeFromFips(county.fips.substring(0, 2)) : 'PA');
            
            // Check state registration deadline
            var isOpen = this.isRegistrationOpen(stateCode);
            if (!isOpen) {
                // Deadline passed: NO new voters can be added to any county in this state!
                continue;
            }

            var part = this.getCountyPartisanship(county);
            if (!part) continue;

            var pop = Number(county.p) || 10000;
            var cvap = (county.demographics && county.demographics.cvap)
                ? Number(county.demographics.cvap)
                : Math.round(pop * 0.76);
            
            // Registration ceiling: cannot exceed 95% of citizen voting-age population
            var maxReg = Math.round(cvap * 0.95);
            var unregisteredPool = Math.max(0, maxReg - part.regVoters);
            if (unregisteredPool <= 0) continue;

            var trueState = this.evaluateCountyTrueState(county);
            var demEnthusiasm = (trueState && trueState.candEnthusiasm && trueState.candEnthusiasm['D']) || 0.50;
            var repEnthusiasm = (trueState && trueState.candEnthusiasm && trueState.candEnthusiasm['R']) || 0.50;

            // Ground ops & campaign presence multiplier
            var goStrength = this.getGroundOpsStrength(stateCode);
            var eventBonus = (county.visited ? 0.25 : 0) + ((county.rallies || 0) * 0.15);
            var demGoMult = 1.0 + (playerParty === 'D' ? (goStrength * 0.8 + eventBonus) : (goStrength * 0.2));
            var repGoMult = 1.0 + (playerParty === 'R' ? (goStrength * 0.8 + eventBonus) : (goStrength * 0.2));

            // Weekly registration rate: ~0.08% to 0.25% of unregistered pool
            var baseRegRate = 0.0012; // 0.12% per week baseline
            var demRate = baseRegRate * Math.pow(demEnthusiasm / 0.50, 1.8) * demGoMult;
            var repRate = baseRegRate * Math.pow(repEnthusiasm / 0.50, 1.8) * repGoMult;
            var unaffRate = baseRegRate * 0.5;

            var newDem = Math.round(unregisteredPool * demRate * (part.partisanIndexDem || 0.5));
            var newRep = Math.round(unregisteredPool * repRate * (part.partisanIndexRep || 0.5));
            var newUnaff = Math.round(unregisteredPool * unaffRate * 0.35);

            var totalNewCounty = newDem + newRep + newUnaff;
            if (totalNewCounty <= 0) continue;

            if (totalNewCounty > unregisteredPool) {
                var factor = unregisteredPool / totalNewCounty;
                newDem = Math.round(newDem * factor);
                newRep = Math.round(newRep * factor);
                newUnaff = Math.max(0, unregisteredPool - (newDem + newRep));
                totalNewCounty = unregisteredPool;
            }

            // Update county registration totals
            part.regDem += newDem;
            part.regRep += newRep;
            part.regUnaff += newUnaff;
            part.regVoters += totalNewCounty;
            county.regVoters = part.regVoters;
            county.regDem = part.regDem;
            county.regRep = part.regRep;
            county.regUnaff = part.regUnaff;

            // Update shares
            part.regDemPct = part.regDem / part.regVoters;
            part.regRepPct = part.regRep / part.regVoters;
            part.regUnaffPct = part.regUnaff / part.regVoters;

            // Track campaign cumulative additions
            part.newVotersDem = (part.newVotersDem || 0) + newDem;
            part.newVotersRep = (part.newVotersRep || 0) + newRep;
            part.newVotersUnaff = (part.newVotersUnaff || 0) + newUnaff;
            part.newVotersTotal = (part.newVotersTotal || 0) + totalNewCounty;

            totalNewNationwide += totalNewCounty;
        }

        // Invalidate cached county predictions so models update with new registered voters
        this.predictionsCache = {};

        if (totalNewNationwide > 0) {
            Utils.addLog("📋 Voter Registration Drive: +" + totalNewNationwide.toLocaleString() +
                " newly registered voters added across states where registration remains open.");
        }
    },

    // ─── 5. COUNTY & STATE GRASSROOTS FUNDRAISING (BACKGROUND PROCESS) ────────

    /**
     * Automatic weekly grassroots fundraising execution.
     * Each county generates small-dollar donations each week based on:
     * - Supporter base size & partisanship in the county
     * - Supporter enthusiasm (Michigan Model)
     * - County demographic economic capacity (median income)
     * - Ground operation strength in the state (field offices/staff boost)
     * - Candidate attributes (charisma, buffs like "Donor Magnet", momentum)
     */
    processWeeklyGrassroots: function() {
        if (!Counties.countyData) return;
        var activeCandidates = Utils.getActiveCandidates();
        if (!activeCandidates || activeCandidates.length === 0) return;

        var primary = typeof PrimaryNative !== 'undefined' && PrimaryNative.active();
        var playerParty = primary ? gameData.candidate.id : (gameData.selectedParty || 'D');
        var weeklyStateYields = {};
        var weeklyCandidateYields = {};
        var topCounty = { name: '', amount: 0, state: '' };

        for (var c = 0; c < activeCandidates.length; c++) {
            weeklyCandidateYields[primary ? activeCandidates[c].cand.id : activeCandidates[c].party] = 0;
        }

        for (var fips in Counties.countyData) {
            var county = Counties.countyData[fips];
            var normFips = Counties.normalizeFips(fips);
            var stateCode = county.s || 'PA';
            var trueState = this.evaluateCountyTrueState(county);
            if (!trueState) continue;

            if (!this.grassrootsTotals.byCounty[normFips]) {
                this.grassrootsTotals.byCounty[normFips] = {};
            }
            if (!weeklyStateYields[stateCode]) {
                weeklyStateYields[stateCode] = {};
            }

            // County economic capacity factor (baseline median income ~$65,000)
            var context = county.context || (county.demographics && county.demographics.context) || {};
            var medianIncome = context.medianIncome || 65000;
            var incomeFactor = Math.max(0.6, Math.min(1.8, medianIncome / 65000));

            // State ground operations multiplier (field offices mobilize local donor networks)
            var goStrength = this.getGroundOpsStrength(stateCode);
            var groundOpsDonorMult = 0.85 + (goStrength * 0.65);

            for (var i = 0; i < activeCandidates.length; i++) {
                var candEntry = activeCandidates[i];
                var cand = candEntry.cand;
                var party = primary ? cand.id : candEntry.party;

                // Off-ballot candidates cannot collect grassroots funds in this state
                if (!primary && typeof Utils !== 'undefined' && Utils.isPartyOnBallot && !Utils.isPartyOnBallot(party, stateCode)) {
                    continue;
                }

                // Candidate attributes
                var charisma = (cand && cand.charisma) || 1.0;
                var donorMagnetBuff = (cand && (cand.buff === 'Donor Magnet' || cand.id === 'harris')) ? 1.35 : 1.0;
                var primaryActor = primary && PrimaryCampaign.actor(cand.id);
                var momentum = primaryActor ? Math.max(-1, Math.min(1, (primaryActor.momentum || 0)/20)) : (party === playerParty) ? (gameData.campaignMomentum || 0) : 0;
                var momentumMult = Math.max(0.7, 1.0 + (momentum * 0.4));

                // Supporter base in county
                var supporterShare = trueState.candidateChoiceShares[party] || 0;
                var supporterBase = trueState.regVoters * supporterShare;

                // Enthusiasm directly drives donor conversion rate
                var enthusiasm = trueState.candEnthusiasm[party] || 0.55;
                // Higher enthusiasm produces exponentially more small-dollar donors
                var donorRate = 0.0006 * Math.pow(enthusiasm, 2.2);

                var estimatedDonors = Math.round(supporterBase * donorRate);
                var avgDonation = 28 * incomeFactor * (0.8 + Math.random() * 0.4); // ~$25-$45 avg small donation

                // Total dollars in millions from this county this week
                var dollarsRaisedMillions = (estimatedDonors * avgDonation) / 1000000;

                // Scale by attributes
                var donorFieldMult = primaryActor && party !== playerParty ? 0.85 + Math.min(1, PrimaryCampaign.org(primaryActor,stateCode).offices * 0.15 + PrimaryCampaign.org(primaryActor,stateCode).staff / 100) * 0.65 : groundOpsDonorMult;
                dollarsRaisedMillions *= charisma * donorMagnetBuff * momentumMult * donorFieldMult;
                if(primaryActor) primaryActor.donors += estimatedDonors;

                // Accumulate totals
                var prevCountyTotal = this.grassrootsTotals.byCounty[normFips][party] || 0;
                this.grassrootsTotals.byCounty[normFips][party] = prevCountyTotal + dollarsRaisedMillions;

                var prevStateTotal = (this.grassrootsTotals.byState[stateCode] && this.grassrootsTotals.byState[stateCode][party]) || 0;
                if (!this.grassrootsTotals.byState[stateCode]) this.grassrootsTotals.byState[stateCode] = {};
                this.grassrootsTotals.byState[stateCode][party] = prevStateTotal + dollarsRaisedMillions;

                this.grassrootsTotals.national[party] = (this.grassrootsTotals.national[party] || 0) + dollarsRaisedMillions;
                weeklyCandidateYields[party] += dollarsRaisedMillions;
                weeklyStateYields[stateCode][party] = (weeklyStateYields[stateCode][party] || 0) + dollarsRaisedMillions;

                if (party === playerParty && dollarsRaisedMillions > topCounty.amount) {
                    topCounty.amount = dollarsRaisedMillions;
                    topCounty.name = county.n || 'County';
                    topCounty.state = stateCode;
                }
            }
        }

        // Apply funds automatically to player and opponents
        var playerRaised = weeklyCandidateYields[playerParty] || 0;
        gameData.funds += playerRaised;

        for (var cp in weeklyCandidateYields) {
            if (cp !== playerParty) {
                var oppCand = activeCandidates.find(function(c) { return (primary ? c.cand.id : c.party) === cp; });
                if (oppCand && oppCand.cand) {
                    oppCand.cand.funds = (oppCand.cand.funds || 0) + weeklyCandidateYields[cp];
                    if(primary){var actor=PrimaryCampaign.actor(oppCand.cand.id);actor.funds=oppCand.cand.funds;actor.raised+=weeklyCandidateYields[cp];}
                }
            }
        }

        // Log weekly report
        var playerRaisedLabel = '$' + playerRaised.toFixed(2) + 'M';
        Utils.addLog('💰 Grassroots Report: Automatically collected ' + playerRaisedLabel +
            ' in small-dollar donations nationwide this week. Top hotspot: ' +
            topCounty.name + ', ' + topCounty.state + ' ($' + (topCounty.amount * 1000).toFixed(0) + 'K).');
        Utils.showToast('💰 Automatically raised ' + playerRaisedLabel + ' from grassroots supporters this week!');

        if (typeof Campaign !== 'undefined') {
            Campaign.updateHUD();
        }
    },

    getCountyGrassrootsTotal: function(county, party) {
        if (!county) return 0;
        var fips = county.fips || Counties.normalizeFips(county.fips);
        var p = party || this.activeGrassrootsViewCandidate;
        if (p === 'player') p = gameData.selectedParty || 'D';
        return (this.grassrootsTotals.byCounty[fips] && this.grassrootsTotals.byCounty[fips][p]) || 0;
    },

    getStateGrassrootsTotal: function(stateCode, party) {
        var p = party || this.activeGrassrootsViewCandidate;
        if (p === 'player') p = gameData.selectedParty || 'D';
        return (this.grassrootsTotals.byState[stateCode] && this.grassrootsTotals.byState[stateCode][p]) || 0;
    },

    // ─── 6. DYNAMIC SYNTHETIC MICRO-VOTER COHORT GENERATOR ───────────────────

    /**
     * Generates a sample cohort of individual simulated voters for a county.
     * Demonstrates the Michigan Model in action at the human individual voter level!
     * Off-ballot candidates can NEVER receive votes from simulated voters.
     */
    generateCountyVoters: function(county, sampleSize) {
        var count = sampleSize || 8;
        var trueState = this.evaluateCountyTrueState(county);
        if (!trueState) return [];

        var fips = county.fips || (typeof Counties !== 'undefined' ? Counties.normalizeFips(county.fips) : String(county.fips));
        var stateCode = county.s || (county.fips && typeof Counties !== 'undefined' ? Counties.getStateCodeFromFips(county.fips.substring(0, 2)) : 'PA');
        var part = county.partisanship || (this.partisanshipData && this.partisanshipData[fips]) || {};
        var regDemPct = part.regDemPct || 0.35;
        var regRepPct = part.regRepPct || 0.40;

        var names = [
            "Marcus Hayes", "Elena Rodriguez", "James O'Connor", "Sarah Miller",
            "David Chen", "Aaliyah Washington", "Robert Kovacs", "Emily Taylor",
            "Carlos Morales", "Jennifer Smith", "Michael Novak", "Ashley Jackson"
        ];
        var archetypes = [
            { desc: "Registered Nurse · Suburban Homeowner", ig: "suburban", age: 42 },
            { desc: "Auto Assembly Worker · UAW Member", ig: "union", age: 51 },
            { desc: "University Student · Retail Associate", ig: "youth", age: 21 },
            { desc: "Retired Postal Worker · Grandparent", ig: "seniors", age: 69 },
            { desc: "Small Business Owner · Chamber Member", ig: "smallbusiness", age: 47 },
            { desc: "Software Engineer · Remote Tech Worker", ig: "college", age: 33 },
            { desc: "Family Farmer · Local Co-op Member", ig: "rural", age: 58 },
            { desc: "Logistics Specialist · Army Veteran", ig: "workingclass", age: 38 }
        ];

        var voters = [];
        var activeCandidates = (typeof Utils !== 'undefined' && Utils.getActiveCandidates) ? Utils.getActiveCandidates() : [];
        var availableCandidates = activeCandidates.filter(function(c) {
            return typeof Utils !== 'undefined' && Utils.isPartyOnBallot ? Utils.isPartyOnBallot(c.party, stateCode) : (c.party === 'D' || c.party === 'R');
        });
        if (availableCandidates.length === 0) availableCandidates = activeCandidates;

        var fipsSeed = parseInt(fips.replace(/\D/g, ''), 10) || 54321;

        for (var i = 0; i < count; i++) {
            var vSeed = (fipsSeed * (i + 13) + (i + 1) * 31337) % 10000;
            var rVal = vSeed / 10000;

            // Individual Party Identification
            var pid = "Independent / Unaffiliated";
            var pidParty = "I";
            if (rVal < regDemPct) {
                pid = "Registered Democrat";
                pidParty = "D";
            } else if (rVal < (regDemPct + regRepPct)) {
                pid = "Registered Republican";
                pidParty = "R";
            }

            var name = names[i % names.length];
            var arch = archetypes[i % archetypes.length];

            // Evaluate individual voter attitudes under the Michigan Model
            var candAtt = (rVal * 2.4) - 1.2;
            var policyAtt = ((vSeed % 100) / 50) - 1.0;
            var groupAtt = (((vSeed * 3) % 100) / 50) - 1.0;

            // Individual voter enthusiasm [0 - 100%]
            var individualEnthusiasm = Math.round(Math.max(10, Math.min(98,
                (trueState.turnoutRate * 100) + (candAtt * 15) + (policyAtt * 10) + ((rVal - 0.5) * 20))));

            // Individual Decision: Vote for candidate OR Abstain (Not showing up)
            var decision = "";
            var decisionClass = "";
            var willTurnout = (individualEnthusiasm >= 45);

            if (!willTurnout) {
                decision = "Abstaining / Staying Home (Low Enthusiasm)";
                decisionClass = "voter-abstain";
            } else {
                // Determine if voter is currently undecided
                var uProb = (trueState.undecidedPct || 8.0) / 100.0;
                var isUndecided = (pidParty === 'I' || Math.abs(candAtt) < 0.28) && ((vSeed % 100) / 100.0 < (uProb * 2.2));

                if (isUndecided) {
                    decision = "Undecided / Weighing Candidates";
                    decisionClass = "voter-undecided";
                } else {
                    // Determine candidate choice strictly among available on-ballot candidates
                    var demCand = availableCandidates.find(function(c) { return c.party === 'D'; });
                    var repCand = availableCandidates.find(function(c) { return c.party === 'R'; });

                    if (pidParty === 'D' && demCand && candAtt > -0.5) {
                        decision = "Voting for " + demCand.cand.name;
                        decisionClass = "voter-dem";
                    } else if (pidParty === 'R' && repCand && candAtt < 0.5) {
                        decision = "Voting for " + repCand.cand.name;
                        decisionClass = "voter-rep";
                    } else {
                        // Swing / Independent choice: choose on-ballot candidate based on county choice shares
                        var bestCand = null;
                        var bestShare = -1;
                        for (var ci = 0; ci < availableCandidates.length; ci++) {
                            var cEntry = availableCandidates[ci];
                            var sh = trueState.candidateChoiceShares[cEntry.party] || 0;
                            if (sh > bestShare) {
                                bestShare = sh;
                                bestCand = cEntry;
                            }
                        }
                        if (!bestCand) bestCand = availableCandidates[0];

                        decision = "Voting for " + bestCand.cand.name;
                        decisionClass = bestCand.party === 'D' ? 'voter-dem' : (bestCand.party === 'R' ? 'voter-rep' : 'voter-third');
                    }
                }
            }

            voters.push({
                name: name,
                age: arch.age,
                occupation: arch.desc,
                pid: pid,
                pidParty: pidParty,
                enthusiasm: individualEnthusiasm,
                candAttitude: candAtt >= 0 ? "+" + candAtt.toFixed(1) : candAtt.toFixed(1),
                policyAttitude: policyAtt >= 0 ? "+" + policyAtt.toFixed(1) : policyAtt.toFixed(1),
                groupAttitude: groupAtt >= 0 ? "+" + groupAtt.toFixed(1) : groupAtt.toFixed(1),
                decision: decision,
                decisionClass: decisionClass
            });
        }

        return voters;
    }
};

window.MichiganModel = MichiganModel;
