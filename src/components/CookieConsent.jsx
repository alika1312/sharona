import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CONSENT_KEY, GTAG_IDS, setAnalyticsConsent } from "../lib/analytics";

// Cookie notice. The site sets no cookies of its own; the only ones come from
// Google Analytics / Ads, and only once a measurement id is configured. Until
// the visitor agrees, gtag runs in Consent Mode with storage denied (see
// Analytics.jsx), so nothing is stored on their device. Required in spirit by
// Israel's Privacy Protection Law (amendment 13, in force since Aug 2025) and
// in letter by the GDPR for visitors in Europe, many of whom this site serves
// (Israelis abroad).
//
// With no analytics id configured there is nothing to consent to, so the
// banner never shows.

export const OPEN_EVENT = "sharona:cookie-settings";

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!GTAG_IDS.length) return;
    let choice = null;
    try {
      choice = localStorage.getItem(CONSENT_KEY);
    } catch {
      /* no storage: ask every visit */
    }
    if (!choice) setShow(true);
    const reopen = () => setShow(true);
    window.addEventListener(OPEN_EVENT, reopen);
    return () => window.removeEventListener(OPEN_EVENT, reopen);
  }, []);

  if (!show) return null;

  const choose = (granted) => {
    setAnalyticsConsent(granted);
    setShow(false);
  };

  return (
    <div role="region" aria-label="הודעה על עוגיות" className="cookie-bar">
      <p>
        האתר משתמש בעוגיות של Google Analytics כדי להבין איך משתמשים בו ולשפר
        אותו. אפשר לאשר או לסרב, והאתר יעבוד כרגיל בכל מקרה.{" "}
        <Link to="/privacy">מדיניות הפרטיות</Link>
      </p>
      <div className="cookie-actions">
        <button type="button" className="cookie-yes" onClick={() => choose(true)}>
          אישור
        </button>
        <button type="button" className="cookie-no" onClick={() => choose(false)}>
          סירוב
        </button>
      </div>
    </div>
  );
}
