import { Outlet, ScrollRestoration } from "react-router-dom";
import { Head } from "vite-react-ssg";
import { Header } from "./Header";
import { Footer } from "./Footer";
import StructuredData from "./StructuredData";
import Analytics from "./Analytics";
import { SITE } from "../information/contact";

// Shared shell for every route: site-wide head defaults, header, page, footer.
// Per-page <Head> tags override these defaults (react-helmet-async dedupes by
// name/property, innermost wins).
export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <html lang="he" dir="rtl" />
        <meta charSet="utf-8" />
        <title>שרונה קדושאי בר-נס | טיפול רגשי, ייעוץ זוגי והדרכת הורים</title>
        <meta
          name="description"
          content="שרונה קדושאי בר-נס – יועצת ומטפלת בטיפול רגשי, ייעוץ זוגי, הדרכת הורים, טראומה ומשבר. טיפול קצר מועד, אונליין ובאזור ירושלים ומבשרת ציון."
        />
        <meta property="og:site_name" content="שרונה קדושאי בר-נס" />
        <meta property="og:locale" content="he_IL" />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content={`${SITE}/preview.jpg`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:image"
          content={`${SITE}/preview.jpg`}
        />
      </Head>
      <StructuredData />
      <Analytics />
      <a href="#main" className="skip-link">דילוג לתוכן הראשי</a>
      <Header />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
      {/* Without this a client-side navigation keeps the previous page's
          scroll position (a footer link opened the next page at its bottom),
          and links like /#contact never scrolled to their target. It also
          puts the position back on browser back/forward. */}
      <ScrollRestoration />
    </div>
  );
}
