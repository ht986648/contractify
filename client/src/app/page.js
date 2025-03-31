"use client";
import { useEffect } from "react";
import ComprehensiveServices from "./components/ComprehensiveServices";
import AboutPage from "./components/AboutPage";
import ClientsSection from "./components/ClientsPage";
import ConnectUs from "./components/ConnectUsPage";
import Navbar from "./components/Navbar";
import OnboardingPage from "./components/OnboardingPage";
import TeamSection from "./components/TeamSection";
import WorkProcess from "./components/WorkProcessPage";
import ESolutionsSection from "./components/ESolutionsSection";
import Footer from "./components/Footer";
import Experiences from "./components/Experiences";

export default function Home() {
  useEffect(() => {
    // Inject Jotform Chatbot script
    const script = document.createElement("script");
    script.src = "https://cdn.jotfor.ms/s/umd/latest/for-embedded-agent.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      window.AgentInitializer?.init({
        agentRenderURL:
          "https://agent.jotform.com/01956ccfe32c7610965ec5e7677e3c139a49",
        rootId: "JotformAgent-01956ccfe32c7610965ec5e7677e3c139a49",
        formID: "01956ccfe32c7610965ec5e7677e3c139a49",
        queryParams: ["skipWelcome=1", "maximizable=1"],
        domain: "https://www.jotform.com",
        isDraggable: false,
        background: "linear-gradient(180deg, #C28500 0%, #C28500 100%)",
        buttonBackgroundColor: "#C28500",
        buttonIconColor: "#C28500",
        variant: false,
        customizations: {
          greeting: "Yes",
          greetingMessage: "Hi! How can I assist you?",
          openByDefault: "No",
          pulse: "Yes",
          position: "right",
          autoOpenChatIn: "0",
        },
        isVoice: undefined,
      });
    };

    return () => {
      document.body.removeChild(script); // Cleanup on unmount
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF4E7]">
      <Navbar />
      <OnboardingPage />
      <AboutPage />
      <ComprehensiveServices />
      <ESolutionsSection />
      <WorkProcess />
      <ClientsSection />
      <TeamSection />
      <Experiences />
      <ConnectUs />
      <Footer />
    </div>
  );
}
