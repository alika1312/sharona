// Per-article <title> / meta description derivation, shared by the article page
// component and by scripts/generate-seo.mjs so the emitted HTML, the sitemap and
// llms.txt never drift apart.
//
// Each article's `summary` is Sharona's own abstract — shown above the article
// and trimmed here for the meta description. An article without one falls back
// to its first paragraph. Nothing is invented.

const BRAND = "שרונה קדושאי בר-נס";
const MAX_DESC = 155;
// Above this length, appending the brand pushes the title well past what search
// results show, so the article's own title stands alone.
const MAX_TITLE_FOR_BRAND = 45;

/** Collapse runs of whitespace — JS \s covers \n and U+00A0 (&nbsp;) too. */
export const normalize = (s = "") => s.replace(/\s+/g, " ").trim();

/** Trim to `max` chars on a word boundary (never mid-word), adding an ellipsis. */
export function trimToWord(text, max = MAX_DESC) {
  const s = normalize(text);
  if (s.length <= max) return s;
  const cut = s.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[,;:.\-–—]$/, "") + "…";
}

export function articleDescription(article) {
  const first = normalize(article.summary || article.content?.[0]?.sectionFirstText || "");
  return first ? trimToWord(first) : `מאמר מאת ${BRAND} בנושא ${normalize(article.title)}.`;
}

export function articlePageTitle(article) {
  const t = normalize(article.title);
  return t.length > MAX_TITLE_FOR_BRAND ? t : `${t} | ${BRAND}`;
}
