import { useState } from "react";
import { Link } from "react-router-dom";
import { Head } from "vite-react-ssg";
import { workshops } from "../information/workshops";
import { useReveal } from "../hooks/useReveal";
import { kicker, h2, muted } from "../design/ui";
import { SITE } from "../information/contact";

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
        // The images range from tall (the compass) to wide, and some carry
        // their own text — so the whole image is shown, never cropped. A
        // blurred copy of it fills whatever the frame has left over. An image
        // too tall for that (`imageCrop`) fills the frame around its subject.
        <div style={{ position: "relative", aspectRatio: "4 / 3", overflow: "hidden", background: "var(--color-bg)" }}>
          <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: `url(${workshop.image})`, backgroundSize: "cover", backgroundPosition: "center", filter: "blur(22px) saturate(.9)", transform: "scale(1.2)", opacity: 0.55 }} />
          <img src={workshop.image} alt={workshop.title.trim()} loading="lazy" decoding="async" className="washed" style={{ position: "relative", width: "100%", height: "100%", objectFit: workshop.imageCrop ? "cover" : "contain", objectPosition: workshop.imageCrop || "center" }} />
        </div>
      )}
      <div style={{ padding: 30, display: "flex", flexDirection: "column", flex: 1 }}>
        <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: 23, lineHeight: 1.3, margin: "0 0 14px", color: "var(--color-accent-2-800)" }}>
          {workshop.title.trim()}
        </h3>
        {/* Closed: Sharona's short summary and the who / how-long line.
            Open: the full write-up — which stays in the HTML while closed
            (just hidden), so search engines still read it. */}
        <div style={{ flex: 1, margin: "0 0 20px" }}>
          <p hidden={open} style={{ margin: 0, fontSize: 16.5, lineHeight: 1.68, color: muted(74) }}>
            {workshop.summary}
          </p>
          {workshop.meta && (
            <p hidden={open} style={{ margin: "14px 0 0", fontSize: 15, fontWeight: 700, lineHeight: 1.5, color: "var(--color-accent-2-700)" }}>
              {workshop.meta}
            </p>
          )}
          <p hidden={!open} style={{ margin: 0, fontSize: 16.5, lineHeight: 1.68, whiteSpace: "pre-line", color: muted(74) }}>
            {workshop.description.trim()}
          </p>
        </div>
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
        <title>סדנאות ומפגשים חווייתיים – זוגיות, אמא שבתוכי, הילדה הפנימית ועוד | שרונה קדושאי בר-נס</title>
        <meta
          name="description"
          content="סדנאות ומפגשים חווייתיים בהנחיית שרונה קדושאי בר-נס: בשפת אהבה נדבר (חמש שפות האהבה), לדבר, להקשיב, להתקרב – תקשורת זוגית, אמא שבתוכי, הילדה הפנימית, חזון אישי ופרשת השבוע – הרצאות וסדנאות לזוגות ולקבוצות."
        />
        <link rel="canonical" href={`${SITE}/workshops/`} />
        <meta property="og:title" content="סדנאות – שרונה קדושאי בר-נס" />
        <meta
          property="og:description"
          content="סדנאות ומפגשים חווייתיים | הרצאות וסדנאות לקבוצות – כלים מעשיים לתקשורת, קרבה וצמיחה."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE}/workshops/`} />
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
            סדנאות ומפגשים חווייתיים | הרצאות וסדנאות לקבוצות
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

      {/* ============ CTA BAND ============ */}
      <section className="org-section" style={{ padding: "96px 54px", background: "var(--color-accent-2-800)", color: "var(--color-bg)", textAlign: "center" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <h2 data-reveal className="org-h2" style={{ ...h2, fontSize: 40, marginBottom: 18 }}>רוצים לארגן סדנה?</h2>
          <p data-reveal data-reveal-delay="120" style={{ fontSize: 18.5, lineHeight: 1.7, margin: "0 0 30px", color: "color-mix(in srgb,#fff 78%,transparent)" }}>
            הסדנאות מותאמות לקבוצה או לזוג שלכם. דברו איתי ונתאים יחד את התוכן והמסגרת.
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
