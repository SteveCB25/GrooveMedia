import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

const faqs = [
  {
    question: "How long until I'm up and running?",
    answer:
      "7-14 days from start to finish. We build fast because we know you've got jobs to run.",
  },
  {
    question: "Do I own the website?",
    answer:
      "Yes. It's your site. If you ever leave, you take it with you. No hostage situations here.",
  },
  {
    question: "Is there a contract?",
    answer:
      "No contracts. Month-to-month. If it's not working for you, cancel anytime. We'd rather earn your business.",
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
        <div className="text-center mb-10">
          <p className="text-orange font-heading font-bold uppercase tracking-wider mb-3">
            FAQ
          </p>
          <h2 className="heading-lg text-navy mb-4">
            Common questions
          </h2>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-2xl mx-auto">
          <Accordion type="single" collapsible className="space-y-3">
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
