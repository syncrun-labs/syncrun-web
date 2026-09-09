import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Support from "./Support.tsx";
import { LangProvider } from "../i18n/lang";
import { supportCopy } from "../i18n/support";
import "../index.css";
import "../styles/support.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LangProvider meta={{ ko: supportCopy.ko.meta, en: supportCopy.en.meta }}>
      <Support />
    </LangProvider>
  </StrictMode>
);
