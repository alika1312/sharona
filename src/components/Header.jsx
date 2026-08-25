import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { trackClickToCall } from "../lib/analytics";

const links = [
  { label: "אודות", to: "/about" },
  { label: "תחומי הטיפול", to: "/experiences" },
  { label: "סדנאות", to: "/workshops" },
  { label: "מאמרים", to: "/articles" },
  { label: "שאלות נפוצות", to: "/faq" },
];

const TEL = "tel:+972587250990";
const PHONE_LABEL = "058-725-0990";

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [atContact, setAtContact] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Reference point for the hide/show swing, so a small jitter doesn't
    // flip the bar — only a deliberate 70px down / 50px up does.
    let ref = window.scrollY;
    let isHidden = false;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 30);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? y / h : 0);

      if (y < 140) {
        ref = y;
        if (isHidden) {
          isHidden = false;
          setHidden(false);
        }
        return;
      }
      if (y > ref + 70 && y > 400 && !isHidden) {
        isHidden = true;
        setHidden(true);
        ref = y;
      } else if (y < ref - 50 && isHidden) {
        isHidden = false;
        setHidden(false);
        ref = y;
      } else if (isHidden ? y > ref : y < ref) {
        ref = y;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The action bar's "קביעת פגישה" is pointless once the contact form is on
  // screen, so the bar steps out of the way there.
  useEffect(() => {
    setAtContact(false);
    const target = document.getElementById("contact");
    if (!target || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => setAtContact(e.isIntersecting)),
      { rootMargin: "0px 0px -55% 0px" }
    );
    io.observe(target);
    return () => io.disconnect();
  }, [location.pathname]);

  // The drawer owns the page scroll while it's open.
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [menuOpen]);

  // Escape closes it, as a dialog-ish overlay should.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  // Route changes close the drawer.
  useEffect(() => setMenuOpen(false), [location.pathname]);

  // "צרו קשר" — scroll to the contact section on the homepage.
  const handleContact = () => {
    setMenuOpen(false);
    const scrollToContact = () =>
      document
        .getElementById("contact")
        ?.scrollIntoView({ behavior: "smooth" });
    if (location.pathname === "/") {
      // one tick, so the drawer's scroll lock is released first — scrolling a
      // locked document is a no-op
      setTimeout(scrollToContact, 0);
    } else {
      navigate("/");
      setTimeout(scrollToContact, 350);
    }
  };

  return (
    <>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 90,
          background: scrolled
            ? "color-mix(in srgb, var(--color-bg) 88%, transparent)"
            : "color-mix(in srgb, var(--color-bg) 70%, transparent)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          boxShadow: scrolled ? "var(--shadow-sm)" : "none",
          // slides away as you read down, comes back the moment you scroll up
          transform: hidden && !menuOpen ? "translateY(-115%)" : "translateY(0)",
          transition:
            "background .4s ease, box-shadow .4s ease, transform .55s cubic-bezier(.2,.7,.2,1)",
        }}
        className="org-header"
      >
        {/* scroll progress */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            insetInline: 0,
            height: 4,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress * 100}%`,
              background:
                "linear-gradient(90deg,var(--color-accent-2),var(--color-accent))",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: scrolled ? "14px 54px" : "18px 54px",
            transition: "padding .4s ease",
            maxWidth: 1280,
            margin: "0 auto",
          }}
          className="org-nav-inner"
        >
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="org-wordmark"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: 23,
              color: "var(--color-accent-2-800)",
              whiteSpace: "nowrap",
            }}
          >
            שרונה בר-נס
          </Link>

          {/* desktop nav */}
          <nav
            aria-label="ניווט ראשי"
            data-navlinks
            className="org-desktop-nav"
            style={{ display: "flex", gap: 30, alignItems: "center" }}
          >
            {links.map((l) => (
              <Link key={l.to} to={l.to} className="navlink">
                {l.label}
              </Link>
            ))}
            <button onClick={handleContact} data-magnet className="pill-cta" style={ctaStyle}>
              צרו קשר
            </button>
          </nav>

          {/* mobile toggler — two bars that cross into an × */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "סגירת תפריט" : "פתיחת תפריט"}
            aria-expanded={menuOpen}
            aria-controls="org-drawer"
            data-navtoggle
            style={{
              width: 46,
              height: 46,
              padding: 0,
              border: "none",
              background: "none",
              cursor: "pointer",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: 5,
            }}
          >
            <span data-nb style={burgerLine(menuOpen, 1)} />
            <span data-nb style={burgerLine(menuOpen, 2)} />
          </button>
        </div>
      </header>

      {/* ===================== mobile drawer ===================== */}
      <div
        id="org-drawer"
        data-drawer
        data-open={menuOpen ? "1" : ""}
        style={{ position: "fixed", inset: 0, zIndex: 96, pointerEvents: menuOpen ? "auto" : "none" }}
      >
        <div
          data-drawer-bd
          onClick={() => setMenuOpen(false)}
          style={{
            position: "absolute",
            inset: 0,
            background: "color-mix(in srgb,var(--color-accent-2-900) 48%,transparent)",
            backdropFilter: "blur(3px)",
            WebkitBackdropFilter: "blur(3px)",
            opacity: menuOpen ? 1 : 0,
            transition: "opacity .4s ease",
          }}
        />
        <nav
          aria-label="ניווט נייד"
          data-drawer-p
          style={{
            position: "absolute",
            top: 0,
            insetInlineEnd: 0,
            width: "min(86vw,340px)",
            height: "100%",
            boxSizing: "border-box",
            background: "var(--color-bg)",
            boxShadow: "var(--shadow-lg)",
            transform: menuOpen ? "none" : "translateX(-104%)",
            // visibility (not aria-hidden) keeps the closed panel out of the
            // tab order and the a11y tree, and waits for the slide-out
            visibility: menuOpen ? "visible" : "hidden",
            transition: `transform .5s cubic-bezier(.2,.7,.2,1), visibility 0s linear ${menuOpen ? "0s" : ".5s"}`,
            display: "flex",
            flexDirection: "column",
            padding: "22px 26px calc(26px + env(safe-area-inset-bottom,0px))",
            overflowY: "auto",
            textAlign: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 30 }}>
            <span style={{ fontFamily: "var(--font-heading)", fontSize: 21, color: "var(--color-accent-2-800)" }}>
              שרונה בר-נס
            </span>
            <button
              data-drawer-x
              onClick={() => setMenuOpen(false)}
              aria-label="סגירת תפריט"
              style={{
                width: 44,
                height: 44,
                marginInlineEnd: -12,
                padding: 0,
                border: "none",
                background: "none",
                color: "var(--color-accent-2-800)",
                fontSize: 28,
                lineHeight: 1,
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {links.map((l, i) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMenuOpen(false)}
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: 25,
                  color: "var(--color-text)",
                  padding: "13px 0",
                  borderBottom:
                    i < links.length - 1
                      ? "1px solid color-mix(in srgb,var(--color-text) 10%,transparent)"
                      : "none",
                }}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <button
            onClick={handleContact}
            style={{
              marginTop: "auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 54,
              border: "none",
              borderRadius: 999,
              background: "var(--color-accent-2)",
              color: "var(--color-bg)",
              fontFamily: "var(--font-body)",
              fontWeight: 700,
              fontSize: 17,
              boxShadow: "var(--shadow-sm)",
              cursor: "pointer",
            }}
          >
            קביעת פגישה
          </button>
          <div style={{ marginTop: 16, fontSize: 14, lineHeight: 1.7, color: "color-mix(in srgb,var(--color-text) 58%,transparent)" }}>
            {PHONE_LABEL}
            <br />
            מבשרת ציון · צור הדסה · אונליין
          </div>
        </nav>
      </div>

      {/* ================= mobile bottom action bar ================= */}
      <div
        data-mobar
        style={{
          position: "fixed",
          bottom: 0,
          insetInline: 0,
          zIndex: 88,
          gridTemplateColumns: "1.35fr 1fr",
          gap: 10,
          padding: "10px 16px calc(10px + env(safe-area-inset-bottom,0px))",
          background: "color-mix(in srgb,var(--color-bg) 86%,#fff)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderTop: "1px solid color-mix(in srgb,var(--color-text) 9%,transparent)",
          transform: hidden || atContact || menuOpen ? "translateY(160%)" : "none",
          transition: "transform .45s cubic-bezier(.2,.7,.2,1)",
        }}
      >
        <button
          onClick={handleContact}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 52,
            border: "none",
            borderRadius: 999,
            background: "var(--color-accent-2)",
            color: "var(--color-bg)",
            fontFamily: "var(--font-body)",
            fontWeight: 700,
            fontSize: 17,
            boxShadow: "var(--shadow-sm)",
            cursor: "pointer",
          }}
        >
          קביעת פגישה
        </button>
        <a
          href={TEL}
          onClick={() => trackClickToCall("mobile_action_bar")}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            minHeight: 52,
            borderRadius: 999,
            border: "1.5px solid color-mix(in srgb,var(--color-accent-2) 40%,transparent)",
            color: "var(--color-accent-2-800)",
            fontWeight: 700,
            fontSize: 17,
          }}
        >
          <span aria-hidden="true">✆</span> חיוג
        </a>
      </div>
    </>
  );
};

const ctaStyle = {
  background: "var(--color-accent-2)",
  color: "var(--color-bg)",
  fontWeight: 700,
  padding: "11px 24px",
  borderRadius: 999,
  boxShadow: "var(--shadow-sm)",
  border: "none",
  fontFamily: "var(--font-body)",
  fontSize: 16,
  whiteSpace: "nowrap",
};

const burgerLine = (open, i) => ({
  display: "block",
  width: 22,
  height: 2.5,
  borderRadius: 2,
  background: "var(--color-accent-2-800)",
  transition: "transform .4s cubic-bezier(.2,.7,.2,1)",
  transform: open
    ? i === 1
      ? "translateY(3.75px) rotate(45deg)"
      : "translateY(-3.75px) rotate(-45deg)"
    : "none",
});
