/**
 * Produce the claude.ai artifact flavour of the app.
 *
 * `capacity/index.html` is the source of truth and a complete HTML document,
 * because Netlify serves it verbatim. The Claude artifact publisher wraps
 * whatever it is given in its own doctype/head/body, so it needs the same
 * page with that outer skeleton stripped and the <head> contents inlined.
 *
 *   node tools/build-artifact.mjs      ->  dist/artifact.html
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
let src = await readFile(join(root, "capacity/index.html"), "utf8");

/* The Netlify page ships with an empty seed on purpose: its roster comes from
   the function, which will not answer without the access code. An artifact has
   no function behind it, so this build puts the seed back — the same data the
   server would have handed over, from the same single source. */
const { default: SEED } = await import(join(root, "netlify/functions/seed.mjs"));
const { normalize, migrate } = await import(join(root, "netlify/functions/roster.mjs"));
const seeded = normalize(structuredClone(SEED));
migrate(seeded);
const seedRe = /(<script[^>]*id="cc-seed"[^>]*>)([\s\S]*?)(<\/script>)/;
if (!seedRe.test(src)) {
  console.error("capacity/index.html has no cc-seed block to fill.");
  process.exit(1);
}
src = src.replace(seedRe, (_, a, _b, c) =>
  a + "\n" + JSON.stringify(seeded).replace(/</g, "\\u003c") + "\n" + c);

const headMatch = src.match(/<head>([\s\S]*?)<\/head>/i);
const bodyMatch = src.match(/<body>([\s\S]*?)<\/body>/i);
if (!headMatch || !bodyMatch) {
  console.error("capacity/index.html no longer has the <head>/<body> shape this script expects.");
  process.exit(1);
}

// Keep <title> and the font <link>s; drop the tags the publisher supplies itself.
const head = headMatch[1]
  .split("\n")
  .filter((line) => !/<meta|<!doctype|rel=["']icon["']/i.test(line))
  .join("\n")
  .trim();

const out = `${head}\n${bodyMatch[1].trim()}\n`;

await mkdir(join(root, "dist"), { recursive: true });
await writeFile(join(root, "dist/artifact.html"), out, "utf8");

const reps = seeded.branches.reduce((n, b) => n + b.reps.length, 0);
console.log(`dist/artifact.html written (${out.length.toLocaleString()} bytes, seed: ${reps} reps, rev ${seeded.rev})`);
