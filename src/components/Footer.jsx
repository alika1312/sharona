import React from "react";

export const Footer = () => {
  return (
    <footer className="bg-palette-darkBrown text-white py-6 zoom-80">
      <div className="container mx-auto px-6 text-center space-y-4">
        <p>
          &copy; {new Date().getFullYear()} שרונה קדושאי בר-נס. כל הזכויות
          שמורות.
        </p>
        <div className="text-sm flex justify-center items-center space-x-4">
          {/* WhatsApp Icon */}
          <a
            href="https://wa.me/+972533402284"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80"
          >
            <img
              src="/whatsapp.png" // Ensure the path to your WhatsApp icon is correct
              alt="WhatsApp Icon"
              className="w-8 h-8"
            />
          </a>
          {/* Phone Icon */}
          <a href="tel:+972533402284" className="hover:opacity-80">
            <img
              src="/phone.png" // Replace with the path to your phone icon
              alt="Phone Icon"
              className="w-8 h-8"
            />
          </a>
          <p className="mb-0">האתר פותח על ידי אליקא נירקיס</p>
        </div>
      </div>
    </footer>
  );
};
