import { useEffect, useRef, useState } from "react";
import { trackShare } from "../lib/analytics";

// Lightweight "share / send this page" control.
//  * native Web Share API (mobile) — only rendered once we know it exists
//  * WhatsApp share — always available, works on desktop + mobile
//  * copy link — fallback that works everywhere
//
// `url` must be the page's absolute canonical URL so the prerendered HTML shares
// the right address even before hydration.
export default function ShareLinks({
  url,
  title,
  label = "אהבתם? שתפו את העמוד",
  align = "flex-start",
}) {
  const [canNativeShare, setCanNativeShare] = useState(false);
  const [status, setStatus] = useState("");
  const timer = useRef(null);

  useEffect(() => {
    setCanNativeShare(typeof navigator !== "undefined" && !!navigator.share);
    return () => clearTimeout(timer.current);
  }, []);

  const say = (msg) => {
    setStatus(msg);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus(""), 3000);
  };

  const nativeShare = async () => {
    try {
      await navigator.share({ title, url });
      trackShare("web_share", url);
    } catch {
      /* user dismissed the share sheet — nothing to report */
    }
  };

  const copyLink = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        // Older Safari / non-secure contexts.
        const ta = document.createElement("textarea");
        ta.value = url;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      trackShare("copy_link", url);
      say("הקישור הועתק ✓");
    } catch {
      say("לא ניתן להעתיק — אפשר להעתיק מכתובת הדפדפן");
    }
  };

  const whatsappHref =
    "https://wa.me/?text=" + encodeURIComponent(`${title}\n${url}`);

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: align,
        gap: 12,
      }}
    >
      <span style={{ fontSize: 15, fontWeight: 700, color: "var(--color-accent-2-800)" }}>
        {label}
      </span>

      {canNativeShare && (
        <button type="button" onClick={nativeShare} className="share-btn" aria-label="שיתוף העמוד">
          <Icon d="M18 16.1a3 3 0 0 0-2 .8l-7.3-4.3c0-.2.1-.4.1-.6s0-.4-.1-.6L16 7.1a3 3 0 1 0-1-2.1v.3L7.9 9.6a3 3 0 1 0 0 4.8L15 18.7v.3a3 3 0 1 0 3-3z" />
          <span>שיתוף</span>
        </button>
      )}

      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackShare("whatsapp", url)}
        className="share-btn"
        aria-label="שיתוף העמוד בוואטסאפ"
      >
        <Icon d="M16 3.2A12.8 12.8 0 0 0 4.9 22.4L3.2 28.8l6.6-1.7A12.8 12.8 0 1 0 16 3.2zm0 23.3a10.6 10.6 0 0 1-5.4-1.5l-.4-.2-3.9 1 1-3.8-.2-.4A10.6 10.6 0 1 1 16 26.5z" box="32" />
        <span>וואטסאפ</span>
      </a>

      <button type="button" onClick={copyLink} className="share-btn" aria-label="העתקת קישור לעמוד">
        <Icon d="M16 1H4a2 2 0 0 0-2 2v14h2V3h12V1zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H8V7h11v14z" />
        <span>העתקת קישור</span>
      </button>

      {/* Feedback for the copy action, announced to screen readers. */}
      <span role="status" aria-live="polite" style={{ fontSize: 14, color: "var(--color-accent-2-700)", fontWeight: 600 }}>
        {status}
      </span>
    </div>
  );
}

function Icon({ d, box = 24 }) {
  return (
    <svg
      width="17"
      height="17"
      viewBox={`0 0 ${box} ${box}`}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d={d} />
    </svg>
  );
}
