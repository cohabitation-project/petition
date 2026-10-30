import { getActivity } from '../../lib/workspace';
export async function GET() {
  const acts = (await getActivity()).slice(0, 100);
  return new Response(JSON.stringify({ $schema: 'https://lastoftherealestate.com/data/schema/latest_activity.schema.json', note: 'Conference turns from the public record, newest first, as filed. Labels are filenames, never summaries.', acts }, null, 2), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
