import FeaturePageHeader from "../../components/features/FeaturePageHeader";
import { usePublicContentList } from "../../hooks/useCms";

const Careers = () => {
  const { data: careers = [] } = usePublicContentList("career");
  const career = careers[0];

  return (
    <section className="bg-theme-bg py-20 min-h-[60vh]">
      <div className="max-w-4xl mx-auto px-6">
        <FeaturePageHeader
          eyebrow={career?.eyebrow || "Company"}
          title={career?.title?.split(" ").slice(0, 1).join(" ") || "Join"}
          highlight={career?.highlight || "Our Team"}
          description={career?.shortDescription || "We are building a travel company focused on thoughtful experiences and reliable execution."}
        />

        <div className="rounded-2xl border border-theme bg-theme-surface p-6 md:p-8 text-theme">
          <p className="leading-relaxed">
            {career?.content ||
              "We are always looking for people in operations, customer success, and travel planning. Share your profile and we will reach out when a suitable role opens."}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Careers;
