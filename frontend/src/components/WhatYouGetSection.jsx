import { Check } from "lucide-react";

const websiteFeatures = [
  "Mobile-optimized website",
  "Google Business Profile setup",
  "SEO-friendly pages",
  "Contact forms",
  "Service area pages",
  "Before/After gallery",
  "Testimonials section",
  "Click-to-call buttons",
];

const automationFeatures = [
  "Missed call text-back",
  "Automated follow-up sequences",
  "Review request automation",
  "Lead capture forms",
  "Appointment reminders",
  "Two-way texting",
  "Lead tracking dashboard",
  "Performance reports",
];

export default function WhatYouGetSection() {
  return (
    <section
      id="what-you-get"
      data-testid="what-you-get-section"
      className="section-spacing bg-neutral-offWhite"
    >
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-orange font-heading font-bold uppercase tracking-wider mb-3">
            What You Get
          </p>
          <h2 className="heading-lg text-navy mb-4">
            Everything You Need to Win More Jobs
          </h2>
          <p className="text-neutral-800/70 font-body text-lg max-w-2xl mx-auto">
            No fluff. No extras you don't need. Just the essentials to capture
            and convert more leads.
          </p>
        </div>

        {/* Two Column Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Website Essentials */}
          <div
            className="card-base p-8"
            data-testid="website-essentials-card"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-navy rounded-sm flex items-center justify-center">
                <span className="text-white font-heading font-bold text-xl">
                  W
                </span>
              </div>
              <h3 className="font-heading font-bold text-2xl text-navy">
                Website Essentials
              </h3>
            </div>

            <ul className="space-y-4">
              {websiteFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-success" />
                  </div>
                  <span className="text-neutral-800/80 font-body">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Lead Automation */}
          <div
            className="card-base p-8"
            data-testid="lead-automation-card"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-orange rounded-sm flex items-center justify-center">
                <span className="text-white font-heading font-bold text-xl">
                  A
                </span>
              </div>
              <h3 className="font-heading font-bold text-2xl text-navy">
                Lead Automation
              </h3>
            </div>

            <ul className="space-y-4">
              {automationFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-success" />
                  </div>
                  <span className="text-neutral-800/80 font-body">
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
