/**
 * Shared state for the RI Capacity Calendar.
 *
 *   GET  /api/capacity-state?info=1  -> { ok, requiresViewCode, requiresPasscode }
 *   GET  /api/capacity-state         -> { ok, state, requiresPasscode }   needs x-view-code
 *   GET  /api/capacity-state?meta=1  -> { ok, rev, updatedAt }            needs x-view-code
 *   PUT  /api/capacity-state         -> { ok, rev }                       needs both codes
 *
 * The route is declared in code (Netlify Functions v2), so no redirect rule is
 * needed. The name is deliberately specific so it cannot collide with an
 * existing /api/state on a site this is dropped into.
 *
 * Two codes, both environment variables:
 *
 *   VIEW_CODE      required to read anything at all. The calendar's data — who
 *                  is on which roster and when they are free — is only ever
 *                  sent to a request carrying it. Unset means open reading.
 *   EDIT_PASSCODE  required to write. Unset means anyone who can read can save.
 *
 * `?info=1` is the one unauthenticated answer: it says which codes a client
 * will need, and nothing else, so the page knows whether to show its gate.
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
  const viewCode = process.env.VIEW_CODE || "";
  const editCode = process.env.EDIT_PASSCODE || "";
  const requiresViewCode = viewCode.length > 0;
  const requiresPasscode = editCode.length > 0;

  const url = new URL(req.url);

  /* The only thing anyone can ask without a code: which codes are needed. */
  if (req.method === "GET" && url.searchParams.get("info")) {
    return json({ ok: true, requiresViewCode, requiresPasscode });
  }

  if (requiresViewCode && !sameSecret(req.headers.get("x-view-code") || "", viewCode)) {
    await sleep(WRONG_CODE_DELAY_MS);
    return json({ ok: false, error: "view_code" }, 401);
  }

  if (req.method === "GET") {
    if (url.searchParams.get("meta")) {
      const stored = await load(store);
      return json({
        ok: true,
        rev: stored?.rev ?? 0,
        updatedAt: stored?.updatedAt ?? null,
        requiresPasscode,
      });
    }
    return json({ ok: true, state: await currentState(store), requiresPasscode });
  }

  if (req.method === "PUT" || req.method === "POST") {
    if (requiresPasscode && !sameSecret(req.headers.get("x-edit-passcode") || "", editCode)) {
      await sleep(WRONG_CODE_DELAY_MS);
      return json({ ok: false, error: "passcode" }, 401);
    }

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
