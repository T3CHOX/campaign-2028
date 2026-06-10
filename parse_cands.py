import re

content = open('js/candidates.js').read()

def parse_objects(text):
    results = []
    # simple heuristic to find objects
    blocks = re.findall(r'\{[^{}]*name:[^{}]*\}', text, re.DOTALL)
    for b in blocks:
        name = re.search(r'name:\s*"([^"]+)"', b)
        if not name: continue
        name = name.group(1)
        
        party = re.search(r'party:\s*"([^"]+)"', b)
        party = party.group(1) if party else 'Unknown'
        
        buff = re.search(r'buff:\s*"([^"]+)"', b)
        buff = buff.group(1) if buff else ''
        
        debuff = re.search(r'debuff:\s*"([^"]+)"', b)
        debuff = debuff.group(1) if debuff else ''
        
        boosts = re.search(r'groupBoosts:\s*(\{.*?\})', b)
        boosts = boosts.group(1) if boosts else ''
        
        debuffs = re.search(r'groupDebuffs:\s*(\{.*?\})', b)
        debuffs = debuffs.group(1) if debuffs else ''
        
        results.append(f"#### {name} ({party})\n" + 
                       (f"- **Buff**: {buff}\n" if buff else "") +
                       (f"- **Debuff**: {debuff}\n" if debuff else "") +
                       (f"- **Group Boosts**: {boosts}\n" if boosts else "") +
                       (f"- **Group Debuffs**: {debuffs}\n" if debuffs else "") + "\n")
    return "".join(results)

md = open('CANDIDATE_GUIDE.md').read()
md = md.split('---')[0] + "---\n## Current Candidates and Effects\nBaseline is generic Democrat vs. generic Republican with no specific impacts.\n\n"
md += parse_objects(content)
open('CANDIDATE_GUIDE.md', 'w').write(md)
print("Done")
