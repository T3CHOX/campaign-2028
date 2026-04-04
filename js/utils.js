/* ============================================
   DECISION 2028 - UTILITY FUNCTIONS
   ============================================ */

var Utils = {
    showToast: function(msg) {
        var toast = document.getElementById('toast');
        if (toast) {
            toast.innerText = msg;
            toast.style.opacity = 1;
            setTimeout(function() { toast.style.opacity = 0; }, 2500);
        }
    },

    addLog: function(message) {
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

    getMarginColor: function(margin) {
        // Improved coloring with white at 0.0%
        if (margin > 25) return "#00264d"; // Very dark blue
        if (margin > 15) return "#003d7a"; // Darker blue
        if (margin > 10) return "#0055a6"; // Dark blue
        if (margin > 5) return "#0077d9"; // Medium blue
        if (margin > 2) return "#3399ff"; // Light blue
        if (margin > 0.5) return "#66b3ff"; // Very light blue
        if (margin > -0.5) return "#ffffff"; // White (neutral/tied)
        if (margin > -2) return "#ff9999"; // Very light red
        if (margin > -5) return "#ff6666"; // Light red
        if (margin > -10) return "#ff3333"; // Medium red
        if (margin > -15) return "#d90000"; // Dark red
        if (margin > -25) return "#a60000"; // Darker red
        return "#730000"; // Very dark red
    },

    // Color for shift-from-2024 map (positive = D shift, negative = R shift)
    getShiftColor: function(shift) {
        if (shift > 15)  return "#00264d";
        if (shift > 8)   return "#0055a6";
        if (shift > 4)   return "#3399ff";
        if (shift > 1.5) return "#66b3ff";
        if (shift > 0.5) return "#aad4ff";
        if (shift > -0.5) return "#dddddd";
        if (shift > -1.5) return "#ffaaaa";
        if (shift > -4)   return "#ff6666";
        if (shift > -8)   return "#d90000";
        if (shift > -15)  return "#a60000";
        return "#730000";
    },

    formatDate: function(date) {
        var months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        return months[date.getMonth()] + ' ' + date.getDate();
    },

    formatTime: function(timeValue) {
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
        return displayHours + ':' + (minutes < 10 ? '0' :  '') + minutes + ' ' + ampm;
    },

    isThirdParty: function(partyCode) {
        return partyCode === 'PSL' || partyCode === 'G' || partyCode === 'L' || partyCode === 'I';
    },

    shuffleArray: function(array) {
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
    getActiveCandidates: function() {
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

    // Build a ranked candidate list HTML from poll percentages.
    // pollByParty:     { D: 48.5, R: 44.2, G: 2.1, ... }
    // prevPollByParty: { D: 47.0, R: 45.0, ... }  — pass null on first turn for 0.0 deltas
    buildCandidateRankedListHTML: function(pollByParty, prevPollByParty) {
        if (!pollByParty) {
            return '<div class="cpl-empty">No polling data available.</div>';
        }

        var candidates = this.getActiveCandidates();
        var items = [];

        for (var ci = 0; ci < candidates.length; ci++) {
            var entry = candidates[ci];
            var pct  = pollByParty[entry.party] || 0;
            var prev = (prevPollByParty && prevPollByParty[entry.party] !== undefined)
                        ? prevPollByParty[entry.party] : pct;
            items.push({ party: entry.party, cand: entry.cand, pct: pct, delta: pct - prev });
        }

        items.sort(function(a, b) { return b.pct - a.pct; });

        var html = '<div class="cpl">';
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var partyData = (typeof PARTIES !== 'undefined' && PARTIES[item.party]) ? PARTIES[item.party] : null;
            var partyColor = partyData ? partyData.color : '#888888';
            var homeState = item.cand.homeState || item.cand.state || '';
            var formattedName = item.cand.name + ' (' + item.party + (homeState ? '-' + homeState : '') + ')';
            var deltaStr = (item.delta >= 0 ? '+' : '') + item.delta.toFixed(1);
            var deltaClass = item.delta > 0.05 ? 'cpl-delta-pos' : (item.delta < -0.05 ? 'cpl-delta-neg' : 'cpl-delta-neu');

            html += '<div class="cpl-row">';
            html += '<span class="cpl-rank">' + (i + 1) + '</span>';
            html += '<img class="cpl-avatar" src="' + (item.cand.img || 'images/scenario.jpg') + '" onerror="this.src=\'images/scenario.jpg\'" alt="" style="border-color:' + partyColor + ';">';
            html += '<div class="cpl-info">';
            html += '<span class="cpl-name" style="color:' + partyColor + ';">' + formattedName + '</span>';
            html += '<div class="cpl-bar-track"><div class="cpl-bar" style="width:' + Math.min(100, item.pct).toFixed(1) + '%;background:' + partyColor + ';"></div></div>';
            html += '</div>';
            html += '<div class="cpl-stats">';
            html += '<span class="cpl-pct" style="color:' + partyColor + ';">' + item.pct.toFixed(1) + '%</span>';
            html += '<span class="' + deltaClass + '">' + deltaStr + '</span>';
            html += '</div>';
            html += '</div>';
        }
        html += '</div>';
        return html;
    },

    // Build ranked candidate list from ELECTION NIGHT reported votes (no delta support needed)
    buildElectionRankedListHTML: function(reportedVotes, reportedPct, stateEV, projStatus) {
        var candidates = this.getActiveCandidates();
        var items = [];

        var totalVotes = 0;
        var partyKeys = ['D', 'R', 'G', 'L', 'I', 'PSL'];
        for (var pk = 0; pk < partyKeys.length; pk++) {
            totalVotes += reportedVotes[partyKeys[pk]] || 0;
        }

        for (var ci = 0; ci < candidates.length; ci++) {
            var entry = candidates[ci];
            var votes = reportedVotes[entry.party] || 0;
            var pct = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
            items.push({ party: entry.party, cand: entry.cand, votes: votes, pct: pct });
        }

        items.sort(function(a, b) { return b.pct - a.pct; });

        var html = '<div class="cpl">';
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var partyData = (typeof PARTIES !== 'undefined' && PARTIES[item.party]) ? PARTIES[item.party] : null;
            var partyColor = partyData ? partyData.color : '#888888';
            var homeState = item.cand.homeState || item.cand.state || '';
            var formattedName = item.cand.name + ' (' + item.party + (homeState ? '-' + homeState : '') + ')';

            html += '<div class="cpl-row">';
            html += '<span class="cpl-rank">' + (i + 1) + '</span>';
            html += '<img class="cpl-avatar" src="' + (item.cand.img || 'images/scenario.jpg') + '" onerror="this.src=\'images/scenario.jpg\'" alt="" style="border-color:' + partyColor + ';">';
            html += '<div class="cpl-info">';
            html += '<span class="cpl-name" style="color:' + partyColor + ';">' + formattedName + '</span>';
            html += '<div class="cpl-bar-track"><div class="cpl-bar" style="width:' + Math.min(100, item.pct).toFixed(1) + '%;background:' + partyColor + ';"></div></div>';
            html += '</div>';
            html += '<div class="cpl-stats">';
            html += '<span class="cpl-pct" style="color:' + partyColor + ';">' + item.pct.toFixed(1) + '%</span>';
            html += '<span class="cpl-votes">' + item.votes.toLocaleString() + '</span>';
            html += '</div>';
            html += '</div>';
        }
        html += '</div>';

        // Status line
        if (projStatus) {
            html += '<div class="elec-projection"><span class="proj-status ' + (projStatus.cssClass || '') + '">' + projStatus.text + '</span></div>';
        }

        return html;
    },

    // Compute per-party polling percentages for a state from county data
    getStatePollingByParty: function(stateCode) {
        if (typeof Counties === 'undefined' || !Counties.countyData) return null;
        if (typeof STATES === 'undefined' || !STATES[stateCode]) return null;
        var stateFips = STATES[stateCode].fips;
        if (!stateFips) return null;

        var totals = { D: 0, R: 0, G: 0, L: 0, I: 0, PSL: 0 };

        for (var fips in Counties.countyData) {
            var paddedFips = fips.padStart(5, '0');
            if (paddedFips.substring(0, 2) !== stateFips) continue;
            var county = Counties.countyData[fips];
            if (!county.v || !county.p) continue;

            var demTurnout   = gameData.selectedParty === 'D' ? ((county.turnout && county.turnout.player) || 1.0) : ((county.turnout && county.turnout.demOpponent) || 1.0);
            var repTurnout   = gameData.selectedParty === 'R' ? ((county.turnout && county.turnout.player) || 1.0) : ((county.turnout && county.turnout.repOpponent) || 1.0);
            var thirdTurnout = (county.turnout && county.turnout.thirdParty) || 0.7;
            var decided      = (100 - (county.undecided || 0)) / 100;
            var pop = county.p;

            totals.D += (county.v.D || 0) * pop / 100 * decided * demTurnout;
            totals.R += (county.v.R || 0) * pop / 100 * decided * repTurnout;
            if (gameData.thirdPartiesEnabled) {
                totals.G   += (county.v.G   || 0) * pop / 100 * decided * thirdTurnout;
                totals.L   += (county.v.L   || 0) * pop / 100 * decided * thirdTurnout;
                totals.I   += (county.v.I   || 0) * pop / 100 * decided * thirdTurnout;
                totals.PSL += (county.v.PSL || 0) * pop / 100 * decided * thirdTurnout;
            }
        }

        var totalVotes = totals.D + totals.R + totals.G + totals.L + totals.I + totals.PSL;
        if (totalVotes <= 0) return null;

        var pcts = {};
        var keys = ['D', 'R', 'G', 'L', 'I', 'PSL'];
        for (var pi = 0; pi < keys.length; pi++) {
            pcts[keys[pi]] = (totals[keys[pi]] / totalVotes) * 100;
        }
        return pcts;
    },

    // Compute per-party polling percentages for a single county object
    getCountyPollingByParty: function(county) {
        if (!county || !county.v) return null;

        var demTurnout   = gameData.selectedParty === 'D' ? ((county.turnout && county.turnout.player) || 1.0) : ((county.turnout && county.turnout.demOpponent) || 1.0);
        var repTurnout   = gameData.selectedParty === 'R' ? ((county.turnout && county.turnout.player) || 1.0) : ((county.turnout && county.turnout.repOpponent) || 1.0);
        var thirdTurnout = (county.turnout && county.turnout.thirdParty) || 0.7;
        var decided      = (100 - (county.undecided || 0)) / 100;

        var totals = {
            D:   (county.v.D   || 0) * decided * demTurnout,
            R:   (county.v.R   || 0) * decided * repTurnout,
            G:   gameData.thirdPartiesEnabled ? (county.v.G   || 0) * decided * thirdTurnout : 0,
            L:   gameData.thirdPartiesEnabled ? (county.v.L   || 0) * decided * thirdTurnout : 0,
            I:   gameData.thirdPartiesEnabled ? (county.v.I   || 0) * decided * thirdTurnout : 0,
            PSL: gameData.thirdPartiesEnabled ? (county.v.PSL || 0) * decided * thirdTurnout : 0
        };

        var totalVotes = totals.D + totals.R + totals.G + totals.L + totals.I + totals.PSL;
        if (totalVotes <= 0) return null;

        var pcts = {};
        var keys = ['D', 'R', 'G', 'L', 'I', 'PSL'];
        for (var pi = 0; pi < keys.length; pi++) {
            pcts[keys[pi]] = (totals[keys[pi]] / totalVotes) * 100;
        }
        return pcts;
    },

    // ─── Ranked candidate list helpers ─────────────────────────────────────────

    // Build the ordered array of all active candidates with polling percentages and deltas
    _getRankedCandidates: function(pcts, prevPcts) {
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
            // On first turn prev is undefined → delta shown as 0.0
            var delta = (prev !== undefined) ? pct - prev : 0;
            result.push({ party: entry.party, cand: entry.cand, pct: pct, delta: delta });
        }

        result.sort(function(a, b) { return b.pct - a.pct; });
        return result;
    },

    // Format a candidate name as "First Last (P-ST)"
    _formatCandName: function(cand, party) {
        var homeState = (cand && (cand.homeState || cand.state)) || '';
        var partyCode = party || (cand && cand.party) || '?';
        return (cand ? cand.name : '—') + ' (' + partyCode + (homeState ? '-' + homeState : '') + ')';
    },

    // Build ranked candidate list HTML for simulator state/county views
    buildCandidateRankedListHTML: function(pcts, prevPcts) {
        if (!pcts) {
            return '<div class="cpl-empty">No polling data available.</div>';
        }
        var candidates = this._getRankedCandidates(pcts, prevPcts);
        if (!candidates.length) {
            return '<div class="cpl-empty">No candidates.</div>';
        }

        var html = '<div class="cpl-list">';
        for (var i = 0; i < candidates.length; i++) {
            var item = candidates[i];
            var partyColor = (PARTIES[item.party] && PARTIES[item.party].color) || '#888';
            var formattedName = this._formatCandName(item.cand, item.party);
            var imgSrc = (item.cand && item.cand.img) ? item.cand.img : 'images/scenario.jpg';
            var deltaStr = (item.delta >= 0 ? '+' : '') + item.delta.toFixed(1);
            var deltaClass = item.delta > 0.05 ? 'cpl-delta-pos' : (item.delta < -0.05 ? 'cpl-delta-neg' : 'cpl-delta-neu');

            html += '<div class="cpl-row">';
            html += '<span class="cpl-rank">' + (i + 1) + '</span>';
            html += '<img class="cpl-avatar" src="' + imgSrc + '" onerror="this.src=\'images/scenario.jpg\'" alt="" style="border-color:' + partyColor + ';">';
            html += '<div class="cpl-info">';
            html += '<div class="cpl-name">' + formattedName + '</div>';
            html += '<div class="cpl-bar-wrap"><div class="cpl-bar" style="width:' + Math.max(0.5, item.pct).toFixed(1) + '%;background:' + partyColor + ';"></div></div>';
            html += '</div>';
            html += '<div class="cpl-pct-group">';
            html += '<span class="cpl-pct" style="color:' + partyColor + ';">' + item.pct.toFixed(1) + '%</span>';
            html += '<span class="' + deltaClass + '">' + deltaStr + '</span>';
            html += '</div>';
            html += '</div>';
        }
        html += '</div>';
        return html;
    },

    // Build ranked candidate list HTML for election-night state/county detail panels
    buildElectionRankedListHTML: function(reportedVotes, reportedPct, ev, projStatus) {
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
        all.sort(function(a, b) { return b.votes - a.votes; });

        var html = '<div class="elec-cpl-list">';

        for (var i = 0; i < all.length; i++) {
            var item = all[i];
            var partyColor = (PARTIES[item.party] && PARTIES[item.party].color) || '#888';
            var formattedName = this._formatCandName(item.cand, item.party);
            var imgSrc = (item.cand && item.cand.img) ? item.cand.img : 'images/scenario.jpg';
            var pct = totalVotes > 0 ? (item.votes / totalVotes) * 100 : 0;

            html += '<div class="elec-cpl-row">';
            html += '<img class="elec-cpl-avatar" src="' + imgSrc + '" onerror="this.src=\'images/scenario.jpg\'" alt="" style="border-color:' + partyColor + ';">';
            html += '<div class="elec-cpl-info">';
            html += '<div class="elec-cpl-name">' + formattedName + '</div>';
            html += '<div class="elec-cpl-bar-wrap"><div class="elec-cpl-bar" style="width:' + Math.max(0.5, pct).toFixed(1) + '%;background:' + partyColor + ';"></div></div>';
            html += '</div>';
            html += '<div class="elec-cpl-right">';
            html += '<span class="elec-cpl-pct" style="color:' + partyColor + ';">' + pct.toFixed(1) + '%</span>';
            html += '<span class="elec-cpl-votes">' + item.votes.toLocaleString() + '</span>';
            html += '</div>';
            html += '</div>';
        }
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
    getShiftColor: function(shift) {
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
