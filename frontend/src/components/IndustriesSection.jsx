import { 
  Hammer, 
  TreeDeciduous, 
  Home, 
  Scissors, 
  PaintBucket, 
  Wrench,
  Square,
  HardHat
} from "lucide-react";

const industries = [
  { icon: Hammer, name: "Deck Builders" },
  { icon: Wrench, name: "Fence Installers" },
  { icon: TreeDeciduous, name: "Landscapers" },
  { icon: Scissors, name: "Tree Removal" },
  { icon: PaintBucket, name: "Painters" },
  { icon: Home, name: "Roofers" },
  { icon: Square, name: "Flooring" },
  { icon: HardHat, name: "General Contracting" },
];

export default function IndustriesSection() {
  return (
    <section
      id="industries"
      data-testid="industries-section"
      className="section-spacing bg-navy"
    >
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-orange font-heading font-bold uppercase tracking-wider mb-3">
            Built For
          </p>
          <h2 className="heading-lg text-white mb-4">
            Outdoor service businesses that get real work done
          </h2>
        </div>

        {/* Industries Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {industries.map((industry, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-sm p-6 text-center hover:bg-white/10 transition-colors"
              data-testid={`industry-${index}`}
            >
              <industry.icon className="w-10 h-10 text-orange mx-auto mb-3" />
              <p className="text-white font-heading font-bold text-sm">
                {industry.name}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Note */}
        <p className="text-center text-white/60 font-body text-sm mt-8">
          And any contractor who's tired of losing jobs to slow follow-up.
        </p>
      </div>
    </section>
  );
}
