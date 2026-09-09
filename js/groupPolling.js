/* Published observations are immutable weekly products. This PRNG is isolated
   from gameplay RNG: changing polling settings cannot change election truth. */
var GroupPolling = {
    config:{effectiveSampleSize:1068,confidenceLevel:0.95},
    random:function(seed){var state=2166136261;for(var i=0;i<String(seed).length;i++){state^=String(seed).charCodeAt(i);state=Math.imul(state,16777619);}return function(){state+=0x6D2B79F5;var t=state;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296;};},
    sample:function(probabilities,n,random){
        var cumulative=[],sum=0,counts=probabilities.map(function(p){sum+=p;cumulative.push(sum);return 0;});
        for(var i=0;i<n;i++){var value=random()*sum,index=0;while(index<cumulative.length-1&&value>=cumulative[index])index++;counts[index]++;}
        return counts.map(function(c){return 100*c/n;});
    },
    latest:function(id){var h=gameData.groupPolls&&gameData.groupPolls[id];return h&&h.length?h[h.length-1]:null;},
    publish:function(week){
        if(!Electorate.ready)return;
        gameData.groupPolls=gameData.groupPolls||{};
        var model=Electorate.prepare(),self=this;
        var weight=0,undecided=0;
        Object.values(Counties.countyData).forEach(function(c){var result=Electorate.countyResult(c);weight+=result.total;undecided+=result.total*Electorate.clamp((c.undecided||0)/100,0,0.4);});
        undecided=weight?undecided/weight:0;
        Object.keys(INTEREST_GROUPS).forEach(function(id){
            var history=gameData.groupPolls[id]||(gameData.groupPolls[id]=[]);
            if(history.some(function(p){return p.week===week;}))return;
            var population=Electorate.groupDenominators[id]||0;if(population<=0)return;
            var undecided=Electorate.groupUndecided[id]||0;
            var profile=INTEREST_GROUPS[id].pollingProfile||{},designEffect=Math.max(1,profile.designEffect||1),multiplier=Math.max(0.1,profile.sampleMultiplier||1);
            var n=Math.max(30,Math.round(self.config.effectiveSampleSize*multiplier/designEffect)),adjustments=[];
            if(multiplier!==1)adjustments.push('Dedicated subgroup sample allocation ×'+multiplier.toFixed(2));
            if(designEffect!==1)adjustments.push('Weighting design effect '+designEffect.toFixed(2));
            // A hypothetical dedicated subgroup survey has a baseline 1068
            // effective interviews, rather than a tiny generic national cross-tab.
            if(population<20000){n=Math.max(30,Math.min(n,Math.floor(population*0.05)));adjustments.push('Limited subgroup recruitment reduces the effective sample.');}
            var shares=gameData.interestGroupSupport[id]||{},prob=model.candidates.map(function(c){return (shares[c.id]||0)/100*(1-undecided);});prob.push(undecided);
            var observed=self.sample(prob,n,self.random(gameData.pollSeed+':'+week+':'+id)),published={};
            model.candidates.forEach(function(c,i){published[c.id]=observed[i];});
            var date=new Date(gameData.currentDate),dateLabel=[date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-');
            history.push({week:week,date:dateLabel,moe:100*1.96*Math.sqrt(0.25/n),sampleSize:Math.round(n*designEffect),effectiveSampleSize:n,confidenceLevel:0.95,
                candidates:model.candidates.map(function(c){return {id:c.id,name:c.name,party:c.party,image:'images/'+c.id+'.jpg'};}),shares:published,undecided:observed[observed.length-1],adjustments:adjustments,
                methodology:'Separate dedicated national subgroup survey. Maximum 95% sampling margin; ACS population uncertainty and nonsampling errors are separate. Estimates for overlapping groups use modeled memberships.'});
        });
    }
};
