import { Head } from "vite-react-ssg";
import { useReveal } from "../hooks/useReveal";
import { kicker, muted } from "../design/ui";
import { EMAIL, PHONE_LABEL, SITE, TEL } from "../information/contact";

// Privacy notice. Israel's Privacy Protection Law (as amended by amendment
// 13, in force since 14 Aug 2025) requires telling people, where their data
// is collected, who collects it, for what purpose, whether they must provide
// it, who else receives it, and how to see and correct it. The contact form
// links here, and so does the footer.

const UPDATED = "נובמבר 2026";

function Section({ title, children }) {
  return (
    <div data-reveal style={{ marginBottom: 34 }}>
      <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: 26, margin: "0 0 14px", color: "var(--color-accent-2-800)" }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

const ul = { margin: 0, paddingInlineStart: 22, display: "flex", flexDirection: "column", gap: 8 };
const linkStyle = { color: "var(--color-accent-2-700)", fontWeight: 600, textDecoration: "underline" };

function PrivacyPage() {
  const rootRef = useReveal();

  return (
    <div ref={rootRef} className="organic" style={{ overflowX: "hidden", position: "relative" }}>
      <Head>
        <html lang="he" dir="rtl" />
        <title>מדיניות פרטיות | שרונה קדושאי בר-נס</title>
        <meta
          name="description"
          content="מדיניות הפרטיות של אתר שרונה קדושאי בר-נס: איזה מידע נאסף, למה, אצל מי הוא נשמר, עוגיות, והזכויות שלכם לפי חוק הגנת הפרטיות."
        />
        <link rel="canonical" href={`${SITE}/privacy/`} />
        <meta property="og:title" content="מדיניות פרטיות | שרונה קדושאי בר-נס" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE}/privacy/`} />
      </Head>

      <section
        className="org-section"
        style={{
          position: "relative",
          padding: "84px 54px 50px",
          background: "linear-gradient(155deg,#f5ecdb 0%,#eef0e0 55%,#f1ecdc 100%)",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div data-reveal style={{ ...kicker, marginInline: "auto" }}>השמירה על הפרטיות שלכם</div>
          <h1 data-reveal data-reveal-delay="120" className="org-h1" style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: 52, lineHeight: 1.14, margin: 0 }}>
            מדיניות פרטיות
          </h1>
        </div>
      </section>

      <section className="org-section" style={{ padding: "56px 54px 100px", background: "var(--color-bg)" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", fontSize: 17.5, lineHeight: 1.75, color: muted(84) }}>
          <p data-reveal style={{ margin: "0 0 34px" }}>
            פנייה למטפלת היא צעד אישי, ולכן חשוב לי שתדעו בדיוק מה קורה עם המידע שאתם
            משאירים באתר. המדיניות נכתבה בהתאם לחוק הגנת הפרטיות, התשמ״א-1981, ותיקוניו.
          </p>

          <Section title="מי אחראית על המידע">
            <p style={{ margin: 0 }}>
              שרונה קדושאי בר-נס, יועצת ומטפלת. ליצירת קשר בכל נושא של פרטיות:{" "}
              <a href={`mailto:${EMAIL}`} style={linkStyle}>{EMAIL}</a> או בטלפון{" "}
              <a href={TEL} style={linkStyle}>{PHONE_LABEL}</a>.
            </p>
          </Section>

          <Section title="איזה מידע נאסף ולמה">
            <ul style={ul}>
              <li>
                <strong>טופס יצירת הקשר:</strong> שם, טלפון, ואם בחרתם למסור, גם אימייל ותוכן
                ההודעה. המידע משמש אך ורק כדי לחזור אליכם ולתאם שיחה או פגישה.
              </li>
              <li>
                <strong>פנייה בוואטסאפ, בטלפון או במייל:</strong> מגיעה ישירות אליי, ובכפוף
                גם לתנאים של שירותים אלה (למשל WhatsApp ו-Gmail).
              </li>
              <li>
                <strong>נתוני גלישה:</strong> שרת האתר רושם באופן אוטומטי נתונים טכניים
                בסיסיים (כמו כתובת IP וסוג הדפדפן) לצורך תפעול ואבטחה. אם תאשרו עוגיות,
                נאסף גם מידע סטטיסטי על השימוש באתר (ראו בהמשך).
              </li>
            </ul>
          </Section>

          <Section title="האם חובה למסור את המידע?">
            <p style={{ margin: 0 }}>
              לא. אין חובה חוקית למסור פרטים, והמסירה היא בהסכמתכם. בלי שם ודרך ליצור
              איתכם קשר לא אוכל לחזור אליכם. אתם מוזמנים לכתוב רק את מה שנוח לכם, ואין
              צורך לפרט בטופס מידע רגיש. נוכל לדבר על כך בשיחה.
            </p>
          </Section>

          <Section title="למי מועבר המידע">
            <ul style={ul}>
              <li>
                הודעות מהטופס נשלחות לתיבת הדואר שלי באמצעות שירות המשלוח EmailJS, ונשמרות
                בחשבון ה-Gmail שלי.
              </li>
              <li>האתר מאוחסן אצל Vercel.</li>
              <li>
                Google Analytics, רק אם אישרתם עוגיות. הנתונים נאספים באופן סטטיסטי ולא
                כדי לזהות אתכם.
              </li>
              <li>המידע לא נמכר, לא מושכר ולא מועבר לאף גורם אחר לשימוש שלו.</li>
            </ul>
            <p style={{ margin: "12px 0 0" }}>
              חלק מהשירותים האלה מאחסנים מידע בשרתים מחוץ לישראל.
            </p>
          </Section>

          <Section title="עוגיות (Cookies)">
            <p style={{ margin: 0 }}>
              האתר עצמו לא שומר עוגיות. אם מופעלת מדידה באמצעות Google Analytics, היא פועלת
              רק אחרי שאישרתם בהודעה שמופיעה בכניסה לאתר, ואפשר לשנות את הבחירה בכל עת
              בקישור ״הגדרות עוגיות״ בתחתית העמוד. הגדרות הנגישות שבחרתם נשמרות בדפדפן שלכם
              בלבד ואינן נשלחות לאף גורם.
            </p>
          </Section>

          <Section title="שמירה ואבטחה">
            <p style={{ margin: 0 }}>
              המידע נשמר רק כל עוד הוא נחוץ למטרה שלשמה נמסר, ובאמצעים סבירים להגנה עליו.
              מידע שנמסר במסגרת הטיפול עצמו כפוף לחובת הסודיות המקצועית ואינו נשמר באתר.
            </p>
          </Section>

          <Section title="הזכויות שלכם">
            <p style={{ margin: 0 }}>
              לפי חוק הגנת הפרטיות אתם רשאים לעיין במידע שנשמר עליכם, לבקש לתקן אותו או
              לבקש למחוק אותו. אפשר לפנות אליי בכל עת במייל{" "}
              <a href={`mailto:${EMAIL}`} style={linkStyle}>{EMAIL}</a>, ואענה בהקדם.
            </p>
          </Section>

          <p data-reveal style={{ margin: "40px 0 0", fontSize: 15, color: muted(60) }}>
            המדיניות עודכנה לאחרונה ב{UPDATED}.
          </p>
        </div>
      </section>
    </div>
  );
}

export default PrivacyPage;
