import React from 'react';
import { LandingHeader } from './components/LandingHeader';
import { HeroSection } from './components/HeroSection';
import { StatsBanner } from './components/StatsBanner';
import { DiagnosisWorkflowSteps } from './components/DiagnosisWorkflowSteps';
import { ContextSourcesShowcase } from './components/ContextSourcesShowcase';
import { ChaosLabsShowcase } from './components/ChaosLabsShowcase';
import { LiveLogStreamSection } from './components/LiveLogStreamSection';
import { SecurityArchitectureSection } from './components/SecurityArchitectureSection';
import { PricingSection } from './components/PricingSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { FaqSection } from './components/FaqSection';
import { CtaBanner } from './components/CtaBanner';
import { LandingFooter } from './components/LandingFooter';
import { LandingScrollNavigator } from './components/LandingScrollNavigator';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary selection:bg-brand-primary selection:text-white relative overflow-x-hidden font-sans transition-colors">
      {/* Background Subtle Mesh Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#64748b0f_1px,transparent_1px),linear-gradient(to_bottom,#64748b0f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Navigation Header (Permanently Frozen at Top) */}
      <LandingHeader />

      {/* Main Page Body (Offset for Fixed Header) */}
      <main className="relative z-10 pt-16">
        {/* 1. Hero Section + Interactive Studio Preview */}
        <HeroSection />

        {/* 2. KPI Metrics & Social Proof Strip */}
        <StatsBanner />

        {/* 3. 3-Step Diagnostic Methodology */}
        <DiagnosisWorkflowSteps />

        {/* 4. 4-Source Evidence Ingestion Showcase */}
        <ContextSourcesShowcase />

        {/* 5. Chaos Sandbox Scenario Catalog */}
        <ChaosLabsShowcase />

        {/* 6. Live Log Streaming WebSocket Terminal */}
        <LiveLogStreamSection />

        {/* 7. Zero-Secret Security & Network Isolation */}
        <SecurityArchitectureSection />

        {/* 8. Developer Pricing Matrix */}
        <PricingSection />

        {/* 9. SRE & DevOps Testimonials */}
        <TestimonialsSection />

        {/* 10. Technical FAQ Accordion */}
        <FaqSection />

        {/* 11. Pre-Footer High-Impact CTA Banner */}
        <CtaBanner />
      </main>

      {/* Floating Centered Scroll Navigator (Top / FAQ) */}
      <LandingScrollNavigator />

      {/* Footer */}
      <LandingFooter />
    </div>
  );
};
