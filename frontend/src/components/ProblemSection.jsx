import { PhoneMissed, Clock, Star } from "lucide-react";

const problems = [
  {
    icon: PhoneMissed,
    title: "Missed Calls = Lost Money",
    description:
      "Every call you miss while on a job goes to your competitor. The average contractor loses $15,000+ per year to missed calls.",
  },
  {
    icon: Clock,
    title: "Slow Quotes = Lost Jobs",
    description:
      "Homeowners contact 3-5 contractors. The first to respond gets the job 78% of the time. Can you respond in under 5 minutes?",
  },
  {
    icon: Star,
    title: "No Reviews = Low Visibility",
    description:
      "Google shows businesses with 4+ stars first. Without automated review requests, you're invisible to new customers.",
  },
];

export default function ProblemSection() {
  return (
    <section
      id="problem"
      data-testid="problem-section"
      className="section-spacing bg-neutral-offWhite"
    >
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-orange font-heading font-bold uppercase tracking-wider mb-3">
            The Problem
          </p>
          <h2 className="heading-lg text-navy mb-4">
            You're Losing Jobs While You Work
          </h2>
          <p className="text-neutral-800/70 font-body text-lg max-w-2xl mx-auto">
            Most Maryland contractors don't have time to answer every call or
            follow up on every lead. Here's what that costs you:
          </p>
        </div>

        {/* Problem Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="card-base p-8 group hover:border-navy/20 transition-all duration-200"
              data-testid={`problem-card-${index}`}
            >
              <div className="w-14 h-14 bg-orange/10 rounded-sm flex items-center justify-center mb-6 group-hover:bg-orange/20 transition-colors">
                <problem.icon className="w-7 h-7 text-orange" />
              </div>
              <h3 className="font-heading font-bold text-xl text-navy mb-3">
                {problem.title}
              </h3>
              <p className="text-neutral-800/70 font-body leading-relaxed">
                {problem.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
