/* ============================================
   DECISION 2028 - ELECTION NIGHT
   ============================================ */

// 2024 presidential election results by state (R = Trump won, D = Harris won)
// Trump won all 2016 states + Nevada; Harris held the remaining blue states.
var RESULTS_2024 = {
    AL: 'R', AK: 'R', AZ: 'R', AR: 'R', CA: 'D', CO: 'D', CT: 'D',
    DE: 'D', FL: 'R', GA: 'R', HI: 'D', ID: 'R', IL: 'D', IN: 'R',
    IA: 'R', KS: 'R', KY: 'R', LA: 'R', ME: 'D', MD: 'D', MA: 'D',
    MI: 'R', MN: 'D', MS: 'R', MO: 'R', MT: 'R', NE: 'R', NV: 'R',
    NH: 'D', NJ: 'D', NM: 'D', NY: 'D', NC: 'R', ND: 'R', OH: 'R',
    OK: 'R', OR: 'D', PA: 'R', RI: 'D', SC: 'R', SD: 'R', TN: 'R',
    TX: 'R', UT: 'R', VT: 'D', VA: 'D', WA: 'D', WV: 'R', WI: 'R',
    WY: 'R', DC: 'D'
};

var DEFAULT_EXPECTED_TURNOUT_RATE = 0.56;
// Coalition turnout is stored as a 0-1 rate; multiply by this for display.
var COALITION_BASE_TURNOUT_PCT = 100;
var DEFAULT_INTEREST_GROUP_TURNOUT_RATE = 0.6;
var VICTORY_CLEAR_EV_THRESHOLD = 300;
var VICTORY_LANDSLIDE_EV_THRESHOLD = 350;
var VICTORY_CLEAR_MARGIN_THRESHOLD = 30;
var VICTORY_LANDSLIDE_MARGIN_THRESHOLD = 80;

// Inactive voter turnout constants
var INACTIVE_VOTER_BASE_TURNOUT_RATE = 0.35;  // Registered but inactive voters typically have ~35% turnout
var MAX_INACTIVE_VOTER_TURNOUT = 0.8;         // Cap inactive voter turnout at 80% even with populist boost
var POPULIST_INACTIVE_VOTER_BOOST = 0.15;     // Populist candidates can boost inactive turnout by up to 15%
var BASELINE_INACTIVE_VOTER_BOOST = 0.05;     // Small baseline boost (5%) without populist candidates

// Determine if a candidate is populist/outsider (boosts inactive voter turnout)
// Third-party candidates are typically populist/outsiders as they represent non-mainstream positions
function isPopulistCandidate(candidate) {
    if (!candidate) return false;

    // Look up full candidate profile to check factionId and other attributes
    var fullCand = null;
    if (typeof _buildCandidateByIdMap === 'function') {
        var map = _buildCandidateByIdMap();
        fullCand = map[candidate.id];
    }

    // Third party candidates are typically populist/outsiders
    var party = (fullCand && fullCand.party) || candidate.party;
    if (party && party !== 'D' && party !== 'R') {
        return true;
    }

    // Check for populist/outsider factions
    var faction = fullCand && fullCand.factionId;
    if (faction === 'populist_right' || faction === 'america_first_conservative' || faction === 'outsider_leftist' || faction === 'activist_left') {
        return true;
    }

    if (candidate.ideology === 'populist' || candidate.position === 'outsider') {
        return true;
    }

    return false;
}

// Calculate inactive voter turnout boost based on populist candidates in the race
// Inactive voters (registered but don't regularly vote) are more likely to participate
// when populist or outsider candidates are running
function getInactiveVoterTurnoutBoost(county) {
    if (!county || typeof Counties === 'undefined') {
        return 0;
    }

    var inactiveCount = Counties.getCountyInactiveVoters(county);
    if (inactiveCount <= 0) return 0;

    var activeCount = Counties.getCountyRegisteredVoters(county);
    if (activeCount <= 0) return 0;

    // Calculate proportion of voters who are inactive
    var inactiveRatio = inactiveCount / (activeCount + inactiveCount);

    // Check which candidates in the race are populist
    var hasPopulist = false;
    var activeCandidates = (typeof _buildActiveCandidatesList === 'function')
        ? _buildActiveCandidatesList() : [];

    for (var i = 0; i < activeCandidates.length; i++) {
        if (isPopulistCandidate(activeCandidates[i])) {
            hasPopulist = true;
            break;
        }
    }

    // If there's a populist candidate, inactive voters are more likely to turn out
    // Boost is proportional to the share of inactive voters and presence of populist candidates
    if (hasPopulist) {
        // Boost can be 5-15% (up to 15% × inactive voter ratio) based on inactive voter share
        return inactiveRatio * POPULIST_INACTIVE_VOTER_BOOST;
    }

    // Small baseline boost (up to 5%) even without populist candidate
    return inactiveRatio * BASELINE_INACTIVE_VOTER_BOOST;
}

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
    countyWinners2024: {},

    start: function () {
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
                county.called = false;
                county.calledFor = null;

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

        document.getElementById('elec-dem-name').innerText = gameData.demTicket.pres ? gameData.demTicket.pres.name.toUpperCase() : 'DEMOCRAT';
        document.getElementById('elec-rep-name').innerText = gameData.repTicket.pres ? gameData.repTicket.pres.name.toUpperCase() : 'REPUBLICAN';
        document.getElementById('elec-dem-img').src = gameData.demTicket.pres ? gameData.demTicket.pres.img : 'images/scenario.jpg';
        document.getElementById('elec-rep-img').src = gameData.repTicket.pres ? gameData.repTicket.pres.img : 'images/scenario.jpg';

        var feedContent = document.getElementById('election-feed-content');
        if (feedContent) feedContent.innerHTML = '';
        var raceCallsContent = document.getElementById('race-calls-content');
        if (raceCallsContent) raceCallsContent.innerHTML = '';

        // Load 2024 election data for shift map mode
        this.load2024Data();
        this.loadHistoricalData();
        this.populateAnalysisYearSelect();

        // v2 Bug Fix #2: Apply interest group adjustments before election night
        if (typeof applyInterestGroupAdjustments === 'function') {
            for (var igCode in gameData.states) {
                applyInterestGroupAdjustments(igCode);
            }
        }
        // v2: Apply weather modifier for election week
        if (gameData.weatherModifier && typeof Counties !== 'undefined' && Counties.countyData) {
            for (var wfips in Counties.countyData) {
                var wCounty = Counties.countyData[wfips];
                if (wCounty && wCounty.turnout) {
                    var weatherDelta = (Math.random() - 0.5) * 0.04 * (gameData.weatherModifier || 0);
                    wCounty.turnout.player = Math.max(0.5, (wCounty.turnout.player || 1.0) + weatherDelta);
                }
            }
        }

        this.loadElectionMap();
        this.updateNationalPopularVote();
        this.updateDisplay();
        this.updatePollClosingsNext();

        if (this.interval) clearInterval(this.interval);
        this.interval = setInterval(function () {
            if (!self.paused) {
                self.tick();
            }
        }, 100);
    },

    tick: function () {
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

                if (this.time > 34.0 && county.reportedPct < 100) {
                    county.reportedPct = 100;
                }

                if (county.reportedPct > 0) {
                    if (!county.marginOfError) {
                        county.marginOfError = (Math.random() - 0.5) * 4; // ±2%
                    }

                    var reportingFactor = county.reportedPct / 100;
                    var errorFactor = 1.0 + (county.marginOfError / 100);
                    var undecidedPct = county.undecided || 0;
                    // On Election Day, undecided voters proportionally break for candidates or stay home according to base turnout. 
                    // Multiplying by (100-undecidedPct)/100 incorrectly deletes them from the voting pool entirely.
                    var decidedMultiplier = 1.0;

                    county.reportedVotes = this.calculateCountyReportedVotes(county, reportingFactor, decidedMultiplier, errorFactor);
                }

                if (county.reportedPct > 0 && !county.called) {
                    var countyCall = this.canCallCountyMathematically(county);
                    if (countyCall.canCall) {
                        county.called = true;
                        county.calledFor = countyCall.calledFor;
                    }
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
                // v2: Confidence-based network call system
                var callCheck = this.canCallStateMathematically(code, s);
                var canCall = false;
                var confidence = callCheck.confidence || 0;
                var pctReported = s.reportedPct || 0;

                // Confidence-based thresholds
                if (confidence > 0.04 && pctReported >= 75) {
                    canCall = true;
                } else if (confidence > 0.02 && pctReported >= 90) {
                    canCall = true;
                } else if (pctReported >= 99.9 || callCheck.canCall) {
                    canCall = true;
                }

                // Very close states held until 99%+ reporting
                if (callCheck.margin !== undefined && Math.abs(callCheck.margin) < 0.005 && pctReported < 99) {
                    canCall = false;
                }

                if (canCall) {
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

        if (gameData.electionCountyViewState) {
            this.updateCountyElectionColors();
            if (gameData.electionSelectedCounty) {
                this.showCountyDetail(gameData.electionSelectedCounty);
            } else {
                this.selectState(gameData.electionCountyViewState);
            }
        } else if (gameData.electionSelectedState && gameData.states[gameData.electionSelectedState]) {
            this.selectState(gameData.electionSelectedState);
        }

        // Show winner overlay when someone reaches 270 and ALL votes are counted
        if ((this.demEV >= 270 || this.repEV >= 270) && !this.winnerShown && allCounted) {
            this.showWinner();
        }

        if (this.updateHoveredTooltip) this.updateHoveredTooltip();
    },

    updateDisplay: function () {
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

        // Live-update sidebar views
        if (gameData.electionSelectedState) {
            this.selectState(gameData.electionSelectedState);
        } else {
            this.showNationalSummary();
        }
    },

    getCountyRegisteredVoters: function (county) {
        // Prefer to use Counties function which checks voter roll data first
        if (typeof Counties !== 'undefined' && typeof Counties.getCountyRegisteredVoters === 'function') {
            return Counties.getCountyRegisteredVoters(county);
        }
        // Fallback to direct property
        var reg = county && county.regVoters;
        if (typeof reg === 'number' && isFinite(reg) && reg > 0) {
            return reg;
        }
        var pop = county && county.p ? county.p : 0;
        return Math.max(0, pop);
    },

    getCountyBaseTurnoutRate: function (county) {
        var base = county && county.turnoutBase;
        if (typeof base === 'number' && isFinite(base)) {
            return Math.max(0, Math.min(1, base));
        }
        return this.getDefaultCountyTurnoutRate(county);
    },

    getDefaultCountyTurnoutRate: function (county) {
        if (typeof Counties !== 'undefined' && typeof Counties.DEFAULT_BASE_TURNOUT_RATE === 'number') {
            return Counties.DEFAULT_BASE_TURNOUT_RATE;
        }
        return 0.60;
    },

    getPartyTurnoutBaselineMultipliers: function () {
        var third = (typeof Counties !== 'undefined' && typeof Counties.DEFAULT_THIRD_PARTY_TURNOUT === 'number')
            ? Counties.DEFAULT_THIRD_PARTY_TURNOUT : 0.7;
        return { D: 1, R: 1, G: third, L: third, PSL: third, I: third };
    },

    getCountyPartyTurnoutMultiplier: function (county) {
        if (typeof Counties === 'undefined' || typeof Counties.getPartyTurnoutMultipliers !== 'function') {
            if (county && county.turnout) {
                var playerTurnout = (typeof county.turnout.player === 'number' && isFinite(county.turnout.player)) ? county.turnout.player : 1.0;
                var demOpponentTurnout = (typeof county.turnout.demOpponent === 'number' && isFinite(county.turnout.demOpponent)) ? county.turnout.demOpponent : 1.0;
                var repOpponentTurnout = (typeof county.turnout.repOpponent === 'number' && isFinite(county.turnout.repOpponent)) ? county.turnout.repOpponent : 1.0;
                var thirdPartyTurnout = (typeof county.turnout.thirdParty === 'number' && isFinite(county.turnout.thirdParty)) ? county.turnout.thirdParty : 1.0;
                return Math.max(0.5, Math.min(1.5, Math.max(playerTurnout, demOpponentTurnout, repOpponentTurnout, thirdPartyTurnout)));
            }
            return 1.0;
        }

        var multipliers = Counties.getPartyTurnoutMultipliers(county);
        var baseline = this.getPartyTurnoutBaselineMultipliers();
        var support = { D: 50, R: 50, G: 0, L: 0, PSL: 0, I: 0 };
        if (county && county.v) {
            support = {
                D: county.v.D || 0,
                R: county.v.R || 0,
                G: county.v.G || 0,
                L: county.v.L || 0,
                PSL: county.v.PSL || 0,
                I: county.v.I || 0
            };
        }
        if (typeof Counties.normalizeVoteShareMap === 'function') {
            support = Counties.normalizeVoteShareMap(support);
        }

        var weightedCurrent = 0;
        var weightedBaseline = 0;
        for (var party in support) {
            var share = support[party] || 0;
            weightedCurrent += share * (multipliers[party] || 1);
            weightedBaseline += share * (baseline[party] || 1);
        }
        var ratio = weightedBaseline > 0 ? (weightedCurrent / weightedBaseline) : 1;
        return Math.max(0.5, Math.min(1.5, ratio));
    },

    getCountyInterestGroupTurnoutMultiplier: function (county, partyFilter) {
        if (typeof Counties === 'undefined' || typeof Counties.getCountyDemographicWeights !== 'function') {
            return 1;
        }
        var groupWeights = Counties.getCountyDemographicWeights(county);
        if (!groupWeights || !groupWeights.length) return 1;
        var activeCandidates = (typeof _buildActiveCandidatesList === 'function') ? _buildActiveCandidatesList() : [];
        var candidateById = (typeof _buildCandidateByIdMap === 'function') ? _buildCandidateByIdMap() : {};
        var totalShare = 0;
        var weightedRatio = 0;
        for (var i = 0; i < groupWeights.length; i++) {
            var group = groupWeights[i];
            var groupId = group.id;
            var share = group.share || 0;
            if (share <= 0) continue;
            var baseline = (typeof BASE_TURNOUT_RATES !== 'undefined' && BASE_TURNOUT_RATES[groupId] !== undefined)
                ? BASE_TURNOUT_RATES[groupId]
                : DEFAULT_INTEREST_GROUP_TURNOUT_RATE;
            var current = (gameData.interestGroupTurnout && gameData.interestGroupTurnout[groupId] !== undefined)
                ? gameData.interestGroupTurnout[groupId]
                : baseline;
            var turnoutShift = 0;
            for (var c = 0; c < activeCandidates.length; c++) {
                if (partyFilter && activeCandidates[c].voteKey !== partyFilter) continue;
                var candidate = candidateById[activeCandidates[c].id];
                if (!candidate || typeof _getCandidateGroupEffectValue !== 'function') continue;
                turnoutShift += _getCandidateGroupEffectValue(candidate, groupId, 'turnout');
            }
            current = Math.max(0, Math.min(1, current + (turnoutShift / 100)));
            if (!baseline || !isFinite(baseline)) continue;
            var ratio = current / baseline;
            totalShare += share;
            weightedRatio += share * ratio;
        }
        if (totalShare <= 0) return 1;
        var avgRatio = weightedRatio / totalShare;
        return Math.max(0.5, Math.min(1.5, avgRatio));
    },

    getCountyTurnoutRate: function (county) {
        var baseTurnout = this.getCountyBaseTurnoutRate(county);
        var partyMultiplier = this.getCountyPartyTurnoutMultiplier(county);
        var groupMultiplier = this.getCountyInterestGroupTurnoutMultiplier(county);

        var turnoutRate = baseTurnout * partyMultiplier * groupMultiplier;

        // Add Ground Ops & Digital bonuses
        if (county && county.s) {
            var state = gameData.states[county.s];
            if (typeof GroundOps !== 'undefined') {
                turnoutRate += GroundOps.getPassiveOfficeBonus(county.s);
                turnoutRate += GroundOps.getGOTVLift(county.s);
            }
            if (state && state.digitalTurnoutBonus) {
                turnoutRate += state.digitalTurnoutBonus;
            }
        }

        return Math.max(0, Math.min(1, turnoutRate));
    },

    getCountyTurnoutRateForParty: function (county, partyKey) {
        var baseTurnout = this.getCountyBaseTurnoutRate(county);
        var groupMultiplier = this.getCountyInterestGroupTurnoutMultiplier(county, partyKey);
        var turnoutRate = baseTurnout * groupMultiplier;

        if (typeof Counties !== 'undefined' && typeof Counties.getPartyTurnoutMultipliers === 'function') {
            var multipliers = Counties.getPartyTurnoutMultipliers(county);
            var baseline = this.getPartyTurnoutBaselineMultipliers();
            var target = (multipliers && multipliers[partyKey] !== undefined) ? multipliers[partyKey] : 1;
            var base = (baseline && baseline[partyKey] !== undefined) ? baseline[partyKey] : 1;
            var ratio = base ? (target / base) : target;
            turnoutRate = baseTurnout * ratio * groupMultiplier;
        }

        // Add Ground Ops & Digital bonuses (apply universally to state base turnout)
        if (county && county.s) {
            var state = gameData.states[county.s];
            if (typeof GroundOps !== 'undefined') {
                turnoutRate += GroundOps.getPassiveOfficeBonus(county.s);
                turnoutRate += GroundOps.getGOTVLift(county.s);
            }
            if (state && state.digitalTurnoutBonus) {
                turnoutRate += state.digitalTurnoutBonus;
            }
        }

        return Math.max(0, Math.min(1, turnoutRate));
    },

    getCountyVoterPool: function (county, reportingFactor, decidedMultiplier, errorFactor) {
        // Calculate active voter turnout
        var activeVoters = this.getCountyRegisteredVoters(county);
        var turnoutRate = this.getCountyTurnoutRate(county);
        var activeVotersPool = activeVoters * turnoutRate;

        // Calculate inactive voter contribution (they have lower baseline turnout but boost with populist candidates)
        var inactiveVoters = typeof Counties !== 'undefined' ? Counties.getCountyInactiveVoters(county) : 0;
        var inactiveTurnoutBoost = getInactiveVoterTurnoutBoost(county);
        var inactiveTurnoutWithBoost = Math.min(MAX_INACTIVE_VOTER_TURNOUT, INACTIVE_VOTER_BASE_TURNOUT_RATE + inactiveTurnoutBoost);
        var inactiveVotersPool = inactiveVoters * inactiveTurnoutWithBoost;

        // Total voter pool from both active and inactive voters
        var totalVoters = activeVotersPool + inactiveVotersPool;

        // Apply additional modifiers
        var effectivePool = totalVoters * (decidedMultiplier || 1) * (reportingFactor || 1) * (errorFactor || 1);

        // Cap at total registered voters
        var totalRegistered = activeVoters + inactiveVoters;
        var cap = totalRegistered * Math.max(0, Math.min(1, reportingFactor || 1));
        if (cap > 0) {
            effectivePool = Math.min(effectivePool, cap);
        }
        return Math.max(0, effectivePool);
    },

    calculateCountyReportedVotes: function (county, reportingFactor, decidedMultiplier, errorFactor) {
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

    aggregateCountyVotes: function (stateCode) {
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

        var allCountiesDone = true;
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
                if ((county.reportedPct || 0) < 100) {
                    allCountiesDone = false;
                }
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

        if (allCountiesDone) {
            state.reportedPct = 100;
            state.expectedVotes = totalReportedVotes; // Sync to fix minor rounding errors
        } else if (state.expectedVotes && state.expectedVotes > 0) {
            state.reportedPct = Math.min(100, (totalReportedVotes / state.expectedVotes) * 100);
        } else {
            // State reporting percentage is average of county reporting percentages
            state.reportedPct = countyCount > 0 ? totalReportedPct / countyCount : 0;
        }
    },

    updateNationalPopularVote: function () {
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

    updateNationalPopularVoteDisplay: function () {
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

        rows.sort(function (a, b) { return b.votes - a.votes; });
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

    getVoteLeaderData: function (votes) {
        var sourceVotes = votes || {};
        var parties = ['D', 'R'];
        if (gameData.thirdPartiesEnabled) {
            parties.push('G', 'L', 'PSL', 'I');
        }
        var ordered = [];
        var totalVotes = 0;
        for (var i = 0; i < parties.length; i++) {
            var party = parties[i];
            var count = sourceVotes[party] || 0;
            ordered.push({ party: party, count: count });
            totalVotes += count;
        }
        ordered.sort(function (a, b) { return b.count - a.count; });
        var leader = ordered[0] || { party: 'D', count: 0 };
        var runnerUp = ordered[1] || { party: 'R', count: 0 };
        var marginPct = totalVotes > 0 ? ((leader.count - runnerUp.count) / totalVotes) * 100 : 0;
        return {
            leader: leader.party,
            runnerUp: runnerUp.party,
            marginPct: marginPct,
            totalVotes: totalVotes
        };
    },

    // Determine which party won a state based on reported votes (plurality)
    getStateWinner: function (state) {
        var leaderData = this.getVoteLeaderData(state ? state.reportedVotes : null);
        return leaderData.leader;
    },

    // Award electoral votes to the winning party or split-state allocation
    awardEV: function (state, allocation) {
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
    applyInterestGroupAdjustments: function (county) {
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
    getPartyLabel: function (partyCode) {
        var labels = { D: 'Democrats', R: 'Republicans', G: 'Green Party', L: 'Libertarian Party', PSL: 'Party for Socialism and Liberation', I: 'Independent' };
        return labels[partyCode] || partyCode;
    },

    // Get color for a party code
    getPartyColor: function (partyCode) {
        if (PARTIES[partyCode]) return PARTIES[partyCode].color;
        return '#888888';
    },

    getStateCodeFromFips: function (stateFips) {
        for (var code in STATES) {
            if (STATES[code] && STATES[code].fips === stateFips) return code;
        }
        return null;
    },

    getCountyPollCloseTime: function (fips, stateCode) {
        var paddedFips = (fips ? String(fips) : '').padStart(5, '0');
        if (typeof COUNTY_POLL_CLOSE_OVERRIDES !== 'undefined' && COUNTY_POLL_CLOSE_OVERRIDES[paddedFips] !== undefined) {
            return COUNTY_POLL_CLOSE_OVERRIDES[paddedFips];
        }
        return POLL_CLOSE_TIMES[stateCode] !== undefined ? POLL_CLOSE_TIMES[stateCode] : 20;
    },

    getReportingProfile: function (county) {
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

    buildCountyReportingSchedule: function (county, pollCloseTime, cfips) {
        var profile = county.reportingProfile || this.getReportingProfile(county);

        // Clone profile so we don't modify the shared reference
        var countyProfile = {
            minPct: profile.minPct, maxPct: profile.maxPct,
            minGap: profile.minGap, maxGap: profile.maxGap
        };

        var stateCode = null;
        if (typeof Counties !== 'undefined' && Counties.getStateCodeFromFips) {
            stateCode = Counties.getStateCodeFromFips(cfips.substring(0, 2));
        }
        var cName = (county.n || "").toLowerCase();

        // 1. Multi-Day Postmark States
        var isMultiDay = ['AK', 'CA', 'NV', 'OR', 'UT', 'WA', 'MS'].includes(stateCode);
        // 2. Late-Early Drop Box
        var isLateEarly = ['AZ', 'CO', 'HI'].includes(stateCode);
        // 3. Pre-Processing Delays
        var isPreProcess = ['ME', 'MD', 'MA', 'NJ', 'NY'].includes(stateCode);
        // 4. Central Count Overnight
        var isCentralCount = ['CT', 'IL', 'KS', 'MI', 'MN', 'MT', 'NE', 'NM', 'PA', 'RI', 'VT', 'WI'].includes(stateCode);
        // 5. Same-Night Sprinters
        var isSprinter = ['AL', 'AR', 'DE', 'FL', 'GA', 'ID', 'IN', 'IA', 'KY', 'LA', 'MO', 'NH', 'NC', 'ND', 'OH', 'OK', 'SC', 'SD', 'TN', 'TX', 'VA', 'WV', 'WY'].includes(stateCode);

        // Apply carefully calculated delays ensuring minPct < maxPct always
        if (isMultiDay) {
            countyProfile.minPct = 4; countyProfile.maxPct = 8;
            countyProfile.minGap = 0.6; countyProfile.maxGap = 0.8;

            if (cName.includes('angeles') || cName.includes('orange') || cName.includes('fresno') || cName.includes('clark') || cName.includes('multnomah') || cName.includes('salt lake') || cName.includes('king') || cName.includes('pierce') || cName.includes('hinds') || cName.includes('bethel') || cName.includes('nome')) {
                countyProfile.minPct = 3; countyProfile.maxPct = 5;
                countyProfile.minGap = 0.45; countyProfile.maxGap = 0.65;
            } else if (cName.includes('douglas') || cName.includes('elko') || cName.includes('malheur') || cName.includes('lake') || cName.includes('iron') || cName.includes('washington')) {
                countyProfile.minPct = 10; countyProfile.maxPct = 15;
                countyProfile.minGap = 0.7; countyProfile.maxGap = 1.0;
            }
        } else if (isLateEarly) {
            countyProfile.minPct = 6; countyProfile.maxPct = 10;
            countyProfile.minGap = 0.6; countyProfile.maxGap = 1.0;

            if (cName.includes('maricopa') || cName.includes('pima') || cName.includes('denver') || cName.includes('boulder') || cName.includes('honolulu')) {
                countyProfile.minPct = 4; countyProfile.maxPct = 8;
                countyProfile.minGap = 0.6; countyProfile.maxGap = 0.8;
            } else if (cName.includes('yavapai') || cName.includes('graham') || (stateCode === 'CO' && cName.includes('douglas')) || cName.includes('el paso') || cName.includes('maui') || cName.includes('kauai')) {
                countyProfile.minPct = 15; countyProfile.maxPct = 25;
                countyProfile.minGap = 0.8; countyProfile.maxGap = 1.2;
            }
        } else if (isPreProcess) {
            countyProfile.minPct = 10; countyProfile.maxPct = 15;
            countyProfile.minGap = 0.8; countyProfile.maxGap = 1.2;

            if (cName.includes('portland') || cName.includes('montgomery') || cName.includes('prince george') || cName.includes('boston') || cName.includes('worcester') || cName.includes('essex') || cName.includes('hudson') || cName.includes('queens') || cName.includes('brooklyn') || cName.includes('suffolk') || cName.includes('kings')) {
                countyProfile.minPct = 6; countyProfile.maxPct = 10;
                countyProfile.minGap = 0.6; countyProfile.maxGap = 1.0;
            } else if (cName.includes('washington') || cName.includes('allegany') || cName.includes('ocean') || cName.includes('monmouth')) {
                countyProfile.minPct = 20; countyProfile.maxPct = 30;
                countyProfile.minGap = 0.8; countyProfile.maxGap = 1.2;
            }
        } else if (isCentralCount) {
            countyProfile.minPct = 15; countyProfile.maxPct = 25;
            countyProfile.minGap = 1.0; countyProfile.maxGap = 1.4;

            if (cName.includes('hartford') || cName.includes('cook') || cName.includes('johnson') || cName.includes('wayne') || cName.includes('hennepin') || cName.includes('missoula') || (stateCode === 'NE' && cName.includes('douglas')) || cName.includes('bernalillo') || cName.includes('philadelphia') || cName.includes('bucks') || cName.includes('providence') || cName.includes('chittenden') || cName.includes('milwaukee')) {
                countyProfile.minPct = 30; countyProfile.maxPct = 40;
                countyProfile.minGap = 2.5; countyProfile.maxGap = 3.5;
            } else if (cName.includes('ottawa') || cName.includes('allegheny') || cName.includes('waukesha')) {
                countyProfile.minPct = 30; countyProfile.maxPct = 50;
                countyProfile.minGap = 1.0; countyProfile.maxGap = 1.4;
            }
        } else if (isSprinter) {
            countyProfile.minPct = 35; countyProfile.maxPct = 55;
            countyProfile.minGap = 0.9; countyProfile.maxGap = 1.3;

            if (cName.includes('jefferson') || cName.includes('miami-dade') || cName.includes('fulton') || cName.includes('marion') || cName.includes('wake') || cName.includes('harris') || cName.includes('fairfax') || cName.includes('dallas') || cName.includes('bexar') || cName.includes('pulaski') || cName.includes('new castle') || cName.includes('ada') || cName.includes('lake') || cName.includes('polk') || cName.includes('fayette') || cName.includes('orleans') || cName.includes('east baton rouge') || cName.includes('st. louis') || cName.includes('jackson') || cName.includes('manchester') || cName.includes('nashua') || cName.includes('cass') || cName.includes('cuyahoga') || cName.includes('franklin') || cName.includes('oklahoma') || cName.includes('tulsa') || cName.includes('richland') || cName.includes('charleston') || cName.includes('minnehaha') || cName.includes('shelby') || cName.includes('davidson') || cName.includes('prince william') || cName.includes('kanawha') || cName.includes('laramie')) {
                countyProfile.minPct = 15; countyProfile.maxPct = 25;
                countyProfile.minGap = 0.8; countyProfile.maxGap = 1.2;
            } else if (stateCode === 'FL') {
                countyProfile.minPct = 60; countyProfile.maxPct = 80;
                countyProfile.minGap = 0.8; countyProfile.maxGap = 1.2;
            }
        }

        var schedule = [];
        var totalPct = 0;
        var t = pollCloseTime;

        while (totalPct < 100) {
            var remaining = 100 - totalPct;
            var pct = countyProfile.minPct + Math.random() * (countyProfile.maxPct - countyProfile.minPct);
            if (remaining <= countyProfile.maxPct + 2) {
                pct = remaining;
            } else {
                pct = Math.min(remaining, Math.max(1, pct + (Math.random() * 6 - 3)));
            }
            totalPct += pct;
            t += countyProfile.minGap + Math.random() * (countyProfile.maxGap - countyProfile.minGap);
            schedule.push({ time: t, pct: pct });
        }
        return schedule;
    },

    getCountyExpectedVotes: function (county) {
        if (typeof Counties !== 'undefined' && Counties.getCountyVotesForAllocation) {
            var totals = Counties.getCountyVotesForAllocation(county, false);
            return (totals.D || 0) + (totals.R || 0) + (totals.G || 0) + (totals.L || 0) + (totals.PSL || 0) + (totals.I || 0);
        }
        var reg = this.getCountyRegisteredVoters(county);
        var turnoutRate = this.getCountyTurnoutRate(county);
        return Math.max(0, reg * turnoutRate);
    },

    pulseState: function (stateCode) {
        var path = document.querySelector('#election-map-svg #' + stateCode);
        if (!path) return;
        path.classList.add('state-pulse');
        setTimeout(function () {
            path.classList.remove('state-pulse');
        }, 1600);
    },

    canCallStateMathematically: function (stateCode, state) {
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
        ordered.sort(function (a, b) { return b.count - a.count; });
        var leader = ordered[0];
        var runnerUp = ordered[1] || { party: 'R', count: 0 };

        var expectedVotes = state.expectedVotes || totalReported;
        var remainingVotes = Math.max(0, expectedVotes - totalReported);
        var remainingPct = expectedVotes > 0 ? (remainingVotes / expectedVotes) * 100 : 0;
        var mathematicalLock = leader.count > (runnerUp.count + remainingVotes);

        var margin = expectedVotes > 0 ? (leader.count - runnerUp.count) / expectedVotes : 0;
        var canCall = false;

        if (mathematicalLock) {
            canCall = true;
        } else if (state.reportedPct >= 99.9) {
            canCall = true;
        }

        var allocationResult = null;
        if (typeof Counties !== 'undefined' && Counties.calculateStateElectoralAllocation) {
            allocationResult = Counties.calculateStateElectoralAllocation(stateCode, { useReportedVotes: true });
        }
        var calledFor = allocationResult && allocationResult.calledFor ? allocationResult.calledFor : leader.party;
        var callMessage = this.formatSplitCallMessage(stateCode, calledFor, allocationResult);

        return {
            canCall: canCall,
            calledFor: calledFor,
            allocation: allocationResult ? allocationResult.allocation : null,
            message: callMessage,
            margin: margin,
            confidence: margin // Using margin as a proxy for network projection confidence
        };
    },

    canCallCountyMathematically: function (county) {
        var votes = county && county.reportedVotes ? county.reportedVotes : {};
        var parties = ['D', 'R', 'G', 'L', 'PSL', 'I'];
        var ordered = [];
        var totalReported = 0;
        for (var i = 0; i < parties.length; i++) {
            var p = parties[i];
            var count = votes[p] || 0;
            totalReported += count;
            ordered.push({ party: p, count: count });
        }
        ordered.sort(function (a, b) { return b.count - a.count; });
        var leader = ordered[0] || { party: 'D', count: 0 };
        var runnerUp = ordered[1] || { party: 'R', count: 0 };

        var expectedVotes = county && county.expectedVotes ? county.expectedVotes : totalReported;
        var remainingVotes = Math.max(0, expectedVotes - totalReported);
        var remainingPct = expectedVotes > 0 ? (remainingVotes / expectedVotes) * 100 : 0;
        var mathematicalLock = leader.count > (runnerUp.count + remainingVotes);

        if (!mathematicalLock && county.reportedPct < 99.9) {
            return { canCall: false };
        }
        if (county.reportedPct < 99.9 && remainingPct > 30) {
            return { canCall: false };
        }

        return { canCall: true, calledFor: leader.party };
    },

    getCounty2024Winner: function (fips) {
        var fips5 = String(fips || '').padStart(5, '0');
        if (this.countyWinners2024 && this.countyWinners2024[fips5]) {
            return this.countyWinners2024[fips5] === 'T' ? null : this.countyWinners2024[fips5];
        }
        var margin = this.getHistoricalMargin(2024, fips5);
        if (margin === null || margin === undefined) return null;
        if (margin > 0) return 'D';
        if (margin < 0) return 'R';
        return null;
    },

    formatSplitCallMessage: function (stateCode, calledFor, allocationResult) {
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

    updatePollClosingsNext: function () {
        var container = document.getElementById('polls-closing-next');
        if (!container || !Counties || !Counties.countyData) return;
        var now = this.time;
        var buckets = {};
        var stateCloseTimes = {};

        for (var fips in Counties.countyData) {
            var county = Counties.countyData[fips];
            var closeTime = county.pollCloseTime;
            if (closeTime === undefined || closeTime < now) continue;
            var key = closeTime.toFixed(2);
            var stateCode = county.stateCode;

            if (!stateCloseTimes[stateCode]) stateCloseTimes[stateCode] = {};
            stateCloseTimes[stateCode][key] = true;

            if (!buckets[key]) buckets[key] = { states: {}, count: 0 };
            buckets[key].states[stateCode] = true;
            buckets[key].count += 1;
        }
        var times = Object.keys(buckets).map(function (k) { return parseFloat(k); }).sort(function (a, b) { return a - b; }).slice(0, 3);
        if (!times.length) {
            container.innerHTML = '<div class="next-close-empty">All polls closed</div>';
            return;
        }
        var html = '';
        for (var i = 0; i < times.length; i++) {
            var t = times[i];
            var key = t.toFixed(2);
            var bucket = buckets[key];

            var stateList = [];
            for (var st in bucket.states) {
                var isSplit = Object.keys(stateCloseTimes[st]).length > 1;
                if (isSplit) {
                    stateList.push(st + ' (Split)');
                } else {
                    stateList.push(st);
                }
            }

            html += '<div class="next-close-row" style="display:flex;flex-direction:column;gap:2px;margin-bottom:8px;">';
            html += '<div style="display:flex;justify-content:space-between;"><span>' + Utils.formatTime(t) + ' ET</span><span>' + bucket.count + ' counties</span></div>';
            html += '<div style="font-size: 0.85em; color: #aaa;">' + stateList.join(', ') + '</div>';
            html += '</div>';
        }
        container.innerHTML = html;
    },

    toggleThirdPartyTracker: function () {
        var panel = document.getElementById('third-party-tracker-panel');
        if (!panel) return;
        panel.classList.toggle('hidden');
        if (!panel.classList.contains('hidden')) {
            this.updateThirdPartyTracker();
        }
    },

    updateThirdPartyTracker: function () {
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
        rows.sort(function (a, b) { return b.votes - a.votes; });

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
        stateRows.sort(function (a, b) { return b.share - a.share; });
        for (var si = 0; si < Math.min(8, stateRows.length); si++) {
            var sr = stateRows[si];
            html += '<div class="third-tracker-row"><span>' + sr.code + '</span><span>' + sr.share.toFixed(1) + '% (' + sr.votes.toLocaleString() + ')</span></div>';
        }

        body.innerHTML = html;
    },

    flipPatternPrefix: {
        state: 'state',
        county: 'county'
    },

    injectFlipPatterns: function (svg, scope, options) {
        if (!svg) return;
        var prefix = (this.flipPatternPrefix && this.flipPatternPrefix[scope]) || scope || 'flip';
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
            I: { base: '#9B59B6', dark: '#4d2a5d' },
            PSL: { base: '#CC0000', dark: '#6b0000' }
        };
        var stripeWidth = (options && options.stripeWidth) || 5;
        var tileWidth = (options && options.tileWidth) || 10;
        var tileHeight = (options && options.tileHeight) || 10;
        for (var pCode in flipColors) {
            var fc = flipColors[pCode];
            var patternId = prefix + '-flip-pat-' + pCode;
            if (svg.querySelector('#' + patternId)) continue;
            var pat = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
            pat.setAttribute('id', patternId);
            pat.setAttribute('patternUnits', 'userSpaceOnUse');
            pat.setAttribute('width', tileWidth);
            pat.setAttribute('height', tileHeight);
            pat.setAttribute('patternTransform', 'rotate(45 0 0)');
            var bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            bg.setAttribute('width', tileWidth);
            bg.setAttribute('height', tileHeight);
            bg.setAttribute('fill', fc.base);
            var stripe = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            stripe.setAttribute('width', stripeWidth);
            stripe.setAttribute('height', tileHeight);
            stripe.setAttribute('fill', fc.dark);
            pat.appendChild(bg);
            pat.appendChild(stripe);
            defs.appendChild(pat);
        }
    },

    getFlipPatternFill: function (scope, party) {
        if (!party) return null;
        var prefix = (this.flipPatternPrefix && this.flipPatternPrefix[scope]) || scope || 'flip';
        return 'url(#' + prefix + '-flip-pat-' + party + ')';
    },

    loadElectionMap: function () {
        var self = this;
        var wrapper = document.getElementById('election-map-wrapper');

        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'map.svg', true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var parser = new DOMParser();
                var svgDoc = parser.parseFromString(xhr.responseText, 'image/svg+xml');
                var svg = svgDoc.querySelector('svg');

                if (svg) {
                    svg.id = 'election-map-svg';

                    self.injectFlipPatterns(svg, 'state');

                    var paths = svg.querySelectorAll('path');
                    for (var i = 0; i < paths.length; i++) {
                        var path = paths[i];
                        var code = path.id;
                        if (code && gameData.states[code]) {
                            path.style.cursor = 'pointer';
                            (function (c) {
                                path.onclick = function () { Election.selectState(c); };
                                path.ondblclick = function (e) {
                                    e.stopPropagation();
                                    if (typeof Counties !== 'undefined') {
                                        Election.openCountyView(c);
                                    }
                                };
                                path.onmousemove = function (e) { Election.showMapTooltip(e, c); };
                                path.onmouseleave = function () { Election.hideMapTooltip(); };
                            })(code);
                        }
                    }
                    var titleElements = svg.querySelectorAll('title');
                    for (var j = 0; j < titleElements.length; j++) {
                        if (titleElements[j].parentNode) {
                            titleElements[j].parentNode.removeChild(titleElements[j]);
                        }
                    }

                    svg.onclick = function (e) {
                        if (e.target.tagName !== 'path') {
                            Election.showNationalSummary();
                        }
                    };

                    wrapper.innerHTML = '';
                    wrapper.appendChild(svg);
                    self.colorElectionMap();
                }
            }
        };
        xhr.send();
    },

    colorElectionMap: function () {
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
                    var result2024 = RESULTS_2024[code];
                    var isFlip = result2024 && result2024 !== s.calledFor;
                    path.style.fill = isFlip
                        ? this.getFlipPatternFill('state', s.calledFor)
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

    selectState: function (code) {
        var s = gameData.states[code];
        if (!s) return;
        gameData.electionSelectedState = code;
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
            projStatus = { text: 'POLLS STILL OPEN', cssClass: '' };
        }

        var html = '<div class="elec-state-header">';
        html += '<div style="display: flex; align-items: center; flex-wrap: wrap; gap: 10px;">';
        html += '<h2 style="margin: 0;">' + s.name + '</h2>';

        if (code === 'ME' || code === 'NE') {
            html += '<div class="sp-districts" style="display: flex; gap: 5px; flex-wrap: wrap;">';
            var rule = (typeof SPLIT_ELECTORAL_RULES !== 'undefined') ? SPLIT_ELECTORAL_RULES[code] : null;
            if (rule && typeof Counties !== 'undefined' && Counties.calculateStateElectoralAllocation) {
                var split = Counties.calculateStateElectoralAllocation(code, { useReportedVotes: true });
                if (split && split.districtResults) {
                    var dresList = split.districtResults.slice();
                    dresList.sort(function (a, b) { return a.district.localeCompare(b.district); });

                    for (var r = 0; r < dresList.length; r++) {
                        var dres = dresList[r];
                        var distName = dres.district;
                        var marginColor = '#444';
                        if (typeof Utils !== 'undefined' && Utils.getMarginColor) {
                            var totalDistVotes = 0;
                            for (var p in dres.votes) totalDistVotes += dres.votes[p];
                            var demVotes = dres.votes['D'] || 0;
                            var repVotes = dres.votes['R'] || 0;
                            var marginPct = totalDistVotes > 0 ? ((demVotes - repVotes) / totalDistVotes) * 100 : 0;
                            marginColor = Utils.getMarginColor(marginPct);
                        }

                        html += '<div class="district-box" style="background-color: ' + marginColor + '; cursor: pointer; border: 1px solid #555; padding: 4px 8px; font-size: 0.8rem; border-radius: 3px;" onclick="Election.clickElectionCountyDistrict(\'' + code + '\', \'' + distName + '\')">' + distName + '</div>';
                    }
                }
            }
            html += '</div>';
        }
        html += '</div>';
        html += '<span class="elec-ev-badge">' + s.ev + ' EV</span>';
        html += '</div>';

        if ((code === 'NE' || code === 'ME') && this.stateCallAllocations[code]) {
            var splitAlloc = this.stateCallAllocations[code];
            html += '<div class="elec-reporting">Split EV: D+' + (splitAlloc.D || 0) + ' | R+' + (splitAlloc.R || 0) + ' | 3rd+' +
                ((splitAlloc.G || 0) + (splitAlloc.L || 0) + (splitAlloc.I || 0) + (splitAlloc.PSL || 0)) + '</div>';
        }
        html += '<div class="elec-reporting"><span id="elec-pct-reporting">' + Math.floor(s.reportedPct) + '%</span> Reporting</div>';
        html += Utils.buildElectionRankedListHTML(s.reportedVotes, s.reportedPct, s.ev, projStatus);
        var inCountyView = gameData.electionCountyViewState === code;
        if (!inCountyView) {
            html += '<button class="county-drill-btn" onclick="Election.openCountyView(\'' + code + '\')">VIEW COUNTY RESULTS</button>';
        } else {
            html += '<div class="elec-state-hint">Click any county for its breakdown.</div>';
        }

        container.innerHTML = html;
    },

    showNationalSummary: function () {
        gameData.electionSelectedState = null;
        var container = document.getElementById('election-state-info');
        if (!container) return;
        container.classList.remove('hidden');

        var totalVotes = this.totalReportedVotes || 0;
        var evTotals = [
            { party: 'D', ev: this.demEV },
            { party: 'R', ev: this.repEV }
        ];
        if (gameData.thirdPartiesEnabled) {
            evTotals.push({ party: 'T', ev: this.thirdPartyEV });
        }
        evTotals.sort(function (a, b) { return b.ev - a.ev; });
        var leaderEV = evTotals[0].ev;
        var leaderParty = evTotals[0].party;

        var projStatus = null;
        if (this.winnerShown || leaderEV >= 270) {
            projStatus = { text: '✓ PROJECTED WINNER: ' + this.getPartyLabel(leaderParty).toUpperCase(), cssClass: (leaderParty === 'D' ? 'called-dem' : (leaderParty === 'R' ? 'called-rep' : 'called-third')) };
        } else {
            projStatus = { text: 'NATIONAL POPULAR VOTE — COUNTING', cssClass: '' };
        }

        var html = '<div class="elec-state-header">';
        html += '<h2>United States of America</h2>';
        html += '<span class="elec-ev-badge">538 EV</span>';
        html += '</div>';

        var marginStr = '';
        var dVotes = this.nationalPopularVotes.D || 0;
        var rVotes = this.nationalPopularVotes.R || 0;
        if (totalVotes > 0) {
            var marginPct = Math.abs(dVotes - rVotes) / totalVotes * 100;
            marginStr = (dVotes >= rVotes ? 'D+' : 'R+') + marginPct.toFixed(1);
        }

        html += '<div class="elec-reporting">Total Votes: ' + totalVotes.toLocaleString() + ' | Margin: ' + marginStr + '</div>';
        html += Utils.buildElectionRankedListHTML(this.nationalPopularVotes, 100, 538, projStatus);

        container.innerHTML = html;
    },

    addFeedItem: function (text) {
        var feed = document.getElementById('election-feed-content');
        if (!feed) return;
        var item = document.createElement('div');
        item.className = 'feed-item';
        item.innerHTML = '<span class="feed-time">' + Utils.formatTime(this.time) + '</span><span class="feed-text">' + text + '</span>';
        feed.insertBefore(item, feed.firstChild);
    },

    addRaceCall: function (code, party) {
        var container = document.getElementById('race-calls-content');
        if (!container) return;
        var chip = document.createElement('span');
        var chipClass = party === 'D' ? 'dem' : (party === 'R' ? 'rep' : 'third');
        chip.className = 'race-call-chip ' + chipClass;
        if (party !== 'D' && party !== 'R') {
            chip.style.background = this.getPartyColor(party);
        }
        chip.innerText = code;
        container.appendChild(chip);
    },

    showWinner: function () {
        this.winnerShown = true;
        // Determine winner by plurality of electoral votes
        var evTotals = [
            { party: 'D', ev: this.demEV },
            { party: 'R', ev: this.repEV }
        ];
        if (gameData.thirdPartiesEnabled) {
            evTotals.push({ party: 'T', ev: this.thirdPartyEV });
        }
        evTotals.sort(function (a, b) { return b.ev - a.ev; });
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

    buildVictoryNarrative: function (tickets, winnerEV, loserEV) {
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

    buildCoalitionBreakdownHTML: function () {
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
                turnout: ((gameData.interestGroupTurnout && gameData.interestGroupTurnout[groupId]) || DEFAULT_INTEREST_GROUP_TURNOUT_RATE) * COALITION_BASE_TURNOUT_PCT,
                change: ((gameData.interestGroupChanges && gameData.interestGroupChanges[groupId] && gameData.interestGroupChanges[groupId][gameData.candidate && gameData.candidate.id]) || 0)
            });
        }
        rows.sort(function (a, b) { return b.popPct - a.popPct; });

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

    buildDistrictAnalysisHTML: function () {
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

    buildSpoilerAnalysisHTML: function () {
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

    showFinalResults: function () {
        // Determine winner and runner-up by EV count
        var tickets = [
            { ticket: gameData.demTicket, party: 'D', ev: this.demEV },
            { ticket: gameData.repTicket, party: 'R', ev: this.repEV }
        ];
        if (gameData.thirdPartiesEnabled && this.thirdPartyEV > 0) {
            tickets.push({ ticket: { pres: gameData.candidate, vp: gameData.vp }, party: gameData.selectedParty, ev: this.thirdPartyEV });
        }
        tickets.sort(function (a, b) { return b.ev - a.ev; });

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

    toggleResultsView: function () {
        var finalResults = document.getElementById('final-results-overlay');
        if (finalResults) {
            finalResults.classList.toggle('hidden');
        }
    },

    closeWinnerOverlay: function () {
        document.getElementById('winner-overlay').classList.add('hidden');
    },

    togglePause: function () {
        this.paused = !this.paused;
        document.getElementById('btn-pause').innerText = this.paused ? '▶️' : '⏸️';
    },

    setSpeed: function (speed) {
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

    setMapMode: function (mode) {
        this.mapMode = mode;
        document.getElementById('mode-leader').classList.toggle('active', mode === 'leader');
        document.getElementById('mode-projected').classList.toggle('active', mode === 'projected');
        var shift24Btn = document.getElementById('mode-shift2024');
        if (shift24Btn) shift24Btn.classList.toggle('active', mode === 'shift2024');
        this.colorElectionMap();
        if (gameData.electionCountyViewState) {
            this.updateCountyViewTitle(gameData.electionCountyViewState);
        }
    },

    resetAnalysisUI: function () {
        var screen = document.getElementById('election-screen');
        if (screen) screen.classList.remove('analysis-mode');
        var controls = document.getElementById('analysis-controls');
        if (controls) controls.classList.add('hidden');
        var analysisBtn = document.getElementById('analysis-open-btn');
        if (analysisBtn) analysisBtn.classList.add('hidden');
        var banner = document.querySelector('.election-banner');
        if (banner) banner.innerText = 'ELECTION NIGHT IN AMERICA';
    },

    enterAnalysisMode: function () {
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

    exitAnalysisMode: function () {
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

    setAnalysisYear: function (yearValue) {
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

    skipToEnd: function () {
        // Instantly complete all vote counting at county level
        if (typeof Counties !== 'undefined' && Counties.countyData) {
            for (var fips in Counties.countyData) {
                var county = Counties.countyData[fips];
                county.reportedPct = 100;

                // Calculate final county votes with turnout
                if (county.v) {
                    county.reportedVotes = county.reportedVotes || {};
                    var undecidedPct = county.undecided || 0;
                    // On Election Day, undecided voters proportionally break for candidates or stay home according to base turnout. 
                    // Multiplying by (100-undecidedPct)/100 incorrectly deletes them from the voting pool entirely.
                    var decidedMultiplier = 1.0;

                    if (!county.marginOfError) {
                        county.marginOfError = (Math.random() - 0.5) * 4; // ±2%
                    }
                    var errorFactor = 1.0 + (county.marginOfError / 100);
                    county.reportedVotes = this.calculateCountyReportedVotes(county, 1, decidedMultiplier, errorFactor);
                }
                if (!county.called) {
                    var countyCall = this.canCallCountyMathematically(county);
                    if (countyCall.canCall) {
                        county.called = true;
                        county.calledFor = countyCall.calledFor;
                    }
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

    showMapTooltip: function (e, code, isUpdate) {
        var s = gameData.states[code];
        if (!s) return;
        var tooltip = document.getElementById('map-tooltip');
        if (!tooltip) return;

        if (!isUpdate) {
            this.hoveredTooltip = { type: 'state', code: code, clientX: e.clientX, clientY: e.clientY };
        }

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

        var stateLeaderData = this.getVoteLeaderData(s.reportedVotes);

        var leaderText;
        if (s.reportedPct === 0) {
            leaderText = 'POLLS STILL OPEN';
        } else if (s.called) {
            leaderText = '✓ ' + this.getPartyLabel(s.calledFor) + ' +' + Math.abs(stateLeaderData.marginPct).toFixed(1) + '%';
        } else {
            leaderText = this.getPartyLabel(stateLeaderData.leader) + ' leading +' + Math.abs(stateLeaderData.marginPct).toFixed(1) + '%';
        }

        tooltip.innerHTML = '<strong>' + s.name + '</strong><br>' + leaderText + '<br><span style="color:#888">' + Math.floor(s.reportedPct) + '% reporting</span>';
        tooltip.style.display = 'block';
        tooltip.style.left = (e.clientX + 15) + 'px';
        tooltip.style.top = (e.clientY - 10) + 'px';
    },

    showCountyMapTooltip: function (e, fips, isUpdate) {
        var county = Counties.countyData[fips];
        if (!county) return;
        var tooltip = document.getElementById('map-tooltip');
        if (!tooltip) return;

        if (!isUpdate) {
            this.hoveredTooltip = { type: 'county', code: fips, clientX: e.clientX, clientY: e.clientY };
        }

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

        var countyLeaderData = this.getVoteLeaderData(county.reportedVotes || {});

        var leaderText;
        if (this.mapMode === 'projected') {
            if (county.called) {
                leaderText = '✓ ' + this.getPartyLabel(county.calledFor) + ' +' + Math.abs(countyLeaderData.marginPct).toFixed(1) + '%';
            } else if (!county.reportedPct || county.reportedPct === 0) {
                leaderText = 'Reporting soon…';
            } else if (county.reportedPct >= 100) {
                leaderText = 'Too close to call';
            } else {
                leaderText = Math.floor(county.reportedPct) + '% reporting — counting';
            }
        } else if (!county.reportedPct || county.reportedPct === 0) {
            leaderText = 'Reporting soon…';
        } else {
            leaderText = this.getPartyLabel(countyLeaderData.leader) + ' +' + Math.abs(countyLeaderData.marginPct).toFixed(1) + '%';
        }

        tooltip.innerHTML = '<strong>' + (county.n || 'County') + '</strong><br>' + leaderText + '<br><span style="color:#888">' + Math.floor(county.reportedPct || 0) + '% reporting</span>';
        tooltip.style.display = 'block';
        tooltip.style.left = (e.clientX + 15) + 'px';
        tooltip.style.top = (e.clientY - 10) + 'px';
    },

    hideMapTooltip: function () {
        this.hoveredTooltip = null;
        var tooltip = document.getElementById('map-tooltip');
        if (tooltip) tooltip.style.display = 'none';
    },

    updateHoveredTooltip: function () {
        if (!this.hoveredTooltip) return;
        var ht = this.hoveredTooltip;
        var e = { clientX: ht.clientX, clientY: ht.clientY };
        if (ht.type === 'state') {
            this.showMapTooltip(e, ht.code, true);
        } else if (ht.type === 'county') {
            this.showCountyMapTooltip(e, ht.code, true);
        }
    },

    // ─── Historical shift helpers ───────────────────────────────────────────────

    parseCsvLine: function (line) {
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

    normalizeFipsCode: function (rawFips) {
        var cleaned = (rawFips || '').replace(/"/g, '').trim();
        if (!cleaned) return '';
        var parsed = parseInt(cleaned, 10);
        if (isNaN(parsed)) return '';
        return String(parsed).padStart(5, '0');
    },

    addHistoricalYear: function (year) {
        if (!year) return;
        if (this.historicalYears.indexOf(year) === -1) {
            this.historicalYears.push(year);
            this.historicalYears.sort(function (a, b) { return b - a; });
        }
    },

    populateAnalysisYearSelect: function () {
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

    getActiveShiftYear: function () {
        if (this.mapMode === 'shift2024') return 2024;
        return this.selectedShiftYear || 2024;
    },

    isShiftMapMode: function () {
        return this.mapMode === 'shift2024' || this.mapMode === 'shiftHistorical';
    },

    getHistoricalMargin: function (year, fips) {
        var yearData = this.historicalMargins[year];
        if (!yearData) return null;
        var fips5 = String(fips || '').padStart(5, '0');
        if (!fips5) return null;
        if (yearData[fips5] === undefined) return null;
        return yearData[fips5];
    },

    getCandidateNameForParty: function (party) {
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

    getShiftLabelHtml: function (shift) {
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
    loadHistoricalData: function () {
        if (this.historicalDataLoaded) return;
        var self = this;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'counties/2000-2020-countypres.csv', true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var lines = xhr.responseText.split('\n');
                // Columns: year, state, state_po, county_name, county_fips, office, candidate, party, candidatevotes, totalvotes, version, mode
                var COL_YEAR = 0;
                var COL_FIPS = 4;
                var COL_PARTY = 7;
                var COL_VOTES = 8;
                var COL_TOTAL = 9;
                var PARTY_DEM = 'DEMOCRAT';
                var PARTY_REP = 'REPUBLICAN';
                var yearAggregates = {};
                for (var i = 1; i < lines.length; i++) {
                    var line = lines[i].trim();
                    if (!line) continue;
                    var parts = self.parseCsvLine(line);
                    if (parts.length < 12) continue;
                    var year = parseInt(parts[COL_YEAR], 10);
                    var fips5 = self.normalizeFipsCode(parts[COL_FIPS]);
                    if (!year || !fips5) continue;
                    var party = (parts[COL_PARTY] || '').replace(/"/g, '').trim().toUpperCase();
                    var votes = parseFloat(parts[COL_VOTES]);
                    var totalVotes = parseFloat(parts[COL_TOTAL]);
                    if (!isFinite(votes) || !isFinite(totalVotes) || totalVotes <= 0) continue;
                    // Historical shift compares major-party margins (D vs R) for consistency with simulator results.
                    if (party !== PARTY_DEM && party !== PARTY_REP) continue;

                    if (!yearAggregates[year]) yearAggregates[year] = {};
                    if (!yearAggregates[year][fips5]) {
                        yearAggregates[year][fips5] = { d: 0, r: 0, total: totalVotes };
                    }
                    var rec = yearAggregates[year][fips5];
                    rec.total = totalVotes;
                    if (party === PARTY_DEM) rec.d += votes;
                    if (party === PARTY_REP) rec.r += votes;
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
                        // CSV structure provides one row per party per county-year, aggregated to compute D vs R margin.
                        // Positive margins indicate a Democratic advantage (Dem minus Rep).
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
            } else if (xhr.readyState === 4) {
                console.warn('⚠️ Failed to load historical county results (2000-2020).');
            }
        };
        xhr.send();
    },

    // ─── 2024 Shift helpers ─────────────────────────────────────────────────────

    data2024: {},

    load2024Data: function () {
        var self = this;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'counties/2024_US_County_Level_Presidential_Results.csv', true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                self.data2024 = {};
                self.countyWinners2024 = {};
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
                    var margin = -perPointDiff * 100;
                    self.data2024[fips5] = margin;
                    if (margin > 0) self.countyWinners2024[fips5] = 'D';
                    else if (margin < 0) self.countyWinners2024[fips5] = 'R';
                    else self.countyWinners2024[fips5] = 'T';
                }
                self.historicalMargins[2024] = self.data2024;
                self.addHistoricalYear(2024);
                console.log('✓ 2024 election data loaded: ' + Object.keys(self.data2024).length + ' counties');
                var shift24Btn = document.getElementById('mode-shift2024');
                if (shift24Btn && Object.keys(self.data2024).length > 0 && self.allVotesCounted) {
                    shift24Btn.classList.remove('hidden');
                }
                self.populateAnalysisYearSelect();
                if (gameData.electionCountyViewState) {
                    self.updateCountyElectionColors();
                }
                if (self.analysisMode && self.isShiftMapMode()) {
                    self.colorElectionMap();
                    if (gameData.electionCountyViewState) self.updateCountyElectionColors();
                }
            }
        };
        xhr.send();
    },

    // Compute current-election margin vs 2024 for a county (positive = D shift)
    computeCountyShift: function (fips) {
        return this.computeCountyShiftForYear(fips, 2024);
    },

    // Population-weighted state shift from 2024
    computeStateShift: function (stateCode) {
        return this.computeStateShiftForYear(stateCode, 2024);
    },

    // Compute current-election margin vs selected historical year for a county
    computeCountyShiftForYear: function (fips, year) {
        var fips5 = String(fips || '').padStart(5, '0');
        if (this.allVotesCounted && this.shiftCountyCache[year] && this.shiftCountyCache[year].hasOwnProperty(fips5)) {
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
    computeStateShiftForYear: function (stateCode, year) {
        var stateFips = STATES[stateCode] ? STATES[stateCode].fips : null;
        if (!stateFips || !Counties.countyData) return null;
        if (this.allVotesCounted && this.shiftStateCache[year] && this.shiftStateCache[year].hasOwnProperty(stateCode)) {
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

    openCountyView: function (stateCode) {
        var self = this;
        gameData.electionCountyViewState = stateCode;
        gameData.electionSelectedCounty = null;

        var nationalWrapper = document.getElementById('election-map-wrapper');
        var cvWrapper = document.getElementById('election-county-view-wrapper');
        if (nationalWrapper) nationalWrapper.classList.add('hidden');
        if (cvWrapper) {
            cvWrapper.classList.remove('hidden');
            cvWrapper.onclick = function (ev) {
                var path = ev.target && ev.target.tagName === 'path' ? ev.target : null;
                if (path && path.id && path.id.charAt(0) === 'c') return;
                if (ev.target && (ev.target.closest && ev.target.closest('#election-county-header'))) return;
                Election.showStateDetailFromCountyView(stateCode);
            };
        }

        this.updateCountyViewTitle(stateCode);
        this.loadCountyElectionMap(stateCode);

        // Show the state's overall results in the sidebar by default
        this.selectState(stateCode);
    },

    closeCountyView: function () {
        var lastState = gameData.electionCountyViewState;
        gameData.electionCountyViewState = null;
        gameData.electionSelectedCounty = null;
        var nationalWrapper = document.getElementById('election-map-wrapper');
        var cvWrapper = document.getElementById('election-county-view-wrapper');
        if (cvWrapper) {
            cvWrapper.classList.add('hidden');
            cvWrapper.onclick = null;
        }
        if (nationalWrapper) nationalWrapper.classList.remove('hidden');

        if (this.countyMapUpdateInterval) {
            clearInterval(this.countyMapUpdateInterval);
            this.countyMapUpdateInterval = null;
        }
        this.hideMapTooltip();

        // Restore the previously-viewed state's results in the sidebar
        if (lastState && gameData.states[lastState]) {
            this.selectState(lastState);
        }
    },

    updateCountyViewTitle: function (stateCode) {
        var state = gameData.states[stateCode];
        var titleEl = document.getElementById('election-cv-title');
        if (titleEl) {
            var baseTitle = (state ? state.name.toUpperCase() : stateCode);
            if (this.isShiftMapMode()) {
                var year = this.getActiveShiftYear();
                titleEl.innerText = baseTitle + ' — COUNTY SHIFT VS ' + year;
            } else {
                titleEl.innerText = baseTitle + ' — COUNTY RESULTS';
            }
        }

        var distDiv = document.getElementById('elec-cv-districts');
        if (distDiv) {
            var rule = (typeof SPLIT_ELECTORAL_RULES !== 'undefined') ? SPLIT_ELECTORAL_RULES[stateCode] : null;
            if (rule) {
                var dhtml = '<div class="district-box" style="background: #222; border: 1px solid #555; cursor: pointer; padding: 4px 8px; font-size: 0.8rem; border-radius: 3px;" onclick="Election.clickElectionCountyDistrict(\'' + stateCode + '\', null)">All Counties</div>';
                var distsToShow = [];
                for (var key in rule.splitCounties) {
                    for (var s = 0; s < rule.splitCounties[key].length; s++) {
                        if (distsToShow.indexOf(rule.splitCounties[key][s].district) === -1) {
                            distsToShow.push(rule.splitCounties[key][s].district);
                        }
                    }
                }
                distsToShow.sort();
                for (var d = 0; d < distsToShow.length; d++) {
                    dhtml += '<div class="district-box" style="background: #333; border: 1px solid #666; cursor: pointer; padding: 4px 8px; font-size: 0.8rem; border-radius: 3px;" onclick="Election.clickElectionCountyDistrict(\'' + stateCode + '\', \'' + distsToShow[d] + '\')">' + distsToShow[d] + '</div>';
                }
                distDiv.innerHTML = dhtml;
                distDiv.classList.remove('hidden');
            } else {
                distDiv.classList.add('hidden');
                distDiv.innerHTML = '';
            }
        }
    },

    clickElectionCountyDistrict: function (stateCode, districtName) {
        var svg = document.getElementById('county-election-map-svg');
        if (!svg) return;

        if (!districtName) {
            // Reset to show all
            var paths = svg.querySelectorAll('path');
            for (var i = 0; i < paths.length; i++) {
                paths[i].style.opacity = '1.0';
            }
            return;
        }

        var rule = (typeof SPLIT_ELECTORAL_RULES !== 'undefined') ? SPLIT_ELECTORAL_RULES[stateCode] : null;
        if (!rule) return;

        var countiesInDistrict = [];
        if (typeof Counties !== 'undefined' && Counties.countyData) {
            for (var fips in Counties.countyData) {
                var county = Counties.countyData[fips];
                if (county.s !== stateCode) continue;

                var paddedFips = fips.padStart(5, '0');
                var inDistrict = false;

                if (rule.splitCounties && rule.splitCounties[paddedFips]) {
                    var segments = rule.splitCounties[paddedFips];
                    for (var sIdx = 0; sIdx < segments.length; sIdx++) {
                        if (segments[sIdx].district === districtName) {
                            inDistrict = true;
                            break;
                        }
                    }
                } else {
                    var d = (rule.countyDistrictMap && rule.countyDistrictMap[paddedFips]) || rule.defaultDistrict;
                    if (d === districtName) inDistrict = true;
                }

                if (inDistrict) countiesInDistrict.push(paddedFips);
            }
        }

        var paths = svg.querySelectorAll('path');
        for (var p = 0; p < paths.length; p++) {
            var path = paths[p];
            var pathId = path.id;

            if (pathId && pathId.length >= 3 && pathId.charAt(0) === 'c') {
                var f = pathId.substring(1).padStart(5, '0');
                var isMatch = countiesInDistrict.indexOf(f) !== -1;

                if (isMatch) {
                    path.style.opacity = '1.0';
                } else {
                    path.style.opacity = '0.15';
                }
            }
        }
    },

    loadCountyElectionMap: function (stateCode) {
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
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var parser = new DOMParser();
                var svgDoc = parser.parseFromString(xhr.responseText, 'image/svg+xml');
                var svg = svgDoc.querySelector('svg');

                if (svg) {
                    svg.id = 'county-election-map-svg';
                    svg.style.width = '100%';
                    svg.style.height = '100%';

                    // Smaller pattern tile so stripes are visible at county
                    // zoom levels (uscountymap.svg has a much larger viewBox
                    // than map.svg, so the default 10x10 user-space pattern
                    // becomes a single-pixel speck that browsers may render
                    // as a solid dark fill).
                    self.injectFlipPatterns(svg, 'county', { stripeWidth: 1.2, tileWidth: 2.4, tileHeight: 2.4 });

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

                                (function (f) {
                                    path.onclick = function () { Election.showCountyDetail(f); };
                                    path.onmousemove = function (e) { Election.showCountyMapTooltip(e, f); };
                                    path.onmouseleave = function () { Election.hideMapTooltip(); };
                                })(fips);
                            } else {
                                path.style.display = 'none';
                            }
                        } else {
                            path.style.display = 'none';
                        }
                    }

                    var titleElements = svg.querySelectorAll('title');
                    for (var j = 0; j < titleElements.length; j++) {
                        if (titleElements[j].parentNode) {
                            titleElements[j].parentNode.removeChild(titleElements[j]);
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
                            self.countyMapUpdateInterval = setInterval(function () {
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

    colorCountyPath: function (path, fips, stateCode) {
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

        if (this.mapMode === 'projected') {
            if (!county.called && county.reportedPct > 0) {
                var countyCall = this.canCallCountyMathematically(county);
                if (countyCall.canCall) {
                    county.called = true;
                    county.calledFor = countyCall.calledFor;
                }
            }
            if (county.called) {
                var result2024 = this.getCounty2024Winner(fips);
                var isFlip = result2024 && result2024 !== county.calledFor;
                path.style.fill = isFlip
                    ? this.getFlipPatternFill('county', county.calledFor)
                    : this.getPartyColor(county.calledFor);
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

    updateCountyElectionColors: function () {
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

    focusOnStateCounties: function (svg, stateFips, stateCountyPaths) {
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
            } catch (e) { }
        }
        if (minX === Infinity) return;
        var padX = (maxX - minX) * 0.04;
        var padY = (maxY - minY) * 0.04;
        svg.setAttribute('viewBox', (minX - padX) + ' ' + (minY - padY) + ' ' + (maxX - minX + 2 * padX) + ' ' + (maxY - minY + 2 * padY));
    },

    highlightSelectedCounty: function (fips) {
        var svg = document.getElementById('county-election-map-svg');
        if (!svg) return;
        var prior = svg.querySelectorAll('path.county-selected');
        for (var i = 0; i < prior.length; i++) prior[i].classList.remove('county-selected');
        if (!fips) return;
        var padded = String(fips).padStart(5, '0');
        var sel = svg.querySelector('#c' + padded) || svg.querySelector('#c' + fips);
        if (sel) sel.classList.add('county-selected');
    },

    // Render the county results into the right-side election sidebar
    // (mirrors how the main simulator displays county info in its
    // state panel). Clicking county SVG paths from the election map
    // routes here instead of opening the old corner overlay.
    showCountyDetail: function (fips) {
        var county = Counties && Counties.countyData ? Counties.countyData[fips] : null;
        if (!county) return;

        gameData.electionSelectedCounty = fips;
        this.highlightSelectedCounty(fips);

        var container = document.getElementById('election-state-info');
        if (!container) return;
        container.classList.remove('hidden');

        var rVotes = county.reportedVotes || { D: 0, R: 0, G: 0, L: 0, PSL: 0, I: 0 };
        var reportingPct = county.reportedPct || 0;

        var projStatus = null;
        if (county.called) {
            var calledClass = county.calledFor === 'D' ? 'called-dem' : (county.calledFor === 'R' ? 'called-rep' : 'called-third');
            projStatus = { text: '✓ CALLED FOR ' + this.getPartyLabel(county.calledFor).toUpperCase(), cssClass: calledClass };
        } else if (reportingPct >= 100) {
            projStatus = { text: '100% REPORTING — COMPLETE', cssClass: '' };
        } else if (reportingPct > 0) {
            projStatus = { text: Math.floor(reportingPct) + '% REPORTING', cssClass: '' };
        } else {
            projStatus = { text: 'REPORTING SOON', cssClass: '' };
        }

        var parentStateCode = gameData.electionCountyViewState || (county.stateCode || null);
        var parentStateName = parentStateCode && gameData.states[parentStateCode] ? gameData.states[parentStateCode].name : '';

        var html = '<div class="elec-state-header">';
        html += '<h2>' + (county.n || 'County') + '</h2>';
        html += '<span class="elec-ev-badge">POP ' + (county.p || 0).toLocaleString() + '</span>';
        html += '</div>';
        if (parentStateName) {
            html += '<div class="elec-county-parent">' + parentStateName.toUpperCase() + (county.t ? ' • ' + Utils.getDisplayTier(county.t) : '') + '</div>';
        } else if (county.t) {
            html += '<div class="elec-county-parent">' + Utils.getDisplayTier(county.t) + '</div>';
        }
        html += '<div class="elec-reporting"><span id="elec-pct-reporting">' + Math.floor(reportingPct) + '%</span> Reporting</div>';
        html += Utils.buildElectionRankedListHTML(rVotes, reportingPct, 0, projStatus);
        if (parentStateCode) {
            html += '<button class="county-drill-btn" onclick="Election.showStateDetailFromCountyView(\'' + parentStateCode + '\')">← BACK TO STATE RESULTS</button>';
        }

        container.innerHTML = html;
    },

    // Show the full state results in the sidebar while remaining in
    // the county map view (triggered when the user clicks the map
    // background outside any county path).
    showStateDetailFromCountyView: function (stateCode) {
        if (!stateCode) stateCode = gameData.electionCountyViewState;
        if (!stateCode) return;
        gameData.electionSelectedCounty = null;
        this.highlightSelectedCounty(null);
        this.selectState(stateCode);
    },

    closeCountyDetail: function () {
        gameData.electionSelectedCounty = null;
        this.highlightSelectedCounty(null);
        var overlay = document.getElementById('county-detail-overlay');
        if (overlay) overlay.classList.add('hidden');
    }
};
