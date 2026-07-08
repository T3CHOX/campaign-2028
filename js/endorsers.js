/* ============================================
   DECISION 2028 - ENDORSER SYSTEM (v3)
   ============================================ */

const ENDORSERS = [
    {
        id: 'afl_cio',
        name: 'AFL-CIO',
        type: 'Union',
        state: 'National',
        targetGroupId: 'union',
        baseInfluence: 0.15,
        factionPreferences: { mainstream_liberal: 1.5, pragmatic_moderate: 1.0, activist_left: 1.2, outsider_leftist: 1.3, america_first_conservative: 0.2, compassionate_conservative: 0.1 },
        currentEndorsement: null,
        retractCondition: {
            issue: 'labor',
            threshold: 5 // If endorsed candidate's position is >= 5 (anti-labor)
        }
    },
    {
        id: 'nra',
        name: 'NRA',
        type: 'Org',
        state: 'National',
        targetGroupId: 'maga',
        baseInfluence: 0.15,
        factionPreferences: { religious_right: 1.5, america_first_conservative: 1.2, compassionate_conservative: 1.0, mainstream_liberal: 0.1 },
        currentEndorsement: null,
        retractCondition: {
            issue: 'guns',
            threshold: -2 // If endorsed candidate's position is <= -2 (pro gun control)
        }
    },
    {
        id: 'nyt_editorial',
        name: 'NYT Editorial Board',
        type: 'Media',
        state: 'National',
        targetGroupId: 'whitecollar',
        baseInfluence: 0.08,
        factionPreferences: { pragmatic_moderate: 1.5, mainstream_liberal: 0.8, activist_left: 0.5, compassionate_conservative: 0.3 },
        currentEndorsement: null,
        retractCondition: null
    },
    {
        id: 'gov_shapiro',
        name: 'Gov. Josh Shapiro',
        type: 'Governor',
        state: 'PA',
        targetGroupId: 'centrists',
        baseInfluence: 0.12, // High state influence
        factionPreferences: { pragmatic_moderate: 1.5, unaligned_center: 1.2, mainstream_liberal: 0.8, activist_left: 0.2 },
        currentEndorsement: null,
        retractCondition: null
    },
    {
        id: 'gov_kemp',
        name: 'Gov. Brian Kemp',
        type: 'Governor',
        state: 'GA',
        targetGroupId: 'compassionate_conservative',
        baseInfluence: 0.12,
        factionPreferences: { compassionate_conservative: 1.5, unaligned_center: 1.0, america_first_conservative: 0.5, religious_right: 0.8 },
        currentEndorsement: null,
        retractCondition: null
    }
    // Expandable list of endorsers
];

var EndorserSystem = {
    endorsers: [],

    init: function() {
        // Deep copy the master list
        this.endorsers = JSON.parse(JSON.stringify(ENDORSERS));
        this.applyDefaultEndorsements();
    },

    applyDefaultEndorsements: function() {
        // Automatically endorse highly compatible candidates at game start
        if (!gameData || !gameData.selectedParty) return;
        
        let activeCandidates = [];
        if (typeof _buildActiveCandidatesList === 'function') {
            activeCandidates = _buildActiveCandidatesList();
        }

        for (let i = 0; i < this.endorsers.length; i++) {
            let e = this.endorsers[i];
            
            let bestCand = null;
            let bestScore = 0;

            for (let c of activeCandidates) {
                let faction = c.factionId || (c.party === 'D' ? 'mainstream_liberal' : 'compassionate_conservative');
                let score = e.factionPreferences[faction] || 0.1;
                
                if (score > 1.2 && score > bestScore) {
                    bestScore = score;
                    bestCand = c.id;
                }
            }

            if (bestCand) {
                e.currentEndorsement = bestCand;
            }
        }
    },

    getEndorsersForCandidate: function(candidateId) {
        return this.endorsers.filter(e => e.currentEndorsement === candidateId);
    },

    processRetractConditions: function() {
        if (!gameData || !gameData.issuePositions) return;

        for (let i = 0; i < this.endorsers.length; i++) {
            let e = this.endorsers[i];
            if (!e.currentEndorsement) continue;

            // Retraction logic based on issue thresholds
            if (e.retractCondition) {
                let candId = e.currentEndorsement;
                let candPos = gameData.issuePositions[candId] && gameData.issuePositions[candId][e.retractCondition.issue];
                
                if (candPos !== undefined) {
                    let threshold = e.retractCondition.threshold;
                    let retracted = false;
                    
                    if (threshold > 0 && candPos >= threshold) retracted = true;
                    if (threshold < 0 && candPos <= threshold) retracted = true;

                    if (retracted) {
                        Utils.addLog(`⚠️ ${e.name} has RETRACTED their endorsement of ${candId} due to policy positions.`);
                        e.currentEndorsement = null;
                    }
                }
            }
        }
    },

    lobbyEndorser: function(endorserId) {
        if (!gameData.energy || gameData.energy < 1) {
            Utils.showToast("Not enough Energy to lobby.");
            return false;
        }

        let e = this.endorsers.find(x => x.id === endorserId);
        if (!e) return false;

        let playerCandId = gameData.playerCandidate || "harris";
        let playerCand = null; // Get candidate details
        if (typeof Utils !== 'undefined' && Utils.getCandidateById) {
            playerCand = Utils.getCandidateById(playerCandId);
        }

        let faction = playerCand ? playerCand.factionId : 'mainstream_liberal';
        let compatibility = e.factionPreferences[faction] || 0.1;

        gameData.energy -= 1;
        if (typeof updateHUD === 'function') updateHUD();

        let roll = Math.random();
        // Base chance is compatibility / 2. (Max 1.5 / 2 = 75%)
        // Poaching penalty if currently endorsed by opponent
        let chance = compatibility * 0.5;
        if (e.currentEndorsement && e.currentEndorsement !== playerCandId) {
            chance *= 0.3; // Hard to poach
        }

        if (roll < chance) {
            let previous = e.currentEndorsement;
            e.currentEndorsement = playerCandId;
            
            if (previous) {
                Utils.addLog(`🎉 SUCCESS: ${e.name} has flipped their endorsement to you!`);
                Utils.showToast("Endorsement Poached!");
            } else {
                Utils.addLog(`🎉 SUCCESS: ${e.name} has endorsed your campaign.`);
                Utils.showToast("Endorsement Secured!");
            }
            
            // Apply bonus
            if (e.state !== 'National') {
                if (gameData.states[e.state]) {
                    gameData.states[e.state].margin += (e.baseInfluence * 10);
                }
            } else {
                if (typeof applyCampaignGroupSwing === 'function') {
                    applyCampaignGroupSwing(e.targetGroupId, e.baseInfluence);
                }
            }
            
            return true;
        } else {
            Utils.addLog(`❌ FAILED: ${e.name} declined your lobbying pitch.`);
            Utils.showToast("Lobbying Failed.");
            return false;
        }
    }
};

// Hook into campaign weekly loop
if (typeof Campaign !== 'undefined') {
    let _originalNextWeek = Campaign.nextWeek;
    if (_originalNextWeek) {
        Campaign.nextWeek = function() {
            EndorserSystem.processRetractConditions();
            _originalNextWeek.apply(this, arguments);
        };
    }
}
