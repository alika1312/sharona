import React, { useState } from "react";
import { Head } from "vite-react-ssg";
import { Link } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { aboutInformation, testimonials } from "../information/information";
import { teaserFaqs } from "../information/faq";
import FaqAccordion from "../components/FaqAccordion";
import { useReveal } from "../hooks/useReveal";
import { kicker, h2, muted } from "../design/ui";
import {
  trackContactFormSubmit,
  trackWhatsappClick,
  trackClickToCall,
} from "../lib/analytics";

const WHATSAPP = "https://wa.me/972587250990";
const TEL = "tel:+972587250990";
const EMAIL = "sharonabar5@gmail.com";

const services = [
  { icon: "❤", title: "טיפול רגשי", to: "/experiences", bg: "var(--color-accent-2-200)", text: "עיבוד רגשות, חיזוק הדימוי העצמי וכלים מעשיים להתמודדות עם אתגרים ומשברים." },
  { icon: "◐", title: "ייעוץ וטיפול זוגי", to: "/experiences", bg: "var(--color-accent-200)", text: "מרחב לשיפור התקשורת, לחיזוק הקרבה והאינטימיות ולצליחת משברים בזוגיות." },
  { icon: "✦", title: "הדרכת הורים", to: "/experiences", bg: "var(--color-accent-2-300)", text: "כלים, ליווי רגשי והכוונה להורות מיטיבה ולהתמודדות עם הקשיים של ילדיכם." },
  { icon: "☾", title: "טיפול במשבר ובטראומה", to: "/experiences", bg: "var(--color-accent-300)", text: "ליווי רגיש בעיבוד אירועים קשים, לחיזוק החוסן והחזרה לאיזון ולתפקוד." },
  { icon: "◇", title: "ייעוץ תעסוקתי וקריירה", to: "/experiences", bg: "var(--color-accent-2-200)", text: "מיפוי נטיות וכישורים, ליווי במעברי קריירה ובבחירת כיוון מקצועי מיטבי." },
  { icon: "✧", title: "סדנאות", to: "/workshops", bg: "var(--color-accent-200)", text: "סדנאות חווייתיות ליחידים, זוגות, קבוצות וארגונים — כלים לצמיחה ולתקשורת." },
];

const steps = [
  ["1", "פגישת היכרות", "נכיר, נבין מה מביא אתכם ונראה יחד אם הדרך מתאימה.", "var(--color-accent-2)"],
  ["2", "הבנת התמונה", "נמפה יחד את הדפוסים, הצרכים והנקודות הכואבות.", "var(--color-accent)"],
  ["3", "עבודה משותפת", "כלים מעשיים לעיבוד, להקשבה ולשינוי — בקצב שנכון לכם.", "var(--color-accent-2)"],
  ["4", "צמיחה מתמשכת", "התמודדות בריאה ומיטיבה שממשיכה איתכם גם אחרי התהליך.", "var(--color-accent)"],
];

const voices = [2, 7, 16]
  .map((id) => testimonials.find((t) => t.id === id))
  .filter(Boolean);

function HomePage() {
  const rootRef = useReveal();
  const [status, setStatus] = useState(null); // null | 'sending' | 'ok' | 'err'

  const onMove = (e) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--nx", (((e.clientX - r.left) / r.width - 0.5) * 2).toFixed(3));
    el.style.setProperty("--ny", (((e.clientY - r.top) / r.height - 0.5) * 2).toFixed(3));
  };
  const onLeave = (e) => {
    e.currentTarget.style.setProperty("--nx", "0");
    e.currentTarget.style.setProperty("--ny", "0");
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
          // GA4 conversion: only on a genuinely successful send.
          trackContactFormSubmit("home_contact");
        },
        () => setStatus("err")
      );
  };

  return (
    <div ref={rootRef} className="organic" style={{ overflowX: "hidden", position: "relative" }}>
      <Head>
        <html lang="he" dir="rtl" />
        <title>שרונה קדושאי בר-נס | טיפול רגשי, ייעוץ זוגי והדרכת הורים</title>
        <meta
          name="description"
          content="שרונה קדושאי בר-נס – יועצת ומטפלת המתמחה בטיפול רגשי, ייעוץ זוגי, הדרכת הורים, טראומה ומשבר. טיפול קצר מועד, אונליין ובאזור ירושלים ומבשרת ציון. בעברית ובאנגלית."
        />
        <link rel="canonical" href="https://sharona-bar-nes.com/" />
        <meta property="og:title" content="שרונה קדושאי בר-נס | טיפול רגשי, ייעוץ זוגי והדרכת הורים" />
        <meta property="og:description" content="יועצת ומטפלת המתמחה בטיפול רגשי, ייעוץ זוגי, הדרכת הורים, טראומה ומשבר – אונליין ובאזור ירושלים ומבשרת ציון." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://sharona-bar-nes.com/" />
      </Head>

      {/* ============ HERO ============ */}
      <section
        id="top"
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="org-section"
        style={{
          position: "relative",
          minHeight: "88vh",
          display: "flex",
          alignItems: "center",
          padding: "70px 54px 60px",
          background: "linear-gradient(155deg,#f5ecdb 0%,#eef0e0 55%,#f1ecdc 100%)",
          overflow: "hidden",
        }}
      >
        <Blob style={{ top: -90, insetInlineStart: -60, width: 360, height: 360 }} inner={{ borderRadius: "46% 54% 62% 38%/45% 40% 60% 55%", background: "color-mix(in srgb,var(--color-accent-2) 38%,transparent)", filter: "blur(3px)", animation: "drift 17s ease-in-out infinite" }} shift={30} />
        <Blob style={{ bottom: -110, insetInlineEnd: -70, width: 300, height: 300 }} inner={{ borderRadius: "58% 42% 38% 62%/52% 58% 42% 48%", background: "color-mix(in srgb,var(--color-accent) 30%,transparent)", filter: "blur(3px)", animation: "drift2 21s ease-in-out infinite" }} shift={-36} />

        <div style={{ position: "relative", maxWidth: 1200, margin: "0 auto", width: "100%", display: "flex", alignItems: "center", gap: 56 }} className="org-hero">
          <div style={{ flex: 1.08 }}>
            <div data-reveal style={{ ...kicker, letterSpacing: ".14em" }}>
              טיפול רגשי · ייעוץ זוגי · הדרכת הורים
            </div>
            <h1 className="org-h1" style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: 76, lineHeight: 1.1, letterSpacing: "-.015em", margin: 0 }}>
              <span data-reveal style={{ display: "block" }}>מרחב לנשום בו,</span>
              <span data-reveal data-reveal-delay="130" style={{ display: "block", color: "var(--color-accent-2-700)" }}>ולהתחיל מחדש.</span>
            </h1>
            <p data-reveal data-reveal-delay="260" style={{ fontSize: 20, lineHeight: 1.62, maxWidth: "46ch", margin: "30px 0 36px", color: muted(74) }}>
              לפעמים כל מה שצריך זה מקום אחד, שקט ובטוח, להניח בו את מה שכבד ולהתחיל להקשיב מחדש — לעצמכם, לזוגיות ולמשפחה.
            </p>
            <div data-reveal data-reveal-delay="400" style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
              <a href="#contact" className="pill-cta" style={{ background: "var(--color-accent-2)", color: "var(--color-bg)", fontWeight: 700, fontSize: 18, padding: "17px 36px", borderRadius: 999, boxShadow: "var(--shadow-md)" }}>בואו נדבר ←</a>
              <Link to="/about" style={{ fontWeight: 700, fontSize: 18, color: "var(--color-accent-2-800)", borderBottom: "2px solid color-mix(in srgb,var(--color-accent-2) 45%,transparent)", paddingBottom: 3 }}>קצת עליי</Link>
            </div>
          </div>
          <div style={{ flex: 0.92, display: "flex", justifyContent: "center", position: "relative" }}>
            <div data-reveal data-reveal-delay="380" style={{ position: "relative" }}>
              <div className="org-portrait" style={{ width: 400, height: 470, borderRadius: "52% 48% 46% 54%/58% 56% 44% 42%", overflow: "hidden", boxShadow: "var(--shadow-lg)", animation: "floaty 10s ease-in-out infinite" }}>
                <img src="/sharona.jpeg" alt="שרונה קדושאי בר-נס, יועצת ומטפלת רגשית" width="400" height="470" fetchpriority="high" decoding="async" className="washed" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ position: "absolute", top: -14, insetInlineEnd: 26, width: 58, height: 58, borderRadius: "50%", background: "var(--color-accent)", animation: "floaty2 7s ease-in-out infinite", boxShadow: "var(--shadow-sm)" }} />
              <div style={{ position: "absolute", bottom: 24, insetInlineStart: -22, width: 40, height: 40, borderRadius: "50%", background: "var(--color-accent-2)", animation: "floaty 6s ease-in-out infinite" }} />
              <div className="org-hide-mobile" style={{ position: "absolute", top: "38%", insetInlineStart: -40, width: 96, height: 96, border: "2px dashed color-mix(in srgb,var(--color-accent-2) 50%,transparent)", borderRadius: "50%", animation: "spinSlow 30s linear infinite" }} />
            </div>
          </div>
        </div>
      </section>

      {/* ============ MARQUEE ============ */}
      <div style={{ background: "var(--color-accent-2-800)", color: "var(--color-bg)", overflow: "hidden", whiteSpace: "nowrap", padding: "24px 0" }}>
        <div style={{ display: "inline-flex", animation: "marquee 26s linear infinite", fontFamily: "var(--font-heading)", fontSize: 32 }}>
          {Array.from({ length: 2 }).map((_, i) => (
            <span key={i} style={{ display: "inline-flex" }}>
              {["הקשבה", "חמלה", "כבוד", "נוכחות", "אמון", "צמיחה"].map((w) => (
                <React.Fragment key={w}>
                  <span style={{ padding: "0 30px" }}>{w}</span>
                  <span style={{ padding: "0 30px", color: "var(--color-accent-300)" }}>✦</span>
                </React.Fragment>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ============ ABOUT ============ */}
      <section id="about" onMouseMove={onMove} onMouseLeave={onLeave} className="org-section" style={{ position: "relative", padding: "120px 54px", background: "var(--color-bg)", overflow: "hidden" }}>
        <div style={{ position: "relative", maxWidth: 1200, margin: "0 auto", display: "flex", gap: 70, alignItems: "center" }} className="org-about">
          <div style={{ flex: 0.92, display: "flex", justifyContent: "center", position: "relative" }}>
            <div data-parallax="0.06">
              <div data-reveal className="org-portrait" style={{ width: 420, height: 500, borderRadius: "48% 52% 55% 45%/56% 46% 54% 44%", overflow: "hidden", boxShadow: "var(--shadow-lg)" }}>
                <img src="/sharona.jpeg" alt="שרונה קדושאי בר-נס" width="420" height="500" loading="lazy" decoding="async" className="washed" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            </div>
          </div>
          <div style={{ flex: 1.08 }}>
            <div data-reveal style={kicker}>קצת עליי</div>
            <h2 data-reveal data-reveal-delay="120" className="org-h2" style={{ ...h2, marginBottom: 26, maxWidth: "20ch" }}>טיפול מתוך חמלה, כבוד והקשבה אמיתית.</h2>
            <p data-reveal data-reveal-delay="220" style={{ fontSize: 19, lineHeight: 1.7, margin: "0 0 32px", color: muted(78) }}>{aboutInformation}</p>
            <div data-reveal data-reveal-delay="360" style={{ display: "flex", gap: 44, flexWrap: "wrap", paddingTop: 22, borderTop: "1.5px solid color-mix(in srgb,var(--color-text) 12%,transparent)" }}>
              <Stat value={<span data-count="20" data-suffix="+">20+</span>} label="שנות ניסיון" />
              <Stat value="יחידים · זוגות · קבוצות" label="ליווי מותאם אישית" small />
              <Stat value="עברית · אנגלית" label="שפות הטיפול" small />
            </div>
          </div>
        </div>
      </section>

      {/* ============ APPROACH ============ */}
      <section id="approach" className="org-section" style={{ position: "relative", padding: "120px 54px", background: "var(--color-surface)", overflow: "hidden" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 70 }}>
            <div data-reveal style={kicker}>המפגש הראשון והדרך שלנו יחד</div>
            <h2 data-reveal data-reveal-delay="120" className="org-h2" style={{ ...h2, maxWidth: "20ch", margin: "0 auto" }}>ארבעה צעדים, בקצב שנכון לכם</h2>
          </div>
          <div style={{ position: "relative", display: "flex", gap: 26 }} className="org-steps">
            <div className="org-steps-line" style={{ position: "absolute", top: 44, insetInline: 60, height: 2, background: "repeating-linear-gradient(90deg,color-mix(in srgb,var(--color-accent-2) 45%,transparent) 0 8px,transparent 8px 18px)" }} />
            {steps.map(([n, title, text, color], i) => (
              <div key={n} data-reveal data-reveal-delay={i * 150} style={{ position: "relative", flex: 1, textAlign: "center" }}>
                <div style={{ width: 88, height: 88, borderRadius: "50%", background: color, color: "var(--color-bg)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-heading)", fontSize: 38, margin: "0 auto 22px", boxShadow: "var(--shadow-md)" }}>{n}</div>
                <div style={{ fontFamily: "var(--font-heading)", fontSize: 23, marginBottom: 10 }}>{title}</div>
                <p style={{ margin: 0, fontSize: 16, lineHeight: 1.62, color: muted(68) }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SERVICES ============ */}
      <section id="services" className="org-section" style={{ position: "relative", padding: "120px 54px", background: "var(--color-bg)", overflow: "hidden" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: 56, maxWidth: "40ch" }}>
            <div data-reveal style={kicker}>תחומי הטיפול</div>
            <h2 data-reveal data-reveal-delay="120" className="org-h2" style={{ ...h2, fontSize: 48 }}>איך אני יכולה ללוות אתכם</h2>
          </div>
          <div className="org-services-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 26 }}>
            {services.map((s, i) => (
              <Link key={s.title} to={s.to} data-reveal data-reveal-delay={(i % 3) * 120} className="svc" style={{ background: "var(--color-surface)", borderRadius: 28, padding: 36, boxShadow: "var(--shadow-sm)", display: "block", color: "var(--color-text)" }}>
                <div className="svc-ic" style={{ width: 60, height: 60, borderRadius: "50%", background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, fontSize: 26 }}>{s.icon}</div>
                <div style={{ fontFamily: "var(--font-heading)", fontSize: 25, marginBottom: 12 }}>{s.title}</div>
                <p style={{ margin: 0, fontSize: 16.5, lineHeight: 1.66, color: muted(70) }}>{s.text}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ GALLERY (placeholder — TODO: real clinic photos) ============ */}
      <section id="gallery" onMouseMove={onMove} onMouseLeave={onLeave} className="org-section" style={{ position: "relative", padding: "120px 54px", background: "var(--color-surface)", overflow: "hidden" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div data-reveal style={kicker}>המרחב הטיפולי</div>
            <h2 data-reveal data-reveal-delay="120" className="org-h2" style={{ ...h2, maxWidth: "22ch", margin: "0 auto" }}>מקום שנעים לחזור אליו</h2>
          </div>
          <div className="org-gallery" style={{ display: "flex", gap: 22, alignItems: "flex-start" }}>
            {[
              { h: 340, r: 30, top: 0, grad: "linear-gradient(140deg,var(--color-accent-2-300),var(--color-accent-2-200))" },
              { h: 400, r: "44% 56% 52% 48%/48% 44% 56% 52%", top: 44, grad: "linear-gradient(140deg,var(--color-accent-300),var(--color-accent-200))" },
              { h: 360, r: 30, top: 0, grad: "linear-gradient(140deg,var(--color-accent-2-200),var(--color-bg))" },
              { h: 420, r: "52% 48% 46% 54%/40% 52% 48% 60%", top: 30, grad: "linear-gradient(140deg,var(--color-accent-200),var(--color-surface))" },
            ].map((g, i) => (
              <div key={i} data-parallax={[0.05, 0.11, 0.02, 0.14][i]} style={{ flex: 1, marginTop: g.top }}>
                <div data-reveal data-reveal-delay={i * 140} className="gitem" title="תמונה מהקליניקה תתווסף בקרוב" style={{ height: g.h, borderRadius: g.r, overflow: "hidden", boxShadow: "var(--shadow-md)", background: g.grad, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 34, opacity: 0.5 }}>✦</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section id="voices" className="org-section" style={{ position: "relative", padding: "120px 54px", background: "var(--color-accent-2-800)", color: "var(--color-bg)", overflow: "hidden" }}>
        <div style={{ position: "absolute", bottom: -80, insetInlineEnd: -50, width: 200, height: 200, borderRadius: "50%", border: "2px dashed color-mix(in srgb,#fff 22%,transparent)", animation: "spinSlow 40s linear infinite" }} />
        <div style={{ position: "relative", maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div data-reveal style={{ ...kicker, color: "var(--color-accent-300)" }}>מה שאומרים</div>
            <h2 data-reveal data-reveal-delay="120" className="org-h2" style={h2}>מילים של מטופלים ומטופלות</h2>
          </div>
          <div className="org-voices-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
            {voices.map((t, i) => (
              <div key={i} data-reveal data-reveal-delay={i * 150} style={{ background: "color-mix(in srgb,#fff 8%,transparent)", borderRadius: 26, padding: 34 }}>
                <div style={{ fontFamily: "var(--font-heading)", fontSize: 52, lineHeight: 0.6, color: "var(--color-accent-300)", marginBottom: 14 }}>״</div>
                <p style={{ margin: "0 0 22px", fontSize: 17, lineHeight: 1.62, display: "-webkit-box", WebkitLineClamp: 8, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{t.feedback}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 42, height: 42, borderRadius: "50%", background: "color-mix(in srgb,#fff 16%,transparent)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>{t.name.trim().charAt(0)}</div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{t.name.trim()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FAQ TEASER ============ */}
      {/* Short teaser only — the full 8 Q&As and the FAQPage schema live on /faq
          (the client asked for a dedicated FAQ page), so the two don't compete. */}
      <section id="faq" className="org-section" style={{ position: "relative", padding: "120px 54px", background: "var(--color-bg)", overflow: "hidden" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div data-reveal style={{ ...kicker, marginInline: "auto" }}>שאלות נפוצות</div>
            <h2 data-reveal data-reveal-delay="120" className="org-h2" style={{ ...h2, maxWidth: "22ch", margin: "0 auto" }}>כל מה שרציתם לדעת לפני שמתחילים</h2>
          </div>
          <FaqAccordion items={teaserFaqs} />
          <div data-reveal style={{ textAlign: "center", marginTop: 34 }}>
            <Link
              to="/faq"
              className="pill-cta"
              style={{ display: "inline-block", background: "var(--color-accent-2)", color: "var(--color-bg)", fontWeight: 700, fontSize: 17, padding: "15px 32px", borderRadius: 999, boxShadow: "var(--shadow-sm)" }}
            >
              לכל השאלות הנפוצות ←
            </Link>
          </div>
        </div>
      </section>

      {/* ============ CONTACT ============ */}
      <section id="contact" onMouseMove={onMove} onMouseLeave={onLeave} className="org-section" style={{ position: "relative", padding: "120px 54px", background: "linear-gradient(160deg,#f1ece0,#eaefe0)", overflow: "hidden" }}>
        <Blob style={{ top: -70, insetInlineEnd: -60, width: 300, height: 300 }} inner={{ borderRadius: "52% 48% 44% 56%/48% 52% 48% 52%", background: "color-mix(in srgb,var(--color-accent-2) 24%,transparent)", filter: "blur(2px)", animation: "drift 18s ease-in-out infinite" }} shift={28} />
        <div style={{ position: "relative", maxWidth: 1100, margin: "0 auto", display: "flex", gap: 64, alignItems: "center" }} className="org-contact">
          <div style={{ flex: 1 }}>
            <div data-reveal style={kicker}>בואו נתחיל</div>
            <h2 data-reveal data-reveal-delay="120" className="org-h2" style={{ ...h2, fontSize: 48, marginBottom: 24, maxWidth: "16ch" }}>הצעד הראשון מתחיל בשיחה.</h2>
            <p data-reveal data-reveal-delay="220" style={{ fontSize: 19, lineHeight: 1.7, margin: "0 0 32px", maxWidth: "40ch", color: muted(74) }}>השאירו פרטים ואחזור אליכם בהקדם לתיאום פגישת היכרות — ללא התחייבות.</p>
            <div data-reveal data-reveal-delay="320" style={{ display: "flex", flexDirection: "column", gap: 16, fontSize: 17 }}>
              <ContactRow icon="✆" href={TEL} onClick={() => trackClickToCall("home_contact_row")}>058-725-0990</ContactRow>
              <ContactRow icon="✉" href={`mailto:${EMAIL}`}>{EMAIL}</ContactRow>
              <ContactRow icon="⌂">מבשרת ציון · צור הדסה · אונליין מכל הארץ</ContactRow>
              <ContactRow icon="✦" href={WHATSAPP} onClick={() => trackWhatsappClick("home_contact_row")}>שיחה מהירה בוואטסאפ</ContactRow>
            </div>
          </div>
          <div data-reveal data-reveal-delay="200" style={{ flex: 1, background: "color-mix(in srgb,var(--color-bg) 55%,#fff)", borderRadius: 32, padding: 40, boxShadow: "var(--shadow-lg)" }}>
            <form onSubmit={sendEmail} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <input className="fin" type="text" name="name" aria-label="שם מלא" placeholder="שם מלא" required />
              <input className="fin" type="tel" name="phone" aria-label="טלפון" placeholder="טלפון" required />
              <input className="fin" type="email" name="email" aria-label="אימייל" placeholder="אימייל" />
              <textarea className="fin" name="message" rows={4} aria-label="הודעה" placeholder="כמה מילים על מה שמביא אתכם (לא חובה)" style={{ resize: "vertical" }} />
              <button type="submit" disabled={status === "sending"} className="pill-cta" style={{ background: "var(--color-accent-2)", color: "var(--color-bg)", border: "none", cursor: "pointer", fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 18, padding: 17, borderRadius: 999, boxShadow: "var(--shadow-md)", marginTop: 4, opacity: status === "sending" ? 0.7 : 1 }}>
                {status === "sending" ? "שולח..." : "שליחה ←"}
              </button>
              <div role="status" aria-live="polite">
                {status === "ok" && <p style={{ margin: 0, color: "var(--color-accent-2-800)", fontWeight: 600 }}>ההודעה נשלחה, אחזור אליכם בהקדם 🙂</p>}
                {status === "err" && <p style={{ margin: 0, color: "var(--color-accent-700)", fontWeight: 600 }}>אירעה שגיאה. נסו שוב או פנו בוואטסאפ.</p>}
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

function Blob({ style, inner, shift }) {
  return (
    <div data-parallax="0.1" style={{ position: "absolute", pointerEvents: "none", ...style }}>
      <div style={{ width: "100%", height: "100%", transform: `translate(calc(var(--nx,0)*${shift}px),calc(var(--ny,0)*${shift}px))`, transition: "transform .5s ease" }}>
        <div style={{ width: "100%", height: "100%", ...inner }} />
      </div>
    </div>
  );
}

function Stat({ value, label, small }) {
  return (
    <div>
      <div style={{ fontFamily: "var(--font-heading)", fontSize: small ? 24 : 44, color: "var(--color-accent-2-700)", lineHeight: 1.1 }}>{value}</div>
      <div style={{ fontSize: 15, color: muted(62), marginTop: 6 }}>{label}</div>
    </div>
  );
}

function ContactRow({ icon, href, children, onClick }) {
  const inner = (
    <>
      <span style={{ width: 42, height: 42, borderRadius: "50%", background: "var(--color-accent-2-200)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>{icon}</span>
      <span>{children}</span>
    </>
  );
  const style = { display: "flex", alignItems: "center", gap: 14, color: "var(--color-text)" };
  return href ? (
    <a href={href} onClick={onClick} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" style={style}>{inner}</a>
  ) : (
    <div style={style}>{inner}</div>
  );
}

export default HomePage;
