import React from "react";
import { useNavigate } from "react-router";

export const Experience = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-gradient-to-b from-palette-beige via-palette-brite to-white py-12 sm:py-16 relative">
      {/* Top Decorative Line */}
      <div className="absolute inset-x-0 top-0 h-0.5 sm:h-1 bg-gradient-to-r from-palette-lightPink to-palette-brown"></div>

      <div className="container mx-auto px-6" dir="rtl">
        {/* Title Section */}
        <h2 className="text-3xl sm:text-4xl font-semibold  text-center mb-8 text-palette-darkBrown tracking-wide relative">
          ניסיון מקצועי
          <span className="block h-1 w-16 bg-palette-brown rounded-full mx-auto mt-2"></span>
        </h2>

        {/* Grid Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          <div className="text-center border border-palette-brown rounded-lg p-6 shadow-lg hover:shadow-2xl transition-all duration-300">
            <h4 className="text-xl sm:text-2xl font-semibold mb-3 text-palette-brown">
              יעוץ במעברי קריירה
            </h4>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              אני מספקת לך ליווי מותאם אישית כדי לעזור לך לנווט בהצלחה במעברי
              קריירה, מעצימה אותך לאמץ הזדמנויות חדשות ולהשיג הצלחה מקצועית.
            </p>
          </div>
          <div className="text-center border border-palette-brown rounded-lg p-6 shadow-lg hover:shadow-2xl transition-all duration-300">
            <h4 className="text-xl sm:text-2xl font-semibold mb-3 text-palette-brown">
              ליווי בתהליכי פרידה וגירושין בכבוד
            </h4>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              הגישה האמפתית שלי עוזרת לך להתמודד עם המורכבות של תהליכי פרידה
              וגירושין, תוך שמירה על רווחה רגשית ושיפור התוצאות לכל המעורבים.
            </p>
          </div>
          <div className="text-center border border-palette-brown rounded-lg p-6 shadow-lg hover:shadow-2xl transition-all duration-300">
            <h4 className="text-xl sm:text-2xl font-semibold mb-3 text-palette-brown">
              הדרכת הורים
            </h4>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              אני מציעה לך תמיכה מקצועית כהורה, שמסייעת לבנות קשר חזק יותר עם
              ילדיך, לשפר את התקשורת, לחזק את האמון ולתמוך בהתמודדות עם אתגרי
              ההורות.
            </p>
          </div>
          <div className="text-center border border-palette-brown rounded-lg p-6 shadow-lg hover:shadow-2xl transition-all duration-300">
            <h4 className="text-xl sm:text-2xl font-semibold mb-3 text-palette-brown">
              יעוץ זוגי
            </h4>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              באמצעות ייעוץ מותאם אישית, אני תומכת בזוגות בהחזרת הקשר ביניהם,
              פתרון קונפליקטים, והחזרת אינטימיות, תוך יצירת קשרים בריאים ומספקים
              יותר.
            </p>
          </div>
          <div className="text-center border border-palette-brown rounded-lg p-6 shadow-lg hover:shadow-2xl transition-all duration-300">
            <h4 className="text-xl sm:text-2xl font-semibold mb-3 text-palette-brown">
              טיפול במשברי חיים
            </h4>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              אני מספקת טיפול מקצועי ותמיכה במהלך האתגרים הקשים ביותר בחיים,
              עוזרת לך לשוב ולהתייצב, לחזור לאיזון ולהפוך את המשבר למקור לצמיחה
              ולחוזק אישי.
            </p>
          </div>
        </div>

        {/* Button Section */}
        <div className="flex justify-center mt-10">
          <button
            onClick={() => navigate("/experiences")}
            className="bg-palette-brown hover:bg-palette-lightPink text-white font-semibold py-2.5 px-6 sm:py-3 sm:px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            לעוד מידע על ההתמחויות שלי
          </button>
        </div>
      </div>

      {/* Bottom Decorative Line */}
      <div className="absolute inset-x-0 bottom-0 h-0.5 sm:h-1 bg-gradient-to-r from-palette-brown to-palette-lightPink"></div>
    </section>
  );
};
