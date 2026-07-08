/* ============================================
   DECISION 2028 - FACTION SYSTEM
   ============================================ */

const FACTIONS = {
    outsider_leftist: {
        id: 'outsider_leftist',
        name: 'Outsider Leftist',
        emblem: 'assets/factions/faction_outsider_leftist.svg',
        color: '#27ae60',
        party: 'G',
        coreGroups: ['progressives', 'youth', 'secular'],
        baseTurnoutBonus: 0.10,
        description: 'Eco-socialist, anti-capitalist, and independent left.',
        synergy: {
            outsider_leftist: 1.0, activist_left: 0.5, mainstream_liberal: -0.5
        }
    },
    activist_left: {
        id: 'activist_left',
        name: 'The Activist Left',
        emblem: 'assets/factions/faction_activist_left.svg',
        color: '#8e44ad',
        party: 'D',
        coreGroups: ['progressives', 'youth', 'lgbtq_community'],
        baseTurnoutBonus: 0.15,
        description: 'Highly ideological, aggressive base. Demands bold climate and social justice action.',
        synergy: {
            activist_left: 1.0, outsider_leftist: 0.5, mainstream_liberal: 0.8, pragmatic_moderate: -0.2
        }
    },
    mainstream_liberal: {
        id: 'mainstream_liberal',
        name: 'Mainstream Liberal',
        emblem: 'assets/factions/faction_mainstream_liberal.svg',
        color: '#2980b9',
        party: 'D',
        coreGroups: ['progressives', 'urban', 'union'],
        baseTurnoutBonus: 0.10,
        description: 'Focuses on structural economic reform, healthcare, and labor.',
        synergy: {
            activist_left: 0.8, mainstream_liberal: 1.0, pragmatic_moderate: 0.6, unaligned_center: 0.2
        }
    },
    pragmatic_moderate: {
        id: 'pragmatic_moderate',
        name: 'Pragmatic Moderate',
        emblem: 'assets/factions/faction_pragmatic_moderate.svg',
        color: '#00AEF3',
        party: 'D',
        coreGroups: ['black', 'women', 'college', 'whitecollar'],
        baseTurnoutBonus: 0.05,
        description: 'Pragmatic, institutionalist wing. Focuses on broad electability.',
        synergy: {
            mainstream_liberal: 0.6, pragmatic_moderate: 1.0, unaligned_center: 0.6, activist_left: -0.3
        }
    },
    unaligned_center: {
        id: 'unaligned_center',
        name: 'Unaligned Center',
        emblem: 'assets/factions/faction_unaligned_center.svg',
        color: '#95a5a6',
        party: 'I',
        coreGroups: ['suburban', 'suburban_women', 'centrists'],
        baseTurnoutBonus: 0.05,
        description: 'Swing constituency. Highly sensitive to extreme rhetoric from either side.',
        synergy: {
            pragmatic_moderate: 0.6, compassionate_conservative: 0.6, america_first_conservative: -0.6, activist_left: -0.6
        }
    },
    compassionate_conservative: {
        id: 'compassionate_conservative',
        name: '‘Compassionate’ Conservative',
        emblem: 'assets/factions/faction_compassionate_conservative.svg',
        color: '#c0392b',
        party: 'R',
        coreGroups: ['whitecollar', 'smallbusiness', 'seniors'],
        baseTurnoutBonus: 0.05,
        description: 'Traditional conservative wing focused on tax cuts, deregulation, and stability.',
        synergy: {
            unaligned_center: 0.6, compassionate_conservative: 1.0, america_first_conservative: 0.2, religious_right: 0.4
        }
    },
    religious_right: {
        id: 'religious_right',
        name: 'The Religious Right',
        emblem: 'assets/factions/faction_religious_right.svg',
        color: '#7f8c8d',
        party: 'R',
        coreGroups: ['evangelical', 'rural', 'maga'],
        baseTurnoutBonus: 0.10,
        description: 'Deeply ideological conservative base focused on social issues and institutions.',
        synergy: {
            compassionate_conservative: 0.4, religious_right: 1.0, america_first_conservative: 0.8, populist_right: 0.6
        }
    },
    populist_right: {
        id: 'populist_right',
        name: 'The Populist Right',
        emblem: 'assets/factions/faction_populist_right.svg',
        color: '#d35400',
        party: 'R',
        coreGroups: ['maga', 'bluecollar', 'noncollege', 'rural'],
        baseTurnoutBonus: 0.12,
        description: 'Populist and economic nationalist base. Focuses on working class appeal.',
        synergy: {
            populist_right: 1.0, america_first_conservative: 0.8, religious_right: 0.6, compassionate_conservative: 0.2
        }
    },
    america_first_conservative: {
        id: 'america_first_conservative',
        name: 'America First Conservative',
        emblem: 'assets/factions/faction_america_first_conservative.svg',
        color: '#E81B23',
        party: 'R',
        coreGroups: ['maga', 'rural', 'evangelical'],
        baseTurnoutBonus: 0.15,
        description: 'Populist, nationalist base. Highly motivated but alienates moderates.',
        synergy: {
            america_first_conservative: 1.0, populist_right: 0.8, religious_right: 0.8, compassionate_conservative: 0.2, unaligned_center: -0.6
        }
    }
};

/**
 * Calculates compatibility between a candidate's faction and a target interest group.
 * @param {string} factionId - The candidate's faction ID.
 * @param {string} groupId - The target interest group ID.
 * @returns {number} A multiplier (e.g. 1.3 for highly compatible, 0.5 for incompatible).
 */
function getFactionCompatibility(factionId, groupId) {
    if (!factionId || !FACTIONS[factionId]) return 1.0;
    const faction = FACTIONS[factionId];
    
    // Core groups get a strong boost
    if (faction.coreGroups.indexOf(groupId) !== -1) {
        return 1.3;
    }
    
    // Opposing logic (hardcoded based on spec)
    if ((factionId === 'america_first_conservative' || factionId === 'populist_right') && (groupId === 'urban' || groupId === 'progressives')) return 0.4;
    if ((factionId === 'activist_left' || factionId === 'outsider_leftist') && (groupId === 'rural' || groupId === 'evangelical')) return 0.4;
    if (factionId === 'unaligned_center' && (groupId === 'maga' || groupId === 'progressives')) return 0.5;
    if (factionId === 'mainstream_liberal' && groupId === 'progressives') return 0.9;
    if (factionId === 'compassionate_conservative' && groupId === 'maga') return 0.8;
    
    return 1.0;
}

/**
 * Calculates synergy modifier between Candidate Faction and VP Faction.
 */
function getVPSynergyModifier(candidateFactionId, vpFactionId) {
    if (!candidateFactionId || !vpFactionId || !FACTIONS[candidateFactionId]) return 0;
    const synergyMap = FACTIONS[candidateFactionId].synergy;
    if (synergyMap && synergyMap[vpFactionId] !== undefined) {
        return synergyMap[vpFactionId];
    }
    return 0;
}
