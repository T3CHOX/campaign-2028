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
    gameData.liveGroups = JSON.parse(JSON.stringify(INTEREST_GROUPS));
    initializeInterestGroupSupport();
    
    // --- V2 ISSUE SYSTEM INIT ---
    // Init Dynamic Salience
    if (typeof ISSUE_SALIENCE !== 'undefined') {
        gameData.issueSalience = JSON.parse(JSON.stringify(ISSUE_SALIENCE));
    }
    
    // Init Candidate Issue Credibility
    if (typeof BASE_ISSUE_CREDIBILITY !== 'undefined') {
        if (!gameData.candidate.issueCredibility) {
            var p = gameData.selectedParty;
            var baseCred = (p === 'D' || p === 'R') ? BASE_ISSUE_CREDIBILITY[p] : BASE_ISSUE_CREDIBILITY['D'];
            gameData.candidate.issueCredibility = JSON.parse(JSON.stringify(baseCred));
        }
        
        // Init opponent credibility
        if (gameData.demTicket.pres && !gameData.demTicket.pres.issueCredibility) {
            gameData.demTicket.pres.issueCredibility = JSON.parse(JSON.stringify(BASE_ISSUE_CREDIBILITY['D']));
        }
        if (gameData.repTicket.pres && !gameData.repTicket.pres.issueCredibility) {
            gameData.repTicket.pres.issueCredibility = JSON.parse(JSON.stringify(BASE_ISSUE_CREDIBILITY['R']));
        }
    }
    
    // Initialize new subsystems
    if (typeof GroundOps !== 'undefined') GroundOps.initGroundOps();
    if (typeof DigitalAds !== 'undefined') DigitalAds.initDigitalAds();
    if (typeof Endorsers !== 'undefined') Endorsers.init();
    
    // Initialize per-group turnout tracking
    initInterestGroupTurnout();
    if (typeof initCoalitionStatus === 'function') {
        initCoalitionStatus();
    }
    if (typeof recomputeCoalitionTurnout === 'function') {
        recomputeCoalitionTurnout();
    }
    if (typeof updateCoalitionLoyalty === 'function') {
        updateCoalitionLoyalty();
    }
    gameData.favorability = FAVORABILITY_CONSTANTS.BASE;
    gameData.credibility = 1.0;
    gameData.messageStreak = 0;
    gameData.lastMessageIssue = null;
    
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
    GROUP_TURNOUT_DAMPENING: 0.004, // Scale factor: +5 mod with 100% group weight → +0.02 turnout multiplier
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

    // Hard cap: combined home-state + regional advantage per ticket per state (percentage points)
    var maxRegionalAdvantage = 4.0;

    for (var t = 0; t < allTickets.length; t++) {
        var ticket = allTickets[t];
        var voteKey = ticket.party;
        var pres = ticket.pres;
        var vp = ticket.vp;

        // Track accumulated regional boost per state for this ticket to enforce the cap
        var stateRegionalBoosts = {};

        // 1. Presidential home-state advantage — treated as percentage-point shift.
        // All presidential CANDIDATES have explicit homeStateBoost values (1.4–3.4).
        // Default 3.0 only applies if a candidate object is missing the property.
        if (pres && pres.homeState) {
            var presBoost = typeof pres.homeStateBoost === 'number' ? pres.homeStateBoost : 3.0;
            var cappedPresBoost = Math.min(presBoost, maxRegionalAdvantage);
            stateRegionalBoosts[pres.homeState] = (stateRegionalBoosts[pres.homeState] || 0) + cappedPresBoost;
            _applyStateBoostToCounties(pres.homeState, voteKey, cappedPresBoost);
        }

        // 2. VP home-state advantage — percentage-point shift, capped by remaining ticket allowance.
        // VPs typically don't define homeStateBoost; default 2.0 represents a modest home-state edge.
        if (vp && (vp.homeState || vp.state)) {
            var vpHome = vp.homeState || vp.state;
            var vpBoost = typeof vp.homeStateBoost === 'number' ? vp.homeStateBoost : 2.0;
            var vpAlready = stateRegionalBoosts[vpHome] || 0;
            var vpAllowance = Math.max(0, maxRegionalAdvantage - vpAlready);
            var actualVpBoost = Math.min(vpBoost, vpAllowance);
            if (actualVpBoost > 0) {
                stateRegionalBoosts[vpHome] = vpAlready + actualVpBoost;
                _applyStateBoostToCounties(vpHome, voteKey, actualVpBoost);
            }
        }

        // 3. Presidential group effects are handled dynamically in county vote calculations.
        if (pres && pres.siphonFromMajorParties) {
            // Apply siphon first so downstream boosts/debuffs can still move the post-siphon coalition.
            _applyMajorPartySiphonToCounties(voteKey, pres.siphonFromMajorParties);
        }

        // 4. VP group effects are handled dynamically in county vote calculations.

        // 5. Special named buffs (deterministic)
        if (pres && pres.buff === 'Midwest Appeal') {
            var midwestStates = ['MI', 'WI', 'MN', 'OH', 'IL', 'IN', 'IA', 'MO'];
            for (var mi = 0; mi < midwestStates.length; mi++) {
                _applyStateBoostToCounties(midwestStates[mi], voteKey, 3);
            }
        }

        if (pres && pres.buff === 'Working Class Hero') {
            for (var fips in Counties.countyData) {
                var county = Counties.countyData[fips];
                if (!county || !county.ig || !county.v) continue;
                
                var blueCollar = county.ig['bluecollar'] || 0;
                var nonCollege = county.ig['noncollege'] || 0;
                var white = county.ig['white'] || 0;
                var rural = county.ig['rural'] || 0;
                
                // Working class white concentration metric (0 to 1)
                var wcWhitePct = (white / 100) * ((blueCollar + nonCollege + rural) / 300);
                
                // If it's a heavily working-class white area
                if (wcWhitePct > 0.20) {
                    // Drastically shift the margin in-between (siphon from opponent to this candidate)
                    var shiftPoints = Math.round(wcWhitePct * 18); // Max ~12-15 point shift 
                    var oppKey = (voteKey === 'D') ? 'R' : 'D';
                    
                    var actualShift = Math.min((county.v[oppKey] || 0) - 1, shiftPoints);
                    if (actualShift > 0) {
                        county.v[oppKey] -= actualShift;
                        county.v[voteKey] = Math.min(98, (county.v[voteKey] || 0) + actualShift);
                    }
                    
                    // Surge turnout for this specific candidate's base
                    if (county.turnout) {
                        var turnoutSurge = wcWhitePct * 0.45; // Up to ~25% turnout multiplier surge
                        var role = (gameData.candidate && gameData.candidate.party === voteKey) ? 'player' : (voteKey === 'D' ? 'demOpponent' : 'repOpponent');
                        var maxTurnout = Counties.MAX_TURNOUT_MULTIPLIER || 1.3;
                        county.turnout[role] = Math.min(maxTurnout, (county.turnout[role] || 1) + turnoutSurge);
                    }
                }
            }
        }

        // 6. County-specific boosts for candidates with strong local ties
        if (pres) {
            _applyCountySpecificBoosts(pres, voteKey);
        }

        // 7. Regional spillover boosts — `regionalSpilloverBoost` is a percentage-point value applied
        // to each state listed in `regionalSpillover`. Capped by the ticket's remaining state allowance.
        if (pres && pres.regionalSpillover && pres.regionalSpillover.length) {
            var spilloverBoost = typeof pres.regionalSpilloverBoost === 'number' ? pres.regionalSpilloverBoost : 2.0;
            for (var si = 0; si < pres.regionalSpillover.length; si++) {
                var spillState = pres.regionalSpillover[si];
                var spillAlready = stateRegionalBoosts[spillState] || 0;
                var spillAllowance = Math.max(0, maxRegionalAdvantage - spillAlready);
                var actualSpill = Math.min(spilloverBoost, spillAllowance);
                if (actualSpill > 0) {
                    stateRegionalBoosts[spillState] = spillAlready + actualSpill;
                    _applyStateBoostToCounties(spillState, voteKey, actualSpill);
                }
            }
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
        // Fallback: scan for keys that normalize to the same 5-digit FIPS
        for (var key in Counties.countyData) {
            if (key.padStart(5, '0') === fips5) {
                county = Counties.countyData[key];
                console.warn('[FIPS] _applyCountyBoost: direct lookup missed for ' + fips5 + ', found via fallback key "' + key + '". Consider normalizing county data keys to 5-digit FIPS on load.');
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

function _applyMajorPartySiphonToCounties(voteKey, siphonFromMajorParties) {
    if (!siphonFromMajorParties) return;
    var maxVoteShare = 98; // Keep minor-party floor and avoid total lockout of other vote buckets.
    var siphonFromD = Math.max(0, Number(siphonFromMajorParties.D) || 0);
    var siphonFromR = Math.max(0, Number(siphonFromMajorParties.R) || 0);
    if (siphonFromD > 1) siphonFromD = siphonFromD / 100;
    if (siphonFromR > 1) siphonFromR = siphonFromR / 100;

    for (var fips in Counties.countyData) {
        var county = Counties.countyData[fips];
        if (!county || !county.v) continue;
        var fromD = (county.v.D || 0) * siphonFromD;
        var fromR = (county.v.R || 0) * siphonFromR;
        if (fromD <= 0 && fromR <= 0) continue;

        county.v.D = Math.max(0, (county.v.D || 0) - fromD);
        county.v.R = Math.max(0, (county.v.R || 0) - fromR);
        county.v[voteKey] = Math.min(maxVoteShare, (county.v[voteKey] || 0) + fromD + fromR);
    }
}

function _getCandidateGroupEffects(candidate) {
    if (!candidate) return {};
    if (candidate.groupEffects && typeof candidate.groupEffects === 'object') {
        return candidate.groupEffects;
    }

    var effects = {};

    function mergeLegacy(sourceMap) {
        if (!sourceMap) return;
        for (var groupId in sourceMap) {
            if (!sourceMap.hasOwnProperty(groupId)) continue;
            var value = Number(sourceMap[groupId]);
            if (!isFinite(value) || value === 0) continue;
            if (!effects[groupId]) {
                effects[groupId] = { support: 0, turnout: 0 };
            }
            effects[groupId].support += value;
            effects[groupId].turnout += value;
        }
    }

    mergeLegacy(candidate.groupBoosts);
    mergeLegacy(candidate.groupDebuffs);
    return effects;
}

function _getCandidateGroupEffectValue(candidate, groupId, effectKey) {
    var effects = _getCandidateGroupEffects(candidate);
    var effect = effects[groupId];
    if (!effect) return 0;
    var value = Number(effect[effectKey]);
    return isFinite(value) ? value : 0;
}

// County-level targeted boosts for candidates with specific local ties
function _applyCountySpecificBoosts(candidate, voteKey) {
    if (!candidate || !candidate.localBoosts || !candidate.localBoosts.length) return;

    for (var i = 0; i < candidate.localBoosts.length; i++) {
        var entry = candidate.localBoosts[i];
        if (!entry || !entry.fips || typeof entry.boost !== 'number') continue;
        _applyCountyBoost(entry.fips.padStart(5, '0'), voteKey, entry.boost);
    }
}

// Regional spillover boosts for candidates with Rust Belt / Southern / regional ties
function _applyRegionalSpillover(pres, voteKey) {
    if (!pres || !pres.regionalSpillover || !pres.regionalSpillover.length) return;

    var spilloverBoost = (typeof pres.regionalSpilloverBoost === 'number') ? pres.regionalSpilloverBoost : 2;
    for (var i = 0; i < pres.regionalSpillover.length; i++) {
        _applyStateBoostToCounties(pres.regionalSpillover[i], voteKey, spilloverBoost);
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

// Map INTEREST_GROUPS keys → county ig keys
function _normalizeGroupTag(groupId) {
    // Normalize demographic/group tags to canonical lookup form.
    // Example: "Suburban College" / "suburban-college" -> "suburban_college".
    return (groupId || '').toLowerCase().replace(/[\s-]+/g, '_');
}

var GROUP_TAG_ALIASES = {
    independents: 'independent',
    small_business: 'smallbusiness',
    blue_collar: 'bluecollar',
    latino: 'hispanic',
    lgbtq_community: 'lgbtq'
};

function _mapGroupToIgKey(groupId) {
    var normalizedGroupId = _normalizeGroupTag(groupId);
    normalizedGroupId = GROUP_TAG_ALIASES[normalizedGroupId] || normalizedGroupId;
    var MAP = {
        'black':          'black',
        'hispanic':       'hispanic',
        'latino':         'hispanic',
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
        'seniors':        'seniors',
        'youth':          'youth',
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
        'white':          null,
        'lgbtq':          null,
        'veterans':       null,
        'suburban_college': null,
        'suburban_women': null,
        'suburban_moderates': null,
        'suburban_conservative': null,
        'midwest_noncollege': null,
        'progressive_left': null,
        'business_community': null,
        'media_consumers': null,
        'institutional_dems': null,
        'high_info_swing': null,
        'rural_whites': null,
        'moderate_dems': null,
        'college_liberals': null,
        'donor_conservative': null,
        'tech_conservative': null,
        'donor_antiestablishment': null,
        'donor_class': null,
        'antiestablishment': null,
        'hardcore_right': null,
        'online_militant': null,
        'blue_collar': null,
        'online_right': null,
        'hard_right': null,
        'antiwar_left': null,
        'environmentalists': null,
        'small_business': null,
        'antiwar_independents': null,
        'independents': null,
        'party_loyalists': null,
        'moderates': null,
        'alternative_media': null,
        'public_health_professionals': null,
        'latino_left': null,
        'labor_left': null,
        'national_security_hawks': null
    };
    return (normalizedGroupId in MAP) ? MAP[normalizedGroupId] : null;
}

function _getCountyIgValue(county, key) {
    if (county && county.ig && county.ig[key] !== undefined && county.ig[key] !== null) {
        return Math.max(0, Math.min(100, county.ig[key])) / 100;
    }
    if (key === 'youth') {
        var tierYouth = county && county.t ? county.t : 'Suburban/Mixed';
        if (tierYouth === 'Highly Urban') return 0.28;
        if (tierYouth === 'Urban/Dense Suburban') return 0.24;
        if (tierYouth === 'Suburban/Mixed') return 0.22;
        if (tierYouth === 'Rural/Small Town') return 0.20;
        return 0.18;
    }
    if (key === 'seniors') {
        var tierSeniors = county && county.t ? county.t : 'Suburban/Mixed';
        if (tierSeniors === 'Highly Urban') return 0.16;
        if (tierSeniors === 'Urban/Dense Suburban') return 0.19;
        if (tierSeniors === 'Suburban/Mixed') return 0.20;
        if (tierSeniors === 'Rural/Small Town') return 0.22;
        return 0.24;
    }
    if (!county || !county.ig || county.ig[key] === undefined || county.ig[key] === null) return 0;
    return Math.max(0, Math.min(100, county.ig[key])) / 100;
}

function _getCountyUrbanIndex(county) {
    var tier = county && county.t ? county.t : 'Suburban/Mixed';
    if (tier === 'Highly Urban') return 1.0;
    if (tier === 'Urban/Dense Suburban') return 0.7;
    if (tier === 'Suburban/Mixed') return 0.4;
    if (tier === 'Rural/Small Town') return 0.1;
    return 0.0;
}

function _getCountySuburbanIndex(county) {
    var tier = county && county.t ? county.t : 'Suburban/Mixed';
    if (tier === 'Highly Urban') return 0.2;
    if (tier === 'Urban/Dense Suburban') return 0.9;
    if (tier === 'Suburban/Mixed') return 0.8;
    if (tier === 'Rural/Small Town') return 0.3;
    return 0.0;
}

function _getCountyRuralIndex(county) {
    var tier = county && county.t ? county.t : 'Suburban/Mixed';
    if (tier === 'Highly Urban') return 0.0;
    if (tier === 'Urban/Dense Suburban') return 0.1;
    if (tier === 'Suburban/Mixed') return 0.4;
    if (tier === 'Rural/Small Town') return 0.8;
    return 1.0;
}

function _getCountyTierGroupWeight(county, groupType) {
    var tier = county && county.t ? county.t : 'Suburban/Mixed';
    if (groupType === 'urban') {
        if (tier === 'Highly Urban') return 0.95;
        if (tier === 'Urban/Dense Suburban') return 0.70;
        if (tier === 'Suburban/Mixed') return 0.35;
        if (tier === 'Rural/Small Town') return 0.10;
        return 0.02;
    }
    if (groupType === 'suburban') {
        if (tier === 'Highly Urban') return 0.15;
        if (tier === 'Urban/Dense Suburban') return 0.80;
        if (tier === 'Suburban/Mixed') return 0.65;
        if (tier === 'Rural/Small Town') return 0.25;
        return 0.05;
    }
    if (groupType === 'rural') {
        if (tier === 'Highly Urban') return 0.02;
        if (tier === 'Urban/Dense Suburban') return 0.15;
        if (tier === 'Suburban/Mixed') return 0.40;
        if (tier === 'Rural/Small Town') return 0.75;
        return 0.95;
    }
    return 0;
}

function _countyInRegion(county, regionName) {
    if (!county || !county.s || typeof REGIONS === 'undefined' || !REGIONS[regionName]) return false;
    return REGIONS[regionName].indexOf(county.s) !== -1;
}

// Interprets composite demographic tags from candidate data into county-weighted modifier values.
// Returns a numeric scaled modifier for recognized tags, or null to trigger fallback handling.
function calculateCompositeTag(tag, value, county) {
    var normalizedTag = _normalizeGroupTag(tag);
    var urbanIndex = _getCountyUrbanIndex(county);
    var suburbanIndex = _getCountySuburbanIndex(county);
    var ruralShare = _getCountyIgValue(county, 'rural');
    var hasExplicitRuralShare = !!(county && county.ig && county.ig.rural !== undefined && county.ig.rural !== null);
    if (!hasExplicitRuralShare) ruralShare = _getCountyRuralIndex(county);
    var collegeShare = _getCountyIgValue(county, 'college');
    var nonCollegeShare = 1 - collegeShare;
    var centristShare = _getCountyIgValue(county, 'centrist');
    var progressiveShare = _getCountyIgValue(county, 'progressive');
    var evangelicalShare = _getCountyIgValue(county, 'evangelical');
    var magaShare = _getCountyIgValue(county, 'maga');
    var unionShare = _getCountyIgValue(county, 'union');
    var secularShare = _getCountyIgValue(county, 'secular');
    var donorClassWeight = collegeShare * (0.4 + (urbanIndex * 0.6)) * (1 - (ruralShare * 0.5));
    normalizedTag = GROUP_TAG_ALIASES[normalizedTag] || normalizedTag;

    switch (normalizedTag) {
        case 'midwest_noncollege':
            return _countyInRegion(county, 'midwest') ? value * nonCollegeShare : 0;
        case 'suburban_college':
            return value * suburbanIndex * collegeShare;
        case 'donor_class':
            return value * donorClassWeight;
        case 'suburban_moderates':
            return value * suburbanIndex * ((centristShare * 0.7) + (collegeShare * 0.3));
        case 'moderates':
        case 'moderate':
            return value * ((centristShare * 0.7) + (suburbanIndex * 0.3));
        case 'independent':
            return value * ((centristShare * 0.65) + (_getCountyIgValue(county, 'libertarian') * 0.2) + (suburbanIndex * 0.15));
        case 'smallbusiness':
            return value * ((nonCollegeShare * 0.45) + (suburbanIndex * 0.35) + (ruralShare * 0.2));
        case 'suburban_women':
            return value * suburbanIndex * 0.51;
        case 'suburban_conservative':
            return value * suburbanIndex * ((evangelicalShare * 0.6) + (magaShare * 0.4));
        case 'progressive_left':
            return value * ((progressiveShare * 0.75) + (secularShare * 0.25));
        case 'moderate_dems':
            return value * ((centristShare * 0.6) + (unionShare * 0.25) + (_getCountyIgValue(county, 'black') * 0.15));
        case 'rural_whites':
            // Intentional approximation: uses major non-white shares as a conservative proxy to avoid adding new county columns.
            var majorNonWhiteShare = _getCountyIgValue(county, 'black') + _getCountyIgValue(county, 'hispanic') + _getCountyIgValue(county, 'asian');
            var ruralWhiteShareAdjustment = Math.max(0.05, 1 - (majorNonWhiteShare * 0.65));
            return value * ruralShare * nonCollegeShare * ruralWhiteShareAdjustment;
        case 'veterans':
            return value * ((ruralShare * 0.35) + (nonCollegeShare * 0.35) + (_countyInRegion(county, 'south') ? 0.2 : 0.1));
        case 'business_community':
            return value * ((collegeShare * 0.55) + (suburbanIndex * 0.2) + (urbanIndex * 0.25));
        case 'media_consumers':
            return value * Math.min(1, (urbanIndex * 0.6) + (suburbanIndex * 0.4));
        case 'institutional_dems':
            return value * ((unionShare * 0.4) + (collegeShare * 0.3) + (urbanIndex * 0.3));
        case 'high_info_swing':
            return value * collegeShare * suburbanIndex * ((centristShare * 0.6) + 0.4);
        case 'college_liberals':
            return value * collegeShare * ((progressiveShare * 0.7) + (secularShare * 0.3));
        case 'donor_conservative':
            return value * donorClassWeight * ((evangelicalShare * 0.55) + (magaShare * 0.45));
        case 'donor_antiestablishment':
            return value * donorClassWeight * ((magaShare * 0.6) + (_getCountyIgValue(county, 'libertarian') * 0.4));
        case 'tech_conservative':
            return value * (collegeShare * urbanIndex) * ((magaShare * 0.5) + (_getCountyIgValue(county, 'libertarian') * 0.5));
        case 'hardcore_right':
        case 'hard_right':
            return value * ((magaShare * 0.65) + (evangelicalShare * 0.35));
        case 'online_right':
        case 'online_militant':
            return value * ((magaShare * 0.55) + (nonCollegeShare * 0.25) + (suburbanIndex * 0.2));
        case 'antiestablishment':
            return value * ((magaShare * 0.45) + (progressiveShare * 0.2) + (_getCountyIgValue(county, 'libertarian') * 0.35));
        case 'antiwar_left':
            return value * ((progressiveShare * 0.7) + (_getCountyIgValue(county, 'youth') * 0.3));
        case 'environmentalists':
            return value * ((progressiveShare * 0.5) + (collegeShare * 0.25) + (_countyInRegion(county, 'west') ? 0.25 : 0.1));
        case 'antiwar_independents':
            return value * ((centristShare * 0.35) + (_getCountyIgValue(county, 'libertarian') * 0.4) + (progressiveShare * 0.25));
        case 'party_loyalists':
            return value * ((unionShare * 0.35) + (magaShare * 0.35) + (progressiveShare * 0.3));
        case 'public_health_professionals':
            return value * collegeShare * urbanIndex * 0.75;
        case 'national_security_hawks':
            return value * ((collegeShare * 0.45) + (evangelicalShare * 0.3) + (magaShare * 0.25));
        case 'latino_left':
            return value * _getCountyIgValue(county, 'hispanic') * ((progressiveShare * 0.65) + (unionShare * 0.35));
        case 'labor_left':
            return value * unionShare * ((progressiveShare * 0.7) + (nonCollegeShare * 0.3));
        case 'lgbtq':
        case 'lgbtq_community':
            return value * ((secularShare * 0.5) + (urbanIndex * 0.3) + (collegeShare * 0.2));
        case 'women':
            return value * 0.51;
        case 'youth':
            return value * _getCountyIgValue(county, 'youth');
        case 'seniors':
            return value * _getCountyIgValue(county, 'seniors');
        default:
            return null;
    }
}

// Apply group modifier values to every county, weighted by that county's ig composition
function _applyGroupModsToCounties(groupMods, voteKey, scale) {
    for (var groupId in groupMods) {
        var rawMod = groupMods[groupId]; // positive = boost, negative = debuff
        var modVal = rawMod * (scale || 1.0);
        var normalizedGroupId = _normalizeGroupTag(groupId);
        normalizedGroupId = GROUP_TAG_ALIASES[normalizedGroupId] || normalizedGroupId;
        var igKey = _mapGroupToIgKey(normalizedGroupId);

        for (var fips in Counties.countyData) {
            var county = Counties.countyData[fips];
            if (!county.v) continue;
            var effectiveModVal = modVal;

            // Determine group weight for this county
            var groupWeight = 0;
            var compositeValue = calculateCompositeTag(normalizedGroupId, modVal, county);

            if (typeof compositeValue === 'number') {
                // Composite tags return a pre-weighted modifier value, so county weight is already baked in.
                groupWeight = 1;
                effectiveModVal = compositeValue;
            } else if (igKey !== null && igKey !== undefined && county.ig && county.ig[igKey] !== undefined) {
                groupWeight = county.ig[igKey] / 100;
            } else if (normalizedGroupId === 'urban') {
                groupWeight = _getCountyTierGroupWeight(county, 'urban');
            } else if (normalizedGroupId === 'suburban') {
                groupWeight = _getCountyTierGroupWeight(county, 'suburban');
            } else if (normalizedGroupId === 'rural') {
                groupWeight = _getCountyTierGroupWeight(county, 'rural');
            } else if (normalizedGroupId === 'noncollege' && county.ig && county.ig.college !== undefined) {
                groupWeight = (100 - county.ig.college) / 100;
            } else if (normalizedGroupId === 'bluecollar' && county.ig && county.ig.college !== undefined) {
                // Approximate bluecollar from noncollege + rural signal
                groupWeight = ((100 - county.ig.college) / 100) * 0.6;
            } else if (normalizedGroupId === 'youth') {
                groupWeight = _getCountyIgValue(county, 'youth');
            } else if (normalizedGroupId === 'seniors') {
                groupWeight = _getCountyIgValue(county, 'seniors');
            } else if (normalizedGroupId === 'women') {
                groupWeight = 0.51; // ~51% of every county is women
            } else {
                continue; // No mapping available; skip
            }

            if (groupWeight <= 0) continue;

            // shift = modifier_points * county_group_weight * dampening
            // GROUP_MOD_DAMPENING of 0.1 means a +15 mod with 100% group weight → +1.5 pts vote share
            var shift = effectiveModVal * groupWeight * BUFF_CONSTANTS.GROUP_MOD_DAMPENING;
            var turnoutShift = effectiveModVal * groupWeight * BUFF_CONSTANTS.GROUP_TURNOUT_DAMPENING;
            _applyCountyTurnoutModifier(county, voteKey, turnoutShift);

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

function _getCountyTurnoutKeyForVoteKey(voteKey) {
    if (voteKey === gameData.selectedParty) return 'player';
    if (voteKey === 'D') return 'demOpponent';
    if (voteKey === 'R') return 'repOpponent';
    return 'thirdParty';
}

function _applyCountyTurnoutModifier(county, voteKey, shift) {
    if (!county || !isFinite(shift) || shift === 0) return;
    if (!county.turnout) {
        county.turnout = {
            player: Counties.DEFAULT_MAJOR_PARTY_TURNOUT,
            demOpponent: Counties.DEFAULT_MAJOR_PARTY_TURNOUT,
            repOpponent: Counties.DEFAULT_MAJOR_PARTY_TURNOUT,
            thirdParty: Counties.DEFAULT_THIRD_PARTY_TURNOUT
        };
    }
    var turnoutKey = _getCountyTurnoutKeyForVoteKey(voteKey);
    var defaultValue = turnoutKey === 'thirdParty'
        ? Counties.DEFAULT_THIRD_PARTY_TURNOUT
        : Counties.DEFAULT_MAJOR_PARTY_TURNOUT;
    var current = county.turnout[turnoutKey];
    if (typeof current !== 'number' || !isFinite(current)) current = defaultValue;
    county.turnout[turnoutKey] = Math.max(0.5, Math.min(1.5, current + shift));
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

function _buildCandidateByIdMap() {
    var map = {};
    if (gameData.candidate) map[gameData.candidate.id] = gameData.candidate;
    if (gameData.demTicket && gameData.demTicket.pres) map[gameData.demTicket.pres.id] = gameData.demTicket.pres;
    if (gameData.repTicket && gameData.repTicket.pres) map[gameData.repTicket.pres.id] = gameData.repTicket.pres;
    if (gameData.thirdTickets) {
        var tpCodes = ['PSL', 'G', 'L', 'I'];
        for (var i = 0; i < tpCodes.length; i++) {
            var tp = tpCodes[i];
            if (gameData.thirdTickets[tp] && gameData.thirdTickets[tp].pres) {
                map[gameData.thirdTickets[tp].pres.id] = gameData.thirdTickets[tp].pres;
            }
        }
    }
    return map;
}

function _computeIssueGroupModifiers(candidate) {
    var modifiers = {};
    if (!candidate || !candidate.issuePositions || typeof ISSUE_GROUP_BASELINE_EFFECTS === 'undefined') {
        return modifiers;
    }

    for (var issueId in ISSUE_GROUP_BASELINE_EFFECTS) {
        var effects = ISSUE_GROUP_BASELINE_EFFECTS[issueId];
        var position = candidate.issuePositions[issueId] || 0;
        var normalized = position / 10; // -1..1
        for (var groupId in effects) {
            var delta = effects[groupId] * (-normalized);
            modifiers[groupId] = (modifiers[groupId] || 0) + delta;
        }
    }

    if (typeof ISSUE_SYNERGY_EFFECTS !== 'undefined') {
        for (var i = 0; i < ISSUE_SYNERGY_EFFECTS.length; i++) {
            var synergy = ISSUE_SYNERGY_EFFECTS[i];
            var threshold = synergy.threshold;
            var satisfied = true;
            for (var j = 0; j < synergy.issues.length; j++) {
                var issueKey = synergy.issues[j];
                var posValue = candidate.issuePositions[issueKey] || 0;
                if (threshold < 0 && posValue > threshold) satisfied = false;
                if (threshold > 0 && posValue < threshold) satisfied = false;
            }
            if (!satisfied) continue;
            for (var effGroup in synergy.effects) {
                modifiers[effGroup] = (modifiers[effGroup] || 0) + synergy.effects[effGroup];
            }
        }
    }

    return modifiers;
}

var CANDIDATE_GROUP_MOD_ALIASES = {
    lgbtq: ['lgbtq_community'],
    latino: ['hispanic'],
    veterans: ['military'],
    suburban_college: ['suburban', 'college'],
    suburban_women: ['suburban', 'women'],
    suburban_moderates: ['suburban', 'centrists'],
    suburban_conservative: ['suburban', 'centrists'],
    midwest_noncollege: ['noncollege', 'bluecollar', 'union'],
    progressive_left: ['progressives'],
    rural_whites: ['rural', 'white'],
    business_community: ['smallbusiness', 'whitecollar'],
    donor_class: ['whitecollar', 'smallbusiness'],
    donor_conservative: ['smallbusiness', 'whitecollar'],
    tech_conservative: ['tech', 'whitecollar'],
    antiestablishment: ['centrists', 'libertarians'],
    donor_antiestablishment: ['libertarians', 'centrists'],
    hardcore_right: ['maga'],
    hard_right: ['maga'],
    online_right: ['maga', 'youth'],
    online_militant: ['progressives', 'youth'],
    antiwar_left: ['progressives', 'muslim'],
    environmentalists: ['progressives', 'college', 'youth'],
    antiwar_independents: ['centrists', 'muslim'],
    independents: ['centrists'],
    moderates: ['centrists'],
    moderate_dems: ['centrists', 'suburban'],
    college_liberals: ['college', 'progressives'],
    institutional_dems: ['whitecollar', 'college'],
    high_info_swing: ['college', 'centrists'],
    media_consumers: ['youth', 'college'],
    alternative_media: ['youth', 'libertarians'],
    public_health_professionals: ['college', 'whitecollar'],
    latino_left: ['hispanic', 'progressives'],
    labor_left: ['union', 'progressives'],
    national_security_hawks: ['military', 'whitecollar']
};

function _getCandidateGroupModifier(candidate, groupId) {
    if (!candidate) return 0;
    // `groupEffects.support` is now a literal percentage-point shift; this replaces the old 0.45 dampening.
    // The new math is intended to preserve the exact point shifts requested by the new balancing model.
    return _getCandidateGroupEffectValue(candidate, groupId, 'support');
}

function _sumCandidateGroupMods(mods, groupId) {
    if (!mods) return 0;
    var total = 0;
    for (var rawKey in mods) {
        var normalized = _normalizeGroupTag(rawKey);
        normalized = GROUP_TAG_ALIASES[normalized] || normalized;
        var targets = CANDIDATE_GROUP_MOD_ALIASES[normalized] || [normalized];
        for (var i = 0; i < targets.length; i++) {
            if (targets[i] === groupId) {
                total += mods[rawKey];
            }
        }
    }
    return total;
}

function initCampaignGroupMomentum() {
    if (!gameData.campaignGroupMomentum) {
        gameData.campaignGroupMomentum = {};
    }
    if (typeof INTEREST_GROUPS === 'undefined') return;
    for (var groupId in INTEREST_GROUPS) {
        if (!gameData.campaignGroupMomentum[groupId]) {
            gameData.campaignGroupMomentum[groupId] = {};
        }
    }
}

function shiftGroupSupport(groupId, candidateVoteKey, amount) {
    if (!gameData.liveGroups || !gameData.liveGroups[groupId]) return;
    var group = gameData.liveGroups[groupId];
    var support = group.support;
    if (support[candidateVoteKey] === undefined) return;
    
    var elasticity = group.elasticity !== undefined ? group.elasticity : 0.5;
    var tpPath = group.thirdPartyPath || 'I';
    
    if (amount > 0) {
        var availableToSteal = 100 - support[candidateVoteKey];
        if (availableToSteal <= 0) return;
        var actualGain = Math.min(amount, availableToSteal);
        var proportionToSteal = actualGain / availableToSteal;
        
        for (var k in support) {
            if (k !== candidateVoteKey) {
                var stolen = support[k] * proportionToSteal;
                support[k] -= stolen;
                support[candidateVoteKey] += stolen;
            }
        }
    } else {
        var bleed = Math.abs(amount);
        if (support[candidateVoteKey] < bleed) bleed = support[candidateVoteKey];
        if (bleed <= 0) return;
        
        support[candidateVoteKey] -= bleed;
        
        var rivalParty = candidateVoteKey === 'D' ? 'R' : (candidateVoteKey === 'R' ? 'D' : 'I');
        var toRival = bleed * elasticity;
        var toThirdParty = bleed * (1 - elasticity);
        
        if (support[rivalParty] !== undefined && rivalParty !== 'I') {
            support[rivalParty] += toRival;
        } else {
            toThirdParty += toRival;
        }
        
        if (support[tpPath] !== undefined) {
            support[tpPath] += toThirdParty;
        } else {
            support['I'] = (support['I'] || 0) + toThirdParty;
        }
    }
    
    // Normalize just in case
    var total = 0;
    for (var k in support) total += support[k];
    if (total > 0 && Math.abs(total - 100) > 0.1) {
        for (var k in support) support[k] = (support[k] / total) * 100;
    }
}

function addCampaignGroupMomentum(groupId, candidateId, delta) {
    if (!groupId || !candidateId || !isFinite(delta) || delta === 0) return;
    // Map candidateId to voteKey
    var voteKey = 'I';
    if (gameData.candidate && gameData.candidate.id === candidateId) voteKey = gameData.selectedParty;
    else if (gameData.demTicket.pres && gameData.demTicket.pres.id === candidateId) voteKey = 'D';
    else if (gameData.repTicket.pres && gameData.repTicket.pres.id === candidateId) voteKey = 'R';
    
    shiftGroupSupport(groupId, voteKey, delta);
}

function applyCampaignGroupSwing(groupId, delta) {
    if (!gameData.candidate) return;
    addCampaignGroupMomentum(groupId, gameData.candidate.id, delta);
}

function _getStaticGroupSupportForParty(groupId, partyKey, activeCandidates) {
    var group = (gameData && gameData.liveGroups && gameData.liveGroups[groupId]) ? gameData.liveGroups[groupId] : INTEREST_GROUPS[groupId];
    if (!group || !group.support) return null;
    var support = group.support;
    if (partyKey === 'D' || partyKey === 'R') {
        return support[partyKey] !== undefined ? support[partyKey] : null;
    }
    var otherShare = support.I || 0;
    var otherCount = 0;
    for (var i = 0; i < activeCandidates.length; i++) {
        if (activeCandidates[i].voteKey !== 'D' && activeCandidates[i].voteKey !== 'R') {
            otherCount++;
        }
    }
    return otherCount > 0 ? otherShare / otherCount : 0;
}

// Initialize per-group turnout tracking (baseline is turnout rate, 0-1)
function initInterestGroupTurnout() {
    if (!gameData.interestGroupTurnout) {
        gameData.interestGroupTurnout = {};
    }
    if (!gameData.issueTurnout) {
        gameData.issueTurnout = {};
    }
    initCampaignGroupMomentum();
    if (typeof INTEREST_GROUPS === 'undefined') return;
    for (var groupId in INTEREST_GROUPS) {
        var baseline = (typeof BASE_TURNOUT_RATES !== 'undefined' && BASE_TURNOUT_RATES[groupId] !== undefined)
            ? BASE_TURNOUT_RATES[groupId]
            : (typeof DEFAULT_INTEREST_GROUP_TURNOUT_RATE !== 'undefined' ? DEFAULT_INTEREST_GROUP_TURNOUT_RATE : 0.6);
        if (!gameData.interestGroupTurnout[groupId]) {
            gameData.interestGroupTurnout[groupId] = baseline;
        }
        if (!gameData.issueTurnout[groupId]) {
            gameData.issueTurnout[groupId] = baseline;
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
        var nextIssueTurnout = (gameData.issueTurnout[groupId] || 1.0) + delta;
        gameData.issueTurnout[groupId] = Math.max(BUFF_CONSTANTS.MIN_GROUP_TURNOUT,
            Math.min(BUFF_CONSTANTS.MAX_GROUP_TURNOUT, nextIssueTurnout));
    }
    recomputeCoalitionTurnout();
}

function initCoalitionStatus() {
    if (!gameData.coalitionStatus) {
        gameData.coalitionStatus = {};
    }
    if (typeof INTEREST_GROUPS === 'undefined') return;
    for (var groupId in INTEREST_GROUPS) {
        if (!gameData.coalitionStatus[groupId]) {
            gameData.coalitionStatus[groupId] = {
                loyalty: 1.0,
                misalignmentWeeks: 0,
                atRisk: false,
                collapsed: false,
                turnoutMultiplier: 1.0,
                unmet: [],
                crossPressures: []
            };
        }
    }
}

function _coalitionAppliesToParty(groupId, partyCode) {
    if (typeof COALITION_BREAKPOINTS === 'undefined' || !COALITION_BREAKPOINTS[groupId]) return false;
    var rule = COALITION_BREAKPOINTS[groupId];
    if (rule.parties && rule.parties.length) {
        return rule.parties.indexOf(partyCode) !== -1;
    }
    return true;
}

function updateCoalitionLoyalty() {
    if (!gameData.candidate || !gameData.candidate.issuePositions) return;
    if (typeof COALITION_BREAKPOINTS === 'undefined') return;
    initCoalitionStatus();

    var alerts = [];

    for (var groupId in COALITION_BREAKPOINTS) {
        if (!_coalitionAppliesToParty(groupId, gameData.selectedParty)) continue;

        var rule = COALITION_BREAKPOINTS[groupId];
        var status = gameData.coalitionStatus[groupId] || { loyalty: 1.0, misalignmentWeeks: 0 };
        var unmet = [];
        var allMet = true;

        for (var r = 0; r < rule.requirements.length; r++) {
            var req = rule.requirements[r];
            var pos = (gameData.candidate.issuePositions && gameData.candidate.issuePositions[req.issue]) || 0;
            if (req.max !== undefined && pos > req.max) {
                allMet = false;
                unmet.push(req.label || req.issue);
            }
            if (req.min !== undefined && pos < req.min) {
                allMet = false;
                unmet.push(req.label || req.issue);
            }
        }

        if (allMet) {
            status.misalignmentWeeks = Math.max(0, status.misalignmentWeeks - 1);
            status.loyalty = Math.min(1.0, (status.loyalty || 1.0) + COALITION_CONSTANTS.RECOVERY_RATE);
        } else {
            status.misalignmentWeeks = (status.misalignmentWeeks || 0) + 1;
            var decay = COALITION_CONSTANTS.DECAY_BASE +
                (Math.max(0, status.misalignmentWeeks - 1) * COALITION_CONSTANTS.DECAY_ESCALATION);
            status.loyalty = Math.max(0.4, (status.loyalty || 1.0) - decay);
        }

        var crossPressures = [];
        if (typeof COALITION_CROSS_PRESSURES !== 'undefined') {
            for (var c = 0; c < COALITION_CROSS_PRESSURES.length; c++) {
                var cross = COALITION_CROSS_PRESSURES[c];
                if (cross.targetGroup !== groupId) continue;
                var crossPos = (gameData.candidate.issuePositions && gameData.candidate.issuePositions[cross.triggerIssue]) || 0;
                if (cross.triggerMax !== undefined && crossPos <= cross.triggerMax) {
                    status.loyalty = Math.max(0.4, status.loyalty - cross.penalty);
                    crossPressures.push(cross.label);
                }
                if (cross.triggerMin !== undefined && crossPos >= cross.triggerMin) {
                    status.loyalty = Math.max(0.4, status.loyalty - cross.penalty);
                    crossPressures.push(cross.label);
                }
            }
        }

        status.unmet = unmet;
        status.crossPressures = crossPressures;
        status.atRisk = (status.misalignmentWeeks >= (rule.warningWeeks || 2)) ||
            (status.loyalty <= COALITION_CONSTANTS.AT_RISK_LOYALTY) || crossPressures.length > 0;
        status.collapsed = (status.misalignmentWeeks >= (rule.collapseWeeks || 4)) ||
            (status.loyalty <= COALITION_CONSTANTS.COLLAPSE_LOYALTY);

        if (status.collapsed) {
            status.turnoutMultiplier = Math.min(status.loyalty, COALITION_CONSTANTS.COLLAPSE_LOYALTY);
        } else {
            status.turnoutMultiplier = Math.max(0.5, status.loyalty || 1.0);
        }

        if (status.atRisk || status.collapsed) {
            alerts.push({
                groupId: groupId,
                label: rule.label || groupId,
                status: status.collapsed ? 'COLLAPSE' : 'AT RISK',
                unmet: unmet,
                crossPressures: crossPressures
            });
        }

        gameData.coalitionStatus[groupId] = status;
    }

    gameData.coalitionAlerts = alerts;
    recomputeCoalitionTurnout();
}

function recomputeCoalitionTurnout() {
    if (!gameData.issueTurnout) initInterestGroupTurnout();
    if (!gameData.coalitionStatus) initCoalitionStatus();
    if (typeof INTEREST_GROUPS === 'undefined') return;

    for (var groupId in INTEREST_GROUPS) {
        var baseTurnout = (gameData.issueTurnout && gameData.issueTurnout[groupId] !== undefined)
            ? gameData.issueTurnout[groupId] : 1.0;
        var status = gameData.coalitionStatus[groupId];
        var multiplier = status && status.turnoutMultiplier ? status.turnoutMultiplier : 1.0;
        var nextTurnout = baseTurnout * multiplier;
        gameData.interestGroupTurnout[groupId] = Math.max(BUFF_CONSTANTS.MIN_GROUP_TURNOUT,
            Math.min(BUFF_CONSTANTS.MAX_GROUP_TURNOUT, nextTurnout));
    }
}

function updateMessagingConsistency(issueId, intensity) {
    if (!issueId) return;
    if (gameData.lastMessageIssue === issueId) {
        gameData.messageStreak = (gameData.messageStreak || 0) + 1;
        if (typeof Campaign !== 'undefined' && Campaign.adjustFavorability) {
            Campaign.adjustFavorability(FAVORABILITY_CONSTANTS.STREAK_BONUS * (intensity || 1), null);
        }
    } else {
        gameData.messageStreak = 0;
        if (typeof Campaign !== 'undefined' && Campaign.adjustFavorability) {
            Campaign.adjustFavorability(-(FAVORABILITY_CONSTANTS.SWAP_PENALTY * (intensity || 1)), null);
        }
    }
    gameData.lastMessageIssue = issueId;
}

function recordPlayerPressure(stateCode, actionType, intensity) {
    if (!stateCode) return;
    if (!gameData.playerPressure) gameData.playerPressure = {};
    var pressure = gameData.playerPressure[stateCode] || 0;
    var weight = actionType === 'RALLY' ? 2 : 1;
    pressure += weight * (intensity || 1);
    gameData.playerPressure[stateCode] = pressure;
}

// Initialize interest group support — delegates immediately to the live recompute
function initializeInterestGroupSupport() {
    gameData.interestGroupSupport = {};
    gameData.interestGroupChanges = {};
    gameData.interestGroupBaseSupport = {};
    gameData.campaignGroupMomentum = {};
    initCampaignGroupMomentum();
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

    var candidateById = _buildCandidateByIdMap();
    var issueModifiersByCandidate = {};
    var candidateGroupModifiersByCandidate = {};
    for (var ciMod = 0; ciMod < activeCandidates.length; ciMod++) {
        var candMod = activeCandidates[ciMod];
        var candidateObj = candidateById[candMod.id];
        issueModifiersByCandidate[candMod.id] = _computeIssueGroupModifiers(candidateObj);
        candidateGroupModifiersByCandidate[candMod.id] = candidateObj || null;
    }

    for (var groupId in INTEREST_GROUPS) {
        if (!gameData.interestGroupSupport[groupId]) gameData.interestGroupSupport[groupId] = {};
        if (!gameData.interestGroupChanges[groupId]) gameData.interestGroupChanges[groupId] = {};
        if (!gameData.interestGroupBaseSupport[groupId]) gameData.interestGroupBaseSupport[groupId] = {};

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
                groupShare = _getCountyTierGroupWeight(county, 'urban');
            } else if (groupId === 'suburban') {
                groupShare = _getCountyTierGroupWeight(county, 'suburban');
            } else if (groupId === 'rural') {
                groupShare = _getCountyTierGroupWeight(county, 'rural');
            } else if (groupId === 'noncollege' && county.ig && county.ig.college !== undefined) {
                groupShare = (100 - county.ig.college) / 100;
            } else if (groupId === 'youth') {
                groupShare = _getCountyIgValue(county, 'youth');
            } else if (groupId === 'seniors') {
                groupShare = _getCountyIgValue(county, 'seniors');
            } else if (groupId === 'women') {
                groupShare = 0.51;
            } else if (groupId === 'bluecollar' && county.ig && county.ig.college !== undefined) {
                groupShare = ((100 - county.ig.college) / 100) * 0.6;
            } else if (typeof Counties.getCountyGroupShare === 'function') {
                groupShare = Counties.getCountyGroupShare(county, groupId);
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

        var updatedSupport = {};
        var supportTotal = 0;
        for (var ci4 = 0; ci4 < activeCandidates.length; ci4++) {
            var cand4 = activeCandidates[ci4];
            var countyDerivedSupport = totalWeightedVotes > 0
                ? (candWeightedVotes[cand4.id] || 0) / totalWeightedVotes * 100
                : 0;
            var staticSupport = _getStaticGroupSupportForParty(groupId, cand4.voteKey, activeCandidates);
            var baseSupport = staticSupport !== null
                ? (staticSupport * 0.68) + (countyDerivedSupport * 0.32)
                : countyDerivedSupport;
            gameData.interestGroupBaseSupport[groupId][cand4.id] = baseSupport;
            var issueDelta = (issueModifiersByCandidate[cand4.id] && issueModifiersByCandidate[cand4.id][groupId]) || 0;
            var candidateDelta = _getCandidateGroupModifier(candidateGroupModifiersByCandidate[cand4.id], groupId);
            var adjusted = Math.max(0, baseSupport + issueDelta + candidateDelta);
            updatedSupport[cand4.id] = adjusted;
            supportTotal += adjusted;
        }

        // Apply coalition leakage for the player's candidate if coalition is at risk
        if (typeof COALITION_BREAKPOINTS !== 'undefined' && COALITION_BREAKPOINTS[groupId]) {
            var rule = COALITION_BREAKPOINTS[groupId];
            var status = gameData.coalitionStatus ? gameData.coalitionStatus[groupId] : null;
            var playerId = gameData.candidate ? gameData.candidate.id : null;
            var leakRate = 0;
            if (status && playerId && _coalitionAppliesToParty(groupId, gameData.selectedParty)) {
                if (status.collapsed) leakRate = rule.collapseLeak || 0;
                else if (status.atRisk) leakRate = rule.riskLeak || 0;
            }
            if (leakRate > 0 && updatedSupport[playerId]) {
                var leakAmount = updatedSupport[playerId] * leakRate;
                updatedSupport[playerId] = Math.max(0, updatedSupport[playerId] - leakAmount);

                var partyToCandidate = {};
                for (var ac = 0; ac < activeCandidates.length; ac++) {
                    partyToCandidate[activeCandidates[ac].voteKey] = activeCandidates[ac].id;
                }

                var leakTargets = rule.leakTo || {};
                var leakWeightTotal = 0;
                for (var partyKey in leakTargets) {
                    if (partyToCandidate[partyKey]) leakWeightTotal += leakTargets[partyKey];
                }

                var remainingLeak = leakAmount;
                if (leakWeightTotal > 0) {
                    for (var leakParty in leakTargets) {
                        var targetId = partyToCandidate[leakParty];
                        if (!targetId) continue;
                        var slice = leakAmount * (leakTargets[leakParty] / leakWeightTotal);
                        updatedSupport[targetId] = (updatedSupport[targetId] || 0) + slice;
                        remainingLeak -= slice;
                    }
                }

                if (remainingLeak > 0) {
                    var opponentParty = gameData.selectedParty === 'D' ? 'R' :
                        (gameData.selectedParty === 'R' ? 'D' : null);
                    if (opponentParty && partyToCandidate[opponentParty]) {
                        updatedSupport[partyToCandidate[opponentParty]] = (updatedSupport[partyToCandidate[opponentParty]] || 0) + remainingLeak;
                    } else {
                        var splitParties = ['D', 'R'];
                        for (var sp = 0; sp < splitParties.length; sp++) {
                            var spId = partyToCandidate[splitParties[sp]];
                            if (spId) {
                                updatedSupport[spId] = (updatedSupport[spId] || 0) + (remainingLeak / 2);
                            }
                        }
                    }
                }
            }
        }

        supportTotal = 0;
        for (var supId in updatedSupport) {
            supportTotal += updatedSupport[supId] || 0;
        }

        for (var ci5 = 0; ci5 < activeCandidates.length; ci5++) {
            var cand5 = activeCandidates[ci5];
            var prevSupport = gameData.interestGroupSupport[groupId][cand5.id] || 0;
            var normalizedSupport = supportTotal > 0 ? (updatedSupport[cand5.id] / supportTotal) * 100 : 0;
            gameData.interestGroupSupport[groupId][cand5.id] = normalizedSupport;
            gameData.interestGroupChanges[groupId][cand5.id] = normalizedSupport - prevSupport;
        }
    }

    console.log('✓ Interest group support recomputed from county data');
}

function _pickRandomPacByIssue(issueId, used) {
    var options = [];
    for (var pacId in PACS) {
        var pac = PACS[pacId];
        if (pac.priority_issue !== issueId) continue;
        if (used && used[pacId]) continue;
        options.push(pacId);
    }
    if (!options.length) return null;
    return options[Math.floor(Math.random() * options.length)];
}

function buildFundraiseMeeting(stateCode) {
    if (typeof PACS === 'undefined') return null;
    var pacIds = Object.keys(PACS);
    if (!pacIds.length) return null;

    var meeting = { state: stateCode, options: [], type: 'standard', conflictLabel: null, conflictGroups: [] };
    var used = {};

    if (Math.random() < FUNDRAISE_CONSTANTS.BUNDLER_CHANCE) {
        var conflictPairs = [
            { issues: ['labor', 'taxation'], label: 'Labor vs Wall Street', groups: ['union', 'smallbusiness'] },
            { issues: ['climate', 'energy'], label: 'Climate vs Energy', groups: ['progressives', 'farmers'] },
            { issues: ['guns', 'abortion'], label: 'Guns vs Reproductive Rights', groups: ['suburban', 'evangelical'] }
        ];
        var picked = conflictPairs[Math.floor(Math.random() * conflictPairs.length)];
        var pacA = _pickRandomPacByIssue(picked.issues[0], used);
        if (pacA) used[pacA] = true;
        var pacB = _pickRandomPacByIssue(picked.issues[1], used);
        if (pacA && pacB) {
            meeting.type = 'bundler';
            meeting.conflictLabel = picked.label;
            meeting.conflictGroups = picked.groups;
            meeting.options = [pacA, pacB];
            return meeting;
        }
    }

    var preferredCategories = ['Wall Street', 'Labor', 'Grassroots'];
    for (var c = 0; c < preferredCategories.length; c++) {
        var category = preferredCategories[c];
        var matching = [];
        for (var p = 0; p < pacIds.length; p++) {
            var pacId = pacIds[p];
            var pac = PACS[pacId];
            if (used[pacId]) continue;
            if (pac.category === category) matching.push(pacId);
        }
        if (matching.length) {
            var selected = matching[Math.floor(Math.random() * matching.length)];
            used[selected] = true;
            meeting.options.push(selected);
        }
    }

    while (meeting.options.length < FUNDRAISE_CONSTANTS.MAX_OPTIONS && meeting.options.length < pacIds.length) {
        var candidate = pacIds[Math.floor(Math.random() * pacIds.length)];
        if (used[candidate]) continue;
        used[candidate] = true;
        meeting.options.push(candidate);
    }

    return meeting;
}

function calculateFundraisePayout(pac, stateCode) {
    var base = pac.contribution || 0;
    var statePotential = (STATE_FUNDRAISING_POTENTIAL && STATE_FUNDRAISING_POTENTIAL[stateCode]) || 2.0;
    var stateMultiplier = 0.8 + Math.min(0.6, (statePotential / 10) * 0.6);
    var state = gameData.states[stateCode];
    var alignmentBonus = 1.0;
    if (state) {
        if ((gameData.selectedParty === 'D' && state.margin > 0) ||
            (gameData.selectedParty === 'R' && state.margin < 0)) {
            alignmentBonus = 1.2;
        } else if ((gameData.selectedParty === 'D' && state.margin < -10) ||
            (gameData.selectedParty === 'R' && state.margin > 10)) {
            alignmentBonus = 0.8;
        }
    }
    var fatiguePenalty = Math.max(0.5, 1.0 - ((state && state.fundraisingVisits) ? state.fundraisingVisits * 0.1 : 0));
    var charismaModifier = gameData.candidate && gameData.candidate.funds ? (gameData.candidate.funds / 60) : 1.0;
    var raised = base * stateMultiplier * alignmentBonus * fatiguePenalty * charismaModifier;
    var variance = FUNDRAISE_CONSTANTS.MEETING_BASE_VARIANCE;
    raised *= (1 - variance + Math.random() * (variance * 2));
    return raised;
}

function addMediaVulnerability(pac) {
    if (!pac || !pac.vulnerability) return;
    var vuln = pac.vulnerability;
    var entry = {
        id: vuln.id,
        label: vuln.label,
        risk: vuln.risk,
        favorability: vuln.favorability !== undefined ? vuln.favorability : vuln.credibility,
        turnoutHits: vuln.turnoutHits || {},
        story: vuln.story,
        source: pac.name,
        triggered: false
    };
    gameData.mediaVulnerabilities.push(entry);
}

function applyPacCommitment(pacId) {
    var pac = PACS[pacId];
    if (!pac) return;

    var already = false;
    for (var i = 0; i < gameData.pacEndorsements.length; i++) {
        if (gameData.pacEndorsements[i] === pacId) {
            already = true;
            break;
        }
    }
    if (!already) {
        gameData.pacEndorsements.push(pacId);
    }

    if (!gameData.lockedIssues) gameData.lockedIssues = {};
    gameData.lockedIssues[pac.priority_issue] = true;

    if (!gameData.candidate.issuePositions) {
        gameData.candidate.issuePositions = {};
    }
    var currentPos = (gameData.candidate.issuePositions && gameData.candidate.issuePositions[pac.priority_issue]) || 0;
    if (Math.abs(currentPos - pac.desired_position) > 2) {
        gameData.candidate.issuePositions[pac.priority_issue] = pac.desired_position;
    }

    addMediaVulnerability(pac);
}

window.app = window.app || {};
var app = window.app;
Object.assign(app, {
    goToScreen: function(id) { Screens.goTo(id); },
    selParty: function(code) { Screens.selectParty(code); },
    setCampaignMapMode: function(mode) { if (typeof Campaign !== 'undefined') Campaign.setMapMode(mode); },
    toggleTheme: function() {
        var root = document.documentElement;
        var current = root.getAttribute('data-theme') || 'dark';
        var next = current === 'light' ? 'dark' : 'light';
        root.setAttribute('data-theme', next);
        try { localStorage.setItem('d2028-theme', next); } catch (e) {}
    },
    initTheme: function() {
        var saved = null;
        try { saved = localStorage.getItem('d2028-theme'); } catch (e) {}
        if (saved === 'light' || saved === 'dark') {
            document.documentElement.setAttribute('data-theme', saved);
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    },
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
    openFundraiseModal: function() {
        if (!gameData.selectedState) {
            Utils.showToast("Select a state first!");
            return;
        }
        if (gameData.energy < FUNDRAISE_CONSTANTS.MEETING_ENERGY_COST) {
            Utils.showToast("Not enough energy for donor meetings!");
            return;
        }
        var meeting = buildFundraiseMeeting(gameData.selectedState);
        if (!meeting || !meeting.options.length) {
            Utils.showToast("No donors available right now.");
            return;
        }
        gameData.currentFundraiseMeeting = meeting;
        gameData.energy -= FUNDRAISE_CONSTANTS.MEETING_ENERGY_COST;
        if (gameData.states[gameData.selectedState]) {
            gameData.states[gameData.selectedState].fundraisingVisits =
                (gameData.states[gameData.selectedState].fundraisingVisits || 0) + 1;
        }
        Campaign.updateHUD();
        this.renderFundraiseModal();
        document.getElementById('fundraise-modal').classList.remove('hidden');
    },
    renderFundraiseModal: function() {
        var meeting = gameData.currentFundraiseMeeting;
        if (!meeting) return;
        var title = meeting.type === 'bundler' ? 'BUNDLER EVENT' : 'DONOR MEETING';
        var subtitle = meeting.type === 'bundler'
            ? ('Conflicting interests: ' + (meeting.conflictLabel || 'Competing demands'))
            : 'Choose a donor. Each acceptance locks an issue and adds media exposure.';
        var optionsHtml = '';
        for (var i = 0; i < meeting.options.length; i++) {
            var pacId = meeting.options[i];
            var pac = PACS[pacId];
            if (!pac) continue;
            var issue = CORE_ISSUES.find(function(entry) { return entry.id === pac.priority_issue; });
            var issueName = issue ? issue.name : pac.priority_issue;
            optionsHtml += '<div class="fundraise-card">';
            optionsHtml += '<div class="fundraise-card-header">';
            optionsHtml += '<div class="fundraise-name">' + pac.name + '</div>';
            optionsHtml += '<div class="fundraise-category">' + (pac.category || 'Donor') + '</div>';
            optionsHtml += '</div>';
            optionsHtml += '<div class="fundraise-detail"><strong>Demand:</strong> ' + issueName + ' @ ' + pac.desired_position + '</div>';
            optionsHtml += '<div class="fundraise-detail"><strong>Contribution:</strong> $' + pac.contribution + 'M</div>';
            optionsHtml += '<div class="fundraise-detail fundraise-vulnerability">Media risk: ' + (pac.vulnerability ? pac.vulnerability.label : 'Exposure') + '</div>';
            optionsHtml += '<button class="fundraise-accept-btn" onclick="app.acceptFundraiseOption(\'' + pacId + '\')">ACCEPT</button>';
            optionsHtml += '</div>';
        }
        document.getElementById('fundraise-modal-title').innerText = title;
        document.getElementById('fundraise-modal-subtitle').innerText = subtitle;
        document.getElementById('fundraise-options').innerHTML = optionsHtml;

        var bundlerBtn = document.getElementById('fundraise-bundler-btn');
        if (bundlerBtn) {
            bundlerBtn.style.display = meeting.type === 'bundler' ? 'inline-flex' : 'none';
        }
    },
    acceptFundraiseOption: function(pacId) {
        if (!gameData.currentFundraiseMeeting) return;
        var meeting = gameData.currentFundraiseMeeting;
        var pac = PACS[pacId];
        if (!pac) return;
        var raised = calculateFundraisePayout(pac, meeting.state);
        applyPacCommitment(pacId);
        gameData.funds += raised;
        Utils.addLog('Donor meeting: accepted ' + pac.name + ' (+$' + raised.toFixed(1) + 'M)');
        Utils.showToast('Donor funds: +$' + raised.toFixed(1) + 'M');
        this.finalizeFundraise();
    },
    acceptBundlerDeal: function() {
        var meeting = gameData.currentFundraiseMeeting;
        if (!meeting || meeting.type !== 'bundler') return;
        var totalRaised = 0;
        for (var i = 0; i < meeting.options.length; i++) {
            var pacId = meeting.options[i];
            var pac = PACS[pacId];
            if (!pac) continue;
            totalRaised += calculateFundraisePayout(pac, meeting.state);
            applyPacCommitment(pacId);
        }
        gameData.funds += totalRaised;

        if (typeof Campaign !== 'undefined' && Campaign.adjustFavorability) {
            Campaign.adjustFavorability(-FUNDRAISE_CONSTANTS.BUNDLER_CREDIBILITY_PENALTY, 'bundler backlash');
        }
        if (meeting.conflictGroups && meeting.conflictGroups.length) {
            initInterestGroupTurnout();
            for (var g = 0; g < meeting.conflictGroups.length; g++) {
                var groupId = meeting.conflictGroups[g];
                gameData.issueTurnout[groupId] = Math.max(BUFF_CONSTANTS.MIN_GROUP_TURNOUT,
                    Math.min(BUFF_CONSTANTS.MAX_GROUP_TURNOUT, (gameData.issueTurnout[groupId] || 1.0) + FUNDRAISE_CONSTANTS.BUNDLER_TURNOUT_PENALTY));
            }
            if (typeof recomputeCoalitionTurnout === 'function') {
                recomputeCoalitionTurnout();
            }
        }

        Utils.addLog('Bundler event accepted: +' + totalRaised.toFixed(1) + 'M (favorability hit)');
        Utils.showToast('Bundler haul: +$' + totalRaised.toFixed(1) + 'M');
        this.finalizeFundraise();
    },
    declineFundraise: function() {
        Utils.addLog('Declined donor meeting in ' + gameData.states[gameData.selectedState].name);
        this.closeFundraiseModal();
    },
    finalizeFundraise: function() {
        if (typeof updateCoalitionLoyalty === 'function') {
            updateCoalitionLoyalty();
        }
        if (typeof recomputeInterestGroupSupport === 'function') {
            recomputeInterestGroupSupport();
        }
        if (typeof Campaign !== 'undefined') {
            Campaign.updateHUD();
            Campaign.colorMap();
            if (gameData.selectedState) Campaign.clickState(gameData.selectedState);
        }
        this.closeFundraiseModal();
    },
    closeFundraiseModal: function() {
        var modal = document.getElementById('fundraise-modal');
        if (modal) modal.classList.add('hidden');
        gameData.currentFundraiseMeeting = null;
    },
    openStateBio: function() { Campaign.openStateBio(); },
    nextWeek: function() { Campaign.nextWeek(); },
    undoLastAction: function() { Campaign.undoLastAction(); },
    closeCountyView: function() { Counties.closeCountyView(); },
    openCountyView: function() { 
        if (gameData.selectedState && typeof Counties !== 'undefined') {
            Counties.openCountyView(gameData.selectedState);
        }
    },
    openEndorsersModal: function() {
        var modal = document.getElementById('endorsers-modal');
        var list = document.getElementById('endorsers-list');
        if (!modal || !list || typeof Endorsers === 'undefined') return;
        
        var html = '';
        var isNational = !gameData.selectedState;
        
        var headerText = isNational ? "NATIONAL ENDORSERS" : "STATE ENDORSERS (" + gameData.selectedState + ")";
        var titleEl = document.getElementById('endorsers-modal-title');
        if (titleEl) titleEl.innerText = headerText;
        
        var endorsersToShow = [];
        if (isNational) {
            endorsersToShow = Endorsers.db.national;
        } else if (Endorsers.db.states[gameData.selectedState]) {
            endorsersToShow = Endorsers.db.states[gameData.selectedState];
        }
        
        if (endorsersToShow.length === 0) {
            html = '<p style="color:#aaa;">No notable endorsers available for this scope.</p>';
        } else {
            for (var i = 0; i < endorsersToShow.length; i++) {
                var e = endorsersToShow[i];
                var rel = Endorsers.relationships[e.id] || 0;
                var isEndorsed = (rel >= e.threshold);
                
                var barColor = rel < 0 ? '#dc3545' : '#198754';
                var barWidth = Math.abs(rel);
                var leftOffset = rel < 0 ? (50 - (barWidth/2)) : 50;
                var widthPct = barWidth / 2;
                
                html += '<div style="background: rgba(255,255,255,0.05); border: 1px solid #444; padding: 15px; margin-bottom: 10px; border-radius: 4px;">';
                html += '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">';
                html += '<div><strong style="font-size:1.1rem; color:#fff;">' + e.name + '</strong> <span style="font-size: 0.8em; color: #888; margin-left:8px;">(' + e.type.toUpperCase() + ')</span></div>';
                
                if (isEndorsed) {
                    html += '<div><span style="color: #198754; font-weight: bold; border: 1px solid #198754; padding: 3px 6px; border-radius: 3px;">ENDORSED</span></div>';
                } else {
                    html += '<div><button onclick="app.lobbyEndorser(\'' + e.id + '\')" class="act-btn" style="padding: 6px 12px; font-size: 0.8rem; margin:0;"><i class="fa-solid fa-handshake"></i> MEET (5 <i class="fa-solid fa-bolt"></i>)</button></div>';
                }
                html += '</div>';
                
                html += '<div style="font-size: 0.85rem; color: #ccc; margin-bottom:4px;">Relationship: <strong style="color:' + barColor + ';">' + rel + '</strong> <span style="color:#666;">(Needs ' + e.threshold + ' for endorsement)</span></div>';
                html += '<div style="width: 100%; height: 12px; background: #222; border-radius: 6px; margin-top: 4px; overflow: hidden; position: relative; border: 1px solid #333;">';
                html += '<div style="position: absolute; left: 50%; top: 0; bottom: 0; width: 1px; background: #666; z-index:2;"></div>'; // Zero marker
                html += '<div style="position: absolute; left: ' + leftOffset + '%; width: ' + widthPct + '%; height: 100%; background: ' + barColor + '; z-index:1;"></div>';
                html += '</div>';
                
                if (isEndorsed && e.type === 'individual') {
                    html += '<div style="font-size: 0.85rem; color: #aaa; margin-top: 8px;"><img src="images/public-speaker.svg" style="width: 1.25em; height: 1.25em; vertical-align: middle;"> Surrogate Rallies Available: <strong style="color:#ffaa00;">' + (Endorsers.rallyCredits[e.id] || 0) + '</strong></div>';
                }
                
                html += '</div>';
            }
        }
        
        list.innerHTML = html;
        modal.classList.remove('hidden');
    },
    lobbyEndorser: function(endorserId) {
        if (typeof Endorsers !== 'undefined') {
            Endorsers.meetEndorser(endorserId);
        }
    },
    openRallyReportModal: function(message) {
        var modal = document.getElementById('rally-modal');
        var content = document.getElementById('rally-report-content');
        if (modal && content) {
            content.innerHTML = message;
            modal.classList.remove('hidden');
        }
    },
    openIssuesPanel: function() {
        if (!gameData.selectedState) {
            Utils.showToast("Select a state first!");
            return;
        }
        if (typeof updateCoalitionLoyalty === 'function') {
            updateCoalitionLoyalty();
        }
        var issuesPanel = document.getElementById('issues-modal');
        if (!issuesPanel) return;
        issuesPanel.classList.remove('hidden');
        if (typeof requestAnimationFrame === 'function') {
            requestAnimationFrame(function() {
                issuesPanel.classList.add('drawer-open');
            });
        } else {
            issuesPanel.classList.add('drawer-open');
        }
        this.renderIssuesPanel();
    },
    closeIssuesPanel: function() {
        var issuesPanel = document.getElementById('issues-modal');
        if (!issuesPanel) return;
        issuesPanel.classList.remove('drawer-open');
        setTimeout(function() {
            if (!issuesPanel.classList.contains('drawer-open')) {
                issuesPanel.classList.add('hidden');
            }
        }, 250);
    },
    renderIssuesPanel: function() {
        var showThirdParty = document.getElementById('show-third-party-toggle').checked;
        var state = gameData.states[gameData.selectedState];
        var stateCode = gameData.selectedState;
        
        document.getElementById('issues-modal-title').innerText = 'ISSUE POSITIONS - ' + state.name;
        
        var issuesHtml = '';
        var categories = ['Economic', 'Social', 'Healthcare', 'Environment', 'Foreign', 'Governance'];

        // Favorability + vulnerability status
        var favorabilityPct = Math.round((typeof Campaign !== 'undefined' && Campaign.getFavorability ? Campaign.getFavorability() : (gameData.favorability || 0.5)) * 100);
        issuesHtml += '<div class="credibility-panel">';
        issuesHtml += '<div class="credibility-title">CAMPAIGN FAVORABILITY</div>';
        issuesHtml += '<div class="credibility-value">' + favorabilityPct + '%</div>';
        issuesHtml += '<div class="credibility-subtitle">Public approval changes with consistency, issue shifts, donors, media hits, and coalition pressure.</div>';
        issuesHtml += '</div>';

        if (gameData.mediaVulnerabilities && gameData.mediaVulnerabilities.length) {
            issuesHtml += '<div class="media-vulnerability-panel">';
            issuesHtml += '<div class="media-vulnerability-title">MEDIA VULNERABILITIES</div>';
            issuesHtml += '<ul>' + gameData.mediaVulnerabilities.map(function(vuln) {
                return '<li>' + vuln.label + '</li>';
            }).join('') + '</ul>';
            issuesHtml += '</div>';
        }

        if (gameData.coalitionAlerts && gameData.coalitionAlerts.length) {
            issuesHtml += '<div class="coalition-alert-panel">';
            issuesHtml += '<div class="coalition-alert-title"><span class="coalition-warning-icon"></span>COALITION ALERTS</div>';
            issuesHtml += '<ul>' + gameData.coalitionAlerts.map(function(alert) {
                var detail = '';
                if (alert.unmet && alert.unmet.length) {
                    detail = ' — ' + alert.unmet.join(', ');
                }
                if (alert.crossPressures && alert.crossPressures.length) {
                    detail += (detail ? '; ' : ' — ') + alert.crossPressures.join(', ');
                }
                return '<li>' + alert.label + ': ' + alert.status + detail + '</li>';
            }).join('') + '</ul>';
            issuesHtml += '</div>';
        }

        // Coalition warning banner
        var warnings = [];
        if (typeof ISSUE_COALITION_CONFLICTS !== 'undefined' && gameData.candidate && gameData.candidate.issuePositions) {
            for (var w = 0; w < ISSUE_COALITION_CONFLICTS.length; w++) {
                var conflict = ISSUE_COALITION_CONFLICTS[w];
                var satisfied = true;
                for (var c = 0; c < conflict.issues.length; c++) {
                    var req = conflict.issues[c];
                    var pos = gameData.candidate.issuePositions[req.id] || 0;
                    if (req.max !== undefined && pos > req.max) satisfied = false;
                    if (req.min !== undefined && pos < req.min) satisfied = false;
                }
                if (satisfied) warnings.push(conflict.label);
            }
        }

        if (warnings.length) {
            issuesHtml += '<div class="coalition-warning">';
            issuesHtml += '<div class="coalition-warning-title"><span class="coalition-warning-icon"></span>COALITION WARNING</div>';
            issuesHtml += '<ul>' + warnings.map(function(text) { return '<li>' + text + '</li>'; }).join('') + '</ul>';
            issuesHtml += '</div>';
        }
        
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
                    issuesHtml += '<div class="issue-impact-row">' + this.getIssueImpactSummary(issue.id) + '</div>';
                    
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

    getIssueImpactSummary: function(issueId) {
        var impacts = [];
        if (typeof INTEREST_GROUPS !== 'undefined') {
            for (var groupId in INTEREST_GROUPS) {
                var group = INTEREST_GROUPS[groupId];
                if (group.priorities && group.priorities.indexOf(issueId) !== -1) {
                    impacts.push(group.name);
                }
            }
        }
        if (!impacts.length) return '<strong>Moves:</strong> low-salience voters and local persuasion only';
        return '<strong>Moves:</strong> ' + impacts.slice(0, 5).join(', ') + (impacts.length > 5 ? ' +' + (impacts.length - 5) + ' more' : '');
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
        var splitNotes = [];
        for (var code2 in gameData.states) {
            var state = gameData.states[code2];
            if (typeof Counties !== 'undefined' && Counties.calculateStateElectoralAllocation) {
                var projectedAllocation = Counties.calculateStateElectoralAllocation(code2, { useReportedVotes: false });
                if (projectedAllocation && projectedAllocation.allocation) {
                    demEV += projectedAllocation.allocation.D || 0;
                    repEV += projectedAllocation.allocation.R || 0;
                    if ((code2 === 'ME' || code2 === 'NE') && projectedAllocation.isSplitState) {
                        splitNotes.push(code2 + ': D+' + (projectedAllocation.allocation.D || 0) + ', R+' + (projectedAllocation.allocation.R || 0));
                    }
                    continue;
                }
            }
            if (state.margin > 0) demEV += state.ev;
            else repEV += state.ev;
        }
        
        document.getElementById('electoral-projection-display').innerHTML = 
            '<div class="vote-row"><span style="color: #00AEF3;">Democrat</span><span>' + demEV + ' EV</span></div>' +
            '<div class="vote-row"><span style="color: #E81B23;">Republican</span><span>' + repEV + ' EV</span></div>' +
            (splitNotes.length ? '<div style="margin-top: 8px; color: #9aa3b7; font-size: 0.8rem;">' + splitNotes.join(' | ') + '</div>' : '') +
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

    openFieldModal: function() {
        if (!gameData.selectedState) {
            Utils.showToast("Select a state first!");
            return;
        }
        var modal = document.getElementById('ground-ops-modal');
        if (!modal) return;
        this.updateGroundOpsPanel();
        modal.classList.remove('hidden');
    },

    closeFieldModal: function() {
        var modal = document.getElementById('ground-ops-modal');
        if (modal) modal.classList.add('hidden');
    },

    openDigitalModal: function() {
        if (!gameData.selectedState) {
            Utils.showToast("Select a state first!");
            return;
        }
        var modal = document.getElementById('digital-planner-modal');
        if (!modal) return;
        modal.classList.remove('hidden');
    },

    closeDigitalModal: function() {
        var modal = document.getElementById('digital-planner-modal');
        if (modal) modal.classList.add('hidden');
    },
    
    handleSpeechWithIntensity: function(issueId) {
        var intensitySelect = document.getElementById('speech-intensity-select');
        var intensity = parseInt(intensitySelect.value) || 1;
        Campaign.handleSpeech(issueId, intensity);
    },

    runGroundOp: function(type) {
        var state = gameData.selectedState;
        if (!state) return;
        var success = false;
        
        if (type === 'office') {
            success = GroundOps.openFieldOffice(state, null);
        } else if (type === 'staff') {
            var intensity = parseInt(document.getElementById('go-staff-intensity').value) || 1;
            success = GroundOps.hireFieldStaff(state, intensity);
        } else if (type === 'canvass') {
            var intensity = parseInt(document.getElementById('go-canvass-intensity').value) || 1;
            success = GroundOps.deployCanvassers(state, intensity);
        } else if (type === 'voterfile') {
            success = GroundOps.investVoterFile(state);
        } else if (type === 'gotv') {
            success = GroundOps.activateGOTV(state);
        }
        
        if (success) {
            this.updateGroundOpsPanel();
            Campaign.updateHUD();
            Campaign.clickState(state);
        } else {
            Utils.showToast("Insufficient funds or requirements not met.");
        }
    },

    runDigitalPreset: function(preset) {
        var state = gameData.selectedState;
        if (!state) return;
        
        var config = { totalBudget: 2.0, allocations: {}, segment: 'persuadable', creative: 'issue' };
        
        if (preset === 'base') {
            config.totalBudget = 2.0;
            config.allocations = { meta: 0.5, ctv: 0.3, display: 0.2 };
            config.segment = gameData.selectedParty === 'D' ? 'progressive' : 'hardcore_right';
            config.creative = 'mobilize';
        } else if (preset === 'swing') {
            config.totalBudget = 2.5;
            config.allocations = { ctv: 0.4, search: 0.3, youtube: 0.3 };
            config.segment = 'persuadable';
            config.creative = 'contrast';
        } else if (preset === 'youth') {
            config.totalBudget = 1.5;
            config.allocations = { tiktok: 0.6, meta: 0.2, youtube: 0.2 };
            config.segment = 'youth';
            config.creative = 'testimonial';
        }
        
        if (DigitalAds.executeDigitalCampaign(state, config)) {
            Campaign.updateHUD();
            Campaign.clickState(state);
            this.closeDigitalModal();
            Utils.showToast("Launched " + preset.toUpperCase() + " digital campaign!");
        } else {
            Utils.showToast("Insufficient funds for this preset.");
        }
    },
    
    executeCustomDigital: function() {
        var state = gameData.selectedState;
        if (!state) return;
        
        var totalBudget = parseFloat(document.getElementById('digi-budget-slider').value) || 2.0;
        var segment = document.getElementById('digi-segment-select').value;
        var creative = document.getElementById('digi-creative-select').value;
        
        var allocs = {
            ctv: (parseFloat(document.getElementById('digi-ctv').value) || 0) / 100,
            meta: (parseFloat(document.getElementById('digi-meta').value) || 0) / 100,
            search: (parseFloat(document.getElementById('digi-search').value) || 0) / 100,
            youtube: (parseFloat(document.getElementById('digi-youtube').value) || 0) / 100,
            tiktok: (parseFloat(document.getElementById('digi-tiktok').value) || 0) / 100,
            display: (parseFloat(document.getElementById('digi-display').value) || 0) / 100
        };
        
        var sum = 0;
        for (var k in allocs) sum += allocs[k];
        
        if (Math.abs(sum - 1.0) > 0.05) {
            document.getElementById('digi-alloc-warn').innerText = "Allocations must sum to 100%!";
            return;
        }
        
        document.getElementById('digi-alloc-warn').innerText = "";
        
        var config = {
            totalBudget: totalBudget,
            allocations: allocs,
            segment: segment,
            creative: creative
        };
        
        if (DigitalAds.executeDigitalCampaign(state, config)) {
            Campaign.updateHUD();
            Campaign.clickState(state);
            this.closeDigitalModal();
        } else {
            Utils.showToast("Failed to launch digital campaign. Check budget and cooldowns.");
        }
    },
    
    updateGroundOpsPanel: function() {
        var state = gameData.selectedState;
        if (!state || !gameData.groundOps) return;
        
        var ops = gameData.groundOps;
        document.getElementById('sp-go-offices').innerText = ops.offices[state].count;
        document.getElementById('sp-go-staff').innerText = Math.round(ops.staffLevels[state]) + " / 60";
        document.getElementById('sp-go-vols').innerText = Math.round(ops.volunteerPools[state] || 0);
        document.getElementById('sp-go-vf').innerText = Math.round((ops.voterFiles[state].quality || 0) * 100) + "%";
        
        var gotv = ops.gotv[state].activated;
        var gotvElem = document.getElementById('sp-go-gotv');
        if (gotv) {
            gotvElem.innerText = "ACTIVE!";
            gotvElem.style.color = "var(--green-success)";
        } else {
            gotvElem.innerText = "Dormant";
            gotvElem.style.color = "#ccc";
        }
    },
    
    closeSpeechModal: function() {
        document.getElementById('speech-modal').classList.add('hidden');
    },

    initTargetGroupDropdown: function(selectId) {
        var select = document.getElementById(selectId);
        if (!select) return;

        select.innerHTML = '<option value="">Select Group...</option>';
        var groups = (typeof TARGETABLE_GROUPS !== 'undefined') ? TARGETABLE_GROUPS : [];
        for (var i = 0; i < groups.length; i++) {
            var groupId = groups[i];
            var group = INTEREST_GROUPS[groupId];
            if (!group) continue;
            var option = document.createElement('option');
            option.value = groupId;
            option.textContent = group.name;
            select.appendChild(option);
        }
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
            var state = gameData.states[gameData.selectedState];
            state.lastCampaignDate = new Date(gameData.currentDate);
            state.campaignActionsCount = (state.campaignActionsCount || 0) + 1;
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

        addMediaVulnerability(pac);
        
        Utils.addLog('Accepted endorsement from ' + pac.name + ' (+$' + pac.contribution + 'M)');
        Utils.showToast('PAC Endorsement: +$' + pac.contribution + 'M!');
        
        Campaign.updateHUD();
        if (typeof updateCoalitionLoyalty === 'function') {
            updateCoalitionLoyalty();
        }
        if (typeof recomputeInterestGroupSupport === 'function') {
            recomputeInterestGroupSupport();
        }
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
        
        var favorabilityPenalty = shift * GAME_CONSTANTS.FAVORABILITY_PENALTY_MULTIPLIER;
        
        // Update position
        if (!gameData.candidate.issuePositions) {
            gameData.candidate.issuePositions = {};
        }
        gameData.candidate.issuePositions[issueId] = newPos;

        if (typeof Campaign !== 'undefined' && Campaign.adjustFavorability) {
            Campaign.adjustFavorability(-favorabilityPenalty, 'position shift on ' + issue.name);
        }

        if (typeof Persuasion !== 'undefined' && Persuasion.applyIssueGroupMomentum) {
            Persuasion.applyIssueGroupMomentum(issueId, shift, 0.12);
        }

        Utils.addLog("Shifted position on " + issue.name + " to " + newPos + " (favorability -" + Math.round(favorabilityPenalty * 100) + ")");
        Utils.showToast("Position shifted; favorability and issue coalitions updated.");

        if (typeof updateCoalitionLoyalty === 'function') {
            updateCoalitionLoyalty();
        }
        if (typeof recomputeInterestGroupSupport === 'function') {
            recomputeInterestGroupSupport();
        }
        if (typeof Counties !== 'undefined') {
            for (var sc in gameData.states) {
                Counties.updateStateFromCounties(sc);
            }
        }
        Campaign.colorMap();
        this.renderIssuesPanel();
    },
    
    openInterestGroups: function() {
        if (typeof updateCoalitionLoyalty === 'function') {
            updateCoalitionLoyalty();
        }
        document.getElementById('interest-groups-modal').classList.remove('hidden');
        this.renderInterestGroups('all');
    },
    
    closeInterestGroups: function() {
        document.getElementById('interest-groups-modal').classList.add('hidden');
    },
    
    countyRally: function() {
        if (window.isTvAdsMode) {
            app.toggleTvAdsMode(); // Exits TV ads mode without rallying
            return;
        }
        if (!gameData.selectedCounty) {
            Utils.showToast("Select a county first!");
            return;
        }
        Counties.rallyInCounty(gameData.selectedCounty);
    },
    
    toggleTvAdsMode: function() {
        window.isTvAdsMode = !window.isTvAdsMode;
        app.renderTvAdsMode();
    },

    renderTvAdsMode: function() {
        var btn = document.getElementById('btn-tv-ads');
        var surrogateContainer = document.getElementById('surrogate-container');
        var tvAdsContainer = document.getElementById('tv-ads-container');
        var tvAdsMarket = document.getElementById('tv-ads-market');
        
        if (window.isTvAdsMode) {
            if (btn) {
                btn.style.boxShadow = '0 0 10px 2px #5bc0de';
                btn.style.backgroundColor = '#2c3e50';
            }
            if (surrogateContainer) surrogateContainer.style.display = 'none';
            if (tvAdsContainer) tvAdsContainer.style.display = 'block';
            
            // Set market name
            if (gameData.selectedCounty && typeof MEDIA_MARKETS !== 'undefined') {
                var county = Counties.countyData[gameData.selectedCounty];
                if (county && county.mediaMarket && MEDIA_MARKETS[county.mediaMarket]) {
                    tvAdsMarket.innerText = MEDIA_MARKETS[county.mediaMarket].name || county.mediaMarket;
                } else {
                    tvAdsMarket.innerText = "No Market Assigned";
                }
            }
        } else {
            if (btn) {
                btn.style.boxShadow = '';
                btn.style.backgroundColor = '';
            }
            if (surrogateContainer) surrogateContainer.style.display = 'block';
            if (tvAdsContainer) tvAdsContainer.style.display = 'none';
        }
    },

    updateTvAdIssueScores: function() {
        var select = document.getElementById('tv-ad-issue');
        var scoreDiv = document.getElementById('tv-ad-issue-scores');
        if (!select || !scoreDiv || !gameData.selectedCounty) return;
        
        var issueId = select.value;
        if (!issueId) {
            scoreDiv.innerText = '';
            return;
        }
        
        var candScore = 0;
        var oppScore = 0;
        
        var pParty = gameData.candidate.party;
        var oParty = (pParty === 'D') ? 'R' : 'D';
        var oppObj = (oParty === 'D') ? gameData.demTicket.pres : gameData.repTicket.pres;
        
        if (gameData.candidate.issueScores && gameData.candidate.issueScores[issueId] !== undefined) {
            candScore = gameData.candidate.issueScores[issueId];
        }
        if (oppObj && oppObj.issueScores && oppObj.issueScores[issueId] !== undefined) {
            oppScore = oppObj.issueScores[issueId];
        }
        
        scoreDiv.innerHTML = 'You: <span style="color: #fff">' + candScore + '</span> | Opponent: <span style="color: #fff">' + oppScore + '</span>';
    },

    runTvAd: function(type) {
        if (!gameData.selectedCounty || !window.isTvAdsMode) return;
        var county = Counties.countyData[gameData.selectedCounty];
        if (!county || !county.mediaMarket || typeof MEDIA_MARKETS === 'undefined' || !MEDIA_MARKETS[county.mediaMarket]) {
            Utils.showToast("No media market data available for this county.");
            return;
        }
        
        if (gameData.energy < 1) {
            Utils.showToast("Not enough energy (1 required)!");
            return;
        }
        
        var market = MEDIA_MARKETS[county.mediaMarket];
        var pParty = gameData.candidate.party;
        var oParty = (pParty === 'D') ? 'R' : 'D';
        
        if (type === 'bio') {
            gameData.energy -= 1;
            // Uniform boost to candidate and base turnout
            for (var i = 0; i < market.counties.length; i++) {
                var rawFips = String(market.counties[i]);
                var fips = Counties.normalizeFips(rawFips);
                var cData = Counties.countyData[fips];
                if (cData) {
                    Counties.applyVoteShareShift(cData.v, pParty, 0.4);
                    cData.turnout = cData.turnout || { player: 1.0, demOpponent: 1.0, repOpponent: 1.0, thirdParty: 1.0 };
                    cData.turnout.player = Math.min(1.3, cData.turnout.player + 0.015);
                }
            }
            Campaign.logEvent("Ran Biographical Ad in " + (market.name || county.mediaMarket) + " market. Favorability slightly increased.");
            Utils.showToast("Biographical ad launched!");
        } else if (type === 'attack') {
            gameData.energy -= 1;
            // Uniform penalty to opponent turnout and boost to candidate margin
            for (var i = 0; i < market.counties.length; i++) {
                var rawFips = String(market.counties[i]);
                var fips = Counties.normalizeFips(rawFips);
                var cData = Counties.countyData[fips];
                if (cData) {
                    Counties.applyVoteShareShift(cData.v, pParty, 0.6);
                    var oppKey = pParty === 'D' ? 'repOpponent' : 'demOpponent';
                    cData.turnout = cData.turnout || { player: 1.0, demOpponent: 1.0, repOpponent: 1.0, thirdParty: 1.0 };
                    cData.turnout[oppKey] = Math.max(0.5, cData.turnout[oppKey] - 0.02);
                }
            }
            Campaign.logEvent("Ran Attack Ad in " + (market.name || county.mediaMarket) + " market. Opponent favorability damaged.");
            Utils.showToast("Attack ad launched!");
        } else if (type === 'issue') {
            var select = document.getElementById('tv-ad-issue');
            var issueId = select ? select.value : '';
            if (!issueId) {
                Utils.showToast("Select an issue first!");
                return;
            }
            
            gameData.energy -= 1;
            
            // --- V2 ISSUE UPGRADES ---
            var stateCode = null;
            if (typeof Counties !== 'undefined' && Counties.getStateCodeFromFips) {
                stateCode = Counties.getStateCodeFromFips(gameData.selectedCounty.substring(0, 2));
            }
            
            // 1. Boost Credibility
            if (gameData.candidate.issueCredibility) {
                gameData.candidate.issueCredibility[issueId] = Math.min(1.0, (gameData.candidate.issueCredibility[issueId] || 0.5) + 0.05);
            }
            
            // 2. Boost Salience (Attention Economy)
            if (stateCode && gameData.issueSalience && gameData.issueSalience[stateCode]) {
                gameData.issueSalience[stateCode][issueId] = Math.min(10, (gameData.issueSalience[stateCode][issueId] || 5) + 1.0);
            }
            
            var totalBonus = 0;
            
            // Apply boost based on issue selection
            for (var i = 0; i < market.counties.length; i++) {
                var rawFips = String(market.counties[i]);
                var fips = Counties.normalizeFips(rawFips);
                var cData = Counties.countyData[fips];
                if (cData) {
                    // 3. Evaluate alignment, bimodal math, and dealbreakers
                    var alignmentBonus = 0.5; // fallback
                    if (typeof Counties.evaluateIssueEvent === 'function') {
                        alignmentBonus = Counties.evaluateIssueEvent(fips, issueId, gameData.candidate, 0.8);
                    }
                    totalBonus += alignmentBonus;
                    
                    // 4. Apply shift to the local county voters
                    Counties.applyVoteShareShift(cData.v, pParty, alignmentBonus);
                    
                    cData.turnout = cData.turnout || { player: 1.0, demOpponent: 1.0, repOpponent: 1.0, thirdParty: 1.0 };
                    cData.turnout.player = Math.min(1.3, cData.turnout.player + 0.01);
                }
            }
            
            var issueName = select.options[select.selectedIndex].text;
            
            if (totalBonus < 0) {
                Campaign.logEvent("Ran Issue Ad (" + issueName + ") in " + (market.name || county.mediaMarket) + " market. It severely backfired due to a dealbreaker!");
            } else if (totalBonus > (market.counties.length * 0.6)) {
                Campaign.logEvent("Ran Issue Ad (" + issueName + ") in " + (market.name || county.mediaMarket) + " market. Base highly excited!");
            } else {
                Campaign.logEvent("Ran Issue Ad (" + issueName + ") in " + (market.name || county.mediaMarket) + " market.");
            }
            Utils.showToast("Issue ad launched!");
        }
        
        if (typeof Campaign !== 'undefined' && Campaign.updateHUD) Campaign.updateHUD();
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
            if (gameData.coalitionAlerts && gameData.coalitionAlerts.length) {
                html += '<div class="coalition-alert-inline"><span class="coalition-warning-icon"></span>At-risk coalitions: ' +
                    gameData.coalitionAlerts.map(function(alert) { return alert.label; }).join(', ') + '</div>';
            }
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
                    
                    html += '<div class="ig-card" onclick="app.openInterestGroupDetail(\'' + groupId + '\')">';
                    
                    // Placeholder for logo/image
                    html += '<div class="ig-logo-placeholder">👥</div>';
                    
                    html += '<div class="ig-name">' + group.name + '</div>';

                    var coalitionStatus = gameData.coalitionStatus && gameData.coalitionStatus[groupId];
                    if (coalitionStatus && (coalitionStatus.atRisk || coalitionStatus.collapsed)) {
                        var badgeText = coalitionStatus.collapsed ? 'COLLAPSING' : 'AT RISK';
                        html += '<div class="ig-risk-badge">' + badgeText + '</div>';
                    }
                    
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

    openInterestGroupDetail: function(groupId) {
        var group = INTEREST_GROUPS[groupId];
        if (!group) return;
        var modal = document.getElementById('interest-group-detail-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'interest-group-detail-modal';
            modal.className = 'hidden';
            modal.innerHTML = '<div class="modal-box interest-group-detail-box"><div class="modal-header"><h2 id="ig-detail-title"></h2><button class="modal-close-btn" onclick="app.closeInterestGroupDetail()">×</button></div><div id="ig-detail-content"></div></div>';
            document.body.appendChild(modal);
        }
        document.getElementById('ig-detail-title').innerText = group.name;
        document.getElementById('ig-detail-content').innerHTML = this.renderInterestGroupDetail(groupId);
        modal.classList.remove('hidden');
    },

    closeInterestGroupDetail: function() {
        var modal = document.getElementById('interest-group-detail-modal');
        if (modal) modal.classList.add('hidden');
    },

    renderInterestGroupDetail: function(groupId) {
        var group = INTEREST_GROUPS[groupId];
        var html = '<div class="ig-detail-grid">';
        html += '<div class="ig-detail-card"><strong>Category</strong><span>' + group.category + '</span></div>';
        html += '<div class="ig-detail-card"><strong>Turnout</strong><span>' + Math.round(((gameData.interestGroupTurnout && gameData.interestGroupTurnout[groupId]) || 1) * 100) + '%</span></div>';
        html += '<div class="ig-detail-card"><strong>Baseline lean</strong><span>' + ((group.baseline || 0) > 0 ? 'R+' : ((group.baseline || 0) < 0 ? 'D+' : 'EVEN')) + Math.abs(group.baseline || 0) + '</span></div>';
        var status = gameData.coalitionStatus && gameData.coalitionStatus[groupId];
        html += '<div class="ig-detail-card"><strong>Coalition</strong><span>' + (status ? (status.collapsed ? 'Collapsed' : (status.atRisk ? 'At risk' : 'Stable')) : 'Stable') + '</span></div>';
        html += '</div>';
        html += '<h3>Candidate trend</h3><div class="ig-detail-support">' + this.renderCandidateSupport(groupId) + '</div>';
        html += '<h3>Top issue levers</h3><div class="ig-detail-tags">';
        var priorities = group.priorities || [];
        for (var i = 0; i < priorities.length; i++) {
            var issue = CORE_ISSUES.find(function(entry) { return entry.id === priorities[i]; });
            html += '<span class="issue-tag">' + (issue ? issue.name : priorities[i]) + '</span>';
        }
        html += '</div>';
        if (status && (status.unmet && status.unmet.length || status.crossPressures && status.crossPressures.length)) {
            html += '<div class="coalition-alert-inline">Pressure: ' +
                (status.unmet || []).concat(status.crossPressures || []).join(', ') + '</div>';
        }
        html += '<h3>Where this group matters</h3><div class="ig-detail-tags">' + this.getInterestGroupGeography(groupId) + '</div>';
        return html;
    },

    getInterestGroupGeography: function(groupId) {
        if (typeof Counties === 'undefined' || !Counties.countyData || !Counties.getCountyGroupShare) return 'County data not loaded';
        var stateShares = {};
        var statePops = {};
        for (var fips in Counties.countyData) {
            var county = Counties.countyData[fips];
            var padded = fips.padStart(5, '0');
            var stateCode = null;
            for (var code in STATES) {
                if (STATES[code].fips === padded.substring(0, 2)) { stateCode = code; break; }
            }
            if (!stateCode) continue;
            var pop = county.p || 0;
            stateShares[stateCode] = (stateShares[stateCode] || 0) + (pop * Counties.getCountyGroupShare(county, groupId));
            statePops[stateCode] = (statePops[stateCode] || 0) + pop;
        }
        var ranked = [];
        for (var sc in stateShares) {
            if (statePops[sc] > 0) ranked.push({ code: sc, share: stateShares[sc] / statePops[sc] });
        }
        ranked.sort(function(a, b) { return b.share - a.share; });
        return ranked.slice(0, 6).map(function(item) {
            return '<span class="issue-tag">' + item.code + ' ' + Math.round(item.share * 100) + '%</span>';
        }).join('');
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

        var displayTotal = 0;
        for (var totalIdx = 0; totalIdx < candidates.length; totalIdx++) {
            displayTotal += Math.max(0, candidates[totalIdx].support || 0);
        }
        if (displayTotal > 0) {
            for (var normIdx = 0; normIdx < candidates.length; normIdx++) {
                candidates[normIdx].displaySupport = Math.max(0, candidates[normIdx].support || 0) / displayTotal * 100;
            }
        }
        
        // Sort by support descending
        candidates.sort(function(a, b) { return (b.displaySupport || b.support) - (a.displaySupport || a.support); });
        
        // Find max support for underlining
        var maxSupport = candidates.length > 0 ? (candidates[0].displaySupport || candidates[0].support) : 0;
        
        // Render each candidate
        for (var i = 0; i < candidates.length; i++) {
            var cand = candidates[i];
            var displaySupport = cand.displaySupport !== undefined ? cand.displaySupport : cand.support;
            var partyColor = this.getPartyColor(cand.party);
            var isLeader = (Math.abs(displaySupport - maxSupport) < 0.01);
            
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
            html += '<span class="candidate-support-pct" style="' + supportStyle + '">' + displaySupport.toFixed(1) + '%</span>';
            
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
        skipToEnd: function() { Election.skipToEnd(); },
        closeWinnerOverlay: function() { Election.closeWinnerOverlay(); },
        enterAnalysisMode: function() { Election.enterAnalysisMode(); },
        exitAnalysisMode: function() { Election.exitAnalysisMode(); },
        setAnalysisYear: function(y) { Election.setAnalysisYear(y); }
    }
});

document.addEventListener('DOMContentLoaded', function() {
    if (app && app.initTheme) app.initTheme();
    initGameData();
});
