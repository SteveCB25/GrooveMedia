import { PhoneMissed, MessageCircleOff, Globe, Star } from "lucide-react";

const leaks = [
  {
    icon: PhoneMissed,
    text: "Missed calls while you're on a job",
  },
  {
    icon: MessageCircleOff,
    text: "Slow text replies that lose the customer",
  },
  {
    icon: Globe,
    text: "An outdated website (or no website at all)",
  },
  {
    icon: Star,
    text: "Zero reviews to build trust",
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
        <div className="max-w-3xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-10">
            <p className="text-orange font-heading font-bold uppercase tracking-wider mb-3">
              The Leaky Bucket
            </p>
            <h2 className="heading-lg text-navy mb-6">
              You aren't losing jobs to competitors—you're losing them to slow follow-up.
            </h2>
            <p className="text-neutral-800/70 font-body text-lg">
              When a homeowner needs a quote, they call 3-5 contractors. The first one to respond usually gets the job. Here's where most contractors leak money:
            </p>
          </div>

          {/* Leak Points */}
          <div className="grid sm:grid-cols-2 gap-4">
            {leaks.map((leak, index) => (
              <div
                key={index}
                className="flex items-center gap-4 bg-white border border-gray-200 rounded-sm p-5 shadow-sm"
                data-testid={`leak-item-${index}`}
              >
                <div className="w-12 h-12 bg-red-50 rounded-sm flex items-center justify-center flex-shrink-0">
                  <leak.icon className="w-6 h-6 text-red-500" />
                </div>
                <p className="text-neutral-800 font-body font-medium">
                  {leak.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
