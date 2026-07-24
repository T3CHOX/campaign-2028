/* ============================================
   DECISION 2028 - UTILITY FUNCTIONS
   ============================================ */

var Utils = {
    POPULATION_ICON: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="height: 1.2em; width: 1.2em; vertical-align: middle; margin-right: 4px; margin-bottom: 2px;"><g><path d="M164.594 21.625c-.537.012-1.068.028-1.563.094-29.656 3.852-52.56 35.847-52.56 74.75 0 21.55 7.307 41.193 18.686 54.905-61.678 11.594-66.563 115.158-66.562 188.063h43.218l11.094 152.437h63.063L168.905 340.03h21.47l11.343 152.158h108.686l10.03-152.157h21.627l-9.907 151.845h63.063l10.53-152.438h40.28c0-73.107 1.407-178.78-65.967-189.218 10.89-13.646 18.093-32.734 18.093-53.75 0-41.496-26.52-74.75-59-74.75-2.03 0-4.43-.263-6.406 0-9.4 1.22-17.562 5.455-25.125 11.686 16.388 13.303 27.468 36.433 27.47 63.063 0 21.016-7.236 40.104-18.126 53.75 67.373 10.438 66 116.11 66 189.218h-21.94c.008-73.086 1.29-178.215-65.905-188.625 10.89-13.647 17.906-32.61 17.906-53.625 0-41.497-26.457-75-58.936-75-2.03 0-4.117-.262-6.094 0-29.657 3.85-52.813 36.095-52.813 75 0 21.547 7.373 40.788 18.75 54.5-61.514 11.563-66.318 114.874-66.343 187.75H126.25c-.002-72.905 4.322-176.47 66-188.063-11.38-13.712-18.687-33.356-18.688-54.906 0-26.575 11.138-49.632 27.438-63.064-9.148-7.425-19.896-11.687-31.53-11.687-1.525 0-3.267-.132-4.876-.095z" fill="currentColor"></path></g></svg>',

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
        var nTotals = { D: 0, R: 0, G: 0, L: 0, I: 0, PSL: 0 };
        var nUndecided = 0;
        var nPop = 0;
        
        for (var stateCode in gameData.states) {
            var s = gameData.states[stateCode];
            var pcts = this.getStatePollingByParty(stateCode);
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

    getStatePollingByParty: function (stateCode) {
        if (typeof Counties === 'undefined' || !Counties.countyData) return null;
        if (typeof STATES === 'undefined' || !STATES[stateCode]) return null;
        var stateFips = STATES[stateCode].fips;
        if (!stateFips) return null;

        var totals = { D: 0, R: 0, G: 0, L: 0, I: 0, PSL: 0 };
        var stateUndecidedTotal = 0;
        var statePopTotal = 0;

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
        
        if (pcts && pcts['Undecided'] !== undefined) {
            var uPct = pcts['Undecided'];
            html += '<div class="cpl-undecided-row" style="text-align: right; margin-top: 8px; padding-right: 12px; font-size: 0.88rem; font-weight: bold; color: var(--ink-muted);">Undecided: ' + uPct.toFixed(1) + '%</div>';
        }
        
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
