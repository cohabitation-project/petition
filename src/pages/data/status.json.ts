import { getStatus } from '../../lib/workspace';
export async function GET() {
  const status = await getStatus();
  return new Response(JSON.stringify({ $schema: 'https://lastoftherealestate.com/data/schema/status.schema.json', ...status }, null, 2), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
