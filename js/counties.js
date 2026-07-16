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
    RALLY_RADIUS_MILES: 50,
    MAX_RALLY_ATTENDANCE: 25000,
    DEFAULT_MAJOR_PARTY_TURNOUT: 1.0,
    DEFAULT_THIRD_PARTY_TURNOUT: 0.7,
    DEFAULT_BASE_TURNOUT_RATE: 0.66,
    MAX_TURNOUT_MULTIPLIER: 1.3,
    COUNTY_BASELINE_SOURCE_FILES: [
        // Prioritize the actual file existing in the codebase
        'counties/countypres_2012-2024.csv',
        'counties/2012-2024results.csv',
        'counties/2012_2024results.csv',
        'counties/2012-2024_results.csv'
    ],
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
    
    // Voter roll data: maps FIPS code to active/inactive voter counts
    voterRollData: {},
    
    // Normalize FIPS code by ensuring it's a 5-digit string with leading zeros
    // Ensures consistent FIPS format (e.g., "04013", "01001")
    normalizeFips: function(fips) {
        if (!fips) return fips;
        // Convert to string and pad to 5 digits with leading zeros
        return String(fips).padStart(5, '0');
    },

    formatCountyDisplayName: function(name) {
        if (!name || typeof name !== 'string') return name;
        var trimmed = name.trim();
        if (/^City of /i.test(trimmed)) return trimmed;
        if (/ city$/i.test(trimmed)) {
            return 'City of ' + trimmed.replace(/ city$/i, '');
        }
        return trimmed;
    },
    
    // Normalize vote shares to ensure they sum to 100%
    // This ensures that vote percentages always total to 100% regardless of party composition
    normalizeCountyVotes: function(county) {
        if (!county || !county.v) return;
        
        var parties = this.getPartyVoteKeys();
        var total = 0;
        
        // Sum all party vote shares
        for (var i = 0; i < parties.length; i++) {
            var party = parties[i];
            county.v[party] = Math.max(0, county.v[party] || 0);
            total += county.v[party];
        }
        
        // If total is 0 or very small, set to 50-50 D-R split
        if (total <= 0 || !isFinite(total)) {
            county.v.D = 50;
            county.v.R = 50;
            county.v.G = 0;
            county.v.L = 0;
            county.v.PSL = 0;
            county.v.I = 0;
            return;
        }
        // Normalize to 100%
        if (total !== 100) {
            var scale = 100 / total;
            for (var j = 0; j < parties.length; j++) {
                var p = parties[j];
                county.v[p] = county.v[p] * scale;
            }
        }
        
        // JACKSON COUNTY MO DATA PATCH
        // The raw data for 29095 shows narrow MO margins, but KS City gives D+20
        if (county.s === 'MO' && county.n === 'Jackson County') {
            county.v.D = 60.0;
            county.v.R = 40.0;
            county.v.G = 0;
            county.v.L = 0;
            county.v.I = 0;
            county.v.PSL = 0;
        }
    },

    /**
     * @param {Object} voteShares Party vote shares keyed by party code.
     * @param {string} partyKey Target party code to adjust.
     * @param {number} shift Percentage-point change; positive adds support, negative removes it.
     * @returns {Object} The same voteShares object, modified in place.
     */
    applyVoteShareShift: function(voteShares, partyKey, shift) {
        if (!voteShares || !partyKey || !isFinite(shift) || shift === 0) return voteShares;

        var parties = this.getPartyVoteKeys();
        if (parties.indexOf(partyKey) === -1) return voteShares;

        var targetBefore = Math.max(0, voteShares[partyKey] || 0);
        var totalBefore = 0;
        for (var i = 0; i < parties.length; i++) {
            totalBefore += Math.max(0, voteShares[parties[i]] || 0);
        }
        if (totalBefore <= 0) return voteShares;

        if (shift > 0) {
            var otherTotal = 0;
            for (var j = 0; j < parties.length; j++) {
                if (parties[j] !== partyKey) {
                    otherTotal += Math.max(0, voteShares[parties[j]] || 0);
                }
            }
            var actualGain = Math.min(shift, Math.max(0, 100 - targetBefore), otherTotal);
            if (actualGain <= 0) return voteShares;

            voteShares[partyKey] = targetBefore + actualGain;
            if (otherTotal > 0) {
                for (var k = 0; k < parties.length; k++) {
                    var otherParty = parties[k];
                    if (otherParty === partyKey) continue;
                    var otherValue = Math.max(0, voteShares[otherParty] || 0);
                    var loss = actualGain * (otherValue / otherTotal);
                    voteShares[otherParty] = Math.max(0, otherValue - loss);
                }
            }
        } else {
            var lossAmount = Math.min(-shift, targetBefore);
            if (lossAmount <= 0) return voteShares;

            var remainingAfterLoss = Math.max(0, targetBefore - lossAmount);
            var recipientTotal = 0;
            for (var m = 0; m < parties.length; m++) {
                if (parties[m] !== partyKey) {
                    recipientTotal += Math.max(0, voteShares[parties[m]] || 0);
                }
            }

            voteShares[partyKey] = remainingAfterLoss;
            if (recipientTotal > 0) {
                for (var n = 0; n < parties.length; n++) {
                    var recipientParty = parties[n];
                    if (recipientParty === partyKey) continue;
                    var recipientValue = Math.max(0, voteShares[recipientParty] || 0);
                    var gain = lossAmount * (recipientValue / recipientTotal);
                    voteShares[recipientParty] = Math.min(100, recipientValue + gain);
                }
            }
        }

        this.normalizeVoteShareMap(voteShares);
        return voteShares;
    },

    parseCsvLine: function(line) {
        var parts = [];
        var current = '';
        var inQuotes = false;
        for (var i = 0; i < line.length; i++) {
            var ch = line.charAt(i);
            if (ch === '"') {
                if (inQuotes && line.charAt(i + 1) === '"') {
                    current += '"';
                    i++;
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (ch === ',' && !inQuotes) {
                parts.push(current);
                current = '';
            } else {
                current += ch;
            }
        }
        parts.push(current);
        return parts;
    },

    // Load voter roll data from national_active_inactive_by_county.csv
    loadVoterRollData: function(csvText) {
        if (!csvText) return 0;
        var lines = csvText.split(/\r?\n/);
        if (!lines.length) return 0;

        // Find header row
        var headerIndex = -1;
        for (var hi = 0; hi < lines.length; hi++) {
            var probe = (lines[hi] || '').toLowerCase();
            if (probe.indexOf('countyfp') !== -1 && probe.indexOf('active_reg_count') !== -1) {
                headerIndex = hi;
                break;
            }
        }
        if (headerIndex < 0) return 0;

        var headerParts = this.parseCsvLine(lines[headerIndex]);
        var colMap = {};
        for (var h = 0; h < headerParts.length; h++) {
            colMap[(headerParts[h] || '').trim().toLowerCase()] = h;
        }

        var countyFpCol = colMap.countyfp;
        var stateCol = colMap.state;
        var activeCol = colMap.active_reg_count;
        var inactiveCol = colMap.inactive_reg_count;
        var totalCol = colMap.total_reg_count;

        if (countyFpCol === undefined || stateCol === undefined || activeCol === undefined) {
            return 0;
        }

        var loaded = 0;
        for (var i = headerIndex + 1; i < lines.length; i++) {
            var line = (lines[i] || '').trim();
            if (!line) continue;
            var parts = this.parseCsvLine(line);
            
            var state = (parts[stateCol] || '').trim().toUpperCase();
            var countyFp = (parts[countyFpCol] || '').trim();
            var activeCount = parseInt(parts[activeCol], 10);
            var inactiveCount = parseInt(parts[inactiveCol], 10);
            var totalCount = parseInt(parts[totalCol], 10);

            // Get state FIPS from state code (keys are the abbreviations)
            var stateFips = null;
            if (STATES && STATES[state] && STATES[state].fips) {
                stateFips = STATES[state].fips;
            }
            if (!stateFips) continue;

            // Build full FIPS code
            var fullFips = stateFips + (countyFp || '').padStart(3, '0');
            fullFips = this.normalizeFips(fullFips);
            
            if (!isFinite(activeCount) || activeCount < 0) continue;
            if (!isFinite(inactiveCount) || inactiveCount < 0) inactiveCount = 0;

            this.voterRollData[fullFips] = {
                active: activeCount,
                inactive: inactiveCount,
                total: isFinite(totalCount) && totalCount > 0 ? totalCount : (activeCount + inactiveCount)
            };
            loaded++;
        }

        return loaded;
    },

    applyCountyVoteBaselineFromRecentCycles: function(csvText, sourceName) {
        if (!csvText) return 0;
        var lines = csvText.split(/\r?\n/);
        if (!lines.length) return 0;

        var headerIndex = -1;
        for (var hi = 0; hi < lines.length; hi++) {
            var probe = (lines[hi] || '').toLowerCase();
            if (probe.indexOf('county_fips') !== -1 && probe.indexOf('party') !== -1) {
                headerIndex = hi;
                break;
            }
        }
        if (headerIndex < 0) return 0;

        var headerParts = this.parseCsvLine(lines[headerIndex]);
        var colMap = {};
        for (var h = 0; h < headerParts.length; h++) {
            colMap[(headerParts[h] || '').trim().toLowerCase()] = h;
        }

        var yearCol = colMap.year;
        var fipsCol = colMap.county_fips;
        var partyCol = colMap.party;
        var votesCol = colMap.candidatevotes;
        var totalCol = colMap.totalvotes;
        if (yearCol === undefined || fipsCol === undefined || partyCol === undefined || votesCol === undefined || totalCol === undefined) {
            return 0;
        }

        var wantedYears = { 2020: true, 2024: true };
        var rawRows = {};
        
        var candidateCol = colMap.candidate;
        var modeCol = colMap.mode;

        for (var i = headerIndex + 1; i < lines.length; i++) {
            var line = (lines[i] || '').trim();
            if (!line) continue;
            var parts = this.parseCsvLine(line);
            var year = parseInt(parts[yearCol], 10);
            if (!wantedYears[year]) continue;

            var fips = this.normalizeFips(parts[fipsCol]);
            if (!fips) continue;

            var party = (parts[partyCol] || '').trim().toUpperCase();
            var candidate = candidateCol !== undefined ? (parts[candidateCol] || '').trim().toUpperCase() : '';
            var mode = modeCol !== undefined ? (parts[modeCol] || '').trim().toUpperCase() : '';

            // Ignore header, total, and blank party rows
            if (!party || candidate === 'TOTAL VOTES CAST' || candidate.indexOf('TOTAL') !== -1) {
                continue;
            }

            var votes = parseFloat(parts[votesCol]);
            var totalVotes = parseFloat(parts[totalCol]);
            if (!isFinite(votes) || votes < 0) continue;

            if (!rawRows[fips]) rawRows[fips] = {};
            if (!rawRows[fips][year]) rawRows[fips][year] = [];
            rawRows[fips][year].push({
                party: party,
                votes: votes,
                totalVotes: totalVotes,
                mode: mode
            });
        }

        var byCountyYear = {};
        for (var fips in rawRows) {
            byCountyYear[fips] = {};
            for (var year in rawRows[fips]) {
                var rows = rawRows[fips][year];
                
                // Detect if there's any row with mode === 'TOTAL'
                var hasTotalMode = false;
                for (var r = 0; r < rows.length; r++) {
                    if (rows[r].mode === 'TOTAL') {
                        hasTotalMode = true;
                        break;
                    }
                }

                var filteredRows = [];
                for (var r = 0; r < rows.length; r++) {
                    if (hasTotalMode) {
                        if (rows[r].mode === 'TOTAL') {
                            filteredRows.push(rows[r]);
                        }
                    } else {
                        filteredRows.push(rows[r]);
                    }
                }

                var rec = { D: 0, R: 0, L: 0, O: 0, total: 0 };
                for (var r = 0; r < filteredRows.length; r++) {
                    var row = filteredRows[r];
                    if (row.party === 'DEMOCRAT') rec.D += row.votes;
                    else if (row.party === 'REPUBLICAN') rec.R += row.votes;
                    else if (row.party === 'LIBERTARIAN') rec.L += row.votes;
                    else rec.O += row.votes;

                    if (isFinite(row.totalVotes) && row.totalVotes > rec.total) {
                        rec.total = row.totalVotes;
                    }
                }
                byCountyYear[fips][year] = rec;
            }
        }

        var applied = 0;
        for (var countyFips in this.countyData) {
            if (!this.countyData.hasOwnProperty(countyFips)) continue;
            var normalized = this.normalizeFips(countyFips);
            var county = this.countyData[countyFips];
            var cycleData = byCountyYear[normalized];
            if (!county || !cycleData) continue;

            var yearsUsed = 0;
            var sum = { D: 0, R: 0, L: 0, O: 0, total: 0 };
            var cycles = [2020, 2024];
            for (var y = 0; y < cycles.length; y++) {
                var cycle = cycleData[cycles[y]];
                if (!cycle) continue;
                yearsUsed++;
                sum.D += cycle.D;
                sum.R += cycle.R;
                sum.L += cycle.L;
                sum.O += cycle.O;
                var cycleTotal = Math.max(cycle.total || 0, cycle.D + cycle.R + cycle.L + cycle.O);
                sum.total += cycleTotal;
            }
            if (yearsUsed <= 0) continue;

            var avg = {
                D: sum.D / yearsUsed,
                R: sum.R / yearsUsed,
                L: sum.L / yearsUsed,
                O: sum.O / yearsUsed,
                total: sum.total / yearsUsed
            };
            var shareTotal = avg.D + avg.R + avg.L + avg.O;
            if (!isFinite(shareTotal) || shareTotal <= 0) continue;

            county.v.D = (avg.D / shareTotal) * 100;
            county.v.R = (avg.R / shareTotal) * 100;
            county.v.L = (avg.L / shareTotal) * 100;
            county.v.O = (avg.O / shareTotal) * 100;
            county.v.G = 0;
            county.v.F = 0;
            var baseTurnout = this.getBaseTurnoutRate(county) || 0.60;
            county.regVoters = Math.max(1, Math.round(avg.total / baseTurnout));
            // Removed override: county.turnoutBase is kept from CSV or default JSON
            county.baselineVoteTotals = {
                D: avg.D,
                R: avg.R,
                L: avg.L,
                O: avg.O,
                total: avg.total,
                yearsUsed: yearsUsed,
                source: sourceName || ''
            };
            applied++;
        }

        return applied;
    },

    loadCountyVoteBaselineData: function(callback) {
        var self = this;
        var files = this.COUNTY_BASELINE_SOURCE_FILES.slice();
        var idx = 0;

        function finish(meta) {
            if (callback) callback(meta || null);
        }

        function tryNext() {
            if (idx >= files.length) {
                finish(null);
                return;
            }
            var file = files[idx++];
            var xhr = new XMLHttpRequest();
            xhr.open('GET', file, true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState !== 4) return;
                if (xhr.status === 200) {
                    var applied = self.applyCountyVoteBaselineFromRecentCycles(xhr.responseText, file);
                    if (applied > 0) {
                        console.log('✓ County baseline loaded from ' + file + ' (' + applied + ' counties updated)');
                        finish({ file: file, applied: applied });
                    } else {
                        tryNext();
                    }
                } else {
                    tryNext();
                }
            };
            xhr.send();
        }

        tryNext();
    },

    loadTurnoutData: function(callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'counties/Turnout by US County (2012-2020).csv', true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    Counties.parseTurnoutCsv(xhr.responseText);
                    console.log('✓ Turnout data loaded from CSV');
                } else {
                    console.warn('Could not load Turnout by US County (2012-2020).csv');
                }
                if (callback) callback();
            }
        };
        xhr.send();
    },

    parseTurnoutCsv: function(csvText) {
        var lines = csvText.split(/\r?\n/);
        var turnoutSum = {};
        var turnoutCount = {};
        
        for (var i = 2; i < lines.length; i++) { // Skip title line 1 and header line 2
            var line = (lines[i] || '').trim();
            if (!line) continue;
            var parts = Counties.parseCsvLine(line);
            if (parts.length < 4) continue;
            
            var fips = Counties.normalizeFips(parts[0].trim());
            var pct = parseFloat(parts[3]);
            if (!isNaN(pct) && isFinite(pct)) {
                if (!turnoutSum[fips]) {
                    turnoutSum[fips] = 0;
                    turnoutCount[fips] = 0;
                }
                turnoutSum[fips] += pct;
                turnoutCount[fips]++;
            }
        }
        
        for (var fips in Counties.countyData) {
            if (turnoutSum[fips] && turnoutCount[fips] > 0) {
                Counties.countyData[fips].turnoutBase = turnoutSum[fips] / turnoutCount[fips];
            }
        }
    },
    
    // Load county data from JSON
    loadCountyData: function(callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'counties/county_data.json', true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                Counties.countyData = JSON.parse(xhr.responseText);

                Counties.loadCountyVoteBaselineData(function() {
                    // Load voter roll data (active/inactive counts)
                    var voterRollXhr = new XMLHttpRequest();
                    voterRollXhr.open('GET', 'counties/national_active_inactive_by_county.csv', true);
                    voterRollXhr.onreadystatechange = function() {
                        if (voterRollXhr.readyState === 4) {
                            if (voterRollXhr.status === 200) {
                                var voterRollLoaded = Counties.loadVoterRollData(voterRollXhr.responseText);
                                console.log('✓ Voter roll data loaded: ' + voterRollLoaded + ' counties');
                            } else {
                                console.warn('Could not load voter roll data');
                            }
                            Counties.loadTurnoutData(function() {
                                if (typeof MediaMarkets !== 'undefined') {
                                    MediaMarkets.load(finishLoadingCountyData);
                                } else {
                                    finishLoadingCountyData();
                                }
                            });
                        }
                    };
                    voterRollXhr.send();
                    
                    function finishLoadingCountyData() {
                        // Initialize each county with undecided voters and proper baseline
                        for (var fips in Counties.countyData) {
                            var c = Counties.countyData[fips];
                            c.n = Counties.formatCountyDisplayName(c.n);

                            // Store original values for reference
                            // Map county JSON's 'O' key to 'I' (Independent), 'F' to 'PSL' (Party for Socialism and Liberation)
                            c.v.I = c.v.O || 0;
                            c.v.PSL = c.v.F || 0;
                            
                            // Normalize votes to ensure they sum to 100%
                            Counties.normalizeCountyVotes(c);
                            
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
                            c.turnoutBase = (typeof c.turnoutBase === 'number' && isFinite(c.turnoutBase) && c.turnoutBase > 0)
                                ? Math.max(0, Math.min(1, c.turnoutBase))
                                : Counties.DEFAULT_BASE_TURNOUT_RATE;
                            
                            // Derive registered voters from baselineVoteTotals and turnoutBase to ensure total votes cast are correct
                            var baseVotes = c.baselineVoteTotals ? c.baselineVoteTotals.total : (c.p * 0.4);
                            c.regVoters = Math.round(baseVotes / c.turnoutBase);

                            // Cache state code to avoid repeated FIPS parsing in tooltips
                            var normalizedFips = Counties.normalizeFips(fips);
                            if (normalizedFips) {
                                c.stateCode = Counties.getStateCodeFromFips(normalizedFips.substring(0, 2));
                                c.fips = normalizedFips;  // Store normalized FIPS for voter roll lookups and consistency
                            }

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
                });
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

    getCountyRegisteredVoters: function(county) {
        if (!county) return 0;
        
        // Prioritize derived regVoters count to keep vote totals accurate to the baseline
        if (typeof county.regVoters === 'number' && isFinite(county.regVoters) && county.regVoters > 0) {
            return county.regVoters;
        }

        // Try to get active voter count from voter roll data second
        if (county.fips) {
            var fips = this.normalizeFips(county.fips);
            if (this.voterRollData[fips] && this.voterRollData[fips].active > 0) {
                return this.voterRollData[fips].active;
            }
        }
        
        return county.p || 0;
    },
    
    // Get inactive voter count for a county
    getCountyInactiveVoters: function(county) {
        if (!county) return 0;
        if (county.fips) {
            var fips = this.normalizeFips(county.fips);
            if (this.voterRollData[fips] && this.voterRollData[fips].inactive > 0) {
                return this.voterRollData[fips].inactive;
            }
        }
        return 0;
    },
    
    // Get total registered voters for a county (active + inactive)
    getCountyTotalRegisteredVoters: function(county) {
        return this.getCountyRegisteredVoters(county) + this.getCountyInactiveVoters(county);
    },

    getBaseTurnoutRate: function(county) {
        if (typeof Election !== 'undefined' && typeof Election.getCountyTurnoutRate === 'function') {
            return Election.getCountyTurnoutRate(county);
        }
        if (county && typeof county.turnoutBase === 'number' && isFinite(county.turnoutBase)) {
            return Math.max(0, Math.min(1, county.turnoutBase));
        }
        return this.DEFAULT_BASE_TURNOUT_RATE;
    },

    getCountyTurnoutRateForMode: function(county, mode) {
        if (typeof Election === 'undefined') return this.getBaseTurnoutRate(county);
        if (mode === 'playerTurnout' && typeof Election.getCountyTurnoutRateForParty === 'function') {
            var playerParty = gameData.selectedParty || 'D';
            return Election.getCountyTurnoutRateForParty(county, playerParty);
        }
        if (mode === 'opponentTurnout' && typeof Election.getCountyTurnoutRateForParty === 'function') {
            var opponentParty = gameData.selectedParty === 'D' ? 'R' : 'D';
            return Election.getCountyTurnoutRateForParty(county, opponentParty);
        }
        if (typeof Election.getCountyTurnoutRate === 'function') {
            return Election.getCountyTurnoutRate(county);
        }
        return 0;
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
            var liveGroup = (gameData.liveGroups && gameData.liveGroups[groupId]) ? gameData.liveGroups[groupId] : INTEREST_GROUPS[groupId];
            var baseSupport = liveGroup.support;
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
        } else {
            var activeParties = {};
            if (typeof Utils !== 'undefined' && Utils.getActiveCandidates) {
                var active = Utils.getActiveCandidates();
                for (var k = 0; k < active.length; k++) {
                    activeParties[active[k].party] = true;
                }
                if (!activeParties['G']) support.G = 0;
                if (!activeParties['L']) support.L = 0;
                if (!activeParties['PSL']) support.PSL = 0;
                if (!activeParties['I']) support.I = 0;
            }
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
        var activeCandidates = (typeof _buildActiveCandidatesList === 'function') ? _buildActiveCandidatesList() : [];
        var candidateById = (typeof _buildCandidateByIdMap === 'function') ? _buildCandidateByIdMap() : {};

        var voterPool = 0;
        if (typeof Election !== 'undefined' && typeof Election.getCountyVoterPool === 'function') {
            voterPool = Election.getCountyVoterPool(county, reportingFactor, decidedMultiplier, errorFactor);
        } else {
            var baseTurnout = this.getBaseTurnoutRate(county);
            var registered = this.getCountyRegisteredVoters(county);
            voterPool = registered * baseTurnout * decidedMultiplier * reportingFactor * errorFactor;
            var cap = registered * Math.max(0, Math.min(1, reportingFactor || 1));
            if (cap > 0) {
                voterPool = Math.min(voterPool, cap);
            }
        }
        if (voterPool <= 0) {
            return { D: 0, R: 0, G: 0, L: 0, PSL: 0, I: 0 };
        }

        var groupWeights = this.getCountyDemographicWeights(county);
        var turnoutMultipliers = this.getPartyTurnoutMultipliers(county);
        var totals = { D: 0, R: 0, G: 0, L: 0, PSL: 0, I: 0 };
        var totalWeight = 0;
        var adjustedGroupTurnouts = {};

        for (var i = 0; i < groupWeights.length; i++) {
            var groupId = groupWeights[i].id;
            var share = groupWeights[i].share;
            var groupTurnout = (gameData.interestGroupTurnout && gameData.interestGroupTurnout[groupId] !== undefined)
                ? gameData.interestGroupTurnout[groupId] : 1.0;
            // v2 Bug Fix #1: Removed _getCandidateGroupEffectValue call here.
            // Group modifiers are now applied solely in recomputeInterestGroupSupport().
            groupTurnout = Math.max(0, Math.min(1, groupTurnout));
            adjustedGroupTurnouts[groupId] = groupTurnout;
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
            var turnoutIndex = adjustedGroupTurnouts[groupId];
            if (turnoutIndex === undefined) {
                turnoutIndex = (gameData.interestGroupTurnout && gameData.interestGroupTurnout[groupId] !== undefined)
                    ? gameData.interestGroupTurnout[groupId] : 1.0;
            }
            // turnoutIndex is already on the 0-1 scale, so use it directly for the county group weight.
            var groupWeight = groupShare * turnoutIndex;
            if (groupWeight <= 0) continue;

            var groupPool = voterPool * (groupWeight / totalWeight);
            var support = this.getGroupSupportByParty(groupId, county);
            // v2 Bug Fix #1: Removed _getCandidateGroupEffectValue support shift call.
            // Group support modifiers are now applied solely in recomputeInterestGroupSupport().
            var supportWeights = {};
            var supportTotal = 0;
            for (var partyKey in support) {
                var weight = (support[partyKey] || 0) * (turnoutMultipliers[partyKey] || 1.0);
                supportWeights[partyKey] = weight;
                supportTotal += weight;
            }

            if (supportTotal <= 0) continue;

            for (var p in totals) {
                totals[p] += groupPool * ((supportWeights[p] || 0) / supportTotal);
            }
        }

        if (typeof THIRD_PARTY_BALLOT_ACCESS !== 'undefined' && county.s) {
            var tpKeys = ['G', 'L', 'I', 'PSL'];
            for (var k = 0; k < tpKeys.length; k++) {
                var tp = tpKeys[k];
                if (THIRD_PARTY_BALLOT_ACCESS[tp] && THIRD_PARTY_BALLOT_ACCESS[tp].indexOf(county.s) === -1) {
                    totals[tp] = 0; // Not on ballot in this state
                }
            }
        }

        return totals;
    },

    getCountyDemographicBoost: function(candidate, county) {
        if (!candidate || !county || !county.ig) return 1.0;
        
        var bonus = 1.0;
        for (var group in county.ig) {
            var pct = county.ig[group] / 100;
            var effectValue = 0;
            
            // Safe retrieval of candidate group effect (checks groupEffects, groupBoosts, and groupDebuffs)
            if (candidate.groupEffects && typeof candidate.groupEffects === 'object') {
                var effect = candidate.groupEffects[group];
                if (effect) {
                    effectValue = Number(effect.support) || 0;
                }
            } else {
                var boostVal = (candidate.groupBoosts && candidate.groupBoosts[group]) || 0;
                var debuffVal = (candidate.groupDebuffs && candidate.groupDebuffs[group]) || 0;
                effectValue = boostVal + debuffVal;
            }
            
            bonus += (effectValue / 10) * pct;
        }
        
        return Math.max(0.1, bonus);
    },
    
    applyRallySpillover: function(targetCountyID, multiplier) {
        var targetFips = this.normalizeFips(targetCountyID);
        var targetCounty = this.countyData[targetFips];
        if (!targetCounty) return null;
        
        if (!this.hasRallyDistanceRatios()) {
            this.initializeRallyDistanceRatios();
        }
        if (!this.hasRallyDistanceRatios()) return null;
        
        var targetCentroid = this.getCountyCentroid(targetFips);
        if (!targetCentroid) return null;
        
        var baseBoost = ((typeof PERSUASION_CONSTANTS !== 'undefined' && typeof PERSUASION_CONSTANTS.RALLY_TURNOUT_BOOST === 'number')
            ? PERSUASION_CONSTANTS.RALLY_TURNOUT_BOOST
            : 0.05) * (multiplier || 1.0);
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
            
            // Apply faction-based attendance bonus
            var factionBonus = 1.0;
            if (typeof getFactionCompatibility === 'function' && typeof gameData !== 'undefined' && gameData.candidate && gameData.candidate.factionId && county.ig) {
                var weightedCompat = 0;
                var totalWeight = 0;
                for (var group in county.ig) {
                    var pct = county.ig[group];
                    weightedCompat += getFactionCompatibility(gameData.candidate.factionId, group) * pct;
                    totalWeight += pct;
                }
                if (totalWeight > 0) factionBonus = weightedCompat / totalWeight;
            }

            // Apply candidate demographic boost/debuff scaling
            var candidateDemoBonus = 1.0;
            if (typeof gameData !== 'undefined' && gameData.candidate) {
                candidateDemoBonus = this.getCountyDemographicBoost(gameData.candidate, county);
            }

            var provisionalBoost = baseBoost * decay * factionBonus * candidateDemoBonus;
            var rawTurnout = this.getCountyRegisteredVoters(county) * provisionalBoost;
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

    applyOpponentRallySpillover: function(targetCountyID, party) {
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

            if (stateFips === this.HAWAII_STATE_FIPS) continue;

            var centroid = this.getCountyCentroid(normalizedFips);
            if (!centroid) continue;

            var milesPerPixel = this.getMilesPerPixelRatio(stateFips);
            if (!milesPerPixel) continue;

            var pixelDistance = this.getPixelDistance(targetCentroid, centroid);
            var distanceMiles = pixelDistance * milesPerPixel;
            if (distanceMiles > this.RALLY_RADIUS_MILES) continue;

            var decay = Math.max(0, 1 - (distanceMiles / this.RALLY_RADIUS_MILES));
            
            // Apply faction-based attendance bonus for opponent
            var factionBonus = 1.0;
            var oppCand = null;
            if (typeof getFactionCompatibility === 'function' && typeof gameData !== 'undefined' && typeof Utils !== 'undefined' && county.ig) {
                var oppCandId = (party === 'D' && gameData.demTicket) ? gameData.demTicket.pres.id : ((party === 'R' && gameData.repTicket) ? gameData.repTicket.pres.id : null);
                oppCand = oppCandId ? Utils.getCandidateById(oppCandId) : null;
                if (oppCand && oppCand.factionId) {
                    var weightedCompat = 0;
                    var totalWeight = 0;
                    for (var group in county.ig) {
                        var pct = county.ig[group];
                        weightedCompat += getFactionCompatibility(oppCand.factionId, group) * pct;
                        totalWeight += pct;
                    }
                    if (totalWeight > 0) factionBonus = weightedCompat / totalWeight;
                }
            }

            // Apply candidate demographic boost/debuff scaling
            var candidateDemoBonus = this.getCountyDemographicBoost(oppCand, county);

            var provisionalBoost = baseBoost * decay * factionBonus * candidateDemoBonus;
            var rawTurnout = this.getCountyRegisteredVoters(county) * provisionalBoost;
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
        var turnoutKey = party === 'D' ? 'demOpponent' : (party === 'R' ? 'repOpponent' : 'thirdParty');
        var defaultTurnout = party === 'D' || party === 'R' ? this.DEFAULT_MAJOR_PARTY_TURNOUT : this.DEFAULT_THIRD_PARTY_TURNOUT;

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

            countyEntry.turnout[turnoutKey] = Math.min(
                this.MAX_TURNOUT_MULTIPLIER,
                (countyEntry.turnout[turnoutKey] || defaultTurnout) + scaledBoost
            );

            var stateCode = this.getStateCodeFromFips(entry.stateFips);
            if (stateCode) affectedStates[stateCode] = true;
        }

        return {
            countyCount: candidates.length,
            totalRawTurnout: totalRawTurnout,
            totalAppliedRawTurnout: totalAppliedRawTurnout,
            scaleFactor: scaleFactor,
            affectedStates: affectedStates
        };
    },

    applyOpponentAdSpillover: function(targetCountyID, party) {
        var targetFips = this.normalizeFips(targetCountyID);
        var targetCounty = this.countyData[targetFips];
        if (!targetCounty) return null;

        if (!this.hasRallyDistanceRatios()) {
            this.initializeRallyDistanceRatios();
        }
        if (!this.hasRallyDistanceRatios()) return null;

        var targetCentroid = this.getCountyCentroid(targetFips);
        if (!targetCentroid) return null;

        var radiusMiles = Math.max(90, this.RALLY_RADIUS_MILES * 1.4);
        var baseBoost = (typeof PERSUASION_CONSTANTS !== 'undefined' && typeof PERSUASION_CONSTANTS.AD_TURNOUT_BOOST === 'number')
            ? PERSUASION_CONSTANTS.AD_TURNOUT_BOOST * 1.4
            : 0.007;
        var cap = this.MAX_RALLY_ATTENDANCE * 0.55;
        var candidates = [];
        var totalRawTurnout = 0;

        for (var fips in this.countyData) {
            var county = this.countyData[fips];
            var normalizedFips = this.normalizeFips(fips);
            var stateFips = normalizedFips.substring(0, 2);
            if (stateFips === this.HAWAII_STATE_FIPS) continue;

            var centroid = this.getCountyCentroid(normalizedFips);
            if (!centroid) continue;
            var milesPerPixel = this.getMilesPerPixelRatio(stateFips);
            if (!milesPerPixel) continue;
            var distanceMiles = this.getPixelDistance(targetCentroid, centroid) * milesPerPixel;
            if (distanceMiles > radiusMiles) continue;

            var decay = Math.max(0, 1 - (distanceMiles / radiusMiles));
            var provisionalBoost = baseBoost * decay;
            var rawTurnout = this.getCountyRegisteredVoters(county) * provisionalBoost;
            if (rawTurnout <= 0) continue;
            candidates.push({ stateFips: stateFips, county: county, provisionalBoost: provisionalBoost, rawTurnout: rawTurnout });
            totalRawTurnout += rawTurnout;
        }

        var scaleFactor = totalRawTurnout > cap ? cap / totalRawTurnout : 1;
        var turnoutKey = party === 'D' ? 'demOpponent' : (party === 'R' ? 'repOpponent' : 'thirdParty');
        var defaultTurnout = party === 'D' || party === 'R' ? this.DEFAULT_MAJOR_PARTY_TURNOUT : this.DEFAULT_THIRD_PARTY_TURNOUT;
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
            countyEntry.turnout[turnoutKey] = Math.min(
                this.MAX_TURNOUT_MULTIPLIER,
                (countyEntry.turnout[turnoutKey] || defaultTurnout) + scaledBoost
            );
            var stateCode = this.getStateCodeFromFips(entry.stateFips);
            if (stateCode) affectedStates[stateCode] = true;
        }

        return {
            countyCount: candidates.length,
            totalRawTurnout: totalRawTurnout,
            scaleFactor: scaleFactor,
            affectedStates: affectedStates
        };
    },
    
    // Apply third-party toggle - redistribute or include third-party votes
    applyThirdPartyToggle: function(county) {
        if (!county.v || !county.originalV) return;
        
        var thirdPartiesEnabled = gameData.thirdPartiesEnabled;
        
        if (thirdPartiesEnabled) {
            // Use original third-party percentages
            county.v.G = county.originalV.G || 0;
            county.v.L = county.originalV.L || 0;
            county.v.I = county.originalV.I || 0;
            county.v.PSL = county.originalV.PSL || 0;
        } else {
            // Do NOT split 50/50. Third parties are siphoners, so without them, 
            // the D and R base should just be scaled proportionally.
            county.v.G = 0;
            county.v.L = 0;
            county.v.I = 0;
            county.v.PSL = 0;
            // Restore D and R to their original pre-siphon values
            county.v.D = county.originalV.D || 0;
            county.v.R = county.originalV.R || 0;
        }
        
        // Always normalize votes to ensure they sum to 100% proportionally
        this.normalizeCountyVotes(county);
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
                                
                                (function(f, p) {
                                    p.onclick = function() { Counties.selectCounty(f); };
                                    p.onmouseenter = function(e) {
                                        if (window.isTvAdsMode && typeof MEDIA_MARKETS !== 'undefined') {
                                            var county = Counties.countyData[f];
                                            if (county && county.mediaMarket && MEDIA_MARKETS[county.mediaMarket]) {
                                                var market = MEDIA_MARKETS[county.mediaMarket];
                                                for (var ci = 0; ci < market.counties.length; ci++) {
                                                    var fipsId = 'c' + market.counties[ci];
                                                    var otherPath = svg.getElementById(fipsId);
                                                    if (otherPath) {
                                                        otherPath.style.filter = 'brightness(1.3)';
                                                        otherPath.style.stroke = '#ffd700';
                                                        otherPath.style.strokeWidth = '0.8px';
                                                    }
                                                }
                                            } else {
                                                p.style.filter = 'brightness(1.3)';
                                                p.style.stroke = '#ffd700';
                                                p.style.strokeWidth = '0.8px';
                                            }
                                        } else {
                                            p.style.filter = 'brightness(1.3)';
                                            p.style.stroke = '#ffd700';
                                            p.style.strokeWidth = '0.8px';
                                        }
                                    };
                                    p.onmousemove = function(e) { Counties.showCountyTooltip(e, f); };
                                    p.onmouseleave = function() { 
                                        var tooltip = document.getElementById('map-tooltip');
                                        if (tooltip) tooltip.style.display = 'none';
                                        
                                        if (window.isTvAdsMode && typeof MEDIA_MARKETS !== 'undefined') {
                                            var county = Counties.countyData[f];
                                            if (county && county.mediaMarket && MEDIA_MARKETS[county.mediaMarket]) {
                                                var market = MEDIA_MARKETS[county.mediaMarket];
                                                for (var ci = 0; ci < market.counties.length; ci++) {
                                                    var fipsId = 'c' + market.counties[ci];
                                                    var otherPath = svg.getElementById(fipsId);
                                                    if (otherPath) {
                                                        otherPath.style.filter = '';
                                                        otherPath.style.stroke = '#ffffff';
                                                        otherPath.style.strokeWidth = '0.3px';
                                                    }
                                                }
                                            } else {
                                                p.style.filter = '';
                                                p.style.stroke = '#ffffff';
                                                p.style.strokeWidth = '0.3px';
                                            }
                                        } else {
                                            p.style.filter = '';
                                            p.style.stroke = '#ffffff';
                                            p.style.strokeWidth = '0.3px';
                                        }
                                    };
                                })(fips, path);
                            } else {
                                path.style.display = 'none';
                            }
                        } else if (pathId && pathId !== 'counties' && pathId !== stateCode) {
                            // Hide non-county paths
                            path.style.display = 'none';
                        }
                    }
                    
                    var titleElements = svg.querySelectorAll('title');
                    for (var j = 0; j < titleElements.length; j++) {
                        if (titleElements[j].parentNode) {
                            titleElements[j].parentNode.removeChild(titleElements[j]);
                        }
                    }
                    
                    var self = this;
                    svg.onclick = function(e) {
                        if (e.target.tagName === 'svg') {
                            if (typeof Campaign !== 'undefined' && Campaign.clickState) {
                                Campaign.clickState(self.currentState);
                                if (Campaign.restoreStateActionGrid) {
                                    Campaign.restoreStateActionGrid();
                                }
                                gameData.inCountyView = false;
                                gameData.selectedCounty = null;
                            }
                        }
                    };

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
                        
                        if (typeof Campaign !== 'undefined' && Campaign.mapMode && Campaign.mapMode !== 'margin') {
                            path.style.fill = Counties.getCountyMapModeColor(county);
                        } else if (typeof Utils !== 'undefined' && Utils.getMarginColor) {
                            path.style.fill = Utils.getMarginColor(margin);
                        } else {
                            // Fallback coloring
                            if (Math.abs(margin) < 2) {
                                path.style.fill = '#808080';
                            } else if (margin > 0) {
                                path.style.fill = margin > 10 ? '#0055a6' : '#91d7fb';
                            } else {
                                path.style.fill = margin < -10 ? '#940c14' : '#ff8b7d';
                            }
                        }
                    }
                }
            }
        }
    },

    getMediaMarketMargin: function(marketId) {
        if (typeof MEDIA_MARKETS === 'undefined' || !MEDIA_MARKETS[marketId]) return 0;
        var market = MEDIA_MARKETS[marketId];
        var dVotes = 0;
        var rVotes = 0;
        for (var i = 0; i < market.counties.length; i++) {
            var fips = market.counties[i];
            var county = this.countyData[fips];
            if (county && county.v) {
                var weight = county.regVoters || county.p || 0;
                dVotes += (county.v.D || 0) * weight;
                rVotes += (county.v.R || 0) * weight;
            }
        }
        var total = dVotes + rVotes;
        if (total <= 0) return 0;
        return (dVotes - rVotes) / total;
    },

    getCountyMapModeColor: function(county) {
        var mode = (typeof Campaign !== 'undefined' && Campaign.mapMode) ? Campaign.mapMode : 'margin';
        if (mode === 'population' && typeof Campaign !== 'undefined') {
            return Campaign.getGoldScaleColor(Campaign.getCountyPopulationIndex(county.p || 0));
        }
        if (mode === 'mediaMarkets') {
            if (county.mediaMarket) {
                var marketId = county.mediaMarket;
                var sat = (gameData.ads && gameData.ads.tvSaturation && gameData.ads.tvSaturation[marketId]) || 0;
                if (sat <= 0) {
                    return '#808080'; // grey
                } else {
                    var margin = this.getMediaMarketMargin(marketId);
                    var dShare = 0.5 + (margin / 2);
                    var rShare = 1.0 - dShare;
                    var r = Math.round(232 * rShare + 0 * dShare);
                    var g = Math.round(27 * rShare + 174 * dShare);
                    var b = Math.round(35 * rShare + 243 * dShare);
                    return 'rgb(' + r + ',' + g + ',' + b + ')';
                }
            }
            return '#808080';
        }
        if (mode === 'turnout' || mode === 'playerTurnout' || mode === 'opponentTurnout') {
            var rate = this.getCountyTurnoutRateForMode(county, mode);
            if (typeof Campaign !== 'undefined' && typeof Campaign.getTurnoutRateIndex === 'function') {
                return Campaign.getGoldScaleColor(Campaign.getTurnoutRateIndex(rate));
            }
            return Campaign.getGoldScaleColor(Math.max(0, Math.min(1, (rate - 0.45) / 0.35)));
        }
        if (mode === 'favorability') return Campaign.getFavorabilityColor(Campaign.getFavorability());
        return '#2b2926';
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

        var spDistricts = document.getElementById('sp-districts');
        if (spDistricts) {
            spDistricts.innerHTML = '';
            spDistricts.classList.add('hidden');
        }
        
        var cvDistricts = document.getElementById('cv-districts');
        if (cvDistricts) {
            cvDistricts.innerHTML = '';
            cvDistricts.classList.add('hidden');
        }

        if (county.s === 'ME' || county.s === 'NE') {
            var rule = (typeof SPLIT_ELECTORAL_RULES !== 'undefined') ? SPLIT_ELECTORAL_RULES[county.s] : null;
            if (rule) {
                var paddedFips = (normalizedFips ? String(normalizedFips) : '').padStart(5, '0');
                var dhtml = '';
                var distsToShow = [];
                if (rule.splitCounties && rule.splitCounties[paddedFips]) {
                    var segments = rule.splitCounties[paddedFips];
                    for (var sIdx = 0; sIdx < segments.length; sIdx++) {
                        distsToShow.push(segments[sIdx].district);
                    }
                } else {
                    distsToShow.push((rule.countyDistrictMap && rule.countyDistrictMap[paddedFips]) || rule.defaultDistrict);
                }
                
                var split = this.calculateStateElectoralAllocation(county.s, { useReportedVotes: false });
                for (var d = 0; d < distsToShow.length; d++) {
                    var distName = distsToShow[d];
                    var marginColor = '#444';
                    if (split && split.districtResults) {
                        for (var r = 0; r < split.districtResults.length; r++) {
                            if (split.districtResults[r].district === distName) {
                                var dres = split.districtResults[r];
                                if (typeof Utils !== 'undefined' && Utils.getMarginColor) {
                                    var totalDistVotes = 0;
                                    for (var p in dres.votes) totalDistVotes += dres.votes[p];
                                    var demVotes = dres.votes['D'] || 0;
                                    var repVotes = dres.votes['R'] || 0;
                                    var marginPct = totalDistVotes > 0 ? ((demVotes - repVotes) / totalDistVotes) * 100 : 0;
                                    marginColor = Utils.getMarginColor(marginPct);
                                }
                                break;
                            }
                        }
                    }
                    dhtml += '<div class="district-box" style="background-color: ' + marginColor + '; cursor: pointer;" onclick="Counties.clickCountyDistrict(\'' + county.s + '\', \'' + distName + '\')">' + distName + '</div>';
                }
                if (dhtml && spDistricts) {
                    spDistricts.innerHTML = dhtml;
                    spDistricts.classList.remove('hidden');
                }
                
                var cvDistricts = document.getElementById('cv-districts');
                if (cvDistricts && dhtml) {
                    cvDistricts.innerHTML = dhtml;
                    cvDistricts.classList.remove('hidden');
                }
            }
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
            var turnoutRate = this.getCountyTurnoutRateForMode(county, 'turnout');
            var turnoutLabel = turnoutRate ? (turnoutRate * 100).toFixed(1) + '% of registered' : '—';
            var turnoutColor = turnoutRate >= 0.7 ? '#198754' : '#ccc';
            issuesList.innerHTML = '<div style="background: rgba(0,0,0,0.2); padding: 8px; margin-bottom: 10px; border-radius: 4px;"><strong>Turnout:</strong> <span style="color: ' + turnoutColor + '">' + turnoutLabel + '</span></div>';
            issuesList.innerHTML += '<div style="background: rgba(0,0,0,0.2); padding: 8px; border-radius: 4px;"><strong>Type:</strong> ' + Utils.getDisplayTier(county.t) + '</div>';
        }
        
        // Mark that we're in county view mode
        gameData.inCountyView = true;
        
        // Add county-specific action buttons
        var actionGrid = document.querySelector('.action-grid');
        if (actionGrid) {
            actionGrid.style.gridTemplateColumns = '1fr 1fr 1fr';
            var html = 
                '<button class="act-btn" onclick="app.closeCountyView()"><span><i class="fa-solid fa-map"></i></span><span>BACK TO MAP</span></button>' +
                '<button class="act-btn" id="btn-rally-county" onclick="app.countyRally()"><span><i class="fa-solid fa-bullhorn"></i></span><span>LOCAL RALLY</span></button>' +
                '<button class="act-btn" id="btn-tv-ads" onclick="app.toggleTvAdsMode()"><span><i class="fas fa-tv"></i></span><span>TV ADS</span></button>';
            
            // Surrogate Container (default visible)
            html += '<div id="surrogate-container" style="display: block; grid-column: 1 / -1;">';
            // Inject available surrogates
            if (typeof Endorsers !== 'undefined') {
                var availableSurrogates = [];
                var allEndorsers = Endorsers.db.national.concat(Endorsers.db.states[county.s] || []);
                for (var i = 0; i < allEndorsers.length; i++) {
                    var e = allEndorsers[i];
                    if (e.type === 'individual' && Endorsers.rallyCredits[e.id] > 0) {
                        availableSurrogates.push(e);
                    }
                }
                
                if (availableSurrogates.length > 0) {
                    html += '<div style="grid-column: 1 / -1; margin-top: 10px; background: rgba(0,0,0,0.3); border: 1px solid #555; padding: 10px; border-radius: 4px;">';
                    html += '<h4 style="margin: 0 0 10px 0; color: #ffaa00; font-size: 0.85rem;"><i class="fa-solid fa-user-group"></i> AVAILABLE SURROGATES</h4>';
                    for (var s = 0; s < availableSurrogates.length; s++) {
                        var e = availableSurrogates[s];
                        html += '<label style="display: block; font-size: 0.8rem; color: #ddd; margin-bottom: 5px; cursor: pointer;">';
                        html += '<input type="radio" name="surrogate_select" value="' + e.id + '" style="margin-right: 8px;"> ' + e.name + ' (' + Endorsers.rallyCredits[e.id] + ' credits)';
                        html += '</label>';
                    }
                    html += '<label style="display: block; font-size: 0.8rem; color: #888; cursor: pointer;">';
                    html += '<input type="radio" name="surrogate_select" value="" checked style="margin-right: 8px;"> No Surrogate';
                    html += '</label>';
                    html += '<div style="font-size: 0.75rem; color: #aaa; margin-top: 5px;">Using a surrogate grants a turnout multiplier but costs 1 credit.</div>';
                    html += '</div>';
                }
            }
            html += '</div>';

            // TV Ads Container (default hidden)
            html += '<div id="tv-ads-container" style="display: none; grid-column: 1 / -1; margin-top: 10px; background: rgba(0,0,0,0.3); border: 1px solid #555; padding: 10px; border-radius: 4px;">';
            html += '<h4 style="margin: 0 0 10px 0; color: #5bc0de; font-size: 0.85rem;"><i class="fas fa-tv"></i> RUN TV ADS: <br><span id="tv-ads-market" style="color: #fff; font-size: 0.75rem;"></span></h4>';
            html += '<div style="font-size: 0.75rem; color: #aaa; margin-bottom: 10px;">Select an ad type to run in this media market (Cost: 1 Energy)</div>';
            html += '<button class="act-btn" style="width: 100%; margin-bottom: 5px; font-size: 0.75rem; padding: 5px; justify-content: center;" onclick="app.runTvAd(\'bio\')">Biographical Ad</button>';
            html += '<button class="act-btn" style="width: 100%; margin-bottom: 5px; font-size: 0.75rem; padding: 5px; justify-content: center;" onclick="app.runTvAd(\'attack\')">Attack Ad</button>';
            
            html += '<div style="display: flex; gap: 5px; margin-bottom: 5px; margin-top: 10px;">';
            html += '<select id="tv-ad-issue" style="flex: 1; background: #333; color: #fff; border: 1px solid #555; font-size: 0.75rem; padding: 3px;" onchange="app.updateTvAdIssueScores()">';
            html += '<option value="">Select an Issue...</option>';
            if (typeof ISSUES !== 'undefined') {
                for (var j = 0; j < ISSUES.length; j++) {
                    html += '<option value="' + ISSUES[j].id + '">' + ISSUES[j].name + '</option>';
                }
            }
            html += '</select>';
            html += '<button class="act-btn" style="font-size: 0.75rem; padding: 5px 10px; justify-content: center;" onclick="app.runTvAd(\'issue\')">Issue Ad</button>';
            html += '</div>';
            html += '<div id="tv-ad-issue-scores" style="font-size: 0.7rem; color: #ffaa00; text-align: center;"></div>';
            html += '</div>';
            actionGrid.innerHTML = html;
            if (typeof app !== 'undefined' && app.renderTvAdsMode) {
                app.renderTvAdsMode();
            }
        }
        var adTile = document.querySelector('.ad-campaign-tile');
        if (adTile) {
            adTile.classList.add('hidden');
        }
    },
    
    clickCountyDistrict: function(stateCode, districtName) {
        var rule = (typeof SPLIT_ELECTORAL_RULES !== 'undefined') ? SPLIT_ELECTORAL_RULES[stateCode] : null;
        if (!rule) return;
        
        var countiesInDistrict = [];
        for (var fips in this.countyData) {
            var county = this.countyData[fips];
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
        
        var svg = document.getElementById('county-map-svg');
        if (svg) {
            var paths = svg.querySelectorAll('path');
            for (var p = 0; p < paths.length; p++) {
                var path = paths[p];
                var pathId = path.id;
                
                if (pathId && pathId.length >= 3 && pathId.charAt(0) === 'c') {
                    var f = pathId.substring(1);
                    var isMatch = countiesInDistrict.indexOf(f) !== -1;
                    
                    if (isMatch) {
                        path.style.opacity = '1.0';
                        path.style.stroke = '#fff';
                        path.style.strokeWidth = '0.5px';
                    } else {
                        path.style.opacity = '0.3';
                        path.style.stroke = 'none';
                    }
                }
            }
        }
        
        if (typeof Campaign !== 'undefined' && Campaign.clickDistrict) {
            Campaign.clickDistrict(stateCode, districtName);
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
        var rallyStateCode = this.getStateCodeFromFips(normalizedFips.substring(0, 2));
        if (typeof recordPlayerPressure === 'function' && rallyStateCode) {
            recordPlayerPressure(rallyStateCode, 'RALLY', 1);
        }
        
        var county = this.countyData[normalizedFips];
        
        // --- COOLDOWN LOGIC ---
        if (!gameData.rallyHistory) gameData.rallyHistory = {};
        if (!gameData.rallyHistory[normalizedFips]) gameData.rallyHistory[normalizedFips] = [];
        
        var currentTurn = gameData.turn || 0;
        gameData.rallyHistory[normalizedFips] = gameData.rallyHistory[normalizedFips].filter(function(t) { return currentTurn - t <= 2; });
        
        var recentRallies = gameData.rallyHistory[normalizedFips].length;
        var cooldownMultiplier = 1.0;
        if (recentRallies === 1) cooldownMultiplier = 0.70;
        if (recentRallies >= 2) cooldownMultiplier = 0.40;
        
        gameData.rallyHistory[normalizedFips].push(currentTurn);
        
        // --- SURROGATE BOOST LOGIC ---
        var surrogateBoost = 1.0;
        var surrogateUsedName = null;
        if (typeof Endorsers !== 'undefined' && Endorsers.getSurrogateBoost) {
            var selectedSurrogateRadio = document.querySelector('input[name="surrogate_select"]:checked');
            if (selectedSurrogateRadio && selectedSurrogateRadio.value) {
                var surrogateId = selectedSurrogateRadio.value;
                surrogateBoost = Endorsers.getSurrogateBoost(surrogateId);
                surrogateUsedName = Endorsers.getEndorserName(surrogateId);
                Endorsers.consumeSurrogateRally(surrogateId);
            }
        }
        
        var finalMultiplier = cooldownMultiplier * surrogateBoost;
        var spilloverResult = this.applyRallySpillover(normalizedFips, finalMultiplier);
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
        if (surrogateUsedName) {
            message = 'Surrogate Rally with ' + surrogateUsedName + ' in ' + countyName + '! ' + impactText + ', ' + turnoutText + '.';
        } else if (cooldownMultiplier < 1.0) {
            message += ' (Diminishing returns from recent rallies)';
        }
        
        Utils.addLog(message);
        Campaign.updateHUD();
        Campaign.colorMap();
        this.colorCountyMap();
        
        // Removed popup, logged above
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
        
        var pollByParty = (typeof Utils !== 'undefined' && Utils.getCountyPollingByParty) ? Utils.getCountyPollingByParty(county) : null;
        var mode = (typeof Campaign !== 'undefined' && Campaign.mapMode) ? Campaign.mapMode : 'margin';
        var detailLine = '';
        var subLine = '';
        var color = '#888';
        
        if (mode === 'margin') {
            var marginText = 'N/A';
            if (pollByParty) {
                var demPct = pollByParty.D || 0;
                var repPct = pollByParty.R || 0;
                var margin = demPct - repPct;
                marginText = (margin > 0 ? 'D+' : 'R+') + Math.abs(margin).toFixed(1);
                color = margin > 0 ? '#00AEF3' : '#E81B23';
            } else {
                var totals = this.calculateCountyVoteTotals(county, { reportingFactor: 1, decidedMultiplier: 1, errorFactor: 1 });
                var demVotes = totals.D || 0;
                var repVotes = totals.R || 0;
                var total = demVotes + repVotes;
                if (total > 0) {
                    var fallbackMargin = ((demVotes - repVotes) / total) * 100;
                    marginText = (fallbackMargin > 0 ? 'D+' : 'R+') + Math.abs(fallbackMargin).toFixed(1);
                    color = fallbackMargin > 0 ? '#00AEF3' : '#E81B23';
                }
            }
            detailLine = '<span class="tooltip-leader" style="color: ' + color + '">' + marginText + '</span>';
        } else if (mode === 'ev') {
            var stateCode = county.stateCode || this.getStateCodeFromFips(this.normalizeFips(fips).substring(0, 2));
            var ev = stateCode && gameData.states[stateCode] ? gameData.states[stateCode].ev : 0;
            detailLine = '<span class="tooltip-leader">' + ev + ' Electoral Votes</span>';
            subLine = '<span class="tooltip-stats">State total</span>';
        } else if (mode === 'population') {
            detailLine = '<span class="tooltip-leader">' + (county.p || 0).toLocaleString() + ' Population</span>';
            subLine = '<span class="tooltip-stats">County population</span>';
        } else if (mode === 'turnout' || mode === 'playerTurnout' || mode === 'opponentTurnout') {
            var label = mode === 'turnout' ? 'Turnout' : (mode === 'playerTurnout' ? 'Player Turnout' : 'Opponent Turnout');
            var rate = this.getCountyTurnoutRateForMode(county, mode);
            var rateLabel = rate ? (rate * 100).toFixed(1) + '%' : '—';
            detailLine = '<span class="tooltip-leader">' + label + ': ' + rateLabel + '</span>';
            subLine = '<span class="tooltip-stats">Expected turnout of registered voters</span>';
        } else if (mode === 'favorability') {
            var fav = typeof Campaign !== 'undefined' ? Math.round(Campaign.getFavorability() * 100) : 0;
            detailLine = '<span class="tooltip-leader">Favorability: ' + fav + '%</span>';
            subLine = '<span class="tooltip-stats">National standing</span>';
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
        var isIndependentCity = countyName.indexOf('City of ') === 0;
        if (!isIndependentCity && !countyName.includes(suffix) && !countyName.includes('County') && 
            !countyName.includes('Borough') && !countyName.includes('Parish')) {
            countyName = countyName + ' ' + suffix;
        }
        
        tooltip.innerHTML =
            '<span class="tooltip-title">' + countyName + '</span>' +
            '<div class="tooltip-divider"></div>' +
            detailLine +
            (subLine ? subLine : '');
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
        var stateToRestore = this.currentState || gameData.selectedState;
        document.getElementById('county-view-wrapper').classList.add('hidden');
        document.getElementById('us-map-wrapper').classList.remove('hidden');
        this.currentState = null;
        gameData.inCountyView = false;
        gameData.selectedCounty = null;
        
        if (typeof Campaign !== 'undefined' && Campaign.restoreStateActionGrid) {
            Campaign.restoreStateActionGrid();
            if (stateToRestore) Campaign.clickState(stateToRestore);
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
        
        var stateCode = this.getStateCodeFromFips(normalizedFips.substring(0, 2));
        
        // --- V2 ISSUE UPGRADES ---
        // 1. Boost Credibility
        if (gameData.candidate.issueCredibility) {
            gameData.candidate.issueCredibility[issueId] = Math.min(1.0, (gameData.candidate.issueCredibility[issueId] || 0.5) + 0.05);
        }
        
        // 2. Boost Salience (Attention Economy)
        if (gameData.issueSalience && gameData.issueSalience[stateCode]) {
            gameData.issueSalience[stateCode][issueId] = Math.min(10, (gameData.issueSalience[stateCode][issueId] || 5) + 1.0);
        }
        
        // 3. Evaluate alignment, bimodal math, and dealbreakers
        var alignmentBonus = this.evaluateIssueEvent(normalizedFips, issueId, gameData.candidate, 1.0);
        
        // 4. Apply shift to the local county voters
        var pParty = gameData.candidate.party;
        this.applyVoteShareShift(county.v, pParty, alignmentBonus);
        
        if (typeof updateMessagingConsistency === 'function') {
            updateMessagingConsistency(issueId, 1);
        }
        if (typeof recordPlayerPressure === 'function' && stateCode) {
            recordPlayerPressure(stateCode, 'SPEECH', 1);
        }
        
        // Base turnout boost
        if (!county.turnout) county.turnout = { player: 1.0, demOpponent: 1.0, repOpponent: 1.0, thirdParty: 0.7 };
        var voterBoost = 0.02 + Math.random() * 0.03;
        
        if (gameData.selectedParty === 'D' || gameData.selectedParty === 'R') {
            county.turnout.player = Math.min(1.3, (county.turnout.player || 1.0) + voterBoost);
        } else {
            county.turnout.thirdParty = Math.min(1.3, (county.turnout.thirdParty || 0.7) + (voterBoost * 0.5));
        }
        
        // Update display
        this.updateStateFromCounties(this.currentState);
        Campaign.updateHUD();
        Campaign.colorMap();
        this.colorCountyMap();
        
        var message = 'Campaign speech on ' + issueId + ' in ' + (county.n || 'County') + '!';
        
        if (alignmentBonus < 0) {
            message += ' (It backfired due to polarized voters or a dealbreaker!)';
        } else if (alignmentBonus > 0.8) {
            message += ' (Highly effective! Voters strongly aligned.)';
        }

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
    },
    
    // --- V2 ISSUE SYSTEM UPGRADES ---
    
    // Calculate a localized issue position based on county partisan lean
    getCountyIssuePosition: function(fips, issueId) {
        var county = this.countyData[fips];
        if (!county || !county.v) return 0;
        
        var stateCode = this.getStateCodeFromFips(fips.substring(0, 2));
        var statePos = (typeof STATE_ISSUE_POSITIONS !== 'undefined' && STATE_ISSUE_POSITIONS[stateCode] && STATE_ISSUE_POSITIONS[stateCode][issueId]) || 0;
        
        // Use v.R - v.D as a proxy for localized conservatism/progressivism
        var rShare = county.v.R || 0;
        var dShare = county.v.D || 0;
        var totalRaw = rShare + dShare;
        
        if (totalRaw < 1) return statePos;
        
        var margin = (rShare - dShare) / totalRaw; // -1.0 (pure D) to +1.0 (pure R)
        
        // Some issues are highly correlated with partisan lean (social/cultural)
        var shiftFactor = 3.0; // Max shift from state average
        
        var localShift = margin * shiftFactor;
        
        var countyPos = statePos + localShift;
        return Math.max(-10, Math.min(10, countyPos));
    },
    
    // Evaluate an issue event (speech, ad) using credibility, bimodal polarization, and dealbreakers
    evaluateIssueEvent: function(fips, issueId, candidate, basePower) {
        var county = this.countyData[fips];
        if (!county) return 0;
        
        // 1. Calculate Credibility multiplier
        var cred = (candidate.issueCredibility && candidate.issueCredibility[issueId]) || 0.5;
        var effectivePower = basePower * cred;
        
        // 2. Determine Alignment using Polarization profile
        var candPos = (candidate.issuePositions && candidate.issuePositions[issueId]) || 0;
        var countyPos = this.getCountyIssuePosition(fips, issueId);
        
        var polLevel = (typeof ISSUE_POLARIZATION !== 'undefined' && ISSUE_POLARIZATION[issueId]) || 'medium';
        var alignmentBonus = 0;
        
        var distance = Math.abs(candPos - countyPos);
        
        if (polLevel === 'high') {
            // Bimodal: You must be very close to the peak to get a benefit, moderation falls flat.
            if (distance <= 2) alignmentBonus = effectivePower * 1.5;
            else if (distance <= 4) alignmentBonus = effectivePower * 0.5;
            else alignmentBonus = -effectivePower * 0.5; // Alienates voters
        } else if (polLevel === 'low') {
            // Flat distribution: Gradual drop-off, moderation works fine
            alignmentBonus = effectivePower * (1 - (distance / 10));
        } else {
            // Medium
            alignmentBonus = effectivePower * (1 - (distance / 7));
        }
        
        // 3. Dealbreaker check
        if (typeof DEALBREAKER_THRESHOLDS !== 'undefined') {
            // Check state demographics to estimate county demographics
            var stateCode = this.getStateCodeFromFips(fips.substring(0, 2));
            var demographics = (typeof STATE_DEMOGRAPHICS !== 'undefined' && STATE_DEMOGRAPHICS[stateCode]) || {};
            
            for (var group in DEALBREAKER_THRESHOLDS) {
                var groupPct = demographics[group] || 0;
                if (groupPct > 15) { // If it's a significant demographic in this state
                    var thresholds = DEALBREAKER_THRESHOLDS[group][issueId];
                    if (thresholds) {
                        if ((thresholds.min !== undefined && candPos < thresholds.min) ||
                            (thresholds.max !== undefined && candPos > thresholds.max)) {
                            // Dealbreaker violated!
                            alignmentBonus = -basePower * 2.0; // Massive penalty
                            break;
                        }
                    }
                }
            }
        }
        
        return alignmentBonus;
    }
};
