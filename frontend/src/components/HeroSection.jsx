import { ArrowRight, Zap } from "lucide-react";
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
          {/* Live Status Indicator */}
          <div
            className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8"
            data-testid="live-status-indicator"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
            </span>
            <span className="text-white/90 font-body text-sm font-medium">
              Automation Active: Instant Text-Back Enabled
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
            className="text-xl md:text-2xl text-white/80 font-body font-normal mb-6 max-w-2xl leading-relaxed"
            data-testid="hero-subheadline"
          >
            I build simple websites and follow-up automation for Maryland
            contractors so you never lose a lead to a slow reply.
          </p>

          {/* Local Hook */}
          <p
            className="text-white/60 font-body text-base mb-10"
            data-testid="hero-local-hook"
          >
            Serving Bethesda, Rockville, Ellicott City, and surrounding areas.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={onGetAudit}
              className="btn-primary text-lg flex items-center justify-center gap-2 w-full sm:w-auto"
              data-testid="hero-cta-btn"
            >
              Get My Free 10-Min Audit
              <ArrowRight className="w-5 h-5" />
            </Button>

            <Button
              onClick={() => {
                const element = document.getElementById("how-it-works");
                element?.scrollIntoView({ behavior: "smooth" });
              }}
              className="btn-secondary border-white/30 text-white hover:bg-white hover:text-navy w-full sm:w-auto"
              data-testid="hero-secondary-btn"
            >
              See How It Works
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-white/10">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-orange" />
              <span className="text-white/80 font-body text-sm">
                Response in under 15 seconds
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-orange" />
              <span className="text-white/80 font-body text-sm">
                No contracts required
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-orange" />
              <span className="text-white/80 font-body text-sm">
                Live in 7 days
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
