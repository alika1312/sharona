// Structural/a11y assertions over the built HTML using a real DOM parser (jsdom).
// This is what crawlers and assistive tech see pre-hydration.
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";
import { JSDOM } from "jsdom";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dist = resolve(__dirname, "..", "dist");

let pass = 0;
const fails = [];
const check = (cond, msg) => (cond ? pass++ : fails.push(msg));
const flat = (s) => (s || "").replace(/\s+/g, " ").trim();

async function dom(rel) {
  const html = await readFile(join(dist, rel), "utf8");
  return new JSDOM(html).window.document;
}

const contentPages = [
  ["/", "index.html"],
  ["/about/", "about/index.html"],
  ["/experiences/", "experiences/index.html"],
  ["/workshops/", "workshops/index.html"],
  ["/articles/", "articles/index.html"],
  ["/article/1/", "article/1/index.html"],
  ["/faq/", "faq/index.html"],
  ["/accessibility/", "accessibility/index.html"],
];

for (const [label, file] of contentPages) {
  const d = await dom(file);

  // landmarks & headings
  check(d.querySelector("main#main"), `${label}: missing <main id="main">`);
  check(d.querySelector("a.skip-link"), `${label}: missing skip link`);
  check(d.querySelector("header"), `${label}: missing <header>`);
  check(d.querySelector("footer"), `${label}: missing <footer>`);
  check(d.querySelector("nav[aria-label]"), `${label}: nav missing aria-label`);
  const h1s = d.querySelectorAll("h1");
  check(h1s.length === 1, `${label}: expected exactly 1 <h1>, found ${h1s.length}`);
  check((d.querySelector("h1")?.textContent || "").trim().length > 0, `${label}: empty <h1>`);

  // meta
  check((d.title || "").trim().length > 0, `${label}: empty <title>`);
  check(d.querySelector('meta[name="description"]')?.content?.trim(), `${label}: empty description`);
  check(d.querySelector('link[rel="canonical"]')?.href, `${label}: missing canonical`);
  check(d.documentElement.getAttribute("lang") === "he", `${label}: <html lang> != he`);
  check(d.documentElement.getAttribute("dir") === "rtl", `${label}: <html dir> != rtl`);
  check(d.querySelector('meta[property="og:title"]'), `${label}: missing og:title`);

  // images have non-empty alt
  for (const img of d.querySelectorAll("img")) {
    const alt = img.getAttribute("alt");
    check(alt !== null && alt.trim().length > 0, `${label}: <img src=${img.getAttribute("src")}> missing alt`);
  }

  // sitewide footer/nav links
  check([...d.querySelectorAll('a[href="/accessibility"]')].length > 0, `${label}: no footer link to /accessibility`);
  check([...d.querySelectorAll('a[href="/faq"]')].length > 0, `${label}: no nav/footer link to /faq`);

  // floating quick-contact (WhatsApp + tel) present sitewide
  check(d.querySelector('a[href*="wa.me/972587250990"]'), `${label}: missing WhatsApp link`);
  check(d.querySelector('a[href="tel:+972587250990"]'), `${label}: missing tel: link`);

  // gtag bootstrap must be in the PRERENDERED html, not only after hydration
  const hasBootstrap = [...d.querySelectorAll("script:not([src])")].some((s) =>
    /window\.dataLayer\s*=\s*window\.dataLayer/.test(s.textContent)
  );
  check(hasBootstrap, `${label}: gtag bootstrap missing from prerendered HTML`);

  // JSON-LD present & valid
  const ld = [...d.querySelectorAll('script[type="application/ld+json"]')];
  check(ld.length > 0, `${label}: no JSON-LD`);
  for (const s of ld) {
    try {
      JSON.parse(s.textContent);
    } catch {
      fails.push(`${label}: unparseable JSON-LD`);
    }
  }
}

// Home-specific: FAQ *teaser* (not the full list), labelled contact form, hero prio
{
  const d = await dom("index.html");
  const faqBtns = d.querySelectorAll("#faq button[aria-expanded]");
  check(faqBtns.length === 3, `home: expected 3 FAQ teaser toggles, found ${faqBtns.length}`);
  check(d.querySelector('#faq a[href="/faq"]'), "home: FAQ teaser missing link to /faq");
  // teaser questions sit under the section's h2 → h3 (no skipped level)
  check(
    [...faqBtns].every((b) => b.closest("h3")),
    "home: FAQ teaser question not inside an h3"
  );

  // FAQPage schema must NOT be on the homepage any more — it moved to /faq.
  const homeLd = [...d.querySelectorAll('script[type="application/ld+json"]')].map((s) =>
    JSON.parse(s.textContent)
  );
  check(!homeLd.some((j) => j["@type"] === "FAQPage"), "home: FAQPage schema should have moved to /faq");

  for (const f of ["name", "phone", "email", "message"]) {
    const el = d.querySelector(`#contact [name="${f}"]`);
    check(el && el.getAttribute("aria-label"), `home: contact field "${f}" missing aria-label`);
  }
  check(d.querySelector('#contact [role="status"][aria-live]'), "home: contact form missing aria-live status");
  check(d.querySelector('img[fetchpriority="high"]'), "home: hero image not prioritized");
}

// /faq: all 8 Q&As on the page, FAQPage schema with only the 6 grounded answers,
// schema values actually present in the rendered text, share control, TODO flags.
{
  const d = await dom("faq/index.html");
  // scoped to <main> so the header's mobile-menu toggle isn't counted
  const btns = [...d.querySelectorAll("main button[aria-expanded]")];
  check(btns.length === 8, `faq: expected 8 FAQ toggles, found ${btns.length}`);
  for (const b of btns) {
    const panel = d.getElementById(b.getAttribute("aria-controls") || "");
    check(panel, `faq: aria-controls target missing for "${flat(b.textContent).slice(0, 24)}"`);
    // /faq questions are the top-level sections under the page h1 → h2 (no skipped level)
    check(b.closest("h2"), `faq: question "${flat(b.textContent).slice(0, 24)}" not inside an h2`);
  }

  const faqLd = [...d.querySelectorAll('script[type="application/ld+json"]')]
    .map((s) => JSON.parse(s.textContent))
    .find((j) => j["@type"] === "FAQPage");
  check(faqLd, "faq: FAQPage schema missing");
  check(faqLd?.mainEntity?.length === 6, `faq: FAQPage schema should have 6 Q&As, found ${faqLd?.mainEntity?.length}`);

  // schema must not drift from what the page actually says
  const text = flat(d.body.textContent);
  for (const q of faqLd?.mainEntity || []) {
    check(text.includes(flat(q.name)), `faq: schema question not on page: ${flat(q.name).slice(0, 30)}`);
    check(
      text.includes(flat(q.acceptedAnswer.text)),
      `faq: schema answer not on page for: ${flat(q.name).slice(0, 30)}`
    );
  }
  // the TODO answers must NOT be asserted in schema
  check(
    !(faqLd?.mainEntity || []).some((q) => /כמה עולה|כמה זמן נמשך/.test(q.name)),
    "faq: a TODO question leaked into FAQPage schema"
  );
  check(/להשלמה על ידי שרונה/.test(text), "faq: TODO flag not visible on page");

  // share control
  check(d.querySelectorAll(".share-btn").length >= 2, "faq: share control missing");
  check(
    [...d.querySelectorAll("[aria-label]")].some((n) => /העתקת קישור/.test(n.getAttribute("aria-label"))),
    "faq: copy-link control missing aria-label"
  );
}

// Article pages carry the share control
{
  const d = await dom("article/1/index.html");
  check(d.querySelectorAll(".share-btn").length >= 2, "article/1: share control missing");
  check(d.querySelector('a[href^="https://wa.me/?text="]'), "article/1: WhatsApp share link missing");
  check(
    [...d.querySelectorAll("[aria-label]")].some((n) =>
      /שיתוף העמוד בוואטסאפ/.test(n.getAttribute("aria-label"))
    ),
    "article/1: WhatsApp share link missing aria-label"
  );
}

// ---- schema values must match what the page actually says ----

// Article: headline == the page's h1, mainEntityOfPage == the canonical.
for (const id of [1, 2, 3, 4, 5, 6]) {
  const d = await dom(`article/${id}/index.html`);
  const art = [...d.querySelectorAll('script[type="application/ld+json"]')]
    .map((s) => JSON.parse(s.textContent))
    .find((j) => j["@type"] === "Article");
  check(art, `article/${id}: Article schema missing`);
  check(
    flat(art?.headline) === flat(d.querySelector("h1")?.textContent),
    `article/${id}: schema headline != <h1> ("${flat(art?.headline)}")`
  );
  const canonical = d.querySelector('link[rel="canonical"]')?.getAttribute("href");
  check(
    art?.mainEntityOfPage === canonical,
    `article/${id}: schema mainEntityOfPage (${art?.mainEntityOfPage}) != canonical (${canonical})`
  );
  check(
    flat(art?.description) === flat(d.querySelector('meta[name="description"]')?.content),
    `article/${id}: schema description != meta description`
  );
}

// Sitewide Person / ProfessionalService / Service: every asserted contact detail
// and service name must be findable in the site's own rendered text.
{
  const pages = {};
  for (const [, file] of contentPages) pages[file] = flat((await dom(file)).body.textContent);
  const anywhere = (s) => Object.values(pages).some((t) => t.includes(s));

  const graph = [...(await dom("index.html")).querySelectorAll('script[type="application/ld+json"]')]
    .map((s) => JSON.parse(s.textContent))
    .flatMap((j) => j["@graph"] || [j]);

  const svc = graph.find((n) => n["@type"] === "ProfessionalService");
  check(svc, "schema: ProfessionalService node missing");
  // phone is rendered formatted (058-725-0990), so check the tel: href instead
  const home = await dom("index.html");
  check(
    home.querySelector(`a[href="tel:${svc?.telephone}"]`),
    `schema: telephone ${svc?.telephone} has no matching tel: link on the page`
  );
  check(anywhere(svc?.email), `schema: email ${svc?.email} not found in page text`);
  check(
    anywhere(svc?.address?.addressLocality),
    `schema: addressLocality ${svc?.address?.addressLocality} not found in page text`
  );
  for (const place of svc?.areaServed || []) {
    check(anywhere(place.name), `schema: areaServed "${place.name}" not found in page text`);
  }
  for (const s of graph.filter((n) => n["@type"] === "Service")) {
    check(anywhere(s.name), `schema: Service "${s.name}" not found in page text`);
  }
  const person = graph.find((n) => n["@type"] === "Person");
  check(anywhere(person?.name), `schema: Person name not found in page text`);
  for (const org of person?.alumniOf || []) {
    // schema uses the org's full name; the page may name it more briefly
    const key = org.name.split(",")[0].replace(/^בית הספר למנהיגות חינוכית$/, "מנהיגות חינוכית");
    check(anywhere(key), `schema: alumniOf "${org.name}" not supported by page text`);
  }
}

// Redirect stubs must be noindex
for (const f of ["home/index.html", "workshop/index.html", "articals/index.html", "artical/index.html"]) {
  const d = await dom(f);
  const robots = d.querySelector('meta[name="robots"]')?.content || "";
  check(/noindex/.test(robots), `/${f}: not noindex`);
}

console.log(`\nDOM assertions passed: ${pass}`);
console.log(fails.length ? `FAILURES (${fails.length}):` : "✓ All DOM assertions passed.");
fails.forEach((f) => console.log("  ✗ " + f));
process.exit(fails.length ? 1 : 0);
