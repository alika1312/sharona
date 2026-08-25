import { Link } from "react-router-dom";
import { ContactInfo } from "./ContactInfo";

const cols = [
  [
    { label: "אודות", to: "/about" },
    { label: "תחומי הטיפול", to: "/experiences" },
    { label: "סדנאות", to: "/workshops" },
  ],
  [
    { label: "מאמרים", to: "/articles" },
    { label: "שאלות נפוצות", to: "/faq" },
    { label: "צרו קשר", to: "/#contact" },
    { label: "הצהרת נגישות", to: "/accessibility" },
  ],
];

export const Footer = () => {
  return (
    <>
      <ContactInfo />
      <footer
        style={{
          background: "var(--color-accent-2-900)",
          color: "color-mix(in srgb, #fff 82%, transparent)",
          padding: "80px 54px 40px",
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
            alignItems: "flex-start",
            gap: 40,
            flexWrap: "wrap",
          }}
        >
          <div style={{ maxWidth: "32ch" }}>
            {/* On the homepage motion.js splits this into letters that
                scatter away from the cursor; elsewhere it's plain text. */}
            <div
              data-footer-name
              style={{
                position: "relative",
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(30px,4.4vw,56px)",
                lineHeight: 1.15,
                color: "var(--color-bg)",
                marginBottom: 18,
              }}
            >
              שרונה קדושאי בר-נס
            </div>
            <p
              style={{
                margin: 0,
                fontSize: 16,
                lineHeight: 1.66,
                color: "color-mix(in srgb, #fff 62%, transparent)",
              }}
            >
              יועצת ומטפלת רגשית. טיפול רגשי, ייעוץ זוגי, הדרכת הורים וטיפול
              במשבר ובטראומה — אונליין ובאזור ירושלים ומבשרת ציון.
            </p>
          </div>
          <div style={{ display: "flex", gap: 50, flexWrap: "wrap" }}>
            {cols.map((col, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  fontSize: 16,
                }}
              >
                {col.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    style={{ color: "color-mix(in srgb, #fff 72%, transparent)" }}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div
          style={{
            maxWidth: 1200,
            margin: "44px auto 0",
            paddingTop: 24,
            borderTop: "1px solid color-mix(in srgb, #fff 14%, transparent)",
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
            fontSize: 14,
            color: "color-mix(in srgb, #fff 50%, transparent)",
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
