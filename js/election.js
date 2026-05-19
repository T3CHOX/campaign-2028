/* ============================================
   DECISION 2028 - ELECTION NIGHT
   ============================================ */

// 2024 presidential election results by state (R = Trump won, D = Harris won)
// Trump won all 2016 states + Nevada; Harris held the remaining blue states.
var RESULTS_2024 = {
    AL:'R', AK:'R', AZ:'R', AR:'R', CA:'D', CO:'D', CT:'D',
    DE:'D', FL:'R', GA:'R', HI:'D', ID:'R', IL:'D', IN:'R',
    IA:'R', KS:'R', KY:'R', LA:'R', ME:'D', MD:'D', MA:'D',
    MI:'R', MN:'D', MS:'R', MO:'R', MT:'R', NE:'R', NV:'R',
    NH:'D', NJ:'D', NM:'D', NY:'D', NC:'R', ND:'R', OH:'R',
    OK:'R', OR:'D', PA:'R', RI:'D', SC:'R', SD:'R', TN:'R',
    TX:'R', UT:'R', VT:'D', VA:'D', WA:'D', WV:'R', WI:'R',
    WY:'R', DC:'D'
};

var TURNOUT_MODEL = {
    DEFAULT_COLLEGE_SHARE: 0.35,
    DEFAULT_RURAL_SHARE: 0.3,
    DEFAULT_URBAN_INDEX: 0.58,
    RURAL_COUNTY_SHARE: 0.7,
    RURAL_URBAN_INDEX: 0.22,
    BASELINE: 0.53,
    COLLEGE_MULTIPLIER: 0.08,
    URBAN_MULTIPLIER: 0.03,
    RURAL_PENALTY: 0.02,
    MIN_TURNOUT: 0.50,
    MAX_TURNOUT: 0.65
};

var DEFAULT_EXPECTED_TURNOUT_RATE = 0.56;
var COALITION_BASE_TURNOUT_PCT = 60;
var DEFAULT_INTEREST_GROUP_TURNOUT_MULTIPLIER = 1;
var VICTORY_CLEAR_EV_THRESHOLD = 300;
var VICTORY_LANDSLIDE_EV_THRESHOLD = 350;
var VICTORY_CLEAR_MARGIN_THRESHOLD = 30;
var VICTORY_LANDSLIDE_MARGIN_THRESHOLD = 80;

var Election = {
    time: 17.5,
    speed: 1,
    paused: false,
    interval: null,
    mapMode: 'leader',
    analysisMode: false,
    demEV: 0,
    repEV: 0,
    thirdPartyEV: 0,
    winnerShown: false,
    allVotesCounted: false,
    nationalPopularVotes: { D: 0, R: 0, G: 0, L: 0, PSL: 0, I: 0 },
    totalReportedVotes: 0,
    stateCallAllocations: {},
    historicalMargins: {},
    historicalYears: [],
    selectedShiftYear: 2024,
    historicalDataLoaded: false,
    preAnalysisPaused: false,
    preAnalysisMapMode: 'leader',
    shiftStateCache: {},
    shiftCountyCache: {},

    start: function() {
        var self = this;
        this.time = 17.5;
        this.demEV = 0;
        this.repEV = 0;
        this.thirdPartyEV = 0;
        this.winnerShown = false;
        this.allVotesCounted = false;
        this.nationalPopularVotes = { D: 0, R: 0, G: 0, L: 0, PSL: 0, I: 0 };
        this.totalReportedVotes = 0;
        this.stateCallAllocations = {};
        this.analysisMode = false;
        this.preAnalysisPaused = false;
        this.preAnalysisMapMode = 'leader';
        this.selectedShiftYear = 2024;
        this.historicalMargins = {};
        this.historicalYears = [];
        this.historicalDataLoaded = false;
        this.shiftStateCache = {};
        this.shiftCountyCache = {};

        this.resetAnalysisUI();

        // Initialize county-level reporting data with staggered schedules
        if (typeof Counties !== 'undefined' && Counties.countyData) {
            var stateExpectedTotals = {};
            for (var fips in Counties.countyData) {
                var county = Counties.countyData[fips];
                county.reportedPct = 0;
                county.reportedVotes = { D: 0, R: 0, G: 0, L: 0, PSL: 0, I: 0 };
                county.marginOfError = null;
                county.pollsClosed = false;
                county.pollCloseTime = null;
                county.reportingSchedule = [];
                county.nextBatchIndex = 0;
                county.reportingProfile = null;
                county.expectedVotes = 0;

                // Find this county's state
                var cfips = fips.padStart(5, '0');
                var cStateFips = cfips.substring(0, 2);
                var cStateCode = null;
                for (var sc in STATES) {
                    if (STATES[sc].fips === cStateFips) { cStateCode = sc; break; }
                }
                var cCloseTime = this.getCountyPollCloseTime(cfips, cStateCode);
                county.pollCloseTime = cCloseTime;

                county.reportingProfile = this.getReportingProfile(county);
                county.reportingSchedule = this.buildCountyReportingSchedule(county, cCloseTime, cfips);
                county.nextBatchIndex = 0;
                county.expectedVotes = this.getCountyExpectedVotes(county);

                if (cStateCode) {
                    stateExpectedTotals[cStateCode] = (stateExpectedTotals[cStateCode] || 0) + county.expectedVotes;
                }
            }

            for (var stateCode in stateExpectedTotals) {
                if (gameData.states[stateCode]) {
                    gameData.states[stateCode].expectedVotes = stateExpectedTotals[stateCode];
                }
            }
        }

        for (var code in gameData.states) {
            var s = gameData.states[code];
            s.reportedPct = 0;
            s.reportedVotes = { D: 0, R: 0, G: 0, L: 0, PSL: 0, I: 0 };
            s.called = false;
            s.calledFor = null;
            s.countSpeed = 1.0;
            s.pollsClosed = false;

            // Close margin states count slower
            if (Math.abs(s.margin) < 3) {
                s.countSpeed = 0.6;
            }
        }

        document.getElementById('elec-dem-name').innerText = gameData.demTicket.pres ?  gameData.demTicket.pres.name.toUpperCase() : 'DEMOCRAT';
        document.getElementById('elec-rep-name').innerText = gameData.repTicket.pres ? gameData.repTicket.pres.name.toUpperCase() : 'REPUBLICAN';
        document.getElementById('elec-dem-img').src = gameData.demTicket.pres ? gameData.demTicket.pres.img : 'images/scenario.jpg';
        document.getElementById('elec-rep-img').src = gameData.repTicket.pres ? gameData.repTicket.pres.img : 'images/scenario.jpg';

        document.getElementById('election-feed-content').innerHTML = '';
        document.getElementById('race-calls-content').innerHTML = '';

        // Load 2024 election data for shift map mode
        this.load2024Data();
        this.loadHistoricalData();
        this.populateAnalysisYearSelect();

        this.loadElectionMap();
        this.updateNationalPopularVote();
        this.updateDisplay();
        this.updatePollClosingsNext();

        if (this.interval) clearInterval(this.interval);
        this.interval = setInterval(function() {
            if (!self.paused) {
                self.tick();
            }
        }, 100);
    },

    tick: function() {
        this.time += 0.005 * this.speed;

        // Update county-level vote counts using staggered reporting schedules
        if (typeof Counties !== 'undefined' && Counties.countyData) {
            var stateAggregateSeen = {};

            for (var fips in Counties.countyData) {
                var county = Counties.countyData[fips];
                var cfips = fips.padStart(5, '0');
                var cStateFips = cfips.substring(0, 2);

                if (this.time < county.pollCloseTime) continue;

                if (!county.pollsClosed) {
                    county.pollsClosed = true;
                    var stateCode = this.getStateCodeFromFips(cStateFips);
                    if (stateCode && gameData.states[stateCode]) {
                        if (!gameData.states[stateCode].pollsClosed) {
                            gameData.states[stateCode].pollsClosed = true;
                            this.pulseState(stateCode);
                        }
                    }
                }

                if (county.reportedPct < 100 && county.reportingSchedule && county.reportingSchedule.length) {
                    while (county.nextBatchIndex < county.reportingSchedule.length &&
                           this.time >= county.reportingSchedule[county.nextBatchIndex].time) {
                        county.reportedPct = Math.min(100, county.reportedPct + county.reportingSchedule[county.nextBatchIndex].pct);
                        county.nextBatchIndex += 1;
                    }
                }

                if (this.time > 26.5 && county.reportedPct < 100) {
                    county.reportedPct = 100;
                }

                if (county.reportedPct > 0) {
                    if (!county.marginOfError) {
                        county.marginOfError = (Math.random() - 0.5) * 4; // ±2%
                    }

                    var reportingFactor = county.reportedPct / 100;
                    var errorFactor = 1.0 + (county.marginOfError / 100);
                    var undecidedPct = county.undecided || 0;
                    var decidedMultiplier = (100 - undecidedPct) / 100;

                    county.reportedVotes = this.calculateCountyReportedVotes(county, reportingFactor, decidedMultiplier, errorFactor);
                }

                stateAggregateSeen[cStateFips] = true;
            }

            // Aggregate county votes to states (only those with changes)
            for (var stateCode in gameData.states) {
                var stateFips = STATES[stateCode] ? STATES[stateCode].fips : null;
                if (stateFips && stateAggregateSeen[stateFips]) {
                    this.aggregateCountyVotes(stateCode);
                }
            }
        }
        this.updateNationalPopularVote();

        // Check if all votes are counted
        var allCounted = true;
        for (var code in gameData.states) {
            var s = gameData.states[code];
            if (s.reportedPct < 100) {
                allCounted = false;
                break;
            }
        }

        if (allCounted && !this.allVotesCounted) {
            this.allVotesCounted = true;
            this.showFinalResults();
        }

        // Call states based on results
        for (var code in gameData.states) {
            var s = gameData.states[code];

            if (!s.called && s.reportedPct > 0) {
                var callCheck = this.canCallStateMathematically(code, s);
                if (callCheck.canCall) {
                    s.called = true;
                    s.calledFor = callCheck.calledFor;
                    this.awardEV(s, callCheck.allocation);
                    this.stateCallAllocations[code] = callCheck.allocation;
                    this.addFeedItem(callCheck.message || (s.name + ' called for ' + this.getPartyLabel(s.calledFor) + ' (' + s.ev + ' EV)'));
                    this.addRaceCall(code, s.calledFor);
                }
            }
        }

        this.updateDisplay();
        this.updatePollClosingsNext();
        this.colorElectionMap();

        // Update county map view if it is open
        if (gameData.electionCountyViewState) {
            this.updateCountyElectionColors();
        }

        // Show winner overlay when someone reaches 270 and ALL votes are counted
        if ((this.demEV >= 270 || this.repEV >= 270) && !this.winnerShown && allCounted) {
            this.showWinner();
        }
    },

    updateDisplay: function() {
        document.getElementById('election-time').innerText = Utils.formatTime(this.time);
        document.getElementById('elec-dem-ev').innerText = this.demEV;
        document.getElementById('elec-rep-ev').innerText = this.repEV;

        // Show third party EV count if applicable
        var thirdEvEl = document.getElementById('elec-third-ev');
        if (thirdEvEl) {
            if (gameData.thirdPartiesEnabled && this.thirdPartyEV > 0) {
                thirdEvEl.innerText = this.thirdPartyEV;
                thirdEvEl.parentElement.classList.remove('hidden');
            } else {
                thirdEvEl.parentElement.classList.add('hidden');
            }
        }

        // Calculate bar widths - 269 is the exact middle (50%)
        // Each EV = (1/538) * 100% of the total width
        var demWidth = (this.demEV / 538) * 100;
        var repWidth = (this.repEV / 538) * 100;
        
        document.getElementById('elec-bar-dem').style.width = demWidth + '%';
        document.getElementById('elec-bar-rep').style.width = repWidth + '%';
        
        // If third parties are enabled and have EVs, show them
        var thirdPartyBar = document.getElementById('elec-bar-third');
        if (thirdPartyBar) {
            if (gameData.thirdPartiesEnabled && this.thirdPartyEV > 0) {
                var thirdWidth = (this.thirdPartyEV / 538) * 100;
                thirdPartyBar.style.width = thirdWidth + '%';
                thirdPartyBar.style.display = 'block';
            } else {
                thirdPartyBar.style.display = 'none';
            }
        }
        this.updateNationalPopularVoteDisplay();
        this.updateThirdPartyTracker();
    },

    getCountyTurnoutRate: function(county) {
        var countyType = county && county.t ? county.t : 'Suburban/Mixed';
        var baseTurnout = 0.56;
        var maxCap = 0.65;

        switch (countyType) {
            case 'Highly Urban':
                baseTurnout = 0.52;
                maxCap = 0.58;
                break;
            case 'Urban/Dense Suburban':
                baseTurnout = 0.58;
                maxCap = 0.68;
                break;
            case 'Suburban/Mixed':
                baseTurnout = 0.56;
                maxCap = 0.65;
                break;
            case 'Rural/Small Town':
                baseTurnout = 0.54;
                maxCap = 0.64;
                break;
            case 'Deep Rural':
                baseTurnout = 0.58;
                maxCap = 0.61;
                break;
        }

        var maxTurnoutMultiplier = 1.0;
        if (county && county.turnout) {
            var playerTurnout = (typeof county.turnout.player === 'number' && isFinite(county.turnout.player)) ? county.turnout.player : 1.0;
            var demOpponentTurnout = (typeof county.turnout.demOpponent === 'number' && isFinite(county.turnout.demOpponent)) ? county.turnout.demOpponent : 1.0;
            var repOpponentTurnout = (typeof county.turnout.repOpponent === 'number' && isFinite(county.turnout.repOpponent)) ? county.turnout.repOpponent : 1.0;
            var thirdPartyTurnout = (typeof county.turnout.thirdParty === 'number' && isFinite(county.turnout.thirdParty)) ? county.turnout.thirdParty : 1.0;
            maxTurnoutMultiplier = Math.max(1.0, playerTurnout, demOpponentTurnout, repOpponentTurnout, thirdPartyTurnout);
        }

        var elasticityWindow = Math.max(0, maxCap - baseTurnout);
        var turnoutRate = baseTurnout + Math.max(0, maxTurnoutMultiplier - 1) * elasticityWindow;
        return Math.max(baseTurnout, Math.min(maxCap, turnoutRate));
    },

    getCountyVoterPool: function(county, reportingFactor, decidedMultiplier, errorFactor) {
        var countyPopulation = Math.max(0, county && county.p ? county.p : 0);
        var turnoutRate = this.getCountyTurnoutRate(county);
        var baseVoters = countyPopulation * turnoutRate;
        var effectivePool = baseVoters * (decidedMultiplier || 1) * (reportingFactor || 1) * (errorFactor || 1);
        return Math.max(0, effectivePool);
    },

    calculateCountyReportedVotes: function(county, reportingFactor, decidedMultiplier, errorFactor) {
        if (typeof Counties === 'undefined' || !Counties.calculateCountyVoteTotals) {
            return { D: 0, R: 0, G: 0, L: 0, PSL: 0, I: 0 };
        }

        var totals = Counties.calculateCountyVoteTotals(county, {
            reportingFactor: reportingFactor,
            decidedMultiplier: decidedMultiplier,
            errorFactor: errorFactor
        });

        return {
            D: Math.floor(totals.D || 0),
            R: Math.floor(totals.R || 0),
            G: Math.floor(totals.G || 0),
            L: Math.floor(totals.L || 0),
            PSL: Math.floor(totals.PSL || 0),
            I: Math.floor(totals.I || 0)
        };
    },

    aggregateCountyVotes: function(stateCode) {
        // Aggregate all county votes for a state to get state totals
        var state = gameData.states[stateCode];
        var stateFips = STATES[stateCode] ? STATES[stateCode].fips : null;
        if (!stateFips) return;
        
        var totalDem = 0;
        var totalRep = 0;
        var totalG = 0;
        var totalL = 0;
        var totalPSL = 0;
        var totalI = 0;
        var totalReportedPct = 0;
        var countyCount = 0;
        var totalReportedVotes = 0;
        
        for (var fips in Counties.countyData) {
            var paddedFips = fips.padStart(5, '0');
            if (paddedFips.substring(0, 2) === stateFips) {
                var county = Counties.countyData[fips];
                totalDem += county.reportedVotes.D || 0;
                totalRep += county.reportedVotes.R || 0;
                totalG += county.reportedVotes.G || 0;
                totalL += county.reportedVotes.L || 0;
                totalPSL += county.reportedVotes.PSL || 0;
                totalI += county.reportedVotes.I || 0;
                totalReportedPct += county.reportedPct || 0;
                totalReportedVotes += (county.reportedVotes.D || 0) + (county.reportedVotes.R || 0) + (county.reportedVotes.G || 0) +
                    (county.reportedVotes.L || 0) + (county.reportedVotes.PSL || 0) + (county.reportedVotes.I || 0);
                countyCount++;
            }
        }
        
        state.reportedVotes.D = totalDem;
        state.reportedVotes.R = totalRep;
        state.reportedVotes.G = totalG;
        state.reportedVotes.L = totalL;
        state.reportedVotes.PSL = totalPSL;
        state.reportedVotes.I = totalI;
        
        if (state.expectedVotes && state.expectedVotes > 0) {
            state.reportedPct = Math.min(100, (totalReportedVotes / state.expectedVotes) * 100);
        } else {
            // State reporting percentage is average of county reporting percentages
            state.reportedPct = countyCount > 0 ? totalReportedPct / countyCount : 0;
        }
    },

    updateNationalPopularVote: function() {
        var totals = { D: 0, R: 0, G: 0, L: 0, PSL: 0, I: 0 };
        for (var stateCode in gameData.states) {
            var s = gameData.states[stateCode];
            if (!s || !s.reportedVotes) continue;
            totals.D += s.reportedVotes.D || 0;
            totals.R += s.reportedVotes.R || 0;
            totals.G += s.reportedVotes.G || 0;
            totals.L += s.reportedVotes.L || 0;
            totals.PSL += s.reportedVotes.PSL || 0;
            totals.I += s.reportedVotes.I || 0;
        }
        this.nationalPopularVotes = totals;
        this.totalReportedVotes = totals.D + totals.R + totals.G + totals.L + totals.PSL + totals.I;
    },

    updateNationalPopularVoteDisplay: function() {
        var ticker = document.getElementById('national-popular-vote-ticker');
        var rowsContainer = document.getElementById('national-popular-vote-rows');
        if (!ticker || !rowsContainer) return;

        var totalVotes = this.totalReportedVotes || 0;
        var rows = [
            { party: 'D', name: gameData.demTicket && gameData.demTicket.pres ? gameData.demTicket.pres.name.toUpperCase() : 'DEMOCRAT', color: PARTIES.D.color, votes: this.nationalPopularVotes.D || 0 },
            { party: 'R', name: gameData.repTicket && gameData.repTicket.pres ? gameData.repTicket.pres.name.toUpperCase() : 'REPUBLICAN', color: PARTIES.R.color, votes: this.nationalPopularVotes.R || 0 }
        ];

        if (gameData.thirdPartiesEnabled) {
            rows.push({ party: 'I', name: 'INDEPENDENT', color: PARTIES.I.color, votes: this.nationalPopularVotes.I || 0 });
            rows.push({ party: 'G', name: 'GREEN', color: PARTIES.G.color, votes: this.nationalPopularVotes.G || 0 });
            rows.push({ party: 'L', name: 'LIBERTARIAN', color: PARTIES.L.color, votes: this.nationalPopularVotes.L || 0 });
            rows.push({ party: 'PSL', name: 'PSL', color: PARTIES.PSL.color, votes: this.nationalPopularVotes.PSL || 0 });
        }

        rows.sort(function(a, b) { return b.votes - a.votes; });
        var html = '';
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            var pct = totalVotes > 0 ? ((row.votes / totalVotes) * 100).toFixed(1) : '0.0';
            if (!gameData.thirdPartiesEnabled && row.party !== 'D' && row.party !== 'R') continue;
            var leaderClass = i === 0 ? ' npv-row-leading' : '';
            html += '<div class=\"national-popular-vote-row' + leaderClass + '\">' +
                '<span class=\"npv-name\" style=\"color:' + row.color + '\">' + row.name + '</span>' +
                '<span class=\"npv-votes\">' + row.votes.toLocaleString() + '</span>' +
                '<span class=\"npv-percent\">' + pct + '%</span>' +
            '</div>';
        }

        rowsContainer.innerHTML = html;
        var totalLabel = document.getElementById('national-popular-vote-total');
        if (totalLabel) {
            totalLabel.textContent = 'TOTAL REPORTED: ' + totalVotes.toLocaleString();
        }
    },

    // Determine which party won a state based on reported votes (plurality)
    getStateWinner: function(state) {
        var votes = [
            { party: 'D', count: state.reportedVotes.D || 0 },
            { party: 'R', count: state.reportedVotes.R || 0 }
        ];
        if (gameData.thirdPartiesEnabled) {
            votes.push({ party: 'G', count: state.reportedVotes.G || 0 });
            votes.push({ party: 'L', count: state.reportedVotes.L || 0 });
            votes.push({ party: 'PSL', count: state.reportedVotes.PSL || 0 });
            votes.push({ party: 'I', count: state.reportedVotes.I || 0 });
        }
        votes.sort(function(a, b) { return b.count - a.count; });
        return votes[0].party;
    },

    // Award electoral votes to the winning party or split-state allocation
    awardEV: function(state, allocation) {
        if (allocation) {
            this.demEV += allocation.D || 0;
            this.repEV += allocation.R || 0;
            this.thirdPartyEV += (allocation.G || 0) + (allocation.L || 0) + (allocation.PSL || 0) + (allocation.I || 0);
            return;
        }
        if (state.calledFor === 'D') {
            this.demEV += state.ev;
        } else if (state.calledFor === 'R') {
            this.repEV += state.ev;
        } else {
            this.thirdPartyEV += state.ev;
        }
    },

    // Probabilistic interest-group-based vote share adjustment for a county
    // Models voters as sims assigned to interest groups affecting vote probability
    applyInterestGroupAdjustments: function(county) {
        // Start with base county vote shares
        var base = {
            D: county.v.D || 0,
            R: county.v.R || 0,
            G: county.v.G || 0,
            L: county.v.L || 0,
            PSL: county.v.PSL || 0,
            I: county.v.I || 0
        };

        if (!gameData.thirdPartiesEnabled) {
            // When third parties off, collapse all 3rd party votes into D/R proportionally
            var majorTotal = base.D + base.R;
            if (majorTotal > 0) {
                var thirdTotal = base.G + base.L + base.PSL + base.I;
                var dRatio = base.D / majorTotal;
                base.D += thirdTotal * dRatio;
                base.R += thirdTotal * (1 - dRatio);
            }
            base.G = 0; base.L = 0; base.PSL = 0; base.I = 0;
            return base;
        }

        // Apply interest group support modifiers to shift vote shares
        if (!gameData.interestGroupSupport || Object.keys(gameData.interestGroupSupport).length === 0) {
            return base;
        }

        // Map party to candidate IDs for support lookup
        var candForParty = {};
        if (gameData.candidate) candForParty[gameData.selectedParty] = gameData.candidate.id;
        if (gameData.demTicket && gameData.demTicket.pres) candForParty['D'] = gameData.demTicket.pres.id;
        if (gameData.repTicket && gameData.repTicket.pres) candForParty['R'] = gameData.repTicket.pres.id;
        if (gameData.thirdTickets) {
            var tpCodes = ['PSL', 'G', 'L', 'I'];
            for (var ti = 0; ti < tpCodes.length; ti++) {
                if (gameData.thirdTickets[tpCodes[ti]] && gameData.thirdTickets[tpCodes[ti]].pres) {
                    candForParty[tpCodes[ti]] = gameData.thirdTickets[tpCodes[ti]].pres.id;
                }
            }
        }

        // Calculate weighted support deltas from interest groups
        // Each interest group has a county-specific weight (approx uniform here)
        var groupCount = 0;
        var deltas = { D: 0, R: 0, G: 0, L: 0, PSL: 0, I: 0 };
        var parties = ['D', 'R', 'G', 'L', 'PSL', 'I'];

        for (var groupId in gameData.interestGroupSupport) {
            var groupSupport = gameData.interestGroupSupport[groupId];
            for (var pi = 0; pi < parties.length; pi++) {
                var p = parties[pi];
                var candId = candForParty[p];
                if (candId && groupSupport[candId] !== undefined) {
                    // Baseline for each party derived from group lean
                    var expectedShare = groupSupport[candId];
                    // Scale delta: weight = 0.3% shift per 10% over-index in group support
                    var delta = (expectedShare - 50) * 0.003;
                    deltas[p] += delta;
                }
            }
            groupCount++;
        }

        if (groupCount > 0) {
            // Apply averaged deltas, clamped to avoid negatives
            var totalVS = base.D + base.R + base.G + base.L + base.PSL + base.I;
            if (totalVS > 0) {
                for (var pj = 0; pj < parties.length; pj++) {
                    var pp = parties[pj];
                    var rawAdj = base[pp] + (deltas[pp] / groupCount) * totalVS;
                    base[pp] = Math.max(0, rawAdj);
                }
                // Renormalize to original total
                var newTotal = 0;
                for (var pk = 0; pk < parties.length; pk++) newTotal += base[parties[pk]];
                if (newTotal > 0) {
                    for (var pl = 0; pl < parties.length; pl++) {
                        base[parties[pl]] = (base[parties[pl]] / newTotal) * totalVS;
                    }
                }
            }
        }

        return base;
    },

    // Get display label for a party code
    getPartyLabel: function(partyCode) {
        var labels = { D: 'Democrats', R: 'Republicans', G: 'Green Party', L: 'Libertarian Party', PSL: 'Party for Socialism and Liberation', I: 'Independent' };
        return labels[partyCode] || partyCode;
    },

    // Get color for a party code
    getPartyColor: function(partyCode) {
        if (PARTIES[partyCode]) return PARTIES[partyCode].color;
        return '#888888';
    },

    getStateCodeFromFips: function(stateFips) {
        for (var code in STATES) {
            if (STATES[code] && STATES[code].fips === stateFips) return code;
        }
        return null;
    },

    getCountyPollCloseTime: function(fips, stateCode) {
        var paddedFips = (fips ? String(fips) : '').padStart(5, '0');
        if (typeof COUNTY_POLL_CLOSE_OVERRIDES !== 'undefined' && COUNTY_POLL_CLOSE_OVERRIDES[paddedFips] !== undefined) {
            return COUNTY_POLL_CLOSE_OVERRIDES[paddedFips];
        }
        return POLL_CLOSE_TIMES[stateCode] !== undefined ? POLL_CLOSE_TIMES[stateCode] : 20;
    },

    getReportingProfile: function(county) {
        var pop = county && county.p ? county.p : 0;
        var countyType = county && county.t ? county.t : '';
        if (pop >= 1000000 || countyType === 'Highly Urban') {
            return { type: 'large-urban', minPct: 20, maxPct: 35, minGap: 0.35, maxGap: 0.7 };
        }
        if (pop >= 100000 || countyType === 'Urban/Dense Suburban' || countyType === 'Suburban/Mixed') {
            return { type: 'medium', minPct: 10, maxPct: 15, minGap: 0.2, maxGap: 0.45 };
        }
        return { type: 'small-rural', minPct: 3, maxPct: 7, minGap: 0.12, maxGap: 0.3 };
    },

    buildCountyReportingSchedule: function(county, pollCloseTime) {
        var profile = county.reportingProfile || this.getReportingProfile(county);
        var schedule = [];
        var totalPct = 0;
        var t = pollCloseTime;

        while (totalPct < 100) {
            var remaining = 100 - totalPct;
            var pct = profile.minPct + Math.random() * (profile.maxPct - profile.minPct);
            if (remaining <= profile.maxPct + 2) {
                pct = remaining;
            } else {
                pct = Math.min(remaining, Math.max(1, pct + (Math.random() * 6 - 3)));
            }
            totalPct += pct;
            t += profile.minGap + Math.random() * (profile.maxGap - profile.minGap);
            schedule.push({ time: t, pct: pct });
        }
        return schedule;
    },

    getCountyExpectedVotes: function(county) {
        if (typeof Counties !== 'undefined' && Counties.getCountyVotesForAllocation) {
            var totals = Counties.getCountyVotesForAllocation(county, false);
            return (totals.D || 0) + (totals.R || 0) + (totals.G || 0) + (totals.L || 0) + (totals.PSL || 0) + (totals.I || 0);
        }
        var pop = county && county.p ? county.p : 0;
        return Math.max(0, pop * DEFAULT_EXPECTED_TURNOUT_RATE);
    },

    pulseState: function(stateCode) {
        var path = document.querySelector('#election-map-svg #' + stateCode);
        if (!path) return;
        path.classList.add('state-pulse');
        setTimeout(function() {
            path.classList.remove('state-pulse');
        }, 1600);
    },

    canCallStateMathematically: function(stateCode, state) {
        var votes = state.reportedVotes || {};
        var parties = ['D', 'R', 'G', 'L', 'PSL', 'I'];
        var ordered = [];
        var totalReported = 0;
        for (var i = 0; i < parties.length; i++) {
            var p = parties[i];
            var count = votes[p] || 0;
            totalReported += count;
            ordered.push({ party: p, count: count });
        }
        ordered.sort(function(a, b) { return b.count - a.count; });
        var leader = ordered[0];
        var runnerUp = ordered[1] || { party: 'R', count: 0 };

        var expectedVotes = state.expectedVotes || totalReported;
        var remainingVotes = Math.max(0, expectedVotes - totalReported);
        var remainingPct = expectedVotes > 0 ? (remainingVotes / expectedVotes) * 100 : 0;
        var mathematicalLock = leader.count > (runnerUp.count + remainingVotes);

        if (!mathematicalLock && state.reportedPct < 99.9) {
            return { canCall: false };
        }
        if (state.reportedPct < 99.9 && remainingPct > 30) {
            return { canCall: false };
        }

        var allocationResult = null;
        if (typeof Counties !== 'undefined' && Counties.calculateStateElectoralAllocation) {
            allocationResult = Counties.calculateStateElectoralAllocation(stateCode, { useReportedVotes: true });
        }
        var calledFor = allocationResult && allocationResult.calledFor ? allocationResult.calledFor : leader.party;
        var callMessage = this.formatSplitCallMessage(stateCode, calledFor, allocationResult);

        return {
            canCall: true,
            calledFor: calledFor,
            allocation: allocationResult ? allocationResult.allocation : null,
            message: callMessage
        };
    },

    formatSplitCallMessage: function(stateCode, calledFor, allocationResult) {
        var state = gameData.states[stateCode];
        if (!state) return '';
        if (!allocationResult || !allocationResult.isSplitState) {
            return state.name + ' called for ' + this.getPartyLabel(calledFor) + ' (' + state.ev + ' EV)';
        }
        var alloc = allocationResult.allocation || {};
        var parts = [];
        if ((alloc.D || 0) > 0) parts.push('D+' + (alloc.D || 0));
        if ((alloc.R || 0) > 0) parts.push('R+' + (alloc.R || 0));
        if ((alloc.G || 0) > 0) parts.push('G+' + (alloc.G || 0));
        if ((alloc.L || 0) > 0) parts.push('L+' + (alloc.L || 0));
        if ((alloc.I || 0) > 0) parts.push('I+' + (alloc.I || 0));
        if ((alloc.PSL || 0) > 0) parts.push('PSL+' + (alloc.PSL || 0));
        return state.name + ' called for ' + this.getPartyLabel(calledFor) + ' (' + parts.join(', ') + ')';
    },

    updatePollClosingsNext: function() {
        var container = document.getElementById('polls-closing-next');
        if (!container || !Counties || !Counties.countyData) return;
        var now = this.time;
        var buckets = {};
        for (var fips in Counties.countyData) {
            var county = Counties.countyData[fips];
            var closeTime = county.pollCloseTime;
            if (closeTime === undefined || closeTime < now) continue;
            var key = closeTime.toFixed(2);
            if (!buckets[key]) buckets[key] = 0;
            buckets[key] += 1;
        }
        var times = Object.keys(buckets).map(function(k) { return parseFloat(k); }).sort(function(a, b) { return a - b; }).slice(0, 3);
        if (!times.length) {
            container.innerHTML = '<div class="next-close-empty">All polls closed</div>';
            return;
        }
        var html = '';
        for (var i = 0; i < times.length; i++) {
            var t = times[i];
            var count = buckets[t.toFixed(2)];
            html += '<div class="next-close-row"><span>' + Utils.formatTime(t) + ' ET</span><span>' + count + ' counties</span></div>';
        }
        container.innerHTML = html;
    },

    toggleThirdPartyTracker: function() {
        var panel = document.getElementById('third-party-tracker-panel');
        if (!panel) return;
        panel.classList.toggle('hidden');
        if (!panel.classList.contains('hidden')) {
            this.updateThirdPartyTracker();
        }
    },

    updateThirdPartyTracker: function() {
        var body = document.getElementById('third-party-tracker-body');
        if (!body) return;
        if (!gameData.thirdPartiesEnabled) {
            body.innerHTML = '<div class="next-close-empty">Third-party tracking is disabled.</div>';
            return;
        }

        var parties = ['G', 'L', 'I', 'PSL'];
        var rows = [];
        var total = this.totalReportedVotes || 0;
        for (var i = 0; i < parties.length; i++) {
            var p = parties[i];
            var v = this.nationalPopularVotes[p] || 0;
            rows.push({ party: p, votes: v, pct: total > 0 ? (v / total) * 100 : 0 });
        }
        rows.sort(function(a, b) { return b.votes - a.votes; });

        var html = '<div class="third-tracker-national">';
        for (var r = 0; r < rows.length; r++) {
            var row = rows[r];
            html += '<div class="third-tracker-row"><span style="color:' + this.getPartyColor(row.party) + '">' + this.getPartyLabel(row.party) +
                '</span><span>' + row.votes.toLocaleString() + ' (' + row.pct.toFixed(1) + '%)</span></div>';
        }
        html += '</div>';

        html += '<div class="third-tracker-state-title">Top third-party states</div>';
        var stateRows = [];
        for (var code in gameData.states) {
            var s = gameData.states[code];
            var stateThird = (s.reportedVotes.G || 0) + (s.reportedVotes.L || 0) + (s.reportedVotes.I || 0) + (s.reportedVotes.PSL || 0);
            var stateTotal = stateThird + (s.reportedVotes.D || 0) + (s.reportedVotes.R || 0);
            if (stateTotal <= 0) continue;
            stateRows.push({ code: code, share: (stateThird / stateTotal) * 100, votes: stateThird });
        }
        stateRows.sort(function(a, b) { return b.share - a.share; });
        for (var si = 0; si < Math.min(8, stateRows.length); si++) {
            var sr = stateRows[si];
            html += '<div class="third-tracker-row"><span>' + sr.code + '</span><span>' + sr.share.toFixed(1) + '% (' + sr.votes.toLocaleString() + ')</span></div>';
        }

        body.innerHTML = html;
    },

    loadElectionMap: function() {
        var self = this;
        var wrapper = document.getElementById('election-map-wrapper');
        
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'map.svg', true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var parser = new DOMParser();
                var svgDoc = parser.parseFromString(xhr.responseText, 'image/svg+xml');
                var svg = svgDoc.querySelector('svg');

                if (svg) {
                    svg.id = 'election-map-svg';

                    // Inject diagonal-stripe flip patterns into SVG defs
                    var defs = svg.querySelector('defs');
                    if (!defs) {
                        defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
                        svg.insertBefore(defs, svg.firstChild);
                    }
                    var flipColors = {
                        D: { base: '#00AEF3', dark: '#00577a' },
                        R: { base: '#E81B23', dark: '#830f14' },
                        G: { base: '#198754', dark: '#0c4729' },
                        L: { base: '#fd7e14', dark: '#884208' },
                        I: { base: '#adb5bd', dark: '#555b61' }
                    };
                    for (var pCode in flipColors) {
                        var fc = flipColors[pCode];
                        var pat = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
                        pat.setAttribute('id', 'flip-pat-' + pCode);
                        pat.setAttribute('patternUnits', 'userSpaceOnUse');
                        pat.setAttribute('width', '10');
                        pat.setAttribute('height', '10');
                        pat.setAttribute('patternTransform', 'rotate(45 0 0)');
                        // Alternating stripes: base color + darker shade
                        var bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                        bg.setAttribute('width', '10'); bg.setAttribute('height', '10'); bg.setAttribute('fill', fc.base);
                        var stripe = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                        stripe.setAttribute('width', '5'); stripe.setAttribute('height', '10'); stripe.setAttribute('fill', fc.dark);
                        pat.appendChild(bg); pat.appendChild(stripe);
                        defs.appendChild(pat);
                    }

                    var paths = svg.querySelectorAll('path');
                    for (var i = 0; i < paths.length; i++) {
                        var path = paths[i];
                        var code = path.id;
                        if (code && gameData.states[code]) {
                            path.style.cursor = 'pointer';
                            (function(c) {
                                path.onclick = function() { Election.selectState(c); };
                                path.ondblclick = function(e) {
                                    e.stopPropagation();
                                    if (typeof Counties !== 'undefined') {
                                        Election.openCountyView(c);
                                    }
                                };
                                path.onmousemove = function(e) { Election.showMapTooltip(e, c); };
                                path.onmouseleave = function() { Election.hideMapTooltip(); };
                            })(code);
                        }
                    }
                    wrapper.innerHTML = '';
                    wrapper.appendChild(svg);
                    self.colorElectionMap();
                }
            }
        };
        xhr.send();
    },

    colorElectionMap: function() {
        for (var code in gameData.states) {
            var s = gameData.states[code];
            var path = document.querySelector('#election-map-svg #' + code);
            if (!path) continue;

            if (this.isShiftMapMode()) {
                var shiftYear = this.getActiveShiftYear();
                if (s.reportedPct > 0 && this.historicalMargins[shiftYear]) {
                    var shift = this.computeStateShiftForYear(code, shiftYear);
                    path.style.fill = shift === null ? '#444444' : Utils.getShiftColor(shift);
                } else {
                    path.style.fill = '#444444';
                }
            } else if (this.mapMode === 'projected') {
                if (s.called) {
                    // Diagonal stripes for states that flipped from 2024 result
                    var result2024 = RESULTS_2024[code];
                    var isFlip = result2024 && result2024 !== s.calledFor;
                    path.style.fill = isFlip
                        ? 'url(#flip-pat-' + s.calledFor + ')'
                        : this.getPartyColor(s.calledFor);
                } else {
                    path.style.fill = '#444444';
                }
            } else {
                // leader mode
                if (s.reportedPct > 0) {
                    var total = s.reportedVotes.D + s.reportedVotes.R + (s.reportedVotes.G || 0) + (s.reportedVotes.L || 0);
                    var pctMargin = total > 0 ? ((s.reportedVotes.D - s.reportedVotes.R) / total) * 100 : 0;
                    path.style.fill = Utils.getMarginColor(pctMargin);
                } else {
                    path.style.fill = '#333333';
                }
            }
        }
    },

    selectState: function(code) {
        var s = gameData.states[code];
        var container = document.getElementById('election-state-info');
        container.classList.remove('hidden');

        // Build projection status
        var projStatus = null;
        if (s.called) {
            var calledClass = s.calledFor === 'D' ? 'called-dem' : (s.calledFor === 'R' ? 'called-rep' : 'called-third');
            projStatus = { text: '✓ CALLED FOR ' + this.getPartyLabel(s.calledFor).toUpperCase(), cssClass: calledClass };
        } else if (s.reportedPct >= 100) {
            projStatus = { text: 'TOO CLOSE TO CALL', cssClass: '' };
        } else if (s.reportedPct > 0) {
            projStatus = { text: Math.floor(s.reportedPct) + '% REPORTING — COUNTING', cssClass: '' };
        } else {
            projStatus = { text: 'POLLS NOT YET CLOSED', cssClass: '' };
        }

        var html = '<div class="elec-state-header">';
        html += '<h2>' + s.name + '</h2>';
        html += '<span class="elec-ev-badge">' + s.ev + ' EV</span>';
        html += '</div>';
        if ((code === 'NE' || code === 'ME') && this.stateCallAllocations[code]) {
            var splitAlloc = this.stateCallAllocations[code];
            html += '<div class="elec-reporting">Split EV: D+' + (splitAlloc.D || 0) + ' | R+' + (splitAlloc.R || 0) + ' | 3rd+' +
                ((splitAlloc.G || 0) + (splitAlloc.L || 0) + (splitAlloc.I || 0) + (splitAlloc.PSL || 0)) + '</div>';
        }
        html += '<div class="elec-reporting"><span id="elec-pct-reporting">' + Math.floor(s.reportedPct) + '%</span> Reporting</div>';
        html += Utils.buildElectionRankedListHTML(s.reportedVotes, s.reportedPct, s.ev, projStatus);
        html += '<button class="county-drill-btn" onclick="Election.openCountyView(\'' + code + '\')">VIEW COUNTY RESULTS</button>';

        container.innerHTML = html;
    },

    addFeedItem: function(text) {
        var feed = document.getElementById('election-feed-content');
        var item = document.createElement('div');
        item.className = 'feed-item';
        item.innerHTML = '<span class="feed-time">' + Utils.formatTime(this.time) + '</span><span class="feed-text">' + text + '</span>';
        feed.insertBefore(item, feed.firstChild);
    },

    addRaceCall:  function(code, party) {
        var container = document.getElementById('race-calls-content');
        var chip = document.createElement('span');
        var chipClass = party === 'D' ? 'dem' : (party === 'R' ? 'rep' : 'third');
        chip.className = 'race-call-chip ' + chipClass;
        if (party !== 'D' && party !== 'R') {
            chip.style.background = this.getPartyColor(party);
        }
        chip.innerText = code;
        container.appendChild(chip);
    },

    showWinner: function() {
        this.winnerShown = true;
        // Determine winner by plurality of electoral votes
        var evTotals = [
            { party: 'D', ev: this.demEV },
            { party: 'R', ev: this.repEV }
        ];
        if (gameData.thirdPartiesEnabled) {
            evTotals.push({ party: 'T', ev: this.thirdPartyEV });
        }
        evTotals.sort(function(a, b) { return b.ev - a.ev; });
        var winner = evTotals[0].party;

        var cand, partyLabel, evCount;
        if (winner === 'D') {
            cand = gameData.demTicket.pres;
            partyLabel = 'DEMOCRATIC PARTY';
            evCount = this.demEV;
        } else if (winner === 'R') {
            cand = gameData.repTicket.pres;
            partyLabel = 'REPUBLICAN PARTY';
            evCount = this.repEV;
        } else {
            cand = gameData.candidate;
            partyLabel = PARTIES[gameData.selectedParty] ? PARTIES[gameData.selectedParty].name.toUpperCase() : 'THIRD PARTY';
            evCount = this.thirdPartyEV;
        }

        document.getElementById('winner-img').src = cand ? cand.img : 'images/scenario.jpg';
        document.getElementById('winner-name').innerText = cand ? cand.name : this.getPartyLabel(winner);
        document.getElementById('winner-party').innerText = partyLabel;
        document.getElementById('winner-ev-count').innerText = evCount;
        document.getElementById('winner-overlay').classList.remove('hidden');
    },

    buildVictoryNarrative: function(tickets, winnerEV, loserEV) {
        var winnerParty = tickets[0].party;
        var winnerName = tickets[0].ticket && tickets[0].ticket.pres ? tickets[0].ticket.pres.name : this.getPartyLabel(winnerParty);
        var margin = winnerEV - loserEV;
        var pvWinner = this.nationalPopularVotes.D >= this.nationalPopularVotes.R ? 'D' : 'R';
        var wonPopular = winnerParty === pvWinner;

        var style = 'narrow';
        if (winnerEV >= VICTORY_LANDSLIDE_EV_THRESHOLD || margin >= VICTORY_LANDSLIDE_MARGIN_THRESHOLD) style = 'landslide';
        else if (winnerEV >= VICTORY_CLEAR_EV_THRESHOLD || margin >= VICTORY_CLEAR_MARGIN_THRESHOLD) style = 'clear';

        if (winnerParty !== 'D' && winnerParty !== 'R') {
            return winnerName + ' delivered a historic third-party breakthrough, converting outsider energy into an Electoral College victory and forcing a major coalition realignment.';
        }
        if (style === 'landslide') {
            return winnerName + ' secured a commanding Electoral College victory, building a broad coalition that overwhelmed the opposition across multiple regions.';
        }
        if (style === 'clear' && wonPopular) {
            return winnerName + ' won with a clear Electoral and popular-vote mandate, combining turnout strength with favorable county-level demographic shifts.';
        }
        if (style === 'clear' && !wonPopular) {
            return winnerName + ' won the Electoral College despite trailing nationally in the popular vote, showing how regional efficiency can outweigh raw vote totals.';
        }
        return winnerName + ' eked out a narrow win in a razor-tight map, where turnout and late-reporting county batches made the decisive difference.';
    },

    buildCoalitionBreakdownHTML: function() {
        if (!Counties || !Counties.countyData || !Counties.getCountyGroupShare) return '';
        var groups = Counties.DEMOGRAPHIC_POOL_GROUPS || [];
        var totalPop = 0;
        for (var fips in Counties.countyData) {
            totalPop += Counties.countyData[fips].p || 0;
        }
        if (totalPop <= 0 || !groups.length) return '';

        var rows = [];
        for (var i = 0; i < groups.length; i++) {
            var groupId = groups[i];
            var weightedPop = 0;
            for (var cfips in Counties.countyData) {
                var county = Counties.countyData[cfips];
                var share = Counties.getCountyGroupShare(county, groupId) || 0;
                weightedPop += (county.p || 0) * share;
            }
            var nationalPct = (weightedPop / totalPop) * 100;
            var support = Counties.getGroupSupportByParty(groupId, null);
            rows.push({
                id: groupId,
                popPct: nationalPct,
                d: support.D || 0,
                r: support.R || 0,
                third: (support.G || 0) + (support.L || 0) + (support.I || 0) + (support.PSL || 0),
                turnout: ((gameData.interestGroupTurnout && gameData.interestGroupTurnout[groupId]) || DEFAULT_INTEREST_GROUP_TURNOUT_MULTIPLIER) * COALITION_BASE_TURNOUT_PCT,
                change: ((gameData.interestGroupChanges && gameData.interestGroupChanges[groupId] && gameData.interestGroupChanges[groupId][gameData.candidate && gameData.candidate.id]) || 0)
            });
        }
        rows.sort(function(a, b) { return b.popPct - a.popPct; });

        var html = '<div class="campaign-summary"><h2>COALITION BREAKDOWN</h2><div class="coalition-table">';
        html += '<div class="coalition-row coalition-head"><span>Group</span><span>National %</span><span>Dem</span><span>Rep</span><span>3rd</span><span>Turnout</span><span>Δ</span></div>';
        for (var r = 0; r < Math.min(rows.length, 10); r++) {
            var row = rows[r];
            html += '<div class="coalition-row"><span>' + row.id.toUpperCase() + '</span><span>' + row.popPct.toFixed(1) + '%</span><span>' +
                row.d.toFixed(1) + '%</span><span>' + row.r.toFixed(1) + '%</span><span>' + row.third.toFixed(1) +
                '%</span><span>' + row.turnout.toFixed(0) + '%</span><span>' + (row.change >= 0 ? '+' : '') + row.change.toFixed(1) + '</span></div>';
        }
        html += '</div></div>';
        return html;
    },

    buildDistrictAnalysisHTML: function() {
        if (!Counties || !Counties.calculateStateElectoralAllocation) return '';
        var states = ['ME', 'NE'];
        var html = '<div class="campaign-summary"><h2>DISTRICT ANALYSIS</h2>';
        for (var i = 0; i < states.length; i++) {
            var code = states[i];
            var result = Counties.calculateStateElectoralAllocation(code, { useReportedVotes: true });
            if (!result || !result.isSplitState) continue;
            html += '<div class="district-analysis-block"><strong>' + code + '</strong> ';
            html += '(Statewide: ' + this.getPartyLabel(result.statewideWinner) + ' +' + (result.statewideEV || 2) + ' EV)';
            for (var d = 0; d < result.districtResults.length; d++) {
                var dr = result.districtResults[d];
                html += '<div class="district-analysis-row">' + dr.district + ': ' + this.getPartyLabel(dr.winner) + ' wins 1 EV</div>';
            }
            html += '</div>';
        }
        html += '</div>';
        return html;
    },

    buildSpoilerAnalysisHTML: function() {
        if (!gameData.thirdPartiesEnabled) return '';
        var dem = this.nationalPopularVotes.D || 0;
        var rep = this.nationalPopularVotes.R || 0;
        var third = (this.nationalPopularVotes.G || 0) + (this.nationalPopularVotes.L || 0) + (this.nationalPopularVotes.I || 0) + (this.nationalPopularVotes.PSL || 0);
        var major = dem + rep;
        if (major <= 0 || third <= 0) return '';
        var demNoThird = dem + (third * (dem / major));
        var repNoThird = rep + (third * (rep / major));
        var html = '<div class="campaign-summary"><h2>VOTE SPLIT ESTIMATE</h2>';
        html += '<p>If third-party ballots redistributed proportionally to major-party shares: ';
        html += 'Democrats ' + Math.round(demNoThird).toLocaleString() + ' vs Republicans ' + Math.round(repNoThird).toLocaleString() + '.</p>';
        html += '</div>';
        return html;
    },

    showFinalResults: function() {
        // Determine winner and runner-up by EV count
        var tickets = [
            { ticket: gameData.demTicket, party: 'D', ev: this.demEV },
            { ticket: gameData.repTicket, party: 'R', ev: this.repEV }
        ];
        if (gameData.thirdPartiesEnabled && this.thirdPartyEV > 0) {
            tickets.push({ ticket: { pres: gameData.candidate, vp: gameData.vp }, party: gameData.selectedParty, ev: this.thirdPartyEV });
        }
        tickets.sort(function(a, b) { return b.ev - a.ev; });
        
        var winner = tickets[0].ticket;
        var winnerEV = tickets[0].ev;
        var loser = tickets[1].ticket;
        var loserEV = tickets[1].ev;
        var isPlayerWinner = tickets[0].party === gameData.selectedParty;
        
        // Build the final results overlay
        var resultsHTML = '<div class="final-results-content">';
        
        if (isPlayerWinner) {
            resultsHTML += '<div class="result-banner win">🎉 CONGRATULATIONS! 🎉</div>';
            resultsHTML += '<h1 class="result-title">VICTORY!</h1>';
        } else {
            resultsHTML += '<div class="result-banner lose">ELECTION RESULTS</div>';
            resultsHTML += '<h1 class="result-title">DEFEAT</h1>';
        }
        
        // Winner ticket
        resultsHTML += '<div class="result-ticket winner-ticket">';
        resultsHTML += '<div class="ticket-header">PRESIDENT-ELECT</div>';
        resultsHTML += '<div class="ticket-candidates">';
        resultsHTML += '<div class="ticket-pres">';
        resultsHTML += '<img src="' + (winner.pres ? winner.pres.img : 'images/scenario.jpg') + '" alt="">';
        resultsHTML += '<div>' + (winner.pres ? winner.pres.name : 'Candidate') + '</div>';
        resultsHTML += '</div>';
        resultsHTML += '<div class="ticket-vp">';
        resultsHTML += '<img src="' + (winner.vp ? winner.vp.img : 'images/scenario.jpg') + '" alt="">';
        resultsHTML += '<div>' + (winner.vp ? winner.vp.name : 'Running Mate') + '</div>';
        resultsHTML += '</div>';
        resultsHTML += '</div>';
        resultsHTML += '<div class="ticket-ev">' + winnerEV + ' Electoral Votes</div>';
        resultsHTML += '</div>';
        
        // Loser ticket
        resultsHTML += '<div class="result-ticket loser-ticket">';
        resultsHTML += '<div class="ticket-header">RUNNER-UP</div>';
        resultsHTML += '<div class="ticket-candidates">';
        resultsHTML += '<div class="ticket-pres">';
        resultsHTML += '<img src="' + (loser.pres ? loser.pres.img : 'images/scenario.jpg') + '" alt="">';
        resultsHTML += '<div>' + (loser.pres ? loser.pres.name : 'Candidate') + '</div>';
        resultsHTML += '</div>';
        resultsHTML += '<div class="ticket-vp">';
        resultsHTML += '<img src="' + (loser.vp ? loser.vp.img : 'images/scenario.jpg') + '" alt="">';
        resultsHTML += '<div>' + (loser.vp ? loser.vp.name : 'Running Mate') + '</div>';
        resultsHTML += '</div>';
        resultsHTML += '</div>';
        resultsHTML += '<div class="ticket-ev">' + loserEV + ' Electoral Votes</div>';
        resultsHTML += '</div>';
        
        // Third party results (if enabled and have EVs)
        if (gameData.thirdPartiesEnabled && this.thirdPartyEV > 0) {
            var thirdColor = this.getPartyColor(gameData.selectedParty);
            resultsHTML += '<div class="result-ticket" style="border-color: ' + thirdColor + ';">';
            resultsHTML += '<div class="ticket-header">THIRD PARTIES</div>';
            resultsHTML += '<div class="ticket-ev">' + this.thirdPartyEV + ' Electoral Votes</div>';
            resultsHTML += '</div>';
        }
        
        // Campaign summary
        resultsHTML += '<div class="campaign-summary">';
        resultsHTML += '<h2>CAMPAIGN SUMMARY</h2>';
        resultsHTML += '<p>' + this.buildVictoryNarrative(tickets, winnerEV, loserEV) + '</p>';
        resultsHTML += '</div>';
        resultsHTML += this.buildCoalitionBreakdownHTML();
        resultsHTML += this.buildDistrictAnalysisHTML();
        resultsHTML += this.buildSpoilerAnalysisHTML();

        // Buttons
        resultsHTML += '<div class="result-buttons">';
        resultsHTML += '<button class="result-btn" onclick="Election.enterAnalysisMode()">OPEN ANALYSIS CENTER</button>';
        resultsHTML += '<button class="result-btn" onclick="Election.toggleResultsView()">VIEW ELECTION NIGHT</button>';
        resultsHTML += '<button class="result-btn" onclick="location.reload()">NEW CAMPAIGN</button>';
        resultsHTML += '</div>';

        resultsHTML += '</div>';
        
        // Create or update the final results overlay
        var overlay = document.getElementById('final-results-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'final-results-overlay';
            overlay.className = 'modal-overlay';
            document.body.appendChild(overlay);
        }
        overlay.innerHTML = resultsHTML;
        overlay.classList.remove('hidden');

        // Unlock the 2024 Shift map mode button now that all votes are counted
        var shift24Btn = document.getElementById('mode-shift2024');
        if (shift24Btn && Object.keys(this.data2024).length > 0) {
            shift24Btn.classList.remove('hidden');
        }
        var analysisBtn = document.getElementById('analysis-open-btn');
        if (analysisBtn) analysisBtn.classList.remove('hidden');
    },
    
    toggleResultsView: function() {
        var finalResults = document.getElementById('final-results-overlay');
        if (finalResults) {
            finalResults.classList.toggle('hidden');
        }
    },

    closeWinnerOverlay: function() {
        document.getElementById('winner-overlay').classList.add('hidden');
    },

    togglePause: function() {
        this.paused = ! this.paused;
        document.getElementById('btn-pause').innerText = this.paused ? '▶️' : '⏸️';
    },

    setSpeed: function(speed) {
        this.speed = speed;
        // Unpause when setting a new speed
        if (this.paused && speed > 0) {
            this.paused = false;
            document.getElementById('btn-pause').innerText = '⏸️';
        }
        var btns = document.querySelectorAll('.time-btn');
        for (var i = 0; i < btns.length; i++) {
            btns[i].classList.remove('active');
        }
        // Highlight the active speed button
        document.getElementById('btn-' + speed + 'x').classList.add('active');
    },

    setMapMode: function(mode) {
        this.mapMode = mode;
        document.getElementById('mode-leader').classList.toggle('active', mode === 'leader');
        document.getElementById('mode-projected').classList.toggle('active', mode === 'projected');
        var shift24Btn = document.getElementById('mode-shift2024');
        if (shift24Btn) shift24Btn.classList.toggle('active', mode === 'shift2024');
        // Show diagonal-stripe flip legend only in projected mode
        var flipHint = document.getElementById('flip-legend-hint');
        if (flipHint) flipHint.classList.toggle('hidden', mode !== 'projected');
        this.colorElectionMap();
        if (gameData.electionCountyViewState) {
            this.updateCountyViewTitle(gameData.electionCountyViewState);
        }
    },

    resetAnalysisUI: function() {
        var screen = document.getElementById('election-screen');
        if (screen) screen.classList.remove('analysis-mode');
        var controls = document.getElementById('analysis-controls');
        if (controls) controls.classList.add('hidden');
        var analysisBtn = document.getElementById('analysis-open-btn');
        if (analysisBtn) analysisBtn.classList.add('hidden');
        var banner = document.querySelector('.election-banner');
        if (banner) banner.innerText = 'ELECTION NIGHT IN AMERICA';
    },

    enterAnalysisMode: function() {
        if (this.analysisMode) return;
        this.analysisMode = true;
        this.preAnalysisPaused = this.paused;
        this.preAnalysisMapMode = this.mapMode;
        this.paused = true;

        var pauseBtn = document.getElementById('btn-pause');
        if (pauseBtn) pauseBtn.innerText = '▶️';

        var screen = document.getElementById('election-screen');
        if (screen) screen.classList.add('analysis-mode');
        var controls = document.getElementById('analysis-controls');
        if (controls) controls.classList.remove('hidden');
        var analysisBtn = document.getElementById('analysis-open-btn');
        if (analysisBtn) analysisBtn.classList.add('hidden');
        var banner = document.querySelector('.election-banner');
        if (banner) banner.innerText = 'ELECTION ANALYSIS CENTER';

        var overlay = document.getElementById('final-results-overlay');
        if (overlay) overlay.classList.add('hidden');

        if (gameData.electionCountyViewState) {
            this.closeCountyView();
        }

        this.setMapMode('shiftHistorical');
        this.populateAnalysisYearSelect();
    },

    exitAnalysisMode: function() {
        if (!this.analysisMode) return;
        this.analysisMode = false;
        this.paused = this.preAnalysisPaused;
        var pauseBtn = document.getElementById('btn-pause');
        if (pauseBtn) pauseBtn.innerText = this.paused ? '▶️' : '⏸️';
        var screen = document.getElementById('election-screen');
        if (screen) screen.classList.remove('analysis-mode');
        var controls = document.getElementById('analysis-controls');
        if (controls) controls.classList.add('hidden');
        var analysisBtn = document.getElementById('analysis-open-btn');
        if (analysisBtn && this.allVotesCounted) analysisBtn.classList.remove('hidden');
        var banner = document.querySelector('.election-banner');
        if (banner) banner.innerText = 'ELECTION NIGHT IN AMERICA';

        this.setMapMode(this.preAnalysisMapMode || 'leader');
    },

    setAnalysisYear: function(yearValue) {
        var year = parseInt(yearValue, 10);
        if (!year) return;
        this.selectedShiftYear = year;
        var select = document.getElementById('analysis-year-select');
        if (select && select.value !== String(year)) {
            select.value = String(year);
        }
        if (this.analysisMode && this.mapMode !== 'shiftHistorical') {
            this.setMapMode('shiftHistorical');
        }
        this.colorElectionMap();
        if (gameData.electionCountyViewState) {
            this.updateCountyElectionColors();
            this.updateCountyViewTitle(gameData.electionCountyViewState);
        }
    },
    
    skipToEnd: function() {
        // Instantly complete all vote counting at county level
        if (typeof Counties !== 'undefined' && Counties.countyData) {
            for (var fips in Counties.countyData) {
                var county = Counties.countyData[fips];
                county.reportedPct = 100;
                
                // Calculate final county votes with turnout
                if (county.v) {
                    county.reportedVotes = county.reportedVotes || {};
                    var undecidedPct = county.undecided || 0;
                    var decidedMultiplier = (100 - undecidedPct) / 100;

                    if (!county.marginOfError) {
                        county.marginOfError = (Math.random() - 0.5) * 4; // ±2%
                    }
                    var errorFactor = 1.0 + (county.marginOfError / 100);
                    county.reportedVotes = this.calculateCountyReportedVotes(county, 1, decidedMultiplier, errorFactor);
                }
            }
        }
        
        // Aggregate county votes to states
        for (var code in gameData.states) {
            this.aggregateCountyVotes(code);
            
            var s = gameData.states[code];
            
            // Call the state if not already called
            if (!s.called) {
                var allocationResult = (typeof Counties !== 'undefined' && Counties.calculateStateElectoralAllocation)
                    ? Counties.calculateStateElectoralAllocation(code, { useReportedVotes: true }) : null;
                s.called = true;
                s.calledFor = allocationResult && allocationResult.calledFor ? allocationResult.calledFor : this.getStateWinner(s);
                this.awardEV(s, allocationResult ? allocationResult.allocation : null);
                this.stateCallAllocations[code] = allocationResult ? allocationResult.allocation : null;
            }
        }
        this.updateNationalPopularVote();
        
        // Advance time to end
        this.time = 26;
        
        // Update display and show final results
        this.updateDisplay();
        this.colorElectionMap();
        
        // Mark all votes as counted and show results
        if (!this.allVotesCounted) {
            this.allVotesCounted = true;
            this.showFinalResults();
        }
    },

    // ─── Tooltip helpers ────────────────────────────────────────────────────────

    showMapTooltip: function(e, code) {
        var s = gameData.states[code];
        if (!s) return;
        var tooltip = document.getElementById('map-tooltip');
        if (!tooltip) return;

        if (this.isShiftMapMode()) {
            var shiftYear = this.getActiveShiftYear();
            var shift = this.computeStateShiftForYear(code, shiftYear);
            var shiftLabel = this.getShiftLabelHtml(shift);
            tooltip.innerHTML = '<strong>' + s.name + '</strong><br>' + shiftLabel + '<br><span style="color:#888">Shift vs ' + shiftYear + '</span>';
            tooltip.style.display = 'block';
            tooltip.style.left = (e.clientX + 15) + 'px';
            tooltip.style.top = (e.clientY - 10) + 'px';
            return;
        }

        var total = (s.reportedVotes.D || 0) + (s.reportedVotes.R || 0) +
                    (s.reportedVotes.G || 0) + (s.reportedVotes.L || 0);
        var pctMargin = total > 0 ? ((s.reportedVotes.D - s.reportedVotes.R) / total) * 100 : 0;

        var leaderText;
        if (s.reportedPct === 0) {
            leaderText = 'Polls not yet closed';
        } else if (s.called) {
            leaderText = '✓ ' + this.getPartyLabel(s.calledFor) + ' +' + Math.abs(pctMargin).toFixed(1) + '%';
        } else {
            var leader = pctMargin > 0 ? 'D' : (pctMargin < 0 ? 'R' : 'TIE');
            leaderText = leader + ' leading +' + Math.abs(pctMargin).toFixed(1) + '%';
        }

        tooltip.innerHTML = '<strong>' + s.name + '</strong><br>' + leaderText + '<br><span style="color:#888">' + Math.floor(s.reportedPct) + '% reporting</span>';
        tooltip.style.display = 'block';
        tooltip.style.left = (e.clientX + 15) + 'px';
        tooltip.style.top = (e.clientY - 10) + 'px';
    },

    showCountyMapTooltip: function(e, fips) {
        var county = Counties.countyData[fips];
        if (!county) return;
        var tooltip = document.getElementById('map-tooltip');
        if (!tooltip) return;

        if (this.isShiftMapMode()) {
            var shiftYear = this.getActiveShiftYear();
            var shift = this.computeCountyShiftForYear(fips, shiftYear);
            var shiftLabel = this.getShiftLabelHtml(shift);
            tooltip.innerHTML = '<strong>' + (county.n || 'County') + '</strong><br>' + shiftLabel + '<br><span style="color:#888">Shift vs ' + shiftYear + '</span>';
            tooltip.style.display = 'block';
            tooltip.style.left = (e.clientX + 15) + 'px';
            tooltip.style.top = (e.clientY - 10) + 'px';
            return;
        }

        var rVotes = county.reportedVotes || {};
        var total = (rVotes.D || 0) + (rVotes.R || 0) + (rVotes.G || 0) + (rVotes.L || 0);
        var pctMargin = total > 0 ? ((rVotes.D - rVotes.R) / total) * 100 : 0;

        var leaderText;
        if (!county.reportedPct || county.reportedPct === 0) {
            leaderText = 'Reporting soon…';
        } else {
            var leader = pctMargin > 0 ? 'D' : (pctMargin < 0 ? 'R' : 'TIE');
            leaderText = leader + ' +' + Math.abs(pctMargin).toFixed(1) + '%';
        }

        tooltip.innerHTML = '<strong>' + (county.n || 'County') + '</strong><br>' + leaderText + '<br><span style="color:#888">' + Math.floor(county.reportedPct || 0) + '% reporting</span>';
        tooltip.style.display = 'block';
        tooltip.style.left = (e.clientX + 15) + 'px';
        tooltip.style.top = (e.clientY - 10) + 'px';
    },

    hideMapTooltip: function() {
        var tooltip = document.getElementById('map-tooltip');
        if (tooltip) tooltip.style.display = 'none';
    },

    // ─── Historical shift helpers ───────────────────────────────────────────────

    parseCsvLine: function(line) {
        var result = [];
        var current = '';
        var inQuotes = false;
        for (var i = 0; i < line.length; i++) {
            var char = line.charAt(i);
            if (char === '"') {
                if (inQuotes && line.charAt(i + 1) === '"') {
                    current += '"';
                    i++;
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                result.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        result.push(current);
        return result;
    },

    normalizeFipsCode: function(rawFips) {
        var cleaned = (rawFips || '').replace(/"/g, '').trim();
        if (!cleaned) return '';
        var parsed = parseInt(cleaned, 10);
        if (!isFinite(parsed)) return '';
        return String(parsed).padStart(5, '0');
    },

    addHistoricalYear: function(year) {
        if (!year) return;
        if (this.historicalYears.indexOf(year) === -1) {
            this.historicalYears.push(year);
            this.historicalYears.sort(function(a, b) { return b - a; });
        }
    },

    populateAnalysisYearSelect: function() {
        var select = document.getElementById('analysis-year-select');
        if (!select) return;
        select.innerHTML = '';
        if (!this.historicalYears.length) {
            var loadingOption = document.createElement('option');
            loadingOption.value = '';
            loadingOption.text = 'Loading...';
            select.appendChild(loadingOption);
            select.disabled = true;
            return;
        }
        select.disabled = false;
        for (var i = 0; i < this.historicalYears.length; i++) {
            var year = this.historicalYears[i];
            var option = document.createElement('option');
            option.value = year;
            option.text = String(year);
            select.appendChild(option);
        }
        if (this.historicalYears.indexOf(this.selectedShiftYear) === -1) {
            this.selectedShiftYear = this.historicalYears[0];
        }
        select.value = String(this.selectedShiftYear);
        if (this.analysisMode && this.isShiftMapMode()) {
            this.setAnalysisYear(this.selectedShiftYear);
        }
    },

    getActiveShiftYear: function() {
        if (this.mapMode === 'shift2024') return 2024;
        return this.selectedShiftYear || 2024;
    },

    isShiftMapMode: function() {
        return this.mapMode === 'shift2024' || this.mapMode === 'shiftHistorical';
    },

    getHistoricalMargin: function(year, fips) {
        var yearData = this.historicalMargins[year];
        if (!yearData) return null;
        var fips5 = String(fips || '').padStart(5, '0');
        if (!fips5) return null;
        if (yearData[fips5] === undefined) return null;
        return yearData[fips5];
    },

    getCandidateNameForParty: function(party) {
        if (party === gameData.selectedParty && gameData.candidate) {
            return gameData.candidate.name;
        }
        if (party === 'D' && gameData.demTicket && gameData.demTicket.pres) {
            return gameData.demTicket.pres.name;
        }
        if (party === 'R' && gameData.repTicket && gameData.repTicket.pres) {
            return gameData.repTicket.pres.name;
        }
        return this.getPartyLabel(party);
    },

    getShiftLabelHtml: function(shift) {
        if (shift === null || shift === undefined || !isFinite(shift)) {
            return '<span style="color:#888888">NO DATA</span>';
        }
        var absShift = Math.abs(shift);
        if (absShift < 0.05) {
            return '<span style="color:#cccccc">EVEN</span>';
        }
        var party = shift > 0 ? 'D' : 'R';
        var color = this.getPartyColor(party);
        var candidateName = this.getCandidateNameForParty(party);
        return '<span style="color:' + color + '; font-weight: bold;">' + candidateName + ' +' + absShift.toFixed(1) + '</span>';
    },

    // Load 2000-2020 county presidential results (2024 handled separately)
    loadHistoricalData: function() {
        if (this.historicalDataLoaded) return;
        var self = this;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'counties/2000-2020-countypres.csv', true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var lines = xhr.responseText.split('\n');
                var yearAggregates = {};
                for (var i = 1; i < lines.length; i++) {
                    var line = lines[i].trim();
                    if (!line) continue;
                    var parts = self.parseCsvLine(line);
                    if (parts.length < 12) continue;
                    var year = parseInt(parts[0], 10);
                    var fips5 = self.normalizeFipsCode(parts[4]);
                    var party = (parts[7] || '').replace(/"/g, '').trim().toUpperCase();
                    var votes = parseFloat(parts[8]);
                    var totalVotes = parseFloat(parts[9]);
                    if (!year || !fips5 || !isFinite(votes) || !isFinite(totalVotes) || totalVotes <= 0) continue;
                    if (party !== 'DEMOCRAT' && party !== 'REPUBLICAN') continue;

                    if (!yearAggregates[year]) yearAggregates[year] = {};
                    if (!yearAggregates[year][fips5]) {
                        yearAggregates[year][fips5] = { d: 0, r: 0, total: totalVotes };
                    }
                    var rec = yearAggregates[year][fips5];
                    rec.total = totalVotes;
                    if (party === 'DEMOCRAT') rec.d += votes;
                    if (party === 'REPUBLICAN') rec.r += votes;
                }

                for (var yr in yearAggregates) {
                    if (!yearAggregates.hasOwnProperty(yr)) continue;
                    var yearNum = parseInt(yr, 10);
                    var margins = {};
                    var countyData = yearAggregates[yr];
                    for (var fips in countyData) {
                        if (!countyData.hasOwnProperty(fips)) continue;
                        var rec = countyData[fips];
                        if (!rec || !isFinite(rec.total) || rec.total <= 0) continue;
                        var margin = ((rec.d - rec.r) / rec.total) * 100;
                        margins[fips] = margin;
                    }
                    self.historicalMargins[yearNum] = margins;
                    self.addHistoricalYear(yearNum);
                }

                self.historicalDataLoaded = true;
                console.log('✓ Historical election data loaded: ' + self.historicalYears.length + ' cycles');
                self.populateAnalysisYearSelect();
                if (self.analysisMode && self.isShiftMapMode()) {
                    self.colorElectionMap();
                    if (gameData.electionCountyViewState) self.updateCountyElectionColors();
                }
            }
        };
        xhr.send();
    },

    // ─── 2024 Shift helpers ─────────────────────────────────────────────────────

    data2024: {},

    load2024Data: function() {
        var self = this;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'counties/2024_US_County_Level_Presidential_Results.csv', true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                self.data2024 = {};
                var lines = xhr.responseText.split('\n');
                // Columns: state_name,county_fips,county_name,votes_gop,votes_dem,
                //          total_votes,diff,per_gop,per_dem,per_point_diff
                for (var i = 1; i < lines.length; i++) {
                    var line = lines[i].trim();
                    if (!line) continue;
                    var parts = line.split(',');
                    if (parts.length < 10) continue;
                    var fips5 = self.normalizeFipsCode(parts[1]);
                    // CSV per_point_diff = (votes_gop - votes_dem) / total_votes stored as a
                    // decimal fraction, e.g. 0.46 means GOP led by 46 percentage points.
                    // We multiply by 100 to convert to percentage-point scale and negate so that
                    // positive values represent a Dem-favoring margin (matching game convention).
                    var perPointDiff = parseFloat(parts[9]);
                    if (!fips5 || isNaN(perPointDiff)) continue;
                    self.data2024[fips5] = -perPointDiff * 100;
                }
                self.historicalMargins[2024] = self.data2024;
                self.addHistoricalYear(2024);
                console.log('✓ 2024 election data loaded: ' + Object.keys(self.data2024).length + ' counties');
                var shift24Btn = document.getElementById('mode-shift2024');
                if (shift24Btn && Object.keys(self.data2024).length > 0 && self.allVotesCounted) {
                    shift24Btn.classList.remove('hidden');
                }
                self.populateAnalysisYearSelect();
                if (self.analysisMode && self.isShiftMapMode()) {
                    self.colorElectionMap();
                    if (gameData.electionCountyViewState) self.updateCountyElectionColors();
                }
            }
        };
        xhr.send();
    },

    // Compute current-election margin vs 2024 for a county (positive = D shift)
    computeCountyShift: function(fips) {
        return this.computeCountyShiftForYear(fips, 2024);
    },
    
    // Population-weighted state shift from 2024
    computeStateShift: function(stateCode) {
        return this.computeStateShiftForYear(stateCode, 2024);
    },

    // Compute current-election margin vs selected historical year for a county
    computeCountyShiftForYear: function(fips, year) {
        var fips5 = String(fips || '').padStart(5, '0');
        if (this.allVotesCounted && this.shiftCountyCache[year] && this.shiftCountyCache[year][fips5] !== undefined) {
            return this.shiftCountyCache[year][fips5];
        }
        var margin = this.getHistoricalMargin(year, fips5);
        if (margin === null) return null;
        var county = Counties.countyData[fips];
        if (!county || !county.reportedVotes) return null;
        var total = (county.reportedVotes.D || 0) + (county.reportedVotes.R || 0);
        if (total <= 0) return null;
        var curMargin = ((county.reportedVotes.D - county.reportedVotes.R) / total) * 100;
        var shift = curMargin - margin;
        if (this.allVotesCounted) {
            if (!this.shiftCountyCache[year]) this.shiftCountyCache[year] = {};
            this.shiftCountyCache[year][fips5] = shift;
        }
        return shift;
    },

    // Population-weighted state shift from selected historical year
    computeStateShiftForYear: function(stateCode, year) {
        var stateFips = STATES[stateCode] ? STATES[stateCode].fips : null;
        if (!stateFips || !Counties.countyData) return null;
        if (this.allVotesCounted && this.shiftStateCache[year] && this.shiftStateCache[year][stateCode] !== undefined) {
            return this.shiftStateCache[year][stateCode];
        }
        var weightedShift = 0;
        var totalPop = 0;
        for (var fips in Counties.countyData) {
            var paddedFips = fips.padStart(5, '0');
            if (paddedFips.substring(0, 2) !== stateFips) continue;
            var margin = this.getHistoricalMargin(year, paddedFips);
            if (margin === null) continue;
            var county = Counties.countyData[fips];
            if (!county.reportedVotes) continue;
            var total = (county.reportedVotes.D || 0) + (county.reportedVotes.R || 0);
            if (total <= 0) continue;
            var curMargin = ((county.reportedVotes.D - county.reportedVotes.R) / total) * 100;
            var pop = county.p || 1;
            weightedShift += (curMargin - margin) * pop;
            totalPop += pop;
        }
        var stateShift = totalPop > 0 ? weightedShift / totalPop : null;
        if (this.allVotesCounted) {
            if (!this.shiftStateCache[year]) this.shiftStateCache[year] = {};
            this.shiftStateCache[year][stateCode] = stateShift;
        }
        return stateShift;
    },

    // ─── Integrated county view (no modal overlay) ───────────────────────────

    openCountyView: function(stateCode) {
        var self = this;
        gameData.electionCountyViewState = stateCode;
        var state = gameData.states[stateCode];

        // Swap national map for county view inside the same container
        var nationalWrapper = document.getElementById('election-map-wrapper');
        var cvWrapper = document.getElementById('election-county-view-wrapper');
        if (nationalWrapper) nationalWrapper.classList.add('hidden');
        if (cvWrapper) cvWrapper.classList.remove('hidden');

        this.updateCountyViewTitle(stateCode);

        this.loadCountyElectionMap(stateCode);
    },

    closeCountyView: function() {
        gameData.electionCountyViewState = null;
        var nationalWrapper = document.getElementById('election-map-wrapper');
        var cvWrapper = document.getElementById('election-county-view-wrapper');
        if (cvWrapper) cvWrapper.classList.add('hidden');
        if (nationalWrapper) nationalWrapper.classList.remove('hidden');

        if (this.countyMapUpdateInterval) {
            clearInterval(this.countyMapUpdateInterval);
            this.countyMapUpdateInterval = null;
        }
        this.hideMapTooltip();
    },

    updateCountyViewTitle: function(stateCode) {
        var state = gameData.states[stateCode];
        var titleEl = document.getElementById('election-cv-title');
        if (!titleEl) return;
        var baseTitle = (state ? state.name.toUpperCase() : stateCode);
        if (this.isShiftMapMode()) {
            var year = this.getActiveShiftYear();
            titleEl.innerText = baseTitle + ' — COUNTY SHIFT VS ' + year;
        } else {
            titleEl.innerText = baseTitle + ' — COUNTY RESULTS';
        }
    },

    loadCountyElectionMap: function(stateCode) {
        var self = this;
        var wrapper = document.getElementById('election-county-map-container');
        if (!wrapper) return;
        wrapper.innerHTML = '<div class="county-map-loading">Loading county map…</div>';

        var stateFips = STATES[stateCode] ? STATES[stateCode].fips : null;
        if (!stateFips) {
            wrapper.innerHTML = '<div class="county-map-loading">No county map available for this state.</div>';
            return;
        }

        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'counties/uscountymap.svg', true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var parser = new DOMParser();
                var svgDoc = parser.parseFromString(xhr.responseText, 'image/svg+xml');
                var svg = svgDoc.querySelector('svg');

                if (svg) {
                    svg.id = 'county-election-map-svg';
                    svg.style.width = '100%';
                    svg.style.height = '100%';

                    var paths = svg.querySelectorAll('path');
                    var stateCountyPaths = [];

                    for (var i = 0; i < paths.length; i++) {
                        var path = paths[i];
                        var pathId = path.id;

                        if (pathId && pathId.charAt(0) === 'c') {
                            var fips = pathId.substring(1);
                            var paddedFips = fips.padStart(5, '0');
                            var countyStateFips = paddedFips.substring(0, 2);

                            if (countyStateFips === stateFips && Counties.countyData[fips]) {
                                stateCountyPaths.push(path);
                                path.style.display = 'block';
                                path.style.cursor = 'pointer';
                                path.style.stroke = '#ffffff';
                                path.style.strokeWidth = '0.5';

                                self.colorCountyPath(path, fips, stateCode);

                                (function(f) {
                                    path.onclick = function() { Election.showCountyDetail(f); };
                                    path.onmousemove = function(e) { Election.showCountyMapTooltip(e, f); };
                                    path.onmouseleave = function() { Election.hideMapTooltip(); };
                                })(fips);
                            } else {
                                path.style.display = 'none';
                            }
                        } else {
                            path.style.display = 'none';
                        }
                    }

                    wrapper.innerHTML = '';
                    wrapper.appendChild(svg);

                    if (stateCountyPaths.length === 0) {
                        wrapper.innerHTML = '<div class="county-map-loading">No counties found for this state.</div>';
                    } else {
                        self.focusOnStateCounties(svg, stateFips, stateCountyPaths);
                        if (!self.analysisMode) {
                            if (self.countyMapUpdateInterval) clearInterval(self.countyMapUpdateInterval);
                            self.countyMapUpdateInterval = setInterval(function() {
                                if (!document.getElementById('county-election-map-svg')) {
                                    clearInterval(self.countyMapUpdateInterval);
                                    return;
                                }
                                self.updateCountyElectionColors();
                            }, 500);
                        }
                    }
                } else {
                    wrapper.innerHTML = '<div class="county-map-loading">Could not load county map.</div>';
                }
            } else if (xhr.readyState === 4) {
                wrapper.innerHTML = '<div class="county-map-loading">Failed to load county map.</div>';
            }
        };
        xhr.send();
    },

    colorCountyPath: function(path, fips, stateCode) {
        var county = Counties.countyData[fips];
        if (!county || !county.reportedVotes) {
            path.style.fill = '#2a2a2a';
            return;
        }

        var demVotes = county.reportedVotes.D || 0;
        var repVotes = county.reportedVotes.R || 0;

        if (this.isShiftMapMode()) {
            var shiftYear = this.getActiveShiftYear();
            if (county.reportedPct > 0 && this.historicalMargins[shiftYear]) {
                var shift = this.computeCountyShiftForYear(fips, shiftYear);
                path.style.fill = shift === null ? '#2a2a2a' : Utils.getShiftColor(shift);
            } else {
                path.style.fill = '#2a2a2a';
            }
            return;
        }

        var total = demVotes + repVotes;
        if (total > 0) {
            var margin = ((demVotes - repVotes) / total) * 100;
            path.style.fill = Utils.getMarginColor(margin);
        } else {
            path.style.fill = '#2a2a2a';
        }
    },

    updateCountyElectionColors: function() {
        var svg = document.getElementById('county-election-map-svg');
        if (!svg || !gameData.electionCountyViewState) return;
        var stateCode = gameData.electionCountyViewState;
        var paths = svg.querySelectorAll('path');
        for (var i = 0; i < paths.length; i++) {
            var path = paths[i];
            if (path.id && path.id.charAt(0) === 'c') {
                var fips = path.id.substring(1);
                if (Counties.countyData[fips]) {
                    this.colorCountyPath(path, fips, stateCode);
                }
            }
        }
    },

    focusOnStateCounties: function(svg, stateFips, stateCountyPaths) {
        if (stateCountyPaths.length === 0) return;
        var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        for (var j = 0; j < stateCountyPaths.length; j++) {
            try {
                var bb = stateCountyPaths[j].getBBox();
                if (bb.width > 0 && bb.height > 0) {
                    minX = Math.min(minX, bb.x);
                    minY = Math.min(minY, bb.y);
                    maxX = Math.max(maxX, bb.x + bb.width);
                    maxY = Math.max(maxY, bb.y + bb.height);
                }
            } catch(e) {}
        }
        if (minX === Infinity) return;
        var padX = (maxX - minX) * 0.04;
        var padY = (maxY - minY) * 0.04;
        svg.setAttribute('viewBox', (minX - padX) + ' ' + (minY - padY) + ' ' + (maxX - minX + 2 * padX) + ' ' + (maxY - minY + 2 * padY));
    },

    showCountyDetail: function(fips) {
        var county = Counties.countyData[fips];
        if (!county) return;

        var rVotes = county.reportedVotes || { D: 0, R: 0, G: 0, L: 0 };
        var totalVotes = (rVotes.D || 0) + (rVotes.R || 0) + (rVotes.G || 0) + (rVotes.L || 0);
        var reportingPct = county.reportedPct || 0;

        var projStatus = null;
        if (reportingPct >= 100) {
            projStatus = { text: '100% REPORTING — COMPLETE', cssClass: '' };
        } else if (reportingPct > 0) {
            projStatus = { text: Math.floor(reportingPct) + '% REPORTING', cssClass: '' };
        } else {
            projStatus = { text: 'REPORTING SOON', cssClass: '' };
        }

        var html = '<div class="county-detail-panel">';
        html += '<div class="county-detail-header">';
        html += '<h3>' + (county.n || 'County') + '</h3>';
        html += '<button onclick="Election.closeCountyDetail()" class="county-detail-close">✕</button>';
        html += '</div>';
        html += Utils.buildElectionRankedListHTML(rVotes, reportingPct, 0, projStatus);
        html += '<div class="county-detail-meta">';
        html += '<span>Population: ' + (county.p || 0).toLocaleString() + '</span>';
        html += '<span>Type: ' + (county.t || '—') + '</span>';
        html += '</div>';
        html += '</div>';

        var overlay = document.getElementById('county-detail-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'county-detail-overlay';
            overlay.className = 'county-detail-overlay';
            document.getElementById('election-county-view-wrapper').appendChild(overlay);
        }
        overlay.innerHTML = html;
        overlay.classList.remove('hidden');
    },

    closeCountyDetail: function() {
        var overlay = document.getElementById('county-detail-overlay');
        if (overlay) overlay.classList.add('hidden');
    },
};
