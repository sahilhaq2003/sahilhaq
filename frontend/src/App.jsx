import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Loader from "./components/Loader.jsx";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import About, { Marquee } from "./components/About.jsx";
import { Expertise, Experience, Fiverr, Skills, Education, Research, Certifications } from "./components/Sections.jsx";
import Projects from "./components/Projects.jsx";
import Contact from "./components/Contact.jsx";
import LoginPage from "./admin/pages/LoginPage.jsx";
import AdminLayout from "./admin/AdminLayout.jsx";
import { usePortfolio } from "./hooks/usePortfolio.js";
import { useReveal } from "./hooks/useReveal.js";
import { useMotion } from "./hooks/useMotion.js";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin/*" element={<AdminLayout />} />
        <Route path="/login" element={<Navigate to="/admin/login" replace />} />
        <Route path="*" element={<PortfolioHome />} />
      </Routes>
    </BrowserRouter>
  );
}

function PortfolioHome() {
  const { data } = usePortfolio();
  const [loaded, setLoaded] = useState(false);

  useReveal(loaded); // reveal animations start once the intro loader is gone
  useMotion();

  useEffect(() => {
    const scrollToSection = (id, smooth = true) => {
      const target = document.getElementById(id);
      if (target) target.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
    };

    if (window.location.pathname !== "/") {
      window.history.replaceState(null, "", "/");
      window.scrollTo(0, 0);
    }

    const onClick = (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const hash = link.getAttribute("href");
      if (!hash || hash === "#") return;
      const id = hash.slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      window.history.pushState(null, "", id === "home" ? "/" : `/${id}`);
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const onPopState = () => {
      const sec = window.location.pathname.replace(/^\/+|\/+$/g, "") || "home";
      scrollToSection(sec, true);
    };

    document.addEventListener("click", onClick);
    window.addEventListener("popstate", onPopState);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  return (
    <>
      <div id="sp" />
      <div id="cg" aria-hidden="true" />
      {!loaded && <Loader onDone={() => setLoaded(true)} />}

      <Header />
      <main>
        <Hero config={data.config} hero={data.hero} />
        <Marquee skills={data.skills} />
        <About config={data.config} about={data.about} />
        <Expertise items={data.expertise} />
        <Experience items={data.experience} />
        <Projects projects={data.projects} categories={data.categories} github={data.config.github} />
        <Fiverr config={data.config} gigs={data.gigs} fiverrProjects={data.fiverrProjects} steps={data.fiverrSteps} />
        <Skills skills={data.skills} />
        <Education education={data.education} />
        <Certifications items={data.certifications} />
        <Research items={data.research} />
      </main>
      <Contact config={data.config} footer={data.footer} />
    </>
  );
}
