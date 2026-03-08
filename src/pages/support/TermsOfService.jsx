import FeaturePageHeader from "../../components/features/FeaturePageHeader";
import { usePublicContentList } from "../../hooks/useCms";

const TermsOfService = () => {
  const { data: items = [] } = usePublicContentList("terms-of-service");
  const terms = items[0];
  const contentLines = String(terms?.content || "")
    .split(". ")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => (line.endsWith(".") ? line : `${line}.`));

  return (
    <section className="bg-theme-bg py-20 min-h-[60vh]">
      <div className="max-w-4xl mx-auto px-6">
        <FeaturePageHeader
          eyebrow={terms?.eyebrow || "Legal"}
          title="Terms of"
          highlight={terms?.highlight || "Service"}
          description={terms?.shortDescription || "Key terms that apply to bookings and use of our services."}
        />

        <div className="rounded-2xl border border-theme bg-theme-surface p-6 md:p-8 space-y-4 text-theme">
          {contentLines.length ? (
            contentLines.map((line) => <p key={line}>{line}</p>)
          ) : (
            <>
              <p>Bookings are subject to destination-specific availability and supplier confirmation.</p>
              <p>Cancellation and refund terms vary by package and are shared before payment.</p>
              <p>Travelers are responsible for valid documents and compliance with local regulations.</p>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default TermsOfService;
