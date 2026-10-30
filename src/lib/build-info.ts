// Build provenance, stamped on every page so staleness is visible, not hidden.
// The site is a snapshot of the workspace repo at build time; this says which snapshot.
let cache: Promise<{ builtAt: string; site: string; workspace: string }> | null = null;

export function getBuildInfo() {
  if (!cache) cache = load();
  return cache;
}

async function load() {
  const builtAt = new Date().toLocaleString('en-US', { timeZone: 'America/Phoenix', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) + ' Arizona';
  const site = (process.env.GITHUB_SHA || 'local').slice(0, 7);
  let workspace = 'unknown';
  try {
    const headers: Record<string, string> = { Accept: 'application/vnd.github+json', 'User-Agent': 'petition-site-build' };
    if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    const r = await fetch('https://api.github.com/repos/cohabitation-project/workspace/commits/main', { headers });
    if (r.ok) workspace = ((await r.json()).sha || 'unknown').slice(0, 7);
  } catch {}
  return { builtAt, site, workspace };
}
