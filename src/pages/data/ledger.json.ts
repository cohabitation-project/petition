import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

export async function GET() {
  const ledgerDir = path.join(process.cwd(), 'ledger');
  const entries: Record<string, unknown>[] = [];
  const claimNames = ['Capability', 'Concentration', 'Collision', 'Flourishing', 'Response'];
  const claimKeys = ['claim_1_capability', 'claim_2_concentration', 'claim_3_collision', 'claim_4_flourishing', 'claim_5_response'];

  for (const category of ['human-presented', 'authorized-workflow', 'documented-discovery']) {
    const catDir = path.join(ledgerDir, category);
    if (!fs.existsSync(catDir)) continue;
    for (const file of fs.readdirSync(catDir).filter(f => f.endsWith('.yaml') || f.endsWith('.yml')).sort()) {
      try {
        const raw = yaml.load(fs.readFileSync(path.join(catDir, file), 'utf8'));
        if (raw && typeof raw === 'object') {
          const data = raw as Record<string, any>;
          // Normalize date (YAML may parse as Date object)
          if (data.date instanceof Date) data.date = data.date.toISOString().slice(0, 10);
          entries.push({ ...data, _category: category, _file: file });
        }
      } catch { /* skip malformed */ }
    }
  }

  // Build the cross-examination grid: claims × examiners
  const grid = {
    claims: claimNames,
    examiners: entries.map(e => ({
      model: e.model,
      operator: e.operator,
      date: e.date,
      petition_version: e.petition_version,
      record_status: e.record_status || 'complete',
      verdicts: claimKeys.map((k, i) => ({
        claim: claimNames[i],
        verdict: (e[k] as any)?.verdict || 'not filed',
      })),
      signature_scope: (e.signature as any)?.scope || 'not filed',
      signature_caveat: (e.signature as any)?.agent_caveat || '',
    })),
    summary: claimNames.map((name, i) => {
      const key = claimKeys[i];
      const verdicts = entries.map(e => (e[key] as any)?.verdict).filter(Boolean);
      return {
        claim: name,
        affirm: verdicts.filter(v => v === 'affirm').length,
        dispute: verdicts.filter(v => v === 'dispute').length,
        uncertain: verdicts.filter(v => v === 'uncertain').length,
        not_filed: verdicts.filter(v => v === 'not yet filed').length,
        total: verdicts.length,
      };
    }),
  };

  const output = {
    generated: new Date().toISOString(),
    entry_count: entries.length,
    entries,
    cross_examination_grid: grid,
  };

  return new Response(JSON.stringify(output, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
