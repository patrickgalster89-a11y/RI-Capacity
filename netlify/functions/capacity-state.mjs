/**
 * Shared state for the RI Capacity Calendar.
 *
 *   GET  /api/capacity-state?info=1  -> { ok, requiresCode }              no code
 *   GET  /api/capacity-state         -> { ok, state, role }              needs x-access-code
 *   GET  /api/capacity-state?meta=1  -> { ok, rev, updatedAt, role }     needs x-access-code
 *   PUT  /api/capacity-state         -> { ok, rev }                      needs x-access-code
 *
 * The route is declared in code (Netlify Functions v2), so no redirect rule is
 * needed. The name is deliberately specific so it cannot collide with an
 * existing /api/state on a site this is dropped into.
 *
 * ── Two roles, one code each ────────────────────────────────────────────────
 *
 *   ADMIN_CODE    everything.
 *   MANAGER_CODE  everything a sales manager does — reading every view,
 *                 approving a month, correcting a rep's availability — but not
 *                 the shape of the thing: who is on which roster, what the
 *                 branches and companies are, what is blocked, what the targets
 *                 are. Those are admin's.
 *
 * One code gets you in and decides what you may write; there is no second
 * prompt. Whichever code a request carries, the *server* decides what that
 * request is allowed to change, by diffing the structure of what was sent
 * against what is stored. Hiding buttons in the page is a courtesy to the
 * reader, not a control — a manager who calls this endpoint by hand is refused
 * exactly the same way.
 *
 * With neither variable set the calendar is wide open and everyone is admin,
 * which is fine for local development and wrong for a deployment.
 *
 * `?info=1` is the one unauthenticated answer: it says whether a code is
 * needed, and nothing else, so the page knows whether to show its gate.
 *
 * The initial roster lives in seed.mjs, bundled into this function rather than
 * sitting in the published HTML — anything in that file is public regardless of
 * any code. The first authorised read seeds the store from it.
 *
 * Writes are compare-and-set on `state.rev`: a PUT whose rev is not higher than
 * the stored one comes back 409 with the stored state, so the browser can show
 * the newer version rather than silently clobbering it. Send `force: true` in
 * the body to overwrite deliberately.
 */
import { getStore } from "@netlify/blobs";
import SEED from "./seed.mjs";
import { normalize, migrate, blankSlate } from "./roster.mjs";

const KEY = "state";
const STORE = "ri-capacity-calendar";   // blobs are namespaced per site
const MAX_BYTES = 4 * 1024 * 1024;

/* Long enough to make scripted guessing tedious, short enough that a rep typing
   the code by hand never notices it. */
const WRONG_CODE_DELAY_MS = 500;

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });

/** Constant-time-ish compare so a wrong code can't be probed by timing. */
function sameSecret(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * The shape of the calendar, as opposed to what people have entered into it.
 *
 * Everything in here is admin's: which companies and branches exist, who is on
 * each roster and under what name, what is blocked for everyone, and the
 * targets every rep is measured against. Everything left out — a rep's marked
 * slots, their days off, their time-off notes, their monthly status — is a
 * manager's to change.
 *
 * Rep ids are included because a personal link is an id: silently swapping one
 * would repoint somebody's link at a different person.
 */
function structureOf(s) {
  return JSON.stringify({
    divisions: (s.divisions || []).map((d) => [d.code, d.label]),
    branches: (s.branches || []).map((b) => [
      b.code, b.division || "KQ", b.name || "",
      (b.reps || []).map((r) => [r.id, r.name]),
    ]),
    blocks: (s.blocks || [])
      .map((b) => [b.id, b.label, b.scope, b.slot, b.dow ?? null, b.date || null])
      .sort((a, z) => String(a[0]).localeCompare(String(z[0]))),
    /* sorted, so a browser that happens to rebuild the object in a different
       key order is not mistaken for someone moving the goalposts */
    targets: Object.keys(s.targets || {}).sort().map((k) => [k, s.targets[k]]),
  });
}

/** What a manager tried to change that only an admin may. Empty means fine. */
function structuralChanges(before, after) {
  if (!before) return ["everything — there is nothing stored yet"];
  const a = JSON.parse(structureOf(before));
  const b = JSON.parse(structureOf(after));
  const out = [];
  if (JSON.stringify(a.divisions) !== JSON.stringify(b.divisions)) out.push("the companies");
  if (JSON.stringify(a.branches) !== JSON.stringify(b.branches)) out.push("the branches or their rosters");
  if (JSON.stringify(a.blocks) !== JSON.stringify(b.blocks)) out.push("the blocked times");
  if (JSON.stringify(a.targets) !== JSON.stringify(b.targets)) out.push("the targets");
  return out;
}

async function load(store) {
  try {
    return await store.get(KEY, { type: "json" });
  } catch {
    return null;
  }
}

/**
 * The state to serve: whatever is stored, or the seed on a brand-new site.
 * Either way it is brought up to the current roster version first, and written
 * back when that changed something, so the migration runs once and not on
 * every read.
 */
async function currentState(store) {
  const stored = await load(store);
  const fresh = !stored;
  let s = normalize(stored ? stored : structuredClone(SEED));
  /* Only ever set by the test harness, never in a deployment. */
  if (fresh && process.env.TEST_FIXTURE) s = blankSlate(s);
  const changed = migrate(s);
  if (fresh || changed) {
    if (fresh) s.rev = Math.max(s.rev ?? 0, 1);
    else if (changed) s.rev = (s.rev ?? 0) + 1;
    s.updatedAt = new Date().toISOString();
    try {
      await store.setJSON(KEY, s);
    } catch {
      /* serving the migrated state matters more than persisting it right now */
    }
  }
  return s;
}

export default async (req) => {
  const store = getStore(STORE);
  const adminCode = process.env.ADMIN_CODE || "";
  const managerCode = process.env.MANAGER_CODE || "";
  const requiresCode = adminCode.length > 0 || managerCode.length > 0;

  const url = new URL(req.url);

  /* The only thing anyone can ask without a code: whether one is needed. */
  if (req.method === "GET" && url.searchParams.get("info")) {
    return json({ ok: true, requiresCode });
  }

  /* One code, and it decides the role. Admin wins if both are set the same. */
  const given = req.headers.get("x-access-code") || "";
  let role = null;
  if (!requiresCode) role = "admin";
  else if (adminCode && sameSecret(given, adminCode)) role = "admin";
  else if (managerCode && sameSecret(given, managerCode)) role = "manager";

  if (!role) {
    await sleep(WRONG_CODE_DELAY_MS);
    return json({ ok: false, error: "access_code" }, 401);
  }

  if (req.method === "GET") {
    if (url.searchParams.get("meta")) {
      const stored = await load(store);
      return json({
        ok: true,
        rev: stored?.rev ?? 0,
        updatedAt: stored?.updatedAt ?? null,
        role,
      });
    }
    return json({ ok: true, state: await currentState(store), role });
  }

  if (req.method === "PUT" || req.method === "POST") {
    let body;
    try {
      body = await req.json();
    } catch {
      return json({ ok: false, error: "bad_json" }, 400);
    }

    const next = body?.state;
    if (!next || !Array.isArray(next.branches)) {
      return json({ ok: false, error: "bad_state" }, 400);
    }
    if (JSON.stringify(next).length > MAX_BYTES) {
      return json({ ok: false, error: "too_large" }, 413);
    }

    const current = await load(store);

    /* The role check that actually holds: a manager may change what people
       entered, never the shape of the calendar. Checked against what is stored,
       so it does not matter what the browser thinks it is allowed to send. */
    if (role !== "admin") {
      const blocked = structuralChanges(current ? normalize(current) : null, next);
      if (blocked.length) {
        return json({
          ok: false,
          error: "admin_only",
          changed: blocked,
          message: "Changing " + blocked.join(" and ") + " needs the admin code.",
        }, 403);
      }
    }

    if (!body.force && current && (next.rev ?? 0) <= (current.rev ?? 0)) {
      return json({ ok: false, error: "conflict", state: current }, 409);
    }

    if (body.force) next.rev = Math.max(next.rev ?? 1, (current?.rev ?? 0) + 1);

    await store.setJSON(KEY, next);
    return json({ ok: true, rev: next.rev });
  }

  return json({ ok: false, error: "method_not_allowed" }, 405);
};

export const config = { path: "/api/capacity-state" };
