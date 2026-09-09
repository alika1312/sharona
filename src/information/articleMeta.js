// Per-article <title> / meta description derivation, shared by the article page
// component and by scripts/generate-seo.mjs so the emitted HTML, the sitemap and
// llms.txt never drift apart.
//
// NOTE: the `description` field inside articles.js is NOT used — in the existing
// data it is duplicated across articles (#1/#4 and #5/#6 share one string) and
// two of them describe a different topic than the article. `abstract` is the
// per-article summary Sharona wrote herself (it also renders above the article
// body), so it is preferred; where it is missing we fall back to trimming the
// article's own first paragraph. Nothing is invented.

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
  const source =
    normalize(article.abstract || "") ||
    normalize(article.content?.[0]?.sectionFirstText || "");
  return source ? trimToWord(source) : `מאמר מאת ${BRAND} בנושא ${normalize(article.title)}.`;
}

export function articlePageTitle(article) {
  const t = normalize(article.title);
  return t.length > MAX_TITLE_FOR_BRAND ? t : `${t} | ${BRAND}`;
}
