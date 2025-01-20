import React, { useState } from "react";

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

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
          <ul className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6  items-center p-4 md:p-0">
            <li>
              <a
                href="/about"
                className="text-palette-darkBrown hover:text-palette-lightPink"
              >
                קצת עליי
              </a>
            </li>

            <li>
              <a
                href="/articals"
                className="text-palette-darkBrown hover:text-palette-lightPink"
              >
                מאמרים
              </a>
            </li>
            <li>
              <a
                href="/workshop"
                className="text-palette-darkBrown hover:text-palette-lightPink"
              >
                סדנאות שלי
              </a>
            </li>
            <li>
              <a
                href="/experiences"
                className="text-palette-darkBrown hover:text-palette-lightPink"
              >
                תחומי המומחיות שלי
              </a>
            </li>
            <li>
              <a
                href="/Home"
                className="text-palette-darkBrown hover:text-palette-lightPink"
              >
                בית
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};
