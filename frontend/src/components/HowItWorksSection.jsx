import { Globe, MessageSquare, TrendingUp } from "lucide-react";

const steps = [
  {
    step: "1",
    icon: Globe,
    title: "Upgrade your website",
    description:
      "A modern site that actually works on a phone and captures quote requests. No fancy stuff—just what gets you jobs.",
  },
  {
    step: "2",
    icon: MessageSquare,
    title: "Capture every lead",
    description:
      "When a customer messages you, they get an instant text response so they stop calling other guys. You follow up when you're ready.",
  },
  {
    step: "3",
    icon: TrendingUp,
    title: "Track and win more jobs",
    description:
      "We organize your leads so you can follow up fast and get 5-star reviews automatically after every finished job.",
  },
];

export default function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      data-testid="how-it-works-section"
      className="section-spacing bg-white"
    >
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-orange font-heading font-bold uppercase tracking-wider mb-3">
            The 3-Step Solution
          </p>
          <h2 className="heading-lg text-navy mb-4">Simple. No Gimmicks.</h2>
        </div>

        {/* Steps */}
        <div className="max-w-4xl mx-auto space-y-6">
          {steps.map((item, index) => (
            <div
              key={index}
              className="flex gap-6 items-start bg-neutral-offWhite border border-gray-200 rounded-sm p-6 md:p-8"
              data-testid={`step-card-${index}`}
            >
              {/* Step Number */}
              <div className="w-14 h-14 bg-navy rounded-sm flex items-center justify-center flex-shrink-0">
                <span className="text-white font-heading font-bold text-2xl">
                  {item.step}
                </span>
              </div>

              {/* Content */}
              <div>
                <h3 className="font-heading font-bold text-xl md:text-2xl text-navy mb-2">
                  {item.title}
                </h3>
                <p className="text-neutral-800/70 font-body leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
