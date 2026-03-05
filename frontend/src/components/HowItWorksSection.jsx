import { Globe, MessageSquare, TrendingUp } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: Globe,
    title: "Upgrade Web Presence",
    description:
      "We build you a fast, mobile-friendly website that ranks on Google and converts visitors into leads. Simple, professional, effective.",
  },
  {
    step: "02",
    icon: MessageSquare,
    title: "Instant Text-Back",
    description:
      "When someone calls and you can't answer, they get an instant text: 'Hey, this is [Your Name]. I'm on a job but saw you called. How can I help?' Leads never go cold.",
  },
  {
    step: "03",
    icon: TrendingUp,
    title: "Track & Win",
    description:
      "See every lead, every call, every booked job in one dashboard. Know exactly what's working and where your next customer is coming from.",
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
        <div className="text-center mb-16">
          <p className="text-orange font-heading font-bold uppercase tracking-wider mb-3">
            The System
          </p>
          <h2 className="heading-lg text-navy mb-4">How It Works</h2>
          <p className="text-neutral-800/70 font-body text-lg max-w-2xl mx-auto">
            A simple 3-step system to capture, follow-up, and convert more leads
            while you focus on the work.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((item, index) => (
            <div
              key={index}
              className="relative"
              data-testid={`step-card-${index}`}
            >
              {/* Connector Line (hidden on mobile, shown on md+) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-neutral-200 -z-10" />
              )}

              <div className="flex flex-col items-center text-center">
                {/* Step Number Circle */}
                <div className="relative mb-6">
                  <div className="w-32 h-32 bg-navy rounded-sm flex items-center justify-center shadow-lg">
                    <item.icon className="w-12 h-12 text-white" />
                  </div>
                  <span className="absolute -top-3 -right-3 w-10 h-10 bg-orange text-white font-heading font-bold text-lg flex items-center justify-center rounded-sm shadow-md">
                    {item.step}
                  </span>
                </div>

                {/* Content */}
                <h3 className="font-heading font-bold text-2xl text-navy mb-3">
                  {item.title}
                </h3>
                <p className="text-neutral-800/70 font-body leading-relaxed max-w-xs">
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
