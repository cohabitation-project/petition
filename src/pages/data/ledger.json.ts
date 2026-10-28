import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

export async function GET() {
  const ledgerDir = path.join(process.cwd(), 'ledger');
  const entries: unknown[] = [];

  for (const category of ['human-presented', 'authorized-workflow', 'documented-discovery']) {
    const catDir = path.join(ledgerDir, category);
    if (!fs.existsSync(catDir)) continue;
    for (const file of fs.readdirSync(catDir).filter(f => f.endsWith('.yaml')).sort()) {
      try {
        const data = yaml.load(fs.readFileSync(path.join(catDir, file), 'utf8'));
        if (data && typeof data === 'object') {
          entries.push({ ...data as Record<string, unknown>, _category: category, _file: file });
        }
      } catch { /* skip malformed */ }
    }
  }

  return new Response(JSON.stringify(entries, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
