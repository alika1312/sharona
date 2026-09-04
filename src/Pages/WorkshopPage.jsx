import { useState } from "react";
import { Link } from "react-router-dom";
import { Head } from "vite-react-ssg";
import { workshops, workshopsToCEO } from "../information/workshops";
import { useReveal } from "../hooks/useReveal";
import { kicker, h2, muted } from "../design/ui";

// Normalize the data-file image names (some lack a leading slash) to
// absolute public-root paths so they resolve on every route.
const imgSrc = (image) => (image.startsWith("/") ? image : `/${image}`);

const OrgWorkshopCard = ({ workshop, delay }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      data-reveal
      data-reveal-delay={delay}
      className="svc"
      style={{ background: "var(--color-surface)", borderRadius: 28, overflow: "hidden", boxShadow: "var(--shadow-sm)", display: "flex", flexDirection: "column", textAlign: "right" }}
    >
      {workshop.image && (
        <div style={{ height: 200, overflow: "hidden" }}>
          <img src={imgSrc(workshop.image)} alt={workshop.title.trim()} loading="lazy" decoding="async" className="washed" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      )}
      <div style={{ padding: 30, display: "flex", flexDirection: "column", flex: 1 }}>
        <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: 23, lineHeight: 1.3, margin: "0 0 14px", color: "var(--color-accent-2-800)" }}>
          {workshop.title.trim()}
        </h3>
        <p
          style={{
            margin: "0 0 20px",
            fontSize: 16.5,
            lineHeight: 1.68,
            whiteSpace: "pre-line",
            color: muted(74),
            flex: 1,
            ...(open
              ? {}
              : { display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical", overflow: "hidden" }),
          }}
        >
          {workshop.description.trim()}
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <button
            onClick={() => setOpen((v) => !v)}
            className="pill-cta"
            style={{ background: "color-mix(in srgb,var(--color-accent-2) 16%,transparent)", color: "var(--color-accent-2-800)", border: "none", cursor: "pointer", fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 15, padding: "9px 20px", borderRadius: 999 }}
          >
            {open ? "קרא/י פחות" : "קרא/י עוד"}
          </button>
          {/* Some workshops carry their own closing call-to-action. */}
          {workshop.ctaLabel && (
            <Link
              to="/#contact"
              className="pill-cta"
              style={{ background: "var(--color-accent)", color: "#fff", fontWeight: 700, fontSize: 15, padding: "9px 20px", borderRadius: 999, boxShadow: "var(--shadow-sm)" }}
            >
              {workshop.ctaLabel} ←
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

const WorkshopsPage = () => {
  const rootRef = useReveal();

  return (
    <div ref={rootRef} className="organic" style={{ overflowX: "hidden", position: "relative" }}>
      <Head>
        <html lang="he" dir="rtl" />
        <title>סדנאות – זוגיות, חמש שפות האהבה, חזון אישי ועוד | שרונה קדושאי בר-נס</title>
        <meta
          name="description"
          content="סדנאות חווייתיות בהנחיית שרונה קדושאי בר-נס: סדנה זוגית, לדבר בשפת האהבה (חמש שפות האהבה), תקשורת זוגית, חזון אישי, הילד/ה הפנימי/ת ופרשת השבוע – ליחידים, זוגות, קבוצות וארגונים."
        />
        <link rel="canonical" href="https://sharona-bar-nes.com/workshops/" />
        <meta property="og:title" content="סדנאות – שרונה קדושאי בר-נס" />
        <meta
          property="og:description"
          content="סדנאות חווייתיות לזוגות, יחידים, קבוצות וארגונים – כלים מעשיים לתקשורת, קרבה וצמיחה."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://sharona-bar-nes.com/workshops/" />
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
          <div data-reveal style={{ ...kicker, marginInline: "auto" }}>ללמוד, לחוות, לצמוח</div>
          <h1 data-reveal data-reveal-delay="120" className="org-h1" style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: 58, lineHeight: 1.12, margin: "0 0 20px" }}>
            סדנאות
          </h1>
          <p data-reveal data-reveal-delay="220" style={{ fontSize: 19, lineHeight: 1.7, margin: 0, color: muted(74) }}>
            סדנאות חווייתיות ומעשיות ליחידים, זוגות, קבוצות וארגונים — כלים לתקשורת, לקרבה ולצמיחה אישית.
          </p>
        </div>
      </section>

      {/* ============ WORKSHOPS ============ */}
      <section className="org-section" style={{ padding: "96px 54px", background: "var(--color-bg)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: 44 }}>
            <div data-reveal style={kicker}>ליחידים, זוגות וקבוצות</div>
            <h2 data-reveal data-reveal-delay="120" className="org-h2" style={h2}>הסדנאות שלי</h2>
          </div>
          <div className="org-services-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 26 }}>
            {workshops.map((w, i) => (
              <OrgWorkshopCard key={`w-${i}`} workshop={w} delay={(i % 3) * 120} />
            ))}
          </div>
        </div>
      </section>

      {/* ============ CEO WORKSHOPS ============ */}
      <section className="org-section" style={{ padding: "96px 54px", background: "var(--color-surface)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: 44 }}>
            <div data-reveal style={kicker}>לארגונים ולמנהלים</div>
            <h2 data-reveal data-reveal-delay="120" className="org-h2" style={h2}>סדנאות למנהלים ולארגונים</h2>
          </div>
          <div className="org-services-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 26 }}>
            {workshopsToCEO.map((w, i) => (
              <OrgWorkshopCard key={`ceo-${i}`} workshop={w} delay={(i % 3) * 120} />
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA BAND ============ */}
      <section className="org-section" style={{ padding: "96px 54px", background: "var(--color-accent-2-800)", color: "var(--color-bg)", textAlign: "center" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <h2 data-reveal className="org-h2" style={{ ...h2, fontSize: 40, marginBottom: 18 }}>רוצים לארגן סדנה?</h2>
          <p data-reveal data-reveal-delay="120" style={{ fontSize: 18.5, lineHeight: 1.7, margin: "0 0 30px", color: "color-mix(in srgb,#fff 78%,transparent)" }}>
            הסדנאות מותאמות לקבוצה, לזוג או לארגון שלכם. דברו איתי ונתאים יחד את התוכן והמסגרת.
          </p>
          <Link to="/#contact" data-reveal data-reveal-delay="220" className="pill-cta" style={{ background: "var(--color-accent)", color: "#fff", fontWeight: 700, fontSize: 18, padding: "16px 38px", borderRadius: 999, boxShadow: "var(--shadow-md)", display: "inline-block" }}>
            לתיאום ולפרטים ←
          </Link>
        </div>
      </section>
    </div>
  );
};

export default WorkshopsPage;
