/* ============================================
   DECISION 2028 - COUNTY SYSTEM
   ============================================ */

var Counties = {
    currentState: null,
    countyData: {},
    rallyDistanceRatios: {
        lower48: null,
        alaska: null
    },
    RALLY_RADIUS_MILES: 120,
    MAX_RALLY_ATTENDANCE: 65000,
    DEFAULT_MAJOR_PARTY_TURNOUT: 1.0,
    DEFAULT_THIRD_PARTY_TURNOUT: 0.7,
    MAX_TURNOUT_MULTIPLIER: 1.3,
    CALIBRATION_LA_FIPS: '06037',
    CALIBRATION_NY_FIPS: '36061',
    CALIBRATION_DISTANCE_MILES: 2445,
    ALASKA_MAP_SCALE_FACTOR: 0.35,
    HAWAII_STATE_FIPS: '15',
    DEMOGRAPHIC_POOL_GROUPS: [
        'black', 'hispanic', 'asian', 'native', 'white',
        'urban', 'suburban', 'rural',
        'union', 'college', 'noncollege',
        'bluecollar', 'whitecollar', 'smallbusiness',
        'youth', 'seniors'
    ],
    
    // Normalize FIPS code by ensuring it's a 5-digit string with leading zeros
    // Ensures consistent FIPS format (e.g., "04013", "01001")
    normalizeFips: function(fips) {
        if (!fips) return fips;
        // Convert to string and pad to 5 digits with leading zeros
        return String(fips).padStart(5, '0');
    },
    
    // Load county data from JSON
    loadCountyData: function(callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'counties/county_data.json', true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                Counties.countyData = JSON.parse(xhr.responseText);
                
                // Initialize each county with undecided voters and proper baseline
                for (var fips in Counties.countyData) {
                    var c = Counties.countyData[fips];
                    
                    // Store original values for reference
                    // Map county JSON's 'O' key to 'I' (Independent), 'F' to 'PSL' (Party for Socialism and Liberation)
                    c.v.I = c.v.O || 0;
                    c.v.PSL = c.v.F || 0;
                    c.originalV = {
                        D: c.v.D,
                        R: c.v.R,
                        G: c.v.G || 0,
                        L: c.v.L || 0,
                        I: c.v.I || 0,
                        PSL: c.v.PSL || 0
                    };
                    
                    // Initialize undecided percentage (15% of population)
                    c.undecided = (c.undecided !== undefined) ? c.undecided : 15.0;
                    
                    // Apply third-party toggle logic
                    Counties.applyThirdPartyToggle(c);
                    
                    // Initialize turnout multipliers
                    c.turnout = {
                        player: Counties.DEFAULT_MAJOR_PARTY_TURNOUT,
                        demOpponent: Counties.DEFAULT_MAJOR_PARTY_TURNOUT,
                        repOpponent: Counties.DEFAULT_MAJOR_PARTY_TURNOUT,
                        thirdParty: Counties.DEFAULT_THIRD_PARTY_TURNOUT
                    };
                }
                
                Counties.initializeRallyDistanceRatios();
                
                // Initialize state margins from county data to ensure consistency
                // This prevents the bug where first campaign action causes large margin shifts
                // Defensive checks ensure globals are loaded (this runs in async callback)
                if (typeof gameData !== 'undefined' && gameData.states && typeof STATES !== 'undefined') {
                    for (var code in gameData.states) {
                        Counties.updateStateFromCounties(code);
                    }
                }
                
                console.log('✓ County data loaded with undecided voters initialized');
                
                if (callback) callback();
            }
        };
        xhr.send();
    },
    
    getCountyCentroid: function(fips) {
        var normalizedFips = this.normalizeFips(fips);
        var county = this.countyData[normalizedFips];
        if (!county) return null;
        
        var x = Number(county.centroidX);
        var y = Number(county.centroidY);
        if (!isFinite(x) || !isFinite(y)) return null;
        
        return { x: x, y: y };
    },
    
    getPixelDistance: function(pointA, pointB) {
        if (!pointA || !pointB) return Infinity;
        var dx = pointA.x - pointB.x;
        var dy = pointA.y - pointB.y;
        return Math.sqrt(dx * dx + dy * dy);
    },
    
    calculateRallyDistanceRatios: function() {
        var laCentroid = this.getCountyCentroid(this.CALIBRATION_LA_FIPS);
        var nyCentroid = this.getCountyCentroid(this.CALIBRATION_NY_FIPS);
        
        if (!laCentroid || !nyCentroid) {
            return null;
        }
        
        var pixelDistance = this.getPixelDistance(laCentroid, nyCentroid);
        if (!isFinite(pixelDistance) || pixelDistance <= 0) {
            return null;
        }
        
        // Calibrate miles-per-pixel using LA County (06037) ↔ New York County (36061),
        // which are approximately 2,445 real-world miles apart.
        var lower48Ratio = this.CALIBRATION_DISTANCE_MILES / pixelDistance;
        return {
            lower48: lower48Ratio,
            // Alaska is intentionally scaled down in the SVG map (~35% of lower-48 scale),
            // so convert with an adjusted miles-per-pixel ratio.
            alaska: lower48Ratio / this.ALASKA_MAP_SCALE_FACTOR
        };
    },
    
    initializeRallyDistanceRatios: function() {
        if (this.hasRallyDistanceRatios()) {
            return this.rallyDistanceRatios;
        }
        
        var ratios = this.calculateRallyDistanceRatios();
        if (!ratios) {
            console.warn('⚠️ Unable to initialize rally distance ratios. Missing/invalid county centroids.');
            return null;
        }
        this.rallyDistanceRatios = ratios;
        return ratios;
    },
    
    getMilesPerPixelRatio: function(stateFips) {
        if (!this.rallyDistanceRatios || !this.rallyDistanceRatios.lower48 || !this.rallyDistanceRatios.alaska) {
            return null;
        }
        return stateFips === '02' ? this.rallyDistanceRatios.alaska : this.rallyDistanceRatios.lower48;
    },
    
    hasRallyDistanceRatios: function() {
        return !!(
            this.rallyDistanceRatios &&
            isFinite(this.rallyDistanceRatios.lower48) &&
            isFinite(this.rallyDistanceRatios.alaska) &&
            this.rallyDistanceRatios.lower48 > 0 &&
            this.rallyDistanceRatios.alaska > 0
        );
    },
    
    getStateCodeFromFips: function(stateFips) {
        for (var stateCode in STATES) {
            if (STATES[stateCode] && STATES[stateCode].fips === stateFips) {
                return stateCode;
            }
        }
        return null;
    },

    getBaseTurnoutRate: function(county) {
        if (typeof Election !== 'undefined' && typeof Election.getCountyTurnoutRate === 'function') {
            return Election.getCountyTurnoutRate(county);
        }
        return 0.56;
    },

    getPartyTurnoutMultipliers: function(county) {
        var turnout = county && county.turnout ? county.turnout : null;
        var playerTurnout = turnout && turnout.player ? turnout.player : 1.0;
        var demTurnout = turnout && turnout.demOpponent ? turnout.demOpponent : 1.0;
        var repTurnout = turnout && turnout.repOpponent ? turnout.repOpponent : 1.0;
        var thirdTurnout = turnout && turnout.thirdParty ? turnout.thirdParty : 0.7;

        var multipliers = { D: demTurnout, R: repTurnout, G: thirdTurnout, L: thirdTurnout, PSL: thirdTurnout, I: thirdTurnout };
        if (gameData.selectedParty === 'D') multipliers.D = playerTurnout;
        if (gameData.selectedParty === 'R') multipliers.R = playerTurnout;
        if (gameData.selectedParty === 'G') multipliers.G = playerTurnout;
        if (gameData.selectedParty === 'L') multipliers.L = playerTurnout;
        if (gameData.selectedParty === 'PSL') multipliers.PSL = playerTurnout;
        if (gameData.selectedParty === 'I') multipliers.I = playerTurnout;

        return multipliers;
    },

    getCountyGroupShare: function(county, groupId) {
        if (!county) return 0;
        var normalizedGroup = groupId || '';
        var igKey = (typeof _mapGroupToIgKey !== 'undefined') ? _mapGroupToIgKey(normalizedGroup) : normalizedGroup;

        if (igKey) {
            return _getCountyIgValue(county, igKey);
        }

        if (normalizedGroup === 'urban') return _getCountyTierGroupWeight(county, 'urban');
        if (normalizedGroup === 'suburban') return _getCountyTierGroupWeight(county, 'suburban');
        if (normalizedGroup === 'rural') return _getCountyTierGroupWeight(county, 'rural');
        if (normalizedGroup === 'noncollege') return Math.max(0, 1 - _getCountyIgValue(county, 'college'));
        if (normalizedGroup === 'youth') return _getCountyIgValue(county, 'youth');
        if (normalizedGroup === 'seniors') return _getCountyIgValue(county, 'seniors');
        if (normalizedGroup === 'white') {
            var nonWhite = _getCountyIgValue(county, 'black') + _getCountyIgValue(county, 'hispanic') +
                _getCountyIgValue(county, 'asian') + _getCountyIgValue(county, 'native') + _getCountyIgValue(county, 'pacific');
            return Math.max(0, Math.min(1, 1 - nonWhite));
        }

        if (typeof calculateCompositeTag === 'function') {
            var compositeShare = calculateCompositeTag(normalizedGroup, 1, county);
            if (typeof compositeShare === 'number') {
                return Math.max(0, Math.min(1, compositeShare));
            }
        }

        return 0;
    },

    getCountyDemographicWeights: function(county) {
        var groups = this.DEMOGRAPHIC_POOL_GROUPS;
        var weights = [];
        for (var i = 0; i < groups.length; i++) {
            var groupId = groups[i];
            var share = this.getCountyGroupShare(county, groupId);
            if (share > 0) {
                weights.push({ id: groupId, share: share });
            }
        }
        return weights;
    },

    getGroupSupportByParty: function(groupId, county) {
        var support = { D: 0, R: 0, G: 0, L: 0, PSL: 0, I: 0 };
        var groupSupport = gameData.interestGroupSupport && gameData.interestGroupSupport[groupId] ? gameData.interestGroupSupport[groupId] : null;
        var baselineSupport = gameData.interestGroupBaseSupport && gameData.interestGroupBaseSupport[groupId] ? gameData.interestGroupBaseSupport[groupId] : null;
        var activeCandidates = (typeof _buildActiveCandidatesList === 'function') ? _buildActiveCandidatesList() : [];

        if (county && county.v) {
            support.D = county.v.D || 0;
            support.R = county.v.R || 0;
            support.G = county.v.G || 0;
            support.L = county.v.L || 0;
            support.PSL = county.v.PSL || 0;
            support.I = county.v.I || 0;
        } else if (INTEREST_GROUPS[groupId] && INTEREST_GROUPS[groupId].support) {
            var baseSupport = INTEREST_GROUPS[groupId].support;
            support.D = baseSupport.D || 0;
            support.R = baseSupport.R || 0;
            support.G = baseSupport.G || 0;
            support.L = baseSupport.L || 0;
            support.PSL = baseSupport.PSL || 0;
            support.I = baseSupport.I || 0;
        } else if (groupSupport && activeCandidates.length) {
            for (var i = 0; i < activeCandidates.length; i++) {
                var cand = activeCandidates[i];
                if (groupSupport[cand.id] !== undefined) {
                    support[cand.voteKey] = groupSupport[cand.id];
                }
            }
            baselineSupport = null;
        }

        // Apply interest-group shifts as deltas so county baselines remain intact.
        if (groupSupport && baselineSupport && activeCandidates.length) {
            for (var j = 0; j < activeCandidates.length; j++) {
                var cand = activeCandidates[j];
                var currentSupport = groupSupport[cand.id];
                var candidateBaseSupport = baselineSupport[cand.id];
                if (currentSupport === undefined || candidateBaseSupport === undefined) continue;
                var delta = currentSupport - candidateBaseSupport;
                if (!isFinite(delta) || delta === 0) continue;
                support[cand.voteKey] = Math.max(0, (support[cand.voteKey] || 0) + delta);
            }
        }

        if (!gameData.thirdPartiesEnabled) {
            support.G = 0; support.L = 0; support.PSL = 0; support.I = 0;
        }

        Object.keys(support).forEach(function(key) {
            support[key] = Math.max(0, support[key]);
        });

        var totalSupport = support.D + support.R + support.G + support.L + support.PSL + support.I;
        if (totalSupport <= 0) {
            support.D = 50;
            support.R = 50;
            support.G = 0;
            support.L = 0;
            support.PSL = 0;
            support.I = 0;
            totalSupport = 100;
        }

        Object.keys(support).forEach(function(key) {
            support[key] = (support[key] / totalSupport) * 100;
        });

        return support;
    },

    calculateCountyVoteTotals: function(county, options) {
        var opts = options || {};
        var reportingFactor = opts.reportingFactor !== undefined ? opts.reportingFactor : 1;
        var decidedMultiplier = opts.decidedMultiplier !== undefined ? opts.decidedMultiplier : 1;
        var errorFactor = opts.errorFactor !== undefined ? opts.errorFactor : 1;

        var baseTurnout = this.getBaseTurnoutRate(county);
        var voterPool = (county && county.p ? county.p : 0) * baseTurnout * decidedMultiplier * reportingFactor * errorFactor;
        if (voterPool <= 0) {
            return { D: 0, R: 0, G: 0, L: 0, PSL: 0, I: 0 };
        }

        var groupWeights = this.getCountyDemographicWeights(county);
        var turnoutMultipliers = this.getPartyTurnoutMultipliers(county);
        var totals = { D: 0, R: 0, G: 0, L: 0, PSL: 0, I: 0 };
        var totalWeight = 0;

        for (var i = 0; i < groupWeights.length; i++) {
            var groupId = groupWeights[i].id;
            var share = groupWeights[i].share;
            var groupTurnout = (gameData.interestGroupTurnout && gameData.interestGroupTurnout[groupId] !== undefined)
                ? gameData.interestGroupTurnout[groupId] : 1.0;
            totalWeight += share * groupTurnout;
        }

        if (totalWeight <= 0) {
            var fallbackSupport = this.getGroupSupportByParty('default', county);
            var fallbackTotal = 0;
            for (var key in fallbackSupport) {
                fallbackTotal += fallbackSupport[key];
            }
            for (var party in totals) {
                totals[party] = voterPool * ((fallbackSupport[party] || 0) / (fallbackTotal || 1));
            }
            return totals;
        }

        for (var j = 0; j < groupWeights.length; j++) {
            var group = groupWeights[j];
            var groupId = group.id;
            var groupShare = group.share;
            var turnoutIndex = (gameData.interestGroupTurnout && gameData.interestGroupTurnout[groupId] !== undefined)
                ? gameData.interestGroupTurnout[groupId] : 1.0;
            var groupWeight = groupShare * turnoutIndex;
            if (groupWeight <= 0) continue;

            var groupPool = voterPool * (groupWeight / totalWeight);
            var support = this.getGroupSupportByParty(groupId, county);
            var supportWeights = {};
            var supportTotal = 0;
            for (var partyKey in support) {
                var weight = (support[partyKey] || 0) * (turnoutMultipliers[partyKey] || 1.0);
                supportWeights[partyKey] = weight;
                supportTotal += weight;
            }

            if (supportTotal <= 0) continue;

            for (var p in totals) {
                totals[p] += groupPool * (supportWeights[p] / supportTotal);
            }
        }

        return totals;
    },
    
    applyRallySpillover: function(targetCountyID) {
        var targetFips = this.normalizeFips(targetCountyID);
        var targetCounty = this.countyData[targetFips];
        if (!targetCounty) return null;
        
        if (!this.hasRallyDistanceRatios()) {
            this.initializeRallyDistanceRatios();
        }
        if (!this.hasRallyDistanceRatios()) return null;
        
        var targetCentroid = this.getCountyCentroid(targetFips);
        if (!targetCentroid) return null;
        
        var baseBoost = (typeof PERSUASION_CONSTANTS !== 'undefined' && typeof PERSUASION_CONSTANTS.RALLY_TURNOUT_BOOST === 'number')
            ? PERSUASION_CONSTANTS.RALLY_TURNOUT_BOOST
            : 0.05;
        var candidates = [];
        var totalRawTurnout = 0;
        
        for (var fips in this.countyData) {
            var county = this.countyData[fips];
            var normalizedFips = this.normalizeFips(fips);
            var stateFips = normalizedFips.substring(0, 2);
            
            // Hawaii is intentionally excluded from mainland/Alaska distance spillover.
            if (stateFips === this.HAWAII_STATE_FIPS) continue;
            
            var centroid = this.getCountyCentroid(normalizedFips);
            if (!centroid) continue;
            
            var milesPerPixel = this.getMilesPerPixelRatio(stateFips);
            if (!milesPerPixel) continue;
            
            var pixelDistance = this.getPixelDistance(targetCentroid, centroid);
            var distanceMiles = pixelDistance * milesPerPixel;
            if (distanceMiles > this.RALLY_RADIUS_MILES) continue;
            
            var decay = Math.max(0, 1 - (distanceMiles / this.RALLY_RADIUS_MILES));
            var provisionalBoost = baseBoost * decay;
            var rawTurnout = (county.p || 0) * provisionalBoost;
            if (rawTurnout <= 0) continue;
            
            candidates.push({
                fips: normalizedFips,
                stateFips: stateFips,
                county: county,
                provisionalBoost: provisionalBoost,
                rawTurnout: rawTurnout
            });
            totalRawTurnout += rawTurnout;
        }
        
        var scaleFactor = 1;
        if (totalRawTurnout > this.MAX_RALLY_ATTENDANCE) {
            scaleFactor = this.MAX_RALLY_ATTENDANCE / totalRawTurnout;
        }
        
        var totalAppliedRawTurnout = 0;
        var affectedStates = {};
        
        for (var i = 0; i < candidates.length; i++) {
            var entry = candidates[i];
            var countyEntry = entry.county;
            if (!countyEntry.turnout) {
                countyEntry.turnout = {
                    player: this.DEFAULT_MAJOR_PARTY_TURNOUT,
                    demOpponent: this.DEFAULT_MAJOR_PARTY_TURNOUT,
                    repOpponent: this.DEFAULT_MAJOR_PARTY_TURNOUT,
                    thirdParty: this.DEFAULT_THIRD_PARTY_TURNOUT
                };
            }
            
            var scaledBoost = entry.provisionalBoost * scaleFactor;
            totalAppliedRawTurnout += entry.rawTurnout * scaleFactor;
            
            if (gameData.selectedParty === 'D' || gameData.selectedParty === 'R') {
                countyEntry.turnout.player = Math.min(
                    this.MAX_TURNOUT_MULTIPLIER,
                    (countyEntry.turnout.player || this.DEFAULT_MAJOR_PARTY_TURNOUT) + scaledBoost
                );
            } else {
                countyEntry.turnout.thirdParty = Math.min(
                    this.MAX_TURNOUT_MULTIPLIER,
                    (countyEntry.turnout.thirdParty || this.DEFAULT_THIRD_PARTY_TURNOUT) + scaledBoost
                );
            }
            
            var stateCode = this.getStateCodeFromFips(entry.stateFips);
            if (stateCode) affectedStates[stateCode] = true;
        }
        
        for (var affectedStateCode in affectedStates) {
            this.updateStateFromCounties(affectedStateCode);
        }
        
        return {
            countyCount: candidates.length,
            totalRawTurnout: totalRawTurnout,
            totalAppliedRawTurnout: totalAppliedRawTurnout,
            scaleFactor: scaleFactor
        };
    },
    
    // Apply third-party toggle - redistribute or include third-party votes
    applyThirdPartyToggle: function(county) {
        if (!county.v || !county.originalV) return;
        
        var thirdPartiesEnabled = gameData.thirdPartiesEnabled;
        
        if (thirdPartiesEnabled) {
            // Use original third-party percentages
            county.v.G = county.originalV.G;
            county.v.L = county.originalV.L;
            county.v.I = county.originalV.I;
            county.v.PSL = county.originalV.PSL;
        } else {
            // Split third-party votes 50/50 between D and R
            var totalThird = (county.originalV.G || 0) + (county.originalV.L || 0) + (county.originalV.I || 0) + (county.originalV.PSL || 0);
            var halfThird = totalThird / 2;
            
            county.v.D = county.originalV.D + halfThird;
            county.v.R = county.originalV.R + halfThird;
            county.v.G = 0;
            county.v.L = 0;
            county.v.I = 0;
            county.v.PSL = 0;
        }
    },

    getPartyVoteKeys: function() {
        return ['D', 'R', 'G', 'L', 'PSL', 'I'];
    },

    getCountyVotesForAllocation: function(county, useReportedVotes) {
        var parties = this.getPartyVoteKeys();
        var votes = { D: 0, R: 0, G: 0, L: 0, PSL: 0, I: 0 };

        if (useReportedVotes && county && county.reportedVotes) {
            for (var i = 0; i < parties.length; i++) {
                votes[parties[i]] = Math.max(0, county.reportedVotes[parties[i]] || 0);
            }
            return votes;
        }

        if (!county) return votes;
        var undecidedPct = county.undecided || 0;
        var decidedMultiplier = (100 - undecidedPct) / 100;
        var totals = this.calculateCountyVoteTotals(county, {
            reportingFactor: 1,
            decidedMultiplier: decidedMultiplier,
            errorFactor: 1
        });

        for (var j = 0; j < parties.length; j++) {
            votes[parties[j]] = Math.max(0, totals[parties[j]] || 0);
        }
        return votes;
    },

    getLeadingPartyFromVotes: function(votes) {
        var parties = this.getPartyVoteKeys();
        var winner = parties[0];
        var winnerVotes = votes[winner] || 0;
        for (var i = 1; i < parties.length; i++) {
            var p = parties[i];
            var val = votes[p] || 0;
            if (val > winnerVotes) {
                winner = p;
                winnerVotes = val;
            }
        }
        return winner;
    },

    normalizeVoteShareMap: function(voteShares) {
        var parties = this.getPartyVoteKeys();
        var total = 0;
        for (var i = 0; i < parties.length; i++) {
            var p = parties[i];
            voteShares[p] = Math.max(0, voteShares[p] || 0);
            total += voteShares[p];
        }
        if (total <= 0) {
            voteShares.D = 50;
            voteShares.R = 50;
            voteShares.G = 0;
            voteShares.L = 0;
            voteShares.PSL = 0;
            voteShares.I = 0;
            return voteShares;
        }
        for (var j = 0; j < parties.length; j++) {
            var party = parties[j];
            voteShares[party] = (voteShares[party] / total) * 100;
        }
        return voteShares;
    },

    buildSplitSegmentShares: function(county, countyVotes, segmentBaseline) {
        var parties = this.getPartyVoteKeys();
        var currentTotal = 0;
        for (var i = 0; i < parties.length; i++) {
            currentTotal += countyVotes[parties[i]] || 0;
        }

        var currentShare = { D: 0, R: 0, G: 0, L: 0, PSL: 0, I: 0 };
        if (currentTotal > 0) {
            for (var j = 0; j < parties.length; j++) {
                var p = parties[j];
                currentShare[p] = ((countyVotes[p] || 0) / currentTotal) * 100;
            }
        }

        var baseCounty = county && county.originalV ? county.originalV : (county && county.v ? county.v : { D: 50, R: 50 });
        var baseCountyTotal = 0;
        for (var k = 0; k < parties.length; k++) {
            baseCountyTotal += baseCounty[parties[k]] || 0;
        }
        var baseCountyShare = { D: 0, R: 0, G: 0, L: 0, PSL: 0, I: 0 };
        if (baseCountyTotal > 0) {
            for (var m = 0; m < parties.length; m++) {
                var p2 = parties[m];
                baseCountyShare[p2] = ((baseCounty[p2] || 0) / baseCountyTotal) * 100;
            }
        } else {
            baseCountyShare.D = 50;
            baseCountyShare.R = 50;
        }

        var segmentShares = {
            D: (segmentBaseline && segmentBaseline.D) || 50,
            R: (segmentBaseline && segmentBaseline.R) || 50,
            G: 0, L: 0, PSL: 0, I: 0
        };

        var deltaD = currentShare.D - baseCountyShare.D;
        var deltaR = currentShare.R - baseCountyShare.R;
        segmentShares.D += deltaD;
        segmentShares.R += deltaR;

        var majorSum = Math.max(0, segmentShares.D) + Math.max(0, segmentShares.R);
        var remainingThird = Math.max(0, 100 - majorSum);
        var thirdCurrent = (currentShare.G || 0) + (currentShare.L || 0) + (currentShare.PSL || 0) + (currentShare.I || 0);
        if (thirdCurrent > 0) {
            segmentShares.G = remainingThird * ((currentShare.G || 0) / thirdCurrent);
            segmentShares.L = remainingThird * ((currentShare.L || 0) / thirdCurrent);
            segmentShares.PSL = remainingThird * ((currentShare.PSL || 0) / thirdCurrent);
            segmentShares.I = remainingThird * ((currentShare.I || 0) / thirdCurrent);
        } else {
            segmentShares.D += remainingThird * 0.5;
            segmentShares.R += remainingThird * 0.5;
        }

        return this.normalizeVoteShareMap(segmentShares);
    },

    calculateStateElectoralAllocation: function(stateCode, options) {
        var opts = options || {};
        var useReportedVotes = !!opts.useReportedVotes;
        var parties = this.getPartyVoteKeys();
        var state = gameData.states[stateCode];
        if (!state) return null;

        var rule = (typeof SPLIT_ELECTORAL_RULES !== 'undefined') ? SPLIT_ELECTORAL_RULES[stateCode] : null;
        var allocation = { D: 0, R: 0, G: 0, L: 0, PSL: 0, I: 0 };

        if (!rule) {
            var stateVotes = this.getCountyVotesForAllocation({ reportedVotes: state.reportedVotes, undecided: 0, v: null }, true);
            if (!useReportedVotes) {
                stateVotes = { D: 0, R: 0, G: 0, L: 0, PSL: 0, I: 0 };
                var stateFipsSimple = STATES[stateCode] ? STATES[stateCode].fips : null;
                for (var f in this.countyData) {
                    var paddedFipsSimple = (f ? String(f) : '').padStart(5, '0');
                    if (stateFipsSimple && paddedFipsSimple.substring(0, 2) === stateFipsSimple) {
                        var cVotes = this.getCountyVotesForAllocation(this.countyData[f], false);
                        for (var p = 0; p < parties.length; p++) {
                            stateVotes[parties[p]] += cVotes[parties[p]] || 0;
                        }
                    }
                }
            }
            var simpleWinner = this.getLeadingPartyFromVotes(stateVotes);
            allocation[simpleWinner] = state.ev;
            return {
                allocation: allocation,
                calledFor: simpleWinner,
                statewideWinner: simpleWinner,
                statewideVotes: stateVotes,
                districtResults: [],
                isSplitState: false
            };
        }

        var districtVotes = {};
        var districtOrder = [];
        for (var districtId in rule.countyDistrictMap) {
            var mappedDistrict = rule.countyDistrictMap[districtId];
            if (districtOrder.indexOf(mappedDistrict) === -1) districtOrder.push(mappedDistrict);
        }
        for (var splitCountyFips in rule.splitCounties) {
            var segments = rule.splitCounties[splitCountyFips];
            for (var si = 0; si < segments.length; si++) {
                if (districtOrder.indexOf(segments[si].district) === -1) districtOrder.push(segments[si].district);
            }
        }
        if (rule.defaultDistrict && districtOrder.indexOf(rule.defaultDistrict) === -1) {
            districtOrder.push(rule.defaultDistrict);
        }
        for (var d = 0; d < districtOrder.length; d++) {
            districtVotes[districtOrder[d]] = { D: 0, R: 0, G: 0, L: 0, PSL: 0, I: 0 };
        }

        var statewideVotes = { D: 0, R: 0, G: 0, L: 0, PSL: 0, I: 0 };
        var stateFips = STATES[stateCode] ? STATES[stateCode].fips : null;
        for (var fips in this.countyData) {
            var paddedFips = (fips ? String(fips) : '').padStart(5, '0');
            if (!stateFips || paddedFips.substring(0, 2) !== stateFips) continue;
            var county = this.countyData[fips];
            var countyVotes = this.getCountyVotesForAllocation(county, useReportedVotes);

            for (var p1 = 0; p1 < parties.length; p1++) {
                statewideVotes[parties[p1]] += countyVotes[parties[p1]] || 0;
            }

            if (rule.splitCounties && rule.splitCounties[paddedFips]) {
                var countyTotalVotes = 0;
                for (var p2 = 0; p2 < parties.length; p2++) countyTotalVotes += countyVotes[parties[p2]] || 0;
                var splitSegments = rule.splitCounties[paddedFips];
                for (var segIdx = 0; segIdx < splitSegments.length; segIdx++) {
                    var seg = splitSegments[segIdx];
                    var segmentVotesTotal = countyTotalVotes * seg.share;
                    var segmentShares = this.buildSplitSegmentShares(county, countyVotes, seg.baseline);
                    if (!districtVotes[seg.district]) {
                        districtVotes[seg.district] = { D: 0, R: 0, G: 0, L: 0, PSL: 0, I: 0 };
                    }
                    for (var p3 = 0; p3 < parties.length; p3++) {
                        var key = parties[p3];
                        districtVotes[seg.district][key] += segmentVotesTotal * ((segmentShares[key] || 0) / 100);
                    }
                }
                continue;
            }

            var district = (rule.countyDistrictMap && rule.countyDistrictMap[paddedFips]) || rule.defaultDistrict;
            if (!districtVotes[district]) {
                districtVotes[district] = { D: 0, R: 0, G: 0, L: 0, PSL: 0, I: 0 };
            }
            for (var p4 = 0; p4 < parties.length; p4++) {
                var partyKey = parties[p4];
                districtVotes[district][partyKey] += countyVotes[partyKey] || 0;
            }
        }

        var districtResults = [];
        for (var districtName in districtVotes) {
            var districtWinner = this.getLeadingPartyFromVotes(districtVotes[districtName]);
            allocation[districtWinner] += 1;
            districtResults.push({
                district: districtName,
                winner: districtWinner,
                votes: districtVotes[districtName]
            });
        }

        var statewideWinner = this.getLeadingPartyFromVotes(statewideVotes);
        allocation[statewideWinner] += rule.statewideEV;

        return {
            allocation: allocation,
            calledFor: statewideWinner,
            statewideWinner: statewideWinner,
            statewideVotes: statewideVotes,
            districtResults: districtResults,
            isSplitState: true,
            statewideEV: rule.statewideEV
        };
    },
    
    // Open county view for a state
    openCountyView: function(stateCode) {
        this.currentState = stateCode;
        var stateName = gameData.states[stateCode].name;
        
        document.getElementById('us-map-wrapper').classList.add('hidden');
        document.getElementById('county-view-wrapper').classList.remove('hidden');
        document.getElementById('cv-title').innerText = stateName;
        
        this.loadCountyMap(stateCode);
    },
    
    // Load county SVG map
    loadCountyMap: function(stateCode) {
        var wrapper = document.getElementById('county-map-container');
        wrapper.innerHTML = '<div class="loading-map">Loading county map...</div>';
        
        var stateFips = STATES[stateCode] ? STATES[stateCode].fips : null;
        if (!stateFips) {
            wrapper.innerHTML = '<div class="error-map">State FIPS code not found.</div>';
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
                    svg.id = 'county-map-svg';
                    // Filter to show only counties for this state
                    var paths = svg.querySelectorAll('path');
                    var countyCount = 0;
                    
                    for (var i = 0; i < paths.length; i++) {
                        var path = paths[i];
                        var pathId = path.id;
                        
                        // County IDs in SVG are like "c01001" where 01 is state FIPS
                        if (pathId && pathId.length >= 3 && pathId.charAt(0) === 'c') {
                            var countyStateFips = pathId.substring(1, 3);
                            var fips = pathId.substring(1); // Remove the 'c' prefix
                            
                            if (countyStateFips === stateFips) {
                                // This county belongs to the state
                                countyCount++;
                                path.style.cursor = 'pointer';
                                path.style.display = 'block';
                                path.style.stroke = '#ffffff';
                                path.style.strokeWidth = '0.3';
                                
                                (function(f) {
                                    path.onclick = function() { Counties.selectCounty(f); };
                                    path.onmousemove = function(e) { Counties.showCountyTooltip(e, f); };
                                    path.onmouseleave = function() { 
                                        var tooltip = document.getElementById('map-tooltip');
                                        if (tooltip) tooltip.style.display = 'none';
                                    };
                                })(fips);
                            } else {
                                path.style.display = 'none';
                            }
                        } else if (pathId && pathId !== 'counties' && pathId !== stateCode) {
                            // Hide non-county paths
                            path.style.display = 'none';
                        }
                    }
                    
                    wrapper.innerHTML = '';
                    wrapper.appendChild(svg);
                    
                    if (countyCount === 0) {
                        wrapper.innerHTML = '<div class="error-map">No counties found for this state.</div>';
                    } else {
                        Counties.colorCountyMap();
                        // Center and scale the state's counties
                        Counties.focusOnStateCounties(svg, stateFips);
                    }
                }
            } else if (xhr.readyState === 4) {
                wrapper.innerHTML = '<div class="error-map">Failed to load county map.</div>';
            }
        };
        xhr.send();
    },
    
    // Focus on state counties by setting viewBox
    focusOnStateCounties: function(svg, stateFips) {
        // Get all county paths that belong to this state
        var stateCountyPaths = [];
        var paths = svg.querySelectorAll('path');
        
        for (var i = 0; i < paths.length; i++) {
            var path = paths[i];
            var pathId = path.id;
            
            // County IDs in SVG are like "c01001" where 01 is state FIPS
            if (pathId && pathId.length >= 3 && pathId.charAt(0) === 'c') {
                var countyStateFips = pathId.substring(1, 3);
                if (countyStateFips === stateFips && path.style.display !== 'none') {
                    stateCountyPaths.push(path);
                }
            }
        }
        
        if (stateCountyPaths.length === 0) return;
        
        // Calculate union bounding box
        var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        for (var j = 0; j < stateCountyPaths.length; j++) {
            var path = stateCountyPaths[j];
            try {
                var bb = path.getBBox();
                minX = Math.min(minX, bb.x);
                minY = Math.min(minY, bb.y);
                maxX = Math.max(maxX, bb.x + bb.width);
                maxY = Math.max(maxY, bb.y + bb.height);
            } catch (e) {
                // getBBox might fail on some paths, skip them
                continue;
            }
        }
        
        // Check if we got valid bounds
        if (minX === Infinity || minY === Infinity || maxX === -Infinity || maxY === -Infinity) {
            return;
        }
        
        // Add padding (5% of bbox)
        var padX = (maxX - minX) * 0.05;
        var padY = (maxY - minY) * 0.05;
        minX -= padX;
        minY -= padY;
        maxX += padX;
        maxY += padY;
        
        // Set viewBox to focus on selected state
        svg.setAttribute('viewBox', minX + ' ' + minY + ' ' + (maxX - minX) + ' ' + (maxY - minY));
    },
    
    // Normalize FIPS code to 5 digits with leading zeros
    normalizeFips: function(fips) {
        // Pad with leading zeros to make 5 digits
        return ('00000' + fips).slice(-5);
    },
    
    // Color county map based on margins
    colorCountyMap: function() {
        if (!this.currentState) return;
        
        var stateFips = STATES[this.currentState] ? STATES[this.currentState].fips : null;
        if (!stateFips) return;
        
        for (var fips in this.countyData) {
            // Check if this county belongs to the current state
            // Pad FIPS to 5 digits and extract state FIPS (first 2 digits)
            var paddedFipsForCheck = fips.padStart(5, '0');
            var countyStateFips = paddedFipsForCheck.substring(0, 2);
            
            if (countyStateFips === stateFips) {
                var county = this.countyData[fips];
                
                // Pad FIPS to 5 digits for SVG ID lookup (e.g., "4013" -> "04013")
                var paddedFips = fips.padStart(5, '0');
                var path = document.getElementById('c' + paddedFips);
                
                if (path && county.v) {
                    var totals = this.calculateCountyVoteTotals(county, { reportingFactor: 1, decidedMultiplier: 1, errorFactor: 1 });
                    var demVotes = totals.D || 0;
                    var repVotes = totals.R || 0;
                    var total = demVotes + repVotes;
                    
                    if (total > 0) {
                        var demPct = (demVotes / total) * 100;
                        var repPct = (repVotes / total) * 100;
                        var margin = demPct - repPct;
                        
                        // Use the same color function as state map
                        if (typeof Utils !== 'undefined' && Utils.getMarginColor) {
                            path.style.fill = Utils.getMarginColor(margin);
                        } else {
                            // Fallback coloring
                            if (Math.abs(margin) < 2) {
                                path.style.fill = '#808080';
                            } else if (margin > 0) {
                                path.style.fill = margin > 10 ? '#0066CC' : '#4d94ff';
                            } else {
                                path.style.fill = margin < -10 ? '#CC0000' : '#ff4d4d';
                            }
                        }
                    }
                }
            }
        }
    },
    
    // Select a county
    selectCounty: function(fips) {
        // Normalize FIPS to match JSON keys (strip leading zeros)
        var normalizedFips = this.normalizeFips(fips);
        var county = this.countyData[normalizedFips];
        if (!county) return;
        
        // Store selected county (use normalized FIPS)
        gameData.selectedCounty = normalizedFips;
        
        // Show county info in sidebar
        document.getElementById('sp-name').innerText = county.n || 'County';
        
        // Show population instead of EV
        var populationDiv = document.getElementById('sp-ev');
        if (populationDiv) {
            populationDiv.innerText = 'Pop: ' + (county.p || 0).toLocaleString();
        }
        
        // Build ranked candidate list for the county
        var pollByParty = Utils.getCountyPollingByParty(county);
        var prevPollByParty = (gameData.pollCache && gameData.pollCache.county && gameData.pollCache.county[normalizedFips]) || null;
        var pollVis = document.getElementById('poll-vis');
        if (pollVis) {
            pollVis.innerHTML = Utils.buildCandidateRankedListHTML(pollByParty, prevPollByParty);
        }
        
        // Show turnout info
        var issuesList = document.getElementById('sp-issues-list');
        if (issuesList) {
            var turnoutBoost = 0;
            if (county.turnout) {
                if (gameData.selectedParty === 'D' || gameData.selectedParty === 'R') {
                    turnoutBoost = (county.turnout.player || 1.0) - 1.0;
                } else {
                    turnoutBoost = (county.turnout.thirdParty || 0.7) - 0.7;
                }
            }
            
            var turnoutText = 'Normal';
            if (turnoutBoost > 0.15) turnoutText = 'Strong';
            else if (turnoutBoost > 0.08) turnoutText = 'Good';
            else if (turnoutBoost > 0.03) turnoutText = 'Moderate';
            
            issuesList.innerHTML = '<div style="background: #2a2a2a; padding: 8px; margin-bottom: 10px; border-radius: 4px;"><strong>Turnout:</strong> <span style="color: ' + (turnoutBoost > 0.1 ? '#198754' : '#ccc') + '">' + turnoutText + '</span></div>';
            issuesList.innerHTML += '<div style="background: #2a2a2a; padding: 8px; border-radius: 4px;"><strong>Type:</strong> ' + (county.t || 'Unknown') + '</div>';
        }
        
        // Mark that we're in county view mode
        gameData.inCountyView = true;
        
        // Add county-specific action buttons
        var actionGrid = document.querySelector('.action-grid');
        if (actionGrid) {
            // Clear existing buttons and add county actions
            // Top row: Back to Map and Rally
            // Bottom row: Speech (full width)
            actionGrid.innerHTML = 
                '<button class="act-btn" onclick="app.closeCountyView()"><span><i class="fa-solid fa-map"></i></span><span>BACK TO MAP</span></button>' +
                '<button class="act-btn" onclick="app.countyRally()"><span><i class="fa-solid fa-bullhorn"></i></span><span>RALLY</span></button>' +
                '<button class="act-btn" onclick="app.countySpeech()" style="grid-column: 1 / -1;"><span><i class="fa-solid fa-microphone"></i></span><span>SPEECH</span></button>';
        }
    },
    
    // Rally in a specific county
    rallyInCounty: function(fips) {
        // Normalize FIPS to match JSON keys (strip leading zeros)
        var normalizedFips = this.normalizeFips(fips);
        if (!normalizedFips || !this.countyData[normalizedFips]) return;
        
        if (gameData.energy < 1) {
            Utils.showToast("Not enough energy!");
            return;
        }
        if (gameData.funds < 0.5) {
            Utils.showToast("Need $0.5M for county rally!");
            return;
        }
        if (!this.hasRallyDistanceRatios()) {
            this.initializeRallyDistanceRatios();
        }
        if (!this.hasRallyDistanceRatios()) {
            Utils.showToast("Rally unavailable: missing distance ratio calibration.");
            return;
        }
        if (!this.getCountyCentroid(normalizedFips)) {
            Utils.showToast("Rally unavailable: missing county centroid data.");
            return;
        }
        
        Campaign.saveState();
        
        var county = this.countyData[normalizedFips];
        var spilloverResult = this.applyRallySpillover(normalizedFips);
        if (!spilloverResult) {
            Utils.showToast("Rally spillover unavailable: missing centroid data.");
            return;
        }
        
        gameData.energy -= 1;
        gameData.funds -= 0.5;
        
        var turnoutDisplay = Math.round(spilloverResult.totalAppliedRawTurnout).toLocaleString();
        var countyWord = spilloverResult.countyCount === 1 ? 'county' : 'counties';
        var countyName = county.n || 'County';
        var impactText = spilloverResult.countyCount + ' ' + countyWord + ' impacted';
        var turnoutText = 'est. turnout +' + turnoutDisplay;
        var message = 'Regional rally in ' + countyName + ': ' + impactText + ', ' + turnoutText + '.';
        Utils.addLog(message);
        Campaign.updateHUD();
        Campaign.colorMap();
        this.colorCountyMap();
        Utils.showToast(message);
    },
    
    // Update state-level margin from county data
    // Calculates state's total Democratic, Republican, and Third Party votes
    // by summing votes from EVERY county assigned to that state (using FIPS code prefix)
    updateStateFromCounties: function(stateCode) {
        var stateFips = STATES[stateCode] ? STATES[stateCode].fips : null;
        if (!stateFips) return;
        
        var totalDemVotes = 0;
        var totalRepVotes = 0;
        var totalThirdPartyVotes = 0;
        
        // Sum ALL votes from every county in this state
        for (var fips in this.countyData) {
            // Pad FIPS to 5 digits and extract state FIPS (first 2 digits)
            var paddedFips = fips.padStart(5, '0');
            var countyStateFips = paddedFips.substring(0, 2);
            if (countyStateFips === stateFips) {
                var county = this.countyData[fips];
                if (county.v && county.p) {
                    // Initialize turnout if not present
                    if (!county.turnout) {
                        county.turnout = { player: 1.0, demOpponent: 1.0, repOpponent: 1.0, thirdParty: 0.7 };
                    }
                    
                    // Calculate effective vote percentages (excluding undecided)
                    var undecidedPct = county.undecided || 0;
                    var decidedMultiplier = (100 - undecidedPct) / 100;

                    var totals = this.calculateCountyVoteTotals(county, {
                        reportingFactor: 1,
                        decidedMultiplier: decidedMultiplier,
                        errorFactor: 1
                    });

                    totalDemVotes += totals.D || 0;
                    totalRepVotes += totals.R || 0;
                    totalThirdPartyVotes += (totals.G || 0) + (totals.L || 0) + (totals.I || 0) + (totals.PSL || 0);
                }
            }
        }
        
        // Calculate new margin derived directly from this sum
        // This is the "source of truth" for the map
        var totalVotes = totalDemVotes + totalRepVotes + totalThirdPartyVotes;
        if (totalVotes > 0) {
            var demPct = (totalDemVotes / totalVotes) * 100;
            var repPct = (totalRepVotes / totalVotes) * 100;
            var thirdPct = (totalThirdPartyVotes / totalVotes) * 100;
            
            // State margin formula: (Total Dem - Total Rep) / Total Major Party Votes
            var majorPartyVotes = totalDemVotes + totalRepVotes;
            var newMargin = majorPartyVotes > 0 ? ((totalDemVotes - totalRepVotes) / majorPartyVotes) * 100 : 0;
            
            // Update state data
            if (gameData.states[stateCode]) {
                gameData.states[stateCode].margin = newMargin;
                gameData.states[stateCode].demPct = demPct;
                gameData.states[stateCode].repPct = repPct;
                gameData.states[stateCode].thirdPct = thirdPct;
                gameData.states[stateCode].totalVotes = totalVotes;
            }
        }
    },
    
    // Show county tooltip
    showCountyTooltip: function(e, fips) {
        // Normalize FIPS to match JSON keys (strip leading zeros)
        var normalizedFips = this.normalizeFips(fips);
        var county = this.countyData[normalizedFips];
        if (!county) return;
        
        var tooltip = document.getElementById('map-tooltip');
        if (!tooltip) return;
        
        var totals = this.calculateCountyVoteTotals(county, { reportingFactor: 1, decidedMultiplier: 1, errorFactor: 1 });
        var demVotes = totals.D || 0;
        var repVotes = totals.R || 0;
        var total = demVotes + repVotes;
        
        var marginText = 'N/A';
        var color = '#888';
        
        if (total > 0) {
            var demPct = (demVotes / total) * 100;
            var repPct = (repVotes / total) * 100;
            var margin = demPct - repPct;
            
            // Always show exact margin, no "TOSS-UP" label
            marginText = (margin > 0 ? 'D+' : 'R+') + Math.abs(margin).toFixed(1);
            color = margin > 0 ? '#00AEF3' : '#E81B23';
        }
        
        // Determine proper suffix based on state
        var countyName = county.n || 'County';
        var suffix = 'County';
        var normalizedFips = this.normalizeFips(fips);
        var stateFips = normalizedFips.substring(0, 2);
        
        // Alaska uses "Borough", Louisiana uses "Parish"
        if (stateFips === '02') {  // Alaska FIPS code
            suffix = 'Borough';
        } else if (stateFips === '22') {  // Louisiana FIPS code
            suffix = 'Parish';
        }
        
        // Only add suffix if the name doesn't already contain it
        if (!countyName.includes(suffix) && !countyName.includes('County') && 
            !countyName.includes('Borough') && !countyName.includes('Parish')) {
            countyName = countyName + ' ' + suffix;
        }
        
        tooltip.innerHTML = 
            '<span class="tooltip-title">' + countyName + '</span>' +
            '<div class="tooltip-divider"></div>' +
            '<span class="tooltip-leader" style="color: ' + color + '">' + marginText + '</span>';
        tooltip.style.display = 'block';
        tooltip.style.left = (e.clientX + 15) + 'px';
        tooltip.style.top = (e.clientY + 15) + 'px';
    },
    
    // Get state FIPS prefix from state code
    getStateFipsPrefix: function(stateCode) {
        // Use FIPS codes from STATES config
        if (typeof STATES !== 'undefined' && STATES[stateCode] && STATES[stateCode].fips) {
            return STATES[stateCode].fips;
        }
        return '00';
    },
    
    // Close county view
    closeCountyView: function() {
        document.getElementById('county-view-wrapper').classList.add('hidden');
        document.getElementById('us-map-wrapper').classList.remove('hidden');
        this.currentState = null;
        gameData.inCountyView = false;
        gameData.selectedCounty = null;
        
        // Restore state action buttons
        var actionGrid = document.querySelector('.action-grid');
        if (actionGrid) {
            actionGrid.innerHTML = 
                '<button class="act-btn" onclick="app.handleAction(\'fundraise\')"><span>💰</span><span>FUNDRAISE</span></button>' +
                '<button class="act-btn" onclick="app.handleAction(\'ad\')"><span>📺</span><span>AD BLITZ</span></button>' +
                '<button class="act-btn" onclick="app.openStateBio()"><span>📖</span><span>INTEL</span></button>' +
                '<button class="act-btn" onclick="app.openCountyView()"><span>🗺️</span><span>BREAKDOWN</span></button>' +
                '<button class="act-btn" onclick="app.openIssuesPanel()"><span>📊</span><span>ISSUES</span></button>';
        }
    },
    
    // Get adjacent counties (simplified)
    getAdjacentCounties: function(fips) {
        // Would need adjacency data - returning empty for now
        return [];
    },
    
    // Open county speech modal
    openCountySpeechModal: function(fips) {
        // Normalize FIPS to match JSON keys (strip leading zeros)
        var normalizedFips = this.normalizeFips(fips);
        var county = this.countyData[normalizedFips];
        if (!county) return;
        
        // Check energy
        if (gameData.energy < 1) {
            Utils.showToast("Not enough energy!");
            return;
        }
        
        // Check if CORE_ISSUES is defined
        if (typeof CORE_ISSUES === 'undefined') {
            Utils.showToast("Issue data not loaded!");
            return;
        }
        
        // Build speech modal content
        var modal = document.getElementById('speech-modal');
        if (!modal) return;
        
        var countyName = county.n || 'County';
        document.getElementById('speech-modal').querySelector('h2').innerText = 'Campaign Speech - ' + countyName;
        
        var issuesHtml = '';
        for (var i = 0; i < CORE_ISSUES.length; i++) {
            var issue = CORE_ISSUES[i];
            
            issuesHtml += '<button class="speech-issue-btn" onclick="Counties.handleCountySpeech(\'' + fips + '\', \'' + issue.id + '\')">';
            issuesHtml += issue.name;
            issuesHtml += '<span class="issue-alignment">Will affect interest groups based on your position</span>';
            issuesHtml += '</button>';
        }
        
        document.getElementById('speech-issues-list').innerHTML = issuesHtml;
        modal.classList.remove('hidden');
    },
    
    // Handle county speech on an issue
    handleCountySpeech: function(fips, issueId) {
        // Normalize FIPS to match JSON keys (strip leading zeros)
        var normalizedFips = this.normalizeFips(fips);
        var county = this.countyData[normalizedFips];
        if (!county || gameData.energy < 1) return;
        
        Campaign.saveState();
        
        // Close modal
        document.getElementById('speech-modal').classList.add('hidden');
        
        // Consume energy
        gameData.energy -= 1;
        
        // Get candidate's position on this issue
        var candidatePos = (gameData.candidate.issuePositions && gameData.candidate.issuePositions[issueId]) || 0;
        
        // Small voter count increase in this county (2-5%)
        var voterBoost = 0.02 + Math.random() * 0.03;
        
        if (!county.turnout) county.turnout = { player: 1.0, demOpponent: 1.0, repOpponent: 1.0, thirdParty: 0.7 };
        
        if (gameData.selectedParty === 'D' || gameData.selectedParty === 'R') {
            county.turnout.player = Math.min(1.3, (county.turnout.player || 1.0) + voterBoost);
        } else {
            county.turnout.thirdParty = Math.min(1.3, (county.turnout.thirdParty || 0.7) + (voterBoost * 0.5));
        }
        
        // Now affect interest groups based on issue alignment
        if (typeof INTEREST_GROUPS === 'undefined') {
            // Interest groups not defined, skip this part
            Utils.addLog(message);
            return;
        }
        
        for (var groupId in INTEREST_GROUPS) {
            var group = INTEREST_GROUPS[groupId];
            
            // Check if this issue is a priority for this group
            var isPriority = group.priorities && group.priorities.includes(issueId);
            
            if (isPriority) {
                // Calculate alignment based on position overlap
                var groupPreferredPos = group.issue_positions ? (group.issue_positions[issueId] || 0) : 0;
                var positionDiff = Math.abs(candidatePos - groupPreferredPos);
                
                var supportChange = 0;
                
                if (positionDiff === 0) {
                    // Perfect overlap
                    supportChange = 0.5;
                } else if (positionDiff < 5) {
                    // Partial overlap - linear decay
                    supportChange = 0.5 * (1 - positionDiff / 5);
                } else if (positionDiff >= 5) {
                    // Nullified or negative
                    supportChange = -0.5 * ((positionDiff - 5) / 10);
                    supportChange = Math.max(supportChange, -0.5);
                }
                
                // Apply the change to candidate's support in this group
                if (gameData.interestGroupSupport && gameData.interestGroupSupport[groupId]) {
                    var candId = gameData.candidate.id;
                    var currentSupport = gameData.interestGroupSupport[groupId][candId] || 0;
                    var newSupport = currentSupport + supportChange;
                    
                    // Ensure valid range
                    newSupport = Math.max(0, Math.min(100, newSupport));
                    
                    // Store change for display
                    if (!gameData.interestGroupChanges[groupId]) {
                        gameData.interestGroupChanges[groupId] = {};
                    }
                    gameData.interestGroupChanges[groupId][candId] = (gameData.interestGroupChanges[groupId][candId] || 0) + supportChange;
                    
                    // Apply change
                    gameData.interestGroupSupport[groupId][candId] = newSupport;
                    
                    // Propagate this change to ALL counties based on group population percentage
                    this.propagateInterestGroupChange(groupId, candId, supportChange);
                }
            }
        }
        
        // Update display
        this.updateStateFromCounties(this.currentState);
        Campaign.updateHUD();
        Campaign.colorMap();
        this.colorCountyMap();
        
        var message = 'Campaign speech on ' + issueId + ' in ' + (county.n || 'County') + '!';
        Utils.addLog(message);
        Utils.showToast(message);
    },
    
    // Propagate interest group support change to all counties
    propagateInterestGroupChange: function(groupId, candId, supportChange) {
        // Get the group's population percentage in each county (from STATE_DEMOGRAPHICS if available)
        // For now, use a simplified approach based on state demographics
        
        if (typeof STATE_DEMOGRAPHICS === 'undefined') {
            // Demographics not defined, skip propagation
            return;
        }
        
        for (var fips in this.countyData) {
            var county = this.countyData[fips];
            // Normalize FIPS for comparison
            var normalizedFips = this.normalizeFips(fips);
            var stateFips = normalizedFips.substring(0, 2);
            
            // Find which state this belongs to
            var stateCode = null;
            for (var code in STATES) {
                if (STATES[code].fips === stateFips) {
                    stateCode = code;
                    break;
                }
            }
            
            if (!stateCode || !STATE_DEMOGRAPHICS[stateCode]) continue;
            
            // Get group percentage in this state (approximate for county)
            var groupPct = STATE_DEMOGRAPHICS[stateCode][groupId] || 0;
            
            // Calculate vote shift: CHANGE × Interest Group %
            var voteShift = supportChange * (groupPct / 100);
            
            // Apply to county votes
            if (!county.turnout) county.turnout = { player: 1.0, demOpponent: 1.0, repOpponent: 1.0, thirdParty: 0.7 };
            
            // Determine which party benefits
            if (candId === gameData.candidate.id) {
                if (gameData.selectedParty === 'D') {
                    // Player is Democrat - adjust turnout
                    county.turnout.player = Math.min(1.5, Math.max(0.5, (county.turnout.player || 1.0) + (voteShift / 100)));
                } else if (gameData.selectedParty === 'R') {
                    // Player is Republican - adjust turnout
                    county.turnout.player = Math.min(1.5, Math.max(0.5, (county.turnout.player || 1.0) + (voteShift / 100)));
                }
            }
        }
    }
};
