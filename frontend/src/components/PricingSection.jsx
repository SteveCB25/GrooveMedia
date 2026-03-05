import { Calculator } from "lucide-react";
import { Button } from "./ui/button";

export default function PricingSection({ onGetStarted }) {
  return (
    <section
      id="pricing"
      data-testid="pricing-section"
      className="section-spacing bg-white"
    >
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-orange font-heading font-bold uppercase tracking-wider mb-3">
            Simple Pricing
          </p>
          <h2 className="heading-lg text-navy mb-4">
            One price. No games.
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Pricing Card */}
          <div
            className="bg-navy rounded-sm p-8 md:p-12 mb-8"
            data-testid="pricing-card"
          >
            <div className="flex flex-col items-center text-center gap-6 mb-8">
              <div>
                <h3 className="font-heading font-bold text-2xl text-white mb-2">
                  Complete Lead Capture System
                </h3>
                <p className="text-white/70 font-body">
                  Website + Automation + Lead Tracking
                </p>
              </div>
              <div>
                <div className="flex items-baseline gap-2 flex-wrap justify-center">
                  <span className="font-heading font-extrabold text-4xl md:text-5xl text-orange">
                    $500
                  </span>
                  <span className="text-white/70 font-body">setup</span>
                  <span className="text-white/50 font-body">+</span>
                  <span className="font-heading font-extrabold text-4xl md:text-5xl text-white">
                    $150
                  </span>
                  <span className="text-white/70 font-body">/month</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={onGetStarted}
                className="bg-orange hover:bg-orange-hover text-white font-bold uppercase tracking-wider shadow-lg hover:shadow-xl active:scale-95 transition-shadow text-lg px-10 min-h-[56px] rounded-sm"
                data-testid="pricing-cta"
              >
                Get Started
              </Button>
            </div>
          </div>

          {/* ROI Box */}
          <div
            className="bg-orange/10 border-2 border-orange/30 rounded-sm p-6 md:p-8"
            data-testid="roi-box"
          >
            <div className="flex items-center gap-3 mb-6">
              <Calculator className="w-6 h-6 text-orange" />
              <h4 className="font-heading font-bold text-xl text-navy">
                Does it pay for itself?
              </h4>
            </div>

            {/* ROI Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <tbody className="font-body">
                  <tr className="border-b border-orange/20">
                    <td className="py-3 text-neutral-800/70">Your average job value</td>
                    <td className="py-3 text-navy font-bold text-right">$5,000+</td>
                  </tr>
                  <tr className="border-b border-orange/20">
                    <td className="py-3 text-neutral-800/70">Annual system cost (first year)</td>
                    <td className="py-3 text-navy font-bold text-right">$2,300</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-neutral-800/70">Jobs needed to break even</td>
                    <td className="py-3 text-success font-bold text-right text-lg">1 job</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="mt-6 text-navy font-body font-medium text-center md:text-left">
              Most contractors only need <span className="text-orange font-bold">one extra job per year</span> for this system to pay for itself.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
