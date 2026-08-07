// Shared organic-design style tokens, reused across every page so the look
// stays consistent. Kept as plain JS style objects (no JSX).

export const kicker = {
  fontSize: 14,
  fontWeight: 700,
  letterSpacing: ".14em",
  color: "var(--color-accent-2-700)",
  textTransform: "uppercase",
  marginBottom: 16,
};

export const h2 = {
  fontFamily: "var(--font-heading)",
  fontWeight: 400,
  fontSize: 46,
  lineHeight: 1.18,
  margin: 0,
};

export const muted = (p = 74) =>
  `color-mix(in srgb, var(--color-text) ${p}%, transparent)`;
