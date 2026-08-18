import { Link, useParams } from "react-router-dom";
import { Head } from "vite-react-ssg";
import { articles } from "../information/articles";
import { articleDescription, articlePageTitle, normalize } from "../information/articleMeta";
import ShareLinks from "../components/ShareLinks";
import { useReveal } from "../hooks/useReveal";
import { muted } from "../design/ui";

export const ArticlePage = () => {
  const rootRef = useReveal();
  const { id } = useParams();
  const article = articles.find((a) => a.id.toString() === id);

  if (!article) {
    return (
      <div className="organic" style={{ padding: "120px 54px", textAlign: "center", background: "var(--color-bg)" }}>
        <p style={{ fontFamily: "var(--font-heading)", fontSize: 28 }}>המאמר לא נמצא</p>
        <Link to="/articles" style={{ color: "var(--color-accent-2-700)", fontWeight: 700 }}>חזרה למאמרים ←</Link>
      </div>
    );
  }

  const { title, image, content } = article;

  // First paragraph, trimmed on a word boundary (see articleMeta.js for why).
  const description = articleDescription(article);
  const pageTitle = articlePageTitle(article);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: normalize(title),
    description,
    ...(image ? { image: `https://sharona-bar-nes.com${image}` } : {}),
    inLanguage: "he",
    author: {
      "@type": "Person",
      name: "שרונה קדושאי בר-נס",
      url: "https://sharona-bar-nes.com/",
    },
    publisher: { "@type": "Person", name: "שרונה קדושאי בר-נס" },
    mainEntityOfPage: `https://sharona-bar-nes.com/article/${article.id}/`,
  };

  return (
    <div ref={rootRef} className="organic" style={{ overflowX: "hidden", position: "relative" }}>
      {/* SEO Tags (per article) */}
      <Head>
        <html lang="he" dir="rtl" />
        <title>{pageTitle}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={`https://sharona-bar-nes.com/article/${article.id}/`} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://sharona-bar-nes.com/article/${article.id}/`} />
        {image ? <meta property="og:image" content={`https://sharona-bar-nes.com${image}`} /> : null}
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
      </Head>

      {/* ============ HERO ============ */}
      <section className="org-section" style={{ position: "relative", padding: "0 54px", background: "var(--color-bg)" }}>
        <div style={{ position: "relative", maxWidth: 980, margin: "0 auto" }}>
          <div style={{ position: "relative", height: 380, borderRadius: "0 0 34px 34px", overflow: "hidden", boxShadow: "var(--shadow-md)" }}>
            <img src={image} alt={title} fetchpriority="high" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(39,46,27,.82),rgba(39,46,27,.12))" }} />
            <div style={{ position: "absolute", insetInlineStart: 0, insetInlineEnd: 0, bottom: 0, padding: "34px 40px" }}>
              {article.readTime && (
                <div style={{ fontSize: 14, color: "var(--color-accent-300)", marginBottom: 10, fontWeight: 600 }}>
                  🕒 {article.readTime}
                </div>
              )}
              <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: 40, lineHeight: 1.2, margin: 0, color: "#fff" }}>
                {title}
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* ============ BODY ============ */}
      <section className="org-section" style={{ padding: "70px 54px 100px", background: "var(--color-bg)" }}>
        <article style={{ maxWidth: 760, margin: "0 auto" }}>
          {content.map((section, index) => (
            <div key={index} data-reveal data-reveal-delay={Math.min(index, 3) * 90} style={{ marginBottom: 40 }}>
              {section.sectionTitle && (
                <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: 27, lineHeight: 1.3, margin: "0 0 16px", color: "var(--color-accent-2-800)" }}>
                  {section.sectionTitle}
                </h2>
              )}
              {section.sectionFirstText && (
                <p style={{ fontSize: 18, lineHeight: 1.8, margin: "0 0 16px", whiteSpace: "pre-line", color: muted(84) }}>
                  {section.sectionFirstText}
                </p>
              )}
              {section.sectionSecondText && (
                <p style={{ fontSize: 18, lineHeight: 1.8, margin: 0, whiteSpace: "pre-line", color: muted(84) }}>
                  {section.sectionSecondText}
                </p>
              )}
            </div>
          ))}

          {/* share / send this article */}
          <div style={{ marginTop: 50, paddingTop: 30, borderTop: "1.5px solid color-mix(in srgb,var(--color-text) 12%,transparent)" }}>
            <ShareLinks
              url={`https://sharona-bar-nes.com/article/${article.id}/`}
              title={title}
              label="שיתוף המאמר:"
            />
          </div>

          <div style={{ marginTop: 34, display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
            <Link to="/articles" style={{ fontWeight: 700, fontSize: 16, color: "var(--color-accent-2-700)" }}>
              → חזרה לכל המאמרים
            </Link>
            <Link to="/#contact" className="pill-cta" style={{ marginInlineStart: "auto", background: "var(--color-accent-2)", color: "var(--color-bg)", fontWeight: 700, fontSize: 16, padding: "13px 28px", borderRadius: 999, boxShadow: "var(--shadow-sm)" }}>
              לתיאום פגישה ←
            </Link>
          </div>
        </article>
      </section>
    </div>
  );
};
