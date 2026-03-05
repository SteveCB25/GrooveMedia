import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

const faqs = [
  {
    question: "Do I need to sign a long-term contract?",
    answer:
      "No. All our plans are month-to-month. No contracts, no commitments. If you're not seeing results, you can cancel anytime with 30 days notice. We believe in earning your business every month.",
  },
  {
    question: "Do you run ads or is this just a website?",
    answer:
      "This is not an ad agency. We focus on capturing and converting the leads you're already getting (or missing). Think of us as the foundation that makes everything else work better. If you want to run ads later, your website and follow-up system will be ready.",
  },
  {
    question: "How long until I see results?",
    answer:
      "The text-back system works immediately. You'll capture missed calls from day one. SEO improvements typically take 30-90 days to show results. Most clients see meaningful improvements in lead capture within the first 2 weeks.",
  },
  {
    question: "Will this work for my specific trade?",
    answer:
      "Yes. Our system works for any home service contractor: roofers, landscapers, painters, HVAC techs, plumbers, electricians, and more. The principles of fast follow-up and professional web presence apply across all trades.",
  },
  {
    question: "What if I'm not tech-savvy?",
    answer:
      "That's exactly why we exist. We handle everything technical. You just answer your phone (or let our text-back do it). We'll train you on the simple dashboard in a 30-minute call, and we're always available for support.",
  },
  {
    question: "How is this different from other marketing companies?",
    answer:
      "We're not a marketing agency that manages dozens of services. We do one thing extremely well: help Maryland contractors capture and convert more leads. We're local, we understand the trades, and we're focused on results, not upsells.",
  },
];

export default function FAQSection() {
  return (
    <section
      id="faq"
      data-testid="faq-section"
      className="section-spacing bg-neutral-offWhite"
    >
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-orange font-heading font-bold uppercase tracking-wider mb-3">
            FAQ
          </p>
          <h2 className="heading-lg text-navy mb-4">
            Questions? We've Got Answers.
          </h2>
          <p className="text-neutral-800/70 font-body text-lg max-w-2xl mx-auto">
            Everything you need to know before getting started.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white border border-gray-200 rounded-sm shadow-sm px-6"
                data-testid={`faq-item-${index}`}
              >
                <AccordionTrigger className="text-left font-heading font-bold text-navy text-lg py-5 hover:no-underline hover:text-navy/80">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-neutral-800/70 font-body leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
