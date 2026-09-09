import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Company from "./Company.tsx";
import "../index.css";
import "../styles/support.css";
import "../styles/company.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Company />
  </StrictMode>
);
