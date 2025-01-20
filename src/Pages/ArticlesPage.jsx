import React from "react";
import { Link } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ContactInfo } from "../components/ContactInfo";
import { articles } from "../information/articles";

export const ArticlesPage = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-palette-brite text-gray-800 zoom-80">
      <main className="flex-grow bg-palette-brite py-12">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold text-center text-palette-darkBrown mb-8">
            המאמרים שלי
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8" dir="rtl">
            {articles.map((article) => (
              <div
                key={article.id}
                className="bg-white shadow-lg rounded-lg overflow-hidden"
              >
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-56 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-2xl font-semibold text-palette-darkBrown mb-4">
                    {article.title}
                  </h3>
                  <p className="text-gray-700 mb-4">{article.description}</p>
                  <Link
                    to={`/article/${article.id}`}
                    className="self-start bg-palette-brown hover:bg-palette-lightPink text-white text-sm px-3 py-1 rounded-lg  transition"
                  >
                    קרא עוד
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
