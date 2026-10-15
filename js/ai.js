/* ============================================
   DECISION 2028 - OPPONENT AI SYSTEM
   ============================================ */

var AI_PERSONALITIES = {
    aggressive: {
        swingWeight: 0.50,
        defendWeight: 0.18,
        expandWeight: 0.17,
        fundraiseWeight: 0.15,
        rallyBias: 0.65,
        countyRallyBias: 0.60,
        mistakeChance: 0.10,
        vpPressureChance: 0.25
    },
    defensive: {
        swingWeight: 0.38,
        defendWeight: 0.35,
        expandWeight: 0.12,
        fundraiseWeight: 0.15,
        rallyBias: 0.45,
        countyRallyBias: 0.35,
        mistakeChance: 0.06,
        vpPressureChance: 0.20
    },
    expansion: {
        swingWeight: 0.32,
        defendWeight: 0.13,
        expandWeight: 0.40,
        fundraiseWeight: 0.15,
        rallyBias: 0.55,
        countyRallyBias: 0.70,
        mistakeChance: 0.12,
        vpPressureChance: 0.22
    },
    balanced: {
        swingWeight: 0.42,
        defendWeight: 0.22,
        expandWeight: 0.21,
        fundraiseWeight: 0.15,
        rallyBias: 0.55,
        countyRallyBias: 0.45,
        mistakeChance: 0.08,
        vpPressureChance: 0.20
    }
};

var AI_CANDIDATE_PERSONALITIES = {
    harris: 'defensive',
    newsom: 'aggressive',
    whitmer: 'defensive',
    buttigieg: 'balanced',
    aoc: 'aggressive',
    trump: 'aggressive',
    vance: 'aggressive',
    desantis: 'aggressive',
    haley: 'defensive',
    paul: 'expansion',
    stein: 'expansion',
    oliver: 'expansion',
    massie: 'expansion',
    kennedy_rfk: 'expansion'
};

var OpponentAI = {
    STRATEGY_DEFEND: 'defend',
    STRATEGY_SWING: 'swing',
    STRATEGY_EXPAND: 'expand',
    STRATEGY_FUNDRAISE: 'fundraise',

    getTicket: function(party) {
        if (party === 'D') return gameData.demTicket;
        if (party === 'R') return gameData.repTicket;
        if (gameData.thirdTickets && gameData.thirdTickets[party]) return gameData.thirdTickets[party];
        return null;
    },

    getPersonality: function(party) {
        var ticket = this.getTicket(party);
        var candidateId = ticket && ticket.pres ? ticket.pres.id : null;
        var personalityKey = AI_CANDIDATE_PERSONALITIES[candidateId] || 'balanced';
        return AI_PERSONALITIES[personalityKey] || AI_PERSONALITIES.balanced;
    },

    determineStrategy: function(party, personality) {
        if (Utils.isThirdParty(party)) {
            return this.STRATEGY_EXPAND;
        }

        var weights = {
            swing: personality.swingWeight,
            defend: personality.defendWeight,
            expand: personality.expandWeight,
            fundraise: personality.fundraiseWeight
        };

        if (gameData.funds < 15) {
            weights.fundraise += 0.1;
        }
        if (gameData.playerPressure && Object.keys(gameData.playerPressure).length) {
            weights.swing += 0.1;
        }

        var roll = Math.random();
        var total = weights.swing + weights.defend + weights.expand + weights.fundraise;
        var swingCut = weights.swing / total;
        var defendCut = swingCut + (weights.defend / total);
        var expandCut = defendCut + (weights.expand / total);

        if (roll < swingCut) return this.STRATEGY_SWING;
        if (roll < defendCut) return this.STRATEGY_DEFEND;
        if (roll < expandCut) return this.STRATEGY_EXPAND;
        return this.STRATEGY_FUNDRAISE;
    },

    prepareBackgroundTurn: function() {
        if (typeof gameData === 'undefined' || !gameData.selectedParty) return;
        setTimeout(function() {
            try {
                if (typeof gameData === 'undefined' || !gameData.selectedParty) return;
                gameData.precomputedOpponentPlans = {};
                var parties = [];
                if (gameData.selectedParty === 'D' && gameData.repTicket && gameData.repTicket.pres) {
                    parties.push('R');
                } else if (gameData.selectedParty === 'R' && gameData.demTicket && gameData.demTicket.pres) {
                    parties.push('D');
                } else if (typeof Utils !== 'undefined' && Utils.isThirdParty(gameData.selectedParty)) {
                    if (gameData.demTicket && gameData.demTicket.pres) parties.push('D');
                    if (gameData.repTicket && gameData.repTicket.pres) parties.push('R');
                }
                parties.forEach(function(p) {
                    var t = OpponentAI.getTicket(p);
                    if (t && t.pres) {
                        gameData.precomputedOpponentPlans[p] = OpponentAI.planTurnActions(p, t.pres.stamina || 8);
                    }
                });
            } catch (e) {
                console.warn('Background opponent AI planning notice:', e);
            }
        }, 40);
    },

    planTurnActions: function(opponentParty, stamina) {
        var ticket = this.getTicket(opponentParty);
        if (!ticket || !ticket.pres) return [];
        var actions = [];
        var energy = Math.max(2, Math.min(6, Math.floor((stamina || 7) * 0.7)));
        var week = gameData.currentWeek || 0;
        if (typeof DEBATE_SCHEDULE !== 'undefined' && DEBATE_SCHEDULE.some(function(d){ return d.week === week + 1; }) && energy >= 1 && !ticket._aiDebatePrepped) {
            energy--; actions.push({ type: 'debate_prep' });
        }
        var simFunds = Number(ticket.pres.funds) || 0;
        for (var i = 0; i < 4 && energy > 0; i++) {
            var state = this.pickStrategicState(opponentParty, i);
            var actionType = 'fundraise';
            var county = null;
            if (simFunds < 3 || (simFunds < 8 && i === 0)) {
                actionType = 'fundraise'; simFunds += 3.5; energy--;
            } else if (energy >= 1 && i < 2 && Math.random() < 0.18) {
                actionType = 'meet_endorser'; energy--;
            } else if (energy >= 1 && i > 0 && Math.random() < 0.18) {
                actionType = 'surrogate'; energy--;
            } else if (simFunds >= 3 && (i === 0 || Math.random() < 0.5)) {
                actionType = Math.random() < 0.5 ? 'attack_ad' : 'positive_ad'; simFunds -= 2.5; energy--;
            } else if (simFunds >= 1 && energy >= 2) {
                county = this.pickPriorityCounty(state, opponentParty);
                if (county) { actionType = 'county_rally'; simFunds -= 1; energy -= 2; }
            } else {
                actionType = 'fundraise'; simFunds += 3; energy--;
            }
            actions.push({ type: actionType, state: state, county: county });
        }
        return actions;
    },

    executeTurn: function(opponentParty, stamina) {
        var ticket=this.getTicket(opponentParty);
        if (!ticket || !ticket.pres) return [];
        var personality=this.getPersonality(opponentParty), actions=[];
        var energy=Math.max(2,Math.min(6,Math.floor((stamina||7)*0.7)));
        var week=gameData.currentWeek||0;
        if (typeof DEBATE_SCHEDULE!=='undefined' && DEBATE_SCHEDULE.some(function(d){return d.week===week+1;}) && energy>=1 && !ticket._aiDebatePrepped) {
            ticket._aiDebatePrepped=true;ticket._aiDebateSkillBuff=1;energy--;
            actions.push({type:'debate_prep'});
        }
        if (Math.random()<personality.vpPressureChance) this.applyVpPressure(opponentParty);
        
        // Execute precomputed plan if available from background preparation
        var precomputed = (gameData.precomputedOpponentPlans && gameData.precomputedOpponentPlans[opponentParty]) ? gameData.precomputedOpponentPlans[opponentParty] : null;
        if (precomputed && precomputed.length > 0) {
            delete gameData.precomputedOpponentPlans[opponentParty];
            for (var pIdx = 0; pIdx < precomputed.length; pIdx++) {
                var pAction = precomputed[pIdx];
                if (pAction.type === 'debate_prep') continue;
                var st = pAction.state;
                if (!gameData.states[st]) continue;
                if (pAction.type === 'county_rally' && pAction.county) {
                    Counties.applyOpponentRallySpillover(pAction.county, opponentParty);
                    Favorability.change(ticket.pres.id, 0.7, { countyIds: [pAction.county], recognition: 0.35 });
                    Counties.updateStateFromCounties(st);
                } else if (pAction.type === 'attack_ad' || pAction.type === 'positive_ad') {
                    this.buyStrategicAd(opponentParty, st, pAction.type === 'attack_ad' ? 'attack' : 'positive', gameData.candidate && gameData.candidate.id);
                } else if (pAction.type === 'meet_endorser') {
                    this.meetStrategicEndorser(opponentParty);
                } else if (pAction.type === 'surrogate') {
                    this.useStrategicSurrogate(opponentParty, st);
                } else {
                    ticket.pres.funds = (Number(ticket.pres.funds) || 0) + 3.5;
                }
                actions.push(pAction);
                Utils.addLog('OPPONENT UPDATE: ' + ticket.pres.name + ' ' + pAction.type.replace(/_/g, ' ') + ' in ' + gameData.states[st].name + '.');
            }
            return actions;
        }

        for (var i=0;i<4 && energy>0;i++) {
            var state=this.pickStrategicState(opponentParty,i), funds=Number(ticket.pres.funds)||0;
            var ownOpinion=Favorability.area(ticket.pres.id);
            var opponent=gameData.candidate;
            var enemyOpinion=opponent ? Favorability.area(opponent.id) : {net:0};
            var action=null;
            if (funds<3 || (funds<8 && i===0)) {
                ticket.pres.funds=funds+3.5+(gameData.states[state].ev||0)*0.02;
                energy--;action={type:'fundraise',state:state};
            } else if (energy>=1 && i<2 && Math.random()<0.18 && this.meetStrategicEndorser(opponentParty)) {
                energy--;action={type:'meet_endorser',state:state};
            } else if (energy>=1 && i>0 && Math.random()<0.18 && this.useStrategicSurrogate(opponentParty,state)) {
                energy--;action={type:'surrogate',state:state};
            } else if (funds>=3 && (i===0 || Math.random()<(ownOpinion.net < -8 ? 0.7 : 0.4))) {
                var type=enemyOpinion.net>ownOpinion.net+4 && opponent && Math.random()<0.5 ? 'attack' : 'positive';
                if (this.buyStrategicAd(opponentParty,state,type,opponent && opponent.id)) {energy--;action={type:type+'_ad',state:state};}
            }
            if (!action && funds>=2 && energy>=1 && Math.random()<0.35 && this.runStrategicDigital(opponentParty,state)) {
                energy--;action={type:'digital',state:state};
            }
            if (!action && funds>=2 && energy>=1 && opponent && Math.random()<0.10) {
                ticket.pres.funds-=2;energy--;
                if(Math.random()>Number(opponent.scandalResistance||0.3)) Favorability.change(opponent.id,-0.8,{recognition:0.3});
                action={type:'oppo_research',state:state};
            }
            if (!action && funds>=0.5 && energy>=1 && Math.random()<0.4 && this.runStrategicSpeech(opponentParty,state)) {
                ticket.pres.funds-=0.5;energy--;
                action={type:'issue_speech',state:state};
            }
            if (!action && funds>=1 && energy>=2) {
                var county=this.pickPriorityCounty(state,opponentParty);
                if (county && Counties.applyOpponentRallySpillover(county,opponentParty)) {
                    ticket.pres.funds-=1;energy-=2;
                    Favorability.change(ticket.pres.id,0.7,{countyIds:[county],recognition:0.35});
                    Counties.updateStateFromCounties(state);
                    action={type:'county_rally',state:state,county:county};
                }
            }
            if (!action && funds>=1.8 && energy>=1 && gameData.groundOps) {
                ticket.pres.funds-=1.8;energy--;
                this.runStrategicField(opponentParty,state);
                action={type:'ground_op',state:state};
            }
            if (!action) {
                ticket.pres.funds=funds+3;energy--;
                action={type:'fundraise',state:state};
            }
            actions.push(action);
            Utils.addLog('OPPONENT UPDATE: '+ticket.pres.name+' '+action.type.replace(/_/g,' ')+' in '+gameData.states[state].name+'.');
        }
        return actions;
    },

    pickStrategicState: function(party,slot) {
        var ranked=Object.keys(gameData.states).map(function(code){
            var state=gameData.states[code],poll=Utils.getStatePollingByParty && Utils.getStatePollingByParty(code);
            var margin=poll && Number.isFinite(Number(poll.D)) && Number.isFinite(Number(poll.R)) ? Number(poll.D)-Number(poll.R) : state.margin;
            var own=party==='D'?margin:-margin;
            var pressure=(gameData.playerPressure&&gameData.playerPressure[code])||0;
            var closeness=Math.max(0,1-Math.abs(own)/14);
            var score=(state.ev||1)*(0.2+closeness)*(own<0?1.15:1)+pressure*3;
            return {code:code,score:score};
        }).sort(function(a,b){return b.score-a.score;});
        var band=ranked.slice(0,Math.min(8,ranked.length));
        return band[(slot+Math.floor(Math.random()*Math.min(3,band.length)))%band.length].code;
    },

    buyStrategicAd: function(party,state,type,targetId) {
        if (typeof AdEngine==='undefined' || typeof MEDIA_MARKETS==='undefined') return false;
        var ticket=this.getTicket(party),budget=Number(ticket.pres.funds)||0;
        var markets=Object.keys(MEDIA_MARKETS).map(function(id){return MEDIA_MARKETS[id];}).filter(function(m){return m.states&&m.states.indexOf(state)!==-1;});
        markets.sort(function(a,b){return (b.reach||0)-(a.reach||0);});
        for (var i=0;i<markets.length;i++) {
            var config={channel:'tv',marketId:markets[i].id,type:type,issueId:type==='attack'?'economy':null,targetId:targetId,sponsorId:ticket.pres.id,intensity:1,durationWeeks:1};
            var quote=AdEngine.quote(config);
            if (quote.ok && quote.cost<=budget*0.35 && quote.cost<=budget-2) return AdEngine.buy(config, { batch: true }).ok;
        }
        return false;
    },

    runStrategicDigital: function(party,state) {
        var ticket=this.getTicket(party);
        if (typeof DigitalAds==='undefined' || !ticket || !ticket.pres || ticket.pres.funds<2) return false;
        return DigitalAds.executeDigitalCampaign(state,{totalBudget:2,allocations:{meta:0.5,youtube:0.5},segment:'independents',creative:'positive'},party);
    },

    runStrategicSpeech: function(party,state) {
        var ticket=this.getTicket(party);
        if(!ticket||!ticket.pres||typeof Electorate==='undefined'||!Electorate.expose)return false;
        var issues=typeof CampaignPriorities!=='undefined'&&CampaignPriorities.chooseForParty ? CampaignPriorities.chooseForParty(party) : [];
        var issue=issues && issues.length ? issues[0] : 'economy';
        if(typeof IssueModel!=='undefined'&&!IssueModel.getIssue(issue))issue='economy';
        Electorate.expose({stateCode:state,sponsorId:ticket.pres.id,issueId:issue,type:'issue',exposure:0.6});
        Favorability.change(ticket.pres.id,0.55,{stateCode:state,recognition:0.25});
        return true;
    },

    runStrategicField: function(party,state) {
        var key=party+'_'+state;
        gameData.aiFieldOffices=gameData.aiFieldOffices||{};
        gameData.aiFieldOffices[key]=(gameData.aiFieldOffices[key]||0)+1;
        Object.keys(Counties.countyData).forEach(function(fips){
            var county=Counties.countyData[fips];
            if(county.s!==state)return;
            county.partyMobilization=county.partyMobilization||{};
            county.partyMobilization[party]=Math.min(0.04,(county.partyMobilization[party]||0)+0.002);
        });
        Electorate.invalidate();
    },

    meetStrategicEndorser: function(party) {
        if (typeof Endorsers==='undefined') return false;
        gameData.aiEndorserRelations=gameData.aiEndorserRelations||{};
        gameData.aiSurrogateCredits=gameData.aiSurrogateCredits||{};
        var relations=gameData.aiEndorserRelations[party]||(gameData.aiEndorserRelations[party]={});
        var credits=gameData.aiSurrogateCredits[party]||(gameData.aiSurrogateCredits[party]={});
        var pool=Endorsers.db.national.filter(function(e){return e.type==='individual' && (e.baseLean[party]||0)>35;});
        pool.sort(function(a,b){return (Endorsers.getStars(b)*12+(b.baseLean[party]||0))-(Endorsers.getStars(a)*12+(a.baseLean[party]||0));});
        var chosen=pool.find(function(e){return (credits[e.id]||0)<2 && (relations[e.id]===undefined?Math.min(e.threshold-2,e.baseLean[party]||0):relations[e.id])>=e.threshold;})
            || pool.find(function(e){return (relations[e.id]===undefined?Math.min(e.threshold-2,e.baseLean[party]||0):relations[e.id])<e.threshold;});
        if(!chosen)return false;
        var before=relations[chosen.id]===undefined?Math.min(chosen.threshold-2,chosen.baseLean[party]||0):relations[chosen.id];
        relations[chosen.id]=Math.min(100,before+4+Math.floor(Math.random()*3));
        if(before>=chosen.threshold) credits[chosen.id]=(credits[chosen.id]||0)+(Math.random()<Math.min(0.8,0.15+(before-chosen.threshold)/50)?2:1);
        Utils.addLog('OPPONENT UPDATE: Met with '+chosen.name+(before>=chosen.threshold?' for surrogate rallies.':'.'));
        return true;
    },

    useStrategicSurrogate: function(party,state) {
        var credits=gameData.aiSurrogateCredits&&gameData.aiSurrogateCredits[party];
        if(!credits)return false;
        var id=Object.keys(credits).find(function(key){return credits[key]>0;});
        if(!id)return false;
        var county=this.pickPriorityCounty(state,party);
        if(!county || !Counties.applyOpponentRallySpillover(county,party))return false;
        credits[id]--;
        var ticket=this.getTicket(party);
        Favorability.change(ticket.pres.id,0.4,{countyIds:[county],recognition:0.25});
        Counties.updateStateFromCounties(state);
        return true;
    },

    chooseAction: function(strategy, party, personality, focusState) {
        var targetState = focusState || this.pickStateByStrategy(strategy, party);
        if (strategy === this.STRATEGY_FUNDRAISE) {
            return { type: 'fundraise', state: this.pickFundraisingState(party) };
        }

        var rallyBias = personality.rallyBias || 0.5;
        var r = Math.random();
        var actionType = 'ad';
        if (r < rallyBias * 0.6) actionType = 'rally';
        else if (r < rallyBias * 0.8) actionType = 'ground_op';
        else if (r < rallyBias * 1.0) actionType = 'digital_preset';

        if (typeof Counties !== 'undefined' && Counties.countyData && (actionType === 'rally' || actionType === 'ad')) {
            return {
                type: actionType === 'rally' ? 'county_rally' : 'county_ad',
                state: targetState,
                county: this.pickPriorityCounty(targetState, party)
            };
        }

        return { type: actionType, state: targetState };
    },

    pickStateByStrategy: function(strategy, party) {
        if (strategy === this.STRATEGY_SWING) {
            return this.pickSwingState(party);
        }
        if (strategy === this.STRATEGY_DEFEND) {
            return this.pickDefendState(party);
        }
        if (strategy === this.STRATEGY_EXPAND) {
            return this.pickExpandState(party);
        }
        return this.pickSwingState(party);
    },

    pickReactiveState: function(party) {
        if (!gameData.playerPressure) return null;
        var bestState = null;
        var bestScore = 0;
        for (var stateCode in gameData.playerPressure) {
            var pressure = gameData.playerPressure[stateCode];
            var state = gameData.states[stateCode];
            if (!state) continue;
            var aiMargin = party === 'D' ? state.margin : -state.margin;
            var swingScore = 1 - Math.min(1, Math.abs(aiMargin) / 10);
            var score = pressure * (0.5 + swingScore);
            if (score > bestScore) {
                bestScore = score;
                bestState = stateCode;
            }
        }
        return bestState;
    },

    pickSwingState: function(party) {
        var swingStates = [];
        for (var code in gameData.states) {
            var s = gameData.states[code];
            var aiMargin = party === 'D' ? s.margin : -s.margin;
            if (Math.abs(aiMargin) <= 6) {
                swingStates.push(code);
            }
        }
        if (!swingStates.length) {
            var allCodes = Object.keys(gameData.states);
            return allCodes[Math.floor(Math.random() * allCodes.length)];
        }
        return swingStates[Math.floor(Math.random() * swingStates.length)];
    },

    pickDefendState: function(party) {
        var defendStates = [];
        for (var code in gameData.states) {
            var s = gameData.states[code];
            var aiMargin = party === 'D' ? s.margin : -s.margin;
            if (aiMargin > 0 && aiMargin < 6) {
                defendStates.push(code);
            }
        }
        if (!defendStates.length) return this.pickSwingState(party);
        return defendStates[Math.floor(Math.random() * defendStates.length)];
    },

    pickExpandState: function(party) {
        var expandStates = [];
        for (var code in gameData.states) {
            var s = gameData.states[code];
            var aiMargin = party === 'D' ? s.margin : -s.margin;
            if (aiMargin < 0 && aiMargin > -9) {
                expandStates.push(code);
            }
        }
        if (!expandStates.length) return this.pickSwingState(party);
        return expandStates[Math.floor(Math.random() * expandStates.length)];
    },

    pickHopelessState: function(party) {
        var hopelessStates = [];
        for (var code in gameData.states) {
            var s = gameData.states[code];
            var aiMargin = party === 'D' ? s.margin : -s.margin;
            if (aiMargin < -12) {
                hopelessStates.push(code);
            }
        }
        if (!hopelessStates.length) return this.pickExpandState(party);
        return hopelessStates[Math.floor(Math.random() * hopelessStates.length)];
    },

    pickFundraisingState: function(party) {
        var highValueStates = ['CA', 'NY', 'TX', 'FL', 'IL'];
        return highValueStates[Math.floor(Math.random() * highValueStates.length)];
    },

    pickPriorityCounty: function(stateCode, party) {
        var stateFips = STATES[stateCode] ? STATES[stateCode].fips : null;
        if (!stateFips || !Counties || !Counties.countyData) return null;
        var bestCounty = null;
        var bestScore = -1;

        for (var fips in Counties.countyData) {
            var paddedFips = fips.padStart(5, '0');
            if (paddedFips.substring(0, 2) !== stateFips) continue;
            var county = Counties.countyData[fips];
            if (!county || !county.p) continue;
            var totals = Counties.calculateCountyVoteTotals(county, { reportingFactor: 1, decidedMultiplier: 1, errorFactor: 1 });
            var demVotes = totals.D || 0;
            var repVotes = totals.R || 0;
            var total = demVotes + repVotes;
            if (total <= 0) continue;
            var demPct = (demVotes / total) * 100;
            var repPct = (repVotes / total) * 100;
            var margin = demPct - repPct;
            var aiMargin = party === 'D' ? margin : -margin;
            var swingFactor = 1 - Math.min(1, Math.abs(aiMargin) / 12);
            var score = (county.p || 0) * (0.4 + swingFactor);
            if (score > bestScore) {
                bestScore = score;
                bestCounty = paddedFips;
            }
        }

        return bestCounty;
    },

    applyVpPressure: function(party) {
        var ticket = this.getTicket(party);
        if (!ticket || !ticket.pres || !ticket.vp) return;
        if (!ticket.pres.issuePositions) ticket.pres.issuePositions = {};

        var vpPositions = (typeof CANDIDATE_POSITIONS !== 'undefined') ? CANDIDATE_POSITIONS[ticket.vp.id] : null;
        if (!vpPositions) return;

        var issues = [];
        for (var issueId in vpPositions) {
            var vpPos = vpPositions[issueId];
            var current = ticket.pres.issuePositions[issueId] || 0;
            if (Math.abs(vpPos - current) >= 3) {
                issues.push(issueId);
            }
        }
        if (!issues.length) return;
        var issue = issues[Math.floor(Math.random() * issues.length)];
        var vpTarget = vpPositions[issue] || 0;
        var currentPos = ticket.pres.issuePositions[issue] || 0;
        var shift = vpTarget > currentPos ? 1 : -1;
        ticket.pres.issuePositions[issue] = Math.max(-10, Math.min(10, currentPos + shift));

        if (typeof Utils !== 'undefined') {
            Utils.addLog('OPPONENT UPDATE: ' + ticket.vp.name + ' pressured a shift on ' + issue);
        }
    },

    executeAction: function(action, party) {
        var s = gameData.states[action.state];
        if (!s) return;

        if (action.type === 'county_rally') {
            if (typeof Counties !== 'undefined' && Counties.applyOpponentRallySpillover && action.county) {
                var spill = Counties.applyOpponentRallySpillover(action.county, party);
                if (spill && spill.affectedStates) {
                    for (var stateCode in spill.affectedStates) {
                        Counties.updateStateFromCounties(stateCode);
                    }
                }
            }
            var ticketPres = party === 'D' ? gameData.demTicket.pres : gameData.repTicket.pres;
            if (ticketPres) {
                Utils.addLog('OPPONENT UPDATE: ' + ticketPres.name + ' held a regional rally in ' + s.name);
            }
            return;
        }

        if (action.type === 'county_ad') {
            if (typeof Counties !== 'undefined' && Counties.applyOpponentAdSpillover && action.county) {
                var adSpill = Counties.applyOpponentAdSpillover(action.county, party);
                if (adSpill && adSpill.affectedStates) {
                    for (var adStateCode in adSpill.affectedStates) {
                        Counties.updateStateFromCounties(adStateCode);
                    }
                }
            }
            var adTicketPres = party === 'D' ? gameData.demTicket.pres : gameData.repTicket.pres;
            if (adTicketPres) {
                Utils.addLog('OPPONENT UPDATE: ' + adTicketPres.name + ' ran a targeted media buy in ' + s.name);
            }
            return;
        }

        if (action.type === 'rally') {
            var fallbackCounty = this.pickPriorityCounty(action.state, party);
            if (fallbackCounty && typeof Counties !== 'undefined' && Counties.applyOpponentRallySpillover) {
                var fallbackSpill = Counties.applyOpponentRallySpillover(fallbackCounty, party);
                if (fallbackSpill && fallbackSpill.affectedStates) {
                    for (var fallbackStateCode in fallbackSpill.affectedStates) {
                        Counties.updateStateFromCounties(fallbackStateCode);
                    }
                }
            }
            var rallyPres = party === 'D' ? gameData.demTicket.pres : gameData.repTicket.pres;
            if (rallyPres) {
                Utils.addLog('OPPONENT UPDATE: ' + rallyPres.name + ' held a regional rally in ' + s.name);
            }
            return;
        }

        if (action.type === 'ad') {
            if (typeof MEDIA_MARKETS !== 'undefined' && typeof DigitalAds !== 'undefined') {
                // Find media markets overlapping with target state
                var overlappingMarkets = [];
                for (var mId in MEDIA_MARKETS) {
                    if (MEDIA_MARKETS[mId].states.indexOf(action.state) !== -1) {
                        overlappingMarkets.push(MEDIA_MARKETS[mId]);
                    }
                }
                if (overlappingMarkets.length > 0) {
                    // Pick overlapping market with largest reach
                    overlappingMarkets.sort(function(a, b) { return b.reach - a.reach; });
                    var targetMarket = overlappingMarkets[0];
                    
                    // Call buyTVAd for target market (heavy intensity, 4 weeks)
                    var success = DigitalAds.buyTVAd(targetMarket.id, 'positive', 2, 4, party);
                    if (success) {
                        return;
                    }
                }
            }

            var fallbackAdCounty = this.pickPriorityCounty(action.state, party);
            if (fallbackAdCounty && typeof Counties !== 'undefined' && Counties.applyOpponentAdSpillover) {
                var fallbackAdSpill = Counties.applyOpponentAdSpillover(fallbackAdCounty, party);
                if (fallbackAdSpill && fallbackAdSpill.affectedStates) {
                    for (var fallbackAdStateCode in fallbackAdSpill.affectedStates) {
                        Counties.updateStateFromCounties(fallbackAdStateCode);
                    }
                }
            }
            var adPres = party === 'D' ? gameData.demTicket.pres : gameData.repTicket.pres;
            if (adPres) {
                Utils.addLog('OPPONENT UPDATE: ' + adPres.name + ' ran a targeted media buy in ' + s.name);
            }
            return;
        }

        if (action.type === 'ground_op') {
            if (typeof GroundOps !== 'undefined') {
                GroundOps.openFieldOffice(action.state, party);
            }
            var goPres = party === 'D' ? gameData.demTicket.pres : gameData.repTicket.pres;
            if (goPres) {
                Utils.addLog('OPPONENT UPDATE: ' + goPres.name + ' expanded ground operations in ' + s.name);
            }
            return;
        }
        
        if (action.type === 'digital_preset') {
            if (typeof DigitalAds !== 'undefined') {
                var config = { 
                    totalBudget: 2.0, 
                    allocations: { meta: 0.5, youtube: 0.5 }, 
                    segment: 'independents', 
                    creative: 'persuade' 
                };
                var success = DigitalAds.executeDigitalCampaign(action.state, config, party);
                if (success) {
                    return;
                }
            }
            var digiPres = party === 'D' ? gameData.demTicket.pres : gameData.repTicket.pres;
            if (digiPres) {
                Utils.addLog('OPPONENT UPDATE: ' + digiPres.name + ' launched a digital blitz in ' + s.name);
            }
            return;
        }

        if (action.type === 'fundraise') {
            var fundPres = party === 'D' ? gameData.demTicket.pres : gameData.repTicket.pres;
            if (fundPres) {
                Utils.addLog('OPPONENT UPDATE: ' + fundPres.name + ' fundraised in ' + s.name);
            }
        }
    }
};
