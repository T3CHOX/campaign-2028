/* ============================================
   DECISION 2028 - UTILITY FUNCTIONS
   ============================================ */

var Utils = {
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

    getMarginColor: function (margin) {
        if (margin > 35) return "#00152e";
        if (margin > 25) return "#00264d";
        if (margin > 18) return "#003d7a";
        if (margin > 12) return "#0055a6";
        if (margin > 8) return "#0077d9";
        if (margin > 5) return "#1395e8";
        if (margin > 3) return "#33a9f5";
        if (margin > 2) return "#66bff7";
        if (margin > 1) return "#91d7fb";
        if (margin > 0.5) return "#b7e8ff";
        if (margin > 0.25) return "#d4f2ff";
        if (margin > 0.1) return "#edfaff";
        if (margin > -0.1) return "#f7f2e7";
        if (margin > -0.25) return "#fff0ec";
        if (margin > -0.5) return "#ffd8d2";
        if (margin > -1) return "#ffb7ad";
        if (margin > -2) return "#ff8b7d";
        if (margin > -3) return "#ff6258";
        if (margin > -5) return "#f04444";
        if (margin > -8) return "#d9272e";
        if (margin > -12) return "#b9151d";
        if (margin > -18) return "#940c14";
        if (margin > -25) return "#73070e";
        if (margin > -35) return "#520409";
        return "#310105";
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

    // Compute per-party polling percentages for a state from county data
    getStatePollingByParty: function (stateCode) {
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

            var decided = (100 - (county.undecided || 0)) / 100;
            var countyTotals = Counties.calculateCountyVoteTotals(county, { reportingFactor: 1, decidedMultiplier: decided, errorFactor: 1 });

            totals.D += countyTotals.D || 0;
            totals.R += countyTotals.R || 0;
            totals.G += countyTotals.G || 0;
            totals.L += countyTotals.L || 0;
            totals.I += countyTotals.I || 0;
            totals.PSL += countyTotals.PSL || 0;
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
    getCountyPollingByParty: function (county) {
        if (!county || !county.v) return null;

        var decided = (100 - (county.undecided || 0)) / 100;
        var totals = Counties.calculateCountyVoteTotals(county, { reportingFactor: 1, decidedMultiplier: decided, errorFactor: 1 });

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
            // On first turn prev is undefined → delta shown as 0.0
            var delta = (prev !== undefined) ? pct - prev : 0;
            result.push({ party: entry.party, cand: entry.cand, pct: pct, delta: delta });
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

    // Build ranked candidate list HTML for simulator state/county views
    buildCandidateRankedListHTML: function (pcts, prevPcts) {
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
    buildElectionRankedListHTML: function (reportedVotes, reportedPct, ev, projStatus) {
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
