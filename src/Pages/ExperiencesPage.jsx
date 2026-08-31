import { Link } from "react-router-dom";
import { Head } from "vite-react-ssg";
import { experiences } from "../information/experiences";
import { useReveal } from "../hooks/useReveal";
import { kicker, h2, muted } from "../design/ui";

export const ExperiencesPage = () => {
  const rootRef = useReveal();

  return (
    <div ref={rootRef} className="organic" style={{ overflowX: "hidden", position: "relative" }}>
      <Head>
        <html lang="he" dir="rtl" />
        <title>תחומי המומחיות שלי – טיפול רגשי, זוגי, טראומה והדרכת הורים</title>
        <meta
          name="description"
          content="תחומי המומחיות של שרונה קדושאי בר-נס: טיפול במצבי משבר ולחץ, ייעוץ וטיפול זוגי, הדרכת הורים, גירושין בכבוד הדדי, טיפול בטראומה, ייעוץ תעסוקתי, ליווי מנהלים וייעוץ אונליין לישראלים בחו״ל."
        />
        <link rel="canonical" href="https://sharona-bar-nes.com/experiences/" />
        <meta property="og:title" content="תחומי המומחיות שלי – שרונה קדושאי בר-נס" />
        <meta
          property="og:description"
          content="טיפול רגשי, זוגי, טראומה, הדרכת הורים, ייעוץ תעסוקתי, ליווי מנהלים וייעוץ אונליין לישראלים בחו״ל."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://sharona-bar-nes.com/experiences/" />
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
          <div data-reveal style={{ ...kicker, marginInline: "auto" }}>תחומי הטיפול</div>
          <h1 data-reveal data-reveal-delay="120" className="org-h1" style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: 58, lineHeight: 1.12, margin: "0 0 20px" }}>
            תחומי המומחיות שלי
          </h1>
          <p data-reveal data-reveal-delay="220" style={{ fontSize: 19, lineHeight: 1.7, margin: 0, color: muted(74) }}>
            טיפול המותאם אישית לצרכים שלכם — מתוך ראייה הוליסטית, רגישות רבה וגישה מעשית.
          </p>
        </div>
      </section>

      {/* ============ AREAS ============ */}
      <section className="org-section" style={{ padding: "96px 54px", background: "var(--color-bg)" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", display: "flex", flexDirection: "column", gap: 64 }}>
          {experiences.map((exp, index) => {
            const flip = index % 2 === 1;
            return (
              <div
                key={exp.id}
                className="org-about"
                style={{ display: "flex", gap: 52, alignItems: "center", flexDirection: flip ? "row-reverse" : "row" }}
              >
                <div style={{ flex: 0.82, display: "flex", justifyContent: "center" }}>
                  <div data-reveal data-parallax={flip ? "0.05" : "0.08"} className="gitem" style={{ width: "100%", maxWidth: 360, aspectRatio: "1/1", borderRadius: index % 3 === 0 ? "48% 52% 55% 45%/56% 46% 54% 44%" : 30, overflow: "hidden", boxShadow: "var(--shadow-md)" }}>
                    <img src={exp.image} alt={exp.title.trim()} loading="lazy" decoding="async" className="washed" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                </div>
                <div style={{ flex: 1.18 }}>
                  <div data-reveal style={{ display: "inline-block", fontFamily: "var(--font-heading)", fontSize: 22, color: "var(--color-accent-2-300)", marginBottom: 6 }}>
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <h2 data-reveal data-reveal-delay="80" style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: 30, lineHeight: 1.25, margin: "0 0 18px", color: "var(--color-accent-2-800)" }}>
                    {exp.title.trim()}
                  </h2>
                  <p data-reveal data-reveal-delay="160" style={{ fontSize: 17, lineHeight: 1.75, margin: 0, whiteSpace: "pre-line", color: muted(78) }}>
                    {exp.description.trim()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============ CTA BAND ============ */}
      <section className="org-section" style={{ padding: "96px 54px", background: "var(--color-accent-2-800)", color: "var(--color-bg)", textAlign: "center" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <h2 data-reveal className="org-h2" style={{ ...h2, fontSize: 40, marginBottom: 18 }}>לא בטוחים מה מתאים לכם?</h2>
          <p data-reveal data-reveal-delay="120" style={{ fontSize: 18.5, lineHeight: 1.7, margin: "0 0 30px", color: "color-mix(in srgb,#fff 78%,transparent)" }}>
            נשמח לשוחח, להבין מה מביא אתכם ולמצוא יחד את הדרך הנכונה עבורכם.
          </p>
          <Link to="/#contact" data-reveal data-reveal-delay="220" className="pill-cta" style={{ background: "var(--color-accent)", color: "#fff", fontWeight: 700, fontSize: 18, padding: "16px 38px", borderRadius: 999, boxShadow: "var(--shadow-md)", display: "inline-block" }}>
            בואו נדבר ←
          </Link>
        </div>
      </section>
    </div>
  );
};
