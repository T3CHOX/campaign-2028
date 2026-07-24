/* ============================================
   DECISION 2028 - POLICY SYSTEM
   ============================================ */

const POLICIES = [
    // --- IMMIGRATION ---
    {
        id: 'abolish_ice',
        name: 'Abolish ICE',
        desc: 'Commit to abolishing Immigration and Customs Enforcement and restructuring border policy purely around humanitarian processing.',
        icon: 'fa-regular fa-id-badge',
        issueId: 'immigration',
        cost: { funds: 2.0, energy: 1 },
        allowedFactions: ['outsider_leftist', 'activist_left'],
        baseEffects: {
            demographics: { 'hispanic': 2, 'progressives': 4, 'maga': -5, 'whitecollar': -2, 'suburban': -2 }
        }
    },
    {
        id: 'build_wall',
        name: 'Build the Wall',
        desc: 'Finish construction of the southern border wall, surge border patrol funding, and aggressively stop illegal crossings.',
        icon: 'fa-solid fa-brick',
        issueId: 'immigration',
        cost: { funds: 2.5, energy: 1 },
        allowedFactions: ['america_first_conservative', 'populist_right', 'religious_right'],
        baseEffects: {
            demographics: { 'maga': 4, 'rural': 2, 'bluecollar': 1, 'hispanic': -3, 'progressives': -4 }
        }
    },
    {
        id: 'path_citizenship',
        name: 'Path to Citizenship',
        desc: 'Comprehensive immigration reform offering a long-term path to legal status for undocumented immigrants.',
        icon: 'fa-solid fa-passport',
        issueId: 'immigration',
        cost: { funds: 1.5, energy: 1 },
        allowedFactions: ['mainstream_liberal', 'pragmatic_moderate', 'compassionate_conservative', 'unaligned_center'],
        baseEffects: {
            demographics: { 'hispanic': 3, 'suburban': 1, 'maga': -3, 'rural': -1 }
        }
    },
    {
        id: 'mass_deportation',
        name: 'Mass Deportation Program',
        desc: 'Launch the largest domestic deportation operation in history to remove millions of undocumented immigrants.',
        icon: 'fa-solid fa-truck-fast',
        issueId: 'immigration',
        cost: { funds: 3.0, energy: 2 },
        allowedFactions: ['america_first_conservative', 'populist_right'],
        baseEffects: {
            demographics: { 'maga': 5, 'rural': 2, 'hispanic': -5, 'suburban': -2, 'college': -2 },
            economy: { 'agri_index': -0.4 } // Loss of agricultural labor
        }
    },
    // --- ECONOMY / TRADE ---
    {
        id: 'ubi',
        name: 'Universal Basic Income',
        desc: 'Implement a $1,000/month dividend for every American adult to eradicate poverty and stimulate the economy.',
        icon: 'fa-solid fa-money-bill-wave',
        issueId: 'economy',
        cost: { funds: 3.5, energy: 2 },
        allowedFactions: ['outsider_leftist', 'activist_left', 'unaligned_center'],
        baseEffects: {
            demographics: { 'youth': 4, 'noncollege': 2, 'whitecollar': -3, 'smallbusiness': -2 }
        }
    },
    {
        id: 'flat_tax',
        name: 'Flat Tax Rate',
        desc: 'Abolish the progressive income tax system and IRS in favor of a single flat tax for all citizens.',
        icon: 'fa-solid fa-percent',
        issueId: 'taxation',
        cost: { funds: 2.0, energy: 1 },
        allowedFactions: ['compassionate_conservative', 'religious_right'],
        baseEffects: {
            demographics: { 'smallbusiness': 4, 'whitecollar': 3, 'union': -3, 'black': -2 }
        }
    },
    {
        id: 'wealth_tax',
        name: 'Ultra-Millionaire Wealth Tax',
        desc: 'Impose an annual tax on the total net worth of billionaires and centi-millionaires to fund social programs.',
        icon: 'fa-solid fa-sack-dollar',
        issueId: 'taxation',
        cost: { funds: 2.0, energy: 1 },
        allowedFactions: ['outsider_leftist', 'activist_left', 'mainstream_liberal'],
        baseEffects: {
            demographics: { 'progressives': 4, 'youth': 2, 'whitecollar': -3, 'smallbusiness': -1 }
        }
    },
    {
        id: 'protective_tariffs',
        name: 'Protective Tariffs',
        desc: 'Implement sweeping tariffs on foreign goods to bring manufacturing jobs back home, regardless of trade war risks.',
        icon: 'fa-solid fa-industry',
        issueId: 'trade',
        cost: { funds: 2.5, energy: 2 },
        allowedFactions: ['populist_right', 'america_first_conservative', 'outsider_leftist'],
        baseEffects: {
            demographics: { 'bluecollar': 4, 'union': 3, 'college': -3, 'whitecollar': -2 },
            economy: { 'mfg_index': 0.6, 'agri_index': -0.4 } // Huge boost to manufacturing counties, hits ag exports
        }
    },
    {
        id: 'free_trade_deals',
        name: 'Expand Free Trade',
        desc: 'Aggressively pursue new international free trade agreements to lower consumer prices and boost tech/ag exports.',
        icon: 'fa-solid fa-ship',
        issueId: 'trade',
        cost: { funds: 1.5, energy: 1 },
        allowedFactions: ['pragmatic_moderate', 'compassionate_conservative', 'mainstream_liberal'],
        baseEffects: {
            demographics: { 'whitecollar': 3, 'college': 2, 'farmers': 2, 'bluecollar': -3, 'union': -2 },
            economy: { 'agri_index': 0.4, 'mfg_index': -0.3 }
        }
    },
    // --- HEALTHCARE ---
    {
        id: 'medicare_for_all',
        name: 'Medicare for All',
        desc: 'Transition to a single-payer healthcare system, guaranteeing care as a human right and eliminating private insurance.',
        icon: 'fa-solid fa-staff-snake',
        issueId: 'healthcare',
        cost: { funds: 4.0, energy: 2 },
        allowedFactions: ['outsider_leftist', 'activist_left'],
        baseEffects: {
            demographics: { 'progressives': 5, 'youth': 3, 'whitecollar': -3, 'smallbusiness': -2 }
        }
    },
    {
        id: 'public_option',
        name: 'Public Option',
        desc: 'Create a government-run health insurance agency to compete with private insurers and drive down costs.',
        icon: 'fa-solid fa-file-medical',
        issueId: 'healthcare',
        cost: { funds: 2.0, energy: 1 },
        allowedFactions: ['mainstream_liberal', 'pragmatic_moderate'],
        baseEffects: {
            demographics: { 'seniors': 2, 'women': 2, 'suburban': 1, 'maga': -1 }
        }
    },
    {
        id: 'repeal_aca',
        name: 'Repeal the ACA',
        desc: 'Completely dismantle the Affordable Care Act and replace it with free-market healthcare alternatives.',
        icon: 'fa-solid fa-ban',
        issueId: 'healthcare',
        cost: { funds: 2.5, energy: 1 },
        allowedFactions: ['compassionate_conservative', 'religious_right', 'america_first_conservative'],
        baseEffects: {
            demographics: { 'maga': 3, 'smallbusiness': 2, 'seniors': -2, 'progressives': -3 }
        }
    },
    // --- ENVIRONMENT & ENERGY ---
    {
        id: 'green_new_deal',
        name: 'Green New Deal',
        desc: 'A massive government mobilization to transition the economy to 100% renewable energy and guarantee green jobs.',
        icon: 'fa-solid fa-leaf',
        issueId: 'climate',
        cost: { funds: 3.5, energy: 2 },
        allowedFactions: ['outsider_leftist', 'activist_left'],
        baseEffects: {
            demographics: { 'youth': 4, 'progressives': 4, 'rural': -4, 'bluecollar': -3 },
            economy: { 'mfg_index': 0.1, 'agri_index': -0.2 }
        }
    },
    {
        id: 'drill_baby_drill',
        name: 'Unleash American Energy',
        desc: 'Remove restrictions on drilling and fracking, aggressively expanding domestic fossil fuel production.',
        icon: 'fa-solid fa-gas-pump',
        issueId: 'energy',
        cost: { funds: 2.0, energy: 1 },
        allowedFactions: ['populist_right', 'america_first_conservative', 'religious_right', 'compassionate_conservative'],
        baseEffects: {
            demographics: { 'rural': 3, 'bluecollar': 2, 'maga': 2, 'progressives': -4, 'youth': -2 },
            economy: { 'mfg_index': 0.2, 'agri_index': 0.1 }
        }
    },
    {
        id: 'carbon_tax',
        name: 'National Carbon Tax',
        desc: 'Implement a market-based tax on carbon emissions to economically incentivize the green transition.',
        icon: 'fa-solid fa-smog',
        issueId: 'climate',
        cost: { funds: 2.0, energy: 1 },
        allowedFactions: ['pragmatic_moderate', 'mainstream_liberal', 'unaligned_center'],
        baseEffects: {
            demographics: { 'college': 3, 'suburban': 1, 'rural': -3, 'bluecollar': -2 }
        }
    },
    // --- SOCIAL ---
    {
        id: 'abortion_ban',
        name: 'Federal Abortion Ban',
        desc: 'Pass strict federal legislation banning abortion nationwide to protect the unborn.',
        icon: 'fa-solid fa-baby',
        issueId: 'abortion',
        cost: { funds: 3.0, energy: 1 },
        allowedFactions: ['religious_right', 'america_first_conservative'],
        baseEffects: {
            demographics: { 'evangelical': 5, 'maga': 2, 'women': -4, 'suburban': -3, 'secular': -4 }
        }
    },
    {
        id: 'codify_roe',
        name: 'Codify Roe v. Wade',
        desc: 'Pass sweeping federal legislation ensuring nationwide abortion access without state-level restrictions.',
        icon: 'fa-solid fa-scale-balanced',
        issueId: 'abortion',
        cost: { funds: 2.5, energy: 1 },
        allowedFactions: ['activist_left', 'mainstream_liberal', 'pragmatic_moderate'],
        baseEffects: {
            demographics: { 'women': 4, 'secular': 3, 'youth': 2, 'evangelical': -5 }
        }
    },
    {
        id: 'gun_ban',
        name: 'Assault Weapons Ban',
        desc: 'Ban the sale of semi-automatic rifles and high-capacity magazines nationwide.',
        icon: 'fa-solid fa-gun',
        issueId: 'guns',
        cost: { funds: 2.0, energy: 1 },
        allowedFactions: ['activist_left', 'mainstream_liberal'],
        baseEffects: {
            demographics: { 'suburban': 2, 'women': 2, 'rural': -4, 'maga': -3 }
        }
    },
    {
        id: 'constitutional_carry',
        name: 'National Constitutional Carry',
        desc: 'Enforce nationwide concealed carry reciprocity and block state-level gun control laws.',
        icon: 'fa-solid fa-shield',
        issueId: 'guns',
        cost: { funds: 2.0, energy: 1 },
        allowedFactions: ['america_first_conservative', 'populist_right', 'religious_right'],
        baseEffects: {
            demographics: { 'rural': 4, 'maga': 3, 'suburban': -2, 'women': -2 }
        }
    },
    // --- GOVERNANCE & JUSTICE ---
    {
        id: 'defund_police',
        name: 'Restructure Policing',
        desc: 'Divert massive amounts of federal funding from police departments toward social services and mental health.',
        icon: 'fa-solid fa-handcuffs',
        issueId: 'criminal',
        cost: { funds: 2.5, energy: 2 },
        allowedFactions: ['outsider_leftist', 'activist_left'],
        baseEffects: {
            demographics: { 'progressives': 4, 'youth': 2, 'suburban': -4, 'seniors': -3, 'whitecollar': -2 }
        }
    },
    {
        id: 'tough_on_crime',
        name: 'Tough on Crime Act',
        desc: 'Surge federal funding for local police, re-institute mandatory minimums, and support qualified immunity.',
        icon: 'fa-solid fa-gavel',
        issueId: 'criminal',
        cost: { funds: 2.0, energy: 1 },
        allowedFactions: ['compassionate_conservative', 'populist_right', 'america_first_conservative'],
        baseEffects: {
            demographics: { 'seniors': 3, 'suburban': 2, 'maga': 2, 'black': -3, 'progressives': -3 }
        }
    },
    {
        id: 'pack_scotus',
        name: 'Expand the Supreme Court',
        desc: 'Add new justices to the Supreme Court to counterbalance recent conservative appointments.',
        icon: 'fa-solid fa-building-columns',
        issueId: 'scotus',
        cost: { funds: 3.5, energy: 2 },
        allowedFactions: ['activist_left', 'outsider_leftist'],
        baseEffects: {
            demographics: { 'progressives': 4, 'secular': 2, 'centrists': -2, 'maga': -4 }
        }
    },
    {
        id: 'term_limits',
        name: 'Congressional Term Limits',
        desc: 'Pass a constitutional amendment limiting the number of terms members of Congress can serve.',
        icon: 'fa-solid fa-hourglass-end',
        issueId: 'electionreform',
        cost: { funds: 1.0, energy: 1 },
        allowedFactions: ['unaligned_center', 'populist_right', 'outsider_leftist'],
        baseEffects: {
            demographics: { 'centrists': 3, 'maga': 2, 'youth': 1, 'seniors': -1 }
        }
    },
    // --- AGRICULTURE SPECIAL (Because we have economy data) ---
    {
        id: 'ag_subsidies',
        name: 'Expand Agri-Subsidies',
        desc: 'Massively expand federal subsidies to small farmers and agricultural corporations to secure the food supply.',
        icon: 'fa-solid fa-tractor',
        issueId: 'economy',
        cost: { funds: 2.5, energy: 1 },
        allowedFactions: ['compassionate_conservative', 'pragmatic_moderate', 'populist_right'],
        baseEffects: {
            demographics: { 'farmers': 5, 'rural': 2, 'urban': -1 },
            economy: { 'agri_index': 0.8 } // Enormous boost to heavily agricultural counties
        }
    }
];

const PolicyManager = {
    // Current state of adopted policies: { player: [...], demOpponent: [...], repOpponent: [...] }
    activePolicies: {},

    init: function() {
        this.activePolicies = {
            player: [],
            demOpponent: [],
            repOpponent: [],
            thirdParty: []
        };
    },

    getAvailablePolicies: function(partyKey) {
        var factions = [];
        var pres = null;
        var vp = null;
        
        if (partyKey === gameData.selectedParty) {
            pres = gameData.candidate;
            vp = gameData.vp;
        } else if (partyKey === 'D') {
            pres = gameData.demTicket ? gameData.demTicket.pres : null;
            vp = gameData.demTicket ? gameData.demTicket.vp : null;
        } else if (partyKey === 'R') {
            pres = gameData.repTicket ? gameData.repTicket.pres : null;
            vp = gameData.repTicket ? gameData.repTicket.vp : null;
        } else if (gameData.thirdTickets && gameData.thirdTickets[partyKey]) {
            pres = gameData.thirdTickets[partyKey].pres;
            vp = gameData.thirdTickets[partyKey].vp;
        }

        if (pres && pres.factionId) factions.push(pres.factionId);
        if (vp && vp.factionId) factions.push(vp.factionId);

        return POLICIES.filter(p => {
            // Already adopted?
            var key = this._getTrackerKey(partyKey);
            if (this.activePolicies[key] && this.activePolicies[key].find(a => a.id === p.id)) return false;
            
            // Matches faction?
            return p.allowedFactions.some(f => factions.includes(f));
        });
    },

    _getTrackerKey: function(partyKey) {
        if (partyKey === gameData.selectedParty) return 'player';
        if (partyKey === 'D') return 'demOpponent';
        if (partyKey === 'R') return 'repOpponent';
        return 'thirdParty';
    },

    adoptPolicy: function(partyKey, policyId, suppressToast) {
        var p = POLICIES.find(x => x.id === policyId);
        if (!p) return false;

        var key = this._getTrackerKey(partyKey);
        if (!this.activePolicies[key]) this.activePolicies[key] = [];

        // Check if player can afford it
        if (partyKey === gameData.selectedParty) {
            if (gameData.funds < p.cost.funds || gameData.energy < p.cost.energy) {
                if (!suppressToast) Utils.showToast("Not enough Funds or Energy to adopt this policy.");
                return false;
            }
            gameData.funds -= p.cost.funds;
            gameData.energy -= p.cost.energy;
        }

        this.activePolicies[key].push({
            id: p.id,
            importance: 25, // Starts at 25% importance (max 100)
            adoptedWeek: gameData.currentWeek || 0
        });

        if (!suppressToast && partyKey === gameData.selectedParty) {
            Utils.showToast("Adopted Policy: " + p.name);
            Utils.addLog("Adopted key platform policy: " + p.name + ".");
        }
        
        // Immediately apply buffs to map so we see effect
        if (typeof applyCandidateBuffs === 'function') {
            applyCandidateBuffs();
            if (typeof Campaign !== 'undefined') {
                Campaign.updateHUD();
                Campaign.renderMap();
            }
        }

        return true;
    },

    // Called when a campaign action targets a specific issue
    campaignOnIssue: function(partyKey, issueId, boostAmount) {
        var key = this._getTrackerKey(partyKey);
        if (!this.activePolicies[key]) return;

        var policiesBoosted = 0;
        this.activePolicies[key].forEach(pState => {
            var pDef = POLICIES.find(x => x.id === pState.id);
            if (pDef && pDef.issueId === issueId) {
                // Boost importance, max 100
                pState.importance = Math.min(100, pState.importance + boostAmount);
                policiesBoosted++;
            }
        });

        if (policiesBoosted > 0 && partyKey === gameData.selectedParty && typeof applyCandidateBuffs === 'function') {
            applyCandidateBuffs();
            if (typeof Campaign !== 'undefined') {
                Campaign.renderMap();
            }
        }
    },

    // Called at the end of every week to decay importance of policies that aren't campaigned on
    processWeeklyPolicyDecay: function() {
        var decayRate = 2; // Lose 2 importance points per week
        for (var key in this.activePolicies) {
            this.activePolicies[key].forEach(pState => {
                pState.importance = Math.max(5, pState.importance - decayRate); // Never drops below 5% once adopted
            });
        }
    },

    // Generate AI policies dynamically
    processAIPolicies: function() {
        var opponents = ['D', 'R'];
        if (gameData.thirdPartiesEnabled) {
            opponents = opponents.concat(['L', 'G', 'I', 'PSL']);
        }

        opponents.forEach(party => {
            if (party === gameData.selectedParty) return;
            var key = this._getTrackerKey(party);
            if (!this.activePolicies[key]) this.activePolicies[key] = [];
            
            // AI adopts up to 3 policies (1 per week generally until max)
            if (this.activePolicies[key].length < 3 && Math.random() < 0.3) {
                var available = this.getAvailablePolicies(party);
                if (available.length > 0) {
                    // Randomly adopt one
                    var choice = available[Math.floor(Math.random() * available.length)];
                    this.adoptPolicy(party, choice.id, true);
                    
                    if (party === 'D' || party === 'R') {
                        var pres = party === 'D' ? gameData.demTicket.pres : gameData.repTicket.pres;
                        if (pres) {
                            Utils.addLog(pres.name + " announced a new platform initiative: " + choice.name + ".");
                        }
                    }
                }
            }
            
            // AI randomly campaigns on their active policies to keep importance up
            if (this.activePolicies[key].length > 0 && Math.random() < 0.6) {
                var pToBoost = this.activePolicies[key][Math.floor(Math.random() * this.activePolicies[key].length)];
                var pDef = POLICIES.find(x => x.id === pToBoost.id);
                if (pDef) {
                    this.campaignOnIssue(party, pDef.issueId, 15);
                }
            }
        });
    },
    
    // Returns the combined group effects for a party to be applied to counties
    getPolicyGroupEffects: function(partyKey) {
        var key = this._getTrackerKey(partyKey);
        var combinedEffects = {};
        var combinedEconomyEffects = { 'agri_index': 0, 'mfg_index': 0 };
        
        if (!this.activePolicies[key]) return { groupEffects: combinedEffects, economyEffects: combinedEconomyEffects };
        
        this.activePolicies[key].forEach(pState => {
            var pDef = POLICIES.find(x => x.id === pState.id);
            if (pDef) {
                // Importance scalar: 100 importance = 1.0 multiplier, 5 importance = 0.05 multiplier
                var scalar = pState.importance / 100;
                
                // Add demographic effects
                if (pDef.baseEffects.demographics) {
                    for (var group in pDef.baseEffects.demographics) {
                        if (!combinedEffects[group]) combinedEffects[group] = 0;
                        combinedEffects[group] += pDef.baseEffects.demographics[group] * scalar;
                    }
                }
                
                // Add economy effects
                if (pDef.baseEffects.economy) {
                    for (var econKey in pDef.baseEffects.economy) {
                        combinedEconomyEffects[econKey] += pDef.baseEffects.economy[econKey] * scalar;
                    }
                }
            }
        });
        
        return { groupEffects: combinedEffects, economyEffects: combinedEconomyEffects };
    }
};
