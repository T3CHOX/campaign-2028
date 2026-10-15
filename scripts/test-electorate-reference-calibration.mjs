import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const root = new URL('..', import.meta.url);
const read = (path) => fs.readFileSync(new URL(path, root), 'utf8');
const countyData = JSON.parse(read('counties/demographics.v2.json')).counties;

const context = {
    console,
    Math,
    JSON,
    Object,
    Array,
    Number,
    String,
    Set,
    Map,
    Date,
    isFinite,
    gameData: {
        candidate: { id: 'harris' },
        demTicket: { pres: { id: 'harris' } },
        repTicket: { pres: { id: 'trump' } },
        thirdTickets: {},
        selectedParty: 'D',
        interestGroupTurnout: {}
    },
    CORE_ISSUES: [],
    IssueModel: {
        initialize() {},
        canonical(id) { return id; },
        getIssue() { return null; },
        getPosition() { return { id: 'center' }; },
        agreement() { return 0; }
    },
    Utils: {
        getActiveCandidates() {
            return [
                { party: 'D', cand: { id: 'harris', name: 'Harris', party: 'D' } },
                { party: 'R', cand: { id: 'trump', name: 'Trump', party: 'R' } }
            ];
        }
    },
    Counties: {
        countyData,
        getPartyTurnoutMultipliers() { return { D: 1, R: 1, G: 0.7, L: 0.7, I: 0.7, PSL: 0.7 }; }
    }
};
context.globalThis = context;
vm.createContext(context);
vm.runInContext(read('js/interestGroups.js'), context, { filename: 'js/interestGroups.js' });
vm.runInContext(read('js/electorate.js'), context, { filename: 'js/electorate.js' });

const Electorate = vm.runInContext('Electorate', context);
const reference = vm.runInContext('REFERENCE_2024_RACE_VOTE_CHOICE', context);

Electorate.installGroups([], countyData);
Electorate.initialize();

const candidates = Electorate.prepare().candidates;
for (const county of Object.values(countyData)) {
    const expected = Electorate.normalize(candidates.map((candidate) => Math.max(0, county.v[candidate.party] || 0)));
    const actual = expected.map(() => 0);
    for (const cell of county.electorateCells) {
        cell.base.forEach((value, index) => { actual[index] += cell.weight * value; });
    }
    actual.forEach((value, index) => {
        assert.ok(Math.abs(value - expected[index]) < 1e-7, `County raking changed ${county.fips || county.n}'s ${candidates[index].party} baseline.`);
    });
}

// The final-results exit poll must apportion a county's reported party totals
// across its demographic cells.  This guards against the old error where every
// cell received the entire county total for each party.
for (const county of Object.values(countyData)) {
    const modeledByParty = candidates.map(() => 0);
    for (const cell of county.electorateCells) {
        cell.base.forEach((value, index) => { modeledByParty[index] += cell.weight * value; });
    }
    const reportedByParty = modeledByParty.map((value, index) => value * (index === 0 ? 0.94 : 1.06));
    const partyScale = modeledByParty.map((value, index) => value > 0 ? reportedByParty[index] / value : 0);
    const apportionedByParty = candidates.map(() => 0);
    for (const cell of county.electorateCells) {
        cell.base.forEach((value, index) => {
            apportionedByParty[index] += cell.weight * value * partyScale[index];
        });
    }
    apportionedByParty.forEach((value, index) => {
        assert.ok(Math.abs(value - reportedByParty[index]) < 1e-7,
            `Final exit-poll allocation did not preserve ${county.fips || county.n}'s reported ${candidates[index].party} total.`);
    });
}

const totals = {};
for (const group of Object.keys(reference.twoPartyDemocraticShare)) totals[group] = { D: 0, R: 0 };
for (const county of Object.values(countyData)) {
    for (const cell of county.electorateCells) {
        const parent = Electorate.rootGroup(cell.group);
        if (!totals[parent]) continue;
        const weight = Electorate.referenceCellWeight(county, cell);
        cell.base.forEach((value, index) => {
            const party = candidates[index].party;
            if (party === 'D' || party === 'R') totals[parent][party] += weight * value;
        });
    }
}
for (const [group, target] of Object.entries(reference.twoPartyDemocraticShare)) {
    const observed = totals[group].D / (totals[group].D + totals[group].R);
    assert.ok(Math.abs(observed - target) < 0.004, `${group} reference calibration drifted: expected ${target}, observed ${observed}.`);
}

console.log('Electorate reference calibration preserves county baselines and matches the 2024 national race anchors.');
