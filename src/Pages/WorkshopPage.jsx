import React from "react";
import { workshops, workshopsToCEO } from "../information/workshops";
import WorkshopCard from "../components/WorkshopCard";

const WorkshopsPage = () => {
  return (
    <div className="min-h-screen bg-palette-brite py-6 zoom-80" dir="rtl">
      <div className="container mx-auto px-4 text-center">
        {/* Section 1: Regular Workshops */}
        <section className="mb-10">
          <h1 className="text-3xl font-semibold mb-6 text-gray-800">
            הסדנאות שלי
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {workshops.map((workshop, index) => (
              <WorkshopCard
                key={`workshop-${index}`}
                title={workshop.title}
                image={workshop.image}
                description={workshop.description}
              />
            ))}
          </div>
        </section>

        {/* Section 2: CEO Workshops */}
        <section className="py-6 px-4 rounded-lg  bg-palette-brite">
          <h1 className="text-3xl font-semibold mb-6 text-gray-800">
            סדנאות למנהלים
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {workshopsToCEO.map((workshop, index) => (
              <WorkshopCard
                key={`workshopToCEO-${index}`}
                title={workshop.title}
                image={workshop.image}
                description={workshop.description}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default WorkshopsPage;
