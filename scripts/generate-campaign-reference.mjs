import fs from 'node:fs';
import vm from 'node:vm';

const read = (file) => fs.readFileSync(file, 'utf8');
const run = (file, context = {}) => {
  vm.createContext(context);
  vm.runInContext(read(file), context, { filename: file });
  return context;
};

const issueContext = run('js/issueCatalog.js', {
  CORE_ISSUES: [],
  POSITION_DESCRIPTORS: {},
  STATE_ISSUE_POSITIONS: {}
});
const issueData = vm.runInContext(`JSON.parse(JSON.stringify(CORE_ISSUES.map(issue => ({
  id: issue.id,
  name: issue.name,
  category: issue.category,
  legacyId: issue.legacyId,
  description: issue.description,
  positions: issue.positions.map(position => ({
    id: position.id,
    label: position.label,
    value: position.value,
    description: position.description
  }))
}))))`, issueContext);

const groupContext = run('js/interestGroups.js');
const groupData = vm.runInContext(`JSON.parse(JSON.stringify({
  groups: INTEREST_GROUPS,
  playerDescriptions: PLAYER_GROUP_DESCRIPTIONS,
  pacs: PACS,
  coalitions: COALITION_BREAKPOINTS
}))`, groupContext);

const factionContext = run('js/factions.js');
const factionData = vm.runInContext(`JSON.parse(JSON.stringify(FACTIONS))`, factionContext);

const bullet = (text) => `- ${text}`;
const code = (text) => `\`${text}\``;
const tableCell = (text) => String(text ?? '').replaceAll('|', '\\|').replaceAll('\n', ' ');
const percent = (value) => `${Math.round(Number(value) * 100)}%`;

const lines = [
  '# Campaign Issues, Groups & Factions',
  '',
  '> Human-readable reference generated from the current simulator definitions. Edit this file directly for notes or planning; regenerate it with `node scripts/generate-campaign-reference.mjs` when the source definitions change.',
  '',
  `**Current snapshot:** ${issueData.length} issues · ${Object.keys(groupData.groups).length} voter/constituency groups · ${Object.keys(factionData).length} factions · ${Object.keys(groupData.pacs).length} PACs · ${Object.keys(groupData.coalitions).length} coalition breakpoints`,
  '',
  '## How to read the issue positions',
  '',
  'Every issue uses the same seven-position ideological scale. The labels are scenario positions, not claims about real candidates or current law.',
  '',
  '| Position | Model value | Meaning in the catalog |',
  '|---|---:|---|',
  '| Far Left | -9 | Most interventionist or expansive position on this issue |',
  '| Left | -6 | Strong interventionist or progressive position |',
  '| Center Left | -3 | Moderately progressive position |',
  '| Center | 0 | Mixed, incremental, or balancing position |',
  '| Center Right | 3 | Moderately market-oriented or restrictive position |',
  '| Right | 6 | Strong market-oriented or restrictive position |',
  '| Far Right | 9 | Least federal intervention or most restrictive position, depending on the issue |',
  '',
  '## 1. Issues and positions',
  ''
];

let issueNumber = 0;
for (const category of [...new Set(issueData.map((issue) => issue.category))]) {
  lines.push(`### ${category}`, '');
  for (const issue of issueData.filter((item) => item.category === category)) {
    issueNumber += 1;
    lines.push(`#### ${issueNumber}. ${issue.name}`, '');
    lines.push(bullet(`ID: ${code(issue.id)}`));
    if (issue.legacyId !== issue.id) lines.push(bullet(`Legacy ID: ${code(issue.legacyId)}`));
    lines.push(bullet(`Issue description: ${issue.description}`), '');
    lines.push('| Position / ideology | Value | Position description |', '|---|---:|---|');
    for (const position of issue.positions) {
      lines.push(`| ${tableCell(position.label)} | ${position.value} | ${tableCell(position.description)} |`);
    }
    lines.push('');
  }
}

lines.push('## 2. Voter, demographic, and constituency groups', '');
lines.push('These are the 34 entries in `INTEREST_GROUPS`. Priorities use the issue IDs or legacy aliases used by the simulator. Baseline is the group\'s modeled partisan lean, where negative is Democratic-leaning and positive is Republican-leaning.', '');

for (const category of [...new Set(Object.values(groupData.groups).map((group) => group.category))]) {
  lines.push(`### ${category}`, '');
  lines.push('| ID | Group | Baseline lean | Top priorities | Player-facing description |', '|---|---|---:|---|---|');
  for (const [id, group] of Object.entries(groupData.groups).filter(([, item]) => item.category === category)) {
    const description = group.playerDescription || group.description || groupData.playerDescriptions?.[id] || '';
    lines.push(`| ${code(id)} | ${tableCell(group.name)} | ${group.baseline > 0 ? '+' : ''}${group.baseline} | ${tableCell((group.priorities || []).join(', '))} | ${tableCell(description)} |`);
  }
  lines.push('');
}

lines.push('### Group support anchors and modeling notes', '');
lines.push('| ID | Elasticity | Third-party path | Age skew | 2024 support anchor (D / R / I / G / L / PSL) |', '|---|---:|---|---|---|');
for (const [id, group] of Object.entries(groupData.groups)) {
  const support = group.support || {};
  const anchor = ['D', 'R', 'I', 'G', 'L', 'PSL'].map((party) => `${party} ${support[party] ?? 0}%`).join(' / ');
  lines.push(`| ${code(id)} | ${group.elasticity ?? '—'} | ${group.thirdPartyPath || '—'} | ${group.ageSkew || '—'} | ${anchor} |`);
}
lines.push('');

lines.push('## 3. Factions', '');
lines.push('Faction party codes: D = Democratic, R = Republican, I = Independent/unaligned, G = Green, PSL = Party for Socialism and Liberation, and L = Libertarian.', '');
lines.push('| ID | Faction | Party | Core groups | Base turnout bonus | Description |', '|---|---|---|---|---:|---|');
for (const [id, faction] of Object.entries(factionData)) {
  lines.push(`| ${code(id)} | ${tableCell(faction.name)} | ${faction.party} | ${tableCell((faction.coreGroups || []).join(', '))} | ${percent(faction.baseTurnoutBonus || 0)} | ${tableCell(faction.description)} |`);
}
lines.push('');

lines.push('## 4. Other modeled organized interests', '');
lines.push('These are PACs in `PACS`, distinct from voter/constituency groups.', '');
lines.push('| ID | Organization | Category | Priority issue | Desired position | Contribution | Description |', '|---|---|---|---|---:|---:|---|');
for (const [id, pac] of Object.entries(groupData.pacs)) {
  lines.push(`| ${code(id)} | ${tableCell(pac.name)} | ${tableCell(pac.category)} | ${code(pac.priority_issue)} | ${pac.desired_position} | $${pac.contribution}M | ${tableCell(pac.playerDescription || pac.description)} |`);
}
lines.push('');

lines.push('## 5. Coalition breakpoints', '');
lines.push('These are modeled loyalty/turnout thresholds, not additional demographic groups.', '');
lines.push('| ID | Coalition | Parties | Requirements | Warning / collapse | Leak destinations |', '|---|---|---|---|---|---|');
for (const [id, coalition] of Object.entries(groupData.coalitions)) {
  const requirements = (coalition.requirements || []).map((requirement) => `${requirement.issue} ${requirement.max !== undefined ? `≤ ${requirement.max}` : `≥ ${requirement.min}`} (${requirement.label})`).join('; ');
  const leakTo = Object.entries(coalition.leakTo || {}).map(([party, share]) => `${party} ${percent(share)}`).join(', ');
  lines.push(`| ${code(id)} | ${tableCell(coalition.label)} | ${tableCell((coalition.parties || []).join(', '))} | ${tableCell(requirements)} | ${coalition.warningWeeks} / ${coalition.collapseWeeks} weeks | ${tableCell(leakTo)} |`);
}
lines.push('');

lines.push('## Source files', '');
lines.push(bullet(`[Issue catalog](js/issueCatalog.js)`));
lines.push(bullet(`[Voter and demographic groups, PACs, and coalition rules](js/interestGroups.js)`));
lines.push(bullet(`[Factions](js/factions.js)`));
lines.push('');

fs.writeFileSync('CAMPAIGN_ISSUES_AND_GROUPS.md', `${lines.join('\n')}\n`, 'utf8');
console.log(`Wrote CAMPAIGN_ISSUES_AND_GROUPS.md (${issueData.length} issues, ${Object.keys(groupData.groups).length} groups, ${Object.keys(factionData).length} factions).`);
