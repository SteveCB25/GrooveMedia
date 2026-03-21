import { Zap, Users, Star, TrendingUp } from "lucide-react";

const metrics = [
  {
    icon: Zap,
    value: "< 90s",
    label: "Text-Back Speed",
    description: "Average auto-response time",
  },
  {
    icon: Users,
    value: "3×",
    label: "More Leads Captured",
    description: "vs. no automation",
  },
  {
    icon: Star,
    value: "47%",
    label: "Review Request Rate",
    description: "Customers who leave a review",
  },
  {
    icon: TrendingUp,
    value: "Top 3",
    label: "Local Rankings",
    description: "Google Maps placement",
  },
];

const testimonials = [
  {
    quote:
      "We were losing at least 3–4 calls a week while my guys were on jobs. The text-back system alone booked us 6 new AC installs last month. That's over $40K we would have missed.",
    initials: "DK",
    name: "Dave K.",
    company: "Premier Air Solutions",
    location: "Columbia, MD",
  },
  {
    quote:
      "I was skeptical about another marketing service but this felt different. Within the first week we had 3 booked tune-ups come directly from the automated text. Setup was painless.",
    initials: "TR",
    name: "Tony R.",
    company: "BayState HVAC Services",
    location: "Annapolis, MD",
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
            Here's what Maryland contractors typically see within the first 90 days.
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

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-sm p-8"
              data-testid={`testimonial-${i}`}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {[...Array(5)].map((_, s) => (
                  <Star key={s} className="w-5 h-5 text-orange fill-orange" />
                ))}
              </div>

              <blockquote className="text-white/90 font-body text-base leading-relaxed mb-6 italic">
                "{t.quote}"
              </blockquote>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-orange font-heading font-bold text-base">
                    {t.initials}
                  </span>
                </div>
                <div>
                  <div className="font-heading font-bold text-white">{t.name}</div>
                  <div className="text-white/60 font-body text-sm">
                    {t.company} · {t.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Exclusivity note */}
        <p className="text-center text-white/50 font-body text-sm mt-10">
          We only work with <span className="text-orange font-semibold">one contractor per service area</span> in Maryland — so your leads stay yours.
        </p>
      </div>
    </section>
  );
}
