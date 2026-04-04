const BlogHero = () => {
  return (
    <section aria-label="Blog hero" className="relative isolate overflow-hidden bg-theme-text">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/www-travelpakistani-com/image/upload/v1670002655/Roundu_Valley_pakistan.jpg')",
        }}
      />
      <div aria-hidden="true" className="absolute inset-0 bg-black/45" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-[#071326]/90 via-[#071326]/60 to-[#071326]/20"
      />

      <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 py-12 sm:py-14 lg:py-16">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-3">
            <span className="h-px w-8 bg-[var(--c-brand)]" />
            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.34em] text-[var(--c-brand)]">
              Blog
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-tight text-white">
            Travel <span className="text-[var(--c-brand)]">Journal</span>
          </h1>
          <p className="text-sm sm:text-base text-white/85 max-w-2xl leading-relaxed">
            Stories, guides, and field insights for planning unforgettable journeys across
            Gilgit-Baltistan.
          </p>
        </div>
      </div>
    </section>
  );
};

export default BlogHero;
