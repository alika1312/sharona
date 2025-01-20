import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router";
import { Header } from "./components/Header.jsx";
import { ContactInfo } from "./components/ContactInfo.jsx";
import { Footer } from "./components/Footer.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Header />
    <App />
    <ContactInfo />
    <Footer />
  </BrowserRouter>
);
