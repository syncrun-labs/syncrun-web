import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Legal from "./Legal.tsx";
import { LangProvider } from "../i18n/lang";
import { legalCopy } from "../i18n/legal";
import "../index.css";
import "../styles/support.css";
import "../styles/legal.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LangProvider meta={{ ko: legalCopy.ko.meta, en: legalCopy.en.meta }}>
      <Legal />
    </LangProvider>
  </StrictMode>
);
