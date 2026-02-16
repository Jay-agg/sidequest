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
            <style
                dangerouslySetInnerHTML={{
                    __html: `
            @keyframes pulse-orb {
              0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.2; }
              50% { transform: translate(-50%, -50%) scale(1.15); opacity: 0.35; }
            }
            @keyframes pulse-orb-2 {
              0%, 100% { transform: translate(-50%, -40%) scale(1); opacity: 0.15; }
              50% { transform: translate(-50%, -40%) scale(1.1); opacity: 0.25; }
            }
            @keyframes meteor {
              0% { transform: rotate(215deg) translateX(0); opacity: 1; }
              70% { opacity: 1; }
              100% { transform: rotate(215deg) translateX(-500px); opacity: 0; }
            }
            .animate-pulse-orb { animation: pulse-orb 6s ease-in-out infinite; }
            .animate-pulse-orb-2 { animation: pulse-orb-2 8s ease-in-out infinite; }
            .animate-meteor { animation: meteor 5s linear infinite; }
            @keyframes marquee-slow {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .animate-marquee-slow { animation: marquee-slow 20s linear infinite; }
          `,
                }}
            />

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
