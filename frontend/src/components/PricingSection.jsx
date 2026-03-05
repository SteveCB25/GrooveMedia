import { Check, Star } from "lucide-react";
import { Button } from "./ui/button";

const plans = [
  {
    name: "Starter",
    price: "$1,500",
    period: "/mo",
    description: "Perfect for contractors just getting started online.",
    features: [
      "5-page website",
      "Mobile responsive",
      "Basic SEO setup",
      "Contact form",
      "Missed call text-back",
      "Monthly performance report",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Growth",
    price: "$2,500",
    period: "/mo",
    description: "For contractors ready to dominate their local market.",
    features: [
      "Everything in Starter, plus:",
      "10-page website",
      "Google Business optimization",
      "Review request automation",
      "Lead follow-up sequences",
      "Two-way texting",
      "Weekly performance calls",
    ],
    cta: "Get Started",
    popular: true,
  },
  {
    name: "Pro",
    price: "$3,500",
    period: "/mo",
    description: "Full-service lead generation for established contractors.",
    features: [
      "Everything in Growth, plus:",
      "Unlimited pages",
      "Custom landing pages",
      "Advanced automation flows",
      "Priority support",
      "Dedicated account manager",
      "Quarterly strategy sessions",
    ],
    cta: "Get Started",
    popular: false,
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
            Pricing
          </p>
          <h2 className="heading-lg text-navy mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-neutral-800/70 font-body text-lg max-w-2xl mx-auto">
            No hidden fees. No long-term contracts. Cancel anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative card-base p-8 flex flex-col ${
                plan.popular
                  ? "border-2 border-navy ring-4 ring-navy/10"
                  : "border border-gray-200"
              }`}
              data-testid={`pricing-card-${plan.name.toLowerCase()}`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 bg-orange text-white font-heading font-bold text-sm uppercase tracking-wider px-4 py-1.5 rounded-sm shadow-lg">
                    <Star className="w-4 h-4 fill-current" />
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="mb-6 pt-2">
                <h3 className="font-heading font-bold text-2xl text-navy mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="font-heading font-extrabold text-4xl text-navy">
                    {plan.price}
                  </span>
                  <span className="text-neutral-800/60 font-body">
                    {plan.period}
                  </span>
                </div>
                <p className="text-neutral-800/70 font-body text-sm mt-2">
                  {plan.description}
                </p>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-grow">
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-success" />
                    </div>
                    <span className="text-neutral-800/80 font-body text-sm">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Button
                onClick={onGetStarted}
                className={`w-full ${
                  plan.popular ? "btn-primary" : "btn-secondary"
                }`}
                data-testid={`pricing-cta-${plan.name.toLowerCase()}`}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        {/* Trust Note */}
        <p className="text-center text-neutral-800/60 font-body text-sm mt-8">
          All plans include a 14-day money-back guarantee. No questions asked.
        </p>
      </div>
    </section>
  );
}
