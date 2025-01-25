import React from "react";

export const InformationHome = () => {
  return (
    <section
      className="relative py-12 overflow-hidden"
      style={{
        backgroundImage: "url('/leafs.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-white opacity-90 backdrop-blur-md"></div>

      {/* Content Container */}
      <div className="relative container mx-auto px-6 flex flex-col items-center">
        {/* Title Section */}
        <h3 className="text-3xl sm:text-4xl font-semibold text-palette-darkBrown mb-6 animate-fadeInUp text-center">
          רקע וניסיון מקצועי
        </h3>

        {/* Information Box */}
        <div className="bg-palette-brite p-6 sm:p-8 rounded-lg shadow-lg text-right max-w-3xl sm:max-w-4xl animate-slideInLeft">
          <p className="text-gray-600 text-base sm:text-lg mb-4 leading-relaxed">
            במשך שנים עסקתי בייעוץ והנחייה במקביל לניהול מערכות חינוך. את דרכי
            המקצועית התחלתי כיועצת חינוכית לתלמידי תיכון וחטיבת הביניים, במתן
            מענים לקשיים רגשיים, חרדה ממבחנים ולקויות למידה. בשלב הבא עסקתי
            בייעוץ למלש"בים והכנה רגשית לקראת השירות הצבאי, במסגרת מכינה קד"צ.
            לאחר מכן עסקתי בייעוץ לסטודנטים והכוונתם ללימודים ובחירת מקצוע
          </p>
          <p className="text-gray-600 text-base sm:text-lg mb-4">
            בעשר השנים האחרונות אני מתמקדת בעיקר בטיפול במבוגרים, נשים וגברים,
            בהם מנהלים/ות ובכירים/ות - הן בהתמודדות עם משברי חיים ושינויים והן
            בהיבטים מקצועיים בדגש על מעברי קריירה ומתן כלים להתמודדות אל מול
            מציאות משתנה. בשש השנים האחרונות ניתבתי את ניסיוני המקצועי למתן
            ייעוץ זוגי וליווי בהתמודדות עם סיטואציות משפחתיות מורכבות, הבניית
            תקשורת אפקטיבית, חיזוק הקשר והאינטימיות
          </p>
          <p className="text-gray-600 text-base sm:text-lg mb-4">
            כמו כן, אני מלווה ומייעצת בתהליכי פרידה וגירושין מתוך כבוד הדדי
            ולטובת הילדים. אני מדריכה הורים ומסייעת להם לבנות חזון משפחתי מקדם,
            לשפר את היחסים עם ילדיהם, לפתור בעיות באופן יעיל ולהתמודד עם אתגרים
          </p>
          <p className="text-gray-600 text-base sm:text-lg mb-4">
            בשנה האחרונה, לאחר סיום הכשרה אינטנסיבית בקורס 'היפנותרפיה בדגש על
            טיפול בטראומות', אני מטפלת גם בחיילי ובחיילות במילואים ובני זוגם/ן,
            וכן באנשים ובנשים שנכחו באירועים קשים או/ו חוו אובדן
          </p>
        </div>
      </div>
    </section>
  );
};
