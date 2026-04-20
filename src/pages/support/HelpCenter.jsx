import FeaturePageHeader from "../../components/features/FeaturePageHeader";
import { usePublicContentList, useSettings } from "../../hooks/useCms";

const HelpCenter = () => {
  const { data: items = [] } = usePublicContentList("help-center");
  const { data: settings } = useSettings(true);
  const help = items[0];
  const contentLines = String(help?.content || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <section className="bg-theme-bg py-20 min-h-[60vh]">
      <div className="max-w-4xl mx-auto px-6">
        <FeaturePageHeader
          eyebrow={help?.eyebrow || "Support"}
          title="Help"
          highlight={help?.highlight || "Center"}
          description={help?.shortDescription || "Need assistance with a booking, itinerary, or payment? We are here to help."}
        />

        <div className="rounded-2xl border border-theme bg-theme-surface p-6 md:p-8 space-y-3 text-theme">
          {contentLines.length ? (
            contentLines.map((line) => <p key={line}>{line}</p>)
          ) : (
            <>
              <p>Email: {settings?.supportEmail || settings?.siteEmail || "support@northluxetravels.com"}</p>
              <p>Phone: {settings?.sitePhone || "+92 300 1234567"}</p>
              <p>Business Hours: {settings?.businessHours || "Monday to Saturday, 9:00 AM to 7:00 PM"}</p>
              <p>For urgent booking changes, contact us directly through the Contact page.</p>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default HelpCenter;
