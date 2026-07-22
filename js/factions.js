/* ============================================
   DECISION 2028 - FACTION SYSTEM
   ============================================ */

const FACTIONS = {
    outsider_leftist: {
        id: 'outsider_leftist',
        name: 'Outsider Leftist',
        emblem: 'images/factions/outsideleft.svg',
        color: '#27ae60',
        party: 'G',
        coreGroups: ['progressives', 'youth', 'secular'],
        baseTurnoutBonus: 0.10,
        description: 'Eco-socialist, anti-capitalist, and fiercely independent. This wing of the left focuses heavily on bold environmental action and structural dismantling of corporate power, standing firmly outside the traditional establishment.',
        synergy: {
            outsider_leftist: 1.0, activist_left: 0.5, mainstream_liberal: -0.5
        }
    },
    activist_left: {
        id: 'activist_left',
        name: 'The Activist Left',
        emblem: 'images/factions/activistleft.svg',
        color: '#8e44ad',
        party: 'D',
        coreGroups: ['progressives', 'youth', 'lgbtq_community'],
        baseTurnoutBonus: 0.15,
        description: 'A highly ideological, aggressive, and vocal base. They demand uncompromising, bold action on climate change, systemic inequalities, and social justice issues, pushing the boundaries of the mainstream platform.',
        synergy: {
            activist_left: 1.0, outsider_leftist: 0.5, mainstream_liberal: 0.8, pragmatic_moderate: -0.2
        }
    },
    mainstream_liberal: {
        id: 'mainstream_liberal',
        name: 'Mainstream Liberal',
        emblem: 'images/factions/mainstreamliberal.svg',
        color: '#2980b9',
        party: 'D',
        coreGroups: ['progressives', 'urban', 'union'],
        baseTurnoutBonus: 0.10,
        description: 'The sturdy backbone of the traditional Democratic establishment. They focus on structural economic reform, protecting institutional safety nets like healthcare, and empowering labor unions through steady progress.',
        synergy: {
            activist_left: 0.8, mainstream_liberal: 1.0, pragmatic_moderate: 0.6, unaligned_center: 0.2
        }
    },
    pragmatic_moderate: {
        id: 'pragmatic_moderate',
        name: 'Pragmatic Moderate',
        emblem: 'images/factions/pragmatic moderate.svg',
        color: '#00AEF3',
        party: 'D',
        coreGroups: ['black', 'women', 'college', 'whitecollar'],
        baseTurnoutBonus: 0.05,
        description: 'The institutionalist and pragmatic wing that prioritizes stability, broad electability, and bipartisan appeal. They act as a steadying force against radical changes and focus on winning the crucial middle.',
        synergy: {
            mainstream_liberal: 0.6, pragmatic_moderate: 1.0, unaligned_center: 0.6, activist_left: -0.3
        }
    },
    unaligned_center: {
        id: 'unaligned_center',
        name: 'Unaligned Center',
        emblem: 'images/factions/unalignedcenter.svg',
        color: '#95a5a6',
        party: 'I',
        coreGroups: ['suburban', 'suburban_women', 'centrists'],
        baseTurnoutBonus: 0.05,
        description: 'The ultimate swing constituency that floats between the two major parties. They are highly sensitive to extreme rhetoric and deeply value pragmatic, sensible governance over ideological crusades.',
        synergy: {
            pragmatic_moderate: 0.6, compassionate_conservative: 0.6, america_first_conservative: -0.6, activist_left: -0.6
        }
    },
    compassionate_conservative: {
        id: 'compassionate_conservative',
        name: '‘Compassionate’ Conservative',
        emblem: 'images/factions/compassionateconservative.svg',
        color: '#c0392b',
        party: 'R',
        coreGroups: ['whitecollar', 'smallbusiness', 'seniors'],
        baseTurnoutBonus: 0.05,
        description: 'The traditional conservative wing focused on free-market principles, tax cuts, deregulation, and steady leadership. They prioritize institutional stability and strong national defense while projecting a softer, more inclusive edge.',
        synergy: {
            unaligned_center: 0.6, compassionate_conservative: 1.0, america_first_conservative: 0.2, religious_right: 0.4
        }
    },
    religious_right: {
        id: 'religious_right',
        name: 'The Religious Right',
        emblem: 'images/factions/religiousright.svg',
        color: '#7f8c8d',
        party: 'R',
        coreGroups: ['evangelical', 'rural', 'maga'],
        baseTurnoutBonus: 0.10,
        description: 'A deeply ideological conservative base grounded in traditional moral values and faith. They focus intensely on cultural and social issues, fighting vigorously to defend traditional family structures and institutions.',
        synergy: {
            compassionate_conservative: 0.4, religious_right: 1.0, america_first_conservative: 0.8, populist_right: 0.6
        }
    },
    populist_right: {
        id: 'populist_right',
        name: 'The Populist Right',
        emblem: 'images/factions/populistright.svg',
        color: '#d35400',
        party: 'R',
        coreGroups: ['maga', 'bluecollar', 'noncollege', 'rural'],
        baseTurnoutBonus: 0.12,
        description: 'An economic nationalist base that strongly appeals to the working class and rural communities. They prioritize bringing manufacturing back to the homeland and fiercely oppose the political establishment.',
        synergy: {
            populist_right: 1.0, america_first_conservative: 0.8, religious_right: 0.6, compassionate_conservative: 0.2
        }
    },
    america_first_conservative: {
        id: 'america_first_conservative',
        name: 'America First Conservative',
        emblem: 'images/factions/americafirstconservative.svg',
        color: '#E81B23',
        party: 'R',
        coreGroups: ['maga', 'rural', 'evangelical'],
        baseTurnoutBonus: 0.15,
        description: 'An aggressive, highly motivated nationalist and populist movement. They act as a fierce disruptive force against institutional norms, prioritizing American sovereignty and uncompromising homeland defense.',
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
