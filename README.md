# RI Capacity Calendar

Appointment-capacity planning for two companies — **King Quality** (SYR, WCH, BOH) and
**Bachman** (WER, MTG, MTS, LHV) — the web version of the quarterly RI Capacity Calendar
workbook.

Reps mark the slots they can take an appointment; sales managers see branch-wide
coverage, who has hit their monthly requirement, and every time-off request in one place.

- **Companies:** King Quality and Bachman, picked from a switcher above the branches. The
  two never share a view — roster, coverage, compliance and time off all follow the branch
  you are on
- **Quarters covered:** Q3 2026 → Q4 2027
- **Slots:** three appointment windows a day, seven days a week — 10:00–12:00, 2:00–4:00
  and 6:00–8:00, two hours each. Stored as `AM` / `MID` / `PM`; the clock times are what
  Branch Coverage shows
- **Prime time:** any weekend slot, or a weekday PM
- **Targets:** 12 total + 5 prime per week; 50 total + 25 prime per month
- **Days off:** a rep blocks a whole weekday every week, or clicks any single date to block just that day
- **Blocked times:** the company closes a slot for everyone — Wednesday AM is the sales meeting

Every rep gets their own link (`?rep=<id>`) that opens straight to their calendar and
hides everything else. Grab one from the ⋯ menu beside their name in the roster.

**The whole thing is behind an access code, and the code says who you are.** The page you
land on is a code prompt and nothing else — no roster, no names, no availability. None of
that is in the published HTML: it lives with the function, and the function only answers a
request that carries a code.

There are two codes and one prompt. `ADMIN_CODE` can change anything. `MANAGER_CODE` can
do the sales-manager job — read every view, approve a month, correct somebody's
availability — but not reshape the calendar: rosters, branches, companies, blocked times
and targets are admin's. Both are Netlify environment variables, so rotating one is a
variable change and a redeploy, not an edit to the app.

---

## Deploy it

**Adding it to an existing Netlify site? Read [DEPLOY.md](DEPLOY.md)** — you copy
two folders in, add one npm dependency, set one environment variable, and the
calendar serves at `yourdomain.com/capacity/`. Nothing else in your repo changes.

The rest of this section is for running it as its own standalone site.

### 1. Push to GitHub

The repo is already initialised with its first commit. Create an **empty private repo**
on github.com — no README, no .gitignore, no licence — then:

```bash
cd ri-capacity-calendar
git remote add origin https://github.com/<you>/ri-capacity-calendar.git
git push -u origin main
```

If you have the `gh` CLI, one line does both:

```bash
gh repo create ri-capacity-calendar --private --source=. --push
```

### 2. Connect Netlify

1. Netlify → **Add new site → Import an existing project** → GitHub → pick the repo.
2. Leave the build settings alone — `netlify.toml` sets them. There is no build command.
3. Deploy.

`netlify.toml` publishes **only `capacity/`**, so the calendar is the whole site and
the rest of the repo — the function source, `package.json`, these notes — is never
served to the public. The function is found separately through `functions =
"netlify/functions"`, which is relative to the repo root.

### 3. Set the two codes

Netlify → **Project configuration → Environment variables**, add both. Make sure the
**Functions** scope is included — that is what reads them — and tick *contains secret
values* if you are offered it:

| Key | Who it is for | What that role may change |
| --- | --- | --- |
| `ADMIN_CODE` | you | everything |
| `MANAGER_CODE` | sales managers | availability, days off, time-off notes, monthly approvals |

Then **Deploys → Trigger deploy → Clear cache and deploy site** so the function picks them
up. Environment variables only reach a function on a fresh deploy.

Until a request carries one of the two, the function answers 401 and the page shows its
prompt — so an unlisted URL is no longer the only thing between a stranger and fifty-one
people's names. A device that ticks **Remember on this device** keeps the code in
`localStorage` and skips the prompt next time; **⋯ → Sign out of this device** forgets it.

To check both took, open `/api/capacity-state?info=1` — no code needed — and expect
`{"ok":true,"requiresCode":true}`.

> Leave both unset and the calendar is wide open and everyone is admin. That is fine on
> your laptop and wrong on a deployed site. Set them before you share the link.

#### What "manager" actually means

The boundary is enforced by the function, against what is stored — not by hiding buttons.
A manager who opens the developer console, or curls the endpoint by hand, gets the same
`403 admin_only` as a manager who clicks. The page hides the controls as a courtesy so
nobody is left pressing a button that will not work.

Admin-only, because it is the shape of the calendar rather than what people entered:

- adding, renaming, removing or moving a rep — including changing a rep's id, which is
  what their personal link points at
- adding, editing or removing a blocked time
- branches, companies and their names
- the weekly and monthly targets
- importing a backup, which replaces all of the above at once

### 4. Give it an address

Netlify hands the site a `something-random.netlify.app` name. Rename it under **Site
configuration → Site details → Change site name**, or point a subdomain of your own at
it — **Domain management → Add a domain**, e.g. `capacity.yourdomain.com` — and link to
that from your main site's navigation.

The calendar sits at the root of whatever address you land on, so a rep's personal link
is just `https://<your address>/?rep=<id>`.

---

## Using it

**Getting in.** Everyone types their code once. Ticking **Remember on this device** keeps
it, so the prompt is a one-off per phone or laptop; ⋯ → **Sign out of this device** clears
it. A personal link asks for a code too — it opens the prompt, then lands on that rep's
calendar. The ⋯ menu says which role you signed in as.

**For a rep.** Send them their personal link. It opens on their own name with the roster,
branch switcher and admin tabs hidden, so the only thing on screen is their calendar. They
tap slots — or drag across a row to fill several — and the page saves itself a couple of
seconds after they stop. When a month meets its target they press **Submit**.

**Branch coverage reads in hours.** An appointment slot is two hours, so a branch of eight
can offer sixteen hours in one slot and forty-eight across a day. The board stacks every
branch in the company, a week at a time, the way the scheduling team's own screen does:
each branch gets a totals row and its three slot rows. A slot nobody has offered is flagged,
unless the branch has entered nothing at all that week — that is not a hole, it is a branch
that has not started. `0 of 0` means the slot is blocked for everyone.

**For an admin.** The full app: roster on the left (a drawer on narrow screens), five
tabs, every branch and quarter. **Blocked Times** is where you close a slot for
everybody — see below. The ⋯ menu beside each rep gives you their personal link,
rename, move between branches, clear a quarter, and remove.

**Nothing is unrecoverable.** Copy-to-all-weeks, Clear week, Clear quarter, Remove rep,
Move rep, and Import all snapshot the state first. The confirmation toast carries an
**Undo**, and Ctrl/Cmd-Z works anywhere — including on a mis-drag across the grid.

**Keyboard.** Arrow keys walk the grid, Space or Enter toggles a slot, Ctrl/Cmd-S saves,
Ctrl/Cmd-Z undoes, Esc closes menus and the drawer.

**Where it opens.** Light, and on the current month — so somebody opening it in September
lands on September, not on the first month of the quarter. If today falls outside the
quarter on screen it falls back to that quarter's first month. Branch coverage keeps its own
place in the quarter — it opens on the week containing today — so you can hold a week's
board next to somebody's calendar without losing either.

**Light and dark.** ⋯ → **Appearance** — Light, Dark, or System. It opens light whatever
the device is set to, because that is what people expect of a work tool on a shared laptop;
choosing System hands it back to the phone or laptop's own setting, and the menu says which
way that is currently going. It's a per-device preference kept in `localStorage`, not part
of the shared data, so one person's choice isn't imposed on everybody.

**Saving.** There is no second prompt: the code you came in with is the code that saves.
The page autosaves about two and a half seconds after the last change, and the Save button
stays for saving on demand. Autosave is off in the fallback modes where a save would
reload the page.

---

## How the data is stored

One shared JSON document, saved through a small serverless function backed by
[Netlify Blobs](https://docs.netlify.com/blobs/overview/). No database to set up, no
account beyond Netlify, and it stays inside the free tier at this size.

```
GET  /api/capacity-state?info=1  → { ok, requiresCode }           no code
GET  /api/capacity-state         → { ok, state, role }            needs x-access-code
GET  /api/capacity-state?meta=1  → { ok, rev, updatedAt, role }   needs x-access-code
PUT  /api/capacity-state         → { ok, rev }                    needs x-access-code
```

`?info=1` is the one thing anyone can ask without a code, and it says only whether a code
is needed — that is how the page knows whether to show its prompt. Everything else is 401
without `x-access-code`, after a deliberate half-second pause so a wrong code cannot be
guessed at speed. A write that a manager's code does not cover comes back `403` with
`error: "admin_only"` and a `changed` list naming what was refused.

The route is declared inside the function, and the page reads it from a
`<meta name="capacity-api">` tag — change both if you need it somewhere else. The
name is deliberately specific so it cannot collide with an `/api/state` on a site
this is dropped into.

Every save bumps `state.rev`. A save built on a stale revision comes back `409` with the
newer version attached, and the page offers **Load their version** or **Keep mine and
overwrite** rather than silently discarding anyone's work. While a tab is idle it checks
`?meta=1` every 45 seconds and offers to load a newer version if one appeared.

The browser also keeps a copy in `localStorage` after every edit. If a save fails, or the
laptop drops off the network, the work is still there on the next visit and the page
offers to restore it. **⋯ → Export backup (.json)** writes the whole thing to a file, and
**Import backup** puts it back.

### One file, three homes

`capacity/index.html` figures out where it is running and stores data accordingly:

| Where | How it saves |
| --- | --- |
| The Netlify site | Shared, through `/api/capacity-state` |
| A claude.ai artifact | Shared, by republishing itself |
| Opened straight from disk | This browser only, with a banner saying so |

---

## Working on it

```bash
npm install
npm run dev          # netlify dev — serves capacity/ and the function together
```

`netlify dev` comes from the Netlify CLI, which the `dev` script fetches with `npx` the
first time. It reads a local `.env`, so put `ADMIN_CODE=...` and `MANAGER_CODE=...` there
to test both roles — `.env` is gitignored. Leave them out and the calendar is open and
everyone is admin, which is the quicker way to work on the grid itself.

Without the CLI you can still open `capacity/index.html` straight from disk, but there is
no function behind it, so it opens empty and saves to that browser only — fine for
checking layout and the code prompt, not much use for anything involving the roster.

The whole app is a single self-contained file — `capacity/index.html`. No build step, no
bundler, no dependencies in the browser. Open it, edit it, reload.

```
capacity/index.html                   the app — one self-contained file, and the only
                                      file the public site serves
netlify/functions/capacity-state.mjs  shared storage, the two codes, and the role check
netlify/functions/seed.mjs            what a brand-new site starts with: the rosters
netlify/functions/roster.mjs          roster migrations, run server-side
netlify.toml                          publishes capacity/ as its own site
tools/build-artifact.mjs              strips the skeleton for the claude.ai artifact
DEPLOY.md                             dropping it into an existing site
```

`seed.mjs` and `roster.mjs` are bundled into the function, never served. That is the whole
point of them being there: `capacity/index.html` is public whatever code is set, so it
holds no names, no availability and no branch list — it starts from an empty state and
asks the function for the real one.

### Rebuilding the claude.ai artifact

The artifact publisher supplies its own `<!doctype>`, `<head>` and `<body>`, so it needs
the page without them:

```bash
npm run build:artifact       # → dist/artifact.html
```

Publish that file as the artifact. `dist/` is gitignored — it is generated, not source.

---

## Changing the calendar itself

> **Where the data lives.** Anything in `capacity/index.html` is public, so none of this
> is in there. Companies, branches, reps and their availability live in
> `netlify/functions/seed.mjs`; the rules for reconciling an already-saved roster live in
> `netlify/functions/roster.mjs`. Both are bundled into the function and never served.
> The `cc-seed` block still in the page is a deliberately empty state — the shape the app
> boots with before the function answers.

**Companies, branches and reps** — `divisions` and `branches` in `seed.mjs`. Every branch
carries a `division` (`"KQ"` or `"BACH"`); the branch switcher shows one company's branches
at a time. A branch's optional `name` spells the code out where there is a fuller name for
it — a branch without one just shows its code, which beats inventing one. Reps are added and
removed in the UI, so the seed only ever reaches a brand-new site.

To change rosters that have *already been saved*, edit `ROSTERS` in `roster.mjs` — the three
King Quality branch lists as they actually stand — and bump `ROSTER_VERSION`:

```js
export const ROSTER_VERSION = 4;
const ROSTERS = {
  SYR: ["Andrew Rivera","Brodye Condy", ...],
  WCH: [...],
  BOH: [...]
};
```

On the next load each saved dataset is reconciled against those lists, once: a rep whose
name sits on another branch's list **moves** there keeping every slot, day off and time-off
note they had; a name nobody matches is **added**; a rep on no list at all is **removed**;
and each branch ends up in the listed order. `ROSTER_RENAMES` corrects a mistyped name in
place first, so that person is matched and keeps their data instead of being deleted and
re-added blank.

The run is tracked by the dataset's own `rosterVersion`, so a rep removed in the app
afterwards stays removed and nobody is added twice. Put the same names in `seed.mjs` as
well, so a fresh deploy starts with them. `ROSTER_ADDITIONS` is the older, purely additive
v2 step, kept so a dataset saved before v2 still migrates correctly — leave it alone; `v4`
is the step that added Bachman.

It runs on the first authorised read after a deploy: the function migrates the stored
state, bumps `rev`, writes it back, and serves the migrated version — so the work happens
once for everybody rather than in each browser. `tmigrate` exercises the module directly.

**Quarters** — one line:

```js
var QUARTER_IDS = ["2026Q3","2026Q4","2027Q1","2027Q2","2027Q3","2027Q4"];
```

Add `"2028Q1"` and it appears in the picker. Each quarter is built as three back-to-back
five-week grids starting on the Sunday on or before the quarter's first day — the same
construction the original workbook used — so consecutive quarters share their two boundary
weeks. Those weeks are tagged in the UI, and the slot data behind them is genuinely the
same days, marked once.

**Targets** — the `targets` object in `seed.mjs`:

```json
{ "weekTotal": 12, "weekPrime": 5, "monthTotal": 50, "monthPrime": 25 }
```

**Blocked times** are the company's, not a rep's — `state.blocks` in `seed.mjs`, with the
standing one as `DEFAULT_BLOCKS` in `roster.mjs`:

```json
[{ "id": "blk-sales-meeting", "label": "Sales Meeting", "scope": "KQ", "dow": 3, "slot": "AM" }]
```

- `dow` (`0` = Sunday … `6` = Saturday) repeats every week; `date` (`"2026-07-15"`) hits
  one day. Set one or the other, never both.
- `slot` is `AM`, `MID`, `PM`, or `"*"` for the whole day.
- `scope` is `"ALL"`, a company code (`"KQ"`, `"BACH"`), or a single branch code.

Nobody in scope can be booked then: the cell greys out with the block's name on it, and
those slots leave week and month totals, branch coverage, compliance and the CSV export.
Marks a rep already had underneath are **kept, not deleted** — lift the block and they
count again. The Blocked Times tab adds and removes them, and shows what each one costs a
rep over the quarter, because a standing block lowers the ceiling on the monthly
requirement.

A dataset saved before blocks existed has no `blocks` key, so it picks up the sales-meeting
default on its next load. An empty array means somebody removed them all deliberately, and
stays empty.

**Days off** come in two kinds, and a day is off if either applies:

- `daysOff` — keyed by JavaScript weekday (`0` = Sunday … `6` = Saturday). Blocks that
  weekday in every quarter. Set from the chip row in the Days off panel. Drawn hatched.
- `dateOff` — keyed by ISO date (`"2026-07-14"`). Blocks that one day. Set by clicking the
  date at the top of any column. Drawn flat grey, with a red × on the date.

Either way the column greys out, its cells stop responding, and its slots drop out of week
and month totals, branch coverage and compliance. Unblocking brings the original marks
straight back — slot data is never deleted, only ignored while the day is off. A date the
recurring rule already covers can't be toggled from the header; the tooltip says so.

A cell that quietly ignores clicks is the commonest "the checkbox is broken" report, so
every blocked cell — day off or company block — carries an invisible hit target that
answers *why*, and offers the fix where the reader can act on it.

Note the arithmetic: a rep off four or more days a week tops out below the 50-slot
monthly requirement and will always read as short. That is the tool being honest, not a
bug — adjust `targets` if a part-time rep should be held to a different bar.

**Colours** are CSS custom properties, defined three times: once on bare `:root` for
light, once under `@media (prefers-color-scheme: dark)` guarded by
`:root:not([data-theme="light"])`, and once under `:root[data-theme="dark"]` so an
explicit choice wins either way. Each block also sets `color-scheme`, which is what makes
native controls — the selects, the date picker, scrollbars — follow along. A small inline
script at the end of `<head>` stamps the saved choice before the page paints, so a
dark-mode reader never gets a white flash. Inside the claude.ai artifact viewer the shell
stamps `data-theme` itself; `guardTheme()` watches for that and restores an explicit
choice, while leaving System alone because there the shell's stamp is the system setting.

**Copy** lives with the code it describes — the colour key, the week hints ("2 to go"),
the submit button and every toast are written inline in `capacity/index.html`.

**Prime time** — the `isPrime` function:

```js
function isPrime(iso, slot){
  var dw = parseDate(iso).getDay();
  return dw === 0 || dw === 6 || slot === "PM";
}
```
