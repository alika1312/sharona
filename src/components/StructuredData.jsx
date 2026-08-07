import { Head } from "vite-react-ssg";

// Site-wide Schema.org JSON-LD. Every value here must be truthful and match
// on-page content (see AboutPage / ExperiencesPage / ContactInfo). Do not add
// credentials, reviews, addresses or phone numbers that aren't real.
const SITE = "https://sharona-bar-nes.com";

const person = {
  "@type": "Person",
  "@id": `${SITE}/#person`,
  name: "שרונה קדושאי בר-נס",
  jobTitle: "יועצת ומטפלת רגשית",
  url: `${SITE}/`,
  image: `${SITE}/sharona.jpeg`,
  knowsLanguage: ["he", "en"],
  knowsAbout: [
    "טיפול רגשי",
    "ייעוץ וטיפול זוגי",
    "הדרכת הורים",
    "טיפול במצבי משבר ולחץ",
    "טיפול בטראומה",
    "ייעוץ תעסוקתי וקריירה",
    "ליווי מנהלים וייעוץ ארגוני",
  ],
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "אוניברסיטת בר אילן" },
    {
      "@type": "EducationalOrganization",
      name: "בית הספר למנהיגות חינוכית, קרן מנדל ישראל",
    },
  ],
};

const areaServed = [
  "ירושלים",
  "הרי ירושלים",
  "מבשרת ציון",
  "צור הדסה",
  "בית שמש",
  "גוש עציון",
].map((name) => ({ "@type": "Place", name }));

const services = [
  ["טיפול רגשי", "טיפול רגשי קצר מועד ליחידים, לעיבוד רגשות, חיזוק הדימוי העצמי והקניית כלים מעשיים."],
  ["ייעוץ וטיפול זוגי", "ייעוץ וטיפול זוגי לשיפור תקשורת, קרבה ואינטימיות והתמודדות עם משברים בזוגיות."],
  ["הדרכת הורים", "התערבות פסיכו-חינוכית להורים, לשינוי דפוסים ולמתן כלים להורות מיטיבה."],
  ["טיפול בטראומה", "עיבוד ממוקד של אירועים טראומטיים בגישות מתקדמות, תוך תמיכה ורגישות."],
  ["טיפול אונליין", "מפגשי ייעוץ וטיפול בזום מכל הארץ ומחוץ לישראל."],
].map(([name, description]) => ({
  "@type": "Service",
  name,
  description,
  serviceType: name,
  provider: { "@id": `${SITE}/#practice` },
  areaServed,
  availableLanguage: ["he", "en"],
}));

const practice = {
  "@type": "ProfessionalService",
  "@id": `${SITE}/#practice`,
  name: "שרונה קדושאי בר-נס – ייעוץ וטיפול",
  url: `${SITE}/`,
  image: `${SITE}/preview.png`,
  founder: { "@id": `${SITE}/#person` },
  telephone: "+972587250990",
  email: "sharonabar5@gmail.com",
  availableLanguage: ["he", "en"],
  areaServed,
  // Clinic locality is truthful (צור הדסה); no street address supplied by client.
  address: {
    "@type": "PostalAddress",
    addressLocality: "צור הדסה",
    addressCountry: "IL",
  },
  availableChannel: {
    "@type": "ServiceChannel",
    name: "טיפול אונליין בזום",
    availableLanguage: ["he", "en"],
  },
  makesOffer: services.map((s) => ({ "@type": "Offer", itemOffered: s })),
};

const graph = {
  "@context": "https://schema.org",
  "@graph": [person, practice, ...services],
};

export default function StructuredData() {
  return (
    <Head>
      <script type="application/ld+json">{JSON.stringify(graph)}</script>
    </Head>
  );
}
