import { useEffect, useState } from "react";

const ShowcaseAboutme = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check screen width on initial load and resize
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // Tailwind's `md` breakpoint is 768px
    };

    checkScreenSize(); // Check on initial load
    window.addEventListener("resize", checkScreenSize); // Add resize listener

    return () => window.removeEventListener("resize", checkScreenSize); // Cleanup
  }, []);

  return (
    <>
      {isMobile ? (
        // Mobile layout
        <main className="flex-1">
          <section className="relative h-auto bg-palette-softPeach text-palette-darkBrown flex flex-col items-center justify-center shadow-lg px-4">
            {/* Image */}
            <div className="mt-6">
              <img
                src="/sharona.jpeg"
                alt="Person"
                className="w-24 h-32 md:w-48 md:h-56 rounded-full border-4 border-palette-darkBrown shadow-lg mx-auto"
              />
            </div>
            {/* Hero Content */}
            <div className="text-center animate-fade-in-down z-10 w-full">
              <h1 className="text-3xl font-bold mb-4 drop-shadow-lg">
                קצת עליי
              </h1>
              <p className="text-base font-light mx-auto mb-4">
                בעלת ניסיון רב שנים בטיפול ביחידים, זוגות, הורים ומשפחות.
                בתפיסתי הטיפולית אני שמה דגש על התאמה רגישה של מאפייני הטיפול
                לצרכיו הייחודיים של האדם שמולי, תוך שיתוף בתהליך כולו. במסגרת
                הקליניקה אני משלבת מספר גישות טיפוליות, לשם פתרון מורכבויות מן
                הבסיס, תוך מתן ייעוץ וכלים פרקטיים להתמודדות יעילה ביומיום
              </p>
            </div>
          </section>
        </main>
      ) : (
        // Desktop layout
        <section className="relative h-80 bg-palette-softPeach text-palette-darkBrown flex items-center justify-center shadow-lg overflow-hidden">
          {/* Hero Content */}
          <div className="text-center animate-fade-in-down z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
              קצת עליי
            </h1>
            <p className="text-lg md:text-xl font-light text-center mx-96">
              בעלת ניסיון רב שנים בטיפול ביחידים, זוגות, הורים ומשפחות
            </p>
            <p className="text-lg md:text-xl font-light text-center mx-96">
              בתפיסתי הטיפולית אני שמה דגש על התאמה רגישה של מאפייני הטיפול
              לצרכיו הייחודיים של האדם שמולי, תוך שיתוף בתהליך כולו
            </p>
            <p className="text-lg md:text-xl font-light text-center mx-96">
              במסגרת הקליניקה אני משלבת מספר גישות טיפוליות, לשם פתרון מורכבויות
              מן הבסיס, תוך מתן ייעוץ וכלים פרקטיים להתמודדות יעילה ביומיום
            </p>
          </div>
          {/* Image */}
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 md:left-auto md:right-12 mb-28">
            <img
              src="/sharona.jpeg"
              alt="Person"
              className="w-32 h-40 md:w-48 md:h-56 rounded-full border-4 border-palette-darkBrown shadow-lg"
            />
          </div>
        </section>
      )}
    </>
  );
};

export default ShowcaseAboutme;
