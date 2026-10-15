/* Candidate-owned nomination simulation. County baseline votes belong to the
   general election and are read, never overwritten, by this engine. */
var PrimaryCampaign = (function () {
    'use strict';
    var geography={}, pollCache={}, affinityCache={}, busy=false;
    var sharedCampaignLoad=null;
    // Resolve beside this script so both the root server and nested previews
    // load the same campaign module. Do not start replacing a campaign until
    // that module and its shared-engine dependencies are available.
    function getSharedCampaignUrl(){
        try {
            var base = (typeof document !== 'undefined' && document.currentScript && document.currentScript.src) || (typeof window !== 'undefined' && window.location && window.location.href) || '';
            return new URL('primaryNative.js?v=shared-campaign-5', base).href;
        } catch(e) {
            return 'js/primaryNative.js?v=shared-campaign-5';
        }
    }
    function loadSharedCampaign(){
        if(typeof PrimaryNative!=='undefined')return Promise.resolve(PrimaryNative);
        if(typeof window!=='undefined'&&window.PrimaryNative)return Promise.resolve(window.PrimaryNative);
        if(sharedCampaignLoad)return sharedCampaignLoad;
        sharedCampaignLoad=new Promise(function(resolve,reject){
            var script=document.createElement('script'),failure=null;
            function capture(event){
                if(event.filename===script.src)failure=event.error||new Error(event.message);
            }
            function finish(error){
                window.removeEventListener('error',capture);
                script.onload=null;script.onerror=null;
                if(error){script.remove();reject(error);}
                else resolve(typeof PrimaryNative!=='undefined'?PrimaryNative:window.PrimaryNative);
            }
            script.src=getSharedCampaignUrl();
            script.onload=function(){
                if(failure)return finish(failure);
                if(typeof PrimaryNative==='undefined'&&(!window||!window.PrimaryNative))return finish(new Error('The shared campaign could not initialize. Please reload the preview and try again.'));
                finish();
            };
            script.onerror=function(){finish(new Error('The campaign file could not be downloaded. Your selections are preserved; press Start again to retry.'));};
            window.addEventListener('error',capture);
            document.head.appendChild(script);
        }).catch(function(error){sharedCampaignLoad=null;throw error;});
        return sharedCampaignLoad;
    }
    var colors=['#58a6ff','#ffbd59','#b38bfa','#53d5b0','#ff7c9d','#8ecae6','#f4e285','#b0c779','#ec9d68','#cab8ff','#54b5a6','#d589b4'];
    var actionCosts={
        rally:{funds:0.7,energy:2,label:'Rally'},townhall:{funds:0.35,energy:1,label:'Town hall'},
        canvass:{funds:0.45,energy:1,label:'Canvass'},office:{funds:1.8,energy:1,label:'Field office'},
        staff:{funds:0.6,energy:0,label:'Hire staff'},files:{funds:0.5,energy:0,label:'Improve voter files'},
        captains:{funds:0.4,energy:1,label:'Recruit precinct captains'},gotv:{funds:0.7,energy:1,label:'Get out the vote'},
        fundraise:{funds:0,energy:2,label:'Small-dollar fundraising'},donor:{funds:0,energy:2,label:'Donor meeting'},
        ad:{funds:0.8,energy:0,label:'Positive advertising'},attack:{funds:0.7,energy:1,label:'Contrast advertising'},
        debatePrep:{funds:0.2,energy:2,label:'Debate preparation'},research:{funds:0.6,energy:1,label:'Opposition research'},
        unity:{funds:0.3,energy:1,label:'Coalition outreach'},ballotAccess:{funds:0.5,energy:1,label:'Ballot-access organizing'},
        endorser:{funds:0.2,energy:1,label:'Court an endorser'},poll:{funds:0.3,energy:0,label:'Commission an internal poll'},
        rest:{funds:0,energy:1,label:'Rest and recover'}
    };
    function copy(v){return JSON.parse(JSON.stringify(v));}
    function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
    function state(){return gameData.primary||null;}
    function actor(id){return state()&&state().actors[id]||null;}
    function player(){return state()&&actor(state().playerId);}
    function hash(s){var n=2166136261;String(s).split('').forEach(function(c){n=Math.imul(n^c.charCodeAt(0),16777619);});return n>>>0;}
    function random(){var p=state(),x=p.rng|0;x^=x<<13;x^=x>>>17;x^=x<<5;p.rng=x>>>0;return p.rng/4294967296;}
    function stable(s){return hash(s)/4294967296;}
    function log(text,type){var p=state();if(!p)return;p.logs.unshift({date:p.date,text:text,type:type||'news'});p.logs=p.logs.slice(0,300);p.history.push({date:p.date,text:text,type:type||'news'});if(p.nativeCampaign)Utils.addLog(text);}
    function touch(){if(state())state().revision++;pollCache={};affinityCache={};}
    function refresh(){touch();if(state()&&state().nativeCampaign&&state().phase==='primary'&&typeof PrimaryNative!=='undefined')PrimaryNative.fromPrimary();if(state()&&state().phase==='general'&&typeof PrimaryIntegration!=='undefined')PrimaryIntegration.syncPlayerToGeneral();if(typeof PrimaryUI!=='undefined')PrimaryUI.refresh();}
    function org(a,code){return a.org[code]||(a.org[code]={offices:0,staff:0,volunteers:0,file:0.15,captains:0,contacts:0,gotvUntil:-1});}
    function roster(party,includeInactive){var p=state();return p&&p.parties[party]?p.parties[party].roster.map(actor).filter(function(a){return a&&(includeInactive||a.status!=='suspended');}):[];}
    function getContests(party){return state()?state().contests.filter(function(c){return !party||c.party===party;}):[];}
    function upcoming(party,limit){return getContests(party).filter(function(c){return c.status==='scheduled';}).slice(0,limit||8);}
    function loadCounties(){
        if(Object.keys(Counties.countyData||{}).length)return Promise.resolve();
        return new Promise(function(resolve,reject){var timer=setTimeout(function(){reject(new Error('County data did not finish loading. Reload and try again.'));},60000);Counties.loadCountyData(function(){clearTimeout(timer);resolve();});});
    }
    function buildGeography(force){
        if(!force && geography && Object.keys(geography).length >= 50) return;
        geography={};
        Object.keys(PrimaryRules.jurisdictions).forEach(function(code){geography[code]=[];});
        Object.keys(Counties.countyData||{}).sort().forEach(function(id){var c=Counties.countyData[id],code=c.s;if(!geography[code])return;
            var weight=Math.max(0,Number(c.regVoters)||Number(c.demographics&&c.demographics.cvap)||Number(c.p)||0);
            geography[code].push({id:id,county:c,weight:weight,cells:Electorate.makeCells(c),districts:{}});
        });
        Object.keys(geography).forEach(function(code){var j=PrimaryRules.jurisdictions[code],rows=geography[code];
            if(!rows.length){var c={s:code,p:code==='PR'?2300000:code==='DA'?600000:70000,ig:{white:40,black:15,hispanic:30,asian:10,rural:30,college:30},v:{D:50,R:45,G:2,L:2,PSL:0.5,I:0.5}};
                rows.push({id:code,county:c,weight:c.p,cells:[{group:'white',weight:0.4},{group:'black',weight:0.15},{group:'hispanic',weight:0.3},{group:'asian',weight:0.15}],districts:{}});}
            var total=rows.reduce(function(sum,r){return sum+r.weight;},0)||1,n=Math.max(1,j.house),offset=0;
            rows.forEach(function(row){var lo=offset/total*n,hi=(offset+row.weight)/total*n;offset+=row.weight;
                for(var i=Math.floor(lo);i<Math.min(n,Math.ceil(hi));i++){var part=Math.max(0,Math.min(hi,i+1)-Math.max(lo,i));if(part>0)row.districts[i+1]=part/(hi-lo);}
            });
        });
        touch();
    }
    function makeActor(candidate,index){
        var c=copy(candidate);IssueModel.initialize(c);
        var platform={};CORE_ISSUES.forEach(function(i){platform[i.id]=c.stances[i.id];});
        var favNet = (typeof Favorability !== 'undefined' && Favorability.get) ? Favorability.get(c.id).net : 0;
        var baseAffinity = Number(c.primaryBaseAffinity) || 0.10;
        var startFav = clamp(0.42 + favNet / 160 + baseAffinity * 0.35, 0.28, 0.85);
        var startAware = clamp(0.20 + (c.funds||40)/150 + ((c.charisma||1) - 1) * 0.12 + baseAffinity * 0.50, 0.20, 0.95);
        var a={id:c.id,candidate:c,party:c.party,color:colors[index%colors.length],status:'active',
            funds:Math.max(5,(c.funds||40)*(c.party==='D'||c.party==='R'?0.45:0.25)),debt:0,
            energy:c.stamina||7,maxEnergy:c.stamina||7,momentum:0,awareness:startAware,
            favorability:startFav,credibility:0.8,unity:0.75,org:{},platform:platform,priorities:['economy','healthcare','immigration'],
            relationships:{},scandals:[],endorsements:[],generalStrength:{},messages:{},fatigue:{},debatePrep:0,
            primaryBaseAffinity:baseAffinity,
            donors:1000+Math.round((c.funds||40)*80),research:{},ballotAccess:{},pledges:{},record:[],factionLoyalty:1,
            strategy:['early states','home region','delegate efficiency'][index%3],badWeeks:0,raised:0,spent:0};
        a.donorLocks={};
        Object.keys(PrimaryRules.jurisdictions).forEach(function(code){org(a,code);var established=a.party!=='I'&&typeof THIRD_PARTY_BALLOT_ACCESS!=='undefined'&&(THIRD_PARTY_BALLOT_ACCESS[a.party]||[]).includes(code);a.ballotAccess[code]=(a.party==='D'||a.party==='R'||established)?100:(code===c.homeState?100:35);});
        org(a,c.homeState||'IA').volunteers=80;return a;
    }
    async function start(options){
        if(busy)return {ok:false,error:'A campaign is already loading.'};
        var selected=CANDIDATES.find(function(c){return c.id===options.playerId&&c.party===options.party;});
        if(!selected)return {ok:false,error:'Choose your candidate.'};
        var enabled=Array.from(new Set(['D','R'].concat(options.enabledParties||[]).concat(options.party)));
        var actors={},parties={},error=null;
        enabled.forEach(function(party){var ids=Array.from(new Set((options.rosters[party]||[]).concat(party===options.party?options.playerId:[])));
            if(!ids.length){if(party==='D'||party==='R'||party===options.party)error='Choose at least one '+party+' candidate.';return;}
            ids.forEach(function(id,i){var c=CANDIDATES.find(function(x){return x.id===id&&x.party===party;});if(!c){error='Invalid candidate in '+party+' roster.';return;}actors[id]=makeActor(c,i);});
            parties[party]={roster:ids,stage:party==='I'?'presumptive':'primary',nomineeId:party==='I'?ids[0]:null,vpId:null,delegates:{},automatic:[],convention:null,totalDelegates:0,majority:0};
        });
        if(error)return {ok:false,error:error};
        busy=true;
        try{
            await loadSharedCampaign();
            await loadCounties();
            if(typeof PrimaryIntegration!=='undefined')PrimaryIntegration.preparePrimary();
            var seed=(Date.now()^Math.floor(Math.random()*0xffffffff))>>>0||5489;
            gameData.primary={version:1,rulesVersion:PrimaryRules.version,seed:seed,rng:seed,revision:0,
                date:PrimaryRules.startDate,week:0,playerId:options.playerId,playerParty:options.party,actors:actors,parties:parties,
                contests:PrimaryRules.makeContests(Object.keys(parties)),logs:[],history:[],offers:[],contracts:[],pendingActions:[],pollHistory:[],
                ended:false,generalReady:options.party==='I',phase:'primary',endorserAssignments:{},endorserSupport:{},economy:0,issueAgenda:'economy',weather:{},debates:[],departures:[],eventsProcessed:{},defeat:null};
            gameData.campaignMode='primary';gameData.currentDate=new Date(PrimaryRules.startDate+'T12:00:00');gameData.electionDay=new Date(2028,10,7);
            gameData.selectedParty=options.party;gameData.candidate=actors[options.playerId].candidate;gameData.vp=null;
            gameData.historyStack=[];gameData.pendingActions=[];gameData.thirdPartiesEnabled=Object.keys(parties).some(function(p){return !['D','R'].includes(p);});
            Object.keys(parties).forEach(function(party){var ps=parties[party];ps.totalDelegates=getContests(party).reduce(function(n,c){return n+c.delegates;},0);ps.majority=Math.floor(ps.totalDelegates/2)+1;
                ps.roster.forEach(function(id){ps.delegates[id]=0;ps.roster.forEach(function(other){if(id!==other)actors[id].relationships[other]={opinion:0.1+similarity(actors[id],actors[other])*0.3,trust:0.55};});});
                if(party==='D')Object.keys(PrimaryRules.jurisdictions).forEach(function(code){var count=PrimaryRules.jurisdictions[code].automatic;ps.automatic.push({state:code,count:count,preference:null});});
                ps.conventionTotal=ps.totalDelegates+ps.automatic.reduce(function(n,b){return n+b.count;},0);
            });
            buildGeography();log('Campaign launched on September 6, 2027. Build recognition, organize, and compete for the nomination.');
            log('Rules are pinned to '+PrimaryRules.asOf+'. Unconfirmed dates, delegate counts and district geography are labeled scenario projections.','rules');
            await PrimaryNative.initialize();
            publishPolls();refresh();Screens.goTo('game-screen');
            if(typeof PrimaryStorage!=='undefined')await PrimaryStorage.save();
            return {ok:true};
        }catch(e){return {ok:false,error:e.message};}finally{busy=false;}
    }
    function similarity(a,b){var score=0,n=0;CORE_ISSUES.forEach(function(i){score+=IssueModel.agreement(i.id,a.platform[i.id],b.platform[i.id]);n++;});return n?score/n:0;}
    function issueAffinity(a,group,issueId){var key=a.id+'|'+group+'|'+issueId+'|'+a.platform[issueId];if(affinityCache[key]!==undefined)return affinityCache[key];
        var profile=Electorate.profile(group,issueId),v=profile.distribution.reduce(function(sum,w,i){return sum+w*IssueModel.agreement(issueId,a.platform[issueId],IssueModel.positions[i].id);},0);
        affinityCache[key]=v;return v;
    }
    function alignment(a,group){var key=a.id+'|'+group;if(affinityCache[key]!==undefined)return affinityCache[key];var sum=0,total=0;
        CORE_ISSUES.forEach(function(i){var weight=Electorate.profile(group,i.id).baselineImportance*(a.priorities.indexOf(i.id)>=0?1.5:1);sum+=issueAffinity(a,group,i.id)*weight;total+=weight;});
        affinityCache[key]=total?sum/total:0;return affinityCache[key];
    }
    function participants(row,party,contest){
        var v=row.county.originalV||row.county.v||{},codes=Object.keys(state().parties),weightSum=0,weights={};
        // Partition once across enabled parties; open-primary independents
        // are assigned one party for the cycle, never counted in two fields.
        codes.forEach(function(code){weights[code]=Math.max(code==='D'||code==='R'?5:0.6,Number(v[code])||0.6);weightSum+=weights[code];});
        var eligible=contest&&contest.eligibility||'semi-open',factor=eligible==='closed'?0.64:eligible==='members'?0.30:eligible==='open'?1:0.84;
        return row.weight*(weights[party]||0)/weightSum*factor;
    }
    function cfipsClean(id){var s=String(id||'').replace(/^c/i,'').padStart(5,'0');return s.length===5?s:String(id||'');}
    function score(a,row,group,contest){
        var code=row.county.s,o=org(a,code),p=state(),c=a.candidate;
        var faction=typeof FACTIONS!=='undefined'&&FACTIONS[c.factionId],core=faction?faction.coreGroups:[];
        var factionFit=core.reduce(function(n,g){return n+Electorate.share(row.county,g);},0)/Math.max(1,core.length);
        var coreEffect=c.groupEffects&&c.groupEffects[group];
        var buff=coreEffect?coreEffect.support||0:((c.groupBoosts||{})[group]||0)+((c.groupDebuffs||{})[group]||0);
        var s=Math.log(0.25+a.awareness)*0.9 + alignment(a,group)*1.4*a.credibility + factionFit*0.6*a.factionLoyalty + buff*0.04;
        s+=(c.charisma||1)*0.1+(a.favorability-0.5)*0.9+a.momentum*0.018+(c.homeState===code?0.42:0);
        if((c.regionalSpillover||[]).indexOf(code)>=0)s+=0.12;

        // Candidate base affinity (e.g. Vance/Harris established tier vs lower baseline candidates)
        var baseAffinity = (a.primaryBaseAffinity !== undefined ? a.primaryBaseAffinity : (c.primaryBaseAffinity !== undefined ? c.primaryBaseAffinity : 0.10));
        s += (baseAffinity - 0.10) * 2.2;

        // Dynamic candidate & faction ideological demographics in county
        var magaShare = (typeof Electorate !== 'undefined') ? (Electorate.share(row.county, 'maga') || 0) : 0;
        var ruralShare = (typeof Electorate !== 'undefined') ? (Electorate.share(row.county, 'rural') || 0) : 0;
        var suburbanShare = (typeof Electorate !== 'undefined') ? (Electorate.share(row.county, 'suburban') || 0) : 0;
        var collegeShare = (typeof Electorate !== 'undefined') ? (Electorate.share(row.county, 'college') || 0) : 0;
        var evangelicalShare = (typeof Electorate !== 'undefined') ? (Electorate.share(row.county, 'evangelical') || 0) : 0;
        var progShare = (typeof Electorate !== 'undefined') ? (Electorate.share(row.county, 'progressives') || 0) : 0;
        var youthShare = (typeof Electorate !== 'undefined') ? (Electorate.share(row.county, 'youth') || 0) : 0;
        var whitecollarShare = (typeof Electorate !== 'undefined') ? (Electorate.share(row.county, 'whitecollar') || 0) : 0;

        if (a.party === 'R') {
            var isMagaCandidate = (c.factionId === 'america_first_conservative' || c.factionId === 'populist_right' || (c.buff && c.buff.indexOf('MAGA') >= 0));
            var isNeverTrumpOrModerate = (c.factionId === 'compassionate_conservative' || c.id === 'cheney' || (c.debuff && c.debuff.indexOf('MAGA') >= 0));
            if (isMagaCandidate) {
                s += (magaShare * 1.6 + ruralShare * 0.9 + evangelicalShare * 0.6) - (suburbanShare * 0.4 + collegeShare * 0.3);
            }
            if (isNeverTrumpOrModerate) {
                s += (suburbanShare * 1.8 + collegeShare * 1.5 + whitecollarShare * 0.8) - (magaShare * 2.2 + ruralShare * 1.2);
            }
            if (c.factionId === 'religious_right') {
                s += evangelicalShare * 1.5 + ruralShare * 0.6;
            }
        } else if (a.party === 'D') {
            var isProgressive = (c.factionId === 'activist_left' || c.factionId === 'outsider_leftist');
            var isPragmatic = (c.factionId === 'pragmatic_moderate' || c.factionId === 'mainstream_liberal');
            if (isProgressive) {
                s += (progShare * 1.7 + youthShare * 1.3 + collegeShare * 0.9) - (ruralShare * 0.6);
            }
            if (isPragmatic) {
                s += (suburbanShare * 1.3 + whitecollarShare * 1.0) - (youthShare * 0.4);
            }
        }

        // Empirical County Factions Data (compiled from OpenElections 2016-2024 primary results)
        var rowFips = cfipsClean(row.id || (row.county && (row.county.fips || row.county.id)));
        if (typeof COUNTY_FACTIONS_DATA !== 'undefined' && COUNTY_FACTIONS_DATA[rowFips]) {
            var cfd = COUNTY_FACTIONS_DATA[rowFips];
            if (a.party === 'R') {
                if (c.factionId === 'america_first_conservative' || c.factionId === 'populist_right') {
                    s += (cfd.magaShare - 0.60) * 1.4;
                } else if (c.factionId === 'compassionate_conservative' || c.id === 'cheney') {
                    s += (cfd.modShare - 0.15) * 1.8 - (cfd.magaShare - 0.60) * 1.5;
                } else if (c.factionId === 'religious_right') {
                    s += (cfd.relShare - 0.20) * 1.6;
                }
            } else if (a.party === 'D') {
                if (c.factionId === 'activist_left' || c.factionId === 'outsider_leftist') {
                    s += (cfd.progShare - 0.35) * 1.6;
                } else if (c.factionId === 'mainstream_liberal' || c.factionId === 'pragmatic_moderate') {
                    s += (cfd.estabShare - 0.65) * 1.4;
                }
            }
        }

        // County Economic Data (Census median income, poverty, agriculture, manufacturing)
        if (typeof COUNTY_ECONOMIC_DATA !== 'undefined' && COUNTY_ECONOMIC_DATA[rowFips]) {
            var ced = COUNTY_ECONOMIC_DATA[rowFips];
            var isWorkingClassPopulist = (c.factionId === 'populist_right' || c.factionId === 'outsider_leftist' || c.factionId === 'activist_left');
            if (isWorkingClassPopulist) {
                s += ((ced.povertyRate || 0.13) - 0.13) * 1.2 + ((ced.mfgIndex || 1) - 1) * 0.15;
            }
            if (c.factionId === 'pragmatic_moderate' || c.factionId === 'compassionate_conservative') {
                var incDelta = ((ced.medianIncome || 68000) - 68000) / 50000;
                s += clamp(incDelta, -0.3, 0.3) * 0.35;
            }
            if (ced.agriIndex && ced.agriIndex > 1.5) {
                s += (ruralShare > 0.4 ? 0.08 : 0);
            }
        }

        s+=Math.min(0.36,o.offices*0.025+o.staff*0.0015+Math.log1p(o.contacts/1000)*0.025+o.volunteers*0.00012);
        if(contest&&contest.type.indexOf('caucus')>=0)s+=Math.min(0.65,o.captains*0.07+o.offices*0.04+o.volunteers*0.00035);
        if(o.gotvUntil>=p.week)s+=0.12;
        var messages=(a.messages[code]||[]).concat(a.messages.National||[]);
        messages.forEach(function(m){var reach=m.countyId&&m.countyId!==row.id?0.12:1;if(m.marketId&&row.county.mediaMarket!==m.marketId)reach=0;if(m.district)reach*=row.districts[m.district]||0;if(m.segment&&m.segment!=='all')reach*=clamp(Electorate.share(row.county,m.segment)*2,0.05,1);
            var fit=m.issueId?issueAffinity(a,group,m.issueId):0;s+=m.strength*reach*(m.negative?Math.max(0.15,(1-fit)/2):m.issueId?fit*0.75+0.25:1);});
        a.endorsements.forEach(function(e){if(!e.state||e.state==='National'||e.state===code)s+=(e.strength===undefined?0.06:e.strength)*(e.group?clamp(Electorate.share(row.county,e.group)*3,0.15,1):1);});
        s+=a.scandals.reduce(function(n,e){return n-(e.remaining>0?e.severity*0.22:0);},0);
        s+=p.economy*(a.party==='R'?-1:0.6)*0.03;
        if(p.nativeCampaign&&typeof PrimaryNative!=='undefined')s+=PrimaryNative.campaignScore(a,row.county,group);
        return s;
    }
    function getBlocAffinity(candFaction, blocId) {
        if (!candFaction) return 0.25;
        if (blocId === 'prog') {
            if (candFaction === 'activist_left' || candFaction === 'outsider_leftist') return 1.0;
            if (candFaction === 'mainstream_liberal') return 0.35;
            if (candFaction === 'pragmatic_moderate') return 0.10;
            return 0.15;
        }
        if (blocId === 'estab_lib') {
            if (candFaction === 'mainstream_liberal') return 1.0;
            if (candFaction === 'activist_left') return 0.45;
            if (candFaction === 'pragmatic_moderate') return 0.55;
            return 0.20;
        }
        if (blocId === 'estab_mod') {
            if (candFaction === 'pragmatic_moderate') return 1.0;
            if (candFaction === 'mainstream_liberal') return 0.50;
            if (candFaction === 'activist_left') return 0.10;
            return 0.20;
        }
        if (blocId === 'maga') {
            if (candFaction === 'america_first_conservative' || candFaction === 'populist_right') return 1.0;
            if (candFaction === 'religious_right') return 0.40;
            if (candFaction === 'compassionate_conservative') return 0.12;
            return 0.15;
        }
        if (blocId === 'rel') {
            if (candFaction === 'religious_right') return 1.0;
            if (candFaction === 'america_first_conservative' || candFaction === 'populist_right') return 0.55;
            if (candFaction === 'compassionate_conservative') return 0.35;
            return 0.15;
        }
        if (blocId === 'mod') {
            if (candFaction === 'compassionate_conservative' || candFaction === 'unaligned_center') return 1.0;
            if (candFaction === 'religious_right') return 0.25;
            if (candFaction === 'america_first_conservative' || candFaction === 'populist_right') return 0.12;
            return 0.15;
        }
        return 1.0;
    }

    function truth(party,code,contest,options){
        options=options||{};var active=roster(party),votes={},districts={},counties={},countyCells={},groups={},turnout=0,p=state();
        if(!active.length)return {votes:{},shares:{},districts:{},counties:{},groups:{},turnout:0,undecided:1};
        active.forEach(function(a){votes[a.id]=0;});
        var rows=code?geography[code]||[]:Object.keys(geography).filter(function(c){return c!=='DA'||party==='D';}).reduce(function(all,c){return all.concat(geography[c]);},[]);
        rows.forEach(function(row){var eligible=participants(row,party,contest),local={};countyCells[row.id]=[];active.forEach(function(a){local[a.id]=0;});
            var rowScoreCache={};
            var fData = (typeof COUNTY_FACTIONS_DATA !== 'undefined' && COUNTY_FACTIONS_DATA[row.id]) ? COUNTY_FACTIONS_DATA[row.id] : null;
            var blocs = [];
            if (party === 'D') {
                var pShare = fData ? fData.progShare : 0.40;
                var eShare = fData ? fData.estabShare : 0.60;
                blocs = [
                    { id: 'prog', share: pShare },
                    { id: 'estab_lib', share: eShare * 0.55 },
                    { id: 'estab_mod', share: eShare * 0.45 }
                ];
            } else if (party === 'R') {
                var mShare = fData ? fData.magaShare : 0.52;
                var rShare = fData ? fData.relShare : 0.24;
                var cShare = fData ? fData.modShare : 0.24;
                blocs = [
                    { id: 'maga', share: mShare },
                    { id: 'rel', share: rShare },
                    { id: 'mod', share: cShare }
                ];
            } else {
                blocs = [{ id: 'all', share: 1.0 }];
            }

            row.cells.forEach(function(cell){
                var logs=active.map(function(a){
                    var cacheKey=a.id+'|'+cell.group;
                    if(rowScoreCache[cacheKey]===undefined){rowScoreCache[cacheKey]=score(a,row,cell.group,contest);}
                    return rowScoreCache[cacheKey]+(options.noise?options.noise[a.id]||0:0);
                });
                var caucus=contest&&contest.type.indexOf('caucus')>=0;
                var enthusiasm=active.reduce(function(n,a){return n+a.favorability+a.awareness;},0)/active.length/2;
                var weather=state().weather[row.county.s]||0;
                var rate=clamp((caucus?0.15:0.43)*(0.65+enthusiasm)*(1-weather*(caucus?0.35:0.15)),0.02,0.8);

                // Nested logit: candidates divide factional voting blocs
                var preferences = active.map(function(){ return 0; });
                blocs.forEach(function(bloc) {
                    if (bloc.share <= 0) return;
                    var blocScores = active.map(function(a, idx) {
                        var aff = getBlocAffinity(a.candidate && a.candidate.factionId, bloc.id);
                        return logs[idx] + 1.6 * Math.log(aff + 0.001);
                    });
                    var bMax = Math.max.apply(null, blocScores);
                    var bWeights = blocScores.map(function(s) { return Math.exp(s - bMax); });
                    var bSum = bWeights.reduce(function(a, b) { return a + b; }, 0) || 1;
                    bWeights.forEach(function(w, idx) {
                        preferences[idx] += bloc.share * (w / bSum);
                    });
                });

                var nativeResponse=p.nativeCampaign&&typeof PrimaryNative!=='undefined'?PrimaryNative.voterResponse(row.county,cell.group,preferences,rate,party):null;
                if(nativeResponse)preferences=nativeResponse.preferences;
                var cohorts=(p.departures||[]).filter(function(d){return d.party===party;});
                var masses=cohorts.map(function(d){
                    var weeksSince=Math.max(0, p.week-d.week);
                    var ramp=clamp(0.35 + weeksSince * 0.22, 0.35, 1.0);
                    return (d.shares[row.county.s]||0)*ramp*Math.exp(-weeksSince/24);
                }),mass=masses.reduce(function(a,b){return a+b;},0),scale=mass>0.75?0.75/mass:1;
                if(mass>0){preferences=preferences.map(function(v){return v*(1-mass*scale);});cohorts.forEach(function(d,k){
                    var source=actor(d.id),target=active.findIndex(function(a){return a.id===d.endorseeId;}),fraction=target>=0?d.fraction:0;
                    var rest=active.map(function(a){return Math.exp(similarity(source,a)*2.2+alignment(a,cell.group)*0.6);});
                    var rs=rest.reduce(function(a,b){return a+b;},0)||1,cohort=masses[k]*scale;
                    active.forEach(function(a,i){preferences[i]+=cohort*((i===target?fraction:0)+(1-fraction)*0.88*rest[i]/rs);});
                });}
                if(nativeResponse)preferences=preferences.map(function(v,i){return v*nativeResponse.rates[i]/Math.max(0.001,rate);});
                var total=eligible*cell.weight*rate,participation=preferences.reduce(function(a,b){return a+b;},0);if(participation*rate>1){preferences=preferences.map(function(v){return v/(participation*rate);});participation=1/rate;}turnout+=total*participation;
                countyCells[row.id].push({group:cell.group,candidateIds:active.map(function(a){return a.id;}),votes:preferences.map(function(v){return total*v;}),total:total*participation,weight:cell.weight});
                if(!groups[cell.group])groups[cell.group]={votes:{},turnout:0};groups[cell.group].turnout+=total*participation;
                active.forEach(function(a,i){var v=total*preferences[i];votes[a.id]+=v;local[a.id]+=v;groups[cell.group].votes[a.id]=(groups[cell.group].votes[a.id]||0)+v;});
            });
            counties[row.id]=local;
            Object.keys(row.districts).forEach(function(d){if(!districts[d])districts[d]={};active.forEach(function(a){districts[d][a.id]=(districts[d][a.id]||0)+local[a.id]*row.districts[d];});});
        });
        var shares={};Object.keys(votes).forEach(function(id){shares[id]=turnout?votes[id]/turnout:0;});
        var awareness=active.reduce(function(n,a){return n+a.awareness;},0)/active.length;
        return {votes:votes,shares:shares,districts:districts,counties:counties,countyCells:countyCells,groups:groups,turnout:Math.round(turnout),undecided:clamp(0.32-awareness*0.20-p.week*0.003,0.025,0.3)};
    }
    function getPoll(party,code){
        if(!state()||!state().parties[party])return [];
        var key=party+'|'+(code||'National')+'|'+state().revision;if(pollCache[key])return pollCache[key];
        var c=getContests(party).find(function(x){return x.state===code&&x.delegates>0;});
        if(c&&c.status==='complete'&&c.result){var finalRows=roster(party,true).map(function(a){return {id:a.id,name:a.candidate.name,share:c.result.shares[a.id]||0,delegates:state().parties[party].delegates[a.id]||0,status:a.status,funds:a.funds,color:a.color,candidate:a.candidate};}).sort(function(a,b){return b.share-a.share;});finalRows.undecided=0;finalRows.isFinal=true;finalRows.date=c.date;finalRows.sample=0;finalRows.marginOfError=0;pollCache[key]=finalRows;return finalRows;}
        var raw=truth(party,code,c),weights={},sum=0;
        Object.keys(raw.shares).forEach(function(id){weights[id]=Math.max(0.001,raw.shares[id]+(stable(state().seed+'poll'+state().week+party+code+id)-0.5)*0.035);sum+=weights[id];});
        var list=roster(party,true).map(function(a){return {id:a.id,name:a.candidate.name,share:(weights[a.id]||0)/sum*100,delegates:state().parties[party].delegates[a.id]||0,status:a.status,funds:a.funds,color:a.color,candidate:a.candidate};}).sort(function(a,b){return b.share-a.share||a.id.localeCompare(b.id);});
        list.undecided=raw.undecided;list.sample=800;list.marginOfError=3.5;list.date=state().date;pollCache[key]=list;return list;
    }
    function publishPolls(){var p=state();Object.keys(p.parties).forEach(function(party){var rows=getPoll(party,null);p.pollHistory.push({date:p.date,week:p.week,party:party,state:null,undecided:rows.undecided,sample:800,marginOfError:3.5,rows:copy(rows)});upcoming(party,3).forEach(function(c){var local=getPoll(party,c.state);p.pollHistory.push({date:p.date,week:p.week,party:party,state:c.state,undecided:local.undecided,sample:600,marginOfError:4,rows:copy(local)});});});p.pollHistory=p.pollHistory.slice(-1200);}
    function queueAction(type,code,options){return queueFor(player(),type,code,options||{},true);}
    function queueFor(a,type,code,options,isPlayer){
        var p=state(),cost=actionCosts[type];if(!p||p.ended||!a||a.status==='suspended')return {ok:false,error:'This campaign is not active.'};
        if(p.phase==='general'&&isPlayer&&!['ballotAccess','unity','endorser'].includes(type))return {ok:false,error:'Use your general-election campaign controls for this action. Coalition and ballot organizing remain available here.'};
        if(!cost)return {ok:false,error:'Unknown campaign action.'};
        if(!PrimaryRules.jurisdictions[code])return {ok:false,error:'Choose a state or territory.'};
        var intensity=clamp(Math.floor(Number(options.intensity)||1),1,3),duration=clamp(Math.floor(Number(options.duration)||1),1,4);
        if(['office','fundraise','donor','debatePrep','research','poll','rest'].includes(type))intensity=1;
        options=Object.assign({},options,{intensity:intensity,duration:duration});
        if(options.segment==='all')options.segment=null;
        if(options.district){options.district=Number(String(options.district).replace(/^CD/,''));if(!Number.isInteger(options.district)||options.district<1||options.district>Math.max(1,PrimaryRules.jurisdictions[code].house))return {ok:false,error:'Choose a district within this state.'};}
        if(options.marketId){if(!MEDIA_MARKETS[options.marketId]||!MEDIA_MARKETS[options.marketId].states.includes(code))return {ok:false,error:'Choose a media market covering this state.'};if(options.channel!=='tv')options.marketId=null;else if(options.district||options.countyId)return {ok:false,error:'A television market buy uses the whole market. Choose statewide district targeting for this buy.'};}
        if(options.countyId&&(!Counties.countyData[options.countyId]||Counties.countyData[options.countyId].s!==code))return {ok:false,error:'Choose a county in this state.'};
        if(options.issueId&&!CORE_ISSUES.some(function(i){return i.id===options.issueId;}))return {ok:false,error:'Choose an available issue.'};
        if(options.targetId&&(!actor(options.targetId)||options.targetId===a.id||actor(options.targetId).party!==a.party))return {ok:false,error:'Choose another candidate in your primary.'};
        if(['attack','research'].includes(type)&&!options.targetId)return {ok:false,error:'Choose an opponent.'};
        if(type==='endorser'&&!(typeof ENDORSERS!=='undefined'&&ENDORSERS.some(function(e){return e.id===options.endorserId;})))return {ok:false,error:'Choose an endorser.'};
        var queued=p.pendingActions.filter(function(q){return q.actorId===a.id;}),physical=['rally','townhall','canvass','captains','fundraise','donor','unity','endorser'].includes(type);
        if(queued.filter(function(q){return q.type===type&&q.state===code;}).length>=2)return {ok:false,error:'Limit two of the same action in a state each week.'};
        var visited=Array.from(new Set(queued.filter(function(q){return q.physical;}).map(function(q){return q.state;})));
        if(physical&&visited.indexOf(code)<0&&visited.length>=3)return {ok:false,error:'You can visit at most three states per week.'};
        if(queued.length>=18)return {ok:false,error:'The campaign has reached its weekly planning capacity.'};
        var o=org(a,code);
        if(type==='canvass'&&(o.offices<1||o.staff<10))return {ok:false,error:'Canvassing requires an existing office and 10 staff.'};
        if(type==='office'&&o.offices>=8)return {ok:false,error:'This state has the maximum eight field offices.'};
        if(type==='gotv'&&!upcoming(a.party,200).some(function(c){return c.state===code&&c.date<=PrimaryRules.datePlus(p.date,28);})&&a.party!=='I')return {ok:false,error:'GOTV is available during the four weeks before voting.'};
        if(type==='research'&&(a.research[options.targetId]||0)>p.week)return {ok:false,error:'Research on this candidate is still cooling down.'};
        if(type==='ballotAccess'&&p.date>='2028-09-05')return {ok:false,error:'The scenario ballot-access filing window has closed.'};
        var money=cost.funds*intensity*((type==='ad'||type==='attack')?duration:1),energy=cost.energy;
        if(type==='ad'&&options.marketId)money=Math.max(0.15,DigitalAds.getTVCost(options.marketId,intensity,duration)*8);
        if(a.funds+1e-8<money||a.energy<energy)return {ok:false,error:'Insufficient money or energy.'};
        a.funds-=money;a.energy-=energy;a.spent+=money;
        p.pendingActions.push({actorId:a.id,type:type,state:code,options:options,funds:money,energy:energy,physical:physical});
        if(isPlayer)refresh();return {ok:true};
    }
    function cancelAction(index){var p=state(),q=p&&p.pendingActions[index];if(!q||q.actorId!==p.playerId)return {ok:false,error:'Action not found.'};var a=actor(q.actorId);a.funds+=q.funds;a.energy=Math.min(a.maxEnergy,a.energy+q.energy);a.spent-=q.funds;p.pendingActions.splice(index,1);refresh();return {ok:true};}
    function message(a,code,strength,options,weeks){a.messages[code]=a.messages[code]||[];a.messages[code].push({strength:strength,negative:!!options.negative,sourceId:options.sourceId||a.id,issueId:options.issueId||a.priorities[0],segment:options.segment||null,countyId:options.countyId||null,marketId:options.marketId||null,district:options.district||null,remaining:weeks||2});}
    function perform(q){
        var p=state(),a=actor(q.actorId);if(!a||a.status==='suspended')return;
        var op=q.options,o=org(a,q.state),intensity=op.intensity,target=actor(op.targetId),fatigueKey=q.type+'-'+q.state,repeat=a.fatigue[fatigueKey]||0,efficiency=1/(1+repeat*0.25);
        a.fatigue[fatigueKey]=repeat+1;
        var market=typeof STATE_FUNDRAISING_POTENTIAL!=='undefined'?STATE_FUNDRAISING_POTENTIAL[q.state]||1:1;
        switch(q.type){
            case 'rally': case 'townhall':
                message(a,q.state,(q.type==='rally'?0.16:0.11)*intensity*efficiency,op,3);a.awareness=clamp(a.awareness+0.008*intensity,0,1);o.volunteers=Math.min(1000,o.volunteers+15*intensity);a.generalStrength[q.state]=(a.generalStrength[q.state]||0)+0.08*efficiency;break;
            case 'office':o.offices=Math.min(8,o.offices+1);o.volunteers+=25;break;
            case 'staff':o.staff=Math.min(60,o.staff+10*intensity);break;
            case 'files':o.file=Math.min(1,o.file+0.12*intensity);break;
            case 'canvass':var contacts=Math.round((o.staff*75+o.volunteers*12)*(0.5+o.file)*intensity);o.contacts+=contacts;o.volunteers=Math.min(1000,o.volunteers+8*intensity);message(a,q.state,0.11*intensity*efficiency,op,4);break;
            case 'captains':o.captains=Math.min(12,o.captains+intensity);o.volunteers=Math.min(1000,o.volunteers+25*intensity);break;
            case 'gotv':o.gotvUntil=p.week+2;break;
            case 'fundraise': case 'donor':
                var gain=(q.type==='fundraise'?0.55+Math.log1p(a.donors/1000)*0.48:0.65+market*0.22)*(0.7+a.awareness)*(1+a.momentum*0.015)*efficiency;
                a.funds+=gain;a.raised+=gain;a.donors+=Math.round(q.type==='fundraise'?120+180*a.awareness:30);
                if(q.type==='donor'){a.factionLoyalty=clamp(a.factionLoyalty-0.006,0.4,1.2);a.donorLocks=a.donorLocks||{};var pledgedIssue=op.issueId||a.priorities[0];a.donorLocks[pledgedIssue]={positionId:a.platform[pledgedIssue],untilWeek:p.week+4};if(a.id===p.playerId)log('Donors backed your existing '+IssueModel.getIssue(pledgedIssue).name+' position. You committed to retain it for four weeks.','policy');}break;
            case 'ad':message(a,op.marketId?'National':q.state,0.12*intensity*efficiency*(op.channel==='digital'?0.85:1)/Math.sqrt(Math.max(1,market/2)),op,op.duration+1);a.awareness=clamp(a.awareness+0.012*intensity,0,1);break;
            case 'attack':
                if(typeof PrimaryNegotiations!=='undefined')PrimaryNegotiations.recordAttack(a.id,target.id);
                message(target,q.state,-0.13*intensity*efficiency*(0.5+a.credibility/2),Object.assign({},op,{negative:true,sourceId:a.id}),op.duration+1);
                target.relationships[a.id]=target.relationships[a.id]||{opinion:0,trust:0.5};target.relationships[a.id].opinion=clamp(target.relationships[a.id].opinion-0.18,-1,1);
                a.unity=clamp(a.unity-0.025*intensity,0,1);a.favorability=clamp(a.favorability-0.007*intensity,0,1);break;
            case 'debatePrep':a.debatePrep=Math.min(3,a.debatePrep+1);break;
            case 'research':a.research[target.id]=p.week+5;if(random()>0.5+(target.candidate.scandalResistance||0.3)*0.3){target.scandals.push({id:'oppo-'+p.week+'-'+a.id,severity:0.4+random()*0.4,remaining:5,label:'Scrutiny of the candidate’s campaign record'});log(a.candidate.name+' released opposition research about '+target.candidate.name+'.','scandal');}else if(a.id===p.playerId)log('Opposition research found no substantiated new story.','scandal');break;
            case 'unity':a.unity=clamp(a.unity+0.035*intensity,0,1);a.factionLoyalty=clamp(a.factionLoyalty+0.025,0.4,1.2);a.favorability=clamp(a.favorability+0.01,0,1);if(p.phase==='general')Object.values(Counties.countyData).forEach(function(c){if(c.s===q.state){c.partyMobilization=c.partyMobilization||{};c.partyMobilization[a.party]=Math.min(0.12,(c.partyMobilization[a.party]||0)+0.003*intensity);}});break;
            case 'ballotAccess':a.ballotAccess[q.state]=Math.min(100,(a.ballotAccess[q.state]||0)+35*intensity);break;
            case 'endorser':courtEndorser(a,op.endorserId,intensity);break;
            case 'poll':var raw=truth(a.party,q.state,getContests(a.party).find(function(c){return c.state===q.state;}));p.pollHistory.push({date:p.date,party:a.party,state:q.state,internal:true,undecided:raw.undecided,sample:1600,marginOfError:2.5,rows:Object.keys(raw.shares).map(function(id){return {id:id,name:actor(id).candidate.name,share:raw.shares[id]*100,color:actor(id).color};}),groups:raw.groups});break;
            case 'rest':a.favorability=clamp(a.favorability+0.004,0,1);break;
        }
        a.record.push({date:p.date,type:q.type,state:q.state,issueId:op.issueId||null});
    }
    function courtEndorser(a,id,intensity){var p=state(),e=ENDORSERS.find(function(x){return x.id===id;});if(!e)return;
        p.endorserSupport[id]=p.endorserSupport[id]||{};var score=(p.endorserSupport[id][a.id]||0)+intensity*(12+12*((e.factionPreferences||{})[a.candidate.factionId]||0.2))*a.credibility;
        p.endorserSupport[id][a.id]=score;
        if(score>=75&&(!p.endorserAssignments[id]||p.endorserAssignments[id]===a.id)){
            if(!p.endorserAssignments[id]){p.endorserAssignments[id]=a.id;a.endorsements.push({id:id,name:e.name,state:e.state,group:e.targetGroupId,strength:e.baseInfluence||0.08});a.momentum=clamp(a.momentum+2,-20,20);log(e.name+' endorsed '+a.candidate.name+'.','endorsement');}
        }
    }
    function setPlatform(issueId,positionId){var a=player(),issue=IssueModel.getIssue(issueId),pos=IssueModel.positions.find(function(p){return p.id===positionId;});
        if(!state()||state().ended)return {ok:false,error:'This campaign has ended.'};
        if(!a||!issue||!pos)return {ok:false,error:'Choose a valid issue and position.'};
        if(typeof PrimaryNegotiations!=='undefined'&&PrimaryNegotiations.policyLocked(a.id,issue.id,positionId))return {ok:false,error:'An active agreement binds this position. Renegotiate or break it first.'};
        if(state().phase==='general'&&gameData.lockedIssues&&gameData.lockedIssues[issue.id])return {ok:false,error:'This position is locked by an active PAC agreement.'};
        var distance=Math.abs(IssueModel.index(a.platform[issue.id])-pos.index);if(!distance)return {ok:true};
        a.platform[issue.id]=pos.id;a.candidate.issuePositions[issue.id]=pos.value;a.candidate.stances[issue.id]=pos.id;a.credibility=clamp(a.credibility-distance*0.028,0.1,1);a.favorability=clamp(a.favorability-distance*0.008,0,1);
        log(a.candidate.name+' adopted '+pos.label+' on '+issue.name+'.','policy');touch();refresh();return {ok:true};}
    function setPriorities(ids){if(!state()||state().ended)return {ok:false,error:'This campaign has ended.'};if(!Array.isArray(ids)||new Set(ids).size!==ids.length||ids.length<1||ids.length>3||ids.some(function(id){return !IssueModel.getIssue(id);}))return {ok:false,error:'Choose one to three different issues.'};player().priorities=ids.slice();refresh();return {ok:true};}
    function protestShare(c){if(!c.allowUncommitted)return 0;var active=roster(c.party),unity=active.reduce(function(n,a){return n+a.unity;},0)/Math.max(1,active.length);return clamp(0.01+(1-unity)*0.20,0.01,0.23);}
    function freezeEarly(c,date){
        if(c.status!=='scheduled'||!c.earlyShare||date<c.earlyStart)return;
        var days=(new Date(date+'T12:00:00Z')-new Date(c.earlyStart+'T12:00:00Z'))/86400000;
        var desired=clamp(days/21,0,1)*c.earlyShare,delta=desired-c.earlyWeight;if(delta<=0)return;
        var raw=truth(c.party,c.state,c);c.earlyBallots=c.earlyBallots||{};c.earlyDistricts=c.earlyDistricts||{};
        var protest=protestShare(c);Object.keys(raw.shares).forEach(function(id){c.earlyBallots[id]=(c.earlyBallots[id]||0)+raw.shares[id]*(1-protest)*delta;});if(protest)c.earlyBallots.UNCOMMITTED=(c.earlyBallots.UNCOMMITTED||0)+protest*delta;
        Object.keys(raw.districts).forEach(function(d){var total=Object.values(raw.districts[d]).reduce(function(a,b){return a+b;},0);c.earlyDistricts[d]=c.earlyDistricts[d]||{};Object.keys(raw.districts[d]).forEach(function(id){c.earlyDistricts[d][id]=(c.earlyDistricts[d][id]||0)+(total?raw.districts[d][id]/total:0)*(1-protest)*delta;});if(protest)c.earlyDistricts[d].UNCOMMITTED=(c.earlyDistricts[d].UNCOMMITTED||0)+protest*delta;});
        c.earlyWeight=desired;
    }
    function realign(votes,c){if(!c.realignment)return votes;var total=Object.values(votes).reduce(function(a,b){return a+b;},0),viable=Object.keys(votes).filter(function(id){return votes[id]>=total*0.15;});if(!viable.length)return votes;
        var result=Object.assign({},votes);Object.keys(votes).filter(function(id){return viable.indexOf(id)<0;}).forEach(function(id){var weights={};viable.forEach(function(other){weights[other]=Math.exp(similarity(actor(id),actor(other))*2)*(1+(org(actor(other),c.state).captains||0)*0.08);});var sum=Object.values(weights).reduce(function(a,b){return a+b;},0);viable.forEach(function(other){result[other]+=votes[id]*weights[other]/sum;});result[id]=0;});return result;}
    function resolveContest(c){
        var noise={};roster(c.party).forEach(function(a){noise[a.id]=(stable(state().seed+'result'+c.id+a.id)-0.5)*0.14;});
        var raw=truth(c.party,c.state,c,{noise:noise}),firstPreferences=Object.assign({},raw.shares),caucusRounds=[];
        if(c.realignment){var finalVotes={},districtVotes={};(geography[c.state]||[]).forEach(function(row){var before=raw.counties[row.id]||{},after=realign(before,c);caucusRounds.push({county:row.id,first:before,final:after});Object.keys(after).forEach(function(id){finalVotes[id]=(finalVotes[id]||0)+after[id];});Object.keys(row.districts).forEach(function(d){districtVotes[d]=districtVotes[d]||{};Object.keys(after).forEach(function(id){districtVotes[d][id]=(districtVotes[d][id]||0)+after[id]*row.districts[d];});});});var allVotes=Object.values(finalVotes).reduce(function(a,b){return a+b;},0);raw.votes=finalVotes;raw.districts=districtVotes;Object.keys(finalVotes).forEach(function(id){raw.shares[id]=allVotes?finalVotes[id]/allVotes:0;});}
        var protest=protestShare(c),weights={},ids=Array.from(new Set(Object.keys(raw.shares).concat(Object.keys(c.earlyBallots||{}))));
        
        // Retain cast early ballots and residual same-day votes for candidates who suspended after early voting began
        var isCaucus = c.type.indexOf('caucus') >= 0;
        var p = state();
        Object.values(p.actors).forEach(function(act){
            if(act.party === c.party && act.status === 'suspended' && act.suspendedDate && act.suspendedDate >= c.earlyStart){
                if(ids.indexOf(act.id) < 0) ids.push(act.id);
                var earlyVotes = c.earlyBallots ? (c.earlyBallots[act.id] || 0) : 0;
                // For primaries (not caucuses), retain small residual vote from voters casting ballot for printed name
                var residualDay = isCaucus ? 0 : Math.max(0.004, (firstPreferences[act.id] || 0.02) * 0.12 * (1 - c.earlyWeight));
                weights[act.id] = earlyVotes + residualDay;
            }
        });

        if(protest&&!ids.includes('UNCOMMITTED'))ids.push('UNCOMMITTED');
        ids.forEach(function(id){
            if(weights[id] === undefined){
                weights[id]=(id==='UNCOMMITTED'?protest:(raw.shares[id]||0)*(1-protest))*(1-c.earlyWeight)+(c.earlyBallots[id]||0);
            }
        });
        if(!ids.length)return null;
        var turnout=c.delegates===0?Math.round(raw.turnout*0.12):raw.turnout;
        // Advisory Nevada participants are a separate small pool.
        if(c.id==='R-NV')turnout=Math.round(turnout*0.88);
        var votes=PrimaryRules.apportion(weights,turnout,ids),delegates={},poolResults=[];
        c.pools.forEach(function(pool){var pv=votes;
            if(pool.district && raw.districts[pool.district]){var district=raw.districts[pool.district],sum=Object.values(district).reduce(function(a,b){return a+b;},0),dw={};ids.forEach(function(id){dw[id]=(id==='UNCOMMITTED'?protest:(sum?(district[id]||0)/sum:0)*(1-protest))*(1-c.earlyWeight)+(((c.earlyDistricts||{})[pool.district]||{})[id]||0);});pv=PrimaryRules.apportion(dw,Math.max(1,Math.round(sum)),ids);}
            var allocation=PrimaryRules.allocate(pv,pool,c.party,ids);Object.keys(allocation.delegates).forEach(function(id){delegates[id]=(delegates[id]||0)+allocation.delegates[id];});
            poolResults.push(Object.assign({id:pool.id,name:pool.name,votes:pv,binding:pool.binding,district:pool.district||null,total:pool.delegates},allocation));
        });
        var shares={};Object.keys(votes).forEach(function(id){shares[id]=turnout?votes[id]/turnout*100:0;});
        return {votes:votes,shares:shares,delegates:delegates,turnout:turnout,pools:poolResults,earlyShare:c.earlyWeight,firstPreferences:firstPreferences,realigned:c.realignment,caucusRounds:caucusRounds,countyFirstPreferenceEstimates:raw.counties,districtGeography:'Modeled fractional county districts; not certified boundaries',caucusGeography:'County assemblies stand in for precinct rooms; local viability and realignment are modeled separately'};
    }
    function recordContest(c,result){
        if(!result||c.status==='complete')return;c.result=result;c.status='complete';var ps=state().parties[c.party];
        Object.keys(result.delegates).forEach(function(id){ps.delegates[id]=(ps.delegates[id]||0)+result.delegates[id];});
        var rank=Object.keys(result.votes).sort(function(a,b){return result.votes[b]-result.votes[a]||a.localeCompare(b);}),winner=actor(rank[0]);
        if(winner){if(c.delegates){winner.momentum=clamp(winner.momentum+3,-20,20);winner.awareness=clamp(winner.awareness+0.035,0,1);winner.funds+=Math.min(2,c.delegates*0.015);}
            log(c.party+' · '+c.name+': '+winner.candidate.name+' leads with '+result.shares[winner.id].toFixed(1)+'%; '+c.delegates+' delegates allocated.','result');}
        roster(c.party).forEach(function(a){if(a!==winner)a.momentum=clamp(a.momentum-0.8,-20,20);});
        checkNomination(c.party);
    }
    function checkNomination(party){var ps=state().parties[party];if(ps.stage==='nominated'||ps.stage==='convention')return;
        var winner=ps.roster.find(function(id){return ps.delegates[id]>=ps.majority&&ps.totalDelegates>0;});
        if(winner&&ps.stage!=='presumptive'){ps.stage='presumptive';ps.nomineeId=winner;actor(winner).status='nominated';log(actor(winner).candidate.name+' clinched a pledged-delegate majority in the '+party+' nomination. The convention still ratifies the ticket.','nomination');
            if(party===state().playerParty){state().generalReady=winner===state().playerId;if(winner!==state().playerId)state().defeat={party:party,winnerId:winner};}}
    }
    function selectDelegates(c){
        if(c.selected||c.status!=='complete')return;c.selected=true;c.selectedDelegates=copy(c.result.delegates);
        // D at-large / PLEO delegates for withdrawn candidates are selected
        // later; district allocations remain an honest record of the vote.
        if(c.party==='D')c.result.pools.filter(function(pool){return !pool.district;}).forEach(function(pool){
            var released=0,weights={};Object.keys(pool.delegates).forEach(function(id){if(actor(id)&&actor(id).status==='suspended'){released+=pool.delegates[id];c.selectedDelegates[id]-=pool.delegates[id];state().parties.D.delegates[id]-=pool.delegates[id];}else weights[id]=pool.votes[id]||0;});
            if(released){if(!Object.keys(weights).length)roster('D').forEach(function(a){weights[a.id]=1;});var reassigned=PrimaryRules.apportion(weights,released,Object.keys(weights));Object.keys(reassigned).forEach(function(id){c.selectedDelegates[id]=(c.selectedDelegates[id]||0)+reassigned[id];state().parties.D.delegates[id]=(state().parties.D.delegates[id]||0)+reassigned[id];});log(c.name+' selected '+released+' at-large/PLEO delegates anew after withdrawals; the original popular-vote result is retained.','delegates');}
        });
        checkNomination(c.party);
    }
    function aiPlan(a){
        var p=state(),ps=p.parties[a.party];if(a.id===p.playerId||a.status==='suspended'||ps.stage==='nominated'||(p.phase==='general'&&ps.nomineeId===a.id))return;
        var next=upcoming(a.party,16).filter(function(c){return c.delegates>0;});if(!next.length&&a.party!=='I')return;
        var ranked=next.map(function(c){var poll=getPoll(a.party,c.state).find(function(r){return r.id===a.id;}),share=poll?poll.share:0,days=Math.max(7,(new Date(c.date)-new Date(p.date))/86400000);
            return {c:c,score:(c.delegates+5)/(1+days/14)*(0.2+Math.max(0,1-Math.abs(share-23)/50))*(c.state===a.candidate.homeState?1.5:1)};}).sort(function(x,y){return y.score-x.score;});
        var code=ranked.length?ranked[0].c.state:a.candidate.homeState||'PA',o=org(a,code),op={intensity:1,issueId:a.priorities[p.week%a.priorities.length]};
        if(p.nativeCampaign&&typeof PrimaryNative!=='undefined'&&STATES[code]){PrimaryNative.planActor(a,code,op);return;}
        if(a.funds<4)queueFor(a,'fundraise',code,op,false);
        if(o.offices<1&&a.funds>6)queueFor(a,'office',code,op,false);
        if(o.staff<10&&o.offices>0)queueFor(a,'staff',code,op,false);
        if(ranked[0]&&ranked[0].c.type.indexOf('caucus')>=0&&o.captains<3)queueFor(a,'captains',code,op,false);
        queueFor(a,o.offices&&o.staff>=10?'canvass':'townhall',code,op,false);
        if(a.funds>8)queueFor(a,'ad',code,Object.assign({},op,{duration:2,channel:'digital'}),false);
        if(p.week%4===1&&a.energy>0&&a.funds>4){var lead=getPoll(a.party,code).find(function(r){return r.id!==a.id&&r.status==='active';}),pact=lead&&typeof PrimaryNegotiations!=='undefined'&&PrimaryNegotiations.activeContracts().some(function(c){return c.type==='nonaggression'&&[c.fromId,c.toId].includes(a.id)&&[c.fromId,c.toId].includes(lead.id);});if(lead&&!pact&&((typeof AI_CANDIDATE_PERSONALITIES!=='undefined'&&AI_CANDIDATE_PERSONALITIES[a.id]==='aggressive')||a.badWeeks>1))queueFor(a,'attack',code,Object.assign({},op,{targetId:lead.id}),false);}
        if(p.week%4===2)queueFor(a,'debatePrep',code,op,false);
        if(p.week%5===0&&typeof ENDORSERS!=='undefined'){var end=ENDORSERS.slice().sort(function(x,y){return ((y.factionPreferences||{})[a.candidate.factionId]||0)-((x.factionPreferences||{})[a.candidate.factionId]||0);})[0];if(end)queueFor(a,'endorser',code,{endorserId:end.id,intensity:1},false);}
        if(a.unity<0.65)queueFor(a,'unity',code,op,false);
        if(a.party!=='D'&&a.party!=='R'){var need=Object.keys(STATES).find(function(c){return a.ballotAccess[c]<100;});if(need)queueFor(a,'ballotAccess',need,{intensity:2},false);}
    }
    function prepareBackgroundAI(){
        var p=state();if(!p||p.ended||p.phase==='general')return;
        setTimeout(function(){
            try{
                var p=state();if(!p||p.ended)return;
                p.pendingActions=p.pendingActions.filter(function(q){return q.actorId===p.playerId;});
                Object.values(p.actors).forEach(function(a){
                    if(a.id!==p.playerId&&a.status!=='suspended'){
                        aiPlan(a);
                    }
                });
            }catch(e){console.warn('Background AI preparation notice:',e);}
        },40);
    }
    function considerDropouts(){
        var p=state();
        Object.keys(p.parties).forEach(function(party){
            var ps=p.parties[party], active=roster(party);
            if(active.length<2||ps.stage==='convention'||ps.stage==='nominated')return;
            var completed=getContests(party).filter(function(c){return c.delegates&&c.status==='complete';});
            if(completed.length<1)return;
            var completedCount=completed.length;
            var isSuperTuesday = completedCount >= 5 || p.date >= '2028-03-07';
            var remaining=getContests(party).filter(function(c){return c.status==='scheduled';}).reduce(function(n,c){return n+c.delegates;},0);
            var poll=getPoll(party,null), leader=poll[0];
            active.forEach(function(a){
                if(a.id===p.playerId||a.id===ps.nomineeId||roster(party).length<2)return;
                var candRow=poll.find(function(r){return r.id===a.id;});
                var share=candRow ? candRow.share : 0;
                var delCount=ps.delegates[a.id]||0;
                // Candidates suspend after repeatedly losing contests, running low on funds, or having no path to delegates
                // On/after Super Tuesday, non-viable candidates with 0 delegates face intense field-clearing pressure
                var weak = (share < 8.5) || (a.funds < 0.6) || (completedCount >= 2 && delCount === 0 && share < 14) || (delCount + remaining < ps.majority && share < 16) || (isSuperTuesday && delCount === 0 && share < 12);
                a.badWeeks = weak ? a.badWeeks + 1 : Math.max(0, a.badWeeks - 1);
                var homeComing = upcoming(party, 5).some(function(c){return c.state===a.candidate.homeState;});
                if(a.badWeeks >= (homeComing ? 4 : 2) && leader && leader.id !== a.id){
                    // Weigh potential endorsement targets with empirical faction synergy
                    var sourceFaction = (typeof FACTIONS !== 'undefined') ? FACTIONS[a.candidate.factionId] : null;
                    var targets = roster(party).filter(function(b){return b.id !== a.id;}).sort(function(x, y){
                        var targetFactionX = (typeof FACTIONS !== 'undefined') ? FACTIONS[x.candidate.factionId] : null;
                        var targetFactionY = (typeof FACTIONS !== 'undefined') ? FACTIONS[y.candidate.factionId] : null;
                        var synergyX = (sourceFaction && sourceFaction.synergy && targetFactionX) ? (sourceFaction.synergy[targetFactionX.id] || 0) : 0;
                        var synergyY = (sourceFaction && sourceFaction.synergy && targetFactionY) ? (sourceFaction.synergy[targetFactionY.id] || 0) : 0;
                        var sameFactionX = (a.candidate.factionId === x.candidate.factionId) ? 1.0 : 0;
                        var sameFactionY = (a.candidate.factionId === y.candidate.factionId) ? 1.0 : 0;
                        var simY = similarity(a, y);
                        var simX = similarity(a, x);
                        var pactY = (typeof PrimaryNegotiations !== 'undefined') && PrimaryNegotiations.activeContracts().some(function(c){ return [c.fromId, c.toId].includes(a.id) && [c.fromId, c.toId].includes(y.id); });
                        var pactX = (typeof PrimaryNegotiations !== 'undefined') && PrimaryNegotiations.activeContracts().some(function(c){ return [c.fromId, c.toId].includes(a.id) && [c.fromId, c.toId].includes(x.id); });
                        var scoreY = synergyY * 2.5 + sameFactionY * 2.0 + simY * 1.8 + ((a.relationships[y.id]||{}).opinion || 0) * 0.5 + (pactY ? 2.0 : 0) + (y.id === leader.id ? 0.4 : 0);
                        var scoreX = synergyX * 2.5 + sameFactionX * 2.0 + simX * 1.8 + ((a.relationships[x.id]||{}).opinion || 0) * 0.5 + (pactX ? 2.0 : 0) + (x.id === leader.id ? 0.4 : 0);
                        return scoreY - scoreX;
                    });
                    var topChoice = targets[0];
                    var targetFactionTop = (topChoice && typeof FACTIONS !== 'undefined') ? FACTIONS[topChoice.candidate.factionId] : null;
                    var topSynergy = (sourceFaction && sourceFaction.synergy && targetFactionTop) ? (sourceFaction.synergy[targetFactionTop.id] || 0) : 0;
                    var hasPact = (typeof PrimaryNegotiations !== 'undefined') && topChoice && PrimaryNegotiations.activeContracts().some(function(c){ return [c.fromId, c.toId].includes(a.id) && [c.fromId, c.toId].includes(topChoice.id); });

                    // Endorse if same faction, compatible faction synergy (>= 0.2), or formal pact.
                    // If faction incompatibility is deep (synergy < -0.2) and no pact, withhold endorsement!
                    var endorsee = null;
                    if(topChoice){
                        if(a.candidate.factionId === topChoice.candidate.factionId || topSynergy >= 0.2 || hasPact || (similarity(a, topChoice) >= 0.45 && topSynergy >= 0)){
                            endorsee = topChoice;
                        }
                    }

                    if(typeof PrimaryNegotiations !== 'undefined' && endorsee && endorsee.id === p.playerId){
                        PrimaryNegotiations.makeIncoming(a.id, endorsee.id);
                        a.badWeeks = 0;
                    } else {
                        withdraw(a.id, endorsee ? endorsee.id : null, true);
                    }
                }
            });
        });
    }
    function withdraw(id,endorseeId,silent){
        var a=actor(id),p=state(),b=actor(endorseeId);if(!a||a.status==='suspended')return {ok:false,error:'This campaign is already suspended.'};
        if(p.ended)return {ok:false,error:'This campaign has ended.'};
        if(a.status==='nominated')return {ok:false,error:'A presumptive nominee cannot withdraw through this action.'};
        if(b&&(b.party!==a.party||b.status==='suspended'||b.id===id))return {ok:false,error:'Choose an active candidate in the same party.'};
        if(roster(a.party).length<2)return {ok:false,error:'The final remaining candidate cannot suspend the only campaign.'};
        
        // Freeze early voting ballots in any ongoing contest before recording departure
        p.contests.forEach(function(c){
            if(c.status==='scheduled'&&c.earlyStart&&p.date>=c.earlyStart){
                freezeEarly(c, p.date);
            }
        });

        // Snapshot support before suspension
        var transfer={};Object.keys(geography).forEach(function(code){var row=getPoll(a.party,code).find(function(r){return r.id===id;});transfer[code]=row?row.share/100:0;});
        a.status='suspended';a.endorsedId=b?b.id:null;a.suspendedDate=p.date;
        p.pendingActions=p.pendingActions.filter(function(q){if(q.actorId!==id)return true;a.funds+=q.funds;a.energy+=q.energy;a.spent-=q.funds;return false;});
        // Realistic endorsement pull (15% - 45% based on ideological similarity, accounting for resistance)
        var fraction = b ? clamp(0.18 + similarity(a,b)*0.22 + (((a.relationships[b.id]||{}).trust||0)*0.08), 0.12, 0.45) : 0;
        p.departures=p.departures||[];p.departures.push({id:a.id,party:a.party,endorseeId:b?b.id:null,shares:transfer,fraction:fraction,week:p.week});
        if(b){
            b.endorsements.push({id:'candidate-'+a.id,name:a.candidate.name,state:'National',strength:0.04});
            b.unity=clamp(b.unity+0.05,0,1);b.momentum=clamp(b.momentum+1.8,-20,20);a.transferFraction=fraction;
        }
        log(a.candidate.name+' suspended the campaign'+(b?' and endorsed '+b.candidate.name:' without endorsement')+'. Cast early ballots and delegate obligations are retained.','withdrawal');
        if(id===p.playerId)p.defeat={party:a.party,winnerId:p.parties[a.party].nomineeId||null};touch();if(!silent)refresh();return {ok:true};
    }
    function debate(){var p=state();if(p.week<3||p.week%5!==3||p.date>'2028-05-01')return;
        Object.keys(p.parties).forEach(function(party){if(!['D','R'].includes(party)||p.parties[party].stage!=='primary')return;var polls=getPoll(party,null),qualifying=roster(party).filter(function(a){return a.donors>=1200&&(polls.find(function(r){return r.id===a.id;}).share>=(p.week>20?5:2)||p.parties[party].delegates[a.id]>0);});
            if(qualifying.length<2)return;var results=qualifying.map(function(a){var performance=(a.candidate.debateSkill||5)*0.08+a.debatePrep*0.16+a.credibility*0.2+random()*0.45;return {id:a.id,performance:performance};}).sort(function(a,b){return b.performance-a.performance;});
            var average=results.reduce(function(n,r){return n+r.performance;},0)/results.length;
            results.forEach(function(r){var a=actor(r.id),delta=r.performance-average;a.momentum=clamp(a.momentum+delta*8,-20,20);a.awareness=clamp(a.awareness+0.025,0,1);a.debatePrep=0;message(a,'National',delta*0.13,{issueId:p.issueAgenda},3);});
            p.debates.push({date:p.date,party:party,issue:p.issueAgenda,results:results});log(actor(results[0].id).candidate.name+' led the '+party+' debate on '+IssueModel.getIssue(p.issueAgenda).name+'.','debate');
        });
    }
    function weeklyWorld(skipPlayer){var p=state();
        p.economy=clamp(p.economy+(random()-0.5)*0.35,-2,2);if(p.week%3===0)p.issueAgenda=CORE_ISSUES[Math.floor(random()*CORE_ISSUES.length)].id;
        p.weather={};upcoming(null,8).forEach(function(c){if(random()<0.18){p.weather[c.state]=0.4+random()*0.5;log('Difficult weather could reduce in-person turnout in '+c.name+'.','weather');}});
        Object.values(p.actors).forEach(function(a){if(a.status==='suspended'||(skipPlayer&&a.id===p.playerId))return;
            var upkeep=Object.values(a.org).reduce(function(n,o){return n+o.offices*0.028+o.staff*0.0012;},0),income=(0.10+Math.log1p(a.donors/1500)*0.14)*(0.6+a.favorability)*(1+a.momentum*0.01);
            a.funds+=income-upkeep;a.raised+=income;a.spent+=upkeep;if(a.funds<0){a.debt-=a.funds;a.funds=0;a.momentum=clamp(a.momentum-0.7,-20,20);Object.values(a.org).forEach(function(o){o.staff=Math.max(0,o.staff-2);});}
            if(a.debt>0&&a.funds>3){var payment=Math.min(a.debt,a.funds*0.05);a.debt-=payment;a.funds-=payment;}
            a.energy=a.maxEnergy;a.momentum*=0.89;a.favorability=clamp(a.favorability,0.05,0.95);
            Object.keys(a.messages).forEach(function(code){a.messages[code].forEach(function(m){m.remaining--;m.strength*=0.8;});a.messages[code]=a.messages[code].filter(function(m){return m.remaining>0;});});
            Object.keys(a.fatigue).forEach(function(k){a.fatigue[k]*=0.70;});a.scandals.forEach(function(s){s.remaining--;});
            if(random()<0.018*(1-(a.candidate.scandalResistance||0.3))){a.scandals.push({id:'event-'+p.week+'-'+a.id,label:'Campaign management controversy',severity:0.3+random()*0.4,remaining:4});log(a.candidate.name+' faces a campaign management controversy.','scandal');}
            Object.values(a.org).forEach(function(o){o.volunteers=Math.min(1000,Math.round(o.volunteers*0.99+o.offices*2));});
            a.endorsements=a.endorsements.filter(function(e){var source=typeof ENDORSERS!=='undefined'&&ENDORSERS.find(function(x){return x.id===e.id;}),rule=source&&source.retractCondition;if(!rule)return true;var pos=IssueModel.positions[IssueModel.index(a.platform[IssueModel.canonical(rule.issue)])].value;
                if((rule.threshold<0&&pos<=rule.threshold)||(rule.threshold>=0&&pos>=rule.threshold)){delete p.endorserAssignments[e.id];p.endorserSupport[e.id]=p.endorserSupport[e.id]||{};p.endorserSupport[e.id][a.id]=20;log(e.name+' withdrew its endorsement of '+a.candidate.name+' over policy.','endorsement');return false;}return true;});
        });
        if(typeof PrimaryNegotiations!=='undefined')PrimaryNegotiations.processWeek();
    }
    function processDates(oldDate,newDate){var p=state(),events=[];
        p.contests.forEach(function(c){if(c.status==='scheduled'&&c.date>oldDate&&c.date<=newDate)events.push(c.date);if(!c.selected&&c.selectionDate>oldDate&&c.selectionDate<=newDate)events.push(c.selectionDate);});
        Object.keys(p.parties).forEach(function(party){var date=PrimaryRules.conventions[party];if(date>oldDate&&date<=newDate)events.push(date);});
        events.push(newDate);events=Array.from(new Set(events)).sort();
        events.forEach(function(date){p.date=date;
            p.contests.forEach(function(c){freezeEarly(c,date<c.date?date:c.date);});
            var batch=p.contests.filter(function(c){return c.status==='scheduled'&&c.date<=date;}).map(function(c){return {contest:c,result:resolveContest(c)};});
            batch.forEach(function(r){recordContest(r.contest,r.result);});
            p.contests.forEach(function(c){if(!c.selected&&c.selectionDate<=date)selectDelegates(c);});
            Object.keys(p.parties).forEach(function(party){if(PrimaryRules.conventions[party]<=date&&p.parties[party].stage!=='nominated'&&typeof PrimaryConventions!=='undefined')PrimaryConventions.open(party);});
        });
        p.date=newDate;
    }
    async function advance(targetDate,fromGeneral){
        var p=state();if(!p||p.ended||busy)return {ok:false,error:'The campaign cannot advance right now.'};
        if(p.phase==='general'&&!fromGeneral)return {ok:false,error:'Return to the general election to advance the shared calendar.'};
        var ps=p.parties[p.playerParty];if(ps.convention&&ps.convention.pending)return {ok:false,error:'Complete your convention ballot or choose your running mate first.'};
        busy=true;
        try{var oldDate=p.date,next=targetDate||PrimaryRules.datePlus(oldDate,7);if(next>PrimaryRules.electionDay)next=PrimaryRules.electionDay;if(next<=oldDate)return {ok:true};
            var plannedActorIds = new Set(p.pendingActions.map(function(q){return q.actorId;}));
            Object.values(p.actors).forEach(function(a){
                if(a.id!==p.playerId && a.status!=='suspended' && !plannedActorIds.has(a.id)){
                    aiPlan(a);
                }
            });
            p.pendingActions.splice(0).forEach(perform);touch();
            processDates(oldDate,next);p.week++;weeklyWorld(!!fromGeneral);touch();debate();touch();considerDropouts();touch();publishPolls();
            if(!fromGeneral){gameData.currentDate=new Date(p.date+'T12:00:00');gameData.currentWeek=p.week;gameData.funds=player().funds;gameData.energy=player().energy;}
            refresh();
            if(!fromGeneral&&typeof Newspaper!=='undefined'){Newspaper.show('primary');}
            prepareBackgroundAI();
            if(!fromGeneral&&typeof PrimaryStorage!=='undefined'){var saved=await PrimaryStorage.save();if(!saved.ok&&typeof PrimaryUI!=='undefined')PrimaryUI.notice(saved.error,true);}return {ok:true};
        }finally{busy=false;}
    }
    function continueAsNominee(){var p=state(),ps=p.parties[p.playerParty],id=ps.nomineeId;if(!id)return {ok:false,error:'Your party has not selected a nominee yet. Advance its campaign to the convention.'};
        p.playerId=id;p.defeat=null;p.generalReady=true;gameData.candidate=actor(id).candidate;log('You now lead '+actor(id).candidate.name+'’s campaign, retaining that candidate’s resources and record.','handoff');refresh();return {ok:true};}
    function endCampaign(){if(state()){state().ended=true;log('Campaign ended. Your nomination history remains available.','ending');refresh();}return {ok:true};}
    function viewPrimary(){if(state())return PrimaryNative.showCampaign();}
    async function enterGeneral(){return typeof PrimaryIntegration!=='undefined'?PrimaryIntegration.enterGeneral():{ok:false,error:'General-election integration is unavailable.'};}
    async function advanceQuietly(){for(var i=0;i<4;i++){var p=state(),history=p.history.length,offers=p.offers.length,result=await advance();if(!result.ok)return result;if(p.defeat||p.offers.length>offers||p.history.slice(history).some(function(e){return ['result','debate','scandal','convention','nomination','withdrawal'].includes(e.type);}))break;}return {ok:true};}
    return {start:start,state:state,actor:actor,player:player,roster:roster,getContests:getContests,upcoming:upcoming,getPoll:getPoll,
        actionCosts:actionCosts,queueAction:queueAction,cancelAction:cancelAction,setPlatform:setPlatform,setPriorities:setPriorities,
        advance:advance,advanceQuietly:advanceQuietly,refresh:refresh,withdraw:withdraw,continueAsNominee:continueAsNominee,endCampaign:endCampaign,
        enterGeneral:enterGeneral,viewPrimary:viewPrimary,loadCounties:loadCounties,rebuild:buildGeography,org:org,
        log:log,touch:touch,random:random,stable:stable,clamp:clamp,similarity:similarity,truth:truth,
        candidateScore:function(a,county,group,contest){return score(a,{id:county.fips,county:county,districts:{}},group,contest);}};
}());
