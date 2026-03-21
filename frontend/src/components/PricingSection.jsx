import { Check, Calculator, Zap } from "lucide-react";
import { Button } from "./ui/button";

const plans = [
  {
    name: "Starter",
    price: "$297",
    setup: "+ $500 one-time setup",
    description: "Everything you need to capture and respond to leads automatically.",
    popular: false,
    features: [
      "Missed call text-back (< 90 sec)",
      "Mobile-friendly contractor website",
      "Quote request form",
      "2-way SMS inbox",
      "Google Business Profile optimization",
      "Monthly performance report",
    ],
  },
  {
    name: "Growth",
    price: "$497",
    setup: "+ $500 one-time setup",
    description: "The full system. More leads, better reviews, more booked jobs.",
    popular: true,
    features: [
      "Everything in Starter",
      "Automated review requests",
      "5-touch lead nurture sequence",
      "Online booking widget",
      "Real-time lead dashboard",
      "Weekly GBP posts",
      "Competitor ranking reports",
    ],
  },
  {
    name: "Dominator",
    price: "$797",
    setup: "+ $997 one-time setup",
    description: "For contractors ready to own their market and scale fast.",
    popular: false,
    features: [
      "Everything in Growth",
      "Google & Meta Ads management",
      "Dedicated account manager",
      "Weekly strategy calls",
      "Priority support",
      "Full CRM + pipeline management",
    ],
  },
];

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
            No contracts. Cancel anytime.
          </h2>
          <p className="text-neutral-800/70 font-body text-lg max-w-xl mx-auto">
            Results in 30 days or your money back. We only work with one contractor per service area.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-sm flex flex-col ${
                plan.popular
                  ? "bg-navy border-2 border-orange shadow-xl scale-[1.02]"
                  : "bg-white border-2 border-neutral-200"
              }`}
              data-testid={`pricing-card-${plan.name.toLowerCase()}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-orange text-white font-heading font-bold text-xs uppercase tracking-wider px-4 py-1.5 rounded-full flex items-center gap-1">
                    <Zap className="w-3 h-3" /> Most Popular
                  </span>
                </div>
              )}

              <div className="p-7 flex flex-col flex-1">
                {/* Plan name */}
                <h3
                  className={`font-heading font-bold text-xl mb-1 ${
                    plan.popular ? "text-white" : "text-navy"
                  }`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`font-body text-sm mb-5 ${
                    plan.popular ? "text-white/70" : "text-neutral-800/60"
                  }`}
                >
                  {plan.description}
                </p>

                {/* Price */}
                <div className="mb-1">
                  <span
                    className={`font-heading font-extrabold text-4xl ${
                      plan.popular ? "text-orange" : "text-navy"
                    }`}
                  >
                    {plan.price}
                  </span>
                  <span
                    className={`font-body text-base ml-1 ${
                      plan.popular ? "text-white/60" : "text-neutral-800/50"
                    }`}
                  >
                    /mo
                  </span>
                </div>
                <p
                  className={`font-body text-xs mb-6 ${
                    plan.popular ? "text-white/50" : "text-neutral-800/40"
                  }`}
                >
                  {plan.setup}
                </p>

                {/* Features */}
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <div
                        className={`w-5 h-5 rounded-sm flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          plan.popular ? "bg-orange/30" : "bg-success/15"
                        }`}
                      >
                        <Check
                          className={`w-3 h-3 ${
                            plan.popular ? "text-orange" : "text-success"
                          }`}
                          strokeWidth={3}
                        />
                      </div>
                      <span
                        className={`font-body text-sm leading-snug ${
                          plan.popular ? "text-white/85" : "text-neutral-800/80"
                        }`}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={onGetStarted}
                  className={`w-full font-bold uppercase tracking-wider min-h-[48px] rounded-sm ${
                    plan.popular
                      ? "bg-orange hover:bg-orange-hover text-white shadow-lg"
                      : "bg-navy hover:bg-navy-dark text-white"
                  }`}
                  data-testid={`pricing-cta-${plan.name.toLowerCase()}`}
                >
                  Get Started
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* ROI Box */}
        <div
          className="bg-orange/10 border-2 border-orange/30 rounded-sm p-6 md:p-8 max-w-3xl mx-auto"
          data-testid="roi-box"
        >
          <div className="flex items-center gap-3 mb-6">
            <Calculator className="w-6 h-6 text-orange" />
            <h4 className="font-heading font-bold text-xl text-navy">
              Does it pay for itself?
            </h4>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <tbody className="font-body">
                <tr className="border-b border-orange/20">
                  <td className="py-3 text-neutral-800/70">Average HVAC job value</td>
                  <td className="py-3 text-navy font-bold text-right">$5,000+</td>
                </tr>
                <tr className="border-b border-orange/20">
                  <td className="py-3 text-neutral-800/70">Annual system cost (Growth plan)</td>
                  <td className="py-3 text-navy font-bold text-right">$6,464</td>
                </tr>
                <tr>
                  <td className="py-3 text-neutral-800/70">Jobs needed to break even</td>
                  <td className="py-3 text-success font-bold text-right text-lg">2 jobs</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-6 text-navy font-body font-medium text-center md:text-left">
            Most contractors recover the investment from <span className="text-orange font-bold">missed calls they were already losing.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
