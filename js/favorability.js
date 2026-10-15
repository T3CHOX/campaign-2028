/* Candidate opinion is independent of vote intention. All values are percentage
   points and favorable + unfavorable + no opinion always equals 100. Baselines
   are scenario estimates informed by public national surveys, not poll results. */
var Favorability = {
    profiles: {
        harris:[44,50,6], newsom:[35,47,18], whitmer:[32,26,42], buttigieg:[36,35,29],
        aoc:[43,43,14], kelly:[42,29,29], khanna:[22,20,58], emanuel:[25,32,43],
        stewart:[39,30,31], beshear:[30,19,51], booker:[36,34,30], shapiro:[33,25,42],
        trump:[40,56,4], vance:[39,51,10], desantis:[36,44,20], cruz:[35,47,18],
        paul:[33,35,32], haley:[36,39,25], ramaswamy:[30,36,34], bannon:[21,52,27],
        hawley:[28,34,38], carlson:[30,45,25], rubio:[34,47,19],
        stein:[18,28,54], oliver:[11,10,79], yang:[28,25,47], massie:[18,20,62],
        kennedy_rfk:[31,47,22], bloomberg:[28,44,28], delacruz:[8,15,77], lariva:[6,12,82],
        walz:[39,34,27], crockett:[33,32,35], ossoff:[29,21,50], gallego:[26,22,52],
        moore:[27,23,50], cuban:[34,35,31], talarico:[16,14,70],
        bovino:[17,38,45], youngkin:[28,29,43], sununu:[25,25,50], trumpjr:[29,48,23],
        gabbard:[29,45,26], kemp:[27,27,46], mace:[26,38,36], cheney:[30,48,22],
        walker:[8,11,81], ware:[9,11,80], laduke:[11,12,77], hoh:[9,10,81], hill:[18,24,58],
        amash:[17,19,64]
    },
    clamp: function(n,low,high) { return Math.max(low,Math.min(high,n)); },
    init: function() { gameData.candidateOpinion = { effects:{}, recognition:{} }; },
    candidate: function(id) {
        if (!id) return gameData.candidate;
        if (typeof Utils !== 'undefined' && Utils.getActiveCandidates) {
            var item = Utils.getActiveCandidates().find(function(x){ return x.cand && x.cand.id === id; });
            if (item) return item.cand;
        }
        return typeof IssueModel !== 'undefined' ? IssueModel.candidate(id) : null;
    },
    profile: function(candidate) {
        var aliases={kelly_vp:'kelly',whitmer_vp:'whitmer',khanna_vp:'khanna',cruz_vp:'cruz',hawley_vp:'hawley',lariva_vp:'lariva'};
        var known = this.profiles[aliases[candidate.id]||candidate.id];
        if (known) return known;
        // Running mates outside the presidential roster retain their own,
        // stable familiarity rather than inheriting the nominee's numbers.
        var hash = 0, id = candidate.id || '';
        for (var i=0;i<id.length;i++) hash = (hash*31+id.charCodeAt(i))>>>0;
        var recognition = 42+(hash%25), net = ((hash>>>8)%19)-9;
        if (candidate.party === 'PSL') recognition *= 0.55;
        return [(recognition+net)/2,(recognition-net)/2,100-recognition];
    },
    ticketVP: function(candidate) {
        if (!candidate) return null;
        var party = candidate.party;
        var ticket = party === gameData.selectedParty ? {pres:gameData.candidate,vp:gameData.vp}
            : party === 'D' ? gameData.demTicket : party === 'R' ? gameData.repTicket
            : gameData.thirdTickets && gameData.thirdTickets[party];
        return ticket && ticket.pres && ticket.pres.id === candidate.id ? ticket.vp : null;
    },
    groupShare: function(county,id) {
        var ig=county.ig||{}, direct=Number(ig[id]);
        if(Number.isFinite(direct)) return this.clamp(direct/100,0,1);
        if(typeof Electorate!=='undefined'&&Electorate.share) {
            var modeled=Electorate.share(county,id);
            if(modeled>0) return modeled;
        }
        var share=function(key){return Favorability.clamp((Number(ig[key])||0)/100,0,1);};
        var base=county.originalV||county.simulationBaseV||county.v||{};
        var dem=(Number(base.D)||0)/Math.max(1,(Number(base.D)||0)+(Number(base.R)||0));
        var rural=share('rural'),white=share('white'),noncollege=share('noncollege');
        if(id==='rural_whites') return rural*white;
        if(id==='bluecollar'||id==='blue_collar') return noncollege*(0.3+0.55*rural);
        if(id==='moderate_dems') return share('pragmatic_moderate')*dem;
        if(id==='suburban_moderates') return (1-rural)*share('pragmatic_moderate')*0.7;
        if(id==='suburban_college') return (1-rural)*share('college')*0.7;
        if(id==='suburban_women') return (1-rural)*share('women')*0.55;
        if(id==='midwest_noncollege') return ['IL','IN','IA','KS','MI','MN','MO','NE','ND','OH','SD','WI'].indexOf(county.s)>=0?noncollege:0;
        if(id==='progressive_left'||id==='college_liberals') return share('activist_left')*(id==='college_liberals'?share('college'):1);
        if(id==='tech') return share('college')*0.35;
        if(id==='veterans') return share('seniors')*0.3;
        if(id==='independents') return share('unaligned_center');
        return 0;
    },
    baseCounty: function(candidate,county) {
        var base=this.profile(candidate), recognition=base[0]+base[1], net=base[0]-base[1];
        if (!county) return {recognition:recognition,net:net};
        // Opinion geography is anchored to the starting electorate. Live vote
        // shares must not feed back into candidate approval or map colors.
        var v=county.originalV||county.simulationBaseV||county.v||{}, total=(v.D||0)+(v.R||0), lean=total ? ((v.D||0)-(v.R||0))/total : 0;
        var partySign=candidate.party==='D'||candidate.party==='G'||candidate.party==='PSL' ? 1
            : candidate.party==='R' ? -1 : 0;
        var localLean=partySign*lean;
        if (candidate.party==='I'||candidate.party==='L') localLean=-Math.abs(lean)*0.35;
        net += 65*localLean*Math.sqrt(Math.min(1,recognition/90));
        // Candidate records already merge legacy boosts and debuffs into
        // groupEffects. Count each coalition once, including derived groups.
        var effects=candidate.groupEffects||{}, self=this, groupAdjustment=0;
        Object.keys(effects).forEach(function(group){
            groupAdjustment+=self.groupShare(county,group)*(Number(effects[group]&&effects[group].support)||0);
        });
        net+=this.clamp(groupAdjustment*0.7,-12,12);
        if (candidate.homeState && county.s===candidate.homeState) {
            recognition+=candidate.id==='beshear'?27:12;
            net+=candidate.id==='beshear'?28:8;
        }
        if(candidate.id==='beshear'&&['OH','WV'].indexOf(county.s)>=0) net+=5;
        var share=function(id){return Favorability.groupShare(county,id);};
        // The county's ideology and issue salience shape how the candidate's
        // modeled platform is received. Unknown stances do not receive credit.
        if (typeof IssueModel!=='undefined' && candidate.issuePositions) {
            var issueWeights={economy:1,immigration:1,climate:0.8,abortion:0.8,healthcare:0.8};
            Object.keys(issueWeights).forEach(function(issue){
                if (candidate.issuePositions[issue]===undefined || (candidate.positionProvenance&&candidate.positionProvenance[issue]||'').indexOf('not documented')>=0) return;
                var stance=(IssueModel.index(candidate.issuePositions[issue])-3)/3;
                var salience=gameData.issueSalience && gameData.issueSalience[county.s] && gameData.issueSalience[county.s][issue];
                var weight=Number.isFinite(Number(salience)) ? Favorability.clamp(Number(salience)/6,0.4,1.5) : 1;
                var target=-lean*0.65;
                if(issue==='economy') target+=(share('union')-share('tech'))*0.4;
                if(issue==='immigration') target+=(share('hispanic')+share('college')-share('rural')-share('america_first_conservative'))*0.45;
                if(issue==='climate') target+=(share('college')+share('youth')-share('rural')-share('evangelical'))*0.45;
                if(issue==='abortion') target+=(share('women')+share('secular')-share('evangelical'))*0.4;
                if(issue==='healthcare') target+=(share('union')+share('seniors')-share('america_first_conservative'))*0.35;
                target=Favorability.clamp(target,-1,1);
                net += (1-Math.abs(stance-target))*issueWeights[issue]*weight*0.7;
            });
        }
        var vp=this.ticketVP(candidate);
        if (vp) {
            var vpBase=this.profile(vp), vpNet=vpBase[0]-vpBase[1];
            net+=this.clamp(vpNet*0.08,-2.5,2.5);
            if (vp.homeState===county.s) net+=1.5;
            recognition+=this.clamp((vpBase[0]+vpBase[1]-55)*0.06,-1,2);
        }
        return {recognition:recognition,net:net};
    },
    get: function(candidateId,county) {
        var candidate=this.candidate(candidateId);
        if (!candidate) return {favorable:0,unfavorable:0,noOpinion:100,net:0};
        var base=this.baseCounty(candidate,county), record=gameData.candidateOpinion||{}, effects=record.effects||{}, recognition=record.recognition||{};
        var key=county && (county.fips || county.id);
        var state=county && county.s;
        var effect=effects[candidate.id]||{}, reach=recognition[candidate.id]||{};
        var net=base.net+(effect.national||0)+(state&&effect.states&&effect.states[state]||0)+(key&&effect.counties&&effect.counties[key]||0);
        var known=base.recognition+(reach.national||0)+(state&&reach.states&&reach.states[state]||0)+(key&&reach.counties&&reach.counties[key]||0);
        known=this.clamp(known,5,98);
        net=this.clamp(net,-known,known);
        return {favorable:(known+net)/2,unfavorable:(known-net)/2,noOpinion:100-known,net:net};
    },
    area: function(candidateId,stateCode) {
        var counties=typeof Counties!=='undefined'&&Counties.countyData;
        if (!counties || !Object.keys(counties).length) return this.get(candidateId);
        var totals={favorable:0,unfavorable:0,noOpinion:0,net:0}, weightSum=0;
        Object.keys(counties).forEach(function(key){
            var county=counties[key];
            if (stateCode && county.s!==stateCode) return;
            var weight=Math.max(1,Number(county.regVoters||county.p)||1), result=Favorability.get(candidateId,county);
            Object.keys(totals).forEach(function(metric){totals[metric]+=result[metric]*weight;});
            weightSum+=weight;
        });
        if (!weightSum) return this.get(candidateId);
        Object.keys(totals).forEach(function(metric){totals[metric]/=weightSum;});
        return totals;
    },
    movement: function(candidateId,county) {
        var opinion=gameData.candidateOpinion, effect=opinion&&opinion.effects&&opinion.effects[candidateId];
        if(!effect)return 0;
        return (effect.national||0)+(county&&effect.states&&effect.states[county.s]||0)+(county&&effect.counties&&effect.counties[county.fips]||0);
    },
    change: function(candidateId,delta,options) {
        if (!candidateId || !Number.isFinite(Number(delta))) return;
        options=options||{};
        var opinion=gameData.candidateOpinion||(gameData.candidateOpinion={effects:{},recognition:{}});
        var effect=opinion.effects[candidateId]||(opinion.effects[candidateId]={national:0,states:{},counties:{}});
        var reach=opinion.recognition[candidateId]||(opinion.recognition[candidateId]={national:0,states:{},counties:{}});
        var scope=options.countyIds&&options.countyIds.length?'counties':options.stateCode?'states':'national';
        var keys=scope==='counties'?options.countyIds:scope==='states'?[options.stateCode]:['national'];
        keys.forEach(function(raw){
            var key=scope==='counties'&&typeof Counties!=='undefined'?Counties.normalizeFips(String(raw)):raw;
            var county=scope==='counties'&&Counties.countyData[key];
            if (scope==='counties'&&!county) return;
            var audience=options.segment&&county&&typeof Electorate!=='undefined'&&Electorate.share
                ? Favorability.clamp(Electorate.share(county,options.segment)*2,0.1,1) : 1;
            var netChange=Number(delta)*audience, recognitionChange=(Number(options.recognition)||0)*audience;
            if (scope==='national') { effect.national=Favorability.clamp(effect.national+netChange,-35,35); reach.national=Favorability.clamp(reach.national+recognitionChange,-10,25); }
            else { effect[scope][key]=Favorability.clamp((effect[scope][key]||0)+netChange,-35,35); reach[scope][key]=Favorability.clamp((reach[scope][key]||0)+recognitionChange,-10,25); }
        });
        // Opinion is tracked separately from vote intention. Vote effects of
        // campaign actions are applied by their own persuasion paths.
    },
    ad: function(config) {
        var ids=config.countyIds||[], strength=this.clamp(Number(config.exposure)||1,0.2,3);
        var common={countyIds:ids,stateCode:config.stateCode,segment:config.segment,recognition:0.7*strength};
        if (config.type==='attack' && config.targetId) {
            this.change(config.targetId,-1.8*strength,common);
            this.change(config.sponsorId,-0.12*strength,{countyIds:ids,stateCode:config.stateCode});
        } else if (config.type==='positive'||config.type==='bio') this.change(config.sponsorId,1.25*strength,common);
        else if (config.type==='issue') this.change(config.sponsorId,0.85*strength,common);
        else this.change(config.sponsorId,0.2*strength,common);
    }
};
