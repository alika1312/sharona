import { Head } from "vite-react-ssg";
import { useReveal } from "../hooks/useReveal";
import { kicker, muted } from "../design/ui";

const TEL = "tel:+972587250990";
const EMAIL = "sharonabar5@gmail.com";
const WHATSAPP = "https://wa.me/972587250990";

const measures = [
  "מבנה סמנטי ותקין (כותרות, אזורי תוכן וניווט) המותאם לקוראי מסך",
  "אפשרות ניווט וגלישה באמצעות מקלדת, עם סימון ברור של מיקוד (focus)",
  'קישור "דילוג לתוכן הראשי" בתחילת כל עמוד',
  "טקסט חלופי (alt) לתמונות תוכן",
  "הקפדה על ניגודיות צבעים בין טקסט לרקע",
  "התאמה למגוון גדלי מסך ומכשירים (עיצוב רספונסיבי)",
  "כיבוד העדפת המשתמש להפחתת אנימציות (prefers-reduced-motion)",
  "שפת ממשק וכיווניות מותאמות לעברית (RTL)",
];

function Section({ title, children, delay = 0 }) {
  return (
    <div data-reveal data-reveal-delay={delay} style={{ marginBottom: 34 }}>
      <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: 26, margin: "0 0 14px", color: "var(--color-accent-2-800)" }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

function AccessibilityPage() {
  const rootRef = useReveal();

  return (
    <div ref={rootRef} className="organic" style={{ overflowX: "hidden", position: "relative" }}>
      <Head>
        <html lang="he" dir="rtl" />
        <title>הצהרת נגישות | שרונה קדושאי בר-נס</title>
        <meta
          name="description"
          content="הצהרת הנגישות של אתר שרונה קדושאי בר-נס: המחויבות לנגישות, ההתאמות שבוצעו לפי תקן ישראלי 5568 (WCAG 2.0 AA) ודרכי פנייה לדיווח על בעיות נגישות."
        />
        <link rel="canonical" href="https://sharona-bar-nes.com/accessibility/" />
        <meta property="og:title" content="הצהרת נגישות | שרונה קדושאי בר-נס" />
        <meta property="og:description" content="המחויבות לנגישות, ההתאמות שבוצעו ודרכי פנייה לדיווח." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://sharona-bar-nes.com/accessibility/" />
      </Head>

      {/* ============ HEADER ============ */}
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
          <div data-reveal style={{ ...kicker, marginInline: "auto" }}>מחויבות לכלל הגולשים</div>
          <h1 data-reveal data-reveal-delay="120" className="org-h1" style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: 52, lineHeight: 1.14, margin: 0 }}>
            הצהרת נגישות
          </h1>
        </div>
      </section>

      {/* ============ CONTENT ============ */}
      <section className="org-section" style={{ padding: "70px 54px 100px", background: "var(--color-bg)" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", fontSize: 17.5, lineHeight: 1.75, color: muted(84) }}>
          <p data-reveal style={{ margin: "0 0 34px" }}>
            אתר זה שואף לאפשר שימוש נוח ונגיש לכלל הגולשים, לרבות אנשים עם מוגבלות. הושקע מאמץ
            להתאים את האתר להנחיות תקן ישראלי 5568 לנגישות תכנים באינטרנט, המבוסס על הנחיות
            WCAG 2.0 ברמת AA.
          </p>

          <Section title="מה נעשה להנגשת האתר" delay={60}>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
              {measures.map((m) => (
                <li key={m} style={{ display: "flex", gap: 12 }}>
                  <span style={{ color: "var(--color-accent)", flex: "none" }}>✓</span>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="מגבלות והמשך שיפור" delay={120}>
            <p style={{ margin: 0 }}>
              על אף מאמצינו, ייתכן שחלקים מסוימים באתר טרם הונגשו במלואם. אנו ממשיכים לפעול
              לשיפור הנגישות באופן שוטף, ומטמיעים שיפורים ככל שהם נדרשים.
            </p>
          </Section>

          <Section title="פנייה בנושאי נגישות" delay={180}>
            <p style={{ margin: "0 0 16px" }}>
              אם נתקלתם בבעיה או שיש לכם הצעה לשיפור הנגישות, נשמח שתפנו אלינו — ונעשה כמיטב
              יכולתנו לתת מענה:
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              <li>
                <strong style={{ color: "var(--color-accent-2-800)" }}>טלפון: </strong>
                <a href={TEL} style={{ color: "var(--color-accent-2-700)", fontWeight: 600 }}>058-725-0990</a>
              </li>
              <li>
                <strong style={{ color: "var(--color-accent-2-800)" }}>דוא״ל: </strong>
                <a href={`mailto:${EMAIL}`} style={{ color: "var(--color-accent-2-700)", fontWeight: 600 }}>{EMAIL}</a>
              </li>
              <li>
                <strong style={{ color: "var(--color-accent-2-800)" }}>וואטסאפ: </strong>
                <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-accent-2-700)", fontWeight: 600 }}>שליחת הודעה</a>
              </li>
            </ul>
          </Section>

          <p data-reveal data-reveal-delay="220" style={{ margin: "40px 0 0", fontSize: 15, color: muted(60) }}>
            הצהרת הנגישות עודכנה לאחרונה באוגוסט 2026.
          </p>
        </div>
      </section>
    </div>
  );
}

export default AccessibilityPage;
