/* ============================================
   DECISION 2028 - ENDORSEMENT SYSTEM (v2)
   ============================================ */

var Endorsements = {
    TYPES: [
        {
            id: 'newspaper',
            name: 'Major Newspaper Endorsement',
            description: 'A leading state newspaper endorses your campaign',
            effect: { type: 'state_persuasion', bonus: 0.008, duration: 2 },
            stateSpecific: true,
            controversial: false
        },
        {
            id: 'former_president',
            name: 'Former President Endorsement',
            description: 'A former president from your party publicly endorses you',
            effect: { type: 'group_swing', groups: 3, bonus: 0.03, duration: 0 },
            stateSpecific: false,
            controversial: false
        },
        {
            id: 'labor_union',
            name: 'National Labor Union Endorsement',
            description: 'AFL-CIO and allied unions endorse your campaign',
            effect: { type: 'group_specific', group: 'union', swing: 0.10, fieldBonus: 0.20, duration: 0 },
            stateSpecific: false,
            controversial: false,
            exclusion: 'business_council'
        },
        {
            id: 'celebrity',
            name: 'Celebrity Endorsement',
            description: 'A major celebrity endorses your campaign on social media',
            effect: { type: 'group_specific', group: 'genz', swing: 0.06, digitalBonus: 0.15, duration: 1 },
            stateSpecific: false,
            controversial: true
        },
        {
            id: 'governor',
            name: 'Swing State Governor Endorsement',
            description: 'A popular governor in a battleground state backs you',
            effect: { type: 'state_boost', bonus: 0.012, freeSurrogate: true, duration: 0 },
            stateSpecific: true,
            controversial: false
        },
        {
            id: 'military_veterans',
            name: 'Military Veterans Group Endorsement',
            description: 'A major veterans organization endorses your foreign policy',
            effect: { type: 'issue_alignment', issue: 'foreign', bonus: 0.05, duration: 0 },
            stateSpecific: false,
            controversial: false
        },
        {
            id: 'business_council',
            name: 'Business Council Endorsement',
            description: 'The National Business Council endorses your economic plan',
            effect: { type: 'fundraising_boost', bonus: 0.25, groupSwing: { group: 'smallbusiness', swing: 0.05 }, duration: 2 },
            stateSpecific: false,
            controversial: false,
            exclusion: 'labor_union'
        }
    ],

    active: [],
    accepted: [],
    declined: [],

    processEndorsementDrop: function() {
        // Pick a random endorsement that hasn't been offered
        var available = [];
        for (var i = 0; i < this.TYPES.length; i++) {
            var etype = this.TYPES[i];
            if (this.accepted.indexOf(etype.id) === -1 && this.declined.indexOf(etype.id) === -1) {
                if (!this.checkMutualExclusion(etype.id)) {
                    available.push(etype);
                }
            }
        }

        if (available.length === 0) {
            // All endorsements used — give a generic boost
            Campaign.adjustFavorability(0.01, 'Minor endorsement');
            Utils.addLog('📰 Minor endorsement received');
            return;
        }

        var endorsement = available[Math.floor(Math.random() * available.length)];
        this.offerEndorsement(endorsement);
    },

    offerEndorsement: function(endorsement) {
        // Assign a state if state-specific
        var state = null;
        if (endorsement.stateSpecific) {
            // Pick a swing state
            var swingStates = [];
            for (var code in gameData.states) {
                if (Math.abs(gameData.states[code].margin) < 8) {
                    swingStates.push(code);
                }
            }
            if (swingStates.length > 0) {
                state = swingStates[Math.floor(Math.random() * swingStates.length)];
            }
        }

        Utils.addLog('📬 ENDORSEMENT OFFER: ' + endorsement.name);
        Utils.showToast('📬 ' + endorsement.name + ' — Accept or Decline?');

        // Auto-accept for now (UI modal would go here in full implementation)
        this.acceptEndorsement(endorsement, state);
    },

    acceptEndorsement: function(endorsement, state) {
        this.accepted.push(endorsement.id);

        var effect = endorsement.effect;
        var activeEntry = {
            id: endorsement.id,
            name: endorsement.name,
            state: state,
            weeksRemaining: effect.duration || 0,
            effect: effect
        };

        if (effect.duration > 0) {
            this.active.push(activeEntry);
        }

        // Apply immediate effects
        switch (effect.type) {
            case 'state_persuasion':
                if (state) this._applyStatePersuasionBonus(state, effect.bonus);
                break;

            case 'group_swing':
                this._applyTopGroupSwing(effect.groups, effect.bonus);
                break;

            case 'group_specific':
                if (typeof applyCampaignGroupSwing === 'function') {
                    applyCampaignGroupSwing(effect.group, effect.swing);
                }
                break;

            case 'state_boost':
                if (state) this._applyStatePersuasionBonus(state, effect.bonus);
                break;

            case 'issue_alignment':
                // Stored as active modifier — checked during persuasion calculations
                break;

            case 'fundraising_boost':
                // Stored as active modifier — checked during fundraising
                if (effect.groupSwing && typeof applyCampaignGroupSwing === 'function') {
                    applyCampaignGroupSwing(effect.groupSwing.group, effect.groupSwing.swing);
                }
                break;
        }

        Utils.addLog('✅ Accepted: ' + endorsement.name + (state ? ' (' + gameData.states[state].name + ')' : ''));
        Utils.showToast('✅ ' + endorsement.name + ' accepted!');

        // Momentum boost
        gameData.campaignMomentum = Math.min(1, gameData.campaignMomentum + 0.02);
    },

    declineEndorsement: function(endorsement) {
        this.declined.push(endorsement.id);

        Utils.addLog('❌ Declined: ' + endorsement.name);

        // Controversial source — declining adds momentum
        if (endorsement.controversial) {
            gameData.campaignMomentum = Math.min(1, gameData.campaignMomentum + 0.01);
            Utils.addLog('   Independence signal: +1% momentum');
        }
    },

    checkMutualExclusion: function(typeId) {
        for (var i = 0; i < this.TYPES.length; i++) {
            var etype = this.TYPES[i];
            if (etype.id === typeId && etype.exclusion) {
                if (this.accepted.indexOf(etype.exclusion) !== -1) {
                    return true; // Excluded
                }
            }
        }
        return false;
    },

    processActiveEndorsements: function() {
        var updated = [];
        for (var i = 0; i < this.active.length; i++) {
            var entry = this.active[i];
            if (entry.weeksRemaining > 0) {
                entry.weeksRemaining--;

                // Re-apply weekly effects for ongoing endorsements
                if (entry.effect.type === 'state_persuasion' && entry.state) {
                    this._applyStatePersuasionBonus(entry.state, entry.effect.bonus * 0.5);
                }

                if (entry.weeksRemaining > 0) {
                    updated.push(entry);
                } else {
                    Utils.addLog('📰 Endorsement effect expires: ' + entry.name);
                }
            }
        }
        this.active = updated;
    },

    getActiveEffectMultiplier: function(effectType) {
        var multiplier = 1.0;
        for (var i = 0; i < this.active.length; i++) {
            var entry = this.active[i];
            if (entry.effect.type === 'fundraising_boost' && effectType === 'fundraising') {
                multiplier += entry.effect.bonus;
            }
            if (entry.effect.type === 'group_specific') {
                if (effectType === 'field' && entry.effect.fieldBonus) {
                    multiplier += entry.effect.fieldBonus;
                }
                if (effectType === 'digital' && entry.effect.digitalBonus) {
                    multiplier += entry.effect.digitalBonus;
                }
            }
        }
        return multiplier;
    },

    _applyStatePersuasionBonus: function(stateCode, bonus) {
        if (typeof Counties === 'undefined' || !Counties.countyData) return;
        var stateFips = STATES[stateCode] ? STATES[stateCode].fips : null;
        if (!stateFips) return;

        var playerParty = gameData.selectedParty;
        for (var fips in Counties.countyData) {
            var paddedFips = fips.padStart(5, '0');
            if (paddedFips.substring(0, 2) === stateFips) {
                var county = Counties.countyData[fips];
                if (!county || !county.v) continue;
                if (playerParty === 'D') {
                    county.v.D = Math.min(100, county.v.D + bonus);
                    county.v.R = Math.max(0, county.v.R - bonus);
                } else if (playerParty === 'R') {
                    county.v.R = Math.min(100, county.v.R + bonus);
                    county.v.D = Math.max(0, county.v.D - bonus);
                }
            }
        }
        Counties.updateStateFromCounties(stateCode);
    },

    _applyTopGroupSwing: function(count, bonus) {
        if (typeof applyCampaignGroupSwing !== 'function') return;
        // Get top party-aligned groups
        var partyKey = gameData.selectedParty;
        var groups = [];
        for (var gid in INTEREST_GROUPS) {
            var g = INTEREST_GROUPS[gid];
            if (g.support && g.support[partyKey] > 40) {
                groups.push({ id: gid, support: g.support[partyKey] });
            }
        }
        groups.sort(function(a, b) { return b.support - a.support; });
        var top = groups.slice(0, count);
        for (var i = 0; i < top.length; i++) {
            applyCampaignGroupSwing(top[i].id, bonus);
        }
    }
};
