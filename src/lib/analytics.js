// Google tag (gtag.js) plumbing — GA4 today, Google Ads conversions / remarketing
// later, through the SAME loader (one script, several `config` ids).
//
// Every id is a build-time env var (see `.env.example`). NOTHING is hardcoded:
// with no env vars set the site still ships the tiny gtag bootstrap, so every
// gtag() call below is a safe no-op and no request is made to Google.
//
// TODO(שרונה / אליקא): ליצור נכס GA4 ולהזין את מזהה המדידה בקובץ `.env`:
//   VITE_GA_ID=G-XXXXXXXXXX
// וכשיופעל Google Ads:
//   VITE_GOOGLE_ADS_ID=AW-XXXXXXXXX
//   VITE_GOOGLE_ADS_CONVERSION_LABEL=AW-XXXXXXXXX/xxxxxxxxxxxxxxxxxxx
// ולאימות Search Console (אם בוחרים בשיטת תג ה-meta):
//   VITE_GOOGLE_SITE_VERIFICATION=<token>

export const GA_ID = import.meta.env.VITE_GA_ID || "";
export const GOOGLE_ADS_ID = import.meta.env.VITE_GOOGLE_ADS_ID || "";
// Full "AW-XXXX/label" send_to value for an Ads conversion action.
export const GOOGLE_ADS_CONVERSION_LABEL =
  import.meta.env.VITE_GOOGLE_ADS_CONVERSION_LABEL || "";
export const SITE_VERIFICATION =
  import.meta.env.VITE_GOOGLE_SITE_VERIFICATION || "";

// Ids the loader should be initialised with (first one is enough for the src=).
export const GTAG_IDS = [GA_ID, GOOGLE_ADS_ID].filter(Boolean);

// Canonical event names. Documented in the plan file so they can be imported as
// conversions in GA4 / Google Ads without guessing.
export const EVENTS = {
  pageView: "page_view",
  contactFormSubmit: "contact_form_submit",
  whatsappClick: "whatsapp_click",
  clickToCall: "click_to_call",
  shareLink: "share_link",
};

/** Low-level: push an event to gtag if it exists (it always does once mounted). */
export function gtagEvent(name, params = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}

/** SPA route change → GA4 page_view (the initial view is sent by `config`). */
export function trackPageView(path, title) {
  if (typeof window === "undefined") return;
  gtagEvent(EVENTS.pageView, {
    page_path: path,
    page_location: window.location.href,
    page_title: title,
  });
}

// ---- conversions the client asked to measure ----

export const trackContactFormSubmit = (formLocation = "home_contact") => {
  gtagEvent(EVENTS.contactFormSubmit, { form_location: formLocation });
  // When an Ads conversion action exists, the same submit also reports there.
  if (GOOGLE_ADS_CONVERSION_LABEL) {
    gtagEvent("conversion", { send_to: GOOGLE_ADS_CONVERSION_LABEL });
  }
};

export const trackWhatsappClick = (linkLocation) =>
  gtagEvent(EVENTS.whatsappClick, { link_location: linkLocation });

export const trackClickToCall = (linkLocation) =>
  gtagEvent(EVENTS.clickToCall, { link_location: linkLocation });

export const trackShare = (method, contentUrl) =>
  gtagEvent(EVENTS.shareLink, { method, content_url: contentUrl });
