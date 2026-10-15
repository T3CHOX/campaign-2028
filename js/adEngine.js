/* Shared delivery for TV, digital, map shortcuts, queued issue ads and AI buys.
   All costs use millions of dollars. A duration includes the immediate first
   delivery; each following week is processed at most once. */
var AdEngine = {
    sponsor:function(config){return IssueModel.candidate(config.sponsorId||gameData.candidate&&gameData.candidate.id);},
    framePenalty:function(config){
        if(!config.frame)return 0;
        if(config.frame!=='socialism'||config.type!=='attack'||!config.segment||typeof Electorate==='undefined'||!Electorate.messageFramePenalty)return 0;
        return Electorate.messageFramePenalty(Electorate.groupKey(config.segment),{type:'attack',frame:config.frame,targetId:config.targetId});
    },
    quote:function(config){
        if(typeof Electorate==='undefined'||!Electorate.ready||!Counties.countyData||!Object.keys(Counties.countyData).length)
            return {ok:false,error:'County data is loading. The ad composer will update when the map is ready.'};
        var sponsor=this.sponsor(config),types=['attack','issue','positive','mobilize'];
        if(!sponsor||!Utils.getActiveCandidates().some(function(c){return c.cand.id===sponsor.id;}))return {ok:false,error:'Choose an active sponsoring candidate.'};
        if(types.indexOf(config.type)<0)return {ok:false,error:'Choose an ad type.'};
        var intensity=Number(config.intensity===undefined?1:config.intensity),duration=Number(config.durationWeeks===undefined?1:config.durationWeeks);
        if(!Number.isInteger(intensity)||intensity<1||intensity>3||!Number.isInteger(duration)||duration<1||duration>4)return {ok:false,error:'Intensity must be 1–3 and duration 1–4 weeks.'};
        if((config.type==='attack'||config.type==='issue')&&!IssueModel.getIssue(config.issueId))return {ok:false,error:'Choose the policy issue for this ad.'};
        if(config.type==='attack'){
            var target=Utils.getActiveCandidates().find(function(c){return c.cand.id===config.targetId&&c.cand.id!==sponsor.id;});
            if(!target)return {ok:false,error:'Choose a different, active opponent to attack.'};
        }
        if(config.segment&&!INTEREST_GROUPS[Electorate.groupKey(config.segment)])return {ok:false,error:'Choose an available audience group.'};
        if(config.frame&&config.frame!=='socialism')return {ok:false,error:'Choose a valid message frame.'};
        if(config.frame==='socialism'&&!this.framePenalty(config))return {ok:false,error:'This frame requires a targeted subgroup and an opponent with at least two Far Left or Left economic-system positions.'};
        var cost;
        if(config.channel==='tv'){
            if(!Object.keys(MEDIA_MARKETS).length)return {ok:false,error:'Media markets are loading. The ad composer will update when they are ready.'};
            var market=MEDIA_MARKETS[config.marketId];if(!market)return {ok:false,error:'Choose a media market.'};
            if(!(market.counties||[]).some(function(f){return !!Counties.countyData[Counties.normalizeFips(String(f))];}))return {ok:false,error:'This market has no mapped counties.'};
            cost=DigitalAds.getTVCost(config.marketId,intensity,duration);
        }else if(config.channel==='digital'){
            if(!STATES[config.stateCode])return {ok:false,error:'Choose a state for the digital campaign.'};
            cost=Number(config.budget);if(!Number.isFinite(cost)||cost<=0||cost>1000)return {ok:false,error:'Enter a positive budget, up to $1,000M.'};
        }else return {ok:false,error:'Choose TV or digital delivery.'};
        if(!Number.isFinite(cost)||cost<=0)return {ok:false,error:'A valid market price is required.'};
        return {ok:true,cost:cost};
    },
    buy:function(config, options){
        options = options || {};
        var quote=this.quote(config);if(!quote.ok)return quote;
        var sponsor=this.sponsor(config),player=sponsor.id===gameData.candidate.id;
        var funds=player?gameData.funds:(sponsor.funds||0);
        if(funds<quote.cost)return {ok:false,error:'Insufficient campaign funds.',cost:quote.cost};
        if(player&&gameData.energy<1)return {ok:false,error:'An ad buy requires 1 energy.',cost:quote.cost};
        if(player&&typeof SimulationState!=='undefined')Campaign.saveState();
        gameData.ads=gameData.ads||{};
        var target=config.type==='attack'?IssueModel.candidate(config.targetId):null;
        var ad=Object.assign({},config,{id:'ad-'+((gameData.ads.campaigns||[]).length+1),sponsorId:sponsor.id,sponsorName:sponsor.name,party:sponsor.party||gameData.selectedParty,targetName:target&&target.name,
            intensity:Number(config.intensity||1),durationWeeks:Number(config.durationWeeks||1),cost:quote.cost,deliveredWeeks:0,status:'active',purchasedWeek:gameData.currentWeek||0,lastDeliveryWeek:null});
        ad.priorityBoost=typeof CampaignPriorities!=='undefined'?CampaignPriorities.multiplier(sponsor,ad.issueId):1;
        ad.weeksRemaining=ad.durationWeeks;
        if(target)ad.attackedStance=IssueModel.getPosition(target,config.issueId).id;
        if(player){gameData.funds-=quote.cost;gameData.energy-=1;}else sponsor.funds=funds-quote.cost;
        gameData.ads.campaigns=gameData.ads.campaigns||[];gameData.ads.campaigns.push(ad);
        this.deliver(ad,gameData.currentWeek||0);
        if(!options.batch && !options.silent) {
            this.refresh();
        }
        Utils.addLog(sponsor.name+' bought '+ad.durationWeeks+' week(s) of '+ad.type+' ads'+(target?' targeting '+target.name:'')+(ad.issueId?' on '+IssueModel.getIssue(ad.issueId).name:'')+' ($'+quote.cost.toFixed(2)+'M).');
        return {ok:true,cost:quote.cost,id:ad.id};
    },
    counties:function(ad){
        if(ad.channel==='tv'){var market=MEDIA_MARKETS[ad.marketId];return market?(market.counties||[]).map(function(f){return Counties.normalizeFips(String(f));}):[];}
        return Object.values(Counties.countyData).filter(function(c){return c.s===ad.stateCode;}).map(function(c){return c.fips;});
    },
    deliver:function(ad,week){
        if(ad.status!=='active'||ad.lastDeliveryWeek===week||ad.deliveredWeeks>=ad.durationWeeks)return;
        if(ad.type==='attack'&&!Utils.getActiveCandidates().some(function(c){return c.cand.id===ad.targetId;})){ad.status='cancelled';ad.reason='Target left the active race; undelivered production costs are sunk.';return;}
        var fips=this.counties(ad),sponsor=this.sponsor(ad),self=this;
        if(!sponsor){ad.status='cancelled';ad.reason='Sponsor unavailable';return;}
        var satKey=ad.channel==='tv'?ad.marketId:ad.stateCode;
        gameData.ads.saturation=gameData.ads.saturation||{};
        var saturation=gameData.ads.saturation[satKey]||0;
        var priorityBoost=Number(ad.priorityBoost)||1;
        var exposure=(ad.channel==='tv'?ad.intensity:Math.sqrt(ad.cost/ad.durationWeeks))*priorityBoost/(1+saturation*0.35);
        if(typeof Favorability!=='undefined')Favorability.ad({sponsorId:ad.sponsorId,targetId:ad.targetId,type:ad.type,countyIds:fips,segment:ad.segment,exposure:exposure});
        if(ad.type==='issue'||ad.type==='attack'){
            Electorate.expose({sponsorId:ad.sponsorId,targetId:ad.targetId,issueId:ad.issueId,type:ad.type,stance:ad.attackedStance,frame:ad.frame,counties:fips,segment:ad.segment,exposure:exposure*0.4});
            if(typeof updateGroupTurnoutFromIssue==='function'&&!(typeof PrimaryNative!=='undefined'&&PrimaryNative.active()&&ad.sponsorId!==gameData.candidate.id)) updateGroupTurnoutFromIssue(ad.issueId,ad.party,ad.intensity*priorityBoost);
        }else{
            fips.forEach(function(key){var c=Counties.countyData[key];if(!c)return;var reach=ad.segment?Electorate.share(c,ad.segment):1;
                var key=typeof PrimaryNative!=='undefined'&&PrimaryNative.active()?ad.sponsorId:ad.party;
                if(ad.type==='positive')Counties.applyVoteShareShift(c.v,key,0.04*exposure*reach);
                else {c.partyMobilization=c.partyMobilization||{};c.partyMobilization[key]=Math.min(0.10,(c.partyMobilization[key]||0)+0.008*exposure*reach);}
            });Electorate.invalidate();
        }
        gameData.ads.saturation[satKey]=Math.min(12,saturation+0.4*exposure);
        ad.lastDeliveryWeek=week;ad.deliveredWeeks++;ad.weeksRemaining=ad.durationWeeks-ad.deliveredWeeks;
        if(ad.weeksRemaining<=0)ad.status='complete';
    },
    processWeekly:function(week){
        if(!gameData.ads)return;
        Object.keys(gameData.ads.saturation||{}).forEach(function(key){gameData.ads.saturation[key]*=0.75;});
        (gameData.ads.campaigns||[]).forEach(function(ad){AdEngine.deliver(ad,week);});
    },
    refresh:function(){
        Electorate.recompute();
        if (typeof Campaign !== 'undefined') {
            Campaign.updateHUD();
            if (typeof requestAnimationFrame === 'function') {
                requestAnimationFrame(function() { Campaign.colorMap(); });
            } else {
                Campaign.colorMap();
            }
        }
    }
};

if (typeof window !== 'undefined') {
    window.AdEngine = AdEngine;
}
