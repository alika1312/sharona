import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const links = [
  { label: "אודות", to: "/about" },
  { label: "תחומי הטיפול", to: "/experiences" },
  { label: "סדנאות", to: "/workshops" },
  { label: "מאמרים", to: "/articles" },
];

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 30);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? y / h : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // "צרו קשר" — scroll to the contact section on the homepage.
  const handleContact = () => {
    setMenuOpen(false);
    const scrollToContact = () =>
      document
        .getElementById("contact")
        ?.scrollIntoView({ behavior: "smooth" });
    if (location.pathname === "/") {
      scrollToContact();
    } else {
      navigate("/");
      setTimeout(scrollToContact, 350);
    }
  };

  return (
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
        transition: "background .4s ease, box-shadow .4s ease",
      }}
    >
      {/* scroll progress */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          insetInline: 0,
          height: 3,
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
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: 23,
            color: "var(--color-accent-2-800)",
            whiteSpace: "nowrap",
          }}
        >
          שרונה בר־נס
        </Link>

        {/* desktop nav */}
        <nav
          aria-label="ניווט ראשי"
          className="org-hide-mobile"
          style={{ display: "flex", gap: 30, alignItems: "center" }}
        >
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="navlink">
              {l.label}
            </Link>
          ))}
          <button onClick={handleContact} className="pill-cta" style={ctaStyle}>
            צרו קשר
          </button>
        </nav>

        {/* mobile toggler */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="תפריט"
          aria-expanded={menuOpen}
          className="org-menu-btn"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 6,
          }}
        >
          <span style={burgerLine(menuOpen, 1)} />
          <span style={burgerLine(menuOpen, 2)} />
          <span style={burgerLine(menuOpen, 3)} />
        </button>
      </div>

      {/* mobile menu panel */}
      {menuOpen && (
        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
            padding: "10px 30px 26px",
            background: "color-mix(in srgb, var(--color-bg) 96%, transparent)",
          }}
        >
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setMenuOpen(false)}
              className="navlink"
              style={{ fontSize: 19 }}
            >
              {l.label}
            </Link>
          ))}
          <button
            onClick={handleContact}
            className="pill-cta"
            style={{ ...ctaStyle, alignSelf: "flex-start" }}
          >
            צרו קשר
          </button>
        </nav>
      )}
    </header>
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
  width: 26,
  height: 2.5,
  margin: "5px 0",
  borderRadius: 3,
  background: "var(--color-accent-2-800)",
  transition: "transform .3s ease, opacity .3s ease",
  transform:
    open && i === 1
      ? "translateY(7.5px) rotate(45deg)"
      : open && i === 3
      ? "translateY(-7.5px) rotate(-45deg)"
      : "none",
  opacity: open && i === 2 ? 0 : 1,
});
