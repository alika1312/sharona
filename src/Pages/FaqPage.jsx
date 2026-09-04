import { Head } from "vite-react-ssg";
import { Link } from "react-router-dom";
import { faqsByCategory, faqSchema } from "../information/faq";
import FaqAccordion from "../components/FaqAccordion";
import ShareLinks from "../components/ShareLinks";
import { useReveal } from "../hooks/useReveal";
import { kicker, h2, muted } from "../design/ui";
import { trackWhatsappClick, trackClickToCall } from "../lib/analytics";

const URL = "https://sharona-bar-nes.com/faq/";
const TITLE = "שאלות נפוצות | טיפול רגשי, ייעוץ זוגי והדרכת הורים – שרונה קדושאי בר-נס";
const DESC =
  "תשובות לשאלות הנפוצות לפני שמתחילים: טיפול וייעוץ זוגי, טיפול רגשי אישי, חרדה וטראומה, הדרכת הורים, ליווי אונליין לישראלים בחו״ל, תהליך הטיפול ופרטים מעשיים — קליניקה בצור הדסה ואונליין.";

const WHATSAPP = "https://wa.me/972587250990";
const TEL = "tel:+972587250990";

function FaqPage() {
  const rootRef = useReveal();

  return (
    <div ref={rootRef} className="organic" style={{ overflowX: "hidden", position: "relative" }}>
      <Head>
        <html lang="he" dir="rtl" />
        <title>{TITLE}</title>
        <meta name="description" content={DESC} />
        <link rel="canonical" href={URL} />
        <meta property="og:title" content={TITLE} />
        <meta
          property="og:description"
          content="תשובות לשאלות הנפוצות: טיפול זוגי, טיפול רגשי, חרדה וטראומה, הדרכת הורים, ליווי אונליין לישראלים בחו״ל ופרטים מעשיים."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={URL} />
        {/* FAQPage schema lives here (the canonical FAQ page), not on the homepage. */}
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Head>

      {/* ============ HEADER ============ */}
      <section
        className="org-section org-pagehead"
        style={{
          position: "relative",
          padding: "84px 54px 60px",
          background: "linear-gradient(155deg,#f5ecdb 0%,#eef0e0 55%,#f1ecdc 100%)",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div data-reveal style={{ ...kicker, marginInline: "auto" }}>שאלות נפוצות</div>
          <h1
            data-reveal
            data-reveal-delay="120"
            className="org-h1"
            style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: 52, lineHeight: 1.14, margin: 0 }}
          >
            כל מה שרציתם לדעת לפני שמתחילים
          </h1>
          <p
            data-reveal
            data-reveal-delay="220"
            style={{ fontSize: 19, lineHeight: 1.7, margin: "26px auto 0", maxWidth: "46ch", color: muted(74) }}
          >
            ריכזתי כאן את השאלות שאני נשאלת הכי הרבה. לא מצאתם תשובה? אני מוזמנת אתכם לפנות
            אליי — בטלפון, בוואטסאפ או בטופס, ואשמח לענות.
          </p>
        </div>
      </section>

      {/* ============ QUESTIONS ============ */}
      <section className="org-section" style={{ padding: "80px 54px 40px", background: "var(--color-bg)" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          {/* One block per subject: the category is the h2, its questions the h3s. */}
          {faqsByCategory.map((group, i) => (
            <div key={group.name} style={{ marginTop: i === 0 ? 0 : 56 }}>
              <h2
                data-reveal
                className="org-h2"
                style={{ ...h2, fontSize: 30, margin: "0 0 20px" }}
              >
                {group.name}
              </h2>
              <FaqAccordion items={group.items} headingLevel={3} />
            </div>
          ))}

          <div data-reveal style={{ marginTop: 48 }}>
            <ShareLinks url={URL} title="שאלות נפוצות – שרונה קדושאי בר-נס" label="שיתוף העמוד:" />
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section
        className="org-section"
        style={{ padding: "80px 54px 110px", background: "var(--color-surface)" }}
      >
        <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center" }}>
          <h2 data-reveal className="org-h2" style={{ ...h2, fontSize: 40, margin: "0 0 18px" }}>
            נשארה שאלה? בואו נדבר.
          </h2>
          <p data-reveal data-reveal-delay="120" style={{ fontSize: 18, lineHeight: 1.7, margin: "0 auto 30px", maxWidth: "42ch", color: muted(74) }}>
            שיחת היכרות קצרה, ללא התחייבות, כדי לראות יחד אם הדרך מתאימה לכם.
          </p>
          <div
            data-reveal
            data-reveal-delay="220"
            style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}
          >
            <Link
              to="/#contact"
              className="pill-cta"
              style={{ background: "var(--color-accent-2)", color: "var(--color-bg)", fontWeight: 700, fontSize: 17, padding: "16px 32px", borderRadius: 999, boxShadow: "var(--shadow-md)" }}
            >
              לטופס יצירת קשר ←
            </Link>
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsappClick("faq_cta")}
              className="share-btn"
              style={{ minHeight: 52, padding: "16px 28px", fontSize: 17 }}
            >
              שיחה בוואטסאפ
            </a>
            <a
              href={TEL}
              onClick={() => trackClickToCall("faq_cta")}
              className="share-btn"
              style={{ minHeight: 52, padding: "16px 28px", fontSize: 17 }}
            >
              058-725-0990
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default FaqPage;
