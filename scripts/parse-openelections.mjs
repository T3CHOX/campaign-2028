import fs from 'node:fs';
import readline from 'node:readline';
import path from 'node:path';

function cleanCsvVal(v) {
  if (!v) return '';
  v = v.trim();
  if (v.startsWith('"') && v.endsWith('"')) {
    v = v.slice(1, -1);
  }
  return v.trim();
}

function normalizeName(name) {
  return String(name || '')
    .toLowerCase()
    .replace(/\bcounty\b|\bparish\b|\bborough\b|\bcensus area\b|\bcity and borough\b|\bmunicipality\b/g, '')
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

async function processFactions() {
  const countyMap = new Map(); // key: state + '|' + normName -> fips
  const fipsToCounty = {};

  const countypresPath = 'counties/countypres_2000-2024.csv';
  if (fs.existsSync(countypresPath)) {
    const rl = readline.createInterface({ input: fs.createReadStream(countypresPath), crlfDelay: Infinity });
    let count = 0;
    for await (const line of rl) {
      count++;
      if (count === 1) continue;
      const parts = line.split(',');
      if (parts.length < 5) continue;
      const countyName = cleanCsvVal(parts[1]);
      const statePo = cleanCsvVal(parts[3]);
      let fips = cleanCsvVal(parts[4]);
      if (fips && fips.length < 5) fips = fips.padStart(5, '0');
      if (fips && statePo && countyName) {
        const key = statePo.toUpperCase() + '|' + normalizeName(countyName);
        if (!countyMap.has(key)) {
          countyMap.set(key, fips);
          fipsToCounty[fips] = { s: statePo, n: countyName };
        }
      }
    }
  }
  console.log(`Loaded ${countyMap.size} counties into crosswalk.`);

  const countyFactions = {};

  function initCounty(fips, state) {
    if (!countyFactions[fips]) {
      countyFactions[fips] = {
        fips: fips,
        s: state,
        demVotes: 0,
        demProgressiveVotes: 0,
        demEstablishmentVotes: 0,
        repVotes: 0,
        repMagaVotes: 0,
        repReligiousVotes: 0,
        repModerateVotes: 0
      };
    }
    return countyFactions[fips];
  }

  // Parse Dem 2016 & 2020
  async function parseDem(filePath, weight) {
    if (!fs.existsSync(filePath)) return;
    const rl = readline.createInterface({ input: fs.createReadStream(filePath), crlfDelay: Infinity });
    let count = 0;
    for await (const line of rl) {
      count++;
      if (count === 1) continue;
      const parts = line.split(',');
      if (parts.length < 7) continue;
      const state = cleanCsvVal(parts[2]).toUpperCase();
      const countyName = cleanCsvVal(parts[3]);
      const cand = cleanCsvVal(parts[5]).toLowerCase();
      const votes = parseInt(cleanCsvVal(parts[6]), 10) || 0;
      if (votes <= 0) continue;

      const key = state + '|' + normalizeName(countyName);
      const fips = countyMap.get(key);
      if (!fips) continue;

      const c = initCounty(fips, state);
      c.demVotes += votes * weight;

      if (cand.includes('sanders') || cand.includes('warren')) {
        c.demProgressiveVotes += votes * weight;
      } else if (cand.includes('clinton') || cand.includes('biden') || cand.includes('bloomberg') || cand.includes('klobuchar') || cand.includes('buttigieg')) {
        c.demEstablishmentVotes += votes * weight;
      }
    }
  }

  // Parse Rep 2016 & 2024
  async function parseRep(filePath) {
    if (!fs.existsSync(filePath)) return;
    const rl = readline.createInterface({ input: fs.createReadStream(filePath), crlfDelay: Infinity });
    let count = 0;
    for await (const line of rl) {
      count++;
      if (count === 1) continue;
      const parts = line.split(',');
      if (parts.length < 7) continue;
      const state = cleanCsvVal(parts[2]).toUpperCase();
      const countyName = cleanCsvVal(parts[3]);
      const cand = cleanCsvVal(parts[5]).toLowerCase();
      const votes = parseInt(cleanCsvVal(parts[6]), 10) || 0;
      if (votes <= 0) continue;

      const key = state + '|' + normalizeName(countyName);
      const fips = countyMap.get(key);
      if (!fips) continue;

      const c = initCounty(fips, state);
      c.repVotes += votes;

      if (cand.includes('trump')) {
        c.repMagaVotes += votes;
      } else if (cand.includes('cruz') || cand.includes('carson')) {
        c.repReligiousVotes += votes;
      } else if (cand.includes('kasich') || cand.includes('rubio') || cand.includes('bush') || cand.includes('haley') || cand.includes('christie')) {
        c.repModerateVotes += votes;
      }
    }
  }

  await parseDem('C:/Users/quavo/openelections_parsed_output/Dem_2016_Presidential_Primary.csv', 1.0);
  await parseDem('C:/Users/quavo/openelections_parsed_output/Dem_2020_Presidential_Primary.csv', 1.0);
  await parseRep('C:/Users/quavo/openelections_parsed_output/Rep_2016_Presidential_Primary.csv');
  await parseRep('C:/Users/quavo/openelections_parsed_output/Rep_2024_Presidential_Primary.csv');

  console.log(`Matched faction data for ${Object.keys(countyFactions).length} counties.`);

  const compiled = {};
  for (const fips in countyFactions) {
    const d = countyFactions[fips];
    const demTotal = d.demProgressiveVotes + d.demEstablishmentVotes;
    const progShare = demTotal > 0 ? +(d.demProgressiveVotes / demTotal).toFixed(3) : 0.45;
    const estabShare = demTotal > 0 ? +(d.demEstablishmentVotes / demTotal).toFixed(3) : 0.55;

    const repTotal = d.repMagaVotes + d.repReligiousVotes + d.repModerateVotes;
    const magaShare = repTotal > 0 ? +(d.repMagaVotes / repTotal).toFixed(3) : 0.50;
    const relShare = repTotal > 0 ? +(d.repReligiousVotes / repTotal).toFixed(3) : 0.25;
    const modShare = repTotal > 0 ? +(d.repModerateVotes / repTotal).toFixed(3) : 0.25;

    compiled[fips] = {
      progShare,
      estabShare,
      magaShare,
      relShare,
      modShare,
      demTurnoutBasis: Math.round(d.demVotes / 2),
      repTurnoutBasis: Math.round(d.repVotes)
    };
  }

  const outPath = 'js/countyFactionsData.js';
  const jsContent = `/* Auto-compiled empirical county faction affinities from OpenElections primary results */\nconst COUNTY_FACTIONS_DATA = ${JSON.stringify(compiled, null, 2)};\n`;
  fs.writeFileSync(outPath, jsContent, 'utf8');
  console.log(`Successfully wrote ${outPath} (${(Buffer.byteLength(jsContent)/1024).toFixed(1)} KB)`);
}

processFactions();
