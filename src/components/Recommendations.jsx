import React from "react";

import { Swiper, SwiperSlide } from "swiper/react";

import { Navigation } from "swiper/modules";

import "swiper/css";

import "swiper/css/navigation";

import { testimonials } from "../information/information";

function Recommendations() {
  return (
    <div className="bg-palette-beige w-full py-8 relative">
      <div className="my-4 px-4">
        <h2 className="text-2xl text-palette-darkBrown font-semibold text-center mb-6">
          לקוחות מספרים
        </h2>

        <Swiper
          navigation
          modules={[Navigation]}
          spaceBetween={20}
          slidesPerView={1}
          className="w-full max-w-4xl mx-auto relative swiper-custom-cursor"
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide
              key={index}
              className="p-10 bg-white rounded-lg shadow-lg flex flex-col items-center justify-center text-center"
            >
              <div className="text-xl font-bold text-gray-900 mb-3">
                {testimonial.name}
              </div>

              <p className="text-base text-right text-gray-700 font-medium mx-6">
                {testimonial.feedback}
              </p>

              <div className="mt-4">
                <span className="text-yellow-400 text-xl">⭐⭐⭐⭐⭐</span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <style jsx global>{`
          .swiper-custom-cursor {
            cursor: grab;
          }

          .swiper-custom-cursor:active {
            cursor: grabbing;
          }
        `}</style>
      </div>
    </div>
  );
}

export default Recommendations;
