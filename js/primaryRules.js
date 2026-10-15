/* Pinned nomination scenario. Never treat projected allocations or district
   geography as certified 2028 rules. The provenance travels with every save. */
var PrimaryRules = (function () {
    'use strict';
    var sources = {
        dnc: 'https://democrats.org/dnc-votes-to-officially-select-early-states-for-2028-democratic-presidential-nominating-calendar/',
        dncConvention: 'https://democrats.org/news/dnc-announces-2028-convention-date-and-host-city-frontrunners/',
        dncAllocation: 'https://www.ncdp.org/wp-content/uploads/2024/03/NCDP-Delegate-Selection-Plan-9.27.2023-Revised.pdf',
        dncAutomatic: 'https://democrats.org/dncc-rules-committee-passes-permanent-rules-for-2024-presidential-nomination/',
        rnc: 'https://prod-static.gop.com/media/Rules_Of_The_Republican_Party.pdf',
        calendar: 'https://www.fec.gov/resources/cms-content/documents/2024pdates.pdf',
        nh: 'https://www.gc.nh.gov/rsa/html/LXIII/653/653-mrg.htm',
        ca: 'https://cagop.org/cagop-statement-on-the-passage-of-a-presidential-delegates-rules-change/',
        fl: 'https://florida.gop/delegates/',
        nv: 'https://nevadagop.org/wp-content/uploads/2024/01/2024-Nevada-First-in-the-West-Caucus-v31.16.24.pdf',
        green: 'https://gpus.org/convention-rules/',
        libertarian: 'https://lp.org/wp-content/uploads/2026-Indexed-LP-Bylaws-and-Convention-Rules-w-2026-JC-Rules-1.pdf'
    };
    var jurisdictions = {};
    // Democratic pledged totals below are a 2024-sized scenario baseline,
    // not final 2028 apportionment. Republican totals use an explicit estimate.
    var baseline = 'AL:52 AK:15 AZ:72 AR:31 CA:424 CO:72 CT:60 DE:19 DC:20 FL:224 GA:108 HI:22 ID:23 IL:147 IN:67 IA:40 KS:33 KY:53 LA:48 ME:24 MD:96 MA:92 MI:117 MN:75 MS:35 MO:64 MT:17 NE:29 NV:36 NH:23 NJ:126 NM:34 NY:268 NC:116 ND:13 OH:127 OK:36 OR:66 PA:159 RI:26 SC:55 SD:16 TN:63 TX:244 UT:30 VT:16 VA:99 WA:92 WV:20 WI:82 WY:13';
    baseline.split(' ').forEach(function (entry) {
        var pair = entry.split(':'), code = pair[0], state = STATES[code];
        var house = code === 'DC' ? 0 : Math.max(1, state.ev - 2);
        jurisdictions[code] = {code:code, name:state.name, ev:state.ev, house:house,
            demDelegates:Number(pair[1]), repDelegates:code === 'DC' ? 19 : 13 + house * 3 + (state.lean < 0 ? 14 : 4),
            automatic:Math.max(4, Math.round(Number(pair[1]) * 0.18)), territory:false};
    });
    [['AS','American Samoa',6,9],['GU','Guam',6,9],['MP','Northern Mariana Islands',6,9],['PR','Puerto Rico',36,23],['VI','U.S. Virgin Islands',6,9],['DA','Democrats Abroad',13,0]].forEach(function (r) {
        jurisdictions[r[0]] = {code:r[0],name:r[1],ev:0,house:0,demDelegates:r[2],repDelegates:r[3],automatic:r[0] === 'DA' ? 4 : 5,automaticMembers:r[0]==='DA'?8:5,territory:true};
    });
    var dates = {}, earlyD = {SC:'01-22',NV:'02-01',NH:'02-08',NM:'02-15',MI:'02-22',VA:'02-29'};
    function group(date, codes) { codes.split(' ').forEach(function (code) { dates[code] = date; }); }
    group('03-07','AL AK AR CA CO IA ME MA MN NC OK TN TX UT VT VA AS DA');
    group('03-11','GU MP'); group('03-14','GA HI MS WA'); group('03-18','MO');
    group('03-21','AZ FL IL KS OH'); group('03-25','LA'); group('04-04','CT DE NY RI WI');
    group('04-08','WY'); group('04-23','PR'); group('04-25','PA'); group('04-29','ND');
    group('05-06','ID'); group('05-09','IN'); group('05-16','MD NE WV');
    group('05-23','KY OR'); group('06-06','DC MT NJ NM SD'); group('06-10','VI');
    var rEarly = {IA:'01-10',NH:'01-18',NV:'02-03',SC:'02-19',MI:'02-29',ID:'03-04',MO:'03-04',ND:'03-06',WY:'04-22',HI:'03-14',VI:'02-10',PR:'03-19',DC:'03-05'};
    
    // Researched state-by-state, party-specific primary & caucus eligibility
    var dEligibility = {
        AZ:'closed', CT:'closed', DE:'closed', FL:'closed', KY:'closed', MD:'closed', NV:'closed', NM:'closed', NY:'closed', OR:'closed', PA:'closed', DC:'closed', PR:'closed',
        CA:'semi-closed', CO:'semi-closed', IA:'semi-closed', KS:'semi-closed', MA:'semi-closed', ME:'semi-closed', NC:'semi-closed', NE:'semi-closed', NH:'semi-closed', NJ:'semi-closed', OK:'semi-closed', RI:'semi-closed', UT:'semi-closed', WV:'semi-closed',
        AL:'open', AR:'open', GA:'open', HI:'open', IL:'open', IN:'open', MI:'open', MN:'open', MS:'open', MO:'open', MT:'open', ND:'open', OH:'open', SC:'open', TN:'open', TX:'open', VA:'open', VT:'open', WA:'open', WI:'open',
        HI:'caucus', ID:'caucus', WY:'caucus', AS:'caucus', GU:'caucus', MP:'caucus', VI:'caucus', DA:'semi-closed'
    };
    var rEligibility = {
        AZ:'closed', CA:'closed', CT:'closed', DE:'closed', FL:'closed', ID:'closed', KY:'closed', MD:'closed', NV:'closed', NM:'closed', NY:'closed', OK:'closed', OR:'closed', PA:'closed', SD:'closed', UT:'closed', WY:'closed', DC:'closed', PR:'closed',
        CO:'semi-closed', KS:'semi-closed', MA:'semi-closed', ME:'semi-closed', NC:'semi-closed', NE:'semi-closed', NH:'semi-closed', NJ:'semi-closed', RI:'semi-closed', WV:'semi-closed',
        AL:'open', AR:'open', GA:'open', IL:'open', IN:'open', MI:'open', MN:'open', MS:'open', MT:'open', OH:'open', SC:'open', TN:'open', TX:'open', VA:'open', VT:'open', WI:'open',
        IA:'caucus', NV:'caucus', ID:'caucus', MO:'caucus', ND:'caucus', WY:'caucus', AS:'caucus', GU:'caucus', MP:'caucus', VI:'caucus'
    };
    var dCaucus = 'HI ID WY AS GU MP VI'.split(' ');
    var rCaucus = 'IA NV ID MO ND WY AS GU MP VI'.split(' ');
    
    // Researched state statutory early voting / absentee ballot start windows (days before primary day)
    var earlyDaysMap = {
        MN:46, SD:46, VA:45, VT:45, MI:40, IL:40, CA:29, OH:28, AZ:27, GA:21, TX:14, FL:14, NV:14, TN:14, SC:14, NC:30, IN:28, NM:28, MD:14, WI:14,
        WV:10, AR:14, LA:14, OK:4, MA:7, RI:20, ME:30, CO:22, UT:14, WA:18, OR:20, HI:18, NJ:25, NY:10, PA:21, CT:7, DE:10,
        NH:0, AL:0, MS:0 // NH and AL have no general no-excuse in-person early voting window
    };
    function datePlus(date, days) { var d = new Date(date + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + days); return d.toISOString().slice(0,10); }
    function split(total, count) { return Array.from({length:count}, function (_, i) { return Math.floor(total/count) + (i < total%count ? 1 : 0); }); }
    function pools(party, j, date) {
        if (party === 'D') {
            var district = Math.round(j.demDelegates * 0.65), pleo = Math.round(j.demDelegates * 0.10);
            var n = Math.max(1,j.house);
            return split(district,n).map(function (size,i) {return {id:'CD'+(i+1),name:'District '+(i+1),delegates:size,method:'proportional',threshold:0.15,district:i+1,binding:1};}).concat([
                {id:'at-large',name:'At-large pledged',delegates:j.demDelegates-district-pleo,method:'proportional',threshold:0.15,binding:1},
                {id:'PLEO',name:'Pledged party leaders',delegates:pleo,method:'proportional',threshold:0.15,binding:1}
            ]).filter(function(p){return p.delegates>0;});
        }
        if (party !== 'R') return [{id:'members',name:party === 'G' ? 'State instructed delegates' : 'Member convention delegation',delegates:Math.max(3,Math.round(j.demDelegates*(party === 'G' ? 0.10 : 0.07))),method:'proportional',threshold:0,binding:party==='G'?1:0}];
        var total = j.repDelegates, before = date < '2028-03-15', method = before ? 'proportional' : 'winner-take-all';
        if (j.code === 'CA') return [{id:'state',name:'Statewide conditional sweep',delegates:total,method:'proportional',threshold:0,majority:0.50,binding:1}];
        if (j.code === 'FL') return [{id:'state',name:'Statewide winner-take-all',delegates:total,method:'winner-take-all',threshold:0,binding:3}];
        if (j.code === 'IA') return [{id:'state',name:'Caucus proportional allocation',delegates:total,method:'proportional',threshold:0,binding:1}];
        if (j.code === 'SC') method = 'winner-take-all'; // early-state exception
        if (!j.house || ['NH','NV','DC','NJ','NE','SD','MT'].indexOf(j.code)>=0) return [{id:'state',name:'Statewide allocation',delegates:total,method:method,threshold:method==='proportional'?0.10:0,binding:1}];
        // District allocation is deliberately identified as a scenario estimate
        // until every state files a 2028 plan and final district boundaries exist.
        return Array.from({length:j.house},function(_,i){return {id:'CD'+(i+1),name:'District '+(i+1),delegates:3,method:method,threshold:before?0.20:0,majority:before?0.50:null,district:i+1,binding:1};}).concat([
            {id:'at-large',name:'At-large, bonus and RNC members',delegates:total-j.house*3,method:method,threshold:before?0.20:0,majority:before?0.50:null,binding:1}
        ]);
    }
    function makeContests(parties) {
        var out = [];
        parties.forEach(function(party){
            if (party==='I') return; // ballot-access campaign, no invented primary
            Object.keys(jurisdictions).forEach(function(code,index){
                if(code==='DA' && party!=='D')return;
                var j=jurisdictions[code], minor=['L','G','PSL'].indexOf(party)>=0;
                if (minor && j.territory) return;
                var date='2028-'+(party==='D' ? earlyD[code]||dates[code] : party==='R' ? rEarly[code]||dates[code]||earlyD[code] : dates[code]||earlyD[code]);
                if(minor) date = datePlus('2028-02-05', Math.floor(index/6)*7);
                var caucus=(party==='D'?dCaucus:rCaucus).indexOf(code)>=0;
                var type=minor?(party==='G'?'party primary':'state convention'):caucus?'caucus':'primary';
                var ps=pools(party,j,date), delegateCount=ps.reduce(function(a,p){return a+p.delegates;},0);
                var official=party==='D'&&!!earlyD[code];
                var elig = minor ? 'members' : (party==='D' ? (dEligibility[code]||'semi-closed') : (rEligibility[code]||'closed'));
                var evDays = (caucus || minor) ? 0 : (earlyDaysMap[code] !== undefined ? earlyDaysMap[code] : 21);
                var evStart = evDays > 0 ? datePlus(date, -evDays) : date;
                var evShare = (caucus || minor || evDays === 0) ? 0 : (evDays >= 28 ? 0.38 : evDays >= 14 ? 0.26 : 0.12);
                out.push({id:party+'-'+code,party:party,state:code,name:j.name,date:date,type:type,
                    eligibility:elig,
                    delegates:delegateCount,pools:ps,status:'scheduled',result:null,
                    sourceStatus:official?'National party date approved; state implementation and allocations projected':'Projected 2028 scenario',
                    sources:[sources[party==='D'?'dnc':party==='R'?'rnc':party==='G'?'green':party==='L'?'libertarian':'calendar'],sources.calendar],
                    provenance:{date:official?'2028 DNC approved national window':'2024 calendar pattern projected to 2028; minor-party dates modeled',delegates:'Scenario estimate, not certified 2028 apportionment',districts:'Equal-delegate districts; fractional modeled county geography',rules:'2024/2026 party baseline with scenario simplifications',retrieved:'2026-10-13'},
                    note:code==='NH'?'DNC window and New Hampshire first-primary law may conflict. This scenario follows the party window.':minor?'Member organizing determines delegate preferences; this is not a binding public presidential election.':'Final 2028 state plans may change these parameters.',
                    earlyStart:evStart,earlyShare:evShare,
                    filingDeadline:datePlus(date,-60),selectionDate:datePlus(date,21),selected:false,
                    // Republican first preferences do not realign. Democratic
                    // caucus realignment is enabled only as a labeled model.
                    realignment:party==='D'&&caucus,allowUncommitted:party==='D'&&['MI','MN','WA','HI'].includes(code),releaseOnWithdrawal:party==='R'&&['FL','CA','TX'].indexOf(code)<0,
                    voterPool:minor?'party members':'registered and eligible participants',earlyBallots:{},earlyWeight:0});
            });
            if(party==='R')out.push({id:'R-NV-advisory',party:'R',state:'NV',name:'Nevada advisory primary',date:'2028-02-01',type:'advisory primary',eligibility:'closed',delegates:0,pools:[],status:'scheduled',result:null,sourceStatus:'Projected; 2024 dual-event baseline',sources:[sources.nv],provenance:{date:'Projected 2028',rules:'Advisory primary does not allocate caucus delegates'},note:'Separate nonbinding event. Caucus registrants are excluded from this advisory voter pool.',earlyStart:'2028-02-01',earlyShare:0,filingDeadline:'2027-12-01',selectionDate:'2028-02-01',selected:false,realignment:false,releaseOnWithdrawal:false,earlyBallots:{},earlyWeight:0});
        });
        return out.sort(function(a,b){return a.date.localeCompare(b.date)||a.id.localeCompare(b.id);});
    }
    // Largest remainder with stable tie ordering. Both votes and delegates
    // use integer totals, so rounding never creates a delegate or ballot.
    function apportion(weights,total,tieOrder) {
        var keys=Object.keys(weights), result={},sum=keys.reduce(function(s,k){return s+Math.max(0,weights[k]||0);},0);
        if(!keys.length || total<=0)return result;
        var rows=keys.map(function(k){var exact=total*(sum?Math.max(0,weights[k]||0)/sum:1/keys.length);result[k]=Math.floor(exact);return {id:k,rest:exact-result[k]};});
        var left=total-Object.values(result).reduce(function(a,b){return a+b;},0);
        rows.sort(function(a,b){return b.rest-a.rest || ((tieOrder||[]).indexOf(a.id)-(tieOrder||[]).indexOf(b.id)) || a.id.localeCompare(b.id);});
        for(var i=0;i<left;i++)result[rows[i%rows.length].id]++;
        return result;
    }
    function allocate(votes,pool,party,tieOrder) {
        var total=Object.values(votes).reduce(function(a,b){return a+b;},0),shares={},eligible={},ids=Object.keys(votes);
        ids.forEach(function(id){shares[id]=total?votes[id]/total:0;});
        var rank=ids.slice().sort(function(a,b){return shares[b]-shares[a]||((tieOrder||[]).indexOf(a)-(tieOrder||[]).indexOf(b))||a.localeCompare(b);});
        if(!rank.length || !pool.delegates)return {delegates:{},shares:shares,threshold:pool.threshold||0,qualified:[],method:pool.method};
        if(pool.method==='winner-take-all'||(pool.majority && shares[rank[0]]>pool.majority)) {
            var sweep={};sweep[rank[0]]=pool.delegates;
            return {delegates:sweep,shares:shares,threshold:pool.threshold||0,qualified:[rank[0]],method:'winner-take-all'};
        }
        var threshold=pool.threshold||0;
        ids.forEach(function(id){if(shares[id]>=threshold && votes[id]>0)eligible[id]=votes[id];});
        var fallback=false;
        if(!Object.keys(eligible).length) {
            fallback=true;threshold=party==='D'?shares[rank[0]]/2:0;
            ids.forEach(function(id){if(shares[id]>=threshold)eligible[id]=votes[id];});
        }
        // Republican pre-March-15 thresholds cannot create a sole-qualifier
        // sweep absent a valid majority: include the runner-up in this model.
        if(party==='R' && Object.keys(eligible).length===1 && shares[rank[0]]<=0.50 && rank.length>1)eligible[rank[1]]=votes[rank[1]];
        return {delegates:apportion(eligible,pool.delegates,tieOrder),shares:shares,threshold:threshold,qualified:Object.keys(eligible),fallback:fallback,method:'proportional'};
    }
    return {version:'2028-primary-1',asOf:'2026-10-13',startDate:'2027-09-06',electionDay:'2028-11-07',jurisdictions:jurisdictions,sources:sources,
        dEligibility:dEligibility,rEligibility:rEligibility,earlyDaysMap:earlyDaysMap,
        conventions:{D:'2028-08-07',R:'2028-07-17',L:'2028-05-27',G:'2028-07-13',PSL:'2028-06-17',I:'2028-06-01'},
        conventionStatus:{D:'Announced 2028 dates',R:'Projected',L:'Projected',G:'Projected',PSL:'Modeled party conference',I:'Ballot-access checkpoint'},
        makeContests:makeContests,allocate:allocate,apportion:apportion,datePlus:datePlus};
}());
