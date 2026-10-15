/* Political commitments persist through the convention and general election.
   No agreement transfers campaign funds illegally or overrides bound delegates. */
var PrimaryNegotiations = (function () {
    'use strict';
    var cabinetRoles=['Secretary of State','Secretary of the Treasury','Secretary of Defense','Attorney General','Secretary of the Interior','Secretary of Agriculture','Secretary of Commerce','Secretary of Labor','Secretary of Health and Human Services','Secretary of Housing and Urban Development','Secretary of Transportation','Secretary of Energy','Secretary of Education','Secretary of Veterans Affairs','Secretary of Homeland Security'];
    var types=['endorsement','nonaggression','policy','vp','cabinet','assistance','convention'];
    function p(){return PrimaryCampaign.state();}
    function actor(id){return PrimaryCampaign.actor(id);}
    function relation(a,b){return a.relationships[b.id]||(a.relationships[b.id]={opinion:0,trust:0.5});}
    function activeContracts(){return p()?p().contracts.filter(function(c){return c.status==='active';}):[];}
    function roleAvailable(fromId,role,toId){return !activeContracts().some(function(c){return c.fromId===fromId&&c.toId!==toId&&((role==='VP'&&c.terms.offerType==='vp')||(c.terms.offerType==='cabinet'&&c.terms.role===role));});}
    function policyLocked(id,issueId,positionId){var a=actor(id),lock=a&&a.donorLocks&&a.donorLocks[issueId];return !!(lock&&lock.untilWeek>p().week&&lock.positionId!==positionId)||activeContracts().some(function(c){return c.fromId===id&&c.terms.offerType==='policy'&&c.terms.issueId===issueId&&c.terms.positionId!==positionId;});}
    function validate(fromId,toId,terms){var a=actor(fromId),b=actor(toId);
        if(!a||!b||a.id===b.id)return 'Choose two different candidates.';
        if(a.party!==b.party)return 'Nomination deals require candidates from the same party.';
        if(!types.includes(terms.type))return 'Choose a negotiation type.';
        if(terms.offerType==='vp'&&!roleAvailable(a.id,'VP',b.id))return 'Your VP slot is already reserved by an active agreement.';
        if(terms.offerType==='vp'&&p().parties[a.party].vpId&&p().parties[a.party].vpId!==b.id)return 'Your running mate has already been selected.';
        if(terms.offerType==='cabinet'&&(!cabinetRoles.includes(terms.role)||!roleAvailable(a.id,terms.role,b.id)))return 'Choose an available cabinet position.';
        if(terms.offerType==='policy'){
            if(!IssueModel.getIssue(terms.issueId)||!IssueModel.positions.some(function(x){return x.id===terms.positionId;}))return 'Choose a valid policy commitment.';
            if(policyLocked(a.id,terms.issueId,terms.positionId))return 'That policy conflicts with an existing agreement.';
            if(a.id===p().playerId&&gameData.lockedIssues&&gameData.lockedIssues[terms.issueId])return 'An existing PAC commitment locks that policy.';
        }
        if(terms.offerType==='assistance'&&a.energy<1)return 'A campaign-assistance commitment requires one energy now.';
        return null;
    }
    function normalize(terms){var t=Object.assign({type:'endorsement',offerType:'none',public:true,withdraw:true,duration:6},terms||{});
        if(['vp','cabinet','policy','assistance'].includes(t.type)&&t.offerType==='none')t.offerType=t.type;
        t.duration=PrimaryCampaign.clamp(Math.floor(Number(t.duration)||6),1,60);t.public=t.public!==false;t.withdraw=t.withdraw!==false;
        if(t.type==='nonaggression')t.withdraw=false;return t;
    }
    function decision(a,b,terms){
        var ps=p().parties[a.party],poll=PrimaryCampaign.getPoll(a.party,null),aShare=(poll.find(function(r){return r.id===a.id;})||{}).share||0,bShare=(poll.find(function(r){return r.id===b.id;})||{}).share||0;
        var r=relation(b,a),compat=PrimaryCampaign.similarity(a,b),offerValue={none:0,policy:0.20,vp:0.36,cabinet:0.26,assistance:0.12}[terms.offerType]||0;
        if(terms.offerType==='policy')offerValue+=0.15*IssueModel.agreement(terms.issueId,b.platform[terms.issueId],terms.positionId);
        var score=compat*0.26+r.opinion*0.16+r.trust*0.17+offerValue+(aShare-bShare)*0.008+(b.funds<2?0.12:0)+(b.status==='suspended'?0.25:0)+(ps.nomineeId===a.id?0.30:0);
        var completed=PrimaryCampaign.getContests(a.party).filter(function(c){return c.status==='complete'&&c.delegates;}).length;
        if(terms.type==='nonaggression')score+=0.25;
        else if(terms.type==='convention')score+=ps.stage==='convention'?0.20:-0.12;
        else if(completed<2&&b.status==='active')score-=0.25;
        if(ps.nomineeId===b.id&&a.id!==b.id)score-=0.8;
        if(terms.withdraw&&bShare>aShare+10)score-=0.25;
        var threshold=0.40+(PrimaryCampaign.stable(p().seed+'bargain'+a.id+b.id+terms.type)*0.10);
        return {score:score,threshold:threshold,reason:score>=threshold?'The offer fits their policy goals, personal trust, and path to influence.':r.trust<0.3?'They do not trust you to keep this promise.':bShare>aShare?'They still see a stronger path to the nomination.':compat<0?'The policy and factional gap is too large.':'The concession is too small for the support requested.'};
    }
    function propose(fromId,toId,terms){
        if(!p()||p().ended)return {ok:false,error:'There is no active campaign.'};
        if(fromId!==p().playerId)return {ok:false,error:'You can negotiate only for the campaign you control.'};
        var t=normalize(terms),error=validate(fromId,toId,t);if(error)return {ok:false,error:error};
        var round=(p().parties[actor(fromId).party].convention||{}).round||0;
        if(p().offers.some(function(o){return o.fromId===fromId&&o.toId===toId&&o.type===t.type&&o.week===p().week&&(o.round||0)===round;}))return {ok:false,error:'You have already negotiated this subject with that candidate this week or convention round.'};
        var a=actor(fromId),b=actor(toId),d=decision(a,b,t),offer={id:'offer-'+p().week+'-'+p().offers.length,fromId:fromId,toId:toId,type:t.type,terms:t,week:p().week,expiresWeek:p().week+3,status:'proposed',reason:d.reason};
        offer.round=round;p().offers.push(offer);
        if(d.score>=d.threshold){var accepted=apply(offer);if(!accepted.ok)return accepted;}
        else if(d.score>=d.threshold-0.28&&relation(b,a).trust>=0.30){
            offer.status='countered';offer.originalTerms=Object.assign({},t);
            if(t.offerType==='none'&&roleAvailable(a.id,'VP',b.id)){offer.terms=Object.assign({},t,{offerType:'vp'});offer.reason='They will support you if you reserve the vice-presidential nomination.';}
            else {var issue=b.priorities[0];offer.terms=Object.assign({},t,{offerType:'policy',issueId:issue,positionId:b.platform[issue]});offer.reason='They want a concrete commitment to their position on '+IssueModel.getIssue(issue).name+'.';}
        }else offer.status='rejected';
        PrimaryCampaign.log(b.candidate.name+' '+(offer.status==='accepted'?'accepted the agreement':offer.status==='countered'?'made a counteroffer':'declined the proposal')+'.','negotiation');PrimaryCampaign.refresh();return {ok:true,offer:offer};
    }
    function apply(offer){
        if(offer.status==='accepted')return {ok:true,offer:offer};
        var error=validate(offer.fromId,offer.toId,offer.terms);if(error)return {ok:false,error:error};
        if(p().week>offer.expiresWeek)return {ok:false,error:'This offer has expired.'};
        var a=actor(offer.fromId),b=actor(offer.toId),t=offer.terms;
        if(t.withdraw&&b.status!=='suspended'&&b.status!=='nominated'&&PrimaryCampaign.roster(a.party).length<2)return {ok:false,error:'The only remaining candidate cannot withdraw.'};
        if(t.withdraw&&b.status==='nominated')return {ok:false,error:'The presumptive nominee will not withdraw for this proposal.'};
        var contract={id:'contract-'+p().contracts.length,fromId:a.id,toId:b.id,type:offer.type,terms:Object.assign({},t),status:'active',created:p().date,createdWeek:p().week,expires:t.type==='nonaggression'?PrimaryRules.datePlus(p().date,t.duration*7):PrimaryRules.electionDay,leaked:false};
        p().contracts.push(contract);offer.status='accepted';offer.contractId=contract.id;
        relation(a,b).opinion=PrimaryCampaign.clamp(relation(a,b).opinion+0.15,-1,1);relation(b,a).opinion=PrimaryCampaign.clamp(relation(b,a).opinion+0.15,-1,1);
        relation(b,a).trust=PrimaryCampaign.clamp(relation(b,a).trust+0.12,0,1);
        if(t.offerType==='policy'){
            var pos=IssueModel.positions.find(function(x){return x.id===t.positionId;});a.credibility=Math.max(0.1,a.credibility-Math.abs(IssueModel.index(a.platform[t.issueId])-pos.index)*0.02);
            a.platform[t.issueId]=t.positionId;a.candidate.issuePositions[t.issueId]=pos.value;a.candidate.stances[t.issueId]=pos.id;
        }
        if(t.offerType==='vp')a.pledges.vp=b.id;
        if(t.offerType==='cabinet'){a.pledges.cabinet=a.pledges.cabinet||{};a.pledges.cabinet[t.role]=b.id;}
        if(t.offerType==='assistance'){a.energy--;b.awareness=Math.min(1,b.awareness+0.025);contract.assistanceRemaining=t.duration;}
        if(t.type!=='nonaggression'){
            if(t.withdraw&&b.status==='active')PrimaryCampaign.withdraw(b.id,a.id,true);
            else if(b.endorsedId!==a.id){b.endorsedId=a.id;a.endorsements.push({id:'deal-'+contract.id,name:b.candidate.name,state:'National',strength:0.08});a.unity=Math.min(1,a.unity+0.04);}
            b.conventionPreference=a.id;
        }
        PrimaryCampaign.touch();return {ok:true,offer:offer,contract:contract};
    }
    function accept(id){if(!p()||p().ended)return {ok:false,error:'There is no active campaign.'};var offer=p().offers.find(function(o){return o.id===id;});if(!offer||!['proposed','countered'].includes(offer.status))return {ok:false,error:'There is no pending offer to accept.'};
        if(offer.fromId!==p().playerId&&offer.toId!==p().playerId)return {ok:false,error:'This offer belongs to another campaign.'};var result=apply(offer);if(result.ok){PrimaryCampaign.log('Agreement reached with '+actor(offer.toId).candidate.name+'.','negotiation');PrimaryCampaign.refresh();}return result;}
    function reject(id){if(!p()||p().ended)return {ok:false,error:'There is no active campaign.'};var offer=p().offers.find(function(o){return o.id===id;});if(!offer||!['proposed','countered'].includes(offer.status)||(offer.fromId!==p().playerId&&offer.toId!==p().playerId))return {ok:false,error:'This offer is no longer pending.'};offer.status='rejected';PrimaryCampaign.refresh();return {ok:true};}
    function breach(c,reason,responsibleId){if(c.status!=='active')return;var a=actor(c.fromId),b=actor(c.toId),responsible=responsibleId===b.id?b:a,other=responsible===a?b:a;c.status='broken';c.brokenDate=p().date;c.brokenBy=responsible.id;c.reason=reason;
        responsible.credibility=Math.max(0.1,responsible.credibility-0.16);responsible.unity=Math.max(0,responsible.unity-0.12);responsible.favorability=Math.max(0,responsible.favorability-0.04);relation(other,responsible).trust=Math.max(0,relation(other,responsible).trust-0.45);relation(other,responsible).opinion=Math.max(-1,relation(other,responsible).opinion-0.4);
        if(c.terms.offerType==='vp'&&a.pledges.vp===b.id)delete a.pledges.vp;
        if(c.terms.offerType==='cabinet'&&a.pledges.cabinet)delete a.pledges.cabinet[c.terms.role];
        a.endorsements=a.endorsements.filter(function(e){return e.id!=='deal-'+c.id&&e.id!=='candidate-'+b.id&&!e.id.startsWith('candidate-'+b.id+'-');});if(b.endorsedId===a.id)b.endorsedId=null;if(b.conventionPreference===a.id)b.conventionPreference=null;
        (p().departures||[]).forEach(function(d){if(d.id===b.id&&d.endorseeId===a.id){d.endorseeId=null;d.fraction=0;}});
        PrimaryCampaign.log(responsible.candidate.name+' broke an agreement with '+other.candidate.name+': '+reason+'.','promise');
    }
    function breakContract(id){if(!p()||p().ended)return {ok:false,error:'There is no active campaign.'};var c=p().contracts.find(function(x){return x.id===id;});if(!c||c.status!=='active'||(c.fromId!==p().playerId&&c.toId!==p().playerId))return {ok:false,error:'Choose one of your active agreements.'};breach(c,'commitment withdrawn',p().playerId);PrimaryCampaign.refresh();return {ok:true};}
    function recordAttack(fromId,toId){activeContracts().forEach(function(c){if(c.type==='nonaggression'&&((c.fromId===fromId&&c.toId===toId)||(c.fromId===toId&&c.toId===fromId)))breach(c,'negative campaigning during a nonaggression pact',fromId);});}
    function makeIncoming(aiId,playerId){var ai=actor(aiId),human=actor(playerId);if(!ai||!human)return;
        if(p().offers.some(function(o){return o.toId===aiId&&o.fromId===playerId&&['proposed','countered'].includes(o.status);}))return;
        var issue=ai.priorities[0],offerType=roleAvailable(playerId,'VP',aiId)&&PrimaryCampaign.getPoll(ai.party,null).find(function(r){return r.id===aiId;}).share>=10?'vp':'policy';
        var terms=normalize({type:'endorsement',offerType:offerType,issueId:issue,positionId:ai.platform[issue],withdraw:true,public:true});
        p().offers.push({id:'offer-'+p().week+'-'+p().offers.length,fromId:playerId,toId:aiId,type:'endorsement',terms:terms,week:p().week,expiresWeek:p().week+3,status:'countered',incoming:true,reason:ai.candidate.name+' is willing to suspend and endorse you in exchange for '+(offerType==='vp'?'the VP nomination':'a commitment on '+IssueModel.getIssue(issue).name)+'.'});
        PrimaryCampaign.log(ai.candidate.name+' has offered to negotiate a withdrawal and endorsement.','negotiation');
    }
    function processWeek(){if(!p())return;
        p().offers.forEach(function(o){if(['proposed','countered'].includes(o.status)&&o.expiresWeek<p().week)o.status='expired';});
        activeContracts().forEach(function(c){var a=actor(c.fromId),b=actor(c.toId),t=c.terms;
            if(c.expires<p().date){c.status='fulfilled';return;}
            if(t.offerType==='policy'&&a.platform[t.issueId]!==t.positionId){breach(c,'the promised policy was reversed');return;}
            if(c.assistanceRemaining>0){b.awareness=Math.min(1,b.awareness+0.004);var home=b.candidate.homeState;if(home){var source=PrimaryCampaign.org(a,home),target=PrimaryCampaign.org(b,home),volunteers=Math.min(source.volunteers,5);source.volunteers-=volunteers;target.volunteers+=volunteers;}c.assistanceRemaining--;}
            if(!t.public&&!c.leaked&&PrimaryCampaign.random()<0.025){c.leaked=true;a.credibility=Math.max(0.1,a.credibility-0.02);PrimaryCampaign.log('A private '+c.type+' agreement between '+a.candidate.name+' and '+b.candidate.name+' leaked.','negotiation');}
        });
        // Limited AI-to-AI bargaining, independent of the player's party.
        if(p().week%4===0)Object.keys(p().parties).forEach(function(party){var ps=p().parties[party];if(ps.stage==='nominated')return;var ranked=PrimaryCampaign.getPoll(party,null).filter(function(r){return r.status==='active'&&r.id!==p().playerId;});if(ranked.length<2)return;
            var a=actor(ranked[0].id),b=actor(ranked[ranked.length-1].id);if(b.badWeeks<1)return;
            var terms=normalize({type:'endorsement',offerType:roleAvailable(a.id,'VP',b.id)?'vp':'policy',issueId:b.priorities[0],positionId:b.platform[b.priorities[0]],withdraw:true});
            if(validate(a.id,b.id,terms))return;var d=decision(a,b,terms);if(d.score<d.threshold)return;
            var offer={id:'offer-'+p().week+'-'+p().offers.length,fromId:a.id,toId:b.id,type:terms.type,terms:terms,week:p().week,expiresWeek:p().week+1,status:'proposed',reason:d.reason,ai:true};p().offers.push(offer);var result=apply(offer);if(result.ok)PrimaryCampaign.log(a.candidate.name+' and '+b.candidate.name+' reached a nomination agreement.','negotiation');
        });
    }
    return {propose:propose,accept:accept,reject:reject,breakContract:breakContract,cabinetRoles:cabinetRoles,policyLocked:policyLocked,
        recordAttack:recordAttack,makeIncoming:makeIncoming,processWeek:processWeek,roleAvailable:roleAvailable,activeContracts:activeContracts};
}());

var PrimaryConventions = (function () {
    'use strict';
    function state(){return PrimaryCampaign.state();}
    function actor(id){return PrimaryCampaign.actor(id);}
    function eligible(party){var ps=state().parties[party],eliminated=ps.convention&&ps.convention.eliminated||[];return ps.roster.filter(function(id){return !eliminated.includes(id)&&actor(id).status!=='suspended';});}
    function choicesFor(sourceId,ids,round,weight){var weights={},source=actor(sourceId);ids.forEach(function(id){var target=actor(id),relationship=source&&source.relationships[id]||{opinion:0,trust:0.5};
        var affinity=source?PrimaryCampaign.similarity(source,target):0.3,endorsement=source&&(source.endorsedId===id||source.conventionPreference===id)?0.9:0;
        var ps=state().parties[target.party],delegates=ps.delegates[id]||0;
        weights[id]=Math.exp(affinity*1.2+relationship.opinion*0.5+endorsement+target.unity*0.6+target.credibility*0.3+Math.log1p(delegates)*Math.min(0.08+(round-1)*0.08,0.6)+(PrimaryCampaign.stable(state().seed+'floor'+round+sourceId+id)-0.5)*0.15);
    });return PrimaryRules.apportion(weights,weight,ids);}
    function merge(target,source){Object.keys(source).forEach(function(id){target[id]=(target[id]||0)+source[id];});}
    function chooseAIVP(party){var ps=state().parties[party];if(ps.vpId||!ps.nomineeId)return;var available=vpChoices(party);for(var i=0;i<available.length;i++){if(selectVP(party,available[i].id,true).ok)break;}}
    function open(party){var p=state(),ps=p&&p.parties[party];if(!ps||p.ended)return;if(ps.stage==='nominated'){if(party!==p.playerParty)chooseAIVP(party);return;}
        if(party==='I'){ps.stage='nominated';ps.nomineeId=ps.roster[0];actor(ps.nomineeId).status='nominated';if(party===p.playerParty)p.generalReady=true;else chooseAIVP(party);return;}
        if(!ps.convention){ps.stage='convention';ps.convention={round:0,ballots:[],pending:party===p.playerParty,winnerId:null,eliminated:[],nota:0};PrimaryCampaign.log(party+' convention opened. '+PrimaryRules.conventionStatus[party]+'.','convention');}
        if(party!==p.playerParty){var guard=0;while(!ps.convention.winnerId&&!ps.convention.noNominee&&guard++<30)ballot(party,true);if(ps.convention.winnerId)chooseAIVP(party);}
    }
    function ballot(party,ai){var p=state(),ps=p&&p.parties[party];if(!ps||p.ended||!ps.convention)return {ok:false,error:'There is no active convention.'};
        if(party!==p.playerParty&&!ai)return {ok:false,error:'Other parties manage their own convention.'};
        var cv=ps.convention;if(cv.winnerId)return {ok:false,error:'The nominee is selected. Choose the vice-presidential nominee.'};if(cv.noNominee)return {ok:false,error:'The convention voted to nominate no candidate.'};
        cv.round++;var ids=eligible(party);if(!ids.length){cv.noNominee=true;cv.pending=false;ps.stage='nominated';return {ok:true,noNominee:true};}
        var votes={},bound={},automaticVotes={},round=cv.round;ids.forEach(function(id){votes[id]=0;});
        var includeAutomatic=party==='D'&&(round>1||ps.roster.some(function(id){return (ps.delegates[id]||0)>ps.conventionTotal/2;}));
        if(['L','PSL'].includes(party)){
            var preferences={};ids.forEach(function(id){var a=actor(id);preferences[id]=Math.exp(a.awareness+a.unity+a.credibility+Math.log1p(ps.delegates[id]||0)*0.45);});
            var dissatisfaction=ids.reduce(function(n,id){return n+1-actor(id).unity;},0)/ids.length;
            if(party==='L')preferences.NOTA=Math.exp(dissatisfaction*3-1.4);
            votes=PrimaryRules.apportion(preferences,ps.totalDelegates,Object.keys(preferences));
        }else{
            PrimaryCampaign.getContests(party).filter(function(c){return c.status==='complete'&&c.delegates;}).forEach(function(c){
                var ledger=c.selectedDelegates||c.result.delegates;
                Object.keys(ledger).forEach(function(id){var count=ledger[id]||0;if(!count)return;
                    var a=actor(id),binding=c.pools.reduce(function(n,pool){return Math.max(n,pool.binding||0);},0);
                    var isBound=!!a&&round<=binding&&!(a.status==='suspended'&&(c.releaseOnWithdrawal||party==='D'));
                    if(isBound){votes[id]=(votes[id]||0)+count;bound[id]=(bound[id]||0)+count;}
                    else if(ids.includes(id)&&round===1){votes[id]=(votes[id]||0)+count;}
                    else merge(votes,choicesFor(id,ids,round,count));
                });
            });
            if(includeAutomatic)ps.automatic.forEach(function(block){var weights={};ids.forEach(function(id){var a=actor(id),home=a.candidate.homeState===block.state?0.3:0;weights[id]=Math.exp(a.unity+a.credibility+home+Math.log1p(ps.delegates[id]||0)*0.35);});var allocation=PrimaryRules.apportion(weights,block.count,ids);merge(votes,allocation);merge(automaticVotes,allocation);});
            if(party==='G'){
                var dissatisfaction=ids.reduce(function(n,id){return n+1-actor(id).unity;},0)/ids.length;
                // NOTA can draw only from unbound ballots; never alter the
                // instructed first ballot to manufacture a no-nominee result.
                if(round>1&&dissatisfaction>0.5){var totalBefore=Object.values(votes).reduce(function(a,b){return a+b;},0),nota=Math.round(totalBefore*(dissatisfaction-0.5)*0.35),cuts=PrimaryRules.apportion(votes,nota,ids);Object.keys(cuts).forEach(function(id){votes[id]-=cuts[id];});votes.NOTA=nota;}
            }
        }
        var total=ps.totalDelegates+(includeAutomatic?ps.automatic.reduce(function(n,b){return n+b.count;},0):0),majority=Math.floor(total/2)+1;
        var rank=Object.keys(votes).sort(function(a,b){return votes[b]-votes[a]||a.localeCompare(b);});
        var result={round:round,votes:votes,bound:bound,automatic:automaticVotes,automaticEligible:includeAutomatic,total:total,majority:majority,date:p.date};cv.ballots.push(result);
        var winner=rank[0]&&votes[rank[0]]>=majority?rank[0]:null;
        if(winner==='NOTA'){
            cv.noNominee=true;cv.pending=false;ps.stage='nominated';ps.nomineeId=null;PrimaryCampaign.log(party+' convention voted for no nominee.','convention');if(party===p.playerParty)p.defeat={party:party,winnerId:null,noNominee:true};
        }else if(winner){
            cv.winnerId=winner;ps.nomineeId=winner;actor(winner).status='nominated';ps.stage='nominated';cv.pending=party===p.playerParty&&!ps.vpId;
            PrimaryCampaign.log(actor(winner).candidate.name+' won the '+party+' nomination on ballot '+round+' with '+votes[winner]+' of '+total+' votes.','convention');
            if(party===p.playerParty){p.generalReady=winner===p.playerId;if(winner!==p.playerId)p.defeat={party:party,winnerId:winner};}
        }else{
            PrimaryCampaign.log(party+' convention ballot '+round+': no majority. Bargaining and delegate persuasion continue.','convention');
            // Major parties keep all eligible candidates. Minor-party floor
            // procedures use their own elimination rules.
            if(party==='L'||(party==='G'&&round>=2)){
                var threshold=party==='L'?0.05:0.10,losers=ids.filter(function(id){return (votes[id]||0)<total*threshold;});
                if(!losers.length&&ids.length>1)losers=[ids.slice().sort(function(a,b){return (votes[a]||0)-(votes[b]||0)||a.localeCompare(b);})[0]];
                if(losers.length>=ids.length)losers=losers.filter(function(id){return id!==rank[0];});cv.eliminated=cv.eliminated.concat(losers);
            }
            if(ai&&round>=3){var trailing=ids.slice().sort(function(a,b){return (votes[a]||0)-(votes[b]||0);})[0],leading=rank.find(function(id){return id!=='NOTA'&&id!==trailing&&ids.includes(id);});if(trailing&&leading&&ids.length>1){actor(trailing).conventionPreference=leading;if(actor(trailing).status==='active')PrimaryCampaign.withdraw(trailing,leading,true);}}
            cv.pending=party===p.playerParty;
        }
        PrimaryCampaign.touch();if(!ai)PrimaryCampaign.refresh();return {ok:true,ballot:result,winnerId:cv.winnerId};
    }
    function vpChoices(party){var ps=state().parties[party],winner=actor(ps.nomineeId);if(!winner)return [];
        var reserved=winner.pledges.vp,pool=CANDIDATES.concat(typeof VPS!=='undefined'?VPS:[]),seen={};
        return pool.filter(function(c){if(c.party!==party||c.id===winner.id||c.name===winner.candidate.name||seen[c.name])return false;seen[c.name]=true;return true;}).map(function(c){return Object.assign({},c,{reserved:c.id===reserved});}).sort(function(a,b){return Number(b.reserved)-Number(a.reserved)||(a.homeState!==winner.candidate.homeState?-1:1)-(b.homeState!==winner.candidate.homeState?-1:1)||a.name.localeCompare(b.name);});
    }
    function selectVP(party,id,ai){var p=state(),ps=p&&p.parties[party];if(!ps||p.ended||!ps.nomineeId)return {ok:false,error:'Select a presidential nominee in an active campaign first.'};
        if(party!==p.playerParty&&!ai)return {ok:false,error:'That party chooses its own running mate.'};
        var winner=actor(ps.nomineeId),choice=vpChoices(party).find(function(c){return c.id===id;});if(!choice)return {ok:false,error:'Choose an eligible running mate.'};
        if(winner.pledges.vp&&winner.pledges.vp!==id)return {ok:false,error:'An active agreement reserves your VP slot. Break or honor that agreement first.'};
        if(ps.vpId)return {ok:false,error:'The running mate has already been selected.'};
        // LP delegates vote independently for VP. Their acceptance reflects
        // compatibility and unity; a failed ballot leaves the selection open.
        var vpActor=actor(id)||{platform:Object.fromEntries(CORE_ISSUES.map(function(i){return [i.id,IssueModel.getPosition(choice,i.id).id];}))};
        if(party==='L'&&PrimaryCampaign.similarity(winner,vpActor)<-0.2&&winner.unity<0.45)return {ok:false,error:'Convention delegates rejected this VP choice. Propose another candidate.'};
        ps.vpId=id;ps.vpCandidate=JSON.parse(JSON.stringify(choice));if(ps.convention)ps.convention.pending=party===p.playerParty&&!ps.convention.winnerId;
        if(winner.pledges.vp===id)PrimaryNegotiations.activeContracts().forEach(function(c){if(c.fromId===winner.id&&c.toId===id&&c.terms.offerType==='vp')c.vpFulfilled=true;});
        winner.unity=Math.min(1,winner.unity+0.08);PrimaryCampaign.log(choice.name+' joins '+winner.candidate.name+' on the '+party+' ticket.','ticket');
        if(party===p.playerParty&&winner.id===p.playerId)p.generalReady=true;
        if(typeof PrimaryIntegration!=='undefined'&&p.phase==='general')PrimaryIntegration.syncTickets();
        if(!ai)PrimaryCampaign.refresh();return {ok:true};
    }
    return {open:open,ballot:ballot,selectVP:selectVP,vpChoices:vpChoices};
}());
