import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Support from "./Support.tsx";
import "../index.css";
import "../styles/support.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Support />
  </StrictMode>
);
