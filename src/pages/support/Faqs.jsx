import FeaturePageHeader from "../../components/features/FeaturePageHeader";
import { usePublicContentList } from "../../hooks/useCms";

const faqs = [
  {
    q: "How do I confirm a booking?",
    a: "Choose a tour, submit details, and complete payment to confirm your reservation.",
  },
  {
    q: "Can I request a custom itinerary?",
    a: "Yes. Use the custom plan page and our team will prepare an itinerary based on your preferences.",
  },
  {
    q: "Do you support last-minute travel?",
    a: "Availability depends on destination and season. Contact support for urgent requests.",
  },
];

const Faqs = () => {
  const { data: backendFaqs = [] } = usePublicContentList("faq");
  const faqItems = backendFaqs.length
    ? backendFaqs.map((item) => ({
      q: item.question || item.title,
      a: item.answer || item.content || item.description,
    }))
    : faqs;

  return (
    <section className="bg-theme-bg py-20 min-h-[60vh]">
      <div className="max-w-4xl mx-auto px-6">
        <FeaturePageHeader
          eyebrow="Support"
          title="Frequently Asked"
          highlight="Questions"
          description="Quick answers to the most common questions from travelers."
        />

        <div className="space-y-4">
          {faqItems.map((item) => (
            <article key={item.q} className="rounded-2xl border border-theme bg-theme-surface p-5">
              <h2 className="font-bold text-theme">{item.q}</h2>
              <p className="text-sm text-muted mt-2">{item.a}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faqs;
