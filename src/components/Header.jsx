import React, { useState } from "react";
import { Link, useNavigate } from "react-router";

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Scroll to bottom for "יצירת קשר"
  const handleContactClick = () => {
    navigate("/home", { replace: false });
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }, 100); // Allow time for navigation to complete
  };

  // Scroll to top for other links
  const handleNavigateToTop = (path) => {
    navigate(path, { replace: false });
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100); // Allow time for navigation to complete
  };

  return (
    <header className="bg-palette-brite shadow-md sticky top-0 z-50 zoom-80">
      <div className="container mx-auto py-4 px-6 flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-xl sm:text-2xl text-palette-darkBrown font-bold">
          שרונה קדושאי בר-נס
        </h1>

        {/* Hamburger Menu */}
        <button
          className="block md:hidden text-palette-darkBrown focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            className="w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>

        {/* Navigation Menu */}
        <nav
          className={`${
            menuOpen ? "block" : "hidden"
          } md:block absolute md:static top-full left-0 w-full md:w-auto bg-palette-brite md:bg-transparent shadow-md md:shadow-none`}
        >
          <ul className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 items-center p-4 md:p-0">
            <li>
              <button
                onClick={handleContactClick}
                className="text-palette-darkBrown hover:text-palette-lightPink"
              >
                יצירת קשר
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigateToTop("/articals")}
                className="text-palette-darkBrown hover:text-palette-lightPink"
              >
                מאמרים
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigateToTop("/workshop")}
                className="text-palette-darkBrown hover:text-palette-lightPink"
              >
                סדנאות
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigateToTop("/experiences")}
                className="text-palette-darkBrown hover:text-palette-lightPink"
              >
                תחומי המומחיות שלי
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigateToTop("/about")}
                className="text-palette-darkBrown hover:text-palette-lightPink"
              >
                קצת עליי
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigateToTop("/home")}
                className="text-palette-darkBrown hover:text-palette-lightPink"
              >
                בית
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};
