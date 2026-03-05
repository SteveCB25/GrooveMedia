import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

export default function HeroSection({ onGetAudit }) {
  return (
    <section
      id="hero"
      data-testid="hero-section"
      className="relative pt-28 pb-16 md:pt-36 md:pb-24 bg-navy overflow-hidden"
    >
      {/* Subtle noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="container-custom relative z-10">
        <div className="max-w-4xl">
          {/* Local Hook Badge */}
          <div
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8"
            data-testid="local-badge"
          >
            <span className="text-white/90 font-body text-sm font-medium">
              Serving Montgomery, Howard & Frederick Counties
            </span>
          </div>

          {/* Main Headline */}
          <h1
            className="heading-xl text-white mb-6"
            data-testid="hero-headline"
          >
            Turn missed calls into
            <br />
            <span className="text-orange">booked jobs.</span>
          </h1>

          {/* Subheadline */}
          <p
            className="text-xl md:text-2xl text-white/80 font-body font-normal mb-10 max-w-2xl leading-relaxed"
            data-testid="hero-subheadline"
          >
            Simple websites and automated responses designed for contractors and outdoor service businesses.
          </p>

          {/* CTA Button - Large and Tappable */}
          <Button
            onClick={onGetAudit}
            className="btn-primary text-lg flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 min-h-[56px]"
            data-testid="hero-cta-btn"
          >
            Get a Free Website Check
            <ArrowRight className="w-5 h-5" />
          </Button>

          {/* Quick Trust Points */}
          <div className="flex flex-wrap gap-6 mt-10 pt-8 border-t border-white/10">
            <span className="text-white/70 font-body text-sm">
              No contracts
            </span>
            <span className="text-white/30">•</span>
            <span className="text-white/70 font-body text-sm">
              Live in 7-14 days
            </span>
            <span className="text-white/30">•</span>
            <span className="text-white/70 font-body text-sm">
              You own your site
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
