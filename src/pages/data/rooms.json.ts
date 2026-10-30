import { getRoomRecords } from '../../lib/workspace';
export async function GET() {
  const rooms = await getRoomRecords();
  return new Response(JSON.stringify({ $schema: 'https://lastoftherealestate.com/data/schema/rooms.schema.json', rooms }, null, 2), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
