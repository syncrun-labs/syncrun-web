import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Company from "./Company.tsx";
import { LangProvider } from "../i18n/lang";
import { companyCopy } from "../i18n/company";
import "../index.css";
import "../styles/support.css";
import "../styles/company.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LangProvider meta={{ ko: companyCopy.ko.meta, en: companyCopy.en.meta }}>
      <Company />
    </LangProvider>
  </StrictMode>
);
