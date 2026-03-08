const ContactHero = () => {
  return (
    <section aria-label="Contact hero" className="relative isolate overflow-hidden bg-theme-text">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://gilgitbaltistan.gov.pk/public/images/river-5688258_1920.jpg')",
        }}
      />
      <div aria-hidden="true" className="absolute inset-0 bg-black/45" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-[#071326]/90 via-[#071326]/60 to-[#071326]/20"
      />

      <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 py-16 sm:py-20 lg:py-24 text-white">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-3">
            <span className="h-px w-8 bg-[var(--c-brand)]" />
            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.34em] text-[var(--c-brand)]">
              Contact
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
            Plan Your Trip With Confidence
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-white/85 max-w-2xl leading-relaxed">
            Send your travel requirements and our team will respond with clear guidance, itinerary options, and practical support.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactHero;
