import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// The Census model is bundled offline. Prefer its reproducible compressed
// representation to keep startup transfer small without a runtime dependency.
app.get('/counties/demographics.v2.json', (req, res, next) => {
  const compressed = path.join(__dirname, 'counties/demographics.v2.json.gz');
  res.vary('Accept-Encoding');
  if (!req.acceptsEncodings('gzip') || !fs.existsSync(compressed)) return next();
  res.type('application/json').set('Content-Encoding', 'gzip').sendFile(compressed);
});

app.use(express.static(__dirname));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on http://0.0.0.0:${PORT}`);
});
