import { useState } from "react";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import ProblemSection from "../components/ProblemSection";
import HowItWorksSection from "../components/HowItWorksSection";
import WhatYouGetSection from "../components/WhatYouGetSection";
import PricingSection from "../components/PricingSection";
import ProofSection from "../components/ProofSection";
import FAQSection from "../components/FAQSection";
import LeadFormSection from "../components/LeadFormSection";
import Footer from "../components/Footer";

export default function LandingPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const openAuditForm = () => {
    scrollToSection("lead-form");
  };

  return (
    <div className="min-h-screen bg-white">
      <Header onGetAudit={openAuditForm} scrollToSection={scrollToSection} />
      <main>
        <HeroSection onGetAudit={openAuditForm} />
        <ProblemSection />
        <HowItWorksSection />
        <WhatYouGetSection />
        <PricingSection onGetStarted={openAuditForm} />
        <ProofSection />
        <FAQSection />
        <LeadFormSection />
      </main>
      <Footer />
    </div>
  );
}
