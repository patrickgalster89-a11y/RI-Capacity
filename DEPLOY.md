# Adding the calendar to your existing Netlify site

> This is the **alternative** to deploying the repo as its own site. For that — the
> simpler path, and the one this repo is configured for — see [README.md](README.md).
> Use these notes only if you'd rather the calendar live under a site you already have.

Two folders go into your site's repo. Nothing else in your repo changes.

```
capacity/                            →  copy to where your site's static files live
  index.html

netlify/functions/                   →  copy to your repo root
  capacity-state.mjs
  seed.mjs
  roster.mjs
```

All three function files are needed. `seed.mjs` holds the rosters and `roster.mjs` the
rules for reconciling one that has already been saved; they are bundled into the function
and never served, which is the point — `capacity/index.html` is public whatever codes you
set, so it carries no names.

The result is the calendar at **`yourdomain.com/capacity/`**, saving through
**`/api/capacity-state`**.

---

## 1. Put `capacity/` where your site serves static files from

This is the one thing that depends on how your site is built. Find your setup:

| Your site | Put `capacity/` in |
| --- | --- |
| Plain HTML (no build step) | the repo root, beside your `index.html` |
| Publish directory is `public/` or `dist/` and you edit it directly | that directory |
| Astro, SvelteKit, Nuxt, Vite | `public/` |
| Next.js | `public/` |
| Hugo | `static/` |
| Eleventy | your input directory, with passthrough copy on |
| Jekyll | the repo root (the folder name has no underscore, so it ships as-is) |
| Gatsby | `static/` |

Not sure? In Netlify, **Site configuration → Build & deploy → Build settings**
shows your *publish directory*. Whatever ends up in there is what gets served.
The test: after deploying, `yourdomain.com/capacity/` returns the page.

## 2. Put the three function files at your repo root

`netlify/functions` is Netlify's default location — it is picked up automatically,
and the route `/api/capacity-state` is declared inside the file itself. **No
`netlify.toml` change is needed** unless your repo already points the functions
directory somewhere else, in which case put the file there instead.

## 3. Add one dependency

The function needs `@netlify/blobs`. In your repo root:

```bash
npm install @netlify/blobs
```

If your repo has no `package.json` at all, create one first with `npm init -y`.
Commit both `package.json` and `package-lock.json`.

## 4. Set the two codes

Netlify → **Project configuration → Environment variables**, add both. Include the
**Functions** scope — that is what reads them:

| Key | Who it is for | What that role may change |
| --- | --- | --- |
| `ADMIN_CODE` | you | everything |
| `MANAGER_CODE` | sales managers | availability, days off, time-off notes, monthly approvals |

Then **Deploys → Trigger deploy → Clear cache and deploy site**.

One prompt, either code. Until a request carries one of them the function answers 401 and
the page shows nothing but that prompt. A manager's code is refused — `403 admin_only` —
for anything that changes the shape of the calendar: rosters, branches, companies, blocked
times, targets, or an imported backup. That check runs in the function against what is
stored, so it holds whether the request came from the app or from a terminal.

> Leave both unset and anyone who finds the URL can read *and* change everything. Set them
> before you share the link.

## 5. Check it

1. `yourdomain.com/capacity/` asks for the access code — and shows nothing else.
2. The code opens the calendar. The header says **"Locked — passcode needed to save"**, not *"This copy saves
   to this browser only"*. The second message means the page could not reach the
   function — see troubleshooting below.
3. Mark a slot, press **Save**, enter the passcode. It should say *"Saved.
   Everyone with the link sees this version."*
4. Open the same URL in a private window — your change should be there.

---

## Things worth knowing before you go live

**Nothing on your site links to it, and the code is the real lock.** The calendar is
unlisted until you add a link, but it no longer depends on that: the roster is not in the
page, and the function will not hand it over without one of the two codes. Reps get their own link from the ⋯ menu beside each name, which opens
straight to their calendar and hides everything else:
`yourdomain.com/capacity/?rep=r1`

**It does not touch your existing routes.** The function is named
`capacity-state` and routed at `/api/capacity-state` precisely so it cannot
collide with an `/api/state` you might already have. If you would rather it sat
somewhere else, change two things to match: `export const config = { path: ... }`
at the bottom of `capacity-state.mjs`, and the `<meta name="capacity-api">` tag
near the top of `index.html`.

**Blob storage is per-site.** The calendar's data lives in a Netlify Blobs store
called `ri-capacity-calendar` on your site. It does not interact with anything
else your site stores.

**A Content-Security-Policy will break it.** The page keeps all its CSS and JS
inline and pulls fonts from Google. If your site sends a strict `Content-Security-Policy`
header, `/capacity/*` needs `'unsafe-inline'` for scripts and styles, plus
`fonts.googleapis.com` and `fonts.gstatic.com`. Most Netlify sites send no CSP at
all — check `Site configuration → Headers`, or your `_headers` file, if the page
loads blank.

---

## Troubleshooting

**"This copy saves to this browser only"** — the page cannot reach the function.
Open `yourdomain.com/api/capacity-state` directly:

- **401** with `{"ok":false,"error":"access_code"}` → the function is fine and doing its
  job; that is what it should say to a request without a code. Try
  `yourdomain.com/api/capacity-state?info=1`, which needs no code, and expect
  `{"ok":true,"requiresCode":true}`.
- JSON like `{"ok":true,...}` → the function is fine; the page is looking at the
  wrong path. Check the `<meta name="capacity-api">` tag.
- **404** → the function did not deploy. Confirm the file is at
  `netlify/functions/capacity-state.mjs` and check **Deploys → Functions** for it.
- **500** → almost always the missing dependency. Check the function log for
  `Cannot find module '@netlify/blobs'` and revisit step 3.

**The access code is refused** — it matches neither `ADMIN_CODE` nor `MANAGER_CODE`, or a
variable was set after the last deploy. Environment variables only reach a function on a fresh deploy:
**Deploys → Trigger deploy → Clear cache and deploy site**.

**Saving returns 403** — that account is on the manager code and the change is admin-only.
The reply names what it refused. Sign out (⋯ → **Sign out of this device**) and back in
with the admin code.

**Saving returns 401** — the code stopped matching, usually because it was rotated. Sign
out and back in.

**The page 404s** — `capacity/` did not reach your publish directory. Step 1.

---

## Running it as its own site instead

The repo also stands alone: `netlify.toml` publishes the root and redirects `/`
to `/capacity/`, so pointing Netlify at this repo gives you a working site with
no changes. `npm run dev` serves it locally on the same paths.
