import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const root=path.resolve(import.meta.dirname,'..');
for(const file of fs.readdirSync(path.join(root,'js')).filter(f=>f.endsWith('.js'))){new vm.Script(fs.readFileSync(path.join(root,'js',file),'utf8'),{filename:file});}
console.log('All browser scripts parse successfully.');
