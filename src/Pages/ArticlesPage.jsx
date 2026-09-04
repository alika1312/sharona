import { Link } from "react-router-dom";
import { Head } from "vite-react-ssg";
import { articles } from "../information/articles";
import { useReveal } from "../hooks/useReveal";
import { kicker, muted } from "../design/ui";

const preview = (article) => {
  const first = article.content?.[0]?.sectionFirstText || "";
  return first.trim().slice(0, 150);
};

export const ArticlesPage = () => {
  const rootRef = useReveal();

  return (
    <div ref={rootRef} className="organic" style={{ overflowX: "hidden", position: "relative" }}>
      <Head>
        <html lang="he" dir="rtl" />
        <title>מאמרים – התמודדות עם משבר, זוגיות, גירושין ואובדן | שרונה קדושאי בר-נס</title>
        <meta
          name="description"
          content="מאמרים מאת שרונה קדושאי בר-נס בנושאי התמודדות עם משבר וטראומה, טראומות ילדות והשפעתן על הזוגיות, חירות פנימית, ייעוץ קריירה, גירושין בכבוד הדדי ואבל ואובדן."
        />
        <link rel="canonical" href="https://sharona-bar-nes.com/articles/" />
        <meta property="og:title" content="מאמרים – שרונה קדושאי בר-נס" />
        <meta
          property="og:description"
          content="מאמרים בנושאי משבר, טראומה, זוגיות, גירושין, אובדן וצמיחה אישית."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://sharona-bar-nes.com/articles/" />
      </Head>

      {/* ============ HEADER ============ */}
      <section
        className="org-section"
        style={{
          position: "relative",
          padding: "84px 54px 70px",
          background: "linear-gradient(155deg,#f5ecdb 0%,#eef0e0 55%,#f1ecdc 100%)",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div data-reveal style={{ ...kicker, marginInline: "auto" }}>קריאה והשראה</div>
          <h1 data-reveal data-reveal-delay="120" className="org-h1" style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: 58, lineHeight: 1.12, margin: "0 0 20px" }}>
            המאמרים שלי
          </h1>
          <p data-reveal data-reveal-delay="220" style={{ fontSize: 19, lineHeight: 1.7, margin: 0, color: muted(74) }}>
            מחשבות וכלים מעשיים על התמודדות, זוגיות, צמיחה ומשמעות — מתוך העבודה הטיפולית.
          </p>
        </div>
      </section>

      {/* ============ GRID ============ */}
      <section className="org-section" style={{ padding: "96px 54px", background: "var(--color-bg)" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div className="org-services-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 28 }}>
            {articles.map((article, i) => (
              <Link
                key={article.id}
                to={`/article/${article.id}`}
                data-reveal
                data-reveal-delay={(i % 2) * 120}
                className="svc"
                style={{ background: "var(--color-surface)", borderRadius: 28, overflow: "hidden", boxShadow: "var(--shadow-sm)", display: "flex", flexDirection: "column", color: "var(--color-text)" }}
              >
                <div style={{ height: 240, overflow: "hidden" }}>
                  <img src={article.image} alt={article.title} loading="lazy" decoding="async" className="washed" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ padding: 30, display: "flex", flexDirection: "column", flex: 1 }}>
                  <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: 25, lineHeight: 1.3, margin: "0 0 12px", color: "var(--color-accent-2-800)" }}>
                    {article.title}
                  </h2>
                  <p style={{ margin: "0 0 20px", fontSize: 16.5, lineHeight: 1.66, color: muted(70), flex: 1 }}>
                    {preview(article)}…
                  </p>
                  <span style={{ fontWeight: 700, fontSize: 16, color: "var(--color-accent-2-700)" }}>קרא/י עוד ←</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
