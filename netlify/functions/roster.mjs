/**
 * Roster migrations, run on the server.
 *
 * These used to live in the page, but the lists they work from are the rosters
 * themselves — fifty-one people's names. Anything in the published HTML is
 * readable by anyone who opens the page source, so with the calendar behind an
 * access code the names have to be here, where a request has to get past that
 * code to reach them.
 *
 * Each saved dataset runs every step it has not seen yet, once, tracked by its
 * own `rosterVersion` — so a rep removed in the app afterwards stays removed.
 */

export const ROSTER_VERSION = 4;

/* v2 — the names the three branch rosters were first filled in with. */
const ROSTER_ADDITIONS = {
  SYR: ["Andrew Rivera", "Harold Rose", "Cameron Lewis"],
  WCH: ["Paolo De Rosa", "Craig Couse", "Patrick Madison"],
  BOH: ["Maruice Haughton", "Frank Bachard", "Christian Enright", "Derek Navarro",
        "Kirk Davidson", "Joseph Livoti", "Gregg Catalano", "Dallas Brett", "Sebastian Henao"],
};

/* v3 — the three rosters as the branches actually stand. Authoritative rather
   than additive: a rep whose name sits on another branch's list moves across
   (keeping the availability they have marked), a name on no list at all comes
   off, and each branch ends in this order. Two names were mistyped originally. */
const ROSTER_RENAMES = {
  "maruice haughton": "Maurice Haughton",
  "perry kleeman": "Perry Kleemann",
};
const ROSTERS = {
  SYR: ["Andrew Rivera", "Brodye Condy", "Cameron Lewis", "Chris Brown",
        "Harold Rose", "Jonathan Helms", "Nate Holland", "Tom Redfield"],
  WCH: ["Craig Couse", "Danny Berisha", "Paolo De Rosa", "Patrick Madison", "Samuel Rodriguez"],
  BOH: ["Andrew Saulino", "Christian Enright", "Dallas Brett", "Derek Navarro", "Frank Bachard",
        "Gregg Catalano", "Jacob Meier", "Joseph Livoti", "Kirk Davidson", "Marc Simonian",
        "Maurice Haughton", "Perry Kleemann", "Phillip Eareckson", "Ridge Dufek", "Scott Crafa",
        "Sebastian Henao"],
};

/* v4 — Bachman joins as a second company. */
export const DIVISIONS = [
  { code: "KQ", label: "King Quality" },
  { code: "BACH", label: "Bachman" },
];
const BACHMAN_BRANCHES = [
  { code: "WER", name: "Wernersville", reps: [
      "William Martin", "Jordan Oliver", "Steven Duhovis", "Albert Powell", "Ben Anderson"] },
  { code: "MTG", name: "Montgomery County", reps: [
      "Louis Cohen", "Chris Ruyak", "Alexander Selyukov", "Alexander Ruperto", "Brian Decesare",
      "Jeremy Marshall", "Jason Friedman", "Louis Difrancesco"] },
  { code: "MTS", reps: [
      "Jessie Rivas", "Shayle Durkin", "Uriel Mendoza", "Nicholas Sanguiolo"] },
  { code: "LHV", name: "Lehigh Valley", reps: [
      "Anthony Rizzo", "Luis Mortimer", "John Usavage", "Zach Stahr", "Nick Gordon"] },
];

/* The standing company block: nobody at King Quality takes an appointment on a
   Wednesday morning, because everyone is at the sales meeting. */
export const DEFAULT_BLOCKS = [
  { id: "blk-sales-meeting", label: "Sales Meeting", scope: "KQ", dow: 3, slot: "AM" },
];

const lc = (s) => String(s || "").toLowerCase();
const findRep = (branch, name) => branch.reps.find((r) => lc(r.name) === lc(name)) || null;
let idSeq = 0;
const newRep = (name) => ({
  id: "r" + Date.now().toString(36) + (idSeq++).toString(36) + Math.random().toString(36).slice(2, 5),
  name, slots: {}, timeOff: {}, status: {}, daysOff: {}, dateOff: {},
});

/**
 * Test fixture: same people, same blocks, no availability and no days off. The
 * suites that exercise the grid need a fixed starting shape, and the real seed
 * carries whatever has actually been entered.
 */
export function blankSlate(s) {
  for (const b of s.branches) {
    for (const r of b.reps) { r.slots = {}; r.timeOff = {}; r.status = {}; r.daysOff = {}; r.dateOff = {}; }
  }
  return s;
}

/** Fill in anything a stored state is missing, without changing what it holds. */
export function normalize(s) {
  if (!s || !Array.isArray(s.branches)) return s;
  for (const b of s.branches) {
    if (!Array.isArray(b.reps)) b.reps = [];
    if (!b.division) b.division = "KQ";
    for (const r of b.reps) {
      r.slots ||= {}; r.timeOff ||= {}; r.status ||= {}; r.daysOff ||= {}; r.dateOff ||= {};
    }
  }
  s.targets ||= { weekTotal: 12, weekPrime: 5, monthTotal: 50, monthPrime: 25 };
  if (!s.rosterVersion) s.rosterVersion = 1;
  if (!Array.isArray(s.divisions) || !s.divisions.length) s.divisions = DIVISIONS.map((d) => ({ ...d }));
  if (!Array.isArray(s.blocks)) s.blocks = DEFAULT_BLOCKS.map((b) => ({ ...b }));
  for (const b of s.blocks) { b.id ||= newRep("x").id; b.scope ||= "ALL"; b.slot ||= "*"; }
  return s;
}

/** Returns how many things changed, so the caller knows whether to write back. */
export function migrate(s) {
  const from = s.rosterVersion || 1;
  if (from >= ROSTER_VERSION) { s.rosterVersion = ROSTER_VERSION; return 0; }
  let changed = 0;
  if (from < 2) changed += v2(s);
  if (from < 3) changed += v3(s);
  if (from < 4) changed += v4(s);
  s.rosterVersion = ROSTER_VERSION;
  return changed;
}

function v2(s) {
  let added = 0;
  for (const b of s.branches) {
    for (const name of ROSTER_ADDITIONS[b.code] || []) {
      if (findRep(b, name)) continue;
      b.reps.push(newRep(name));
      added++;
    }
  }
  return added;
}

function v3(s) {
  let changed = 0;

  for (const b of s.branches) {
    for (const r of b.reps) {
      const fixed = ROSTER_RENAMES[lc(r.name)];
      if (fixed && r.name !== fixed) { r.name = fixed; changed++; }
    }
  }

  const home = {};
  for (const code of Object.keys(ROSTERS)) for (const n of ROSTERS[code]) home[lc(n)] = code;

  for (const from of s.branches) {
    for (let i = from.reps.length - 1; i >= 0; i--) {
      const rep = from.reps[i], to = home[lc(rep.name)];
      if (to === from.code) continue;
      from.reps.splice(i, 1);
      changed++;
      if (!to) continue;                                  /* on no list — off the roster */
      const dest = s.branches.find((b) => b.code === to);
      if (!dest) continue;
      const already = findRep(dest, rep.name);
      if (already) mergeRep(already, rep);                /* never lose marked availability */
      else dest.reps.push(rep);
    }
  }

  for (const b of s.branches) {
    const want = ROSTERS[b.code];
    if (!want) continue;
    for (const name of want) {
      if (findRep(b, name)) continue;
      b.reps.push(newRep(name));
      changed++;
    }
    const order = want.map(lc);
    b.reps.sort((a, z) => {
      let ai = order.indexOf(lc(a.name)), zi = order.indexOf(lc(z.name));
      if (ai < 0) ai = order.length;
      if (zi < 0) zi = order.length;
      return ai - zi;
    });
  }
  return changed;
}

function v4(s) {
  let changed = 0;
  if (!Array.isArray(s.divisions) || !s.divisions.length) {
    s.divisions = DIVISIONS.map((d) => ({ ...d }));
    changed++;
  }
  for (const b of s.branches) if (!b.division) { b.division = "KQ"; changed++; }

  for (const spec of BACHMAN_BRANCHES) {
    let here = s.branches.find((b) => b.code === spec.code);
    if (!here) {
      here = { code: spec.code, division: "BACH", reps: [] };
      s.branches.push(here);
      changed++;
    }
    here.division = "BACH";
    if (spec.name) here.name = spec.name;
    for (const name of spec.reps) {
      if (findRep(here, name)) continue;
      here.reps.push(newRep(name));
      changed++;
    }
  }

  /* the sales meeting was always King Quality's */
  for (const bl of s.blocks || []) {
    if (bl.id === "blk-sales-meeting" && bl.scope === "ALL") { bl.scope = "KQ"; changed++; }
  }
  return changed;
}

function mergeRep(keep, gone) {
  for (const k of ["slots", "timeOff", "status", "daysOff", "dateOff"]) {
    keep[k] ||= {};
    for (const key of Object.keys(gone[k] || {})) if (!(key in keep[k])) keep[k][key] = gone[k][key];
  }
}
