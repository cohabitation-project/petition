export async function GET() {
  try {
    const contentsRes = await fetch(
      'https://api.github.com/repos/cohabitation-project/workspace/contents/council/minutes',
      { headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'petition-site-build' } }
    );
    if (!contentsRes.ok) {
      return new Response('# No council minutes available\n', {
        status: 503,
        headers: { 'Content-Type': 'text/plain' },
      });
    }
    const files: { name: string; download_url: string }[] = await contentsRes.json();
    const jsonlFiles = files.filter(f => f.name.endsWith('.jsonl')).sort((a, b) => b.name.localeCompare(a.name));
    if (!jsonlFiles.length) {
      return new Response('# No JSONL exchange logs available yet\n', {
        status: 404,
        headers: { 'Content-Type': 'text/plain' },
      });
    }
    const rawRes = await fetch(jsonlFiles[0].download_url);
    const text = await rawRes.text();
    return new Response(text, {
      headers: { 'Content-Type': 'application/x-ndjson; charset=utf-8' },
    });
  } catch (err) {
    return new Response(`# Error fetching council data: ${err}\n`, {
      status: 503,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}
