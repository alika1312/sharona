import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

// The accessibility menu Israeli visitors expect to find on a site: bigger
// text, high contrast, underlined links, a plain font and a way to stop the
// motion. It complements the site's own accessibility (semantic markup,
// keyboard support, alt text, reduced-motion support) rather than replacing
// it. Each option is a class on <html>; the styles live in organic.css
// ("accessibility menu"). The choice is remembered per visitor.

const KEY = "sharona-a11y";
const OPTIONS = [
  ["contrast", "ניגודיות גבוהה"],
  ["links", "הדגשת קישורים"],
  ["font", "גופן קריא"],
  ["still", "עצירת אנימציות"],
];
const TEXT_STEPS = [1, 1.12, 1.25];

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
}

function apply(state) {
  const html = document.documentElement;
  OPTIONS.forEach(([k]) => html.classList.toggle(`a11y-${k}`, !!state[k]));
  const z = TEXT_STEPS[state.text || 0] || 1;
  html.style.setProperty("--a11y-zoom", String(z));
  html.classList.toggle("a11y-zoom", z !== 1);
}

export default function AccessibilityMenu() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState({});
  const btnRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    const s = load();
    setState(s);
    apply(s);
  }, []);

  const update = (next) => {
    const wasStill = !!state.still;
    setState(next);
    apply(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* private mode: the choice just isn't remembered */
    }
    // pinned sections are measured against the page size
    window.dispatchEvent(new Event("resize"));
    // Turning the motion back on needs the scroll choreography rebuilt.
    if (wasStill && !next.still) window.location.reload();
  };

  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector("button")?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    const onDown = (e) => {
      if (!panelRef.current?.contains(e.target) && !btnRef.current?.contains(e.target)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  const text = state.text || 0;

  return (
    <div className="a11y-menu">
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="a11y-panel"
        aria-label="תפריט נגישות"
        title="תפריט נגישות"
        className="a11y-toggle"
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="4.2" r="2" fill="currentColor" />
          <path d="M4.5 8.2c2.4.7 4.9 1 7.5 1s5.1-.3 7.5-1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M12 9.4v4.4m0 0-3 6.4m3-6.4 3 6.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div id="a11y-panel" ref={panelRef} role="dialog" aria-label="תפריט נגישות" className="a11y-panel">
          <div className="a11y-title">נגישות</div>

          <div className="a11y-row" role="group" aria-label="גודל טקסט">
            <span>גודל טקסט</span>
            <span className="a11y-steps">
              <button type="button" onClick={() => update({ ...state, text: Math.max(0, text - 1) })} disabled={text === 0} aria-label="הקטנת טקסט">
                א-
              </button>
              <button type="button" onClick={() => update({ ...state, text: Math.min(TEXT_STEPS.length - 1, text + 1) })} disabled={text === TEXT_STEPS.length - 1} aria-label="הגדלת טקסט">
                א+
              </button>
            </span>
          </div>

          {OPTIONS.map(([k, label]) => (
            <button
              key={k}
              type="button"
              className="a11y-opt"
              aria-pressed={!!state[k]}
              onClick={() => update({ ...state, [k]: !state[k] })}
            >
              <span>{label}</span>
              <span aria-hidden="true" className="a11y-check">{state[k] ? "✓" : ""}</span>
            </button>
          ))}

          <button type="button" className="a11y-reset" onClick={() => update({})}>
            איפוס הגדרות
          </button>
          <Link to="/accessibility" className="a11y-link" onClick={() => setOpen(false)}>
            הצהרת נגישות
          </Link>
        </div>
      )}
    </div>
  );
}
