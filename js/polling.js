/* ============================================
   DECISION 2028 - REALISTIC POLLING SYSTEM
   ============================================ */

var Polling = {
    // Competitiveness and attention tiers for realistic state polling frequency
    stateTiers: {
        // Tier 1: Core Battlegrounds (Polled constantly by national and state series)
        'PA': 1, 'MI': 1, 'WI': 1, 'GA': 1, 'NC': 1, 'AZ': 1, 'NV': 1,
        // Tier 2: Secondary / Lean Battlegrounds & High-Stakes Reach States
        'FL': 2, 'TX': 2, 'OH': 2, 'VA': 2, 'NH': 2, 'MN': 2, 'NM': 2,
        // Tier 3: Populous & Mid-Tier Safe States (Polled occasionally)
        'CA': 3, 'NY': 3, 'IL': 3, 'NJ': 3, 'WA': 3, 'CO': 3, 'SC': 3, 'TN': 3,
        'IN': 3, 'MO': 3, 'MD': 3, 'CT': 3, 'OR': 3, 'IA': 3, 'KS': 3, 'KY': 3,
        'LA': 3, 'AL': 3, 'OK': 3, 'UT': 3,
        // Tier 4: Small Safe / Deep Red & Deep Blue States (Sparse polling)
        'WY': 4, 'VT': 4, 'ND': 4, 'SD': 4, 'ID': 4, 'WV': 4, 'MS': 4, 'AR': 4,
        'NE': 4, 'ME': 4, 'MT': 4, 'DE': 4, 'RI': 4, 'HI': 4, 'AK': 4, 'DC': 4
    },

    init: function(forceReset) {
        if (!gameData.pollingHistory || forceReset || Object.keys(gameData.pollingHistory).length === 0) {
            gameData.pollingHistory = {};
            gameData.pollingAverages = {};
            gameData.weeklyAverageHistory = {};
            gameData.pollingGeneratedWeeks = [-1, 0];
            this.initBaseline();
        } else {
            // Older saves may contain poll history but no weekly snapshots.
            // Restore all containers so a no-new-poll week still has a chart point.
            gameData.pollingAverages = gameData.pollingAverages || {};
            gameData.weeklyAverageHistory = gameData.weeklyAverageHistory || {};
            gameData.pollingGeneratedWeeks = gameData.pollingGeneratedWeeks || [-1, 0];
            for (var stateCode in STATES) {
                gameData.pollingHistory[stateCode] = gameData.pollingHistory[stateCode] || [];
                gameData.pollingAverages[stateCode] = gameData.pollingAverages[stateCode] || null;
                gameData.weeklyAverageHistory[stateCode] = gameData.weeklyAverageHistory[stateCode] || [];
            }
            gameData.pollingHistory.USA = gameData.pollingHistory.USA || [];
            gameData.pollingAverages.USA = gameData.pollingAverages.USA || null;
            gameData.weeklyAverageHistory.USA = gameData.weeklyAverageHistory.USA || [];
        }
    },
    
    initBaseline: function() {
        // Ensure state fundamentals prior is synced with starting candidate baseline
        if (typeof updateStateFundamentals === 'function') {
            updateStateFundamentals();
        }

        // Initialize history containers
        for (var stateCode in STATES) {
            gameData.pollingHistory[stateCode] = [];
            gameData.pollingAverages[stateCode] = null;
            gameData.weeklyAverageHistory[stateCode] = [];
        }
        gameData.pollingHistory['USA'] = [];
        gameData.pollingAverages['USA'] = null;
        gameData.weeklyAverageHistory['USA'] = [];

        // Keep one pre-campaign snapshot plus the launch-week snapshot. The
        // weekly series is the historical record; it is not regenerated when
        // a later week is opened.
        var preWeeks = [-1, 0];
        gameData.pollingGeneratedWeeks = [-1, 0];
        for (var wi = 0; wi < preWeeks.length; wi++) {
            var simWeek = preWeeks[wi];
            this.generatePollsForWeek(simWeek, false);
            this.calculateAveragesForWeek(simWeek);
        }

        // Fallback generic baseline if any state somehow received zero polls
        for (var sc in STATES) {
            if (!gameData.pollingHistory[sc] || gameData.pollingHistory[sc].length === 0) {
                var trueStatePct = Utils.getTrueStatePollingByParty(sc);
                if (trueStatePct) {
                    gameData.pollingHistory[sc].push({
                        week: 0,
                        date: this._randomDateInWeek(0),
                        pollster: "Baseline Consensus",
                        sampleSize: 800 + Math.floor(Math.random() * 400),
                        poll: trueStatePct,
                        isNational: false
                    });
                }
            }
        }
        if (!gameData.pollingHistory['USA'] || gameData.pollingHistory['USA'].length === 0) {
            var trueNatPct = Utils.getTrueNationalPollingByParty();
            if (trueNatPct) {
                gameData.pollingHistory['USA'].push({
                    week: 0,
                    date: this._randomDateInWeek(0),
                    pollster: "Baseline Consensus",
                    sampleSize: 1500 + Math.floor(Math.random() * 500),
                    poll: trueNatPct,
                    isNational: true
                });
            }
        }
        
        // Finalize Week 0 polling average snapshot
        this.calculateAveragesForWeek(0);
    },
    
    _campaignStartDate: function () {
        var raw = (typeof gameData !== 'undefined') ? gameData.campaignStart : null;
        if (raw instanceof Date && isFinite(raw.getTime())) return new Date(raw.getTime());
        if (typeof raw === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(raw)) {
            var parts = raw.split('-').map(Number);
            return new Date(parts[0], parts[1] - 1, parts[2]);
        }
        var parsed = raw ? new Date(raw) : null;
        return parsed && isFinite(parsed.getTime()) ? parsed : new Date(2028, 6, 4);
    },

    // Returns a random release date string for a given week index. Chart
    // snapshots use _weekStartDate below, never this random release date.
    _randomDateInWeek: function(week) {
        var start = this._campaignStartDate();
        var weekMs = week * 7 * 24 * 60 * 60 * 1000;
        var dayOffset = Math.floor(Math.random() * 6);
        var d = new Date(start.getTime() + weekMs + dayOffset * 24 * 60 * 60 * 1000);
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
    },

    // Every chart snapshot is dated to the first day of its simulation week.
    // Individual survey release dates remain independent and can fall later
    // in the week, which keeps the poll list useful without moving chart dots.
    _weekStartDate: function(week) {
        var start = this._campaignStartDate();
        var d = new Date(start.getTime() + Number(week || 0) * 7 * 24 * 60 * 60 * 1000);
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
    },
    
    generateWeeklyPolls: function() {
        this.init(); // Ensure initialized
        var currentWeek = Number(gameData.currentWeek);
        if (!isFinite(currentWeek)) currentWeek = 0;
        this.ensureWeeklyHistoryThrough(currentWeek, true);
    },

    // Repair a campaign that missed one or more weekly polling calls. This is
    // intentionally idempotent: an already-generated week is never given a
    // second random batch of surveys, and closed snapshots are immutable.
    ensureWeeklyHistoryThrough: function(targetWeek, logCurrentWeek) {
        this.init(); // Also upgrades older campaign state containers.

        var throughWeek = Number(targetWeek);
        if (!isFinite(throughWeek)) throughWeek = 0;
        throughWeek = Math.floor(throughWeek);
        if (throughWeek <= 0) return;

        if (!Array.isArray(gameData.pollingGeneratedWeeks)) gameData.pollingGeneratedWeeks = [-1, 0];
        gameData.pollingGeneratedWeeks = gameData.pollingGeneratedWeeks
            .map(function(week) { return Number(week); })
            .filter(function(week) { return isFinite(week); });

        var targets = Object.keys(STATES).concat(['USA']);
        for (var week = 1; week <= throughWeek; week++) {
            var generated = gameData.pollingGeneratedWeeks.indexOf(week) !== -1;
            if (generated) {
                // Historical weeks are strictly immutable: never regenerate polls or recalculate averages!
                continue;
            }

            for (var ti = 0; ti < targets.length; ti++) {
                var target = targets[ti];
                this.generatePollsForWeek(week, !!logCurrentWeek && week === throughWeek && target === 'USA', target);
            }

            this.calculateAveragesForWeek(week, false);
            gameData.pollingGeneratedWeeks.push(week);
        }

        gameData.pollingGeneratedWeeks.sort(function(a, b) { return a - b; });
    },

    // Return the weekly probability that a national "all states" pollster
    // conducts a survey in a particular state. The preset may provide an
    // explicit state probability in a future data revision; otherwise retain
    // the frequency/tier/closeness model. Explicit values may be written as
    // either 0-1 or 0-100 probabilities.
    getStatePollProbability: function(pollster, stateCode, freq) {
        var explicit = null;
        var maps = [pollster.stateProbabilities, pollster.stateProbability, pollster.stateChances, pollster.probabilities];
        for (var mi = 0; mi < maps.length && explicit === null; mi++) {
            var map = maps[mi];
            if (map && map[stateCode] !== undefined) explicit = Number(map[stateCode]);
        }
        if (explicit !== null && isFinite(explicit)) {
            if (explicit >= 0 && explicit <= 1) explicit *= 100;
            return Math.max(0, Math.min(100, explicit));
        }

        if (typeof PrimaryNative !== 'undefined' && PrimaryNative.active && PrimaryNative.active() && typeof PrimaryCampaign !== 'undefined') {
            var pState = PrimaryCampaign.state();
            var party = (typeof PrimaryNative.getFocusedParty === 'function') ? PrimaryNative.getFocusedParty() : (pState ? pState.playerParty : 'D');
            var contests = PrimaryCampaign.getContests(party) || [];
            var c = contests.find(function(entry) { return entry.state === stateCode; });
            if (c) {
                if (c.status === 'complete') {
                    return Math.max(0, Math.min(100, freq * 0.015));
                }
                var curDate = (typeof gameData !== 'undefined' && gameData.currentDate) ? new Date(gameData.currentDate) : new Date();
                var cDate = new Date(c.date + 'T12:00:00');
                var daysUntil = (cDate - curDate) / (1000 * 60 * 60 * 24);
                if (daysUntil >= 0 && daysUntil <= 14) {
                    return Math.max(0, Math.min(100, freq * 1.8));
                } else if (daysUntil > 14 && daysUntil <= 35) {
                    return Math.max(0, Math.min(100, freq * 1.1));
                } else if (daysUntil > 35 && daysUntil <= 60) {
                    return Math.max(0, Math.min(100, freq * 0.55));
                } else if (daysUntil > 60) {
                    return Math.max(0, Math.min(100, freq * 0.12));
                }
            } else {
                return 0;
            }
        }

        var tier = this.stateTiers[stateCode] || 3;
        var baseTierFactor = 0.025;
        if (tier === 1) baseTierFactor = 0.35;
        else if (tier === 2) baseTierFactor = 0.12;
        else if (tier === 4) baseTierFactor = 0.008;

        // Pollsters concentrate on close races and spend less field capacity
        // on noncompetitive states, while still allowing occasional coverage.
        var sObj = (typeof gameData !== 'undefined' && gameData.states) ? gameData.states[stateCode] : null;
        var curMargin = sObj ? Math.abs(sObj.margin || 0) : Math.abs(STATES[stateCode].lean || 15);
        var closenessMod = 1.0;
        if (curMargin <= 2.5) closenessMod = 2.2;
        else if (curMargin <= 5.0) closenessMod = 1.6;
        else if (curMargin <= 9.0) closenessMod = 1.2;
        else if (curMargin >= 20.0) closenessMod = 0.6;
        return Math.max(0, Math.min(100, freq * baseTierFactor * closenessMod));
    },

    // targetFilter is optional; the repair path uses it to fill only one
    // missing target without duplicating records for the other states.
    generatePollsForWeek: function(targetWeek, shouldLogNational, targetFilter) {
        if (typeof POLLSTERS_DATA === 'undefined' || !POLLSTERS_DATA.pollsterList) return;
        
        for (var i = 0; i < POLLSTERS_DATA.pollsterList.length; i++) {
            var pollster = POLLSTERS_DATA.pollsterList[i];
            var freq = pollster.frequency || 25;
            
            // Check for Internal Pollsters modifying frequency based on ground game
            var isDemInternal = pollster.name.indexOf('(Democratic Internal)') !== -1;
            var isRepInternal = pollster.name.indexOf('(Republican Internal)') !== -1;
            var isPlayerInternal = (isDemInternal && gameData.selectedParty === 'D') || (isRepInternal && gameData.selectedParty === 'R');
            
            if (isPlayerInternal && gameData.groundOps && gameData.groundOps.voterFiles) {
                var avgVf = 0;
                var scCount = 0;
                for (var sc in gameData.groundOps.voterFiles) {
                    avgVf += (gameData.groundOps.voterFiles[sc].quality || 0);
                    scCount++;
                }
                if (scCount > 0) avgVf /= scCount;
                freq += (avgVf * 15);
            }
            
            var pollsToGenerate = [];
            
            for (var j = 0; j < pollster.pollType.length; j++) {
                var pType = pollster.pollType[j];
                
                // National Tracking Polls
                if (pType.id === 'all' || pType.id === 'national') {
                    if ((!targetFilter || targetFilter === 'USA') && Math.random() * 100 < (freq * 0.75)) {
                        pollsToGenerate.push({ target: 'USA', isNational: true });
                    }
                }
                
                // State Polling from National Pollsters
                if (pType.id === 'all') {
                    for (var sCode in STATES) {
                        if (targetFilter && targetFilter !== sCode) continue;
                        var tier = this.stateTiers[sCode] || 3;
                        var stateChance = this.getStatePollProbability(pollster, sCode, freq);
                        if (Math.random() * 100 < stateChance) {
                            pollsToGenerate.push({ target: sCode, isNational: false, tier: tier });
                        }
                    }
                } else if (pType.id === 'specificState') {
                    // State-specific Pollster (e.g. Marquette in WI, Muhlenberg in PA, UNH in NH, etc.)
                    var sCode = pType.state;
                    if (sCode && STATES[sCode] && (!targetFilter || targetFilter === sCode)) {
                        var homeChance = freq * 0.85;
                        if (Math.random() * 100 < homeChance) {
                            var tier = this.stateTiers[sCode] || 2;
                            pollsToGenerate.push({ target: sCode, isNational: false, tier: tier });
                        }
                    }
                }
            }
            
            // Generate polls pulling directly from aggregated state/national truth
            for (var k = 0; k < pollsToGenerate.length; k++) {
                var pollItem = pollsToGenerate[k];
                var target = pollItem.target;
                var isNat = (target === 'USA' || pollItem.isNational);
                var trueData = isNat ? Utils.getTrueNationalPollingByParty() : Utils.getTrueStatePollingByParty(target);
                
                if (!trueData) continue;
                
                // Sample sizes calibrated by tier and national scope
                var sampleSize = 800;
                if (isNat) {
                    var minS = pollster.sampleMin || 1000;
                    var maxS = pollster.sampleMax || 3200;
                    sampleSize = Math.round(minS + Math.random() * (maxS - minS));
                } else {
                    var tier = pollItem.tier || this.stateTiers[target] || 3;
                    if (tier === 1) sampleSize = Math.round(600 + Math.random() * 800);      // 600 - 1400
                    else if (tier === 2) sampleSize = Math.round(500 + Math.random() * 600); // 500 - 1100
                    else sampleSize = Math.round(400 + Math.random() * 400);                 // 400 - 800
                }
                
                // Determine sample type and likely-voter model based on cycle timing and pollster
                // Early weeks (< 8): Predominantly Registered Voters (RV)
                // Late weeks (>= 8): Transition to Likely Voter (LV) screens
                var sampleType = 'LV';
                var lvModelName = 'Turnout History Model';
                var lvMethod = 'past_turnout';

                if (targetWeek < 8) {
                    if (Math.random() < 0.78) {
                        sampleType = 'RV';
                        lvModelName = 'Registered Voters';
                        lvMethod = 'registered_voters';
                    } else {
                        sampleType = 'LV';
                        lvModelName = 'Early LV Screen';
                        lvMethod = 'past_turnout';
                    }
                } else {
                    if (Math.random() < 0.12) {
                        sampleType = 'RV';
                        lvModelName = 'Registered Voters';
                        lvMethod = 'registered_voters';
                    } else {
                        sampleType = 'LV';
                        var pCodeNum = (pollster.name || '').charCodeAt(0) % 3;
                        if (pCodeNum === 0) {
                            lvModelName = 'Turnout History Model';
                            lvMethod = 'past_turnout';
                        } else if (pCodeNum === 1) {
                            lvModelName = 'Enthusiasm Screen';
                            lvMethod = 'enthusiasm';
                        } else {
                            lvModelName = 'Blended Screen';
                            lvMethod = 'hybrid';
                        }
                    }
                }

                var generatedPoll = this.simulatePoll(trueData, pollster, target, isPlayerInternal, targetWeek, sampleType, lvMethod, sampleSize);
                
                if (!gameData.pollingHistory[target]) gameData.pollingHistory[target] = [];
                gameData.pollingHistory[target].push({
                    week: targetWeek,
                    date: this._randomDateInWeek(targetWeek),
                    pollster: pollster.name,
                    sampleSize: sampleSize,
                    sampleType: sampleType,
                    lvModel: lvModelName,
                    poll: generatedPoll,
                    isNational: isNat
                });
                
                if (isNat && shouldLogNational && Math.random() < 0.25) {
                    var dem = generatedPoll.D || 0;
                    var rep = generatedPoll.R || 0;
                    var margin = dem - rep;
                    var leadStr = margin > 0 ? "D+" + margin.toFixed(1) : "R+" + Math.abs(margin).toFixed(1);
                    if (Math.abs(margin) < 0.5) leadStr = "TIE";
                    Utils.addLog("📊 National Poll: " + pollster.name + " (" + sampleType + ") shows " + leadStr);
                }
            }
        }
    },
    
    getPollGroupMargin: function(groupId) {
        var support = gameData.interestGroupSupport && gameData.interestGroupSupport[groupId];
        var dem = gameData.demTicket && gameData.demTicket.pres;
        var rep = gameData.repTicket && gameData.repTicket.pres;
        var demSupport = support && dem && Number(support[dem.id]);
        var repSupport = support && rep && Number(support[rep.id]);
        if (isFinite(demSupport) && isFinite(repSupport) && demSupport + repSupport > 0) {
            return 100 * (demSupport - repSupport) / (demSupport + repSupport);
        }

        var group = typeof INTEREST_GROUPS !== 'undefined' ? INTEREST_GROUPS[groupId] : null;
        var base = group && group.support ? group.support : null;
        var d = base && Number(base.D);
        var r = base && Number(base.R);
        return isFinite(d) && isFinite(r) && d + r > 0 ? 100 * (d - r) / (d + r) : null;
    },

    getPollGroupShares: function(stateCode, groupIds) {
        var totals = {};
        var denominator = 0;
        var counties = (typeof Counties !== 'undefined' && Counties.countyData) ? Counties.countyData : {};
        Object.keys(counties).forEach(function(fips) {
            var county = counties[fips];
            var countyState = county.s || (typeof Counties.getStateCodeFromFips === 'function'
                ? Counties.getStateCodeFromFips(String(fips).padStart(5, '0').substring(0, 2))
                : null);
            if (stateCode !== 'USA' && countyState !== stateCode) return;
            var population = Number(county.regVoters || county.p || 0);
            if (!(population > 0)) return;
            denominator += population;
            groupIds.forEach(function(groupId) {
                var share = 0;
                if (typeof Electorate !== 'undefined' && Electorate.share) {
                    share = Electorate.share(county, groupId);
                } else if (county.ig) {
                    share = (Number(county.ig[groupId]) || 0) / 100;
                }
                if (groupId === 'white' || groupId === 'black' || groupId === 'hispanic' || groupId === 'asian' || groupId === 'native' || groupId === 'pacific' || groupId === 'multiracial' || groupId === 'other_race') {
                    if (typeof Electorate !== 'undefined' && Electorate.rootGroup && county.electorateCells) {
                        share = county.electorateCells.reduce(function(total, cell) {
                            return total + (Electorate.rootGroup(cell.group) === groupId ? Number(cell.weight || 0) : 0);
                        }, 0);
                    }
                }
                totals[groupId] = (totals[groupId] || 0) + population * Math.max(0, Math.min(1, share));
            });
        });
        var shares = {};
        groupIds.forEach(function(groupId) {
            shares[groupId] = denominator > 0 ? (totals[groupId] || 0) / denominator : 0;
        });
        return shares;
    },

    getPollCompositionTilt: function(stateCode, sampleType, method) {
        var self = this;
        var effect = 0;
        function dimensionTilt(groups, factors, residualWeight) {
            var shares = self.getPollGroupShares(stateCode, groups);
            var rows = [];
            var populationTotal = 0;
            var respondentTotal = 0;
            var populationMargin = 0;
            var respondentMargin = 0;
            groups.forEach(function(groupId) {
                var share = shares[groupId] || 0;
                var groupMargin = self.getPollGroupMargin(groupId);
                if (!(share > 0) || groupMargin === null) return;
                var factor = factors[groupId] === undefined ? 1 : factors[groupId];
                if (method === 'enthusiasm' && typeof gameData.interestGroupTurnout === 'object') {
                    var baseline = Number(typeof BASE_TURNOUT_RATES !== 'undefined' && BASE_TURNOUT_RATES[groupId]);
                    var current = Number(gameData.interestGroupTurnout[groupId]);
                    if (baseline > 0 && isFinite(current)) factor *= Math.max(0.82, Math.min(1.18, 1 + ((current / baseline) - 1) * 0.18));
                }
                rows.push({ share: share, factor: factor, margin: groupMargin });
                populationTotal += share;
                respondentTotal += share * factor;
            });
            if (!populationTotal || !respondentTotal) return 0;
            rows.forEach(function(row) {
                populationMargin += (row.share / populationTotal) * row.margin;
                respondentMargin += (row.share * row.factor / respondentTotal) * row.margin;
            });
            return (respondentMargin - populationMargin) * residualWeight;
        }

        // Residual representation errors remain after normal demographic weighting.
        // Propensity differences are deliberately modest and vary slightly by poll.
        var variation = 0.85 + Math.random() * 0.3;
        effect += dimensionTilt(
            ['white', 'black', 'hispanic', 'asian', 'native', 'pacific', 'multiracial', 'other_race'],
            { white: 1.12, black: 0.94, hispanic: 0.94, asian: 0.97, native: 0.92, pacific: 0.94, multiracial: 0.95, other_race: 0.95 },
            0.22 * variation
        );
        effect += dimensionTilt(
            ['college', 'noncollege'],
            { college: 1.12, noncollege: 0.91 },
            0.26 * variation
        );

        var ageFactors;
        if (sampleType === 'RV' || method === 'registered_voters') {
            ageFactors = { youth: 0.94, age25_44: 0.98, age45_64: 1.02, seniors: 1.06 };
        } else if (method === 'past_turnout') {
            ageFactors = { youth: 0.78, age25_44: 0.91, age45_64: 1.06, seniors: 1.15 };
        } else {
            ageFactors = { youth: 0.87, age25_44: 0.96, age45_64: 1.04, seniors: 1.1 };
        }
        effect += dimensionTilt(['youth', 'age25_44', 'age45_64', 'seniors'], ageFactors, 0.2 * variation);
        effect += dimensionTilt(
            ['urban', 'suburban', 'rural'],
            { urban: 1.03, suburban: 1.02, rural: 0.96 },
            0.1 * variation
        );
        return Math.max(-2.5, Math.min(2.5, effect));
    },

    simulatePoll: function(trueData, pollster, stateCode, isPlayerInternal, week, sampleType, lvMethod, sampleSize) {
        var accuracyMod = 1.0;
        if (isPlayerInternal && stateCode !== 'USA' && gameData.groundOps && gameData.groundOps.voterFiles && gameData.groundOps.voterFiles[stateCode]) {
            var vfQuality = gameData.groundOps.voterFiles[stateCode].quality || 0;
            accuracyMod = 1.0 - (vfQuality * 0.4);
        }
        
        var currentWeek = (week !== undefined) ? Number(week) : ((typeof gameData !== 'undefined' && gameData.currentWeek !== undefined) ? Number(gameData.currentWeek) : 0);
        var sType = sampleType || (currentWeek < 8 ? (Math.random() < 0.78 ? 'RV' : 'LV') : (Math.random() < 0.12 ? 'RV' : 'LV'));
        var method = lvMethod || (sType === 'RV' ? 'registered_voters' : 'past_turnout');

        // Pollster house effects are expressed as a signed D-R margin adjustment.
        var biasVal = 0;
        if (pollster.biasMin !== undefined && pollster.biasMax !== undefined) {
            biasVal = (pollster.biasMin + Math.random() * (pollster.biasMax - pollster.biasMin));
        }

        // Sampling error scales with poll size and a modest design effect for online
        // panels, weighting, and clustered phone samples. Larger samples are steadier.
        var n = Math.max(100, Number(sampleSize) || 800);
        var dShare = (Number(trueData && trueData.D) || 0) / 100;
        var rShare = (Number(trueData && trueData.R) || 0) / 100;
        var netShare = dShare - rShare;
        var samplingVariance = Math.max(0.01, dShare + rShare - (netShare * netShare));
        var designEffect = 1.15 + Math.random() * 0.3;
        var samplingSd = 100 * Math.sqrt(samplingVariance * designEffect / n) * accuracyMod;
        var normalDraw = Math.sqrt(-2 * Math.log(Math.max(0.000001, Math.random()))) * Math.cos(2 * Math.PI * Math.random());
        var samplingError = Math.max(-2.5 * samplingSd, Math.min(2.5 * samplingSd, normalDraw * samplingSd));
        var fieldworkSd = Math.min(0.8, Math.max(0.25, Math.abs(Number(pollster.marginMax) || 3) * 0.14));
        var fieldworkError = (Math.random() - 0.5) * 2 * fieldworkSd;
        var marginErrorVal = samplingError + fieldworkError;

        // ─────────────────────────────────────────────────────────────
        // 3. ADDITIONAL SYSTEMIC BIASES (Demographic Nonresponse & LV Modeling)
        // ─────────────────────────────────────────────────────────────
        var houseMarginShift = pollster.biasParty === 'R' ? -biasVal : (pollster.biasParty === 'D' ? biasVal : 0);

        // Response skews are residuals after routine weighting. The composition
        // effect follows local group shares and current group support rather than
        // imposing the same partisan swing on every poll.
        var demographicTilt = !isPlayerInternal ? this.getPollCompositionTilt(stateCode, sType, method) : 0;
        var nonresponseTilt = !isPlayerInternal ? -(0.1 + Math.random() * 0.55) : 0; // small residual R underresponse, not a fixed multi-point shift
        var turnoutScreenTilt = 0;
        if (sType === 'RV') {
            // RV screens include more low-propensity and newly mobilized voters.
            turnoutScreenTilt = 0.15 + Math.random() * 0.35;
        }

        // Historical turnout assumptions can lag campaign movement. Pull a small
        // part of the survey back toward the state's fundamentals, not its last winner.
        var historicalAnchorDamping = 0;
        var stateObj = stateCode !== 'USA' && gameData.states ? gameData.states[stateCode] : null;
        if (stateObj && stateObj.fundamentals && isFinite(Number(stateObj.fundamentals.thetaFundamentals)) && !isPlayerInternal) {
            var benchmarkMargin = (Number(stateObj.fundamentals.thetaFundamentals) - 0.5) * 200;
            var observedMargin = dShare * 100 - rShare * 100;
            historicalAnchorDamping = Math.max(-0.65, Math.min(0.65, (benchmarkMargin - observedMargin) * 0.08));
        }
        var humanModelVariance = (Math.random() - 0.5) * 0.9 * accuracyMod;
        var netMarginShift = houseMarginShift + marginErrorVal + demographicTilt + nonresponseTilt + turnoutScreenTilt + historicalAnchorDamping + humanModelVariance;

        var undecidedTrue = (trueData && trueData.Undecided !== undefined) ? trueData.Undecided : 6.0;
        var isPrimary = typeof PrimaryNative !== 'undefined' && PrimaryNative.active && PrimaryNative.active();

        if (isPrimary) {
            var candKeys = Object.keys(trueData || {}).filter(function(k) { return k !== 'Undecided'; });
            if (candKeys.length === 0 && typeof PrimaryCampaign !== 'undefined') {
                var pState = PrimaryCampaign.state();
                var pParty = (typeof PrimaryNative.getFocusedParty === 'function') ? PrimaryNative.getFocusedParty() : (pState ? pState.playerParty : 'D');
                candKeys = (pState && pState.parties && pState.parties[pParty] && pState.parties[pParty].roster) || [];
            }
            var pUndecidedBase = undecidedTrue + (sType === 'RV' ? (2.0 + Math.random() * 2.5) : (-1.5 + Math.random() * 1.5));
            var pUndecidedSim = Math.max(2.0, Math.min(25.0, pUndecidedBase + (Math.random() - 0.5) * 2.0));
            var pDecidedTarget = Math.max(0, 100 - pUndecidedSim);
            var pPoll = {}, pTotal = 0;
            for (var cki = 0; cki < candKeys.length; cki++) {
                var cId = candKeys[cki];
                var cBase = (trueData && trueData[cId] !== undefined) ? Number(trueData[cId]) : 0;
                var noise = Utils.gaussianNoise(0, Math.max(0.4, samplingSd / Math.sqrt(candKeys.length)));
                pPoll[cId] = Math.max(0.1, cBase + noise);
                pTotal += pPoll[cId];
            }
            var pNormalized = { Undecided: pUndecidedSim };
            for (var cki = 0; cki < candKeys.length; cki++) {
                var cId = candKeys[cki];
                pNormalized[cId] = pTotal > 0 ? (pPoll[cId] / pTotal) * pDecidedTarget : 0;
            }
            return pNormalized;
        }

        var poll = {};
        var totalDecided = 0;
        
        var keys = Object.keys(trueData || {}).filter(function(k) { 
            return k !== 'Undecided' && Utils.isPartyOnBallot(k, stateCode); 
        });
        if (keys.length === 0) keys = ['D', 'R'];

        for (var pi = 0; pi < keys.length; pi++) {
            var party = keys[pi];
            var baseShare = (trueData && trueData[party] !== undefined) ? trueData[party] : (party === 'D' ? 48 : (party === 'R' ? 48 : 2));
            var partyShift = 0;

            if (party === 'D') {
                partyShift = netMarginShift / 2.0;
            } else if (party === 'R') {
                partyShift = -netMarginShift / 2.0;
            } else {
                // Third parties: RV polls capture more third-party curiosity; LV models squeeze them
                var tpMod = (sType === 'RV' ? 0.35 : -0.25);
                partyShift = (Math.random() - 0.5) * 0.8 + tpMod;
            }

            poll[party] = Math.max(0.1, baseShare + partyShift);
            totalDecided += poll[party];
        }
        
        // Undecided: RV polls have higher undecided (+2% to +4%); LV screens force decided choices
        var undecidedBase = undecidedTrue + (sType === 'RV' ? (2.0 + Math.random() * 2.5) : (-1.5 + Math.random() * 1.5));
        var undecidedSimulated = Math.max(2.0, Math.min(25.0, undecidedBase + (Math.random() - 0.5) * 2.0));
        var decidedTarget = Math.max(0, 100 - undecidedSimulated);
        var normalized = { Undecided: undecidedSimulated };
        
        var allParties = ['D', 'R', 'G', 'L', 'I', 'PSL'];
        for (var ap = 0; ap < allParties.length; ap++) {
            var pCode = allParties[ap];
            if (keys.indexOf(pCode) !== -1) {
                normalized[pCode] = totalDecided > 0 ? (poll[pCode] / totalDecided) * decidedTarget : 0;
            } else {
                normalized[pCode] = 0.0;
            }
        }
        return normalized;
    },
    
    // Calculates time-decay weighted polling averages across all historical polls up to current week
    calculateAverages: function() {
        var currentWeek = (typeof gameData !== 'undefined' && gameData.currentWeek !== undefined) ? gameData.currentWeek : 0;
        this.calculateAveragesForWeek(currentWeek);
    },

    calculateAveragesForWeek: function(calcWeek, forceCurrentWeekRefresh) {
        if (!gameData.weeklyAverageHistory) {
            gameData.weeklyAverageHistory = {};
        }
        if (!gameData.pollingAverages) {
            gameData.pollingAverages = {};
        }

        var targets = Object.keys(STATES).concat(['USA']);
        var activeWeek = (typeof gameData !== 'undefined' && gameData.currentWeek !== undefined) ? Number(gameData.currentWeek) : 0;
        if (!isFinite(activeWeek)) activeWeek = 0;
        
        for (var ti = 0; ti < targets.length; ti++) {
            var target = targets[ti];
            var polls = (gameData.pollingHistory && gameData.pollingHistory[target]) ? gameData.pollingHistory[target] : [];
            var targetHistory = gameData.weeklyAverageHistory[target] || [];
            var existingSnapshot = null;
            for (var snapshotIndex = 0; snapshotIndex < targetHistory.length; snapshotIndex++) {
                if (Number(targetHistory[snapshotIndex].week) === Number(calcWeek)) {
                    existingSnapshot = targetHistory[snapshotIndex];
                    break;
                }
            }
            // Once a week has closed, its published average is immutable.
            // Opening the modal or checking history must never rewrite prior dots.
            if (existingSnapshot && existingSnapshot.avg) {
                if (Number(calcWeek) === activeWeek) {
                    gameData.pollingAverages[target] = Object.assign({}, existingSnapshot.avg);
                }
                continue;
            }
            
            // Filter polls conducted on or before calcWeek
            var eligiblePolls = [];
            for (var pi = 0; pi < polls.length; pi++) {
                if (polls[pi].week <= calcWeek) {
                    eligiblePolls.push(polls[pi]);
                }
            }
            
            var trueData = (target === 'USA') ? Utils.getTrueNationalPollingByParty() : Utils.getTrueStatePollingByParty(target);
            if (!trueData) {
                var carried = gameData.pollingAverages[target];
                if (carried) {
                    gameData.weeklyAverageHistory[target] = gameData.weeklyAverageHistory[target] || [];
                    gameData.weeklyAverageHistory[target] = gameData.weeklyAverageHistory[target].filter(function(entry) { return entry.week !== calcWeek; });
                    gameData.weeklyAverageHistory[target].push({ week: calcWeek, date: this._weekStartDate(calcWeek), avg: Object.assign({}, carried), source: 'carry-forward', pollCount: 0 });
                }
                continue;
            }
            
            var isPrimaryMode = typeof PrimaryNative !== 'undefined' && PrimaryNative.active && PrimaryNative.active();
            var activeParties = [];
            var allKeys = [];
            if (isPrimaryMode && typeof PrimaryCampaign !== 'undefined') {
                var pState = PrimaryCampaign.state();
                var pParty = (typeof PrimaryNative.getFocusedParty === 'function') ? PrimaryNative.getFocusedParty() : (pState ? pState.playerParty : 'D');
                var pRoster = (pState && pState.parties && pState.parties[pParty] && pState.parties[pParty].roster) || [];
                activeParties = pRoster.slice();
                allKeys = pRoster.concat(['Undecided']);
            } else {
                activeParties = ['D', 'R'];
                var tpList = ['G', 'L', 'I', 'PSL'];
                for (var tp = 0; tp < tpList.length; tp++) {
                    if (Utils.isPartyOnBallot(tpList[tp], target)) activeParties.push(tpList[tp]);
                }
                allKeys = activeParties.concat(['Undecided']);
            }
            
            var weightedSums = {};
            for (var k = 0; k < allKeys.length; k++) weightedSums[allKeys[k]] = 0;
            var totalWeight = 0;
            
            for (var i = 0; i < eligiblePolls.length; i++) {
                var pObj = eligiblePolls[i];
                var ageWeeks = calcWeek - pObj.week;
                if (ageWeeks > 8) continue; // Discard polls older than 8 weeks from active rolling average
                
                // Exponential time decay: half-life = 2.2 weeks
                var wRecency = Math.exp(-Math.LN2 * (ageWeeks / 2.2));
                // Sample size weight: sqrt(N / 1000)
                var n = pObj.sampleSize || 800;
                var wSample = Math.sqrt(n / 1000);
                
                var weight = wRecency * wSample;
                totalWeight += weight;
                
                for (var k = 0; k < allKeys.length; k++) {
                    var partyKey = allKeys[k];
                    var val = pObj.poll[partyKey] || 0;
                    weightedSums[partyKey] += val * weight;
                }
            }
            
            var weeklyAvg = {};
            var stateObj = (gameData && gameData.states) ? gameData.states[target] : null;
            var maxCampaignWeeks = (typeof FUNDAMENTALS_CONFIG !== 'undefined' && FUNDAMENTALS_CONFIG.CAMPAIGN_LENGTH_WEEKS)
                ? FUNDAMENTALS_CONFIG.CAMPAIGN_LENGTH_WEEKS : 18;
            var fraction = Math.min(1, Math.max(0, calcWeek / maxCampaignWeeks));
            var tauPriorInitial = (stateObj && stateObj.fundamentals && stateObj.fundamentals.tauPrior !== undefined)
                ? stateObj.fundamentals.tauPrior
                : ((typeof FUNDAMENTALS_CONFIG !== 'undefined') ? FUNDAMENTALS_CONFIG.TAU_PRIOR_INITIAL : 8.0);
            var tauPrior = tauPriorInitial * (1 - fraction);
            
            if (stateObj) {
                stateObj.pollWeightTotal = totalWeight;
            }
            
            // Bayesian precision-weighted blend between decaying fundamentals prior and empirical polls
            for (var k = 0; k < allKeys.length; k++) {
                var partyKey = allKeys[k];
                var baseVal = trueData[partyKey] || 0;
                
                // If state fundamentals theta is tracked, use it for major party prior baseline
                if (stateObj && stateObj.fundamentals && stateObj.fundamentals.thetaFundamentals !== undefined) {
                    if (partyKey === 'D') {
                        baseVal = stateObj.fundamentals.thetaFundamentals * 100;
                    } else if (partyKey === 'R') {
                        baseVal = (1 - stateObj.fundamentals.thetaFundamentals) * 100;
                    }
                }
                
                if (tauPrior + totalWeight > 0) {
                    weeklyAvg[partyKey] = (tauPrior * baseVal + weightedSums[partyKey]) / (tauPrior + totalWeight);
                } else {
                    weeklyAvg[partyKey] = baseVal;
                }
            }
            
            // Normalize decided candidates and undecided so total sum is 100%
            var decidedSum = 0;
            for (var p = 0; p < activeParties.length; p++) {
                decidedSum += (weeklyAvg[activeParties[p]] || 0);
            }
            var uPct = Math.max(1.5, Math.min(25, weeklyAvg['Undecided'] || 5.0));
            var targetDecided = Math.max(0, 100 - uPct);
            
            var normalizedAvg = { Undecided: uPct };
            for (var p = 0; p < activeParties.length; p++) {
                var pk = activeParties[p];
                normalizedAvg[pk] = decidedSum > 0 ? (weeklyAvg[pk] / decidedSum) * targetDecided : 0;
            }
            
            // Store current average
            gameData.pollingAverages[target] = normalizedAvg;
            
            // Record in weeklyAverageHistory for timeline rendering
            if (!gameData.weeklyAverageHistory[target]) {
                gameData.weeklyAverageHistory[target] = [];
            }
            
            var existingIdx = -1;
            for (var h = 0; h < gameData.weeklyAverageHistory[target].length; h++) {
                if (gameData.weeklyAverageHistory[target][h].week === calcWeek) {
                    existingIdx = h;
                    break;
                }
            }
            
            // Record every week. If no new poll was conducted, the average is
            // still a valid carried-forward estimate and must remain visible.
            var currentWeekPollCount = eligiblePolls.filter(function(poll) { return poll.week === calcWeek; }).length;
            var priorEntry = existingIdx >= 0 ? gameData.weeklyAverageHistory[target][existingIdx] : null;
            var histEntry = { week: calcWeek, date: this._weekStartDate(calcWeek), avg: Object.assign({}, normalizedAvg), source: currentWeekPollCount ? 'poll-average' : 'carry-forward', pollCount: currentWeekPollCount };
                if (existingIdx >= 0) {
                    gameData.weeklyAverageHistory[target][existingIdx] = histEntry;
                } else {
                    gameData.weeklyAverageHistory[target].push(histEntry);
                }
            gameData.weeklyAverageHistory[target].sort(function(a, b) { return a.week - b.week; });
        }
    },

    // All current-week views use the same published snapshot as the sidebar.
    getPublishedAverage: function(target) {
        if (gameData.frozenPollSnapshot && gameData.frozenPollSnapshot[target]) {
            return gameData.frozenPollSnapshot[target];
        }
        return gameData.pollingAverages && gameData.pollingAverages[target] || null;
    },

    // Generates Top-2 focused neon SVG chart with candidate hover tooltips
    renderPollingChartSVG: function(target) {
        var history = (gameData.weeklyAverageHistory && gameData.weeklyAverageHistory[target])
            ? gameData.weeklyAverageHistory[target].slice()
            : [];

        if (!history || history.length === 0) {
            var polls = (gameData.pollingHistory && gameData.pollingHistory[target]) ? gameData.pollingHistory[target] : [];
            if (!polls || polls.length === 0) {
                var publishedOnly = this.getPublishedAverage(target);
                if (!publishedOnly) return '';
                var publishedWeek = Number(gameData.currentWeek) || 0;
                history = [{ week: publishedWeek, date: this._weekStartDate(publishedWeek), avg: Object.assign({}, publishedOnly) }];
            } else {
                var weekMap = {};
                for (var i = 0; i < polls.length; i++) {
                    var w = polls[i].week;
                    if (!weekMap[w]) weekMap[w] = [];
                    weekMap[w].push(polls[i].poll);
                }
                var weeks = Object.keys(weekMap).map(Number).sort(function(a,b){return a-b;});
                history = [];
                for (var wi = 0; wi < weeks.length; wi++) {
                    var wk = weeks[wi];
                    var plist = weekMap[wk];
                    var avg = {};
                    var keys = Object.keys(plist[0]);
                    for (var k = 0; k < keys.length; k++) {
                        var party = keys[k];
                        var sum = 0;
                        for (var pl = 0; pl < plist.length; pl++) sum += (plist[pl][party] || 0);
                        avg[party] = sum / plist.length;
                    }
                    history.push({ week: wk, date: this._weekStartDate(wk), avg: avg });
                }
            }
        }

        if (!history || history.length === 0) return '';

        // Older saves can contain more than one record for a week. Keep the
        // latest snapshot for each week so the chart has one visible iteration
        // per calendar week and never appears capped or duplicated.
        var historyByWeek = {};
        for (var hi = 0; hi < history.length; hi++) historyByWeek[history[hi].week] = history[hi];
        history = Object.keys(historyByWeek).map(function(week) { return historyByWeek[week]; });

        // Sort history by week ascending
        history.sort(function(a, b) { return a.week - b.week; });
        var currentWeek = Number(gameData.currentWeek) || 0;
        var publishedAverage = this.getPublishedAverage(target);
        if (publishedAverage) {
            var currentIndex = history.findIndex(function(entry) { return Number(entry.week) === currentWeek; });
            var currentPoint = { week: currentWeek, date: this._weekStartDate(currentWeek), avg: Object.assign({}, publishedAverage) };
            if (currentIndex >= 0) history[currentIndex] = currentPoint;
            else history.push(currentPoint);
            history.sort(function(a, b) { return a.week - b.week; });
        }

        // Active ballot parties for this target
        var ballotParties = ['D', 'R'];
        var tpCodes = ['G', 'L', 'I', 'PSL'];
        for (var t = 0; t < tpCodes.length; t++) {
            var tpc = tpCodes[t];
            if (Utils.isPartyOnBallot(tpc, target)) {
                ballotParties.push(tpc);
            }
        }

        var colors = {
            'D': '#00AEF3',
            'R': '#E81B23',
            'G': '#2ecc71',
            'L': '#ff9f43',
            'I': '#a55eea',
            'PSL': '#ff5252',
            'Undecided': '#f1c40f'
        };

        if(typeof PrimaryNative!=='undefined'&&PrimaryNative.active()){
            var focusedP = (typeof PrimaryNative.getFocusedParty === 'function') ? PrimaryNative.getFocusedParty() : (PrimaryCampaign.state() ? PrimaryCampaign.state().playerParty : 'D');
            ballotParties=PrimaryCampaign.roster(focusedP,true).map(function(a){colors[a.id]=a.color;return a.id;});
        }
        // Determine Top 2 parties based on latest week average
        var lastAvg = history[history.length - 1].avg;
        var sortedParties = ballotParties.slice().sort(function(a, b) {
            return (lastAvg[b] || 0) - (lastAvg[a] || 0);
        });
        var top2 = sortedParties.slice(0, 2);

        // Calculate Y-axis bounds focused tightly around Top 2 candidates
        var minTop2 = 100;
        var maxTop2 = 0;
        for (var i = 0; i < history.length; i++) {
            for (var t = 0; t < top2.length; t++) {
                var val = history[i].avg[top2[t]] || 0;
                if (val < minTop2) minTop2 = val;
                if (val > maxTop2) maxTop2 = val;
            }
        }

        var minY = Math.max(0, Math.floor(minTop2 - 4));
        var maxY = Math.min(100, Math.ceil(maxTop2 + 4));
        if (maxY - minY < 10) {
            minY = Math.max(0, minY - 3);
            maxY = Math.min(100, maxY + 3);
        }

        // SVG Canvas dimensions
        var width = 600;
        var height = 185;
        var padding = { top: 20, right: 20, bottom: 28, left: 38 };
        var chartW = width - padding.left - padding.right;
        var chartH = height - padding.top - padding.bottom;

        function getX(index) {
            if (history.length === 1) return padding.left + chartW / 2;
            return padding.left + (index / (history.length - 1)) * chartW;
        }
        function getY(val) {
            var clampedVal = Math.max(minY, Math.min(maxY, val));
            var pct = (clampedVal - minY) / (maxY - minY);
            return padding.top + chartH * (1 - pct);
        }

        var html = '<div style="position: relative; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.12); border-radius: 6px; padding: 12px; margin-bottom: 14px;">';
        
        // Header Legend with Candidate Last Names & Current Polling Average
        html += '<div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center; justify-content: center; margin-bottom: 10px; font-size: 0.82rem; font-weight: bold;">';
        for (var p = 0; p < ballotParties.length; p++) {
            var partyKey = ballotParties[p];
            var pColor = colors[partyKey] || '#888';
            var pVal = (lastAvg[partyKey] || 0).toFixed(1);
            var lastName = Utils.getCandidateLastName(partyKey);
            html += '<div style="display: flex; align-items: center; gap: 5px;">';
            html += '<span style="width: 10px; height: 10px; border-radius: 50%; background:' + pColor + '; box-shadow: 0 0 6px ' + pColor + ';"></span>';
            html += '<span style="color:#fff;">' + lastName + ' (' + partyKey + '): <span style="color:' + pColor + ';">' + pVal + '%</span></span>';
            html += '</div>';
        }
        if (lastAvg['Undecided'] !== undefined) {
            var uVal = (lastAvg['Undecided'] || 0).toFixed(1);
            html += '<div style="display: flex; align-items: center; gap: 5px;">';
            html += '<span style="width: 10px; height: 10px; border-radius: 50%; background:' + colors['Undecided'] + '; box-shadow: 0 0 6px ' + colors['Undecided'] + ';"></span>';
            html += '<span style="color:#fff;">Undecided: <span style="color:' + colors['Undecided'] + ';">' + uVal + '%</span></span>';
            html += '</div>';
        }
        html += '</div>';

        // SVG Canvas
        html += '<svg viewBox="0 0 ' + width + ' ' + height + '" style="width: 100%; height: auto; display: block; overflow: visible;">';
        
        // SVG Defs for Neon Glow
        html += '<defs>';
        var allP = ballotParties.concat(['Undecided']);
        for (var k = 0; k < allP.length; k++) {
            var pk = allP[k];
            var cHex = colors[pk] || '#888';
            html += '<filter id="glow-' + pk + '" x="-20%" y="-20%" width="140%" height="140%">';
            html += '<feDropShadow dx="0" dy="0" stdDeviation="2.5" flood-color="' + cHex + '" flood-opacity="0.85"/>';
            html += '</filter>';
        }
        html += '</defs>';

        // Horizontal Gridlines focused on Top 2 range
        var step = Math.ceil((maxY - minY) / 3);
        if (step < 1) step = 1;
        for (var gVal = minY; gVal <= maxY; gVal += step) {
            var gy = getY(gVal);
            html += '<line x1="' + padding.left + '" y1="' + gy.toFixed(1) + '" x2="' + (width - padding.right) + '" y2="' + gy.toFixed(1) + '" stroke="rgba(255,255,255,0.08)" stroke-dasharray="3,3"/>';
            html += '<text x="' + (padding.left - 5) + '" y="' + (gy + 3).toFixed(1) + '" fill="#777" font-size="9" text-anchor="end">' + gVal + '%</text>';
        }

        // Draw Polylines
        for (var k = 0; k < allP.length; k++) {
            var pk = allP[k];
            var pColor = colors[pk] || '#888';
            var points = [];
            
            for (var i = 0; i < history.length; i++) {
                var x = getX(i);
                var y = getY(history[i].avg[pk] || 0);
                points.push(x.toFixed(1) + ',' + y.toFixed(1));
            }

            if (points.length > 0) {
                html += '<polyline points="' + points.join(' ') + '" stroke="' + pColor + '" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow-' + pk + ')"/>';
            }
        }

        // Render interactive hover circles on data points:
        for (var i = 0; i < history.length; i++) {
            var hRec = history[i];
            var cx = getX(i);

            for (var k = 0; k < allP.length; k++) {
                var pk = allP[k];
                var pColor = colors[pk] || '#888';
                var val = (hRec.avg[pk] || 0).toFixed(1);
                var cy = getY(val);
                
                var candTitle = (pk === 'Undecided') ? 'Undecided' : (Utils.getCandidateLastName(pk) + ' (' + pk + ')');
                var weekDesc = (hRec.week < 0) ? ('Pre-Campaign (Week ' + hRec.week + ')') : ('Week ' + hRec.week);
                var singleDotTooltip = '<b>' + candTitle + ': <span style="color:' + pColor + ';">' + val + '%</span></b><br><span style="color:#aaa; font-size:0.75rem;">' + weekDesc + ' &middot; ' + hRec.date + '</span>';

                html += '<circle cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" r="4.5" fill="' + pColor + '" stroke="#14181f" stroke-width="1.5" tabindex="0" role="img" aria-label="' + candTitle + ', ' + val + ' percent, ' + weekDesc + ', ' + hRec.date + '" style="cursor: pointer;" ' +
                    'onmouseover="Polling.showChartTooltip(event, \'' + escape(singleDotTooltip) + '\')" ' +
                    'onmouseout="Polling.hideChartTooltip()"><title>' + candTitle + ': ' + val + '% · ' + weekDesc + ' · ' + hRec.date + '</title></circle>';
            }
        }

        // X-axis Week Labels. The date is available in each point tooltip and
        // the week number remains visible even when labels are dense.
        for (var i = 0; i < history.length; i++) {
            var x = getX(i);
            var wNum = history[i].week;
            var label = (wNum < 0) ? 'Pre' : ('Week ' + wNum);
            html += '<text x="' + x.toFixed(1) + '" y="' + (height - 6) + '" fill="#888" font-size="8.5" text-anchor="middle">' + label + '</text>';
        }

        html += '</svg>';
        
        // Floating Tooltip element
        html += '<div id="chart-hover-tooltip" style="position: fixed; display: none; background: rgba(15,20,30,0.95); border: 1px solid #555; border-radius: 5px; padding: 6px 10px; font-size: 0.8rem; color: #fff; pointer-events: none; z-index: 10000; box-shadow: 0 4px 15px rgba(0,0,0,0.6); line-height: 1.35;"></div>';
        
        html += '</div>';

        return html;
    },

    showChartTooltip: function(event, escapedHtml) {
        var tt = document.getElementById('chart-hover-tooltip');
        if (!tt) return;
        tt.innerHTML = unescape(escapedHtml);
        tt.style.display = 'block';
        tt.style.left = (event.clientX + 12) + 'px';
        tt.style.top = (event.clientY + 12) + 'px';
    },

    hideChartTooltip: function() {
        var tt = document.getElementById('chart-hover-tooltip');
        if (tt) tt.style.display = 'none';
    },
    
    openPollsModal: function(target) {
        // Debounce protection for rapid pointerdown + click
        var now = Date.now();
        if (this._lastOpenTime && (now - this._lastOpenTime < 250) && this._lastOpenTarget === target) {
            return;
        }
        this._lastOpenTime = now;
        this._lastOpenTarget = target;

        if (!target) target = (typeof gameData !== 'undefined' && (gameData.electionSelectedState || gameData.selectedState)) ? (gameData.electionSelectedState || gameData.selectedState) : 'USA';

        // Opening the history view is also a safe repair point for campaigns
        // created before weekly polling was made idempotent. The modal should
        // never show a launch-week-only chart simply because an earlier weekly
        // subsystem interrupted the normal refresh path.
        var currentWeek = (typeof gameData !== 'undefined' && gameData.currentWeek !== undefined)
            ? Number(gameData.currentWeek) : 0;
        if (typeof this.ensureWeeklyHistoryThrough === 'function' && isFinite(currentWeek) && currentWeek > 0) {
            this.ensureWeeklyHistoryThrough(currentWeek, false);
        }
        
        var modal = document.getElementById('polls-history-modal');
        var title = document.getElementById('polls-history-title');
        var content = document.getElementById('polls-history-content');
        
        if (!modal || !content) {
            console.warn('Polls modal elements not found!');
            return;
        }
        
        var isNational = (target === 'USA');
        var locationName = isNational ? 'NATIONAL' : ((typeof STATES !== 'undefined' && STATES[target]) ? STATES[target].name.toUpperCase() : target.toUpperCase());
        title.innerText = locationName + ' POLLING HISTORY';
        
        // For national view: only show national-flagged polls; for state: show all polls for that state
        var allPolls = (gameData.pollingHistory && gameData.pollingHistory[target]) ? gameData.pollingHistory[target] : [];
        var polls = isNational
            ? allPolls.filter(function(p) { return p.isNational === true || p.isNational === undefined; })
            : allPolls;
        
        var averageHistory = (gameData.weeklyAverageHistory && gameData.weeklyAverageHistory[target]) || [];
        if (polls.length === 0 && averageHistory.length === 0 && !this.getPublishedAverage(target)) {
            content.innerHTML = '<div style="color:#aaa; text-align:center; padding: 20px;">No polling data available yet.</div>';
        } else {
            // Build Top-2 focused trend chart SVG with single-candidate hover dots
            var chartHtml = this.renderPollingChartSVG(target);
            
            // Sort by the displayed release date, newest first. Week is only a
            // deterministic fallback for older records without a date.
            var pollTimestamp = function(poll) {
                var parsed = poll && poll.date ? Date.parse(poll.date) : NaN;
                if (isFinite(parsed)) return parsed;
                return Number(poll && poll.week || 0) * 7 * 24 * 60 * 60 * 1000;
            };
            var sortedPolls = polls.slice().sort(function(a, b) {
                var delta = pollTimestamp(b) - pollTimestamp(a);
                return delta || (Number(b.week || 0) - Number(a.week || 0));
            });
            var currentWeek = (typeof gameData !== 'undefined' && gameData.currentWeek !== undefined) ? Number(gameData.currentWeek) : 0;
            var html = chartHtml;
            var published = this.getPublishedAverage(target);
            var isPrimaryMode = typeof PrimaryNative !== 'undefined' && PrimaryNative.active && PrimaryNative.active();
            if (published) {
                if (isPrimaryMode && typeof PrimaryCampaign !== 'undefined') {
                    var pPubKeys = Object.keys(published).filter(function(k){return k!=='Undecided';}).sort(function(a,b){return (published[b]||0)-(published[a]||0);});
                    var pLeader = pPubKeys[0], pRunner = pPubKeys[1];
                    var pLeaderActor = PrimaryCampaign.actor(pLeader);
                    var pMargin = (published[pLeader] || 0) - (published[pRunner] || 0);
                    var pLeaderName = pLeaderActor ? pLeaderActor.candidate.name : (pLeader || 'Leader');
                    var pMarginLabel = Math.abs(pMargin) < 0.05 ? 'Tied' : (pLeaderName + ' +' + Math.abs(pMargin).toFixed(1));
                    var pSharesHtml = pPubKeys.slice(0, 4).map(function(k){
                        var act = PrimaryCampaign.actor(k);
                        return '<span style="color:' + (act ? act.color : '#fff') + '">' + (act ? act.candidate.name : k) + ' ' + (published[k]||0).toFixed(1) + '%</span>';
                    }).join('') + '<span>Undecided ' + (Number(published.Undecided)||0).toFixed(1) + '%</span>';
                    html = '<div class="polling-published-summary"><div><span class="polling-published-kicker">PUBLISHED WEEK ' + currentWeek + ' AVERAGE</span><strong>' + pMarginLabel + '</strong></div>' +
                        '<div class="polling-published-shares">' + pSharesHtml + '</div></div>' + chartHtml;
                } else {
                    var dShare = Number(published.D) || 0;
                    var rShare = Number(published.R) || 0;
                    var undecidedShare = Number(published.Undecided) || 0;
                    var margin = dShare - rShare;
                    var marginLabel = Math.abs(margin) < 0.05 ? 'Tied' : (margin > 0 ? 'D +' : 'R +') + Math.abs(margin).toFixed(1);
                    html = '<div class="polling-published-summary"><div><span class="polling-published-kicker">PUBLISHED WEEK ' + currentWeek + ' AVERAGE</span><strong>' + marginLabel + ' margin</strong></div>' +
                        '<div class="polling-published-shares"><span>D ' + dShare.toFixed(1) + '%</span><span>R ' + rShare.toFixed(1) + '%</span><span>Undecided ' + undecidedShare.toFixed(1) + '%</span></div></div>' + chartHtml;
                }
            }
            var hasCurrentWeekPoll = polls.some(function(poll) { return Number(poll.week) === currentWeek; });
            var hasCurrentWeekAverage = averageHistory.some(function(entry) { return Number(entry.week) === currentWeek; });
            if (!hasCurrentWeekPoll && hasCurrentWeekAverage) html += '<div style="color:#aaa; text-align:center; padding: 8px 0 14px;">No new survey was conducted this week; the chart shows the carried-forward polling average.</div>';
            
            html += '<p class="polling-chart-note">The current chart point and the sidebar use the same published weekly average. Individual survey cards below may differ from that average and remain sorted by release date.</p>';
            for (var i = 0; i < sortedPolls.length; i++) {
                var p = sortedPolls[i];
                var pollWeek = Number(p.week);
                var pollWeekLabel = pollWeek < 0 ? 'Pre-Campaign' : 'Week ' + pollWeek;
                var dateStr = pollWeekLabel + ' · ' + (p.date ? p.date : this._weekStartDate(pollWeek));
                var sampleStr = p.sampleSize ? 'n=' + p.sampleSize.toLocaleString() : '';
                if (p.sampleType) {
                    sampleStr += ' ' + p.sampleType;
                }
                if (p.lvModel && p.lvModel !== 'Registered Voters') {
                    sampleStr += ' (' + p.lvModel + ')';
                }
                
                // Sort poll candidates by vote share descending (Leader farthest to the left)
                var pollCands = [];
                var pollKeys = Object.keys(p.poll);
                for (var pk = 0; pk < pollKeys.length; pk++) {
                    var k = pollKeys[pk];
                    if (k === 'Undecided') continue;
                    var val = p.poll[k];
                    if (val > 0.05 && (isPrimaryMode || Utils.isPartyOnBallot(k, target))) {
                        pollCands.push({ party: k, pct: val });
                    }
                }
                pollCands.sort(function(a, b) { return b.pct - a.pct; });

                var leaderParty = pollCands.length > 0 ? pollCands[0].party : 'D';
                var leaderColor = '#aaa';
                if (isPrimaryMode && typeof PrimaryCampaign !== 'undefined') {
                    var leadActor = PrimaryCampaign.actor(leaderParty);
                    leaderColor = leadActor ? leadActor.color : '#aaa';
                } else {
                    leaderColor = (typeof PARTIES !== 'undefined' && PARTIES[leaderParty] && PARTIES[leaderParty].color) ? PARTIES[leaderParty].color : '#aaa';
                }

                html += '<div style="background: rgba(0,0,0,0.35); border: 1px solid #444; border-left: 4px solid ' + leaderColor + '; border-radius: 6px; padding: 10px 12px; display: flex; flex-direction: column; gap: 8px; margin-bottom: 8px;">';
                
                // Top row: Pollster name and date/sample
                html += '<div style="display: flex; justify-content: space-between; align-items: baseline;">';
                html +=   '<b style="font-size: 0.95em; color: #fff;">' + p.pollster + '</b>';
                html +=   '<span style="color:#aaa; font-size: 0.78em;">' + dateStr + (sampleStr ? ' &middot; ' + sampleStr : '') + '</span>';
                html += '</div>';

                // Candidate cards row: Candidate pic & names side by side, leader farthest left & highlighted
                html += '<div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">';
                
                for (var cIdx = 0; cIdx < pollCands.length; cIdx++) {
                    var pItem = pollCands[cIdx];
                    var isLeader = (cIdx === 0);
                    var pColor = '#888';
                    var lastName = '';
                    var candObj = null;

                    if (isPrimaryMode && typeof PrimaryCampaign !== 'undefined') {
                        var pActor = PrimaryCampaign.actor(pItem.party);
                        if (pActor) {
                            candObj = pActor.candidate;
                            pColor = pActor.color;
                            lastName = pActor.candidate.name;
                        } else {
                            lastName = pItem.party;
                        }
                    } else {
                        pColor = (typeof PARTIES !== 'undefined' && PARTIES[pItem.party] && PARTIES[pItem.party].color) ? PARTIES[pItem.party].color : '#888';
                        lastName = Utils.getCandidateLastName(pItem.party);
                        if (typeof gameData !== 'undefined') {
                            if (gameData.selectedParty === pItem.party && gameData.candidate) candObj = gameData.candidate;
                            else if (pItem.party === 'D' && gameData.demTicket) candObj = gameData.demTicket.pres;
                            else if (pItem.party === 'R' && gameData.repTicket) candObj = gameData.repTicket.pres;
                            else if (gameData.thirdTickets && gameData.thirdTickets[pItem.party]) candObj = gameData.thirdTickets[pItem.party].pres;
                        }
                    }

                    var imgSrc = (candObj && candObj.img) ? candObj.img : 'images/scenario.jpg';
                    var highlightStyle = isLeader
                        ? 'background: rgba(255,255,255,0.08); border: 1px solid ' + pColor + '; box-shadow: 0 0 12px ' + pColor + '88, 0 0 4px ' + pColor + 'aa;'
                        : 'background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.1);';

                    html += '<div style="display: flex; align-items: center; gap: 6px; padding: 4px 8px; border-radius: 5px; ' + highlightStyle + '">';
                    html += '<img src="' + imgSrc + '" onerror="this.src=\'images/scenario.jpg\'" style="width: 24px; height: 24px; border-radius: 50%; object-fit: cover; border: 1.5px solid ' + pColor + ';">';
                    html += '<span style="color: #fff; font-size: 0.85rem; font-weight: ' + (isLeader ? 'bold' : '600') + ';">' + lastName + ': <span style="color: ' + pColor + ';">' + pItem.pct.toFixed(1) + '%</span></span>';
                    html += '</div>';
                }

                if (p.poll.Undecided !== undefined && p.poll.Undecided > 0) {
                    html += '<div style="color: #888; font-size: 0.82rem; font-weight: 600; margin-left: auto;">Undecided: ' + p.poll.Undecided.toFixed(1) + '%</div>';
                }

                html += '</div>';
                html += '</div>';
            }
            content.innerHTML = html;
        }
        
        modal.classList.remove('hidden');
    },

    computeBlendedEstimate: function(stateOrCode, currentWeek) {
        var stateObj = (typeof stateOrCode === 'string')
            ? ((gameData && gameData.states) ? gameData.states[stateOrCode] : (typeof STATES !== 'undefined' ? STATES[stateOrCode] : null))
            : stateOrCode;
            
        var tauPoll = (stateObj && stateObj.pollWeightTotal !== undefined) ? stateObj.pollWeightTotal : 0;
        var pollAverage = (stateObj && stateObj.pollAverage !== undefined) ? stateObj.pollAverage : 0.5;
        
        var maxWeeks = (typeof FUNDAMENTALS_CONFIG !== 'undefined' && FUNDAMENTALS_CONFIG.CAMPAIGN_LENGTH_WEEKS)
            ? FUNDAMENTALS_CONFIG.CAMPAIGN_LENGTH_WEEKS : 18;
        var fraction = Math.min(1, Math.max(0, (currentWeek !== undefined ? currentWeek : (gameData.currentWeek || 0)) / maxWeeks));
        
        var tauPriorInitial = (stateObj && stateObj.fundamentals && stateObj.fundamentals.tauPrior !== undefined)
            ? stateObj.fundamentals.tauPrior
            : ((typeof FUNDAMENTALS_CONFIG !== 'undefined') ? FUNDAMENTALS_CONFIG.TAU_PRIOR_INITIAL : 8.0);
        var tauPrior = tauPriorInitial * (1 - fraction);
        
        var thetaFundamentals = (stateObj && stateObj.fundamentals && stateObj.fundamentals.thetaFundamentals !== undefined)
            ? stateObj.fundamentals.thetaFundamentals
            : 0.5;
            
        if (tauPrior + tauPoll <= 0) return clamp(thetaFundamentals, 0, 1);
        var blended = (tauPrior * thetaFundamentals + tauPoll * pollAverage) / (tauPrior + tauPoll);
        return clamp(blended, 0, 1);
    }
};
