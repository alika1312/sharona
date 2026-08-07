import React from "react";
import { Navigate } from "react-router-dom";
import { Head } from "vite-react-ssg";
import Layout from "./components/Layout";
import HomePage from "./Pages/HomePage";
import AboutPage from "./Pages/AboutPage";
import { ArticlesPage } from "./Pages/ArticlesPage";
import { ExperiencesPage } from "./Pages/ExperiencesPage";
import { ArticlePage } from "./Pages/ArticalPage";
import WorkshopsPage from "./Pages/WorkshopPage";
import AccessibilityPage from "./Pages/AccessibilityPage";
import { articles } from "./information/articles";

// Client redirect from the old (typo'd) paths. Marked noindex so the redirect
// stubs don't compete as duplicate content — the real pages are canonical.
function Redirect({ to }) {
  return (
    <>
      <Head>
        <meta name="robots" content="noindex" />
      </Head>
      <Navigate to={to} replace />
    </>
  );
}

// react-router data routes, consumed by vite-react-ssg for static generation.
export const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      // Legacy alias — the original site served the homepage at /home.
      { path: "home", element: <Redirect to="/" /> },
      { path: "about", element: <AboutPage /> },
      { path: "experiences", element: <ExperiencesPage /> },
      { path: "workshops", element: <WorkshopsPage /> },
      { path: "articles", element: <ArticlesPage /> },
      { path: "accessibility", element: <AccessibilityPage /> },
      {
        path: "article/:id",
        element: <ArticlePage />,
        // Pre-render one static page per article.
        getStaticPaths: () => articles.map((a) => `article/${a.id}`),
      },
      // Redirects from the previous (typo'd) paths so old links keep working.
      { path: "workshop", element: <Redirect to="/workshops" /> },
      { path: "articals", element: <Redirect to="/articles" /> },
      { path: "artical", element: <Redirect to="/articles" /> },
    ],
  },
];
