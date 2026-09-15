"use client";

import "./components/reactbits/reactbits.css";
import "./components/ui/ui.css";
import "./styles/sections.css";

import { LangProvider, type LangPaths } from "./i18n/lang";
import type { Lang } from "./i18n/dict";
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

export default function App({ lang, paths }: { lang: Lang; paths: LangPaths }) {
  return (
    <LangProvider lang={lang} paths={paths}>
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
