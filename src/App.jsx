import { Navigate, Route, Routes } from "react-router";
import HomePage from "./Pages/HomePage";
import AboutPage from "./Pages/AboutPage";
import { ArticlesPage } from "./Pages/ArticlesPage";
import { ExperiencesPage } from "./Pages/ExperiencesPage";
import { ArticlePage } from "./Pages/ArticalPage";
import WorkshopsPage from "./Pages/WorkshopPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate replace to="/Home" />} />
      <Route path="/Home" element={<HomePage />} />
      <Route path="/workshop" element={<WorkshopsPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/articals" element={<ArticlesPage />} />
      <Route path="/artical" element={<ArticlePage />} />
      <Route path="/experiences" element={<ExperiencesPage />} />
      <Route path="/article/:id" element={<ArticlePage />} />
    </Routes>
  );
}

export default App;
