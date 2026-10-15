import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const payload = JSON.parse(fs.readFileSync(path.join(root, 'counties/demographics.v2.json'), 'utf8'));
const counties = Object.values(payload.counties || {});
const schema = payload.compositionSchema;

if (payload.schemaVersion !== 2) throw new Error('Unexpected demographics schema version');
if (counties.length !== 3143) throw new Error(`Expected 3143 county-equivalent records, got ${counties.length}`);
if (!schema || schema.version !== 1 || schema.unit !== 'percent') throw new Error('Missing composition schema metadata');
if (schema.fields?.union?.universe !== 'resident population') throw new Error('Union universe is not explicit');
if (schema.fields?.factionAlignment?.measure !== 'Legacy orientation-affinity values stored once under current faction IDs; not mutually exclusive population shares.') {
  throw new Error('Faction-alignment definition is missing or changed');
}

const aliases = schema.legacyAliases;
const checks = [
  ['progressive', 'activist_left'],
  ['maga', 'america_first_conservative'],
  ['libertarian', 'unaligned_center'],
  ['centrist', 'pragmatic_moderate']
];
for (const county of counties) {
  for (const [legacy, faction] of checks) {
    if (aliases[legacy] !== faction) throw new Error(`Alias mismatch for ${legacy}`);
    if (!Number.isFinite(Number(county.ig?.[faction]))) throw new Error(`Missing faction value for ${county.fips}/${faction}`);
  }
}

console.log(`Demographic schema checks passed for ${counties.length} county-equivalent records.`);
