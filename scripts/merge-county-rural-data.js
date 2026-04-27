#!/usr/bin/env node
'use strict';

var fs = require('fs');
var path = require('path');

function parseCsvLine(line) {
    var out = [];
    var cur = '';
    var inQuotes = false;
    for (var i = 0; i < line.length; i++) {
        var ch = line[i];
        if (ch === '"') {
            if (inQuotes && line[i + 1] === '"') {
                cur += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (ch === ',' && !inQuotes) {
            out.push(cur);
            cur = '';
        } else {
            cur += ch;
        }
    }
    out.push(cur);
    return out;
}

function toTier(ruralPct) {
    if (ruralPct < 5) return 'Highly Urban';
    if (ruralPct < 25) return 'Urban/Dense Suburban';
    if (ruralPct < 55) return 'Suburban/Mixed';
    if (ruralPct < 85) return 'Rural/Small Town';
    return 'Deep Rural';
}

function main() {
    var repoRoot = path.resolve(__dirname, '..');
    var csvPath = process.argv[2] ? path.resolve(process.argv[2]) : path.join(repoRoot, 'counties_rural%.csv');
    var countyJsonPath = process.argv[3] ? path.resolve(process.argv[3]) : path.join(repoRoot, 'counties', 'county_data.json');
    var shouldWrite = process.argv.indexOf('--write') !== -1;

    var countyData = JSON.parse(fs.readFileSync(countyJsonPath, 'utf8'));
    var csvRaw = fs.readFileSync(csvPath, 'utf8').replace(/\r/g, '');
    var lines = csvRaw.split('\n').filter(function(line) { return line.trim().length > 0; });

    if (lines.length < 2) {
        throw new Error('CSV is empty or missing data rows.');
    }

    var headers = parseCsvLine(lines[0]);
    var fipsIdx = headers.indexOf('FIP (NOT STANDARIZED)');
    var ruralIdx = headers.indexOf('% Rural');
    if (fipsIdx === -1 || ruralIdx === -1) {
        throw new Error('CSV headers must include "FIP (NOT STANDARIZED)" and "% Rural".');
    }

    var updated = 0;
    var unmatched = 0;

    for (var li = 1; li < lines.length; li++) {
        var row = parseCsvLine(lines[li]);
        var rawFips = (row[fipsIdx] || '').trim();
        var rawRural = (row[ruralIdx] || '').trim().replace('%', '');
        if (!rawFips || !rawRural) continue;

        var fips = rawFips.padStart(5, '0');
        var ruralPct = parseFloat(rawRural);
        if (!isFinite(ruralPct)) continue;

        var county = countyData[fips];
        if (!county) {
            unmatched++;
            continue;
        }

        if (!county.ig || typeof county.ig !== 'object') county.ig = {};
        county.ig.rural = ruralPct;
        county.t = toTier(ruralPct);
        updated++;
    }

    var mergedJson = JSON.stringify(countyData);
    if (shouldWrite) {
        fs.writeFileSync(countyJsonPath, mergedJson + '\n', 'utf8');
    } else {
        process.stdout.write(mergedJson + '\n');
    }

    console.error('Updated counties: ' + updated + ', Unmatched FIPS: ' + unmatched);
}

main();
