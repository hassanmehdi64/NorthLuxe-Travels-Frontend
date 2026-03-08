const HeroSection = () => {
  return (
    <section aria-label="About hero" className="relative isolate overflow-hidden bg-theme-text">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://www.travelertrails.com/wp-content/uploads/2022/11/Gilgit-Baltistan-4.jpg')",
        }}
      />
      <div aria-hidden="true" className="absolute inset-0 bg-black/45" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-[#071326]/90 via-[#071326]/60 to-[#071326]/20"
      />

      <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 py-14 sm:py-16 lg:py-20">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-3">
            <span className="h-px w-8 bg-[var(--c-brand)]" />
            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.34em] text-[var(--c-brand)]">
              About
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-white">
            Crafted Journeys in <span className="text-[var(--c-brand)]">Pakistan&apos;s North</span>
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-white/85 max-w-2xl leading-relaxed">
            We combine local knowledge, practical planning, and reliable on-ground support so every trip feels smooth, safe, and memorable.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
