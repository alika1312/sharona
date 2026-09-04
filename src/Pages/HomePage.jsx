import { useEffect, useRef, useState, useId } from "react";
import { Head } from "vite-react-ssg";
import { Link } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { aboutInformation, testimonials } from "../information/information";
import { faqs } from "../information/faq";
import { createHomeMotion } from "../design/motion";
import {
  trackContactFormSubmit,
  trackWhatsappClick,
  trackClickToCall,
} from "../lib/analytics";

const WHATSAPP = "https://wa.me/972587250990";
const TEL = "tel:+972587250990";
const PHONE_LABEL = "058-725-0990";
const EMAIL = "sharonabar5@gmail.com";

const HEAD = "var(--font-heading)";

// The eight areas of work on /experiences. Workshops live on /workshops and
// are not part of this grid.
const services = [
  { icon: "❤", title: "משבר, מתח ולחץ נפשי", to: "/experiences", bg: "var(--color-accent-2-200)", text: "תמיכה בהתמודדות היומיומית, חזרה לאיזון וכלים מעשיים לצמיחה מתוך המשבר." },
  { icon: "◐", title: "ייעוץ וטיפול זוגי", to: "/experiences", bg: "var(--color-accent-200)", text: "מרחב לשיפור התקשורת, לחיזוק הקרבה והאינטימיות ולצליחת משברים בזוגיות." },
  { icon: "✦", title: "הדרכת הורים", to: "/experiences", bg: "var(--color-accent-2-300)", text: "כלים, ליווי רגשי והכוונה להורות מיטיבה ולהתמודדות עם הקשיים של ילדיכם." },
  { icon: "☾", title: "טיפול בטראומה", to: "/experiences", bg: "var(--color-accent-300)", text: "עיבוד ממוקד ורגיש של אירועים קשים, לחיזוק החוסן והחזרה לתפקוד." },
  { icon: "❋", title: "גירושין בכבוד הדדי", to: "/experiences", bg: "var(--color-accent-2-200)", text: "ליווי בתהליך פרידה מתוך כבוד, שמפחית מתחים ומאפשר הורות מיטיבה משותפת." },
  { icon: "◇", title: "כיוון תעסוקתי וקריירה", to: "/experiences", bg: "var(--color-accent-200)", text: "מיפוי נטיות וכישורים, שחרור תחושת תקיעות וליווי עד התפקיד הרצוי." },
  { icon: "◈", title: "ליווי מנהלים וייעוץ ארגוני", to: "/experiences", bg: "var(--color-accent-2-300)", text: "פיתוח מנהיגות, הובלת תהליכי שינוי וליווי בכירים בארגונים, עמותות ורשויות." },
  { icon: "◍", title: "ישראלים בחו״ל", to: "/experiences", bg: "var(--color-accent-2-200)", text: "מפגשים אונליין בעברית, בהתאמה לאזורי זמן — זוגיות, טיפול רגשי, הורות ורילוקיישן." },
];

const steps = [
  ["1", "פנייה ראשונית", "שולחים לי הודעת WhatsApp או מייל קצר עם כמה מילים על סיבת הפנייה.", "var(--color-accent-2)"],
  ["2", "שיחת היכרות קצרה", "נשוחח טלפונית, אבין באופן ראשוני את סיבת הפנייה, תוכלו לשאול אותי שאלות ונתאם פגישה בקליניקה או אונליין.", "var(--color-accent)"],
  ["3", "מתחילים לעבוד כבר בפגישה הראשונה", "נבין מה מביא אתכם ומה הייתם רוצים לשנות, נתחיל בעבודה טיפולית ונקבל כיוון ראשוני להמשך.", "var(--color-accent-2)"],
  ["4", "תהליך טיפולי ממוקד", "נשלב הבנה, מודעות ועומק עם כלים מעשיים לכאן ועכשיו ויישום בחיי היומיום.", "var(--color-accent)"],
  ["5", "לקראת סיום התהליך", "נבסס את השינוי ואת הכלים שנרכשו, כדי לאפשר המשך עצמאי ותחושת ביטחון גם לאחר סיום התהליך.", "var(--color-accent-2)"],
];

// Right-to-left, matching the RTL step order: step 1 is the rightmost disc.
// Sits on y≈46, the vertical centre of the 92px box, so it threads between
// the number discs rather than floating above them. Its box spans centre to
// centre of the outer discs (see the inset below), so the five nodes are the
// even fifths of the viewBox: 1000, 750, 500, 250, 0.
const STEP_PATH =
  "M 1000 46 C 925 -6 825 98 750 46 S 575 -6 500 46 S 325 98 250 46 S 75 -6 0 46";

const marqueeWords = ["הקשבה", "חמלה", "כבוד", "נוכחות", "אמון", "צמיחה"];

// The contact section's three beats: what happens after you press send. Not
// knowing is most of what stops people from writing in the first place.
const contactBeats = [
  ["1", "כותבים", "כמה מילים, לא יותר. גם ״לא יודע/ת מאיפה להתחיל״ זו התחלה."],
  ["2", "מדברים", "אחזור אליכם לשיחה קצרה להיכרות — ללא עלות."],
  ["3", "קובעים", "אם זה מרגיש נכון, נמצא יחד מועד שמתאים לכם."],
];

// One-tap openers for the form's message field. Choosing a topic is a smaller
// first step than facing an empty box.
const contactTopics = [
  ["זוגיות", "אנחנו זוג ורוצים לדבר על מה שקורה בינינו."],
  ["משבר או חרדה", "אני מרגיש/ה בתקופה קשה ורוצה לדבר על זה."],
  ["הורות", "אשמח להדרכה בהתמודדות עם הילדים שלי."],
  ["טראומה", "יש משהו מהעבר שאני רוצה לעבד."],
  ["מחו״ל", "אני בחו״ל ומחפש/ת טיפול בעברית באונליין."],
  ["עוד לא יודע/ת", "עוד לא בטוח/ה מה בדיוק, אבל משהו צריך להשתנות."],
];

// The real photographs of the space. Four large plates rather than six small
// tinted ones — a photo has to be big enough to actually see.
//
// x/y are percentages of the stage, d is depth: 0 is closest to the viewer
// (moves most, reacts most), 1 is furthest back. `label` is what the plate
// says once it's the one you're pointing at. Depths are kept shallow (≤0.42)
// so no photograph ever sits too far back to read.
const plates = [
  { x: -1, y: 4,  w: 430, h: 320, d: 0.12, r: "44% 56% 52% 48%/48% 44% 56% 52%", src: "/clinic-1.jpeg", label: "הפרגולה" },
  { x: 60, y: 0,  w: 450, h: 330, d: 0.34, r: 28, src: "/clinic-2.jpeg", label: "הגינה" },
  { x: 2,  y: 51, w: 420, h: 310, d: 0.42, r: 26, src: "/clinic-3.jpeg", label: "פינת הישיבה" },
  { x: 57, y: 46, w: 470, h: 345, d: 0.04, r: "52% 48% 46% 54%/44% 52% 48% 56%", src: "/clinic-4.jpeg", label: "המרחב הטיפולי" },
];

const railSections = [
  ["top", "ראשי"],
  ["about", "אודות"],
  ["approach", "הגישה"],
  ["services", "תחומי הטיפול"],
  ["gallery", "המרחב"],
  ["voices", "המלצות"],
  ["faq", "שאלות נפוצות"],
  ["contact", "צרו קשר"],
];

// Seven voices sweep in one at a time — a spread across the work (trauma,
// individual, couple, parenting, career, separation, family). Every other
// review then joins them for the carousel at the end of the section, so the
// full set is readable without leaving the homepage. `sweep: false` is what
// motion.js reads to keep the extras out of the one-at-a-time entrance.
const featuredVoiceIds = [18, 17, 2, 7, 11, 12, 16];

const voices = [
  ...featuredVoiceIds
    .map((id) => testimonials.find((t) => t.id === id))
    .filter(Boolean)
    .map((t) => ({ ...t, sweep: true })),
  ...testimonials
    .filter((t) => !featuredVoiceIds.includes(t.id))
    .map((t) => ({ ...t, sweep: false })),
];

// The full set (and the FAQPage schema) lives on /faq; the homepage stack
// holds five — grounded answers only, the same count as the design.
const homeFaqs = faqs.filter((f) => !f.todo).slice(0, 5);

// The full text lives on /about; the homepage shows the opening two beats.
const aboutLines = aboutInformation
  .split("\n")
  .map((l) => l.trim())
  .filter(Boolean)
  .slice(0, 2);

/* ------------------------------ shared bits ------------------------------ */

const kickerStyle = {
  fontSize: 14,
  fontWeight: 700,
  letterSpacing: ".14em",
  color: "var(--color-accent-2-700)",
  textTransform: "uppercase",
  marginBottom: 16,
};

const h2Style = {
  fontFamily: HEAD,
  fontWeight: 400,
  fontSize: 48,
  lineHeight: 1.18,
  margin: 0,
};

const pinInner = {
  position: "sticky",
  top: 0,
  height: "100vh",
  display: "flex",
  alignItems: "center",
  overflow: "hidden",
  padding: "0 54px",
};

function Kicker({ color, children }) {
  return (
    <div style={{ ...kickerStyle, color }}>
      {children}
    </div>
  );
}

/* ------------------------------- the page ------------------------------- */

function HomePage() {
  const rootRef = useRef(null);
  const motionRef = useRef(null);

  useEffect(() => {
    if (!rootRef.current) return;
    const m = createHomeMotion(rootRef.current, {
      motion: "full",
      snapSections: true,
      showIntro: true,
      cursorDot: true,
    });
    motionRef.current = m;
    return () => {
      m.destroy();
      motionRef.current = null;
    };
  }, []);

  return (
    <div ref={rootRef} className="organic organic-v2">
      <Head>
        <html lang="he" dir="rtl" />
        <title>שרונה קדושאי בר-נס | טיפול וייעוץ זוגי, טיפול רגשי והדרכת הורים</title>
        <meta
          name="description"
          content="שרונה קדושאי בר-נס – טיפול וייעוץ זוגי, טיפול רגשי במצבי משבר, חרדה וטראומה והדרכת הורים, לישראלים בארץ ובחו״ל. טיפול קצר מועד — בקליניקה בצור הדסה ובאזור ירושלים, ובמפגשים אונליין בעברית ובאנגלית."
        />
        <link rel="canonical" href="https://sharona-bar-nes.com/" />
        <meta property="og:title" content="שרונה קדושאי בר-נס | טיפול וייעוץ זוגי, טיפול רגשי והדרכת הורים" />
        <meta property="og:description" content="טיפול וייעוץ זוגי, טיפול רגשי במצבי משבר, טראומה והדרכת הורים – לישראלים בארץ ובחו״ל, בקליניקה בצור הדסה ובאונליין." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://sharona-bar-nes.com/" />
      </Head>

      <Filters />
      <Rail />

      {/* ================================ HERO ================================ */}
      <section
        id="top"
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          padding: "120px 54px 70px",
          background: "linear-gradient(155deg,#f5ecdb 0%,#eef0e0 55%,#f1ecdc 100%)",
          overflow: "hidden",
        }}
      >
        {/* Four circles under one SVG goo filter, so they melt together as
            they drift past each other — and lean toward the pointer. */}
        <div
          data-goo
          aria-hidden="true"
          style={{ position: "absolute", inset: "-12%", filter: "url(#goo)", opacity: 0.5, pointerEvents: "none" }}
        >
          <div data-blob data-w="1.4" style={{ position: "absolute", top: "14%", left: "4%", width: 330, height: 330, borderRadius: "50%", background: "#7a8a5e" }} />
          <div data-blob data-w="-1" style={{ position: "absolute", bottom: "6%", right: "2%", width: 290, height: 290, borderRadius: "50%", background: "#c67139" }} />
          <div data-blob data-w="2.2" style={{ position: "absolute", top: "44%", left: "40%", width: 150, height: 150, borderRadius: "50%", background: "#7a8a5e" }} />
          <div data-blob data-w="-1.8" style={{ position: "absolute", top: "8%", left: "52%", width: 110, height: 110, borderRadius: "50%", background: "#c67139" }} />
        </div>

        <div data-m="stack" style={{ position: "relative", maxWidth: 1200, margin: "0 auto", width: "100%", display: "flex", alignItems: "center", gap: 56 }}>
          <div style={{ flex: 1.08 }}>
            <div style={{ ...kickerStyle, fontSize: 15, marginBottom: 8 }}>
              טיפול וייעוץ זוגי · טיפול רגשי במצבי משבר · הדרכת הורים
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: ".04em", color: "var(--color-accent-2-700)", marginBottom: 24 }}>
              לישראלים בארץ ובחו״ל — בקליניקה ובאונליין
            </div>
            <h1 data-reveal data-reveal-delay="0" style={{ position: "relative", fontFamily: HEAD, fontWeight: 400, fontSize: "clamp(48px,6.4vw,84px)", lineHeight: 1.08, letterSpacing: "-.015em", margin: 0 }}>
              <span style={{ display: "block", paddingBottom: ".09em" }}>מרחב לנשום בו,</span>
              <span style={{ display: "block", paddingBottom: ".09em", color: "var(--color-accent-2-700)" }}>ולהתחיל מחדש.</span>
            </h1>
            <p style={{ fontSize: 21, lineHeight: 1.62, maxWidth: "44ch", margin: "30px 0 36px", color: "var(--color-text)" }}>
              לפעמים כל מה שצריך זה מקום אחד, שקט ובטוח, להניח בו את מה שכבד ולהתחיל להקשיב מחדש — לעצמכם, לזוגיות ולמשפחה.
            </p>
            <div style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
              <a href="#contact" className="pill" data-magnet style={{ background: "var(--color-accent-2)", color: "var(--color-bg)", fontWeight: 700, fontSize: 18, padding: "17px 36px", borderRadius: 999, boxShadow: "var(--shadow-md)" }}>
                בואו נדבר ←
              </a>
              <Link to="/about" style={{ fontWeight: 700, fontSize: 18, color: "var(--color-accent-2-800)", borderBottom: "2px solid color-mix(in srgb,var(--color-accent-2) 45%,transparent)", paddingBottom: 3 }}>
                קצת עליי
              </Link>
            </div>
          </div>

          <div style={{ flex: 0.92, display: "flex", justifyContent: "center", position: "relative" }}>
            <div data-reveal data-reveal-delay="420" style={{ position: "relative" }}>
              <div data-m="portrait" style={{ width: 400, height: "min(470px,56vh)", borderRadius: "52% 48% 46% 54%/58% 56% 44% 42%", overflow: "hidden", boxShadow: "var(--shadow-lg)", animation: "floaty 11s ease-in-out infinite" }}>
                <img src="/sharona.jpeg" alt="שרונה קדושאי בר-נס, יועצת ומטפלת רגשית" width="400" height="470" fetchpriority="high" decoding="async" className="washed" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div aria-hidden="true" style={{ position: "absolute", top: -14, insetInlineEnd: 26, width: 58, height: 58, borderRadius: "50%", background: "var(--color-accent)", animation: "floaty2 7s ease-in-out infinite", boxShadow: "var(--shadow-sm)" }} />
              <div aria-hidden="true" style={{ position: "absolute", bottom: 24, insetInlineStart: -22, width: 40, height: 40, borderRadius: "50%", background: "var(--color-accent-2)", animation: "floaty 6s ease-in-out infinite" }} />
              <div aria-hidden="true" style={{ position: "absolute", top: "38%", insetInlineStart: -40, width: 96, height: 96, border: "2px dashed color-mix(in srgb,var(--color-accent-2) 50%,transparent)", borderRadius: "50%", animation: "spinSlow 30s linear infinite" }} />
            </div>
          </div>
        </div>

      </section>

      {/* ============================== MARQUEE ============================== */}
      <div aria-hidden="true" style={{ background: "var(--color-accent-2-800)", color: "var(--color-bg)", overflow: "hidden", whiteSpace: "nowrap", padding: "26px 0" }}>
        <div data-marquee style={{ display: "inline-flex", fontFamily: HEAD, fontSize: 34, willChange: "transform" }}>
          {/* three copies: motion.js loops on scrollWidth / 3 */}
          {[0, 1, 2].map((copy) =>
            marqueeWords.map((w) => (
              <span key={`${copy}-${w}`} style={{ display: "inline-flex" }}>
                <span style={{ padding: "0 30px" }}>{w}</span>
                <span style={{ padding: "0 30px", color: "var(--color-accent-300)" }}>✦</span>
              </span>
            ))
          )}
        </div>
      </div>

      {/* =============================== ABOUT =============================== */}
      <section id="about" data-pin-sec style={{ position: "relative", height: "250vh", background: "var(--color-bg)" }}>
        <div data-pin-inner style={pinInner}>
          <div data-parallax="0.1" aria-hidden="true" style={{ position: "absolute", top: 80, insetInlineEnd: -80, width: 240, height: 240, pointerEvents: "none" }}>
            <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "color-mix(in srgb,var(--color-accent-2) 14%,transparent)", animation: "drift 22s ease-in-out infinite" }} />
          </div>

          <div data-m="stack" style={{ position: "relative", maxWidth: 1200, margin: "0 auto", display: "flex", gap: 70, alignItems: "center" }}>
            <div style={{ flex: 0.92, position: "relative", display: "flex", justifyContent: "center" }}>
              <div data-parallax="0.07">
                <div data-ab-portrait data-m="portrait" style={{ width: 420, height: "min(500px,54vh)", borderRadius: "48% 52% 55% 45%/56% 46% 54% 44%", overflow: "hidden", boxShadow: "var(--shadow-lg)" }}>
                  <img src="/sharona-portrait.png" alt="שרונה קדושאי בר-נס" width="553" height="659" loading="lazy" decoding="async" className="washed" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              </div>
              <div aria-hidden="true" style={{ position: "absolute", bottom: 10, insetInlineEnd: 0, width: 52, height: 52, borderRadius: "50%", background: "var(--color-accent)", animation: "floaty2 7s ease-in-out infinite" }} />
            </div>

            <div style={{ flex: 1.08 }}>
              <Kicker>קצת עליי</Kicker>
              <h2 style={{ ...h2Style, fontSize: 46, lineHeight: 1.22, marginBottom: 26, maxWidth: "18ch" }}>
                טיפול מתוך חמלה, כבוד והקשבה אמיתית.
              </h2>
              {aboutLines.map((line, i) => (
                <p key={i} style={{ fontSize: 19, lineHeight: 1.7, margin: i === aboutLines.length - 1 ? "0 0 26px" : "0 0 20px", color: "var(--color-text)" }}>
                  {line}
                </p>
              ))}
              <div style={{ marginBottom: 30 }}>
                <Link to="/about" style={{ fontWeight: 700, fontSize: 17, color: "var(--color-accent-2-800)", borderBottom: "2px solid color-mix(in srgb,var(--color-accent-2) 45%,transparent)", paddingBottom: 3 }}>
                  להמשך הקריאה ←
                </Link>
              </div>
              <div data-ab-stats data-m="stats" style={{ display: "flex", gap: 44, flexWrap: "wrap", paddingTop: 18, borderTop: "1.5px solid color-mix(in srgb,var(--color-text) 12%,transparent)" }}>
                <Stat value={<span data-count="20" data-suffix="+">20+</span>} label="שנות ניסיון" />
                <Stat value="יחידים · זוגות · קבוצות" label="ליווי מותאם אישית" small />
                <Stat value="עברית · אנגלית" label="שפות הטיפול" small />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================= APPROACH ============================= */}
      <section id="approach" data-pin-sec style={{ position: "relative", height: "460vh", background: "var(--color-surface)" }}>
        <div data-pin-inner style={pinInner}>
          {/* huge ghost numeral behind the active step */}
          <div data-ghost aria-hidden="true" style={{ position: "absolute", insetInlineStart: "50%", top: "50%", transform: "translate(50%,-50%)", fontFamily: HEAD, fontSize: "min(64vh,520px)", lineHeight: 0.78, color: "color-mix(in srgb,var(--color-accent-2) 12%,transparent)", pointerEvents: "none", userSelect: "none", opacity: 0 }} />
          <div data-spot aria-hidden="true" style={{ position: "absolute", top: 0, left: 0, width: 540, height: 540, transform: "translate(-50%,-50%)", borderRadius: "50%", background: "radial-gradient(circle,color-mix(in srgb,var(--color-accent) 22%,transparent),transparent 66%)", filter: "blur(4px)", pointerEvents: "none", opacity: 0 }} />

          <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto", width: "100%" }}>
            <div style={{ textAlign: "center", marginBottom: 68 }}>
              <h2 style={{ ...h2Style, margin: "0 auto 14px", maxWidth: "20ch" }}>
                הדרך שלנו יחד
              </h2>
              <p style={{ margin: 0, fontSize: 19, lineHeight: 1.6, color: "var(--color-text)", opacity: 0.78 }}>
                מהפנייה הראשונה ועד לסיום התהליך
              </p>
            </div>

            <div data-m="steps" style={{ position: "relative", display: "flex", gap: 26 }}>
              {/* The path threads between the number discs — its box is
                  centred on the disc row, not sitting above it. Positioned
                  with physical left/right: the SVG viewBox and `translate`
                  are both LTR, so RTL logical props would send the dot the
                  wrong way (which is exactly what used to happen).
                  The inset is half a column — (W - 4*26)/10, i.e.
                  calc(10% - 10.4px) — so the box runs centre-to-centre of the
                  first and last disc at every width, and the path's five
                  nodes land on the discs rather than only at 1200px. */}
              <div aria-hidden="true" style={{ position: "absolute", top: 0, left: "calc(10% - 10.4px)", right: "calc(10% - 10.4px)", height: 92, pointerEvents: "none" }}>
                <svg data-path viewBox="0 0 1000 92" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}>
                  <defs>
                    <linearGradient id="pathgrad" x1="1" y1="0" x2="0" y2="0">
                      <stop offset="0" stopColor="var(--color-accent-2)" />
                      <stop offset="1" stopColor="var(--color-accent)" />
                    </linearGradient>
                  </defs>
                  {/* the faint full route, always visible so the four steps
                      read as one journey even before you scroll */}
                  <path
                    d={STEP_PATH}
                    fill="none"
                    stroke="color-mix(in srgb,var(--color-accent-2) 22%,transparent)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray="7 12"
                    vectorEffect="non-scaling-stroke"
                  />
                  {/* and the solid line the dot leaves behind it */}
                  <path
                    data-pathline
                    d={STEP_PATH}
                    fill="none"
                    stroke="url(#pathgrad)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
                {/* three trailing ghosts of the dot, each a frame behind */}
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    data-trail={i}
                    style={{ position: "absolute", top: 0, left: 0, width: 12, height: 12, borderRadius: "50%", background: "var(--color-accent)", opacity: 0, willChange: "transform" }}
                  />
                ))}
                <div data-dot style={{ position: "absolute", top: 0, left: 0, width: 18, height: 18, borderRadius: "50%", background: "var(--color-accent)", boxShadow: "0 0 0 6px color-mix(in srgb,var(--color-accent) 22%,transparent)", opacity: 0, transition: "opacity .4s ease", willChange: "transform" }} />
              </div>

              {steps.map(([n, title, text, color]) => (
                <div key={n} data-step style={{ position: "relative", flex: 1, textAlign: "center", paddingTop: 46 }}>
                  <div data-num style={{ position: "relative", width: 88, height: 88, borderRadius: "50%", background: color, color: "var(--color-bg)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: HEAD, fontSize: 38, margin: "0 auto 22px", boxShadow: "var(--shadow-md)" }}>
                    {/* two rings, staggered — a ripple when the dot arrives */}
                    <span data-ring aria-hidden="true" style={{ position: "absolute", inset: -9, borderRadius: "50%", border: `2px solid ${color}`, opacity: 0 }} />
                    <span data-ring2 aria-hidden="true" style={{ position: "absolute", inset: -9, borderRadius: "50%", border: `1.5px solid ${color}`, opacity: 0 }} />
                    <span data-numtext>{n}</span>
                    {/* swaps in for the numeral once the step is behind you */}
                    <span data-numdone aria-hidden="true" style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, opacity: 0 }}>✓</span>
                  </div>
                  {/* five columns, so the type steps down a notch from the
                      four-step layout to keep each card's copy readable */}
                  <div style={{ fontFamily: HEAD, fontSize: 20.5, lineHeight: 1.24, marginBottom: 10 }}>{title}</div>
                  <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.6, color: "var(--color-text)" }}>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================= SERVICES ============================= */}
      <section id="services" data-pin-sec style={{ position: "relative", height: "420vh", background: "var(--color-bg)" }}>
        <div data-pin-inner style={pinInner}>
          <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%" }}>
            <div style={{ marginBottom: 40, maxWidth: "34ch" }}>
              <Kicker>תחומי הטיפול</Kicker>
              <h2 style={h2Style}>איך אני יכולה ללוות אתכם</h2>
            </div>
            {/* cards start piled in the middle, get dealt into the grid, then
                tilt under the pointer */}
            <div data-m="grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18 }}>
              {services.map((s) => (
                <Link
                  key={s.title}
                  to={s.to}
                  data-deck
                  data-tilt
                  style={{ display: "block", color: "var(--color-text)", borderRadius: 26, padding: 24, transformStyle: "preserve-3d" }}
                >
                  <div style={{ width: 50, height: 50, borderRadius: "50%", background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 15, fontSize: 22 }}>
                    {s.icon}
                  </div>
                  <div style={{ fontFamily: HEAD, fontSize: 21, lineHeight: 1.24, marginBottom: 9 }}>{s.title}</div>
                  <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: "var(--color-text)" }}>{s.text}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================== GALLERY ============================== */}
      {/* A room you're standing inside rather than a reel you scroll past.
          Scroll assembles the plates out of depth; the pointer decides which
          one you're looking at, and the rest step back for it. */}
      <section id="gallery" data-collage data-pin-sec style={{ position: "relative", height: "300vh", background: "var(--color-surface)" }}>
        <div data-pin-inner style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 54px" }}>
          <div data-stage style={{ position: "relative", width: "100%", maxWidth: 1180, height: "min(660px,76vh)" }}>
            {plates.map((g, i) => (
              <div
                key={i}
                data-plate
                data-depth={g.d}
                style={{
                  position: "absolute",
                  left: `${g.x}%`,
                  top: `${g.y}%`,
                  // Sized against the stage (1180×660 at full size), not the
                  // viewport: x% + width% then stays inside the stage at any
                  // width, so a plate can't run off the edge on a laptop.
                  width: `min(${g.w}px,${(g.w / 11.8).toFixed(1)}%)`,
                  height: `min(${g.h}px,${(g.h / 6.6).toFixed(1)}%)`,
                  borderRadius: g.r,
                  overflow: "hidden",
                  boxShadow: "var(--shadow-md)",
                  willChange: "transform,opacity,filter",
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "center",
                  padding: 18,
                  boxSizing: "border-box",
                }}
              >
                <img
                  src={g.src}
                  alt={`המרחב הטיפולי — ${g.label}`}
                  loading="lazy"
                  decoding="async"
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                />
                <span
                  data-plabel
                  aria-hidden="true"
                  style={{ position: "relative", opacity: 0, fontSize: 13.5, fontWeight: 700, letterSpacing: ".04em", color: "var(--color-accent-2-800)", background: "color-mix(in srgb,var(--color-bg) 88%,#fff)", borderRadius: 999, padding: "6px 14px", whiteSpace: "nowrap", transition: "opacity .35s ease" }}
                >
                  {g.label}
                </span>
              </div>
            ))}
            {/* the still centre of it — plain, static text */}
            {/* Now that the plates carry photographs, the centre copy needs a
                soft ground of its own to stay readable over them. */}
            <div data-stagetext style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", zIndex: 4, pointerEvents: "none" }}>
              <div style={{ background: "color-mix(in srgb,var(--color-surface) 82%,#fff)", backdropFilter: "blur(7px)", WebkitBackdropFilter: "blur(7px)", borderRadius: 34, padding: "34px 42px", boxShadow: "var(--shadow-md)", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Kicker>המרחב הטיפולי</Kicker>
              <h2 style={{ ...h2Style, maxWidth: "18ch" }}>מקום שנעים לחזור אליו</h2>
              <p style={{ fontSize: 18.5, lineHeight: 1.66, maxWidth: "32ch", margin: "18px 0 26px", color: "var(--color-text)" }}>
                חדר שקט ומוכר, שאפשר להיכנס אליו כמו שאתם ולצאת ממנו קצת יותר קלים.
              </p>
              <a href="#contact" className="pill" data-magnet style={{ pointerEvents: "auto", background: "var(--color-accent-2)", color: "var(--color-bg)", fontWeight: 700, fontSize: 17, padding: "15px 30px", borderRadius: 999, boxShadow: "var(--shadow-md)", whiteSpace: "nowrap" }}>
                לתאם פגישה ←
              </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================== VOICES ============================== */}
      {/* Cards sweep in one at a time from alternating sides, then gather into
          a running carousel you can drag or step through. */}
      <section id="voices" data-pin-sec style={{ position: "relative", height: "520vh", background: "var(--color-accent-2-800)", color: "var(--color-bg)" }}>
        <div data-pin-inner style={pinInner}>
          <div aria-hidden="true" style={{ position: "absolute", top: -90, insetInlineStart: -60, width: 320, height: 320, borderRadius: "50%", background: "color-mix(in srgb,#fff 7%,transparent)", filter: "blur(10px)", animation: "drift 26s ease-in-out infinite" }} />
          <div aria-hidden="true" style={{ position: "absolute", bottom: -110, insetInlineEnd: -70, width: 260, height: 260, borderRadius: "50%", background: "color-mix(in srgb,var(--color-accent) 22%,transparent)", filter: "blur(14px)", animation: "drift2 30s ease-in-out infinite" }} />
          <div aria-hidden="true" style={{ position: "absolute", bottom: "8%", insetInlineStart: "12%", width: 180, height: 180, borderRadius: "50%", border: "2px dashed color-mix(in srgb,#fff 20%,transparent)", animation: "spinSlow 44s linear infinite" }} />

          <div style={{ position: "relative", maxWidth: 1100, margin: "0 auto", width: "100%" }}>
            <div data-vhead style={{ textAlign: "center", marginBottom: 40 }}>
              <Kicker color="var(--color-accent-300)">מה שאומרים</Kicker>
              <h2 style={{ ...h2Style, fontSize: 46, lineHeight: 1.2, margin: "0 0 10px" }}>
                מילים של מטופלים ומטופלות
              </h2>
              <div style={{ position: "relative", height: 24 }}>
                <div data-vhint style={{ position: "absolute", inset: 0, fontSize: 15, color: "var(--color-accent-300)" }}>
                  גללו — כל המלצה מפנה מקום לבאה
                </div>
                <div data-vhint2 style={{ position: "absolute", inset: 0, opacity: 0, fontSize: 15, color: "var(--color-accent-300)" }}>
                  {`כל ${voices.length} ההמלצות — גררו לצדדים, או בחצים ובמקלדת`}
                </div>
                {/* mobile has no pin, so the deck is a swipeable rail instead */}
                <div data-mhint style={{ position: "absolute", inset: 0, fontSize: 15, color: "var(--color-accent-300)" }}>
                  החליקו לצדדים לעוד המלצות ←
                </div>
              </div>
            </div>

            {/* 560px, not 340: at 340 the content ran ~60px over and the
                patient's name was the part that got cut off. This is sized to
                the longest of the reviews, and the card is a column with
                the footer pushed to the bottom, so the name can't be clipped
                whatever the length. */}
            <div data-stack style={{ position: "relative", height: 560, maxWidth: 640, margin: "0 auto" }}>
              {voices.map((t, i) => (
                <blockquote key={t.id ?? i} data-card {...(t.sweep ? {} : { "data-extra": "" })} style={{ position: "absolute", inset: 0, margin: 0, display: "flex", flexDirection: "column", background: "color-mix(in srgb,#fff 12%,transparent)", border: "1px solid color-mix(in srgb,#fff 16%,transparent)", borderRadius: 30, padding: 36, boxSizing: "border-box", willChange: "transform" }}>
                  <div aria-hidden="true" style={{ fontFamily: HEAD, fontSize: 52, lineHeight: 0.6, color: "var(--color-accent-300)", marginBottom: 18, flex: "none" }}>״</div>
                  {/* `excerpt` is the card-length cut of a long review — the
                      full text still lives in `feedback`. The clamp is the
                      backstop for anything without one. */}
                  <p style={{ margin: "0 0 22px", fontSize: 19, lineHeight: 1.62, display: "-webkit-box", WebkitLineClamp: 12, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {(t.excerpt ?? t.feedback).trim()}
                  </p>
                  {/* mt:auto — the name is pinned to the bottom of the card */}
                  <footer style={{ display: "flex", alignItems: "center", gap: 12, marginTop: "auto", flex: "none" }}>
                    <div aria-hidden="true" style={{ width: 46, height: 46, borderRadius: "50%", background: "color-mix(in srgb,#fff 20%,transparent)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, flex: "none" }}>
                      {t.name.trim().charAt(0)}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 16.5 }}>{t.name.trim()}</div>
                  </footer>
                </blockquote>
              ))}
            </div>

            {/* one dot per card on mobile — motion.js fills this in */}
            <div data-mdots style={{ display: "none", justifyContent: "center", alignItems: "center", flexWrap: "wrap", gap: 9, marginTop: 22, padding: "0 20px" }} />

            <div data-carrow style={{ display: "flex", justifyContent: "center", gap: 14, marginTop: 26 }}>
              <button type="button" data-carnav="-1" aria-label="ההמלצה הבאה" style={carNavStyle}>
                <span aria-hidden="true">→</span>
              </button>
              <button type="button" data-carnav="1" aria-label="ההמלצה הקודמת" style={carNavStyle}>
                <span aria-hidden="true">←</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =============================== FAQ =============================== */}
      {/* Teaser only — the full set and the FAQPage schema live on /faq. */}
      <section id="faq" data-pin-sec style={{ position: "relative", height: "250vh", background: "var(--color-bg)" }}>
        <div data-pin-inner style={{ ...pinInner, alignItems: "center" }}>
          <div data-parallax="0.08" aria-hidden="true" style={{ position: "absolute", bottom: -130, insetInlineStart: -100, width: 340, height: 340, pointerEvents: "none" }}>
            <div style={{ width: "100%", height: "100%", borderRadius: "48% 52% 56% 44%/52% 46% 54% 48%", background: "color-mix(in srgb,var(--color-accent) 15%,transparent)", filter: "blur(4px)", animation: "drift2 24s ease-in-out infinite" }} />
          </div>

          <div data-m="stack" style={{ position: "relative", maxWidth: 1100, margin: "0 auto", width: "100%", display: "flex", gap: 64, alignItems: "flex-start" }}>
            <div style={{ flex: "0 0 32%", paddingTop: 4 }}>
              <Kicker>שאלות נפוצות</Kicker>
              <h2 style={{ ...h2Style, fontSize: 44, margin: "0 0 20px", maxWidth: "14ch" }}>
                מה ששואלים לפני השיחה הראשונה.
              </h2>
              <p style={{ fontSize: 17, lineHeight: 1.7, margin: "0 0 16px", maxWidth: "26ch", color: "var(--color-text)" }}>
                לא מצאתם תשובה? כתבו לי ואשמח לענות.
              </p>
              <div>
                <Link to="/faq" style={{ fontWeight: 700, fontSize: 17, color: "var(--color-accent-2-800)", borderBottom: "2px solid color-mix(in srgb,var(--color-accent-2) 45%,transparent)", paddingBottom: 3 }}>
                  לכל השאלות הנפוצות ←
                </Link>
              </div>
            </div>

            <KineticFaq items={homeFaqs} motionRef={motionRef} />
          </div>
        </div>
      </section>

      {/* ============================== CONTACT ============================== */}
      <section id="contact" data-pin-sec style={{ position: "relative", height: "260vh", background: "linear-gradient(160deg,#f1ece0,#eaefe0)" }}>
        <div data-pin-inner style={pinInner}>
          <div data-parallax="0.1" aria-hidden="true" style={{ position: "absolute", top: -70, insetInlineEnd: -60, width: 320, height: 320, pointerEvents: "none" }}>
            <div style={{ width: "100%", height: "100%", borderRadius: "52% 48% 44% 56%/48% 52% 48% 52%", background: "color-mix(in srgb,var(--color-accent-2) 22%,transparent)", filter: "blur(3px)", animation: "drift 20s ease-in-out infinite" }} />
          </div>

          <div data-m="stack" style={{ position: "relative", maxWidth: 1100, margin: "0 auto", display: "flex", gap: 64, alignItems: "center" }}>
            <div style={{ flex: 1 }}>
              <Kicker>בואו נתחיל</Kicker>
              <h2 style={{ ...h2Style, fontSize: 50, lineHeight: 1.16, margin: "0 0 20px", maxWidth: "16ch" }}>
                הצעד הראשון מתחיל בשיחה.
              </h2>
              <p style={{ fontSize: 19, lineHeight: 1.68, margin: "0 0 28px", maxWidth: "40ch", color: "var(--color-text)" }}>
                אין צורך לדעת מראש מה להגיד. השאירו פרטים ואחזור אליכם לשיחת
                היכרות קצרה — בלי עלות ובלי התחייבות.
              </p>

              {/* What actually happens after you press send — the unknown is
                  most of what stops people from writing. */}
              <ol data-cbeats style={{ listStyle: "none", margin: "0 0 28px", padding: 0, display: "flex", flexDirection: "column", gap: 13 }}>
                {contactBeats.map(([n, title, text]) => (
                  <li key={n} style={{ display: "flex", alignItems: "flex-start", gap: 13 }}>
                    <span aria-hidden="true" style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--color-accent-2)", color: "var(--color-bg)", fontFamily: HEAD, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", flex: "none", marginTop: 1 }}>
                      {n}
                    </span>
                    <span style={{ fontSize: 16.5, lineHeight: 1.5 }}>
                      <strong style={{ fontWeight: 700 }}>{title}</strong>
                      <span style={{ color: "color-mix(in srgb,var(--color-text) 76%,transparent)" }}> — {text}</span>
                    </span>
                  </li>
                ))}
              </ol>

              <div data-cactions style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 22 }}>
                <a
                  href={WHATSAPP}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackWhatsappClick("home_contact_cta")}
                  className="pill"
                  data-magnet
                  style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "#25D366", color: "#fff", fontWeight: 700, fontSize: 16.5, padding: "13px 24px", borderRadius: 999, boxShadow: "var(--shadow-sm)" }}
                >
                  <svg width="19" height="19" viewBox="0 0 32 32" fill="#fff" aria-hidden="true">
                    <path d="M16.01 3.2c-7.06 0-12.8 5.73-12.8 12.79 0 2.25.59 4.45 1.71 6.39L3.2 28.8l6.6-1.73a12.76 12.76 0 0 0 6.2 1.58h.01c7.05 0 12.79-5.74 12.79-12.8 0-3.42-1.33-6.63-3.75-9.04a12.7 12.7 0 0 0-9.04-3.61zm0 23.31h-.01c-1.9 0-3.76-.51-5.39-1.48l-.39-.23-3.92 1.03 1.05-3.82-.25-.4a10.6 10.6 0 0 1-1.63-5.66c0-5.86 4.77-10.63 10.64-10.63 2.84 0 5.51 1.11 7.52 3.12a10.56 10.56 0 0 1 3.11 7.52c0 5.87-4.77 10.64-10.63 10.64zm5.83-7.96c-.32-.16-1.89-.93-2.18-1.04-.29-.11-.5-.16-.71.16-.21.32-.82 1.04-1 1.25-.19.21-.37.24-.68.08-.32-.16-1.35-.5-2.57-1.58-.95-.85-1.59-1.9-1.78-2.22-.19-.32-.02-.49.14-.65.15-.14.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.71-1.72-.98-2.35-.26-.62-.52-.54-.71-.55-.18-.01-.4-.01-.61-.01-.21 0-.56.08-.85.4-.29.32-1.11 1.09-1.11 2.66 0 1.57 1.14 3.08 1.3 3.29.16.21 2.25 3.43 5.45 4.81.76.33 1.35.53 1.82.68.76.24 1.46.21 2.01.13.61-.09 1.89-.77 2.16-1.52.27-.74.27-1.38.19-1.51-.08-.13-.29-.21-.61-.37z" />
                  </svg>
                  הודעה בוואטסאפ
                </a>
                <a
                  href={TEL}
                  onClick={() => trackClickToCall("home_contact_cta")}
                  className="pill"
                  data-magnet
                  style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "color-mix(in srgb,var(--color-bg) 70%,#fff)", color: "var(--color-accent-2-800)", border: "1.5px solid color-mix(in srgb,var(--color-accent-2) 34%,transparent)", fontWeight: 700, fontSize: 16.5, padding: "13px 24px", borderRadius: 999 }}
                >
                  <span aria-hidden="true">✆</span>
                  {PHONE_LABEL}
                </a>
              </div>

              <div data-crows style={{ display: "flex", flexDirection: "column", gap: 11, fontSize: 16 }}>
                <ContactRow icon="✉" href={`mailto:${EMAIL}`} compact>{EMAIL}</ContactRow>
                <ContactRow icon="⌂" compact>מבשרת ציון · צור הדסה · אונליין מכל הארץ</ContactRow>
              </div>
            </div>

            <ContactForm motionRef={motionRef} />
          </div>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------ sub-components ------------------------------ */

const carNavStyle = {
  width: 50,
  height: 50,
  padding: 0,
  borderRadius: 999,
  border: "1px solid color-mix(in srgb,#fff 26%,transparent)",
  background: "color-mix(in srgb,#fff 12%,transparent)",
  color: "var(--color-bg)",
  fontSize: 21,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

// `goo` melts the hero circles (and the intro blobs) together.
function Filters() {
  return (
    <svg aria-hidden="true" focusable="false" style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}>
      <defs>
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="22" result="blr" />
          <feColorMatrix in="blr" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10" result="goo" />
          <feBlend in="SourceGraphic" in2="goo" />
        </filter>
      </defs>
    </svg>
  );
}

// Section rail. Plain anchors, so it still navigates without JS; motion.js
// only grows the dot for the section you're in.
function Rail() {
  return (
    <nav data-rail aria-label="ניווט מהיר בעמוד" style={{ position: "fixed", top: "50%", insetInlineStart: 24, transform: "translateY(-50%)", zIndex: 92, display: "flex", flexDirection: "column", gap: 13, alignItems: "center" }}>
      {railSections.map(([id, label]) => (
        <a key={id} href={`#${id}`} data-dot-nav data-target={id} title={label} aria-label={label} />
      ))}
    </nav>
  );
}

function Stat({ value, label, small }) {
  return (
    <div>
      <div style={{ fontFamily: HEAD, fontSize: small ? 24 : 44, color: "var(--color-accent-2-700)", lineHeight: 1.1 }}>{value}</div>
      <div style={{ fontSize: 15, color: "var(--color-accent-2-800)", marginTop: 6 }}>{label}</div>
    </div>
  );
}

function ContactRow({ icon, href, children, onClick, compact }) {
  const d = compact ? 34 : 42;
  const inner = (
    <>
      <span aria-hidden="true" style={{ width: d, height: d, borderRadius: "50%", background: "var(--color-accent-2-200)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none", fontSize: compact ? 14 : undefined }}>
        {icon}
      </span>
      <span>{children}</span>
    </>
  );
  const style = { display: "flex", alignItems: "center", gap: compact ? 12 : 14, color: "var(--color-text)" };
  return href ? (
    <a href={href} onClick={onClick} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" style={style}>
      {inner}
    </a>
  ) : (
    <div style={style}>{inner}</div>
  );
}

/* ---- FAQ (kinetic variant) ----
   Single-open disclosure, first item open. The panel stays in the DOM
   (collapsed by max-height) so its text is in the prerendered HTML.
   motion.js only scrubs the rows in; React owns open/closed. */
function KineticFaq({ items, motionRef }) {
  const [open, setOpen] = useState(0);
  const uid = useId();

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 13 }}>
      {items.map((f, i) => {
        const isOpen = open === i;
        const panelId = `${uid}-p${i}`;
        const btnId = `${uid}-b${i}`;
        return (
          <div
            key={f.q}
            data-faq
            style={{
              background: "color-mix(in srgb,#fff 52%,transparent)",
              border: "1px solid color-mix(in srgb,var(--color-accent-2) 20%,transparent)",
              borderRadius: 24,
              overflow: "hidden",
            }}
          >
            <h3 style={{ margin: 0 }}>
              <button
                id={btnId}
                data-faq-q
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => {
                  setOpen(isOpen ? -1 : i);
                  // the row changes height, so the pin fit has to be redone
                  requestAnimationFrame(() => motionRef.current?.remeasure());
                }}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 18,
                  textAlign: "start",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "var(--font-body)",
                  fontWeight: 700,
                  fontSize: 18,
                  color: "var(--color-text)",
                  padding: "19px 22px",
                }}
              >
                <span>{f.q}</span>
                <span
                  data-faq-i
                  aria-hidden="true"
                  style={{
                    flex: "0 0 30px",
                    width: 30,
                    height: 30,
                    borderRadius: 999,
                    background: isOpen ? "var(--color-accent-2)" : "var(--color-accent-2-200)",
                    color: isOpen ? "var(--color-bg)" : "var(--color-accent-2-800)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 19,
                    lineHeight: 1,
                    transform: isOpen ? "rotate(135deg)" : "none",
                    transition:
                      "transform .45s cubic-bezier(.2,.7,.2,1), background .3s ease, color .3s ease",
                  }}
                >
                  +
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              style={{
                maxHeight: isOpen ? 420 : 0,
                opacity: isOpen ? 1 : 0,
                overflow: "hidden",
                transition:
                  "max-height .5s cubic-bezier(.2,.7,.2,1), opacity .4s ease",
              }}
            >
              <p style={{ margin: 0, padding: "0 22px 20px", fontSize: 16.5, lineHeight: 1.66, color: "var(--color-text)" }}>
                {f.a}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Kept as its own component so its `status` state can't re-render the rest of
// the page — motion.js writes inline transforms onto the pinned sections'
// children, and a parent re-render would undo that.
function ContactForm({ motionRef }) {
  const [status, setStatus] = useState(null); // null | 'sending' | 'ok' | 'err'
  // Which opener chip is picked. The textarea itself stays uncontrolled —
  // typing must not re-render this component, because motion.js writes the
  // fields' transforms straight onto the DOM.
  const [topic, setTopic] = useState(null);
  const msgRef = useRef(null);

  const pickTopic = (i) => {
    const el = msgRef.current;
    if (!el) return;
    const [, line] = contactTopics[i];
    // Only overwrite an opener we put there ourselves — never someone's
    // own words.
    const owned = contactTopics.some(([, l]) => l === el.value.trim());
    if (!el.value.trim() || owned) el.value = line;
    setTopic(i);
    el.focus();
    el.setSelectionRange(el.value.length, el.value.length);
  };

  const sendEmail = (e) => {
    e.preventDefault();
    setStatus("sending");
    const form = e.target;
    emailjs
      .sendForm("service_vuk7ooe", "template_jeein3i", form, {
        publicKey: "3BSgxbEsCuxc0KZUL",
      })
      .then(
        () => {
          setStatus("ok");
          form.reset();
          setTopic(null);
          // GA4 conversion: only on a genuinely successful send.
          trackContactFormSubmit("home_contact");
          // and only then does the bloom play (the design fired it on click,
          // which would have celebrated failures too).
          motionRef.current?.playFormSuccess();
        },
        () => setStatus("err")
      );
  };

  return (
    <div data-cform style={{ flex: 1, position: "relative", background: "color-mix(in srgb,var(--color-bg) 55%,#fff)", borderRadius: 32, padding: 34, boxShadow: "var(--shadow-lg)", overflow: "hidden" }}>
      <form onSubmit={sendEmail} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div data-cf>
          <div id="topic-label" style={{ fontSize: 15, fontWeight: 700, marginBottom: 10, color: "var(--color-accent-2-800)" }}>
            מה מביא אתכם? <span style={{ fontWeight: 400, color: "color-mix(in srgb,var(--color-text) 62%,transparent)" }}>(אפשר לבחור, ואפשר פשוט לכתוב)</span>
          </div>
          <div data-ctopics role="group" aria-labelledby="topic-label" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {contactTopics.map(([label], i) => (
              <button
                key={label}
                type="button"
                onClick={() => pickTopic(i)}
                aria-pressed={topic === i}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 14.5,
                  fontWeight: 600,
                  padding: "8px 15px",
                  borderRadius: 999,
                  cursor: "pointer",
                  background: topic === i ? "var(--color-accent-2)" : "color-mix(in srgb,var(--color-accent-2) 9%,transparent)",
                  color: topic === i ? "var(--color-bg)" : "var(--color-accent-2-800)",
                  border: `1.5px solid color-mix(in srgb,var(--color-accent-2) ${topic === i ? 100 : 28}%,transparent)`,
                  transition: "background .2s ease, color .2s ease, border-color .2s ease",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <input data-cf className="fin" type="text" name="name" aria-label="שם מלא" placeholder="שם מלא" required />
        <input data-cf className="fin" type="tel" name="phone" aria-label="טלפון" placeholder="טלפון" required />
        <input data-cf className="fin" type="email" name="email" aria-label="אימייל" placeholder="אימייל" />
        <textarea ref={msgRef} data-cf className="fin" name="message" rows={3} aria-label="הודעה" placeholder="כמה מילים על מה שמביא אתכם (לא חובה)" style={{ resize: "vertical" }} />
        <button data-cf type="submit" disabled={status === "sending"} className="pill" style={{ position: "relative", background: status === "sending" ? "var(--color-accent-2-600)" : "var(--color-accent-2)", color: "var(--color-bg)", border: "none", cursor: status === "sending" ? "progress" : "pointer", fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 18, padding: 17, borderRadius: 999, boxShadow: "var(--shadow-md)", marginTop: 4 }}>
          {status === "sending" ? "שולח..." : "שליחה ←"}
        </button>
        <p data-cf style={{ margin: 0, fontSize: 13.5, lineHeight: 1.5, textAlign: "center", color: "color-mix(in srgb,var(--color-text) 62%,transparent)" }}>
          הפרטים מגיעים אליי בלבד ונשמרים בדיסקרטיות מלאה. בדרך כלל אחזור
          אליכם באותו יום.
        </p>
        <div role="status" aria-live="polite">
          {status === "err" && (
            <p style={{ margin: 0, color: "var(--color-accent-700)", fontWeight: 600 }}>
              אירעה שגיאה. נסו שוב או פנו בוואטסאפ.
            </p>
          )}
          {/* the success message is the overlay below, announced from here */}
          {status === "ok" && <p style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>ההודעה נשלחה, אחזור אליכם בהקדם</p>}
        </div>
      </form>

      {/* a dot that expands to flood the card, then the confirmation fades in */}
      <div data-bloom aria-hidden="true" style={{ position: "absolute", bottom: 52, insetInlineStart: "50%", width: 60, height: 60, marginInlineStart: -30, borderRadius: "50%", background: "var(--color-accent-2)", transform: "scale(0)", pointerEvents: "none" }} />
      <div data-success aria-hidden="true" style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18, textAlign: "center", padding: 40, color: "var(--color-bg)", opacity: 0, transform: "translateY(14px)", transition: "opacity .6s ease, transform .7s cubic-bezier(.2,.7,.2,1)", pointerEvents: "none" }}>
        <svg width="70" height="70" viewBox="0 0 70 70" fill="none">
          <circle cx="35" cy="35" r="32" stroke="color-mix(in srgb,#fff 55%,transparent)" strokeWidth="2" />
          <path data-check d="M20 36 L31 47 L50 25" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="60" strokeDashoffset="60" style={{ transition: "stroke-dashoffset .7s cubic-bezier(.2,.7,.2,1) .15s" }} />
        </svg>
        <div style={{ fontFamily: HEAD, fontSize: 30 }}>תודה שפניתם</div>
        <div style={{ fontSize: 17, maxWidth: "26ch", color: "var(--color-bg)" }}>
          אחזור אליכם בהקדם. עד אז — קחו נשימה אחת עמוקה.
        </div>
      </div>
    </div>
  );
}

export default HomePage;
