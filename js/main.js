/* ============================================
   DECISION 2028 - MAIN ENTRY POINT
   ============================================ */

function initGameData() {
    // Initialize states WITHOUT standalone margins - will be calculated from counties
    for (var code in STATES) {
        gameData.states[code] = {
            name: STATES[code].name,
            ev: STATES[code].ev,
            lean: STATES[code].lean, // Keep for reference but don't use for margin
            code: code,
            margin: 0, // Will be calculated from counties
            visited: false,
            adSpent: 0,
            rallies: 0,
            reportedPct: 0,
            reportedVotes: { D: 0, R: 0, G: 0, L: 0, PSL: 0, I: 0 },
            called: false,
            calledFor: null,
            fundraisingVisits: 0,
            lastCampaignDate: null,
            campaignActionsCount: 0
        };
    }
    
    // Enhance state data if states.js is loaded
    if (typeof enhanceStateData !== 'undefined') {
        enhanceStateData();
    }
    
    console.log("🗳️ Decision 2028 Initialized");
}

function startGame() {
    var isThirdParty = Utils.isThirdParty(gameData.selectedParty);

    // Validate player ticket is chosen
    if (!gameData.candidate) {
        Utils.showToast("Please select a presidential candidate first");
        return;
    }
    if (!gameData.vp) {
        Utils.showToast("Please select a running mate first");
        return;
    }

    // Validate opponent tickets always need D and R set
    if (!gameData.demTicket.pres || !gameData.demTicket.vp) {
        Utils.showToast("Democratic ticket not fully selected");
        return;
    }
    if (!gameData.repTicket.pres || !gameData.repTicket.vp) {
        Utils.showToast("Republican ticket not fully selected");
        return;
    }

    // Apply third-party penalties (harder campaign)
    if (isThirdParty) {
        // PSL gets harshest penalty (extreme mode), others get standard third-party penalty
        var isPSL = gameData.selectedParty === 'PSL';
        gameData.funds = Math.floor(gameData.funds * (isPSL ? 0.3 : 0.5));
        gameData.maxEnergy = Math.max(isPSL ? 3 : 4, gameData.maxEnergy - (isPSL ? 3 : 2));
        gameData.energy = gameData.maxEnergy;
    }
    
    // Initialize interest group support for all candidates
    initializeInterestGroupSupport();
    
    // Initialize per-group turnout tracking
    initInterestGroupTurnout();
    
    // Note: applyCandidateBuffs() and recomputeInterestGroupSupport() are called
    // inside the Counties.loadCountyData() callback in Campaign.initMap()
    // so that county data is available when buffs are applied.
    
    Screens.goTo('game-screen');
    Campaign.initMap();
    Campaign.updateHUD();
    Utils.addLog("Campaign begins!  Good luck, " + gameData.candidate.name + "!");
}

// Tuning constants for the dynamic buff/group system
var BUFF_CONSTANTS = {
    GROUP_MOD_DAMPENING: 0.1,       // Scale factor: +15 mod with 100% group weight → +1.5 pts vote share
    MIN_GROUP_TURNOUT: 0.5,          // Minimum group turnout propensity (50%)
    MAX_GROUP_TURNOUT: 1.5,          // Maximum group turnout propensity (150%)
    GROUP_TURNOUT_RATE: 0.008,       // Per-intensity turnout change rate per aligned campaign action
    VOTE_NORMALIZE_MIN: 95,          // Lower bound for county vote total before normalization
    VOTE_NORMALIZE_MAX: 101          // Upper bound for county vote total before normalization
};

// Apply candidate and VP buffs/debuffs to county data (deterministic, county ig-weighted)
function applyCandidateBuffs() {
    if (typeof Counties === 'undefined' || !Counties.countyData) {
        console.warn('County data not loaded, skipping buff application');
        return;
    }

    // Build list of all active tickets
    var allTickets = [];
    if (gameData.selectedParty && gameData.candidate) {
        allTickets.push({ party: gameData.selectedParty, pres: gameData.candidate, vp: gameData.vp });
    }
    if (gameData.demTicket && gameData.demTicket.pres) {
        allTickets.push({ party: 'D', pres: gameData.demTicket.pres, vp: gameData.demTicket.vp });
    }
    if (gameData.repTicket && gameData.repTicket.pres) {
        allTickets.push({ party: 'R', pres: gameData.repTicket.pres, vp: gameData.repTicket.vp });
    }
    if (gameData.thirdTickets) {
        var tpCodes = ['PSL', 'G', 'L', 'I'];
        for (var tc = 0; tc < tpCodes.length; tc++) {
            var tp = tpCodes[tc];
            if (gameData.thirdTickets[tp] && gameData.thirdTickets[tp].pres) {
                allTickets.push({ party: tp, pres: gameData.thirdTickets[tp].pres, vp: gameData.thirdTickets[tp].vp });
            }
        }
    }

    for (var t = 0; t < allTickets.length; t++) {
        var ticket = allTickets[t];
        var voteKey = ticket.party;
        var pres = ticket.pres;
        var vp = ticket.vp;

        // 1. Presidential home-state advantage — strong, deterministic
        if (pres && pres.homeState) {
            var presBoost = pres.homeStateBoost || 12;
            _applyStateBoostToCounties(pres.homeState, voteKey, presBoost);
        }

        // 2. VP home-state advantage — materially weaker (~50% of pres)
        if (vp && (vp.homeState || vp.state)) {
            var vpHome = vp.homeState || vp.state;
            var vpBoost = vp.homeStateBoost || 6;
            _applyStateBoostToCounties(vpHome, voteKey, vpBoost);
        }

        // 3. Presidential group boosts/debuffs (from candidate data)
        if (pres && pres.groupBoosts) {
            _applyGroupModsToCounties(pres.groupBoosts, voteKey, 1.0);
        }
        if (pres && pres.groupDebuffs) {
            _applyGroupModsToCounties(pres.groupDebuffs, voteKey, 1.0);
        }

        // 4. Presidential group modifiers from CANDIDATE_GROUP_MODIFIERS
        if (pres && typeof CANDIDATE_GROUP_MODIFIERS !== 'undefined' && CANDIDATE_GROUP_MODIFIERS[pres.id]) {
            _applyGroupModsToCounties(CANDIDATE_GROUP_MODIFIERS[pres.id], voteKey, 1.0);
        }

        // 5. VP group boosts/debuffs (50% of presidential effect)
        if (vp && vp.groupBoosts) {
            _applyGroupModsToCounties(vp.groupBoosts, voteKey, 0.5);
        }
        if (vp && vp.groupDebuffs) {
            _applyGroupModsToCounties(vp.groupDebuffs, voteKey, 0.5);
        }

        // 6. VP group modifiers from CANDIDATE_GROUP_MODIFIERS
        if (vp && typeof CANDIDATE_GROUP_MODIFIERS !== 'undefined' && CANDIDATE_GROUP_MODIFIERS[vp.id]) {
            _applyGroupModsToCounties(CANDIDATE_GROUP_MODIFIERS[vp.id], voteKey, 0.5);
        }

        // 7. Special named buffs (deterministic)
        if (pres && pres.buff === 'Midwest Appeal') {
            var midwestStates = ['MI', 'WI', 'MN', 'OH', 'IL', 'IN', 'IA', 'MO'];
            for (var mi = 0; mi < midwestStates.length; mi++) {
                _applyStateBoostToCounties(midwestStates[mi], voteKey, 3);
            }
        }

        // 8. County-specific boosts for candidates with strong local ties
        if (pres) {
            _applyCountySpecificBoosts(pres.id, voteKey);
        }

        // 9. Regional spillover boosts for regionally-connected candidates
        if (pres) {
            _applyRegionalSpillover(pres, voteKey);
        }
    }

    // Normalize all county vote shares to prevent incoherent totals
    _normalizeAllCountyVotes();

    // Recalculate all state margins from county data
    for (var code in gameData.states) {
        if (typeof Counties !== 'undefined') {
            Counties.updateStateFromCounties(code);
        }
    }

    console.log('✓ Candidate buffs applied deterministically for all tickets; state margins recalculated');
}

// Apply a flat vote-share boost to a single county identified by its 5-digit FIPS code
function _applyCountyBoost(fips5, voteKey, boostPoints) {
    var county = Counties.countyData[fips5];
    if (!county || !county.v) {
        // Also try without leading zero for keys stored differently
        for (var key in Counties.countyData) {
            if (key.padStart(5, '0') === fips5) {
                county = Counties.countyData[key];
                break;
            }
        }
    }
    if (!county || !county.v) return;

    county.v[voteKey] = Math.min(98, (county.v[voteKey] || 0) + boostPoints);
    if (voteKey !== 'D' && county.v.D !== undefined) {
        county.v.D = Math.max(1, county.v.D - boostPoints * 0.5);
    }
    if (voteKey !== 'R' && county.v.R !== undefined) {
        county.v.R = Math.max(1, county.v.R - boostPoints * 0.5);
    }
}

// County-level targeted boosts for candidates with specific local ties
function _applyCountySpecificBoosts(candId, voteKey) {
    if (candId === 'emanuel') {
        // Rahm Emanuel was Chicago's mayor — very strong Cook County D boost,
        // but slightly dampened statewide boost (handled by lower homeStateBoost)
        _applyCountyBoost('17031', voteKey, 18); // Cook County (Chicago)
        _applyCountyBoost('17043', voteKey, 6);  // DuPage County (Chicago suburbs)
        _applyCountyBoost('17097', voteKey, 6);  // Lake County IL
    }
    if (candId === 'rubio') {
        // Marco Rubio — enormous Cuban-American community in Miami-Dade
        _applyCountyBoost('12086', voteKey, 20); // Miami-Dade County
        _applyCountyBoost('12011', voteKey, 12); // Broward County (large Hispanic pop)
        _applyCountyBoost('12099', voteKey, 8);  // Palm Beach County
    }
    if (candId === 'booker') {
        // Cory Booker — former Newark mayor, Essex County NJ stronghold
        _applyCountyBoost('34013', voteKey, 12); // Essex County NJ (Newark)
    }
    if (candId === 'aoc') {
        // AOC — very strong in The Bronx and Queens
        _applyCountyBoost('36005', voteKey, 15); // Bronx County, NY
        _applyCountyBoost('36081', voteKey, 10); // Queens County, NY
    }
    if (candId === 'bloomberg') {
        // Bloomberg — former NYC mayor
        _applyCountyBoost('36061', voteKey, 10); // New York County (Manhattan)
        _applyCountyBoost('36047', voteKey, 7);  // Kings County (Brooklyn)
    }
    if (candId === 'beshear') {
        // Andy Beshear — very strong in Louisville area but also rural KY
        _applyCountyBoost('21111', voteKey, 8);  // Jefferson County KY (Louisville)
    }
}

// Regional spillover boosts for candidates with Rust Belt / Southern / regional ties
function _applyRegionalSpillover(pres, voteKey) {
    if (!pres || !pres.homeState) return;

    // Vance: Rust Belt working-class identity resonates beyond just OH
    if (pres.id === 'vance') {
        var rustBelt = ['PA', 'MI', 'IN', 'WV'];
        for (var ri = 0; ri < rustBelt.length; ri++) {
            _applyStateBoostToCounties(rustBelt[ri], voteKey, 2);
        }
    }
    // Beshear: Southern crossover appeal in neighboring states
    if (pres.id === 'beshear') {
        var beshearRegion = ['TN', 'WV', 'VA'];
        for (var bi = 0; bi < beshearRegion.length; bi++) {
            _applyStateBoostToCounties(beshearRegion[bi], voteKey, 2);
        }
    }
    // Rubio: Hispanic outreach spills over to other large-Hispanic states
    if (pres.id === 'rubio') {
        var hispanicStates = ['TX', 'NM', 'NV', 'CO', 'AZ'];
        for (var hi = 0; hi < hispanicStates.length; hi++) {
            _applyStateBoostToCounties(hispanicStates[hi], voteKey, 2);
        }
    }
    // Whitmer: Great Lakes crossover
    if (pres.id === 'whitmer') {
        var greatlakes = ['WI', 'MN', 'OH'];
        for (var gi = 0; gi < greatlakes.length; gi++) {
            _applyStateBoostToCounties(greatlakes[gi], voteKey, 1);
        }
    }
    // Shapiro: Mid-Atlantic appeal
    if (pres.id === 'shapiro') {
        var midAtlantic = ['NJ', 'OH', 'MD'];
        for (var si = 0; si < midAtlantic.length; si++) {
            _applyStateBoostToCounties(midAtlantic[si], voteKey, 1);
        }
    }
    // Manchin: Appalachian crossover
    if (pres.id === 'manchin') {
        var appalachian = ['KY', 'VA', 'PA'];
        for (var ai = 0; ai < appalachian.length; ai++) {
            _applyStateBoostToCounties(appalachian[ai], voteKey, 2);
        }
    }
}

// Apply a flat vote-share boost to every county in a state (home-state / regional advantage)
function _applyStateBoostToCounties(stateCode, voteKey, boostPoints) {
    var stateFips = STATES[stateCode] ? STATES[stateCode].fips : null;
    if (!stateFips) return;

    for (var fips in Counties.countyData) {
        var paddedFips = fips.padStart(5, '0');
        if (paddedFips.substring(0, 2) !== stateFips) continue;
        var county = Counties.countyData[fips];
        if (!county.v) continue;

        county.v[voteKey] = Math.min(98, (county.v[voteKey] || 0) + boostPoints);
        // Distribute the loss between the two major-party opponents
        if (voteKey !== 'D' && county.v.D !== undefined) {
            county.v.D = Math.max(1, county.v.D - boostPoints * 0.5);
        }
        if (voteKey !== 'R' && county.v.R !== undefined) {
            county.v.R = Math.max(1, county.v.R - boostPoints * 0.5);
        }
    }
}

// Map INTEREST_GROUPS / CANDIDATE_GROUP_MODIFIERS keys → county ig keys
function _mapGroupToIgKey(groupId) {
    var MAP = {
        'black':          'black',
        'hispanic':       'hispanic',
        'asian':          'asian',
        'native':         'native',
        'evangelical':    'evangelical',
        'protestant':     'protestant',
        'catholic':       'catholic',
        'jewish':         'jewish',
        'muslim':         'muslim',
        'secular':        'secular',
        'union':          'union',
        'college':        'college',
        'rural':          'rural',
        'progressive':    'progressive',
        'progressives':   'progressive',
        'libertarian':    'libertarian',
        'libertarians':   'libertarian',
        'maga':           'maga',
        'centrist':       'centrist',
        'centrists':      'centrist',
        // keys that need special handling (null = use fallback logic)
        'urban':          null,
        'suburban':       null,
        'noncollege':     null,
        'bluecollar':     null,
        'whitecollar':    null,
        'tech':           null,
        'farmers':        null,
        'military':       null,
        'seniors':        null,
        'youth':          null,
        'women':          null,
        'lgbtq_community':null,
        'smallbusiness':  null,
        'independent':    null,
        'moderate':       null,
        'neocon':         null,
        'corporate':      null,
        'cuban':          'hispanic',
        'florida':        null,
        'health':         null,
        'mainstream':     null,
        'white':          null
    };
    return (groupId in MAP) ? MAP[groupId] : null;
}

// Apply group modifier values to every county, weighted by that county's ig composition
function _applyGroupModsToCounties(groupMods, voteKey, scale) {
    for (var groupId in groupMods) {
        var rawMod = groupMods[groupId]; // positive = boost, negative = debuff
        var modVal = rawMod * (scale || 1.0);
        var igKey = _mapGroupToIgKey(groupId);

        for (var fips in Counties.countyData) {
            var county = Counties.countyData[fips];
            if (!county.v) continue;

            // Determine group weight for this county
            var groupWeight = 0;
            if (igKey !== null && igKey !== undefined && county.ig && county.ig[igKey] !== undefined) {
                groupWeight = county.ig[igKey] / 100;
            } else if (groupId === 'urban') {
                groupWeight = (county.t === 'Urban') ? 0.8 : (county.t === 'Mixed' ? 0.3 : 0.05);
            } else if (groupId === 'suburban') {
                groupWeight = (county.t === 'Mixed') ? 0.6 : (county.t === 'Urban' ? 0.25 : 0.1);
            } else if (groupId === 'rural') {
                groupWeight = (county.t === 'Rural') ? 0.9 : (county.t === 'Mixed' ? 0.35 : 0.05);
            } else if (groupId === 'noncollege' && county.ig && county.ig.college !== undefined) {
                groupWeight = (100 - county.ig.college) / 100;
            } else if (groupId === 'bluecollar' && county.ig && county.ig.college !== undefined) {
                // Approximate bluecollar from noncollege + rural signal
                groupWeight = ((100 - county.ig.college) / 100) * 0.6;
            } else if (groupId === 'youth') {
                // Approximate: urban counties skew younger
                groupWeight = (county.t === 'Urban') ? 0.28 : (county.t === 'Mixed' ? 0.22 : 0.18);
            } else if (groupId === 'seniors') {
                groupWeight = (county.t === 'Urban') ? 0.16 : (county.t === 'Mixed' ? 0.20 : 0.24);
            } else if (groupId === 'women') {
                groupWeight = 0.51; // ~51% of every county is women
            } else {
                continue; // No mapping available; skip
            }

            if (groupWeight <= 0) continue;

            // shift = modifier_points * county_group_weight * dampening
            // GROUP_MOD_DAMPENING of 0.1 means a +15 mod with 100% group weight → +1.5 pts vote share
            var shift = modVal * groupWeight * BUFF_CONSTANTS.GROUP_MOD_DAMPENING;

            if (shift > 0) {
                // Boost this candidate
                county.v[voteKey] = Math.min(98, (county.v[voteKey] || 0) + shift);
                // Draw proportionally from the two major-party opponents
                if (voteKey !== 'D' && county.v.D !== undefined) {
                    county.v.D = Math.max(1, county.v.D - shift * 0.5);
                }
                if (voteKey !== 'R' && county.v.R !== undefined) {
                    county.v.R = Math.max(1, county.v.R - shift * 0.5);
                }
            } else if (shift < 0) {
                // Debuff: reduce this candidate's share
                county.v[voteKey] = Math.max(1, (county.v[voteKey] || 0) + shift);
                // Give a proportional gain back to opponents
                var gain = -shift * 0.3;
                if (voteKey !== 'D' && county.v.D !== undefined) {
                    county.v.D = Math.min(98, county.v.D + gain);
                }
                if (voteKey !== 'R' && county.v.R !== undefined) {
                    county.v.R = Math.min(98, county.v.R + gain);
                }
            }
        }
    }
}

// Normalize all county vote shares so totals remain coherent (no negatives, no >100 incoherence)
function _normalizeAllCountyVotes() {
    for (var fips in Counties.countyData) {
        var county = Counties.countyData[fips];
        if (!county.v) continue;
        var total = (county.v.D || 0) + (county.v.R || 0) + (county.v.G || 0) +
                    (county.v.L || 0) + (county.v.I || 0) + (county.v.PSL || 0);
        if (total > 0 && (total > BUFF_CONSTANTS.VOTE_NORMALIZE_MAX || total < BUFF_CONSTANTS.VOTE_NORMALIZE_MIN)) {
            county.v.D   = (county.v.D   || 0) / total * 100;
            county.v.R   = (county.v.R   || 0) / total * 100;
            county.v.G   = (county.v.G   || 0) / total * 100;
            county.v.L   = (county.v.L   || 0) / total * 100;
            county.v.I   = (county.v.I   || 0) / total * 100;
            county.v.PSL = (county.v.PSL || 0) / total * 100;
        }
    }
}

// Handle third-party toggle change
function toggleThirdParties(enabled) {
    gameData.thirdPartiesEnabled = enabled;
    
    // Reapply third-party toggle to all counties
    if (typeof Counties !== 'undefined' && Counties.countyData) {
        for (var fips in Counties.countyData) {
            Counties.applyThirdPartyToggle(Counties.countyData[fips]);
        }
        
        // Recalculate all state margins
        for (var code in gameData.states) {
            Counties.updateStateFromCounties(code);
        }
        
        // Update display if in game
        if (typeof Campaign !== 'undefined' && Campaign.colorMap) {
            Campaign.colorMap();
        }
        
        console.log('✓ Third-party toggle updated: ' + (enabled ? 'ENABLED' : 'DISABLED'));
    }
}

// Build the list of all active presidential candidates with their vote keys
function _buildActiveCandidatesList() {
    var list = [];
    if (gameData.selectedParty && gameData.candidate) {
        list.push({ id: gameData.candidate.id, name: gameData.candidate.name, party: gameData.selectedParty, voteKey: gameData.selectedParty });
    }
    if (gameData.demTicket && gameData.demTicket.pres && gameData.selectedParty !== 'D') {
        list.push({ id: gameData.demTicket.pres.id, name: gameData.demTicket.pres.name, party: 'D', voteKey: 'D' });
    }
    if (gameData.repTicket && gameData.repTicket.pres && gameData.selectedParty !== 'R') {
        list.push({ id: gameData.repTicket.pres.id, name: gameData.repTicket.pres.name, party: 'R', voteKey: 'R' });
    }
    if (gameData.thirdPartiesEnabled && gameData.thirdTickets) {
        var tpCodes = ['PSL', 'G', 'L', 'I'];
        for (var tp = 0; tp < tpCodes.length; tp++) {
            var tpCode = tpCodes[tp];
            if (gameData.selectedParty !== tpCode && gameData.thirdTickets[tpCode] && gameData.thirdTickets[tpCode].pres) {
                list.push({ id: gameData.thirdTickets[tpCode].pres.id, name: gameData.thirdTickets[tpCode].pres.name, party: tpCode, voteKey: tpCode });
            }
        }
    }
    return list;
}

// Initialize per-group turnout tracking (baseline 1.0 = 100%)
function initInterestGroupTurnout() {
    if (!gameData.interestGroupTurnout) {
        gameData.interestGroupTurnout = {};
    }
    if (typeof INTEREST_GROUPS === 'undefined') return;
    for (var groupId in INTEREST_GROUPS) {
        if (!gameData.interestGroupTurnout[groupId]) {
            gameData.interestGroupTurnout[groupId] = 1.0;
        }
    }
}

// Update group turnout propensity based on issue campaigning
// Called from persuasion system whenever an issue-based action is applied
function updateGroupTurnoutFromIssue(issueId, partyCode, intensity) {
    if (!gameData.interestGroupTurnout) initInterestGroupTurnout();
    if (typeof INTEREST_GROUPS === 'undefined') return;

    for (var groupId in INTEREST_GROUPS) {
        var group = INTEREST_GROUPS[groupId];
        if (!group.priorities) continue;

        var idx = group.priorities.indexOf(issueId);
        if (idx === -1) continue; // Issue not a priority for this group

        // Importance decreases by priority rank
        var importance = idx === 0 ? 1.0 : (idx === 1 ? 0.7 : 0.4);

        // Alignment: does this party/campaign direction match the group's lean?
        var groupBaseline = group.baseline || 0;
        // Negative baseline = D-lean, positive = R-lean
        var partySign = (partyCode === 'D') ? -1 : ((partyCode === 'R') ? 1 : 0);
        var aligned = (groupBaseline * partySign > 0) ? 1 : (groupBaseline * partySign < 0 ? -1 : 0);

        // Sustained favorable campaigning increases turnout; opposing decreases it
        var delta = aligned * importance * BUFF_CONSTANTS.GROUP_TURNOUT_RATE * (intensity || 1);
        gameData.interestGroupTurnout[groupId] = Math.max(BUFF_CONSTANTS.MIN_GROUP_TURNOUT,
            Math.min(BUFF_CONSTANTS.MAX_GROUP_TURNOUT, (gameData.interestGroupTurnout[groupId] || 1.0) + delta));
    }
}

// Initialize interest group support — delegates immediately to the live recompute
function initializeInterestGroupSupport() {
    gameData.interestGroupSupport = {};
    gameData.interestGroupChanges = {};
    // Actual values are populated by recomputeInterestGroupSupport() which is called
    // right after applyCandidateBuffs() in startGame, once county data is loaded.
}

// Recompute TRUE current support for each interest group from county vote data.
// Aggregates across ALL counties weighted by county ig composition × population.
// Should be called after any event that changes county vote shares.
function recomputeInterestGroupSupport() {
    if (typeof Counties === 'undefined' || !Counties.countyData) return;
    if (typeof INTEREST_GROUPS === 'undefined') return;

    var activeCandidates = _buildActiveCandidatesList();
    if (activeCandidates.length === 0) return;

    for (var groupId in INTEREST_GROUPS) {
        if (!gameData.interestGroupSupport[groupId]) gameData.interestGroupSupport[groupId] = {};
        if (!gameData.interestGroupChanges[groupId])  gameData.interestGroupChanges[groupId] = {};

        var igKey = _mapGroupToIgKey(groupId);

        // Accumulate: for each candidate, sum of (group_population_in_county * candidate_vote_share_in_county)
        var candWeightedVotes = {};
        for (var ci = 0; ci < activeCandidates.length; ci++) {
            candWeightedVotes[activeCandidates[ci].id] = 0;
        }
        var totalGroupPop = 0;

        for (var fips in Counties.countyData) {
            var county = Counties.countyData[fips];
            if (!county.v || !county.p) continue;

            // Determine what share of this county belongs to the interest group
            var groupShare = 0;
            if (igKey !== null && igKey !== undefined && county.ig && county.ig[igKey] !== undefined) {
                groupShare = county.ig[igKey] / 100;
            } else if (groupId === 'urban') {
                groupShare = (county.t === 'Urban') ? 0.8 : (county.t === 'Mixed' ? 0.3 : 0.05);
            } else if (groupId === 'suburban') {
                groupShare = (county.t === 'Mixed') ? 0.6 : (county.t === 'Urban' ? 0.25 : 0.1);
            } else if (groupId === 'rural') {
                groupShare = (county.t === 'Rural') ? 0.9 : (county.t === 'Mixed' ? 0.35 : 0.05);
            } else if (groupId === 'noncollege' && county.ig && county.ig.college !== undefined) {
                groupShare = (100 - county.ig.college) / 100;
            } else if (groupId === 'youth') {
                groupShare = (county.t === 'Urban') ? 0.28 : (county.t === 'Mixed' ? 0.22 : 0.18);
            } else if (groupId === 'seniors') {
                groupShare = (county.t === 'Urban') ? 0.16 : (county.t === 'Mixed' ? 0.20 : 0.24);
            } else if (groupId === 'women') {
                groupShare = 0.51;
            } else if (groupId === 'bluecollar' && county.ig && county.ig.college !== undefined) {
                groupShare = ((100 - county.ig.college) / 100) * 0.6;
            } else {
                continue; // Cannot map this group to county data
            }

            if (groupShare <= 0) continue;

            var groupPop = county.p * groupShare;
            totalGroupPop += groupPop;

            // Total vote share in this county (to convert raw shares to fractions)
            var totalVoteShares = (county.v.D || 0) + (county.v.R || 0) + (county.v.G || 0) +
                                  (county.v.L || 0) + (county.v.I || 0) + (county.v.PSL || 0);
            if (totalVoteShares <= 0) continue;

            for (var ci2 = 0; ci2 < activeCandidates.length; ci2++) {
                var cand = activeCandidates[ci2];
                var vShare = (county.v[cand.voteKey] || 0) / totalVoteShares;
                candWeightedVotes[cand.id] += groupPop * vShare;
            }
        }

        if (totalGroupPop <= 0) continue;

        // Convert to percentages (normalize to 100% across active candidates)
        var totalWeightedVotes = 0;
        for (var ci3 = 0; ci3 < activeCandidates.length; ci3++) {
            totalWeightedVotes += candWeightedVotes[activeCandidates[ci3].id] || 0;
        }

        for (var ci4 = 0; ci4 < activeCandidates.length; ci4++) {
            var cand4 = activeCandidates[ci4];
            var prevSupport = gameData.interestGroupSupport[groupId][cand4.id] || 0;
            var newSupport = totalWeightedVotes > 0
                ? (candWeightedVotes[cand4.id] || 0) / totalWeightedVotes * 100
                : 0;
            gameData.interestGroupSupport[groupId][cand4.id] = newSupport;
            gameData.interestGroupChanges[groupId][cand4.id] = newSupport - prevSupport;
        }
    }

    console.log('✓ Interest group support recomputed from county data');
}

var app = {
    goToScreen: function(id) { Screens.goTo(id); },
    selParty: function(code) { Screens.selectParty(code); },
    setThirdParties: function(enabled) {
        gameData.thirdPartiesEnabled = enabled;
        var panels = document.querySelectorAll('.party-panel-minor');
        for (var i = 0; i < panels.length; i++) {
            panels[i].style.opacity = enabled ? '1' : '0.4';
            panels[i].style.pointerEvents = enabled ? '' : 'none';
        }
    },
    selCandidate: function(id) { Screens.selectCandidate(id); },
    selVP: function(id) { Screens.selectVP(id); },
    startGame: function() { startGame(); },
    handleAction: function(action) { Campaign.handleAction(action); },
    openStateBio: function() { Campaign.openStateBio(); },
    nextWeek: function() { Campaign.nextWeek(); },
    undoLastAction: function() { Campaign.undoLastAction(); },
    closeCountyView: function() { Counties.closeCountyView(); },
    openCountyView: function() { 
        if (gameData.selectedState && typeof Counties !== 'undefined') {
            Counties.openCountyView(gameData.selectedState);
        }
    },
    openIssuesPanel: function() {
        if (!gameData.selectedState) {
            Utils.showToast("Select a state first!");
            return;
        }
        document.getElementById('issues-modal').classList.remove('hidden');
        this.renderIssuesPanel();
    },
    closeIssuesPanel: function() {
        document.getElementById('issues-modal').classList.add('hidden');
    },
    renderIssuesPanel: function() {
        var showThirdParty = document.getElementById('show-third-party-toggle').checked;
        var state = gameData.states[gameData.selectedState];
        var stateCode = gameData.selectedState;
        
        document.getElementById('issues-modal-title').innerText = 'ISSUE POSITIONS - ' + state.name;
        
        var issuesHtml = '';
        var categories = ['Economic', 'Social', 'Healthcare', 'Environment', 'Foreign', 'Governance'];
        
        for (var c = 0; c < categories.length; c++) {
            var category = categories[c];
            var categoryIssues = CORE_ISSUES.filter(function(issue) {
                return issue.category === category;
            });
            
            if (categoryIssues.length > 0) {
                issuesHtml += '<div class="issue-category-header">' + category + '</div>';
                
                for (var i = 0; i < categoryIssues.length; i++) {
                    var issue = categoryIssues[i];
                    var isLocked = gameData.lockedIssues && gameData.lockedIssues[issue.id];
                    
                    issuesHtml += '<div class="issue-item">';
                    issuesHtml += '<h3>' + issue.name;
                    if (isLocked) {
                        issuesHtml += ' <span class="pac-locked-badge">LOCKED</span>';
                    }
                    issuesHtml += '</h3>';
                    issuesHtml += '<div class="issue-scale">';
                    
                    // Get positions
                    var statePos = (STATE_ISSUE_POSITIONS[stateCode] && STATE_ISSUE_POSITIONS[stateCode][issue.id]) || 0;
                    var playerPos = (gameData.candidate.issuePositions && gameData.candidate.issuePositions[issue.id]) || 0;
                    
                    // Convert positions from -10 to +10 to percentage for positioning
                    var stateLeft = ((statePos + 10) / 20) * 100;
                    var playerLeft = ((playerPos + 10) / 20) * 100;
                    
                    // State marker
                    issuesHtml += '<div class="issue-marker state" style="left: ' + stateLeft + '%" title="' + state.name + ' voters: ' + statePos + '"></div>';
                    
                    // Player marker
                    var playerColor = gameData.selectedParty === 'D' ? 'dem' : (gameData.selectedParty === 'R' ? 'rep' : '');
                    issuesHtml += '<div class="issue-marker player ' + playerColor + '" style="left: ' + playerLeft + '%" title="Your position: ' + playerPos + '"></div>';
                    
                    // ALWAYS show Democrat and Republican positions
                    var demPos = (gameData.demTicket.pres && gameData.demTicket.pres.issuePositions && gameData.demTicket.pres.issuePositions[issue.id]) || 0;
                    var repPos = (gameData.repTicket.pres && gameData.repTicket.pres.issuePositions && gameData.repTicket.pres.issuePositions[issue.id]) || 0;
                    
                    // Show Democrat position (unless player is Democrat)
                    if (gameData.selectedParty !== 'D') {
                        var demLeft = ((demPos + 10) / 20) * 100;
                        issuesHtml += '<div class="issue-marker dem" style="left: ' + demLeft + '%" title="Democrat: ' + demPos + '"></div>';
                    }
                    
                    // Show Republican position (unless player is Republican)
                    if (gameData.selectedParty !== 'R') {
                        var repLeft = ((repPos + 10) / 20) * 100;
                        issuesHtml += '<div class="issue-marker rep" style="left: ' + repLeft + '%" title="Republican: ' + repPos + '"></div>';
                    }
                    
                    // Show OTHER third party candidates only when toggle is on
                    if (showThirdParty) {
                        // If player is third party, show their position as player marker already
                        // So we don't need to show it again here
                        
                        // For now, this is where we'd add other third party candidates
                        // that are NOT the player, Democrat, or Republican
                    }
                    
                    issuesHtml += '</div>'; // close issue-scale
                    issuesHtml += '<div class="issue-labels"><span>Progressive (-10)</span><span>Center (0)</span><span>Conservative (+10)</span></div>';
                    
                    // Add shift position button if not locked
                    if (!isLocked) {
                        issuesHtml += '<div style="margin-top: 10px; text-align: center;">';
                        issuesHtml += '<button class="speech-issue-btn" style="padding: 8px 15px; display: inline-block; width: auto;" onclick="app.shiftIssuePosition(\'' + issue.id + '\')">Shift Position</button>';
                        issuesHtml += '</div>';
                    }
                    
                    issuesHtml += '</div>'; // close issue-item
                }
            }
        }
        
        document.getElementById('issues-scales').innerHTML = issuesHtml;
    },
    openNationalOverview: function() {
        document.getElementById('national-modal').classList.remove('hidden');
        this.renderNationalOverview();
    },
    closeNationalOverview: function() {
        document.getElementById('national-modal').classList.add('hidden');
    },
    renderNationalOverview: function() {
        // Calculate popular vote
        var totalVotes = { D: 0, R: 0, other: 0 };
        var tossupStates = [];
        
        for (var code in gameData.states) {
            var s = gameData.states[code];
            if (Math.abs(s.margin) < 3) {
                tossupStates.push(s);
            }
            
            // Rough popular vote calculation based on state population and margins
            var stateVotes = s.ev * 500000; // Rough estimate
            if (s.margin > 0) {
                totalVotes.D += stateVotes * (0.5 + s.margin / 100);
                totalVotes.R += stateVotes * (0.5 - s.margin / 100);
            } else {
                totalVotes.R += stateVotes * (0.5 + Math.abs(s.margin) / 100);
                totalVotes.D += stateVotes * (0.5 - Math.abs(s.margin) / 100);
            }
        }
        
        var total = totalVotes.D + totalVotes.R + totalVotes.other;
        var demPct = (totalVotes.D / total * 100).toFixed(1);
        var repPct = (totalVotes.R / total * 100).toFixed(1);
        
        document.getElementById('popular-vote-display').innerHTML = 
            '<div class="vote-row"><span style="color: #00AEF3;">Democrat</span><span>' + demPct + '%</span></div>' +
            '<div class="vote-row"><span style="color: #E81B23;">Republican</span><span>' + repPct + '%</span></div>';
        
        // Electoral projection
        var demEV = 0, repEV = 0;
        for (var code2 in gameData.states) {
            var state = gameData.states[code2];
            if (state.margin > 0) demEV += state.ev;
            else repEV += state.ev;
        }
        
        document.getElementById('electoral-projection-display').innerHTML = 
            '<div class="vote-row"><span style="color: #00AEF3;">Democrat</span><span>' + demEV + ' EV</span></div>' +
            '<div class="vote-row"><span style="color: #E81B23;">Republican</span><span>' + repEV + ' EV</span></div>' +
            '<div style="margin-top: 15px; text-align: center; font-size: 1.1rem; color: #ffd700;">Needed to Win: 270 EV</div>';
        
        // Toss-up states
        var tossupHtml = '';
        if (tossupStates.length === 0) {
            tossupHtml = '<div style="text-align: center; color: #666;">No toss-up states</div>';
        } else {
            for (var i = 0; i < tossupStates.length; i++) {
                tossupHtml += '<span class="tossup-state-item">' + tossupStates[i].name + ' (' + tossupStates[i].ev + ')</span>';
            }
        }
        document.getElementById('tossup-states-list').innerHTML = tossupHtml;
    },
    openSpeechModal: function() {
        if (!gameData.selectedState) {
            Utils.showToast("Select a state first!");
            return;
        }
        
        var state = gameData.states[gameData.selectedState];
        var stateCode = gameData.selectedState;
        
        // Get top issues for the state
        var issueSource = CORE_ISSUES;
        var issuesHtml = '';
        
        for (var i = 0; i < issueSource.length; i++) {
            var issue = issueSource[i];
            var statePos = (STATE_ISSUE_POSITIONS[stateCode] && STATE_ISSUE_POSITIONS[stateCode][issue.id]) || 0;
            var candidatePos = (gameData.candidate.issuePositions && gameData.candidate.issuePositions[issue.id]) || 0;
            var alignment = 1 - (Math.abs(statePos - candidatePos) / 20);
            
            var alignmentText = '';
            var alignmentClass = '';
            if (alignment > 0.7) {
                alignmentText = 'Excellent alignment with ' + state.name + ' voters';
                alignmentClass = 'good';
            } else if (alignment > 0.4) {
                alignmentText = 'Good alignment with ' + state.name + ' voters';
                alignmentClass = 'good';
            } else {
                alignmentText = 'Weak alignment with ' + state.name + ' voters';
                alignmentClass = 'poor';
            }
            
            issuesHtml += '<button class="speech-issue-btn" onclick="app.handleSpeechWithIntensity(\'' + issue.id + '\')">';
            issuesHtml += issue.name;
            issuesHtml += '<span class="issue-alignment ' + alignmentClass + '">' + alignmentText + '</span>';
            issuesHtml += '</button>';
        }
        
        document.getElementById('speech-issues-list').innerHTML = issuesHtml;
        document.getElementById('speech-modal').classList.remove('hidden');
    },
    
    handleSpeechWithIntensity: function(issueId) {
        var intensitySelect = document.getElementById('speech-intensity-select');
        var intensity = parseInt(intensitySelect.value) || 1;
        Campaign.handleSpeech(issueId, intensity);
    },
    
    closeSpeechModal: function() {
        document.getElementById('speech-modal').classList.add('hidden');
    },
    
    // Queue an ad action
    queueAd: function() {
        if (!gameData.selectedState) {
            Utils.showToast("Select a state first!");
            return;
        }
        
        var issueSelect = document.getElementById('ad-issue-select');
        var intensitySelect = document.getElementById('ad-intensity-select');
        
        var issueId = issueSelect.value;
        var intensity = parseInt(intensitySelect.value);
        
        if (!issueId) {
            Utils.showToast("Please select an issue!");
            return;
        }
        
        var cost = intensity * PERSUASION_CONSTANTS.AD_BASE_COST;
        
        var action = {
            type: 'AD',
            state: gameData.selectedState,
            issueId: issueId,
            intensity: intensity,
            cost: {
                funds: cost,
                energy: PERSUASION_CONSTANTS.AD_ENERGY_COST
            }
        };
        
        if (typeof Persuasion !== 'undefined' && Persuasion.queueAction(action)) {
            var issue = CORE_ISSUES.find(function(i) { return i.id === issueId; });
            var issueName = issue ? issue.name : issueId;
            Utils.showToast("Ad queued: " + issueName + " (Intensity: " + intensity + ")");
            Utils.addLog("Queued ad on " + issueName + " in " + gameData.states[gameData.selectedState].name);
            this.updateQueuedAdsDisplay();
        }
    },
    
    // Update queued ads display
    updateQueuedAdsDisplay: function() {
        var display = document.getElementById('queued-ads-display');
        if (!display) return;
        
        if (gameData.pendingActions && gameData.pendingActions.length > 0) {
            var summary = Persuasion.getPendingActionsSummary();
            display.innerHTML = '<small>' + summary + '</small>';
            display.classList.add('has-queued');
        } else {
            display.innerHTML = '<small>No ads queued this turn</small>';
            display.classList.remove('has-queued');
        }
    },
    
    // Initialize ad issue dropdown
    initAdIssueDropdown: function() {
        var select = document.getElementById('ad-issue-select');
        if (!select) return;
        
        select.innerHTML = '<option value="">Select Issue...</option>';
        
        for (var i = 0; i < CORE_ISSUES.length; i++) {
            var issue = CORE_ISSUES[i];
            var option = document.createElement('option');
            option.value = issue.id;
            option.textContent = issue.name;
            select.appendChild(option);
        }
    },
    
    // PAC Endorsement System
    triggerPacOffer: function() {
        if (typeof PACS === 'undefined') return;
        
        // Don't offer if we already have too many endorsements
        if (gameData.pacEndorsements.length >= 3) return;
        
        // Random chance to trigger PAC offer during gameplay
        var pacKeys = Object.keys(PACS);
        var eligiblePacs = [];
        
        for (var i = 0; i < pacKeys.length; i++) {
            var pacId = pacKeys[i];
            var pac = PACS[pacId];
            
            // Check if already endorsed
            var alreadyEndorsed = false;
            for (var j = 0; j < gameData.pacEndorsements.length; j++) {
                if (gameData.pacEndorsements[j] === pacId) {
                    alreadyEndorsed = true;
                    break;
                }
            }
            
            if (!alreadyEndorsed) {
                // Check alignment with candidate position
                var candidatePos = (gameData.candidate.issuePositions && gameData.candidate.issuePositions[pac.priority_issue]) || 0;
                var alignment = 1 - (Math.abs(candidatePos - pac.desired_position) / 20);
                
                // PAC will only offer if alignment is reasonable (>40%)
                if (alignment > 0.4) {
                    eligiblePacs.push(pacId);
                }
            }
        }
        
        if (eligiblePacs.length > 0) {
            // Select random eligible PAC
            var selectedPac = eligiblePacs[Math.floor(Math.random() * eligiblePacs.length)];
            gameData.currentPacOffer = selectedPac;
            this.showPacOffer(selectedPac);
        }
    },
    showPacOffer: function(pacId) {
        var pac = PACS[pacId];
        if (!pac) return;
        
        var issue = CORE_ISSUES.find(function(i) { return i.id === pac.priority_issue; });
        var issueName = issue ? issue.name : pac.priority_issue;
        
        var candidatePos = (gameData.candidate.issuePositions && gameData.candidate.issuePositions[pac.priority_issue]) || 0;
        
        var html = '';
        html += '<div class="pac-detail-item">';
        html += '<strong>' + pac.name + '</strong>';
        html += '<p>' + pac.description + '</p>';
        html += '</div>';
        
        html += '<div class="pac-detail-item">';
        html += '<strong>Contribution: $' + pac.contribution + 'M</strong>';
        html += '<p>One-time campaign contribution</p>';
        html += '</div>';
        
        html += '<div class="pac-detail-item">';
        html += '<strong>Key Issue: ' + issueName + '</strong>';
        html += '<p>Your current position: ' + candidatePos + ' | Required position: ' + pac.desired_position + '</p>';
        html += '</div>';
        
        html += '<div class="pac-warning">';
        html += '<strong>⚠️ WARNING</strong>';
        html += '<p>Accepting this endorsement will LOCK your position on ' + issueName + '. You will not be able to shift your stance on this issue for the rest of the campaign.</p>';
        html += '<p>Declining will allow your opponent to receive this endorsement instead.</p>';
        html += '</div>';
        
        document.getElementById('pac-details').innerHTML = html;
        document.getElementById('pac-modal').classList.remove('hidden');
    },
    acceptPacEndorsement: function() {
        if (!gameData.currentPacOffer) return;
        
        var pac = PACS[gameData.currentPacOffer];
        
        // Add endorsement
        gameData.pacEndorsements.push(gameData.currentPacOffer);
        
        // Lock issue
        gameData.lockedIssues[pac.priority_issue] = true;
        
        // Add funds
        gameData.funds += pac.contribution;
        
        // Update candidate position to match PAC requirement (slight adjustment if needed)
        var candidatePos = gameData.candidate.issuePositions[pac.priority_issue] || 0;
        var positionDiff = Math.abs(candidatePos - pac.desired_position);
        if (positionDiff > 2) {
            // Move position closer to PAC requirement
            gameData.candidate.issuePositions[pac.priority_issue] = pac.desired_position;
        }
        
        Utils.addLog('Accepted endorsement from ' + pac.name + ' (+$' + pac.contribution + 'M)');
        Utils.showToast('PAC Endorsement: +$' + pac.contribution + 'M!');
        
        Campaign.updateHUD();
        this.closePacModal();
        gameData.currentPacOffer = null;
    },
    declinePacEndorsement: function() {
        if (!gameData.currentPacOffer) return;
        
        var pac = PACS[gameData.currentPacOffer];
        
        // Give endorsement to opponent (simplified - just log it)
        Utils.addLog('Declined ' + pac.name + ' endorsement. Opponent may receive it.');
        
        this.closePacModal();
        gameData.currentPacOffer = null;
    },
    closePacModal: function() {
        document.getElementById('pac-modal').classList.add('hidden');
    },
    // Issue Shift Mechanic
    shiftIssuePosition: function(issueId) {
        // Check if issue is locked
        if (gameData.lockedIssues && gameData.lockedIssues[issueId]) {
            Utils.showToast("This issue is locked by a PAC endorsement!");
            return;
        }
        
        var issue = CORE_ISSUES.find(function(i) { return i.id === issueId; });
        if (!issue) return;
        
        var currentPos = (gameData.candidate.issuePositions && gameData.candidate.issuePositions[issueId]) || 0;
        
        // Prompt for new position
        var newPosStr = prompt("Shift your position on " + issue.name + "\nCurrent: " + currentPos + "\nEnter new position (-10 to +10):", currentPos);
        
        if (newPosStr === null) return; // User cancelled
        
        var newPos = parseFloat(newPosStr);
        
        if (isNaN(newPos) || newPos < -10 || newPos > 10) {
            Utils.showToast("Invalid position! Must be between -10 and +10");
            return;
        }
        
        var shift = Math.abs(newPos - currentPos);
        
        if (shift < 1) {
            Utils.showToast("Position shift too small!");
            return;
        }
        
        // Calculate credibility penalty using constant
        var credibilityPenalty = shift * GAME_CONSTANTS.CREDIBILITY_PENALTY_MULTIPLIER;
        
        // Apply debuff to all states
        for (var code in gameData.states) {
            if (gameData.selectedParty === 'D') {
                gameData.states[code].margin -= credibilityPenalty;
            } else if (gameData.selectedParty === 'R') {
                gameData.states[code].margin += credibilityPenalty;
            }
        }
        
        // Update position
        if (!gameData.candidate.issuePositions) {
            gameData.candidate.issuePositions = {};
        }
        gameData.candidate.issuePositions[issueId] = newPos;
        
        Utils.addLog("Shifted position on " + issue.name + " to " + newPos + " (credibility penalty: -" + credibilityPenalty.toFixed(1) + ")");
        Utils.showToast("Position shifted! Credibility penalty applied.");
        
        Campaign.colorMap();
        this.renderIssuesPanel();
    },
    
    openInterestGroups: function() {
        document.getElementById('interest-groups-modal').classList.remove('hidden');
        this.renderInterestGroups('all');
    },
    
    closeInterestGroups: function() {
        document.getElementById('interest-groups-modal').classList.add('hidden');
    },
    
    countyRally: function() {
        if (!gameData.selectedCounty) {
            Utils.showToast("Select a county first!");
            return;
        }
        Counties.rallyInCounty(gameData.selectedCounty);
    },
    
    countySpeech: function() {
        if (!gameData.selectedCounty) {
            Utils.showToast("Select a county first!");
            return;
        }
        // Open speech modal for county-specific campaigning
        Counties.openCountySpeechModal(gameData.selectedCounty);
    },
    
    filterInterestGroups: function(category) {
        // Update active tab
        var tabs = document.querySelectorAll('.ig-tab');
        for (var i = 0; i < tabs.length; i++) {
            tabs[i].classList.remove('active');
            if (tabs[i].getAttribute('data-category') === category) {
                tabs[i].classList.add('active');
            }
        }
        this.renderInterestGroups(category);
    },
    
    renderInterestGroups: function(category) {
        var html = '';
        
        if (category === 'pacs') {
            // Show PACs & Special Interest Groups section
            html += '<div class="ig-main-section-title">PAC\'S & SPECIAL INTEREST GROUPS</div>';
            html += '<div class="pacs-grid">';
            
            for (var pacId in PACS) {
                var pac = PACS[pacId];
                html += '<div class="pac-card">';
                
                // Placeholder for logo/image
                html += '<div class="ig-logo-placeholder">📊</div>';
                
                html += '<div class="pac-name">' + pac.name + '</div>';
                html += '<div class="pac-desc">' + pac.description + '</div>';
                
                // Show candidate support if available
                if (gameData.interestGroupSupport && gameData.interestGroupSupport[pacId]) {
                    html += '<div class="pac-support">';
                    html += this.renderCandidateSupport(pacId);
                    html += '</div>';
                }
                
                html += '<div class="pac-details">';
                html += '<div><strong>Priority Issue:</strong> ' + (pac.priority_issue || 'Various') + '</div>';
                html += '<div><strong>Contribution:</strong> $' + pac.contribution + 'M</div>';
                html += '</div>';
                html += '</div>';
            }
            
            html += '</div>';
        } else {
            // Show Voter Blocks section
            html += '<div class="ig-main-section-title">VOTER BLOCKS</div>';
            
            // Group interest groups by category for organized display
            var groupedByCategory = {};
            for (var groupId in INTEREST_GROUPS) {
                var group = INTEREST_GROUPS[groupId];
                
                if (category !== 'all' && group.category !== category) {
                    continue;
                }
                
                if (!groupedByCategory[group.category]) {
                    groupedByCategory[group.category] = [];
                }
                groupedByCategory[group.category].push({ id: groupId, group: group });
            }
            
            // Render each category
            for (var cat in groupedByCategory) {
                html += '<div class="ig-section-title">' + cat + '</div>';
                html += '<div class="ig-cards-container">';
                
                var groups = groupedByCategory[cat];
                for (var i = 0; i < groups.length; i++) {
                    var groupId = groups[i].id;
                    var group = groups[i].group;
                    
                    html += '<div class="ig-card">';
                    
                    // Placeholder for logo/image
                    html += '<div class="ig-logo-placeholder">👥</div>';
                    
                    html += '<div class="ig-name">' + group.name + '</div>';
                    
                    // Show per-group turnout (if tracked)
                    if (gameData.interestGroupTurnout && gameData.interestGroupTurnout[groupId] !== undefined) {
                        var turnoutPct = Math.round(gameData.interestGroupTurnout[groupId] * 100);
                        var turnoutColor = turnoutPct >= 110 ? '#198754' : (turnoutPct <= 90 ? '#E81B23' : '#ccc');
                        html += '<div class="ig-turnout" style="font-size:0.75em; color:' + turnoutColor + '; margin-bottom:4px;">Turnout: ' + turnoutPct + '%</div>';
                    }
                    
                    // Show candidate support (live, county-weighted)
                    if (gameData.interestGroupSupport && gameData.interestGroupSupport[groupId]) {
                        html += '<div class="ig-support">';
                        html += this.renderCandidateSupport(groupId);
                        html += '</div>';
                    }
                    
                    html += '</div>';
                }
                
                html += '</div>';
            }
        }
        
        document.getElementById('interest-groups-grid').innerHTML = html;
    },
    
    // Helper function to render candidate support for a group
    renderCandidateSupport: function(groupId) {
        var html = '';
        
        if (!gameData.interestGroupSupport || !gameData.interestGroupSupport[groupId]) {
            return html;
        }
        
        var groupSupport = gameData.interestGroupSupport[groupId];
        var groupChanges = gameData.interestGroupChanges[groupId] || {};
        
        // Get all candidates with their support values
        var candidates = [];
        for (var candId in groupSupport) {
            var candInfo = this.getCandidateInfo(candId);
            if (candInfo) {
                candidates.push({
                    id: candId,
                    name: candInfo.name,
                    party: candInfo.party,
                    support: groupSupport[candId],
                    change: groupChanges[candId] || 0
                });
            }
        }
        
        // Sort by support descending
        candidates.sort(function(a, b) { return b.support - a.support; });
        
        // Find max support for underlining
        var maxSupport = candidates.length > 0 ? candidates[0].support : 0;
        
        // Render each candidate
        for (var i = 0; i < candidates.length; i++) {
            var cand = candidates[i];
            var partyColor = this.getPartyColor(cand.party);
            var isLeader = (Math.abs(cand.support - maxSupport) < 0.01);
            
            html += '<div class="candidate-support-row">';
            
            // Candidate image in circle
            html += '<img src="images/' + cand.id + '.jpg" class="candidate-support-img" onerror="this.src=\'images/scenario.jpg\'">';
            
            // Candidate name and support percentage (party colored)
            var nameStyle = 'color: ' + partyColor + ';';
            if (isLeader) {
                nameStyle += ' text-decoration: underline;';
            }
            html += '<span class="candidate-support-name" style="' + nameStyle + '">' + cand.name + ': </span>';
            
            // Support percentage (party colored, underlined if leader)
            var supportStyle = 'color: ' + partyColor + ';';
            if (isLeader) {
                supportStyle += ' text-decoration: underline; font-weight: bold;';
            }
            html += '<span class="candidate-support-pct" style="' + supportStyle + '">' + cand.support.toFixed(1) + '%</span>';
            
            // Change indicator (very small, color coded)
            if (cand.change !== 0) {
                var changeColor = cand.change > 0 ? '#00ff00' : (cand.change < 0 ? '#ff0000' : '#ffff00');
                var changeText = (cand.change > 0 ? '+' : '') + cand.change.toFixed(2);
                html += ' <span class="candidate-support-change" style="color: ' + changeColor + '; font-size: 0.65em;">(' + changeText + ')</span>';
            }
            
            html += '</div>';
        }
        
        return html;
    },
    
    // Helper to get candidate info
    getCandidateInfo: function(candId) {
        // Check player
        if (gameData.candidate && gameData.candidate.id === candId) {
            return {
                name: gameData.candidate.name,
                party: gameData.selectedParty
            };
        }
        
        // Check democrat ticket
        if (gameData.demTicket.pres && gameData.demTicket.pres.id === candId) {
            return {
                name: gameData.demTicket.pres.name,
                party: 'D'
            };
        }
        
        // Check republican ticket
        if (gameData.repTicket.pres && gameData.repTicket.pres.id === candId) {
            return {
                name: gameData.repTicket.pres.name,
                party: 'R'
            };
        }
        
        // Check if it's a third party candidate
        if (candId === 'stein') {
            return { name: 'Jill Stein', party: 'G' };
        }
        if (candId === 'oliver') {
            return { name: 'Chase Oliver', party: 'L' };
        }
        
        // Fallback - check CANDIDATES array
        for (var i = 0; i < CANDIDATES.length; i++) {
            if (CANDIDATES[i].id === candId) {
                return {
                    name: CANDIDATES[i].name,
                    party: CANDIDATES[i].party
                };
            }
        }
        
        return null;
    },
    
    // Helper to get party color
    getPartyColor: function(party) {
        var colors = {
            'D': '#00AEF3',
            'R': '#E81B23',
            'G': '#198754',
            'L': '#fd7e14',
            'I': '#9B59B6',
            'PSL': '#CC0000'
        };
        return colors[party] || '#888';
    },
    
    election: {
        togglePause: function() { Election.togglePause(); },
        setSpeed: function(s) { Election.setSpeed(s); },
        setMapMode: function(m) { Election.setMapMode(m); },
        closeWinnerOverlay: function() { Election.closeWinnerOverlay(); }
    }
};

document.addEventListener('DOMContentLoaded', function() {
    initGameData();
});
