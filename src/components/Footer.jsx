import React from "react";

export const Footer = () => {
  return (
    <footer className="bg-palette-darkBrown text-white py-6 zoom-80">
      <div className="container mx-auto px-6 text-center">
        <p>
          &copy; {new Date().getFullYear()} שרונה קדושאי בר-נס. כל הזכויות
          שמורות
        </p>
      </div>
    </footer>
  );
};
