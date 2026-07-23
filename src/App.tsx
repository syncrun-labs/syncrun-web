import "./components/reactbits/reactbits.css";
import "./components/ui/ui.css";
import "./styles/sections.css";

import ClickSpark from "./components/reactbits/ClickSpark";
import Nav from "./components/sections/Nav";
import Hero from "./components/sections/Hero";
import HowItWorks from "./components/sections/HowItWorks";
import OneStart from "./components/sections/OneStart";
import LiveSession from "./components/sections/LiveSession";
import RunCard from "./components/sections/RunCard";
import Stats from "./components/sections/Stats";
import Features from "./components/sections/Features";
import CTA from "./components/sections/CTA";
import Footer from "./components/sections/Footer";

export default function App() {
  return (
    <ClickSpark>
      <Nav />
      <main>
        <Hero />
        <HowItWorks />
        <OneStart />
        <LiveSession />
        <RunCard />
        <Stats />
        <Features />
        <CTA />
      </main>
      <Footer />
    </ClickSpark>
  );
}
