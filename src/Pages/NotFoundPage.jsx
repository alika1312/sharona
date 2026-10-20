import { Link } from "react-router-dom";
import { Head } from "vite-react-ssg";
import { kicker, muted } from "../design/ui";

// Rendered for any path no route claims. It is also prerendered at /404/ so
// Apache can serve it as the ErrorDocument (see public/.htaccess) with a real
// 404 status, instead of answering every typo with the homepage.
export default function NotFoundPage() {
  return (
    <div className="organic" style={{ position: "relative" }}>
      <Head>
        <title>העמוד לא נמצא | שרונה קדושאי בר-נס</title>
        <meta name="robots" content="noindex" />
      </Head>
      <section
        className="org-section"
        style={{
          padding: "120px 54px",
          minHeight: "60vh",
          background: "linear-gradient(155deg,#f5ecdb 0%,#eef0e0 55%,#f1ecdc 100%)",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 620, margin: "0 auto" }}>
          <div style={{ ...kicker, marginInline: "auto" }}>404</div>
          <h1 className="org-h1" style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: 52, lineHeight: 1.14, margin: "0 0 20px" }}>
            העמוד לא נמצא
          </h1>
          <p style={{ fontSize: 19, lineHeight: 1.7, margin: "0 0 34px", color: muted(74) }}>
            ייתכן שהקישור שגוי או שהעמוד הועבר. אפשר לחזור לעמוד הבית או לפנות אליי ישירות.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/" className="pill-cta" style={{ background: "var(--color-accent-2)", color: "var(--color-bg)", fontWeight: 700, fontSize: 17, padding: "15px 32px", borderRadius: 999, boxShadow: "var(--shadow-md)" }}>
              לעמוד הבית ←
            </Link>
            <Link to="/#contact" className="share-btn" style={{ minHeight: 52, padding: "15px 28px", fontSize: 17 }}>
              יצירת קשר
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
