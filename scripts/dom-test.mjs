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
  ["/accessibility/", "accessibility/index.html"],
];

for (const [label, file] of contentPages) {
  const d = await dom(file);

  // landmarks & headings
  check(d.querySelector("main#main"), `${label}: missing <main id="main">`);
  check(d.querySelector("a.skip-link"), `${label}: missing skip link`);
  check(d.querySelector("header"), `${label}: missing <header>`);
  check(d.querySelector("footer"), `${label}: missing <footer>`);
  check(d.querySelector('nav[aria-label]'), `${label}: nav missing aria-label`);
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

  // footer accessibility link present sitewide
  check([...d.querySelectorAll('a[href="/accessibility"]')].length > 0, `${label}: no footer link to /accessibility`);

  // floating quick-contact (WhatsApp + tel) present sitewide
  check(d.querySelector('a[href*="wa.me/972587250990"]'), `${label}: missing WhatsApp link`);
  check(d.querySelector('a[href="tel:+972587250990"]'), `${label}: missing tel: link`);

  // JSON-LD present & valid
  const ld = [...d.querySelectorAll('script[type="application/ld+json"]')];
  check(ld.length > 0, `${label}: no JSON-LD`);
  for (const s of ld) {
    try { JSON.parse(s.textContent); } catch { fails.push(`${label}: unparseable JSON-LD`); }
  }
}

// Home-specific: FAQ accordion + labelled contact form + priority hero image
{
  const d = await dom("index.html");
  const faqBtns = d.querySelectorAll('#faq button[aria-expanded]');
  check(faqBtns.length >= 6, `home: expected >=6 FAQ toggles, found ${faqBtns.length}`);
  for (const f of ["name", "phone", "email", "message"]) {
    const el = d.querySelector(`#contact [name="${f}"]`);
    check(el && el.getAttribute("aria-label"), `home: contact field "${f}" missing aria-label`);
  }
  check(d.querySelector('#contact [role="status"][aria-live]'), `home: contact form missing aria-live status`);
  check(d.querySelector('img[fetchpriority="high"]'), `home: hero image not prioritized`);
  const faqLd = [...d.querySelectorAll('script[type="application/ld+json"]')]
    .map((s) => JSON.parse(s.textContent))
    .find((j) => j["@type"] === "FAQPage");
  check(faqLd && faqLd.mainEntity.length === 6, `home: FAQPage schema should have 6 Q&As, found ${faqLd?.mainEntity?.length}`);
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
