/* Primaries are a campaign phase, not a second game UI. The existing campaign
 * owns actions, costs, ads, field operations, opinion, and the weekly clock.
 * This boundary supplies candidate-level polls and nomination rules. */
var PrimaryNative = (function () {
    'use strict';
    // A recovered script request must not wrap the shared engine twice.
    if(typeof window!=='undefined'&&window.PrimaryNative)return window.PrimaryNative;
    if(typeof AdEngine==='undefined'){
        if(typeof window!=='undefined'&&window.AdEngine){
            var AdEngine=window.AdEngine;
        }else{
            var fallbackAdEngine={
                sponsor:function(config){return(typeof IssueModel!=='undefined'&&IssueModel.candidate)?IssueModel.candidate(config&&config.sponsorId||(typeof gameData!=='undefined'&&gameData.candidate&&gameData.candidate.id)):null;},
                framePenalty:function(){return 0;},
                quote:function(config){return{ok:true,cost:Number(config&&config.budget||0)};},
                buy:function(config){return{ok:true,cost:Number(config&&config.budget||0),id:'ad-'+Date.now()};},
                counties:function(){return[];},
                deliver:function(){},
                processWeekly:function(){},
                refresh:function(){if(typeof Electorate!=='undefined'&&Electorate.recompute)Electorate.recompute();}
            };
            if(typeof window!=='undefined')window.AdEngine=fallbackAdEngine;
            var AdEngine=fallbackAdEngine;
        }
    }
    var dependencies={
        Utils:typeof Utils,IssueModel:typeof IssueModel,Electorate:typeof Electorate,
        Counties:typeof Counties,Persuasion:typeof Persuasion,
        AdEngine:typeof AdEngine!=='undefined'?typeof AdEngine:(typeof window!=='undefined'&&typeof window.AdEngine),
        Campaign:typeof Campaign,Polling:typeof Polling,PolicyManager:typeof PolicyManager,
        Debates:typeof Debates,Scandals:typeof Scandals,OppoResearchUI:typeof OppoResearchUI,
        Endorsers:typeof Endorsers,GroundOps:typeof GroundOps,MichiganModel:typeof MichiganModel,
        app:typeof app,PrimaryUI:typeof PrimaryUI,SimulationState:typeof SimulationState,
        PrimaryCampaign:typeof PrimaryCampaign,PrimaryIntegration:typeof PrimaryIntegration,
        shiftGroupSupport:typeof shiftGroupSupport,addCampaignGroupMomentum:typeof addCampaignGroupMomentum
    };
    var missing=Object.keys(dependencies).filter(function(name){return dependencies[name]==='undefined';});
    if(missing.length)throw new Error('The campaign could not start because '+missing.join(', ')+' did not load. Reload the preview to load the shared campaign files.');
    var advancing=false, initializing=false, aiActor=null, cache={}, opinionCache={}, voteOwners=new WeakMap(), lastRevision='', opener=null, focusedParty=null;
    function getFocusedParty(){return focusedParty||(state()&&state().playerParty)||'D';}
    function setFocusedParty(party){
        if(!state()||!state().parties[party])return;
        focusedParty=party;
        updatePartyPollSnapshot();
        var sel=el('primary-party-select');if(sel&&sel.value!==party)sel.value=party;
        if(typeof Campaign!=='undefined'){
            Campaign.colorMap();
            if(gameData.selectedCounty&&typeof Counties!=='undefined')Counties.selectCounty(gameData.selectedCounty);
            else if(gameData.selectedState)Campaign.clickState(gameData.selectedState);
            else Campaign.clickNational();
        }
    }
    function state(){return PrimaryCampaign.state();}
    function active(){return !!(state()&&state().nativeCampaign&&state().phase==='primary'&&!initializing);}
    function player(){return PrimaryCampaign.player();}
    function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
    function copy(v){return JSON.parse(JSON.stringify(v));}
    function clamp(n,a,b){return Math.max(a,Math.min(b,n));}
    function el(id){return document.getElementById(id);}
    function contest(code,party){var list=PrimaryCampaign.getContests(party||getFocusedParty()).filter(function(c){return c.state===code&&c.delegates;});return list.find(function(c){return c.status==='scheduled';})||list[list.length-1];}
    function invalidate(){cache={};opinionCache={};primaryModels={};lastRevision='';}
    function checkRevision(){var key=state().revision+'|'+Electorate.revision;if(key!==lastRevision){cache={};opinionCache={};primaryModels={};Electorate.overlayCache.clear();lastRevision=key;}}
    function live(code,party){
        party=party||getFocusedParty();
        checkRevision();var p=state(),key=(code||'USA')+'|'+party,c=code&&contest(code,party);
        if(c&&c.status==='complete'&&c.result){
            p.nativeClosedTruth=p.nativeClosedTruth||{};
            if(!p.nativeClosedTruth[key]){
                var finalTruth=copy(PrimaryCampaign.truth(party,code,c)),recorded=c.result.countyFirstPreferenceEstimates;
                // County results are recorded first-preference estimates. Keep
                // them fixed even after candidates withdraw or sign a deal.
                if(recorded){
                    Object.keys(recorded).forEach(function(id){
                        var before=finalTruth.counties[id]||{},after=recorded[id],cells=finalTruth.countyCells&&finalTruth.countyCells[id];
                        if(Array.isArray(cells))cells.forEach(function(cell){cell.votes=cell.votes.map(function(v,i){var candidate=p.parties[party].roster[i];return before[candidate]?v*(after[candidate]||0)/before[candidate]:0;});cell.total=cell.votes.reduce(function(n,v){return n+v;},0);});
                        finalTruth.counties[id]=copy(after);
                    });
                }
                if(c.result.shares){finalTruth.shares={};Object.keys(c.result.shares).forEach(function(id){finalTruth.shares[id]=c.result.shares[id]/100;});}
                finalTruth.undecided=0;p.nativeClosedTruth[key]=finalTruth;
            }
            return p.nativeClosedTruth[key];
        }
        return cache[key]||(cache[key]=PrimaryCampaign.truth(party,code||null,c||null));
    }
    function syncPlayer(){
        if(!active())return;
        var a=player(),before=a.funds;a.funds=gameData.funds;a.energy=gameData.energy;a.maxEnergy=gameData.maxEnergy;
        if(a.funds>before)a.raised+=a.funds-before;else a.spent+=before-a.funds;
        a.favorability=gameData.favorability;a.credibility=gameData.credibility;a.momentum=(gameData.campaignMomentum||0)*20;
        a.candidate=gameData.candidate;a.candidate.funds=a.funds;
        a.priorities=CampaignPriorities.forCandidate(a.candidate).slice();
        CORE_ISSUES.forEach(function(i){a.platform[i.id]=IssueModel.getPosition(a.candidate,i.id).id;});
        var g=gameData.groundOps;if(g)Object.keys(STATES).forEach(function(code){var o=PrimaryCampaign.org(a,code);o.offices=g.offices[code].count;o.staff=g.staffLevels[code];o.volunteers=g.volunteerPools[code];o.file=g.voterFiles[code].quality;o.contacts=g.contactHistory[code].cumulativeContacts;o.gotvUntil=g.gotv[code].activated?state().week+1:-1;o.captains=Math.max(o.captains,Math.floor(o.staff/5));});
        a.nativeEndorsers={relationships:copy(Endorsers.relationships),rallyCredits:copy(Endorsers.rallyCredits)};
        PrimaryCampaign.touch();invalidate();
    }
    function fromPrimary(){
        if(!active())return;var a=player();if(Number.isFinite(gameData.favorability)&&Math.abs(a.favorability-gameData.favorability)>0.0001)Favorability.change(a.id,(a.favorability-gameData.favorability)*200);gameData.candidate=a.candidate;gameData.playerCandidate=a.id;
        gameData.funds=a.funds;gameData.energy=a.energy;gameData.maxEnergy=a.maxEnergy;gameData.favorability=a.favorability;gameData.credibility=a.credibility;gameData.campaignMomentum=clamp(a.momentum/20,-1,1);
        gameData.campaignPriorities=gameData.campaignPriorities||{};gameData.campaignPriorities[a.id]=a.priorities.slice();Electorate.invalidate();
    }
    function installControls(){
        var old=el('primary-general-toolbar');if(old)old.remove();
        var node=el('campaign-nominations-button'),host=document.querySelector('#game-screen .hud-actions');if(!host)return;
        if(!node){node=document.createElement('button');node.id='campaign-nominations-button';node.className='hud-small-btn';node.title='Nominations, calendar and agreements';node.setAttribute('aria-label',node.title);node.innerHTML='<i class="fa-solid fa-landmark"></i>';node.onclick=function(){openNominations();};host.prepend(node);}
        node.hidden=!state();document.body.classList.toggle('native-primary-campaign',active());
        var option=document.querySelector('#campaign-mode-select option[value="ev"]');if(option)option.textContent=active()?'DELEGATES':'EV';
        var grassroots=el('grassroots-cand-select');
        if(grassroots){
            if(!grassroots.dataset.generalOptions)grassroots.dataset.generalOptions=grassroots.innerHTML;
            if(active()){var signature=state().playerParty+':'+state().parties[state().playerParty].roster.join(',');if(grassroots.dataset.primaryField!==signature){grassroots.innerHTML='<option value="player">PLAYER</option>'+PrimaryCampaign.roster(state().playerParty,true).map(function(a){return '<option value="'+esc(a.id)+'">'+esc(a.candidate.name)+'</option>';}).join('');grassroots.dataset.primaryField=signature;MichiganModel.activeGrassrootsViewCandidate='player';}}
            else if(grassroots.dataset.primaryField){grassroots.innerHTML=grassroots.dataset.generalOptions;delete grassroots.dataset.primaryField;MichiganModel.activeGrassrootsViewCandidate='player';}
        }
        var label=document.querySelector('.hud-ev-label');if(label&&!active())label.textContent='270 TO WIN';
        ['dem','rep'].forEach(function(side){var img=el('hud-'+side+'-vp-img');if(img)img.hidden=active();if(!active()&&el('hud-'+side+'-pres-img'))el('hud-'+side+'-pres-img').hidden=false;});
    }
    async function initialize(){
        var p=state(),a=player();initializing=true;
        try{
            PrimaryIntegration.syncTickets();gameData.candidate=a.candidate;gameData.playerCandidate=a.id;
            (a.party==='D'?gameData.demTicket:a.party==='R'?gameData.repTicket:gameData.thirdTickets[a.party]).pres=a.candidate;
            gameData.currentWeek=p.week;gameData.currentDate=new Date(p.date+'T12:00:00');gameData.campaignStart=PrimaryRules.startDate;
            gameData.funds=a.funds;gameData.energy=a.energy;gameData.maxEnergy=a.maxEnergy;gameData.favorability=a.favorability;gameData.credibility=a.credibility;gameData.campaignMomentum=a.momentum;
            gameData.liveGroups=copy(INTEREST_GROUPS);initializeInterestGroupSupport();gameData.issueSalience=copy(ISSUE_SALIENCE);
            initInterestGroupTurnout();if(typeof initCoalitionStatus==='function')initCoalitionStatus();
            GroundOps.initGroundOps();Object.keys(STATES).forEach(function(code){var o=PrimaryCampaign.org(a,code),g=gameData.groundOps;g.offices[code]={count:o.offices,quality:Math.min(1,o.offices*0.5),weekOpened:Array(o.offices).fill(p.week)};g.staffLevels[code]=o.staff;g.volunteerPools[code]=o.volunteers;g.voterFiles[code]={quality:o.file,coverage:0.1};g.contactHistory[code]={cumulativeContacts:o.contacts};});
            DigitalAds.initDigitalAds();Favorability.init();Endorsers.init();EndorserSystem.init();
            MichiganModel.grassrootsTotals={byCounty:{},byState:{},national:{}};MichiganModel.predictionsCache={};MichiganModel.initStateIntelligence();gameData.groupPolls={};
            gameData.campaignPriorities={};Object.values(p.actors).forEach(function(actor){gameData.campaignPriorities[actor.id]=actor.priorities.slice();actor.candidate.funds=actor.funds;});
            Electorate.initialize();p.nativeCampaign=true;p.nativeSimulationVersion=2;
            // Old primary saves may have prepaid actions. Refund them once;
            // from here on the original campaign queue owns player actions.
            p.pendingActions=p.pendingActions.filter(function(q){if(q.actorId!==a.id)return true;a.funds+=q.funds;a.energy=Math.min(a.maxEnergy,a.energy+q.energy);a.spent=Math.max(0,a.spent-q.funds);return false;});
            voteOwners=new WeakMap();Object.values(Counties.countyData).forEach(function(c){voteOwners.set(c.v,c);});
        }finally{initializing=false;}
        fromPrimary();PrimaryCampaign.rebuild();Electorate.invalidate();Electorate.recompute();publish();GroupPolling.publish(gameData.currentWeek);
        Screens.goTo('game-screen');Campaign.restoreStateActionGrid();PrimaryIntegration.renderMap();Campaign.clickNational();
        Utils.addLog('Primary campaign begins. Use the map and campaign actions to win your party’s nomination.');
    }
    function alignment(a,group,issue){var profile=Electorate.profile(group,issue);return profile.distribution.reduce(function(n,w,i){return n+w*IssueModel.agreement(issue,a.platform[issue],IssueModel.positions[i].id);},0);}
    var primaryModels={};
    function modelFor(party){
        checkRevision();var key=party+'|'+state().revision+'|'+Electorate.revision;
        if(primaryModels[key])return primaryModels[key];
        var model=Electorate.compileCandidates(PrimaryCampaign.roster(party).map(function(a){return a.candidate;}));
        Object.keys(model.groups).forEach(function(group){model.groups[group].scores=model.groups[group].scores.map(function(score,i){
            var candidate=model.candidates[i],effect=_getCandidateGroupEffectValue(candidate,group,'support'),momentum=gameData.campaignGroupMomentum&&gameData.campaignGroupMomentum[group];
            return score+(effect*0.025+(momentum&&momentum[candidate.id]||0)*0.035)/Electorate.tuning.policy;
        });});
        primaryModels[key]=model;return model;
    }
    function groupBase(county,group){
        var list=PrimaryCampaign.roster(state().playerParty),logs=list.map(function(a){return PrimaryCampaign.candidateScore(a,county,group,contest(county.s));}),max=Math.max.apply(null,logs);
        return Electorate.normalize(logs.map(function(v){return Math.exp(v-max);}));
    }
    function voterResponse(county,group,base,rate,party){
        party=party||state().playerParty;var model=modelFor(party);
        return Electorate.response(county,group,base,{primary:true,party:party,model:model,turnoutBase:rate,turnoutMultiplier:function(candidate,c,g,overlay){
            var a=PrimaryCampaign.actor(candidate.id),mult=turnoutMultiplier(a,c,g);
            if(a.id===state().playerId&&overlay){var baseline=BASE_TURNOUT_RATES[Electorate.rootGroup(g)]||0.6,current=gameData.interestGroupTurnout[Electorate.rootGroup(g)],racial=current===undefined?1:clamp(current/baseline,0.5,1.6);mult*=0.6+0.4*overlay.turnoutRatio/Math.max(0.1,racial);}
            return clamp(mult+_getCandidateGroupEffectValue(candidate,g,'turnout')*0.008,0.1,2);
        }});
    }
    function undecided(county){return live(county.s).undecided;}
    function campaignScore(a,c,group){
        checkRevision();var key=a.id+'|'+(c.fips||c.s),op=opinionCache[key]||(opinionCache[key]=Favorability.get(a.id,c));
        var value=op.net*0.007+(100-op.noOpinion-a.awareness*100)*0.003+(a.nativeSupport&&a.nativeSupport[c.fips]||0)*0.035;
        EndorserSystem.getEndorsersForCandidate(a.id).forEach(function(e){if(e.state==='National'||e.state===c.s)value+=(e.baseInfluence||0.05)*(e.targetGroupId?Electorate.share(c,e.targetGroupId):1);});
        return value;
    }
    function turnoutMultiplier(a,c,group){
        var isPlayer=a.id===state().playerId,parent=Electorate.rootGroup(group),base=BASE_TURNOUT_RATES[parent]||0.6,current=gameData.interestGroupTurnout[parent];
        var ratio=isPlayer&&current!==undefined?clamp(current/base,0.5,1.6):1;
        var field=isPlayer&&STATES[c.s]?(GroundOps.getPassiveOfficeBonus(c.s)||0)+(GroundOps.getGOTVLift(c.s)||0):0;
        var personal=c.partyMobilization&&(c.partyMobilization[a.id]||0),legacy=isPlayer&&c.partyMobilization&&(c.partyMobilization[a.party]||0);
        var boost=isPlayer&&c.turnout?((a.party==='D'||a.party==='R')?(c.turnout.player||1)-1:(c.turnout.thirdParty||0.7)/0.7-1):0;
        return clamp(ratio*(1+boost)+field*2+(personal||0)*2+(legacy||0)*2,0.25,1.8);
    }
    function shift(c,id,amount,silent){var a=PrimaryCampaign.actor(id)||player();if(!c||!a)return;a.nativeSupport=a.nativeSupport||{};a.nativeSupport[c.fips]=clamp((a.nativeSupport[c.fips]||0)+amount,-20,20);if(!silent){PrimaryCampaign.touch();invalidate();}}
    function pollMap(code,party){
        var p=state(),partyKey=party||getFocusedParty(),key=(code||'USA')+'|'+partyKey;
        if(p.nativePolls&&p.nativePolls[key])return p.nativePolls[key];
        if(partyKey===p.playerParty&&p.nativePolls&&p.nativePolls[code||'USA'])return p.nativePolls[code||'USA'];
        var out={},c=code&&contest(code,partyKey);
        if(c&&c.result&&c.result.shares){
            (p.parties[partyKey].roster||[]).forEach(function(id){out[id]=c.result.shares[id]||0;});
            out.Undecided=0;return out;
        }
        var rows=PrimaryCampaign.getPoll(partyKey,code||null);
        rows.forEach(function(r){out[r.id]=r.share*(1-(rows.undecided||0));});
        out.Undecided=(rows.undecided||0)*100;
        return out;
    }
    function updatePartyPollSnapshot(){
        var p=state();if(!p)return;
        var party=getFocusedParty(),snapshot={};
        [null].concat(Object.keys(STATES)).forEach(function(code){
            var key=code||'USA';snapshot[key]=pollMap(code,party);
        });
        gameData.frozenPollSnapshot=copy(snapshot);gameData.pollingAverages=copy(snapshot);
    }
    function publish(){
        if(!active())return;var p=state();p.nativePreviousPolls=p.nativePolls||{};p.nativePolls={};
        Object.keys(p.parties).forEach(function(party){
            [null].concat(Object.keys(STATES)).forEach(function(code){
                var out={},rows=PrimaryCampaign.getPoll(party,code),c=code&&contest(code,party),completed=c&&c.result;
                if(completed){p.parties[party].roster.forEach(function(id){out[id]=completed.shares[id]||0;});}
                else rows.forEach(function(r){out[r.id]=r.share*(1-(rows.undecided||0));});
                out.Undecided=completed?0:(rows.undecided||0)*100;
                p.nativePolls[(code||'USA')+'|'+party]=out;
                if(party===p.playerParty){
                    p.nativePolls[code||'USA']=out;
                    gameData.weeklyAverageHistory=gameData.weeklyAverageHistory||{};
                    var history=gameData.weeklyAverageHistory[code||'USA']||(gameData.weeklyAverageHistory[code||'USA']=[]);
                    history=history.filter(function(h){return h.week!==p.week;});
                    history.push({week:p.week,date:p.date,avg:copy(out)});
                    gameData.weeklyAverageHistory[code||'USA']=history;
                }
            });
        });
        updatePartyPollSnapshot();
        p.nativeCountyPolls={};var curParty=getFocusedParty();
        Object.keys(STATES).forEach(function(code){
            var truth=live(code,curParty),c=contest(code,curParty);
            Object.keys(truth.counties).forEach(function(id){
                var votes=c&&c.result&&c.result.countyFirstPreferenceEstimates&&c.result.countyFirstPreferenceEstimates[id]||truth.counties[id],total=Object.values(votes).reduce(function(n,v){return n+v;},0),shares={};
                Object.keys(votes).forEach(function(k){shares[k]=total?100*votes[k]/total:0;});p.nativeCountyPolls[id]=shares;
            });
        });
        p.nativeCountyBaseline=p.nativeCountyBaseline||copy(p.nativeCountyPolls);
        MichiganModel.predictionsCache={};
    }
    function projectStateDelegates(c, pcts) {
        if(!c || !c.pools || !c.pools.length) return {};
        var proj = {};
        var totalDel = c.delegates || c.pools.reduce(function(sum, p){ return sum + (p.delegates || 0); }, 0);
        if(totalDel <= 0) return {};
        var ids = Object.keys(pcts || {}).filter(function(id){ return (pcts[id] || 0) > 0; });
        if(!ids.length) return {};
        c.pools.forEach(function(pool){
            var pv = {};
            ids.forEach(function(id){ pv[id] = Math.max(1, Math.round((pcts[id] || 0) * 100)); });
            var alloc = PrimaryRules.allocate(pv, pool, c.party, ids);
            if(alloc && alloc.delegates){
                Object.keys(alloc.delegates).forEach(function(id){
                    proj[id] = (proj[id] || 0) + alloc.delegates[id];
                });
            }
        });
        return proj;
    }

    function rankedHTML(pcts,previous){
        var party=getFocusedParty(),ps=state().parties[party]||state().parties[state().playerParty];
        var curState = (gameData.selectedCounty && Counties.countyData[Counties.normalizeFips(gameData.selectedCounty)]) ? Counties.countyData[Counties.normalizeFips(gameData.selectedCounty)].s : gameData.selectedState;
        var c = curState ? contest(curState, party) : null;
        var projected = (c && c.status === 'scheduled') ? projectStateDelegates(c, pcts) : null;

        var html = '<div class="cpl-list">'+ps.roster.map(PrimaryCampaign.actor).filter(Boolean).sort(function(a,b){return (pcts[b.id]||0)-(pcts[a.id]||0);}).map(function(a){
            var share=pcts[a.id]||0,delta=previous&&previous[a.id]!==undefined?share-previous[a.id]:null;
            var delText = (ps.delegates[a.id]||0)+' delegates';
            if(c){
                if(c.status === 'complete' && c.result && c.result.delegates){
                    delText = (c.result.delegates[a.id] || 0) + ' delegates';
                } else if(c.status === 'scheduled' && projected){
                    delText = (projected[a.id] || 0) + ' delegates';
                }
            }
            return '<div class="cpl-row"><img class="cpl-avatar" src="'+esc(a.candidate.img||'images/scenario.jpg')+'" alt="" style="border-color:'+a.color+'"><div class="cpl-info"><div class="cpl-name">'+esc(a.candidate.name)+'</div><div class="cpl-bar-wrap"><div class="cpl-bar" style="width:'+share.toFixed(1)+'%;background:'+a.color+'"></div></div><small>'+esc(a.status)+' · '+delText+'</small></div><div class="cpl-pct-group"><span class="cpl-pct" style="color:'+a.color+'">'+share.toFixed(1)+'%</span><span class="cpl-delta-neu">'+(delta===null?'—':(delta>=0?'+':'')+delta.toFixed(1))+'</span></div></div>';
        }).join('')+'</div>';

        // When a primary has completed in the viewed state, include election night style popular vote results table
        if(c && c.status === 'complete' && c.result && c.result.votes){
            var totalContestVotes = Object.values(c.result.votes).reduce(function(sum, v){ return sum + v; }, 0);
            html += '<div class="elec-cpl-list" style="margin-top: 15px; border-top: 1px solid #444; padding-top: 10px;">';
            html += '<div style="font-size: 0.75rem; text-transform: uppercase; color: #ffaa00; font-weight: bold; margin-bottom: 8px;"><i class="fa-solid fa-square-poll-vertical"></i> Official ' + esc(c.name || curState) + ' Vote Results</div>';
            var sortedCandidates = Object.keys(c.result.votes).map(PrimaryCampaign.actor).filter(Boolean).sort(function(x, y){
                return (c.result.votes[y.id] || 0) - (c.result.votes[x.id] || 0);
            });
            sortedCandidates.forEach(function(a){
                var v = c.result.votes[a.id] || 0;
                var pct = totalContestVotes > 0 ? (v / totalContestVotes) * 100 : 0;
                html += '<div class="elec-cpl-row">' +
                    '<img class="elec-cpl-avatar" src="' + esc(a.candidate.img || 'images/scenario.jpg') + '" alt="" style="border-color:' + a.color + ';">' +
                    '<div class="elec-cpl-info">' +
                        '<div class="elec-cpl-name">' + esc(a.candidate.name) + '</div>' +
                        '<div class="elec-cpl-bar-wrap"><div class="elec-cpl-bar" style="width:' + Math.max(0.5, pct).toFixed(1) + '%;background:' + a.color + ';"></div></div>' +
                    '</div>' +
                    '<div class="elec-cpl-right">' +
                        '<span class="elec-cpl-pct" style="color:' + a.color + ';">' + pct.toFixed(1) + '%</span>' +
                        '<span class="elec-cpl-votes">' + Math.round(v).toLocaleString() + ' votes</span>' +
                    '</div>' +
                '</div>';
            });
            html += '<div class="elec-reporting" style="margin-top: 8px; text-align: center; color: #aaa; font-size: 0.8rem;">Total Votes: ' + Math.round(totalContestVotes).toLocaleString() + '</div>';
            html += '</div>';
        }

        return html;
    }
    function colorFor(shares){
        var ids=Object.keys(shares||{}).filter(function(id){return !!PrimaryCampaign.actor(id);}).sort(function(a,b){return (shares[b]||0)-(shares[a]||0);}),a=PrimaryCampaign.actor(ids[0]);
        if(!a)return '#ffffff';
        var margin=(shares[ids[0]]||0)-(shares[ids[1]]||0);
        var t=clamp(0.08+(margin/22)*0.92,0.08,1.0);
        return Campaign.blendHexColors('#ffffff',a.color,t);
    }
    function updateScore(){
        var p=state(),party=getFocusedParty(),ps=p.parties[party]||p.parties[p.playerParty],leaders=ps.roster.map(PrimaryCampaign.actor).filter(Boolean).sort(function(a,b){return (ps.delegates[b.id]||0)-(ps.delegates[a.id]||0)||(pollMap(null,party)[b.id]||0)-(pollMap(null,party)[a.id]||0);});
        ['dem','rep'].forEach(function(side,i){var a=leaders[i];el('hud-'+side+'-pres-name').textContent=a?a.candidate.name:'Unallocated';el('hud-'+side+'-vp-name').textContent=a?'DELEGATES':'';el('score-'+side).textContent=a?ps.delegates[a.id]||0:0;if(a)el('hud-'+side+'-pres-img').src=a.candidate.img||'images/scenario.jpg';el('hud-'+side+'-pres-img').hidden=!a;el('hud-'+side+'-vp-img').hidden=true;});
        document.querySelector('.hud-ev-label').textContent=ps.majority+' TO NOMINATE';
        var offset=0,stops=[];leaders.forEach(function(a){var width=(ps.delegates[a.id]||0)/Math.max(1,ps.totalDelegates)*100;stops.push(a.color+' '+offset+'% '+(offset+width)+'%');offset+=width;});stops.push('#333 '+offset+'% 100%');el('ev-bar').style.background='linear-gradient(to right,'+stops.join(',')+')';
    }
    function stateInfo(code,party){
        var c=contest(code,party||getFocusedParty());if(!c)return 'No binding primary';return c.delegates+' DELEGATES · '+c.type.toUpperCase()+' · '+c.date+(c.status==='complete'?' · FINAL · RESULTS LOCKED':'');
    }
    function refresh(){if(!active())return;invalidate();Campaign.updateHUD();if(gameData.selectedCounty)Counties.selectCounty(gameData.selectedCounty);else if(gameData.selectedState)Campaign.clickState(gameData.selectedState);else Campaign.clickNational();renderNominations();}
    async function nextWeek(){
        if(advancing||!state()||state().ended)return;var p=state(),ps=p.parties[p.playerParty];
        if(ps.convention&&ps.convention.pending){openNominations('convention');return;}
        if(PrimaryRules.datePlus(p.date,7)>='2028-11-07'){Utils.showToast('Finish your nomination and ticket before beginning the general election.');openNominations('convention');return;}
        if(!p.nativeCampaign)await initialize();advancing=true;var nativeRandom=Math.random;
        try{
            syncPlayer();Math.random=PrimaryCampaign.random;var beforeVotes={};Object.keys(Counties.countyData).forEach(function(id){beforeVotes[id]=Object.assign({},Counties.countyData[id].v);});
            // This is the original weekly transition, including the same paid
            // action queue, advertising deliveries, news, research and upkeep.
            PrimaryIntegration.advanceLegacyWeek();
            Object.keys(beforeVotes).forEach(function(id){var c=Counties.countyData[id];Object.keys(p.parties).forEach(function(party){var delta=(c.v[party]||0)-(beforeVotes[id][party]||0),a=party===p.playerParty?player():PrimaryCampaign.actor(p.parties[party].nomineeId||p.parties[party].roster[0]);if(a&&Math.abs(delta)>0.00001)shift(c,a.id,delta,true);});Object.assign(c.v,beforeVotes[id]);});
            PrimaryCampaign.touch();invalidate();
            syncPlayer();PrimaryCampaign.rebuild();
            if(gameData.debatePrepBuff)player().debatePrep=1;
            var before=p.debates.length,result=await PrimaryCampaign.advance(PrimaryIntegration.iso(gameData.currentDate),true);
            if(!result.ok){Utils.showToast(result.error);return;}
            if(p.debates.length>before)gameData.debatePrepBuff=false;
            EndorserSystem.processRetractConditions();fromPrimary();Electorate.invalidate();Electorate.recompute();publish();Object.keys(gameData.groupPolls||{}).forEach(function(id){gameData.groupPolls[id]=gameData.groupPolls[id].filter(function(h){return h.week!==gameData.currentWeek;});});GroupPolling.publish(gameData.currentWeek);refresh();
            if(ps.convention&&ps.convention.pending||p.defeat)openNominations('convention');
            var saved=await PrimaryStorage.save();if(!saved.ok)Utils.showToast(saved.error);
        }finally{Math.random=nativeRandom;advancing=false;}
    }
    function planActor(a,code,options){
        var p=state(),o=PrimaryCampaign.org(a,code),issue=options.issueId||'economy';aiActor=a;
        try{
            a.candidate.funds=a.funds;
            if(a.funds<4){a.funds+=2+(a.candidate.charisma||1);a.raised+=2+(a.candidate.charisma||1);a.energy=Math.max(0,a.energy-2);}
            if(!o.offices&&a.funds>6){a.funds-=1.8;a.spent+=1.8;o.offices++;o.volunteers+=10;}
            if(o.offices&&o.staff<10&&a.funds>3){a.funds-=0.9;a.spent+=0.9;o.staff+=10;}
            if(a.energy>0){Electorate.expose({stateCode:code,sponsorId:a.id,issueId:issue,type:'issue',exposure:1.3});Favorability.change(a.id,0.5,{stateCode:code,recognition:0.3});a.energy--;o.contacts+=o.staff*120;}
            a.candidate.funds=a.funds;
            var rivals=PrimaryCampaign.roster(a.party).filter(function(b){return b.id!==a.id;}),target=rivals.sort(function(x,y){return (p.parties[a.party].delegates[y.id]||0)-(p.parties[a.party].delegates[x.id]||0);})[0];
            var pact=target&&PrimaryNegotiations.activeContracts().some(function(c){return c.type==='nonaggression'&&[c.fromId,c.toId].includes(a.id)&&[c.fromId,c.toId].includes(target.id);});
            if(a.funds>5){var type=target&&!pact&&a.badWeeks>0?'attack':'issue',ad=AdEngine.buy({channel:'digital',type:type,stateCode:code,sponsorId:a.id,targetId:target&&target.id,issueId:issue,budget:Math.min(2,a.funds*0.1),intensity:1,durationWeeks:2},{batch:true});if(ad.ok){a.funds=a.candidate.funds;a.spent+=ad.cost;}}
            if(contest(code,a.party)&&contest(code,a.party).type.indexOf('caucus')>=0)o.captains=Math.max(o.captains,Math.floor(o.staff/5));
            if(p.week%4===2)a.debatePrep=1;
            if(p.week%5===0){var available=Endorsers.db.national.concat(Endorsers.db.states[code]||[]).filter(function(e){return !p.endorserAssignments[e.id]&&!PrimaryCampaign.roster(a.party).some(function(r){return e.name.indexOf(r.candidate.name)===0;});}).sort(function(x,y){return (y.baseLean[a.party]||0)-(x.baseLean[a.party]||0);}),e=available[0];if(e&&(e.baseLean[a.party]||0)>30&&PrimaryCampaign.random()<0.25){p.endorserAssignments[e.id]=a.id;a.endorsements.push({id:e.id,name:e.name,state:e.id.indexOf('n_')===0?'National':code,strength:Endorsers.getStars(e)*0.02});PrimaryCampaign.log(e.name+' endorsed '+a.candidate.name+'.','endorsement');}}
            if(!['D','R'].includes(a.party)){var need=Object.keys(STATES).find(function(s){return a.ballotAccess[s]<100;});if(need&&a.funds>=0.5){a.funds-=0.5;a.ballotAccess[need]=Math.min(100,a.ballotAccess[need]+15);}}
        }finally{aiActor=null;Electorate.invalidate();PrimaryCampaign.touch();}
    }
    async function enterGeneral(){
        if((gameData.pendingActions||[]).length)return {ok:false,error:'Advance the week to resolve your queued campaign actions first.'};
        syncPlayer();var p=state(),messages={},a=player();
        Object.keys(Counties.countyData).forEach(function(id){var c=Counties.countyData[id];messages[id]={issueMessages:copy(c.issueMessages||{}),issueAttention:copy(c.issueAttention||{}),partyMobilization:copy(c.partyMobilization||{})};});
        p.phase='general';p.handoffDate=p.date;gameData.generalStartDate=p.date;PrimaryIntegration.syncTickets();gameData.candidate=a.candidate;gameData.vp=p.parties[a.party].vpCandidate;
        // Research already uncovered remains attached to its candidate. Future
        // research gets a general-election target selected in the same modal.
        Scandals.activeScandals.forEach(function(s){var target=PrimaryCampaign.actor(s.targetParty);if(target){s.targetId=target.id;s.targetParty=target.party;}});Scandals.pendingReveals=Scandals.pendingReveals.filter(function(s){var target=PrimaryCampaign.actor(s.targetParty);if(!target)return true;if(p.parties[target.party].nomineeId!==target.id)return false;s.targetParty=target.party;return true;});gameData.oppoResearchAllocations=null;
        Object.keys(gameData.groundOps.gotv).forEach(function(code){gameData.groundOps.gotv[code].activated=false;});
        // Preserve campaign resources and all native systems. Only rebuild the
        // electorate for the actual general-election tickets.
        Object.keys(messages).forEach(function(id){var c=Counties.countyData[id];Object.keys(p.parties).forEach(function(party){var ps=p.parties[party],nominee=PrimaryCampaign.actor(ps.nomineeId);if(!nominee)return;messages[id].partyMobilization[party]=(messages[id].partyMobilization[party]||0)+(messages[id].partyMobilization[nominee.id]||0);if(nominee.nativeSupport&&nominee.nativeSupport[id])oldShareShift(c.v,party,nominee.nativeSupport[id]*0.25);});});
        Electorate.initialize();Object.keys(messages).forEach(function(id){Object.assign(Counties.countyData[id],messages[id]);});Electorate.invalidate();Electorate.recompute();
        p.nativePollingHistory=copy(gameData.weeklyAverageHistory||{});
        gameData.groupPolls={};gameData.pollingHistory={};gameData.pollingAverages={};gameData.weeklyAverageHistory={};
        ['USA'].concat(Object.keys(STATES)).forEach(function(code){gameData.pollingHistory[code]=[];gameData.weeklyAverageHistory[code]=[];if(STATES[code])Counties.updateStateFromCounties(code);});
        // Retain the shared week index for active ads and field upkeep without
        // inventing general-election polls before the nomination handoff.
        gameData.pollingGeneratedWeeks=Array.from({length:gameData.currentWeek+1},function(_,i){return i-1;});
        Polling.generatePollsForWeek(gameData.currentWeek,false);Polling.calculateAveragesForWeek(gameData.currentWeek);gameData.pollingGeneratedWeeks.push(gameData.currentWeek);
        GroupPolling.publish(gameData.currentWeek);Campaign.captureFrozenSnapshot();
        closeNominations();Screens.goTo('game-screen');installControls();Campaign.updateHUD();Campaign.colorMap();if(gameData.selectedState)Campaign.clickState(gameData.selectedState);else Campaign.clickNational();
        PrimaryCampaign.log('The nomination campaign moves into the general election with its existing funds, advertising, field offices, endorsers and policy commitments.','handoff');await PrimaryStorage.save();return {ok:true};
    }
    function renderNominations(){
        var modal=el('primary-nominations-modal');if(!modal||modal.classList.contains('hidden')||!state())return;
        var p=state(),ui=PrimaryUI;if(!p.parties[ui.race])ui.race=p.playerParty;ui.selectedState=ui.selectedState||gameData.selectedState||'IA';
        var tab=ui.tab,body=tab==='calendar'?ui.calendar():tab==='negotiations'?ui.negotiations():tab==='convention'?ui.convention():tab==='map'?ui.stateDetail():ui.polls();
        var defeat=p.defeat?'<p class="ov-note">'+(p.defeat.winnerId?'Your nomination campaign has ended. Continue as '+esc(PrimaryCampaign.actor(p.defeat.winnerId).candidate.name)+'. <button class="ov-button" data-primary-action="continue-nominee">Continue as nominee</button>':'Your campaign is suspended. Advance the shared calendar to resolve the nomination.')+'</p>':'';
        el('primary-native-body').innerHTML='<div class="ov-toolbar"><label>Primary<select id="primary-native-party">'+Object.keys(p.parties).map(function(party){return '<option value="'+party+'"'+(party===ui.race?' selected':'')+'>'+esc(PARTIES[party].name)+'</option>';}).join('')+'</select></label><nav class="ov-tabs">'+[['polls','Delegates'],['calendar','Calendar'],['negotiations','Agreements'],['convention','Convention']].map(function(t){return '<button class="ov-tab" data-primary-action="tab" data-value="'+t[0]+'" aria-pressed="'+(tab===t[0])+'">'+t[1]+'</button>';}).join('')+'</nav></div>'+defeat+body+'<details class="native-primary-save"><summary>Campaign save</summary><button class="ov-button" data-primary-action="save">Save campaign</button> <button class="ov-button" data-primary-action="export">Export save</button></details>';
    }
    function openNominations(tab){
        if(!state())return;if(active())syncPlayer();var modal=el('primary-nominations-modal');
        if(!modal){modal=document.createElement('div');modal.id='primary-nominations-modal';modal.className='ov-overlay hidden';modal.innerHTML='<section class="ov-dialog ov-dialog-wide" role="dialog" aria-modal="true" aria-labelledby="primary-native-title"><header class="ov-dialog-header"><div><span class="ov-eyebrow">DECISION 2028 / CAMPAIGN DESK</span><h2 id="primary-native-title">Nominations</h2></div><button class="ov-button ov-close" id="primary-native-close" aria-label="Close nominations">×</button></header><div class="ov-dialog-body" id="primary-native-body"></div></section>';document.body.appendChild(modal);el('primary-native-close').onclick=closeNominations;modal.onclick=function(e){if(e.target===modal)closeNominations();};}
        opener=document.activeElement;PrimaryUI.tab=tab||'polls';PrimaryUI.race=state().playerParty;modal.classList.remove('hidden');renderNominations();el('primary-native-close').focus();
    }
    function closeNominations(){var modal=el('primary-nominations-modal');if(modal)modal.classList.add('hidden');if(opener&&opener.isConnected)opener.focus();}
    async function showCampaign(){
        if(!state())return;
        if(state().phase==='primary'&&!state().nativeCampaign)await initialize();
        if(active()&&state().nativeSimulationVersion!==2){state().nativeSimulationVersion=2;Electorate.invalidate();Electorate.recompute();publish();}
        closeNominations();Screens.goTo('game-screen');installControls();
        if(!el('us-map-svg'))PrimaryIntegration.renderMap();
        Campaign.updateHUD();Campaign.colorMap();
        if(gameData.selectedCounty)Counties.selectCounty(gameData.selectedCounty);
        else if(gameData.selectedState)Campaign.clickState(gameData.selectedState);
        else Campaign.clickNational();
    }
    document.addEventListener('change',function(e){if(e.target.id==='primary-native-party'){PrimaryUI.race=e.target.value;renderNominations();}});
    document.addEventListener('click',function(e){var b=e.target.closest('[data-primary-action="campaign-here"]');if(!b||!active())return;var code=b.dataset.value;if(STATES[code]){e.preventDefault();e.stopImmediatePropagation();closeNominations();Screens.goTo('game-screen');Campaign.clickState(code);}},true);
    document.addEventListener('keydown',function(e){var modal=el('primary-nominations-modal');if(!modal||modal.classList.contains('hidden'))return;if(e.key==='Escape'){e.preventDefault();closeNominations();}if(e.key==='Tab'){var nodes=Array.from(modal.querySelectorAll('button,select,input,summary,a[href]')).filter(function(n){return !n.disabled&&n.getClientRects().length;}),first=nodes[0],last=nodes[nodes.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
    // Candidate identities remain separate even when every entrant has the
    // same party. Existing ads, opinion and issue screens already use IDs.
    var oldCandidates=Utils.getActiveCandidates;
    Utils.getActiveCandidates=function(){if(!active())return oldCandidates.apply(this,arguments);return PrimaryCampaign.roster(aiActor?aiActor.party:state().playerParty).map(function(a){return {party:a.party,cand:a.candidate};});};
    var oldCandidate=IssueModel.candidate;IssueModel.candidate=function(value){var id=typeof value==='object'&&value?value.id:value,a=state()&&PrimaryCampaign.actor(id);return a?a.candidate:oldCandidate.apply(this,arguments);};
    var oldInvalidate=Electorate.invalidate;Electorate.invalidate=function(){var r=oldInvalidate.apply(this,arguments);invalidate();if(active())PrimaryCampaign.touch();return r;};
    var oldCountyResult=Electorate.countyResult;Electorate.countyResult=function(c){if(!active())return oldCountyResult.apply(this,arguments);var t=live(c.s),votes=t.counties[c.fips]||{},total=Object.values(votes).reduce(function(n,v){return n+v;},0),registered=Number(c.regVoters)||Number(c.p)||0;return {byParty:votes,total:total,registered:registered,rate:registered?total/registered:0,cells:t.countyCells[c.fips]||[]};};
    var oldUpdateState=Counties.updateStateFromCounties;Counties.updateStateFromCounties=function(code){if(!active())return oldUpdateState.apply(this,arguments);var shares=pollMap(code),ids=Object.keys(shares).filter(function(id){return !!PrimaryCampaign.actor(id);}).sort(function(a,b){return shares[b]-shares[a];}),s=gameData.states[code];if(s){s.margin=(shares[ids[0]]||0)-(shares[ids[1]]||0);s.marginParty=ids[0];}};
    ['getNationalPollingByParty','getTrueNationalPollingByParty','getStatePollingByParty','getTrueStatePollingByParty','getCountyPollingByParty'].forEach(function(name){var old=Utils[name];Utils[name]=function(arg){if(!active())return old.apply(this,arguments);if(name==='getCountyPollingByParty'){var prediction=MichiganModel.getCountyPrediction(arg);return prediction?prediction.predictedShares:state().nativeCountyPolls&&state().nativeCountyPolls[arg.fips]||{};}return pollMap(name.indexOf('State')>=0?arg:null);};});
    var oldRanked=Utils.buildCandidateRankedListHTML;Utils.buildCandidateRankedListHTML=function(pcts,previous){return active()?rankedHTML(pcts||{},previous):oldRanked.apply(this,arguments);};
    var oldPartyColor=Utils.getPartyColor;Utils.getPartyColor=function(id){var a=active()&&PrimaryCampaign.actor(id);return a?a.color:oldPartyColor.apply(this,arguments);};
    var oldShiftGroup=shiftGroupSupport;
    shiftGroupSupport=function(group,id,amount){if(!active())return oldShiftGroup.apply(this,arguments);var a=PrimaryCampaign.actor(id)||(id===state().playerParty?player():null);if(!a)return;initCampaignGroupMomentum();var row=gameData.campaignGroupMomentum[group]||(gameData.campaignGroupMomentum[group]={});row[a.id]=clamp((row[a.id]||0)+amount,-25,25);Electorate.invalidate();};
    var oldGroupMomentum=addCampaignGroupMomentum;
    addCampaignGroupMomentum=function(group,id,amount){if(!active())return oldGroupMomentum.apply(this,arguments);shiftGroupSupport(group,id,amount);};
    var oldShareShift=Counties.applyVoteShareShift;Counties.applyVoteShareShift=function(votes,party,amount){if(!active())return oldShareShift.apply(this,arguments);var c=voteOwners.get(votes);if(!c){c=Object.values(Counties.countyData).find(function(row){return row.v===votes;});if(c)voteOwners.set(votes,c);}var a=PrimaryCampaign.actor(party)||aiActor||(party===state().playerParty?player():null);if(c&&a)shift(c,a.id,amount);};
    var oldMargin=Persuasion.applyMarginShift;Persuasion.applyMarginShift=function(c,delta){if(!active())return oldMargin.apply(this,arguments);shift(c,player().id,delta);};
    var oldRefreshAd=AdEngine.refresh;AdEngine.refresh=function(){if(aiActor){Electorate.invalidate();return;}var r=oldRefreshAd.apply(this,arguments);if(active())syncPlayer();return r;};
    var oldDeliver=AdEngine.deliver;AdEngine.deliver=function(ad,week){if(!active())return oldDeliver.apply(this,arguments);var previous=aiActor;aiActor=PrimaryCampaign.actor(ad.sponsorId);try{return oldDeliver.apply(this,arguments);}finally{aiActor=previous;}};
    var oldBuy=AdEngine.buy;AdEngine.buy=function(config){var r=oldBuy.apply(this,arguments);if(active()&&r.ok&&config.type==='attack')PrimaryNegotiations.recordAttack(config.sponsorId||player().id,config.targetId);return r;};
    var oldScore=Campaign.updateScore;Campaign.updateScore=function(){if(active())return updateScore();return oldScore.apply(this,arguments);};
    var oldHUD=Campaign.updateHUD;Campaign.updateHUD=function(){var r=oldHUD.apply(this,arguments);installControls();if(active()){updateScore();var n=el('hud-national-poll');if(n)n.textContent=(pollMap()[player().id]||0).toFixed(1)+'%';}return r;};
    var oldColor=Campaign.colorMap;Campaign.colorMap=function(){if(!active())return oldColor.apply(this,arguments);if(this.mapMode!=='margin'&&this.mapMode!=='ev')return oldColor.apply(this,arguments);var focused=getFocusedParty(),max=Math.max.apply(null,PrimaryCampaign.getContests(focused).map(function(c){return c.delegates;}));Object.keys(STATES).forEach(function(code){var path=el(code),c=contest(code,focused);if(!path)return;path.style.fill=Campaign.mapMode==='ev'?Campaign.getGoldScaleColor((c?c.delegates:0)/Math.max(1,max)):colorFor(c&&c.result?c.result.shares:pollMap(code,focused));});updateScore();};
    var oldStateClick=Campaign.clickState;Campaign.clickState=function(code){var r=oldStateClick.apply(this,arguments);if(active()){gameData.selectedCounty=null;var focused=getFocusedParty(),c=contest(code,focused);el('sp-ev').textContent=(c?c.delegates:0)+' Delegates';el('sp-districts').classList.add('hidden');}return r;};
    var oldNationalClick=Campaign.clickNational;Campaign.clickNational=function(){var r=oldNationalClick.apply(this,arguments);if(active()){gameData.selectedCounty=null;var focused=getFocusedParty(),ps=state().parties[focused]||state().parties[state().playerParty];el('sp-name').textContent=PARTIES[focused].name+' Primary';el('sp-ev').textContent=(ps?ps.majority:0)+' to Nominate';}return r;};
    var oldTooltip=Campaign.showTooltip;Campaign.showTooltip=function(e,code){if(!active())return oldTooltip.apply(this,arguments);var focused=getFocusedParty(),tip=el('map-tooltip'),shares=pollMap(code,focused);tip.style.display='block';tip.style.left=(e.clientX+15)+'px';tip.style.top=(e.clientY+15)+'px';tip.innerHTML='<strong>'+esc(STATES[code].name)+' ('+focused+' Primary)</strong><br>'+esc(stateInfo(code,focused))+'<div class="tooltip-details">'+PrimaryCampaign.roster(focused,true).sort(function(a,b){return (shares[b.id]||0)-(shares[a.id]||0);}).slice(0,4).map(function(a){return '<div style="color:'+a.color+'">'+esc(a.candidate.name)+' · '+(shares[a.id]||0).toFixed(1)+'%</div>';}).join('')+'</div>';};
    var oldCountyModeColor=Counties.getCountyMapModeColor;
    Counties.getCountyMapModeColor=function(c){if(active()&&(Campaign.mapMode==='margin'||Campaign.mapMode==='ev'))return colorFor(Utils.getCountyPollingByParty(c));return oldCountyModeColor.apply(this,arguments);};
    var oldCountyColor=Counties.colorCountyMap;Counties.colorCountyMap=function(){if(!active())return oldCountyColor.apply(this,arguments);var targetState=this.currentState;Object.keys(this.countyData).forEach(function(id){var c=Counties.countyData[id];if(targetState&&c.s!==targetState)return;var path=el('c'+id.padStart(5,'0'));if(!path)return;path.style.fill=Campaign.mapMode==='margin'||Campaign.mapMode==='ev'?colorFor(Utils.getCountyPollingByParty(c)):Counties.getCountyMapModeColor(c);});};
    var oldSelectCounty=Counties.selectCounty;Counties.selectCounty=function(id){var r=oldSelectCounty.apply(this,arguments);if(active()){var c=this.countyData[this.normalizeFips(id)];if(c){var focused=getFocusedParty(),race=contest(c.s,focused);el('sp-ev').textContent=(race?race.delegates:0)+' Delegates';el('sp-districts').classList.add('hidden');}}return r;};
    var oldCapture=Campaign.captureFrozenSnapshot;Campaign.captureFrozenSnapshot=function(){if(active()){gameData.frozenPollSnapshot=copy(state().nativePolls||{});return;}return oldCapture.apply(this,arguments);};
    var oldWeekDate=Polling._weekStartDate;Polling._weekStartDate=function(week){return active()?PrimaryRules.datePlus(PrimaryRules.startDate,Number(week||0)*7):oldWeekDate.apply(this,arguments);};
    var oldLastName=Utils.getCandidateLastName;Utils.getCandidateLastName=function(id){var a=active()&&PrimaryCampaign.actor(id);return a?a.candidate.name:oldLastName.apply(this,arguments);};
    var oldOpponent=Campaign.opponentTurn;Campaign.opponentTurn=function(){if(active())return;return oldOpponent.apply(this,arguments);};
    ['_applySpoilerEffect','processUndecidedVoters'].forEach(function(name){var old=Campaign[name];Campaign[name]=function(){if(active())return;return old.apply(this,arguments);};});
    var oldAIPolicy=PolicyManager.processAIPolicies;PolicyManager.processAIPolicies=function(){if(active())return;return oldAIPolicy.apply(this,arguments);};
    var oldDebates=Debates.checkDebateWeek;Debates.checkDebateWeek=function(){if(active())return;return oldDebates.apply(this,arguments);};
    var oldMomentum=Campaign.updateCampaignMomentum;Campaign.updateCampaignMomentum=function(){if(!active())return oldMomentum.apply(this,arguments);Persuasion.processWeeklyDecay();var poll=pollMap(),own=poll[player().id]||0,rival=Math.max.apply(null,Object.keys(poll).filter(function(id){return id!==player().id&&id!=='Undecided';}).map(function(id){return poll[id];}).concat(0));gameData.campaignMomentum=clamp((gameData.campaignMomentum||0)*MOMENTUM_CONSTANTS.DECAY+(own>rival?MOMENTUM_CONSTANTS.WEEKLY_GAIN:-MOMENTUM_CONSTANTS.WEEKLY_LOSS),-1,1);};
    var oldScandalTarget=Scandals.canTargetOpponent;Scandals.canTargetOpponent=function(id){if(active()){var a=PrimaryCampaign.actor(id);if(!a||a.id===player().id||a.party!==player().party||a.status==='suspended')return false;}return oldScandalTarget.apply(this,arguments);};
    var oldResearchWeek=Scandals.processWeeklyAllocations;Scandals.processWeeklyAllocations=function(){if(active()&&gameData.oppoResearchAllocations&&!this.canTargetOpponent(gameData.oppoResearchAllocations.targetParty))return;return oldResearchWeek.apply(this,arguments);};
    // Reuse the existing research modal and its costs/categories; targets are
    // candidates instead of a single opposing party ticket.
    var oldOpponentCandidate=Scandals.getOpponentCandidate;Scandals.getOpponentCandidate=function(id){if(active()){var a=PrimaryCampaign.actor(id);return a?a.candidate:null;}return oldOpponentCandidate.apply(this,arguments);};
    var oldResearchRender=OppoResearchUI.render;OppoResearchUI.render=function(){if(active()){var rivals=PrimaryCampaign.roster(state().playerParty).filter(function(a){return a.id!==player().id;});if(!rivals.some(function(a){return a.id===OppoResearchUI.tempTargetParty;}))this.tempTargetParty=rivals[0]&&rivals[0].id;}var r=oldResearchRender.apply(this,arguments);if(active()){var select=document.createElement('select');select.className='campaign-mode-select';select.setAttribute('aria-label','Primary research target');select.innerHTML=PrimaryCampaign.roster(state().playerParty).filter(function(a){return a.id!==player().id;}).map(function(a){return '<option value="'+esc(a.id)+'"'+(a.id===OppoResearchUI.tempTargetParty?' selected':'')+'>'+esc(a.candidate.name)+'</option>';}).join('');select.onchange=function(){OppoResearchUI.setTargetParty(this.value);};el('oppo-target-section').appendChild(select);}return r;};
    var oldScandal=Scandals.applyScandalEffects;Scandals.applyScandalEffects=function(s){if(!active())return oldScandal.apply(this,arguments);var a=PrimaryCampaign.actor(s.targetParty);if(!a)return;Favorability.change(a.id,s.favPenalty*200,{recognition:1});a.scandals.push({id:'native-'+state().week+'-'+a.scandals.length,label:s.description,severity:Math.abs(s.favPenalty)*4,remaining:s.weeksRemaining});PrimaryNegotiations.recordAttack(player().id,a.id);PrimaryCampaign.touch();};
    var oldMeet=Endorsers.meetEndorser;Endorsers.meetEndorser=function(id){if(active()){var label=this.getEndorserName(id),entrant=PrimaryCampaign.roster(state().playerParty).find(function(a){return label.indexOf(a.candidate.name)===0;});if(entrant){Utils.showToast('This candidate is running. Use Nominations → Agreements to negotiate an endorsement.');return;}}var result=oldMeet.apply(this,arguments);if(active()){var code='National',e=this.db.national.find(function(e){return e.id===id;});if(!e)Object.keys(this.db.states).some(function(s){e=Endorsers.db.states[s].find(function(e){return e.id===id;});if(e){code=s;return true;}});if(e&&this.relationships[id]>=e.threshold&&!player().endorsements.some(function(x){return x.id===id;})){var former=PrimaryCampaign.actor(state().endorserAssignments[id]);if(former)former.endorsements=former.endorsements.filter(function(x){return x.id!==id;});player().endorsements.push({id:id,name:e.name,state:code,strength:Endorsers.getStars(e)*0.02});state().endorserAssignments[id]=player().id;}syncPlayer();}return result;};
    var oldGOTV=GroundOps.activateGOTV;GroundOps.activateGOTV=function(code){if(!active()){if(state()&&state().nativeCampaign){var remaining=(new Date('2028-11-07T12:00:00')-gameData.currentDate)/86400000;if(remaining<0||remaining>28){Utils.showToast('GOTV opens in the four weeks before Election Day.');return false;}}return oldGOTV.apply(this,arguments);}var c=contest(code),days=c?(new Date(c.date)-new Date(state().date))/86400000:-1;if(!c||c.status!=='scheduled'||days<0||days>28){Utils.showToast('GOTV opens in the four weeks before this state’s primary or caucus.');return false;}var week=gameData.currentWeek;gameData.currentWeek=Math.max(14,week);try{var result=oldGOTV.apply(this,arguments);if(result)gameData.groundOps.gotv[code].weekActivated=week;return result;}finally{gameData.currentWeek=week;}};
    var oldGOTVLift=GroundOps.getGOTVLift;GroundOps.getGOTVLift=function(code){if(active()){var c=contest(code);if(!c||c.status==='complete')return 0;}return oldGOTVLift.apply(this,arguments);};
    var oldTruth=MichiganModel.evaluateCountyTrueState;
    MichiganModel.evaluateCountyTrueState=function(c){
        if(!active())return oldTruth.apply(this,arguments);
        var t=live(c.s),votes=t.counties[c.fips]||{},total=Object.values(votes).reduce(function(n,v){return n+v;},0),shares={},enthusiasm={},attitudes={},registered=Number(c.regVoters)||Number(c.p)||0,decided=1-t.undecided;
        Object.keys(votes).forEach(function(id){var a=PrimaryCampaign.actor(id);shares[id]=total?votes[id]/total*decided:0;enthusiasm[id]=clamp(a.favorability+(a.unity-0.7)*0.15+a.momentum*0.01,0.1,0.95);attitudes[id]=Favorability.get(id,c).net/100;});
        var p=state();p.nativeCountyBaseline=p.nativeCountyBaseline||{};
        if(!p.nativeCountyBaseline[c.fips])p.nativeCountyBaseline[c.fips]=copy(shares);
        var trueVotes={};Object.keys(votes).forEach(function(id){trueVotes[id]=Math.round(votes[id]*decided);});trueVotes.Undecided=Math.round(total*t.undecided);
        return {isPrimary:true,fips:c.fips,stateCode:c.s,regVoters:registered,candidateChoiceShares:shares,baselineShares:p.nativeCountyBaseline[c.fips],candEnthusiasm:enthusiasm,candAttitudes:attitudes,turnoutRate:registered?total/registered:0,ballotsCast:Math.round(total),abstainCount:Math.max(0,Math.round(registered-total)),undecidedPct:t.undecided*100,trueVotes:trueVotes};
    };
    var oldPrediction=MichiganModel.getCountyPrediction;
    MichiganModel.getCountyPrediction=function(c){
        if(!active())return oldPrediction.apply(this,arguments);
        var race=contest(c.s);
        if(!race||race.status!=='complete')return oldPrediction.apply(this,arguments);
        var t=this.evaluateCountyTrueState(c),votes=t.trueVotes,total=Object.values(votes).reduce(function(n,v){return n+v;},0),shares={},ids=Object.keys(votes).filter(function(id){return id!=='Undecided';}).sort(function(a,b){return votes[b]-votes[a];});
        ids.forEach(function(id){shares[id]=total?100*votes[id]/total:0;});shares.Undecided=0;
        return {fips:c.fips,stateCode:c.s,isPredictiveModel:false,isFinal:true,predictedShares:shares,predictedVotes:votes,undecidedPct:0,leader:ids[0],margin:(shares[ids[0]]||0)-(shares[ids[1]]||0),regVoters:t.regVoters,predictedBallotsCast:t.ballotsCast,predictedTurnoutRate:t.turnoutRate,accuracy:1,accuracyLabel:'Final result',confidenceTier:'Final',maxErrorPct:0,trendSensitivity:1,trendSensitivityLabel:'100%'};
    };
    var oldCommission=MichiganModel.commissionInternalPoll;MichiganModel.commissionInternalPoll=function(code){var r=oldCommission.apply(this,arguments);if(active()&&r){syncPlayer();var rows=PrimaryCampaign.getPoll(state().playerParty,code);state().pollHistory.push({date:state().date,week:state().week,party:state().playerParty,state:code,internal:true,rows:copy(rows),undecided:rows.undecided,sample:1200,marginOfError:2.8,groups:copy(live(code).groups)});}return r;};
    var oldRegistration=MichiganModel.isRegistrationOpen;MichiganModel.isRegistrationOpen=function(code){if(!active())return oldRegistration.apply(this,arguments);var c=contest(code),rule=this.VOTER_REGISTRATION_DEADLINES[code]||{};return !!c&&c.status==='scheduled'&&PrimaryIntegration.iso(gameData.currentDate)<=PrimaryRules.datePlus(c.date,rule.sameDay?0:-(rule.daysBefore||0));};
    var oldRegistrationInfo=MichiganModel.getStateRegistrationInfo;MichiganModel.getStateRegistrationInfo=function(code){if(!active())return oldRegistrationInfo.apply(this,arguments);var c=contest(code),rule=this.VOTER_REGISTRATION_DEADLINES[code]||{},deadline=c&&PrimaryRules.datePlus(c.date,rule.sameDay?0:-(rule.daysBefore||0)),days=deadline?Math.ceil((new Date(deadline+'T12:00:00')-gameData.currentDate)/86400000):0;return {isOpen:this.isRegistrationOpen(code),sameDay:!!rule.sameDay,daysBefore:rule.daysBefore||0,deadlineDate:deadline?new Date(deadline+'T12:00:00'):null,daysUntilDeadline:days,daysToDeadline:days,daysUntilElection:c?Math.ceil((new Date(c.date+'T12:00:00')-gameData.currentDate)/86400000):0,note:'Primary scenario uses the existing state registration window.',statute:rule.statute||'Scenario estimate'};};
    ['getCountyGrassrootsTotal','getStateGrassrootsTotal'].forEach(function(name){var original=MichiganModel[name];MichiganModel[name]=function(area,id){if(!active())return original.apply(this,arguments);id=id||this.activeGrassrootsViewCandidate;if(id==='player'||id===state().playerParty)id=player().id;var records=name==='getCountyGrassrootsTotal'?this.grassrootsTotals.byCounty[area.fips]:this.grassrootsTotals.byState[area];return records&&records[id]||0;};});
    var oldMicroVoters=MichiganModel.generateCountyVoters;
    MichiganModel.generateCountyVoters=function(c,size){
        var rows=oldMicroVoters.apply(this,arguments);if(!active())return rows;
        var t=this.evaluateCountyTrueState(c),rule=contest(c.s),groups=['suburban','union','youth','seniors','smallbusiness','college','rural','bluecollar'];
        rows.forEach(function(v,i){
            var group=groups[i%groups.length],field=PrimaryCampaign.roster(state().playerParty),model=modelFor(state().playerParty),response=voterResponse(c,group,groupBase(c,group),0.43),shares=response.preferences;
            // Final county choices stay tied to their recorded vote, including
            // candidates who later suspended their campaigns.
            if(rule&&rule.status==='complete'){field=Object.keys(t.candidateChoiceShares).map(PrimaryCampaign.actor);shares=field.map(function(a){return t.candidateChoiceShares[a.id];});}
            var draw=PrimaryCampaign.stable(state().seed+'voter'+c.fips+i),cumulative=0,index=shares.length-1;
            shares.some(function(share,k){cumulative+=share;if(draw<=cumulative){index=k;return true;}});
            var a=field[index];if(!a)return;
            var scoreIndex=model.candidates.findIndex(function(candidate){return candidate.id===a.id;}),policy=scoreIndex>=0?model.groups[group].scores[scoreIndex]:0;
            v.candAttitude=(Favorability.get(a.id,c).net/100).toFixed(1);v.policyAttitude=policy.toFixed(1);v.groupAttitude=(_getCandidateGroupEffectValue(a.candidate,group,'support')/10).toFixed(1);
            v.enthusiasm=Math.round(clamp((t.candEnthusiasm[a.id]||0.5)+policy*0.1,0.05,0.98)*100);
            if(rule&&['closed','members'].includes(rule.eligibility)){v.pidParty=state().playerParty;v.pid=PARTIES[v.pidParty].name+' primary participant';}
            var turnout=PrimaryCampaign.stable(state().seed+'turnout'+c.fips+i),undecidedDraw=PrimaryCampaign.stable(state().seed+'undecided'+c.fips+i);
            if(turnout>t.turnoutRate){v.decision='Not participating in this primary';v.decisionClass='voter-abstain';}
            else if(undecidedDraw<t.undecidedPct/100){v.decision='Undecided / Weighing primary candidates';v.decisionClass='voter-undecided';}
            else{v.decision=(rule&&rule.status==='complete'?'Voted for ':'Voting for ')+a.candidate.name;v.decisionClass=state().playerParty==='D'?'voter-dem':state().playerParty==='R'?'voter-rep':'voter-third';}
        });return rows;
    };
    var oldCountyStats=Counties.updateCountyViewStats;Counties.updateCountyViewStats=function(){var r=oldCountyStats.apply(this,arguments);if(active()){if(this.currentState&&el('cv-stats'))el('cv-stats').textContent=stateInfo(this.currentState);if(el('cv-districts'))el('cv-districts').classList.add('hidden');}return r;};
    var oldCountyTooltip=Counties.showCountyTooltip;Counties.showCountyTooltip=function(e,id){var result=oldCountyTooltip.apply(this,arguments);if(active()){var c=this.countyData[this.normalizeFips(id)],tip=el('map-tooltip');if(c&&tip)tip.insertAdjacentHTML('beforeend','<div class="tooltip-details">'+esc(stateInfo(c.s))+'</div>');}return result;};
    var oldCountyTurnout=Counties.getCountyTurnoutRateForMode;Counties.getCountyTurnoutRateForMode=function(c,mode){if(!active())return oldCountyTurnout.apply(this,arguments);var r=Electorate.countyResult(c),own=r.byParty[player().id]||0;return r.registered?(mode==='playerTurnout'?own:mode==='opponentTurnout'?r.total-own:r.total)/r.registered:0;};
    var oldStateTurnout=Campaign.getStateTurnoutIndex;Campaign.getStateTurnoutIndex=function(code,mode){if(!active())return oldStateTurnout.apply(this,arguments);var votes=0,registered=0;Object.values(Counties.countyData).forEach(function(c){if(c.s!==code)return;var r=Electorate.countyResult(c);registered+=r.registered;votes+=mode==='player'?(r.byParty[player().id]||0):mode==='opponent'?r.total-(r.byParty[player().id]||0):r.total;});return registered?clamp(votes/registered/0.5,0,1):0;};
    var oldFieldPanel=app.openFieldModal;app.openFieldModal=function(){var r=oldFieldPanel.apply(this,arguments),note=el('primary-field-note');if(note)note.remove();if(!active()||!gameData.selectedState)return r;var c=contest(gameData.selectedState),host=el('ground-ops-modal').querySelector('.modal-content');if(!host)host=el('ground-ops-modal').firstElementChild;note=document.createElement('p');note.id='primary-field-note';note.className='ov-note';note.textContent=stateInfo(gameData.selectedState)+'. '+(c&&c.type.indexOf('caucus')>=0?'Each five field staff also organize a caucus captain. ':'')+'GOTV opens four weeks before this contest.';if(!['D','R'].includes(player().party)){var b=document.createElement('button');b.className='ov-button';b.textContent='Ballot access · '+Math.round(player().ballotAccess[gameData.selectedState]||0)+'%';b.onclick=function(){syncPlayer();var result=PrimaryCampaign.queueAction('ballotAccess',gameData.selectedState,{intensity:1});if(result.ok)fromPrimary();Utils.showToast(result.ok?'Petition organizing queued for this week.':result.error);};note.appendChild(b);}host.appendChild(note);return r;};
    var oldDecay=Persuasion.processWeeklyDecay;Persuasion.processWeeklyDecay=function(){var r=oldDecay.apply(this,arguments);if(active()){Object.values(state().actors).forEach(function(a){Object.keys(a.nativeSupport||{}).forEach(function(id){a.nativeSupport[id]*=PERSUASION_CONSTANTS.PERSUASION_DECAY_WEEKLY||0.6;});});PrimaryCampaign.touch();}return r;};
    PrimaryUI.render=renderNominations;PrimaryUI.show=showCampaign;PrimaryUI.refresh=function(){if(active())refresh();else renderNominations();};
    var oldSerialize=SimulationState.serialize;SimulationState.serialize=function(){if(active())syncPlayer();var result=oldSerialize.apply(this,arguments);result.data.nativeEndorserState={relationships:copy(Endorsers.relationships),rallyCredits:copy(Endorsers.rallyCredits)};if(state())result.data.nativeMichiganState={grassrootsTotals:copy(MichiganModel.grassrootsTotals),stateIntelligence:copy(MichiganModel.stateIntelligence),partisanshipData:copy(MichiganModel.partisanshipData)};return result;};
    var oldRestore=SimulationState.restore;SimulationState.restore=function(s){invalidate();var r=oldRestore.apply(this,arguments);invalidate();voteOwners=new WeakMap();Object.values(Counties.countyData).forEach(function(c){voteOwners.set(c.v,c);});if(gameData.nativeEndorserState){Endorsers.relationships=copy(gameData.nativeEndorserState.relationships);Endorsers.rallyCredits=copy(gameData.nativeEndorserState.rallyCredits);}if(gameData.nativeMichiganState){Object.assign(MichiganModel,copy(gameData.nativeMichiganState));MichiganModel.predictionsCache={};Object.values(Counties.countyData).forEach(function(c){if(MichiganModel.partisanshipData&&MichiganModel.partisanshipData[c.fips])c.partisanship=MichiganModel.partisanshipData[c.fips];});}installControls();return r;};
    var oldContinue=PrimaryCampaign.continueAsNominee;PrimaryCampaign.continueAsNominee=function(){var r=oldContinue.apply(this,arguments);if(r.ok&&state().nativeCampaign){initializing=true;try{GroundOps.initGroundOps();Endorsers.init();var a=player();if(a.nativeEndorsers){Endorsers.relationships=copy(a.nativeEndorsers.relationships);Endorsers.rallyCredits=copy(a.nativeEndorsers.rallyCredits);}Object.keys(STATES).forEach(function(code){var o=PrimaryCampaign.org(a,code);gameData.groundOps.offices[code].count=o.offices;gameData.groundOps.staffLevels[code]=o.staff;gameData.groundOps.volunteerPools[code]=o.volunteers;gameData.groundOps.voterFiles[code].quality=o.file;});gameData.pendingActions=[];gameData.oppoResearchAllocations=null;initInterestGroupTurnout();Object.values(Counties.countyData).forEach(function(c){if(c.turnout){c.turnout.player=1;c.turnout.thirdParty=0.7;}});}finally{initializing=false;}fromPrimary();publish();refresh();}return r;};
    var oldNationalOverview=app.renderNationalOverview;
    app.renderNationalOverview=function(){
        var result=oldNationalOverview.apply(this,arguments);if(!active())return result;
        var ps=state().parties[state().playerParty],popular=el('popular-vote-display'),delegates=el('electoral-projection-display'),upcoming=el('tossup-states-list');
        if(popular)popular.innerHTML=rankedHTML(pollMap());
        if(delegates)delegates.innerHTML='<p class="ov-note">'+ps.majority+' delegates to nominate · '+ps.totalDelegates+' total delegates</p>'+ps.roster.map(PrimaryCampaign.actor).sort(function(a,b){return (ps.delegates[b.id]||0)-(ps.delegates[a.id]||0);}).map(function(a){return '<p><strong style="color:'+a.color+'">'+esc(a.candidate.name)+'</strong> · '+(ps.delegates[a.id]||0)+' delegates</p>';}).join('');
        if(upcoming)upcoming.innerHTML=PrimaryCampaign.getContests(state().playerParty).filter(function(c){return c.status==='scheduled';}).slice(0,8).map(function(c){return '<p>'+esc(STATES[c.state]?STATES[c.state].name:c.state)+' · '+esc(c.date)+' · '+c.delegates+' delegates</p>';}).join('')||'<p>Voting is complete. Open Nominations to view the convention and ticket.</p>';
        [popular,delegates,upcoming].forEach(function(node,i){if(!node)return;var section=node.closest('.national-section'),heading=section&&section.querySelector('h2,h3,h4');if(heading){if(!heading.dataset.generalHeading)heading.dataset.generalHeading=heading.textContent;heading.textContent=['Primary popular vote','Delegate allocation','Upcoming contests'][i];}});
        return result;
    };
    // Restore the original headings when a general campaign opens the same UI.
    var nativeNationalOverview=app.renderNationalOverview;
    app.renderNationalOverview=function(){if(!active())document.querySelectorAll('[data-general-heading]').forEach(function(n){n.textContent=n.dataset.generalHeading;});return nativeNationalOverview.apply(this,arguments);};
    // Keep the full result object as well as the map's percentages. County
    // turnout/prediction views and save/resume must use the same final votes.
    var nativeCountyResult=Electorate.countyResult;
    Electorate.countyResult=function(county){
        if(!active()||!county)return nativeCountyResult.apply(this,arguments);
        var c=contest(county.s);if(!c||c.status!=='complete'||!c.result)return nativeCountyResult.apply(this,arguments);
        var p=state();p.nativeClosedCountyResults=p.nativeClosedCountyResults||{};
        if(!p.nativeClosedCountyResults[county.fips]){
            var result=copy(nativeCountyResult.apply(this,arguments)),votes=c.result.countyFirstPreferenceEstimates&&c.result.countyFirstPreferenceEstimates[county.fips];
            if(votes){result.byParty=copy(votes);result.total=Object.values(votes).reduce(function(n,v){return n+v;},0);result.rate=result.registered?result.total/result.registered:0;}
            p.nativeClosedCountyResults[county.fips]=result;
        }
        return copy(p.nativeClosedCountyResults[county.fips]);
    };
    return {active:active,initialize:initialize,syncPlayer:syncPlayer,fromPrimary:fromPrimary,installControls:installControls,campaignScore:campaignScore,turnoutMultiplier:turnoutMultiplier,voterResponse:voterResponse,groupBase:groupBase,undecided:undecided,nextWeek:nextWeek,planActor:planActor,enterGeneral:enterGeneral,showCampaign:showCampaign,openNominations:openNominations,renderNominations:renderNominations,refresh:refresh,publish:publish,getFocusedParty:getFocusedParty,setFocusedParty:setFocusedParty,projectStateDelegates:projectStateDelegates,rankedHTML:rankedHTML};
}());

if (typeof window !== 'undefined') {
    window.PrimaryNative = PrimaryNative;
}
