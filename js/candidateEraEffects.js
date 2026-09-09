/*
 * Candidate-era coalition effects.
 *
 * This is a transparent scenario model, not an empirical decomposition of
 * election results. The group weights and effect sizes below are designer-set
 * assumptions. They modify the existing electorate response; they do not
 * create a second voter population or rewrite the live group support tables.
 */
var CandidateEraEffects = (function () {
    'use strict';

    var PROFILE_BY_ID = {
        trump: 'personalistic',
        vance: 'movement_aligned',
        desantis: 'movement_aligned',
        kemp: 'party_standard',
        cheney: 'repudiating'
    };

    var PROFILE_BY_FACTION = {
        america_first_conservative: 'movement_aligned',
        populist_right: 'movement_aligned',
        compassionate_conservative: 'party_standard',
        religious_right: 'party_standard'
    };

    // These are qualitative scenario classes. The curve inputs are not
    // candidate ratings; they are designer-set transfer bands. Squaring the
    // band makes the personalistic component fall off sharply, while the
    // ceilings prevent near-alignment from reproducing the personal effect.
    var BRAND_CURVE_INPUT = {
        personalistic: 1.00,
        movement_aligned: 0.68,
        party_standard: 0.36,
        repudiating: 0.00
    };
    var BRAND_CURVE_CAP = {
        personalistic: 1.00,
        movement_aligned: 0.38,
        party_standard: 0.12,
        repudiating: 0.00
    };

    // The ordinary county baseline already reflects the Trump-era result.
    // Successors inherit only a bounded residual; the remainder is a loss
    // from that baseline, not a second bonus layered on top of it.
    var STRUCTURAL_PERSISTENCE = 0.25;
    var PROFILE_TRANSFER_CAP = {
        personalistic: 1.00,
        movement_aligned: 0.30,
        party_standard: 0.12,
        repudiating: 0.00
    };

    // Per-group weights sum to one. The preference and turnout columns are
    // modeled effects, not measurements recovered from a causal experiment.
    // Positive preference values move the R/D logit toward Republicans.
    var GROUP_EFFECTS = {
        white: { weights: [0.55, 0.25, 0.20], preference: 0.085, repTurnout: 0.018, demTurnout: 0.006 },
        noncollege: { weights: [0.48, 0.27, 0.25], preference: 0.115, repTurnout: 0.026, demTurnout: 0.008 },
        rural: { weights: [0.50, 0.22, 0.28], preference: 0.125, repTurnout: 0.030, demTurnout: 0.008 },
        evangelical: { weights: [0.52, 0.20, 0.28], preference: 0.105, repTurnout: 0.024, demTurnout: 0.010 },
        hispanic: { weights: [0.42, 0.36, 0.22], preference: 0.055, repTurnout: 0.012, demTurnout: 0.012 },
        black: { weights: [0.48, 0.36, 0.16], preference: 0.020, repTurnout: 0.004, demTurnout: 0.022 },
        asian: { weights: [0.50, 0.34, 0.16], preference: 0.018, repTurnout: 0.004, demTurnout: 0.014 },
        suburban: { weights: [0.45, 0.34, 0.21], preference: 0.030, repTurnout: 0.008, demTurnout: 0.016 },
        college: { weights: [0.44, 0.34, 0.22], preference: 0.018, repTurnout: 0.005, demTurnout: 0.018 },
        youth: { weights: [0.46, 0.30, 0.24], preference: 0.020, repTurnout: 0.004, demTurnout: 0.020 },
        centrists: { weights: [0.52, 0.34, 0.14], preference: 0.015, repTurnout: 0.004, demTurnout: 0.014 },
        whitecollar: { weights: [0.52, 0.30, 0.18], preference: 0.022, repTurnout: 0.005, demTurnout: 0.015 }
    };

    // A separate, independent repudiation channel. These groups are existing
    // overlapping model groups used as proxies; no new voters are created.
    var REPUDIATION = {
        suburban: { preference: 0.055, turnout: 0.008 },
        college: { preference: 0.050, turnout: 0.008 },
        centrists: { preference: 0.060, turnout: 0.010 },
        whitecollar: { preference: 0.040, turnout: 0.006 },
        maga: { preference: -0.028, turnout: -0.010 }
    };

    var TRUMP_BASELINE = null;
    var POLICY_SIMILARITY_CACHE = {};

    function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    function profileFor(candidate) {
        if (!candidate || candidate.party !== 'R') return null;
        if (candidate.eraProfile && BRAND_CURVE_INPUT[candidate.eraProfile] !== undefined) {
            return candidate.eraProfile;
        }
        if (PROFILE_BY_ID[candidate.id]) return PROFILE_BY_ID[candidate.id];
        return PROFILE_BY_FACTION[candidate.factionId] || 'party_standard';
    }

    function groupConfig(groupId) {
        if (GROUP_EFFECTS[groupId]) return GROUP_EFFECTS[groupId];
        if (typeof INTEREST_GROUPS !== 'undefined' && INTEREST_GROUPS[groupId]) {
            var parent = INTEREST_GROUPS[groupId].parentId;
            if (parent && GROUP_EFFECTS[parent]) return GROUP_EFFECTS[parent];
        }
        return null;
    }

    function initializeTrumpBaseline() {
        if (TRUMP_BASELINE || typeof CANDIDATE_POSITIONS === 'undefined') return;
        TRUMP_BASELINE = Object.assign({}, CANDIDATE_POSITIONS.trump || {});
    }

    // Returns a transfer factor in [0,1]. It is only used as a multiplier on
    // the historical residual; it is not an additional issue-position bonus.
    function policySimilarity(candidate) {
        initializeTrumpBaseline();
        if (!candidate || !TRUMP_BASELINE || typeof IssueModel === 'undefined') return 0.5;
        var cacheKey = candidate.id + '|' + JSON.stringify(candidate.issuePositions || CANDIDATE_POSITIONS[candidate.id] || {});
        if (POLICY_SIMILARITY_CACHE[cacheKey] !== undefined) return POLICY_SIMILARITY_CACHE[cacheKey];
        var issues = typeof CORE_ISSUES !== 'undefined' ? CORE_ISSUES : [];
        var values = [];
        for (var i = 0; i < issues.length; i++) {
            var issue = issues[i];
            var trumpPosition = TRUMP_BASELINE[issue.id] !== undefined
                ? TRUMP_BASELINE[issue.id]
                : TRUMP_BASELINE[issue.legacyId];
            if (trumpPosition === undefined) continue;
            var candidatePosition = candidate.issuePositions && candidate.issuePositions[issue.id];
            if (candidatePosition === undefined && typeof CANDIDATE_POSITIONS !== 'undefined') {
                candidatePosition = (CANDIDATE_POSITIONS[candidate.id] || {})[issue.legacyId];
            }
            if (candidatePosition === undefined) continue;
            var agreement = IssueModel.agreement(issue.id, candidatePosition, trumpPosition);
            values.push((agreement + 1) / 2);
        }
        if (!values.length) return 0.5;
        POLICY_SIMILARITY_CACHE[cacheKey] = values.reduce(function (sum, value) { return sum + value; }, 0) / values.length;
        return POLICY_SIMILARITY_CACHE[cacheKey];
    }

    function brandCurve(profile) {
        var input = BRAND_CURVE_INPUT[profile] || 0;
        var cap = BRAND_CURVE_CAP[profile] || 0;
        return Math.min(cap, input * input);
    }

    function transfer(candidate, groupId) {
        var profile = profileFor(candidate);
        var config = groupConfig(groupId);
        if (!profile || !config) return 0;
        if (profile === 'personalistic') return 1;
        var policy = policySimilarity(candidate);
        var personal = brandCurve(profile);
        var weights = config.weights;
        // Structural persistence is deliberately explicit. In this model it
        // represents only the part of the party-era residual that can survive
        // without Trump's personal candidacy.
        var inherited = weights[0] * STRUCTURAL_PERSISTENCE + weights[1] * policy + weights[2] * personal;
        return clamp(Math.min(PROFILE_TRANSFER_CAP[profile] || 0, inherited), 0, 1);
    }

    function effectFor(candidate, groupId) {
        var config = groupConfig(groupId);
        if (!config || !profileFor(candidate)) return { preference: 0, repTurnout: 0, demTurnout: 0 };
        var factor = transfer(candidate, groupId);
        var loss = 1 - factor;
        var profile = profileFor(candidate);
        return {
            // The baseline already contains Trump's coalition effect. A
            // successor therefore subtracts whatever portion does not carry.
            preference: -config.preference * loss,
            repTurnout: -config.repTurnout * loss,
            // Opposition activation is strongest for the personalistic class,
            // but remains present at a lower level for movement-aligned types.
            demTurnout: -config.demTurnout * loss * (profile === 'personalistic' ? 1 : profile === 'movement_aligned' ? 0.55 : 0.20)
        };
    }

    function repudiationFor(candidate, groupId) {
        if (profileFor(candidate) !== 'repudiating') return { preference: 0, turnout: 0 };
        var key = groupId;
        if (!REPUDIATION[key] && typeof INTEREST_GROUPS !== 'undefined' && INTEREST_GROUPS[key]) {
            key = INTEREST_GROUPS[key].parentId || key;
        }
        return REPUDIATION[key] || { preference: 0, turnout: 0 };
    }

    function apply(logs, rates, candidates, groupId) {
        if (!Array.isArray(logs) || !Array.isArray(rates) || !Array.isArray(candidates)) return;
        var republican = candidates.find(function (candidate) { return candidate.party === 'R'; });
        if (!republican || !profileFor(republican)) return;
        var effect = effectFor(republican, groupId);
        var repudiation = repudiationFor(republican, groupId);
        for (var i = 0; i < candidates.length; i++) {
            var party = candidates[i].party;
            if (party === 'R') {
                logs[i] += effect.preference + repudiation.preference;
                rates[i] += effect.repTurnout + repudiation.turnout;
            } else if (party === 'D') {
                logs[i] -= effect.preference + repudiation.preference;
                rates[i] += effect.demTurnout;
            }
        }
    }

    return {
        apply: apply,
        profileFor: profileFor,
        policySimilarity: policySimilarity,
        groupConfig: groupConfig,
        designerConfig: {
            groupEffects: GROUP_EFFECTS,
            repudiation: REPUDIATION,
            brandCurveInput: BRAND_CURVE_INPUT,
            brandCurveCap: BRAND_CURVE_CAP,
            structuralPersistence: STRUCTURAL_PERSISTENCE,
            profileTransferCap: PROFILE_TRANSFER_CAP
        }
    };
}());
