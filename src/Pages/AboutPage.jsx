import React from "react";

import { aboutInformation } from "../information/information";

import ShowcaseAboutme from "../components/showcaseAboutme";
import { useNavigate } from "react-router";

function AboutPage() {
  const handleContactClick = () => {
    navigate("/home", { replace: false });
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }, 100); // Allow time for the navigation to complete
  };
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col font-sans bg-palette-brite text-gray-800 zoom-80">
      <main className="flex-1">
        <ShowcaseAboutme />

        {/* Content Sections */}
        <section className="container mx-auto px-6 py-12 " dir="rtl">
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
                  דמיון מודרך ככלי טיפולי, אקסס בארס, 'היפנותרפיה -בדגש על טיפול
                  בטראומה', 'טיפול בטראומה בדינמיקה זוגית', ריפוי הילד הפנימי,
                  זיכרונות ילדות
                </li>
                <p>
                  <strong className="text-gray-800">שנות ותק:</strong> 20
                </p>
                <p>
                  <strong className="text-gray-800">שפות:</strong> עברית ואנגלית
                </p>
              </ul>
            </div>

            {/* Right Section */}
            <div className="md:w-1/2 bg-white shadow-md rounded-lg p-8">
              <h2 className="text-3xl font-bold text-palette-darkBrown mb-6">
                פרטים מקצועיים
              </h2>

              <div className="flex-1 space-y-4">
                <p>
                  <strong className="text-gray-800">שעות פעילות:</strong>{" "}
                  בוקר/צהרים/ערב - בתיאום מראש
                </p>{" "}
                <p>
                  <strong className="text-gray-800">אזור הטיפול:</strong> אזור
                  ירושלים / הרי ירושלים / מבשרת ציון / צור הדסה / בית שמש / גוש
                  הציון
                </p>
                <p>
                  <strong className="text-gray-800">זום / מפגש דיגיטלי:</strong>{" "}
                  בעלת ניסיון בטיפולים בזום/ אונליין מרחבי הארץ ומחוץ לישראל
                </p>
                <p>
                  <strong className="text-gray-800">כתובת הקליניקה:</strong> צור
                  הדסה (אפשרי לשלב עם מפגשים אונליין / בזום)
                </p>
                <p> </p>
                <p>
                  <strong className="text-gray-800 ">פרטים נוספים:</strong> חניה
                  צמודה / סמוך לתחבורה ציבורית
                </p>
              </div>
              <button
                onClick={handleContactClick}
                className="bg-palette-brown hover:bg-palette-lightPink text-white font-semibold py-2.5 px-6 sm:py-3 sm:px-8 rounded-lg shadow-lg hover:shadow-xl transition-all mt-11 duration-300"
              >
                ליצירת קשר
              </button>
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
