// Frequently-asked questions. Answers marked `todo: true` are placeholders
// awaiting the client — they render with a visible "להשלמה" note and are
// EXCLUDED from the FAQPage schema, so structured data only ever asserts
// truthful, on-page facts.
//
// Single source of truth for /faq (full list + FAQPage JSON-LD) and for the
// short teaser on the homepage.
export const faqs = [
  {
    q: "באילו תחומים את מטפלת?",
    a: "אני עוסקת בטיפול רגשי, בייעוץ ובטיפול זוגי, בהדרכת הורים, בטיפול במצבי משבר ובטראומה, וכן בייעוץ תעסוקתי וקריירה. בנוסף אני מעבירה סדנאות ליחידים, זוגות, קבוצות וארגונים.",
    teaser: true,
  },
  {
    q: "היכן מתקיימים המפגשים?",
    a: "בקליניקה בצור הדסה, וכן באזור ירושלים, הרי ירושלים, מבשרת ציון, בית שמש וגוש עציון. כמו כן ניתן לקיים מפגשים אונליין בזום מכל הארץ ומחוץ לישראל.",
    teaser: true,
  },
  {
    q: "האם אפשר לקבל טיפול אונליין?",
    a: "כן. יש לי ניסיון רב בטיפולים בזום ואונליין עם מטופלים מרחבי הארץ ומחוץ לישראל, וניתן גם לשלב מפגשים פרונטליים ואונליין באותו תהליך.",
    teaser: true,
  },
  {
    q: "באילו שפות מתקיים הטיפול?",
    a: "הטיפול מתקיים בעברית ובאנגלית.",
  },
  {
    q: "למי מתאים הטיפול?",
    a: "אני מלווה יחידים, זוגות וקבוצות, מכל המגזרים — חילונים, דתיים וחרדים — ומתאימה את הטיפול לצרכים הייחודיים של כל אחד ואחת.",
  },
  {
    q: "מה ההשכלה וההכשרה שלך?",
    a: "בעלת תואר שני בייעוץ חינוכי ותואר שני נוסף במנהל עסקים (MBA) מאוניברסיטת בר אילן, בוגרת בית הספר למנהיגות חינוכית של קרן מנדל, עם כ-20 שנות ניסיון כמנחה, יועצת ומטפלת.",
  },
  {
    q: "כמה עולה מפגש?",
    a: "עלות המפגש — לפרטים מוזמנים לפנות אליי.",
    todo: true,
  },
  {
    q: "כמה זמן נמשך מפגש וכמה מפגשים נדרשים?",
    a: "אני עובדת בעיקר בגישות של טיפול קצר מועד. משך המפגש ומספר המפגשים — לפרטים מוזמנים לפנות אליי.",
    todo: true,
  },
];

// The 3 questions shown as a teaser on the homepage (grounded answers only).
export const teaserFaqs = faqs.filter((f) => f.teaser && !f.todo);

// FAQPage JSON-LD — lives on /faq only. TODO answers are left out on purpose.
export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": "https://sharona-bar-nes.com/faq/#faq",
  inLanguage: "he",
  mainEntity: faqs
    .filter((f) => !f.todo)
    .map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
};
