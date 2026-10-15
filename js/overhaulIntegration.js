/* Compatibility boundary for the original campaign UI and new simulation.
   Population, preferences, turnout and polls flow in one direction. */
(function(){
    var legacyRecompute=recomputeInterestGroupSupport;
    recomputeInterestGroupSupport=function(){if(Electorate.ready)return Electorate.recompute();return legacyRecompute();};
    var legacyTotals=Counties.calculateCountyVoteTotals;
    Counties.calculateCountyVoteTotals=function(county,opts){
        if(!Electorate.ready)return legacyTotals.call(this,county,opts);
        opts=opts||{};var result=Electorate.countyResult(county);if(!result)return legacyTotals.call(this,county,opts);
        var reporting=opts.reportingFactor===undefined?1:Electorate.clamp(Number(opts.reportingFactor)||0,0,1);
        var decided=opts.decidedMultiplier===undefined?1:Electorate.clamp(Number(opts.decidedMultiplier)||0,0,1);
        var error=opts.errorFactor===undefined?1:Math.max(0,Number(opts.errorFactor)||0);
        var scale=reporting*decided*error;
        if(result.total>0)scale=Math.min(scale,result.registered*reporting/result.total);
        var totals={};Object.keys(result.byParty).forEach(function(p){totals[p]=result.byParty[p]*scale;});return totals;
    };
    function truePolling(state){var totals={D:0,R:0,G:0,L:0,I:0,PSL:0,Undecided:0},weight=0;Object.values(Counties.countyData).forEach(function(c){if(state&&c.s!==state)return;var r=Electorate.countyResult(c);if(!r)return;var u=Electorate.clamp((c.undecided||0)/100,0,1);Object.keys(r.byParty).forEach(function(p){totals[p]+=r.byParty[p]*(1-u);});totals.Undecided+=r.total*u;weight+=r.total;});if(!weight)return null;Object.keys(totals).forEach(function(p){totals[p]=100*totals[p]/weight;});return totals;}
    var oldNationalTruth=Utils.getTrueNationalPollingByParty,oldStateTruth=Utils.getTrueStatePollingByParty;
    Utils.getTrueNationalPollingByParty=function(){return Electorate.ready?truePolling():oldNationalTruth.call(this);};
    Utils.getTrueStatePollingByParty=function(state){return Electorate.ready?truePolling(state):oldStateTruth.call(this,state);};
    var legacyPool=Election.getCountyVoterPool,legacyTurnout=Election.getCountyTurnoutRate;
    Election.getCountyVoterPool=function(county,reporting,decided,error){if(!Electorate.ready)return legacyPool.apply(this,arguments);var totals=Counties.calculateCountyVoteTotals(county,{reportingFactor:reporting,decidedMultiplier:decided,errorFactor:error});return Object.values(totals).reduce(function(a,b){return a+b;},0);};
    Election.getCountyTurnoutRate=function(county){return Electorate.ready?Electorate.countyResult(county).rate:legacyTurnout.call(this,county);};
    Election.getCountyTurnoutRateForParty=function(county,party){if(!Electorate.ready)return legacyTurnout.call(this,county);var result=Electorate.countyResult(county),model=Electorate.prepare(),i=model.candidates.findIndex(function(c){return c.party===party;}),denom=0;if(i<0)return 0;county.electorateCells.forEach(function(cell){denom+=result.registered*cell.weight*Electorate.response(county,cell.group,cell.base).preferences[i];});return denom?Electorate.clamp(result.byParty[party]/denom,0,1):0;};
    var legacyShare=Counties.getCountyGroupShare;
    Counties.getCountyGroupShare=function(county,id){return county.geographyVersion===2?Electorate.share(county,id):legacyShare.call(this,county,id);};
    var legacyIgValue=_getCountyIgValue;
    _getCountyIgValue=function(county,key){if(county&&county.ig&&(Number.isFinite(county.ig[key])||key==='cuban'))return Electorate.share(county,key);return legacyIgValue(county,key);};
    ['openFieldOffice','hireFieldStaff','deployCanvassers','investVoterFile','activateGOTV'].forEach(function(name){var original=GroundOps[name];GroundOps[name]=function(){var result=original.apply(this,arguments);Electorate.invalidate();return result;};});

    // Alaska rows in the recent-cycle election file are legislative districts,
    // including numeric codes that collide with real borough FIPS. Keep the
    // explicit historical county baseline supplied by the v2 import instead.
    var baseline=Counties.applyCountyVoteBaselineFromRecentCycles;
    Counties.applyCountyVoteBaselineFromRecentCycles=function(){var saved={};Object.keys(this.countyData).forEach(function(f){var c=Counties.countyData[f];if(c.s==='AK'&&c.geographyVersion===2)saved[f]=JSON.parse(JSON.stringify(c));});var n=baseline.apply(this,arguments);Object.keys(saved).forEach(function(f){Counties.countyData[f]=saved[f];});return n;};
    var oldTurnoutCsv=Counties.parseTurnoutCsv;
    Counties.parseTurnoutCsv=function(text){var saved={};Object.keys(this.countyData).forEach(function(f){if(Counties.countyData[f].s==='AK')saved[f]=Counties.countyData[f].turnoutBase;});oldTurnoutCsv.call(this,text);Object.keys(saved).forEach(function(f){Counties.countyData[f].turnoutBase=saved[f];});};

    function queuedIssue(action,scale){
        if(!IssueModel.getIssue(action.issueId))return;
        Electorate.expose({stateCode:action.state,countyId:action.countyId||action.countyFips,sponsorId:gameData.candidate.id,issueId:action.issueId,type:'issue',segment:action.groupId,exposure:(action.intensity||1)*scale});
        Favorability.ad({sponsorId:gameData.candidate.id,type:'issue',countyIds:action.countyId||action.countyFips?[action.countyId||action.countyFips]:null,stateCode:action.state,segment:action.groupId,exposure:(action.intensity||1)*scale});
        PolicyManager.campaignOnIssue(gameData.selectedParty,action.issueId,5*scale);
        Utils.addLog((action.type||'Campaign')+' on '+IssueModel.getIssue(action.issueId).name+' in '+action.state+'.');
    }
    Persuasion.applyAdAction=function(a){queuedIssue(a,1);};
    Persuasion.applySpeechAction=function(a){queuedIssue(a,1.3);};
    Persuasion.applySurrogateAction=function(a){queuedIssue(a,0.6);};
    // Process queued actions once. Smoothing absolute county lean on every
    // action used to manufacture unrelated nationwide shifts.
    Persuasion.applyQueuedActions=function(){var self=this,methods={AD:'applyAdAction',SPEECH:'applySpeechAction',SURROGATE:'applySurrogateAction',RALLY:'applyRallyAction',FIELD:'applyFieldAction',DIGITAL:'applyDigitalAction',DEBATE_PREP:'applyDebatePrepAction',OPPO_RESEARCH:'applyOppoResearchAction'};var actions=(gameData.pendingActions||[]).slice();gameData.pendingActions=[];gameData.turnPressure={};actions.forEach(function(a){if(methods[a.type])self[methods[a.type]](a);});Electorate.invalidate();};
    Persuasion.calculateAlignment=function(candidateId,groupId,issueId){var profile=Electorate.profile(groupId,issueId),pos=IssueModel.getPosition(candidateId,issueId);return profile&&pos?profile.distribution.reduce(function(a,w,i){return a+w*IssueModel.agreement(issueId,pos.id,IssueModel.positions[i].id);},0):0;};
    Persuasion.getGroupIssueImportance=function(groupId,issueId){var p=Electorate.profile(groupId,issueId);return p?p.importance/100:0;};
    Counties.handleCountySpeech=function(fips,issueId){var c=this.countyData[this.normalizeFips(fips)];if(!c||!IssueModel.getIssue(issueId)||gameData.energy<1)return;Campaign.saveState();gameData.energy--;document.getElementById('speech-modal').classList.add('hidden');if(!gameData.pendingActions)gameData.pendingActions=[];gameData.pendingActions.push({type:'SPEECH',state:c.s,countyId:c.fips,issueId:issueId,intensity:1,cost:{funds:0,energy:0}});Utils.addLog('Speech on '+IssueModel.getIssue(issueId).name+' queued in '+c.n+' ('+c.s+').');Campaign.updateHUD();AdEngine.refresh();Counties.selectCounty(c.fips);};
    Counties.evaluateIssueEvent=function(fips,issueId,candidate,power){var c=this.countyData[this.normalizeFips(fips)];if(!c||!c.electorateCells)return 0;return c.electorateCells.reduce(function(sum,cell){return sum+cell.weight*Persuasion.calculateAlignment(candidate.id,cell.group,issueId);},0)*(power||0);};

    // Platform announcements change the same canonical stance consumed by
    // elections, ads, debates and endorsements, rather than separate bonuses.
    var policyStances={abolish_ice:['deportation','far_left'],build_wall:['immigration','right'],path_citizenship:['citizenship','center_left'],mass_deportation:['deportation','far_right'],ubi:['economy','left'],flat_tax:['taxation','far_right'],wealth_tax:['taxation','far_left'],protective_tariffs:['trade','right'],free_trade_deals:['trade','center'],medicare_for_all:['healthcare','left'],public_option:['healthcare','center_left'],repeal_aca:['healthcare','right'],green_new_deal:['climate','far_left'],drill_baby_drill:['energy','right'],carbon_tax:['climate','center_left'],abortion_ban:['abortion','far_right'],codify_roe:['abortion','center_left'],gun_ban:['guns','far_left'],constitutional_carry:['guns','right'],defund_police:['criminal','far_left'],tough_on_crime:['criminal','right'],pack_scotus:['scotus','left'],term_limits:['electionreform','center'],ag_subsidies:['economy','center_left']};
    PolicyManager._getTrackerKey=function(p){return p===gameData.selectedParty?'player':p==='D'?'demOpponent':p==='R'?'repOpponent':p;};
    PolicyManager.adoptPolicy=function(party,id,silent){var p=POLICIES.find(function(p){return p.id===id;}),stance=policyStances[id],candidate=sponsorForParty(party),key=this._getTrackerKey(party);if(!p||!stance||!candidate)return false;var list=this.activePolicies[key]||(this.activePolicies[key]=[]);if(list.some(function(p){return p.id===id;}))return false;if(!this.getAvailablePolicies(party).some(function(p){return p.id===id;}))return false;var player=party===gameData.selectedParty;if(player&&gameData.lockedIssues[stance[0]]&&IssueModel.getPosition(candidate.id,stance[0]).id!==stance[1]){if(!silent)Utils.showToast('This policy conflicts with a locked PAC agreement.');return false;}if(player&&(gameData.funds<p.cost.funds||gameData.energy<p.cost.energy)){if(!silent)Utils.showToast('Not enough funds or energy.');return false;}if(!player&&(candidate.funds||0)<p.cost.funds)return false;if(player){Campaign.saveState();gameData.funds-=p.cost.funds;gameData.energy-=p.cost.energy;}else candidate.funds-=p.cost.funds;list.push({id:id,importance:25,adoptedWeek:gameData.currentWeek||0});IssueModel.setPosition(candidate.id,stance[0],stance[1]);if(!silent)Utils.addLog('Adopted '+p.name+': '+IssueModel.getIssue(stance[0]).name+' — '+IssueModel.getPosition(candidate.id,stance[0]).label+'.');AdEngine.refresh();return true;};
    PolicyManager.campaignOnIssue=function(party,issue,boost){(this.activePolicies[this._getTrackerKey(party)]||[]).forEach(function(p){var stance=policyStances[p.id];if(stance&&stance[0]===IssueModel.canonical(issue))p.importance=Math.min(100,p.importance+boost);});};
    var legacyPolicyEffects=PolicyManager.getPolicyGroupEffects;
    PolicyManager.getPolicyGroupEffects=function(p){return Electorate.ready?{groupEffects:{},economyEffects:{agri_index:0,mfg_index:0}}:legacyPolicyEffects.call(this,p);};

    var oldInitAds=DigitalAds.initDigitalAds;
    DigitalAds.initDigitalAds=function(){oldInitAds.call(this);gameData.ads.campaigns=[];gameData.ads.saturation={};};
    DigitalAds.processWeekly=function(){}; // Campaign.nextWeek owns the clock.
    function sponsorForParty(party){var c=Utils.getActiveCandidates().find(function(c){return c.party===party;});return c&&c.cand;}
    DigitalAds.buyTVAd=function(market,type,intensity,duration,party,details){party=party||gameData.selectedParty;var sponsor=sponsorForParty(party);if(!sponsor)return false;var result=AdEngine.buy(Object.assign({channel:'tv',type:type,marketId:market,intensity:intensity,durationWeeks:duration,sponsorId:sponsor.id},details||{}));if(!result.ok&&party===gameData.selectedParty)Utils.showToast(result.error);return result.ok;};
    DigitalAds.executeDigitalCampaign=function(state,config,party){party=party||gameData.selectedParty;var sponsor=sponsorForParty(party);if(!sponsor)return false;var type={bio:'positive',persuade:'issue',contrast:'attack',attack:'attack',mobilize:'mobilize'}[config.creative]||'issue';var segment=config.segment==='independents'?'centrists':config.segment;var result=AdEngine.buy({channel:'digital',type:type,stateCode:state,budget:config.totalBudget||config.budget,sponsorId:sponsor.id,segment:segment&&INTEREST_GROUPS[segment]?segment:undefined,issueId:config.issueId||'economy',targetId:config.targetId,intensity:1,durationWeeks:config.durationWeeks||1});if(!result.ok&&party===gameData.selectedParty)Utils.showToast(result.error);return result.ok;};

    OpponentAI.applyVpPressure=function(party){var ticket=this.getTicket(party);if(!ticket||!ticket.pres||!ticket.vp)return;var options=CORE_ISSUES.filter(function(issue){return Math.abs(IssueModel.getPosition(ticket.pres,issue.id).index-IssueModel.getPosition(ticket.vp,issue.id).index)>=2;});if(!options.length)return;var issue=options[Math.floor(Math.random()*options.length)],p=IssueModel.getPosition(ticket.pres,issue.id),vp=IssueModel.getPosition(ticket.vp,issue.id);IssueModel.setPosition(ticket.pres.id,issue.id,IssueModel.positions[p.index+(vp.index>p.index?1:-1)].id);};
    var legacyAIAction=OpponentAI.executeAction;
    OpponentAI.executeAction=function(action,party){if(['ad','county_ad','digital_preset'].indexOf(action.type)<0)return legacyAIAction.call(this,action,party);var sponsor=sponsorForParty(party);if(!sponsor)return;var county=action.county&&Counties.countyData[Counties.normalizeFips(action.county)],state=county?county.s:action.state;var priorities=typeof CampaignPriorities!=='undefined'?CampaignPriorities.chooseForParty(party):[];var issue=priorities.length?priorities[Math.floor(Math.random()*Math.min(2,priorities.length))]:CORE_ISSUES[Math.floor(Math.random()*CORE_ISSUES.length)].id;var targets=Utils.getActiveCandidates().filter(function(c){return c.party!==party;}),target=targets.length?targets[Math.floor(Math.random()*targets.length)].cand:null,type=target&&Math.random()<0.35?'attack':'issue';return AdEngine.buy({channel:'digital',stateCode:state,budget:Math.min(2,(sponsor.funds||0)*0.10),sponsorId:sponsor.id,type:type,issueId:issue,targetId:target&&target.id,intensity:1,durationWeeks:1}).ok;};

    var oldNextWeek=Campaign.nextWeek;
    Campaign.nextWeek=function(){
        // The legacy weekly transition remains the authoritative clock.  The
        // county model is an enhancement and must never strand the campaign on
        // the first week while its data finishes loading or recovers from a
        // malformed optional record.
        if(gameData.currentDate>=gameData.electionDay)return oldNextWeek.apply(this,arguments);
        if(Electorate.ready){
            try{
                Electorate.weekly();
                AdEngine.processWeekly((gameData.currentWeek||0)+1);
            }catch(error){
                console.error('Weekly electorate update skipped; continuing with the campaign clock.',error);
                Electorate.invalidate();
            }
        }
        return oldNextWeek.apply(this,arguments);
    };

    // Full versioned snapshots support undo and exported saves without embedding
    // immutable demographic/profile text in every action history entry.
    var mutableCountyKeys=['v','originalV','simulationBaseV','electorateCells','turnout','turnoutBase','regVoters','undecided','issueAttention','issueMessages','partyMobilization','mobilization','adSaturation','campaignFatigue','visited','rallies','rawSwing','finalSwing','playerBuff','demBuff','repBuff'];
    window.SimulationState={
        serialize:function(){var data={};Object.keys(gameData).forEach(function(k){if(k!=='historyStack')data[k]=gameData[k];});var counties={};Object.keys(Counties.countyData).forEach(function(f){counties[f]={};mutableCountyKeys.forEach(function(k){if(Counties.countyData[f][k]!==undefined)counties[f][k]=Counties.countyData[f][k];});});return JSON.parse(JSON.stringify({version:2,data:data,counties:counties,policies:PolicyManager.activePolicies,reference:Electorate.reference}));},
        restore:function(snapshot){if(!snapshot||snapshot.version!==2)throw new Error('This save predates the new demographic model. Start a new campaign.');var history=gameData.historyStack||[];Object.keys(gameData).forEach(function(k){delete gameData[k];});Object.assign(gameData,JSON.parse(JSON.stringify(snapshot.data)));gameData.currentDate=new Date(gameData.currentDate);gameData.electionDay=new Date(gameData.electionDay);gameData.historyStack=history;Object.keys(snapshot.counties).forEach(function(f){var c=Counties.countyData[f];if(!c)return;mutableCountyKeys.forEach(function(k){delete c[k];});Object.assign(c,JSON.parse(JSON.stringify(snapshot.counties[f])));});PolicyManager.activePolicies=JSON.parse(JSON.stringify(snapshot.policies));Electorate.reference=JSON.parse(JSON.stringify(snapshot.reference));Electorate.invalidate();Electorate.recompute();Object.keys(gameData.states).forEach(function(s){Counties.updateStateFromCounties(s);});return true;}
    };
    Campaign.saveState=function(){gameData.historyStack=gameData.historyStack||[];gameData.historyStack.push(SimulationState.serialize());if(gameData.historyStack.length>10)gameData.historyStack.shift();};
    Campaign.undoLastAction=function(){var s=(gameData.historyStack||[]).pop();if(!s)return Utils.showToast('Nothing to undo.');SimulationState.restore(s);Campaign.updateHUD();Campaign.colorMap();if(typeof OverhaulUI!=='undefined')OverhaulUI.refresh();Utils.showToast('Action undone.');};
})();
