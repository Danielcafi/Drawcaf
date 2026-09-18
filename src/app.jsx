import Banner from "./components/Banner";
import Blog from "./components/Blog";
import Card from "./components/Card";
import FastReliable from "./components/FastReliable";
import FinalCTA from "./components/FinalCTA";
import ForEveryone from "./components/ForEveryone";
import Footer from "./components/Footer";
import GlobalReach from "./components/GlobalReach";
import HowItWorks from "./components/HowItWorks";
import Integrations from "./components/Integrations";
import Main from "./components/Main";
import MultiChannel from "./components/MultiChannel";
import Navbar from "./components/Navbar";
import Pricing from "./components/Pricing";
import Stats from "./components/Stats";
import Testimonial from "./components/Testimonial";

export default function App() {
  return (
    <>
      <Navbar />
      <div className="pt-16 md:pt-20">
        <Main />
        <HowItWorks />
        <Banner />
        <Stats />
        <Card />
        <MultiChannel />
        <GlobalReach />
        <ForEveryone />
        <FastReliable />
        <Integrations />
        <Testimonial />
        <Pricing />
        <Blog />
        <FinalCTA />
        <Footer />
      </div>
    </>
  );
}
