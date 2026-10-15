/* One shared calendar, an explicit nomination/general handoff, and durable
   browser saves. Initializing the map must never reset a restored campaign. */
var PrimaryIntegration = (function () {
    'use strict';
    var fresh=JSON.parse(JSON.stringify(gameData)),advancing=false;
    function copy(x){return JSON.parse(JSON.stringify(x));}
    function iso(date){return date.getFullYear()+'-'+String(date.getMonth()+1).padStart(2,'0')+'-'+String(date.getDate()).padStart(2,'0');}
    function resetRuntime(){Debates.debatesHeld=[];PolicyManager.init();Campaign.populationCacheReady=false;Electorate.ready=false;Electorate.invalidate();Scandals.activeScandals=[];Scandals.pendingReveals=[];if(typeof EndorserSystem!=='undefined')EndorserSystem.endorsers=[];}
    function freshData(preserve){Object.keys(gameData).forEach(function(k){delete gameData[k];});Object.assign(gameData,copy(fresh),preserve);gameData.currentDate=new Date(gameData.currentDate);gameData.electionDay=new Date(2028,10,7);gameData.historyStack=[];initGameData();resetRuntime();}
    function renderMap(){
        // Campaign.initMap also owns the SVG event wiring. County initialization
        // has already happened; suppress only that initialization callback.
        var load=Counties.loadCountyData;Counties.loadCountyData=function(){};
        try{Campaign.initMap();}finally{Counties.loadCountyData=load;}
        Campaign.updateHUD();if(typeof OverhaulUI!=='undefined')OverhaulUI.refresh();toolbar();
    }
    function ticketFor(party){return party==='D'?gameData.demTicket:party==='R'?gameData.repTicket:gameData.thirdTickets[party];}
    function syncTickets(){
        var p=PrimaryCampaign.state();if(!p)return false;var changed=false;
        Object.keys(p.parties).forEach(function(party){var ps=p.parties[party];
            if(ps.convention&&ps.convention.noNominee){if(gameData.thirdTickets[party]){delete gameData.thirdTickets[party];changed=true;}return;}
            var leader=ps.nomineeId||(PrimaryCampaign.getPoll(party,null)[0]||{}).id,a=PrimaryCampaign.actor(leader);if(!a)return;
            var ticket=ticketFor(party)||{pres:null,vp:null};if(!ticket.pres||ticket.pres.id!==a.id)changed=true;
            ticket.pres=a.candidate;ticket.pres.funds=a.funds;
            if(ps.vpCandidate&&(!ticket.vp||ticket.vp.id!==ps.vpId)){ticket.vp=ps.vpCandidate;changed=true;}
            // A party still choosing its nominee has no fictional running mate.
            if(!ps.vpId)ticket.vp=null;
            ticket.primaryProvisional=!ps.nomineeId;
            if(party==='D')gameData.demTicket=ticket;else if(party==='R')gameData.repTicket=ticket;else gameData.thirdTickets[party]=ticket;
            if(party===p.playerParty){gameData.candidate=a.candidate;gameData.vp=ticket.vp;}
        });
        return changed;
    }
    function rebuildElectionForTickets(){
        var history=gameData.groupPolls,attention=gameData.groupAttention,saved={};
        Object.keys(Counties.countyData).forEach(function(id){var c=Counties.countyData[id];saved[id]={issueMessages:copy(c.issueMessages||{}),issueAttention:copy(c.issueAttention||{}),partyMobilization:copy(c.partyMobilization||{})};});
        Electorate.initialize();
        Object.keys(saved).forEach(function(id){Object.assign(Counties.countyData[id],saved[id]);});
        gameData.groupPolls=history||{};gameData.groupAttention=attention||{};Electorate.invalidate();Electorate.recompute();
    }
    function transferOrganization(a){GroundOps.initGroundOps();Object.keys(STATES).forEach(function(code){var o=PrimaryCampaign.org(a,code),g=gameData.groundOps;
        g.offices[code]={count:o.offices,quality:Math.min(1,0.3+o.offices*0.12),weekOpened:Array(o.offices).fill(0)};
        g.staffLevels[code]=o.staff;g.volunteerPools[code]=Math.min(500,o.volunteers);g.voterFiles[code]={quality:o.file,coverage:Math.min(1,0.1+o.file*0.6)};
        g.contactHistory[code]={cumulativeContacts:o.contacts};g.gotv[code]={activated:false,weekActivated:0};
    });}
    function transferRecord(){var p=PrimaryCampaign.state();Object.keys(p.parties).forEach(function(party){var ticket=ticketFor(party);if(!ticket||!ticket.pres)return;var a=PrimaryCampaign.actor(ticket.pres.id);if(!a)return;
        if(typeof CampaignPriorities!=='undefined'){gameData.campaignPriorities[a.id]=a.priorities.slice();}
        Favorability.change(a.id,(a.favorability-0.53)*35,{recognition:(a.awareness-0.4)*25});
        Object.values(Counties.countyData).forEach(function(c){
            var o=PrimaryCampaign.org(a,c.s),lift=Math.min(0.5,Math.max(-0.5,(a.generalStrength[c.s]||0)*0.08+(a.unity-0.7)*0.30+(a.credibility-0.8)*0.15));
            var endorsement=a.endorsements.reduce(function(n,e){if(e.state&&e.state!=='National'&&e.state!==c.s)return n;return n+(e.strength||0)*(e.group?Electorate.share(c,e.group):0.3)*0.10;},0);
            c.partyMobilization=c.partyMobilization||{};c.partyMobilization[party]=(c.partyMobilization[party]||0)+Math.min(0.06,o.offices*0.0015+o.contacts/10000000+(a.unity-0.7)*0.02+endorsement);
            if(lift)c.issueMessages['primary-record-'+a.id]={type:'issue',sponsorId:a.id,issueId:a.priorities[0]||'economy',exposure:lift*5};
            (a.messages[c.s]||[]).concat(a.messages.National||[]).forEach(function(m,index){if(m.remaining<=0||(m.marketId&&c.mediaMarket!==m.marketId))return;var reach=m.countyId&&m.countyId!==c.fips?0.12:1;c.issueMessages['primary-message-'+a.id+'-'+index]={type:m.negative?'attack':'issue',sponsorId:m.sourceId||a.id,targetId:m.negative?a.id:undefined,issueId:m.issueId||a.priorities[0],segment:m.segment,exposure:Math.abs(m.strength)*4*reach};});
        });
    });Electorate.invalidate();Electorate.recompute();}
    async function enterGeneral(){
        var p=PrimaryCampaign.state(),a=PrimaryCampaign.player(),ps=p&&p.parties[p.playerParty];
        if(!p)return {ok:false,error:'There is no active nomination campaign.'};
        if(p.phase==='general'){Screens.goTo(p.ended?'election-screen':'game-screen');if(!p.ended){Campaign.updateHUD();toolbar();}return {ok:true};}
        if(p.ended)return {ok:false,error:'This nomination campaign has ended.'};
        if(!ps.nomineeId||ps.nomineeId!==a.id)return {ok:false,error:'Secure the nomination or continue as your party’s actual nominee first.'};
        if(!ps.vpId)return {ok:false,error:'Select your running mate in the convention and ticket panel first.'};
        if(ps.convention&&ps.convention.pending)return {ok:false,error:'Complete the convention roll call before returning to the general election.'};
        if(p.pendingActions.some(function(q){return q.actorId===a.id;}))return {ok:false,error:'Resolve or cancel your queued primary actions before entering the general election.'};
        if(p.nativeCampaign&&typeof PrimaryNative!=='undefined')return PrimaryNative.enterGeneral();
        await PrimaryCampaign.loadCounties();
        var date=p.date;
        freshData({primary:p,campaignMode:'primary',currentDate:new Date(date+'T12:00:00'),selectedParty:p.playerParty,thirdPartiesEnabled:Object.keys(p.parties).some(function(code){return !['D','R'].includes(code);})});
        p.phase='general';p.handoffDate=date;gameData.generalStartDate=date;gameData.currentWeek=Math.max(0,Math.floor((gameData.currentDate-new Date(2028,6,4,12))/604800000));
        gameData.thirdTickets={};syncTickets();gameData.candidate=a.candidate;gameData.funds=a.funds;gameData.energy=a.energy;gameData.maxEnergy=a.maxEnergy;
        gameData.liveGroups=copy(INTEREST_GROUPS);initializeInterestGroupSupport();
        if(typeof ISSUE_SALIENCE!=='undefined')gameData.issueSalience=copy(ISSUE_SALIENCE);
        gameData.favorability=a.favorability;gameData.credibility=a.credibility;gameData.campaignMomentum=a.momentum;
        transferOrganization(a);DigitalAds.initDigitalAds();Endorsers.init();initInterestGroupTurnout();
        if(typeof initCoalitionStatus==='function')initCoalitionStatus();if(typeof recomputeCoalitionTurnout==='function')recomputeCoalitionTurnout();
        Favorability.init();applyCandidateBuffs();Electorate.initialize();transferRecord();
        if(typeof updateCoalitionLoyalty==='function')updateCoalitionLoyalty();
        Scandals.activeScandals=Object.values(p.actors).filter(function(x){return ticketFor(x.party)&&ticketFor(x.party).pres.id===x.id;}).reduce(function(list,x){return list.concat(x.scandals.filter(function(s){return s.remaining>0;}).map(function(s){return {id:s.id,targetParty:x.party,targetName:x.candidate.name,tier:1,severity:s.severity,weeksRemaining:s.remaining,description:s.label,favPenalty:0,groupEffects:{},leakageDouble:false};}));},[]);
        gameData.ballotAccess={};Object.keys(p.parties).forEach(function(party){var ticket=ticketFor(party),nominee=ticket&&PrimaryCampaign.actor(ticket.pres.id);if(nominee)gameData.ballotAccess[party]=Object.keys(STATES).filter(function(code){return party==='D'||party==='R'||nominee.ballotAccess[code]>=100;});});
        gameData.logs=p.history.slice(-80).map(function(e){return e.text;});
        Object.keys(gameData.states).forEach(function(code){Counties.updateStateFromCounties(code);});
        Polling.init(true);GroupPolling.publish(gameData.currentWeek);Campaign.captureFrozenSnapshot();
        PrimaryCampaign.log('The general-election campaign begins on '+date+'. Resources, field organization, policy positions and commitments carry forward. Other nominations continue on the same calendar.','handoff');
        Screens.goTo('game-screen');renderMap();await PrimaryStorage.save();return {ok:true};
    }
    function syncPlayerFromGeneral(){var p=PrimaryCampaign.state(),a=PrimaryCampaign.player();if(!p||p.phase!=='general')return;
        a.funds=gameData.funds;a.energy=gameData.energy;a.maxEnergy=gameData.maxEnergy;a.favorability=gameData.favorability;a.credibility=gameData.credibility;
        a.candidate=gameData.candidate;CORE_ISSUES.forEach(function(i){a.platform[i.id]=IssueModel.getPosition(a.candidate,i.id).id;});
        var g=gameData.groundOps;if(g)Object.keys(STATES).forEach(function(code){var o=PrimaryCampaign.org(a,code);o.offices=g.offices[code].count;o.staff=g.staffLevels[code];o.volunteers=g.volunteerPools[code];o.file=g.voterFiles[code].quality;o.contacts=g.contactHistory[code].cumulativeContacts;});
    }
    function syncPlayerToGeneral(){var a=PrimaryCampaign.player();if(!a)return;if(Electorate.ready&&Number.isFinite(gameData.favorability))Favorability.change(a.id,(a.favorability-gameData.favorability)*30);gameData.funds=a.funds;gameData.energy=a.energy;gameData.credibility=a.credibility;gameData.favorability=a.favorability;gameData.candidate=a.candidate;if(gameData.campaignPriorities)gameData.campaignPriorities[a.id]=a.priorities.slice();Electorate.invalidate();}
    function toolbar(){if(typeof PrimaryNative!=='undefined'){PrimaryNative.installControls();return;}var screen=document.getElementById('game-screen');if(!screen)return;var bar=document.getElementById('primary-general-toolbar');if(!bar){bar=document.createElement('div');bar.id='primary-general-toolbar';bar.className='primary-general-toolbar';screen.prepend(bar);}
        var hasPrimary=!!PrimaryCampaign.state();bar.innerHTML=(hasPrimary?'<button type="button" data-campaign-control="primary">Nominations & agreements</button>':'')+'<button type="button" data-campaign-control="save">Save campaign</button><button type="button" data-campaign-control="export">Export save</button><span aria-live="polite">'+(hasPrimary?'Continuous campaign · '+PrimaryCampaign.state().date:'General Election · July–November 2028')+'</span>';
        bar.onclick=async function(e){var button=e.target.closest('[data-campaign-control]');if(!button)return;var action=button.dataset.campaignControl;if(action==='primary'){syncPlayerFromGeneral();PrimaryCampaign.viewPrimary();}else if(action==='export')PrimaryStorage.exportSave();else{var result=await PrimaryStorage.save('manual');Utils.showToast(result.ok?'Campaign saved.':result.error);}};
    }
    var originalStart=startGame;
    startGame=function(){var preserve={candidate:gameData.candidate,vp:gameData.vp,selectedParty:gameData.selectedParty,demTicket:gameData.demTicket,repTicket:gameData.repTicket,thirdTickets:gameData.thirdTickets,thirdPartiesEnabled:gameData.thirdPartiesEnabled,funds:gameData.funds,energy:gameData.energy,maxEnergy:gameData.maxEnergy,campaignMode:'general'};
        freshData(preserve);originalStart();toolbar();};
    var oldWeek=Campaign.nextWeek;
    Campaign.nextWeek=async function(){
        if(advancing)return;var p=PrimaryCampaign.state();
        if(p&&p.phase==='primary'&&typeof PrimaryNative!=='undefined')return PrimaryNative.nextWeek();
        if(!p||p.phase!=='general'){var result=oldWeek.apply(this,arguments);await PrimaryStorage.save();return result;}
        var ps=p.parties[p.playerParty];if(ps.convention&&ps.convention.pending){Utils.showToast('Complete your convention ballot or ticket selection first.');PrimaryCampaign.viewPrimary();return;}
        advancing=true;
        try{
            syncPlayerFromGeneral();var target=PrimaryRules.datePlus(iso(gameData.currentDate),7);if(target>PrimaryRules.electionDay)target=PrimaryRules.electionDay;
            var step=await PrimaryCampaign.advance(target,true);if(!step.ok){Utils.showToast(step.error);return;}
            var changed=syncTickets();syncPlayerToGeneral();
            if(changed)rebuildElectionForTickets();
            var nativeRandom=Math.random;Math.random=PrimaryCampaign.random;
            try{oldWeek.apply(this,arguments);}finally{Math.random=nativeRandom;}
            if(!p.nativeCampaign)gameData.currentWeek=Math.max(0,Math.floor((gameData.currentDate-new Date(2028,6,4,12))/604800000));
            syncPlayerFromGeneral();toolbar();await PrimaryStorage.save();
            if(ps.convention&&ps.convention.pending)PrimaryCampaign.viewPrimary();
        }finally{advancing=false;}
    };
    var oldPosition=IssueModel.setPosition;
    IssueModel.setPosition=function(candidate,issueId,positionId,options){var p=PrimaryCampaign.state(),id=typeof candidate==='object'?candidate.id:candidate;
        if(p&&PrimaryNegotiations.policyLocked(id,IssueModel.canonical(issueId),positionId))return {ok:false,error:'An active nomination agreement binds this policy.'};
        var result=oldPosition.apply(this,arguments);if(result.ok&&p&&p.actors[id]){var a=p.actors[id];a.platform[IssueModel.canonical(issueId)]=positionId;PrimaryCampaign.touch();}return result;
    };
    // The legacy policy manager charges resources after its availability check.
    // Exclude conflicting commitments there, before either resource is spent.
    var primaryPolicyPositions={abolish_ice:['deportation','far_left'],build_wall:['immigration','right'],path_citizenship:['citizenship','center_left'],mass_deportation:['deportation','far_right'],ubi:['economy','left'],flat_tax:['taxation','far_right'],wealth_tax:['taxation','far_left'],protective_tariffs:['trade','right'],free_trade_deals:['trade','center'],medicare_for_all:['healthcare','left'],public_option:['healthcare','center_left'],repeal_aca:['healthcare','right'],green_new_deal:['climate','far_left'],drill_baby_drill:['energy','right'],carbon_tax:['climate','center_left'],abortion_ban:['abortion','far_right'],codify_roe:['abortion','center_left'],gun_ban:['guns','far_left'],constitutional_carry:['guns','right'],defund_police:['criminal','far_left'],tough_on_crime:['criminal','right'],pack_scotus:['scotus','left'],term_limits:['electionreform','center'],ag_subsidies:['economy','center_left']};
    var oldAvailablePolicies=PolicyManager.getAvailablePolicies;
    PolicyManager.getAvailablePolicies=function(party){var list=oldAvailablePolicies.apply(this,arguments),p=PrimaryCampaign.state();if(!p)return list;var candidate=Utils.getActiveCandidates().find(function(c){return c.party===party;});if(!candidate)return list;return list.filter(function(policy){var stance=primaryPolicyPositions[policy.id];return !stance||!PrimaryNegotiations.policyLocked(candidate.cand.id,stance[0],stance[1]);});};
    var oldDebate=Debates.checkDebateWeek;
    Debates.checkDebateWeek=function(){if(!PrimaryCampaign.state())return oldDebate.apply(this,arguments);gameData.generalDebatesHeld=gameData.generalDebatesHeld||[];var today=iso(gameData.currentDate);
        [{date:'2028-09-26',type:'presidential',label:'Presidential Debate #1'},{date:'2028-10-03',type:'vp',label:'Vice Presidential Debate'},{date:'2028-10-10',type:'presidential',label:'Presidential Debate #2'},{date:'2028-10-24',type:'presidential',label:'Presidential Debate #3'}].forEach(function(d){if(d.date<=today&&!gameData.generalDebatesHeld.includes(d.date)){gameData.generalDebatesHeld.push(d.date);if(d.date>=PrimaryRules.datePlus(today,-7)){if(d.type==='vp')Debates.resolveVPDebate(d);else Debates.resolvePresidentialDebate(d);}}});
    };
    var legacyBallotAccess=isPartyOnBallotForState;
    isPartyOnBallotForState=function(party,code){var p=PrimaryCampaign.state();if(!p||p.phase!=='general'||party==='D'||party==='R')return legacyBallotAccess(party,code);var ps=p.parties[party],ticket=ticketFor(party),a=ticket&&ticket.pres&&PrimaryCampaign.actor(ticket.pres.id);if(!ps||!a||(ps.convention&&ps.convention.noNominee))return false;return a.ballotAccess[String(code).toUpperCase()]>=100;};
    var oldAITurn=OpponentAI.executeTurn;
    OpponentAI.executeTurn=function(party,stamina){var p=PrimaryCampaign.state();if(!p)return oldAITurn.apply(this,arguments);var ps=p.parties[party];if(!ps||!ps.nomineeId)return;var a=PrimaryCampaign.actor(ps.nomineeId),ticket=ticketFor(party);ticket.pres.funds=a.funds;var result=oldAITurn.apply(this,arguments);a.funds=Math.max(0,ticket.pres.funds);return result;};
    var oldOpponentTurn=Campaign.opponentTurn;
    Campaign.opponentTurn=function(){oldOpponentTurn.apply(this,arguments);var p=PrimaryCampaign.state();if(!p||p.phase!=='general')return;Object.keys(p.parties).filter(function(party){return !['D','R',p.playerParty].includes(party);}).forEach(function(party){var ps=p.parties[party],a=PrimaryCampaign.actor(ps.nomineeId);if(a&&!(ps.convention&&ps.convention.noNominee))OpponentAI.executeTurn(party,a.maxEnergy);});};
    var oldRestore=SimulationState.restore;
    SimulationState.restore=function(snapshot){var result=oldRestore.apply(this,arguments),p=PrimaryCampaign.state();if(p){var a=PrimaryCampaign.player();gameData.candidate=a.candidate;if(p.phase==='general'){Object.keys(p.parties).forEach(function(party){var t=ticketFor(party);if(t&&t.pres&&p.actors[t.pres.id])t.pres=p.actors[t.pres.id].candidate;});Electorate.invalidate();}PrimaryCampaign.rebuild();}return result;};
    var oldFinal=Election.showFinalResults;
    Election.showFinalResults=function(){var result=oldFinal.apply(this,arguments),p=PrimaryCampaign.state();if(!p)return result;var a=PrimaryCampaign.player(),winner=this.finalAnalysis&&this.finalAnalysis.evWinner;p.electionOutcome={date:PrimaryRules.electionDay,winnerParty:winner,playerWon:winner===p.playerParty};p.ended=true;
        p.contracts.forEach(function(c){if(c.status!=='active')return;if(c.terms.offerType==='cabinet')c.status=winner===PrimaryCampaign.actor(c.fromId).party?'awaiting nomination':'condition not triggered';else if(c.terms.offerType==='vp')c.status=c.vpFulfilled?'fulfilled':'condition not triggered';else c.status='fulfilled';});
        var overlay=document.getElementById('final-results-overlay'),parent=overlay&&overlay.querySelector('.campaign-summary');if(parent){var summary=document.createElement('div');summary.className='campaign-summary';var headline=document.createElement('h2');headline.textContent='FROM THE PRIMARIES TO NOVEMBER';summary.appendChild(headline);var body=document.createElement('p');body.textContent=a.candidate.name+' began on September 6, 2027, earned '+(p.parties[a.party].delegates[a.id]||0)+' nomination delegates, and entered the general election on '+(p.handoffDate||p.date)+'. '+p.contracts.length+' negotiated agreements are preserved in the archive. Cabinet promises remain conditional prospective nominations, not confirmed appointments.';summary.appendChild(body);var btn=document.createElement('button');btn.className='result-btn';btn.textContent='VIEW NOMINATION HISTORY';btn.onclick=function(){overlay.classList.add('hidden');PrimaryCampaign.viewPrimary();};summary.appendChild(btn);parent.after(summary);}
        PrimaryStorage.save();return result;};
    return {enterGeneral:enterGeneral,syncTickets:syncTickets,syncPlayerFromGeneral:syncPlayerFromGeneral,syncPlayerToGeneral:syncPlayerToGeneral,renderMap:renderMap,toolbar:toolbar,iso:iso,resetRuntime:resetRuntime,advanceLegacyWeek:function(){return oldWeek.call(Campaign);},preparePrimary:function(){freshData({campaignMode:'primary'});}};
}());

var PrimaryStorage = (function () {
    'use strict';
    var database=null,format=1;
    function db(){if(database)return Promise.resolve(database);return new Promise(function(resolve,reject){var request=indexedDB.open('decision-2028-campaigns',1);request.onupgradeneeded=function(){request.result.createObjectStore('saves');};request.onerror=function(){reject(request.error);};request.onsuccess=function(){database=request.result;resolve(database);};});}
    async function transaction(mode,fn){var database=await db();return new Promise(function(resolve,reject){var tx=database.transaction('saves',mode),request=fn(tx.objectStore('saves')),value;request.onsuccess=function(){value=request.result;};tx.oncomplete=function(){resolve(value);};tx.onerror=function(){reject(tx.error);};tx.onabort=function(){reject(tx.error||new Error('Save operation was interrupted.'));};});}
    function snapshot(){PrimaryIntegration.syncPlayerFromGeneral();var simulation=SimulationState.serialize();Object.keys(simulation.counties).forEach(function(id){var c=Counties.countyData[id];simulation.counties[id].reportedVotes=JSON.parse(JSON.stringify(c.reportedVotes||{}));simulation.counties[id].reportedPct=c.reportedPct||0;});return {format:'decision-2028-campaign',version:format,rulesVersion:PrimaryRules.version,savedAt:new Date().toISOString(),mode:gameData.campaignMode||'general',electorateReady:Electorate.ready,simulation:simulation,runtime:{debatesHeld:Debates.debatesHeld,scandals:Scandals.activeScandals,pendingScandals:Scandals.pendingReveals,election:{time:Election.time,demEV:Election.demEV,repEV:Election.repEV,thirdPartyEV:Election.thirdPartyEV,data2024:Election.data2024,stateCallAllocations:Election.stateCallAllocations},endorserSystem:typeof EndorserSystem!=='undefined'?EndorserSystem.endorsers:[]}};}
    function metadata(slot,value){try{var key='decision2028-save-'+slot;if(value)localStorage.setItem(key,JSON.stringify(value));else localStorage.removeItem(key);}catch(e){/* IndexedDB remains authoritative when metadata is unavailable. */}}
    async function save(slot){slot=slot||'autosave';if(!gameData.candidate)return {ok:false,error:'Start a campaign before saving.'};
        try{var data=snapshot();await transaction('readwrite',function(store){return store.put(data,slot);});metadata(slot,{date:gameData.primary?gameData.primary.date:PrimaryIntegration.iso(gameData.currentDate),candidate:gameData.candidate.name,mode:data.mode});return {ok:true};}
        catch(e){return {ok:false,error:'The campaign could not be saved in this browser. Use Export save. '+e.message};}
    }
    function validate(data){
        if(!data||data.format!=='decision-2028-campaign'||data.version!==format||!data.simulation||data.simulation.version!==2)throw new Error('This file is not a compatible Decision 2028 campaign save.');
        var s=data.simulation,d=s.data;if(!d||!d.candidate||!d.candidate.id||!d.states||!s.counties||!s.policies||!s.reference||!Number.isFinite(new Date(d.currentDate).getTime()))throw new Error('The save is incomplete or damaged.');
        var p=d.primary;if(p){if(data.rulesVersion!==PrimaryRules.version||p.rulesVersion!==PrimaryRules.version)throw new Error('This save uses a different nomination rules version.');
            if(!p.actors||!p.actors[p.playerId]||!p.parties||!p.parties[p.playerParty]||!Array.isArray(p.contests)||!Array.isArray(p.pendingActions)||!Array.isArray(p.contracts)||!Array.isArray(p.offers)||!/^\d{4}-\d{2}-\d{2}$/.test(p.date))throw new Error('The nomination campaign is incomplete or damaged.');
            Object.values(p.actors).forEach(function(a){if(!a.candidate||!a.platform||!a.org||!a.relationships||!a.pledges||!Array.isArray(a.endorsements)||!Number.isFinite(a.funds))throw new Error('A candidate record is damaged.');});
        }
        return data;
    }
    async function restore(data){validate(data);await PrimaryCampaign.loadCounties();var rollback=snapshot();
        try{
            // Restoring only after validation keeps corrupt imports from
            // replacing the current campaign or partially spending resources.
            Electorate.ready=!!data.electorateReady;
            SimulationState.restore(data.simulation);gameData.historyStack=[];gameData.electionDay=new Date(2028,10,7);
            Debates.debatesHeld=(data.runtime&&data.runtime.debatesHeld)||[];if(typeof EndorserSystem!=='undefined')EndorserSystem.endorsers=(data.runtime&&data.runtime.endorserSystem)||[];
            Scandals.activeScandals=(data.runtime&&data.runtime.scandals)||[];Scandals.pendingReveals=(data.runtime&&data.runtime.pendingScandals)||[];
            if(data.runtime&&data.runtime.election)['time','demEV','repEV','thirdPartyEV','data2024','stateCallAllocations'].forEach(function(key){if(data.runtime.election[key]!==undefined)Election[key]=data.runtime.election[key];});
            if(gameData.primary){PrimaryCampaign.rebuild();if(gameData.primary.phase==='general'){gameData.candidate=PrimaryCampaign.player().candidate;Screens.goTo('game-screen');PrimaryIntegration.renderMap();if(gameData.primary.electionOutcome){Screens.goTo('election-screen');Election.showFinalResults();}}else{gameData.candidate=PrimaryCampaign.player().candidate;if(typeof PrimaryNative!=='undefined'){if(!gameData.primary.nativeCampaign)await PrimaryNative.initialize();else{Electorate.ready=true;PrimaryNative.fromPrimary();Electorate.invalidate();Electorate.recompute();await PrimaryNative.showCampaign();}}else{Electorate.ready=false;PrimaryCampaign.viewPrimary();}}}
            else{Screens.goTo('game-screen');PrimaryIntegration.renderMap();}
            return {ok:true};
        }catch(e){Electorate.ready=rollback.electorateReady;SimulationState.restore(rollback.simulation);throw e;}
    }
    async function load(slot){try{var data=await transaction('readonly',function(store){return store.get(slot||'autosave');});if(!data)return {ok:false,error:'No saved campaign was found.'};return await restore(data);}catch(e){return {ok:false,error:e.message};}}
    function exportSave(){if(!gameData.candidate)return {ok:false,error:'Start a campaign first.'};try{var blob=new Blob([JSON.stringify(snapshot())],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='decision-2028-'+(gameData.primary?gameData.primary.date:PrimaryIntegration.iso(gameData.currentDate))+'.json';document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(url);},1000);return {ok:true};}catch(e){return {ok:false,error:e.message};}}
    async function importFile(file){try{if(!file||file.size>100*1024*1024)return {ok:false,error:'Choose a campaign JSON file smaller than 100 MB.'};var data=JSON.parse(await file.text(),function(key,value){if(key==='__proto__'||key==='constructor'||key==='prototype')throw new Error('Invalid property in save file.');return value;});var result=await restore(data);if(result.ok)await save();return result;}catch(e){return {ok:false,error:e.message};}}
    async function hasSave(slot){try{return !!(await transaction('readonly',function(store){return store.getKey(slot||'autosave');}));}catch(e){return false;}}
    async function deleteSave(slot){try{await transaction('readwrite',function(store){return store.delete(slot||'autosave');});metadata(slot||'autosave',null);return {ok:true};}catch(e){return {ok:false,error:e.message};}}
    return {save:save,load:load,hasSave:hasSave,deleteSave:deleteSave,exportSave:exportSave,importFile:importFile};
}());
