import FeaturePageHeader from "../components/features/FeaturePageHeader";

const Guidelines = () => {
  return (
    <section className="bg-theme-bg py-20 min-h-[60vh]">
      <div className="max-w-4xl mx-auto px-6">
        <FeaturePageHeader
          eyebrow="Before You Travel"
          title="Booking"
          highlight="Guidelines"
          description="Quick guidance to make your planning and booking process smooth."
        />

        <div className="rounded-2xl border border-theme bg-theme-surface p-6 md:p-8 space-y-4 text-theme">
          <p>Keep your passport and visa details ready before confirming an international booking.</p>
          <p>Review inclusions, exclusions, and cancellation terms on each tour page.</p>
          <p>Share dietary, accessibility, or special requirements during checkout.</p>
          <p>For custom trips, submit your request early to get the best route and stay options.</p>
        </div>
      </div>
    </section>
  );
};

export default Guidelines;
