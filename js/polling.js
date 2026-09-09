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
            this.initBaseline();
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

        // Simulate 5 pre-campaign cycles leading up to Week 0 launch:
        // Weeks: -4, -3, -2, -1, 0 (representing the month preceding July 4, 2028)
        var preWeeks = [-4, -3, -2, -1, 0];
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
    
    // Returns a random date string for a given week index (relative to campaign start: July 4, 2028)
    _randomDateInWeek: function(week) {
        var start = (typeof gameData !== 'undefined' && gameData.campaignStart) 
            ? new Date(gameData.campaignStart) 
            : new Date(2028, 6, 4); // July 4, 2028
        var weekMs = week * 7 * 24 * 60 * 60 * 1000;
        var dayOffset = Math.floor(Math.random() * 6);
        var d = new Date(start.getTime() + weekMs + dayOffset * 24 * 60 * 60 * 1000);
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
    },
    
    generateWeeklyPolls: function() {
        this.init(); // Ensure initialized
        var currentWeek = gameData.currentWeek || 1;
        this.generatePollsForWeek(currentWeek, true);
        this.calculateAveragesForWeek(currentWeek);
    },

    generatePollsForWeek: function(targetWeek, shouldLogNational) {
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
                    if (Math.random() * 100 < (freq * 0.75)) {
                        pollsToGenerate.push({ target: 'USA', isNational: true });
                    }
                }
                
                // State Polling from National Pollsters
                if (pType.id === 'all') {
                    for (var sCode in STATES) {
                        var tier = this.stateTiers[sCode] || 3;
                        var baseTierFactor = 0.025;
                        if (tier === 1) baseTierFactor = 0.35;       // Core Battlegrounds (PA, MI, WI, GA, NC, AZ, NV)
                        else if (tier === 2) baseTierFactor = 0.12;  // Secondary / Lean Battlegrounds (FL, TX, OH, VA, NH, MN, NM)
                        else if (tier === 3) baseTierFactor = 0.025; // Populous Safe States (CA, NY, IL, WA, etc.)
                        else if (tier === 4) baseTierFactor = 0.008; // Small Safe States (WY, VT, ND, ID, etc.)
                        
                        // Closeness modifier: Pollsters surge into competitive races
                        var closenessMod = 1.0;
                        var sObj = (typeof gameData !== 'undefined' && gameData.states) ? gameData.states[sCode] : null;
                        var curMargin = sObj ? Math.abs(sObj.margin || 0) : Math.abs(STATES[sCode].lean || 15);
                        if (curMargin <= 2.5) closenessMod = 2.2;
                        else if (curMargin <= 5.0) closenessMod = 1.6;
                        else if (curMargin <= 9.0) closenessMod = 1.2;
                        else if (curMargin >= 20.0) closenessMod = 0.6;
                        
                        var stateChance = freq * baseTierFactor * closenessMod;
                        if (Math.random() * 100 < stateChance) {
                            pollsToGenerate.push({ target: sCode, isNational: false, tier: tier });
                        }
                    }
                } else if (pType.id === 'specificState') {
                    // State-specific Pollster (e.g. Marquette in WI, Muhlenberg in PA, UNH in NH, etc.)
                    var sCode = pType.state;
                    if (sCode && STATES[sCode]) {
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
                
                var generatedPoll = this.simulatePoll(trueData, pollster, target, isPlayerInternal);
                
                if (!gameData.pollingHistory[target]) gameData.pollingHistory[target] = [];
                gameData.pollingHistory[target].push({
                    week: targetWeek,
                    date: this._randomDateInWeek(targetWeek),
                    pollster: pollster.name,
                    sampleSize: sampleSize,
                    poll: generatedPoll,
                    isNational: isNat
                });
                
                // Maintain up to 60 polls in history per state/national
                if (gameData.pollingHistory[target].length > 60) {
                    gameData.pollingHistory[target].shift();
                }
                
                if (isNat && shouldLogNational && Math.random() < 0.25) {
                    var dem = generatedPoll.D || 0;
                    var rep = generatedPoll.R || 0;
                    var margin = dem - rep;
                    var leadStr = margin > 0 ? "D+" + margin.toFixed(1) : "R+" + Math.abs(margin).toFixed(1);
                    if (Math.abs(margin) < 0.5) leadStr = "TIE";
                    Utils.addLog("📊 National Poll: " + pollster.name + " shows " + leadStr);
                }
            }
        }
    },
    
    simulatePoll: function(trueData, pollster, stateCode, isPlayerInternal) {
        var accuracyMod = 1.0;
        if (isPlayerInternal && stateCode !== 'USA' && gameData.groundOps && gameData.groundOps.voterFiles && gameData.groundOps.voterFiles[stateCode]) {
            var vfQuality = gameData.groundOps.voterFiles[stateCode].quality || 0;
            accuracyMod = 1.0 - (vfQuality * 0.4);
        }
        
        // 1. Draw a single random BIAS value within [biasMin, biasMax] towards biasParty for this poll instance
        var biasVal = 0;
        if (pollster.biasMin !== undefined && pollster.biasMax !== undefined) {
            biasVal = (pollster.biasMin + Math.random() * (pollster.biasMax - pollster.biasMin));
        }
        
        // 2. Draw a single random MARGIN ERROR value within [marginMin, marginMax] for this poll instance
        var mMin = (pollster.marginMin !== undefined ? pollster.marginMin : -3) * accuracyMod;
        var mMax = (pollster.marginMax !== undefined ? pollster.marginMax : 3) * accuracyMod;
        var marginErrorVal = mMin + Math.random() * (mMax - mMin);
        
        // Net lead shift towards bias party & error (percentage points)
        var netMarginShift = biasVal + marginErrorVal;
        
        var undecidedTrue = (trueData && trueData.Undecided !== undefined) ? trueData.Undecided : 6.0;
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

            if (party === pollster.biasParty) {
                partyShift = netMarginShift / 2.0;
            } else if (party === (pollster.biasParty === 'D' ? 'R' : 'D')) {
                partyShift = -netMarginShift / 2.0;
            } else {
                partyShift = (Math.random() - 0.5) * 0.8;
            }

            poll[party] = Math.max(0, baseShare + partyShift);
            totalDecided += poll[party];
        }
        
        // Undecided: ±1.2% realistic sampling noise
        var undecidedSimulated = Math.max(2.0, Math.min(25.0, undecidedTrue + (Math.random() - 0.5) * 2.4));
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

    calculateAveragesForWeek: function(calcWeek) {
        if (!gameData.weeklyAverageHistory) {
            gameData.weeklyAverageHistory = {};
        }
        if (!gameData.pollingAverages) {
            gameData.pollingAverages = {};
        }

        var targets = Object.keys(STATES).concat(['USA']);
        
        for (var ti = 0; ti < targets.length; ti++) {
            var target = targets[ti];
            var polls = (gameData.pollingHistory && gameData.pollingHistory[target]) ? gameData.pollingHistory[target] : [];
            
            // Filter polls conducted on or before calcWeek
            var eligiblePolls = [];
            for (var pi = 0; pi < polls.length; pi++) {
                if (polls[pi].week <= calcWeek) {
                    eligiblePolls.push(polls[pi]);
                }
            }
            
            var trueData = (target === 'USA') ? Utils.getTrueNationalPollingByParty() : Utils.getTrueStatePollingByParty(target);
            if (!trueData) continue;
            
            // Active ballot parties for this target
            var activeParties = ['D', 'R'];
            var tpList = ['G', 'L', 'I', 'PSL'];
            for (var tp = 0; tp < tpList.length; tp++) {
                if (Utils.isPartyOnBallot(tpList[tp], target)) activeParties.push(tpList[tp]);
            }
            var allKeys = activeParties.concat(['Undecided']);
            
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
            
            // Always record the current average to prevent graphs skipping weeks or freezing mid-turn
            var hasCurrentWeekPolls = true;
            
            if (hasCurrentWeekPolls || calcWeek === 0) {
                var histEntry = { week: calcWeek, date: this._randomDateInWeek(calcWeek), avg: Object.assign({}, normalizedAvg) };
                if (existingIdx >= 0) {
                    gameData.weeklyAverageHistory[target][existingIdx] = histEntry;
                } else {
                    gameData.weeklyAverageHistory[target].push(histEntry);
                }
            }
        }
    },

    // Generates Top-2 focused neon SVG chart with candidate hover tooltips
    renderPollingChartSVG: function(target) {
        var history = (gameData.weeklyAverageHistory && gameData.weeklyAverageHistory[target])
            ? gameData.weeklyAverageHistory[target].slice()
            : [];

        if (!history || history.length === 0) {
            var polls = (gameData.pollingHistory && gameData.pollingHistory[target]) ? gameData.pollingHistory[target] : [];
            if (!polls || polls.length === 0) return '';
            
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
                history.push({ week: wk, date: this._randomDateInWeek(wk), avg: avg });
            }
        }

        if (!history || history.length === 0) return '';

        // Sort history by week ascending
        history.sort(function(a, b) { return a.week - b.week; });

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
                var weekDesc = (hRec.week < 0) ? ('Pre-Campaign (W' + hRec.week + ')') : (hRec.week === 0 ? 'Launch Week (W0)' : ('Week ' + hRec.week));
                var singleDotTooltip = '<b>' + candTitle + ': <span style="color:' + pColor + ';">' + val + '%</span></b><br><span style="color:#aaa; font-size:0.75rem;">' + weekDesc + ' &middot; ' + hRec.date + '</span>';

                html += '<circle cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" r="4.5" fill="' + pColor + '" stroke="#14181f" stroke-width="1.5" style="cursor: pointer;" ' +
                    'onmouseover="Polling.showChartTooltip(event, \'' + escape(singleDotTooltip) + '\')" ' +
                    'onmouseout="Polling.hideChartTooltip()"></circle>';
            }
        }

        // X-axis Week Labels (shows Pre-4 ... Pre-1, W0, W1, W2...)
        for (var i = 0; i < history.length; i++) {
            var x = getX(i);
            var wNum = history[i].week;
            var label = (wNum < 0) ? ('Pre ' + Math.abs(wNum)) : ('W' + wNum);
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
        if (!target) target = (typeof gameData !== 'undefined' && gameData.selectedState) ? gameData.selectedState : 'USA';
        
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
        
        if (polls.length === 0) {
            content.innerHTML = '<div style="color:#aaa; text-align:center; padding: 20px;">No polling data available yet.</div>';
        } else {
            // Build Top-2 focused trend chart SVG with single-candidate hover dots
            var chartHtml = this.renderPollingChartSVG(target);
            
            // Sort polls by week descending (most recent first)
            var sortedPolls = polls.slice().sort(function(a, b) { return b.week - a.week; });
            var html = chartHtml;
            
            for (var i = 0; i < sortedPolls.length; i++) {
                var p = sortedPolls[i];
                var dateStr = p.date ? p.date : ('Week ' + p.week);
                var sampleStr = p.sampleSize ? 'n=' + p.sampleSize.toLocaleString() : '';
                
                // Sort poll candidates by vote share descending (Leader farthest to the left)
                var pollCands = [];
                var pollKeys = Object.keys(p.poll);
                for (var pk = 0; pk < pollKeys.length; pk++) {
                    var k = pollKeys[pk];
                    if (k === 'Undecided') continue;
                    var val = p.poll[k];
                    if (val > 0.05 && Utils.isPartyOnBallot(k, target)) {
                        pollCands.push({ party: k, pct: val });
                    }
                }
                pollCands.sort(function(a, b) { return b.pct - a.pct; });

                var leaderParty = pollCands.length > 0 ? pollCands[0].party : 'D';
                var leaderColor = (typeof PARTIES !== 'undefined' && PARTIES[leaderParty] && PARTIES[leaderParty].color) ? PARTIES[leaderParty].color : '#aaa';

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
                    var pColor = (typeof PARTIES !== 'undefined' && PARTIES[pItem.party] && PARTIES[pItem.party].color) ? PARTIES[pItem.party].color : '#888';
                    var lastName = Utils.getCandidateLastName(pItem.party);
                    
                    var candObj = null;
                    if (typeof gameData !== 'undefined') {
                        if (gameData.selectedParty === pItem.party && gameData.candidate) candObj = gameData.candidate;
                        else if (pItem.party === 'D' && gameData.demTicket) candObj = gameData.demTicket.pres;
                        else if (pItem.party === 'R' && gameData.repTicket) candObj = gameData.repTicket.pres;
                        else if (gameData.thirdTickets && gameData.thirdTickets[pItem.party]) candObj = gameData.thirdTickets[pItem.party].pres;
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
