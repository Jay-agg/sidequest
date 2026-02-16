"use client";

import Navbar from "./_components/Navbar";
import Hero from "./_components/Hero";
import BentoFeatures from "./_components/BentoFeatures";
import HowItWorks from "./_components/HowItWorks";
import FlowSection from "./_components/FlowSection";
import CTA from "./_components/CTA";
import Footer from "./_components/Footer";

export default function LandingPage() {
  return (
    <>
      <div className="bg-black text-white overflow-x-hidden">
        <Navbar />
        <Hero />
        <BentoFeatures />
        <HowItWorks />
        <FlowSection />
        <CTA />
        <Footer />
      </div>
    </>
  );
}
