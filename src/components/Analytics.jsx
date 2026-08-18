import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Head } from "vite-react-ssg";
import {
  GA_ID,
  GOOGLE_ADS_ID,
  GTAG_IDS,
  SITE_VERIFICATION,
  trackPageView,
} from "../lib/analytics";

// The gtag bootstrap is emitted on EVERY prerendered page (it lives in Layout's
// <Head>), so measurement works on a cold, JS-light load of any route.
// The remote loader is only added once an id exists in .env — no fake ids ship.
const bootstrap = [
  "window.dataLayer=window.dataLayer||[];",
  "function gtag(){dataLayer.push(arguments);}",
  "gtag('js',new Date());",
  // GA4. send_page_view covers the initial load; SPA navigations are sent below.
  GA_ID ? `gtag('config','${GA_ID}',{send_page_view:true});` : "",
  // Google Ads / remarketing — same loader, just another config id.
  GOOGLE_ADS_ID ? `gtag('config','${GOOGLE_ADS_ID}');` : "",
].join("");

export default function Analytics() {
  const { pathname, search, hash } = useLocation();
  const firstRender = useRef(true);

  useEffect(() => {
    // Skip the first run: gtag('config') already reported the initial page_view.
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    // Defer one tick so react-helmet-async has swapped <title> for the new route.
    const t = setTimeout(
      () => trackPageView(`${pathname}${search}${hash}`, document.title),
      0
    );
    return () => clearTimeout(t);
  }, [pathname, search, hash]);

  return (
    <Head>
      {SITE_VERIFICATION ? (
        <meta name="google-site-verification" content={SITE_VERIFICATION} />
      ) : null}
      {GTAG_IDS.length ? (
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GTAG_IDS[0]}`}
        />
      ) : null}
      <script>{bootstrap}</script>
    </Head>
  );
}
