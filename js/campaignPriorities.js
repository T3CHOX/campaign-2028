/* Campaign priorities shared by the weekly campaign, ads, turnout, and AI. */
(function (root) {
    'use strict';

    function activeCandidateForParty(party) {
        if (typeof gameData === 'undefined') return null;
        if (party === gameData.selectedParty) return gameData.candidate;
        if (party === 'D') return gameData.demTicket && gameData.demTicket.pres;
        if (party === 'R') return gameData.repTicket && gameData.repTicket.pres;
        return gameData.thirdTickets && gameData.thirdTickets[party] && gameData.thirdTickets[party].pres;
    }

    var CampaignPriorities = {
        LIMIT: 5,
        ensure: function (candidate) {
            if (!candidate || !candidate.id) return [];
            gameData.campaignPriorities = gameData.campaignPriorities || {};
            var list = Array.isArray(gameData.campaignPriorities[candidate.id]) ? gameData.campaignPriorities[candidate.id] : [];
            var valid = typeof CORE_ISSUES === 'undefined' ? list : list.filter(function (id) {
                return CORE_ISSUES.some(function (issue) { return issue.id === id; });
            });
            gameData.campaignPriorities[candidate.id] = valid.slice(0, this.LIMIT);
            return gameData.campaignPriorities[candidate.id];
        },
        forCandidate: function (candidate) { return this.ensure(candidate); },
        forParty: function (party) { return this.ensure(activeCandidateForParty(party)); },
        has: function (candidate, issueId) { return this.forCandidate(candidate).indexOf(issueId) !== -1; },
        toggle: function (issueId) {
            var candidate = gameData.candidate;
            if (!candidate || !issueId) return false;
            var list = this.ensure(candidate), index = list.indexOf(issueId);
            if (index !== -1) list.splice(index, 1);
            else {
                if (list.length >= this.LIMIT) {
                    if (typeof Utils !== 'undefined' && Utils.showToast) Utils.showToast('Choose up to five campaign priorities.');
                    return false;
                }
                list.push(issueId);
            }
            if (typeof Campaign !== 'undefined' && Campaign.saveState) Campaign.saveState();
            if (typeof app !== 'undefined' && app.renderIssuesPanel) app.renderIssuesPanel();
            if (typeof OverhaulUI !== 'undefined' && OverhaulUI.refresh) OverhaulUI.refresh();
            return true;
        },
        chooseForParty: function (party) {
            var candidate = activeCandidateForParty(party);
            if (!candidate) return [];
            var existing = this.ensure(candidate);
            if (existing.length >= this.LIMIT) return existing;
            var groups = typeof INTEREST_GROUPS !== 'undefined' ? INTEREST_GROUPS : {};
            var faction = candidate.factionId && typeof FACTIONS !== 'undefined' ? FACTIONS[candidate.factionId] : null;
            var coreGroups = faction && faction.coreGroups ? faction.coreGroups : [];
            var issueCounts = {};
            Object.keys(groups).forEach(function (groupId) {
                var group = groups[groupId];
                if (group.internalOnly) return;
                var weight = coreGroups.indexOf(groupId) !== -1 ? 2 : 1;
                (group.priorities || []).forEach(function (issueId, rank) {
                    issueCounts[issueId] = (issueCounts[issueId] || 0) + weight * (3 - Math.min(rank, 2));
                });
            });
            var candidates = (typeof CORE_ISSUES === 'undefined' ? [] : CORE_ISSUES.slice()).sort(function (a, b) {
                return (issueCounts[b.id] || 0) - (issueCounts[a.id] || 0);
            });
            for (var i = 0; i < candidates.length && existing.length < this.LIMIT; i++) {
                if (existing.indexOf(candidates[i].id) === -1) existing.push(candidates[i].id);
            }
            gameData.campaignPriorities[candidate.id] = existing.slice(0, this.LIMIT);
            return gameData.campaignPriorities[candidate.id];
        },
        multiplier: function (candidateOrParty, issueId) {
            var candidate = typeof candidateOrParty === 'string' ? activeCandidateForParty(candidateOrParty) : candidateOrParty;
            return this.has(candidate, issueId) ? 1.22 : 1;
        },
        issueLabel: function (issueId) {
            var issue = typeof CORE_ISSUES !== 'undefined' && CORE_ISSUES.find(function (item) { return item.id === issueId; });
            return issue ? issue.name : issueId;
        }
    };

    root.CampaignPriorities = CampaignPriorities;
    root.getCandidatePriorityMultiplier = function (candidateOrParty, issueId) { return CampaignPriorities.multiplier(candidateOrParty, issueId); };
    root.getCandidateForParty = activeCandidateForParty;
    if (typeof app !== 'undefined') app.toggleCampaignPriority = function (issueId) { return CampaignPriorities.toggle(issueId); };
})(window);
