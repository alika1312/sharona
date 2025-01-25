import React from "react";
import emailjs from "emailjs-com";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const sendEmail = (e) => {
  e.preventDefault(); // Prevents the default form submission behavior

  emailjs
    .sendForm(
      "service_vuk7ooe", // Replace with your EmailJS service ID
      "template_jeein3i", // Replace with your EmailJS template ID
      e.target,
      "3BSgxbEsCuxc0KZUL" // Replace with your EmailJS user ID
    )
    .then(
      (result) => {
        toast.success("ההודעה נשלחה בהצלחה!");
      },
      (error) => {
        toast.error("חלה שגיאה בשליחת ההודעה. נסה שוב מאוחר יותר.");
      }
    );
  e.target.reset(); // Reset the form after submission
};

export const Messages = () => {
  return (
    <section className="relative bg-pink-500 py-12 overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/brown_BG.png')",
        }}
      ></div>

      {/* Content */}
      <div className="relative container mx-auto px-6 text-right text-white z-10">
        {/* Title */}
        <h3 className="text-2xl sm:text-3xl font-bold mb-4 flex items-center justify-end text-palette-darkBrown">
          <span>שלח/י הודעה לשרונה קדושאי בר-נס</span>
        </h3>

        {/* Subtitle */}
        <p className="mb-6 text-palette-darkBrown">
          ליצירת קשר אנא מלאו פרטים ואחזור אליכם בהקדם
        </p>

        {/* Contact Form */}
        <form className="space-y-4" dir="rtl" onSubmit={sendEmail}>
          {/* Input Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <input
              type="text"
              name="name" // Name attribute required by EmailJS
              placeholder="* שם הפונה"
              className="p-3 rounded-md text-gray-800 bg-palette-brite focus:outline-none focus:ring-2 focus:ring-palette-brown"
              required
            />
            <input
              dir="rtl"
              type="tel"
              name="phone" // Name attribute required by EmailJS
              placeholder="* טלפון"
              className="p-3 rounded-md text-gray-800 bg-palette-brite focus:outline-none focus:ring-2 focus:ring-palette-brown"
              required
            />
            <input
              type="email"
              name="email" // Name attribute required by EmailJS
              placeholder="אימייל"
              className="p-3 rounded-md text-gray-800 bg-palette-brite focus:outline-none focus:ring-2 focus:ring-palette-brown"
            />
          </div>

          {/* Textarea */}
          <textarea
            name="message" // Name attribute required by EmailJS
            placeholder="סיבת הפניה"
            className="w-full p-3 rounded-md text-gray-800 bg-palette-brite focus:outline-none focus:ring-2 focus:ring-palette-brown h-32"
          ></textarea>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-white text-palette-brown font-bold py-2 px-8 rounded hover:bg-palette-beige transition duration-300"
          >
            שלח/י
          </button>
        </form>
      </div>

      {/* Toast Container */}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </section>
  );
};
