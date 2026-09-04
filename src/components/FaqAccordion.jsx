import { useId, useState } from "react";
import { muted } from "../design/ui";

// Accessible disclosure item: <button aria-expanded aria-controls> + labelled panel.
// The panel stays in the DOM (hidden) so its text is present in the prerendered
// HTML for crawlers and in-page search.
function FaqItem({ q, a, todo, headingLevel = 3 }) {
  const H = `h${headingLevel}`;
  const [open, setOpen] = useState(false);
  const id = useId();
  const panelId = `faq-panel-${id}`;
  const btnId = `faq-btn-${id}`;

  return (
    <div
      data-reveal
      className="faq-row"
      style={{
        background: "var(--color-surface)",
        borderRadius: 20,
        boxShadow: "var(--shadow-sm)",
        overflow: "hidden",
      }}
    >
      <H style={{ margin: 0 }}>
        <button
          id={btnId}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={panelId}
          className="faq-row-q"
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "22px 26px",
            minHeight: 56,
            textAlign: "start",
            fontFamily: "var(--font-heading)",
            fontWeight: 400,
            fontSize: 20,
            lineHeight: 1.35,
            color: "var(--color-accent-2-800)",
          }}
        >
          <span>{q}</span>
          <span
            aria-hidden="true"
            style={{
              flex: "none",
              fontSize: 24,
              transition: "transform .3s ease",
              transform: open ? "rotate(45deg)" : "none",
              color: "var(--color-accent)",
            }}
          >
            +
          </span>
        </button>
      </H>
      <div
        id={panelId}
        role="region"
        aria-labelledby={btnId}
        hidden={!open}
        className="faq-row-a"
        style={{ padding: "0 26px 24px", fontSize: 17, lineHeight: 1.72, color: muted(78) }}
      >
        <p style={{ margin: 0 }}>{a}</p>
        {todo && (
          <p
            style={{
              margin: "10px 0 0",
              fontSize: 13.5,
              fontWeight: 700,
              color: "var(--color-accent-700)",
            }}
          >
            ⚠ להשלמה על ידי שרונה
          </p>
        )}
      </div>
    </div>
  );
}

export default function FaqAccordion({ items, headingLevel = 3 }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {items.map((f) => (
        <FaqItem key={f.q} headingLevel={headingLevel} {...f} />
      ))}
    </div>
  );
}
