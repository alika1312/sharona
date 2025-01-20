import React, { useEffect } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Messages } from "../components/Messages";
import { InformationHome } from "../components/InformationHome";
import { Experience } from "../components/Experience";
import { ContactInfo } from "../components/ContactInfo";
import Profile from "../components/Profile";
import Recommendations from "../components/Recommendations";

// Main HomePage Component
function HomePage() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-gradient-to-b text-gray-800 zoom-80">
      <main className="flex-1">
        <Profile />
        <InformationHome />
        <Experience />
        <Recommendations />
      </main>
      <Messages />
    </div>
  );
}

export default HomePage;
