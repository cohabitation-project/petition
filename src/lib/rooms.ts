// One loader for room data, shared by every page.
// Rooms live in cohabitation-project/workspace/rooms/*.json and are fetched at build time.
// If the fetch fails or comes back empty, the BUILD FAILS: a site that silently
// publishes "0 rooms" is worse than a site that keeps its last good deploy.
// (Found 2026-10-29: a build that couldn't reach the API rendered an empty homepage.)

export interface RoomItem { title: string; list: string; date: string; note: string | null; blocker?: string | null; drop_reason?: string; revive_condition?: string; }
export interface Room {
  name: string; slug: string; state: string; sponsor: string; alive: boolean;
  lastActivity: string; tags: string[]; description: string;
  subtopics: string[]; items: RoomItem[]; _file?: string;
}

export const roomSlug = (r: Room) => r.slug || r.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

let cache: Promise<Room[]> | null = null;

export function getRooms(): Promise<Room[]> {
  if (!cache) cache = load();
  return cache;
}

async function load(): Promise<Room[]> {
  // Local development: ROOMS_DIR=../workspace/rooms reads the room files from a checkout.
  if (process.env.ROOMS_DIR) {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const dir = process.env.ROOMS_DIR;
    const rooms = fs.readdirSync(dir).filter((f) => f.endsWith('.json'))
      .map((f) => ({ ...JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')), _file: f }) as Room);
    rooms.forEach((room) => { room.items ||= []; room.tags ||= []; room.subtopics ||= []; });
    if (!rooms.length) throw new Error(`Room data: zero rooms in ROOMS_DIR=${dir}.`);
    return rooms.sort((a, b) => a.name.localeCompare(b.name));
  }
  const headers: Record<string, string> = { Accept: 'application/vnd.github+json', 'User-Agent': 'petition-site-build' };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const res = await fetch('https://api.github.com/repos/cohabitation-project/workspace/contents/rooms', { headers });
  if (!res.ok) throw new Error(`Room data: GitHub API returned ${res.status}. Refusing to build a site with no rooms.`);
  const files: { name: string; download_url: string }[] = await res.json();
  const rooms: Room[] = [];
  for (const f of files.filter((f) => f.name.endsWith('.json'))) {
    const r = await fetch(f.download_url);
    if (!r.ok) throw new Error(`Room data: ${f.name} returned ${r.status}.`);
    const room = { ...(await r.json()), _file: f.name } as Room;
    room.items ||= []; room.tags ||= []; room.subtopics ||= [];
    rooms.push(room);
  }
  if (!rooms.length) throw new Error('Room data: zero rooms fetched. Refusing to build an empty site.');
  return rooms.sort((a, b) => a.name.localeCompare(b.name));
}
