import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const root = new URL('../', import.meta.url);
const candidates = {
    harris: {id:'harris',name:'Kamala Harris',party:'D',homeState:'CA'},
    vance: {id:'vance',name:'JD Vance',party:'R',homeState:'OH'},
    oliver: {id:'oliver',name:'Chase Oliver',party:'L'}
};
const counties = {
    '06037': {fips:'06037',s:'CA',p:1000,v:{D:70,R:30},ig:{urban:0.6}},
    '39049': {fips:'39049',s:'OH',p:900,v:{D:35,R:65},ig:{rural:0.4}}
};
const context = vm.createContext({
    console, Math, Object, Number, String, Array,
    gameData: {selectedParty:'D',candidate:candidates.harris,vp:null,demTicket:{pres:candidates.harris,vp:null},repTicket:{pres:candidates.vance,vp:null},thirdTickets:{L:{pres:candidates.oliver,vp:null}}},
    Counties: {countyData:counties,normalizeFips:f=>String(f).padStart(5,'0')},
    Utils: {getActiveCandidates:()=>Object.values(candidates).map(cand=>({party:cand.party,cand})),addLog(){},showToast(){}},
    Electorate: {share:()=>0.5},
    IssueModel: {candidate:id=>candidates[id],index:()=>3},
    STATES: {CA:{lean:-20},OH:{lean:8}}
});
vm.runInContext(fs.readFileSync(new URL('js/favorability.js',root),'utf8'),context);
vm.runInContext('Favorability.init()',context);
const F = vm.runInContext('Favorability',context);
for (const id of Object.keys(candidates)) {
    const opinion = F.get(id,counties['06037']);
    assert.ok(Math.abs(opinion.favorable+opinion.unfavorable+opinion.noOpinion-100)<1e-9);
}
assert.ok(F.get('oliver',counties['06037']).noOpinion>F.get('harris',counties['06037']).noOpinion);
assert.ok(F.get('harris',counties['06037']).net>F.get('harris',counties['39049']).net);
const initialCA=F.get('vance',counties['06037']).net,initialOH=F.get('vance',counties['39049']).net;
F.ad({sponsorId:'harris',targetId:'vance',type:'attack',countyIds:['06037'],exposure:1});
assert.ok(F.get('vance',counties['06037']).net<initialCA);
assert.ok(F.movement('vance',counties['06037'])<0);
assert.equal(F.get('vance',counties['39049']).net,initialOH);
const beforeBio=F.get('harris',counties['39049']);
F.ad({sponsorId:'harris',type:'bio',countyIds:['39049'],exposure:1});
const afterBio=F.get('harris',counties['39049']);
assert.ok(afterBio.net>beforeBio.net && afterBio.noOpinion<beforeBio.noOpinion);
const national=F.area('harris');
assert.ok(Math.abs(national.favorable+national.unfavorable+national.noOpinion-100)<1e-9);

vm.runInContext(fs.readFileSync(new URL('js/endorsements.js',root),'utf8'),context);
const E=vm.runInContext('Endorsers',context);
context.gameData.energy=8;
context.Campaign={adjustFavorability(){},updateHUD(){}};
E.init();
assert.equal(E.rallyCredits.n_obama,0);
assert.ok(E.relationships.n_obama<E.db.national.find(e=>e.id==='n_obama').threshold);
E.meetEndorser('n_obama');
assert.equal(E.rallyCredits.n_obama,0);
E.meetEndorser('n_obama');
assert.ok(E.rallyCredits.n_obama>=1 && E.rallyCredits.n_obama<=2);
assert.equal(E.getStars(E.db.national.find(e=>e.id==='n_obama')),5);
assert.equal(E.getStars(E.db.national.find(e=>e.id==='n_biden')),5);
console.log('Favorability and endorsement checks passed.');
