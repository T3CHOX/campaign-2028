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

// Historical Candidate Profiles: Home States & Official Withdrawal Dates (YYYYMMDD)
const CANDIDATE_METADATA = {
  // Democratic Candidates
  'sanders': { homeStates: ['VT'], dropDate: 20200408, faction: 'progressive' },
  'warren': { homeStates: ['MA'], dropDate: 20200305, faction: 'progressive' },
  'clinton': { homeStates: ['NY', 'AR'], dropDate: null, faction: 'establishment' },
  'biden': { homeStates: ['DE', 'PA'], dropDate: null, faction: 'establishment' },
  'bloomberg': { homeStates: ['NY'], dropDate: 20200304, faction: 'establishment' },
  'klobuchar': { homeStates: ['MN'], dropDate: 20200302, faction: 'establishment' },
  'buttigieg': { homeStates: ['IN'], dropDate: 20200301, faction: 'establishment' },
  'steyer': { homeStates: ['CA'], dropDate: 20200229, faction: 'progressive' },
  'yang': { homeStates: ['NY'], dropDate: 20200211, faction: 'progressive' },
  'omalley': { homeStates: ['MD'], dropDate: 20160201, faction: 'establishment' },

  // Republican Candidates
  'trump': { homeStates: ['NY', 'FL'], dropDate: null, faction: 'maga' },
  'cruz': { homeStates: ['TX'], dropDate: 20160503, faction: 'religious' },
  'carson': { homeStates: ['MI', 'MD'], dropDate: 20160304, faction: 'religious' },
  'kasich': { homeStates: ['OH'], dropDate: 20160504, faction: 'moderate' },
  'rubio': { homeStates: ['FL'], dropDate: 20160315, faction: 'moderate' },
  'bush': { homeStates: ['FL'], dropDate: 20160220, faction: 'moderate' },
  'haley': { homeStates: ['SC'], dropDate: 20240306, faction: 'moderate' },
  'desantis': { homeStates: ['FL'], dropDate: 20240121, faction: 'maga' },
  'ramaswamy': { homeStates: ['OH'], dropDate: 20240115, faction: 'maga' },
  'christie': { homeStates: ['NJ'], dropDate: 20240110, faction: 'moderate' },
  'fiorina': { homeStates: ['CA'], dropDate: 20160210, faction: 'moderate' },
  'paul': { homeStates: ['KY'], dropDate: 20160203, faction: 'religious' }
};

// Race Clinch Dates: after these dates, the primary was an uncontested coronation
const CLINCH_DATES = {
  dem_2016: 20160607,
  dem_2020: 20200408, // Sanders suspended
  dem_2024: 20240312,
  rep_2016: 20160504, // Kasich & Cruz suspended after Indiana
  rep_2020: 20200317,
  rep_2024: 20240306  // Haley suspended morning after Super Tuesday
};

async function processRefinedFactions() {
  const countyMap = new Map();
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
        demProgressiveVotes: 0,
        demEstablishmentVotes: 0,
        demCompetitiveTurnout: 0,
        demTotalTurnout: 0,
        demContestsCount: 0,
        repMagaVotes: 0,
        repReligiousVotes: 0,
        repModerateVotes: 0,
        repCompetitiveTurnout: 0,
        repTotalTurnout: 0,
        repContestsCount: 0
      };
    }
    return countyFactions[fips];
  }

  function getCandidateInfo(candName) {
    const lower = candName.toLowerCase();
    for (const [key, meta] of Object.entries(CANDIDATE_METADATA)) {
      if (lower.includes(key)) {
        return { key, ...meta };
      }
    }
    return null;
  }

  // Parse Dem Files (2016, 2020, 2024)
  async function parseDemFile(filePath, yearKey) {
    if (!fs.existsSync(filePath)) return;
    const clinchDate = CLINCH_DATES[yearKey] || 99999999;
    const rl = readline.createInterface({ input: fs.createReadStream(filePath), crlfDelay: Infinity });
    let count = 0;
    for await (const line of rl) {
      count++;
      if (count === 1) continue;
      const parts = line.split(',');
      if (parts.length < 7) continue;
      const dateVal = parseInt(cleanCsvVal(parts[1]), 10) || 0;
      const state = cleanCsvVal(parts[2]).toUpperCase();
      const countyName = cleanCsvVal(parts[3]);
      const candRaw = cleanCsvVal(parts[5]);
      const votes = parseInt(cleanCsvVal(parts[6]), 10) || 0;
      if (votes <= 0) continue;

      const key = state + '|' + normalizeName(countyName);
      const fips = countyMap.get(key);
      if (!fips) continue;

      const c = initCounty(fips, state);
      const isCompetitive = (dateVal > 0 && dateVal <= clinchDate);
      const contestWeight = isCompetitive ? 1.0 : 0.25;

      c.demTotalTurnout += votes;
      if (isCompetitive) c.demCompetitiveTurnout += votes;

      const candInfo = getCandidateInfo(candRaw);
      if (!candInfo) continue;

      // Check Home State Effect
      let voteWeight = votes * contestWeight;
      if (candInfo.homeStates && candInfo.homeStates.includes(state)) {
        // Deflate home-state favorite-son surge (e.g. Sanders in VT, Clinton in NY, Klobuchar in MN)
        voteWeight /= 1.55;
      }

      // Check Dropout Status
      if (candInfo.dropDate && dateVal > candInfo.dropDate) {
        // Candidate had suspended before this primary: residual vote only
        // Re-inflate to estimate full latent faction strength in competitive conditions
        voteWeight *= 1.35;
      }

      if (candInfo.faction === 'progressive') {
        c.demProgressiveVotes += voteWeight;
      } else if (candInfo.faction === 'establishment') {
        c.demEstablishmentVotes += voteWeight;
      }
    }
  }

  // Parse Rep Files (2016, 2020, 2024)
  async function parseRepFile(filePath, yearKey) {
    if (!fs.existsSync(filePath)) return;
    const clinchDate = CLINCH_DATES[yearKey] || 99999999;
    const rl = readline.createInterface({ input: fs.createReadStream(filePath), crlfDelay: Infinity });
    let count = 0;
    for await (const line of rl) {
      count++;
      if (count === 1) continue;
      const parts = line.split(',');
      if (parts.length < 7) continue;
      const dateVal = parseInt(cleanCsvVal(parts[1]), 10) || 0;
      const state = cleanCsvVal(parts[2]).toUpperCase();
      const countyName = cleanCsvVal(parts[3]);
      const candRaw = cleanCsvVal(parts[5]);
      const votes = parseInt(cleanCsvVal(parts[6]), 10) || 0;
      if (votes <= 0) continue;

      const key = state + '|' + normalizeName(countyName);
      const fips = countyMap.get(key);
      if (!fips) continue;

      const c = initCounty(fips, state);
      const isCompetitive = (dateVal > 0 && dateVal <= clinchDate);
      const contestWeight = isCompetitive ? 1.0 : 0.25;

      c.repTotalTurnout += votes;
      if (isCompetitive) c.repCompetitiveTurnout += votes;

      const candInfo = getCandidateInfo(candRaw);
      if (!candInfo) continue;

      let voteWeight = votes * contestWeight;
      if (candInfo.homeStates && candInfo.homeStates.includes(state)) {
        // Deflate home-state favorite son surge (e.g. Kasich in OH, Cruz in TX, Rubio in FL, Haley in SC)
        voteWeight /= 1.50;
      }

      if (candInfo.dropDate && dateVal > candInfo.dropDate) {
        // Dropped-out candidate on ballot
        voteWeight *= 1.40;
      }

      if (candInfo.faction === 'maga') {
        c.repMagaVotes += voteWeight;
      } else if (candInfo.faction === 'religious') {
        c.repReligiousVotes += voteWeight;
      } else if (candInfo.faction === 'moderate') {
        c.repModerateVotes += voteWeight;
      }
    }
  }

  console.log('Parsing Dem files...');
  await parseDemFile('C:/Users/quavo/openelections_parsed_output/Dem_2016_Presidential_Primary.csv', 'dem_2016');
  await parseDemFile('C:/Users/quavo/openelections_parsed_output/Dem_2020_Presidential_Primary.csv', 'dem_2020');
  await parseDemFile('C:/Users/quavo/openelections_parsed_output/Dem_2024_Presidential_Primary.csv', 'dem_2024');

  console.log('Parsing Rep files...');
  await parseRepFile('C:/Users/quavo/openelections_parsed_output/Rep_2016_Presidential_Primary.csv', 'rep_2016');
  await parseRepFile('C:/Users/quavo/openelections_parsed_output/Rep_2020_Presidential_Primary.csv', 'rep_2020');
  await parseRepFile('C:/Users/quavo/openelections_parsed_output/Rep_2024_Presidential_Primary.csv', 'rep_2024');

  console.log(`Matched faction data for ${Object.keys(countyFactions).length} counties.`);

  const compiled = {};
  for (const fips in countyFactions) {
    const d = countyFactions[fips];
    const demTotal = d.demProgressiveVotes + d.demEstablishmentVotes;
    let progShare = demTotal > 0 ? +(d.demProgressiveVotes / demTotal).toFixed(3) : 0.42;
    // Bound shares realistically: no county is 0% or 100% monolithic
    progShare = Math.max(0.12, Math.min(0.85, progShare));
    const estabShare = +(1 - progShare).toFixed(3);

    const repTotal = d.repMagaVotes + d.repReligiousVotes + d.repModerateVotes;
    let magaShare = repTotal > 0 ? +(d.repMagaVotes / repTotal).toFixed(3) : 0.52;
    let relShare = repTotal > 0 ? +(d.repReligiousVotes / repTotal).toFixed(3) : 0.24;
    let modShare = repTotal > 0 ? +(d.repModerateVotes / repTotal).toFixed(3) : 0.24;

    magaShare = Math.max(0.20, Math.min(0.82, magaShare));
    relShare = Math.max(0.08, Math.min(0.55, relShare));
    modShare = Math.max(0.08, Math.min(0.55, modShare));
    const rSum = magaShare + relShare + modShare;
    magaShare = +(magaShare / rSum).toFixed(3);
    relShare = +(relShare / rSum).toFixed(3);
    modShare = +(1 - magaShare - relShare).toFixed(3);

    // Turnout basis uses competitive primary turnout if available
    const demBasis = d.demCompetitiveTurnout > 0 ? Math.round(d.demCompetitiveTurnout / 2) : Math.round(d.demTotalTurnout / 3);
    const repBasis = d.repCompetitiveTurnout > 0 ? Math.round(d.repCompetitiveTurnout / 2) : Math.round(d.repTotalTurnout / 3);

    compiled[fips] = {
      progShare,
      estabShare,
      magaShare,
      relShare,
      modShare,
      demTurnoutBasis: Math.max(150, demBasis),
      repTurnoutBasis: Math.max(150, repBasis)
    };
  }

  const outPath = 'js/countyFactionsData.js';
  const jsContent = `/* Auto-compiled empirical county faction affinities from OpenElections primary results\n   Refined with candidate home-state deflation and dropout timeline adjustments */\nconst COUNTY_FACTIONS_DATA = ${JSON.stringify(compiled, null, 2)};\n`;
  fs.writeFileSync(outPath, jsContent, 'utf8');
  console.log(`Successfully wrote ${outPath} (${(Buffer.byteLength(jsContent)/1024).toFixed(1)} KB)`);
}

processRefinedFactions();
