import React from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Messages } from "../components/Messages";
import { experiences } from "../information/experiences";
import { ContactInfo } from "../components/ContactInfo";

export const ExperiencesPage = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-palette-brite text-gray-800 zoom-80">
      {/* Header */}

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8" dir="rtl">
        {/* Page Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-palette-darkBrown mb-8">
          תחומי המומחיות שלי
        </h1>

        {/* Experiences */}
        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <div
              key={exp.id}
              className={`flex flex-col md:flex-row ${
                index % 2 === 0 ? "md:flex-row-reverse" : ""
              } items-start md:items-stretch mb-12`}
            >
              {/* Image */}
              <div
                className={`w-full md:w-1/3 p-4 transition-transform transform hover:scale-105 ${
                  index % 2 === 0 ? "md:ml-8" : "md:mr-8"
                }`}
              >
                <img
                  src={exp.image}
                  alt={exp.title}
                  className="w-full h-full object-cover rounded-lg border-4 border-palette-softPeach shadow-md"
                />
              </div>

              {/* Content */}
              <div
                className={`w-full md:w-2/3 bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-center ${
                  index % 2 === 0 ? "md:mr-6" : "md:ml-6"
                }`}
              >
                <div className="flex items-center mb-4">
                  {/* Experience Number */}
                  <div className="w-12 h-12 rounded-full bg-palette-brown text-white flex items-center justify-center text-lg font-bold mx-4">
                    {exp.id}
                  </div>
                  <h2 className="text-2xl font-bold text-palette-darkBrown">
                    {exp.title}
                  </h2>
                </div>
                <p className="text-gray-600 mb-4">{exp.description}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
