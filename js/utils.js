function clamp(x, lo, hi) { return Math.max(lo, Math.min(hi, x)); }
function gaussianNoise(mean, sigma) {
    var u1 = Math.random();
    while (u1 === 0) u1 = Math.random();
    var u2 = Math.random();
    var z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return (mean || 0) + (sigma !== undefined ? sigma : 1) * z;
}

// Ballot access is a state-level election rule.  County calculations should
// always resolve the county's two-letter state code before applying it so a
// county FIPS, display label, or stale map selection cannot make every
// third-party candidate ineligible.
function isPartyOnBallotForState(partyCode, stateCode) {
    if (typeof PrimaryNative !== 'undefined' && PrimaryNative.active && PrimaryNative.active()) {
        if (typeof PrimaryCampaign !== 'undefined' && PrimaryCampaign.actor && PrimaryCampaign.actor(partyCode)) return true;
    }
    if (partyCode === 'D' || partyCode === 'R') return true;
    var state = String(stateCode || '').trim().toUpperCase();
    if (!state || state === 'USA') return true;
    if (/^\d+$/.test(state)) {
        var prefix = state.padStart(5, '0').substring(0, 2);
        if (typeof Counties !== 'undefined' && typeof Counties.getStateCodeFromFips === 'function') {
            var resolvedState = Counties.getStateCodeFromFips(prefix);
            if (resolvedState) state = resolvedState.toUpperCase();
        }
    }
    if (typeof gameData === 'undefined' || !gameData.thirdPartiesEnabled) return false;
    if (typeof gameData.thirdTickets !== 'undefined' && gameData.thirdTickets && !gameData.thirdTickets[partyCode]) return false;
    var access = typeof THIRD_PARTY_BALLOT_ACCESS !== 'undefined' ? THIRD_PARTY_BALLOT_ACCESS[partyCode] : null;
    // An unlisted party is treated as available when its ticket is active;
    // the configured lists are restrictions, not a county-level whitelist.
    return !Array.isArray(access) || access.indexOf(state) !== -1;
}

var Utils = {
    POPULATION_ICON: '<i class="fa-solid fa-user-group"></i>',

    clamp: function (x, lo, hi) {
        return Math.max(lo, Math.min(hi, x));
    },

    gaussianNoise: function (mean, sigma) {
        var u1 = Math.random();
        while (u1 === 0) u1 = Math.random();
        var u2 = Math.random();
        var z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        return mean + sigma * z;
    },

    getLastName: function (fullName) {
        if (!fullName) return '';
        var parts = fullName.trim().split(' ');
        return parts[parts.length - 1];
    },

    showToast: function (msg) {
        var toast = document.getElementById('toast');
        if (toast) {
            toast.innerText = msg;
            toast.style.opacity = 1;
            setTimeout(function () { toast.style.opacity = 0; }, 2500);
        }
    },

    getDisplayTier: function (tier) {
        if (!tier) return 'Unknown';
        if (tier === 'Highly Urban') return 'Highly Urban';
        if (tier === 'Urban/Dense Suburban') return 'Urban/Dense Suburban';
        if (tier === 'Suburban/Mixed') return 'Suburban/Mixed';
        if (tier === 'Rural/Small Town') return 'Rural/Small Town';
        if (tier === 'Deep Rural') return 'Deep Rural';
        return tier;
    },

    addLog: function (message) {
        gameData.logs.unshift(message);
        if (gameData.logs.length > 50) gameData.logs.pop();

        var container = document.getElementById('log-content');
        if (container) {
            var html = '';
            for (var i = 0; i < gameData.logs.length; i++) {
                html += '<p>' + gameData.logs[i] + '</p>';
            }
            container.innerHTML = html;
        }
    },

    getPartyColor: function(party) {
        var colors = {
            'D': '#00AEF3',
            'R': '#E81B23',
            'G': '#28a745',
            'L': '#ffc107',
            'I': '#6f42c1',
            'PSL': '#dc3545'
        };
        return colors[party] || '#888888';
    },

    getMarginColor: function (margin, party) {
        // Backwards compatibility for old calls without party specified
        if (!party) {
            party = margin > 0 ? 'D' : 'R';
            margin = Math.abs(margin);
        } else {
            margin = Math.abs(margin);
        }

        // Base candidate colors
        var baseColors = {
            'D': [0, 174, 243],    // #00AEF3
            'R': [232, 27, 35],    // #E81B23
            'G': [40, 167, 69],    // #28a745
            'L': [255, 193, 7],    // #ffc107
            'I': [111, 66, 193],   // #6f42c1
            'PSL': [220, 53, 69]   // #dc3545
        };

        // Darkened versions for 50%+ margins
        var darkColors = {
            'D': [0, 52, 73],
            'R': [70, 8, 10],
            'G': [12, 50, 20],
            'L': [76, 58, 2],
            'I': [33, 20, 58],
            'PSL': [66, 16, 20]
        };

        // Very light tinted versions for 0.1% margins
        var tintColors = {
            'D': [225, 245, 255],
            'R': [255, 225, 225],
            'G': [225, 255, 230],
            'L': [255, 250, 220],
            'I': [240, 230, 255],
            'PSL': [255, 225, 230]
        };

        var cBase = baseColors[party] || baseColors['I'];
        var cDark = darkColors[party] || darkColors['I'];
        var cTint = tintColors[party] || tintColors['I'];

        // If it's a perfect tie, return pure white
        if (margin === 0) return '#ffffff';

        var r, g, b;
        
        if (margin <= 15) {
            // Interpolate from tint (0.1%) to base candidate color (15%)
            // We use a slight curve (square root) to make lower margins visually pop
            var pct = Math.sqrt(margin / 15);
            r = Math.round(cTint[0] + (cBase[0] - cTint[0]) * pct);
            g = Math.round(cTint[1] + (cBase[1] - cTint[1]) * pct);
            b = Math.round(cTint[2] + (cBase[2] - cTint[2]) * pct);
        } else {
            // Interpolate from base candidate color (15%) to dark color (50%)
            var m = Math.min(margin, 50);
            var pct = (m - 15) / 35;
            r = Math.round(cBase[0] + (cDark[0] - cBase[0]) * pct);
            g = Math.round(cBase[1] + (cDark[1] - cBase[1]) * pct);
            b = Math.round(cBase[2] + (cDark[2] - cBase[2]) * pct);
        }

        return 'rgb(' + r + ',' + g + ',' + b + ')';
    },

    formatDate: function (date) {
        var months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        return months[date.getMonth()] + ' ' + date.getDate();
    },

    formatTime: function (timeValue) {
        // Handle time past midnight (24 hours)
        var adjustedTime = timeValue;
        if (timeValue >= 24) {
            adjustedTime = timeValue - 24;
        }

        var hours = Math.floor(adjustedTime);
        var minutes = Math.floor((adjustedTime - hours) * 60);
        var ampm = hours >= 12 ? 'PM' : 'AM';
        var displayHours = hours > 12 ? hours - 12 : hours;
        if (displayHours === 0) displayHours = 12;
        return displayHours + ':' + (minutes < 10 ? '0' : '') + minutes + ' ' + ampm;
    },

    isThirdParty: function (partyCode) {
        return partyCode === 'PSL' || partyCode === 'G' || partyCode === 'L' || partyCode === 'I';
    },

    shuffleArray: function (array) {
        var result = array.slice();
        for (var i = result.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = result[i];
            result[i] = result[j];
            result[j] = temp;
        }
        return result;
    },

    // Return all active presidential candidates with their party + candidate object
    getActiveCandidates: function () {
        var list = [];
        if (gameData.candidate) {
            list.push({ party: gameData.selectedParty, cand: gameData.candidate });
        }
        if (gameData.selectedParty !== 'D' && gameData.demTicket && gameData.demTicket.pres) {
            list.push({ party: 'D', cand: gameData.demTicket.pres });
        }
        if (gameData.selectedParty !== 'R' && gameData.repTicket && gameData.repTicket.pres) {
            list.push({ party: 'R', cand: gameData.repTicket.pres });
        }
        if (gameData.thirdPartiesEnabled && gameData.thirdTickets) {
            var tpCodes = ['G', 'L', 'I', 'PSL'];
            for (var tp = 0; tp < tpCodes.length; tp++) {
                var tpCode = tpCodes[tp];
                if (gameData.selectedParty !== tpCode && gameData.thirdTickets[tpCode] && gameData.thirdTickets[tpCode].pres) {
                    list.push({ party: tpCode, cand: gameData.thirdTickets[tpCode].pres });
                }
            }
        }
        return list;
    },

    getNationalPollingByParty: function() {
        if (typeof gameData !== 'undefined' && gameData.pollingAverages && gameData.pollingAverages['USA']) {
            return gameData.pollingAverages['USA'];
        }
        return this.getTrueNationalPollingByParty();
    },

    getStatePollingByParty: function(stateCode) {
        if (typeof gameData !== 'undefined' && gameData.pollingAverages && gameData.pollingAverages[stateCode]) {
            return gameData.pollingAverages[stateCode];
        }
        return this.getTrueStatePollingByParty(stateCode);
    },

    // District polling uses the same county-derived baseline as states, but
    // preserves the county undecided share instead of silently dropping it.
    // Maine and Nebraska district boundaries are scenario geography handled by
    // SPLIT_ELECTORAL_RULES; this is a display estimate, not a separate poll.
    getDistrictPollingByParty: function(stateCode, districtId) {
        if (typeof Counties === 'undefined' || !Counties.countyData ||
            typeof SPLIT_ELECTORAL_RULES === 'undefined' || !SPLIT_ELECTORAL_RULES[stateCode]) return null;
        var rule = SPLIT_ELECTORAL_RULES[stateCode], parties = ['D', 'R', 'G', 'L', 'PSL', 'I'];
        var decided = { D: 0, R: 0, G: 0, L: 0, PSL: 0, I: 0 }, undecided = 0;
        var stateFips = STATES[stateCode] && STATES[stateCode].fips;
        var addVotes = function(votes, share, undecidedPct) {
            var segmentTotal = 0;
            for (var i = 0; i < parties.length; i++) segmentTotal += Math.max(0, Number(votes[parties[i]]) || 0);
            if (segmentTotal <= 0 || share <= 0) return;
            for (var j = 0; j < parties.length; j++) decided[parties[j]] += Math.max(0, Number(votes[parties[j]]) || 0) * share;
            var u = Math.max(0, Math.min(99.9, Number(undecidedPct) || 0));
            undecided += segmentTotal * share * (u / Math.max(0.1, 100 - u));
        };

        Counties.byState = Counties.byState || {};
        if (!Counties.byState[stateCode]) {
            Counties.byState[stateCode] = [];
            for (var f in Counties.countyData) {
                if (Counties.countyData[f].s === stateCode) {
                    Counties.byState[stateCode].push(Counties.countyData[f]);
                }
            }
        }
        var stateCounties = Counties.byState[stateCode];
        for (var ci = 0; ci < stateCounties.length; ci++) {
            var county = stateCounties[ci];
            if (!county) continue;
            var paddedFips = String(county.fips || '').padStart(5, '0');
            var countyVotes = Counties.getCountyVotesForAllocation(county, false);
            var countyTotal = parties.reduce(function(sum, party) { return sum + Math.max(0, countyVotes[party] || 0); }, 0);
            if (countyTotal <= 0) continue;

            if (rule.splitCounties && rule.splitCounties[paddedFips]) {
                var segments = rule.splitCounties[paddedFips];
                var fitted = Counties.allocateSplitCountyVotes(county, countyVotes, segments, parties) || [];
                var shareTotal = segments.reduce(function(sum, segment) { return sum + Math.max(0, Number(segment.share) || 0); }, 0) || segments.length;
                for (var si = 0; si < segments.length; si++) {
                    if (segments[si].district !== districtId) continue;
                    addVotes(fitted[si] || {}, 1, county.undecided || 0);
                }
            } else {
                var district = (rule.countyDistrictMap && rule.countyDistrictMap[paddedFips]) || rule.defaultDistrict;
                if (district === districtId) addVotes(countyVotes, 1, county.undecided || 0);
            }
        }

        var decidedTotal = parties.reduce(function(sum, party) { return sum + decided[party]; }, 0), total = decidedTotal + undecided;
        if (total <= 0) return null;
        var result = { D: 0, R: 0, G: 0, L: 0, PSL: 0, I: 0, Undecided: 0 };
        for (var p = 0; p < parties.length; p++) result[parties[p]] = (decided[parties[p]] / total) * 100;
        result.Undecided = (undecided / total) * 100;
        return result;
    },

    getTrueNationalPollingByParty: function() {
        var nTotals = { D: 0, R: 0, G: 0, L: 0, I: 0, PSL: 0 };
        var nUndecided = 0;
        var nPop = 0;
        
        for (var stateCode in gameData.states) {
            var s = gameData.states[stateCode];
            var pcts = this.getTrueStatePollingByParty(stateCode);
            if (!pcts) continue;
            
            var weight = s.population || 1000000;
            nTotals.D += pcts.D * weight;
            nTotals.R += pcts.R * weight;
            nTotals.G += (pcts.G || 0) * weight;
            nTotals.L += (pcts.L || 0) * weight;
            nTotals.I += (pcts.I || 0) * weight;
            nTotals.PSL += (pcts.PSL || 0) * weight;
            nUndecided += (pcts.Undecided || 0) * weight;
            nPop += weight;
        }
        
        if (nPop === 0) return null;
        
        return {
            D: nTotals.D / nPop,
            R: nTotals.R / nPop,
            G: nTotals.G / nPop,
            L: nTotals.L / nPop,
            I: nTotals.I / nPop,
            PSL: nTotals.PSL / nPop,
            Undecided: nUndecided / nPop
        };
    },

    getTrueStatePollingByParty: function (stateCode) {
        if (typeof Counties === 'undefined' || !Counties.countyData) return null;
        if (typeof STATES === 'undefined' || !STATES[stateCode]) return null;
        var stateFips = STATES[stateCode].fips;
        if (!stateFips) return null;

        var totals = { D: 0, R: 0, G: 0, L: 0, I: 0, PSL: 0 };
        var stateUndecidedTotal = 0;
        var statePopTotal = 0;

        Counties.byState = Counties.byState || {};
        if (!Counties.byState[stateCode]) {
            Counties.byState[stateCode] = [];
            for (var f in Counties.countyData) {
                if (Counties.countyData[f].s === stateCode) {
                    Counties.byState[stateCode].push(Counties.countyData[f]);
                }
            }
        }
        var stateCounties = Counties.byState[stateCode];
        for (var ci = 0; ci < stateCounties.length; ci++) {
            var county = stateCounties[ci];
            if (!county.v || !county.p) continue;

            var decided = (100 - (county.undecided || 0)) / 100;
            var countyTotals = Counties.calculateCountyVoteTotals(county, { reportingFactor: 1, decidedMultiplier: decided, errorFactor: 1 });

            totals.D += countyTotals.D || 0;
            totals.R += countyTotals.R || 0;
            totals.G += countyTotals.G || 0;
            totals.L += countyTotals.L || 0;
            totals.I += countyTotals.I || 0;
            totals.PSL += countyTotals.PSL || 0;
            
            var pop = county.regVoters || county.p || 0;
            stateUndecidedTotal += (county.undecided || 0) * pop;
            statePopTotal += pop;
        }

        var totalVotes = totals.D + totals.R + totals.G + totals.L + totals.I + totals.PSL;
        if (totalVotes <= 0) return null;

        var stateUndecided = statePopTotal > 0 ? (stateUndecidedTotal / statePopTotal) : 0;
        var pcts = {};
        var keys = ['D', 'R', 'G', 'L', 'I', 'PSL'];
        var sumPct = 0;
        for (var pi = 0; pi < keys.length; pi++) {
            var scaledPct = (totals[keys[pi]] / totalVotes) * (100 - stateUndecided);
            pcts[keys[pi]] = scaledPct;
            sumPct += scaledPct;
        }
        pcts['Undecided'] = 100 - sumPct;
        return pcts;
    },

    getCountyPollingByParty: function (county) {
        if (!county || !county.v) return null;

        if (typeof MichiganModel !== 'undefined' && MichiganModel.isInitialized && (typeof Election === 'undefined' || !Election.isSimulating)) {
            var pred = MichiganModel.getCountyPrediction(county);
            if (pred && pred.predictedShares) {
                var pcts = {};
                var stateCode = county.s || (county.fips ? Counties.getStateCodeFromFips(county.fips.substring(0, 2)) : 'PA');
                var keys = ['D', 'R', 'G', 'L', 'I', 'PSL'];
                var sumCand = 0;
                for (var pi = 0; pi < keys.length; pi++) {
                    var k = keys[pi];
                    var onBallot = (typeof this.isPartyOnBallot === 'function') ? this.isPartyOnBallot(k, stateCode) : (k === 'D' || k === 'R');
                    if (!onBallot) {
                        pcts[k] = 0;
                    } else {
                        var val = pred.predictedShares[k] || 0;
                        pcts[k] = val;
                        sumCand += val;
                    }
                }
                var uVal = (pred.undecidedPct !== undefined) ? pred.undecidedPct : (pred.predictedShares['Undecided'] !== undefined ? pred.predictedShares['Undecided'] : Math.max(0, 100.0 - sumCand));
                pcts['Undecided'] = Math.round(uVal * 10) / 10;
                // Mathematically guarantee totals sum to exactly 100.0%
                var diff = Math.round((100.0 - (sumCand + pcts['Undecided'])) * 10) / 10;
                if (Math.abs(diff) > 0.0001) {
                    pcts['Undecided'] = Math.round((pcts['Undecided'] + diff) * 10) / 10;
                }
                return pcts;
            }
        }

        var decided = (100 - (county.undecided || 0)) / 100;
        var totals = Counties.calculateCountyVoteTotals(county, { reportingFactor: 1, decidedMultiplier: decided, errorFactor: 1 });

        var totalVotes = totals.D + totals.R + totals.G + totals.L + totals.I + totals.PSL;
        if (totalVotes <= 0) return null;

        var countyUndecided = county.undecided || 0;
        var pcts = {};
        var keys = ['D', 'R', 'G', 'L', 'I', 'PSL'];
        var sumPct = 0;
        for (var pi = 0; pi < keys.length; pi++) {
            var scaledPct = (totals[keys[pi]] / totalVotes) * (100 - countyUndecided);
            pcts[keys[pi]] = scaledPct;
            sumPct += scaledPct;
        }
        pcts['Undecided'] = 100 - sumPct;
        return pcts;
    },

    // ─── Ranked candidate list helpers ─────────────────────────────────────────

    // Build the ordered array of all active candidates with polling percentages and deltas
    _getRankedCandidates: function (pcts, prevPcts) {
        var all = [];

        // Dem ticket
        if (gameData.demTicket && gameData.demTicket.pres) {
            all.push({ party: 'D', cand: gameData.demTicket.pres });
        }
        // Rep ticket
        if (gameData.repTicket && gameData.repTicket.pres) {
            all.push({ party: 'R', cand: gameData.repTicket.pres });
        }
        // Third-party tickets
        if (gameData.thirdPartiesEnabled && gameData.thirdTickets) {
            var tpCodes = ['G', 'L', 'I', 'PSL'];
            for (var ti = 0; ti < tpCodes.length; ti++) {
                var tpc = tpCodes[ti];
                if (gameData.thirdTickets[tpc] && gameData.thirdTickets[tpc].pres) {
                    all.push({ party: tpc, cand: gameData.thirdTickets[tpc].pres });
                }
            }
        }

        // Attach percentages and deltas
        var result = [];
        for (var i = 0; i < all.length; i++) {
            var entry = all[i];
            var pct = (pcts && pcts[entry.party]) || 0;
            var prev = (prevPcts && prevPcts[entry.party]);
            var delta = (prev !== undefined) ? pct - prev : 0;
            result.push({ party: entry.party, cand: entry.cand, pct: pct, delta: delta, hasPrevious: prev !== undefined });
        }
        
        result.sort(function (a, b) { return b.pct - a.pct; });
        return result;
    },

    // Format a candidate name as "First Last (P-ST)"
    _formatCandName: function (cand, party) {
        var homeState = (cand && (cand.homeState || cand.state)) || '';
        var partyCode = party || (cand && cand.party) || '?';
        return (cand ? cand.name : '—') + ' (' + partyCode + (homeState ? '-' + homeState : '') + ')';
    },

    isPartyOnBallot: function (partyCode, stateCode) {
        return isPartyOnBallotForState(partyCode, stateCode);
    },

    getCandidateLastName: function (partyCode) {
        if (typeof gameData === 'undefined') return partyCode;
        var cand = null;
        if (gameData.selectedParty === partyCode && gameData.candidate) {
            cand = gameData.candidate;
        } else if (partyCode === 'D' && gameData.demTicket && gameData.demTicket.pres) {
            cand = gameData.demTicket.pres;
        } else if (partyCode === 'R' && gameData.repTicket && gameData.repTicket.pres) {
            cand = gameData.repTicket.pres;
        } else if (gameData.thirdTickets && gameData.thirdTickets[partyCode] && gameData.thirdTickets[partyCode].pres) {
            cand = gameData.thirdTickets[partyCode].pres;
        }
        if (!cand || !cand.name) {
            return (typeof PARTIES !== 'undefined' && PARTIES[partyCode]) ? PARTIES[partyCode].shortName : partyCode;
        }
        var parts = cand.name.trim().split(/\s+/);
        return parts[parts.length - 1];
    },

    getEstimatedNationalTurnout: function () {
        if (typeof Counties === 'undefined' || !Counties.countyData) return 160000000;
        var total = 0;
        for (var fips in Counties.countyData) {
            var county = Counties.countyData[fips];
            if (!county) continue;
            var registered = Number(county.regVoters);
            if (!(registered > 0)) registered = Number(county.p) || 0;
            var rate = typeof Counties.getCountyTurnoutRate === 'function'
                ? Counties.getCountyTurnoutRate(county)
                : Number(county.turnoutBase) || 0.66;
            total += registered * Math.max(0, Math.min(1, Number(rate) || 0));
        }
        return total > 0 ? total : 160000000;
    },

    getNationalPopularVoteEstimate: function (party) {
        var polls = typeof this.getNationalPollingByParty === 'function' ? this.getNationalPollingByParty() : {};
        var pollPct = Number(polls && polls[party]);
        if (!(pollPct >= 0)) pollPct = 0;
        return Math.round(this.getEstimatedNationalTurnout() * pollPct / 100);
    },

    getJurisdictionTurnout: function (targetId) {
        if (typeof Counties === 'undefined' || !Counties.countyData) return 0;
        var target = String(targetId || 'USA').toUpperCase();
        var stateFips = (typeof STATES !== 'undefined' && STATES[target] && STATES[target].fips) ? String(STATES[target].fips).padStart(2, '0') : null;
        var countyFips = /^\d{1,5}$/.test(target) ? target.padStart(5, '0') : null;
        var total = 0;
        for (var fips in Counties.countyData) {
            var padded = String(fips).padStart(5, '0');
            if (stateFips && padded.substring(0, 2) !== stateFips) continue;
            if (countyFips && padded !== countyFips) continue;
            var county = Counties.countyData[fips];
            if (!county) continue;
            if (countyFips && typeof MichiganModel !== 'undefined' && MichiganModel.isInitialized && (typeof Election === 'undefined' || !Election.isSimulating)) {
                var pred = MichiganModel.getCountyPrediction(county);
                if (pred && pred.predictedBallotsCast > 0) {
                    return pred.predictedBallotsCast;
                }
            }
            var registered = Number(county.regVoters);
            if (!(registered > 0)) registered = Number(county.p) || 0;
            var rate = typeof Counties.getCountyTurnoutRate === 'function'
                ? Counties.getCountyTurnoutRate(county)
                : Number(county.turnoutBase) || 0.66;
            total += registered * Math.max(0, Math.min(1, Number(rate) || 0));
        }
        return total;
    },

    getJurisdictionPopularVoteEstimate: function (party, targetId, pollPct) {
        var target = targetId || 'USA';
        var pct = Number(pollPct);
        if (!(pct >= 0)) {
            var polls = target === 'USA' ? this.getNationalPollingByParty() : this.getStatePollingByParty(target);
            pct = Number(polls && polls[party]);
        }
        if (!(pct >= 0)) pct = 0;
        var turnout = this.getJurisdictionTurnout(target);
        if (!(turnout > 0) && String(target).toUpperCase() === 'USA') turnout = this.getEstimatedNationalTurnout();
        return Math.round(Math.max(0, turnout) * pct / 100);
    },

    // Build ranked candidate list HTML for simulator state/county views
    buildCandidateRankedListHTML: function (pcts, prevPcts, targetId) {
        if (!pcts) {
            return '<div class="cpl-empty">No polling data available.</div>';
        }
        var candidates = this._getRankedCandidates(pcts, prevPcts);
        if (!candidates.length) {
            return '<div class="cpl-empty">No candidates.</div>';
        }

        var isCounty = /^\d{1,5}$/.test(String(targetId || ''));
        var html = '';
        if (isCounty && typeof MichiganModel !== 'undefined' && MichiganModel.isInitialized && (typeof Election === 'undefined' || !Election.isSimulating)) {
            var normFips = Counties.normalizeFips(targetId);
            var countyObj = Counties.countyData ? Counties.countyData[normFips] : null;
            var pred = countyObj ? MichiganModel.getCountyPrediction(countyObj) : null;
            var accLabel = pred ? (pred.accuracyLabel + (pred.maxErrorPct !== undefined ? ' · ±' + pred.maxErrorPct + '%' : '')) : 'Moderate';
            html += '<div class="cpl-predictive-banner" style="background: rgba(245, 158, 11, 0.12); border: 1px solid rgba(245, 158, 11, 0.35); border-radius: 6px; padding: 6px 10px; margin-bottom: 8px;">' +
                '<div style="display: flex; justify-content: space-between; align-items: center;">' +
                    '<span style="font-size: 0.72rem; font-weight: 800; color: #f59e0b; letter-spacing: 0.6px;"><i class="fa-solid fa-chart-line"></i> PREDICTIVE MODEL</span>' +
                    '<span style="font-size: 0.68rem; color: #fbbf24; background: rgba(0,0,0,0.3); padding: 2px 6px; border-radius: 4px;">' + accLabel + '</span>' +
                '</div>' +
                '<div style="font-size: 0.68rem; color: #d1d5db; margin-top: 2px;">Model calibrated by state ground operations & polling intelligence</div>' +
            '</div>';
        }
        html += '<div class="cpl-list">';
        for (var i = 0; i < candidates.length; i++) {
            var item = candidates[i];
            var onBallot = this.isPartyOnBallot(item.party, targetId);
            var isOffBallot = !onBallot || (item.pct === 0 && this.isThirdParty(item.party));

            var partyColor = (PARTIES[item.party] && PARTIES[item.party].color) || '#888';
            var displayColor = isOffBallot ? '#777777' : partyColor;
            var formattedName = this._formatCandName(item.cand, item.party);
            var imgSrc = (item.cand && item.cand.img) ? item.cand.img : 'images/scenario.jpg';
            var deltaStr = item.hasPrevious ? ((item.delta >= 0 ? '+' : '') + item.delta.toFixed(1)) : '—';
            var deltaClass = !item.hasPrevious ? 'cpl-delta-neu' : (item.delta > 0.05 ? 'cpl-delta-pos' : (item.delta < -0.05 ? 'cpl-delta-neg' : 'cpl-delta-neu'));

            var avatarStyle = isOffBallot ? 'border-color:#555; filter: grayscale(100%); opacity: 0.45;' : 'border-color:' + partyColor + ';';
            var nameStyle = isOffBallot ? 'color: #888; font-weight: normal;' : '';
            var pctStyle = isOffBallot ? 'color: #777; opacity: 0.6;' : 'color:' + partyColor + ';';

            var popEstimate = this.getJurisdictionPopularVoteEstimate(item.party, targetId, item.pct);
            html += '<div class="cpl-row cpl-popvote-row" tabindex="0" aria-label="' + formattedName + ', estimated popular vote in this jurisdiction ' + popEstimate.toLocaleString() + '">';
            html += '<img class="cpl-avatar" src="' + imgSrc + '" onerror="this.src=\'images/scenario.jpg\'" alt="" style="' + avatarStyle + '">';
            html += '<div class="cpl-info">';
            html += '<div class="cpl-name" style="' + nameStyle + '">' + formattedName + '</div>';
            if (isOffBallot) {
                html += '<div style="font-size: 0.62rem; color: #666; font-style: italic;">No Ballot Access</div>';
            } else {
                html += '<div class="cpl-bar-wrap"><div class="cpl-bar" style="width:' + Math.max(0.5, item.pct).toFixed(1) + '%;background:' + partyColor + ';"></div></div>';
            }
            html += '</div>';
            html += '<div class="cpl-pct-group">';
            html += '<span class="cpl-pct cpl-percent-value" style="' + pctStyle + '">' + item.pct.toFixed(1) + '%</span>';
            html += '<span class="cpl-pct cpl-popvote-value" title="Estimated popular vote in this jurisdiction" style="' + pctStyle + '">' + popEstimate.toLocaleString() + '</span>';
            if (!isOffBallot) {
                html += '<span class="' + deltaClass + '">' + deltaStr + '</span>';
            }
            html += '</div>';
            html += '</div>';
        }
        html += '</div>';
        
        var uPct = (pcts && pcts['Undecided'] !== undefined) ? pcts['Undecided'] : 0;
        var tid = targetId || (typeof gameData !== 'undefined' && gameData.selectedState ? gameData.selectedState : 'USA');
        
        if (uPct > 0.05) {
            html += '<div class="cpl-undecided-row" style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px; font-size: 0.85rem; font-weight: 700; color: var(--ink-muted);">';
            var isStateTarget = typeof STATES !== 'undefined' && STATES[String(tid).toUpperCase()];
            if (typeof Polling !== 'undefined' && isStateTarget) {
                html += '<button onpointerdown="Polling.openPollsModal(\'' + tid + '\'); event.stopPropagation();" onclick="Polling.openPollsModal(\'' + tid + '\'); event.stopPropagation();" style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.2); color: #fff; cursor: pointer; border-radius: 4px; padding: 3px 8px; font-size: 0.8em; display: inline-flex; align-items: center; gap: 5px; transition: all 0.2s;" title="View Polling History" onmouseover="this.style.background=\'rgba(255,255,255,0.22)\';" onmouseout="this.style.background=\'rgba(255,255,255,0.08)\';"><i class="fa-solid fa-square-poll-vertical"></i> Polls</button>';
            } else if (isCounty) {
                html += '<span style="font-size: 0.72rem; color: #9ca3af;"><i class="fa-solid fa-check-circle" style="color: #10b981;"></i> Total: 100.0%</span>';
            } else {
                html += '<div></div>';
            }
            html += '<span style="padding-right: 4px; color: #fbbf24;">Undecided: ' + uPct.toFixed(1) + '%</span></div>';
        } else if (isCounty) {
            html += '<div class="cpl-undecided-row" style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px; font-size: 0.72rem; color: #9ca3af;">' +
                '<span><i class="fa-solid fa-check-circle" style="color: #10b981;"></i> Total Projected</span>' +
                '<span style="font-weight: 700; color: #10b981;">100.0% Decided</span></div>';
        }
        
        return html;
    },

    // Build ranked candidate list HTML for election-night state/county detail panels
    buildElectionRankedListHTML: function (reportedVotes, reportedPct, ev, projStatus, targetId, shiftYear) {
        var votes = reportedVotes || { D: 0, R: 0, G: 0, L: 0, I: 0, PSL: 0 };
        var totalVotes = (votes.D || 0) + (votes.R || 0) + (votes.G || 0) +
            (votes.L || 0) + (votes.I || 0) + (votes.PSL || 0);

        // Build candidate list ordered by reported votes
        var all = [];
        if (gameData.demTicket && gameData.demTicket.pres) {
            all.push({ party: 'D', cand: gameData.demTicket.pres, votes: votes.D || 0 });
        }
        if (gameData.repTicket && gameData.repTicket.pres) {
            all.push({ party: 'R', cand: gameData.repTicket.pres, votes: votes.R || 0 });
        }
        if (gameData.thirdPartiesEnabled && gameData.thirdTickets) {
            var tpCodes = ['G', 'L', 'I', 'PSL'];
            for (var ti = 0; ti < tpCodes.length; ti++) {
                var tpc = tpCodes[ti];
                if (gameData.thirdTickets[tpc] && gameData.thirdTickets[tpc].pres && (votes[tpc] || 0) > 0) {
                    all.push({ party: tpc, cand: gameData.thirdTickets[tpc].pres, votes: votes[tpc] || 0 });
                }
            }
        }
        all.sort(function (a, b) { return b.votes - a.votes; });

        var html = '<div class="elec-cpl-list">';

        for (var i = 0; i < all.length; i++) {
            var item = all[i];
            var partyColor = (PARTIES[item.party] && PARTIES[item.party].color) || '#888';
            var formattedName = this._formatCandName(item.cand, item.party);
            var imgSrc = (item.cand && item.cand.img) ? item.cand.img : 'images/scenario.jpg';
            var pct = totalVotes > 0 ? (item.votes / totalVotes) * 100 : 0;
            
            var tickerHtml = '';
            if (targetId && shiftYear && typeof Election !== 'undefined' && Election.analysisMode) {
                var histPct = Election.getHistoricalVotePct(shiftYear, targetId, item.party);
                if (histPct !== null) {
                    var shift = pct - histPct;
                    var tickerColor = shift > 0 ? '#198754' : '#E81B23';
                    var tickerArrow = shift > 0 ? '▲' : '▼';
                    if (Math.abs(shift) < 0.05) {
                        tickerColor = '#888';
                        tickerArrow = '▶';
                    }
                    // Inline ticker styled same as week-to-week delta
                    tickerHtml = '<span style="font-size: 0.78em; color: ' + tickerColor + '; font-weight: bold; margin-left: 4px;">' + tickerArrow + Math.abs(shift).toFixed(1) + '</span>';
                }
            }

            html += '<div class="elec-cpl-row">';
            html += '<img class="elec-cpl-avatar" src="' + imgSrc + '" onerror="this.src=\'images/scenario.jpg\'" alt="" style="border-color:' + partyColor + ';">';
            html += '<div class="elec-cpl-info">';
            html += '<div class="elec-cpl-name">' + formattedName + '</div>';
            html += '<div class="elec-cpl-bar-wrap"><div class="elec-cpl-bar" style="width:' + Math.max(0.5, pct).toFixed(1) + '%;background:' + partyColor + ';"></div></div>';
            html += '</div>';
            html += '<div class="elec-cpl-right">';
            html += '<span class="elec-cpl-pct" style="color:' + partyColor + ';">' + tickerHtml + (tickerHtml ? ' ' : '') + pct.toFixed(1) + '%' + '</span>';
            html += '<span class="elec-cpl-votes">' + item.votes.toLocaleString() + '</span>';
            html += '</div>';
            html += '</div>';
        }
        html += '</div>';
        var pollTarget = targetId || '';
        var isPollHistoryTarget = pollTarget === 'USA' ||
            (typeof STATES !== 'undefined' && STATES[String(pollTarget).toUpperCase()]);
        html += '<div class="elec-total-votes-row" style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px; font-size: 0.85rem; font-weight: 700; color: var(--ink-muted);">';
        if (isPollHistoryTarget && typeof Polling !== 'undefined' && Polling.openPollsModal) {
            var pollTargetCode = String(pollTarget).toUpperCase();
            html += '<button onpointerdown="Polling.openPollsModal(\'' + pollTargetCode + '\'); event.stopPropagation();" onclick="Polling.openPollsModal(\'' + pollTargetCode + '\'); event.stopPropagation();" style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.2); color: #fff; cursor: pointer; border-radius: 4px; padding: 3px 8px; font-size: 0.8em; display: inline-flex; align-items: center; gap: 5px; transition: all 0.2s;" title="View Polling History" onmouseover="this.style.background=\'rgba(255,255,255,0.22)\';" onmouseout="this.style.background=\'rgba(255,255,255,0.08)\';"><i class="fa-solid fa-square-poll-vertical"></i> Polls</button>';
        } else {
            html += '<div></div>';
        }
        html += '<div class="elec-total-votes" style="padding-right: 4px;">' + totalVotes.toLocaleString() + ' votes</div>';
        html += '</div>';

        // Projection status banner
        if (projStatus) {
            var cssClass = projStatus.cssClass ? ' elec-proj-' + projStatus.cssClass : '';
            html += '<div class="elec-proj-status' + cssClass + '">' + projStatus.text + '</div>';
        }

        return html;
    },

    // Color a county/state by shift from 2024 election
    // shift > 0 = moved toward D, shift < 0 = moved toward R
    getShiftColor: function (shift) {
        var absShift = Math.abs(shift);
        if (absShift < 0.5) return '#888888';
        var intensity = Math.min(1, absShift / 20); // saturate at ±20 pts
        if (shift > 0) {
            // Shifted toward Dems: light → dark blue
            var r = Math.round(180 - intensity * 160);
            var g = Math.round(220 - intensity * 100);
            var b = Math.round(255);
            return 'rgb(' + r + ',' + g + ',' + b + ')';
        } else {
            // Shifted toward Reps: light → dark red
            var r2 = Math.round(255);
            var g2 = Math.round(180 - intensity * 160);
            var b2 = Math.round(180 - intensity * 160);
            return 'rgb(' + r2 + ',' + g2 + ',' + b2 + ')';
        }
    }
};
