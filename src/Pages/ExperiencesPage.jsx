import { Link } from "react-router-dom";
import { Head } from "vite-react-ssg";
import { experiences, onlineTherapy } from "../information/experiences";
import { useReveal } from "../hooks/useReveal";
import { h2, muted } from "../design/ui";
import { SITE } from "../information/contact";

export const ExperiencesPage = () => {
  const rootRef = useReveal();

  return (
    <div ref={rootRef} className="organic" style={{ overflowX: "hidden", position: "relative" }}>
      <Head>
        <html lang="he" dir="rtl" />
        <title>תחומי הטיפול – טיפול רגשי, זוגי, טראומה והדרכת הורים | שרונה קדושאי בר-נס</title>
        <meta
          name="description"
          content="תחומי הטיפול של שרונה קדושאי בר-נס: טיפול רגשי, ייעוץ וטיפול זוגי, טיפול בטראומה, הדרכת הורים, גירושין בכבוד הדדי וייעוץ והכוונה בצמתי קריירה ולימודים – בקליניקה ואונליין לישראלים בארץ ובחו״ל."
        />
        <link rel="canonical" href={`${SITE}/experiences/`} />
        <meta property="og:title" content="תחומי הטיפול – שרונה קדושאי בר-נס" />
        <meta
          property="og:description"
          content="טיפול רגשי, זוגי, טראומה, הדרכת הורים, גירושין בכבוד הדדי וצמתי קריירה ולימודים – גם אונליין לישראלים בארץ ובחו״ל."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE}/experiences/`} />
      </Head>

      {/* ============ HEADER ============ */}
      {/* one heading only — Sharona asked for no kicker or subtitle */}
      <section
        className="org-section"
        style={{
          position: "relative",
          padding: "84px 54px 60px",
          background: "linear-gradient(155deg,#f5ecdb 0%,#eef0e0 55%,#f1ecdc 100%)",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h1 data-reveal className="org-h1" style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: 58, lineHeight: 1.12, margin: 0, color: "var(--color-accent-2-800)" }}>
            תחומי הטיפול
          </h1>
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
                id={exp.slug}
                className="org-about exp-row"
                style={{ display: "flex", gap: 52, alignItems: "center", flexDirection: flip ? "row-reverse" : "row", scrollMarginTop: 110 }}
              >
                {/* kept small so the image accompanies the text rather than leading it */}
                <div style={{ flex: 0.6, display: "flex", justifyContent: "center" }}>
                  <div data-reveal data-parallax={flip ? "0.05" : "0.08"} className="gitem exp-img" style={{ width: "100%", maxWidth: 260, aspectRatio: "1/1", borderRadius: index % 3 === 0 ? "48% 52% 55% 45%/56% 46% 54% 44%" : 30, overflow: "hidden", boxShadow: "var(--shadow-md)" }}>
                    <img src={exp.image} alt={exp.title.trim()} loading="lazy" decoding="async" className="washed" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                </div>
                <div style={{ flex: 1.4 }}>
                  <div data-reveal style={{ display: "inline-block", fontFamily: "var(--font-heading)", fontSize: 22, color: "var(--color-accent-2-300)", marginBottom: 6 }}>
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <h2 data-reveal data-reveal-delay="80" style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: 30, lineHeight: 1.25, margin: "0 0 18px", color: "var(--color-accent-2-800)" }}>
                    {exp.title.trim()}
                  </h2>
                  {/* one paragraph per line; "## " lines are small subheadings */}
                  <div data-reveal data-reveal-delay="160">
                    {exp.description
                      .split("\n")
                      .map((l) => l.trim())
                      .filter(Boolean)
                      .map((l, i) =>
                        l.startsWith("## ") ? (
                          <h3 key={i} style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: 22, lineHeight: 1.3, margin: "22px 0 10px", color: "var(--color-accent-2-800)" }}>
                            {l.slice(3)}
                          </h3>
                        ) : (
                          <p key={i} style={{ fontSize: 17, lineHeight: 1.75, margin: "0 0 14px", color: muted(78) }}>
                            {l}
                          </p>
                        ),
                      )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============ ONLINE ============ */}
      {/* a way of meeting rather than another area, so it stands apart */}
      <section id={onlineTherapy.slug} className="org-section" style={{ padding: "90px 54px", background: "linear-gradient(160deg,#eef0e0,#f5ecdb)", scrollMarginTop: 80 }}>
        <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center" }}>
          <h2 data-reveal className="org-h2" style={{ ...h2, fontSize: 40, margin: "0 0 24px", color: "var(--color-accent-2-800)" }}>
            {onlineTherapy.title}
          </h2>
          {onlineTherapy.description
            .split("\n")
            .map((l) => l.trim())
            .filter(Boolean)
            .map((l, i) => (
              <p key={i} data-reveal data-reveal-delay={80 + i * 50} style={{ fontSize: 17.5, lineHeight: 1.75, margin: "0 0 14px", color: muted(80) }}>
                {l}
              </p>
            ))}
        </div>
      </section>

      {/* ============ CTA BAND ============ */}
      <section className="org-section" style={{ padding: "96px 54px", background: "var(--color-accent-2-800)", color: "var(--color-bg)", textAlign: "center" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <h2 data-reveal className="org-h2" style={{ ...h2, fontSize: 40, marginBottom: 18 }}>לא בטוחים מה מתאים לכם?</h2>
          <p data-reveal data-reveal-delay="120" style={{ fontSize: 18.5, lineHeight: 1.7, margin: "0 0 30px", color: "color-mix(in srgb,#fff 78%,transparent)" }}>
            אשמח שנשוחח, להבין מה מביא אתכם ולמצוא יחד את הדרך הנכונה עבורכם.
          </p>
          <Link to="/#contact" data-reveal data-reveal-delay="220" className="pill-cta" style={{ background: "var(--color-accent)", color: "#fff", fontWeight: 700, fontSize: 18, padding: "16px 38px", borderRadius: 999, boxShadow: "var(--shadow-md)", display: "inline-block" }}>
            בואו נדבר ←
          </Link>
        </div>
      </section>
    </div>
  );
};
