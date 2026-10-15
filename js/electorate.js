/* One-way electorate model: county inputs -> exclusive population cells ->
   expected ballots -> aggregates -> published polls. All opinion profiles are
   tunable scenario assumptions, never presented as Census opinion measurements. */
var Electorate = {
    version:2, ready:false, revision:0, compiled:null, cache:new Map(), reference:{},
    tuning:{policy:0.85,attention:0.045,persuasion:0.055,maxAttention:12,attentionDecay:0.76,messageDecay:0.65},
    profiles:{}, groupGeography:{},
    // Current faction IDs are the canonical political vocabulary. These
    // aliases preserve existing policy and UI IDs without changing values.
    factionAliases:{progressives:'activist_left',progressive:'activist_left',maga:'america_first_conservative',libertarians:'unaligned_center',libertarian:'unaligned_center',centrists:'pragmatic_moderate',centrist:'pragmatic_moderate'},
    clamp:function(v,a,b){return Math.max(a,Math.min(b,v));},
    normalize:function(values){var sum=values.reduce(function(a,b){return a+Math.max(0,b);},0);return values.map(function(v){return sum?Math.max(0,v)/sum:1/values.length;});},
    invalidate:function(){this.revision++;this.compiled=null;this.cache.clear();this.overlayCache=new Map();this._dirty=true;},
    rootGroup:function(id){return INTEREST_GROUPS[id]&&INTEREST_GROUPS[id].parentId||id;},
    groupKey:function(id){return INTEREST_GROUPS[id]?id:({progressive:'progressives',centrist:'centrists',libertarian:'libertarians',cuban:'hispanic_006',latino:'hispanic'}[id]||id);},
    share:function(county,id){
        if(!county)return 0;
        var key=this.groupKey(id),ig=county.ig||{};
        if(INTEREST_GROUPS[id])key=id;
        var configured=INTEREST_GROUPS[key];
        if(configured&&Array.isArray(configured.sourceVariables)){
            return this.clamp(configured.sourceVariables.reduce(function(total,sourceId){return total+(Number(ig[sourceId])||0);},0)/100,0,1);
        }
        var factionId=this.factionAliases[key];
        if(factionId&&Number.isFinite(ig[factionId]))return this.clamp(ig[factionId]/100,0,1);
        // Read pre-cleanup payloads without changing the canonical schema.
        var legacyKey={activist_left:'progressive',america_first_conservative:'maga',unaligned_center:'libertarian',pragmatic_moderate:'centrist'}[factionId];
        if(legacyKey&&Number.isFinite(ig[legacyKey]))return this.clamp(ig[legacyKey]/100,0,1);
        if({progressives:1,centrists:1,libertarians:1}[key])key={progressives:'progressive',centrists:'centrist',libertarians:'libertarian'}[key];
        if(Number.isFinite(ig[key]))return this.clamp(ig[key]/100,0,1);
        if(key==='urban')return this.clamp(1-(ig.rural||0)/100,0,1)*(county.t==='Highly Urban'?0.9:0.35);
        if(key==='suburban')return this.clamp(1-(ig.rural||0)/100-this.share(county,'urban'),0,1);
        if(key==='genz')return this.share(county,'youth');
        if(key==='suburban_women')return this.share(county,'suburban')*this.share(county,'women');
        if(key==='whitecollar')return this.share(county,'college')*0.85;
        if(key==='smallbusiness')return 0.08;
        if(key==='military')return 0.06;
        if(key==='lgbtq_community')return 0.075;
        return 0;
    },
    load:function(callback){
        var self=this;
        fetch('counties/demographics.v2.json').then(function(r){if(!r.ok)throw new Error('Demographic data could not be loaded.');return r.json();}).then(function(payload){
            self.compositionSchema=payload.compositionSchema||null;
            self.installGroups(payload.groups,payload.counties);
            callback(payload.counties);
        }).catch(function(error){console.error(error); var map=document.getElementById('us-map-wrapper');if(map)map.textContent='County data could not be loaded. Reload to retry. '+error.message;});
    },
    installGroups:function(defs,counties){
        var neutral={baseline:0,priorities:['economy','healthcare','housing'],support:{D:48,R:48,I:2,G:1,L:1,PSL:0},elasticity:0.6};
        ['pacific','multiracial','other_race'].forEach(function(id){if(!INTEREST_GROUPS[id])INTEREST_GROUPS[id]=Object.assign({},neutral,{name:{pacific:'Native Hawaiian & Pacific Islander',multiracial:'Multiracial voters',other_race:'Other racial identities'}[id],category:'Racial/Ethnic'});});
        // Keep the Census origin fields for population accounting, while the
        // simulator exposes a smaller set of origin groups with enough sample
        // size to support meaningful polling and issue profiles. The partisan
        // starting points are scenario calibrations informed by Pew's origin-
        // group surveys, not claims that every member of a group votes alike.
        var curated = [
            {id:'hispanic_004',parentId:'hispanic',name:'Mexican',sourceVariables:['hispanic_004'],baseline:-3,support:{D:58,R:38,I:4,G:0,L:0,PSL:0},priorities:['economy','immigration','healthcare']},
            {id:'hispanic_005',parentId:'hispanic',name:'Puerto Rican',sourceVariables:['hispanic_005'],baseline:-5,support:{D:64,R:30,I:6,G:0,L:0,PSL:0},priorities:['healthcare','housing','infrastructure']},
            {id:'hispanic_006',parentId:'hispanic',name:'Cuban',sourceVariables:['hispanic_006'],baseline:5,support:{D:42,R:52,I:6,G:0,L:0,PSL:0},priorities:['cuba','venezuela','economy'],messageFrames:{socialism:{penalty:0.32,minLeftPositions:2}}},
            {id:'hispanic_007',parentId:'hispanic',name:'Dominican',sourceVariables:['hispanic_007'],baseline:-6,support:{D:70,R:23,I:7,G:0,L:0,PSL:0},priorities:['housing','healthcare','economy']},
            {id:'hispanic_025',parentId:'hispanic',name:'Venezuelan',sourceVariables:['hispanic_025'],baseline:1,support:{D:44,R:49,I:7,G:0,L:0,PSL:0},priorities:['venezuela','immigration','economy'],messageFrames:{socialism:{penalty:0.22,minLeftPositions:2}}},
            {id:'hispanic_central',parentId:'hispanic',name:'Central American',sourceVariables:['hispanic_009','hispanic_010','hispanic_011','hispanic_012','hispanic_013','hispanic_014','hispanic_015'],baseline:-2,support:{D:56,R:36,I:8,G:0,L:0,PSL:0},priorities:['immigration','economy','housing']},
            {id:'hispanic_south',parentId:'hispanic',name:'South American',sourceVariables:['hispanic_017','hispanic_018','hispanic_019','hispanic_020','hispanic_021','hispanic_022','hispanic_023','hispanic_024','hispanic_026'],baseline:-3,support:{D:58,R:34,I:8,G:0,L:0,PSL:0},priorities:['economy','healthcare','immigration']},
            {id:'hispanic_spanish',parentId:'hispanic',name:'Spaniards & Spanish Americans',sourceVariables:['hispanic_028','hispanic_029','hispanic_030'],baseline:-2,support:{D:55,R:35,I:10,G:0,L:0,PSL:0},priorities:['economy','education','healthcare']},
            {id:'hispanic_other',parentId:'hispanic',name:'Other Hispanic/Latino origins',sourceVariables:['hispanic_031'],baseline:-2,support:{D:55,R:36,I:9,G:0,L:0,PSL:0},priorities:['economy','healthcare','immigration']},
            {id:'asian_002',parentId:'asian',name:'Chinese American',sourceVariables:['asian_002'],baseline:-2,support:{D:56,R:38,I:6,G:0,L:0,PSL:0},priorities:['economy','foreign','education']},
            {id:'asian_012',parentId:'asian',name:'Filipino American',sourceVariables:['asian_012'],baseline:-4,support:{D:68,R:27,I:5,G:0,L:0,PSL:0},priorities:['healthcare','economy','military']},
            {id:'asian_021',parentId:'asian',name:'Indian American',sourceVariables:['asian_021'],baseline:-4,support:{D:68,R:25,I:7,G:0,L:0,PSL:0},priorities:['h1b','economy','education']},
            {id:'asian_005',parentId:'asian',name:'Korean American',sourceVariables:['asian_005'],baseline:-4,support:{D:67,R:27,I:6,G:0,L:0,PSL:0},priorities:['economy','education','foreign']},
            {id:'asian_019',parentId:'asian',name:'Vietnamese American',sourceVariables:['asian_019'],baseline:1,support:{D:47,R:47,I:6,G:0,L:0,PSL:0},priorities:['economy','foreign','education']},
            {id:'asian_004',parentId:'asian',name:'Japanese American',sourceVariables:['asian_004'],baseline:-2,support:{D:59,R:33,I:8,G:0,L:0,PSL:0},priorities:['economy','healthcare','foreign']},
            {id:'asian_008',parentId:'asian',name:'Taiwanese American',sourceVariables:['asian_008'],baseline:-2,support:{D:60,R:31,I:9,G:0,L:0,PSL:0},priorities:['foreign','economy','education']},
            {id:'asian_east_other',parentId:'asian',name:'Other East Asian origins',sourceVariables:['asian_003','asian_006','asian_007','asian_009'],baseline:-2,support:{D:57,R:35,I:8,G:0,L:0,PSL:0},priorities:['economy','education','foreign']},
            {id:'asian_south_other',parentId:'asian',name:'Other South Asian origins',sourceVariables:['asian_022','asian_023','asian_025','asian_026','asian_027','asian_028'],baseline:-3,support:{D:64,R:28,I:8,G:0,L:0,PSL:0},priorities:['economy','h1b','education']},
            {id:'asian_southeast_other',parentId:'asian',name:'Other Southeast Asian origins',sourceVariables:['asian_010','asian_011','asian_013','asian_014','asian_015','asian_016','asian_017','asian_018','asian_020'],baseline:-2,support:{D:57,R:36,I:7,G:0,L:0,PSL:0},priorities:['economy','healthcare','education']},
            {id:'asian_other',parentId:'asian',name:'Other Asian origins',sourceVariables:['asian_029','asian_030','asian_031','asian_032','asian_033','asian_034'],baseline:-2,support:{D:55,R:36,I:9,G:0,L:0,PSL:0},priorities:['economy','education','healthcare']},
            {id:'pacific_002',parentId:'pacific',name:'Native Hawaiian',sourceVariables:['pacific_002'],baseline:-3,support:{D:58,R:34,I:8,G:0,L:0,PSL:0},priorities:['healthcare','housing','infrastructure']},
            {id:'pacific_003',parentId:'pacific',name:'Samoan',sourceVariables:['pacific_003'],baseline:-1,support:{D:52,R:40,I:8,G:0,L:0,PSL:0},priorities:['healthcare','economy','military']},
            {id:'pacific_chamorro',parentId:'pacific',name:'Chamorro & Guamanian',sourceVariables:['pacific_006','pacific_008'],baseline:-1,support:{D:52,R:40,I:8,G:0,L:0,PSL:0},priorities:['military','healthcare','infrastructure']},
            {id:'pacific_micronesian',parentId:'pacific',name:'Micronesian & Marshallese',sourceVariables:['pacific_007','pacific_009','pacific_010'],baseline:-2,support:{D:55,R:37,I:8,G:0,L:0,PSL:0},priorities:['housing','healthcare','infrastructure']},
            {id:'pacific_other',parentId:'pacific',name:'Other Pacific Islander origins',sourceVariables:['pacific_004','pacific_005','pacific_011','pacific_012','pacific_013','pacific_014'],baseline:-2,support:{D:54,R:38,I:8,G:0,L:0,PSL:0},priorities:['healthcare','housing','infrastructure']}
        ];
        Object.keys(INTEREST_GROUPS).forEach(function(id){if(INTEREST_GROUPS[id].parentId&&INTEREST_GROUPS[id].sourceVariable)delete INTEREST_GROUPS[id];});
        curated.forEach(function(def){
            var parent=INTEREST_GROUPS[def.parentId];
            if(!parent)return;
            INTEREST_GROUPS[def.id]=Object.assign({},parent,{name:def.name,parentId:def.parentId,sourceTable:'ACS origin tables',sourceVariables:def.sourceVariables,priorities:def.priorities.slice(),support:Object.assign({},parent.support,def.support),baseline:def.baseline,messageFrames:def.messageFrames&&Object.assign({},def.messageFrames),category:'Racial/Ethnic'});
            BASE_TURNOUT_RATES[def.id]=BASE_TURNOUT_RATES[def.parentId]||0.6;
        });
        this.configureProfiles();
        var self=this;
        Object.keys(INTEREST_GROUPS).forEach(function(id){
            var group=INTEREST_GROUPS[id];
            if(group.internalOnly){
                group.description=(self.profiles[id]&&self.profiles[id].description||'This is an internal scenario segment used by the electorate model.')+
                    ' It is not an observed population category or a mutually exclusive voter count, and its county values are retained only as bounded simulation inputs.';
                group.priorities=group.priorities.map(function(issueId){return IssueModel.canonical(issueId);}).filter(function(issueId){return IssueModel.getIssue(issueId);});
                return;
            }
            var totals={},concentrations=[];
            Object.values(counties).forEach(function(c){var count=c.p*self.share(c,id);totals[c.s]=(totals[c.s]||0)+count;if(count>0)concentrations.push({name:c.n+', '+c.s,count:count});});
            concentrations.sort(function(a,b){return b.count-a.count;});
            var top=Object.keys(totals).sort(function(a,b){return totals[b]-totals[a];}).filter(function(s){return totals[s]>0;}).slice(0,4);
            self.groupGeography[id]=top;
            var specific=self.profiles[id]&&self.profiles[id].description;
            if(group.parentId){
                specific='This subgroup follows the '+group.name+' category in '+group.sourceTable+' of the 2019–2023 ACS. It identifies reported origin within '+INTEREST_GROUPS[group.parentId].name+', rather than a nationality or citizenship requirement. '+(id.endsWith('_034')?'This residual category preserves people reporting more than one Asian origin. ':'')+(concentrations.length?'Nonzero resident estimates occur in '+concentrations.length.toLocaleString()+' modeled counties; the largest counts are in '+concentrations.slice(0,3).map(function(c){return c.name;}).join('; ')+'. ':'');
            }
            group.description=(specific||'This group describes '+group.name.toLowerCase()+', an overlapping segment of the simulated electorate.')+
                (top.length?' The largest modeled resident concentrations in this dataset are in '+top.join(', ')+'. ':' ')+
                'Members vary in age, income, religion and political outlook. The issue distribution and importance settings are scenario assumptions with internal variation; Census population estimates do not measure these opinions.';
            if(typeof PLAYER_GROUP_DESCRIPTIONS!=='undefined'&&PLAYER_GROUP_DESCRIPTIONS[id])group.description=PLAYER_GROUP_DESCRIPTIONS[id];
            group.priorities=group.priorities.map(function(i){return IssueModel.canonical(i);}).filter(function(i){return IssueModel.getIssue(i);});
        });
        // Compatibility tags now resolve the actual origin, not all Latinos.
        if(typeof GROUP_TAG_ALIASES!=='undefined')GROUP_TAG_ALIASES.cuban='hispanic_006';
    },
    configureProfiles:function(){
        // Economic / rights / foreign / environment / government centers on the
        // seven-position scale. Different dimensions deliberately vary.
        var rows={
            white:[0.2,0.3,0.2,0.2,0.2,'Non-Hispanic residents reporting White alone. This broad category includes many different ancestries and local communities.'],
            black:[-1.2,-1.1,-0.3,-0.6,-0.5,'Non-Hispanic residents reporting Black or African American alone. Migration history, region and generation distinguish communities within this broad category.'],
            hispanic:[-0.7,-0.2,-0.2,-0.4,-0.3,'Hispanic or Latino origin is measured across races. The expanded list preserves the Census origin categories and their parent totals.'],
            asian:[-0.1,-0.4,0.1,-0.5,-0.2,'Non-Hispanic residents reporting Asian alone. Detailed origins are allocated proportionally from the Asian-alone table; the non-Hispanic origin intersection is modeled.'],
            native:[-0.8,-0.5,-0.7,-1.3,-0.3,'Non-Hispanic American Indian and Alaska Native residents. Tribal citizenship, sovereignty and the Census racial category are distinct concepts.'],
            pacific:[-0.6,-0.3,-0.5,-0.8,-0.2,'Non-Hispanic Native Hawaiian and other Pacific Islander residents. Distinct island communities and multiple-origin categories remain separately visible.'],
            multiracial:[-0.6,-0.6,-0.2,-0.5,-0.3,'Non-Hispanic residents reporting two or more racial categories. This population is retained as its own partition rather than counted in several racial totals.'],
            other_race:[-0.3,-0.2,0,-0.2,0,'Non-Hispanic residents in the remaining Census race category. This residual keeps the population accounting complete without inventing ancestry.'],
            evangelical:[0.7,1.8,0.6,0.6,0.7,'A modeled religious membership spanning several denominations and racial communities. Membership estimates come from the legacy scenario, with source provenance unverified.'],
            catholic:[-0.2,0.5,0,-0.2,0,'A modeled Catholic religious membership with varied observance, ancestry and social views. The county shares are legacy estimates rather than ACS religious data.'],
            jewish:[-0.6,-1,0.2,-0.8,-0.6,'A modeled Jewish religious/community segment with diverse traditions and views. County religious shares are legacy estimates, not Census religion measurements.'],
            muslim:[-0.7,-0.1,-1.1,-0.5,-0.4,'A modeled Muslim religious segment encompassing many origins and levels of observance. County membership is a legacy assumption with unverified provenance.'],
            secular:[-0.6,-1.5,-0.5,-1,-0.8,'A modeled unaffiliated religious segment including atheists, agnostics and people without a formal affiliation. It is not a uniform philosophical or political identity.'],
            union:[-1.4,-0.2,-0.1,-0.2,-0.5,'Workers represented by or belonging to unions in the legacy scenario. Public and private-sector workplaces may have different priorities and bargaining conditions.'],
            bluecollar:[-0.5,0.6,0.1,0.5,0.2,'An occupational proxy based on selected construction, manufacturing, extraction and transport industries. Industry is not identical to occupation, so these memberships are modeled.'],
            whitecollar:[0,-0.5,0.1,-0.5,-0.1,'A modeled professional-worker segment using educational attainment as a limited proxy. This does not identify actual occupations from individual records.'],
            smallbusiness:[1.1,0.3,0.1,0.4,0.7,'Owners of smaller firms in the scenario. Local ownership shares are modeled because the demographic inputs do not measure individual business ownership.'],
            tech:[0.2,-0.8,0.1,-0.5,-0.4,'An information-industry proxy for technology-oriented workers. Technology jobs also occur outside information industries, so this is an incomplete modeled segment.'],
            farmers:[-0.1,0.8,0.2,0.6,0.4,'An agriculture, forestry and fishing industry proxy. It includes employed residents and is not a direct count of farm owners or agricultural land.'],
            military:[0.3,0.5,1.2,0.3,0.4,'A modeled service-member and veteran segment. These are separate lived experiences; the current county allocation is a scenario assumption awaiting dedicated veteran data.'],
            college:[-0.3,-0.7,0,-0.9,-0.4,'Residents aged 25 and older with a bachelor’s or advanced degree in ACS B15003. Applying this share to the adult electorate is a modeled approximation.'],
            noncollege:[-0.4,0.5,0,0.3,0.3,'Residents aged 25 and older without a bachelor’s degree. This includes varied vocational credentials, some college and many different income levels.'],
            urban:[-0.8,-0.9,-0.2,-1,-0.5,'A modeled urban segment derived from the legacy settlement/rural classification. County-wide urban and rural averages do not locate individual voters.'],
            suburban:[0,-0.2,0.2,-0.2,0,'A modeled suburban segment derived from settlement classifications. Suburbs differ substantially in density, housing costs and employment patterns.'],
            rural:[0.2,0.9,0.1,0.5,0.5,'A rural-residence segment using the imported rural classification. Farming, resource extraction, tourism and commuting communities can differ substantially.'],
            youth:[-1,-1.1,-0.7,-1.4,-0.7,'Adults aged 18–24 in the ACS age table. These are resident age shares, not measured turnout or registration rates.'],
            genz:[-1,-1.1,-0.7,-1.4,-0.7,'A youth-oriented scenario segment currently proxied by adults aged 18–24, not a precise 2028 birth-cohort count.'],
            age25_44:[-0.5,-0.5,-0.2,-0.6,-0.3,'Adults aged 25–44, measured as a share of the adult resident population. Housing, family and career circumstances vary within this age band.'],
            age45_64:[0.1,0.3,0.3,0.1,0.2,'Adults aged 45–64 in the ACS resident age distribution. The scenario models varied employment, family care and retirement circumstances.'],
            seniors:[-0.1,0.6,0.5,0.2,0.2,'Adults aged 65 and older in the ACS. Retirement status, health, wealth and family arrangements are not determined by age alone.'],
            progressives:[-2.1,-1.8,-1.1,-2.1,-1.5,'A scenario political orientation favoring structural reform and expanded public provision. County membership is a legacy political estimate, not a Census measurement.'],
            libertarians:[1.8,-1,-1.5,0.7,1.2,'A scenario political orientation combining market economics, civil liberties and limited government. Preferences can cross conventional partisan positions.'],
            maga:[0.6,1.8,-0.1,1.5,1.5,'A scenario political movement with national-populist themes. Its economic, foreign-policy and social preferences are modeled separately rather than set to one ideology value.'],
            centrists:[0,0,0,0,0,'A modeled middle-of-the-spectrum political segment with broad internal variation. Being near the average on one issue need not imply moderation on every issue.'],
            women:[-0.4,-0.6,-0.3,-0.5,-0.2,'Adult female resident share from the ACS sex-by-age table, used as a proxy for women voters. Survey sex categories do not directly measure gender identity.'],
            suburban_women:[-0.2,-0.5,0,-0.4,-0.1,'A modeled intersection of suburban residence and the adult female share. The source provides marginal shares, so their intersection is an explicit approximation.'],
            lgbtq_community:[-0.9,-1.8,-0.5,-0.8,-0.9,'A modeled LGBTQ+ community segment. Current county membership is a scenario assumption, not a Census estimate of sexuality or gender identity.']
        };
        var self=this;
        Object.keys(rows).forEach(function(id){var r=rows[id];self.profiles[id]={centers:r.slice(0,5),description:r[5],overrides:{}};});
        var overrides={
            union:{labor:[-2.1,92],trade:[-1.2,78],minwage:[-1.5,84]},
            evangelical:{abortion:[2.2,94],religious_freedom:[2,90],healthcare:[-0.3,57]},
            catholic:{abortion:[0.8,70],citizenship:[-0.8,68],socialsecurity:[-0.9,76]},
            jewish:{israel:[-0.1,83],civilrights:[-1,76]},muslim:{israel:[-1.7,91],foreign:[-1.6,80],religious_freedom:[0.2,74]},
            youth:{housing:[-1.1,87],studentdebt:[-1.6,86],socialsecurity:[-0.4,36]},
            seniors:{socialsecurity:[-1.2,94],medicare:[-1.3,93],studentdebt:[0.3,29]},
            farmers:{trade:[-0.2,82],seasonalvisas:[-0.8,86],water:[0,79]},
            tech:{h1b:[-0.5,84],airegulation:[0.2,86],privacy:[-0.7,80]},
            smallbusiness:{business:[1.5,92],taxation:[1.1,85],healthcare:[-0.1,72]},
            libertarians:{privacy:[2,91],foreign:[2,85],cannabis:[-2,82],abortion:[-0.7,68]},
            maga:{trade:[2,87],foreign:[1.6,76],immigration:[2.2,94],socialsecurity:[-0.8,77]},
            native:{water:[-1.5,88],civilrights:[-1.3,80]},
            women:{abortion:[-1,86],medicare:[-0.8,74]},lgbtq_community:{lgbtq:[-2.2,96],civilrights:[-1.7,87]},
            hispanic_006:{cuba:[0.8,87],venezuela:[1.1,78],taxation:[0.4,64],citizenship:[-0.3,69]},
            hispanic_025:{venezuela:[0.8,87],citizenship:[-1.2,78]},
            hispanic_004:{immigration:[-0.7,76],healthcare:[-0.8,78]},
            hispanic_005:{infrastructure:[-1,82],healthcare:[-1.1,84]}
        };
        Object.keys(overrides).forEach(function(id){if(!self.profiles[id])self.profiles[id]={centers:rows[self.rootGroup(id)].slice(0,5),overrides:{}};self.profiles[id].overrides=overrides[id];});
    },
    profile:function(id,issueId){
        var issue=IssueModel.getIssue(issueId),group=INTEREST_GROUPS[id]||{},root=this.rootGroup(id),p=this.profiles[id]||this.profiles[root]||{centers:[0,0,0,0,0],overrides:{}};
        if(!issue)return null;
        var dimension=issue.category==='Economy & Work'||issue.category==='Housing & Infrastructure'||issue.category==='Health & Retirement'?0:issue.category==='Rights & Education'||issue.category==='Immigration'?1:issue.category==='Foreign Policy & Defense'?2:issue.category==='Energy & Environment'?3:4;
        var override=p.overrides[issue.id]||(this.profiles[root]&&this.profiles[root].overrides[issue.id]);
        var center=override?override[0]:p.centers[dimension];
        var rank=(group.priorities||[]).indexOf(issue.id),importance=override?override[1]:rank>=0?88-rank*9:40;
        if(issue.id==='economy'||issue.id==='healthcare')importance=Math.max(importance,66);
        var spread=group.category==='Political'?0.85:1.15;
        var distribution=IssueModel.positions.map(function(pos,i){return Math.exp(-0.5*Math.pow((i-3-center)/spread,2));});
        distribution=this.normalize(distribution);
        var mean=distribution.reduce(function(a,b,i){return a+b*(i-3);},0),mode=distribution.indexOf(Math.max.apply(null,distribution));
        var attention=(gameData.groupAttention&&gameData.groupAttention[id]&&gameData.groupAttention[id][issue.id])||0;
        return {distribution:distribution,mean:mean,mode:IssueModel.positions[mode].id,importance:this.clamp(importance+attention,0,100),baselineImportance:importance,
            description:'Modeled issue-specific distribution, with a '+spread.toFixed(2)+'-step spread. '+(override?'An explicit scenario override differentiates this issue.':'Inherited from this group’s separate policy-domain profile.')+' Not a measured Census opinion.'};
    },
    prepare:function(){
        if(this.compiled)return this.compiled;
        this.compiled=this.compileCandidates(Utils.getActiveCandidates().map(function(c){return Object.assign({},c.cand,{party:c.party});}));
        return this.compiled;
    },
    compileCandidates:function(candidates){
        var self=this;
        var groups={};
        Object.keys(INTEREST_GROUPS).forEach(function(id){
            var issues={},scores=candidates.map(function(){return 0;}),total=0;
            CORE_ISSUES.forEach(function(issue){var profile=self.profile(id,issue.id);var align=candidates.map(function(c){var pos=IssueModel.getPosition(c,issue.id);return profile.distribution.reduce(function(a,w,index){return a+w*IssueModel.agreement(issue.id,pos.id,IssueModel.positions[index].id);},0);});
                total+=profile.baselineImportance;align.forEach(function(a,i){scores[i]+=a*profile.baselineImportance;});issues[issue.id]={align:align,importance:profile.baselineImportance};});
            groups[id]={issues:issues,scores:scores.map(function(v){return v/(total||1);})};
        });
        return {candidates:candidates,groups:groups};
    },
    rakeCountyCellBase:function(county,candidates,iterations){
        if(!county||!county.electorateCells||!county.electorateCells.length||!candidates||!candidates.length)return;
        var target=this.normalize(candidates.map(function(candidate){return Math.max(0,(county.v&&county.v[candidate.party])||0);}));
        for(var iter=0;iter<(iterations||1);iter++){
            var sums=target.map(function(){return 0;});
            county.electorateCells.forEach(function(cell){cell.base.forEach(function(value,index){sums[index]+=cell.weight*value;});});
            county.electorateCells.forEach(function(cell){cell.base=Electorate.normalize(cell.base.map(function(value,index){return sums[index]?value*target[index]/sums[index]:value;}));});
        }
    },
    referenceCellWeight:function(county,cell){
        var parent=this.rootGroup(cell.group);
        var registered=Number(county.regVoters);
        if(!(registered>0))registered=Number(county.demographics&&county.demographics.cvap)||Number(county.p)||0;
        return Math.max(0,registered)*Math.max(0,cell.weight||0)*(BASE_TURNOUT_RATES[parent]||0.6);
    },
    calibrateReferenceRaceCells:function(counties,candidates){
        var reference=typeof REFERENCE_2024_RACE_VOTE_CHOICE!=='undefined'&&REFERENCE_2024_RACE_VOTE_CHOICE;
        var anchors=reference&&reference.twoPartyDemocraticShare;
        if(!anchors||!candidates||!candidates.some(function(candidate){return candidate.party==='D';})||!candidates.some(function(candidate){return candidate.party==='R';}))return;
        var self=this,countyList=Object.values(counties||{}),anchorIds=Object.keys(anchors).filter(function(id){return anchors[id]>0&&anchors[id]<1;});
        if(!countyList.length||!anchorIds.length)return;

        // Alternate national group calibration with county-level raking. This
        // preserves every imported county party total while making the 2024
        // reference electorate reproduce the published national D/R split for
        // the exclusive racial/ethnic cells. The source values are anchors,
        // not claims that local communities vote identically.
        for(var iteration=0;iteration<20;iteration++){
            var observed={};anchorIds.forEach(function(id){observed[id]={D:0,R:0};});
            countyList.forEach(function(county){(county.electorateCells||[]).forEach(function(cell){
                var parent=self.rootGroup(cell.group);
                if(!observed[parent])return;
                var weight=self.referenceCellWeight(county,cell);
                cell.base.forEach(function(value,index){var party=candidates[index].party;if(party==='D'||party==='R')observed[parent][party]+=weight*Math.max(0,value||0);});
            });});

            var largestError=0;
            anchorIds.forEach(function(id){
                var totals=observed[id],twoParty=totals.D+totals.R;
                if(!(twoParty>0))return;
                var current=this.clamp(totals.D/twoParty,0.0001,0.9999),target=this.clamp(anchors[id],0.0001,0.9999);
                largestError=Math.max(largestError,Math.abs(target-current));
                // County re-raking partly offsets a national correction. A
                // damped 0.9 log-odds step reaches the stable solution much
                // faster than a full jump without producing oscillation.
                var adjustment=this.clamp(Math.log((target/(1-target))/(current/(1-current)))*0.9,-1.5,1.5);
                countyList.forEach(function(county){(county.electorateCells||[]).forEach(function(cell){
                    if(self.rootGroup(cell.group)!==id)return;
                    cell.base=self.normalize(cell.base.map(function(value,index){
                        var party=candidates[index].party;
                        if(party==='D')return value*Math.exp(adjustment);
                        if(party==='R')return value*Math.exp(-adjustment);
                        return value;
                    }));
                });});
            },this);
            countyList.forEach(function(county){self.rakeCountyCellBase(county,candidates,8);});
            if(largestError<0.00015)break;
        }
        this.referenceCalibration={year:reference.year,dimensions:anchorIds.slice(),source:reference.source};
    },
    initialize:function(){
        this.ready=false;this.invalidate();this.reference={};
        var self=this;
        var pres=[];[gameData.candidate,gameData.demTicket.pres,gameData.repTicket.pres].concat(Object.values(gameData.thirdTickets||{}).map(function(t){return t.pres;})).forEach(function(c){if(c&&pres.indexOf(c)<0){IssueModel.initialize(c);pres.push(c);}});
        gameData.groupPolls={};gameData.groupAttention={};gameData.simulationVersion=2;gameData.pollSeed=Math.floor(Math.random()*0x7fffffff);
        var prepared=this.prepare();
        Object.keys(prepared.groups).forEach(function(id){self.reference[id]=prepared.groups[id].scores.slice();});
        var countyList=Object.values(Counties.countyData);
        countyList.forEach(function(c){
            c.issueAttention={};c.issueMessages={};c.simulationBaseV=Object.assign({},c.v);c.electorateCells=self.makeCells(c);
            c.electorateCells.forEach(function(cell){var g=INTEREST_GROUPS[cell.group]||{};cell.base=prepared.candidates.map(function(cand,i){return Math.max(0.005,(c.v[cand.party]||0)/100)*Math.pow(Math.max(0.01,((g.support||{})[cand.party]||1)/50),0.3)*Math.exp(0.35*prepared.groups[cell.group].scores[i]);});cell.base=self.normalize(cell.base);});
            // Raking creates different subgroup preferences while preserving the
            // imported county party shares exactly at the unmodified baseline.
            self.rakeCountyCellBase(c,prepared.candidates,35);
        });
        self.calibrateReferenceRaceCells(Counties.countyData,prepared.candidates);
        this.ready=true;this.invalidate();this.recompute();
    },
    makeCells:function(county){
        var d=county.demographics||{},cvap=d.cvap||county.p||1,white=this.clamp((d.cvapWhiteNonHispanic||0)/cvap,0,1),hisp=this.clamp((d.cvapHispanic||0)/cvap,0,1-white);
        var parentWeights={white:white,hispanic:hisp},other=['black','native','asian','pacific','other_race','multiracial'],self=this;
        var otherSum=other.reduce(function(a,g){return a+self.share(county,g);},0);
        other.forEach(function(g){parentWeights[g]=(1-white-hisp)*(otherSum?self.share(county,g)/otherSum:1/other.length);});
        var cells=[];
        Object.keys(parentWeights).forEach(function(parent){
            var children=Object.keys(INTEREST_GROUPS).filter(function(id){return INTEREST_GROUPS[id].parentId===parent;}),sum=children.reduce(function(a,g){return a+self.share(county,g);},0);
            if(children.length&&sum>0){children.forEach(function(id){var weight=parentWeights[parent]*self.share(county,id)/sum;if(weight>0)cells.push({group:id,weight:weight});});}
            else if(parentWeights[parent]>0)cells.push({group:parent,weight:parentWeights[parent]});
        });
        var weights=this.normalize(cells.map(function(c){return c.weight;}));cells.forEach(function(c,i){c.weight=weights[i];});return cells;
    },
    response:function(county,group,base,context){
        if(!context&&typeof PrimaryNative!=='undefined'&&PrimaryNative.active())return PrimaryNative.voterResponse(county,group,PrimaryNative.groupBase(county,group),0.43);
        var primary=!!(context&&context.primary),model=context&&context.model||this.prepare(),g=model.groups[group],reference=primary?model.candidates.map(function(){return 0;}):this.reference[group]||g.scores,self=this;
        var overlay=INTEREST_GROUPS[group].category==='Racial/Ethnic'?this.overlay(county,context):null;
        var logs=base.map(function(v,i){var party=model.candidates[i].party;return Math.log(Math.max(1e-9,v))+self.tuning.policy*((g.scores[i]-reference[i])*(overlay?0.6:1)+(overlay?0.4*overlay.delta[i]:0))+(primary?0:Math.log(Math.max(0.02,(county.v[party]||0)+0.1)/Math.max(0.02,(county.simulationBaseV[party]||0)+0.1)));});
        var turnoutDelta=0,attention=county.issueAttention||{},message=county.issueMessages||{};
        Object.keys(attention).forEach(function(issueId){
            var info=self.blendIssue(g.issues[issueId],overlay&&overlay.issues[issueId]);if(!info)return;var intensity=attention[issueId],salience=info.importance/100;
            info.align.forEach(function(align,i){logs[i]+=self.tuning.attention*intensity*salience*align;});
            var max=Math.max.apply(null,info.align),min=Math.min.apply(null,info.align);
            turnoutDelta+=0.0015*intensity*salience*(max+0.4*(max-min));
        });
        Object.keys(message).forEach(function(key){
            var m=message[key],info=self.blendIssue(g.issues[m.issueId],overlay&&overlay.issues[m.issueId]);if(!info)return;
            var sponsor=model.candidates.findIndex(function(c){return c.id===m.sponsorId;}),target=model.candidates.findIndex(function(c){return c.id===m.targetId;});
            var reach=m.segment?self.segmentExposure(county,group,m.segment):1;
            var source=sponsor>=0?model.candidates[sponsor]:null,credibility=source&&source.issueCredibility&&source.issueCredibility[m.issueId];
            reach*=0.5+(credibility===undefined?0.5:self.clamp(credibility,0,1));
            if(m.type==='attack'&&target>=0){
                var targetAlign=info.align[target];
                if(m.stance){var profile=self.profile(group,m.issueId);targetAlign=profile.distribution.reduce(function(a,w,i){return a+w*IssueModel.agreement(m.issueId,m.stance,IssueModel.positions[i].id);},0);}
                var current=IssueModel.getPosition(model.candidates[target].id,m.issueId),accuracy=m.stance?Math.max(0,IssueModel.agreement(m.issueId,m.stance,current.id)):1;
                logs[target]+=self.tuning.persuasion*m.exposure*reach*(info.importance/100)*(targetAlign-0.2)*accuracy;
                var framePenalty=self.messageFramePenalty(group,m);
                if(framePenalty)logs[target]-=self.tuning.persuasion*m.exposure*reach*framePenalty;
                if(sponsor>=0)logs[sponsor]-=0.012*m.exposure*reach*Math.max(0,targetAlign-info.align[sponsor]);
                if(sponsor>=0&&accuracy<0.5)logs[sponsor]-=0.02*m.exposure*reach*(1-accuracy);
            }else if(sponsor>=0){logs[sponsor]+=self.tuning.persuasion*m.exposure*reach*(info.importance/100)*(info.align[sponsor]-0.12);}
        });
        var eraRates=logs.map(function(){return 0;});
        if (typeof CandidateEraEffects !== 'undefined' && CandidateEraEffects.apply) {
            if(primary){model.candidates.forEach(function(c,i){var values=[logs[i]],rates=[0];CandidateEraEffects.apply(values,rates,[c],group);logs[i]=values[0];eraRates[i]=rates[0];});}
            else CandidateEraEffects.apply(logs,eraRates,model.candidates,group);
        }
        var maxlog=Math.max.apply(null,logs),preferences=this.normalize(logs.map(function(v){return Math.exp(v-maxlog);}));
        var parent=this.rootGroup(group),baseline=BASE_TURNOUT_RATES[parent]||0.6,current=gameData.interestGroupTurnout[parent];
        var ratio=current===undefined?1:this.clamp(current/baseline,0,1.6);
        if(overlay)ratio=ratio*0.6+overlay.turnoutRatio*0.4;
        var rate=primary?context.turnoutBase:county.turnoutBase===undefined?0.65:county.turnoutBase;
        // County turnoutBase already anchors the number of ballots to local
        // history. Apply UF demographic differences within the county, centered
        // on that county's racial/ethnic mix so the baseline does not create or
        // remove ballots a second time. Campaign effects remain in `ratio`.
        var countyBaseline=0;
        (county.electorateCells||[]).forEach(function(cell){
            var cellParent=self.rootGroup(cell.group);
            countyBaseline+=cell.weight*(BASE_TURNOUT_RATES[cellParent]||0.6);
        });
        var structuralRatio=countyBaseline>0?self.clamp(baseline/countyBaseline,0.55,1.45):1;
        if(primary){
            // Primaries change eligibility and the contest turnout baseline.
            // Policy, overlapping demographics, messages, salience and era
            // effects above are the same voter response used by the general.
            var primaryRates=model.candidates.map(function(candidate,i){return self.clamp((rate*structuralRatio+self.clamp(turnoutDelta,-0.12,0.12)+(county.mobilization||0))*context.turnoutMultiplier(candidate,county,group,overlay)+eraRates[i],0,1);});
            return {preferences:preferences,rates:primaryRates};
        }
        var state=county.s;
        var fieldBonus=0;if(typeof GroundOps!=='undefined'){fieldBonus+=(GroundOps.getPassiveOfficeBonus(state)||0)+(GroundOps.getGOTVLift(state)||0);}
        rate=rate*structuralRatio*ratio+this.clamp(turnoutDelta,-0.12,0.12)+(county.mobilization||0);
        var multipliers=Counties.getPartyTurnoutMultipliers(county),baseMult={D:1,R:1,G:0.7,L:0.7,I:0.7,PSL:0.7};baseMult[gameData.selectedParty]=1;
        var rates=preferences.map(function(v,i){var party=model.candidates[i].party;var mult=(multipliers[party]===undefined?baseMult[party]:multipliers[party])/baseMult[party];return self.clamp(rate*mult+(party===gameData.selectedParty?fieldBonus:0)+(county.partyMobilization&&county.partyMobilization[party]||0)+eraRates[i],0,1);});
        return {preferences:preferences,rates:rates};
    },
    blendIssue:function(a,b){if(!a)return null;if(!b)return a;return {importance:a.importance*0.6+b.importance*0.4,align:a.align.map(function(v,i){return v*0.6+b.align[i]*0.4;})};},
    messageFramePenalty:function(groupId,message){
        /* A frame is a transparent scenario mechanic, not a claim that every
           member of an origin group shares a political view. It applies only
           to a selected subgroup and only when the target's recorded platform
           has multiple leftmost economic-system positions. */
        if(!message||message.type!=='attack'||message.frame!=='socialism')return 0;
        var group=INTEREST_GROUPS[groupId]||{},frame=group.messageFrames&&group.messageFrames.socialism;
        if(!frame)return 0;
        var target=IssueModel.candidate(message.targetId);
        if(!target)return 0;
        var issues=['taxation','industrial','healthcare','housing','labor'],leftmost=issues.reduce(function(total,issueId){var position=IssueModel.getPosition(target,issueId);return total+(position&&position.index<=1?1:0);},0);
        return leftmost>=(frame.minLeftPositions||2)?Number(frame.penalty)||0:0;
    },
    overlay:function(county,context){
        var key=context&&context.primary?'primary:'+context.party+':'+(county.fips||county.s):county.fips,cached=this.overlayCache.get(key);if(cached)return cached;
        var self=this,model=context&&context.model||this.prepare(),members=[],families={};
        // Marginal memberships are a normalized influence mixture, never extra
        // people. Age, education, religion, work and geography each get one
        // family weight; nested gen-z and suburban-women tags are excluded.
            Object.keys(INTEREST_GROUPS).forEach(function(id){var g=INTEREST_GROUPS[id];if(g.internalOnly||g.category==='Racial/Ethnic'||id==='genz'||id==='suburban_women')return;var share=self.share(county,id);if(share>0){members.push({id:id,share:share,family:g.category});families[g.category]=(families[g.category]||0)+share;}});
        var familyCount=Object.keys(families).length||1,delta=model.candidates.map(function(){return 0;}),issues={},turnoutRatio=0;
        var activeIssues=Array.from(new Set(Object.keys(county.issueAttention||{}).concat(Object.values(county.issueMessages||{}).map(function(m){return m.issueId;}))));
        members.forEach(function(m){var weight=m.share/families[m.family]/familyCount,g=model.groups[m.id],ref=context&&context.primary?model.candidates.map(function(){return 0;}):self.reference[m.id]||g.scores;g.scores.forEach(function(v,i){delta[i]+=weight*(v-ref[i]);});var baseline=BASE_TURNOUT_RATES[m.id]||0.6,current=gameData.interestGroupTurnout[m.id];turnoutRatio+=weight*(current===undefined?1:self.clamp(current/baseline,0,1.6));activeIssues.forEach(function(id){var info=g.issues[id];if(!info)return;var out=issues[id]||(issues[id]={importance:0,align:model.candidates.map(function(){return 0;})});out.importance+=weight*info.importance;info.align.forEach(function(v,i){out.align[i]+=weight*v;});});});
        var result={delta:delta,issues:issues,turnoutRatio:members.length?turnoutRatio:1};this.overlayCache.set(key,result);return result;
    },
    segmentExposure:function(county,group,segment){
        var id=this.groupKey(segment),parent=this.rootGroup(group);
        if(id===group||id===parent)return 1;
        if(INTEREST_GROUPS[id]&&INTEREST_GROUPS[id].category==='Racial/Ethnic')return 0;
        return this.share(county,id);
    },
    countyResult:function(county){
        if(!this.ready||!county.electorateCells)return null;
        // Only simulation transitions invalidate the cache. Reads are pure.
        var signature=JSON.stringify([county.v,county.turnout,county.undecided,county.regVoters,county.turnoutBase,county.partyMobilization,gameData.currentWeek]);
        var cached=this.cache.get(county.fips);if(cached&&cached.signature===signature)return cached.result;
        var model=this.prepare(),self=this,total=0,byParty={D:0,R:0,G:0,L:0,I:0,PSL:0},cells=[];
        var cvap=county.demographics&&Number.isFinite(county.demographics.cvap)?Math.max(0,county.demographics.cvap):Math.max(0,county.p||0);
        // County registration is an election-administration input and may exceed
        // the ACS modeled CVAP, so it must not be capped to the ACS estimate.
        var registered=(county.demographics&&county.demographics.cvap===0)?0:Math.max(0,Number.isFinite(county.regVoters)?county.regVoters:cvap);
        county.electorateCells.forEach(function(cell){
            var r=self.response(county,cell.group,cell.base),values=r.preferences.map(function(p,i){
                var eligible=true,cand=model.candidates[i];
                eligible = typeof isPartyOnBallotForState === 'function'
                    ? isPartyOnBallotForState(cand.party, county.s)
                    : (typeof THIRD_PARTY_BALLOT_ACCESS === 'undefined' || !THIRD_PARTY_BALLOT_ACCESS[cand.party] || THIRD_PARTY_BALLOT_ACCESS[cand.party].indexOf(String(county.s || '').toUpperCase()) >= 0);
                return eligible?p:0;
            });values=self.normalize(values);
            var votes=values.map(function(p,i){return cell.weight*p*registered*r.rates[i];});
            votes.forEach(function(v,i){byParty[model.candidates[i].party]+=v;total+=v;});cells.push({group:cell.group,votes:votes,total:votes.reduce(function(a,b){return a+b;},0),weight:cell.weight});
        });
        var result={byParty:byParty,total:total,registered:registered,rate:registered?total/registered:0,cells:cells};
        this.cache.set(county.fips,{signature:signature,result:result});return result;
    },
    recompute:function(){
        if(!this.ready)return;
        if(!this._dirty && this.groupDenominators && Object.keys(this.groupDenominators).length > 0) return;
        var model=this.prepare(),totals={},denoms={},attentionTotals={},undecidedTotals={},self=this;
        var candidateIdToIndex={};
        model.candidates.forEach(function(c,i){candidateIdToIndex[c.id]=i;});
        var nonRacialGroups=Object.keys(INTEREST_GROUPS).filter(function(id){return INTEREST_GROUPS[id].category!=='Racial/Ethnic';});
        Object.keys(INTEREST_GROUPS).forEach(function(id){totals[id]=model.candidates.map(function(){return 0;});denoms[id]=0;attentionTotals[id]={};undecidedTotals[id]=0;});
        function metadata(id,c,weight){var undecided=typeof PrimaryNative!=='undefined'&&PrimaryNative.active()?PrimaryNative.undecided(c):self.clamp((c.undecided||0)/100,0,0.4);undecidedTotals[id]+=weight*undecided;Object.keys(c.issueAttention||{}).forEach(function(issue){attentionTotals[id][issue]=(attentionTotals[id][issue]||0)+weight*c.issueAttention[issue]*3;});}
        Object.values(Counties.countyData).forEach(function(c){
            var result=self.countyResult(c);
            result.cells.forEach(function(cell){[cell.group].concat(INTEREST_GROUPS[cell.group].parentId?[INTEREST_GROUPS[cell.group].parentId]:[]).forEach(function(id){var counted=0;cell.votes.forEach(function(v,i){var index=cell.candidateIds?candidateIdToIndex[cell.candidateIds[i]]:i;if(index>=0&&index<totals[id].length){totals[id][index]+=v;counted+=v;}});denoms[id]+=counted;metadata(id,c,counted);});});
            // Reporting estimates for overlapping groups do not create an
            // additional electorate. Their marginal membership is modeled.
            nonRacialGroups.forEach(function(id){var share=self.share(c,id);if(!share)return;
                var base=self.normalize(model.candidates.map(function(cand){return Math.max(0.00001,(c.simulationBaseV[cand.party]||0)/100)*Math.pow(Math.max(0.01,((INTEREST_GROUPS[id].support||{})[cand.party]||1)/50),0.3);}));
                var response=self.response(c,id,base),weight=result.total*share;
                response.preferences.forEach(function(v,i){totals[id][i]+=weight*v;});denoms[id]+=weight;metadata(id,c,weight);
            });
        });
        gameData.interestGroupSupport={};gameData.interestGroupBaseSupport={};
        Object.keys(totals).forEach(function(id){gameData.interestGroupSupport[id]={};model.candidates.forEach(function(c,i){gameData.interestGroupSupport[id][c.id]=denoms[id]?100*totals[id][i]/denoms[id]:0;});gameData.interestGroupBaseSupport[id]=Object.assign({},gameData.interestGroupSupport[id]);});
        this.groupDenominators=denoms;
        this.groupUndecided={};gameData.groupAttention={};Object.keys(denoms).forEach(function(id){self.groupUndecided[id]=denoms[id]?undecidedTotals[id]/denoms[id]:0;gameData.groupAttention[id]={};Object.keys(attentionTotals[id]).forEach(function(issue){gameData.groupAttention[id][issue]=denoms[id]?attentionTotals[id][issue]/denoms[id]:0;});});
        this._dirty=false;
    },
    expose:function(config){
        var self=this,affected=[],issue=IssueModel.getIssue(config.issueId);if(!issue)return [];
        var sponsor=IssueModel.candidate(config.sponsorId||gameData.candidate.id);if(!sponsor)return [];
        Object.values(Counties.countyData).forEach(function(county){
            var selected=config.countyId?county.fips===Counties.normalizeFips(config.countyId):config.counties?config.counties.indexOf(county.fips)>=0:county.s===config.stateCode;
            if(!selected)return;
            var amount=self.clamp(config.exposure===undefined?1:config.exposure,0,5);
            var attentionAmount=amount*(config.segment?self.share(county,config.segment):1);
            county.issueAttention=county.issueAttention||{};
            var old=county.issueAttention[issue.id]||0;
            county.issueAttention[issue.id]=self.clamp(old+attentionAmount/(1+old*0.25),0,self.tuning.maxAttention);
            // A finite county attention budget prevents every issue from
            // becoming maximally salient through unlimited purchases.
            var sum=Object.values(county.issueAttention).reduce(function(a,b){return a+b;},0);
            if(sum>40)Object.keys(county.issueAttention).forEach(function(id){county.issueAttention[id]*=40/sum;});
            county.issueMessages=county.issueMessages||{};
            var key=[sponsor.id,config.targetId||'',issue.id,config.type||'issue',config.segment||'',config.frame||''].join(':');
            var prev=county.issueMessages[key];
            county.issueMessages[key]={sponsorId:sponsor.id,targetId:config.targetId,issueId:issue.id,type:config.type||'issue',segment:config.segment,stance:config.stance,frame:config.frame,exposure:Math.min(10,(prev?prev.exposure:0)+amount/(1+(prev?prev.exposure:0)*0.3))};
            affected.push(county.s);
        });
        this.invalidate();return Array.from(new Set(affected));
    },
    weekly:function(){
        var self=this;
        Object.values(Counties.countyData).forEach(function(c){Object.keys(c.issueAttention||{}).forEach(function(id){c.issueAttention[id]*=self.tuning.attentionDecay;if(c.issueAttention[id]<0.02)delete c.issueAttention[id];});Object.keys(c.issueMessages||{}).forEach(function(id){c.issueMessages[id].exposure*=self.tuning.messageDecay;if(c.issueMessages[id].exposure<0.02)delete c.issueMessages[id];});c.mobilization=(c.mobilization||0)*0.8;Object.keys(c.partyMobilization||{}).forEach(function(p){c.partyMobilization[p]*=0.8;});});
        this.invalidate();this.recompute();
    }
};
