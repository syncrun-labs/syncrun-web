import "./components/reactbits/reactbits.css";
import "./components/ui/ui.css";
import "./styles/sections.css";

import { useEffect } from "react";
import { LangProvider } from "./i18n/lang";
import ClickSpark from "./components/reactbits/ClickSpark";
import Nav from "./components/sections/Nav";
import Hero from "./components/sections/Hero";
import OneStart from "./components/sections/OneStart";
import Bump from "./components/sections/Bump";
import LiveSession from "./components/sections/LiveSession";
import RunCard from "./components/sections/RunCard";
import Activity from "./components/sections/Activity";
import Features from "./components/sections/Features";
import CTA from "./components/sections/CTA";
import Footer from "./components/sections/Footer";

export default function App() {
  // 스냅 스크롤 활성화(미디어쿼리가 reduced-motion·모바일을 게이트한다).
  useEffect(() => {
    document.documentElement.classList.add("snap");
    return () => document.documentElement.classList.remove("snap");
  }, []);

  return (
    <LangProvider>
      <ClickSpark sparkColor="#DC565B">
        <Nav />
        <main>
          <Hero />
          <OneStart />
          <Bump />
          <LiveSession />
          <RunCard />
          <Activity />
          <Features />
          <CTA />
        </main>
        <Footer />
      </ClickSpark>
    </LangProvider>
  );
}
