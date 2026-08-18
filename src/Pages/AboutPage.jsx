import { Link } from "react-router-dom";
import { Head } from "vite-react-ssg";
import { aboutInformation } from "../information/information";
import { useReveal } from "../hooks/useReveal";
import { kicker, h2, muted } from "../design/ui";

const education = [
  "בעלת תואר שני בייעוץ חינוכי, אוניברסיטת בר אילן",
  "בעלת תואר שני נוסף במנהל עסקים MBA, אוניברסיטת בר אילן",
  "בוגרת בית הספר למנהיגות חינוכית של קרן מנדל ישראל",
  "בוגרת קורס דירקטורים, המכללה למנהל",
];

const trainings =
  "דמיון מודרך ככלי טיפולי, אקסס בארס, 'היפנותרפיה - בדגש על טיפול בטראומה', 'טיפול בטראומה בדינמיקה זוגית', ריפוי הילד הפנימי, זיכרונות ילדות";

const details = [
  ["שעות פעילות", "בוקר / צהריים / ערב — בתיאום מראש"],
  [
    "אזור הטיפול",
    "אזור ירושלים / הרי ירושלים / מבשרת ציון / צור הדסה / בית שמש / גוש עציון",
  ],
  ["זום / מפגש דיגיטלי", "ניסיון רב בטיפולים בזום ואונליין מרחבי הארץ ומחוץ לישראל"],
  ["כתובת הקליניקה", "צור הדסה (אפשרי לשלב עם מפגשים אונליין / בזום)"],
  ["נגישות", "חניה צמודה / סמוך לתחבורה ציבורית"],
  ["אוכלוסיית יעד", "חילונים / דתיים / חרדים"],
  ["במקרים מיוחדים", "הגעה לבית הזוג, בתשלום נוסף"],
];

const aboutParas = aboutInformation
  .split("\n")
  .map((s) => s.trim())
  .filter(Boolean);

function AboutPage() {
  const rootRef = useReveal();

  return (
    <div ref={rootRef} className="organic" style={{ overflowX: "hidden", position: "relative" }}>
      <Head>
        <html lang="he" dir="rtl" />
        <title>קצת עליי – שרונה קדושאי בר-נס | השכלה, הכשרות וגישה טיפולית</title>
        <meta
          name="description"
          content="על שרונה קדושאי בר-נס: תואר שני בייעוץ חינוכי ו-MBA, בוגרת קרן מנדל, כ-20 שנות ניסיון. גישה הוליסטית ומעשית לטיפול קצר מועד ליחידים, זוגות וקבוצות – בעברית ובאנגלית."
        />
        <link rel="canonical" href="https://sharona-bar-nes.com/about/" />
        <meta property="og:title" content="קצת עליי – שרונה קדושאי בר-נס" />
        <meta
          property="og:description"
          content="השכלה, הכשרות והאני מאמין הטיפולי של שרונה קדושאי בר-נס."
        />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content="https://sharona-bar-nes.com/about/" />
      </Head>

      {/* ============ INTRO ============ */}
      <section
        className="org-section"
        style={{
          position: "relative",
          padding: "90px 54px 110px",
          background: "linear-gradient(155deg,#f5ecdb 0%,#eef0e0 55%,#f1ecdc 100%)",
          overflow: "hidden",
        }}
      >
        <div
          className="org-about"
          style={{ position: "relative", maxWidth: 1200, margin: "0 auto", display: "flex", gap: 70, alignItems: "center" }}
        >
          <div style={{ flex: 0.9, display: "flex", justifyContent: "center" }}>
            <div data-reveal className="org-portrait" style={{ width: 400, height: 480, borderRadius: "52% 48% 46% 54%/58% 56% 44% 42%", overflow: "hidden", boxShadow: "var(--shadow-lg)", animation: "floaty 10s ease-in-out infinite" }}>
              <img src="/sharona.jpeg" alt="שרונה קדושאי בר-נס, יועצת ומטפלת רגשית" width="400" height="480" fetchpriority="high" decoding="async" className="washed" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          </div>
          <div style={{ flex: 1.1 }}>
            <div data-reveal style={kicker}>קצת עליי</div>
            <h1 className="org-h1" style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: 56, lineHeight: 1.12, margin: "0 0 26px" }}>
              <span data-reveal style={{ display: "block" }}>שרונה קדושאי בר-נס</span>
              <span data-reveal data-reveal-delay="120" style={{ display: "block", fontSize: 30, color: "var(--color-accent-2-700)", marginTop: 8 }}>
                יועצת ומטפלת רגשית
              </span>
            </h1>
            {aboutParas.map((p, i) => (
              <p key={i} data-reveal data-reveal-delay={160 + i * 60} style={{ fontSize: 18.5, lineHeight: 1.72, margin: "0 0 18px", color: muted(80) }}>
                {p}
              </p>
            ))}
            <div data-reveal data-reveal-delay="420" style={{ marginTop: 14 }}>
              <Link to="/#contact" className="pill-cta" style={{ background: "var(--color-accent-2)", color: "var(--color-bg)", fontWeight: 700, fontSize: 17, padding: "15px 32px", borderRadius: 999, boxShadow: "var(--shadow-md)", display: "inline-block" }}>
                בואו נדבר ←
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CREDENTIALS + DETAILS ============ */}
      <section className="org-section" style={{ padding: "110px 54px", background: "var(--color-bg)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: 52, maxWidth: "40ch" }}>
            <div data-reveal style={kicker}>רקע מקצועי</div>
            <h2 data-reveal data-reveal-delay="120" className="org-h2" style={h2}>השכלה, הכשרות ופרטים מקצועיים</h2>
          </div>
          <div className="org-services-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 26, alignItems: "start" }}>
            {/* education card */}
            <div data-reveal style={{ background: "var(--color-surface)", borderRadius: 28, padding: 38, boxShadow: "var(--shadow-sm)" }}>
              <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: 26, margin: "0 0 22px", color: "var(--color-accent-2-800)" }}>
                השכלה אקדמית והכשרות
              </h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 14 }}>
                {education.map((e) => (
                  <li key={e} style={{ display: "flex", gap: 12, fontSize: 17.5, lineHeight: 1.6, color: muted(82) }}>
                    <span style={{ color: "var(--color-accent)", flex: "none" }}>✦</span>
                    <span>{e}</span>
                  </li>
                ))}
              </ul>
              <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1.5px solid color-mix(in srgb,var(--color-text) 12%,transparent)" }}>
                <div style={{ fontWeight: 700, color: "var(--color-accent-2-800)", marginBottom: 8 }}>הכשרות נוספות:</div>
                <p style={{ margin: 0, fontSize: 17, lineHeight: 1.66, color: muted(74) }}>{trainings}</p>
              </div>
            </div>
            {/* details card */}
            <div data-reveal data-reveal-delay="140" style={{ background: "var(--color-surface)", borderRadius: 28, padding: 38, boxShadow: "var(--shadow-sm)" }}>
              <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: 26, margin: "0 0 22px", color: "var(--color-accent-2-800)" }}>
                פרטים מקצועיים
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {details.map(([label, value]) => (
                  <div key={label} style={{ fontSize: 17, lineHeight: 1.6 }}>
                    <span style={{ fontWeight: 700, color: "var(--color-accent-2-800)" }}>{label}: </span>
                    <span style={{ color: muted(78) }}>{value}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 26, display: "flex", gap: 34, flexWrap: "wrap", paddingTop: 22, borderTop: "1.5px solid color-mix(in srgb,var(--color-text) 12%,transparent)" }}>
                <div>
                  <div style={{ fontFamily: "var(--font-heading)", fontSize: 40, color: "var(--color-accent-2-700)", lineHeight: 1 }}>
                    <span data-count="20" data-suffix="+">20+</span>
                  </div>
                  <div style={{ fontSize: 14.5, color: muted(62), marginTop: 6 }}>שנות ניסיון</div>
                </div>
                <div>
                  <div style={{ fontFamily: "var(--font-heading)", fontSize: 24, color: "var(--color-accent-2-700)", lineHeight: 1.2 }}>עברית · אנגלית</div>
                  <div style={{ fontSize: 14.5, color: muted(62), marginTop: 6 }}>שפות הטיפול</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CTA BAND ============ */}
      <section className="org-section" style={{ padding: "96px 54px", background: "var(--color-accent-2-800)", color: "var(--color-bg)", textAlign: "center" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <h2 data-reveal className="org-h2" style={{ ...h2, fontSize: 40, marginBottom: 18 }}>מרגישים שזה הזמן להתחיל?</h2>
          <p data-reveal data-reveal-delay="120" style={{ fontSize: 18.5, lineHeight: 1.7, margin: "0 0 30px", color: "color-mix(in srgb,#fff 78%,transparent)" }}>
            אשמח להכיר, לשמוע מה מביא אתכם, ולראות יחד אם הדרך מתאימה — ללא התחייבות.
          </p>
          <Link to="/#contact" data-reveal data-reveal-delay="220" className="pill-cta" style={{ background: "var(--color-accent)", color: "#fff", fontWeight: 700, fontSize: 18, padding: "16px 38px", borderRadius: 999, boxShadow: "var(--shadow-md)", display: "inline-block" }}>
            לתיאום פגישת היכרות ←
          </Link>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
