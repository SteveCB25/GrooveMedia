import { Check } from "lucide-react";

const features = [
  "Modern, mobile-friendly website",
  "Quote request form",
  "Instant response automation",
  "Lead tracking system",
  "Automated review requests",
];

export default function WhatYouGetSection() {
  return (
    <section
      id="what-you-get"
      data-testid="what-you-get-section"
      className="section-spacing bg-neutral-offWhite"
    >
      <div className="container-custom">
        <div className="max-w-2xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-10">
            <p className="text-orange font-heading font-bold uppercase tracking-wider mb-3">
              What You Get
            </p>
            <h2 className="heading-lg text-navy mb-4">
              Everything included. No surprises.
            </h2>
          </div>

          {/* Checklist */}
          <div
            className="bg-white border-2 border-navy/10 rounded-sm p-8"
            data-testid="features-checklist"
          >
            <ul className="space-y-5">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-success rounded-sm flex items-center justify-center flex-shrink-0">
                    <Check className="w-5 h-5 text-white" strokeWidth={3} />
                  </div>
                  <span className="text-navy font-body font-medium text-lg">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
