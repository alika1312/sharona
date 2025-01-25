import React from "react";
import { Link, useNavigate } from "react-router";
import { experience } from "../information/experiences";

export const Experience = () => {
  const navigate = useNavigate();

  // Replace with your image URLs

  return (
    <section className="bg-gradient-to-b from-palette-beige via-palette-brite to-white py-12 sm:py-16 relative">
      {/* Top Decorative Line */}
      <div className="absolute inset-x-0 top-0 h-0.5 sm:h-1 bg-gradient-to-r from-palette-lightPink to-palette-brown"></div>

      <div className="container mx-auto px-6" dir="rtl">
        {/* Title Section */}
        <h2 className="text-3xl sm:text-4xl font-semibold  text-center mb-8 text-palette-darkBrown tracking-wide relative">
          תחומי המומחיות שלי
        </h2>

        {/* Grid Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          {experience.map((exp, index) => (
            <div
              key={index}
              className="text-center border border-palette-brown rounded-lg p-6 shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <img
                src={exp.image}
                alt={exp.title}
                className="w-full h-44 object-cover rounded-md mb-4"
              />
              <h4 className="text-xl sm:text-2xl font-semibold mb-3 text-palette-brown">
                {exp.title}
              </h4>
              <Link
                to={`/experiences`}
                className="self-start bg-palette-brown hover:bg-palette-lightPink text-white text-sm px-3 py-1 rounded-lg mt-4 transition"
              >
                קרא/י עוד{" "}
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Decorative Line */}
      <div className="absolute inset-x-0 bottom-0 h-0.5 sm:h-1 bg-gradient-to-r from-palette-brown to-palette-lightPink"></div>
    </section>
  );
};
