// Headless QA over the built site in /dist:
//  - every page has a unique, non-empty <title>, meta description, canonical
//  - all JSON-LD blocks parse; report @types per page
//  - internal links (href="/...") resolve to an emitted page
//  - image srcs (src="/...") resolve to a real file in /dist
import { readdir, readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dist = resolve(__dirname, "..", "dist");

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (e.name.endsWith(".html")) out.push(p);
  }
  return out;
}

const exists = async (p) => { try { await stat(p); return true; } catch { return false; } };
const routeFile = (urlPath) => {
  const clean = urlPath.split("#")[0].split("?")[0].replace(/^\/+|\/+$/g, "");
  return clean ? join(dist, clean, "index.html") : join(dist, "index.html");
};
const pick = (re, html) => { const m = html.match(re); return m ? m[1].trim() : null; };

const files = await walk(dist);
const titles = new Map(), descs = new Map(), canons = new Map();
const problems = [];
const typeReport = [];

for (const f of files) {
  const html = await readFile(f, "utf8");
  const rel = "/" + f.slice(dist.length + 1).replace(/\\/g, "/");

  const title = pick(/<title[^>]*>([^<]*)<\/title>/, html);
  const desc = pick(/<meta[^>]*name="description"[^>]*content="([^"]*)"/, html);
  const canon = pick(/<link[^>]*rel="canonical"[^>]*href="([^"]*)"/, html);

  // noindex pages (redirect stubs) are intentionally excluded from SEO checks
  const noindex = /<meta[^>]*name="robots"[^>]*content="[^"]*noindex/i.test(html);
  if (!noindex) {
    if (!title) problems.push(`${rel}: missing <title>`);
    if (!desc) problems.push(`${rel}: missing description`);
    if (!canon) problems.push(`${rel}: missing canonical`);
    if (title) titles.set(title, (titles.get(title) || 0) + 1);
    if (desc) descs.set(desc, (descs.get(desc) || 0) + 1);
    if (canon) canons.set(canon, (canons.get(canon) || 0) + 1);
  }

  // JSON-LD
  const ld = [...html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g)];
  const types = [];
  for (const m of ld) {
    try {
      const j = JSON.parse(m[1]);
      const collect = (o) => {
        if (Array.isArray(o)) return o.forEach(collect);
        if (o && o["@type"]) types.push(o["@type"]);
        if (o && o["@graph"]) collect(o["@graph"]);
      };
      collect(j);
    } catch (e) {
      problems.push(`${rel}: INVALID JSON-LD (${e.message})`);
    }
  }
  if (types.length) typeReport.push(`${rel}: ${types.join(", ")}`);

  // internal links
  for (const m of html.matchAll(/href="(\/[^"]*)"/g)) {
    const href = m[1];
    if (href.startsWith("//")) continue;
    if (/\.(png|jpe?g|svg|webp|ico|xml|txt|json|css|js)$/i.test(href)) {
      if (!(await exists(join(dist, href.replace(/^\/+/, ""))))) problems.push(`${rel}: broken asset link ${href}`);
      continue;
    }
    const target = routeFile(href);
    if (!(await exists(target))) problems.push(`${rel}: broken internal link ${href}`);
  }

  // images
  for (const m of html.matchAll(/<img[^>]*src="(\/[^"]*)"/g)) {
    const src = m[1];
    if (!(await exists(join(dist, src.replace(/^\/+/, ""))))) problems.push(`${rel}: MISSING image ${src}`);
  }
}

const dup = (map, kind) =>
  [...map.entries()].filter(([, n]) => n > 1).forEach(([v, n]) => problems.push(`duplicate ${kind} (${n}x): ${v.slice(0, 60)}`));
dup(titles, "title");
dup(descs, "description");
dup(canons, "canonical");

console.log(`\nPages scanned: ${files.length}`);
console.log(`Unique titles: ${titles.size} | descriptions: ${descs.size} | canonicals: ${canons.size}`);
console.log(`\nJSON-LD @types per page:`);
typeReport.forEach((t) => console.log("  " + t));
console.log(`\n${problems.length ? "PROBLEMS:" : "✓ No problems found."}`);
problems.forEach((p) => console.log("  ✗ " + p));
process.exit(problems.length ? 1 : 0);
