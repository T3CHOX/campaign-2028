import fs from 'node:fs';
const content = fs.readFileSync('js/candidates.js', 'utf8');
const matches = [...content.matchAll(/id:\s*["']([^"']+)["'],\s*\n\s*name:\s*["']([^"']+)["'],\s*\n\s*party:\s*["']([^"']+)["']/g)];
for (const m of matches) {
  console.log(`${m[3]} | ${m[1]} | ${m[2]}`);
}
