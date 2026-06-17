/* ============================================
   DECISION 2028 - DEBATE MECHANICS (v2)
   ============================================ */

var Debates = {
    SCHEDULE: [
        { week: 3, type: 'presidential', label: 'Presidential Debate #1' },
        { week: 7, type: 'vp', label: 'Vice Presidential Debate' },
        { week: 11, type: 'presidential', label: 'Presidential Debate #2' },
        { week: 15, type: 'presidential', label: 'Presidential Debate #3' }
    ],

    debatesHeld: [],

    getCurrentWeekNumber: function() {
        var start = new Date('2028-07-04');
        var diff = gameData.currentDate.getTime() - start.getTime();
        return Math.floor(diff / (7 * 24 * 60 * 60 * 1000));
    },

    checkDebateWeek: function() {
        var weekNum = this.getCurrentWeekNumber();

        for (var i = 0; i < this.SCHEDULE.length; i++) {
            var debate = this.SCHEDULE[i];
            if (debate.week === weekNum && this.debatesHeld.indexOf(debate.week) === -1) {
                this.debatesHeld.push(debate.week);

                Utils.addLog('🎤 ' + debate.label + ' is happening this week!');
                Utils.showToast('🎤 ' + debate.label + '!');

                if (debate.type === 'presidential') {
                    this.resolvePresidentialDebate(debate);
                } else if (debate.type === 'vp') {
                    this.resolveVPDebate(debate);
                }
                return;
            }
        }
    },

    resolvePresidentialDebate: function(debateInfo) {
        var playerScore = this.calculateDebateScore(gameData.candidate, true, false);

        // Calculate opponent scores
        var opponents = [];
        if (gameData.selectedParty !== 'D' && gameData.demTicket && gameData.demTicket.pres) {
            opponents.push({ cand: gameData.demTicket.pres, party: 'D', ticket: gameData.demTicket });
        }
        if (gameData.selectedParty !== 'R' && gameData.repTicket && gameData.repTicket.pres) {
            opponents.push({ cand: gameData.repTicket.pres, party: 'R', ticket: gameData.repTicket });
        }

        // Check third-party qualification (need >= 15% national polling)
        if (Utils.isThirdParty(gameData.selectedParty)) {
            var tpPoll = this.getThirdPartyNationalPoll(gameData.selectedParty);
            if (tpPoll < 15) {
                Utils.addLog('❌ ' + gameData.candidate.name + ' did not qualify for the debate (need 15% national polling, have ' + tpPoll.toFixed(1) + '%)');
                Utils.showToast('Did not qualify for debate');
                return;
            }
        }

        var bestOpponentScore = -Infinity;
        var bestOpponent = null;
        for (var i = 0; i < opponents.length; i++) {
            var oppScore = this.calculateDebateScore(opponents[i].cand, false, false, opponents[i].ticket);
            if (oppScore > bestOpponentScore) {
                bestOpponentScore = oppScore;
                bestOpponent = opponents[i];
            }
        }

        if (!bestOpponent) return;

        var outcome = this.getDebateOutcome(playerScore, bestOpponentScore);
        var debateIssues = this._pickDebateIssues(3);

        Utils.addLog('🎤 ' + debateInfo.label + ' Result: ' + this.getDebateResultDescription(outcome));
        Utils.addLog('   Topics: ' + debateIssues.map(function(i) { return i.name; }).join(', '));
        Utils.addLog('   Score: ' + playerScore.toFixed(1) + ' vs ' + bestOpponentScore.toFixed(1));

        this.applyDebateEffects(outcome, 'presidential', debateIssues);

        // Consume debate prep buff
        gameData.debatePrepBuff = false;

        // Clear AI debate prep
        for (var party in gameData.thirdTickets) {
            var t = gameData.thirdTickets[party];
            if (t) { t._aiDebatePrepped = false; t._aiDebateSkillBuff = 0; }
        }
        if (gameData.demTicket) { gameData.demTicket._aiDebatePrepped = false; gameData.demTicket._aiDebateSkillBuff = 0; }
        if (gameData.repTicket) { gameData.repTicket._aiDebatePrepped = false; gameData.repTicket._aiDebateSkillBuff = 0; }
    },

    resolveVPDebate: function(debateInfo) {
        if (!gameData.vp) return;

        var playerVPScore = this.calculateDebateScore(gameData.vp, true, true);

        // Find opponent VP
        var opponentVP = null;
        var opponentTicket = null;
        if (gameData.selectedParty !== 'D' && gameData.demTicket && gameData.demTicket.vp) {
            opponentVP = gameData.demTicket.vp;
            opponentTicket = gameData.demTicket;
        } else if (gameData.selectedParty !== 'R' && gameData.repTicket && gameData.repTicket.vp) {
            opponentVP = gameData.repTicket.vp;
            opponentTicket = gameData.repTicket;
        }

        if (!opponentVP) return;

        var opponentVPScore = this.calculateDebateScore(opponentVP, false, true, opponentTicket);
        var outcome = this.getDebateOutcome(playerVPScore, opponentVPScore);
        var debateIssues = this._pickDebateIssues(3);

        Utils.addLog('🎤 ' + debateInfo.label + ' Result: ' + this.getDebateResultDescription(outcome));
        Utils.addLog('   ' + gameData.vp.name + ': ' + playerVPScore.toFixed(1) + ' vs ' + opponentVP.name + ': ' + opponentVPScore.toFixed(1));

        // VP debate has reduced effects — only affects VP regions
        this.applyDebateEffects(outcome, 'vp', debateIssues);
    },

    calculateDebateScore: function(candidate, isPlayer, isVP, ticket) {
        if (!candidate) return 0;

        var skill = candidate.debateSkill || 5;

        // AI debate prep bonus
        if (!isPlayer && ticket && ticket._aiDebateSkillBuff) {
            skill = Math.min(10, skill + ticket._aiDebateSkillBuff);
        }

        // Player debate prep bonus
        var prepBonus = 1.0;
        if (isPlayer && gameData.debatePrepBuff) {
            prepBonus = 1.15;
            skill = Math.min(10, skill + 1);
        }

        // VP synergy: if VP has higher debate skill, ticket gets +1
        if (!isVP && isPlayer && gameData.vp && gameData.vp.debateSkill > candidate.debateSkill) {
            skill = Math.min(10, skill + 1);
        }

        var score = skill * prepBonus;

        // Favorability modifier
        if (isPlayer) {
            score += (Campaign.getFavorability() - 0.5) * 3.0;
        } else {
            score += 0; // Opponent favorability neutral at 0.5
        }

        // Issue position score — 3 random issues
        var issues = this._pickDebateIssues(3);
        var positionScore = 0;
        var candidatePositions = CANDIDATE_POSITIONS[candidate.id] || {};
        for (var i = 0; i < issues.length; i++) {
            var pos = candidatePositions[issues[i].id] || 0;
            positionScore += Math.abs(pos) * 0.3; // Strength of position matters
        }
        score += positionScore;

        // Random variance (debate performance uncertainty)
        score += (Math.random() - 0.5) * 2;

        return score;
    },

    getDebateOutcome: function(playerScore, opponentScore) {
        var advantage = playerScore - opponentScore;

        if (advantage > 4) return 'win';
        if (advantage > 1) return 'narrow_win';
        if (advantage >= -1) return 'draw';
        if (advantage >= -4) return 'narrow_loss';
        return 'loss';
    },

    applyDebateEffects: function(outcome, debateType, debateIssues) {
        var effects = {
            win:         { playerFav: 0.04, oppFav: -0.02, momentum: 0.12, countyShift: 0.003 },
            narrow_win:  { playerFav: 0.02, oppFav: 0,     momentum: 0.06, countyShift: 0.0015 },
            draw:        { playerFav: 0,    oppFav: 0,     momentum: 0,    countyShift: 0 },
            narrow_loss: { playerFav: -0.02, oppFav: 0,    momentum: -0.06, countyShift: -0.0015 },
            loss:        { playerFav: -0.04, oppFav: 0.02, momentum: -0.12, countyShift: -0.003 }
        };

        var e = effects[outcome] || effects.draw;
        var scale = debateType === 'vp' ? 0.5 : 1.0; // VP debate has half effect

        if (e.playerFav !== 0) {
            Campaign.adjustFavorability(e.playerFav * scale, 'Debate performance: ' + this.getDebateResultDescription(outcome));
        }

        gameData.campaignMomentum = Math.max(-1, Math.min(1,
            gameData.campaignMomentum + e.momentum * scale));

        // County-level effects
        if (e.countyShift !== 0) {
            this.applyCountyDebateEffects(e.countyShift * scale, debateIssues, debateType);
        }
    },

    applyCountyDebateEffects: function(shiftPct, debateIssues, debateType) {
        if (typeof Counties === 'undefined' || !Counties.countyData) return;

        var playerParty = gameData.selectedParty;
        var vpHomeState = gameData.vp ? gameData.vp.homeState : null;
        var vpSpillover = gameData.vp ? (gameData.vp.regionalSpillover || []) : [];

        for (var fips in Counties.countyData) {
            var county = Counties.countyData[fips];
            if (!county || !county.v) continue;

            var localShift = shiftPct;

            // VP debate only affects VP regions
            if (debateType === 'vp') {
                var paddedFips = fips.padStart(5, '0');
                var stateFips = paddedFips.substring(0, 2);
                var inVPRegion = false;

                if (vpHomeState) {
                    var vpStateFips = STATES[vpHomeState] ? STATES[vpHomeState].fips : null;
                    if (stateFips === vpStateFips) inVPRegion = true;
                }
                for (var si = 0; si < vpSpillover.length; si++) {
                    var spillFips = STATES[vpSpillover[si]] ? STATES[vpSpillover[si]].fips : null;
                    if (stateFips === spillFips) inVPRegion = true;
                }
                if (!inVPRegion) continue;
            }

            // 2x multiplier in states where debate issues have high importance
            // (simplified: check if state has high interest group alignment)

            if (playerParty === 'D') {
                county.v.D = Math.min(100, Math.max(0, county.v.D + localShift));
                county.v.R = Math.min(100, Math.max(0, county.v.R - localShift));
            } else if (playerParty === 'R') {
                county.v.R = Math.min(100, Math.max(0, county.v.R + localShift));
                county.v.D = Math.min(100, Math.max(0, county.v.D - localShift));
            } else {
                var thirdShift = localShift * 0.55;
                if (county.v[playerParty] !== undefined) {
                    county.v[playerParty] = Math.min(35, Math.max(0, county.v[playerParty] + thirdShift));
                }
            }
        }

        // Update state margins
        for (var code in gameData.states) {
            Counties.updateStateFromCounties(code);
        }
    },

    getThirdPartyNationalPoll: function(party) {
        if (typeof Counties === 'undefined' || !Counties.countyData) return 0;
        var totalPop = 0;
        var totalVoteShare = 0;
        for (var fips in Counties.countyData) {
            var county = Counties.countyData[fips];
            if (!county || !county.v || county.v[party] === undefined) continue;
            var pop = county.p || 0;
            totalPop += pop;
            totalVoteShare += pop * county.v[party];
        }
        return totalPop > 0 ? totalVoteShare / totalPop : 0;
    },

    getDebateResultDescription: function(outcome) {
        var descriptions = {
            win: '🏆 Decisive Victory',
            narrow_win: '📈 Narrow Win',
            draw: '🤝 Draw',
            narrow_loss: '📉 Narrow Loss',
            loss: '❌ Decisive Defeat'
        };
        return descriptions[outcome] || 'Unknown';
    },

    _pickDebateIssues: function(count) {
        var issueSource = (typeof CORE_ISSUES !== 'undefined') ? CORE_ISSUES : ISSUES;
        var shuffled = Utils.shuffleArray(issueSource.slice());
        return shuffled.slice(0, count);
    }
};
