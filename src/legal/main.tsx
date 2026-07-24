import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Legal from "./Legal.tsx";
import "../index.css";
import "../styles/support.css";
import "../styles/legal.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Legal />
  </StrictMode>
);
