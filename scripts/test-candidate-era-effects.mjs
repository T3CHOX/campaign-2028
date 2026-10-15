import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const context = vm.createContext({
    console,
    CANDIDATE_POSITIONS: {
        harris: { economy: 2 },
        trump: { economy: 5 },
        vance: { economy: 5 },
        kemp: { economy: 5 },
        cheney: { economy: 5 }
    },
    CORE_ISSUES: [{ id: 'economy', legacyId: 'economy' }],
    INTEREST_GROUPS: {
        noncollege: {},
        suburban: {},
        college: {},
        centrists: {},
        whitecollar: {},
        maga: {}
    },
    IssueModel: {
        agreement: () => 1
    }
});
vm.runInContext(fs.readFileSync('js/candidateEraEffects.js', 'utf8'), context);

function apply(id, group, party = 'R') {
    const logs = [0, 0];
    const rates = [0, 0];
    const candidates = [{ id: party === 'D' ? id : 'harris', party: 'D' }, { id: party === 'D' ? 'trump' : id, party: 'R' }];
    context.CandidateEraEffects.apply(logs, rates, candidates, group);
    return { logs, rates };
}

const trump = apply('trump', 'noncollege');
const movement = apply('vance', 'noncollege');
const standard = apply('kemp', 'noncollege');
const repudiating = apply('cheney', 'suburban');
const harris = apply('harris', 'black', 'D');
const genericDem = apply('newsom', 'black', 'D');

const trumpDelta = trump.logs[1] - trump.logs[0];
const movementDelta = movement.logs[1] - movement.logs[0];
const standardDelta = standard.logs[1] - standard.logs[0];
assert.ok(Math.abs(trumpDelta) < 1e-12, 'Trump should be the zero-delta baseline');
assert.ok(movementDelta < 0, 'Movement-aligned successor should lose support relative to the Trump baseline');
assert.ok(standardDelta < movementDelta, 'Standard Republican should lose more support than a movement-aligned successor');
assert.ok(trump.rates[1] > movement.rates[1], 'Trump should retain more Republican turnout than a movement successor');
assert.ok(movement.rates[1] > standard.rates[1], 'Movement successor should retain more Republican turnout than a standard Republican');
assert.ok(trump.rates[0] > movement.rates[0], 'Trump baseline should retain more opposition turnout activation than a successor');
assert.ok(movement.rates[0] < standard.rates[0], 'Movement successor should lose more opposition turnout activation than a standard Republican');
assert.ok(repudiating.logs[1] - repudiating.logs[0] > standardDelta, 'Repudiation should add crossover appeal beyond ordinary baseline loss');
assert.ok(Math.abs(harris.logs[0]) < 1e-12 && Math.abs(harris.logs[1]) < 1e-12, 'Harris should be the zero-delta Democratic baseline');
assert.ok(genericDem.logs[0] < harris.logs[0], 'A non-reference Democratic successor should lose part of the Harris-era residual');
assert.ok(genericDem.rates[0] < harris.rates[0], 'A non-reference Democratic successor should retain less reference-party turnout');
Object.values(context.CandidateEraEffects.designerConfig.groupEffects).forEach((config) => {
    assert.equal(config.weights.reduce((sum, value) => sum + value, 0), 1);
});

console.log('Candidate-era effect invariants pass.');
