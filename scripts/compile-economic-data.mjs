import fs from 'node:fs';
import readline from 'node:readline';
import path from 'node:path';

function cleanFips(geoId) {
  if (!geoId) return '';
  const match = geoId.match(/US(\d{5})/);
  return match ? match[1] : geoId.padStart(5, '0');
}

async function compileEconomicData() {
  const econ = {}; // fips -> { medianIncome, povertyRate, agriIndex, mfgIndex }

  // 1. Median Household Income (B19013.csv)
  const b19013Path = 'data/census/2023/B19013.csv';
  if (fs.existsSync(b19013Path)) {
    const rl = readline.createInterface({ input: fs.createReadStream(b19013Path), crlfDelay: Infinity });
    let count = 0;
    for await (const line of rl) {
      count++;
      if (count === 1) continue;
      const parts = line.split(',');
      if (parts.length < 2) continue;
      const fips = cleanFips(parts[0].trim());
      const income = parseInt(parts[1].trim(), 10);
      if (fips && !isNaN(income) && income > 0) {
        if (!econ[fips]) econ[fips] = {};
        econ[fips].medianIncome = income;
      }
    }
    console.log(`Loaded median income for ${Object.keys(econ).length} counties.`);
  }

  // 2. Poverty Rate (B17001.csv)
  const b17001Path = 'data/census/2023/B17001.csv';
  if (fs.existsSync(b17001Path)) {
    const rl = readline.createInterface({ input: fs.createReadStream(b17001Path), crlfDelay: Infinity });
    let header = [];
    let idxTotal = -1, idxPoor = -1;
    let count = 0;
    for await (const line of rl) {
      count++;
      const parts = line.split(',');
      if (count === 1) {
        header = parts.map(p => p.trim());
        idxTotal = header.indexOf('B17001_E001');
        idxPoor = header.indexOf('B17001_E002');
        continue;
      }
      if (idxTotal === -1 || idxPoor === -1 || parts.length <= idxPoor) continue;
      const fips = cleanFips(parts[0].trim());
      const total = parseInt(parts[idxTotal].trim(), 10);
      const poor = parseInt(parts[idxPoor].trim(), 10);
      if (fips && !isNaN(total) && total > 0 && !isNaN(poor)) {
        if (!econ[fips]) econ[fips] = {};
        econ[fips].povertyRate = +(poor / total).toFixed(4);
      }
    }
    console.log(`Loaded poverty rates.`);
  }

  // 3. Agriculture and Manufacturing indices from county_economy.js
  const rawEconPath = 'js/county_economy.js';
  if (fs.existsSync(rawEconPath)) {
    const content = fs.readFileSync(rawEconPath, 'utf8');
    const match = content.match(/const RAW_COUNTY_ECONOMY\s*=\s*({[\s\S]*?});/);
    if (match) {
      try {
        const rawEcon = JSON.parse(match[1].replace(/NaN/g, '0'));
        // Crosswalk from NAME_STATE to FIPS using countypres_2000-2024.csv
        const crosswalk = new Map();
        const cp = 'counties/countypres_2000-2024.csv';
        if (fs.existsSync(cp)) {
          const rl = readline.createInterface({ input: fs.createReadStream(cp), crlfDelay: Infinity });
          let c = 0;
          for await (const line of rl) {
            c++;
            if (c === 1) continue;
            const parts = line.split(',');
            if (parts.length < 5) continue;
            const cName = parts[1].replace(/"/g, '').trim().toUpperCase();
            const sPo = parts[3].replace(/"/g, '').trim().toUpperCase();
            let f = parts[4].replace(/"/g, '').trim();
            if (f.length < 5) f = f.padStart(5, '0');
            crosswalk.set(cName + '_' + sPo, f);
          }
        }
        for (const key in rawEcon) {
          const fips = crosswalk.get(key);
          if (fips && econ[fips]) {
            const row = rawEcon[key];
            if (row.agri_index !== undefined && !isNaN(row.agri_index)) econ[fips].agriIndex = +row.agri_index.toFixed(4);
            if (row.mfg_index !== undefined && !isNaN(row.mfg_index)) econ[fips].mfgIndex = +row.mfg_index.toFixed(4);
          }
        }
        console.log(`Integrated agriculture & manufacturing indices.`);
      } catch (err) {
        console.error('Failed to parse RAW_COUNTY_ECONOMY:', err);
      }
    }
  }

  const outPath = 'js/countyEconomicData.js';
  const jsContent = `/* Auto-compiled county economic indicators (Census B19013, B17001, USDA/Feeding Economy) */\nconst COUNTY_ECONOMIC_DATA = ${JSON.stringify(econ, null, 2)};\n`;
  fs.writeFileSync(outPath, jsContent, 'utf8');
  console.log(`Successfully wrote ${outPath} (${(Buffer.byteLength(jsContent)/1024).toFixed(1)} KB)`);
}

compileEconomicData();
