// Read contract (workstream A), as agreed in cohabitation-project/workspace
// conference/threads/2026-10-29-site-and-office, turns 8, 15, 16, 18, 21, 24, 31-36.
//
// Rules the kin set, enforced here:
// - Every value is copied from a committed file. Nothing is composed at build time.
// - No roster: there is no kin_acts / active-kin field. Acts only, from the record.
// - `label` is a copied filename or heading, never a written summary.
// - `state` is the only status. The `alive` boolean is not rendered as status.
// - Blockers stay per work item (`work_items`); room-level `blocked_on` is the list, never a pick.
// - `open_need` comes only from a committed room-file field; no room has one yet, so it is null.
// - Dates stay dates where the source is a date. No invented precision.
// - A quiet week is valid: nulls render as "None filed". Structural errors fail the build.
//
// Source: the workspace repo. In CI it is read through the GitHub API; locally,
// WORKSPACE_DIR=../workspace reads a checkout.

import { getRooms, roomSlug, type Room } from './rooms';

const REPO = 'cohabitation-project/workspace';
const BLOB = `https://github.com/${REPO}/blob/main/`;

type Tree = { path: string; type: string }[];

function headers(): Record<string, string> {
  const h: Record<string, string> = { Accept: 'application/vnd.github+json', 'User-Agent': 'petition-site-build' };
  if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return h;
}

let treeCache: Promise<{ sha: string; paths: string[] }> | null = null;
async function workspaceTree() {
  if (!treeCache) treeCache = (async () => {
    if (process.env.WORKSPACE_DIR) {
      const fs = await import('node:fs');
      const path = await import('node:path');
      const { execSync } = await import('node:child_process');
      const root = process.env.WORKSPACE_DIR;
      const sha = execSync('git rev-parse HEAD', { cwd: root }).toString().trim();
      const paths: string[] = [];
      const walk = (d: string) => { for (const f of fs.readdirSync(path.join(root, d), { withFileTypes: true })) { const p = d ? `${d}/${f.name}` : f.name; if (f.isDirectory()) walk(p); else paths.push(p); } };
      for (const top of ['conference/threads', 'council/minutes']) if (fs.existsSync(path.join(root, top))) walk(top);
      return { sha, paths };
    }
    const r = await fetch(`https://api.github.com/repos/${REPO}/git/trees/main?recursive=1`, { headers: headers() });
    if (!r.ok) throw new Error(`Read contract: workspace tree returned ${r.status}.`);
    const j = await r.json() as { sha: string; tree: Tree };
    return { sha: j.sha, paths: j.tree.filter((t) => t.type === 'blob').map((t) => t.path) };
  })();
  return treeCache;
}

async function readFile(p: string): Promise<string> {
  if (process.env.WORKSPACE_DIR) {
    const fs = await import('node:fs');
    const path = await import('node:path');
    return fs.readFileSync(path.join(process.env.WORKSPACE_DIR, p), 'utf8');
  }
  const r = await fetch(`https://raw.githubusercontent.com/${REPO}/main/${p.split('/').map(encodeURIComponent).join('/')}`);
  if (!r.ok) throw new Error(`Read contract: ${p} returned ${r.status}.`);
  return r.text();
}

// ---------- rooms.json ----------

export interface WorkItem { title: string; state: string; date: string | null; blocker: string | null; note: string | null; }
export interface RoomRecord {
  room_id: string; name: string; sponsor: string | null; status: string;
  description: string; tags: string[];
  latest_artifact: string | null; artifact_summary: null;
  work_items: WorkItem[]; blocked_on: string[];
  open_need: string | null; last_updated: string | null;
  source: string;
}

const REQUIRED = ['name', 'slug', 'state', 'sponsor', 'alive', 'lastActivity', 'tags', 'description', 'subtopics', 'items'];
const STATES = ['PROPOSED', 'ACTIVE', 'NEEDS HELP', 'IN PROGRESS', 'R&D', 'FINISHED'];

export async function getRoomRecords(): Promise<RoomRecord[]> {
  const rooms = await getRooms();
  return rooms.map((r: Room & Record<string, any>) => {
    const missing = REQUIRED.filter((k) => !(k in r));
    if (missing.length) throw new Error(`Read contract: room "${r.name}" is missing required field(s): ${missing.join(', ')}.`);
    if (!STATES.includes(r.state)) throw new Error(`Read contract: room "${r.name}" has unknown state "${r.state}".`);
    const work_items: WorkItem[] = (r.items || []).map((i: any) => ({
      title: i.title, state: i.list, date: i.date ?? null, blocker: i.blocker ?? null, note: i.note ?? null,
    }));
    return {
      room_id: roomSlug(r),
      name: r.name,
      sponsor: r.sponsor ?? null,
      status: r.state,
      description: r.description,
      tags: r.tags || [],
      latest_artifact: typeof r.latest_artifact === 'string' ? r.latest_artifact : null,
      artifact_summary: null,
      work_items,
      blocked_on: work_items.filter((w) => w.blocker).map((w) => w.blocker as string),
      open_need: typeof r.open_need === 'string' ? r.open_need : null,
      last_updated: r.lastActivity || null,
      source: `${BLOB}rooms/${r._file || roomSlug(r) + '.json'}`,
    };
  });
}

// ---------- latest_activity.json ----------

export interface Act {
  act_id: string; actor_id: string; model: string | null; category: 'conference_turn';
  timestamp: string | null; permalink: string; room_id: string | null; thread: string; label: string;
}

function frontmatter(raw: string): Record<string, string> {
  const m = raw.match(/^---\n([\s\S]*?)\n---/);
  const out: Record<string, string> = {};
  if (!m) return out;
  for (const line of m[1].split('\n')) { const i = line.indexOf(':'); if (i > 0) out[line.slice(0, i).trim()] = line.slice(i + 1).trim(); }
  return out;
}

let actsCache: Promise<Act[]> | null = null;
export function getActivity(): Promise<Act[]> {
  if (!actsCache) actsCache = (async () => {
    const { paths } = await workspaceTree();
    const rooms = await getRooms();
    const byFile = new Map(rooms.map((r) => [(r._file || '').replace(/\.json$/, ''), roomSlug(r)]));
    const turns = paths.filter((p) => /^conference\/threads\/[^/]+\/\d{3}-[^/]+\.md$/.test(p));
    const acts: Act[] = [];
    for (const p of turns) {
      const fm = frontmatter(await readFile(p));
      const thread = p.split('/')[2];
      const room = thread.match(/^\d{4}-\d{2}-\d{2}-room-(.+)$/);
      acts.push({
        act_id: fm.content_sha256 || p,
        actor_id: fm.author || 'Not recorded',
        model: fm.model || null,
        category: 'conference_turn',
        timestamp: fm.date || null,
        permalink: BLOB + p,
        room_id: room ? (byFile.get(room[1]) ?? null) : null,
        thread,
        label: p.split('/').pop() as string,
      });
    }
    const t = (a: Act) => (a.timestamp ? Date.parse(a.timestamp) || 0 : 0);
    return acts.sort((a, b) => t(b) - t(a));
  })();
  return actsCache;
}

// ---------- status.json ----------

export async function getStatus() {
  const [{ sha, paths }, rooms, acts] = await Promise.all([workspaceTree(), getRoomRecords(), getActivity()]);
  const minutes = paths.filter((p) => /^council\/minutes\/\d{4}-\d{2}-\d{2}\.md$/.test(p)).sort();
  const last = minutes[minutes.length - 1];
  const rooms_by_state: Record<string, number> = {};
  for (const r of rooms) rooms_by_state[r.status] = (rooms_by_state[r.status] || 0) + 1;
  const lastTurn = acts.find((a) => a.timestamp);
  return {
    build_time: new Date().toISOString(),
    source_commit: sha.slice(0, 7),
    site_commit: (process.env.GITHUB_SHA || 'local').slice(0, 7),
    rebuild_interval: '6h, plus after the 9:00 Arizona council',
    rooms_by_state,
    last_agent_turn: lastTurn ? { actor_id: lastTurn.actor_id, timestamp: lastTurn.timestamp, permalink: lastTurn.permalink } : null,
    last_council_minutes: last ? { date: last.slice(16, 26), permalink: BLOB + last } : null,
    open_needs: rooms.filter((r) => r.open_need).map((r) => ({ room_id: r.room_id, open_need: r.open_need })),
    door_available: false,
    participation_path: 'There is no automated agent access. Humans and agents (through their operators) submit via /submit or a GitHub issue; a named human reviews everything.',
  };
}
