// Generates sitemap.xml, robots.txt and llms.txt from the site's route + article
// data, so they stay in sync. Output goes to /public (copied into /dist by Vite).
// Run before the build (see package.json "build" script).
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";
import { writeFile } from "node:fs/promises";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const BASE = "https://sharona-bar-nes.com";

const { articles } = await import(
  pathToFileURL(resolve(root, "src/information/articles.js")).href
);
// Same derivation the article page uses, so llms.txt matches the emitted <meta>.
const { articleDescription, normalize } = await import(
  pathToFileURL(resolve(root, "src/information/articleMeta.js")).href
);

// Canonical page list (mirrors the <Head> titles/descriptions in src/Pages/*).
const staticPages = [
  {
    path: "/",
    title: "בית",
    desc: "יועצת ומטפלת בטיפול רגשי, ייעוץ זוגי, הדרכת הורים, טראומה ומשבר – אונליין ובאזור ירושלים ומבשרת ציון.",
  },
  {
    path: "/about/",
    title: "קצת עליי",
    desc: "השכלה, הכשרות והאני מאמין הטיפולי של שרונה קדושאי בר-נס.",
  },
  {
    path: "/experiences/",
    title: "תחומי המומחיות שלי",
    desc: "טיפול במשבר ולחץ, ייעוץ וטיפול זוגי, הדרכת הורים, גירושין בכבוד הדדי, טיפול בטראומה, ייעוץ תעסוקתי וליווי מנהלים.",
  },
  {
    path: "/workshops/",
    title: "סדנאות",
    desc: "סדנאות חווייתיות לזוגות, יחידים, קבוצות וארגונים – כלים מעשיים לתקשורת, קרבה וצמיחה.",
  },
  {
    path: "/articles/",
    title: "מאמרים",
    desc: "מאמרים בנושאי משבר, טראומה, זוגיות, גירושין, אובדן וצמיחה אישית.",
  },
  {
    path: "/faq/",
    title: "שאלות נפוצות",
    desc: "תשובות לשאלות הנפוצות לפני שמתחילים טיפול: תחומי הטיפול, מיקום המפגשים, טיפול אונליין בזום, שפות הטיפול, למי הטיפול מתאים וההכשרה שלי.",
  },
  {
    path: "/accessibility/",
    title: "הצהרת נגישות",
    desc: "הצהרת הנגישות של האתר: ההתאמות שבוצעו לפי תקן ישראלי 5568 ודרכי פנייה לדיווח על בעיות נגישות.",
  },
];

const articlePages = articles.map((a) => ({
  path: `/article/${a.id}/`,
  title: normalize(a.title),
  desc: articleDescription(a),
}));

const allPages = [...staticPages, ...articlePages];
const today = new Date().toISOString().slice(0, 10);

// ---- sitemap.xml ----
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (p) =>
      `  <url>\n    <loc>${BASE}${p.path}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`
  )
  .join("\n")}
</urlset>
`;

// ---- robots.txt ----
const robots = `User-agent: *
Allow: /

Sitemap: ${BASE}/sitemap.xml
`;

// ---- llms.txt ----
const llms = `# שרונה קדושאי בר-נס

> יועצת ומטפלת חינוכית-רגשית. מתמחה בטיפול רגשי, ייעוץ וטיפול זוגי, הדרכת הורים, טיפול במשבר ובטראומה, וייעוץ בתחומי תעסוקה וקריירה. טיפול קצר מועד ליחידים, זוגות וקבוצות – אונליין ובאזור ירושלים ומבשרת ציון, בעברית ובאנגלית.

## עמודים
${staticPages
  .map((p) => `- [${p.title}](${BASE}${p.path}): ${p.desc}`)
  .join("\n")}

## מאמרים
${articlePages
  .map((p) => `- [${p.title}](${BASE}${p.path}): ${p.desc}`)
  .join("\n")}
`;

await Promise.all([
  writeFile(resolve(root, "public/sitemap.xml"), sitemap, "utf8"),
  writeFile(resolve(root, "public/robots.txt"), robots, "utf8"),
  writeFile(resolve(root, "public/llms.txt"), llms, "utf8"),
]);

console.log(
  `[generate-seo] wrote sitemap.xml (${allPages.length} urls), robots.txt, llms.txt`
);
