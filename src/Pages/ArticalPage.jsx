import React from "react";
import { Link, useParams } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ContactInfo } from "../components/ContactInfo";
import { articles } from "../information/articles";

export const ArticlePage = () => {
  const { id } = useParams();
  const article = articles.find((article) => article.id.toString() === id);

  if (!article) {
    return <div>המאמר לא נמצא</div>;
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50 text-gray-800 zoom-80">
      <main className="flex-grow py-12 px-4 md:px-16 bg-gray-100">
        <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden animate-fade-in-up">
          {/* Image */}
          <div className="relative h-64 md:h-80">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black opacity-50"></div>
            <h1 className="absolute bottom-4 right-4 text-3xl md:text-4xl text-white font-bold">
              {article.title}
            </h1>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8" dir="rtl">
            <p className="text-sm text-gray-400 mb-4 animate-slide-in">
              <span className="mr-2">🕒</span>
              {article.readTime}
            </p>

            {article.content.map((section, index) => (
              <div key={index} className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  {section.sectionTitle}
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4 animate-fade-in">
                  {section.sectionFirstText}
                </p>
                <p className="text-gray-700 leading-relaxed animate-fade-in">
                  {section.sectionSecondText}
                </p>
              </div>
            ))}
            <Link
              to={`/articals`}
              className="self-start bg-palette-brown hover:bg-palette-lightPink text-white text-sm px-3 py-1 rounded-lg  transition"
            >
              חזרה
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};
