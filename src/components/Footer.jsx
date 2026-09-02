import { Link } from "react-router-dom";
import { ContactInfo } from "./ContactInfo";

// One flat row of links rather than two stacked columns — the footer is a
// sitemap, not a section, and it shouldn't cost a screenful.
const links = [
  { label: "אודות", to: "/about" },
  { label: "תחומי הטיפול", to: "/experiences" },
  { label: "סדנאות", to: "/workshops" },
  { label: "מאמרים", to: "/articles" },
  { label: "שאלות נפוצות", to: "/faq" },
  { label: "צרו קשר", to: "/#contact" },
  { label: "הצהרת נגישות", to: "/accessibility" },
];

export const Footer = () => {
  return (
    <>
      <ContactInfo />
      <footer
        style={{
          background: "var(--color-accent-2-900)",
          color: "color-mix(in srgb, #fff 82%, transparent)",
          padding: "38px 54px 22px",
          overflow: "hidden",
          fontFamily: "var(--font-body)",
        }}
        className="org-section"
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px 40px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ maxWidth: "38ch" }}>
            {/* On the homepage motion.js splits this into letters that
                scatter away from the cursor; elsewhere it's plain text. */}
            <div
              data-footer-name
              style={{
                position: "relative",
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(23px,2.4vw,31px)",
                lineHeight: 1.2,
                color: "var(--color-bg)",
                marginBottom: 6,
              }}
            >
              שרונה קדושאי בר-נס
            </div>
            <p
              style={{
                margin: 0,
                fontSize: 14.5,
                lineHeight: 1.55,
                color: "color-mix(in srgb, #fff 58%, transparent)",
              }}
            >
              יועצת ומטפלת רגשית — ייעוץ זוגי, הדרכת הורים וטיפול במשבר
              ובטראומה. אונליין ובאזור ירושלים.
            </p>
          </div>
          <nav
            aria-label="ניווט בתחתית העמוד"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px 24px",
              fontSize: 15,
            }}
          >
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                style={{ color: "color-mix(in srgb, #fff 72%, transparent)" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <div
          style={{
            maxWidth: 1200,
            margin: "22px auto 0",
            paddingTop: 14,
            borderTop: "1px solid color-mix(in srgb, #fff 14%, transparent)",
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
            fontSize: 13,
            color: "color-mix(in srgb, #fff 46%, transparent)",
          }}
        >
          <span>
            © {new Date().getFullYear()} שרונה קדושאי בר-נס. כל הזכויות שמורות.
          </span>
          <span>האתר פותח על ידי אליקא נירקיס</span>
        </div>
      </footer>
    </>
  );
};
