import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import HomePage from "./pages/home.tsx";
import "./style.css";
import AppPage from "./pages/app.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/apps/install/:id" element={<AppPage install />} />
        <Route path="/apps/:id" element={<AppPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
