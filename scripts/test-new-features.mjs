import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const context = vm.createContext({
  console, Map, Set, Date, Math, JSON, Number, String, Object, Array, Promise, performance, assert, URL,
  setTimeout: () => 0, clearTimeout: () => {}, setInterval: () => 0, clearInterval: () => {}
});
context.window = context;
context.window.addEventListener = () => {};
context.document = {
  addEventListener() {},
  getElementById() { return { value: '', innerHTML: '', style: {}, classList: { add() {}, remove() {} } }; },
  querySelector() { return null; },
  querySelectorAll() { return []; }
};
context.localStorage = {
  _data: {},
  getItem(k) { return this._data[k] || null; },
  setItem(k, v) { this._data[k] = String(v); },
  removeItem(k) { delete this._data[k]; }
};

const mocks = [
  'Electorate', 'Counties', 'Persuasion', 'Campaign', 'Polling', 'PolicyManager',
  'Debates', 'Scandals', 'OppoResearchUI', 'GroundOps', 'MichiganModel', 'app',
  'PrimaryUI', 'SimulationState', 'PrimaryIntegration', 'shiftGroupSupport', 'addCampaignGroupMomentum'
];
for (const m of mocks) {
  context[m] = {};
}
context.gameData = { states: {}, counties: {}, currentWeek: 1 };

context.XMLHttpRequest = class {
  open(method, url) { this.url = url; }
  send() {
    this.readyState = 4;
    try {
      this.responseText = fs.readFileSync(path.join(root, this.url), 'utf8');
      this.status = 200;
    } catch {
      this.status = 404;
    }
    this.onreadystatechange?.();
  }
};

const scriptOrder = [
  'js/config.js',
  'js/utils.js',
  'js/candidates.js',
  'js/factions.js',
  'js/issues.js',
  'js/issueCatalog.js',
  'js/countyEconomicData.js',
  'js/countyFactionsData.js',
  'js/primaryRules.js',
  'js/endorsements.js',
  'js/endorsers.js',
  'js/campaignAdsEngine.js',
  'js/newspaper.js',
  'js/primaryCampaign.js',
  'js/primaryNative.js'
];

for (const rel of scriptOrder) {
  const full = path.join(root, rel);
  const src = fs.readFileSync(full, 'utf8');
  vm.runInContext(src, context, { filename: rel });
  console.log(`Loaded ${rel}`);
}

vm.runInContext(`
console.log('--- TEST 1: Economic and Factions Data ---');
assert.ok(typeof COUNTY_ECONOMIC_DATA === 'object', 'COUNTY_ECONOMIC_DATA exists');
assert.ok(Object.keys(COUNTY_ECONOMIC_DATA).length > 3000, 'Over 3000 counties have economic data');
assert.ok(typeof COUNTY_FACTIONS_DATA === 'object', 'COUNTY_FACTIONS_DATA exists');
assert.ok(Object.keys(COUNTY_FACTIONS_DATA).length > 2000, 'Empirical county faction data loaded');
const sampleFips = Object.keys(COUNTY_FACTIONS_DATA)[0];
assert.ok(typeof COUNTY_FACTIONS_DATA[sampleFips].progShare === 'number', 'Has progShare');
assert.ok(typeof COUNTY_FACTIONS_DATA[sampleFips].magaShare === 'number', 'Has magaShare');
console.log('PASS: Economic & Faction datasets loaded with', Object.keys(COUNTY_ECONOMIC_DATA).length, 'counties');

console.log('--- TEST 2: Candidate Base Affinity ---');
const vance = CANDIDATES.find(c => c.id === 'vance');
const cheney = CANDIDATES.find(c => c.id === 'cheney');
const harris = CANDIDATES.find(c => c.id === 'harris');
const emanuel = CANDIDATES.find(c => c.id === 'emanuel');
assert.ok(vance && cheney && harris && emanuel, 'Candidates found in catalog');
assert.ok(vance.primaryBaseAffinity > cheney.primaryBaseAffinity, 'Vance has higher affinity than Cheney');
assert.ok(harris.primaryBaseAffinity > emanuel.primaryBaseAffinity, 'Harris has higher affinity than Emanuel');
console.log('PASS: Candidate base affinity margins verified (Vance:', vance.primaryBaseAffinity, 'Cheney:', cheney.primaryBaseAffinity, ')');

console.log('--- TEST 3: Primary Rules & Early Voting Days ---');
assert.ok(PrimaryRules.rEligibility['IA'] === 'caucus', 'Iowa R is caucus');
assert.ok(PrimaryRules.rEligibility['NH'] === 'semi-closed', 'NH R is semi-closed');
assert.ok(PrimaryRules.earlyDaysMap['NH'] === 0, 'NH has 0 early voting days (excuse only / election day)');
assert.ok(PrimaryRules.earlyDaysMap['NC'] >= 14, 'NC has early voting');
console.log('PASS: Primary eligibility and early voting maps verified');

console.log('--- TEST 4: Ad Presets in campaignAdsEngine.js ---');
assert.ok(AdPresets && typeof AdPresets.getPresets === 'function', 'AdPresets available');
const presets = AdPresets.getPresets();
assert.ok(presets.length >= 3, 'Default presets present');
AdPresets.savePreset({ name: 'Test Surge Ad', category: 'positive', focus: 'turnout', channel: 'tv' });
const updated = AdPresets.getPresets();
assert.ok(updated.some(p => p.name === 'Test Surge Ad'), 'Custom preset saved successfully');
console.log('PASS: Ad Presets engine functional');

console.log('--- TEST 5: Newspaper Engine ---');
assert.ok(Newspaper && typeof Newspaper.generateContent === 'function', 'Newspaper engine loaded');
const newsData = Newspaper.generateContent();
assert.ok(newsData.lead && newsData.lead.headline, 'Lead article generated');
assert.ok(Array.isArray(newsData.blurbs), 'Side blurbs generated');
assert.ok(Newspaper.OUTLETS.length === 4, '4 reporting outlets configured');
console.log('PASS: Newspaper generation functional with lead article,', newsData.blurbs.length, 'blurbs across', Newspaper.OUTLETS.length, 'reporting profiles');

console.log('--- TEST 6: Endorsers Active Candidate Filtering & Clyburn ---');
assert.ok(Endorsers && typeof Endorsers.isActivelyRunning === 'function', 'Endorsers.isActivelyRunning exists');
assert.ok(Endorsers.db.states['SC'] && Endorsers.db.states['SC'].some(e => e.id === 'sc_clyburn'), 'Clyburn in SC endorsers');
assert.ok(ENDORSERS && ENDORSERS.some(e => e.id === 'rep_clyburn'), 'Clyburn in ENDORSERS catalog');
console.log('PASS: Endorsement filtering & Jim Clyburn endorsement verified');

console.log('--- TEST 7: Primary Campaign & State Delegate Projections ---');
const contests = PrimaryRules.makeContests(['D', 'R']);
assert.ok(contests.length > 50, 'Contests generated for D and R');
const nhContest = contests.find(c => c.state === 'NH' && c.party === 'D');
assert.ok(nhContest, 'NH D contest found');
const nhProjection = PrimaryNative.projectStateDelegates(nhContest, { harris: 45, newsom: 35, whitmer: 20 });
assert.ok(typeof nhProjection === 'object', 'projectStateDelegates returns projection object');
assert.ok(Object.keys(nhProjection).length > 0, 'NH delegates allocated across candidates');
console.log('PASS: Primary Contests & State Delegate Projections functional:', nhProjection);

console.log('ALL NEW FEATURES PASS INTEGRITY CHECKS!');
`, context, { filename: 'test-new-features-eval' });
