import { Zap, Users, Star, TrendingUp } from "lucide-react";

const metrics = [
  {
    icon: Zap,
    value: "< 15s",
    label: "Faster Response",
    description: "Average text-back time",
  },
  {
    icon: Users,
    value: "3x",
    label: "More Leads",
    description: "Lead capture increase",
  },
  {
    icon: Star,
    value: "47%",
    label: "More Reviews",
    description: "Review request success rate",
  },
  {
    icon: TrendingUp,
    value: "Top 3",
    label: "Better SEO",
    description: "Local search rankings",
  },
];

export default function ProofSection() {
  return (
    <section
      id="proof"
      data-testid="proof-section"
      className="section-spacing bg-navy"
    >
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-orange font-heading font-bold uppercase tracking-wider mb-3">
            Results
          </p>
          <h2 className="heading-lg text-white mb-4">
            Numbers Don't Lie
          </h2>
          <p className="text-white/70 font-body text-lg max-w-2xl mx-auto">
            Here's what our contractors typically see within the first 90 days.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="text-center p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-sm"
              data-testid={`metric-card-${index}`}
            >
              <div className="w-12 h-12 bg-orange/20 rounded-sm flex items-center justify-center mx-auto mb-4">
                <metric.icon className="w-6 h-6 text-orange" />
              </div>
              <div className="font-heading font-extrabold text-3xl md:text-4xl text-white mb-1">
                {metric.value}
              </div>
              <div className="font-heading font-bold text-base text-orange mb-1">
                {metric.label}
              </div>
              <div className="text-white/50 font-body text-sm">
                {metric.description}
              </div>
            </div>
          ))}
        </div>

        {/* Testimonial Placeholder */}
        <div
          className="max-w-3xl mx-auto bg-white/5 backdrop-blur-sm border border-white/10 rounded-sm p-8 md:p-12"
          data-testid="testimonial-placeholder"
        >
          <div className="text-center">
            <div className="flex justify-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-6 h-6 text-orange fill-orange"
                />
              ))}
            </div>
            <blockquote className="text-white/90 font-body text-lg md:text-xl leading-relaxed mb-6 italic">
              "Your testimonial will go here. Share how Groove Media helped
              transform your business, capture more leads, and book more jobs in
              the Maryland area."
            </blockquote>
            <div className="flex items-center justify-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-white font-heading font-bold text-xl">
                  JD
                </span>
              </div>
              <div className="text-left">
                <div className="font-heading font-bold text-white">
                  Your Name Here
                </div>
                <div className="text-white/60 font-body text-sm">
                  Your Business • Rockville, MD
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
