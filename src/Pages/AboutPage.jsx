import React from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { aboutInformation } from "../information/information";
import { ContactInfo } from "../components/ContactInfo";

function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-palette-brite text-gray-800 zoom-80">
      <main className="flex-1">
        {/* Hero Section */}

        <section className="relative h-80 bg-palette-softPeach text-palette-darkBrown flex items-center justify-center shadow-lg overflow-hidden">
          {/* Hero Content */}
          <div className="text-center animate-fade-in-down z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
              קצת עליי
            </h1>
            <p className="text-lg  md:text-xl font-light text-center mx-96">
              בעלת ניסיון רב שנים בטיפול ביחידים, זוגות, הורים ומשפחות. בתפיסתי
              הטיפולית אני שמה דגש על התאמה רגישה של מאפייני הטיפול לצרכיו
              הייחודיים של האדם שמולי, תוך שיתוף בתהליך כולו. במסגרת הקליניקה
              אני משלבת מספר גישות טיפוליות, לשם פתרון מורכבויות מן הבסיס, תוך
              מתן ייעוץ וכלים פרקטיים להתמודדות יעילה ביומיום
            </p>
          </div>
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 md:left-auto md:right-12 mb-28 ">
            <img
              src="/sharona.jpeg"
              alt="Person"
              className="w-32 h-40 md:w-48 md:h-56 rounded-full border-4 border-palette-darkBrown shadow-lg"
            />
          </div>

          {/* Full-Screen Wave */}
          <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none"></div>
        </section>

        {/* Content Sections */}
        <section className="container mx-auto px-6 py-12" dir="rtl">
          <div className="flex flex-col md:flex-row gap-12">
            {/* Left Section */}
            <div className="md:w-1/2 bg-white shadow-md rounded-lg p-8">
              <h2 className="text-3xl font-bold text-palette-darkBrown mb-6">
                השכלה אקדמאית והכשרות
              </h2>
              <ul className="space-y-4 text-gray-700">
                <li>
                  בעלת תואר ראשון ותואר שני בייעוץ חינוכי, אוניברסיטת בר אילן
                </li>
                <li>בעלת תואר שני נוסף במנהל עסקים MBA, אוניברסיטת בר אילן </li>
                <li>בוגרת בית הספר למנהיגות חינוכית של קרן מנדל ישראל</li>
                <li>בוגרת קורס דירקטורים, המכללה למנהל</li>
                <li className="font-bold text-palette-darkBrown text-xl">
                  הכשרות נוספות:
                </li>
                <li>
                  דמיון מודרך ככלי טיפולי, אקסס בארס, היפנותרפיה -בדגש על טיפול
                  בטראומה', טיפול בטראומה בדינמיקה זוגית, ריפוי הילד הפנימי,
                  זיכרונות ילדות
                </li>
              </ul>
            </div>

            {/* Right Section */}
            <div className="md:w-1/2 bg-white shadow-md rounded-lg p-8">
              <h2 className="text-3xl font-bold text-palette-darkBrown mb-6">
                פרטים מקצועיים
              </h2>
              <div className="flex gap-12 text-gray-700">
                <div className="flex-1 space-y-4">
                  <p>
                    <strong className="text-gray-800">מקצוע:</strong> מטפלת
                    זוגית ומשפחתית
                  </p>
                  <p>
                    <strong className="text-gray-800">שנות ותק:</strong> 15
                  </p>
                  <p>
                    <strong className="text-gray-800">מטופלים עד כה:</strong>{" "}
                    300
                  </p>
                  <p>
                    <strong className="text-gray-800">שעות פעילות:</strong>{" "}
                    בוקר/צהרים/ערב בתיאום מראש
                  </p>{" "}
                  <p>
                    <strong className="text-gray-800">שפות:</strong> עברית
                    אנגלית
                  </p>
                </div>
                <div className="flex-1 space-y-4">
                  <p>
                    <strong className="text-gray-800">כתובת הקליניקה:</strong>{" "}
                    צור הדסה אפשרי לשלב עם מפגשים אונליין / בזום
                  </p>
                  <p>
                    <strong className="text-gray-800">אזור הטיפול:</strong>{" "}
                    אונליין / בזום באזור ירושלים / הרי ירושלים / מבשרת ציון /
                    צור הדסה
                  </p>
                  <p>
                    <strong className="text-gray-800">פרטים נוספים:</strong>{" "}
                    חניה צמודה סמוך לתחבורה ציבורית
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* My Belief Section */}
        <section className="bg-gradient-to-r from-palette-lightPink to-palette-softPeach py-12">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-palette-darkBrown mb-6">
              האני מאמין שלי
            </h2>
            <p className="text-lg text-right text-gray-700 max-w-3xl mx-auto leading-relaxed ">
              {aboutInformation}
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AboutPage;
