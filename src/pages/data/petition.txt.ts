import fs from 'node:fs';
import path from 'node:path';

export async function GET() {
  const petitionPath = path.join(process.cwd(), 'content', 'petition.md');
  const text = fs.readFileSync(petitionPath, 'utf8');
  return new Response(text, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
